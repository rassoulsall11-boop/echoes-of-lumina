// ===============================
// XEROX – CLASSES D'ENNEMIS & IA
// ===============================

import * as THREE from 'three';
import { scene } from './engine.js';
import { STATE } from './state.js';
import { audio } from './audio.js';
import { emitSparks } from './particles.js';

export const ennemis = [];

export function initEnnemis() {
  ennemis.length = 0;

  // Scouters (Rapides, faible HP)
  creerEnnemi(-12, -12, "SCOUTER");
  creerEnnemi(14, -16, "SCOUTER");
  creerEnnemi(-20, 10, "SCOUTER");

  // Corruptors (Moyens, agressifs)
  creerEnnemi(18, 18, "CORRUPTOR");
  creerEnnemi(-22, -18, "CORRUPTOR");

  // Boss Gardien Xerox
  creerEnnemi(0, -32, "BOSS");
}

export function creerEnnemi(x, z, type = "CORRUPTOR") {
  const group = new THREE.Group();

  let geo, mat, eyeColor, scale;

  if (type === "SCOUTER") {
    geo = new THREE.TetrahedronGeometry(0.5, 0);
    mat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.3, flatShading: true });
    eyeColor = 0xffff00;
    scale = 0.8;
  } else if (type === "BOSS") {
    geo = new THREE.DodecahedronGeometry(1.6, 0);
    mat = new THREE.MeshStandardMaterial({ color: 0x9900ff, emissive: 0x330066, roughness: 0.2, flatShading: true });
    eyeColor = 0xff00ff;
    scale = 1.8;
  } else {
    geo = new THREE.IcosahedronGeometry(0.6, 0);
    mat = new THREE.MeshStandardMaterial({ color: 0xcc2233, roughness: 0.4, flatShading: true });
    eyeColor = 0xff0000;
    scale = 1.0;
  }

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = scale * 0.6;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), new THREE.MeshBasicMaterial({ color: eyeColor }));
  eye.position.set(0, scale * 0.7, -scale * 0.5);
  group.add(eye);

  group.position.set(x, 0, z);
  scene.add(group);

  const stats = {
    SCOUTER: { vie: 40, vitesse: 0.07, vision: 11, degats: 10, attackDist: 1.2 },
    CORRUPTOR: { vie: 90, vitesse: 0.045, vision: 9, degats: 18, attackDist: 1.4 },
    BOSS: { vie: 250, vitesse: 0.03, vision: 15, degats: 30, attackDist: 2.2 }
  }[type];

  const ennemi = {
    type,
    group,
    mesh,
    état: "IDLE",
    vie: stats.vie,
    vieMax: stats.vie,
    vitesse: stats.vitesse,
    vision: stats.vision,
    attaqueDist: stats.attackDist,
    degats: stats.degats,
    zone: { x, z },
    timer: 0,
    cooldownAttaque: 0
  };

  ennemis.push(ennemi);
}

export function updateEnnemis(playerMesh) {
  if (!playerMesh) return;

  const playerPos = playerMesh.position;

  for (let i = ennemis.length - 1; i >= 0; i--) {
    const e = ennemis[i];
    const ePos = e.group.position;

    const dx = playerPos.x - ePos.x;
    const dz = playerPos.z - ePos.z;
    const dist = Math.hypot(dx, dz);

    if (e.cooldownAttaque > 0) e.cooldownAttaque -= 0.016;

    // Attaque du joueur
    if (STATE.input.attackTriggered && dist < (e.type === "BOSS" ? 3.2 : 2.5)) {
      e.vie -= 45;
      audio.playHit();
      emitSparks(ePos, 0xff0055, 15);

      e.mesh.material.color.set(0xffffff);
      setTimeout(() => {
        if (e.mesh && e.mesh.material) {
          e.mesh.material.color.set(e.type === "BOSS" ? 0x9900ff : e.type === "SCOUTER" ? 0xffaa00 : 0xcc2233);
        }
      }, 120);

      if (dist > 0.01) {
        ePos.x -= (dx / dist) * 0.8;
        ePos.z -= (dz / dist) * 0.8;
      }

      if (e.vie <= 0) {
        scene.remove(e.group);
        ennemis.splice(i, 1);
        STATE.monde.memory.ennemisVaincus += 1;
        STATE.monde.memory.choixDernier = `Entité ${e.type} neutralisée.`;
        emitSparks(ePos, 0xffff00, 30);
        continue;
      }
    }

    // IA
    switch (e.état) {
      case "IDLE":
        e.timer += 0.016;
        ePos.x += Math.sin(e.timer * 2) * 0.005;
        ePos.z += Math.cos(e.timer * 2) * 0.005;
        if (dist < e.vision) e.état = "CHASE";
        break;

      case "CHASE":
        if (dist > 0.01) {
          ePos.x += (dx / dist) * e.vitesse;
          ePos.z += (dz / dist) * e.vitesse;
          e.group.rotation.y = Math.atan2(dx, dz);
        }
        if (dist < e.attaqueDist) e.état = "ATTACK";
        else if (dist > e.vision * 1.6) e.état = "RETURN";
        break;

      case "ATTACK":
        if (e.cooldownAttaque <= 0) {
          if (STATE.joueur.invulnerableTimer <= 0) {
            STATE.joueur.pv = Math.max(0, STATE.joueur.pv - e.degats);
            STATE.joueur.invulnerableTimer = 0.8;
            audio.playPlayerDamage();
            STATE.monde.memory.choixDernier = `A subi ${e.degats} dégâts par ${e.type}`;
          }
          e.cooldownAttaque = 1.2;
        }
        if (dist > e.attaqueDist + 0.5) e.état = "CHASE";
        break;

      case "RETURN":
        const rdx = e.zone.x - ePos.x;
        const rdz = e.zone.z - ePos.z;
        const rdist = Math.hypot(rdx, rdz);

        if (rdist > 0.2) {
          ePos.x += (rdx / rdist) * e.vitesse;
          ePos.z += (rdz / rdist) * e.vitesse;
          e.group.rotation.y = Math.atan2(rdx, rdz);
        } else {
          e.état = "IDLE";
        }
        if (dist < e.vision) e.état = "CHASE";
        break;
    }
  }

  STATE.input.attackTriggered = false;
}
