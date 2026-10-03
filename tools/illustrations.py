"""
Generates the placeholder food illustrations in assets/illustrations/.

These stand in for real photographs during the client demo. Re-run with
`python3 tools/illustrations.py` after editing. Replace with real photos
by pointing js/config.js and js/menu-data.js at your own image files.
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "illustrations"

# Palette (matches css/styles.css)
BG = "#120f0b"
RICE = ["#f6ecd5", "#f1e2bf", "#ecd6a6", "#f4c56a", "#e9a94a", "#fbf3e2"]
LEAF = "#7fa356"
LEAF_DARK = "#4c6a2f"
SAFFRON = "#e0a03a"


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


# ---------------------------------------------------------------- primitives
def blob_path(cx, cy, r, rnd, irregular=0.18, n=9, sy=1.0):
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        rr = r * (1 + rnd.uniform(-irregular, irregular))
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr * sy))
    d = []
    for i in range(n):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        if i == 0:
            d.append(f"M{f(p1[0])} {f(p1[1])}")
        d.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    return "".join(d) + "Z"


def shadow(cx, cy, rx, ry, op=0.55):
    return f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}" fill="#000" opacity="{op}" filter="url(#soft)"/>'


def rice_mound(cx, cy, rx, ry, rnd, density=0.5, saffron=0.28, scale=1.0):
    """Dome of rice grains: (cx, cy) is the base centre, ry the height."""
    out = [f'<path d="M{f(cx-rx)} {f(cy)} Q{f(cx)} {f(cy-ry*2.05)} {f(cx+rx)} {f(cy)} Z" fill="url(#riceBase)"/>']
    count = int(rx * ry / 9 * density)
    for _ in range(count):
        x = rnd.uniform(-1, 1)
        top = 1 - x * x
        y = rnd.uniform(0.02, 1) * top
        gx, gy = cx + x * rx * 0.97, cy - y * ry
        col = rnd.choice(RICE[3:5]) if rnd.random() < saffron else rnd.choice(RICE[:3] + RICE[5:])
        out.append(
            f'<ellipse cx="{f(gx)}" cy="{f(gy)}" rx="{f(8.5*scale)}" ry="{f(2.8*scale)}" fill="{col}" '
            f'transform="rotate({rnd.randint(-80, 80)} {f(gx)} {f(gy)})"/>'
        )
    return "".join(out)


def steam(cx, top, h, rnd, n=3, spread=60):
    out = []
    for i in range(n):
        x = cx + (i - (n - 1) / 2) * spread + rnd.uniform(-10, 10)
        w = rnd.uniform(14, 24)
        d = f"M{f(x)} {f(top)} c{f(-w)} {f(-h*0.2)} {f(w)} {f(-h*0.35)} 0 {f(-h*0.55)} s{f(w)} {f(-h*0.3)} 0 {f(-h*0.45)}"
        out.append(f'<path d="{d}" fill="none" stroke="#f5ebd6" stroke-width="{f(rnd.uniform(5, 9))}" stroke-linecap="round" opacity="{rnd.uniform(0.12, 0.22):.2f}" filter="url(#steamBlur)"/>')
    return "".join(out)


def mint_leaf(x, y, s, rot, col=None):
    col = col or "#5f9442"
    return (
        f'<g transform="translate({f(x)} {f(y)}) rotate({rot}) scale({s:.2f})">'
        f'<path d="M0 0 C10 -14 32 -14 44 0 C32 14 10 14 0 0Z" fill="{col}"/>'
        f'<path d="M2 0 L40 0" stroke="#3e6a2a" stroke-width="1.6"/></g>'
    )


def chilli(x, y, s, rot, col="#b8321f"):
    return (
        f'<g transform="translate({f(x)} {f(y)}) rotate({rot}) scale({s:.2f})">'
        f'<path d="M0 0 C18 -8 52 -6 70 6 C52 4 20 8 0 6Z" fill="{col}"/>'
        f'<path d="M0 3 C-6 1 -10 -4 -14 -6" stroke="#4c6a2f" stroke-width="3" fill="none" stroke-linecap="round"/></g>'
    )


def star_anise(x, y, s, rot):
    petals = "".join(
        f'<path d="M0 0 C4 -6 6 -18 0 -24 C-6 -18 -4 -6 0 0Z" fill="#5a2f1a" transform="rotate({i*45})"/>'
        for i in range(8)
    )
    seeds = "".join(f'<circle cx="0" cy="-12" r="2.2" fill="#c08a4a" transform="rotate({i*45})"/>' for i in range(8))
    return f'<g transform="translate({f(x)} {f(y)}) rotate({rot}) scale({s:.2f})">{petals}{seeds}</g>'


def cardamom(x, y, s, rot):
    return (
        f'<g transform="translate({f(x)} {f(y)}) rotate({rot}) scale({s:.2f})">'
        f'<ellipse rx="11" ry="6" fill="#8fa05a"/><path d="M-9 0 L9 0" stroke="#6b7c3c" stroke-width="1.2"/></g>'
    )


def cinnamon(x, y, s, rot):
    return (
        f'<g transform="translate({f(x)} {f(y)}) rotate({rot}) scale({s:.2f})">'
        f'<rect x="-40" y="-6" width="80" height="12" rx="6" fill="#7a3f1f"/>'
        f'<rect x="-40" y="-2" width="80" height="4" fill="#5c2c14"/></g>'
    )


def peppercorns(x, y, s, rnd, n=7):
    return "".join(
        f'<circle cx="{f(x+rnd.uniform(-20,20)*s)}" cy="{f(y+rnd.uniform(-14,14)*s)}" r="{f(3.2*s)}" fill="#1e1611"/>'
        for _ in range(n)
    )


def curry_leaf(x, y, s, rot):
    return mint_leaf(x, y, s * 0.9, rot, "#3f6b2a")


def scatter_bg(w, h, rnd, keep_out, count=None):
    """Spices strewn across the table, avoiding the subject's area."""
    count = count or int(w * h / 42000)
    items = []
    tries = 0
    while len(items) < count and tries < 600:
        tries += 1
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        if any((x - kx) ** 2 / kr ** 2 + (y - ky) ** 2 / kr ** 2 < 1 for kx, ky, kr in keep_out):
            continue
        k = rnd.random()
        s = rnd.uniform(0.8, 1.3) * min(w, h) / 900
        rot = rnd.randint(0, 360)
        if k < 0.2:
            items.append(star_anise(x, y, s, rot))
        elif k < 0.4:
            items.append(cardamom(x, y, s * 1.2, rot))
        elif k < 0.55:
            items.append(chilli(x, y, s, rot))
        elif k < 0.67:
            items.append(cinnamon(x, y, s * 0.9, rot))
        elif k < 0.85:
            items.append(mint_leaf(x, y, s, rot))
        else:
            items.append(peppercorns(x, y, s, rnd))
    return f'<g opacity="0.85">{"".join(items)}</g>'


