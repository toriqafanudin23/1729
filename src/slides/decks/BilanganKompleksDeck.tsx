/* eslint-disable @typescript-eslint/no-explicit-any */
import JXG from "jsxgraph";
import { useEffect, useRef, useState } from "react";
import {
  arrow, Btn, C, Chips, dot, fmt, Frame, mk, note, OFF, Range, rad, rot, seg, shape,
  SimBoard, SlideDeck, still, useStep, useTween,
  type B, type BBox, type Build, type Vec,
} from "../common/core";
import { n, Quiz, tex } from "../common/LinearKit";
import { QUIZ } from "./quizzes/BilanganKompleksQuiz";

/* Deck "Bilangan kompleks" (kelas 10, pengayaan): mengapa i diciptakan → bentuk a + bi → bidang Argand
   → operasi → modulus dan lokus → bentuk polar → De Moivre, akar ke-n, rumus Euler → aplikasi → tantangan → kuis.
   Pola sama dengan deck lain: tiap fragmen (→) menaikkan `step`, dan `step` mengatur papan.
   Bilangan kompleks z = a + bi dipetakan ke titik (a, b); semua papan memakai bidang Argand. */

const raw = String.raw;
const BB: BBox = [-7, 5, 7, -5];
const NONE = {};

/* ───────── Aritmetika kompleks kecil ───────── */
type Z = Vec;
const cadd = (p: Z, q: Z): Z => [p[0] + q[0], p[1] + q[1]];
const cmul = (p: Z, q: Z): Z => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
const cabs = (p: Z) => Math.hypot(p[0], p[1]);
const cdiv = (p: Z, q: Z): Z => {
  const d = q[0] * q[0] + q[1] * q[1];
  return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d];
};
const polar = (r: number, deg: number): Z => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const argDeg = (p: Z) => { const a = (Math.atan2(p[1], p[0]) * 180) / Math.PI; return a < 0 ? a + 360 : a; };

/* ───────── Teks matematika ───────── */
const nt = (v: number) => n(v).replace("−", "-").replace(",", "{,}"); // koma desimal aman di TeX
/** a + bi sebagai TeX, dengan tanda dan koefisien 1 yang rapi. */
const cx = (a: number, b: number) => {
  if (Math.abs(b) < 1e-9) return nt(a);
  const im = Math.abs(Math.abs(b) - 1) < 1e-9 ? (b < 0 ? "-i" : "i") : `${nt(b)}i`;
  if (Math.abs(a) < 1e-9) return im;
  return `${nt(a)}${b > 0 ? "+" : ""}${im}`;
};
const cz = (p: Z) => cx(p[0], p[1]);
const pr = (v: number) => (v < 0 ? `(${nt(v)})` : nt(v));
const sgn = (v: number) => (v < 0 ? "−" : "+");

/* ───────── Pembantu papan ───────── */
const reim = (b: B, bb: BBox = BB) => {
  note(b, () => [bb[2] - 0.9, 0.15], () => "Re", C.soft);
  note(b, () => [0.15, bb[1] - 0.8], () => "Im", C.soft);
};
const band = (b: B, p: () => number[], q: () => number[], color: string) => {
  const s = seg(b, p, q, color, 9); s.setAttribute({ strokeOpacity: 0.3 }); return s;
};
const arc = (b: B, r: number, a0: () => number, a1: () => number, color: string, on: () => boolean = () => true) =>
  mk(b, "curve", [
    (t: number) => r * Math.cos(rad(a0() + (a1() - a0()) * t)),
    (t: number) => r * Math.sin(rad(a0() + (a1() - a0()) * t)),
    0, () => (on() ? 1 : 0),
  ], { ...still, strokeColor: color, strokeWidth: 2.5 });
const ring = (b: B, c: () => number[], r: () => number, color: string, w = 2, dash = 0) =>
  mk(b, "curve", [
    (t: number) => c()[0] + r() * Math.cos(t), (t: number) => c()[1] + r() * Math.sin(t), 0, 2 * Math.PI,
  ], { ...still, strokeColor: color, strokeWidth: w, dash });

/** Titik yang bisa diseret. snap = 0 → bebas. Posisi dibaca lewat getter yang dikembalikan.
    `nonce` pada params memindahkan titik sesuai params (untuk preset dari React). */
function grab(b: B, g: () => any, s: (p: any) => void, key: string, color: string, name: string, snap = 0.5) {
  const v0 = g()[key] as Z;
  const P = mk(b, "point", [v0[0], v0[1]], {
    name, size: 6, fillColor: color, strokeColor: "#fff", strokeWidth: 2,
    snapToGrid: snap > 0, snapSizeX: snap || 1, snapSizeY: snap || 1, highlight: false, showInfobox: false,
    label: { fontSize: 15, strokeColor: color, offset: [9, 7] },
  });
  const q = (v: number) => (snap > 0 ? Math.round(v / snap) * snap : v);
  P.on("drag", () => s({ [key]: [q(P.X()), q(P.Y())] }));
  let seen = g().nonce ?? 0;
  b.on("update", () => {
    const nn = g().nonce ?? 0;
    if (nn === seen) return;
    seen = nn;
    const v = g()[key] as Z;
    P.setPosition(JXG.COORDS_BY_USER, [v[0], v[1]]);
  });
  return (): Z => [P.X(), P.Y()];
}

/* ═════════ 0 · Judul: kali i = putar 90° ═════════ */
const Z0: Z = [3, 1];
const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
const TITLE_TXT = ["z", "i · z", "i² · z = −z", "i³ · z = −i · z"];
const buildTitle: Build<object> = (b, _g, _s, clock) => {
  const st = () => {
    const s = clock() / 2.4, k = Math.floor(s), f = s - k;
    return { k, u: ease(Math.min(1, Math.max(0, (f - 0.15) / 0.6))) };
  };
  const pos = (): Vec => { const { k, u } = st(); return rot(Z0, [0, 0], 90 * (k + u)); };
  ring(b, () => [0, 0], () => cabs(Z0), C.line, 1.5, 2);
  [0, 1, 2, 3].forEach((k) => dot(b, () => rot(Z0, [0, 0], 90 * k), C.soft, 4));
  arrow(b, () => [0, 0], pos, C.orange, 3);
  dot(b, pos, C.orange, 6);
  note(b, () => [-6.6, 4.1], () => TITLE_TXT[(st().k + (st().u > 0.5 ? 1 : 0)) % 4], C.mute);
  reim(b);
};
function TitleSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi"
      title="Bilangan kompleks"
      copy={<>
        <p>Bilangan yang kuadratnya negatif, dan ternyata ia hidup di bidang: <b>mengalikan dengan i berarti memutar 90°</b>.</p>
        <p className="ds-muted">Tekan <b>→</b> untuk melangkah. Setiap kalimat baru ikut menggerakkan simulasinya.</p>
      </>}
      stage={<SimBoard bbox={BB} params={NONE} build={buildTitle} loop />}
    />
  );
}

