import { ÉTAT } from './état.js';

export let scene, camera, renderer;

export function initMoteur(canvas) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050510);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // lumière
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  scene.add(new THREE.AmbientLight(0x404040));

  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
                                   }
