// ─────────────────────────────────────────────────────────────
// RÈGLEMENT TRAPHOUSE
//
// Chaque section = { title, body }. `body` est un tableau où chaque
// élément est soit une string (un paragraphe), soit un objet
// { list: [...] } pour une liste à puces. 
// ─────────────────────────────────────────────────────────────

export const rulebook = [
  {
    title: "Préambule & Valeurs",
    body: [
      "TRAPHOUSE est un espace de gauche engagé (antifascisme, anticapitalisme, antipatriarcat, anticolonialisme). Notre but est de faire fleurir la scène esport et gaming à notre échelle pour les personnes marginalisées (genres, orientations, origines, handicaps, religions, âges...), et d'offrir un lieu safe là où la scène globale reste souvent fascisée ou apolitique.",
      "Nous souhaitons également apporter une direction artistique authentique, en collaborant avec des artistes du cinéma, de la musique ou d'autres milieux qui nous plaisent, et en les mettant en avant.",
      "Les pronoms et l'identité de chacun·e sont respectés sans discussion. L’autodétermination est une valeur capitale. Se tromper une fois arrive, mais refuser de corriger ou vouloir procéder à de l’assimilation ne passera pas."
    ],
  },
  {
    title: "Format Compétitif (CS2, LoL & VALORANT)",
    body: [
      "Le format s'inspire de la FPL : un ladder individuel sans inscription d'équipes à l'avance. Les équipes sont formées sur place chaque soir, basées sur l'équilibrage d'un Average ELO.",
      "Vous pouvez rejoindre en solo, duo ou trio, tant que l'équilibrage du match reste censé. Le véto des maps (CS2 / VALORANT) se fait par un sondage personnel avec ou sans débat entre les teammates.",
      "TRAPHOUSE propose trois divisions :",
      {
        list: [
          "Première division : Low ELO",
          "Deuxième division : High ELO",
          "Division exclusive : Joueuses et minorités de genre"
        ],
      },
      "Maximum deux parties tournent en simultané (une par division). La priorité est donnée aux divisions avec le plus d'inscrit·es ce soir-là, avec une dérogation de priorité pour la division féminine/minorités."
    ],
  },
  {
    title: "Division Féminine & Minorités de Genre",
    body: [
      "Cette division tourne avec son propre ladder et son propre prize pool, totalement séparée du ladder mixte (qui regroupe les divisions Low et High ELO).",
      "Elle est ouverte aux femmes et aux personnes non-binaires. Nous ne demandons aucune justification ni preuve d’identité : l’auto-détermination et la sincérité suffisent.",
      "Des canaux exclusifs sont également disponibles sur le Discord pour les filles et les minorités de genre qui souhaitent vocal ou jouer entre elles (accès sur demande)."
    ],
  },
  {
    title: "Système ELO & Saisons",
    body: [
      "Tout le monde commence à 1000 d'ELO. Le ladder tourne sur une saison définie de plusieurs mois avec, à la fin, un classement final et une éventuelle distribution de prize pool (cash ou skins).",
      "Gains et pertes pour les divisions High ELO et Féminine :",
      {
        list: [
          "Victoire : +60 ELO",
          "Défaite : -60 ELO",
          "MVP d'une map : +30 ELO",
          "Winstreak de + de 2 maps : +10 ELO"
        ],
      },
      "Gains et pertes pour la division Low ELO :",
      {
        list: [
          "Victoire : +40 ELO",
          "Défaite : -40 ELO",
          "MVP d'une map : +20 ELO",
          "Winstreak de + de 2 maps : +10 ELO"
        ],
      }
    ],
  },
  {
    title: "Organisation d'une Soirée",
    body: [
      "Les horaires types privilégient les fins de semaine en soirée (ex: 20h00 à 23h00) pour exécuter 3 parties par division. Le rythme reste flexible selon la disponibilité du staff (1 à 2 soirs par semaine).",
      "TRAPHOUSE compte créer du contenu autour de la compétition. Selon la disponibilité d’un·e casteureuse, vos matchs seront diffusés et commentés.",
      "Le volet artistique tourne en parallèle de la saison : nos artistes collaborateurs sont mis en avant dans un programme avant les matchs et pendant les pauses de diffusion."
    ],
  },
  {
    title: "Code de Conduite & Tolérance Zéro",
    body: [
      "Le respect fait partie du jeu. Traitez les autres comme vous souhaitez être traité·e, jouez honnêtement, respectez le résultat et l'ensemble des participant·es.",
      "Le trash talk et le banter sont OK si ça reste bon enfant, que ça ne franchit pas la ligne de l'attaque personnelle, et que tout le monde est d'accord sur le moment. Pas de vannes edgy, borderline, ni de contenu NSFW.",
      "Tolérance Zéro (exclusion immédiate) :",
      {
        list: [
          "Propos et comportements racistes, homophobes, transphobes, sexistes, validistes ou génocidaires.",
          "Les profils incels, sionistes et fachos.",
          "Mégenrage délibéré et répété.",
          "Menaces, harcèlement, intimidations et triche."
        ],
      },
      "S'il y a un dérapage lié à la frustration sans tomber dans la tolérance zéro, on discute entre adultes pour comprendre le contexte, on sensibilise et on privilégie la médiation. Évitez de transformer le serveur en garderie."
    ],
  },
  {
    title: "Règles Discord Complémentaires",
    body: [
      {
        list: [
          "Soyez cools et bienveillant·es.",
          "En cas de souci ou comportement problématique, venez le dire au staff.",
          "Pour inviter quelqu’un, passez d'abord par l'administration pour garder une bonne ambiance sélective.",
          "Ne faites pas de publicité publique ou massive pour le serveur ailleurs.",
          "Pour proposer un jeu ou une activité, n'hésitez pas, l'espace est à vous."
        ],
      }
    ],
  },
];