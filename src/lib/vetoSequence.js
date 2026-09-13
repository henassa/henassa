// ─────────────────────────────────────────────────────────────
// SÉQUENCE DE VETO — calcule l'ordre ban/pick à partir du nombre de
// maps dans le pool et du format (BO1/BO3/BO5).
//
// Principe : bans en alternance jusqu'à ce qu'il reste tout juste assez
// de maps pour les picks + le decider, puis picks en alternance. La
// toute dernière map restante devient le "decider" (pas d'action dessus,
// elle est jouée automatiquement).
//
// Ex. 7 maps, BO1 (1 map à obtenir) → 6 bans (3 chacun), 0 pick, 1 decider.
// Ex. 7 maps, BO3 (3 maps) → 4 bans (2 chacun), 2 picks (1 chacun), 1 decider.
// Ex. 7 maps, BO5 (5 maps) → 2 bans (1 chacun), 4 picks (2 chacun), 1 decider.
// ─────────────────────────────────────────────────────────────

export const BO_FORMATS = {
  bo1: { label: "BO1", mapsNeeded: 1 },
  bo3: { label: "BO3", mapsNeeded: 3 },
  bo5: { label: "BO5", mapsNeeded: 5 },
};

// Vérifie que le pool est cohérent avec le format choisi.
export function validatePool(mapPool, boFormat) {
  const needed = BO_FORMATS[boFormat]?.mapsNeeded;
  if (!needed) return "Format invalide.";
  if (!mapPool || mapPool.length < needed) {
    return `Il faut au moins ${needed} map${needed > 1 ? "s" : ""} dans le pool pour du ${BO_FORMATS[boFormat].label}.`;
  }
  return null;
}

// Retourne la séquence d'actions : [{ step, actor: "captain1"|"captain2", action: "ban"|"pick" }, ...]
export function generateSequence(mapPoolSize, boFormat, starter = "captain1") {
  const needed = BO_FORMATS[boFormat].mapsNeeded;
  const totalBans = mapPoolSize - needed;
  const totalPicks = needed - 1; // la dernière map restante = decider, pas d'action
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
