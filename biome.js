// ===============================
// XEROX – BIOME & ATMOSPHÈRE
// ===============================

import * as THREE from 'three';
import { scene } from './engine.js';

export function initBiome() {
  if (!scene) return;

  // Brouillard mystérieux
  scene.fog = new THREE.FogExp2(0x161b26, 0.012);
  scene.background = new THREE.Color(0x161b26);
}
