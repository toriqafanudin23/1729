/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  Btn, C, Chips, dot, fmt, Frame, mk, note, OFF, Range, seg, shape, SimBoard, SlideDeck, still, useStep,
  type BBox, type Build, type Vec,
} from "./core";
import {
  buildSys, cases, eq, KIND, lin, ln, MethodSlide, n, Quiz, solve, tex,
  type Abc, type MP, type QItem, type Sys,
} from "./LinearKit";

/* Deck "Sistem persamaan linear" (Kelas X): neraca → garis → titik potong → metode → soal cerita. */

const NONE = {};
const SQ: BBox = [-2, 9, 10, -3];
const B8: BBox = [-8, 8, 8, -8];
const sys = (a: Abc, b: Abc): Sys => [a, b];
const mp = (s: Sys, o: Partial<MP> = {}): MP => ({ s, show: 2, vx: null, hy: null, pt: true, lab: null, icpt: false, ...o });

/* ═════════ 0 · Sampul: garis berputar, titik potong ikut bergerak ═════════ */
const buildCover: Build<object> = (b, _g, _s, clock) => {
  const phi = () => ((40 + 32 * Math.sin(clock() * 0.9)) * Math.PI) / 180;
  const P: Vec = [2, 1];
  const X = (): Vec => {
    const u = [Math.cos(phi()), Math.sin(phi())];
    const s = (7 - P[0] - P[1]) / (u[0] + u[1]);
    return [P[0] + s * u[0], P[1] + s * u[1]];
  };
  ln(b, () => [1, 1, 7], C.blue, 3);
  seg(b, () => [P[0] - 30 * Math.cos(phi()), P[1] - 30 * Math.sin(phi())], () => [P[0] + 30 * Math.cos(phi()), P[1] + 30 * Math.sin(phi())], C.orange, 3);
  dot(b, () => P, C.mute, 5);
  dot(b, X, C.ink, 7);
  note(b, () => [X()[0] + 0.3, X()[1] + 0.3], () => `(${fmt(X()[0], 1)}; ${fmt(X()[1], 1)})`, C.ink);
};
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi · Kelas X"
      title="Sistem persamaan linear"
      copy={<>
        <p>Persamaan linear adalah <b>garis lurus</b>. Menyelesaikan sistem berarti mencari <b>titik yang dilalui semua garis sekaligus</b>.</p>
        <p className="ds-muted">Garis oranye berputar. Perhatikan ke mana titik potongnya bergerak.</p>
      </>}
      stage={<SimBoard bbox={SQ} params={NONE} build={buildCover} loop />}
    />
  );
}

/* ═════════ 1 · Peta materi ═════════ */
function MapSlide() {
  return (
    <Frame
      eyebrow="Peta materi"
      title="Dari satu bilangan ke tiga bilangan"
      copy={<>
        <p>Semua bagian materi ini punya satu gagasan yang sama.</p>
        <p className="fragment">Tiap persamaan linear adalah <b>garis</b>.</p>
        <p className="fragment">Menyelesaikan sistem berarti mencari <b>titik temu</b> garis-garisnya.</p>
      </>}
      stage={
        <table className="ds-table">
          <thead><tr><th>Materi</th><th>Yang dicari</th><th>Gambaran</th></tr></thead>
          <tbody>
            <tr><th>PLSV</th><td>satu bilangan x</td><td>neraca seimbang</td></tr>
            <tr><th>PLDV</th><td>pasangan (x, y)</td><td>satu garis</td></tr>
            <tr><th>SPLDV</th><td>pasangan untuk dua persamaan</td><td>titik potong dua garis</td></tr>
            <tr><th>SPLTV</th><td>tiga bilangan sekaligus</td><td>eliminasi bertahap</td></tr>
            <tr><th>Soal cerita</th><td>kalimat → persamaan</td><td>pemodelan</td></tr>
          </tbody>
        </table>
      }
    />
  );
}

