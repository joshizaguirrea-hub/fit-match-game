/* ============================================================
 * fm-guide.js - Tour interactivo de navegacion (Fit Match)
 * ------------------------------------------------------------
 * No es una pantalla de texto: es un TOUR real que oscurece la
 * pantalla, ilumina el elemento real con un anillo que palpita,
 * apunta con una flecha llamativa y ABRE solo lo que explica
 * (rutinas, coach IA, etc.). Pasos con Anterior/Siguiente/Saltar.
 * Expone window.FMGuide.open() y .maybeShowFirstTime().
 * ============================================================ */
(function () {
  'use strict';

  const SEEN_KEY = 'fm_guide_seen_v2';
  let step = 0, steps = [];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function $(sel){ try { return document.querySelector(sel); } catch (e) { return null; } }

  steps = [
    { target: null, title: 'Te doy un recorrido', icon: 'fa-hand-sparkles',
      body: 'Voy a abrir e iluminar cada modulo para que veas como se usa. Dale a <b>Siguiente</b> y sigueme. Puedes <b>Saltar</b> cuando quieras.',
      before: async () => { if (typeof window.startTraining === 'function') { window.startTraining(); await sleep(500); } } },
    { target: '#routines-grid', title: 'Tus rutinas por carriles', icon: 'fa-up-down-left-right',
      body: 'Aqui estan tus rutinas en carriles que se <b>deslizan a los lados</b> (Gimnasio, En Casa, CrossFit, Tercera Edad, Dioses...). Cada carril tiene <b>Ver mas</b> para abrir toda la coleccion.' },
    { target: '#btn-plan-mes', title: 'Tu plan del mes', icon: 'fa-calendar-check',
      body: 'Este boton abre tu <b>plan mensual</b>: calendario del dia 1 al fin de mes, tus metas de calorias y tu avance. Asi mides tu progreso.' },
    { target: '#fm-trainer-window', title: 'Tu Entrenador IA', icon: 'fa-dumbbell',
      body: 'Mira, lo abri por ti. Es un <b>chat</b>: preguntale <b>"que entreno hoy"</b>, <b>"que como hoy"</b>, <b>"como voy"</b> o pidele que te <b>motive</b>. Aprende de tus datos.',
      before: async () => { if (window.FMTrainer) { window.FMTrainer.toggle(true); await sleep(450); } } },
    { target: '.social-toggle-btn', title: 'Entrena con amigos', icon: 'fa-users',
      body: 'Aqui esta la <b>comunidad</b>: ve quien esta en linea, <b>chatea</b>, haz <b>videollamada</b> o invita a alguien a entrenar contigo.',
      before: async () => { if (window.FMTrainer) window.FMTrainer.toggle(false); await sleep(250); } },
    { target: '#btn-guia', title: 'Reabre la guia cuando quieras', icon: 'fa-circle-question',
      body: 'Si te pierdes, este boton <b>Guia</b> vuelve a iniciar este recorrido. Listo para entrenar!' },
    { target: null, title: 'A entrenar!', icon: 'fa-flag-checkered',
      body: 'Eso es todo. Completa tu <b>Perfil</b> y tu <b>Perfil Nutricional</b> para que el coach sea a tu medida. Vamos con todo!' }
  ];

  function injectCSS() {
    if (document.getElementById('fm-guide-css')) return;
    const st = document.createElement('style');
    st.id = 'fm-guide-css';
    st.textContent =
      '@keyframes fmgPulse{0%{box-shadow:0 0 0 9999px rgba(5,7,13,.78),0 0 0 0 rgba(124,92,255,.7)}70%{box-shadow:0 0 0 9999px rgba(5,7,13,.78),0 0 0 14px rgba(124,92,255,0)}100%{box-shadow:0 0 0 9999px rgba(5,7,13,.78),0 0 0 0 rgba(124,92,255,0)}}' +
      '@keyframes fmgBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}' +
      '#fm-guide-ring{position:fixed;border-radius:14px;border:3px solid #7c5cff;z-index:100101;pointer-events:none;animation:fmgPulse 1.6s infinite;transition:all .35s cubic-bezier(.4,0,.2,1)}' +
      '#fm-guide-arrow{position:fixed;z-index:100103;color:#7c5cff;font-size:34px;pointer-events:none;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));animation:fmgBounce 1s infinite}' +
      '#fm-guide-pop{position:fixed;z-index:100104;max-width:320px;background:#0f1117;border:1px solid #3a4256;border-radius:16px;padding:16px 18px;box-shadow:0 18px 50px rgba(0,0,0,.6);font-family:sans-serif;transition:all .35s cubic-bezier(.4,0,.2,1)}';
    document.head.appendChild(st);
  }

  function ensureUI() {
    injectCSS();
    if (document.getElementById('fm-guide-blocker')) return;
    const b = document.createElement('div');
    b.id = 'fm-guide-blocker';
    b.style.cssText = 'position:fixed;inset:0;z-index:100100;background:transparent;display:none';
    document.body.appendChild(b);

    const ring = document.createElement('div'); ring.id = 'fm-guide-ring'; ring.style.display = 'none'; document.body.appendChild(ring);
    const arrow = document.createElement('div'); arrow.id = 'fm-guide-arrow'; arrow.style.display = 'none'; arrow.innerHTML = '<i class="fa-solid fa-circle-down"></i>'; document.body.appendChild(arrow);

    const pop = document.createElement('div'); pop.id = 'fm-guide-pop'; pop.style.display = 'none';
    pop.innerHTML =
      '<div style="display:flex;align-items:center;gap:9px;margin-bottom:8px">' +
        '<div id="fm-guide-ic" style="width:34px;height:34px;border-radius:50%;background:#7c5cff;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0"></div>' +
        '<h3 id="fm-guide-title" style="color:#fff;font-size:16px;font-weight:800;margin:0"></h3>' +
      '</div>' +
      '<p id="fm-guide-body" style="color:#c2c9e6;font-size:13px;line-height:1.5;margin:0 0 12px"></p>' +
      '<div id="fm-guide-dots" style="display:flex;gap:5px;margin-bottom:12px"></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
        '<button id="fm-guide-skip" style="background:none;border:none;color:#7b829f;cursor:pointer;font-size:11px;font-weight:600">Saltar</button>' +
        '<div style="display:flex;gap:7px">' +
          '<button id="fm-guide-prev" style="background:#222842;border:none;color:#fff;border-radius:9px;padding:8px 12px;cursor:pointer;font-weight:700;font-size:12px">Anterior</button>' +
          '<button id="fm-guide-next" style="background:#7c5cff;border:none;color:#fff;border-radius:9px;padding:8px 16px;cursor:pointer;font-weight:700;font-size:12px">Siguiente</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(pop);

    document.getElementById('fm-guide-skip').onclick = finish;
    document.getElementById('fm-guide-prev').onclick = () => render(step - 1);
    document.getElementById('fm-guide-next').onclick = () => { if (step >= steps.length - 1) finish(); else render(step + 1); };
    window.addEventListener('resize', position);
  }

  function show(id, disp){ const e = document.getElementById(id); if (e) e.style.display = disp; }

  async function render(i) {
    step = Math.max(0, Math.min(steps.length - 1, i));
    const s = steps[step];
    document.getElementById('fm-guide-ic').innerHTML = '<i class="fa-solid ' + s.icon + '"></i>';
    document.getElementById('fm-guide-title').textContent = s.title;
    document.getElementById('fm-guide-body').innerHTML = s.body;
    document.getElementById('fm-guide-prev').style.visibility = step === 0 ? 'hidden' : 'visible';
    document.getElementById('fm-guide-next').textContent = step >= steps.length - 1 ? 'Listo' : 'Siguiente';
    document.getElementById('fm-guide-dots').innerHTML = steps.map((_, k) =>
      '<span style="width:' + (k === step ? '16px' : '6px') + ';height:6px;border-radius:99px;background:' + (k === step ? '#7c5cff' : '#2c3350') + ';transition:all .2s"></span>'
    ).join('');
    if (s.before) { try { await s.before(); } catch (e) {} }
    position();
  }

  function position() {
    const s = steps[step]; if (!s) return;
    const ring = document.getElementById('fm-guide-ring');
    const arrow = document.getElementById('fm-guide-arrow');
    const pop = document.getElementById('fm-guide-pop');
    if (!ring || !pop) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const el = s.target ? $(s.target) : null;

    if (!el) { // paso centrado (sin objetivo)
      arrow.style.display = 'none';
      ring.style.display = 'block'; ring.style.animation = 'none';
      ring.style.width = '0px'; ring.style.height = '0px';
      ring.style.left = (vw/2) + 'px'; ring.style.top = (vh/2) + 'px';
      ring.style.borderColor = 'transparent';
      ring.style.boxShadow = '0 0 0 9999px rgba(5,7,13,.82)';
      pop.style.display = 'block';
      pop.style.left = Math.max(12, (vw - pop.offsetWidth)/2) + 'px';
      pop.style.top = Math.max(12, (vh - pop.offsetHeight)/2) + 'px';
      return;
    }

    ring.style.borderColor = '#7c5cff';
    ring.style.animation = 'fmgPulse 1.6s infinite';
    ring.style.boxShadow = '';
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      const pad = 8;
      ring.style.display = 'block';
      ring.style.left = (r.left - pad) + 'px';
      ring.style.top = (r.top - pad) + 'px';
      ring.style.width = (r.width + pad*2) + 'px';
      ring.style.height = (r.height + pad*2) + 'px';

      pop.style.display = 'block';
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      const below = (r.bottom + 22 + ph) < vh;
      let top = below ? (r.bottom + 24) : (r.top - ph - 24);
      top = Math.max(12, Math.min(top, vh - ph - 12));
      let left = r.left + r.width/2 - pw/2;
      left = Math.max(12, Math.min(left, vw - pw - 12));
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';

      arrow.style.display = 'block';
      const ax = Math.max(12, Math.min(r.left + r.width/2 - 17, vw - 40));
      if (below) { arrow.innerHTML = '<i class="fa-solid fa-circle-up"></i>'; arrow.style.top = (r.bottom + 2) + 'px'; }
      else { arrow.innerHTML = '<i class="fa-solid fa-circle-down"></i>'; arrow.style.top = (r.top - 40) + 'px'; }
      arrow.style.left = ax + 'px';
    }, 380);
  }

  function open() {
    ensureUI();
    show('fm-guide-blocker', 'block');
    render(0);
  }
  function finish() {
    ['fm-guide-blocker','fm-guide-ring','fm-guide-arrow','fm-guide-pop'].forEach(id => show(id, 'none'));
    if (window.FMTrainer) { try { window.FMTrainer.toggle(false); } catch (e) {} }
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
  }
  function maybeShowFirstTime() {
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (!seen) setTimeout(open, 1000);
  }

  window.FMGuide = { open, maybeShowFirstTime };
})();
