import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import { lightTheme, darkTheme } from './theme'; // Asegúrate de tener estos temas definidos en un archivo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import DeviceList from './components/tableDevices';
import DeviceAdd from './components/addForm';
import DeviceEdit from './components/editForm';

const App = () => {
  // Establecer el estado del modo oscuro, obteniéndolo de localStorage
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  // Cambiar el tema
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode); // Guarda el estado del tema en localStorage
  };

  // Cambiar el tema al cargar la aplicación
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    setDarkMode(savedTheme === 'true'); // Si ya se guardó el estado, usarlo
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* Esto aplica los estilos globales para el tema */}
      <Router
        basename="/"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Box sx={{ padding: '20px', position: 'relative' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>
            Bienvenido a nuestro CRUD de PWA
          </h1>
          
          {/* Botón para cambiar entre modo oscuro y claro */}
          <IconButton
            onClick={toggleTheme}
            color="primary"
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: darkMode ? '#FF9800' : '#3f51b5',
              color: 'white',
              borderRadius: '50%',
              padding: '10px', // Se redujo el padding para un botón más pequeño
              boxShadow: darkMode ? '0px 4px 12px rgba(255, 152, 0, 0.4)' : '0px 4px 12px rgba(63, 81, 181, 0.4)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: darkMode ? '#ff5722' : '#303f9f',
                transform: 'scale(1.1)',
                boxShadow: darkMode ? '0px 6px 16px rgba(255, 87, 34, 0.5)' : '0px 6px 16px rgba(63, 81, 181, 0.6)',
              },
              '&:active': {
                transform: 'scale(0.95)', // Efecto cuando se presiona el botón
                boxShadow: 'none',
              },
            }}
          >
            {/* Icono que cambia dependiendo del modo */}
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="lg" /> {/* Reducido el tamaño del icono */}
          </IconButton>

          {/* Definición de rutas para la aplicación */}
          <Routes>
            <Route path="/" element={<DeviceList />} />
            <Route path="/add" element={<DeviceAdd />} />
            <Route path="/edit/:id" element={<DeviceEdit />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;