# ---------------------------------------------------------------- subjects
# Each draws at centre (cx, cy) with overall size S (roughly the subject's width).

def donne(cx, cy, S, rnd, egg=False):
    k = S / 600
    top = cy - 40 * k
    out = [shadow(cx, cy + 150 * k, 300 * k, 50 * k)]
    # leaf cup
    out.append(f'<path d="M{f(cx-300*k)} {f(top)} C{f(cx-280*k)} {f(cy+120*k)} {f(cx-160*k)} {f(cy+170*k)} {f(cx)} {f(cy+170*k)} C{f(cx+160*k)} {f(cy+170*k)} {f(cx+280*k)} {f(cy+120*k)} {f(cx+300*k)} {f(top)} Z" fill="url(#leafCup)"/>')
    for i in range(-4, 5):
        out.append(f'<path d="M{f(cx+i*30*k)} {f(cy+168*k)} Q{f(cx+i*58*k)} {f(cy+60*k)} {f(cx+i*68*k)} {f(top+4*k)}" stroke="#5d4a22" stroke-width="{f(2.2*k)}" fill="none" opacity="0.6"/>')
    # rim
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(top)}" rx="{f(300*k)}" ry="{f(52*k)}" fill="#6d5a2a"/>')
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(top+4*k)}" rx="{f(284*k)}" ry="{f(44*k)}" fill="#3d3016"/>')
    out.append(rice_mound(cx, top + 30 * k, 270 * k, 150 * k, rnd, scale=k * 1.3))
    # chicken pieces
    for dx, dy, r in [(-60, -90, 62), (75, -70, 52)]:
        out.append(f'<path d="{blob_path(cx+dx*k, top+dy*k, r*k, rnd, 0.22)}" fill="url(#meat)"/>')
        out.append(f'<path d="{blob_path(cx+(dx-14)*k, top+(dy-16)*k, r*0.35*k, rnd, 0.3)}" fill="#e6a35a" opacity="0.55"/>')
    if egg:
        out.append(f'<ellipse cx="{f(cx+10*k)}" cy="{f(top-30*k)}" rx="{f(46*k)}" ry="{f(34*k)}" fill="#fbf6ea"/>')
        out.append(f'<circle cx="{f(cx+10*k)}" cy="{f(top-30*k)}" r="{f(20*k)}" fill="#f0b43a"/>')
    for i in range(6):
        out.append(mint_leaf(cx + rnd.uniform(-150, 150) * k, top - rnd.uniform(20, 110) * k, k * rnd.uniform(0.8, 1.1), rnd.randint(0, 360)))
    out.append(chilli(cx - 170 * k, top - 20 * k, k * 0.9, -20, "#4f8a35"))
    out.append(steam(cx, top - 150 * k, 260 * k, rnd, 3, 90 * k))
    return "".join(out)


