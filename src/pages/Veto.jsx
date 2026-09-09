import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Veto() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const clean = id.trim();
    if (clean) navigate(`/veto/${clean}`);
  }

  return (
    <div>
      <h1 className="text-sm font-bold">VETO DE MAP</h1>
      <p className="mt-4 text-sm">
        les capitaines ban/pick en direct depuis leur lien personnel. entre l'id d'une session
        pour suivre le veto en direct.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2 text-sm">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="id de la session"
          className="flex-1 border border-border bg-bg px-2 py-1"
        />
        <button type="submit" className="border border-border px-3 py-1.5">
          suivre
        </button>
      </form>
    </div>
  );
}