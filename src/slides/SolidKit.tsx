/* eslint-disable @typescript-eslint/no-explicit-any */
/* SolidKit — perkakas 3D untuk deck "Bangun ruang sisi datar".
   JSXGraph hanya 2D, jadi proyeksi 3D dibuat sendiri: putar (yaw, pitch) → proyeksi ortografis →
   urut dari jauh ke dekat (painter's algorithm). Setiap sisi adalah satu kurva JSXGraph dalam "kolam"
   (pool) yang isinya diganti tiap frame, sehingga papan tidak perlu dibangun ulang.
   Isi: aritmetika vektor, bangun (kubus, balok, prisma, limas), mesin jaring-jaring (buka ⇄ lipat
   lewat engsel dan rotasi Rodrigues), pemeriksa jaring kubus, dan penggambar view3. */
import { C, mk, OFF, still, type B, type Vec } from "./core";
import "./solid.css";

export type V3 = [number, number, number];

/* ═════════ Vektor ═════════ */
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const addv = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dotv = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const unit = (a: V3): V3 => { const l = len3(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const centroid = (P: V3[]): V3 => {
  const s = P.reduce<V3>((q, p) => addv(q, p), [0, 0, 0]);
  return mul(s, 1 / P.length);
};
/** Vektor normal sisi (rumus Newell). Arahnya keluar bila titik-titik berurutan berlawanan arah jarum jam dilihat dari luar. */
export const normalOf = (P: V3[]): V3 => {
  let x = 0, y = 0, z = 0;
  P.forEach((a, i) => {
    const b = P[(i + 1) % P.length];
    x += (a[1] - b[1]) * (a[2] + b[2]);
    y += (a[2] - b[2]) * (a[0] + b[0]);
    z += (a[0] - b[0]) * (a[1] + b[1]);
  });
  return unit([x, y, z]);
};
/** Memutar titik p mengelilingi sumbu (melalui a, arah u satuan) sebesar ang (rumus Rodrigues). */
export const rotAbout = (p: V3, a: V3, u: V3, ang: number): V3 => {
  const r = sub(p, a), c = Math.cos(ang), s = Math.sin(ang), k = dotv(u, r) * (1 - c), x = crossv(u, r);
  return [a[0] + r[0] * c + x[0] * s + u[0] * k, a[1] + r[1] * c + x[1] * s + u[1] * k, a[2] + r[2] * c + x[2] * s + u[2] * k];
};
export const smooth = (t: number) => { const k = Math.max(0, Math.min(1, t)); return k * k * (3 - 2 * k); };

/* ═════════ Bangun ═════════ */
/** V = titik sudut, F = sisi (daftar indeks titik, berlawanan arah jarum jam dilihat dari luar). */
export type Solid = { V: V3[]; F: number[][] };

/** Memastikan semua sisi menghadap keluar. */
export function orient(s: Solid): Solid {
  const c = centroid(s.V);
  return {
    V: s.V,
    F: s.F.map((f) => {
      const P = f.map((i) => s.V[i]);
      return dotv(normalOf(P), sub(centroid(P), c)) < 0 ? [...f].reverse() : f;
    }),
  };
}

/** Balok p × l × t. Urutan sisi: 0 alas (−z), 1 atas (+z), 2 depan (−y), 3 belakang (+y), 4 kiri (−x), 5 kanan (+x). */
export const boxSolid = (p: number, l: number, t: number): Solid => orient({
  V: [[0, 0, 0], [p, 0, 0], [p, l, 0], [0, l, 0], [0, 0, t], [p, 0, t], [p, l, t], [0, l, t]],
  F: [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [3, 7, 6, 2], [0, 4, 7, 3], [1, 2, 6, 5]],
});
/** Prisma tegak dengan alas poligon (urutan sisi: 0 alas, 1 atas, 2.. sisi tegak). */
export function prismSolid(base: Vec[], t: number): Solid {
  const n = base.length;
  const V: V3[] = [...base.map((b): V3 => [b[0], b[1], 0]), ...base.map((b): V3 => [b[0], b[1], t])];
  const F: number[][] = [
    Array.from({ length: n }, (_, i) => n - 1 - i),
    Array.from({ length: n }, (_, i) => n + i),
    ...Array.from({ length: n }, (_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i]),
  ];
  return orient({ V, F });
}
/** Limas dengan alas poligon di z = 0 dan puncak `apex` (urutan sisi: 0 alas, 1.. sisi tegak). */
export function pyramidSolid(base: Vec[], apex: V3): Solid {
  const n = base.length;
  const V: V3[] = [...base.map((b): V3 => [b[0], b[1], 0]), apex];
  const F: number[][] = [
    Array.from({ length: n }, (_, i) => n - 1 - i),
    ...Array.from({ length: n }, (_, i) => [i, (i + 1) % n, n]),
  ];
  return orient({ V, F });
}
/** Poligon beraturan (berlawanan arah jarum jam), pusat (0,0), sisi `side`. */
export const regular = (n: number, side: number, rot0 = 0): Vec[] => {
  const R = side / (2 * Math.sin(Math.PI / n));
  return Array.from({ length: n }, (_, i) => {
    const a = rot0 + (2 * Math.PI * i) / n;
    return [R * Math.cos(a), R * Math.sin(a)] as Vec;
  });
};
export const polyArea = (P: Vec[]) => Math.abs(P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
export const polyPerim = (P: Vec[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + Math.hypot(q[0] - p[0], q[1] - p[1]); }, 0);

/** Rusuk unik sebuah bangun, sebagai pasangan indeks titik. */
export function edgesOf(s: Solid): [number, number][] {
  const seen = new Set<string>(), out: [number, number][] = [];
  s.F.forEach((f) => f.forEach((a, i) => {
    const b = f[(i + 1) % f.length], k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!seen.has(k)) { seen.add(k); out.push([a, b]); }
  }));
  return out;
}

/* ═════════ Jaring-jaring: engsel dan lipatan ═════════ */
export type NetFace = {
  flat: V3[];   // titik sudut pada keadaan terbuka (z = 0)
  par: number;  // indeks sisi induk (−1 = akar, tidak bergerak)
  a: V3;        // titik pada engsel (keadaan terbuka)
  u: V3;        // arah engsel (satuan)
  ang: number;  // sudut lipat akhir (rad), arahnya selalu ke +z
  col: string;
  src: number;  // indeks sisi pada bangun asal
};
const flatPlane = (v: V3): V3 => [v[0], v[1], 0];

/** Membuka sebuah bangun menjadi jaring-jaring. `tree` = daftar [induk, anak]; null = telusur melebar dari akar. */
export function netFromSolid(solid: Solid, root: number, tree: [number, number][] | null, col: (i: number) => string): NetFace[] {
  const s = orient(solid);
  // bingkai: sisi akar rata di z = 0, bangunnya berada di atasnya (+z)
  const rootP = s.F[root].map((i) => s.V[i]);
  const o = centroid(rootP), ez = mul(normalOf(rootP), -1);
  const ex = unit(sub(rootP[1], rootP[0])), ey = crossv(ez, ex);
  const V = s.V.map((v): V3 => { const r = sub(v, o); return [dotv(r, ex), dotv(r, ey), dotv(r, ez)]; });
  const N = s.F.map((f) => normalOf(f.map((i) => V[i])));
  const shared = (p: number, c: number): [number, number] => {
    const k = s.F[p].filter((i) => s.F[c].includes(i));
    return [k[0], k[1]];
  };
  let T = tree;
  if (!T) {
    T = [];
    const seen = new Set([root]), q = [root];
    while (q.length) {
      const p = q.shift() as number;
      s.F.forEach((_, c) => {
        if (!seen.has(c) && s.F[p].filter((i) => s.F[c].includes(i)).length === 2) { seen.add(c); T!.push([p, c]); q.push(c); }
      });
    }
  }
  type Rot = { A: V3; u: V3; th: number };
  const chain: Rot[][] = s.F.map(() => []);
  const net: NetFace[] = s.F.map((f, i) => ({
    flat: f.map((k) => flatPlane(V[k])), par: -1, a: [0, 0, 0], u: [1, 0, 0], ang: 0, col: col(i), src: i,
  }));
  const apply = (p: V3, ch: Rot[]) => ch.reduce((x, r) => rotAbout(x, r.A, r.u, r.th), p);
  T.forEach(([p, c]) => {
    const [i, j] = shared(p, c);
    const A = V[i], u = unit(sub(V[j], V[i]));
    const phi = Math.acos(Math.max(-1, Math.min(1, dotv(N[c], N[p]))));
    const zero: V3 = [0, 0, 0];
    const th = dotv(rotAbout(N[c], zero, u, phi), N[p]) >= dotv(rotAbout(N[c], zero, u, -phi), N[p]) ? phi : -phi;
    chain[c] = [{ A, u, th }, ...chain[p]];
    const flat = s.F[c].map((k) => flatPlane(apply(V[k], chain[c])));
    const fa = flatPlane(apply(V[i], chain[p])), fb = flatPlane(apply(V[j], chain[p]));
    const uu = unit(sub(fb, fa)), cc = centroid(flat), r = sub(cc, fa);
    const sgn = uu[0] * r[1] - uu[1] * r[0] >= 0 ? 1 : -1;
    net[c] = { ...net[c], flat, par: p, a: fa, u: uu, ang: sgn * phi };
  });
  return net;
}

/** Posisi 3D tiap sisi pada tingkat lipatan t (0 = datar, 1 = bangun utuh). */
export function foldNet(net: NetFace[], t: number): V3[][] {
  return net.map((f, i) => {
    let pts = f.flat, k = i;
    while (net[k].par >= 0) {
      const h = net[k];
      pts = pts.map((p) => rotAbout(p, h.a, h.u, h.ang * t));
      k = h.par;
    }
    return pts;
  });
}

/* ───────── Jaring dari sel persegi (jaring kubus) ───────── */
export type Cell = [number, number]; // [kolom, baris], baris bertambah ke bawah
const cellKey = (c: Cell) => `${c[0]},${c[1]}`;
const cellPoly = (c: Cell): V3[] => [[c[0], -c[1] - 1, 0], [c[0] + 1, -c[1] - 1, 0], [c[0] + 1, -c[1], 0], [c[0], -c[1], 0]];

export type CellNet = {
  net: NetFace[]; tree: [number, number][]; root: number; connected: boolean;
  /** nomor sisi kubus (0..5) tiap sel setelah dilipat; sama = bertumpuk. −1 bila tak terjangkau. */
  face: number[]; ok: boolean; dup: boolean[]; missing: number[];
};
/** Melipat sel-sel menjadi kubus dan memeriksa apakah keenam sisi kubus tertutup tepat sekali. */
export function cellNet(cells: Cell[], col: (face: number, cell: number) => string): CellNet {
  const n = cells.length;
  const idx = new Map(cells.map((c, i) => [cellKey(c), i]));
  const nb = (i: number) => ([[1, 0], [-1, 0], [0, 1], [0, -1]] as Cell[])
    .map((d) => idx.get(cellKey([cells[i][0] + d[0], cells[i][1] + d[1]]))).filter((x): x is number => x !== undefined);
  let root = 0;
  cells.forEach((_, i) => { if (nb(i).length > nb(root).length) root = i; });
  const tree: [number, number][] = [], seen = new Set([root]), q = [root];
  while (q.length) {
    const p = q.shift() as number;
    nb(p).forEach((c) => { if (!seen.has(c)) { seen.add(c); tree.push([p, c]); q.push(c); } });
  }
  const net: NetFace[] = cells.map((c, i) => ({ flat: cellPoly(c), par: -1, a: [0, 0, 0], u: [1, 0, 0], ang: 0, col: col(-1, i), src: i }));
  tree.forEach(([p, c]) => {
    const pp = net[p].flat, cp = net[c].flat;
    const sh = pp.filter((v) => cp.some((w) => Math.abs(v[0] - w[0]) < 1e-9 && Math.abs(v[1] - w[1]) < 1e-9));
    const uu = unit(sub(sh[1], sh[0])), r = sub(centroid(cp), sh[0]);
    const sgn = uu[0] * r[1] - uu[1] * r[0] >= 0 ? 1 : -1;
    net[c] = { ...net[c], par: p, a: sh[0], u: uu, ang: (sgn * Math.PI) / 2 };
  });
  const connected = seen.size === n;
  const face = cells.map(() => -1);
  if (connected) {
    foldNet(net, 1).forEach((P, i) => {
      const nr = normalOf(P).map((x) => Math.round(x)) as V3;
      const ax = nr.findIndex((x) => x !== 0);
      face[i] = ax * 2 + (nr[ax] > 0 ? 1 : 0);
    });
  }
  const count = new Map<number, number>();
  face.forEach((f) => count.set(f, (count.get(f) ?? 0) + 1));
  const dup = face.map((f) => f >= 0 && (count.get(f) ?? 0) > 1);
  const missing = [0, 1, 2, 3, 4, 5].filter((f) => !count.has(f));
  const ok = connected && n === 6 && missing.length === 0 && !dup.some(Boolean);
  net.forEach((f, i) => { f.col = col(face[i], i); });
  return { net, tree, root, connected, face, ok, dup, missing };
}

/** Bentuk kanonik himpunan sel (tak peduli geser, putar, atau cermin). */
export const canonCells = (cells: Cell[]): string => {
  const T: ((c: Cell) => Cell)[] = [
    (c) => [c[0], c[1]], (c) => [-c[1], c[0]], (c) => [-c[0], -c[1]], (c) => [c[1], -c[0]],
    (c) => [-c[0], c[1]], (c) => [c[1], c[0]], (c) => [c[0], -c[1]], (c) => [-c[1], -c[0]],
  ];
  return T.map((f) => {
    const m = cells.map(f), x0 = Math.min(...m.map((c) => c[0])), y0 = Math.min(...m.map((c) => c[1]));
    return m.map((c) => `${c[0] - x0},${c[1] - y0}`).sort().join(";");
  }).sort()[0];
};

/** Sebelas jaring-jaring kubus (kolom, baris). Dikelompokkan menurut pola baris: 1-4-1 (6), 2-3-1 (3), 2-2-2 (1), 3-3 (1). */
export const CUBE_NETS: { name: string; group: string; cells: Cell[] }[] = [
  { group: "1-4-1", name: "1", cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]] },
  { group: "1-4-1", name: "2", cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]] },
  { group: "1-4-1", name: "3", cells: [[2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]] },
  { group: "1-4-1", name: "4", cells: [[3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]] },
  { group: "1-4-1", name: "5", cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] },
  { group: "1-4-1", name: "6", cells: [[2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] },
  { group: "2-3-1", name: "7", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [1, 2]] },
  { group: "2-3-1", name: "8", cells: [[2, 0], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2]] },
  { group: "2-3-1", name: "9", cells: [[2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [0, 2]] },
  { group: "2-2-2", name: "10", cells: [[2, 0], [1, 1], [2, 1], [0, 2], [1, 2], [0, 3]] },
  { group: "3-3", name: "11", cells: [[2, 0], [3, 0], [4, 0], [0, 1], [1, 1], [2, 1]] },
];

