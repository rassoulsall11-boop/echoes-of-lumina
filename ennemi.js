// ===============================
// XEROX – ENNEMIS IA SYSTÉMIQUE
// ===============================

import { scene } from './moteur.js';
import { ÉTAT } from './état.js';

export const ennemis = [];

// ===============================
// CRÉATION ENNEMI
// ===============================
export function creerEnnemi(x, z) {
  const geo = new THREE.SphereGeometry(0.4, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0xaa3333 });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, 0.4, z);
  scene.add(mesh);

  const ennemi = {
    mesh,
    état: "IDLE",
    vie: 100,
    vitesse: 0.03,
    vision: 6,
    attaqueDist: 1.2,
    zone: { x, z },
    timer: 0
  };

  ennemis.push(ennemi);
}

// ===============================
// UPDATE IA
// ===============================
export function updateEnnemis(joueur) {
  ennemis.forEach(e => {
    const dx = joueur.position.x - e.mesh.position.x;
    const dz = joueur.position.z - e.mesh.position.z;
    const dist = Math.hypot(dx, dz);

    switch (e.état) {

      // -------------------------------
      case "IDLE":
        e.timer += ÉTAT.delta;
        e.mesh.position.x += Math.sin(e.timer * 0.001) * 0.005;
        e.mesh.position.z += Math.cos(e.timer * 0.001) * 0.005;

        if (dist < e.vision) e.état = "ALERT";
        break;

      // -------------------------------
      case "ALERT":
        if (dist < e.vision) {
          e.état = "CHASE";
        } else {
          e.état = "RETURN";
        }
        break;

      // -------------------------------
      case "CHASE":
        e.mesh.position.x += (dx / dist) * e.vitesse;
        e.mesh.position.z += (dz / dist) * e.vitesse;

        if (dist < e.attaqueDist) e.état = "ATTACK";
        if (dist > e.vision * 1.5) e.état = "RETURN";
        break;

      // -------------------------------
      case "ATTACK":
        // (attaque symbolique pour l’instant)
        e.mesh.material.color.set(0xff0000);

        if (dist > e.attaqueDist) {
          e.mesh.material.color.set(0xaa3333);
          e.état = "CHASE";
        }
        break;

      // -------------------------------
      case "FLEE":
        e.mesh.position.x -= (dx / dist) * e.vitesse * 1.5;
        e.mesh.position.z -= (dz / dist) * e.vitesse * 1.5;

        if (dist > e.vision * 2) e.état = "RETURN";
        break;

      // -------------------------------
      case "RETURN":
        const rdx = e.zone.x - e.mesh.position.x;
        const rdz = e.zone.z - e.mesh.position.z;
        const rdist = Math.hypot(rdx, rdz);

        if (rdist > 0.1) {
          e.mesh.position.x += (rdx / rdist) * e.vitesse;
          e.mesh.position.z += (rdz / rdist) * e.vitesse;
        } else {
          e.état = "IDLE";
        }
        break;
    }
  });
}
