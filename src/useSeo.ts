import { useEffect } from "react";

import { DEFAULT_OG_IMAGE, SITE, breadcrumb, fitSeoDescription, fullTitle } from "./seoText";

export { breadcrumb, fitSeoDescription };

type SeoOptions = {
  /** Judul halaman, tanpa nama situs. Contoh: "Turunan" */
  title: string;
  /** 120–160 karakter, unik untuk tiap halaman. */
  description: string;
  /** Path route, contoh: "/simulasi/turunan" */
  path: string;
  image?: string;
  /** Untuk halaman 404 atau halaman yang tidak perlu diindeks. */
  noindex?: boolean;
  /** Data terstruktur khusus halaman (BreadcrumbList, LearningResource, dll). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function upsert(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  set(el);
}

const meta = (attr: "name" | "property", key: string, content: string) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute(attr, key);
      return m;
    },
    (el) => el.setAttribute("content", content),
  );

export function useSeo({ title, description, path, image, noindex = false, jsonLd }: SeoOptions) {
  useEffect(() => {
    const pageTitle = fullTitle(path, title);
    const url = new URL(path, SITE).toString();
    const metaDescription = fitSeoDescription(description);
    const imageUrl = new URL(image ?? DEFAULT_OG_IMAGE, SITE).toString();

    document.title = pageTitle;
    meta("name", "description", metaDescription);
    meta(
      "name",
      "robots",
      noindex
        ? "noindex, follow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );

    upsert(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement("link");
        l.rel = "canonical";
        return l;
      },
      (el) => el.setAttribute("href", url),
    );

    meta("property", "og:title", pageTitle);
    meta("property", "og:description", metaDescription);
    meta("property", "og:url", url);
    meta("property", "og:type", "website");
    meta("property", "og:image", imageUrl);
    meta("property", "og:image:width", "1200");
    meta("property", "og:image:height", "630");
    meta("property", "og:image:alt", "1729: simulasi matematika interaktif, latihan soal, dan slide");
    meta("property", "og:locale", "id_ID");
    meta("property", "og:site_name", "1729");
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:image", imageUrl);
    meta("name", "twitter:title", pageTitle);
    meta("name", "twitter:description", metaDescription);

    // Hasil prerender sudah memuat JSON-LD halaman; buang agar tidak ganda.
    document.head.querySelectorAll('script[type="application/ld+json"][data-route]').forEach((el) => el.remove());

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.route = "true";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => script?.remove();
    // jsonLd sengaja tidak masuk dependensi; ubah lewat path/title.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, noindex]);
}
