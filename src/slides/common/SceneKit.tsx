/* eslint-disable @typescript-eslint/no-explicit-any */
/* SceneKit — mesin "adegan" untuk deck geometri.
   Gagasannya: setiap slide cukup menghitung `Geo` (poligon, ruas, titik, teks, busur sudut) dari
   keadaan slide (slider, chip, atau langkah fragmen). Gaya (warna, tebal, putus-putus) ditetapkan
   sekali lewat `Spec`; papan JSXGraph dibangun satu kali dan hanya mengisi ulang data tiap frame.
   Isi: tipe Spec/Geo, SceneBoard, SceneEx (langkah demi langkah), SceneLab (slider + chip),
   dan pembantu geometri (tri, arcAt, sqMark, names, marks). */
import { useRef, useState, type ReactNode } from "react";
import {
  C, Chips, dot, fmt, Frame, mk, note, OFF, Range, rad, seg, shape, SimBoard, still, useStep,
  type BBox, type Build, type Vec,
} from "./core";

/* ───────── Tipe ───────── */
export type Arc = { c: Vec; r: number; a0: number; a1: number };
export type Txt = { at: Vec; t: string };
type Maybe<T> = T | null | undefined;

/** Gaya tiap "slot". Slot ke-i pada Geo memakai gaya ke-i pada Spec. */
export type Spec = {
  polys?: [color: string, fill?: number, dash?: number, width?: number][];
  segs?: [color: string, width?: number, dash?: number][];
  arcs?: [color: string, width?: number][];
  dots?: [color: string, size?: number][];
  txts?: string[]; // warna teks
};
/** Data yang digambar; `null` menyembunyikan slot. */
export type Geo = {
  polys?: Maybe<Vec[]>[];
  segs?: Maybe<[Vec, Vec]>[];
  arcs?: Maybe<Arc>[];
  dots?: Maybe<Vec>[];
  txts?: Maybe<Txt>[];
};
export type ScenePar = { spec: Spec; geo: Geo };

export const buildScene: Build<ScenePar> = (b, g) => {
  const s = g().spec;
  (s.polys ?? []).forEach(([c, f = 0, d = 0, w = 2.5], i) => {
    shape(b, () => g().geo.polys?.[i] ?? null, { strokeColor: c, strokeWidth: w, dash: d, fillColor: c, fillOpacity: f });
  });
  (s.arcs ?? []).forEach(([c, w = 3], i) => {
    const cv = mk(b, "curve", [[0], [0]], { ...still, strokeColor: c, strokeWidth: w });
    cv.updateDataArray = () => {
      const a = g().geo.arcs?.[i];
      if (!a) { cv.dataX = [NaN]; cv.dataY = [NaN]; return; }
      const xs: number[] = [], ys: number[] = [];
      for (let k = 0; k <= 24; k++) {
        const t = rad(a.a0 + ((a.a1 - a.a0) * k) / 24);
        xs.push(a.c[0] + a.r * Math.cos(t)); ys.push(a.c[1] + a.r * Math.sin(t));
      }
      cv.dataX = xs; cv.dataY = ys;
    };
  });
  (s.segs ?? []).forEach(([c, w = 2.5, d = 0], i) => {
    seg(b, () => g().geo.segs?.[i]?.[0] ?? OFF, () => g().geo.segs?.[i]?.[1] ?? OFF, c, w, d);
  });
  (s.dots ?? []).forEach(([c, z = 5], i) => dot(b, () => g().geo.dots?.[i] ?? OFF, c, z));
  (s.txts ?? []).forEach((c, i) => {
    note(b, () => g().geo.txts?.[i]?.at ?? OFF, () => g().geo.txts?.[i]?.t ?? "", c);
  });
};

export function SceneBoard(p: { bbox: BBox; spec: Spec; geo: Geo; maxH?: number }) {
  return <SimBoard bbox={p.bbox} params={{ spec: p.spec, geo: p.geo }} build={buildScene} maxH={p.maxH ?? 400} />;
}

/* ───────── Geometri kecil ───────── */
export const dist = (p: Vec, q: Vec) => Math.hypot(p[0] - q[0], p[1] - q[1]);
export const mid = (p: Vec, q: Vec): Vec => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
export const lerp = (p: Vec, q: Vec, t: number): Vec => [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
export const dir = (p: Vec, q: Vec) => (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
export const unitv = (p: Vec, q: Vec): Vec => { const d = dist(p, q) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
export const mv = (pts: Vec[], d: Vec): Vec[] => pts.map((p) => [p[0] + d[0], p[1] + d[1]]);
export const centroid2 = (pts: Vec[]): Vec => [
  pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length,
];
/** Sudut di titik Q pada ∠PQR (derajat, 0–180). */
export const angAt = (P: Vec, Q: Vec, R: Vec) => {
  let d = Math.abs(dir(Q, P) - dir(Q, R)) % 360;
  if (d > 180) d = 360 - d;
  return d;
};
/** Segitiga ABC dengan BC = a, CA = b, AB = c; A di (0,0), B di (c,0). */
export const tri = (a: number, b: number, c: number): Vec[] => {
  const x = (b * b + c * c - a * a) / (2 * c);
  return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0, b * b - x * x))]];
};
/** Busur sudut dalam di titik V antara arah ke P dan ke Q (yang lebih kecil). */
export const arcAt = (V: Vec, P: Vec, Q: Vec, r: number): Arc => {
  const a0 = dir(V, P);
  let d = dir(V, Q) - a0;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return { c: V, r, a0, a1: a0 + d };
};
/** Tanda siku-siku: persegi kecil di sudut P dengan arah satuan u dan v. */
export const sqMark = (P: Vec, u: Vec, v: Vec, s: number): Vec[] => [
  P, [P[0] + u[0] * s, P[1] + u[1] * s], [P[0] + (u[0] + v[0]) * s, P[1] + (u[1] + v[1]) * s], [P[0] + v[0] * s, P[1] + v[1] * s],
];
/** Nama titik diletakkan di luar bangun. */
export const names = (pts: Vec[], t: string[], d = 0.5): Txt[] => {
  const c = centroid2(pts);
  return pts.map((P, i) => {
    const u = unitv(c, P);
    return { at: [P[0] + u[0] * d - 0.15, P[1] + u[1] * d - 0.25] as Vec, t: t[i] };
  });
};
export const deg = (v: number) => `${fmt(v, 1)}°`;
export const same = (a: number, b: number) => Math.abs(a - b) < 1e-6;

