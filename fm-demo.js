/* ============================================================
 * fm-demo.js - Demos ANIMADAS de ejercicios (Fit Match)
 * ------------------------------------------------------------
 * free-exercise-db entrega 2 frames por ejercicio (0.jpg = inicio,
 * 1.jpg = fin del movimiento). Aqui los cruzamos con una animacion
 * CSS pura (crossfade inicio<->fin) para simular el movimiento, sin
 * archivos pesados ni timers de JS.
 *
 * Respeta prefers-reduced-motion (accesibilidad): si el usuario pidio
 * menos animacion, muestra el frame de inicio fijo.
 *
 * API:  FMDemo.html(nombre, { height, rounded })  -> string HTML
 *   height: alto CSS inline (ej '224px'). Usamos inline y NO clases de
 *   Tailwind: el CDN JIT no genera clases (h-56, etc.) para HTML inyectado
 *   dinamicamente, y la caja colapsaria.
 * Expone window.FMDemo.
 * ============================================================ */
(function () {
  'use strict';

  var STYLE_ID = 'fm-demo-style';
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.fm-demo{position:relative !important;overflow:hidden;background:#eef0f6}' +
      '.fm-demo img{position:absolute !important;top:0 !important;left:0 !important;' +
      'width:100% !important;height:100% !important;object-fit:cover;display:block;max-width:none !important}' +
      '.fm-demo .fm-demo-b{opacity:0;animation:fmDemoCross 1.8s ease-in-out infinite alternate}' +
      '@keyframes fmDemoCross{0%{opacity:0}100%{opacity:1}}' +
      '.fm-demo-badge{position:absolute;bottom:6px;right:6px;z-index:5;background:rgba(17,24,39,.82);' +
      'color:#fff;font-size:9px;font-weight:800;padding:2px 8px;border-radius:999px;letter-spacing:.04em;' +
      "display:flex;align-items:center;gap:4px;font-family:'Space Grotesk',sans-serif}" +
      '@media (prefers-reduced-motion: reduce){.fm-demo .fm-demo-b{animation:none;opacity:0}}';
    document.head.appendChild(s);
  }

  function esc(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fallback(heightStyle, rounded) {
    return '<div class="' + rounded + ' border-2 border-gray-900 w-full flex items-center ' +
      'justify-center bg-gray-100" style="height:' + heightStyle + '">' +
      '<i class="fa-solid fa-dumbbell text-4xl text-gray-400"></i></div>';
  }

  // Devuelve el HTML de una demo animada para el ejercicio dado.
  function html(name, opts) {
    ensureStyle();
    opts = opts || {};
    var heightStyle = opts.height || '176px';
    var rounded = opts.rounded || 'rounded-xl';
    var pair = (window.FMPhotos && window.FMPhotos.getPair) ? window.FMPhotos.getPair(name) : [];
    if (!pair || pair.length !== 2) return fallback(heightStyle, rounded);
    var safe = esc(name);
    // Si el frame base (a) no carga, reemplazamos todo por el icono de respaldo.
    var onerrA = "this.closest('.fm-demo').outerHTML='" +
      fallback(heightStyle, rounded).replace(/'/g, "\\'") + "'";
    return '<div class="fm-demo w-full ' + rounded +
      ' border-2 border-gray-900" style="height:' + heightStyle + '">' +
        '<img class="fm-demo-a" src="' + pair[0] + '" alt="' + safe + ' (inicio)" ' +
          'onerror="' + onerrA + '">' +
        '<img class="fm-demo-b" src="' + pair[1] + '" alt="' + safe + ' (fin)" ' +
          "onerror=\"this.style.display='none'\">" +
        '<span class="fm-demo-badge"><i class="fa-solid fa-circle-play"></i>Demo</span>' +
      '</div>';
  }

  window.FMDemo = { html: html };
})();
