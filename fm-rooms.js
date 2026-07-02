/* ============================================================
 * fm-rooms.js - Salas de Entrenamiento programadas (Fit Match)
 * ------------------------------------------------------------
 * Capa ENCIMA del motor de salas cooperativas de jugar.html.
 * - Crear sala: rutina + dia/hora -> genera codigo -> anuncia
 *   en el chat global -> aparece en la lista "Salas".
 * - Unirse: por la lista publica o con el codigo.
 * - Sala de espera con miembros + boton de videollamada grupal.
 * - El ANFITRION da la orden "\u00a1Empezar!" y a todos se les lanza
 *   la rutina cooperativa (window.createRoomCodeSession /
 *   window.joinRoomCodeSession) + videollamada (FMGroupCall).
 * Requiere: sql-salas.sql. Expone window.FMRooms.
 * ============================================================ */
(function () {
  'use strict';

  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let currentRoom = null;   // sala en la que estoy (creada o unida)
  let roomChannel = null;   // realtime de la sala actual
  let listChannel = null;   // realtime de la lista de salas
  let launched = false;     // ya arranco esta sala?

  function sb() { try { return window.FMAuth.getClient(); } catch (e) { return null; } }
  function me() { return window.cloudProfile || null; }
  function myId() { return (window.cloudUser && window.cloudUser.id) || (me() && me().id) || null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function genCode() { let c = ''; for (let i = 0; i < 4; i++) c += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length)); return c; }
  function allRoutines() { return [].concat(window.FMRoutines || [], window.FMSpecializedRoutines || []); }
  function fmtWhen(iso) {
    if (!iso) return 'Sin hora';
    try { return new Date(iso).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; }
  }
  // Aviso elegante (usa FMNotify si existe; nunca el alert blanco del navegador)
  function toast(message, title, color) {
    if (window.FMNotify && window.FMNotify.toast) {
      window.FMNotify.toast({ title: title || 'Salas', message: message, icon: 'fa-people-roof', color: color || '#7c5cff' });
    } else { alert(message); }
  }

  // ---------- OVERLAY ----------
  function ensureOverlay() {
    let ov = document.getElementById('fm-rooms-overlay');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = 'fm-rooms-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:100070;display:none;align-items:flex-start;justify-content:center;background:rgba(6,8,16,.94);backdrop-filter:blur(8px);overflow-y:auto;padding:18px;font-family:\'Space Grotesk\',sans-serif;color-scheme:dark';
    ov.innerHTML = '<div id="fm-rooms-card" style="background:linear-gradient(180deg,#1a1f31,#12151f);border:1px solid #2b3252;border-radius:22px;max-width:430px;width:100%;color:#e7eaf6;box-shadow:0 24px 70px rgba(0,0,0,.6);margin:14px 0;overflow:hidden"></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    return ov;
  }
  function card() { ensureOverlay(); return document.getElementById('fm-rooms-card'); }
  function header(title) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid #262c47;background:rgba(124,92,255,.06)">' +
      '<h3 style="font-weight:700;font-size:14px;margin:0;letter-spacing:.01em"><i class="fa-solid fa-people-roof" style="color:#8b7bff;margin-right:8px"></i>' + title + '</h3>' +
      '<button onclick="FMRooms.close()" style="background:#242a44;color:#aab2d5;border:none;border-radius:9px;width:30px;height:30px;cursor:pointer;font-size:13px;transition:.15s" onmouseover="this.style.background=&quot;#2f3760&quot;" onmouseout="this.style.background=&quot;#242a44&quot;">\u2715</button></div>';
  }
  const btnP = 'background:linear-gradient(150deg,#7c3aed,#22d3ee);color:#fff;border:none;border-radius:12px;padding:11px 15px;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px;letter-spacing:.01em;box-shadow:0 6px 16px rgba(124,58,237,.28)';
  const btnS = 'background:#242a44;color:#c2c9ea;border:1px solid #313961;border-radius:12px;padding:10px 14px;font-weight:600;cursor:pointer;font-family:inherit;font-size:12.5px';
  const inS = 'width:100%;background:#0e1119;border:1px solid #2b3252;border-radius:11px;padding:10px 12px;color:#e7eaf6;font-size:13px;font-family:inherit;box-sizing:border-box;color-scheme:dark;outline:none';

  function open() {
    if (!me()) { toast('Inicia sesi\u00f3n para crear o unirte a una sala.', 'Salas', '#f59e0b'); return; }
    ensureOverlay().style.display = 'flex';
    showList();
  }
  function close() {
    const ov = document.getElementById('fm-rooms-overlay');
    if (ov) ov.style.display = 'none';
    if (listChannel) { try { sb().removeChannel(listChannel); } catch (e) {} listChannel = null; }
  }

  // ---------- LISTA DE SALAS ----------
  async function showList() {
    const c = card();
    c.innerHTML = header('Salas de entrenamiento') +
      '<div style="padding:16px 18px">' +
        '<button onclick="FMRooms.showCreate()" style="' + btnP + ';width:100%;margin-bottom:14px"><i class="fa-solid fa-plus mr-1"></i> Crear una sala</button>' +
        '<button onclick="FMRooms.showJoinByCode()" style="' + btnS + ';width:100%;margin-bottom:16px"><i class="fa-solid fa-keyboard mr-1"></i> Unirme con un c\u00f3digo</button>' +
        '<p style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#8b92b0;font-weight:700;margin:0 0 8px">Salas abiertas</p>' +
        '<div id="fm-rooms-list"><p style="color:#8b92b0;font-size:13px">Cargando...</p></div>' +
      '</div>';
    await refreshList();
    // Realtime: refrescar la lista cuando alguien crea/actualiza una sala
    const s = sb();
    if (s && !listChannel) {
      listChannel = s.channel('fm-rooms-list')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'training_rooms' }, () => refreshList())
        .subscribe();
    }
  }

  async function refreshList() {
    const cont = document.getElementById('fm-rooms-list');
    if (!cont) return;
    const s = sb(); if (!s) return;
    const { data, error } = await s.from('training_rooms')
      .select('*').eq('status', 'abierta').order('scheduled_at', { ascending: true }).limit(30);
    if (error || !data || !data.length) {
      cont.innerHTML = '<p style="color:#8b92b0;font-size:13px;padding:8px 0">No hay salas abiertas. \u00a1S\u00e9 el primero en crear una!</p>';
      return;
    }
    cont.innerHTML = data.map(r => {
      const mine = r.host_id === myId();
      return '<div style="background:#0f1117;border:1px solid #2c3350;border-radius:14px;padding:12px;margin-bottom:10px">' +
        '<div style="display:flex;justify-content:space-between;align-items:start;gap:8px">' +
          '<div style="min-width:0">' +
            '<div style="font-weight:800;font-size:14px">' + esc(r.routine_name || 'Rutina') + '</div>' +
            '<div style="font-size:12px;color:#8b92b0"><i class="fa-solid fa-user mr-1"></i>' + esc(r.host_apodo || 'Atleta') +
              ' \u00b7 <i class="fa-regular fa-clock mr-1"></i>' + fmtWhen(r.scheduled_at) + '</div>' +
            '<div style="font-size:11px;color:#a5b4fc;margin-top:2px;font-weight:700;letter-spacing:.08em">C\u00d3DIGO ' + esc(r.code) + '</div>' +
          '</div>' +
          '<button onclick="FMRooms.enter(\'' + r.id + '\')" style="' + btnP + ';padding:9px 14px;font-size:13px;white-space:nowrap">' +
            (mine ? 'Abrir' : 'Unirme') + '</button>' +
        '</div></div>';
    }).join('');
  }

  // ---------- CREAR SALA ----------
  function showCreate() {
    const rs = allRoutines();
    const opts = rs.map(r => '<option value="' + r.id + '">' + esc(r.name) + ' (' + esc(r.level || '') + ')</option>').join('');
    // valor por defecto de fecha/hora: dentro de 1 hora
    const d = new Date(Date.now() + 60 * 60000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const defWhen = d.toISOString().slice(0, 16);
    const c = card();
    c.innerHTML = header('Crear sala') +
      '<div style="padding:16px 18px">' +
        '<label style="font-size:11px;text-transform:uppercase;color:#8b92b0;font-weight:700">Rutina</label>' +
        '<select id="fm-room-routine" style="' + inS + ';margin:4px 0 14px">' + opts + '</select>' +
        '<label style="font-size:11px;text-transform:uppercase;color:#8b92b0;font-weight:700">D\u00eda y hora</label>' +
        '<input id="fm-room-when" type="datetime-local" value="' + defWhen + '" style="' + inS + ';margin:4px 0 14px">' +
        '<p style="font-size:12px;color:#8b92b0;margin:0 0 14px"><i class="fa-solid fa-circle-info mr-1"></i>Se generar\u00e1 un c\u00f3digo y se anunciar\u00e1 en el chat. T\u00fa dar\u00e1s la orden de <b>Empezar</b>.</p>' +
        '<div style="display:flex;gap:10px">' +
          '<button onclick="FMRooms.showList()" style="' + btnS + '">Cancelar</button>' +
          '<button id="fm-room-create-btn" onclick="FMRooms.doCreate()" style="' + btnP + ';flex:1"><i class="fa-solid fa-check mr-1"></i>Crear sala</button>' +
        '</div>' +
        '<p id="fm-room-msg" style="color:#f43f5e;font-size:13px;margin-top:10px;min-height:16px"></p>' +
      '</div>';
  }

  async function doCreate() {
    const msg = document.getElementById('fm-room-msg');
    const rid = document.getElementById('fm-room-routine').value;
    const when = document.getElementById('fm-room-when').value;
    const routine = (window.findRoutineById && window.findRoutineById(rid)) || allRoutines().find(r => r.id === rid);
    if (!routine) { if (msg) msg.textContent = 'Elige una rutina v\u00e1lida.'; return; }
    const s = sb(); if (!s) return;
    const btn = document.getElementById('fm-room-create-btn'); if (btn) { btn.disabled = true; btn.style.opacity = '.6'; }
    try {
      const code = genCode();
      const cat = (window.FMSpecializedRoutines || []).some(r => r.id === rid) ? 'spec' : 'gods';
      const payload = {
        code: code, host_id: myId(), host_apodo: me().apodo,
        routine_id: rid, routine_name: routine.name, routine_category: cat,
        scheduled_at: when ? new Date(when).toISOString() : null,
        status: 'abierta', guild_id: me().guild_id || null
      };
      const { data, error } = await s.from('training_rooms').insert(payload).select().single();
      if (error) throw error;
      // Entrar como miembro (anfitrion)
      await s.from('training_room_members').insert({ room_id: data.id, user_id: myId(), apodo: me().apodo });
      // Anuncio en el chat global
      if (window.sendGeneralChatNotice) {
        window.sendGeneralChatNotice('\ud83c\udfcb\ufe0f Abr\u00ed una sala: ' + routine.name + ' \u00b7 ' + fmtWhen(payload.scheduled_at) + ' \u00b7 c\u00f3digo ' + code + '. \u00a1\u00danete desde "Salas"!');
      }
      enterRoom(data);
    } catch (e) {
      if (msg) msg.textContent = 'No se pudo crear: ' + (e.message || e) + '. \u00bfCorriste sql-salas.sql?';
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
  }

  // ---------- UNIRSE POR CODIGO (formulario elegante, sin prompt blanco) ----------
  function showJoinByCode() {
    const c = card();
    c.innerHTML = header('Unirme con c\u00f3digo') +
      '<div style="padding:18px">' +
        '<p style="font-size:12.5px;color:#9aa2c4;margin:0 0 14px;text-align:center">Escribe el c\u00f3digo de 4 letras que te compartieron.</p>' +
        '<input id="fm-join-code" maxlength="4" autocomplete="off" oninput="this.value=this.value.toUpperCase()" placeholder="K7QM" ' +
          'style="' + inS + ';text-align:center;font-size:30px;font-weight:800;letter-spacing:.25em;padding:14px">' +
        '<div style="display:flex;gap:10px;margin-top:16px">' +
          '<button onclick="FMRooms.showList()" style="' + btnS + '">Cancelar</button>' +
          '<button onclick="FMRooms.doJoinByCode()" style="' + btnP + ';flex:1"><i class="fa-solid fa-right-to-bracket mr-1"></i>Entrar</button>' +
        '</div>' +
        '<p id="fm-join-msg" style="color:#f43f5e;font-size:12.5px;margin-top:12px;min-height:16px;text-align:center"></p>' +
      '</div>';
    const inp = document.getElementById('fm-join-code'); if (inp) inp.focus();
  }

  async function doJoinByCode() {
    const msg = document.getElementById('fm-join-msg');
    const inp = document.getElementById('fm-join-code');
    let code = inp ? inp.value.trim().toUpperCase() : '';
    if (code.length !== 4) { if (msg) msg.textContent = 'El c\u00f3digo debe tener 4 letras.'; return; }
    const s = sb(); if (!s) return;
    const { data, error } = await s.from('training_rooms').select('*').eq('code', code).eq('status', 'abierta').order('created_at', { ascending: false }).limit(1);
    if (error || !data || !data.length) { if (msg) msg.textContent = 'No encontr\u00e9 una sala abierta con ese c\u00f3digo.'; return; }
    enter(data[0].id, data[0]);
  }

  // ---------- ENTRAR A UNA SALA (unirse + sala de espera) ----------
  async function enter(roomId, roomObj) {
    const s = sb(); if (!s) return;
    let room = roomObj;
    if (!room) {
      const { data } = await s.from('training_rooms').select('*').eq('id', roomId).single();
      room = data;
    }
    if (!room) { toast('Esa sala ya no existe.', 'Salas', '#f43f5e'); return; }
    if (room.status !== 'abierta' && room.host_id !== myId()) {
      // ya arranco: unirse directo al entrenamiento
      launchFor(room);
      return;
    }
    try { await s.from('training_room_members').insert({ room_id: room.id, user_id: myId(), apodo: me().apodo }); } catch (e) {}
    enterRoom(room);
  }

  function enterRoom(room) {
    currentRoom = room; launched = false;
    ensureOverlay().style.display = 'flex';
    renderRoom(room);
    subscribeRoom(room);
    // Boton flotante de videollamada disponible desde la sala de espera
    if (window.FMGroupCall) window.FMGroupCall.attach(room.code);
  }

  async function renderRoom(room) {
    const isHost = room.host_id === myId();
    const c = card();
    c.innerHTML = header('Sala: ' + esc(room.routine_name || 'Rutina')) +
      '<div style="padding:16px 18px">' +
        '<div style="text-align:center;background:#0f1117;border:1px dashed #3a4063;border-radius:14px;padding:14px;margin-bottom:14px">' +
          '<div style="font-size:11px;color:#8b92b0;text-transform:uppercase;letter-spacing:.1em">C\u00f3digo de la sala</div>' +
          '<div style="font-size:34px;font-weight:800;letter-spacing:.15em;color:#a5b4fc">' + esc(room.code) + '</div>' +
          '<div style="font-size:12px;color:#8b92b0"><i class="fa-regular fa-clock mr-1"></i>' + fmtWhen(room.scheduled_at) + '</div>' +
        '</div>' +
        '<button onclick="if(window.FMGroupCall)window.FMGroupCall.open(\'' + room.code + '\')" style="' + btnS + ';width:100%;margin-bottom:14px"><i class="fa-solid fa-video mr-1" style="color:#f97316"></i> Abrir videollamada grupal</button>' +
        '<p style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#8b92b0;font-weight:700;margin:0 0 6px">En la sala <span id="fm-room-count"></span></p>' +
        '<div id="fm-room-members" style="margin-bottom:16px"><p style="color:#8b92b0;font-size:13px">Cargando...</p></div>' +
        (isHost
          ? '<button id="fm-room-start" onclick="FMRooms.start()" style="' + btnP + ';width:100%"><i class="fa-solid fa-bolt mr-1"></i> \u00a1Empezar ahora!</button>'
          : '<div style="text-align:center;background:#1a1f33;border-radius:12px;padding:12px;color:#c7cded;font-weight:700"><i class="fa-solid fa-hourglass-half mr-1" style="color:#7c5cff"></i> Esperando a que <b>' + esc(room.host_apodo) + '</b> inicie...</div>') +
        '<button onclick="FMRooms.leave()" style="' + btnS + ';width:100%;margin-top:10px;background:none;color:#8b92b0"><i class="fa-solid fa-arrow-left mr-1"></i>Salir de la sala</button>' +
      '</div>';
    refreshMembers(room);
  }

  async function refreshMembers(room) {
    const cont = document.getElementById('fm-room-members'); if (!cont) return;
    const s = sb(); if (!s) return;
    const { data } = await s.from('training_room_members').select('apodo,user_id').eq('room_id', room.id);
    const list = data || [];
    const cnt = document.getElementById('fm-room-count'); if (cnt) cnt.textContent = '(' + list.length + ')';
    cont.innerHTML = list.map(m =>
      '<span style="display:inline-flex;align-items:center;gap:6px;background:#0f1117;border:1px solid #2c3350;border-radius:999px;padding:6px 12px;margin:0 6px 6px 0;font-size:13px">' +
        '<span style="width:8px;height:8px;border-radius:50%;background:#34d399"></span>' + esc(m.apodo || 'Atleta') +
        (m.user_id === room.host_id ? ' <span style="font-size:9px;color:#a5b4fc;text-transform:uppercase">anfitri\u00f3n</span>' : '') +
      '</span>'
    ).join('') || '<p style="color:#8b92b0;font-size:13px">Nadie a\u00fan.</p>';
  }

  function subscribeRoom(room) {
    const s = sb(); if (!s) return;
    if (roomChannel) { try { s.removeChannel(roomChannel); } catch (e) {} roomChannel = null; }
    roomChannel = s.channel('fm-room-' + room.id)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'training_rooms', filter: 'id=eq.' + room.id }, payload => {
        const updated = payload.new;
        currentRoom = updated;
        if (updated.status === 'en_curso') launchFor(updated);
        else if (updated.status === 'cerrada') { toast('El anfitri\u00f3n cerr\u00f3 la sala.', 'Salas', '#f43f5e'); leave(); }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'training_room_members', filter: 'room_id=eq.' + room.id }, () => refreshMembers(room))
      .subscribe();
  }

  // ---------- ARRANQUE ----------
  async function start() {
    if (!currentRoom) return;
    const s = sb(); if (!s) return;
    const btn = document.getElementById('fm-room-start'); if (btn) { btn.disabled = true; btn.style.opacity = '.6'; btn.innerHTML = 'Iniciando...'; }
    try {
      await s.from('training_rooms').update({ status: 'en_curso' }).eq('id', currentRoom.id);
      // El realtime nos devolvera el UPDATE y disparara launchFor; por si acaso, lanzamos ya.
      launchFor(Object.assign({}, currentRoom, { status: 'en_curso' }));
    } catch (e) {
      toast('No se pudo iniciar: ' + (e.message || e), 'Salas', '#f43f5e');
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
  }

  function launchFor(room) {
    if (launched) return;   // evitar doble arranque (realtime + local)
    launched = true;
    // Marcar que este entreno es de una SALA GRUPAL (bonus FitCoins + medalla)
    window.FM_CURRENT_ROOM = { code: room.code, id: room.id, name: room.routine_name };
    close();
    const c = document.getElementById('fm-rooms-overlay'); if (c) c.style.display = 'none';
    if (roomChannel) { try { sb().removeChannel(roomChannel); } catch (e) {} roomChannel = null; }
    const isHost = room.host_id === myId();
    setTimeout(() => {
      if (isHost) {
        if (window.createRoomCodeSession) window.createRoomCodeSession(room.routine_id, room.code, true);
      } else {
        if (window.joinRoomCodeSession) window.joinRoomCodeSession(room.code);
      }
      if (window.FMGroupCall) window.FMGroupCall.attach(room.code);
    }, 100);
  }

  async function leave() {
    const s = sb();
    if (s && currentRoom) {
      try { await s.from('training_room_members').delete().eq('room_id', currentRoom.id).eq('user_id', myId()); } catch (e) {}
      // Si soy el anfitrion y aun no arranca, cierro la sala
      if (currentRoom.host_id === myId() && !launched) {
        try { await s.from('training_rooms').update({ status: 'cerrada' }).eq('id', currentRoom.id); } catch (e) {}
      }
    }
    if (roomChannel) { try { s.removeChannel(roomChannel); } catch (e) {} roomChannel = null; }
    currentRoom = null;
    showList();
  }

  window.FMRooms = { open, close, showList, showCreate, doCreate, showJoinByCode, doJoinByCode, enter, start, leave };
})();
