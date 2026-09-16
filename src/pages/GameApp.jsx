import { useState } from "react";
import { players } from "../data/players";
import { matches } from "../data/matches";
import { computeStandings, getPlayerStanding } from "../lib/ladder";
import { useFaceitLevels } from "../lib/useFaceitLevels";
import { useLeetifyProfiles } from "../lib/useLeetifyProfiles";
import { rewards } from "../data/rewards";

const LADDER_LABELS = { mixte: "Ladder mixte", feminin: "Ladder féminin" };

function EloDelta({ value }) {
  if (value == null) return null;
  const positive = value >= 0;
  return (
    <span style={{ color: positive ? "#2ecc40" : "#e74c3c", fontSize: 11, marginLeft: 4 }}>
      ({positive ? "+" : ""}
      {value})
    </span>
  );
}

function FaceitBadge({ steamId, levels, loading }) {
  const entry = steamId ? levels[steamId] : null;

  if (loading && !entry) {
    return <span className="text-muted">…</span>;
  }

  // Pas de compte Faceit trouvé → icône niveau 1 par défaut, plutôt
  // qu'un tiret vide.
  const level = entry?.level ?? 1;

  const badge = (
    <img class="cs2-faceit-elo"
      src={`/ranks/cs2-faceit-${level}.png`}
      alt={`Niveau ${level}`}
      title={entry?.elo != null ? `${entry.elo} elo` : `Niveau ${level}`}
      width={20}
      height={20}
    />
  );

  return entry?.faceitUrl ? (
    <a href={entry.faceitUrl} target="_blank" rel="noreferrer">
      {badge}
    </a>
  ) : (
    badge
  );
}

// Petite barre de progression pour les stats Leetify. `max` fixe
// l'échelle (100 pour aim/positioning/utility, 1 pour clutch/opening
// qui sont de petits ratios) — ajuste dans les appels si Leetify
// change ses échelles.
function StatBar({ label, value, max = 100 }) {
  if (value == null) return null;
  const pct = Math.max(0, Math.min(100, (Math.abs(value) / max) * 100));
  const negative = value < 0;
  return (
    <div className="statbar">
      <div className="statbar-label">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="statbar-track">
        <div
          className="statbar-fill"
          style={{ width: `${pct}%`, background: negative ? "#e74c3c" : "#2ecc40" }}
        />
      </div>
    </div>
  );
}

// ── Petit tableau générique triable au clic sur l'en-tête ───────
function useSort(defaultKey, defaultDir = "desc") {
  const [sort, setSort] = useState({ key: defaultKey, dir: defaultDir });
  function toggle(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: "desc" }));
  }
  function apply(rows, getters) {
    const getter = getters[sort.key];
    if (!getter) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }
  return { sort, toggle, apply };
}

function SortableTh({ label, sortKey, sort, onSort, style }) {
  const active = sort.key === sortKey;
  return (
    <th style={{ cursor: "pointer", userSelect: "none", ...style }} onClick={() => onSort(sortKey)}>
      {label}
      {active && <span style={{ marginLeft: 3, fontSize: 9 }}>{sort.dir === "asc" ? "▲" : "▼"}</span>}
    </th>
  );
}

