const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contraseña: {
    type: String,
    required: true
  },
  tipoUsuario: {
    type: String,
    enum: ['camionero', 'contratista'],
    required: true
  },
  telefono: String,
  empresa: String,

  // ✅ Token para notificaciones FCM
  deviceToken: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
