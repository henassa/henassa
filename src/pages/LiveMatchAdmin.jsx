import { useState } from "react";

export default function LiveMatchAdmin() {
  const [passcode, setPasscode] = useState("");
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [mapName, setMapName] = useState("");
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function publish(status = "live") {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/match-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          op: "manual_set",
          passcode,
          team1Name,
          team2Name,
          mapName,
          team1Score,
          team2Score,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    setError(null);
    try {
      const res = await fetch("/.netlify/functions/match-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "reset", passcode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
      setTeam1Score(0);
      setTeam2Score(0);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-sm font-bold">Admin — Live Match</h1>
      <p className="mt-1 text-xs text-muted">
        scoreboard tenu à la main — met à jour le score toi-même pendant le match, la page{" "}
        <code>/live</code> se met à jour toute seule pour tout le monde.
      </p>

      <div className="mt-6 space-y-4 text-sm">
        <div>
          <label className="block text-xs text-muted">mot de passe admin</label>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="mt-1 w-full border border-border bg-bg px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-xs text-muted">map</label>
          <input
            type="text"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            placeholder="Mirage"
            className="mt-1 w-full border border-border bg-bg px-2 py-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted">équipe 1</label>
            <input
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="mt-1 w-full border border-border bg-bg px-2 py-1"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTeam1Score((s) => Math.max(0, s - 1))}
                className="border border-border px-3 py-1"
              >
                −
              </button>
              <span className="w-8 text-center text-lg font-bold">{team1Score}</span>
              <button
                type="button"
                onClick={() => setTeam1Score((s) => s + 1)}
                className="border border-border px-3 py-1"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted">équipe 2</label>
            <input
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="mt-1 w-full border border-border bg-bg px-2 py-1"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTeam2Score((s) => Math.max(0, s - 1))}
                className="border border-border px-3 py-1"
              >
                −
              </button>
              <span className="w-8 text-center text-lg font-bold">{team2Score}</span>
              <button
                type="button"
                onClick={() => setTeam2Score((s) => s + 1)}
                className="border border-border px-3 py-1"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {error && <p>{error}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => publish("live")}
            disabled={loading}
            className="border border-border px-3 py-1.5"
          >
            publier
          </button>
          <button
            type="button"
            onClick={() => publish("done")}
            disabled={loading}
            className="border border-border px-3 py-1.5"
          >
            terminer le match
          </button>
          <button type="button" onClick={reset} className="border border-border px-3 py-1.5">
            reset complet
          </button>
        </div>
      </div>
    </div>
  );
}