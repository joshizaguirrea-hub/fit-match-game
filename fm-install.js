/* ============================================================
 * fm-install.js - Boton/banner "Instalar Fit Match" (PWA)
 * ------------------------------------------------------------
 * - Android/PC (Chrome/Edge): usa beforeinstallprompt para
 *   mostrar un boton nativo de instalar.
 * - iPhone (Safari): no hay prompt; mostramos instrucciones
 *   (Compartir -> Anadir a pantalla de inicio).
 * - Si ya esta instalada (standalone), no muestra nada.
 * ============================================================ */
(function () {
  'use strict';

  // Ya instalada / abierta como app -> no molestar
  const standalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (standalone) return;

  // Respetar si el usuario la cerro antes
  if (localStorage.getItem('fm_install_dismissed') === '1') return;

  let deferredPrompt = null;
  let promptFired = false;

  function banner(innerHTML) {
    if (document.getElementById('fm-install-banner')) return document.getElementById('fm-install-banner');
    const b = document.createElement('div');
    b.id = 'fm-install-banner';
    b.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:100095;max-width:420px;width:calc(100% - 24px);background:#0f1117;border:1px solid #2c3350;border-radius:16px;box-shadow:0 12px 34px rgba(0,0,0,.5);padding:12px 14px;display:flex;align-items:center;gap:12px;font-family:\'Space Grotesk\',\'Inter\',sans-serif';
    b.innerHTML = innerHTML;
    document.body.appendChild(b);
    return b;
  }

  function iconHTML() {
    return '<img src="icon-192.png" alt="Fit Match" style="width:44px;height:44px;border-radius:12px;flex-shrink:0">';
  }

  function dismiss() {
    const b = document.getElementById('fm-install-banner');
    if (b) b.remove();
    localStorage.setItem('fm_install_dismissed', '1');
  }
  window.fmInstallDismiss = dismiss;

  // ----- Android / PC -----
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    promptFired = true;
    const b = banner(
      iconHTML() +
      '<div style="flex:1;min-width:0"><div style="color:#eceefb;font-weight:700;font-size:14px">Instala Fit Match</div>' +
      '<div style="color:#8b92b0;font-size:11px">Acceso directo con su icono, pantalla completa.</div></div>' +
      '<button id="fm-install-go" style="background:linear-gradient(135deg,#7c5cff,#22d3ee);color:#fff;border:none;border-radius:10px;padding:9px 14px;font-weight:700;font-size:13px;cursor:pointer;flex-shrink:0">Instalar</button>' +
      '<button onclick="fmInstallDismiss()" title="Cerrar" style="background:none;border:none;color:#8b92b0;font-size:18px;cursor:pointer;flex-shrink:0">&times;</button>'
    );
    const go = document.getElementById('fm-install-go');
    if (go) go.onclick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (err) {}
      deferredPrompt = null;
      dismiss();
    };
  });

  // Si se instala, ocultar y recordar
  window.addEventListener('appinstalled', () => {
    localStorage.setItem('fm_install_dismissed', '1');
    const b = document.getElementById('fm-install-banner');
    if (b) b.remove();
  });

  // ----- iPhone / iPad (Safari) -----
  const ua = window.navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  if (isIOS && isSafari) {
    // Esperar un poco para no aparecer de golpe
    setTimeout(() => {
      banner(
        iconHTML() +
        '<div style="flex:1;min-width:0"><div style="color:#eceefb;font-weight:700;font-size:14px">Instala Fit Match</div>' +
        '<div style="color:#8b92b0;font-size:11px">Toca <i class="fa-solid fa-arrow-up-from-bracket"></i> Compartir y luego <b>\u201cA\u00f1adir a inicio\u201d</b>.</div></div>' +
        '<button onclick="fmInstallDismiss()" title="Cerrar" style="background:none;border:none;color:#8b92b0;font-size:18px;cursor:pointer;flex-shrink:0">&times;</button>'
      );
    }, 1500);
  }

  // ----- Respaldo Android/otros: si el prompt no se dispara solo, damos instrucciones -----
  const isAndroid = /android/i.test(ua);
  if (isAndroid && !(isIOS && isSafari)) {
    setTimeout(() => {
      if (promptFired || standalone) return; // ya hay boton nativo o ya instalada
      if (document.getElementById('fm-install-banner')) return;
      banner(
        iconHTML() +
        '<div style="flex:1;min-width:0"><div style="color:#eceefb;font-weight:700;font-size:14px">Instala Fit Match</div>' +
        '<div style="color:#8b92b0;font-size:11px">Abre el men\u00fa <b>\u22ee</b> (arriba a la derecha) y elige <b>\u201cInstalar aplicaci\u00f3n\u201d</b>.</div></div>' +
        '<button onclick="fmInstallDismiss()" title="Cerrar" style="background:none;border:none;color:#8b92b0;font-size:18px;cursor:pointer;flex-shrink:0">&times;</button>'
      );
    }, 4000);
  }
})();