/* ═════════ 2 · Linear atau bukan ═════════ */
const LB = [
  { t: "2x + y = 6", f: (x: number) => 6 - 2 * x, lin: true, why: "" },
  { t: "x − 2y = −4", f: (x: number) => (x + 4) / 2, lin: true, why: "" },
  { t: "x² + y = 5", f: (x: number) => 5 - x * x, lin: false, why: "x berpangkat 2" },
  { t: "xy = 6", f: (x: number) => 6 / x, lin: false, why: "dua variabel dikalikan" },
  { t: "1/x + y = 3", f: (x: number) => 3 - 1 / x, lin: false, why: "variabel ada di penyebut" },
];
const buildLB: Build<{ k: number }> = (b, g) => {
  const it = () => LB[g().k];
  const red = { ...still, strokeColor: C.red, strokeWidth: 3 };
  mk(b, "functiongraph", [(x: number) => (it().lin ? it().f(x) : NaN), -8, 8], { ...still, strokeColor: C.teal, strokeWidth: 3.25 });
  mk(b, "functiongraph", [(x: number) => (it().lin ? NaN : it().f(x)), -8, -0.04], red);
  mk(b, "functiongraph", [(x: number) => (it().lin ? NaN : it().f(x)), 0.04, 8], red);
};
function IsLinearSlide() {
  const [k, setK] = useState(0);
  const it = LB[k];
  return (
    <Frame
      eyebrow="01 · Persamaan linear"
      title="Linear atau bukan?"
      copy={<>
        <p>Tiap suku berupa <b>konstanta</b> atau konstanta × <b>satu variabel berpangkat satu</b>.</p>
        <p className="ds-math">{tex(String.raw`ax+b=0\qquad ax+by=c`)}</p>
        <p className="fragment">Grafiknya selalu <b style={{ color: C.teal }}>garis lurus</b>.</p>
        <p className="fragment">Pangkat dua, perkalian variabel, atau variabel di penyebut membuat grafiknya <b style={{ color: C.red }}>melengkung</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={B8} params={{ k }} build={buildLB} maxH={340} />
        <Chips value={k} onPick={setK} items={LB.map((o, i) => ({ v: i, label: o.t }))} />
        <div className="ds-read">
          <span className={it.lin ? "ds-ok" : "ds-bad"}>{it.lin ? "✓ Linear: grafiknya garis lurus" : `✗ Bukan linear: ${it.why}`}</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 3 · PLSV: prinsip neraca ═════════ */
const BAL: BBox = [-7, 7.2, 7, -1];
type NP = { a: number; b: number; c: number; x: number };
const buildBal: Build<NP> = (b, g) => {
  const Lv = () => g().a * g().x + g().b, Rv = () => g().c;
  const ang = () => Math.max(-0.38, Math.min(0.38, 0.025 * (Lv() - Rv())));
  const cy = 4.6, h = 4.4;
  const end = (s: number): Vec => [s * h * Math.cos(ang()), cy + s * h * Math.sin(ang())];
  shape(b, () => [[-0.8, 0], [0.8, 0], [0, cy]], { strokeColor: C.mute, fillColor: C.mute, fillOpacity: 0.15 });
  seg(b, () => [-2.2, 0], () => [2.2, 0], C.mute, 3);
  seg(b, () => end(-1), () => end(1), C.ink, 5);
  [-1, 1].forEach((s) => {
    const col = s < 0 ? C.blue : C.orange;
    const at = (dx: number, dy: number): Vec => [end(s)[0] + dx, end(s)[1] + dy];
    seg(b, () => end(s), () => at(-1.2, -1.7), C.soft, 1.5);
    seg(b, () => end(s), () => at(1.2, -1.7), C.soft, 1.5);
    shape(b, () => [at(-1.4, -1.7), at(1.4, -1.7), at(1.1, -2.2), at(-1.1, -2.2)], { strokeColor: col, fillColor: col, fillOpacity: 0.25 });
    note(b, () => at(-0.6, -1.3), () => n(s < 0 ? Lv() : Rv()), col);
    note(b, () => at(-0.9, 0.3), () => (s < 0 ? "ruas kiri" : "ruas kanan"), col);
  });
  note(b, () => (Math.abs(Lv() - Rv()) < 1e-9 ? [-1.4, 6.5] : OFF), () => "SEIMBANG ✓", C.green);
};
const BP = [{ a: 3, b: 5, c: 20 }, { a: 2, b: -4, c: 10 }, { a: 4, b: 2, c: 18 }];
function BalanceSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [pi, setPi] = useState(0);
  const [x, setX] = useState(1);
  const { a, b, c } = BP[pi];
  const sol = (c - b) / a;
  const L = a * x + b;
  useEffect(() => { if (step >= 3) setX(sol); }, [step, sol]);
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · PLSV"
      title="Neraca harus tetap seimbang"
      copy={<>
        <p>Apa pun yang dilakukan pada satu ruas <b>harus dilakukan juga pada ruas lain</b>.</p>
        <p className="ds-math">{tex(String.raw`ax+b=c`)}</p>
        <p className="fragment">Kurangi <b>b</b> di kedua ruas: {tex(String.raw`ax=c-b`)}</p>
        <p className="fragment">Bagi kedua ruas dengan <b>a</b>: {tex(String.raw`x=\dfrac{c-b}{a}`)}</p>
        <p className="fragment">Periksa: masukkan x ke persamaan awal. Neraca seimbang.</p>
      </>}
      stage={<>
        <SimBoard bbox={BAL} params={{ a, b, c, x }} build={buildBal} maxH={290} />
        <Chips value={pi} onPick={setPi} items={BP.map((o, i) => ({ v: i, label: `${lin(o.a, 0)} ${o.b < 0 ? "−" : "+"} ${n(Math.abs(o.b))} = ${n(o.c)}` }))} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("x")} value={x} min={-2} max={12} step={0.5} onChange={setX} color={C.ink} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.blue }}>kiri = {n(L)}</span> · <span style={{ color: C.orange }}>kanan = {n(c)}</span> ·{" "}
          {Math.abs(L - c) < 1e-9 ? <span className="ds-ok">seimbang ✓</span> : L > c ? "kiri lebih berat, kecilkan x" : "kanan lebih berat, besarkan x"}
          {step >= 1 && <><br />{lin(a, 0)} = {n(c)} {b < 0 ? "+" : "−"} {n(Math.abs(b))} = {n(c - b)}</>}
          {step >= 2 && <><br />x = {n(c - b)} ÷ {n(a)} = {n(sol)}</>}
        </div>
      </>}
    />
  );
}

