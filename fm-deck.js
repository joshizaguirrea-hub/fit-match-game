/* ============================================================
   Fit Match · Modulo compartido del MAZO (deck)
   Fuente unica de: grupos, pools de ejercicios, niveles,
   render de cartas de color y de ventajas/castigos.
   Usado por cartas.html (catalogo+simulador) y jugar.html (app).
   ============================================================ */
(function(global){
  'use strict';

  const GROUPS = [
    { key:'R',  name:'PECHO & TRICEPS',   tag:'Empuja hasta el limite', icon:'fa-dumbbell',       c:'#fb7185', c2:'#e11d48' },
    { key:'AM', name:'ABDOMEN & CORE',    tag:'El centro del poder',    icon:'fa-fire',           c:'#fcd34d', c2:'#f59e0b' },
    { key:'AZ', name:'PIERNAS & GLUTEOS', tag:'La base del campeon',    icon:'fa-person-running', c:'#60a5fa', c2:'#2563eb' },
    { key:'M',  name:'ESPALDA & HOMBROS', tag:'Postura de titan',       icon:'fa-hand-back-fist', c:'#c084fc', c2:'#9333ea' },
  ];

  const POOLS = {
    R: {
      basico: ['Flexiones de pared','Flexiones inclinadas (silla/mesa)','Aperturas de pecho con botellas','Flexiones de rodillas','Fondos en silla asistidos','Extension de triceps sentado','Fondos de triceps cortos (Dips)','Flexiones cerradas en pared','Extension de triceps en banco','Patada de triceps ligera'],
      inter: ['Flexiones clasicas','Flexiones diamante','Flexiones declinadas','Press de piso con botellas','Flexiones Spiderman','Fondos de triceps clasicos (banco)','Rompecraneos con botellas','Flexiones codos pegados','Extension de triceps a un brazo','Fondos en paralelas entre 2 sillas'],
      avanzado: ['Flexiones arquero (Archer)','Flexiones con palmada (Plyo)','Cruces de pecho con toallas','Flexiones de un solo brazo','Flexiones declinadas con palmada','Fondos en paralelas profundos','Flexiones a una mano','Flexiones Esfinge','Flexiones de triceps explosivas'],
      espartano: ['Flexiones aztecas','Flexiones a pino (Handstand)','Flexiones diamante explosivas','Flexiones a una mano muy inclinadas','Fondos en L (L-sit dips)','Handstand hold 60s','Muscle-ups en barra de puerta'],
    },
    AM: {
      basico: ['Respiracion diafragmatica','Crunch basico','Elevacion de talones (Heel Taps)','Plancha isometrica (rodillas)','Puente de gluteos','Abdominales cortos (cortaunas)','Bicicleta estatica suave','Plancha lateral apoyada (rodillas)'],
      inter: ['Plancha tradicional','Giros rusos (Russian Twists)','Abdominales inversos','Bicycle crunches (codo-rodilla)','Escaladores (Mountain Climbers)','Dead Bug (bicho muerto)','Toque de pies (Toe Touches)','Plancha lateral clasica'],
      avanzado: ['Hollow Body Hold','Mountain climbers cruzados','Bird-Dog en plancha','Limpiaparabrisas (Wipers)','V-Ups','Plancha lateral con Hip Dips','Plancha a pica (Pike)','Elevacion de piernas estiradas'],
      espartano: ['Dragon Flag','Abdominales en barra (rodillas)','Abdominales en barra (piernas rectas)','Abdominales con rueda (Ab Wheel)','Plancha con saltos (Plank Jacks)','L-Sit colgado','Escaladores Spiderman','Plancha con caminata (Comandos)','Roll to V-up','Body Saw'],
    },
    AZ: {
      basico: ['Sentadilla clasica (Air Squat)','Puente de gluteos','Zancada hacia atras (Reverse Lunge)','Patada de gluteo (Donkey Kick)','Elevacion de talones','Sentadilla de lado a lado (Lateral)','Abduccion lateral acostada','Sentadilla de sumo','Puente de gluteos a una pierna','Aperturas de almeja (Clamshell)'],
      inter: ['Sentadilla con salto (Jump Squat)','Zancada con salto (Jump Lunge)','Sentadilla bulgara','Sentadilla cosaca','Patada de gluteo pierna estirada','Puente de gluteos con banda','Caminata de canguro (Crab Walks)','Peso muerto rumano a una pierna','Zancada cruzada (Curtsy)','Sentadilla isometrica en pared (Wall Sit)'],
      avanzado: ['Hip Thrust en suelo/silla','Sentadilla con peso (Goblet)','Peso muerto rumano con peso','Zancada caminando con mancuernas','Sentadilla a una pierna (Pistol)','Sentadilla bulgara con peso','Hip thrust a una pierna con peso','Sentadilla 1 y 1/2','Puente con pausa larga','Step-ups con peso'],
      espartano: ['Mountain Climbers con salto','Burpees con salto y sentadilla','Skater jumps (sentadilla lateral)','Tabata de sentadillas (4 min)','Combo espartano de gluteos','Sentadilla con salto sostenido'],
    },
    M: {
      basico: ['Angel de pared (Wall Angels)','Superman basico','Flexiones de rodillas','Remo con toalla isometrico','Elevaciones laterales con botellas','Elevaciones frontales','Pajaros (deltoide posterior) sentados','Press militar sentado con mancuernas'],
      inter: ['Remo con mancuerna a un brazo','Remo invertido con mesa','Flexiones escapulares','Pajaro de pie (Pec-Deck inv.)','Press Arnold','Encoge de hombros (Shrugs)','Superman en Y y T','Remo al menton con banda'],
      avanzado: ['Dominadas (Pull-ups)','Flexiones de picas (Pike)','Remo Pendlay a 90 grados','Face Pulls con banda','Flexiones en T','Pajaro con banda elastica','Dominadas supinas (Chin-ups)','Elevaciones laterales en bisagra'],
      espartano: ['Flexiones haciendo el pino (Handstand)','Dominadas arquero (Archer Pull-ups)','Dominadas explosivas (Muscle-up prog.)','Paseo del granjero con garrafas','Front Lever raise con toalla','Plancha invertida (Back lever)'],
    },
  };

  const LEVELS = [
    { id:'basico',   label:'Básico',     pts:'1 pt',  time:'1:00', n:2, dot:'#16a34a' },
    { id:'inter',    label:'Intermedio', pts:'2 pts', time:'1:30', n:2, dot:'#d97706' },
    { id:'avanzado', label:'Avanzado',   pts:'3 pts', time:'2:00', n:2, dot:'#dc2626' },
  ];

  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  function makeDealer(arr){
    let bag = [];
    return ()=>{ if(bag.length===0) bag = shuffle(arr); return bag.pop(); };
  }
  function makeGroupDealers(group){
    const pool = POOLS[group.key];
    return { basico:makeDealer(pool.basico), inter:makeDealer(pool.inter), avanzado:makeDealer(pool.avanzado), espartano:makeDealer(pool.espartano) };
  }

  function levelGroup(level, names){
    const rows = names.map(nm => `<div class="exrow px-2 py-1 text-[11px] font-bold text-gray-800 leading-tight">${nm}</div>`).join('');
    return `<div>
      <div class="flex items-center justify-between mb-1">
        <span class="fun text-[12px] font-bold text-gray-900 flex items-center"><i class="fa-solid fa-circle text-[8px] mr-1" style="color:${level.dot}"></i>${level.label}</span>
        <span class="text-[10px] font-bold text-gray-700">${level.pts} \u00b7 ${level.time}</span>
      </div>
      <div class="space-y-1">${rows}</div>
    </div>`;
  }

  function colorCard(group, idx, dealers){
    const blocks = LEVELS.map(l => {
      const names = [];
      for(let i=0;i<l.n;i++) names.push(dealers[l.id]());
      return levelGroup(l, names);
    }).join('');
    const spartan = dealers.espartano();
    return `<div class="pop flex flex-col bg-white">
      <div class="dots p-4 text-white" style="background:linear-gradient(150deg,${group.c},${group.c2})">
        <div class="flex items-start justify-between">
          <div class="w-14 h-14 icon-bubble flex items-center justify-center text-2xl" style="background:#fff;color:${group.c2}"><i class="fa-solid ${group.icon}"></i></div>
          <span class="cost-badge fun text-[11px] font-bold px-2.5 py-1">#${idx}</span>
        </div>
        <h3 class="fun text-xl font-bold mt-3 leading-none drop-shadow">${group.name}</h3>
        <p class="font-bold text-white/90 text-[12px] italic">"${group.tag}"</p>
      </div>
      <div class="p-3 space-y-2.5 flex-grow" style="background:#fff7fb">
        ${blocks}
      </div>
      <div class="ribbon m-3 mt-0 px-2.5 py-2 flex items-center gap-2" style="background:#1f2937">
        <i class="fa-solid fa-khanda text-lg" style="color:#fbbf24"></i>
        <div class="leading-tight">
          <span class="block text-[9px] font-bold uppercase text-amber-300">Espartano \u00b7 +1 pt extra (banca)</span>
          <span class="block text-[11px] font-bold text-white">${spartan}</span>
        </div>
      </div>
    </div>`;
  }

  const VENTAJAS = [
    ['Suplente de Emergencia','fa-people-arrows','Cambia de atleta a mitad del cronometro.'],
    ['Descuento de Tiempo','fa-tags','Resta 15 segundos al reloj del reto.'],
    ['Zona de Confort','fa-mug-hot','Version facil del ejercicio por 20 seg.'],
    ['Escudo de Fichas','fa-shield-halved','Si fallas, las fichas vuelven al banco, no al rival.'],
    ['Pausa Hidratacion','fa-bottle-water','Congela el reloj 10 seg sin soltar la postura.'],
    ['Socio Comercial','fa-handshake','Obliga a un rival a sufrir contigo; si desiste, tu tiempo baja 50%.'],
    ['Seguro de Vida','fa-heart-pulse','Si fallas, recuperas el 50% de lo apostado.'],
    ['Inmunidad Color','fa-shield-virus','Inmune a castigos durante toda la ronda.'],
    ['Transferencia de Impuestos','fa-money-bill-transfer','Si ganas, el retador te paga 1 punto extra.'],
    ['Segunda Oportunidad','fa-rotate-left','Reinicia el reloj una vez si fallas en los primeros 10 seg.'],
  ];
  const CASTIGOS = [
    ['Gravedad Aumentada','fa-weight-hanging','El rival carga a un companero liviano.'],
    ['Doble Impacto','fa-bolt','Alterna un segundo ejercicio durante el reto.'],
    ['Privacion Sensorial','fa-eye-slash','Ejecuta todo con los ojos cerrados.'],
    ['Anclaje Isometrico','fa-anchor','Manten el punto mas dificil 15 seg sin moverte.'],
    ['Camara Lenta','fa-gauge-simple-high','Cada repeticion: 4 seg de bajada y 4 de subida.'],
    ['El Saboteador','fa-face-laugh-squint','Te gritan y cuentan mal cerca de la cara.'],
    ['Apoyo Restringido','fa-hand','Levanta una mano o un pie por 20 seg.'],
    ['Viento en Contra','fa-wind','Te abanican o soplan aire en la cara.'],
    ['El Extensor','fa-stopwatch','Suma 20 seg sorpresa al final del reloj.'],
    ['Traccion de Cadera','fa-link','Te jalan con banda para desestabilizar el core.'],
  ];

  function modCard(item, kind){
    const isV = kind==='v';
    const head = isV ? '#10b981' : '#ef4444';
    const head2 = isV ? '#059669' : '#dc2626';
    const tagText = isV ? 'VENTAJA' : 'CASTIGO';
    const tagIcon = isV ? 'fa-shield-halved' : 'fa-hand-fist';
    const persona = isV ? 'fa-mask' : 'fa-skull';
    return `<div class="pop flex flex-col bg-white">
      <div class="dots px-3 py-2 flex items-center justify-between text-white" style="background:linear-gradient(120deg,${head},${head2})">
        <span class="fun text-[11px] font-bold"><i class="fa-solid ${tagIcon} mr-1"></i>${tagText}</span>
        <i class="fa-solid ${persona} text-white/80"></i>
      </div>
      <div class="p-4 flex flex-col items-center text-center flex-grow">
        <div class="w-16 h-16 icon-bubble flex items-center justify-center text-3xl mb-3" style="background:${isV?'#d1fae5':'#fee2e2'};color:${head2}"><i class="fa-solid ${item[1]}"></i></div>
        <h4 class="fun text-base font-bold text-gray-900 leading-tight">${item[0]}</h4>
        <p class="text-gray-600 text-xs font-semibold mt-1.5 flex-grow">${item[2]}</p>
        <span class="cost-badge fun text-xs font-bold px-3 py-1 mt-3"><i class="fa-solid fa-coins mr-1" style="color:#f59e0b"></i>Cuesta 1 pt</span>
      </div>
    </div>`;
  }

  global.FMDeck = { GROUPS, POOLS, LEVELS, shuffle, makeDealer, makeGroupDealers, levelGroup, colorCard, VENTAJAS, CASTIGOS, modCard };
})(window);
