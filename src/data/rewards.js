// ─────────────────────────────────────────────────────────────
// RÉCOMPENSES — affichées en bas du ladder. Une entrée par palier
// (1er, 2e...), par jeu et par ladder (mixte/féminin).
//
// `image` : mets le fichier dans public/rewards/, référence-le ici.
// ─────────────────────────────────────────────────────────────

export const rewards = {
  cs2: {
    mixte: [
      {
        rank: "Première place",
        item: "★ Shadow Daggers | Dent de tigre",
        condition: "Neuf d'usine",
        image: "/skins/Shadow-Daggers-Tiger-Tooth-Factory-New.webp",
      },
      {
        rank: "Deuxième place",
        item: "M4A1-S | Vaporwave",
        condition: "Testée sur le terrain",
        image: "/skins/M4A1-S-Vaporwave-Field-Tested.webp",
      },
    ],
    feminin: [],
  },
};
