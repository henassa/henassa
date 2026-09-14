// ─────────────────────────────────────────────────────────────
// PROFILS — une ligne = une personne sur UN ladder d'UN jeu. Une même
// personne peut avoir 2 lignes (ladder mixte + ladder féminin) si elle
// joue les deux.
//
// `id` sert à faire le lien avec matches.js (champ `players`/`mvp`) —
// garde-le stable, sans espace.
//
// `ladder` : "mixte" | "feminin"
// ─────────────────────────────────────────────────────────────

export const players = [
  {
    id: "exemple",
    pseudo: "exemple",
    game: "cs2",
    ladder: "mixte",
    steamId: "",
    faceitNickname: "",
    elo: 1000,
    wins: 0,
    losses: 0,
    mvps: 0,
  },
];
