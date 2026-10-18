// scripts/routes.mjs
// Sumber tunggal daftar rute publik untuk sitemap.xml dan prerender-meta.mjs.
// Data dibaca langsung dari berkas TypeScript di src/ (Node >= 22.18 bisa
// membaca .ts tanpa pustaka tambahan), jadi tidak ada daftar yang harus
// disalin manual saat menambah simulasi, slide, atau paket latihan.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const load = (file) => import(pathToFileURL(resolve(file)).href);

/** @typedef {{ path: string, title: string, description: string, jsonLd: object[], noindex: boolean, inSitemap: boolean, links: {href: string, text: string}[], points: string[] }} Route */

/** @returns {Promise<Route[]>} */
export async function getRoutes() {
  let seo, sims, decks, packs;
  try {
    [seo, sims, decks, packs] = await Promise.all([
      load("src/seoText.ts"),
      load("src/pages/simulations.ts"),
      load("src/slides/slides.ts"),
      load("src/pages/latihan_soal/catalog.ts"),
    ]);
  } catch (err) {
    throw new Error(
      `[routes] gagal membaca berkas TypeScript (${err.message}). ` +
        `Skrip ini butuh Node >= 22.18 dan 'npm install' sudah dijalankan.`,
    );
  }

  const { SIMULATIONS } = sims;
  const { DECKS } = decks;
  const { PACK_CATALOG } = packs;

  const hubLinks = {
    simulasi: SIMULATIONS.slice(0, 8).map((s) => ({ href: `/simulasi/${s.slug}`, text: `Simulasi ${s.title}` })),
    latihan: PACK_CATALOG.slice(0, 8).map((p) => ({ href: `/latihan/${p.slug}`, text: seo.latihanName(p.topic) })),
    slides: DECKS.slice(0, 8).map((d) => ({ href: `/slides/${d.slug}`, text: `Slide ${d.title}` })),
  };

  /** @type {Route[]} */
  const routes = [
    { path: "/", ...seo.HOME_SEO, links: [...hubLinks.simulasi.slice(0, 4), { href: "/latihan", text: "Latihan soal" }, { href: "/slides", text: "Slide matematika" }] },
    { path: "/about", ...seo.ABOUT_SEO, links: [{ href: "/", text: "Beranda" }] },
    { path: "/simulasi", ...seo.simulasiHubSeo(SIMULATIONS.length), links: hubLinks.simulasi },
    { path: "/latihan", ...seo.LATIHAN_HUB_SEO, links: hubLinks.latihan },
    { path: "/slides", ...seo.SLIDES_HUB_SEO, links: hubLinks.slides },
    { path: "/toko", ...seo.SHOP_SEO, links: [{ href: "/", text: "Beranda" }] },
  ].map((r) => ({ jsonLd: [], noindex: false, inSitemap: true, points: [], ...r }));

  for (const s of SIMULATIONS) {
    const page = seo.simulationSeo(s);
    routes.push({
      path: `/simulasi/${s.slug}`, ...page, jsonLd: page.jsonLd ?? [],
      noindex: false, inSitemap: true,
      points: s.concepts, links: [{ href: "/simulasi", text: "Semua simulasi" }, { href: "/latihan", text: "Latihan soal" }],
    });
  }
  for (const d of DECKS) {
    const page = seo.slideSeo(d);
    routes.push({
      path: `/slides/${d.slug}`, ...page, jsonLd: page.jsonLd ?? [],
      noindex: false, inSitemap: true,
      points: d.concepts, links: [{ href: "/slides", text: "Semua slide" }, { href: "/simulasi", text: "Simulasi interaktif" }],
    });
  }
  for (const p of PACK_CATALOG) {
    const page = seo.latihanSeo(p);
    routes.push({
      path: `/latihan/${p.slug}`, ...page, jsonLd: page.jsonLd ?? [],
      noindex: false, inSitemap: true,
      points: p.parts ?? [], links: [{ href: "/latihan", text: "Semua latihan soal" }, { href: "/simulasi", text: "Simulasi interaktif" }],
    });
  }
  return routes;
}
