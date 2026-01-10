const CACHE_NAME = "porkys-game-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",

  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",

  "./Nuovo_logo_carte.png",
  "./Nuovo_logo_soft.png",
  "./Logo_per_chinhot.png",

  "./Tabellone_soft.html",
  "./Tabellone_chinhot.html",
  "./Tabellone_extreme.html"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
