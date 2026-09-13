import { gameSettings, peripherals, pcComponents } from "../data/setup";

const TYPE_LABELS = {
  mouse: "souris",
  mousepad: "tapis",
  keyboard: "clavier",
  headset: "casque",
  monitor: "écran",
  sleeve: "sleeve",
  chair: "chaise",
  desk: "bureau",
  other: "autre",
};

const TYPE_ORDER = ["mouse", "mousepad", "keyboard", "headset", "monitor", "sleeve", "chair", "desk", "other"];

const DETAIL_LABELS = {
  mouse: { weight: "poids", switches: "switches", skates: "skates", skateType: "type de skate", gripTape: "grip tape" },
  mousepad: { surface: "surface", size: "taille", baseType: "base", editionNumber: "n° édition" },
  keyboard: {
    switches: "switches",
    keycaps: "keycaps",
    case: "case",
    pcb: "pcb",
    shareCode: "code de partage",
    profileLink: "lien profil",
  },
  headset: { eartips: "embouts", dacAmp: "dac / ampli" },
  monitor: {
    refreshRate: "fréquence",
    size: "taille",
    resolution: "résolution",
    panel: "dalle",
    dyac: "dyac",
    blackEqualizer: "black eQualizer",
    colorVibrance: "vibrance",
    lowBlueLight: "lumière bleue",
    pictureMode: "mode image",
    brightness: "luminosité",
    contrast: "contraste",
    sharpness: "netteté",
    gamma: "gamma",
    colorTemp: "température couleur",
    ama: "ama",
  },
  sleeve: { sleeveType: "type", size: "taille" },
  chair: {},
  desk: {},
  other: {},
};

