#  Fit Match Game · FASE 2 (Lobby Social y Base de Datos en la Nube)

¡Bienvenido al repositorio oficial del juego espartano de rol y fitness **Fit Match**! En esta fase, elevamos el motor del juego local a una plataforma social, gamificada y cooperativa en tiempo real conectada a la nube mediante **Supabase** y hospedada de forma ilimitada en **GitHub Pages**.

---

##  Logros y Funcionalidades de la Fase 2

### 1.  Base de Datos e Inicio de Sesión Seguro
*   **Hospedaje de Datos:** Conectado al cerebro de la nube con **Supabase** (PostgreSQL) de forma segura utilizando la llave pública `sb_publishable_...`.
*   **Login Tradicional con Contraseña:** Diseñamos un panel unificado de pestañas moradas en la carátula (`index.html`) para **Iniciar Sesión** (Email y Contraseña) y **Registrarse** (Email, Apodo y Contraseña).
*   **Recuperación Segura por Correo:** Enlace discreto para restablecer la contraseña en caso de olvido o migración de Magic Links viejos, con un flujo asíncrono optimizado y libre de bucles en `onAuthStateChange`.
*   **Asistencia y Diagnósticos:** Flujo con cajas de alerta que informan en perfecto español si el usuario introdujo mal su contraseña o si la red bloqueó la conexión.

### 2.  El Panteón de los 72 Dioses y Héroes Míticos
*   **Symmetry & Volume:** Expandimos el catálogo de `fm-routines.js` a exactamente **72 rutinas exclusivas** repartidas en **9 culturas legendarias** (Grecia, Nórdicos, Egipto, China, Japón, Mongoles, Mayas, Aztecas, Incas).
*   **Estructura Symmetrical (8 por cultura):** Cada bloque cultural tiene exactamente 2 rutinas Básicas, 2 Intermedias, 2 Avanzadas y 2 Espartanas.
*   **Entrenamientos Completísimos por Rondas (Sets):** Cada Dios te exige realizar de **3 a 4 rondas completas de un circuito de 6 ejercicios** con variedad muscular (empuje, tracción, isométricos, core y cardio).
*   **Checklist Interactivo:** Selector dinámico con cajas de chequeo que desbloquea el botón de "Siguiente Ronda" o "Completar Entrenamiento" solo al rellenar el 100% de la lista.
*   **Guía de Técnica Interactiva (Popups):** Al lado de cada ejercicio extraño (Wipers, Hollow Body, Pike Pushups, Comandos, etc.), agregamos un icono azul de información que despliega instrucciones detalladas del ejercicio, músculos trabajados, y un enlace tutorial a YouTube.

### 3.  Red Social y Chat Global Realtime
*   **Chat Global por Websockets:** Un chat en tiempo real integrado de forma elegante en un panel lateral deslizable con transiciones CSS en `jugar.html`.
*   **Canales Realtime:** Supabase habilitado para escuchar inserciones de la tabla `messages` en vivo, distribuyendo los mensajes de los atletas conectados al instante por la pantalla.

### 4.  Gremios y Clanes ("Fit Bros")
*   **Límite de 30 Miembros:** Enfoque gamificado y balanceado para crear escuadrones cerrados de amigos. El código valida que un clan no exceda las 30 personas antes de unirse.
*   **Misiones de Cabo (Rango 3):** Requisito de nivel real: **solo los usuarios con Rango Cabo o superior (más de 50 PX totales en la nube) pueden fundar su propio Gremio**.

### 5.  Citas de Entrenamiento y Modo Cooperativo Sincronizado
*   **Presencia Online/Offline:** Listado dividido entre atletas conectados con punto verde y registrados desconectados.
*   **Buzón de Citas:** Agenda entrenamientos grupales con fecha y hora específicas para atletas desconectados. Al aceptarlas, se guardan en la agenda como "Próximos Entrenos".
*   **Entrenamiento Sincronizado en Tiempo Real (Co-op):** Al unirse con un amigo o clan usando un **Código de Sala de 4 letras** (ej: `X7YZ`), las pantallas se enlazan de forma inalámbrica por Supabase Broadcast. **¡Lo que marques en tu checklist se marcará de inmediato en la pantalla de tu amigo en tiempo real!**

---

##  El Sistema de Rangos Militares Oficial

Tu rango militar se calcula dinámicamente y se muestra con insignias de gloria basadas en tus **Puntos Totales de Experiencia (PX)** de por vida:

1.  **Recluta** (0 a 15 PX) · *El inicio del viaje.*
2.  **Soldado** (16 a 49 PX) · *Muestra constancia inicial.*
3.  **Cabo** (50 a 99 PX) · *¡Socio oficial de Fit Match! Desbloquea la capacidad de fundar Gremios.*
4.  **Sargento** (100 a 199 PX) · *Líder táctico de batallas.*
5.  **Teniente** (200 a 399 PX) · *Atleta experimentado de holdings.*
6.  **Capitán** (400 a 699 PX) · *Comandante de circuitos pesados.*
7.  **Mayor** (700 a 999 PX) · *Leyenda andina de la selva profunda.*
8.  **General** (1000+ PX) · *El honor supremo del panteón espartano.*

---

##  Despliegue de Producción y Migración Ilimitada

*   **Nuevo Hogar:** Mudamos la aplicación a **GitHub Pages** para gozar de ancho de banda ilimitado y subidas infinitas sin pagar planes corporativos.
*   **Enlace de Producción Oficial:** [https://joshizaguirrea-hub.github.io/fit-match-game/](https://joshizaguirrea-hub.github.io/fit-match-game/)

---

##  Nota de Horus para Joshua

*¡Qué tremenda aventura de programación hemos vivido hoy, mi líder! Logramos resolver un bug asíncrono pesadísimo de Supabase y descubrimos que el bloqueo de red se debió al perfil corporativo de Walmart instalado en tu celular y laptop (Zscaler vigilando). ¡Tu código de producción en internet en dispositivos limpios es un éxito rotundo del 100%!*

*Descansa muchísimo. Mañana continuaremos expandiendo este gran imperio. ¡Hasta mañana, espartano! ¡Guau!*

---

## Documentacion tecnica (para desarrolladores)

- **Arquitectura y roadmap:** `docs/ARCHITECTURE.md` (auditoria, inventario de
  modulos por capa, arquitectura objetivo y plan de refactor por fases).
- **Decisiones de diseno (ADRs):** `docs/DECISIONS.md`.
- **Tests / QA:** `tests/README.md`. Antes de cada push, en verde:
  ```
  uv run --with esprima python tests/qa_static.py
  uv run --with playwright python tests/smoke_e2e.py
  ```
- **Despliegue (versionado automatico):** ya NO se editan `?v=N` ni `sw.js` a
  mano. Fuente unica: archivo `VERSION` + `tools/stamp_version.py`.
  ```
  python tools/stamp_version.py --bump
  git add -A && git commit -m "..." && git push
  ```

> Refactor en curso (Fase 3): se esta partiendo el script inline gigante de
> `jugar.html` en modulos `fm-*.js` por feature, uno a la vez y con la suite
> de QA validando cada paso. Ya extraidos: `fm-exercise-help.js`,
> `fm-exercise-video.js`.
