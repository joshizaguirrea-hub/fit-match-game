/* ============================================================
 * fm-music.js - Musica para entrenar (Fit Match)
 * ------------------------------------------------------------
 * Panel flotante con una playlist de Spotify embebida.
 * - Si el usuario NO tiene sesion de Spotify: previews de 30s.
 * - Si inicia sesion en Spotify (Premium): canciones completas.
 * No necesita backend ni OAuth: es el embed publico de Spotify.
 *
 * Expone: window.FMMusic.toggle(force)
 * ============================================================ */
(function () {
  'use strict';

  // Playlist publica de Spotify para entrenar ("Beast Mode").
  // Puedes cambiar el ID por cualquier playlist publica.
  const PLAYLIST_ID = '37i9dQZF1DX76Wlfdnj7AP';
  const EMBED = 'https://open.spotify.com/embed/playlist/' + PLAYLIST_ID + '?utm_source=generator&theme=0';

  function ensureUI() {
    if (document.getElementById('fm-music-window')) return;

    const win = document.createElement('div');
    win.id = 'fm-music-window';
    win.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:72px;z-index:100084;width:360px;max-width:calc(100% - 24px);background:#0f1117;border:1px solid #2c3350;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.55);display:none;flex-direction:column;overflow:hidden;font-family:\'Space Grotesk\',sans-serif';
    win.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:linear-gradient(135deg,#1db954,#0ea5a4);color:#fff">' +
        '<div style="font-weight:700;font-size:13px"><i class="fa-brands fa-spotify"></i> M\u00fasica para entrenar</div>' +
        '<button id="fm-music-close" title="Cerrar" style="background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:8px;width:26px;height:26px;cursor:pointer"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>' +
      '<div id="fm-music-frame" style="background:#000"></div>' +
      '<div style="padding:9px 12px;background:#0f1117;border-top:1px solid #2c3350;text-align:center">' +
        '<a href="https://open.spotify.com" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:7px;background:#1db954;color:#fff;text-decoration:none;font-weight:700;font-size:12px;padding:8px 14px;border-radius:999px"><i class="fa-brands fa-spotify"></i> Iniciar sesión en Spotify</a>' +
        '<p style="color:#8b92b0;font-size:10px;margin-top:7px">Inicia sesión (Premium) y vuelve aquí para oír las canciones completas. Sin sesión: previews de 30s.</p>' +
      '</div>';
    document.body.appendChild(win);

    document.getElementById('fm-music-close').onclick = () => toggle(false);
  }

  function toggle(force) {
    ensureUI();
    const win = document.getElementById('fm-music-window');
    const frame = document.getElementById('fm-music-frame');
    const show = (typeof force === 'boolean') ? force : (win.style.display === 'none' || !win.style.display);

    // Cargar el iframe solo la primera vez que se abre (no consume al cargar la pagina)
    if (show && frame && !frame.querySelector('iframe')) {
      const iframe = document.createElement('iframe');
      iframe.src = EMBED;
      iframe.width = '100%';
      iframe.height = '352';
      iframe.frameBorder = '0';
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.style.cssText = 'display:block;border:0';
      frame.appendChild(iframe);
    }

    win.style.display = show ? 'flex' : 'none';
  }

  window.FMMusic = { toggle };
})();
