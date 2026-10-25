"""Вырезает зелёный хромакей из assets/monitor.jpg -> assets/monitor.webp (с прозрачностью)
и печатает углы экрана для CONFIG.monitor.glass. Запуск: python3 tools/key_monitor.py"""
import os
from PIL import Image, ImageFilter
D = os.path.join(os.path.dirname(__file__), '..', 'assets')
im = Image.open(os.path.join(D, 'monitor.jpg')).convert('RGB')
W, H = im.size
px = im.load()
a = Image.new('L', im.size, 255); ap = a.load()
REGION = (200, 250, 820, 700)  # где искать экран: x0, y0, x1, y1
pts = []
for y in range(REGION[1], REGION[3]):
    for x in range(REGION[0], REGION[2]):
        r, g, b = px[x, y]
        k = g - max(r, b)          # насколько пиксель «зелёный»
        if k > 60 and g > 120:
            ap[x, y] = 0; pts.append((x, y))
        elif k > 25 and g > 90:
            ap[x, y] = int(255 * (60 - k) / 35)
# чуть смягчаем край и убираем зелёный ореол
a = a.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.7))
out = im.copy(); op = out.load(); ap = a.load()
for y in range(H):
    for x in range(W):
        if ap[x, y] < 255:
            r, g, b = op[x, y]; op[x, y] = (r, min(g, max(r, b) + 10), b)
out.putalpha(a)
out.save(os.path.join(D, 'monitor.webp'), quality=88, method=6)
# углы экрана: крайние точки по x+y и x-y
tl = min(pts, key=lambda p: p[0] + p[1]); br = max(pts, key=lambda p: p[0] + p[1])
tr = max(pts, key=lambda p: p[0] - p[1]); bl = min(pts, key=lambda p: p[0] - p[1])
print('glass:', [tl, tr, br, bl])