def handi(cx, cy, S, rnd):
    k = S / 600
    out = [shadow(cx, cy + 230 * k, 300 * k, 50 * k)]
    out.append(f'<path d="M{f(cx-210*k)} {f(cy-120*k)} C{f(cx-330*k)} {f(cy-40*k)} {f(cx-320*k)} {f(cy+200*k)} {f(cx-150*k)} {f(cy+235*k)} L{f(cx+150*k)} {f(cy+235*k)} C{f(cx+320*k)} {f(cy+200*k)} {f(cx+330*k)} {f(cy-40*k)} {f(cx+210*k)} {f(cy-120*k)} Z" fill="url(#copper)"/>')
    out.append(f'<path d="M{f(cx-250*k)} {f(cy+40*k)} Q{f(cx)} {f(cy+90*k)} {f(cx+250*k)} {f(cy+40*k)}" stroke="#f3b27a" stroke-width="{f(4*k)}" fill="none" opacity="0.35"/>')
    out.append(f'<ellipse cx="{f(cx-150*k)}" cy="{f(cy+20*k)}" rx="{f(30*k)}" ry="{f(80*k)}" fill="#ffd2a0" opacity="0.18"/>')
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy-120*k)}" rx="{f(230*k)}" ry="{f(46*k)}" fill="#8c4a22"/>')
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy-116*k)}" rx="{f(208*k)}" ry="{f(36*k)}" fill="#2a170c"/>')
    out.append(rice_mound(cx, cy - 100 * k, 200 * k, 120 * k, rnd, scale=k * 1.25, saffron=0.35))
    out.append(f'<path d="{blob_path(cx+40*k, cy-190*k, 48*k, rnd, 0.2)}" fill="url(#meat)"/>')
    for i in range(4):
        out.append(mint_leaf(cx + rnd.uniform(-120, 120) * k, cy - rnd.uniform(130, 210) * k, k, rnd.randint(0, 360)))
    out.append(steam(cx, cy - 230 * k, 320 * k, rnd, 4, 70 * k))
    return "".join(out)


