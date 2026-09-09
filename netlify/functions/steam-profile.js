// netlify/functions/steam-profile.js
//
// Récupère la nationalité (et le pseudo Steam actuel) pour une liste de
// steamId64, via l'API Steam officielle. Le navigateur ne peut pas
// appeler l'API Steam directement (pas de CORS, et la clé ne doit
// jamais être exposée côté client) — cette fonction fait le pont.
//
// Variable d'environnement à configurer sur Netlify :
//   STEAM_API_KEY — clé gratuite, à obtenir sur
//   https://steamcommunity.com/dev/apikey (connexion Steam requise).
//
// Appel : GET /.netlify/functions/steam-profile?steamids=id1,id2,...
//
// Résultats mis en cache 24h dans Netlify Blobs, pour ne pas re-solliciter
// l'API Steam à chaque chargement de la page stats par chaque visiteur.
// Notes :
//   - `loccountrycode` n'est renvoyé par Steam que si la personne a
//     renseigné son pays ET que son profil n'est pas privé — sinon on
//     n'a pas cette info, ce n'est pas un bug de la fonction.
//   - Sans clé configurée, la fonction répond avec un objet vide pour
//     chaque steamId plutôt que de planter la page.

import { getBlobStore } from "./_lib/blobStore.js";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cache() {
  return getBlobStore("steam-cache");
}

export const handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  const steamids = (event.queryStringParameters?.steamids || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (steamids.length === 0) {
    return { statusCode: 200, headers, body: JSON.stringify({}) };
  }

  if (!process.env.STEAM_API_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify({}) };
  }

  const result = {};
  const toFetch = [];

  for (const id of steamids) {
    const cached = await cache().get(id, { type: "json" });
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      result[id] = cached.data;
    } else {
      toFetch.push(id);
    }
  }

  // GetPlayerSummaries accepte jusqu'à 100 steamids par appel.
  for (let i = 0; i < toFetch.length; i += 100) {
    const batch = toFetch.slice(i, i + 100);
    try {
      const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${batch.join(",")}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      for (const p of data.response?.players || []) {
        const entry = {
          countryCode: p.loccountrycode || null,
          personaName: p.personaname || null,
        };
        result[p.steamid] = entry;
        await cache().setJSON(p.steamid, { data: entry, cachedAt: Date.now() });
      }
    } catch {
      // une chaîne échoue → on continue avec ce qu'on a, pas d'erreur 500
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify(result) };
};