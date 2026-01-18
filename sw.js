const CACHE_STATIC = "porkys-static-v1";
const CACHE_DYNAMIC = "porkys-dynamic-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./Pagina_carte.html",
  "./css/style.css",
  "./js/jszip.min.js",
  "./js/localforage.min.js",
  "./images/logo_splash.png",
  "./images/icon-180.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./manifest.json"
];

// Install
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate (cleanup vecchie cache)
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_DYNAMIC)
          .map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch — Strategy: Static → Dynamic → Network → Fail
self.addEventListener("fetch", e => {
  const req = e.request;

  // Non cache UI navigatori, websockets, ecc.
  if (req.method !== "GET") return;

  // Carte (base64) — niente cache nel SW, ci pensa localForage
  if (req.url.startsWith("data:image")) return;

  e.respondWith(
    caches.match(req).then(cacheRes => {
      if (cacheRes) return cacheRes;

      return fetch(req)
        .then(networkRes => {
          return caches.open(CACHE_DYNAMIC).then(cache => {
            // Cache dinamico per asset caricati
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => {
          // fallback offline semplice
          if (req.headers.get("accept").includes("text/html")) {
            return caches.match("./index.html");
          }
        });
    })
  );
});
