/* eslint-disable @typescript-eslint/no-explicit-any */
import JXG from "jsxgraph";
import { useEffect, useRef, useState } from "react";
import {
  arrow, C, Chips, fmt, Frame, mk, note, OFF, Range, shape, SimBoard, SlideDeck, useStep,
  type B, type BBox, type Build, type Vec,
} from "../common/core";
import { buildSys, n, Quiz, solve, tex, type MP as SysP, type Sys } from "../common/LinearKit";
import { QUIZ } from "./quizzes/MatriksQuiz";

/* Deck "Matriks" (SMA kelas 11): sejarah → ordo dan elemen → jumlah dan skalar → perkalian baris × kolom
   → matriks sebagai transformasi → komposisi (AB ≠ BA) → determinan = faktor luas → invers → SPL → matriks 3×3 (minor, kofaktor, Sarrus, adjoin, invers) → kuis.
   Gagasan utama: matriks 2×2 = ke mana î dan ĵ mendarat; semua operasi dilihat sebagai gerakan bidang. */

const raw = String.raw;
const NONE = {};
const O: Vec = [0, 0];
/* bbox harus stabil (konstanta modul): SimBoard membangun ulang papan bila identitasnya berubah. */
const BB_T: BBox = [-4.5, 3.5, 4.5, -3.5];
const BB_L: BBox = [-6, 5, 6, -5];
const BB_S: BBox = [-3, 8, 8, -3];

/* ───────── Matriks 2×2 kecil: [a, b, c, d] = [[a, b], [c, d]] ───────── */
type M4 = [number, number, number, number];
const mul = (p: M4, q: M4): M4 => [p[0] * q[0] + p[1] * q[2], p[0] * q[1] + p[1] * q[3], p[2] * q[0] + p[3] * q[2], p[2] * q[1] + p[3] * q[3]];
const det = (m: M4) => m[0] * m[3] - m[1] * m[2];
const app = (m: M4, p: Vec): Vec => [m[0] * p[0] + m[1] * p[1], m[2] * p[0] + m[3] * p[1]];
const r2 = (v: number) => Math.round(v * 100) / 100;

/* ───────── Teks matematika ───────── */
const nt = (v: number) => n(v).replace("−", "-").replace(",", "{,}"); // koma desimal aman di TeX
const pr = (v: number) => (v < 0 ? `(${nt(v)})` : nt(v));
/** Matriks sebagai TeX; `hl` mewarnai elemen tertentu. */
const mxs = (m: number[][], hl: (i: number, j: number) => string | null = () => null) =>
  raw`\begin{bmatrix}${m.map((r, i) => r.map((v, j) => { const c = hl(i, j); return c ? raw`{\color{${c}}${nt(v)}}` : nt(v); }).join("&")).join(raw`\\`)}\end{bmatrix}`;
const m2 = (m: M4) => mxs([[m[0], m[1]], [m[2], m[3]]]);

