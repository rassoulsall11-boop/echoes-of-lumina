import { initMoteur } from './moteur.js';
import { initJoueur } from './joueur.js';
import { initUI } from './ui.js';
import { loop } from './boucle.js';

const canvas = document.getElementById('game');

export const input = {
  z: false,
  q: false,
  s: false,
  d: false
};

window.addEventListener('keydown', e => {
  if (e.key === 'z') input.z = true;
  if (e.key === 's') input.s = true;
  if (e.key === 'q') input.q = true;
  if (e.key === 'd') input.d = true;
});

window.addEventListener('keyup', e => {
  if (e.key === 'z') input.z = false;
  if (e.key === 's') input.s = false;
  if (e.key === 'q') input.q = false;
  if (e.key === 'd') input.d = false;
});

initMoteur(canvas);
initJoueur();
initUI();
loop(input);