def plate(cx, cy, r, steel=True):
    fill = "url(#steel)" if steel else "url(#clayPlate)"
    return (
        shadow(cx, cy + r * 0.12, r * 1.02, r * 0.95, 0.5)
        + f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{fill}"/>'
        + f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r*0.8)}" fill="none" stroke="#000" stroke-opacity="0.18" stroke-width="{f(r*0.03)}"/>'
    )


def kabab(cx, cy, S, rnd):
    k = S / 600
    out = [plate(cx, cy, 270 * k)]
    for _ in range(16):
        x, y = cx + rnd.uniform(-150, 150) * k, cy + rnd.uniform(-130, 130) * k
        if (x - cx) ** 2 + (y - cy) ** 2 > (175 * k) ** 2:
            continue
        r = rnd.uniform(34, 48) * k
        out.append(f'<path d="{blob_path(x, y, r, rnd, 0.3, 8, 0.75)}" fill="url(#kabab)"/>')
        for _ in range(3):
            out.append(f'<circle cx="{f(x+rnd.uniform(-r,r)*0.6)}" cy="{f(y+rnd.uniform(-r,r)*0.5)}" r="{f(rnd.uniform(3,6)*k)}" fill="#6e1408" opacity="0.7"/>')
    for i in range(4):
        x, y = cx + rnd.uniform(-170, 170) * k, cy + rnd.uniform(-170, 170) * k
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(40*k)}" ry="{f(30*k)}" fill="none" stroke="#e7b8c4" stroke-width="{f(7*k)}" opacity="0.9" transform="rotate({rnd.randint(0,180)} {f(x)} {f(y)})"/>')
    out.append(f'<path d="M{f(cx+150*k)} {f(cy+160*k)} a{f(55*k)} {f(55*k)} 0 0 1 {f(110*k)} 0 z" fill="#d9e36a"/>')
    out.append(f'<path d="M{f(cx+160*k)} {f(cy+156*k)} a{f(45*k)} {f(45*k)} 0 0 1 {f(90*k)} 0 z" fill="#f2f5b0"/>')
    for i in range(5):
        out.append(curry_leaf(cx + rnd.uniform(-160, 160) * k, cy + rnd.uniform(-160, 160) * k, k, rnd.randint(0, 360)))
    out.append(steam(cx, cy - 120 * k, 220 * k, rnd, 3, 80 * k))
    return "".join(out)


def bowl(cx, cy, r, gravy, rnd, chunks="url(#meat)", n=6):
    out = [shadow(cx, cy + r * 0.15, r * 1.05, r * 0.98, 0.55)]
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#clayBowl)"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r*0.84)}" fill="{gravy}"/>')
    out.append(f'<circle cx="{f(cx-r*0.25)}" cy="{f(cy-r*0.3)}" r="{f(r*0.3)}" fill="#fff" opacity="0.07"/>')
    for _ in range(n):
        a, d = rnd.uniform(0, 6.28), rnd.uniform(0, r * 0.55)
        out.append(f'<path d="{blob_path(cx+math.cos(a)*d, cy+math.sin(a)*d, r*rnd.uniform(0.14,0.2), rnd, 0.25)}" fill="{chunks}"/>')
    for _ in range(int(r / 6)):
        a, d = rnd.uniform(0, 6.28), rnd.uniform(0, r * 0.8)
        out.append(f'<circle cx="{f(cx+math.cos(a)*d)}" cy="{f(cy+math.sin(a)*d)}" r="{f(r*0.018)}" fill="#5f9442"/>')
    for _ in range(5):
        a, d = rnd.uniform(0, 6.28), rnd.uniform(r * 0.2, r * 0.75)
        out.append(f'<ellipse cx="{f(cx+math.cos(a)*d)}" cy="{f(cy+math.sin(a)*d)}" rx="{f(r*0.05)}" ry="{f(r*0.03)}" fill="#ffd27a" opacity="0.35"/>')
    return "".join(out)


