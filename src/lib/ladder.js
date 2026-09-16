import { players } from "../data/players";
import { matches } from "../data/matches";

// ─────────────────────────────────────────────────────────────
// Applique la règle du règlement à l'historique des matchs pour
// calculer le classement d'un ladder — rien n'est tapé à la main
// dans players.js, tout part d'ici.
//   • tout le monde démarre à 1000
//   • victoire d'une map : +60, défaite : -60
//   • MVP de la map (meilleur rating du match) : +30 en plus
//   • série de plus de 2 victoires d'affilée : +10 en plus à partir
//     de la 3e victoire consécutive (remis à zéro à la 1re défaite)
// ─────────────────────────────────────────────────────────────

const START_ELO = 1000;
const WIN_ELO = 60;
const LOSE_ELO = 60;
const MVP_ELO = 30;
const STREAK_BONUS = 10;
const STREAK_THRESHOLD = 2; // bonus dès que streak > 2, donc à la 3e victoire

// Classement complet d'un ladder (jeu + mixte/féminin), trié par elo.
// Calcule aussi, pour chaque personne, `matchDeltas`  — la variation
// d'elo exacte qu'elle a eue à CHAQUE match (utile pour l'historique
// d'un profil), en tenant compte du bonus de série au bon moment.
export function computeStandings(gameId, ladder) {
  const roster = players.filter((p) => p.game === gameId && p.ladder === ladder);
  const stats = {};
  roster.forEach((p) => {
    stats[p.id] = { ...p, elo: START_ELO, wins: 0, losses: 0, mvps: 0, streak: 0, matchDeltas: {} };
  });

  matches
    .filter((m) => m.game === gameId && m.ladder === ladder)
    .forEach((m) => {
      const team1Won = m.team1.score > m.team2.score;
      const winners = team1Won ? m.team1.players : m.team2.players;
      const losers = team1Won ? m.team2.players : m.team1.players;
      const deltas = {};

      winners.forEach((pid) => {
        if (!stats[pid]) return;
        stats[pid].streak += 1;
        let delta = WIN_ELO;
        if (stats[pid].streak > STREAK_THRESHOLD) delta += STREAK_BONUS;
        deltas[pid] = (deltas[pid] || 0) + delta;
        stats[pid].wins += 1;
      });
      losers.forEach((pid) => {
        if (!stats[pid]) return;
        stats[pid].streak = 0;
        deltas[pid] = (deltas[pid] || 0) - LOSE_ELO;
        stats[pid].losses += 1;
      });
      if (m.mvp && stats[m.mvp]) {
        deltas[m.mvp] = (deltas[m.mvp] || 0) + MVP_ELO;
        stats[m.mvp].mvps += 1;
      }

      Object.entries(deltas).forEach(([pid, delta]) => {
        stats[pid].elo += delta;
        stats[pid].matchDeltas[m.id] = delta;
      });
    });

  // delta = évolution nette depuis le départ (1000) — affiché genre
  // "1090 (+90)" à côté de l'elo dans le ladder.
  Object.values(stats).forEach((s) => {
    s.delta = s.elo - START_ELO;
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