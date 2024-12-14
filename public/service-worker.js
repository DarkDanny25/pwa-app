const CACHE_NAME = 'v2'; // Cambiar a v2 para forzar la actualización del cache

// Archivos a cachear
const cacheAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/styles.css',
  '/app.js',
  '/idb.js', // Asegúrate de que este archivo esté en public
  '/static/css/main.e6c13ad2.css', // Agrega aquí los archivos CSS específicos
  '/static/js/main.db4fa782.js'    // Agrega aquí los archivos JS específicos
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(cacheAssets);
    })
  );
});

// Manejo de solicitudes fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si hay un recurso en caché, devuélvelo.
        if (response) {
          return response;
        }
        // Si no, realiza la solicitud de red.
        return fetch(event.request).catch((error) => {
          console.error('Error al recuperar el recurso:', event.request.url, error);
          // Aquí puedes devolver un recurso alternativo o una página de error
        });
      })
  );
});

// Actualización del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Lista de caches permitidos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Elimina caches antiguos
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});