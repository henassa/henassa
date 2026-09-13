import { useEffect, useState } from "react";
import { apps, findApp } from "../data/apps";
import WindowFrame from "./WindowFrame";
import { siteName } from "../data/config";

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

export default function Desktop() {
  const [windows, setWindows] = useState([]); // { appId, x, y, width, height, z, minimized }
  const [nextZ, setNextZ] = useState(10);
  const [startOpen, setStartOpen] = useState(false);

  function openApp(appId) {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId);
      if (existing) {
        return prev.map((w) =>
          w.appId === appId ? { ...w, minimized: false, z: nextZ } : w
        );
      }
      const app = findApp(appId);
      const offset = prev.length * 24;
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
        },
      ];
    });
    setNextZ((z) => z + 1);
    setStartOpen(false);
  }

  function closeWindow(appId) {
    setWindows((prev) => prev.filter((w) => w.appId !== appId));
  }

  function focusWindow(appId) {
    setNextZ((z) => {
      setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, z, minimized: false } : w)));
      return z + 1;
    });
  }

  function toggleMinimize(appId) {
    setWindows((prev) =>
      prev.map((w) => (w.appId === appId ? { ...w, minimized: !w.minimized } : w))
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
  }

  function moveWindow(appId, pos) {
    setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, ...pos } : w)));
  }

  function resizeWindow(appId, size) {
    setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, ...size } : w)));
  }

  return (
    <div id="desktop">
      <div id="desktop-area">
        <div id="desktop-icons">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              className="desktop-icon"
              onClick={() => openApp(app.id)}
            >
              <img src={app.icon} alt="" />
              <span>{app.title}</span>
            </button>
          ))}
        </div>

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
              onFocus={() => focusWindow(w.appId)}
              onClose={() => closeWindow(w.appId)}
              onMinimize={() => toggleMinimize(w.appId)}
              onMove={(pos) => moveWindow(w.appId, pos)}
              onResize={(size) => resizeWindow(w.appId, size)}
            />
          );
        })}

        {startOpen && (
          <div className="start-menu" onMouseLeave={() => setStartOpen(false)}>
            {apps.map((app) => (
              <button key={app.id} type="button" onClick={() => openApp(app.id)}>
                <img src={app.icon} alt="" />
                {app.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div id="taskbar">
        <button
          type="button"
          className="taskbar-start"
          onClick={() => setStartOpen((v) => !v)}
          aria-label={siteName}
        />
        <div className="taskbar-divider" />
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
                className={`tb-btn ${active ? "active" : ""}`}
                onClick={() => taskbarClick(w.appId)}
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
