// ===============================
// MOTEUR THREE.JS – XEROX
// ===============================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
// import { ÉTAT } from './état.js'; // À réactiver quand utilisé

export let scene, camera, renderer;

export function initMoteur(canvas) {
  if (!canvas) {
    console.error('[MOTEUR] Canvas introuvable');
    return;
  }

  // --- SCÈNE ---
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050510);

  // --- CAMÉRA ---
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);

  // --- RENDERER ---
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.physicallyCorrectLights = true;

  // --- LUMIÈRES ---
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(10, 20, 10);
  scene.add(sun);

  const ambient = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambient);

  // --- RESIZE ---
  window.addEventListener('resize', onResize);
}

function onResize() {
  if (!camera || !renderer) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
