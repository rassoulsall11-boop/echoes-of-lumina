// ===============================
// XEROX – SYSTÈME DE PARTICULES 3D
// ===============================

import * as THREE from 'three';
import { scene } from './engine.js';

const activeParticles = [];

export function emitSparks(position, colorHex = 0x00ffff, count = 15) {
  if (!scene) return;

  const geo = new THREE.BufferGeometry();
  const positions = [];
  const velocities = [];

  for (let i = 0; i < count; i++) {
    positions.push(position.x, position.y + 0.5, position.z);

    // Direction aléatoire
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.08 + Math.random() * 0.12;
    const vx = Math.cos(angle) * speed;
    const vy = 0.05 + Math.random() * 0.15;
    const vz = Math.sin(angle) * speed;

    velocities.push(vx, vy, vz);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: colorHex,
    size: 0.25,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending
  });

  const pSystem = new THREE.Points(geo, mat);
  scene.add(pSystem);

  activeParticles.push({
    mesh: pSystem,
    velocities,
    life: 0.4, // Secondes
    maxLife: 0.4
  });
}

export function updateParticles(delta = 0.016) {
  for (let i = activeParticles.length - 1; i >= 0; i--) {
    const p = activeParticles[i];
    p.life -= delta;

    if (p.life <= 0) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      activeParticles.splice(i, 1);
      continue;
    }

    const posAttr = p.mesh.geometry.attributes.position;
    const posArr = posAttr.array;
    const vels = p.velocities;

    for (let j = 0; j < posArr.length / 3; j++) {
      const idx = j * 3;
      posArr[idx] += vels[idx];
      posArr[idx + 1] += vels[idx + 1];
      posArr[idx + 2] += vels[idx + 2];

      // Gravité légère
      vels[idx + 1] -= 0.005;
    }

    posAttr.needsUpdate = true;
    p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
  }
}