/* ───────── Bangun uji: huruf F (tidak simetris, jadi cermin dan putaran kelihatan) ───────── */
const F: Vec[] = [[0, 0], [0.3, 0], [0.3, 0.4], [0.7, 0.4], [0.7, 0.6], [0.3, 0.6], [0.3, 0.8], [0.9, 0.8], [0.9, 1], [0, 1]];
const SQ: Vec[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
const blue = { strokeColor: C.blue, strokeWidth: 2.5, fillColor: C.blue, fillOpacity: 0.12 };
const orange = { strokeColor: C.orange, strokeWidth: 3, fillColor: C.orange, fillOpacity: 0.18 };
const violet = { strokeColor: C.violet, strokeWidth: 3, fillColor: C.violet, fillOpacity: 0.14 };
const green = { strokeColor: C.green, strokeWidth: 2.5, fillColor: C.green, fillOpacity: 0.1 };

/* ───────── Dua titik seret: î′ = kolom 1, ĵ′ = kolom 2 ───────── */
type P4 = { a: number; b: number; c: number; d: number; nonce: number; step: number };
const P0: P4 = { a: 0, b: -1, c: 1, d: 0, nonce: 1, step: 0 };
const to = (s: P4, q: M4): P4 => ({ ...s, a: q[0], b: q[1], c: q[2], d: q[3], nonce: s.nonce + 1 });
function basis(b: B, g: () => P4, s: (p: Partial<P4>) => void) {
  const g0 = g();
  const h = { snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5, size: 6, strokeColor: "#fff", strokeWidth: 2, highlight: false, showInfobox: false };
  const lab = (c: string) => ({ strokeColor: c, fontSize: 15, offset: [8, 6] });
  const I = mk(b, "point", [g0.a, g0.c], { ...h, fillColor: C.teal, name: "î′", label: lab(C.teal) });
  const J = mk(b, "point", [g0.b, g0.d], { ...h, fillColor: C.violet, name: "ĵ′", label: lab(C.violet) });
  const push = () => s({ a: r2(I.X()), c: r2(I.Y()), b: r2(J.X()), d: r2(J.Y()) });
  I.on("drag", push); J.on("drag", push);
  let seen = g0.nonce; // preset dari React → pindahkan titik
  b.on("update", () => {
    if (g().nonce === seen) return;
    seen = g().nonce;
    I.setPosition(JXG.COORDS_BY_USER, [g().a, g().c]);
    J.setPosition(JXG.COORDS_BY_USER, [g().b, g().d]);
  });
  arrow(b, () => O, () => [1, 0], C.soft, 1.5);
  arrow(b, () => O, () => [0, 1], C.soft, 1.5);
  arrow(b, () => O, () => [I.X(), I.Y()], C.teal, 2.75);
  arrow(b, () => O, () => [J.X(), J.Y()], C.violet, 2.75);
  const M = (p: Vec): Vec => [I.X() * p[0] + J.X() * p[1], I.Y() * p[0] + J.Y() * p[1]];
  const D = () => I.X() * J.Y() - J.X() * I.Y();
  return { M, D, I, J };
}
const PRE: [string, M4][] = [
  ["Identitas", [1, 0, 0, 1]], ["Rotasi 90°", [0, -1, 1, 0]], ["Cermin sumbu x", [1, 0, 0, -1]],
  ["Skala ×2", [2, 0, 0, 2]], ["Geser", [1, 1, 0, 1]], ["Gepeng", [1, 1, 1, 1]],
];
const Presets = (p: { set: (f: (s: P4) => P4) => void }) => (
  <Chips value="" onPick={(v) => { const q = PRE.find((x) => x[0] === v)![1]; p.set((s) => to(s, q)); }} items={PRE.map((x) => ({ v: x[0], label: x[0] }))} />
);
const bigM = (m: P4) => <div className="ds-read ds-math" style={{ textAlign: "center" }}>{tex(raw`M=${m2([m.a, m.b, m.c, m.d])},\quad \det M=${nt(r2(det([m.a, m.b, m.c, m.d])))}`)}</div>;

/* ═════════ 0 · Judul: F dibentuk ulang oleh empat matriks ═════════ */
const NAMED: [string, M4][] = [["rotasi 90°", [0, -1, 1, 0]], ["geser", [1, 1, 0, 1]], ["cermin sumbu y", [-1, 0, 0, 1]], ["skala ×1,5", [1.5, 0, 0, 1.5]]];
const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
const phase = (t: number) => { const s = t / 3.2, f = s - Math.floor(s); return { i: Math.floor(s) % 4, u: ease(Math.min(1, Math.max(0, (f - 0.1) / 0.65))) }; };
const buildTitle: Build<object> = (b, _g, _s, clock) => {
  shape(b, () => F, blue);
  shape(b, () => {
    const { i, u } = phase(clock()), T = NAMED[i][1];
    const m: M4 = [1 + (T[0] - 1) * u, T[1] * u, T[2] * u, 1 + (T[3] - 1) * u];
    return F.map((p) => app(m, p));
  }, orange);
  note(b, () => [-4.2, 3], () => NAMED[phase(clock()).i][0].toUpperCase(), C.mute);
};
function TitleSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi"
      title="Matriks"
      copy={<>
        <p>Sebuah tabel kecil berisi empat bilangan, dan ia mampu <b>memutar, menggeser, dan meregangkan seluruh bidang</b>.</p>
        <p className="ds-muted">Tekan <b>→</b> untuk melangkah. Setiap kalimat baru ikut menggerakkan simulasinya.</p>
      </>}
      stage={<SimBoard bbox={BB_T} params={NONE} build={buildTitle} loop />}
    />
  );
}

/* ═════════ 1 · Sejarah singkat ═════════ */
function HistorySlide() {
  const rows: [string, string, string][] = [
    ["±200 SM", "Jiuzhang suanshu (Tiongkok)", "Koefisien tiga persamaan disusun di papan hitung, lalu diselesaikan dengan cara yang kini disebut eliminasi Gauss."],
    ["1850", "J. J. Sylvester", "Memakai kata “matrix” (Latin: rahim, sumber) untuk susunan persegi panjang bilangan."],
    ["1853–1858", "Arthur Cayley", "Menerbitkan invers matriks pertama, lalu Memoir on the Theory of Matrices (1858): jumlah, kali, dan invers sebagai aljabar tersendiri."],
    ["Kini", "Komputer", "Grafika, mesin pencari, sandi, dan kecerdasan buatan bertumpu pada perkalian matriks."],
  ];
  return (
    <Frame
      eyebrow="Sejarah singkat"
      title="Tabel angka yang berumur 2.000 tahun"
      copy={<>
        <p>Matriks dipakai orang <b>lebih dulu</b> daripada namanya: dua milenium sebelum Sylvester.</p>
        <p className="fragment">Cayley melihat sesuatu yang baru: tabel itu boleh <b>dihitung sebagai satu benda</b>, dijumlah dan dikalikan.</p>
        <p className="fragment">Perkalian matriks ternyata berarti <b>menyusun dua transformasi</b>. Itu yang akan kita lihat.</p>
      </>}
      stage={
        <table className="ds-table" style={{ fontSize: 17 }}>
          <thead><tr><th>Tahun</th><th>Tokoh</th><th>Sumbangan</th></tr></thead>
          <tbody>{rows.map(([y, w, t]) => <tr key={y}><th style={{ whiteSpace: "nowrap" }}>{y}</th><td style={{ whiteSpace: "nowrap" }}>{w}</td><td>{t}</td></tr>)}</tbody>
        </table>
      }
    />
  );
}

