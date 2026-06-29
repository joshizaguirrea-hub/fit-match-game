/* ============================================================
 * fm-nutrition.js - Motor determinista de calorias y macros
 * Fit Match - Fase B del sistema nutricional
 * ------------------------------------------------------------
 * Sin ML, sin caja negra: pura ciencia validada.
 *   - TMB con Mifflin-St Jeor (estandar de oro)
 *   - TDEE = TMB x factor de actividad
 *   - Meta calorica = TDEE +/- ajuste por objetivo y ritmo
 *   - Macros = reparto por estilo dietetico
 * Todas son funciones puras (faciles de testear). Expone window.FMNutrition.
 * ============================================================ */
(function () {
  'use strict';

  // --- 1) TMB: Mifflin-St Jeor ---
  // Hombre:  10*kg + 6.25*cm - 5*edad + 5
  // Mujer:   10*kg + 6.25*cm - 5*edad - 161
  // Neutro:  promedio de las dos constantes (-78)
  function bmr(p) {
    if (!p) return null;
    const kg = +p.peso_kg, cm = +p.altura_cm, edad = +p.edad;
    if (!kg || !cm || !edad) return null;
    const base = 10 * kg + 6.25 * cm - 5 * edad;
    if (p.sexo === 'hombre') return base + 5;
    if (p.sexo === 'mujer') return base - 161;
    return base - 78;
  }

  // --- 2) Factor de actividad (desde dias/semana de entreno) ---
  const ACTIVITY = { 2: 1.375, 4: 1.55, 6: 1.725 };
  function activityFactor(p) {
    return ACTIVITY[+p.dias_semana] || 1.2; // 1.2 = sedentario por defecto
  }
  function tdee(p) {
    const b = bmr(p);
    if (b == null) return null;
    return Math.round(b * activityFactor(p));
  }

  // --- 3) Meta calorica: ajuste por objetivo + ritmo ---
  const ADJUST = {
    bajar_grasa: { lento: -0.10, moderado: -0.20, agresivo: -0.25 },
    musculo:     { lento:  0.05, moderado:  0.10, agresivo:  0.15 }
  };
  function calorieGoal(p) {
    const t = tdee(p);
    if (t == null) return null;
    const pace = p.nutrition_pace || 'moderado';
    const adj = (ADJUST[p.objetivo] && ADJUST[p.objetivo][pace]) || 0;
    // Piso de seguridad: nunca por debajo del TMB (evita dietas peligrosas)
    return Math.max(Math.round(bmr(p)), Math.round(t * (1 + adj)));
  }

  // --- 4) Reparto de macros (% de calorias) ---
  // p=proteina, f=grasa, c=carbohidratos
  const SPLITS = {
    keto:         { p: 0.25, f: 0.70, c: 0.05 },
    lowcarb:      { p: 0.35, f: 0.40, c: 0.25 },
    mediterraneo: { p: 0.25, f: 0.35, c: 0.40 }
  };
  function macroSplit(p) {
    if (SPLITS[p.diet_style]) return SPLITS[p.diet_style];
    // ninguno / ayuno -> el objetivo manda
    if (p.objetivo === 'musculo')     return { p: 0.30, f: 0.25, c: 0.45 };
    if (p.objetivo === 'bajar_grasa') return { p: 0.35, f: 0.30, c: 0.35 };
    return { p: 0.30, f: 0.30, c: 0.40 }; // balanceado
  }

  // --- 5) Macros en gramos ---
  function macros(p) {
    const b = bmr(p);
    const t = tdee(p);
    // --- Override: el plan del usuario (su nutriologo) manda ---
    if (p.use_custom_plan && +p.custom_calories) {
      const cal = +p.custom_calories;
      const protein_g = +p.custom_protein_g || Math.round((cal * 0.30) / 4);
      const carbs_g   = +p.custom_carbs_g   || Math.round((cal * 0.40) / 4);
      const fat_g     = +p.custom_fat_g     || Math.round((cal * 0.30) / 9);
      return {
        source: 'custom',
        bmr: b != null ? Math.round(b) : null,
        tdee: t,
        calories: cal,
        split: null,
        protein_g, carbs_g, fat_g,
        net_carbs_per_meal: p.meals_per_day ? Math.round(carbs_g / +p.meals_per_day) : null
      };
    }
    // --- Plan calculado por el motor ---
    const cal = calorieGoal(p);
    if (cal == null) return null;
    const s = macroSplit(p);
    const protein_g = Math.round((cal * s.p) / 4); // 4 kcal/g
    const carbs_g   = Math.round((cal * s.c) / 4); // 4 kcal/g
    const fat_g     = Math.round((cal * s.f) / 9); // 9 kcal/g
    return {
      source: 'calculado',
      bmr: Math.round(b),
      tdee: t,
      calories: cal,
      split: s,
      protein_g, carbs_g, fat_g,
      // Carbohidratos por comida (referencia para keto/lowcarb)
      net_carbs_per_meal: p.meals_per_day ? Math.round(carbs_g / +p.meals_per_day) : null
    };
  }

  // --- Validacion de seguridad (la idea de Joshua) ---
  // Para keto, los carbos netos no deben pasar de ~50g/dia.
  function validate(p, result) {
    const warnings = [];
    if (!result) return warnings;
    if (p.diet_style === 'keto' && result.carbs_g > 50) {
      warnings.push('Keto: carbohidratos por encima de 50g/dia. Ajustando...');
    }
    if (result.calories < 1200) {
      warnings.push('Calorias muy bajas: consulta a un profesional.');
    }
    return warnings;
  }

  const api = { bmr, tdee, calorieGoal, macroSplit, macros, validate, ACTIVITY, ADJUST, SPLITS };
  const root = (typeof window !== 'undefined') ? window
             : (typeof globalThis !== 'undefined') ? globalThis : this;
  root.FMNutrition = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
