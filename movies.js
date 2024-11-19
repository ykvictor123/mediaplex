export default async function handler(req, res) {
  const baseUrl = "https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list";
  const page = parseInt(req.query.page) || 1;
  const fullData = [];
  let currentPage = page;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const response = await fetch(`${baseUrl}?page=${currentPage}`);
      const data = await response.json();

      if (data.status && data.items) {
        fullData.push(...data.items);

        // Si hay más páginas, continúa
        if (data.pagination && data.pagination.next > currentPage) {
          currentPage = data.pagination.next;
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }

    res.status(200).json({ items: fullData });
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    res.status(500).json({ status: false, msg: "Error al cargar las películas." });
  }
}
