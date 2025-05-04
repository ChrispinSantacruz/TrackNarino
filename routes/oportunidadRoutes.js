const express = require('express');
const router = express.Router();
const { crearOportunidad, listarOportunidades, asignarCamionero, finalizarCarga } = require('../controllers/oportunidadController');
const verificarToken = require('../middleware/authMiddleware');
const soloRol = require('../middleware/rolMiddleware');

// Crear oportunidad (solo contratista)
router.post('/crear', verificarToken, soloRol('contratista'), crearOportunidad);

// Listar oportunidades disponibles (pueden verlas todos los autenticados)
router.get('/disponibles', verificarToken, listarOportunidades);

// Asignar camionero a oportunidad (solo contratista)
router.post('/asignar/:id', verificarToken, soloRol('contratista'), asignarCamionero);

// Finalizar carga (solo contratista)
router.post('/finalizar/:id', verificarToken, soloRol('contratista'), finalizarCarga);

module.exports = router;
