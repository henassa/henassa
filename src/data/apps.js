// ─────────────────────────────────────────────────────────────
// APPS DU BUREAU — chaque entrée devient une icône sur le bureau, une
// entrée dans le menu Start, et une fenêtre qu'on peut ouvrir/déplacer/
// redimensionner/fermer. `component` est le composant React affiché
// dans le corps de la fenêtre (import direct depuis src/pages/).
// ─────────────────────────────────────────────────────────────

import Home from "../pages/Home";
import Selections from "../pages/Selections";
import Customs from "../pages/Customs";
import Setup from "../pages/Setup";

export const apps = [
  {
    id: "home",
    title: "Accueil",
    icon: "https://win98icons.alexmeub.com/icons/png/msn3-4.png",
    component: Home,
    width: 480,
    height: 420,
  },
  {
    id: "selections",
    title: "Sélections",
    icon: "https://win98icons.alexmeub.com/icons/png/cd_music-3.png",
    component: Selections,
    width: 520,
    height: 480,
  },
  {
    id: "customs",
    title: "Customs CS2",
    icon: "https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png",
    component: Customs,
    width: 640,
    height: 460,
  },
  {
    id: "setup",
    title: "Settings",
    icon: "https://win98icons.alexmeub.com/icons/png/settings_gear-0.png",
    component: Setup,
    width: 520,
    height: 500,
  },
];

export function findApp(id) {
  return apps.find((a) => a.id === id) || null;
}
