export default function AppHeader({ icon, title, subtitle }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        marginBottom: 12,
        borderRadius: 6,
        background: "linear-gradient(135deg, #2e8fe0 0%, #1a5fb4 55%, #0d3f80 100%)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      {icon && <img src={icon} alt="" width={28} height={28} />}
      <div>
        <p style={{ color: "#fff", fontWeight: "bold", fontSize: 14, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ color: "#dceeff", fontSize: 11, textShadow: "0 1px 1px rgba(0,0,0,0.3)" }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