/* ═════════ 1 · Mengapa perlu bilangan baru? ═════════ */
type WP = { c: number };
const buildWhy: Build<WP> = (b, g) => {
  mk(b, "functiongraph", [(x: number) => x * x + g().c], { ...still, strokeColor: C.blue, strokeWidth: 3 });
  [0, 1].forEach((i) => dot(b, () => {
    const c = g().c;
    if (c > 0) return OFF;
    const r = Math.sqrt(-c);
    return [i ? r : -r, 0];
  }, C.red, 6));
  note(b, () => [-5.6, 6.8], () => `y = x²${g().c > 0 ? ` + ${g().c}` : g().c < 0 ? ` − ${-g().c}` : ""}`, C.blue);
};
function WhySlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [c, setC] = useState(1);
  return (
    <Frame
      innerRef={ref}
      eyebrow="Mulai dari masalah"
      title="Persamaan yang tak punya akar"
      copy={<>
        <p>Selesaikan {tex("x^2+1=0")}. Kita butuh {tex("x^2=-1")}, tetapi <b>kuadrat bilangan real tidak pernah negatif</b>.</p>
        <p className="fragment">Grafik {tex("y=x^2+1")} memang <b>tidak pernah memotong sumbu x</b>. Geser {tex("c")} ke bawah: akar real baru muncul.</p>
        <p className="fragment">Daripada menyerah, kita <b>sepakati</b> ada bilangan {tex("i")} dengan {tex(raw`i^2=-1`)}. Maka {tex(raw`x=\pm i`)} adalah akarnya.</p>
      </>}
      stage={<>
        <SimBoard bbox={[-6, 8, 6, -4]} aspect={1.4} params={{ c }} build={buildWhy} maxH={340} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("c")} value={c} min={-4} max={4} onChange={setC} color={C.blue} />
        </div>
        <div className="ds-read">
          {c <= 0
            ? <>x² {c < 0 ? `= ${-c}` : "= 0"} → x = {c < 0 ? `±√${-c}` : "0"} (akar real)</>
            : step >= 2
              ? <>x² = −{c} → x = ±i√{c} <span className="ds-ok">(akar imajiner)</span></>
              : <span className="ds-bad">x² = −{c} → tidak ada akar real</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 2 · Sejarah singkat ═════════ */
function HistorySlide() {
  const rows: [string, string, string][] = [
    ["1545", "Gerolamo Cardano", "Dalam Ars Magna ia menulis akar bilangan negatif untuk pertama kali, sambil menyebutnya “sofistik”."],
    ["1572", "Rafael Bombelli", "Menyusun aturan hitung untuk bilangan semacam itu dan memakainya menyelesaikan persamaan kubik."],
    ["1637", "René Descartes", "Memberi nama “imajiner” (nombre imaginaire), awalnya sebagai ejekan."],
    ["1777", "Leonhard Euler", "Memperkenalkan lambang i; juga menemukan hubungan e dengan sin dan cos."],
    ["1797–1806", "Wessel dan Argand", "Menggambar bilangan kompleks sebagai titik pada bidang."],
    ["1831", "Carl F. Gauss", "Memantapkan istilah “bilangan kompleks”; buktinya: setiap polinomial punya akar kompleks."],
  ];
  return (
    <Frame
      eyebrow="Sejarah singkat"
      title="Dari “mustahil” menjadi alat"
      copy={<>
        <p>Cardano bertanya: bagi 10 menjadi dua bagian yang hasil kalinya 40.</p>
        <p className="ds-math">{tex(raw`(5+\sqrt{-15})(5-\sqrt{-15})=25+15=40`)}</p>
        <p className="fragment">Hasilnya benar, padahal akarnya “mustahil”. Bilangan kompleks ternyata <b>perlu</b>, bahkan untuk persamaan kubik yang jawabannya real.</p>
        <p className="fragment">Bombelli menunjukkan {tex(raw`x^3=15x+4`)} berakar {tex("x=4")} lewat {tex(raw`\sqrt[3]{2+11i}+\sqrt[3]{2-11i}`)}, dengan {tex(raw`(2+i)^3=2+11i`)}.</p>
      </>}
      stage={
        <table className="ds-table" style={{ fontSize: 17 }}>
          <thead><tr><th>Tahun</th><th>Tokoh</th><th>Sumbangan</th></tr></thead>
          <tbody>{rows.map(([y, w, t]) => <tr key={y}><th>{y}</th><td style={{ whiteSpace: "nowrap" }}>{w}</td><td>{t}</td></tr>)}</tbody>
        </table>
      }
    />
  );
}

/* ═════════ 3 · Pangkat i berulang tiap 4 ═════════ */
const POWPOS: [string, number, number][] = [["1", 1.12, 0.08], ["i", 0.1, 1.22], ["−1", -1.65, 0.08], ["−i", 0.1, -1.5]];
const buildPow: Build<{ ang: number }> = (b, g) => {
  ring(b, () => [0, 0], () => 1, C.line, 1.5, 2);
  POWPOS.forEach(([t, x, y], k) => {
    dot(b, () => [Math.cos(rad(90 * k)), Math.sin(rad(90 * k))], C.soft, 5);
    note(b, () => [x, y], () => t, C.mute);
  });
  const P = (): Vec => [Math.cos(rad(g().ang)), Math.sin(rad(g().ang))];
  arrow(b, () => [0, 0], P, C.orange, 3);
  dot(b, P, C.orange, 7);
  reim(b, [-3, 2.4, 3, -2.4]);
};
function PowerSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState(3);
  const ang = useTween(k * 90, 700);
  const r = k % 4, val = ["1", "i", "-1", "-i"][r];
  return (
    <Frame
      innerRef={ref}
      eyebrow="01 · Satuan imajiner"
      title="Pangkat i berulang tiap empat"
      copy={<>
        <p>{tex(raw`i^1=i,\; i^2=-1,\; i^3=i^2\cdot i=-i,\; i^4=1`)}</p>
        <p className="fragment">Setelah {tex("i^4=1")}, daftarnya <b>mengulang</b>. Setiap kali dikali i, titik berputar 90°.</p>
        <p className="fragment">Aturannya: bagi pangkat dengan 4, <b>sisanya</b> yang menentukan. Jadi {tex(raw`i^{2026}=i^2=-1`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={[-3, 2.4, 3, -2.4]} params={{ ang }} build={buildPow} maxH={330} />
        <div className="ds-controls ds-controls--one">
          <Range label="pangkat n" value={k} min={0} max={24} onChange={setK} color={C.orange} />
        </div>
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`i^{${k}}=i^{${r}}=${val}`)}
          {step >= 2 && <span className="ds-muted"> sisa {k} ÷ 4 = {r}</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 4 · Bentuk a + bi dan jenis bilangan ═════════ */
type Sam = { k: string; a: number; b: number };
const SAM: Sam[] = [
  { k: "5", a: 5, b: 0 }, { k: "√2", a: Math.SQRT2, b: 0 }, { k: "4i", a: 0, b: 4 },
  { k: "−3i", a: 0, b: -3 }, { k: "2 + 3i", a: 2, b: 3 }, { k: "−4 − i", a: -4, b: -1 },
];
const buildKind: Build<{ z: Z }> = (b, g) => {
  band(b, () => (g().z[1] === 0 ? [-7, 0] : OFF), () => (g().z[1] === 0 ? [7, 0] : OFF), C.teal);
  band(b, () => (g().z[0] === 0 && g().z[1] !== 0 ? [0, -5] : OFF), () => (g().z[0] === 0 && g().z[1] !== 0 ? [0, 5] : OFF), C.violet);
  arrow(b, () => [0, 0], () => g().z, C.orange, 3);
  dot(b, () => g().z, C.orange, 7);
  reim(b);
};
function KindSlide() {
  const [k, setK] = useState("2 + 3i");
  const s = SAM.find((x) => x.k === k)!;
  const kind = s.b === 0 ? "bilangan real (b = 0)" : s.a === 0 ? "imajiner murni (a = 0)" : "kompleks, bukan real";
  return (
    <Frame
      eyebrow="02 · Bentuk umum"
      title={<>z = a + bi</>}
      copy={<>
        <p>{tex("a")} disebut <b>bagian real</b>, ditulis {tex(raw`\operatorname{Re}(z)`)}. {tex("b")} disebut <b>bagian imajiner</b>, {tex(raw`\operatorname{Im}(z)`)}.</p>
        <p className="fragment">Bila <b style={{ color: C.teal }}>b = 0</b>, z real. Jadi {tex(raw`\mathbb{R}\subset\mathbb{C}`)}: setiap bilangan real adalah bilangan kompleks.</p>
        <p className="fragment">Bila <b style={{ color: C.violet }}>a = 0</b> dan b ≠ 0, z <b>imajiner murni</b>. Catatan: Im(z) adalah <b>b</b>, bukan bi.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ z: [s.a, s.b] as Z }} build={buildKind} maxH={340} />
        <Chips value={k} onPick={setK} items={SAM.map((x) => ({ v: x.k, label: x.k }))} />
        <div className="ds-read">
          z = {k} · Re = {fmt(s.a, s.a % 1 ? 2 : 0)} · Im = {fmt(s.b, 0)} → {kind}
        </div>
      </>}
    />
  );
}

/* ═════════ 5 · Bidang Argand ═════════ */
type AP = { z: Z; nonce: number; step: number };
const buildArg: Build<AP> = (b, g, s) => {
  reim(b);
  const Zg = grab(b, g, s, "z", C.orange, "z");
  const on1 = () => g().step >= 1, on2 = () => g().step >= 2;
  arrow(b, () => [0, 0], Zg, C.orange, 3);
  seg(b, () => (on1() ? Zg() : OFF), () => (on1() ? [Zg()[0], 0] : OFF), C.blue, 1.75, 2);
  seg(b, () => (on1() ? Zg() : OFF), () => (on1() ? [0, Zg()[1]] : OFF), C.violet, 1.75, 2);
  note(b, () => (on1() ? [Zg()[0] / 2, -0.7] : OFF), () => "a", C.blue);
  note(b, () => (on1() ? [-0.6, Zg()[1] / 2] : OFF), () => "b", C.violet);
  arc(b, 0.9, () => 0, () => (Math.atan2(Zg()[1], Zg()[0]) * 180) / Math.PI, C.teal, on2);
  note(b, () => (on2() ? [Zg()[0] / 2 + 0.15, Zg()[1] / 2 + 0.15] : OFF), () => "r", C.teal);
};
function ArgandSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [p, setP] = useState<AP>({ z: [3, 2], nonce: 0, step: 0 });
  const z = p.z;
  return (
    <Frame
      innerRef={ref}
      eyebrow="03 · Bidang kompleks"
      title="Satu bilangan, satu titik"
      copy={<>
        <p>Bilangan {tex("z=a+bi")} digambar sebagai titik <b>(a, b)</b>. Sumbu x menjadi <b>sumbu real</b>, sumbu y menjadi <b>sumbu imajiner</b>.</p>
        <p className="fragment">Seret titik oranye. Bagian real {tex("a")} dibaca ke kiri-kanan, bagian imajiner {tex("b")} ke atas-bawah.</p>
        <p className="fragment">Jarak ke titik asal adalah <b>modulus</b> {tex("r=|z|")}; sudut dari sumbu real positif adalah <b>argumen</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...p, step }} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildArg} maxH={380} />
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`z=${cz(z)}`)}
          <span className="ds-muted"> · |z| = {fmt(cabs(z))} · arg = {fmt(argDeg(z), 1)}°</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 6 · Sekawan (konjugat) ═════════ */
