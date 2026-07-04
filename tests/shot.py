"""Captura screenshots del visual de Fit Match para auditoria de colores/contraste.
Levanta un server local y fotografia las pantallas clave en viewport movil (portrait).
"""
import http.server, socketserver, threading, os, functools, time
from playwright.sync_api import sync_playwright

PORT = 8123
ROOT = os.path.dirname(os.path.abspath(__file__)) + os.sep + ".."
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
os.makedirs(OUT, exist_ok=True)


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.abspath(ROOT))
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        httpd.serve_forever()


def main():
    t = threading.Thread(target=serve, daemon=True)
    t.start()
    time.sleep(1)
    base = f"http://127.0.0.1:{PORT}"
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge")
        # viewport movil tipico (portrait), escala 2 para nitidez
        ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
        page = ctx.new_page()

        shots = [
            ("index", "/index.html", 2500),
            ("jugar", "/jugar.html", 3000),
            ("privacy", "/privacy.html", 1500),
        ]
        for name, path, wait in shots:
            page.goto(base + path, wait_until="networkidle")
            page.wait_for_timeout(wait)
            page.screenshot(path=os.path.join(OUT, f"{name}.png"), full_page=True)
            print(f"[OK] {name}.png")

        browser.close()
    print("LISTO. Screenshots en tests/shots/")


if __name__ == "__main__":
    main()
