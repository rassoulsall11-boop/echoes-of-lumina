// ===============================
// XEROX – MAIN (Point d’entrée)
// ===============================

import { initMoteur } from './moteur.js';
import { initJoueur } from './joueur.js';
import { initUI } from './ui.js';
import { loop } from './boucle.js';

// ===============================
// CANVAS
// ===============================
const canvas = document.getElementById('game');

// ===============================
// INPUT CLAVIER
// ===============================
export const input = {
  z: false,
  q: false,
  s: false,
  d: false,
  shift: false
};

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyZ':
    case 'ArrowUp':
      input.z = true;
      break;

    case 'KeyS':
    case 'ArrowDown':
      input.s = true;
      break;

    case 'KeyQ':
    case 'ArrowLeft':
      input.q = true;
      break;

    case 'KeyD':
    case 'ArrowRight':
      input.d = true;
      break;

    case 'ShiftLeft':
    case 'ShiftRight':
      input.shift = true;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyZ':
    case 'ArrowUp':
      input.z = false;
      break;

    case 'KeyS':
    case 'ArrowDown':
      input.s = false;
      break;

    case 'KeyQ':
    case 'ArrowLeft':
      input.q = false;
      break;

    case 'KeyD':
    case 'ArrowRight':
      input.d = false;
      break;

    case 'ShiftLeft':
    case 'ShiftRight':
      input.shift = false;
      break;
  }
});

// ===============================
// INITIALISATION
// ===============================
initMoteur(canvas);
initJoueur();
initUI();

// ===============================
// LANCEMENT BOUCLE
// ===============================
loop(input);
