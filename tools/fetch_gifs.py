#!/usr/bin/env python3
"""
fetch_gifs.py - Descarga los GIFs de ejercicios a assets/gif/ (una sola vez).

Correr en TU EQUIPO PERSONAL (red libre). Cascade debe COMPLETAR el mapeo
GIF_SOURCES con las URLs reales de la fuente elegida (ExerciseDB / wger / propios).

Uso:
    python tools/fetch_gifs.py

Requisitos:
    pip install requests            # (o usa urllib de la stdlib; abajo esta con urllib)

IMPORTANTE (licencia): antes de agregar una URL aqui, confirma que su licencia
permite uso comercial (Google Play) y registra la atribucion en CREDITS-GIFS.md.
"""

import os
import sys
import urllib.request

# Carpeta destino (relativa a la raiz del repo)
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "gif")

# ---------------------------------------------------------------------------
# MAPEO: nombre de archivo destino  ->  URL de origen del GIF.
# Cascade: rellena las URLs segun la fuente elegida.
#
#   - ExerciseDB (RapidAPI): usa el campo `gifUrl` de la respuesta de la API.
#       Endpoint ejemplo: GET https://exercisedb.p.rapidapi.com/exercises/name/plank
#       Headers: {"X-RapidAPI-Key": "TU_KEY", "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"}
#       (mejor: primero consulta la API, guarda el JSON, y de ahi saca los gifUrl).
#   - wger: /api/v2/exerciseimage/ (imagenes con su licencia CC-BY-SA).
#   - Propios (Mixamo/Blender): pon rutas locales o URLs propias.
# ---------------------------------------------------------------------------
GIF_SOURCES = {
    "plancha-antebrazos.gif": "",     # TODO: URL real
    "plancha-alta.gif": "",           # TODO
    "plancha-lateral.gif": "",        # TODO
    "plancha-rodillas.gif": "",       # TODO
    "plancha-shoulder-taps.gif": "",  # TODO
    "plank-jacks.gif": "",            # TODO
    "plancha-comandos.gif": "",       # TODO
    "plancha-body-saw.gif": "",       # TODO
    "plancha-escapular.gif": "",      # TODO
    "plancha-pike.gif": "",           # TODO
}


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 FitMatch-fetch"})
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    pending = [k for k, v in GIF_SOURCES.items() if not v]
    if pending:
        print("[AVISO] Estas entradas no tienen URL todavia (completar):")
        for p in pending:
            print("   -", p)
        print()

    ok, fail = 0, 0
    for fname, url in GIF_SOURCES.items():
        if not url:
            continue
        dest = os.path.join(OUT_DIR, fname)
        try:
            print("Descargando", fname, "...")
            download(url, dest)
            print("   OK ->", dest)
            ok += 1
        except Exception as e:
            print("   ERROR:", repr(e)[:200])
            fail += 1

    print(f"\nListo. Descargados: {ok} | Errores: {fail} | Pendientes de URL: {len(pending)}")
    print("Recuerda: registra fuente+licencia de cada GIF en CREDITS-GIFS.md")
    print("Y sube CACHE_VERSION en sw.js para invalidar la cache de la PWA.")
    if fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
