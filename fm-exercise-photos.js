/* fm-exercise-photos.js
 * Resuelve una FOTO real para cada ejercicio (en espanol) usando free-exercise-db
 * (yuhonas/free-exercise-db, dominio publico). Coincidencia por palabra clave hacia
 * movimientos base -> carpeta de imagenes. Si no hay match, devuelve '' (la UI pone icono).
 *
 * NO metemos 1041 fotos a mano (DRY): un solo mapa de ~60 movimientos base cubre casi todo.
 */
(function () {
  var BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

  // Orden IMPORTA: lo mas especifico primero (gana el primer match).
  var MAP = [
    // ============================================================
    // ALTA PRIORIDAD: nombres compuestos/ambiguos que DEBEN ganar al
    // generico (ej. 'escaladores en plancha' es escalador, NO plancha;
    // 'pino contra pared' es pino, NO sentadilla contra pared).
    // Keywords elegidas para evitar falsos positivos por substring.
    // ============================================================
    [['escalador', 'escaladores', 'mountain climber'], 'Mountain_Climbers'],
    [['el pino', 'al pino', 'de pino', 'pino contra', 'pino asistido', 'handstand', 'parada de manos', 'vertical invertida'], 'Handstand_Push-Ups'],
    [['caminata de oso', 'oso estatica', 'oso dinamica', 'bear crawl', 'caminata de cangrejo', 'crab walk', 'marcha del cangrejo'], 'Bear_Crawl_Sled_Drags'],
    [['gato-camello', 'gato camello', 'gato-vaca', 'gato vaca', 'cat-cow', 'cat cow', 'camello'], 'Cat_Stretch'],
    [['walkout', 'walkouts', 'caminata de manos', 'inchworm', 'oruga', 'gusano'], 'Inchworm'],
    [['turkish', 'get-up turco', 'get up turco', 'levantada turca', 'levantamiento turco'], 'Kettlebell_Turkish_Get-Up_Squat_style'],
    [['arnold press', 'press arnold'], 'Arnold_Dumbbell_Press'],
    [['chin up', 'chin ups', 'chin-up', 'dominada supina', 'palmas adentro'], 'Chin-Up'],
    [['salto de rana', 'saltos de rana', 'frog jump', 'frog hop'], 'Frog_Hops'],
    [['patada de aleteo', 'aleteo de piernas', 'flutter kick', 'flutter'], 'Flutter_Kicks'],
    [['patada de tijera', 'patadas de tijera', 'scissor kick'], 'Scissor_Kick'],
    [['elevaciones frontales', 'elevacion frontal', 'elevaciones frontal', 'elevacion de brazos al frente', 'front raise'], 'Front_Dumbbell_Raise'],
    [['step up', 'step-up', 'step ups', 'subida al cajon', 'subida al banco'], 'Barbell_Step_Ups'],
    // ----- CORE -----
    [['limpiaparabrisas', 'wiper'], 'Isometric_Wipers'],
    [['bicho muerto', 'dead bug'], 'Dead_Bug'],
    [['plancha lateral', 'side plank', 'side bridge'], 'Side_Bridge'],
    [['plancha', 'plank', 'hollow'], 'Plank'],
    [['giro ruso', 'giros rusos', 'russian'], 'Russian_Twist'],
    [['v-up', 'v-ups', 'cortaplumas', 'jackknife', 'navaja'], 'Jackknife_Sit-Up'],
    [['bicicleta', 'bicycle'], 'Air_Bike'],
    [['toes-to-bar', 'toes to bar', 'elevacion de pierna', 'elevaciones de pierna', 'elevacion de rodilla', 'leg raise'], 'Flat_Bench_Lying_Leg_Raise'],
    [['sit-up', 'sit up', 'abdominales completos'], 'Sit-Up'],
    [['crunch', 'abdominal', 'abdominales', 'heel tap'], 'Crunches'],
    // ----- PIERNAS -----
    [['sumo'], 'Plie_Dumbbell_Squat'],
    [['bulgara', 'bulgaro', 'bulgarian', 'split squat'], 'Barbell_Side_Split_Squat'],
    [['pistol'], 'Kettlebell_Pistol_Squat'],
    [['zancada', 'zancadas', 'desplante', 'estocada', 'lunge'], 'Bodyweight_Walking_Lunge'],
    [['box jump', 'salto al cajon', 'cajon'], 'Front_Box_Jump'],
    [['con salto', 'jump squat', 'salto vertical'], 'Freehand_Jump_Squat'],
    [['wall sit', 'sentadilla isometrica', 'contra pared'], 'Bodyweight_Squat'],
    [['peso muerto rumano', 'romanian', 'rumano'], 'Romanian_Deadlift'],
    [['peso muerto', 'deadlift'], 'Barbell_Deadlift'],
    [['puente', 'hip thrust', 'glute bridge', 'elevacion de cadera'], 'Barbell_Glute_Bridge'],
    [['curl femoral', 'leg curl', 'isquio'], 'Lying_Leg_Curls'],
    [['prensa', 'leg press'], 'Leg_Press'],
    [['talon', 'talones', 'pantorrilla', 'gemelo', 'calf'], 'Calf_Press'],
    [['abduccion', 'abductor'], 'Barbell_Glute_Bridge'],
    [['sentadilla', 'squat'], 'Bodyweight_Squat'],
    // ----- PECHO / BRAZOS (flexiones: variantes primero, generica al final) -----
    // Nota: los burpees deben resolverse ANTES que 'flexion' (su nombre suele incluir 'flexion explosiva')
    [['burpee', 'burpees'], 'Rocket_Jump'],
    [['spiderman', 'spider-man', 'spider man'], 'Spider_Crawl'],
    [['archer', 'arquero'], 'Push-Up_Wide'],
    [['handstand', 'pica', 'picas', 'pike', 'el pino', 'al pino', 'de pino', 'pino contra', 'pino asistido'], 'Handstand_Push-Ups'],
    [['planche'], 'Push-Up_Wide'],
    [['diamante', 'diamond', 'flexion cerrada', 'flexiones cerrada', 'close-grip push', 'codos pegados'], 'Push-Ups_-_Close_Triceps_Position'],
    [['declinada', 'declinadas', 'decline push', 'pies elevados', 'pies en silla', 'pies en sofa'], 'Decline_Push-Up'],
    [['inclinada', 'inclinadas', 'incline push', 'de pared', 'en pared', 'en mesa', 'wall push'], 'Incline_Push-Up'],
    [['palmada', 'clap', 'explosiva', 'explosivas', 'despegue', 'plyo', 'pliometric'], 'Plyo_Push-up'],
    [['flexion', 'flexiones', 'lagartija', 'lagartijas', 'pushup', 'push-up', 'push up'], 'Pushups'],
    [['fondo', 'fondos', 'paralelas', 'dip'], 'Bench_Dips'],
    [['press inclinado', 'incline press', 'incline bench'], 'Barbell_Incline_Bench_Press_-_Medium_Grip'],
    [['press de banca', 'press pecho', 'press de pecho', 'bench press'], 'Barbell_Bench_Press_-_Medium_Grip'],
    [['pullover'], 'Bent-Arm_Dumbbell_Pullover'],
    [['press frances', 'skullcrusher', 'skull crusher'], 'EZ-Bar_Skullcrusher'],
    [['apertura', 'aperturas', 'fly', 'flye', 'cruce', 'cruces'], 'Dumbbell_Flyes'],
    [['curl martillo', 'martillo', 'hammer'], 'Hammer_Curls'],
    [['curl', 'biceps'], 'Barbell_Curl'],
    // ----- ESPALDA / HOMBROS -----
    [['dominada', 'dominadas', 'pull-up', 'pullup', 'pull up'], 'Pullups'],
    [['jalon', 'pulldown'], 'Close-Grip_Front_Lat_Pulldown'],
    [['remo', 'row'], 'Bent_Over_Barbell_Row'],
    [['elevaciones laterales', 'elevacion lateral', 'lateral raise'], 'Side_Lateral_Raise'],
    [['face pull'], 'Face_Pull'],
    [['press militar', 'press de hombro', 'press hombro', 'shoulder press', 'push press', 'overhead press'], 'Barbell_Shoulder_Press'],
    [['triceps', 'pushdown', 'extension de codo'], 'Triceps_Pushdown'],
    [['encogimiento', 'shrug', 'trapecio'], 'Barbell_Shrug'],
    [['superman'], 'Superman'],
    [['good morning', 'buenos dias'], 'Good_Morning'],
    [['hiperextension', 'hyperextension', 'extension de espalda', 'lumbar'], 'Hyperextensions_Back_Extensions'],
    // ----- CROSSFIT / CARDIO / FULL BODY -----
    [['kettlebell swing', 'swing', 'balanceo'], 'One-Arm_Kettlebell_Swings'],
    [['thruster'], 'Kettlebell_Thruster'],
    [['cargada', 'clean'], 'Clean'],
    [['arrancada', 'snatch'], 'Muscle_Snatch'],
    [['mountain climber', 'escalador', 'escaladores'], 'Mountain_Climbers'],
    [['renegade', 'man maker'], 'Alternating_Renegade_Row'],
    // ----- CARDIO / SALTOS -----
    [['tuck jump', 'rodillas al pecho', 'salto de rodillas'], 'Knee_Tuck_Jump'],
    [['jumping jack', 'saltos de tijera', 'saltos de estrella', 'star jump', 'jack'], 'Star_Jump'],
    [['patinador', 'skater', 'esquiador'], 'Side_Hop-Sprint'],
    [['comba', 'cuerda', 'jump rope', 'saltar la cuerda'], 'Rope_Jumping'],
    [['sprint'], 'Wind_Sprints'],
    [['trote', 'correr', 'running', 'jog', 'skipping'], 'Trail_Running_Walking'],
    [['salto', 'saltos', 'jump'], 'Freehand_Jump_Squat']
  ];

  function norm(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var cache = {};
  function folderFor(name) {
    if (name in cache) return cache[name];
    var n = norm(name);
    var folder = '';
    for (var i = 0; i < MAP.length; i++) {
      var kws = MAP[i][0];
      for (var j = 0; j < kws.length; j++) {
        if (n.indexOf(kws[j]) !== -1) { folder = MAP[i][1]; break; }
      }
      if (folder) break;
    }
    cache[name] = folder;
    return folder;
  }

  function get(name) {
    var f = folderFor(name);
    return f ? (BASE + f + '/0.jpg') : '';
  }

  // Las 2 imagenes (inicio y fin del movimiento). [] si no hay match.
  function getPair(name) {
    var f = folderFor(name);
    return f ? [BASE + f + '/0.jpg', BASE + f + '/1.jpg'] : [];
  }

  window.FMPhotos = { get: get, getPair: getPair };
})();