const buildConj: Build<AP> = (b, g, s) => {
  reim(b);
  const Zg = grab(b, g, s, "z", C.orange, "z");
  const K = (): Z => [Zg()[0], -Zg()[1]];
  ring(b, () => [0, 0], () => cabs(Zg()), C.line, 1.5, 2);
  seg(b, () => (g().step >= 1 ? Zg() : OFF), () => (g().step >= 1 ? K() : OFF), C.violet, 1.75, 2);
  arrow(b, () => [0, 0], Zg, C.orange, 3);
  arrow(b, () => [0, 0], K, C.blue, 3);
  dot(b, K, C.blue, 7);
  note(b, () => [K()[0] + 0.25, K()[1] - (K()[1] < 0 ? 0.6 : -0.1)], () => "z̄", C.blue);
};
function ConjugateSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [p, setP] = useState<AP>({ z: [3, 2], nonce: 0, step: 0 });
  const [a, bb] = p.z;
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · Sekawan"
      title="Bayangan di sumbu real"
      copy={<>
        <p>Sekawan (konjugat) dari {tex("z=a+bi")} adalah {tex(raw`\bar z=a-bi`)}: <b>tanda bagian imajiner dibalik</b>.</p>
        <p className="fragment">Pada bidang, {tex(raw`\bar z`)} adalah <b>pencerminan</b> z terhadap sumbu real; keduanya berjarak sama dari O.</p>
        <p className="fragment">Hasil jumlah dan kalinya selalu real. Itu sebabnya sekawan dipakai untuk <b>merasionalkan</b> penyebut.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...p, step }} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildConj} maxH={340} />
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(raw`z+\bar z=${nt(2 * a)}\qquad z\cdot\bar z=${nt(a * a + bb * bb)}=|z|^2`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 7 · Penjumlahan dan pengurangan ═════════ */
type SP = { z1: Z; z2: Z; sub: boolean; nonce: number; step: number };
const buildSum: Build<SP> = (b, g, s) => {
  reim(b);
  const A = grab(b, g, s, "z1", C.blue, "z₁");
  const Bp = grab(b, g, s, "z2", C.orange, "z₂");
  const W = (): Z => (g().sub ? [-Bp()[0], -Bp()[1]] : Bp());
  const R = (): Z => cadd(A(), W());
  arrow(b, () => [0, 0], A, C.blue, 2.5);
  arrow(b, () => [0, 0], Bp, C.orange, 2.5);
  arrow(b, () => (g().sub ? [0, 0] : OFF), () => (g().sub ? W() : OFF), C.orange, 2, 3);
  seg(b, () => (g().step >= 1 ? A() : OFF), () => (g().step >= 1 ? R() : OFF), C.orange, 1.5, 2);
  seg(b, () => (g().step >= 1 ? W() : OFF), () => (g().step >= 1 ? R() : OFF), C.blue, 1.5, 2);
  arrow(b, () => [0, 0], R, C.violet, 3.25);
  dot(b, R, C.violet, 7);
  note(b, () => [R()[0] + 0.25, R()[1] + 0.2], () => (g().sub ? "z₁ − z₂" : "z₁ + z₂"), C.violet);
};
function SumSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [p, setP] = useState<SP>({ z1: [3, 1], z2: [1, 3], sub: false, nonce: 0, step: 0 });
  const R = p.sub ? [p.z1[0] - p.z2[0], p.z1[1] - p.z2[1]] as Z : cadd(p.z1, p.z2);
  return (
    <Frame
      innerRef={ref}
      eyebrow="05 · Penjumlahan"
      title="Menjumlah = menyusun panah"
      copy={<>
        <p>Jumlahkan bagian real dengan real, imajiner dengan imajiner:</p>
        <p className="ds-math">{tex(raw`(a+bi)+(c+di)=(a+c)+(b+d)i`)}</p>
        <p className="fragment">Secara geometri: <b>jajar genjang</b>. Hasilnya adalah diagonal dari panah z₁ dan z₂, sama seperti menjumlah vektor.</p>
        <p className="fragment">Pengurangan = menjumlah dengan lawan: {tex(raw`z_1-z_2=z_1+(-z_2)`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...p, step }} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildSum} maxH={340} />
        <Chips value={p.sub ? "-" : "+"} onPick={(v) => setP((s) => ({ ...s, sub: v === "-" }))}
          items={[{ v: "+", label: "z₁ + z₂" }, { v: "-", label: "z₁ − z₂" }]} />
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`(${cz(p.z1)})${p.sub ? "-" : "+"}(${cz(p.z2)})=${cz(R)}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 8 · Perkalian: metode kotak ═════════ */
function MulSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [a, setA] = useState(2), [b, setB] = useState(3), [c, setC] = useState(1), [d, setD] = useState(-1);
  const re = a * c - b * d, im = a * d + b * c;
  const hot = step >= 2;
  return (
    <Frame
      innerRef={ref}
      eyebrow="06 · Perkalian"
      title="Kalikan, lalu ingat i² = −1"
      copy={<>
        <p>Kalikan dua suku dengan dua suku, seperti {tex("(x+y)(u+v)")}:</p>
        <p className="ds-math">{tex(raw`(a+bi)(c+di)=ac+adi+bci+bd\,i^2`)}</p>
        <p className="fragment">Satu-satunya yang baru: {tex("i^2")} diganti {tex("-1")}, jadi suku terakhir menjadi {tex("-bd")} dan <b>ikut bagian real</b>.</p>
        <p className="fragment">Hasil akhir: {tex(raw`(ac-bd)+(ad+bc)i`)}. Ubah angkanya dan amati kotak.</p>
      </>}
      stage={<>
        <table className="ds-table" style={{ fontSize: 20 }}>
          <thead><tr><th /><th>{tex(`c=${pr(c)}`)}</th><th>{tex(`di=${cx(0, d)}`)}</th></tr></thead>
          <tbody>
            <tr>
              <th>{tex(`a=${pr(a)}`)}</th>
              <td>{tex(`${pr(a)}\\cdot${pr(c)}=${nt(a * c)}`)}</td>
              <td>{tex(`${pr(a)}\\cdot ${cx(0, d)}=${cx(0, a * d)}`)}</td>
            </tr>
            <tr>
              <th>{tex(`bi=${cx(0, b)}`)}</th>
              <td>{tex(`${cx(0, b)}\\cdot${pr(c)}=${cx(0, b * c)}`)}</td>
              <td style={hot ? { color: C.red, fontWeight: 600 } : undefined}>
                {tex(`${cx(0, b)}\\cdot${cx(0, d)}=${nt(b * d)}\\,i^2=${nt(-b * d)}`)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="ds-controls">
          <Range label="a" value={a} min={-4} max={4} onChange={setA} color={C.blue} />
          <Range label="b" value={b} min={-4} max={4} onChange={setB} color={C.blue} />
          <Range label="c" value={c} min={-4} max={4} onChange={setC} color={C.orange} />
          <Range label="d" value={d} min={-4} max={4} onChange={setD} color={C.orange} />
        </div>
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`(${cx(a, b)})(${cx(c, d)})=${cx(re, im)}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 9 · Pembagian: kalikan sekawan ═════════ */
type DvP = { z1: Z; z2: Z };
const buildDiv: Build<DvP> = (b, g) => {
  reim(b);
  const Q = (): Z => cdiv(g().z1, g().z2);
  arrow(b, () => [0, 0], () => g().z1, C.blue, 2.5);
  arrow(b, () => [0, 0], () => g().z2, C.orange, 2.5);
  arrow(b, () => [0, 0], Q, C.violet, 3);
  dot(b, () => g().z1, C.blue, 5, "z₁");
  dot(b, () => g().z2, C.orange, 5, "z₂");
  dot(b, Q, C.violet, 6, "z₁/z₂");
};
function DivSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const k = Math.min(useStep(ref), 3);
  const [a, setA] = useState(5), [b, setB] = useState(1), [c, setC] = useState(2), [d, setD] = useState(-1);
  const w: Z = c === 0 && d === 0 ? [1, 0] : [c, d];
  const den = w[0] * w[0] + w[1] * w[1];
  const re = a * w[0] + b * w[1], im = b * w[0] - a * w[1];
  const lines = [
    raw`=\dfrac{(${cx(a, b)})(${cx(w[0], -w[1])})}{(${cx(w[0], w[1])})(${cx(w[0], -w[1])})}`,
    raw`=\dfrac{${cx(re, im)}}{${nt(den)}}\qquad\text{(penyebut}=c^2+d^2\text{, real)}`,
    raw`=\dfrac{${nt(re)}}{${nt(den)}}${im < 0 ? "-" : "+"}\dfrac{${nt(Math.abs(im))}}{${nt(den)}}\,i\approx ${cz([re / den, im / den])}`,
  ];
  return (
    <Frame
      innerRef={ref}
      eyebrow="07 · Pembagian"
      title="Hilangkan i dari penyebut"
      copy={<>
        <p>Bagi dua bilangan kompleks dengan mengalikan pembilang dan penyebut dengan <b>sekawan penyebut</b>.</p>
        <p className="ds-math">{tex(raw`\dfrac{z_1}{z_2}=\dfrac{z_1\,\bar z_2}{z_2\,\bar z_2}=\dfrac{z_1\,\bar z_2}{c^2+d^2}`)}</p>
        <p className="fragment">Ini sama seperti merasionalkan {tex(raw`\frac{1}{\sqrt2}`)}: kita memakai fakta bahwa {tex(raw`z\bar z`)} <b>real</b>.</p>
        <p className="fragment">Pembilang dikalikan seperti biasa; penyebutnya menjadi <b>{tex("c^2+d^2")}</b>, bilangan real.</p>
        <p className="fragment">Terakhir, pisahkan bagian real dan imajiner. Ubah angkanya dan bandingkan dengan titik ungu.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ z1: [a, b] as Z, z2: w }} build={buildDiv} maxH={250} />
        <div className="ds-controls">
          <Range label="a (z₁)" value={a} min={-4} max={4} onChange={setA} color={C.blue} />
          <Range label="b (z₁)" value={b} min={-4} max={4} onChange={setB} color={C.blue} />
          <Range label="c (z₂)" value={c} min={-3} max={3} onChange={setC} color={C.orange} />
          <Range label="d (z₂)" value={d} min={-3} max={3} onChange={setD} color={C.orange} />
        </div>
        <div className="ds-read ds-steps">
          <div>{tex(raw`\dfrac{z_1}{z_2}=\dfrac{${cx(a, b)}}{${cx(w[0], w[1])}}`)}</div>
          {lines.slice(0, k).map((l, i) => <div key={i} className={i === k - 1 ? "is-now" : ""}>{tex(l)}</div>)}
        </div>
      </>}
    />
  );
}

