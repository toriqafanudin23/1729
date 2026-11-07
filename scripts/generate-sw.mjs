// scripts/generate-sw.mjs
// Dijalankan SETELAH `vite build` dan `prerender-meta.mjs`.
// Membaca isi dist/, membuat daftar precache (url + hash isi), lalu menulis
// dist/sw.js dari scripts/sw.template.js. Hash versi berubah hanya bila ada berkas
// yang berubah, sehingga pengguna menerima pembaruan hanya saat memang ada rilis baru.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DIST = "dist";
if (!existsSync(join(DIST, "index.html"))) {
  console.error("[sw] dist/index.html tidak ada. Jalankan `vite build` dulu.");
  process.exit(1);
}

// Tidak perlu tersedia offline: berkas verifikasi/SEO, peta situs, gambar OG, source map, dan sw itu sendiri.
const SKIP_NAMES = new Set(["sw.js", "robots.txt", "sitemap.xml", "og-default.png"]);
// Format font cadangan KaTeX (.woff/.ttf) dilewati: semua browser modern memakai .woff2.
const skip = (rel) =>
  SKIP_NAMES.has(rel) ||
  /^google[0-9a-f]+\.html$/i.test(rel) ||
  rel.endsWith(".map") ||
  /KaTeX_[^/]*\.(woff|ttf)$/.test(rel);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const entries = [];
for (const file of walk(DIST).sort()) {
  const rel = relative(DIST, file).split(sep).join("/");
  if (skip(rel)) continue;
  // Halaman prerender per rute (dist/<rute>/index.html) tidak perlu di-precache:
  // offline cukup memakai cangkang /index.html. Hanya index.html akar yang dipakai.
  if (rel.endsWith("/index.html")) continue;
  const rev = createHash("sha1").update(readFileSync(file)).digest("hex").slice(0, 12);
  entries.push({ url: "/" + rel.split("/").map(encodeURIComponent).join("/"), rev });
}

const version = createHash("sha1").update(JSON.stringify(entries)).digest("hex").slice(0, 10);
const template = readFileSync(new URL("./sw.template.js", import.meta.url), "utf8");
const out = template
  .replace("__VERSION__", version)
  .replace("/*__PRECACHE__*/ []", () => JSON.stringify(entries));

if (out === template) {
  console.error("[sw] penanda template tidak ditemukan.");
  process.exit(1);
}
writeFileSync(join(DIST, "sw.js"), out);

const bytes = entries.reduce((n, e) => n + statSync(join(DIST, decodeURIComponent(e.url))).size, 0);
console.log(`[sw] dist/sw.js ditulis: ${entries.length} berkas di-precache (${(bytes / 1024 / 1024).toFixed(2)} MB), versi ${version}`);
