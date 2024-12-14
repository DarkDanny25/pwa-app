import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Card, CardContent, CardHeader, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getDeviceById, updateDevice } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faArrowLeft, faDesktop } from '@fortawesome/free-solid-svg-icons';

const EditDevice = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga de datos
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const device = await getDeviceById(id);
        setName(device.name);
        setType(device.type);
        setBrand(device.brand);
        setModel(device.model);
        setYear(device.year);
        if (device.image) {
          setImagePreview(device.image);
        }
        setLoading(false);  // Se actualiza a false una vez que los datos han sido cargados
      } catch (error) {
        console.error('Error al obtener el dispositivo:', error);
        setLoading(false);  // También actualizamos a false si ocurre un error
      }
    };

    fetchDevice();
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name || name.length < 3) {
      newErrors.name = 'El nombre del dispositivo debe tener al menos 3 caracteres.';
    }
    if (!brand || brand.length < 2) {
      newErrors.brand = 'La marca debe tener al menos 2 caracteres.';
    }
    if (!model || model.length < 2) {
      newErrors.model = 'El modelo debe tener al menos 2 caracteres.';
    }
    if (!year || year < 1900 || year > new Date().getFullYear()) {
      newErrors.year = 'El año debe ser un valor válido entre 1900 y el año actual.';
    }
    if (!type) {
      newErrors.type = 'El tipo de dispositivo es obligatorio.';
    }
    if (image && !['image/jpeg', 'image/png', 'image/jpg'].includes(image.type)) {
      newErrors.image = 'Solo se permiten imágenes en formato JPG, JPEG o PNG.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('year', year);
    if (image) {
      formData.append('image', image);
    }

    try {
      await updateDevice(id, formData);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      alert('Error al actualizar el dispositivo. Intenta nuevamente.');
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Mientras se cargan los datos del dispositivo, mostramos el spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '-50px' }}>
      <Card sx={{ width: '100%', maxWidth: 450, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader
          title="Editar Dispositivo"
          titleTypographyProps={{ variant: 'h5' }}
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            padding: 2,
            borderRadius: 2,
          }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nombre del Dispositivo"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  borderRadius: 1.5,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#1976d2' },
                  },
                }}
                error={!!errors.name}
                helperText={errors.name}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Tipo"
                  select
                  fullWidth
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  sx={{
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#1976d2' },
                    },
                  }}
                  error={!!errors.type}
                  helperText={errors.type}
                >
                  <MenuItem value="celular">Celular</MenuItem>
                  <MenuItem value="computadora">Computadora</MenuItem>
                </TextField>
                <TextField
                  label="Marca"
                  variant="outlined"
                  fullWidth
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  sx={{
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#1976d2' },
                    },
                  }}
                  error={!!errors.brand}
                  helperText={errors.brand}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Modelo"
                  variant="outlined"
                  fullWidth
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  sx={{
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#1976d2' },
                    },
                  }}
                  error={!!errors.model}
                  helperText={errors.model}
                />
                <TextField
                  label="Año"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  sx={{
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#1976d2' },
                    },
                  }}
                  error={!!errors.year}
                  helperText={errors.year}
                />
              </Box>
              <Button
                variant="contained"
                color="secondary"
                component="label"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faCamera} />}
                sx={{
                  backgroundColor: '#00bcd4',
                  '&:hover': { backgroundColor: '#0097a7' },
                  marginBottom: 2,
                  borderRadius: 1.5,
                  padding: '8px 16px',
                }}
              >
                Subir Imagen
                <input
                  type="file"
                  hidden
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </Button>
              {imagePreview && (
                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  />
                </Box>
              )}
              {errors.image && (
                <Box sx={{ color: 'red', fontSize: '0.875rem', textAlign: 'center' }}>
                  {errors.image}
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="grey"
                  fullWidth
                  startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                  onClick={handleGoBack}
                  sx={{
                    backgroundColor: '#9e9e9e',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#616161',
                    },
                    borderRadius: 1.5,
                    padding: '8px 16px',
                  }}
                >
                  Regresar
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  fullWidth
                  startIcon={<FontAwesomeIcon icon={faDesktop} />}
                  sx={{
                    backgroundColor: '#ff9800',
                    '&:hover': { backgroundColor: '#f57c00' },
                    borderRadius: 1.5,
                    padding: '8px 16px',
                  }}
                >
                  Actualizar Dispositivo
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Dispositivo actualizado exitosamente
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditDevice;