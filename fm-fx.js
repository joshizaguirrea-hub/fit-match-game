/* ============================================================
 * fm-fx.js - Efectos de Fit Match (sin archivos de audio)
 * ------------------------------------------------------------
 * - Sonidos generados con Web Audio API (click, check, campanita,
 *   tick de cuenta regresiva, fanfarria de exito).
 * - Vibracion en moviles (navigator.vibrate).
 * - Temporizador de DESCANSO entre rondas (overlay con anillo,
 *   cuenta regresiva, botones Saltar / +30s y campanita al final).
 * Expone window.FMFX.
 * ============================================================ */
(function () {
  'use strict';

  // ---------- AUDIO ----------
  let actx = null;
  function ctx() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { actx = null; }
    }
    if (actx && actx.state === 'suspended') { actx.resume().catch(function () {}); }
    return actx;
  }

  function tone(freq, dur, type, gain) {
    const c = ctx(); if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    o.connect(g); g.connect(c.destination);
    const t = c.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.2, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.2));
    o.start(t);
    o.stop(t + (dur || 0.2) + 0.03);
  }

  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  function click() { tone(440, 0.06, 'triangle', 0.12); vibrate(8); }
  function check() { tone(660, 0.08, 'sine', 0.18); setTimeout(function () { tone(880, 0.08, 'sine', 0.14); }, 60); vibrate(18); }
  function tick() { tone(620, 0.05, 'square', 0.10); }
  function roundDone() {
    tone(523, 0.12, 'sine', 0.2);
    setTimeout(function () { tone(784, 0.2, 'sine', 0.2); }, 120);
    vibrate([20, 40, 20]);
  }
  // Campanita de aviso "se acabo el descanso"
  function bell() {
    tone(1318, 0.5, 'sine', 0.26);
    setTimeout(function () { tone(1760, 0.65, 'sine', 0.22); }, 150);
    setTimeout(function () { tone(1318, 0.7, 'sine', 0.18); }, 320);
    vibrate([70, 60, 70, 60, 140]);
  }
  function success() {
    [523, 659, 784, 1046].forEach(function (f, i) {
      setTimeout(function () { tone(f, 0.26, 'sine', 0.22); }, i * 130);
    });
    vibrate([40, 60, 40, 60, 160]);
  }
  function beep(kind) {
    const map = { click: click, check: check, tick: tick, roundDone: roundDone, bell: bell, success: success };
    if (map[kind]) map[kind]();
  }

  // ---------- TEMPORIZADOR DE DESCANSO ----------
  const R = 88;
  const CIRC = 2 * Math.PI * R; // ~552.9
  let restInt = null;

  function ensureOverlay() {
    let ov = document.getElementById('fm-rest-overlay');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = 'fm-rest-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:100060;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 38%,#1b2138,#0a0c16);font-family:\'Space Grotesk\',sans-serif;text-align:center;padding:20px';
    ov.innerHTML =
      '<div style="max-width:360px;width:100%">' +
        '<p id="fm-rest-label" style="color:#a5b4fc;font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:13px;margin:0 0 8px">Descanso</p>' +
        '<div style="position:relative;width:210px;height:210px;margin:0 auto 14px">' +
          '<svg width="210" height="210" viewBox="0 0 200 200" style="transform:rotate(-90deg)">' +
            '<circle cx="100" cy="100" r="88" stroke="#2a3050" stroke-width="14" fill="none"/>' +
            '<circle id="fm-rest-ring" cx="100" cy="100" r="88" stroke="#7c5cff" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="0"/>' +
          '</svg>' +
          '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column">' +
            '<span id="fm-rest-time" style="font-size:54px;font-weight:800;color:#fff;line-height:1">1:30</span>' +
            '<span style="font-size:11px;color:#8b92b0;text-transform:uppercase;letter-spacing:.1em">respira</span>' +
          '</div>' +
        '</div>' +
        '<p id="fm-rest-next" style="color:#e2e8f0;font-weight:700;margin:0 0 18px;font-size:14px">&nbsp;</p>' +
        '<div style="display:flex;gap:10px;justify-content:center">' +
          '<button id="fm-rest-add" style="background:#222842;color:#c7cded;border:none;border-radius:12px;padding:12px 16px;font-weight:800;cursor:pointer;font-family:inherit">+30s</button>' +
          '<button id="fm-rest-skip" style="background:linear-gradient(150deg,#7c3aed,#22d3ee);color:#fff;border:none;border-radius:12px;padding:12px 22px;font-weight:800;cursor:pointer;font-family:inherit">Saltar descanso</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function fmt(s) { const m = Math.floor(s / 60); const ss = s % 60; return m + ':' + String(ss).padStart(2, '0'); }

  function restTimer(opts) {
    opts = opts || {};
    let total = opts.seconds || 90;
    let remain = total;
    const ov = ensureOverlay();
    const timeEl = ov.querySelector('#fm-rest-time');
    const ring = ov.querySelector('#fm-rest-ring');
    const labelEl = ov.querySelector('#fm-rest-label');
    const nextEl = ov.querySelector('#fm-rest-next');
    labelEl.textContent = opts.label || 'Descanso';
    nextEl.textContent = opts.next ? ('Sigue: ' + opts.next) : '\u00a0';

    function paint() {
      timeEl.textContent = fmt(remain);
      const frac = Math.max(0, remain / total);
      ring.setAttribute('stroke-dashoffset', (CIRC * (1 - frac)).toFixed(1));
      ring.setAttribute('stroke', remain <= 5 ? '#f43f5e' : '#7c5cff');
    }

    function finish(skipBell) {
      if (restInt) { clearInterval(restInt); restInt = null; }
      ov.style.display = 'none';
      if (!skipBell) bell();
      if (typeof opts.onDone === 'function') opts.onDone();
    }

    ov.querySelector('#fm-rest-skip').onclick = function () { finish(true); };
    ov.querySelector('#fm-rest-add').onclick = function () { remain += 30; total += 30; paint(); };

    if (restInt) { clearInterval(restInt); }
    paint();
    ov.style.display = 'flex';
    ctx(); // intenta desbloquear audio (el usuario acaba de tocar un boton)

    restInt = setInterval(function () {
      remain--;
      if (remain <= 3 && remain > 0) { tick(); }
      if (remain <= 0) { finish(false); return; }
      paint();
    }, 1000);
  }

  window.FMFX = {
    beep: beep, click: click, check: check, bell: bell,
    success: success, roundDone: roundDone, tick: tick,
    vibrate: vibrate, restTimer: restTimer
  };
})();
