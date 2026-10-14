/* eslint-disable @typescript-eslint/no-explicit-any */
/* Deck "Irisan kerucut" (kelas 12): lingkaran, parabola, elips, hiperbola.
   Pola yang sama dengan deck lain: tiap fragmen (→) menaikkan `step`, dan `step` mengatur papan.
   Satu model Cn (jenis, pusat/puncak, a, b, orientasi) dipakai semua papan; G() memetakan koordinat
   lokal (u sepanjang sumbu utama, w tegak lurus) ke bidang. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Btn, C, Chips, dot, fmt, Frame, note, OFF, rad, Range, seg, shape, SimBoard, SlideDeck, useStep, useTween,
  type BBox, type Build, type Vec,
} from "../common/core";
import { ln, n, Quiz, tex } from "../common/LinearKit";
import { QUIZ } from "./quizzes/IrisanKerucutQuiz";

const raw = String.raw;
const BB: BBox = [-8, 5, 8, -5];
const BC: BBox = [-7, 5, 7, -5];
const BE: BBox = [-9, 5, 7, -5];

/* ───────── Teks matematika ───────── */
const nt = (v: number) => n(v).replace(",", "{,}"); // koma desimal aman di TeX
const par = (v: string, d: number) => (d === 0 ? v : `(${v}${d > 0 ? "-" : "+"}${nt(Math.abs(d))})`);
const sqr = (v: string, d: number) => (d === 0 ? `${v}^2` : `${par(v, d)}^2`);
const tm = (k: number, v: string) => (k === 0 ? "" : `${k < 0 ? "-" : "+"}${Math.abs(k) === 1 && v ? "" : nt(Math.abs(k))}${v}`);
const lin2 = (a: number, b: number) => {
  const f = (k: number, v: string, first: boolean) => (k === 0 ? "" : `${k < 0 ? "-" : first ? "" : "+"}${Math.abs(k) === 1 ? "" : nt(Math.abs(k))}${v}`);
  return f(a, "x", true) + f(b, "y", a === 0) || "0";
};
const yTxt = (m: number, q: number) => {
  const mx = m === 0 ? "" : `${m === 1 ? "" : m === -1 ? "-" : nt(m)}x`;
  const qs = q === 0 ? "" : (mx && q > 0 ? "+" : "") + nt(q);
  return `y=${mx}${qs}` === "y=" ? "y=0" : `y=${mx}${qs}`;
};
const z = (v: number) => (Math.abs(v) < 1e-9 ? 0 : v);

/* ───────── Model kurva ───────── */
type Kd = "c" | "p" | "e" | "h";
type Cn = { t: Kd; h: number; k: number; a: number; b: number; v: boolean };
const COL: Record<Kd, string> = { c: C.blue, p: C.teal, e: C.violet, h: C.red };
const STD: Record<Kd, Cn> = {
  c: { t: "c", h: 0, k: 0, a: 3, b: 3, v: false }, // x²+y²=9
  p: { t: "p", h: 0, k: 0, a: 1, b: 0, v: false }, // y²=4x
  e: { t: "e", h: 0, k: 0, a: 5, b: 3, v: false }, // x²/25+y²/9=1
  h: { t: "h", h: 0, k: 0, a: 4, b: 2, v: false }, // x²/16−y²/4=1
};
const G = (c: Cn, u: number, w: number): Vec => (c.v ? [c.h + w, c.k + u] : [c.h + u, c.k + w]);
const foc = (c: Cn) => (c.t === "e" ? Math.sqrt(Math.max(0, c.a * c.a - c.b * c.b)) : c.t === "h" ? Math.hypot(c.a, c.b) : c.t === "p" ? c.a : 0);

function trace(c: Cn): Vec[] {
  const o: Vec[] = [], N = 120;
  if (c.t === "c" || c.t === "e") {
    const w = c.t === "c" ? c.a : c.b;
    for (let i = 0; i <= N; i++) { const t = (2 * Math.PI * i) / N; o.push(G(c, c.a * Math.cos(t), w * Math.sin(t))); }
  } else if (c.t === "p") {
    for (let i = -N; i <= N; i++) { const s = (5 * i) / N; o.push(G(c, c.a * s * s, 2 * c.a * s)); }
  } else {
    [1, -1].forEach((sg, j) => {
      if (j) o.push([NaN, NaN]);
      for (let i = -N; i <= N; i++) { const s = (2.4 * i) / N; o.push(G(c, sg * c.a * Math.cosh(s), c.b * Math.sinh(s))); }
    });
  }
  return o;
}
const drawConic = (b: any, g: () => Cn, color: string, w = 3) =>
  shape(b, () => trace(g()), { strokeColor: color, strokeWidth: w }, false);

/** Titik potong garis y = mx + q dengan kurva baku; `special` = persamaan menjadi linear (sejajar sumbu/asimtot). */
function inter(c: Cn, m: number, q: number) {
  const { a, b } = c;
  const [A, B, K] =
    c.t === "c" ? [1 + m * m, 2 * m * q, q * q - a * a]
    : c.t === "p" ? [m * m, 2 * m * q - 4 * a, q * q]
    : c.t === "e" ? [b * b + a * a * m * m, 2 * a * a * m * q, a * a * (q * q - b * b)]
    : [b * b - a * a * m * m, -2 * a * a * m * q, -a * a * (q * q + b * b)];
  let xs: number[];
  const special = Math.abs(A) < 1e-9;
  if (special) xs = Math.abs(B) < 1e-9 ? [] : [-K / B];
  else {
    const D = B * B - 4 * A * K;
    xs = D < -1e-9 ? [] : D < 1e-9 ? [-B / (2 * A)] : [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)];
  }
  return { special, pts: xs.map((x): Vec => [x, m * x + q]) };
}
/** Ekspresi yang tandanya sama dengan diskriminan. */
const dval = (c: Cn, m: number, q: number) =>
  c.t === "c" ? c.a * c.a * (1 + m * m) - q * q : c.t === "p" ? c.a - m * q
  : c.t === "e" ? c.a * c.a * m * m + c.b * c.b - q * q : q * q + c.b * c.b - c.a * c.a * m * m;
/** Nilai n (n ≥ 0 bila ada pilihan) agar y = mx + n menyinggung. */
const tangN = (c: Cn, m: number): number | null =>
  c.t === "c" ? c.a * Math.sqrt(1 + m * m)
  : c.t === "p" ? (Math.abs(m) < 1e-9 ? null : c.a / m)
  : c.t === "e" ? Math.sqrt(c.a * c.a * m * m + c.b * c.b)
  : c.a * c.a * m * m - c.b * c.b < 0 ? null : Math.sqrt(c.a * c.a * m * m - c.b * c.b);

