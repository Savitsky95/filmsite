document.addEventListener("DOMContentLoaded", () => {
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

    // Инициализация модального окна
    elements.filterModal.style.display = "none";

    elements.searchBtn.addEventListener("click", () => toggleModal(true));
    elements.closeModalBtn.addEventListener("click", () => toggleModal(false));
    window.addEventListener("click", (event) => {
        if (event.target === elements.filterModal) toggleModal(false);
    });

    function toggleModal(show) {
        elements.filterModal.style.display = show ? "flex" : "none";
    }

    async function fetchMovies(endpoint) {
        try {
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
            const movies = await fetchMovies(endpoint);
            renderMovies(movies);
        };
    }

    elements.novinkiBtn.addEventListener("click", handleCategoryClick("/movie/now_playing"));
    elements.popularBtn.addEventListener("click", handleCategoryClick("/movie/popular"));
    elements.topBtn.addEventListener("click", handleCategoryClick("/movie/top_rated"));

    function getLangFromURL() {
        return new URLSearchParams(window.location.search).get("lang") || "ru";
    }

    function applyTranslations(lang) {
        const translations = {
            ru: { title: "Давай найдем фильм вместе!", search: "Подбор", filters: "Фильтры", searchBtn: "Поиск" },
            en: { title: "Let's find a movie together!", search: "Find", filters: "Filters", searchBtn: "Search" },
            ua: { title: "Давай знайдемо фільм разом!", search: "Підбір", filters: "Фільтри", searchBtn: "Пошук" },
        };
        const t = translations[lang] || translations.ru;
        document.querySelector("h1").textContent = t.title;
        elements.searchBtn.textContent = t.search;
        document.querySelector(".modal-content h2").textContent = t.filters;
        elements.searchMoviesBtn.textContent = t.searchBtn;
    }

    applyTranslations(getLangFromURL());
});
