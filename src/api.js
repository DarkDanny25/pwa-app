import axios from 'axios';
import { saveRequestToIndexedDB, syncRequestsWithServer } from './idb'; // Asegúrate de tener el path correcto para idb.js

const API_URL = 'http://localhost:5000/api/devices';

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Escuchar cuando el navegador vuelve a estar online
window.addEventListener('online', () => {
  console.log('Conexión restaurada. Sincronizando solicitudes...');
  syncRequestsWithServer(axiosInstance); // Sincroniza cuando vuelve la conexión
});

// Interceptar las respuestas de Axios para manejar cuando esté offline
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Si la solicitud falla (offline)
      const { config } = error;

      // Guardar la solicitud en IndexedDB para sincronización posterior
      await saveRequestToIndexedDB(config.url, JSON.parse(config.data || '{}'), config.method); // Convertir datos a JSON si es necesario

      // Registrar la sincronización en segundo plano si está disponible
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register('sync-requests')
            .then(() => {
              console.log('Sincronización en segundo plano registrada');
            })
            .catch((err) => {
              console.error('Error al registrar la sincronización:', err);
            });
        });
      }

      // Retornar una respuesta simulada para evitar romper la aplicación
      return Promise.resolve({
        data: { success: false, message: 'Operación guardada para sincronización offline.' },
      });
    }

    return Promise.reject(error);
  }
);

// Funciones para el CRUD

export const getDevices = async () => {
  const response = await axiosInstance.get('/');
  return response.data;
};

export const getDeviceById = async (id) => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

export const createDevice = async (device) => {
  const response = await axiosInstance.post('/', device);
  return response.data;
};

export const updateDevice = async (id, device) => {
  const response = await axiosInstance.put(`/${id}`, device);
  return response.data;
};

export const deleteDevice = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};