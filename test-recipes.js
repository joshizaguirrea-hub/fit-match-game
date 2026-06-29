/* Pruebas del matcher de recetas (Fase C/D).
 * Correr:  node test-recipes.js
 * Carga el motor nutricional como global para que el matcher lo use. */
globalThis.FMNutrition = require('./fm-nutrition.js');
const R = require('./fm-recipes.js');

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  OK  ' + name); }
  else { fail++; console.log('FAIL  ' + name); }
}

// 1) net_carbs y keto flag bien calculados
const huevos = R.all.find(r => r.id === 'huevos_aguacate');
check('net_carbs = carbs - fiber', huevos.net_carbs === huevos.carbs_g - huevos.fiber_g);

// 2) Vegano: solo recetas veganas
const vegano = R.match({ diet_pattern:'vegano' });
check('Vegano -> todas veganas', vegano.every(r => r.diet === 'vegano'));

// 3) Alergia a mariscos: nunca camarones
const sinMariscos = R.match({ allergies:'mariscos' });
check('Sin mariscos -> excluye camarones', !sinMariscos.some(r => r.id === 'camarones_ajo'));

// 4) Keto: todas keto_friendly y net_carbs <= limite
const keto = R.match({ diet_style:'keto' });
check('Keto -> todas keto_friendly', keto.every(r => r.keto_friendly));
check('Keto -> net_carbs <= limite', keto.every(r => r.net_carbs <= R.KETO_NET_CARBS_MAX));

// 5) Presupuesto bajo: nada caro
const barato = R.match({ budget_tier:'bajo' });
check('Presupuesto bajo -> sin recetas alto', !barato.some(r => r.budget === 'alto'));

// 6) Aversion: excluye por ingrediente
const sinAtun = R.match({ dislikes:'atún' });
check('Dislike atún -> excluye ensalada de atún', !sinAtun.some(r => r.id === 'ensalada_atun'));

// 7) Limite de resultados
check('limit respeta tope', R.match({}, { limit:3 }).length <= 3);

console.log(`\n${pass} pasaron, ${fail} fallaron`);
process.exit(fail ? 1 : 0);
