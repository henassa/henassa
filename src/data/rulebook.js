// ─────────────────────────────────────────────────────────────
// RÈGLEMENT — le format "ladder FPL" : 2 divisions, elo individuel,
// pick par capitaine, saison avec cashprize.
//
// Chaque section = { title, body }. `body` est un tableau où chaque
// élément est soit une string (un paragraphe), soit un objet
// { list: [...] } pour une liste à puces. Modifie direct ce fichier,
// aucun code à toucher pour changer le texte affiché.
// ─────────────────────────────────────────────────────────────

export const rulebook = [
  {
    title: "Préambule",
    body: [
      "Cet espace se veut ouvert et sûr pour tout le monde, sans distinction de genre, d'orientation, d'origine, de handicap, de religion, de corpulence ou d'âge. On joue pour le plaisir de la compétition, pas pour tolérer qui que ce soit qui gâche ça pour les autres.",
      "Les pronoms et l'identité de chacun·e sont respectés sans discussion — se tromper une fois arrive, refuser de corriger ne passera pas.",
      "Si tu as un handicap, un trouble, ou juste un besoin d'aménagement particulier pour participer dans de bonnes conditions (accessibilité, rythme, communication), fais-le savoir à l'orga — on s'adapte au maximum plutôt que d'exclure.",
    ],
  },
  {
    title: "Format",
    body: [
      "Le format tourne autour d'un ladder individuel, pas d'inscription d'équipes à l'avance. Chaque soirée de pickup, les équipes sont formées sur place.",
      "Deux divisions, séparées par niveau :",
      {
        list: [
          "Division 1 — lvl 1 à 8 Faceit (ou rang équivalent selon le jeu, voir plus bas)",
          "Division 2 — lvl 9-10 Faceit (ou rang équivalent)",
        ],
      },
      "Une seule division tourne à la fois par soirée si le nombre de joueur·ses ne permet pas de remplir les deux serveurs — priorité donnée à la division avec le plus d'inscrit·es ce soir-là.",
    ],
  },
  {
    title: "Système ELO",
    body: [
      "Chaque joueur·se a un elo individuel, indépendant de son équipe du jour.",
      {
        list: [
          "Tout le monde démarre à 1000 points à la création de son profil.",
          "Victoire d'une map : +60.",
          "Défaite d'une map : -60.",
          "MVP de la map : +30 supplémentaires, calculé automatiquement d'après le rating de la map (pas de vote) — le plus haut rating HLTV 2.0 de la map gagne le bonus.",
        ],
      },
      "Ce système est volontairement simple pour démarrer. S'il dérive trop après quelques semaines (des elo qui explosent ou s'effondrent sans que ça reflète le niveau réel), on passera à un gain dégressif au-delà d'un certain nombre de maps jouées.",
    ],
  },
  {
    title: "Organisation d'une soirée",
    body: [
      "Maximum 2 serveurs en simultané, jamais plus — un pour chaque division. C'est un choix assumé : moins de matchs en même temps, mais des games plus propres, plus faciles à administrer, et un vrai côté exclusif/évènementiel.",
      {
        list: [
          "Horaire type : 20h–23h.",
          "Rythme flexible selon la dispo de l'équipe d'orga — ça peut être un soir par semaine, deux fois par mois, ou plus si y'a de la demande.",
          "Pas besoin d'un·e caster à chaque soirée pour que ça tourne.",
        ],
      },
    ],
  },
  {
    title: "Formation des équipes",
    body: [
      "Les équipes sont formées le soir même, via un bot Discord.",
      {
        list: [
          "Un·e capitaine est désigné·e par équipe (le plus souvent la personne avec le plus haut elo dispo ce soir-là, ou une personne identifiée comme fiable pour ce rôle).",
          "Le capitanat tourne d'une soirée à l'autre — pas toujours les mêmes personnes.",
          "Les capitaines pick leur équipe tour par tour, comme en fantasy league.",
        ],
      },
      "Ensuite, veto de map classique entre les deux capitaines (ban/pick en alternance) pour déterminer la map jouée. Chaque capitaine a un budget de temps total (pas un chrono fixe à chaque étape) qu'iel répartit comme iel veut sur ses picks/bans — en cas de dépassement, le choix restant est randomisé.",
    ],
  },
  {
    title: "Saison & cashprize",
    body: [
      "Le ladder tourne par saison de 3 mois. À la fin de la saison, classement final basé sur l'elo, et distribution des prix.",
      {
        list: [
          "Le prize pool peut être mixte : cash, skins, ou autre — pas obligé d'être 100% cash.",
          "Un volet artistique tourne en parallèle de la saison : les artistes de la communauté sont mis en avant avant les matchs et pendant les pauses.",
        ],
      },
    ],
  },
  {
    title: "Division féminine & non-binaire",
    body: [
      "Une division dédiée tourne en parallèle, avec son propre ladder et son propre prize pool — séparé du ladder mixte, pas un simple multiplicateur de points dessus.",
      "Ouverte aux femmes (cis et trans) et aux personnes non-binaires. On ne demande aucune justification ni preuve d'identité — l'auto-détermination suffit, point final.",
    ],
  },
  {
    title: "Fair-play & code de conduite",
    body: [
      "Le respect entre joueur·ses fait partie du jeu autant que le niveau CS lui-même. Trois principes simples :",
      {
        list: [
          "Traiter les autres comme tu voudrais être traité·e.",
          "Jouer honnêtement, s'investir, respecter le résultat.",
          "Respecter tout le monde — coéquipier·es, adversaires, orga.",
        ],
      },
      "Le trash talk, les vannes, et soutenir sa team ou son pays avec un peu de fougue, c'est normal et ça fait partie de la compétition — tant que ça reste bon enfant et que ça ne franchit pas la ligne vers l'attaque personnelle.",
      "Zero tolérance, sanction immédiate (ban permanent du ladder, pas de deuxième chance) :",
      {
        list: [
          "Propos racistes, homophobes, transphobes, sexistes, validistes, ou toute attaque sur qui quelqu'un est (identité de genre, orientation, origine, handicap, physique, religion...).",
          "Mégenrage délibéré et répété, une fois corrigé une première fois.",
          "Doxing (partager ou menacer de partager les infos perso de quelqu'un).",
          "Menaces, harcèlement, intimidation.",
          "Triche (cheat, exploit).",
        ],
      },
      "Pour tout le reste (une sortie un peu trop chaude après un round perdu, un clash qui dégénère sans tomber dans le zero-tolerance) : on regarde le contexte, pas juste les mots. Une escalade progressive plutôt qu'une sanction fixe :",
      {
        list: [
          "1er avertissement : rappel à l'ordre, pas de sanction.",
          "2e : exclusion de la soirée en cours.",
          "3e : suspension du ladder pour le reste de la saison.",
        ],
      },
      "Smurf et partage de compte : ban du ladder pour la saison en cours dès le premier cas avéré (pas d'escalade progressive là-dessus, ça fausse directement le classement de tout le monde). Pour limiter les risques en amont, un compte Steam avec un minimum d'ancienneté est demandé à l'inscription.",
    ],
  },
];
