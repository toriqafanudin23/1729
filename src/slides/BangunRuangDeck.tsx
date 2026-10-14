/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Btn, C, Chips, fmt, Frame, Range, SimBoard, SlideDeck, useStep, useTween,
  type BBox, type Build,
} from "./core";
import { n, Quiz, tex, type QItem } from "./LinearKit";
import {
  boxCol, boxEdges, boxFaces, boxNetFromCells, boxSolid, CUBE_NETS, cellNet, cubeCol, edgesOf, netFromSolid, netIndex,
  netScene, orient, polyArea, polyPerim, prismSolid, pyramidSolid, regular, solidEdges, solidFaces, view3,
  type Cell, type E3, type F3, type L3, type NetFace, type Scene, type Solid, type V3,
} from "./SolidKit";

/* Slide "Bangun ruang sisi datar" (SMP kelas 8): unsur → kubus dan balok → jaring-jaring (contoh, 11 jaring kubus,
   uji dan rancang sendiri) → luas permukaan → volume (kubus satuan, susunan kubus) → prisma → limas → soal cerita.
   Semua bangun digambar dengan mesin 3D buatan sendiri (SolidKit): seret papan untuk memutar. */

const raw = String.raw;
const BB: BBox = [-8, 5, 8, -5];

/* ───────── Komponen kecil ───────── */
const Tbl = (p: { head?: ReactNode[]; rows: ReactNode[][] }) => (
  <table className="ds-table">
    {p.head && <thead><tr>{p.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>}
    <tbody>{p.rows.map((r, i) => <tr key={i}><th>{r[0]}</th>{r.slice(1).map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
  </table>
);

/** Tingkat lipatan yang dihaluskan; `tT` = target (0 datar, 1 utuh). */
function useFold(init = 0) {
  const [tT, setT] = useState(init);
  const t = useTween(tT, 1500);
  return { tT, setT, t };
}
function FoldBar(p: { tT: number; setT: (v: number) => void; children?: ReactNode }) {
  return (<>
    <div className="ds-row">
      <Btn onClick={() => p.setT(0)}>Buka jaring</Btn>
      <Btn onClick={() => p.setT(1)}>Lipat</Btn>
    </div>
    <div className={`ds-controls${p.children ? "" : " ds-controls--one"}`}>
      <Range label="lipatan" value={p.tT} min={0} max={1} step={0.01} onChange={p.setT} color={C.orange} shown={`${Math.round(p.tT * 100)}%`} />
      {p.children}
    </div>
  </>);
}

/** Papan jaring-jaring: menampilkan jaring pada tingkat lipatan t. */
type FoldP = { net: NetFace[]; t: number; labs?: (string | undefined)[]; bad?: boolean[]; neutral?: boolean };
const buildFold: Build<FoldP> = (b, g, _s, clock) => view3(b, g, clock, {
  scene: (p) => netScene(p.net, p.t, { labs: p.labs, bad: p.bad, neutral: p.neutral }),
  flat: (p) => p.t, maxFaces: 8, maxLabels: 8, fill: 0.9, maxScale: 4,
});

/* ───────── Daftar bangun ───────── */
const LETTERS = "ABCDEFGHIJKL";
type Kind = { key: string; name: string; s: Solid };
const KINDS: Kind[] = [
  { key: "kubus", name: "Kubus", s: boxSolid(2, 2, 2) },
  { key: "balok", name: "Balok", s: boxSolid(3, 2, 1.4) },
  { key: "ps3", name: "Prisma segitiga", s: prismSolid([[0, 0], [3, 0], [0, 2]], 2.4) },
  { key: "ps6", name: "Prisma segienam", s: prismSolid(regular(6, 1.2), 2) },
  { key: "ls4", name: "Limas segiempat", s: pyramidSolid([[-1.2, -1.2], [1.2, -1.2], [1.2, 1.2], [-1.2, 1.2]], [0, 0, 2.6]) },
  { key: "ls3", name: "Limas segitiga", s: pyramidSolid(regular(3, 2.6), [0, 0, 2.4]) },
];
const FACE_COLS = [C.blue, C.orange, C.teal, C.violet, C.green, C.red, "#0e7490", "#a16207"];

/* ═════════ 0 · Sampul ═════════ */
const COVER_NET = cellNet(CUBE_NETS[4].cells, (f) => cubeCol(f)).net;
const buildCover: Build<object> = (b, g, _s, clock) => view3(b, g, clock, {
  live: true,
  scene: (_p, c) => netScene(COVER_NET, smoothT(c)),
  flat: (_p, c) => smoothT(c), maxFaces: 8, fill: 0.8, maxScale: 3, drag: false,
  auto: () => true,
});
const smoothT = (c: number) => Math.max(0, Math.min(1, 0.5 - 0.75 * Math.cos(c * 0.75)));
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi · SMP kelas 8"
      title="Bangun ruang sisi datar"
      copy={<>
        <p>Kardus, kotak kado, tenda, atap rumah: semuanya dibatasi <b>bidang datar</b>.</p>
        <p className="ds-muted">Perhatikan kubus yang terus membuka dan melipat. Itu salah satu dari 11 jaring-jaring kubus. Hari ini kita menemukan cara menghitung kulitnya (luas permukaan) dan isinya (volume).</p>
      </>}
      stage={<SimBoard bbox={BB} params={{}} build={buildCover} loop maxH={380} />}
    />
  );
}

/* ═════════ 1 · Peta materi ═════════ */
function MapSlide() {
  return (
    <Frame
      eyebrow="Peta materi"
      title="Dari jaring sampai isi"
      copy={<>
        <p>Kita mulai dari bentuknya, lalu <b>membuka</b> kulitnya, lalu <b>mengisi</b> ruangnya.</p>
        <p className="fragment">Jaring-jaring menjelaskan <b>luas permukaan</b>.</p>
        <p className="fragment">Kubus satuan menjelaskan <b>volume</b>.</p>
        <p className="fragment">Setiap rumus ditemukan lewat simulasi, bukan dihafal.</p>
      </>}
      stage={<Tbl rows={[
        ["01", "Unsur-unsur, kubus, dan balok"],
        ["02", "Jaring-jaring: contoh, 11 jaring kubus, uji dan rancang sendiri"],
        ["03", "Luas permukaan: kubus, balok, prisma, limas"],
        ["04", "Volume: kubus satuan, susunan kubus, prisma, limas"],
        ["05", "Soal cerita, rangkuman, dan kuis"],
      ]} />}
    />
  );
}

/* ═════════ 2 · Unsur-unsur bangun ruang ═════════ */
type UP = { k: number; focus: number };
const FOCUS = ["Sisi", "Rusuk", "Titik sudut", "Semua"];
const buildUnsur: Build<UP> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -38, pitch: 24, maxFaces: 10, maxEdges: 20, maxDots: 14, maxLabels: 14, fill: 0.8, maxScale: 2.4,
  scene: (p) => {
    const s = orient(KINDS[p.k].s);
    const faces: F3[] = solidFaces(s, (i) => (p.focus === 0 ? FACE_COLS[i % FACE_COLS.length] : "#cbd5e1"), {
      cull: true, ghost: true, a: p.focus === 0 ? 0.9 : 0.55,
    });
    const edges: E3[] = p.focus === 1 || p.focus === 3 ? solidEdges(s, p.focus === 1 ? C.red : C.ink, p.focus === 1 ? 4 : 2.5) : [];
    const dots = p.focus >= 2 ? s.V.map((v, i) => ({ p: v, col: C.red, r: 6, i })) : [];
    const labels: L3[] = p.focus >= 2 ? s.V.map((v, i) => ({ p: v, text: LETTERS[i], col: C.red, dx: 13, dy: 12 })) : [];
    return { faces, edges, dots, labels };
  },
});
function ElementsSlide() {
  const [k, setK] = useState(0), [focus, setF] = useState(3);
  const s = orient(KINDS[k].s);
  const F = s.F.length, E = edgesOf(s).length, V = s.V.length;
  const d = [
    <>Sisi: bidang datar yang membatasi bangun. Jumlah <b style={{ color: C.blue }}>{F}</b>.</>,
    <>Rusuk: garis pertemuan dua sisi. Jumlah <b style={{ color: C.red }}>{E}</b>.</>,
    <>Titik sudut: titik pertemuan rusuk. Jumlah <b style={{ color: C.red }}>{V}</b>.</>,
    <>Sisi {F} · rusuk {E} · titik sudut {V}</>,
  ];
  return (
    <Frame
      eyebrow="01 · Unsur bangun ruang"
      title="Sisi, rusuk, titik sudut"
      copy={<>
        <p>Setiap bangun ruang sisi datar tersusun dari tiga unsur. Pilih bangunnya, lalu pilih unsurnya.</p>
        <p className="fragment"><b>Sisi</b> adalah bidang datar, <b>rusuk</b> adalah garis pertemuan dua sisi, <b>titik sudut</b> adalah pertemuan rusuk.</p>
        <p className="fragment">Hitung ketiganya, lalu periksa: {tex(raw`T-R+S=2`)} untuk semua bangun ini. Itu rumus Euler.</p>
        <p className="fragment">Nama prisma dan limas mengikuti bentuk <b>alasnya</b>.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ k, focus }} build={buildUnsur} maxH={330} />
        <Chips value={k} onPick={setK} items={KINDS.map((x, i) => ({ v: i, label: x.name }))} />
        <Chips value={focus} onPick={setF} items={FOCUS.map((x, i) => ({ v: i, label: x }))} />
        <div className="ds-read">
          {d[focus]}<br />
          T − R + S = {V} − {E} + {F} = <b>{V - E + F}</b>
        </div>
      </>}
    />
  );
}

