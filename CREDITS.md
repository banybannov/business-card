# BANY OS — источники и лицензии

| Что | Источник | Лицензия |
|---|---|---|
| Иконки (`assets/icons.png`) | [pixelarticons](https://github.com/halfmage/pixelarticons) 2.4.2, Gerrit Halfmann. Перекрашены в палитру ОС скриптом `tools/make_icons.py` | MIT (`assets/LICENSE-pixelarticons.txt`) |
| Шрифт Press Start 2P (заголовки, кириллица) | [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P), CodeMan38 | SIL OFL 1.1 (`assets/fonts/OFL-pressstart2p.txt`) |
| Шрифт Tiny5 (текст, кириллица) | [Google Fonts](https://fonts.google.com/specimen/Tiny5), Gissio | SIL OFL 1.1 (`assets/fonts/OFL-tiny5.txt`) |
| Иконка «карты» | Нарисована в `tools/make_icons.py` | своя |
| Персонаж | Нарисован по пикселю в `CONFIG.hero` (index.html) | свой |
| Музыка | «BANY THEME» — своя мелодия. «Коробейники» (народная песня), Э. Григ «В пещере горного короля» (1875), Л. ван Бетховен «К Элизе» и «Ода к радости» — общественное достояние. 8-битные аранжировки написаны заново нотами в `CONFIG.music` | своя / public domain |
| Комната (`room.png`), монитор (`monitor.jpg`), картинки окон | Сцены автора сайта (из bany_os.zip) | — |
| Звуки и музыка | Синтезируются в браузере через WebAudio, аудиофайлов нет | — |

Как сделано, чтобы картинка была чёткой и не обрезалась на разных экранах:
[MDN: Crisp pixel art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look),
[web.dev: devicePixelContentBox](https://web.dev/articles/device-pixel-content-box).

## Как менять

- Всё основное — в блоке `CONFIG` в начале скрипта в `index.html`: цвета, тайминги, иконки, окна, тексты, команды терминала, координаты экранов.
- Новое фото монитора: положи `assets/monitor.jpg` и запусти `python3 tools/key_monitor.py` — вырежет хромакей и напечатает углы стекла для `CONFIG.monitor.glass`.
- Новая комната: замени `assets/room.png`, поправь прямоугольники в `tools/make_masks.py` и `CONFIG.room.screens`, запусти `python3 tools/make_masks.py`.
- Рекорды: по умолчанию хранятся в браузере игрока. Для общей таблицы укажи `CONFIG.leaderboard.endpoint` (формат API описан в комментарии).
- Музыка: ноты треков в `CONFIG.music.tracks`, формат описан в комментарии.
- Другие иконки: поменяй список `NAMES` в `tools/make_icons.py` (имена из pixelarticons) и запусти его.
