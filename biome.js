import { scene } from './moteur.js';

export function initBiome() {
  // Brouillard (cinéma)
  scene.fog = new THREE.Fog(0x0b0e1a, 20, 120);

  // Lumière soleil
  const sun = new THREE.DirectionalLight(0xffe0b2, 1.2);
  sun.position.set(50, 80, 30);
  sun.castShadow = true;
  scene.add(sun);

  scene.add(new THREE.AmbientLight(0x404040, 0.6));
}
