/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Btn, C, Chips, dot, fmt, Frame, note, OFF, Range, SimBoard, SlideDeck, useStep,
  type BBox, type Build, type Vec,
} from "../common/core";
import {
  boundary, fill, K, lin, ln, n, ok, Quiz, region, tex, consTxt,
  type Cons, type QItem,
} from "../common/LinearKit";

/* Deck "Program linear" (penerapan sistem pertidaksamaan): model → daerah feasible → titik pojok → Z optimum. */

const NONE = {};
const rp = (v: number) => `Rp${Math.round(v).toLocaleString("id-ID")}`;
const intsOf = (cons: Cons[]): Vec[] => {
  const out: Vec[] = [];
  for (let x = 0; x <= 40; x++) for (let y = 0; y <= 40; y++) if (cons.every((k) => ok(k, x, y))) out.push([x, y]);
  return out.slice(0, 40);
};

/* Data: penjahit (kain polos 40 m, batik 50 m; baju A untung 30.000, baju B 40.000). */
const TAILOR = [K(2, 1, "<=", 40), K(1, 2, "<=", 50), K(1, 0, ">=", 0), K(0, 1, ">=", 0)];
const TC: Vec[] = [[0, 0], [20, 0], [10, 20], [0, 25]];
const TBB: BBox = [-4, 45, 48, -8];

/* ───────── Papan program linear (dipakai banyak slide) ───────── */
type LPP = {
  cons: Cons[]; nc: number; corners: Vec[]; showC: boolean; a: number; b: number; k: number | null;
  best: Vec[]; pt: Vec | null; ints: Vec[];
};
const LC = [C.blue, C.orange, C.teal, C.mute, C.mute];
const buildLP: Build<LPP> = (b, g) => {
  fill(b, () => (g().nc > 0 ? region(g().cons.slice(0, g().nc)) : null), C.teal, 0.22);
  LC.forEach((c, i) => boundary(b, () => (i < g().nc ? g().cons[i] ?? null : null), c, i < 2 ? 2.75 : 1.75));
  for (let i = 0; i < 40; i++) dot(b, () => g().ints[i] ?? OFF, C.mute, 3);
  ln(b, () => (g().k == null ? null : [g().a, g().b, g().k as number]), C.violet, 3, 3);
  for (let i = 0; i < 6; i++) {
    const P = (): Vec => (g().showC ? g().corners[i] ?? OFF : OFF);
    dot(b, P, C.ink, 5);
    note(b, () => (P() === OFF ? OFF : [P()[0] + 0.8, P()[1] + 0.8]), () => `(${n(P()[0])}, ${n(P()[1])})`, C.ink);
  }
  [0, 1].forEach((i) => dot(b, () => g().best[i] ?? OFF, C.red, 10));
  const feas = () => !!g().pt && g().cons.every((k) => ok(k, g().pt![0], g().pt![1]));
  dot(b, () => (feas() ? g().pt! : OFF), C.green, 8);
  dot(b, () => { const q = g().pt; return q && !feas() ? q : OFF; }, C.red, 8);
};
const lp = (o: Partial<LPP> & Pick<LPP, "cons" | "a" | "b">): LPP => ({
  nc: o.cons.length, corners: [], showC: false, k: null, best: [], pt: null, ints: [], ...o,
});

/* ═════════ 0 · Sampul: garis selidik menyapu daerah ═════════ */
const buildCover: Build<object> = (b, _g, _s, clock) => {
  const k = () => Math.min(110, ((clock() % 6) / 6) * 135);
  fill(b, () => region(TAILOR), C.teal, 0.22);
  TAILOR.slice(0, 2).forEach((c, i) => boundary(b, () => c, i ? C.orange : C.blue, 2.75));
  ln(b, () => [3, 4, k()], C.violet, 3, 3);
  TC.forEach((p) => dot(b, () => p, C.ink, 5));
  dot(b, () => (k() >= 109.9 ? [10, 20] : OFF), C.red, 10);
  note(b, () => [-3, 42], () => `Z = ${fmt(k(), 0)}`, C.mute);
};
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi · Kelas X"
      title="Program linear"
      copy={<>
        <p>Bagaimana mencari <b>untung terbesar</b> atau <b>biaya terkecil</b> bila bahan terbatas?</p>
        <p className="ds-muted">Garis ungu menyapu daerah yang diperbolehkan. Titik merah adalah tempat ia terakhir menyentuh.</p>
      </>}
      stage={<SimBoard bbox={TBB} params={NONE} build={buildCover} loop />}
    />
  );
}