/* ═════════ 4 · PLSV: tiga kemungkinan (dua ruas = dua garis) ═════════ */
const PL3 = [
  { t: "2x + 1 = 7", s: sys([2, -1, -1], [0, 1, 7]), alg: "2x = 6 → x = 3", lab: "x = 3" },
  { t: "2x + 1 = 2x + 4", s: sys([2, -1, -1], [2, -1, -4]), alg: "0 = 3 (salah)", lab: null },
  { t: "2(x + 1) − 1 = 2x + 1", s: sys([2, -1, -1], [2, -1, -1]), alg: "0 = 0 (benar)", lab: null },
];
const BPL: BBox = [-3, 10, 9, -2];
function ThreeSlide() {
  const [i, setI] = useState(0);
  const it = PL3[i], kd = KIND[solve(it.s).kind];
  const res = ["tepat satu penyelesaian", "tidak ada penyelesaian", "semua bilangan real"][i];
  return (
    <Frame
      eyebrow="02 · PLSV"
      title="Satu, nol, atau tak hingga"
      copy={<>
        <p>Gambarkan <b style={{ color: C.blue }}>ruas kiri</b> dan <b style={{ color: C.orange }}>ruas kanan</b> sebagai dua garis. Penyelesaian adalah x di titik temunya.</p>
        <p className="fragment">Berpotongan: <b>satu</b> x. Sejajar: <b>tidak ada</b>. Berimpit: <b>semua</b> x.</p>
        <p className="fragment">Di aljabar, ketiganya terlihat dari hasil akhir: <b>x = bilangan</b>, pernyataan <b>salah</b>, atau pernyataan <b>benar</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BPL} params={mp(it.s, { lab: it.lab })} build={buildSys} maxH={330} />
        <Chips value={i} onPick={setI} items={PL3.map((o, k) => ({ v: k, label: o.t }))} />
        <div className="ds-read">
          Hasil akhir: {it.alg}<br />
          <span style={{ color: kd.c }}>garis {kd.t} → {res}</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 5 · Contoh PLSV pecahan ═════════ */
const BFR: BBox = [-6, 4, 6, -2];
function FractionSlide() {
  return (
    <MethodSlide
      eyebrow="02 · PLSV · Contoh"
      title="Menghapus pecahan dengan KPK"
      head={String.raw`\dfrac{x+2}{3}-\dfrac{x-1}{4}=1`}
      sys={sys([1, -12, -11], [0, 1, 1])}
      bbox={BFR}
      copy={<>
        <p>Kalikan kedua ruas dengan <b>KPK penyebut</b> agar pecahan hilang.</p>
        <p className="fragment">KPK dari 3 dan 4 adalah <b>12</b>. Kalikan semua suku.</p>
        <p className="fragment">Buka kurung (hati-hati tanda minus), lalu sederhanakan.</p>
        <p className="fragment">Garis biru (ruas kiri) memotong garis oranye (ruas kanan) di <b>x = 1</b>.</p>
      </>}
      steps={[
        { tex: String.raw`\times 12:\ 4(x+2)-3(x-1)=12` },
        { tex: String.raw`4x+8-3x+3=12\ \Rightarrow\ x+11=12` },
        { tex: String.raw`x=1`, vx: 1, pt: true, lab: "x = 1" },
      ]}
    />
  );
}

/* ═════════ 6 · PLDV: satu garis ═════════ */
type LP1 = { a: number; b: number; c: number; t: number; sx: boolean; sy: boolean };
const buildLine: Build<LP1> = (b, g) => {
  ln(b, () => [g().a, g().b, g().c], C.teal, 3);
  const X = (): Vec => (g().sx && g().a !== 0 ? [g().c / g().a, 0] : OFF);
  const Y = (): Vec => (g().sy && g().b !== 0 ? [0, g().c / g().b] : OFF);
  dot(b, X, C.red, 6); dot(b, Y, C.red, 6);
  note(b, () => (X() === OFF ? OFF : [X()[0] + 0.3, -0.9]), () => `(${n(X()[0])}, 0)`, C.red);
  note(b, () => (Y() === OFF ? OFF : [0.3, Y()[1] + 0.3]), () => `(0, ${n(Y()[1])})`, C.red);
  dot(b, () => (g().b !== 0 ? [g().t, (g().c - g().a * g().t) / g().b] : OFF), C.orange, 6);
};
function LineSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [a, setA] = useState(2), [bb, setB] = useState(3), [c, setC] = useState(12), [t, setT] = useState(3);
  const y = bb !== 0 ? (c - a * t) / bb : NaN;
  return (
    <Frame
      innerRef={ref}
      eyebrow="03 · PLDV"
      title="Satu persamaan, tak hingga pasangan"
      copy={<>
        <p>{tex(String.raw`ax+by=c`)} punya <b>tak hingga</b> pasangan (x, y). Semuanya membentuk <b>satu garis</b>.</p>
        <p className="fragment">Titik potong sumbu-x: isi <b>y = 0</b>, diperoleh {tex(String.raw`x=\tfrac{c}{a}`)}.</p>
        <p className="fragment">Titik potong sumbu-y: isi <b>x = 0</b>, diperoleh {tex(String.raw`y=\tfrac{c}{b}`)}.</p>
        <p className="fragment">Dua titik cukup untuk menggambar garis. Gradiennya {tex(String.raw`m=-\tfrac{a}{b}`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={B8} params={{ a, b: bb, c, t, sx: step >= 1, sy: step >= 2 }} build={buildLine} maxH={300} />
        <div className="ds-controls">
          <Range label={tex("a")} value={a} min={-6} max={6} onChange={setA} color={C.teal} />
          <Range label={tex("b")} value={bb} min={-6} max={6} onChange={setB} color={C.teal} />
          <Range label={tex("c")} value={c} min={-12} max={24} onChange={setC} color={C.teal} />
          <Range label={tex("x\\ \\text{uji}")} value={t} min={-4} max={8} onChange={setT} color={C.orange} />
        </div>
        <div className="ds-read">
          {lin(a, bb)} = {n(c)} · gradien {bb !== 0 ? n(-a / bb) : "tidak ada (garis tegak)"}<br />
          {bb !== 0 ? <span style={{ color: C.orange }}>x = {n(t)} → y = {n(y)}: titik ini pada garis</span> : "b = 0: garisnya tegak"}
        </div>
      </>}
    />
  );
}

/* ═════════ 7 · SPLDV: tiga kemungkinan ═════════ */
const L1: Abc = [1, 2, 4];
const PRE: Record<string, Abc> = { satu: [2, -1, 3], nol: [2, 4, 7], banyak: [2, 4, 8] };
function KindSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [l2, setL2] = useState<Abc>(PRE.satu);
  useEffect(() => {
    if (step === 1) setL2(PRE.satu); else if (step === 2) setL2(PRE.nol); else if (step >= 3) setL2(PRE.banyak);
  }, [step]);
  const cur = Object.keys(PRE).find((k) => PRE[k].every((v, i) => v === l2[i])) ?? "";
  const s = sys(L1, l2), r = solve(s), kd = KIND[r.kind];
  const set = (i: number) => (v: number) => setL2((q) => q.map((w, j) => (j === i ? v : w)) as Abc);
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · SPLDV"
      title="Dua garis, tiga kemungkinan"
      copy={<>
        <p>Penyelesaian SPLDV adalah pasangan (x, y) yang memenuhi <b>kedua</b> persamaan sekaligus.</p>
        <p className="fragment"><b style={{ color: C.teal }}>Berpotongan</b>: tepat satu penyelesaian.</p>
        <p className="fragment"><b style={{ color: C.red }}>Sejajar</b>: tidak ada penyelesaian.</p>
        <p className="fragment"><b style={{ color: C.violet }}>Berimpit</b>: tak hingga penyelesaian.</p>
      </>}
      stage={<>
        <SimBoard bbox={SQ} params={mp(s)} build={buildSys} maxH={300} />
        <Chips value={cur} onPick={(k) => setL2(PRE[k])} items={[{ v: "satu", label: "berpotongan" }, { v: "nol", label: "sejajar" }, { v: "banyak", label: "berimpit" }]} />
        <div className="ds-controls">
          <Range label={tex(String.raw`a_2`)} value={l2[0]} min={-6} max={6} onChange={set(0)} color={C.orange} />
          <Range label={tex(String.raw`b_2`)} value={l2[1]} min={-6} max={6} onChange={set(1)} color={C.orange} />
          <Range label={tex(String.raw`c_2`)} value={l2[2]} min={-12} max={12} onChange={set(2)} color={C.orange} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.blue }}>{eq(L1)}</span> · <span style={{ color: C.orange }}>{eq(l2)}</span><br />
          <span style={{ color: kd.c }}>garis {kd.t}: {kd.s}</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 8 · Metode grafik ═════════ */
const GS: Sys[] = [sys([1, 1, 7], [1, -1, 1]), sys([2, 1, 8], [1, -1, 1]), sys([1, 2, 8], [3, -1, 3])];
const icp = (l: Abc) => `(${n(l[2] / l[0])}, 0) dan (0, ${n(l[2] / l[1])})`;
function GraphSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [gi, setGi] = useState(0);
  const s = GS[gi], r = solve(s);
  return (
    <Frame
      innerRef={ref}
      eyebrow="05 · SPLDV · Metode grafik"
      title="Gambar, lalu baca titik potongnya"
      copy={<>
        <p>Cari <b>dua titik potong sumbu</b> tiap garis, lalu hubungkan.</p>
        <p className="fragment">Garis pertama <b style={{ color: C.blue }}>biru</b>: titik potong sumbunya muncul.</p>
        <p className="fragment">Garis kedua <b style={{ color: C.orange }}>oranye</b>.</p>
        <p className="fragment">Titik potongnya adalah penyelesaian. <b>Periksa</b> di kedua persamaan.</p>
        <p className="ds-muted">Kurang teliti bila titik potong bukan bilangan bulat.</p>
      </>}
      stage={<>
        <SimBoard bbox={SQ} params={mp(s, { show: Math.min(2, step), pt: step >= 3, icpt: step >= 1 })} build={buildSys} maxH={320} />
        <Chips value={gi} onPick={setGi} items={GS.map((_, i) => ({ v: i, label: `Contoh ${i + 1}` }))} />
        <div className="ds-read">
          {step >= 1 && <><span style={{ color: C.blue }}>{eq(s[0])}: {icp(s[0])}</span><br /></>}
          {step >= 2 && <><span style={{ color: C.orange }}>{eq(s[1])}: {icp(s[1])}</span><br /></>}
          {step >= 3 && <span className="ds-ok">(x, y) = ({n(r.x)}, {n(r.y)}) · cek: {n(s[0][0] * r.x + s[0][1] * r.y)} = {n(s[0][2])} ✓ dan {n(s[1][0] * r.x + s[1][1] * r.y)} = {n(s[1][2])} ✓</span>}
          {step < 1 && "Tekan → untuk mulai menggambar."}
        </div>
      </>}
    />
  );
}

/* ═════════ 9 · Substitusi ═════════ */
const B9: BBox = [-2, 9, 10, -3];
const SubstitutionSlide = () => (
  <MethodSlide
    eyebrow="05 · SPLDV · Substitusi"
    title="Gantikan satu variabel"
    head={cases("x+y=7", "2x-y=5")}
    sys={sys([1, 1, 7], [2, -1, 5])}
    bbox={B9}
    copy={<>
      <p>Cocok bila ada koefisien <b>1</b> atau <b>−1</b>.</p>
      <p className="fragment">Nyatakan satu variabel dengan variabel lain: <b>y = 7 − x</b>.</p>
      <p className="fragment">Gantikan ke persamaan lain. Tinggal satu variabel, dan x ditemukan.</p>
      <p className="fragment">Kembalikan x ke persamaan awal untuk mendapat y.</p>
      <p className="ds-muted">Garis ungu putus-putus selalu melalui titik potong.</p>
    </>}
    steps={[
      { tex: String.raw`y=7-x` },
      { tex: String.raw`2x-(7-x)=5\Rightarrow 3x=12\Rightarrow x=4`, vx: 4 },
      { tex: String.raw`y=7-4=3`, hy: 3, pt: true },
    ]}
  />
);

/* ═════════ 10 · Eliminasi ═════════ */
const B10: BBox = [-4, 8, 10, -6];
const EliminationSlide = () => (
  <MethodSlide
    eyebrow="05 · SPLDV · Eliminasi"
    title="Hilangkan satu variabel"
    head={cases("2x+3y=13", "4x-y=5")}
    sys={sys([2, 3, 13], [4, -1, 5])}
    bbox={B10}
    copy={<>
      <p>Samakan koefisien (atau buat berlawanan tanda), lalu <b>jumlahkan atau kurangkan</b>.</p>
      <p className="fragment">Kalikan persamaan kedua dengan 3. <b>Semua suku</b>, termasuk konstanta, ikut dikali.</p>
      <p className="fragment">Jumlahkan: y habis, x = 2. Garis ungu tegak pada x = 2.</p>
      <p className="fragment">Substitusi balik x untuk memperoleh y.</p>
    </>}
    steps={[
      { tex: String.raw`\times 3:\ 12x-3y=15` },
      { tex: String.raw`(2x+3y)+(12x-3y)=13+15\Rightarrow 14x=28\Rightarrow x=2`, vx: 2 },
      { tex: String.raw`4(2)-y=5\Rightarrow y=3`, hy: 3, pt: true },
    ]}
  />
);

/* ═════════ 11 · Mesin eliminasi ═════════ */
const E1: Abc = [5, 3, 21], E2: Abc = [3, -2, 5];
const B11: BBox = [-3, 9, 9, -5];
const buildMach: Build<{ m: number; q: number }> = (b, g) => {
  ln(b, () => E1, C.blue, 2.5);
  ln(b, () => E2, C.orange, 2.5);
  ln(b, () => [g().m * E1[0] + g().q * E2[0], g().m * E1[1] + g().q * E2[1], g().m * E1[2] + g().q * E2[2]], C.violet, 3.5);
  dot(b, () => [3, 2], C.ink, 6);
  note(b, () => [3.3, 2.3], () => "(3, 2)", C.ink);
};
function MachineSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [m, setM] = useState(1), [q, setQ] = useState(1);
  useEffect(() => {
    if (step === 1) { setM(2); setQ(3); } else if (step >= 2) { setM(3); setQ(-5); }
  }, [step]);
  const A = m * E1[0] + q * E2[0], Bc = m * E1[1] + q * E2[1], Cc = m * E1[2] + q * E2[2];
  const msg = A === 0 && Bc === 0 ? "kedua koefisien nol: tidak membantu"
    : Bc === 0 ? `y habis → x = ${n(Cc / A)}` : A === 0 ? `x habis → y = ${n(Cc / Bc)}` : "belum ada variabel yang habis";
  return (
    <Frame
      innerRef={ref}
      eyebrow="05 · SPLDV · Mesin eliminasi"
      title="Gabungkan persamaan sesuka hati"
      copy={<>
        <p>Garis <b style={{ color: C.violet }}>ungu</b> adalah <b>m × (persamaan 1) + n × (persamaan 2)</b>.</p>
        <p>Geser m dan n. Ungu selalu melalui titik potong biru dan oranye.</p>
        <p className="fragment">Pilih m = 2, n = 3: koefisien y menjadi 0, ungu <b>tegak</b>.</p>
        <p className="fragment">Pilih m = 3, n = −5: koefisien x menjadi 0, ungu <b>mendatar</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={B11} params={{ m, q }} build={buildMach} maxH={300} />
        <div className="ds-controls">
          <Range label={tex("m")} value={m} min={-6} max={6} onChange={setM} color={C.blue} />
          <Range label={tex("n")} value={q} min={-6} max={6} onChange={setQ} color={C.orange} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.blue }}>{eq(E1)}</span> · <span style={{ color: C.orange }}>{eq(E2)}</span><br />
          <span style={{ color: C.violet }}>{n(A)}x + {n(Bc)}y = {n(Cc)}</span> · {msg}
        </div>
      </>}
    />
  );
}

