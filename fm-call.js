/* ============================================================
 * fm-call.js - Videollamada / llamada de voz (Fit Match)
 * ------------------------------------------------------------
 * Llamadas 1-a-1 con camara y microfono usando WebRTC.
 * El video/audio va DIRECTO de un dispositivo al otro (P2P).
 * Supabase Realtime se usa SOLO para "presentar" a los dos
 * (intercambio de senales: oferta/respuesta/ICE).
 *
 * Limitacion honesta: sin servidor TURN, en redes con firewall
 * muy estricto la conexion directa puede fallar. En WiFi de casa
 * o datos moviles funciona la mayoria de las veces.
 *
 * Expone window.FMCall.init(supabase, myId, myApodo)
 *         window.FMCall.start(peerId, peerApodo)   // iniciar llamada
 * ============================================================ */
(function () {
  'use strict';

  const RTC_CONFIG = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  let supabase = null, myId = null, myApodo = '';
  let pc = null, localStream = null, remoteStream = null;
  let signalCh = null, ringCh = null;
  let roomId = null, peerId = null, peerApodo = '', isCaller = false;
  let ringingTimeout = null;

  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function roomFor(a, b){ return [a, b].sort().join('_'); }

  /* ---------- UI ---------- */
  function ensureUI() {
    if (document.getElementById('fm-call-overlay')) return;
    const o = document.createElement('div');
    o.id = 'fm-call-overlay';
    o.style.cssText = 'position:fixed;inset:0;z-index:100100;background:#05070d;display:none;flex-direction:column;font-family:\'Space Grotesk\',sans-serif';
    o.innerHTML =
      '<div id="fm-call-status" style="position:absolute;top:0;left:0;right:0;padding:14px;text-align:center;color:#eceefb;font-weight:700;z-index:2;background:linear-gradient(#05070dcc,transparent)"></div>' +
      '<video id="fm-remote-video" autoplay playsinline style="width:100%;height:100%;object-fit:cover;background:#0b0d13"></video>' +
      '<video id="fm-local-video" autoplay playsinline muted style="position:absolute;bottom:96px;right:16px;width:110px;height:150px;object-fit:cover;border-radius:14px;border:2px solid #7c5cff;background:#0b0d13;z-index:2"></video>' +
      '<div style="position:absolute;bottom:0;left:0;right:0;padding:22px;display:flex;justify-content:center;gap:18px;z-index:2;background:linear-gradient(transparent,#05070dcc)">' +
        '<button id="fm-call-mic" title="Microfono" style="width:56px;height:56px;border-radius:50%;border:none;background:#222842;color:#fff;font-size:20px;cursor:pointer"><i class="fa-solid fa-microphone"></i></button>' +
        '<button id="fm-call-hangup" title="Colgar" style="width:64px;height:64px;border-radius:50%;border:none;background:#ef4444;color:#fff;font-size:24px;cursor:pointer"><i class="fa-solid fa-phone-slash"></i></button>' +
        '<button id="fm-call-cam" title="Camara" style="width:56px;height:56px;border-radius:50%;border:none;background:#222842;color:#fff;font-size:20px;cursor:pointer"><i class="fa-solid fa-video"></i></button>' +
      '</div>';
    document.body.appendChild(o);

    // Modal de llamada entrante
    const inc = document.createElement('div');
    inc.id = 'fm-call-incoming';
    inc.style.cssText = 'position:fixed;inset:0;z-index:100110;background:#05070dee;display:none;align-items:center;justify-content:center;font-family:\'Space Grotesk\',sans-serif';
    inc.innerHTML =
      '<div style="text-align:center;color:#eceefb;max-width:320px;padding:24px">' +
        '<div style="width:90px;height:90px;border-radius:50%;background:#7c5cff;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:38px;animation:fmpulse 1.2s infinite"><i class="fa-solid fa-video"></i></div>' +
        '<div id="fm-inc-name" style="font-size:20px;font-weight:700;margin-bottom:4px"></div>' +
        '<div style="color:#8b92b0;margin-bottom:24px">te esta llamando...</div>' +
        '<div style="display:flex;gap:18px;justify-content:center">' +
          '<button id="fm-inc-reject" style="width:64px;height:64px;border-radius:50%;border:none;background:#ef4444;color:#fff;font-size:22px;cursor:pointer"><i class="fa-solid fa-phone-slash"></i></button>' +
          '<button id="fm-inc-accept" style="width:64px;height:64px;border-radius:50%;border:none;background:#22c55e;color:#fff;font-size:22px;cursor:pointer"><i class="fa-solid fa-phone"></i></button>' +
        '</div>' +
      '</div>' +
      '<style>@keyframes fmpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}</style>';
    document.body.appendChild(inc);

    document.getElementById('fm-call-hangup').onclick = hangup;
    document.getElementById('fm-call-mic').onclick = toggleMic;
    document.getElementById('fm-call-cam').onclick = toggleCam;
    document.getElementById('fm-inc-accept').onclick = acceptIncoming;
    document.getElementById('fm-inc-reject').onclick = rejectIncoming;
  }

  function setStatus(t){ const s = document.getElementById('fm-call-status'); if (s) s.textContent = t; }
  function showOverlay(show){ const o = document.getElementById('fm-call-overlay'); if (o) o.style.display = show ? 'flex' : 'none'; }

  /* ---------- Media + PeerConnection ---------- */
  async function getMedia() {
    if (localStream) return localStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (e) {
      alert('No se pudo acceder a la camara/microfono. Revisa los permisos del navegador.');
      throw e;
    }
    const lv = document.getElementById('fm-local-video');
    if (lv) lv.srcObject = localStream;
    return localStream;
  }

  function buildPC() {
    pc = new RTCPeerConnection(RTC_CONFIG);
    remoteStream = new MediaStream();
    const rv = document.getElementById('fm-remote-video');
    if (rv) rv.srcObject = remoteStream;

    localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

    pc.ontrack = (ev) => { ev.streams[0].getTracks().forEach(t => remoteStream.addTrack(t)); setStatus(''); };
    pc.onicecandidate = (ev) => { if (ev.candidate) sig('ice', { candidate: ev.candidate }); };
    pc.onconnectionstatechange = () => {
      if (pc && (pc.connectionState === 'failed' || pc.connectionState === 'disconnected')) {
        setStatus('Conexion perdida...');
      }
    };
  }

  // Enviar una senal por el canal de la sala
  function sig(event, payload) {
    if (!signalCh) return;
    signalCh.send({ type: 'broadcast', event: event, payload: Object.assign({ from: myId }, payload) });
  }

  function joinSignalRoom() {
    if (signalCh) { try { supabase.removeChannel(signalCh); } catch (e) {} }
    signalCh = supabase.channel('fm-rtc-' + roomId, { config: { broadcast: { self: false } } });
    signalCh.on('broadcast', { event: 'ready' }, async () => {
      // El que recibe 'ready' (el que llama) crea la oferta
      if (isCaller) {
        buildPC();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sig('offer', { sdp: offer });
      }
    });
    signalCh.on('broadcast', { event: 'offer' }, async (m) => {
      if (isCaller) return;
      buildPC();
      await pc.setRemoteDescription(new RTCSessionDescription(m.payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sig('answer', { sdp: answer });
    });
    signalCh.on('broadcast', { event: 'answer' }, async (m) => {
      if (!isCaller || !pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(m.payload.sdp));
    });
    signalCh.on('broadcast', { event: 'ice' }, async (m) => {
      if (!pc || !m.payload.candidate) return;
      try { await pc.addIceCandidate(new RTCIceCandidate(m.payload.candidate)); } catch (e) {}
    });
    signalCh.on('broadcast', { event: 'bye' }, () => { endCall(true); });
    signalCh.subscribe();
  }

  /* ---------- Iniciar / recibir ---------- */
  async function start(targetId, targetApodo) {
    if (!supabase || !myId) { alert('Inicia sesion para llamar.'); return; }
    if (targetId === myId) return;
    ensureUI();
    peerId = targetId; peerApodo = targetApodo || 'Atleta';
    roomId = roomFor(myId, peerId);
    isCaller = true;
    try { await getMedia(); } catch (e) { return; }
    showOverlay(true);
    setStatus('Llamando a ' + peerApodo + '...');
    joinSignalRoom();
    // Tocar el "timbre" en el canal personal del otro
    ring(targetId, { event: 'ring', fromId: myId, fromApodo: myApodo, roomId: roomId });
    // Si no contesta en 40s, cancelar
    clearTimeout(ringingTimeout);
    ringingTimeout = setTimeout(() => { if (pc === null) { setStatus('No contesto.'); setTimeout(() => endCall(false), 1500); } }, 40000);
  }

  function ring(targetId, payload) {
    const ch = supabase.channel('fm-ring-' + targetId, { config: { broadcast: { self: false } } });
    ch.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        ch.send({ type: 'broadcast', event: 'ring', payload: payload });
        setTimeout(() => { try { supabase.removeChannel(ch); } catch (e) {} }, 1500);
      }
    });
  }

  let pendingIncoming = null;
  function onIncomingRing(p) {
    if (!p || p.fromId === myId) return;
    if (showingCall()) return; // ya hay una llamada
    ensureUI();
    pendingIncoming = p;
    document.getElementById('fm-inc-name').textContent = p.fromApodo || 'Atleta';
    document.getElementById('fm-call-incoming').style.display = 'flex';
    if (window.FMNotify) window.FMNotify.toast({ title: 'Videollamada entrante', message: (p.fromApodo || 'Alguien') + ' te esta llamando', icon: 'fa-video', color: '#22c55e', duration: 9000 });
  }

  function showingCall(){ const o = document.getElementById('fm-call-overlay'); return o && o.style.display === 'flex'; }

  async function acceptIncoming() {
    if (!pendingIncoming) return;
    document.getElementById('fm-call-incoming').style.display = 'none';
    peerId = pendingIncoming.fromId; peerApodo = pendingIncoming.fromApodo || 'Atleta';
    roomId = pendingIncoming.roomId;
    isCaller = false;
    try { await getMedia(); } catch (e) { return; }
    showOverlay(true);
    setStatus('Conectando con ' + peerApodo + '...');
    joinSignalRoom();
    // Avisar al que llama que ya estoy listo (entonces el crea la oferta)
    setTimeout(() => sig('ready', {}), 400);
    pendingIncoming = null;
  }

  function rejectIncoming() {
    if (pendingIncoming) ring(pendingIncoming.fromId, { event: 'ring' }); // (opcional) podriamos enviar 'rejected'
    document.getElementById('fm-call-incoming').style.display = 'none';
    pendingIncoming = null;
  }

  /* ---------- Controles ---------- */
  function toggleMic() {
    if (!localStream) return;
    const a = localStream.getAudioTracks()[0]; if (!a) return;
    a.enabled = !a.enabled;
    document.getElementById('fm-call-mic').style.background = a.enabled ? '#222842' : '#ef4444';
  }
  function toggleCam() {
    if (!localStream) return;
    const v = localStream.getVideoTracks()[0]; if (!v) return;
    v.enabled = !v.enabled;
    document.getElementById('fm-call-cam').style.background = v.enabled ? '#222842' : '#ef4444';
  }

  function hangup() { sig('bye', {}); endCall(false); }

  function endCall(remote) {
    clearTimeout(ringingTimeout);
    if (pc) { try { pc.close(); } catch (e) {} pc = null; }
    if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; }
    if (signalCh) { try { supabase.removeChannel(signalCh); } catch (e) {} signalCh = null; }
    remoteStream = null; roomId = null; peerId = null; isCaller = false;
    const lv = document.getElementById('fm-local-video'); if (lv) lv.srcObject = null;
    const rv = document.getElementById('fm-remote-video'); if (rv) rv.srcObject = null;
    showOverlay(false);
    if (remote && window.FMNotify) window.FMNotify.toast({ title: 'Llamada finalizada', message: 'La otra persona colgo.', icon: 'fa-phone-slash', color: '#ef4444' });
  }

  /* ---------- Init ---------- */
  function init(sb, userId, apodo) {
    supabase = sb || (window.FMAuth && window.FMAuth.getClient ? window.FMAuth.getClient() : null);
    myId = userId; myApodo = apodo || 'Atleta';
    if (!supabase || !myId) return;
    if (ringCh) { try { supabase.removeChannel(ringCh); } catch (e) {} }
    ringCh = supabase.channel('fm-ring-' + myId, { config: { broadcast: { self: false } } });
    ringCh.on('broadcast', { event: 'ring' }, (m) => { if (m.payload && m.payload.fromId) onIncomingRing(m.payload); });
    ringCh.subscribe();
  }

  window.FMCall = { init, start };
})();
