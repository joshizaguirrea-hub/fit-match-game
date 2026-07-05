"""Sonda de factibilidad: traer datos reales de ejercicios 'plank' desde
fuentes abiertas usando el navegador (red de la maquina via sysproxy)."""
import json
from playwright.sync_api import sync_playwright

TARGETS = [
    ("wger search plank", "https://wger.de/api/v2/exercise/search/?term=plank&language=english&format=json"),
    ("wger exerciseimage sample", "https://wger.de/api/v2/exerciseimage/?format=json&limit=6"),
]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", proxy={"server": "http://sysproxy.wal-mart.com:8080", "bypass": "127.0.0.1,localhost"})
        page = browser.new_context().new_page()
        for label, url in TARGETS:
            print("\n===== " + label + " =====")
            print("URL:", url)
            try:
                resp = page.goto(url, wait_until="load", timeout=30000)
                print("HTTP:", resp.status if resp else "?")
                body = page.evaluate("() => document.body ? document.body.innerText : ''")
                print(body[:1500])
            except Exception as e:
                print("ERROR:", repr(e)[:300])
        browser.close()


if __name__ == "__main__":
    main()
