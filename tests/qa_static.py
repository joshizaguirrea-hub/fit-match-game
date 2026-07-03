#!/usr/bin/env python3
"""
QA estatico de Fit Match.
1) Parsea todos los .js del proyecto y los <script> inline de los .html
   con esprima -> caza errores de SINTAXIS.
2) Audita handlers inline (onclick/onchange/oninput/onkeypress/onsubmit)
   y verifica que las funciones "sueltas" que invocan existan de verdad
   -> caza botones que llaman funciones inexistentes (bugs silenciosos).

Uso:  uv run --with esprima python tests/qa_static.py
Salida: lista de problemas + exit code != 0 si hay errores de sintaxis
        o handlers rotos.
"""
import os, re, sys, glob

try:
    import esprima
except ImportError:
    print("Falta esprima. Corre con: uv run --with esprima python tests/qa_static.py")
    sys.exit(2)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Archivos HTML a auditar (con scripts inline y handlers)
HTML_FILES = ["index.html", "jugar.html", "cartas.html", "privacy.html"]

# Palabras que NO son funciones de usuario (keywords + globals del navegador).
WHITELIST = set("""
if for while return typeof new delete void in of do else switch case break
continue function var let const try catch finally throw instanceof yield await
async this true false null undefined
alert confirm prompt parseInt parseFloat isNaN Number String Boolean Array Object
JSON Math Date RegExp Promise Set Map Symbol console window document navigator
location localStorage sessionStorage setTimeout setInterval clearTimeout clearInterval
encodeURIComponent decodeURIComponent fetch Notification Audio Image AudioContext
requestAnimationFrame cancelAnimationFrame getComputedStyle
""".split())

SYNTAX_ERRORS = []
BROKEN_HANDLERS = []


def strip_inline_scripts(html):
    """Devuelve lista de bloques JS inline (sin src)."""
    blocks = []
    for m in re.finditer(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S | re.I):
        code = m.group(1).strip()
        if code:
            blocks.append(code)
    return blocks


def _modernize(code):
    """esprima no soporta ES2020 (optional chaining / nullish). Los neutralizamos
    SOLO para el chequeo de sintaxis (no tocamos archivos) y asi evitamos falsos
    positivos por features validas en el navegador."""
    code = code.replace("?.[", "[").replace("?.(", "(").replace("?.", ".")
    code = code.replace("??=", "=").replace("??", "||")
    return code


def parse_js(name, code):
    try:
        esprima.parseScript(_modernize(code), {"tolerant": True})
    except Exception as e:
        SYNTAX_ERRORS.append(f"{name}: {e}")


def collect_defined_names(all_code):
    """Nombres de funciones/vars definidos en TODO el codigo del proyecto."""
    names = set()
    patterns = [
        r"function\s+([A-Za-z_$][\w$]*)\s*\(",
        r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=",
        r"([A-Za-z_$][\w$]*)\s*=\s*function",
        r"([A-Za-z_$][\w$]*)\s*=\s*async\s*function",
        r"([A-Za-z_$][\w$]*)\s*=\s*\(",          # arrow: name = (...) =>
        r"([A-Za-z_$][\w$]*)\s*:\s*function",     # obj method literal
        r"window\.([A-Za-z_$][\w$]*)\s*=",
    ]
    for pat in patterns:
        for m in re.finditer(pat, all_code):
            names.add(m.group(1))
    return names


def audit_handlers(fname, html, defined):
    handlers = re.findall(
        r'\bon(?:click|change|input|keypress|submit|keydown|mouseover)\s*=\s*"([^"]*)"',
        html, re.I)
    handlers += re.findall(
        r"\bon(?:click|change|input|keypress|submit|keydown|mouseover)\s*=\s*'([^']*)'",
        html, re.I)
    for h in handlers:
        # llamadas a funciones "sueltas": NAME( no precedidas por . o palabra
        for m in re.finditer(r"(?<![\w.$])([A-Za-z_$][\w$]*)\s*\(", h):
            fn = m.group(1)
            if fn in WHITELIST or fn in defined:
                continue
            BROKEN_HANDLERS.append(f"{fname}: on...=\"{h.strip()[:70]}\" -> '{fn}' no definida")


def main():
    os.chdir(ROOT)
    all_code_parts = []

    # 1) JS files
    for js in sorted(glob.glob("*.js")):
        if js.startswith("test") or js.startswith("_"):
            continue
        code = open(js, encoding="utf-8").read()
        all_code_parts.append(code)
        parse_js(js, code)

    # 2) HTML inline scripts
    html_cache = {}
    for hf in HTML_FILES:
        if not os.path.exists(hf):
            continue
        html = open(hf, encoding="utf-8").read()
        html_cache[hf] = html
        for i, blk in enumerate(strip_inline_scripts(html)):
            all_code_parts.append(blk)
            parse_js(f"{hf} [inline #{i+1}]", blk)

    # 3) Handler audit
    defined = collect_defined_names("\n".join(all_code_parts))
    for hf, html in html_cache.items():
        audit_handlers(hf, html, defined)

    # ---- Reporte ----
    print("=" * 60)
    print("QA ESTATICO FIT MATCH")
    print("=" * 60)
    print(f"JS files + inline scripts parseados. Nombres definidos: {len(defined)}")

    if SYNTAX_ERRORS:
        print(f"\n[X] ERRORES DE SINTAXIS ({len(SYNTAX_ERRORS)}):")
        for e in SYNTAX_ERRORS:
            print("   -", e)
    else:
        print("\n[OK] Sin errores de sintaxis.")

    # deduplicar handlers rotos
    uniq = sorted(set(BROKEN_HANDLERS))
    if uniq:
        print(f"\n[!] HANDLERS SOSPECHOSOS ({len(uniq)}):")
        for e in uniq:
            print("   -", e)
    else:
        print("[OK] Todos los handlers inline apuntan a funciones definidas.")

    fail = bool(SYNTAX_ERRORS) or bool(uniq)
    print("\n" + ("RESULTADO: FALLO" if fail else "RESULTADO: TODO OK"))
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
