import { openDB } from 'idb';

// Inicializar la base de datos IndexedDB
const dbPromise = openDB('devicesDB', 1, {
  upgrade(db) {
    // Verifica si el objeto store "requests" ya existe
    if (!db.objectStoreNames.contains('requests')) {
      db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
    }
  },
});

// Guardar solicitud fallida en IndexedDB
export async function saveRequestToIndexedDB(url, data, method) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('requests', 'readwrite');
    await tx.store.add({
      url,
      data: JSON.stringify(data), // Convertir el objeto a cadena JSON
      method,
    });
    await tx.done; // Esperar a que la transacción se complete
  } catch (error) {
    console.error('Error al guardar la solicitud en IndexedDB:', error);
  }
}

// Obtener todas las solicitudes guardadas en IndexedDB
export async function getAllRequests() {
  try {
    const db = await dbPromise;
    const tx = db.transaction('requests', 'readonly');
    const allRequests = await tx.store.getAll();
    await tx.done; // Esperar a que la transacción se complete
    return allRequests; // Devolver todas las solicitudes
  } catch (error) {
    console.error('Error al obtener solicitudes de IndexedDB:', error);
    return []; // Devuelve un array vacío en caso de error
  }
}

// Borrar solicitud de IndexedDB después de sincronizarla
export async function deleteRequest(id) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('requests', 'readwrite');
    await tx.store.delete(id); // Borrar la solicitud por ID
    await tx.done; // Esperar a que la transacción se complete
  } catch (error) {
    console.error('Error al borrar la solicitud de IndexedDB:', error);
  }
}

// Sincronizar solicitudes guardadas con el servidor
export async function syncRequestsWithServer(axiosInstance) {
  const allRequests = await getAllRequests(); // Obtener todas las solicitudes guardadas

  for (const request of allRequests) {
    const { url, data, method, id } = request;

    try {
      // Realizar la solicitud usando Axios
      await axiosInstance({
        method: method,
        url: url,
        data: JSON.parse(data), // Convertir de vuelta la cadena a objeto JSON
      });

      // Eliminar la solicitud de IndexedDB si se realizó con éxito
      await deleteRequest(id);
    } catch (error) {
      console.error('Error al sincronizar la solicitud:', error);
      // Aquí podrías implementar lógica de reintento si es necesario
    }
  }
}