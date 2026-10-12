import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Transformasi Geometri.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 *
 *  Gambar bidang koordinat dibangun oleh fungsi bantu `bidang()` di bawah
 *  (hasilnya string <svg> biasa, sama seperti figure pada turunan.ts).
 * ------------------------------------------------------------------ */
const h = String.raw;

/* ============================ Fungsi bantu gambar ============================ */

const r = (n: number) => String(Math.round(n * 10) / 10);

type Anchor = "start" | "middle" | "end";

interface Kanvas {
  /** Membungkus isi dengan clip-path area grafik. */
  clip: (isi: string) => string;
  seg: (x1: number, y1: number, x2: number, y2: number, warna: string, tebal?: number, putus?: string) => string;
  poly: (pts: [number, number][], warna: string) => string;
  kurva: (pts: [number, number][], warna: string) => string;
  rect: (x1: number, y1: number, x2: number, y2: number, warna: string, opa: number) => string;
  dot: (x: number, y: number, label?: string, dx?: number, dy?: number, anchor?: Anchor, rad?: number) => string;
  txt: (x: number, y: number, teks: string, dx?: number, dy?: number, anchor?: Anchor, warna?: string) => string;
}

function bidang(
  o: {
    id: string;
    label: string;
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    ux: number;
    uy?: number;
  },
  gambar: (k: Kanvas) => string,
): string {
  const uy = o.uy ?? o.ux;
  const W = (o.xmax - o.xmin) * o.ux;
  const H = (o.ymax - o.ymin) * uy;
  const X = (x: number) => 24 + (x - o.xmin) * o.ux;
  const Y = (y: number) => 22 + (o.ymax - y) * uy;
  const vw = W + 48;
  const vh = H + 44;
  const X0 = X(0);
  const Y0 = Y(0);

  const txt: Kanvas["txt"] = (x, y, teks, dx = 0, dy = 0, anchor = "start", warna = "currentColor") =>
    `<text x="${r(X(x) + dx)}" y="${r(Y(y) + dy)}" text-anchor="${anchor}" fill="${warna}">${teks}</text>`;

  const k: Kanvas = {
    clip: (isi) => `<g clip-path="url(#${o.id})">${isi}</g>`,
    seg: (x1, y1, x2, y2, warna, tebal = 2, putus) =>
      `<line x1="${r(X(x1))}" y1="${r(Y(y1))}" x2="${r(X(x2))}" y2="${r(Y(y2))}" stroke="${warna}" stroke-width="${tebal}" stroke-linecap="round"${putus ? ` stroke-dasharray="${putus}"` : ""}></line>`,
    poly: (pts, warna) =>
      `<polygon points="${pts.map(([x, y]) => `${r(X(x))},${r(Y(y))}`).join(" ")}" fill="${warna}" fill-opacity="0.18" stroke="${warna}" stroke-width="2.2" stroke-linejoin="round"></polygon>`,
    kurva: (pts, warna) =>
      `<polyline points="${pts.map(([x, y]) => `${r(X(x))},${r(Y(y))}`).join(" ")}" fill="none" stroke="${warna}" stroke-width="2.6" stroke-linecap="round"></polyline>`,
    rect: (x1, y1, x2, y2, warna, opa) =>
      `<rect x="${r(X(x1))}" y="${r(Y(y2))}" width="${r(X(x2) - X(x1))}" height="${r(Y(y1) - Y(y2))}" fill="${warna}" fill-opacity="${opa}"></rect>`,
    dot: (x, y, label, dx = 0, dy = 0, anchor = "start", rad = 3.6) =>
      `<circle cx="${r(X(x))}" cy="${r(Y(y))}" r="${rad}" fill="#dc2626"></circle>` +
      (label ? txt(x, y, label, dx, dy, anchor) : ""),
    txt,
  };

  let s = `<svg aria-label="${o.label}" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: ${vw}px; height: auto" viewBox="0 0 ${vw} ${vh}">`;
  s += `<clipPath id="${o.id}"><rect x="24" y="22" width="${W}" height="${H}"></rect></clipPath>`;
  for (let i = o.xmin; i <= o.xmax; i++)
    s += `<line x1="${r(X(i))}" y1="${r(Y(o.ymin))}" x2="${r(X(i))}" y2="22" stroke="currentColor" stroke-opacity="0.13"></line>`;
  for (let j = o.ymin; j <= o.ymax; j++)
    s += `<line x1="24" y1="${r(Y(j))}" x2="${24 + W}" y2="${r(Y(j))}" stroke="currentColor" stroke-opacity="0.13"></line>`;
  s += `<line x1="24" y1="${r(Y0)}" x2="${24 + W + 8}" y2="${r(Y0)}" stroke="currentColor" stroke-width="1.6"></line>`;
  s += `<line x1="${r(X0)}" y1="${r(Y(o.ymin))}" x2="${r(X0)}" y2="14" stroke="currentColor" stroke-width="1.6"></line>`;
  s += `<polygon points="${24 + W + 8},${r(Y0)} ${24 + W + 1},${r(Y0 - 3.5)} ${24 + W + 1},${r(Y0 + 3.5)}" fill="currentColor"></polygon>`;
  s += `<polygon points="${r(X0)},14 ${r(X0 - 3.5)},21 ${r(X0 + 3.5)},21" fill="currentColor"></polygon>`;
  s += `<text x="${24 + W + 11}" y="${r(Y0 + 4)}" font-style="italic" fill="currentColor">x</text>`;
  s += `<text x="${r(X0 + 7)}" y="16" font-style="italic" fill="currentColor">y</text>`;
  for (let i = o.xmin; i <= o.xmax; i++)
    if (i !== 0)
      s += `<text x="${r(X(i))}" y="${r(Y0 + 13)}" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity="0.7">${i}</text>`;
  for (let j = o.ymin; j <= o.ymax; j++)
    if (j !== 0)
      s += `<text x="${r(X0 - 5)}" y="${r(Y(j) + 3.5)}" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity="0.7">${j}</text>`;
  s += `<text x="${r(X0 - 5)}" y="${r(Y0 + 13)}" text-anchor="end" font-size="9.5" fill="currentColor">O</text>`;
  s += gambar(k);
  s += `</svg>`;
  return s;
}

/** Papan permainan blok L (uraian 1). */
function papan(): string {
  const cx = (kol: number) => 41 + 34 * (kol - 1);
  const cy = (bar: number) => 277 - 34 * bar;
  let s = `<svg aria-label="Papan permainan 8 kolom dan 7 baris, blok L biru, lubang putus-putus, dan garis x = 5" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 354px; height: auto" viewBox="0 0 354 316">`;
  for (let i = 0; i < 9; i++)
    s += `<line x1="${41 + 34 * i}" y1="277" x2="${41 + 34 * i}" y2="39" stroke="#9ca3af" stroke-width="0.8"></line>`;
  for (let j = 0; j < 8; j++)
    s += `<line x1="41" y1="${39 + 34 * j}" x2="313" y2="${39 + 34 * j}" stroke="#9ca3af" stroke-width="0.8"></line>`;
  s += `<line x1="194" y1="277" x2="194" y2="39" stroke="#7c2d12" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4"></line>`;
  const abu: [number, number][] = [];
  for (let kol = 1; kol <= 5; kol++) for (let bar = 1; bar <= 3; bar++) abu.push([kol, bar]);
  abu.push([6, 2], [6, 3], [8, 1], [8, 2], [8, 3]);
  for (const [kol, bar] of abu)
    s += `<rect x="${cx(kol)}" y="${cy(bar)}" width="34" height="34" fill="#6b7280" fill-opacity="0.35"></rect>`;
  s += `<rect x="41" y="39" width="272" height="238" fill="none" stroke="#dc2626" stroke-width="2"></rect>`;
  s += `<polygon points="211,277 279,277 279,175 245,175 245,243 211,243" fill="#7c2d12" fill-opacity="0.12" stroke="#7c2d12" stroke-width="2" stroke-linejoin="round" stroke-dasharray="5 3"></polygon>`;
  const blok: [number, number][] = [[2, 6], [3, 6], [4, 6], [4, 7]];
  for (const [kol, bar] of blok)
    s += `<rect x="${cx(kol)}" y="${cy(bar)}" width="34" height="34" fill="#2563eb" fill-opacity="0.45" stroke="#2563eb" stroke-width="2"></rect>`;
  s += `<circle cx="126" cy="90" r="3.5" fill="#dc2626"></circle>`;
  s += `<text x="194" y="31" text-anchor="middle" fill="#7c2d12">x = 5</text>`;
  for (let kol = 1; kol <= 8; kol++)
    s += `<text x="${58 + 34 * (kol - 1)}" y="293" text-anchor="middle" fill="currentColor">${kol}</text>`;
  for (let bar = 1; bar <= 7; bar++)
    s += `<text x="34" y="${264 - 34 * (bar - 1)}" text-anchor="end" fill="currentColor">${bar}</text>`;
  s += `</svg>`;
  return s;
}

