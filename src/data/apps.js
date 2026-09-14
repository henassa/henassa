// ─────────────────────────────────────────────────────────────
// APPS DU BUREAU — chaque entrée devient une icône sur le bureau et une
// fenêtre qu'on peut ouvrir/déplacer/redimensionner/fermer. `component`
// est le composant React affiché dans le corps de la fenêtre.
//
// `chrome` (optionnel) choisit l'habillage de la fenêtre :
//   "widget"  → pas de chrome du tout (ex. l'iPod)
//   (absent)  → fenêtre 7.css classique (verre Aero)
// ─────────────────────────────────────────────────────────────

import Home from "../pages/Home";
import Rulebook from "../pages/Rulebook";
import Competition from "../pages/Competition";
import Playlist from "../pages/Playlist";
import Redaction from "../pages/Redaction";
import Calendar from "../pages/Calendar";

export const apps = [
  {
    id: "home",
    title: "Accueil",
    icon: "/icons/home.png",
    component: Home,
    width: 320,
    height: 440,
    fixedSize: true,
  },
  {
    id: "rulebook",
    title: "Règlement",
    icon: "/icons/rulebook.png",
    component: Rulebook,
    width: 480,
    height: 520,
  },
  {
    id: "competition",
    title: "Compétition",
    icon: "/icons/competition.png",
    component: Competition,
    width: 600,
    height: 460,
    bgWatermark: true,
  },
  {
    id: "playlist",
    title: "Playlist",
    icon: "/icons/playlist.png",
    component: Playlist,
    width: 360,
    height: 520,
    chrome: "widget",
  },
  {
    id: "redaction",
    title: "Rédaction",
    icon: "/icons/blog.png",
    component: Redaction,
    width: 500,
    height: 480,
    bgWatermark: true,
  },
  {
    id: "calendar",
    title: "Calendrier",
    icon: "/icons/calendar.png",
    component: Calendar,
    width: 480,
    height: 320,
    bgWatermark: true,
  },
];

export function findApp(id) {
  return apps.find((a) => a.id === id) || null;
}
