const CACHE_NAME = 'red-puntos-v1';
const ASSETS = [
  './',
  './index.html',
  './registro.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
