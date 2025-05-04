const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro
router.post('/registro', async (req, res) => {
  const { nombre, correo, contraseña, tipoUsuario, telefono, empresa } = req.body;

  try {
    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = new User({
      nombre,
      correo,
      contraseña: hash,
      tipoUsuario,
      telefono,
      empresa
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await User.findOne({ correo });
    if (!usuario) return res.status(400).json({ mensaje: 'Correo no registrado' });

    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coincide) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario._id, tipo: usuario.tipoUsuario }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
