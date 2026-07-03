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
    try { cloudPush(); } catch (e) {} // sube a la nube si hay sesion (con debounce)
  }
  function norm(name) { return (name || '').toString().trim().toLowerCase(); }

  function ensure(m) {
    if (!m.exercises) m.exercises = {};
    if (!m.favorites) m.favorites = {};
    if (!m.recent) m.recent = [];
    if (!m.orders) m.orders = {};
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

  // ---- ORDEN DE MAQUINAS por rutina (para reflejar el layout del gym) ----
  // Guardamos el orden como lista de nombres de ejercicio para esa rutina.
  function orderGet(routineId) {
    if (!routineId) return null;
    var m = ensure(load());
    return m.orders[routineId] || null;
  }
  function orderSet(routineId, names) {
    if (!routineId || !Array.isArray(names)) return;
    var m = ensure(load());
    m.orders[routineId] = names;
    save(m);
  }

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

  // ============================================================
  // NUBE (Supabase): sincroniza el mismo blob entre dispositivos.
  // Tabla: user_memory (user_id PK, data jsonb). Ver sql-memoria-ejercicios.sql
  // ============================================================
  var _client = null;   // cliente supabase
  var _uid = null;      // id del usuario logueado
  var _pushTimer = null;

  // Une la memoria remota con la local (sin perder datos): gana el dato mas nuevo.
  function mergeInto(remote) {
    var m = ensure(load());
    remote = ensure(remote || {});
    // Ejercicios: peso/reps del que tenga lastAt mas nuevo; count = maximo.
    Object.keys(remote.exercises).forEach(function (k) {
      var re = remote.exercises[k], le = m.exercises[k];
      if (!le) { m.exercises[k] = re; return; }
      var remoteNewer = (re.lastAt || 0) > (le.lastAt || 0);
      m.exercises[k] = {
        weight: remoteNewer ? re.weight : le.weight,
        reps: remoteNewer ? re.reps : le.reps,
        count: Math.max(re.count || 0, le.count || 0),
        lastAt: Math.max(re.lastAt || 0, le.lastAt || 0)
      };
    });
    // Favoritas: union (se queda la marca mas reciente).
    Object.keys(remote.favorites).forEach(function (k) {
      if (!m.favorites[k] || (remote.favorites[k].at || 0) > (m.favorites[k].at || 0))
        m.favorites[k] = remote.favorites[k];
    });
    // Recientes: mezcla y quita duplicados por id (deja el mas nuevo).
    var byId = {};
    (m.recent || []).concat(remote.recent || []).forEach(function (r) {
      if (r && r.id && (!byId[r.id] || (r.at || 0) > (byId[r.id].at || 0))) byId[r.id] = r;
    });
    m.recent = Object.keys(byId).map(function (k) { return byId[k]; })
      .sort(function (a, b) { return (b.at || 0) - (a.at || 0); }).slice(0, 12);
    // Ordenes de maquinas: los remotos rellenan los que no existan localmente.
    Object.keys(remote.orders).forEach(function (k) {
      if (!m.orders[k]) m.orders[k] = remote.orders[k];
    });
    save(m);
    return m;
  }

  function configCloud(client, uid) { _client = client || null; _uid = uid || null; }

  // Trae la memoria de la nube y la fusiona con la local. Llamar al iniciar sesion.
  function cloudPull() {
    if (!_client || !_uid) return Promise.resolve(false);
    return _client.from('user_memory').select('data').eq('user_id', _uid).maybeSingle()
      .then(function (res) {
        if (res && res.data && res.data.data) mergeInto(res.data.data);
        return true;
      })
      .catch(function () { return false; });
  }

  // Sube la memoria completa a la nube (con debounce para no spamear).
  function cloudPush() {
    if (!_client || !_uid) return;
    if (_pushTimer) clearTimeout(_pushTimer);
    _pushTimer = setTimeout(function () {
      _client.from('user_memory')
        .upsert({ user_id: _uid, data: load(), updated_at: new Date().toISOString() })
        .then(function () {}, function () {});
    }, 1500);
  }

  window.FMMem = {
    exGet: exGet, exSetWeight: exSetWeight, exSetReps: exSetReps, exBumpDone: exBumpDone,
    favIs: favIs, favToggle: favToggle, favList: favList,
    recordRoutine: recordRoutine, recentList: recentList, summary: summary,
    orderGet: orderGet, orderSet: orderSet,
    configCloud: configCloud, cloudPull: cloudPull, cloudPush: cloudPush
  };
})();
