import { useEffect, useState } from "react";

// Statut d'un serveur de jeu via l'API publique de BattleMetrics — pas
// de clé ni de compte nécessaire pour lire un serveur déjà indexé.
// https://www.battlemetrics.com/developers/documentation
export function useServerStatus(battlemetricsId) {
  const [status, setStatus] = useState(null); // { online, players, maxPlayers } | null

  useEffect(() => {
    if (!battlemetricsId) return;

    let cancelled = false;
    fetch(`https://api.battlemetrics.com/servers/${battlemetricsId}`)
      .then((r) => r.json())
      .then((data) => {
        const attrs = data?.data?.attributes;
        if (!cancelled && attrs) {
          setStatus({
            online: attrs.status === "online",
            players: attrs.players,
            maxPlayers: attrs.maxPlayers,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setStatus({ online: false, players: null, maxPlayers: null, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [battlemetricsId]);

  return status;
}
