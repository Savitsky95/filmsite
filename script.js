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

  function createMovieCard(movie) {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie');
      
      movieItem.innerHTML = `
          <a href="movie-details.html?id=${movie.id}" class="movie-link">
              <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'placeholder.jpg'}" 
                   alt="${movie.title || movie.original_title}">
              <h3>${movie.title || movie.original_title}</h3>
              <p>Рейтинг: ${movie.vote_average}</p>
              <p>${movie.overview || "Нет описания"}</p>
              <p>Дата выхода: ${movie.release_date || "Неизвестно"}</p>
          </a>
      `;
      
      return movieItem;
  }

  function displayMovies(movies) {
      movieList.innerHTML = '';
      if (!movies || movies.length === 0) {
          movieList.innerHTML = `<p>${translations[lang].notFound}</p>`;
          return;
      }
      
      showLoader();
      
      movies.forEach((movie) => {
          const movieElement = createMovieCard(movie);
          movieList.appendChild(movieElement);
      });
      
      setTimeout(() => {
          const loader = document.querySelector('.loader');
          if (loader) loader.remove();
      }, 500);
  }

  function fetchMovies(category = null, type = null, genre = null, year = null) {
      let url = `${BASE_URL}/discover/${type || 'movie'}?api_key=${API_KEY}&language=${lang}`;
      
      if (category) {
          const categoryMap = {
              novinki: 'upcoming',
              popular: 'popular',
              top: 'top_rated'
          };
          url = `${BASE_URL}/movie/${categoryMap[category]}?api_key=${API_KEY}&language=${lang}&page=1`;
      }
      
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&primary_release_year=${year}`;
      
      showLoader();
      
      return fetch(url)
          .then(res => res.json())
          .then(data => {
              displayMovies(data.results);
              return data;
          })
          .catch(err => {
              console.error('Ошибка загрузки фильмов:', err);
              displayMovies([]);
          });
  }

  function showLoader() {
      movieList.innerHTML = '<div class="loader">' + translations[lang].loading + '</div>';
  }

  const lang = new URLSearchParams(window.location.search).get('lang') || 'ru';
  
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

  document.getElementById('searchMoviesBtn').addEventListener('click', async () => {
      const type = document.getElementById('type').value;
      const genre = document.getElementById('genre').value;
      const year = document.getElementById('year').value;
      
      try {
          await fetchMovies(null, type, genre, year);
          filterModal.style.display = 'none';
      } catch (error) {
          console.error('Ошибка поиска фильмов:', error);
      }
  });

  categoryButtons.forEach((button) => {
      button.addEventListener('click', async () => {
          const categoryId = button.id.replace('Btn', '').toLowerCase();
          try {
              await fetchMovies(categoryId);
          } catch (error) {
              console.error('Ошибка загрузки категории:', error);
          }
      });
  });

  applyTranslations(lang);
});