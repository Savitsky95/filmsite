window.onload = () => {
    const API_KEY = "035a42c2ee22ee951b6e6b2845a82552";
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

    const elements = {
        searchBtn: document.getElementById("searchBtn"),
        closeModalBtn: document.getElementById("closeModalBtn"),
        filterModal: document.getElementById("filterModal"),
        searchMoviesBtn: document.getElementById("searchMoviesBtn"),
        movieContainer: document.getElementById("movies"),
        novinkiBtn: document.getElementById("novinkiBtn"),
        popularBtn: document.getElementById("popularBtn"),
        topBtn: document.getElementById("topBtn"),
    };

    if (elements.filterModal) elements.filterModal.style.display = "none";

    if (elements.searchBtn) elements.searchBtn.addEventListener("click", () => toggleModal(true));
    if (elements.closeModalBtn) elements.closeModalBtn.addEventListener("click", () => toggleModal(false));

    window.addEventListener("click", (event) => {
        if (elements.filterModal && event.target === elements.filterModal) toggleModal(false);
    });

    function toggleModal(show) {
        if (elements.filterModal) {
            elements.filterModal.style.display = show ? "flex" : "none";
        }
    }

    async function fetchMovies(endpoint) {
        try {
            console.log(`Запрос к API: ${BASE_URL}${endpoint}?api_key=${API_KEY}&language=ru-RU&page=1`);
            const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=ru-RU&page=1`);
            if (!response.ok) throw new Error("Ошибка загрузки данных");
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    function renderMovies(movies) {
        if (!elements.movieContainer) return;

        elements.movieContainer.innerHTML = movies.length
            ? movies.map(movie => `
                <div class="movie-card">
                    <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>Рейтинг: ${movie.vote_average}</p>
                </div>
            `).join("")
            : "<p>Фильмы не найдены</p>";
    }

    function handleCategoryClick(endpoint) {
        return async () => {
            console.log(`Кнопка нажата, загружаем: ${endpoint}`);
            const movies = await fetchMovies(endpoint);
            renderMovies(movies);
        };
    }

    // Добавляем обработчики кликов и логируем их
    if (elements.novinkiBtn) {
        elements.novinkiBtn.addEventListener("click", handleCategoryClick("/movie/now_playing"));
        console.log("Обработчик для 'Новинки' добавлен");
    }
    if (elements.popularBtn) {
        elements.popularBtn.addEventListener("click", handleCategoryClick("/movie/popular"));
        console.log("Обработчик для 'Популярное' добавлен");
    }
    if (elements.topBtn) {
        elements.topBtn.addEventListener("click", handleCategoryClick("/movie/top_rated"));
        console.log("Обработчик для 'Топ рейтинга' добавлен");
    }

    function getLangFromURL() {
        return new URLSearchParams(window.location.search).get("lang") || "ru";
    }

    function applyTranslations(lang) {
        const translations = {
            ru: { 
                title: "Давай найдем фильм вместе!", 
                search: "Подбор", 
                filters: "Фильтры", 
                searchBtn: "Поиск",
                novinki: "Новинки",
                popular: "Популярное",
                top: "Топ рейтинга"
            },
            en: { 
                title: "Let's find a movie together!", 
                search: "Find", 
                filters: "Filters", 
                searchBtn: "Search",
                novinki: "New Releases",
                popular: "Popular",
                top: "Top Rated"
            },
            ua: { 
                title: "Давай знайдемо фільм разом!", 
                search: "Підбір", 
                filters: "Фільтри", 
                searchBtn: "Пошук",
                novinki: "Новинки",
                popular: "Популярне",
                top: "Топ рейтингу"
            },
        };
        const t = translations[lang] || translations.ru;

        const titleElement = document.querySelector("h1");
        if (titleElement) titleElement.textContent = t.title;

        if (elements.searchBtn) elements.searchBtn.textContent = t.search;

        const modalTitle = document.querySelector(".modal-content h2");
        if (modalTitle) modalTitle.textContent = t.filters;

        if (elements.searchMoviesBtn) elements.searchMoviesBtn.textContent = t.searchBtn;

        if (elements.novinkiBtn) elements.novinkiBtn.textContent = t.novinki;
        if (elements.popularBtn) elements.popularBtn.textContent = t.popular;
        if (elements.topBtn) elements.topBtn.textContent = t.top;
    }

    applyTranslations(getLangFromURL());

    // Загружаем популярные фильмы при старте страницы
    handleCategoryClick("/movie/popular")();
};
