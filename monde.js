// ===============================
// XEROX – MONDE (Zelda-like & Mémoire)
// ===============================

import * as THREE from 'three';
import { scene } from './engine.js';

export function initWorld() {
  createGround();
  createTrees();
  createRocks();
  createRelics();
}

// 🌱 LE SOL AVEC TEXTURE DE GRILLE / PAYSAGE
function createGround() {
  const size = 400;
  const geometry = new THREE.PlaneGeometry(size, size, 64, 64);

  // Relief léger
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const zDist = Math.hypot(x, y);
    if (zDist > 15) {
      const height = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 1.5;
      pos.setZ(i, height);
    }
  }
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x3d6e42,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // Grille subtile pour le look numérique "Xerox"
  const grid = new THREE.GridHelper(size, 80, 0x55aa77, 0x225533);
  grid.position.y = 0.05;
  scene.add(grid);
}

// 🌳 GÉNÉRATION DES ARBRES
function createTrees() {
  const treeGroup = new THREE.Group();

  for (let i = 0; i < 70; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 15 + Math.random() * 160;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    const tree = createSingleTree(x, z);
    treeGroup.add(tree);
  }

  scene.add(treeGroup);
}

function createSingleTree(x, z) {
  const group = new THREE.Group();

  // Tronc
  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3, 7);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.5;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  // Feuillage low-poly en plusieurs couches
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.6, flatShading: true });

  const layer1 = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3, 6), leavesMat);
  layer1.position.y = 3.5;
  layer1.castShadow = true;
  group.add(layer1);

  const layer2 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.5, 6), leavesMat);
  layer2.position.y = 4.8;
  layer2.castShadow = true;
  group.add(layer2);

  group.position.set(x, 0, z);
  return group;
}

// 🪨 GÉNÉRATION DES ROCHERS
function createRocks() {
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x667077, roughness: 0.9, flatShading: true });

  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 10 + Math.random() * 150;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    const scale = 0.8 + Math.random() * 1.5;
    const rockGeo = new THREE.DodecahedronGeometry(scale, 0);
    const rock = new THREE.Mesh(rockGeo, rockMat);

    rock.position.set(x, scale * 0.6, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;

    scene.add(rock);
  }
}

// 🏛️ Riques / Stèles de Mémoire Xerox
function createRelics() {
  const relicGeo = new THREE.BoxGeometry(1.2, 3.5, 1.2);
  const relicMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x004455,
    roughness: 0.2,
    metalness: 0.8
  });

  const positions = [
    { x: -15, z: -15 },
    { x: 20, z: -20 },
    { x: -25, z: 25 },
    { x: 30, z: 30 }
  ];

  positions.forEach(pos => {
    const relic = new THREE.Mesh(relicGeo, relicMat);
    relic.position.set(pos.x, 1.75, pos.z);
    relic.castShadow = true;
    scene.add(relic);
  });
}

export function updateMonde(playerMesh) {
  // Animation / logique environnementale si nécessaire
}
