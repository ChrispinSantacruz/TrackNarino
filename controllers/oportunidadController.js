const Oportunidad = require('../models/Oportunidad');
const User = require('../models/User');
const { enviarNotificacionFCM } = require('../services/fcmService');

// Crear oportunidad (solo contratista)
const crearOportunidad = async (req, res) => {
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
};

// Listar oportunidades disponibles (pueden verlas todos los autenticados)
const listarOportunidades = async (req, res) => {
  try {
    const oportunidades = await Oportunidad.find({ estado: 'disponible' })
      .populate('contratista', 'nombre correo');
    res.json(oportunidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar oportunidades' });
  }
};

// Asignar camionero a oportunidad (solo contratista)
const asignarCamionero = async (req, res) => {
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

    // Enviar notificación al camionero si tiene token FCM
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
};

// Finalizar carga (solo contratista)
const finalizarCarga = async (req, res) => {
  try {
    const carga = await Oportunidad.findById(req.params.id);

    if (!carga || carga.contratista.toString() !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permisos para finalizar esta carga' });
    }

    carga.estado = 'finalizada';
    carga.finalizada = true;
    await carga.save();

    // Notificación al camionero
    const camionero = await User.findById(carga.camioneroAsignado);
    if (camionero?.deviceToken) {
      await enviarNotificacionFCM(
        camionero.deviceToken,
        '✔️ Carga finalizada',
        `La carga de ${carga.origen} a ${carga.destino} ha sido finalizada.`
      );
    }

    res.json({ mensaje: 'Carga finalizada correctamente', carga });
  } catch (error) {
    res.status(500).json({ error: 'Error al finalizar la carga' });
  }
};

module.exports = {
  crearOportunidad,
  listarOportunidades,
  asignarCamionero,
  finalizarCarga
};
