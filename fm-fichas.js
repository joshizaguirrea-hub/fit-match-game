/* ============================================================
   Fit Match · Modulo compartido de Fichas (monedas + reloj)
   Usado por fichas.html y por el simulador de cartas.html
   ============================================================ */
(function(global){
  'use strict';

  /* ---- GRECA (meander griego) alrededor de la moneda ---- */
  function meanderRing(cx, cy, r, n){
    const tile = 'M -6 0 L -6 8 L 6 8 L 6 2 L -2 2 L -2 6 L 2 6';
    let out = '';
    for(let i=0;i<n;i++){
      const ang = (360/n)*i;
      out += `<g transform="rotate(${ang} ${cx} ${cy}) translate(${cx} ${cy-r})">
        <path d="${tile}" fill="none" stroke="#111827" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
      </g>`;
    }
    return out;
  }

  /* ---- MONEDA ---- */
  const COINS = [
    { id:'bronze', pts:1, name:'Bronce · 1 punto',  c1:'#e8a96a', c2:'#cd7f32', c3:'#8a5320', cInner:'#f5cfa0' },
    { id:'silver', pts:2, name:'Plata · 2 puntos',  c1:'#e6e6ea', c2:'#b8bcc4', c3:'#7c8089', cInner:'#f4f5f7' },
    { id:'gold',   pts:3, name:'Oro · 3 puntos',    c1:'#ffe27a', c2:'#f4c430', c3:'#c9971a', cInner:'#fff2b0' },
  ];
  function coinById(id){ return COINS.find(c=>c.id===id); }

  function buildCoin(cfg){
    const cx=120, cy=120;
    const ring = meanderRing(cx, cy, 100, 30);
    const svg = `<svg viewBox="0 0 240 240" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g-${cfg.id}" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stop-color="${cfg.c1}"/>
          <stop offset="70%" stop-color="${cfg.c2}"/>
          <stop offset="100%" stop-color="${cfg.c3}"/>
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="116" fill="#111827"/>
      <circle cx="${cx}" cy="${cy}" r="110" fill="url(#g-${cfg.id})"/>
      <circle cx="${cx}" cy="${cy}" r="110" fill="none" stroke="#111827" stroke-width="3"/>
      ${ring}
      <circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="#111827" stroke-width="2.5"/>
      <circle cx="${cx}" cy="${cy}" r="80" fill="${cfg.cInner}" opacity=".5"/>
    </svg>`;
    const pl = cfg.pts===1 ? 'PUNTO' : 'PUNTOS';
    return `<div class="flex flex-col items-center gap-3">
      <div class="coin-wrap">
        ${svg}
        <div class="coin-center">
          <div class="w-12 h-12 icon-bubble flex items-center justify-center text-2xl mb-1" style="background:#111827;color:#fbbf24"><i class="fa-solid fa-fire-flame-curved"></i></div>
          <span class="fun font-bold text-gray-900 leading-none" style="font-size:11px;letter-spacing:.12em">FIT MATCH</span>
          <span class="fun font-bold leading-none" style="font-size:54px;color:#111827;text-shadow:2px 2px 0 rgba(255,255,255,.6)">${cfg.pts}</span>
          <span class="fun font-bold text-gray-900 leading-none" style="font-size:13px;letter-spacing:.18em">${pl}</span>
        </div>
      </div>
      <span class="ribbon fun font-bold px-4 py-1" style="background:${cfg.c1}">${cfg.name}</span>
    </div>`;
  }
  function coinsHTML(){ return COINS.map(buildCoin).join(''); }

  /* ---- MONEDA chica (para marcadores/bandejas) ---- */
  function miniCoin(coinId, size){
    const c = coinById(coinId); const s = size||56;
    return `<div class="coin-pop" style="position:relative;width:${s}px;height:${s}px">
      <svg viewBox="0 0 240 240" width="${s}" height="${s}">
        <circle cx="120" cy="120" r="116" fill="#111827"/>
        <circle cx="120" cy="120" r="110" fill="${c.c2}"/>
        <circle cx="120" cy="120" r="86" fill="${c.cInner}" opacity=".5" stroke="#111827" stroke-width="4"/>
      </svg>
      <span class="fun font-bold" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#111827;font-size:${Math.round(s*0.5)}px">${c.pts}</span>
    </div>`;
  }

  /* ---- RELOJ DE ARENA EPICO (SVG) ---- */
  function buildHourglass(){
    return `<svg viewBox="0 0 220 320" width="210" height="305" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="frameGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffe27a"/><stop offset="50%" stop-color="#f4c430"/><stop offset="100%" stop-color="#b8860b"/>
        </linearGradient>
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
        <radialGradient id="glassG" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".75"/><stop offset="100%" stop-color="#c7d2fe" stop-opacity=".25"/>
        </radialGradient>
        <clipPath id="glassTop"><path d="M48 64 L172 64 L116 152 Q110 158 104 152 Z"/></clipPath>
        <clipPath id="glassBot"><path d="M104 168 Q110 162 116 168 L172 256 L48 256 Z"/></clipPath>
      </defs>
      <path class="glow" d="M110 6 C 120 18 118 30 110 38 C 102 30 100 18 110 6 Z" fill="#fb7185"/>
      <path class="glow" d="M110 314 C 120 302 118 290 110 282 C 102 290 100 302 110 314 Z" fill="#fb7185"/>
      <rect x="22" y="38" width="176" height="26" rx="12" fill="url(#frameGold)" stroke="#111827" stroke-width="4"/>
      <rect x="22" y="256" width="176" height="26" rx="12" fill="url(#frameGold)" stroke="#111827" stroke-width="4"/>
      <rect x="30" y="62" width="14" height="196" rx="6" fill="url(#frameGold)" stroke="#111827" stroke-width="3.5"/>
      <rect x="176" y="62" width="14" height="196" rx="6" fill="url(#frameGold)" stroke="#111827" stroke-width="3.5"/>
      <line x1="37" y1="66" x2="37" y2="254" stroke="#111827" stroke-width="1" opacity=".5"/>
      <line x1="183" y1="66" x2="183" y2="254" stroke="#111827" stroke-width="1" opacity=".5"/>
      <path d="M48 64 L172 64 L116 152 Q110 158 116 156 L172 256 L48 256 L104 156 Q110 158 104 152 Z" fill="url(#glassG)"/>
      <path d="M48 64 L172 64 L110 154 Z" fill="none" stroke="#111827" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M48 256 L172 256 L110 154 Z" fill="none" stroke="#111827" stroke-width="4.5" stroke-linejoin="round"/>
      <g clip-path="url(#glassTop)"><rect class="js-st" x="48" y="64" width="124" height="90" fill="url(#sandGrad)"/></g>
      <g clip-path="url(#glassBot)"><rect class="js-sb" x="48" y="166" width="124" height="90" fill="url(#sandGrad)"/></g>
      <rect class="sand-stream js-stream" x="106" y="152" width="8" height="16" rx="4" fill="#d97706" opacity="0"/>
      <path d="M60 74 L92 74 L74 100 Z" fill="#ffffff" opacity=".35"/>
    </svg>`;
  }

  function fmt(s){ const m=Math.floor(s/60); const ss=Math.floor(s%60); return m+':'+String(ss).padStart(2,'0'); }

  function beep(){
    try{
      const AC = global.AudioContext||global.webkitAudioContext; if(!AC) return;
      const ctx=new AC();
      [880,660,990].forEach((f,i)=>{
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.frequency.value=f; o.type='triangle'; o.connect(g); g.connect(ctx.destination);
        const t=ctx.currentTime+i*0.18;
        g.gain.setValueAtTime(.001,t); g.gain.exponentialRampToValueAtTime(.4,t+0.02); g.gain.exponentialRampToValueAtTime(.001,t+0.16);
        o.start(t); o.stop(t+0.18);
      });
    }catch(e){}
  }

  /* ---- TEMPORIZADOR (instancia con estado encapsulado) ----
     opts: { hg, display, stage, onFinish }  (elementos DOM)               */
  function createTimer(opts){
    const hg = opts.hg, display = opts.display, stage = opts.stage;
    const onFinish = opts.onFinish;
    hg.innerHTML = buildHourglass();
    const sandTop = hg.querySelector('.js-st');
    const sandBot = hg.querySelector('.js-sb');
    const sandStream = hg.querySelector('.js-stream');
    const origBg = display.style.background, origColor = display.style.color;
    let total=60, remaining=60, rafId=null, lastTs=null, running=false, paused=false;

    function render(){
      display.textContent = (paused ? '\u23f8 ' : '') + fmt(remaining);
      const p = total>0 ? remaining/total : 0;
      sandTop.style.transformOrigin='110px 154px';
      sandTop.style.transform = 'scaleY('+p.toFixed(3)+')';
      sandBot.style.transformOrigin='110px 256px';
      sandBot.style.transform = 'scaleY('+(1-p).toFixed(3)+')';
      sandStream.style.opacity = running ? '1' : '0';
    }
    function tick(ts){
      if(lastTs==null) lastTs=ts;
      const dt=(ts-lastTs)/1000; lastTs=ts;
      remaining=Math.max(0, remaining-dt);
      render();
      if(remaining<=0){ finish(); return; }
      rafId=requestAnimationFrame(tick);
    }
    function start(){
      if(running) return;
      if(remaining<=0) remaining=total;
      running=true; paused=false; lastTs=null;
      stage.classList.add('running'); stage.classList.remove('paused');
      display.classList.remove('paused-disp');
      render();
      rafId=requestAnimationFrame(tick);
    }
    function stopLoop(){ running=false; if(rafId) cancelAnimationFrame(rafId); rafId=null; }
    function pause(){
      if(!running) return;
      stopLoop(); paused=true;
      stage.classList.remove('running'); stage.classList.add('paused');
      display.classList.add('paused-disp');
      render();
    }
    function clearPausedUI(){ paused=false; stage.classList.remove('paused'); display.classList.remove('paused-disp'); }
    function reset(){ stopLoop(); clearPausedUI(); remaining=total; render(); }
    function set(sec){ stopLoop(); clearPausedUI(); total=sec; remaining=sec; render(); }
    function finish(){
      stopLoop(); clearPausedUI(); remaining=0; render();
      stage.classList.remove('running'); stage.classList.add('shake');
      setTimeout(()=>stage.classList.remove('shake'), 1600);
      display.style.background='#ef4444'; display.style.color='#fff'; display.textContent='\u00a1TIEMPO!';
      setTimeout(()=>{ display.style.background=origBg; display.style.color=origColor; display.textContent=fmt(total); }, 2200);
      beep();
      if(typeof onFinish==='function') onFinish();
    }
    render();
    return { set, start, pause, reset, isRunning:()=>running, getTotal:()=>total };
  }

  global.FM = { COINS, coinById, buildCoin, coinsHTML, miniCoin, buildHourglass, fmt, createTimer, meanderRing };
})(window);
