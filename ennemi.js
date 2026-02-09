import { scene } from './moteur.js';

export let ennemi;

export function spawnEnnemi() {
  const geo = new THREE.CapsuleGeometry(0.4, 1.2);
  const mat = new THREE.MeshStandardMaterial({ color: 0x552222 });
  ennemi = new THREE.Mesh(geo, mat);
  ennemi.position.set(5, 1, -5);
  scene.add(ennemi);
}

export function updateEnnemi(joueur) {
  if (!ennemi) return;

  const dist = ennemi.position.distanceTo(joueur.position);

  if (dist < 6) {
    // attaque
    ennemi.position.lerp(joueur.position, 0.01);
  } else if (dist < 12) {
    // curiosité
    ennemi.lookAt(joueur.position);
  }
}
