document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '035a42c2ee22ee951b6e6b2845a82552';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const openFilterBtn = document.getElementById('searchBtn');
    const filterModal = document.getElementById('filterModal');
    const closeModal = document.querySelector('.close-btn');
    const movieList = document.getElementById('moviesContainer');
    const categoryButtons = document.querySelectorAll('nav ul li button');
  
    const translations = {
      ru: {
        pageTitle: "Давай найдем фильм вместе!",
        novinkiBtn: "Новинки",
        popularBtn: "Популярное",
        topBtn: "Топ рейтинга",
        searchBtn: "Подбор",
        filtersTitle: "Фильтры",
        typeLabel: "Тип",
        genreLabel: "Жанр",
        yearLabel: "Год",
        searchMoviesBtn: "Поиск",
        notFound: "Фильмы не найдены.",
        loading: "Загрузка..."
      },
      en: {
        pageTitle: "Let's find a movie together!",
        novinkiBtn: "New Releases",
        popularBtn: "Popular",
        topBtn: "Top Rated",
        searchBtn: "Search",
        filtersTitle: "Filters",
        typeLabel: "Type",
        genreLabel: "Genre",
        yearLabel: "Year",
        searchMoviesBtn: "Search",
        notFound: "No movies found.",
        loading: "Loading..."
      },
      ua: {
        pageTitle: "Давайте знайдемо фільм разом!",
        novinkiBtn: "Новинки",
        popularBtn: "Популярне",
        topBtn: "Топ рейтинг",
        searchBtn: "Підбір",
        filtersTitle: "Фільтри",
        typeLabel: "Тип",
        genreLabel: "Жанр",
        yearLabel: "Рік",
        searchMoviesBtn: "Пошук",
        notFound: "Фільми не знайдені.",
        loading: "Завантаження..."
      }
    };
  
    function getLangFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('lang') || 'ru';
    }
  
    const lang = getLangFromUrl();
  
    function applyTranslations(lang) {
      const t = translations[lang];
  
      document.getElementById('pageTitle').textContent = t.pageTitle;
      document.getElementById('novinkiBtn').textContent = t.novinkiBtn;
      document.getElementById('popularBtn').textContent = t.popularBtn;
      document.getElementById('topBtn').textContent = t.topBtn;
      document.getElementById('searchBtn').textContent = t.searchBtn;
      document.getElementById('filtersTitle').textContent = t.filtersTitle;
      document.getElementById('typeLabel').textContent = t.typeLabel;
      document.getElementById('genreLabel').textContent = t.genreLabel;
      document.getElementById('yearLabel').textContent = t.yearLabel;
      document.getElementById('searchMoviesBtn').textContent = t.searchMoviesBtn;
    }
  
    function showLoader() {
      movieList.innerHTML = `<p>${translations[lang].loading}</p>`;
    }
  
    function displayMovies(movies) {
      movieList.innerHTML = '';
  
      if (!movies || movies.length === 0) {
        movieList.innerHTML = `<p>${translations[lang].notFound}</p>`;
        return;
      }
  
      const movieGrid = document.createElement('div');
      movieGrid.classList.add('movie-grid');
  
      movies.forEach((movie) => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'placeholder.jpg'}" alt="${movie.title || movie.original_title}">
          </a>
          <h3>${movie.title || movie.original_title}</h3>
          <p>Рейтинг: ${movie.vote_average}</p>
          <p>${movie.overview || "Нет описания"}</p>
          <p>Дата выхода: ${movie.release_date || "Неизвестно"}</p>
        `;
        movieGrid.appendChild(movieItem);
      });
  
      movieList.appendChild(movieGrid);
    }
  
    // Open filters modal
    openFilterBtn.addEventListener('click', () => {
      filterModal.style.display = 'flex';
    });
  
    closeModal.addEventListener('click', () => {
      filterModal.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === filterModal) {
        filterModal.style.display = 'none';
      }
    });
  
    const searchMoviesBtn = document.getElementById('searchMoviesBtn');
    searchMoviesBtn.addEventListener('click', () => {
      const type = document.getElementById('type').value;
      const genre = document.getElementById('genre').value;
      const year = document.getElementById('year').value;
  
      let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=${lang}`;
  
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&primary_release_year=${year}`;
  
      showLoader();
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          displayMovies(data.results);
          filterModal.style.display = 'none';
        })
        .catch((error) => console.error('Ошибка получения фильмов:', error));
    });
  
    categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const categoryId = button.id.replace('Btn', '').toLowerCase();
        let category;
        switch (categoryId) {
          case 'novinki':
            category = 'upcoming';
            break;
          case 'popular':
            category = 'popular';
            break;
          case 'top':
            category = 'top_rated';
            break;
          default:
            return;
        }
        fetchCategoryMovies(category);
      });
    });
  
    function fetchCategoryMovies(category) {
      let url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=${lang}&page=1`;
  
      showLoader();
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          displayMovies(data.results);
        })
        .catch((error) => console.error('Ошибка загрузки фильмов:', error));
    }
  
    applyTranslations(lang);
  });
  