/* ═════════ 10 · Hati-hati: akar bilangan negatif ═════════ */
function RootTrapSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [p, setP] = useState(4), [q, setQ] = useState(9);
  const s = Math.sqrt(p * q), ex = Number.isInteger(s);
  const val = ex ? nt(s) : `\\sqrt{${p * q}}`;
  return (
    <Frame
      innerRef={ref}
      eyebrow="08 · Hati-hati"
      title="Jebakan akar bilangan negatif"
      copy={<>
        <p>Definisi: {tex(raw`\sqrt{-a}=i\sqrt a`)} untuk {tex("a>0")}. Misalnya {tex(raw`\sqrt{-9}=3i`)}.</p>
        <p className="fragment">Aturan {tex(raw`\sqrt a\cdot\sqrt b=\sqrt{ab}`)} <b>hanya berlaku bila a dan b tidak negatif</b>.</p>
        <p className="fragment">Karena itu, ubah dulu ke bentuk {tex("i")}, baru kalikan. Jika tidak, tandanya salah.</p>
      </>}
      stage={<>
        <div className="ds-controls">
          <Range label="p" value={p} min={1} max={16} onChange={setP} color={C.blue} />
          <Range label="q" value={q} min={1} max={16} onChange={setQ} color={C.orange} />
        </div>
        <table className="ds-table" style={{ fontSize: 19 }}>
          <thead><tr><th>Cara</th><th>Penghitungan</th></tr></thead>
          <tbody>
            <tr>
              <th style={{ color: C.green }}>Benar</th>
              <td>{tex(raw`\sqrt{-${p}}\cdot\sqrt{-${q}}=(i\sqrt{${p}})(i\sqrt{${q}})=i^2\sqrt{${p * q}}=-${val}`)}</td>
            </tr>
            <tr style={{ opacity: step >= 1 ? 1 : 0.35 }}>
              <th style={{ color: C.red }}>Keliru</th>
              <td>{tex(raw`\sqrt{(-${p})(-${q})}=\sqrt{${p * q}}=+${val}`)}</td>
            </tr>
          </tbody>
        </table>
        <div className="ds-read ds-bad">Kedua hasil berlawanan tanda: {fmt(-s)} dan {fmt(s)}. Hanya yang pertama benar.</div>
      </>}
    />
  );
}

/* ═════════ 11 · Persamaan kuadrat dengan D < 0 ═════════ */
type QP = { a: number; b: number; c: number };
const buildParab: Build<QP> = (b, g) => {
  mk(b, "functiongraph", [(x: number) => g().a * x * x + g().b * x + g().c], { ...still, strokeColor: C.blue, strokeWidth: 3 });
  const D = () => g().b * g().b - 4 * g().a * g().c;
  [0, 1].forEach((i) => dot(b, () => {
    if (D() < 0) return OFF;
    const s = Math.sqrt(D()), r = (-g().b + (i ? s : -s)) / (2 * g().a);
    return [r, 0];
  }, C.red, 6));
  note(b, () => [-5.6, 7], () => "y = ax² + bx + c", C.blue);
};
const buildRoots: Build<QP> = (b, g) => {
  reim(b, [-6, 5, 6, -5]);
  const D = () => g().b * g().b - 4 * g().a * g().c;
  const X = (i: number): Z => {
    const re = -g().b / (2 * g().a);
    if (D() >= 0) { const s = Math.sqrt(D()) / (2 * g().a); return [re + (i ? s : -s), 0]; }
    const im = Math.sqrt(-D()) / (2 * g().a);
    return [re, i ? im : -im];
  };
  seg(b, () => (D() < 0 ? X(0) : OFF), () => (D() < 0 ? X(1) : OFF), C.violet, 1.5, 2);
  [0, 1].forEach((i) => {
    dot(b, () => X(i), D() < 0 ? C.violet : C.red, 7);
    note(b, () => [X(i)[0] + 0.25, X(i)[1] + 0.2], () => (i ? "x₂" : "x₁"), C.mute);
  });
};
function QuadraticSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [a, setA] = useState(1), [b, setB] = useState(-2), [c, setC] = useState(5);
  const D = b * b - 4 * a * c;
  const re = -b / (2 * a), im = Math.sqrt(Math.abs(D)) / (2 * a);
  return (
    <Frame
      innerRef={ref}
      eyebrow="09 · Persamaan kuadrat"
      title="Diskriminan negatif punya akar"
      copy={<>
        <p>Bila {tex(raw`D=b^2-4ac<0`)}, parabola tidak memotong sumbu x, tetapi persamaannya <b>tetap punya dua akar</b>.</p>
        <p className="ds-math">{tex(raw`x_{1,2}=\dfrac{-b\pm i\sqrt{-D}}{2a}`)}</p>
        <p className="fragment">Kedua akar adalah <b>sepasang sekawan</b>: bagian realnya sama {tex(raw`-\tfrac{b}{2a}`)}, imajinernya berlawanan.</p>
        <p className="fragment">Pada bidang kompleks (kanan), akar-akar itu simetris terhadap sumbu real. Cari c terkecil agar akarnya real lagi.</p>
      </>}
      stage={<>
        <div className="ds-row" style={{ alignItems: "flex-start", gap: 12 }}>
          <SimBoard bbox={[-6, 8, 6, -2]} aspect={1.2} params={{ a, b, c }} build={buildParab} maxH={250} />
          <SimBoard bbox={[-6, 5, 6, -5]} aspect={1.2} params={{ a, b, c }} build={buildRoots} maxH={250} />
        </div>
        <div className="ds-controls">
          <Range label="a" value={a} min={1} max={3} onChange={setA} color={C.blue} />
          <Range label="b" value={b} min={-6} max={6} onChange={setB} color={C.violet} />
          <Range label="c" value={c} min={0} max={8} onChange={setC} color={C.orange} />
        </div>
        <div className="ds-read ds-math">
          {tex(`D=${nt(D)}`)}{" "}
          {D < 0
            ? <>→ {tex(`x_{1,2}=${nt(re)}\\pm ${nt(im)}i`)}</>
            : <span className={step >= 2 ? "ds-ok" : ""}>→ akar real</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 12 · Modulus ═════════ */
type TP = { z1: Z; z2: Z; nonce: number; step: number };
const buildMod: Build<TP> = (b, g, s) => {
  reim(b);
  const A = grab(b, g, s, "z1", C.blue, "z₁");
  const Bp = grab(b, g, s, "z2", C.orange, "z₂");
  arrow(b, () => [0, 0], A, C.blue, 2.5);
  arrow(b, () => [0, 0], Bp, C.orange, 2.5);
  ring(b, () => (g().step >= 1 ? [0, 0] : OFF), () => cabs(A()), C.blue, 1.25, 3);
  ring(b, () => (g().step >= 1 ? [0, 0] : OFF), () => cabs(Bp()), C.orange, 1.25, 3);
  seg(b, () => (g().step >= 2 ? A() : OFF), () => (g().step >= 2 ? Bp() : OFF), C.violet, 3);
  note(b, () => (g().step >= 2 ? [(A()[0] + Bp()[0]) / 2 + 0.2, (A()[1] + Bp()[1]) / 2 + 0.2] : OFF), () => "|z₁ − z₂|", C.violet);
};
function ModulusSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [p, setP] = useState<TP>({ z1: [3, 2], z2: [-2, 1], nonce: 0, step: 0 });
  const m1 = cabs(p.z1), m2 = cabs(p.z2), md = cabs([p.z1[0] - p.z2[0], p.z1[1] - p.z2[1]]), mp = cabs(cmul(p.z1, p.z2));
  return (
    <Frame
      innerRef={ref}
      eyebrow="10 · Modulus"
      title="Modulus = jarak"
      copy={<>
        <p>Modulus {tex(raw`|a+bi|=\sqrt{a^2+b^2}`)} adalah jarak titik ke O, yaitu <b>Pythagoras</b>.</p>
        <p className="fragment">Titik-titik dengan modulus sama membentuk <b>lingkaran</b> berpusat di O.</p>
        <p className="fragment">Lebih umum, {tex(raw`|z_1-z_2|`)} adalah <b>jarak</b> antara dua titik. Coba juga: {tex(raw`|z_1z_2|=|z_1|\,|z_2|`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...p, step }} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildMod} maxH={340} />
        <div className="ds-read">
          |z₁| = {fmt(m1)} · |z₂| = {fmt(m2)} · |z₁ − z₂| = {fmt(md)}<br />
          |z₁z₂| = {fmt(mp)} = |z₁|·|z₂| = {fmt(m1 * m2)}
        </div>
      </>}
    />
  );
}

/* ═════════ 13 · Lokus: lingkaran dan cakram ═════════ */
type LP = { z0: Z; z: Z; r: number; disk: boolean; nonce: number };
const buildLocus: Build<LP> = (b, g, s) => {
  reim(b);
  const C0 = grab(b, g, s, "z0", C.violet, "z₀", 1);
  const T = grab(b, g, s, "z", C.orange, "z");
  mk(b, "circle", [[() => C0()[0], () => C0()[1]], () => (g().disk ? g().r : 0)], {
    ...still, strokeColor: C.violet, strokeWidth: 0, fillColor: C.violet, fillOpacity: 0.14,
  });
  ring(b, C0, () => g().r, C.violet, 3);
  seg(b, C0, T, C.soft, 1.5, 2);
  note(b, () => [(C0()[0] + T()[0]) / 2 + 0.15, (C0()[1] + T()[1]) / 2 + 0.15], () => "|z − z₀|", C.mute);
};
function LocusSlide() {
  const [p, setP] = useState<LP>({ z0: [1, 1], z: [-2, 2], r: 3, disk: false, nonce: 0 });
  const d = cabs([p.z[0] - p.z0[0], p.z[1] - p.z0[1]]);
  const eq = Math.abs(d - p.r) < 1e-6, inside = d < p.r - 1e-6;
  const holds = p.disk ? eq || inside : eq;
  return (
    <Frame
      eyebrow="11 · Himpunan titik"
      title="Lingkaran dari satu persamaan"
      copy={<>
        <p>Himpunan {tex(raw`\{z:\ |z-z_0|=r\}`)} adalah <b>lingkaran</b> berpusat di {tex("z_0")}, berjari-jari {tex("r")}.</p>
        <p className="fragment">Contoh: {tex(raw`|z-(1+i)|=3`)} berpusat di (1, 1). Perhatikan: pusatnya {tex("z_0")}, bukan {tex("-z_0")}.</p>
        <p className="fragment">Mengganti “=” dengan “≤” mengisi <b>seluruh cakram</b>. Seret titik z dan uji apakah ia memenuhi.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={p} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildLocus} maxH={340} />
        <Chips value={p.disk ? "d" : "e"} onPick={(v) => setP((s) => ({ ...s, disk: v === "d" }))}
          items={[{ v: "e", label: "|z − z₀| = r" }, { v: "d", label: "|z − z₀| ≤ r" }]} />
        <div className="ds-controls ds-controls--one">
          <Range label="r" value={p.r} min={0.5} max={5} step={0.5} onChange={(r) => setP((s) => ({ ...s, r }))} color={C.violet} />
        </div>
        <div className={`ds-read ${holds ? "ds-ok" : "ds-bad"}`}>
          |z − z₀| = {fmt(d)} · r = {fmt(p.r, 1)} → {holds ? "z memenuhi" : "z tidak memenuhi"}
        </div>
      </>}
    />
  );
}

