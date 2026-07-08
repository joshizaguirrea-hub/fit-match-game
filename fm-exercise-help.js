/* ============================================================
 * fm-exercise-help.js - Modal "como se hace" de un ejercicio.
 * Extraido de jugar.html (refactor Fase 3). Auto-contenido:
 * solo depende de FMPhotos/FMDemo (globales) y del DOM.
 * Expone en window: showExerciseHelp(name, event), closeExerciseHelp().
 * ============================================================ */
(function () {
  'use strict';

/* ============ BASE DE DATOS DE EXPLICACIÓN DE EJERCICIOS ============ */
const FM_EX_HELP_DB = {
  // BÁSICOS
  "Flexiones de pared controladas": {
    desc: "Párate frente a una pared a un brazo de distancia. Coloca las manos en ella al ancho de tus hombros y baja doblando los codos lentamente. Mantén el abdomen y el cuerpo completamente rectos.",
    muscles: "Pecho, Hombros y Tríceps"
  },
  "Sentadillas clásicas asistidas": {
    desc: "Sostente ligeramente de un marco de puerta, silla o mesa firme para no perder el equilibrio. Baja la cadera flexionando las rodillas con el peso en los talones y mantén la espalda recta.",
    muscles: "Piernas (Cuádriceps y Glúteos)"
  },
  "Abdominales cortos (Heel Taps)": {
    desc: "Acuéstate boca arriba con rodillas dobladas y pies planos. Levanta la cabeza y hombros del suelo y estira tus brazos lateralmente alternando para tocar el talón izquierdo y luego el derecho.",
    muscles: "Abdomen (Core y Oblicuos)"
  },
  "Superman básico en suelo": {
    desc: "Acuéstate boca abajo con brazos y piernas completamente estiradas. Contrae la espalda baja y los glúteos para despegar simultáneamente el pecho, las manos y los muslos del suelo unos centímetros.",
    muscles: "Espalda Baja, Lumbar y Glúteos"
  },
  "Puente de glúteos clásico": {
    desc: "Boca arriba con rodillas dobladas y pies en el suelo. Empuja con tus talones elevando la pelvis hacia el techo hasta alinear hombros, cadera y rodillas. Aprieta fuertemente los glúteos 2 segundos arriba.",
    muscles: "Glúteos e Isquiotibiales"
  },
  "Ángeles de pared (Wall Angels)": {
    desc: "Apóyate contra la pared de espaldas (cabeza, hombros y glúteos tocando). Coloca tus brazos en forma de cactus (90 grados) tocando la pared y deslízalos lentamente hacia arriba y abajo.",
    muscles: "Espalda Alta, Postura y Hombros"
  },
  "Estiramiento lumbar Gato-Camello": {
    desc: "En cuatro apoyos (rodillas y manos), arquea la espalda hacia el techo metiendo la barbilla (gato), y luego dobla la espalda hacia abajo levantando la cabeza y sacando glúteos (camello) de forma fluida.",
    muscles: "Movilidad Espinal y Espalda"
  },
  "Abdominales Bird-Dog controlados": {
    desc: "En cuadrupedia, estira firmemente tu brazo derecho hacia el frente y tu pierna izquierda hacia atrás hasta quedar paralelos al suelo. Mantén 1s para asegurar el equilibrio, baja y alterna de lado.",
    muscles: "Core, Lumbar y Glúteos"
  },
  "Zancadas laterales suaves": {
    desc: "De pie, da un paso amplio hacia la derecha doblando esa rodilla mientras mantienes la pierna izquierda completamente estirada. Empuja fuerte con el pie flexionado para regresar al centro.",
    muscles: "Piernas (Aductores e Interior del Muslo)"
  },
  "Plancha escapular sobre rodillas": {
    desc: "En posición de plancha apoyando rodillas, deja caer el pecho juntando las paletas/omóplatos sin doblar los codos, luego empuja el suelo con fuerza abriendo y redondeando la espalda alta.",
    muscles: "Hombros, Serrato y Espalda Alta"
  },
  
  // INTERMEDIOS
  "Flexiones de pecho clásicas": {
    desc: "Posición de plancha alta con manos al ancho de hombros. Baja el pecho hacia el suelo doblando codos a 45 grados (no abiertos lateralmente). Empuja con fuerza manteniendo tu cuerpo firme como una tabla.",
    muscles: "Pecho, Tríceps y Hombro Anterior"
  },
  "Abdominales cortos (Crunch)": {
    desc: "Acuéstate boca arriba con pies planos. Coloca manos detrás de las orejas y contrae el abdomen para despegar únicamente los omóplatos del suelo. No tires de tu cuello hacia adelante.",
    muscles: "Abdomen Superior"
  },
  "Giros rusos estables (Russian Twists)": {
    desc: "Sentado con rodillas flexionadas, inclina el torso hacia atrás para sentir tensión abdominal. Gira todo el tronco de lado a lado llevando tus manos unidas a tocar el suelo en cada costado.",
    muscles: "Abdomen (Core y Oblicuos)"
  },
  "Zancadas alternas hacia atrás": {
    desc: "De pie, da un paso amplio hacia atrás con un pie y baja la cadera verticalmente hasta que ambas rodillas formen un ángulo de 90 grados. Empuja con la pierna delantera para volver a pararte.",
    muscles: "Piernas (Cuádriceps y Glúteos)"
  },
  "Plancha tradicional isométrica (segundos)": {
    desc: "Apoya los antebrazos y las puntas de los pies en el suelo. Mantén el cuerpo en una línea horizontal perfecta, apretando el abdomen, los glúteos y las piernas sin dejar caer la pelvis.",
    muscles: "Core Total (Abdomen, Espalda y Hombros)"
  },
  "Burpees tradicionales controlados": {
    desc: "De pie, baja a cuclillas, apoya manos y salta con ambos pies hacia atrás a plancha. Haz una lagartija (opcional), regresa los pies al frente de un salto y levántate con un brinco aplaudiendo arriba.",
    muscles: "Cardio, Resistencia y Cuerpo Completo"
  },
  "Sentadillas clásicas con salto vertical": {
    desc: "Haz una sentadilla clásica profunda, y al subir empuja con tus talones de forma explosiva despegando los pies del suelo con un brinco. Cae suavemente amortiguando el impacto doblando rodillas.",
    muscles: "Fuerza de Piernas y Potencia Cardíaca"
  },
  "Saltos de estrella rápidos (Jacks)": {
    desc: "El clásico Jumping Jack: salta abriendo piernas y subiendo manos sobre la cabeza para tocar las palmas, luego salta de nuevo cerrando pies y bajando brazos al costado a ritmo veloz.",
    muscles: "Cardio, Hombros y Pantorrillas"
  },
  "Escaladores de montaña (Mountain Climbers)": {
    desc: "En plancha alta con manos apoyadas debajo de hombros, lleva alternadamente tus rodillas hacia el pecho de forma rápida y rítmica como si estuvieras corriendo cuesta arriba en posición horizontal.",
    muscles: "Core, Resistencia y Hombros"
  },
  "Flexiones Spiderman alternas": {
    desc: "Al bajar el pecho en tu flexión tradicional, flexiona una rodilla por el costado del cuerpo y llévala a tocar tu codo del mismo lado. Alterna de pierna en la siguiente repetición.",
    muscles: "Pecho, Tríceps, Core y Oblicuos"
  },

  // AVANZADOS
  "Sentadillas búlgaras estrictas (por pierna)": {
    desc: "Coloca un pie apoyado hacia atrás en una silla o sillón. Con el otro pie al frente, desciende verticalmente doblando la rodilla delantera hasta que el muslo quede paralelo al suelo. Espalda recta.",
    muscles: "Cuádriceps, Glúteos e Isquiotibiales"
  },
  "Zancadas con salto alternas y explosivas": {
    desc: "Inicia en zancada/desplante bajo. Salta verticalmente de forma explosiva despegando del suelo, y en el aire intercambia la posición de tus piernas para caer amortiguando en la zancada contraria.",
    muscles: "Potencia, Resistencia de Piernas y Cardio"
  },
  "Puente de glúteos a una pierna (por lado)": {
    desc: "Acuéstate boca arriba, dobla una rodilla apoyando el pie, y estira la otra pierna al aire. Empuja con el talón del suelo para elevar tus caderas manteniendo la pierna elevada estirada.",
    muscles: "Glúteos, Femoral y Core"
  },
  "Flexiones de picas estrictas (Pike Pushups)": {
    desc: "Forma una V invertida con tu cuerpo (pies y manos apoyados, caderas empujadas hacia el techo). Baja la coronilla de tu cabeza hacia el suelo flexionando codos hacia atrás, y empuja fuerte.",
    muscles: "Hombros (Deltoides) y Tríceps"
  },
  "Flexiones declinadas estrictas": {
    desc: "Posición de flexión pero colocando tus pies elevados sobre una silla, banco o sofá, apoyando las manos en el suelo. Baja el pecho de forma controlada y empuja para subir.",
    muscles: "Pecho Superior, Hombros y Tríceps"
  },
  "Abdominales de limpiaparabrisas (Wipers)": {
    desc: "Boca arriba, brazos abiertos en cruz para apoyarte. Levanta ambas piernas juntas completamente estiradas a 90 grados, y desciéndelas juntas de lado a lado rozando el suelo con control.",
    muscles: "Oblicuos, Core e Hip Flexors"
  },
  "Plancha de antebrazos con balanceo (Body Saw)": {
    desc: "En posición de plancha baja, utiliza únicamente la punta de tus pies para deslizar todo tu cuerpo rígido unos centímetros hacia adelante y hacia atrás. No dobles la cintura ni bajes la cadera.",
    muscles: "Core Abdominal Profundo"
  },
  "Abdominales Hollow Body Hold (segundos)": {
    desc: "Túmbate boca arriba. Despega la cabeza, omóplatos y tus piernas del suelo (solo unos 10-15 centímetros) apretando el abdomen. Lo vital es que la zona lumbar esté 100% pegada al suelo.",
    muscles: "Abdomen Profundo (Core Isométrico)"
  },
  "Flexiones de arquero controladas (Archer Pushups)": {
    desc: "Coloca tus manos muy abiertas en el suelo. Al descender, dobla solo un codo inclinando el peso a ese lado, mientras el otro brazo permanece totalmente estirado de lado. Sube y alterna.",
    muscles: "Fuerza Unilateral de Pecho, Brazos y Hombros"
  },

  // ESPARTANOS
  "Flexiones de pecho explosivas con despegue": {
    desc: "Realiza una flexión normal con control, pero empuja el suelo de forma tan explosiva y veloz que tus manos se despeguen completamente del suelo unos centímetros en el punto más alto del recorrido.",
    muscles: "Potencia Explosiva de Pecho y Brazos"
  },
  "Flexiones haciendo el pino asistido (Handstand)": {
    desc: "Apoya las manos a unos centímetros de la pared y da una patada al aire para subir los pies apoyándote de cabeza contra la pared. Desciende doblando codos controladamente y empuja arriba.",
    muscles: "Hombros Extremos, Tríceps y Core"
  },
  "Dominadas estrictas (Pull-ups)": {
    desc: "Cuelga de una barra con manos más abiertas que tus hombros. Jala el cuerpo con tu espalda y bíceps hasta que tu barbilla pase cómodamente sobre la barra, bajando lentamente sin balancearte.",
    muscles: "Espalda Completa (Dorsal) y Bíceps"
  },
  "Burpees espartanos con lagartija doble": {
    desc: "Haz un burpee clásico, pero cuando los pies salten hacia atrás para la plancha, realiza DOS flexiones de pecho completas seguidas en el suelo antes de saltar al frente y brincar.",
    muscles: "Fuerza de Combate, Cardio y Resistencia Total"
  },
  "Abdominales dobles completos (V-Ups estrictos)": {
    desc: "Acuéstate boca arriba estirado. Eleva de forma veloz y simultánea el torso y tus piernas rectas, formando una V con el cuerpo y tocando la punta de tus pies en el aire con tus manos.",
    muscles: "Core Abdominal Completo"
  },
  "Sostener sentadilla isométrica profunda (segundos)": {
    desc: "Baja a posición de sentadilla profunda (muslos paralelos o más abajo del nivel del suelo). Mantén tu espalda recta y aprieta las piernas sosteniendo esa postura estática como una roca.",
    muscles: "Resistencia e Isometría de Piernas y Glúteos"
  }
};

// Convierte una descripción en una lista numerada de pasos de ejecución.
// Sirve para CUALQUIER ejercicio: parte la descripción en frases y añade
// dos consejos estándar (respiración y control) al final.
function buildExerciseStepsHTML(desc) {
  const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  // Parte por punto/exclamación/interrogación seguidos de espacio
  let pasos = String(desc || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (pasos.length === 0) pasos = ['Realiza el movimiento con t\u00e9cnica controlada.'];
  // Consejos estándar comunes a todo ejercicio
  pasos.push('Respira de forma controlada: exhala durante el esfuerzo e inhala al regresar.');
  pasos.push('Vuelve a la posici\u00f3n inicial con control y repite hasta completar tus repeticiones.');

  return pasos.map((p, i) => (
    '<li class="flex gap-2 items-start">' +
      '<span class="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">' + (i + 1) + '</span>' +
      '<span>' + escHtml(p) + '</span>' +
    '</li>'
  )).join('');
}

// Palabras conectoras que se ignoran al comparar.
const FM_STOP = new Set(['de','del','la','el','los','las','con','y','a','en','al','o','un','una','para','sin','e','su','sus','lo']);
// Stem crudo para casar singular/plural en espanol: quita '-es' (flexion/
// flexiones, talon/talones) o la '-s' final. Debe ser consistente kw<->nombre.
function fmStem(t) {
  if (t.length > 4 && t.endsWith('es')) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith('s')) return t.slice(0, -1);
  return t;
}
// Tokeniza: minusculas, sin acentos/signos, sin conectoras, con stem.
function fmTokens(s) {
  return String(s || '')
    .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t && !FM_STOP.has(t))
    .map(fmStem);
}
function fmNormEx(s) { return fmTokens(s).join(' '); }

// Mapa normalizado de las entradas exactas (se construye una sola vez).
let _fmNormDB = null;
function fmNormDB() {
  if (_fmNormDB) return _fmNormDB;
  _fmNormDB = {};
  for (const k in FM_EX_HELP_DB) _fmNormDB[fmNormEx(k)] = FM_EX_HELP_DB[k];
  return _fmNormDB;
}

// Resolvedor: exacto -> normalizado exacto -> movimiento base (score) ->
// categoria -> generico. Ver fm-exercise-help-db.js (base de conocimiento).
// El match base es por SUBCONJUNTO de tokens: una clave calza si TODOS sus
// tokens estan en el nombre (orden y conectores/plurales aparte). Gana la
// clave con mas caracteres (la mas especifica).
function resolveExerciseHelp(name) {
  if (FM_EX_HELP_DB[name]) return FM_EX_HELP_DB[name];
  const norm = fmNormEx(name);
  const nd = fmNormDB();
  if (nd[norm]) return nd[norm];

  const nameSet = new Set(fmTokens(name));
  const base = window.FM_EX_HELP_BASE || [];
  let best = null, bestScore = 0;
  for (const entry of base) {
    for (const kw of entry.kw) {
      const toks = fmTokens(kw);
      if (!toks.length) continue;
      if (toks.every(t => nameSet.has(t))) {
        const score = toks.reduce((a, t) => a + t.length, 0);
        if (score > bestScore) { bestScore = score; best = entry; }
      }
    }
  }
  if (best) return { desc: best.desc, muscles: best.muscles };

  // Respaldo por categoria (yoga/pilates/hipopresivos/cardio/movilidad).
  const cats = window.FM_EX_HELP_CATEGORY || {};
  for (const key in cats) {
    const c = cats[key];
    if ((c.match || []).some(m => {
      const mt = fmTokens(m);
      return mt.length && mt.every(t => nameSet.has(t));
    })) {
      return { desc: c.desc, muscles: c.muscles };
    }
  }
  return window.FM_EX_HELP_GENERIC || {
    desc: "Realiza este ejercicio con tecnica controlada, espalda neutra y core activo, en un rango completo. Evita acelerarte para prevenir lesiones.",
    muscles: "Musculos estabilizadores y Cuerpo completo"
  };
}

function showExerciseHelp(name, event) {
  if (event) {
    event.stopPropagation(); // Evitar marcar la casilla al dar clic en info
  }
  
  const helpExName = document.getElementById('help-ex-name');
  const helpExSteps = document.getElementById('help-ex-steps');
  const helpExMuscles = document.getElementById('help-ex-muscles');
  const helpExVideo = document.getElementById('help-ex-video');

  const info = resolveExerciseHelp(name);

  helpExName.textContent = name;
  if (helpExSteps) helpExSteps.innerHTML = buildExerciseStepsHTML(info.desc);
  helpExMuscles.textContent = info.muscles;
  helpExVideo.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent('como hacer ' + name + ' ejercicio tecnica calistenia');

  // Demo ANIMADA del movimiento (crossfade inicio<->fin), si hay coincidencia
  var photos = (window.FMPhotos && FMPhotos.getPair) ? FMPhotos.getPair(name) : [];
  var pbox = document.getElementById('help-ex-photos');
  if (pbox) {
    if (photos.length === 2 && window.FMDemo) {
      pbox.innerHTML = FMDemo.html(name, { height: '224px', rounded: 'rounded-2xl' });
      pbox.classList.remove('hidden');
    } else {
      pbox.innerHTML = '';
      pbox.classList.add('hidden');
    }
  }

  document.getElementById('exercise-help-modal').classList.remove('hidden');
}

function closeExerciseHelp() {
  document.getElementById('exercise-help-modal').classList.add('hidden');
}

  window.showExerciseHelp = showExerciseHelp;
  window.closeExerciseHelp = closeExerciseHelp;
  window.resolveExerciseHelp = resolveExerciseHelp; // API/diagnostico
})();
