import { useState } from "react";
import { galleryItems } from "../data/gallery";

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(null);
  const [rotation, setRotation] = useState(0);

  const open = openIndex != null ? galleryItems[openIndex] : null;

  function go(delta) {
    if (galleryItems.length === 0) return;
    setOpenIndex((i) => (i + delta + galleryItems.length) % galleryItems.length);
    setRotation(0);
  }

  if (galleryItems.length === 0) {
    return (
      <p className="pv-empty">
        ajoute tes fichiers dans <code>public/gallery/</code> et référence-les dans{" "}
        <code>src/data/gallery.js</code> pour les voir apparaître ici.
      </p>
    );
  }

  if (open) {
    return (
      <div className="pv-viewer">
        <div className="pv-filename">{open.title}</div>
        <div className="pv-stage">
          <img src={open.image} alt={open.title} style={{ transform: `rotate(${rotation}deg)` }} />
        </div>
        <div className="pv-toolbar">
          <button type="button" onClick={() => setOpenIndex(null)} title="Retour à la grille">
            ▦
          </button>
          <button type="button" onClick={() => go(-1)} title="Précédent">
            ‹
          </button>
          <button type="button" onClick={() => setRotation((r) => r - 90)} title="Rotation">
            ↺
          </button>
          <button type="button" onClick={() => setRotation((r) => r + 90)} title="Rotation">
            ↻
          </button>
          <button type="button" onClick={() => go(1)} title="Suivant">
            ›
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pv-grid">
      {galleryItems.map((g, i) => (
        <button key={g.id} type="button" className="pv-tile" onClick={() => setOpenIndex(i)}>
          <img src={g.image} alt="" />
          <span>{g.title}</span>
        </button>
      ))}
    </div>
  );
}
