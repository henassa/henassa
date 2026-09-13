// ─────────────────────────────────────────────────────────────
// ABOUT ME — contenu de la fenêtre "À propos". Laisse un champ vide
// et l'élément correspondant ne s'affiche pas.
//
// `discordId` : ton ID Discord (clic droit sur ton profil → "Copier
// l'ID utilisateur", faut activer le mode développeur dans les
// paramètres Discord). Sert à afficher ton avatar ET ton statut en
// direct (en ligne / absent / ne pas déranger / hors ligne) via
// l'API publique Lanyard — gratuite, sans clé, mais il faut avoir
// rejoint leur serveur Discord une fois pour que ton statut soit
// suivi : https://discord.gg/lanyard
//
// `githubUsername` : ton pseudo GitHub, sert aussi à la fenêtre
// "GitHub Contributions" (liste de tes repos publics).
// ─────────────────────────────────────────────────────────────

export const about = {
  discordId: "",
  githubUsername: "",
  name: "",
  pronouns: "",
  bio: "",
  socials: [
    // { label: "Twitter", icon: "https://win98icons.alexmeub.com/icons/png/msn3-4.png", url: "https://twitter.com/..." },
  ],
};