/* ═════════ 1 · Peta: tiga komponen ═════════ */
function MapSlide() {
  return (
    <Frame
      eyebrow="Peta materi"
      title="Tiga komponen program linear"
      copy={<>
        <p>Semua soal program linear dibangun dari tiga hal.</p>
        <p className="fragment"><b>Variabel keputusan</b>: yang ingin ditentukan.</p>
        <p className="fragment"><b>Kendala</b>: batas sumber daya, berbentuk pertidaksamaan.</p>
        <p className="fragment"><b>Fungsi tujuan</b>: yang dimaksimumkan atau diminimumkan.</p>
      </>}
      stage={
        <table className="ds-table">
          <thead><tr><th>Komponen</th><th>Contoh (penjahit)</th></tr></thead>
          <tbody>
            <tr><th>Variabel</th><td>x baju A, y baju B</td></tr>
            <tr><th>Kendala</th><td>{tex(String.raw`2x+y\le40,\ x+2y\le50,\ x,y\ge0`)}</td></tr>
            <tr><th>Tujuan</th><td>maksimumkan {tex(String.raw`Z=30.000x+40.000y`)}</td></tr>
            <tr><th>Kata kunci ≤</th><td>"paling banyak", "tidak lebih dari"</td></tr>
            <tr><th>Kata kunci ≥</th><td>"paling sedikit", "minimal"</td></tr>
          </tbody>
        </table>
      }
    />
  );
}

/* ═════════ 2 · Dari tabel ke model, lalu coba-coba ═════════ */
function TrialSlide() {
  const [x, setX] = useState(5), [y, setY] = useState(5);
  const polos = 2 * x + y, batik = x + 2 * y, z = 30000 * x + 40000 * y;
  const good = polos <= 40 && batik <= 50;
  return (
    <Frame
      eyebrow="01 · Model matematika"
      title="Dari tabel ke pertidaksamaan"
      copy={<>
        <p>Penjahit punya 40 m kain polos dan 50 m kain batik.</p>
        <table className="ds-table">
          <thead><tr><th /><th>Baju A (x)</th><th>Baju B (y)</th><th>Stok</th></tr></thead>
          <tbody>
            <tr><th>Polos</th><td>2 m</td><td>1 m</td><td>40</td></tr>
            <tr><th>Batik</th><td>1 m</td><td>2 m</td><td>50</td></tr>
            <tr><th>Untung</th><td>30.000</td><td>40.000</td><td /></tr>
          </tbody>
        </table>
        <p className="fragment">Tiap baris stok menjadi <b>satu kendala</b>: {tex(String.raw`2x+y\le40`)} dan {tex(String.raw`x+2y\le50`)}.</p>
        <p className="fragment">Coba beberapa (x, y). Titik hijau boleh dibuat, merah melampaui stok.</p>
      </>}
      stage={<>
        <SimBoard bbox={TBB} params={lp({ cons: TAILOR, a: 3, b: 4, pt: [x, y] })} build={buildLP} maxH={290} />
        <div className="ds-controls">
          <Range label={tex(String.raw`x\ (\text{baju A})`)} value={x} min={0} max={50} onChange={setX} color={C.blue} />
          <Range label={tex(String.raw`y\ (\text{baju B})`)} value={y} min={0} max={50} onChange={setY} color={C.orange} />
        </div>
        <div className="ds-read">
          <span style={{ color: polos <= 40 ? C.ink : C.red }}>polos: {polos} m (maks 40)</span> · <span style={{ color: batik <= 50 ? C.ink : C.red }}>batik: {batik} m (maks 50)</span><br />
          {good ? <span className="ds-ok">boleh dibuat · untung {rp(z)}</span> : <span className="ds-bad">stok tidak cukup</span>}
        </div>
      </>}
    />
  );
}

