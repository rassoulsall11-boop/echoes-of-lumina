// ===============================
// XEROX – ENNEMIS & IA SYSTÉMIQUE
// ===============================

import * as THREE from 'three';
import { scene } from './engine.js';
import { STATE } from './state.js';

export const ennemis = [];

export function initEnnemis() {
  // Générer des ennemis à des endroits stratégiques autour du joueur
  const positions = [
    { x: -8, z: -10 },
    { x: 12, z: -14 },
    { x: -18, z: 12 },
    { x: 15, z: 15 },
    { x: 0, z: -25 },
    { x: -22, z: -5 }
  ];

  positions.forEach(pos => creerEnnemi(pos.x, pos.z));
}

// ===============================
// CRÉATION ENNEMI
// ===============================
export function creerEnnemi(x, z) {
  const group = new THREE.Group();

  // Corps agressif (Icosaèdre géométrique)
  const geo = new THREE.IcosahedronGeometry(0.6, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xcc2233,
    roughness: 0.4,
    metalness: 0.6,
    flatShading: true
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.6;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  // Yeux rouge vif
  const eyeGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.set(0, 0.7, -0.4);
  group.add(eye);

  group.position.set(x, 0, z);
  scene.add(group);

  const ennemi = {
    group,
    mesh,
    état: "IDLE",
    vie: 100,
    vieMax: 100,
    vitesse: 0.045,
    vision: 9,
    attaqueDist: 1.3,
    zone: { x, z },
    timer: 0,
    cooldownAttaque: 0
  };

  ennemis.push(ennemi);
}

// ===============================
// UPDATE IA & COMBAT
// ===============================
export function updateEnnemis(playerMesh) {
  if (!playerMesh) return;

  const playerPos = playerMesh.position;

  for (let i = ennemis.length - 1; i >= 0; i--) {
    const e = ennemis[i];
    const ePos = e.group.position;

    const dx = playerPos.x - ePos.x;
    const dz = playerPos.z - ePos.z;
    const dist = Math.hypot(dx, dz);

    if (e.cooldownAttaque > 0) {
      e.cooldownAttaque -= 0.016;
    }

    // Détecter si le joueur l'attaque
    if (STATE.input.attackTriggered && dist < 2.5) {
      e.vie -= 45;
      e.mesh.material.color.set(0xffffff); // Flash d'impact
      setTimeout(() => {
        if (e.mesh && e.mesh.material) e.mesh.material.color.set(0xcc2233);
      }, 120);

      // Recul léger (Knockback)
      if (dist > 0.01) {
        ePos.x -= (dx / dist) * 1.2;
        ePos.z -= (dz / dist) * 1.2;
      }

      if (e.vie <= 0) {
        // Ennemi vaincu -> mise à jour mémoire Xerox
        scene.remove(e.group);
        ennemis.splice(i, 1);
        STATE.monde.memory.ennemisVaincus += 1;
        STATE.monde.memory.choixDernier = "Force employée : Ennemi éliminé.";
        continue;
      }
    }

    // Machine à états
    switch (e.état) {

      case "IDLE":
        e.timer += 0.016;
        ePos.x += Math.sin(e.timer * 2) * 0.008;
        ePos.z += Math.cos(e.timer * 2) * 0.008;

        if (dist < e.vision) {
          e.état = "CHASE";
        }
        break;

      case "CHASE":
        if (dist > 0.01) {
          ePos.x += (dx / dist) * e.vitesse;
          ePos.z += (dz / dist) * e.vitesse;
          e.group.rotation.y = Math.atan2(dx, dz);
        }

        if (dist < e.attaqueDist) {
          e.état = "ATTACK";
        } else if (dist > e.vision * 1.6) {
          e.état = "RETURN";
        }
        break;

      case "ATTACK":
        e.mesh.material.color.set(0xff0000);

        if (e.cooldownAttaque <= 0) {
          // Attaquer le joueur
          if (STATE.joueur.invulnerableTimer <= 0) {
            STATE.joueur.pv = Math.max(0, STATE.joueur.pv - 15);
            STATE.joueur.invulnerableTimer = 0.8;
            STATE.monde.memory.choixDernier = "A subi les dégâts d'une créature.";
          }
          e.cooldownAttaque = 1.2;
        }

        if (dist > e.attaqueDist + 0.5) {
          e.mesh.material.color.set(0xcc2233);
          e.état = "CHASE";
        }
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
          // L'ennemi épargné qui retourne sereinement augmente les ennemis épargnés
          STATE.monde.memory.ennemisEpargnes += 0.001;
        }

        if (dist < e.vision) {
          e.état = "CHASE";
        }
        break;
    }
  }

  // Remise à zéro du flag d'attaque consommé
  STATE.input.attackTriggered = false;
}
