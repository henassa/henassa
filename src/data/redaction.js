// ─────────────────────────────────────────────────────────────
// RÉDACTION — articles, chroniques d'albums, reviews de match.
//
// `thumbnail` : image affichée dans la liste (mets le fichier dans
// public/redaction/, référence-le ici, ex. "/redaction/mon-image.jpg").
// Laisse vide si pas d'image.
//
// `body` : un TABLEAU de paragraphes (une string = un paragraphe).
// Le premier paragraphe est mis en avant un peu plus grand (esprit
// "chapô" éditorial). Découpe ton texte aux endroits qui te semblent
// naturels, un élément du tableau = un bloc de texte séparé.
//
// `images` : d'autres images affichées après le texte, en galerie
// (un tableau de chemins comme `thumbnail`). Laisse vide si aucune.
// ─────────────────────────────────────────────────────────────

export const posts = [
  {
    id: "i-am-cuba",
    title: "I Am Cuba",
    date: "16/09/2026",
    thumbnail: "/redaction/i-am-cuba-cover.png",
    body: [
      "On entend souvent dire d'un ton un peu condescendant qu'il s'agit d'un « film de propagande ». Mais c'est passer complètement à côté de sa force. I Am Cuba ne cherche pas à nous tromper avec des discours abstraits ; il fait vibrer une poésie humaine universelle. Il montre comment l'oppression finit toujours par faire germer la révolte, comment la beauté d'un peuple résiste même quand tout est fait pour l'étouffer.",
      "Le film démarre sur une citation de Christophe Colomb vantant la beauté de l'île, mais la caméra s'empresse de nous montrer l'envers du décor. Et quelle claque. Cette caméra ne se contente pas de filmer ; elle vole, elle s'infiltre, elle plonge dans les piscines des nantis avant d'aller ramper dans la poussière aux côtés des paysans expropriés. Elle saisit avec une virtuosité folle la beauté des paysages, mais surtout la tragédie d'un peuple dont la terre et la dignité ont été bradées au plus offrant.",
      "La mise en scène est d'une fluidité presque magique, entièrement mise au service des anonymes, des oubliés, de ceux qui souffrent en silence.",
      "Revoir ce chef-d'œuvre oublié puis ressuscité rappelle que la mémoire des luttes ne disparaît jamais vraiment. C'est un film qui redonne du sens au mot dignité. Il nous rappelle que face aux empires, aux cynismes modernes et à la marchandisation de nos vies, le cœur d'un peuple qui refuse d'être soumis reste la plus grande puissance qui soit. C'est sublime.",
    ],
    images: ["/redaction/i-am-cuba-1.png", "/redaction/i-am-cuba-2.png"],
  },
];