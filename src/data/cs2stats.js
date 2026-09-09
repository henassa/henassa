// ─────────────────────────────────────────────────────────────
// STATS CS2 CUSTOMS — une ligne = une personne sur UNE map d'une
// session. La page /customs additionne tout ça par pseudo (maps
// jouées, K/D, ADR moyen, winrate...).
//
// `steamId` (steamId64) sert à deux choses : le pseudo devient cliquable
// vers le profil Steam, et si tu as configuré la clé API Steam
// (STEAM_API_KEY sur Netlify), la nationalité s'affiche automatiquement.
//
// `faceitNickname` : si configuré (+ clé FACEIT_API_KEY sur Netlify),
// l'elo Faceit actuel s'affiche automatiquement — pas besoin de le
// mettre à jour à la main, il est allé chercher en direct.
//
// `win` : true si cette personne a gagné CETTE map.
// ─────────────────────────────────────────────────────────────

export const cs2stats = [
  {
    session: "08/09/2026",
    pseudo: "exemple",
    steamId: "76561198000000000",
    faceitNickname: "",
    kills: 20,
    deaths: 15,
    adr: 85.4,
    rating: 1.1,
    win: true,
  },
];