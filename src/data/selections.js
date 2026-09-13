// ─────────────────────────────────────────────────────────────
// SÉLECTIONS — chaque entrée est soit une IMAGE (une capture de
// sélection que t'as déjà faite ailleurs), soit du TEXTE (des tiers
// avec une liste d'items, générés directement par le site).
//
// `id` sert dans l'URL (/selections/{id}) — garde-le court, sans espace.
//
// Pour une sélection IMAGE :
//   type: "image", image: "/selections/nom-du-fichier.png"
//   → mets le fichier dans le dossier public/selections/ du projet.
//
// Pour une sélection TEXTE :
//   type: "text", tiers: [ { tier: "S", items: [...] }, ... ]
//   → l'ordre des tiers dans le tableau = l'ordre d'affichage.
// ─────────────────────────────────────────────────────────────

export const selections = [
  {
    id: "exemple-texte",
    title: "EXEMPLE — SÉLECTION TEXTE",
    date: "08/09/2026",
    type: "text",
    description: "",
    tiers: [
      { tier: "S", items: ["Item exemple 1"] },
      { tier: "A", items: ["Item exemple 2", "Item exemple 3"] },
      { tier: "B", items: [] },
    ],
  },
  {
    id: "exemple-image",
    title: "EXEMPLE — SÉLECTION IMAGE",
    date: "08/09/2026",
    type: "image",
    description: "",
    image: "/selections/exemple.png",
  },
];