import { useEffect, useState } from "react";
import { posts } from "../data/redaction";

// Répartit les images secondaires à intervalles réguliers entre les
// paragraphes plutôt que de toutes les mettre à la fin — un calcul
// déterministe (pas un vrai hasard à chaque rendu, ça bougerait à
// chaque clic), mais l'effet visuel est bien "dispersé dans le texte".
function interleave(body, images) {
  const blocks = [];
  if (!images || images.length === 0) {
    return body.map((p) => ({ type: "p", content: p }));
  }
  const step = body.length / (images.length + 1);
  let imgIndex = 0;
  let nextAt = Math.round(step);
  body.forEach((p, i) => {
    blocks.push({ type: "p", content: p });
    if (imgIndex < images.length && i + 1 >= nextAt) {
      blocks.push({ type: "img", content: images[imgIndex] });
      imgIndex++;
      nextAt = Math.round(step * (imgIndex + 1));
    }
  });
  while (imgIndex < images.length) {
    blocks.push({ type: "img", content: images[imgIndex] });
    imgIndex++;
  }
  return blocks;
}

export default function Redaction({ onNavReady }) {
  const [openId, setOpenId] = useState(null);
  const open = openId ? posts.find((p) => p.id === openId) : null;

  // Communique au chrome de la fenêtre (la "vraie" barre d'outils
  // façon navigateur) de quoi piloter ← et le bouton "aller" vert :
  // ← revient au menu, "aller" ouvre l'article suivant de la liste.
  useEffect(() => {
    if (!onNavReady) return;
    const idx = open ? posts.findIndex((p) => p.id === open.id) : -1;
    onNavReady({
      canBack: !!open,
      onBack: () => setOpenId(null),
      canNext: idx >= 0 && idx < posts.length - 1,
      onNext: () => {
        if (idx >= 0 && idx < posts.length - 1) setOpenId(posts[idx + 1].id);
      },
      pageTitle: open ? open.title : undefined,
    });
  }, [openId, onNavReady, open]);

  if (open) {
    const blocks = interleave(open.body, open.images);
    return (
      <div className="sub">
        <button type="button" onClick={() => setOpenId(null)} className="sub-back">
          ← tous les articles
        </button>

        <article className="sub-reader">
          <p className="sub-date">{open.date}</p>
          <h1 className="sub-headline">{open.title}</h1>
          {open.thumbnail && <img src={open.thumbnail} alt="" className="sub-hero" />}

          <div className="sub-body">
            {blocks.map((b, i) =>
              b.type === "p" ? (
                <p key={i} className={i === 0 ? "sub-lead" : ""}>
                  {b.content}
                </p>
              ) : (
                <img key={i} src={b.content} alt="" className="sub-inline-img" />
              )
            )}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="sub">
      <div className="sub-banner">
        <p className="sub-wordmark">rédaction.</p>
        <p className="sub-tagline">articles, chroniques, reviews</p>
      </div>

      <div className="sub-list">
        {posts.map((p) => (
          <button key={p.id} type="button" onClick={() => setOpenId(p.id)} className="sub-item">
            {p.thumbnail && <img src={p.thumbnail} alt="" className="sub-thumb" />}
            <div className="sub-item-text">
              <p className="sub-date">{p.date}</p>
              <p className="sub-item-title">{p.title}</p>
              <p className="sub-excerpt">{p.body[0]?.slice(0, 600)}…</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}