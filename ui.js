function initUI() {
  document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("intro").style.display = "none";
    GameState.started = true;
  });
}
