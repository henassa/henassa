import { useEffect, useState } from "react";
import { about } from "../data/about";

const COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const MONTHS = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default function GithubContributions() {
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);

  async function load() {
    if (!about.githubUsername) return;
    setStatus("loading");
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${about.githubUsername}?y=last`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      const contributions = data.contributions;
      const totalCount = data.total?.lastYear ?? contributions.reduce((s, d) => s + d.count, 0);

      const sorted = [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
      const byWeek = [];
      let week = [];
      if (sorted.length > 0) {
        for (let i = 0; i < new Date(sorted[0].date).getDay(); i++) week.push(null);
        sorted.forEach((d) => {
          week.push(d);
          if (week.length === 7) {
            byWeek.push(week);
            week = [];
          }
        });
        if (week.length) {
          while (week.length < 7) week.push(null);
          byWeek.push(week);
        }
      }
      setWeeks(byWeek);
      setTotal(totalCount);
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
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

  let lastMonth = -1;

  return (
    <div className="window-body no-scroll" style={{ display: "flex", flexDirection: "column", padding: 0 }}>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 10 }}>
        {status === "loading" && <p className="text-xs text-muted">chargement…</p>}

        {status === "error" && (
          <p className="text-xs">
            impossible de charger les contributions.{" "}
            <button type="button" onClick={load}>
              réessayer
            </button>
          </p>
        )}

        {status === "ok" && (
          <>
            <div style={{ display: "flex", marginBottom: 2 }}>
              {weeks.map((w, i) => {
                const first = w.find((d) => d);
                const m = first ? new Date(first.date).getMonth() : -1;
                const label = m !== -1 && m !== lastMonth ? MONTHS[m] : "";
                if (m !== -1) lastMonth = m;
                return (
                  <span
                    key={i}
                    style={{ width: 12, flexShrink: 0, color: "#444", fontSize: 10, overflow: "hidden" }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {weeks.map((w, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {w.map((d, j) => (
                    <div
                      key={j}
                      title={d ? `${d.date} : ${d.count} contribution${d.count !== 1 ? "s" : ""}` : undefined}
                      style={{
                        width: 10,
                        height: 10,
                        flexShrink: 0,
                        background: d ? COLORS[d.level] || COLORS[0] : "transparent",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                justifyContent: "flex-end",
                marginTop: 4,
                color: "#666",
                fontSize: 10,
              }}
            >
              Less
              {COLORS.map((c) => (
                <div key={c} style={{ width: 10, height: 10, background: c, flexShrink: 0 }} />
              ))}
              More
            </div>
          </>
        )}
      </div>

      <div className="status-bar" style={{ display: "flex", gap: 1, flexShrink: 0 }}>
        <p className="status-bar-field">
          {status === "ok"
            ? `github.com/${about.githubUsername}`
            : status === "error"
            ? "erreur de chargement"
            : "chargement…"}
        </p>
        {status === "ok" && (
          <p className="status-bar-field" style={{ flexGrow: 0, whiteSpace: "nowrap" }}>
            {total} contributions cette année
          </p>
        )}
      </div>
    </div>
  );
}
