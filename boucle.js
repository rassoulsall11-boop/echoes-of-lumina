// ===============================
// XEROX – BOUCLE DE JEU (Game Loop)
// ===============================

import { renderer, scene, camera } from './engine.js';
import { updateJoueur, playerMesh } from './player.js';
import { updateMonde } from './monde.js';
import { updateEnnemis } from './ennemi.js';
import { updateUI } from './ui.js';
import { STATE } from './state.js';

let lastTime = 0;

export function startLoop() {
  function frame(time) {
    if (!lastTime) lastTime = time;
    STATE.delta = (time - lastTime) / 1000; // Delta time en secondes
    STATE.temps = time;
    lastTime = time;

    // Updates
    updateJoueur();
    updateEnnemis(playerMesh);
    updateMonde(playerMesh);
    updateUI();

    // Render
    renderer.render(scene, camera);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

export const loop = startLoop;
