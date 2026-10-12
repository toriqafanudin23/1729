import katex from "katex";

/* ------------------------------------------------------------------ *
 *  Mengubah string HTML yang memuat \( ... \) dan \[ ... \] menjadi
 *  HTML dengan KaTeX yang sudah dirender. Dirender sebagai string,
 *  bukan lewat efek DOM, sehingga:
 *   - tidak ada kilatan teks LaTeX mentah,
 *   - aman dipakai ulang/dimount ulang (mis. saat tombol "Ulangi"),
 *   - hasilnya di-cache per ekspresi.
 * ------------------------------------------------------------------ */

const MATH = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;
const cache = new Map<string, string>();

// Isi HTML sudah di-escape (&lt; &gt; &amp;), KaTeX butuh karakter aslinya.
const decode = (s: string) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

function tex(src: string, display: boolean): string {
  const key = (display ? "D:" : "I:") + src;
  const hit = cache.get(key);
  if (hit) return hit;
  const out = katex.renderToString(decode(src).trim(), {
    displayMode: display,
    throwOnError: false,
    strict: "ignore",
    output: "htmlAndMathml",
  });
  cache.set(key, out);
  return out;
}

export function renderMath(html: string): string {
  return html.replace(MATH, (_m, display?: string, inline?: string) =>
    display !== undefined ? tex(display, true) : tex(inline as string, false),
  );
}
