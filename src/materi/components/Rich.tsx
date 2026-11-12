import { createElement, memo, useMemo } from "react";
import "katex/dist/katex.min.css";
import { renderMath } from "../../pages/latihan_soal/lib/math";

interface RichProps {
  /** HTML dengan rumus \( ... \) atau \[ ... \]. Isinya berasal dari berkas materi, bukan input pengguna. */
  html: string;
  as?: "div" | "span" | "p" | "li" | "h2" | "h3";
  className?: string;
  id?: string;
}

/** Satu-satunya pintu untuk menampilkan teks materi yang memuat rumus. */
export const Rich = memo(function Rich({ html, as = "div", className = "", id }: RichProps) {
  const rendered = useMemo(() => renderMath(html), [html]);
  return createElement(as, {
    id,
    className: `mt-rich ${className}`.trim(),
    dangerouslySetInnerHTML: { __html: rendered },
  });
});
