// ─────────────────────────────────────────────────────────────
// SERVEURS CS2 — affichés sur l'Accueil avec leur statut en direct.
//
// `battlemetricsId` : l'identifiant du serveur sur battlemetrics.com
// (cherche ton serveur sur https://www.battlemetrics.com/servers/cs2,
// l'ID est le nombre dans l'URL, ex. .../servers/cs2/1234567 → "1234567").
// Sans ça, le statut ne peut pas être vérifié automatiquement (aucune
// API publique gratuite ne permet d'interroger un serveur CS2 sans
// passer par un intermédiaire comme battlemetrics).
// ─────────────────────────────────────────────────────────────

export const cs2Servers = [
  { name: "Serveur #1 — high elo", battlemetricsId: "" },
  { name: "Serveur #2 — low elo", battlemetricsId: "" },
];