def curry(cx, cy, S, rnd):
    k = S / 600
    return bowl(cx, cy, 250 * k, "url(#gheeRoast)", rnd) + "".join(
        curry_leaf(cx + rnd.uniform(-120, 120) * k, cy + rnd.uniform(-120, 120) * k, k, rnd.randint(0, 360)) for _ in range(4)
    ) + steam(cx, cy - 160 * k, 200 * k, rnd, 3, 70 * k)


def pepper_fry(cx, cy, S, rnd):
    k = S / 600
    out = [plate(cx, cy, 260 * k, steel=False)]
    for _ in range(14):
        x, y = cx + rnd.uniform(-140, 140) * k, cy + rnd.uniform(-130, 130) * k
        if (x - cx) ** 2 + (y - cy) ** 2 > (165 * k) ** 2:
            continue
        out.append(f'<path d="{blob_path(x, y, rnd.uniform(34,46)*k, rnd, 0.3, 8, 0.8)}" fill="url(#mutton)"/>')
    for _ in range(70):
        a, d = rnd.uniform(0, 6.28), rnd.uniform(0, 180 * k)
        out.append(f'<circle cx="{f(cx+math.cos(a)*d)}" cy="{f(cy+math.sin(a)*d)}" r="{f(rnd.uniform(3,5)*k)}" fill="#1a120d"/>')
    for _ in range(7):
        out.append(curry_leaf(cx + rnd.uniform(-170, 170) * k, cy + rnd.uniform(-170, 170) * k, k * 1.1, rnd.randint(0, 360)))
    for _ in range(5):
        x, y = cx + rnd.uniform(-150, 150) * k, cy + rnd.uniform(-150, 150) * k
        out.append(f'<path d="M{f(x)} {f(y)} q{f(20*k)} {f(-14*k)} {f(40*k)} 0" stroke="#e7b8c4" stroke-width="{f(6*k)}" fill="none"/>')
    return "".join(out)


def mudde(cx, cy, S, rnd):
    k = S / 600
    out = [shadow(cx, cy + 40 * k, 330 * k, 200 * k, 0.5)]
    out.append(f'<path d="M{f(cx-330*k)} {f(cy-170*k)} Q{f(cx)} {f(cy-230*k)} {f(cx+330*k)} {f(cy-150*k)} L{f(cx+310*k)} {f(cy+200*k)} Q{f(cx)} {f(cy+240*k)} {f(cx-320*k)} {f(cy+190*k)} Z" fill="url(#banana)"/>')
    out.append(f'<path d="M{f(cx-320*k)} {f(cy+10*k)} L{f(cx+320*k)} {f(cy+20*k)}" stroke="#a9c97a" stroke-width="{f(6*k)}" opacity="0.6"/>')
    for i in range(-6, 7):
        out.append(f'<path d="M{f(cx+i*50*k)} {f(cy+14*k)} L{f(cx+i*50*k+60*k)} {f(cy-180*k)}" stroke="#3d5f22" stroke-width="{f(2*k)}" opacity="0.5"/>')
        out.append(f'<path d="M{f(cx+i*50*k)} {f(cy+16*k)} L{f(cx+i*50*k+50*k)} {f(cy+210*k)}" stroke="#3d5f22" stroke-width="{f(2*k)}" opacity="0.5"/>')
    for dx in (-150, 0):
        x, y, r = cx + dx * k, cy + 10 * k, 82 * k
        out.append(shadow(x + 6 * k, y + 50 * k, r, r * 0.4, 0.5))
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#ragi)"/>')
        for _ in range(24):
            a, d = rnd.uniform(0, 6.28), rnd.uniform(0, r * 0.9)
            out.append(f'<circle cx="{f(x+math.cos(a)*d)}" cy="{f(y+math.sin(a)*d)}" r="{f(1.8*k)}" fill="#2d1a17" opacity="0.6"/>')
    out.append(bowl(cx + 190 * k, cy - 10 * k, 120 * k, "url(#saaru)", rnd, "url(#meat)", 4))
    out.append(steam(cx + 190 * k, cy - 110 * k, 180 * k, rnd, 2, 60 * k))
    return "".join(out)


