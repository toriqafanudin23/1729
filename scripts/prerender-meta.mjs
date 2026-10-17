// scripts/prerender-meta.mjs
// Dijalankan SETELAH `vite build`. Untuk setiap rute publik, salin dist/index.html
// ke dist/<rute>/index.html dengan <title>, deskripsi, canonical, Open Graph,
// robots, JSON-LD, dan ringkasan teks yang sudah sesuai halamannya.
//
// Tujuannya: crawler dan aplikasi pratinjau tautan (WhatsApp, Telegram, Facebook)
// tidak menjalankan JavaScript, sehingga tanpa ini semua tautan tampil memakai
// judul dan deskripsi beranda. Aplikasi React tetap berjalan seperti biasa dan
// memperbarui meta lewat useSeo().
//
// Vercel menyajikan berkas statis lebih dulu sebelum aturan rewrite di vercel.json,
// jadi tidak ada perubahan konfigurasi hosting.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getRoutes } from "./routes.mjs";

const DIST = "dist";
const SITE = "https://1729.blog";
const IMAGE = `${SITE}/og-default.png`;
const INDEX_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

if (!existsSync(join(DIST, "index.html"))) {
  console.error("[prerender] dist/index.html tidak ada. Jalankan `vite build` dulu.");
  process.exit(1);
}
const template = readFileSync(join(DIST, "index.html"), "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, () => tag) : html.replace("</head>", () => `    ${tag}\n  </head>`);
}

function render(route, seo) {
  const url = `${SITE}${route.path === "/" ? "/" : route.path}`;
  const title = route.path === "/" ? route.title : `${route.title} | 1729`;
  const description = seo.fitSeoDescription(route.description);

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(title)}</title>`);
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "name", "robots", route.noindex ? "noindex, follow" : INDEX_ROBOTS);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, () => `<link rel="canonical" href="${url}" />`);
  for (const [attr, key, value] of [
    ["property", "og:title", title], ["property", "og:description", description], ["property", "og:url", url],
    ["property", "og:image", IMAGE], ["property", "og:image:width", "1200"], ["property", "og:image:height", "630"],
    ["property", "og:image:alt", "1729: simulasi matematika interaktif, latihan soal, dan slide"],
    ["name", "twitter:title", title], ["name", "twitter:description", description], ["name", "twitter:image", IMAGE],
  ]) html = setMeta(html, attr, key, value);

  if (route.jsonLd.length) {
    const json = JSON.stringify(route.jsonLd).replace(/</g, "\\u003c");
    html = html.replace("</head>", () => `    <script type="application/ld+json" data-route="true">${json}</script>\n  </head>`);
  }

  const items = route.points.length ? `<ul>${route.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : "";
  const nav = route.links.length
    ? `<nav>${route.links.map((l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`).join(" ")}</nav>`
    : "";
  const fallback = `<noscript><h1>${esc(route.title)}</h1><p>${esc(description)}</p>${items}${nav}</noscript>`;
  return html.replace(/<noscript>[\s\S]*?<\/noscript>/, () => fallback);
}

const seo = await import(new URL("../src/seoText.ts", import.meta.url).href);
const routes = await getRoutes();

let written = 0;
for (const route of routes) {
  const out = route.path === "/" ? join(DIST, "index.html") : join(DIST, route.path, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(route, seo));
  written++;
}
console.log(`[prerender] ${written} halaman statis ditulis ke ${DIST}/ (${routes.filter((r) => r.noindex).length} bertanda noindex)`);
