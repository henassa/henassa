// ─────────────────────────────────────────────────────────────
// STATS CS2 CUSTOMS — une ligne = une personne pour UNE SESSION
// (un lot de maps jouées ensemble, ex. une soirée de customs). La page
// /customs additionne tout ça par pseudo (maps jouées, K/D, ADR moyen,
// winrate...) à travers toutes les sessions.
//
// `steamId` (steamId64) sert à deux choses : le pseudo devient cliquable
// vers le profil Steam, et sert de clé pour l'elo Faceit (voir
// netlify/functions/faceit-elo.js).
//
// `faceitNickname` n'est plus utilisé pour la recherche (on cherche via
// steamId maintenant, plus fiable) — tu peux le laisser vide.
//
// `maps` : nombre de maps jouées pendant cette session.
// `wins` : nombre de maps gagnées pendant cette session (donc
// wins/maps = winrate de cette session pour cette personne).
// ─────────────────────────────────────────────────────────────

export const cs2stats = [
  { session: "13/09/2026", pseudo: "sacha", steamId: "76561199090147744", faceitNickname: "", kills: 4, deaths: 25, adr: 33.4, rating: 0.28, maps: 2, wins: 1 },
  { session: "13/09/2026", pseudo: "zohraa-", steamId: "76561198123365503", faceitNickname: "", kills: 72, deaths: 60, adr: 86.0, rating: 1.25, maps: 5, wins: 2 },
  { session: "13/09/2026", pseudo: "félix", steamId: "76561198151064204", faceitNickname: "", kills: 84, deaths: 47, adr: 91.8, rating: 1.44, maps: 5, wins: 4 },
  { session: "13/09/2026", pseudo: "sayga", steamId: "76561198025946650", faceitNickname: "", kills: 96, deaths: 53, adr: 114.6, rating: 1.71, maps: 5, wins: 3 },
  { session: "13/09/2026", pseudo: "lsr", steamId: "76561198149308963", faceitNickname: "", kills: 63, deaths: 66, adr: 83.9, rating: 1.08, maps: 5, wins: 3 },
  { session: "13/09/2026", pseudo: "calico", steamId: "76561198204597792", faceitNickname: "", kills: 13, deaths: 33, adr: 44.6, rating: 0.4, maps: 2, wins: 0 },
  { session: "13/09/2026", pseudo: "zen", steamId: "76561198877467745", faceitNickname: "", kills: 26, deaths: 30, adr: 77.2, rating: 1.04, maps: 2, wins: 0 },
  { session: "13/09/2026", pseudo: "0xa0", steamId: "76561198113356567", faceitNickname: "", kills: 32, deaths: 34, adr: 77.6, rating: 1.07, maps: 3, wins: 1 },
  { session: "13/09/2026", pseudo: "katka", steamId: "76561198037161388", faceitNickname: "", kills: 37, deaths: 24, adr: 111.8, rating: 1.63, maps: 2, wins: 1 },
  { session: "13/09/2026", pseudo: "stannah", steamId: "76561198016931975", faceitNickname: "", kills: 5, deaths: 15, adr: 44.2, rating: 0.45, maps: 1, wins: 0 },
  { session: "13/09/2026", pseudo: "lune", steamId: "76561198118146069", faceitNickname: "", kills: 44, deaths: 38, adr: 98.4, rating: 1.26, maps: 3, wins: 2 },
  { session: "13/09/2026", pseudo: "kyra", steamId: "76561199586455292", faceitNickname: "", kills: 19, deaths: 75, adr: 24.0, rating: 0.21, maps: 5, wins: 1 },
  { session: "13/09/2026", pseudo: "aluaa", steamId: "76561198975050006", faceitNickname: "", kills: 24, deaths: 40, adr: 52.4, rating: 0.68, maps: 3, wins: 2 },
  { session: "13/09/2026", pseudo: "nepo", steamId: "76561198147626457", faceitNickname: "", kills: 22, deaths: 27, adr: 68.1, rating: 0.92, maps: 2, wins: 1 },
  { session: "13/09/2026", pseudo: "liquidz", steamId: "76561198935677261", faceitNickname: "", kills: 34, deaths: 21, adr: 108.0, rating: 1.63, maps: 2, wins: 2 },
  { session: "13/09/2026", pseudo: "xagro", steamId: "76561198372275494", faceitNickname: "", kills: 30, deaths: 22, adr: 80.2, rating: 1.31, maps: 2, wins: 2 },
  { session: "13/09/2026", pseudo: "phaayte", steamId: "76561198113791453", faceitNickname: "", kills: 3, deaths: 7, adr: 22.4, rating: 0.69, maps: 1, wins: 0 },
  { session: "13/09/2026", pseudo: "togrqm", steamId: "76561198143478066", faceitNickname: "", kills: 9, deaths: 15, adr: 59.1, rating: 0.78, maps: 1, wins: 0 },
];