import { ÉTAT } from './état.js';
import { scene, camera } from './moteur.js';

export let joueurMesh;

export function initJoueur() {
  const geo = new THREE.SphereGeometry(0.5, 24, 24);
  const mat = new THREE.MeshStandardMaterial({ color: 0xff3333 });

  joueurMesh = new THREE.Mesh(geo, mat);
  joueurMesh.position.set(0, 1, 0);

  scene.add(joueurMesh);
}

export function updateJoueur(input) {
  const v = ÉTAT.joueur.vitesse;

  if (input.z) joueurMesh.position.z -= v;
  if (input.s) joueurMesh.position.z += v;
  if (input.q) joueurMesh.position.x -= v;
  if (input.d) joueurMesh.position.x += v;

  camera.position.x = joueurMesh.position.x;
  camera.position.z = joueurMesh.position.z + 8;
  camera.lookAt(joueurMesh.position);
}
