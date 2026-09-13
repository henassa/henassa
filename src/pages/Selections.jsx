import { useState } from "react";
import { top100, monthLabel } from "../data/top100";
import { selections } from "../data/selections";

function SelectionDetail({ sel, onBack }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="link-box text-xs">
        ← retour
      </button>

      <h2 className="mt-4 text-sm font-bold">{sel.title}</h2>
      <p className="text-xs text-muted">[{sel.date}]</p>
      {sel.description && <p className="mt-2 text-sm">{sel.description}</p>}

      {sel.type === "image" ? (
        <img src={sel.image} alt={sel.title} className="mt-6 w-full border border-border" />
      ) : (
        <div className="mt-6 space-y-2">
          {sel.tiers.map((t) => (
            <div key={t.tier} className="flex gap-3 border border-border">
              <div className="flex w-10 shrink-0 items-center justify-center border-r border-border py-2 text-sm font-bold">
                {t.tier}
              </div>
              <div className="flex flex-wrap items-center gap-2 py-2 text-sm">
                {t.items.length > 0 ? (
                  t.items.map((item, i) => <span key={i}>{item}</span>)
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Selections() {
  const [openId, setOpenId] = useState(null);
  const sortedSongs = [...top100].sort((a, b) => a.rank - b.rank);

  const openSel = openId ? selections.find((s) => s.id === openId) : null;
  if (openSel) {
    return <SelectionDetail sel={openSel} onBack={() => setOpenId(null)} />;
  }

  return (
    <div>
      <h1 className="text-sm font-bold">Sélections</h1>

      <section className="mt-8">
        <p className="text-xs text-muted">sons — {monthLabel}</p>
        <ol className="mt-3 space-y-1.5">
          {sortedSongs.map((song) => (
            <li key={song.rank} className="flex gap-3 text-sm">
              <span className="w-8 shrink-0 text-right text-muted">{song.rank}.</span>
              <a href={song.youtubeUrl} target="_blank" rel="noreferrer" className="link-box">
                {song.artist} — {song.title}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <p className="text-xs text-muted">sélections</p>
        <ul className="mt-3 space-y-4">
          {selections.map((sel) => (
            <li key={sel.id}>
              <p className="text-xs text-muted">[{sel.date}]</p>
              <button type="button" onClick={() => setOpenId(sel.id)} className="link-box">
                {sel.title}
              </button>
              {sel.description && <p className="mt-1 text-sm">{sel.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