/* ═════════ 3 · Kubus dan balok: ukuran ═════════ */
type DimP = { p: number; l: number; t: number };
const buildDims: Build<DimP> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -36, pitch: 24, sc: 0.95, maxFaces: 6, maxEdges: 12, maxLabels: 3,
  scene: (q) => {
    const { p, l, t } = q;
    const faces = boxFaces(p, l, t, { cull: true, ghost: true, a: 0.78 });
    const edges: E3[] = [];
    [0, l].forEach((y) => [0, t].forEach((z) => edges.push({ a: [0, y, z], b: [p, y, z], col: C.blue, w: 4 })));
    [0, p].forEach((x) => [0, t].forEach((z) => edges.push({ a: [x, 0, z], b: [x, l, z], col: C.orange, w: 4 })));
    [0, p].forEach((x) => [0, l].forEach((y) => edges.push({ a: [x, y, 0], b: [x, y, t], col: C.teal, w: 4 })));
    const labels: L3[] = [
      { p: [p / 2, 0, 0], text: `p = ${n(p)}`, col: C.blue, dy: -16 },
      { p: [p, l / 2, 0], text: `l = ${n(l)}`, col: C.orange, dx: 26, dy: -6 },
      { p: [p, l, t / 2], text: `t = ${n(t)}`, col: C.teal, dx: 24, dy: 4 },
    ];
    return { faces, edges, labels };
  },
});
function DimsSlide() {
  const [kub, setKub] = useState(false);
  const [d, setD] = useState<DimP>({ p: 4, l: 3, t: 2 });
  const set = (k: keyof DimP) => (v: number) => setD(kub ? { p: v, l: v, t: v } : { ...d, [k]: v });
  const pick = (v: boolean) => { setKub(v); if (v) setD({ p: d.p, l: d.p, t: d.p }); };
  const P = d.p, L = d.l, T = d.t;
  return (
    <Frame
      eyebrow="01 · Kubus dan balok"
      title="Kubus adalah balok istimewa"
      copy={<>
        <p>Balok punya <b>6 sisi</b> berbentuk persegi panjang, <b>12 rusuk</b>, dan <b>8 titik sudut</b>. Rusuknya terbagi tiga kelompok: panjang <b style={{ color: C.blue }}>p</b>, lebar <b style={{ color: C.orange }}>l</b>, tinggi <b style={{ color: C.teal }}>t</b>, masing-masing 4 buah.</p>
        <p className="fragment">Bila p = l = t, semua sisinya <b>persegi kongruen</b>. Itulah kubus.</p>
        <p className="fragment">Panjang seluruh kerangka (kawat): {tex(raw`4(p+l+t)`)}. Pada kubus: {tex(raw`12s`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={d} build={buildDims} maxH={330} />
        <Chips value={kub ? 1 : 0} onPick={(v) => pick(v === 1)} items={[{ v: 0, label: "Balok" }, { v: 1, label: "Kubus" }]} />
        <div className="ds-controls">
          <Range label={kub ? "s" : "p"} value={P} min={1} max={6} onChange={set("p")} color={C.blue} />
          {!kub && <Range label="l" value={L} min={1} max={6} onChange={set("l")} color={C.orange} />}
          {!kub && <Range label="t" value={T} min={1} max={6} onChange={set("t")} color={C.teal} />}
        </div>
        <div className="ds-read">
          {kub ? <>12 rusuk × {n(P)} = <b>{n(12 * P)}</b></> : <>4 × ({n(P)} + {n(L)} + {n(T)}) = <b>{n(4 * (P + L + T))}</b> satuan panjang kerangka</>}
        </div>
      </>}
    />
  );
}

/* ═════════ 4 · Diagonal sisi, diagonal ruang, bidang diagonal ═════════ */
type DgP = DimP & { show: number };
const DG = ["Diagonal sisi", "Diagonal ruang", "Bidang diagonal"];
const buildDiag: Build<DgP> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -36, pitch: 24, sc: 0.95, maxFaces: 8, maxEdges: 6, maxDots: 4, maxLabels: 2,
  scene: (q) => {
    const { p, l, t, show } = q;
    const A: V3 = [0, 0, 0], Cc: V3 = [p, l, 0];
    const E: V3 = [0, 0, t], G: V3 = [p, l, t];
    const faces = boxFaces(p, l, t, { cull: true, ghost: true, a: 0.4 });
    const edges: E3[] = [];
    if (show === 0) {
      const F2: V3 = [p, 0, t];
      faces.push({ p: [E, F2, G], col: C.orange, a: 0.5, sw: 1 });
      edges.push({ a: E, b: G, col: C.red, w: 4.5 }, { a: E, b: F2, col: C.mute, w: 2.5 }, { a: F2, b: G, col: C.mute, w: 2.5 });
    } else if (show === 1) {
      faces.push({ p: [A, Cc, G], col: C.orange, a: 0.45, sw: 1 });
      edges.push({ a: A, b: G, col: C.red, w: 4.5 }, { a: A, b: Cc, col: C.mute, w: 3, dash: 1 }, { a: Cc, b: G, col: C.mute, w: 3, dash: 1 });
    } else {
      faces.push({ p: [A, Cc, G, E], col: C.violet, a: 0.55, sw: 1.5 });
      edges.push({ a: A, b: Cc, col: C.red, w: 4 }, { a: E, b: G, col: C.red, w: 4 });
    }
    return { faces, edges, dots: show === 0 ? [{ p: E, col: C.ink, r: 5 }, { p: G, col: C.red, r: 6 }] : [{ p: A, col: C.ink, r: 5 }, { p: G, col: C.red, r: 6 }] };
  },
});
function DiagSlide() {
  const [d, setD] = useState<DimP>({ p: 4, l: 3, t: 5 });
  const [show, setShow] = useState(0);
  const set = (k: keyof DimP) => (v: number) => setD({ ...d, [k]: v });
  const f = Math.hypot(d.p, d.l), r = Math.hypot(d.p, d.l, d.t);
  return (
    <Frame
      eyebrow="01 · Kubus dan balok"
      title="Diagonal sisi, diagonal ruang, bidang diagonal"
      copy={<>
        <p><b>Diagonal sisi</b> menghubungkan dua titik sudut berhadapan pada satu sisi. Segitiga siku-siku pada alas memberi {tex(raw`\sqrt{p^{2}+l^{2}}`)}.</p>
        <p className="fragment"><b>Diagonal ruang</b> menembus bagian dalam. Pythagoras sekali lagi: {tex(raw`\sqrt{p^{2}+l^{2}+t^{2}}`)}.</p>
        <p className="fragment"><b>Bidang diagonal</b> berbentuk persegi panjang: panjangnya diagonal sisi, lebarnya tinggi t.</p>
        <p className="ds-muted">Pada kubus: {tex(raw`s\sqrt2`)}, {tex(raw`s\sqrt3`)}, dan luas {tex(raw`s^{2}\sqrt2`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...d, show }} build={buildDiag} maxH={320} />
        <Chips value={show} onPick={setShow} items={DG.map((x, i) => ({ v: i, label: x }))} />
        <div className="ds-controls">
          <Range label="p" value={d.p} min={1} max={6} onChange={set("p")} color={C.blue} />
          <Range label="l" value={d.l} min={1} max={6} onChange={set("l")} color={C.orange} />
          <Range label="t" value={d.t} min={1} max={6} onChange={set("t")} color={C.teal} />
        </div>
        <div className="ds-read">
          {show === 0 && <>diagonal sisi = √({n(d.p)}² + {n(d.l)}²) = <b>{fmt(f, 2)}</b></>}
          {show === 1 && <>diagonal ruang = √({n(d.p)}² + {n(d.l)}² + {n(d.t)}²) = <b>{fmt(r, 2)}</b></>}
          {show === 2 && <>luas bidang diagonal = {fmt(f, 2)} × {n(d.t)} = <b>{fmt(f * d.t, 2)}</b></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 5 · Jaring-jaring: membuka dan melipat ═════════ */
function NetIntroSlide() {
  const { tT, setT, t } = useFold(0);
  const [k, setK] = useState(0);
  const net = useMemo(() => (k === 0
    ? cellNet(CUBE_NETS[4].cells, (f) => cubeCol(f)).net
    : boxNetFromCells(4, 3, 2, CUBE_NETS[4].cells, boxCol)), [k]);
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  useEffect(() => { if (step >= 2) setT(1); else setT(0); }, [step, setT]);
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · Jaring-jaring"
      title="Kulit yang dibentangkan"
      copy={<>
        <p><b>Jaring-jaring</b> adalah hasil membuka sebuah bangun ruang sepanjang beberapa rusuknya, lalu merebahkannya pada bidang datar.</p>
        <p className="fragment">Jaringnya tetap <b>satu keping</b>: sisi-sisinya masih bergandengan di rusuk.</p>
        <p className="fragment">Tekan →: jaring melipat menjadi kubus. Sisi berhadapan berwarna sama.</p>
        <p className="fragment">Jaring penting karena menunjukkan <b>seluruh kulit</b> dalam satu gambar datar.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t }} build={buildFold} maxH={330} />
        <Chips value={k} onPick={setK} items={[{ v: 0, label: "Kubus" }, { v: 1, label: "Balok 4 × 3 × 2" }]} />
        <FoldBar tT={tT} setT={setT} />
      </>}
    />
  );
}

/* ═════════ 6 · Jaring balok ═════════ */
const BOX_NETS = [0, 4, 6, 9, 10];
const BOX_NAME = ["Jaring A", "Jaring B", "Jaring C", "Jaring D", "Jaring E"];
function BoxNetSlide() {
  const { tT, setT, t } = useFold(0);
  const [k, setK] = useState(1);
  const P = 4, L = 3, T = 2;
  const areas = [P * L, P * L, P * T, P * T, L * T, L * T];
  const net = useMemo(() => boxNetFromCells(P, L, T, CUBE_NETS[BOX_NETS[k]].cells, boxCol), [k]);
  const labs = useMemo(() => net.map((f) => `${areas[f.src]}`), [net]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Frame
      eyebrow="02 · Jaring-jaring"
      title="Banyak jaring untuk satu balok"
      copy={<>
        <p>Balok 4 × 3 × 2 punya banyak jaring. Bentuknya berbeda, tetapi isinya sama: <b>6 persegi panjang</b>.</p>
        <p className="fragment">Sisi berhadapan <b>kongruen</b>, jadi selalu ada tiga pasang: {tex(raw`p\times l`)}, {tex(raw`p\times t`)}, {tex(raw`l\times t`)}.</p>
        <p className="fragment">Angka pada setiap sisi adalah <b>luasnya</b>. Jumlahnya selalu sama, apa pun jaringnya.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t, labs }} build={buildFold} maxH={330} />
        <Chips value={k} onPick={setK} items={BOX_NAME.map((x, i) => ({ v: i, label: x }))} />
        <FoldBar tT={tT} setT={setT} />
        <div className="ds-read">
          2 × 12 + 2 × 8 + 2 × 6 = <b>{2 * areas[0] + 2 * areas[2] + 2 * areas[4]}</b> satuan luas
        </div>
      </>}
    />
  );
}

