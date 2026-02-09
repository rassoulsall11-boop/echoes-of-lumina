import { renderer, scene, camera } from './moteur.js';
import { updateJoueur } from './joueur.js';
import { updateMonde } from './monde.js';
import { ÉTAT } from './état.js';

export function loop(input) {
  function frame(time) {
    ÉTAT.delta = time - ÉTAT.temps;
    ÉTAT.temps = time;

    updateJoueur(input);
    updateMonde(scene.children.find(o => o.isMesh && o.geometry.type === "SphereGeometry"));

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
