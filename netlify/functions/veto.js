// netlify/functions/veto.js
//
// Toute la logique serveur du veto de map, dans une seule fonction pour
// rester simple. Le state est stocké dans Netlify Blobs (pas besoin de
// base de données externe) — une "session" = une partie de veto.
//
// Opérations (POST avec { op: "..." } dans le body, sauf "state" en GET) :
//   - create : l'admin configure et démarre une session (passcode requis)
//   - state  : lecture de l'état public d'une session (pas de token requis)
//   - act    : un capitaine ban/pick une map (token requis)
//   - reset  : l'admin supprime une session (passcode requis)
//
// Variables d'environnement à configurer sur Netlify :
//   VETO_ADMIN_PASSCODE — le mot de passe pour créer/reset une session.
//     Choisis-en un long et pas devinable (ce n'est pas juste un mot de
//     passe classique, c'est ce qui protège la création de sessions).
//   SITE_ORIGIN — l'URL exacte de ton site en prod (ex.
//     https://tonsite.netlify.app), pour restreindre les appels
//     cross-origin à la fonction.
//
// Chaque tour dure 30 secondes (TURN_SECONDS). Si personne n'agit à
// temps, le tour suivant "state" ou "act" reçu après l'expiration
// résout automatiquement le tour (première map restante) — pas besoin
// de tâche planifiée séparée.
//
// SÉCURITÉ :
//   - Le mot de passe admin et les tokens capitaines sont comparés en
//     temps constant (timingSafeEqual), pour empêcher de deviner un
//     caractère à la fois via le temps de réponse.
//   - Les tokens capitaines font 20 caractères aléatoires — les deviner
//     en brute-force à distance n'est pas réaliste.
//   - Un verrou anti-bruteforce bloque les tentatives de mot de passe
//     admin après 8 échecs, pendant 15 minutes.
//   - CORS restreint à SITE_ORIGIN — un autre site ne peut pas
//     déclencher d'appels cross-origin vers cette fonction depuis le
//     navigateur d'un visiteur.

import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const TURN_SECONDS = 30;
const LOCKOUT_MAX_ATTEMPTS = 8;
const LOCKOUT_WINDOW_MS = 60 * 60 * 1000; // 1h
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15min

const BO_FORMATS = {
  bo1: { label: "BO1", mapsNeeded: 1 },
  bo3: { label: "BO3", mapsNeeded: 3 },
  bo5: { label: "BO5", mapsNeeded: 5 },
};

function generateSequence(mapPoolSize, boFormat, starter) {
  const needed = BO_FORMATS[boFormat].mapsNeeded;
  const totalBans = mapPoolSize - needed;
  const totalPicks = needed - 1;
  const other = starter === "captain1" ? "captain2" : "captain1";

  const sequence = [];
  let actor = starter;
  for (let i = 0; i < totalBans; i++) {
    sequence.push({ step: sequence.length, actor, action: "ban" });
    actor = actor === starter ? other : starter;
  }
  for (let i = 0; i < totalPicks; i++) {
    sequence.push({ step: sequence.length, actor, action: "pick" });
    actor = actor === starter ? other : starter;
  }
  return sequence;
}

