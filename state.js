// ===============================
// XEROX – ÉTAT GLOBAL DU JEU
// Source de vérité unique
// ===============================

export const ÉTAT = {
  // ===========================
  // TEMPS / LOOP
  // ===========================
  temps: 0,
  delta: 0,

  // ===========================
  // ÉTAT DU JEU
  // ===========================
  jeuDémarré: false,
  pause: false,

  // ===========================
  // JOUEUR
  // ===========================
  joueur: {
    position: {
      x: 0,
      y: 1,
      z: 0
    },

    vitesse: 0.15,

    stats: {
      vie: 100,
      vieMax: 100,
      énergie: 100,
      énergieMax: 100
    },

    état: {
      intangible: false,
      vivant: true
    }
  },

  // ===========================
  // MONDE
  // ===========================
  monde: {
    tailleChunk: 32,
    distanceActive: 1, // rayon de chunks chargés autour du joueur
    chunks: new Map()
  },

  // ===========================
  // DEBUG / DEV
  // ===========================
  debug: {
    afficherChunks: false,
    afficherPosition: false
  }
};
