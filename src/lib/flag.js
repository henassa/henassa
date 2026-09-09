// Convertit un code pays ISO 3166-1 alpha-2 (ex: "fr", "dz") renvoyé par
// l'API Steam en emoji drapeau.
export function flagEmoji(code) {
  if (!code || code.length !== 2) return null;
  const A = 0x1f1e6;
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(A + (c.charCodeAt(0) - 65)))
    .join("");
}
