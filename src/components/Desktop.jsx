import { useEffect, useRef, useState } from "react";
import { apps, findApp } from "../data/apps";
import { discordInviteUrl } from "../data/config";
import WindowFrame from "./WindowFrame";
import StreamerDock from "./StreamerDock";

function TrayClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="tray-clock">
      {now.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

// Seule "Accueil" est ouverte au chargement — les autres apps
// s'ouvrent en cliquant leur icône sur le bureau.
function initialWindows() {
  const home = apps.find((a) => a.id === "home");
  if (!home) return [];
  return [
    {
      appId: home.id,
      x: 40,
      y: 30,
      width: home.width,
      height: home.height,
      z: 10,
      minimized: false,
      maximized: false,
      prevRect: null,
    },
  ];
}

export default function Desktop() {
  const [windows, setWindows] = useState(initialWindows);
  const [nextZ, setNextZ] = useState(11);
  const [justOpenedId, setJustOpenedId] = useState(null);
  const [closingId, setClosingId] = useState(null);
  const [hoverPreview, setHoverPreview] = useState(null); // { appId, x }
  const tbRefs = useRef({});

  // La fenêtre "Accueil" ouverte par défaut a aussi droit à l'anim
  // d'ouverture au tout premier rendu.
  useEffect(() => {
    if (windows.length === 1) {
      setJustOpenedId(windows[0].appId);
      const t = setTimeout(() => setJustOpenedId(null), 220);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openApp(appId) {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId);
      if (existing) {
        return prev.map((w) => (w.appId === appId ? { ...w, minimized: false, z: nextZ } : w));
      }
      const app = findApp(appId);
      const offset = prev.length * 36;
      return [
        ...prev,
        {
          appId,
          x: 40 + offset,
          y: 30 + offset,
          width: app.width,
          height: app.height,
          z: nextZ,
          minimized: false,
          maximized: false,
          prevRect: null,
        },
      ];
    });
    setNextZ((z) => z + 1);
    setJustOpenedId(appId);
    setTimeout(() => setJustOpenedId((cur) => (cur === appId ? null : cur)), 220);
  }

  function closeWindow(appId) {
    setClosingId(appId);
    setTimeout(() => {
      setWindows((prev) => prev.filter((w) => w.appId !== appId));
      setClosingId((cur) => (cur === appId ? null : cur));
    }, 200);
  }

  function focusWindow(appId) {
    setNextZ((z) => {
      setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, z, minimized: false } : w)));
      return z + 1;
    });
  }

  function toggleMinimize(appId) {
    setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, minimized: !w.minimized } : w)));
  }

  function toggleMaximize(appId) {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.appId !== appId) return w;
        if (w.maximized) {
          return { ...w, maximized: false, ...w.prevRect, prevRect: null };
        }
        return {
          ...w,
          maximized: true,
          prevRect: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: "100%",
          height: "100%",
        };
      })
    );
  }

  function taskbarClick(appId) {
    const w = windows.find((w) => w.appId === appId);
    if (!w) return;
    if (w.minimized) {
      focusWindow(appId);
    } else {
      const maxZ = Math.max(...windows.map((w) => w.z));
      if (w.z === maxZ) {
        toggleMinimize(appId);
      } else {
        focusWindow(appId);
      }
    }
    setHoverPreview(null);
  }

  function moveWindow(appId, pos) {
    setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, ...pos } : w)));
  }

  function resizeWindow(appId, size) {
    setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, ...size } : w)));
  }

  // ── Aperçu au survol de la taskbar ──────────────────────────────
  function showPreview(appId) {
    const btn = tbRefs.current[appId];
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setHoverPreview({ appId, x: r.left + r.width / 2 });
  }

  return (
    <div id="desktop">
      <div id="desktop-area">
        <div id="desktop-icons">
          {apps.map((app) => (
            <button key={app.id} type="button" className="desktop-icon" onClick={() => openApp(app.id)}>
              <img src={app.icon} alt="" />
              <span>{app.title}</span>
            </button>
          ))}
          <button
            type="button"
            className="desktop-icon"
            onClick={() => window.open(discordInviteUrl, "_blank")}
          >
            <img src="/icons/discord.png" alt="" />
            <span>Discord</span>
          </button>
        </div>

        <StreamerDock />

        {windows.map((w) => {
          const app = findApp(w.appId);
          if (!app) return null;
          return (
            <WindowFrame
              key={w.appId}
              app={app}
              position={{ x: w.x, y: w.y }}
              size={{ width: w.width, height: w.height }}
              zIndex={w.z}
              minimized={w.minimized}
              maximized={w.maximized}
              justOpened={justOpenedId === w.appId}
              closing={closingId === w.appId}
              onFocus={() => focusWindow(w.appId)}
              onClose={() => closeWindow(w.appId)}
              onMinimize={() => toggleMinimize(w.appId)}
              onMaximize={() => toggleMaximize(w.appId)}
              onMove={(pos) => moveWindow(w.appId, pos)}
              onResize={(size) => resizeWindow(w.appId, size)}
            />
          );
        })}
      </div>

      {hoverPreview &&
        (() => {
          const w = windows.find((win) => win.appId === hoverPreview.appId);
          const app = findApp(hoverPreview.appId);
          if (!w || !app || w.minimized) return null;
          return (
            <div
              className="taskbar-preview"
              style={{ left: hoverPreview.x }}
              onMouseEnter={() => showPreview(hoverPreview.appId)}
              onMouseLeave={() => setHoverPreview(null)}
              onClick={() => taskbarClick(hoverPreview.appId)}
            >
              <div className="taskbar-preview-title">
                <img src={app.icon} alt="" width={12} height={12} />
                {app.title}
              </div>
              <div className="taskbar-preview-stage">
                <div className="taskbar-preview-inner">
                  <app.component {...app.props} />
                </div>
              </div>
            </div>
          );
        })()}

      <div id="taskbar">
        <div id="taskbar-buttons">
          {windows.map((w) => {
            const app = findApp(w.appId);
            if (!app) return null;
            const maxZ = Math.max(...windows.map((x) => x.z));
            const active = !w.minimized && w.z === maxZ;
            return (
              <button
                key={w.appId}
                type="button"
                ref={(el) => (tbRefs.current[w.appId] = el)}
                className={`tb-btn ${active ? "active" : ""}`}
                onClick={() => taskbarClick(w.appId)}
                onMouseEnter={() => showPreview(w.appId)}
                onMouseLeave={() => setHoverPreview((cur) => (cur?.appId === w.appId ? null : cur))}
                title={app.title}
              >
                <img src={app.icon} alt="" />
              </button>
            );
          })}
        </div>
        <div className="taskbar-tray">
          <TrayClock />
        </div>
      </div>
    </div>
  );
}