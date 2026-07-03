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
    // ----- PECHO / BRAZOS -----
    [['diamante', 'diamond', 'flexion cerrada', 'close-grip push'], 'Pushups_Close_and_Wide_Hand_Positions'],
    [['flexion inclinada', 'incline push'], 'Incline_Push-Up'],
    [['flexion declinada', 'decline push'], 'Decline_Push-Up'],
    [['flexion', 'flexiones', 'lagartija', 'pushup', 'push-up', 'push up'], 'Pushups'],
    [['fondo', 'fondos', 'paralelas', 'dip'], 'Bench_Dips'],
    [['press inclinado', 'incline press', 'incline bench'], 'Barbell_Incline_Bench_Press_-_Medium_Grip'],
    [['press de banca', 'press pecho', 'bench press'], 'Barbell_Bench_Press_-_Medium_Grip'],
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
    [['renegade', 'man maker'], 'Alternating_Renegade_Row']
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
  function get(name) {
    if (name in cache) return cache[name];
    var n = norm(name);
    var url = '';
    for (var i = 0; i < MAP.length; i++) {
      var kws = MAP[i][0];
      for (var j = 0; j < kws.length; j++) {
        if (n.indexOf(kws[j]) !== -1) { url = BASE + MAP[i][1] + '/0.jpg'; break; }
      }
      if (url) break;
    }
    cache[name] = url;
    return url;
  }

  window.FMPhotos = { get: get };
})();
