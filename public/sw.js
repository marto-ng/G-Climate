self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
});

self.addEventListener('fetch', (event) => {
  // Solo un passthrough para cumplir con los requisitos de PWA
  event.respondWith(fetch(event.request));
});
