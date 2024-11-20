const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const API_URL = 'https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Error al obtener datos: ${response.statusText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