function PeripheralCard({ item }) {
  const labels = DETAIL_LABELS[item.type] || {};
  const detailEntries = Object.entries(item.details || {}).filter(([, v]) => v);

  return (
    <div className="border border-border p-3">
      <p className="text-sm font-bold">
        {item.brand} {item.name}
      </p>
      {item.variant && <p className="text-xs text-muted">{item.variant}</p>}

      {detailEntries.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
          {detailEntries.map(([key, value]) => (
            <div key={key}>
              <dt className="text-muted">{labels[key] || key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {item.info && <p className="mt-2 text-xs">{item.info}</p>}
    </div>
  );
}

// Petit tableau générique clé/valeur — n'affiche que les lignes
// renseignées, et rien du tout si aucune ne l'est.
function KeyValueTable(rows) {
  const filled = rows.filter((r) => r.value !== "" && r.value != null);
  if (filled.length === 0) return null;
  return (
    <table className="mt-2 w-full text-sm">
      <tbody>
        {filled.map((r) => (
          <tr key={r.label} className="border-b border-border last:border-b-0">
            <td className="py-1.5 pr-4 text-muted">{r.label}</td>
            <td className="py-1.5">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GameSettingsBlock({ g }) {
  const cross = g.crosshair || {};
  const crossColor = cross.color || {};
  const hasCrossColor = crossColor.r != null || crossColor.g != null || crossColor.b != null;
  const view = g.viewmodel || {};
  const video = g.video || {};
  const hud = g.hud || {};

  return (
    <div className="mt-8">
      <p className="text-xs font-bold">{g.game}</p>

      {KeyValueTable([
        { label: "sensibilité", value: g.sensitivity },
        { label: "dpi", value: g.dpi },
        { label: "edpi", value: g.dpi && g.sensitivity ? Math.round(g.dpi * g.sensitivity) : null },
        { label: "polling rate", value: g.pollingRate ? `${g.pollingRate} hz` : null },
        { label: "zoom sensitivity", value: g.zoomSensitivity },
        { label: "windows sensitivity", value: g.windowsSensitivity },
        {
          label: "résolution",
          value: g.resolution?.width && g.resolution?.height ? `${g.resolution.width}×${g.resolution.height}` : null,
        },
        { label: "grip", value: g.gripStyle },
        { label: "longueur de main", value: g.handLength ? `${g.handLength} cm` : null },
      ])}

      {(cross.style || hasCrossColor || cross.shareCode) && (
        <div className="mt-4">
          <p className="text-xs text-muted">crosshair</p>
          {KeyValueTable([
            { label: "style", value: cross.style },
            { label: "couleur", value: hasCrossColor ? `${crossColor.r}, ${crossColor.g}, ${crossColor.b}` : null },
            { label: "longueur", value: cross.length },
            { label: "épaisseur", value: cross.thickness },
            { label: "gap", value: cross.gap },
            { label: "outline", value: cross.outline },
            { label: "follow recoil", value: cross.followRecoil },
            { label: "dot", value: cross.dot },
            { label: "t-style", value: cross.tStyle },
            { label: "sniper width", value: cross.sniperWidth },
            { label: "code de partage", value: cross.shareCode },
          ])}
        </div>
      )}

      {(view.fov || view.offsetX != null) && (
        <div className="mt-4">
          <p className="text-xs text-muted">viewmodel</p>
          {KeyValueTable([
            { label: "fov", value: view.fov },
            { label: "offset x", value: view.offsetX },
            { label: "offset y", value: view.offsetY },
            { label: "offset z", value: view.offsetZ },
            { label: "presetpos", value: view.presetpos },
          ])}
        </div>
      )}

      {Object.values(video).some((v) => v) && (
        <div className="mt-4">
          <p className="text-xs text-muted">vidéo</p>
          {KeyValueTable([
            { label: "aspect ratio", value: video.aspectRatio },
            { label: "scaling", value: video.scalingMode },
            { label: "affichage", value: video.displayMode },
            { label: "luminosité", value: video.brightness },
            { label: "fps max", value: video.maxFps },
            { label: "msaa", value: video.msaa },
            { label: "qualité des ombres", value: video.shadowQuality },
            { label: "détail textures", value: video.textureDetail },
            { label: "détail shaders", value: video.shaderDetail },
            { label: "détail particules", value: video.particleDetail },
            { label: "ambient occlusion", value: video.ambientOcclusion },
            { label: "v-sync", value: video.vsync },
            { label: "nvidia reflex", value: video.nvidiaReflex },
            { label: "g-sync", value: video.gsync },
            { label: "boost contraste", value: video.boostContrast },
          ])}
        </div>
      )}

      {Object.values(hud).some((v) => v) && (
        <div className="mt-4">
          <p className="text-xs text-muted">hud</p>
          {KeyValueTable([
            { label: "échelle", value: hud.scale },
            { label: "couleur", value: hud.color },
            { label: "radar centre le joueur", value: hud.radarCentersPlayer },
            { label: "radar tourne", value: hud.radarRotating },
            { label: "taille radar", value: hud.radarSize },
            { label: "zoom radar", value: hud.radarMapZoom },
          ])}
        </div>
      )}

      {(g.launchOptions || g.configLink) && (
        <div className="mt-4 text-xs">
          {g.launchOptions && (
            <p>
              <span className="text-muted">launch options — </span>
              <code>{g.launchOptions}</code>
            </p>
          )}
          {g.configLink && (
            <a href={g.configLink} target="_blank" rel="noreferrer" className="mt-1 inline-block underline">
              télécharger la config
            </a>
          )}
        </div>
      )}

      {(g.extra || []).some((e) => e.value) && (
        <div className="mt-4">
          {KeyValueTable((g.extra || []).map((e) => ({ label: e.label, value: e.value })))}
        </div>
      )}
    </div>
  );
}

export default function Setup() {
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    items: peripherals.filter((p) => p.type === type),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <h1 className="text-sm font-bold">Settings</h1>

      {gameSettings.map((g) => (
        <GameSettingsBlock key={g.game} g={g} />
      ))}

      {grouped.map((g) => (
        <div key={g.type} className="mt-8">
          <p className="text-xs text-muted">{TYPE_LABELS[g.type]}</p>
          <div className="mt-2 space-y-3">
            {g.items.map((item, i) => (
              <PeripheralCard key={i} item={item} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8">
        <p className="text-xs text-muted">config pc</p>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {pcComponents.map((c) => (
              <tr key={c.component} className="border-b border-border last:border-b-0">
                <td className="py-1.5 pr-4 text-muted">{c.component}</td>
                <td className="py-1.5">{c.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
