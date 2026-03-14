// ===============================
// XEROX – MAIN (Point d’entrée)
// ===============================

// IMPORTATION DE THREE.JS (Indispensable pour utiliser THREE.Mesh, etc.)
import * as THREE from 'three'; 

import { initMoteur, scene, camera, renderer } from './moteur.js';
// CORRECTION : On pointe vers monde.js (et non world.js)
import { initWorld } from './monde.js';

const canvas = document.getElementById('game');

// ⌨️ INPUT (ZQSD)
const input = { z: false, q: false, s: false, d: false };

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase(); // Pour gérer aussi les majuscules
  if (key === 'z') input.z = true;
  if (key === 's') input.s = true;
  if (key === 'q') input.q = true;
  if (key === 'd') input.d = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'z') input.z = false;
  if (key === 's') input.s = false;
  if (key === 'q') input.q = false;
  if (key === 'd') input.d = false;
});

// 🧍 JOUEUR SIMPLE
const player = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x00ffff })
);
player.position.y = 1;

// ===============================
// INIT
// ===============================
initMoteur(canvas);
initWorld();
scene.add(player);

// ===============================
// GAME LOOP
// ===============================
function loop() {
  const speed = 0.12;

  if (input.z) player.position.z -= speed;
  if (input.s) player.position.z += speed;
  if (input.q) player.position.x -= speed;
  if (input.d) player.position.x += speed;

  // 🎥 Caméra Zelda-like
  camera.position.lerp(
    new THREE.Vector3(
      player.position.x,
      6,
      player.position.z + 10
    ),
    0.1
  );
  camera.lookAt(player.position);

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

loop();
