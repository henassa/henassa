import { useState } from "react";
import { Rnd } from "react-rnd";

export default function WindowFrame({
  app,
  position,
  size,
  zIndex,
  minimized,
  maximized,
  justOpened,
  closing,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
}) {
  const [nav, setNav] = useState({});

  const common = {
    style: { zIndex },
    position,
    size,
    bounds: "parent",
    disableDragging: maximized,
    enableResizing: !maximized && !app.fixedSize,
    onDragStart: onFocus,
    onDragStop: (e, d) => onMove({ x: d.x, y: d.y }),
    onResizeStart: onFocus,
    onResizeStop: (e, dir, ref, delta, pos) => {
      onResize({ width: ref.style.width, height: ref.style.height });
      onMove(pos);
    },
    onMouseDown: onFocus,
  };

  const winClass = [
    "win-anim",
    minimized ? "win-minimized" : "",
    justOpened ? "win-opening" : "",
    closing ? "win-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Widget — pas de chrome du tout, l'app se dessine elle-même
  // intégralement (ex. l'iPod). ────────────────────────────────
  if (app.chrome === "widget") {
    return (
      <Rnd
        {...common}
        minWidth={180}
        minHeight={260}
        dragHandleClassName="widget-drag"
        className={`widget-frame ${winClass}`}
      >
        <app.component onClose={onClose} {...app.props} />
      </Rnd>
    );
  }

  // ── Navigateur façon Internet Explorer — titre "… - Windows
  // Internet Explorer", onglet, barre d'adresse avec navigation. ──
  if (app.chrome === "ie") {
    return (
      <Rnd
        {...common}
        minWidth={320}
        minHeight={260}
        dragHandleClassName="ie-drag"
        className={`win window ie-win glass ${winClass}`}
      >
        <div className="title-bar ie-drag">
          <div className="title-bar-text">
            <img src={app.icon} alt="" width={14} height={14} style={{ marginRight: 4 }} />
            {nav.pageTitle || app.title} - Windows Internet Explorer
          </div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={onMinimize}></button>
            <button aria-label={maximized ? "Restore" : "Maximize"} onClick={onMaximize}></button>
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="ie-tabbar">
          <div className="ie-tab">
            <img src={app.icon} alt="" width={13} height={13} />
            <span>{nav.pageTitle || app.title}</span>
          </div>
        </div>
        <div className="ie-toolbar">
          <span
            className={"ie-nav-btn" + (!nav.canBack ? " ie-nav-btn-disabled" : "")}
            onClick={nav.canBack ? nav.onBack : undefined}
            title="Revenir au menu"
          >
            ◄
          </span>
          <div className="ie-address">
            <img src={app.icon} alt="" width={13} height={13} />
            <span>http://backfromthetraphouse.ps/{app.id}</span>
          </div>
          <span
            className={"ie-go-btn" + (!nav.canNext ? " ie-go-btn-disabled" : "")}
            onClick={nav.canNext ? nav.onNext : undefined}
            title="Article suivant"
          >
            ➜
          </span>
        </div>
        <div className="window-body ie-body">
          <app.component onNavReady={setNav} {...app.props} />
        </div>
      </Rnd>
    );
  }

  // ── Fenêtre classique (par défaut) — chrome Aero (7.css). ────────
  return (
    <Rnd
      {...common}
      minWidth={280}
      minHeight={200}
      dragHandleClassName="win-titlebar"
      className={`win window glass ${winClass}`}
    >
      <div className="title-bar win-titlebar">
        <div className="title-bar-text">
          <img src={app.icon} alt="" width={14} height={14} style={{ marginRight: 4 }} />
          {app.title}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={onMinimize}></button>
          {!app.fixedSize && (
            <button aria-label={maximized ? "Restore" : "Maximize"} onClick={onMaximize}></button>
          )}
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body">
        {app.bgWatermark && <img src={app.icon} alt="" className="window-bg-watermark" />}
        <div className="window-content">
          <app.component {...app.props} />
        </div>
      </div>
    </Rnd>
  );
}