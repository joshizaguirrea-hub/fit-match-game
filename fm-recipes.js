/* ============================================================
 * fm-recipes.js - Base de recetas con tags + matcher por reglas
 * Fit Match - Fase C/D del sistema nutricional
 * ------------------------------------------------------------
 * Datos curados (no scraping). Cada receta trae macros, alergenos,
 * dieta, presupuesto y tipo de comida. El matcher filtra por el
 * perfil nutricional del usuario (alergias, dieta, presupuesto,
 * estilo keto, aversiones) y ordena por cercania a la meta por comida.
 *
 * Feature engineering (idea de Joshua):
 *   net_carbs = carbs_g - fiber_g
 *   keto_friendly = net_carbs <= 15 (por porcion)
 *
 * Expone window.FMRecipes = { all, match, KETO_NET_CARBS_MAX }.
 * ============================================================ */
(function () {
  'use strict';

  const KETO_NET_CARBS_MAX = 15; // g netos por porcion para considerar keto

  // diet: carne | pollo | pescado | vegetariano | vegano
  // allergens: gluten | lacteos | nueces | mariscos | huevo | soya
  // budget: bajo | medio | alto   meal: desayuno | comida | cena | snack
  const RAW = [
    { id:'huevos_aguacate', name:'Huevos revueltos con aguacate', cuisine:'mexicana', diet:'vegetariano',
      kcal:380, protein_g:20, carbs_g:8, fat_g:30, fiber_g:5, allergens:['huevo'], budget:'bajo',
      cook_time_min:10, cook_skill:'principiante', meal:'desayuno',
      ingredients:['3 huevos','1/2 aguacate','sal y pimienta','1 cda aceite de oliva'],
      steps:['Bate los huevos con sal.','Cocina a fuego medio revolviendo.','Sirve con aguacate en rebanadas.'] },

    { id:'avena_platano', name:'Avena con plátano y canela', cuisine:'general', diet:'vegano',
      kcal:350, protein_g:10, carbs_g:60, fat_g:7, fiber_g:8, allergens:[], budget:'bajo',
      cook_time_min:8, cook_skill:'principiante', meal:'desayuno',
      ingredients:['1/2 taza avena','1 taza agua o bebida vegetal','1 plátano','canela al gusto'],
      steps:['Cuece la avena con el líquido.','Agrega plátano en rodajas y canela.'] },

    { id:'pollo_brocoli', name:'Pollo a la plancha con brócoli', cuisine:'general', diet:'pollo',
      kcal:450, protein_g:45, carbs_g:12, fat_g:22, fiber_g:5, allergens:[], budget:'medio',
      cook_time_min:25, cook_skill:'intermedio', meal:'comida',
      ingredients:['180g pechuga de pollo','2 tazas brócoli','1 cda aceite de oliva','ajo, sal, pimienta'],
      steps:['Sazona y cocina el pollo a la plancha.','Saltea el brócoli con ajo.','Sirve junto.'] },

    { id:'salmon_esparragos', name:'Salmón al horno con espárragos', cuisine:'mediterranea', diet:'pescado',
      kcal:520, protein_g:40, carbs_g:9, fat_g:36, fiber_g:4, allergens:['pescado'], budget:'alto',
      cook_time_min:25, cook_skill:'intermedio', meal:'cena',
      ingredients:['180g salmón','1 manojo espárragos','limón','aceite de oliva, sal'],
      steps:['Hornea el salmón 15 min a 200°C.','Asa los espárragos.','Exprime limón al servir.'] },

    { id:'tacos_lentejas', name:'Tacos de lentejas', cuisine:'mexicana', diet:'vegano',
      kcal:420, protein_g:18, carbs_g:62, fat_g:10, fiber_g:14, allergens:['gluten'], budget:'bajo',
      cook_time_min:30, cook_skill:'principiante', meal:'comida',
      ingredients:['1 taza lentejas cocidas','tortillas de maíz','cebolla, jitomate','especias'],
      steps:['Sofríe cebolla y jitomate.','Agrega lentejas y especias.','Sirve en tortillas.'] },

    { id:'ensalada_atun', name:'Ensalada de atún', cuisine:'general', diet:'pescado',
      kcal:330, protein_g:32, carbs_g:10, fat_g:18, fiber_g:5, allergens:['pescado'], budget:'bajo',
      cook_time_min:10, cook_skill:'principiante', meal:'comida',
      ingredients:['1 lata de atún','lechuga, pepino, jitomate','aceite de oliva','limón'],
      steps:['Mezcla las verduras.','Agrega el atún escurrido.','Adereza con aceite y limón.'] },

    { id:'omelette_queso', name:'Omelette de queso y espinaca', cuisine:'general', diet:'vegetariano',
      kcal:400, protein_g:26, carbs_g:5, fat_g:31, fiber_g:2, allergens:['huevo','lacteos'], budget:'medio',
      cook_time_min:12, cook_skill:'principiante', meal:'desayuno',
      ingredients:['3 huevos','40g queso','1 taza espinaca','sal, pimienta'],
      steps:['Bate los huevos.','Vierte en sartén, agrega espinaca y queso.','Dobla y sirve.'] },

    { id:'res_verduras', name:'Salteado de res con verduras', cuisine:'asiatica', diet:'carne',
      kcal:540, protein_g:42, carbs_g:20, fat_g:30, fiber_g:6, allergens:['soya'], budget:'medio',
      cook_time_min:25, cook_skill:'intermedio', meal:'cena',
      ingredients:['180g res en tiras','pimiento, brócoli, zanahoria','salsa de soya','ajo, jengibre'],
      steps:['Sella la res.','Agrega verduras y saltea.','Vierte salsa de soya y sirve.'] },

    { id:'bowl_garbanzos', name:'Bowl de garbanzos y verduras', cuisine:'mediterranea', diet:'vegano',
      kcal:460, protein_g:19, carbs_g:58, fat_g:16, fiber_g:13, allergens:[], budget:'bajo',
      cook_time_min:20, cook_skill:'principiante', meal:'comida',
      ingredients:['1 taza garbanzos cocidos','arroz integral','pepino, jitomate','tahini o aceite'],
      steps:['Arma el bowl con arroz de base.','Agrega garbanzos y verduras.','Adereza al gusto.'] },

    { id:'pollo_keto', name:'Pollo con queso y tocino (keto)', cuisine:'general', diet:'pollo',
      kcal:600, protein_g:48, carbs_g:4, fat_g:44, fiber_g:1, allergens:['lacteos'], budget:'medio',
      cook_time_min:30, cook_skill:'intermedio', meal:'cena',
      ingredients:['180g pollo','2 rebanadas tocino','50g queso','espinaca'],
      steps:['Cocina el pollo.','Cubre con tocino y queso.','Gratina y sirve con espinaca.'] },

    { id:'tofu_salteado', name:'Tofu salteado con verduras', cuisine:'asiatica', diet:'vegano',
      kcal:390, protein_g:24, carbs_g:18, fat_g:24, fiber_g:6, allergens:['soya'], budget:'medio',
      cook_time_min:20, cook_skill:'principiante', meal:'comida',
      ingredients:['200g tofu firme','brócoli, pimiento','salsa de soya','ajo, aceite'],
      steps:['Dora el tofu en cubos.','Agrega verduras.','Vierte salsa y saltea.'] },

    { id:'yogurt_nueces', name:'Yogurt griego con nueces', cuisine:'general', diet:'vegetariano',
      kcal:300, protein_g:20, carbs_g:14, fat_g:18, fiber_g:2, allergens:['lacteos','nueces'], budget:'medio',
      cook_time_min:3, cook_skill:'principiante', meal:'snack',
      ingredients:['1 taza yogurt griego','1 puño de nueces','miel opcional'],
      steps:['Sirve el yogurt.','Agrega nueces encima.'] },

    { id:'sopa_verduras', name:'Sopa de verduras', cuisine:'general', diet:'vegano',
      kcal:180, protein_g:6, carbs_g:30, fat_g:4, fiber_g:8, allergens:[], budget:'bajo',
      cook_time_min:30, cook_skill:'principiante', meal:'cena',
      ingredients:['zanahoria, calabaza, apio','caldo de verduras','cebolla, ajo'],
      steps:['Sofríe cebolla y ajo.','Agrega verduras y caldo.','Cuece 20 min.'] },

    { id:'camarones_ajo', name:'Camarones al ajillo', cuisine:'mediterranea', diet:'pescado',
      kcal:340, protein_g:38, carbs_g:6, fat_g:18, fiber_g:1, allergens:['mariscos'], budget:'alto',
      cook_time_min:15, cook_skill:'intermedio', meal:'cena',
      ingredients:['200g camarones','4 dientes de ajo','aceite de oliva','perejil, limón'],
      steps:['Dora el ajo en aceite.','Agrega los camarones.','Termina con perejil y limón.'] },
  ];

  // Calcular net_carbs y flag keto en cada receta (feature engineering)
  const all = RAW.map(r => {
    const net = Math.max(0, (r.carbs_g || 0) - (r.fiber_g || 0));
    return Object.assign({}, r, { net_carbs: net, keto_friendly: net <= KETO_NET_CARBS_MAX, high_protein: r.protein_g >= 30 });
  });

  // --- Helpers de matching ---
  const BUDGET_RANK = { bajo:1, medio:2, alto:3 };
  function dietOk(userPattern, recipeDiet) {
    if (!userPattern || userPattern === 'omnivoro') return true;
    if (userPattern === 'vegano') return recipeDiet === 'vegano';
    if (userPattern === 'vegetariano') return recipeDiet === 'vegetariano' || recipeDiet === 'vegano';
    if (userPattern === 'pescetariano') return ['pescado','vegetariano','vegano'].includes(recipeDiet);
    return true;
  }
  function listFromText(txt) {
    if (!txt) return [];
    return txt.toLowerCase().split(/[,;]+/).map(s => s.trim()).filter(Boolean);
  }
  function hasAllergen(recipe, userAllergens) {
    return recipe.allergens.some(a => userAllergens.some(u => a.includes(u) || u.includes(a)));
  }
  function hasDislike(recipe, dislikes) {
    if (!dislikes.length) return false;
    const hay = (recipe.ingredients || []).join(' ').toLowerCase() + ' ' + recipe.name.toLowerCase();
    return dislikes.some(d => d && hay.includes(d));
  }

  // --- Matcher principal ---
  function match(profile, opts) {
    profile = profile || {};
    opts = opts || {};
    const userAllergens = listFromText(profile.allergies).concat(listFromText(profile.intolerances));
    const dislikes = listFromText(profile.dislikes);
    const userBudget = BUDGET_RANK[profile.budget_tier] || 3; // sin dato -> permite todo
    const keto = profile.diet_style === 'keto';
    const lowcarb = profile.diet_style === 'lowcarb';

    // Meta de calorias por comida (si hay motor + datos)
    let perMeal = null;
    const NUT = (typeof window !== 'undefined' && window.FMNutrition) ? window.FMNutrition
              : (typeof globalThis !== 'undefined' && globalThis.FMNutrition) ? globalThis.FMNutrition : null;
    if (NUT) {
      const r = NUT.macros(profile);
      if (r && profile.meals_per_day) perMeal = r.calories / +profile.meals_per_day;
      else if (r) perMeal = r.calories / 3;
    }

    let list = all.filter(r =>
      dietOk(profile.diet_pattern, r.diet) &&
      !hasAllergen(r, userAllergens) &&
      !hasDislike(r, dislikes) &&
      (BUDGET_RANK[r.budget] <= userBudget) &&
      (!keto || r.keto_friendly) &&
      (!lowcarb || r.net_carbs <= 30)
    );

    // Ordenar: por cercania a la meta por comida; si no hay meta, por proteina
    list = list.slice().sort((a, b) => {
      if (perMeal) return Math.abs(a.kcal - perMeal) - Math.abs(b.kcal - perMeal);
      return b.protein_g - a.protein_g;
    });

    const limit = opts.limit || list.length;
    return list.slice(0, limit);
  }

  const api = { all, match, KETO_NET_CARBS_MAX };
  const root = (typeof window !== 'undefined') ? window
             : (typeof globalThis !== 'undefined') ? globalThis : this;
  root.FMRecipes = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
