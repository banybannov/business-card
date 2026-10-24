"""Собирает assets/icons.png (лист 32x32) из SVG pixelarticons (MIT).
Запуск: python3 tools/make_icons.py путь/к/pixelarticons/svg
Каждая иконка: контур 24x24 по центру ячейки 32x32, замкнутые области
заливаются тёмным цветом, снизу-справа — тень в 1 px. Палитра — как в CONFIG.colors."""
import re, sys, os
from PIL import Image

SVG_DIR = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'icons.png')
# порядок = индекс иконки в CONFIG (icon: N)
NAMES = ['user', 'folder', 'mail', 'terminal', 'globe', 'music',
         'camera', 'calendar', 'trash', 'bug', 'download', 'file-text',
         'blocks', 'car', 'cards', 'trophy', 'monitor', 'gamepad', 'crown', 'album']
# имя -> (контур, заливка); по умолчанию зелёный, «вирус» — красный акцент
GREEN = ((0x9c, 0xff, 0x9c), (0x1d, 0x5a, 0x2a))
RED = ((0xff, 0x3b, 0x5c), (0x4a, 0x0f, 0x1c))
SHADOW = (0x02, 0x0a, 0x05)
COLORS = {'bug': RED, 'crown': RED}

def raster(path_d):
    """Пути pixelarticons — только отрезки по сетке; рисуем многоугольники even-odd."""
    polys, cur, x, y = [], [], 0, 0
    for cmd, args in re.findall(r'([MmHhVvLlZz])([^MmHhVvLlZz]*)', path_d):
        nums = [float(n) for n in re.findall(r'-?\d*\.?\d+', args)]
        if cmd in 'Mm':
            if cur: polys.append(cur)
            x, y = (nums[0], nums[1]) if cmd == 'M' else (x + nums[0], y + nums[1])
            cur = [(x, y)]
            nums = nums[2:]
            cmd = 'L' if cmd == 'M' else 'l'
        if cmd in 'Ll':
            for i in range(0, len(nums), 2):
                x, y = (nums[i], nums[i+1]) if cmd == 'L' else (x + nums[i], y + nums[i+1]); cur.append((x, y))
        for n in nums if cmd in 'HhVv' else []:
            if cmd == 'H': x = n
            elif cmd == 'h': x += n
            elif cmd == 'V': y = n
            else: y += n
            cur.append((x, y))
        if cmd in 'Zz' and cur:
            polys.append(cur); x, y = cur[0]; cur = []
    if cur: polys.append(cur)
    grid = [[0]*24 for _ in range(24)]
    for py in range(24):
        for px in range(24):
            cx, cy, inside = px + .5, py + .5, False
            for poly in polys:
                for i in range(len(poly)):
                    (x1, y1), (x2, y2) = poly[i], poly[(i+1) % len(poly)]
                    if (y1 > cy) != (y2 > cy) and cx < x1 + (cy - y1) * (x2 - x1) / (y2 - y1):
                        inside = not inside
            # even-odd по всем путям сразу даёт дырки там, где пути перекрываются — поэтому OR по путям
            if inside: grid[py][px] = 1
    return grid

def cards():
    """Своя иконка «пасьянс»: две карты, на передней пика (в pixelarticons такой нет)."""
    g = [[0]*24 for _ in range(24)]
    def box(x0, y0, x1, y1, v):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1): g[y][x] = v
    box(9, 1, 21, 17, 1); box(10, 2, 20, 16, 0)          # задняя карта
    box(3, 5, 15, 22, 1); box(4, 6, 14, 21, 0)           # передняя карта (закрывает заднюю)
    spade = ['...#...', '..###..', '.#####.', '#######', '#######', '.#.#.#.', '...#...', '..###..']
    for j, row in enumerate(spade):
        for i, ch in enumerate(row):
            if ch == '#': g[10 + j][6 + i] = 1
    return g

CUSTOM = {'cards': cards}

def icon(name):
    g = [[0]*24 for _ in range(24)]
    if name in CUSTOM:
        g = CUSTOM[name]()
    for d in ([] if name in CUSTOM else re.findall(r' d="([^"]+)"', open(os.path.join(SVG_DIR, name + '.svg')).read())):
        r = raster(d)
        for yy in range(24):
            for xx in range(24): g[yy][xx] |= r[yy][xx]
    # заливка замкнутых областей: всё, что не достижимо снаружи
    out = [[0]*24 for _ in range(24)]
    stack = [(x, y) for x in range(24) for y in (0, 23)] + [(x, y) for y in range(24) for x in (0, 23)]
    while stack:
        x, y = stack.pop()
        if 0 <= x < 24 and 0 <= y < 24 and not g[y][x] and not out[y][x]:
            out[y][x] = 1; stack += [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]
    line, fill = COLORS.get(name, GREEN)
    im = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    for y in range(24):
        for x in range(24):
            if g[y][x]: im.putpixel((x+5, y+5), SHADOW + (255,))
    for y in range(24):
        for x in range(24):
            if g[y][x]: im.putpixel((x+4, y+4), line + (255,))
            elif not out[y][x]: im.putpixel((x+4, y+4), fill + (255,))
    return im

sheet = Image.new('RGBA', (32 * len(NAMES), 32), (0, 0, 0, 0))
for i, n in enumerate(NAMES):
    sheet.paste(icon(n), (i * 32, 0))
sheet.save(OUT)
print('saved', OUT, sheet.size)
