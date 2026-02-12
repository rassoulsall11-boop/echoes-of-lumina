// ===============================
// XEROX – MONDE (Zelda-like)
// ===============================

import { scene } from './moteur.js';

export function initWorld() {
  createGround();
  createTrees();
}

// 🌱 SOL
function createGround() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x5fa85b,
      roughness: 1,
      metalness: 0
    })
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  scene.add(ground);
}

// 🌳 ARBRES STYLISÉS
function createTrees() {
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 300;
    const z = (Math.random() - 0.5) * 300;
    createTree(x, z);
  }
}

function createTree(x, z) {
  // Tronc
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 2.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
  );

  // Feuilles
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x3fa34d })
  );

  trunk.position.set(x, 1.25, z);
  leaves.position.set(x, 3.5, z);

  scene.add(trunk);
  scene.add(leaves);
}
