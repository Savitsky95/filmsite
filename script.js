document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const filterModal = document.getElementById("filterModal");
    const searchMoviesBtn = document.getElementById("searchMoviesBtn");

    // Скрываем модальное окно при загрузке страницы
    filterModal.style.display = "none";

    // Открытие модального окна
    searchBtn.addEventListener("click", () => {
        filterModal.style.display = "flex";
    });

    // Закрытие модального окна
    closeModalBtn.addEventListener("click", () => {
        filterModal.style.display = "none";
    });

    // Закрытие по клику вне модального окна
    window.addEventListener("click", (event) => {
        if (event.target === filterModal) {
            filterModal.style.display = "none";
        }
    });

    // Поиск фильмов (пока что просто вывод в консоль)
    searchMoviesBtn.addEventListener("click", () => {
        console.log("Поиск фильмов с выбранными параметрами");
        filterModal.style.display = "none";
    });

    // Переводы
    const translations = {
        ru: {
            title: "Давай найдем фильм вместе!",
            search: "Подбор",
            filters: "Фильтры",
            type: "Тип",
            movie: "Фильм",
            series: "Сериал",
            genre: "Жанр",
            action: "Экшн",
            comedy: "Комедия",
            year: "Год",
            searchBtn: "Поиск"
        },
        en: {
            title: "Let's find a movie together!",
            search: "Find",
            filters: "Filters",
            type: "Type",
            movie: "Movie",
            series: "Series",
            genre: "Genre",
            action: "Action",
            comedy: "Comedy",
            year: "Year",
            searchBtn: "Search"
        },
        ua: {
            title: "Давай знайдемо фільм разом!",
            search: "Підбір",
            filters: "Фільтри",
            type: "Тип",
            movie: "Фільм",
            series: "Серіал",
            genre: "Жанр",
            action: "Бойовик",
            comedy: "Комедія",
            year: "Рік",
            searchBtn: "Пошук"
        }
    };

    function getLangFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("lang") || "ru";
    }

    function applyTranslations(lang) {
        const t = translations[lang] || translations.ru;
        document.querySelector("h1").textContent = t.title;
        document.getElementById("searchBtn").textContent = t.search;
        document.querySelector(".modal-content h2").textContent = t.filters;
        document.querySelector("label[for='type']").textContent = t.type;
        document.querySelector("option[value='movie']").textContent = t.movie;
        document.querySelector("option[value='series']").textContent = t.series;
        document.querySelector("label[for='genre']").textContent = t.genre;
        document.querySelector("option[value='action']").textContent = t.action;
        document.querySelector("option[value='comedy']").textContent = t.comedy;
        document.querySelector("label[for='year']").textContent = t.year;
        document.getElementById("searchMoviesBtn").textContent = t.searchBtn;
    }

    const currentLang = getLangFromURL();
    applyTranslations(currentLang);
});