def parotta_egg(cx, cy, S, rnd):
    k = S / 600
    out = []
    for i, (dx, dy) in enumerate([(-110, 30), (-60, -20)]):
        x, y, r = cx + dx * k, cy + dy * k, 170 * k
        out.append(shadow(x, y + 20 * k, r, r * 0.9, 0.5))
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#parotta)"/>')
        for j in range(1, 7):
            out.append(f'<circle cx="{f(x+rnd.uniform(-4,4)*k)}" cy="{f(y+rnd.uniform(-4,4)*k)}" r="{f(r*j/7)}" fill="none" stroke="#a8692a" stroke-width="{f(3*k)}" opacity="0.5"/>')
        for _ in range(10):
            a, d = rnd.uniform(0, 6.28), rnd.uniform(0, r * 0.9)
            out.append(f'<circle cx="{f(x+math.cos(a)*d)}" cy="{f(y+math.sin(a)*d)}" r="{f(rnd.uniform(4,9)*k)}" fill="#6b3a15" opacity="0.45"/>')
    out.append(bowl(cx + 190 * k, cy + 60 * k, 140 * k, "url(#gheeRoast)", rnd, "#fbf6ea", 0))
    for dx, dy in [(-30, -10), (40, 30)]:
        x, y = cx + (190 + dx) * k, cy + (60 + dy) * k
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(42*k)}" ry="{f(32*k)}" fill="#fbf6ea"/>')
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(18*k)}" fill="#f0b43a"/>')
    return "".join(out)


def drinks(cx, cy, S, rnd):
    k = S / 600
    out = []
    # glass of majjige, seen from above at an angle
    gx, gy = cx - 110 * k, cy - 20 * k
    out.append(shadow(gx, gy + 190 * k, 110 * k, 30 * k))
    out.append(f'<path d="M{f(gx-100*k)} {f(gy-170*k)} L{f(gx-80*k)} {f(gy+190*k)} Q{f(gx)} {f(gy+205*k)} {f(gx+80*k)} {f(gy+190*k)} L{f(gx+100*k)} {f(gy-170*k)} Z" fill="url(#glass)"/>')
    out.append(f'<path d="M{f(gx-92*k)} {f(gy-110*k)} L{f(gx-80*k)} {f(gy+185*k)} Q{f(gx)} {f(gy+198*k)} {f(gx+80*k)} {f(gy+185*k)} L{f(gx+92*k)} {f(gy-110*k)} Z" fill="url(#buttermilk)"/>')
    out.append(f'<ellipse cx="{f(gx)}" cy="{f(gy-110*k)}" rx="{f(92*k)}" ry="{f(18*k)}" fill="#f4f0e2"/>')
    out.append(f'<ellipse cx="{f(gx)}" cy="{f(gy-170*k)}" rx="{f(100*k)}" ry="{f(20*k)}" fill="none" stroke="#f5ebd6" stroke-opacity="0.4" stroke-width="{f(3*k)}"/>')
    out.append(curry_leaf(gx - 30 * k, gy - 112 * k, k * 0.9, 10))
    out.append(curry_leaf(gx + 10 * k, gy - 108 * k, k * 0.8, -30))
    out.append(f'<path d="M{f(gx-60*k)} {f(gy-60*k)} L{f(gx-50*k)} {f(gy+150*k)}" stroke="#fff" stroke-opacity="0.25" stroke-width="{f(10*k)}" stroke-linecap="round"/>')
    # gulab jamun bowl
    bx, by, r = cx + 160 * k, cy + 90 * k, 150 * k
    out.append(shadow(bx, by + 20 * k, r, r * 0.9, 0.5))
    out.append(f'<circle cx="{f(bx)}" cy="{f(by)}" r="{f(r)}" fill="url(#steel)"/>')
    out.append(f'<circle cx="{f(bx)}" cy="{f(by)}" r="{f(r*0.82)}" fill="url(#syrup)"/>')
    for dx, dy in [(-45, -20), (45, 15)]:
        out.append(f'<circle cx="{f(bx+dx*k)}" cy="{f(by+dy*k)}" r="{f(52*k)}" fill="url(#jamun)"/>')
        out.append(f'<ellipse cx="{f(bx+(dx-16)*k)}" cy="{f(by+(dy-20)*k)}" rx="{f(14*k)}" ry="{f(8*k)}" fill="#fff" opacity="0.3"/>')
    return "".join(out)


