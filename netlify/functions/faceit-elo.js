// netlify/functions/faceit-elo.js
//
// Récupère l'elo Faceit CS2 actuel pour une liste de steamId64, via la
// Faceit Data API. Là aussi, la clé API ne doit jamais être exposée
// côté client, d'où le passage par une fonction serveur.
//
// Variable d'environnement à configurer sur Netlify :
//   FACEIT_API_KEY — clé gratuite (Server-side API key), à créer sur
//   https://developers.faceit.com (crée une "app", section API keys).
//
// Appel : GET /.netlify/functions/faceit-elo?steamids=id1,id2,...
//
// Faceit ne permet pas de batcher plusieurs joueur·ses en un seul appel
// par steamId — on boucle, avec un cache 24h dans Netlify Blobs pour
// limiter les appels répétés à chaque chargement de page.

import { getBlobStore } from "./_lib/blobStore.js";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cache() {
  return getBlobStore("faceit-cache");
}

export const handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  const steamids = (event.queryStringParameters?.steamids || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (steamids.length === 0 || !process.env.FACEIT_API_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify({}) };
  }

  const result = {};

  for (const id of steamids) {
    const cached = await cache().get(id, { type: "json" });
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      result[id] = cached.data;
      continue;
    }

    try {
      const res = await fetch(
        `https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${id}`,
        { headers: { Authorization: `Bearer ${process.env.FACEIT_API_KEY}` } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const entry = {
        elo: data.games?.cs2?.faceit_elo ?? null,
        level: data.games?.cs2?.skill_level ?? null,
        nickname: data.nickname || null,
        faceitUrl: data.faceit_url ? data.faceit_url.replace("{lang}", "en") : null,
      };
      result[id] = entry;
      await cache().setJSON(id, { data: entry, cachedAt: Date.now() });
    } catch {
      // une chaîne échoue → on continue, pas d'erreur 500
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify(result) };
};