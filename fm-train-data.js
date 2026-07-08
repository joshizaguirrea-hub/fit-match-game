/* ============================================================
 * fm-train-data.js - DATOS del armador de entrenamientos:
 * categorias, mapa muscular, grupos del cuerpo, calentamiento y
 * clasificadores por palabra clave. Datos separados de la logica
 * (que sigue en jugar.html). Namespace: window.FM_TRAIN_DATA.
 * jugar.html rebindea cada uno: const NAME = window.FM_TRAIN_DATA.NAME;
 * ============================================================ */
window.FM_TRAIN_DATA = window.FM_TRAIN_DATA || {};

window.FM_TRAIN_DATA.TRAIN_CATS = [
  { id:'gimnasio',    name:'GIM',                  desc:'Pesas, maquinas y fuerza',  icon:'fa-dumbbell',       c1:'#2563eb', c2:'#1e3a8a', img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80', match:{ cats:['gimnasio'] } },
  { id:'crossfit',    name:'CrossFit',             desc:'WODs intensos estilo box',  icon:'fa-fire',           c1:'#ef4444', c2:'#b91c1c', img:'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=80', match:{ cats:['crossfit','cardio'] } },
  { id:'casa',        name:'Entrenamiento en casa',desc:'Sin equipo, peso corporal', icon:'fa-house',          c1:'#22c55e', c2:'#15803d', img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80', match:{ cats:['casa','calistenia'] } },
  { id:'yoga',        name:'Yoga',                 desc:'Flexibilidad y mente',      icon:'fa-spa',            c1:'#14b8a6', c2:'#0f766e', img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80', match:{ cats:['yoga'] } },
  { id:'pilates',     name:'Pilates',              desc:'Core y control',            icon:'fa-child-reaching', c1:'#ec4899', c2:'#be185d', img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&q=80', match:{ cats:['pilates'] } },
  { id:'hipopresivos',name:'Hipopresivos',         desc:'Suelo pelvico y postura',   icon:'fa-lungs',          c1:'#a855f7', c2:'#7e22ce', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80', match:{ cats:['hipopresivos'] } },
  { id:'tercera',     name:'Tercera Edad',         desc:'Movilidad suave y segura',  icon:'fa-heart',          c1:'#f59e0b', c2:'#b45309', img:'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=900&q=80', match:{ cats:['senior'] } },
  { id:'dioses',      name:'Rutinas Tematicas - Dioses', desc:'9 culturas legendarias', icon:'fa-bolt-lightning', c1:'#7c3aed', c2:'#22d3ee', epic:true, img:'https://images.unsplash.com/photo-1608889175638-9322300c46e6?w=900&q=80', match:{ gods:true } },
];

window.FM_TRAIN_DATA.MUSCLE_LANES = [
  { id:'fullbody', label:'Full Body',                  icon:'fa-person-rays' },
  { id:'pecho',    label:'Brazos & Pecho',             icon:'fa-hand-fist' },
  { id:'espalda',  label:'Espalda, Hombros & Triceps', icon:'fa-child-reaching' },
  { id:'core',     label:'Abdomen / Core',             icon:'fa-fire-flame-curved' },
  { id:'piernas',  label:'Piernas & Gluteos',          icon:'fa-person-walking' },
  { id:'funcional',label:'Funcionales',                icon:'fa-bolt' },
];

window.FM_TRAIN_DATA._MG_KW = {
  piernas:  ['pierna','gluteo','glúteo','sentadilla','zancada','cuadriceps','cuádriceps','femoral','pantorrilla','desplante','tren inferior','peso muerto','pistol'],
  pecho:    ['pecho','flexion','flexión','press de banca','press banca','pectoral','biceps','bíceps','curl'],
  espalda:  ['espalda','dominada','remo','jalon','jalón','triceps','tríceps','hombro','deltoide','fondos','tren superior','pull'],
  core:     ['abdomen','abdominal','core','plancha','oblicuo','crunch','sit-up','v-up','russian','plank','powerhouse'],
  funcional:['crossfit','wod','amrap','emom','hiit','burpee','cardio','salto','funcional','murph','chipper','for time','swing','escalador'],
  fullbody: ['full body','cuerpo completo','full pro','full fuerza','circuito','metabolico','metabólico','total'],
};

window.FM_TRAIN_DATA._FINE_MG = [
  ['triceps',      ['triceps','tríceps','press frances','press francés','press cerrado','patada de codo','patada de tr','extension de codo','extensión de codo','rompecraneos','rompecráneos','copa','jalon de triceps','pushdown','fondos en banco']],
  ['biceps',       ['biceps','bíceps','curl','martillo','predicador','concentrado','antebrazo','muñeca']],
  ['hombros',      ['hombro','deltoide','press militar','press de hombro','press hombro','elevacion lateral','elevación lateral','elevacion frontal','elevación frontal','pajaro','pájaro','arnold','face pull','vuelo']],
  ['pecho',        ['pecho','pectoral','press de banca','press banca','press inclinado','press declinado','flexion','flexión','apertura','pec deck','crossover','pullover','fondos en paralelas','fondos de pecho']],
  ['gluteos',      ['gluteo','glúteo','hip thrust','puente de gluteo','puente de cadera','patada de gluteo','abduccion','abducción','patada de burro']],
  ['pantorrillas', ['pantorrilla','gemelo','talon','talón','soleo','elevacion de talones','elevación de talones']],
  ['piernas',      ['pierna','sentadilla','zancada','cuadriceps','cuádriceps','femoral','desplante','peso muerto','pistol','prensa','extension de pierna','extensión de pierna','tijera','step-up','step up','subida al cajon','subida al cajón','hack','bulgara','búlgara','tren inferior']],
  ['espalda',      ['espalda','dominada','remo','jalon','jalón','pull-up','pullup','pull up','encogimiento','trapecio','superman','buenos dias','buenos días','face','pull','tren superior']],
  ['core',         ['abdomen','abdominal','core','plancha','oblicuo','crunch','sit-up','situp','v-up','vup','russian','plank','elevacion de piernas','elevación de piernas','powerhouse','hollow','toes to bar','rueda abdominal']],
];

window.FM_TRAIN_DATA.BODY_SLUG_GROUP = {
  chest:'pecho',
  biceps:'biceps', forearm:'biceps',
  triceps:'triceps',
  deltoids:'hombros',
  trapezius:'espalda', 'upper-back':'espalda', 'lower-back':'espalda',
  abs:'core', obliques:'core',
  quadriceps:'piernas', adductors:'piernas', knees:'piernas', hamstring:'piernas',
  gluteal:'gluteos', glutes:'gluteos',
  calves:'pantorrillas', tibialis:'pantorrillas',
};

window.FM_TRAIN_DATA.BODY_GROUPS = {
  pecho:{ label:'Pecho', short:'Pecho', color:'#2563eb', icon:'fa-hand-fist' },
  espalda:{ label:'Espalda', short:'Espalda', color:'#f59e0b', icon:'fa-child-reaching' },
  hombros:{ label:'Hombros', short:'Hombros', color:'#06b6d4', icon:'fa-dumbbell' },
  biceps:{ label:'Biceps', short:'Biceps', color:'#ec4899', icon:'fa-hand-fist' },
  triceps:{ label:'Triceps', short:'Triceps', color:'#ef4444', icon:'fa-hand-back-fist' },
  piernas:{ label:'Piernas', short:'Piernas', color:'#22c55e', icon:'fa-person-walking' },
  gluteos:{ label:'Gluteos', short:'Gluteos', color:'#14b8a6', icon:'fa-person-walking' },
  core:{ label:'Abdomen / Core', short:'Core', color:'#a855f7', icon:'fa-fire-flame-curved' },
  pantorrillas:{ label:'Pantorrillas', short:'Pantorrillas', color:'#84cc16', icon:'fa-shoe-prints' },
};

window.FM_TRAIN_DATA.WARMUP_EXERCISES = [
  { name: 'Marcha en el sitio', detail: '40 seg' },
  { name: 'Rotacion de hombros y brazos', detail: '30 seg' },
  { name: 'Rotacion de cadera', detail: '30 seg' },
  { name: 'Sentadillas suaves (movilidad)', detail: '15 rep' },
  { name: 'Jumping jacks suaves', detail: '30 seg' }
];

window.FM_TRAIN_DATA.MUSCLE_GROUPS = {
  pecho:      { label:'Pecho',       icon:'\ud83d\udcaa', exercises:[
    'Flexiones','Flexiones de rodillas','Flexiones inclinadas','Flexiones amplias','Flexiones declinadas',
    'Press de piso con botellas','Aperturas de pecho con botellas','Flexiones Spiderman','Flexiones arquero (Archer)','Cruces de pecho con toallas'
  ]},
  triceps:    { label:'Tr\u00edceps',     icon:'\ud83e\udd3a', exercises:[
    'Fondos en silla','Fondos de triceps cortos (Dips)','Extension de triceps sobre cabeza (botella)','Patada de triceps (kickback)',
    'Press frances con botellas (rompecraneos)','Flexiones diamante','Flexiones cerradas (codos pegados)','Extension de triceps en banco',
    'Flexiones esfinge','Fondos en paralelas (2 sillas)','Extension de triceps a un brazo','Fondos de triceps en el suelo',
    'Patada de triceps con toalla','Extension de triceps tumbado (botella)','Flexiones pseudo planche (triceps)','Fondos isometricos en silla'
  ]},
  biceps:     { label:'B\u00edceps',      icon:'\ud83d\udcaa', exercises:[
    'Curl de biceps con botellas','Curl martillo con botellas','Curl a un brazo','Curl concentrado','Curl con mochila',
    'Isometrico de biceps (toalla)','Dominadas supinas asistidas (chin-ups)','Curl con banda o toalla'
  ]},
  espalda:    { label:'Espalda',     icon:'\ud83e\uddcd', exercises:[
    'Remo con botellas','Remo a un brazo','Superman','Remo invertido (bajo la mesa)','Buenos dias con botella',
    'Pull-over con botella','Dominadas asistidas','Nadador (swimmer)','Remo renegado','Aperturas invertidas (pajaro)'
  ]},
  hombros:    { label:'Hombros',     icon:'\ud83c\udfcb\ufe0f', exercises:[
    'Press militar con botellas','Elevaciones laterales con botellas','Elevaciones frontales con botellas','Flexiones pica (pike push-up)',
    'Flexiones pino asistidas (pared)','Circulos de brazos','Rotacion de hombros','Press Arnold con botellas'
  ]},
  piernas:    { label:'Piernas',     icon:'\ud83e\uddb5', exercises:[
    'Sentadillas','Sentadillas sumo','Zancadas','Zancadas hacia atras','Zancadas laterales','Sentadillas con salto',
    'Sentadillas isometricas (pared)','Sentadilla bulgara','Step-ups (subir a la silla)','Sentadilla profunda','Zancada caminando'
  ]},
  gluteos:    { label:'Gl\u00fateos',     icon:'\ud83c\udf51', exercises:[
    'Puente de gluteos','Puente a una pierna','Patada de gluteo','Patada de burro','Abduccion de cadera (tumbado)','Hip thrust con botella'
  ]},
  pantorrilla:{ label:'Pantorrillas',icon:'\ud83e\uddb6', exercises:[
    'Elevacion de talones','Elevacion de talones a una pierna','Saltos en el sitio','Elevacion de talones (escalon)'
  ]},
  core:       { label:'Abdomen/Core',icon:'\ud83d\udd25', exercises:[
    'Plancha','Plancha lateral','Abdominales cortos (crunch)','Abdominales bicicleta','Elevacion de piernas','Giros rusos',
    'Bird-dog','Dead bug','Hollow hold','Tijeras (abdomen)','Mountain climbers','Escaladores'
  ]},
  cardio:     { label:'Cardio',      icon:'\u26a1', exercises:[
    'Burpees','Saltos de tijera (jumping jacks)','Correr en el sitio (rodillas altas)','Saltos de estrella','Talones al gluteo','Patinador (skater jumps)'
  ]}
};

window.FM_TRAIN_DATA.MUSCLE_DETECT_ORDER = ['triceps','biceps','hombros','espalda','gluteos','pantorrilla','cardio','core','piernas','pecho'];

window.FM_TRAIN_DATA.MUSCLE_KEYWORDS = {
  triceps:    ['triceps','fondo','dip','rompecraneo','press frances','patada de triceps','diamante','cerrad','esfinge','sphinx','pushdown','paralel'],
  biceps:     ['biceps','curl','martillo','chin-up','chin up','dominada supina'],
  hombros:    ['hombro','press militar','elevacion lateral','elevaciones laterales','elevacion frontal','elevaciones frontales','pike','pica','pino','handstand','press arnold','circulo de brazo','circulos de brazo','arnold'],
  espalda:    ['remo','superman','dominada','pull-over','pullover','jalon','buenos dias','nadador','swimmer','pull-up','pull up','pajaro'],
  gluteos:    ['gluteo','puente','hip thrust','patada de burro','burro','abduccion','cadera'],
  pantorrilla:['talon','pantorrilla','gemelo'],
  cardio:     ['burpee','jumping jack','saltos de tijera','saltos de estrella','rodillas altas','correr','trote','skater','patinador','high knee','talones al gluteo','saltos en el sitio','saltos de estrella'],
  core:       ['plancha','plank','abdominal','crunch','bicicleta','giros rusos','russian','bird-dog','bird dog','dead bug','mountain climber','escalador','hollow','tijera','elevacion de pierna','oblicuo','v-up','abdomen'],
  piernas:    ['sentadilla','zancada','lunge','pierna','cuadriceps','step-up','step up','bulgara','pistol','wall sit','subir a la silla'],
  pecho:      ['flexion','push-up','push up','pecho','apertura','press de piso','press pecho','press de banca','cruce','spiderman','archer','arquero']
};
