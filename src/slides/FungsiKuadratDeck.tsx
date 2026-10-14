/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Btn, C, Chips, dot, fmt, Frame, mk, note, OFF, Range, seg, SimBoard, SlideDeck, still, useStep,
  type BBox, type Build, type Vec,
} from "./core";
import { ln, n, Quiz, tex } from "./LinearKit";
import { QUIZ } from "./quizzes/FungsiKuadratQuiz";

/* Slide "Fungsi kuadrat": bentuk umum → grafik → akar → diskriminan → puncak → menyusun fungsi
   → jumlah/hasil kali akar → garis & parabola → aplikasi → latihan berbasis simulasi → kuis. */

const raw = String.raw;

/* ───────── Matematika parabola ───────── */
type Q = [number, number, number]; // f(x) = ax² + bx + c
const F = (q: Q, x: number) => (q[0] * x + q[1]) * x + q[2];
const disc = (q: Q) => q[1] * q[1] - 4 * q[0] * q[2];
const lin0 = (q: Q) => Math.abs(q[0]) < 1e-9;
const vtx = (q: Q): Vec => { const x = -q[1] / (2 * q[0]); return [x, F(q, x)]; };
const roots = (q: Q): number[] => {
  const D = disc(q);
  if (lin0(q) || D < -1e-9) return [];
  if (D < 1e-9) return [-q[1] / (2 * q[0])];
  const s = Math.sqrt(D);
  return [(-q[1] - s) / (2 * q[0]), (-q[1] + s) / (2 * q[0])];
};
const tone = (D: number) => (D > 1e-9 ? C.teal : Math.abs(D) <= 1e-9 ? C.orange : C.red);

/** Angka untuk TeX: minus biasa, koma desimal dilindungi. */
const nt = (v: number) => n(v).replace("−", "-").replace(",", "{,}");
const t1 = (k: number, v: string, first: boolean) => {
  if (Math.abs(k) < 1e-9) return "";
  const m = Math.abs(k);
  return `${k < 0 ? "-" : first ? "" : "+"}${m === 1 && v ? "" : nt(m)}${v}`;
};
const poly = (a: number, b: number, c: number) =>
  t1(a, "x^2", true) + t1(b, "x", a === 0) + t1(c, "", a === 0 && b === 0) || "0";
const fac = (r: number) => (r === 0 ? "x" : r > 0 ? `(x-${r})` : `(x+${-r})`);

/* ───────── Penggambar parabola serbaguna ───────── */
type Fl = { curve: boolean; roots: boolean; vertex: boolean; axis: boolean; yint: boolean; npts: number };
type PP = Partial<Fl> & {
  q: Q; ref?: Q | null; ghost?: Q | null; pts?: Vec[]; line?: [number, number] | null; // garis y = mx + k
};
const buildPara: Build<PP> = (b, g) => {
  const u = () => { const bb = b.getBoundingBox(); return (bb[2] - bb[0]) / 40; };
  const fn = (get: () => Q | null | undefined, color: string, w: number, dash = 0) =>
    mk(b, "functiongraph", [(x: number) => { const t = get(); return t ? F(t, x) : NaN; }], { ...still, strokeColor: color, strokeWidth: w, dash });
  fn(() => g().ghost, C.violet, 2.5, 3);
  fn(() => g().ref, C.soft, 2, 3);
  ln(b, () => { const q = g().q; return g().axis && !lin0(q) ? [1, 0, vtx(q)[0]] : null; }, C.red, 1.75, 3);
  fn(() => (g().curve === false ? null : g().q), C.ink, 3);
  ln(b, () => { const l = g().line; return l ? [l[0], -1, -l[1]] : null; }, C.orange, 2.75);
  [0, 1].forEach((i) => dot(b, () => {
    const l = g().line, q = g().q;
    if (!l || lin0(q)) return OFF;
    const r = roots([q[0], q[1] - l[0], q[2] - l[1]])[i];
    return r === undefined ? OFF : [r, F(q, r)];
  }, C.red, 6));
  const R = (i: number) => (g().roots ? roots(g().q)[i] : undefined);
  [0, 1].forEach((i) => {
    dot(b, () => { const r = R(i); return r === undefined ? OFF : [r, 0]; }, C.orange, 6);
    note(b, () => { const r = R(i); return r === undefined ? OFF : [r + 0.5 * u(), -3 * u()]; }, () => `(${n(R(i) ?? 0)}, 0)`, C.orange);
  });
  const V = (): Vec | null => (g().vertex && !lin0(g().q) ? vtx(g().q) : null);
  dot(b, () => V() ?? OFF, C.teal, 6);
  note(b, () => { const v = V(); return v ? [v[0] + u(), v[1] + (g().q[0] > 0 ? -2.8 : 1.4) * u()] : OFF; },
    () => { const v = V(); return v ? `(${n(v[0])}, ${n(v[1])})` : ""; }, C.teal);
  dot(b, () => (g().yint ? [0, g().q[2]] : OFF), C.violet, 6);
  note(b, () => (g().yint ? [1.2 * u(), g().q[2] + 1.2 * u()] : OFF), () => `(0, ${n(g().q[2])})`, C.violet);
  for (let i = 0; i < 6; i++) dot(b, () => { const p = g().pts?.[i]; return p && i < (g().npts ?? 99) ? p : OFF; }, C.red, 6);
};

