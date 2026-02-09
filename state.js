// ===============================
// ÉTAT GLOBAL – XEROX
// Mémoire du monde
// ===============================

export const ÉTAT = {
  // --- TEMPS ---
  temps: 0,          // temps total écoulé
  delta: 0,          // delta time frame
  seed: Math.floor(Math.random() * 999999), // seed procédural

  // --- MODE JEU ---
  mode: 'MENU',      // MENU | PLAY | PAUSE | OVER

  // --- JOUEUR ---
  joueur: {
    position: { x: 0, y: 1, z: 0 },
    rotation: { y: 0 },
    vitesse: 0.15,

    stats: {
      vie: 100,
      vieMax: 100,
      énergie: 100,
      énergieMax: 100,
      stamina: 100
    },

    état: {
      intangible: false,
      fatigue: 0
    },

    progression: {
      niveau: 1,
      expérience: 0
    }
  },

  // --- MONDE ---
  monde: {
    tailleChunk: 32,
    distanceVisible: 3, // nombre de chunks autour du joueur
    chunks: new Map(),  // chunks actifs
    biomesDécouverts: new Set()
  },

  // --- MÉMOIRE DU MONDE ---
  mémoire: {
    événements: [], // choix majeurs
    zonesAltérées: new Set(), // zones modifiées par le joueur
    PNJ: {} // état persistant des PNJ
  },

  // --- QUÊTES ---
  quêtes: {
    actives: [],
    terminées: [],
    cachées: []
  },

  // --- DEBUG ---
  debug: false
};