/* ═════════ 3 · Lima langkah ═════════ */
function FiveSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const nc = step < 2 ? 0 : step < 3 ? 2 : 4;
  const z = (p: Vec) => 30000 * p[0] + 40000 * p[1];
  return (
    <Frame
      innerRef={ref}
      eyebrow="02 · Lima langkah"
      title="Dari soal ke jawaban"
      copy={<>
        <p>Penjahit tadi: berapa baju A dan B agar untungnya terbesar?</p>
        <p className="fragment"><b>1 · Misalkan</b> variabel keputusan.</p>
        <p className="fragment"><b>2 · Susun model</b>: kendala dan fungsi tujuan. Gambar garis batasnya.</p>
        <p className="fragment"><b>3 · Gambar daerah feasible</b>: irisan semua kendala, dibantu titik uji.</p>
        <p className="fragment"><b>4 · Cari titik pojok</b>, termasuk perpotongan dua garis.</p>
        <p className="fragment"><b>5 · Hitung Z</b> di semua titik pojok, lalu pilih yang terbesar.</p>
      </>}
      stage={<>
        <SimBoard
          bbox={TBB} maxH={290} build={buildLP}
          params={lp({ cons: TAILOR, nc, a: 3, b: 4, corners: TC, showC: step >= 4, k: step >= 5 ? 110 : null, best: step >= 5 ? [[10, 20]] : [] })}
        />
        <div className="ds-read">
          {step < 1 && "Tekan → untuk memulai."}
          {step >= 1 && <div>x = banyak baju A, y = banyak baju B</div>}
          {step >= 2 && <div>{TAILOR.map((k) => consTxt(k)).slice(0, 2).join("  ·  ")}  ·  x, y ≥ 0<br />maks Z = 30.000x + 40.000y</div>}
          {step >= 4 && TC.map((p, i) => (
            <div key={i} style={step >= 5 && i === 2 ? { color: C.red, fontWeight: 700 } : undefined}>
              ({p[0]}, {p[1]}) → {rp(z(p))}
            </div>
          ))}
          {step >= 5 && <div className="ds-ok">Untung maksimum {rp(z([10, 20]))}: 10 baju A dan 20 baju B</div>}
        </div>
      </>}
    />
  );
}

