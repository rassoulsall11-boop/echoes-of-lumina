// ===============================
// XEROX – GAME LOOP
// ===============================

import { renderer, scene, camera } from './moteur.js';
import { updateJoueur } from './joueur.js';
import { updateMonde } from './monde.js';
import { ÉTAT } from './état.js';

let lastTime = 0;

export function loop(input) {
  requestAnimationFrame((time) => frame(time, input));
}

function frame(time, input) {
  // ===============================
  // DELTA TIME (en secondes)
  // ===============================
  const deltaMs = time - lastTime;
  lastTime = time;

  // Clamp pour éviter les gros lags
  ÉTAT.delta = Math.min(deltaMs / 1000, 0.033); // max ~30 FPS
  ÉTAT.temps += ÉTAT.delta;

  // ===============================
  // UPDATE LOGIC
  // ===============================
  updateJoueur(input, ÉTAT.delta);
  updateMonde();

  // ===============================
  // RENDER
  // ===============================
  renderer.render(scene, camera);

  requestAnimationFrame((t) => frame(t, input));
}
