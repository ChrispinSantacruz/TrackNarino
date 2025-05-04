const express = require('express');
const router = express.Router();
const AlertaSeguridad = require('../models/AlertaSeguridad');
const verificarToken = require('../middleware/authMiddleware');

// Crear una alerta
router.post('/crear', verificarToken, async (req, res) => {
  try {
    const { tipo, descripcion, coords } = req.body;

    const alerta = new AlertaSeguridad({
      tipo,
      descripcion,
      coords,
      usuario: req.usuario.id
    });

    await alerta.save();

    res.status(201).json({ mensaje: 'Alerta registrada con éxito', alerta });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la alerta' });
  }
});

// Listar alertas recientes (máx 50)
router.get('/listar', async (req, res) => {
  try {
    const alertas = await AlertaSeguridad.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('usuario', 'nombre tipoUsuario');
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las alertas' });
  }
});

// Listar alertas cercanas a una ubicación (lat, lng, radio en metros)
router.get('/cercanas', async (req, res) => {
  try {
    const { lat, lng, radio } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitud y longitud son obligatorios' });
    }

    const centro = {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };

    const rangoMetros = radio ? parseFloat(radio) : 5000;

    const todas = await AlertaSeguridad.find();

    const cercanas = todas.filter(alerta => {
      if (!alerta.coords) return false;

      const distancia = haversine(centro, {
        lat: alerta.coords.lat,
        lng: alerta.coords.lng
      });

      return distancia <= rangoMetros;
    });

    res.json(cercanas);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar alertas cercanas' });
  }
});

module.exports = router;
