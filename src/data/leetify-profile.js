// netlify/functions/leetify-profile.js
//
// Récupère le profil Leetify (rating global, aim, positioning, utility,
// clutch, opening...) pour une liste de steamId64, via la Leetify
// Public API. Même principe que faceit-elo.js : la clé API ne doit
// jamais être exposée côté client, d'où le passage par une fonction
// serveur, avec un cache 24h dans Netlify Blobs.
//
// Variable d'environnement à configurer sur Netlify :
//   LEETIFY_API_KEY — clé obtenue sur leetify.com/app/developer
//
// Appel : GET /.netlify/functions/leetify-profile?steamids=id1,id2,...

import { getBlobStore } from "./_lib/blobStore.js";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cache() {
  return getBlobStore("leetify-cache");
}

export const handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  const steamids = (event.queryStringParameters?.steamids || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (steamids.length === 0 || !process.env.LEETIFY_API_KEY) {
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
        `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${id}`,
        { headers: { _leetify_key: process.env.LEETIFY_API_KEY } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const entry = {
        rating: data.ranks?.leetify ?? null,
        premierRank: data.ranks?.premier ?? null,
        winrate: data.winrate ?? null,
        totalMatches: data.total_matches ?? null,
        aim: data.rating?.aim ?? null,
        positioning: data.rating?.positioning ?? null,
        utility: data.rating?.utility ?? null,
        clutch: data.rating?.clutch ?? null,
        opening: data.rating?.opening ?? null,
      };
      result[id] = entry;
      await cache().setJSON(id, { data: entry, cachedAt: Date.now() });
    } catch {
      // une chaîne échoue → on continue, pas d'erreur 500
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify(result) };
};