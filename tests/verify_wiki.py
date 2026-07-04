"""Verifica cada URL Wikimedia SECUENCIALMENTE (evita rate-limit) via goto,
comprobando status HTTP 200. Reintenta las que fallen."""
import re, time
from playwright.sync_api import sync_playwright

js = open("fm-exercise-photos.js", encoding="utf-8").read()
urls = list(dict.fromkeys(re.findall(r"'(https://upload\.wikimedia\.org/[^']+)'", js)))
print(f"URLs Wikimedia: {len(urls)}")

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    pg = b.new_page()
    bad = []
    for u in urls:
        code = None
        for attempt in range(3):
            try:
                r = pg.goto(u, timeout=20000)
                code = r.status if r else None
                if code == 200:
                    break
            except Exception as e:
                code = f"ERR {type(e).__name__}"
            time.sleep(2)
        tag = "OK " if code == 200 else "BAD"
        if code != 200:
            bad.append((u, code))
        short = u.rsplit("/", 1)[-1][:55]
        print(f"  [{tag}] {code} {short}")
        time.sleep(1.0)
    b.close()

print("\nRESULT:", "TODO OK" if not bad else f"{len(bad)} FALLARON")
for u, c in bad:
    print("  ", c, u)
