import { useState } from "react";
import { posts } from "../data/blog";

export default function Blog() {
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
          <div className="blog12-post-body">{open.body}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog12">
      <div className="blog12-banner">
        <p className="blog12-wordmark">blog.</p>
      </div>

      <div className="blog12-list">
        {posts.map((p) => (
          <button key={p.id} type="button" onClick={() => setOpenId(p.id)} className="blog12-item">
            <p className="blog12-meta">
              {p.date} · {p.category}
            </p>
            <p className="blog12-item-title">{p.title}</p>
            <p className="blog12-excerpt">{p.body.slice(0, 110)}…</p>
          </button>
        ))}
      </div>
    </div>
  );
}