/* ═════════ 7 · Jaring prisma ═════════ */
type PrismSpec = { key: string; name: string; base: [number, number][]; t: number; note: string };
const PRISMS: PrismSpec[] = [
  { key: "tri", name: "Segitiga siku-siku", base: [[0, 0], [3, 0], [0, 4]], t: 5, note: "alas 3, 4, 5" },
  { key: "eq", name: "Segitiga sama sisi", base: regular(3, 4), t: 5, note: "sisi 4" },
  { key: "trap", name: "Trapesium", base: [[0, 0], [5, 0], [4, 2], [1, 2]], t: 3, note: "sejajar 5 dan 3, tinggi 2" },
  { key: "hex", name: "Segienam beraturan", base: regular(6, 2), t: 4, note: "sisi 2" },
];
const prismCol = (i: number) => (i < 2 ? C.teal : i % 2 ? C.blue : C.orange);
/** Jaring prisma. A: alas di tengah, sisi tegak mengelilingi. B: sisi tegak berjajar (selimut), dua alas di ujung. */
function prismNet(base: [number, number][], t: number, kind: "A" | "B"): NetFace[] {
  const s = prismSolid(base, t), m = base.length;
  if (kind === "A") return netFromSolid(s, 0, null, prismCol);
  const tree: [number, number][] = [[2, 0], [2, 1], ...Array.from({ length: m - 1 }, (_, i) => [2 + i, 3 + i] as [number, number])];
  return netFromSolid(s, 2, tree, prismCol);
}
function PrismNetSlide() {
  const { tT, setT, t } = useFold(0);
  const [k, setK] = useState(0), [kind, setKind] = useState<"A" | "B">("A");
  const sp = PRISMS[k];
  const net = useMemo(() => prismNet(sp.base, sp.t, kind), [sp, kind]);
  return (
    <Frame
      eyebrow="02 · Jaring-jaring"
      title="Jaring prisma"
      copy={<>
        <p>Prisma punya <b>dua alas kongruen</b> dan sisi tegak berbentuk <b>persegi panjang</b>. Banyak sisi tegak sama dengan banyak sisi alas.</p>
        <p className="fragment">Pilih jaring <b>B</b>: sisi tegak berjajar menjadi satu persegi panjang besar. Panjangnya sama dengan <b>keliling alas</b>.</p>
        <p className="fragment">Luas permukaan prisma = 2 alas + selimut = {tex(raw`2L_{alas}+K_{alas}\times t`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t }} build={buildFold} maxH={310} />
        <Chips value={k} onPick={setK} items={PRISMS.map((x, i) => ({ v: i, label: x.name }))} />
        <Chips value={kind} onPick={setKind} items={[{ v: "A" as const, label: "Jaring A: alas di tengah" }, { v: "B" as const, label: "Jaring B: selimut berjajar" }]} />
        <FoldBar tT={tT} setT={setT} />
      </>}
    />
  );
}

/* ═════════ 8 · Jaring limas ═════════ */
type PyrSpec = { key: string; name: string; base: [number, number][]; h: number };
const PYRS: PyrSpec[] = [
  { key: "ls4", name: "Limas segiempat", base: [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]], h: 3 },
  { key: "ls3", name: "Limas segitiga", base: regular(3, 3.4), h: 3 },
  { key: "ls5", name: "Limas segilima", base: regular(5, 2.2), h: 3 },
  { key: "ls6", name: "Limas segienam", base: regular(6, 1.8), h: 3.2 },
];
const pyrCol = (i: number) => (i === 0 ? C.teal : i % 2 ? C.orange : C.violet);
function PyramidNetSlide() {
  const { tT, setT, t } = useFold(0);
  const [k, setK] = useState(0);
  const sp = PYRS[k];
  const net = useMemo(() => netFromSolid(pyramidSolid(sp.base, [0, 0, sp.h]), 0, null, pyrCol), [sp]);
  return (
    <Frame
      eyebrow="02 · Jaring-jaring"
      title="Jaring limas"
      copy={<>
        <p>Limas punya <b>satu alas</b> dan sisi-sisi tegak berbentuk <b>segitiga</b> yang bertemu di satu puncak.</p>
        <p className="fragment">Jaringnya seperti bunga: alas di tengah, segitiga di tiap sisi alas sebagai kelopak.</p>
        <p className="fragment">Banyak segitiga = banyak sisi alas. Maka limas segi-{tex("m")} punya {tex("m+1")} sisi.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t }} build={buildFold} maxH={330} />
        <Chips value={k} onPick={setK} items={PYRS.map((x, i) => ({ v: i, label: x.name }))} />
        <FoldBar tT={tT} setT={setT} />
      </>}
    />
  );
}

/* ═════════ 9 · Sebelas jaring kubus ═════════ */
function ElevenSlide() {
  const { tT, setT, t } = useFold(0);
  const [k, setK] = useState(0);
  const net = useMemo(() => cellNet(CUBE_NETS[k].cells, (f) => cubeCol(f)).net, [k]);
  const groups = ["1-4-1", "2-3-1", "2-2-2", "3-3"];
  const cnt = groups.map((g) => CUBE_NETS.filter((x) => x.group === g).length);
  return (
    <Frame
      eyebrow="02 · Jaring-jaring kubus"
      title="Sebelas jaring kubus"
      copy={<>
        <p>Dari 35 cara menyambung 6 persegi, hanya <b>11</b> yang dapat dilipat menjadi kubus.</p>
        <p className="fragment">Pola baris <b>1-4-1</b>: empat persegi berderet, satu di atas dan satu di bawah. Ada <b>{cnt[0]}</b> jaring.</p>
        <p className="fragment">Pola <b>2-3-1</b> ada <b>{cnt[1]}</b>, pola <b>2-2-2</b> (tangga) ada <b>{cnt[2]}</b>, pola <b>3-3</b> ada <b>{cnt[3]}</b>. Totalnya {cnt.join(" + ")} = 11.</p>
        <p className="fragment">Sisi berhadapan <b>berwarna sama</b>. Pada jaring yang benar, tidak ada dua persegi senama.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t }} build={buildFold} maxH={310} />
        <Chips value={k} onPick={setK} items={CUBE_NETS.map((x, i) => ({ v: i, label: x.name }))} />
        <FoldBar tT={tT} setT={setT} />
        <div className="ds-read">Jaring {CUBE_NETS[k].name} · pola {CUBE_NETS[k].group}</div>
      </>}
    />
  );
}

