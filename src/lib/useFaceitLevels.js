import { useEffect, useState } from "react";

// Récupère le niveau Faceit (1-10) et l'elo d'une liste de steamId64,
// via la fonction serveur /.netlify/functions/faceit-elo (qui gère la
// clé API et le cache 24h côté Netlify Blobs).
//
// Ne fonctionne qu'une fois déployé sur Netlify (ou en local via
// `netlify dev`) — avec un simple `npm run dev`, cette route n'existe
// pas et le hook renvoie juste un objet vide, sans planter.
export function useFaceitLevels(steamIds) {
  const [data, setData] = useState({});
  const key = (steamIds || []).filter(Boolean).join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetch(`/.netlify/functions/faceit-elo?steamids=${key}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key]);

  return data; // { [steamId]: { elo, level, nickname, faceitUrl } }
}