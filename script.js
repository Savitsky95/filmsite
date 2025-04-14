document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '035a42c2ee22ee951b6e6b2845a82552';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const searchBtn = document.getElementById('searchBtn');
  const filterModal = document.getElementById('filterModal');
  const closeModal = document.querySelector('.close-btn');
  const movieList = document.getElementById('moviesContainer');
  const categoryButtons = document.querySelectorAll('nav ul li button');

  // Переводы для разных языков
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
          searchMoviesBtn: "Поиск"
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
          searchMoviesBtn: "Search"
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
          searchMoviesBtn: "Пошук"
      }
  };

  // Получаем язык из параметра URL
  function getLangFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('lang') || 'ru';  // Если нет параметра, по умолчанию русский
  }

  // Применяем переводы на основе выбранного языка
  function applyTranslations(lang) {
      const translation = translations[lang];

      document.getElementById('pageTitle').textContent = translation.pageTitle;
      document.getElementById('novinkiBtn').textContent = translation.novinkiBtn;
      document.getElementById('popularBtn').textContent = translation.popularBtn;
      document.getElementById('topBtn').textContent = translation.topBtn;
      document.getElementById('searchBtn').textContent = translation.searchBtn;
      document.getElementById('filtersTitle').textContent = translation.filtersTitle;
      document.getElementById('typeLabel').textContent = translation.typeLabel;
      document.getElementById('genreLabel').textContent = translation.genreLabel;
      document.getElementById('yearLabel').textContent = translation.yearLabel;
      document.getElementById('searchMoviesBtn').textContent = translation.searchMoviesBtn;
  }

  // Открытие модального окна
  searchBtn.addEventListener('click', () => {
      filterModal.style.display = 'flex';
  });

  // Закрытие модального окна
  closeModal.addEventListener('click', () => {
      filterModal.style.display = 'none';
  });

  // Закрытие модального окна при клике вне его области
  window.addEventListener('click', (event) => {
      if (event.target === filterModal) {
          filterModal.style.display = 'none';
      }
  });

  // Поиск по фильтру
  const searchMoviesBtn = document.getElementById('searchMoviesBtn');
  searchMoviesBtn.addEventListener('click', () => {
      const type = document.getElementById('type').value;
      const genre = document.getElementById('genre').value;
      const year = document.getElementById('year').value;

      let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=${getLangFromUrl()}`;

      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&primary_release_year=${year}`;

      fetch(url)
          .then((response) => response.json())
          .then((data) => {
              displayMovies(data.results);
              filterModal.style.display = 'none';
          })
          .catch((error) => console.error('Ошибка получения фильмов:', error));
  });

  // Загрузка фильмов по категориям
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
      let url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=${getLangFromUrl()}&page=1`;

      fetch(url)
          .then((response) => response.json())
          .then((data) => {
              displayMovies(data.results);
          })
          .catch((error) => console.error('Ошибка загрузки фильмов:', error));
  }

  // Отображение фильмов
  function displayMovies(movies) {
      movieList.innerHTML = '';

      if (!movies || movies.length === 0) {
          movieList.innerHTML = '<p>Фильмы не найдены.</p>';
          return;
      }

      movies.forEach((movie) => {
          const movieItem = document.createElement('div');
          movieItem.classList.add('movie-item');
          movieItem.innerHTML = `
              <a href="movie-details.html?id=${movie.id}">
                  <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
              </a>
              <h3>${movie.title}</h3>
              <p>Рейтинг: ${movie.vote_average}</p>
              <p>${movie.overview || "Нет описания"}</p>
              <p>Дата выхода: ${movie.release_date || "Неизвестно"}</p>
          `;
          movieList.appendChild(movieItem);
      });
  }

  // Применяем язык в зависимости от параметра URL
  const lang = getLangFromUrl();
  applyTranslations(lang);
});
