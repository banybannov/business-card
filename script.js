/*
  Это файл со СЦЕНАРИЕМ поведения страницы (JavaScript).
  Он ничего не рисует сам — он находит уже готовые элементы из index.html
  (по их id или классу) и меняет им текст/атрибуты, когда что-то происходит
  (например, человек нажал кнопку).

  В файле две части:
  1. Переключение темы (тёмная/светлая)
  2. Переключение языка (русский/английский)
*/


/* ==========================================================
   ЧАСТЬ 1. Переключение темы (тёмная / светлая)
   ========================================================== */

// Находим на странице кнопку с id="themeToggle" (см. index.html)
const themeButton = document.getElementById("themeToggle");

// <html> — это самый главный тег страницы. Мы вешаем на него
// атрибут data-theme="light", и CSS-файл (style.css) сам подхватывает
// нужные цвета — смотри там блок [data-theme="light"] { ... }
const htmlTag = document.documentElement;

// Если человек уже выбирал тему раньше — браузер запомнил это
// в localStorage (это как маленькое хранилище на компьютере пользователя).
// Читаем сохранённое значение и сразу применяем его.
const savedTheme = localStorage.getItem("card-theme");
if (savedTheme === "light") {
  htmlTag.setAttribute("data-theme", "light");
}

// Когда кнопку нажимают — переключаем тему на противоположную
// и запоминаем выбор, чтобы он сохранился при следующем визите.
themeButton.addEventListener("click", function () {
  const currentThemeIsLight = htmlTag.getAttribute("data-theme") === "light";

  if (currentThemeIsLight) {
    htmlTag.removeAttribute("data-theme"); // без атрибута = тёмная тема (она "по умолчанию")
    localStorage.setItem("card-theme", "dark");
  } else {
    htmlTag.setAttribute("data-theme", "light");
    localStorage.setItem("card-theme", "light");
  }
});


/* ==========================================================
   ЧАСТЬ 2. Переключение языка (русский / английский)
   ========================================================== */

// Здесь лежат ВСЕ тексты страницы на двух языках.
// Ключи слева (например "title") — это имена, которые встречаются
// в index.html как data-i18n="title". Скрипт ищет элемент с таким
// атрибутом и подставляет в него текст из этого словаря.
const translations = {
  ru: {
    name: "Никита Баннов",
    title: "QA-инженер · Автоматизация тестирования",
    location: "Remote · открыт к проектам",
    tagline: "Ловлю баги до релиза и автоматизирую рутину",
    bio: "Занимаюсь тестированием: пишу тест-кейсы, покрываю функциональность автотестами на Python " +
         "и настраиваю проверки в CI/CD, чтобы баги не доезжали до продакшена. " +
         "Параллельно веду свой pet-проект — телеграм-бота.",
    projectHeading: "Проект",
    projectDesc: "Телеграм-бот, который за пару минут собирает ATS-резюме с помощью AI.",
    contactsHeading: "Контакты",
    ctaPrimary: "Написать на почту",
    ctaSecondary: "Написать в Telegram",
    footerNote: "© 2026 Никита Баннов · Открыт к предложениям о работе и сотрудничестве",
  },
  en: {
    name: "Nikita Bannov",
    title: "QA Engineer · Test Automation",
    location: "Remote · open to opportunities",
    tagline: "Catching bugs before release, automating the rest",
    bio: "I work on testing: writing test cases, covering functionality with automated tests in Python, " +
         "and setting up checks in CI/CD so bugs don't reach production. " +
         "Alongside that, I'm building my own side project — a Telegram bot.",
    projectHeading: "Project",
    projectDesc: "A Telegram bot that puts together an ATS-friendly resume with AI in a couple of minutes.",
    contactsHeading: "Contact",
    ctaPrimary: "Email me",
    ctaSecondary: "Message on Telegram",
    footerNote: "© 2026 Nikita Bannov · Open to job offers and collaboration",
  },
};

// Находим кнопку языка и запоминаем, какой язык выбран сейчас.
// Если человек уже выбирал язык раньше — берём его выбор из localStorage.
const langButton = document.getElementById("langToggle");
let currentLanguage = localStorage.getItem("card-lang") || "ru";

// Эта функция применяет выбранный язык ко всей странице.
function applyLanguage(languageCode) {
  const dictionary = translations[languageCode];

  // Находим на странице все элементы с атрибутом data-i18n="..."
  // и подставляем в каждый нужный перевод из словаря.
  const translatableElements = document.querySelectorAll("[data-i18n]");
  translatableElements.forEach(function (element) {
    const key = element.getAttribute("data-i18n");
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  // <html lang="..."> — техническая штука для браузера и скринридеров,
  // просто говорит, на каком языке страница.
  htmlTag.setAttribute("lang", languageCode);

  // Кнопка показывает язык, НА КОТОРЫЙ можно переключиться,
  // поэтому текст на кнопке — противоположный текущему.
  langButton.textContent = languageCode === "ru" ? "EN" : "RU";
}

// Применяем сохранённый (или язык по умолчанию) сразу при загрузке страницы.
applyLanguage(currentLanguage);

// При клике на кнопку — переключаемся на другой язык.
langButton.addEventListener("click", function () {
  currentLanguage = currentLanguage === "ru" ? "en" : "ru";
  localStorage.setItem("card-lang", currentLanguage);
  applyLanguage(currentLanguage);
});
