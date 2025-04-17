const express = require('express');
const router = express.Router();
const Oportunidad = require('../models/Oportunidad');
const User = require('../models/User');
const verificarToken = require('../middleware/authMiddleware');
const soloRol = require('../middleware/rolMiddleware');
const { enviarNotificacionFCM } = require('../services/fcmService');

// Crear oportunidad (solo contratista)
router.post('/crear', verificarToken, soloRol('contratista'), async (req, res) => {
  try {
    const oportunidad = new Oportunidad({
      ...req.body,
      contratista: req.usuario.id
    });
    await oportunidad.save();
    res.status(201).json({ mensaje: 'Oportunidad creada', oportunidad });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear oportunidad' });
  }
});

// Listar oportunidades disponibles (pueden verlas todos los autenticados)
router.get('/disponibles', verificarToken, async (req, res) => {
  try {
    const oportunidades = await Oportunidad.find({ estado: 'disponible' })
      .populate('contratista', 'nombre correo');
    res.json(oportunidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar oportunidades' });
  }
});

// Asignar camionero a oportunidad (solo contratista)
router.post('/asignar/:id', verificarToken, soloRol('contratista'), async (req, res) => {
  try {
    const { camioneroId } = req.body;

    const oportunidad = await Oportunidad.findByIdAndUpdate(
      req.params.id,
      {
        camioneroAsignado: camioneroId,
        estado: 'asignada'
      },
      { new: true }
    );

    // 🔔 Enviar notificación al camionero si tiene token FCM
    const camionero = await User.findById(camioneroId);
    if (camionero?.deviceToken) {
      await enviarNotificacionFCM(
        camionero.deviceToken,
        '📦 Nueva carga asignada',
        `Te han asignado una carga de ${oportunidad.origen} a ${oportunidad.destino}.`
      );
    }

    res.json({ mensaje: 'Camionero asignado', oportunidad });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar camionero' });
  }
});

module.exports = router;
