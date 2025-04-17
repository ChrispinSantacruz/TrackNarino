const express = require('express');
const router = express.Router();
const { obtenerRutaORS } = require('../services/orsService');
const verificarToken = require('../middleware/authMiddleware');

// POST /api/ors/ruta
router.post('/ruta', verificarToken, async (req, res) => {
  const { origen, destino } = req.body;

  // origen y destino deben ser arrays: [longitud, latitud]
  if (!Array.isArray(origen) || !Array.isArray(destino)) {
    return res.status(400).json({ error: 'origen y destino deben ser arrays [lng, lat]' });
  }

  const resultado = await obtenerRutaORS(origen, destino);

  if (resultado.error) {
    return res.status(500).json({ error: resultado.error });
  }

  res.json(resultado);
});

module.exports = router;
