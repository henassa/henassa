import { useEffect, useMemo, useState } from "react";
import { cs2stats } from "../data/cs2stats";

const columns = [
  { key: "pseudo", label: "JOUEUR·SE" },
  { key: "elo", label: "ELO FACEIT" },
  { key: "rating", label: "RATING 2.0" },
  { key: "kdDiff", label: "K/D DIFF" },
  { key: "kd", label: "K/D" },
  { key: "adr", label: "ADR" },
  { key: "mapsPlayed", label: "MAPS" },
  { key: "winrate", label: "WINRATE" },
];

// Regroupe les lignes brutes (une par session) en une ligne par
// joueur·se, avec les totaux/moyennes à travers toutes les sessions.
function aggregate(rows) {
  const byPseudo = {};
  for (const r of rows) {
    byPseudo[r.pseudo] ??= {
      pseudo: r.pseudo,
      steamId: r.steamId || null,
      kills: 0,
      deaths: 0,
      adrSum: 0,
      ratingSum: 0,
      wins: 0,
      mapsPlayed: 0,
      sessions: 0,
    };
    const p = byPseudo[r.pseudo];
    p.kills += r.kills;
    p.deaths += r.deaths;
    p.adrSum += r.adr * r.maps; // moyenne pondérée par le nombre de maps de la session
    p.ratingSum += r.rating * r.maps;
    p.wins += r.wins;
    p.mapsPlayed += r.maps;
    p.sessions += 1;
  }

  return Object.values(byPseudo).map((p) => ({
    ...p,
    kdDiff: p.kills - p.deaths,
    kd: p.deaths > 0 ? p.kills / p.deaths : p.kills,
    adr: p.adrSum / p.mapsPlayed,
    rating: p.ratingSum / p.mapsPlayed,
    winrate: (p.wins / p.mapsPlayed) * 100,
  }));
}

export default function Customs() {
  const [sortKey, setSortKey] = useState("rating");
  const [sortDir, setSortDir] = useState("desc");
  const [faceitData, setFaceitData] = useState({});

  const players = useMemo(() => aggregate(cs2stats), []);

  useEffect(() => {
    const steamIds = [...new Set(players.map((p) => p.steamId).filter(Boolean))];
    if (steamIds.length === 0) return;

    fetch(`/.netlify/functions/faceit-elo?steamids=${steamIds.join(",")}`)
      .then((r) => r.json())
      .then(setFaceitData)
      .catch(() => {});
  }, [players]);

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = players.map((p) => {
    const faceit = p.steamId ? faceitData[p.steamId] : null;
    return {
      ...p,
      elo: faceit?.elo ?? null,
      faceitUrl: faceit?.faceitUrl || null,
    };
  });

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <h1 className="text-sm font-bold">CUSTOMS CS2</h1>
      <p className="mt-1 text-xs text-muted">clique une colonne pour trier</p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left text-xs"
                >
                  {col.label}
                  <span className={sortKey === col.key ? "" : "invisible"}>
                    {" "}
                    {sortDir === "asc" ? "↑" : "↓"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.pseudo} className="border-b border-border last:border-b-0">
                <td className="whitespace-nowrap px-3 py-2">
                  {row.steamId ? (
                    <a
                      href={`https://steamcommunity.com/profiles/${row.steamId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="link-box"
                    >
                      {row.pseudo}
                    </a>
                  ) : (
                    row.pseudo
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  {row.elo != null ? (
                    row.faceitUrl ? (
                      <a href={row.faceitUrl} target="_blank" rel="noreferrer" className="underline">
                        {row.elo}
                      </a>
                    ) : (
                      row.elo
                    )
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2">{row.rating.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  {row.kdDiff > 0 ? `+${row.kdDiff}` : row.kdDiff}
                </td>
                <td className="whitespace-nowrap px-3 py-2">{row.kd.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-2">{row.adr.toFixed(1)}</td>
                <td className="whitespace-nowrap px-3 py-2">{row.mapsPlayed}</td>
                <td className="whitespace-nowrap px-3 py-2">{row.winrate.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">
        l'elo faceit nécessite la clé FACEIT_API_KEY sur Netlify — sans ça, cette colonne reste
        vide.
      </p>
    </div>
  );
}
