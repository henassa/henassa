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
// NOTE DE FIABILITÉ : les noms d'events (round_end, map_result,
// series_start, series_end) viennent du code source public de MatchZy,
// mais la structure exacte des champs peut varier selon la version du
// plugin. Le flux d'events brut (`history`) est TOUJOURS fidèle à ce
// que MatchZy envoie. Le `summary` (score affiché en gros) est calculé
// en best-effort à partir de plusieurs noms de champs plausibles — s'il
// affiche un score qui a l'air faux, il faut regarder un event brut
// capturé en vrai pour ajuster l'extraction.
//
// Connu : matchzy_remote_log_url a eu des bugs de prise en compte via
// rcon dans certaines versions (issue GitHub #369) — si rien n'arrive
// ici après config, vérifie dans la console du serveur que la valeur a
// bien été appliquée (matchzy_remote_log_url sans argument pour la
// lire), et regarde les logs serveur au moment d'un round_end.

import { getBlobStore } from "./_lib/blobStore.js";
import crypto from "node:crypto";

const KEY = "current";
const MAX_HISTORY = 300;

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

// Best-effort : essaie plusieurs chemins plausibles pour un score
// d'équipe selon l'event reçu, sans jamais planter si absent.
function extractScore(teamObj) {
  if (!teamObj) return null;
  return teamObj.score ?? teamObj.stats?.score ?? teamObj.seriesScore ?? null;
}

function extractName(teamObj) {
  if (!teamObj) return null;
  return teamObj.name ?? teamObj.team?.name ?? null;
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
      team1Name: extractName(body.team1) || "Team 1",
      team2Name: extractName(body.team2) || "Team 2",
      team1Score: 0,
      team2Score: 0,
      numMaps: body.num_maps ?? null,
      roundsPlayed: 0,
    };
  }

  if (eventName === "round_end") {
    if (!state.summary) state.summary = { status: "live", team1Name: "Team 1", team2Name: "Team 2" };
    const s1 = extractScore(body.team1);
    const s2 = extractScore(body.team2);
    state.summary.team1Score = s1 ?? state.summary.team1Score ?? 0;
    state.summary.team2Score = s2 ?? state.summary.team2Score ?? 0;
    state.summary.roundsPlayed = state.history.filter((h) => h.event === "round_end").length;
    state.summary.status = "live";
  }

  if (eventName === "map_result" || eventName === "series_end") {
    if (state.summary) state.summary.status = "done";
  }

  return state;
}

export const handler = async (event) => {
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod === "GET") {
    const state = (await store().get(KEY, { type: "json" })) || { history: [], summary: null };
    return { statusCode: 200, headers, body: JSON.stringify(state) };
  }

  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "json invalide" }) };
    }

    // Opération de reset (admin), distincte des events MatchZy.
    if (body.op === "reset") {
      if (!safeEqual(body.passcode, process.env.VETO_ADMIN_PASSCODE)) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: "mot de passe incorrect" }) };
      }
      await store().setJSON(KEY, { history: [], summary: null });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Sinon : un event envoyé par MatchZy. Vérifie le secret si configuré.
    if (process.env.MATCH_WEBHOOK_SECRET) {
      const auth = event.headers?.authorization || event.headers?.Authorization || "";
      const provided = auth.replace(/^Bearer\s+/i, "");
      if (!safeEqual(provided, process.env.MATCH_WEBHOOK_SECRET)) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: "non autorisé" }) };
      }
    }

    const state = (await store().get(KEY, { type: "json" })) || { history: [], summary: null };
    applyEvent(state, body);
    await store().setJSON(KEY, state);

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "méthode non supportée" }) };
};