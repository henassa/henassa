import { useState } from "react";
import { artisticProgram } from "../data/artisticProgram";

export default function ArtisticProgram() {
  const entries = artisticProgram.filter((e) => e.artist);
  const [selected, setSelected] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  const current = entries[selected];

  function move(delta) {
    if (entries.length === 0) return;
    setSelected((i) => (i + delta + entries.length) % entries.length);
    setShowDetail(false);
  }

  function pressOk() {
    if (!current) return;
    if (showDetail && current.link) {
      window.open(current.link, "_blank");
    } else {
      setShowDetail(true);
    }
  }

  function pressBack() {
    setShowDetail(false);
  }

  return (
    <div className="nokia-widget">
      <div className="widget-drag" />
      <div className="nokia">
        <div className="nokia-earpiece" />
        <div className="nokia-screen">
          <div className="nokia-statusbar">
            <span>NOKIA</span>
            <span className="nokia-signal">▂▄▆█</span>
          </div>
          <div className="nokia-lcd">
            {entries.length === 0 && <p className="nokia-empty">liste vide</p>}

            {!showDetail &&
              entries.map((e, i) => (
                <div key={i} className={"nokia-row" + (i === selected ? " selected" : "")}>
                  {e.artist}
                  {e.type ? ` (${e.type})` : ""}
                </div>
              ))}

            {showDetail && current && (
              <div className="nokia-detail">
                <div className="nokia-detail-title">{current.artist}</div>
                <div className="nokia-detail-meta">
                  [{current.date}]{current.type ? ` — ${current.type}` : ""}
                </div>
                {current.description && <div className="nokia-detail-desc">{current.description}</div>}
                {current.link && <div className="nokia-detail-hint">OK → ouvrir le lien</div>}
              </div>
            )}
          </div>
        </div>

        <div className="nokia-softkeys">
          <span onClick={pressBack}>Retour</span>
          <span onClick={pressOk}>{showDetail ? "Ouvrir" : "Voir"}</span>
        </div>

        <div className="nokia-dpad">
          <button type="button" className="nokia-dpad-up" onClick={() => move(-1)}>
            ▲
          </button>
          <button type="button" className="nokia-dpad-ok" onClick={pressOk}>
            OK
          </button>
          <button type="button" className="nokia-dpad-down" onClick={() => move(1)}>
            ▼
          </button>
        </div>

        <div className="nokia-keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
            <span key={k} className="nokia-key">
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