/* ═════════ 14 · Lokus: garis sumbu ═════════ */
type BP = { z1: Z; z2: Z; z: Z; nonce: number };
const buildBis: Build<BP> = (b, g, s) => {
  reim(b);
  const A = grab(b, g, s, "z1", C.blue, "z₁", 1);
  const Bp = grab(b, g, s, "z2", C.orange, "z₂", 1);
  const T = grab(b, g, s, "z", C.violet, "z");
  const ends = (): [Z, Z] | null => {
    const dx = Bp()[0] - A()[0], dy = Bp()[1] - A()[1], L = Math.hypot(dx, dy);
    if (L < 1e-9) return null;
    const m: Z = [(A()[0] + Bp()[0]) / 2, (A()[1] + Bp()[1]) / 2], u: Z = [-dy / L, dx / L];
    return [[m[0] - 30 * u[0], m[1] - 30 * u[1]], [m[0] + 30 * u[0], m[1] + 30 * u[1]]];
  };
  seg(b, () => ends()?.[0] ?? OFF, () => ends()?.[1] ?? OFF, C.teal, 3);
  seg(b, A, T, C.blue, 1.5, 2);
  seg(b, Bp, T, C.orange, 1.5, 2);
};
function BisectorSlide() {
  const [p, setP] = useState<BP>({ z1: [-2, 1], z2: [2, -1], z: [0, 0], nonce: 0 });
  const d1 = cabs([p.z[0] - p.z1[0], p.z[1] - p.z1[1]]), d2 = cabs([p.z[0] - p.z2[0], p.z[1] - p.z2[1]]);
  const eq = Math.abs(d1 - d2) < 1e-6;
  return (
    <Frame
      eyebrow="12 · Himpunan titik"
      title="Berjarak sama dari dua titik"
      copy={<>
        <p>{tex(raw`|z-z_1|=|z-z_2|`)} berarti z berjarak sama dari {tex("z_1")} dan {tex("z_2")}.</p>
        <p className="fragment">Himpunannya adalah <b>garis sumbu</b> (garis bagi tegak lurus) ruas {tex("z_1z_2")}.</p>
        <p className="fragment">Seret titik ungu ke garis hijau: dua jarak itu menjadi sama. Di luar garis, selalu ada yang lebih dekat.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={p} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildBis} maxH={360} />
        <div className={`ds-read ${eq ? "ds-ok" : ""}`}>
          |z − z₁| = {fmt(d1)} · |z − z₂| = {fmt(d2)} {eq ? "→ sama: z di garis sumbu" : d1 < d2 ? "→ z lebih dekat ke z₁" : "→ z lebih dekat ke z₂"}
        </div>
      </>}
    />
  );
}

