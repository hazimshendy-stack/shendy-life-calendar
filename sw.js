/* ==========================================================================
   SHENDY LIFE CALENDAR — Service Worker
   تخزين مؤقت بسيط وآمن ليعمل التطبيق دون إنترنت بعد أول زيارة ناجحة.
   ملاحظة: Service Worker يحتاج http(s) — لا يعمل بكامل قدراته من file://
   ========================================================================== */
"use strict";

var CACHE_NAME = "shendy-life-calendar-v1";

var CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./schedule-data.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(CORE_ASSETS.map(function (url) {
        return cache.add(new Request(url, { cache: "reload" })).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_NAME) { return caches.delete(k); }
        return null;
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") { self.skipWaiting(); }
});

function isSameOrigin(url) {
  try {
    return new URL(url, self.location.href).origin === self.location.origin;
  } catch (e) {
    return false;
  }
}

function cacheFirst(request) {
  return caches.match(request, { ignoreSearch: true }).then(function (hit) {
    if (hit) { return hit; }
    return fetch(request).then(function (res) {
      if (res && res.ok && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
      }
      return res;
    }).catch(function () {
      if (request.mode === "navigate") {
        return caches.match("./index.html");
      }
      return new Response("", { status: 504, statusText: "Offline" });
    });
  });
}

function staleWhileRevalidate(request) {
  return caches.match(request).then(function (hit) {
    var network = fetch(request).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
      }
      return res;
    }).catch(function () { return null; });

    return hit || network.then(function (res) {
      return res || new Response("", { status: 504, statusText: "Offline" });
    });
  });
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") { return; }

  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.protocol !== "http:" && url.protocol !== "https:") { return; }

  if (isSameOrigin(request.url)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
