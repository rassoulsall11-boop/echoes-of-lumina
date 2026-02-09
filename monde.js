import { ÉTAT } from './état.js';
import { scene } from './moteur.js';

export function updateMonde(joueur) {
  const size = ÉTAT.monde.tailleChunk;

  const cx = Math.floor(joueur.position.x / size);
  const cz = Math.floor(joueur.position.z / size);

  for (let x = cx - 1; x <= cx + 1; x++) {
    for (let z = cz - 1; z <= cz + 1; z++) {
      const key = `${x},${z}`;
      if (!ÉTAT.monde.chunks.has(key)) {
        créerChunk(x, z);
      }
    }
  }
}

function créerChunk(cx, cz) {
  const size = ÉTAT.monde.tailleChunk;

  const geo = new THREE.PlaneGeometry(size, size);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x224466
  });

  const sol = new THREE.Mesh(geo, mat);
  sol.rotation.x = -Math.PI / 2;
  sol.position.set(cx * size, 0, cz * size);

  scene.add(sol);
  ÉTAT.monde.chunks.set(`${cx},${cz}`, sol);
}
