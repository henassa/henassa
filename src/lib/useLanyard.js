import { useEffect, useRef, useState } from "react";

// Statut Discord + Spotify en direct via le WebSocket public de Lanyard
// (https://api.lanyard.rest) — vrai push temps réel, pas du polling.
// Il faut que la personne ait rejoint le serveur Discord de Lanyard une
// fois pour que son statut soit suivi : https://discord.gg/lanyard
export function useLanyard(discordId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const hbRef = useRef(null);

  useEffect(() => {
    if (!discordId) return;
    let cancelled = false;
    let ws = null;
    let reconnectTimer = null;

    function connect() {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.op === 1) {
            // Hello — démarre le heartbeat puis s'abonne à cet utilisateur.
            hbRef.current = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, msg.d.heartbeat_interval);
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));
          } else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
            if (!cancelled) {
              setData(msg.d);
              setError(null);
            }
          }
        } catch {
          // frame malformée, on ignore
        }
      };

      ws.onclose = () => {
        clearInterval(hbRef.current);
        if (!cancelled) reconnectTimer = setTimeout(connect, 5000);
      };
      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      cancelled = true;
      clearInterval(hbRef.current);
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [discordId]);

  return { data, error };
}