def spread(cx, cy, S, rnd):
    k = S / 1000
    return (
        kabab(cx - 330 * k, cy - 150 * k, 420 * k, rnd)
        + curry(cx + 340 * k, cy - 170 * k, 380 * k, rnd)
        + bowl(cx + 380 * k, cy + 260 * k, 100 * k, "#efe7d2", rnd, "#9bbb6a", 5)
        + donne(cx, cy + 90 * k, 560 * k, rnd, egg=True)
    )


# ---------------------------------------------------------------- defs + file
DEFS = """<defs>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="steamBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<radialGradient id="table" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#3a2a1b"/><stop offset=".55" stop-color="#1d150e"/><stop offset="1" stop-color="#0d0a07"/></radialGradient>
<radialGradient id="glow" cx="50%" cy="40%" r="50%"><stop offset="0" stop-color="#e0a03a" stop-opacity=".22"/><stop offset="1" stop-color="#e0a03a" stop-opacity="0"/></radialGradient>
<radialGradient id="riceBase" cx="50%" cy="80%" r="70%"><stop offset="0" stop-color="#e9c98a"/><stop offset="1" stop-color="#c79a50"/></radialGradient>
<linearGradient id="leafCup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9d8a4c"/><stop offset=".6" stop-color="#7a6834"/><stop offset="1" stop-color="#4f421e"/></linearGradient>
<radialGradient id="meat" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#d98a43"/><stop offset=".6" stop-color="#9c4a1d"/><stop offset="1" stop-color="#5a2410"/></radialGradient>
<radialGradient id="kabab" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#f06a35"/><stop offset=".55" stop-color="#c02c14"/><stop offset="1" stop-color="#6e1408"/></radialGradient>
<radialGradient id="mutton" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#9a5a2e"/><stop offset=".6" stop-color="#5a2a12"/><stop offset="1" stop-color="#2a1208"/></radialGradient>
<radialGradient id="steel" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#e9e6df"/><stop offset=".7" stop-color="#a7a39a"/><stop offset="1" stop-color="#6c6860"/></radialGradient>
<radialGradient id="clayPlate" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#9c4d2c"/><stop offset=".8" stop-color="#6e2f18"/><stop offset="1" stop-color="#43190b"/></radialGradient>
<radialGradient id="clayBowl" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#b65a32"/><stop offset=".8" stop-color="#7a3519"/><stop offset="1" stop-color="#3f170a"/></radialGradient>
<radialGradient id="gheeRoast" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#e2552a"/><stop offset=".7" stop-color="#a8260f"/><stop offset="1" stop-color="#6c1406"/></radialGradient>
<radialGradient id="saaru" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#e98a3a"/><stop offset="1" stop-color="#a5481a"/></radialGradient>
<linearGradient id="copper" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a2a12"/><stop offset=".35" stop-color="#c46a32"/><stop offset=".55" stop-color="#e08a4a"/><stop offset="1" stop-color="#4a200c"/></linearGradient>
<linearGradient id="banana" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d8c38"/><stop offset=".5" stop-color="#4a7a2a"/><stop offset="1" stop-color="#2f5418"/></linearGradient>
<radialGradient id="ragi" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#a0705f"/><stop offset=".6" stop-color="#6a4136"/><stop offset="1" stop-color="#3a221b"/></radialGradient>
<radialGradient id="parotta" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#f3cd84"/><stop offset=".7" stop-color="#d79a4c"/><stop offset="1" stop-color="#a5672a"/></radialGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f5ebd6" stop-opacity=".25"/><stop offset=".5" stop-color="#f5ebd6" stop-opacity=".08"/><stop offset="1" stop-color="#f5ebd6" stop-opacity=".22"/></linearGradient>
<linearGradient id="buttermilk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d4c2"/><stop offset=".5" stop-color="#f4f0e2"/><stop offset="1" stop-color="#cfc9b4"/></linearGradient>
<radialGradient id="syrup" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#e8a24a"/><stop offset="1" stop-color="#a45a18"/></radialGradient>
<radialGradient id="jamun" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#9a3d1a"/><stop offset=".7" stop-color="#5a1e0a"/><stop offset="1" stop-color="#2f0e04"/></radialGradient>
</defs>"""


