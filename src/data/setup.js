// ─────────────────────────────────────────────────────────────
// SETUP — page façon prosettings.net / kovaaks.gg. Réglages par jeu
// (sensi, crosshair, viewmodel, vidéo...), liste de périphériques
// (autant que tu veux, détails propres à chaque type), et config PC.
// ─────────────────────────────────────────────────────────────

// Un objet par jeu où tu joues avec un réglage de sensibilité précis.
// Toutes les sous-sections (crosshair, viewmodel, video, hud) sont
// optionnelles — laisse un champ vide/null et il n'apparaît pas.
export const gameSettings = [
  {
    game: "CS2",
    sensitivity: "1.30",
    dpi: 800,
    pollingRate: 1000, // Hz
    zoomSensitivity: "1.1",
    windowsSensitivity: 6,
    resolution: { width: 1280, height: 960 },
    gripStyle: "Claw", // ex. "Palm", "Claw", "Fingertip"
    handLength: null, // cm

    crosshair: {
      style: "Classic Static",
      color: { r: 0, g: 255, b: 255, a: 255 }, // laisse null si couleur "par défaut" (verte etc.)
      length: 1,
      thickness: "1.5",
      gap: "-4",
      outline: "Non", // "Oui"/"Non" ou laisse vide
      followRecoil: "Non",
      dot: "Non",
      tStyle: "Non",
      sniperWidth: null,
      shareCode: "CSGO-VeUo2-qw76k-xJeKX-izb9a-GVOAK", // ex. "CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx"
    },
    viewmodel: {
      fov: 68,
      offsetX: 2.5,
      offsetY: 0,
      offsetZ: -1.5,
      presetpos: 2,
    },

    video: {
      aspectRatio: "4:3",
      scalingMode: "Stretched",
      displayMode: "Fullscreen",
      brightness: "130%",
      maxFps: 600,
      msaa: "8x MSAA", // ex. "8x MSAA"
      shadowQuality: "Élevé",
      textureDetail: "Faible",
      shaderDetail: "Faible",
      particleDetail: "Faible",
      ambientOcclusion: "Désactivé",
      vsync: "Désactivé",
      nvidiaReflex: "Activé + Boost",
      gsync: "Désactivé",
      boostContrast: "Activé",
    },

    hud: {
      scale: null,
      color: "",
      radarCentersPlayer: "",
      radarRotating: "",
      radarSize: null,
      radarMapZoom: null,
    },

    launchOptions: "", // ex. "-novid -tickrate 128"
    configLink: "", // lien vers un fichier .cfg à télécharger

    // Tout ce qui ne rentre nulle part ailleurs — libre.
    extra: [],
  },
];

// ─────────────────────────────────────────────────────────────
// PÉRIPHÉRIQUES — autant d'entrées que tu veux, `type` détermine quels
// champs de `details` s'affichent. Laisse une valeur vide ("" ou null)
// pour qu'elle n'apparaisse pas — pas besoin de tout remplir.
//
// `type` : "mouse" | "mousepad" | "keyboard" | "headset" | "monitor" |
//          "sleeve" | "chair" | "desk" | "other"
//
// `details` change selon le type :
//   mouse     : weight (g), switches, skates, skateType, gripTape
//   mousepad  : surface, size, baseType ("control"/"balanced"/"speed"),
//               editionNumber
//   keyboard  : switches, keycaps, case, pcb, shareCode, profileLink
//   headset   : eartips, dacAmp
//   monitor   : refreshRate (Hz), size (pouces), resolution, panel
//               ("IPS"/"TN"/"VA"/"OLED"), et des réglages d'image
//               propres au moniteur (surtout utile pour les écrans
//               BenQ/Zowie qui ont leurs propres profils) :
//               dyac, blackEqualizer, colorVibrance, lowBlueLight,
//               pictureMode, brightness, contrast, sharpness, gamma,
//               colorTemp, ama
//   sleeve    : sleeveType, size
//   chair     : (rien de spécifique, utilise `info`)
//   desk      : (rien de spécifique, utilise `info`)
//   other     : (rien de spécifique, utilise `info`)
// ─────────────────────────────────────────────────────────────

export const peripherals = [
  {
    type: "mouse",
    brand: "WLMOUSE",
    name: "Beast X Mini Pro (Side Slits)",
    variant: "Purple",
    info: "",
    details: { weight: "34", switches: "Kailh Optical V2", skates: "", skateType: "Dots", gripTape: "" },
  },
  {
    type: "mousepad",
    brand: "Steelseries",
    name: "QcK",
    variant: "",
    info: "",
    details: { surface: "Cloth", size: "450x400", baseType: "", editionNumber: "" },
  },
  {
    type: "keyboard",
    brand: "Wooting",
    name: "60HE v2",
    variant: "",
    info: "",
    details: { switches: "", keycaps: "", case: "Aluminium", pcb: "", shareCode: "", profileLink: "" },
  },
  {
    type: "headset",
    brand: "Beyerdynamic",
    name: "DT 770 Pro",
    variant: "",
    info: "",
    details: { eartips: "", dacAmp: "" },
  },
  {
    type: "monitor",
    brand: "BenQ Zowie",
    name: "XL2586X+",
    variant: "",
    info: "",
    details: {
      refreshRate: "600",
      size: "",
      resolution: "1920x1080",
      panel: "TN",
      dyac: "",
      blackEqualizer: "",
      colorVibrance: "",
      lowBlueLight: "",
      pictureMode: "",
      brightness: "",
      contrast: "",
      sharpness: "",
      gamma: "",
      colorTemp: "",
      ama: "",
    },
  },
  {
    type: "chair",
    brand: "Songmics",
    name: "Office",
    variant: "",
    info: "",
    details: {},
  },
  {
    type: "desk",
    brand: "Huzaro",
    name: "Hero 4.7",
    variant: "",
    info: "",
    details: {},
  },
];

// ─────────────────────────────────────────────────────────────
// CONFIG PC
// ─────────────────────────────────────────────────────────────

export const pcComponents = [
  { component: "CPU", name: "" },
  { component: "GPU", name: "" },
  { component: "RAM", name: "" },
  { component: "Stockage", name: "" },
  { component: "Carte mère", name: "" },
  { component: "Alimentation", name: "" },
  { component: "Boîtier", name: "" },
  { component: "Refroidissement", name: "" },
];
