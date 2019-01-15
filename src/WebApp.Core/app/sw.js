importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([]);
  workbox.routing.registerRoute(
    "/",
    workbox.strategies.networkFirst({
      cacheName: "homepage-cache"
    })
  );
  workbox.routing.registerRoute(
    new RegExp(".*.js"),
    workbox.strategies.networkFirst({
      cacheName: "js-cache",
      networkTimeoutSeconds: 3
    })
  );
  workbox.routing.registerRoute(
    new RegExp(".*.html"),
    workbox.strategies.networkFirst({
      cacheName: "html-cache"
    })
  );
  workbox.routing.registerRoute(
    new RegExp(".*.json"),
    workbox.strategies.networkFirst({
      cacheName: "json-cache"
    })
  );
  workbox.routing.registerRoute(
    new RegExp(".*.css"),
    workbox.strategies.networkFirst({
      cacheName: "css-cache"
    })
  );
  workbox.routing.registerRoute(
    new RegExp("/episerverapi/"),
    workbox.strategies.networkFirst({
      cacheName: "serviceapi-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  workbox.routing.registerRoute(
    new RegExp("/api/episerver/"),
    workbox.strategies.networkFirst({
      cacheName: "contentapi-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/g,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "my-image-cache"
    })
  );
  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts-stylesheets"
    })
  );
  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
      cacheName: "google-fonts-webfonts",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30
        })
      ]
    })
  );
  // Enable offline profile store tracking
  workbox.routing.registerRoute(
    /^https:\/\/track-emea01\.profilestore\.episerver\.net\/api\/v1.0/,
    workbox.strategies.networkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin("background-sync-queue", {
          maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
        })
      ]
    }),
    "POST"
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
