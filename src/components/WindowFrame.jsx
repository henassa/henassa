import { Rnd } from "react-rnd";

export default function WindowFrame({
  app,
  position,
  size,
  zIndex,
  minimized,
  maximized,
  justOpened,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  onDragging,
  onDragEnd,
}) {
  const common = {
    style: { zIndex },
    position,
    size,
    bounds: "parent",
    disableDragging: maximized,
    enableResizing: !maximized && !app.fixedSize,
    onDragStart: onFocus,
    onDrag: (e, d) => onDragging && onDragging(d.x, d.y),
    onDragStop: (e, d) => onDragEnd(d.x, d.y),
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
        <app.component />
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
          <app.component />
        </div>
      </div>
    </Rnd>
  );
}
