// ─────────────────────────────────────────────────────────────
// PROFILS — une ligne = une personne sur UN ladder d'UN jeu. Une même
// personne peut avoir 2 lignes (ladder mixte + ladder féminin) si elle
// joue les deux.
//
// Ce fichier ne contient QUE l'identité (pseudo, steamId...) — l'elo,
// les victoires/défaites et les MVP de map sont calculés automatique-
// ment à partir de matches.js (voir src/lib/ladder.js), pas tapés ici
// à la main. Ajoute juste une ligne quand une nouvelle personne
// rejoint un ladder, le reste se met à jour tout seul dès qu'elle
// joue des matchs.
//
// `id` sert à faire le lien avec matches.js (champ `players`, `mvp`,
// et les clés de `playerStats`) — garde-le stable, sans espace.
//
// `ladder` : "mixte" | "feminin"
// ─────────────────────────────────────────────────────────────

export const players = [
  { id: "felixix", pseudo: "felixix", game: "cs2", ladder: "mixte", steamId: "76561198151064204" },
  { id: "lsr", pseudo: "LSR", game: "cs2", ladder: "mixte", steamId: "76561198149308963" },
  { id: "dj-billymoon", pseudo: "dj billymoon", game: "cs2", ladder: "mixte", steamId: "76561198118146069" },
  { id: "alua", pseudo: "ALUA", game: "cs2", ladder: "mixte", steamId: "76561198975050006" },
  { id: "kyrasobase", pseudo: "kyrasobasé", game: "cs2", ladder: "mixte", steamId: "76561199586455292" },
  { id: "zohraa", pseudo: "zohraa-", game: "cs2", ladder: "mixte", steamId: "76561198123365503" },
  { id: "sayga", pseudo: "sayga", game: "cs2", ladder: "mixte", steamId: "76561198025946650" },
  { id: "togrqm", pseudo: "Togrqm", game: "cs2", ladder: "mixte", steamId: "76561198143478066" },
  { id: "0x", pseudo: "0x", game: "cs2", ladder: "mixte", steamId: "76561198113356567" },
  { id: "phaayte", pseudo: "Phaayte", game: "cs2", ladder: "mixte", steamId: "76561198113791453" },
  { id: "sacha", pseudo: "sacha", game: "cs2", ladder: "mixte", steamId: "76561199090147744" },
];