# Registro de Decisiones (ADR ligero) — Fit Match

Decisiones de arquitectura, en orden cronológico. Formato corto a propósito:
contexto -> decisión -> consecuencia. La más reciente arriba.

---

## ADR-007 — Extraccion de datos con namespace + rebind

- **Contexto:** `jugar.html` tiene grandes `const` de datos (TRAIN_CATS,
  MUSCLE_GROUPS, BODY_GROUPS, WARMUP_EXERCISES, etc.) intercalados con las
  funciones que los usan por nombre. Un test (shot_equip.py) espera algunos
  como global de pagina.
- **Decisión:** Mover solo los DATOS a un archivo (`fm-train-data.js`) bajo
  un unico namespace `window.FM_TRAIN_DATA`, y en `jugar.html` reemplazar
  cada declaracion por un REBIND de una linea:
  `const TRAIN_CATS = window.FM_TRAIN_DATA.TRAIN_CATS;`
- **Consecuencia:** (1) el namespace global queda limpio (un objeto, no 10
  globals sueltos); (2) TODOS los usos siguen igual (bare `TRAIN_CATS`);
  (3) el const de pagina sigue existiendo para tests. El archivo de datos
  DEBE cargarse en el `<head>` ANTES del script inline (olvidarlo = 
  'Cannot read properties of undefined' - ya pasado y cazado por el smoke).

## ADR-006 — Ayuda de ejercicios: resolvedor por movimiento base (no 1 texto por ejercicio)

- **Contexto:** Hay **856 ejercicios unicos** en las rutinas pero solo 35
  tenian explicacion; el resto mostraba un texto GENERICO igual para todos.
  Escribir 821 textos a mano rompe DRY (muchisimos son el mismo movimiento
  con calificadores: "bicicleta", "...rapidos", "...lentos").
- **Decisión:** Base de conocimiento de ~140 **movimientos base** correctos
  (`fm-exercise-help-db.js`, solo datos) + un **resolvedor** en
  `fm-exercise-help.js` que casa por TOKENS con stemming es/plural:
  exacto -> exacto normalizado -> movimiento base (gana la clave con mas
  caracteres, la mas especifica) -> categoria (yoga/pilates/hipopresivos/
  cardio/movilidad/recuperacion) -> generico. Datos separados de logica.
- **Consecuencia:** Cobertura **96% especifica + 4% categoria, 0% generico**
  sobre los 856. Escala solo a ejercicios futuros. Verificable con
  `tools/verify_help_coverage.py` (mide cobertura + spot-check de calidad;
  correr al agregar rutinas).

## ADR-005 — Receta de extracción de features desde `jugar.html`

- **Contexto:** `jugar.html` tiene un script inline gigante. Hay que partirlo
  sin romper nada ni corromper acentos (mojibake).
- **Decisión — receta repetible y test-guarded:**
  1. Identificar un bloque **cohesivo** de funciones y sus dependencias
     (`grep` de cada nombre en TODO el repo para ver quién lo llama).
  2. Preferir bloques **auto-contenidos** (que solo dependan de globales ya
     existentes: `FMVideos`, `FMPhotos`, `FMDemo`, DOM). El núcleo acoplado
     (`G`, `supabase`, `cloudUser`) se deja para el final.
  3. Extraer **byte-exacto** con un script Python de un solo uso
     (`io.open(..., newline="")`), nunca a mano — evita mojibake.
  4. Envolver en IIFE (`(function(){ 'use strict'; ... })()`) y **exponer en
     `window` SOLO** las funciones llamadas desde `onclick`/otros módulos.
  5. Añadir `<script src="...">` en el `<head>` (tras sus dependencias).
  6. `python tools/stamp_version.py --bump` para versionar.
  7. Validar: `qa_static.py` (nombres/handlers) + `smoke_e2e.py` (sin
     excepciones). Solo si ambos en verde -> commit + push.
- **Consecuencia:** Cada extracción es pequeña, reversible y verificada.
  Ya aplicada a `fm-exercise-help.js` y `fm-exercise-video.js`.
