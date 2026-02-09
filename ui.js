// ===============================
// XEROX – UI / HUD
// ===============================

import { ÉTAT } from './état.js';

export function initUI() {
  const intro = document.getElementById("intro");
  const startBtn = document.getElementById("startBtn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (intro) intro.style.display = "none";
      ÉTAT.jeuDémarré = true;
      console.log("XEROX : jeu démarré");
    });
  }
}

// ===============================
// UPDATE UI (appelé plus tard)
// ===============================
export function updateUI() {
  // Exemple : affichage debug
  // (plus tard : énergie, danger, biome, corruption…)

  // console.log("Position joueur :", ÉTAT.joueur.position);
}