/* ═════════ 2 · Ordo dan elemen ═════════ */
function AnatomySlide() {
  const [r, setR] = useState(2), [c, setC] = useState(3), [i, setI] = useState(2), [j, setJ] = useState(3);
  const ii = Math.min(i, r), jj = Math.min(j, c);
  const A = Array.from({ length: r }, (_, x) => Array.from({ length: c }, (_, y) => x * c + y + 1));
  return (
    <Frame
      eyebrow="01 · Ordo dan elemen"
      title="Baris dulu, kolom kemudian"
      copy={<>
        <p>Matriks adalah susunan bilangan dalam <b>baris</b> (mendatar) dan <b>kolom</b> (tegak). Ukurannya disebut <b>ordo m × n</b>.</p>
        <p className="fragment">Elemen {tex(raw`a_{ij}`)} berada di <b>baris i, kolom j</b>. Geser i dan j: elemennya menyala oranye.</p>
        <p className="fragment">Bila m = n, matriksnya <b>persegi</b>, syarat untuk determinan dan invers nanti.</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={{ textAlign: "center", fontSize: 32 }}>
          {tex(raw`A_{${r}\times${c}}=${mxs(A, (x, y) => (x + 1 === ii && y + 1 === jj ? C.orange : null))}`)}
        </div>
        <div className="ds-controls">
          <Range label="banyak baris m" value={r} min={1} max={4} onChange={setR} />
          <Range label="banyak kolom n" value={c} min={1} max={4} onChange={setC} />
          <Range label="baris i" value={ii} min={1} max={r} onChange={setI} color={C.orange} />
          <Range label="kolom j" value={jj} min={1} max={c} onChange={setJ} color={C.orange} />
        </div>
        <div className="ds-read">ordo {r} × {c} · {r * c} elemen · a<sub>{ii}{jj}</sub> = {A[ii - 1][jj - 1]}{r === c ? " · persegi" : ""}</div>
      </>}
    />
  );
}

/* ═════════ 3 · Jumlah dan pengali skalar ═════════ */
const A1: M4 = [1, 2, 3, 0], B1: M4 = [2, -1, 1, 4];
function SumSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState(2);
  const S = A1.map((v, x) => v + B1[x]) as M4, K = A1.map((v) => k * v) as M4;
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · Jumlah dan skalar"
      title="Elemen seletak saling bertemu"
      copy={<>
        <p>Dua matriks dijumlah <b>elemen demi elemen</b>, sehingga ordonya harus <b>sama</b>.</p>
        <p className="ds-math">{tex(raw`A+B=[a_{ij}+b_{ij}]`)}</p>
        <p className="fragment">Mengalikan dengan bilangan k (skalar) berarti <b>mengalikan setiap elemen</b> dengan k.</p>
        <p className="fragment">Geser k: pada matriks A di bawah, k negatif ikut membalik tanda semua elemen.</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>{tex(`${m2(A1)}+${m2(B1)}=${m2(S)}`)}</div>
        <div className="ds-read ds-math" style={{ textAlign: "center", opacity: step >= 1 ? 1 : 0.25 }}>{tex(`${pr(k)}\\cdot${m2(A1)}=${m2(K)}`)}</div>
        <div className="ds-controls ds-controls--one"><Range label="skalar k" value={k} min={-3} max={4} onChange={setK} color={C.orange} /></div>
      </>}
    />
  );
}

