const express = require('express');
const router = express.Router();
const Oportunidad = require('../models/Oportunidad');
const verificarToken = require('../middleware/authMiddleware');
const soloRol = require('../middleware/rolMiddleware');

// Camionero ve su historial de cargas
router.get('/camionero', verificarToken, soloRol('camionero'), async (req, res) => {
  try {
    const cargas = await Oportunidad.find({
      camioneroAsignado: req.usuario.id
    }).populate('contratista', 'nombre correo');

    res.json(cargas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial de cargas del camionero' });
  }
});

// Contratista ve su historial de asignaciones
router.get('/contratista', verificarToken, soloRol('contratista'), async (req, res) => {
  try {
    const cargas = await Oportunidad.find({
      contratista: req.usuario.id
    }).populate('camioneroAsignado', 'nombre correo');

    res.json(cargas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial del contratista' });
  }
});

// Finalizar carga
router.post('/finalizar/:id', verificarToken, soloRol('contratista'), async (req, res) => {
  try {
    const carga = await Oportunidad.findById(req.params.id);

    if (!carga || carga.contratista.toString() !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permisos para finalizar esta carga' });
    }

    carga.estado = 'finalizada';
    carga.finalizada = true;
    await carga.save();

    res.json({ mensaje: 'Carga finalizada correctamente', carga });
  } catch (error) {
    res.status(500).json({ error: 'Error al finalizar la carga' });
  }
});

module.exports = router;
