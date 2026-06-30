/* ============================================================
 * fm-monthly.js - Plan del Mes + Seguimiento Pro (Fit Match)
 * ------------------------------------------------------------
 * "Ver plan": arma un plan mensual (rutinas dia a dia segun tus
 * dias/semana, objetivos, nivel y equipo) + tus metas de nutricion,
 * y mide tu avance del dia 1 al fin de mes con un resumen pro.
 * Todo con datos reales (tabla workouts) y reglas, sin IA de pago.
 * Expone window.FMMonthly.init(supabase, userId) y .open().
 * ============================================================ */
(function () {
  'use strict';

  let supabase = null, userId = null;
  let curProfile = null, mealOffset = 0, curCalGoal = null;
  const MES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  // Patron de dias de entreno por semana (Lunes=1 ... Domingo=0)
  const PATTERNS = { 1:[1], 2:[1,4], 3:[1,3,5], 4:[1,2,4,5], 5:[1,2,3,4,5], 6:[1,2,3,4,5,6], 7:[0,1,2,3,4,5,6] };

  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function dkey(d){ return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }
  function allRoutines(){ return [...(window.FMRoutines||[]), ...(window.FMSpecializedRoutines||[])]; }
  function byId(id){ return allRoutines().find(r => r.id === id) || null; }

  function profile(){ return (window.cloudProfile) || (window.currentProfile) || null; }
  function levelOf(p, pts){
    const exp = p && p.experiencia;
    if (exp === 'intermedio' || exp === 'avanzado') return exp;
    return pts < 50 ? 'basico' : pts < 200 ? 'intermedio' : pts < 500 ? 'avanzado' : 'espartano';
  }

  // Pool de rutinas para el plan, segun equipo
  function planPoolRaw(p) {
    const spec = window.FMSpecializedRoutines || [];
    const grab = ids => ids.map(byId).filter(Boolean);
    if (p && p.equipo === 'gimnasio') {
      const g = grab(['gym_pecho_biceps','gym_espalda_triceps','gym_pierna_gluteo','gym_hombro_core']);
      if (g.length) return g;
    }
    if (p && (p.equipo === 'casa_sin' || p.equipo === 'casa')) {
      const c = grab(['casa_pecho_brazos','casa_espalda_biceps','casa_pierna_gluteo','casa_tren_superior','casa_core']);
      if (c.length) return c;
    }
    if (typeof window.smartRecommend === 'function') {
      const s = window.smartRecommend(allRoutines(), false);
      if (s && s.length) return s.slice(0, 6);
    }
    return allRoutines().slice(0, 5);
  }
  // Aplica filtro de seguridad por perfil de salud (PAR-Q)
  function planPool(p) {
    const pool = planPoolRaw(p);
    return (window.FMSafety) ? window.FMSafety.filterSafe(pool, p) : pool;
  }

  async function getWorkouts() {
    try { const { data } = await supabase.from('workouts').select('*').eq('user_id', userId); return data || []; }
    catch (e) { return []; }
  }

  function ensureUI() {
    if (document.getElementById('fm-monthly-modal')) return;
    const m = document.createElement('div');
    m.id = 'fm-monthly-modal';
    m.style.cssText = 'position:fixed;inset:0;z-index:100090;background:rgba(5,7,13,.92);display:none;overflow-y:auto;font-family:\'Space Grotesk\',sans-serif;padding:18px';
    m.onclick = (e) => { if (e.target === m) close(); };
    m.innerHTML = '<div id="fm-monthly-inner" style="max-width:880px;margin:0 auto"></div>';
    document.body.appendChild(m);
  }
  function close(){ const m = document.getElementById('fm-monthly-modal'); if (m) m.style.display = 'none'; }

  async function open() {
    ensureUI();
    const inner = document.getElementById('fm-monthly-inner');
    inner.innerHTML = '<p style="color:#cbd2ee;text-align:center;padding:60px">Armando tu plan del mes... <i class="fa-solid fa-circle-notch fa-spin"></i></p>';
    document.getElementById('fm-monthly-modal').style.display = 'block';

    const p = profile();
    const workouts = await getWorkouts();
    const now = new Date();
    const y = now.getFullYear(), mo = now.getMonth();
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    const todayN = now.getDate();

    // workouts de ESTE mes
    const monthW = workouts.filter(w => { const d = new Date(w.created_at); return d.getFullYear() === y && d.getMonth() === mo; });
    const doneDays = new Set(monthW.filter(w => (w.puntos||0) > 0).map(w => dkey(new Date(w.created_at))));
    const pointsMonth = monthW.reduce((s, w) => s + (w.puntos || 0), 0);
    const totalPoints = workouts.reduce((s, w) => s + (w.puntos || 0), 0);
    const streak = window.calculateCurrentStreak ? window.calculateCurrentStreak(workouts) : 0;
    const level = levelOf(p, totalPoints);

    const diasSem = (p && +p.dias_semana) || 3;
    const pattern = PATTERNS[diasSem] || PATTERNS[3];
    const pool = planPool(p);

    // Construir calendario + contar planeados/hechos hasta hoy
    let trainIdx = 0, plannedSoFar = 0, plannedTotal = 0;
    const cells = [];
    // relleno inicial (alinear a Lunes)
    const firstDow = new Date(y, mo, 1).getDay(); // 0=Dom
    const lead = (firstDow === 0) ? 6 : firstDow - 1; // huecos antes del dia 1 (semana inicia Lunes)
    for (let i = 0; i < lead; i++) cells.push({ empty: true });

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(y, mo, day);
      const dow = date.getDay();
      const isTraining = pattern.includes(dow);
      let routine = null;
      if (isTraining) { routine = pool[trainIdx % pool.length]; trainIdx++; plannedTotal++; if (day <= todayN) plannedSoFar++; }
      const k = dkey(date);
      cells.push({
        day, isTraining, routine,
        isToday: day === todayN,
        isPast: day < todayN,
        done: doneDays.has(k)
      });
    }

    const doneCount = doneDays.size;
    const adherence = plannedSoFar > 0 ? Math.round((doneCount / plannedSoFar) * 100) : 0;
    const daysLeft = daysInMonth - todayN;

    // Nutricion
    let nut = null;
    if (window.FMNutrition && p) { try { nut = window.FMNutrition.macros(p); } catch (e) {} }
    curProfile = p; mealOffset = 0; curCalGoal = nut ? nut.calories : null;

    // Resumen / evaluacion
    let veredicto, vcolor;
    if (adherence >= 90) { veredicto = '¡Mes de elite! Constancia de campeon.'; vcolor = '#34d399'; }
    else if (adherence >= 60) { veredicto = 'Vas muy bien, mantengamos el ritmo.'; vcolor = '#22d3ee'; }
    else if (adherence >= 30) { veredicto = 'Vas avanzando, aprieta un poco mas.'; vcolor = '#fbbf24'; }
    else { veredicto = 'Aun estas a tiempo de remontar el mes. ¡Vamos!'; vcolor = '#f87171'; }

    const apodo = (p && p.apodo) || 'Atleta';
    const goalTxt = (typeof window.objetivoLabel === 'function' && window.objetivoLabel()) || 'tu forma fisica';

    inner.innerHTML =
      header(apodo, MES[mo], y, level, goalTxt) +
      progressCards(doneCount, plannedSoFar, plannedTotal, adherence, pointsMonth, streak, daysLeft) +
      (nut ? nutritionCard(nut) : '') +      calendar(cells) +
      summaryCard(veredicto, vcolor, doneCount, plannedTotal, pointsMonth, streak) +
      safetyNote(p);
  }

  function header(apodo, mes, y, level, goal) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px">' +
      '<div><h2 style="font-family:Fredoka,sans-serif;color:#fff;font-size:24px;font-weight:800;margin:0">Plan de ' + mes + ' ' + y + '</h2>' +
      '<p style="color:#9aa3c7;font-size:12px;margin:2px 0 0">Hola ' + esc(apodo) + ', nivel <b style="color:#cbd2ee">' + level + '</b> · meta: <b style="color:#cbd2ee">' + esc(goal) + '</b></p></div>' +
      '<button onclick="FMMonthly.close()" style="background:#222842;border:none;color:#fff;width:38px;height:38px;border-radius:50%;cursor:pointer;font-size:18px;flex-shrink:0">×</button></div>';
  }
  function card(label, value, sub, color) {
    return '<div style="background:#11131c;border:1px solid #2c3350;border-radius:14px;padding:12px;text-align:center">' +
      '<div style="font-size:22px;font-weight:800;color:' + (color||'#fff') + '">' + value + '</div>' +
      '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#8b92b0;margin-top:2px">' + label + '</div>' +
      (sub ? '<div style="font-size:10px;color:#6b7290;margin-top:1px">' + sub + '</div>' : '') + '</div>';
  }
  function progressCards(done, planned, plannedTotal, adh, pts, streak, left) {
    return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;margin-bottom:14px">' +
      card('Entrenos', done + '/' + planned, 'plan: ' + plannedTotal + ' al mes', '#7c5cff') +
      card('Adherencia', adh + '%', 'del mes hasta hoy', adh >= 60 ? '#34d399' : '#fbbf24') +
      card('Puntos del mes', pts, 'PX ganados', '#fbbf24') +
      card('Racha', streak + 'd', 'dias seguidos', '#22d3ee') +
      card('Dias restantes', left, 'para cerrar el mes', '#cbd2ee') + '</div>';
  }
  function nutritionCard(n) {
    return '<div style="background:#11131c;border:1px solid #2c3350;border-radius:14px;padding:14px;margin-bottom:14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">' +
      '<div style="color:#fff;font-weight:700;font-size:14px"><i class="fa-solid fa-apple-whole" style="color:#34d399"></i> Tu meta diaria de nutricion</div></div>' +
      '<div style="display:flex;gap:16px;margin-top:8px;flex-wrap:wrap;color:#cbd2ee;font-size:13px">' +
      '<span><b style="color:#fff;font-size:16px">' + n.calories + '</b> kcal</span>' +
      '<span>Prot <b style="color:#fff">' + n.protein_g + 'g</b></span>' +
      '<span>Carb <b style="color:#fff">' + n.carbs_g + 'g</b></span>' +
      '<span>Grasa <b style="color:#fff">' + n.fat_g + 'g</b></span></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:14px;margin-bottom:8px">' +
        '<div style="color:#fff;font-weight:700;font-size:13px"><i class="fa-solid fa-utensils" style="color:#fbbf24"></i> Tu menu de hoy</div>' +
        '<button onclick="FMMonthly.reroll()" style="background:#222842;border:none;color:#a9b0cf;border-radius:999px;padding:6px 12px;font-size:11px;cursor:pointer"><i class="fa-solid fa-shuffle"></i> Generar otras recetas</button>' +
      '</div>' +
      '<div id="fm-month-menu">' + buildMenu(curProfile, 0) + '</div></div>';
  }

  const MEAL_DEFS = [
    { key:'desayuno', label:'Desayuno', icon:'fa-mug-hot', color:'#fbbf24' },
    { key:'comida',   label:'Comida',   icon:'fa-bowl-food', color:'#34d399' },
    { key:'cena',     label:'Cena',     icon:'fa-drumstick-bite', color:'#22d3ee' },
    { key:'snack',    label:'Snack',    icon:'fa-cookie-bite', color:'#a855f7' }
  ];
  function pickMeal(p, mealKey, offset) {
    if (!window.FMRecipes || !p) return null;
    const list = (window.FMRecipes.match(p) || []).filter(r => r.meal === mealKey);
    if (!list.length) return null;
    return list[offset % list.length];
  }
  function recipeRow(def, r) {
    if (!r) return '';
    const ing = (r.ingredients || []).slice(0, 6).map(esc).join(', ');
    const steps = (r.steps || []).map((s, i) => (i+1) + '. ' + esc(s)).join('<br>');
    return '<details style="background:#181c2a;border:1px solid #2c3350;border-radius:10px;padding:9px 11px;margin-bottom:7px">' +
      '<summary style="cursor:pointer;list-style:none;display:flex;align-items:center;gap:9px">' +
        '<span style="width:26px;height:26px;border-radius:50%;background:' + def.color + '22;color:' + def.color + ';display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-solid ' + def.icon + '"></i></span>' +
        '<span style="flex:1;min-width:0"><span style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#8b92b0;display:block">' + def.label + '</span>' +
        '<span style="color:#fff;font-weight:600;font-size:13px">' + esc(r.name) + '</span></span>' +
        '<span style="color:#cbd2ee;font-size:12px;white-space:nowrap">' + r.kcal + ' kcal</span>' +
      '</summary>' +
      '<div style="margin-top:8px;color:#aab2d0;font-size:12px;line-height:1.5">' +
        '<b style="color:#cbd2ee">Ingredientes:</b> ' + ing + '.' +
        (steps ? '<br><b style="color:#cbd2ee">Preparacion:</b><br>' + steps : '') +
        '<div style="margin-top:4px;opacity:.8">Prot ' + r.protein_g + 'g &middot; Carb ' + r.carbs_g + 'g &middot; Gra ' + r.fat_g + 'g</div>' +
      '</div></details>';
  }
  function buildMenu(p, offset) {
    if (!window.FMRecipes || !p) {
      return '<p style="color:#8b92b0;font-size:12px">Completa tu <b>Perfil Nutricional</b> (dieta, alergias, comidas al dia) para generar recetas a tu medida.</p>';
    }
    let total = 0, rows = '';
    MEAL_DEFS.forEach(def => {
      const r = pickMeal(p, def.key, offset);
      if (r) { total += r.kcal; rows += recipeRow(def, r); }
    });
    if (!rows) return '<p style="color:#8b92b0;font-size:12px">Aun no tengo recetas que encajen con tu perfil. Ajusta tu Perfil Nutricional y vuelve a intentar.</p>';
    const goalNote = curCalGoal ? ' de tu meta de ~' + curCalGoal + ' kcal' : '';
    rows += '<p style="color:#8b92b0;font-size:11px;margin:4px 0 0">Este menu suma ~<b style="color:#cbd2ee">' + total + ' kcal</b>' + goalNote + '. Toca cada comida para ver ingredientes y preparacion.</p>';
    return rows;
  }
  function reroll() {
    mealOffset++;
    const box = document.getElementById('fm-month-menu');
    if (box) box.innerHTML = buildMenu(curProfile, mealOffset);
  }
  function calendar(cells) {
    const dows = ['L','M','M','J','V','S','D'];
    let h = '<div style="background:#11131c;border:1px solid #2c3350;border-radius:14px;padding:14px;margin-bottom:14px">' +
      '<div style="color:#fff;font-weight:700;font-size:14px;margin-bottom:10px"><i class="fa-solid fa-calendar-week" style="color:#7c5cff"></i> Tu calendario del mes</div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">';
    dows.forEach(d => h += '<div style="text-align:center;font-size:10px;color:#6b7290;font-weight:700">' + d + '</div>');
    cells.forEach(c => {
      if (c.empty) { h += '<div></div>'; return; }
      let bg = '#181c2a', border = '1px solid #2c3350', icon = '', click = '', ring = c.isToday ? 'box-shadow:0 0 0 2px #7c5cff;' : '';
      if (c.isTraining) {
        if (c.done) { bg = '#14352a'; border = '1px solid #34d399'; icon = '<i class="fa-solid fa-check" style="color:#34d399"></i>'; }
        else if (c.isPast) { bg = '#321a1a'; border = '1px solid #6b2b2b'; icon = '<i class="fa-solid fa-xmark" style="color:#f87171"></i>'; }
        else { border = '1px solid #7c5cff'; icon = '<i class="fa-solid fa-dumbbell" style="color:#a78bfa"></i>'; }
        if (c.routine) { const cat = c.routine.culture ? 'gods' : 'specialized'; click = 'onclick="FMMonthly.preview(\'' + c.routine.id + '\',\'' + cat + '\')" '; }
      }
      const title = c.isTraining && c.routine ? ' title="' + esc(c.routine.name) + '"' : (c.isTraining ? '' : ' title="Descanso"');
      h += '<div ' + click + title + ' style="' + ring + 'background:' + bg + ';border:' + border + ';border-radius:10px;min-height:46px;padding:4px;cursor:' + (click?'pointer':'default') + ';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px">' +
        '<span style="font-size:11px;color:#cbd2ee;font-weight:700">' + c.day + '</span>' + (icon || '<span style="font-size:9px;color:#5a6080">descanso</span>') + '</div>';
    });
    h += '</div><div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;font-size:10px;color:#8b92b0">' +
      '<span><i class="fa-solid fa-check" style="color:#34d399"></i> Hecho</span>' +
      '<span><i class="fa-solid fa-dumbbell" style="color:#a78bfa"></i> Planeado</span>' +
      '<span><i class="fa-solid fa-xmark" style="color:#f87171"></i> No hecho</span>' +
      '<span style="color:#5a6080">descanso = libre</span></div></div>';
    return h;
  }
  function summaryCard(veredicto, color, done, plannedTotal, pts, streak) {
    return '<div style="background:linear-gradient(135deg,rgba(124,92,255,.16),rgba(52,211,153,.10));border:1px solid #2c3350;border-radius:14px;padding:16px">' +
      '<div style="color:#fff;font-weight:700;font-size:15px;margin-bottom:6px"><i class="fa-solid fa-clipboard-check" style="color:' + color + '"></i> Resumen de tu coach</div>' +
      '<p style="color:' + color + ';font-weight:700;font-size:14px;margin:0 0 6px">' + veredicto + '</p>' +
      '<p style="color:#cbd2ee;font-size:13px;line-height:1.5;margin:0">Llevas <b>' + done + '</b> entrenos de <b>' + plannedTotal + '</b> planeados este mes, <b>' + pts + ' PX</b> ganados y una racha de <b>' + streak + '</b> dia(s). Al cerrar el mes este sera tu reporte final. ¡Sigue marcando entrenos en tu calendario!</p></div>';
  }

  function preview(id, cat) { close(); if (typeof window.openRoutineDetail === 'function') window.openRoutineDetail(id, cat); }

  function safetyNote(p) {
    if (!window.FMSafety || !window.FMSafety.hasMedical(p)) return '';
    const m = window.FMSafety.profileMed(p);
    let extra = '';
    if (m.cardio) extra += ' Por tus respuestas cardiovasculares, te recomendamos consultar a tu medico antes de subir la intensidad.';
    if (m.estado === 'embarazada' || m.estado === 'posparto') extra += ' En embarazo/posparto, busca el alta de tu medico y prioriza el bajo impacto.';
    return '<div style="background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.4);border-radius:14px;padding:14px;margin-top:14px">' +
      '<div style="color:#fca5a5;font-weight:700;font-size:13px"><i class="fa-solid fa-shield-heart"></i> Seguridad primero</div>' +
      '<p style="color:#cbd2ee;font-size:12px;line-height:1.5;margin:6px 0 0">Este plan ya filtra rutinas poco recomendadas para tu perfil de salud.' + extra + ' ' + window.FMSafety.disclaimer() + '</p></div>';
  }

  function init(sb, uid) {
    supabase = sb || (window.FMAuth && window.FMAuth.getClient ? window.FMAuth.getClient() : null);
    userId = uid;
  }

  window.FMMonthly = { init, open, close, preview, reroll };
})();
