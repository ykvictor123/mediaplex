const API_URL = 'https://mediaplex.vercel.app/api/movies';
const TMDB_API_KEY = '708a2826cbb3c7dbd79b10c569049f54';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

let allMovies = []; // Lista completa de películas

// Cargar todas las páginas de la API
async function fetchAllMovies() {
  const mediaGrid = document.getElementById('mediaGrid');
  mediaGrid.innerHTML = 'Cargando películas...';

  try {
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetch(`${API_URL}?page=${page}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        allMovies.push(...data.items);
        page += 1; // Siguiente página
        hasMorePages = data.pagination && data.pagination.next; // ¿Hay más páginas?
      } else {
        hasMorePages = false; // No más datos
      }
    }

    mediaGrid.innerHTML = ''; // Limpiar el contenedor
    allMovies.forEach((movie) => displayMovie(movie)); // Mostrar todas las películas
  } catch (error) {
    mediaGrid.innerHTML = '<p>Error al cargar las películas.</p>';
    console.error(error);
  }
}

// Buscar portadas y metadatos en TMDB
async function fetchMetadata(name) {
  const title = name.split('(')[0].trim();
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      return {
        title: movie.title || name,
        poster: movie.poster_path
          ? `${TMDB_IMAGE_URL}${movie.poster_path}`
          : 'https://via.placeholder.com/150',
      };
    }
  } catch (error) {
    console.error('Error al buscar metadatos:', error);
  }

  // Si falla, devolver valores predeterminados
  return { title: name, poster: 'https://via.placeholder.com/150' };
}

// Mostrar película en la cuadrícula
async function displayMovie(movie) {
  const mediaGrid = document.getElementById('mediaGrid');
  const metadata = await fetchMetadata(movie.name);

  const item = document.createElement('div');
  item.className = 'media-item';
  item.innerHTML = `
    <img src="${metadata.poster}" alt="${movie.name}">
    <h3>${metadata.title}</h3>
  `;
  item.addEventListener('click', () => playMovie(movie.slug, metadata.title));
  mediaGrid.appendChild(item);
}

// Reproducir película
function playMovie(slug, title) {
  const player = document.getElementById('player');
  const modal = document.getElementById('playerModal');

  player.src = `https://short.ink/${slug}`;
  modal.style.display = 'block';

  document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    player.src = '';
  });
}

// Cargar todas las películas al iniciar
document.addEventListener('DOMContentLoaded', fetchAllMovies);