/* ═════════ 4 · Perkalian: baris × kolom ═════════ */
const MA = [[1, 2], [3, 4]], MB = [[5, 6], [7, 8]];
const MC = MA.map((row) => MB[0].map((_, j) => row[0] * MB[0][j] + row[1] * MB[1][j]));
function MulSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [sel, setSel] = useState(0);
  useEffect(() => setSel(Math.min(step, 3)), [step]);
  const i = Math.floor(sel / 2), j = sel % 2;
  return (
    <Frame
      innerRef={ref}
      eyebrow="03 · Perkalian"
      title="Baris dikali kolom"
      copy={<>
        <p>Elemen baris i, kolom j pada AB = <b style={{ color: C.orange }}>baris i dari A</b> dikali <b style={{ color: C.blue }}>kolom j dari B</b>, lalu dijumlah.</p>
        <p className="fragment">Tekan →: sorotan pindah ke elemen berikutnya. Perhatikan baris dan kolom yang dipakai.</p>
        <p className="fragment">Syarat: <b>kolom A = baris B</b>. Ordonya {tex(raw`(m\times n)(n\times p)=m\times p`)}.</p>
        <p className="fragment">Awas: AB <b>tidak sama</b> dengan BA. Slide komposisi akan menunjukkan sebabnya.</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={{ textAlign: "center", fontSize: 30 }}>
          {tex(`${mxs(MA, (x) => (x === i ? C.orange : null))}${mxs(MB, (_, y) => (y === j ? C.blue : null))}=${mxs(MC, (x, y) => (x === i && y === j ? C.violet : null))}`)}
        </div>
        <Chips value={sel} onPick={setSel} items={[0, 1, 2, 3].map((v) => ({ v, label: `elemen (${Math.floor(v / 2) + 1}, ${(v % 2) + 1})` }))} />
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`${MA[i][0]}\\cdot${MB[0][j]}+${MA[i][1]}\\cdot${MB[1][j]}=${MC[i][j]}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 5 · Matriks = ke mana î dan ĵ mendarat ═════════ */
const buildLin: Build<P4> = (b, g, s) => {
  const { M } = basis(b, g, s);
  shape(b, () => SQ, { strokeColor: C.soft, strokeWidth: 1.5, dash: 2 });
  shape(b, () => F, blue);
  shape(b, () => F.map(M), orange);
  shape(b, () => (g().step >= 2 ? SQ.map(M) : null), { strokeColor: C.teal, strokeWidth: 1.75, dash: 3, fillOpacity: 0 });
};
function LinSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [m, setM] = useState<P4>(P0);
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · Matriks sebagai transformasi"
      title="Dua kolom, dua panah"
      copy={<>
        <p>Kolom pertama matriks adalah tempat mendarat <b style={{ color: C.teal }}>î′</b> (1, 0). Kolom kedua adalah tempat mendarat <b style={{ color: C.violet }}>ĵ′</b> (0, 1).</p>
        <p className="fragment">Seret dua titik berwarna. <b>Seluruh bidang</b> ikut berubah, termasuk huruf F.</p>
        <p className="fragment">Kotak satuan (garis putus-putus) berubah menjadi <b>jajar genjang</b> yang dibentuk î′ dan ĵ′. Titik (x, y) mendarat di {tex(raw`x\hat\imath'+y\hat\jmath'`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB_L} params={{ ...m, step }} onChange={(x) => setM((s) => ({ ...s, ...x }))} build={buildLin} maxH={330} />
        <Presets set={setM} />
        {bigM(m)}
      </>}
    />
  );
}

/* ═════════ 6 · Komposisi: AB ≠ BA ═════════ */
const OPS: Record<string, [string, M4]> = {
  rot: ["Rotasi 90°", [0, -1, 1, 0]], geser: ["Geser", [1, 1, 0, 1]], cermin: ["Cermin sumbu x", [1, 0, 0, -1]], skala: ["Lebar ×2", [2, 0, 0, 1]],
};
type CP = { A: string; B: string; mid: boolean; both: boolean };
const buildComp: Build<CP> = (b, g) => {
  const AB = () => mul(OPS[g().A][1], OPS[g().B][1]), BA = () => mul(OPS[g().B][1], OPS[g().A][1]);
  shape(b, () => F, blue);
  shape(b, () => (g().mid ? F.map((p) => app(OPS[g().B][1], p)) : null), { strokeColor: C.soft, strokeWidth: 1.5, dash: 2 });
  shape(b, () => F.map((p) => app(AB(), p)), orange);
  shape(b, () => (g().both ? F.map((p) => app(BA(), p)) : null), violet);
};
function CompSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [A, setA] = useState("rot"), [Bk, setB] = useState("geser");
  const AB = mul(OPS[A][1], OPS[Bk][1]), BA = mul(OPS[Bk][1], OPS[A][1]);
  const same = AB.every((v, x) => v === BA[x]);
  const items = Object.entries(OPS).map(([v, o]) => ({ v, label: o[0] }));
  return (
    <Frame
      innerRef={ref}
      eyebrow="05 · Komposisi"
      title="AB berarti: B dulu, baru A"
      copy={<>
        <p>Perkalian matriks adalah <b>menyusun dua transformasi</b>. Pada AB, F dikenai <b>B lebih dulu</b>, lalu A.</p>
        <p className="fragment">Garis putus-putus abu-abu adalah hasil antara: F setelah dikenai B saja.</p>
        <p className="fragment">Bayangan <b style={{ color: C.violet }}>BA</b> (ungu) ditambahkan: urutan dibalik, hasil akhir <b>berbeda</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB_L} params={{ A, B: Bk, mid: step >= 1, both: step >= 2 }} build={buildComp} maxH={300} />
        <div className="ds-row"><b>A</b><Chips value={A} onPick={setA} items={items} /></div>
        <div className="ds-row"><b>B</b><Chips value={Bk} onPick={setB} items={items} /></div>
        <div className={`ds-read ds-math ${step >= 2 && !same ? "ds-bad" : ""}`} style={{ textAlign: "center" }}>
          {tex(`AB=${m2(AB)}${step >= 2 ? `\\quad BA=${m2(BA)}` : ""}`)}
          {step >= 2 && <div className="ds-muted">{same ? "Kebetulan sama. Coba pasangan lain." : "AB ≠ BA → urutan mengubah hasil"}</div>}
        </div>
      </>}
    />
  );
}

/* ═════════ 7 · Determinan = faktor luas ═════════ */
const buildDet: Build<P4> = (b, g, s) => {
  const { M, D, I, J } = basis(b, g, s);
  shape(b, () => (D() >= 0 ? SQ.map(M) : null), { strokeColor: C.teal, strokeWidth: 2.5, fillColor: C.teal, fillOpacity: 0.22 });
  shape(b, () => (D() < 0 ? SQ.map(M) : null), { strokeColor: C.red, strokeWidth: 2.5, fillColor: C.red, fillOpacity: 0.22 });
  shape(b, () => SQ, { strokeColor: C.soft, strokeWidth: 1.5, dash: 2 });
  note(b, () => (g().step >= 1 ? [(I.X() + J.X()) / 2, (I.Y() + J.Y()) / 2] : OFF), () => `luas ${fmt(Math.abs(D()), 1)}`, C.ink);
};
function DetSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [m, setM] = useState<P4>({ ...P0, a: 2, b: 1, c: 0.5, d: 1.5 });
  const M: M4 = [m.a, m.b, m.c, m.d], D = det(M);
  return (
    <Frame
      innerRef={ref}
      eyebrow="06 · Determinan"
      title="Berapa kali luas berubah?"
      copy={<>
        <p>Kotak satuan luasnya 1. Setelah ditransformasi, ia menjadi jajar genjang. <b>Luasnya adalah |det|</b>.</p>
        <p className="ds-math">{tex(raw`\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc`)}</p>
        <p className="fragment">Seret î′ dan ĵ′. Bila <b style={{ color: C.red }}>det negatif</b>, bidang terbalik (seperti cermin).</p>
        <p className="fragment">Bila <b>det = 0</b>, jajar genjang <b>gepeng jadi garis</b>: bidang remuk, informasi hilang. Coba preset “Gepeng”.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB_L} params={{ ...m, step }} onChange={(x) => setM((s) => ({ ...s, ...x }))} build={buildDet} maxH={330} />
        <Presets set={setM} />
        <div className={`ds-read ds-math ${D === 0 ? "ds-bad" : ""}`} style={{ textAlign: "center" }}>
          {tex(raw`ad-bc=${pr(m.a)}\cdot${pr(m.d)}-${pr(m.b)}\cdot${pr(m.c)}=${nt(r2(D))}`)}
          <div className="ds-muted">{D === 0 ? "gepeng: luas 0" : D < 0 ? "terbalik, luas × " + fmt(-D, 2) : "arah tetap, luas × " + fmt(D, 2)}</div>
        </div>
      </>}
    />
  );
}

/* ═════════ 8 · Invers = memutar balik ═════════ */
const buildInv: Build<P4> = (b, g, s) => {
  const { M, D } = basis(b, g, s);
  const ok = () => Math.abs(D()) > 1e-6;
  const W = (p: Vec): Vec => { const d = D(), i = g(); return [(i.d * p[0] - i.b * p[1]) / d, (-i.c * p[0] + i.a * p[1]) / d]; };
  shape(b, () => F, blue);
  shape(b, () => F.map(M), orange);
  shape(b, () => (g().step >= 1 && ok() ? F.map(W) : null), green);
};
function InvSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [m, setM] = useState<P4>({ ...P0, a: 2, b: 1, c: 1, d: 1, nonce: 2 });
  const D = det([m.a, m.b, m.c, m.d]);
  return (
    <Frame
      innerRef={ref}
      eyebrow="07 · Invers"
      title="Transformasi yang membatalkan"
      copy={<>
        <p>Invers {tex(raw`M^{-1}`)} adalah transformasi yang <b>mengembalikan</b> bidang ke keadaan semula: {tex(raw`M^{-1}M=I`)}.</p>
        <p className="fragment">Bayangan <b style={{ color: C.green }}>hijau</b>: {tex(raw`M^{-1}`)} menarik î′ kembali ke î, dan ĵ′ kembali ke ĵ.</p>
        <p className="fragment">Bila <b>det = 0</b>, bidang sudah gepeng. Tak ada cara mengembalikannya, jadi <b>tak ada invers</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB_L} params={{ ...m, step }} onChange={(x) => setM((s) => ({ ...s, ...x }))} build={buildInv} maxH={320} />
        <Presets set={setM} />
        <div className={`ds-read ds-math ${D === 0 ? "ds-bad" : ""}`} style={{ textAlign: "center" }}>
          {D === 0
            ? <>det = 0 → <b>M⁻¹ tidak ada</b></>
            : tex(raw`M^{-1}=\dfrac{1}{${nt(r2(D))}}${mxs([[m.d, -m.b], [-m.c, m.a]])}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 9 · Sistem persamaan: AX = B ═════════ */
const SYS: [string, Sys][] = [["Satu titik", [[2, 1, 7], [1, -1, 2]]], ["Sejajar", [[1, 1, 3], [1, 1, 5]]], ["Berimpit", [[1, 2, 4], [2, 4, 8]]]];
function SolveSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState("Satu titik");
  const s = SYS.find((x) => x[0] === k)![1];
  const [[a1, b1, c1], [a2, b2, c2]] = s;
  const R = solve(s), D = a1 * b2 - a2 * b1;
  const prm: SysP = { s, show: 2, vx: null, hy: null, pt: true, lab: null, icpt: false };
  return (
    <Frame
      innerRef={ref}
      eyebrow="08 · Penerapan"
      title="Menyelesaikan sistem dengan invers"
      copy={<>
        <p>Dua persamaan menjadi <b>satu persamaan matriks</b>: {tex(raw`AX=B`)}. Kalikan kedua ruas dengan {tex(raw`A^{-1}`)}:</p>
        <p className="ds-math">{tex(raw`X=A^{-1}B`)}</p>
        <p className="fragment">Garis biru dan oranye berpotongan <b>tepat satu kali</b> bila det A ≠ 0.</p>
        <p className="fragment">Bila <b>det A = 0</b>, garisnya sejajar atau berimpit: A⁻¹ tidak ada, dan penyelesaian tunggal pun tidak ada.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB_S} params={prm} build={buildSys} maxH={310} />
        <Chips value={k} onPick={setK} items={SYS.map((x) => ({ v: x[0], label: x[0] }))} />
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`${mxs([[a1, b1], [a2, b2]])}\\begin{bmatrix}x\\\\y\\end{bmatrix}=${mxs([[c1], [c2]])}`)}
          <div style={{ opacity: step >= 1 ? 1 : 0.25 }}>
            {D !== 0
              ? tex(raw`\det A=${nt(D)}\neq0\ \Rightarrow\ X=${mxs([[R.x], [R.y]])}`)
              : tex(raw`\det A=0\ \Rightarrow\ A^{-1}\text{ tidak ada}`)}
          </div>
        </div>
      </>}
    />
  );
}

