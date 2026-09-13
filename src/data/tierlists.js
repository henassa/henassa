// ─────────────────────────────────────────────────────────────
// TIERLISTS — chaque entrée est soit une IMAGE (une capture de tierlist
// que t'as déjà faite ailleurs), soit du TEXTE (des tiers avec une liste
// d'items, générés directement par le site).
//
// `id` sert dans l'URL (/tierlists/{id}) — garde-le court, sans espace.
//
// Pour une tierlist IMAGE :
//   type: "image", image: "/tierlists/nom-du-fichier.png"
//   → mets le fichier dans le dossier public/tierlists/ du projet.
//
// Pour une tierlist TEXTE :
//   type: "text", tiers: [ { tier: "S", items: [...] }, ... ]
//   → l'ordre des tiers dans le tableau = l'ordre d'affichage.
// ─────────────────────────────────────────────────────────────

export const tierlists = [
  {
    id: "exemple-texte",
    title: "EXEMPLE — TIERLIST TEXTE",
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
    title: "EXEMPLE — TIERLIST IMAGE",
    date: "08/09/2026",
    type: "image",
    description: "",
    image: "/tierlists/exemple.png",
  },
];