/** Sorotan sisi dan sudut pada dua segitiga [A,B,C] dan [P,Q,R]. Sisi 0=AB, 1=BC, 2=CA; sudut 0=A, 1=B, 2=C. */
export function marks(T1: Vec[], T2: Vec[], sides: number[], angs: number[], r = 0.9): Pick<Geo, "segs" | "arcs"> {
  const segs: Maybe<[Vec, Vec]>[] = [null, null, null, null, null, null];
  const arcs: Maybe<Arc>[] = [null, null, null, null, null, null];
  [T1, T2].forEach((T, j) => {
    sides.forEach((s) => { segs[3 * j + s] = [T[s], T[(s + 1) % 3]]; });
    angs.forEach((v) => { arcs[3 * j + v] = arcAt(T[v], T[(v + 1) % 3], T[(v + 2) % 3], r); });
  });
  return { segs, arcs };
}
/** Gaya untuk sepasang segitiga: sisi biru/oranye/ungu, sudut tosca/merah/hijau. Slot poligon 2 dan 3 untuk tanda siku-siku. */
export const MARK_SPEC: Spec = {
  polys: [[C.ink, 0.06, 0, 2.5], [C.ink, 0.06, 0, 2.5], [C.ink, 0, 0, 1.75], [C.ink, 0, 0, 1.75]],
  segs: [C.blue, C.orange, C.violet, C.blue, C.orange, C.violet].map((c) => [c, 5, 0] as [string, number, number]),
  arcs: [C.teal, C.red, C.green, C.teal, C.red, C.green].map((c) => [c, 3] as [string, number]),
  txts: [C.ink, C.ink, C.ink, C.ink, C.ink, C.ink],
};

/* ───────── Slide langkah demi langkah ───────── */
export function SceneEx(p: {
  eyebrow: string; title: string; intro?: ReactNode; lines: ReactNode[]; bbox: BBox; spec: Spec;
  geo: (k: number) => Geo; note?: ReactNode | ((k: number) => ReactNode); maxH?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const k = Math.min(useStep(ref), p.lines.length);
  const nt = typeof p.note === "function" ? p.note(k) : p.note;
  return (
    <Frame
      innerRef={ref} eyebrow={p.eyebrow} title={p.title}
      copy={<>{p.intro}{p.lines.map((l, i) => <p className="fragment" key={i}>{l}</p>)}</>}
      stage={<>
        <SceneBoard bbox={p.bbox} spec={p.spec} geo={p.geo(k)} maxH={p.maxH ?? 400} />
        {nt && <div className="ds-read">{nt}</div>}
      </>}
    />
  );
}

/* ───────── Slide laboratorium: slider + chip ───────── */
export type Sl = { label: ReactNode; min: number; max: number; step: number; color?: string; shown?: (v: number) => string };
export function SceneLab(p: {
  eyebrow: string; title: string; copy: ReactNode; bbox: BBox; spec: Spec;
  init: number[]; sl: Sl[];
  chips?: { items: { v: number; label: ReactNode }[]; init: number };
  geo: (s: number[], c: number) => Geo;
  read: (s: number[], c: number) => ReactNode;
  maxH?: number;
}) {
  const [s, setS] = useState(p.init);
  const [c, setC] = useState(p.chips?.init ?? 0);
  const set = (i: number, v: number) => setS((a) => a.map((x, j) => (j === i ? v : x)));
  return (
    <Frame
      eyebrow={p.eyebrow} title={p.title} copy={p.copy}
      stage={<>
        <SceneBoard bbox={p.bbox} spec={p.spec} geo={p.geo(s, c)} maxH={p.maxH ?? 380} />
        {p.chips && <Chips items={p.chips.items} value={c} onPick={setC} />}
        {p.sl.length > 0 && (
          <div className={`ds-controls${p.sl.length === 1 ? " ds-controls--one" : ""}`}>
            {p.sl.map((q, i) => (
              <Range key={i} label={q.label} value={s[i]} min={q.min} max={q.max} step={q.step} color={q.color}
                shown={q.shown ? q.shown(s[i]) : undefined} onChange={(v) => set(i, v)} />
            ))}
          </div>
        )}
        <div className="ds-read">{p.read(s, c)}</div>
      </>}
    />
  );
}
