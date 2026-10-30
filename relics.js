// ===============================
// XEROX – STÈLES & RELIQUES
// ===============================

import * as THREE from 'three';
import { scene } from './engine.js';
import { STATE } from './state.js';
import { audio } from './audio.js';
import { emitSparks } from './particles.js';

export const relics = [];

export function initReliques() {
  relics.length = 0;

  const positions = [
    { id: 1, x: -20, z: -20, name: "Sceau de la Mémoire Alpha" },
    { id: 2, x: 25, z: -25, name: "Sceau de la Mémoire Bêta" },
    { id: 3, x: -30, z: 30, name: "Sceau de la Mémoire Gamma" }
  ];

  positions.forEach(p => {
    const group = new THREE.Group();

    // Monolithe principal
    const geo = new THREE.BoxGeometry(1.2, 3.8, 1.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x005577,
      roughness: 0.1,
      metalness: 0.9
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 1.9;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Halo d'énergie rotatif
    const ringGeo = new THREE.TorusGeometry(1.5, 0.08, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.0;
    group.add(ring);

    group.position.set(p.x, 0, p.z);
    scene.add(group);

    relics.push({
      id: p.id,
      name: p.name,
      group,
      mesh,
      ring,
      activated: false,
      pos: { x: p.x, z: p.z }
    });
  });

  STATE.monde.relicsTotal = relics.length;
  STATE.monde.relicsActivees = 0;
}

export function updateReliques(playerMesh) {
  if (!playerMesh) return;

  const pPos = playerMesh.position;
  let nearRelic = null;

  relics.forEach(r => {
    // Rotation continue du halo
    r.ring.rotation.z += 0.02;

    const dx = pPos.x - r.pos.x;
    const dz = pPos.z - r.pos.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 3.5 && !r.activated) {
      nearRelic = r;
    }

    // Interaction touche E
    if (dist < 3.5 && !r.activated && STATE.input.interactTriggered) {
      r.activated = true;
      r.mesh.material.color.set(0xffd700);
      r.mesh.material.emissive.set(0xaa7700);
      r.ring.material.color.set(0xffff00);

      STATE.monde.relicsActivees += 1;
      STATE.monde.memory.choixDernier = `Relique active : ${r.name}`;

      audio.playRelicActivated();
      emitSparks(r.group.position, 0xffff00, 30);
    }
  });

  STATE.input.interactTriggered = false;
  STATE.nearRelic = nearRelic;
}
