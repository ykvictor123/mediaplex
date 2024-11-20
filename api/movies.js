export default async function handler(req, res) {
  const baseUrl = "https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list";

  try {
    const response = await fetch(baseUrl);
    const data = await response.json();

    if (data.status && data.items) {
      res.status(200).json({ items: data.items });
    } else {
      res.status(200).json({ items: [] });
    }
  } catch (error) {
    console.error("Error al obtener las películas:", error);
    res.status(500).json({ status: false, msg: "Error al cargar las películas." });
  }
}