/* ═════════ Matriks 3×3: minor, kofaktor, determinan, adjoin, invers ═════════ */
type Mx = number[][];
const MATS3: [string, Mx][] = [
  ["det = 1", [[1, 2, 3], [0, 1, 4], [5, 6, 0]]],
  ["det = −1", [[2, 1, 1], [1, 3, 2], [1, 0, 0]]],
  ["det = 0", [[2, 0, 1], [1, 3, 2], [1, 1, 1]]],
];
const pick3 = (k: string) => MATS3.find((x) => x[0] === k)![1];
const SUB = (A: Mx, i: number, j: number) => A.filter((_, x) => x !== i).map((r) => r.filter((_, y) => y !== j));
const d2 = (m: Mx) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
const cof = (A: Mx, i: number, j: number) => ((i + j) % 2 ? -1 : 1) * d2(SUB(A, i, j));
const det3 = (A: Mx) => A[0].reduce((s, v, j) => s + v * cof(A, 0, j), 0);
const adj = (A: Mx) => A.map((_, i) => A.map((_, j) => cof(A, j, i)));
const vmx = (m: Mx) => mxs(m).replace(/bmatrix/g, "vmatrix");
const MatChips = (p: { v: string; set: (v: string) => void }) => (
  <Chips value={p.v} onPick={p.set} items={MATS3.map((x) => ({ v: x[0], label: x[0] }))} />
);
const mid = { textAlign: "center" } as const;

