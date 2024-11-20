// URL del backend en Vercel
const API_URL = 'https://mediaplex.vercel.app/api/movies';
const API_KEY = "708a2826cbb3c7dbd79b10c569049f54";
const TMDB_API_BASE = "https://api.themoviedb.org/3/search/movie";

// Guardar portadas seleccionadas en Local Storage
function savePoster(movieId, posterUrl) {
  const savedPosters = JSON.parse(localStorage.getItem('savedPosters')) || {};
  savedPosters[movieId] = posterUrl;
  localStorage.setItem('savedPosters', JSON.stringify(savedPosters));
}

// Recuperar portadas seleccionadas de Local Storage
function getSavedPoster(movieId) {
  const savedPosters = JSON.parse(localStorage.getItem('savedPosters')) || {};
  return savedPosters[movieId] || null;
}

// Extraer título antes del año en paréntesis
function extractTitle(movieName) {
  const match = movieName.match(/^(.*?)\s\(\d{4}\)/); // Buscar "Título (Año)"
  return match ? match[1].trim() : movieName; // Devolver el título o el nombre completo si no se encuentra
}

// Buscar automáticamente el póster basado en el título
async function fetchPoster(movieName) {
  const title = extractTitle(movieName); // Extraer título para una búsqueda más precisa
  try {
    const response = await fetch(`${TMDB_API_BASE}?api_key=${API_KEY}&query=${encodeURIComponent(title)}`);
    const data = await response.json();
    return data.results[0]?.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`
      : "default-poster.jpg"; // Imagen por defecto
  } catch (error) {
    console.error("Error al obtener el póster:", error);
    return "default-poster.jpg";
  }
}

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
        const savedPoster = getSavedPoster(movie.slug); // Recuperar póster guardado
        const posterUrl = savedPoster || await fetchPoster(movie.name); // Buscar automáticamente si no está guardado
        const movieCard = createMovieCard(movie, posterUrl);
        movieGrid.appendChild(movieCard);
      }
    });
  } catch (error) {
    console.error(error);
    movieGrid.innerHTML = `<p>Error al cargar las películas: ${error.message}</p>`;
  }
}

function createMovieCard(movie, posterUrl) {
  const card = document.createElement("div");
  card.className = "movie-card";

  card.innerHTML = `
    <img src="${posterUrl}" alt="${movie.name}" class="movie-poster">
    <h3>${movie.name}</h3>
    <p>Resolución: ${movie.resolution}p</p>
    <button class="play-button" onclick="playMovie('${movie.slug}', '${movie.name}')">Reproducir</button>
    <button class="manual-search-btn" data-name="${movie.name}" data-id="${movie.slug}">Buscar Portada</button>
  `;

  return card;
}

function playMovie(slug, title) {
  const playerContainer = document.getElementById("player-container");
  const moviePlayer = document.getElementById("movie-player");
  const playerTitle = document.getElementById("player-title");

  playerTitle.textContent = `Reproduciendo: ${title}`;
  moviePlayer.src = `https://short.ink/${slug}`;
  playerContainer.classList.remove("hidden");
}

// Cerrar el reproductor
document.getElementById("close-player-btn").addEventListener("click", () => {
  const playerContainer = document.getElementById("player-container");
  const moviePlayer = document.getElementById("movie-player");

  moviePlayer.src = ""; // Detener la reproducción
  playerContainer.classList.add("hidden");
});

// Búsqueda manual de portadas
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("manual-search-btn")) {
    const movieName = event.target.getAttribute("data-name");
    const movieId = event.target.getAttribute("data-id");
    openManualSearchModal(movieName, movieId);
  }
});

function openManualSearchModal(movieName = "", movieId) {
  const modal = document.getElementById("manual-search-modal");
  const input = document.getElementById("manual-search-input");
  input.value = movieName;
  modal.dataset.movieId = movieId; // Guardar el ID de la película
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
  const movieId = modal.dataset.movieId;
  const card = document.querySelector(`.manual-search-btn[data-id="${movieId}"]`).closest(".movie-card");

  const img = card.querySelector(".movie-poster");
  img.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
  savePoster(movieId, img.src); // Guardar la portada seleccionada en Local Storage
  modal.style.display = "none";
}

document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("manual-search-modal").style.display = "none";
});

// Iniciar la carga de películas
fetchMovies();
