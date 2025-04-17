# Tracknariño Backend

Backend de la aplicación Tracknariño, orientado a mejorar la eficiencia del transporte de carga en el departamento de Nariño. Soporta funcionalidades como autenticación, creación y asignación de oportunidades logísticas, seguimiento en tiempo real, notificaciones y alertas de seguridad.

---

## 📦 Instalación Paso a Paso

### 🔧 1. Clonar el repositorio o crear manualmente la carpeta
```bash
mkdir backend_tracknarino
cd backend_tracknarino
```

### 🔧 2. Inicializar el proyecto Node.js
```bash
npm init -y
```

### 🔧 3. Instalar dependencias necesarias
```bash
npm install express mongoose dotenv bcrypt jsonwebtoken cors axios firebase-admin haversine-distance
```

### 🔧 4. Instalar herramientas de desarrollo (hot reload)
```bash
npm install --save-dev nodemon
```

### 🔧 5. Crear la estructura del proyecto
```bash
mkdir controllers models routes services middleware config
```

### 🔧 6. Crear archivo principal
```bash
touch server.js
```

### 🔧 7. Crear archivo `.env`
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/tracknarino
```

> Asegúrate de tener MongoDB instalado y corriendo localmente (recomendado MongoDB 8.0.8).

---

## 👥 Usuarios de prueba

### Camionero
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDA2YzY4NTEzYjdmMDc1MmE3MDFjMCIsInRpcG8iOiJjYW1pb25lcm8iLCJpYXQiOjE3NDQ4NTkxNjUsImV4cCI6MTc0NDk0NTU2NX0.VxdlFbtnkPotbpEmwHdrcORgNwIpV3JjrhaGDlFuksw",
  "usuario": {
    "_id": "68006c68513b7f0752a701c0",
    "nombre": "Carlos Ruiz",
    "correo": "carlos@example.com",
    "tipoUsuario": "camionero"
  }
}
```

### Contratista
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDA2ZGY2NTEzYjdmMDc1MmE3MDFjNSIsInRpcG8iOiJjb250cmF0aXN0YSIsImlhdCI6MTc0NDg1OTIwMiwiZXhwIjoxNzQ0OTQ1NjAyfQ.nFjZNIBwsiF-rcMPdIwk8mfyNaGeDfzirSjoXfmXzDM",
  "usuario": {
    "_id": "68006df6513b7f0752a701c5",
    "nombre": "Laura Contratista",
    "correo": "laura@empresa.com",
    "tipoUsuario": "contratista"
  }
}
```

---

## 🚀 Ejecución del proyecto

### 1. Iniciar el servidor
```bash
npm start
```

> El servidor se ejecutará en: `http://localhost:4000`

### 2. Configurar Postman o Thunder Client
Para pruebas de rutas protegidas:
- Ir a la pestaña **Headers**
- Agregar:
```
Authorization: Bearer [tu_token_jwt]
```
Ejemplo:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ Funcionalidades principales

### 🔐 Autenticación y roles
- Registro con tipo de usuario (camionero o contratista)
- Inicio de sesión con JWT
- Middleware de protección por rol (`soloRol()`)

### 🚛 Gestión de cargas
- Contratista crea oportunidad de transporte
- Camionero ve cargas disponibles
- Contratista asigna un camionero a una carga
- Contratista finaliza la carga

### 🛰️ Seguimiento GPS
- Camionero actualiza su ubicación en tiempo real
- Contratista consulta ubicación actual de su carga asignada

### 📲 Notificaciones push
- Registro de `deviceToken` por usuario
- Notificación automática al asignar carga

### 🚨 Alertas de seguridad
- Creación de alertas con ubicación y tipo (trancon, sospecha, robo, etc.)
- Visualización de alertas recientes
- Búsqueda de alertas cercanas a coordenadas dadas (con radio)

### 🧑‍💼 Panel para contratistas
- Listado de todos los camioneros registrados

---

## 🧪 Guía de pruebas con ejemplos

### 🔐 Login
**POST** `/api/auth/login`
```json
{
  "correo": "carlos@example.com",
  "contraseña": "contrasenaSegura123"
}
```

### 📦 Crear carga (contratista)
**POST** `/api/oportunidades/crear`
```json
{
  "titulo": "Carga refrigerada",
  "descripcion": "Alimentos perecederos",
  "origen": "Pasto",
  "destino": "Tumaco",
  "fecha": "2025-04-18T08:00:00Z",
  "precio": 850000
}
```

### 📥 Asignar carga (contratista)
**POST** `/api/oportunidades/asignar/:id`
```json
{
  "camioneroId": "68006c68513b7f0752a701c0"
}
```

### 📍 Reportar ubicación (camionero)
**POST** `/api/ubicacion/actualizar`
```json
{
  "lat": 1.2136,
  "lng": -77.2811
}
```

### 📍 Ver ubicación (contratista)
**GET** `/api/ubicacion/ultima/:camioneroId`

### 📲 Registrar token FCM
**POST** `/api/notificaciones/registrar-token`
```json
{
  "token": "fcm_token_123"
}
```

### 🚨 Crear alerta de seguridad
**POST** `/api/alertas/crear`
```json
{
  "tipo": "sospecha",
  "descripcion": "Personas extrañas en la curva",
  "coords": { "lat": 1.214, "lng": -77.280 }
}
```

### 🔎 Ver alertas cercanas
**GET** `/api/alertas/cercanas?lat=1.214&lng=-77.280&radio=3000`

---

🎉 El backend Tracknariño está 100% listo para ser consumido desde un frontend móvil o web. Puedes conectar con React Native, Flutter, o cualquier app que consuma APIs REST.

