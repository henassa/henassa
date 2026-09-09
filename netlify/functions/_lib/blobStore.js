// netlify/functions/_lib/blobStore.js
//
// Netlify Blobs est censé s'auto-configurer tout seul en prod (siteID +
// token injectés automatiquement dans le runtime des fonctions). Il y a
// cependant un bug plateforme connu (MissingBlobsEnvironmentError) où
// cette injection échoue parfois de façon intermittente, même quand le
// code est correct — voir https://github.com/netlify/blobs/issues/175
// et les forums Netlify sur "MissingBlobsEnvironmentError in Production".
//
// Pour contourner ça, on fournit les identifiants À LA MAIN dès qu'ils
// sont disponibles, sans dépendre de l'auto-injection. Variables
// d'environnement à ajouter sur Netlify :
//
//   BLOBS_SITE_ID    — Site settings → General → Site details → Site ID
//   BLOBS_TOKEN      — User settings (avatar en haut à droite) →
//                       Applications → Personal access tokens →
//                       "New access token" (copie-le tout de suite,
//                       affiché une seule fois)
//
// Si ces deux variables ne sont pas configurées, on retombe sur
// l'auto-injection standard (ce qui marche très bien en local avec
// `netlify dev`, et parfois en prod aussi).

import { getStore } from "@netlify/blobs";

export function getBlobStore(name) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;

  if (siteID && token) {
    return getStore({ name, siteID, token });
  }

  return getStore(name);
}