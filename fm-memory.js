/* fm-memory.js
 * "Cerebro" local de Fit Match: recuerda por dispositivo (localStorage) lo que el
 * usuario va logrando, para que la app se sienta inteligente y no vuelva a preguntar.
 *
 * Guarda:
 *  - Por ejercicio (clave = nombre): peso usado (kg), reps preferidas, veces hecho, ultima fecha.
 *  - Rutinas FAVORITAS (id -> {id,name}).
 *  - Rutinas recientes (ultimas seleccionadas).
 *
 * DRY: un solo objeto en 'fm_memory_v1'. Toda la app lee/escribe via window.FMMem.
 */
(function () {
  var KEY = 'fm_memory_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(m) {
    try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {}
  }
  function norm(name) { return (name || '').toString().trim().toLowerCase(); }

  function ensure(m) {
    if (!m.exercises) m.exercises = {};
    if (!m.favorites) m.favorites = {};
    if (!m.recent) m.recent = [];
    return m;
  }

  // ---- EJERCICIOS (peso + reps por maquina) ----
  function exGet(name) {
    var m = ensure(load());
    return m.exercises[norm(name)] || null;
  }
  function exSetWeight(name, weight) {
    var m = ensure(load());
    var k = norm(name);
    var e = m.exercises[k] || {};
    e.weight = weight; e.lastAt = Date.now();
    m.exercises[k] = e; save(m);
    return e;
  }
  function exSetReps(name, reps) {
    var m = ensure(load());
    var k = norm(name);
    var e = m.exercises[k] || {};
    e.reps = reps; e.lastAt = Date.now();
    m.exercises[k] = e; save(m);
    return e;
  }
  function exBumpDone(name) {
    var m = ensure(load());
    var k = norm(name);
    var e = m.exercises[k] || {};
    e.count = (e.count || 0) + 1; e.lastAt = Date.now();
    m.exercises[k] = e; save(m);
    return e;
  }

  // ---- FAVORITAS ----
  function favIs(id) { var m = ensure(load()); return !!m.favorites[id]; }
  function favToggle(id, name) {
    var m = ensure(load());
    if (m.favorites[id]) { delete m.favorites[id]; save(m); return false; }
    m.favorites[id] = { id: id, name: name, at: Date.now() };
    save(m); return true;
  }
  function favList() {
    var m = ensure(load());
    return Object.keys(m.favorites).map(function (k) { return m.favorites[k]; })
      .sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
  }

  // ---- RECIENTES ----
  function recordRoutine(routine) {
    if (!routine || !routine.id) return;
    var m = ensure(load());
    m.recent = (m.recent || []).filter(function (r) { return r.id !== routine.id; });
    m.recent.unshift({ id: routine.id, name: routine.name, at: Date.now() });
    if (m.recent.length > 12) m.recent = m.recent.slice(0, 12);
    save(m);
  }
  function recentList() { return ensure(load()).recent || []; }

  // ---- RESUMEN (para el Entrenador IA) ----
  function summary() {
    var m = ensure(load());
    var exNames = Object.keys(m.exercises);
    var totalDone = exNames.reduce(function (s, k) { return s + (m.exercises[k].count || 0); }, 0);
    return {
      ejerciciosRegistrados: exNames.length,
      seriesTotales: totalDone,
      favoritas: Object.keys(m.favorites).length,
      recientes: (m.recent || []).length
    };
  }

  window.FMMem = {
    exGet: exGet, exSetWeight: exSetWeight, exSetReps: exSetReps, exBumpDone: exBumpDone,
    favIs: favIs, favToggle: favToggle, favList: favList,
    recordRoutine: recordRoutine, recentList: recentList, summary: summary
  };
})();
