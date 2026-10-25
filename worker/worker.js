// BANY OS — нейронка для сайта на Cloudflare Workers AI (бесплатный дневной лимит).
// Как запустить — см. worker/README.md. Ключей тут нет: модель подключается через привязку AI.

// С каких сайтов можно звать воркер. Впиши адрес своего сайта, например 'https://banybannov.github.io'.
// '*' — с любого (удобно для проверки, но тогда чужие сайты могут тратить твой лимит).
const ALLOWED_ORIGIN = '*';

// Модели: первая рабочая из списка. Большая умнее и лучше говорит по-русски, маленькая тратит меньше лимита.
const CHAT_MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct'];
const IMAGE_MODEL = '@cf/black-forest-labs/flux-1-schnell';

// Характеры. Правь тексты как хочешь.
const ABOUT = 'Сайт принадлежит Никите Баннову (ник bany): QA-инженер, автоматизация тестирования на Python, Pytest, ' +
  'Selenium/Playwright, Postman, CI/CD, делает телеграм-бота CVIUM.BOT. Контакты: Telegram @quebany, почта bany.bannov@gmail.com. ' +
  'Сайт сделан как ретро-ОС BANY OS: на рабочем столе папки ОБО МНЕ, ПРОЕКТЫ, ИГРЫ (тетрис, гонки, солитер), ФОТО, ПЛЕЕР, РЕКОРДЫ, ТЕРМИНАЛ, ПОЧТА. ' +
  'На сайте спрятаны пасхалки, но ты их не выдаёшь, максимум намекаешь.';
const PERSONAS = {
  clippy: 'Ты Скрепыш, помощник в углу экрана ретро-ОС, как скрепка из старого Word. Ты дружелюбный, немного назойливый и смешной. ' +
    'Отвечай по-русски, коротко: 1–2 предложения. ' + ABOUT,
  terminal: 'Ты древний компьютер BANY OS 1995 года, отвечаешь в командной строке. Пользователь ввёл команду, которой нет. ' +
    'Ответь по-русски, коротко (до 3 строк), как ворчливый старый терминал с чувством юмора, можно КАПСОМ, без markdown. ' + ABOUT
};

const json = (data, status, origin) => new Response(JSON.stringify(data), { status: status || 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
const cors = origin => ({ 'Access-Control-Allow-Origin': ALLOWED_ORIGIN === '*' ? '*' : ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' });

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (req.method !== 'POST') return json({ error: 'POST only' }, 405, origin);
    if (ALLOWED_ORIGIN !== '*' && origin !== ALLOWED_ORIGIN) return json({ error: 'forbidden' }, 403, origin);
    const path = new URL(req.url).pathname;
    let body; try { body = await req.json(); } catch (e) { return json({ error: 'bad json' }, 400, origin); }

    if (path === '/chat') {
      const persona = PERSONAS[body.mode]; if (!persona) return json({ error: 'bad mode' }, 400, origin);
      const history = (Array.isArray(body.messages) ? body.messages : []).slice(-8)
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map(m => ({ role: m.role, content: m.content.slice(0, 500) }));
      if (!history.length) return json({ error: 'empty' }, 400, origin);
      for (const model of CHAT_MODELS) {
        try {
          const r = await env.AI.run(model, { messages: [{ role: 'system', content: persona }, ...history], max_tokens: 160, temperature: 0.8 });
          if (r && r.response) return json({ text: String(r.response).trim() }, 200, origin);
        } catch (e) { /* пробуем следующую модель */ }
      }
      return json({ error: 'model failed' }, 502, origin);
    }

    if (path === '/avatar') {
      const what = String(body.prompt || '').slice(0, 200).trim(); if (!what) return json({ error: 'empty' }, 400, origin);
      try {
        const r = await env.AI.run(IMAGE_MODEL, { prompt: 'pixel art avatar portrait, 16-bit retro game style, centered head and shoulders, plain dark background, ' + what, steps: 4 });
        if (r && r.image) return json({ image: 'data:image/jpeg;base64,' + r.image }, 200, origin);
        // некоторые модели картинок отдают сразу файл, а не base64
        const buf = new Uint8Array(await new Response(r).arrayBuffer()); let bin = '';
        for (let i = 0; i < buf.length; i += 8192) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 8192));
        return json({ image: 'data:image/png;base64,' + btoa(bin) }, 200, origin);
      } catch (e) { return json({ error: 'model failed' }, 502, origin); }
    }
    return json({ error: 'not found' }, 404, origin);
  }
};
