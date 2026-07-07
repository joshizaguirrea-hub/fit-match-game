# Registro de Decisiones (ADR ligero) — Fit Match

Decisiones de arquitectura, en orden cronológico. Formato corto a propósito:
contexto -> decisión -> consecuencia. La más reciente arriba.

---

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
