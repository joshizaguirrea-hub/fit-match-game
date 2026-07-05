# Contexto de sesion para Cascade — Fit Match (cambios recientes)

> Lee este archivo + `HANDOFF-GIFS-CASCADE.md` + el `git log` para tener TODO el contexto.
> Resume el trabajo hecho en la ultima sesion (por el agente Horus / Code Puppy en el
> entorno del trabajo, con red restringida). Aqui esta que quedo LIVE, que se DESCARTO y
> que falta HACER.

## Como leer todos los cambios (para Cascade)
1. `git pull` (rama `main`).
2. `git log --oneline -8` para ver los commits.
3. Ver diffs concretos: `git show <hash>` (hashes abajo).
4. Leer `HANDOFF-GIFS-CASCADE.md` (la tarea pendiente principal).

---

## 1) LIVE (ya en produccion, GitHub Pages)

### commit `c4622ca` — Panel "Con que cuentas?" + fix modal Cambiar ejercicio (SW v48)
- **Nuevo filtro de implementos** en el cuerpo interactivo (GIM/Casa/CrossFit) dentro de
  `jugar.html`. Al marcar musculos aparece el panel `#body-equip` ("Con que cuentas?") en
  la columna izquierda: lista los implementos que usan los ejercicios del pool; cada uno es
  un toggle (morado=lo tengo / tachado=no lo tengo). "Peso corporal" siempre disponible.
  Al quitar un implemento se filtran los ejercicios (auto y manual).
  - Estado nuevo: `bodyEquipOff{}`. Funciones nuevas: `exEquipList`, `exAllowedByEquip`,
    `bodyFullPool` (cachea `window.__bodyPoolFull`), `bodyPool`, `renderBodyEquip`,
    `toggleBodyEquip`. `buildAuto`/`buildManual` usan `bodyPool()`.
  - `detectEquipment()` ampliado con equipo CASERO real (mochila/bulto, botellas, silla,
    mesa, pared, cama/sofa, toalla) + "Barra de dominadas" + sistema de EXCLUSIONES `not:[]`
    (ej. "Fondos en silla" = Silla, NO Paralelas).
  - Fix de legibilidad del modal "Cambiar ejercicio" (tema oscuro; antes texto claro sobre
    fondo claro = invisible). Clases nuevas `.swap-item`, `.swap-item--hl`, etc.
- BUG corregido: `renderBodyEquip` usaba cache stale -> ahora SIEMPRE recalcula `bodyFullPool()`.

### commit `4794541` — Migracion Netlify -> GitHub Pages (SW v49)
- Reemplazadas TODAS las URLs `fit-match-game.netlify.app` por
  `https://joshizaguirrea-hub.github.io/fit-match-game/` en `fm-settings.js` y `jugar.html`
  (textos de compartir). Eliminado el `netlify.toml` muerto. Limpieza en `GOOGLE-PLAY.md`.
- **La app se despliega por GitHub Pages** (no Netlify). Dominio: joshizaguirrea-hub.github.io/fit-match-game

### commit `e18bb03` — Brief de GIFs (docs)
- `HANDOFF-GIFS-CASCADE.md`: plan para integrar GIFs reales de ejercicios.

---

## 2) DESCARTADO (NO usar — experimentos en `tests/`)
El usuario NO quedo satisfecho con ilustraciones vectoriales de las planchas. Se probaron y
se descartaron (quedan solo como referencia, NO integrar en la app):
- `tests/_preview_plank.html` (stick figures) — RECHAZADO.
- `tests/_preview_plank_body.html` (silueta anatomica de perfil) — mejor, pero RECHAZADO.
- `tests/_showcase_planchas.html` (3 estilos: Aurora/Nova/Studio) — RECHAZADO.
- `tests/shot_plank.py`, `tests/_probe_gifs.py` — scripts de apoyo.
**Decision final del usuario: quiere GIFs/imagenes REALES (animadas), no vectores.**

---

## 3) PENDIENTE (la tarea para Cascade)
Integrar **GIFs reales de ejercicios** (empezando por las planchas, que hoy TODAS muestran
la misma foto). Detalle completo en **`HANDOFF-GIFS-CASCADE.md`**:
- Confirmar licencia comercial (Google Play).
- Capa de override de GIFs en `fm-exercise-photos.js` (patron DRY, igual que WIKI/MAP).
- Auto-hospedar GIFs en `assets/gif/` para offline + sin rate-limit.
- Render en `fm-demo.js` + cache en `sw.js` (subir CACHE_VERSION) + `CREDITS-GIFS.md`.
- Cadena de fallback: GIF -> Wikimedia -> free-exercise-db -> fallback tematico.

## Archivos clave del sistema de imagenes (rientarse)
- `fm-exercise-photos.js` -> `window.FMPhotos` (get/getPair/exactMatch). Resuelve foto por
  keyword. AQUI va la capa GIF.
- `fm-demo.js` -> `FMDemo.html(name)` renderiza la demo (cross-fade de 2 frames).
- `sw.js` -> `CACHE_VERSION` (subir en cada cambio).
- `jugar.html` -> pantalla principal (usa FMPhotos/FMDemo).
