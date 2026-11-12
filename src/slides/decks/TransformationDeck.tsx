/* eslint-disable @typescript-eslint/no-explicit-any */
import JXG from "jsxgraph";
import { useEffect, useRef, useState } from "react";
import { SimMath } from "../../simulation/common/components/SimMath";
import { texNumber } from "../../simulation/common/utils/simUtils";
import {
  add, arrow, Btn, C, Chips, dil, dot, fmt, Frame, mirror, mk, note, OFF, Range, rad, rot, seg, shape,
  SimBoard, SlideDeck, still, useStep, useTween,
  type B, type BBox, type Build, type Vec,
} from "../common/core";

/* Slide "Transformasi geometri": penjelasan (fragmen) menggerakkan simulasi. */

const BB: BBox = [-7, 6, 7, -6];
const NONE = {};
const TRI: Vec[] = [[1, 1], [4, 1], [2, 3]];
const NM = ["A", "B", "C"];
const tex = (s: string) => <SimMath tex={s} />;
const blue = { strokeColor: C.blue, strokeWidth: 2.5, fillColor: C.blue, fillOpacity: 0.1 };
const orange = { strokeColor: C.orange, strokeWidth: 3, fillColor: C.orange, fillOpacity: 0.16 };

/** Titik pusat yang bisa diseret (menempel ke bilangan bulat). */
function pivot(b: B, x: number, y: number, onMove: (x: number, y: number) => void) {
  const c = mk(b, "point", [x, y], {
    name: "pusat", size: 5, fillColor: C.violet, strokeColor: "#fff", strokeWidth: 2,
    snapToGrid: true, snapSizeX: 1, snapSizeY: 1, highlight: false, showInfobox: false,
    label: { fontSize: 13, strokeColor: C.violet, offset: [8, -16] },
  });
  c.on("drag", () => onMove(Math.round(c.X()), Math.round(c.Y())));
  return c;
}

/* ═════════ 0 · Judul: empat gerakan berulang ═════════ */
const PH = ["Translasi", "Refleksi", "Rotasi", "Dilatasi"];
const TT: Vec[] = [[1, 1], [3, 1], [1.5, 2.5]];
const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
const morph = (i: number, u: number, p: Vec): Vec =>
  i === 0 ? [p[0] + 3 * u, p[1] + u]
  : i === 1 ? [p[0] * Math.cos(Math.PI * u), p[1]]
  : i === 2 ? rot(p, [0, 0], 120 * u)
  : dil(p, [0, 0], 1 + u);
const phase = (t: number) => {
  const s = t / 3.2, f = s - Math.floor(s);
  return { i: Math.floor(s) % 4, u: ease(Math.min(1, Math.max(0, (f - 0.1) / 0.65))) };
};
const buildTitle: Build<object> = (b, _g, _s, clock) => {
  shape(b, () => TT, blue);
  shape(b, () => { const { i, u } = phase(clock()); return TT.map((p) => morph(i, u, p)); }, orange);
  note(b, () => [-6.6, 5.1], () => PH[phase(clock()).i].toUpperCase(), C.mute);
};
function TitleSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi"
      title="Transformasi geometri"
      copy={<>
        <p>Translasi, refleksi, rotasi, dan dilatasi: empat cara memindahkan bangun, satu aturan yang sama.</p>
        <p className="ds-muted">Tekan <b>→</b> untuk melangkah. Setiap kalimat baru ikut menggerakkan simulasinya.</p>
      </>}
      stage={<SimBoard bbox={BB} params={NONE} build={buildTitle} loop />}
    />
  );
}

/* ═════════ 1 · Peta: isometri atau bukan ═════════ */
function MapSlide() {
  return (
    <Frame
      eyebrow="Peta besar"
      title="Apa yang berubah, apa yang tetap?"
      copy={<>
        <p>Transformasi memetakan tiap titik <b>P(x, y)</b> ke <b>P′(x′, y′)</b> menurut satu aturan.</p>
        <p className="fragment">Tiga di antaranya <b>isometri</b>: jarak antartitik tidak berubah.</p>
        <p className="fragment">Dilatasi mengubah ukuran, tetapi bentuknya tetap sebangun.</p>
      </>}
      stage={
        <table className="ds-table">
          <thead><tr><th /><th>Ukuran</th><th>Bentuk</th><th>Arah putar ABC</th></tr></thead>
          <tbody>
            <tr><th>Translasi</th><td>tetap</td><td>sama</td><td>tetap</td></tr>
            <tr><th>Refleksi</th><td>tetap</td><td>sama</td><td style={{ color: C.red }}>terbalik</td></tr>
            <tr><th>Rotasi</th><td>tetap</td><td>sama</td><td>tetap</td></tr>
            <tr><th>Dilatasi</th><td style={{ color: C.orange }}>× |k|</td><td>sebangun</td><td>tetap</td></tr>
          </tbody>
        </table>
      }
    />
  );
}

