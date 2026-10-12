import { useEffect } from "react";

const SITE = "https://1729.blog";
const MIN_DESCRIPTION_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 160;
const DESCRIPTION_EXTENSION = " Latihan berjenjang dan pembahasan bertahap membantu memperkuat pemahaman.";

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

export function fitSeoDescription(description: string) {
  let normalized = description.replace(/\s+/g, " ").trim();
  while (normalized.length < MIN_DESCRIPTION_LENGTH) normalized += DESCRIPTION_EXTENSION;
  if (normalized.length <= MAX_DESCRIPTION_LENGTH) return normalized;

  const candidate = normalized.slice(0, MAX_DESCRIPTION_LENGTH);
  const boundary = candidate.lastIndexOf(" ");
  const clipped = candidate.slice(0, boundary > MIN_DESCRIPTION_LENGTH ? boundary : MAX_DESCRIPTION_LENGTH - 1);
  return `${clipped.replace(/[.,;:!?]+$/, "")}.`;
}

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
    const fullTitle = path === "/" ? title : `${title} | 1729`;
    const url = new URL(path, SITE).toString();
    const metaDescription = fitSeoDescription(description);
    const imageUrl = image ? new URL(image, SITE).toString() : undefined;

    document.title = fullTitle;
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

    meta("property", "og:title", fullTitle);
    meta("property", "og:description", metaDescription);
    meta("property", "og:url", url);
    if (imageUrl) {
      meta("property", "og:image", imageUrl);
      meta("name", "twitter:image", imageUrl);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }
    meta("name", "twitter:title", fullTitle);
    meta("name", "twitter:description", metaDescription);

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

/** BreadcrumbList siap pakai. */
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
