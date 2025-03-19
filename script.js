document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const filterModal = document.getElementById("filterModal");
    const searchMoviesBtn = document.getElementById("searchMoviesBtn");

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
});
