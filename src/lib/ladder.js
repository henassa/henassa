import { players } from "../data/players";
import { matches } from "../data/matches";

// ─────────────────────────────────────────────────────────────
// Applique la règle du règlement à l'historique des matchs pour
// calculer le classement d'un ladder — rien n'est tapé à la main
// dans players.js, tout part d'ici.
//   • tout le monde démarre à 1000
//   • victoire d'une map : +60, défaite : -60
//   • MVP de la map (meilleur rating du match) : +30 en plus
// ─────────────────────────────────────────────────────────────

const START_ELO = 1000;
const WIN_ELO = 60;
const LOSE_ELO = 60;
const MVP_ELO = 30;

// Classement complet d'un ladder (jeu + mixte/féminin), trié par elo.
export function computeStandings(gameId, ladder) {
  const roster = players.filter((p) => p.game === gameId && p.ladder === ladder);
  const stats = {};
  roster.forEach((p) => {
    stats[p.id] = { ...p, elo: START_ELO, wins: 0, losses: 0, mvps: 0 };
  });

  matches
    .filter((m) => m.game === gameId && m.ladder === ladder)
    .forEach((m) => {
      const team1Won = m.team1.score > m.team2.score;
      const winners = team1Won ? m.team1.players : m.team2.players;
      const losers = team1Won ? m.team2.players : m.team1.players;

      winners.forEach((pid) => {
        if (stats[pid]) {
          stats[pid].elo += WIN_ELO;
          stats[pid].wins += 1;
        }
      });
      losers.forEach((pid) => {
        if (stats[pid]) {
          stats[pid].elo -= LOSE_ELO;
          stats[pid].losses += 1;
        }
      });
      if (m.mvp && stats[m.mvp]) {
        stats[m.mvp].elo += MVP_ELO;
        stats[m.mvp].mvps += 1;
      }
    });

  return Object.values(stats).sort((a, b) => b.elo - a.elo);
}

// Fiche calculée d'UNE personne (retrouve son jeu/ladder toute seule).
export function getPlayerStanding(playerId) {
  const p = players.find((pl) => pl.id === playerId);
  if (!p) return null;
  const standings = computeStandings(p.game, p.ladder);
  return standings.find((s) => s.id === playerId) || null;
}