// ===============================
// XEROX – MOTEUR 3D (Three.js)
// ===============================

export let scene, camera, renderer, sun;

export function initMoteur(canvas) {
  // 🌍 SCÈNE
  scene = new THREE.Scene();

  // 🌫️ Brume atmosphérique (style Zelda)
  scene.fog = new THREE.Fog(0xcce0ff, 30, 200);

  // 📷 CAMÉRA
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(0, 6, 10);

  // 🎨 RENDERER
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  // ☀️ LUMIÈRE PRINCIPALE (SOLEIL)
  sun = new THREE.DirectionalLight(0xfff2cc, 1.2);
  sun.position.set(50, 100, 50);
  scene.add(sun);

  // 🌤️ LUMIÈRE AMBIANTE
  const ambient = new THREE.AmbientLight(0x8899aa, 0.6);
  scene.add(ambient);

  // 🎨 CIEL
  scene.background = new THREE.Color(0x87bfff);

  // 🔁 Resize
  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
