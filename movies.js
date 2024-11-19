// movies.js en la carpeta /api
export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 1; // P�gina solicitada
  const limit = 10; // N�mero de pel�culas por p�gina
  const offset = (page - 1) * limit; // Calcular el desplazamiento

  // Aqu� simulas los datos (puedes conectar a una base de datos o API real)
  const movies = [
    { name: "Pel�cula 1", slug: "movie1", resolution: "1080p", status: "Ready" },
    { name: "Pel�cula 2", slug: "movie2", resolution: "720p", status: "Ready" },
    // Agrega m�s pel�culas seg�n sea necesario
  ];

  // Paginar las pel�culas
  const paginatedMovies = movies.slice(offset, offset + limit);

  // Respuesta
  res.status(200).json({
    items: paginatedMovies,
    page: page,
    hasMore: offset + limit < movies.length, // Si hay m�s pel�culas
  });
}
