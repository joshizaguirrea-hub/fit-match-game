/* ============================================================
   Fit Match · Base de Datos de Rutinas de Dioses y Leyendas
   ------------------------------------------------------------
   Contiene los entrenamientos estructurados por repeticiones y rondas,
   inspirados en las culturas legendarias del mundo.
   Simetría Absoluta: 9 Culturas individuales, cada una con:
     - 2 Básicos (10 PX, 3 Rondas)
     - 2 Intermedios (20 PX, 3 Rondas)
     - 2 Avanzados (35 PX, 4 Rondas)
     - 2 Espartanos (50 PX, 4 Rondas)
   Total: 72 rutinas exclusivas de 6 ejercicios cada una.
   ============================================================ */

const FM_ROUTINES = [
  // ============================================================
  // === 1. GRECIA [8 RUTINAS] ===
  // ============================================================
  {
    id: "prometeo", name: "Prometeo (El Titán de Fuego)", culture: "Grecia", level: "básico", points: 10, rounds: 3,
    description: "Iníciate en la fuerza de los titanes con un circuito completo que activa todo el cuerpo de forma segura.",
    exercises: [
      { name: "Flexiones de pared controladas", reps: 15 },
      { name: "Sentadillas clásicas asistidas", reps: 12 },
      { name: "Abdominales cortos (Heel Taps)", reps: 15 },
      { name: "Superman básico en suelo", reps: 10 },
      { name: "Puente de glúteos clásico", reps: 15 },
      { name: "Ángeles de pared (Wall Angels)", reps: 12 }
    ]
  },
  {
    id: "hestia", name: "Hestia (La Llama del Hogar)", culture: "Grecia", level: "básico", points: 10, rounds: 3,
    description: "La diosa del hogar te bendice con una rutina relajante de movilidad, estiramiento y core suave.",
    exercises: [
      { name: "Estiramiento lumbar Gato-Camello", reps: 12 },
      { name: "Abdominales Bird-Dog controlados", reps: 12 },
      { name: "Zancadas laterales suaves", reps: 10 },
      { name: "Plancha escapular sobre rodillas", reps: 10 },
      { name: "Rotación de hombros adelante/atrás", reps: 15 },
      { name: "Puente de glúteos clásico", reps: 12 }
    ]
  },
  {
    id: "afrodita", name: "Afrodita (Fuerza Divina)", culture: "Grecia", level: "intermedio", points: 20, rounds: 3,
    description: "Un clásico quemador de volumen intermedio para esculpir piernas, pecho y abdomen.",
    exercises: [
      { name: "Sentadillas clásicas profundas (Air Squats)", reps: 20 },
      { name: "Flexiones de pecho clásicas", reps: 12 },
      { name: "Abdominales cortos (Crunch)", reps: 15 },
      { name: "Giros rusos estables (Russian Twists)", reps: 24 },
      { name: "Zancadas alternas hacia atrás", reps: 16 },
      { name: "Plancha tradicional isométrica (segundos)", reps: 40 }
    ]
  },
  {
    id: "hermes", name: "Hermes (Velocidad Alada)", culture: "Grecia", level: "intermedio", points: 20, rounds: 3,
    description: "Reta tus reflejos, agilidad de pies y resistencia cardiovascular con el mensajero de los dioses.",
    exercises: [
      { name: "Saltos de estrella rápidos (Jacks)", reps: 20 },
      { name: "Escaladores de montaña (Mountain Climbers)", reps: 24 },
      { name: "Zancadas cruzadas hacia atrás (Curtsy)", reps: 14 },
      { name: "Saltos rápidos de lado a lado", reps: 20 },
      { name: "Marcha con rodillas altas (segundos)", reps: 30 },
      { name: "Abdominales bicicleta alternos", reps: 20 }
    ]
  },
  {
    id: "aquiles", name: "Aquiles (El Guerrero)", culture: "Grecia", level: "avanzado", points: 35, rounds: 4,
    description: "Rutina implacable de 4 rondas enfocada en demoler el tren inferior y esculpir piernas de titanio.",
    exercises: [
      { name: "Sentadillas búlgaras estrictas (por pierna)", reps: 10 },
      { name: "Zancadas con salto alternas y explosivas", reps: 16 },
      { name: "Puente de glúteos a una pierna (por lado)", reps: 12 },
      { name: "Sentadillas con salto cayendo en sentadilla isométrica", reps: 12 },
      { name: "Elevación de talones explosiva (pantorrillas)", reps: 30 },
      { name: "Plancha tradicional con saltos de pies (Plank Jacks)", reps: 20 }
    ]
  },
  {
    id: "ares", name: "Ares (Ira de la Batalla)", culture: "Grecia", level: "avanzado", points: 35, rounds: 4,
    description: "Somete tus hombros, tríceps y core al castigo inclemente del dios de la guerra olímpico.",
    exercises: [
      { name: "Flexiones de picas estrictas (Pike Pushups)", reps: 12 },
      { name: "Flexiones declinadas con pies elevados", reps: 14 },
      { name: "Fondos en silla sin apoyo de pies (piernas rectas)", reps: 10 },
      { name: "Plancha tradicional con toques de hombro alternos", reps: 16 },
      { name: "Superman dinámico con brazos en W", reps: 12 },
      { name: "Caminata de manos adelante-atrás (Walkouts)", reps: 8 }
    ]
  },
  {
    id: "zeus", name: "Zeus (Fuerza del Olimpo)", culture: "Grecia", level: "espartano", points: 50, rounds: 4,
    description: "4 rondas infernales de potencia explosiva pura. Solo los de espíritu inquebrantable heredarán el rayo.",
    exercises: [
      { name: "Flexiones de pecho explosivas con despegue", reps: 12 },
      { name: "Sentadillas con salto vertical explosivo máximo", reps: 20 },
      { name: "Abdominales dobles completos (V-Ups estrictos)", reps: 16 },
      { name: "Fondos profundos entre dos sillas", reps: 12 },
      { name: "Plancha de antebrazos subiendo a manos (Comandos)", reps: 16 },
      { name: "Burpees espartanos cayendo en pecho al suelo", reps: 10 }
    ]
  },
  {
    id: "hercules", name: "Hércules (Los 12 Trabajos)", culture: "Grecia", level: "espartano", points: 50, rounds: 4,
    description: "El entrenamiento de fuerza bruta definitiva. Empuja y jala tu propio peso corporal hasta el colapso muscular.",
    exercises: [
      { name: "Flexiones de arquero estrictas (Archer Pushups)", reps: 12 },
      { name: "Dominadas estrictas en barra (Pull-ups)", reps: 10 },
      { name: "Flexiones diamante con hold de 2s abajo", reps: 10 },
      { name: "Sentadilla isométrica profunda en pared (segundos)", reps: 45 },
      { name: "Plancha de antebrazos con balanceo extremo (Body Saw)", reps: 15 },
      { name: "Saltos de rodillas al pecho (Tuck Jumps)", reps: 10 }
    ]
  },

  // ============================================================
  // === 2. NÓRDICOS [8 RUTINAS] ===
  // ============================================================
  {
    id: "balder", name: "Balder (Luz y Postura)", culture: "Nórdicos", level: "básico", points: 10, rounds: 3,
    description: "Ablanda tensiones y abre tus hombros con ejercicios diseñados para una espalda radiante y sin dolor.",
    exercises: [
      { name: "Ángeles de pared isométricos (Wall Angels)", reps: 15 },
      { name: "Superman básico con brazos en Y", reps: 10 },
      { name: "Flexiones con manos inclinadas (en mesa)", reps: 12 },
      { name: "Elevación de talones isométrica (segundos)", reps: 15 },
      { name: "Abdominales cruzados cortos (básico)", reps: 12 },
      { name: "Plancha de antebrazos básica (segundos)", reps: 20 }
    ]
  },
  {
    id: "freya", name: "Freya (Belleza y Fuerza)", culture: "Nórdicos", level: "básico", points: 10, rounds: 3,
    description: "La diosa de la fertilidad y el amor te otorga fuerza en el tren inferior con movimientos controlados.",
    exercises: [
      { name: "Sentadillas clásicas suaves", reps: 12 },
      { name: "Puente de glúteos con talones juntos", reps: 15 },
      { name: "Patadas de glúteo en cuadrupedia (Donkey Kick)", reps: 12 },
      { name: "Abducción de cadera de lado (por lado)", reps: 12 },
      { name: "Elevación de talones básica", reps: 20 },
      { name: "Estiramiento lumbar cobra (reps)", reps: 10 }
    ]
  },
  {
    id: "loki", name: "Loki (Travesura y Balance)", culture: "Nórdicos", level: "intermedio", points: 20, rounds: 4,
    description: "Un circuito astuto de 4 rondas con transiciones rápidas que confunden a tus músculos y core.",
    exercises: [
      { name: "Flexiones Spiderman alternas", reps: 12 },
      { name: "Zancadas hacia atrás con salto ligero", reps: 12 },
      { name: "Abdominales de bicho muerto (Dead Bug)", reps: 16 },
      { name: "Plancha lateral con rotación de tronco", reps: 10 },
      { name: "Sentadillas de sumo profundas", reps: 15 },
      { name: "Superman dinámico cruzando brazo-pierna", reps: 14 }
    ]
  },
  {
    id: "heimdall", name: "Heimdall (El Vigilante)", culture: "Nórdicos", level: "intermedio", points: 20, rounds: 3,
    description: "Mantén una guardia firme como el guardián de Asgard con una rutina isométrica y de core estable.",
    exercises: [
      { name: "Sentadilla isométrica contra la pared (segundos)", reps: 30 },
      { name: "Plancha tradicional de antebrazos (segundos)", reps: 40 },
      { name: "Marcha alta en sitio con rodillas arriba (segundos)", reps: 30 },
      { name: "Elevación de piernas acostado controlada", reps: 12 },
      { name: "Flexiones clásicas de rodillas lentas", reps: 12 },
      { name: "Superman estricto con brazos extendidos", reps: 12 }
    ]
  },
  {
    id: "odin", name: "Odín (Padre de Todo)", culture: "Nórdicos", level: "avanzado", points: 35, rounds: 4,
    description: "Somete tus brazos y torso a la sabiduría vikinga de tensión prolongada de hombros y empuje declinado.",
    exercises: [
      { name: "Flexiones declinadas estrictas", reps: 15 },
      { name: "Caminata de cangrejo isométrica (segundos)", reps: 45 },
      { name: "Elevación de piernas rectas colgado o acostado", reps: 12 },
      { name: "Flexiones escapulares estrictas en suelo", reps: 20 },
      { name: "Sentadillas búlgaras controladas con pausa abajo", reps: 12 },
      { name: "Plancha tradicional con caminata de manos (Walkouts)", reps: 10 }
    ]
  },
  {
    id: "fenrir", name: "Fenrir (Fauces del Lobo)", culture: "Nórdicos", level: "avanzado", points: 35, rounds: 4,
    description: "Libera la fuerza animal y la potencia en las piernas con este entrenamiento de saltos continuos.",
    exercises: [
      { name: "Zancadas con salto alternas y explosivas", reps: 16 },
      { name: "Sentadillas búlgaras estrictas (por pierna)", reps: 12 },
      { name: "Plancha con saltos de pies dentro-fuera (Plank Jacks)", reps: 20 },
      { name: "Saltos de esquiador laterales (pliométricos)", reps: 16 },
      { name: "Sentadilla sumo con elevación de talones arriba", reps: 15 },
      { name: "Abdominales cortaplumas dobles", reps: 12 }
    ]
  },
  {
    id: "thor", name: "Thor (Fuerza del Trueno)", culture: "Nórdicos", level: "espartano", points: 50, rounds: 4,
    description: "La prueba de fuerza de empuje vertical y dominadas definitivas para forjar un cuerpo de acero nórdico.",
    exercises: [
      { name: "Flexiones de picas explosivas con despegue", reps: 10 },
      { name: "Dominadas estrictas (Pull-ups)", reps: 10 },
      { name: "Flexiones haciendo el pino asistido (Handstand)", reps: 8 },
      { name: "Superman estricto con brazos extendidos", reps: 20 },
      { name: "Plancha tradicional subiendo un pie estirado", reps: 16 },
      { name: "Flexiones diamante estrictas rozando el pecho", reps: 12 }
    ]
  },
  {
    id: "valkiria", name: "Valkiria (El Vuelo a la Batalla)", culture: "Nórdicos", level: "espartano", points: 50, rounds: 4,
    description: "El entrenamiento definitivo de las guerreras que transportan almas al Valhalla. Cardio y empuje letal.",
    exercises: [
      { name: "Burpees espartanos con lagartija estricta", reps: 12 },
      { name: "Sentadillas con salto explosivo cayendo profundo", reps: 20 },
      { name: "Flexiones Spiderman continuas y explosivas", reps: 14 },
      { name: "Abdominales V-Ups alternando piernas", reps: 16 },
      { name: "Escaladores de montaña ultra rápidos (segundos)", reps: 30 },
      { name: "Plancha tradicional subiendo a manos (Comandos)", reps: 16 }
    ]
  },

  // ============================================================
  // === 3. EGIPTO [8 RUTINAS] ===
  // ============================================================
  {
    id: "bastet", name: "Bastet (Agilidad Felina)", culture: "Egipto", level: "básico", points: 10, rounds: 3,
    description: "La diosa gata te bendice con estiramientos activos, movilidad espinal y fuerza fluida.",
    exercises: [
      { name: "Estiramiento Gato-Camello (movilidad)", reps: 12 },
      { name: "Abdominales Bird-Dog controlados (lento)", reps: 12 },
      { name: "Plancha escapular sobre rodillas (empuje)", reps: 10 },
      { name: "Sentadillas de sumo suaves", reps: 12 },
      { name: "Zancadas laterales cortas y controladas", reps: 10 },
      { name: "Rotación torácica en cuadrupedia (por lado)", reps: 8 }
    ]
  },
  {
    id: "isis", name: "Isis (El Trono de Vida)", culture: "Egipto", level: "básico", points: 10, rounds: 3,
    description: "Diosa madre y protectora. Forja un centro abdominal estable y balance corporal óptimo.",
    exercises: [
      { name: "Plancha de antebrazos básica con rodillas apoyadas", reps: 12 },
      { name: "Puente de glúteos clásico con pausa arriba", reps: 12 },
      { name: "Postura del árbol isométrica básica (segundos)", reps: 30 },
      { name: "Flexiones escapulares sobre rodillas", reps: 12 },
      { name: "Abdominales bicho muerto (Dead Bug alterno)", reps: 12 },
      { name: "Elevación de talones básica apoyado en pared", reps: 15 }
    ]
  },
  {
    id: "ra", name: "Ra (El Fuego Solar)", culture: "Egipto", level: "intermedio", points: 20, rounds: 3,
    description: "Despierta tu potencia cardiovascular y resistencia muscular con el poder del Sol del desierto.",
    exercises: [
      { name: "Burpees tradicionales controlados", reps: 10 },
      { name: "Sentadillas clásicas con salto vertical", reps: 15 },
      { name: "Flexiones de pecho clásicas", reps: 12 },
      { name: "Saltos de estrella explosivos (Jacks)", reps: 15 },
      { name: "Escaladores rápidos (Mountain Climbers)", reps: 24 },
      { name: "Plancha tradicional con toques de pie laterales", reps: 16 }
    ]
  },
  {
    id: "horus", name: "Horus (El Halcón Vengador)", culture: "Egipto", level: "intermedio", points: 20, rounds: 3,
    description: "Eleva tus hombros y core con ejercicios que simulan el batir de alas del dios halcón protector.",
    exercises: [
      { name: "Elevaciones de brazos dinámicas en T", reps: 20 },
      { name: "Flexiones declinadas suaves (pies en sofá)", reps: 10 },
      { name: "Abdominales cruzados codo-rodilla (Bicycle)", reps: 16 },
      { name: "Postura del árbol balance (segundos)", reps: 40 },
      { name: "Superman dinámico con brazos en W", reps: 12 },
      { name: "Plancha tradicional apoyando antebrazos", reps: 12 }
    ]
  },
  {
    id: "anubis", name: "Anubis (Guardián del Inframundo)", culture: "Egipto", level: "avanzado", points: 35, rounds: 4,
    description: "4 rondas de dolor abdominal que tallarán tu core para el pesaje final del alma.",
    exercises: [
      { name: "Abdominales de limpiaparabrisas (Wipers)", reps: 14 },
      { name: "Plancha lateral isométrica (segundos por lado)", reps: 40 },
      { name: "Escaladores cruzados rápidos", reps: 30 },
      { name: "Abdominales V-Ups (cortaplumas completos)", reps: 12 },
      { name: "Plancha de antebrazos con balanceo (Body Saw)", reps: 15 },
      { name: "Abdominales Hollow Body Hold (segundos)", reps: 30 }
    ]
  },
  {
    id: "osiris", name: "Osiris (Eternidad Isométrica)", culture: "Egipto", level: "avanzado", points: 35, rounds: 4,
    description: "Entrenamiento de holds y resistencia extrema que simula la rigidez divina y el control muscular.",
    exercises: [
      { name: "Sentadilla isométrica profunda en pared (segundos)", reps: 45 },
      { name: "Hold isométrico de flexión abajo (segundos)", reps: 15 },
      { name: "Plancha isométrica tradicional (segundos)", reps: 60 },
      { name: "Puente de glúteos a una pierna (segundos por lado)", reps: 20 },
      { name: "Abdominales Hollow Body Hold (segundos)", reps: 30 },
      { name: "Sostener zancada profunda (segundos por lado)", reps: 20 }
    ]
  },
  {
    id: "seth", name: "Seth (Tormenta del Caos)", culture: "Egipto", level: "espartano", points: 50, rounds: 4,
    description: "Libera la furia del dios del desierto con ejercicios explosivos e inestables que destruyen la fatiga.",
    exercises: [
      { name: "Burpees espartanos con flexión explosiva", reps: 12 },
      { name: "Flexiones Spiderman rápidas y explosivas", reps: 16 },
      { name: "Zancadas alternas saltando verticalmente", reps: 20 },
      { name: "Abdominales limpiaparabrisas rápidos (Wipers)", reps: 16 },
      { name: "Plancha de antebrazos subiendo a manos (Comandos)", reps: 16 },
      { name: "Sentadillas con salto vertical cayendo profundo", reps: 20 }
    ]
  },
  {
    id: "cleopatra", name: "Cleopatra (Poder y Belleza)", culture: "Egipto", level: "espartano", points: 50, rounds: 4,
    description: "Una rutina que exige fuerza, cardio implacable y máxima agilidad para dominar el tablero del fitness.",
    exercises: [
      { name: "Flexiones diamante estrictas rozando el pecho", reps: 12 },
      { name: "Saltos laterales de esquiador rápidos", reps: 24 },
      { name: "Abdominales V-Ups alternos cruzados", reps: 16 },
      { name: "Sentadillas búlgaras con salto (por pierna)", reps: 10 },
      { name: "Plancha tradicional con saltos (Plank Jacks)", reps: 20 },
      { name: "Burpees tradicionales con doble flexión abajo", reps: 8 }
    ]
  },

  // ============================================================
  // === 4. CHINA [8 RUTINAS] ===
  // ============================================================
  {
    id: "budai", name: "Budai (La Risa de Buda)", culture: "China", level: "básico", points: 10, rounds: 3,
    description: "Forja paz mental y física con respiración, balance y estiramiento de articulaciones básicas.",
    exercises: [
      { name: "Estiramiento lumbar Gato-Camello controlado", reps: 10 },
      { name: "Rotación de hombros adelante/atrás", reps: 12 },
      { name: "Sentadillas sumo lentas con respiración", reps: 10 },
      { name: "Plancha sobre rodillas sosteniendo balance (segundos)", reps: 30 },
      { name: "Abdominales Bird-Dog lentos y estirados", reps: 10 },
      { name: "Elevación de talones con estiramiento de brazos", reps: 15 }
    ]
  },
  {
    id: "aprendiz_shaolin", name: "Aprendiz Shaolin (Fuerza Interna)", culture: "China", level: "básico", points: 10, rounds: 3,
    description: "Inicia la postura clásica del caballo y la fuerza elemental de piernas del templo Shaolin.",
    exercises: [
      { name: "Postura del jinete isométrica (sentadilla hold segundos)", reps: 30 },
      { name: "Flexiones inclinadas controladas (en pared o mesa)", reps: 12 },
      { name: "Giros de cadera y tronco dinámicos", reps: 15 },
      { name: "Abdominales cortos con rodillas flexionadas", reps: 12 },
      { name: "Zancadas hacia atrás pausadas", reps: 10 },
      { name: "Marcha alta controlando balance (segundos)", reps: 30 }
    ]
  },
  {
    id: "mulan", name: "Mulan (Agilidad Guerrera)", culture: "China", level: "intermedio", points: 20, rounds: 3,
    description: "Una rutina de agilidad, reflejos y cardio medio inspirada en el legendario entrenamiento militar chino.",
    exercises: [
      { name: "Saltos de esquiador de lado a lado (Skater)", reps: 20 },
      { name: "Flexiones clásicas tocando hombro alterno", reps: 10 },
      { name: "Giros rusos veloces de lado a lado (Russian Twist)", reps: 24 },
      { name: "Escaladores de montaña estables", reps: 20 },
      { name: "Sentadilla clásica profunda cayendo con control", reps: 15 },
      { name: "Zancadas rápidas continuas alternando", reps: 16 }
    ]
  },
  {
    id: "sun_tzu", name: "Sun Tzu (Táctica del Core)", culture: "China", level: "intermedio", points: 20, rounds: 3,
    description: "El arte de la guerra muscular: vence la gravedad dominando la estabilidad del torso y la espalda.",
    exercises: [
      { name: "Plancha de antebrazos con toques adelante", reps: 12 },
      { name: "Superman dinámico con brazos en W", reps: 12 },
      { name: "Sentadillas sumo lentas y estables", reps: 15 },
      { name: "Abdominales cortos cruzados codo-rodilla", reps: 16 },
      { name: "Puente de glúteos a una sola pierna", reps: 10 },
      { name: "Plancha lateral con pierna apoyada (segundos por lado)", reps: 20 }
    ]
  },
  {
    id: "lao_tzu", name: "Lao Tzu (Tensión del Tao)", culture: "China", level: "avanzado", points: 35, rounds: 4,
    description: "Equilibrio y fuerza excéntrica súper lenta para fortalecer ligamentos y tonificar músculos al extremo.",
    exercises: [
      { name: "Sentadillas búlgaras súper lentas (por pierna)", reps: 10 },
      { name: "Flexiones lentas bajando en 4 segundos", reps: 10 },
      { name: "Sostener plancha tradicional de antebrazos (segundos)", reps: 45 },
      { name: "Abdominales de bicho muerto muy lentos (Dead Bug)", reps: 16 },
      { name: "Superman isométrico manteniendo brazos extendidos (s)", reps: 30 },
      { name: "Sostener sentadilla de jinete (segundos)", reps: 45 }
    ]
  },
  {
    id: "dragon_jade", name: "El Dragón de Jade (Fuerza Cósmica)", culture: "China", level: "avanzado", points: 35, rounds: 4,
    description: "Rutina avanzada de core y empuje que forja la potencia del mítico guardián imperial.",
    exercises: [
      { name: "Flexiones diamante estrictas", reps: 12 },
      { name: "Abdominales V-Ups completos", reps: 12 },
      { name: "Sentadillas búlgaras con pausa abajo", reps: 12 },
      { name: "Plancha de antebrazos con balanceo (Body Saw)", reps: 16 },
      { name: "Superman dinámico alzando torso y piernas", reps: 15 },
      { name: "Elevación de talones a una sola pierna (por lado)", reps: 15 }
    ]
  },
  {
    id: "wukong", name: "Sun Wukong (El Rey Mono)", culture: "China", level: "espartano", points: 50, rounds: 4,
    description: "4 rondas de agilidad acrobática y resistencia que desafían la gravedad y destrozan las piernas.",
    exercises: [
      { name: "Sentadillas búlgaras con salto explosivas", reps: 10 },
      { name: "Flexiones Spiderman continuas y rápidas", reps: 14 },
      { name: "Abdominales Hollow Body dinámicos (rocking seconds)", reps: 40 },
      { name: "Burpees con caída en sentadilla de sumo profunda", reps: 10 },
      { name: "Escaladores cruzados ultra rápidos (segundos)", reps: 30 },
      { name: "Sentadillas isométricas holding 1 pierna (segundos por lado)", reps: 20 }
    ]
  },
  {
    id: "guan_yu", name: "Guan Yu (General Legendario)", culture: "China", level: "espartano", points: 50, rounds: 4,
    description: "Rinde tributo al dios de la guerra chino con repeticiones ultra pesadas de flexiones de pica y fuerza bruta.",
    exercises: [
      { name: "Flexiones haciendo el pino asistido en pared (Handstand)", reps: 8 },
      { name: "Flexiones de picas explosivas con despegue", reps: 12 },
      { name: "Zancadas explosivas saltando continuas", reps: 20 },
      { name: "Abdominales dobles completos (V-Ups estrictos)", reps: 16 },
      { name: "Fondos profundos entre dos sillas (paralelas)", reps: 12 },
      { name: "Plancha tradicional subiendo a manos con salto (Comandos)", reps: 12 }
    ]
  },

  // ============================================================
  // === 5. JAPÓN [8 RUTINAS] ===
  // ============================================================
  {
    id: "hotei", name: "Hotei (Felicidad y Abundancia)", culture: "Japón", level: "básico", points: 10, rounds: 3,
    description: "Activa tu circulación y llena tus músculos de oxígeno con un circuito alegre y de bajo impacto.",
    exercises: [
      { name: "Sentadillas clásicas con brazos al frente", reps: 12 },
      { name: "Aperturas de pecho (brazos en T)", reps: 20 },
      { name: "Abdominales bicicleta lentos (básico)", reps: 16 },
      { name: "Marcha alta en el sitio con rodillas arriba (segundos)", reps: 40 },
      { name: "Giros de tronco suaves parado", reps: 15 },
      { name: "Flexiones cortas apoyando rodillas", reps: 10 }
    ]
  },
  {
    id: "tanuki", name: "Tanuki (Espíritu de la Selva)", culture: "Japón", level: "básico", points: 10, rounds: 3,
    description: "El mítico mapache travieso te reta con ejercicios de piernas y glúteos de baja intensidad y buena energía.",
    exercises: [
      { name: "Sentadillas de sumo suaves", reps: 12 },
      { name: "Puente de glúteos clásico", reps: 15 },
      { name: "Zancadas laterales controladas", reps: 10 },
      { name: "Elevación de talones con pies juntos", reps: 20 },
      { name: "Abducción lateral de cadera acostado (por lado)", reps: 12 },
      { name: "Plancha tradicional sobre rodillas (segundos)", reps: 25 }
    ]
  },
  {
    id: "amaterasu", name: "Amaterasu (El Sol Naciente)", culture: "Japón", level: "intermedio", points: 20, rounds: 3,
    description: "Resistencia armónica, balance y flexibilidad en las piernas para el equilibrio del espíritu.",
    exercises: [
      { name: "Sentadilla cosaca controlada (por lado)", reps: 8 },
      { name: "Flexiones clásicas codos pegados al cuerpo", reps: 12 },
      { name: "Postura del árbol isométrica (segundos por lado)", reps: 30 },
      { name: "Abdominales bicicleta rápidos", reps: 20 },
      { name: "Zancadas cruzadas hacia atrás (Curtsy)", reps: 14 },
      { name: "Plancha lateral sobre antebrazos (segundos por lado)", reps: 20 }
    ]
  },
  {
    id: "shinobi", name: "Shinobi (Ninja de las Sombras)", culture: "Japón", level: "intermedio", points: 20, rounds: 3,
    description: "Reta tu balance, ligereza y velocidad de pies con la rutina clásica de espionaje y agilidad.",
    exercises: [
      { name: "Saltos de esquiador de lado a lado (Skater)", reps: 20 },
      { name: "Flexiones Spiderman alternas", reps: 10 },
      { name: "Plancha de antebrazos con toques laterales", reps: 14 },
      { name: "Zancadas hacia atrás con salto ligero", reps: 12 },
      { name: "Giros rusos veloces (Russian Twists)", reps: 20 },
      { name: "Elevación de talones con salto ligero", reps: 15 }
    ]
  },
  {
    id: "hachiman", name: "Hachiman (Disciplina Samurái)", culture: "Japón", level: "avanzado", points: 35, rounds: 4,
    description: "Forja tus hombros y piernas con holds y flexiones de alta disciplina militar samurái.",
    exercises: [
      { name: "Flexiones de picas profundas (Pike Pushups)", reps: 12 },
      { name: "Sentadilla isométrica profunda en pared (segundos)", reps: 45 },
      { name: "Abdominales Hollow Body Hold estrictos (segundos)", reps: 30 },
      { name: "Fondos en silla sin apoyo de pies (piernas rectas)", reps: 10 },
      { name: "Zancadas explosivas saltando continuas", reps: 14 },
      { name: "Plancha tradicional con balanceo de peso (Body Saw)", reps: 12 }
    ]
  },
  {
    id: "fujin", name: "Fujin (Furia del Viento)", culture: "Japón", level: "avanzado", points: 35, rounds: 4,
    description: "Agilidad aérea y ráfagas cardiovasculares diseñadas por el dios del viento japonés.",
    exercises: [
      { name: "Saltos altos con rodillas al pecho (Tuck Jumps)", reps: 10 },
      { name: "Burpees tradicionales rápidos", reps: 10 },
      { name: "Escaladores rápidos en plancha tradicional", reps: 30 },
      { name: "Plancha tradicional con saltos adentro-afuera (Plank Jacks)", reps: 20 },
      { name: "Sentadillas profundas saltando arriba", reps: 15 },
      { name: "Abdominales cruzados rápidos (Bicycle)", reps: 24 }
    ]
  },
  {
    id: "ryujin", name: "Ryujin (El Dragón Marino)", culture: "Japón", level: "espartano", points: 50, rounds: 4,
    description: "Fuerza extrema de core e holds prolongados inspirados en el soberano dragón de las profundidades marinas.",
    exercises: [
      { name: "Abdominales de limpiaparabrisas completos (Wipers)", reps: 16 },
      { name: "Sostener plancha tradicional de antebrazos (segundos)", reps: 60 },
      { name: "Flexiones diamante con hold de 3s abajo", reps: 10 },
      { name: "Abdominales Hollow Body dinámicos (rocking seconds)", reps: 45 },
      { name: "Superman estricto con brazos extendidos (hold segundos)", reps: 30 },
      { name: "Burpees espartanos con lagartija doble abajo", reps: 10 }
    ]
  },
  {
    id: "musashi", name: "Musashi (Camino del Sable)", culture: "Japón", level: "espartano", points: 50, rounds: 4,
    description: "La prueba definitiva de resistencia física y balance. Corta la fatiga al estilo del duelista legendario.",
    exercises: [
      { name: "Sentadillas búlgaras con salto explosivas (por pierna)", reps: 12 },
      { name: "Flexiones de pecho explosivas con palmada", reps: 10 },
      { name: "Sostener sentadilla isométrica profunda (segundos)", reps: 60 },
      { name: "Zancadas con salto alternando verticalmente", reps: 20 },
      { name: "Flexiones Spiderman explosivas alternas", reps: 14 },
      { name: "Abdominales dobles completos (V-Ups estrictos)", reps: 16 }
    ]
  },

  // ============================================================
  // === 6. MONGOLES [8 RUTINAS] ===
  // ============================================================
  {
    id: "altai", name: "Altai (Picos de la Estepa)", culture: "Mongoles", level: "básico", points: 10, rounds: 3,
    description: "Forja estabilidad de piernas y balance en las montañas con sentadillas y pantorrillas.",
    exercises: [
      { name: "Sentadillas clásicas lentas con hold de 1s", reps: 12 },
      { name: "Zancadas hacia atrás pausadas (Reverse Lunge)", reps: 10 },
      { name: "Elevación de talones isométrica (segundos)", reps: 15 },
      { name: "Plancha tradicional sobre rodillas (segundos)", reps: 30 },
      { name: "Puente de glúteos clásico", reps: 12 },
      { name: "Giros de tronco parado suaves", reps: 15 }
    ]
  },
  {
    id: "ordu", name: "Ordu (El Campamento)", culture: "Mongoles", level: "básico", points: 10, rounds: 3,
    description: "La fuerza básica de hombros, espalda y brazos necesaria para la vida nómada de la horda.",
    exercises: [
      { name: "Ángeles de pared de pie (Wall Angels)", reps: 12 },
      { name: "Superman básico con brazos en Y", reps: 10 },
      { name: "Flexiones de pared lentas", reps: 12 },
      { name: "Plancha escapular sobre rodillas", reps: 10 },
      { name: "Abdominales Bird-Dog controlados", reps: 12 },
      { name: "Aperturas de pecho dinámicas", reps: 15 }
    ]
  },
  {
    id: "koke", name: "Koke (El Viento de la Estepa)", culture: "Mongoles", level: "intermedio", points: 20, rounds: 3,
    description: "Entrenamiento cardiovascular medio diseñado para jinetes que recorren llanuras interminables.",
    exercises: [
      { name: "Saltos de estrella rápidos (Jacks)", reps: 20 },
      { name: "Escaladores de montaña estables (Mountain Climbers)", reps: 20 },
      { name: "Zancadas alternas dinámicas hacia atrás", reps: 16 },
      { name: "Saltos rápidos laterales", reps: 16 },
      { name: "Sentadillas de sumo profundas", reps: 15 },
      { name: "Plancha de antebrazos clásica (segundos)", reps: 35 }
    ]
  },
  {
    id: "nayan", name: "Nayan (El Arquero Ecuestre)", culture: "Mongoles", level: "intermedio", points: 20, rounds: 3,
    description: "Estabilidad del core y fuerza de hombros media necesaria para apuntar y disparar al cabalgar.",
    exercises: [
      { name: "Superman estricto manteniendo brazos en W", reps: 12 },
      { name: "Flexiones clásicas codos pegados al cuerpo", reps: 10 },
      { name: "Abdominales cortos con giros alternos", reps: 16 },
      { name: "Zancadas cruzadas hacia atrás (Curtsy)", reps: 14 },
      { name: "Plancha tradicional con toques de hombro", reps: 12 },
      { name: "Sostener sentadilla de jinete (segundos)", reps: 30 }
    ]
  },
  {
    id: "tumen", name: "Tumen (El Batallón de Acero)", culture: "Mongoles", level: "avanzado", points: 35, rounds: 4,
    description: "Rutina avanzada de piernas de 4 rondas que forja la resistencia implacable del ejército mongol.",
    exercises: [
      { name: "Sentadillas búlgaras estrictas (por pierna)", reps: 12 },
      { name: "Zancadas con salto alternas y continuas", reps: 16 },
      { name: "Plancha con saltos de pies (Plank Jacks)", reps: 20 },
      { name: "Sentadillas profundas saltando arriba", reps: 12 },
      { name: "Elevación de talones explosiva (pantorrillas)", reps: 30 },
      { name: "Abdominales cortaplumas a una sola pierna", reps: 16 }
    ]
  },
  {
    id: "borte", name: "Borte (Fuerza de la Emperatriz)", culture: "Mongoles", level: "avanzado", points: 35, rounds: 4,
    description: "Un circuito avanzado de core y empuje que rinde tributo a la gran emperatriz gobernante de la estepa.",
    exercises: [
      { name: "Flexiones declinadas estrictas", reps: 15 },
      { name: "Abdominales de bicho muerto muy lentos (Dead Bug)", reps: 16 },
      { name: "Plancha lateral isométrica (segundos por lado)", reps: 40 },
      { name: "Plancha de antebrazos con balanceo (Body Saw)", reps: 14 },
      { name: "Superman dinámico cruzando brazo-pierna", reps: 14 },
      { name: "Caminata de manos adelante-atrás (Walkouts)", reps: 8 }
    ]
  },
  {
    id: "genghis", name: "Gengis Khan (Fuerza del Imperio)", culture: "Mongoles", level: "espartano", points: 50, rounds: 4,
    description: "Demuele tu tren inferior con holds profundos y saltos continuos que forjaron a los jinetes de la estepa.",
    exercises: [
      { name: "Sentadilla isométrica profunda en pared (segundos)", reps: 60 },
      { name: "Zancadas cruzadas con salto explosivo continuo", reps: 16 },
      { name: "Sentadillas clásicas de sumo ultra rápidas", reps: 35 },
      { name: "Elevación de talones a una sola pierna (por lado)", reps: 20 },
      { name: "Burpees con salto de rodillas al pecho (Tuck Jumps)", reps: 8 },
      { name: "Puente de glúteos a una pierna dinámico", reps: 14 }
    ]
  },
  {
    id: "subutai", name: "Subutai (Estratega del Colapso)", culture: "Mongoles", level: "espartano", points: 50, rounds: 4,
    description: "La prueba definitiva de cardio y fuerza de combate inspirada en el general invicto más grande de la horda.",
    exercises: [
      { name: "Burpees espartanos con flexión explosiva abajo", reps: 12 },
      { name: "Flexiones Spiderman veloces y profundas", reps: 16 },
      { name: "Sentadillas con salto vertical cayendo profundo", reps: 20 },
      { name: "Abdominales dobles completos (V-Ups estrictos)", reps: 16 },
      { name: "Plancha tradicional subiendo a manos (Comandos)", reps: 16 },
      { name: "Escaladores de montaña rápidos continuos (segundos)", reps: 30 }
    ]
  },

  // ============================================================
  // === 7. MAYAS [8 RUTINAS] ===
  // ============================================================
  {
    id: "ixchel", name: "Ixchel (La Luna Maya)", culture: "Mayas", level: "básico", points: 10, rounds: 3,
    description: "Estiramientos, balance y respiración profunda inspirados por la diosa lunar maya de la salud.",
    exercises: [
      { name: "Estiramiento Gato-Camello lento", reps: 12 },
      { name: "Postura del árbol balance suave (segundos por lado)", reps: 15 },
      { name: "Superman estricto con brazos en Y", reps: 10 },
      { name: "Zancadas laterales suaves alternadas", reps: 10 },
      { name: "Puente de glúteos clásico pausado", reps: 12 },
      { name: "Marcha suave en el sitio levantando rodillas (segundos)", reps: 30 }
    ]
  },
  {
    id: "kinal", name: "Kinal (Sacerdote del Sol)", culture: "Mayas", level: "básico", points: 10, rounds: 3,
    description: "Despierta tu flexibilidad y core básico con holds diseñados para una mañana de energía selvática.",
    exercises: [
      { name: "Plancha sobre rodillas sosteniendo balance (segundos)", reps: 25 },
      { name: "Superman básico levantando brazos y piernas", reps: 10 },
      { name: "Rotación de hombros parado adelante/atrás", reps: 12 },
      { name: "Sentadillas sumo lentas y profundas", reps: 10 },
      { name: "Abdominales Bird-Dog lentos y controlados", reps: 10 },
      { name: "Elevación de talones suave con respiración", reps: 15 }
    ]
  },
  {
    id: "chaac", name: "Chaac (La Fuerza del Agua)", culture: "Mayas", level: "intermedio", points: 20, rounds: 3,
    description: "Fluye como una tormenta con movimientos pliométricos de empuje lateral y resistencia abdominal.",
    exercises: [
      { name: "Saltos de esquiador de lado a lado (Skater)", reps: 20 },
      { name: "Sentadillas sumo dinámicas (rápidas)", reps: 15 },
      { name: "Plancha tradicional con toques de hombro alternos", reps: 16 },
      { name: "Elevación de talones con salto ligero", reps: 20 },
      { name: "Abdominales cortos con piernas elevadas a 90 grados", reps: 15 },
      { name: "Flexiones declinadas suaves (pies en sofá)", reps: 10 }
    ]
  },
  {
    id: "balam",
    name: "Balam (Jaguar Joven)",
    culture: "Mayas",
    level: "intermedio",
    points: 20,
    rounds: 3,
    description: "Core y balance de agilidad felina para cazadores de la selva profunda de Yucatán.",
    exercises: [
      { name: "Flexiones Spiderman alternas", reps: 10 },
      { name: "Sentadilla isométrica profunda (segundos)", reps: 30 },
      { name: "Abdominales de bicho muerto (Dead Bug)", reps: 16 },
      { name: "Plancha lateral con pierna apoyada (segundos por lado)", reps: 20 },
      { name: "Zancadas hacia atrás con cruce (Curtsy)", reps: 14 },
      { name: "Marcha alta en el sitio a ritmo rápido (segundos)", reps: 30 }
    ]
  },
  {
    id: "kukulkan", name: "Kukulkán (La Serpiente Isométrica)", culture: "Mayas", level: "avanzado", points: 35, rounds: 4,
    description: "Fuerza excéntrica, holds prolongados de 1 minuto y empuje asimétrico de la selva profunda.",
    exercises: [
      { name: "Flexiones de arquero controladas (Archer Pushups)", reps: 10 },
      { name: "Sentadillas de sumo profundas con pausa de 2s abajo", reps: 16 },
      { name: "Plancha isométrica tradicional estricta (segundos)", reps: 60 },
      { name: "Abdominales cortaplumas a una sola pierna alternos", reps: 16 },
      { name: "Superman estricto con brazos en W con hold de 3s", reps: 12 },
      { name: "Zancadas cruzadas profundas (por lado)", reps: 10 }
    ]
  },
  {
    id: "itzamna", name: "Itzamná (Fuerza de la Creación)", culture: "Mayas", level: "avanzado", points: 35, rounds: 4,
    description: "Entrenamiento de holds y control mental. Reta la resistencia muscular y la sabiduría de la calistenia maya.",
    exercises: [
      { name: "Hold isométrico de flexión de pecho abajo (segundos)", reps: 15 },
      { name: "Abdominales Hollow Body Hold estático (segundos)", reps: 30 },
      { name: "Sentadilla isométrica recargado en pared (segundos)", reps: 45 },
      { name: "Puente de glúteos a una sola pierna con hold (segundos)", reps: 20 },
      { name: "Sostener zancada profunda estática (segundos por lado)", reps: 20 },
      { name: "Plancha lateral estricta sobre antebrazos (segundos por lado)", reps: 30 }
    ]
  },
  {
    id: "huracan", name: "Huracán (Furia Destructiva)", culture: "Mayas", level: "espartano", points: 50, rounds: 4,
    description: "4 rondas de pura furia bélica maya. Rompe los récords con saltos explosivos y burpees implacables.",
    exercises: [
      { name: "Burpees espartanos con flexión explosiva", reps: 12 },
      { name: "Sentadillas con salto vertical explosivo máximo", reps: 20 },
      { name: "Flexiones Spiderman veloces y continuas", reps: 16 },
      { name: "Abdominales dobles completos (V-Ups estrictos)", reps: 16 },
      { name: "Plancha de antebrazos subiendo a manos (Comandos)", reps: 16 },
      { name: "Saltos de rodillas al pecho (Tuck Jumps)", reps: 10 }
    ]
  },
  {
    id: "kinich", name: "Kinich (El Sol de Guerra)", culture: "Mayas", level: "espartano", points: 50, rounds: 4,
    description: "El entrenamiento definitivo del astro rey maya. Fuerza excéntrica pesada combinada con cardio espartano.",
    exercises: [
      { name: "Flexiones de arquero estrictas (Archer Pushups)", reps: 12 },
      { name: "Sentadillas búlgaras con salto explosivas (por pierna)", reps: 10 },
      { name: "Flexiones diamante con pausa de 3s abajo", reps: 10 },
      { name: "Zancadas con salto alternando verticalmente", reps: 20 },
      { name: "Plancha tradicional con saltos adentro-afuera (Plank Jacks)", reps: 20 },
      { name: "Burpees tradicionales con caída profunda de pecho", reps: 10 }
    ]
  },

  // ============================================================
  // === 8. AZTECAS [8 RUTINAS] ===
  // ============================================================
  {
    id: "chinampa", name: "Chinampa (Cultivador del Lago)", culture: "Aztecas", level: "básico", points: 10, rounds: 3,
    description: "Fuerza básica y movilidad espinal necesaria para cultivar las míticas islas flotantes del lago azteca.",
    exercises: [
      { name: "Estiramiento lumbar Gato-Camello controlado", reps: 12 },
      { name: "Sentadillas clásicas asistidas", reps: 12 },
      { name: "Ángeles de pared de pie (Wall Angels)", reps: 12 },
      { name: "Abdominales Bird-Dog controlados", reps: 12 },
      { name: "Puente de glúteos clásico", reps: 12 },
      { name: "Elevación de talones controlada", reps: 20 }
    ]
  },
  {
    id: "tlaloc_b", name: "Tláloc (Gota de Lluvia)", culture: "Aztecas", level: "básico", points: 10, rounds: 3,
    description: "Inicia la estabilidad de core e hombros con la bendición del dios azteca de la lluvia.",
    exercises: [
      { name: "Plancha de antebrazos básica con rodillas apoyadas", reps: 12 },
      { name: "Superman básico con brazos en Y", reps: 10 },
      { name: "Flexiones inclinadas controladas (en pared o mesa)", reps: 12 },
      { name: "Abdominales cortos con rodillas flexionadas", reps: 12 },
      { name: "Zancadas hacia atrás pausadas", reps: 10 },
      { name: "Marcha con rodillas altas controlando balance (segundos)", reps: 30 }
    ]
  },
  {
    id: "macuahuitl", name: "Macuahuitl (Sable de Obsidiana)", culture: "Aztecas", level: "intermedio", points: 20, rounds: 3,
    description: "Resistencia de core y brazos necesaria para empuñar el temido sable de madera y obsidiana azteca.",
    exercises: [
      { name: "Flexiones clásicas estrictas", reps: 12 },
      { name: "Giros rusos estables (Russian Twists)", reps: 24 },
      { name: "Plancha tradicional con toques de hombro alternos", reps: 16 },
      { name: "Zancadas cruzadas hacia atrás (Curtsy)", reps: 14 },
      { name: "Sentadillas de sumo profundas", reps: 15 },
      { name: "Superman dinámico con brazos en W", reps: 12 }
    ]
  },
  {
    id: "calpulli", name: "Calpulli (Guerrero Común)", culture: "Aztecas", level: "intermedio", points: 20, rounds: 3,
    description: "El entrenamiento cardiovascular y físico de las milicias populares del imperio azteca.",
    exercises: [
      { name: "Saltos de estrella rápidos (Jacks)", reps: 20 },
      { name: "Escaladores de montaña estables (Mountain Climbers)", reps: 20 },
      { name: "Sentadillas clásicas con salto ligero", reps: 12 },
      { name: "Saltos rápidos de lado a lado", reps: 16 },
      { name: "Plancha tradicional apoyando antebrazos (segundos)", reps: 30 },
      { name: "Marcha con rodillas altas a ritmo rápido (segundos)", reps: 30 }
    ]
  },
  {
    id: "guerrero_jaguar", name: "Guerrero Jaguar (Fuerza Felina)", culture: "Aztecas", level: "avanzado", points: 35, rounds: 4,
    description: "Movilidad animal y flexiones Spiderman de los temidos guerreros élite felinos de Tenochtitlan.",
    exercises: [
      { name: "Flexiones Spiderman controladas profundas", reps: 12 },
      { name: "Caminata de oso estática (rodillas suspendidas segundos)", reps: 30 },
      { name: "Sentadillas búlgaras estrictas (por pierna)", reps: 12 },
      { name: "Zancadas con salto alternando (hold de 1s al caer)", reps: 12 },
      { name: "Abdominales de bicho muerto con hold (Dead Bug)", reps: 16 },
      { name: "Plancha lateral con toques de rodilla a codo", reps: 10 }
    ]
  },
  {
    id: "guerrero_aguila", name: "Guerrero Águila (Salto Imperial)", culture: "Aztecas", level: "avanzado", points: 35, rounds: 4,
    description: "Pliometría y potencia de salto de la orden militar que domina las alturas y los cielos aztecas.",
    exercises: [
      { name: "Sentadillas clásicas con salto vertical explosivo", reps: 16 },
      { name: "Saltos laterales de esquiador (pliométricos)", reps: 20 },
      { name: "Plancha con saltos de pies dentro-fuera (Plank Jacks)", reps: 20 },
      { name: "Sentadilla sumo con elevación de talones arriba", reps: 15 },
      { name: "Flexiones declinadas estrictas", reps: 12 },
      { name: "Abdominales cortaplumas dobles", reps: 12 }
    ]
  },
  {
    id: "quetzalcoatl", name: "Quetzalcóatl (La Serpiente de Luz)", culture: "Aztecas", level: "espartano", points: 50, rounds: 4,
    description: "Prueba suprema de potencia que forjó a los legendarios Guerreros Águila de Tenochtitlan.",
    exercises: [
      { name: "Burpees espartanos con lagartija doble", reps: 12 },
      { name: "Sentadillas con salto vertical alternando toque de rodilla", reps: 20 },
      { name: "Flexiones diamante estrictas ultra lentas (4s bajando)", reps: 12 },
      { name: "Abdominales dobles completos (piernas y torso)", reps: 16 },
      { name: "Plancha tradicional con saltos de pies (Plank Jacks)", reps: 20 },
      { name: "Flexiones Spiderman combinadas con comando antebrazo", reps: 10 }
    ]
  },
  {
    id: "moctezuma", name: "Emperador Moctezuma (Poder Azteca)", culture: "Aztecas", level: "espartano", points: 50, rounds: 4,
    description: "Gobierna la fatiga con empuje pesado de pino en pared yHolds isométricos extremos de core.",
    exercises: [
      { name: "Flexiones haciendo el pino asistido en pared (Handstand)", reps: 8 },
      { name: "Flexiones de picas explosivas con despegue", reps: 12 },
      { name: "Sentadillas búlgaras con salto explosivas (por pierna)", reps: 10 },
      { name: "Abdominales V-Ups estrictos alternando piernas", reps: 16 },
      { name: "Plancha de antebrazos subiendo a manos (Comandos)", reps: 16 },
      { name: "Sostener plancha tradicional de antebrazos (segundos)", reps: 60 }
    ]
  },

  // ============================================================
  // === 9. INCAS [8 RUTINAS] ===
  // ============================================================
  {
    id: "chasqui", name: "Chasqui (El Mensajero veloz)", culture: "Incas", level: "básico", points: 10, rounds: 3,
    description: "Entrenamiento de cardio y piernas básico para los veloces corredores del correo imperial inca.",
    exercises: [
      { name: "Marcha alta en el sitio levantando rodillas (segundos)", reps: 40 },
      { name: "Zancadas hacia atrás pausadas (Reverse Lunge)", reps: 12 },
      { name: "Sentadillas clásicas con brazos al frente", reps: 12 },
      { name: "Elevación de talones básica (pantorrillas)", reps: 20 },
      { name: "Plancha sobre rodillas sosteniendo balance (segundos)", reps: 25 },
      { name: "Giros de tronco parado suaves", reps: 15 }
    ]
  },
  {
    id: "mama_o_b", name: "Mama Ocllo (Reina Inca)", culture: "Incas", level: "básico", points: 10, rounds: 3,
    description: "Diosa reina y protectora. Forja balance básico y movilidad articular suave con el espíritu andino.",
    exercises: [
      { name: "Estiramiento lumbar Gato-Camello lento", reps: 12 },
      { name: "Postura del árbol balance suave (segundos por lado)", reps: 15 },
      { name: "Superman básico con brazos en Y", reps: 10 },
      { name: "Zancadas laterales suaves", reps: 10 },
      { name: "Puente de glúteos clásico", reps: 12 },
      { name: "Abducción lateral de cadera de lado (por lado)", reps: 12 }
    ]
  },
  {
    id: "inti", name: "Inti (El Fuego del Sol Inca)", culture: "Incas", level: "intermedio", points: 20, rounds: 3,
    description: "Eleva tu temperatura y quema grasa con ejercicios cardiovasculares dinámicos inspirados en el dios solar inca.",
    exercises: [
      { name: "Saltos de estrella rápidos (Jacks)", reps: 20 },
      { name: "Escaladores de montaña estables", reps: 20 },
      { name: "Sentadillas clásicas con salto vertical ligero", reps: 12 },
      { name: "Zancadas dinámicas de lado a lado", reps: 14 },
      { name: "Burpees básicos sin lagartija", reps: 10 },
      { name: "Plancha tradicional con toques de hombro alternos", reps: 12 }
    ]
  },
  {
    id: "capac_nan", name: "Capac Ñan (El Camino Inca)", culture: "Incas", level: "intermedio", points: 20, rounds: 3,
    description: "Forja la resistencia muscular de piernas y core necesaria para construir los caminos imperiales de los Andes.",
    exercises: [
      { name: "Sentadillas de sumo profundas", reps: 15 },
      { name: "Zancadas hacia atrás con salto ligero", reps: 12 },
      { name: "Plancha lateral con pierna apoyada (segundos por lado)", reps: 20 },
      { name: "Abdominales de bicho muerto (Dead Bug)", reps: 16 },
      { name: "Giros rusos estables de lado a lado", reps: 20 },
      { name: "Elevación de talones con salto ligero", reps: 15 }
    ]
  },
  {
    id: "manco_capac", name: "Manco Cápac (Bases de Roca)", culture: "Incas", level: "avanzado", points: 35, rounds: 4,
    description: "Rutina avanzada de 4 rondas de holds y búlgaras para fundar la fuerza andina más estable.",
    exercises: [
      { name: "Sentadillas búlgaras estrictas (por pierna)", reps: 12 },
      { name: "Sostener sentadilla isométrica recargado en pared (segundos)", reps: 45 },
      { name: "Puente de glúteos a una sola pierna con hold (segundos)", reps: 20 },
      { name: "Zancadas con salto alternas y explosivas", reps: 14 },
      { name: "Elevación de talones a una sola pierna (por lado)", reps: 15 },
      { name: "Abdominales cortaplumas a una sola pierna", reps: 16 }
    ]
  },
  {
    id: "viracocha_a", name: "Viracocha (Fuerza Isométrica)", culture: "Incas", level: "avanzado", points: 35, rounds: 4,
    description: "Holds prolongados de 1 minuto y tensión excéntrica lenta inspirada en el dios supremo creador inca.",
    exercises: [
      { name: "Plancha isométrica tradicional estricta (segundos)", reps: 60 },
      { name: "Sostener zancada profunda isométrica (segundos por lado)", reps: 20 },
      { name: "Abdominales Hollow Body Hold estático (segundos)", reps: 30 },
      { name: "Hold isométrico de flexión abajo (segundos)", reps: 15 },
      { name: "Superman dinámico alzando torso y piernas", reps: 15 },
      { name: "Flexiones de picas controladas (Pike)", reps: 12 }
    ]
  },
  {
    id: "atahualpa", name: "Atahualpa (El Último Emperador)", culture: "Incas", level: "espartano", points: 50, rounds: 4,
    description: "4 rondas de holds extremos andinos de piernas y plancha estricta para resistir las pruebas más duras.",
    exercises: [
      { name: "Sostener sentadilla isométrica profunda (segundos)", reps: 60 },
      { name: "Sentadillas búlgaras con salto explosivas (por pierna)", reps: 12 },
      { name: "Zancadas con salto alternando verticalmente", reps: 20 },
      { name: "Abdominales dobles completos (V-Ups estrictos)", reps: 16 },
      { name: "Plancha tradicional subiendo a manos (Comandos)", reps: 16 },
      { name: "Flexiones diamante con pausa de 3s abajo", reps: 10 }
    ]
  },
  {
    id: "pachacutec", name: "Pachacútec (Transformador Cósmico)", culture: "Incas", level: "espartano", points: 50, rounds: 4,
    description: "La prueba suprema andina. Domina la gravedad y el cardio con burpees espartanos y flexiones lentas.",
    exercises: [
      { name: "Burpees espartanos con flexión explosiva abajo", reps: 12 },
      { name: "Zancadas explosivas saltando continuas ultra rápidas", reps: 20 },
      { name: "Plancha tradicional con flexión estricta lenta (5s bajada)", reps: 10 },
      { name: "Abdominales Hollow Body Hold estrictos (segundos)", reps: 45 },
      { name: "Sentadillas con salto vertical cayendo profundo", reps: 20 },
      { name: "Escaladores cruzados rápidos (segundos)", reps: 30 }
    ]
  }
];

// Exponer la constante en el ambiente global (navegador)
if (typeof window !== "undefined") {
  window.FMRoutines = FM_ROUTINES;
}
