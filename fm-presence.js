/* ============================================================
 * fm-presence.js - Quien esta EN LINEA en Fit Match
 * ------------------------------------------------------------
 * Modelo "heartbeat": cada usuario actualiza profiles.last_seen
 * cada cierto tiempo mientras tiene la pagina abierta. Se considera
 * "en linea" a quien tuvo actividad en los ultimos ONLINE_WINDOW_MIN.
 * Requiere la columna profiles.last_seen (ver sql-en-linea.sql).
 * Expone window.FMPresence.
 * ============================================================ */
(function () {
  'use strict';

  const ONLINE_WINDOW_MIN = 3;     // activo en los ultimos 3 min = en linea
  const HEARTBEAT_MS = 45000;      // late cada 45 segundos
  let timer = null;
  let _supabase = null;
  let _userId = null;

  function isOnline(lastSeen) {
    if (!lastSeen) return false;
    const diffMin = (Date.now() - new Date(lastSeen).getTime()) / 60000;
    return diffMin <= ONLINE_WINDOW_MIN;
  }

  async function beat() {
    if (!_supabase || !_userId) return;
    if (document.hidden) return; // no latir si la pestana esta en segundo plano
    try {
      await _supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', _userId);
    } catch (e) { /* silencioso */ }
  }

  function startHeartbeat(supabase, userId) {
    _supabase = supabase; _userId = userId;
    if (!_supabase || !_userId) return;
    beat(); // latido inmediato al entrar
    if (timer) clearInterval(timer);
    timer = setInterval(beat, HEARTBEAT_MS);
    // late tambien al volver a la pestana
    document.addEventListener('visibilitychange', () => { if (!document.hidden) beat(); });
  }

  // Devuelve la lista de usuarios en linea (apodo + id)
  async function fetchOnline(supabase) {
    const sb = supabase || _supabase;
    if (!sb) return [];
    const cutoff = new Date(Date.now() - ONLINE_WINDOW_MIN * 60000).toISOString();
    try {
      const { data, error } = await sb
        .from('profiles')
        .select('id, apodo, last_seen')
        .gte('last_seen', cutoff)
        .order('last_seen', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      return [];
    }
  }

  // Pinta la lista en el panel "En linea ahora" (si existe en la pagina)
  async function refreshOnline(supabase) {
    const list = document.getElementById('online-list');
    const count = document.getElementById('online-count');
    if (!list) return;
    const users = await fetchOnline(supabase);
    if (count) count.textContent = '(' + users.length + ')';
    if (!users.length) {
      list.innerHTML = '<span class="text-gray-500 text-xs">Nadie en linea ahora mismo.</span>';
      return;
    }
    const myId = (window.currentProfile && window.currentProfile.id) || _userId;
    list.innerHTML = users.map(u => {
      const yo = (u.id === myId);
      return '<span class="inline-flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-full px-3 py-1 text-xs ' +
        (yo ? 'text-purple-300 border-purple-700' : 'text-gray-200') + '">' +
        '<span class="w-2 h-2 rounded-full bg-green-500"></span>' + escapeHtml(u.apodo || 'Atleta') +
        (yo ? ' <span class="text-[9px] uppercase text-purple-400">tu</span>' : '') + '</span>';
    }).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Auto-refresca el panel cada 30s mientras la pagina este abierta
  let panelTimer = null;
  function startPanelAutoRefresh(supabase) {
    refreshOnline(supabase);
    if (panelTimer) clearInterval(panelTimer);
    panelTimer = setInterval(() => { if (!document.hidden) refreshOnline(supabase); }, 30000);
  }

  window.FMPresence = { startHeartbeat, fetchOnline, refreshOnline, isOnline, startPanelAutoRefresh, ONLINE_WINDOW_MIN };
})();
