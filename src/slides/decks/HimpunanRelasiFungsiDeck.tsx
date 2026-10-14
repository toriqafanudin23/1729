/* eslint-disable @typescript-eslint/no-explicit-any */
/* Deck "Pengantar Himpunan, Relasi, dan Fungsi" (kelas 8).
   Pola yang sama dengan deck lain: tiap fragmen (→) menaikkan `step`, dan `step` mengatur visual.
   Diagram Venn dan diagram panah digambar dengan SVG biasa (komponen <Venn> dan <Arrows>);
   diagram Kartesius dan grafik nilai fungsi memakai SimBoard (JSXGraph).
   Alur: Himpunan (slide 1–10) → Relasi (11–14) → Fungsi (15–23) → Ringkasan dan kuis. */
import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Btn, C, Chips, dot, Frame, mk, note, OFF, Range, seg, SimBoard, SlideDeck, still, useStep,
  type BBox, type Build, type Vec,
} from "../common/core";
import { n, Quiz, tex } from "../common/LinearKit";
import { QUIZ } from "./quizzes/HimpunanRelasiFungsiQuiz";
import "../styles/himpunan.css";

const raw = String.raw;
const nt = (v: number) => n(v).replace(",", "{,}"); // koma desimal aman di TeX
type El = number | string;
const tx = (v: El) => (typeof v === "number" && v < 0 ? `-${-v}` : String(v));
const show = (v: El) => String(v).replace("-", "−");
const setTex = (xs: El[]) => (xs.length ? raw`\{${xs.map(tx).join(raw`,\ `)}\}` : raw`\varnothing`);
const P = (x: number) => (x < 0 ? `(${nt(x)})` : nt(x));

/* ───────── UI kecil ───────── */
const Ctl = ({ children, one }: { children: ReactNode; one?: boolean }) => (
  <div className={`ds-controls${one ? " ds-controls--one" : ""}`}>{children}</div>
);
const Read = ({ rows }: { rows: ReactNode[] }) => (
  <div className="ds-read">{rows.map((r, i) => <div key={i}>{r}</div>)}</div>
);
const Muted = ({ children }: { children: ReactNode }) => <span style={{ color: C.mute }}>{children}</span>;
const Chk = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <span style={{ color: ok ? C.green : C.red }}>{ok ? "✓" : "✗"} {children}</span>
);
const Hint = ({ children }: { children: ReactNode }) => <p className="hf-hint">{children}</p>;

/* ───────── Analisis pemetaan ───────── */
type Pair = [number, number];
function analyze(nA: number, nB: number, pairs: Pair[]) {
  const out = Array<number>(nA).fill(0), inn = Array<number>(nB).fill(0);
  pairs.forEach(([i, j]) => { out[i]++; inn[j]++; });
  const isFunc = out.every((v) => v === 1);
  const inj = isFunc && inn.every((v) => v <= 1);
  const sur = isFunc && inn.every((v) => v >= 1);
  return { out, inn, isFunc, inj, sur, bij: inj && sur };
}

/* ═════════════════ Diagram panah (dipakai relasi dan fungsi) ═════════════════ */
type NSt = { fill?: string; stroke?: string; color?: string; dash?: boolean; w?: number };
type PCol = "ink" | "hot" | "red" | "teal";
const PCOLS: Record<PCol, string> = { ink: "#475569", hot: C.orange, red: C.red, teal: C.teal };
const AX = 96, BX = 304, GAP = 54;
const pw = (v: El) => Math.max(38, 16 + String(v).length * 9.5);

function Arrows(p: {
  A: El[]; B: El[]; pairs: Pair[]; shown?: number; hot?: number | null; hotA?: number | null;
  names?: [string, string]; nodeA?: (i: number) => NSt; nodeB?: (j: number) => NSt;
  pairCol?: (k: number) => PCol; onA?: (i: number) => void; onB?: (j: number) => void; maxH?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const mx = Math.max(p.A.length, p.B.length, 1), H = mx * GAP + 84, mid = H / 2 + 10;
  const y = (i: number, len: number) => mid + (i - (len - 1) / 2) * GAP;
  const vis = p.shown ?? p.pairs.length;
  const names = p.names ?? ["A", "B"];
  const cols: [number, El[], string, string, ((i: number) => NSt) | undefined, ((i: number) => void) | undefined, NSt][] = [
    [AX, p.A, names[0], C.blue, p.nodeA, p.onA, { fill: "#eaf2fb", stroke: C.blue }],
    [BX, p.B, names[1], C.orange, p.nodeB, p.onB, { fill: "#fdeee5", stroke: C.orange }],
  ];
  const focus = p.hot ?? null, fa = p.hotA ?? null;
  return (
    <svg viewBox={`0 0 400 ${H}`} className="hf-arrows" style={{ maxHeight: p.maxH ?? 330 }} role="img" aria-label="Diagram panah">
      <defs>
        {(Object.keys(PCOLS) as PCol[]).map((k) => (
          <marker key={k} id={`${uid}${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={PCOLS[k]} />
          </marker>
        ))}
      </defs>
      {cols.map(([cx, items, nm, col]) => {
        const rx = Math.max(58, Math.max(...items.map(pw), 0) / 2 + 18), ry = items.length * 27 + 22;
        return (
          <g key={nm}>
            <ellipse cx={cx} cy={mid} rx={rx} ry={ry} fill={col + "10"} stroke={col} strokeWidth="2.5" />
            <text x={cx} y={mid - ry - 8} textAnchor="middle" fontSize="17" fontWeight="700" fill={col} fontFamily="var(--mono)">{nm}</text>
          </g>
        );
      })}
      {p.pairs.map(([i, j], k) => {
        const x1 = AX + pw(p.A[i]) / 2 + 3, x2 = BX - pw(p.B[j]) / 2 - 3, y1 = y(i, p.A.length), y2 = y(j, p.B.length);
        const hit = focus !== null ? k === focus : fa !== null ? i === fa : false;
        const dim = (focus !== null || fa !== null) && !hit;
        const c: PCol = hit ? "hot" : p.pairCol?.(k) ?? "ink";
        return (
          <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={PCOLS[c]} strokeWidth={hit ? 3.5 : 2.5}
            markerEnd={`url(#${uid}${c})`} style={{ opacity: k < vis ? (dim ? 0.18 : 1) : 0, transition: "opacity 0.4s" }} />
        );
      })}
      {cols.map(([cx, items, nm, , fn, click, base]) =>
        items.map((v, i) => {
          const st = { ...base, ...(fn?.(i) ?? {}) }, w = pw(v), yy = y(i, items.length);
          const act = click ? () => click(i) : undefined;
          return (
            <g key={`${nm}${i}`} className="hf-pill" role={act ? "button" : undefined} tabIndex={act ? 0 : undefined} onClick={act}
              onKeyDown={act ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); act(); } } : undefined}>
              <rect x={cx - w / 2} y={yy - 17} width={w} height={34} rx={17} fill={st.fill} stroke={st.stroke}
                strokeWidth={st.w ?? 2.25} strokeDasharray={st.dash ? "5 4" : undefined} />
              <text x={cx} y={yy} textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="600" fill={st.color ?? C.ink} fontFamily="var(--sans)">{show(v)}</text>
            </g>
          );
        }),
      )}
    </svg>
  );
}

