import { useState } from "react";
import { rulebook } from "../data/rulebook";

export default function Rulebook() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <span>Règlement.pdf</span>
        <div className="pdf-zoom-controls">
          <button type="button" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
            −
          </button>
          <span className="pdf-toolbar-zoom">{zoom}%</span>
          <button type="button" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
            +
          </button>
        </div>
      </div>
      <div className="pdf-page-area">
        <div className="pdf-page" style={{ fontSize: `${zoom}%` }}>
          <h1>Règlement</h1>
          <p className="pdf-subtitle">format, elo, fair-play</p>

          {rulebook.map((section, idx) => (
            <div key={section.title} className="pdf-section">
              <h2>
                {idx + 1}. {section.title}
              </h2>
              {section.body.map((item, i) =>
                typeof item === "string" ? (
                  <p key={i}>{item}</p>
                ) : (
                  <ul key={i}>
                    {item.list.map((li, j) => (
                      <li key={j}>{li}</li>
                    ))}
                  </ul>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
