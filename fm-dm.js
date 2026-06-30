/* ============================================================
 * fm-dm.js - Chat privado 1-a-1 en tiempo real (Fit Match)
 * ------------------------------------------------------------
 * Ventana flotante de chat entre dos usuarios. Usa Supabase
 * Realtime para entregar mensajes al instante.
 * Requiere la tabla direct_messages (ver sql-chat-privado.sql).
 * Expone window.FMDM.open(otherId, otherApodo).
 * ============================================================ */
(function () {
  'use strict';

  let supabase = null;
  let myId = null;
  let otherId = null;
  let otherApodo = '';
  let channel = null;

  function client() {
    if (!supabase && window.FMAuth && window.FMAuth.getClient) supabase = window.FMAuth.getClient();
    return supabase;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Crea la ventana flotante una sola vez
  function ensureUI() {
    if (document.getElementById('fm-dm-window')) return;
    const win = document.createElement('div');
    win.id = 'fm-dm-window';
    win.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:100080;width:340px;max-width:calc(100% - 32px);' +
      'height:460px;max-height:calc(100% - 32px);background:#0f1117;border:1px solid #2c3350;border-radius:18px;' +
      'box-shadow:0 18px 50px rgba(0,0,0,.55);display:none;flex-direction:column;overflow:hidden;font-family:\'Space Grotesk\',sans-serif;';
    win.innerHTML =
      '<div style="background:#181c2a;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #2c3350">' +
        '<div style="display:flex;align-items:center;gap:8px;min-width:0">' +
          '<span style="width:9px;height:9px;border-radius:50%;background:#34d399;flex-shrink:0"></span>' +
          '<span id="fm-dm-title" style="color:#eceefb;font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></span>' +
        '</div>' +
        '<button id="fm-dm-close" aria-label="Cerrar" style="background:none;border:none;color:#8b92b0;cursor:pointer;font-size:18px">\u00d7</button>' +
      '</div>' +
      '<div id="fm-dm-msgs" style="flex:1;min-height:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:6px;background:#0b0d13"></div>' +
      '<div style="padding:10px;border-top:1px solid #2c3350;display:flex;gap:8px;background:#0f1117">' +
        '<input id="fm-dm-input" type="text" placeholder="Escribe un mensaje..." maxlength="500" ' +
          'style="flex:1;background:#181c2a;border:1px solid #2c3350;border-radius:10px;padding:9px 12px;color:#eceefb;font-size:13px;outline:none">' +
        '<button id="fm-dm-send" style="background:#7c5cff;color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-weight:700">' +
          '<i class="fa-solid fa-paper-plane"></i></button>' +
      '</div>';
    document.body.appendChild(win);

    document.getElementById('fm-dm-close').onclick = close;
    document.getElementById('fm-dm-send').onclick = send;
    document.getElementById('fm-dm-input').addEventListener('keypress', e => { if (e.key === 'Enter') send(); });
  }

  function bubble(m) {
    const mine = m.sender_id === myId;
    const align = mine ? 'align-self:flex-end;background:#7c5cff;color:#fff' : 'align-self:flex-start;background:#222842;color:#eceefb';
    const hora = (() => { try { return new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } })();
    return '<div style="max-width:78%;' + align + ';padding:7px 11px;border-radius:14px;font-size:13px;line-height:1.35;word-break:break-word">' +
      esc(m.text) + '<div style="font-size:9px;opacity:.6;margin-top:2px;text-align:right">' + hora + '</div></div>';
  }

  function scrollBottom() {
    const box = document.getElementById('fm-dm-msgs');
    if (box) setTimeout(() => { box.scrollTop = box.scrollHeight; }, 50);
  }

  async function loadHistory() {
    const sb = client();
    const box = document.getElementById('fm-dm-msgs');
    if (!sb || !box) return;
    box.innerHTML = '<div style="color:#8b92b0;font-size:12px;text-align:center;margin:auto">Cargando...</div>';
    try {
      const { data, error } = await sb
        .from('direct_messages')
        .select('*')
        .or('and(sender_id.eq.' + myId + ',receiver_id.eq.' + otherId + '),and(sender_id.eq.' + otherId + ',receiver_id.eq.' + myId + ')')
        .order('id', { ascending: true })
        .limit(200);
      if (error) throw error;
      if (!data || !data.length) {
        box.innerHTML = '<div style="color:#8b92b0;font-size:12px;text-align:center;margin:auto">Aun no hay mensajes.<br>\u00a1Saluda a ' + esc(otherApodo) + '! \uD83D\uDC4B</div>';
      } else {
        box.innerHTML = data.map(bubble).join('');
        scrollBottom();
        markRead();
      }
    } catch (e) {
      box.innerHTML = '<div style="color:#ef4444;font-size:12px;text-align:center;margin:auto">Error al cargar el chat.</div>';
    }
  }

  async function markRead() {
    const sb = client();
    if (!sb) return;
    try {
      await sb.from('direct_messages').update({ read: true })
        .eq('receiver_id', myId).eq('sender_id', otherId).eq('read', false);
    } catch (e) { /* silencioso */ }
  }

  function appendMsg(m) {
    const box = document.getElementById('fm-dm-msgs');
    if (!box) return;
    // si tenia el cartel vacio, limpiarlo
    if (box.querySelector('div[style*="margin:auto"]')) box.innerHTML = '';
    box.insertAdjacentHTML('beforeend', bubble(m));
    scrollBottom();
  }

  async function send() {
    const input = document.getElementById('fm-dm-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    const sb = client();
    if (!sb || !myId || !otherId) return;
    input.value = '';
    const optimistic = { sender_id: myId, receiver_id: otherId, text: text, created_at: new Date().toISOString() };
    appendMsg(optimistic); // mostrar de inmediato
    try {
      const { error } = await sb.from('direct_messages').insert({ sender_id: myId, receiver_id: otherId, text: text });
      if (error) throw error;
    } catch (e) {
      appendMsg({ sender_id: myId, receiver_id: otherId, text: '(no se pudo enviar)', created_at: new Date().toISOString() });
    }
  }

  function subscribe() {
    const sb = client();
    if (!sb) return;
    if (channel) { try { sb.removeChannel(channel); } catch (e) {} }
    channel = sb.channel('fm-dm-' + myId)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'direct_messages', filter: 'receiver_id=eq.' + myId },
        (payload) => {
          const m = payload.new;
          if (!m) return;
          const isOpenWithSender = isOpen() && m.sender_id === otherId;
          if (isOpenWithSender) {
            appendMsg(m);
            markRead();
          } else {
            // notificar si el chat con esa persona no esta abierto
            if (window.FMNotify) {
              window.FMNotify.toast({ title: 'Mensaje nuevo', message: esc(m.text), icon: 'fa-comment-dots', color: '#7c5cff', duration: 8000 });
            }
          }
        })
      .subscribe();
  }

  function isOpen() {
    const w = document.getElementById('fm-dm-window');
    return w && w.style.display === 'flex';
  }

  function close() {
    const w = document.getElementById('fm-dm-window');
    if (w) w.style.display = 'none';
  }

  async function open(targetId, targetApodo) {
    const sb = client();
    if (!sb) { alert('No hay conexion para el chat.'); return; }
    if (!myId) {
      try { const { data } = await sb.auth.getUser(); myId = data && data.user ? data.user.id : null; } catch (e) {}
    }
    if (!myId) { alert('Inicia sesion para chatear.'); return; }
    if (targetId === myId) return; // no chatear contigo mismo
    otherId = targetId; otherApodo = targetApodo || 'Atleta';
    ensureUI();
    document.getElementById('fm-dm-title').textContent = otherApodo;
    document.getElementById('fm-dm-window').style.display = 'flex';
    document.getElementById('fm-dm-input').focus();
    if (!channel) subscribe();
    await loadHistory();
  }

  // Inicializa la suscripcion global apenas sepamos quien soy (para recibir avisos)
  async function init() {
    const sb = client();
    if (!sb) return;
    try { const { data } = await sb.auth.getUser(); myId = data && data.user ? data.user.id : null; } catch (e) {}
    if (myId) subscribe();
  }

  window.FMDM = { open, close, init };
})();
