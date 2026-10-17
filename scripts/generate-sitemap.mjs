// scripts/generate-sitemap.mjs
// Membuat public/sitemap.xml dari daftar rute di scripts/routes.mjs.
// Hanya halaman yang benar-benar bisa dibuka tanpa login yang dimasukkan.
import { writeFileSync } from "node:fs";
import { getRoutes } from "./routes.mjs";

const SITE = "https://1729.blog";
const routes = (await getRoutes()).filter((r) => r.inSitemap);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE}${r.path === "/" ? "/" : r.path}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`[sitemap] ${routes.length} URL publik ditulis ke public/sitemap.xml`);
