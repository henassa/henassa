import { useState } from "react";
import { valorantStats } from "../data/valorantStats";

const columns = [
  { key: "pseudo", label: "JOUEUR·SE" },
  { key: "riotId", label: "RIOT ID" },
  { key: "kd", label: "K/D" },
  { key: "adr", label: "ADR" },
  { key: "mapsPlayed", label: "MAPS" },
  { key: "winrate", label: "WINRATE" },
];

function aggregate(rows) {
  const byPseudo = {};
  for (const r of rows) {
    byPseudo[r.pseudo] ??= {
      pseudo: r.pseudo,
      riotId: r.riotId,
      kills: 0,
      deaths: 0,
      adrSum: 0,
      wins: 0,
      mapsPlayed: 0,
    };
    const p = byPseudo[r.pseudo];
    p.kills += r.kills;
    p.deaths += r.deaths;
    p.adrSum += r.adr;
    p.wins += r.win ? 1 : 0;
    p.mapsPlayed += 1;
  }
  return Object.values(byPseudo).map((p) => ({
    ...p,
    kd: p.deaths > 0 ? p.kills / p.deaths : p.kills,
    adr: p.adrSum / p.mapsPlayed,
    winrate: (p.wins / p.mapsPlayed) * 100,
  }));
}

export default function Valorant() {
  const [sortKey, setSortKey] = useState("kd");
  const [sortDir, setSortDir] = useState("desc");

  const rows = aggregate(valorantStats);

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <h1 className="text-sm font-bold">PICKUP VALORANT</h1>
      <p className="mt-1 text-xs text-muted">clique une colonne pour trier</p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[560px] border-collapse text-sm">
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
                <td className="whitespace-nowrap px-3 py-2">{row.pseudo}</td>
                <td className="whitespace-nowrap px-3 py-2 text-muted">{row.riotId}</td>
                <td className="whitespace-nowrap px-3 py-2">{row.kd.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-2">{row.adr.toFixed(0)}</td>
                <td className="whitespace-nowrap px-3 py-2">{row.mapsPlayed}</td>
                <td className="whitespace-nowrap px-3 py-2">{row.winrate.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
