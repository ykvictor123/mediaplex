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
  mediaGrid.innerHTML = ''; // Limpiar el contenedor
  let page = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const response = await fetch(`${API_URL}?page=${page}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        for (const movie of data.items) {
          const savedPoster = getSavedPoster(movie.slug);
          const { poster, genres } = savedPoster ? { poster: savedPoster, genres: [] } : await fetchPosterAndMetadata(movie.name);
          movie.poster = poster;
          movie.genres = genres; // Guardar géneros en la película
          allMovies.push(movie); // Agregar a la lista completa
          displayMovie(movie, poster);
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

// Inicializar
document.addEventListener('DOMContentLoaded', fetchAllMovies);
