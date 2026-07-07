# Arquitectura — Fit Match

> Documento vivo. Describe el estado actual, la arquitectura objetivo y el
> plan por fases para llegar ahí **sin romper la app en producción**.
>
> Regla de oro: la mejor arquitectura no es la más bonita, es la que **no rompe
> lo que ya funciona**. Refactorizamos por fases, con commits reversibles.

---

## 1. Stack

- **Frontend:** HTML + Tailwind (CDN) + JavaScript vanilla (sin framework).
- **Patrón actual:** IIFE + namespaces globales (`window.FMXxx`), cargados con
  múltiples `<script src>` y cache-busting manual `?v=N`.
- **Backend:** Supabase (auth, Postgres, realtime, storage).
- **Hosting:** GitHub Pages (deploy desde `main`, sin build step).
- **PWA:** Service Worker (`sw.js`) con versión de caché manual (`fitmatch-vNN`).

---

## 2. Diagnóstico (auditoría real)

### Lo que está bien
- Patrón de módulos con namespaces = separación de responsabilidades real.
- Datos separados de la lógica (rutinas, bodymap, fotos).
- Motores deterministas (seguridad PAR-Q, nutrición) → testeables.
- App desplegada y funcionando como PWA.

### Deuda técnica (por gravedad)
| # | Problema | Detalle | Gravedad |
|---|----------|---------|----------|
| 1 | `jugar.html` monstruoso | 4.902 líneas / 300 KB. `<script>` inline de ~4.350 líneas (juego, clanes, salas, rutinas, plan). Viola la regla de 600 líneas. |  Crítico |
| 2 | Cache-busting manual `?v=N` | 33 scripts, cada uno con su versión a mano. Olvidar uno = servir código viejo. |  Alto |
| 3 | `index.html` con JS inline | 1.663 líneas. |  Medio |
| 4 | Sin linter / formatter | Mezcla `var`/`const`, arrow/function, estilos inconsistentes. |  Medio |
| 5 | Sin tests automáticos de flujos críticos | Solo scripts sueltos de Playwright en `tests/`. |  Medio |
| 6 | Archivos sueltos en la raíz | 33 JS + ~20 SQL + varios HTML en el mismo nivel. |  Bajo |

**Villano #1: el `jugar.html` gigante.** Todo lo demás es secundario.

---

## 3. Inventario de módulos (por capa lógica)

Aunque hoy están todos planos en la raíz, conceptualmente pertenecen a capas:

### Datos (estado inmutable / catálogos)
- `fm-routines.js` — rutinas por cultura ("Dioses").
- `fm-specialized-routines.js` — rutinas por categoría (gym, casa, yoga, etc.).
- `fm-bodymap-data.js` — mapa muscular.
- `fm-exercise-photos.js` — fotos de ejercicios.
- `fm-videos.js` — enlaces a videos.
- `fm-demo.js` — datos de demostración.

### Núcleo / motores (lógica pura, sin I/O)
- `fm-safety.js` — filtro PAR-Q y disclaimers médicos.
- `fm-nutrition.js` — cálculo BMR/TDEE/macros (Mifflin-St Jeor).
- `fm-recipes.js` — construcción de menús.
- `fm-monthly.js` — motor del Plan del Mes (disciplinas, calendario).
- `fm-memory.js` — memoria de ejercicios.
- `fm-badges.js` / `fm-achievements.js` — gamificación.
- `fm-deck.js` / `fm-fichas.js` — mecánica de cartas del juego.
- `fm-trainer.js` — lógica del entrenador.

### Servicios (I/O externo)
- `fm-supabase.js` — cliente Supabase.
- `fm-presence.js` — heartbeat de "en línea".
- `fm-notify.js` — notificaciones.
- `fm-dm.js` — mensajes directos.
- `fm-call.js` / `fm-group-call.js` — llamadas (WebRTC).
- `fm-rooms.js` — salas.

### UI / presentación
- `fm-a11y.js` — accesibilidad (WCAG).
- `fm-fx.js` — efectos visuales.
- `fm-music.js` — audio.
- `fm-settings.js` — ajustes.
- `fm-guide.js` — guía.
- `fm-install.js` — prompt de instalación PWA.
- `fm-profile.js` — perfil de usuario.

### Glue / entrada (¡el problema!)
- Script inline en `jugar.html` (~4.350 líneas) — juego, clanes, salas, detalle
  de rutina, integración del plan. **A extraer por feature.**