/* ═════════ 10 · Jaring atau bukan? ═════════ */
const CANDS: { name: string; cells: Cell[] }[] = [
  { name: "A", cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]] },
  { name: "B", cells: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2], [1, 3]] },
  { name: "C", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]] },
  { name: "D", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]] },
  { name: "E", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [3, 1]] },
  { name: "F", cells: [[0, 0], [1, 0], [0, 1], [1, 1], [1, 2], [1, 3]] },
];
const faceCols = (f: number) => cubeCol(f);
function TestSlide() {
  const { tT, setT, t } = useFold(0);
  const [k, setK] = useState(0);
  const cn = useMemo(() => cellNet(CANDS[k].cells, faceCols), [k]);
  const net = cn.net;
  const bad = t > 0.97 ? cn.dup : undefined;
  const num = netIndex(CANDS[k].cells);
  return (
    <Frame
      eyebrow="02 · Jaring-jaring kubus"
      title="Jaring atau bukan?"
      copy={<>
        <p>Enam persegi yang bersambung belum tentu jaring kubus. Pilih satu bentuk, <b>tebak</b>, lalu lipat untuk menguji.</p>
        <p className="fragment">Bila gagal, dua persegi <b>bertumpuk</b> di sisi kubus yang sama (berwarna merah), dan ada sisi kubus yang kosong.</p>
        <p className="fragment">Aturan praktis: <b>empat persegi sejajar</b> dalam satu baris selalu aman, tetapi <b>lima</b> dalam satu baris tidak mungkin.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t, bad, neutral: t < 0.02 }} build={buildFold} maxH={300} />
        <Chips value={k} onPick={(v) => { setK(v); setT(0); }} items={CANDS.map((x, i) => ({ v: i, label: `Bentuk ${x.name}` }))} />
        <FoldBar tT={tT} setT={setT} />
        <div className="ds-read">
          {t < 0.97
            ? <>Tebak dulu, lalu tekan <b>Lipat</b>.</>
            : cn.ok
              ? <span className="ds-ok"><b>✓ Jaring kubus</b>, sama dengan jaring nomor {num + 1}.</span>
              : <span className="ds-bad"><b>✗ Bukan jaring kubus.</b> Ada persegi bertumpuk (merah).</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 11 · Rancang jaringmu ═════════ */
const GRID_C = 6, GRID_R = 4;
function DesignSlide() {
  const { setT, t } = useFold(0);
  const [sel, setSel] = useState<Cell[]>([[1, 1], [2, 1], [3, 1], [4, 1], [2, 0], [2, 2]]);
  const key = (c: Cell) => `${c[0]},${c[1]}`;
  const has = (c: Cell) => sel.some((x) => key(x) === key(c));
  const toggle = (c: Cell) => { setT(0); setSel(has(c) ? sel.filter((x) => key(x) !== key(c)) : sel.length < 6 ? [...sel, c] : sel); };
  const full = sel.length === 6;
  const cn = useMemo(() => (full ? cellNet(sel, faceCols) : null), [sel, full]);
  const ready = !!cn && cn.connected;
  const net = useMemo(() => (ready && cn ? cn.net : []), [ready, cn]);
  const bad = ready && cn && t > 0.97 ? cn.dup : undefined;
  const num = ready && cn?.ok ? netIndex(sel) : -1;
  return (
    <Frame
      eyebrow="02 · Jaring-jaring kubus"
      title="Rancang jaringmu sendiri"
      copy={<>
        <p>Klik <b>enam kotak</b> yang saling menempel sisinya, lalu tekan <b>Lipat</b>.</p>
        <p className="fragment">Jaring yang benar menutup keenam sisi kubus tepat satu kali, dan program mengenali nomornya.</p>
        <p className="fragment">Tantangan: temukan jaring yang <b>berbeda</b> dari kawan sebangku. Hanya ada sebelas, termasuk putaran dan cerminannya.</p>
      </>}
      stage={<>
        {ready
          ? <SimBoard bbox={BB} params={{ net, t, bad, neutral: t < 0.02 }} build={buildFold} maxH={250} />
          : <div className="ds-read" style={{ minHeight: 120, display: "grid", placeItems: "center", textAlign: "center" }}>
            {full ? "Keenam kotak harus saling menempel pada sisinya." : `Pilih ${6 - sel.length} kotak lagi.`}
          </div>}
        <div className="ds-grid" style={{ gridTemplateColumns: `repeat(${GRID_C}, 34px)` }}>
          {Array.from({ length: GRID_R * GRID_C }, (_, i) => {
            const c: Cell = [i % GRID_C, Math.floor(i / GRID_C)];
            return <button key={i} type="button" className={`ds-cell${has(c) ? " is-on" : ""}`} aria-pressed={has(c)} aria-label={`kotak ${c[0] + 1},${c[1] + 1}`} onClick={() => toggle(c)} />;
          })}
        </div>
        <div className="ds-row">
          <Btn onClick={() => { setSel([]); setT(0); }}>Hapus semua</Btn>
          <Btn onClick={() => setT(1)}>Lipat</Btn>
          <Btn onClick={() => setT(0)}>Buka</Btn>
        </div>
        <div className="ds-read">
          {sel.length}/6 kotak
          {ready && t > 0.97 && (cn?.ok
            ? <> · <span className="ds-ok"><b>✓ Jaring kubus</b>{num >= 0 && <>, sama dengan jaring nomor {num + 1} ({CUBE_NETS[num].group})</>}</span></>
            : <> · <span className="ds-bad"><b>✗ Bukan jaring kubus</b></span></>)}
        </div>
      </>}
    />
  );
}

/* ═════════ 12 · Luas permukaan: kubus ═════════ */
function SurfCubeSlide() {
  const { tT, setT, t } = useFold(0);
  const [s, setS] = useState(3);
  const net = useMemo(() => boxNetFromCells(s, s, s, CUBE_NETS[4].cells, boxCol), [s]);
  const labs = useMemo(() => net.map(() => n(s * s)), [net, s]);
  return (
    <Frame
      eyebrow="03 · Luas permukaan"
      title="Luas permukaan = luas jaring"
      copy={<>
        <p><b>Luas permukaan</b> bangun ruang adalah <b>jumlah luas semua sisinya</b>. Bayangkan karton pembungkus kado: berapa karton yang habis?</p>
        <p className="fragment">Buka kubusnya. Jaring memuat 6 persegi. Luas jaring = luas permukaan.</p>
        <p className="fragment">Enam persegi kongruen bersisi s: {tex(raw`L=6\times s^{2}`)}.</p>
        <p className="ds-muted">Satuannya satuan luas: cm², m².</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t, labs }} build={buildFold} maxH={310} />
        <FoldBar tT={tT} setT={setT}>
          <Range label={tex("s")} value={s} min={1} max={6} onChange={setS} color={C.blue} />
        </FoldBar>
        <div className="ds-read">
          L = 6 × s² = 6 × {n(s)}² = 6 × {n(s * s)} = <b>{n(6 * s * s)}</b> satuan luas
        </div>
      </>}
    />
  );
}

/* ═════════ 13 · Luas permukaan: balok ═════════ */
const PAIRS = ["Semua sisi", "Alas dan atas", "Depan dan belakang", "Kiri dan kanan"];
const pairOf = (i: number) => (i < 2 ? 1 : i < 4 ? 2 : 3);
function SurfBoxSlide() {
  const { tT, setT, t } = useFold(0);
  const [d, setD] = useState<DimP>({ p: 4, l: 3, t: 2 });
  const [hl, setHl] = useState(0);
  const set = (k: keyof DimP) => (v: number) => setD({ ...d, [k]: v });
  const A = [d.p * d.l, d.p * d.t, d.l * d.t];
  const net = useMemo(() => boxNetFromCells(d.p, d.l, d.t, CUBE_NETS[4].cells, (i) => (hl === 0 || pairOf(i) === hl ? boxCol(i) : "#cbd5e1")), [d, hl]);
  const labs = useMemo(() => net.map((f) => `${n(A[pairOf(f.src) - 1])}`), [net]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Frame
      eyebrow="03 · Luas permukaan"
      title="Tiga pasang persegi panjang"
      copy={<>
        <p>Jaring balok berisi tiga pasang sisi kongruen. Sorot satu pasang untuk melihat luasnya.</p>
        <p className="fragment">{tex(raw`2(p\times l)`)} untuk alas dan atas, {tex(raw`2(p\times t)`)} untuk depan dan belakang, {tex(raw`2(l\times t)`)} untuk kiri dan kanan.</p>
        <p className="fragment">{tex(raw`L=2(pl+pt+lt)`)}</p>
        <p className="ds-muted">Bila p = l = t = s, rumus ini menjadi 6s².</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t, labs }} build={buildFold} maxH={290} />
        <Chips value={hl} onPick={setHl} items={PAIRS.map((x, i) => ({ v: i, label: x }))} />
        <FoldBar tT={tT} setT={setT} />
        <div className="ds-controls">
          <Range label="p" value={d.p} min={1} max={6} onChange={set("p")} color={C.blue} />
          <Range label="l" value={d.l} min={1} max={6} onChange={set("l")} color={C.orange} />
          <Range label="t" value={d.t} min={1} max={6} onChange={set("t")} color={C.teal} />
        </div>
        <div className="ds-read">
          {hl === 0
            ? <>2({n(A[0])} + {n(A[1])} + {n(A[2])}) = <b>{n(2 * (A[0] + A[1] + A[2]))}</b> satuan luas</>
            : <>2 × {n(A[hl - 1])} = <b>{n(2 * A[hl - 1])}</b> satuan luas untuk pasangan ini</>}
        </div>
      </>}
    />
  );
}

/* ═════════ 14 · Volume: ruang yang ditempati ═════════ */
type WP = DimP & { h: number };
const GLASS = "#94a3b8";
const buildWater: Build<WP> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -36, pitch: 24, sc: 0.95, maxFaces: 12, maxEdges: 0, maxLabels: 0,
  scene: (q) => {
    const faces = boxFaces(q.p, q.l, q.t, { cols: () => GLASS, cull: true, ghost: true, a: 0.14 });
    if (q.h > 0) faces.push(...boxFaces(q.p, q.l, Math.min(q.h, q.t), { cols: () => "#0ea5e9", cull: true, a: 0.62 }));
    return { faces };
  },
});
function VolumeDefSlide() {
  const [d, setD] = useState<DimP>({ p: 4, l: 3, t: 4 });
  const [h, setH] = useState(2);
  const set = (k: keyof DimP) => (v: number) => { setD({ ...d, [k]: v }); if (k === "t" && h > v) setH(v); };
  const hh = Math.min(h, d.t);
  return (
    <Frame
      eyebrow="04 · Volume"
      title="Volume: ruang yang dapat diisi"
      copy={<>
        <p><b>Volume</b> adalah ukuran <b>ruang</b> yang ditempati sebuah bangun, atau banyaknya yang muat di dalamnya.</p>
        <p className="fragment">Ukurannya memakai <b>satuan kubik</b>: cm³, dm³, m³. Satu satuan = ruang sebuah kubus bersisi 1.</p>
        <p className="fragment">Naikkan air 1 satuan, ruang yang terisi bertambah satu lapisan setebal 1.</p>
        <p className="ds-muted">1 liter = 1 dm³ = 1.000 cm³.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...d, h: hh }} build={buildWater} maxH={320} />
        <div className="ds-controls">
          <Range label="p" value={d.p} min={1} max={6} onChange={set("p")} color={C.blue} />
          <Range label="l" value={d.l} min={1} max={6} onChange={set("l")} color={C.orange} />
          <Range label="t" value={d.t} min={1} max={6} onChange={set("t")} color={C.teal} />
          <Range label="tinggi air" value={hh} min={0} max={d.t} onChange={setH} color="#0ea5e9" />
        </div>
        <div className="ds-read">
          air: {n(d.p)} × {n(d.l)} × {n(hh)} = <b>{n(d.p * d.l * hh)}</b> satuan kubik<br />
          kapasitas penuh: {n(d.p)} × {n(d.l)} × {n(d.t)} = <b>{n(d.p * d.l * d.t)}</b>
        </div>
      </>}
    />
  );
}

