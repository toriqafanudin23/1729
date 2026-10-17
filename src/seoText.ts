/* ------------------------------------------------------------------ *
 *  Teks SEO terpusat: judul, deskripsi, dan data terstruktur (JSON-LD).
 *
 *  Dipakai oleh DUA pihak, supaya isinya selalu sama:
 *   1. komponen halaman lewat useSeo()         (saat dijalankan di browser)
 *   2. scripts/prerender-meta.mjs + sitemap    (saat `npm run build`)
 *
 *  Karena dibaca langsung oleh Node (type stripping), berkas ini harus:
 *   - hanya memakai sintaks TypeScript yang bisa dihapus (tanpa enum),
 *   - menulis ekstensi ".ts" pada import relatif,
 *   - tidak mengimpor React atau CSS.
 * ------------------------------------------------------------------ */
import { CP_LATIHAN, CP_SIMULASI, CP_SLIDE, cpLabel, type CpTag } from "./curriculum/cp.ts";

export const SITE = "https://1729.blog";
export const SITE_NAME = "1729";
/** Gambar pratinjau 1200x630 (WhatsApp, Telegram, Facebook, X). */
export const DEFAULT_OG_IMAGE = "/og-default.png";

const MIN_DESCRIPTION_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 160;
const DESCRIPTION_EXTENSION = " Latihan berjenjang dan pembahasan bertahap membantu memperkuat pemahaman.";

export interface PageSeo {
  /** Judul tanpa " | 1729". */
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>[];
  noindex?: boolean;
}

/* ───────── Dasar ───────── */

export function fitSeoDescription(description: string) {
  let normalized = description.replace(/\s+/g, " ").trim();
  while (normalized.length < MIN_DESCRIPTION_LENGTH) normalized += DESCRIPTION_EXTENSION;
  if (normalized.length <= MAX_DESCRIPTION_LENGTH) return normalized;

  const candidate = normalized.slice(0, MAX_DESCRIPTION_LENGTH);
  const boundary = candidate.lastIndexOf(" ");
  const clipped = candidate.slice(0, boundary > MIN_DESCRIPTION_LENGTH ? boundary : MAX_DESCRIPTION_LENGTH - 1);
  return `${clipped.replace(/[.,;:!?]+$/, "")}.`;
}

/** Judul akhir di tab dan hasil pencarian. Beranda tidak diberi akhiran. */
export const fullTitle = (path: string, title: string) => (path === "/" ? title : `${title} | ${SITE_NAME}`);

/** Tambahkan kalimat penutup hanya bila masih muat dalam 160 karakter. */
function withSuffix(base: string, suffix: string) {
  const b = base.replace(/\s+/g, " ").trim();
  return b.length + suffix.length <= MAX_DESCRIPTION_LENGTH ? `${b}${suffix}` : b;
}

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: new URL(it.path, SITE).toString(),
  })),
});

/** "kelas 10", "kelas 7–9", "kelas 10–12" dari tag Capaian Pembelajaran. */
export function kelasLabel(tags?: CpTag[]): string {
  if (!tags?.length) return "";
  const start = { D: 7, E: 10, F: 11 } as const;
  const end = { D: 9, E: 10, F: 12 } as const;
  const from = Math.min(...tags.map((t) => start[t.fase]));
  const to = Math.max(...tags.map((t) => end[t.fase]));
  return from === to ? `kelas ${from}` : `kelas ${from}–${to}`;
}

