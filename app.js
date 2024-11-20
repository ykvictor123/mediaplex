// URL de la API de Hydrax
const API_URL = 'https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list';

// Función para cargar las películas
async function fetchMovies() {
  const movieList = document.getElementById('movie-list');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error al cargar las películas: ${response.status}`);
    }

    const data = await response.json();

    // Mostrar cada película en el contenedor
    data.items.forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.className = 'movie-item';

      movieItem.innerHTML = `
        <div class="movie-title">${movie.name}</div>
        <div class="movie-details">
          Resolución: ${movie.resolution || 'N/A'}p<br>
          Tamaño: ${(movie.size / 1e9).toFixed(2)} GB<br>
          Estado: ${movie.status}
        </div>
      `;

      movieList.appendChild(movieItem);
    });
  } catch (error) {
    console.error('Error al cargar las películas:', error);
    movieList.innerHTML = `<p>No se pudieron cargar las películas. Intenta de nuevo más tarde.</p>`;
  }
}

// Llamar a la función para cargar las películas al cargar la página
fetchMovies();
