/* ============================================================
 * fm-guide.js - Guia de navegacion para nuevos usuarios
 * ------------------------------------------------------------
 * Tour paso a paso que explica los modulos del Entrenamiento
 * Personal. Se muestra automaticamente la PRIMERA vez (guarda
 * un flag en localStorage) y se puede reabrir con FMGuide.open().
 * Expone window.FMGuide.open() y .maybeShowFirstTime().
 * ============================================================ */
(function () {
  'use strict';

  const SEEN_KEY = 'fm_guide_seen_v1';
  let step = 0;

  const SLIDES = [
    {
      icon: 'fa-hand-sparkles', color: '#7c5cff',
      title: 'Bienvenido a tu Entrenamiento Personal',
      body: 'Esta es tu plataforma fitness completa: rutinas, un coach con IA, plan mensual, nutricion y entrenar con amigos. Te muestro en 30 segundos como moverte. Puedes saltar cuando quieras.'
    },
    {
      icon: 'fa-film', color: '#22d3ee',
      title: 'Rutinas estilo Netflix',
      body: 'Las rutinas estan en carriles que se deslizan a los lados. Tienes carriles de <b>Gimnasio</b>, <b>En Casa</b>, <b>CrossFit</b>, <b>Tercera Edad</b>, <b>Calistenia</b> y los <b>Dioses y Culturas</b>. Cada carril tiene un boton <b>Ver mas</b> para abrir toda la coleccion.'
    },
    {
      icon: 'fa-wand-magic-sparkles', color: '#a855f7',
      title: 'Tu plan de esta semana',
      body: 'Arriba veras el carril <b>Tu plan de esta semana</b>: rutinas que tu entrenador IA elige a tu medida segun tu nivel, objetivos y equipo. Empieza por ahi si no sabes que hacer.'
    },
    {
      icon: 'fa-calendar-check', color: '#34d399',
      title: 'Plan del Mes (seguimiento pro)',
      body: 'El boton <b>Ver mi plan del mes</b> te abre tu calendario del dia 1 al fin de mes: que entrenar cada dia, tus metas de calorias, tu adherencia y tu avance. Marca dias entrenados y mide tu progreso.'
    },
    {
      icon: 'fa-dumbbell', color: '#7c5cff',
      title: 'Tu Entrenador IA',
      body: 'Abajo a la izquierda esta el boton <b>Entrenador IA</b>. Es un chat: preguntale <b>"que entreno hoy"</b>, <b>"que como hoy"</b> (segun tu dieta), <b>"como voy"</b> o pidele que te <b>motive</b>. Aprende de tus datos mientras mas lo usas.'
    },
    {
      icon: 'fa-list-check', color: '#fbbf24',
      title: 'Dentro de una rutina',
      body: 'Al abrir una rutina veras la lista de ejercicios con su cronometro. Toca el icono <b>azul (i)</b> para ver la tecnica en video, y el icono <b>naranja</b> para <b>cambiar un ejercicio</b> si no tienes el equipo o no puedes hacerlo.'
    },
    {
      icon: 'fa-users', color: '#ec4899',
      title: 'Entrena con amigos',
      body: 'Abre <b>Chat & Fit Bros</b> (boton flotante) y ve la pestana <b>Online</b>. Junto a cada atleta puedes: <b>chatear</b>, hacer <b>videollamada</b> (se minimiza para ver tu rutina sin cortar la llamada) o invitarlo con <b>Entrenamos</b> para una sesion juntos.'
    },
    {
      icon: 'fa-flag-checkered', color: '#34d399',
      title: 'Listo, a entrenar',
      body: 'Eso es todo lo basico. Recuerda: completa tu <b>Perfil</b> y tu <b>Perfil Nutricional</b> para que el coach y las recomendaciones sean a tu medida. Puedes volver a abrir esta guia con el boton <b>Guia</b>. Vamos con todo!'
    }
  ];

  function ensureUI() {
    if (document.getElementById('fm-guide-modal')) return;
    const m = document.createElement('div');
    m.id = 'fm-guide-modal';
    m.style.cssText = 'position:fixed;inset:0;z-index:100120;background:rgba(5,7,13,.9);display:none;align-items:center;justify-content:center;font-family:\'Space Grotesk\',sans-serif;padding:18px';
    m.innerHTML =
      '<div style="background:#0f1117;border:1px solid #2c3350;border-radius:22px;max-width:430px;width:100%;padding:26px;box-shadow:0 24px 60px rgba(0,0,0,.6);text-align:center">' +
        '<div id="fm-guide-icon" style="width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:26px;color:#fff"></div>' +
        '<h3 id="fm-guide-title" style="font-family:Fredoka,sans-serif;color:#fff;font-size:21px;font-weight:800;margin:0 0 8px"></h3>' +
        '<p id="fm-guide-body" style="color:#c2c9e6;font-size:14px;line-height:1.55;margin:0 0 18px;min-height:96px"></p>' +
        '<div id="fm-guide-dots" style="display:flex;gap:6px;justify-content:center;margin-bottom:18px"></div>' +
        '<div style="display:flex;gap:10px;align-items:center;justify-content:space-between">' +
          '<button id="fm-guide-skip" style="background:none;border:none;color:#7b829f;cursor:pointer;font-size:12px;font-weight:600">Saltar guia</button>' +
          '<div style="display:flex;gap:8px">' +
            '<button id="fm-guide-prev" style="background:#222842;border:none;color:#fff;border-radius:10px;padding:9px 14px;cursor:pointer;font-weight:700;font-size:13px">Anterior</button>' +
            '<button id="fm-guide-next" style="background:#7c5cff;border:none;color:#fff;border-radius:10px;padding:9px 18px;cursor:pointer;font-weight:700;font-size:13px">Siguiente</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
    document.getElementById('fm-guide-skip').onclick = finish;
    document.getElementById('fm-guide-prev').onclick = () => go(step - 1);
    document.getElementById('fm-guide-next').onclick = () => { if (step >= SLIDES.length - 1) finish(); else go(step + 1); };
  }

  function render() {
    const s = SLIDES[step];
    const ic = document.getElementById('fm-guide-icon');
    ic.style.background = s.color;
    ic.innerHTML = '<i class="fa-solid ' + s.icon + '"></i>';
    document.getElementById('fm-guide-title').textContent = s.title;
    document.getElementById('fm-guide-body').innerHTML = s.body;
    document.getElementById('fm-guide-prev').style.visibility = step === 0 ? 'hidden' : 'visible';
    document.getElementById('fm-guide-next').textContent = step >= SLIDES.length - 1 ? 'Empezar' : 'Siguiente';
    document.getElementById('fm-guide-dots').innerHTML = SLIDES.map((_, i) =>
      '<span style="width:' + (i === step ? '18px' : '7px') + ';height:7px;border-radius:99px;background:' + (i === step ? '#7c5cff' : '#2c3350') + ';transition:all .2s"></span>'
    ).join('');
  }

  function go(i) {
    step = Math.max(0, Math.min(SLIDES.length - 1, i));
    render();
  }
  function open() { ensureUI(); step = 0; render(); document.getElementById('fm-guide-modal').style.display = 'flex'; }
  function finish() {
    const m = document.getElementById('fm-guide-modal');
    if (m) m.style.display = 'none';
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
  }
  function maybeShowFirstTime() {
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (!seen) setTimeout(open, 900);
  }

  window.FMGuide = { open, maybeShowFirstTime };
})();