/** Meja biliar (uraian 5). */
function biliar(): string {
  let s = `<svg aria-label="Meja biliar 8 kali 4 dengan bola putih A(2,1) dan bola sasaran B(6,1)" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 408px; height: auto" viewBox="0 0 408 204">`;
  for (let i = 0; i < 9; i++)
    s += `<line x1="${44 + 40 * i}" y1="182" x2="${44 + 40 * i}" y2="22" stroke="currentColor" stroke-opacity="0.13"></line>`;
  for (let j = 0; j < 5; j++)
    s += `<line x1="44" y1="${22 + 40 * j}" x2="364" y2="${22 + 40 * j}" stroke="currentColor" stroke-opacity="0.13"></line>`;
  s += `<rect x="44" y="22" width="320" height="160" fill="#16a34a" fill-opacity="0.08" stroke="#dc2626" stroke-width="2.5"></rect>`;
  s += `<text x="38" y="197" text-anchor="end" fill="currentColor">(0, 0)</text>`;
  s += `<text x="370" y="197" text-anchor="start" fill="currentColor">(8, 0)</text>`;
  s += `<text x="370" y="16" text-anchor="start" fill="currentColor">(8, 4)</text>`;
  s += `<text x="38" y="16" text-anchor="end" fill="currentColor">(0, 4)</text>`;
  s += `<text x="204" y="14" text-anchor="middle" fill="#7c2d12">dinding atas</text>`;
  s += `<text x="357" y="106" text-anchor="end" fill="#7c2d12">dinding kanan</text>`;
  s += `<circle cx="124" cy="142" r="3.6" fill="#dc2626"></circle><text x="124" y="158" text-anchor="middle" fill="currentColor">A(2, 1)</text>`;
  s += `<circle cx="284" cy="142" r="3.6" fill="#be185d"></circle><text x="284" y="158" text-anchor="middle" fill="currentColor">B(6, 1)</text>`;
  s += `</svg>`;
  return s;
}

/* ================================ Gambar soal ================================ */

const figPg2 = bidang(
  { id: "tg-c1", label: "Segitiga ABC dengan A(-3,3), B(1,3), C(-1,6) dan garis putus-putus y = 2", xmin: -5, xmax: 5, ymin: -3, ymax: 7, ux: 24 },
  (k) =>
    k.clip(k.seg(-5, 2, 5, 2, "#7c2d12", 2, "6 4")) +
    k.poly([[-3, 3], [1, 3], [-1, 6]], "#2563eb") +
    k.txt(5, 2, "y = 2", -6, -6, "end", "#7c2d12") +
    k.dot(-3, 3, "A", -6, -6, "end", 3) +
    k.dot(1, 3, "B", 6, -6, "start", 3) +
    k.dot(-1, 6, "C", 0, -8, "middle", 3),
);

const figPg7 = bidang(
  { id: "tg-c2", label: "Persegi ABCD dengan A(2,1), B(5,1), C(5,4), D(2,4)", xmin: -1, xmax: 9, ymin: -1, ymax: 8, ux: 26 },
  (k) =>
    k.poly([[2, 1], [5, 1], [5, 4], [2, 4]], "#2563eb") +
    k.dot(2, 1, "A(2, 1)", -6, 15, "end") +
    k.dot(5, 1, "B", 6, 15, "start", 3) +
    k.dot(2, 4, "D", -6, -6, "end", 3) +
    k.dot(5, 4, "C(5, 4)", 6, -6, "start"),
);

const figPg8 = bidang(
  { id: "tg-c3", label: "Garis 2x + 3y = 6 melalui (3,0) dan (0,2)", xmin: -4, xmax: 6, ymin: -4, ymax: 6, ux: 26 },
  (k) =>
    k.clip(k.seg(-3, 4, 6, -2, "#2563eb", 2)) +
    k.txt(-3, 4, "2x + 3y = 6", 6, -6, "start", "#2563eb") +
    k.dot(3, 0, "(3, 0)", 6, -6, "start") +
    k.dot(0, 2, "(0, 2)", 6, -6, "start"),
);

const figPg9 = bidang(
  { id: "tg-c4", label: "Segitiga ABC dengan A(-2,1), B(4,1), C(1,5)", xmin: -3, xmax: 5, ymin: -1, ymax: 6, ux: 30 },
  (k) =>
    k.poly([[-2, 1], [4, 1], [1, 5]], "#2563eb") +
    k.dot(-2, 1, "A(-2, 1)", -6, 15, "end") +
    k.dot(4, 1, "B(4, 1)", 6, 15, "start") +
    k.dot(1, 5, "C(1, 5)", 6, -6, "start"),
);

const figPg11 = bidang(
  { id: "tg-c5", label: "Titik P(1,5), titik C(2,-1), dan garis putus-putus y = x + 2", xmin: -3, xmax: 7, ymin: -3, ymax: 8, ux: 26 },
  (k) =>
    k.clip(k.seg(-3, -1, 7, 9, "#7c2d12", 2, "6 4")) +
    k.txt(4.4, 5.8, "y = x + 2", 0, 0, "start", "#7c2d12") +
    k.dot(1, 5, "P(1, 5)", -6, -6, "end") +
    k.dot(2, -1, "C(2, -1)", 6, 15, "start"),
);

const parabola: [number, number][] = [];
for (let i = -5; i <= 45; i++) {
  const x = i / 10;
  parabola.push([x, x * x - 4 * x + 5]);
}
const figPg12 = bidang(
  { id: "tg-c6", label: "Parabola y = x kuadrat dikurang 4x ditambah 5 dengan titik puncak (2,1)", xmin: -3, xmax: 6, ymin: -3, ymax: 7, ux: 26 },
  (k) => k.clip(k.kurva(parabola, "#2563eb")) + k.dot(2, 1, "(2, 1)", 6, 15, "start"),
);

const figPg13 = bidang(
  { id: "tg-c7", label: "Titik A(2,1), A aksen (-2,-5), dan B(0,-1)", xmin: -4, xmax: 5, ymin: -6, ymax: 5, ux: 28 },
  (k) =>
    k.clip(k.seg(-4, -8, 5, 5.5, "#6b7280", 1.5, "5 4")) +
    k.dot(2, 1, "A(2, 1)", 7, 4, "start") +
    k.dot(-2, -5, "A'(-2, -5)", -7, 4, "end") +
    k.dot(0, -1, "B(0, -1)", 6, 15, "start"),
);

const figPg14 = bidang(
  { id: "tg-c8", label: "Segitiga ABC dan segitiga A aksen B aksen C aksen", xmin: -1, xmax: 5, ymin: -1, ymax: 4, ux: 40 },
  (k) =>
    k.poly([[0, 0], [3, 0], [0, 2]], "#2563eb") +
    k.poly([[4, 2], [1, 2], [4, 0]], "#dc2626") +
    k.txt(0, 0, "A", 6, 15) +
    k.txt(3, 0, "B", 6, -6) +
    k.txt(0, 2, "C", -6, -6, "end") +
    k.txt(4, 2, "A'", 6, -6, "start", "#dc2626") +
    k.txt(1, 2, "B'", 0, -8, "middle", "#dc2626") +
    k.txt(4, 0, "C'", 6, 15, "start", "#dc2626"),
);

const figPg15 = `<svg aria-label="Persegi sisi 6 cm dan bayangannya setelah diputar 45 derajat, irisannya diarsir" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 306px; height: auto" viewBox="0 0 306 302"><polygon points="236.8,116.0 187.6,66.8 118.0,66.8 68.8,116.0 68.8,185.6 118.0,234.8 187.6,234.8 236.8,185.6" fill="#2563eb" fill-opacity="0.4" stroke="none"></polygon><polygon points="68.8,234.8 236.8,234.8 236.8,66.8 68.8,66.8" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linejoin="round"></polygon><polygon points="271.6,150.8 152.8,32.0 34.0,150.8 152.8,269.6" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linejoin="round"></polygon><circle cx="152.8" cy="150.8" r="3" fill="#dc2626"></circle><text x="158.8" y="165.8" text-anchor="start" fill="currentColor">O</text><text x="194.8" y="250.8" text-anchor="middle" fill="currentColor">sisi 6 cm</text></svg>`;

const figPg16 = bidang(
  { id: "tg-c10", label: "Sungai di antara garis y=2 dan y=4, desa A(1,10) di atas dan desa B(7,0) di bawah", xmin: 0, xmax: 8, ymin: -1, ymax: 11, ux: 28, uy: 20 },
  (k) =>
    k.rect(0, 2, 8, 4, "#2563eb", 0.15) +
    k.clip(k.seg(0, 2, 8, 2, "#7c2d12", 1.5, "6 4") + k.seg(0, 4, 8, 4, "#7c2d12", 1.5, "6 4")) +
    k.txt(5.45, 2.85, "sungai", 0, 0, "start", "#7c2d12") +
    k.dot(1, 10, "A(1, 10)", 7, 4, "start") +
    k.dot(7, 0, "B(7, 0)", 0, -8, "middle"),
);

