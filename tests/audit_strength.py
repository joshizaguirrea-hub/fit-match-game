"""Auditoria enfocada en categorias de FUERZA: gimnasio, casa, crossfit.
Muestra cada ejercicio -> carpeta resuelta y si es match EXACTO o FALLBACK.
En estas categorias NO deberia haber fallback tematico ni matches raros."""
import sys, re, json
sys.path.insert(0, "tests")
import audit_images as a
import verify_images as v

TXT = open("fm-specialized-routines.js", encoding="utf-8").read()

# Trocear por rutina: cada objeto empieza con id:"..." ... category:"..."
# y sus exercises hasta el siguiente id: o fin.
routine_re = re.compile(r'id:\s*"([^"]+)"[^\n]*?category:\s*"([^"]+)"', re.S)
matches = list(routine_re.finditer(TXT))

TARGET = {"gimnasio", "casa", "crossfit"}
issues = []
per_cat = {c: {"exact": 0, "fallback": 0, "total": 0} for c in TARGET}

for idx, m in enumerate(matches):
    cat = m.group(2)
    if cat not in TARGET:
        continue
    start = m.end()
    end = matches[idx + 1].start() if idx + 1 < len(matches) else len(TXT)
    block = TXT[start:end]
    ex_names = re.findall(r'name:\s*"([^"]+)"\s*,\s*reps', block)
    for nm in ex_names:
        folder, is_exact = v.resolve(nm)
        per_cat[cat]["total"] += 1
        per_cat[cat]["exact" if is_exact else "fallback"] += 1
        if not is_exact:
            issues.append((cat, m.group(1), nm, folder, "FALLBACK"))

print("=== RESUMEN POR CATEGORIA (fuerza) ===")
for c in ["gimnasio", "casa", "crossfit"]:
    d = per_cat[c]
    print(f"  {c:10s}: total={d['total']:3d}  exactos={d['exact']:3d}  fallback={d['fallback']:3d}")

print(f"\n=== EJERCICIOS CON FALLBACK (revisar): {len(issues)} ===")
for cat, rid, nm, folder, why in issues:
    print(f"  [{cat}/{rid}] {nm}  ->  {folder}  ({why})")

# Mostrar TODOS los mapeos exactos para revisar visualmente que sean correctos
print("\n=== TODOS LOS MAPEOS (exactos) por categoria ===")
seen = set()
for idx, m in enumerate(matches):
    cat = m.group(2)
    if cat not in TARGET:
        continue
    start = m.end()
    end = matches[idx + 1].start() if idx + 1 < len(matches) else len(TXT)
    block = TXT[start:end]
    for nm in re.findall(r'name:\s*"([^"]+)"\s*,\s*reps', block):
        key = (cat, nm)
        if key in seen:
            continue
        seen.add(key)
        folder, is_exact = v.resolve(nm)
        tag = "" if is_exact else "  <-- FALLBACK"
        print(f"  [{cat}] {nm:52s} -> {folder}{tag}")
