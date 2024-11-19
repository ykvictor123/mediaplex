import fetch from "node-fetch";

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
        // Agregar las películas de la página actual a la lista completa
        allMovies.push(...data.items);

        // Verificar si hay más páginas
        if (data.pagination && data.pagination.next) {
          currentPage = data.pagination.next;
        } else {
          hasNextPage = false; // No hay más páginas
        }
      } else {
        hasNextPage = false; // Detener si no hay datos
      }
    }

    // Enviar la lista completa de películas
    res.status(200).json({ items: allMovies });
  } catch (error) {
    console.error("Error al obtener las películas de Hydrax:", error);
    res.status(500).json({ status: false, msg: "Error al cargar las películas." });
  }
}
