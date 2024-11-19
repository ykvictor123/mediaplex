const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// Configurar CORS
app.use(cors());

// URL de la API de Hydrax
const API_URL = 'https://mediaplex.vercel.app/api/movies';

// Endpoint para obtener la lista de películas
app.get('/api/movies', async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exportar la app de Express
module.exports = app;
