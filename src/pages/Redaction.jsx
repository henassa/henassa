import { useState } from "react";
import { posts } from "../data/redaction";

export default function Redaction() {
  const [openId, setOpenId] = useState(null);
  const open = openId ? posts.find((p) => p.id === openId) : null;

  if (open) {
    return (
      <div className="blog12">
        <button type="button" onClick={() => setOpenId(null)} className="blog12-back">
          ← tous les articles
        </button>

        <div className="blog12-post">
          <p className="blog12-meta">
            {open.date} · {open.category}
          </p>
          <h1 className="blog12-post-title">{open.title}</h1>
          {open.thumbnail && <img src={open.thumbnail} alt="" className="blog12-post-thumb" />}
          <div className="blog12-post-body">{open.body}</div>
          {open.images?.length > 0 && (
            <div className="blog12-post-images">
              {open.images.map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="blog12">
      <div className="blog12-banner">
        <p className="blog12-wordmark">rédaction.</p>
      </div>

      <div className="blog12-list">
        {posts.map((p) => (
          <button key={p.id} type="button" onClick={() => setOpenId(p.id)} className="blog12-item">
            {p.thumbnail && <img src={p.thumbnail} alt="" className="blog12-thumb" />}
            <div className="blog12-item-text">
              <p className="blog12-meta">
                {p.date} · {p.category}
              </p>
              <p className="blog12-item-title">{p.title}</p>
              <p className="blog12-excerpt">{p.body.slice(0, 110)}…</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
