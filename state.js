// ===============================
// XEROX – ÉTAT GLOBAL DU JEU
// ===============================

export const STATE = {
  temps: 0,
  delta: 0,
  joueur: {
    pv: 100,
    pvMax: 100,
    vitesse: 0.15,
    position: { x: 0, y: 1, z: 0 },
    attaqueEnCours: false,
    invulnerableTimer: 0
  },
  monde: {
    tailleChunk: 20,
    chunks: new Map(),
    memory: {
      ennemisVaincus: 0,
      ennemisEpargnes: 0,
      choixDernier: "Aventures dans le néant"
    }
  },
  input: {
    z: false,
    q: false,
    s: false,
    d: false,
    space: false,
    attackTriggered: false
  }
};

// Alias pour compatibilité
export const ÉTAT = STATE;
