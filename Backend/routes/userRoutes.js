const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verificarToken = require('../middleware/authMiddleware');

// Actualizar el método de pago del usuario
router.put('/actualizar-pago', verificarToken, async (req, res) => {
  const { metodoPago } = req.body;

  // Validar el método de pago
  if (!['Visa', 'Nequi', 'Efectivo'].includes(metodoPago)) {
    return res.status(400).json({ error: 'Método de pago inválido' });
  }

  try {
    const usuario = await User.findById(req.usuario.id);
    
    // Actualizar el campo 'metodoPago' en el usuario
    usuario.metodoPago = metodoPago;
    await usuario.save();

    res.json({ mensaje: 'Método de pago actualizado', usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el método de pago' });
  }
});

module.exports = router;
