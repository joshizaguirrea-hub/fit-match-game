/* ============================================================
 * fm-trainer.js - Entrenador Personal IA (adaptativo + chat por reglas)
 * ------------------------------------------------------------
 * NO usa una IA de pago: "aprende" leyendo los datos REALES del
 * usuario (entrenamientos completados, racha, nivel, puntos,
 * objetivos, equipo y ejercicios que suele cambiar) y responde
 * con consejos personalizados mediante un motor de reglas.
 * Expone window.FMTrainer.init(supabase, userId) y .toggle().
 * ============================================================ */
(function () {
  'use strict';

  let supabase = null, userId = null;
  let insights = null, loaded = false;

  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  const GOAL_LABELS = { bajar_grasa:'bajar grasa', musculo:'ganar musculo', salud:'salud general', movilidad:'movilidad', resistencia:'resistencia' };

  function profileGoals(p) {
    if (!p) return [];
    if (p.objetivos) return p.objetivos.split(',').map(s => s.trim()).filter(Boolean);
    return p.objetivo ? [p.objetivo] : [];
  }
  function goalsText(p) {
    const arr = profileGoals(p).map(g => GOAL_LABELS[g] || g);
    if (!arr.length) return 'tu forma fisica';
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];
  }
  function levelFromPoints(p, pts) {
    const exp = p && p.experiencia;
    if (exp === 'intermedio' || exp === 'avanzado') return exp;
    return pts < 50 ? 'basico' : pts < 200 ? 'intermedio' : pts < 500 ? 'avanzado' : 'espartano';
  }
  function getSwaps() {
    try { return JSON.parse(localStorage.getItem('fm_swaps') || '{}'); } catch (e) { return {}; }
  }

  // Reune y "aprende" de los datos del usuario
  async function analyze() {
    const p = (typeof window.cloudProfile !== 'undefined' && window.cloudProfile) ? window.cloudProfile : (window.currentProfile || null);
    let workouts = [];
    try {
      const { data } = await supabase.from('workouts').select('*').eq('user_id', userId);
      workouts = data || [];
    } catch (e) {}
    const totalPoints = workouts.reduce((s, w) => s + (w.puntos || 0), 0);
    const totalWorkouts = workouts.filter(w => (w.puntos || 0) > 0).length;
    const streak = window.calculateCurrentStreak ? window.calculateCurrentStreak(workouts) : 0;
    // dias desde el ultimo entreno
    let daysSinceLast = null;
    if (workouts.length) {
      const last = workouts.reduce((mx, w) => Math.max(mx, new Date(w.created_at).getTime()), 0);
      daysSinceLast = Math.floor((Date.now() - last) / 86400000);
    }
    // rutina favorita (mas repetida)
    const freq = {};
    workouts.forEach(w => { if (w.routine_id) freq[w.routine_id] = (freq[w.routine_id] || 0) + 1; });
    let favId = null, favN = 0;
    Object.keys(freq).forEach(k => { if (freq[k] > favN) { favN = freq[k]; favId = k; } });
    const favRoutine = favId && window.FMRoutines ? (window.FMRoutines.find(r => r.id === favId) || (window.FMSpecializedRoutines||[]).find(r => r.id === favId)) : null;
    // ejercicios que mas cambia
    const swaps = getSwaps();
    let topSwap = null, topSwapN = 0;
    Object.keys(swaps).forEach(k => { if (swaps[k] > topSwapN) { topSwapN = swaps[k]; topSwap = k; } });

    insights = {
      profile: p,
      apodo: (p && p.apodo) || 'Atleta',
      goals: profileGoals(p),
      goalsText: goalsText(p),
      equipo: p && p.equipo,
      level: levelFromPoints(p, totalPoints),
      totalPoints, totalWorkouts, streak, daysSinceLast,
      favRoutine, topSwap, topSwapN
    };
    loaded = true;
    return insights;
  }

  // Recomienda una rutina segun el perfil (usa smartRecommend de jugar.html si existe)
  function recommendRoutine() {
    if (typeof window.smartRecommend === 'function' && window.FMRoutines) {
      const list = window.smartRecommend(window.FMRoutines, true);
      return list && list[0] ? list[0] : null;
    }
    const lvl = insights ? insights.level : 'basico';
    const all = (window.FMRoutines || []);
    return all.find(r => r.level === lvl) || all[0] || null;
  }

  /* ---------- Motor de respuestas por reglas ---------- */
  function answer(text) {
    const t = (text || '').toLowerCase();
    const i = insights || {};
    const has = (...ks) => ks.some(k => t.includes(k));

    if (has('hola','buenas','hey','que tal')) {
      return '¡Hola ' + i.apodo + '! Soy tu entrenador. Llevas <b>' + i.totalWorkouts + '</b> entrenos y nivel <b>' + i.level + '</b>. ¿En que te ayudo? Puedes preguntarme que entrenar hoy, como vas, o pedirme que te motive.';
    }
    if (has('hoy','entreno','entrenar','que hago','rutina','recomi')) {
      const r = recommendRoutine();
      let msg = '';
      if (i.daysSinceLast === null) msg += '¡Hoy es perfecto para tu primer entreno! ';
      else if (i.daysSinceLast === 0) msg += '¡Ya entrenaste hoy, crack! Si quieres mas, ';
      else if (i.daysSinceLast >= 3) msg += 'Llevas <b>' + i.daysSinceLast + ' dias</b> sin entrenar, retomemos suave. ';
      if (r) msg += 'Para trabajar <b>' + i.goalsText + '</b> a tu nivel <b>' + i.level + '</b>, te recomiendo: <b>' + esc(r.name) + '</b> (' + r.exercises.length + ' ejercicios, +' + r.points + ' PX). La encuentras en "Tu plan de esta semana".';
      else msg += 'Abre la seccion de rutinas y elige una de "Tu plan de esta semana".';
      return msg;
    }
    if (has('como voy','progreso','estadis','avance','resumen','mis datos')) {
      let msg = 'Tu reporte, ' + i.apodo + ':<br>• Entrenos: <b>' + i.totalWorkouts + '</b><br>• Puntos: <b>' + i.totalPoints + ' PX</b><br>• Nivel: <b>' + i.level + '</b><br>• Racha: <b>' + i.streak + ' dia(s)</b>';
      if (i.favRoutine) msg += '<br>• Tu favorita: <b>' + esc(i.favRoutine.name) + '</b>';
      if (i.daysSinceLast !== null) msg += '<br>• Ultimo entreno: hace <b>' + i.daysSinceLast + ' dia(s)</b>';
      return msg;
    }
    if (has('motiv','animo','flojera','pereza','cansad','no quiero','desanim')) {
      if (i.streak >= 2) return '¡Llevas una racha de <b>' + i.streak + ' dias</b>, ' + i.apodo + '! No la rompas hoy. Un solo entreno corto mantiene viva la llama. ¡Tu yo del futuro te lo agradecera!';
      if (i.daysSinceLast !== null && i.daysSinceLast >= 3) return 'Todos caemos, lo que importa es volver. Hoy solo haz UNA rutina cortita, sin presion. El primer paso es el mas valioso. ¡Vamos ' + i.apodo + '!';
      return 'Recuerda por que empezaste: <b>' + i.goalsText + '</b>. No tienes que ser perfecto, solo constante. 10 minutos hoy valen mas que la rutina perfecta manana. ¡A darle!';
    }
    if (has('nivel','subir','avanzar','dificil','mas reto','siguiente nivel')) {
      const next = { basico:'intermedio', intermedio:'avanzado', avanzado:'espartano', espartano:'espartano' }[i.level];
      if (i.level === 'espartano') return '¡Ya eres ESPARTANO, ' + i.apodo + '! El nivel maximo. Ahora reta tus marcas: mas rondas o menos descanso.';
      const faltan = { basico:50, intermedio:200, avanzado:500 }[i.level] - i.totalPoints;
      return 'Vas en <b>' + i.level + '</b>. Cuando acumules mas puntos pasaras a <b>' + next + '</b>' + (faltan > 0 ? ' (te faltan ~<b>' + faltan + ' PX</b>)' : '') + '. Mete 2-3 rutinas de tu nivel esta semana y subiras pronto.';
    }
    if (has('nutri','comer','dieta','caloria','comida','aliment','proteina')) {
      return 'La nutricion es el 70% del resultado. Revisa tu <b>Perfil Nutricional</b> (calorias y macros segun tu meta de ' + i.goalsText + ') y tu <b>plan semanal de comidas</b>. Tip: prioriza proteina y agua.';
    }
    if (has('descans','dolor','lesion','duele','recuper')) {
      return 'Si algo DUELE (no solo molestia), para y descansa. El musculo crece descansando. Duerme bien e hidrata. Si el dolor sigue, consulta a un profesional. Mejor un dia de descanso que una lesion.';
    }
    if (has('objetivo','meta','para que')) {
      return 'Tus objetivos registrados son: <b>' + i.goalsText + '</b>. Toda tu recomendacion de rutinas esta calibrada para eso. ¿Quieres cambiarlos? Puedes reconfigurar tu perfil.';
    }
    if (i.topSwap && has('cambio','cambiar','ejercicio','no puedo hacer','no me gusta')) {
      return 'Note que sueles cambiar "<b>' + esc(i.topSwap) + '</b>". Esta perfecto adaptarlo a lo que tu cuerpo puede. Usa el boton naranja de cambiar ejercicio cuando lo necesites.';
    }
    // fallback
    let fb = 'Puedo ayudarte con: <b>que entrenar hoy</b>, <b>como vas</b>, <b>motivacion</b>, <b>subir de nivel</b> o <b>nutricion</b>. Toca un boton de abajo o escribeme. ';
    if (i.topSwap && i.topSwapN >= 2) fb += '(Por cierto, note que sueles cambiar "' + esc(i.topSwap) + '" )';
    return fb;
  }

  /* ---------- UI ---------- */
  function ensureUI() {
    if (document.getElementById('fm-trainer-fab')) return;
    const fab = document.createElement('button');
    fab.id = 'fm-trainer-fab';
    fab.title = 'Entrenador IA';
    fab.style.cssText = 'position:fixed;left:14px;bottom:64px;z-index:100070;background:linear-gradient(135deg,#7c5cff,#0ea5a4);color:#fff;border:none;border-radius:999px;padding:11px 16px;font-family:\'Space Grotesk\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.45);display:inline-flex;align-items:center;gap:8px';
    fab.innerHTML = '<i class="fa-solid fa-dumbbell"></i> Entrenador IA';
    fab.onclick = toggle;
    document.body.appendChild(fab);

    const win = document.createElement('div');
    win.id = 'fm-trainer-window';
    win.style.cssText = 'position:fixed;left:14px;bottom:64px;z-index:100075;width:340px;max-width:calc(100% - 28px);height:480px;max-height:calc(100% - 90px);background:#0f1117;border:1px solid #2c3350;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.55);display:none;flex-direction:column;overflow:hidden;font-family:\'Space Grotesk\',sans-serif';
    win.innerHTML =
      '<div style="background:linear-gradient(135deg,#7c5cff,#0ea5a4);padding:12px 14px;display:flex;align-items:center;justify-content:space-between">' +
        '<div style="display:flex;align-items:center;gap:9px"><div style="width:34px;height:34px;border-radius:50%;background:#ffffff22;display:flex;align-items:center;justify-content:center;color:#fff"><i class="fa-solid fa-dumbbell"></i></div>' +
        '<div><div style="color:#fff;font-weight:700;font-size:14px">Entrenador IA</div><div style="color:#ffffffcc;font-size:10px">Tu coach personal adaptativo</div></div></div>' +
        '<button id="fm-trainer-close" style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px">×</button>' +
      '</div>' +
      '<div id="fm-trainer-msgs" style="flex:1;min-height:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#0b0d13"></div>' +
      '<div id="fm-trainer-quick" style="display:flex;gap:6px;flex-wrap:wrap;padding:8px 10px;border-top:1px solid #2c3350;background:#0f1117"></div>' +
      '<div style="padding:10px;border-top:1px solid #2c3350;display:flex;gap:8px;background:#0f1117">' +
        '<input id="fm-trainer-input" type="text" placeholder="Preguntale a tu coach..." maxlength="200" style="flex:1;background:#181c2a;border:1px solid #2c3350;border-radius:10px;padding:9px 12px;color:#eceefb;font-size:13px;outline:none">' +
        '<button id="fm-trainer-send" style="background:#7c5cff;color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-weight:700"><i class="fa-solid fa-paper-plane"></i></button>' +
      '</div>';
    document.body.appendChild(win);

    document.getElementById('fm-trainer-close').onclick = () => toggle(false);
    document.getElementById('fm-trainer-send').onclick = sendUser;
    document.getElementById('fm-trainer-input').addEventListener('keypress', e => { if (e.key === 'Enter') sendUser(); });

    const quick = [
      { t: '¿Que entreno hoy?', q: 'que entreno hoy' },
      { t: '¿Como voy?', q: 'como voy' },
      { t: 'Motivame', q: 'motivame' },
      { t: 'Subir de nivel', q: 'subir de nivel' },
      { t: 'Nutricion', q: 'nutricion' }
    ];
    document.getElementById('fm-trainer-quick').innerHTML = quick.map(b =>
      '<button onclick="FMTrainer.ask(\'' + b.q + '\')" style="background:#181c2a;border:1px solid #2c3350;color:#a9b0cf;border-radius:999px;padding:5px 10px;font-size:11px;cursor:pointer">' + b.t + '</button>'
    ).join('');
  }

  function bubble(html, mine) {
    const align = mine ? 'align-self:flex-end;background:#7c5cff;color:#fff' : 'align-self:flex-start;background:#1a1f30;color:#e6e9f5';
    return '<div style="max-width:85%;' + align + ';padding:9px 12px;border-radius:14px;font-size:13px;line-height:1.45">' + html + '</div>';
  }
  function push(html, mine) {
    const box = document.getElementById('fm-trainer-msgs');
    if (!box) return;
    box.insertAdjacentHTML('beforeend', bubble(html, mine));
    setTimeout(() => { box.scrollTop = box.scrollHeight; }, 30);
  }

  async function ensureLoaded() {
    if (!loaded) { push('Analizando tus datos... <i class="fa-solid fa-circle-notch fa-spin"></i>', false); await analyze(); 
      const box = document.getElementById('fm-trainer-msgs'); if (box && box.lastChild) box.removeChild(box.lastChild);
    }
  }

  async function ask(q) {
    await ensureLoaded();
    push(esc(q), true);
    push(answer(q), false);
  }
  async function sendUser() {
    const input = document.getElementById('fm-trainer-input');
    const v = (input.value || '').trim();
    if (!v) return;
    input.value = '';
    await ask(v);
  }

  async function toggle(force) {
    ensureUI();
    const win = document.getElementById('fm-trainer-window');
    const fab = document.getElementById('fm-trainer-fab');
    const show = (typeof force === 'boolean') ? force : (win.style.display === 'none');
    win.style.display = show ? 'flex' : 'none';
    if (fab) fab.style.display = show ? 'none' : 'inline-flex';
    if (show) {
      const box = document.getElementById('fm-trainer-msgs');
      if (box && !box.childElementCount) {
        await ensureLoaded();
        const i = insights || {};
        push('¡Hola <b>' + i.apodo + '</b>! Soy tu entrenador personal. Vas en nivel <b>' + i.level + '</b> con <b>' + i.totalWorkouts + '</b> entrenos' + (i.streak ? ' y racha de <b>' + i.streak + '</b> dias' : '') + '. Preguntame lo que quieras o toca un boton.', false);
      }
    }
  }

  function init(sb, uid) {
    supabase = sb || (window.FMAuth && window.FMAuth.getClient ? window.FMAuth.getClient() : null);
    userId = uid;
    if (!supabase || !userId) return;
    loaded = false;
    ensureUI();
  }

  window.FMTrainer = { init, toggle, ask };
})();