/* ═════════ 9 · Minor dan kofaktor ═════════ */
function MinorSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState("det = 1"), [i, setI] = useState(2), [j, setJ] = useState(3);
  const A = pick3(k), I = i - 1, J = j - 1, S = SUB(A, I, J), M = d2(S), sg = (I + J) % 2 ? -1 : 1;
  const hl = (x: number, y: number) => (x === I && y === J ? C.blue : x === I || y === J ? "#cbd5e1" : C.orange);
  const pat = [[1, -1, 1], [-1, 1, -1], [1, -1, 1]];
  const signs = raw`\begin{bmatrix}${pat.map((r, x) => r.map((v, y) => { const t = v > 0 ? "+" : "-"; return x === I && y === J ? raw`{\color{${C.orange}}${t}}` : t; }).join("&")).join(raw`\\`)}\end{bmatrix}`;
  return (
    <Frame
      innerRef={ref}
      eyebrow="09 · Minor dan kofaktor"
      title="Coret baris dan kolom"
      copy={<>
        <p><b>Minor</b> {tex(raw`M_{ij}`)} adalah determinan matriks yang tersisa setelah <b>baris i dan kolom j dicoret</b> (abu-abu).</p>
        <p className="fragment">Kofaktor menambahkan tanda: {tex(raw`C_{ij}=(-1)^{i+j}M_{ij}`)}.</p>
        <p className="fragment">Tandanya berpola <b>papan catur</b>: + di pojok kiri atas, lalu bergantian. Ubah i dan j, lihat tanda yang berlaku.</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={mid}>{tex(raw`A=${mxs(A, hl)}`)}</div>
        <MatChips v={k} set={setK} />
        <div className="ds-controls">
          <Range label="baris i" value={i} min={1} max={3} onChange={setI} color={C.blue} />
          <Range label="kolom j" value={j} min={1} max={3} onChange={setJ} color={C.blue} />
        </div>
        <div className="ds-read ds-math" style={mid}>
          {tex(raw`M_{${i}${j}}=${vmx(S)}=${nt(M)}`)}
          {step >= 1 && <div>{tex(raw`C_{${i}${j}}=(-1)^{${i}+${j}}\cdot${pr(M)}=${nt(sg * M)}`)}</div>}
          {step >= 2 && <div>{tex(signs)}</div>}
        </div>
      </>}
    />
  );
}

