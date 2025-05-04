const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 📦 Rutas principales
const authRoutes = require('./routes/authRoutes');
const oportunidadRoutes = require('./routes/oportunidadRoutes');
const orsRoutes = require('./routes/orsRoutes');
const ubicacionRoutes = require('./routes/ubicacionRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');
const historialRoutes = require('./routes/historialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alertaRoutes = require('./routes/alertaRoutes'); 
const calificacionRoutes = require('./routes/calificacionRoutes'); // Rutas de calificaciones
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const contratistaRoutes = require('./routes/contratistaRoutes');
const userRoutes = require('./routes/userRoutes');

// 🔐 Middleware personalizados
const { verificarToken } = require('./middleware/authMiddleware');
const { soloRol } = require('./middleware/rolMiddleware');

// 🚀 Servicios adicionales
const { obtenerRutaORS } = require('./services/orsService');
const { enviarNotificacionFCM } = require('./services/fcmService'); 

// Inicializar app
const app = express();

// 🛡️ Middlewares globales
app.use(cors());
app.use(express.json());

// 🔗 Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/oportunidades', oportunidadRoutes);
app.use('/api/ors', orsRoutes);
app.use('/api/ubicacion', ubicacionRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alertas', alertaRoutes); 
app.use('/api/calificaciones', calificacionRoutes); // Rutas de calificaciones
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/contratistas', contratistaRoutes);
app.use('/api/users', userRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido al backend de Tracknariño');
});

// 🔌 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('🟢 Conectado a MongoDB');
}).catch((err) => {
  console.error('🔴 Error al conectar a MongoDB:', err);
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
