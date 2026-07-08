/* ============================================================
 * fm-exercise-help-db.js - Base de conocimiento de ejercicios.
 * DATOS (separados de la logica del modal en fm-exercise-help.js).
 *
 * Estructura:
 *  - window.FM_EX_HELP_BASE: [{ kw:[frases normalizadas], desc, muscles }]
 *      El resolvedor puntua por coincidencia de palabras clave (la mas
 *      especifica gana). Cubre variaciones de un mismo movimiento.
 *  - window.FM_EX_HELP_CATEGORY: { clave:{ match:[kw], desc, muscles } }
 *      Respaldo por disciplina cuando ningun movimiento base calza.
 *
 * Las 'kw' van en forma NORMALIZADA: minusculas, sin acentos, sin signos.
 * ============================================================ */
(function () {
  'use strict';

  // ---- MOVIMIENTOS BASE (del mas especifico al mas generico por score) ----
  window.FM_EX_HELP_BASE = [
    /* ====================== EMPUJE: FLEXIONES / PRESS ====================== */
    { kw: ["flexiones diamante", "diamante"], desc: "En posicion de plancha alta, junta las manos bajo el pecho formando un rombo/diamante con indices y pulgares. Baja el pecho hacia las manos con los codos pegados al cuerpo y empuja con fuerza.", muscles: "Triceps, Pecho interno y Hombros" },
    { kw: ["flexiones spiderman", "spiderman"], desc: "Al bajar el pecho en tu flexion, lleva una rodilla por el costado del cuerpo hacia el codo del mismo lado. Sube y alterna la pierna en cada repeticion.", muscles: "Pecho, Triceps, Core y Oblicuos" },
    { kw: ["flexiones declinadas", "declinadas", "pies elevados"], desc: "Coloca los pies elevados sobre una silla, banco o sofa y las manos en el suelo al ancho de hombros. Baja el pecho controladamente y empuja para subir.", muscles: "Pecho superior, Hombros y Triceps" },
    { kw: ["flexiones inclinadas", "inclinadas", "manos elevadas"], desc: "Apoya las manos elevadas sobre una mesa, banco o pared y los pies en el suelo. Baja el pecho hacia el apoyo y empuja. Cuanto mas alto el apoyo, mas facil.", muscles: "Pecho inferior, Hombros y Triceps" },
    { kw: ["flexiones picas", "pike push", "pike", "picas"], desc: "Forma una V invertida con el cuerpo (cadera al techo, manos y pies apoyados). Baja la coronilla hacia el suelo flexionando los codos hacia atras y empuja fuerte.", muscles: "Hombros (Deltoides) y Triceps" },
    { kw: ["flexiones arquero", "archer"], desc: "Con las manos muy abiertas, al bajar dobla solo un codo inclinando el peso a ese lado mientras el otro brazo queda estirado. Sube y alterna de lado.", muscles: "Fuerza unilateral de Pecho, Brazos y Hombros" },
    { kw: ["flexiones explosivas", "explosivas", "despegue", "clap"], desc: "Haz una flexion normal y empuja el suelo tan rapido y fuerte que las manos se despeguen unos centimetros en el punto alto. Cae amortiguando doblando los codos.", muscles: "Potencia explosiva de Pecho y Triceps" },
    { kw: ["flexiones escapulares", "escapular", "escapulares"], desc: "En plancha con brazos rectos (sin doblar codos), deja caer el pecho juntando los omoplatos y luego empuja el suelo abriendo y redondeando la espalda alta.", muscles: "Serrato, Hombros y Espalda alta" },
    { kw: ["flexiones hindu", "hindu"], desc: "Desde una V invertida, sumerge el pecho cerca del suelo describiendo un arco hacia adelante hasta terminar mirando al techo (cobra), y regresa por el mismo camino.", muscles: "Hombros, Pecho, Triceps y Movilidad de columna" },
    { kw: ["flexiones rodillas", "flexiones pecho rodillas"], desc: "Apoya las rodillas en el suelo (cruzando los tobillos) manteniendo la linea recta de rodillas a cabeza. Baja el pecho doblando los codos y empuja.", muscles: "Pecho, Triceps y Hombros" },
    { kw: ["flexiones pared", "flexiones de pared"], desc: "Frente a una pared a un brazo de distancia, apoya las manos al ancho de hombros y baja doblando los codos lentamente. Manten el cuerpo recto.", muscles: "Pecho, Hombros y Triceps" },
    { kw: ["flexiones comando", "comando antebrazo", "commando"], desc: "Desde plancha alta, baja a apoyar un antebrazo y luego el otro (plancha baja), y sube de nuevo a manos alternando el brazo que inicia.", muscles: "Pecho, Triceps, Core y Hombros" },
    { kw: ["flexiones clasicas", "flexiones", "flexion", "lagartija", "push up", "pushup"], desc: "Plancha alta con manos al ancho de hombros. Baja el pecho hacia el suelo con los codos a unos 45 grados (no abiertos) y empuja manteniendo el cuerpo firme como tabla.", muscles: "Pecho, Triceps y Hombro anterior" },
    { kw: ["handstand pushups", "handstand", "pino", "parada manos"], desc: "Sube a parada de manos apoyado en la pared. Baja la cabeza hacia el suelo doblando los codos de forma controlada y empuja hasta estirar los brazos.", muscles: "Hombros, Triceps y Core" },
    { kw: ["press banca", "press de banca", "press pecho maquina", "press pecho"], desc: "Acostado en banco, baja la barra o mancuernas al pecho con los codos a 45 grados y empuja hacia arriba hasta casi estirar los brazos, sin bloquear de golpe.", muscles: "Pecho, Triceps y Hombro anterior" },
    { kw: ["press inclinado", "inclinado mancuernas"], desc: "En banco inclinado (30-45 grados), baja las mancuernas o barra a la parte alta del pecho y empuja hacia arriba juntandolas ligeramente.", muscles: "Pecho superior, Hombro anterior y Triceps" },
    { kw: ["press militar", "press hombros", "press de hombros", "overhead press", "press push", "push press"], desc: "De pie o sentado con la espalda recta, empuja la barra o mancuernas desde los hombros hasta arriba de la cabeza sin arquear la lumbar. Baja controlando.", muscles: "Hombros (Deltoides), Triceps y Core" },
    { kw: ["press frances", "frances", "skull crusher"], desc: "Acostado, con barra Z o mancuernas sobre el pecho, baja el peso hacia la frente doblando solo los codos (los brazos fijos) y estira para subir.", muscles: "Triceps" },
    { kw: ["aperturas pecho", "aperturas", "cruces", "cruces polea", "apertura pecho"], desc: "Con brazos ligeramente flexionados, abre en arco amplio hasta sentir el estiramiento del pecho y junta las manos al frente apretando el pectoral.", muscles: "Pecho" },

    /* ====================== TRACCION: ESPALDA / BICEPS ====================== */
    { kw: ["dominadas asistidas", "asistidas banda", "dominadas banda"], desc: "Coloca una banda elastica en la barra y apoya rodilla o pie en ella. Cuelga y jala el cuerpo hasta pasar la barbilla la barra; la banda te ayuda en el punto bajo.", muscles: "Espalda (Dorsal) y Biceps" },
    { kw: ["dominadas", "pull up", "pullup"], desc: "Cuelga de la barra con manos mas abiertas que los hombros. Jala con la espalda y biceps hasta pasar la barbilla la barra y baja lento sin balancearte.", muscles: "Espalda completa (Dorsal) y Biceps" },
    { kw: ["jalon pecho", "jalon al pecho", "jalon"], desc: "Sentado en la polea alta, jala la barra hacia la parte alta del pecho llevando los codos hacia abajo y atras, apretando la espalda. Sube controlando.", muscles: "Dorsal ancho y Biceps" },
    { kw: ["remo mochila", "remo con mochila"], desc: "Inclinado con la espalda recta, sostiene la mochila con peso colgando y jalala hacia el abdomen llevando los codos atras. Baja controlando.", muscles: "Espalda media, Dorsal y Biceps" },
    { kw: ["remo polea", "remo sentado", "remo en polea"], desc: "Sentado con la espalda recta, jala el agarre hacia el abdomen llevando los codos atras y juntando los omoplatos. Regresa estirando sin encorvarte.", muscles: "Espalda media, Romboides y Biceps" },
    { kw: ["remo invertido", "remo bajo barra", "row suelo", "row barra", "row bajo"], desc: "Boca arriba bajo una barra o mesa firme, cuerpo recto y talones apoyados. Jala el pecho hacia la barra apretando la espalda y baja controlando.", muscles: "Espalda media, Dorsal y Biceps" },
    { kw: ["remo renegado", "renegade"], desc: "En plancha alta sobre dos mancuernas, jala una hacia la cadera manteniendo la cadera estable (sin girar). Baja y alterna el brazo.", muscles: "Espalda, Core y Hombros" },
    { kw: ["remo barra", "remo con barra", "remo mancuernas", "remo"], desc: "Inclinado con la espalda recta y rodillas semiflexionadas, jala la barra o mancuernas hacia el abdomen llevando los codos atras. Baja controlando.", muscles: "Espalda media, Dorsal y Biceps" },
    { kw: ["front lever"], desc: "Colgado de la barra, lleva el cuerpo a horizontal (rigido y paralelo al suelo) apretando dorsales y core. En 'rows' flexiona los brazos manteniendo la horizontal.", muscles: "Dorsal, Core y Espalda completa" },
    { kw: ["curl martillo", "martillo", "hammer"], desc: "De pie con mancuernas, agarre neutro (palmas enfrentadas). Flexiona los codos subiendo el peso sin mover los hombros y baja controlando.", muscles: "Biceps y Braquial (antebrazo)" },
    { kw: ["curl concentrado", "concentrado"], desc: "Sentado, apoya el codo en la cara interna del muslo y sube la mancuerna con control total, apretando el biceps arriba. Baja lento.", muscles: "Biceps (pico)" },
    { kw: ["curl biceps", "curl barra", "curl con barra", "curl alterno", "curl botellas", "curl femoral", "curl mochila", "curl mancuernas", "curl predicador"], desc: "De pie con la espalda recta, flexiona los codos subiendo el peso sin balancear el cuerpo ni mover los hombros. Baja controlando hasta estirar.", muscles: "Biceps" },

    /* ====================== TRICEPS / HOMBROS AISLADOS ====================== */
    { kw: ["extension triceps", "extensiones triceps", "triceps polea", "triceps banco"], desc: "Con los codos fijos y pegados, estira los brazos empujando el peso hacia abajo (polea) o atras hasta bloquear el triceps. Regresa doblando solo el codo.", muscles: "Triceps" },
    { kw: ["patada triceps", "kickback"], desc: "Inclinado, con el brazo pegado al costado y el codo alto, estira el antebrazo hacia atras hasta alinear el brazo. Aprieta el triceps y regresa.", muscles: "Triceps" },
    { kw: ["elevaciones laterales", "elevacion lateral", "laterales hombro"], desc: "De pie con mancuernas a los lados, sube los brazos en arco hacia los lados hasta la altura de los hombros (codos ligeramente flexionados). Baja lento.", muscles: "Hombro lateral (Deltoides medio)" },
    { kw: ["elevaciones frontales", "elevacion frontal"], desc: "De pie, sube el peso al frente con brazos casi rectos hasta la altura de los hombros y baja controlando, sin balanceo.", muscles: "Hombro anterior (Deltoides frontal)" },
    { kw: ["pajaros", "deltoide posterior", "pajaro"], desc: "Inclinado con la espalda recta, abre los brazos hacia los lados (codos leves) apretando la parte alta de la espalda. Baja controlando.", muscles: "Hombro posterior y Espalda alta" },

    /* ====================== PIERNA: SENTADILLAS / ZANCADAS ====================== */
    { kw: ["sentadillas bulgaras", "sentadilla bulgara", "bulgaras", "bulgara"], desc: "Con un pie apoyado atras en una silla y el otro al frente, baja verticalmente doblando la rodilla delantera hasta que el muslo quede paralelo. Espalda recta.", muscles: "Cuadriceps, Gluteos e Isquiotibiales" },
    { kw: ["sentadillas sumo", "sentadilla sumo", "sumo"], desc: "Piernas mas abiertas que los hombros y puntas de los pies hacia afuera. Baja la cadera con la espalda recta hasta que los muslos queden paralelos y sube apretando gluteos.", muscles: "Cuadriceps, Aductores y Gluteos" },
    { kw: ["sentadilla isometrica", "isometrica pared", "wall sit", "silla contra pared"], desc: "Con la espalda contra la pared, baja hasta que los muslos queden paralelos al suelo (rodillas a 90 grados) y sosten esa posicion inmovil apretando las piernas.", muscles: "Cuadriceps y Gluteos (isometria)" },
    { kw: ["sentadilla pistol", "pistol squats", "pistol", "una pierna"], desc: "Sobre una pierna, extiende la otra al frente y baja la cadera controladamente hasta abajo manteniendo el equilibrio. Empuja con el talon para subir. Usa apoyo si hace falta.", muscles: "Cuadriceps, Gluteos y Equilibrio" },
    { kw: ["sentadillas salto", "sentadilla salto", "jump squats", "sentadillas con salto"], desc: "Haz una sentadilla profunda y al subir empuja explosivo despegando los pies del suelo. Cae suave amortiguando con las rodillas y encadena la siguiente.", muscles: "Potencia de piernas y Cardio" },
    { kw: ["sentadilla barra", "sentadilla con barra", "back squat"], desc: "Con la barra sobre los trapecios, baja la cadera flexionando rodillas y cadera con la espalda recta hasta romper el paralelo, y sube empujando con los talones.", muscles: "Cuadriceps, Gluteos e Isquiotibiales" },
    { kw: ["sentadilla frontal", "front squat"], desc: "Con la barra apoyada al frente sobre los hombros y los codos altos, baja manteniendo el torso vertical y sube empujando con los talones.", muscles: "Cuadriceps, Core y Gluteos" },
    { kw: ["sentadillas aire", "sentadillas al aire", "air squat"], desc: "De pie al ancho de hombros, baja la cadera atras y abajo con la espalda recta y el peso en los talones hasta el paralelo, y sube apretando gluteos.", muscles: "Cuadriceps y Gluteos" },
    { kw: ["sentadillas clasicas", "sentadilla clasica", "sentadillas", "sentadilla", "squats", "squat"], desc: "De pie al ancho de hombros, baja la cadera flexionando las rodillas con el peso en los talones y la espalda recta, hasta el paralelo. Sube apretando gluteos.", muscles: "Cuadriceps y Gluteos" },
    { kw: ["zancadas atras", "zancadas hacia atras", "desplante atras"], desc: "Da un paso amplio hacia atras y baja la cadera vertical hasta que ambas rodillas formen 90 grados. Empuja con la pierna delantera para volver.", muscles: "Cuadriceps y Gluteos" },
    { kw: ["zancadas laterales", "zancada lateral"], desc: "Da un paso amplio a un lado doblando esa rodilla mientras la otra pierna queda estirada. Empuja con el pie flexionado para volver al centro.", muscles: "Cuadriceps, Aductores e Interior del muslo" },
    { kw: ["zancadas cruzadas", "curtsy", "zancada cruzada", "zancada cruce", "zancadas cruce"], desc: "Lleva una pierna en diagonal por detras de la otra (como reverencia) y baja la cadera. Empuja para volver y alterna. Manten el torso erguido.", muscles: "Gluteo medio, Cuadriceps y Aductores" },
    { kw: ["zancadas salto", "zancada salto", "salto alternas"], desc: "Desde una zancada baja, salta explosivo e intercambia las piernas en el aire para caer en la zancada contraria amortiguando.", muscles: "Potencia de piernas y Cardio" },
    { kw: ["sostener zancada", "zancada profunda", "zancada isometrica"], desc: "Baja a una zancada profunda (rodilla trasera cerca del suelo) y sosten la posicion inmovil con el torso erguido y el peso repartido.", muscles: "Cuadriceps y Gluteos (isometria)" },
    { kw: ["zancadas alternas", "zancadas caminando", "zancadas", "zancada", "desplante"], desc: "Da un paso amplio al frente y baja la cadera hasta que ambas rodillas formen 90 grados, sin que la rodilla delantera pase la punta del pie. Alterna piernas.", muscles: "Cuadriceps y Gluteos" },

    /* ====================== PIERNA: POSTERIOR / GLUTEO / GEMELO ====================== */
    { kw: ["peso muerto rumano", "rumano"], desc: "De pie con el peso, baja llevando la cadera hacia atras con las piernas casi rectas y la espalda recta, hasta sentir el estiramiento del femoral. Sube apretando gluteos.", muscles: "Isquiotibiales y Gluteos" },
    { kw: ["peso muerto", "deadlift"], desc: "Con el peso en el suelo, espalda recta y pecho arriba, empuja el suelo con las piernas y extiende la cadera para levantarlo pegado al cuerpo. Baja con control.", muscles: "Cadena posterior: Gluteos, Isquiotibiales y Espalda baja" },
    { kw: ["puente gluteos una pierna", "puente una pierna", "puente pierna"], desc: "Boca arriba con una rodilla doblada y la otra pierna estirada al aire. Empuja con el talon apoyado para subir la cadera manteniendo la pierna elevada.", muscles: "Gluteos, Isquiotibiales y Core" },
    { kw: ["hip thrust"], desc: "Con la espalda alta apoyada en un banco y peso sobre la cadera, empuja hacia arriba hasta alinear tronco y muslos, apretando fuerte los gluteos. Baja con control.", muscles: "Gluteos e Isquiotibiales" },
    { kw: ["puente gluteos", "puente gluteo", "puente de gluteos", "glute bridge", "puente"], desc: "Boca arriba con rodillas dobladas y pies en el suelo, empuja con los talones elevando la pelvis hasta alinear hombros, cadera y rodillas. Aprieta gluteos arriba.", muscles: "Gluteos e Isquiotibiales" },
    { kw: ["patada gluteo", "patada de gluteo", "kickback gluteo"], desc: "En cuadrupedia, lleva un talon hacia el techo manteniendo la rodilla a 90 grados sin arquear la lumbar. Aprieta el gluteo arriba y baja controlando.", muscles: "Gluteo mayor" },
    { kw: ["abduccion cadera", "abduccion lateral", "elevacion lateral pierna", "abductor"], desc: "Acostado de lado o de pie, eleva la pierna estirada hacia el lado con control sin girar la cadera. Baja lento sin descansar del todo.", muscles: "Gluteo medio y Abductores" },
    { kw: ["aductor", "aductores"], desc: "Junta las piernas contra resistencia (maquina o banda) llevando la pierna hacia la linea media del cuerpo con control. Regresa lento.", muscles: "Aductores (interior del muslo)" },
    { kw: ["curl femoral maquina", "curl femoral"], desc: "Boca abajo en la maquina, flexiona las rodillas llevando los talones hacia los gluteos con control y baja resistiendo el peso.", muscles: "Isquiotibiales" },
    { kw: ["extensiones cuadriceps", "extension cuadriceps", "extensiones cuadriceps maquina"], desc: "Sentado en la maquina, extiende las rodillas subiendo el peso hasta casi estirar y baja controlando sin soltar de golpe.", muscles: "Cuadriceps" },
    { kw: ["prensa piernas", "prensa de piernas", "leg press"], desc: "En la prensa, baja la plataforma flexionando las rodillas hacia el pecho (sin despegar la lumbar) y empuja hasta casi estirar, sin bloquear de golpe.", muscles: "Cuadriceps, Gluteos e Isquiotibiales" },
    { kw: ["elevacion talones", "elevaciones talones", "gemelos", "calf raise", "pantorrillas"], desc: "De pie (o en maquina), eleva los talones subiendo sobre las puntas de los pies lo mas alto posible, aprieta arriba y baja lento estirando el gemelo.", muscles: "Gemelos y Soleo (pantorrillas)" },

    /* ====================== CORE / ABDOMEN ====================== */
    { kw: ["plancha lateral", "side plank"], desc: "Apoyado sobre un antebrazo de lado, con el cuerpo en linea recta y la cadera elevada. Sosten la posicion apretando los oblicuos sin dejar caer la cadera.", muscles: "Oblicuos y Core lateral" },
    { kw: ["plancha saltos", "plank jacks", "plancha con saltos", "plank jack"], desc: "En posicion de plancha, abre y cierra los pies con pequenos saltos (como jumping jack) manteniendo el core firme y la cadera estable.", muscles: "Core, Hombros y Cardio" },
    { kw: ["body saw", "plancha balanceo", "balanceo"], desc: "En plancha baja de antebrazos, desliza el cuerpo rigido unos centimetros al frente y atras usando solo las puntas de los pies, sin doblar la cintura.", muscles: "Core profundo" },
    { kw: ["plancha toque hombro", "shoulder tap"], desc: "En plancha alta, toca con una mano el hombro contrario manteniendo la cadera lo mas quieta posible (sin girar). Alterna.", muscles: "Core, Anti-rotacion y Hombros" },
    { kw: ["plancha antebrazos", "plancha tradicional", "plancha isometrica", "plancha", "plank"], desc: "Apoya antebrazos y puntas de los pies. Manten el cuerpo en linea recta apretando abdomen, gluteos y piernas, sin dejar caer ni subir la cadera.", muscles: "Core total (Abdomen, Espalda y Hombros)" },
    { kw: ["mountain climbers", "escaladores montana", "escaladores"], desc: "En plancha alta con manos bajo los hombros, lleva alternadamente las rodillas hacia el pecho de forma rapida y ritmica, con el core firme.", muscles: "Core, Cardio y Hombros" },
    { kw: ["abdominales bicicleta", "bicicleta", "bicycle"], desc: "Boca arriba, lleva codo hacia la rodilla contraria mientras estiras la otra pierna, alternando lados de forma fluida como pedaleando.", muscles: "Abdomen y Oblicuos" },
    { kw: ["abdominales cruzados", "codo rodilla", "cruzados"], desc: "Boca arriba, lleva el codo hacia la rodilla contraria contrayendo el abdomen y alterna. No tires del cuello.", muscles: "Abdomen y Oblicuos" },
    { kw: ["giros rusos", "russian twist", "giros tronco", "giro tronco"], desc: "Sentado con el torso inclinado atras y los pies elevados o apoyados, gira el tronco de lado a lado llevando las manos a tocar junto a la cadera.", muscles: "Oblicuos y Core" },
    { kw: ["hollow body", "hollow"], desc: "Boca arriba, despega cabeza, omoplatos y piernas unos centimetros manteniendo la lumbar totalmente pegada al suelo. Sosten apretando el abdomen.", muscles: "Abdomen profundo (isometria)" },
    { kw: ["dead bug", "bicho muerto", "abdominales bicho"], desc: "Boca arriba con brazos y rodillas a 90 grados. Baja de forma alterna un brazo y la pierna contraria estirandolos sin arquear la lumbar. Regresa y alterna.", muscles: "Core profundo y Estabilidad" },
    { kw: ["bird dog", "abdominales bird"], desc: "En cuadrupedia, estira el brazo al frente y la pierna contraria atras hasta quedar paralelos al suelo. Sosten 1s equilibrando, baja y alterna.", muscles: "Core, Lumbar y Gluteos" },
    { kw: ["v ups", "abdominales ups", "cortaplumas", "v up"], desc: "Boca arriba estirado, sube simultaneamente torso y piernas rectas formando una V y toca los pies en el aire. Baja controlando.", muscles: "Abdomen completo" },
    { kw: ["limpiaparabrisas", "wipers", "windshield"], desc: "Boca arriba con brazos en cruz y piernas juntas estiradas a 90 grados, baja las piernas de lado a lado rozando el suelo con control.", muscles: "Oblicuos, Core e Hip flexors" },
    { kw: ["elevacion piernas", "elevaciones piernas", "leg raise", "leg raises", "toes to bar"], desc: "Boca arriba o colgado, sube las piernas rectas controlando con el abdomen (colgado: hasta la barra) y baja lento sin arquear la lumbar.", muscles: "Abdomen inferior e Hip flexors" },
    { kw: ["rodillas al pecho", "rodillas pecho", "knee tuck"], desc: "Sentado o colgado, lleva las rodillas hacia el pecho contrayendo el abdomen y regresa con control sin balancearte.", muscles: "Abdomen inferior" },
    { kw: ["superman", "superman brazos"], desc: "Boca abajo con brazos y piernas estirados. Contrae espalda baja y gluteos para despegar a la vez pecho, manos y muslos unos centimetros. Baja controlando.", muscles: "Espalda baja, Lumbar y Gluteos" },
    { kw: ["heel taps", "toques talon"], desc: "Boca arriba con rodillas dobladas, levanta cabeza y hombros y alterna tocando con cada mano el talon del mismo lado flexionando el costado.", muscles: "Oblicuos" },
    { kw: ["abdominales cortos", "crunch", "abdominales", "sit up", "sit ups"], desc: "Boca arriba con rodillas dobladas, contrae el abdomen para despegar los omoplatos (crunch) o el torso completo (sit-up). No tires del cuello.", muscles: "Abdomen" },

    /* ====================== CARDIO / HIIT / PLIOMETRIA ====================== */
    { kw: ["burpees flexion", "burpee flexion", "lagartija doble", "burpees espartanos"], desc: "Baja a cuclillas, salta a plancha y haz una (o dos) flexiones completas, regresa los pies de un salto y brinca arriba con las manos.", muscles: "Cuerpo completo, Fuerza y Cardio" },
    { kw: ["burpees salto", "burpee salto"], desc: "Cuclillas, salta atras a plancha, regresa los pies de un salto y termina con un brinco explosivo hacia arriba aplaudiendo.", muscles: "Cuerpo completo y Cardio" },
    { kw: ["burpees lagartija", "sin lagartija", "burpees tradicionales", "burpees", "burpee"], desc: "De pie, baja a cuclillas, salta los pies atras a plancha (flexion opcional), regresa de un salto y levantate con un brinco.", muscles: "Cardio, Resistencia y Cuerpo completo" },
    { kw: ["jumping jacks", "saltos estrella", "jacks"], desc: "Salta abriendo piernas y subiendo las manos sobre la cabeza para tocar las palmas, luego salta cerrando pies y bajando brazos, a ritmo veloz.", muscles: "Cardio, Hombros y Pantorrillas" },
    { kw: ["plank jacks"], desc: "En plancha, abre y cierra los pies con pequenos saltos manteniendo el core firme y la cadera estable.", muscles: "Core y Cardio" },
    { kw: ["marcha alta", "marcha rodillas", "rodillas altas", "high knees", "marcha sentado"], desc: "En el sitio, sube alternadamente las rodillas a la altura de la cadera de forma rapida y ritmica, con el core activo y postura erguida.", muscles: "Cardio, Hip flexors y Piernas" },
    { kw: ["sprint sitio", "sprint en sitio", "sprint"], desc: "Corre en el sitio a maxima velocidad moviendo brazos y piernas con intensidad durante el intervalo de trabajo, luego descansa.", muscles: "Cardio y Piernas" },
    { kw: ["tuck jumps", "tuck jump"], desc: "Salta verticalmente llevando ambas rodillas hacia el pecho en el aire y cae amortiguando con las rodillas para encadenar el siguiente salto.", muscles: "Potencia, Core y Cardio" },
    { kw: ["saltos laterales", "salto lateral", "skater", "esquiador"], desc: "Salta de un lado a otro cayendo sobre una pierna y cruzando ligeramente la otra por detras (como patinador), amortiguando cada aterrizaje.", muscles: "Piernas, Gluteo medio y Cardio" },
    { kw: ["saltos tijera", "tijera"], desc: "Salta alternando la posicion de los pies adelante y atras de forma ritmica, moviendo los brazos en coordinacion.", muscles: "Cardio y Piernas" },

    /* ====================== FONDOS / DIPS ====================== */
    { kw: ["fondos silla", "fondos en silla", "fondos banco", "dips silla"], desc: "Sentado al borde de una silla, apoya las manos en el borde, desliza la cadera al frente y baja doblando los codos hacia atras. Empuja para subir.", muscles: "Triceps, Pecho inferior y Hombros" },
    { kw: ["fondos paralelas", "fondos profundos", "fondos", "dips", "paralelas"], desc: "Sostenido en las paralelas con los brazos rectos, baja doblando los codos hacia atras hasta sentir el pecho y empuja hasta estirar los brazos.", muscles: "Triceps, Pecho inferior y Hombros" },

    /* ====================== YOGA ====================== */
    { kw: ["saludo al sol", "saludo sol", "surya"], desc: "Encadena de pie -> flexion al frente -> plancha -> cobra -> perro boca abajo -> y regreso, sincronizando cada movimiento con la respiracion, con fluidez.", muscles: "Cuerpo completo, Movilidad y Respiracion" },
    { kw: ["perro boca abajo", "perro boca", "downward dog", "adho mukha"], desc: "Forma una V invertida: manos y pies apoyados, cadera al techo, espalda larga y talones buscando el suelo. Respira profundo estirando la cadena posterior.", muscles: "Isquiotibiales, Hombros y Espalda" },
    { kw: ["postura arbol", "postura del arbol", "arbol", "vrksasana", "pararse un pie", "pararse pie"], desc: "De pie sobre una pierna, apoya la planta del otro pie en el tobillo, pantorrilla o muslo (no en la rodilla) y junta las manos al centro. Fija la mirada y respira.", muscles: "Equilibrio, Tobillo y Core" },
    { kw: ["guerrero", "warrior", "virabhadrasana"], desc: "En zancada amplia, flexiona la rodilla delantera a 90 grados con la trasera estirada. Abre el pecho y extiende los brazos, manteniendo la postura firme.", muscles: "Piernas, Cadera y Core" },
    { kw: ["postura nino", "postura del nino", "child pose", "balasana"], desc: "De rodillas, sienta los gluteos sobre los talones, lleva el torso al frente sobre los muslos y extiende los brazos, relajando la espalda y respirando.", muscles: "Estiramiento de espalda, Cadera y Relajacion" },
    { kw: ["cobra", "bhujangasana"], desc: "Boca abajo con las manos bajo los hombros, empuja suave despegando el pecho arqueando la espalda alta, con los codos cerca del cuerpo. Baja controlando.", muscles: "Espalda baja, Core y Apertura de pecho" },
    { kw: ["gato vaca", "gato camello", "estiramiento gato", "cat cow"], desc: "En cuadrupedia, arquea la espalda al techo metiendo la barbilla (gato) y luego hunde la espalda subiendo la cabeza y gluteos (vaca), de forma fluida con la respiracion.", muscles: "Movilidad de columna" },
    { kw: ["crow", "kakasana", "cuervo"], desc: "En cuclillas, apoya las manos al frente y coloca las rodillas sobre la parte alta de los brazos. Inclina el peso adelante despegando los pies y equilibra.", muscles: "Equilibrio de brazos, Core y Muñecas" },
    { kw: ["postura triangulo", "triangulo", "trikonasana"], desc: "Piernas abiertas, inclina el torso hacia un lado bajando una mano hacia el tobillo y subiendo la otra al techo, con el pecho abierto y la mirada arriba.", muscles: "Oblicuos, Cadera y Estiramiento lateral" },
    { kw: ["postura", "asana", "loto", "montana", "tadasana", "silla yoga"], desc: "Adopta la postura con la alineacion indicada, respira de forma lenta y profunda por la nariz y sosten manteniendo el cuerpo estable y relajado.", muscles: "Movilidad, Equilibrio y Respiracion" },

    /* ====================== PILATES ====================== */
    { kw: ["hundred"], desc: "Boca arriba, eleva piernas y torso en hollow, estira los brazos a los lados y bombea arriba y abajo con energia mientras respiras en series de 5.", muscles: "Core profundo y Resistencia abdominal" },
    { kw: ["criss cross"], desc: "Boca arriba en posicion de bicicleta lenta y controlada, lleva el codo hacia la rodilla contraria con pausa, alternando con precision pilates.", muscles: "Oblicuos y Core" },
    { kw: ["scissors", "tijeras pilates"], desc: "Boca arriba con piernas al techo, baja una pierna controlada mientras la otra se acerca al torso (opcional sujetarla), alternando como tijeras.", muscles: "Core, Abdomen inferior y Control" },
    { kw: ["double leg", "single leg", "leg lower", "leg stretch"], desc: "Boca arriba con la lumbar pegada al suelo, extiende y recoge las piernas con control total sin arquear la espalda, coordinando con la respiracion.", muscles: "Core profundo y Abdomen inferior" },
    { kw: ["teaser"], desc: "Desde tumbado, rueda el torso arriba a la vez que elevas las piernas rectas formando una V en equilibrio sobre los gluteos. Baja vertebra a vertebra.", muscles: "Core completo, Control y Equilibrio" },
    { kw: ["roll up", "roll down"], desc: "Tumbado con brazos arriba, rueda el torso hacia adelante vertebra a vertebra hasta tocar los pies y regresa controlando cada segmento de la columna.", muscles: "Abdomen y Movilidad de columna" },
    { kw: ["swimming", "nado"], desc: "Boca abajo con brazos y piernas estirados, alterna subiendo brazo y pierna contraria con pequenos aleteos rapidos manteniendo el core firme.", muscles: "Espalda baja, Gluteos y Core" },
    { kw: ["spine stretch", "saw", "spine"], desc: "Sentado con piernas extendidas, alarga la columna y rueda el torso hacia adelante segmento a segmento buscando estirar, y regresa reconstruyendo la postura.", muscles: "Movilidad de columna y Core" },

    /* ====================== HIPOPRESIVOS / RESPIRACION ====================== */
    { kw: ["activacion transverso", "transverso"], desc: "Metiendo suave el ombligo hacia adentro y arriba, activa el musculo profundo del abdomen sin contener el aire ni mover las costillas. Manten la activacion.", muscles: "Transverso abdominal (core profundo)" },
    { kw: ["apnea costal", "apnea"], desc: "Exhala todo el aire, cierra la glotis (apnea sin aire) y abre las costillas hacia los lados como si inhalaras sin dejar entrar aire. Sosten los segundos indicados y respira.", muscles: "Suelo pelvico y Faja abdominal profunda" },
    { kw: ["apertura costal", "respiracion costal"], desc: "Inhala dirigiendo el aire hacia los lados de las costillas (no al abdomen), sintiendo como se expanden lateralmente, y exhala lento y completo.", muscles: "Diafragma y Musculatura costal" },
    { kw: ["conexion suelo", "suelo pelvico"], desc: "Activa suave el suelo pelvico (como cortar el pis) coordinado con la exhalacion, sin apretar gluteos ni abdomen superficial. Relaja al inhalar.", muscles: "Suelo pelvico" },
    { kw: ["giro columna", "giro de columna"], desc: "Coordina un giro suave y controlado del tronco con la respiracion (o apnea) indicada, manteniendo la faja abdominal profunda activada.", muscles: "Core profundo y Movilidad" },
    { kw: ["respiracion", "diafragmatica", "integrada"], desc: "Inhala profundo por la nariz llevando el aire abajo y exhala lento y completo, alargando la exhalacion. Manten los hombros relajados.", muscles: "Diafragma y Sistema respiratorio" },

    /* ====================== MOVILIDAD / SENIOR ====================== */
    { kw: ["rotacion hombros", "rotacion de hombros", "circulos hombros"], desc: "De pie o sentado, dibuja circulos amplios con los hombros hacia adelante y luego hacia atras, de forma lenta y controlada.", muscles: "Movilidad de hombros" },
    { kw: ["estiramiento cuello", "cuello lateral"], desc: "Lleva suave la oreja hacia el hombro del mismo lado sintiendo el estiramiento del cuello, sin subir el hombro. Sosten y cambia de lado.", muscles: "Cuello y Trapecio superior" },
    { kw: ["estiramiento brazos", "brazos al cielo", "elevacion brazos"], desc: "Sube los brazos estirados por encima de la cabeza (o en T) alargando el cuerpo, respira y baja con control.", muscles: "Hombros y Movilidad" },
    { kw: ["caminar punta", "punta talon", "punta-talon"], desc: "Camina en linea recta apoyando primero el talon y rodando hasta la punta, colocando un pie justo delante del otro para retar el equilibrio.", muscles: "Equilibrio y Tobillos" },
    { kw: ["apertura pecho", "aperturas brazos", "apertura brazos"], desc: "Abre los brazos hacia atras a la altura del pecho juntando los omoplatos para abrir el pecho, y regresa al frente. Movimiento amplio y suave.", muscles: "Pecho, Postura y Espalda alta" },
    { kw: ["estiramiento lumbar", "gato camello lumbar"], desc: "En cuadrupedia, alterna arquear la espalda al techo (gato) y hundirla subiendo la cabeza (camello) de forma fluida para movilizar la zona lumbar.", muscles: "Movilidad lumbar y Espalda" },
    { kw: ["angeles pared", "wall angels", "angeles de pared"], desc: "De espaldas a la pared (cabeza, hombros y gluteos tocando), pon los brazos en forma de cactus contra la pared y deslizalos arriba y abajo sin despegarlos.", muscles: "Espalda alta, Postura y Hombros" },
    { kw: ["alineacion postural", "alineacion", "postura de pie", "standing alignment", "alignment check"], desc: "De pie, alinea tobillos, cadera, hombros y cabeza en una linea vertical, activa suave el abdomen y respira manteniendo la postura neutra.", muscles: "Postura y Core estabilizador" },

    /* ====================== GYM: AISLADOS EXTRA ====================== */
    { kw: ["encogimientos", "shrugs", "trapecio"], desc: "De pie con peso en las manos, eleva los hombros hacia las orejas apretando el trapecio arriba, sin doblar los codos. Baja controlando.", muscles: "Trapecio superior" },
    { kw: ["face pull"], desc: "En polea a la altura de la cara, jala la cuerda hacia la frente abriendo los codos hacia afuera y juntando los omoplatos. Regresa controlando.", muscles: "Hombro posterior y Espalda alta" },
    { kw: ["pullover"], desc: "Acostado, con una mancuerna sobre el pecho y los brazos casi rectos, bajala por detras de la cabeza en arco hasta estirar el dorsal y regresa apretando.", muscles: "Dorsal ancho y Pecho" },
    { kw: ["press arnold", "arnold"], desc: "Sentado, arranca con las palmas hacia ti a la altura del pecho y empuja hacia arriba girando las munecas hasta terminar con las palmas al frente. Invierte al bajar.", muscles: "Hombros (los tres deltoides) y Triceps" },
    { kw: ["press cerrado", "cerrado banca"], desc: "En banca, con las manos al ancho de los hombros (agarre cerrado), baja la barra al pecho con los codos pegados y empuja enfocando el triceps.", muscles: "Triceps y Pecho interno" },
    { kw: ["thruster", "thrusters"], desc: "Sostiene el peso a la altura de los hombros, haz una sentadilla completa y al subir usa el impulso para empujar el peso por encima de la cabeza en un solo movimiento.", muscles: "Cuerpo completo: Piernas, Hombros y Core" },
    { kw: ["swing kettlebell", "swing mochila", "swings barra", "swing", "kettlebell"], desc: "Con la pesa entre las piernas, empuja la cadera hacia atras y luego proyectala al frente con fuerza para elevar el peso hasta la altura del pecho por impulso. La fuerza sale de la cadera.", muscles: "Gluteos, Isquiotibiales y Core" },
    { kw: ["step ups", "step up", "subir cajon"], desc: "Sube a un escalon o cajon apoyando todo el pie y empujando con esa pierna hasta quedar de pie arriba. Baja controlando y alterna (o hazlo explosivo si se indica).", muscles: "Cuadriceps y Gluteos" },
    { kw: ["extension rodilla sentado", "extension rodilla"], desc: "Sentado, extiende la rodilla subiendo el pie hasta estirar la pierna, aprieta el cuadriceps arriba y baja controlando.", muscles: "Cuadriceps" },
    { kw: ["talones gluteo", "talones al gluteo", "patada gluteo cuadrupedia", "donkey kick"], desc: "En cuadrupedia (o en carrera), lleva el talon hacia el gluteo. En cuadrupedia sube la rodilla doblada hacia el techo apretando el gluteo sin arquear la lumbar.", muscles: "Gluteos e Isquiotibiales" },
    { kw: ["clamshells", "clamshell", "almeja"], desc: "Acostado de lado con las rodillas dobladas, manten los pies juntos y abre la rodilla de arriba como una almeja apretando el gluteo, sin girar la cadera atras. Cierra controlando.", muscles: "Gluteo medio" },

    /* ====================== CALISTENIA AVANZADA ====================== */
    { kw: ["muscle up", "muscle ups"], desc: "Colgado, haz una dominada explosiva jalando el pecho a la barra y en el punto alto gira las munecas para pasar sobre la barra y termina empujando con los brazos (transicion a fondo).", muscles: "Espalda, Pecho, Triceps y Core" },
    { kw: ["l sit", "lsit"], desc: "Apoyado en el suelo o en barras, eleva el cuerpo y sosten las piernas rectas al frente formando una L a 90 grados con el torso, apretando el abdomen.", muscles: "Abdomen, Hip flexors y Triceps" },
    { kw: ["dragon flag"], desc: "Acostado en un banco, sujetate detras de la cabeza y eleva el cuerpo rigido como una tabla apoyando solo la parte alta de la espalda. En negativo, baja el cuerpo recto muy lento.", muscles: "Core completo (muy avanzado)" },
    { kw: ["human flag"], desc: "Sujeto a una barra vertical con las manos, tensa todo el cuerpo para elevarlo lateralmente hasta quedar horizontal como una bandera. Requiere fuerza extrema de hombros y core.", muscles: "Hombros, Core y Espalda (elite)" },
    { kw: ["planche", "planche tuck", "planche combos"], desc: "En apoyo de manos, inclina los hombros muy al frente de las munecas y despega los pies buscando quedar horizontal (recoge las rodillas en la version tuck). Aprieta hombros y core.", muscles: "Hombros, Core y Muñecas (elite)" },
    { kw: ["back lever"], desc: "Colgado de la barra, pasa las piernas y baja el cuerpo boca abajo hasta quedar horizontal y rigido mirando al suelo, apretando dorsales y core.", muscles: "Dorsal, Core y Hombros (avanzado)" },
    { kw: ["negativas dominada", "negativa dominada", "negativas"], desc: "Parte con la barbilla sobre la barra (con salto o apoyo) y baja el cuerpo lo mas lento posible resistiendo con la espalda y biceps hasta estirar los brazos.", muscles: "Espalda y Biceps (fase excentrica)" },
    { kw: ["chin ups", "chin up"], desc: "Cuelga de la barra con las palmas hacia ti (supinas) al ancho de hombros y jala hasta pasar la barbilla la barra, enfatizando el biceps. Baja controlando.", muscles: "Biceps y Dorsal" },
    { kw: ["kip ups", "kip", "kipping"], desc: "Genera impulso con la cadera y las piernas para asistir el movimiento en la barra de forma ritmica y coordinada. Usa el balanceo del cuerpo, no solo los brazos.", muscles: "Core, Cadera y Espalda" },
    { kw: ["walkouts", "caminata manos", "walkout"], desc: "De pie, flexiona al frente, apoya las manos y camina con ellas hacia adelante hasta la plancha, haz una pausa y camina de regreso a los pies para incorporarte.", muscles: "Core, Hombros y Movilidad" },
    { kw: ["caminata oso", "bear crawl", "cangrejo"], desc: "En cuadrupedia con las rodillas suspendidas a un palmo del suelo, avanza (o sosten) moviendo mano y pie contrarios, con la cadera baja y el core firme.", muscles: "Core, Hombros y Piernas" },

    /* ====================== CARDIO EXTRA / CAMINATA / TROTE ====================== */
    { kw: ["skipping", "cuerda", "salto cuerda", "jump rope"], desc: "Salta la cuerda (o simula el gesto) con saltos pequenos sobre las puntas de los pies, girando la cuerda con las munecas a ritmo constante.", muscles: "Cardio, Pantorrillas y Coordinacion" },
    { kw: ["trote", "trotar", "correr sitio", "jogging", "running"], desc: "Trota a ritmo constante y sostenible manteniendo la postura erguida, la pisada suave y una respiracion regular. Ajusta la intensidad segun el intervalo.", muscles: "Cardio y Piernas" },
    { kw: ["caminata", "caminar", "paso lateral", "caminar punta"], desc: "Camina a paso firme con la postura erguida, braceo natural y pisada de talon a punta. Ajusta el ritmo (rapido, lateral o de enfriamiento) segun lo indicado.", muscles: "Cardio suave y Piernas" },
    { kw: ["toques talon", "toque talon", "toques laterales", "toque punta"], desc: "De pie, alterna tocando con la punta del pie al frente o al lado a ritmo, moviendo los brazos en coordinacion. Manten el core activo.", muscles: "Cardio y Coordinacion" },
    { kw: ["elevacion rodilla apoyo", "elevacion rodillas caminando"], desc: "Sube alternadamente la rodilla hacia la cadera con control (usa un apoyo para el equilibrio si hace falta) y baja el pie con suavidad.", muscles: "Hip flexors, Piernas y Equilibrio" },

    /* ====================== PILATES EXTRA ====================== */
    { kw: ["shoulder bridge", "puente pilates"], desc: "Boca arriba, eleva la cadera a un puente y, manteniendola arriba, extiende una pierna al techo y bajala con control (opcional). Regresa vertebra a vertebra.", muscles: "Gluteos, Isquiotibiales y Core" },
    { kw: ["side kick", "side kick series", "patada lateral pilates"], desc: "Acostado de lado y alineado, eleva la pierna de arriba y llevala al frente y atras (o arriba y abajo) con control, manteniendo el tronco estable.", muscles: "Gluteos, Aductores y Core" },
    { kw: ["side lying leg", "leg lifts lado"], desc: "Acostado de lado con el cuerpo alineado, eleva la pierna de arriba estirada con control y bajala sin dejarla caer, sin girar la cadera.", muscles: "Gluteo medio y Aductores" },
    { kw: ["corkscrew", "sacacorchos"], desc: "Boca arriba con piernas juntas al techo, dibuja circulos controlados con ambas piernas hacia un lado y el otro, manteniendo la lumbar estable.", muscles: "Core profundo y Oblicuos" },
    { kw: ["jackknife", "navaja"], desc: "Boca arriba, eleva las piernas y la cadera hacia el techo con control (como una navaja) y desciende vertebra a vertebra sin dejar caer las piernas.", muscles: "Abdomen y Control" },
    { kw: ["mermaid", "sirena"], desc: "Sentado de lado, estira un brazo por encima de la cabeza inclinando el tronco hacia el lado contrario para abrir el costado. Cambia de lado.", muscles: "Oblicuos y Estiramiento lateral" },
    { kw: ["side bend", "inclinacion lateral tronco", "inclinacion lateral"], desc: "De pie o sentado con la espalda recta, inclina el tronco hacia un lado deslizando el brazo por la pierna, sin rotar. Regresa al centro y cambia.", muscles: "Oblicuos y Core lateral" },
    { kw: ["double straight leg", "double leg", "single leg", "leg lower", "leg stretch"], desc: "Boca arriba con la lumbar pegada al suelo, baja y sube las piernas rectas (una o ambas) con control total, sin arquear la espalda, coordinando la respiracion.", muscles: "Core profundo y Abdomen inferior" },
    { kw: ["boomerang"], desc: "Secuencia pilates avanzada que encadena rodar hacia atras, cruzar las piernas y un teaser fluido con circulos de brazos. Control absoluto del centro.", muscles: "Core completo, Control y Equilibrio" },
    { kw: ["rocking boat", "barquito"], desc: "Sentado en equilibrio sobre los gluteos con las piernas recogidas o rectas en V, mecete atras y adelante con control sin perder la forma del abdomen.", muscles: "Core completo y Equilibrio" },
    { kw: ["pelvic tilt", "basculacion pelvica", "imprint"], desc: "Boca arriba, bascula suave la pelvis pegando la lumbar al suelo (imprint) y luego a neutro, con movimiento pequeno y controlado desde el abdomen profundo.", muscles: "Core profundo y Movilidad pelvica" },
    { kw: ["rib cage", "caja costal placement"], desc: "Boca arriba, coloca las costillas en neutro (sin abrirlas hacia arriba) activando suave el abdomen, coordinando con la exhalacion.", muscles: "Core profundo y Alineacion" },
    { kw: ["footwork", "knee stretches", "long stretch", "mat clasico", "mat completo"], desc: "Realiza la secuencia pilates con control y precision, manteniendo el powerhouse activo (abdomen y suelo pelvico) y coordinando cada fase con la respiracion.", muscles: "Core profundo y Control postural" },
    { kw: ["swan", "cisne", "swan prep"], desc: "Boca abajo, activa la espalda para elevar el pecho en extension controlada (como un cisne), manteniendo el cuello largo y los gluteos activos. Baja con control.", muscles: "Espalda baja y Extensores" },

    /* ====================== YOGA EXTRA ====================== */
    { kw: ["piernas arriba pared", "legs up wall", "viparita"], desc: "Acuestate con los gluteos cerca de la pared y sube las piernas apoyadas en ella, relajando la espalda y respirando profundo. Postura restaurativa.", muscles: "Relajacion, Circulacion y Descanso lumbar" },
    { kw: ["forward fold", "doblez adelante", "pinza", "uttanasana"], desc: "De pie o sentado, inclina el tronco hacia adelante desde la cadera con la espalda larga, dejando caer el peso hacia las piernas. Relaja el cuello y respira.", muscles: "Isquiotibiales y Espalda" },
    { kw: ["esfinge", "sphinx"], desc: "Boca abajo apoyando los antebrazos bajo los hombros, eleva suave el pecho abriendo la parte alta de la espalda, con los hombros lejos de las orejas. Respira.", muscles: "Espalda baja y Apertura de pecho" },
    { kw: ["eagle", "garuda", "aguila"], desc: "De pie, cruza un muslo sobre el otro y entrelaza los brazos al frente, baja la cadera manteniendo el equilibrio y la mirada fija. Respira y cambia de lado.", muscles: "Equilibrio, Hombros y Cadera" },
    { kw: ["half moon", "media luna"], desc: "Sobre una pierna, apoya una mano en el suelo al frente y abre el cuerpo hacia un lado elevando la otra pierna paralela al suelo y el brazo al techo. Equilibra.", muscles: "Equilibrio, Cadera y Core" },
    { kw: ["king pigeon", "pigeon", "paloma"], desc: "Desde cuadrupedia, lleva una rodilla hacia la muneca con la espinilla al frente y estira la otra pierna atras, bajando la cadera. Abre el pecho y respira.", muscles: "Apertura de cadera y Flexores" },
    { kw: ["flamingo", "flamenco"], desc: "De pie sobre una pierna, inclina el tronco al frente mientras elevas la otra pierna atras estirada, formando una linea. Manten el equilibrio y respira.", muscles: "Equilibrio, Gluteos e Isquiotibiales" },
    { kw: ["split", "spagat", "apertura piernas"], desc: "Abre las piernas de forma progresiva (al frente o de lado) descendiendo la cadera solo hasta donde permita el estiramiento, sin rebotes y respirando.", muscles: "Isquiotibiales, Aductores y Cadera" },
    { kw: ["headstand", "forearm stand", "parada cabeza", "inversion"], desc: "Prepara una base firme con antebrazos o cabeza y manos, sube las caderas y las piernas con control absoluto (o solo la preparacion). Manten el core firme. Usa pared si hace falta.", muscles: "Hombros, Core y Equilibrio (avanzado)" },

    /* ====================== RECUPERACION / DESCANSO ====================== */
    { kw: ["descanso", "descanso respiratorio", "rest"], desc: "Descansa activamente: respira profundo, relaja los musculos y baja pulsaciones para recuperarte antes de la siguiente ronda.", muscles: "Recuperacion" },
    { kw: ["enfriamiento", "cool down", "vuelta calma"], desc: "Baja la intensidad gradualmente con movimientos suaves y estiramientos ligeros, respirando lento para que el cuerpo vuelva a la calma.", muscles: "Recuperacion y Movilidad" },
    { kw: ["relajacion", "visualizacion", "savasana", "meditacion"], desc: "Acuestate o sientate comodo, cierra los ojos y relaja todo el cuerpo respirando lento y profundo, soltando la tension de cada zona.", muscles: "Relajacion y Sistema nervioso" },
    { kw: ["final stretch", "stretch completo", "estiramiento final", "cool stretch"], desc: "Estira los grupos musculares trabajados manteniendo cada posicion 20-30 segundos sin rebotes, respirando de forma constante.", muscles: "Flexibilidad y Recuperacion" },
    { kw: ["core power", "power sequence", "core sequence", "integracion funcional", "scapular stability", "stability escapular"], desc: "Activa y estabiliza el centro (core) y las escapulas manteniendo el tronco firme y la respiracion controlada durante toda la secuencia de movimientos.", muscles: "Core profundo y Estabilizadores" },
    { kw: ["coreografia", "baile", "pasos baile", "freestyle", "movimientos brazos", "pasos basicos"], desc: "Sigue la coreografia al ritmo de la musica moviendo brazos y piernas con energia y coordinacion, manteniendo el core activo. Disfruta y no pares el movimiento.", muscles: "Cardio, Coordinacion y Cuerpo completo" },
    { kw: ["apreton pelota", "pelota blanda", "grip", "apreton", "toque pulgar", "apertura dedos", "pulgar dedo"], desc: "Aprieta la pelota (o abre y cierra la mano, o toca el pulgar con cada dedo) de forma controlada para activar y fortalecer la mano y el antebrazo. Alterna manos.", muscles: "Mano, Dedos y Antebrazo" },
    { kw: ["sentarse levantarse silla", "sentarse silla", "levantarse silla", "sit to stand"], desc: "Sientate y levantate de una silla firme controlando el movimiento con las piernas, sin impulsarte con las manos si puedes. Ideal funcional para fuerza de piernas.", muscles: "Cuadriceps y Gluteos (funcional)" },
    { kw: ["posicion base cuadrupeda", "cuadrupeda", "cuadrupedia base"], desc: "Colocate en cuatro apoyos con las manos bajo los hombros y las rodillas bajo la cadera, la espalda neutra y el core activo. Es la base de muchos ejercicios.", muscles: "Core estabilizador y Postura" },
    { kw: ["curl abdominal", "abdominal modificado"], desc: "Boca arriba con rodillas dobladas, despega suave la cabeza y los hombros llevando las costillas hacia la pelvis (rango corto), sin tirar del cuello. Baja controlando.", muscles: "Abdomen (version suave)" },
    { kw: ["iron cross", "maltese", "cruz hierro"], desc: "Movimiento de anillas/fuerza de nivel elite: sosten el cuerpo con los brazos extendidos generando maxima tension en hombros, pecho y core. Trabaja solo la preparacion progresiva.", muscles: "Hombros, Pecho y Core (elite)" },
    { kw: ["360 barra", "540 barra", "giro barra", "giros barra"], desc: "Truco de barra: colgado, genera impulso con la cadera para girar el cuerpo alrededor de la barra (360 o 540 grados) y vuelve a agarrarla con control. Requiere agarre firme y practica progresiva.", muscles: "Agarre, Core y Coordinacion (avanzado)" },
    { kw: ["superserie", "super serie", "superset"], desc: "Encadena los dos ejercicios indicados sin descanso entre ellos (por ejemplo curl seguido de extensiones) para maximizar el estimulo. Descansa solo al terminar la pareja.", muscles: "Segun los ejercicios combinados" },
    { kw: ["rolling ball", "rolling", "rodar pelota"], desc: "Sentado y recogido en forma de bola sujetando las piernas, rueda hacia atras sobre la espalda redondeada y regresa a equilibrio sin apoyar los pies, controlando con el abdomen.", muscles: "Core, Control y Masaje espinal" },
    { kw: ["elephant", "footwork banda", "running banda", "standing series"], desc: "Ejercicio de reformer/banda: realiza el movimiento con control y resistencia constante de la banda, manteniendo el powerhouse activo y la alineacion.", muscles: "Core profundo, Piernas y Control" }
  ];

  // ---- RESPALDO POR CATEGORIA (si ningun movimiento base calza) ----
  window.FM_EX_HELP_CATEGORY = {
    yoga: {
      match: ["postura", "asana", "yoga", "namaste", "pranayama", "loto", "cobra", "perro", "guerrero", "arbol", "triangulo", "montana", "saludo", "flow", "pose", "prep", "stand", "fold", "crow", "pigeon", "moon", "eagle", "garuda", "warrior", "balance", "dancer", "natarajasana", "firefly", "tittibhasana", "peacock", "mayurasana", "wheel", "dhanurasana", "utkatasana", "vrksasana", "trikonasana", "balasana", "kakasana", "rueda"],
      desc: "Adopta la postura con la alineacion indicada y respira de forma lenta y profunda por la nariz. Sosten manteniendo el cuerpo estable, activo y relajado, sin forzar.",
      muscles: "Movilidad, Equilibrio y Respiracion"
    },
    pilates: {
      match: ["pilates", "hundred", "teaser", "criss", "scissors", "roll", "swimming", "spine", "control", "powerhouse", "imprint", "mat", "footwork", "boomerang", "corkscrew", "jackknife", "mermaid", "swan", "series", "stretch series"],
      desc: "Realiza el movimiento lento y controlado manteniendo la lumbar estable y el ombligo hacia adentro (powerhouse), coordinando cada fase con la respiracion.",
      muscles: "Core profundo y Control postural"
    },
    hipopresivos: {
      match: ["transverso", "apnea", "costal", "hipopresivo", "hipopresivos", "suelo pelvico", "respiracion", "diafrag", "conexion", "diastasis", "abdominal profundo"],
      desc: "Coordina la respiracion o apnea indicada activando la faja abdominal profunda y el suelo pelvico, sin tensar el abdomen superficial ni los hombros.",
      muscles: "Core profundo, Suelo pelvico y Diafragma"
    },
    cardio: {
      match: ["salto", "sprint", "jump", "jacks", "climbers", "burpee", "cardio", "hiit", "marcha", "rodillas altas", "skater"],
      desc: "Ejecuta el movimiento a buen ritmo durante el intervalo de trabajo manteniendo la tecnica y el core firme, y recupera el aliento en el descanso.",
      muscles: "Cardio, Resistencia y Piernas"
    },
    movilidad: {
      match: ["estiramiento", "movilidad", "rotacion", "circulos", "apertura", "alineacion", "calentamiento", "cuello", "muñeca", "tobillo", "giro", "twist", "stretch", "escapula", "retraccion", "barbilla", "nod", "check", "dedos", "dedo"],
      desc: "Realiza el movimiento de forma lenta y amplia, sin rebotes ni dolor, respirando de manera constante para ganar rango de movimiento y activar la zona.",
      muscles: "Movilidad y Flexibilidad"
    },
    recuperacion: {
      match: ["descanso", "enfriamiento", "relajacion", "cooldown", "cool", "rest", "savasana", "visualizacion", "meditacion", "integracion", "sincronizacion"],
      desc: "Baja la intensidad y recupera: respira lento y profundo, relaja la musculatura trabajada y deja que el cuerpo vuelva a la calma antes de continuar.",
      muscles: "Recuperacion y Respiracion"
    }
  };

  // Respaldo global (ultimo recurso)
  window.FM_EX_HELP_GENERIC = {
    desc: "Realiza este ejercicio con tecnica controlada: manten la espalda neutra, el core activo y un rango de movimiento completo. Evita acelerarte para prevenir lesiones.",
    muscles: "Musculos estabilizadores y Cuerpo completo"
  };
})();
