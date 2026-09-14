import { partnerStreamers } from "../data/streamers";

// Pas d'URL d'avatar Twitch fiable sans passer par l'API Twitch (donc
// une clé + une fonction serveur, comme pour le veto en son temps) —
// pour l'instant on affiche juste l'initiale du pseudo dans un rond.
// Si un jour tu veux les vraies pochettes de profil, dis-le, on
// rebranche une fonction Netlify dessus comme pour Faceit.
export default function StreamerDock() {
  if (partnerStreamers.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 1,
      }}
    >
      {partnerStreamers.map((s) => (
        <button
          key={s.twitch}
          type="button"
          onClick={() => window.open(`https://twitch.tv/${s.twitch}`, "_blank")}
          title={s.pseudo}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "2px solid #9146ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            cursor: "pointer",
            background: "#0e0e1a",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}
        >
          {s.pseudo?.[0]?.toUpperCase() || "?"}
        </button>
      ))}
    </div>
  );
}
