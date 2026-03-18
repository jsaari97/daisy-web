const scopePath = new URL(self.registration.scope).pathname;
const basePath = scopePath.endsWith("/") ? scopePath : `${scopePath}/`;
const cacheScope = basePath.replace(/\W+/g, "-");
const cacheName = `daisyweb-cache-${cacheScope}-v1`;
const filesToCache = [
  basePath,
  `${basePath}index.html`,
  `${basePath}manifest.json`,
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== cacheName)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);

      try {
        const response = await fetch(event.request);

        if (response.ok) {
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === "navigate") {
          const fallback = await cache.match(`${basePath}index.html`);

          if (fallback) {
            return fallback;
          }
        }

        throw error;
      }
    })()
  );
});
