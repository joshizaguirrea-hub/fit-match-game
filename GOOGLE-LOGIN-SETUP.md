# Activar "Continuar con Google" en Fit Match

El CODIGO ya esta listo (boton + funcion `loginWithGoogle()`). Falta la
configuracion en dos paneles web. Sin estos pasos, el boton dara error
"provider is not enabled". Hazlos UNA vez y queda funcionando para siempre.

Tus datos (ya rellenados):

- Proyecto Supabase: `ebclaayqkcnigelfabhg`
- URL de callback de Supabase (la vas a necesitar):
  `https://ebclaayqkcnigelfabhg.supabase.co/auth/v1/callback`
- URL de tu app (GitHub Pages):
  `https://joshizaguirrea-hub.github.io/fit-match-game/index.html`

---

## PARTE 1 - Google Cloud Console (crear las credenciales)

1. Entra a: https://console.cloud.google.com/
2. Arriba, crea o elige un proyecto (ej. "Fit Match").
3. Menu -> "APIs y servicios" -> "Pantalla de consentimiento de OAuth".
   - Tipo de usuario: **Externo** -> Crear.
   - Nombre de la app: `Fit Match`.
   - Correo de asistencia: el tuyo.
   - Guarda y continua hasta el final (puedes dejar los alcances por defecto).
   - En "Usuarios de prueba" agrega tu propio correo si la app queda en modo
     "Testing" (asi puedes probar antes de publicarla).
4. Menu -> "APIs y servicios" -> "Credenciales" -> "Crear credenciales" ->
   **ID de cliente de OAuth**.
   - Tipo de aplicacion: **Aplicacion web**.
   - Nombre: `Fit Match Web`.
   - En **"URIs de redireccionamiento autorizados"** agrega EXACTAMENTE:
     ```
     https://ebclaayqkcnigelfabhg.supabase.co/auth/v1/callback
     ```
   - Crear.
5. Copia el **Client ID** y el **Client Secret** (los usaras en la Parte 2).

---

## PARTE 2 - Supabase (activar el proveedor Google)

1. Entra a: https://supabase.com/dashboard/project/ebclaayqkcnigelfabhg
2. Menu izquierdo: **Authentication** -> **Providers** (o "Sign In / Providers").
3. Busca **Google** y actualo (Enable).
4. Pega el **Client ID** y **Client Secret** que copiaste de Google Cloud.
5. Guarda (Save).
6. Ahora ve a **Authentication** -> **URL Configuration**:
   - **Site URL**:
     ```
     https://joshizaguirrea-hub.github.io/fit-match-game/index.html
     ```
   - En **Redirect URLs** agrega (una por linea):
     ```
     https://joshizaguirrea-hub.github.io/fit-match-game/index.html
     http://localhost:5500/index.html
     ```
     (La de localhost solo si pruebas en local con Live Server.)
   - Guarda.

---

## PARTE 3 - Probar

1. Abre tu app publicada y toca **"Continuar con Google"**.
2. Te lleva a la pantalla de Google, eliges tu cuenta.
3. Vuelves a Fit Match. Como es tu primer ingreso con Google y aun no tienes
   perfil, te aparece la pantalla **"Crea tu Apodo"** (ya existente). Eliges
   apodo y entras. Listo.

---

## Sobre "no perder datos" (vincular cuenta existente)

- Si un usuario YA tenia cuenta por correo (ej. `pepe@gmail.com`) y luego entra
  con Google usando **el mismo correo**, Supabase puede vincular ambas
  identidades si tienes activada la opcion de **"Link identities" / manual
  linking** o si la confirmacion de email esta configurada para permitirlo.
- Para el caso normal (usuarios nuevos que solo quieren entrar rapido sin
  registrar correo), no hay que hacer nada extra: entran con Google y crean su
  apodo.
- Si mas adelante quieres un boton "Vincular mi cuenta con Google" DENTRO del
  perfil (para usuarios ya logueados por correo), avisame y lo agrego con
  `supabase.auth.linkIdentity({ provider: 'google' })`.

---

## Problemas comunes

| Error | Causa / arreglo |
|---|---|
| "provider is not enabled" | Falta la Parte 2 (activar Google en Supabase). |
| "redirect_uri_mismatch" | La URI en Google Cloud no coincide EXACTO con la de callback de Supabase. |
| Vuelve al login sin entrar | Falta agregar tu URL de app en Redirect URLs (Parte 2, paso 6). |
| Funciona en local pero no en produccion | Agrega la URL de GitHub Pages en Redirect URLs. |

_Hecho por Horus. Cualquier duda, me silbas._
