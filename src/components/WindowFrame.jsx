import { Rnd } from "react-rnd";

export default function WindowFrame({
  app,
  position,
  size,
  zIndex,
  minimized,
  maximized,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
}) {
  return (
    <Rnd
      style={{ zIndex, display: minimized ? "none" : "flex" }}
      position={position}
      size={size}
      minWidth={280}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="win-titlebar"
      disableDragging={maximized}
      enableResizing={!maximized}
      onDragStart={onFocus}
      onDragStop={(e, d) => onMove({ x: d.x, y: d.y })}
      onResizeStart={onFocus}
      onResizeStop={(e, dir, ref, delta, pos) => {
        onResize({ width: ref.style.width, height: ref.style.height });
        onMove(pos);
      }}
      onMouseDown={onFocus}
      className="win window glass"
    >
      <div className="title-bar win-titlebar">
        <div className="title-bar-text">
          <img src={app.icon} alt="" width={14} height={14} style={{ marginRight: 4 }} />
          {app.title}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={onMinimize}></button>
          <button aria-label={maximized ? "Restore" : "Maximize"} onClick={onMaximize}></button>
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body">
        <app.component />
      </div>
    </Rnd>
  );
}
