/* Klarschiff Service Worker: Offline-Start + Klick auf Mitteilungen */
const CACHE = "klarschiff-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.add("./")).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// Netz zuerst, bei Offline die zuletzt gespeicherte App-Seite
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put("./", copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match("./"))
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) =>
      ws.length ? ws[0].focus() : self.clients.openWindow("./")
    )
  );
});
