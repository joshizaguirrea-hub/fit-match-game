"""Screenshot del preview de demos para verificar que las imagenes cargan
(incluye fallback tematico). Espera a que las imagenes esten cargadas."""
import http.server, socketserver, threading, functools, os
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PORT = 8231


def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    with socketserver.TCPServer(("", PORT), h) as httpd:
        httpd.serve_forever()


threading.Thread(target=serve, daemon=True).start()

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    pg = b.new_page(viewport={"width": 420, "height": 1400}, device_scale_factor=2)
    pg.goto(f"http://localhost:{PORT}/tests/_demo_preview.html")
    # espera a que TODAS las <img> hayan cargado (naturalWidth>0) o fallado
    pg.wait_for_timeout(500)
    stats = pg.evaluate("""() => {
        const imgs = [...document.querySelectorAll('img')];
        return new Promise(res => {
            let done = 0; const total = imgs.length;
            const check = () => { if (done>=total) res(report()); };
            const report = () => {
                const ok = imgs.filter(i=>i.complete && i.naturalWidth>0).length;
                const bad = imgs.filter(i=>i.complete && i.naturalWidth===0).length;
                return {total, ok, bad};
            };
            imgs.forEach(i => {
                if (i.complete) { done++; }
                else { i.addEventListener('load',()=>{done++;check();});
                       i.addEventListener('error',()=>{done++;check();}); }
            });
            check();
            setTimeout(()=>res(report()), 20000);
        });
    }""")
    print("IMAGENES:", stats)
    pg.wait_for_timeout(4000)
    pg.screenshot(path="tests/shots/demos_fallback.png", full_page=True)
    b.close()
print("[OK] captura en tests/shots/demos_fallback.png")
