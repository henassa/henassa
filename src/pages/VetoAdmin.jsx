import { useState } from "react";
import { BO_FORMATS, validatePool } from "../lib/vetoSequence";
import { defaultBoFormat } from "../data/vetoConfig";
import { maps } from "../data/maps";

const TYPE_LABELS = { official: "OFFICIELLES", retired: "RETIRÉES", workshop: "WORKSHOP" };

export default function VetoAdmin() {
  const [passcode, setPasscode] = useState("");
  const [boFormat, setBoFormat] = useState(defaultBoFormat);
  const [selected, setSelected] = useState(
    () => new Set(maps.filter((m) => m.type === "official").map((m) => m.name))
  );
  const [starter, setStarter] = useState("captain1");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [resetId, setResetId] = useState("");
  const [resetPasscode, setResetPasscode] = useState("");
  const [resetMsg, setResetMsg] = useState(null);

  const mapPool = [...selected].sort((a, b) => a.localeCompare(b));
  const poolError = validatePool(mapPool, boFormat);

  const grouped = ["official", "retired", "workshop"].map((type) => ({
    type,
    entries: maps.filter((m) => m.type === type).sort((a, b) => a.name.localeCompare(b.name)),
  }));

  function toggleMap(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/veto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "create", passcode, boFormat, mapPool, starter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setResetMsg(null);
    try {
      const res = await fetch("/.netlify/functions/veto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "reset", id: resetId, passcode: resetPasscode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
      setResetMsg("session supprimée.");
    } catch (err) {
      setResetMsg(err.message);
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div>
      <h1 className="text-sm font-bold">ADMIN — VETO</h1>
      <p className="mt-1 text-xs text-muted">cette page n'est pas liée dans le site public</p>

      {!result ? (
        <form onSubmit={handleCreate} className="mt-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs text-muted">mot de passe admin</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-1 w-full border border-border bg-bg px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted">format</label>
            <select
              value={boFormat}
              onChange={(e) => setBoFormat(e.target.value)}
              className="mt-1 w-full border border-border bg-bg px-2 py-1"
            >
              {Object.entries(BO_FORMATS).map(([key, f]) => (
                <option key={key} value={key}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted">pool de maps</label>
            <div className="mt-2 space-y-3">
              {grouped.map(
                (g) =>
                  g.entries.length > 0 && (
                    <div key={g.type}>
                      <p className="text-[10px] text-muted">{TYPE_LABELS[g.type]}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {g.entries.map((m) => (
                          <label
                            key={m.name}
                            className="flex cursor-pointer items-center gap-1.5 border border-border px-2 py-1"
                          >
                            <input
                              type="checkbox"
                              checked={selected.has(m.name)}
                              onChange={() => toggleMap(m.name)}
                            />
                            {m.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
            {poolError && <p className="mt-1 text-xs">{poolError}</p>}
          </div>

          <div>
            <label className="block text-xs text-muted">qui commence</label>
            <select
              value={starter}
              onChange={(e) => setStarter(e.target.value)}
              className="mt-1 w-full border border-border bg-bg px-2 py-1"
            >
              <option value="captain1">Capitaine 1</option>
              <option value="captain2">Capitaine 2</option>
            </select>
          </div>

          {error && <p>{error}</p>}

          <button
            type="submit"
            disabled={loading || !!poolError}
            className="border border-border px-3 py-1.5"
          >
            {loading ? "création…" : "lancer le veto"}
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-4 text-sm">
          <p className="font-bold">veto lancé — id {result.id}</p>

          <div>
            <p className="text-xs text-muted">lien capitaine 1</p>
            <p className="break-all">
              {origin}/veto/captain/{result.id}/captain1/{result.captain1Token}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">lien capitaine 2</p>
            <p className="break-all">
              {origin}/veto/captain/{result.id}/captain2/{result.captain2Token}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">lien spectateurs (public)</p>
            <p className="break-all">
              {origin}/veto/{result.id}
            </p>
          </div>

          <button type="button" onClick={() => setResult(null)} className="border border-border px-3 py-1.5">
            configurer un autre veto
          </button>
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <p className="text-xs text-muted">réinitialiser une session existante</p>
        <form onSubmit={handleReset} className="mt-3 space-y-3 text-sm">
          <input
            type="text"
            placeholder="id de la session"
            value={resetId}
            onChange={(e) => setResetId(e.target.value)}
            className="w-full border border-border bg-bg px-2 py-1"
          />
          <input
            type="password"
            placeholder="mot de passe admin"
            value={resetPasscode}
            onChange={(e) => setResetPasscode(e.target.value)}
            className="w-full border border-border bg-bg px-2 py-1"
          />
          <button type="submit" className="border border-border px-3 py-1.5">
            supprimer
          </button>
          {resetMsg && <p className="text-xs">{resetMsg}</p>}
        </form>
      </div>
    </div>
  );
}
