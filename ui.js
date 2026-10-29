// ===============================
// XEROX – INTERFACE UTILISATEUR & HUD
// ===============================

import { STATE } from './state.js';
import { triggerAttack } from './player.js';

let hpBarInner;
let memoryLogEl;
let statsEl;

export function initUI() {
  const uiContainer = document.getElementById('ui');
  if (!uiContainer) return;

  uiContainer.innerHTML = `
    <div id="hud">
      <div class="hud-title">✦ XEROX ✦</div>

      <div class="hp-container">
        <span class="label">VITALITÉ</span>
        <div class="hp-bar-outer">
          <div id="hp-bar-inner"></div>
        </div>
      </div>

      <div id="stats-info" class="stats-info">
        Vaincus: 0 | Mémoire: Neutre
      </div>

      <div id="memory-log" class="memory-log">
        Initialisation du système...
      </div>

      <div class="controls-hint">
        <b>[Z,Q,S,D] / Flèches</b> : Se déplacer | <b>[Espace]</b> : Attaquer
      </div>
    </div>

    <!-- Contrôles Tactiles pour Mobile -->
    <div id="mobile-controls">
      <div class="dpad">
        <button id="btn-up" class="btn-dpad">▲</button>
        <div class="dpad-row">
          <button id="btn-left" class="btn-dpad">◄</button>
          <button id="btn-down" class="btn-dpad">▼</button>
          <button id="btn-right" class="btn-dpad">►</button>
        </div>
      </div>
      <button id="btn-attack" class="btn-attack">⚔️ ATTACK</button>
    </div>
  `;

  hpBarInner = document.getElementById('hp-bar-inner');
  memoryLogEl = document.getElementById('memory-log');
  statsEl = document.getElementById('stats-info');

  setupMobileEvents();
}

function setupMobileEvents() {
  const bindTouch = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      STATE.input[key] = true;
    });
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      STATE.input[key] = false;
    });
    btn.addEventListener('mousedown', (e) => {
      STATE.input[key] = true;
    });
    btn.addEventListener('mouseup', (e) => {
      STATE.input[key] = false;
    });
  };

  bindTouch('btn-up', 'z');
  bindTouch('btn-down', 's');
  bindTouch('btn-left', 'q');
  bindTouch('btn-right', 'd');

  const attackBtn = document.getElementById('btn-attack');
  if (attackBtn) {
    const handleAttack = (e) => {
      e.preventDefault();
      triggerAttack();
    };
    attackBtn.addEventListener('touchstart', handleAttack);
    attackBtn.addEventListener('mousedown', handleAttack);
  }
}

export function updateUI() {
  if (hpBarInner) {
    const pct = Math.max(0, Math.min(100, (STATE.joueur.pv / STATE.joueur.pvMax) * 100));
    hpBarInner.style.width = `${pct}%`;

    if (pct < 30) {
      hpBarInner.style.background = '#ff3344';
    } else {
      hpBarInner.style.background = '#00f0ff';
    }
  }

  if (statsEl) {
    statsEl.innerText = `Ennemis neutralisés: ${STATE.monde.memory.ennemisVaincus}`;
  }

  if (memoryLogEl && STATE.monde.memory.choixDernier) {
    memoryLogEl.innerText = `[LOG XEROX] : ${STATE.monde.memory.choixDernier}`;
  }
}