/* ═════════════════ Diagram Venn ═════════════════ */
type Reg = "a" | "ab" | "b" | "n";
type Circ = [number, number, number];
const GEO: Record<"over" | "nest", { A: Circ; B: Circ; anc: Record<Reg, Vec>; la: Vec; lb: Vec }> = {
  over: { A: [200, 170, 115], B: [320, 170, 115], anc: { a: [140, 170], ab: [260, 170], b: [380, 170], n: [480, 300] }, la: [100, 48], lb: [420, 48] },
  nest: { A: [240, 172, 135], B: [290, 190, 64], anc: { a: [170, 150], ab: [290, 190], b: [290, 190], n: [470, 290] }, la: [112, 64], lb: [356, 138] },
};
const SLOT_CACHE: Record<string, Record<Reg, Vec[]>> = {};
function slots(geo: "over" | "nest", showB: boolean) {
  const key = geo + showB;
  if (SLOT_CACHE[key]) return SLOT_CACHE[key];
  const g = GEO[geo], out: Record<Reg, Vec[]> = { a: [], ab: [], b: [], n: [] };
  for (let i = 0; i < 16; i++) for (let j = 0; j < 10; j++) {
    const x = 30 + 30 * i, yy = 30 + 30 * j;
    const dA = Math.hypot(x - g.A[0], yy - g.A[1]) - g.A[2];
    const dB = showB ? Math.hypot(x - g.B[0], yy - g.B[1]) - g.B[2] : 99;
    const inA = dA < -16, outA = dA > 16, inB = dB < -16, outB = dB > 16;
    const r: Reg | null = inA && outB ? "a" : inA && inB ? "ab" : outA && inB ? "b" : outA && outB ? "n" : null;
    if (r) out[r].push([x, yy]);
  }
  (Object.keys(out) as Reg[]).forEach((r) => {
    const [ax, ay] = g.anc[r];
    out[r].sort((p, q) => Math.hypot(p[0] - ax, p[1] - ay) - Math.hypot(q[0] - ax, q[1] - ay));
  });
  return (SLOT_CACHE[key] = out);
}