function learningResource(opts: {
  name: string;
  description: string;
  path: string;
  type: string;
  about: string;
  teaches: string[];
  cp?: CpTag[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: opts.name,
    description: opts.description,
    url: new URL(opts.path, SITE).toString(),
    inLanguage: "id-ID",
    learningResourceType: opts.type,
    interactivityType: "active",
    isAccessibleForFree: true,
    teaches: opts.teaches,
    educationalAlignment: (opts.cp ?? []).map((tag) => ({
      "@type": "AlignmentObject",
      alignmentType: "teaches",
      educationalFramework: "Capaian Pembelajaran Matematika Kurikulum Merdeka",
      targetName: `${cpLabel(tag)}: ${tag.fokus}`,
    })),
    about: opts.about,
    author: { "@id": `${SITE}/#founder` },
    isPartOf: { "@id": `${SITE}/#website` },
  };
}

/* ───────── Halaman statis ───────── */

export const HOME_SEO: PageSeo = {
  title: "1729 | Simulasi Matematika Interaktif, Latihan Soal dan Slide",
  description:
    "Belajar matematika SMP dan SMA lewat simulasi interaktif, latihan soal dengan pembahasan, dan slide PPT sesuai Kurikulum Merdeka. Cocok untuk guru dan siswa.",
};

export const ABOUT_SEO: PageSeo = {
  title: "Tentang 1729",
  description:
    "Mengapa 1729 dibuat: simulasi dan presentasi interaktif untuk membantu guru menjelaskan konsep matematika SMP dan SMA.",
};

export const simulasiHubSeo = (count: number): PageSeo => ({
  title: "Simulasi Matematika Interaktif SMP dan SMA",
  description: `${count} simulasi matematika interaktif sesuai Kurikulum Merdeka: fungsi kuadrat, trigonometri, vektor, turunan, integral, irisan kerucut, dan lainnya.`,
  jsonLd: [
    breadcrumb([
      { name: "Beranda", path: "/" },
      { name: "Simulasi", path: "/simulasi" },
    ]),
  ],
});

export const LATIHAN_HUB_SEO: PageSeo = {
  title: "Latihan Soal Matematika SMA dan Pembahasan",
  description:
    "Paket latihan soal matematika SMA berjenjang dari mudah sampai HOTS, termasuk latihan TKA, dengan umpan balik seketika dan pembahasan langkah demi langkah.",
  jsonLd: [
    breadcrumb([
      { name: "Beranda", path: "/" },
      { name: "Latihan soal", path: "/latihan" },
    ]),
  ],
};

export const SLIDES_HUB_SEO: PageSeo = {
  title: "Slide Matematika Interaktif (PPT) untuk Guru SMP dan SMA",
  description:
    "Slide PPT matematika interaktif untuk guru: setiap langkah penjelasan menggerakkan simulasinya. Tersedia SPLDV, fungsi kuadrat, matriks, lingkaran, dan lainnya.",
  jsonLd: [
    breadcrumb([
      { name: "Beranda", path: "/" },
      { name: "Slides", path: "/slides" },
    ]),
  ],
};

export const SHOP_SEO: PageSeo = {
  title: "Toko Bahan Ajar Matematika",
  description:
    "Pilih modul ajar, bank soal, slide, dan LKPD matematika untuk SMP atau SMA. Bahan ajar digital dapat diedit dan disesuaikan dengan kebutuhan kelas.",
};

/* ───────── Halaman per materi ───────── */

export function simulationSeo(sim: {
  slug: string;
  title: string;
  summary: string;
  concepts: string[];
  category: string;
}): PageSeo {
  const path = `/simulasi/${sim.slug}`;
  const cp = CP_SIMULASI[sim.slug];
  const kelas = kelasLabel(cp);
  const title = `Simulasi ${sim.title} Interaktif${kelas ? ` ${kelas[0].toUpperCase()}${kelas.slice(1)}` : ""}`;
  const description = fitSeoDescription(
    withSuffix(sim.summary, kelas ? ` Gratis untuk ${kelas} Kurikulum Merdeka.` : " Gratis dan sesuai Kurikulum Merdeka."),
  );
  return {
    title,
    description,
    jsonLd: [
      learningResource({ name: title, description, path, type: "Simulasi interaktif", about: sim.category, teaches: sim.concepts, cp }),
      breadcrumb([
        { name: "Beranda", path: "/" },
        { name: "Simulasi", path: "/simulasi" },
        { name: sim.title, path },
      ]),
    ],
  };
}

/** "Polinomial" -> "Latihan Soal Polinomial"; "Latihan Soal TKA SMA" dibiarkan. */
export const latihanName = (topic: string) => (/^latihan soal/i.test(topic) ? topic : `Latihan Soal ${topic}`);

export function latihanSeo(m: { slug: string; topic: string; description: string }): PageSeo {
  const path = `/latihan/${m.slug}`;
  const cp = CP_LATIHAN[m.slug];
  const kelas = kelasLabel(cp);
  const title = `${latihanName(m.topic)} dan Pembahasan`;
  const isTka = /\btka\b/i.test(m.topic);
  const suffix = isTka
    ? " Gratis, lengkap dengan kunci dan pembahasan."
    : kelas
      ? ` Gratis untuk ${kelas}, lengkap dengan pembahasan.`
      : " Gratis, lengkap dengan pembahasan.";
  const description = fitSeoDescription(withSuffix(m.description, suffix));
  return {
    title,
    description,
    jsonLd: [
      learningResource({ name: title, description, path, type: "Latihan soal", about: m.topic, teaches: [m.topic], cp }),
      breadcrumb([
        { name: "Beranda", path: "/" },
        { name: "Latihan soal", path: "/latihan" },
        { name: latihanName(m.topic), path },
      ]),
    ],
  };
}

export function slideSeo(deck: {
  slug: string;
  title: string;
  summary: string;
  concepts: string[];
  category: string;
  level: string;
}): PageSeo {
  const path = `/slides/${deck.slug}`;
  const cp = CP_SLIDE[deck.slug];
  const title = `Slide ${deck.title} (PPT Interaktif)`;
  const description = fitSeoDescription(withSuffix(deck.summary, ` Slide matematika ${deck.level} untuk guru.`));
  return {
    title,
    description,
    jsonLd: [
      learningResource({ name: title, description, path, type: "Presentasi interaktif", about: deck.category, teaches: deck.concepts, cp }),
      breadcrumb([
        { name: "Beranda", path: "/" },
        { name: "Slides", path: "/slides" },
        { name: deck.title, path },
      ]),
    ],
  };
}
