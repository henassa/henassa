// ─────────────────────────────────────────────────────────────
// MATCHS — un match par entrée. `team1.players`/`team2.players` et
// `mvp` référencent les `id` de players.js (pas les pseudos), pour que
// les clics sur un nom ouvrent bien le bon profil.
// ─────────────────────────────────────────────────────────────

export const matches = [
  {
    id: "exemple-match",
    game: "cs2",
    ladder: "mixte",
    date: "13/09/2026",
    map: "Mirage",
    team1: { name: "Team 1", players: ["exemple"], score: 13 },
    team2: { name: "Team 2", players: [], score: 7 },
    mvp: "exemple",
  },
];
