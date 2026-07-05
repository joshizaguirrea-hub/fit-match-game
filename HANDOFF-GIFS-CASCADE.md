# Brief para Cascade — Integrar GIFs/imagenes reales de ejercicios en Fit Match

> Copia y pega TODO este archivo en Cascade (en tu equipo personal, con red libre).
> Esta escrito para que Cascade tenga contexto completo y no rompa nada.

---

## 0) PROMPT RAPIDO (pega esto primero en Cascade)

> Soy dueno de una PWA de fitness ("Fit Match", HTML/JS vanilla + Tailwind, Service
> Worker, se publica en GitHub Pages y como TWA en Google Play). Quiero reemplazar las
> imagenes actuales de ejercicios (estaticas, de free-exercise-db) por **GIFs animados
> reales** que expliquen bien la tecnica, empezando por las **planchas** (hoy TODAS las
> variantes muestran la misma foto). Ya tengo un sistema de resolucion de imagenes en
> `fm-exercise-photos.js`. Necesito que: (1) confirmes la **licencia comercial** de la
> fuente de GIFs que usemos, (2) agregues una **capa de override de GIFs** por palabra
> clave (igual que el mapa actual), (3) descargues/auto-hospedes los GIFs elegidos en el
> repo para que funcionen **offline** (PWA) y sin depender de una API con rate-limit,
> (4) actualices el Service Worker para cachearlos, (5) ajustes el render para mostrar
> un `<img>` GIF cuando exista, cayendo al par de fotos actual si no. Lee el contexto de
> abajo antes de tocar nada y respeta el patron existente (DRY).

---

## 1) Que es la app / stack

- PWA estatica: HTML + JavaScript **vanilla** (sin framework) + **Tailwind (CDN)**.
- Archivos por modulo: `jugar.html` (pantalla principal) + varios `fm-*.js`.
- **Service Worker**: `sw.js` con `const CACHE_VERSION = 'fitmatch-vNN'` (subir el numero
  en cada cambio para invalidar cache). HTML = network-first; resto = stale-while-revalidate.
- Deploy: **GitHub Pages** (repo `joshizaguirrea-hub/fit-match-game`), tambien empaquetada
  como **TWA para Google Play** (por eso la licencia de assets IMPORTA).
- Nombres de ejercicios en **espanol** (ej. "Plancha de antebrazos basica (segundos)").

## 2) Como se resuelven HOY las imagenes (NO reinventar, EXTENDER)

Archivo: **`fm-exercise-photos.js`** — expone `window.FMPhotos`:
- `FMPhotos.get(name)` -> una URL de imagen (o '').
- `FMPhotos.getPair(name)` -> `[url0, url1]` (frame inicio/fin) para mini-animacion.
- `FMPhotos.exactMatch(name)` -> bool (hubo match real, no fallback).

Orden de resolucion actual (gana el primero):
1. **WIKI** (override): array `[[keywords...], url]` con fotos de Wikimedia (yoga). Las
   URLs GANAN sobre todo. **<-- AQUI es donde conviene enganchar los GIF (misma idea).
2. **MAP**: `[[keywords...], 'CarpetaMovimiento']` -> `BASE + carpeta + '/0.jpg'` y `/1.jpg`.
   `BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'`.
3. **Fallback tematico** por disciplina (POOLS + hashPick). Siempre devuelve algo.

**EL PROBLEMA A RESOLVER:** en el MAP, `['plancha','plank','hollow'] -> 'Plank'`, asi que
las 40+ variantes de plancha muestran la MISMA imagen. (Solo 'plancha lateral' -> 'Side_Bridge'.)

Render: **`fm-demo.js`** -> `FMDemo.html(name)` usa `getPair()` y hace cross-fade de 2
`<img>` (frame a/b) con CSS. Si el frame no carga, cae a un icono. En `jugar.html` se usan
`<img>` normales para tarjetas de ejercicio y en el modal de video.

## 3) Objetivo

