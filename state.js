export const ÉTAT = {
  temps: 0,
  delta: 0,

  joueur: {
    position: { x: 0, y: 1, z: 0 },
    vitesse: 0.15
  },

  monde: {
    tailleChunk: 32,
    chunks: new Map()
  }
};
