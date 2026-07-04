"""Consulta la API de Wikimedia Commons (via navegador) para cada postura de
yoga del set de fallback, y trae candidatos (titulo + thumburl + licencia).
Yo (Horus) reviso la salida y elijo la mejor para cada una.
Fuente legal: Wikimedia Commons (CC / dominio publico)."""
import json, time, sys
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass
from playwright.sync_api import sync_playwright

# clave_en_app  ->  query de busqueda en Commons
POSES = {
    "guerrero ii":        "Virabhadrasana II warrior pose",
    "guerrero iii":       "Virabhadrasana III warrior pose",
    "arbol":              "Vrksasana tree pose yoga",
    "perro boca abajo":   "Adho Mukha Svanasana downward dog",
    "saludo al sol":      "Surya Namaskar sun salutation",
    "savasana":           "Savasana corpse pose yoga",
    "silla utkatasana":   "Utkatasana chair pose yoga",
    "boat navasana":      "Navasana boat pose yoga",
    "dancer natarajasana":"Natarajasana lord of the dance pose",
    "eagle garuda":       "Garudasana eagle pose yoga",
    "half moon":          "Ardha Chandrasana half moon pose",
    "king pigeon":        "Eka Pada Rajakapotasana pigeon",
    "pigeon":             "Kapotasana pigeon pose yoga",
    "peacock mayurasana": "Mayurasana peacock pose",
    "wheel":              "Urdhva Dhanurasana wheel pose",
    "eight angle":        "Astavakrasana eight angle pose",
    "piernas arriba pared":"Viparita Karani legs up wall",
    "headstand":          "Sirsasana headstand yoga",
    "forearm stand":      "Pincha Mayurasana forearm stand",
    "flamingo":           "standing yoga pose one leg balance",
    "forward fold":       "Uttanasana standing forward bend",
    "cobra":              "Bhujangasana cobra pose yoga",
    "esfinge":            "Sphinx pose yoga Salamba Bhujangasana",
    "warrior flow":       "Virabhadrasana I warrior pose",
    "inversion":          "Sarvangasana shoulderstand yoga",
}


def q(pg, query):
    url = ("https://commons.wikimedia.org/w/api.php?action=query&format=json"
           "&generator=search&gsrnamespace=6&gsrlimit=4&gsrsearch=" +
           query.replace(" ", "%20") +
           "&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=480")
    r = pg.goto(url, timeout=20000)
    data = json.loads(pg.evaluate("() => document.body.innerText"))
    out = []
    pages = (data.get("query") or {}).get("pages") or {}
    for pdata in pages.values():
        ii = (pdata.get("imageinfo") or [{}])[0]
        thumb = ii.get("thumburl")
        title = pdata.get("title", "")
        lic = ((ii.get("extmetadata") or {}).get("LicenseShortName") or {}).get("value", "?")
        ext = title.lower().rsplit(".", 1)[-1]
        if thumb and ext in ("jpg", "jpeg", "png"):
            out.append((title, thumb, lic))
    return out


with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    pg = b.new_page()
    result = {}
    for key, query in POSES.items():
        cands = []
        for attempt in range(3):
            try:
                cands = q(pg, query)
                if cands:
                    break
            except Exception as e:
                print(f"[retry {attempt}] {key}: {e}")
            time.sleep(1.2)
        result[key] = cands
        print(f"\n=== {key}  ({len(cands)} cands) ===")
        for t, u, lic in cands:
            print(f"   [{lic}] {t}")
        # guardado incremental
        json.dump(result, open("tests/_wiki_candidates.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        time.sleep(0.6)
    b.close()
print("\n[OK] candidatos en tests/_wiki_candidates.json")