/* ═════════ 12 · Metode gabungan ═════════ */
const B12: BBox = [-3, 5, 7, -4];
const CombinedSlide = () => (
  <MethodSlide
    eyebrow="05 · SPLDV · Gabungan"
    title="Eliminasi dulu, substitusi kemudian"
    head={cases("3x-2y=4", "2x+5y=9")}
    sys={sys([3, -2, 4], [2, 5, 9])}
    bbox={B12}
    copy={<>
      <p>Eliminasi menghasilkan <b>satu variabel</b>, substitusi menemukan yang lain.</p>
      <p className="fragment">Samakan koefisien y: persamaan pertama × 5, kedua × 2.</p>
      <p className="fragment">Jumlahkan untuk mendapat x.</p>
      <p className="fragment">Substitusi x untuk mendapat y, lalu periksa di kedua persamaan.</p>
    </>}
    steps={[
      { tex: String.raw`\times5,\ \times2:\ 15x-10y=20,\ \ 4x+10y=18` },
      { tex: String.raw`19x=38\Rightarrow x=2`, vx: 2 },
      { tex: String.raw`3(2)-2y=4\Rightarrow y=1`, hy: 1, pt: true },
    ]}
  />
);

/* ═════════ 13 · Jenis penyelesaian lewat koefisien ═════════ */
const CS: [number, number][] = [[3, 6], [4, 7]];
function ParamSlide() {
  const [k, setK] = useState(1);
  const [ci, setCi] = useState(0);
  const s = sys([1, 2, CS[ci][0]], [2, k, CS[ci][1]]);
  const r = solve(s), kd = KIND[r.kind];
  return (
    <Frame
      eyebrow="06 · SPLDV · Syarat koefisien"
      title="Membaca jenis penyelesaian dari angka"
      copy={<>
        <p>Tanpa menggambar, bandingkan perbandingan koefisien:</p>
        <p className="fragment"><b style={{ color: C.teal }}>Satu</b>: {tex(String.raw`\tfrac{a_1}{a_2}\neq\tfrac{b_1}{b_2}`)}</p>
        <p className="fragment"><b style={{ color: C.red }}>Nol</b>: {tex(String.raw`\tfrac{a_1}{a_2}=\tfrac{b_1}{b_2}\neq\tfrac{c_1}{c_2}`)}</p>
        <p className="fragment"><b style={{ color: C.violet }}>Tak hingga</b>: {tex(String.raw`\tfrac{a_1}{a_2}=\tfrac{b_1}{b_2}=\tfrac{c_1}{c_2}`)}</p>
        <p className="ds-muted">Geser k. Di nilai k berapa jenisnya berubah?</p>
      </>}
      stage={<>
        <SimBoard bbox={SQ} params={mp(s)} build={buildSys} maxH={300} />
        <Chips value={ci} onPick={setCi} items={[{ v: 0, label: "x + 2y = 3 ; 2x + ky = 6" }, { v: 1, label: "x + 2y = 4 ; 2x + ky = 7" }]} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("k")} value={k} min={-2} max={8} onChange={setK} color={C.orange} />
        </div>
        <div className="ds-read">
          D = 1·k − 2·2 = {k - 4}<br />
          <span style={{ color: kd.c }}>{eq(s[0])} ; {eq(s[1])} → {kd.t}: {kd.s}</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 14 · Pemisalan ═════════ */
const BPQ: BBox = [-0.5, 1.5, 1.5, -0.5];
const SubstVarSlide = () => (
  <MethodSlide
    eyebrow="07 · Pemisalan"
    title="Sistem yang tampak tidak linear"
    head={cases(String.raw`\dfrac2x+\dfrac3y=2`, String.raw`\dfrac4x-\dfrac3y=1`)}
    sys={sys([2, 3, 2], [4, -3, 1])}
    bbox={BPQ}
    show0={0}
    maxH={290}
    copy={<>
      <p>Variabelnya ada di penyebut, tetapi <b>1/x</b> dan <b>1/y</b> bisa dianggap variabel baru.</p>
      <p className="fragment">Misalkan p = 1/x dan q = 1/y. Sistem menjadi <b>linear</b>. Papan sekarang bidang p–q (mendatar p, tegak q).</p>
      <p className="fragment">Selesaikan seperti biasa: titik potong di p = ½, q = ⅓.</p>
      <p className="fragment"><b>Kembalikan</b> ke variabel awal. Jangan berhenti di p dan q. Syarat: x ≠ 0 dan y ≠ 0.</p>
    </>}
    steps={[
      { tex: String.raw`p=\tfrac1x,\ q=\tfrac1y\Rightarrow\ ${cases("2p+3q=2", "4p-3q=1")}`, show: 2 },
      { tex: String.raw`6p=3\Rightarrow p=\tfrac12,\quad q=\tfrac13`, pt: true, lab: "(½, ⅓)" },
      { tex: String.raw`x=\tfrac1p=2,\qquad y=\tfrac1q=3` },
    ]}
  />
);

/* ═════════ 15 · SPLTV ═════════ */
const B15: BBox = [-2, 9, 8, -3];
const ThreeVarSlide = () => (
  <MethodSlide
    eyebrow="08 · SPLTV"
    title="Tiga variabel: kurangi bertahap"
    head={cases("x+y+z=6\\quad(1)", "2x+y-z=2\\quad(2)", "x-y+2z=7\\quad(3)")}
    sys={sys([3, 2, 8], [5, 1, 11])}
    bbox={B15}
    show0={0}
    maxH={270}
    copy={<>
      <p>Hilangkan <b>z</b> dari dua pasang persamaan. Hasilnya SPLDV yang sudah Anda kuasai.</p>
      <p className="fragment">(1) + (2) menghilangkan z: garis biru.</p>
      <p className="fragment">2 × (2) + (3) juga menghilangkan z: garis oranye.</p>
      <p className="fragment">Titik potongnya memberi x dan y.</p>
      <p className="fragment">Substitusi ke (1) untuk z.</p>
      <p className="ds-muted">Secara geometri, tiap persamaan adalah bidang dan jawabannya titik yang berada di ketiga bidang.</p>
    </>}
    steps={[
      { tex: String.raw`(1)+(2):\ 3x+2y=8\quad(4)`, show: 1 },
      { tex: String.raw`2\times(2)+(3):\ 5x+y=11\quad(5)`, show: 2 },
      { tex: String.raw`(4),(5)\Rightarrow x=2,\ y=1`, pt: true, lab: "(2, 1)" },
      { tex: String.raw`(1):\ 2+1+z=6\Rightarrow z=3\ \Rightarrow\ (x,y,z)=(2,1,3)` },
    ]}
  />
);

/* ═════════ 16 · Soal cerita: tebak harga ═════════ */
const T1: Abc = [3, 2, 190], T2: Abc = [2, 3, 185];
const ST: BBox = [-10, 100, 100, -10];
const buildStory: Build<{ x: number; y: number }> = (b, g) => {
  ln(b, () => T1, C.blue, 2.5);
  ln(b, () => T2, C.orange, 2.5);
  seg(b, () => [g().x, 0], () => [g().x, g().y], C.soft, 1.25, 2);
  seg(b, () => [0, g().y], () => [g().x, g().y], C.soft, 1.25, 2);
  dot(b, () => [g().x, g().y], C.ink, 7);
};
function StorySlide() {
  const [x, setX] = useState(20), [y, setY] = useState(20);
  const e1 = 3 * x + 2 * y, e2 = 2 * x + 3 * y, win = e1 === 190 && e2 === 185;
  return (
    <Frame
      eyebrow="09 · Soal cerita"
      title="Tebak harga tiket"
      copy={<>
        <p>3 tiket dewasa dan 2 tiket anak Rp190.000. 2 tiket dewasa dan 3 tiket anak Rp185.000. Berapa harga masing-masing?</p>
        <p className="fragment"><b>1 · Misalkan</b> x = harga dewasa, y = harga anak (ribu rupiah).</p>
        <p className="fragment"><b>2 · Model</b>: {tex(cases("3x+2y=190", "2x+3y=185"))}</p>
        <p className="fragment"><b>3 · Selesaikan</b> dengan menggeser titik, atau eliminasi: jumlahkan → x + y = 75, kurangkan → x − y = 5.</p>
        <p className="fragment"><b>4 · Tafsirkan dan periksa</b> dalam konteks soal.</p>
      </>}
      stage={<>
        <SimBoard bbox={ST} params={{ x, y }} build={buildStory} maxH={290} />
        <div className="ds-controls">
          <Range label={tex(String.raw`x\ (\text{dewasa})`)} value={x} min={0} max={100} onChange={setX} color={C.ink} />
          <Range label={tex(String.raw`y\ (\text{anak})`)} value={y} min={0} max={100} onChange={setY} color={C.ink} />
        </div>
        <div className="ds-read">
          <span className={e1 === 190 ? "ds-ok" : ""} style={e1 === 190 ? undefined : { color: C.blue }}>3x + 2y = {e1} (harus 190)</span><br />
          <span className={e2 === 185 ? "ds-ok" : ""} style={e2 === 185 ? undefined : { color: C.orange }}>2x + 3y = {e2} (harus 185)</span>
          {win && <><br /><span className="ds-ok">✓ Tepat! Dewasa Rp{x}.000, anak Rp{y}.000.</span></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 17 · Latihan 1: bidik titik potong ═════════ */
const AIM: Sys[] = [
  sys([1, 1, 7], [1, -1, 1]), sys([1, 1, 9], [1, -1, 3]), sys([2, 1, 10], [1, 1, 7]),
  sys([3, 1, 11], [1, -1, 1]), sys([1, 2, 10], [2, -1, 5]), sys([1, 3, 11], [2, -1, 1]),
];
const buildAim: Build<{ s: Sys; x: number; y: number }> = (b, g) => {
  ln(b, () => g().s[0], C.blue, 2.5);
  ln(b, () => g().s[1], C.orange, 2.5);
  seg(b, () => [g().x, 0], () => [g().x, g().y], C.soft, 1.25, 2);
  seg(b, () => [0, g().y], () => [g().x, g().y], C.soft, 1.25, 2);
  dot(b, () => [g().x, g().y], C.ink, 7);
};
function AimSlide() {
  const [idx, setIdx] = useState(0), [x, setX] = useState(0), [y, setY] = useState(0);
  const s = AIM[idx % AIM.length];
  const e = s.map(([a, b, c]) => ({ a, b, c, v: a * x + b * y }));
  const done = e.every((q) => q.v === q.c);
  return (
    <Frame
      eyebrow="Latihan 1"
      title="Bidik titik potong"
      copy={<>
        <p>Atur <b>x</b> dan <b>y</b> sampai titik hitam berada di <b>kedua</b> garis.</p>
        <p className="fragment">Lihat angka di bawah papan: hasilnya harus sama dengan ruas kanan.</p>
        <p className="fragment">Bila salah satu sudah cocok, titiknya sudah di garis itu. Geser sepanjang garis sampai yang lain cocok.</p>
        <p className="ds-muted">Soal {(idx % AIM.length) + 1} dari {AIM.length}</p>
      </>}
      stage={<>
        <SimBoard bbox={SQ} params={{ s, x, y }} build={buildAim} maxH={290} />
        <div className="ds-controls">
          <Range label={tex("x")} value={x} min={0} max={10} onChange={setX} color={C.ink} />
          <Range label={tex("y")} value={y} min={0} max={10} onChange={setY} color={C.ink} />
        </div>
        <div className="ds-read">
          {e.map((q, i) => (
            <div key={i} className={q.v === q.c ? "ds-ok" : ""} style={q.v === q.c ? undefined : { color: i ? C.orange : C.blue }}>
              {lin(q.a, q.b)} = {n(q.v)} (target {n(q.c)}) {q.v === q.c ? "✓" : ""}
            </div>
          ))}
          {done && <><span className="ds-ok">Tepat! (x, y) = ({x}, {y}). </span><Btn onClick={() => { setIdx(idx + 1); setX(0); setY(0); }}>Soal berikutnya</Btn></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 18 · Latihan 2: jenis sistem ═════════ */
const CLS: Sys[] = [
  sys([2, 1, 5], [1, -1, 1]), sys([1, 2, 4], [2, 4, 7]), sys([2, 4, 6], [1, 2, 3]),
  sys([3, -1, 2], [6, -2, 4]), sys([3, 2, 6], [3, 2, 12]), sys([1, -2, 1], [2, 1, 7]),
];
function ClassifySlide() {
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const s = CLS[idx % CLS.length], r = solve(s), kd = KIND[r.kind];
  const why = r.kind === "satu" ? "D ≠ 0, jadi garis berpotongan"
    : r.kind === "nol" ? "D = 0 tetapi konstanta tidak sebanding, jadi sejajar" : "D = 0 dan konstanta sebanding, jadi berimpit";
  return (
    <Frame
      eyebrow="Latihan 2"
      title="Berpotongan, sejajar, atau berimpit?"
      copy={<>
        <p>Tebak jenis sistem <b>sebelum</b> melihat grafiknya.</p>
        <p className="fragment">Hitung {tex(String.raw`D=a_1b_2-a_2b_1`)}. Bila D ≠ 0, selesai.</p>
        <p className="fragment">Bila D = 0, bandingkan konstanta: sebanding → berimpit, tidak → sejajar.</p>
        <p className="ds-muted">Soal {(idx % CLS.length) + 1} dari {CLS.length}</p>
      </>}
      stage={<>
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>{tex(cases(eq(s[0]), eq(s[1])))}</div>
        <Chips
          value={pick ?? ""} onPick={(v) => { if (pick === null) setPick(v); }}
          items={[{ v: "satu", label: "Berpotongan" }, { v: "nol", label: "Sejajar" }, { v: "banyak", label: "Berimpit" }]}
        />
        {pick !== null && <>
          <SimBoard key={idx} bbox={SQ} params={mp(s)} build={buildSys} maxH={250} />
          <div className="ds-read">
            <span className={pick === r.kind ? "ds-ok" : "ds-bad"}>{pick === r.kind ? "✓ Benar." : `✗ Jawaban: ${kd.t}.`}</span> D = {n(s[0][0] * s[1][1] - s[1][0] * s[0][1])}. {why}.{" "}
            <Btn onClick={() => { setIdx(idx + 1); setPick(null); }}>Soal berikutnya</Btn>
          </div>
        </>}
      </>}
    />
  );
}

/* ═════════ 19 · Latihan 3: kuis ═════════ */
const QUIZ: QItem[] = [
  {
    q: <>Penyelesaian sistem {tex(cases("x+y=9", "x-y=3"))} adalah ....</>,
    opts: ["(2, 7)", "(3, 6)", "(5, 4)", "(6, 3)", "(7, 2)"], ans: 3,
    why: <>Jumlahkan: 2x = 12, x = 6, lalu y = 3.</>,
    viz: { bbox: [-2, 11, 11, -3], lines: [[1, 1, 9], [1, -1, 3]], mark: [6, 3] },
  },
  {
    q: <>Dari {tex(cases("2x+3y=13", "x+y=5"))}, nilai <b>x − y</b> adalah ....</>,
    opts: ["−2", "−1", "0", "1", "2"], ans: 1,
    why: <>y = 5 − x → 2x + 15 − 3x = 13 → x = 2, y = 3, sehingga x − y = −1.</>,
    viz: { bbox: [-2, 8, 8, -2], lines: [[2, 3, 13], [1, 1, 5]], mark: [2, 3] },
  },
  {
    q: <>Tempat parkir memuat 20 kendaraan (mobil dan motor) dengan jumlah roda 56. Banyak mobil adalah ....</>,
    opts: ["7", "8", "9", "10", "12"], ans: 1,
    why: <>m + s = 20 dan 4m + 2s = 56 → 2m = 16 → m = 8 (garis: x = mobil, y = motor).</>,
    viz: { bbox: [-2, 30, 24, -2], lines: [[1, 1, 20], [4, 2, 56]], mark: [8, 12] },
  },
  {
    q: <>3 kg beras dan 2 kg gula Rp54.000; 2 kg beras dan 3 kg gula Rp51.000. Harga 5 kg beras dan 4 kg gula adalah ....</>,
    opts: ["Rp84.000", "Rp90.000", "Rp96.000", "Rp102.000", "Rp108.000"], ans: 2,
    why: <>Beras Rp12.000 dan gula Rp9.000. Jadi 5(12) + 4(9) = 96 ribu.</>,
    viz: { bbox: [-3, 30, 30, -3], lines: [[3, 2, 54], [2, 3, 51]], mark: [12, 9] },
  },
  {
    q: <>Sistem {tex(cases("x+y=10", "ax+2y=20"))} punya tak hingga penyelesaian. Nilai <b>a</b> adalah ....</>,
    opts: ["1", "2", "3", "4", "5"], ans: 1,
    why: <>Perbandingan harus sama: 1/a = 1/2 = 10/20, jadi a = 2. Kedua garis berimpit.</>,
    viz: { bbox: [-2, 12, 12, -2], lines: [[1, 1, 10], [2, 2, 20]] },
  },
  {
    q: <>Bila {tex(cases(String.raw`\frac2x+\frac1y=\frac56`, String.raw`\frac1x-\frac1y=\frac16`))}, maka <b>xy</b> = ....</>,
    opts: ["18", "9", "12", "15", "24"], ans: 0,
    why: <>p = 1/x, q = 1/y: jumlahkan → 3p = 1, p = 1/3, x = 3. Lalu q = 1/6, y = 6. Jadi xy = 18.</>,
  },
  {
    q: <>Dari {tex(cases("2x+3y=13", "4x-y=5"))}, nilai <b>x² + y²</b> adalah ....</>,
    opts: ["9", "10", "12", "13", "16"], ans: 3,
    why: <>Eliminasi: x = 2, y = 3. Maka 4 + 9 = 13.</>,
    viz: { bbox: [-2, 8, 8, -4], lines: [[2, 3, 13], [4, -1, 5]], mark: [2, 3] },
  },
];

/* ═════════ 20 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Pilih metode, lalu periksa"
      copy={<>
        <p>Sistem persamaan = <b>garis-garis</b>. Penyelesaian = <b>titik temu</b>.</p>
        <p className="fragment">Tiga kemungkinan: berpotongan (1), sejajar (0), berimpit (tak hingga).</p>
        <p className="fragment">Kesalahan umum: lupa mengalikan <b>konstanta</b>, salah tanda saat mengurangkan, lupa mengembalikan pemisalan.</p>
        <p className="fragment">Selalu <b>periksa</b> jawaban di kedua persamaan.</p>
      </>}
      stage={
        <table className="ds-table">
          <thead><tr><th>Situasi</th><th>Metode</th></tr></thead>
          <tbody>
            <tr><th>Ada koefisien 1 atau −1</th><td>substitusi</td></tr>
            <tr><th>Koefisien mudah disamakan</th><td>eliminasi</td></tr>
            <tr><th>Ragu</th><td>gabungan</td></tr>
            <tr><th>Variabel di penyebut</th><td>pemisalan</td></tr>
            <tr><th>Tiga variabel</th><td>eliminasi bertahap → SPLDV</td></tr>
            <tr><th>Ingin gambaran cepat</th><td>grafik</td></tr>
          </tbody>
        </table>
      }
    />
  );
}

export function SistemPersamaanDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <MapSlide />
      <IsLinearSlide />
      <BalanceSlide />
      <ThreeSlide />
      <FractionSlide />
      <LineSlide />
      <KindSlide />
      <GraphSlide />
      <SubstitutionSlide />
      <EliminationSlide />
      <MachineSlide />
      <CombinedSlide />
      <ParamSlide />
      <SubstVarSlide />
      <ThreeVarSlide />
      <StorySlide />
      <AimSlide />
      <ClassifySlide />
      <Quiz eyebrow="Latihan 3" title="Kuis cepat" items={QUIZ} />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default SistemPersamaanDeck;
