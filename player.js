import { ÉTAT } from './état.js';
import { scene, camera } from './moteur.js';

export let joueurMesh;

// état interne du joueur
let intangible = false;
let energieIntangible = 100;
const ENERGIE_MAX = 100;

// ==================== INIT ====================
export function initJoueur() {
  const geo = new THREE.SphereGeometry(0.5, 24, 24);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x002222,
    roughness: 0.4,
    metalness: 0.1
  });

  joueurMesh = new THREE.Mesh(geo, mat);
  joueurMesh.position.set(
    ÉTAT.joueur.position.x,
    ÉTAT.joueur.position.y,
    ÉTAT.joueur.position.z
  );

  joueurMesh.castShadow = true;
  joueurMesh.receiveShadow = true;

  scene.add(joueurMesh);
}

// ==================== UPDATE ====================
export function updateJoueur(input) {
  if (!joueurMesh) return;

  // ----- MODE INTANGIBLE -----
  if (input.shift && energieIntangible > 0) {
    intangible = true;
    energieIntangible -= 0.6;

    joueurMesh.material.color.set(0xa855f7);
    joueurMesh.material.emissive.set(0x3b0764);
  } else {
    intangible = false;
    energieIntangible += 0.4;

    joueurMesh.material.color.set(0x00ffff);
    joueurMesh.material.emissive.set(0x002222);
  }

  energieIntangible = Math.max(0, Math.min(ENERGIE_MAX, energieIntangible));

  // ----- DÉPLACEMENT -----
  const vitesse = intangible
    ? ÉTAT.joueur.vitesse * 0.55
    : ÉTAT.joueur.vitesse;

  if (input.z) joueurMesh.position.z -= vitesse;
  if (input.s) joueurMesh.position.z += vitesse;
  if (input.q) joueurMesh.position.x -= vitesse;
  if (input.d) joueurMesh.position.x += vitesse;

  // ----- SYNC ÉTAT GLOBAL -----
  ÉTAT.joueur.position.x = joueurMesh.position.x;
  ÉTAT.joueur.position.y = joueurMesh.position.y;
  ÉTAT.joueur.position.z = joueurMesh.position.z;

  // ----- CAMÉRA CINÉMATIQUE -----
  const camOffset = new THREE.Vector3(0, 5, 8);
  const targetCamPos = joueurMesh.position.clone().add(camOffset);

  camera.position.lerp(targetCamPos, 0.08);
  camera.lookAt(joueurMesh.position);
}

// ==================== INFOS (UI PLUS TARD) ====================
export function getJoueurData() {
  return {
    intangible,
    energie: energieIntangible,
    position: { ...ÉTAT.joueur.position }
  };
}
