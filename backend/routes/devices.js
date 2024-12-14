const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Device = require('../models/devices');
const router = express.Router();

// Verificar si la carpeta 'uploads' existe, si no, crearla
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuración de Multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // Almacenamos las imágenes en la carpeta 'uploads' ubicada en la raíz
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nombre único para cada archivo
  }
});

// Aceptar solo imágenes con ciertas extensiones
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes en formato JPG, JPEG o PNG.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Crear un dispositivo con imagen
router.post('/', upload.single('image'), async (req, res) => {
  const { name, type, brand, model, year } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;  // URL de la imagen

  const newDevice = new Device({ name, type, brand, model, year, image: imageUrl });

  try {
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Leer todos los dispositivos
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leer un dispositivo por ID
router.get('/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un dispositivo con imagen
router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, type, brand, model, year } = req.body;
  let imageUrl = undefined;  // Asegurarse de que no esté vacía

  // Si se sube una nueva imagen, se toma la URL de la nueva imagen
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    // Buscar el dispositivo por ID
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    // Si no se sube una nueva imagen, se mantiene la imagen anterior
    imageUrl = imageUrl || device.image;

    // Si se subió una nueva imagen, eliminar la imagen antigua del servidor
    if (req.file && device.image) {
      const oldImagePath = path.join(__dirname, '..', device.image); // Ruta de la imagen anterior
      fs.unlinkSync(oldImagePath);  // Eliminar la imagen anterior
    }

    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        brand,
        model,
        year,
        image: imageUrl,  // Solo actualizar si hay una nueva imagen
      },
      { new: true }
    );
    
    res.json(updatedDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un dispositivo
router.delete('/:id', async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.params.id);
    if (!deletedDevice) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    // Si el dispositivo tenía una imagen, eliminarla del servidor
    if (deletedDevice.image) {
      const imagePath = path.join(__dirname, '..', deletedDevice.image);  // Ruta de la imagen
      fs.unlinkSync(imagePath);  // Eliminar la imagen
    }

    res.json({ message: 'Dispositivo eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;