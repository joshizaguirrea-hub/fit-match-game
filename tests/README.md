# Tests de Fit Match

Suite de QA automatizada. No requiere Node ni conexión a internet
(usa el Edge del sistema para el smoke test).

## 1. QA estático (rápido, sin navegador)

Parsea TODO el JavaScript (módulos + scripts inline de los HTML) y audita
los handlers `onclick`/`onchange`/etc. contra las funciones realmente definidas.

Caza: errores de sintaxis y botones que llaman funciones inexistentes.

```bash
uv run --with esprima python tests/qa_static.py
```

## 2. Smoke test E2E (navegador real)

Levanta un servidor estático local y carga las páginas en **Microsoft Edge**
(vía Playwright, sin descargar Chromium). Ejercita los flujos clave
(Ajustes → temas claro/oscuro → volumen → Tienda → Clan) y falla si hay
**excepciones de JavaScript** no capturadas.

```bash
uv run --with playwright python tests/smoke_e2e.py
```

> Nota: el test bloquea el Service Worker a propósito (en test provoca un
> reload a mitad de carga que corrompe la medición; no es un bug de la app).

## Recomendado antes de cada push

```bash
uv run --with esprima python tests/qa_static.py && \
uv run --with playwright python tests/smoke_e2e.py
```

Con el índice interno de Walmart, antepón:
`--index-url https://pypi.ci.artifacts.walmart.com/artifactory/api/pypi/external-pypi/simple --allow-insecure-host pypi.ci.artifacts.walmart.com`
