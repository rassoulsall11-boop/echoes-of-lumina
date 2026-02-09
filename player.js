let playerMesh;

function initPlayer() {
  playerMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x00f2ff })
  );
  scene.add(playerMesh);
}

function updatePlayer() {
  const p = GameState.player;
  playerMesh.position.set(p.x, p.y, p.z);
}
