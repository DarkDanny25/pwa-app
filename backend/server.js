const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Permite que el servidor maneje peticiones de otros dominios
app.use(express.json());  // Permite que el servidor maneje solicitudes JSON

// Servir archivos estáticos de la carpeta 'uploads'
// Esto asegura que las imágenes subidas estén accesibles públicamente en la URL '/uploads/{nombre_imagen}'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error de conexión a MongoDB:', err));

// Rutas
const deviceRoutes = require('./routes/devices');
app.use('/api/devices', deviceRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});