/** Nomor (0..10) jaring kubus yang sama bentuknya dengan `cells`, atau −1. */
export const netIndex = (cells: Cell[]) => CUBE_NETS.findIndex((n) => canonCells(n.cells) === canonCells(cells));

/** Warna sisi kubus: sisi berhadapan sama warna (z biru, y jingga, x hijau-toska). */
export const PAIR = [C.blue, C.orange, C.teal];
export const cubeCol = (face: number) => (face < 0 ? C.soft : PAIR[face >> 1]);

/** Jaring balok p × l × t yang mengikuti bentuk salah satu jaring kubus (yang sah). */
export function boxNetFromCells(p: number, l: number, t: number, cells: Cell[], col: (boxFace: number) => string): NetFace[] {
  const cn = cellNet(cells, () => C.soft);
  if (!cn.ok) return [];
  // sisi kubus = sumbu*2 + (normal dalam > 0); sumbu 0 = x, 1 = y, 2 = z. Normal dalam +z berarti sisi keluar −z = alas (0).
  const toBox = (f: number) => [4, 2, 0][f >> 1] + (f & 1 ? 0 : 1);
  const tree = cn.tree.map(([a, b]) => [toBox(cn.face[a]), toBox(cn.face[b])] as [number, number]);
  return netFromSolid(boxSolid(p, l, t), toBox(cn.face[cn.root]), tree, col);
}

/* ═════════ Adegan dan proyeksi ═════════ */
export type F3 = {
  p: V3[]; col: string;
  a?: number;            // kepekatan isi (default 0,92)
  cull?: boolean;        // sembunyikan bila membelakangi kamera
  ghost?: boolean;       // bila membelakangi: hanya garis putus-putus (kerangka tembus pandang)
  grid?: number;         // ukuran kotak satuan pada sisi jajar genjang
  stroke?: string; sw?: number; dash?: number;
  lab?: string; labCol?: string;
};
export type E3 = { a: V3; b: V3; col: string; w?: number; dash?: number };
export type D3 = { p: V3; col: string; r?: number };
export type L3 = { p: V3; text: string; col?: string; dx?: number; dy?: number };
export type Scene = { faces: F3[]; edges?: E3[]; dots?: D3[]; labels?: L3[]; center?: V3 };

export type PFace = { x: number[]; y: number[]; fill: string; a: number; stroke: string; sw: number; dash: number };
export type PEdge = { x: number[]; y: number[]; stroke: string; sw: number; dash: number };
export type Proj = {
  faces: PFace[]; grid: number[][]; edges: PEdge[];
  dots: { x: number; y: number; col: string; r: number }[];
  labels: { x: number; y: number; text: string; col: string }[];
};
export type ViewState = { yaw: number; pitch: number; sc: number; cen: V3; sx: number; sy: number; upx: number; upy: number };