/* ═════════ 2 · Translasi ═════════ */
type TP = { a: number; b: number; t: number; guide: boolean };
const buildTrans: Build<TP> = (b, g) => {
  const img = (p: Vec): Vec => [p[0] + g().a * g().t, p[1] + g().b * g().t];
  const moved = () => g().t > 0.001;
  shape(b, () => TRI, blue);
  shape(b, () => (moved() ? TRI.map(img) : null), orange);
  TRI.forEach((p, i) => {
    arrow(b, () => (g().guide && moved() ? p : OFF), () => (g().guide && moved() ? img(p) : OFF), C.violet, 1.75, 2);
    dot(b, () => p, C.blue, 4, NM[i]);
    dot(b, () => (moved() ? img(p) : [NaN, NaN]), C.orange, 4, `${NM[i]}′`);
  });
};
function TranslationSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [a, setA] = useState(4);
  const [bb, setB] = useState(2);
  const [goal, setGoal] = useState(0);
  useEffect(() => setGoal(step >= 1 ? 1 : 0), [step]);
  const t = useTween(goal, 900);
  return (
    <Frame
      innerRef={ref}
      eyebrow="01 · Translasi"
      title="Menggeser tanpa memutar"
      copy={<>
        <p>Setiap titik berpindah <b>sejauh dan searah</b> yang sama.</p>
        <p className="ds-math">{tex(String.raw`(x',\,y')=(x+a,\;y+b)`)}</p>
        <p className="fragment">Seluruh bangun ikut bergeser; bentuk dan ukurannya tidak berubah.</p>
        <p className="fragment">Semua panah ungu sama panjang dan sama arah: itulah <b>vektor translasi</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ a, b: bb, t, guide: step >= 2 }} build={buildTrans} />
        <div className="ds-controls">
          <Range label={tex("a")} value={a} min={-6} max={6} onChange={setA} color={C.orange} />
          <Range label={tex("b")} value={bb} min={-5} max={5} onChange={setB} color={C.orange} />
        </div>
        <div className="ds-read">A(1, 1) → A′({1 + a}, {1 + bb}) <Btn onClick={() => setGoal((v) => (v ? 0 : 1))}>Ulangi geseran</Btn></div>
      </>}
    />
  );
}

/* ═════════ 3 · Refleksi ═════════ */
type RP = { phi: number; d: number; link: boolean };
const buildRefl: Build<RP> = (b, g) => {
  const M = (p: Vec) => mirror(p, g().phi, g().d);
  const ends = (): [Vec, Vec] => {
    const r = rad(g().phi), u = [Math.cos(r), Math.sin(r)], o = [-g().d * u[1], g().d * u[0]];
    return [[o[0] - 30 * u[0], o[1] - 30 * u[1]], [o[0] + 30 * u[0], o[1] + 30 * u[1]]];
  };
  seg(b, () => ends()[0], () => ends()[1], C.violet, 2.5, 3);
  shape(b, () => TRI, blue);
  shape(b, () => TRI.map(M), orange);
  TRI.forEach((p, i) => {
    seg(b, () => (g().link ? p : OFF), () => (g().link ? M(p) : OFF), C.violet, 1.25, 2);
    dot(b, () => p, C.blue, 4, NM[i]);
    dot(b, () => M(p), C.orange, 4, `${NM[i]}′`);
  });
};
function ReflectionSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [phi, setPhi] = useState(90);
  const [d, setD] = useState(0);
  const n: Vec = [-Math.sin(rad(phi)), Math.cos(rad(phi))];
  const dist = (p: Vec) => Math.abs(p[0] * n[0] + p[1] * n[1] - d);
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · Refleksi"
      title="Bayangan di cermin"
      copy={<>
        <p>Cermin (garis ungu) berada <b>tepat di tengah</b> antara titik dan bayangannya.</p>
        <p className="ds-math">{tex(String.raw`(x,y)\xrightarrow{\text{sumbu } x}(x,-y)`)}</p>
        <p className="fragment">Hubungkan tiap titik dengan bayangannya: garis itu <b>tegak lurus</b> cermin.</p>
        <p className="fragment">Seret cermin: jarak A dan A′ ke cermin selalu sama. Bangun jadi <b>terbalik</b> arah putarnya.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ phi, d, link: step >= 1 }} build={buildRefl} />
        <Chips value={`${phi}|${d}`} onPick={(v) => { setPhi(Number(v.split("|")[0])); setD(0); }}
          items={[{ v: "0|0", label: "sumbu x" }, { v: "90|0", label: "sumbu y" }, { v: "45|0", label: "y = x" }, { v: "135|0", label: "y = −x" }]} />
        <div className="ds-controls">
          <Range label="arah cermin" value={phi} min={0} max={180} step={5} onChange={setPhi} color={C.violet} shown={`${phi}°`} />
          <Range label="geser cermin" value={d} min={-4} max={4} step={0.5} onChange={setD} color={C.violet} />
        </div>
        <div className="ds-read">jarak A ke cermin = {fmt(dist(TRI[0]))} · jarak A′ ke cermin = {fmt(dist(mirror(TRI[0], phi, d)))}</div>
      </>}
    />
  );
}

