// BEAUTYmaster Service Worker
// SSR(서버 렌더링) 앱이므로 동적/인증 페이지는 항상 네트워크에서 가져오고,
// 정적 자산만 캐시해 설치형 PWA 요건을 충족하고 재방문 속도를 높인다.
const STATIC_CACHE = "bm-static-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/hero/") ||
    url.pathname === "/logo.png" ||
    url.pathname === "/apple-touch-icon.png";

  // 정적 자산만 캐시 우선. 그 외(HTML/데이터/API)는 항상 네트워크.
  if (!isStatic) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch {
        return cached || Response.error();
      }
    })(),
  );
});
