/* service-worker.js
   Stale-While-Revalidate for /dogs + detail pages
   Precache app shell + image caching
*/

const APP_CACHE = "app-shell-v4";
const DOGS_CACHE = "dogs-cache-v4";
const DOG_DETAILS_CACHE = "dog-details-cache-v4";
const IMAGES_CACHE = "images-cache-v4";

const APP_SHELL = [
  "/",
  "/index.html",
  "/dog.html",
  "/styles.css",
  "/app.js",
  "/dog.js",
  "/manifest.json",
  "/fallback.html"
];

// ------------------------------------------------------------
// INSTALL → Precache App Shell
// ------------------------------------------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();
});

// ------------------------------------------------------------
// ACTIVATE → Remove old caches
// ------------------------------------------------------------
self.addEventListener("activate", event => {
  const allowed = [APP_CACHE, DOGS_CACHE, DOG_DETAILS_CACHE, IMAGES_CACHE];

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => !allowed.includes(k))
          .map(k => caches.delete(k))
      )
    )
  );

  self.clients.claim();
});

// ------------------------------------------------------------
// FETCH HANDLER
// ------------------------------------------------------------
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // --------------------------
  // 1️⃣ Stale-While-Revalidate: /dogs (list)
  // --------------------------
  if (url.pathname === "/dogs") {
    event.respondWith(staleWhileRevalidate(req, DOGS_CACHE));
    return;
  }

  // --------------------------
  // 2️⃣ Stale-While-Revalidate: /dogs/{id}
  // --------------------------
  const matchDogDetail = url.pathname.match(/^\/dogs\/([^/]+)$/);
  if (matchDogDetail) {
    event.respondWith(staleWhileRevalidate(req, DOG_DETAILS_CACHE));
    return;
  }

  // --------------------------
  // 3️⃣ Cache-first for images
  // --------------------------
  if (req.destination === "image") {
    event.respondWith(cacheFirst(req, IMAGES_CACHE));
    return;
  }

  // --------------------------
  // 4️⃣ App Shell static assets → cache-first
  // --------------------------
  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(cacheFirst(req, APP_CACHE));
    return;
  }

  // --------------------------
  // 5️⃣ Default: network with offline fallback
  // --------------------------
  event.respondWith(
    fetch(req).catch(() => caches.match("/fallback.html"))
  );
});

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const cache = await caches.open(cacheName);
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

// Stale-While-Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);

  // Respond with cached version immediately if exists
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then(networkResponse => {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    })
    .catch(() => null); // ignore if offline

  // Prioritize cached response, but update in the background
  return cached || networkFetch || caches.match("/fallback.html");
}