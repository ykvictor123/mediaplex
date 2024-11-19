// movies.js en la carpeta /api
export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 1; // Página solicitada
  const limit = 10; // Número de películas por página
  const offset = (page - 1) * limit; // Calcular el desplazamiento

  // Aquí simulas los datos (puedes conectar a una base de datos o API real)
  const movies = [
    { name: "Película 1", slug: "movie1", resolution: "1080p", status: "Ready" },
    { name: "Película 2", slug: "movie2", resolution: "720p", status: "Ready" },
    // Agrega más películas según sea necesario
  ];

  // Paginar las películas
  const paginatedMovies = movies.slice(offset, offset + limit);

  // Respuesta
  res.status(200).json({
    items: paginatedMovies,
    page: page,
    hasMore: offset + limit < movies.length, // Si hay más películas
  });
}