const hex = (h: string): [number, number, number] => {
  const k = h.replace("#", "");
  return [parseInt(k.slice(0, 2), 16), parseInt(k.slice(2, 4), 16), parseInt(k.slice(4, 6), 16)];
};
const shadeCache = new Map<string, string>();
/** Warna dasar dengan terang k (0..1); k = 1 paling terang. */
const shade = (c: string, k: number) => {
  const key = `${c}|${Math.round(k * 50)}`;
  let r = shadeCache.get(key);
  if (!r) {
    const [R, G, Bl] = hex(c), q = Math.round(k * 50) / 50, m = (v: number) => Math.round(v * q + 255 * (1 - q) * 0.22);
    r = `rgb(${m(R)},${m(G)},${m(Bl)})`;
    shadeCache.set(key, r);
  }
  return r;
};
const LIGHT = unit([-0.45, 0.6, 0.66]);

/** Proyeksi ortografis: sumbu z ke atas; kamera di sisi −y, diputar `yaw`, dinaikkan `pitch`. */
export function projectScene(S: Scene, v: ViewState): Proj {
  const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
  const P3 = (p: V3): [number, number, number] => {
    const x = p[0] - v.cen[0], y = p[1] - v.cen[1], z = p[2] - v.cen[2];
    const x1 = x * cy - y * sy, y1 = x * sy + y * cy;
    return [x1, y1 * sp + z * cp, -y1 * cp + z * sp];
  };
  const out: Proj = { faces: [], grid: [], edges: [], dots: [], labels: [] };
  const ranked: { depth: number; f: PFace }[] = [];
  S.faces.forEach((f) => {
    const n = normalOf(f.p);
    const nx1 = n[0] * cy - n[1] * sy, ny1 = n[0] * sy + n[1] * cy;
    const nv: V3 = [nx1, ny1 * sp + n[2] * cp, -ny1 * cp + n[2] * sp];
    const front = nv[2] > 1e-6;
    if (f.cull && !front && !f.ghost) return;
    const Q = f.p.map(P3);
    const pts = Q.map((q) => [v.sx + q[0] * v.sc, v.sy + q[1] * v.sc]);
    const depth = Q.reduce((s, q) => s + q[2], 0) / Q.length;
    let pf: PFace;
    if (f.ghost && !front) {
      pf = { x: pts.map((q) => q[0]), y: pts.map((q) => q[1]), fill: "#ffffff", a: 0, stroke: "#94a3b8", sw: 1.25, dash: 3 };
    } else {
      const d = Math.max(0, dotv(nv, LIGHT)), k = 0.72 + 0.28 * (f.cull ? d : Math.abs(dotv(nv, LIGHT)));
      pf = {
        x: pts.map((q) => q[0]), y: pts.map((q) => q[1]), fill: shade(f.col, k), a: f.a ?? 0.92,
        stroke: f.stroke ?? "#0f172a", sw: f.sw ?? 1.5, dash: f.dash ?? 0,
      };
      if (f.grid && f.p.length === 4) {
        const nu = Math.max(1, Math.round(len3(sub(f.p[1], f.p[0])) / f.grid)), nvv = Math.max(1, Math.round(len3(sub(f.p[3], f.p[0])) / f.grid));
        const u = sub(f.p[1], f.p[0]), w = sub(f.p[3], f.p[0]);
        const seg = (a: V3, b: V3) => { const A = P3(a), B = P3(b); out.grid.push([v.sx + A[0] * v.sc, v.sy + A[1] * v.sc, v.sx + B[0] * v.sc, v.sy + B[1] * v.sc]); };
        for (let i = 1; i < nu; i++) seg(addv(f.p[0], mul(u, i / nu)), addv(f.p[3], mul(u, i / nu)));
        for (let j = 1; j < nvv; j++) seg(addv(f.p[0], mul(w, j / nvv)), addv(f.p[1], mul(w, j / nvv)));
      }
      if (f.lab) {
        const c = pts.reduce((s, q) => [s[0] + q[0] / pts.length, s[1] + q[1] / pts.length], [0, 0]);
        out.labels.push({ x: c[0], y: c[1], text: f.lab, col: f.labCol ?? "#0f172a" });
      }
    }
    ranked.push({ depth, f: pf });
  });
  ranked.sort((a, b) => a.depth - b.depth);
  out.faces = ranked.map((r) => r.f);
  (S.edges ?? []).forEach((e) => {
    const A = P3(e.a), B = P3(e.b);
    out.edges.push({ x: [v.sx + A[0] * v.sc, v.sx + B[0] * v.sc], y: [v.sy + A[1] * v.sc, v.sy + B[1] * v.sc], stroke: e.col, sw: e.w ?? 3, dash: e.dash ?? 0 });
  });
  (S.dots ?? []).forEach((d) => { const A = P3(d.p); out.dots.push({ x: v.sx + A[0] * v.sc, y: v.sy + A[1] * v.sc, col: d.col, r: d.r ?? 5 }); });
  (S.labels ?? []).forEach((l) => {
    const A = P3(l.p);
    out.labels.push({ x: v.sx + A[0] * v.sc + (l.dx ?? 0) * v.upx, y: v.sy + A[1] * v.sc + (l.dy ?? 0) * v.upy, text: l.text, col: l.col ?? "#0f172a" });
  });
  return out;
}

