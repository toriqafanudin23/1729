/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  Btn, C, Chips, dot, fmt, Frame, mk, note, OFF, Range, seg, SimBoard, SlideDeck, still, useStep,
  type BBox, type Build, type Vec,
} from "./core";
import {
  axisSolution, boundary, consTxt, fill, gcd, K, lin, ln, n, ok, Quiz, region, solution, tex,
  type Cons, type QItem, type Sol,
} from "./LinearKit";

/* Deck "Pertidaksamaan linear" (Kelas X): garis bilangan → nilai mutlak → pecahan → daerah → sistem. */

const NONE = {};
const GRID: BBox = [-2, 10, 10, -2];
const COL5 = [C.blue, C.orange, C.violet, C.red, C.mute];

/* ═════════ 0 · Sampul: garis bergeser, daerahnya ikut ═════════ */
const BC: BBox = [-6, 6, 6, -6];
const buildCover: Build<object> = (b, _g, _s, clock) => {
  const c = () => 1 + 4 * Math.sin(clock() * 0.8);
  fill(b, () => region([K(1, 1, "<=", c())]), C.teal, 0.2);
  ln(b, () => [1, 1, c()], C.teal, 3);
  note(b, () => [-5.5, 5], () => `x + y ≤ ${fmt(c(), 1)}`, C.mute);
};
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi · Kelas X"
      title="Pertidaksamaan linear"
      copy={<>
        <p>Persamaan linear adalah <b>garis</b>. Pertidaksamaan linear adalah <b>daerah di satu sisi garis</b>.</p>
        <p className="ds-muted">Garis bergeser, dan daerah penyelesaiannya ikut bergerak.</p>
      </>}
      stage={<SimBoard bbox={BC} params={NONE} build={buildCover} loop />}
    />
  );
}

/* ═════════ 1 · Peta ═════════ */
function MapSlide() {
  return (
    <Frame
      eyebrow="Peta materi"
      title="Dari satu variabel ke daerah"
      copy={<>
        <p>Penyelesaian pertidaksamaan bukan satu titik, melainkan <b>banyak titik sekaligus</b>.</p>
        <p className="fragment">Satu variabel: <b>selang</b> pada garis bilangan.</p>
        <p className="fragment">Dua variabel: <b>daerah</b> pada bidang.</p>
      </>}
      stage={
        <table className="ds-table">
          <thead><tr><th>Materi</th><th>Penyelesaian berupa</th><th>Alat bantu</th></tr></thead>
          <tbody>
            <tr><th>PtLSV</th><td>selang</td><td>garis bilangan</td></tr>
            <tr><th>Nilai mutlak</th><td>satu atau dua selang</td><td>jarak ke nol, grafik V</td></tr>
            <tr><th>Pecahan</th><td>gabungan selang</td><td>tanda tiap interval</td></tr>
            <tr><th>Dua variabel</th><td>setengah bidang</td><td>titik uji</td></tr>
            <tr><th>Sistem</th><td>irisan daerah</td><td>garis batas + titik uji</td></tr>
          </tbody>
        </table>
      }
    />
  );
}

