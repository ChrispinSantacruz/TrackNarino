const admin = require('firebase-admin');
const path = require('path');

// Ruta a tu archivo de credenciales (JSON descargado de Firebase Console)
const serviceAccount = require(path.join(__dirname, '../config/firebase-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function enviarNotificacionFCM(deviceToken, titulo, cuerpo) {
  const mensaje = {
    notification: {
      title: titulo,
      body: cuerpo
    },
    token: deviceToken
  };

  try {
    const response = await admin.messaging().send(mensaje);
    console.log('✅ Notificación enviada:', response);
  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
  }
}

module.exports = { enviarNotificacionFCM };
