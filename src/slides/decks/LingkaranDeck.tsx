/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Btn, C, Chips, dot, fmt, Frame, mk, note, OFF, Range, rad, seg, shape, SimBoard, SlideDeck, still, useStep, useTween,
  type B, type BBox, type Build, type Vec,
} from "../common/core";
import { fill, ln, n, Quiz, solve, tex } from "../common/LinearKit";
import { QUIZ } from "./quizzes/LingkaranQuiz";

/* Slide "Lingkaran" (SMP): unsur → π, keliling, luas → sudut pusat dan keliling → busur, juring, tembereng
   → garis singgung (satu titik, dari titik luar, persekutuan luar dan dalam) → lingkaran luar dan dalam segitiga. */

const raw = String.raw;
const PI = Math.PI;
const O: Vec = [0, 0];

/* ───────── Matematika kecil ───────── */
const pol = (c: Vec, r: number, deg: number): Vec => [c[0] + r * Math.cos(rad(deg)), c[1] + r * Math.sin(rad(deg))];
const dist = (p: Vec, q: Vec) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const mid = (p: Vec, q: Vec): Vec => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const sq = (p: Vec) => p[0] * p[0] + p[1] * p[1];
/** Angka untuk TeX: minus biasa, koma desimal dilindungi. */
const nt = (v: number) => n(v).replace("−", "-").replace(",", "{,}");
const arcPts = (c: Vec, r: number, a0: number, a1: number, k = 48): Vec[] =>
  Array.from({ length: k + 1 }, (_, i) => pol(c, r, a0 + ((a1 - a0) * i) / k));