/* ═════════ 4 · Rotasi (dengan mode Tebak dulu) ═════════ */
type RotP = { theta: number; cx: number; cy: number; mode: "free" | "guess"; q: number; guess: Vec | null };
const buildRot: Build<RotP> = (b, g, s) => {
  const C0 = pivot(b, g().cx, g().cy, (cx, cy) => s({ cx, cy }));
  const c = (): Vec => [C0.X(), C0.Y()];
  const th = () => (g().mode === "guess" ? g().q : g().theta);
  const show = () => g().mode === "free" || g().guess !== null;
  const R = (p: Vec) => rot(p, c(), th());
  shape(b, () => TRI, blue);
  shape(b, () => (show() ? TRI.map(R) : null), orange);
  TRI.forEach((p, i) => {
    mk(b, "curve", [(t: number) => rot(p, c(), th() * t)[0], (t: number) => rot(p, c(), th() * t)[1], 0, () => (show() ? 1 : 0)],
      { ...still, strokeColor: C.soft, strokeWidth: 1.5, dash: 2 });
    seg(b, () => c(), () => p, C.blue, 1, 3);
    seg(b, () => (show() ? c() : OFF), () => (show() ? R(p) : OFF), C.orange, 1, 3);
    dot(b, () => p, C.blue, 4, NM[i]);
    dot(b, () => (show() ? R(p) : [NaN, NaN]), C.orange, 4, `${NM[i]}′`);
  });
  dot(b, () => g().guess ?? [NaN, NaN], C.violet, 6, "tebakan");
  b.on("down", (e: any) => {
    if (g().mode !== "guess" || g().guess) return;
    if (b.getAllObjectsUnderMouse(e).includes(C0)) return;
    const u = b.getUsrCoordsOfMouse(e);
    s({ guess: [Math.round(u[0]), Math.round(u[1])] });
  });
};
const QS = [90, 180, 270, -90];
function RotationSlide() {
  const [p, setP] = useState<RotP>({ theta: 90, cx: 0, cy: 0, mode: "free", q: 90, guess: null });
  const patch = (x: Partial<RotP>) => setP((s) => ({ ...s, ...x }));
  const ask = () => patch({ mode: "guess", guess: null, q: QS[Math.floor(Math.random() * QS.length)] });
  const target = rot(TRI[0], [p.cx, p.cy], p.q);
  const off = p.guess ? Math.hypot(p.guess[0] - target[0], p.guess[1] - target[1]) : null;
  const coord = (v: Vec) => `(${fmt(v[0], 0)}, ${fmt(v[1], 0)})`;
  return (
    <Frame
      eyebrow="03 · Rotasi"
      title="Memutar mengelilingi pusat"
      copy={<>
        <p>Titik diputar sebesar <b>θ</b> terhadap pusat; <b>jaraknya ke pusat tidak berubah</b>.</p>
        <p className="ds-math">{tex(String.raw`x'=c_x+(x-c_x)\cos\theta-(y-c_y)\sin\theta`)}</p>
        <p className="fragment">Seret titik ungu untuk memindahkan pusat rotasi.</p>
        <p className="fragment">Sekarang <b>tebak dulu</b>: tekan “Tebak dulu”, klik letak A′, baru lihat jawabannya.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={p} onChange={patch} build={buildRot} />
        <Chips value={p.mode} onPick={(m) => (m === "guess" ? ask() : patch({ mode: "free", guess: null }))}
          items={[{ v: "free", label: "Bebas" }, { v: "guess", label: "Tebak dulu" }]} />
        {p.mode === "free" ? (
          <div className="ds-controls ds-controls--one">
            <Range label={tex(String.raw`\theta`)} value={p.theta} min={-360} max={360} step={15} onChange={(theta) => patch({ theta })} color={C.orange} shown={`${p.theta}°`} />
          </div>
        ) : (
          <div className="ds-read">
            {off === null && <>Di mana A′ bila A diputar <b>{p.q}°</b> terhadap pusat {coord([p.cx, p.cy])}? Klik pada bidang.</>}
            {off !== null && off < 0.5 && <span className="ds-ok">Tepat! A′ = {coord(target)} </span>}
            {off !== null && off >= 0.5 && <span className="ds-bad">Selisih {fmt(off, 1)} satuan. A′ sebenarnya {coord(target)} (titik oranye). </span>}
            {off !== null && <Btn onClick={ask}>Soal baru</Btn>}
          </div>
        )}
      </>}
    />
  );
}

