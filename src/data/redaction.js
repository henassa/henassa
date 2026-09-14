// ─────────────────────────────────────────────────────────────
// RÉDACTION — articles, chroniques d'albums, reviews de match.
//
// `thumbnail` : image affichée dans la liste (mets le fichier dans
// public/redaction/, référence-le ici, ex. "/redaction/mon-image.jpg").
// Laisse vide si pas d'image.
//
// `images` : d'autres images affichées dans le corps de l'article
// (après le texte), un tableau de chemins comme `thumbnail`.
// ─────────────────────────────────────────────────────────────

export const posts = [
  {
    id: "exemple",
    title: "Exemple d'article",
    date: "13/09/2026",
    category: "édito",
    thumbnail: "",
    body: "Remplace ce texte par le contenu de l'article. Un seul gros bloc de texte, pas de mise en forme riche pour l'instant.",
    images: [],
  },
];
