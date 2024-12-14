import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Importa el service worker

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra el service worker solo en producción
if (process.env.NODE_ENV === 'production') {
  serviceWorkerRegistration.register({
    onSuccess: (registration) => {
      console.log('Service Worker registrado con éxito:', registration);
    },
    onUpdate: (registration) => {
      console.log('Nuevo contenido disponible, recargue la página.');
    },
  });
} else {
  // En desarrollo, desregistra el service worker
  serviceWorkerRegistration.unregister();
}

// Si quieres empezar a medir el rendimiento en tu app, pasa una función
// para registrar resultados (por ejemplo: reportWebVitals(console.log))
// o envíalos a un endpoint de analítica. Aprende más en: https://bit.ly/CRA-vitals
reportWebVitals();