const figPg17 = bidang(
  { id: "tg-c11", label: "Titik A(0,5), A aksen (4,3), dan B(5,5)", xmin: -2, xmax: 8, ymin: -2, ymax: 8, ux: 28 },
  (k) =>
    k.clip(k.seg(0, 5, 4, 3, "#6b7280", 1.5, "5 4")) +
    k.dot(0, 5, "A(0, 5)", -6, -6, "end") +
    k.dot(4, 3, "A'(4, 3)", 6, 15, "start") +
    k.dot(5, 5, "B(5, 5)", 6, -6, "start"),
);

const figStimulus = bidang(
  { id: "tg-c12", label: "Segitiga ABC dengan A(1,1), B(3,1), C(1,2) dan garis putus-putus x = 2", xmin: -1, xmax: 6, ymin: -1, ymax: 4, ux: 42 },
  (k) =>
    k.clip(k.seg(2, -1, 2, 4, "#7c2d12", 2, "6 4")) +
    k.poly([[1, 1], [3, 1], [1, 2]], "#2563eb") +
    k.txt(2, 4, "x = 2", 6, -6, "start", "#7c2d12") +
    k.txt(1, 1, "A", -6, 15, "end") +
    k.txt(3, 1, "B", 6, 15, "start") +
    k.txt(1, 2, "C", -6, -6, "end"),
);

const figIsian2 = bidang(
  { id: "tg-c13", label: "Persegi ABCD dengan A(1,1), B(4,5), C(8,2), D(5,-2) dan titik P(0,5)", xmin: -1, xmax: 9, ymin: -3, ymax: 7, ux: 30 },
  (k) =>
    k.poly([[1, 1], [4, 5], [8, 2], [5, -2]], "#2563eb") +
    k.txt(1, 1, "A", -7, 4, "end") +
    k.txt(4, 5, "B", 0, -8, "middle") +
    k.txt(8, 2, "C", 7, 4, "start") +
    k.txt(5, -2, "D", 0, 16, "middle") +
    k.dot(0, 5, "P", 6, -6, "start"),
);

const figUraian2 = bidang(
  { id: "tg-c15", label: "Segitiga ABC, titik P(1,2), dan garis layar x = 8", xmin: -1, xmax: 9, ymin: -1, ymax: 7, ux: 32 },
  (k) =>
    k.clip(k.seg(8, -1, 8, 7, "#7c2d12", 2, "6 4")) +
    k.poly([[2, 3], [4, 3], [3, 5]], "#2563eb") +
    k.txt(8, 7, "layar", 6, -6, "start", "#7c2d12") +
    k.txt(2, 3, "A", -7, 4, "end") +
    k.txt(4, 3, "B", 7, 4, "start") +
    k.txt(3, 5, "C", 0, -8, "middle") +
    k.dot(1, 2, "P", -6, 15, "end"),
);

const figUraian3 = bidang(
  { id: "tg-c16", label: "Ruas AB dari A(1,1) ke B(5,1) dan ruas A aksen B aksen dari (4,0) ke (4,4)", xmin: -1, xmax: 6, ymin: -1, ymax: 5, ux: 42 },
  (k) =>
    k.clip(k.seg(1, 1, 5, 1, "#2563eb", 3.5) + k.seg(4, 0, 4, 4, "#dc2626", 3.5)) +
    k.dot(1, 1, "A", -7, 4, "end") +
    k.dot(5, 1, "B", 7, 4, "start") +
    k.dot(4, 0, "A'", 6, 15, "start") +
    k.dot(4, 4, "B'", 0, -8, "middle"),
);

const figUraian4 = bidang(
  { id: "tg-c17", label: "Segitiga OPQ dan bayangannya segitiga O P aksen Q aksen", xmin: -1, xmax: 8, ymin: -2, ymax: 4, ux: 36 },
  (k) =>
    k.poly([[0, 0], [1, 1], [2, -1]], "#2563eb") +
    k.poly([[0, 0], [2, 3], [7, 0]], "#dc2626") +
    k.txt(1, 1, "P", -6, -6, "end") +
    k.txt(2, -1, "Q", 0, 16, "middle") +
    k.txt(2, 3, "P'", 0, -8, "middle", "#dc2626") +
    k.txt(7, 0, "Q'", 6, -6, "start", "#dc2626"),
);

const stimulus = h`<p>Sebuah aplikasi desain memiliki tiga tombol untuk mentransformasikan objek: tombol <strong>R</strong> memutar objek \(90^\circ\) berlawanan arah jarum jam berpusat di \(O\); tombol <strong>F</strong> mencerminkan objek terhadap garis \(x=2\); tombol <strong>G</strong> menggeser objek oleh \(\left[\begin{smallmatrix}3\\-1\end{smallmatrix}\right]\). Satu <em>urutan</em> berarti menekan tombol R, F, G secara berturut-turut. Sebuah logo berbentuk segitiga \(ABC\) dengan \(A(1,1)\), \(B(3,1)\), dan \(C(1,2)\) (lihat gambar) diubah memakai urutan tersebut.</p>`;

/* ================================== Materi ================================== */

