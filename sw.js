/* ============================================================
 * sw.js - Service Worker de Fit Match (PWA)
 * ------------------------------------------------------------
 * - Permite instalar la app y usarla offline (parcialmente).
 * - HTML: network-first (siempre la ultima version si hay red).
 * - Resto mismo-origen: stale-while-revalidate (rapido + se
 *   actualiza en segundo plano).
 * - Externos (CDN): network-first con respaldo en cache.
 * Sube CACHE_VERSION cuando quieras forzar limpieza de cache.
 * ============================================================ */
const CACHE_VERSION = 'fitmatch-v11';
const CORE = [
  './',
  'index.html',
  'jugar.html',
  'offline.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // Cachear uno por uno para que un 404 no rompa toda la instalacion
    await Promise.all(CORE.map(async (url) => {
      try { await cache.add(url); } catch (e) { /* ignorar el que falle */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isHTML(req) {
  return req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // HTML -> network-first (para ver siempre la ultima version)
  if (isHTML(req)) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_VERSION);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        return cached || (await caches.match('offline.html')) || caches.match('index.html');
      }
    })());
    return;
  }

  // Mismo origen (JS/CSS/imagenes) -> stale-while-revalidate
  if (sameOrigin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return cached || (await network) || new Response('', { status: 504 });
    })());
    return;
  }

  // Externos (CDN, fuentes) -> network-first con respaldo
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      const cache = await caches.open(CACHE_VERSION);
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    } catch (e) {
      const cached = await caches.match(req);
      return cached || new Response('', { status: 504 });
    }
  })());
});