def render(name, w, h, subject, seed, subject_scale=0.82, focus=(0.5, 0.5), **kw):
    rnd = random.Random(seed)
    S = min(w, h) * subject_scale
    cx, cy = w * focus[0], h * focus[1]
    body = [
        f'<rect width="{w}" height="{h}" fill="url(#table)"/>',
        f'<rect width="{w}" height="{h}" fill="url(#glow)"/>',
        scatter_bg(w, h, rnd, [(cx, cy, S * 0.62)]),
        subject(cx, cy, S, rnd, **kw),
    ]
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{DEFS}{"".join(body)}</svg>'
    (OUT / f"{name}.svg").write_text(svg)
    return name, len(svg)


JOBS = [
    # site images
    ("hero", 1600, 1000, spread, 11, 0.82, (0.73, 0.55)),
    ("about-handi", 800, 1000, handi, 12, 0.8, (0.5, 0.52)),
    ("about-kabab", 800, 800, kabab, 13, 0.85, (0.5, 0.5)),
    ("booking-spread", 1000, 1000, spread, 14, 0.95, (0.5, 0.5)),
    # menu banners (2:1)
    ("menu-donne", 1400, 700, donne, 21, 0.9, (0.5, 0.55)),
    ("menu-kabab", 1400, 700, kabab, 22, 0.95, (0.5, 0.5)),
    ("menu-chicken", 1400, 700, curry, 23, 0.95, (0.5, 0.5)),
    ("menu-mutton", 1400, 700, pepper_fry, 24, 0.95, (0.5, 0.5)),
    ("menu-nati", 1400, 700, mudde, 25, 0.95, (0.5, 0.5)),
    ("menu-sides", 1400, 700, parotta_egg, 26, 0.95, (0.5, 0.5)),
    ("menu-drinks", 1400, 700, drinks, 27, 0.95, (0.5, 0.5)),
    # gallery (matching tile shapes)
    ("g-handi", 620, 1000, handi, 31, 0.85, (0.5, 0.5)),
    ("g-kabab", 1000, 800, kabab, 32, 0.85, (0.5, 0.5)),
    ("g-donne", 1300, 520, donne, 33, 0.85, (0.5, 0.55)),
    ("g-chicken", 1000, 800, curry, 34, 0.85, (0.5, 0.5)),
    ("g-nati", 1000, 800, mudde, 35, 0.75, (0.5, 0.5)),
    ("g-mutton", 1000, 800, pepper_fry, 36, 0.85, (0.5, 0.5)),
    ("g-spread", 1300, 520, spread, 37, 1.2, (0.5, 0.52)),
    ("g-drinks", 1300, 520, drinks, 38, 0.85, (0.5, 0.5)),
]

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, w, h, subj, seed, scale, focus in JOBS:
        kw = {"egg": True} if subj is donne and name == "menu-donne" else {}
        n, size = render(name, w, h, subj, seed, scale, focus, **kw)
        print(f"{n:16} {size/1024:6.1f} KB")
