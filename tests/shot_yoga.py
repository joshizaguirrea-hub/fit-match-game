"""Carga las poses de yoga de Wikimedia SECUENCIALMENTE via FMPhotos.getPair
y las fotografia, para confirmar visualmente que cada foto es la pose correcta."""
import http.server, socketserver, threading, functools, os
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PORT = 8232
POSES = ['Guerrero II','Guerrero III','Perro boca abajo (hold)','Saludo al sol A',
         'Savasana final','Silla (Utkatasana)','Boat pose (Navasana)','Dancer (Natarajasana)',
         'Eagle (Garuda)','King pigeon','Pigeon pose (Eka Pada Rajakapotasana)',
         'Peacock (Mayurasana) preparacion','Wheel (Urdhva Dhanurasana)','Headstand preparacion']


def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    with socketserver.TCPServer(("", PORT), h) as httpd:
        httpd.serve_forever()


threading.Thread(target=serve, daemon=True).start()

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    pg = b.new_page(viewport={"width": 460, "height": 1000}, device_scale_factor=2)
    pg.goto(f"http://localhost:{PORT}/tests/_demo_preview.html")
    pg.wait_for_function("() => window.FMPhotos")
    pg.evaluate("() => { document.body.innerHTML = '<div id=g></div>'; document.body.style.cssText='font-family:sans-serif;background:#101430;color:#eee;margin:0;padding:8px'; }")

    # carga secuencial: una imagen, espera, siguiente
    for nm in POSES:
        url = pg.evaluate("(n) => FMPhotos.getPair(n)[0]", nm)
        pg.evaluate("""([n,u]) => {
            const d=document.createElement('div');
            d.style.cssText='display:inline-block;width:140px;margin:4px;vertical-align:top';
            d.innerHTML='<img src="'+u+'" style="width:140px;height:110px;object-fit:cover;background:#222;border-radius:8px"><div style="font-size:10px">'+n+'</div>';
            document.getElementById('g').appendChild(d);
        }""", [nm, url])
        pg.wait_for_timeout(1800)  # respeta rate-limit

    stats = pg.evaluate("""() => {
        const i=[...document.images];
        return {total:i.length, ok:i.filter(x=>x.naturalWidth>0).length};
    }""")
    print("POSES:", stats)
    pg.wait_for_timeout(1500)
    pg.screenshot(path="tests/shots/yoga_wiki.png", full_page=True)
    b.close()
print("[OK] tests/shots/yoga_wiki.png")
