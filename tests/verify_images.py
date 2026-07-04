"""Verificacion final: replica resolveFolder (exact + fallback por disciplina)
y confirma que NINGUN ejercicio queda sin imagen, con variedad."""
import sys, json, collections
sys.path.insert(0, "tests")
import audit_images as a

M = a.load_map()

POOLS = {
    'yoga':    ['Childs_Pose', 'One_Half_Locust', 'The_Straddle', 'Dancers_Stretch', 'Pyramid', 'Upper_Back-Leg_Grab', 'Spinal_Stretch', 'Runners_Stretch'],
    'pilates': ['Stomach_Vacuum', 'Hug_Knees_To_Chest', 'Flat_Bench_Lying_Leg_Raise', 'Scissor_Kick', 'Flutter_Kicks', 'Air_Bike', 'Russian_Twist', 'Pelvic_Tilt_Into_Bridge'],
    'relax':   ['Childs_Pose', 'Seated_Floor_Hamstring_Stretch', 'Chair_Lower_Back_Stretch', 'Overhead_Stretch', 'Spinal_Stretch', 'Hug_Knees_To_Chest'],
    'balance': ['Front_Leg_Raises', 'Side_Leg_Raises', 'Rear_Leg_Raises', 'Standing_Hip_Circles'],
    'dance':   ['Star_Jump', 'Trail_Running_Walking', 'Rope_Jumping', 'Bodyweight_Walking_Lunge'],
    'def':     ['Torso_Rotation', 'Standing_Lateral_Stretch', 'Spinal_Stretch', 'Shoulder_Circles', 'Overhead_Stretch'],
}
DISC = [
    ('pilates', ['hundred', 'teaser', 'roll up', 'roll over', 'rolling', 'saw', 'corkscrew', 'criss cross', 'single leg', 'double leg', 'double straight', 'scissors', 'side kick', 'side lying', 'boomerang', 'rocking boat', 'mat completo', 'long stretch', 'pilates', 'footwork', 'knee stretches', 'control balance', 'core power', 'standing series', 'wall roll', 'spine stretch', 'elephant']),
    ('relax',   ['savasana', 'relajacion', 'descanso', 'enfriamiento', 'calentamiento', 'final stretch', 'integracion funcional', 'visualizacion', 'consciente', 'recuperacion', 'recuperativa']),
    ('yoga',    ['yoga', 'saludo al sol', 'guerrero', 'warrior', 'arbol', 'tree', 'perro boca abajo', 'downward', 'pigeon', 'paloma', 'navasana', 'natarajasana', 'garuda', 'eagle', 'mayurasana', 'peacock', 'half moon', 'media luna', 'wheel', 'urdhva', 'dhanurasana', ' pose', 'asana', 'flamingo', 'inversion', 'flow', 'piernas arriba la pared', 'eight-angle', 'king pigeon', 'dancer']),
    ('dance',   ['coreografia', 'baile', 'pasos', 'paso lateral', 'paso al frente', 'toques laterales']),
    ('balance', ['pararse en un pie', 'balance', 'alineacion', 'standing alignment', 'equilibrio', 'postural', 'apoyo']),
]


def discipline_for(n):
    for disc, kws in DISC:
        for kw in kws:
            if kw in n:
                return disc
    return 'def'


def hash_pick(name, arr):
    h = 0
    for ch in name:
        h = ((h << 5) - h + ord(ch)) & 0xFFFFFFFF
    if h >= 0x80000000:
        h -= 0x100000000
    return arr[abs(h) % len(arr)]


def resolve(name):
    f = a.folder_for(name, M)
    if f:
        return f, True
    n = a.norm(name)
    return hash_pick(n, POOLS[discipline_for(n)]), False


def main():
    have = set()
    db = json.load(open("tests/_exdb.json", encoding="utf-8"))
    have = set(x['images'][0].split('/')[0] for x in db)

    names = sorted(set(a.extract_names()))
    exact = fb = 0
    no_image = []
    disc_count = collections.Counter()
    fb_folder = collections.Counter()
    bad_folder = []
    for nm in names:
        folder, is_exact = resolve(nm)
        if folder not in have:
            bad_folder.append((nm, folder))
        if is_exact:
            exact += 1
        else:
            fb += 1
            disc_count[discipline_for(a.norm(nm))] += 1
            fb_folder[folder] += 1
        if not folder:
            no_image.append(nm)

    print(f"TOTAL ejercicios unicos: {len(names)}")
    print(f"  match EXACTO (palabra clave): {exact}")
    print(f"  fallback tematico:           {fb}")
    print(f"  SIN IMAGEN (icono):          {len(no_image)}")
    print(f"  carpetas inexistentes:       {len(bad_folder)}")
    if bad_folder:
        for nm, f in bad_folder[:20]:
            print("    !", nm, "->", f)
    print(f"\nFallback por disciplina: {dict(disc_count)}")
    print(f"\nVariedad de imagenes usadas en fallback: {len(fb_folder)} carpetas distintas")
    # muestra: 3 poses de yoga distintas
    print("\nMuestra (yoga) - variedad:")
    for nm in ['Guerrero II', 'Guerrero III', 'Postura del arbol balance', 'Perro boca abajo', 'Saludo al sol A', 'Wheel (Urdhva Dhanurasana)']:
        print(f"   {nm:35s} -> {resolve(nm)[0]}")
    print("\nMuestra (pilates) - variedad:")
    for nm in ['Hundred', 'Teaser', 'Roll up', 'Saw con rotacion', 'Single leg circles', 'Corkscrew']:
        print(f"   {nm:35s} -> {resolve(nm)[0]}")


if __name__ == "__main__":
    main()
