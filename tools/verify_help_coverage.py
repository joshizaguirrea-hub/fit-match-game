#!/usr/bin/env python3
"""Verifica la cobertura del resolvedor de ayuda: carga jugar.html en Edge,
clasifica los 856 ejercicios (base/categoria/generico) y muestra un spot-check
de calidad sobre ejercicios variados.
Uso: uv run --with playwright python tools/_verify_help_coverage.py"""
import os, re, io, json, threading, functools, http.server, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8151
BASE = f"http://127.0.0.1:{PORT}"

SAMPLES = [
    "Press de banca con barra", "Curl de biceps con botellas", "Sentadillas bulgaras",
    "Elevacion de talones (gemelos)", "Abdominales bicicleta rapidos",
    "Plancha lateral (por lado, segundos)", "Dominadas asistidas (banda)",
    "Postura del guerrero", "Hundred con piernas bajas", "Apnea costal (4 segundos)",
    "Perro boca abajo", "Fondos en silla", "Peso muerto rumano", "Muscle up (intentos)",
    "Swing con mochila (kettlebell)", "Enfriamiento caminando", "Mountain climbers",
    "Flexiones diamante", "Remo con barra", "Jumping jacks", "Sentadilla pistol (asistida)",
    "Giros rusos estables de lado a lado", "Zancadas hacia atras con cruce (Curtsy)",
]

def all_names():
    ex_re = re.compile(r'\{\s*name\s*:\s*"([^"]+)"')
    names = set()
    for rf in ["fm-routines.js", "fm-specialized-routines.js"]:
        with io.open(os.path.join(ROOT, rf), encoding="utf-8") as f:
            names.update(ex_re.findall(f.read()))
    return sorted(names)

def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    httpd.log_message = lambda *a, **k: None
    httpd.handle_error = lambda *a, **k: None
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd

def run():
    os.chdir(ROOT)
    names = all_names()
    serve(); time.sleep(0.6)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge")
        ctx = browser.new_context(service_workers="block")
        page = ctx.new_page()
        page.goto(f"{BASE}/jugar.html", wait_until="domcontentloaded", timeout=25000)
        page.wait_for_function("typeof window.resolveExerciseHelp === 'function'", timeout=15000)
        page.wait_for_timeout(400)
        res = page.evaluate(
            """(names) => {
                const gen = (window.FM_EX_HELP_GENERIC||{}).desc;
                const catDescs = Object.values(window.FM_EX_HELP_CATEGORY||{}).map(c=>c.desc);
                const out = {base:0, category:0, generic:0, genericNames:[]};
                for (const n of names) {
                    const r = window.resolveExerciseHelp(n);
                    if (!r || r.desc === gen) { out.generic++; out.genericNames.push(n); }
                    else if (catDescs.indexOf(r.desc) !== -1) out.category++;
                    else out.base++;
                }
                return out;
            }""", names)
        samples = page.evaluate(
            """(list) => list.map(n => {
                const r = window.resolveExerciseHelp(n) || {};
                return {n, m: r.muscles, d: (r.desc||'').slice(0, 90)};
            })""", SAMPLES)
        browser.close()

    total = len(names)
    print(f"TOTAL ejercicios: {total}")
    print(f"  base/exacto (especifico): {res['base']}  ({100*res['base']//total}%)")
    print(f"  categoria (yoga/pilates): {res['category']}  ({100*res['category']//total}%)")
    print(f"  GENERICO:                 {res['generic']}  ({100*res['generic']//total}%)")
    print("\n=== SPOT-CHECK DE CALIDAD ===")
    for s in samples:
        print(f"* {s['n']}\n    [{s['m']}] {s['d']}...")

if __name__ == "__main__":
    run()
