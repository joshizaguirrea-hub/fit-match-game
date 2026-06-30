/* ============================================================
   Fit Match · Rutinas Especializadas Modernas
   ------------------------------------------------------------
   Nuevas categorías de entrenamiento:
   - Gimnasio (con pesas/máquinas)
   - Yoga (flexibilidad y mindfulness)
   - Pilates (core y estabilidad)
   - Cardio (resistencia cardiovascular)
   - Calistenia (peso corporal avanzado)
   ============================================================ */

const FM_SPECIALIZED_ROUTINES = [
  // ============================================================
  // === CROSSFIT (WODs intensos estilo box) ===
  // ============================================================
  {
    id:"cf_tormenta", name:"Tormenta Inicial", category:"crossfit", level:"básico", points:20, rounds:5,
    description:"Tu primer WOD estilo CrossFit. 5 rondas a tu ritmo (AMRAP suave). Pura adrenalina sin equipo.",
    equipment:["Peso corporal"],
    exercises:[
      { name:"Sentadillas al aire (Air Squats)", reps:10 },
      { name:"Flexiones", reps:8 },
      { name:"Abdominales (Sit-ups)", reps:10 },
      { name:"Saltos de tijera (Jumping Jacks)", reps:20 },
      { name:"Plancha (segundos)", reps:30 }
    ]
  },
  {
    id:"cf_huracan", name:"Huracán", category:"crossfit", level:"intermedio", points:30, rounds:4,
    description:"WOD 'For Time': completa las 4 rondas lo más rápido posible con buena técnica. ¡Que ruja la tormenta!",
    equipment:["Peso corporal","Mochila"],
    exercises:[
      { name:"Burpees", reps:12 },
      { name:"Sentadillas con salto", reps:15 },
      { name:"Swing con mochila (kettlebell)", reps:15 },
      { name:"Escaladores (Mountain Climbers)", reps:30 },
      { name:"Zancadas con salto alternas", reps:16 },
      { name:"Abdominales V (V-ups)", reps:12 }
    ]
  },
  {
    id:"cf_infierno", name:"Infierno", category:"crossfit", level:"avanzado", points:40, rounds:5,
    description:"AMRAP demoledor de 5 rondas. Cardio y fuerza al limite. Solo para los que no le temen al fuego.",
    equipment:["Peso corporal","Barra de dominadas"],
    exercises:[
      { name:"Burpees con salto", reps:15 },
      { name:"Dominadas (o jalón)", reps:10 },
      { name:"Sentadillas pistol asistidas", reps:10 },
      { name:"Flexiones explosivas", reps:12 },
      { name:"Saltos al cajón (step-up explosivo)", reps:16 },
      { name:"Abdominales toes-to-bar (o rodillas)", reps:12 }
    ]
  },
  {
    id:"cf_titan", name:"El Títan (estilo Murph)", category:"crossfit", level:"espartano", points:55, rounds:1,
    description:"Homenaje al legendario Murph. Un solo asalto monumental de alto volumen. Domina tu mente y tu cuerpo.",
    equipment:["Peso corporal","Barra de dominadas"],
    exercises:[
      { name:"Trote/correr en sitio (segundos)", reps:120 },
      { name:"Dominadas totales", reps:50 },
      { name:"Flexiones totales", reps:100 },
      { name:"Sentadillas al aire totales", reps:150 },
      { name:"Trote/correr en sitio (segundos)", reps:120 }
    ]
  },
  {
    id:"cf_relampago", name:"Relámpago (AMRAP 12)", category:"crossfit", level:"intermedio", points:30, rounds:4,
    description:"AMRAP rápido y explosivo. Tantas rondas como puedas con energia de rayo. Corto pero intenso.",
    equipment:["Peso corporal"],
    exercises:[
      { name:"Burpees", reps:10 },
      { name:"Sentadillas al aire", reps:15 },
      { name:"Flexiones", reps:10 },
      { name:"Abdominales bicicleta", reps:20 }
    ]
  },
  {
    id:"cf_coloso", name:"Coloso", category:"crossfit", level:"avanzado", points:40, rounds:5,
    description:"WOD de fuerza-resistencia con mochila cargada. Forja un cuerpo de coloso. ¡Sin rendirse!",
    equipment:["Mochila","Peso corporal"],
    exercises:[
      { name:"Thrusters con mochila (sentadilla+press)", reps:15 },
      { name:"Swing con mochila", reps:20 },
      { name:"Burpees sobre mochila", reps:12 },
      { name:"Zancadas caminando con mochila", reps:20 },
      { name:"Remo con mochila", reps:15 },
      { name:"Plancha con toque de hombro", reps:20 }
    ]
  },
  // ============================================================
  // === TERCERA EDAD (adultos mayores: bajo impacto y seguro) ===
  // ============================================================
  {
    id:"senior_vitalidad", name:"Vitalidad Dorada", category:"senior", level:"básico", points:12, rounds:2,
    description:"Rutina suave para activar todo el cuerpo desde una silla. Ideal para empezar el dia con energia.",
    equipment:["Silla"],
    exercises:[
      { name:"Marcha sentado (rodillas arriba)", reps:20 },
      { name:"Extensión de rodilla sentado", reps:12 },
      { name:"Elevación de brazos al frente", reps:12 },
      { name:"Giros suaves de tronco sentado", reps:12 },
      { name:"Círculos de tobillo (por pie)", reps:10 }
    ]
  },
  {
    id:"senior_equilibrio", name:"Equilibrio Firme", category:"senior", level:"básico", points:12, rounds:2,
    description:"Mejora el equilibrio y previene caidas. Hazla cerca de una pared o silla para apoyarte.",
    equipment:["Silla","Pared"],
    exercises:[
      { name:"Pararse en un pie con apoyo (segundos)", reps:15 },
      { name:"Caminar punta-talón (pasos)", reps:12 },
      { name:"Elevación de talones con apoyo", reps:12 },
      { name:"Elevación lateral de pierna con apoyo", reps:10 },
      { name:"Sentarse y levantarse de la silla", reps:10 }
    ]
  },
  {
    id:"senior_movilidad", name:"Movilidad Suave", category:"senior", level:"básico", points:12, rounds:2,
    description:"Estira y lubrica las articulaciones. Reduce rigidez y mejora el rango de movimiento.",
    equipment:["Silla"],
    exercises:[
      { name:"Rotación de cuello suave", reps:8 },
      { name:"Círculos de hombros", reps:12 },
      { name:"Estiramiento de brazos arriba", reps:10 },
      { name:"Inclinación lateral de tronco sentado", reps:10 },
      { name:"Estiramiento suave de pantorrilla", reps:10 }
    ]
  },
  {
    id:"senior_fuerza", name:"Fuerza Suave", category:"senior", level:"básico", points:14, rounds:2,
    description:"Mantiene la masa muscular con movimientos seguros y botellas de agua ligeras como peso.",
    equipment:["Silla","Botellas de agua"],
    exercises:[
      { name:"Sentarse y levantarse de la silla", reps:10 },
      { name:"Curl de bíceps con botellas", reps:12 },
      { name:"Press de hombros suave con botellas", reps:10 },
      { name:"Extensión de rodilla sentado", reps:12 },
      { name:"Puente de glúteo suave en cama/suelo", reps:10 }
    ]
  },
  {
    id:"senior_circulacion", name:"Circulación Activa", category:"senior", level:"básico", points:12, rounds:2,
    description:"Cardio muy suave para activar la circulacion y el corazon, sin impacto en las articulaciones.",
    equipment:["Silla"],
    exercises:[
      { name:"Marcha sentado o de pie con apoyo (segundos)", reps:40 },
      { name:"Toques de talón al frente", reps:20 },
      { name:"Aperturas de brazos suaves", reps:15 },
      { name:"Marcha con balanceo de brazos (segundos)", reps:30 },
      { name:"Respiración profunda con brazos arriba", reps:8 }
    ]
  },
  // ============================================================
  // === GIMNASIO PRO (divisiones modernas por grupo muscular) ===
  // ============================================================
  {
    id:"gym_pecho_biceps", name:"Pecho y Bíceps", category:"gimnasio", level:"intermedio", points:25, rounds:3,
    description:"Día clásico de empuje de pecho combinado con bíceps. Volumen e hipertrofia para tren superior.",
    equipment:["Barra","Mancuernas","Banco","Polea"],
    exercises:[
      { name:"Press de banca con barra", reps:10 },
      { name:"Press inclinado con mancuernas", reps:12 },
      { name:"Aperturas en polea (cruces)", reps:15 },
      { name:"Curl de bíceps con barra", reps:10 },
      { name:"Curl alterno con mancuernas", reps:12 },
      { name:"Curl martillo", reps:12 }
    ]
  },
  {
    id:"gym_espalda_triceps", name:"Espalda y Tríceps", category:"gimnasio", level:"intermedio", points:25, rounds:3,
    description:"Tracción de espalda potente más tríceps. Construye una espalda ancha y brazos fuertes.",
    equipment:["Barra","Polea","Mancuernas"],
    exercises:[
      { name:"Dominadas (o jalón al pecho)", reps:10 },
      { name:"Remo con barra", reps:10 },
      { name:"Remo en polea sentado", reps:12 },
      { name:"Extensiones de tríceps en polea", reps:15 },
      { name:"Press francés con barra Z", reps:12 },
      { name:"Fondos en banco", reps:12 }
    ]
  },
  {
    id:"gym_pierna_gluteo", name:"Pierna y Glúteo", category:"gimnasio", level:"intermedio", points:25, rounds:3,
    description:"Tren inferior completo con foco en cuádriceps, femoral y glúteo. El día que no debes saltarte.",
    equipment:["Barra","Prensa","Máquina"],
    exercises:[
      { name:"Sentadilla con barra", reps:10 },
      { name:"Peso muerto rumano", reps:10 },
      { name:"Prensa de piernas", reps:12 },
      { name:"Hip thrust con barra", reps:12 },
      { name:"Zancadas con mancuernas", reps:12 },
      { name:"Elevación de talones (gemelos)", reps:20 }
    ]
  },
  {
    id:"gym_hombro_core", name:"Hombros y Core", category:"gimnasio", level:"intermedio", points:25, rounds:3,
    description:"Hombros 3D y un core de acero. Mejora postura y estabilidad.",
    equipment:["Mancuernas","Barra","Polea"],
    exercises:[
      { name:"Press militar con barra", reps:10 },
      { name:"Elevaciones laterales", reps:15 },
      { name:"Pájaros (deltoide posterior)", reps:15 },
      { name:"Encogimientos para trapecio", reps:15 },
      { name:"Plancha abdominal (segundos)", reps:45 },
      { name:"Crunch en polea", reps:15 }
    ]
  },
  {
    id:"gym_push_hipertrofia", name:"Push Hipertrofia", category:"gimnasio", level:"avanzado", points:35, rounds:4,
    description:"Empuje avanzado (pecho, hombro, tríceps) con alto volumen para máxima hipertrofia.",
    equipment:["Barra","Mancuernas","Polea"],
    exercises:[
      { name:"Press de banca con barra", reps:8 },
      { name:"Press inclinado con mancuernas", reps:10 },
      { name:"Press militar de pie", reps:8 },
      { name:"Elevaciones laterales", reps:15 },
      { name:"Cruces en polea", reps:15 },
      { name:"Extensión de tríceps en polea", reps:15 }
    ]
  },
  {
    id:"gym_pull_hipertrofia", name:"Pull Hipertrofia", category:"gimnasio", level:"avanzado", points:35, rounds:4,
    description:"Tracción avanzada (espalda y bíceps) con alto volumen. Espalda densa y ancha.",
    equipment:["Barra","Polea","Mancuernas"],
    exercises:[
      { name:"Dominadas lastradas", reps:8 },
      { name:"Remo con barra", reps:8 },
      { name:"Jalón al pecho", reps:12 },
      { name:"Remo en polea", reps:12 },
      { name:"Curl con barra", reps:10 },
      { name:"Curl martillo", reps:12 }
    ]
  },
  {
    id:"gym_pierna_avanzada", name:"Pierna Avanzada", category:"gimnasio", level:"avanzado", points:35, rounds:4,
    description:"Día de pierna brutal para atletas serios. Fuerza, masa y resistencia.",
    equipment:["Barra","Prensa","Máquina"],
    exercises:[
      { name:"Sentadilla profunda con barra", reps:8 },
      { name:"Peso muerto convencional", reps:6 },
      { name:"Prensa de piernas pesada", reps:12 },
      { name:"Zancadas búlgaras", reps:10 },
      { name:"Curl femoral", reps:15 },
      { name:"Elevación de gemelos", reps:20 }
    ]
  },
  {
    id:"gym_brazos_bombazo", name:"Brazos · Bíceps y Tríceps", category:"gimnasio", level:"intermedio", points:25, rounds:3,
    description:"Bombeo total de brazos. Superseries de bíceps y tríceps para llenar la manga.",
    equipment:["Mancuernas","Barra Z","Polea"],
    exercises:[
      { name:"Curl con barra Z", reps:12 },
      { name:"Press francés", reps:12 },
      { name:"Curl alterno con mancuernas", reps:12 },
      { name:"Extensión de tríceps en polea", reps:15 },
      { name:"Curl martillo", reps:12 },
      { name:"Fondos en banco", reps:15 }
    ]
  },
  {
    id:"gym_full_fuerza", name:"Full Body Fuerza", category:"gimnasio", level:"avanzado", points:35, rounds:4,
    description:"Fuerza pura full body con básicos compuestos. Para ganar fuerza real.",
    equipment:["Barra","Mancuernas"],
    exercises:[
      { name:"Sentadilla con barra", reps:6 },
      { name:"Press de banca con barra", reps:6 },
      { name:"Peso muerto", reps:5 },
      { name:"Press militar", reps:6 },
      { name:"Remo con barra", reps:8 },
      { name:"Plancha (segundos)", reps:45 }
    ]
  },
  // ============================================================
  // === EN CASA (mismas divisiones, sin gimnasio) ===
  // ============================================================
  {
    id:"casa_pecho_brazos", name:"Pecho y Brazos en Casa", category:"casa", level:"básico", points:15, rounds:3,
    description:"Empuje y brazos sin gimnasio, solo tu cuerpo y una silla. Pecho, hombro y tríceps.",
    equipment:["Peso corporal","Silla"],
    exercises:[
      { name:"Flexiones clásicas", reps:12 },
      { name:"Flexiones inclinadas", reps:12 },
      { name:"Fondos en silla", reps:12 },
      { name:"Flexiones diamante", reps:8 },
      { name:"Pike push-ups (hombro)", reps:10 },
      { name:"Plancha (segundos)", reps:40 }
    ]
  },
  {
    id:"casa_espalda_biceps", name:"Espalda y Bíceps en Casa", category:"casa", level:"básico", points:15, rounds:3,
    description:"Tracción en casa con una mochila o botellas. Espalda y bíceps sin máquinas.",
    equipment:["Mochila/botellas","Mesa"],
    exercises:[
      { name:"Remo con mochila a una mano", reps:12 },
      { name:"Curl con botellas/mochila", reps:12 },
      { name:"Superman (espalda baja)", reps:15 },
      { name:"Remo invertido bajo una mesa", reps:10 },
      { name:"Curl martillo con botellas", reps:12 },
      { name:"Bird-dog", reps:12 }
    ]
  },
  {
    id:"casa_pierna_gluteo", name:"Pierna y Glúteo en Casa", category:"casa", level:"intermedio", points:25, rounds:3,
    description:"Quema piernas y glúteo en casa, sin equipo. Sentadillas y puentes a tope.",
    equipment:["Peso corporal","Silla"],
    exercises:[
      { name:"Sentadillas", reps:20 },
      { name:"Zancadas alternas", reps:16 },
      { name:"Puente de glúteo", reps:20 },
      { name:"Sentadilla búlgara (silla)", reps:12 },
      { name:"Puente a una pierna", reps:12 },
      { name:"Sentadilla isométrica en pared (segundos)", reps:45 }
    ]
  },
  {
    id:"casa_tren_superior", name:"Tren Superior en Casa", category:"casa", level:"intermedio", points:25, rounds:3,
    description:"Todo el tren superior en casa: pecho, espalda, hombro y brazos con tu peso.",
    equipment:["Peso corporal","Silla","Mochila"],
    exercises:[
      { name:"Flexiones", reps:15 },
      { name:"Remo con mochila", reps:12 },
      { name:"Pike push-ups", reps:10 },
      { name:"Fondos en silla", reps:12 },
      { name:"Curl con mochila", reps:12 },
      { name:"Plancha lateral (por lado, segundos)", reps:30 }
    ]
  },
  {
    id:"casa_full_body", name:"Full Body en Casa", category:"casa", level:"básico", points:15, rounds:3,
    description:"Cuerpo completo en casa, sin equipo. Perfecta para empezar o días con poco tiempo.",
    equipment:["Peso corporal"],
    exercises:[
      { name:"Sentadillas", reps:15 },
      { name:"Flexiones", reps:12 },
      { name:"Zancadas alternas", reps:12 },
      { name:"Plancha (segundos)", reps:40 },
      { name:"Puente de glúteo", reps:15 },
      { name:"Jumping jacks", reps:30 }
    ]
  },
  {
    id:"casa_core", name:"Core de Acero en Casa", category:"casa", level:"básico", points:15, rounds:3,
    description:"Abdomen y core completo en casa. Estabilidad, fuerza y definición.",
    equipment:["Peso corporal"],
    exercises:[
      { name:"Plancha (segundos)", reps:45 },
      { name:"Crunch abdominal", reps:20 },
      { name:"Elevación de piernas", reps:15 },
      { name:"Bicicleta abdominal", reps:24 },
      { name:"Plancha lateral (por lado, segundos)", reps:30 },
      { name:"Mountain climbers", reps:30 }
    ]
  },
  // ============================================================
  // === GIMNASIO [10 RUTINAS] ===
  // ============================================================
  {
    id: "gym_basico_fullbody", name: "Full Body Básico", category: "gimnasio", level: "básico", points: 15, rounds: 3,
    description: "Rutina completa de gimnasio para principiantes. Trabaja todos los grupos musculares principales.",
    equipment: ["Mancuernas", "Banco plano", "Máquina de poleas"],
    exercises: [
      { name: "Press de banca con mancuernas", reps: 12 },
      { name: "Sentadilla con mancuernas", reps: 12 },
      { name: "Remo con mancuerna a una mano", reps: 10 },
      { name: "Press militar con mancuernas", reps: 10 },
      { name: "Curl de bíceps con mancuernas", reps: 12 },
      { name: "Extensiones de tríceps en polea", reps: 12 }
    ]
  },
  {
    id: "gym_basico_push", name: "Push Básico", category: "gimnasio", level: "básico", points: 15, rounds: 3,
    description: "Enfoque en empuje: pecho, hombros y tríceps. Ideal para construir fuerza en la parte superior.",
    equipment: ["Máquina de press", "Mancuernas", "Banco inclinado"],
    exercises: [
      { name: "Press de pecho en máquina", reps: 12 },
      { name: "Press de hombros con mancuernas", reps: 10 },
      { name: "Fondos en paralelas asistidos", reps: 10 },
      { name: "Elevaciones laterales con mancuernas", reps: 12 },
      { name: "Extensiones de tríceps en banco", reps: 12 },
      { name: "Press pecho inclinado con mancuernas", reps: 10 }
    ]
  },
  {
    id: "gym_intermedio_legs", name: "Leg Day Intermedio", category: "gimnasio", level: "intermedio", points: 25, rounds: 3,
    description: "Día de piernas intenso para construir fuerza y masa muscular en tren inferior.",
    equipment: ["Barra", "Máquina de prensa", "Mancuernas"],
    exercises: [
      { name: "Sentadilla con barra", reps: 10 },
      { name: "Prensa de piernas", reps: 12 },
      { name: "Peso muerto rumano con barra", reps: 10 },
      { name: "Extensiones de cuádriceps", reps: 15 },
      { name: "Curl femoral en máquina", reps: 12 },
      { name: "Elevación de talones de pie", reps: 20 }
    ]
  },
  {
    id: "gym_intermedio_pull", name: "Pull Intermedio", category: "gimnasio", level: "intermedio", points: 25, rounds: 3,
    description: "Enfoque en tracción: espalda y bíceps. Para una espalda fuerte y definida.",
    equipment: ["Barra", "Máquina de poleas", "Mancuernas"],
    exercises: [
      { name: "Dominadas asistidas en máquina", reps: 10 },
      { name: "Remo con barra", reps: 10 },
      { name: "Jalón al pecho en polea", reps: 12 },
      { name: "Remo en máquina", reps: 12 },
      { name: "Curl de bíceps con barra", reps: 10 },
      { name: "Face pull en polea", reps: 15 }
    ]
  },
  {
    id: "gym_avanzado_hypertrophy", name: "Hipertrofia Avanzada", category: "gimnasio", level: "avanzado", points: 40, rounds: 4,
    description: "Rutina de volumen para maximizar el crecimiento muscular con técnicas avanzadas.",
    equipment: ["Barra", "Mancuernas", "Máquinas variadas"],
    exercises: [
      { name: "Press de banca con barra (drop set)", reps: 10 },
      { name: "Sentadilla frontal con barra", reps: 8 },
      { name: "Remo con barra (técnica cheat)", reps: 10 },
      { name: "Press inclinado con mancuernas", reps: 12 },
      { name: "Peso muerto convencional", reps: 6 },
      { name: "Superserie: curl + extensiones", reps: "15 cada uno" }
    ]
  },
  {
    id: "gym_avanzado_strength", name: "Fuerza Pura Avanzado", category: "gimnasio", level: "avanzado", points: 40, rounds: 4,
    description: "Entrenamiento de fuerza máxima con cargas pesadas y pocas repeticiones.",
    equipment: ["Barra olímpica", "Rack", "Platos"],
    exercises: [
      { name: "Press de banca 5x5", reps: 5 },
      { name: "Sentadilla 5x5", reps: 5 },
      { name: "Peso muerto 3x5", reps: 5 },
      { name: "Press militar 5x5", reps: 5 },
      { name: "Remo con barra 5x5", reps: 5 },
      { name: "Peso muerto rumano 3x8", reps: 8 }
    ]
  },
  {
    id: "gym_espartano_legs", name: "Leg Day Espartano", category: "gimnasio", level: "espartano", points: 60, rounds: 4,
    description: "El día de piernas más brutal. Solo para los más valientes.",
    equipment: ["Barra", "Prensa", "Mancuernas pesadas"],
    exercises: [
      { name: "Sentadilla con barra (pesado)", reps: 6 },
      { name: "Prensa de piernas (drop set)", reps: 20 },
      { name: "Peso muerto convencional", reps: 5 },
      { name: "Zancadas búlgaras con mancuernas", reps: 10 },
      { name: "Curl femoral y cuádriceps (superserie)", reps: "15 cada uno" },
      { name: "Elevación de talones con peso", reps: 30 }
    ]
  },
  {
    id: "gym_espartano_fullbody", name: "Full Body Espartano", category: "gimnasio", level: "espartano", points: 60, rounds: 4,
    description: "Rutina completa de alta intensidad para atletas élite.",
    equipment: ["Barra", "Máquinas", "Mancuernas"],
    exercises: [
      { name: "Press de banca con barra", reps: 8 },
      { name: "Sentadilla con barra", reps: 8 },
      { name: "Peso muerto", reps: 6 },
      { name: "Remo con barra", reps: 8 },
      { name: "Press militar con barra", reps: 8 },
      { name: "Circuito final: burpees con peso", reps: 10 }
    ]
  },
  {
    id: "gym_basico_arms", name: "Brazos Básico", category: "gimnasio", level: "básico", points: 15, rounds: 3,
    description: "Enfoque exclusivo en brazos para principiantes.",
    equipment: ["Mancuernas", "Banco", "Polea"],
    exercises: [
      { name: "Curl de bíceps con mancuernas", reps: 12 },
      { name: "Martillo con mancuernas", reps: 12 },
      { name: "Extensiones de tríceps en polea", reps: 12 },
      { name: "Curl concentrado", reps: 10 },
      { name: "Press francés con mancuerna", reps: 10 },
      { name: "Curl con barra EZ", reps: 10 }
    ]
  },
  {
    id: "gym_intermedio_shoulders", name: "Hombros Intermedio", category: "gimnasio", level: "intermedio", points: 25, rounds: 3,
    description: "Desarrollo completo de hombros para look atlético.",
    equipment: ["Mancuernas", "Máquina", "Barra"],
    exercises: [
      { name: "Press militar con mancuernas", reps: 10 },
      { name: "Elevaciones laterales", reps: 15 },
      { name: "Elevaciones frontales", reps: 12 },
      { name: "Pájaros (rear delt fly)", reps: 15 },
      { name: "Press Arnold", reps: 10 },
      { name: "Encogimientos con barra", reps: 12 }
    ]
  },

  // ============================================================
  // === YOGA [10 RUTINAS] ===
  // ============================================================
  {
    id: "yoga_basico_morning", name: "Morning Flow Básico", category: "yoga", level: "básico", points: 10, rounds: 1,
    description: "Secuencia suave para despertar el cuerpo y la mente por la mañana.",
    equipment: ["Mat"],
    exercises: [
      { name: "Saludo al sol (5 rondas)", reps: 5 },
      { name: "Gato-vaca", reps: 10 },
      { name: "Perro boca abajo", reps: "30 segundos" },
      { name: "Postura del niño", reps: "1 minuto" },
      { name: "Giro de columna sentado", reps: "10 cada lado" },
      { name: "Savasana final", reps: "3 minutos" }
    ]
  },
  {
    id: "yoga_basico_stress", name: "Alivio de Estrés", category: "yoga", level: "básico", points: 10, rounds: 1,
    description: "Rutina calmante para reducir ansiedad y tensión.",
    equipment: ["Mat", "Bloques", "Almohada"],
    exercises: [
      { name: "Respiración profunda", reps: "2 minutos" },
      { name: "Doblez hacia adelante sentado", reps: "1 minuto" },
      { name: "Piernas arriba la pared", reps: "5 minutos" },
      { name: "Giro suave de columna", reps: "30 segundos cada lado" },
      { name: "Postura del niño con apoyo", reps: "2 minutos" },
      { name: "Savasana con relajación guiada", reps: "5 minutos" }
    ]
  },
  {
    id: "yoga_intermedio_balance", name: "Balance y Estabilidad", category: "yoga", level: "intermedio", points: 20, rounds: 2,
    description: "Mejora tu equilibrio y concentración con posturas de balance.",
    equipment: ["Mat"],
    exercises: [
      { name: "Árbol", reps: "30 segundos cada lado" },
      { name: "Guerrero III", reps: "20 segundos cada lado" },
      { name: "Eagle (Garuda)", reps: "30 segundos cada lado" },
      { name: "Half moon", reps: "20 segundos cada lado" },
      { name: "Dancer (Natarajasana)", reps: "15 segundos cada lado" },
      { name: "Flamingo", reps: "20 segundos cada lado" }
    ]
  },
  {
    id: "yoga_intermedio_strength", name: "Yoga Fuerza", category: "yoga", level: "intermedio", points: 20, rounds: 2,
    description: "Construye fuerza muscular usando tu propio peso corporal.",
    equipment: ["Mat"],
    exercises: [
      { name: "Plancha (hold)", reps: "60 segundos" },
      { name: "Perro boca abajo (hold)", reps: "45 segundos" },
      { name: "Guerrero II", reps: "30 segundos cada lado" },
      { name: "Silla (Utkatasana)", reps: "45 segundos" },
      { name: "Lado del plano (side plank)", reps: "30 segundos cada lado" },
      { name: "Cobra sostenido", reps: "30 segundos" }
    ]
  },
  {
    id: "yoga_avanzado_inversions", name: "Inversiones Avanzado", category: "yoga", level: "avanzado", points: 35, rounds: 3,
    description: "Domina las inversiones: pino, mano cabeza y forearm stand.",
    equipment: ["Mat", "Pared para apoyo"],
    exercises: [
      { name: "Preparación a pino contra pared", reps: "5 intentos" },
      { name: "Pino contra pared (hold)", reps: "30 segundos" },
      { name: "Forearm stand preparación", reps: "3 intentos" },
      { name: "Crow (Kakasana)", reps: "5 holds de 10 segundos" },
      { name: "Headstand preparación", reps: "3 intentos" },
      { name: "Handstand wall walks", reps: "5 subidas" }
    ]
  },
  {
    id: "yoga_avanzado_flexibility", name: "Flexibilidad Extrema", category: "yoga", level: "avanzado", points: 35, rounds: 3,
    description: "Rutina intensiva para abrir caderas, hombros y espalda.",
    equipment: ["Mat", "Bloques", "Cinta"],
    exercises: [
      { name: "Split izquierdo", reps: "1 minuto" },
      { name: "Split derecho", reps: "1 minuto" },
      { name: "Pigeon pose (Eka Pada Rajakapotasana)", reps: "2 minutos cada lado" },
      { name: "Wheel (Urdhva Dhanurasana)", reps: "5 holds de 15 segundos" },
      { name: "King pigeon", reps: "30 segundos cada lado" },
      { name: "Forward fold profundo", reps: "2 minutos" }
    ]
  },
  {
    id: "yoga_espartano_armbalance", name: "Arm Balance Espartano", category: "yoga", level: "espartano", points: 50, rounds: 3,
    description: "Domina los balances de manos más desafiantes.",
    equipment: ["Mat"],
    exercises: [
      { name: "Crow hold avanzado", reps: "45 segundos" },
      { name: "Side crow", reps: "30 segundos cada lado" },
      { name: "Firefly (Tittibhasana)", reps: "3 intentos" },
      { name: "Eight-angle pose", reps: "2 intentos cada lado" },
      { name: "Handstand (sin pared intento)", reps: "5 intentos" },
      { name: "Peacock (Mayurasana) preparación", reps: "3 intentos" }
    ]
  },
  {
    id: "yoga_espartano_flow", name: "Power Flow Espartano", category: "yoga", level: "espartano", points: 50, rounds: 3,
    description: "Vinyasa de alta intensidad que combina fuerza y cardio.",
    equipment: ["Mat"],
    exercises: [
      { name: "Saludo al sol A (10 rondas)", reps: 10 },
      { name: "Saludo al sol B (10 rondas)", reps: 10 },
      { name: "Warrior flow dinámico", reps: "5 minutos" },
      { name: "Core power sequence", reps: "3 minutos" },
      { name: "Inversion flow", reps: "5 minutos" },
      { name: "Savasana de recuperación", reps: "5 minutos" }
    ]
  },
  {
    id: "yoga_basico_back", name: "Espalda Saludable", category: "yoga", level: "básico", points: 10, rounds: 1,
    description: "Alivia dolor de espalda y mejora postura.",
    equipment: ["Mat", "Bloques"],
    exercises: [
      { name: "Gato-vaca", reps: 15 },
      { name: "Perro boca abajo", reps: "30 segundos" },
      { name: "Esfinge", reps: "45 segundos" },
      { name: "Giro de columna supino", reps: "30 segundos cada lado" },
      { name: "Rodillas al pecho", reps: "1 minuto" },
      { name: "Twist de columna sentado", reps: "45 segundos cada lado" }
    ]
  },
  {
    id: "yoga_intermedio_core", name: "Core Yoga", category: "yoga", level: "intermedio", points: 20, rounds: 2,
    description: "Fortalece el core con posturas de yoga.",
    equipment: ["Mat"],
    exercises: [
      { name: "Plancha (hold)", reps: "60 segundos" },
      { name: "Boat pose (Navasana)", reps: "30 segundos" },
      { name: "Side plank", reps: "30 segundos cada lado" },
      { name: "Dolphin plank", reps: "45 segundos" },
      { name: "Superman en yoga", reps: "15 repeticiones" },
      { name: "Rocking boat", reps: "20 repeticiones" }
    ]
  },

  // ============================================================
  // === PILATES [10 RUTINAS] ===
  // ============================================================
  {
    id: "pilates_basico_fundamentals", name: "Fundamentos Pilates", category: "pilates", level: "básico", points: 10, rounds: 1,
    description: "Aprende los principios básicos del método Pilates.",
    equipment: ["Mat"],
    exercises: [
      { name: "Breathing (respiración costal)", reps: "10 respiraciones" },
      { name: "Pelvic tilt", reps: 10 },
      { name: "Rib cage placement", reps: 8 },
      { name: "Head nod", reps: 8 },
      { name: "Basic imprint", reps: 10 },
      { name: "Neutral spine", reps: "30 segundos hold" }
    ]
  },
  {
    id: "pilates_basico_mat", name: "Mat Básico", category: "pilates", level: "básico", points: 10, rounds: 1,
    description: "Rutina clásica de Pilates en suelo para principiantes.",
    equipment: ["Mat"],
    exercises: [
      { name: "Hundred", reps: "100 respiraciones" },
      { name: "Roll up", reps: 8 },
      { name: "Rolling like a ball", reps: 8 },
      { name: "Single leg stretch", reps: "10 cada lado" },
      { name: "Double leg stretch", reps: 10 },
      { name: "Spine stretch", reps: 8 }
    ]
  },
  {
    id: "pilates_intermedio_core", name: "Core Intermedio", category: "pilates", level: "intermedio", points: 20, rounds: 2,
    description: "Fortalecimiento profundo del core abdominal.",
    equipment: ["Mat", "Bandas elásticas"],
    exercises: [
      { name: "Hundred con piernas bajas", reps: "100 respiraciones" },
      { name: "Criss cross", reps: "20 total" },
      { name: "Double straight leg", reps: 10 },
      { name: "Corkscrew", reps: 8 },
      { name: "Saw", reps: "10 cada lado" },
      { name: "Swan prep", reps: 8 }
    ]
  },
  {
    id: "pilates_intermedio_legs", name: "Lower Body Intermedio", category: "pilates", level: "intermedio", points: 20, rounds: 2,
    description: "Trabajo de piernas y glúteos con control Pilates.",
    equipment: ["Mat", "Banda elástica", "Ring"],
    exercises: [
      { name: "Side kick series", reps: "10 cada lado" },
      { name: "Clamshells", reps: "15 cada lado" },
      { name: "Single leg circles", reps: "8 cada dirección" },
      { name: "Scissors", reps: "10 cada lado" },
      { name: "Shoulder bridge", reps: "10 elevaciones" },
      { name: "Side lying leg lifts", reps: "15 cada lado" }
    ]
  },
  {
    id: "pilates_avanzado_mat", name: "Mat Avanzado", category: "pilates", level: "avanzado", points: 35, rounds: 3,
    description: "Rutina completa de nivel avanzado en suelo.",
    equipment: ["Mat", "Banda elástica"],
    exercises: [
      { name: "Hundred piernas muy bajas", reps: "100 respiraciones" },
      { name: "Roll over", reps: 8 },
      { name: "Jackknife", reps: 6 },
      { name: "Side bend", reps: "8 cada lado" },
      { name: "Boomerang", reps: 6 },
      { name: "Control balance", reps: "5 cada lado" }
    ]
  },
  {
    id: "pilates_avanzado_reformer", name: "Reformer Style Avanzado", category: "pilates", level: "avanzado", points: 35, rounds: 3,
    description: "Simula ejercicios de reformer usando banda elástica.",
    equipment: ["Mat", "Banda elástica pesada", "Ring"],
    exercises: [
      { name: "Footwork con banda", reps: 12 },
      { name: "Hundred con banda", reps: "100 respiraciones" },
      { name: "Long stretch series", reps: "8 cada ejercicio" },
      { name: "Elephant con banda", reps: 10 },
      { name: "Knee stretches con banda", reps: 10 },
      { name: "Running con banda", reps: "20 total" }
    ]
  },
  {
    id: "pilates_espartano_core", name: "Core Espartano", category: "pilates", level: "espartano", points: 50, rounds: 3,
    description: "El desafío de core más intenso del método Pilates.",
    equipment: ["Mat", "Banda elástica extra pesada"],
    exercises: [
      { name: "Hundred piernas a 45°", reps: "100 respiraciones" },
      { name: "Double leg lower", reps: 15 },
      { name: "Teaser", reps: 8 },
      { name: "Criss cross rápido", reps: "30 total" },
      { name: "Scissors en V", reps: "20 cada lado" },
      { name: "Plank series Pilates", reps: "2 minutos" }
    ]
  },
  {
    id: "pilates_espartano_fullbody", name: "Full Body Espartano", category: "pilates", level: "espartano", points: 50, rounds: 3,
    description: "Rutina completa de alta intensidad Pilates.",
    equipment: ["Mat", "Banda elástica", "Ring"],
    exercises: [
      { name: "Mat completo clásico", reps: "Todos los ejercicios" },
      { name: "Side kick series avanzado", reps: "15 cada lado" },
      { name: "Standing series con banda", reps: "12 cada ejercicio" },
      { name: "Plank con variaciones", reps: "3 minutos" },
      { name: "Advanced spine work", reps: "10 cada ejercicio" },
      { name: "Final stretch completo", reps: "5 minutos" }
    ]
  },
  {
    id: "pilates_basico_posture", name: "Postura y Alineación", category: "pilates", level: "básico", points: 10, rounds: 1,
    description: "Mejora tu postura corporal con ejercicios específicos.",
    equipment: ["Mat", "Pared"],
    exercises: [
      { name: "Wall roll down", reps: 8 },
      { name: "Scapular stability", reps: 10 },
      { name: "Neck rolls", reps: "6 cada dirección" },
      { name: "Shoulder rolls", reps: 8 },
      { name: "Spine twist sentado", reps: "10 cada lado" },
      { name: "Standing alignment check", reps: "30 segundos" }
    ]
  },
  {
    id: "pilates_intermedio_flexibility", name: "Flexibilidad Pilates", category: "pilates", level: "intermedio", points: 20, rounds: 2,
    description: "Combina fuerza y flexibilidad del método Pilates.",
    equipment: ["Mat", "Banda elástica"],
    exercises: [
      { name: "Roll up con stretch", reps: 10 },
      { name: "Spine stretch profundo", reps: 10 },
      { name: "Saw con rotación", reps: "12 cada lado" },
      { name: "Mermaid stretch", reps: "8 cada lado" },
      { name: "Side bend con banda", reps: "10 cada lado" },
      { name: "Hamstring stretch Pilates", reps: "30 segundos cada lado" }
    ]
  },

  // ============================================================
  // === CARDIO [10 RUTINAS] ===
  // ============================================================
  {
    id: "cardio_basico_walk", name: "Caminata Activa", category: "cardio", level: "básico", points: 10, rounds: 1,
    description: "Caminata intensa para mejorar resistencia cardiovascular básica.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Caminata rápida", reps: "20 minutos" },
      { name: "Caminata con brazos", reps: "5 minutos" },
      { name: "Caminata backward", reps: "2 minutos" },
      { name: "Caminata lateral", reps: "2 minutos cada lado" },
      { name: "Caminata con elevación de rodillas", reps: "3 minutos" },
      { name: "Caminata de enfriamiento", reps: "5 minutos" }
    ]
  },
  {
    id: "cardio_basico_hiit", name: "HIIT Básico", category: "cardio", level: "básico", points: 15, rounds: 4,
    description: "Entrenamiento intervalado de alta intensidad para principiantes.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Jumping jacks (30s trabajo, 30s descanso)", reps: "4 rondas" },
      { name: "Marcha alta (30s trabajo, 30s descanso)", reps: "4 rondas" },
      { name: "Sentadillas sin peso (30s trabajo, 30s descanso)", reps: "4 rondas" },
      { name: "Mountain climbers (20s trabajo, 40s descanso)", reps: "4 rondas" },
      { name: "Rodillas al pecho (20s trabajo, 40s descanso)", reps: "4 rondas" },
      { name: "Enfriamiento caminando", reps: "3 minutos" }
    ]
  },
  {
    id: "cardio_intermedio_running", name: "Running Intervals", category: "cardio", level: "intermedio", points: 25, rounds: 1,
    description: "Intervalos de carrera para mejorar velocidad y resistencia.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Calentamiento trote suave", reps: "5 minutos" },
      { name: "Sprint 30s / trote 90s", reps: "8 rondas" },
      { name: "Trote recuperación", reps: "3 minutos" },
      { name: "Sprint 45s / trote 75s", reps: "6 rondas" },
      { name: "Trote moderado", reps: "5 minutos" },
      { name: "Enfriamiento caminata", reps: "5 minutos" }
    ]
  },
  {
    id: "cardio_intermedio_circuit", name: "Cardio Circuit", category: "cardio", level: "intermedio", points: 25, rounds: 3,
    description: "Circuito cardiovascular sin equipos.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Burpees", reps: 15 },
      { name: "Jumping jacks", reps: 30 },
      { name: "Mountain climbers", reps: 20 },
      { name: "High knees", reps: "20 segundos" },
      { name: "Squats jumps", reps: 15 },
      { name: "Plank jacks", reps: 20 }
    ]
  },
  {
    id: "cardio_avanzado_hiit", name: "HIIT Avanzado", category: "cardio", level: "avanzado", points: 40, rounds: 5,
    description: "Entrenamiento intervalado de alta intensidad elite.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Burpees (40s trabajo, 20s descanso)", reps: "5 rondas" },
      { name: "Sprint en sitio (40s trabajo, 20s descanso)", reps: "5 rondas" },
      { name: "Mountain climbers speed (40s trabajo, 20s descanso)", reps: "5 rondas" },
      { name: "Jump squats (40s trabajo, 20s descanso)", reps: "5 rondas" },
      { name: "Tuck jumps (30s trabajo, 30s descanso)", reps: "4 rondas" },
      { name: "Plank hold final", reps: "60 segundos" }
    ]
  },
  {
    id: "cardio_avanzado_endurance", name: "Endurance Builder", category: "cardio", level: "avanzado", points: 40, rounds: 1,
    description: "Constructor de resistencia cardiovascular de larga duración.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Trote constante moderado", reps: "15 minutos" },
      { name: "Trote con intervalos rápidos", reps: "10 minutos" },
      { name: "Sprint intervals", reps: "5 minutos" },
      { name: "Trote hill simulation", reps: "8 minutos" },
      { name: "Trote final push", reps: "5 minutos" },
      { name: "Enfriamiento extensivo", reps: "7 minutos" }
    ]
  },
  {
    id: "cardio_espartano_tabata", name: "Tabata Espartano", category: "cardio", level: "espartano", points: 60, rounds: 8,
    description: "Protocolo Tabata extremo: 20s trabajo máximo, 10s descanso.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Burpees máximos (20s/10s)", reps: "8 rondas" },
      { name: "Mountain climbers speed (20s/10s)", reps: "8 rondas" },
      { name: "Jump squats explosivos (20s/10s)", reps: "8 rondas" },
      { name: "Sprint en sitio (20s/10s)", reps: "8 rondas" },
      { name: "Tuck jumps (20s/10s)", reps: "8 rondas" },
      { name: "Plank jacks (20s/10s)", reps: "8 rondas" }
    ]
  },
  {
    id: "cardio_espartano_emom", name: "EMOM Espartano", category: "cardio", level: "espartano", points: 60, rounds: 10,
    description: "Every Minute on the Minute: máximo reps por minuto.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Burpees (max reps 1 min)", reps: "1 minuto" },
      { name: "Descanso 1 minuto", reps: "1 minuto" },
      { name: "Mountain climbers (max reps 1 min)", reps: "1 minuto" },
      { name: "Descanso 1 minuto", reps: "1 minuto" },
      { name: "Jump squats (max reps 1 min)", reps: "1 minuto" },
      { name: "Descanso 1 minuto", reps: "1 minuto" },
      { name: "Tuck jumps (max reps 1 min)", reps: "1 minuto" },
      { name: "Descanso 1 minuto", reps: "1 minuto" },
      { name: "Sprint en sitio (max 1 min)", reps: "1 minuto" },
      { name: "Enfriamiento", reps: "3 minutos" }
    ]
  },
  {
    id: "cardio_basico_dance", name: "Dance Cardio Básico", category: "cardio", level: "básico", points: 10, rounds: 1,
    description: "Baile divertido para quemar calorías.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Calentamiento ritmo suave", reps: "5 minutos" },
      { name: "Pasos básicos de baile", reps: "10 minutos" },
      { name: "Movimientos de brazos", reps: "5 minutos" },
      { name: "Coreografía simple", reps: "10 minutos" },
      { name: "Sprint dance", reps: "5 minutos" },
      { name: "Enfriamiento stretch", reps: "5 minutos" }
    ]
  },
  {
    id: "cardio_intermedio_jump", name: "Jump Rope Intermedio", category: "cardio", level: "intermedio", points: 25, rounds: 3,
    description: "Rutina de saltar cuerda para coordinación y cardio.",
    equipment: ["Cuerda"],
    exercises: [
      { name: "Saltos básicos", reps: "3 minutos" },
      { name: "Saltos alternos", reps: "2 minutos" },
      { name: "Saltos con talones", reps: "2 minutos" },
      { name: "Double jumps intentos", reps: "1 minuto" },
      { name: "Saltos laterales", reps: "2 minutos" },
      { name: "Saltos libres", reps: "3 minutos" }
    ]
  },

  // ============================================================
  // === CALISTENIA [10 RUTINAS] ===
  // ============================================================
  {
    id: "cali_basico_foundation", name: "Fundamentos Calistenia", category: "calistenia", level: "básico", points: 15, rounds: 3,
    description: "Base de calistenia: dominar los movimientos fundamentales.",
    equipment: ["Barra", "Suelo"],
    exercises: [
      { name: "Flexiones de pecho (rodillas)", reps: 15 },
      { name: "Dominadas asistidas (banda)", reps: 10 },
      { name: "Sentadillas clásicas", reps: 20 },
      { name: "Plancha básica", reps: "30 segundos" },
      { name: "Australian pullups", reps: 12 },
      { name: "Zancadas reversas", reps: "12 cada lado" }
    ]
  },
  {
    id: "cali_basico_push", name: "Push Básico", category: "calistenia", level: "básico", points: 15, rounds: 3,
    description: "Desarrolla fuerza de empuje con peso corporal.",
    equipment: ["Suelo", "Silla/Paralelas"],
    exercises: [
      { name: "Flexiones clásicas", reps: 12 },
      { name: "Flexiones diamante (rodillas)", reps: 10 },
      { name: "Fondos en silla (pies apoyados)", reps: 12 },
      { name: "Flexiones declinadas (pies elevados)", reps: 10 },
      { name: "Flexiones pica (pike pushups)", reps: 10 },
      { name: "Dips en paralelas asistidos", reps: 8 }
    ]
  },
  {
    id: "cali_intermedio_pull", name: "Pull Intermedio", category: "calistenia", level: "intermedio", points: 25, rounds: 3,
    description: "Fuerza de tracción para espalda y bíceps.",
    equipment: ["Barra", "Suelo"],
    exercises: [
      { name: "Dominadas clásicas", reps: 8 },
      { name: "Chin ups (palmas adentro)", reps: 8 },
      { name: "Australian pullups", reps: 15 },
      { name: "Row en suelo bajo barra", reps: 12 },
      { name: "L-sit en barra (intentos)", reps: "5 intentos" },
      { name: "Negativas de dominada", reps: 6 }
    ]
  },
  {
    id: "cali_intermedio_legs", name: "Legs Calistenia", category: "calistenia", level: "intermedio", points: 25, rounds: 3,
    description: "Piernas poderosas solo con peso corporal.",
    equipment: ["Suelo"],
    exercises: [
      { name: "Sentadillas búlgaras", reps: "10 cada lado" },
      { name: "Zancadas con salto", reps: "12 cada lado" },
      { name: "Sentadilla pistol (asistida)", reps: "8 cada lado" },
      { name: "Puentos de glúteo una pierna", reps: "12 cada lado" },
      { name: "Step ups explosivos", reps: "15 cada lado" },
      { name: "Wall sit", reps: "45 segundos" }
    ]
  },
  {
    id: "cali_avanzado_static", name: "Static Holds Avanzado", category: "calistenia", level: "avanzado", points: 40, rounds: 4,
    description: "Domina los holds estáticos avanzados de calistenia.",
    equipment: ["Barra", "Suelo", "Paralelas"],
    exercises: [
      { name: "Front lever tuck (hold)", reps: "20 segundos" },
      { name: "Planche tuck (hold)", reps: "15 segundos" },
      { name: "L-sit en paralelas", reps: "30 segundos" },
      { name: "Human flag (intentos)", reps: "5 intentos cada lado" },
      { name: "Maltese (preparación)", reps: "3 intentos" },
      { name: "Iron cross (preparación)", reps: "3 intentos" }
    ]
  },
  {
    id: "cali_avanzado_dynamic", name: "Dynamic Avanzado", category: "calistenia", level: "avanzado", points: 40, rounds: 4,
    description: "Movimientos dinámicos explosivos de calistenia.",
    equipment: ["Barra", "Suelo"],
    exercises: [
      { name: "Muscle up (intentos)", reps: "5 intentos" },
      { name: "360 en barra", reps: "3 intentos cada lado" },
      { name: "Back lever pull", reps: 8 },
      { name: "Planche pushups", reps: 6 },
      { name: "Kip ups", reps: 5 },
      { name: "Handstand pushups (pared)", reps: 8 }
    ]
  },
  {
    id: "cali_espartano_beast", name: "Beast Mode Espartano", category: "calistenia", level: "espartano", points: 60, rounds: 4,
    description: "Rutina de calistenia para bestias.",
    equipment: ["Barra", "Suelo", "Paralelas"],
    exercises: [
      { name: "Muscle ups", reps: 5 },
      { name: "Planche pushups", reps: 8 },
      { name: "One arm pullup (intentos)", reps: "3 intentos cada lado" },
      { name: "Front lever rows", reps: 8 },
      { name: "Handstand pushups", reps: 10 },
      { name: "Pistol squats", reps: "8 cada lado" }
    ]
  },
  {
    id: "cali_espartano_freestyle", name: "Freestyle Espartano", category: "calistenia", level: "espartano", points: 60, rounds: 4,
    description: "Combina power moves y freestyle calistenia.",
    equipment: ["Barra", "Suelo"],
    exercises: [
      { name: "360s y 540s en barra", reps: "10 intentos" },
      { name: "Swings en barra", reps: "15" },
      { name: "Kip variations", reps: "10" },
      { name: "Handstand transitions", reps: "5" },
      { name: "Planche combos", reps: "3 combos" },
      { name: "Freestyle flow final", reps: "2 minutos" }
    ]
  },
  {
    id: "cali_basico_core", name: "Core Calistenia", category: "calistenia", level: "básico", points: 15, rounds: 3,
    description: "Core fuerte base para calistenia.",
    equipment: ["Suelo"],
    exercises: [
      { name: "Plancha", reps: "45 segundos" },
      { name: "Leg raises", reps: 15 },
      { name: "Russian twists", reps: "20 total" },
      { name: "Bicycle crunches", reps: "20 total" },
      { name: "Superman holds", reps: "30 segundos" },
      { name: "Hollow body hold", reps: "30 segundos" }
    ]
  },
  {
    id: "cali_intermedio_fullbody", name: "Full Body Intermedio", category: "calistenia", level: "intermedio", points: 25, rounds: 3,
    description: "Rutina completa de calistenia intermedia.",
    equipment: ["Barra", "Suelo"],
    exercises: [
      { name: "Pullups", reps: 8 },
      { name: "Pushups", reps: 15 },
      { name: "Dips", reps: 10 },
      { name: "Squats", reps: 20 },
      { name: "Leg raises", reps: 15 },
      { name: "Plancha", reps: "60 segundos" }
    ]
  },

  // ============================================================
  // === HIPOPRESIVOS [10 RUTINAS] ===
  // ============================================================
  {
    id: "hipo_basico_iniciacion", name: "Iniciación Hipopresiva", category: "hipopresivos", level: "básico", points: 10, rounds: 1,
    description: "Aprende la técnica básica de hipopresivos para activar la faja abdominal y el suelo pélvico.",
    equipment: ["Mat"],
    exercises: [
      { name: "Postura base supina (tumbada)", reps: "30 segundos" },
      { name: "Respiración diafragmática", reps: "10 respiraciones" },
      { name: "Apnea costal (4 segundos)", reps: "5 repeticiones" },
      { name: "Activación transverso", reps: "10 repeticiones" },
      { name: "Relajación abdominal", reps: "30 segundos" },
      { name: "Respiración recuperativa", reps: "1 minuto" }
    ]
  },
  {
    id: "hipo_basico_postparto_temprano", name: "Postparto Temprano", category: "hipopresivos", level: "básico", points: 10, rounds: 1,
    description: "Rutina suave para las primeras semanas postparto. Consulta con tu médico antes de iniciar.",
    equipment: ["Mat", "Almohada"],
    exercises: [
      { name: "Respiración consciente", reps: "2 minutos" },
      { name: "Activación suave del transverso", reps: "8 repeticiones" },
      { name: "Apnea corta (3 segundos)", reps: "4 repeticiones" },
      { name: "Conexión con el suelo pélvico", reps: "10 contracciones suaves" },
      { name: "Estiramiento de columna", reps: "30 segundos" },
      { name: "Relajación profunda", reps: "2 minutos" }
    ]
  },
  {
    id: "hipo_intermedio_cuatro_patas", name: "Hipopresivos a Cuatro Patas", category: "hipopresivos", level: "intermedio", points: 20, rounds: 2,
    description: "Posición a cuatro patas para trabajar la faja abdominal con gravedad.",
    equipment: ["Mat"],
    exercises: [
      { name: "Posición base cuadrúpeda", reps: "30 segundos" },
      { name: "Respiración costal", reps: "10 respiraciones" },
      { name: "Apnea costal en cuclillas", reps: "5 repeticiones de 5 segundos" },
      { name: "Activación transverso dinámica", reps: "12 repeticiones" },
      { name: "Gato-vaca suave", reps: "10 repeticiones" },
      { name: "Descanso respiratorio", reps: "1 minuto" }
    ]
  },
  {
    id: "hipo_intermedio_pie", name: "Hipopresivos de Pie", category: "hipopresivos", level: "intermedio", points: 20, rounds: 2,
    description: "Trabajo hipopresivo en posición de pie para integrar la técnica en movimientos funcionales.",
    equipment: ["Ninguno"],
    exercises: [
      { name: "Alineación postural de pie", reps: "30 segundos" },
      { name: "Respiración costal de pie", reps: "10 respiraciones" },
      { name: "Apnea costal en posición erguida", reps: "5 repeticiones de 5 segundos" },
      { name: "Activación transverso estática", reps: "12 repeticiones" },
      { name: "Micro-movimientos con apnea", reps: "8 repeticiones" },
      { name: "Relajación consciente", reps: "1 minuto" }
    ]
  },
  {
    id: "hipo_avanzado_suelo_pelvico", name: "Suelo Pélvico Avanzado", category: "hipopresivos", level: "avanzado", points: 35, rounds: 3,
    description: "Trabajo profundo del suelo pélvico combinando hipopresivos con activación específica.",
    equipment: ["Mat"],
    exercises: [
      { name: "Conexión suelo pélvico", reps: "15 contracciones" },
      { name: "Apnea costal con activación pélvica", reps: "6 repeticiones de 6 segundos" },
      { name: "Puente de glúteos hipopresivo", reps: "10 repeticiones" },
      { name: "Activación transverso con elevación", reps: "12 repeticiones" },
      { name: "Respiración integrada", reps: "10 ciclos completos" },
      { name: "Relajación profunda", reps: "2 minutos" }
    ]
  },
  {
    id: "hipo_avanzado_diastasis", name: "Recuperación Diástasis", category: "hipopresivos", level: "avanzado", points: 35, rounds: 3,
    description: "Rutina específica para recuperar la diástasis abdominal. Consulta con fisioterapeuta.",
    equipment: ["Mat", "Faja abdominal opcional"],
    exercises: [
      { name: "Evaluación de diástasis", reps: "Autoevaluación" },
      { name: "Apnea costal con protección", reps: "6 repeticiones de 6 segundos" },
      { name: "Activación transverso centrado", reps: "15 repeticiones" },
      { name: "Curl abdominal modificado", reps: "10 repeticiones" },
      { name: "Respiración abdominal integrada", reps: "12 ciclos" },
      { name: "Relajación con visualización", reps: "2 minutos" }
    ]
  },
  {
    id: "hipo_espartano_pro", name: "Hipopresivos Pro", category: "hipopresivos", level: "espartano", points: 50, rounds: 3,
    description: "Nivel avanzado para quienes dominan la técnica hipopresiva. Solo para usuarias experimentadas.",
    equipment: ["Mat"],
    exercises: [
      { name: "Apnea costal prolongada (10 segundos)", reps: "6 repeticiones" },
      { name: "Activación transverso dinámica", reps: "20 repeticiones" },
      { name: "Serie de posiciones con apnea", reps: "5 posiciones x 8 segundos" },
      { name: "Conexión suelo pélvico avanzada", reps: "20 contracciones" },
      { name: "Respiración hipopresiva completa", reps: "15 ciclos" },
      { name: "Integración funcional", reps: "3 minutos" }
    ]
  },
  {
    id: "hipo_espartano_combinado", name: "Hipopresivos Combinados", category: "hipopresivos", level: "espartano", points: 50, rounds: 3,
    description: "Combina hipopresivos con trabajo de core para una recuperación completa.",
    equipment: ["Mat", "Banda elástica ligera"],
    exercises: [
      { name: "Apnea costal en cuclillas", reps: "6 repeticiones de 8 segundos" },
      { name: "Activación transverso con banda", reps: "15 repeticiones" },
      { name: "Core hipopresivo dinámico", reps: "12 repeticiones" },
      { name: "Suelo pélvico con resistencia", reps: "15 contracciones" },
      { name: "Respiración integrada completa", reps: "12 ciclos" },
      { name: "Relajación y estiramiento", reps: "3 minutos" }
    ]
  },
  {
    id: "hipo_basico_respiracion", name: "Respiración Consciente", category: "hipopresivos", level: "básico", points: 10, rounds: 1,
    description: "Enfoque exclusivo en la técnica respiratoria correcta para hipopresivos.",
    equipment: ["Mat"],
    exercises: [
      { name: "Respiración diafragmática", reps: "15 respiraciones" },
      { name: "Respiración costal", reps: "15 respiraciones" },
      { name: "Apnea progresiva (2-4-6 segundos)", reps: "6 series" },
      { name: "Apertura costal sin aire", reps: "10 repeticiones" },
      { name: "Sincronización respiratoria", reps: "10 ciclos" },
      { name: "Relajación respiratoria", reps: "2 minutos" }
    ]
  },
  {
    id: "hipo_intermedio_postura", name: "Corrección Postural", category: "hipopresivos", level: "intermedio", points: 20, rounds: 2,
    description: "Combina hipopresivos con corrección postural para alinear columna y activar core.",
    equipment: ["Mat", "Pared"],
    exercises: [
      { name: "Alineación contra pared", reps: "30 segundos" },
      { name: "Apnea costal con corrección", reps: "5 repeticiones de 5 segundos" },
      { name: "Activación transverso postural", reps: "12 repeticiones" },
      { name: "Giro de columna con apnea", reps: "8 cada lado" },
      { name: "Respiración postural integrada", reps: "10 ciclos" },
      { name: "Relajación con alineación", reps: "2 minutos" }
    ]
  }
];

// Exponer la constante en el ambiente global
if (typeof window !== "undefined") {
  window.FMSpecializedRoutines = FM_SPECIALIZED_ROUTINES;
}
