/* ============================================================
 * fm-notify.js - Sistema de notificaciones de Fit Match
 * ------------------------------------------------------------
 *  - Toasts dentro de la app (siempre funcionan)
 *  - Notificaciones del navegador (con permiso)
 *  - Saludo diario motivacional (1 vez al dia)
 *  - Aviso en tiempo real al recibir una cita de entreno
 * Expone window.FMNotify.
 * ============================================================ */
(function () {
  'use strict';

  // --- Frases bonitas para cuidar el cuerpo ---
  const FRASES = [
    'Tu cuerpo es el \u00fanico lugar donde vivir\u00e1s toda tu vida. Cu\u00eddalo con cari\u00f1o. \uD83D\uDC9A',
    'Cada repetici\u00f3n de hoy es un regalo para tu yo del futuro.',
    'No tienes que ser el mejor, solo mejor que ayer.',
    'Hidr\u00e1tate, mu\u00e9vete y respira. Tu cuerpo te lo agradecer\u00e1.',
    'La disciplina pesa gramos; el arrepentimiento pesa toneladas.',
    'Comer bien no es un castigo, es un acto de amor propio.',
    'Un cuerpo fuerte construye una mente fuerte. \u00a1Hoy toca brillar!',
    'Peque\u00f1os h\u00e1bitos, grandes cambios. Sigue firme, campe\u00f3n.',
    'Descansar tambi\u00e9n es entrenar. Escucha a tu cuerpo.',
    'El mejor proyecto en el que trabajar\u00e1s eres t\u00fa mismo.'
  ];

  function saludoPorHora() {
    const h = new Date().getHours();
    if (h < 12) return { txt: 'Buenos d\u00edas', icon: 'fa-mug-hot', color: '#fbbf24' };
    if (h < 19) return { txt: 'Buenas tardes', icon: 'fa-sun', color: '#fb923c' };
    return { txt: 'Buenas noches', icon: 'fa-moon', color: '#a78bfa' };
  }
  function fraseDelDia() {
    // Determinista por dia (misma frase todo el dia, cambia cada dia)
    const dia = Math.floor(Date.now() / 86400000);
    return FRASES[dia % FRASES.length];
  }

  // --- Toast generico ---
  function toast(opts) {
    opts = (typeof opts === 'string') ? { message: opts } : (opts || {});
    const host = document.getElementById('fm-toasts');
    if (!host) { return; }
    // El contenedor NO debe bloquear clics (solo los toasts, que llevan pointer-events:auto).
    host.style.pointerEvents = 'none';
    const color = opts.color || '#34d399';
    const icon = opts.icon || 'fa-bell';
    const el = document.createElement('div');
    el.style.cssText = 'pointer-events:auto;background:#181c2a;border:1px solid ' + color + '66;border-left:4px solid ' + color +
      ';border-radius:14px;padding:12px 14px;color:#eceefb;box-shadow:0 10px 30px rgba(0,0,0,.45);' +
      'font-family:\'Space Grotesk\',sans-serif;opacity:0;transform:translateX(20px);transition:all .25s ease;';
    el.innerHTML =
      '<div style="display:flex;gap:10px;align-items:flex-start">' +
        '<i class="fa-solid ' + icon + '" style="color:' + color + ';font-size:18px;margin-top:2px"></i>' +
        '<div style="flex:1;min-width:0">' +
          (opts.title ? '<div style="font-weight:700;font-size:13px;margin-bottom:2px">' + opts.title + '</div>' : '') +
          '<div style="font-size:12px;color:#b2b9d4;line-height:1.4">' + (opts.message || '') + '</div>' +
        '</div>' +
        '<button aria-label="Cerrar" style="background:none;border:none;color:#6b7280;cursor:pointer;font-size:14px">\u00d7</button>' +
      '</div>';
    const close = () => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; setTimeout(() => el.remove(), 250); };
    el.querySelector('button').onclick = close;
    host.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; });
    const dur = opts.duration || 7000;
    if (dur > 0) setTimeout(close, dur);
    return el;
  }

  // --- Notificacion del navegador (con permiso) ---
  function requestPermission() {
    if (!('Notification' in window)) return Promise.resolve('unsupported');
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Promise.resolve(Notification.permission);
    }
    return Notification.requestPermission();
  }
  function browserNotify(title, body, tag) {
    try {
      if (('Notification' in window) && Notification.permission === 'granted') {
        new Notification(title, { body: body, tag: tag, icon: 'icon-192.png' });
        return true;
      }
    } catch (e) { /* ignorar */ }
    return false;
  }

  // --- Saludo diario (1 vez por dia por usuario) ---
  function dailyGreeting(apodo, userId) {
    const key = 'fm_greeted_' + (userId || 'guest') + '_' + new Date().toISOString().slice(0, 10);
    try { if (localStorage.getItem(key)) return false; } catch (e) {}
    const s = saludoPorHora();
    toast({
      title: s.txt + (apodo ? ', ' + apodo : '') + '!',
      message: fraseDelDia(),
      icon: s.icon,
      color: s.color,
      duration: 11000
    });
    try { localStorage.setItem(key, '1'); } catch (e) {}
    return true;
  }

  // --- Avisos de citas en tiempo real ---
  let apptChannel = null;
  function initAppointmentNotifications(supabase, user) {
    if (!supabase || !user) return;
    if (apptChannel) { try { supabase.removeChannel(apptChannel); } catch (e) {} }
    apptChannel = supabase
      .channel('fm-appt-notify-' + user.id)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments', filter: 'receiver_id=eq.' + user.id },
        (payload) => {
          const a = payload.new || {};
          let cuando = '';
          try { cuando = new Date(a.scheduled_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) {}
          const msg = (a.sender_apodo || 'Un atleta') + ' te invita a entrenar ' +
                      (a.routine_name ? '"' + a.routine_name + '"' : '') + (cuando ? ' el ' + cuando : '');
          toast({ title: '\u00a1Nueva cita de entreno!', message: msg, icon: 'fa-calendar-plus', color: '#a78bfa', duration: 10000 });
          browserNotify('Fit Match - Nueva cita', msg, 'appt-' + (a.id || ''));
          if (typeof window.checkInboxBadge === 'function') window.checkInboxBadge();
        })
      .subscribe();
    return apptChannel;
  }

  window.FMNotify = { toast, requestPermission, browserNotify, dailyGreeting, initAppointmentNotifications, FRASES };
})();
