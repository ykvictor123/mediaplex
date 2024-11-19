const API_URL = 'https://mediaplex.vercel.app/api/movies';
const API_KEY = "708a2826cbb3c7dbd79b10c569049f54";
const TMDB_API_BASE = "https://api.themoviedb.org/3/search/movie";

async function fetchMovies() {
  const movieGrid = document.getElementById("movie-grid");
  const loadingSpinner = document.getElementById("loading-spinner");

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error al cargar las películas: ${response.status}`);
    }

    const { items } = await response.json();
    loadingSpinner.style.display = "none";

    items.forEach(async (movie) => {
      if (movie.status === "Ready") {
        const posterUrl = await fetchPoster(movie.name);
        const movieCard = createMovieCard(movie, posterUrl);
        movieGrid.appendChild(movieCard);
      }
    });
  } catch (error) {
    console.error(error);
    movieGrid.innerHTML = `<p>Error al cargar las películas: ${error.message}</p>`;
  }
}

async function fetchPoster(movieName) {
  try {
    const response = await fetch(`${TMDB_API_BASE}?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`);
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
    <button class="play-button" onclick="playMovie('${movie.slug}')">Reproducir</button>
    <button class="play-button manual-search-btn" data-name="${movie.name}">Buscar Portada</button>
  `;

  return card;
}

function playMovie(slug) {
  const playerUrl = `https://short.ink/${slug}`;
  window.open(playerUrl, "_blank");
}

// Búsqueda manual de portadas
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("manual-search-btn")) {
    const movieName = event.target.getAttribute("data-name");
    openManualSearchModal(movieName);
  }
});

function openManualSearchModal(movieName = "") {
  const modal = document.getElementById("manual-search-modal");
  const input = document.getElementById("manual-search-input");
  input.value = movieName;
  modal.style.display = "block";
}

document.getElementById("manual-search-btn").addEventListener("click", async () => {
  const query = document.getElementById("manual-search-input").value;
  const resultsDiv = document.getElementById("manual-search-results");
  resultsDiv.innerHTML = "Buscando...";
  try {
    const response = await fetch(`${TMDB_API_BASE}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    resultsDiv.innerHTML = data.results
      .map(
        (movie) =>
          `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" title="${movie.title}" onclick="selectPoster('${movie.poster_path}')">`
      )
      .join("");
  } catch (error) {
    console.error("Error en la búsqueda manual:", error);
    resultsDiv.innerHTML = "<p>Error al buscar portadas.</p>";
  }
});

function selectPoster(posterPath) {
  const modal = document.getElementById("manual-search-modal");
  modal.style.display = "none";
  alert(`Has seleccionado esta portada: ${posterPath}`);
}

document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("manual-search-modal").style.display = "none";
});

fetchMovies();