/* ═════════ Slide generik: garis selidik pada banyak kasus ═════════ */
type Pre = {
  name: string; cons: Cons[]; corners: Vec[]; a: number; b: number; max: boolean; kmax: number;
  bbox: BBox; unit: string; open?: boolean; ints?: boolean; note?: string;
};
const base = (name: string, a: number, b: number, kmax: number): Pre => ({
  name, cons: TAILOR, corners: TC, a, b, max: true, kmax, bbox: TBB, unit: "puluhan ribu rupiah",
});
function LPSlide(p: { eyebrow: string; title: string; copy: ReactNode; presets: Pre[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [pi, setPi] = useState(0);
  const [k, setK] = useState<number | null>(null);
  const pre = p.presets[pi];
  const pts = pre.ints ? intsOf(pre.cons) : pre.corners;
  const z = (q: Vec) => pre.a * q[0] + pre.b * q[1];
  const opt = pts.length ? (pre.max ? Math.max(...pts.map(z)) : Math.min(...pts.map(z))) : NaN;
  const bests = pts.filter((q) => Math.abs(z(q) - opt) < 1e-9);
  const cz = pre.corners.map(z);
  const hit = k !== null && cz.length > 0 && (pre.open ? k >= Math.min(...cz) - 1e-9 : k >= Math.min(...cz) - 1e-9 && k <= Math.max(...cz) + 1e-9);
  useEffect(() => {
    if (!Number.isFinite(opt)) { setK(null); return; }
    const f = pre.max ? [0, 0.35, 0.7, 1] : [0, 2, 1.4, 1];
    setK(step === 0 ? null : Math.round(opt * f[Math.min(step, 3)]));
  }, [step, pi, opt, pre.max]);
  return (
    <Frame
      innerRef={ref}
      eyebrow={p.eyebrow}
      title={p.title}
      copy={p.copy}
      stage={<>
        <SimBoard
          bbox={pre.bbox} maxH={290} build={buildLP}
          params={lp({ cons: pre.cons, a: pre.a, b: pre.b, corners: pre.corners, showC: true, k, best: bests.slice(0, 2), ints: pre.ints ? pts : [] })}
        />
        <Chips value={pi} onPick={setPi} items={p.presets.map((o, i) => ({ v: i, label: o.name }))} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex(String.raw`k\ \text{pada}\ Z=k`)} value={k ?? 0} min={0} max={pre.kmax} onChange={setK} color={C.violet} />
        </div>
        <div className="ds-read">
          {pre.corners.length === 0 ? <span className="ds-bad">Daerah kosong: tidak ada titik yang memenuhi semua kendala.</span> : <>
            {pre.corners.map((q, i) => (
              <div key={i} style={bests.includes(q) && !pre.ints ? { color: C.red, fontWeight: 700 } : undefined}>
                ({n(q[0])}, {n(q[1])}) → Z = {n(z(q))}
              </div>
            ))}
            {k !== null && <div style={{ color: C.violet }}>garis selidik Z = {n(k)}: {hit ? "memotong daerah" : "di luar daerah"}</div>}
            {step >= 3 && (pre.ints
              ? <div className="ds-ok">Titik bulat terbaik: Z = {n(opt)} di {bests.map((q) => `(${q[0]}, ${q[1]})`).join(" dan ")}</div>
              : <div className="ds-ok">{bests.length > 1 ? `Optimum ganda: Z = ${n(opt)} di seluruh ruas ${bests.map((q) => `(${n(q[0])}, ${n(q[1])})`).join("–")}` : `${pre.max ? "Maksimum" : "Minimum"} Z = ${n(opt)} di (${n(bests[0][0])}, ${n(bests[0][1])})`}</div>)}
            {pre.open && <div className="ds-muted" style={{ fontSize: 14 }}>Daerah tak terbatas: Z bisa membesar tanpa batas, jadi hanya minimum yang ada.</div>}
          </>}
          <div className="ds-muted" style={{ fontSize: 14 }}>Z = {lin(pre.a, pre.b)} (satuan: {pre.unit}){pre.note ? ` · ${pre.note}` : ""}</div>
        </div>
      </>}
    />
  );
}

/* ═════════ 4 · Titik pojok dan garis selidik ═════════ */
const SEL: Pre[] = [
  base("Z = 3x + 4y", 3, 4, 130),
  base("Z = x + 4y", 1, 4, 120),
  base("Z = 5x + y", 5, 1, 120),
  { ...base("Z = 2x + y", 2, 1, 60), note: "sejajar garis 2x + y = 40" },
];
const SelectSlide = () => (
  <LPSlide
    eyebrow="03 · Titik pojok"
    title="Garis selidik menunjuk titik optimum"
    presets={SEL}
    copy={<>
      <p>Tiap nilai <b>k</b> pada Z = ax + by memberi garis. Semua garisnya <b>sejajar</b>.</p>
      <p className="fragment">Geser garis ke arah k membesar. Mula-mula ia berada di luar daerah.</p>
      <p className="fragment">Tepat sebelum meninggalkan daerah, ia menyentuh <b>titik pojok</b> yang memberi maksimum.</p>
      <p className="fragment">Ganti fungsi tujuan. Optimum berpindah ke <b>titik pojok lain</b>. Saat Z sejajar garis batas, optimumnya <b>ganda</b>.</p>
    </>}
  />
);

/* ═════════ 5 · Meminimumkan dan daerah tak terbatas ═════════ */
const MINS: Pre[] = [
  {
    name: "Min Z = 3x + 5y", cons: [K(1, 1, ">=", 6), K(1, 2, ">=", 8), K(1, 0, ">=", 0), K(0, 1, ">=", 0)],
    corners: [[0, 6], [4, 2], [8, 0]], a: 3, b: 5, max: false, kmax: 80, bbox: [-1, 11, 13, -2], unit: "satuan biaya", open: true,
  },
  {
    name: "Biaya pakan", cons: [K(3, 2, ">=", 60), K(1, 2, ">=", 40), K(1, 0, ">=", 0), K(0, 1, ">=", 0)],
    corners: [[0, 30], [10, 15], [40, 0]], a: 4, b: 3, max: false, kmax: 200, bbox: [-5, 45, 55, -5], unit: "ribu rupiah", open: true,
    note: "protein 3x+2y ≥ 60, vitamin x+2y ≥ 40",
  },
];
const MinSlide = () => (
  <LPSlide
    eyebrow="04 · Meminimumkan"
    title="Biaya terkecil, daerah tak terbatas"
    presets={MINS}
    copy={<>
      <p>Kata "<b>minimal</b>" memberi tanda ≥, sehingga daerahnya terbuka ke atas dan kanan.</p>
      <p className="fragment">Sekarang garis selidik digeser ke arah k <b>mengecil</b>.</p>
      <p className="fragment"><b>Titik pertama</b> yang disentuh memberi minimum.</p>
      <p className="fragment">Daerahnya tak terbatas, jadi Z bisa membesar tanpa batas. <b>Maksimum tidak ada</b>.</p>
    </>}
  />
);

/* ═════════ 6 · Catatan penting ═════════ */
const NOTES: Pre[] = [
  {
    name: "Bilangan bulat", cons: [K(2, 1, "<=", 10), K(1, 3, "<=", 13), K(1, 0, ">=", 0), K(0, 1, ">=", 0)],
    corners: [[0, 0], [5, 0], [3.4, 3.2], [0, 13 / 3]], a: 1, b: 1, max: true, kmax: 8, bbox: [-1, 7, 8, -1], unit: "satuan", ints: true,
    note: "titik abu-abu = titik bulat",
  },
  {
    name: "Daerah kosong", cons: [K(1, 1, "<=", 2), K(1, 1, ">=", 5), K(1, 0, ">=", 0), K(0, 1, ">=", 0)],
    corners: [], a: 1, b: 1, max: true, kmax: 8, bbox: [-1, 8, 9, -1], unit: "satuan",
  },
];
const NotesSlide = () => (
  <LPSlide
    eyebrow="05 · Catatan penting"
    title="Bulat, ganda, dan kosong"
    presets={NOTES}
    copy={<>
      <p>Tiga hal yang sering menjebak.</p>
      <p className="fragment"><b>Banyak benda harus bulat</b>. Titik pojok (3,4; 3,2) tidak bisa dipakai. Periksa titik bulat di sekitarnya.</p>
      <p className="fragment"><b>Optimum ganda</b> terjadi bila garis selidik sejajar garis batas (lihat slide sebelumnya).</p>
      <p className="fragment"><b>Daerah kosong</b>: kendalanya saling bertentangan, soal tidak punya penyelesaian.</p>
    </>}
  />
);

/* ═════════ 7 · Latihan: misi untung maksimum ═════════ */
const ROTI = [K(2, 1, "<=", 40), K(1, 2, "<=", 44), K(1, 0, ">=", 0), K(0, 1, ">=", 0)];
const RC: Vec[] = [[0, 0], [20, 0], [12, 16], [0, 22]];
const RBB: BBox = [-4, 28, 28, -4];
function MissionSlide() {
  const [x, setX] = useState(0), [y, setY] = useState(0);
  const [best, setBest] = useState(0), [bp, setBp] = useState<Vec | null>(null), [hint, setHint] = useState(false);
  const feas = ROTI.every((k) => ok(k, x, y)), z = 6 * x + 4 * y, won = best === 136;
  const move = (nx: number, ny: number) => {
    setX(nx); setY(ny);
    if (ROTI.every((k) => ok(k, nx, ny)) && 6 * nx + 4 * ny > best) { setBest(6 * nx + 4 * ny); setBp([nx, ny]); }
  };
  return (
    <Frame
      eyebrow="Latihan 1"
      title="Misi: untung roti terbesar"
      copy={<>
        <p>Pembuat roti punya 4 kg tepung dan 1.100 g mentega.</p>
        <p>Roti A: 200 g tepung, 25 g mentega, untung Rp6.000. Roti B: 100 g tepung, 50 g mentega, untung Rp4.000.</p>
        <p className="fragment">Geser x dan y. Cari untung <b>terbesar</b> yang masih memenuhi stok.</p>
        <p className="fragment">Petunjuk: yang terbaik selalu ada di <b>titik pojok</b>.</p>
      </>}
      stage={<>
        <SimBoard
          bbox={RBB} maxH={280} build={buildLP}
          params={lp({ cons: ROTI, a: 6, b: 4, corners: RC, showC: hint, pt: [x, y], best: won ? [[12, 16]] : [] })}
        />
        <div className="ds-controls">
          <Range label={tex(String.raw`x\ (\text{roti A})`)} value={x} min={0} max={28} onChange={(v) => move(v, y)} color={C.blue} />
          <Range label={tex(String.raw`y\ (\text{roti B})`)} value={y} min={0} max={28} onChange={(v) => move(x, v)} color={C.orange} />
        </div>
        <div className="ds-read">
          tepung {200 * x + 100 * y} g (maks 4000) · mentega {25 * x + 50 * y} g (maks 1100)<br />
          {feas ? <span className="ds-ok">boleh · untung {rp(z * 1000)}</span> : <span className="ds-bad">stok tidak cukup</span>}
          {" "}· terbaik: <b>{rp(best * 1000)}</b>{bp ? ` di (${bp[0]}, ${bp[1]})` : ""}
          {won && <><br /><span className="ds-ok">✓ Tepat! Itu titik pojok perpotongan kedua garis. Untung maksimum Rp136.000.</span></>}
          <br /><Btn onClick={() => setHint((h) => !h)}>{hint ? "Sembunyikan" : "Tampilkan"} titik pojok</Btn>{" "}
          <Btn onClick={() => { setX(0); setY(0); setBest(0); setBp(null); setHint(false); }}>Ulangi</Btn>
        </div>
      </>}
    />
  );
}

/* ═════════ 8 · Kuis ═════════ */
const AX = [K(1, 0, ">=", 0), K(0, 1, ">=", 0)];
const QUIZ: QItem[] = [
  {
    q: <>Nilai maksimum {tex("Z=2x+5y")} dengan {tex("x+y\\le8,\\ x\\le6,\\ y\\le5,\\ x,y\\ge0")} adalah ....</>,
    opts: ["25", "28", "31", "34", "36"], ans: 2,
    why: <>Titik pojok (0,0), (6,0), (6,2), (3,5), (0,5) memberi Z = 0, 12, 22, 31, 25. Maksimum 31.</>,
    viz: { bbox: [-1, 8, 9, -2], cons: [K(1, 1, "<=", 8), K(1, 0, "<=", 6), K(0, 1, "<=", 5), ...AX], pts: [[0, 0], [6, 0], [6, 2], [0, 5]], mark: [3, 5] },
  },
  {
    q: <>Nilai minimum {tex("Z=3x+4y")} dengan {tex("2x+y\\ge10,\\ x+2y\\ge8,\\ x,y\\ge0")} adalah ....</>,
    opts: ["18", "20", "24", "28", "40"], ans: 1,
    why: <>Titik pojok (0,10), (4,2), (8,0) memberi Z = 40, 20, 24. Minimum 20.</>,
    viz: { bbox: [-1, 12, 10, -2], cons: [K(2, 1, ">=", 10), K(1, 2, ">=", 8), ...AX], pts: [[0, 10], [8, 0]], mark: [4, 2] },
  },
  {
    q: <>Nilai maksimum {tex("Z=3x+4y")} dengan {tex("x+y\\le10,\\ x+2y\\le14,\\ x,y\\ge0")} adalah ....</>,
    opts: ["24", "26", "28", "30", "34"], ans: 4,
    why: <>Titik pojok (0,0), (10,0), (6,4), (0,7) memberi Z = 0, 30, 34, 28. Maksimum 34 di perpotongan.</>,
    viz: { bbox: [-1, 12, 12, -2], cons: [K(1, 1, "<=", 10), K(1, 2, "<=", 14), ...AX], pts: [[0, 0], [10, 0], [0, 7]], mark: [6, 4] },
  },
  {
    q: <>Nilai maksimum {tex("P=5x+3y")} dengan {tex("x+y\\le12,\\ 2x+y\\le16,\\ x,y\\ge0")} adalah ....</>,
    opts: ["36", "40", "44", "48", "52"], ans: 2,
    why: <>Titik pojok (0,0), (8,0), (4,8), (0,12) memberi P = 0, 40, 44, 36. Maksimum 44.</>,
    viz: { bbox: [-2, 14, 12, -2], cons: [K(1, 1, "<=", 12), K(2, 1, "<=", 16), ...AX], pts: [[0, 0], [8, 0], [0, 12]], mark: [4, 8] },
  },
  {
    q: <>Pedagang sepeda bermodal Rp30.000.000 dan tempat paling banyak 18 sepeda. Sepeda biasa Rp1.500.000 (untung Rp200.000), sepeda gunung Rp2.000.000 (untung Rp300.000). Untung maksimum adalah ....</>,
    opts: ["Rp3.600.000", "Rp4.200.000", "Rp4.500.000", "Rp4.800.000", "Rp5.400.000"], ans: 2,
    why: <>Kendala x + y ≤ 18 dan 3x + 4y ≤ 60. Z = 2x + 3y (ratusan ribu). Pojok (0,15) memberi 45, yaitu Rp4.500.000.</>,
    viz: { bbox: [-2, 20, 22, -3], cons: [K(1, 1, "<=", 18), K(3, 4, "<=", 60), ...AX], pts: [[0, 0], [18, 0], [12, 6]], mark: [0, 15] },
  },
  {
    q: <>Tempat parkir 600 m² memuat paling banyak 58 kendaraan. Mobil 6 m² (x), bus 24 m² (y). Model matematikanya ....</>,
    opts: ["x + y ≤ 58, x + 4y ≤ 100", "x + y ≤ 58, 4x + y ≤ 100", "x + y ≥ 58, x + 4y ≤ 100", "x + y ≤ 58, x + 4y ≥ 100", "x + y ≤ 58, 6x + 24y ≤ 100"], ans: 0,
    why: <>6x + 24y ≤ 600 dibagi 6 menjadi x + 4y ≤ 100. "Paling banyak" berarti ≤.</>,
  },
  {
    q: <>Gradien garis selidik {tex("Z=4x+2y")} adalah ....</>,
    opts: ["2", "−2", "1/2", "−1/2", "4"], ans: 1,
    why: <>4x + 2y = k → y = −2x + k/2. Gradiennya −2, sama dengan −a/b.</>,
  },
];

/* ═════════ 9 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Lima langkah, satu kebiasaan"
      copy={<>
        <p>Program linear = <b>pertidaksamaan</b> + <b>satu tujuan</b>.</p>
        <p className="fragment">Kebiasaan: hitung Z di <b>semua</b> titik pojok, bukan satu saja.</p>
        <p className="fragment">Cek akhir: jawaban punya <b>satuan</b>, dan titik optimum memenuhi <b>semua</b> kendala.</p>
      </>}
      stage={
        <table className="ds-table">
          <thead><tr><th>Langkah</th><th>Isi</th></tr></thead>
          <tbody>
            <tr><th>1 · Misalkan</th><td>variabel keputusan x dan y</td></tr>
            <tr><th>2 · Model</th><td>kendala, x, y ≥ 0, fungsi tujuan Z</td></tr>
            <tr><th>3 · Daerah</th><td>garis batas + titik uji, lalu irisan</td></tr>
            <tr><th>4 · Titik pojok</th><td>termasuk perpotongan dua garis</td></tr>
            <tr><th>5 · Hitung Z</th><td>pilih terbesar (maks) atau terkecil (min)</td></tr>
          </tbody>
        </table>
      }
    />
  );
}

export function ProgramLinearDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <MapSlide />
      <TrialSlide />
      <FiveSlide />
      <SelectSlide />
      <MinSlide />
      <NotesSlide />
      <MissionSlide />
      <Quiz eyebrow="Latihan 2" title="Kuis cepat" items={QUIZ} />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default ProgramLinearDeck;