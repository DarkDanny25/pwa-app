import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDevices, deleteDevice } from '../api';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faMobile, faLaptop, faTimes, faCheckCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import Push from 'push.js';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const theme = useTheme();

  const fetchDevices = async () => {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (error) {
      alert('Error fetching devices. Please try again.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchDevices();
    
    Push.create('¡Bienvenido al CRUD de SmarTech!', {
      body: '¡Aquí puedes gestionar tus dispositivos a tu gusto, incluso sin conexión!.',
      icon: '/path/to/icon.png',
      timeout: 5000,
      onClick: function () {
        window.focus();
        this.close();
      }
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.year.toString().includes(searchQuery)
  );

  const paginatedDevices = filteredDevices.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleDelete = (device) => {
    setDeviceToDelete(device);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDevice(deviceToDelete._id);
      setDevices(devices.filter((d) => d._id !== deviceToDelete._id));
      setConfirmDeleteOpen(false);
      setOpenSnackbar(true);

      Push.create('Dispositivo eliminado', {
        body: `El dispositivo "${deviceToDelete.name}" ha sido eliminado exitosamente.`,
        icon: '/path/to/icon.png',
        timeout: 5000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    } catch (error) {
      alert('Error deleting device. Please try again.');
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      {loading ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="100vh"
          width="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <TextField
              label="Buscar..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: 300, mr: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <FontAwesomeIcon icon={faSearch} style={{ color: theme.palette.text.primary }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate('/add')}
              startIcon={
                <Box display="flex" alignItems="center">
                  <FontAwesomeIcon icon={faMobile} style={{ marginRight: '5px' }} />
                  <span style={{ margin: '0 5px' }}>/</span>
                  <FontAwesomeIcon icon={faLaptop} style={{ marginLeft: '5px' }} />
                </Box>
              }
              sx={{
                backgroundColor: theme.palette.success.main,
                '&:hover': { backgroundColor: theme.palette.success.dark },
              }}
            >
              Agregar Dispositivo
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: '8px', backgroundColor: theme.palette.background.paper }}>
            <Table>
              <TableHead sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#333' : theme.palette.primary.main,
              }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Marca</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Modelo</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Año</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDevices.map((device, index) => (
                  <TableRow
                    key={device._id}
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? theme.palette.background.default
                          : theme.palette.background.paper,
                    }}
                  >
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>{device.brand}</TableCell>
                    <TableCell>{device.model}</TableCell>
                    <TableCell>{device.year}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => navigate(`/edit/${device._id}`)}
                        sx={{ marginRight: 1, color: theme.palette.warning.main }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button onClick={() => handleDelete(device)} sx={{ color: theme.palette.error.main }}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(filteredDevices.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            color="primary"
            sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
          />

          <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} sx={{ borderRadius: '8px' }}>
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', color: theme.palette.error.main }}>
              <FontAwesomeIcon icon={faTrash} sx={{ marginRight: '10px', color: theme.palette.error.main }} />
              Confirmar Eliminación
            </DialogTitle>
            <DialogContent sx={{ padding: '20px' }}>
              <p style={{ textAlign: 'center' }}>
                ¿Estás seguro de que deseas eliminar este dispositivo? Esta acción no se puede deshacer.
              </p>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
                sx={{
                  backgroundColor: theme.palette.error.main,
                  '&:hover': { backgroundColor: theme.palette.error.dark },
                  padding: '10px 20px',
                }}
                startIcon={<FontAwesomeIcon icon={faCheck} />}
              >
                Eliminar
              </Button>
              <Button
                onClick={() => setConfirmDeleteOpen(false)}
                variant="contained"
                sx={{
                  marginLeft: 2,
                  backgroundColor: theme.palette.grey[600],
                  color: '#fff',
                  padding: '10px 20px',
                  '&:hover': { backgroundColor: theme.palette.grey[500] },
                }}
                startIcon={<FontAwesomeIcon icon={faTimes} />}
              >
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="success"
              sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              icon={<FontAwesomeIcon icon={faCheckCircle} style={{ color: theme.palette.success.main, marginRight: 8 }} />}
            >
              Dispositivo eliminado con éxito.
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default DeviceList;