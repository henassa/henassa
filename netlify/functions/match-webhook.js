// netlify/functions/match-webhook.js
//
// Reçoit les events envoyés par MatchZy (matchzy_remote_log_url) pour
// un match CS2 en direct, et les stocke pour affichage sur /live.
//
// Configuration côté serveur CS2 (console ou fichier .cfg MatchZy) :
//   matchzy_remote_log_url "https://TONSITE/.netlify/functions/match-webhook"
//   matchzy_remote_log_header_key "Authorization"
//   matchzy_remote_log_header_value "Bearer TON_SECRET"
//
// Variables d'environnement à configurer sur Netlify :
//   MATCH_WEBHOOK_SECRET — doit être identique à la valeur mise dans
//     matchzy_remote_log_header_value côté serveur (sans "Bearer ").
//   VETO_ADMIN_PASSCODE — réutilisé ici pour l'opération "reset"
//     (même mot de passe admin que le veto).
//
// NOTE DE FIABILITÉ : structure confirmée par un vrai payload capturé
// (round_end avec team1/team2.{name,score,players[].stats}, player_death
// avec attacker_name/victim_name/weapon/headshot, bomb_planted avec
// site). Si un jour le score ou les noms ont l'air faux, regarde un
// event brut sur cette même URL (GET) pour ajuster.

import { getBlobStore } from "./_lib/blobStore.js";
import crypto from "node:crypto";

const KEY = "current";
const MAX_HISTORY = 300;
const MAX_KILLFEED = 20;

const EMPTY_STATE = { history: [], summary: null, killFeed: [], bombStatus: null };

function store() {
  return getBlobStore("live-match");
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ""));
  const bufB = Buffer.from(String(b ?? ""));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function extractScore(teamObj) {
  if (!teamObj) return null;
  return teamObj.score ?? teamObj.stats?.score ?? teamObj.seriesScore ?? null;
}

// Transforme la liste de joueur·ses d'une équipe (telle qu'envoyée dans
// team1.players/team2.players à chaque round_end) en lignes de
// scoreboard K/D/A lisibles.
function extractPlayers(teamObj) {
  if (!teamObj?.players) return null;
  return teamObj.players.map((p) => ({
    steamid: p.steamid,
    name: p.name,
    kills: p.stats?.kills ?? 0,
    deaths: p.stats?.deaths ?? 0,
    assists: p.stats?.assists ?? 0,
    headshotKills: p.stats?.headshot_kills ?? 0,
    mvp: p.stats?.mvp ?? 0,
  }));
}

function applyEvent(state, body) {
  const eventName = body?.event || "unknown";

  state.history.push({ event: eventName, at: Date.now(), payload: body });
  if (state.history.length > MAX_HISTORY) {
    state.history = state.history.slice(-MAX_HISTORY);
  }

  if (eventName === "series_start") {
    state.summary = {
      status: "live",
      team1Name: body.team1?.name || "Team 1",
      team2Name: body.team2?.name || "Team 2",
      team1Score: 0,
      team2Score: 0,
      numMaps: body.num_maps ?? null,
      roundsPlayed: 0,
      team1Players: null,
      team2Players: null,
    };
  }

  if (eventName === "round_end" || eventName === "map_result") {
    if (!state.summary) {
      state.summary = { status: "live", team1Name: "Team 1", team2Name: "Team 2", team1Score: 0, team2Score: 0 };
    }
    if (body.team1?.name) state.summary.team1Name = body.team1.name;
    if (body.team2?.name) state.summary.team2Name = body.team2.name;

    const s1 = extractScore(body.team1);
    const s2 = extractScore(body.team2);
    state.summary.team1Score = s1 ?? state.summary.team1Score ?? 0;
    state.summary.team2Score = s2 ?? state.summary.team2Score ?? 0;
    state.summary.roundsPlayed = body.round_number ?? state.history.filter((h) => h.event === "round_end").length;
    state.summary.status = "live";

    // Le scoreboard K/D/A vient des stats cumulées envoyées dans chaque
    // round_end — on garde la version la plus récente pour chaque équipe.
    const p1 = extractPlayers(body.team1);
    const p2 = extractPlayers(body.team2);
    if (p1) state.summary.team1Players = p1;
    if (p2) state.summary.team2Players = p2;

    // Un round vient de se terminer : la bombe (si posée) n'est plus
    // d'actualité.
    state.bombStatus = null;
  }

  if (eventName === "round_start") {
    state.bombStatus = null;
  }

  if (eventName === "bomb_planted") {
    state.bombStatus = { site: body.site || null, at: Date.now() };
  }

  if (eventName === "bomb_defused") {
    state.bombStatus = { defused: true, site: body.site || null, at: Date.now() };
  }

  if (eventName === "player_death") {
    state.killFeed ??= [];
    state.killFeed.push({
      killer: body.attacker_name || null,
      victim: body.victim_name || "?",
      weapon: body.weapon || null,
      headshot: !!body.headshot,
      suicide: !!body.is_suicide,
      at: Date.now(),
    });
    if (state.killFeed.length > MAX_KILLFEED) {
      state.killFeed = state.killFeed.slice(-MAX_KILLFEED);
    }
  }

  if (eventName === "map_result" || eventName === "series_end") {
    if (state.summary) state.summary.status = "done";
  }

  return state;
}

export const handler = async (event) => {
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod === "GET") {
    const state = (await store().get(KEY, { type: "json" })) || EMPTY_STATE;
    return { statusCode: 200, headers, body: JSON.stringify(state) };
  }

  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "json invalide" }) };
    }

    if (body.op === "reset") {
      if (!safeEqual(body.passcode, process.env.VETO_ADMIN_PASSCODE)) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: "mot de passe incorrect" }) };
      }
      await store().setJSON(KEY, EMPTY_STATE);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Opération de mise à jour manuelle (admin) — un scoreboard tenu à
    // la main, en roue de secours si le webhook MatchZy ne marche pas.
    if (body.op === "manual_set") {
      if (!safeEqual(body.passcode, process.env.VETO_ADMIN_PASSCODE)) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: "mot de passe incorrect" }) };
      }
      const state = (await store().get(KEY, { type: "json" })) || EMPTY_STATE;
      state.summary = {
        status: body.status === "done" ? "done" : "live",
        team1Name: body.team1Name || "Team 1",
        team2Name: body.team2Name || "Team 2",
        team1Score: Number(body.team1Score) || 0,
        team2Score: Number(body.team2Score) || 0,
        mapName: body.mapName || null,
        roundsPlayed: (Number(body.team1Score) || 0) + (Number(body.team2Score) || 0),
        manual: true,
      };
      state.history.push({ event: "manual_update", at: Date.now(), payload: state.summary });
      if (state.history.length > MAX_HISTORY) state.history = state.history.slice(-MAX_HISTORY);
      await store().setJSON(KEY, state);
      return { statusCode: 200, headers, body: JSON.stringify(state) };
    }

    // Sinon : un event envoyé par MatchZy. Vérifie le secret si configuré.
    if (process.env.MATCH_WEBHOOK_SECRET) {
      const auth = event.headers?.authorization || event.headers?.Authorization || "";
      const provided = auth.replace(/^Bearer\s+/i, "");
      if (!safeEqual(provided, process.env.MATCH_WEBHOOK_SECRET)) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: "non autorisé" }) };
      }
    }

    const state = (await store().get(KEY, { type: "json" })) || EMPTY_STATE;
    applyEvent(state, body);
    await store().setJSON(KEY, state);

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "méthode non supportée" }) };
};