/** Pusat dan jari-jari bola pembatas adegan. */
export function sceneBounds(S: Scene): { cen: V3; R: number } {
  const pts: V3[] = [...S.faces.flatMap((f) => f.p), ...(S.edges ?? []).flatMap((e) => [e.a, e.b])];
  let lo: V3 = [Infinity, Infinity, Infinity], hi: V3 = [-Infinity, -Infinity, -Infinity];
  pts.forEach((p) => { lo = [Math.min(lo[0], p[0]), Math.min(lo[1], p[1]), Math.min(lo[2], p[2])]; hi = [Math.max(hi[0], p[0]), Math.max(hi[1], p[1]), Math.max(hi[2], p[2])]; });
  const cen: V3 = S.center ?? [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
  const R = Math.max(1e-6, ...pts.map((p) => len3(sub(p, cen))));
  return { cen, R };
}

/* ═════════ Penggambar: kolam kurva JSXGraph ═════════ */
export type ViewOpts<P> = {
  scene: (p: P, clock: number) => Scene;
  yaw?: number; pitch?: number;           // derajat (awal)
  /** Skala tetap (satuan papan per satuan dunia). Bila kosong: pas otomatis dengan papan. */
  sc?: number | ((p: P) => number);
  fill?: number;                          // porsi papan yang dipakai saat pas otomatis (default 0,86)
  maxScale?: number;                      // batas atas skala pas otomatis
  /** Tingkat lipatan 0..1; saat ≈ 0 kamera menengok tegak lurus dari atas, seperti gambar jaring datar. */
  flat?: (p: P, clock: number) => number;
  auto?: (p: P) => boolean;               // putar sendiri
  live?: boolean;                         // adegan bergantung pada jam (animasi), hitung ulang tiap frame
  drag?: boolean;                         // seret untuk memutar (default true)
  maxFaces?: number; maxEdges?: number; maxDots?: number; maxLabels?: number; maxGrid?: number;
  shift?: Vec;
};

const paint = (c: any, fill: string | null, fa: number, stroke: string, sw: number, dash: number) => {
  const n = c.rendNode;
  if (!n) return;
  n.setAttribute("fill", fill ?? "none");
  n.setAttribute("fill-opacity", String(fa));
  n.setAttribute("stroke", stroke);
  n.setAttribute("stroke-width", String(sw));
  n.setAttribute("stroke-linejoin", "round");
  n.setAttribute("stroke-linecap", "round");
  if (dash) n.setAttribute("stroke-dasharray", `${dash * 3.5},${dash * 3}`); else n.removeAttribute("stroke-dasharray");
};
const NOPE = [NaN];

export function view3<P extends object>(b: B, get: () => P, clock: () => number, o: ViewOpts<P>) {
  const V = { yaw: ((o.yaw ?? -35) * Math.PI) / 180, pitch: ((o.pitch ?? 26) * Math.PI) / 180 };
  const NF = o.maxFaces ?? 12, NE = o.maxEdges ?? 14, ND = o.maxDots ?? 10, NL = o.maxLabels ?? 8, NG = o.maxGrid ?? 1;
  let memo: { key: unknown[]; val: Proj } | null = null;

  const P = (): Proj => {
    const p = get(), c = clock(), autoOn = !!o.auto?.(p);
    const key = [p, V.yaw, V.pitch, autoOn || o.live ? c : 0];
    if (memo && memo.key.every((x, i) => x === key[i])) return memo.val;
    const S = o.scene(p, c);
    const { cen, R } = sceneBounds(S);
    const bb: number[] = b.getBoundingBox ? b.getBoundingBox() : [-8, 5, 8, -5];
    const hw = (bb[2] - bb[0]) / 2, hh = (bb[1] - bb[3]) / 2;
    const fit = ((o.fill ?? 0.9) * Math.min(hw, hh)) / R;
    const sc = typeof o.sc === "function" ? o.sc(p) : o.sc !== undefined ? o.sc : Math.min(fit, o.maxScale ?? 6);
    const w = o.flat ? smooth(o.flat(p, c) / 0.4) : 1;
    const yaw = (V.yaw + (autoOn ? c * 0.5 : 0)) * w;
    const pitch = Math.PI / 2 + (V.pitch - Math.PI / 2) * w;
    const val = projectScene(S, {
      yaw, pitch, sc, cen, sx: (bb[0] + bb[2]) / 2 + (o.shift?.[0] ?? 0), sy: (bb[1] + bb[3]) / 2 + (o.shift?.[1] ?? 0),
      upx: 1 / (b.unitX || 40), upy: 1 / (b.unitY || b.unitX || 40),
    });
    memo = { key, val };
    return val;
  };

  const curve = (upd: (c: any) => void) => {
    const c = mk(b, "curve", [[0], [0]], { ...still, strokeColor: "#0f172a", strokeWidth: 1.5, fillColor: "#94a3b8", fillOpacity: 0.5 });
    c.updateDataArray = () => upd(c);
    return c;
  };
  const poly = (c: any, x: number[], y: number[], closed: boolean) => {
    c.dataX = closed ? [...x, x[0]] : x; c.dataY = closed ? [...y, y[0]] : y;
  };
  const hide = (c: any) => { c.dataX = NOPE; c.dataY = NOPE; };

  for (let i = 0; i < NF; i++) {
    curve((c) => {
      // sisi diurut jauh → dekat; bila lebih dari NF, yang terjauh dibuang
      const L = P().faces, f = L[Math.max(0, L.length - NF) + i];
      if (!f || i >= L.length) { hide(c); return; }
      poly(c, f.x, f.y, true);
      paint(c, f.fill, f.a, f.stroke, f.sw, f.dash);
    });
  }
  for (let g = 0; g < NG; g++) {
    curve((c) => {
      const L = P().grid;
      if (!L.length) { hide(c); return; }
      const xs: number[] = [], ys: number[] = [];
      L.forEach((s, i) => { if (i) { xs.push(NaN); ys.push(NaN); } xs.push(s[0], s[2]); ys.push(s[1], s[3]); });
      poly(c, xs, ys, false);
      paint(c, null, 0, "#0f172a", 1, 0);
      c.rendNode?.setAttribute("stroke-opacity", "0.5");
    });
  }
  for (let i = 0; i < NE; i++) {
    curve((c) => {
      const e = P().edges[i];
      if (!e) { hide(c); return; }
      poly(c, e.x, e.y, false);
      paint(c, null, 0, e.stroke, e.sw, e.dash);
    });
  }
  for (let i = 0; i < ND; i++) {
    curve((c) => {
      const d = P().dots[i];
      if (!d) { hide(c); return; }
      const rx = d.r / (b.unitX || 40), ry = d.r / (b.unitY || b.unitX || 40);
      const xs: number[] = [], ys: number[] = [];
      for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; xs.push(d.x + rx * Math.cos(a)); ys.push(d.y + ry * Math.sin(a)); }
      poly(c, xs, ys, true);
      paint(c, d.col, 1, "#ffffff", 1.5, 0);
    });
  }
  for (let i = 0; i < NL; i++) {
    const t = mk(b, "text", [() => P().labels[i]?.x ?? OFF[0], () => P().labels[i]?.y ?? OFF[1], () => P().labels[i]?.text ?? ""], {
      ...still, fontSize: 15, anchorX: "middle", anchorY: "middle",
      cssStyle: "font-weight:700;white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;pointer-events:none;",
    });
    const orig = t.update?.bind(t);
    if (orig) {
      t.update = function (...a: unknown[]) {
        const r = orig(...a);
        const n = t.rendNode, l = P().labels[i];
        if (n && l) { n.style.color = l.col; n.setAttribute("fill", l.col); }
        return r;
      };
    }
  }

  if (o.drag !== false) {
    const root: any = b.renderer?.svgRoot ?? b.containerObj;
    if (root?.addEventListener) {
      let d: { x: number; y: number; yaw: number; pitch: number; id: number } | null = null;
      root.addEventListener("pointerdown", (e: PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        d = { x: e.clientX, y: e.clientY, yaw: V.yaw, pitch: V.pitch, id: e.pointerId };
        try { root.setPointerCapture?.(e.pointerId); } catch { /* abaikan */ }
      });
      root.addEventListener("pointermove", (e: PointerEvent) => {
        if (!d || e.pointerId !== d.id) return;
        V.yaw = d.yaw + (e.clientX - d.x) * 0.009;
        V.pitch = Math.max(-1.2, Math.min(1.5, d.pitch + (e.clientY - d.y) * 0.006));
        b.update();
      });
      const end = (e: PointerEvent) => { if (d && e.pointerId === d.id) d = null; };
      root.addEventListener("pointerup", end);
      root.addEventListener("pointercancel", end);
      root.style.cursor = "grab";
    }
  }
}

