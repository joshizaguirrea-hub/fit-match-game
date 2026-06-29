/* Pruebas del motor nutricional (Fase B).
 * Correr:  node test-nutrition.js
 * Sin dependencias. Valida matematica y reglas de seguridad. */
const N = require('./fm-nutrition.js');

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  OK  ' + name); }
  else { fail++; console.log('FAIL  ' + name); }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol || 1); }

// Perfil de referencia: hombre 30 anios, 80kg, 180cm, entrena 4 dias
const hombre = { sexo:'hombre', edad:30, peso_kg:80, altura_cm:180, dias_semana:4 };

// 1) TMB Mifflin-St Jeor: 10*80 + 6.25*180 - 5*30 + 5 = 1780
check('TMB hombre = 1780', near(N.bmr(hombre), 1780, 0.5));

// 2) Mujer 30/60/165: 10*60 + 6.25*165 - 5*30 - 161 = 1320.25
const mujer = { sexo:'mujer', edad:30, peso_kg:60, altura_cm:165, dias_semana:2 };
check('TMB mujer = 1320.25', near(N.bmr(mujer), 1320.25, 0.5));

// 3) TDEE = TMB * factor (4 dias -> 1.55): 1780*1.55 = 2759
check('TDEE hombre ~ 2759', near(N.tdee(hombre), 2759, 2));

// 4) Datos faltantes -> null (seguridad)
check('Sin peso -> bmr null', N.bmr({ sexo:'hombre', edad:30, altura_cm:180 }) === null);
check('Sin datos -> macros null', N.macros({}) === null);

// 5) Deficit por bajar grasa moderado (-20%)
const cortar = Object.assign({}, hombre, { objetivo:'bajar_grasa', nutrition_pace:'moderado' });
check('Meta corte < TDEE', N.calorieGoal(cortar) < N.tdee(cortar));
check('Meta corte >= TMB (piso seguridad)', N.calorieGoal(cortar) >= N.bmr(cortar));

// 6) Superavit por musculo
const subir = Object.assign({}, hombre, { objetivo:'musculo', nutrition_pace:'moderado' });
check('Meta volumen > TDEE', N.calorieGoal(subir) > N.tdee(subir));

// 7) Keto: carbos netos bajos (la validacion crucial de Joshua)
const keto = Object.assign({}, hombre, { diet_style:'keto', objetivo:'bajar_grasa', nutrition_pace:'moderado' });
const ketoR = N.macros(keto);
check('Keto: carbos <= 50g/dia', ketoR.carbs_g <= 50);
check('Keto: grasa es el macro dominante', ketoR.fat_g * 9 > ketoR.protein_g * 4);

// 8) Suma de macros ~= calorias meta (coherencia +/- 3%)
const r = N.macros(subir);
const sumKcal = r.protein_g*4 + r.carbs_g*4 + r.fat_g*9;
check('Macros suman ~ calorias meta', near(sumKcal, r.calories, r.calories*0.03));

// 9) Plan personalizado (override del usuario) manda sobre el calculo
const custom = Object.assign({}, hombre, { use_custom_plan:true, custom_calories:1800, custom_protein_g:130, custom_carbs_g:180, custom_fat_g:60 });
const cR = N.macros(custom);
check('Custom: usa las calorias del usuario', cR.calories === 1800);
check('Custom: usa la proteina del usuario', cR.protein_g === 130);
check('Custom: source = custom', cR.source === 'custom');
// Sin datos fisicos pero con plan propio -> igual devuelve numeros
const soloPlan = { use_custom_plan:true, custom_calories:2000 };
check('Custom sin datos fisicos -> funciona', N.macros(soloPlan) && N.macros(soloPlan).calories === 2000);

console.log(`\n${pass} pasaron, ${fail} fallaron`);
process.exit(fail ? 1 : 0);