/* ═════════ 2 · Mengapa tanda dibalik? ═════════ */
const BFLIP: BBox = [-10, 2.5, 10, -2.5];
const buildFlip: Build<{ k: number }> = (b, g) => {
  seg(b, () => [-10, 1], () => [10, 1], C.line, 1.5);
  seg(b, () => [-10, -1], () => [10, -1], C.line, 1.5);
  ([[1, C.blue], [3, C.orange]] as [number, string][]).forEach(([v, col]) => {
    seg(b, () => [v, 1], () => [g().k * v, -1], col, 2, 2);
    dot(b, () => [v, 1], col, 6);
    dot(b, () => [g().k * v, -1], col, 6);
  });
  note(b, () => [-9.7, 1.3], () => "sebelum", C.mute);
  note(b, () => [-9.7, -1.8], () => "sesudah dikali k", C.mute);
};
function FlipSlide() {
  const [k, setK] = useState(2);
  const rel = k > 0 ? "<" : k < 0 ? ">" : "=";
  return (
    <Frame
      eyebrow="01 · PtLSV"
      title="Mengapa tanda dibalik?"
      copy={<>
        <p>Mulai dari <b style={{ color: C.blue }}>1</b> &lt; <b style={{ color: C.orange }}>3</b>. Kalikan keduanya dengan k.</p>
        <p className="fragment">k positif: urutannya <b>tetap</b>, tanda tetap.</p>
        <p className="fragment">k negatif: garis penghubung <b>bersilangan</b>. Urutannya terbalik, jadi tanda ikut dibalik.</p>
        <p className="fragment">Aturan: kali atau bagi dengan bilangan <b>negatif</b> → balik tanda.</p>
      </>}
      stage={<>
        <SimBoard bbox={BFLIP} params={{ k }} build={buildFlip} maxH={220} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("k")} value={k} min={-3} max={3} step={0.5} onChange={setK} color={C.violet} />
        </div>
        <div className="ds-read">
          1 &lt; 3 → {n(k)} {rel} {n(3 * k)}{" "}
          {k < 0 ? <span className="ds-bad">tanda dibalik!</span> : k === 0 ? "keduanya sama" : <span className="ds-ok">tanda tetap</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 3 · PtLSV pada garis bilangan ═════════ */
const BNUM: BBox = [-10, 2, 10, -2];
const NPS = [
  { t: "−2x + 5 ≤ 11", p: (x: number) => -2 * x + 5 <= 11 + 1e-9, crit: [-3], ans: "x ≥ −3", how: "÷(−2): tanda dibalik" },
  { t: "3x − 4 < 8", p: (x: number) => 3 * x - 4 < 8 - 1e-9, crit: [4], ans: "x < 4", how: "÷3: tanda tetap" },
  { t: "−3 < 2x − 1 ≤ 7", p: (x: number) => -3 < 2 * x - 1 - 1e-9 && 2 * x - 1 <= 7 + 1e-9, crit: [-1, 4], ans: "−1 < x ≤ 4", how: "+1 lalu ÷2 pada ketiga bagian" },
  { t: "(2x−1)/3 ≥ (x+2)/2", p: (x: number) => (2 * x - 1) / 3 >= (x + 2) / 2 - 1e-9, crit: [8], ans: "x ≥ 8", how: "×6 (positif): tanda tetap" },
];
const buildNum: Build<{ sol: Sol | null; t: number; good: boolean }> = (b, g) => {
  axisSolution(b, () => g().sol, 0, C.teal);
  dot(b, () => (g().good ? [g().t, 0] : OFF), C.green, 7);
  dot(b, () => (g().good ? OFF : [g().t, 0]), C.red, 7);
  note(b, () => [g().t - 0.6, 0.55], () => "uji", C.mute);
};
function NumberLineSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [pi, setPi] = useState(0), [t, setT] = useState(0);
  const it = NPS[pi], good = it.p(t);
  const sol = step >= 1 ? solution(it.p, it.crit) : null;
  return (
    <Frame
      innerRef={ref}
      eyebrow="01 · PtLSV"
      title="Penyelesaian berupa selang"
      copy={<>
        <p>Geser <b>titik uji</b>. Hijau berarti titik itu memenuhi pertidaksamaan, merah berarti tidak.</p>
        <p className="fragment">Selesaikan seperti persamaan untuk mendapat <b>batas</b>.</p>
        <p className="fragment">Tanda dibalik hanya bila kali atau bagi dengan bilangan negatif.</p>
        <p className="fragment">○ <b>tidak</b> termasuk (&lt; atau &gt;). ● <b>termasuk</b> (≤ atau ≥).</p>
      </>}
      stage={<>
        <SimBoard bbox={BNUM} params={{ sol, t, good }} build={buildNum} maxH={170} />
        <Chips value={pi} onPick={setPi} items={NPS.map((o, i) => ({ v: i, label: o.t }))} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex(String.raw`x\ \text{uji}`)} value={t} min={-10} max={10} step={0.5} onChange={setT} color={good ? C.green : C.red} />
        </div>
        <div className="ds-read">
          x = {n(t)}: <span className={good ? "ds-ok" : "ds-bad"}>{good ? "memenuhi ✓" : "tidak memenuhi ✗"}</span>
          {step >= 1 && <><br />Penyelesaian: <b>{it.ans}</b> ({it.how})</>}
        </div>
      </>}
    />
  );
}

/* ═════════ 4 · Nilai mutlak ═════════ */
const BABS: BBox = [-5, 10, 9, -3];
const absPred = (op: string, c: number) => (x: number) => {
  const v = Math.abs(2 * x - 3);
  return op === "=" ? Math.abs(v - c) < 1e-9 : op === "<" ? v < c - 1e-9 : v > c + 1e-9;
};
const absSol = (op: string, c: number) => solution(absPred(op, c), c >= 0 ? [(3 - c) / 2, (3 + c) / 2] : []);
const absText = (op: string, c: number) => {
  if (c < 0) return op === ">" ? "semua bilangan real" : "tidak ada penyelesaian";
  const lo = n((3 - c) / 2), hi = n((3 + c) / 2);
  if (c === 0) return op === "=" ? `x = ${lo}` : op === "<" ? "tidak ada penyelesaian" : `semua x, kecuali x = ${lo}`;
  return op === "=" ? `x = ${lo} atau x = ${hi}` : op === "<" ? `${lo} < x < ${hi}` : `x < ${lo} atau x > ${hi}`;
};
const buildAbs: Build<{ op: string; c: number; t: number }> = (b, g) => {
  const V = (x: number) => Math.abs(2 * x - 3);
  mk(b, "functiongraph", [V, -5, 9], { ...still, strokeColor: C.ink, strokeWidth: 3 });
  ln(b, () => [0, 1, g().c], C.orange, 2.5);
  axisSolution(b, () => absSol(g().op, g().c), 0, C.teal);
  const good = () => absPred(g().op, g().c)(g().t);
  seg(b, () => [g().t, 0], () => [g().t, V(g().t)], C.soft, 1.25, 2);
  dot(b, () => (good() ? [g().t, V(g().t)] : OFF), C.green, 6);
  dot(b, () => (good() ? OFF : [g().t, V(g().t)]), C.red, 6);
};
function AbsSlide() {
  const [op, setOp] = useState("<"), [c, setC] = useState(5), [t, setT] = useState(1);
  const good = absPred(op, c)(t);
  return (
    <Frame
      eyebrow="02 · Nilai mutlak"
      title="Jarak ke nol, dilihat dari grafik V"
      copy={<>
        <p>|u| adalah <b>jarak</b> u ke nol, sehingga grafik |2x − 3| berbentuk <b>V</b>.</p>
        <p className="fragment">{tex(String.raw`|u|=c\ \Rightarrow\ u=c\ \text{atau}\ u=-c`)}</p>
        <p className="fragment">{tex(String.raw`|u|<c\ \Rightarrow\ -c<u<c`)} (V di <b>bawah</b> garis).</p>
        <p className="fragment">{tex(String.raw`|u|>c\ \Rightarrow\ u<-c\ \text{atau}\ u>c`)} (V di <b>atas</b> garis).</p>
        <p className="ds-muted">Geser c ke bawah nol. Apa yang terjadi?</p>
      </>}
      stage={<>
        <SimBoard bbox={BABS} params={{ op, c, t }} build={buildAbs} maxH={290} />
        <Chips value={op} onPick={setOp} items={[{ v: "=", label: "|2x − 3| = c" }, { v: "<", label: "|2x − 3| < c" }, { v: ">", label: "|2x − 3| > c" }]} />
        <div className="ds-controls">
          <Range label={tex("c")} value={c} min={-2} max={8} step={0.5} onChange={setC} color={C.orange} />
          <Range label={tex(String.raw`x\ \text{uji}`)} value={t} min={-4} max={8} step={0.5} onChange={setT} color={good ? C.green : C.red} />
        </div>
        <div className="ds-read">
          Penyelesaian: <b>{absText(op, c)}</b><br />
          x = {n(t)} → |2x − 3| = {n(Math.abs(2 * t - 3))}: <span className={good ? "ds-ok" : "ds-bad"}>{good ? "memenuhi ✓" : "tidak memenuhi ✗"}</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 5 · Pertidaksamaan pecahan ═════════ */
type Rat = { t: string; z: number; p: number; op: "<" | ">="; ans: string };
const RAT: Rat[] = [
  { t: "(x+4)/(x−3) < 0", z: -4, p: 3, op: "<", ans: "−4 < x < 3" },
  { t: "(x−1)/(x+2) ≥ 0", z: 1, p: -2, op: ">=", ans: "x < −2 atau x ≥ 1" },
];
const ratPred = (r: Rat, x: number) => {
  if (Math.abs(x - r.p) < 1e-9) return false;
  const v = (x - r.z) / (x - r.p);
  return r.op === "<" ? v < -1e-9 : v >= -1e-9;
};
const BRAT: BBox = [-9, 8, 9, -8];
const buildRat: Build<{ r: Rat; t: number }> = (b, g) => {
  const f = (x: number) => (x - g().r.z) / (x - g().r.p);
  const st = { ...still, strokeColor: C.ink, strokeWidth: 3 };
  mk(b, "functiongraph", [f, -9, () => g().r.p - 0.03], st);
  mk(b, "functiongraph", [f, () => g().r.p + 0.03, 9], st);
  ln(b, () => [1, 0, g().r.p], C.red, 1.75, 3);
  axisSolution(b, () => solution((x) => ratPred(g().r, x), [g().r.z, g().r.p]), 0, C.teal);
  const good = () => ratPred(g().r, g().t);
  const P = (): Vec => (Math.abs(g().t - g().r.p) < 1e-9 ? OFF : [g().t, f(g().t)]);
  seg(b, () => (P() === OFF ? OFF : [g().t, 0]), () => P(), C.soft, 1.25, 2);
  dot(b, () => (good() ? P() : OFF), C.green, 6);
  dot(b, () => (good() ? OFF : P()), C.red, 6);
};
function RationalSlide() {
  const [ri, setRi] = useState(0), [t, setT] = useState(0);
  const r = RAT[ri], good = ratPred(r, t), den = Math.abs(t - r.p) < 1e-9;
  return (
    <Frame
      eyebrow="03 · Pertidaksamaan pecahan"
      title="Jangan kali silang"
      copy={<>
        <p>Pindahkan semua suku ke satu ruas, samakan penyebut, sehingga bentuknya <b>pecahan di satu sisi dan 0 di sisi lain</b>.</p>
        <p className="fragment">Cari <b>pembuat nol</b> pembilang dan penyebut. Kurva memotong sumbu-x di pembuat nol pembilang dan <b style={{ color: C.red }}>putus</b> di pembuat nol penyebut.</p>
        <p className="fragment">Periksa tanda tiap interval. Nol penyebut <b>tidak pernah</b> ikut.</p>
        <p className="ds-muted">Kali silang menganggap penyebut positif. Padahal bisa negatif.</p>
      </>}
      stage={<>
        <SimBoard bbox={BRAT} params={{ r, t }} build={buildRat} maxH={300} />
        <Chips value={ri} onPick={setRi} items={RAT.map((o, i) => ({ v: i, label: o.t }))} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex(String.raw`x\ \text{uji}`)} value={t} min={-9} max={9} step={0.5} onChange={setT} color={good ? C.green : C.red} />
        </div>
        <div className="ds-read">
          {den ? <span className="ds-bad">penyebut = 0: tidak terdefinisi, tidak ikut</span>
            : <>f({n(t)}) = {n((t - r.z) / (t - r.p))}: <span className={good ? "ds-ok" : "ds-bad"}>{good ? "memenuhi ✓" : "tidak memenuhi ✗"}</span></>}
          <br />Penyelesaian: <b>{r.ans}</b>
        </div>
      </>}
    />
  );
}

/* ═════════ 6 · Satu pertidaksamaan, dua variabel ═════════ */
const B2V: BBox = [-4, 10, 10, -4];
const HP = [
  { t: "2x + 3y ≤ 12", k: K(2, 3, "<=", 12) },
  { t: "y ≥ 2x", k: K(-2, 1, ">=", 0) },
  { t: "x ≥ 3", k: K(1, 0, ">=", 3) },
  { t: "y < 2", k: K(0, 1, "<", 2) },
];
const buildHalf: Build<{ k: Cons; px: number; py: number; tp: Vec | null; show: boolean }> = (b, g) => {
  fill(b, () => (g().show ? region([g().k]) : null), C.teal, 0.22);
  boundary(b, () => g().k, C.teal, 3);
  dot(b, () => g().tp ?? OFF, C.violet, 6);
  note(b, () => (g().tp ? [g().tp![0] + 0.3, g().tp![1] + 0.3] : OFF), () => "titik uji", C.violet);
  dot(b, () => (ok(g().k, g().px, g().py) ? [g().px, g().py] : OFF), C.green, 7);
  dot(b, () => (ok(g().k, g().px, g().py) ? OFF : [g().px, g().py]), C.red, 7);
};
function HalfPlaneSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [hi, setHi] = useState(0), [px, setPx] = useState(2), [py, setPy] = useState(3);
  const k = HP[hi].k;
  const tp: Vec = k.c === 0 ? [1, 0] : [0, 0];
  const tv = k.a * tp[0] + k.b * tp[1];
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · Dua variabel"
      title="Daerah di satu sisi garis"
      copy={<>
        <p>Garis batas membagi bidang menjadi <b>dua sisi</b>. Hanya satu sisi yang memenuhi.</p>
        <p className="fragment"><b>Titik uji</b> (biasanya (0, 0)) menentukan sisinya. Jika titik asal ada <b>pada</b> garis, ambil titik lain.</p>
        <p className="fragment">Daerah penyelesaian diarsir. ≤ ≥ → garis <b>penuh</b>, &lt; &gt; → garis <b>putus-putus</b>.</p>
        <p className="ds-muted">Titik hijau memenuhi, merah tidak.</p>
      </>}
      stage={<>
        <SimBoard bbox={B2V} params={{ k, px, py, tp: step >= 1 ? tp : null, show: step >= 2 }} build={buildHalf} maxH={300} />
        <Chips value={hi} onPick={setHi} items={HP.map((o, i) => ({ v: i, label: o.t }))} />
        <div className="ds-controls">
          <Range label={tex("x")} value={px} min={-4} max={10} onChange={setPx} color={C.ink} />
          <Range label={tex("y")} value={py} min={-4} max={10} onChange={setPy} color={C.ink} />
        </div>
        <div className="ds-read">
          ({px}, {py}): <span className={ok(k, px, py) ? "ds-ok" : "ds-bad"}>{ok(k, px, py) ? "memenuhi ✓" : "tidak memenuhi ✗"}</span>
          {step >= 1 && <><br />Uji ({tp[0]}, {tp[1]}): {n(tv)} {k.op === "<=" ? "≤" : k.op === ">=" ? "≥" : k.op} {n(k.c)} → {ok(k, tp[0], tp[1]) ? "benar, daerah memuat titik uji" : "salah, daerah di sisi seberang"}</>}
        </div>
      </>}
    />
  );
}

/* ═════════ 7 · Sistem pertidaksamaan ═════════ */
const SY = [
  { t: "Segitiga", cons: [K(1, 1, "<=", 6), K(1, 0, ">=", 0), K(0, 1, ">=", 0)] },
  { t: "Segi empat", cons: [K(2, 1, "<=", 8), K(1, 2, "<=", 8), K(1, 0, ">=", 0), K(0, 1, ">=", 0)] },
  { t: "Garis putus-putus", cons: [K(1, 1, "<", 8), K(-1, 1, ">", -2), K(1, 0, ">=", 0), K(0, 1, ">=", 0)] },
];
const buildSysIneq: Build<{ cons: Cons[]; nc: number }> = (b, g) => {
  fill(b, () => (g().nc > 0 ? region(g().cons.slice(0, g().nc)) : null), C.teal, 0.28);
  COL5.forEach((c, i) => boundary(b, () => (i < g().nc ? g().cons[i] ?? null : null), c, i < 2 ? 2.75 : 2));
};
function SystemSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [pi, setPi] = useState(0), [nc, setNc] = useState(0);
  useEffect(() => setNc(step), [step]);
  const cons = SY[pi].cons, shown = Math.min(nc, cons.length);
  return (
    <Frame
      innerRef={ref}
      eyebrow="05 · Sistem pertidaksamaan"
      title="Irisan semua daerah"
      copy={<>
        <p>Penyelesaian sistem adalah titik yang memenuhi <b>semua</b> pertidaksamaan sekaligus.</p>
        <p className="fragment">Pertidaksamaan pertama: satu setengah-bidang.</p>
        <p className="fragment">Tambahkan yang kedua: daerahnya <b>menyempit</b>.</p>
        <p className="fragment">Tambahkan syarat berikutnya, misalnya x ≥ 0 dan y ≥ 0. Sisa daerah yang tumpang tindih itulah jawabannya.</p>
      </>}
      stage={<>
        <SimBoard bbox={GRID} params={{ cons, nc: shown }} build={buildSysIneq} maxH={310} />
        <div className="ds-row">
          <Chips value={pi} onPick={(i) => { setPi(i); setNc(9); }} items={SY.map((o, i) => ({ v: i, label: o.t }))} />
          <Btn onClick={() => setNc(9)}>Tampilkan semua</Btn>
        </div>
        <div className="ds-read">
          {shown === 0 ? "Tekan → untuk menambah satu pertidaksamaan." : cons.slice(0, shown).map((k, i) => (
            <div key={i} style={{ color: COL5[i] }}>{consTxt(k)}</div>
          ))}
        </div>
      </>}
    />
  );
}

