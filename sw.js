const CACHE_NAME = 'multiplication-app-202602020211'; // Incrémente ce numéro à chaque mise à jour
const urlsToCache = [
  './',
  './index.html',
  './debutant.html',
  './intermediaire.html',
  './expert.html',
  './operations-aleatoires.html',
  './pythagore.html',
  './quiz.html',
  './historique.html',
  './js/alpine-store.js',
  './vendor/tailwind.min.css',
  './vendor/alpinejs.min.js',
  './vendor/chart.umd.min.js'
];

// Installation : Mise en cache initiale
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // On utilise des requêtes individuelles pour éviter qu'un seul 404 ne bloque tout
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie : NETWORK FIRST
// On demande au réseau, si ça échoue (offline ou erreur), on prend le cache.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la réponse est valide, on met à jour le cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas de panne réseau, on cherche dans le cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;

          // Si c'est une page HTML non trouvée, on renvoie l'index
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});