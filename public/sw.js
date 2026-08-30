// Bump CACHE on any change here: the activate handler drops every cache whose
// key doesn't match, which is the only thing that clears assets stored by an
// older build. v1 kept serving pre-landing files to phones that had visited
// before, which is why the mobile landing didn't appear for people who had
// been on the site already. v4 stops this worker touching media at all — see
// the range-request note below.
const CACHE = "larp-phantom-v4";
const SHELL = ["/", "/manifest.webmanifest", "/avatar.png", "/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Prices must never come from cache.
  if (url.hostname.endsWith("jup.ag")) return;

  // Media goes straight to the network, untouched.
  //
  // Safari fetches video with Range requests and the server answers 206. Two
  // things then go wrong here: cache.put() rejects outright on a partial
  // response, and — the real damage — caches.match() ignores Range headers, so
  // once a full 200 is in the cache every later range request gets handed the
  // entire file instead of the bytes it asked for. Safari treats that as a
  // broken stream and simply never plays. This is why the hero film ran on
  // desktop and sat frozen on its poster on phones.
  if (req.headers.has("range") || /\.(mp4|webm|mov|m4v|ogg|mp3|wav)$/i.test(url.pathname)) {
    return;
  }

  // Navigations: network first, fall back to the cached shell when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/", copy));
          return res;
        })
        .catch(() => caches.match("/").then((r) => r || Response.error()))
    );
    return;
  }

  // Everything else: serve the cached copy for speed, but always refetch in
  // the background so the next load has the current file. The old version was
  // cache-first with no revalidation, so anything it stored was frozen for
  // good — a deploy could never reach a phone that had the file already.
  e.respondWith(
    caches.match(req).then((hit) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res.status === 200 && (url.origin === self.location.origin || res.type === "basic")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