Mostrar demos **reales y claras** (GIF animado) al menos para las planchas y ejercicios
estrella, manteniendo el resto con el sistema actual. Debe:
- Verse perfecto y explicar la tecnica (prioridad #1 del usuario).
- Funcionar **offline** (es PWA) -> los GIFs deben cachearse.
- No romper la licencia para **Google Play**.

## 4) Fuentes de GIFs (elige con criterio de licencia)

| Fuente | Animado | Licencia | Notas |
|---|---|---|---|
| **ExerciseDB** (RapidAPI) | GIFs 1.300+ | REVISAR plan comercial | Requiere API key (tier gratis con rate-limit). Varias planchas con GIF propio. |
| **wger.de** | Pocos animados | Libre CC-BY-SA (atribucion) | API abierta `/api/v2/`. Open-source. |
| **free-exercise-db** (ya integrado) | 2 fotos | Dominio publico | Respaldo universal. |

> IMPORTANTE licencia: para una app en Google Play, confirma por escrito que puedes usar
> los GIFs comercialmente. ExerciseDB: revisar terminos de RapidAPI + su licencia de assets.
> Si hay duda -> usar wger (libre con atribucion) o generar propios en 3D (Mixamo/Blender).

## 5) Arquitectura recomendada (patron override, DRY)

1. **Auto-hospedar** los GIFs elegidos en el repo, ej. `assets/gif/plancha-antebrazos.gif`,
   `plancha-lateral.gif`, etc. (Descargar una vez, versionar). Ventajas: **offline**, sin
   rate-limit de API, y control de licencia (guardas el archivo con su atribucion).
   - Crear `CREDITS-GIFS.md` con la fuente + licencia + atribucion de cada GIF (igual que
     ya existe `CREDITS-YOGA.md`).
2. En `fm-exercise-photos.js`, agregar un array **GIF** ANTES del WIKI:
   ```js
   var GIF = [
     [['plancha lateral','side plank','side bridge'], 'assets/gif/plancha-lateral.gif'],
     [['plancha de antebrazos','plancha tradicional','plancha isometrica','forearm plank','plank'], 'assets/gif/plancha-antebrazos.gif'],
     [['plancha alta','high plank','sobre manos'], 'assets/gif/plancha-alta.gif'],
     [['plancha con toques de hombro','shoulder tap'], 'assets/gif/plancha-shoulder-taps.gif'],
     [['plank jacks','plancha con saltos'], 'assets/gif/plank-jacks.gif'],
     [['comandos','up-down','subiendo a manos'], 'assets/gif/plancha-comandos.gif'],
     [['body saw','balanceo'], 'assets/gif/plancha-body-saw.gif'],
     [['plancha escapular','scapular'], 'assets/gif/plancha-escapular.gif'],
     [['a pica','pike'], 'assets/gif/plancha-pike.gif'],
     [['sobre rodillas','knee plank','rodillas apoyadas'], 'assets/gif/plancha-rodillas.gif']
   ];
   // OJO orden: lo mas especifico primero (ej. 'plancha lateral' antes que 'plancha').
   function gifUrl(name){
     var n = norm(name);
     for (var i=0;i<GIF.length;i++){ var kws=GIF[i][0];
       for (var j=0;j<kws.length;j++){ if (n.indexOf(kws[j])!==-1) return GIF[i][1]; } }
     return '';
   }
   ```
   Y en `get()` / `getPair()`: primero `var g = gifUrl(name); if (g) return g;` (en get)
   o `if (g) return [g, g];` (en getPair para no romper el contrato de 2 frames).
   Añadir a `exactMatch`: `!!gifUrl(n) || ...`.
3. En `fm-demo.js`, detectar si la URL es `.gif`: si lo es, renderizar UN solo `<img>`
   (el GIF ya se anima solo) en vez del cross-fade de 2 frames. Mantener el fallback a icono.
4. **Service Worker `sw.js`**: subir `CACHE_VERSION`. Añadir `assets/gif/*` a la precache
   (o dejar que stale-while-revalidate los cachee al primer uso). Para offline garantizado,
   precachear al menos las planchas.

## 6) Pasos concretos para ExerciseDB (si se elige)

1. Crear cuenta en **rapidapi.com** -> suscribirse a **ExerciseDB** (Basic/Free).
2. Endpoints utiles:
   - `GET /exercises/name/{name}` (busca por nombre en ingles, ej. "plank")
   - `GET /exercises/bodyPart/waist` (waist = core/abdominales)
   - Cada item trae `gifUrl`, `name`, `target`, `bodyPart`, `equipment`, `instructions`.
3. **Mapeo ES->EN**: los nombres de la app estan en espanol. Hacer un diccionario o usar
   las keywords del array GIF de arriba. NO llamar la API en runtime desde el cliente (expone
   la key y pega rate-limit): mejor **script de build** que baje los GIFs una vez a `assets/gif/`.
4. Guardar atribucion/licencia en `CREDITS-GIFS.md`.

## 7) Como probar (la app ya tiene patron de tests con Playwright)

- Hay scripts en `tests/` (ej. `shot_swap.py`, `shot_equip.py`) que levantan un
  `http.server` local y sacan screenshots con Playwright/Edge. Copiar ese patron para
  validar que el GIF de plancha se ve en la tarjeta de rutina.
- Verificar offline: DevTools -> Application -> Service Worker -> Offline, recargar.

## 8) Reglas / cuidados

- **No romper** el fallback: si el GIF no existe/no carga, debe caer al par de fotos actual
  y luego al icono. La cadena es: GIF -> WIKI -> MAP(free-exercise-db) -> fallback tematico.
- Subir `CACHE_VERSION` en `sw.js` en CADA cambio (si no, el usuario ve la version vieja).
- Peso: los GIFs pesan. Optimizar (gifsicle) o considerar `.webp`/`.mp4` (mejor compresion;
  si usas mp4, render con `<video autoplay muted loop playsinline>`).
- Licencia primero. Sin licencia clara -> wger o 3D propio (Mixamo).

## 9) Archivos que tocaras

- `fm-exercise-photos.js` (capa GIF override) — PRINCIPAL.
- `fm-demo.js` (render de `<img>` GIF vs cross-fade).
- `sw.js` (cache version + precache de `assets/gif/`).
- Nuevos: `assets/gif/*.gif`, `CREDITS-GIFS.md`, y un `tools/fetch_gifs.*` (script de build).

---
Fin del brief. Objetivo: planchas con demo real y clara, offline, licencia OK, sin romper lo existente.
