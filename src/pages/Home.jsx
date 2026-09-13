import { updates } from "../data/updates";

export default function Home() {
  return (
    <div className="space-y-6">
      {updates.map((u, i) => (
        <div key={i}>
          <p className="text-xs text-muted">[{u.date}]</p>
          {u.link ? (
            <a href={u.link} target="_blank" rel="noreferrer" className="link-box">
              {u.title}
            </a>
          ) : (
            <span className="link-box">{u.title}</span>
          )}
          {u.description && <p className="mt-1 text-sm">{u.description}</p>}
        </div>
      ))}
    </div>
  );
}
