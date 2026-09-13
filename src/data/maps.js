// ─────────────────────────────────────────────────────────────
// CATALOGUE DE MAPS — utilisé par la page admin du veto pour choisir
// le pool, et par l'affichage du veto pour montrer l'image de chaque
// map.
//
// `type` :
//   "official" — dans le pool actif officiel
//   "retired"  — retirée de la rotation, gardée pour référence/events
//   "workshop" — map custom du workshop Steam
//
// `image` : chemin vers un fichier en résolution 1:1 (carré), à mettre
// dans public/maps/. `workshopUrl` : uniquement pour les maps workshop.
// ─────────────────────────────────────────────────────────────

export const maps = [
  { name: "Ancient", type: "official", image: "/maps/ancient.jpg", workshopUrl: null },
  { name: "Anubis", type: "official", image: "/maps/anubis.jpg", workshopUrl: null },
  { name: "Dust2", type: "official", image: "/maps/dust2.jpg", workshopUrl: null },
  { name: "Inferno", type: "official", image: "/maps/inferno.jpg", workshopUrl: null },
  { name: "Mirage", type: "official", image: "/maps/mirage.jpg", workshopUrl: null },
  { name: "Nuke", type: "official", image: "/maps/nuke.jpg", workshopUrl: null },
  { name: "Train", type: "official", image: "/maps/train.jpg", workshopUrl: null },

  { name: "Vertigo", type: "retired", image: "/maps/vertigo.jpg", workshopUrl: null },
  { name: "Overpass", type: "retired", image: "/maps/overpass.jpg", workshopUrl: null },

  // Exemple de map workshop — remplace par tes vraies maps custom.
  {
    name: "Exemple Workshop",
    type: "workshop",
    image: "/maps/exemple-workshop.jpg",
    workshopUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=0000000000",
  },
];
