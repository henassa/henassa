import { Rnd } from "react-rnd";

export default function WindowFrame({
  app,
  position,
  size,
  zIndex,
  minimized,
  onFocus,
  onClose,
  onMinimize,
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
      onDragStart={onFocus}
      onDragStop={(e, d) => onMove({ x: d.x, y: d.y })}
      onResizeStart={onFocus}
      onResizeStop={(e, dir, ref, delta, pos) => {
        onResize({ width: ref.style.width, height: ref.style.height });
        onMove(pos);
      }}
      onMouseDown={onFocus}
      className="win glass flex flex-col overflow-hidden"
    >
      <div className="title-bar win-titlebar">
        <div className="title-bar-text flex items-center gap-1.5">
          <img src={app.icon} alt="" className="h-3.5 w-3.5" />
          {app.title}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={onMinimize}></button>
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body flex-1 overflow-y-auto p-3 text-sm">
        <app.component />
      </div>
    </Rnd>
  );
}
