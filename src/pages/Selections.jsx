import { Link } from "react-router-dom";
import { top100, monthLabel } from "../data/top100";
import { selections } from "../data/selections";

export default function Selections() {
  const sortedSongs = [...top100].sort((a, b) => a.rank - b.rank);

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
              <Link to={`/selections/${sel.id}`} className="link-box">
                {sel.title}
              </Link>
              {sel.description && <p className="mt-1 text-sm">{sel.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}