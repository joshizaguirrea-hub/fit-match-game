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
    // ============================================================
    // MOVILIDAD / ESTIRAMIENTOS / POSTURAS (categoria 'stretching' de
    // free-exercise-db). Imagenes REALES y relevantes para yoga suave,
    // hipopresivos, suelo pelvico, cuello/hombros, columna, etc.
    // ============================================================
    [['stomach vacuum', 'vacio abdominal', 'activacion transverso', 'transverso', 'core hipopresivo', 'respiracion hipopresiva', 'abdominal hollowing', 'vacuum', 'diastasis'], 'Stomach_Vacuum'],
    [['suelo pelvico', 'piso pelvico', 'pelvic floor', 'conexion con el suelo', 'conexion pelvica'], 'Stomach_Vacuum'],
    [['pelvic tilt', 'inclinacion pelvica', 'basculacion pelvica', 'neutral spine', 'columna neutra', 'imprint', 'rib cage', 'postura base supina', 'posicion base cuadrupeda', 'cuadrupeda', 'cuadrupedia', 'neutral'], 'Standing_Pelvic_Tilt'],
    [['postura del nino', 'child', 'balasana', 'esfinge', 'sphinx'], 'Childs_Pose'],
    [['cobra', 'locust', 'langosta', 'camello', 'swan', 'esfinge'], 'One_Half_Locust'],
    [['rodillas al pecho', 'rodilla al pecho', 'knee to chest', 'knees to chest', 'hug knees', 'hug a ball'], 'Hug_Knees_To_Chest'],
    [['giro de columna', 'twist de columna', 'spine twist', 'giro de tronco', 'giros de tronco', 'rotacion toracica', 'torso rotation', 'rotacion de tronco', 'giros suaves de tronco', 'giros de cadera y tronco', 'giro suave de columna', 'twist'], 'Torso_Rotation'],
    [['forward fold', 'doblez hacia adelante', 'toe touch', 'toque de punta', 'flexion hacia adelante', 'forward bend', 'standing toe'], 'Standing_Toe_Touches'],
    [['estiramiento de columna', 'spine stretch', 'spinal', 'columna'], 'Spinal_Stretch'],
    [['brazos al cielo', 'brazos arriba', 'overhead stretch', 'estiramiento hacia arriba', 'upward stretch', 'estiramiento al cielo', 'estiramiento de brazos'], 'Overhead_Stretch'],
    [['circulos de cuello', 'rotacion de cuello', 'neck roll', 'head nod', 'inclinacion de barbilla', 'cuello lateral', 'estiramiento de cuello', 'circulos de cuello y hombros'], 'Neck-SMR'],
    [['circulos de hombro', 'rotacion de hombros', 'shoulder roll', 'shoulder circle', 'movimientos de brazos', 'elevacion de brazos', 'circulos de hombros'], 'Shoulder_Circles'],
    [['circulos de muneca', 'wrist circle', 'muneca'], 'Wrist_Circles'],
    [['circulos de tobillo', 'ankle circle', 'tobillo'], 'Ankle_Circles'],
    [['circulos de cadera', 'rotacion de cadera', 'hip circle'], 'Standing_Hip_Circles'],
    [['side bend', 'inclinacion lateral', 'estiramiento lateral', 'mermaid', 'lateral de tronco', 'inclinacion lateral de tronco'], 'Standing_Lateral_Stretch'],
    [['estiramiento de cuadriceps', 'quad stretch', 'cuadriceps por lado'], 'Quad_Stretch'],
    [['patada de gluteo', 'donkey kick', 'gluteo en cuadrupedia', 'gluteo en polea', 'glute kickback', 'patadas de gluteo'], 'Glute_Kickback'],
    [['gluteo una pierna', 'single leg glute', 'puente de gluteo una', 'puentos de gluteo una'], 'Single_Leg_Glute_Bridge'],
    [['pajaros', 'deltoide posterior', 'brazos en t', 'reverse fly', 'aperturas invertidas'], 'Reverse_Machine_Flyes'],
    [['molino', 'windmill'], 'Windmills'],
    [['split', 'straddle', 'apertura de piernas', 'spagat'], 'The_Straddle'],
    [['sentarse y levantarse', 'sit to stand', 'pararse de la silla', 'utkatasana', 'sit squat'], 'Sit_Squats'],
    [['extension de rodilla sentado', 'extensiones de cuadriceps', 'extension de cuadriceps', 'leg extension'], 'Chair_Leg_Extended_Stretch'],
    [['bird-dog', 'bird dog', 'perro-pajaro', 'perro pajaro'], 'Pelvic_Tilt_Into_Bridge'],
    [['clamshell', 'clams', 'almeja', 'ostra'], 'Lying_Glute'],
    [['press cerrado en banca', 'press cerrado'], 'Close-Grip_Barbell_Bench_Press'],
    [['press push', 'push press'], 'Barbell_Shoulder_Press'],
    // ----- CARDIO / MARCHA / CAMINATA (movimientos de pie a ritmo) -----
    [['marcha', 'high knee', 'high-knee', 'rodillas altas', 'rodillas arriba', 'skipping alto', 'rodillas al pecho de pie'], 'Trail_Running_Walking'],
    [['caminata'], 'Trail_Running_Walking'],
    // ----- RESPIRACION / HIPOPRESIVOS (vacio abdominal es el gesto base) -----
    [['respiracion', 'apnea', 'breathing', 'diafragmatica', 'costal', 'respiratoria', 'respiratorio'], 'Stomach_Vacuum'],
    // ----- CALISTENIA AVANZADA (skills de barra/anillas -> imagen afin) -----
    [['dragon flag'], 'Flat_Bench_Lying_Leg_Raise'],
    [['muscle up', 'muscle-up', 'kip up', 'kip ups', 'kip variations'], 'Pullups'],
    [['l-sit', 'l sit', 'front lever', 'back lever', 'human flag', 'iron cross', 'maltese', 'planche', '360 en barra', '540', 'forearm stand', 'headstand'], 'Hanging_Pike'],
    // ----- ESCAPULAS / PUENTES especificos -----
    [['retraccion de escapula', 'retraccion escapular', 'scapular', 'escapula'], 'Face_Pull'],
    [['shoulder bridge', 'puente de hombro'], 'Barbell_Glute_Bridge'],
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

  // ============================================================
  // FALLBACK POR DISCIPLINA: para poses de yoga/pilates/respiracion/
  // relajacion/baile/balance que NO existen como movimiento propio en
  // free-exercise-db, mostramos una imagen REAL y TEMATICA (misma fuente,
  // mismo estilo animado). Se elige de forma determinista por el nombre
  // (hash) para dar VARIEDAD dentro de una misma disciplina.
  // ============================================================
  var POOLS = {
    yoga:    ['Childs_Pose', 'One_Half_Locust', 'The_Straddle', 'Dancers_Stretch', 'Pyramid', 'Upper_Back-Leg_Grab', 'Spinal_Stretch', 'Runners_Stretch'],
    pilates: ['Stomach_Vacuum', 'Hug_Knees_To_Chest', 'Flat_Bench_Lying_Leg_Raise', 'Scissor_Kick', 'Flutter_Kicks', 'Air_Bike', 'Russian_Twist', 'Pelvic_Tilt_Into_Bridge'],
    relax:   ['Childs_Pose', 'Seated_Floor_Hamstring_Stretch', 'Chair_Lower_Back_Stretch', 'Overhead_Stretch', 'Spinal_Stretch', 'Hug_Knees_To_Chest'],
    balance: ['Front_Leg_Raises', 'Side_Leg_Raises', 'Rear_Leg_Raises', 'Standing_Hip_Circles'],
    dance:   ['Star_Jump', 'Trail_Running_Walking', 'Rope_Jumping', 'Bodyweight_Walking_Lunge'],
    def:     ['Torso_Rotation', 'Standing_Lateral_Stretch', 'Spinal_Stretch', 'Shoulder_Circles', 'Overhead_Stretch']
  };
  // Orden IMPORTA: pilates antes que yoga ('single leg', 'roll'...).
  var DISC = [
    ['pilates', ['hundred', 'teaser', 'roll up', 'roll over', 'rolling', 'saw', 'corkscrew', 'criss cross', 'single leg', 'double leg', 'double straight', 'scissors', 'side kick', 'side lying', 'boomerang', 'rocking boat', 'mat completo', 'long stretch', 'pilates', 'footwork', 'knee stretches', 'control balance', 'core power', 'standing series', 'wall roll', 'spine stretch', 'elephant']],
    ['relax',   ['savasana', 'relajacion', 'descanso', 'enfriamiento', 'calentamiento', 'final stretch', 'integracion funcional', 'visualizacion', 'consciente', 'recuperacion', 'recuperativa']],
    ['yoga',    ['yoga', 'saludo al sol', 'guerrero', 'warrior', 'arbol', 'tree', 'perro boca abajo', 'downward', 'pigeon', 'paloma', 'navasana', 'natarajasana', 'garuda', 'eagle', 'mayurasana', 'peacock', 'half moon', 'media luna', 'wheel', 'urdhva', 'dhanurasana', ' pose', 'asana', 'flamingo', 'inversion', 'flow', 'piernas arriba la pared', 'eight-angle', 'king pigeon', 'dancer']],
    ['dance',   ['coreografia', 'baile', 'pasos', 'paso lateral', 'paso al frente', 'toques laterales']],
    ['balance', ['pararse en un pie', 'balance', 'alineacion', 'standing alignment', 'equilibrio', 'postural', 'apoyo']]
  ];
  function disciplineFor(n) {
    for (var i = 0; i < DISC.length; i++) {
      var kws = DISC[i][1];
      for (var j = 0; j < kws.length; j++) {
        if (n.indexOf(kws[j]) !== -1) return DISC[i][0];
      }
    }
    return 'def';
  }
  function hashPick(name, arr) {
    var h = 0;
    for (var i = 0; i < name.length; i++) { h = ((h << 5) - h + name.charCodeAt(i)) | 0; }
    return arr[Math.abs(h) % arr.length];
  }
  // Carpeta final: match exacto -> fallback tematico por disciplina.
  function resolveFolder(name) {
    var f = folderFor(name);
    if (f) return f;
    var n = norm(name);
    var pool = POOLS[disciplineFor(n)] || POOLS.def;
    return hashPick(n, pool);
  }

  function get(name) {
    var f = resolveFolder(name);
    return f ? (BASE + f + '/0.jpg') : '';
  }

  // Las 2 imagenes (inicio y fin del movimiento). Con fallback tematico
  // por disciplina, SIEMPRE devuelve un par (nunca icono).
  function getPair(name) {
    var f = resolveFolder(name);
    return f ? [BASE + f + '/0.jpg', BASE + f + '/1.jpg'] : [];
  }

  // exactMatch: true si hubo match por palabra clave (no fallback). Util
  // para debugging/auditoria desde consola.
  window.FMPhotos = { get: get, getPair: getPair, exactMatch: function (n) { return !!folderFor(n); } };
})();
