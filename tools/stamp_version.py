#!/usr/bin/env python3
"""
stamp_version.py - Fuente unica de verdad para el cache-busting.

Lee el archivo VERSION (un numero) y estampa `?v=<VERSION>` en TODOS los
<script src> y <link href> locales (.js/.css) de los HTML, y ajusta el
CACHE_VERSION del Service Worker a 'fitmatch-v<VERSION>'.

- Ignora recursos externos (CDN: http(s):// o //).
- Es idempotente: correrlo dos veces con el mismo VERSION no cambia nada.
- Sin dependencias (solo la stdlib). No requiere Node.

Uso:
    python tools/stamp_version.py            # estampa con el VERSION actual
    python tools/stamp_version.py --bump     # incrementa VERSION y estampa
    python tools/stamp_version.py --check    # solo verifica, no escribe (CI)

Flujo recomendado antes de desplegar: `python tools/stamp_version.py --bump`
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION_FILE = os.path.join(ROOT, "VERSION")
SW_FILE = os.path.join(ROOT, "sw.js")

# <script src="..."> o <link href="..."> a un .js/.css LOCAL (no http/https//)
ASSET_RE = re.compile(
    r'((?:src|href)=")((?!https?:|//)[^"?]+\.(?:js|css))(?:\?v=[^"]*)?(")'
)
SW_RE = re.compile(r"(const CACHE_VERSION = 'fitmatch-v)\d+(';)")


def read_version():
    with open(VERSION_FILE, encoding="utf-8") as f:
        return f.read().strip()


def html_files():
    for name in sorted(os.listdir(ROOT)):
        if name.endswith(".html"):
            yield os.path.join(ROOT, name)


def stamp_text(text, version):
    return ASSET_RE.sub(rf'\g<1>\g<2>?v={version}\g<3>', text)


def process(version, check=False):
    changed = []

    def apply(path, new_text, old_text):
        if new_text != old_text:
            changed.append(os.path.relpath(path, ROOT))
            if not check:
                with open(path, "w", encoding="utf-8", newline="") as f:
                    f.write(new_text)

    for path in html_files():
        with open(path, encoding="utf-8", newline="") as f:
            old = f.read()
        apply(path, stamp_text(old, version), old)

    if os.path.exists(SW_FILE):
        with open(SW_FILE, encoding="utf-8", newline="") as f:
            old = f.read()
        apply(SW_FILE, SW_RE.sub(rf"\g<1>{version}\g<2>", old), old)

    return changed


def main():
    args = set(sys.argv[1:])
    version = read_version()

    if "--bump" in args:
        version = str(int(version) + 1)
        with open(VERSION_FILE, "w", encoding="utf-8", newline="") as f:
            f.write(version + "\n")

    check = "--check" in args
    changed = process(version, check=check)

    print(f"VERSION = {version}")
    if check:
        if changed:
            print("[X] Estos archivos NO estan estampados con el VERSION actual:")
            for c in changed:
                print("     -", c)
            print("\nCorre: python tools/stamp_version.py")
            sys.exit(1)
        print("[OK] Todo estampado y consistente.")
        return

    if changed:
        print(f"[OK] Estampados {len(changed)} archivo(s):")
        for c in changed:
            print("     -", c)
    else:
        print("[OK] Nada que cambiar (ya estaba consistente).")


if __name__ == "__main__":
    main()