/* ═════════ 5 · Dilatasi ═════════ */
type DP = { k: number; cx: number; cy: number; rays: boolean };
const TD: Vec[] = [[1, 1], [2, 1], [1, 2]];
const buildDil: Build<DP> = (b, g, s) => {
  const C0 = pivot(b, g().cx, g().cy, (cx, cy) => s({ cx, cy }));
  const c = (): Vec => [C0.X(), C0.Y()];
  const D = (p: Vec) => dil(p, c(), g().k);
  shape(b, () => TD, blue);
  shape(b, () => TD.map(D), orange);
  TD.forEach((p, i) => {
    seg(b, () => (g().rays ? c() : OFF), () => (g().rays ? D(p) : OFF), C.violet, 1.25, 2);
    dot(b, () => p, C.blue, 4, NM[i]);
    dot(b, () => D(p), C.orange, 4, `${NM[i]}′`);
  });
};
function DilationSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [p, setP] = useState<DP>({ k: 2, cx: 0, cy: 0, rays: false });
  const k = p.k;
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · Dilatasi"
      title="Memperbesar dan memperkecil"
      copy={<>
        <p>Jarak tiap titik ke pusat dikalikan <b>faktor skala k</b>.</p>
        <p className="ds-math">{tex(String.raw`x'=c_x+k\,(x-c_x)`)}</p>
        <p className="fragment">Garis ungu dari pusat melewati titik dan bayangannya: <b>pusat, P, P′ segaris</b>.</p>
        <p className="fragment">Coba <b>k negatif</b>: bayangan pindah ke seberang pusat dan terbalik.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...p, rays: step >= 1 }} onChange={(x) => setP((s) => ({ ...s, ...x }))} build={buildDil} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex("k")} value={k} min={-3} max={3} step={0.5} onChange={(v) => setP((s) => ({ ...s, k: v }))} color={C.orange} />
        </div>
        <div className="ds-read">panjang sisi × {fmt(Math.abs(k), 1)} · luas × {fmt(k * k, 2)} · {k < 0 ? "terbalik" : k === 1 ? "sama" : k > 1 ? "diperbesar" : "diperkecil"}</div>
      </>}
    />
  );
}

