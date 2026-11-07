import { createElement, memo, useMemo } from "react";
import { renderMath } from "../lib/math";

interface RichProps {
  /** HTML dengan penanda KaTeX \( ... \) / \[ ... \]. Konten berasal dari file data, bukan input pengguna. */
  html: string;
  as?: "div" | "span" | "p";
  className?: string;
}

/** Satu-satunya pintu masuk untuk menampilkan teks soal yang memuat rumus. */
export const Rich = memo(function Rich({ html, as = "div", className = "" }: RichProps) {
  const rendered = useMemo(() => renderMath(html), [html]);
  return createElement(as, {
    className: `lt-rich ${className}`.trim(),
    dangerouslySetInnerHTML: { __html: rendered },
  });
});

/** Gambar SVG soal. Warna aslinya sudah dipetakan ke palet slate di file data. */
export function Figure({ svg }: { svg: string }) {
  return <figure className="lt-figure" dangerouslySetInnerHTML={{ __html: svg }} />;
}
