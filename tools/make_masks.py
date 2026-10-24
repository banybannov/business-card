"""Маски для оживления комнаты (assets/room.png):
  assets/room-screens.png — пиксели экранов, куда рисуется анимация (белые, остальное прозрачное)
  assets/room-twinkle.png — светодиоды и огни города за жалюзи (мигают)
Прямоугольники совпадают с CONFIG.room.screens в index.html. Запуск: python3 tools/make_masks.py"""
import os
from PIL import Image
D = os.path.join(os.path.dirname(__file__), '..', 'assets')
im = Image.open(os.path.join(D, 'room.png')).convert('RGB'); px = im.load()
S = Image.new('LA', im.size, (255, 0)); T = Image.new('LA', im.size, (255, 0))
sp, tp = S.load(), T.load()

def rect(r, test, out):
    x0, y0, w, h = r
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if test(*px[x, y]): out[x, y] = (255, 255)

# экраны: [x, y, w, h] + условие «это пиксель экрана»
rect((20, 80, 210, 148), lambda r, g, b: r > 120, sp)                       # красный монитор
rect((364, 102, 124, 76), lambda r, g, b: True, sp)                          # маленький сверху
rect((300, 376, 368, 206), lambda r, g, b: g > 135 and b > 135 and g > r + 4, sp)  # главный (за головой)
rect((796, 546, 156, 80), lambda r, g, b: True, sp)                          # справа
# огни за жалюзи
rect((300, 20, 540, 330), lambda r, g, b: b > r + 8 and (b > 85 or g > 85), tp)
# светодиоды на стойках
for R in ((30, 280, 230, 400), (40, 470, 230, 200), (770, 500, 190, 240)):
    rect(R, lambda r, g, b: (r > 200 and g > 170 and b < 130) or (g > 170 and r < 170 and b < 150)
         or (b > 170 and g > 150 and r < 130) or (r > 220 and 100 < g < 175 and b < 90), tp)
S.save(os.path.join(D, 'room-screens.png'), optimize=True)
T.save(os.path.join(D, 'room-twinkle.png'), optimize=True)
print('ok')
