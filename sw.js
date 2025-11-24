const CACHE = 'revista-pwa-v12';
const ASSETS = [
  '/revista-digital-pwa/',
  '/revista-digital-pwa/index.html',
  '/revista-digital-pwa/manifest.json',
  '/revista-digital-pwa/css/style.css',
  '/revista-digital-pwa/js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title || 'Nueva revista', {
    body: data.body || 'Hay una nueva publicación',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3TRh...',
    badge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3TRh...'
  });
});