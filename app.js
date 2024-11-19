const API_KEY = "708a2826cbb3c7dbd79b10c569049f54";
const API_BASE = "https://api.themoviedb.org/3/search/movie";

async function fetchMovies() {
  const movieGrid = document.getElementById("movie-grid");
  const loadingSpinner = document.getElementById("loading-spinner");

  try {
    // API para obtener la lista de películas
    const response = await fetch('/api/movies');
    const { items } = await response.json();

    // Limpia el spinner y renderiza
    loadingSpinner.style.display = "none";

    items.forEach(async (movie) => {
      const posterUrl = await fetchPoster(movie.name);
      const movieCard = createMovieCard(movie, posterUrl);
      movieGrid.appendChild(movieCard);
    });
  } catch (error) {
    movieGrid.innerHTML = `<p>Error al cargar las películas: ${error.message}</p>`;
  }
}

async function fetchPoster(movieName) {
  try {
    const response = await fetch(`${API_BASE}?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`);
    const data = await response.json();
    return data.results[0]?.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`
      : "default-poster.jpg"; // Imagen por defecto
  } catch (error) {
    console.error("Error al obtener el póster:", error);
    return "default-poster.jpg";
  }
}

function createMovieCard(movie, posterUrl) {
  const card = document.createElement("div");
  card.className = "movie-card";

  card.innerHTML = `
    <img src="${posterUrl}" alt="${movie.name}" class="movie-poster">
    <h3>${movie.name}</h3>
    <p>Resolución: ${movie.resolution}p</p>
    <p>Tamaño: ${(movie.size / 1e9).toFixed(2)} GB</p>
  `;

  return card;
}

// Filtrar las películas
document.getElementById("filter-btn").addEventListener("click", () => {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const resolution = document.getElementById("resolution-filter").value;

  const allMovies = document.querySelectorAll(".movie-card");
  allMovies.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const res = card.querySelector("p:nth-of-type(1)").textContent;

    if (
      (!searchTerm || title.includes(searchTerm)) &&
      (!resolution || res.includes(resolution))
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

fetchMovies();
