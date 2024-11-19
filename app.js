const API_URL = 'https://mediaplex.vercel.app/api/movies';
const TMDB_API_KEY = '708a2826cbb3c7dbd79b10c569049f54';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

let allMovies = []; // Lista completa de películas
let currentCategory = ''; // Categoría actual seleccionada

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
  const match = movieName.match(/^(.*?)\s\(\d{4}\)/);
  return match ? match[1].trim() : movieName;
}

// Buscar automáticamente el póster y géneros
async function fetchPosterAndMetadata(movieName) {
  const title = extractTitle(movieName);
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
    const data = await response.json();
    const result = data.results[0];
    return {
      poster: result?.poster_path ? `${TMDB_IMAGE_URL}${result.poster_path}` : 'default-poster.jpg',
      genres: result?.genre_ids || []
    };
  } catch (error) {
    console.error('Error al buscar el póster y metadatos:', error);
    return { poster: 'default-poster.jpg', genres: [] };
  }
}

// Cargar todas las películas con categorías y pósters
async function fetchAllMovies() {
  const mediaGrid = document.getElementById('mediaGrid');
  const genreList = document.getElementById('genreList');
  mediaGrid.innerHTML = ''; // Limpiar el contenedor
  genreList.innerHTML = '<li class="genre-header">Categorías</li>'; // Resetear categorías
  let page = 1;
  let hasMorePages = true;
  const genresSet = new Set();

  while (hasMorePages) {
    try {
      const response = await fetch(`${API_URL}?page=${page}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        for (const movie of data.items) {
          const savedPoster = getSavedPoster(movie.slug);
          const { poster, genres } = savedPoster ? { poster: savedPoster, genres: [] } : await fetchPosterAndMetadata(movie.name);
          genres.forEach((genre) => genresSet.add(genre)); // Agregar géneros únicos
          movie.poster = poster;
          movie.genres = genres; // Guardar géneros en la película
          allMovies.push(movie); // Agregar a la lista completa
          if (!currentCategory || movie.genres.includes(currentCategory)) {
            displayMovie(movie, poster);
          }
        }
        page += 1;
      } else {
        hasMorePages = false;
      }
    } catch (error) {
      console.error(`Error al cargar las películas de la página ${page}:`, error);
      hasMorePages = false;
    }
  }

  // Mostrar las categorías en la barra lateral
  genresSet.forEach((genre) => {
    const li = document.createElement('li');
    li.className = 'genre-item';
    li.textContent = genre; // Usar el nombre del género
    li.addEventListener('click', () => filterByGenre(genre));
    genreList.appendChild(li);
  });
}

// Mostrar películas en la cuadrícula
function displayMovie(movie, poster) {
  const mediaGrid = document.getElementById('mediaGrid');
  const item = document.createElement('div');
  item.className = 'media-item';
  item.innerHTML = `
    <img src="${poster}" alt="${movie.name}">
    <h3>${movie.name}</h3>
    <button class="manual-search-btn" data-id="${movie.slug}" data-name="${movie.name}">Buscar Portada</button>
  `;
  item.addEventListener('click', () => playMovie(movie.slug, movie.name));
  mediaGrid.appendChild(item);
}

// Filtrar por categoría
function filterByGenre(genre) {
  currentCategory = genre;
  const mediaGrid = document.getElementById('mediaGrid');
  mediaGrid.innerHTML = ''; // Limpiar el contenedor
  allMovies
    .filter((movie) => movie.genres.includes(genre))
    .forEach((movie) => displayMovie(movie, movie.poster));
}

// Reproducir película
function playMovie(slug, title) {
  const modal = document.getElementById('playerModal');
  const player = document.getElementById('player');
  player.src = `https://short.ink/${slug}`;
  modal.style.display = 'block';

  const close = document.querySelector('.close');
  close.addEventListener('click', () => {
    modal.style.display = 'none';
    player.src = ''; // Detener la reproducción
  });
}

// Búsqueda manual de portadas
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('manual-search-btn')) {
    const movieId = event.target.getAttribute('data-id');
    const movieName = event.target.getAttribute('data-name');
    openManualSearchModal(movieName, movieId);
  }
});

function openManualSearchModal(movieName, movieId) {
  const modal = document.getElementById('manual-search-modal');
  const input = document.getElementById('manual-search-input');
  input.value = movieName;
  modal.dataset.movieId = movieId;
  modal.style.display = 'block';
}

document.getElementById('manual-search-btn').addEventListener('click', async () => {
  const query = document.getElementById('manual-search-input').value;
  const resultsDiv = document.getElementById('manual-search-results');
  resultsDiv.innerHTML = 'Buscando...';
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    resultsDiv.innerHTML = data.results
      .map(
        (movie) =>
          `<img src="${TMDB_IMAGE_URL}${movie.poster_path}" alt="${movie.title}" onclick="selectPoster('${movie.poster_path}')">`
      )
      .join('');
  } catch (error) {
    console.error('Error en la búsqueda manual:', error);
    resultsDiv.innerHTML = '<p>Error al buscar portadas.</p>';
  }
});

function selectPoster(posterPath) {
  const modal = document.getElementById('manual-search-modal');
  const movieId = modal.dataset.movieId;
  const card = document.querySelector(`.manual-search-btn[data-id="${movieId}"]`).closest('.media-item');

  const img = card.querySelector('img');
  img.src = `${TMDB_IMAGE_URL}${posterPath}`;
  savePoster(movieId, img.src); // Guardar portada seleccionada
  modal.style.display = 'none';
}

document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('manual-search-modal').style.display = 'none';
});

// Inicializar
document.addEventListener('DOMContentLoaded', fetchAllMovies);