/* ═════════ 8 · Dari gambar ke pertidaksamaan ═════════ */
const buildIcpt: Build<{ p: number; q: number }> = (b, g) => {
  fill(b, () => [[0, 0], [g().p, 0], [0, g().q]], C.teal, 0.2);
  ln(b, () => [g().q, g().p, g().p * g().q], C.teal, 3);
  dot(b, () => [g().p, 0], C.red, 6);
  dot(b, () => [0, g().q], C.red, 6);
  note(b, () => [g().p + 0.2, 0.3], () => `(${g().p}, 0)`, C.red);
  note(b, () => [0.3, g().q + 0.3], () => `(0, ${g().q})`, C.red);
};
function FromPictureSlide() {
  const [p, setP] = useState(6), [q, setQ] = useState(4);
  const g = gcd(p, q), a = q / g, bb = p / g, c = (p * q) / g;
  return (
    <Frame
      eyebrow="05 · Sistem pertidaksamaan"
      title="Dari gambar ke pertidaksamaan"
      copy={<>
        <p>Garis melalui <b>(p, 0)</b> dan <b>(0, q)</b> memiliki persamaan:</p>
        <p className="ds-math">{tex(String.raw`qx+py=pq`)}</p>
        <p className="fragment">Bagi dengan faktor persekutuan agar sederhana.</p>
        <p className="fragment">Titik asal (0, 0) ada di daerah yang diarsir, dan 0 ≤ c, sehingga tandanya <b>≤</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={GRID} params={{ p, q }} build={buildIcpt} maxH={300} />
        <div className="ds-controls">
          <Range label={tex("p")} value={p} min={1} max={9} onChange={setP} color={C.red} />
          <Range label={tex("q")} value={q} min={1} max={9} onChange={setQ} color={C.red} />
        </div>
        <div className="ds-read">
          {q}x + {p}y = {p * q} → <b>{lin(a, bb)} = {n(c)}</b><br />
          Daerah diarsir: <b>{lin(a, bb)} ≤ {n(c)}</b>, x ≥ 0, y ≥ 0
        </div>
      </>}
    />
  );
}