- Script inline en `index.html` — auth, onboarding, guilds.

---

## 4. Arquitectura objetivo

```
fit-match-juego/
├── index.html · jugar.html      # SOLO markup + 1 <script type="module">
├── src/
│   ├── data/        # rutinas, bodymap, fotos, videos (datos puros)
│   ├── core/        # safety, nutrition, recipes, memory, plan (motores)
│   ├── features/    # game, clan, rooms, plan-ui, profile (cada feature aislada)
│   ├── services/    # supabase, presence, notify, dm, call, rooms (I/O)
│   └── ui/          # modales, fx, a11y, install (presentación)
├── sql/             # migraciones ordenadas: 001_..., 002_...
├── docs/            # ARCHITECTURE.md, DECISIONS.md
└── tests/           # E2E Playwright por feature
```

### Principios
- **ES Modules nativos** (`import`/`export`) → un solo `<script type="module">`.
  Funciona en GitHub Pages **sin build tools** y elimina el `?v=N` manual.
- **Un archivo, una responsabilidad.** Máximo 600 líneas.
- **Dependencias en una sola dirección:** `data → core → features → ui`.
  Los servicios se inyectan; los motores nunca importan UI.
- **Fuente única de versión** para SW y assets.

---

## 5. Roadmap por fases (seguro y reversible)

> Cada fase = rama/commit propio, testeable y reversible con git.

**Fase 0 — Colchón de seguridad** *(sin tocar código de la app)* — HECHA
- [x] Este documento de arquitectura.
- [x] `docs/DECISIONS.md` (registro de decisiones ADR).
- [x] Red de seguridad validada en verde: `tests/qa_static.py` (linter) +
      `tests/smoke_e2e.py` (E2E). Baseline establecida ANTES de refactorizar.
- [x] Smoke test extendido: plan del mes (disciplinas), modal de rutina y
      modal de ayuda (guarda contra el recorte del modal).
- [~] ESLint/Prettier: descartado por ahora (no hay Node). Ver ADR-003.

**Fase 1 — Matar el cache-busting manual** — HECHA
- [x] `VERSION` (fuente única) + `tools/stamp_version.py` estampan `?v=`
      en todos los HTML y el `CACHE_VERSION` del SW. Idempotente, sin Node.
      Validado con la suite de QA en verde. Ver ADR-004.

**Fase 2 — Reorganización de carpetas** *(mecánico, alto cuidado con rutas)*
- [ ] Mover JS a `src/**`, SQL a `sql/**`, docs a `docs/**`.
- [ ] Actualizar todas las rutas de `<script>`. Validar con E2E.

**Fase 3 — Partir el `jugar.html` (el villano #1)**
- [ ] Extraer el script inline a módulos por feature, uno a la vez:
      `game`, `clan`, `rooms-ui`, `routine-detail`, `plan-glue`.
- [ ] Tras cada extracción: E2E verde + commit.

**Fase 4 — Migrar a ES Modules**
- [ ] Convertir IIFE/`window.FMXxx` a `export`/`import`.
- [ ] Un único punto de entrada `<script type="module" src="src/main.js">`.

**Fase 5 — Pulido**
- [ ] Aplicar Prettier a todo (un solo commit de formato).
- [ ] Reglas ESLint en verde.
- [ ] Ampliar cobertura E2E por feature.

---

## 6. Convenciones (propuestas)

- **Nombres:** `fm-<feature>.js` hoy; en `src/` el prefijo `fm-` sobra.
- **JS:** `const`/`let` (nunca `var`), funciones flecha para callbacks.
- **Sin lógica en el HTML** más allá de un `<script type="module">` de entrada.
- **SQL:** migraciones numeradas e idempotentes (`ADD COLUMN IF NOT EXISTS`).
- **Commits:** pequeños, en español, tipo `feat/fix/refactor(scope): ...`.
- **Cada feature nueva:** su módulo + su prueba E2E.

---

## 7. Decisiones tomadas

1. **Tooling:** ligero, pero **sin Node** — el "linter" es la suite Python
   (`qa_static.py` + `smoke_e2e.py`). Ver ADR-003.
2. **ES Modules:** sí, migración planificada (Fase 4). Ver ADR-002.
3. **Orden:** Fase 0 (hecha) -> versionado -> reorg carpetas -> partir
   `jugar.html` -> ES Modules -> pulido.
4. **Reorg carpetas:** sí, con la suite de QA validando cada movimiento.

_Última actualización: 2026-07-05 · Autor: Horus_