/** Slide contoh: tiap fragmen (→) menambah satu langkah dan satu unsur pada grafik. */
type Line = { t: ReactNode; on?: Partial<Fl> };
function Ex(p: {
  eyebrow: string; title: string; intro?: ReactNode; lines: Line[]; q: Q; bbox: BBox;
  base?: Partial<Fl>; pts?: Vec[]; note?: ReactNode; maxH?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const k = Math.min(useStep(ref), p.lines.length);
  const fl = p.lines.slice(0, k).reduce<Partial<Fl>>((a, l) => ({ ...a, ...l.on }), p.base ?? {});
  return (
    <Frame
      innerRef={ref} eyebrow={p.eyebrow} title={p.title}
      copy={<>{p.intro}{p.lines.map((l, i) => <p className="fragment" key={i}>{l.t}</p>)}</>}
      stage={<>
        <SimBoard bbox={p.bbox} params={{ q: p.q, pts: p.pts, ...fl }} build={buildPara} maxH={p.maxH ?? 470} />
        {p.note && <div className="ds-read">{p.note}</div>}
      </>}
    />
  );
}

/** Slide laboratorium: slider mengubah parabola; ringkasan angka di bawah papan. */
type Sl = { label: ReactNode; min: number; max: number; step: number; color?: string };
function Lab(p: {
  eyebrow: string; title: string; copy: ReactNode; init: number[]; sl: Sl[]; bbox: BBox;
  toQ?: (s: number[]) => Q; flags?: Partial<Fl>; extra?: (s: number[], q: Q) => Partial<PP>;
  read: (s: number[], q: Q) => ReactNode; maxH?: number;
}) {
  const [s, setS] = useState(p.init);
  const q = p.toQ ? p.toQ(s) : (s as Q);
  const set = (i: number, v: number) => setS((a) => a.map((x, j) => (j === i ? v : x)));
  return (
    <Frame
      eyebrow={p.eyebrow} title={p.title} copy={p.copy}
      stage={<>
        <SimBoard bbox={p.bbox} params={{ q, ...p.flags, ...p.extra?.(s, q) }} build={buildPara} maxH={p.maxH ?? 380} />
        <div className={`ds-controls${p.sl.length === 1 ? " ds-controls--one" : ""}`}>
          {p.sl.map((c, i) => (
            <Range key={i} label={c.label} value={s[i]} min={c.min} max={c.max} step={c.step} color={c.color} shown={n(s[i])} onChange={(v) => set(i, v)} />
          ))}
        </div>
        <div className="ds-read">{p.read(s, q)}</div>
      </>}
    />
  );
}

const Tbl = (p: { head?: ReactNode[]; rows: ReactNode[][] }) => (
  <table className="ds-table">
    {p.head && <thead><tr>{p.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>}
    <tbody>{p.rows.map((r, i) => <tr key={i}><th>{r[0]}</th>{r.slice(1).map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
  </table>
);

/* ═════════ 0 · Sampul: parabola hidup ═════════ */
const COVER: BBox = [-6, 7, 6, -3];
const buildCover: Build<object> = (b, _g, _s, clock) => {
  const p = () => 2.2 * Math.cos(0.7 * clock());
  const q = () => 1.2 + 1.3 * Math.sin(1.1 * clock());
  const Qd = (): Q => [0.45, -0.9 * p(), 0.45 * p() * p() + q()];
  mk(b, "functiongraph", [(x: number) => F(Qd(), x)], { ...still, strokeColor: C.ink, strokeWidth: 3 });
  ln(b, () => [1, 0, p()], C.red, 1.75, 3);
  dot(b, () => [p(), q()], C.teal, 6);
  dot(b, () => { const x = p() + 3.5 * Math.sin(2 * clock()); return [x, F(Qd(), x)]; }, C.orange, 6);
  note(b, () => [-5.6, 6], () => `puncak (${fmt(p(), 1)}; ${fmt(q(), 1)})`, C.mute);
};
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi · Kelas X"
      title="Fungsi kuadrat"
      copy={<>
        <p>Bola yang ditendang, antena parabola, lengkung jembatan: semuanya berbentuk <b>parabola</b>.</p>
        <p className="ds-muted">Titik tosca adalah puncak, garis merah adalah sumbu simetri, titik oranye meluncur di sepanjang kurva.</p>
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
      title="Empat hal yang selalu dicari"
      copy={<>
        <p>Fungsi kuadrat adalah fungsi dengan <b>pangkat tertinggi dua</b>. Grafiknya parabola.</p>
        <p className="fragment"><b>Arah</b> (tanda a)</p>
        <p className="fragment"><b>Titik potong</b> dengan sumbu</p>
        <p className="fragment"><b>Diskriminan</b> (banyak akar)</p>
        <p className="fragment"><b>Titik puncak</b> (maks/min)</p>
      </>}
      stage={<Tbl rows={[
        ["01", "Bentuk umum dan grafik"], ["02", "Pengaruh a, b, dan c"],
        ["03", "Akar: faktor, kuadrat sempurna, rumus ABC"], ["04", "Diskriminan dan jenis akar"],
        ["05", "Sumbu simetri dan titik puncak"], ["06", "Menggambar grafik"],
        ["07", "Menyusun fungsi kuadrat"], ["08", "Jumlah dan hasil kali akar"],
        ["09", "Garis dan parabola"], ["10", "Aplikasi dan latihan simulasi"],
      ]} />}
    />
  );
}

/* ═════════ 2 · Ingat kembali: linear vs kuadrat ═════════ */
const LQ: BBox = [-4.5, 10, 4.5, -3];
const buildLQ: Build<{ x: number }> = (b, g) => {
  const fs: [(x: number) => number, string][] = [[(x) => x * x, C.ink], [(x) => 2 * x + 1, C.orange]];
  fs.forEach(([f, c]) => {
    mk(b, "functiongraph", [f], { ...still, strokeColor: c, strokeWidth: 2.75 });
    seg(b, () => [g().x - 1, f(g().x - 1)], () => [g().x, f(g().x - 1)], c, 2, 2);
    seg(b, () => [g().x, f(g().x - 1)], () => [g().x, f(g().x)], c, 3.5);
    dot(b, () => [g().x, f(g().x)], c, 6);
  });
};
function LinearVsQuadSlide() {
  const [x, setX] = useState(1);
  return (
    <Frame
      eyebrow="Ingat kembali"
      title="Garis lurus atau lengkung?"
      copy={<>
        <p><b style={{ color: C.orange }}>2x + 1</b> naik <b>tetap 2</b> setiap langkah: grafiknya garis lurus.</p>
        <p><b>x²</b> turun lalu naik dengan perubahan yang <b>tidak tetap</b>: grafiknya melengkung.</p>
        <p className="ds-muted">Geser x. Batang tebal di tiap kurva adalah kenaikan dari x − 1 ke x.</p>
      </>}
      stage={<>
        <SimBoard bbox={LQ} aspect={1.2} params={{ x }} build={buildLQ} maxH={400} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("x")} value={x} min={-3} max={3} step={1} onChange={setX} color={C.ink} shown={n(x)} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.orange }}>2x+1 = {n(2 * x + 1)} · naik {n(2)} (tetap)</span><br />
          <span>x² = {n(x * x)} · naik {n(2 * x - 1)} (berubah-ubah)</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 3 · Bentuk umum ═════════ */
function FormSlide() {
  return (
    <Frame
      eyebrow="01 · Bentuk umum"
      title="f(x) = ax² + bx + c"
      copy={<>
        <p className="ds-math">{tex(raw`f(x)=ax^{2}+bx+c,\quad a\neq 0`)}</p>
        <p><b>a</b>: koefisien x², <b>b</b>: koefisien x, <b>c</b>: suku tetap.</p>
        <p className="fragment">Jika a = 0, suku x² hilang dan fungsinya menjadi <b>linear</b>.</p>
        <p className="ds-muted">Urutkan dari pangkat tertinggi dulu sebelum membaca a, b, c.</p>
      </>}
      stage={<Tbl
        head={["Fungsi", "Kuadrat?", "Keterangan"]}
        rows={[
          [tex("x^2-4"), "Ya", "a = 1, b = 0, c = −4"],
          [tex("3x^2+2x"), "Ya", "a = 3, b = 2, c = 0"],
          [tex("(x-1)(x+2)"), "Ya", <>dijabarkan {tex("x^2+x-2")}</>],
          [tex("3-x-2x^2"), "Ya", "urutkan: a = −2, b = −1, c = 3"],
          [tex("2x+5"), "Bukan", "pangkat tertinggi 1"],
          [tex("x^3+x^2"), "Bukan", "pangkat tertinggi 3"],
        ]}
      />}
    />
  );
}

/* ═════════ 4 · Pengaruh a ═════════ */
const BA: BBox = [-4, 7, 4, -7];
const lab = (v: number) => (Math.abs(v) < 0.05 ? 0 : v);
function EffectASlide() {
  return (
    <Lab
      eyebrow="02 · Pengaruh a" title="Arah dan lebar parabola"
      copy={<>
        <p>Geser <b style={{ color: C.orange }}>a</b>. Kurva abu-abu putus-putus adalah y = x² sebagai pembanding.</p>
        <p><b>Tanda a</b>: a positif membuka ke atas (U), a negatif ke bawah (∩).</p>
        <p><b>Besar |a|</b>: makin besar makin sempit, makin kecil makin lebar.</p>
        <p className="ds-muted">Coba a = 0. Apa yang terjadi?</p>
      </>}
      init={[1]} bbox={BA} sl={[{ label: tex("a"), min: -3, max: 3, step: 0.1, color: C.orange }]}
      toQ={(s) => [lab(s[0]), 0, 0]} flags={{ vertex: true }} extra={() => ({ ref: [1, 0, 0] })}
      read={(s) => {
        const a = lab(s[0]);
        if (a === 0) return <>a = 0 → <b>garis lurus</b>, bukan fungsi kuadrat.</>;
        const w = Math.abs(a) > 1.001 ? "lebih sempit" : Math.abs(a) < 0.999 ? "lebih lebar" : "sama lebar";
        return <><b style={{ color: C.orange }}>a = {n(a)}</b> → terbuka ke {a > 0 ? "atas" : "bawah"}, {w} dari y = x².</>;
      }}
    />
  );
}

/* ═════════ 5 · Pengaruh b dan c ═════════ */
const BBC: BBox = [-7, 7, 7, -8];
function EffectBCSlide() {
  return (
    <Lab
      eyebrow="02 · Pengaruh b dan c" title="Menggeser parabola"
      copy={<>
        <p className="ds-math">{tex(raw`f(x)=x^{2}+bx+c`)}</p>
        <p><b style={{ color: C.violet }}>c</b> = titik potong sumbu y, yaitu (0, c). Mengubah c menggeser grafik naik-turun.</p>
        <p><b style={{ color: C.blue }}>b</b> menggeser <b>sumbu simetri</b>: {tex(raw`x=-\dfrac{b}{2a}`)}.</p>
      </>}
      init={[1, -1]} bbox={BBC}
      sl={[{ label: tex("b"), min: -4, max: 4, step: 1, color: C.blue }, { label: tex("c"), min: -3, max: 3, step: 1, color: C.violet }]}
      toQ={(s) => [1, s[0], s[1]]} flags={{ vertex: true, axis: true, yint: true }} extra={() => ({ ref: [1, 0, 0] })}
      read={(s, q) => {
        const v = vtx(q);
        return <>{tex(`f(x)=${poly(...q)}`)}sumbu simetri x = {n(-s[0] / 2)} · puncak ({n(v[0])}, {n(v[1])})</>;
      }}
    />
  );
}

/* ═════════ 6 · Menggambar dari tabel nilai ═════════ */
const TV: Vec[] = [-2, -1, 0, 1, 2, 3, 4].map((x) => [x, x * x - 2 * x - 3]);
const BTV: BBox = [-4, 7, 6, -6];
function TableSlide() {
  return (
    <Ex
      eyebrow="02 · Tabel nilai" title="Tabel nilai"
      intro={<p>Grafik {tex("f(x)=x^2-2x-3")}. Tekan → untuk menghitung satu titik.</p>}
      q={[1, -2, -3]} bbox={BTV} pts={TV} base={{ curve: false, npts: 0 }}
      lines={[
        ...TV.map(([x, y], i): Line => ({ t: tex(`f(${x})=(${x})^2-2(${x})-3=${y}`), on: { npts: i + 1 } })),
        { t: <>Hubungkan dengan <b>kurva halus</b>.</>, on: { curve: true } },
      ]}
      note="Hasilnya selalu huruf U atau U terbalik: parabola."
    />
  );
}

/* ═════════ 7 · Anatomi parabola ═════════ */
const BAN: BBox = [-4, 5, 6, -6];
function AnatomySlide() {
  return (
    <Ex
      eyebrow="02 · Anatomi" title="Bagian-bagian parabola"
      intro={<p>Pada {tex("f(x)=x^2-2x-3")}:</p>}
      q={[1, -2, -3]} bbox={BAN} base={{ curve: true }}
      lines={[
        { t: <><b>Titik puncak</b>: titik balik, terendah bila a &gt; 0. Di sini {tex("(1,-4)")}.</>, on: { vertex: true } },
        { t: <><b>Sumbu simetri</b>: garis tegak lewat puncak, {tex("x=1")}. Kiri dan kanan saling bercermin.</>, on: { axis: true } },
        { t: <><b>Titik potong sumbu x</b> (akar, f(x) = 0): {tex("(-1,0)")} dan {tex("(3,0)")}.</>, on: { roots: true } },
        { t: <><b>Titik potong sumbu y</b>: selalu (0, c) = {tex("(0,-3)")}.</>, on: { yint: true } },
      ]}
    />
  );
}

/* ═════════ 8 · Akar: pemfaktoran ═════════ */
const BPQ: BBox = [-7, 7, 7, -7];
function FactorSlide() {
  return (
    <Lab
      eyebrow="03 · Akar (1) · Pemfaktoran" title="Jumlah dan hasil kali"
      copy={<>
        <p>Sifat hasil kali nol: jika A·B = 0 maka A = 0 atau B = 0.</p>
        <p>{tex(raw`x^{2}+bx+c=(x-p)(x-q)`)} dengan p + q = −b dan p·q = c.</p>
        <p className="ds-muted">Geser p dan q: titik oranye (akar) selalu ada di x = p dan x = q.</p>
        <p className="fragment">Contoh: {tex(raw`x^2-5x+6=(x-2)(x-3)=0`)} → x = 2 atau 3.</p>
      </>}
      init={[2, 3]} bbox={BPQ}
      sl={[{ label: tex("p"), min: -5, max: 5, step: 1, color: C.blue }, { label: tex("q"), min: -5, max: 5, step: 1, color: C.orange }]}
      toQ={(s) => [1, -(s[0] + s[1]), s[0] * s[1]]} flags={{ roots: true }}
      read={(s, q) => <>
        {tex(raw`${s[0] === 0 && s[1] === 0 ? "x^2" : fac(s[0]) + fac(s[1])}=${poly(...q)}`)}
        {tex(raw`p+q=${s[0] + s[1]}=-b,\quad pq=${s[0] * s[1]}=c`)}
      </>}
    />
  );
}

/* ═════════ 9 · Pemfaktoran bila a ≠ 1 ═════════ */
const B2 : BBox = [-5, 5, 5, -6];
function Factor2Slide() {
  return (
    <Ex
      eyebrow="03 · Akar (1) · Contoh" title="Pemfaktoran, a ≠ 1"
      intro={<p>Selesaikan {tex("2x^2+x-3=0")}.</p>}
      q={[2, 1, -3]} bbox={B2}
      lines={[
        { t: <>{tex(raw`a\cdot c=-6`)}. Cari dua bilangan berjumlah {tex("b=1")}: {tex("3")} dan {tex("-2")}.</> },
        { t: tex(raw`2x^2+3x-2x-3`) },
        { t: tex(raw`x(2x+3)-(2x+3)=(2x+3)(x-1)=0`) },
        { t: tex(raw`x=-\tfrac32\ \text{atau}\ x=1`), on: { roots: true } },
      ]}
    />
  );
}

/* ═════════ 10 · Kuadrat sempurna ═════════ */
const BKS: BBox = [-2, 7, 8, -6];
function CompleteSquareSlide() {
  return (
    <Ex
      eyebrow="03 · Akar (2) · Kuadrat sempurna" title="Melengkapkan kuadrat"
      intro={<p>Selesaikan {tex("x^2-6x+5=0")}. Ide: {tex(raw`x^2+bx=\left(x+\tfrac b2\right)^2-\left(\tfrac b2\right)^2`)}</p>}
      q={[1, -6, 5]} bbox={BKS}
      lines={[
        { t: tex(raw`x^2-6x=-5`) },
        { t: tex(raw`x^2-6x+9=4\ \Rightarrow\ (x-3)^2=4`), on: { vertex: true, axis: true } },
        { t: tex(raw`x-3=\pm 2`) },
        { t: tex(raw`x=5\ \text{atau}\ x=1`), on: { roots: true } },
      ]}
      note={<>Contoh lain: {tex(raw`x^2+4x-1=0\Rightarrow(x+2)^2=5\Rightarrow x=-2\pm\sqrt5`)}</>}
    />
  );
}

/* ═════════ 11 · Rumus ABC ═════════ */
const BABC: BBox = [-4, 5, 5, -8];
function AbcSlide() {
  return (
    <Ex
      eyebrow="03 · Akar (3) · Rumus ABC" title="Rumus kuadrat"
      intro={<><p className="ds-math">{tex(raw`x_{1,2}=\dfrac{-b\pm\sqrt{b^{2}-4ac}}{2a}`)}</p><p>Selesaikan {tex("2x^2-3x-5=0")}.</p></>}
      q={[2, -3, -5]} bbox={BABC}
      lines={[
        { t: tex(raw`a=2,\ b=-3,\ c=-5`) },
        { t: tex(raw`D=b^2-4ac=9+40=49`) },
        { t: tex(raw`x=\dfrac{3\pm7}{4}`) },
        { t: tex(raw`x=\tfrac52\ \text{atau}\ x=-1`), on: { roots: true } },
      ]}
      note="Awas: −b = −(−3) = +3, dan penyebutnya 2a, bukan 2."
    />
  );
}

/* ═════════ 12 · Diskriminan ═════════ */
const BDI: BBox = [-8, 8, 8, -10];
function DiscSlide() {
  return (
    <Lab
      eyebrow="04 · Diskriminan" title="Meramal banyak akar"
      copy={<>
        <p className="ds-math">{tex(raw`D=b^{2}-4ac`)}</p>
        <p><b style={{ color: C.teal }}>D &gt; 0</b>: dua akar real berbeda.</p>
        <p><b style={{ color: C.orange }}>D = 0</b>: akar kembar, parabola menyinggung sumbu x.</p>
        <p><b style={{ color: C.red }}>D &lt; 0</b>: tidak ada akar real.</p>
        <p className="ds-muted">Ubah a, b, c sampai ketiga kasus muncul.</p>
      </>}
      init={[1, -2, -3]} bbox={BDI}
      sl={[
        { label: tex("a"), min: -3, max: 3, step: 1, color: C.blue },
        { label: tex("b"), min: -6, max: 6, step: 1, color: C.orange },
        { label: tex("c"), min: -6, max: 6, step: 1, color: C.violet },
      ]}
      flags={{ roots: true, vertex: true }}
      read={(s, q) => {
        if (lin0(q)) return <>a = 0 → bukan fungsi kuadrat.</>;
        const D = disc(q);
        return <>
          {tex(`D=(${s[1]})^2-4(${s[0]})(${s[2]})=${D}`)}
          <b style={{ color: tone(D) }}>{D > 0 ? "D > 0: dua akar real berbeda" : D === 0 ? "D = 0: akar kembar" : "D < 0: tidak ada akar real"}</b>
        </>;
      }}
    />
  );
}

/* ═════════ 13–14 · Contoh memakai diskriminan ═════════ */
const BK7: BBox = [-4, 8, 8, -5];
function Disc7Slide() {
  return (
    <Lab
      eyebrow="04 · Contoh 7" title="Agar akar kembar"
      copy={<>
        <p>Tentukan k agar {tex("x^2-4x+k=0")} mempunyai <b>akar kembar</b>.</p>
        <p className="fragment">Akar kembar berarti D = 0.</p>
        <p className="fragment">{tex(raw`16-4k=0\ \Rightarrow\ k=4`)}</p>
        <p className="ds-muted">Geser k sampai parabola tepat menyinggung sumbu x.</p>
      </>}
      init={[0]} bbox={BK7} sl={[{ label: tex("k"), min: 0, max: 8, step: 1, color: C.orange }]}
      toQ={(s) => [1, -4, s[0]]} flags={{ roots: true, vertex: true }}
      read={(s, q) => {
        const D = disc(q);
        return <>{tex(`D=16-4(${s[0]})=${D}`)}<b style={{ color: tone(D) }}>{D > 0 ? "dua akar berbeda" : D === 0 ? "✓ akar kembar: k = 4" : "tidak ada akar real"}</b></>;
      }}
    />
  );
}
const BK8: BBox = [-8, 12, 8, -8];
function Disc8Slide() {
  return (
    <Lab
      eyebrow="04 · Contoh 8" title="Agar tanpa akar real"
      copy={<>
        <p>Tentukan k agar {tex("x^2+kx+9=0")} <b>tidak punya akar real</b>.</p>
        <p className="fragment">Syarat D &lt; 0:</p>
        <p className="fragment">{tex(raw`k^2-36<0\ \Rightarrow\ (k-6)(k+6)<0`)}</p>
        <p className="fragment">{tex(raw`-6<k<6`)} (di <b>antara</b> kedua akar).</p>
      </>}
      init={[0]} bbox={BK8} sl={[{ label: tex("k"), min: -8, max: 8, step: 1, color: C.orange }]}
      toQ={(s) => [1, s[0], 9]} flags={{ roots: true, vertex: true }}
      read={(s, q) => {
        const D = disc(q);
        return <>{tex(`D=(${s[0]})^2-36=${D}`)}<b style={{ color: tone(D) }}>{D < 0 ? "✓ tidak ada akar real (−6 < k < 6)" : D === 0 ? "akar kembar (k = ±6)" : "dua akar real"}</b></>;
      }}
    />
  );
}

/* ═════════ 15 · Definit positif / negatif ═════════ */
const BDF: BBox = [-6, 6, 6, -6];
function DefiniteSlide() {
  return (
    <Lab
      eyebrow="04 · Definit" title="Selalu di atas atau di bawah sumbu x"
      copy={<>
        <p><b>Definit positif</b> (f(x) &gt; 0 untuk semua x): a &gt; 0 dan D &lt; 0.</p>
        <p><b>Definit negatif</b> (f(x) &lt; 0 untuk semua x): a &lt; 0 dan D &lt; 0.</p>
        <p className="ds-muted">Fungsi di sini: f(x) = ax² + 2x + c. Temukan a dan c yang membuat kurva tidak menyentuh sumbu x.</p>
      </>}
      init={[1, 2]} bbox={BDF}
      sl={[{ label: tex("a"), min: -3, max: 3, step: 0.5, color: C.blue }, { label: tex("c"), min: -4, max: 4, step: 0.5, color: C.violet }]}
      toQ={(s) => [s[0], 2, s[1]]} flags={{ roots: true }}
      read={(s, q) => {
        if (lin0(q)) return <>a = 0 → bukan fungsi kuadrat.</>;
        const D = disc(q);
        const msg = D < 0 ? (s[0] > 0 ? "definit positif: selalu di atas sumbu x" : "definit negatif: selalu di bawah sumbu x") : "tidak definit: menyentuh atau memotong sumbu x";
        return <>{tex(`D=4-4(${nt(s[0])})(${nt(s[1])})=${nt(D)}`)}<b style={{ color: D < 0 ? C.teal : C.red }}>{msg}</b></>;
      }}
    />
  );
}

/* ═════════ 16 · Sumbu simetri dan titik puncak ═════════ */
const BPU: BBox = [-8, 8, 8, -8];
function VertexSlide() {
  return (
    <Lab
      eyebrow="05 · Titik puncak" title="Sumbu simetri dan puncak"
      copy={<>
        <p className="ds-math">{tex(raw`x_p=-\dfrac{b}{2a},\quad y_p=-\dfrac{D}{4a}`)}</p>
        <p>a &gt; 0: puncak terendah, <b>nilai minimum</b>. a &lt; 0: puncak tertinggi, <b>nilai maksimum</b>.</p>
        <p className="ds-muted">Titik merah ada dua: P dan bayangannya. Keduanya selalu sama tinggi karena kurva simetris. Fungsi: f(x) = ax² + bx + 1.</p>
      </>}
      init={[1, -4, 0.5]} bbox={BPU}
      sl={[
        { label: tex("a"), min: -3, max: 3, step: 0.5, color: C.blue },
        { label: tex("b"), min: -8, max: 8, step: 1, color: C.orange },
        { label: tex(raw`x_P`), min: -3, max: 7, step: 0.25, color: C.red },
      ]}
      toQ={(s) => [s[0], s[1], 1]} flags={{ vertex: true, axis: true }}
      extra={(s, q) => (lin0(q) ? {} : { pts: [[s[2], F(q, s[2])], [2 * vtx(q)[0] - s[2], F(q, s[2])]] })}
      read={(s, q) => {
        if (lin0(q)) return <>a = 0 → bukan fungsi kuadrat.</>;
        const v = vtx(q);
        return <>
          {tex(raw`x_p=-\dfrac{${nt(s[1])}}{2(${nt(s[0])})}=${nt(v[0])},\quad y_p=${nt(v[1])}`)}
          <b>{s[0] > 0 ? "nilai minimum" : "nilai maksimum"} = {n(v[1])}</b> · f({n(s[2])}) = {n(F(q, s[2]))}
        </>;
      }}
    />
  );
}

/* ═════════ 17 · Bentuk puncak ═════════ */
function VertexFormSlide() {
  return (
    <Lab
      eyebrow="05 · Bentuk puncak" title="f(x) = a(x − p)² + q"
      copy={<>
        <p>Puncaknya <b>(p, q)</b>. Kurva abu-abu adalah y = ax² sebelum digeser.</p>
        <p>Tanda p di dalam kurung <b>berlawanan</b>: (x − 3) menggeser <b>ke kanan</b> 3.</p>
        <p className="fragment">Contoh: {tex(raw`x^2-6x+10=(x-3)^2+1`)}, puncak (3, 1).</p>
      </>}
      init={[1, 3, 1]} bbox={BPU}
      sl={[
        { label: tex("a"), min: -3, max: 3, step: 0.5, color: C.blue },
        { label: tex("p"), min: -4, max: 4, step: 1, color: C.orange },
        { label: tex("q"), min: -4, max: 4, step: 1, color: C.violet },
      ]}
      toQ={(s) => [s[0], -2 * s[0] * s[1], s[0] * s[1] * s[1] + s[2]]}
      flags={{ vertex: true, axis: true }} extra={(s) => ({ ref: [s[0], 0, 0] })}
      read={(s, q) => {
        if (lin0(q)) return <>a = 0 → bukan fungsi kuadrat.</>;
        const co = s[0] === 1 ? "" : s[0] === -1 ? "-" : nt(s[0]);
        const inner = s[1] === 0 ? "x" : `(x${s[1] > 0 ? "-" : "+"}${Math.abs(s[1])})`;
        return <>
          {tex(`f(x)=${co}${inner}^2${s[2] === 0 ? "" : (s[2] > 0 ? "+" : "-") + Math.abs(s[2])}`)}
          {tex(`=${poly(...q)}`)}
        </>;
      }}
    />
  );
}

/* ═════════ 18 · Lima langkah menggambar ═════════ */
const BMG: BBox = [-3, 6, 5, -3];
function DrawSlide() {
  return (
    <Ex
      eyebrow="06 · Menggambar" title="Lima langkah menggambar"
      intro={<p>Gambar {tex("f(x)=-x^2+2x+3")}.</p>}
      q={[-1, 2, 3]} bbox={BMG} base={{ curve: false }}
      lines={[
        { t: <><b>1 · Arah</b>: {tex("a=-1")}, terbuka ke <b>bawah</b>.</> },
        { t: <><b>2 · Sumbu y</b>: {tex("(0,3)")}.</>, on: { yint: true } },
        { t: <><b>3 · Sumbu x</b>: {tex(raw`(x-3)(x+1)=0`)} → {tex("(-1,0)")}, {tex("(3,0)")}.</>, on: { roots: true } },
        { t: <><b>4 · Puncak</b>: {tex(raw`x_p=1,\ y_p=4`)}.</>, on: { vertex: true, axis: true } },
        { t: <><b>5 · Hubungkan</b> dengan kurva halus.</>, on: { curve: true } },
      ]}
      note="Tips: titik di satu sisi sumbu simetri punya bayangan setinggi sama di sisi lain."
    />
  );
}

/* ═════════ 19 · Pilih bentuk fungsi ═════════ */
function FormsTableSlide() {
  return (
    <Frame
      eyebrow="07 · Menyusun fungsi" title="Pilih bentuk yang tepat"
      copy={<>
        <p>Lihat dulu <b>apa yang diketahui</b>, lalu pilih bentuk yang paling hemat.</p>
        <p>Masukkan titik tambahan ke bentuk itu untuk mencari <b>a</b>. Jabarkan ke bentuk umum bila diminta.</p>
      </>}
      stage={<Tbl
        head={["Diketahui", "Bentuk"]}
        rows={[
          [<>akar {tex("x_1")}, {tex("x_2")} dan satu titik</>, tex(raw`f(x)=a(x-x_1)(x-x_2)`)],
          [<>puncak {tex("(p,q)")} dan satu titik</>, tex(raw`f(x)=a(x-p)^2+q`)],
          [<>menyinggung sumbu x di {tex("x=p")}</>, tex(raw`f(x)=a(x-p)^2`)],
          ["tiga titik sembarang", <>{tex("f(x)=ax^2+bx+c")} (sistem 3 persamaan)</>],
        ]}
      />}
    />
  );
}

/* ═════════ 20 · Mencari a ═════════ */
const BFA: BBox = [-5, 9, 7, -5];
function FindASlide() {
  const [mode, setMode] = useState(0);
  const [a, setA] = useState(0.5);
  const q: Q = mode === 0 ? [a, -4 * a, 3 * a] : [a, -4 * a, 4 * a - 1];
  const tgt: Vec = mode === 0 ? [0, 6] : [0, 3];
  const ok = Math.abs(F(q, 0) - tgt[1]) < 0.01;
  return (
    <Frame
      eyebrow="07 · Contoh 12 dan 13" title="Mencari a"
      copy={<>
        <p><b>Contoh 12.</b> Memotong sumbu x di 1 dan 3, melalui (0, 6): {tex(raw`f(x)=a(x-1)(x-3)`)}.</p>
        <p><b>Contoh 13.</b> Puncak (2, −1), melalui (0, 3): {tex(raw`f(x)=a(x-2)^2-1`)}.</p>
        <p className="ds-muted">Geser a sampai kurva melewati titik merah. Lalu cocokkan dengan hitungan: f(0) = 3a = 6 dan f(0) = 4a − 1 = 3.</p>
      </>}
      stage={<>
        <SimBoard bbox={BFA} params={{ q, pts: [tgt], roots: mode === 0, vertex: mode === 1 }} build={buildPara} maxH={340} />
        <Chips value={mode} onPick={setMode} items={[{ v: 0, label: "Diketahui akar 1 dan 3" }, { v: 1, label: "Diketahui puncak (2, −1)" }]} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("a")} value={a} min={-3} max={4} step={0.25} onChange={setA} color={C.orange} shown={n(a)} />
        </div>
        <div className="ds-read">
          f(0) = {n(F(q, 0))} · target {n(tgt[1])}{" "}
          {ok ? <span className="ds-ok">✓ tepat! {tex(`f(x)=${poly(...q)}`)}</span> : <span className="ds-bad">belum, ubah a</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 21 · Melalui tiga titik ═════════ */
const B3P: BBox = [-3, 6, 4, -2];
function ThreePointsSlide() {
  return (
    <Ex
      eyebrow="07 · Contoh 14" title="Melalui tiga titik"
      intro={<p>Cari fungsi yang melalui (0, 1), (1, 0), (2, 3). Misal {tex("f(x)=ax^2+bx+c")}.</p>}
      q={[2, -3, 1]} bbox={B3P} pts={[[0, 1], [1, 0], [2, 3]]} base={{ curve: false, npts: 0 }}
      lines={[
        { t: tex(raw`(0,1):\ c=1`), on: { npts: 1 } },
        { t: tex(raw`(1,0):\ a+b=-1`), on: { npts: 2 } },
        { t: tex(raw`(2,3):\ 2a+b=1`), on: { npts: 3 } },
        { t: tex(raw`a=2,\ b=-3,\ c=1`) },
        { t: tex(raw`f(x)=2x^2-3x+1`), on: { curve: true } },
      ]}
      note="Cek: f(2) = 8 − 6 + 1 = 3. Cocok dengan titik ketiga."
    />
  );
}

/* ═════════ 22 · Jumlah dan hasil kali akar ═════════ */
const BJH: BBox = [-7, 7, 7, -7];
function SumProductSlide() {
  return (
    <Lab
      eyebrow="08 · Jumlah dan hasil kali" title="Tanpa mencari akarnya"
      copy={<>
        <p className="ds-math">{tex(raw`x_1+x_2=-\dfrac ba,\quad x_1x_2=\dfrac ca`)}</p>
        <p>{tex(raw`x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2`)}</p>
        <p className="fragment">Contoh 15: {tex("2x^2-6x+4=0")} → jumlah 3, hasil kali 2 → {tex(raw`x_1^2+x_2^2=9-4=5`)}.</p>
        <p className="ds-muted">Atur x₁ = 1 dan x₂ = 2 untuk mengeceknya.</p>
      </>}
      init={[1, 2]} bbox={BJH}
      sl={[{ label: tex("x_1"), min: -5, max: 5, step: 0.5, color: C.blue }, { label: tex("x_2"), min: -5, max: 5, step: 0.5, color: C.orange }]}
      toQ={(s) => [1, -(s[0] + s[1]), s[0] * s[1]]} flags={{ roots: true }}
      read={(s) => {
        const sm = s[0] + s[1], pr = s[0] * s[1];
        return <>
          {tex(`x_1+x_2=${nt(sm)},\\quad x_1x_2=${nt(pr)}`)}
          {tex(`x_1^2+x_2^2=${nt(sm)}^2-2(${nt(pr)})=${nt(sm * sm - 2 * pr)}`)}
          {pr !== 0 && tex(raw`\dfrac1{x_1}+\dfrac1{x_2}=\dfrac{x_1+x_2}{x_1x_2}=${nt(sm / pr)}`)}
        </>;
      }}
    />
  );
}

/* ═════════ 23 · Persamaan kuadrat baru ═════════ */
const BNW: BBox = [-2, 12, 16, -4];
function NewEqSlide() {
  return (
    <Lab
      eyebrow="08 · Persamaan baru" title="Akar dilipatkan m kali"
      copy={<>
        <p className="ds-math">{tex(raw`x^2-(p+q)x+pq=0`)}</p>
        <p>Akar {tex("x^2-5x+6=0")} adalah α = 2 dan β = 3 (jumlah 5, hasil kali 6).</p>
        <p className="fragment">Contoh 16: akar baru 2α dan 2β → jumlah 10, hasil kali 24 → {tex("x^2-10x+24=0")}.</p>
        <p className="ds-muted">Geser m. Kurva abu-abu adalah persamaan semula.</p>
      </>}
      init={[2]} bbox={BNW}
      sl={[{ label: tex("m"), min: 0.5, max: 3, step: 0.5, color: C.orange }]}
      toQ={(s) => [1, -5 * s[0], 6 * s[0] * s[0]]} flags={{ roots: true }} extra={() => ({ ref: [1, -5, 6] })}
      read={(s) => <>
        {tex(raw`m\alpha+m\beta=${nt(5 * s[0])},\quad m\alpha\cdot m\beta=${nt(6 * s[0] * s[0])}`)}
        {tex(raw`x^2-${nt(5 * s[0])}x+${nt(6 * s[0] * s[0])}=0`)}
      </>}
    />
  );
}

/* ═════════ 24 · Jenis akar khusus ═════════ */
function SpecialRootsSlide() {
  return (
    <Frame
      eyebrow="08 · Jenis akar khusus" title="Baca syaratnya dari a, b, c"
      copy={<>
        <p><b>Contoh 17.</b> {tex("3x^2+(k-4)x-6=0")} punya akar berlawanan.</p>
        <p className="fragment">Akar berlawanan: {tex("x_1+x_2=0")}.</p>
        <p className="fragment">{tex(raw`-\dfrac{k-4}{3}=0\ \Rightarrow\ k=4`)}</p>
      </>}
      stage={<Tbl
        head={["Jenis akar", "Syarat"]}
        rows={[
          [<>berlawanan {tex("x_1=-x_2")}</>, tex(raw`b=0`)],
          [<>berkebalikan {tex(raw`x_1=\tfrac1{x_2}`)}</>, tex(raw`c=a`)],
          ["salah satu akar nol", tex(raw`c=0`)],
          ["kedua akar positif", tex(raw`D\ge0,\ x_1+x_2>0,\ x_1x_2>0`)],
          ["kedua akar negatif", tex(raw`D\ge0,\ x_1+x_2<0,\ x_1x_2>0`)],
          ["berlainan tanda", tex(raw`x_1x_2<0\Rightarrow\tfrac ca<0`)],
        ]}
      />}
    />
  );
}

/* ═════════ 25–26 · Garis dan parabola ═════════ */
const BLA: BBox = [-6, 8, 6, -4];
function LineParabolaSlide() {
  return (
    <Lab
      eyebrow="09 · Garis dan parabola" title="Memotong, menyinggung, atau tidak"
      copy={<>
        <p>Samakan y garis dan parabola: {tex(raw`x^2=mx+k\ \Rightarrow\ x^2-mx-k=0`)}</p>
        <p className="ds-math">{tex(raw`D=m^2+4k`)}</p>
        <p><b style={{ color: C.teal }}>D &gt; 0</b>: memotong di dua titik. <b style={{ color: C.orange }}>D = 0</b>: menyinggung. <b style={{ color: C.red }}>D &lt; 0</b>: tidak berpotongan.</p>
        <p className="ds-muted">Titik merah = titik potong. Garis oranye: y = mx + k.</p>
      </>}
      init={[1, 2]} bbox={BLA}
      sl={[{ label: tex("m"), min: -4, max: 4, step: 0.5, color: C.orange }, { label: tex("k"), min: -4, max: 6, step: 0.5, color: C.violet }]}
      toQ={() => [1, 0, 0]} extra={(s) => ({ line: [s[0], s[1]] })}
      read={(s) => {
        const D = s[0] * s[0] + 4 * s[1];
        return <>{tex(`D=(${nt(s[0])})^2+4(${nt(s[1])})=${nt(D)}`)}<b style={{ color: tone(D) }}>{D > 0 ? "memotong di dua titik" : D === 0 ? "menyinggung di satu titik" : "tidak berpotongan"}</b></>;
      }}
    />
  );
}
const BLB: BBox = [-5, 9, 5, -3];
function TangentSlide() {
  return (
    <Lab
      eyebrow="09 · Contoh 18" title="Garis menyinggung parabola"
      copy={<>
        <p>Garis {tex("y=2x+k")} menyinggung parabola {tex("y=x^2+3")}. Tentukan k.</p>
        <p className="fragment">{tex(raw`x^2+3=2x+k\ \Rightarrow\ x^2-2x+(3-k)=0`)}</p>
        <p className="fragment">Menyinggung: D = 0 → {tex(raw`4-4(3-k)=0\Rightarrow k=2`)}</p>
        <p className="ds-muted">Geser k sampai titik merah tinggal satu.</p>
      </>}
      init={[0]} bbox={BLB} sl={[{ label: tex("k"), min: -2, max: 6, step: 0.5, color: C.violet }]}
      toQ={() => [1, 0, 3]} extra={(s) => ({ line: [2, s[0]] })}
      read={(s) => {
        const D = 4 - 4 * (3 - s[0]);
        return <>{tex(`D=4-4(3-${nt(s[0])})=${nt(D)}`)}<b style={{ color: tone(D) }}>{D > 0 ? "memotong di dua titik" : D === 0 ? "✓ menyinggung di (1, 4): k = 2" : "tidak berpotongan"}</b></>;
      }}
    />
  );
}

/* ───────── Papan aplikasi: kurva dengan titik bergerak (skala sumbu bebas) ───────── */
type AP = { f: (x: number) => number; lo: number; hi: number; x0: number; top: Vec | null; ends: Vec[]; xl: string; yl: string };
const buildApp: Build<AP> = (b, g) => {
  const bb = b.getBoundingBox();
  const w = bb[2] - bb[0], h = bb[1] - bb[3];
  mk(b, "functiongraph", [(x: number) => g().f(x), () => g().lo, () => g().hi], { ...still, strokeColor: C.ink, strokeWidth: 3 });
  seg(b, () => [g().x0, 0], () => [g().x0, g().f(g().x0)], C.soft, 1.5, 2);
  dot(b, () => [g().x0, g().f(g().x0)], C.orange, 8);
  dot(b, () => g().top ?? OFF, C.teal, 7);
  note(b, () => { const t = g().top; return t ? [t[0] + w / 50, t[1] + h / 30] : OFF; }, () => { const t = g().top; return t ? `(${n(t[0])}, ${n(t[1])})` : ""; }, C.teal);
  [0, 1].forEach((i) => dot(b, () => g().ends[i] ?? OFF, C.red, 7));
  note(b, () => [bb[2] - 0.08 * w, 0.03 * h], () => g().xl, C.mute);
  note(b, () => [bb[0] + 0.015 * w, bb[1] - 0.07 * h], () => g().yl, C.mute);
};

const ap = (p: AP) => p;

/* ═════════ 27 · Aplikasi: lintasan bola ═════════ */
const BBOLA: BBox = [-0.4, 24, 4.6, -3];
const hBola = (t: number) => -5 * t * t + 20 * t;
function BallSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [t, setT] = useState(0.5);
  const [play, setPlay] = useState(false);
  const tr = useRef(0.5);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      tr.current = Math.min(4, tr.current + ((now - last) / 1000) * 1.1);
      last = now;
      setT(tr.current);
      if (tr.current >= 4) { setPlay(false); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const h = hBola(t);
  const state = Math.abs(t - 2) < 0.03 ? "di puncak" : t < 2 ? "sedang naik" : t >= 3.999 ? "mendarat" : "sedang turun";
  return (
    <Frame
      innerRef={ref}
      eyebrow="10 · Aplikasi · Contoh 19" title="Lintasan bola"
      copy={<>
        <p>Tinggi bola {tex("h(t)=-5t^2+20t")} meter pada t detik. Berapa tinggi maksimum dan kapan mendarat?</p>
        <p className="fragment">{tex("a=-5<0")}: ada nilai maksimum.</p>
        <p className="fragment">{tex(raw`t_p=-\dfrac{20}{2(-5)}=2`)} s, {tex("h_{maks}=20")} m.</p>
        <p className="fragment">Mendarat saat h = 0: {tex("-5t(t-4)=0")} → t = 4 s.</p>
      </>}
      stage={<>
        <SimBoard bbox={BBOLA} aspect={1.5} maxH={340} build={buildApp}
          params={ap({ f: hBola, lo: 0, hi: 4, x0: t, top: step >= 2 ? [2, 20] : null, ends: step >= 3 ? [[4, 0]] : [], xl: "t (s)", yl: "h (m)" })} />
        <div className="ds-controls">
          <Range label={tex("t")} value={t} min={0} max={4} step={0.05} color={C.orange} shown={n(t)}
            onChange={(v) => { setPlay(false); tr.current = v; setT(v); }} />
          <div style={{ alignSelf: "end" }}><Btn onClick={() => { tr.current = 0; setT(0); setPlay(true); }}>Tendang!</Btn></div>
        </div>
        <div className="ds-read">t = {n(t)} s → h = {n(h)} m · {state}</div>
      </>}
    />
  );
}

/* ═════════ 28 · Aplikasi: luas maksimum ═════════ */
const BAREA: BBox = [-1, 115, 22, -15];
const LArea = (x: number) => 20 * x - x * x;
function AreaSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [x, setX] = useState(4);
  return (
    <Frame
      innerRef={ref}
      eyebrow="10 · Aplikasi · Contoh 20" title="Luas maksimum"
      copy={<>
        <p>Kawat 40 m dibentuk menjadi persegi panjang. Berapa luas terbesarnya?</p>
        <p className="fragment">Keliling 40 → panjang + lebar = 20. Misal panjang x, lebar 20 − x.</p>
        <p className="fragment">{tex(raw`L(x)=x(20-x)=-x^2+20x`)}</p>
        <p className="fragment">{tex("x_p=10")}, {tex(raw`L_{maks}=100\ \text{m}^2`)}: persegi 10 × 10.</p>
      </>}
      stage={<>
        <div style={{ height: 146, display: "grid", placeItems: "center" }}>
          <div style={{
            width: Math.max(2, x * 7), height: Math.max(2, (20 - x) * 7), display: "grid", placeItems: "center",
            background: "rgba(15,118,110,.18)", border: `2px solid ${C.ink}`, font: "500 12px var(--mono)", color: C.ink,
          }}>{x >= 3 && x <= 17 ? `${n(x)} × ${n(20 - x)}` : ""}</div>
        </div>
        <SimBoard bbox={BAREA} aspect={1.6} maxH={280} build={buildApp}
          params={ap({ f: LArea, lo: 0, hi: 20, x0: x, top: step >= 3 ? [10, 100] : null, ends: [], xl: "x (m)", yl: "L (m²)" })} />
        <div className="ds-controls ds-controls--one">
          <Range label={<>panjang {tex("x")}</>} value={x} min={0} max={20} step={0.5} color={C.orange} shown={n(x)} onChange={setX} />
        </div>
        <div className="ds-read">panjang {n(x)} m · lebar {n(20 - x)} m · luas = <b>{n(LArea(x))} m²</b></div>
      </>}
    />
  );
}

/* ═════════ 29 · Strategi soal cerita ═════════ */
function StrategySlide() {
  return (
    <Frame
      eyebrow="10 · Strategi" title="Soal cerita maksimum / minimum"
      copy={<>
        <p>Tentukan <b>besaran yang dicari</b>, ubah jadi <b>fungsi satu variabel</b>, lalu cari puncaknya.</p>
        <p className="fragment">Pastikan hasilnya kuadrat. Tanda a: negatif → maksimum, positif → minimum.</p>
        <p className="fragment">Periksa apakah x_p masuk akal (panjang atau waktu tidak boleh negatif). Jangan lupa satuan.</p>
      </>}
      stage={<Tbl
        head={["Langkah", "Contoh: luas kebun"]}
        rows={[
          ["1 · Besaran dicari", "luas L"],
          ["2 · Satu variabel", tex("L(x)=x(20-x)")],
          ["3 · Cek tanda a", <>{tex("a=-1")}, maksimum</>],
          ["4 · Puncak", tex(raw`x_p=10,\ L=100`)],
          ["5 · Jawab + satuan", tex(raw`100\ \text{m}^2`)],
        ]}
      />}
    />
  );
}

/* ═════════ 30–32 · Rangkuman ═════════ */
function SummarySlide() {
  return (
    <Frame
      eyebrow="Rangkuman" title="Rumus yang perlu diingat"
      copy={<>
        <p>Semua bersumber dari <b>a, b, c</b> dan diskriminan <b>D</b>.</p>
        <p className="ds-muted">Ingat: bila ragu, gambar sketsa parabolanya.</p>
      </>}
      stage={<Tbl rows={[
        ["Bentuk umum", tex(raw`f(x)=ax^2+bx+c,\ a\neq0`)],
        ["Akar dan D", tex(raw`x_{1,2}=\dfrac{-b\pm\sqrt D}{2a},\ D=b^2-4ac`)],
        ["Jenis akar", tex(raw`D>0,\ D=0,\ D<0`)],
        ["Puncak", tex(raw`\left(-\dfrac b{2a},\,-\dfrac D{4a}\right)`)],
        ["Bentuk lain", tex(raw`a(x-p)^2+q,\ a(x-x_1)(x-x_2)`)],
        ["Jumlah, kali", tex(raw`x_1+x_2=-\dfrac ba,\ x_1x_2=\dfrac ca`)],
        ["Persamaan baru", tex(raw`x^2-(p+q)x+pq=0`)],
      ]} />}
    />
  );
}
function MethodSlide() {
  return (
    <Frame
      eyebrow="Rangkuman" title="Memilih metode"
      copy={<p>Pilih alat yang paling hemat untuk pertanyaannya.</p>}
      stage={<Tbl head={["Yang ditanya", "Gunakan"]} rows={[
        ["akar dengan angka bagus", "pemfaktoran"],
        ["akar sembarang", "rumus ABC"],
        ["banyak akar, nilai parameter", <>diskriminan {tex("D")}</>],
        ["nilai maksimum atau minimum", <>titik puncak {tex("(x_p,y_p)")}</>],
        ["menyusun fungsi", <>{tex("a(x-x_1)(x-x_2)")} atau {tex("a(x-p)^2+q")}</>],
        [<>{tex("x_1^2+x_2^2")}, {tex(raw`\tfrac1{x_1}+\tfrac1{x_2}`)}</>, "jumlah dan hasil kali akar"],
        ["garis dan parabola", <>samakan, lalu cek {tex("D")}</>],
      ]} />}
    />
  );
}
function MistakesSlide() {
  return (
    <Frame
      eyebrow="Rangkuman" title="Kesalahan yang sering terjadi"
      copy={<p>Kenali jebakannya sebelum latihan. Banyak nilai hilang karena tanda dan langkah kecil.</p>}
      stage={<Tbl head={["Keliru", "Yang benar"]} rows={[
        [<>{tex("x^2=9")} → hanya {tex("x=3")}</>, tex(raw`x=\pm3`)],
        ["memfaktorkan sebelum ruas kanan nol", "pindahkan semua suku ke satu ruas dulu"],
        [<>−b saat b negatif, lupa {tex("2a")}</>, <>{tex("-(-3)=+3")}, penyebut {tex("2a")}</>],
        [<>{tex("x_1^2+x_2^2")} tanpa {tex("-2x_1x_2")}</>, tex(raw`(x_1+x_2)^2-2x_1x_2`)],
        ["selalu menjawab “di luar akar”", "periksa dengan sketsa parabola"],
        ["soal cerita: lupa satuan", "cek x_p masuk akal, tulis satuan"],
      ]} />}
    />
  );
}

/* ═════════ 33 · Pemanasan ═════════ */
function WarmupSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const qs: ReactNode[] = [
    tex(raw`f(x)=x^2-2x+5,\ f(3)=?`), tex(raw`x^2+x-6=0`), tex(raw`D\ \text{dari}\ 2x^2-3x+4`),
    tex(raw`\text{puncak}\ y=x^2+4x+3`), tex(raw`\text{jumlah, kali akar}\ x^2-8x+15=0`),
    tex(raw`y=ax^2\ \text{melalui}\ (2,12),\ a=?`),
  ];
  return (
    <Frame
      innerRef={ref}
      eyebrow="Latihan · Pemanasan" title="Coba sendiri dulu"
      copy={<>
        <p className="ds-muted">Kerjakan di kertas, lalu tekan → untuk mencocokkan jawaban satu per satu.</p>
        <p className="fragment">{tex("f(3)=9-6+5=8")}</p>
        <p className="fragment">{tex(raw`(x+3)(x-2)=0\Rightarrow x=-3,\ 2`)}</p>
        <p className="fragment">{tex("D=9-32=-23")}: tanpa akar real</p>
        <p className="fragment">{tex(raw`x_p=-2,\ y_p=-1`)} → (−2, −1)</p>
        <p className="fragment">jumlah 8, hasil kali 15</p>
        <p className="fragment">{tex(raw`4a=12\Rightarrow a=3`)}</p>
      </>}
      stage={<Tbl rows={qs.map((q, i) => [`${i + 1}${step > i ? " ✓" : ""}`, q])} />}
    />
  );
}

/* ═════════ 34 · Tantangan 1: cocokkan parabola ═════════ */
const TARGETS: Q[] = [[1, -2, -3], [-1, 2, 3], [2, -8, 6], [-0.5, 0, 4], [1, 4, 3]];
const BMT: BBox = [-7, 9, 7, -7];
function MatchSlide() {
  const [i, setI] = useState(0);
  const [s, setS] = useState<number[]>([1, 0, 0]);
  const [hint, setHint] = useState(false);
  const [got, setGot] = useState<number[]>([]);
  const T = TARGETS[i % TARGETS.length];
  const q = s as Q;
  const ok = s.every((v, j) => Math.abs(v - T[j]) < 1e-9);
  useEffect(() => { if (ok && !got.includes(i)) setGot((g) => [...g, i]); }, [ok, i, got]);
  const set = (j: number, v: number) => setS((a) => a.map((x, k) => (k === j ? v : x)));
  const v = vtx(T);
  return (
    <Frame
      eyebrow="Latihan · Tantangan 1" title="Cocokkan parabolanya"
      copy={<>
        <p>Geser a, b, c sehingga kurva <b>hitam</b> menimpa kurva <b style={{ color: C.violet }}>ungu putus-putus</b>.</p>
        <p className="ds-muted">Petunjuk: lihat arah, titik potong sumbu y, dan puncaknya. Tiap soal berbeda.</p>
        <p>Terpecahkan: <b>{got.length}</b></p>
      </>}
      stage={<>
        <SimBoard bbox={BMT} params={{ q, ghost: T, vertex: true, yint: true }} build={buildPara} maxH={340} />
        <div className="ds-controls">
          <Range label={tex("a")} value={s[0]} min={-3} max={3} step={0.5} color={C.blue} shown={n(s[0])} onChange={(x) => set(0, x)} />
          <Range label={tex("b")} value={s[1]} min={-8} max={8} step={1} color={C.orange} shown={n(s[1])} onChange={(x) => set(1, x)} />
          <Range label={tex("c")} value={s[2]} min={-6} max={6} step={1} color={C.violet} shown={n(s[2])} onChange={(x) => set(2, x)} />
        </div>
        <div className="ds-read">
          {ok ? <span className="ds-ok">✓ Cocok! {tex(`f(x)=${poly(...T)}`)}</span>
            : hint ? <>target: terbuka ke {T[0] > 0 ? "atas" : "bawah"} · puncak ({n(v[0])}, {n(v[1])}) · memotong sumbu y di (0, {n(T[2])})</>
            : "Belum cocok. Tekan Petunjuk bila perlu."}
        </div>
        <div className="ds-row">
          <Btn onClick={() => setHint((h) => !h)}>Petunjuk</Btn>
          <Btn onClick={() => { setI(i + 1); setS([1, 0, 0]); setHint(false); }}>Soal berikutnya</Btn>
        </div>
      </>}
    />
  );
}

/* ═════════ 35 · Tantangan 2: harga tiket (soal 15) ═════════ */
const BTK: BBox = [-1, 6, 21, -0.9];
const Rev = (m: number) => 0.02 * (20 - m) * (12 + m); // juta rupiah
const rp = (v: number) => "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(v));
function TicketSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [m, setM] = useState(0);
  const [best, setBest] = useState(Rev(0));
  const upd = (v: number) => { setM(v); setBest((b) => Math.max(b, Rev(v))); };
  return (
    <Frame
      innerRef={ref}
      eyebrow="Latihan · Tantangan 2" title="Harga tiket terbaik"
      copy={<>
        <p>Tiket Rp40.000 dihadiri 120 penonton. Tiap turun Rp2.000 menambah 10 penonton. Berapa pendapatan maksimum?</p>
        <p className="ds-muted">Turunkan harga n kali dan cari puncaknya. Lalu tekan → untuk model matematikanya.</p>
        <p className="fragment">{tex(raw`R(n)=(40.000-2.000n)(120+10n)=20.000(20-n)(12+n)`)}</p>
        <p className="fragment">{tex(raw`R=20.000(-n^2+8n+240),\ n_p=4`)} → R = Rp5.120.000.</p>
      </>}
      stage={<>
        <SimBoard bbox={BTK} aspect={1.6} maxH={300} build={buildApp}
          params={ap({ f: Rev, lo: 0, hi: 20, x0: m, top: step >= 2 ? [4, 5.12] : null, ends: [], xl: "n", yl: "R (juta Rp)" })} />
        <div className="ds-controls ds-controls--one">
          <Range label={<>harga turun {tex("n")} kali</>} value={m} min={0} max={20} step={1} color={C.orange} shown={n(m)} onChange={upd} />
        </div>
        <div className="ds-read">
          harga {rp(40000 - 2000 * m)} · penonton {120 + 10 * m}<br />
          pendapatan <b>{rp(Rev(m) * 1e6)}</b> · terbaik sejauh ini {rp(best * 1e6)}
          {m === 4 && <><br /><span className="ds-ok">✓ Inilah puncaknya: n = 4, harga Rp32.000, 160 penonton.</span></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 36 · Tantangan 3: definit + garis (soal 14) ═════════ */
const BT3: BBox = [-3, 10, 8, -4];
function ConditionSlide() {
  return (
    <Lab
      eyebrow="Latihan · Tantangan 3" title="Dua syarat sekaligus"
      copy={<>
        <p>Grafik {tex("f(x)=x^2-4x+k")} berada <b>seluruhnya di atas sumbu x</b> dan memotong garis {tex("y=x-1")} di <b>dua titik</b>. Bilangan bulat k yang memenuhi?</p>
        <p className="ds-muted">Geser k dan periksa kedua syarat.</p>
        <p className="fragment">Syarat 1: D &lt; 0 → 16 − 4k &lt; 0 → k &gt; 4.</p>
        <p className="fragment">Syarat 2: {tex("x^2-5x+(k+1)=0")}, D &gt; 0 → k &lt; 5,25.</p>
      </>}
      init={[2]} bbox={BT3} sl={[{ label: tex("k"), min: 0, max: 8, step: 1, color: C.violet }]}
      toQ={(s) => [1, -4, s[0]]} flags={{ roots: true }} extra={() => ({ line: [1, -1] })}
      read={(s) => {
        const D1 = 16 - 4 * s[0], D2 = 25 - 4 * (s[0] + 1);
        const c1 = D1 < 0, c2 = D2 > 0;
        return <>
          <span className={c1 ? "ds-ok" : "ds-bad"}>{c1 ? "✓" : "✗"} di atas sumbu x: D = {D1}</span><br />
          <span className={c2 ? "ds-ok" : "ds-bad"}>{c2 ? "✓" : "✗"} memotong garis dua titik: D = {D2}</span>
          {c1 && c2 && <><br /><b className="ds-ok">k = {s[0]} memenuhi. Satu-satunya bilangan bulat (4 &lt; k &lt; 5,25).</b></>}
        </>;
      }}
    />
  );
}

/* ═════════ 38 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan" title="Satu parabola, banyak cerita"
      copy={<>
        <p>Tanda <b>a</b> memberi arah, <b>c</b> memberi titik potong sumbu y.</p>
        <p className="fragment"><b>D</b> meramal banyak akar; akar dicari dengan faktor atau rumus ABC.</p>
        <p className="fragment">Puncak memberi <b>nilai maksimum atau minimum</b>, kunci soal cerita.</p>
        <p className="fragment">Kini rumus-rumus itu adalah sesuatu yang pernah Anda <b>gerakkan sendiri</b>.</p>
      </>}
      stage={<div className="ds-read ds-math" style={{ maxWidth: 560, display: "grid", gap: 18 }}>
        {tex(raw`f(x)=ax^2+bx+c`)}
        {tex(raw`x_{1,2}=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}`)}
        {tex(raw`\left(x_p,\,y_p\right)=\left(-\dfrac b{2a},\,-\dfrac D{4a}\right)`)}
      </div>}
    />
  );
}

export function FungsiKuadratDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <MapSlide />
      <LinearVsQuadSlide />
      <FormSlide />
      <EffectASlide />
      <EffectBCSlide />
      <TableSlide />
      <AnatomySlide />
      <FactorSlide />
      <Factor2Slide />
      <CompleteSquareSlide />
      <AbcSlide />
      <DiscSlide />
      <Disc7Slide />
      <Disc8Slide />
      <DefiniteSlide />
      <VertexSlide />
      <VertexFormSlide />
      <DrawSlide />
      <FormsTableSlide />
      <FindASlide />
      <ThreePointsSlide />
      <SumProductSlide />
      <NewEqSlide />
      <SpecialRootsSlide />
      <LineParabolaSlide />
      <TangentSlide />
      <BallSlide />
      <AreaSlide />
      <StrategySlide />
      <SummarySlide />
      <MethodSlide />
      <MistakesSlide />
      <WarmupSlide />
      <MatchSlide />
      <TicketSlide />
      <ConditionSlide />
      <Quiz eyebrow="Latihan · Kuis" title="Kuis 13 soal" items={QUIZ} />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default FungsiKuadratDeck;