- **Aviso:** El smoke test NO cubre una partida completa ni clanes contra
  Supabase en vivo. La extracción del núcleo del juego requiere validación
  humana en el navegador entre pasos.

## ADR-004 — Fuente única de verdad para el cache-busting

- **Contexto:** 33 scripts con `?v=N` a mano; el mismo archivo se pedía con
  versiones distintas en `index.html` y `jugar.html` (ej. `?v=18` vs `?v=32`).
  Olvidar bumpear uno = servir código viejo. Bug real ya vivido.
- **Decisión:** Un archivo `VERSION` (un número) + `tools/stamp_version.py`
  que estampa `?v=<VERSION>` en TODOS los `<script>`/`<link>` locales de los
  HTML y ajusta `CACHE_VERSION` del SW. Idempotente, sin dependencias.
- **Consecuencia:** Imposible olvidar una versión; todo queda consistente con
  un comando. Puente perfecto hasta migrar a ES Modules (ADR-002), que lo
  elimina de raíz.
- **Flujo de despliegue:**
  ```
  python tools/stamp_version.py --bump   # sube VERSION y estampa todo
  git add -A && git commit -m "..." && git push
  ```
  En CI/pre-push se puede validar con `python tools/stamp_version.py --check`.

## ADR-003 — El "linter" es la suite de QA en Python (no ESLint/Prettier, por ahora)

- **Contexto:** La máquina de desarrollo NO tiene Node/npm (sí Python 3.13 +
  Playwright). ESLint/Prettier requieren Node. Meter Node solo para formatear
  en un proyecto vanilla de un dev es sobre-ingeniería (YAGNI).
- **Decisión:** Usar la suite existente como red de seguridad y "linter":
  - `tests/qa_static.py` — parsea TODO el JS (módulos + inline) con esprima;
    caza errores de sintaxis y handlers `onclick` que apuntan a funciones
    inexistentes. **Este es nuestro linter real.**
  - `tests/smoke_e2e.py` — E2E en Edge (Playwright); falla ante excepciones JS
    y cubre los flujos críticos (ajustes, temas, clan, plan del mes, modal de
    rutina y modal de ayuda de ejercicio).
- **Consecuencia:** Cero dependencia de Node. Si algún día queremos formateo
  automático, se instala Node y se agregan ESLint/Prettier sin romper nada.
- **Cómo correr (antes de cada push):**
  ```
  uv run --with esprima python tests/qa_static.py
  uv run --with playwright python tests/smoke_e2e.py
  ```

## ADR-002 — Migrar a ES Modules nativos (import/export)

- **Contexto:** Hoy hay 33 `<script src>` con cache-busting manual `?v=N`.
  `index.html` y `jugar.html` referencian los MISMOS archivos con versiones
  DISTINTAS (ej. `fm-supabase.js?v=18` vs `?v=32`) → fuente de bugs de caché.
- **Decisión:** Migrar de IIFE + `window.FMXxx` a ES Modules (`import`/`export`),
  con un único `<script type="module">` de entrada por página.
- **Consecuencia:** Funciona en GitHub Pages **sin build tools**. El navegador
  resuelve dependencias y cachea por URL/hash → adiós al `?v=N` manual.
  Es un refactor grande: se hará por fases, con la suite de QA validando.
- **Estado:** Planificado (Fase 4 del roadmap).

## ADR-001 — Refactor por fases, nunca big-bang

- **Contexto:** La app está en producción (GitHub Pages) y funciona. Un
  reescrito total arriesga tumbarla.
- **Decisión:** Todo cambio estructural se hace por fases pequeñas, cada una
  con su commit reversible y validada por `qa_static.py` + `smoke_e2e.py`.
  Nunca se avanza de fase con la suite en rojo.
- **Consecuencia:** Progreso más lento pero seguro; siempre podemos hacer
  `git revert` de una fase sin arrastrar las demás.

---

_Autor: Horus · Proyecto: Fit Match_