const angDeg = (v: Vec, p: Vec, q: Vec) => {
  const a: Vec = [p[0] - v[0], p[1] - v[1]], c: Vec = [q[0] - v[0], q[1] - v[1]];
  const k = (a[0] * c[0] + a[1] * c[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(c[0], c[1]));
  return (Math.acos(Math.max(-1, Math.min(1, k))) * 180) / PI;
};
const normRad = (x: number) => { while (x > PI) x -= 2 * PI; while (x < -PI) x += 2 * PI; return x; };

/* ───────── Penggambar serbaguna ───────── */
/** Busur lingkaran (derajat) sebagai kurva parametrik; 0 sampai 360 untuk lingkaran penuh. */
const circ = (b: B, c: () => Vec, r: () => number, a0: () => number, a1: () => number, color: string, w = 2.5, dash = 0) =>
  mk(b, "curve", [
    (t: number) => c()[0] + r() * Math.cos(t),
    (t: number) => c()[1] + r() * Math.sin(t),
    () => rad(a0()), () => rad(a1()),
  ], { ...still, strokeColor: color, strokeWidth: w, dash });
const sg = (b: B, on: () => boolean, p: () => Vec, q: () => Vec, color: string, w = 2, dash = 0) =>
  seg(b, () => (on() ? p() : OFF), () => (on() ? q() : OFF), color, w, dash);
const pt = (b: B, on: () => boolean, p: () => Vec, color: string, size = 5, name = "") =>
  dot(b, () => (on() ? p() : OFF), color, size, name);
/** Busur kecil penanda sudut di titik V antara arah ke P dan arah ke Q. */
const angMark = (b: B, V: () => Vec, P: () => Vec, Q: () => Vec, r: number, color: string, w = 2) => {
  const span = (): [number, number] => {
    const v = V(), a = Math.atan2(P()[1] - v[1], P()[0] - v[0]);
    const d = normRad(Math.atan2(Q()[1] - v[1], Q()[0] - v[0]) - a);
    return d >= 0 ? [a, a + d] : [a + d, a];
  };
  mk(b, "curve", [
    (t: number) => V()[0] + r * Math.cos(t), (t: number) => V()[1] + r * Math.sin(t),
    () => span()[0], () => span()[1],
  ], { ...still, strokeColor: color, strokeWidth: w });
};
/** Tanda siku-siku di titik V antara arah ke P dan arah ke Q. */
const rightMark = (b: B, V: () => Vec, P: () => Vec, Q: () => Vec, s: number, color: string = C.mute) =>
  shape(b, () => {
    const v = V(), p = P(), q = Q();
    const lp = Math.hypot(p[0] - v[0], p[1] - v[1]) || 1, lq = Math.hypot(q[0] - v[0], q[1] - v[1]) || 1;
    const u: Vec = [((p[0] - v[0]) / lp) * s, ((p[1] - v[1]) / lp) * s];
    const w: Vec = [((q[0] - v[0]) / lq) * s, ((q[1] - v[1]) / lq) * s];
    return [[v[0] + u[0], v[1] + u[1]], [v[0] + u[0] + w[0], v[1] + u[1] + w[1]], [v[0] + w[0], v[1] + w[1]]];
  }, { strokeColor: color, strokeWidth: 1.5, fillOpacity: 0 }, false);

const Tbl = (p: { head?: ReactNode[]; rows: ReactNode[][] }) => (
  <table className="ds-table">
    {p.head && <thead><tr>{p.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>}
    <tbody>{p.rows.map((r, i) => <tr key={i}><th>{r[0]}</th>{r.slice(1).map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
  </table>
);

/* ═════════ 0 · Sampul ═════════ */
const COVER: BBox = [-5, 4, 5, -4];
const buildCover: Build<object> = (b, _g, _s, clock) => {
  const R = 2.8;
  const th = () => (clock() * 45) % 360;
  const P = (): Vec => pol(O, R, th());
  fill(b, () => (th() < 1 ? null : [O, ...arcPts(O, R, 0, th(), 60)]), C.blue, 0.15);
  circ(b, () => O, () => R, () => 0, () => 360, C.ink, 3);
  sg(b, () => true, () => O, () => pol(O, R, 0), C.soft, 1.5, 2);
  sg(b, () => true, () => O, P, C.blue, 2.25);
  const tg = (s: number): Vec => { const p = P(), a = rad(th()); return [p[0] - s * 2 * Math.sin(a), p[1] + s * 2 * Math.cos(a)]; };
  sg(b, () => true, () => tg(1), () => tg(-1), C.orange, 2, 2);
  dot(b, () => O, C.ink, 4);
  dot(b, P, C.blue, 6);
  note(b, () => [-4.6, 3.3], () => `θ = ${fmt(th(), 0)}°`, C.mute);
};
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi · SMP"
      title="Lingkaran"
      copy={<>
        <p>Roda, jam dinding, piring, koin: semuanya <b>lingkaran</b>. Semua titiknya berjarak sama dari sebuah titik pusat.</p>
        <p className="ds-muted">Jari-jari berputar, daerah juring bertambah, dan garis putus-putus oranye selalu menyinggung lingkaran.</p>
      </>}
      stage={<SimBoard bbox={COVER} params={{}} build={buildCover} loop />}
    />
  );
}

/* ═════════ 1 · Peta materi ═════════ */
function MapSlide() {
  return (
    <Frame
      eyebrow="Peta materi"
      title="Dari bagian sampai garis singgung"
      copy={<>
        <p>Lingkaran punya banyak bagian. Kita akan mengukur, menghitung, lalu menghubungkannya dengan bangun lain.</p>
        <p className="fragment">Mulai dari <b>unsur</b>, lalu <b>π</b>, keliling, dan luas.</p>
        <p className="fragment">Lanjut ke <b>sudut</b>, busur, dan juring.</p>
        <p className="fragment">Akhirnya <b>garis singgung</b> dan lingkaran pada segitiga.</p>
      </>}
      stage={<Tbl rows={[
        ["01", "Unsur-unsur lingkaran dan pendalamannya"],
        ["02", "Nilai π, keliling, dan luas lingkaran"],
        ["03", "Sudut pusat dan sudut keliling"],
        ["04", "Panjang busur, luas juring, dan tembereng"],
        ["05", "Garis singgung: persekutuan luar dan dalam"],
        ["06", "Lingkaran luar dan lingkaran dalam segitiga"],
      ]} />}
    />
  );
}

/* ═════════ 2 · Unsur-unsur lingkaran ═════════ */
const UNSUR = [
  { s: "Titik pusat", d: "titik tetap di tengah. Semua titik pada lingkaran berjarak sama darinya.", c: C.red },
  { s: "Jari-jari", d: "ruas garis dari pusat ke titik pada lingkaran (OE). Panjangnya r.", c: C.orange },
  { s: "Diameter", d: "tali busur yang melalui pusat (AB). Panjangnya d = 2r, tali busur terpanjang.", c: C.blue },
  { s: "Tali busur", d: "ruas garis yang menghubungkan dua titik pada lingkaran (CD).", c: C.green },
  { s: "Busur", d: "bagian lengkung lingkaran di antara dua titik (busur CD).", c: C.red },
  { s: "Tembereng", d: "daerah di antara tali busur dan busurnya.", c: C.teal },
  { s: "Juring", d: "daerah yang dibatasi dua jari-jari dan sebuah busur (juring OCD).", c: C.violet },
  { s: "Apotema", d: "jarak dari pusat ke tali busur: garis dari O yang tegak lurus tali busur CD.", c: C.orange },
];
const BU: BBox = [-4.5, 4.5, 4.5, -4.5];
const UR = 3;
const UP: Record<string, Vec> = {
  O, A: pol(O, UR, 190), B: pol(O, UR, 10), C: pol(O, UR, 55), D: pol(O, UR, 125), E: pol(O, UR, 285),
};
UP.M = mid(UP.C, UP.D);
const USHOW: string[][] = [["O"], ["O", "E"], ["A", "B", "O"], ["C", "D"], ["C", "D"], ["C", "D"], ["O", "C", "D"], ["O", "M", "C", "D"]];
const buildUnsur: Build<{ k: number }> = (b, g) => {
  const k = () => g().k;
  fill(b, () => (k() === 5 ? arcPts(O, UR, 55, 125, 30) : null), UNSUR[5].c, 0.3);
  fill(b, () => (k() === 6 ? [O, ...arcPts(O, UR, 55, 125, 30)] : null), UNSUR[6].c, 0.25);
  circ(b, () => O, () => UR, () => 0, () => 360, C.ink, 2.75);
  shape(b, () => (k() === 4 ? arcPts(O, UR, 55, 125, 30) : null), { strokeColor: UNSUR[4].c, strokeWidth: 6 }, false);
  sg(b, () => k() === 1, () => O, () => UP.E, UNSUR[1].c, 3.25);
  sg(b, () => k() === 2, () => UP.A, () => UP.B, UNSUR[2].c, 3.25);
  sg(b, () => k() === 3, () => UP.C, () => UP.D, UNSUR[3].c, 3.25);
  sg(b, () => k() === 5 || k() === 7, () => UP.C, () => UP.D, C.mute, 2.5);
  sg(b, () => k() === 6, () => O, () => UP.C, UNSUR[6].c, 2.75);
  sg(b, () => k() === 6, () => O, () => UP.D, UNSUR[6].c, 2.75);
  sg(b, () => k() === 7, () => O, () => UP.M, UNSUR[7].c, 3.25);
  rightMark(b, () => (k() === 7 ? UP.M : OFF), () => O, () => UP.C, 0.3, C.mute);
  Object.entries(UP).forEach(([nm, p]) => dot(b, () => (USHOW[k()].includes(nm) ? p : OFF), nm === "O" ? C.red : C.ink, 5, nm));
};
function ElementsSlide() {
  const [k, setK] = useState(0);
  const u = UNSUR[k];
  return (
    <Frame
      eyebrow="01 · Unsur lingkaran"
      title="Nama bagian lingkaran"
      copy={<>
        <p>Lingkaran adalah kumpulan titik yang <b>berjarak sama</b> dari satu titik tetap, yaitu pusat.</p>
        <p>Pilih nama di bawah papan. Bagian yang dimaksud akan menyala pada gambar.</p>
        <p className="fragment">Diameter adalah tali busur yang <b>melalui pusat</b>, sehingga {tex("d=2r")}.</p>
        <p className="fragment">Juring dibatasi <b>dua jari-jari</b>, tembereng dibatasi <b>satu tali busur</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BU} params={{ k }} build={buildUnsur} maxH={330} />
        <Chips value={k} onPick={setK} items={UNSUR.map((x, i) => ({ v: i, label: x.s }))} />
        <div className="ds-read"><b style={{ color: u.c }}>{u.s}</b>: {u.d}</div>
      </>}
    />
  );
}

/* ═════════ 3 · Pendalaman: tali busur dan apotema ═════════ */
const BCH: BBox = [-5, 5, 5, -5];
const buildChord: Build<{ r: number; d: number }> = (b, g) => {
  const r = () => g().r, d = () => Math.min(g().d, g().r);
  const h = () => Math.sqrt(Math.max(0, r() * r() - d() * d()));
  circ(b, () => O, r, () => 0, () => 360, C.ink, 2.75);
  sg(b, () => true, () => [-r(), 0], () => [r(), 0], C.soft, 1.5, 2);
  sg(b, () => true, () => [-h(), d()], () => [h(), d()], C.blue, 3.5);
  sg(b, () => true, () => O, () => [0, d()], C.orange, 3.25);
  sg(b, () => true, () => O, () => [h(), d()], C.ink, 2, 2);
  rightMark(b, () => [0, d()], () => O, () => [h(), d()], 0.35);
  dot(b, () => O, C.ink, 4, "O");
  dot(b, () => [0, d()], C.orange, 5, "M");
  dot(b, () => [h(), d()], C.blue, 5, "D");
  dot(b, () => [-h(), d()], C.blue, 5, "C");
  note(b, () => [0.15, d() / 2 - 0.2], () => "apotema", C.orange);
};
function ChordSlide() {
  const [r, setR] = useState(4), [d, setD] = useState(2);
  const de = Math.min(d, r), h = Math.sqrt(Math.max(0, r * r - de * de));
  return (
    <Frame
      eyebrow="01 · Pendalaman unsur"
      title="Tali busur dan apotema"
      copy={<>
        <p>Tarik garis dari pusat <b>tegak lurus</b> tali busur CD. Garis itu (apotema OM) <b>membagi dua</b> tali busur.</p>
        <p className="ds-math">{tex(raw`r^{2}=d^{2}+\left(\tfrac12 CD\right)^{2}`)}</p>
        <p className="fragment">Segitiga OMD siku-siku di M, sehingga berlaku Pythagoras.</p>
        <p className="fragment">Makin dekat tali busur ke pusat, makin panjang. Saat d = 0, tali busur menjadi <b>diameter</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BCH} params={{ r, d }} build={buildChord} maxH={330} />
        <div className="ds-controls">
          <Range label={tex("r")} value={r} min={2} max={4} step={0.5} onChange={setR} color={C.ink} shown={n(r)} />
          <Range label={tex(raw`d\ (\text{apotema})`)} value={d} min={0} max={4} step={0.25} onChange={setD} color={C.orange} shown={n(de)} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.orange }}>apotema = {n(de)}</span> · <span style={{ color: C.blue }}>½ tali busur = {n(h)}</span><br />
          tali busur CD = {n(2 * h)} · diameter = {n(2 * r)}{de === 0 && <> <span className="ds-ok">tali busur = diameter ✓</span></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 4 · Nilai π: menggulung lingkaran ═════════ */
const BR: BBox = [-3, 5.5, 15, -1.5];
type RP = { d: number; t: number; ruler: boolean };
const buildRoll: Build<RP> = (b, g) => {
  const d = () => g().d, L = () => PI * g().d * g().t;
  const C0 = (): Vec => [L(), d() / 2];
  sg(b, () => true, () => [-3, 0], () => [15, 0], C.soft, 1.5);
  sg(b, () => L() > 0.001, () => O, () => [L(), 0], C.orange, 5);
  circ(b, C0, () => d() / 2, () => 0, () => 360, C.ink, 3);
  const M = (): Vec => pol(C0(), d() / 2, -90 - 360 * g().t);
  const M2 = (): Vec => pol(C0(), d() / 2, 90 - 360 * g().t);
  sg(b, () => true, M, M2, C.blue, 2.5);
  dot(b, M, C.orange, 6);
  dot(b, C0, C.ink, 4);
  [0, 1, 2, 3].forEach((k) =>
    sg(b, () => g().ruler && L() > k * d() + 1e-6, () => [k * d(), -0.7], () => [Math.min((k + 1) * d(), L()), -0.7], k % 2 ? C.violet : C.blue, 5));
};
function PiRollSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [d, setD] = useState(3);
  const [tT, setT] = useState(0);
  useEffect(() => setT(step >= 1 ? 1 : 0), [step]);
  const t = useTween(tT, 1600);
  const L = PI * d * t;
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · Nilai π"
      title="Menggulung lingkaran"
      copy={<>
        <p>Gulung lingkaran satu putaran penuh di atas garis lurus. Panjang gulungan (garis oranye) adalah <b>keliling</b>.</p>
        <p className="fragment">Tekan →: lingkaran berguling satu putaran.</p>
        <p className="fragment">Ukur gulungan dengan <b>diameter</b>: muat <b>3 diameter lebih sedikit</b> (batang biru dan ungu).</p>
        <p className="fragment">Ganti ukuran lingkaran. Perbandingannya selalu sama: {tex(raw`\pi=\dfrac{K}{d}\approx3{,}14`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BR} params={{ d, t, ruler: true }} build={buildRoll} maxH={330} />
        <Chips value={d} onPick={setD} items={[2, 3, 4].map((v) => ({ v, label: `d = ${v}` }))} />
        <div className="ds-controls ds-controls--one">
          <Range label="putaran" value={tT} min={0} max={1} step={0.01} onChange={setT} color={C.orange} shown={fmt(tT, 2)} />
        </div>
        <div className="ds-read">
          gulungan = {fmt(L, 2)} · diameter = {d}<br />
          gulungan ÷ diameter = <b>{fmt(L / d, 3)}</b>{t > 0.995 && <> <span className="ds-ok">≈ π ✓</span></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 5 · Nilai π: segi banyak (Archimedes) ═════════ */
const BPG: BBox = [-4.5, 4.5, 4.5, -4.5];
const PG_R = 3;
const buildPoly: Build<{ n: number }> = (b, g) => {
  const N = () => g().n;
  shape(b, () => Array.from({ length: N() }, (_, k) => pol(O, PG_R / Math.cos(PI / N()), ((k + 0.5) * 360) / N())),
    { strokeColor: C.blue, strokeWidth: 2, fillColor: C.blue, fillOpacity: 0.06 });
  shape(b, () => Array.from({ length: N() }, (_, k) => pol(O, PG_R, (k * 360) / N())),
    { strokeColor: C.orange, strokeWidth: 2.25, fillColor: C.orange, fillOpacity: 0.12 });
  circ(b, () => O, () => PG_R, () => 0, () => 360, C.ink, 2.75);
  dot(b, () => O, C.ink, 4);
};
function PolySlide() {
  const [nn, setN] = useState(6);
  const inn = nn * Math.sin(PI / nn), out = nn * Math.tan(PI / nn);
  return (
    <Frame
      eyebrow="02 · Nilai π"
      title="Mengurung π dengan segi banyak"
      copy={<>
        <p>Keliling lingkaran terjepit di antara keliling segi-n <b style={{ color: C.orange }}>di dalam</b> dan <b style={{ color: C.blue }}>di luar</b> lingkaran.</p>
        <p className="fragment">Tambah banyak sisi n. Kedua segi banyak merapat ke lingkaran.</p>
        <p className="fragment">Bagilah kelilingnya dengan diameter. Kedua nilai itu mengurung π.</p>
        <p className="fragment">Archimedes memakai segi-96 dan mendapat {tex(raw`\tfrac{223}{71}<\pi<\tfrac{22}{7}`)}, yaitu 3,1408 &lt; π &lt; 3,1429.</p>
      </>}
      stage={<>
        <SimBoard bbox={BPG} params={{ n: nn }} build={buildPoly} maxH={330} />
        <Chips value={nn} onPick={setN} items={[6, 12, 24, 96].map((v) => ({ v, label: `n = ${v}` }))} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("n")} value={nn} min={4} max={96} step={1} onChange={setN} color={C.ink} shown={String(nn)} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.orange }}>keliling dalam ÷ d = {fmt(inn, 4)}</span><br />
          <span style={{ color: C.blue }}>keliling luar ÷ d = {fmt(out, 4)}</span><br />
          {fmt(inn, 4)} &lt; π &lt; {fmt(out, 4)} (π = 3,1416…)
        </div>
      </>}
    />
  );
}

/* ═════════ 6 · Keliling dan luas: hitung ═════════ */
const BCA: BBox = [-15, 15, 15, -15];
const buildCalc: Build<{ r: number }> = (b, g) => {
  const r = () => g().r;
  fill(b, () => arcPts(O, r(), 0, 360, 72), C.teal, 0.18);
  circ(b, () => O, r, () => 0, () => 360, C.ink, 2.75);
  sg(b, () => true, () => [-r(), 0], () => [r(), 0], C.blue, 2, 2);
  sg(b, () => true, () => O, () => [r(), 0], C.orange, 3.5);
  dot(b, () => O, C.ink, 4);
  note(b, () => [r() / 2 - 0.4, 0.5], () => "r", C.orange);
};
const PIV = [
  { v: 22 / 7, t: raw`\dfrac{22}{7}`, l: "π = 22/7" },
  { v: 3.14, t: raw`3{,}14`, l: "π = 3,14" },
  { v: PI, t: raw`3{,}14159`, l: "π kalkulator" },
];
function CalcSlide() {
  const [r, setR] = useState(7), [pm, setPm] = useState(0);
  const p = PIV[pm], K = 2 * p.v * r, L = p.v * r * r;
  return (
    <Frame
      eyebrow="02 · Keliling dan luas"
      title="K = 2πr dan L = πr²"
      copy={<>
        <p className="ds-math">{tex(raw`K=\pi d=2\pi r\qquad L=\pi r^{2}`)}</p>
        <p>Dari π = K/d, diperoleh K = πd. Luas dibuktikan pada slide berikutnya.</p>
        <p className="fragment">Pakai <b>22/7</b> bila r kelipatan 7. Pakai <b>3,14</b> bila r bukan kelipatan 7.</p>
        <p className="fragment">Keliling satuannya <b>cm</b>, luas satuannya <b>cm²</b>. Jangan tertukar.</p>
        <p className="ds-muted">Geser r dan ganti nilai π. Coba r = 7, 14, lalu 10.</p>
      </>}
      stage={<>
        <SimBoard bbox={BCA} params={{ r }} build={buildCalc} maxH={310} />
        <Chips value={pm} onPick={setPm} items={PIV.map((x, i) => ({ v: i, label: x.l }))} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("r")} value={r} min={1} max={14} step={1} onChange={setR} color={C.orange} shown={String(r)} />
        </div>
        <div className="ds-read">
          {tex(raw`K=2\times${p.t}\times${r}=${nt(K)}`)}
          {tex(raw`L=${p.t}\times${r}^{2}=${nt(L)}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 7 · Luas: dari juring ke persegi panjang ═════════ */
const BSEC: BBox = [-4.2, 3.4, 4.2, -3.4];
const RS = 2.2, SEC_M = 12;
const sectorPts = (j: number, nn: number, u: number): Vec[] => {
  const th = (2 * PI) / nn, w = RS * Math.sin(th / 2), rc = RS * Math.cos(th / 2), off = ((nn - 1) * w) / 2;
  const up = j % 2 === 0;
  const phis = Array.from({ length: SEC_M + 1 }, (_, i) => -th / 2 + (th * i) / SEC_M);
  const beta = (j + 0.5) * th;
  const circle: Vec[] = [[0, 0], ...phis.map((f): Vec => [RS * Math.sin(beta + f), RS * Math.cos(beta + f)])];
  const xc = j * w - off, dy = -RS / 2;
  const arr: Vec[] = [
    [xc, up ? 0 : rc] as Vec,
    ...phis.map((f): Vec => [xc + RS * Math.sin(f), up ? RS * Math.cos(f) : rc - RS * Math.cos(f)]),
  ].map((q): Vec => [q[0], q[1] + dy]);
  return circle.map((q, i): Vec => [q[0] + u * (arr[i][0] - q[0]), q[1] + u * (arr[i][1] - q[1])]);
};
const buildSectors: Build<{ n: number; u: number }> = (b, g) => {
  for (let j = 0; j < 40; j++) {
    shape(b, () => (j < g().n ? sectorPts(j, g().n, g().u) : null),
      { strokeColor: "#ffffff", strokeWidth: 1, fillColor: j % 2 ? C.orange : C.blue, fillOpacity: 0.38 });
  }
  const on = () => g().u > 0.95;
  sg(b, on, () => [-PI * RS / 2, -1.9], () => [PI * RS / 2, -1.9], C.ink, 2);
  sg(b, on, () => [PI * RS / 2 + 0.45, -RS / 2], () => [PI * RS / 2 + 0.45, RS / 2], C.ink, 2);
  note(b, () => (on() ? [-1.3, -2.5] : OFF), () => "½ keliling = πr", C.ink);
  note(b, () => (on() ? [PI * RS / 2 + 0.6, -0.2] : OFF), () => "r", C.ink);
};
function AreaSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [nn, setN] = useState(8), [uT, setU] = useState(0);
  useEffect(() => { setU(step >= 1 ? 1 : 0); setN(step >= 2 ? 36 : 8); }, [step]);
  const u = useTween(uT, 700);
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · Luas lingkaran"
      title="Dari juring ke persegi panjang"
      copy={<>
        <p>Potong lingkaran menjadi n <b>juring sama besar</b>. Luasnya tidak berubah bila juring-juring itu disusun ulang.</p>
        <p className="fragment">Tekan →: juring disusun berselang-seling.</p>
        <p className="fragment">Makin banyak juring, susunannya makin mirip <b>persegi panjang</b>.</p>
        <p className="fragment">Lebar = <b>½ keliling</b> = πr, tinggi = <b>r</b>. Maka {tex(raw`L=\pi r\times r=\pi r^{2}`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BSEC} params={{ n: nn, u }} build={buildSectors} maxH={330} />
        <div className="ds-controls">
          <Range label={tex("n")} value={nn} min={4} max={40} step={2} onChange={setN} color={C.blue} shown={String(nn)} />
          <Range label="susun ulang" value={uT} min={0} max={1} step={0.05} onChange={setU} color={C.orange} shown={`${Math.round(uT * 100)}%`} />
        </div>
        <div className="ds-read">
          lebar ≈ n·sin(180°/n)·r = {fmt(nn * Math.sin(PI / nn), 3)}·r<br />
          ½ keliling = π·r = {fmt(PI, 3)}·r
        </div>
      </>}
    />
  );
}

/* ═════════ 8 · Roda berputar ═════════ */
function WheelSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [rr, setRr] = useState(21);
  const [vT, setV] = useState(0);
  useEffect(() => setV(step >= 1 ? 2 : 0), [step]);
  const v = useTween(vT, 1800);
  const K = (2 * 22 * rr) / 7;
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · Penerapan keliling"
      title="Roda berputar, jarak bertambah"
      copy={<>
        <p>Satu putaran penuh roda menempuh jarak sebesar <b>keliling</b>-nya.</p>
        <p className="ds-math">{tex(raw`\text{jarak}=\text{banyak putaran}\times 2\pi r`)}</p>
        <p className="fragment">Tekan →: roda berputar dua kali.</p>
        <p className="fragment"><b>Contoh.</b> Roda r = 21 cm berputar 50 kali: {tex(raw`50\times2\times\tfrac{22}{7}\times21=6.600`)} cm = 66 m.</p>
      </>}
      stage={<>
        <SimBoard bbox={BR} params={{ d: 2, t: v, ruler: false }} build={buildRoll} maxH={300} />
        <Chips value={rr} onPick={setRr} items={[7, 14, 21, 35].map((x) => ({ v: x, label: `r = ${x} cm` }))} />
        <div className="ds-controls ds-controls--one">
          <Range label="banyak putaran" value={vT} min={0} max={2} step={0.05} onChange={setV} color={C.orange} shown={fmt(vT, 2)} />
        </div>
        <div className="ds-read">
          keliling roda = {n(K)} cm<br />
          {fmt(v, 2)} putaran → <b>{n(v * K)} cm</b><br />
          50 putaran → {n(50 * K)} cm = {n((50 * K) / 100)} m
        </div>
      </>}
    />
  );
}

/* ═════════ 9 · Sudut pusat dan sudut keliling ═════════ */
const BCE: BBox = [-4, 4, 4, -4];
const CR = 3;
const psi = (al: number, s: number) => 98 + al / 2 + s * (344 - al);
const buildCentral: Build<{ al: number; s: number; q: boolean }> = (b, g) => {
  const A = (): Vec => pol(O, CR, 90 + g().al / 2), Bq = (): Vec => pol(O, CR, 90 - g().al / 2);
  const P = (): Vec => pol(O, CR, psi(g().al, g().s)), Q = (): Vec => pol(O, CR, psi(g().al, 1 - g().s));
  circ(b, () => O, () => CR, () => 0, () => 360, C.ink, 2.5);
  circ(b, () => O, () => CR, () => 90 - g().al / 2, () => 90 + g().al / 2, C.orange, 6);
  sg(b, () => true, () => O, A, C.orange, 2.5);
  sg(b, () => true, () => O, Bq, C.orange, 2.5);
  sg(b, () => true, P, A, C.blue, 2.5);
  sg(b, () => true, P, Bq, C.blue, 2.5);
  sg(b, () => g().q, Q, A, C.violet, 2.5);
  sg(b, () => g().q, Q, Bq, C.violet, 2.5);
  angMark(b, () => O, A, Bq, 0.8, C.orange);
  angMark(b, P, A, Bq, 0.55, C.blue);
  angMark(b, () => (g().q ? Q() : OFF), A, Bq, 0.55, C.violet);
  dot(b, () => O, C.ink, 4, "O");
  dot(b, A, C.ink, 5, "A");
  dot(b, Bq, C.ink, 5, "B");
  dot(b, P, C.blue, 6, "P");
  pt(b, () => g().q, Q, C.violet, 6, "Q");
};
function CentralSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [al, setAl] = useState(100), [s, setS] = useState(0.4);
  const A = pol(O, CR, 90 + al / 2), Bq = pol(O, CR, 90 - al / 2);
  const P = pol(O, CR, psi(al, s)), Q = pol(O, CR, psi(al, 1 - s));
  const q = step >= 3;
  return (
    <Frame
      innerRef={ref}
      eyebrow="03 · Sudut pusat dan keliling"
      title="Sudut pusat = 2 × sudut keliling"
      copy={<>
        <p>Busur AB (oranye) dilihat dari dua tempat: dari <b>pusat O</b> dan dari <b>titik P pada lingkaran</b>.</p>
        <p className="fragment">∠AOB disebut <b>sudut pusat</b>, ∠APB disebut <b>sudut keliling</b>. Keduanya menghadap busur AB.</p>
        <p className="fragment">Geser P sepanjang lingkaran. ∠APB <b>tidak berubah</b>.</p>
        <p className="fragment">Tambah titik Q: semua sudut keliling yang menghadap busur sama <b>sama besar</b>.</p>
        <p className="fragment">{tex(raw`\angle AOB=2\times\angle APB`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BCE} params={{ al, s, q }} build={buildCentral} maxH={330} />
        <div className="ds-controls">
          <Range label={tex(raw`\angle AOB`)} value={al} min={20} max={170} step={5} onChange={setAl} color={C.orange} shown={`${al}°`} />
          <Range label="posisi P" value={s} min={0} max={1} step={0.01} onChange={setS} color={C.blue} shown={`${Math.round(s * 100)}%`} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.orange }}>∠AOB = {n(al)}°</span> · <span style={{ color: C.blue }}>∠APB = {n(angDeg(P, A, Bq))}°</span>
          {q && <> · <span style={{ color: C.violet }}>∠AQB = {n(angDeg(Q, A, Bq))}°</span></>}<br />
          ∠AOB ÷ ∠APB = {n(al / angDeg(P, A, Bq))}
        </div>
      </>}
    />
  );
}

/* ═════════ 10 · Sudut keliling menghadap diameter ═════════ */
const buildThales: Build<{ th: number }> = (b, g) => {
  const A: Vec = [-CR, 0], Bq: Vec = [CR, 0];
  const P = (): Vec => pol(O, CR, g().th);
  circ(b, () => O, () => CR, () => 0, () => 360, C.ink, 2.5);
  fill(b, () => [A, P(), Bq], C.teal, 0.16);
  sg(b, () => true, () => A, () => Bq, C.orange, 3.5);
  sg(b, () => true, () => A, P, C.blue, 2.5);
  sg(b, () => true, P, () => Bq, C.blue, 2.5);
  rightMark(b, P, () => A, () => Bq, 0.4, C.green);
  dot(b, () => O, C.ink, 4, "O");
  dot(b, () => A, C.ink, 5, "A");
  dot(b, () => Bq, C.ink, 5, "B");
  dot(b, P, C.blue, 6, "P");
};
function ThalesSlide() {
  const [th, setTh] = useState(60);
  const A: Vec = [-CR, 0], Bq: Vec = [CR, 0], P = pol(O, CR, th);
  const pa = dist(P, A), pb = dist(P, Bq);
  return (
    <Frame
      eyebrow="03 · Sudut pusat dan keliling"
      title="Sudut keliling menghadap diameter"
      copy={<>
        <p>Diameter AB membentuk sudut pusat <b>180°</b>. Maka sudut keliling di hadapannya:</p>
        <p className="ds-math">{tex(raw`\angle APB=\tfrac12\times180^\circ=90^\circ`)}</p>
        <p className="fragment">Geser P ke mana pun: segitiga ABP selalu <b>siku-siku di P</b>.</p>
        <p className="fragment">Akibatnya {tex(raw`PA^{2}+PB^{2}=AB^{2}`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BCE} params={{ th }} build={buildThales} maxH={330} />
        <div className="ds-controls ds-controls--one">
          <Range label="posisi P" value={th} min={10} max={170} step={5} onChange={setTh} color={C.blue} shown={`${th}°`} />
        </div>
        <div className="ds-read">
          ∠APB = <b className="ds-ok">{n(angDeg(P, A, Bq))}°</b><br />
          PA² + PB² = {n(pa * pa)} + {n(pb * pb)} = {n(pa * pa + pb * pb)} = AB² = 36
        </div>
      </>}
    />
  );
}

/* ═════════ 11 · Busur dan juring: perbandingan senilai ═════════ */
const BSE: BBox = [-5, 5, 5, -5];
const buildSector: Build<{ al: number; r: number; mode: number }> = (b, g) => {
  const r = () => g().r, al = () => g().al;
  fill(b, () => (g().mode === 1 ? [O, ...arcPts(O, r(), 0, al(), 72)] : null), C.violet, 0.3);
  fill(b, () => (g().mode === 0 ? [O, ...arcPts(O, r(), 0, al(), 72)] : null), C.orange, 0.1);
  circ(b, () => O, r, () => 0, () => 360, C.ink, 2.25);
  shape(b, () => (g().mode === 0 ? arcPts(O, r(), 0, al(), 72) : null), { strokeColor: C.orange, strokeWidth: 6 }, false);
  shape(b, () => (g().mode === 1 ? arcPts(O, r(), 0, al(), 72) : null), { strokeColor: C.violet, strokeWidth: 3 }, false);
  sg(b, () => true, () => O, () => pol(O, r(), 0), C.ink, 2);
  sg(b, () => true, () => O, () => pol(O, r(), al()), C.ink, 2);
  circ(b, () => O, () => 0.8, () => 0, () => al(), C.ink, 2);
  dot(b, () => O, C.ink, 4);
};
function SectorSlide() {
  const [al, setAl] = useState(72), [r, setR] = useState(3), [mode, setMode] = useState(0);
  const fr = al / 360, arcL = fr * 2 * PI * r, jur = fr * PI * r * r;
  return (
    <Frame
      eyebrow="04 · Busur dan juring"
      title="Sebanding dengan sudut pusat"
      copy={<>
        <p>Sudut pusat α mengambil bagian <b>α/360</b> dari seluruh lingkaran.</p>
        <p className="ds-math">{tex(raw`\dfrac{\text{busur}}{\text{keliling}}=\dfrac{\text{juring}}{\text{luas}}=\dfrac{\alpha}{360^\circ}`)}</p>
        <p className="fragment"><b>Panjang busur</b> = {tex(raw`\dfrac{\alpha}{360^\circ}\times2\pi r`)}</p>
        <p className="fragment"><b>Luas juring</b> = {tex(raw`\dfrac{\alpha}{360^\circ}\times\pi r^{2}`)}</p>
        <p className="fragment"><b>Contoh.</b> α = 72°, r = 10 cm, π = 3,14: busur = 0,2 × 62,8 = 12,56 cm, juring = 0,2 × 314 = 62,8 cm².</p>
      </>}
      stage={<>
        <SimBoard bbox={BSE} params={{ al, r, mode }} build={buildSector} maxH={310} />
        <Chips value={mode} onPick={setMode} items={[{ v: 0, label: "Panjang busur" }, { v: 1, label: "Luas juring" }]} />
        <div className="ds-controls">
          <Range label={tex(raw`\alpha`)} value={al} min={10} max={350} step={5} onChange={setAl} color={C.orange} shown={`${al}°`} />
          <Range label={tex("r")} value={r} min={1} max={4} step={0.5} onChange={setR} color={C.ink} shown={n(r)} />
        </div>
        <div className="ds-read">
          α/360 = {al}/360 = {fmt(fr, 3)}<br />
          <span style={{ color: mode === 0 ? C.orange : C.mute }}>busur = {fmt(fr, 3)} × {n(2 * PI * r)} = <b>{n(arcL)}</b></span><br />
          <span style={{ color: mode === 1 ? C.violet : C.mute }}>juring = {fmt(fr, 3)} × {n(PI * r * r)} = <b>{n(jur)}</b></span>
        </div>
      </>}
    />
  );
}

/* ═════════ 12 · Tembereng ═════════ */
const buildSegment: Build<{ al: number; r: number }> = (b, g) => {
  const r = () => g().r, al = () => g().al;
  const A = (): Vec => pol(O, r(), 90 - al() / 2), Bq = (): Vec => pol(O, r(), 90 + al() / 2);
  fill(b, () => [O, ...arcPts(O, r(), 90 - al() / 2, 90 + al() / 2, 60)], C.violet, 0.14);
  fill(b, () => [O, A(), Bq()], C.orange, 0.3);
  fill(b, () => arcPts(O, r(), 90 - al() / 2, 90 + al() / 2, 60), C.teal, 0.4);
  circ(b, () => O, r, () => 0, () => 360, C.ink, 2.25);
  sg(b, () => true, () => O, A, C.ink, 2);
  sg(b, () => true, () => O, Bq, C.ink, 2);
  sg(b, () => true, A, Bq, C.blue, 3);
  sg(b, () => true, () => O, () => [0, r() * Math.cos(rad(al() / 2))], C.orange, 2.5, 2);
  dot(b, () => O, C.ink, 4, "O");
  dot(b, A, C.ink, 5, "B");
  dot(b, Bq, C.ink, 5, "A");
};
function SegmentSlide() {
  const [al, setAl] = useState(90), [r, setR] = useState(4);
  const base = 2 * r * Math.sin(rad(al / 2)), h = r * Math.cos(rad(al / 2));
  const jur = (al / 360) * PI * r * r, tri = 0.5 * base * h;
  return (
    <Frame
      eyebrow="04 · Tembereng"
      title="Luas tembereng"
      copy={<>
        <p>Tembereng (hijau) adalah juring (ungu) <b>dikurangi</b> segitiga AOB (oranye).</p>
        <p className="ds-math">{tex(raw`L_{tembereng}=L_{juring}-L_{\triangle AOB}`)}</p>
        <p className="fragment">Segitiga: alas = tali busur AB, tinggi = <b>apotema</b>.</p>
        <p className="fragment">Untuk α = 90°: {tex(raw`L_{tembereng}=\tfrac14\pi r^{2}-\tfrac12r^{2}`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BSE} params={{ al, r }} build={buildSegment} maxH={310} />
        <div className="ds-controls">
          <Range label={tex(raw`\alpha`)} value={al} min={20} max={180} step={10} onChange={setAl} color={C.orange} shown={`${al}°`} />
          <Range label={tex("r")} value={r} min={2} max={4} step={0.5} onChange={setR} color={C.ink} shown={n(r)} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.violet }}>juring = {n(jur)}</span><br />
          <span style={{ color: C.orange }}>segitiga = ½ × {n(base)} × {n(h)} = {n(tri)}</span><br />
          <span className="ds-ok">tembereng = {n(jur)} − {n(tri)} = <b>{n(jur - tri)}</b></span>
        </div>
      </>}
    />
  );
}

/* ═════════ 13 · Garis singgung: sifat dasar ═════════ */
const BTG: BBox = [-5, 5, 5, -5];
const buildTanProp: Build<{ ang: number; dl: number }> = (b, g) => {
  const T = (): Vec => pol(O, CR, g().ang);
  const u = (): Vec => { const a = rad(g().ang + 90 + g().dl); return [Math.cos(a), Math.sin(a)]; };
  circ(b, () => O, () => CR, () => 0, () => 360, C.ink, 3);
  ln(b, () => { const t = T(), v = u(); return [-v[1], v[0], -v[1] * t[0] + v[0] * t[1]]; }, C.orange, 2.75);
  sg(b, () => true, () => O, T, C.blue, 2.5);
  rightMark(b, () => (g().dl === 0 ? T() : OFF), () => O, () => { const t = T(), a = rad(g().ang + 90); return [t[0] + Math.cos(a), t[1] + Math.sin(a)]; }, 0.4, C.green);
  const Q = (): Vec => { const t = T(), v = u(), k = -2 * (t[0] * v[0] + t[1] * v[1]); return [t[0] + k * v[0], t[1] + k * v[1]]; };
  pt(b, () => Math.abs(g().dl) > 0.5, Q, C.violet, 6, "Q");
  dot(b, () => O, C.ink, 4, "O");
  dot(b, T, C.red, 6, "T");
};
function TanPropSlide() {
  const [ang, setAng] = useState(40), [dl, setDl] = useState(25);
  const tangent = dl === 0;
  return (
    <Frame
      eyebrow="05 · Garis singgung"
      title="Menyentuh di satu titik"
      copy={<>
        <p>Garis yang melalui T bisa <b>memotong</b> lingkaran di dua titik atau hanya <b>menyinggung</b> di T.</p>
        <p className="fragment">Putar garis sampai titik Q merapat ke T. Saat itu garis <b>menyinggung</b>: hanya satu titik sekutu.</p>
        <p className="fragment">Sifat penting: garis singgung <b>tegak lurus jari-jari</b> yang melalui titik singgung.</p>
        <p className="ds-math">{tex(raw`OT\perp\text{garis singgung}`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BTG} params={{ ang, dl }} build={buildTanProp} maxH={320} />
        <div className="ds-controls">
          <Range label="titik T" value={ang} min={0} max={360} step={5} onChange={setAng} color={C.red} shown={`${ang}°`} />
          <Range label="putaran garis" value={dl} min={-40} max={40} step={1} onChange={setDl} color={C.orange} shown={`${dl}°`} />
        </div>
        <div className="ds-read">
          {tangent
            ? <span className="ds-ok">Menyinggung di T: satu titik sekutu, dan ∠(OT, garis) = 90° ✓</span>
            : <span className="ds-bad">Memotong di T dan Q: dua titik sekutu, bukan garis singgung.</span>}{" "}
          <Btn onClick={() => setDl(0)}>Jadikan garis singgung</Btn>
        </div>
      </>}
    />
  );
}

/* ═════════ 14 · Garis singgung dari titik di luar ═════════ */
const BTO: BBox = [-4, 5, 9, -5];
const buildTanOut: Build<{ r: number; d: number }> = (b, g) => {
  const r = () => g().r, d = () => g().d;
  const out = () => d() > r() + 1e-9;
  const T = (s: number): Vec => [(r() * r()) / d(), (s * r() * Math.sqrt(Math.max(0, d() * d() - r() * r()))) / d()];
  const Pp = (): Vec => [d(), 0];
  circ(b, () => O, r, () => 0, () => 360, C.ink, 3);
  sg(b, () => true, () => O, Pp, C.soft, 1.5, 2);
  [1, -1].forEach((s) => {
    sg(b, out, Pp, () => T(s), C.orange, 3.25);
    sg(b, out, () => O, () => T(s), C.blue, 2, 2);
    rightMark(b, () => (out() ? T(s) : OFF), () => O, Pp, 0.35, C.green);
    pt(b, out, () => T(s), C.red, 5, s === 1 ? "A" : "B");
  });
  dot(b, () => O, C.ink, 4, "O");
  dot(b, Pp, C.orange, 6, "P");
};
function TanOutSlide() {
  const [r, setR] = useState(2), [d, setD] = useState(5);
  const out = d > r, on = d === r;
  const l = Math.sqrt(Math.max(0, d * d - r * r));
  return (
    <Frame
      eyebrow="05 · Garis singgung"
      title="Dua singgung dari satu titik"
      copy={<>
        <p>Dari titik P <b>di luar</b> lingkaran, ada tepat <b>dua</b> garis singgung. Dari titik <b>pada</b> lingkaran ada satu. Dari titik <b>di dalam</b> tidak ada.</p>
        <p className="fragment">Segitiga OAP siku-siku di A, sehingga {tex(raw`PA=\sqrt{OP^{2}-OA^{2}}=\sqrt{d^{2}-r^{2}}`)}</p>
        <p className="fragment">Kedua segitiga OAP dan OBP kongruen, jadi <b>PA = PB</b>.</p>
        <p className="ds-muted">Geser d sampai P berada di dalam, pada, dan di luar lingkaran.</p>
      </>}
      stage={<>
        <SimBoard bbox={BTO} params={{ r, d }} build={buildTanOut} maxH={320} />
        <div className="ds-controls">
          <Range label={tex("r")} value={r} min={1} max={3} step={0.5} onChange={setR} color={C.ink} shown={n(r)} />
          <Range label={tex(raw`d=OP`)} value={d} min={1} max={8} step={0.5} onChange={setD} color={C.orange} shown={n(d)} />
        </div>
        <div className="ds-read">
          {out ? <>
            {tex(raw`PA=PB=\sqrt{${nt(d)}^{2}-${nt(r)}^{2}}=${nt(l)}`)}
            <span className="ds-ok">2 garis singgung, sama panjang</span>
          </> : on ? <span className="ds-bad">P pada lingkaran: tepat 1 garis singgung (panjangnya 0).</span>
            : <span className="ds-bad">P di dalam lingkaran: tidak ada garis singgung.</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 15 · Garis singgung persekutuan (papan bersama) ═════════ */
type TP = { R: number; r: number; d: number; ext: boolean; int: boolean; up: boolean; aux: number };
const buildTan: Build<TP> = (b, g) => {
  const Bc = (): Vec => [g().d, 0];
  circ(b, () => O, () => g().R, () => 0, () => 360, C.blue, 3);
  circ(b, Bc, () => g().r, () => 0, () => 360, C.orange, 3);
  dot(b, () => O, C.blue, 5, "A");
  dot(b, Bc, C.orange, 5, "B");
  const extOk = () => g().ext && g().d > 1e-9 && g().d >= Math.abs(g().R - g().r) - 1e-9;
  const intOk = () => g().int && g().d > 1e-9 && g().d >= g().R + g().r - 1e-9;
  const tp = (kind: "e" | "i", s: number): [Vec, Vec] => {
    const { R, r, d } = g();
    const c = Math.max(-1, Math.min(1, (kind === "e" ? R - r : R + r) / d)), sn = s * Math.sqrt(1 - c * c);
    return kind === "e"
      ? [[R * c, R * sn], [d + r * c, r * sn]]
      : [[R * c, R * sn], [d - r * c, -r * sn]];
  };
  [1, -1].forEach((s) => {
    const showS = () => s === 1 || !g().up;
    sg(b, () => extOk() && showS(), () => tp("e", s)[0], () => tp("e", s)[1], C.teal, 3.25);
    sg(b, () => intOk() && showS(), () => tp("i", s)[0], () => tp("i", s)[1], C.violet, 3.25);
    [0, 1].forEach((e) => {
      pt(b, () => extOk() && showS(), () => tp("e", s)[e], C.teal, 4);
      pt(b, () => intOk() && showS(), () => tp("i", s)[e], C.violet, 4);
    });
  });
  const x0 = () => (g().R >= g().r ? g().R : -g().R);
  ln(b, () => (extOk() && Math.abs(g().d - Math.abs(g().R - g().r)) < 1e-9 ? [1, 0, x0()] : null), C.teal, 2.25);
  ln(b, () => (intOk() && Math.abs(g().d - g().R - g().r) < 1e-9 ? [1, 0, g().R] : null), C.violet, 2.25);

  /* Bantuan penurunan rumus (hanya garis singgung sebelah atas) */
  const kind = (): "e" | "i" => (g().ext ? "e" : "i");
  const up = (): [Vec, Vec] => tp(kind(), 1);
  const A1 = () => g().aux >= 1, A2 = () => g().aux >= 2;
  sg(b, A1, () => O, () => up()[0], C.ink, 2, 2);
  sg(b, A1, Bc, () => up()[1], C.ink, 2, 2);
  rightMark(b, () => (A1() ? up()[0] : OFF), () => O, () => up()[1], 0.5, C.green);
  rightMark(b, () => (A1() ? up()[1] : OFF), Bc, () => up()[0], 0.5, C.green);
  const leg = () => (g().ext ? g().R - g().r : g().R + g().r);
  const S = (): Vec => { const T1 = up()[0], k = leg() / g().R; return [T1[0] * k, T1[1] * k]; };
  fill(b, () => (A2() ? [O, S(), Bc()] : null), C.orange, 0.2);
  sg(b, A2, () => O, S, C.blue, 3);
  sg(b, A2, S, Bc, C.red, 3);
  sg(b, A2, () => O, Bc, C.ink, 2.5, 2);
  rightMark(b, () => (A2() ? S() : OFF), () => O, Bc, 0.5, C.green);
  pt(b, A2, S, C.ink, 5, "S");
  note(b, () => (A2() ? [mid(O, S())[0] - 3.6, mid(O, S())[1] + 0.2] : OFF), () => `${g().ext ? "R − r" : "R + r"} = ${n(leg())}`, C.blue);
  note(b, () => (A2() ? [mid(S(), Bc())[0] + 0.3, mid(S(), Bc())[1] + 0.3] : OFF), () => `l = ${n(Math.sqrt(Math.max(0, g().d ** 2 - leg() ** 2)))}`, C.red);
  note(b, () => (A2() ? [g().d / 2 - 0.8, -1.3] : OFF), () => `d = ${n(g().d)}`, C.ink);
};
const BTC: BBox = [-4, 5, 14, -5];
function TanCommonSlide() {
  const [R, setR] = useState(3), [r, setRr] = useState(1.5), [d, setD] = useState(8), [mode, setMode] = useState(2);
  const df = Math.abs(R - r), sm = R + r;
  const luar = d > df + 1e-9 ? Math.sqrt(d * d - df * df) : null;
  const dalam = d > sm + 1e-9 ? Math.sqrt(d * d - sm * sm) : null;
  const info =
    d > sm + 1e-9 ? "4 garis singgung (2 luar, 2 dalam): lingkaran saling lepas"
      : Math.abs(d - sm) < 1e-9 ? "3 garis singgung (2 luar, 1 dalam): bersinggungan di luar"
        : d > df + 1e-9 ? "2 garis singgung (keduanya luar): lingkaran berpotongan"
          : d > 1e-9 && Math.abs(d - df) < 1e-9 ? "1 garis singgung: bersinggungan di dalam"
            : "0 garis singgung: lingkaran yang satu di dalam yang lain";
  return (
    <Frame
      eyebrow="05 · Singgung persekutuan"
      title="Persekutuan luar dan dalam"
      copy={<>
        <p>Garis yang menyinggung <b>dua lingkaran sekaligus</b> disebut garis singgung persekutuan.</p>
        <p className="fragment"><b style={{ color: C.teal }}>Persekutuan luar</b>: kedua lingkaran berada pada <b>satu sisi</b> garis.</p>
        <p className="fragment"><b style={{ color: C.violet }}>Persekutuan dalam</b>: garis <b>memotong</b> ruas AB, lingkaran berada di sisi berlawanan.</p>
        <p className="fragment">Banyak garis ditentukan oleh jarak pusat {tex("d")} terhadap {tex("R+r")} dan {tex("|R-r|")}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BTC} params={{ R, r, d, ext: mode !== 1, int: mode !== 0, up: false, aux: 0 }} build={buildTan} maxH={290} />
        <Chips value={mode} onPick={setMode} items={[{ v: 0, label: "Luar" }, { v: 1, label: "Dalam" }, { v: 2, label: "Keduanya" }]} />
        <div className="ds-controls">
          <Range label={tex("R")} value={R} min={1} max={3} step={0.5} onChange={setR} color={C.blue} shown={n(R)} />
          <Range label={tex("r")} value={r} min={0.5} max={3} step={0.5} onChange={setRr} color={C.orange} shown={n(r)} />
          <Range label={tex(raw`d=AB`)} value={d} min={0} max={10} step={0.5} onChange={setD} color={C.ink} shown={n(d)} />
        </div>
        <div className="ds-read">
          {info}<br />
          <span style={{ color: C.teal }}>panjang luar = {luar === null ? "—" : n(luar)}</span> · <span style={{ color: C.violet }}>panjang dalam = {dalam === null ? (Math.abs(d - sm) < 1e-9 ? "0" : "—") : n(dalam)}</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 16 · Penurunan rumus panjang singgung persekutuan ═════════ */
const BTD: BBox = [-9, 8, 17, -8];
function TanDeriveSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [mode, setMode] = useState(0);
  const P = mode === 0 ? { R: 7, r: 2, d: 13 } : { R: 3, r: 2, d: 13 };
  const leg = mode === 0 ? P.R - P.r : P.R + P.r;
  return (
    <Frame
      innerRef={ref}
      eyebrow="05 · Singgung persekutuan"
      title="Dari mana rumus panjangnya?"
      copy={<>
        <p>Pilih jenis garis singgung, lalu tekan → untuk membangun segitiga siku-siku.</p>
        <p className="fragment">Jari-jari ke titik singgung <b>tegak lurus</b> garis singgung, sehingga AT₁ ∥ BT₂.</p>
        <p className="fragment">Dari B tarik garis <b>sejajar</b> garis singgung sampai memotong perpanjangan AT₁ di S. Terbentuk segitiga siku-siku ASB.</p>
        <p className="fragment">{mode === 0
          ? tex(raw`l^{2}=d^{2}-(R-r)^{2}`)
          : tex(raw`l^{2}=d^{2}-(R+r)^{2}`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BTD} params={{ ...P, ext: mode === 0, int: mode === 1, up: true, aux: Math.min(step, 2) }} build={buildTan} maxH={300} />
        <Chips value={mode} onPick={setMode} items={[{ v: 0, label: "Persekutuan luar" }, { v: 1, label: "Persekutuan dalam" }]} />
        <div className="ds-read">
          {tex(`R=${P.R},\\ r=${P.r},\\ d=${P.d}`)}
          {step >= 3
            ? <>{tex(`l^{2}=${P.d}^{2}-${leg}^{2}=${P.d * P.d - leg * leg}\\ \\Rightarrow\\ l=${Math.sqrt(P.d * P.d - leg * leg)}`)}</>
            : "Tekan → sampai langkah terakhir."}
        </div>
      </>}
    />
  );
}

/* ═════════ Segitiga: perkakas bersama ═════════ */
type Tri = { A: Vec; B: Vec; C: Vec; a: number; b: number; c: number; s: number; L: number; I: Vec; r: number; O: Vec; R: number };
const tri = (A: Vec, B: Vec, Cc: Vec): Tri => {
  const a = dist(B, Cc), b = dist(Cc, A), c = dist(A, B), p = a + b + c, s = p / 2;
  const L = Math.abs((B[0] - A[0]) * (Cc[1] - A[1]) - (Cc[0] - A[0]) * (B[1] - A[1])) / 2;
  const I: Vec = [(a * A[0] + b * B[0] + c * Cc[0]) / p, (a * A[1] + b * B[1] + c * Cc[1]) / p];
  const sol = solve([[B[0] - A[0], B[1] - A[1], (sq(B) - sq(A)) / 2], [Cc[0] - A[0], Cc[1] - A[1], (sq(Cc) - sq(A)) / 2]]);
  const Oc: Vec = sol.kind === "satu" ? [sol.x, sol.y] : A;
  return { A, B, C: Cc, a, b, c, s, L, I, r: L / s, O: Oc, R: (a * b * c) / (4 * L) };
};
const foot = (P: Vec, Q: Vec, X: Vec): Vec => {
  const k = ((X[0] - P[0]) * (Q[0] - P[0]) + (X[1] - P[1]) * (Q[1] - P[1])) / sq([Q[0] - P[0], Q[1] - P[1]]);
  return [P[0] + k * (Q[0] - P[0]), P[1] + k * (Q[1] - P[1])];
};
const A0: Vec = [-3, -2], B0: Vec = [3, -2];
const TRI_PRE = [{ t: "Lancip", cx: 1, cy: 3.5 }, { t: "Siku-siku", cx: 0, cy: 1 }, { t: "Tumpul", cx: 0, cy: 0 }];
type TriP = { cx: number; cy: number; step: number };
const triShape = (b: B, T: () => Tri) =>
  shape(b, () => { const t = T(); return [t.A, t.B, t.C]; }, { strokeColor: C.ink, strokeWidth: 3, fillColor: C.ink, fillOpacity: 0.05 });
const triDots = (b: B, T: () => Tri) => {
  dot(b, () => T().A, C.ink, 5, "A");
  dot(b, () => T().B, C.ink, 5, "B");
  dot(b, () => T().C, C.ink, 5, "C");
};
function TriControls(p: { cx: number; cy: number; set: (cx: number, cy: number) => void }) {
  const cur = TRI_PRE.findIndex((x) => x.cx === p.cx && x.cy === p.cy);
  return (
    <>
      <Chips value={cur} onPick={(i) => p.set(TRI_PRE[i].cx, TRI_PRE[i].cy)} items={TRI_PRE.map((x, i) => ({ v: i, label: x.t }))} />
      <div className="ds-controls">
        <Range label={tex(raw`x_C`)} value={p.cx} min={-4} max={4} step={0.5} onChange={(v) => p.set(v, p.cy)} color={C.ink} shown={n(p.cx)} />
        <Range label={tex(raw`y_C`)} value={p.cy} min={0} max={4.5} step={0.5} onChange={(v) => p.set(p.cx, v)} color={C.ink} shown={n(p.cy)} />
      </div>
    </>
  );
}

/* ═════════ 17 · Lingkaran luar segitiga ═════════ */
const BTR: BBox = [-7.5, 7.5, 7.5, -7.5];
const buildCircum: Build<TriP> = (b, g) => {
  const T = () => tri(A0, B0, [g().cx, g().cy]);
  triShape(b, T);
  const sides: [() => Vec, () => Vec, string][] = [
    [() => T().A, () => T().B, C.blue], [() => T().B, () => T().C, C.orange], [() => T().C, () => T().A, C.violet],
  ];
  sides.forEach(([p, q, col], i) => {
    ln(b, () => (g().step > i ? [q()[0] - p()[0], q()[1] - p()[1], (sq(q()) - sq(p())) / 2] : null), col, 2, 3);
    pt(b, () => g().step > i, () => mid(p(), q()), col, 4);
  });
  shape(b, () => (g().step >= 4 ? arcPts(T().O, T().R, 0, 360, 120) : null), { strokeColor: C.teal, strokeWidth: 3, fillColor: C.teal, fillOpacity: 0.05 });
  [() => T().A, () => T().B, () => T().C].forEach((v) => sg(b, () => g().step >= 4, () => T().O, v, C.teal, 1.5, 2));
  pt(b, () => g().step >= 3, () => T().O, C.red, 6, "O");
  triDots(b, T);
};
function CircumSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [cx, setCx] = useState(1), [cy, setCy] = useState(3.5);
  const t = tri(A0, B0, [cx, cy]);
  const m = Math.max(t.a, t.b, t.c) ** 2, o = t.a ** 2 + t.b ** 2 + t.c ** 2 - m;
  const kind = Math.abs(m - o) < 1e-9 ? "siku-siku" : m > o ? "tumpul" : "lancip";
  const where = kind === "siku-siku" ? "di tengah sisi miring" : kind === "tumpul" ? "di luar segitiga" : "di dalam segitiga";
  return (
    <Frame
      innerRef={ref}
      eyebrow="06 · Lingkaran luar segitiga"
      title="Lingkaran melalui tiga titik sudut"
      copy={<>
        <p>Cari titik yang <b>berjarak sama</b> dari A, B, dan C. Titik itu menjadi pusat lingkaran luar.</p>
        <p className="fragment">Titik berjarak sama dari A dan B berada di <b>sumbu AB</b> (tegak lurus dan membagi dua).</p>
        <p className="fragment">Sumbu BC juga. Perpotongannya sudah menentukan satu titik.</p>
        <p className="fragment">Sumbu CA ternyata <b>lewat titik yang sama</b>: itulah pusat O.</p>
        <p className="fragment">Lingkaran berpusat di O melalui A, B, C adalah <b>lingkaran luar</b>, jari-jarinya R = OA = OB = OC.</p>
        <p className="fragment">{tex(raw`R=\dfrac{abc}{4L}`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BTR} params={{ cx, cy, step }} build={buildCircum} maxH={320} />
        <TriControls cx={cx} cy={cy} set={(x, y) => { setCx(x); setCy(y); }} />
        <div className="ds-read">
          segitiga {kind}: pusat O {where}<br />
          {step >= 4 ? <>R = OA = {n(dist(t.O, t.A))} · abc/4L = {n(t.R)}</> : "Tekan → untuk menggambar sumbu sisi."}
        </div>
      </>}
    />
  );
}

/* ═════════ 18 · Lingkaran dalam segitiga ═════════ */
const BIN: BBox = [-5.5, 6, 5.5, -3.5];
const buildIn: Build<TriP> = (b, g) => {
  const T = () => tri(A0, B0, [g().cx, g().cy]);
  triShape(b, T);
  const Fd: (() => Vec)[] = [
    () => { const t = T(); return [(t.b * t.B[0] + t.c * t.C[0]) / (t.b + t.c), (t.b * t.B[1] + t.c * t.C[1]) / (t.b + t.c)]; },
    () => { const t = T(); return [(t.c * t.C[0] + t.a * t.A[0]) / (t.a + t.c), (t.c * t.C[1] + t.a * t.A[1]) / (t.a + t.c)]; },
    () => { const t = T(); return [(t.a * t.A[0] + t.b * t.B[0]) / (t.a + t.b), (t.a * t.A[1] + t.b * t.B[1]) / (t.a + t.b)]; },
  ];
  const V = [() => T().A, () => T().B, () => T().C], col = [C.blue, C.orange, C.violet];
  [0, 1, 2].forEach((i) => sg(b, () => g().step > i, V[i], Fd[i], col[i], 2.25, 3));
  shape(b, () => (g().step >= 4 ? arcPts(T().I, T().r, 0, 360, 120) : null), { strokeColor: C.teal, strokeWidth: 3, fillColor: C.teal, fillOpacity: 0.12 });
  const TP2: (() => Vec)[] = [
    () => { const t = T(); return foot(t.A, t.B, t.I); }, () => { const t = T(); return foot(t.B, t.C, t.I); }, () => { const t = T(); return foot(t.C, t.A, t.I); },
  ];
  TP2.forEach((f) => {
    sg(b, () => g().step >= 4, () => T().I, f, C.teal, 1.75, 2);
    pt(b, () => g().step >= 4, f, C.teal, 4);
  });
  pt(b, () => g().step >= 3, () => T().I, C.red, 6, "I");
  triDots(b, T);
};
function IncircleSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [cx, setCx] = useState(1), [cy, setCy] = useState(3.5);
  const t = tri(A0, B0, [cx, cy]);
  return (
    <Frame
      innerRef={ref}
      eyebrow="06 · Lingkaran dalam segitiga"
      title="Lingkaran yang menyinggung ketiga sisi"
      copy={<>
        <p>Titik yang berjarak sama dari <b>dua sisi</b> berada pada <b>garis bagi sudut</b>.</p>
        <p className="fragment">Garis bagi sudut A.</p>
        <p className="fragment">Garis bagi sudut B.</p>
        <p className="fragment">Garis bagi sudut C. Ketiganya bertemu di titik I, <b>selalu di dalam segitiga</b>.</p>
        <p className="fragment">Lingkaran berpusat di I yang menyinggung ketiga sisi adalah <b>lingkaran dalam</b>. Jari-jarinya tegak lurus sisi di titik singgung.</p>
        <p className="fragment">{tex(raw`r=\dfrac{L}{s},\quad s=\tfrac12(a+b+c)`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BIN} params={{ cx, cy, step }} build={buildIn} maxH={320} />
        <TriControls cx={cx} cy={cy} set={(x, y) => { setCx(x); setCy(y); }} />
        <div className="ds-read">
          {step >= 4
            ? <>a = {n(t.a)}, b = {n(t.b)}, c = {n(t.c)} · s = {n(t.s)} · L = {n(t.L)}<br />r = L/s = {n(t.L)} ÷ {n(t.s)} = <b>{n(t.r)}</b></>
            : "Tekan → untuk menambah garis bagi sudut."}
        </div>
      </>}
    />
  );
}

/* ═════════ 19 · Mengapa r = L/s ═════════ */
const buildWhy: Build<TriP> = (b, g) => {
  const T = () => tri(A0, B0, [g().cx, g().cy]);
  const cols = [C.blue, C.orange, C.violet];
  const parts: [() => Vec, () => Vec][] = [[() => T().A, () => T().B], [() => T().B, () => T().C], [() => T().C, () => T().A]];
  parts.forEach(([p, q], i) => fill(b, () => (g().step > i ? [T().I, p(), q()] : null), cols[i], 0.3));
  triShape(b, T);
  shape(b, () => arcPts(T().I, T().r, 0, 360, 120), { strokeColor: C.teal, strokeWidth: 2, fillOpacity: 0 });
  parts.forEach(([p, q]) => {
    const f = () => foot(p(), q(), T().I);
    sg(b, () => g().step >= 1, () => T().I, f, C.teal, 2);
    sg(b, () => g().step >= 1, () => T().I, p, C.soft, 1.25, 2);
  });
  pt(b, () => g().step >= 1, () => T().I, C.red, 6, "I");
  triDots(b, T);
};
function WhySlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [cx, setCx] = useState(1), [cy, setCy] = useState(3.5);
  const t = tri(A0, B0, [cx, cy]);
  const L1 = 0.5 * t.c * t.r, L2 = 0.5 * t.a * t.r, L3 = 0.5 * t.b * t.r;
  const sum = (step >= 1 ? L1 : 0) + (step >= 2 ? L2 : 0) + (step >= 3 ? L3 : 0);
  return (
    <Frame
      innerRef={ref}
      eyebrow="06 · Lingkaran dalam segitiga"
      title="Mengapa r = L ÷ s?"
      copy={<>
        <p>Hubungkan pusat I dengan A, B, C. Segitiga ABC terbagi menjadi tiga segitiga kecil. <b>Tinggi tiap segitiga kecil adalah r.</b></p>
        <p className="fragment" style={{ borderLeftColor: C.blue }}>{tex(raw`L_{ABI}=\tfrac12\,c\,r`)}</p>
        <p className="fragment" style={{ borderLeftColor: C.orange }}>{tex(raw`L_{BCI}=\tfrac12\,a\,r`)}</p>
        <p className="fragment" style={{ borderLeftColor: C.violet }}>{tex(raw`L_{CAI}=\tfrac12\,b\,r`)}</p>
        <p className="fragment">{tex(raw`L=\tfrac12 r(a+b+c)=r\cdot s\ \Rightarrow\ r=\dfrac{L}{s}`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BIN} params={{ cx, cy, step }} build={buildWhy} maxH={320} />
        <TriControls cx={cx} cy={cy} set={(x, y) => { setCx(x); setCy(y); }} />
        <div className="ds-read">
          jumlah luas bagian = {n(sum)}{step >= 3 && <> = L = {n(t.L)} <span className="ds-ok">✓</span></>}<br />
          r = {n(t.r)}
        </div>
      </>}
    />
  );
}

/* ═════════ 20 · Membandingkan lingkaran luar dan dalam ═════════ */
const COMP = [
  { t: "Sama sisi", A: [-3, -2] as Vec, B: [3, -2] as Vec, C: [0, 3 * Math.sqrt(3) - 2] as Vec, note: "R = 2r. Pusat luar dan dalam berimpit di titik berat." },
  { t: "Siku-siku 3-4-5", A: [-2, -1.5] as Vec, B: [2, -1.5] as Vec, C: [-2, 1.5] as Vec, note: "Pusat luar di tengah sisi miring, R = ½ × sisi miring = 2,5." },
  { t: "Sama kaki", A: [-2.5, -2] as Vec, B: [2.5, -2] as Vec, C: [0, 4] as Vec, note: "Kedua pusat terletak pada sumbu simetri." },
  { t: "Sembarang", A: [-3, -2] as Vec, B: [4, -1] as Vec, C: [1, 3.5] as Vec, note: "Pusat luar dan pusat dalam biasanya berbeda titik." },
];
const BCO: BBox = [-6, 6, 6, -6];
const buildComp: Build<{ k: number }> = (b, g) => {
  const T = () => { const p = COMP[g().k]; return tri(p.A, p.B, p.C); };
  triShape(b, T);
  shape(b, () => arcPts(T().O, T().R, 0, 360, 120), { strokeColor: C.blue, strokeWidth: 3, fillOpacity: 0 });
  shape(b, () => arcPts(T().I, T().r, 0, 360, 120), { strokeColor: C.teal, strokeWidth: 3, fillColor: C.teal, fillOpacity: 0.12 });
  sg(b, () => true, () => T().O, () => T().A, C.blue, 1.75, 2);
  sg(b, () => true, () => T().I, () => foot(T().A, T().B, T().I), C.teal, 1.75, 2);
  dot(b, () => T().O, C.blue, 6, "O");
  dot(b, () => T().I, C.teal, 6, "I");
  triDots(b, T);
};
function CompareSlide() {
  const [k, setK] = useState(0);
  const p = COMP[k], t = tri(p.A, p.B, p.C);
  return (
    <Frame
      eyebrow="06 · Luar dan dalam"
      title="Dua lingkaran, satu segitiga"
      copy={<>
        <p>Setiap segitiga punya <b style={{ color: C.blue }}>satu lingkaran luar</b> (melalui titik sudut) dan <b style={{ color: C.teal }}>satu lingkaran dalam</b> (menyinggung sisi).</p>
        <p className="ds-math">{tex(raw`R=\dfrac{abc}{4L}\qquad r=\dfrac{L}{s}`)}</p>
        <p className="ds-muted">Pilih jenis segitiga dan amati perbandingan R dan r.</p>
      </>}
      stage={<>
        <SimBoard bbox={BCO} params={{ k }} build={buildComp} maxH={320} />
        <Chips value={k} onPick={setK} items={COMP.map((x, i) => ({ v: i, label: x.t }))} />
        <div className="ds-read">
          sisi {n(t.a)}, {n(t.b)}, {n(t.c)} · L = {n(t.L)} · s = {n(t.s)}<br />
          <span style={{ color: C.blue }}>R = {n(t.R)}</span> · <span style={{ color: C.teal }}>r = {n(t.r)}</span> · R ÷ r = {n(t.R / t.r)}<br />
          {p.note}
        </div>
      </>}
    />
  );
}

/* ═════════ 21–23 · Rangkuman ═════════ */
function SummarySlide() {
  return (
    <Frame
      eyebrow="Rangkuman"
      title="Rumus yang perlu diingat"
      copy={<>
        <p>Hampir semuanya bersumber dari <b>π</b>, jari-jari, dan perbandingan sudut <b>α/360°</b>.</p>
        <p className="ds-muted">Bila ragu, gambar sketsa lingkarannya.</p>
      </>}
      stage={<Tbl rows={[
        ["Keliling, luas", tex(raw`K=2\pi r,\ L=\pi r^{2}`)],
        ["Nilai π", tex(raw`\tfrac{22}{7}\ \text{atau}\ 3{,}14`)],
        ["Sudut", tex(raw`\angle\text{pusat}=2\times\angle\text{keliling}`)],
        ["Busur, juring", tex(raw`\tfrac{\alpha}{360^\circ}\times2\pi r,\ \tfrac{\alpha}{360^\circ}\times\pi r^{2}`)],
        ["Tembereng", tex(raw`L_{juring}-L_{\triangle}`)],
        ["Singgung dari titik luar", tex(raw`\sqrt{d^{2}-r^{2}}`)],
        ["Persekutuan luar", tex(raw`\sqrt{d^{2}-(R-r)^{2}}`)],
        ["Persekutuan dalam", tex(raw`\sqrt{d^{2}-(R+r)^{2}}`)],
        ["Lingkaran luar", tex(raw`R=\tfrac{abc}{4L}`)],
        ["Lingkaran dalam", tex(raw`r=\tfrac{L}{s}`)],
      ]} />}
    />
  );
}
function MistakesSlide() {
  return (
    <Frame
      eyebrow="Rangkuman"
      title="Kesalahan yang sering terjadi"
      copy={<p>Kenali jebakannya sebelum latihan. Banyak nilai hilang karena satu langkah kecil.</p>}
      stage={<Tbl head={["Keliru", "Yang benar"]} rows={[
        [<>memakai d pada {tex(raw`\pi r^{2}`)}</>, <>r = ½d, lalu kuadratkan r</>],
        ["satuan luas ditulis cm", "keliling cm, luas cm²"],
        ["sudut keliling = sudut pusat", "sudut keliling = ½ sudut pusat"],
        [<>busur memakai {tex(raw`\pi r^{2}`)}</>, <>busur memakai {tex(raw`2\pi r`)}, juring memakai {tex(raw`\pi r^{2}`)}</>],
        [<>singgung dalam memakai {tex("R-r")}</>, <>singgung dalam memakai {tex("R+r")}</>],
        ["22/7 dipakai saat r bukan kelipatan 7", "pakai 3,14"],
        ["pusat lingkaran luar selalu di dalam", "segitiga tumpul: di luar"],
      ]} />}
    />
  );
}

/* ═════════ 25 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Satu bentuk, banyak hubungan"
      copy={<>
        <p>Semua ukuran lingkaran bertumpu pada <b>jari-jari</b> dan bilangan <b>π</b>.</p>
        <p className="fragment">Sudut pusat dan perbandingan <b>α/360°</b> menghubungkan busur dan juring dengan seluruh lingkaran.</p>
        <p className="fragment">Garis singgung selalu <b>tegak lurus jari-jari</b>, sehingga Pythagoras memberi panjangnya.</p>
        <p className="fragment">Kini rumus-rumus itu adalah sesuatu yang pernah Anda <b>gerakkan sendiri</b>.</p>
      </>}
      stage={<div className="ds-read ds-math" style={{ maxWidth: 560, display: "grid", gap: 18 }}>
        {tex(raw`K=2\pi r,\qquad L=\pi r^{2}`)}
        {tex(raw`\angle\text{pusat}=2\times\angle\text{keliling}`)}
        {tex(raw`\text{busur}=\dfrac{\alpha}{360^\circ}\times2\pi r`)}
        {tex(raw`l=\sqrt{d^{2}-r^{2}}`)}
      </div>}
    />
  );
}

export function LingkaranDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <MapSlide />
      <ElementsSlide />
      <ChordSlide />
      <PiRollSlide />
      <PolySlide />
      <CalcSlide />
      <AreaSlide />
      <WheelSlide />
      <CentralSlide />
      <ThalesSlide />
      <SectorSlide />
      <SegmentSlide />
      <TanPropSlide />
      <TanOutSlide />
      <TanCommonSlide />
      <TanDeriveSlide />
      <CircumSlide />
      <IncircleSlide />
      <WhySlide />
      <CompareSlide />
      <SummarySlide />
      <MistakesSlide />
      <Quiz eyebrow="Latihan · Kuis" title="Kuis 14 soal" items={QUIZ} />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default LingkaranDeck;
