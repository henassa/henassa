import { useEffect, useState } from "react";
import { about } from "../data/about";

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  "C#": "#178600",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
};

export default function GithubRepos() {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    setError(null);
    setRepos(null);
    fetch(`https://api.github.com/users/${about.githubUsername}/repos?sort=updated&per_page=15`)
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json)) setRepos(json);
        else setError("impossible de charger les repos");
      })
      .catch(() => {
        setError("impossible de contacter GitHub");
      });
  }

  useEffect(() => {
    if (!about.githubUsername) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!about.githubUsername) {
    return (
      <p className="text-xs text-muted p-3">
        renseigne <code>githubUsername</code> dans <code>src/data/about.js</code> pour activer
        cette fenêtre.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="repo-toolbar">
        <span className="text-xs" style={{ flex: 1 }}>
          github.com/{about.githubUsername}
        </span>
        <button type="button" onClick={load}>
          actualiser
        </button>
      </div>

      <div className="repo-list">
        {error && <p className="text-xs p-2">{error}</p>}
        {!error && !repos && <p className="text-xs p-2 text-muted">chargement…</p>}

        {repos &&
          repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="repo-item"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="repo-name">{repo.name}</div>
              {repo.description && <div className="repo-desc">{repo.description}</div>}
              <div className="repo-meta">
                {repo.language && (
                  <span>
                    <span
                      className="repo-lang-dot"
                      style={{ background: LANG_COLORS[repo.language] || "#999" }}
                    />
                    {repo.language}
                  </span>
                )}
                <span>★ {repo.stargazers_count}</span>
                {repo.fork && <span className="repo-tag">fork</span>}
              </div>
            </a>
          ))}
      </div>

      <div className="status-bar" style={{ display: "flex", gap: 1, flexShrink: 0 }}>
        <p className="status-bar-field">
          {error ? "erreur" : repos ? `github.com/${about.githubUsername}` : "chargement…"}
        </p>
        {repos && (
          <p className="status-bar-field" style={{ flexGrow: 0, whiteSpace: "nowrap" }}>
            {repos.length} repos
          </p>
        )}
      </div>
    </div>
  );
}
