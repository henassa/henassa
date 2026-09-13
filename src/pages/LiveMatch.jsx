import { useCallback, useEffect, useState } from "react";

const POLL_MS = 3000;

const EVENT_LABELS = {
  series_start: "début de série",
  round_end: "fin de round",
  map_result: "fin de map",
  series_end: "fin de série",
  going_live: "match en direct",
};

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
  const history = state?.history || [];

  return (
    <div>
      <h1 className="text-sm font-bold">LIVE MATCH</h1>

      {error && <p className="mt-2 text-xs">{error}</p>}

      {!summary ? (
        <p className="mt-4 text-sm text-muted">aucun match en cours.</p>
      ) : (
        <div className="mt-6 border border-border p-4">
          <p className="text-xs text-muted">
            {summary.status === "done" ? "match terminé" : "en direct"}
            {summary.roundsPlayed != null && ` — round ${summary.roundsPlayed}`}
          </p>
          <div className="mt-2 flex items-baseline gap-4 text-lg font-bold">
            <span>{summary.team1Name}</span>
            <span>
              {summary.team1Score} — {summary.team2Score}
            </span>
            <span>{summary.team2Name}</span>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <p className="text-xs text-muted">flux d'événements</p>
          <ul className="mt-2 space-y-1 text-sm">
            {[...history]
              .reverse()
              .slice(0, 40)
              .map((h, i) => (
                <li key={i} className="text-muted">
                  <span className="text-text">{EVENT_LABELS[h.event] || h.event}</span>{" "}
                  — {new Date(h.at).toLocaleTimeString("fr-CH")}
                </li>
              ))}
          </ul>
        </div>
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
