// ===============================
// XEROX – MONDE PROCÉDURAL
// ===============================

import { ÉTAT } from './état.js';
import { scene } from './moteur.js';

const DISTANCE_CHUNK = 2; // rayon autour du joueur

// ===============================
// UPDATE MONDE
// ===============================
export function updateMonde(joueur) {
  const size = ÉTAT.monde.tailleChunk;

  const cx = Math.floor(joueur.position.x / size);
  const cz = Math.floor(joueur.position.z / size);

  const chunksUtiles = new Set();

  // --- Génération ---
  for (let x = cx - DISTANCE_CHUNK; x <= cx + DISTANCE_CHUNK; x++) {
    for (let z = cz - DISTANCE_CHUNK; z <= cz + DISTANCE_CHUNK; z++) {
      const key = `${x},${z}`;
      chunksUtiles.add(key);

      if (!ÉTAT.monde.chunks.has(key)) {
        créerChunk(x, z);
      }
    }
  }

  // --- Nettoyage mémoire ---
  for (const [key, chunk] of ÉTAT.monde.chunks) {
    if (!chunksUtiles.has(key)) {
      scene.remove(chunk);
      chunk.geometry.dispose();
      chunk.material.dispose();
      ÉTAT.monde.chunks.delete(key);
    }
  }
}

// ===============================
// CRÉATION DE CHUNK
// ===============================
function créerChunk(cx, cz) {
  const size = ÉTAT.monde.tailleChunk;

  const geo = new THREE.PlaneGeometry(size, size, 16, 16);

  // --- Relief procédural simple ---
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + cx * size;
    const z = pos.getZ(i) + cz * size;

    const h = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.5;
    pos.setY(i, h);
  }
  geo.computeVertexNormals();

  // --- Zone instable (plus on s'éloigne, plus c'est hostile) ---
  const dist = Math.sqrt(cx * cx + cz * cz);
  let color = 0x223344;

  if (dist > 6) color = 0x332222;      // terre corrompue
  if (dist > 10) color = 0x220000;     // monde interdit

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    metalness: 0.1
  });

  const sol = new THREE.Mesh(geo, mat);
  sol.rotation.x = -Math.PI / 2;
  sol.position.set(cx * size, 0, cz * size);
  sol.receiveShadow = true;

  scene.add(sol);
  ÉTAT.monde.chunks.set(`${cx},${cz}`, sol);
}
