/* ============================================================
 * fm-group-call.js - Videollamada GRUPAL (Fit Match)
 * ------------------------------------------------------------
 * Para 4+ amigos a la vez, ligada al CODIGO de sala.
 * Todos los que entran con el mismo codigo caen en la misma
 * sala de video. Usa Jitsi Meet embebido (meet.jit.si):
 * gratis, sin servidor propio, con pantalla compartida.
 *
 * Limitacion honesta: la sala de video es publica y su nombre
 * deriva del codigo de 4 letras (igual de "secreto" que la sala
 * de entrenamiento). Suficiente para entrenar con amigos.
 *
 * Expone: window.FMGroupCall.attach(code)  -> muestra el boton
 *         window.FMGroupCall.open(code)    -> abre la videollamada
 *         window.FMGroupCall.close()
 * ============================================================ */
(function () {
  'use strict';

  let currentCode = null;
  const BASE = 'https://meet.jit.si/';

  function roomName(code) {
    // Namespace para reducir choques con salas ajenas en Jitsi publico
    return 'FitMatchGym' + String(code).toUpperCase() + 'Sala';
  }

  function myName() {
    try {
      if (window.cloudProfile && window.cloudProfile.apodo) return window.cloudProfile.apodo;
    } catch (e) {}
    return 'Atleta';
  }

  function ensureUI() {
    if (document.getElementById('fm-gcall-fab')) return;

    // Boton flotante (FAB) para abrir/volver a la videollamada grupal
    const fab = document.createElement('button');
    fab.id = 'fm-gcall-fab';
    fab.title = 'Videollamada grupal';
    fab.style.cssText = 'position:fixed;right:14px;bottom:66px;z-index:100085;background:linear-gradient(135deg,#ef4444,#f97316);color:#fff;border:none;border-radius:999px;padding:11px 16px;font-family:\'Space Grotesk\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.45);display:none;align-items:center;gap:8px';
    fab.innerHTML = '<i class="fa-solid fa-video"></i> Videollamada grupal';
    fab.onclick = function () { open(currentCode); };
    document.body.appendChild(fab);

    // Ventana con el iframe de Jitsi
    const win = document.createElement('div');
    win.id = 'fm-gcall-window';
    win.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:100086;width:380px;max-width:calc(100% - 28px);height:520px;max-height:calc(100% - 90px);background:#0f1117;border:1px solid #2c3350;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.55);display:none;flex-direction:column;overflow:hidden;font-family:\'Space Grotesk\',sans-serif';
    win.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:linear-gradient(135deg,#ef4444,#f97316);color:#fff">' +
        '<div style="font-weight:700;font-size:13px"><i class="fa-solid fa-video"></i> Videollamada grupal <span id="fm-gcall-code" style="opacity:.85;font-weight:600"></span></div>' +
        '<div style="display:flex;gap:6px">' +
          '<button id="fm-gcall-min" title="Minimizar" style="background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:8px;width:28px;height:28px;cursor:pointer"><i class="fa-solid fa-minus"></i></button>' +
          '<button id="fm-gcall-close" title="Salir" style="background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:8px;width:28px;height:28px;cursor:pointer"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
      '</div>' +
      '<div id="fm-gcall-frame" style="flex:1;background:#05070d"></div>';
    document.body.appendChild(win);

    document.getElementById('fm-gcall-min').onclick = minimize;
    document.getElementById('fm-gcall-close').onclick = close;
  }

  function attach(code) {
    ensureUI();
    currentCode = code;
    const fab = document.getElementById('fm-gcall-fab');
    if (fab) fab.style.display = 'inline-flex';
  }

  function open(code) {
    ensureUI();
    if (code) currentCode = code;
    if (!currentCode) return;

    const win = document.getElementById('fm-gcall-window');
    const fab = document.getElementById('fm-gcall-fab');
    const frame = document.getElementById('fm-gcall-frame');
    const codeLbl = document.getElementById('fm-gcall-code');
    if (codeLbl) codeLbl.textContent = '· ' + String(currentCode).toUpperCase();

    // Crear el iframe solo una vez por sesion de llamada
    if (!frame.querySelector('iframe')) {
      const room = roomName(currentCode);
      const hash = '#config.prejoinPageEnabled=false' +
        '&config.startWithAudioMuted=false' +
        '&config.disableDeepLinking=true' +
        '&userInfo.displayName=' + encodeURIComponent(myName());
      const iframe = document.createElement('iframe');
      iframe.src = BASE + room + hash;
      iframe.allow = 'camera; microphone; fullscreen; display-capture; autoplay';
      iframe.style.cssText = 'width:100%;height:100%;border:0;display:block';
      frame.appendChild(iframe);
    }

    win.style.display = 'flex';
    if (fab) fab.style.display = 'none';
  }

  function minimize() {
    const win = document.getElementById('fm-gcall-window');
    const fab = document.getElementById('fm-gcall-fab');
    if (win) win.style.display = 'none';
    if (fab) fab.style.display = 'inline-flex'; // sigue en la llamada, solo oculta la ventana
  }

  function close() {
    const win = document.getElementById('fm-gcall-window');
    const fab = document.getElementById('fm-gcall-fab');
    const frame = document.getElementById('fm-gcall-frame');
    if (frame) frame.innerHTML = ''; // corta camara/microfono al destruir el iframe
    if (win) win.style.display = 'none';
    if (fab) fab.style.display = 'none';
    currentCode = null;
  }

  window.FMGroupCall = { attach, open, close, minimize };
})();
