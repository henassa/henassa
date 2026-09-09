import { top100, monthLabel } from "../data/top100";

export default function Top100() {
  const sorted = [...top100].sort((a, b) => a.rank - b.rank);

  return (
    <div>
      <h1 className="text-sm font-bold">Chroniques — {monthLabel}</h1>
      <p className="mt-1 text-xs text-muted">clique sur un titre pour l'écouter</p>

      <ol className="mt-6 space-y-1.5">
        {sorted.map((song) => (
          <li key={song.rank} className="flex gap-3 text-sm">
            <span className="w-8 shrink-0 text-right text-muted">{song.rank}.</span>
            <a
              href={song.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="link-box"
            >
              {song.artist} — {song.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}