// ===============================
// XEROX – JOUEUR
// ===============================

import * as THREE from 'three';
import { scene, camera } from './engine.js';
import { STATE } from './state.js';

export let playerMesh;
export let attackArcMesh;

let targetCameraPos = new THREE.Vector3();
let attackTimer = 0;

export function initJoueur() {
  const group = new THREE.Group();

  // Corps du joueur (Avatar Heroique)
  const bodyGeo = new THREE.CapsuleGeometry(0.5, 0.8, 8, 16);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0x003344
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.9;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Yeux / Visière
  const visorGeo = new THREE.BoxGeometry(0.5, 0.15, 0.3);
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    roughness: 0.1
  });
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 1.2, -0.3);
  group.add(visor);

  // Effet d'attaque (Arc d'énergie)
  const arcGeo = new THREE.RingGeometry(0.8, 2.2, 16, 1, 0, Math.PI);
  const arcMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0
  });
  attackArcMesh = new THREE.Mesh(arcGeo, arcMat);
  attackArcMesh.rotation.x = -Math.PI / 2;
  attackArcMesh.position.set(0, 0.2, -1.2);
  group.add(attackArcMesh);

  group.position.set(0, 0, 0);
  playerMesh = group;
  scene.add(playerMesh);

  // Écouteurs d'entrées
  setupInputListeners();
}

function setupInputListeners() {
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'z' || k === 'w' || e.key === 'ArrowUp') STATE.input.z = true;
    if (k === 's' || e.key === 'ArrowDown') STATE.input.s = true;
    if (k === 'q' || k === 'a' || e.key === 'ArrowLeft') STATE.input.q = true;
    if (k === 'd' || e.key === 'ArrowRight') STATE.input.d = true;
    if (e.code === 'Space') {
      STATE.input.space = true;
      triggerAttack();
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'z' || k === 'w' || e.key === 'ArrowUp') STATE.input.z = false;
    if (k === 's' || e.key === 'ArrowDown') STATE.input.s = false;
    if (k === 'q' || k === 'a' || e.key === 'ArrowLeft') STATE.input.q = false;
    if (k === 'd' || e.key === 'ArrowRight') STATE.input.d = false;
    if (e.code === 'Space') STATE.input.space = false;
  });
}

export function triggerAttack() {
  if (STATE.joueur.attaqueEnCours) return;
  STATE.joueur.attaqueEnCours = true;
  STATE.input.attackTriggered = true;
  attackTimer = 0.25; // duree en secondes
}

export function updateJoueur() {
  if (!playerMesh) return;

  const moveSpeed = STATE.joueur.vitesse;
  let moveX = 0;
  let moveZ = 0;

  if (STATE.input.z) moveZ -= 1;
  if (STATE.input.s) moveZ += 1;
  if (STATE.input.q) moveX -= 1;
  if (STATE.input.d) moveX += 1;

  if (moveX !== 0 || moveZ !== 0) {
    const length = Math.hypot(moveX, moveZ);
    const nx = (moveX / length) * moveSpeed;
    const nz = (moveZ / length) * moveSpeed;

    playerMesh.position.x += nx;
    playerMesh.position.z += nz;

    // Orienter le joueur dans la direction du mouvement
    const angle = Math.atan2(nx, nz);
    playerMesh.rotation.y = angle;
  }

  // Mettre à jour la position dans STATE
  STATE.joueur.position.x = playerMesh.position.x;
  STATE.joueur.position.y = playerMesh.position.y;
  STATE.joueur.position.z = playerMesh.position.z;

  // Gestion du timer d'attaque
  if (STATE.joueur.attaqueEnCours) {
    attackTimer -= 0.016;
    attackArcMesh.material.opacity = Math.max(0, attackTimer * 4);
    attackArcMesh.scale.setScalar(1 + (0.25 - attackTimer) * 2);

    if (attackTimer <= 0) {
      STATE.joueur.attaqueEnCours = false;
      attackArcMesh.material.opacity = 0;
    }
  }

  // Timer d'invulnérabilité en cas de dégâts
  if (STATE.joueur.invulnerableTimer > 0) {
    STATE.joueur.invulnerableTimer -= 0.016;
    playerMesh.visible = Math.floor(Date.now() / 80) % 2 === 0;
  } else {
    playerMesh.visible = true;
  }

  // 🎥 Caméra fluide Zelda-like
  targetCameraPos.set(
    playerMesh.position.x,
    playerMesh.position.y + 7,
    playerMesh.position.z + 10
  );
  camera.position.lerp(targetCameraPos, 0.08);
  camera.lookAt(
    playerMesh.position.x,
    playerMesh.position.y + 0.8,
    playerMesh.position.z
  );
}
