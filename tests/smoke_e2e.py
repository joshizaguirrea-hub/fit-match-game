#!/usr/bin/env python3
"""
Smoke test E2E de Fit Match con Playwright + Edge del sistema.
Levanta un servidor estatico local, carga las paginas y ejercita los
flujos clave capturando EXCEPCIONES de JavaScript (pageerror).

No falla por warnings de consola normales (Supabase sin login, etc.),
solo por errores JS reales no capturados.

Uso:  uv run --with playwright python tests/smoke_e2e.py
"""
import os, sys, threading, functools, http.server, socketserver, time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8137
BASE = f"http://127.0.0.1:{PORT}"

# Errores de consola que son ESPERADOS (red/entorno de test) y no cuentan.
IGNORE = (
    "supabase", "Failed to load resource", "net::", "ERR_", "favicon",
    "Failed to fetch", "AudioContext", "autoplay", "spotify", "cdn.tailwindcss",
    "was preloaded", "manifest", "serviceworker", "sw.js", "NotAllowedError",
    "permissions policy", "Notification", "googleapis", "gstatic",
)


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    httpd.log_message = lambda *a, **k: None
    # Silenciar ConnectionReset ruidoso cuando el navegador cierra sockets.
    httpd.handle_error = lambda *a, **k: None
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def keep(msg):
    low = msg.lower()
    return not any(tok.lower() in low for tok in IGNORE)


def run():
    os.chdir(ROOT)
    httpd = serve()
    time.sleep(0.6)
    problems = []
    passed = []

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge")

        def check_page(path, actions=None, name=None):
            name = name or path
            # Cada pagina en su PROPIO contexto (aislado) con SW bloqueado:
            # el Service Worker provoca un reload a mitad de carga que corrompe
            # la medicion; no es un bug de la app.
            ctx = browser.new_context(viewport={"width": 390, "height": 780}, service_workers="block")
            page = ctx.new_page()
            errs = []
            page.on("pageerror", lambda e: errs.append(f"[pageerror] {e}"))
            page.on("console", lambda m: errs.append(f"[console.{m.type}] {m.text}")
                    if m.type == "error" else None)
            try:
                page.goto(f"{BASE}/{path}", wait_until="load", timeout=25000)
                page.wait_for_timeout(2500)  # dejar correr init
                if actions:
                    actions(page)
                page.wait_for_timeout(800)
            except Exception as e:
                errs.append(f"[navegacion] {e}")
            real = [e for e in errs if keep(e)]
            if real:
                problems.append((name, real))
            else:
                passed.append(name)
            ctx.close()

        # ---- index.html ----
        check_page("index.html", name="index.html (home)")

        # ---- jugar.html + flujos ----
        def jugar_actions(page):
            # Esperar a que la barra inferior este lista (la app es grande)
            page.wait_for_selector("button[title='Ajustes']", timeout=20000)
            # Abrir Ajustes
            page.click("button[title='Ajustes']", timeout=6000)
            page.wait_for_selector("#fm-settings-modal", state="visible", timeout=6000)
            # Cambiar a tema claro y oscuro
            page.click("#fm-settings-modal button:has-text('Claro')", timeout=4000)
            page.wait_for_timeout(300)
            page.click("#fm-settings-modal button:has-text('Oscuro')", timeout=4000)
            page.wait_for_timeout(300)
            # Mover volumen
            sl = page.query_selector("#fm-settings-modal input[type=range]")
            if sl:
                sl.fill("40")
                sl.dispatch_event("change")
            # Cerrar settings (via JS: un toast transitorio puede tapar la X arriba-derecha)
            page.evaluate("window.FMSettings && FMSettings.close()")
            page.wait_for_timeout(300)
            # Abrir la Tienda (chip de monedas) si esta visible; si no, invocar directo
            page.evaluate("window.openTienda && window.openTienda()")
            page.wait_for_timeout(500)
            page.evaluate("window.closeTienda && window.closeTienda()")
            # Abrir Clan
            page.click("button[title='Tu Clan']", timeout=6000)
            page.wait_for_timeout(800)
            # Verificar el sistema de DEMOS animadas de ejercicios
            res = page.evaluate("""() => {
              if (!window.FMDemo) return {ok:false};
              const known = FMDemo.html('flexiones');
              // Antes caia a icono; ahora usa fallback tematico por disciplina
              // (yoga/pilates/etc.) => SIEMPRE demo con 2 frames, nunca icono.
              const pose = FMDemo.html('Guerrero II');
              const breath = FMDemo.html('Respiracion diafragmatica');
              const cnt = (s) => (s.match(/<img/g)||[]).length;
              return {
                ok:true,
                animKnown: known.includes('fm-demo') && cnt(known)===2 && known.includes('fm-demo-b'),
                fallbackPose: pose.includes('fm-demo') && cnt(pose)===2 && pose.includes('fm-demo-b'),
                fallbackBreath: breath.includes('fm-demo') && cnt(breath)===2 && breath.includes('fm-demo-b')
              };
            }""")
            if not res.get("ok"):
                raise AssertionError("FMDemo no esta cargado")
            if not res.get("animKnown"):
                raise AssertionError("FMDemo no genera demo animada (2 frames) para ejercicio conocido")
            if not res.get("fallbackPose"):
                raise AssertionError("FMDemo no da imagen tematica (2 frames) para pose de yoga")
            if not res.get("fallbackBreath"):
                raise AssertionError("FMDemo no da imagen tematica (2 frames) para ejercicio de respiracion")

        check_page("jugar.html", actions=jugar_actions, name="jugar.html (ajustes+temas+clan)")

        # ---- privacy.html ----
        check_page("privacy.html", name="privacy.html")

        browser.close()

    httpd.shutdown()

    print("=" * 60)
    print("SMOKE TEST E2E FIT MATCH (Edge)")
    print("=" * 60)
    for n in passed:
        print(f"[OK] {n}")
    if problems:
        print()
        for name, errs in problems:
            print(f"[X] {name}:")
            for e in errs:
                print("     -", e)
        print("\nRESULTADO: FALLO")
        sys.exit(1)
    print("\nRESULTADO: TODO OK (sin excepciones JS en los flujos probados)")
    sys.exit(0)


if __name__ == "__main__":
    run()
