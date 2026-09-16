// ─────────────────────────────────────────────────────────────
// APPS DU BUREAU — chaque entrée devient une icône sur le bureau et une
// fenêtre qu'on peut ouvrir/déplacer/redimensionner/fermer. `component`
// est le composant React affiché dans le corps de la fenêtre.
//
// `props` (optionnel) est transmis tel quel au composant — sert par ex.
// à faire une app par jeu (CS2/LoL/Valorant) à partir du même composant
// GameApp, juste avec un `gameId` différent.
//
// `chrome` (optionnel) choisit l'habillage de la fenêtre :
//   "widget"  → pas de chrome du tout (ex. l'iPod)
//   "ie"      → façon Internet Explorer, onglet + barre d'adresse (Rédaction)
//   (absent)  → fenêtre 7.css classique (verre Aero)
// ─────────────────────────────────────────────────────────────

import Home from "../pages/Home";
import Rulebook from "../pages/Rulebook";
import GameApp from "../pages/GameApp";
import Playlist from "../pages/Playlist";
import Redaction from "../pages/Redaction";
import Calendar from "../pages/Calendar";
import { games } from "./games";

export const apps = [
  {
    id: "home",
    title: "Accueil",
    icon: "/icons/home.png",
    component: Home,
    width: 320,
    height: 270,
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
  ...games.map((g) => ({
    id: `game-${g.id}`,
    title: g.label,
    icon: g.icon,
    component: GameApp,
    props: { gameId: g.id },
    width: 600,
    height: 650,
    bgWatermark: true,
  })),
  {
    id: "playlist",
    title: "Playlist",
    icon: "/icons/playlist.png",
    component: Playlist,
    width: 360,
    height: 520,
    chrome: "widget",
    fixedSize: true,
  },
  {
    id: "redaction",
    title: "Rédaction",
    icon: "/icons/blog.png",
    component: Redaction,
    width: 1280,
    height: 700,
    chrome: "ie",
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