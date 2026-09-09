import { gameSettings, peripherals, pcComponents } from "../data/setup";

export default function Setup() {
  return (
    <div>
      <h1 className="text-sm font-bold">Settings</h1>

      {gameSettings.map((g) => (
        <div key={g.game} className="mt-8">
          <p className="text-xs text-muted">{g.game}</p>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {g.settings.map((s) => (
                <tr key={s.label} className="border-b border-border last:border-b-0">
                  <td className="py-1.5 pr-4 text-muted">{s.label}</td>
                  <td className="py-1.5">{s.value || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8">
        <p className="text-xs text-muted">PÉRIPHÉRIQUES</p>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {peripherals.map((p) => (
              <tr key={p.category} className="border-b border-border last:border-b-0">
                <td className="py-1.5 pr-4 text-muted">{p.category}</td>
                <td className="py-1.5">
                  {p.name || "—"}
                  {p.detail && <span className="text-muted"> — {p.detail}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <p className="text-xs text-muted">CONFIG PC</p>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {pcComponents.map((c) => (
              <tr key={c.component} className="border-b border-border last:border-b-0">
                <td className="py-1.5 pr-4 text-muted">{c.component}</td>
                <td className="py-1.5">{c.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}