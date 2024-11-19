const API_URL = 'https://mediaplex.vercel.app/api/movies';
const TMDB_API_KEY = '708a2826cbb3c7dbd79b10c569049f54';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Función para cargar películas
async function fetchMovies() {
  const response = await fetch(API_URL);
  const { items } = await response.json();
  items.forEach(async (movie) => {
    const poster = await fetchPoster(movie.name);
    displayMovie(movie, poster);
  });
}

// Buscar póster automáticamente
async function fetchPoster(movieName) {
  const title = movieName.match(/^(.*?)\s\(\d{4}\)/)?.[1] || movieName;
  const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
  const { results } = await response.json();
  return results[0]?.poster_path ? `${TMDB_IMAGE_URL}${results[0].poster_path}` : 'default-poster.jpg';
}

// Mostrar películas en la cuadrícula
function displayMovie(movie, poster) {
  const mediaGrid = document.getElementById('mediaGrid');
  const item = document.createElement('div');
  item.className = 'media-item';
  item.innerHTML = `
    <img src="${poster}" alt="${movie.name}">
    <h3>${movie.name}</h3>
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
    player.src = '';
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', fetchMovies);
