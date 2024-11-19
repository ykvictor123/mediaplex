const API_URL = 'https://mediaplex.vercel.app/api/movies';

async function fetchMovies() {
  const mediaGrid = document.getElementById('mediaGrid');
  mediaGrid.innerHTML = 'Cargando películas...';

  try {
    const response = await fetch(API_URL);
    const { items } = await response.json();

    mediaGrid.innerHTML = '';
    items.forEach(movie => {
      const item = document.createElement('div');
      item.className = 'media-item';
      item.innerHTML = `
        <img src="https://via.placeholder.com/150" alt="${movie.name}">
        <h3>${movie.name}</h3>
      `;
      item.addEventListener('click', () => playMovie(movie.slug, movie.name));
      mediaGrid.appendChild(item);
    });
  } catch (error) {
    mediaGrid.innerHTML = '<p>Error al cargar las películas.</p>';
    console.error(error);
  }
}

function playMovie(slug, name) {
  const player = document.getElementById('player');
  const modal = document.getElementById('playerModal');

  player.src = `https://short.ink/${slug}`;
  modal.style.display = 'block';

  document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    player.src = '';
  });
}

document.addEventListener('DOMContentLoaded', fetchMovies);
