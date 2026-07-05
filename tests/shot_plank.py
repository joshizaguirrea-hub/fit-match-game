"""Renderiza el preview de la plancha SVG a PNG para revision visual."""
import http.server, socketserver, threading, os, functools, time
from playwright.sync_api import sync_playwright

PORT = 8155
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
        browser = p.chromium.launch(channel="msedge", proxy={"server": "http://sysproxy.wal-mart.com:8080", "bypass": "127.0.0.1,localhost"})
        ctx = browser.new_context(viewport={"width": 1060, "height": 620}, device_scale_factor=2)
        page = ctx.new_page()
        page.goto(base + "/tests/_showcase_planchas.html", wait_until="load")
        page.wait_for_timeout(1200)
        out = os.path.join(OUT, "showcase_planchas.png")
        page.screenshot(path=out, full_page=True)
        print("[OK]", out)
        browser.close()


if __name__ == "__main__":
    main()