/* ═════════ 9 · Latihan: letakkan titik di daerah ═════════ */
const PLS: Cons[][] = [
  [K(1, 1, "<=", 6), K(1, 0, ">=", 0), K(0, 1, ">=", 0)],
  [K(2, 1, "<=", 8), K(1, 0, ">=", 1), K(0, 1, ">=", 1)],
  [K(1, 2, "<=", 10), K(1, -1, "<=", 2), K(1, 0, ">=", 0), K(0, 1, ">=", 1)],
  [K(1, 1, "<", 8), K(-1, 1, ">", 0), K(1, 0, ">=", 0)],
];
const buildPlace: Build<{ cons: Cons[]; px: number; py: number; show: boolean }> = (b, g) => {
  const all = () => g().cons.every((k) => ok(k, g().px, g().py));
  fill(b, () => (g().show ? region(g().cons) : null), C.teal, 0.25);
  COL5.forEach((c, i) => boundary(b, () => g().cons[i] ?? null, c, 2.5));
  dot(b, () => (all() ? [g().px, g().py] : OFF), C.green, 8);
  dot(b, () => (all() ? OFF : [g().px, g().py]), C.red, 8);
};
function PlaceSlide() {
  const [idx, setIdx] = useState(0), [px, setPx] = useState(0), [py, setPy] = useState(0), [show, setShow] = useState(false);
  const cons = PLS[idx % PLS.length];
  const all = cons.every((k) => ok(k, px, py));
  return (
    <Frame
      eyebrow="Latihan 1"
      title="Letakkan titik di daerah penyelesaian"
      copy={<>
        <p>Geser titik sampai <b>semua</b> pertidaksamaan terpenuhi (semuanya ✓).</p>
        <p className="fragment">Tekan <b>Periksa</b> untuk melihat daerah yang diarsir.</p>
        <p className="fragment">Titik pada garis putus-putus <b>tidak</b> termasuk daerah.</p>
        <p className="ds-muted">Soal {(idx % PLS.length) + 1} dari {PLS.length}</p>
      </>}
      stage={<>
        <SimBoard bbox={GRID} params={{ cons, px, py, show }} build={buildPlace} maxH={290} />
        <div className="ds-controls">
          <Range label={tex("x")} value={px} min={-2} max={10} onChange={setPx} color={C.ink} />
          <Range label={tex("y")} value={py} min={-2} max={10} onChange={setPy} color={C.ink} />
        </div>
        <div className="ds-read">
          {cons.map((k, i) => (
            <div key={i} className={ok(k, px, py) ? "ds-ok" : "ds-bad"}>{ok(k, px, py) ? "✓" : "✗"} {consTxt(k)}</div>
          ))}
          <Btn onClick={() => setShow(true)}>Periksa</Btn>{" "}
          <Btn onClick={() => { setIdx(idx + 1); setPx(0); setPy(0); setShow(false); }}>Soal berikutnya</Btn>
          {show && <> <span className={all ? "ds-ok" : "ds-bad"}>{all ? "Tepat! Titik di dalam daerah." : "Belum: titik berada di luar daerah."}</span></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 10 · Latihan: kuis ═════════ */
const QUIZ: QItem[] = [
  {
    q: <>Penyelesaian {tex("5x-4\\le16")} adalah ....</>,
    opts: ["x ≤ 4", "x ≤ 3", "x ≤ 5", "x ≥ 4", "x ≥ 3"], ans: 0,
    why: <>5x ≤ 20 → x ≤ 4 (dibagi 5, positif, tanda tetap).</>,
  },
  {
    q: <>Penyelesaian {tex("-3x+6>15")} adalah ....</>,
    opts: ["x > −3", "x < −3", "x > 7", "x < 7", "x ≥ −3"], ans: 1,
    why: <>−3x &gt; 9, dibagi −3 → tanda dibalik: x &lt; −3.</>,
  },
  {
    q: <>Titik yang termasuk daerah penyelesaian {tex("x+y\\le8,\\ x\\ge0,\\ y\\ge0")} adalah ....</>,
    opts: ["(−1, 3)", "(3, 6)", "(5, 4)", "(7, 2)", "(4, 4)"], ans: 4,
    why: <>(4, 4): 4 + 4 = 8 ≤ 8 ✓. Titik lain melanggar x ≥ 0 atau x + y ≤ 8.</>,
    viz: { bbox: [-3, 10, 10, -3], cons: [K(1, 1, "<=", 8), K(1, 0, ">=", 0), K(0, 1, ">=", 0)], pts: [[-1, 3], [3, 6], [5, 4], [7, 2]], mark: [4, 4] },
  },
  {
    q: <>Banyak bilangan bulat x yang memenuhi {tex("-5<2x+1\\le9")} adalah ....</>,
    opts: ["4", "5", "6", "7", "8"], ans: 3,
    why: <>−6 &lt; 2x ≤ 8 → −3 &lt; x ≤ 4, yaitu x = −2, −1, …, 4: ada 7 bilangan.</>,
  },
  {
    q: <>Himpunan penyelesaian {tex(String.raw`\dfrac{2x+1}{x-3}<1`)} adalah ....</>,
    opts: ["x < −4 atau x > 3", "x > −4", "x < 3", "−4 < x < 3", "x ≤ −4 atau x > 3"], ans: 3,
    why: <>Menjadi (x + 4)/(x − 3) &lt; 0. Pembuat nol −4 dan 3, dan tandanya negatif di antaranya.</>,
  },
  {
    q: <>Banyak bilangan bulat x yang memenuhi {tex("|3x+2|\\le7")} adalah ....</>,
    opts: ["3", "4", "5", "6", "7"], ans: 2,
    why: <>−7 ≤ 3x + 2 ≤ 7 → −3 ≤ x ≤ 5/3, yaitu x = −3, −2, −1, 0, 1: ada 5.</>,
  },
  {
    q: <>Banyak pasangan bilangan bulat (x, y) dengan {tex("x+y\\le10,\\ x\\ge2,\\ y\\ge3")} adalah ....</>,
    opts: ["15", "18", "21", "24", "28"], ans: 2,
    why: <>Untuk x = 2, 3, …, 7, banyak y berturut-turut 6, 5, 4, 3, 2, 1. Jumlahnya 21.</>,
    viz: { bbox: [-1, 12, 12, -1], cons: [K(1, 1, "<=", 10), K(1, 0, ">=", 2), K(0, 1, ">=", 3)] },
  },
  {
    q: <>Paket X: Rp20.000 + Rp2.000/GB. Paket Y: Rp50.000 + Rp1.000/GB. Pemakaian bulat minimum agar Y lebih murah adalah ....</>,
    opts: ["26 GB", "28 GB", "29 GB", "30 GB", "31 GB"], ans: 4,
    why: <>50 + g &lt; 20 + 2g → g &gt; 30. Bilangan bulat terkecil: 31 GB.</>,
  },
];

/* ═════════ 11 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Lima aturan yang perlu diingat"
      copy={<>
        <p>Pertidaksamaan = persamaan + <b>satu sisi</b>.</p>
        <p className="fragment">Selalu <b>uji satu titik</b> untuk memastikan arah daerah.</p>
        <p className="fragment">Kesalahan umum: lupa membalik tanda, kali silang pada pecahan, dan menukar garis penuh dengan putus-putus.</p>
      </>}
      stage={
        <table className="ds-table">
          <thead><tr><th>Situasi</th><th>Aturan</th></tr></thead>
          <tbody>
            <tr><th>Kali atau bagi negatif</th><td>balik tanda</td></tr>
            <tr><th>{tex("|u|<c")}</th><td>{tex("-c<u<c")}</td></tr>
            <tr><th>{tex("|u|>c")}</th><td>{tex("u<-c\\ \\text{atau}\\ u>c")}</td></tr>
            <tr><th>Pecahan</th><td>satu ruas = 0, uji tanda, penyebut tak ikut</td></tr>
            <tr><th>Dua variabel</th><td>garis batas + titik uji</td></tr>
            <tr><th>Sistem</th><td>irisan semua daerah</td></tr>
          </tbody>
        </table>
      }
    />
  );
}

export function PertidaksamaanDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <MapSlide />
      <FlipSlide />
      <NumberLineSlide />
      <AbsSlide />
      <RationalSlide />
      <HalfPlaneSlide />
      <SystemSlide />
      <FromPictureSlide />
      <PlaceSlide />
      <Quiz eyebrow="Latihan 2" title="Kuis cepat" items={QUIZ} />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default PertidaksamaanDeck;
