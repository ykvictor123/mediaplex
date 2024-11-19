export default async function handler(req, res) {
  const baseUrl = "https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list";
  const allMovies = [];
  let currentPage = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const response = await fetch(`${baseUrl}?page=${currentPage}`);
      const data = await response.json();

      if (data.status && data.items && data.items.length > 0) {
        // Agregar películas a la lista total
        allMovies.push(...data.items);

        // Determinar si hay una siguiente página
        if (data.pagination && data.pagination.next > currentPage) {
          currentPage = data.pagination.next;
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }

    // Devolver todas las películas al cliente
    res.status(200).json({ items: allMovies });
  } catch (error) {
    console.error("Error al obtener las películas de Hydrax:", error);
    res.status(500).json({ status: false, msg: "Error al cargar las películas." });
  }
}
