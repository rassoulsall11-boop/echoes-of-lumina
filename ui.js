// ===============================
// XEROX – HUD, MINIMAP & OVERLAYS UI
// ===============================

import { STATE } from './state.js';
import { triggerAttack, triggerDash } from './player.js';
import { relics } from './relics.js';
import { ennemis } from './ennemi.js';

let hpBarInner;
let staminaBarInner;
let memoryLogEl;
let statsEl;
let relicsEl;
let interactPromptEl;
let minimapCanvas;
let minimapCtx;
let overlayEl;
let overlayTitleEl;
let overlayDescEl;

export function initUI() {
  const uiContainer = document.getElementById('ui');
  if (!uiContainer) return;

  uiContainer.innerHTML = `
    <div id="hud">
      <div class="hud-top">
        <div class="hud-title">✦ XEROX ✦</div>
        <div id="relics-counter" class="relics-badge">Sceaus: 0 / 3</div>
      </div>

      <div class="hp-container">
        <span class="label">PV</span>
        <div class="bar-outer">
          <div id="hp-bar-inner"></div>
        </div>
      </div>

      <div class="stamina-container">
        <span class="label">ÉNERGIE</span>
        <div class="bar-outer">
          <div id="stamina-bar-inner"></div>
        </div>
      </div>

      <div id="stats-info" class="stats-info">
        Ennemis: 0
      </div>

      <div id="memory-log" class="memory-log">
        [LOG XEROX] Initialisation de la conscience du Monde...
      </div>

      <div id="interact-prompt" class="interact-prompt hidden">
        Appuyez sur <b>[E]</b> pour activer le Sceau
      </div>

      <div class="controls-hint">
        <b>[ZQSD / Flèches]</b> Move | <b>[Espace]</b> Attaquer | <b>[Shift]</b> Dash | <b>[E]</b> Interagir
      </div>
    </div>

    <!-- Radar Minimap -->
    <div id="minimap-container">
      <canvas id="minimap" width="110" height="110"></canvas>
    </div>

    <!-- Overlay de fin de partie -->
    <div id="overlay" class="overlay hidden">
      <div class="overlay-card">
        <h1 id="overlay-title">RÉINITIALISATION</h1>
        <p id="overlay-desc">Le monde de Xerox s'est effondré.</p>
        <button id="btn-restart" class="btn-restart">RECOMMENCER</button>
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
      <div class="mobile-actions">
        <button id="btn-dash" class="btn-dash">💨 DASH</button>
        <button id="btn-interact" class="btn-interact">🖐️ E</button>
        <button id="btn-attack" class="btn-attack">⚔️</button>
      </div>
    </div>
  `;

  hpBarInner = document.getElementById('hp-bar-inner');
  staminaBarInner = document.getElementById('stamina-bar-inner');
  memoryLogEl = document.getElementById('memory-log');
  statsEl = document.getElementById('stats-info');
  relicsEl = document.getElementById('relics-counter');
  interactPromptEl = document.getElementById('interact-prompt');
  overlayEl = document.getElementById('overlay');
  overlayTitleEl = document.getElementById('overlay-title');
  overlayDescEl = document.getElementById('overlay-desc');

  minimapCanvas = document.getElementById('minimap');
  if (minimapCanvas) minimapCtx = minimapCanvas.getContext('2d');

  document.getElementById('btn-restart').addEventListener('click', () => {
    window.location.reload();
  });

  setupMobileEvents();
  setupKeyboardEvents();
}

function setupKeyboardEvents() {
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') {
      STATE.input.interactTriggered = true;
    }
  });
}

