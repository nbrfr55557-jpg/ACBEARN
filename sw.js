/* Service worker — Centrage DR400
   À CHAQUE MISE À JOUR DE L'APP : incrémenter CACHE ci-dessous.
   Cela rend ce fichier différent -> le navigateur installe le nouveau SW,
   qui passe en "waiting" ; la page affiche alors la bannière de mise à jour.
   Le SW n'active la nouvelle version qu'au clic sur "Recharger"
   (message SKIP_WAITING), pour un comportement maîtrisé. */
const CACHE = "centrage-dr400-v11";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  // pas de skipWaiting ici : on attend l'action de l'utilisateur (bannière)
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Le clic "Recharger" envoie ce message -> activation immédiate du nouveau SW */
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

/* Stale-while-revalidate : sert le cache, met à jour en arrière-plan.
   On ne met jamais sw.js en cache (le navigateur doit le récupérer frais). */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.endsWith("/sw.js")) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