/* ═════════ Pembantu adegan ═════════ */
export const shift3 = (P: V3[], d: V3): V3[] => P.map((p) => addv(p, d));
/** Warna sisi balok: z (alas, atas) toska, y (depan, belakang) jingga, x (kiri, kanan) biru. */
export const boxCol = (i: number) => [PAIR[2], PAIR[2], PAIR[1], PAIR[1], PAIR[0], PAIR[0]][i];

export function solidFaces(s: Solid, col: (i: number) => string, o: Partial<F3> & { at?: V3 } = {}): F3[] {
  const { at, ...rest } = o;
  return orient(s).F.map((f, i) => ({ p: shift3(f.map((k) => s.V[k]), at ?? [0, 0, 0]), col: col(i), ...rest }));
}
export function solidEdges(s: Solid, col: string, w = 2.5, at: V3 = [0, 0, 0], dash = 0): E3[] {
  return edgesOf(s).map(([i, j]) => ({ a: addv(s.V[i], at), b: addv(s.V[j], at), col, w, dash }));
}
/** Balok p×l×t dengan sudut di `at`. */
export const boxFaces = (p: number, l: number, t: number, o: Partial<F3> & { at?: V3; cols?: (i: number) => string; labs?: (string | undefined)[] } = {}): F3[] => {
  const { cols, labs, ...rest } = o;
  return solidFaces(boxSolid(p, l, t), cols ?? boxCol, rest).map((f, i) => ({ ...f, lab: labs?.[i] ?? f.lab }));
};
export const boxEdges = (p: number, l: number, t: number, col: string, w = 2.5, at: V3 = [0, 0, 0], dash = 0): E3[] => solidEdges(boxSolid(p, l, t), col, w, at, dash);

/** Adegan dari jaring pada tingkat lipatan t. */
export const netScene = (net: NetFace[], t: number, o: { a?: number; labs?: (string | undefined)[]; labCol?: string; bad?: boolean[]; neutral?: boolean } = {}): Scene => ({
  faces: foldNet(net, t).map((p, i) => ({
    p, col: o.bad?.[i] ? C.red : o.neutral ? "#94a3b8" : net[i].col, a: o.a ?? 0.95, lab: o.labs?.[i], labCol: o.labCol, sw: 1.75,
  })),
});
