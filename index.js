const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const API_URL = "https://api.hydrax.net/e7646a082cbb83e67d59d25ea3b0f592/list";

app.get("/api/movies", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las películas", error });
  }
});

module.exports = app;
