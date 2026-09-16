import { useEffect, useState } from "react";

// Récupère le profil Leetify (rating, aim, positioning, utility,
// clutch, opening...) d'une liste de steamId64, via la fonction
// serveur /.netlify/functions/leetify-profile.
//
// Ne fonctionne qu'une fois déployé sur Netlify (ou en local via
// `netlify dev`) — avec un simple `npm run dev`, cette route n'existe
// pas et le hook renvoie juste un objet vide, sans planter.
export function useLeetifyProfiles(steamIds) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const key = (steamIds || []).filter(Boolean).join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/.netlify/functions/leetify-profile?steamids=${key}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { profiles: data, loading };
}