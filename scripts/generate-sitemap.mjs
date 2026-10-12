// scripts/generate-sitemap.mjs
// Membuat public/sitemap.xml dari slug di simulations.ts dan data latihan.
// Jalankan sebelum build: "build": "node scripts/generate-sitemap.mjs && tsc -b && vite build"
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://1729.blog";
const SIMULATIONS_FILE = "src/pages/simulations.ts";
const LATIHAN_DATA_DIR = "src/pages/latihan_soal/data"; // sesuaikan bila berbeda

const STATIC_PATHS = ["/", "/simulasi", "/latihan", "/toko"];

const slugsIn = (file) =>
  [...readFileSync(file, "utf8").matchAll(/\bslug:\s*["']([a-z0-9-]+)["']/g)].map((m) => m[1]);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(name) ? [p] : [];
  });
}

const simulasi = [...new Set(slugsIn(SIMULATIONS_FILE))].map((s) => `/simulasi/${s}`);

let latihan = [];
try {
  latihan = [...new Set(walk(LATIHAN_DATA_DIR).flatMap(slugsIn))].map((s) => `/latihan/${s}`);
} catch {
  console.warn(`[sitemap] folder ${LATIHAN_DATA_DIR} tidak ditemukan; /latihan/<slug> dilewati.`);
}

const paths = [...STATIC_PATHS, ...simulasi, ...latihan];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`[sitemap] ${paths.length} URL (${simulasi.length} simulasi, ${latihan.length} latihan)`);
