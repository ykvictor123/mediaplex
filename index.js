const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Importar CORS
const app = express();

// Habilitar CORS para todos los dominios
app.use(cors());

// URL de la API de Hydrax
const API_URL = 'https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list';

// Endpoint para obtener la lista de videos
app.get('/api/videos', async (req, res) => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            return res.status(response.status).json({ error: `Error de la API: ${response.statusText}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Exportar la app de Express para que Vercel la use
module.exports = app;
