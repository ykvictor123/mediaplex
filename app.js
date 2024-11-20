// URL de la API de Hydrax
const API_URL = 'https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list';

// Función para cargar las películas
async function fetchMovies() {
  const movieGrid = document.getElementById('movie-grid');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error al cargar las películas: ${response.status}`);
    }

    const data = await response.json();
    movieGrid.innerHTML = ''; // Limpiar contenido previo

    data.items.forEach((movie) => {
      // Crear tarjeta para cada película
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';

      // Información de la película
      movieCard.innerHTML = `
        <h3>${movie.name}</h3>
        <p class="movie-resolution">Resolución: ${movie.resolution || 'N/A'}p</p>
        <p class="movie-size">Tamaño: ${(movie.size / 1e9).toFixed(2)} GB</p>
        <p class="movie-status">Estado: ${movie.status}</p>
      `;

      // Agregar tarjeta al contenedor
      movieGrid.appendChild(movieCard);
    });
  } catch (error) {
    console.error('Error al cargar las películas:', error);
    movieGrid.innerHTML = '<p>No se pudieron cargar las películas. Intenta de nuevo más tarde.</p>';
  }
}

// Cargar películas al iniciar la página
fetchMovies();