// ── Écran 1 : hub du jeu (onglets ladder mixte / féminin / matchs) ──
function GameHub({ gameId, onOpenPlayer, onOpenMatch }) {
  const [tab, setTab] = useState("mixte"); // "mixte" | "feminin" | "matchs"
  const ladderSort = useSort("elo");
  const matchSort = useSort("date");

  const ladderPlayersRaw = computeStandings(gameId, tab === "matchs" ? "mixte" : tab);
  const showFaceit = gameId === "cs2";
  const { levels: faceitLevels, loading: faceitLoading } = useFaceitLevels(
    showFaceit ? ladderPlayersRaw.map((p) => p.steamId) : []
  );

  const ladderPlayers = ladderSort.apply(ladderPlayersRaw, {
    pseudo: (p) => p.pseudo.toLowerCase(),
    elo: (p) => p.elo,
    wins: (p) => p.wins,
    losses: (p) => p.losses,
    mvps: (p) => p.mvps,
  });

  const gameMatchesRaw = matches.filter((m) => m.game === gameId && (tab === "matchs" || m.ladder === tab));
  const gameMatches = matchSort.apply(gameMatchesRaw, {
    date: (m) => m.date.split("/").reverse().join(""),
    map: (m) => m.map,
  });

  const ladderRewards = rewards[gameId]?.[tab]?.filter((r) => r.item) || [];

  return (
    <div>
      <menu role="tablist">
        {["mixte", "feminin", "matchs"].map((t) => (
          <li key={t}>
            <button type="button" aria-selected={tab === t} onClick={() => setTab(t)}>
              {t === "matchs" ? "Matchs" : LADDER_LABELS[t]}
            </button>
          </li>
        ))}
      </menu>

      <div role="tabpanel">
        {tab !== "matchs" ? (
          <>
            <table>
              <thead>
                <tr>
                  <SortableTh label="Joueur·se" sortKey="pseudo" sort={ladderSort.sort} onSort={ladderSort.toggle} />
                  <SortableTh label="ELO" sortKey="elo" sort={ladderSort.sort} onSort={ladderSort.toggle} style={{ width: 80 }} />
                  <SortableTh label="V" sortKey="wins" sort={ladderSort.sort} onSort={ladderSort.toggle} style={{ width: 40 }} />
                  <SortableTh label="D" sortKey="losses" sort={ladderSort.sort} onSort={ladderSort.toggle} style={{ width: 40 }} />
                  <SortableTh label="MVP" sortKey="mvps" sort={ladderSort.sort} onSort={ladderSort.toggle} style={{ width: 50 }} />
                  {showFaceit && <th style={{ width: 50 }}>FaceIT</th>}
                </tr>
              </thead>
              <tbody>
                {ladderPlayers.length === 0 && (
                  <tr>
                    <td colSpan={showFaceit ? 6 : 5} className="text-muted">
                      Personne sur ce ladder pour l'instant.
                    </td>
                  </tr>
                )}
                {ladderPlayers.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <button type="button" onClick={() => onOpenPlayer(p.id)} className="link-box">
                        {p.pseudo}
                      </button>
                    </td>
                    <td>
                      {p.elo}
                      <EloDelta value={p.delta} />
                    </td>
                    <td>{p.wins}</td>
                    <td>{p.losses}</td>
                    <td>{p.mvps}</td>
                    {showFaceit && (
                      <td>
                        <FaceitBadge steamId={p.steamId} levels={faceitLevels} loading={faceitLoading} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {ladderRewards.length > 0 && (
              <fieldset className="mt-2">
                <legend>Récompenses</legend>
                <div className="reward-grid">
                  {ladderRewards.map((r, i) => (
                    <div key={i} className="reward-card">
                      {r.image && (
                        <div className="reward-frame">
                          <img src={r.image} alt={r.item} />
                        </div>
                      )}
                      <p className="reward-rank">{r.rank}</p>
                      <p className="reward-item">{r.item}</p>
                      {r.condition && <p className="reward-condition">{r.condition}</p>}
                    </div>
                  ))}
                </div>
              </fieldset>
            )}
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <SortableTh label="Date" sortKey="date" sort={matchSort.sort} onSort={matchSort.toggle} style={{ width: 90 }} />
                <th>Rencontre</th>
                <th style={{ width: 70 }}>Score</th>
                <SortableTh label="Map" sortKey="map" sort={matchSort.sort} onSort={matchSort.toggle} style={{ width: 90 }} />
              </tr>
            </thead>
            <tbody>
              {gameMatches.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted">
                    Aucun match enregistré.
                  </td>
                </tr>
              )}
              {gameMatches.map((m) => (
                <tr key={m.id} onClick={() => onOpenMatch(m.id)} style={{ cursor: "pointer" }}>
                  <td>{m.date}</td>
                  <td>
                    {m.team1.name} vs {m.team2.name}
                  </td>
                  <td>
                    {m.team1.score}–{m.team2.score}
                  </td>
                  <td>{m.map}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Écran 2 : profil d'une personne ────────────────────────────
function PlayerProfile({ playerId, onBack, onOpenMatch }) {
  const p = getPlayerStanding(playerId);
  const isCS2 = p?.game === "cs2";
  const { levels: faceitLevels, loading: faceitLoading } = useFaceitLevels(isCS2 ? [p.steamId] : []);
  const { profiles: leetifyProfiles, loading: leetifyLoading } = useLeetifyProfiles(isCS2 ? [p.steamId] : []);
  if (!p) return <p className="text-xs">Profil introuvable.</p>;

  const leetify = p.steamId ? leetifyProfiles[p.steamId] : null;

  const recentMatches = matches
    .filter((m) => m.team1.players.includes(p.id) || m.team2.players.includes(p.id))
    .slice()
    .reverse();

  return (
    <div>
      <div className="comp-breadcrumb">
        <button type="button" onClick={onBack} className="link-box text-xs">
          ← Retour
        </button>
        <strong>{p.pseudo}</strong>
        <span className="text-xs text-muted">
          {LADDER_LABELS[p.ladder]} — {p.game.toUpperCase()}
        </span>
      </div>

      <table className="mt-2">
        <tbody>
          <tr>
            <td className="text-muted">Elo</td>
            <td>
              {p.elo}
              <EloDelta value={p.delta} />
            </td>
          </tr>
          <tr>
            <td className="text-muted">Victoires</td>
            <td>{p.wins}</td>
          </tr>
          <tr>
            <td className="text-muted">Défaites</td>
            <td>{p.losses}</td>
          </tr>
          <tr>
            <td className="text-muted">MVP de map</td>
            <td>{p.mvps}</td>
          </tr>
          {isCS2 && (
            <tr>
              <td className="text-muted">Faceit</td>
              <td>
                <FaceitBadge steamId={p.steamId} levels={faceitLevels} loading={faceitLoading} />
              </td>
            </tr>
          )}
          {p.steamId && (
            <tr>
              <td className="text-muted">Steam</td>
              <td>
                <a href={`https://steamcommunity.com/profiles/${p.steamId}`} target="_blank" rel="noreferrer">
                  Profil
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isCS2 && (
        <fieldset className="mt-2">
          <legend>Leetify</legend>
          {leetifyLoading && !leetify ? (
            <p className="text-xs text-muted">Chargement…</p>
          ) : leetify ? (
            <>
              <table>
                <tbody>
                  <tr>
                    <td className="text-muted">Rating</td>
                    <td>{leetify.rating}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Winrate</td>
                    <td>{leetify.winrate != null ? `${Math.round(leetify.winrate * 100)}%` : "—"}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2">
                <StatBar label="Aim" value={leetify.aim} max={100} />
                <StatBar label="Positioning" value={leetify.positioning} max={100} />
                <StatBar label="Utility" value={leetify.utility} max={100} />
                <StatBar label="Clutch" value={leetify.clutch} max={1} />
                <StatBar label="Opening" value={leetify.opening} max={1} />
              </div>
            </>
          ) : (
            <p className="text-xs text-muted">Pas de données Leetify.</p>
          )}
        </fieldset>
      )}

      <p className="mt-4 text-xs text-muted">Derniers matchs</p>
      <table className="mt-1">
        <thead>
          <tr>
            <th style={{ width: 90 }}>Date</th>
            <th>Rencontre</th>
            <th style={{ width: 70 }}>Score</th>
            <th style={{ width: 45 }}>K</th>
            <th style={{ width: 45 }}>D</th>
            <th style={{ width: 55 }}>Rating</th>
            <th style={{ width: 55 }}>Elo</th>
          </tr>
        </thead>
        <tbody>
          {recentMatches.length === 0 && (
            <tr>
              <td colSpan={7} className="text-muted">
                Aucun match pour l'instant.
              </td>
            </tr>
          )}
          {recentMatches.map((m) => {
            const s = m.playerStats?.[p.id];
            return (
              <tr key={m.id} onClick={() => onOpenMatch(m.id)} style={{ cursor: "pointer" }}>
                <td>{m.date}</td>
                <td>
                  {m.team1.name} vs {m.team2.name}
                  {m.mvp === p.id && <span className="badge ml-2">MVP</span>}
                </td>
                <td>
                  {m.team1.score}–{m.team2.score}
                </td>
                <td>{s?.kills ?? "—"}</td>
                <td>{s?.deaths ?? "—"}</td>
                <td>{s?.rating ?? "—"}</td>
                <td>
                  <EloDelta value={p.matchDeltas?.[m.id]} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Onglets du détail de match (uniquement si les données existent) ──

function RoundsTab({ m }) {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: 50 }}>Round</th>
          <th>Vainqueur</th>
          <th>Raison</th>
          <th style={{ width: 70 }}>Durée</th>
        </tr>
      </thead>
      <tbody>
        {m.rounds.map((r) => (
          <tr key={r.number}>
            <td>{r.number}</td>
            <td>{r.winner === "team1" ? m.team1.name : m.team2.name}</td>
            <td className="text-muted">{r.reason}</td>
            <td>{r.duration}s</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function KillsTab({ m, pseudo, onOpenPlayer }) {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: 44 }}>Round</th>
          <th>Tueur·se</th>
          <th>Arme</th>
          <th>Victime</th>
          <th style={{ width: 34 }}>HS</th>
        </tr>
      </thead>
      <tbody>
        {m.kills.map((k, i) => (
          <tr key={i}>
            <td>{k.round}</td>
            <td>
              <button type="button" onClick={() => onOpenPlayer(k.killer)} className="link-box">
                {pseudo(k.killer)}
              </button>
            </td>
            <td className="text-muted">{k.weapon}</td>
            <td>
              <button type="button" onClick={() => onOpenPlayer(k.victim)} className="link-box">
                {pseudo(k.victim)}
              </button>
            </td>
            <td>{k.headshot ? "✓" : ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function WeaponsTab({ m }) {
  const agg = {};
  m.kills.forEach((k) => {
    agg[k.weapon] ??= { kills: 0, hs: 0 };
    agg[k.weapon].kills += 1;
    if (k.headshot) agg[k.weapon].hs += 1;
  });
  const rows = Object.entries(agg).sort((a, b) => b[1].kills - a[1].kills);

  return (
    <table>
      <thead>
        <tr>
          <th>Arme</th>
          <th style={{ width: 60 }}>Kills</th>
          <th style={{ width: 60 }}>HS%</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([weapon, s]) => (
          <tr key={weapon}>
            <td>{weapon}</td>
            <td>{s.kills}</td>
            <td>{Math.round((s.hs / s.kills) * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MatrixTab({ m, allPlayerIds, pseudo }) {
  const counts = {};
  m.kills.forEach((k) => {
    counts[k.killer] ??= {};
    counts[k.killer][k.victim] = (counts[k.killer][k.victim] || 0) + 1;
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th></th>
            {allPlayerIds.map((pid) => (
              <th key={pid} style={{ fontSize: 9, writingMode: "vertical-rl", padding: "4px 2px" }}>
                {pseudo(pid)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allPlayerIds.map((killerId) => (
            <tr key={killerId}>
              <td style={{ fontSize: 10, fontWeight: "bold", whiteSpace: "nowrap" }}>{pseudo(killerId)}</td>
              {allPlayerIds.map((victimId) => (
                <td
                  key={victimId}
                  style={{
                    textAlign: "center",
                    background: killerId === victimId ? "#eee" : undefined,
                    color: "#444",
                  }}
                >
                  {killerId === victimId ? "—" : counts[killerId]?.[victimId] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted mt-2">Lignes = tueur·se, colonnes = victime.</p>
    </div>
  );
}

function ClutchesTab({ m, pseudo, onOpenPlayer }) {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: 50 }}>Round</th>
          <th>Joueur·se</th>
          <th style={{ width: 60 }}>Situation</th>
          <th style={{ width: 70 }}>Résultat</th>
        </tr>
      </thead>
      <tbody>
        {m.clutches.length === 0 && (
          <tr>
            <td colSpan={4} className="text-muted">
              Aucun clutch tenté.
            </td>
          </tr>
        )}
        {m.clutches.map((c, i) => (
          <tr key={i}>
            <td>{c.round}</td>
            <td>
              <button type="button" onClick={() => onOpenPlayer(c.player)} className="link-box">
                {pseudo(c.player)}
              </button>
            </td>
            <td>1v{c.opponents}</td>
            <td>{c.won ? <span className="badge">Gagné</span> : <span className="text-muted">Perdu</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Écran 3 : détail d'un match — vraie feuille de stats à onglets ──
function MatchDetail({ matchId, onBack, onOpenPlayer }) {
  const m = matches.find((mm) => mm.id === matchId);
  const [tab, setTab] = useState("resume");
  if (!m) return <p className="text-xs">Match introuvable.</p>;

  const showFaceit = m.game === "cs2";
  const hasDetail = Boolean(m.rounds && m.kills && m.clutches);
  const allPlayerIds = [...m.team1.players, ...m.team2.players];
  const pseudo = (pid) => players.find((pl) => pl.id === pid)?.pseudo || pid;

  const TABS = [
    { id: "resume", label: "Résumé" },
    ...(hasDetail
      ? [
          { id: "rounds", label: "Rounds" },
          { id: "kills", label: "Kills" },
          { id: "weapons", label: "Armes" },
          { id: "matrix", label: "Matrix" },
          { id: "clutches", label: "Clutchs" },
        ]
      : []),
  ];

  function TeamTable({ team }) {
    const { levels: faceitLevels, loading: faceitLoading } = useFaceitLevels(
      showFaceit ? team.players.map((pid) => players.find((pl) => pl.id === pid)?.steamId) : []
    );
    return (
      <table>
        <thead>
          <tr>
            <th>Joueur·se</th>
            <th style={{ width: 32 }}>K</th>
            <th style={{ width: 32 }}>D</th>
            <th style={{ width: 32 }}>A</th>
            <th style={{ width: 48 }}>ADR</th>
            <th style={{ width: 40 }}>HS%</th>
            <th style={{ width: 48 }}>Rating</th>
            {showFaceit && <th style={{ width: 44 }}>Faceit</th>}
          </tr>
        </thead>
        <tbody>
          {team.players.map((pid) => {
            const p = players.find((pl) => pl.id === pid);
            const s = m.playerStats?.[pid];
            return (
              <tr key={pid}>
                <td>
                  <button type="button" onClick={() => onOpenPlayer(pid)} className="link-box">
                    {p?.pseudo || pid}
                  </button>
                  {m.mvp === pid && <span className="badge ml-2">MVP</span>}
                </td>
                <td>{s?.kills ?? "—"}</td>
                <td>{s?.deaths ?? "—"}</td>
                <td>{s?.assists ?? "—"}</td>
                <td>{s?.adr ?? "—"}</td>
                <td>{s?.hs != null ? `${s.hs}%` : "—"}</td>
                <td>
                  <strong>{s?.rating ?? "—"}</strong>
                </td>
                {showFaceit && (
                  <td>
                    <FaceitBadge steamId={p?.steamId} levels={faceitLevels} loading={faceitLoading} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <div className="comp-breadcrumb">
        <button type="button" onClick={onBack} className="link-box text-xs">
          ← Retour
        </button>
        <strong>{m.map}</strong>
        <span className="text-xs text-muted">
          {LADDER_LABELS[m.ladder]} — [{m.date}]
        </span>
      </div>

      <menu role="tablist" className="mt-2">
        {TABS.map((t) => (
          <li key={t.id}>
            <button type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          </li>
        ))}
      </menu>

      <div role="tabpanel">
        {tab === "resume" && (
          <>
            <fieldset>
              <legend>
                {m.team1.name} — {m.team1.score}
              </legend>
              <TeamTable team={m.team1} />
            </fieldset>
            <fieldset className="mt-2">
              <legend>
                {m.team2.name} — {m.team2.score}
              </legend>
              <TeamTable team={m.team2} />
            </fieldset>
          </>
        )}
        {tab === "rounds" && <RoundsTab m={m} />}
        {tab === "kills" && <KillsTab m={m} pseudo={pseudo} onOpenPlayer={onOpenPlayer} />}
        {tab === "weapons" && <WeaponsTab m={m} />}
        {tab === "matrix" && <MatrixTab m={m} allPlayerIds={allPlayerIds} pseudo={pseudo} />}
        {tab === "clutches" && <ClutchesTab m={m} pseudo={pseudo} onOpenPlayer={onOpenPlayer} />}
      </div>
    </div>
  );
}

// ── Racine — une instance par jeu, plus d'écran de sélection ────
export default function GameApp({ gameId }) {
  const [screen, setScreen] = useState({ view: "hub" });

  if (screen.view === "player") {
    return (
      <PlayerProfile
        playerId={screen.id}
        onBack={() => setScreen(screen.back)}
        onOpenMatch={(id) => setScreen({ view: "match", id, back: screen })}
      />
    );
  }

  if (screen.view === "match") {
    return (
      <MatchDetail
        matchId={screen.id}
        onBack={() => setScreen(screen.back)}
        onOpenPlayer={(id) => setScreen({ view: "player", id, back: screen })}
      />
    );
  }

  return (
    <GameHub
      gameId={gameId}
      onOpenPlayer={(id) => setScreen({ view: "player", id, back: screen })}
      onOpenMatch={(id) => setScreen({ view: "match", id, back: screen })}
    />
  );
}