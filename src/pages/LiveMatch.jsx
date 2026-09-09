import { useCallback, useEffect, useState } from "react";

const POLL_MS = 3000;

const WEAPON_LABELS = {
  planted_c4: "la bombe",
  hegrenade: "grenade",
  knife: "couteau",
};

function weaponLabel(weapon) {
  if (!weapon) return "";
  return WEAPON_LABELS[weapon] || weapon.replace(/^weapon_/, "");
}

function ScoreboardTable({ teamName, players }) {
  if (!players || players.length === 0) {
    return (
      <div>
        <p className="text-xs font-bold">{teamName}</p>
        <p className="mt-1 text-xs text-muted">aucun·e joueur·se</p>
      </div>
    );
  }

  const sorted = [...players].sort((a, b) => b.kills - a.kills);

  return (
    <div>
      <p className="text-xs font-bold">{teamName}</p>
      <table className="mt-2 w-full text-xs">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-1 text-left">joueur·se</th>
            <th className="py-1 text-right">K</th>
            <th className="py-1 text-right">D</th>
            <th className="py-1 text-right">A</th>
            <th className="py-1 text-right">HS</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.steamid} className="border-b border-border last:border-b-0">
              <td className="py-1">{p.name}</td>
              <td className="py-1 text-right">{p.kills}</td>
              <td className="py-1 text-right">{p.deaths}</td>
              <td className="py-1 text-right">{p.assists}</td>
              <td className="py-1 text-right">{p.headshotKills}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LiveMatch() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [resetPasscode, setResetPasscode] = useState("");
  const [resetMsg, setResetMsg] = useState(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/.netlify/functions/match-webhook");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
      setState(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchState();
    const t = setInterval(fetchState, POLL_MS);
    return () => clearInterval(t);
  }, [fetchState]);

  async function handleReset(e) {
    e.preventDefault();
    setResetMsg(null);
    try {
      const res = await fetch("/.netlify/functions/match-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "reset", passcode: resetPasscode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
      setResetMsg("match réinitialisé.");
      fetchState();
    } catch (err) {
      setResetMsg(err.message);
    }
  }

  const summary = state?.summary;
  const killFeed = state?.killFeed || [];
  const bombStatus = state?.bombStatus;

  return (
    <div>
      <h1 className="text-sm font-bold">Live Match</h1>

      {error && <p className="mt-2 text-xs">{error}</p>}

      {!summary ? (
        <p className="mt-4 text-sm text-muted">aucun match en cours.</p>
      ) : (
        <>
          <div className="mt-6 border border-border p-4">
            <p className="text-xs text-muted">
              {summary.status === "done" ? "match terminé" : "en direct"}
              {summary.roundsPlayed != null && ` — round ${summary.roundsPlayed}`}
              {summary.mapName && ` — ${summary.mapName}`}
            </p>
            <div className="mt-2 flex items-baseline gap-4 text-lg font-bold">
              <span>{summary.team1Name}</span>
              <span>
                {summary.team1Score} — {summary.team2Score}
              </span>
              <span>{summary.team2Name}</span>
            </div>

            {bombStatus && (
              <p className="mt-2 text-xs">
                {bombStatus.defused
                  ? `bombe désamorcée${bombStatus.site ? ` (site ${bombStatus.site})` : ""}`
                  : `bombe posée${bombStatus.site ? ` — site ${bombStatus.site}` : ""}`}
              </p>
            )}
          </div>

          {(summary.team1Players || summary.team2Players) && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <ScoreboardTable teamName={summary.team1Name} players={summary.team1Players} />
              <ScoreboardTable teamName={summary.team2Name} players={summary.team2Players} />
            </div>
          )}

          {killFeed.length > 0 && (
            <div className="mt-8">
              <p className="text-xs text-muted">kill feed</p>
              <ul className="mt-2 space-y-1 text-sm">
                {[...killFeed].reverse().map((k, i) => (
                  <li key={i}>
                    {k.suicide ? (
                      <span>
                        {k.victim} s'est éliminé·e{k.weapon ? ` (${weaponLabel(k.weapon)})` : ""}
                      </span>
                    ) : (
                      <span>
                        {k.killer || "?"} ➜ {k.victim}
                        {k.weapon && ` (${weaponLabel(k.weapon)}${k.headshot ? " · HS" : ""})`}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <p className="text-xs text-muted">réinitialiser (admin)</p>
        <form onSubmit={handleReset} className="mt-3 flex gap-2 text-sm">
          <input
            type="password"
            placeholder="mot de passe admin"
            value={resetPasscode}
            onChange={(e) => setResetPasscode(e.target.value)}
            className="flex-1 border border-border bg-bg px-2 py-1"
          />
          <button type="submit" className="border border-border px-3 py-1.5">
            reset
          </button>
        </form>
        {resetMsg && <p className="mt-2 text-xs">{resetMsg}</p>}
      </div>
    </div>
  );
}