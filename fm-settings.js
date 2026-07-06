/* ============================================================
 * fm-settings.js - Panel de Ajustes de Fit Match
 * ------------------------------------------------------------
 * Secciones: General (tema, idioma, Health Connect), Notificaciones
 * (recordatorios), Musica (autoplay lobby/Spotify), Sonido (timbre +
 * calibracion de volumen) y Apoyo (compartir, valorar, contacto,
 * politica de privacidad).
 *
 * Guarda preferencias por dispositivo en localStorage 'fm_settings_v1'.
 * Reutiliza el sistema de temas de la Tienda (window.equipCosmetic) y
 * el motor de sonido (window.FMFX).  Expone window.FMSettings.
 * ============================================================ */
(function () {
  'use strict';

  var KEY = 'fm_settings_v1';
  var CONTACT_EMAIL = 'fit.match.studio@gmail.com';
  var APP_URL = (function () {
    try { return location.origin + location.pathname.replace(/jugar\.html.*$/, 'jugar.html'); }
    catch (e) { return 'https://joshizaguirrea-hub.github.io/fit-match-game/'; }
  })();

  var DEFAULTS = {
    lang: 'es',
    health: false,
    reminderOn: false,
    reminderTime: '19:00',
    musicLobby: false,
    spotifyStart: false,
    volume: 0.7,
    alarmOn: true
  };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  function get(k) { return load()[k]; }
  function set(k, v) { var p = load(); p[k] = v; save(p); return v; }

  function toast(title, msg, icon, color) {
    if (window.FMNotify && window.FMNotify.toast) {
      window.FMNotify.toast({ title: title, message: msg || '', icon: icon || 'fa-gear', color: color || '#7c5cff' });
    } else { alert(title + (msg ? '\n' + msg : '')); }
  }

  /* ---------- APLICAR PREFERENCIAS ---------- */
  function applyPrefs() {
    var p = load();
    if (window.FMFX) {
      if (window.FMFX.setVolume) window.FMFX.setVolume(p.volume);
      if (window.FMFX.setMuted) window.FMFX.setMuted(!p.alarmOn);
    }
    // Tema guardado (funciona tambien para invitados via FMMem/localStorage)
    if (window.applyActiveCosmetics) { try { window.applyActiveCosmetics(); } catch (e) {} }
    startReminderChecker();
  }

  /* ---------- MUSICA DEL LOBBY (autoplay al entrar) ---------- */
  function maybeAutoMusic() {
    var p = load();
    if ((p.musicLobby || p.spotifyStart) && window.FMMusic) {
      // El navegador puede bloquear autoplay hasta la primera interaccion;
      // abrimos el reproductor para que quede a un toque.
      try { window.FMMusic.toggle(true); } catch (e) {}
    }
  }

  /* ---------- RECORDATORIOS (Notification API) ---------- */
  var reminderInt = null;
  function startReminderChecker() {
    if (reminderInt) { clearInterval(reminderInt); reminderInt = null; }
    var p = load();
    if (!p.reminderOn) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    reminderInt = setInterval(function () {
      var pr = load();
      if (!pr.reminderOn) return;
      var now = new Date();
      var hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      if (hhmm !== pr.reminderTime) return;
      var today = now.toISOString().slice(0, 10);
      if (localStorage.getItem('fm_reminder_fired') === today) return;
      localStorage.setItem('fm_reminder_fired', today);
      try {
        new Notification('Fit Match \u00b7 \u00a1Hora de entrenar! \ud83d\udcaa', {
          body: 'No rompas tu racha. Un entreno corto cuenta.',
          icon: 'icon-192.png'
        });
      } catch (e) {}
    }, 30000);
  }

  async function toggleReminder(on) {
    if (on) {
      if (!('Notification' in window)) { toast('No disponible', 'Tu navegador no soporta notificaciones.', 'fa-bell-slash', '#ef4444'); return false; }
      var perm = Notification.permission;
      if (perm !== 'granted') { perm = await Notification.requestPermission(); }
      if (perm !== 'granted') { toast('Permiso denegado', 'Activa las notificaciones en tu navegador para usar recordatorios.', 'fa-bell-slash', '#f59e0b'); return false; }
    }
    set('reminderOn', on);
    startReminderChecker();
    if (on) toast('Recordatorio activado', 'Te avisar\u00e9 a las ' + get('reminderTime') + ' (con la app abierta).', 'fa-bell', '#22c55e');
    return on;
  }

  /* ---------- APOYO: compartir / valorar / contacto ---------- */
  function shareApp() {
    var texto = '\u00a1Entreno con Fit Match y me encanta! \ud83d\udcaa Rutinas, retos con amigos, clanes y m\u00e1s. \u00danete gratis:\n' + APP_URL;
    if (navigator.share) { navigator.share({ title: 'Fit Match', text: texto, url: APP_URL }).catch(function () {}); }
    else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { toast('\u00a1Enlace copiado!', 'P\u00e9galo donde quieras.', 'fa-copy', '#a855f7'); }).catch(function () { alert(texto); });
    } else { alert(texto); }
  }
  function rateUs() {
    var texto = '\u2b50\u2b50\u2b50\u2b50\u2b50 \u00a1Recomiendo Fit Match! La mejor app para entrenar en casa. ' + APP_URL;
    if (navigator.share) { navigator.share({ title: 'Fit Match', text: texto, url: APP_URL }).catch(function () {}); }
    else { window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Mi opini\u00f3n sobre Fit Match') + '&body=' + encodeURIComponent('\u00a1Hola Fit Match Studio! Quer\u00eda contarles que...'); }
  }
  function contactUs() {
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Contacto \u00b7 Fit Match') + '&body=' + encodeURIComponent('Hola equipo de Fit Match Studio,\n\n');
  }
  function openPrivacy() { window.open('privacy.html', '_blank', 'noopener'); }
  function openGuide() { close(); if (window.FMGuide) FMGuide.open(); else toast('Gu\u00eda no disponible', 'Vuelve a intentarlo en un momento.', 'fa-circle-question', '#0ea5a4'); }

  /* ---------- TEMA ---------- */
  function currentTheme() {
    if (window.FMMem && window.FMMem.shopActive) return window.FMMem.shopActive('theme') || 'theme_default';
    return 'theme_default';
  }
  function setTheme(id) {
    if (window.equipCosmetic) { window.equipCosmetic('theme', id); }
    else if (window.applyTheme) { window.applyTheme(id); }
    render();
  }

  /* ---------- UI ---------- */
  function ensureUI() {
    if (document.getElementById('fm-settings-modal')) return;
    // Blindaje: el panel es claro; forzamos texto legible sobre cualquier tema.
    var st = document.createElement('style');
    st.textContent =
      '#fm-settings-modal .st-card{background:#fff;border:2px solid #111827;border-radius:16px;color:#111827}' +
      '#fm-settings-modal .st-card .muted{color:#6b7280}' +
      '#fm-settings-modal .st-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 13px}' +
      '#fm-settings-modal .st-row + .st-row{border-top:1px solid #eef0f6}' +
      '#fm-settings-modal .st-h{font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#7c5cff;margin:14px 4px 6px;display:flex;align-items:center;gap:6px}' +
      '#fm-settings-modal .sw{width:46px;height:26px;border-radius:999px;background:#cbd0e0;position:relative;cursor:pointer;transition:background .2s;border:none;flex:none}' +
      '#fm-settings-modal .sw.on{background:#22c55e}' +
      '#fm-settings-modal .sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}' +
      '#fm-settings-modal .sw.on::after{left:23px}' +
      '#fm-settings-modal .st-btn{border:2px solid #111827;border-radius:10px;padding:7px 12px;font-weight:800;font-size:12px;cursor:pointer;background:#fff;color:#111827}' +
      '#fm-settings-modal .st-btn.active{background:#7c5cff;color:#fff;border-color:#7c5cff}' +
      '#fm-settings-modal .st-link{width:100%;text-align:left;background:#fff;border:none;padding:12px 13px;font-weight:700;font-size:13px;color:#111827;cursor:pointer;display:flex;align-items:center;gap:10px}' +
      '#fm-settings-modal .st-link + .st-link{border-top:1px solid #eef0f6}' +
      '#fm-settings-modal input[type=range]{accent-color:#7c5cff}' +
      '#fm-settings-modal input[type=time]{border:1px solid #cbd0e0;border-radius:8px;padding:5px 8px;font-weight:700;color:#111827;background:#fff}';
    document.head.appendChild(st);

    var modal = document.createElement('div');
    modal.id = 'fm-settings-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(4px);display:none;z-index:100086;padding:16px;overflow-y:auto;font-family:\'Space Grotesk\',sans-serif';
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    modal.innerHTML =
      '<div style="background:#f4f5fb;border:4px solid #111827;border-radius:24px;max-width:520px;width:100%;margin:20px auto;box-shadow:8px 8px 0 #111827;overflow:hidden">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border-bottom:2px solid #111827">' +
          '<h3 style="font-weight:800;font-size:20px;color:#111827;margin:0;display:flex;align-items:center;gap:8px"><i class="fa-solid fa-gear" style="color:#7c5cff"></i>Ajustes</h3>' +
          '<button id="fm-set-close" style="background:none;border:none;font-size:22px;color:#6b7280;cursor:pointer"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
        '<div id="fm-set-body" style="padding:12px 14px 18px;max-height:76vh;overflow-y:auto"></div>' +
      '</div>';
    document.body.appendChild(modal);
    document.getElementById('fm-set-close').onclick = close;
  }

  function swHTML(id, on) { return '<button class="sw' + (on ? ' on' : '') + '" onclick="FMSettings._tgl(\'' + id + '\',this)"></button>'; }

  function render() {
    var body = document.getElementById('fm-set-body');
    if (!body) return;
    var p = load();
    var th = currentTheme();
    body.innerHTML =
      // GENERAL
      '<p class="st-h"><i class="fa-solid fa-sliders"></i>General</p>' +
      '<div class="st-card">' +
        '<div class="st-row"><div><div style="font-weight:700">Tema</div><div class="muted" style="font-size:11px">M\u00e1s temas en la Tienda \ud83d\uded2</div></div>' +
          '<div style="display:flex;gap:6px">' +
            '<button class="st-btn' + (th === 'theme_default' ? ' active' : '') + '" onclick="FMSettings._theme(\'theme_default\')"><i class="fa-solid fa-moon"></i> Oscuro</button>' +
            '<button class="st-btn' + (th === 'theme_light' ? ' active' : '') + '" onclick="FMSettings._theme(\'theme_light\')"><i class="fa-solid fa-sun"></i> Claro</button>' +
          '</div>' +
        '</div>' +
        '<div class="st-row"><div style="font-weight:700">Idioma</div>' +
          '<div style="display:flex;gap:6px">' +
            '<button class="st-btn' + (p.lang === 'es' ? ' active' : '') + '" onclick="FMSettings._lang(\'es\')">Espa\u00f1ol</button>' +
            '<button class="st-btn' + (p.lang === 'en' ? ' active' : '') + '" onclick="FMSettings._lang(\'en\')">English</button>' +
          '</div>' +
        '</div>' +
        '<div class="st-row"><div><div style="font-weight:700">Health Connect</div><div class="muted" style="font-size:11px">Sincronizar pasos y calor\u00edas (pr\u00f3ximamente)</div></div>' + swHTML('health', p.health) + '</div>' +
      '</div>' +
      // NOTIFICACIONES
      '<p class="st-h"><i class="fa-solid fa-bell"></i>Recordatorios</p>' +
      '<div class="st-card">' +
        '<div class="st-row"><div><div style="font-weight:700">Recordatorio diario</div><div class="muted" style="font-size:11px">Aviso para entrenar (con la app abierta)</div></div>' + swHTML('reminderOn', p.reminderOn) + '</div>' +
        '<div class="st-row"><div style="font-weight:700">Hora</div><input type="time" value="' + p.reminderTime + '" onchange="FMSettings._time(this.value)"></div>' +
      '</div>' +
      // MUSICA
      '<p class="st-h"><i class="fa-brands fa-spotify"></i>M\u00fasica</p>' +
      '<div class="st-card">' +
        '<div class="st-row"><div style="font-weight:700">Reproducir al entrar al lobby</div>' + swHTML('musicLobby', p.musicLobby) + '</div>' +
        '<div class="st-row"><div><div style="font-weight:700">Abrir Spotify al inicio</div><div class="muted" style="font-size:11px">El navegador puede pedir un toque para sonar</div></div>' + swHTML('spotifyStart', p.spotifyStart) + '</div>' +
        '<div class="st-row"><div style="font-weight:700">Reproductor</div><button class="st-btn active" onclick="if(window.FMMusic)FMMusic.toggle(true)"><i class="fa-solid fa-play"></i> Abrir</button></div>' +
      '</div>' +
      // SONIDO
      '<p class="st-h"><i class="fa-solid fa-volume-high"></i>Sonido</p>' +
      '<div class="st-card">' +
        '<div class="st-row"><div><div style="font-weight:700">Timbre de alarma</div><div class="muted" style="font-size:11px">Suena al inicio/fin de ejercicio y descanso</div></div>' + swHTML('alarmOn', p.alarmOn) + '</div>' +
        '<div class="st-row"><div style="font-weight:700">Volumen</div>' +
          '<input type="range" min="0" max="100" value="' + Math.round(p.volume * 100) + '" oninput="FMSettings._vol(this.value)" onchange="FMSettings._volTest()" style="width:150px"></div>' +
      '</div>' +
      // APOYO
      '<p class="st-h"><i class="fa-solid fa-heart"></i>Apoyo</p>' +
      '<div class="st-card" style="padding:2px 0">' +
        '<button class="st-link" onclick="FMSettings.guide()"><i class="fa-solid fa-circle-question" style="color:#0ea5a4;width:18px"></i> Gu\u00eda de uso</button>' +
        '<button class="st-link" onclick="FMSettings.share()"><i class="fa-solid fa-share-nodes" style="color:#7c5cff;width:18px"></i> Compartir aplicaci\u00f3n</button>' +
        '<button class="st-link" onclick="FMSettings.rate()"><i class="fa-solid fa-star" style="color:#f59e0b;width:18px"></i> Val\u00f3ranos</button>' +
        '<button class="st-link" onclick="FMSettings.contact()"><i class="fa-solid fa-envelope" style="color:#22c55e;width:18px"></i> Cont\u00e1ctanos</button>' +
        '<button class="st-link" onclick="FMSettings.privacy()"><i class="fa-solid fa-shield-halved" style="color:#64748b;width:18px"></i> Pol\u00edtica de Privacidad</button>' +
      '</div>' +
      '<p style="text-align:center;color:#9aa0b8;font-size:11px;margin-top:14px">Fit Match Studio \u00b7 Hecho con \ud83d\udcaa</p>';
  }

  /* ---------- HANDLERS (expuestos) ---------- */
  function _tgl(id, el) {
    var cur = !!get(id);
    if (id === 'reminderOn') {
      toggleReminder(!cur).then(function (res) { if (el) el.classList.toggle('on', !!res); render(); });
      return;
    }
    if (id === 'health' && !cur) {
      set('health', false);
      toast('Pr\u00f3ximamente', 'Health Connect llegar\u00e1 en la versi\u00f3n para Android. \u00a1Ya casi!', 'fa-heart-pulse', '#f59e0b');
      return;
    }
    var nv = !cur; set(id, nv);
    if (el) el.classList.toggle('on', nv);
    if (id === 'alarmOn' && window.FMFX && window.FMFX.setMuted) { window.FMFX.setMuted(!nv); if (nv && window.FMFX.bell) window.FMFX.bell(); }
    if ((id === 'musicLobby' || id === 'spotifyStart') && nv && window.FMMusic) { window.FMMusic.toggle(true); }
  }
  function _theme(id) { setTheme(id); }
  function _lang(l) {
    if (l === 'en') { toast('Coming soon', 'El ingl\u00e9s llegar\u00e1 pronto. Por ahora, \u00a1en espa\u00f1ol! \ud83c\uddf2\ud83c\uddfd', 'fa-language', '#f59e0b'); return; }
    set('lang', l); render();
  }
  function _time(v) { set('reminderTime', v); startReminderChecker(); toast('Hora actualizada', 'Recordatorio a las ' + v, 'fa-clock', '#22c55e'); }
  function _vol(v) { var f = Math.max(0, Math.min(1, v / 100)); set('volume', f); if (window.FMFX && window.FMFX.setVolume) window.FMFX.setVolume(f); }
  function _volTest() { if (window.FMFX && window.FMFX.check) window.FMFX.check(); }

  function open() { ensureUI(); render(); document.getElementById('fm-settings-modal').style.display = 'block'; }
  function close() { var m = document.getElementById('fm-settings-modal'); if (m) m.style.display = 'none'; }

  window.FMSettings = {
    open: open, close: close, applyPrefs: applyPrefs, maybeAutoMusic: maybeAutoMusic,
    get: get, set: set,
    share: shareApp, rate: rateUs, contact: contactUs, privacy: openPrivacy,
    guide: openGuide,
    _tgl: _tgl, _theme: _theme, _lang: _lang, _time: _time, _vol: _vol, _volTest: _volTest
  };

  // Aplica preferencias apenas carga (volumen, mute, recordatorios).
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyPrefs);
  else applyPrefs();
})();