/* ═════════ 15 · Kubus satuan: lapis demi lapis ═════════ */
type CP = DimP & { k: number };
const buildCubes: Build<CP> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -36, pitch: 26, sc: 0.95, maxFaces: 8, maxEdges: 12, maxGrid: 1, maxLabels: 3,
  scene: (q) => {
    const faces = q.k > 0 ? boxFaces(q.p, q.l, q.k, { grid: 1, cull: true, a: 0.97 }) : [];
    const edges = boxEdges(q.p, q.l, q.t, "#64748b", 1.5, [0, 0, 0], 1);
    const labels: L3[] = [
      { p: [q.p / 2, 0, 0], text: `p = ${n(q.p)}`, col: C.blue, dy: -16 },
      { p: [q.p, q.l / 2, 0], text: `l = ${n(q.l)}`, col: C.orange, dx: 26, dy: -6 },
      { p: [q.p, q.l, q.t / 2], text: `t = ${n(q.t)}`, col: C.teal, dx: 34, dy: 4 },
    ];
    return { faces, edges, labels, center: [q.p / 2, q.l / 2, q.t / 2] };
  },
});
const CUBE_PRESETS: { name: string; d: DimP }[] = [
  { name: "Kubus 3 × 3 × 3", d: { p: 3, l: 3, t: 3 } },
  { name: "Balok 4 × 3 × 2", d: { p: 4, l: 3, t: 2 } },
  { name: "Balok 5 × 3 × 4", d: { p: 5, l: 3, t: 4 } },
];
function UnitCubesSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [d, setD] = useState<DimP>({ p: 4, l: 3, t: 3 });
  const [k, setK] = useState(0);
  useEffect(() => { setK(step >= 2 ? d.t : step >= 1 ? 1 : 0); }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  const kk = Math.min(k, d.t), per = d.p * d.l;
  const set = (key: keyof DimP) => (v: number) => { setD({ ...d, [key]: v }); if (key === "t" && k > v) setK(v); };
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · Volume"
      title="Menghitung kubus satuan"
      copy={<>
        <p>Isi balok dengan <b>kubus satuan</b> (rusuk 1). Volumenya adalah <b>banyak kubus</b> yang muat.</p>
        <p className="fragment">Tekan →: satu lapisan alas berisi {tex(raw`p\times l`)} kubus.</p>
        <p className="fragment">Tumpuk setinggi t. Ada t lapisan, jadi {tex(raw`V=p\times l\times t`)}.</p>
        <p className="fragment">Pada kubus: {tex(raw`V=s\times s\times s=s^{3}`)}. Dari sinilah kata "pangkat tiga" dan satuan kubik.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...d, k: kk }} build={buildCubes} maxH={310} />
        <Chips value={CUBE_PRESETS.findIndex((x) => x.d.p === d.p && x.d.l === d.l && x.d.t === d.t)} onPick={(i) => { setD(CUBE_PRESETS[i].d); setK(0); }}
          items={CUBE_PRESETS.map((x, i) => ({ v: i, label: x.name }))} />
        <div className="ds-controls">
          <Range label="p" value={d.p} min={1} max={6} onChange={set("p")} color={C.blue} />
          <Range label="l" value={d.l} min={1} max={6} onChange={set("l")} color={C.orange} />
          <Range label="t" value={d.t} min={1} max={6} onChange={set("t")} color={C.teal} />
          <Range label="lapisan terisi" value={kk} min={0} max={d.t} onChange={setK} color={C.green} />
        </div>
        <div className="ds-read">
          tiap lapisan: {n(d.p)} × {n(d.l)} = <b>{n(per)}</b> kubus<br />
          {n(kk)} lapisan: {n(kk)} × {n(per)} = <b>{n(kk * per)}</b> kubus{kk === d.t && <> <span className="ds-ok">= volume {n(d.p * d.l * d.t)} ✓</span></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 16 + 17 · Susunan kubus satuan ═════════ */
const SZ = 4;
const PRE: { name: string; h: number[] }[] = [
  { name: "Tangga", h: [1, 2, 3, 4, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: "Piramida", h: [1, 1, 1, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0] },
  { name: "Huruf L", h: [2, 2, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0] },
  { name: "Kubus 2×2×2", h: [2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: "Menara", h: [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];
function stackScene(h: number[]): Scene {
  const hh = (r: number, c: number) => (r < 0 || c < 0 || r >= SZ || c >= SZ ? 0 : h[r * SZ + c]);
  const faces: F3[] = [];
  const add = (p: V3[], col: string) => faces.push({ p, col, cull: true, a: 1, sw: 1.2 });
  for (let r = 0; r < SZ; r++) for (let c = 0; c < SZ; c++) {
    const z = hh(r, c);
    if (!z) continue;
    add([[c, r, z], [c + 1, r, z], [c + 1, r + 1, z], [c, r + 1, z]], C.teal);
    add([[c, r, 0], [c, r + 1, 0], [c + 1, r + 1, 0], [c + 1, r, 0]], C.teal);
    for (let k = hh(r, c + 1); k < z; k++) add([[c + 1, r, k], [c + 1, r + 1, k], [c + 1, r + 1, k + 1], [c + 1, r, k + 1]], C.blue);
    for (let k = hh(r, c - 1); k < z; k++) add([[c, r, k], [c, r, k + 1], [c, r + 1, k + 1], [c, r + 1, k]], C.blue);
    for (let k = hh(r + 1, c); k < z; k++) add([[c, r + 1, k], [c, r + 1, k + 1], [c + 1, r + 1, k + 1], [c + 1, r + 1, k]], C.orange);
    for (let k = hh(r - 1, c); k < z; k++) add([[c, r, k], [c + 1, r, k], [c + 1, r, k + 1], [c, r, k + 1]], C.orange);
  }
  return { faces, center: [SZ / 2, SZ / 2, 1.4] };
}
const BBS: BBox = [-6.4, 4, 6.4, -4];
const buildStack: Build<{ h: number[] }> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -38, pitch: 34, sc: 1.0, maxFaces: 130, maxLabels: 0, maxEdges: 0, maxDots: 0,
  scene: (q) => stackScene(q.h),
});
function StackSlide(p: { mode: "volume" | "luas" }) {
  const [h, setH] = useState<number[]>(PRE[0].h);
  const bump = (i: number) => setH(h.map((v, j) => (j === i ? (v + 1) % 5 : v)));
  const hh = (r: number, c: number) => (r < 0 || c < 0 || r >= SZ || c >= SZ ? 0 : h[r * SZ + c]);
  let V = 0, T = 0, S = 0;
  for (let r = 0; r < SZ; r++) for (let c = 0; c < SZ; c++) {
    const z = hh(r, c);
    if (!z) continue;
    V += z; T++;
    S += Math.max(0, z - hh(r, c + 1)) + Math.max(0, z - hh(r, c - 1)) + Math.max(0, z - hh(r + 1, c)) + Math.max(0, z - hh(r - 1, c));
  }
  const parts = h.filter((v) => v > 0);
  const vol = p.mode === "volume";
  const rand = () => setH(Array.from({ length: SZ * SZ }, () => (Math.random() < 0.35 ? 0 : 1 + Math.floor(Math.random() * 3))));
  return (
    <Frame
      eyebrow={vol ? "04 · Volume" : "03 · Luas permukaan"}
      title={vol ? "Volume susunan kubus satuan" : "Luas permukaan susunan kubus"}
      copy={vol ? (<>
        <p>Angka pada denah menunjukkan <b>tinggi tumpukan</b> kubus di kotak itu. Klik kotak untuk menambah kubus.</p>
        <p className="fragment">Volume = jumlah semua angka, sebab setiap kubus bervolume 1.</p>
        <p className="fragment">Coba tebak dulu volume susunan <b>Tangga</b> dan <b>Piramida</b>, lalu cocokkan dengan hitungan.</p>
      </>) : (<>
        <p>Hitung permukaan luar: berapa <b>persegi satuan</b> yang menutupi seluruh susunan?</p>
        <p className="fragment">Sisi atas dan bawah masing-masing sebanyak kotak yang terisi. Sisi samping dihitung dari <b>selisih tinggi</b> dengan tetangganya.</p>
        <p className="fragment">Jangan lupa <b>sisi bawah</b>. Seret papan ke bawah untuk melihatnya.</p>
      </>)}
      stage={<>
        <SimBoard bbox={BBS} params={{ h }} build={buildStack} maxH={270} />
        <Chips value={PRE.findIndex((x) => x.h.every((v, i) => v === h[i]))} onPick={(i) => setH(PRE[i].h)} items={PRE.map((x, i) => ({ v: i, label: x.name }))} />
        <div className="ds-row" style={{ alignItems: "flex-start" }}>
          <div>
            <div className="ds-grid" style={{ gridTemplateColumns: `repeat(${SZ}, 34px)` }} aria-label="denah tampak atas">
              {Array.from({ length: SZ * SZ }, (_, i) => {
                const r = SZ - 1 - Math.floor(i / SZ), c = i % SZ, idx = r * SZ + c;
                return (
                  <button key={i} type="button" className={`ds-cell${h[idx] ? " is-on" : ""}`} onClick={() => bump(idx)} aria-label={`tinggi ${h[idx]}`}>
                    {h[idx] || ""}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6, justifyContent: "center" }}>
              <Btn onClick={() => setH(Array(SZ * SZ).fill(0))}>Kosong</Btn>
              <Btn onClick={rand}>Acak</Btn>
            </div>
          </div>
          <div className="ds-read" style={{ flex: 1, minWidth: 250 }}>
            {vol ? (<>
              {parts.length ? parts.join(" + ") : "0"} = <b>{V}</b><br />
              volume = {V} satuan kubik
            </>) : (<>
              atas {T} + bawah {T} + samping {S}<br />
              luas = <b>{2 * T + S}</b> satuan luas<br />
              <span className="ds-muted" style={{ fontSize: 14 }}>volume = {V}</span>
            </>)}
          </div>
        </div>
      </>}
    />
  );
}

/* ═════════ 18 · Prisma: luas permukaan ═════════ */
function PrismAreaSlide() {
  const { tT, setT, t } = useFold(0);
  const [k, setK] = useState(0), [kind, setKind] = useState<"A" | "B">("B"), [h, setH] = useState(5);
  const sp = PRISMS[k];
  const La = polyArea(sp.base), K = polyPerim(sp.base), m = sp.base.length;
  const net = useMemo(() => prismNet(sp.base, h, kind), [sp, h, kind]);
  const labs = useMemo(() => net.map((f) => {
    if (f.src < 2) return n(La);
    const i = f.src - 2, a = sp.base[i], b = sp.base[(i + 1) % m];
    return n(Math.hypot(b[0] - a[0], b[1] - a[1]) * h);
  }), [net, sp, h, La, m]);
  return (
    <Frame
      eyebrow="03 · Luas permukaan"
      title="Luas permukaan prisma"
      copy={<>
        <p>Jaring prisma terdiri dari <b>dua alas</b> dan sisi-sisi tegak. Bila sisi tegak dijajarkan, mereka membentuk <b>satu persegi panjang</b> bertinggi t.</p>
        <p className="fragment">Panjang persegi panjang itu <b>keliling alas</b>, jadi luas selimut = {tex(raw`K_{alas}\times t`)}.</p>
        <p className="fragment">{tex(raw`L=2\times L_{alas}+K_{alas}\times t`)}</p>
        <p className="ds-muted">Angka pada jaring adalah luas tiap sisi.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ net, t, labs }} build={buildFold} maxH={265} />
        <Chips value={k} onPick={setK} items={PRISMS.map((x, i) => ({ v: i, label: x.name }))} />
        <Chips value={kind} onPick={setKind} items={[{ v: "A" as const, label: "Jaring A" }, { v: "B" as const, label: "Jaring B: selimut berjajar" }]} />
        <FoldBar tT={tT} setT={setT}>
          <Range label="tinggi prisma t" value={h} min={1} max={8} onChange={setH} color={C.teal} />
        </FoldBar>
        <div className="ds-read">
          L = 2 × {n(La)} + {n(K)} × {n(h)}<br />
          = {n(2 * La)} + {n(K * h)} = <b>{n(2 * La + K * h)}</b> satuan luas
        </div>
      </>}
    />
  );
}

/* ═════════ 19 · Prisma: volume ═════════ */
type PV = { k: number; h: number; layers: number };
const buildPrismVol: Build<PV> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -30, pitch: 36, maxFaces: 60, maxEdges: 20, maxLabels: 0, fill: 0.85, maxScale: 1.4,
  scene: (q) => {
    const base = PRISMS[q.k].base;
    const faces: F3[] = [];
    for (let j = 0; j < q.layers; j++) faces.push(...solidFaces(prismSolid(base, 1), () => (j % 2 ? "#0d9488" : C.teal), { cull: true, a: 1, at: [0, 0, j] }));
    const edges = solidEdges(prismSolid(base, q.h), "#64748b", 1.5, [0, 0, 0], 1);
    return { faces, edges };
  },
});
function PrismVolSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState(0), [h, setH] = useState(4), [layers, setL] = useState(0);
  useEffect(() => { setL(step >= 2 ? h : step >= 1 ? 1 : 0); }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  const La = polyArea(PRISMS[k].base), ll = Math.min(layers, h);
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · Volume"
      title="Volume prisma: tumpukan alas"
      copy={<>
        <p>Prisma adalah <b>tumpukan lapisan alas</b> yang sama, setebal 1 satuan.</p>
        <p className="fragment">Tekan →: satu lapisan bervolume {tex(raw`L_{alas}\times1`)}.</p>
        <p className="fragment">Tumpuk setinggi t. Ada t lapisan: {tex(raw`V=L_{alas}\times t`)}.</p>
        <p className="ds-muted">Alasnya boleh segitiga, trapesium, atau segi-n. Rumusnya tetap sama.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ k, h, layers: ll }} build={buildPrismVol} maxH={310} />
        <Chips value={k} onPick={setK} items={PRISMS.map((x, i) => ({ v: i, label: x.name }))} />
        <div className="ds-controls">
          <Range label="tinggi prisma t" value={h} min={1} max={6} onChange={(v) => { setH(v); if (layers > v) setL(v); }} color={C.teal} />
          <Range label="lapisan terisi" value={ll} min={0} max={h} onChange={setL} color={C.green} />
        </div>
        <div className="ds-read">
          L<sub>alas</sub> = {n(La)}<br />
          {ll} lapisan: {ll} × {n(La)} = <b>{n(ll * La)}</b>{ll === h && <> <span className="ds-ok">= volume ✓</span></>}
        </div>
      </>}
    />
  );
}