/* ───────── UI kecil ───────── */
const Ctl = ({ children, one }: { children: ReactNode; one?: boolean }) => (
  <div className={`ds-controls${one ? " ds-controls--one" : ""}`}>{children}</div>
);
const Read = ({ rows }: { rows: ReactNode[] }) => (
  <div className="ds-read">{rows.map((r, i) => <div key={i}>{r}</div>)}</div>
);

/* ═════════════════ 1. Pengantar: mengiris kerucut ═════════════════ */
const AL = 35;
const CONE_PRE = [90, 90, 62, AL, 12];
const NAMES = ["Lingkaran", "Elips", "Parabola", "Hiperbola"];
const NCOL = [C.blue, C.violet, C.teal, C.red];

const buildCone: Build<{ g: number }> = (b, get) => {
  const t = Math.tan(rad(AL));
  seg(b, () => [-6 * t, -6], () => [6 * t, 6], C.mute, 2.5);
  seg(b, () => [6 * t, -6], () => [-6 * t, 6], C.mute, 2.5);
  seg(b, () => [0, -6], () => [0, 6], C.soft, 1.5, 3);
  const d = (): Vec => [Math.sin(rad(get().g)), Math.cos(rad(get().g))];
  seg(b, () => [-9 * d()[0], -1.5 - 9 * d()[1]], () => [9 * d()[0], -1.5 + 9 * d()[1]], C.orange, 3.5);
  [1, -1].forEach((sg) => dot(b, () => {
    const [dx, dy] = d(), den = dx - sg * t * dy, s = (-sg * 1.5 * t) / den;
    return Math.abs(den) > 1e-3 && Math.abs(s) < 8 ? [s * dx, -1.5 + s * dy] : OFF;
  }, C.violet, 5));
  dot(b, () => [0, 0], C.ink, 4, "O");
  note(b, () => [5.4 * d()[0], -1.5 + 5.4 * d()[1] + 0.2], () => "bidang", C.orange);
};

function ConeSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [g, setG] = useState(90);
  useEffect(() => { setG(CONE_PRE[Math.min(step, 4)]); }, [step]);
  const gt = useTween(g, 450);
  const kind = g >= 89.5 ? 0 : Math.abs(g - AL) < 0.75 ? 2 : g > AL ? 1 : 3;
  const e = Math.cos(rad(g)) / Math.cos(rad(AL));
  return (
    <Frame
      innerRef={ref} eyebrow="Pengantar" title="Irisan kerucut"
      copy={<>
        <p>Potong sebuah kerucut dengan bidang datar. Bentuk irisannya hanya bergantung pada <b>kemiringan bidang</b>.</p>
        <p className="fragment">Tegak lurus sumbu → <b>lingkaran</b>.</p>
        <p className="fragment">Sedikit dimiringkan → <b>elips</b>.</p>
        <p className="fragment">Sejajar garis pelukis → <b>parabola</b>.</p>
        <p className="fragment">Lebih tegak, memotong kedua kerucut → <b>hiperbola</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BC} params={{ g: gt }} build={buildCone} maxH={320} />
        <Ctl one>
          <Range label={<>Sudut bidang terhadap sumbu γ <span style={{ color: C.mute }}>(α = 35°)</span></>} value={g} min={5} max={90} step={1} onChange={setG} color={C.orange} shown={`${g}°`} />
        </Ctl>
        <Read rows={[
          <><b style={{ color: NCOL[kind] }}>{NAMES[kind]}</b> · {tex(raw`e=\dfrac{\cos\gamma}{\cos\alpha}=${nt(e)}`)}</>,
          <span style={{ color: C.mute }}>Titik ungu: perpotongan bidang dengan garis pelukis.</span>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ 2. Lingkaran: definisi dan persamaan ═════════════════ */
type CP = { a: number; b: number; r: number; s: number };
const buildCircle: Build<CP> = (b, g) => {
  drawConic(b, () => ({ t: "c", h: g().a, k: g().b, a: g().r, b: g().r, v: false }), COL.c);
  const Q = (): Vec => [g().a + g().r * Math.cos(rad(40)), g().b + g().r * Math.sin(rad(40))];
  const M = (): Vec => (g().s >= 1 ? [g().a, g().b] : OFF);
  seg(b, M, () => (g().s >= 1 ? Q() : OFF), C.orange, 2.5);
  dot(b, M, C.blue, 5, "M");
  note(b, () => (g().s >= 1 ? [(g().a + Q()[0]) / 2, (g().b + Q()[1]) / 2 - 0.1] : OFF), () => "r", C.orange);
  dot(b, () => (g().s >= 2 ? Q() : OFF), C.ink, 5, "P(x, y)");
};

function CircleDef() {
  const ref = useRef<HTMLDivElement>(null);
  const s = useStep(ref);
  const [S, set] = useState({ a: 2, b: 1, r: 3 });
  const up = (k: "a" | "b" | "r") => (v: number) => set((o) => ({ ...o, [k]: v }));
  const { a, b, r } = S;
  return (
    <Frame
      innerRef={ref} eyebrow="Lingkaran" title="Definisi dan persamaan"
      copy={<>
        <p>Lingkaran adalah himpunan titik yang berjarak <b>sama</b> terhadap satu titik tetap.</p>
        <p className="fragment">Titik tetap itu <b>pusat</b> M(a, b); jarak tetapnya <b>jari-jari</b> r.</p>
        <p className="fragment">P(x, y) di lingkaran ⇔ {tex(raw`\sqrt{(x-a)^2+(y-b)^2}=r`)}. Kuadratkan:</p>
        <p className="fragment">{tex(raw`(x-a)^2+(y-b)^2=r^2`)}. Dijabarkan: {tex(raw`x^2+y^2+Ax+By+C=0`)}, A = −2a, B = −2b, C = a²+b²−r².</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...S, s }} build={buildCircle} maxH={320} />
        <Ctl>
          <Range label={<>Pusat {tex("a")}</>} value={a} min={-4} max={4} step={1} onChange={up("a")} color={C.blue} />
          <Range label={<>Pusat {tex("b")}</>} value={b} min={-2} max={2} step={1} onChange={up("b")} color={C.blue} />
          <Range label={<>Jari-jari {tex("r")}</>} value={r} min={1} max={3} step={0.5} onChange={up("r")} color={C.orange} />
        </Ctl>
        <Read rows={[
          tex(raw`${sqr("x", a)}+${sqr("y", b)}=${nt(r * r)}`),
          tex(raw`x^2+y^2${tm(-2 * a, "x")}${tm(-2 * b, "y")}${tm(a * a + b * b - r * r, "")}=0`),
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Kedudukan garis (dipakai keempat kurva) ═════════════════ */
type LP = { c: Cn; m: number; q: number };
const buildLine: Build<LP> = (b, g) => {
  drawConic(b, () => g().c, COL[g().c.t]);
  [1, -1].forEach((sg) => ln(b, () => (g().c.t === "h" ? [sg * g().c.b, -g().c.a, 0] : null), C.mute, 1.75, 3));
  ln(b, () => [g().m, -1, -g().q], C.ink, 2.5);
  [0, 1].forEach((i) => dot(b, () => inter(g().c, g().m, g().q).pts[i] ?? OFF, C.orange, 6));
};

const LN: Record<Kd, { eb: string; eq: string; quad: string; dsym: string; tang: string; m: number; q: number }> = {
  c: { eb: "Lingkaran", eq: "x^2+y^2=9", quad: raw`(1+m^2)x^2+2mn\,x+n^2-9=0`, dsym: raw`9(1+m^2)-n^2`, tang: raw`n=\pm3\sqrt{1+m^2}`, m: 0.5, q: 1 },
  p: { eb: "Parabola", eq: "y^2=4x", quad: raw`m^2x^2+(2mn-4)x+n^2=0`, dsym: raw`1-mn`, tang: raw`n=\dfrac1m`, m: 1, q: -1 },
  e: { eb: "Elips", eq: raw`\dfrac{x^2}{25}+\dfrac{y^2}{9}=1`, quad: raw`(9+25m^2)x^2+50mn\,x+25(n^2-9)=0`, dsym: raw`25m^2+9-n^2`, tang: raw`n=\pm\sqrt{25m^2+9}`, m: 0.5, q: 1 },
  h: { eb: "Hiperbola", eq: raw`\dfrac{x^2}{16}-\dfrac{y^2}{4}=1`, quad: raw`(4-16m^2)x^2-32mn\,x-16(n^2+4)=0`, dsym: raw`n^2+4-16m^2`, tang: raw`n=\pm\sqrt{16m^2-4}`, m: 0, q: 1 },
};

function LineSlide({ kd }: { kd: Kd }) {
  const L = LN[kd], c = STD[kd];
  const [m, setM] = useState(L.m), [q, setQ] = useState(L.q);
  const I = inter(c, m, q), d = dval(c, m, q), tn = tangN(c, m);
  const V = I.special
    ? { t: kd === "p" ? "Sejajar sumbu parabola: satu titik potong, bukan garis singgung." : "Sejajar asimtot: satu titik potong, bukan garis singgung.", col: C.blue }
    : I.pts.length === 2 ? { t: "D > 0: memotong di dua titik.", col: C.teal }
    : I.pts.length === 1 ? { t: "D = 0: menyinggung di satu titik.", col: C.green }
    : { t: "D < 0: tidak berpotongan.", col: C.red };
  return (
    <Frame
      eyebrow={L.eb} title="Kedudukan garis"
      copy={<>
        <p>Garis {tex("y=mx+n")} dan kurva {tex(L.eq)}: ada berapa titik persekutuan?</p>
        <p className="fragment">Substitusikan y → {tex(L.quad)}</p>
        <p className="fragment">Banyak titik ditentukan <b>diskriminan</b> D: D &gt; 0 dua titik, D = 0 satu titik (<b>menyinggung</b>), D &lt; 0 tidak ada.</p>
        <p className="fragment">Syarat menyinggung: {tex(L.tang)}</p>
        {(kd === "p" || kd === "h") && <p className="ds-muted fragment">Bila garis sejajar {kd === "p" ? "sumbu" : "asimtot"}, persamaannya menjadi linear: satu titik potong, tetapi bukan garis singgung.</p>}
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ c, m, q }} build={buildLine} maxH={290} />
        <Ctl>
          <Range label={<>Gradien {tex("m")}</>} value={m} min={-2} max={2} step={0.25} onChange={setM} color={C.ink} shown={fmt(m, 2)} />
          <Range label={<>Konstanta {tex("n")}</>} value={q} min={-6} max={6} step={0.05} onChange={setQ} color={C.orange} shown={fmt(q, 2)} />
        </Ctl>
        <Btn onClick={() => { if (tn !== null) setQ(q < 0 && kd !== "p" ? -tn : tn); }}>Atur n agar menyinggung</Btn>
        <Read rows={[
          tex(yTxt(m, q)),
          tex(raw`\text{tanda }D:\ ${L.dsym}=${nt(d)}`),
          <b style={{ color: V.col }}>{V.t}</b>,
          tn === null ? <span style={{ color: C.mute }}>Tidak ada garis singgung dengan gradien ini.</span> : <span style={{ color: C.mute }}>Garis singgung ada untuk gradien ini.</span>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Garis singgung (dipakai keempat kurva) ═════════════════ */
type TP = { kd: Kd; u: number };
const tp = (kd: Kd, u: number): Vec => {
  const r = rad(u);
  const v: Vec = kd === "c" ? [3 * Math.cos(r), 3 * Math.sin(r)]
    : kd === "p" ? [(u * u) / 4, u]
    : kd === "e" ? [5 * Math.cos(r), 3 * Math.sin(r)]
    : [4 * Math.sqrt(1 + (u * u) / 4), u];
  return [z(v[0]), z(v[1])];
};
/** Garis singgung di T, dalam bentuk Ax + By = K (sudah dikalikan penyebut). */
const tg = (kd: Kd, u: number): [number, number, number] => {
  const [x, y] = tp(kd, u);
  const t: [number, number, number] = kd === "c" ? [x, y, 9] : kd === "p" ? [2, -y, -2 * x] : kd === "e" ? [9 * x, 25 * y, 225] : [4 * x, -16 * y, 64];
  return [z(t[0]), z(t[1]), z(t[2])];
};
const buildTan: Build<TP> = (b, g) => {
  drawConic(b, () => STD[g().kd], COL[g().kd]);
  [1, -1].forEach((sg) => ln(b, () => (g().kd === "h" ? [sg * 2, -4, 0] : null), C.mute, 1.75, 3));
  seg(b, () => (g().kd === "c" ? [0, 0] : OFF), () => (g().kd === "c" ? tp("c", g().u) : OFF), C.soft, 1.75, 3);
  ln(b, () => tg(g().kd, g().u), C.ink, 2.5);
  dot(b, () => tp(g().kd, g().u), C.orange, 6, "T");
};

const TG: Record<Kd, {
  eb: string; rule: string; grad: string; shift: string; min: number; max: number; step: number; u0: number; ctl: ReactNode; shown: (u: number) => string; why: ReactNode;
}> = {
  c: {
    eb: "Lingkaran", rule: raw`x_1x+y_1y=r^2`, grad: raw`y=mx\pm r\sqrt{1+m^2}`,
    shift: raw`(x_1-a)(x-a)+(y_1-b)(y-b)=r^2`, min: 0, max: 360, step: 5, u0: 50, ctl: "Letak titik T (sudut θ)", shown: (u) => `${u}°`,
    why: <>Garis singgung <b>tegak lurus jari-jari</b> OT. Gradien OT = y₁/x₁, jadi gradien singgung = −x₁/y₁.</>,
  },
  p: {
    eb: "Parabola", rule: raw`y_1y=2p(x+x_1)`, grad: raw`y=mx+\dfrac pm`,
    shift: raw`(y_1-k)(y-k)=2p\,[(x-h)+(x_1-h)]`, min: -4, max: 4, step: 0.1, u0: 2, ctl: "Ordinat titik T (y₁)", shown: (u) => fmt(u, 1),
    why: <>Pada <b>y² = 4x</b> (p = 1). Garis di puncak (y₁ = 0) adalah sumbu y: x = 0.</>,
  },
  e: {
    eb: "Elips", rule: raw`\dfrac{x_1x}{a^2}+\dfrac{y_1y}{b^2}=1`, grad: raw`y=mx\pm\sqrt{a^2m^2+b^2}`,
    shift: raw`\dfrac{(x_1-h)(x-h)}{a^2}+\dfrac{(y_1-k)(y-k)}{b^2}=1`, min: 0, max: 360, step: 5, u0: 50, ctl: "Letak titik T (parameter θ)", shown: (u) => `${u}°`,
    why: <>Pada elips <b>x²/25 + y²/9 = 1</b>. Di puncak (5, 0) singgungnya x = 5.</>,
  },
  h: {
    eb: "Hiperbola", rule: raw`\dfrac{x_1x}{a^2}-\dfrac{y_1y}{b^2}=1`, grad: raw`y=mx\pm\sqrt{a^2m^2-b^2}`,
    shift: raw`\dfrac{(x_1-h)(x-h)}{a^2}-\dfrac{(y_1-k)(y-k)}{b^2}=1`, min: -4, max: 4, step: 0.1, u0: 1.5, ctl: "Ordinat titik T (y₁)", shown: (u) => fmt(u, 1),
    why: <>Pada <b>x²/16 − y²/4 = 1</b>. Perhatikan: singgung hiperbola selalu berada <b>di antara</b> dua asimtot.</>,
  },
};

function TangentSlide({ kd }: { kd: Kd }) {
  const T = TG[kd];
  const [u, setU] = useState(T.u0);
  const [x1, y1] = tp(kd, u), [A, B, K] = tg(kd, u);
  return (
    <Frame
      eyebrow={T.eb} title="Garis singgung"
      copy={<>
        <p>Garis singgung di titik T(x₁, y₁) pada kurva:</p>
        <p className="fragment">{tex(T.rule)}</p>
        <p className="fragment">{T.why}</p>
        <p className="fragment">Kaidah bagi adil: x² → x₁x, y² → y₁y, x → ½(x + x₁), y → ½(y + y₁).</p>
        <p className="fragment">Bila <b>gradien m</b> diketahui: {tex(T.grad)}. Untuk pusat (h, k): {tex(T.shift)}</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ kd, u }} build={buildTan} maxH={310} />
        <Ctl one>
          <Range label={T.ctl} value={u} min={T.min} max={T.max} step={T.step} onChange={setU} color={C.orange} shown={T.shown(u)} />
        </Ctl>
        <Read rows={[
          tex(raw`T(x_1,y_1)=(${nt(x1)},\,${nt(y1)})`),
          tex(raw`${lin2(A, B)}=${nt(K)}`),
          Math.abs(B) < 1e-6 ? tex(raw`\text{garis tegak: }x=${nt(K / A)}`) : tex(raw`m=-\dfrac AB=${nt(-A / B)}`),
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Parabola: definisi ═════════════════ */
type PD = { p: number; y: number; s: number };
const buildParDef: Build<PD> = (b, g) => {
  drawConic(b, () => ({ t: "p", h: 0, k: 0, a: g().p, b: 0, v: false }), COL.p);
  const F = (): Vec => (g().s >= 1 ? [g().p, 0] : OFF);
  dot(b, F, C.orange, 5, "F");
  seg(b, () => (g().s >= 1 ? [-g().p, -30] : OFF), () => (g().s >= 1 ? [-g().p, 30] : OFF), C.orange, 2, 3);
  note(b, () => (g().s >= 1 ? [-g().p + 0.15, 4.2] : OFF), () => "direktriks", C.orange);
  const P = (): Vec => [(g().y * g().y) / (4 * g().p), g().y];
  const on = () => g().s >= 2;
  dot(b, () => (on() ? P() : OFF), C.ink, 5, "P");
  seg(b, () => (on() ? P() : OFF), () => (on() ? F() : OFF), C.blue, 2.25);
  seg(b, () => (on() ? P() : OFF), () => (on() ? [-g().p, g().y] : OFF), C.orange, 2.25);
  dot(b, () => (on() ? [-g().p, g().y] : OFF), C.orange, 4, "D");
  seg(b, () => (g().s >= 3 ? [g().p, -2 * g().p] : OFF), () => (g().s >= 3 ? [g().p, 2 * g().p] : OFF), C.red, 2.25);
  note(b, () => (g().s >= 3 ? [g().p + 0.15, -2 * g().p - 0.2] : OFF), () => "latus rectum = 4p", C.red);
};

function ParabolaDef() {
  const ref = useRef<HTMLDivElement>(null);
  const s = useStep(ref);
  const [p, setP] = useState(1.5), [y, setY] = useState(2.5);
  const x = (y * y) / (4 * p), PF = Math.hypot(x - p, y), PD = x + p;
  return (
    <Frame
      innerRef={ref} eyebrow="Parabola" title="Definisi dan unsur"
      copy={<>
        <p>Parabola adalah himpunan titik yang jaraknya ke <b>fokus F</b> sama dengan jaraknya ke <b>direktriks</b> (garis tetap).</p>
        <p className="fragment">Puncak O(0, 0), fokus F(p, 0), direktriks x = −p, sumbu simetri y = 0.</p>
        <p className="fragment">Geser P: PF dan PD selalu sama. PF = PD → {tex(raw`\sqrt{(x-p)^2+y^2}=x+p`)} → {tex(raw`y^2=4px`)}.</p>
        <p className="fragment">Tali busur lewat fokus tegak lurus sumbu: <b>latus rectum</b>, panjang 4p.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ p, y, s }} build={buildParDef} maxH={320} />
        <Ctl>
          <Range label={<>Parameter {tex("p")}</>} value={p} min={0.5} max={3} step={0.5} onChange={setP} color={C.teal} />
          <Range label={<>Ordinat P</>} value={y} min={-4.5} max={4.5} step={0.1} onChange={setY} color={C.ink} shown={fmt(y, 1)} />
        </Ctl>
        <Read rows={[
          tex(raw`y^2=4px=${nt(4 * p)}x\qquad F(${nt(p)},0)`),
          s >= 2 ? tex(raw`PF=${nt(PF)}\ =\ PD=${nt(PD)}`) : <span style={{ color: C.mute }}>Tekan → untuk memunculkan titik P.</span>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Parabola: persamaan umum ═════════════════ */
const buildParGen: Build<{ c: Cn }> = (b, g) => {
  const c = () => g().c;
  drawConic(b, c, COL.p);
  seg(b, () => G(c(), -30, 0), () => G(c(), 30, 0), C.soft, 1.5, 3);
  seg(b, () => G(c(), -c().a, -30), () => G(c(), -c().a, 30), C.orange, 2, 3);
  seg(b, () => G(c(), c().a, -2 * Math.abs(c().a)), () => G(c(), c().a, 2 * Math.abs(c().a)), C.red, 2);
  dot(b, () => G(c(), c().a, 0), C.orange, 5, "F");
  dot(b, () => G(c(), 0, 0), C.ink, 5, "V");
};

function ParabolaGen() {
  const [o, setO] = useState("r");
  const [S, set] = useState({ h: 1, k: -1, p: 1.5 });
  const up = (k: "h" | "k" | "p") => (v: number) => set((s) => ({ ...s, [k]: v }));
  const vert = o === "u" || o === "d", sgn = o === "r" || o === "u" ? 1 : -1;
  const c: Cn = { t: "p", h: S.h, k: S.k, a: sgn * S.p, b: 0, v: vert };
  const F = G(c, c.a, 0);
  const eqn = vert ? raw`${sqr("x", S.h)}=${nt(4 * c.a)}${par("y", S.k)}` : raw`${sqr("y", S.k)}=${nt(4 * c.a)}${par("x", S.h)}`;
  const dir = vert ? `y=${nt(S.k - c.a)}` : `x=${nt(S.h - c.a)}`;
  const ax = vert ? `x=${nt(S.h)}` : `y=${nt(S.k)}`;
  return (
    <Frame
      eyebrow="Parabola" title="Persamaan dan unsur"
      copy={<>
        <p>Dengan puncak V(h, k), ada <b>empat</b> arah buka:</p>
        <div className="fragment">
          <table className="ds-table">
            <thead><tr><th>Arah</th><th>Persamaan</th><th>Fokus</th><th>Direktriks</th></tr></thead>
            <tbody>
              <tr><th>Kanan</th><td>{tex(raw`(y-k)^2=4p(x-h)`)}</td><td>{tex(raw`(h+p,k)`)}</td><td>{tex(raw`x=h-p`)}</td></tr>
              <tr><th>Kiri</th><td>{tex(raw`(y-k)^2=-4p(x-h)`)}</td><td>{tex(raw`(h-p,k)`)}</td><td>{tex(raw`x=h+p`)}</td></tr>
              <tr><th>Atas</th><td>{tex(raw`(x-h)^2=4p(y-k)`)}</td><td>{tex(raw`(h,k+p)`)}</td><td>{tex(raw`y=k-p`)}</td></tr>
              <tr><th>Bawah</th><td>{tex(raw`(x-h)^2=-4p(y-k)`)}</td><td>{tex(raw`(h,k-p)`)}</td><td>{tex(raw`y=k+p`)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="fragment">Yang <b>dikuadratkan</b> menentukan sumbu: y dikuadratkan → buka ke samping.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ c }} build={buildParGen} maxH={290} />
        <Chips value={o} onPick={setO} items={[{ v: "r", label: "Kanan" }, { v: "l", label: "Kiri" }, { v: "u", label: "Atas" }, { v: "d", label: "Bawah" }]} />
        <Ctl>
          <Range label={<>Puncak {tex("h")}</>} value={S.h} min={-3} max={3} step={1} onChange={up("h")} color={C.ink} />
          <Range label={<>Puncak {tex("k")}</>} value={S.k} min={-2} max={2} step={1} onChange={up("k")} color={C.ink} />
          <Range label={<>Parameter {tex("p")}</>} value={S.p} min={0.5} max={3} step={0.5} onChange={up("p")} color={C.teal} />
        </Ctl>
        <Read rows={[
          tex(eqn),
          tex(raw`F(${nt(F[0])},\,${nt(F[1])})\quad\text{direktriks }${dir}`),
          tex(raw`\text{sumbu simetri }${ax}\quad\text{latus rectum}=4p=${nt(4 * S.p)}`),
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Elips dan hiperbola: definisi ═════════════════ */
type ED = { a: number; b: number; t: number; s: number };
const buildEllDef: Build<ED> = (b, g) => {
  const c = (): Cn => ({ t: "e", h: 0, k: 0, a: g().a, b: Math.min(g().b, g().a), v: false });
  drawConic(b, c, COL.e);
  const F = (i: number) => (): Vec => (g().s >= 1 ? [i * foc(c()), 0] : OFF);
  dot(b, F(-1), C.orange, 5, "F₁"); dot(b, F(1), C.orange, 5, "F₂");
  seg(b, () => (g().s >= 1 ? [-g().a, 0] : OFF), () => (g().s >= 1 ? [g().a, 0] : OFF), C.soft, 1.5, 3);
  seg(b, () => (g().s >= 1 ? [0, -c().b] : OFF), () => (g().s >= 1 ? [0, c().b] : OFF), C.soft, 1.5, 3);
  const P = (): Vec => [g().a * Math.cos(rad(g().t)), c().b * Math.sin(rad(g().t))];
  const on = () => g().s >= 2;
  dot(b, () => (on() ? P() : OFF), C.ink, 5, "P");
  seg(b, () => (on() ? P() : OFF), () => (on() ? F(-1)() : OFF), C.blue, 2.25);
  seg(b, () => (on() ? P() : OFF), () => (on() ? F(1)() : OFF), C.orange, 2.25);
};

function EllipseDef() {
  const ref = useRef<HTMLDivElement>(null);
  const s = useStep(ref);
  const [S, set] = useState({ a: 5, b: 3, t: 50 });
  const a = S.a, b = Math.min(S.b, S.a), c = Math.sqrt(a * a - b * b);
  const P = [a * Math.cos(rad(S.t)), b * Math.sin(rad(S.t))];
  const d1 = Math.hypot(P[0] + c, P[1]), d2 = Math.hypot(P[0] - c, P[1]);
  return (
    <Frame
      innerRef={ref} eyebrow="Elips" title="Definisi"
      copy={<>
        <p>Elips adalah himpunan titik yang <b>jumlah</b> jaraknya ke dua titik tetap (fokus) selalu sama.</p>
        <p className="fragment">Fokus F₁(−c, 0) dan F₂(c, 0). Sumbu mayor 2a, sumbu minor 2b, dan {tex(raw`c^2=a^2-b^2`)}.</p>
        <p className="fragment">Geser P: PF₁ dan PF₂ berubah, tetapi <b>PF₁ + PF₂ = 2a</b> tetap.</p>
        <p className="fragment">Makin dekat fokus ke pusat (c kecil), elips makin mirip lingkaran.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...S, s }} build={buildEllDef} maxH={320} />
        <Ctl>
          <Range label={<>Setengah sumbu mayor {tex("a")}</>} value={a} min={2} max={6} step={0.5} onChange={(v) => set((o) => ({ ...o, a: v }))} color={C.violet} />
          <Range label={<>Setengah sumbu minor {tex("b")}</>} value={b} min={1} max={a} step={0.5} onChange={(v) => set((o) => ({ ...o, b: v }))} color={C.violet} />
          <Range label="Letak titik P" value={S.t} min={0} max={355} step={5} onChange={(v) => set((o) => ({ ...o, t: v }))} color={C.ink} shown={`${S.t}°`} />
        </Ctl>
        <Read rows={[
          tex(raw`c=\sqrt{a^2-b^2}=${nt(c)}\qquad 2a=${nt(2 * a)}`),
          s >= 2 ? tex(raw`PF_1+PF_2=${nt(d1)}+${nt(d2)}=${nt(d1 + d2)}`) : <span style={{ color: C.mute }}>Tekan → dua kali untuk memunculkan titik P.</span>,
        ]} />
      </>}
    />
  );
}

type HD = { a: number; b: number; y: number; sg: number; s: number };
const buildHypDef: Build<HD> = (b, g) => {
  const c = (): Cn => ({ t: "h", h: 0, k: 0, a: g().a, b: g().b, v: false });
  drawConic(b, c, COL.h);
  const F = (i: number) => (): Vec => (g().s >= 1 ? [i * foc(c()), 0] : OFF);
  dot(b, F(-1), C.orange, 5, "F₁"); dot(b, F(1), C.orange, 5, "F₂");
  [1, -1].forEach((sg) => dot(b, () => (g().s >= 1 ? [sg * g().a, 0] : OFF), C.ink, 4));
  const P = (): Vec => [g().sg * g().a * Math.sqrt(1 + (g().y / g().b) ** 2), g().y];
  const on = () => g().s >= 2;
  dot(b, () => (on() ? P() : OFF), C.ink, 5, "P");
  seg(b, () => (on() ? P() : OFF), () => (on() ? F(-1)() : OFF), C.blue, 2.25);
  seg(b, () => (on() ? P() : OFF), () => (on() ? F(1)() : OFF), C.orange, 2.25);
};

function HyperbolaDef() {
  const ref = useRef<HTMLDivElement>(null);
  const s = useStep(ref);
  const [S, set] = useState({ a: 3, b: 2, y: 1.5, sg: 1 });
  const c = Math.hypot(S.a, S.b);
  const P = [S.sg * S.a * Math.sqrt(1 + (S.y / S.b) ** 2), S.y];
  const d1 = Math.hypot(P[0] + c, P[1]), d2 = Math.hypot(P[0] - c, P[1]);
  return (
    <Frame
      innerRef={ref} eyebrow="Hiperbola" title="Definisi"
      copy={<>
        <p>Hiperbola adalah himpunan titik yang <b>selisih</b> jaraknya ke dua titik tetap (fokus) selalu sama, yaitu 2a.</p>
        <p className="fragment">Fokus F₁(−c, 0), F₂(c, 0); puncak (±a, 0); {tex(raw`c^2=a^2+b^2`)}.</p>
        <p className="fragment">Geser P ke kedua cabang: <b>|PF₁ − PF₂| = 2a</b> tetap.</p>
        <p className="fragment">Elips: <i>jumlah</i> jarak tetap. Hiperbola: <i>selisih</i> jarak tetap.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...S, s }} build={buildHypDef} maxH={320} />
        <Chips value={S.sg} onPick={(v) => set((o) => ({ ...o, sg: v }))} items={[{ v: 1, label: "Cabang kanan" }, { v: -1, label: "Cabang kiri" }]} />
        <Ctl>
          <Range label={<>Setengah sumbu transversal {tex("a")}</>} value={S.a} min={2} max={3.5} step={0.5} onChange={(v) => set((o) => ({ ...o, a: v }))} color={C.red} />
          <Range label={<>Setengah sumbu sekawan {tex("b")}</>} value={S.b} min={1.5} max={4} step={0.5} onChange={(v) => set((o) => ({ ...o, b: v }))} color={C.red} />
          <Range label="Ordinat P" value={S.y} min={-3} max={3} step={0.1} onChange={(v) => set((o) => ({ ...o, y: v }))} color={C.ink} shown={fmt(S.y, 1)} />
        </Ctl>
        <Read rows={[
          tex(raw`c=\sqrt{a^2+b^2}=${nt(c)}\qquad 2a=${nt(2 * S.a)}`),
          s >= 2 ? tex(raw`|PF_1-PF_2|=|${nt(d1)}-${nt(d2)}|=${nt(Math.abs(d1 - d2))}`) : <span style={{ color: C.mute }}>Tekan → dua kali untuk memunculkan titik P.</span>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Elips / hiperbola: persamaan, unsur (asimtot) ═════════════════ */
const buildCtr: Build<{ c: Cn }> = (b, g) => {
  const c = () => g().c, f = () => foc(c());
  drawConic(b, c, COL[c().t]);
  seg(b, () => G(c(), -30, 0), () => G(c(), 30, 0), C.soft, 1.5, 3);
  seg(b, () => G(c(), 0, -30), () => G(c(), 0, 30), C.soft, 1.5, 3);
  [1, -1].forEach((sg) => seg(b,
    () => (c().t === "h" ? G(c(), -20, (-sg * 20 * c().b) / c().a) : OFF),
    () => (c().t === "h" ? G(c(), 20, (sg * 20 * c().b) / c().a) : OFF), C.mute, 2, 3));
  [1, -1].forEach((sg, i) => dot(b, () => G(c(), sg * f(), 0), C.orange, 5, i ? "F₁" : "F₂"));
  [1, -1].forEach((sg) => dot(b, () => G(c(), sg * c().a, 0), C.ink, 4));
  [1, -1].forEach((sg) => dot(b, () => (c().t === "e" ? G(c(), 0, sg * c().b) : OFF), C.ink, 4));
  dot(b, () => G(c(), 0, 0), C.mute, 4);
};

function CenterForm({ kd }: { kd: "e" | "h" }) {
  const ell = kd === "e";
  const [o, setO] = useState("h");
  const [S, set] = useState({ h: 0, k: 0, a: ell ? 4 : 2, b: ell ? 2.5 : 1.5 });
  const up = (k: "h" | "k" | "a" | "b") => (v: number) => set((s) => ({ ...s, [k]: v }));
  const vert = o === "v", a = S.a, b = ell ? Math.min(S.b, S.a) : S.b;
  const c: Cn = { t: kd, h: S.h, k: S.k, a, b, v: vert };
  const f = foc(c), F1 = G(c, -f, 0), F2 = G(c, f, 0);
  const X = sqr("x", S.h), Y = sqr("y", S.k), [U, W] = vert ? [Y, X] : [X, Y];
  const num = vert ? a : b, den = vert ? b : a;
  return (
    <Frame
      eyebrow={ell ? "Elips" : "Hiperbola"} title={ell ? "Persamaan dan unsur" : "Persamaan, asimtot, eksentrisitas"}
      copy={ell ? (<>
        <p>Elips berpusat di P(h, k), sumbu mayor mendatar:</p>
        <p className="fragment">{tex(raw`\dfrac{(x-h)^2}{a^2}+\dfrac{(y-k)^2}{b^2}=1,\quad a>b`)}</p>
        <p className="fragment">Sumbu mayor tegak: tukar penyebutnya, a² di bawah (y − k)².</p>
        <p className="fragment"><b>Eksentrisitas</b> {tex(raw`e=\dfrac ca=\dfrac{\sqrt{a^2-b^2}}{a}`)}, selalu 0 &lt; e &lt; 1. Latus rectum {tex(raw`\dfrac{2b^2}{a}`)}.</p>
        <p className="ds-muted fragment">Lingkaran = elips dengan a = b, jadi e = 0.</p>
      </>) : (<>
        <p>Hiperbola berpusat di P(h, k), sumbu transversal mendatar:</p>
        <p className="fragment">{tex(raw`\dfrac{(x-h)^2}{a^2}-\dfrac{(y-k)^2}{b^2}=1`)}</p>
        <p className="fragment"><b>Asimtot</b>: garis yang didekati cabang hiperbola, {tex(raw`y-k=\pm\dfrac ba(x-h)`)}. Diperoleh dari ruas kanan = 0.</p>
        <p className="fragment">Eksentrisitas {tex(raw`e=\dfrac ca=\dfrac{\sqrt{a^2+b^2}}{a}`)}, selalu e &gt; 1. Makin besar e, cabang makin terbuka.</p>
        <p className="ds-muted fragment">Sumbu tegak: (y−k)²/a² − (x−h)²/b² = 1, asimtot y − k = ±(a/b)(x − h).</p>
      </>)}
      stage={<>
        <SimBoard bbox={BB} params={{ c }} build={buildCtr} maxH={285} />
        <Chips value={o} onPick={setO} items={[{ v: "h", label: ell ? "Sumbu mayor mendatar" : "Terbuka ke samping" }, { v: "v", label: ell ? "Sumbu mayor tegak" : "Terbuka ke atas-bawah" }]} />
        <Ctl>
          <Range label={<>Pusat {tex("h")}</>} value={S.h} min={-3} max={3} step={1} onChange={up("h")} color={C.ink} />
          <Range label={<>Pusat {tex("k")}</>} value={S.k} min={-2} max={2} step={1} onChange={up("k")} color={C.ink} />
          <Range label={<>{tex("a")}</>} value={a} min={ell ? 2 : 1} max={ell ? 4 : 3} step={0.5} onChange={up("a")} color={COL[kd]} />
          <Range label={<>{tex("b")}</>} value={b} min={1} max={ell ? a : 3} step={0.5} onChange={up("b")} color={COL[kd]} />
        </Ctl>
        <Read rows={[
          tex(raw`\dfrac{${U}}{${nt(a * a)}}${ell ? "+" : "-"}\dfrac{${W}}{${nt(b * b)}}=1`),
          tex(raw`c=\sqrt{${ell ? "a^2-b^2" : "a^2+b^2"}}=${nt(f)}\quad e=\dfrac ca=${nt(f / a)}`),
          tex(raw`F_1(${nt(F1[0])},\,${nt(F1[1])})\quad F_2(${nt(F2[0])},\,${nt(F2[1])})`),
          ...(ell ? [] : [tex(raw`\text{asimtot }${par("y", S.k)}=\pm\dfrac{${nt(num)}}{${nt(den)}}${par("x", S.h)}`)]),
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Eksentrisitas: satu aturan untuk semua ═════════════════ */
const LL = 2;
const E_PRE = [0.6, 0, 0.6, 1, 2];
function polar(e: number): Vec[] {
  const o: Vec[] = [], N = 720;
  let gap = false;
  for (let i = 0; i <= N; i++) {
    const th = (2 * Math.PI * i) / N, den = 1 + e * Math.cos(th), r = LL / den;
    if (Math.abs(den) < 0.04 || Math.abs(r) > 60) { if (!gap) { o.push([NaN, NaN]); gap = true; } continue; }
    gap = false; o.push([r * Math.cos(th), r * Math.sin(th)]);
  }
  return o;
}
const buildEcc: Build<{ e: number; t: number }> = (b, g) => {
  shape(b, () => polar(g().e), { strokeColor: C.ink, strokeWidth: 3 }, false);
  dot(b, () => [0, 0], C.orange, 6, "F");
  const D = (): number | null => (g().e > 0.05 ? LL / g().e : null);
  seg(b, () => (D() === null ? OFF : [D() as number, -30]), () => (D() === null ? OFF : [D() as number, 30]), C.orange, 2, 3);
  const P = (): Vec | null => {
    const den = 1 + g().e * Math.cos(rad(g().t));
    return Math.abs(den) < 0.08 ? null : [(LL / den) * Math.cos(rad(g().t)), (LL / den) * Math.sin(rad(g().t))];
  };
  dot(b, () => P() ?? OFF, C.violet, 5, "P");
  seg(b, () => P() ?? OFF, () => (P() ? [0, 0] : OFF), C.blue, 2.25);
  seg(b, () => P() ?? OFF, () => { const p = P(), d = D(); return p && d !== null ? [d, p[1]] : OFF; }, C.orange, 2.25);
};

function Eccentricity() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [e, setE] = useState(0.6), [t, setT] = useState(60);
  useEffect(() => { setE(E_PRE[Math.min(step, 4)]); }, [step]);
  const et = useTween(e, 600);
  const kind = e < 0.025 ? 0 : Math.abs(e - 1) < 0.025 ? 2 : e < 1 ? 1 : 3;
  const den = 1 + et * Math.cos(rad(t)), r = LL / den, px = r * Math.cos(rad(t));
  const ok = Math.abs(den) > 0.08 && et > 0.05;
  const PF = Math.abs(r), PD = Math.abs(LL / et - px);
  return (
    <Frame
      innerRef={ref} eyebrow="Eksentrisitas" title="Satu aturan untuk semua"
      copy={<>
        <p>Titik P berjarak PF ke fokus dan PD ke direktriks. Kurva ditentukan oleh perbandingan <b>PF : PD = e</b>.</p>
        <p className="fragment">e = 0 → <b>lingkaran</b> (direktriks di tak hingga).</p>
        <p className="fragment">0 &lt; e &lt; 1 → <b>elips</b>.</p>
        <p className="fragment">e = 1 → <b>parabola</b>: PF = PD.</p>
        <p className="fragment">e &gt; 1 → <b>hiperbola</b>, dua cabang.</p>
      </>}
      stage={<>
        <SimBoard bbox={BE} params={{ e: et, t }} build={buildEcc} maxH={320} />
        <Ctl>
          <Range label={<>Eksentrisitas {tex("e")}</>} value={e} min={0} max={3} step={0.05} onChange={setE} color={C.orange} shown={fmt(e, 2)} />
          <Range label="Letak titik P" value={t} min={0} max={355} step={5} onChange={setT} color={C.ink} shown={`${t}°`} />
        </Ctl>
        <Read rows={[
          <><b style={{ color: NCOL[kind] }}>{NAMES[kind]}</b> · {tex(raw`e=${nt(et)}`)}</>,
          ok ? tex(raw`PF=${nt(PF)}\quad PD=${nt(PD)}\quad\dfrac{PF}{PD}=${nt(PF / PD)}`) : <span style={{ color: C.mute }}>{et <= 0.05 ? "Pada e = 0 direktriks berada di tak hingga." : "Geser P untuk melihat perbandingannya."}</span>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Ringkasan ═════════════════ */
function Summary() {
  const rows: [string, string, string, string, string][] = [
    ["Lingkaran", raw`x^2+y^2=r^2`, "0", raw`x_1x+y_1y=r^2`, "—"],
    ["Parabola", raw`y^2=4px`, "1", raw`y_1y=2p(x+x_1)`, raw`x=-p`],
    ["Elips", raw`\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1`, raw`\dfrac ca<1`, raw`\dfrac{x_1x}{a^2}+\dfrac{y_1y}{b^2}=1`, raw`x=\pm\dfrac{a^2}{c}`],
    ["Hiperbola", raw`\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1`, raw`\dfrac ca>1`, raw`\dfrac{x_1x}{a^2}-\dfrac{y_1y}{b^2}=1`, raw`y=\pm\dfrac bax`],
  ];
  return (
    <Frame
      eyebrow="Ringkasan" title="Satu keluarga kurva"
      copy={<>
        <p>Semua irisan kerucut memenuhi <b>PF = e · PD</b>.</p>
        <p className="fragment">Kedudukan garis: substitusi y = mx + n, lalu periksa <b>diskriminan</b>.</p>
        <p className="fragment">Garis singgung: pakai <b>kaidah bagi adil</b> di titik T, atau <b>syarat D = 0</b> bila gradien diketahui.</p>
        <p className="fragment">{tex(raw`c^2=a^2-b^2\ (\text{elips}),\quad c^2=a^2+b^2\ (\text{hiperbola})`)}</p>
      </>}
      stage={
        <table className="ds-table" style={{ fontSize: 17 }}>
          <thead><tr><th>Kurva</th><th>Persamaan baku</th><th>e</th><th>Singgung di T(x₁, y₁)</th><th>Direktriks / asimtot</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}><th>{r[0]}</th><td>{tex(r[1])}</td><td>{r[2].length > 1 ? tex(r[2]) : r[2]}</td><td>{tex(r[3])}</td><td>{r[4] === "—" ? "—" : tex(r[4])}</td></tr>
            ))}
          </tbody>
        </table>
      }
    />
  );
}

/* ═════════════════ Susunan deck ═════════════════ */
export default function IrisanKerucutDeck() {
  return (
    <SlideDeck>
      <ConeSlide />
      <CircleDef />
      <LineSlide kd="c" />
      <TangentSlide kd="c" />
      <ParabolaDef />
      <ParabolaGen />
      <LineSlide kd="p" />
      <TangentSlide kd="p" />
      <EllipseDef />
      <CenterForm kd="e" />
      <LineSlide kd="e" />
      <TangentSlide kd="e" />
      <HyperbolaDef />
      <CenterForm kd="h" />
      <LineSlide kd="h" />
      <TangentSlide kd="h" />
      <Eccentricity />
      <Summary />
      <Quiz eyebrow="Latihan" title="Kuis irisan kerucut" items={QUIZ} />
    </SlideDeck>
  );
}
