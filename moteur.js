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
  camera.lookAt(0, 1, 0);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lumières
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(10, 20, 10);
  scene.add(sun);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  // Repère visuel (debug)
  scene.add(new THREE.AxesHelper(5));

  window.addEventListener('resize', resize);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