/* ═════════ 20 · Prisma segitiga = setengah balok ═════════ */
type HP = DimP & { split: number };
const buildHalf: Build<HP> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -36, pitch: 26, sc: 0.85, maxFaces: 12, maxEdges: 0, maxLabels: 0,
  scene: (q) => {
    const d = q.split * 2.4 / Math.SQRT2;
    const a = solidFaces(prismSolid([[0, 0], [q.p, 0], [0, q.l]], q.t), () => C.blue, { cull: true, a: 1 });
    const bb = solidFaces(prismSolid([[q.p, 0], [q.p, q.l], [0, q.l]], q.t), () => C.orange, { cull: true, a: 1, at: [d, d, 0] });
    return { faces: [...a, ...bb], center: [q.p / 2 + (q.split * 1.2) / Math.SQRT2, q.l / 2 + (q.split * 1.2) / Math.SQRT2, q.t / 2] };
  },
});
function HalfBoxSlide() {
  const [d, setD] = useState<DimP>({ p: 4, l: 3, t: 3 });
  const [split, setSplit] = useState(0.6);
  const set = (k: keyof DimP) => (v: number) => setD({ ...d, [k]: v });
  const VB = d.p * d.l * d.t;
  return (
    <Frame
      eyebrow="04 · Volume"
      title="Prisma segitiga: setengah balok"
      copy={<>
        <p>Potong balok sepanjang <b>bidang diagonal</b>. Hasilnya dua prisma segitiga yang <b>kongruen</b>.</p>
        <p className="fragment">Volume tiap prisma = setengah volume balok: {tex(raw`\tfrac12\,p\,l\,t`)}.</p>
        <p className="fragment">Karena {tex(raw`\tfrac12\,p\,l`)} adalah luas alas segitiga: {tex(raw`V=L_{alas}\times t`)}. Rumus yang sama dengan prisma lain.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...d, split }} build={buildHalf} maxH={320} />
        <div className="ds-controls">
          <Range label="p" value={d.p} min={1} max={6} onChange={set("p")} color={C.blue} />
          <Range label="l" value={d.l} min={1} max={6} onChange={set("l")} color={C.orange} />
          <Range label="t" value={d.t} min={1} max={6} onChange={set("t")} color={C.teal} />
          <Range label="pisahkan" value={split} min={0} max={1} step={0.05} onChange={setSplit} color={C.violet} shown={`${Math.round(split * 100)}%`} />
        </div>
        <div className="ds-read">
          balok: {n(d.p)} × {n(d.l)} × {n(d.t)} = <b>{n(VB)}</b><br />
          tiap prisma: ½ × {n(VB)} = <b>{n(VB / 2)}</b> = ({n(d.p * d.l / 2)}) × {n(d.t)}
        </div>
      </>}
    />
  );
}

