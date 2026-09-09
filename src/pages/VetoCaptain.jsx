import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VetoBoard from "../components/VetoBoard";

const POLL_MS = 2000;

export default function VetoCaptain() {
  const { id, slot, token } = useParams();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(false);

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

  async function handleAct(map) {
    setActing(true);
    try {
      const res = await fetch("/.netlify/functions/veto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "act", id, token, map }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erreur");
      setState(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  if (error && !state) {
    return <p className="text-sm">{error}</p>;
  }

  if (!state) {
    return <p className="text-sm text-muted">chargement…</p>;
  }

  return (
    <div>
      <h1 className="text-sm font-bold">
        VETO — {slot === "captain1" ? "CAPITAINE 1" : "CAPITAINE 2"}
      </h1>
      {error && <p className="mt-2 text-xs">{error}</p>}
      <div className="mt-6">
        <VetoBoard state={state} myActor={slot} onAct={handleAct} acting={acting} />
      </div>
    </div>
  );
}