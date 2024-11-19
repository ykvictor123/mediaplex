const API_URL = 'https://mediaplex.vercel.app/api/movies';
const TMDB_API_KEY = '708a2826cbb3c7dbd79b10c569049f54';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Obtener películas desde la API
async function fetchMovies() {
  const mediaGrid = document.getElementById('mediaGrid');
  mediaGrid.innerHTML = 'Cargando películas...';

  try {
    const response = await fetch(API_URL);
    const { items } = await response.json();

    mediaGrid.innerHTML = '';

    for (const movie of items) {
      // Buscar metadatos en TMDB
      const metadata = await fetchMetadata(movie.name);

      const item = document.createElement('div');
      item.className = 'media-item';
      item.innerHTML = `
        <img src="${metadata.poster}" alt="${movie.name}">
        <h3>${metadata.title}</h3>
      `;
      item.addEventListener('click', () => playMovie(movie.name));
      mediaGrid.appendChild(item);
    }
  } catch (error) {
    mediaGrid.innerHTML = '<p>Error al cargar las películas.</p>';
    console.error(error);
  }
}

// Obtener metadatos de TMDB
async function fetchMetadata(name) {
  try {
    const query = encodeURIComponent(name.split('(')[0]); // Extraer el título antes del año
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      return {
        title: movie.title || name,
        poster: movie.poster_path
          ? `${TMDB_IMAGE_URL}${movie.poster_path}`
          : 'https://via.placeholder.com/150', // Imagen genérica
      };
    }
  } catch (error) {
    console.error('Error al buscar metadatos:', error);
  }

  // Si falla, devolver valores predeterminados
  return { title: name, poster: 'https://via.placeholder.com/150' };
}

// Reproducir película
function playMovie(name) {
  const player = document.getElementById('player');
  const modal = document.getElementById('playerModal');

  // Insertar el iframe para reproducción
  player.src = `https://short.ink/${name}`;
  modal.style.display = 'block';

  // Cerrar modal
  document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    player.src = '';
  });
}

// Buscar manualmente portadas
document.getElementById('manual-search-btn').addEventListener('click', async () => {
  const searchInput = document.getElementById('manual-search-input').value;
  const resultsDiv = document.getElementById('manual-search-results');

  resultsDiv.innerHTML = 'Buscando...';

  const metadata = await fetchMetadata(searchInput);

  resultsDiv.innerHTML = `
    <div>
      <img src="${metadata.poster}" alt="${metadata.title}">
      <p>${metadata.title}</p>
    </div>
  `;
});

// Cargar películas al cargar la página
document.addEventListener('DOMContentLoaded', fetchMovies);
