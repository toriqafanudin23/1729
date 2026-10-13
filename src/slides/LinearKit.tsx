/* eslint-disable @typescript-eslint/no-explicit-any */
/* LinearKit — perkakas bersama untuk deck SPL, SPtL, dan Program linear.
   Isi: geometri garis ax+by=c, daerah pertidaksamaan, penyelesaian pada garis bilangan,
   slide "metode langkah demi langkah" (MethodSlide), dan kuis pilihan ganda (Quiz). */
import { useRef, useState, type ReactNode } from "react";
import { SimMath } from "../simulation/common/components/SimMath";
import {
  Btn, C, dot, fmt, Frame, mk, note, OFF, seg, shape, SimBoard, still, useStep,
  type B, type BBox, type Build, type Vec,
} from "./core";
import "./sppl.css";

/* ───────── Teks & angka ───────── */
export const tex = (s: string) => <SimMath tex={s} />;
export const cases = (...rows: string[]) => String.raw`\begin{cases}${rows.join(String.raw`\\`)}\end{cases}`;
/** Angka gaya Indonesia, tanpa nol di belakang koma. */
export const n = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return Number.isInteger(r) ? fmt(r, 0) : fmt(r, 2).replace(/(,\d*?)0+$/, "$1").replace(/,$/, "");
};
export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/* ───────── Model garis & pertidaksamaan ───────── */
export type Abc = [number, number, number]; // ax + by = c
export type Sys = [Abc, Abc];
export type Op = "<=" | ">=" | "<" | ">";
export type Cons = { a: number; b: number; c: number; op: Op };
export const K = (a: number, b: number, op: Op, c: number): Cons => ({ a, b, c, op });
export const OPS: Record<Op, string> = { "<=": "≤", ">=": "≥", "<": "<", ">": ">" };

const term = (k: number, v: string, first: boolean) =>
  k === 0 ? "" : `${first ? (k < 0 ? "−" : "") : k < 0 ? " − " : " + "}${Math.abs(k) === 1 ? "" : n(Math.abs(k))}${v}`;
export const lin = (a: number, b: number) => term(a, "x", true) + term(b, "y", a === 0) || "0";
export const eq = (l: Abc) => `${lin(l[0], l[1])} = ${n(l[2])}`;
export const consTxt = (k: Cons) => `${lin(k.a, k.b)} ${OPS[k.op]} ${n(k.c)}`;

export const ok = (k: Cons, x: number, y: number) => {
  const v = k.a * x + k.b * y - k.c;
  return k.op === "<=" ? v <= 1e-9 : k.op === ">=" ? v >= -1e-9 : k.op === "<" ? v < -1e-9 : v > 1e-9;
};

export function solve([[a1, b1, c1], [a2, b2, c2]]: Sys) {
  const D = a1 * b2 - a2 * b1;
  if (Math.abs(D) > 1e-12) return { kind: "satu" as const, x: (c1 * b2 - c2 * b1) / D, y: (a1 * c2 - a2 * c1) / D, D };
  const same = Math.abs(a1 * c2 - a2 * c1) < 1e-12 && Math.abs(b1 * c2 - b2 * c1) < 1e-12;
  return { kind: same ? ("banyak" as const) : ("nol" as const), x: NaN, y: NaN, D };
}
export const KIND = {
  satu: { t: "berpotongan", s: "tepat satu penyelesaian", c: C.teal },
  nol: { t: "sejajar", s: "tidak ada penyelesaian", c: C.red },
  banyak: { t: "berimpit", s: "tak hingga penyelesaian", c: C.violet },
};

/* ───────── Penggambar JSXGraph ───────── */
const BIG = 80;
/** Dua titik jauh pada garis ax+by=c (null bila a=b=0). */
export const edge = (a: number, b: number, c: number): [Vec, Vec] | null => {
  if (b !== 0) return [[-BIG, (c + a * BIG) / b], [BIG, (c - a * BIG) / b]];
  if (a !== 0) return [[c / a, -BIG], [c / a, BIG]];
  return null;
};
/** Garis ax+by=c; `null` menyembunyikannya. */
export const ln = (b: B, g: () => Abc | null, color: string, w = 2.5, dash = 0) => {
  const e = () => { const t = g(); return t ? edge(t[0], t[1], t[2]) : null; };
  return seg(b, () => e()?.[0] ?? OFF, () => e()?.[1] ?? OFF, color, w, dash);
};
/** Garis batas pertidaksamaan: penuh untuk ≤ ≥, putus-putus untuk < >. */
export const boundary = (b: B, g: () => Cons | null, color: string, w = 2.5) => {
  const pick = (strict: boolean): Abc | null => {
    const k = g();
    return k && (k.op === "<" || k.op === ">") === strict ? [k.a, k.b, k.c] : null;
  };
  ln(b, () => pick(false), color, w);
  ln(b, () => pick(true), color, w, 3);
};
export const fill = (b: B, pts: () => Vec[] | null, color: string, op = 0.2) =>
  shape(b, () => { const p = pts(); return p && p.length >= 3 ? p : null; }, { strokeOpacity: 0, strokeWidth: 0, fillColor: color, fillOpacity: op });