/* ═════════ 15 · Bentuk polar ═════════ */
type PP = { r: number; th: number; step: number };
const buildPolar: Build<PP> = (b, g) => {
  reim(b);
  const P = (): Z => polar(g().r, g().th);
  ring(b, () => [0, 0], () => 1, C.line, 1.25, 2);
  ring(b, () => (g().step >= 2 ? [0, 0] : OFF), () => g().r, C.soft, 1.25, 3);
  seg(b, () => (g().step >= 1 ? P() : OFF), () => (g().step >= 1 ? [P()[0], 0] : OFF), C.blue, 1.75, 2);
  seg(b, () => (g().step >= 1 ? P() : OFF), () => (g().step >= 1 ? [0, P()[1]] : OFF), C.violet, 1.75, 2);
  arc(b, 0.9, () => 0, () => g().th, C.teal);
  arrow(b, () => [0, 0], P, C.orange, 3);
  dot(b, P, C.orange, 7, "z");
  note(b, () => [P()[0] / 2 + 0.15, P()[1] / 2 + 0.15], () => "r", C.teal);
};
function PolarSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [r, setR] = useState(3), [th, setTh] = useState(60);
  const z = polar(r, th);
  return (
    <Frame
      innerRef={ref}
      eyebrow="13 · Bentuk polar"
      title="Alamat dengan jarak dan arah"
      copy={<>
        <p>Selain (a, b), titik z dapat ditunjuk lewat <b>jarak r</b> dan <b>sudut θ</b>:</p>
        <p className="ds-math">{tex(raw`z=r(\cos\theta+i\sin\theta)`)}</p>
        <p className="fragment">Proyeksi ke sumbu memberi {tex(raw`a=r\cos\theta`)} dan {tex(raw`b=r\sin\theta`)}. Sebaliknya {tex(raw`r=\sqrt{a^2+b^2}`)}.</p>
        <p className="fragment">Hati-hati kuadran: {tex(raw`\tan\theta=\tfrac ba`)} punya dua sudut. Periksa tanda a dan b dulu.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ r, th, step }} build={buildPolar} maxH={340} />
        <div className="ds-controls">
          <Range label="r" value={r} min={0.5} max={6} step={0.5} onChange={setR} color={C.teal} />
          <Range label="θ" value={th} min={0} max={360} step={15} onChange={setTh} color={C.orange} shown={`${th}°`} />
        </div>
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`z=${nt(r)}(\\cos ${th}^\\circ+i\\sin ${th}^\\circ)=${cz(z)}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 16 · Perkalian polar ═════════ */
type PM = { r1: number; t1: number; r2: number; t2: number; step: number };
const buildPolMul: Build<PM> = (b, g) => {
  reim(b, [-7, 6, 7, -6]);
  const A = (): Z => polar(g().r1, g().t1), Bp = (): Z => polar(g().r2, g().t2);
  const R = (): Z => polar(g().r1 * g().r2, g().t1 + g().t2);
  const on = () => g().step >= 1;
  ring(b, () => (g().step >= 2 ? [0, 0] : OFF), () => g().r1 * g().r2, C.soft, 1.25, 3);
  arc(b, 0.8, () => 0, () => g().t1, C.blue);
  arc(b, 1.1, () => g().t1, () => g().t1 + g().t2, C.orange, on);
  arrow(b, () => [0, 0], A, C.blue, 2.5);
  arrow(b, () => [0, 0], Bp, C.orange, 2.5);
  arrow(b, () => (on() ? [0, 0] : OFF), () => (on() ? R() : OFF), C.violet, 3.25);
  dot(b, A, C.blue, 5, "z₁");
  dot(b, Bp, C.orange, 5, "z₂");
  dot(b, () => (on() ? R() : [NaN, NaN]), C.violet, 7, "z₁z₂");
};
function PolarMulSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [r1, setR1] = useState(2), [t1, setT1] = useState(30), [r2, setR2] = useState(1.5), [t2, setT2] = useState(60);
  return (
    <Frame
      innerRef={ref}
      eyebrow="14 · Perkalian polar"
      title="Kali = kalikan jarak, jumlahkan sudut"
      copy={<>
        <p>Dalam bentuk polar, perkalian menjadi sangat sederhana:</p>
        <p className="ds-math">{tex(raw`z_1z_2=r_1r_2\,\big(\cos(\theta_1+\theta_2)+i\sin(\theta_1+\theta_2)\big)`)}</p>
        <p className="fragment">Ubah θ₁ dan θ₂: busur oranye <b>menyambung</b> busur biru, jadi sudutnya dijumlahkan.</p>
        <p className="fragment">Lingkaran putus-putus berjari-jari {tex("r_1r_2")}: modulusnya dikalikan. Rumus {tex(raw`(ac-bd)+(ad+bc)i`)} tadi adalah isi di baliknya.</p>
      </>}
      stage={<>
        <SimBoard bbox={[-7, 6, 7, -6]} params={{ r1, t1, r2, t2, step }} build={buildPolMul} maxH={330} />
        <div className="ds-controls">
          <Range label="r₁" value={r1} min={0.5} max={2.5} step={0.5} onChange={setR1} color={C.blue} />
          <Range label="θ₁" value={t1} min={0} max={180} step={15} onChange={setT1} color={C.blue} shown={`${t1}°`} />
          <Range label="r₂" value={r2} min={0.5} max={2.5} step={0.5} onChange={setR2} color={C.orange} />
          <Range label="θ₂" value={t2} min={0} max={180} step={15} onChange={setT2} color={C.orange} shown={`${t2}°`} />
        </div>
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`r=${nt(r1)}\\cdot${nt(r2)}=${nt(r1 * r2)},\\quad \\theta=${t1}^\\circ+${t2}^\\circ=${t1 + t2}^\\circ`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 17 · Kali = putar + perbesar ═════════ */
type RS = { w: Z; t: number };
const TRI: Z[] = [[1, 0.5], [3, 0.5], [1, 2]];
const buildSpin: Build<RS> = (b, g) => {
  reim(b);
  const M = (p: Z): Z => {
    const w = g().w, k = Math.max(0.02, cabs(w)) ** g().t, a = (argDeg(w) > 180 ? argDeg(w) - 360 : argDeg(w)) * g().t;
    return cmul(p, polar(k, a));
  };
  shape(b, () => TRI, { strokeColor: C.blue, strokeWidth: 2.5, fillColor: C.blue, fillOpacity: 0.1 });
  shape(b, () => TRI.map(M), { strokeColor: C.orange, strokeWidth: 3, fillColor: C.orange, fillOpacity: 0.16 });
  TRI.forEach((p, i) => {
    dot(b, () => p, C.blue, 4, "ABC"[i]);
    dot(b, () => M(p), C.orange, 4, `${"ABC"[i]}′`);
  });
};
const SPINS: { k: string; w: Z; note: string }[] = [
  { k: "×i", w: [0, 1], note: "diputar 90°, ukuran tetap" },
  { k: "×(−1)", w: [-1, 0], note: "diputar 180° (setengah putaran)" },
  { k: "×(−i)", w: [0, -1], note: "diputar −90°, ukuran tetap" },
  { k: "×2", w: [2, 0], note: "tidak diputar, diperbesar 2 kali" },
  { k: "×(1+i)", w: [1, 1], note: "diputar 45° dan diperbesar √2 kali" },
  { k: "×2i", w: [0, 2], note: "diputar 90° dan diperbesar 2 kali" },
];
function SpinSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [key, setKey] = useState("×i");
  const [goal, setGoal] = useState(1);
  const t = useTween(goal, 800);
  useEffect(() => {
    setGoal(0);
    const id = window.setTimeout(() => setGoal(1), 350);
    return () => window.clearTimeout(id);
  }, [key]);
  const s = SPINS.find((x) => x.k === key)!;
  return (
    <Frame
      innerRef={ref}
      eyebrow="15 · Tafsir geometri"
      title="Mengalikan = memutar dan memperbesar"
      copy={<>
        <p>Mengalikan semua titik dengan bilangan tetap {tex("w")} adalah transformasi: <b>diputar sebesar arg w</b> dan <b>diperbesar |w| kali</b>.</p>
        <p className="fragment">Inilah <b>rotasi</b> dan <b>dilatasi</b> dari materi transformasi geometri, kini hanya satu perkalian.</p>
        <p className="fragment">Karena {tex(raw`i=\cos 90^\circ+i\sin 90^\circ`)}, mengalikan dengan i selalu memutar 90° berlawanan arah jarum jam.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ w: s.w, t }} build={buildSpin} maxH={330} />
        <Chips value={key} onPick={setKey} items={SPINS.map((x) => ({ v: x.k, label: x.k }))} />
        <div className="ds-read">
          {step >= 1 && <>|w| = {fmt(cabs(s.w))} · arg w = {fmt(argDeg(s.w) > 180 ? argDeg(s.w) - 360 : argDeg(s.w), 0)}° → </>}
          bangun {s.note} <Btn onClick={() => setGoal((v) => (v ? 0 : 1))}>Ulangi</Btn>
        </div>
      </>}
    />
  );
}

/* ═════════ 18 · Teorema De Moivre ═════════ */
type DM = { r: number; th: number; n: number; step: number };
const SUP = ["z", "z²", "z³", "z⁴", "z⁵", "z⁶"];
const buildMoivre: Build<DM> = (b, g) => {
  reim(b, [-8, 7, 8, -7]);
  const Pk = (k: number): Z => polar(g().r ** k, g().th * k);
  ring(b, () => [0, 0], () => 1, C.line, 1.25, 2);
  shape(b, () => (g().step >= 1 ? [[0, 0], ...Array.from({ length: g().n }, (_, i) => Pk(i + 1))] : null), { strokeColor: C.soft, strokeWidth: 1.5, dash: 2 }, false);
  SUP.forEach((nm, i) => dot(b, () => (i < g().n ? Pk(i + 1) : [NaN, NaN]), i === 0 ? C.blue : C.orange, i === 0 ? 6 : 5, nm));
};
function MoivreSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [r, setR] = useState(1.2), [th, setTh] = useState(30), [k, setK] = useState(4);
  const rn = r ** k, ang = (th * k) % 360;
  return (
    <Frame
      innerRef={ref}
      eyebrow="16 · Teorema De Moivre"
      title="Pangkat = putar berulang"
      copy={<>
        <p>Mengalikan z dengan dirinya sendiri berulang kali menambah sudut berulang kali:</p>
        <p className="ds-math">{tex(raw`z^n=r^n\big(\cos n\theta+i\sin n\theta\big)`)}</p>
        <p className="fragment">Titik {tex("z,z^2,z^3,\\dots")} membentuk <b>spiral</b>: sudut naik θ tiap langkah, jarak dikali r.</p>
        <p className="fragment">Pada r = 1 spiralnya menjadi <b>lingkaran</b>: hanya berputar, tidak membesar. Contoh {tex(raw`(1+i)^8=16`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={[-8, 7, 8, -7]} params={{ r, th, n: k, step }} build={buildMoivre} maxH={340} />
        <div className="ds-controls">
          <Range label="r" value={r} min={0.7} max={1.3} step={0.1} onChange={setR} color={C.teal} />
          <Range label="θ" value={th} min={10} max={120} step={5} onChange={setTh} color={C.orange} shown={`${th}°`} />
          <Range label="n" value={k} min={1} max={6} onChange={setK} color={C.violet} />
          <Btn onClick={() => setR(1)}>r = 1</Btn>
        </div>
        <div className="ds-read">
          |zⁿ| = rⁿ = {fmt(rn)} · arg(zⁿ) = {k}·{th}° = {k * th}° {k * th >= 360 ? `≡ ${ang}°` : ""}
        </div>
      </>}
    />
  );
}

/* ═════════ 19 · Akar ke-n ═════════ */
type RT = { n: number; R: number; phi: number; step: number };
const ZN = ["z₀", "z₁", "z₂", "z₃", "z₄", "z₅", "z₆", "z₇"];
const rootAt = (p: { n: number; R: number; phi: number }, k: number): Z => polar(p.R ** (1 / p.n), (p.phi + 360 * k) / p.n);
const buildRoots2: Build<RT> = (b, g) => {
  reim(b, [-4, 3.5, 4, -3.5]);
  ring(b, () => [0, 0], () => g().R ** (1 / g().n), C.line, 1.5, 2);
  shape(b, () => (g().step >= 1 ? Array.from({ length: g().n }, (_, k) => rootAt(g(), k)) : null), { strokeColor: C.violet, strokeWidth: 2, fillColor: C.violet, fillOpacity: 0.08 });
  ZN.forEach((nm, k) => {
    seg(b, () => (g().step >= 2 && k < g().n ? [0, 0] : OFF), () => (g().step >= 2 && k < g().n ? rootAt(g(), k) : OFF), C.soft, 1, 3);
    dot(b, () => (k < g().n ? rootAt(g(), k) : [NaN, NaN]), k === 0 ? C.orange : C.violet, 6, nm);
  });
};
function NthRootSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [nn, setN] = useState(3), [R, setR] = useState(1), [phi, setPhi] = useState(0);
  const rr = R ** (1 / nn);
  const sum = Array.from({ length: nn }, (_, k) => rootAt({ n: nn, R, phi }, k)).reduce((s, q) => cadd(s, q), [0, 0] as Z);
  return (
    <Frame
      innerRef={ref}
      eyebrow="17 · Akar ke-n"
      title="Akar-akarnya membentuk poligon"
      copy={<>
        <p>Persamaan {tex(raw`z^n=R(\cos\varphi+i\sin\varphi)`)} punya <b>tepat n akar</b>:</p>
        <p className="ds-math">{tex(raw`z_k=\sqrt[n]{R}\Big(\cos\tfrac{\varphi+360^\circ k}{n}+i\sin\tfrac{\varphi+360^\circ k}{n}\Big)`)}</p>
        <p className="fragment">Semuanya di lingkaran berjari-jari {tex(raw`\sqrt[n]{R}`)}, berjarak sudut sama: <b>segi-n beraturan</b>.</p>
        <p className="fragment">Pada {tex("R=1,\\ \\varphi=0")}, inilah <b>akar satuan</b>. Jumlah semua akarnya selalu 0 (untuk n ≥ 2).</p>
      </>}
      stage={<>
        <SimBoard bbox={[-4, 3.5, 4, -3.5]} params={{ n: nn, R, phi, step }} build={buildRoots2} maxH={330} />
        <div className="ds-controls">
          <Range label="n" value={nn} min={2} max={8} onChange={setN} color={C.violet} />
          <Range label="R" value={R} min={1} max={8} onChange={setR} color={C.blue} />
          <Range label="φ" value={phi} min={0} max={345} step={15} onChange={setPhi} color={C.orange} shown={`${phi}°`} />
        </div>
        <div className="ds-read">
          jari-jari = ⁿ√R = {fmt(rr)} · selisih sudut = {fmt(360 / nn, 0)}° · Σ akar = {fmt(sum[0])} + {fmt(Math.abs(sum[1]))}i
        </div>
      </>}
    />
  );
}

/* ═════════ 20 · Rumus Euler (pengayaan) ═════════ */
const buildEuler: Build<{ th: number; step: number }> = (b, g) => {
  reim(b, [-3, 2.4, 3, -2.4]);
  const P = (): Z => [Math.cos(rad(g().th)), Math.sin(rad(g().th))];
  ring(b, () => [0, 0], () => 1, C.soft, 1.75);
  seg(b, () => [0, 0], () => [P()[0], 0], C.teal, 4);
  seg(b, () => [P()[0], 0], P, C.violet, 4);
  arc(b, 0.35, () => 0, () => g().th, C.orange);
  arrow(b, () => [0, 0], P, C.orange, 3);
  dot(b, P, C.orange, 7);
  note(b, () => [P()[0] / 2 - 0.2, -0.45 + (P()[1] < 0 ? 0.6 : 0)], () => "cos θ", C.teal);
  note(b, () => [P()[0] + 0.1, P()[1] / 2], () => "sin θ", C.violet);
};
function EulerSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [th, setTh] = useState(60);
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  return (
    <Frame
      innerRef={ref}
      eyebrow="Pengayaan · Rumus Euler"
      title="e berpangkat imajiner"
      copy={<>
        <p>Euler menemukan bahwa titik di lingkaran satuan dapat ditulis sebagai pangkat:</p>
        <p className="ds-math">{tex(raw`e^{i\theta}=\cos\theta+i\sin\theta`)}</p>
        <p className="fragment">Dengan θ dalam <b>radian</b>. Bentuk polar menjadi ringkas: {tex(raw`z=re^{i\theta}`)}, dan perkalian = jumlahkan pangkat.</p>
        <p className="fragment">Pada {tex(raw`\theta=\pi`)} (setengah putaran): {tex(raw`e^{i\pi}+1=0`)}, yang mempertemukan lima konstanta termasyhur {tex(raw`e,i,\pi,1,0`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={[-3, 2.4, 3, -2.4]} params={{ th, step }} build={buildEuler} maxH={320} />
        <Chips value={String(th)} onPick={(v) => setTh(Number(v))}
          items={[{ v: "90", label: "θ = π/2" }, { v: "180", label: "θ = π" }, { v: "270", label: "θ = 3π/2" }, { v: "360", label: "θ = 2π" }]} />
        <div className="ds-controls ds-controls--one">
          <Range label="θ" value={th} min={0} max={360} step={5} onChange={setTh} color={C.orange} shown={`${th}° = ${fmt(rad(th))} rad`} />
        </div>
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(`e^{i\\theta}=\\cos\\theta+i\\sin\\theta=${cx(c, s)}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 21 · Aplikasi: himpunan Mandelbrot ═════════ */
const MB: BBox = [-2.5, 1.4, 1.1, -1.4];
let MB_URL = "";
function mandelURL() {
  if (MB_URL) return MB_URL;
  const W = 240, H = 187, cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(W, H);
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const cr = MB[0] + ((px + 0.5) / W) * (MB[2] - MB[0]), ci = MB[1] - ((py + 0.5) / H) * (MB[1] - MB[3]);
      let x = 0, y = 0, k = 0;
      while (k < 40 && x * x + y * y <= 4) { const t = x * x - y * y + cr; y = 2 * x * y + ci; x = t; k++; }
      const i = (py * W + px) * 4, inside = k === 40, f = k / 40;
      img.data[i] = inside ? 203 : 255 - 36 * Math.sqrt(f);
      img.data[i + 1] = inside ? 213 : 255 - 21 * Math.sqrt(f);
      img.data[i + 2] = inside ? 225 : 255 - 1 * Math.sqrt(f);
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  MB_URL = cv.toDataURL("image/png");
  return MB_URL;
}
const orbit = (c: Z, N = 40) => {
  let z: Z = [0, 0];
  const pts: Z[] = [z];
  let esc = -1;
  for (let k = 1; k <= N; k++) {
    z = cadd(cmul(z, z), c); pts.push(z);
    if (cabs(z) > 2) { esc = k; break; }
  }
  return { pts, esc };
};
type MBP = { c: Z; nonce: number; step: number };
const buildMandel: Build<MBP> = (b, g, s) => {
  try {
    const u = mandelURL();
    if (u) mk(b, "image", [u, [MB[0], MB[3]], [MB[2] - MB[0], MB[1] - MB[3]]], { ...still });
  } catch { /* gambar latar gagal: papan tetap berfungsi */ }
  reim(b, MB);
  const Cg = grab(b, g, s, "c", C.orange, "c", 0);
  const O = () => orbit(Cg());
  shape(b, () => (g().step >= 1 ? O().pts : null), { strokeColor: C.violet, strokeWidth: 1.5 }, false);
  for (let k = 0; k <= 40; k++) dot(b, () => (g().step >= 1 && k < O().pts.length ? O().pts[k] : [NaN, NaN]), C.violet, 3);
  dot(b, () => (g().step >= 1 && O().esc > 0 ? O().pts[O().pts.length - 1] : [NaN, NaN]), C.red, 5);
};
const MBP_PRESET: { k: string; c: Z }[] = [
  { k: "c = 0", c: [0, 0] }, { k: "c = −1", c: [-1, 0] }, { k: "c = i", c: [0, 1] },
  { k: "c = −2", c: [-2, 0] }, { k: "c = 0,5", c: [0.5, 0] },
];
function MandelbrotSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [p, setP] = useState<MBP>({ c: [-0.4, 0.6], nonce: 0, step: 0 });
  const o = orbit(p.c);
  return (
    <Frame
      innerRef={ref}
      eyebrow="Aplikasi · Fraktal"
      title="Satu rumus, satu bentuk tak berhingga"
      copy={<>
        <p>Mulai dari {tex("z_0=0")}, ulangi {tex(raw`z_{k+1}=z_k^2+c`)}. Apakah |z| tetap terkurung?</p>
        <p className="fragment">Seret c. <b>Abu-abu</b> = c yang orbitnya terkurung (himpunan Mandelbrot); <b>putih</b> = orbit lolos (|z| &gt; 2).</p>
        <p className="fragment">Bentuk serumit ini hanya memakai <b>kuadrat dan penjumlahan</b> bilangan kompleks. Coba c = −1: orbitnya bergantian antara 0 dan −1.</p>
      </>}
      stage={<>
        <SimBoard bbox={MB} params={{ ...p, step }} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildMandel} maxH={340} />
        <Chips value="" onPick={(v) => { const q = MBP_PRESET.find((x) => x.k === v)!.c; setP((s) => ({ ...s, c: q, nonce: s.nonce + 1 })); }}
          items={MBP_PRESET.map((x) => ({ v: x.k, label: x.k }))} />
        <div className={`ds-read ${o.esc > 0 ? "ds-bad" : "ds-ok"}`}>
          c = {fmt(p.c[0])} {sgn(p.c[1])} {fmt(Math.abs(p.c[1]))}i → {o.esc > 0 ? `lolos setelah ${o.esc} langkah` : "terkurung (hingga 40 langkah)"}
        </div>
      </>}
    />
  );
}

