// ===============================
// XEROX – BOUCLE DE JEU
// ===============================

import { renderer, scene, camera } from './moteur.js';
import { updateJoueur, joueurMesh } from './joueur.js';
import { updateMonde } from './monde.js';
import { updateEnnemis } from './ennemis.js';
import { ÉTAT } from './état.js';

export function loop(input) {

  function frame(time) {
    // ===============================
    // TEMPS
    // ===============================
    ÉTAT.delta = (time - ÉTAT.temps) || 16;
    ÉTAT.temps = time;

    // ===============================
    // UPDATE LOGIQUE
    // ===============================
    updateJoueur(input);
    updateMonde(joueurMesh);
    updateEnnemis(joueurMesh);

    // ===============================
    // RENDU
    // ===============================
    renderer.render(scene, camera);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
