// ===============================
// XEROX – BOUCLE DE JEU INTEGRÉE
// ===============================

import { renderer, scene, camera } from './engine.js';
import { updateJoueur, playerMesh } from './player.js';
import { updateMonde } from './monde.js';
import { updateEnnemis } from './ennemi.js';
import { updateReliques } from './relics.js';
import { updateParticles } from './particles.js';
import { updateUI, showEndOverlay } from './ui.js';
import { STATE } from './state.js';
import { audio } from './audio.js';

let lastTime = 0;
let isGameOver = false;

export function startLoop() {
  function frame(time) {
    if (!lastTime) lastTime = time;
    const delta = Math.min((time - lastTime) / 1000, 0.1);
    STATE.delta = delta;
    STATE.temps = time;
    lastTime = time;

    if (!isGameOver) {
      // Updates
      updateJoueur(delta);
      updateEnnemis(playerMesh);
      updateReliques(playerMesh);
      updateMonde(playerMesh);
      updateParticles(delta);
      updateUI();

      // Condition Défaite (PV = 0)
      if (STATE.joueur.pv <= 0) {
        isGameOver = true;
        showEndOverlay(
          "ANOMALIE SYSTÈME",
          "La matrice du joueur a été corrompue par les entités. Cliquez pour réinitialiser la boucle."
        );
      }

      // Condition Victoire (Toutes les 3 reliques activées)
      if (STATE.monde.relicsActivees >= 3) {
        isGameOver = true;
        audio.playVictory();
        showEndOverlay(
          "HARMONIE RETROUVÉE",
          "Tous les Sceaux de la Mémoire ont été scellés. Le monde de Xerox se souviendra de vos actes.",
          true
        );
      }
    }

    // Render 3D
    renderer.render(scene, camera);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

export const loop = startLoop;