/** Memotong poligon dengan satu setengah-bidang (Sutherland–Hodgman). */
export function clip(poly: Vec[], k: Cons): Vec[] {
  const s = k.op === "<=" || k.op === "<" ? 1 : -1;
  const f = (p: Vec) => s * (k.a * p[0] + k.b * p[1] - k.c);
  const out: Vec[] = [];
  poly.forEach((P, i) => {
    const Q = poly[(i + 1) % poly.length], fp = f(P), fq = f(Q);
    if (fp <= 0) out.push(P);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const t = fp / (fp - fq);
      out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
    }
  });
  return out;
}
/** Daerah penyelesaian = irisan semua kendala (dipotong persegi besar). */
export const region = (cons: Cons[], R = 100): Vec[] =>
  cons.reduce((p, k) => (p.length ? clip(p, k) : p), [[-R, -R], [R, -R], [R, R], [-R, R]] as Vec[]);

/* ───────── Penyelesaian pada garis bilangan ───────── */
export type Sol = { segs: [number, number][]; pts: { x: number; on: boolean }[] };
export function solution(pred: (x: number) => boolean, crit: number[]): Sol {
  const c = [...new Set(crit)].sort((p, q) => p - q);
  const e = [-Infinity, ...c, Infinity];
  const segs: [number, number][] = [];
  for (let i = 0; i < e.length - 1; i++) {
    const lo = e[i], hi = e[i + 1];
    const mid = lo === -Infinity ? (hi === Infinity ? 0 : hi - 1) : hi === Infinity ? lo + 1 : (lo + hi) / 2;
    if (pred(mid)) segs.push([lo, hi]);
  }
  return { segs, pts: c.map((x) => ({ x, on: pred(x) })) };
}
/** Tebal pada sumbu-x (garis y), ○ untuk tidak termasuk dan ● untuk termasuk. */
export function axisSolution(b: B, g: () => Sol | null, y = 0, color: string = C.teal) {
  const c = mk(b, "curve", [[0], [0]], { ...still, strokeColor: color, strokeWidth: 7, strokeOpacity: 0.85 });
  c.updateDataArray = () => {
    const xs: number[] = [], ys: number[] = [];
    (g()?.segs ?? []).forEach(([l, h], i) => {
      if (i) { xs.push(NaN); ys.push(NaN); }
      xs.push(Math.max(l, -BIG), Math.min(h, BIG)); ys.push(y, y);
    });
    if (!xs.length) { xs.push(NaN); ys.push(NaN); }
    c.dataX = xs; c.dataY = ys;
  };
  [true, false].forEach((on) => [0, 1, 2].forEach((i) => {
    const P = () => (g()?.pts ?? []).filter((q) => q.on === on)[i];
    mk(b, "point", [() => P()?.x ?? OFF[0], () => (P() ? y : OFF[1])], {
      ...still, name: "", withLabel: false, size: 5, fillColor: on ? color : "#fff", strokeColor: color, strokeWidth: 2,
    });
  }));
}

/* ───────── Papan dua garis (+ garis bantu, titik potong) ───────── */
export type MP = {
  s: Sys; show: number; vx: number | null; hy: number | null; pt: boolean; lab: string | null; icpt: boolean;
};
export const buildSys: Build<MP> = (b, g) => {
  const L = [C.blue, C.orange];
  [0, 1].forEach((i) => ln(b, () => (g().show > i ? g().s[i] : null), L[i], 2.75));
  ln(b, () => (g().vx == null ? null : [1, 0, g().vx as number]), C.violet, 2, 3);
  ln(b, () => (g().hy == null ? null : [0, 1, g().hy as number]), C.violet, 2, 3);
  [0, 1].forEach((i) => [0, 1].forEach((j) => {
    const P = (): Vec => {
      const [a, bb, c] = g().s[i];
      if (!g().icpt || g().show <= i) return OFF;
      return j === 0 ? (a !== 0 ? [c / a, 0] : OFF) : bb !== 0 ? [0, c / bb] : OFF;
    };
    dot(b, P, L[i], 4);
    note(b, () => (P() === OFF ? OFF : [P()[0] + 0.25, P()[1] + 0.25]), () => `(${n(P()[0])}, ${n(P()[1])})`, L[i]);
  }));
  const R = () => solve(g().s);
  const has = () => g().pt && R().kind === "satu";
  dot(b, () => (has() ? [R().x, R().y] : OFF), C.ink, 6);
  note(b, () => (has() ? [R().x + 0.25, R().y + 0.25] : OFF), () => g().lab ?? `(${n(R().x)}, ${n(R().y)})`, C.ink);
};