/* ═════════ 21 · Limas: luas permukaan ═════════ */
type PY = { a: number; h: number; view: number; net: NetFace[]; t: number; labs?: string[] };
const pyrBase = (a: number): [number, number][] => [[-a / 2, -a / 2], [a / 2, -a / 2], [a / 2, a / 2], [-a / 2, a / 2]];
const buildPyr: Build<PY> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -30, pitch: 22, maxFaces: 8, maxEdges: 10, maxLabels: 8, fill: 0.8, maxScale: 3,
  flat: (p) => (p.view === 1 ? p.t : 1),
  scene: (q): Scene => {
    if (q.view === 1) return netScene(q.net, q.t, { labs: q.labs });
    const s = pyramidSolid(pyrBase(q.a), [0, 0, q.h]);
    const faces = solidFaces(s, pyrCol, { cull: true, ghost: true, a: 0.82 });
    const O: V3 = [0, 0, 0], M: V3 = [0, -q.a / 2, 0], T: V3 = [0, 0, q.h];
    faces.push({ p: [O, M, T], col: C.violet, a: 0.4, sw: 1 });
    const edges: E3[] = [
      { a: O, b: T, col: C.violet, w: 4 }, { a: O, b: M, col: C.teal, w: 4 }, { a: M, b: T, col: C.red, w: 4.5 },
    ];
    const labels: L3[] = [
      { p: [0, 0, q.h / 2], text: "t", col: C.violet, dx: 12 },
      { p: [0, -q.a / 4, 0], text: "a/2", col: C.teal, dy: 14 },
      { p: [0, -q.a / 4, q.h / 2], text: "s", col: C.red, dx: -14, dy: 4 },
    ];
    return { faces, edges, labels };
  },
});
function PyrAreaSlide() {
  const { tT, setT, t } = useFold(0);
  const [a, setA] = useState(6), [h, setH] = useState(4), [view, setView] = useState(0);
  const s = Math.hypot(h, a / 2);
  const net = useMemo(() => netFromSolid(pyramidSolid(pyrBase(a), [0, 0, h]), 0, null, pyrCol), [a, h]);
  const labs = useMemo(() => net.map((f) => (f.src === 0 ? n(a * a) : n((a * s) / 2))), [net, a, s]);
  return (
    <Frame
      eyebrow="03 · Luas permukaan"
      title="Luas permukaan limas"
      copy={<>
        <p>Limas persegi beraturan: alas persegi dan <b>4 segitiga</b> kongruen. Tinggi segitiga itu bukan tinggi limas, melainkan <b style={{ color: C.red }}>s</b>.</p>
        <p className="fragment">Segitiga siku-siku <b style={{ color: C.violet }}>t</b>, <b style={{ color: C.teal }}>a/2</b>, <b style={{ color: C.red }}>s</b> memberi {tex(raw`s=\sqrt{t^{2}+(a/2)^{2}}`)}.</p>
        <p className="fragment">{tex(raw`L=a^{2}+4\times\tfrac12\,a\,s=a^{2}+2as`)}</p>
        <p className="ds-muted">Contoh bulat: a = 6, t = 4, maka s = 5.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ a, h, view, net, t, labs }} build={buildPyr} maxH={300} />
        <Chips value={view} onPick={(v) => { setView(v); if (v === 1) setT(0); }} items={[{ v: 0, label: "Limas dan tingginya" }, { v: 1, label: "Jaring limas" }]} />
        {view === 1 && <FoldBar tT={tT} setT={setT} />}
        <div className="ds-controls">
          <Range label="a (sisi alas)" value={a} min={2} max={10} step={2} onChange={setA} color={C.teal} />
          <Range label="t (tinggi limas)" value={h} min={1} max={9} onChange={setH} color={C.violet} />
        </div>
        <div className="ds-read">
          s = √({n(h)}² + {n(a / 2)}²) = <b>{fmt(s, 2)}</b><br />
          L = {n(a * a)} + 4 × ½ × {n(a)} × {fmt(s, 2)} = <b>{fmt(a * a + 2 * a * s, 2)}</b>
        </div>
      </>}
    />
  );
}

