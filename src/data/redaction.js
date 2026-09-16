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
      "On entend souvent dire d'un ton un peu condescendant que c'est un « film de propagande ». Mais c'est passer complètement à côté du truc. Soy Cuba ne cherche pas à enfumer son monde avec des discours théoriques ; il met juste la réalité des opprimés en pleine figure. C'est l'histoire en quatre temps de la terre qu'on vole, de la dignité qu'on essaie d'écraser, et de la révolte qui finit par exploser parce qu'il n'y a plus d'autre choix.",
      "Dès le début, le contraste est violent. On entend cette voix lire le journal de Christophe Colomb émerveillé par la beauté de l'île, et la seconde d'après, la caméra montre l'envers du décor. Et quelle claque. La caméra ne fait pas juste filmer : elle vole, elle s'infiltre dans les piscines et les cabarets où les touristes américains viennent consommer la pauvreté des Cubains comme si le pays était leur bordel privé. Puis elle descend direct dans la poussière. On voit le vieux paysan qui préfère cramer son propre champ de canne à sucre plutôt que de le laisser au propriétaire, les femmes qu'on exploite, et toute cette mécanique du fric qui transforme des vies humaines en marchandise.",
      "Le truc fou, c'est que la technique de malade n'est pas là pour faire joli. Elle est à 100 % au service des anonymes, des paysannes flouées, des étudiants que la police abat dans la rue. Le film montre que la résistance n'est pas un slogan sur un poster : c'est de la survie, une réponse vitale face au mépris du capital, du patriarcat et de l'impérialisme. Et il a au moins l'honnêteté de ne pas romancer la chose : une révolution, c'est sale, c'est violent, mais c'est ce qui arrive quand un peuple est poussé à bout.",
      "Revoir ce film aujourd'hui, ça fait un effet bizarre parce qu'on sait ce que l'Histoire a donné par la suite. Mais au-delà de ça, Soy Cuba rappelle un truc fondamental sur ce que veut dire le mot dignité. Face aux empires et à la marchandisation des lives, il montre que tant qu'un peuple refuse de s'écraser, son désir de liberté reste impossible à éteindre. C'est brut, c'est puissant, et c'est un film qui marque à vie.",
    ],
    images: ["/redaction/i-am-cuba-1.png", "/redaction/i-am-cuba-2.png"],
  },
];