export type Step = { tex: string; show?: number; vx?: number | null; hy?: number | null; pt?: boolean; lab?: string };
/** Slide metode: tiap fragmen (→) menambah satu baris langkah dan satu garis bantu pada papan. */
export function MethodSlide(p: {
  eyebrow: string; title: string; copy: ReactNode; head: string; sys: Sys; bbox: BBox;
  steps: Step[]; show0?: number; maxH?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const k = Math.min(useStep(ref), p.steps.length);
  type Cur = { show: number; vx: number | null; hy: number | null; pt: boolean; lab: string | null };
  const cur = p.steps.slice(0, k).reduce<Cur>(
    (a, s) => ({
      show: s.show ?? a.show, vx: s.vx !== undefined ? s.vx : a.vx, hy: s.hy !== undefined ? s.hy : a.hy,
      pt: s.pt ?? a.pt, lab: s.lab ?? a.lab,
    }),
    { show: p.show0 ?? 2, vx: null, hy: null, pt: false, lab: null },
  );
  return (
    <Frame
      innerRef={ref} eyebrow={p.eyebrow} title={p.title} copy={p.copy}
      stage={<>
        <SimBoard bbox={p.bbox} params={{ s: p.sys, icpt: false, ...cur }} build={buildSys} maxH={p.maxH ?? 310} />
        <div className="ds-read ds-steps">
          <div>{tex(p.head)}</div>
          {p.steps.slice(0, k).map((s, i) => <div key={i} className={i === k - 1 ? "is-now" : ""}>{tex(s.tex)}</div>)}
        </div>
      </>}
    />
  );
}

/* ───────── Kuis pilihan ganda (dengan grafik pembahasan) ───────── */
export type Viz = { bbox: BBox; lines?: Abc[]; cons?: Cons[]; pts?: Vec[]; mark?: Vec };
export type QItem = { q: ReactNode; opts: string[]; ans: number; why: ReactNode; viz?: Viz };
const LETTER = ["A", "B", "C", "D", "E"];
const rich = (s: string) => (/[\\^_{}]/.test(s) ? tex(s) : s);
const buildViz: Build<{ v: Viz }> = (b, g) => {
  const COL = [C.blue, C.orange, C.violet, C.teal, C.mute];
  fill(b, () => (g().v.cons ? region(g().v.cons as Cons[]) : null), C.teal, 0.2);
  COL.forEach((c, i) => {
    ln(b, () => g().v.lines?.[i] ?? null, c, 2.5);
    boundary(b, () => g().v.cons?.[i] ?? null, c, 2.25);
  });
  [0, 1, 2, 3, 4, 5].forEach((i) => dot(b, () => g().v.pts?.[i] ?? OFF, C.violet, 5));
  dot(b, () => g().v.mark ?? OFF, C.green, 8);
};

export function Quiz(p: { eyebrow: string; title: string; items: QItem[] }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const N = p.items.length, done = i >= N, it = p.items[Math.min(i, N - 1)];
  const choose = (j: number) => { if (pick === null) { setPick(j); if (j === it.ans) setScore((s) => s + 1); } };
  const right = pick === it.ans;
  return (
    <Frame
      eyebrow={p.eyebrow}
      title={p.title}
      copy={done ? (<>
        <p>Skor Anda: <b>{score} dari {N}</b>.</p>
        <p className="ds-muted">
          {score === N ? "Sempurna! Coba tantang teman Anda." : score >= N * 0.7 ? "Bagus. Untuk soal yang salah, lihat lagi grafiknya." : "Tidak apa-apa. Ulangi simulasinya, lalu coba lagi."}
        </p>
      </>) : (<>
        <p className="ds-muted">Soal {i + 1} dari {N}</p>
        <p>{it.q}</p>
        {pick !== null && (
          <p className={right ? "ds-ok" : "ds-bad"} style={{ fontSize: 20 }}>
            <b>{right ? "✓ Benar." : `✗ Belum tepat. Jawaban: ${LETTER[it.ans]}.`}</b> <span style={{ color: C.ink }}>{it.why}</span>
          </p>
        )}
      </>)}
      stage={done ? (
        <Btn onClick={() => { setI(0); setPick(null); setScore(0); }}>Ulangi kuis</Btn>
      ) : (<>
        <div className="ds-opts">
          {it.opts.map((o, j) => (
            <button
              key={j} type="button" disabled={pick !== null}
              className={`ds-opt${pick !== null ? (j === it.ans ? " is-ok" : j === pick ? " is-bad" : "") : ""}`}
              onClick={() => choose(j)}
            >
              <b>{LETTER[j]}</b><span>{rich(o)}</span>
            </button>
          ))}
        </div>
        {pick !== null && it.viz && <SimBoard key={i} bbox={it.viz.bbox} params={{ v: it.viz }} build={buildViz} maxH={230} />}
        {pick !== null && <Btn onClick={() => { setPick(null); setI(i + 1); }}>{i + 1 < N ? "Soal berikutnya" : "Lihat skor"}</Btn>}
      </>)}
    />
  );
}
