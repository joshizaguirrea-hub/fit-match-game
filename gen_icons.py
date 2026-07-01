"""Genera los iconos PWA de Fit Match (degradado morado->cyan + mancuerna)."""
from PIL import Image, ImageDraw

C1 = (124, 92, 255)   # morado #7c5cff
C2 = (34, 211, 238)   # cyan   #22d3ee


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(size):
    img = Image.new("RGB", (size, size))
    px = img.load()
    m = 2 * (size - 1)
    for y in range(size):
        for x in range(size):
            px[x, y] = lerp(C1, C2, (x + y) / m)
    return img


def rounded_mask(size, radius):
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m


def draw_dumbbell(img, scale=1.0):
    """Dibuja una mancuerna blanca centrada. scale reduce el tamano (para maskable)."""
    S = img.size[0]
    d = ImageDraw.Draw(img)
    W = (255, 255, 255)
    cx, cy = S / 2, S / 2
    # medidas relativas (a partir de un ancho base) * scale
    hw = 0.34 * S * scale   # media longitud total
    bar_h = 0.05 * S * scale
    # barra central
    d.rounded_rectangle([cx - hw * 0.62, cy - bar_h, cx + hw * 0.62, cy + bar_h],
                        radius=bar_h, fill=W)
    plate_r = 0.055 * S * scale
    for sgn in (-1, 1):
        # placa interior
        ix = cx + sgn * hw * 0.62
        d.rounded_rectangle([ix - 0.06 * S * scale if sgn < 0 else ix,
                             cy - 0.15 * S * scale,
                             ix if sgn < 0 else ix + 0.06 * S * scale,
                             cy + 0.15 * S * scale], radius=plate_r, fill=W)
        # placa exterior (mas grande)
        ox = cx + sgn * hw
        d.rounded_rectangle([ox - 0.07 * S * scale if sgn < 0 else ox,
                             cy - 0.22 * S * scale,
                             ox if sgn < 0 else ox + 0.07 * S * scale,
                             cy + 0.22 * S * scale], radius=plate_r, fill=W)


def make(size, radius_frac, dumbbell_scale, maskable=False):
    g = gradient(size)
    draw_dumbbell(g, dumbbell_scale)
    if maskable:
        return g  # full-bleed, sin esquinas redondeadas
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(g, (0, 0), rounded_mask(size, int(size * radius_frac)))
    return out


# Iconos "any" con esquinas redondeadas
make(192, 0.22, 1.0).save("icon-192.png")
make(512, 0.22, 1.0).save("icon-512.png")
# Maskable (full-bleed, mancuerna mas chica en zona segura)
make(512, 0, 0.72, maskable=True).save("icon-maskable-512.png")
# Apple touch (sin transparencia, cuadrado; iOS redondea solo)
make(180, 0, 1.0, maskable=True).save("apple-touch-icon.png")
# Favicon
make(32, 0.22, 1.0).save("favicon-32.png")
print("Iconos generados OK")
