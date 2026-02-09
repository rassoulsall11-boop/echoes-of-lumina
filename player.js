// ===============================
// XEROX – JOUEUR
// ===============================

import { ÉTAT } from './état.js';
import { scene, camera } from './moteur.js';

export let joueurMesh;

// ===============================
// INITIALISATION
// ===============================
export function initJoueur() {
  const geo = new THREE.SphereGeometry(0.5, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x002233
  });

  joueurMesh = new THREE.Mesh(geo, mat);
  joueurMesh.position.set(
    ÉTAT.joueur.position.x,
    ÉTAT.joueur.position.y,
    ÉTAT.joueur.position.z
  );

  joueurMesh.castShadow = true;
  joueurMesh.receiveShadow = true;

  scene.add(joueurMesh);
}

// ===============================
// UPDATE
// ===============================
export function updateJoueur(input, delta) {
  const v = ÉTAT.joueur.vitesse * delta * 60; // normalisation FPS

  // --- Déplacement ---
  if (input.z) joueurMesh.position.z -= v;
  if (input.s) joueurMesh.position.z += v;
  if (input.q) joueurMesh.position.x -= v;
  if (input.d) joueurMesh.position.x += v;

  // --- Sync état ---
  ÉTAT.joueur.position.x = joueurMesh.position.x;
  ÉTAT.joueur.position.z = joueurMesh.position.z;

  // --- Caméra lissée ---
  const camTarget = new THREE.Vector3(
    joueurMesh.position.x,
    joueurMesh.position.y + 4,
    joueurMesh.position.z + 8
  );

  camera.position.lerp(camTarget, 0.08);
  camera.lookAt(joueurMesh.position);
}
