# BANY OS — источники и лицензии

| Что | Источник | Лицензия |
|---|---|---|
| Иконки (`assets/icons.png`) | [pixelarticons](https://github.com/halfmage/pixelarticons) 2.4.2, Gerrit Halfmann. Перекрашены в палитру ОС скриптом `tools/make_icons.py` | MIT (`assets/LICENSE-pixelarticons.txt`) |
| Шрифт Press Start 2P (заголовки, кириллица) | [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P), CodeMan38 | SIL OFL 1.1 (`assets/fonts/OFL-pressstart2p.txt`) |
| Шрифт Pixelify Sans (текст, кириллица) | [Google Fonts](https://fonts.google.com/specimen/Pixelify+Sans), Stefie Justprince | SIL OFL 1.1 (`assets/fonts/OFL-pixelifysans.txt`) |
| Комната (`room.png`), монитор (`monitor.jpg`), картинки окон | Сцены автора сайта (из bany_os.zip) | — |
| Звуки | Синтезируются в браузере через WebAudio, файлов нет | — |

Как сделано, чтобы картинка была чёткой и не обрезалась на разных экранах:
[MDN: Crisp pixel art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look),
[web.dev: devicePixelContentBox](https://web.dev/articles/device-pixel-content-box).

## Как менять

- Всё основное — в блоке `CONFIG` в начале скрипта в `index.html`: цвета, тайминги, иконки, окна, тексты, команды терминала, координаты экранов.
- Новое фото монитора: положи `assets/monitor.jpg` и запусти `python3 tools/key_monitor.py` — вырежет хромакей и напечатает углы стекла для `CONFIG.monitor.glass`.
- Новая комната: замени `assets/room.png`, поправь прямоугольники в `tools/make_masks.py` и `CONFIG.room.screens`, запусти `python3 tools/make_masks.py`.
- Другие иконки: поменяй список `NAMES` в `tools/make_icons.py` (имена из pixelarticons) и запусти его.
