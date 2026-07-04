"""Valida el panel de IMPLEMENTOS en el cuerpo interactivo (GIM/Casa/CrossFit).
Carga jugar.html real, abre 'Casa', marca Pecho + Biceps y comprueba que
aparezcan chips de equipo filtrable. Captura screenshot para revision visual.
Proxy con bypass de localhost (el sysproxy de Walmart bloquea 127.0.0.1).
"""
import http.server, socketserver, threading, os, functools, time
from playwright.sync_api import sync_playwright

PORT = 8161
ROOT = os.path.dirname(os.path.abspath(__file__)) + os.sep + ".."
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
os.makedirs(OUT, exist_ok=True)


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.abspath(ROOT))
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    httpd.log_message = lambda *a, **k: None
    httpd.handle_error = lambda *a, **k: None
    threading.Thread(target=httpd.serve_forever, daemon=True).start()


def main():
    serve()
    time.sleep(1)
    base = f"http://127.0.0.1:{PORT}"
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge",
            proxy={"server": "http://sysproxy.wal-mart.com:8080", "bypass": "127.0.0.1,localhost"})
        ctx = browser.new_context(viewport={"width": 980, "height": 900},
            device_scale_factor=1, service_workers="block")
        page = ctx.new_page()
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.goto(base + "/jugar.html", wait_until="commit", timeout=45000)
        page.wait_for_function("typeof renderBodyInteractive === 'function' && typeof TRAIN_CATS !== 'undefined'", timeout=40000)
        page.wait_for_timeout(2500)  # dejar cargar rutinas/bodymap

        # Navegar al cuerpo interactivo de 'Casa' y marcar Pecho + Biceps
        res = page.evaluate("""() => {
          if (typeof renderBodyInteractive !== 'function') return {ok:false, why:'no renderBodyInteractive'};
          showScreen('routine');
          const cat = TRAIN_CATS.find(c => c.id === 'casa');
          renderBodyInteractive(cat);
          toggleBodyGroup('pecho');
          toggleBodyGroup('biceps');
          const box = document.getElementById('body-equip');
          const chips = box ? box.querySelectorAll('button[onclick^=\\"toggleBodyEquip\\"]') : [];
          const labels = Array.from(chips).map(b => b.textContent.trim());
          const bw = box ? box.textContent.includes('Peso corporal') : false;
          const poolFull = (window.__bodyPoolFull || []).length;
          return {ok:true, nChips: chips.length, labels, bw, poolFull,
                  poolNames: (window.__bodyPoolFull||[]).map(e => e.name + ' => ' + exEquipList(e.name).map(q=>q.label).join('|')),
                  panelHtmlLen: box ? box.innerHTML.length : 0};
        }""")
        print("RESULT:", res)
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(OUT, "body_equip.png"), full_page=True)
        print("[OK] shot -> body_equip.png")
        elc = page.query_selector('#body-equip')
        if elc:
            elc.screenshot(path=os.path.join(OUT, 'body_equip_casa.png'))
            print('[OK] shot -> body_equip_casa.png')

        # Probar el filtro: quitar 'Mancuernas' si existe y ver que baja el pool
        res2 = page.evaluate("""() => {
          if (typeof toggleBodyEquip !== 'function') return {ok:false};
          const before = (window.__bodyPoolFull||[]).filter(e => exAllowedByEquip(e.name)).length;
          // apaga TODO menos peso corporal
          (window.__bodyPoolFull||[]).forEach(e => exEquipList(e.name).forEach(q => {
            if (q.label !== 'Peso corporal') bodyEquipOff[q.label] = true;
          }));
          if (bodyMode==='auto') buildAuto(); else buildManual();
          const afterOnlyBw = (window.__bodyPoolFull||[]).filter(e => exAllowedByEquip(e.name)).length;
          return {ok:true, before, afterOnlyBw};
        }""")
        print("FILTER TEST:", res2)
        page.wait_for_timeout(300)
        page.screenshot(path=os.path.join(OUT, "body_equip_onlybw.png"), full_page=True)
        print("[OK] shot -> body_equip_onlybw.png")

        # GIMNASIO: mas variedad de implementos. Captura SOLO el panel.
        res3 = page.evaluate("""() => {
          showScreen('routine');
          const cat = TRAIN_CATS.find(c => c.id === 'gimnasio');
          renderBodyInteractive(cat);
          toggleBodyGroup('pecho');
          toggleBodyGroup('biceps');
          const box = document.getElementById('body-equip');
          const chips = box ? box.querySelectorAll('button[onclick^=\"toggleBodyEquip\"]') : [];
          return {labels: Array.from(chips).map(b => b.textContent.trim()), poolFull:(window.__bodyPoolFull||[]).length};
        }""")
        print("GIM:", res3)
        page.wait_for_timeout(400)
        el = page.query_selector('#body-equip')
        if el:
            el.screenshot(path=os.path.join(OUT, 'body_equip_gim.png'))
            print('[OK] shot -> body_equip_gim.png')

        if errs:
            print("JS ERRORS:", errs)
        browser.close()


if __name__ == "__main__":
    main()
