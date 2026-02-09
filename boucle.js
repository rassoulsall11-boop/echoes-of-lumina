import { renderer, scene, camera } from './moteur.js';
import { updateJoueur, joueurMesh } from './joueur.js';
import { updateMonde } from './monde.js';
import { ÉTAT } from './état.js';

export function loop(input) {
  function frame(time) {
    ÉTAT.delta = time - ÉTAT.temps;
    ÉTAT.temps = time;

    updateJoueur(input);
    updateMonde(joueurMesh);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
