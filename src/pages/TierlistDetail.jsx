import { Link, useParams } from "react-router-dom";
import { tierlists } from "../data/tierlists";

export default function TierlistDetail() {
  const { id } = useParams();
  const tl = tierlists.find((t) => t.id === id);

  if (!tl) {
    return (
      <div>
        <p className="text-sm">tierlist introuvable.</p>
        <Link to="/tierlists" className="link-box mt-4 inline-block">
          ← retour
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/tierlists" className="link-box text-xs">
        ← retour
      </Link>

      <h1 className="mt-4 text-sm font-bold">{tl.title}</h1>
      <p className="text-xs text-muted">[{tl.date}]</p>
      {tl.description && <p className="mt-2 text-sm">{tl.description}</p>}

      {tl.type === "image" ? (
        <img src={tl.image} alt={tl.title} className="mt-6 w-full border border-border" />
      ) : (
        <div className="mt-6 space-y-2">
          {tl.tiers.map((t) => (
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