/* ═════════ 22 · Aplikasi: impedansi rangkaian AC ═════════ */
type IM = { R: number; L: number; Cc: number };
const buildImp: Build<IM> = (b, g) => {
  reim(b, [-2, 7, 10, -7]);
  const X = () => g().L - g().Cc;
  arrow(b, () => [0, 0], () => [g().R, 0], C.blue, 3);
  arrow(b, () => [g().R, 0], () => [g().R, g().L], C.violet, 3);
  arrow(b, () => [g().R, g().L], () => [g().R, X()], C.orange, 3);
  arrow(b, () => [0, 0], () => [g().R, X()], C.ink, 3.5);
  arc(b, 1.2, () => 0, () => (Math.atan2(X(), g().R) * 180) / Math.PI, C.teal);
  dot(b, () => [g().R, X()], C.ink, 6);
  note(b, () => [g().R / 2 - 0.3, -0.9], () => "R", C.blue);
  note(b, () => [g().R + 0.2, g().L / 2], () => "X_L", C.violet);
  note(b, () => [g().R + 0.2, (g().L + X()) / 2 - 0.2], () => "X_C", C.orange);
  note(b, () => [g().R / 2 - 1.6, X() / 2 + (X() >= 0 ? 0.3 : -0.9)], () => "Z", C.ink);
};
function ImpedanceSlide() {
  const [R, setR] = useState(4), [L, setL] = useState(6), [Cc, setC] = useState(3);
  const X = L - Cc, Zm = Math.hypot(R, X), phi = (Math.atan2(X, R) * 180) / Math.PI;
  return (
    <Frame
      eyebrow="Aplikasi · Listrik arus bolak-balik"
      title="Impedansi: bilangan kompleks di rangkaian"
      copy={<>
        <p>Pada rangkaian RLC seri, hambatan total (<b>impedansi</b>) adalah bilangan kompleks:</p>
        <p className="ds-math">{tex(raw`Z=R+j\,(X_L-X_C)`)}</p>
        <p className="fragment">Insinyur menulis <b>j</b> (bukan i) karena i sudah dipakai untuk arus. {tex(raw`|Z|`)} menentukan besar arus, argumennya adalah <b>beda fase</b> tegangan dan arus.</p>
        <p className="fragment">Saat {tex("X_L=X_C")}, bagian imajiner lenyap: <b>resonansi</b>, Z paling kecil dan hanya real.</p>
      </>}
      stage={<>
        <SimBoard bbox={[-2, 7, 10, -7]} params={{ R, L, Cc }} build={buildImp} maxH={330} />
        <div className="ds-controls">
          <Range label="R (Ω)" value={R} min={0} max={8} onChange={setR} color={C.blue} />
          <Range label="X_L (Ω)" value={L} min={0} max={6} onChange={setL} color={C.violet} />
          <Range label="X_C (Ω)" value={Cc} min={0} max={6} onChange={setC} color={C.orange} />
        </div>
        <div className="ds-read">
          Z = {fmt(R, 0)} {sgn(X)} j{fmt(Math.abs(X), 0)} Ω · |Z| = {fmt(Zm)} Ω · φ = {fmt(phi, 1)}°
          {X === 0 ? " · resonansi" : X > 0 ? " · bersifat induktif" : " · bersifat kapasitif"}
        </div>
      </>}
    />
  );
}

