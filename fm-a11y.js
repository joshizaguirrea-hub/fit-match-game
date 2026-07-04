/* fm-a11y.js
 * Accesibilidad (WCAG 2.2 AA) sin tocar cientos de lineas de HTML.
 *
 * La app renderiza MUCHOS botones de solo-icono con atributo `title` pero sin
 * nombre accesible para lectores de pantalla. Este modulo, de forma automatica
 * y DRY, copia `title` -> `aria-label` en cualquier elemento que no lo tenga,
 * incluidos los que se inyectan dinamicamente (via MutationObserver con debounce
 * usando requestIdleCallback para no penalizar el rendimiento).
 */
(function () {
  function sweep(root) {
    var scope = root || document;
    var els = scope.querySelectorAll('[title]:not([aria-label])');
    for (var i = 0; i < els.length; i++) {
      var t = els[i].getAttribute('title');
      if (t && t.trim()) els[i].setAttribute('aria-label', t.trim());
    }
  }

  function ready() {
    sweep(document);
    if (!('MutationObserver' in window) || !document.body) return;
    var pending = false;
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 300); };
    var mo = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      idle(function () { pending = false; sweep(document); }, { timeout: 500 });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState !== 'loading') ready();
  else document.addEventListener('DOMContentLoaded', ready);
})();
