// ===============================
// XEROX – POINT D'ENTRÉE PRINCIPAL
// ===============================

import { initMoteur } from './engine.js';
import { initWorld } from './monde.js';
import { initBiome } from './biome.js';
import { initJoueur } from './player.js';
import { initEnnemis } from './ennemi.js';
import { initReliques } from './relics.js';
import { initUI } from './ui.js';
import { startLoop } from './boucle.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');

  // Initialisation complète
  initMoteur(canvas);
  initBiome();
  initWorld();
  initJoueur();
  initReliques();
  initEnnemis();
  initUI();

  // Lancement de la boucle principale
  startLoop();
});
