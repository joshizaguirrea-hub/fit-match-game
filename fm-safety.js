/* ============================================================
 * fm-safety.js - Filtro de seguridad por perfil de salud (PAR-Q)
 * ------------------------------------------------------------
 * Lee las respuestas medicas del perfil y decide que rutinas son
 * riesgosas (por lesiones, condicion cardiovascular o posparto),
 * para que el plan mensual/semanal y las recomendaciones del coach
 * solo sugieran ejercicio SEGURO. Orientacion general, NO medica.
 * Expone window.FMSafety.
 * ============================================================ */
(function () {
  'use strict';

  // Palabras clave (en nombres de ejercicios) riesgosas por lesion
  const RISK = {
    rodilla: ['salto','jump','pistol','profund','zancada','lunge','bulgara','box','caja','step-up','patinador','skater','plyo','burpee'],
    hombro:  ['press militar','press de hombro','press push','dominada','jalon','fondo','dip','pike','planche','arnold','sobre cabeza','overhead','snatch','clean','elevaciones laterales','press de pecho','press inclinado','press de banca'],
    espalda: ['peso muerto','sentadilla con barra','good morning','remo con barra','sit-up','toes-to-bar','dragon flag','hiperextension','superman','swing','thruster','encogimiento','peso muerto rumano','remo renegado'],
    cuello:  ['puente','dominada','press militar','sobre cabeza','pike','plancha invertida'],
    cadera:  ['hip thrust','profund','zancada','peso muerto','salto','jump','bulgara'],
    muneca:  ['flexion','push-up','plancha','fondo','dip','burpee','handstand','planche','remo renegado']
  };
  // Alto impacto / intensidad (para cardiovascular y embarazo/posparto)
  const HIGH = ['salto','jump','burpee','sprint','hiit','plyo','skater','patinador','box','caja','thruster','snatch','clean','correr','trote','mountain climber','escalador','tijera','jumping'];
  // Core intenso a evitar en embarazo/posparto temprano
  const CORE = ['abdominal','crunch','sit-up','v-up','v-ups','dragon flag','hollow','russian twist','elevacion de piernas','bicicleta abdominal'];

  function listFrom(t){ return (t || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean); }

  function profileMed(p) {
    p = p || {};
    const lesiones = listFrom(p.med_lesiones);
    const cardio = !!p.med_corazon || !!p.med_dolor_pecho || !!p.med_medicamentos;
    const estado = p.med_estado || 'no'; // 'no' | 'embarazada' | 'posparto'
    const hasAny = lesiones.length > 0 || cardio || (estado && estado !== 'no');
    return { lesiones, cardio, estado, hasAny };
  }

  function restrictions(p) {
    const m = profileMed(p);
    const kws = new Set();
    m.lesiones.forEach(l => (RISK[l] || []).forEach(k => kws.add(k)));
    if (m.cardio || m.estado === 'embarazada' || m.estado === 'posparto') HIGH.forEach(k => kws.add(k));
    if (m.estado === 'embarazada' || m.estado === 'posparto') CORE.forEach(k => kws.add(k));
    const blockLevels = [];
    if (m.cardio || m.estado === 'embarazada') { blockLevels.push('avanzado', 'espartano'); }
    if (m.estado === 'posparto') blockLevels.push('espartano');
    return { kws, blockLevels, med: m };
  }

  function reasons(routine, p) {
    if (!routine || !p) return [];
    const R = restrictions(p);
    if (!R.med.hasAny) return [];
    const out = [];
    if (R.blockLevels.includes(routine.level)) out.push('Intensidad alta para tu condicion de salud');
    const names = (routine.exercises || []).map(e => (e.name || '').toLowerCase());
    let hit = false;
    R.kws.forEach(k => { if (!hit && names.some(n => n.includes(k))) hit = true; });
    if (hit) out.push('Incluye ejercicios poco recomendados segun tus respuestas de salud');
    return out;
  }

  function isRisky(routine, p) { return reasons(routine, p).length > 0; }
  function hasMedical(p) { return profileMed(p).hasAny; }

  // Filtra una lista dejando solo seguras. Si todo sale riesgoso, hace
  // fallback a las basicas (y si tampoco hay, devuelve el original) para
  // nunca dejar al usuario sin opciones.
  function filterSafe(list, p) {
    if (!list || !hasMedical(p)) return list || [];
    const safe = list.filter(r => !isRisky(r, p));
    if (safe.length) return safe;
    const basic = list.filter(r => r.level === 'básico' && !isRisky(r, p));
    return basic.length ? basic : list;
  }

  function disclaimer() {
    return 'Orientacion general, no reemplaza el consejo medico. Ante dudas o sintomas, suspende y consulta a un profesional de salud.';
  }

  window.FMSafety = { restrictions, reasons, isRisky, hasMedical, filterSafe, disclaimer, profileMed };
})();
