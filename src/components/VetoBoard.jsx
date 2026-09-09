import { useEffect, useRef, useState } from "react";
import { BO_FORMATS } from "../lib/vetoSequence";
import { maps as mapCatalog } from "../data/maps";

function catalogEntry(name) {
  return mapCatalog.find((m) => m.name.toLowerCase() === name.toLowerCase()) || null;
}

// Affiche l'état d'une session de veto. Si `myActor` + `onAct` sont
// fournis, les maps du tour en cours deviennent cliquables pour cette
// personne (mode capitaine). Sinon, affichage lecture seule (spectateur).
export default function VetoBoard({ state, myActor, onAct, acting }) {
  const [now, setNow] = useState(Date.now());

  // Animation de révélation façon "défilement de cartes" — seulement au
  // tout premier affichage d'un veto qui vient de démarrer (aucune
  // action encore jouée). Ne se rejoue jamais sur les rafraîchissements
  // suivants du polling, grâce au useRef + effet à dépendances vides.
  const hasCheckedReveal = useRef(false);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    if (hasCheckedReveal.current) return;
    hasCheckedReveal.current = true;
    if (state.status === "live" && state.history.length === 0) {
      setRevealing(true);
      const duration = state.mapPool.length * 70 + 500;
      const t = setTimeout(() => setRevealing(false), duration);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.status !== "live") return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [state.status]);

  const currentStep = state.sequence[state.currentStep];
  const secondsLeft =
    state.status === "live" && state.turnDeadline
      ? Math.max(0, Math.ceil((state.turnDeadline - now) / 1000))
      : null;

  const isMyTurn = state.status === "live" && myActor && currentStep?.actor === myActor && !revealing;

  const actionedMaps = state.history.map((h) => h.map);

  return (
    <div>
      <p className="text-xs text-muted">
        {BO_FORMATS[state.boFormat].label} — {state.mapPool.length} maps dans le pool
      </p>

      {state.status === "live" && (
        <div className="mt-4 border border-border p-3">
          {revealing ? (
            <p className="text-sm">révélation du pool…</p>
          ) : (
            <>
              <p className="text-sm">
                tour de{" "}
                <span className="font-bold">
                  {currentStep.actor === "captain1" ? "CAPITAINE 1" : "CAPITAINE 2"}
                </span>{" "}
                — {currentStep.action === "ban" ? "ban" : "pick"}
              </p>
              {secondsLeft !== null && (
                <p className="mt-1 text-xs text-muted">{secondsLeft}s restantes</p>
              )}
              {isMyTurn && <p className="mt-2 text-sm font-bold">c'est ton tour — clique une map</p>}
              {myActor && !isMyTurn && (
                <p className="mt-2 text-xs text-muted">en attente de l'autre capitaine…</p>
              )}
            </>
          )}
        </div>
      )}

      {state.status === "done" && (
        <div className="mt-4 border border-border p-3">
          <p className="text-sm font-bold">veto terminé</p>
          <ol className="mt-2 space-y-1 text-sm">
            {state.finalMaps.map((m, i) => (
              <li key={m}>
                {i + 1}. <span className="link-box">{m}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs text-muted">maps</p>
        <ul className="mt-2 flex flex-wrap gap-3">
          {state.mapPool.map((m, i) => {
            const done = actionedMaps.includes(m);
            const clickable = isMyTurn && !done && onAct;
            const entry = catalogEntry(m);
            return (
              <li
                key={m}
                className={revealing ? "map-card-hidden" : "map-card-shown"}
                style={{ transitionDelay: revealing ? `${i * 70}ms` : "0ms" }}
              >
                <button
                  type="button"
                  disabled={!clickable || acting}
                  onClick={() => clickable && onAct(m)}
                  className="flex w-24 flex-col items-center gap-1 border border-border p-1.5 text-center text-xs"
                  style={{
                    cursor: clickable ? "pointer" : "default",
                    opacity: done ? 0.4 : 1,
                  }}
                >
                  {entry?.image && (
                    <img
                      src={entry.image}
                      alt=""
                      className="aspect-square w-full object-cover"
                      style={{ filter: done ? "grayscale(1)" : "none" }}
                    />
                  )}
                  <span style={done ? { textDecoration: "line-through" } : undefined}>{m}</span>
                  {entry?.type === "workshop" && (
                    <a
                      href={entry.workshopUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] text-muted underline"
                    >
                      workshop
                    </a>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {state.history.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-muted">historique</p>
          <ul className="mt-2 space-y-1 text-sm">
            {state.history.map((h, i) => (
              <li key={i}>
                {h.actor === "captain1" ? "capitaine 1" : "capitaine 2"} — {h.action === "ban" ? "ban" : "pick"} —{" "}
                {h.map}
                {h.auto && <span className="text-muted"> (auto)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}