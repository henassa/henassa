import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VetoBoard from "../components/VetoBoard";

const POLL_MS = 2000;

export default function VetoSpectator() {
  const { id } = useParams();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`/.netlify/functions/veto?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
      setState(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    fetchState();
    const t = setInterval(fetchState, POLL_MS);
    return () => clearInterval(t);
  }, [fetchState]);

  if (error && !state) {
    return <p className="text-sm">{error}</p>;
  }

  if (!state) {
    return <p className="text-sm text-muted">chargement…</p>;
  }

  return (
    <div>
      <h1 className="text-sm font-bold">VETO EN DIRECT</h1>
      <div className="mt-6">
        <VetoBoard state={state} />
      </div>
    </div>
  );
}