/* ═════════ 22 · Limas: volume sepertiga ═════════ */
function cubePyr(s: number, w: number): Solid {
  const top: V3 = [s, s, s];
  const base: V3[] = [
    [[0, 0, 0], [s, 0, 0], [s, s, 0], [0, s, 0]],
    [[0, 0, 0], [0, 0, s], [s, 0, s], [s, 0, 0]],
    [[0, 0, 0], [0, s, 0], [0, s, s], [0, 0, s]],
  ][w] as V3[];
  return orient({ V: [...base, top], F: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]] });
}
type TP = { s: number; split: number; all: boolean };
const PYR3 = [C.blue, C.orange, C.teal];
const buildThird: Build<TP> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -36, pitch: 26, sc: undefined, maxFaces: 20, maxEdges: 12, maxLabels: 0, fill: 0.7, maxScale: 3,
  scene: (q) => {
    const gap = q.s * 0.9 * q.split;
    const off: V3[] = [[0, 0, -gap], [0, -gap, 0], [-gap, 0, 0]];
    const faces: F3[] = [];
    (q.all ? [0, 1, 2] : [0]).forEach((w) => faces.push(...solidFaces(cubePyr(q.s, w), () => PYR3[w], { cull: true, a: 1, at: off[w] })));
    const edges = boxEdges(q.s, q.s, q.s, "#64748b", 1.5, [0, 0, 0], 1);
    return { faces, edges, center: [q.s / 2 - (q.all ? gap / 3 : 0), q.s / 2 - (q.all ? gap / 3 : 0), q.s / 2 - (q.all ? gap / 3 : 0)] };
  },
});
function ThirdSlide() {
  const [s, setS] = useState(3), [split, setSplit] = useState(0.6), [all, setAll] = useState(true);
  const Vk = s ** 3;
  return (
    <Frame
      eyebrow="04 · Volume"
      title="Volume limas: sepertiga"
      copy={<>
        <p>Sebuah kubus dapat dibagi menjadi <b>tiga limas kongruen</b> yang puncaknya bertemu di satu titik sudut.</p>
        <p className="fragment">Alas tiap limas adalah satu sisi kubus ({tex(raw`s\times s`)}) dan tingginya s.</p>
        <p className="fragment">Tiga limas mengisi kubus, jadi {tex(raw`V_{limas}=\tfrac13s^{3}=\tfrac13\times L_{alas}\times t`)}.</p>
        <p className="ds-muted">Berlaku untuk semua limas, bukan hanya yang di dalam kubus.</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ s, split, all }} build={buildThird} maxH={320} />
        <Chips value={all ? 1 : 0} onPick={(v) => setAll(v === 1)} items={[{ v: 1, label: "Tiga limas" }, { v: 0, label: "Satu limas" }]} />
        <div className="ds-controls">
          <Range label="s" value={s} min={2} max={5} onChange={setS} color={C.ink} />
          <Range label="pisahkan" value={split} min={0} max={1} step={0.05} onChange={setSplit} color={C.violet} shown={`${Math.round(split * 100)}%`} />
        </div>
        <div className="ds-read">
          kubus: {n(s)}³ = <b>{n(Vk)}</b><br />
          satu limas: ⅓ × {n(s * s)} × {n(s)} = <b>{n(Vk / 3)}</b> {all && <span className="ds-ok">(3 × {n(Vk / 3)} = {n(Vk)} ✓)</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 23 · Akuarium ═════════ */
const idr = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const TANKS: { name: string; d: DimP }[] = [
  { name: "60 × 40 × 40 cm", d: { p: 60, l: 40, t: 40 } },
  { name: "80 × 40 × 50 cm", d: { p: 80, l: 40, t: 50 } },
  { name: "100 × 50 × 50 cm", d: { p: 100, l: 50, t: 50 } },
];
type AQ = DimP & { h: number; glass: boolean };
const buildTank: Build<AQ> = (b, g, _s, clock) => view3(b, g, clock, {
  yaw: -34, pitch: 24, maxFaces: 12, maxEdges: 4, maxLabels: 0, fill: 0.8, maxScale: 6,
  scene: (q) => {
    const k = 1 / 20, p = q.p * k, l = q.l * k, t = q.t * k;
    if (q.glass) {
      const faces = boxFaces(p, l, t, { cols: () => "#7dd3fc", cull: true, ghost: true, a: 0.4 }).filter((_f, i) => i !== 1);
      const rim: E3[] = [[0, 0], [p, 0], [p, l], [0, l]].map(([x, y], i, A) => ({ a: [x, y, t], b: [A[(i + 1) % 4][0], A[(i + 1) % 4][1], t], col: C.ink, w: 2.5 }));
      return { faces, edges: rim, center: [p / 2, l / 2, t / 2] };
    }
    const faces = boxFaces(p, l, t, { cols: () => GLASS, cull: true, ghost: true, a: 0.14 });
    if (q.h > 0) faces.push(...boxFaces(p, l, q.h * k, { cols: () => "#0ea5e9", cull: true, a: 0.65 }));
    return { faces, center: [p / 2, l / 2, t / 2] };
  },
});
function TankSlide() {
  const [k, setK] = useState(0), [h, setH] = useState(30), [glass, setGlass] = useState(false);
  const d = TANKS[k].d, hh = Math.min(h, d.t);
  const vol = d.p * d.l * hh, kaca = d.p * d.l + 2 * d.p * d.t + 2 * d.l * d.t;
  return (
    <Frame
      eyebrow="05 · Soal cerita"
      title="Akuarium"
      copy={<>
        <p>Akuarium berbentuk balok tanpa tutup. Dua pertanyaan khas: <b>berapa liter airnya</b> dan <b>berapa luas kacanya</b>?</p>
        <p className="fragment">Air mengisi <b>ruang</b>: gunakan volume {tex(raw`p\times l\times h`)}, lalu ubah {tex(raw`\text{cm}^{3}\to\text{liter}`)} dengan {tex(raw`\div1.000`)}.</p>
        <p className="fragment">Kaca adalah <b>kulit</b> tanpa tutup: {tex(raw`pl+2pt+2lt`)}. Satuannya cm².</p>
      </>}
      stage={<>
        <SimBoard bbox={BB} params={{ ...d, h: hh, glass }} build={buildTank} maxH={310} />
        <Chips value={k} onPick={(v) => { setK(v); if (h > TANKS[v].d.t) setH(TANKS[v].d.t); }} items={TANKS.map((x, i) => ({ v: i, label: x.name }))} />
        <Chips value={glass ? 1 : 0} onPick={(v) => setGlass(v === 1)} items={[{ v: 0, label: "Isi air" }, { v: 1, label: "Luas kaca" }]} />
        {!glass && <div className="ds-controls ds-controls--one"><Range label="tinggi air (cm)" value={hh} min={0} max={d.t} step={5} onChange={setH} color="#0ea5e9" /></div>}
        <div className="ds-read">
          {glass ? (<>
            kaca = {d.p}×{d.l} + 2×{d.p}×{d.t} + 2×{d.l}×{d.t}<br />
            = <b>{idr(kaca)}</b> cm²
          </>) : (<>
            air = {d.p} × {d.l} × {hh} = {idr(vol)} cm³<br />
            = <b>{fmt(vol / 1000, 1)}</b> liter
          </>)}
        </div>
      </>}
    />
  );
}

/* ═════════ 24 · Rangkuman ═════════ */
function SummarySlide() {
  return (
    <Frame
      eyebrow="Rangkuman"
      title="Rumus yang perlu diingat"
      copy={<>
        <p>Dua gagasan: <b>luas permukaan</b> = jumlah luas jaring, <b>volume</b> = luas alas × tinggi (limas dikali ⅓).</p>
        <p className="ds-muted">Bila lupa rumus, gambar jaring atau tumpuk kubus satuan.</p>
      </>}
      stage={<Tbl head={["Bangun", "Luas permukaan", "Volume"]} rows={[
        ["Kubus", tex(raw`6s^{2}`), tex(raw`s^{3}`)],
        ["Balok", tex(raw`2(pl+pt+lt)`), tex(raw`p\times l\times t`)],
        ["Prisma", tex(raw`2L_{alas}+K_{alas}\times t`), tex(raw`L_{alas}\times t`)],
        ["Limas", tex(raw`L_{alas}+\sum L_{segitiga}`), tex(raw`\tfrac13\times L_{alas}\times t`)],
        ["Kerangka", tex(raw`12s,\ 4(p+l+t)`), "panjang kawat"],
        ["Diagonal", tex(raw`s\sqrt2,\ s\sqrt3`), tex(raw`\sqrt{p^{2}+l^{2}+t^{2}}`)],
        ["Satuan", "cm², m²", <>cm³, m³; 1 L = 1.000 cm³</>],
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
        ["volume bersatuan cm²", "volume cm³, luas permukaan cm²"],
        [<>kubus punya 4 sisi: {tex(raw`4s^{2}`)}</>, <>kubus punya 6 sisi: {tex(raw`6s^{2}`)}</>],
        [<>prisma: {tex(raw`V=\tfrac13L_{alas}t`)}</>, <>⅓ hanya untuk <b>limas</b></>],
        ["tinggi prisma = tinggi segitiga alas", "t prisma = jarak dua alas; tinggi segitiga dipakai untuk luas alas"],
        ["tinggi limas = tinggi sisi tegak", <>tinggi limas tegak lurus alas; tinggi sisi tegak dari Pythagoras</>],
        ["enam persegi bersambung pasti jaring kubus", "uji lipatannya: tidak boleh ada persegi bertumpuk"],
        ["luas susunan kubus: hanya yang tampak", "hitung semua sisi luar, termasuk sisi bawah"],
      ]} />}
    />
  );
}

/* ═════════ 25 · Kuis ═════════ */
const QUIZ: QItem[] = [
  { q: <>Banyak sisi, rusuk, dan titik sudut balok berturut-turut adalah ....</>, opts: ["6, 12, 8", "6, 8, 12", "8, 12, 6", "4, 12, 8", "6, 12, 6"], ans: 0,
    why: <>Balok: 6 sisi, 12 rusuk, 8 titik sudut. Cek: {tex(raw`8-12+6=2`)}.</> },
  { q: <>Banyak rusuk pada prisma segitiga adalah ....</>, opts: ["6", "9", "12", "8", "5"], ans: 1,
    why: <>Tiga rusuk alas, tiga rusuk atas, dan tiga rusuk tegak: 9.</> },
  { q: <>Banyak rusuk pada limas segiempat adalah ....</>, opts: ["4", "5", "8", "12", "10"], ans: 2,
    why: <>Empat rusuk alas dan empat rusuk tegak: 8.</> },
  { q: <>Kerangka balok berukuran 12 cm × 8 cm × 5 cm dibuat dari kawat. Panjang kawat seluruhnya adalah ....</>, opts: ["100 cm", "60 cm", "50 cm", "200 cm", "480 cm"], ans: 0,
    why: <>{tex(raw`4(12+8+5)=100`)} cm.</> },
  { q: <>Banyak jaring-jaring kubus yang berbeda bentuknya adalah ....</>, opts: ["6", "8", "11", "12", "35"], ans: 2,
    why: <>Dari 35 susunan enam persegi, 11 yang dapat dilipat menjadi kubus.</> },
  { q: <>Luas permukaan kubus berrusuk 7 cm adalah ....</>, opts: ["196 cm²", "294 cm²", "343 cm²", "42 cm²", "147 cm²"], ans: 1,
    why: <>{tex(raw`6\times7^{2}=6\times49=294`)} cm².</> },
  { q: <>Luas permukaan balok berukuran 10 cm × 6 cm × 4 cm adalah ....</>, opts: ["124 cm²", "240 cm²", "248 cm²", "264 cm²", "480 cm²"], ans: 2,
    why: <>{tex(raw`2(60+40+24)=2\times124=248`)} cm².</> },
  { q: <>Susunan kubus satuan membentuk balok 5 × 4 × 3. Banyak kubus satuan yang diperlukan adalah ....</>, opts: ["12", "47", "60", "72", "20"], ans: 2,
    why: <>{tex(raw`5\times4\times3=60`)} kubus.</> },
  { q: <>Volume kubus 343 cm³. Panjang rusuknya adalah ....</>, opts: ["7 cm", "49 cm", "14 cm", "9 cm", "21 cm"], ans: 0,
    why: <>{tex(raw`s^{3}=343\Rightarrow s=7`)} cm, karena 7 × 7 × 7 = 343.</> },
  { q: <>Akuarium berukuran 50 cm × 30 cm × 40 cm diisi penuh. Banyak air adalah ....</>, opts: ["6 liter", "600 liter", "60 liter", "6.000 liter", "0,6 liter"], ans: 2,
    why: <>{tex(raw`50\times30\times40=60.000`)} cm³ = 60 dm³ = 60 liter.</> },
  { q: <>Alas prisma berbentuk segitiga siku-siku dengan sisi siku-siku 6 cm dan 8 cm. Tinggi prisma 12 cm. Volumenya adalah ....</>, opts: ["288 cm³", "576 cm³", "144 cm³", "480 cm³", "96 cm³"], ans: 0,
    why: <>{tex(raw`L_{alas}=\tfrac12\times6\times8=24`)}, jadi {tex(raw`V=24\times12=288`)} cm³.</> },
  { q: <>Alas prisma segitiga siku-siku bersisi 3 cm, 4 cm, 5 cm. Tinggi prisma 10 cm. Luas permukaannya adalah ....</>, opts: ["72 cm²", "132 cm²", "120 cm²", "252 cm²", "60 cm²"], ans: 1,
    why: <>{tex(raw`L=2\times6+(3+4+5)\times10=12+120=132`)} cm².</> },
  { q: <>Limas beralas persegi bersisi 12 cm dan tinggi 8 cm. Volumenya adalah ....</>, opts: ["384 cm³", "1.152 cm³", "96 cm³", "768 cm³", "192 cm³"], ans: 0,
    why: <>{tex(raw`V=\tfrac13\times144\times8=384`)} cm³.</> },
  { q: <>Limas beralas persegi bersisi 10 cm dan tinggi 12 cm. Luas permukaannya adalah ....</>, opts: ["360 cm²", "340 cm²", "460 cm²", "260 cm²", "520 cm²"], ans: 0,
    why: <>Tinggi sisi tegak {tex(raw`s=\sqrt{12^{2}+5^{2}}=13`)}. {tex(raw`L=100+4\times\tfrac12\times10\times13=360`)} cm².</> },
];

/* ═════════ 26 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Kulit dan isi"
      copy={<>
        <p>Jaring-jaring membuat <b>kulit</b> bangun menjadi datar, sehingga luas permukaan hanyalah <b>jumlah luas</b> bangun datar yang sudah Anda kenal.</p>
        <p className="fragment">Kubus satuan membuat <b>isi</b> bangun dapat dihitung: tumpukan lapisan alas setinggi t.</p>
        <p className="fragment">Limas hanya <b>sepertiga</b> prisma yang beralas dan bertinggi sama.</p>
        <p className="fragment">Kini rumus-rumus itu adalah sesuatu yang pernah Anda <b>lipat dan tumpuk sendiri</b>.</p>
      </>}
      stage={<div className="ds-read ds-math" style={{ maxWidth: 560, display: "grid", gap: 18 }}>
        {tex(raw`L_{\text{prisma}}=2L_{alas}+K_{alas}\,t`)}
        {tex(raw`V_{\text{prisma}}=L_{alas}\,t`)}
        {tex(raw`V_{\text{limas}}=\tfrac13L_{alas}\,t`)}
        {tex(raw`L_{\text{limas}}=L_{alas}+\sum L_{\triangle}`)}
      </div>}
    />
  );
}

export function BangunRuangDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <MapSlide />
      <ElementsSlide />
      <DimsSlide />
      <DiagSlide />
      <NetIntroSlide />
      <BoxNetSlide />
      <PrismNetSlide />
      <PyramidNetSlide />
      <ElevenSlide />
      <TestSlide />
      <DesignSlide />
      <SurfCubeSlide />
      <SurfBoxSlide />
      <StackSlide mode="luas" />
      <PrismAreaSlide />
      <PyrAreaSlide />
      <VolumeDefSlide />
      <UnitCubesSlide />
      <StackSlide mode="volume" />
      <PrismVolSlide />
      <HalfBoxSlide />
      <ThirdSlide />
      <TankSlide />
      <SummarySlide />
      <MistakesSlide />
      <Quiz eyebrow="Latihan · Kuis" title="Kuis 14 soal" items={QUIZ} />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default BangunRuangDeck;
