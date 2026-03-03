// ── ABHAY TOMAR PORTFOLIO — SERVICE WORKER ──
// Cache-First strategy: serve from cache, fallback to network, update in background

const CACHE_NAME = "abhay-portfolio-v1";

// All assets to pre-cache on install
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./Abhay_Tomar_CV.pdf",
  "./abhay.jpeg",
  "./og-image.png",
  "./hubspot_seo_cert.png",
  "./nasscom.png",
  "./nptel_privacy_security.png",
  "./project-supplysense.png",
  "./project-cyberguard.png",
  "./project-campusvote.png",
];

// ── INSTALL: pre-cache all local assets ──────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: delete old caches ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── FETCH: Cache-first, network fallback ─────────────────────────────────────
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip non-http(s) requests (chrome-extension:// etc.)
  if (!event.request.url.startsWith("http")) return;

  const url = new URL(event.request.url);

  // For same-origin requests: cache-first strategy
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          // Serve from cache immediately, update in background
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches
                  .open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, networkResponse.clone()));
              }
              return networkResponse;
            })
            .catch(() => {});
          return cached;
        }

        // Not in cache — try network, cache the response
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cloned = networkResponse.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, cloned));
            }
            return networkResponse;
          })
          .catch(() => {
            // Absolute fallback for navigation requests
            if (event.request.destination === "document") {
              return caches.match("./index.html");
            }
          });
      })
    );
    return;
  }

  // For cross-origin requests (Google Fonts, CDNs etc.): network-first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, cloned));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