/* ═════════ 6 · Komposisi: urutan itu penting ═════════ */
type KP = { th: number; a: number; b: number; mid: boolean };
const TC: Vec[] = [[1, 0.5], [3, 0.5], [1, 2]];
const O: Vec = [0, 0];
const buildComp: Build<KP> = (b, g) => {
  const T = (p: Vec): Vec => add(p, [g().a, g().b]);
  const R = (p: Vec): Vec => rot(p, O, g().th);
  const p1 = (p: Vec) => T(R(p)); // putar dulu, lalu geser
  const p2 = (p: Vec) => R(T(p)); // geser dulu, lalu putar
  const ghost = { strokeColor: C.soft, strokeWidth: 1.5, dash: 2 };
  shape(b, () => TC, blue);
  shape(b, () => (g().mid ? TC.map(R) : null), ghost);
  shape(b, () => (g().mid ? TC.map(T) : null), ghost);
  shape(b, () => TC.map(p1), orange);
  shape(b, () => TC.map(p2), { ...orange, strokeColor: C.violet, fillColor: C.violet });
  dot(b, () => TC[0], C.blue, 4, "A");
  dot(b, () => p1(TC[0]), C.orange, 4, "A₁");
  dot(b, () => p2(TC[0]), C.violet, 4, "A₂");
};
function CompositionSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [th, setTh] = useState(90);
  const [a, setA] = useState(4);
  const bb = 0;
  const A1 = add(rot(TC[0], O, th), [a, bb]);
  const A2 = rot(add(TC[0], [a, bb]), O, th);
  const same = Math.hypot(A1[0] - A2[0], A1[1] - A2[1]) < 0.01;
  return (
    <Frame
      innerRef={ref}
      eyebrow="05 · Komposisi"
      title="Urutan itu penting"
      copy={<>
        <p><b style={{ color: C.orange }}>A₁</b>: putar dulu, lalu geser. <b style={{ color: C.violet }}>A₂</b>: geser dulu, lalu putar.</p>
        <p className="fragment">Garis putus-putus abu-abu adalah hasil antara dari tiap urutan.</p>
        <p className="fragment">Hasil akhir berbeda: komposisi transformasi <b>tidak komutatif</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ th, a, b: bb, mid: step >= 1 }} build={buildComp} />
        <div className="ds-controls">
          <Range label={tex(String.raw`\theta`)} value={th} min={-180} max={180} step={15} onChange={setTh} color={C.orange} shown={`${th}°`} />
          <Range label={tex("a")} value={a} min={-5} max={5} onChange={setA} color={C.violet} />
        </div>
        <div className={`ds-read ${same ? "" : "ds-bad"}`}>{same ? "Kebetulan hasilnya sama. Ubah θ atau a." : "A₁ ≠ A₂ → urutan mengubah hasil"}</div>
      </>}
    />
  );
}