function randomId(len = 8) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Comparaison en temps constant, sans planter si les deux chaînes ont
// des longueurs différentes (auquel cas c'est simplement "faux").
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ""));
  const bufB = Buffer.from(String(b ?? ""));
  if (bufA.length !== bufB.length) {
    // Compare quand même contre un buffer de même taille pour éviter
    // de retourner instantanément (fuite de timing sur la longueur).
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function store() {
  return getStore("veto-sessions");
}

function metaStore() {
  return getStore("veto-meta");
}

async function checkLockout() {
  const lock = (await metaStore().get("admin-lockout", { type: "json" })) || {
    count: 0,
    windowStart: Date.now(),
    lockedUntil: 0,
  };
  if (lock.lockedUntil && Date.now() < lock.lockedUntil) {
    return { locked: true, retryAfterMs: lock.lockedUntil - Date.now() };
  }
  return { locked: false, lock };
}

async function recordFailedAttempt(lock) {
  const now = Date.now();
  if (now - lock.windowStart > LOCKOUT_WINDOW_MS) {
    lock.count = 0;
    lock.windowStart = now;
  }
  lock.count += 1;
  if (lock.count >= LOCKOUT_MAX_ATTEMPTS) {
    lock.lockedUntil = now + LOCKOUT_DURATION_MS;
    lock.count = 0;
  }
  await metaStore().setJSON("admin-lockout", lock);
}

async function clearLockout() {
  await metaStore().setJSON("admin-lockout", { count: 0, windowStart: Date.now(), lockedUntil: 0 });
}

// Résout automatiquement le tour en cours si son délai est dépassé.
// Peut résoudre plusieurs tours d'affilée (si personne n'a consulté la
// page depuis longtemps). Modifie `session` en place et retourne le
// nombre de tours résolus automatiquement.
function resolveTimeouts(session) {
  let resolved = 0;
  while (
    session.status === "live" &&
    session.turnDeadline &&
    Date.now() > session.turnDeadline
  ) {
    applyAction(session, session.remainingMaps[0], true);
    resolved++;
  }
  return resolved;
}

function applyAction(session, map, auto = false) {
  const step = session.sequence[session.currentStep];
  session.history.push({
    step: step.step,
    actor: step.actor,
    action: step.action,
    map,
    auto,
    at: Date.now(),
  });
  session.remainingMaps = session.remainingMaps.filter((m) => m !== map);
  session.currentStep += 1;

  if (session.currentStep >= session.sequence.length) {
    // Fin du veto : la ou les maps restantes sont le(s) decider(s).
    session.status = "done";
    session.turnDeadline = null;
    session.finalMaps = [
      ...session.history.filter((h) => h.action === "pick").map((h) => h.map),
      ...session.remainingMaps,
    ];
  } else {
    session.turnDeadline = Date.now() + TURN_SECONDS * 1000;
  }
}

// Vue publique d'une session : jamais les tokens des capitaines.
function publicView(session) {
  const { captain1Token, captain2Token, ...rest } = session;
  return rest;
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin;
  const allowedOrigin = process.env.SITE_ORIGIN;
  const cors = {
    "Content-Type": "application/json",
    ...(allowedOrigin && origin === allowedOrigin
      ? { "Access-Control-Allow-Origin": allowedOrigin, Vary: "Origin" }
      : {}),
  };

  try {
    if (event.httpMethod === "GET") {
      const id = event.queryStringParameters?.id;
      if (!id) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "id requis" }) };

      const session = await store().get(id, { type: "json" });
      if (!session) {
        return { statusCode: 404, headers: cors, body: JSON.stringify({ error: "session introuvable" }) };
      }

      resolveTimeouts(session);
      await store().setJSON(id, session);

      return { statusCode: 200, headers: cors, body: JSON.stringify(publicView(session)) };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      if (body.op === "create") {
        const { locked, retryAfterMs, lock } = await checkLockout();
        if (locked) {
          return {
            statusCode: 429,
            headers: cors,
            body: JSON.stringify({ error: `trop de tentatives, réessaie dans ${Math.ceil(retryAfterMs / 60000)} min` }),
          };
        }
        if (!safeEqual(body.passcode, process.env.VETO_ADMIN_PASSCODE)) {
          await recordFailedAttempt(lock);
          return { statusCode: 403, headers: cors, body: JSON.stringify({ error: "mot de passe incorrect" }) };
        }
        await clearLockout();

        const { boFormat, mapPool, starter } = body;
        if (!BO_FORMATS[boFormat]) {
          return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "format invalide" }) };
        }
        const needed = BO_FORMATS[boFormat].mapsNeeded;
        if (!Array.isArray(mapPool) || mapPool.length < needed) {
          return {
            statusCode: 400,
            headers: cors,
            body: JSON.stringify({ error: `il faut au moins ${needed} maps dans le pool` }),
          };
        }

        const id = randomId();
        const sortedPool = [...mapPool].sort((a, b) => a.localeCompare(b));
        const sequence = generateSequence(sortedPool.length, boFormat, starter === "captain2" ? "captain2" : "captain1");
        const session = {
          id,
          status: "live",
          boFormat,
          mapPool: sortedPool,
          remainingMaps: [...sortedPool],
          sequence,
          currentStep: 0,
          history: [],
          finalMaps: null,
          turnDeadline: Date.now() + TURN_SECONDS * 1000,
          turnSeconds: TURN_SECONDS,
          captain1Token: randomId(20),
          captain2Token: randomId(20),
          createdAt: Date.now(),
        };

        await store().setJSON(id, session);
        return {
          statusCode: 200,
          headers: cors,
          body: JSON.stringify({
            id,
            captain1Token: session.captain1Token,
            captain2Token: session.captain2Token,
          }),
        };
      }

      if (body.op === "act") {
        const { id, token, map } = body;
        const session = await store().get(id, { type: "json" });
        if (!session) {
          return { statusCode: 404, headers: cors, body: JSON.stringify({ error: "session introuvable" }) };
        }

        resolveTimeouts(session);

        if (session.status !== "live") {
          await store().setJSON(id, session);
          return { statusCode: 409, headers: cors, body: JSON.stringify({ error: "veto terminé", state: publicView(session) }) };
        }

        const step = session.sequence[session.currentStep];
        const expectedToken = step.actor === "captain1" ? session.captain1Token : session.captain2Token;

        if (!safeEqual(token, expectedToken)) {
          await store().setJSON(id, session);
          return { statusCode: 403, headers: cors, body: JSON.stringify({ error: "ce n'est pas ton tour" }) };
        }
        if (typeof map !== "string" || !session.remainingMaps.includes(map)) {
          await store().setJSON(id, session);
          return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "map indisponible" }) };
        }

        applyAction(session, map, false);
        await store().setJSON(id, session);
        return { statusCode: 200, headers: cors, body: JSON.stringify(publicView(session)) };
      }

      if (body.op === "reset") {
        const { locked, retryAfterMs, lock } = await checkLockout();
        if (locked) {
          return {
            statusCode: 429,
            headers: cors,
            body: JSON.stringify({ error: `trop de tentatives, réessaie dans ${Math.ceil(retryAfterMs / 60000)} min` }),
          };
        }
        const { id, passcode } = body;
        if (!safeEqual(passcode, process.env.VETO_ADMIN_PASSCODE)) {
          await recordFailedAttempt(lock);
          return { statusCode: 403, headers: cors, body: JSON.stringify({ error: "mot de passe incorrect" }) };
        }
        await clearLockout();
        await store().delete(id);
        return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
      }

      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "opération inconnue" }) };
    }

    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: "méthode non supportée" }) };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) };
  }
};