/* ═════════ 10 · Determinan 3×3: ekspansi kofaktor ═════════ */
function ExpandSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState("det = 1"), [ax, setAx] = useState("b1");
  const A = pick3(k), row = ax[0] === "b", t = Number(ax[1]) - 1, shown = Math.min(step, 3);
  const terms = [0, 1, 2].map((q) => (row ? [A[t][q], cof(A, t, q)] : [A[q][t], cof(A, q, t)]));
  const expr = terms.slice(0, shown).map(([e, c]) => raw`${pr(e)}\cdot${pr(c)}`).join("+");
  return (
    <Frame
      innerRef={ref}
      eyebrow="10 · Determinan 3 × 3"
      title="Elemen × kofaktor, disusun sepanjang satu garis"
      copy={<>
        <p>Pilih satu baris (atau kolom). Determinan = jumlah <b>elemen × kofaktornya</b>.</p>
        <p className="ds-math">{tex(raw`\det A=a_{i1}C_{i1}+a_{i2}C_{i2}+a_{i3}C_{i3}`)}</p>
        <p className="fragment">Tekan →: suku demi suku muncul. Elemen yang disorot oranye adalah garis ekspansi.</p>
        <p className="fragment">Suku kedua dan ketiga menyusul. Kofaktor sudah membawa tandanya sendiri.</p>
        <p className="fragment">Hasilnya <b>sama</b> untuk baris atau kolom mana pun. Pilih yang banyak <b>nol</b>: sukunya hilang.</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={mid}>{tex(raw`A=${mxs(A, (x, y) => ((row ? x : y) === t ? C.orange : null))}`)}</div>
        <MatChips v={k} set={setK} />
        <Chips value={ax} onPick={setAx} items={["b1", "b2", "b3", "k1", "k2", "k3"].map((v) => ({ v, label: `${v[0] === "b" ? "baris" : "kolom"} ${v[1]}` }))} />
        <div className="ds-read ds-math" style={mid}>
          {tex(raw`\det A=${expr || raw`\,?`}${shown >= 3 ? raw`=${nt(det3(A))}` : ""}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 11 · Sarrus ═════════ */
function SarrusSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState("det = 1");
  const A = pick3(k), E = (r: number, c: number) => A[r][c % 3];
  const dn = [0, 1, 2].map((d) => E(0, d) * E(1, d + 1) * E(2, d + 2));
  const up = [0, 1, 2].map((d) => E(2, d) * E(1, d + 1) * E(0, d + 2));
  const sd = dn.reduce((a, b) => a + b, 0), su = up.reduce((a, b) => a + b, 0);
  const col = (r: number, c: number) =>
    step === 1 && c >= r && c - r <= 2 ? C.blue : step === 2 && c + r >= 2 && c + r - 2 <= 2 ? C.red : null;
  const body = [0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => { const cc = col(r, c), v = nt(E(r, c)); return cc ? raw`{\color{${cc}}${v}}` : v; }).join("&")).join(raw`\\`);
  return (
    <Frame
      innerRef={ref}
      eyebrow="11 · Cara Sarrus"
      title="Salin dua kolom, tarik diagonal"
      copy={<>
        <p>Salin <b>dua kolom pertama</b> di sisi kanan matriks, lalu cari tiga diagonal turun dan tiga diagonal naik.</p>
        <p className="fragment">Diagonal turun (<b style={{ color: C.blue }}>biru</b>): kalikan tiap diagonal, <b>jumlahkan</b>.</p>
        <p className="fragment">Diagonal naik (<b style={{ color: C.red }}>merah</b>): kalikan tiap diagonal, jumlahnya <b>dikurangkan</b>.</p>
        <p className="fragment">det = biru − merah, sama dengan ekspansi kofaktor. Awas: cara Sarrus <b>hanya untuk 3 × 3</b>.</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={{ ...mid, fontSize: 30 }}>{tex(raw`\left|\begin{array}{ccc|cc}${body}\end{array}\right|`)}</div>
        <MatChips v={k} set={setK} />
        <div className="ds-read ds-math" style={mid}>
          {step < 1 && <span className="ds-muted">Tekan → untuk menarik diagonal.</span>}
          {step >= 1 && <div>{tex(raw`{\color{${C.blue}}${dn.map(pr).join("+")}=${nt(sd)}}`)}</div>}
          {step >= 2 && <div>{tex(raw`{\color{${C.red}}${up.map(pr).join("+")}=${nt(su)}}`)}</div>}
          {step >= 3 && <div>{tex(raw`\det A=${nt(sd)}-${pr(su)}=${nt(sd - su)}`)}</div>}
        </div>
      </>}
    />
  );
}

/* ═════════ 12 · Adjoin dan invers 3×3 ═════════ */
const B3 = [1, 2, 3];
function Inv3Slide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState("det = 1");
  const A = pick3(k), D = det3(A), K = A.map((_, i) => A.map((_, j) => cof(A, i, j))), J = adj(A);
  const X = D === 0 ? [] : J.map((r) => r.reduce((s, v, j) => s + v * B3[j], 0) / D);
  const none = raw`\det A=0\ \Rightarrow\ A^{-1}\text{ tidak ada}`;
  const lines = [
    raw`A=${mxs(A)}`,
    raw`\operatorname{kof}(A)=${mxs(K)}`,
    raw`\operatorname{adj}(A)=\operatorname{kof}(A)^{T}=${mxs(J)}`,
    D ? raw`A^{-1}=\dfrac{1}{${nt(D)}}${mxs(J)}` : none,
    D ? raw`AX=${mxs(B3.map((v) => [v]))}\Rightarrow X=A^{-1}B=${mxs(X.map((v) => [v]))}` : none,
  ];
  return (
    <Frame
      innerRef={ref}
      eyebrow="12 · Adjoin dan invers"
      title="Invers 3 × 3 lewat kofaktor"
      copy={<>
        <p>Rumusnya mirip 2×2: {tex(raw`A^{-1}=\dfrac{1}{\det A}\operatorname{adj}(A)`)}. Adjoin dibangun dari kofaktor.</p>
        <p className="fragment">Langkah 1: ganti setiap elemen dengan <b>kofaktornya</b>, hasilnya matriks kofaktor.</p>
        <p className="fragment">Langkah 2: <b>transpos</b> matriks kofaktor. Itulah adjoin. (Pada 2×2, ini yang menukar a dan d.)</p>
        <p className="fragment">Langkah 3: bagi dengan determinan. Bila <b>det = 0</b>, tidak ada invers.</p>
        <p className="fragment">Terapan: sistem tiga persamaan {tex(raw`AX=B`)} berpenyelesaian {tex(raw`X=A^{-1}B`)}.</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={{ ...mid, minHeight: 130, display: "grid", alignItems: "center" }}>{tex(lines[Math.min(step, 4)])}</div>
        <MatChips v={k} set={setK} />
        <div className={`ds-read ds-math ${D === 0 ? "ds-bad" : ""}`} style={mid}>{tex(raw`\det A=${nt(D)}`)} <span className="ds-muted">{D === 0 ? "tak punya invers" : "punya invers"}</span></div>
      </>}
    />
  );
}

/* ═════════ 13 · Ringkasan ═════════ */
function SummarySlide() {
  const rows: [string, string][] = [
    ["Ordo", raw`m\times n\ (\text{baris}\times\text{kolom})`],
    ["Jumlah", raw`A+B=[a_{ij}+b_{ij}]\ (\text{ordo sama})`],
    ["Kali skalar", raw`kA=[k\,a_{ij}]`],
    ["Kali", raw`(AB)_{ij}=\text{baris } i\text{ A}\times\text{kolom } j\text{ B}`],
    ["Determinan", raw`\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc`],
    ["Invers", raw`A^{-1}=\dfrac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}`],
    ["Sistem", raw`AX=B\ \Rightarrow\ X=A^{-1}B`],
    ["Minor, kofaktor", raw`C_{ij}=(-1)^{i+j}M_{ij}`],
    ["Det 3×3", raw`\det A=\sum_j a_{ij}C_{ij}\ (\text{atau Sarrus})`],
    ["Invers 3×3", raw`A^{-1}=\dfrac{1}{\det A}\operatorname{adj}(A),\ \operatorname{adj}=\operatorname{kof}^{T}`],
  ];
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Satu tabel, satu gagasan"
      copy={<>
        <p>Semua rumus ini sudah Anda <b>lihat bergerak</b>. Satu gagasan merangkumnya: matriks 2×2 = ke mana î dan ĵ mendarat.</p>
        <p className="fragment">Gagasan yang sama bekerja di komputer: grafika 3D, PageRank mesin pencari, sandi Hill, dan jaringan saraf tiruan semuanya memakai perkalian matriks.</p>
        <p className="fragment">Sekarang uji pemahaman dengan kuis.</p>
      </>}
      stage={
        <table className="ds-table" style={{ fontSize: 15 }}>
          <tbody>{rows.map(([a, t]) => <tr key={a}><th style={{ whiteSpace: "nowrap" }}>{a}</th><td>{tex(t)}</td></tr>)}</tbody>
        </table>
      }
    />
  );
}

export function MatriksDeck() {
  return (
    <SlideDeck>
      <TitleSlide />
      <HistorySlide />
      <AnatomySlide />
      <SumSlide />
      <MulSlide />
      <LinSlide />
      <CompSlide />
      <DetSlide />
      <InvSlide />
      <SolveSlide />
      <MinorSlide />
      <ExpandSlide />
      <SarrusSlide />
      <Inv3Slide />
      <SummarySlide />
      <Quiz eyebrow="Latihan · Kuis" title="Kuis 13 soal" items={QUIZ} />
    </SlideDeck>
  );
}
export default MatriksDeck;
