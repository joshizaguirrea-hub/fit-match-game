#  Agente de IA GRATIS para seguir con Fit Match

Guía para montar un asistente de código **gratis** (estilo Code Puppy / Cascade)
en tu **PC personal**, sin que se te acaben los créditos.

> **Resumen ultra-rápido:** Instala **VS Code** → mete la extensión **Cline** →
> conéctala a **Google Gemini 2.0 Flash (gratis)**. Listo. Para trabajar sin
> internet (100% ilimitado), abajo está el plan B con **Ollama**.

---

##  ¿Cuál elegir? (lo honesto)

| Opción | ¿Ilimitado? | ¿Gratis? | Velocidad | Recomendado si... |
|---|---|---|---|---|
| **Cline + Gemini free** | Cuota diaria enorme (~1500/día) |  |  Rápido | Es tu día a día. **Empieza aquí.** |
| **Cline + Ollama (local)** |  100% infinito |  Total |  Lento sin GPU | Quieres trabajar sin internet |

Fit Match tiene archivos GRANDES (`jugar.html` ≈ 298 KB). Los modelos locales
en una laptop sin GPU dedicada sufren con eso. Por eso **Gemini es el ganador**
para el día a día, y Ollama queda como respaldo offline.

---

##  OPCIÓN A — Cline + Google Gemini (recomendada)

### Paso 1 · Instalar VS Code
- Descarga: https://code.visualstudio.com/
- (Windows, con winget): abre PowerShell y corre:
  ```powershell
  winget install --id Microsoft.VisualStudioCode -e
  ```

### Paso 2 · Instalar la extensión Cline
1. Abre VS Code.
2. Barra lateral izquierda → icono de **Extensiones** (o `Ctrl+Shift+X`).
3. Busca **"Cline"** (el logo es un robotcito ).
4. Click en **Install**.

### Paso 3 · Sacar tu API key GRATIS de Gemini
1. Ve a: https://aistudio.google.com/apikey
2. Inicia sesión con tu cuenta de Google (personal).
3. Click en **"Create API key"** → cópiala (empieza con `AIza...`).
4.  Guárdala como una contraseña. No la subas a GitHub.

### Paso 4 · Conectar Cline con Gemini
1. En VS Code, abre Cline (icono en la barra lateral).
2. En la configuración del proveedor (API Provider) elige **"Google Gemini"**.
3. Pega tu API key.
4. Modelo recomendado: **`gemini-2.0-flash`** (rápido y gratis).
   - Si necesitas más "cerebro" para algo complejo: `gemini-2.0-flash-thinking`
     o `gemini-1.5-pro` (también en el free tier, pero con cuota más baja).

### Paso 5 · Abrir Fit Match y trabajar
1. En VS Code: **File → Open Folder** → elige la carpeta `fit-match-juego`.
2. Abre Cline y pídele cosas como:
   > "Lee `jugar.html` y agrégame X feature al panel de rutinas."
3. Cline te mostrará los cambios propuestos antes de aplicarlos. Revísalos y acepta.

---

##  OPCIÓN B — Cline + Ollama (100% offline e ilimitado)

Úsalo cuando no tengas internet o quieras cero dependencias externas.
Ojo: en tu laptop (i7-1365U, sin GPU dedicada, 16 GB RAM) irá **lento**.

### Paso 1 · Instalar Ollama
- Descarga: https://ollama.com/download
- (Windows con winget):
  ```powershell
  winget install --id Ollama.Ollama -e
  ```

### Paso 2 · Bajar un modelo de código
Abre una terminal y corre (elige UNO):
```powershell
# Buen equilibrio (necesita ~5-6 GB RAM). Recomendado para tu equipo:
ollama pull qwen2.5-coder:7b

# Más ligero y rápido (si el 7b va muy lento):
ollama pull qwen2.5-coder:3b
```

### Paso 3 · Conectar Cline con Ollama
1. En Cline → API Provider → elige **"Ollama"**.
2. Base URL: `http://localhost:11434` (por defecto).
3. Modelo: `qwen2.5-coder:7b` (o el que bajaste).

>  Tip: para probar que Ollama corre bien, en terminal:
> `ollama run qwen2.5-coder:7b "dime hola"`

---

##  Tu red de seguridad: GIT (ya la tienes)

Este proyecto **ya está en git** y respaldado en GitHub:
`https://github.com/joshizaguirrea-hub/fit-match-game`

Antes de dejar que CUALQUIER agente toque el código, y después de cambios buenos:

```bash
# Ver qué cambió
git status
git diff

# Guardar un punto de restauración (commit)
git add -A
git commit -m "describe tu cambio aquí"
git push               # sube a GitHub

# ¿Un agente rompió algo? Vuelve atrás:
git restore .          # descarta cambios no commiteados
git reset --hard HEAD  # vuelve al último commit (¡cuidado, borra cambios!)
```

**Regla de oro:** commitea seguido. Git es tu máquina del tiempo. 

---

## 🆚 Otras alternativas gratis (por si te da curiosidad)

- **Roo Code** — fork de Cline, igual de bueno, muy activo. Misma configuración.
- **Continue.dev** — más enfocado a autocompletado + chat. Soporta Gemini/Ollama.
- **Codeium (plugin básico)** — autocompletado gratis de por vida (no es agente).
- **OpenRouter** — tiene modelos con sufijo `:free`. Cline lo soporta como proveedor.

---

##  FAQ rápida

**¿Perderé el trabajo que hice con Code Puppy?**
No. Tu código son archivos normales en tu disco + GitHub. Cambiar de agente es
como cambiar de editor: el proyecto sigue igual.

**¿Cline y otros agentes se pelean?**
No. Puedes tener varios instalados; solo usa uno a la vez sobre el mismo archivo.

**¿Gemini free es de verdad gratis?**
Sí, tiene un free tier generoso. Para un proyecto personal es más que suficiente.
Solo respeta los límites diarios (se reinician cada día).

---

_Hecho con  por Horus (Code Puppy) — cualquier duda, ya sabes dónde encontrarme._
