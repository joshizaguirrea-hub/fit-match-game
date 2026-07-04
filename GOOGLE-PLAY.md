#  Publicar Fit Match en Google Play (TWA)

Fit Match ya es una **PWA instalable** y está lista para empaquetarse como app
nativa Android usando **TWA (Trusted Web Activity)** con **Bubblewrap**.

---

##  Lo que YA está listo
- `manifest.json` completo: nombre, `id`, descripción, `display: standalone`,
  colores, `orientation`, iconos **192 / 512 / maskable-512**, categorías y shortcuts.
- Service Worker (`sw.js`) con soporte offline.
- Iconos maskables (se ven bien en cualquier launcher Android).

---

##  Caveat importante (GitHub Pages)
Hoy la app vive en un **project page** con subruta:
`https://joshizaguirrea-hub.github.io/fit-match-game/`

Para TWA, el archivo de verificación **`/.well-known/assetlinks.json` debe estar
en la RAÍZ del dominio** (`https://joshizaguirrea-hub.github.io/.well-known/...`),
la cual **no controlas** en un project page.

**Opciones:**
1. **Dominio propio** (recomendado): apunta un dominio (ej. `fitmatch.app`) a
   GitHub Pages y sube ahí `assetlinks.json`. TWA sin fricción.
2. **User/Org page**: mover el sitio a `joshizaguirrea-hub.github.io` (repo
   `joshizaguirrea-hub.github.io`) para controlar la raíz.
3. **Otro hosting** (Vercel/Firebase Hosting/Cloudflare Pages) con control de `.well-known`.

---

##  Pasos con Bubblewrap

> Requiere Node 18+ y JDK 17. Bubblewrap genera el keystore y el APK/AAB.

```bash
# 1) Instalar Bubblewrap
npm i -g @bubblewrap/cli

# 2) Inicializar desde el manifest desplegado
bubblewrap init --manifest https://TU-DOMINIO/manifest.json

#    Te preguntará: package name (ej. com.fitmatch.app), colores, etc.
#    GUARDA el keystore y sus contraseñas que genera.

# 3) Obtener el fingerprint SHA-256 de tu keystore
keytool -list -v -keystore android.keystore -alias android \
  | findstr SHA256          # (Windows)  /  grep SHA256 en Mac/Linux

# 4) Pega ese SHA-256 en .well-known/assetlinks.json y súbelo a la raíz del dominio.

# 5) Compilar el App Bundle para Play
bubblewrap build
#    Genera app-release-bundle.aab  ->  súbelo a Google Play Console.
```

### Si usas **Play App Signing** (recomendado por Google)
Google re-firma tu app. Debes usar el SHA-256 que aparece en
**Play Console → Configuración → Integridad de la app → App signing** y ponerlo
(además del tuyo) en `assetlinks.json`. Puedes listar varios fingerprints.

---

##  Checklist antes de subir a Play Console
- [ ] Dominio con `.well-known/assetlinks.json` accesible y con el SHA-256 correcto.
- [ ] `package_name` en `assetlinks.json` == el de la app (`com.fitmatch.app`).
- [ ] Capturas de pantalla (teléfono + 7"/10" tablet).
- [ ] Ícono 512×512 y feature graphic 1024×500.
- [ ] Política de privacidad pública → ya tienes `privacy.html` .
- [ ] Clasificación de contenido + cuestionario de Data Safety.
- [ ] Probar la TWA: al abrir la app NO debe verse la barra de URL del navegador
      (si se ve, `assetlinks.json` no está verificando bien).

---

##  Verificar Asset Links
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://TU-DOMINIO&relation=delegate_permission/common.handle_all_urls
```
Debe devolver tu statement sin errores.
