// ===============================
// XEROX – MOTEUR THREE.JS
// ===============================

import * as THREE from 'three';

export let scene, camera, renderer, sun, ambientLight;

export function initMoteur(canvas) {
  // 🌍 SCÈNE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1c29);

  // 🌫️ BRUME ATMO
  scene.fog = new THREE.FogExp2(0x1a1c29, 0.015);

  // 📷 CAMÉRA
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(0, 8, 12);

  // 🎨 RENDERER
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  
  // ☀️ OMBRES
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ☀️ LUMIÈRE DIRECTIONNELLE
  sun = new THREE.DirectionalLight(0xfff5ea, 1.4);
  sun.position.set(40, 60, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 150;

  const d = 50;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;

  scene.add(sun);

  // 💡 LUMIÈRE AMBIANTE & HEMISPHERE
  ambientLight = new THREE.AmbientLight(0x405070, 0.7);
  scene.add(ambientLight);

  const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3d2817, 0.4);
  scene.add(hemi);

  window.addEventListener('resize', onResize);
}

function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