/* ═════════ 23 · Tantangan 1: tebak hasil kali ═════════ */
type G1 = { z1: Z; z2: Z; guess: Z | null };
const ri = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
function newQ(): { z1: Z; z2: Z } {
  for (let i = 0; i < 200; i++) {
    const z1: Z = [ri(-3, 3), ri(-3, 3)], z2: Z = [ri(-2, 2), ri(-2, 2)], p = cmul(z1, z2);
    if (cabs(z1) < 1.5 || cabs(z2) < 1.5) continue;
    if (Math.abs(p[0]) <= 6 && Math.abs(p[1]) <= 4) return { z1, z2 };
  }
  return { z1: [2, 1], z2: [1, 1] };
}
const buildGuess: Build<G1> = (b, g, s) => {
  reim(b);
  arrow(b, () => [0, 0], () => g().z1, C.blue, 2.5);
  arrow(b, () => [0, 0], () => g().z2, C.orange, 2.5);
  dot(b, () => g().z1, C.blue, 5, "z₁");
  dot(b, () => g().z2, C.orange, 5, "z₂");
  const P = (): Z => cmul(g().z1, g().z2);
  arrow(b, () => (g().guess ? [0, 0] : OFF), () => (g().guess ? P() : OFF), C.violet, 3);
  dot(b, () => (g().guess ? P() : [NaN, NaN]), C.violet, 7, "z₁z₂");
  dot(b, () => g().guess ?? [NaN, NaN], C.red, 6, "tebakan");
  b.on("down", (e: any) => {
    if (g().guess) return;
    const u = b.getUsrCoordsOfMouse(e);
    s({ guess: [Math.round(u[0]), Math.round(u[1])] });
  });
};
function GuessSlide() {
  const [p, setP] = useState<G1>(() => ({ ...newQ(), guess: null }));
  const tgt = cmul(p.z1, p.z2);
  const off = p.guess ? cabs([p.guess[0] - tgt[0], p.guess[1] - tgt[1]]) : null;
  return (
    <Frame
      eyebrow="Latihan · Tantangan 1"
      title="Tebak dulu, baru lihat"
      copy={<>
        <p>Hitung dahulu di kertas: {tex(`(${cz(p.z1)})(${cz(p.z2)})`)}.</p>
        <p>Lalu <b>klik</b> pada bidang di tempat Anda memperkirakan hasilnya. Titik ungu menunjukkan jawaban sebenarnya.</p>
        <p className="ds-muted">Petunjuk: perkirakan dulu modulusnya (kali) dan sudutnya (tambah).</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={p} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildGuess} maxH={360} />
        <div className="ds-read ds-math">
          {off === null && <>Klik letak z₁z₂.</>}
          {off !== null && off < 0.5 && <span className="ds-ok">Tepat! {tex(`z_1z_2=${cz(tgt)}`)} </span>}
          {off !== null && off >= 0.5 && <span className="ds-bad">Selisih {fmt(off, 1)} satuan. Jawaban: {tex(`z_1z_2=${cz(tgt)}`)} </span>}
          <Btn onClick={() => setP({ ...newQ(), guess: null })}>Soal baru</Btn>
        </div>
      </>}
    />
  );
}

/* ═════════ 24 · Tantangan 2: menyusun persamaan kuadrat ═════════ */
type G2 = { p: number; q: number; t: Z };
const quad = (p: number, q: number) =>
  `x^2${p === 0 ? "" : p < 0 ? `-${nt(-p)}x` : `+${nt(p)}x`}${q === 0 ? "" : `+${nt(q)}`}=0`;
const buildFit: Build<G2> = (b, g) => {
  reim(b);
  const X = (i: number): Z => {
    const D = g().p * g().p - 4 * g().q;
    if (D >= 0) { const s = Math.sqrt(D) / 2; return [-g().p / 2 + (i ? s : -s), 0]; }
    return [-g().p / 2, (i ? 1 : -1) * Math.sqrt(-D) / 2];
  };
  [1, -1].forEach((sg) => mk(b, "point", [() => g().t[0], () => sg * g().t[1]], {
    ...still, name: "", withLabel: false, size: 11, fillColor: "#fff", strokeColor: C.violet, strokeWidth: 3,
  }));
  seg(b, () => X(0), () => X(1), C.orange, 1.25, 2);
  [0, 1].forEach((i) => dot(b, () => X(i), C.orange, 5));
};
const TARGETS: { k: string; t: Z }[] = [
  { k: "1 ± 2i", t: [1, 2] }, { k: "−2 ± i", t: [-2, 1] }, { k: "3 ± 2i", t: [3, 2] }, { k: "±3i", t: [0, 3] },
];
function FitSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [key, setKey] = useState("1 ± 2i");
  const [p, setP] = useState(0), [q, setQ] = useState(1);
  const t = TARGETS.find((x) => x.k === key)!.t;
  const D = p * p - 4 * q;
  const hit = D < 0 && Math.abs(-p / 2 - t[0]) < 1e-9 && Math.abs(Math.sqrt(-D) / 2 - t[1]) < 1e-9;
  return (
    <Frame
      innerRef={ref}
      eyebrow="Latihan · Tantangan 2"
      title="Susun persamaan dari akarnya"
      copy={<>
        <p>Atur {tex("p")} dan {tex("q")} pada {tex("x^2+px+q=0")} sampai kedua akar (titik oranye) menutupi lingkaran ungu.</p>
        <p className="fragment">Petunjuk: untuk akar sekawan, <b>jumlah akar = −p</b> dan <b>hasil kali = q</b> (ingat {tex(raw`z\bar z=|z|^2`)}).</p>
        <p className="fragment">Hitung sendiri dari akar sasaran, lalu periksa pada simulasi.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ p, q, t }} build={buildFit} maxH={330} />
        <Chips value={key} onPick={(v) => { setKey(v); setP(0); setQ(1); }} items={TARGETS.map((x) => ({ v: x.k, label: `akar ${x.k}` }))} />
        <div className="ds-controls">
          <Range label="p" value={p} min={-8} max={8} onChange={setP} color={C.blue} />
          <Range label="q" value={q} min={0} max={20} onChange={setQ} color={C.orange} />
        </div>
        <div className={`ds-read ds-math ${hit ? "ds-ok" : ""}`}>
          {hit ? <>✓ Cocok: {tex(quad(p, q))}</> : <>{tex(quad(p, q))} · D = {D}</>}
          {step >= 2 && !hit && <span className="ds-muted"> · jumlah akar sasaran = {fmt(2 * t[0], 0)}, hasil kali = {fmt(t[0] ** 2 + t[1] ** 2, 0)}</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 25 · Ringkasan ═════════ */
function SummarySlide() {
  const rows: [string, string][] = [
    ["Satuan imajiner", raw`i^2=-1,\quad i^{4k}=1`],
    ["Bentuk umum", raw`z=a+bi,\quad \operatorname{Re}z=a,\ \operatorname{Im}z=b`],
    ["Sekawan", raw`\bar z=a-bi,\quad z\bar z=a^2+b^2`],
    ["Modulus", raw`|z|=\sqrt{a^2+b^2},\quad |z_1z_2|=|z_1||z_2|`],
    ["Kali", raw`(a+bi)(c+di)=(ac-bd)+(ad+bc)i`],
    ["Bagi", raw`\dfrac{z_1}{z_2}=\dfrac{z_1\bar z_2}{|z_2|^2}`],
    ["Polar", raw`z=r(\cos\theta+i\sin\theta)=re^{i\theta}`],
    ["Kali polar", raw`z_1z_2=r_1r_2\,\mathrm{cis}(\theta_1+\theta_2)`],
    ["De Moivre", raw`z^n=r^n\,\mathrm{cis}(n\theta)`],
    ["Akar ke-n", raw`z_k=\sqrt[n]{r}\,\mathrm{cis}\dfrac{\theta+360^\circ k}{n},\ k=0,\dots,n-1`],
    ["Kuadrat, D < 0", raw`x=\dfrac{-b\pm i\sqrt{-D}}{2a}\ (\text{sekawan})`],
  ];
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Satu tabel, satu bilangan baru"
      copy={<>
        <p>Setiap rumus di tabel sudah Anda <b>lihat bergerak</b> di bidang kompleks, bukan sekadar dihafal.</p>
        <p className="fragment">Tiga gagasan besar: i menciptakan sumbu kedua; kali = putar dan perbesar; pangkat dan akar = putaran berulang.</p>
        <p className="fragment">Sekarang uji pemahaman dengan kuis.</p>
      </>}
      stage={
        <table className="ds-table" style={{ fontSize: 16 }}>
          <tbody>{rows.map(([a, t]) => <tr key={a}><th style={{ whiteSpace: "nowrap" }}>{a}</th><td>{tex(t)}</td></tr>)}</tbody>
        </table>
      }
    />
  );
}

export function BilanganKompleksDeck() {
  return (
    <SlideDeck>
      <TitleSlide />
      <WhySlide />
      <HistorySlide />
      <PowerSlide />
      <KindSlide />
      <ArgandSlide />
      <ConjugateSlide />
      <SumSlide />
      <MulSlide />
      <DivSlide />
      <RootTrapSlide />
      <QuadraticSlide />
      <ModulusSlide />
      <LocusSlide />
      <BisectorSlide />
      <PolarSlide />
      <PolarMulSlide />
      <SpinSlide />
      <MoivreSlide />
      <NthRootSlide />
      <EulerSlide />
      <MandelbrotSlide />
      <ImpedanceSlide />
      <GuessSlide />
      <FitSlide />
      <SummarySlide />
      <Quiz eyebrow="Latihan · Kuis" title="Kuis 13 soal" items={QUIZ} />
    </SlideDeck>
  );
}
export default BilanganKompleksDeck;
