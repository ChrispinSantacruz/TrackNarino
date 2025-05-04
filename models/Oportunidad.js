const mongoose = require('mongoose');

const oportunidadSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  origen: { type: String, required: true },
  destino: { type: String, required: true },
  fecha: { type: Date, required: true },
  precio: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['disponible', 'asignada', 'finalizada'],
    default: 'disponible'
  },
  finalizada: {
    type: Boolean,
    default: false
  },
  contratista: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  camioneroAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Oportunidad', oportunidadSchema);
