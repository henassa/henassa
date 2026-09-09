// ─────────────────────────────────────────────────────────────
// SETUP — page façon kovaaks.xyz/kova.xyz. Tout ce qui concerne ta
// config : sensibilité et réglages par jeu, périphériques, composants PC.
// ─────────────────────────────────────────────────────────────

export const gameSettings = [
  {
    game: "CS2",
    settings: [
      { label: "Sensibilité", value: "" },
      { label: "eDPI", value: "" },
      { label: "DPI souris", value: "" },
      { label: "Résolution", value: "" },
      { label: "Aspect ratio", value: "" },
      { label: "Scaling", value: "" },
      { label: "Fréquence d'affichage", value: "" },
      { label: "Crosshair", value: "" },
      { label: "Viewmodel", value: "" },
    ],
  },
  {
    game: "Valorant",
    settings: [
      { label: "Sensibilité", value: "" },
      { label: "eDPI", value: "" },
      { label: "DPI souris", value: "" },
      { label: "Résolution", value: "" },
      { label: "Fréquence d'affichage", value: "" },
    ],
  },
];

export const peripherals = [
  { category: "Souris", name: "", detail: "" },
  { category: "Tapis de souris", name: "", detail: "" },
  { category: "Clavier", name: "", detail: "" },
  { category: "Écran", name: "", detail: "" },
  { category: "Casque", name: "", detail: "" },
  { category: "Micro", name: "", detail: "" },
];

export const pcComponents = [
  { component: "CPU", name: "" },
  { component: "GPU", name: "" },
  { component: "RAM", name: "" },
  { component: "Stockage", name: "" },
  { component: "Carte mère", name: "" },
];