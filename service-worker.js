const CACHE_NAME = 'english-journey-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './fonts.css',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './fonts/Archivo-700-latin-ext.woff2',
  './fonts/Archivo-700-latin.woff2',
  './fonts/Archivo-700-vietnamese.woff2',
  './fonts/Archivo-800-latin-ext.woff2',
  './fonts/Archivo-800-latin.woff2',
  './fonts/Archivo-800-vietnamese.woff2',
  './fonts/IBMPlexMono-400-latin-ext.woff2',
  './fonts/IBMPlexMono-400-latin.woff2',
  './fonts/IBMPlexMono-400-vietnamese.woff2',
  './fonts/IBMPlexMono-500-latin-ext.woff2',
  './fonts/IBMPlexMono-500-latin.woff2',
  './fonts/IBMPlexMono-500-vietnamese.woff2',
  './fonts/IBMPlexMono-600-latin-ext.woff2',
  './fonts/IBMPlexMono-600-latin.woff2',
  './fonts/IBMPlexMono-600-vietnamese.woff2',
  './fonts/PublicSans-400-latin-ext.woff2',
  './fonts/PublicSans-400-latin.woff2',
  './fonts/PublicSans-400-vietnamese.woff2',
  './fonts/PublicSans-500-latin-ext.woff2',
  './fonts/PublicSans-500-latin.woff2',
  './fonts/PublicSans-500-vietnamese.woff2',
  './fonts/PublicSans-600-latin-ext.woff2',
  './fonts/PublicSans-600-latin.woff2',
  './fonts/PublicSans-600-vietnamese.woff2',
  './fonts/PublicSans-700-latin-ext.woff2',
  './fonts/PublicSans-700-latin.woff2',
  './fonts/PublicSans-700-vietnamese.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first: app hoạt động hoàn toàn offline sau lần tải đầu tiên.
// Speech recognition (chấm điểm phát âm) vẫn cần mạng vì nó gọi dịch vụ của trình duyệt, không đi qua service worker này.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