/* ═════════ 7 · Matriks: ke mana î dan ĵ mendarat? ═════════ */
type MP = { a: number; b: number; c: number; d: number; nonce: number };
const SQ: Vec[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
const TM: Vec[] = [[1, 0.5], [2.5, 0.5], [1, 2]];
const r2 = (n: number) => Math.round(n * 100) / 100;
const buildMat: Build<MP> = (b, g, s) => {
  const g0 = g();
  const handle = { snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5, size: 6, strokeColor: "#fff", strokeWidth: 2, highlight: false, showInfobox: false };
  const I = mk(b, "point", [g0.a, g0.c], { ...handle, fillColor: C.teal, name: "î′", label: { strokeColor: C.teal, fontSize: 15, offset: [8, 6] } });
  const J = mk(b, "point", [g0.b, g0.d], { ...handle, fillColor: C.violet, name: "ĵ′", label: { strokeColor: C.violet, fontSize: 15, offset: [8, 6] } });
  const M = (p: Vec): Vec => [I.X() * p[0] + J.X() * p[1], I.Y() * p[0] + J.Y() * p[1]];
  shape(b, () => SQ, { strokeColor: C.soft, strokeWidth: 1.5, dash: 2 });
  shape(b, () => SQ.map(M), { ...orange, strokeWidth: 2 });
  shape(b, () => TM, blue);
  shape(b, () => TM.map(M), orange);
  arrow(b, () => O, () => [1, 0], C.soft, 1.5);
  arrow(b, () => O, () => [0, 1], C.soft, 1.5);
  arrow(b, () => O, () => [I.X(), I.Y()], C.teal, 2.75);
  arrow(b, () => O, () => [J.X(), J.Y()], C.violet, 2.75);
  const push = () => s({ a: r2(I.X()), c: r2(I.Y()), b: r2(J.X()), d: r2(J.Y()) });
  I.on("drag", push); J.on("drag", push);
  let seen = g0.nonce; // preset dari React → pindahkan titik
  b.on("update", () => {
    if (g().nonce === seen) return;
    seen = g().nonce;
    I.setPosition(JXG.COORDS_BY_USER, [g().a, g().c]);
    J.setPosition(JXG.COORDS_BY_USER, [g().b, g().d]);
  });
};
const PRESETS: { label: string; m: [number, number, number, number] }[] = [
  { label: "Identitas", m: [1, 0, 0, 1] }, { label: "Rotasi 90°", m: [0, -1, 1, 0] },
  { label: "Refleksi y = x", m: [0, 1, 1, 0] }, { label: "Dilatasi ×2", m: [2, 0, 0, 2] }, { label: "Geser (shear)", m: [1, 1, 0, 1] },
];
function MatrixSlide() {
  const [m, setM] = useState<MP>({ a: 0, b: -1, c: 1, d: 0, nonce: 1 });
  const det = m.a * m.d - m.b * m.c;
  const n = (v: number) => texNumber(v);
  return (
    <Frame
      eyebrow="06 · Matriks"
      title="Matriks = ke mana î dan ĵ mendarat"
      copy={<>
        <p>Kolom pertama matriks adalah tempat mendarat <b style={{ color: C.teal }}>î′</b> (1, 0); kolom kedua adalah <b style={{ color: C.violet }}>ĵ′</b> (0, 1).</p>
        <p className="fragment">Seret dua titik berwarna. Seluruh bidang ikut berubah, termasuk segitiga biru.</p>
        <p className="fragment">Determinan = faktor luas. Bertanda <b>negatif</b> berarti bangun terbalik (refleksi).</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={m} onChange={(x) => setM((s) => ({ ...s, ...x }))} build={buildMat} />
        <Chips value="" onPick={(v) => { const q = PRESETS.find((x) => x.label === v)!.m; setM((s) => ({ a: q[0], b: q[1], c: q[2], d: q[3], nonce: s.nonce + 1 })); }}
          items={PRESETS.map((q) => ({ v: q.label, label: q.label }))} />
        <div className="ds-read ds-math" style={{ textAlign: "center" }}>
          {tex(String.raw`M=\begin{bmatrix}${n(m.a)} & ${n(m.b)}\\ ${n(m.c)} & ${n(m.d)}\end{bmatrix},\quad \det M=${n(r2(det))}`)}
        </div>
      </>}
    />
  );
}

/* ═════════ 8 · Ringkasan ═════════ */
function SummarySlide() {
  const rows: [string, string, string][] = [
    ["Translasi", String.raw`(x+a,\;y+b)`, String.raw`\begin{bmatrix}1&0&a\\0&1&b\\0&0&1\end{bmatrix}`],
    ["Refleksi sumbu x", String.raw`(x,\,-y)`, String.raw`\begin{bmatrix}1&0\\0&-1\end{bmatrix}`],
    ["Refleksi sumbu y", String.raw`(-x,\,y)`, String.raw`\begin{bmatrix}-1&0\\0&1\end{bmatrix}`],
    ["Rotasi θ (pusat O)", String.raw`(x\cos\theta-y\sin\theta,\;x\sin\theta+y\cos\theta)`, String.raw`\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}`],
    ["Dilatasi [O, k]", String.raw`(kx,\,ky)`, String.raw`\begin{bmatrix}k&0\\0&k\end{bmatrix}`],
  ];
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Satu tabel, empat transformasi"
      copy={<>
        <p>Setiap aturan di tabel sudah Anda <b>lihat bergerak</b>, bukan sekadar dihafal.</p>
        <p className="fragment">Tantangan: susun dua transformasi, <b>prediksi</b> hasilnya, lalu uji di simulasi penuh.</p>
      </>}
      stage={
        <table className="ds-table" style={{ fontSize: 17 }}>
          <thead><tr><th>Transformasi</th><th>(x, y) →</th><th>Matriks</th></tr></thead>
          <tbody>{rows.map(([a, b, c]) => <tr key={a}><th>{a}</th><td>{tex(b)}</td><td>{tex(c)}</td></tr>)}</tbody>
        </table>
      }
    />
  );
}

export function TransformationDeck() {
  return (
    <SlideDeck>
      <TitleSlide />
      <MapSlide />
      <TranslationSlide />
      <ReflectionSlide />
      <RotationSlide />
      <DilationSlide />
      <CompositionSlide />
      <MatrixSlide />
      <SummarySlide />
    </SlideDeck>
  );
}
export default TransformationDeck;
