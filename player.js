// ===============================
// XEROX – JOUEUR ET APTITUDES
// ===============================

import * as THREE from 'three';
import { scene, camera } from './engine.js';
import { STATE } from './state.js';
import { audio } from './audio.js';
import { emitSparks } from './particles.js';

export let playerMesh;
export let attackArcMesh;

let targetCameraPos = new THREE.Vector3();
let attackTimer = 0;
let dashTimer = 0;
let dashDir = new THREE.Vector3();

export function initJoueur() {
  const group = new THREE.Group();

  // Corps héroïque
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

  // Visière
  const visorGeo = new THREE.BoxGeometry(0.5, 0.15, 0.3);
  const visorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, roughness: 0.1 });
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 1.2, -0.3);
  group.add(visor);

  // Arc d'attaque
  const arcGeo = new THREE.RingGeometry(0.8, 2.4, 16, 1, 0, Math.PI);
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

  STATE.joueur.stamina = 100;
  STATE.joueur.staminaMax = 100;

  setupInputListeners();
}

function setupInputListeners() {
  window.addEventListener('keydown', (e) => {
    audio.init();
    const k = e.key.toLowerCase();
    if (k === 'z' || k === 'w' || e.key === 'ArrowUp') STATE.input.z = true;
    if (k === 's' || e.key === 'ArrowDown') STATE.input.s = true;
    if (k === 'q' || k === 'a' || e.key === 'ArrowLeft') STATE.input.q = true;
    if (k === 'd' || e.key === 'ArrowRight') STATE.input.d = true;
    if (e.code === 'Space') {
      STATE.input.space = true;
      triggerAttack();
    }
    if (e.key === 'Shift' || e.key === 'ShiftLeft') {
      triggerDash();
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
  attackTimer = 0.25;
  audio.playSwing();
}

export function triggerDash() {
  if (dashTimer > 0 || STATE.joueur.stamina < 30) return;

  STATE.joueur.stamina -= 30;
  dashTimer = 0.2; // Durée de l'impulsion

  const moveX = (STATE.input.d ? 1 : 0) - (STATE.input.q ? 1 : 0);
  const moveZ = (STATE.input.s ? 1 : 0) - (STATE.input.z ? 1 : 0);

  if (moveX !== 0 || moveZ !== 0) {
    dashDir.set(moveX, 0, moveZ).normalize();
  } else {
    // Dash vers l'avant selon orientation
    playerMesh.getWorldDirection(dashDir);
    dashDir.negate();
  }

  STATE.joueur.invulnerableTimer = 0.3;
  audio.playDash();
  emitSparks(playerMesh.position, 0x00f0ff, 12);
}

export function updateJoueur(delta = 0.016) {
  if (!playerMesh) return;

  // Régénération Stamina
  if (STATE.joueur.stamina < STATE.joueur.staminaMax) {
    STATE.joueur.stamina = Math.min(STATE.joueur.staminaMax, STATE.joueur.stamina + 20 * delta);
  }

  if (dashTimer > 0) {
    dashTimer -= delta;
    playerMesh.position.x += dashDir.x * 0.45;
    playerMesh.position.z += dashDir.z * 0.45;
  } else {
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

      const angle = Math.atan2(nx, nz);
      playerMesh.rotation.y = angle;
    }
  }

  STATE.joueur.position.x = playerMesh.position.x;
  STATE.joueur.position.y = playerMesh.position.y;
  STATE.joueur.position.z = playerMesh.position.z;

  if (STATE.joueur.attaqueEnCours) {
    attackTimer -= delta;
    attackArcMesh.material.opacity = Math.max(0, attackTimer * 4);
    attackArcMesh.scale.setScalar(1 + (0.25 - attackTimer) * 2);

    if (attackTimer <= 0) {
      STATE.joueur.attaqueEnCours = false;
      attackArcMesh.material.opacity = 0;
    }
  }

  if (STATE.joueur.invulnerableTimer > 0) {
    STATE.joueur.invulnerableTimer -= delta;
    playerMesh.visible = Math.floor(Date.now() / 70) % 2 === 0;
  } else {
    playerMesh.visible = true;
  }

  // Camera lerp
  targetCameraPos.set(playerMesh.position.x, playerMesh.position.y + 7, playerMesh.position.z + 10);
  camera.position.lerp(targetCameraPos, 0.08);
  camera.lookAt(playerMesh.position.x, playerMesh.position.y + 0.8, playerMesh.position.z);
}
