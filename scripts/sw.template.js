/* Service worker Lab Simulasi Matematika.
 * Berkas ini adalah TEMPLATE. `node scripts/generate-sw.mjs` (dijalankan setelah
 * `vite build`) mengisi PRECACHE dan VERSION lalu menulis hasilnya ke dist/sw.js.
 * Jangan menyalin berkas ini langsung ke produksi. */

const VERSION = "__VERSION__";
/** @type {{ url: string, rev: string }[]} */
const PRECACHE = /*__PRECACHE__*/ [];

const PREFIX = "lab1729-";
const CACHE = `${PREFIX}v-${VERSION}`;
const MANIFEST_KEY = "/__sw-manifest.json";
const SHELL = "/index.html";
const NAV_TIMEOUT_MS = 4000;

/* ---------- Install: unduh seluruh aplikasi ke cache ---------- */

async function readPreviousEntries() {
  // Ambil daftar berkas dari versi sebelumnya supaya berkas yang tidak berubah
  // (model 3D, chunk, ikon) cukup disalin dari cache lama, tidak diunduh ulang.
  const names = (await caches.keys()).filter((n) => n.startsWith(`${PREFIX}v-`) && n !== CACHE);
  for (const name of names) {
    const cache = await caches.open(name);
    const res = await cache.match(MANIFEST_KEY);
    if (res) return { cache, entries: new Map((await res.json()).map((e) => [e.url, e.rev])) };
  }
  return null;
}

async function precache() {
  const cache = await caches.open(CACHE);
  const prev = await readPreviousEntries();
  const queue = [...PRECACHE];

  async function worker() {
    for (let entry = queue.shift(); entry; entry = queue.shift()) {
      if (prev && prev.entries.get(entry.url) === entry.rev) {
        const old = await prev.cache.match(entry.url);
        if (old) {
          await cache.put(entry.url, old);
          continue;
        }
      }
      const res = await fetch(entry.url, { cache: "reload" });
      if (!res.ok) throw new Error(`Gagal mengunduh ${entry.url} (${res.status})`);
      await cache.put(entry.url, res);
    }
  }

  await Promise.all(Array.from({ length: 6 }, worker));
  // Manifest ditulis paling akhir: cache tanpa manifest dianggap tidak lengkap.
  await cache.put(MANIFEST_KEY, new Response(JSON.stringify(PRECACHE), { headers: { "Content-Type": "application/json" } }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data && event.data.type === "GET_VERSION" && event.source) event.source.postMessage({ type: "VERSION", version: VERSION });
});

/* ---------- Activate: buang cache versi lama ---------- */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n.startsWith(PREFIX) && n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

/* ---------- Fetch ---------- */

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

async function handleNavigation(request) {
  try {
    // Online: pakai halaman terbaru dari jaringan (prerender per rute untuk SEO).
    return await withTimeout(fetch(request), NAV_TIMEOUT_MS);
  } catch {
    // Offline / koneksi lambat: sajikan cangkang aplikasi, React Router yang memilih halaman.
    const cache = await caches.open(CACHE);
    return (await cache.match(request)) || (await cache.match(SHELL)) || Response.error();
  }
}

async function handleAsset(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === "basic") cache.put(request, res.clone());
  return res;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (url.pathname === "/sw.js" || url.pathname.startsWith("/_vercel/") || url.pathname.startsWith("/api/")) return;
    if (request.mode === "navigate") {
      event.respondWith(handleNavigation(request));
      return;
    }
    event.respondWith(handleAsset(request));
    return;
  }

});
