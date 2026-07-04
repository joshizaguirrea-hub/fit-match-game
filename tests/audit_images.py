"""Auditoria de imagenes de ejercicios de Fit Match.
Extrae todos los nombres de ejercicio de las rutinas y simula el emparejador
de fm-exercise-photos.js (folderFor) para detectar:
  - Ejercicios SIN imagen (fallback a icono).
  - COLISIONES: ejercicios distintos que caen en la MISMA carpeta/imagen.
Lee el MAP directamente de fm-exercise-photos.js para no desincronizarse.
"""
import re, json, unicodedata, collections, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def norm(s):
    s = (s or "").lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9\s-]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def load_map():
    """Parsea el arreglo MAP de fm-exercise-photos.js."""
    txt = open(os.path.join(ROOT, "fm-exercise-photos.js"), encoding="utf-8").read()
    # Cada entrada: [['kw1','kw2'], 'Folder']
    entries = []
    for m in re.finditer(r"\[\s*\[([^\]]*)\]\s*,\s*'([^']+)'\s*\]", txt):
        kws = re.findall(r"'([^']+)'", m.group(1))
        folder = m.group(2)
        entries.append((kws, folder))
    return entries


def folder_for(name, MAP):
    n = norm(name)
    for kws, folder in MAP:
        for kw in kws:
            if kw in n:
                return folder
    return ""


def extract_names():
    names = []
    for fn in ("fm-routines.js", "fm-specialized-routines.js"):
        p = os.path.join(ROOT, fn)
        if not os.path.exists(p):
            continue
        txt = open(p, encoding="utf-8").read()
        for m in re.finditer(r'name:\s*"([^"]+)"\s*,\s*reps', txt):
            names.append(m.group(1))
    return names


def main():
    MAP = load_map()
    names = extract_names()
    uniq = sorted(set(names))
    print(f"Rutinas: nombres de ejercicio totales={len(names)}, unicos={len(uniq)}")
    print(f"MAP: {len(MAP)} movimientos base\n")

    by_folder = collections.defaultdict(list)
    unmatched = []
    for nm in uniq:
        f = folder_for(nm, MAP)
        if f:
            by_folder[f].append(nm)
        else:
            unmatched.append(nm)

    print(f"=== SIN IMAGEN (fallback icono): {len(unmatched)} ===")
    for nm in unmatched:
        print("  -", nm)

    print(f"\n=== COLISIONES (misma imagen para >1 ejercicio distinto) ===")
    collisions = {f: ns for f, ns in by_folder.items() if len(ns) > 1}
    for f in sorted(collisions, key=lambda k: -len(collisions[k])):
        ns = collisions[f]
        print(f"\n  [{f}] <- {len(ns)} ejercicios:")
        for nm in ns:
            print("      -", nm)


if __name__ == "__main__":
    main()
