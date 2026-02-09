let lastTime = performance.now();

function gameLoop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  if (GameState.started) {
    handleInput(dt);
    updatePlayer();
    renderer.render(scene, camera);
  }

  requestAnimationFrame(gameLoop);
}