function Venn(p: { S: number[]; A: number[]; B: number[]; hl: Reg[]; showB?: boolean; nest?: boolean; color?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const showB = p.showB !== false, geo = p.nest ? "nest" : "over", g = GEO[geo], SL = slots(geo, showB);
  const col = p.color ?? C.teal;
  const region = (v: number): Reg => (p.A.includes(v) ? (showB && p.B.includes(v) ? "ab" : "a") : showB && p.B.includes(v) ? "b" : "n");
  const cnt: Record<Reg, number> = { a: 0, ab: 0, b: 0, n: 0 };
  const els = p.S.map((v) => {
    const r = region(v), s = SL[r], k = cnt[r]++;
    return { v, r, pos: (s[k] ?? [g.anc[r][0] + k * 4, g.anc[r][1] + k * 4]) as Vec };
  });
  const on = (r: Reg) => p.hl.includes(r);
  const fade = (r: Reg) => ({ opacity: on(r) ? 0.26 : 0, transition: "opacity 0.35s" });
  const MK = { maskUnits: "userSpaceOnUse" as const, x: 0, y: 0, width: 520, height: 340 };
  return (
    <svg viewBox="0 0 520 340" className="hf-venn" role="img" aria-label="Diagram Venn">
      <defs>
        <clipPath id={`${uid}c`}><circle cx={g.A[0]} cy={g.A[1]} r={g.A[2]} /></clipPath>
        <mask id={`${uid}mA`} {...MK}><rect width="520" height="340" fill="#fff" /><circle cx={g.A[0]} cy={g.A[1]} r={g.A[2]} fill="#000" /></mask>
        <mask id={`${uid}mB`} {...MK}><rect width="520" height="340" fill="#fff" /><circle cx={g.B[0]} cy={g.B[1]} r={g.B[2]} fill="#000" /></mask>
        <mask id={`${uid}mAB`} {...MK}>
          <rect width="520" height="340" fill="#fff" /><circle cx={g.A[0]} cy={g.A[1]} r={g.A[2]} fill="#000" />
          {showB && <circle cx={g.B[0]} cy={g.B[1]} r={g.B[2]} fill="#000" />}
        </mask>
      </defs>
      <rect x="10" y="10" width="500" height="320" rx="14" fill="#fff" stroke={C.line} strokeWidth="2" />
      <g fill={col}>
        <rect x="10" y="10" width="500" height="320" rx="14" mask={`url(#${uid}mAB)`} style={fade("n")} />
        <circle cx={g.A[0]} cy={g.A[1]} r={g.A[2]} mask={showB ? `url(#${uid}mB)` : undefined} style={fade("a")} />
        {showB && <circle cx={g.B[0]} cy={g.B[1]} r={g.B[2]} clipPath={`url(#${uid}c)`} style={fade("ab")} />}
        {showB && <circle cx={g.B[0]} cy={g.B[1]} r={g.B[2]} mask={`url(#${uid}mA)`} style={fade("b")} />}
      </g>
      <circle cx={g.A[0]} cy={g.A[1]} r={g.A[2]} fill="none" stroke={C.blue} strokeWidth="3.5" />
      {showB && <circle cx={g.B[0]} cy={g.B[1]} r={g.B[2]} fill="none" stroke={C.orange} strokeWidth="3.5" />}
      <text x="26" y="36" fontSize="17" fontWeight="700" fill={C.mute} fontFamily="var(--mono)">S</text>
      <text x={g.la[0]} y={g.la[1]} fontSize="20" fontWeight="700" fill={C.blue} fontFamily="var(--mono)">A</text>
      {showB && <text x={g.lb[0]} y={g.lb[1]} fontSize="20" fontWeight="700" fill={C.orange} fontFamily="var(--mono)">B</text>}
      {els.map(({ v, r, pos }) => {
        const hit = on(r);
        return (
          <g key={v} transform={`translate(${pos[0]} ${pos[1]})`}>
            <circle r="13" style={{ fill: hit ? col : "#fff", stroke: hit ? col : C.line, strokeWidth: 1.75, transition: "fill 0.35s, stroke 0.35s" }} />
            <text textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="600" fontFamily="var(--mono)" style={{ fill: hit ? "#fff" : "#475569", transition: "fill 0.35s" }}>{v}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* operasi himpunan pada daftar bilangan */
const sortN = (a: number[]) => [...a].sort((x, y) => x - y);
const setU = (A: number[], B: number[]) => sortN([...new Set([...A, ...B])]);
const setI = (A: number[], B: number[]) => A.filter((v) => B.includes(v));
const setD = (A: number[], B: number[]) => A.filter((v) => !B.includes(v));
const isSub = (A: number[], B: number[]) => B.length > 0 && B.length < A.length && B.every((v) => A.includes(v));
const S12 = Array.from({ length: 12 }, (_, i) => i + 1);
type Pre = { l: string; A: number[]; B: number[] };
const PRE2: Pre[] = [
  { l: "Genap & kelipatan 3", A: [2, 4, 6, 8, 10, 12], B: [3, 6, 9, 12] },
  { l: "Prima & ganjil", A: [2, 3, 5, 7, 11], B: [1, 3, 5, 7, 9, 11] },
  { l: "Saling lepas", A: [1, 2, 3, 4, 5], B: [8, 9, 10, 11] },
  { l: "B bagian dari A", A: [2, 4, 6, 8, 10, 12], B: [4, 8, 12] },
];
const PRE1: Pre[] = [
  { l: "Genap", A: [2, 4, 6, 8, 10, 12], B: [] },
  { l: "Prima", A: [2, 3, 5, 7, 11], B: [] },
  { l: "Kelipatan 3", A: [3, 6, 9, 12], B: [] },
  { l: "Faktor 12", A: [1, 2, 3, 4, 6, 12], B: [] },
];

/* ═════════════════ Penilai "ya / bukan" (dipakai dua slide) ═════════════════ */
type JItem = { vis: ReactNode; yes: boolean; why: ReactNode };
function Judge(p: { eyebrow: string; title: string; copy: ReactNode; items: JItem[]; yes: string; no: string }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<"y" | "n" | null>(null);
  const [score, setScore] = useState(0);
  const N = p.items.length, done = i >= N, it = p.items[Math.min(i, N - 1)];
  const right = pick !== null && (pick === "y") === it.yes;
  const choose = (v: "y" | "n") => {
    if (pick !== null) return;
    setPick(v);
    if ((v === "y") === it.yes) setScore((s) => s + 1);
  };
  return (
    <Frame
      eyebrow={p.eyebrow} title={p.title} copy={p.copy}
      stage={done ? (<>
        <Read rows={[<b>Skor Anda: {score} dari {N}</b>, <Muted>{score === N ? "Sempurna!" : "Coba ulangi, perhatikan alasannya."}</Muted>]} />
        <Btn onClick={() => { setI(0); setPick(null); setScore(0); }}>Ulangi</Btn>
      </>) : (<>
        <Hint>Soal {i + 1} dari {N}</Hint>
        <div className="hf-judge">{it.vis}</div>
        <Chips items={[{ v: "y", label: p.yes }, { v: "n", label: p.no }]} value={(pick ?? "") as "y" | "n"} onPick={choose} />
        {pick !== null && (<>
          <Read rows={[<b style={{ color: right ? C.green : C.red }}>{right ? "✓ Benar." : `✗ Belum tepat. Jawabannya: ${it.yes ? p.yes : p.no}.`}</b>, it.why]} />
          <Btn onClick={() => { setPick(null); setI(i + 1); }}>{i + 1 < N ? "Berikutnya" : "Lihat skor"}</Btn>
        </>)}
      </>)}
    />
  );
}

/* ═════════════════ 1. Pembuka ═════════════════ */
function Cover() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const cards = [
    { t: "Himpunan", d: "Mengumpulkan benda dan mengoperasikannya.", icon: (
      <svg viewBox="0 0 96 64"><circle cx="38" cy="32" r="22" fill={C.blue + "26"} stroke={C.blue} strokeWidth="3" /><circle cx="58" cy="32" r="22" fill={C.orange + "26"} stroke={C.orange} strokeWidth="3" /></svg>
    ) },
    { t: "Relasi", d: "Menghubungkan anggota dua himpunan.", icon: (
      <svg viewBox="0 0 96 64" fill="none" strokeWidth="3" strokeLinecap="round">
        <g stroke={C.mute}><path d="M24 14L72 14M24 14L72 50M24 50L72 32M24 32L72 14" /></g>
        {[14, 32, 50].map((y) => <circle key={y} cx="20" cy={y} r="6" fill={C.blue} stroke="#fff" />)}
        {[14, 32, 50].map((y) => <circle key={y} cx="76" cy={y} r="6" fill={C.orange} stroke="#fff" />)}
      </svg>
    ) },
    { t: "Fungsi", d: "Relasi khusus: satu masukan, satu keluaran.", icon: (
      <svg viewBox="0 0 96 64" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 32h20M72 32h20" stroke={C.mute} /><path d="M20 26l6 6-6 6M88 26l-6 6 6 6" stroke={C.mute} />
        <rect x="26" y="10" width="44" height="44" rx="10" fill={C.ink} stroke={C.ink} />
        <text x="48" y="41" textAnchor="middle" fontSize="26" fontStyle="italic" fill="#fff" stroke="none" fontFamily="var(--serif)">f</text>
      </svg>
    ) },
  ];
  return (
    <Frame
      innerRef={ref} eyebrow="Matematika · Kelas 8" title="Pengantar Himpunan, Relasi, dan Fungsi"
      copy={<>
        <p>Tiga gagasan yang menjadi fondasi hampir semua bab matematika berikutnya.</p>
        <p className="fragment">Pertama, kita <b>mengelompokkan</b> benda menjadi himpunan.</p>
        <p className="fragment">Kedua, kita <b>menghubungkan</b> dua himpunan dengan relasi.</p>
        <p className="fragment">Ketiga, kita temukan relasi yang paling teratur: <b>fungsi</b>.</p>
        <p className="ds-muted">Tekan → untuk melangkah. Hampir semua gambar bisa diklik atau digeser.</p>
      </>}
      stage={<>
        {cards.map((c, i) => (
          <div key={c.t} className={`hf-icard${step >= i + 1 ? " is-on" : ""}`}>
            {c.icon}
            <div><h3>{c.t}</h3><p>{c.d}</p></div>
          </div>
        ))}
      </>}
    />
  );
}

/* ═════════════════ 2. Pengertian himpunan ═════════════════ */
const Q = (icon: string, text: string): ReactNode => <div className="hf-quote"><span>{icon}</span>{text}</div>;
function SetJudge() {
  return (
    <Judge
      eyebrow="Himpunan" title="Pengertian himpunan" yes="Himpunan" no="Bukan himpunan"
      copy={<>
        <p><b>Himpunan</b> adalah kumpulan objek yang batasannya <b>jelas</b>: untuk setiap benda kita bisa memastikan benda itu termasuk atau tidak.</p>
        <p className="fragment">Objek di dalam himpunan disebut <b>anggota</b> (elemen).</p>
        <p className="fragment">Himpunan diberi nama huruf kapital (A, B, C, …) dan anggotanya ditulis di dalam kurung kurawal {"{ }"}.</p>
      </>}
      items={[
        { vis: Q("🗺️", "Kumpulan provinsi di Pulau Jawa"), yes: true, why: <>Jelas: Banten, DKI Jakarta, Jawa Barat, Jawa Tengah, DI Yogyakarta, Jawa Timur.</> },
        { vis: Q("🏖️", "Kumpulan pantai yang indah"), yes: false, why: <>“Indah” menurut siapa? Setiap orang bisa berbeda, batasnya tidak jelas.</> },
        { vis: Q("🎵", "Kumpulan lagu yang enak didengar"), yes: false, why: <>“Enak didengar” soal selera, bukan sifat yang bisa dipastikan.</> },
        { vis: Q("🔢", "Kumpulan bilangan genap kurang dari 10"), yes: true, why: <>Jelas: 2, 4, 6, 8. Siapa pun akan sepakat.</> },
        { vis: Q("🎓", "Kumpulan siswa yang pandai"), yes: false, why: <>Nilai berapa disebut pandai? Tidak ada batas yang disepakati.</> },
        { vis: Q("🗓️", "Kumpulan nama hari dalam seminggu"), yes: true, why: <>Senin sampai Minggu: tujuh anggota, tidak ada keraguan.</> },
      ]}
    />
  );
}

/* ═════════════════ 3. Anggota dan notasi ═════════════════ */
type SetDef = { l: string; desc: string; items: El[]; build: string };
const SETS: SetDef[] = [
  { l: "Genap < 10", desc: "bilangan asli genap kurang dari 10", items: [2, 4, 6, 8], build: raw`\{x\mid x\text{ bilangan asli genap},\ x<10\}` },
  { l: "Prima < 12", desc: "bilangan prima kurang dari 12", items: [2, 3, 5, 7, 11], build: raw`\{x\mid x\text{ bilangan prima},\ x<12\}` },
  { l: "Faktor 12", desc: "faktor dari 12", items: [1, 2, 3, 4, 6, 12], build: raw`\{x\mid x\text{ faktor dari }12\}` },
  { l: "Kelipatan 3", desc: "kelipatan 3 yang tidak lebih dari 12", items: [3, 6, 9, 12], build: raw`\{x\mid x\text{ kelipatan }3,\ x\le12\}` },
  { l: "Huruf vokal", desc: "huruf vokal", items: ["a", "i", "u", "e", "o"], build: raw`\{x\mid x\text{ huruf vokal}\}` },
];

function Members() {
  const [k, setK] = useState(1), [pick, setPick] = useState<number | null>(7);
  const S = SETS[k], inA = (v: number) => S.items.includes(v);
  return (
    <Frame
      eyebrow="Himpunan" title="Anggota dan notasi"
      copy={<>
        <p>Ketuk sebuah bilangan di sebelah: apakah ia <b>anggota</b> himpunan A?</p>
        <p className="fragment">{tex(raw`7\in A`)} dibaca “7 anggota A”.</p>
        <p className="fragment">{tex(raw`4\notin A`)} dibaca “4 bukan anggota A”.</p>
        <p className="fragment">{tex("n(A)")} adalah <b>banyak anggota</b> A (kardinalitas).</p>
      </>}
      stage={<>
        <Chips value={k} onPick={(v) => { setK(v); }} items={SETS.slice(0, 4).map((s, i) => ({ v: i, label: s.l }))} />
        <div className="hf-tiles">
          {S12.map((v) => (
            <button key={v} type="button" className={`hf-tile${inA(v) ? " is-in" : ""}${pick === v ? " is-pick" : ""}`} onClick={() => setPick(v)}>{v}</button>
          ))}
        </div>
        <Read rows={[
          <>A = {S.desc}</>,
          tex(raw`A=${setTex(S.items)}\qquad n(A)=${S.items.length}`),
          pick === null ? <Muted>Ketuk salah satu bilangan.</Muted>
            : <>{tex(`${pick}${inA(pick) ? raw`\in ` : raw`\notin `}A`)} <Muted>{inA(pick) ? `${pick} adalah anggota A` : `${pick} bukan anggota A`}</Muted></>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ 4. Cara penyajian ═════════════════ */
function MiniVenn({ items }: { items: El[] }) {
  const m = items.length, per = 3, rows = Math.ceil(m / per);
  return (
    <svg viewBox="0 0 240 140" className="hf-minivenn" role="img" aria-label="Diagram Venn">
      <ellipse cx="120" cy="70" rx="108" ry="62" fill={C.blue + "1a"} stroke={C.blue} strokeWidth="2.5" />
      <text x="30" y="30" fontSize="16" fontWeight="700" fill={C.blue} fontFamily="var(--mono)">A</text>
      {items.map((v, idx) => {
        const r = Math.floor(idx / per), inRow = Math.min(per, m - r * per), c = idx % per;
        const x = 120 + (c - (inRow - 1) / 2) * 46, y = 70 + (r - (rows - 1) / 2) * 38;
        return (
          <g key={idx}>
            <circle cx={x} cy={y} r="15" fill="#fff" stroke={C.blue} strokeWidth="1.75" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="600" fontFamily="var(--mono)" fill={C.ink}>{v}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Present() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState(0);
  const S = SETS[k], on = (i: number) => (step >= i ? " is-on" : "");
  return (
    <Frame
      innerRef={ref} eyebrow="Himpunan" title="Cara menyajikan himpunan"
      copy={<>
        <p>Satu himpunan yang sama bisa ditulis dengan beberapa cara. Pilih himpunan di kanan, lalu lihat tiap penyajiannya.</p>
        <p className="fragment"><b>Mendaftar anggota</b>: tulis semua anggota di dalam {"{ }"}, dipisah koma.</p>
        <p className="fragment"><b>Notasi pembentuk himpunan</b>: {tex(raw`\{x\mid\text{syarat}\}`)}, dibaca “himpunan x sedemikian sehingga …”.</p>
        <p className="fragment"><b>Diagram Venn</b>: anggota ditulis di dalam kurva tertutup.</p>
      </>}
      stage={<>
        <Chips value={k} onPick={setK} items={SETS.map((s, i) => ({ v: i, label: s.l }))} />
        <div className="hf-cards">
          <div className="hf-card is-on"><h4>Menyebutkan sifat</h4><p><b>A</b> = {S.desc}</p></div>
          <div className={`hf-card${on(1)}`}><h4>Mendaftar anggota</h4>{tex(raw`A=${setTex(S.items)}`)}</div>
          <div className={`hf-card${on(2)}`}><h4>Notasi pembentuk himpunan</h4>{tex(raw`A=${S.build}`)}</div>
          <div className={`hf-card${on(3)}`}><h4>Diagram Venn</h4><MiniVenn items={S.items} /></div>
        </div>
      </>}
    />
  );
}

/* ═════════════════ 5. Semesta, himpunan bagian, himpunan kosong ═════════════════ */
function Subsets() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const A = [2, 4, 6, 8, 10, 12], B = [4, 8, 12];
  const hl: Reg[] = step === 1 ? ["a", "ab", "n"] : step === 2 ? ["a", "ab"] : step === 3 ? ["ab"] : [];
  const subs = [[], [4], [8], [12], [4, 8], [4, 12], [8, 12], [4, 8, 12]];
  return (
    <Frame
      innerRef={ref} eyebrow="Himpunan" title="Semesta dan himpunan bagian"
      copy={<>
        <p>Dalam diagram Venn, semua anggota hidup di dalam sebuah “ruangan”.</p>
        <p className="fragment"><b>Semesta pembicaraan</b> S: himpunan semua objek yang sedang dibicarakan (persegi panjang).</p>
        <p className="fragment"><b>Himpunan bagian</b>: A ⊂ S, sebab semua anggota A ada di S.</p>
        <p className="fragment">B ⊂ A, sebab setiap anggota B juga anggota A.</p>
        <p className="fragment"><b>Himpunan kosong</b> {tex(raw`\varnothing`)} tidak punya anggota dan menjadi bagian dari setiap himpunan. Himpunan dengan n anggota punya {tex(raw`2^n`)} himpunan bagian.</p>
      </>}
      stage={<>
        <Venn S={S12} A={A} B={B} hl={hl} nest />
        <Read rows={[
          tex(raw`S=\{1,2,\dots,12\},\ A=${setTex(A)},\ B=${setTex(B)}`),
          step >= 4 ? tex(raw`n(B)=3\Rightarrow 2^3=8:\ ${subs.map((s) => setTex(s)).join(raw`,\ `)}`) : <Muted>Tekan → untuk menyorot tiap himpunan.</Muted>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ 6–9. Operasi himpunan ═════════════════ */
type Op = "u" | "i" | "d" | "c";
function VennSlide({ op }: { op: Op }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState(0), [sub, setSub] = useState<"ab" | "ba">("ab");
  const P = (op === "c" ? PRE1 : PRE2)[k], A = P.A, B = P.B, hasB = op !== "c";
  const U = setU(A, B), I = setI(A, B);
  const T = {
    u: { sym: raw`A\cup B`, res: U, hl: ["a", "ab", "b"] as Reg[], title: "Gabungan" },
    i: { sym: raw`A\cap B`, res: I, hl: ["ab"] as Reg[], title: "Irisan" },
    d: sub === "ab" ? { sym: "A-B", res: setD(A, B), hl: ["a"] as Reg[], title: "Selisih" } : { sym: "B-A", res: setD(B, A), hl: ["b"] as Reg[], title: "Selisih" },
    c: { sym: "A^c", res: setD(S12, A), hl: ["n"] as Reg[], title: "Komplemen" },
  }[op];
  const copy = {
    u: <>
      <p><b>Gabungan</b> A dan B adalah semua anggota yang ada di A <b>atau</b> di B (atau keduanya).</p>
      <p className="fragment">{tex(raw`A\cup B=\{x\mid x\in A\ \text{atau}\ x\in B\}`)}</p>
      <p className="fragment">Anggota yang sama ditulis <b>sekali</b> saja, jadi {tex(raw`n(A\cup B)=n(A)+n(B)-n(A\cap B)`)}.</p>
    </>,
    i: <>
      <p><b>Irisan</b> A dan B adalah anggota yang ada di A <b>dan</b> di B sekaligus.</p>
      <p className="fragment">{tex(raw`A\cap B=\{x\mid x\in A\ \text{dan}\ x\in B\}`)}</p>
      <p className="fragment">Bila tidak ada anggota bersama, {tex(raw`A\cap B=\varnothing`)} dan A, B disebut <b>saling lepas</b>. Coba pilihan “Saling lepas”.</p>
    </>,
    d: <>
      <p><b>Selisih</b> A dan B adalah anggota A yang <b>tidak</b> ada di B.</p>
      <p className="fragment">{tex(raw`A-B=\{x\mid x\in A\ \text{dan}\ x\notin B\}`)}</p>
      <p className="fragment">Urutan penting: {tex(raw`A-B\neq B-A`)} (kecuali A = B). Tukar dengan tombol di kanan.</p>
    </>,
    c: <>
      <p><b>Komplemen</b> A adalah anggota semesta S yang <b>bukan</b> anggota A.</p>
      <p className="fragment">{tex(raw`A^c=\{x\mid x\in S\ \text{dan}\ x\notin A\}`)}, sama dengan {tex(raw`S-A`)}.</p>
      <p className="fragment">A dan {tex("A^c")} saling melengkapi: {tex(raw`n(A)+n(A^c)=n(S)`)}.</p>
    </>,
  }[op];
  return (
    <Frame
      innerRef={ref} eyebrow="Operasi himpunan" title={`${T.title} (${op === "u" ? "∪" : op === "i" ? "∩" : op === "d" ? "−" : "komplemen"})`} copy={copy}
      stage={<>
        <Venn S={S12} A={A} B={B} hl={step >= 1 ? T.hl : []} showB={hasB} nest={hasB && isSub(A, B)} />
        <Chips value={k} onPick={(v) => { setK(v); }} items={(op === "c" ? PRE1 : PRE2).map((p, i) => ({ v: i, label: p.l }))} />
        {op === "d" && <Chips value={sub} onPick={setSub} items={[{ v: "ab", label: "A − B" }, { v: "ba", label: "B − A" }]} />}
        <Read rows={[
          tex(raw`A=${setTex(A)}${hasB ? raw`,\quad B=${setTex(B)}` : ""}`),
          step >= 2 ? tex(raw`${T.sym}=${setTex(T.res)}\qquad n(${T.sym})=${T.res.length}`) : <Muted>Tekan → untuk melihat hasilnya.</Muted>,
          step >= 2 && op === "u" ? tex(raw`n(A\cup B)=${A.length}+${B.length}-${I.length}=${U.length}`) : null,
          step >= 2 && op === "i" && I.length === 0 ? <Muted>Irisan kosong: A dan B saling lepas.</Muted> : null,
        ].filter(Boolean) as ReactNode[]} />
      </>}
    />
  );
}

/* ═════════════════ 10. Empat operasi sekaligus ═════════════════ */
function FourOps() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [k, setK] = useState(0);
  const { A, B } = PRE2[k], sub = isSub(A, B);
  const cells: { t: string; hl: Reg[]; res: number[]; showB: boolean }[] = [
    { t: raw`A\cup B`, hl: ["a", "ab", "b"], res: setU(A, B), showB: true },
    { t: raw`A\cap B`, hl: ["ab"], res: setI(A, B), showB: true },
    { t: raw`A-B`, hl: ["a"], res: setD(A, B), showB: true },
    { t: raw`A^c`, hl: ["n"], res: setD(S12, A), showB: false },
  ];
  return (
    <Frame
      innerRef={ref} eyebrow="Operasi himpunan" title="Empat operasi sekaligus"
      copy={<>
        <p>Pasangan himpunan yang sama, empat daerah berbeda. Ganti pasangan di kanan dan perhatikan perubahannya.</p>
        <p className="fragment">{tex(raw`A\cup B`)}: seluruh daerah A dan B.</p>
        <p className="fragment">{tex(raw`A\cap B`)}: hanya bagian yang <b>beririsan</b>.</p>
        <p className="fragment">{tex(raw`A-B`)}: A saja, tanpa bagian irisan.</p>
        <p className="fragment">{tex(raw`A^c`)}: semua yang berada <b>di luar</b> A.</p>
      </>}
      stage={<>
        <div className="hf-ops">
          {cells.map((c, i) => (
            <div key={c.t} className="hf-op" style={{ opacity: step === 0 || step === i + 1 ? 1 : 0.3 }}>
              <div className="hf-op__t">{tex(c.t)}</div>
              <Venn S={S12} A={A} B={B} hl={c.hl} showB={c.showB} nest={c.showB && sub} />
              <div>{tex(raw`=${setTex(c.res)}`)}</div>
            </div>
          ))}
        </div>
        <Chips value={k} onPick={setK} items={PRE2.map((p, i) => ({ v: i, label: p.l }))} />
      </>}
    />
  );
}

/* ═════════════════ 11. Pengertian relasi ═════════════════ */
function RelIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [sel, setSel] = useState<number | null>(null);
  const A = ["Ani", "Budi", "Citra", "Dika"], B = ["Bola", "Renang", "Catur", "Lukis"];
  const pairs: Pair[] = [[0, 1], [1, 0], [1, 2], [2, 3], [3, 0]];
  const shown = [0, 0, 2, 4, 5][Math.min(step, 4)];
  const partners = sel === null ? [] : pairs.filter(([i]) => i === sel).map(([, j]) => B[j]);
  return (
    <Frame
      innerRef={ref} eyebrow="Relasi" title="Pengertian relasi"
      copy={<>
        <p><b>Relasi</b> dari himpunan A ke himpunan B adalah aturan yang <b>memasangkan</b> anggota A dengan anggota B.</p>
        <p className="fragment">Contoh: A = siswa, B = kegiatan, relasinya “<b>gemar</b>”.</p>
        <p className="fragment">Ani gemar renang. Budi gemar bola dan catur.</p>
        <p className="fragment">Citra gemar lukis. Dika gemar bola.</p>
        <p className="fragment">Satu siswa boleh punya beberapa kegiatan, dan satu kegiatan boleh digemari beberapa siswa.</p>
      </>}
      stage={<>
        <Arrows A={A} B={B} pairs={pairs} shown={shown} hotA={sel} onA={(i) => setSel(sel === i ? null : i)} maxH={320} />
        <Read rows={[
          sel === null ? <Muted>Ketuk nama siswa untuk menyorot panahnya.</Muted>
            : <><b>{A[sel]}</b> gemar {partners.length ? partners.join(", ").toLowerCase() : <Muted>(belum ada panah)</Muted>}</>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ Relasi bilangan (dipakai slide 12–14) ═════════════════ */
type Rel = { l: string; A: number[]; B: number[]; pairs: Pair[]; bbox: BBox };
const mkRel = (l: string, A: number[], B: number[], f: (a: number, b: number) => boolean, bbox: BBox): Rel => ({
  l, A, B, bbox, pairs: A.flatMap((a, i) => B.flatMap((b, j) => (f(a, b) ? [[i, j] as Pair] : []))),
});
const RELS: Rel[] = [
  mkRel("faktor dari", [1, 2, 3, 4], [2, 3, 4, 6], (a, b) => b % a === 0, [-0.8, 7.5, 5.5, -0.9]),
  mkRel("kurang dari", [1, 2, 3], [2, 3, 4], (a, b) => a < b, [-0.8, 5.5, 4.5, -0.9]),
  mkRel("dikali 2 menjadi", [1, 2, 3, 4], [2, 4, 6, 8], (a, b) => b === 2 * a, [-0.8, 9.5, 5.5, -0.9]),
];
const relChips = RELS.map((r, i) => ({ v: i, label: r.l }));

/* ═════════════════ 12. Diagram panah ═════════════════ */
function ArrowDiagram() {
  const [r, setR] = useState(0), [sel, setSel] = useState<number | null>(null);
  const R = RELS[r];
  const partners = sel === null ? [] : R.pairs.filter(([i]) => i === sel).map(([, j]) => R.B[j]);
  return (
    <Frame
      eyebrow="Relasi" title="Diagram panah"
      copy={<>
        <p>Cara paling mudah melihat relasi: gambar dua himpunan, lalu hubungkan dengan <b>panah</b>.</p>
        <p className="fragment">Panah selalu mengarah <b>dari A ke B</b>.</p>
        <p className="fragment">Panah dibaca sesuai aturan relasinya. Misalnya panah 2 → 6 pada relasi “faktor dari” berarti “2 faktor dari 6”.</p>
        <p className="fragment">Anggota A boleh punya banyak panah, satu panah, atau tidak sama sekali.</p>
      </>}
      stage={<>
        <Chips value={r} onPick={(v) => { setR(v); setSel(null); }} items={relChips} />
        <Arrows A={R.A} B={R.B} pairs={R.pairs} hotA={sel} onA={(i) => setSel(sel === i ? null : i)} maxH={320} />
        <Read rows={[
          <>Relasi “{R.l}” dari A ke B</>,
          sel === null ? <Muted>Ketuk anggota A untuk menyorot panahnya.</Muted>
            : <><b>{R.A[sel]}</b> {R.l} {partners.length ? partners.join(", ") : <Muted>tidak ada anggota B</Muted>}</>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ 13. Himpunan pasangan berurutan ═════════════════ */
function OrderedPairs() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [r, setR] = useState(0), [hot, setHot] = useState<number | null>(null);
  const R = RELS[r], pr = R.pairs.map(([i, j]) => `(${R.A[i]}, ${R.B[j]})`);
  return (
    <Frame
      innerRef={ref} eyebrow="Relasi" title="Himpunan pasangan berurutan"
      copy={<>
        <p>Setiap panah dapat ditulis sebagai <b>pasangan berurutan</b> (a, b) dengan a ∈ A dan b ∈ B.</p>
        <p className="fragment"><b>Urutan penting</b>: {tex(raw`(2,4)\neq(4,2)`)}. Anggota A selalu ditulis di depan.</p>
        <p className="fragment">Kumpulkan semua pasangan yang berelasi menjadi satu himpunan: {tex(raw`R=\{(a,b)\mid a\ \text{berelasi dengan}\ b\}`)}.</p>
        <p className="fragment">Semua pasangan yang mungkin disebut {tex(raw`A\times B`)}. Relasi adalah <b>himpunan bagian</b> dari {tex(raw`A\times B`)}.</p>
      </>}
      stage={<>
        <Chips value={r} onPick={(v) => { setR(v); setHot(null); }} items={relChips} />
        <div className="hf-duo">
          <Arrows A={R.A} B={R.B} pairs={R.pairs} hot={hot} maxH={250} />
          <div className="hf-pairs">
            {pr.map((t, k) => (
              <button key={k} type="button" className={`hf-pair${hot === k ? " is-hot" : ""}`} onClick={() => setHot(hot === k ? null : k)}>{t}</button>
            ))}
          </div>
        </div>
        <Read rows={[
          <>Relasi “{R.l}”: {R.pairs.length} pasangan berurutan</>,
          step >= 3 ? tex(raw`n(A\times B)=${R.A.length}\times${R.B.length}=${R.A.length * R.B.length}\ \ge\ ${R.pairs.length}=n(R)`) : <Muted>Ketuk pasangan untuk menyorot panahnya.</Muted>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ 14. Diagram Kartesius ═════════════════ */
type CP = { r: number; s: number; hot: number };
const buildCart: Build<CP> = (b, g) => {
  const R = () => RELS[g().r];
  for (let k = 0; k < 40; k++) {
    const pos = (): Vec => {
      const r = R(), i = Math.floor(k / 8), j = k % 8;
      return g().s >= 1 && i < r.A.length && j < r.B.length ? [r.A[i], r.B[j]] : OFF;
    };
    mk(b, "point", [() => pos()[0], () => pos()[1]], { ...still, name: "", withLabel: false, size: 4, fillColor: "#fff", strokeColor: C.soft, strokeWidth: 1.5 });
  }
  for (let k = 0; k < 12; k++) {
    dot(b, () => {
      const r = R(), pr = r.pairs[k];
      return g().s >= 2 && pr ? [r.A[pr[0]], r.B[pr[1]]] : OFF;
    }, C.teal, 6);
  }
  const H = (): Vec | null => {
    const pr = R().pairs[g().hot];
    return g().s >= 2 && pr ? [R().A[pr[0]], R().B[pr[1]]] : null;
  };
  seg(b, () => H() ?? OFF, () => { const h = H(); return h ? [h[0], 0] : OFF; }, C.orange, 2, 3);
  seg(b, () => H() ?? OFF, () => { const h = H(); return h ? [0, h[1]] : OFF; }, C.orange, 2, 3);
  note(b, () => { const h = H(); return h ? [h[0] + 0.15, h[1] + 0.25] : OFF; }, () => { const h = H(); return h ? `(${h[0]}, ${h[1]})` : ""; }, C.orange);
  note(b, () => [R().bbox[2] - 0.8, 0.25], () => "A", C.blue);
  note(b, () => [0.2, R().bbox[1] - 0.8], () => "B", C.orange);
};

function Cartesian() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [r, setR] = useState(0), [hot, setHot] = useState(-1);
  const R = RELS[r];
  return (
    <Frame
      innerRef={ref} eyebrow="Relasi" title="Diagram Kartesius"
      copy={<>
        <p>Diagram Kartesius menggambar tiap pasangan (a, b) sebagai sebuah <b>titik</b>.</p>
        <p className="fragment">Sumbu mendatar untuk anggota <b>A</b>, sumbu tegak untuk anggota <b>B</b>. Titik kosong = semua pasangan di {tex(raw`A\times B`)}.</p>
        <p className="fragment">Titik <b>berwarna</b> = pasangan yang benar-benar berelasi. Ketuk pasangan di bawah papan untuk melihat garis bantunya.</p>
      </>}
      stage={<>
        <Chips value={r} onPick={(v) => { setR(v); setHot(-1); }} items={relChips} />
        <SimBoard bbox={R.bbox} aspect={1.25} params={{ r, s: step, hot }} build={buildCart} maxH={300} />
        <div className="hf-pairs">
          {R.pairs.map(([i, j], k) => (
            <button key={k} type="button" className={`hf-pair${hot === k ? " is-hot" : ""}`} onClick={() => setHot(hot === k ? -1 : k)}>{`(${R.A[i]}, ${R.B[j]})`}</button>
          ))}
        </div>
      </>}
    />
  );
}

/* ═════════════════ 15. Pengertian fungsi (mesin) ═════════════════ */
const RULES = [
  { l: "2x + 1", f: (x: number) => 2 * x + 1, sub: (x: number) => raw`2\cdot${P(x)}+1`, t: "2x+1" },
  { l: "x²", f: (x: number) => x * x, sub: (x: number) => raw`${P(x)}^2`, t: "x^2" },
  { l: "x − 3", f: (x: number) => x - 3, sub: (x: number) => raw`${P(x)}-3`, t: "x-3" },
];
function Machine() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [r, setR] = useState(0), [x, setX] = useState(3);
  const R = RULES[r], y = R.f(x), g = (i: number) => ({ opacity: step >= i ? 1 : 0.25 });
  return (
    <Frame
      innerRef={ref} eyebrow="Fungsi" title="Pengertian fungsi"
      copy={<>
        <p>Bayangkan sebuah <b>mesin</b>: masukkan satu bilangan, keluar tepat satu bilangan.</p>
        <p className="fragment"><b>Masukan</b> x diambil dari himpunan A.</p>
        <p className="fragment">Mesin bekerja dengan satu <b>aturan</b> f yang tetap.</p>
        <p className="fragment"><b>Keluaran</b> f(x) berada di B dan hanya <b>satu</b> untuk tiap x. Ditulis {tex(raw`f:A\to B`)} atau {tex(raw`f:x\mapsto f(x)`)}.</p>
      </>}
      stage={<>
        <svg viewBox="0 0 520 190" className="hf-machine" role="img" aria-label="Mesin fungsi">
          <defs><marker id={`${uid}m`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={C.mute} /></marker></defs>
          <g style={g(1)}>
            <rect x="8" y="70" width="92" height="50" rx="25" fill="#eaf2fb" stroke={C.blue} strokeWidth="2.5" />
            <text x="54" y="95" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="600" fill={C.ink} fontFamily="var(--mono)">x = {show(x)}</text>
            <line x1="104" y1="95" x2="156" y2="95" stroke={C.mute} strokeWidth="3" markerEnd={`url(#${uid}m)`} />
          </g>
          <g style={g(2)}>
            <rect x="160" y="30" width="200" height="130" rx="18" fill={C.ink} />
            <circle cx="186" cy="52" r="7" fill="#334155" /><circle cx="334" cy="52" r="7" fill="#334155" />
            <text x="260" y="88" textAnchor="middle" fontSize="40" fontStyle="italic" fill="#fff" fontFamily="var(--serif)">f</text>
            <text x="260" y="130" textAnchor="middle" fontSize="20" fill="#cbd5e1" fontFamily="var(--mono)">x ↦ {R.l}</text>
          </g>
          <g style={g(3)}>
            <line x1="364" y1="95" x2="414" y2="95" stroke={C.mute} strokeWidth="3" markerEnd={`url(#${uid}m)`} />
            <rect x="418" y="70" width="96" height="50" rx="25" fill="#fdeee5" stroke={C.orange} strokeWidth="2.5" />
            <text x="466" y="95" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="600" fill={C.ink} fontFamily="var(--mono)">{show(y)}</text>
          </g>
        </svg>
        <Chips value={r} onPick={setR} items={RULES.map((u, i) => ({ v: i, label: `f(x) = ${u.l}` }))} />
        <Ctl one><Range label="Masukan x" value={x} min={-4} max={6} step={1} onChange={setX} color={C.blue} /></Ctl>
        <div className="hf-strip">{[-2, -1, 0, 1, 2].map((v) => <span key={v}>{show(v)} → {show(R.f(v))}</span>)}</div>
        <Read rows={[tex(raw`f(x)=${R.t}`), step >= 3 ? tex(raw`f(${nt(x)})=${R.sub(x)}=${nt(y)}`) : <Muted>Tekan → untuk menyalakan mesin.</Muted>]} />
      </>}
    />
  );
}

/* ═════════════════ Pembangun pemetaan (slide 16 dan 20) ═════════════════ */
const LA = ["a", "b", "c", "d"], NB = [1, 2, 3, 4];
function Builder({ mode }: { mode: "func" | "type" }) {
  const [sz, setSz] = useState<[number, number]>(mode === "func" ? [3, 4] : [3, 3]);
  const [pairs, setPairs] = useState<Pair[]>(mode === "func" ? [[0, 0], [1, 2], [2, 2]] : [[0, 0], [1, 1], [2, 2]]);
  const [sel, setSel] = useState<number | null>(null);
  const [nA, nB] = sz, A = LA.slice(0, nA), B = NB.slice(0, nB);
  const has = (i: number, j: number) => pairs.some(([a, c]) => a === i && c === j);
  const toggle = (i: number, j: number) => setPairs((ps) => (has(i, j) ? ps.filter(([a, c]) => !(a === i && c === j)) : [...ps, [i, j]]));
  const resize = (a: number, b: number) => { setSz([a, b]); setPairs((ps) => ps.filter(([i, j]) => i < a && j < b)); setSel(null); };
  const rand = () => {
    const ps: Pair[] = [];
    for (let i = 0; i < nA; i++) {
      if (mode === "type") ps.push([i, Math.floor(Math.random() * nB)]);
      else for (let j = 0; j < nB; j++) if (Math.random() < 0.3) ps.push([i, j]);
    }
    setPairs(ps); setSel(null);
  };
  const an = analyze(nA, nB, pairs), any = pairs.length > 0;
  const c1 = an.out.every((v) => v >= 1), c2 = an.out.every((v) => v <= 1);
  const rows: ReactNode[] = mode === "func"
    ? [
      <Chk ok={c1}>Syarat 1: setiap anggota A punya pasangan</Chk>,
      <Chk ok={c2}>Syarat 2: pasangannya hanya satu</Chk>,
      <b style={{ color: an.isFunc ? C.green : C.red }}>{an.isFunc ? "Ini FUNGSI dari A ke B." : "Ini BUKAN fungsi (hanya relasi)."}</b>,
    ]
    : [
      <Chk ok={an.isFunc}>{an.isFunc ? "Sudah berupa fungsi" : "Belum fungsi: setiap anggota A harus punya tepat satu panah"}</Chk>,
      an.isFunc ? <Chk ok={an.inj}>Injektif: {an.inj ? "tidak ada anggota B yang dituju dua panah" : "ada anggota B (merah) yang dituju lebih dari satu panah"}</Chk> : <Muted>Injektif: –</Muted>,
      an.isFunc ? <Chk ok={an.sur}>Surjektif: {an.sur ? "semua anggota B terjangkau" : "ada anggota B (putus-putus) yang tidak terjangkau"}</Chk> : <Muted>Surjektif: –</Muted>,
      <b style={{ color: an.bij ? C.green : C.mute }}>{an.bij ? "Bijektif = korespondensi satu-satu" : "Belum bijektif"}</b>,
    ];
  return (<>
    {mode === "type" && (
      <Chips value={`${nA}${nB}`} onPick={(v) => resize(Number(v[0]), Number(v[1]))}
        items={[{ v: "33", label: "n(A)=3, n(B)=3" }, { v: "34", label: "n(A)=3, n(B)=4" }, { v: "43", label: "n(A)=4, n(B)=3" }]} />
    )}
    <Arrows
      A={A} B={B} pairs={pairs} maxH={300}
      onA={(i) => setSel(sel === i ? null : i)} onB={(j) => { if (sel !== null) toggle(sel, j); }}
      nodeA={(i) => ({ ...(sel === i ? { w: 4.5 } : {}), ...(any && an.out[i] !== 1 ? { stroke: C.red } : {}) })}
      nodeB={(j) => (mode === "type" && an.isFunc ? (an.inn[j] > 1 ? { stroke: C.red, fill: "#fde8e6" } : an.inn[j] === 0 ? { dash: true, stroke: C.mute, fill: "#fff" } : {}) : {})}
      pairCol={(k) => (an.out[pairs[k][0]] > 1 ? "red" : "ink")}
    />
    <Hint>Ketuk anggota A (tebal), lalu ketuk anggota B untuk membuat atau menghapus panah.</Hint>
    <div className="ds-chips">
      <button type="button" className="ds-chip" onClick={() => { setPairs([]); setSel(null); }}>Kosongkan</button>
      <button type="button" className="ds-chip" onClick={rand}>{mode === "type" ? "Acak fungsi" : "Acak relasi"}</button>
    </div>
    <Read rows={rows} />
  </>);
}

/* ═════════════════ 16. Syarat fungsi ═════════════════ */
function FuncRules() {
  return (
    <Frame
      eyebrow="Fungsi" title="Syarat suatu fungsi"
      copy={<>
        <p>Tidak semua relasi adalah fungsi. <b>Fungsi</b> dari A ke B adalah relasi yang memasangkan <b>setiap</b> anggota A dengan <b>tepat satu</b> anggota B.</p>
        <p className="fragment"><b>Syarat 1</b>: semua anggota A punya pasangan (tidak ada yang “menganggur”).</p>
        <p className="fragment"><b>Syarat 2</b>: pasangannya <b>tunggal</b>, panah tidak boleh bercabang.</p>
        <p className="fragment ds-muted">Anggota B boleh tidak terpakai, dan boleh dituju beberapa panah sekaligus.</p>
      </>}
      stage={<Builder mode="func" />}
    />
  );
}

/* ═════════════════ 17. Fungsi atau bukan? ═════════════════ */
const LA3: El[] = ["a", "b", "c"], LB4: El[] = [1, 2, 3, 4];
const FJ: Pair[][] = [
  [[0, 0], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [1, 2], [2, 3]],
  [[0, 1], [1, 2]],
  [[0, 3], [1, 3], [2, 3]],
  [[0, 0], [1, 1], [2, 2], [2, 3]],
  [[0, 2], [1, 0], [2, 1]],
];
function FuncJudge() {
  const items: JItem[] = FJ.map((pairs) => {
    const an = analyze(3, 4, pairs);
    const iNo = an.out.findIndex((v) => v !== 1);
    return {
      vis: <Arrows A={LA3} B={LB4} pairs={pairs} maxH={210} />,
      yes: an.isFunc,
      why: an.isFunc
        ? <>Setiap anggota A tepat satu panah. {an.inj ? "Bahkan semua tujuannya berbeda." : "Dua anggota A boleh menuju anggota B yang sama."}</>
        : an.out[iNo] === 0 ? <>Anggota <b>{LA3[iNo]}</b> tidak punya pasangan (syarat 1 gagal).</>
          : <>Anggota <b>{LA3[iNo]}</b> memiliki {an.out[iNo]} panah (syarat 2 gagal).</>,
    };
  });
  return (
    <Judge
      eyebrow="Fungsi" title="Fungsi atau bukan?" yes="Fungsi" no="Bukan fungsi" items={items}
      copy={<>
        <p>Periksa diagram panah di kanan dengan dua pertanyaan:</p>
        <p className="fragment">Adakah anggota A yang <b>tanpa panah</b>?</p>
        <p className="fragment">Adakah anggota A yang <b>panahnya lebih dari satu</b>?</p>
        <p className="fragment">Bila jawaban keduanya “tidak”, itu fungsi.</p>
      </>}
    />
  );
}

/* ═════════════════ 18. Domain, kodomain, dan range ═════════════════ */
const INPUTS = [-1, 0, 1];
const OUTPUTS = [-4, -3, -2, -1, 0, 1, 3];
function DomainRange() {
  const [r, setR] = useState(0);
  const rule = RULES[r];
  const values = INPUTS.map(rule.f);
  const pairs = values.map((v, i) => [i, OUTPUTS.indexOf(v)] as Pair);
  const range = [...new Set(values)].sort((a, b) => a - b);
  return (
    <Frame
      eyebrow="Fungsi" title="Domain, kodomain, dan range"
      copy={<>
        <p><b>Domain</b> adalah kumpulan masukan, <b>kodomain</b> kumpulan keluaran yang mungkin, dan <b>range</b> keluaran yang benar-benar diperoleh.</p>
        <p className="fragment">Setiap anggota domain harus memiliki tepat satu panah.</p>
        <p className="fragment">Range selalu menjadi bagian dari kodomain.</p>
      </>}
      stage={<>
        <Chips value={r} onPick={setR} items={RULES.map((item, i) => ({ v: i, label: `f(x) = ${item.l}` }))} />
        <Arrows
          A={INPUTS} B={OUTPUTS} pairs={pairs} names={["A (domain)", "B (kodomain)"]} maxH={330}
          nodeB={(i) => (range.includes(OUTPUTS[i]) ? { fill: "#ccfbf1", stroke: C.teal, color: C.ink } : { fill: "#fff", stroke: C.line, dash: true, color: C.mute })}
        />
        <Read rows={[
          tex(raw`A=${setTex(INPUTS)}`),
          tex(raw`B=${setTex(OUTPUTS)}`),
          <><b>Range f</b> = {tex(setTex(range))}</>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ 19. Tabel nilai fungsi ═════════════════ */
function ValuesTable() {
  const [r, setR] = useState(0);
  const [selected, setSelected] = useState(0);
  const rule = RULES[r];
  const values = useMemo(() => INPUTS.map((x) => ({ x, y: rule.f(x) })), [rule]);
  return (
    <Frame
      eyebrow="Fungsi" title="Nilai fungsi dalam tabel"
      copy={<>
        <p>Tabel membantu kita melihat pasangan masukan dan keluaran secara teratur.</p>
        <p className="fragment">Pilih aturan, lalu ketuk baris untuk menyorot pasangan (x, f(x)).</p>
        <p className="fragment">Contoh: jika {tex(raw`f(x)=2x+1`)}, maka {tex(raw`f(2)=2(2)+1=5`)}.</p>
      </>}
      stage={<>
        <Chips value={r} onPick={(value) => { setR(value); setSelected(0); }} items={RULES.map((item, i) => ({ v: i, label: `f(x) = ${item.l}` }))} />
        <div className="hf-value-table" role="table" aria-label={`Tabel nilai fungsi f(x) = ${rule.l}`}>
          <div className="hf-value-table__row hf-value-table__row--head" role="row">
            <span role="columnheader">x</span><span role="columnheader">f(x)</span>
          </div>
          {values.map(({ x, y }, i) => (
            <button
              className={`hf-value-table__row${selected === i ? " is-selected" : ""}`}
              key={x} type="button" role="row" aria-pressed={selected === i} onClick={() => setSelected(i)}
            >
              <span role="cell">{show(x)}</span><span role="cell">{show(y)}</span>
            </button>
          ))}
        </div>
        <Read rows={[tex(`${rule.t.replace("x", `(${nt(values[selected].x)})`)}=${nt(values[selected].y)}`)]} />
      </>}
    />
  );
}

/* ═════════════════ 20. Model fungsi sederhana ═════════════════ */
function AppliedFunction() {
  const [qty, setQty] = useState(4);
  const total = 2000 + 500 * qty;
  return (
    <Frame
      eyebrow="Fungsi" title="Fungsi dalam kehidupan sehari-hari"
      copy={<>
        <p>Sebuah tempat fotokopi mengenakan biaya tetap Rp2.000 ditambah Rp500 untuk setiap lembar.</p>
        <p className="fragment">Jika x adalah banyak lembar, biaya totalnya dapat ditulis sebagai fungsi.</p>
        <p className="fragment">Ubah nilai x dan lihat bagaimana keluaran fungsi ikut berubah.</p>
      </>}
      stage={<>
        <div className="hf-quote"><span>f(x) = 500x + 2.000</span>biaya dalam rupiah</div>
        <Ctl one><Range label="Jumlah lembar (x)" value={qty} min={0} max={20} step={1} onChange={setQty} color={C.blue} /></Ctl>
        <Read rows={[
          <>{qty} lembar</>,
          tex(raw`f(${qty})=500\times${qty}+2.000`),
          <b style={{ color: C.teal }}>Total biaya: Rp{total.toLocaleString("id-ID")}</b>,
        ]} />
      </>}
    />
  );
}

/* ═════════════════ 21. Jenis fungsi ═════════════════ */
function FunctionTypes() {
  return (
    <Frame
      eyebrow="Fungsi" title="Injektif, surjektif, dan bijektif"
      copy={<>
        <p><b>Injektif</b>: anggota A yang berbeda menuju anggota B yang berbeda.</p>
        <p className="fragment"><b>Surjektif</b>: setiap anggota B mendapat panah.</p>
        <p className="fragment"><b>Bijektif</b>: sekaligus injektif dan surjektif.</p>
        <p className="fragment">Ubah banyak anggota atau panah untuk mencoba tiap jenis pemetaan.</p>
      </>}
      stage={<Builder mode="type" />}
    />
  );
}

/* ═════════════════ 22. Ringkasan ═════════════════ */
function Summary() {
  return (
    <Frame
      eyebrow="Ringkasan" title="Dari himpunan ke fungsi"
      copy={<>
        <p><b>Himpunan</b> mengumpulkan objek dengan batas anggota yang jelas.</p>
        <p className="fragment"><b>Relasi</b> memasangkan anggota dari dua himpunan.</p>
        <p className="fragment"><b>Fungsi</b> adalah relasi yang memberi setiap masukan tepat satu keluaran.</p>
        <p className="fragment">Diagram, pasangan berurutan, tabel, dan aturan fungsi menyatakan hubungan yang sama dengan cara berbeda.</p>
      </>}
      stage={<div className="hf-summary">
        <div><span>01</span><b>Himpunan</b><small>kumpulan anggota</small></div>
        <div><span>02</span><b>Relasi</b><small>pasangan anggota</small></div>
        <div><span>03</span><b>Fungsi</b><small>satu keluaran per masukan</small></div>
      </div>}
    />
  );
}

export default function HimpunanRelasiFungsiDeck() {
  return (
    <SlideDeck>
      <Cover />
      <SetJudge />
      <Members />
      <Present />
      <Subsets />
      <VennSlide op="u" />
      <VennSlide op="i" />
      <VennSlide op="d" />
      <VennSlide op="c" />
      <FourOps />
      <RelIntro />
      <ArrowDiagram />
      <OrderedPairs />
      <Cartesian />
      <Machine />
      <FuncRules />
      <FuncJudge />
      <DomainRange />
      <ValuesTable />
      <AppliedFunction />
      <FunctionTypes />
      <Summary />
      <Quiz eyebrow="Latihan" title="Kuis himpunan, relasi, dan fungsi" items={QUIZ} />
    </SlideDeck>
  );
}
