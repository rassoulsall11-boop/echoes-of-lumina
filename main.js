// ===============================
// XEROX – POINT D'ENTRÉE PRINCIPAL
// ===============================

import { initMoteur } from './engine.js';
import { initWorld } from './monde.js';
import { initBiome } from './biome.js';
import { initJoueur } from './player.js';
import { initEnnemis } from './ennemi.js';
import { initUI } from './ui.js';
import { startLoop } from './boucle.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');

  // Initialisation ordonnée
  initMoteur(canvas);
  initBiome();
  initWorld();
  initJoueur();
  initEnnemis();
  initUI();

  // Lancement du jeu
  startLoop();
});
