import { Link, useParams } from "react-router-dom";
import { selections } from "../data/selections";

export default function SelectionDetail() {
  const { id } = useParams();
  const sel = selections.find((s) => s.id === id);

  if (!sel) {
    return (
      <div>
        <p className="text-sm">sélection introuvable.</p>
        <Link to="/selections" className="link-box mt-4 inline-block">
          ← retour
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/selections" className="link-box text-xs">
        ← retour
      </Link>

      <h1 className="mt-4 text-sm font-bold">{sel.title}</h1>
      <p className="text-xs text-muted">[{sel.date}]</p>
      {sel.description && <p className="mt-2 text-sm">{sel.description}</p>}

      {sel.type === "image" ? (
        <img src={sel.image} alt={sel.title} className="mt-6 w-full border border-border" />
      ) : (
        <div className="mt-6 space-y-2">
          {sel.tiers.map((t) => (
            <div key={t.tier} className="flex gap-3 border border-border">
              <div className="flex w-10 shrink-0 items-center justify-center border-r border-border py-2 text-sm font-bold">
                {t.tier}
              </div>
              <div className="flex flex-wrap items-center gap-2 py-2 text-sm">
                {t.items.length > 0 ? (
                  t.items.map((item, i) => <span key={i}>{item}</span>)
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}