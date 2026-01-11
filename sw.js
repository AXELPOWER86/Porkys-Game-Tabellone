const CACHE_NAME = "porkys-game-v3";

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
]

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  // ✅ ignora richieste non GET
  if (e.request.method !== "GET") return;

  // ✅ ignora richieste non http/https
  if (!e.request.url.startsWith("http")) return;

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