const transformasiGeometri: Material = {
  slug: "transformasi-geometri",
  title: "Latihan Soal Transformasi Geometri",
  topic: "Transformasi Geometri",
  description:
    "Translasi, refleksi, rotasi, dilatasi, komposisi transformasi, bayangan garis dan kurva, serta matriks transformasi.",
  durationMinutes: 120,
  notes: [
    h`Soal disusun berjenjang dari mudah sampai HOTS dan memakai bentuk yang
sejalan dengan asesmen terbaru (TKA dan UTBK-SNBT 2026): pilihan ganda
lima opsi, pilihan majemuk kompleks dan kategori berbentuk tabel
pernyataan benar atau salah (soal 5, 10, 14, dan 20), soal berstimulus
(soal 19 dan 20), serta soal berkonteks dengan gambar. Soal HOTS menuntut
proses <em>merumuskan</em>, <em>menggunakan</em>, dan <em>menafsirkan</em>
model matematika.`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Pada soal berbentuk tabel pernyataan, skor diberikan
jika <strong>semua baris</strong> dijawab benar. Tidak ada pengurangan
skor untuk jawaban salah.`,
    h`Notasi: \(P'\) bayangan titik \(P\); \(T\) translasi; \(R\) rotasi
(sudut positif berlawanan arah jarum jam); \(L\) luas. Pada komposisi
\(B\circ A\), transformasi \(A\) dikerjakan lebih dahulu.`,
    "Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan. Jawaban bentuk akar dan pecahan tidak perlu didesimalkan.",
  ],
  sections: [
    {
      id: "pg",
      letter: "A",
      title: "Pilihan Ganda",
      instruction: h`20 soal \(\times\) 2 poin = 40 poin. Pilih jawaban yang paling tepat sesuai bentuk soal.`,
      pointsEach: 2,
      groups: [
        {
          level: "mudah",
          questions: [
            {
              id: "pg-1",
              no: 1,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Pada peta kota, menara pemancar di titik \(A(-2,6)\) dipindahkan ke \(A'(5,1)\) oleh suatu translasi \(T\). Kantor pos di titik \(B(3,-4)\) ikut dipindahkan oleh translasi \(T\) yang sama. Koordinat bayangan kantor pos adalah ....</p>`,
              options: [
                { key: "A", text: h`\((-4,1)\)` },
                { key: "B", text: h`\((10,1)\)` },
                { key: "C", text: h`\((6,-9)\)` },
                { key: "D", text: h`\((10,-9)\)` },
                { key: "E", text: h`\((-4,-9)\)` },
              ],
              answer: "D",
              explanation: h`<p>Vektor translasi \(T=A'-A=(5-(-2),\,1-6)=(7,-5)\). Maka:</p>
<div class="math-display">\[ B'=(3+7,\,-4-5)=(10,-9) \]</div>
<p>Jebakan pilihan A: memakai \(A-A'\), sehingga arah translasi terbalik.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Segitiga \(ABC\) dengan \(A(-3,3)\), \(B(1,3)\), dan \(C(-1,6)\) dicerminkan terhadap garis \(y=2\) (garis putus-putus pada gambar). Koordinat bayangan titik \(C\) adalah ....</p>`,
              figure: figPg2,
              options: [
                { key: "A", text: h`\((-1,-6)\)` },
                { key: "B", text: h`\((-1,-4)\)` },
                { key: "C", text: h`\((-1,-2)\)` },
                { key: "D", text: h`\((-1,10)\)` },
                { key: "E", text: h`\((5,6)\)` },
              ],
              answer: "C",
              explanation: h`<p>Pada refleksi terhadap \(y=k\) berlaku \((x,y)\mapsto(x,\,2k-y)\). Untuk \(C(-1,6)\) dan \(k=2\):</p>
<div class="math-display">\[ C'=(-1,\,4-6)=(-1,-2) \]</div>
<p>Jebakan: memakai sumbu-\(x\) (pilihan A), atau memakai \(k-y\) tanpa dikali \(2\) (pilihan B).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Titik \(Q(-3,5)\) pada layar sebuah permainan diputar sejauh \(270^\circ\) berlawanan arah jarum jam dengan pusat \(O(0,0)\). Koordinat bayangan \(Q\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\((-5,-3)\)` },
                { key: "B", text: h`\((3,-5)\)` },
                { key: "C", text: h`\((5,-3)\)` },
                { key: "D", text: h`\((-3,-5)\)` },
                { key: "E", text: h`\((5,3)\)` },
              ],
              answer: "E",
              explanation: h`<p>Rotasi \(270^\circ\) berlawanan arah jarum jam sama dengan rotasi \(90^\circ\) searah jarum jam, yaitu \((x,y)\mapsto(y,-x)\):</p>
<div class="math-display">\[ Q'=(5,\,3) \]</div>
<p>Jebakan: memakai rotasi \(90^\circ\) berlawanan arah jarum jam (pilihan A) atau rotasi \(180^\circ\) (pilihan B).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Dilatasi berpusat di \(O(0,0)\) memetakan titik \(A(3,-2)\) ke \(A'(-12,8)\). Bayangan titik \(B(-1,5)\) oleh dilatasi yang sama adalah ....</p>`,
              options: [
                { key: "A", text: h`\((4,-20)\)` },
                { key: "B", text: h`\((-4,20)\)` },
                { key: "C", text: h`\((4,20)\)` },
                { key: "D", text: h`\((-20,4)\)` },
                { key: "E", text: h`\((20,-4)\)` },
              ],
              answer: "A",
              explanation: h`<p>Faktor dilatasi \(k=\dfrac{-12}{3}=\dfrac{8}{-2}=-4\). Maka:</p>
<div class="math-display">\[ B'=(-4)(-1,5)=(4,-20) \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "tf",
              level: "mudah",
              prompt: h`<p>Tentukan apakah setiap transformasi berikut <em>selalu</em> mempertahankan luas bangun yang ditransformasikan, dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              statements: [
                h`Refleksi terhadap garis \(y=-x\) mempertahankan luas.`,
                h`Rotasi sebesar \(135^\circ\) dengan pusat \((2,3)\) mempertahankan luas.`,
                h`Dilatasi berpusat di \(O\) dengan faktor \(2\) mempertahankan luas.`,
                h`Translasi oleh \(\left[\begin{smallmatrix}-5\\8\end{smallmatrix}\right]\) mempertahankan luas.`,
                h`Dilatasi berpusat di \((1,1)\) dengan faktor \(-1\) mempertahankan luas.`,
              ],
              answer: ["B", "B", "S", "B", "B"],
              explanation: h`<p>Translasi, rotasi, dan refleksi adalah isometri (jarak dan luas tetap). Dilatasi dengan faktor \(k\) mengalikan luas dengan \(k^{2}\).</p>
<p><strong>(1) Benar.</strong> Refleksi adalah isometri.</p>
<p><strong>(2) Benar.</strong> Rotasi adalah isometri, berapa pun sudut dan pusatnya.</p>
<p><strong>(3) Salah.</strong> Untuk \(k=2\), luas menjadi \(2^{2}=4\) kali semula.</p>
<p><strong>(4) Benar.</strong> Translasi hanya menggeser bangun.</p>
<p><strong>(5) Benar.</strong> Untuk \(k=-1\) berlaku \(k^{2}=1\), sehingga luas tetap.</p>
<p>Jadi, kuncinya adalah <strong>Benar, Benar, Salah, Benar, Benar</strong>.</p>`,
            },
          ],
        },
        {
          level: "sedang",
          questions: [
            {
              id: "pg-6",
              no: 6,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Matriks \(M=\begin{bmatrix}3&amp;-2\\1&amp;4\end{bmatrix}\) memetakan titik \(P\) ke \(P'(0,14)\). Jika titik asal \(P\) dicerminkan terhadap garis \(y=-x\), koordinat bayangannya adalah ....</p>`,
              options: [
                { key: "A", text: h`\((3,2)\)` },
                { key: "B", text: h`\((-3,-2)\)` },
                { key: "C", text: h`\((-2,-3)\)` },
                { key: "D", text: h`\((2,-3)\)` },
                { key: "E", text: h`\((-3,2)\)` },
              ],
              answer: "B",
              explanation: h`<p>Misalkan \(P(a,b)\). Maka \(3a-2b=0\) dan \(a+4b=14\), sehingga \(a=2\) dan \(b=3\).</p>
<p>Refleksi terhadap \(y=-x\): \((x,y)\mapsto(-y,-x)\), jadi \(P\mapsto(-3,-2)\).</p>
<p>Jebakan pilihan A: refleksi terhadap \(y=x\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Persegi \(ABCD\) pada gambar diputar \(90^\circ\) searah jarum jam dengan pusat titik \(C(5,4)\). Koordinat bayangan titik \(A\) adalah ....</p>`,
              figure: figPg7,
              options: [
                { key: "A", text: h`\((8,1)\)` },
                { key: "B", text: h`\((2,7)\)` },
                { key: "C", text: h`\((8,7)\)` },
                { key: "D", text: h`\((-1,7)\)` },
                { key: "E", text: h`\((5,-2)\)` },
              ],
              answer: "B",
              explanation: h`<p>\(A-C=(-3,-3)\). Rotasi \(90^\circ\) searah jarum jam: \((x,y)\mapsto(y,-x)\) memberi \((-3,3)\). Maka:</p>
<div class="math-display">\[ A'=C+(-3,3)=(2,7) \]</div>
<p>Jebakan pilihan A: rotasi berlawanan arah jarum jam memberi \((8,1)\). Perhatikan pula bahwa \(B'=(2,4)=D\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Garis \(2x+3y=6\) (lihat gambar) diputar \(90^\circ\) berlawanan arah jarum jam dengan pusat \(O\). Bayangan garis tersebut memotong sumbu-\(x\) di titik ....</p>`,
              figure: figPg8,
              options: [
                { key: "A", text: h`\((3,0)\)` },
                { key: "B", text: h`\((2,0)\)` },
                { key: "C", text: h`\((-3,0)\)` },
                { key: "D", text: h`\((-2,0)\)` },
                { key: "E", text: h`\((-6,0)\)` },
              ],
              answer: "D",
              explanation: h`<p>Rotasi \(90^\circ\) berlawanan arah jarum jam: \(x'=-y\) dan \(y'=x\), sehingga \(x=y'\) dan \(y=-x'\). Substitusi ke persamaan garis:</p>
<div class="math-display">\[ 2y'-3x'=6 \]</div>
<p>Memotong sumbu-\(x\) saat \(y'=0\): \(-3x'=6\Rightarrow x'=-2\). Titik \((-2,0)\) adalah bayangan dari titik \((0,2)\).</p>
<p>Jebakan pilihan B: rotasi searah jarum jam.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Segitiga \(ABC\) pada gambar ditransformasikan oleh matriks \(\begin{bmatrix}3&amp;1\\-2&amp;4\end{bmatrix}\), kemudian hasilnya didilatasi berpusat di \(O\) dengan faktor \(\frac12\). Luas bayangan akhir adalah .... satuan luas.</p>`,
              figure: figPg9,
              options: [
                { key: "A", text: h`\(42\)` },
                { key: "B", text: h`\(84\)` },
                { key: "C", text: h`\(168\)` },
                { key: "D", text: h`\(21\)` },
                { key: "E", text: h`\(6\)` },
              ],
              answer: "A",
              explanation: h`<p>Luas \(\triangle ABC=\frac12\cdot6\cdot4=12\) dan \(\det=3\cdot4-1\cdot(-2)=14\), sehingga luas setelah matriks \(=14\cdot12=168\).</p>
<p>Dilatasi faktor \(\frac12\) mengalikan luas dengan \(\left(\frac12\right)^{2}=\frac14\):</p>
<div class="math-display">\[ 168\cdot\frac14=42 \]</div>
<p>Jebakan pilihan B: faktor \(\frac12\) tidak dikuadratkan.</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "tf",
              level: "sedang",
              prompt: h`<p>Misalkan \(T_1\) adalah refleksi terhadap sumbu-\(x\) dan \(T_2\) adalah rotasi \(90^\circ\) berlawanan arah jarum jam berpusat di \(O\). Tentukan nilai kebenaran setiap pernyataan berikut dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              statements: [
                h`\((T_2\circ T_1)(3,2)=(2,3)\).`,
                h`\((T_1\circ T_2)(3,2)=(2,3)\).`,
                h`\(T_2\circ T_1\) ekuivalen dengan refleksi terhadap garis \(y=x\).`,
                h`\(T_1\circ T_2\) ekuivalen dengan refleksi terhadap garis \(y=-x\).`,
              ],
              answer: ["B", "S", "B", "B"],
              explanation: h`<p><strong>(1) Benar.</strong> \(T_1(3,2)=(3,-2)\), lalu \(T_2(3,-2)=(2,3)\).</p>
<p><strong>(2) Salah.</strong> \(T_2(3,2)=(-2,3)\), lalu \(T_1(-2,3)=(-2,-3)\neq(2,3)\).</p>
<p><strong>(3) Benar.</strong> \((x,y)\to(x,-y)\to(y,x)\), yaitu refleksi terhadap \(y=x\).</p>
<p><strong>(4) Benar.</strong> \((x,y)\to(-y,x)\to(-y,-x)\), yaitu refleksi terhadap \(y=-x\).</p>
<p>Jadi \(T_1\circ T_2\neq T_2\circ T_1\).</p>
<p>Jadi, kuncinya adalah <strong>Benar, Salah, Benar, Benar</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          note: "Setara UTBK",
          questions: [
            {
              id: "pg-11",
              no: 11,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Pada layar kendali sebuah drone, posisi drone ditandai titik \(P(1,5)\). Posisi tersebut dicerminkan terhadap garis \(y=x+2\), kemudian bayangannya didilatasi berpusat di \(C(2,-1)\) dengan faktor \(-2\). Posisi akhir pada layar adalah ....</p>`,
              figure: figPg11,
              options: [
                { key: "A", text: h`\((-8,-1)\)` },
                { key: "B", text: h`\((-6,-6)\)` },
                { key: "C", text: h`\((-4,-5)\)` },
                { key: "D", text: h`\((4,7)\)` },
                { key: "E", text: h`\((0,-9)\)` },
              ],
              answer: "E",
              explanation: h`<p>Refleksi terhadap \(y=x+2\): geser garis ke \(y=x\) (turun \(2\)), tukar koordinat, lalu geser naik \(2\), sehingga \((x,y)\mapsto(y-2,\,x+2)\). Maka \(P(1,5)\mapsto(3,3)\).</p>
<p>Dilatasi \([C(2,-1),-2]\):</p>
<div class="math-display">\[ C+(-2)\big((3,3)-C\big)=(2,-1)+(-2)(1,4)=(0,-9) \]</div>
<p>Jebakan pilihan C: menganggap cermin adalah \(y=x\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Parabola \(y=x^{2}-4x+5\) pada gambar diputar \(90^\circ\) berlawanan arah jarum jam dengan pusat \(O\). Persamaan bayangannya adalah ....</p>`,
              figure: figPg12,
              options: [
                { key: "A", text: h`\(x=y^{2}-4y+5\)` },
                { key: "B", text: h`\(x=y^{2}+4y+5\)` },
                { key: "C", text: h`\(x=-y^{2}+4y-5\)` },
                { key: "D", text: h`\(y=-x^{2}+4x-5\)` },
                { key: "E", text: h`\(x=-y^{2}-4y-5\)` },
              ],
              answer: "C",
              explanation: h`<p>Rotasi \(90^\circ\) berlawanan arah jarum jam: \(x'=-y\) dan \(y'=x\), sehingga \(x=y'\) dan \(y=-x'\). Substitusi ke \(y=x^{2}-4x+5\):</p>
<div class="math-display">\[ -x'=y'^{2}-4y'+5\ \Rightarrow\ x=-y^{2}+4y-5 \]</div>
<p>Pemeriksaan: puncak \((2,1)\) menjadi \((-1,2)\), cocok dengan \(x=-(2)^{2}+4(2)-5=-1\). Pilihan B adalah hasil rotasi searah jarum jam, dan pilihan A adalah refleksi terhadap \(y=x\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Suatu dilatasi dengan faktor \(3\) memetakan \(A(2,1)\) ke \(A'(-2,-5)\). Titik pusat dilatasi tidak diketahui. Bayangan titik \(B(0,-1)\) oleh dilatasi yang sama adalah ....</p>`,
              figure: figPg13,
              options: [
                { key: "A", text: h`\((0,-3)\)` },
                { key: "B", text: h`\((0,1)\)` },
                { key: "C", text: h`\((8,5)\)` },
                { key: "D", text: h`\((-8,-11)\)` },
                { key: "E", text: h`\((-4,-7)\)` },
              ],
              answer: "D",
              explanation: h`<p>Pusat \(C\) memenuhi \(A'=C+3(A-C)=3A-2C\), sehingga:</p>
<div class="math-display">\[ C=\frac{3A-A'}{2}=\frac{(6+2,\;3+5)}{2}=(4,4) \]</div>
<p>Maka \(B'=3B-2C=(0-8,\,-3-8)=(-8,-11)\). Jebakan pilihan A: menganggap pusat di \(O\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "tf",
              level: "sulit",
              prompt: h`<p>Segitiga \(ABC\) dengan \(A(0,0)\), \(B(3,0)\), \(C(0,2)\) dipetakan ke segitiga \(A'B'C'\) dengan \(A'(4,2)\), \(B'(1,2)\), \(C'(4,0)\) (lihat gambar). Tentukan apakah setiap transformasi berikut memetakan \(\triangle ABC\) tepat ke \(\triangle A'B'C'\) dengan \(A\to A'\), \(B\to B'\), \(C\to C'\), dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              figure: figPg14,
              statements: [
                h`Rotasi \(180^\circ\) berpusat di \((2,1)\).`,
                h`Dilatasi berpusat di \((2,1)\) dengan faktor \(-1\).`,
                h`Refleksi terhadap garis \(y=1\).`,
                h`Refleksi terhadap garis \(y=1\) dilanjutkan refleksi terhadap garis \(x=2\).`,
                h`Translasi oleh \(\left[\begin{smallmatrix}4\\2\end{smallmatrix}\right]\).`,
              ],
              answer: ["B", "B", "S", "B", "S"],
              explanation: h`<p>Pusat \((2,1)\) adalah titik tengah \(AA'\), \(BB'\), dan \(CC'\).</p>
<p><strong>(1) Benar.</strong> Rotasi \(180^\circ\) di \((2,1)\) memetakan \(A\to A'\), \(B\to B'\), \(C\to C'\).</p>
<p><strong>(2) Benar.</strong> Dilatasi faktor \(-1\) dengan pusat yang sama adalah transformasi yang sama dengan rotasi \(180^\circ\).</p>
<p><strong>(3) Salah.</strong> Refleksi \(y=1\) saja memberi \(A\mapsto(0,2)\), bukan \(A'(4,2)\).</p>
<p><strong>(4) Benar.</strong> Refleksi terhadap \(y=1\) lalu \(x=2\) memberi \((x,y)\mapsto(4-x,\,2-y)\), yaitu rotasi \(180^\circ\) di \((2,1)\).</p>
<p><strong>(5) Salah.</strong> Translasi \(\left[\begin{smallmatrix}4\\2\end{smallmatrix}\right]\) memetakan \(B\) ke \((7,2)\neq B'\).</p>
<p>Jadi, kuncinya adalah <strong>Benar, Benar, Salah, Benar, Salah</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Persegi dengan panjang sisi \(6\) cm diputar \(45^\circ\) terhadap titik pusat persegi tersebut. Luas daerah irisan persegi semula dan bayangannya (daerah arsiran pada gambar) adalah .... cm\(^{2}\).</p>`,
              figure: figPg15,
              options: [
                { key: "A", text: h`\(36(\sqrt2-1)\)` },
                { key: "B", text: h`\(72(2-\sqrt2)\)` },
                { key: "C", text: h`\(72(\sqrt2-1)\)` },
                { key: "D", text: h`\(36\sqrt2\)` },
                { key: "E", text: h`\(72\sqrt2\)` },
              ],
              answer: "C",
              explanation: h`<p>Irisan kedua persegi adalah segidelapan beraturan dengan apotema \(3\) cm (setengah sisi persegi). Luasnya:</p>
<div class="math-display">\[ 8\cdot3^{2}\cdot\tan22{,}5^\circ=72(\sqrt2-1)\ \text{cm}^{2}\ (\text{sekitar }29{,}8) \]</div>
<p>Jebakan pilihan B: \(72(2-\sqrt2)\) adalah luas <em>gabungan</em>.</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          note: "Penalaran tingkat tinggi gaya TKA dan UTBK",
          questions: [
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "hots",
              prompt: h`<p>Sebuah sungai lurus memiliki tepi atas pada garis \(y=4\) dan tepi bawah pada garis \(y=2\) (satuan km). Desa \(A(1,10)\) berada di sebelah atas sungai dan desa \(B(7,0)\) di sebelah bawah sungai. Pemerintah membangun satu jembatan lurus yang tegak lurus tepi sungai. Jalan dari \(A\) ke jembatan dan dari jembatan ke \(B\) berupa garis lurus. Panjang lintasan terpendek dari \(A\) ke \(B\) melalui jembatan adalah .... km.</p>`,
              figure: figPg16,
              options: [
                { key: "A", text: h`\(12\)` },
                { key: "B", text: h`\(10\)` },
                { key: "C", text: h`\(11\)` },
                { key: "D", text: h`\(14\)` },
                { key: "E", text: h`\(2\sqrt{34}\)` },
              ],
              answer: "A",
              explanation: h`<p>Geser \(B\) ke atas sejauh lebar sungai (dua satuan) menjadi \(B^{*}(7,2)\). Untuk jembatan \(PQ\) yang tegak lurus tepi sungai, \(QB=PB^{*}\), sehingga lintasan jalan memenuhi:</p>
<div class="math-display">\[ AP+PB^{*}\ge AB^{*}=\sqrt{6^{2}+8^{2}}=10 \]</div>
<p>Tambahkan panjang jembatan \(2\): total \(12\) km. Jembatan berada di \(x=5{,}5\), dengan \(AP=7{,}5\) dan \(QB=2{,}5\).</p>
<p>Jebakan pilihan E: \(AB=2\sqrt{34}\approx11{,}7\) tidak dapat dicapai karena jembatan harus tegak lurus tepi sungai.</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "hots",
              prompt: h`<p>Suatu refleksi memetakan titik \(A(0,5)\) ke \(A'(4,3)\). Bayangan titik \(B(5,5)\) oleh refleksi yang sama adalah ....</p>`,
              figure: figPg17,
              options: [
                { key: "A", text: h`\((3,6)\)` },
                { key: "B", text: h`\((7,1)\)` },
                { key: "C", text: h`\((5,-5)\)` },
                { key: "D", text: h`\((-1,7)\)` },
                { key: "E", text: h`\((1,7)\)` },
              ],
              answer: "E",
              explanation: h`<p>Cermin adalah sumbu ruas \(AA'\): titik tengah \((2,4)\) dan gradien \(AA'=-\frac12\), sehingga gradien cermin \(=2\) dan persamaannya \(y=2x\).</p>
<p>Kaki tegak lurus dari \(B(5,5)\) ke cermin adalah \((3,6)\). Maka:</p>
<div class="math-display">\[ B'=2(3,6)-(5,5)=(1,7) \]</div>
<p>Jebakan pilihan A: kaki tegak lurus; pilihan B: refleksi terhadap \(y=x\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "hots",
              prompt: h`<p>Dilatasi \(D_1\) berpusat di \(P(1,2)\) dengan faktor \(2\) dilanjutkan dilatasi \(D_2\) berpusat di \(Q(4,-1)\) dengan faktor \(-1\). Komposisi \(D_2\circ D_1\) ekuivalen dengan sebuah dilatasi tunggal. Pusat dilatasi tunggal tersebut adalah ....</p>`,
              options: [
                { key: "A", text: h`\((2,1)\)` },
                { key: "B", text: h`\((3,0)\)` },
                { key: "C", text: h`\(\left(\dfrac52,\dfrac12\right)\)` },
                { key: "D", text: h`\((9,0)\)` },
                { key: "E", text: h`\((-3,0)\)` },
              ],
              answer: "B",
              explanation: h`<p>\(D_1(X)=P+2(X-P)=2X-P\) dan \(D_2(Y)=Q-(Y-Q)=2Q-Y\). Komposisinya:</p>
<div class="math-display">\[ D_2(D_1(X))=-2X+P+2Q \]</div>
<p>yaitu dilatasi dengan faktor \(-2\). Titik tetapnya memenuhi \(X=-2X+P+2Q\):</p>
<div class="math-display">\[ X=\frac{P+2Q}{3}=\frac{(1+8,\;2-2)}{3}=(3,0) \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt:
                stimulus +
                h`<p>Jika urutan R, F, G ditekan dua kali berturut-turut (enam tombol), koordinat bayangan akhir titik \(B\) adalah ....</p>`,
              figure: figStimulus,
              options: [
                { key: "A", text: h`\((8,2)\)` },
                { key: "B", text: h`\((7,9)\)` },
                { key: "C", text: h`\((9,7)\)` },
                { key: "D", text: h`\((10,8)\)` },
                { key: "E", text: h`\((12,0)\)` },
              ],
              answer: "C",
              explanation: h`<p>Satu urutan: \(R:(x,y)\mapsto(-y,x)\), \(F:(x,y)\mapsto(4-x,y)\), dan \(G:(x,y)\mapsto(x+3,y-1)\). Gabungannya:</p>
<div class="math-display">\[ T(x,y)=(y+7,\,x-1) \]</div>
<p>Maka \(T(3,1)=(8,2)\) dan \(T(8,2)=(9,7)\). Pemeriksaan: \(T^{2}(x,y)=(x+6,\,y+6)\), sehingga \(B(3,1)\mapsto(9,7)\).</p>
<p>Jebakan pilihan A: hanya satu kali urutan.</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "tf",
              level: "hots",
              prompt:
                stimulus +
                h`<p>Berdasarkan stimulus tersebut, tentukan nilai kebenaran setiap pernyataan berikut dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              figure: figStimulus,
              statements: [
                h`Luas bayangan segitiga \(ABC\) setelah <em>satu kali</em> urutan sama dengan luas semula.`,
                h`Urutan titik \(A'\to B'\to C'\) pada bayangan (satu kali urutan) memiliki arah putaran yang berlawanan dengan arah \(A\to B\to C\) semula.`,
                h`Terdapat sebuah titik yang posisinya tidak berubah setelah satu kali urutan.`,
                h`Setelah urutan ditekan dua kali berturut-turut, setiap titik pada logo tergeser oleh vektor yang sama, yaitu \(\left[\begin{smallmatrix}6\\6\end{smallmatrix}\right]\).`,
              ],
              answer: ["B", "B", "S", "B"],
              explanation: h`<p><strong>(1) Benar.</strong> \(T\) adalah isometri, sehingga luas tetap.</p>
<p><strong>(2) Benar.</strong> \(A'(8,0)\), \(B'(8,2)\), \(C'(9,0)\) berputar searah jarum jam, sedangkan \(A,B,C\) berlawanan arah jarum jam. Bagian linear \(T\) adalah \(\left[\begin{smallmatrix}0&amp;1\\1&amp;0\end{smallmatrix}\right]\) dengan determinan \(-1\).</p>
<p><strong>(3) Salah.</strong> Titik tetap memerlukan \(x=y+7\) dan \(y=x-1\), yang memberi \(0=6\) (tidak ada solusi).</p>
<p><strong>(4) Benar.</strong> \(T^{2}(x,y)=(x+6,\,y+6)\). Jadi \(T\) berupa refleksi geser (<em>glide reflection</em>).</p>
<p>Jadi, kuncinya adalah <strong>Benar, Benar, Salah, Benar</strong>.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: "isian",
      letter: "B",
      title: "Isian Singkat",
      instruction: h`5 soal \(\times\) 4 poin = 20 poin. Ketik hanya jawaban akhir, lalu tekan
<strong>Periksa</strong> atau Enter.`,
      pointsEach: 4,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "isian-1",
              no: 1,
              type: "short",
              level: "sedang",
              prompt: h`<p>Titik \(P(a,b)\) dicerminkan terhadap garis \(y=-x\), kemudian bayangannya diputar \(90^\circ\) berlawanan arah jarum jam dengan pusat \((1,1)\) sehingga menjadi titik \((-2,3)\). Nilai \(a+b\) adalah ....</p>`,
              answer: ["-7", "−7"],
              explanation: h`<p>Refleksi terhadap \(y=-x\): \((a,b)\mapsto(-b,-a)\). Rotasi \(90^\circ\) berlawanan arah jarum jam berpusat \((1,1)\): \((x,y)\mapsto(2-y,\,x)\), sehingga:</p>
<div class="math-display">\[ (-b,-a)\mapsto(2+a,\,-b)=(-2,3) \]</div>
<p>Jadi \(a=-4\) dan \(b=-3\). Jawabannya \(a+b=\) <strong>\(-7\)</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Persegi \(ABCD\) dengan \(A(1,1)\), \(B(4,5)\), \(C(8,2)\), dan \(D(5,-2)\) didilatasi dengan pusat \(P(0,5)\) dan faktor \(-3\). Selisih luas bayangan dan luas persegi semula adalah .... satuan luas.</p>`,
              figure: figIsian2,
              answer: ["200"],
              explanation: h`<p>Sisi \(AB=\sqrt{3^{2}+4^{2}}=5\), sehingga luas semula \(25\). Dilatasi faktor \(-3\) mengalikan luas dengan \((-3)^{2}=9\), yaitu \(225\).</p>
<p>Jadi selisihnya \(225-25=\) <strong>200</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "isian-3",
              no: 3,
              type: "short",
              level: "sulit",
              prompt: h`<p>Titik yang posisinya tidak berubah oleh transformasi “rotasi \(90^\circ\) berlawanan arah jarum jam berpusat di \(O\) dilanjutkan translasi \(\left[\begin{smallmatrix}4\\2\end{smallmatrix}\right]\)” adalah .... (tuliskan dalam bentuk (x,y)).</p>`,
              answer: ["(1,3)", "1,3"],
              explanation: h`<p>Transformasinya \((x,y)\mapsto(-y+4,\;x+2)\). Titik tetap memenuhi \(x=-y+4\) dan \(y=x+2\), sehingga \(x=-x-2+4\Rightarrow x=1\) dan \(y=3\).</p>
<p>Pemeriksaan: \((1,3)\to(-3,1)\to(1,3)\). Jawabannya <strong>\((1,3)\)</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Persegi satuan dengan titik sudut \(O(0,0)\), \(P(1,0)\), \(Q(1,1)\), dan \(R(0,1)\) ditransformasikan oleh matriks \(M=\begin{bmatrix}k&amp;3\\2&amp;k\end{bmatrix}\) sehingga menjadi sebuah jajargenjang berluas \(5\) satuan luas. Pada bayangannya, urutan titik sudut \(O\to P\to Q\to R\) yang semula berlawanan arah jarum jam berubah menjadi searah jarum jam. Nilai \(k^{2}\) adalah ....</p>`,
              answer: ["1"],
              explanation: h`<p>Luas bayangan \(=|\det M|\cdot1=|k^{2}-6|=5\), sehingga \(k^{2}=11\) atau \(k^{2}=1\).</p>
<p>Orientasi berbalik berarti \(\det M&lt;0\), yaitu \(k^{2}&lt;6\). Jadi \(k^{2}=\) <strong>1</strong> (dan \(\det M=-5\)).</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Titik \(P(5,2)\) diputar \(90^\circ\) berlawanan arah jarum jam dengan pusat \(C(1,-1)\). Bayangannya diputar lagi dengan pusat dan arah yang sama, begitu seterusnya sampai terjadi \(2026\) kali rotasi. Koordinat posisi akhir titik \(P\) adalah .... (tuliskan dalam bentuk (x,y)).</p>`,
              answer: ["(-3,-4)", "-3,-4"],
              explanation: h`<p>Empat rotasi \(90^\circ\) sama dengan satu putaran penuh, dan \(2026=4\cdot506+2\). Jadi hasilnya sama dengan dua rotasi, yaitu rotasi \(180^\circ\):</p>
<div class="math-display">\[ P'=2C-P=(2-5,\,-2-2)=(-3,-4) \]</div>
<p>Jawabannya <strong>\((-3,-4)\)</strong>.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: "uraian",
      letter: "C",
      title: "Uraian (Essay)",
      instruction: h`5 soal \(\times\) 8 poin = 40 poin. Tuliskan langkah penyelesaian dengan
lengkap di buku atau kertas, lalu bandingkan dengan pembahasan dan pedoman
penskoran.`,
      pointsEach: 8,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "uraian-1",
              no: 1,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Pada permainan blok susun, setiap kotak papan ditandai dengan koordinat pusatnya \((x,y)\). Sebuah blok berbentuk L menempati kotak \((2,6)\), \((3,6)\), \((4,6)\), dan \((4,7)\), dengan kotak \((3,6)\) sebagai poros (lihat gambar). Pemain memberi tiga perintah berurutan: <strong>R</strong>: blok diputar \(90^\circ\) searah jarum jam berpusat di poros \((3,6)\); <strong>C</strong>: blok dicerminkan terhadap garis \(x=5\); <strong>J</strong>: blok digeser oleh \(\left[\begin{smallmatrix}0\\-4\end{smallmatrix}\right]\).</p>`,
              figure: papan(),
              promptAfter: h`<ol type="a">
<li>Tentukan koordinat keempat kotak blok setelah perintah R.</li>
<li>Tentukan koordinat keempat kotak setelah perintah C.</li>
<li>Tentukan koordinat keempat kotak setelah perintah J, lalu periksa apakah blok tepat mengisi lubang berarsir putus-putus, yaitu kotak \((6,1)\), \((7,1)\), \((7,2)\), dan \((7,3)\).</li>
<li>Jika pemain menjalankan J sebelum C (urutan R, J, C), apakah posisi akhir berubah? Jelaskan dengan rumus transformasinya.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> \(R:(x,y)\mapsto(3+(y-6),\;6-(x-3))=(y-3,\;9-x)\). Kotak menjadi \((3,7)\), \((3,6)\), \((3,5)\), \((4,5)\).</p>
<p><strong>(b)</strong> \(C:(x,y)\mapsto(10-x,\,y)\). Kotak menjadi \((7,7)\), \((7,6)\), \((7,5)\), \((6,5)\).</p>
<p><strong>(c)</strong> \(J:(x,y)\mapsto(x,\,y-4)\). Kotak menjadi \((7,3)\), \((7,2)\), \((7,1)\), \((6,1)\). Keempatnya sama dengan kotak lubang, jadi blok tepat mengisi lubang.</p>
<p><strong>(d)</strong> Urutan R, J, C: \((x,y)\to(x,\,y-4)\to(10-x,\,y-4)\). Urutan R, C, J: \((x,y)\to(10-x,\,y)\to(10-x,\,y-4)\). Hasilnya sama, karena refleksi terhadap garis tegak hanya mengubah absis, sedangkan translasi vertikal hanya mengubah ordinat.</p>
<p class="penskoran"><em>Penskoran: (a) 2 poin; (b) 2 poin; (c) 2 poin (koordinat 1, kesimpulan 1); (d) 2 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Sebuah proyektor yang lampunya berada di titik \(P(1,2)\) memproyeksikan gambar segitiga \(ABC\) dengan \(A(2,3)\), \(B(4,3)\), dan \(C(3,5)\) ke layar. Proses ini dimodelkan sebagai dilatasi berpusat di \(P\) dengan faktor \(k=3\), dan bayangan segitiga ditulis \(A'B'C'\).</p>`,
              figure: figUraian2,
              promptAfter: h`<ol type="a">
<li>Tentukan koordinat \(A'\), \(B'\), dan \(C'\).</li>
<li>Hitung luas dan keliling \(\triangle A'B'C'\), lalu bandingkan dengan luas dan keliling \(\triangle ABC\).</li>
<li>Tentukan persamaan garis \(AC\) dan garis \(A'C'\). Apa hubungan kedua garis tersebut?</li>
<li>Layar hanya dapat menampung titik dengan absis \(x\le 8\) (garis putus-putus pada gambar). Jika pusat \(P\) tetap, tentukan faktor skala \(k&gt;0\) terbesar agar seluruh bayangan tetap tampak pada layar.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Dengan \(X'=P+3(X-P)\): \(A'=(1,2)+3(1,1)=(4,5)\); \(B'=(1,2)+3(3,1)=(10,5)\); \(C'=(1,2)+3(2,3)=(7,11)\).</p>
<p><strong>(b)</strong> \(L_{ABC}=\frac12\cdot2\cdot2=2\) dan \(L_{A'B'C'}=\frac12\cdot6\cdot6=18\), yaitu \(9=3^{2}\) kali. Keliling \(ABC=2+2\sqrt5\) dan keliling \(A'B'C'=6+6\sqrt5\), yaitu \(3\) kali.</p>
<p><strong>(c)</strong> Gradien \(AC=\frac{5-3}{3-2}=2\): \(y=2x-1\). Gradien \(A'C'=\frac{11-5}{7-4}=2\): \(y=2x-3\). Kedua garis sejajar (dilatasi memetakan garis ke garis yang sejajar).</p>
<p><strong>(d)</strong> Absis bayangan: \(x'=1+k(x-1)\). Absis terbesar ada pada \(B\): \(1+3k\le8\Rightarrow k\le\frac73\). Jadi \(k_{\max}=\frac73\).</p>
<p class="penskoran"><em>Penskoran: (a) 2 poin; (b) 2 poin (luas 1, keliling 1); (c) 2 poin; (d) 2 poin.</em></p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "uraian-3",
              no: 3,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Ruas garis \(AB\) dengan \(A(1,1)\) dan \(B(5,1)\) dipetakan oleh sebuah rotasi menjadi ruas \(A'B'\) dengan \(A'(4,0)\) dan \(B'(4,4)\) (lihat gambar). Pusat rotasi \(C\) tidak diketahui.</p>`,
              figure: figUraian3,
              promptAfter: h`<ol type="a">
<li>Tunjukkan bahwa \(AB=A'B'\), lalu jelaskan mengapa pusat rotasi harus berjarak sama dari \(A\) dan \(A'\), serta dari \(B\) dan \(B'\).</li>
<li>Tentukan persamaan sumbu ruas \(AA'\) dan sumbu ruas \(BB'\), lalu tentukan koordinat pusat rotasi \(C\).</li>
<li>Tunjukkan bahwa \(\angle ACA'=90^\circ\), lalu tentukan arah rotasinya (searah atau berlawanan arah jarum jam).</li>
<li>Tentukan bayangan titik \(D(1,5)\) oleh rotasi tersebut.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> \(AB=4\) dan \(A'B'=4\). Rotasi mempertahankan jarak ke pusatnya, sehingga \(CA=CA'\) dan \(CB=CB'\); titik \(C\) berada pada sumbu ruas \(AA'\) dan sumbu ruas \(BB'\).</p>
<p><strong>(b)</strong> \(AA'\): titik tengah \(\left(\frac52,\frac12\right)\), gradien \(-\frac13\), sehingga sumbunya \(y=3x-7\). \(BB'\): titik tengah \(\left(\frac92,\frac52\right)\), gradien \(-3\), sehingga sumbunya \(x=3y-3\). Substitusi: \(x=3(3x-7)-3\Rightarrow x=3\), sehingga \(y=2\). Pusat \(C(3,2)\).</p>
<p><strong>(c)</strong> \(\overrightarrow{CA}=(-2,-1)\) dan \(\overrightarrow{CA'}=(1,-2)\). Hasil kali titik \(=-2+2=0\), jadi \(\angle ACA'=90^\circ\). Hasil kali silang \((-2)(-2)-(-1)(1)=5&gt;0\), jadi putaran dari \(CA\) ke \(CA'\) berlawanan arah jarum jam.</p>
<p><strong>(d)</strong> \(D-C=(-2,3)\mapsto(-3,-2)\), sehingga \(D'=(3,2)+(-3,-2)=(0,0)\).</p>
<p class="penskoran"><em>Penskoran: (a) 2 poin; (b) 2 poin (sumbu 1, titik \(C\) 1); (c) 2 poin (sudut 1, arah 1); (d) 2 poin.</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Transformasi \(T\) dengan matriks \(M=\begin{bmatrix}a&amp;b\\c&amp;d\end{bmatrix}\) memetakan titik \(P(1,1)\) ke \(P'(2,3)\) dan titik \(Q(2,-1)\) ke \(Q'(7,0)\) (lihat gambar: segitiga \(OPQ\) dan bayangannya \(OP'Q'\)).</p>`,
              figure: figUraian4,
              promptAfter: h`<ol type="a">
<li>Tentukan matriks \(M\).</li>
<li>Hitung \(\det M\), kemudian tentukan luas \(\triangle OP'Q'\) dengan dua cara: memakai faktor \(|\det M|\) dan memakai koordinat titik sudutnya.</li>
<li>Tentukan titik \(R\) yang bayangannya adalah \(R'(7,14)\).</li>
<li>Tentukan persamaan bayangan garis \(x+2y=7\) oleh \(T\). Apa yang dapat disimpulkan tentang arah garis bayangan tersebut?</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Dari \(a+b=2\) dan \(2a-b=7\): \(a=3\), \(b=-1\). Dari \(c+d=3\) dan \(2c-d=0\): \(c=1\), \(d=2\). Jadi \(M=\begin{bmatrix}3&amp;-1\\1&amp;2\end{bmatrix}\).</p>
<p><strong>(b)</strong> \(\det M=6+1=7\). Luas \(\triangle OPQ=\frac12|1\cdot(-1)-1\cdot2|=\frac32\). Cara 1: \(L'=7\cdot\frac32=\frac{21}{2}\). Cara 2: \(\triangle OP'Q'\) dengan \(O(0,0)\), \(P'(2,3)\), \(Q'(7,0)\) memiliki luas \(\frac12|2\cdot0-3\cdot7|=\frac{21}{2}\). Keduanya sama.</p>
<p><strong>(c)</strong> \(M^{-1}=\frac17\begin{bmatrix}2&amp;1\\-1&amp;3\end{bmatrix}\), sehingga \(R=\frac17(14+14,\;-7+42)=(4,5)\). Pemeriksaan: \(M(4,5)=(12-5,\,4+10)=(7,14)\).</p>
<p><strong>(d)</strong> \(x=\frac{2x'+y'}{7}\) dan \(y=\frac{-x'+3y'}{7}\). Maka \(x+2y=\frac{2x'+y'-2x'+6y'}{7}=y'\), sehingga bayangannya \(y=7\). Garis bayangan mendatar (sejajar sumbu-\(x\)), meskipun garis semula miring.</p>
<p class="penskoran"><em>Penskoran: (a) 2 poin; (b) 2 poin (determinan 0,5, dua cara masing-masing 0,75); (c) 2 poin; (d) 2 poin (persamaan 1,5, kesimpulan 0,5).</em></p>`,
            },
          ],
        },
        {
          level: "hots",
          questions: [
            {
              id: "uraian-5",
              no: 5,
              type: "essay",
              level: "hots",
              prompt: h`<p>Meja biliar berbentuk persegi panjang dengan sudut-sudut \((0,0)\), \((8,0)\), \((8,4)\), dan \((0,4)\) (satuan dm). Bola putih berada di \(A(2,1)\) dan bola sasaran di \(B(6,1)\). Pemain memukul bola putih sehingga bola memantul lebih dahulu pada dinding atas (\(y=4\)) di titik \(P\), kemudian memantul pada dinding kanan (\(x=8\)) di titik \(Q\), lalu mengenai bola sasaran \(B\). Pada setiap dinding, sudut datang sama dengan sudut pantul.</p>`,
              figure: biliar(),
              promptAfter: h`<ol type="a">
<li>Cerminkan \(B\) terhadap dinding kanan menjadi \(B_1\), lalu cerminkan \(B_1\) terhadap dinding atas menjadi \(B_2\). Tentukan koordinat \(B_1\) dan \(B_2\).</li>
<li>Jelaskan mengapa panjang lintasan \(A\to P\to Q\to B\) sama dengan \(AB_2\), lalu hitung panjang lintasan tersebut.</li>
<li>Tentukan koordinat \(P\) dan \(Q\), dan periksa bahwa keduanya benar-benar berada pada dinding meja.</li>
<li>Titik \(B_2\) juga dapat diperoleh dari \(B\) oleh satu rotasi \(180^\circ\). Tentukan pusat rotasinya dan jelaskan alasannya. Kemudian hitung panjang lintasan jika bola hanya memantul satu kali pada dinding atas, dan bandingkan dengan hasil (b).</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> \(B_1=(16-6,\,1)=(10,1)\) dan \(B_2=(10,\,8-1)=(10,7)\).</p>
<p><strong>(b)</strong> \(QB=QB_1\) karena \(Q\) pada dinding kanan, dan \(PB_1=PB_2\) karena \(P\) pada dinding atas. Pantulan sama dengan meneruskan lintasan lurus ke bayangan sasaran, sehingga lintasan setelah diluruskan adalah ruas \(AB_2\). Panjangnya \(\sqrt{(10-2)^{2}+(7-1)^{2}}=10\) dm.</p>
<p><strong>(c)</strong> Garis \(AB_2\): \(y-1=\frac34(x-2)\). Pada \(y=4\): \(x=6\), jadi \(P(6,4)\) (benar pada dinding atas, \(0&lt;6&lt;8\)). Pada \(x=8\): \(y=\frac{11}{2}\), yang merupakan bayangan \(Q\) terhadap \(y=4\), sehingga \(Q=\left(8,\,8-\frac{11}{2}\right)=\left(8,\frac52\right)\) (benar pada dinding kanan, \(0&lt;\frac52&lt;4\)). Pemeriksaan: \(AP=5\), \(PQ=\frac52\), \(QB=\frac52\), total \(10\).</p>
<p><strong>(d)</strong> Dinding atas dan dinding kanan tegak lurus dan berpotongan di \((8,4)\). Komposisi dua refleksi terhadap garis yang saling tegak lurus adalah rotasi \(180^\circ\) di titik potong: \(B\mapsto(16-6,\;8-1)=(10,7)=B_2\). Jika hanya memantul pada dinding atas: \(B^{*}=(6,7)\), panjang lintasan \(AB^{*}=\sqrt{4^{2}+6^{2}}=2\sqrt{13}\approx7{,}2\) dm, lebih pendek sekitar \(2{,}8\) dm daripada \(10\) dm karena tidak ada pantulan tambahan.</p>
<p class="penskoran"><em>Penskoran: (a) 2 poin; (b) 2 poin (alasan 1, panjang 1); (c) 2 poin (\(P\) 0,75, \(Q\) 0,75, pemeriksaan 0,5); (d) 2 poin (pusat dan alasan 1, perbandingan 1).</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default transformasiGeometri;