function setupMobileEvents() {
  const bindTouch = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('touchstart', (e) => { e.preventDefault(); STATE.input[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); STATE.input[key] = false; });
    btn.addEventListener('mousedown', () => { STATE.input[key] = true; });
    btn.addEventListener('mouseup', () => { STATE.input[key] = false; });
  };

  bindTouch('btn-up', 'z');
  bindTouch('btn-down', 's');
  bindTouch('btn-left', 'q');
  bindTouch('btn-right', 'd');

  const attackBtn = document.getElementById('btn-attack');
  if (attackBtn) {
    attackBtn.addEventListener('touchstart', (e) => { e.preventDefault(); triggerAttack(); });
    attackBtn.addEventListener('mousedown', (e) => { triggerAttack(); });
  }

  const dashBtn = document.getElementById('btn-dash');
  if (dashBtn) {
    dashBtn.addEventListener('touchstart', (e) => { e.preventDefault(); triggerDash(); });
    dashBtn.addEventListener('mousedown', () => { triggerDash(); });
  }

  const interactBtn = document.getElementById('btn-interact');
  if (interactBtn) {
    interactBtn.addEventListener('touchstart', (e) => { e.preventDefault(); STATE.input.interactTriggered = true; });
    interactBtn.addEventListener('mousedown', () => { STATE.input.interactTriggered = true; });
  }
}

export function updateUI() {
  // Barres HP / Stamina
  if (hpBarInner) {
    const pct = Math.max(0, Math.min(100, (STATE.joueur.pv / STATE.joueur.pvMax) * 100));
    hpBarInner.style.width = `${pct}%`;
  }

  if (staminaBarInner) {
    const pct = Math.max(0, Math.min(100, (STATE.joueur.stamina / STATE.joueur.staminaMax) * 100));
    staminaBarInner.style.width = `${pct}%`;
  }

  if (relicsEl) {
    relicsEl.innerText = `Sceaus: ${STATE.monde.relicsActivees} / ${STATE.monde.relicsTotal}`;
  }

  if (statsEl) {
    statsEl.innerText = `Séquences Neutralisées: ${STATE.monde.memory.ennemisVaincus}`;
  }

  if (memoryLogEl && STATE.monde.memory.choixDernier) {
    memoryLogEl.innerText = `[LOG XEROX] : ${STATE.monde.memory.choixDernier}`;
  }

  // Prompt d'interaction
  if (interactPromptEl) {
    if (STATE.nearRelic) {
      interactPromptEl.classList.remove('hidden');
    } else {
      interactPromptEl.classList.add('hidden');
    }
  }

  renderMinimap();
}

function renderMinimap() {
  if (!minimapCtx || !STATE.joueur.position) return;

  const ctx = minimapCtx;
  const cx = 55;
  const cy = 55;
  const scale = 1.2; // Zoom minimap

  ctx.clearRect(0, 0, 110, 110);

  // Fond rond
  ctx.beginPath();
  ctx.arc(cx, cy, 50, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fill();
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  const px = STATE.joueur.position.x;
  const pz = STATE.joueur.position.z;

  // Dessiner Reliques
  relics.forEach(r => {
    const rx = cx + (r.pos.x - px) * scale;
    const ry = cy + (r.pos.z - pz) * scale;

    ctx.beginPath();
    ctx.arc(rx, ry, 4, 0, Math.PI * 2);
    ctx.fillStyle = r.activated ? '#ffd700' : '#00ffff';
    ctx.fill();
  });

  // Dessiner Ennemis
  ennemis.forEach(e => {
    if (!e.group) return;
    const ex = cx + (e.group.position.x - px) * scale;
    const ey = cy + (e.group.position.z - pz) * scale;

    ctx.beginPath();
    ctx.arc(ex, ey, e.type === "BOSS" ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = e.type === "BOSS" ? '#ff00ff' : '#ff3344';
    ctx.fill();
  });

  // Dessiner Joueur au centre
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

export function showEndOverlay(title, desc, isWin = false) {
  if (!overlayEl) return;
  overlayTitleEl.innerText = title;
  overlayDescEl.innerText = desc;
  if (isWin) {
    overlayTitleEl.style.color = '#ffd700';
  } else {
    overlayTitleEl.style.color = '#ff3344';
  }
  overlayEl.classList.remove('hidden');
}
