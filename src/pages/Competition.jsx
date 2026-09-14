import { useState } from "react";
import { games } from "../data/games";
import { players } from "../data/players";
import { matches } from "../data/matches";

const LADDER_LABELS = { mixte: "Ladder mixte", feminin: "Ladder féminin" };

// ── Écran 1 : choix du jeu ─────────────────────────────────────
function GamePicker({ onSelect }) {
  return (
    <div className="game-picker">
      {games.map((g) => (
        <button key={g.id} type="button" onClick={() => onSelect(g.id)} className="game-card">
          <img src={g.icon} alt="" width={48} height={48} />
          <span>{g.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Écran 2 : hub d'un jeu (onglets ladder mixte / féminin / matchs) ──
function GameHub({ gameId, onBack, onOpenPlayer, onOpenMatch }) {
  const [tab, setTab] = useState("mixte"); // "mixte" | "feminin" | "matchs"
  const game = games.find((g) => g.id === gameId);

  const ladderPlayers = players
    .filter((p) => p.game === gameId && p.ladder === tab)
    .sort((a, b) => b.elo - a.elo);

  const gameMatches = matches
    .filter((m) => m.game === gameId && (tab === "matchs" || m.ladder === tab))
    .slice()
    .reverse();

  return (
    <div>
      <div className="comp-breadcrumb">
        <button type="button" onClick={onBack} className="link-box text-xs">
          ← Jeux
        </button>
        <img src={game?.icon} alt="" width={16} height={16} />
        <strong>{game?.label}</strong>
      </div>

      <menu role="tablist" className="mt-2">
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
          <table>
            <thead>
              <tr>
                <th>Joueur·se</th>
                <th style={{ width: 60 }}>elo</th>
                <th style={{ width: 40 }}>V</th>
                <th style={{ width: 40 }}>D</th>
                <th style={{ width: 50 }}>mvp</th>
              </tr>
            </thead>
            <tbody>
              {ladderPlayers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">
                    personne sur ce ladder pour l'instant.
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
                  <td>{p.elo}</td>
                  <td>{p.wins}</td>
                  <td>{p.losses}</td>
                  <td>{p.mvps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 90 }}>date</th>
                <th>Rencontre</th>
                <th style={{ width: 70 }}>score</th>
                <th style={{ width: 90 }}>map</th>
              </tr>
            </thead>
            <tbody>
              {gameMatches.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted">
                    aucun match enregistré.
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

// ── Écran 3 : profil d'une personne ────────────────────────────
function PlayerProfile({ playerId, onBack, onOpenMatch }) {
  const p = players.find((pl) => pl.id === playerId);
  if (!p) return <p className="text-xs">profil introuvable.</p>;

  const recentMatches = matches
    .filter((m) => m.team1.players.includes(p.id) || m.team2.players.includes(p.id))
    .slice()
    .reverse();

  return (
    <div>
      <div className="comp-breadcrumb">
        <button type="button" onClick={onBack} className="link-box text-xs">
          ← retour
        </button>
        <strong>{p.pseudo}</strong>
        <span className="text-xs text-muted">
          {LADDER_LABELS[p.ladder]} — {p.game.toUpperCase()}
        </span>
      </div>

      <table className="mt-2">
        <tbody>
          <tr>
            <td className="text-muted">ÉLO</td>
            <td>{p.elo}</td>
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
            <td className="text-muted">MVP</td>
            <td>{p.mvps}</td>
          </tr>
          {p.steamId && (
            <tr>
              <td className="text-muted">Steam</td>
              <td>
                <a href={`https://steamcommunity.com/profiles/${p.steamId}`} target="_blank" rel="noreferrer">
                  profil
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-muted">Derniers matchs</p>
      <table className="mt-1">
        <thead>
          <tr>
            <th style={{ width: 90 }}>Date</th>
            <th>Rencontre</th>
            <th style={{ width: 70 }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {recentMatches.length === 0 && (
            <tr>
              <td colSpan={3} className="text-muted">
                Aucun match pour l'instant.
              </td>
            </tr>
          )}
          {recentMatches.map((m) => (
            <tr key={m.id} onClick={() => onOpenMatch(m.id)} style={{ cursor: "pointer" }}>
              <td>{m.date}</td>
              <td>
                {m.team1.name} vs {m.team2.name}
                {m.mvp === p.id && <span className="badge ml-2">MVP</span>}
              </td>
              <td>
                {m.team1.score}–{m.team2.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Écran 4 : détail d'un match ─────────────────────────────────
function MatchDetail({ matchId, onBack, onOpenPlayer }) {
  const m = matches.find((mm) => mm.id === matchId);
  if (!m) return <p className="text-xs">match introuvable.</p>;

  function TeamList({ team }) {
    return (
      <ul className="mt-1 space-y-1 text-sm">
        {team.players.length === 0 && <li className="text-muted">—</li>}
        {team.players.map((pid) => {
          const p = players.find((pl) => pl.id === pid);
          return (
            <li key={pid}>
              <button type="button" onClick={() => onOpenPlayer(pid)} className="link-box">
                {p?.pseudo || pid}
              </button>
              {m.mvp === pid && <span className="badge ml-2">MVP</span>}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div>
      <div className="comp-breadcrumb">
        <button type="button" onClick={onBack} className="link-box text-xs">
          ← retour
        </button>
        <strong>{m.map}</strong>
        <span className="text-xs text-muted">
          {LADDER_LABELS[m.ladder]} — [{m.date}]
        </span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-4">
        <fieldset>
          <legend>
            {m.team1.name} — {m.team1.score}
          </legend>
          <TeamList team={m.team1} />
        </fieldset>
        <fieldset>
          <legend>
            {m.team2.name} — {m.team2.score}
          </legend>
          <TeamList team={m.team2} />
        </fieldset>
      </div>
    </div>
  );
}

// ── Racine : gère quel écran est affiché, sans routeur ──────────
export default function Competition() {
  const [screen, setScreen] = useState({ view: "games" });

  if (screen.view === "game") {
    return (
      <GameHub
        gameId={screen.gameId}
        onBack={() => setScreen({ view: "games" })}
        onOpenPlayer={(id) => setScreen({ view: "player", id, back: screen })}
        onOpenMatch={(id) => setScreen({ view: "match", id, back: screen })}
      />
    );
  }

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

  return <GamePicker onSelect={(gameId) => setScreen({ view: "game", gameId })} />;
}
