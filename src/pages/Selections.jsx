import { Link } from "react-router-dom";
import { tierlists } from "../data/tierlists";

export default function Tierlists() {
  return (
    <div>
      <h1 className="text-sm font-bold">Sélections</h1>

      <ul className="mt-6 space-y-4">
        {tierlists.map((tl) => (
          <li key={tl.id}>
            <p className="text-xs text-muted">[{tl.date}]</p>
            <Link to={`/tierlists/${tl.id}`} className="link-box">
              {tl.title}
            </Link>
            {tl.description && <p className="mt-1 text-sm">{tl.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}