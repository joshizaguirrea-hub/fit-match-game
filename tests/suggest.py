"""Sugerencias: de los ejercicios SIN imagen, cuales tienen palabra clave que
probablemente SI existe en free-exercise-db (candidatos a mapear)."""
import sys, json
sys.path.insert(0, "tests")
import audit_images as a

M = a.load_map()
names = sorted(set(a.extract_names()))
un = [n for n in names if not a.folder_for(n, M)]

# palabras que suelen tener imagen de FUERZA en la db
keys = ['molino', 'windmill', 'step', 'cajon', 'escalon', 'banco', 'subida',
        'curl', 'remo', 'press', 'fondo', 'dip', 'swing', 'clean', 'snatch',
        'wall sit', 'jinete', 'farmer', 'granjero', 'carga', 'peso muerto',
        'hip thrust', 'puente', 'superman', 'crunch', 'abdominal', 'plancha',
        'sentadilla', 'zancada', 'desplante', 'elevacion', 'pull', 'jalon',
        'dominada', 'flexion', 'burpee', 'salto', 'thruster', 'kettlebell',
        'mancuerna', 'barra', 'good morning', 'face pull', 'encogimiento']

from collections import defaultdict
buckets = defaultdict(list)
for n in un:
    nn = a.norm(n)
    for k in keys:
        if k in nn:
            buckets[k].append(n)
            break

for k in sorted(buckets, key=lambda x: -len(buckets[x])):
    print(f"\n[{k}] {len(buckets[k])} sin imagen:")
    for n in buckets[k][:8]:
        print("   -", n)

# los que no cayeron en ningun bucket (probablemente yoga/pilates/respiracion)
otros = [n for n in un if not any(k in a.norm(n) for k in keys)]
print(f"\n=== SIN palabra de fuerza (yoga/pilates/respiracion/movilidad): {len(otros)} ===")
