/* ------------------------------------------------------------------ *
 *  Matematika bangun ruang sisi datar (prisma dan limas) tanpa three.js.
 *
 *  Satu rumusan untuk kubus, balok, prisma, dan limas:
 *    - alas berupa poligon cembung di bidang y = 0 (koordinat (x, z)),
 *    - prisma: tutup kongruen di y = tinggi,
 *    - limas : titik puncak di atas titik `apex` (bawaan: titik berat alas).
 *  Jaring-jaring dibentuk dari alas dengan "engsel" pada tiap rusuk alas.
 *  Kubus dan balok adalah prisma beralas persegi atau persegi panjang.
 *
 *  Berkas ini murni TypeScript supaya mudah diuji (scripts/check-materi.mjs).
 * ------------------------------------------------------------------ */

export type V2 = [number, number];
export type V3 = [number, number, number];

export interface SolidSpec {
  kind: "prisma" | "limas";
  /** Alas: poligon cembung (x, z). Urutan titik bebas; fungsi di bawah merapikannya. */
  base: V2[];
  height: number;
  /** Proyeksi puncak limas pada alas (bawaan: titik berat). */
  apex?: V2;
}

const EPS = 1e-9;

export function signedArea(p: V2[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, z1] = p[i];
    const [x2, z2] = p[(i + 1) % p.length];
    s += x1 * z2 - x2 * z1;
  }
  return s / 2;
}

export const area = (p: V2[]) => Math.abs(signedArea(p));

/** Urutan berlawanan arah jarum jam (pada bidang x-z dengan x ke kanan, z ke atas). */
export function ccw(p: V2[]): V2[] {
  return signedArea(p) >= 0 ? p.slice() : p.slice().reverse();
}

export function centroid(p: V2[]): V2 {
  // Titik berat luas poligon.
  const a = signedArea(p);
  if (Math.abs(a) < EPS) {
    const n = p.length;
    return [p.reduce((s, q) => s + q[0], 0) / n, p.reduce((s, q) => s + q[1], 0) / n];
  }
  let cx = 0;
  let cz = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, z1] = p[i];
    const [x2, z2] = p[(i + 1) % p.length];
    const f = x1 * z2 - x2 * z1;
    cx += (x1 + x2) * f;
    cz += (z1 + z2) * f;
  }
  return [cx / (6 * a), cz / (6 * a)];
}

export function perimeter(p: V2[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) s += Math.hypot(p[(i + 1) % p.length][0] - p[i][0], p[(i + 1) % p.length][1] - p[i][1]);
  return s;
}

/** Kerangka tiap rusuk alas: titik awal, arah sepanjang rusuk (e), arah ke luar alas (w). */
export interface EdgeFrame {
  p: V2;
  q: V2;
  e: V2;
  w: V2;
  len: number;
}

export function edgeFrames(base: V2[]): EdgeFrame[] {
  const poly = ccw(base);
  return poly.map((p, k) => {
    const q = poly[(k + 1) % poly.length];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const e: V2 = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
    const w: V2 = [e[1], -e[0]]; // ke luar untuk poligon berlawanan arah jarum jam
    return { p, q, e, w, len };
  });
}

/** Koordinat titik (x, z) dalam kerangka engsel: (sepanjang rusuk, ke luar). */
export function toLocal(f: EdgeFrame, pt: V2): V2 {
  const dx = pt[0] - f.p[0];
  const dz = pt[1] - f.p[1];
  return [dx * f.e[0] + dz * f.e[1], dx * f.w[0] + dz * f.w[1]];
}

export interface LateralFace {
  /** Titik sudut bidang dalam kerangka engsel (rata). */
  local: V2[];
  /** Sudut lipat akhir (radian): 0 = rata, π/2 = tegak. */
  finalAngle: number;
  /** Luas bidang. */
  area: number;
  /** Tinggi sisi tegak (jarak puncak ke rusuk) untuk limas; panjang tinggi untuk prisma. */
  slant: number;
}

export function lateralFace(spec: SolidSpec, k: number): LateralFace {
  const frames = edgeFrames(spec.base);
  const f = frames[k];
  if (spec.kind === "prisma") {
    const h = spec.height;
    return { local: [[0, 0], [f.len, 0], [f.len, h], [0, h]], finalAngle: Math.PI / 2, area: f.len * h, slant: h };
  }
  const apex = spec.apex ?? centroid(spec.base);
  const [u, zl] = toLocal(f, apex);
  const d = Math.max(0, -zl); // jarak ke rusuk, positif ke dalam alas
  const s = Math.hypot(d, spec.height);
  const phi = Math.atan2(spec.height, d); // sudut antara bidang tegak limas dan alas
  return { local: [[0, 0], [f.len, 0], [u, s]], finalAngle: Math.PI - phi, area: (f.len * s) / 2, slant: s };
}

/** Posisi titik pada bidang yang terengsel di rusuk k, setelah dilipat sebesar `angle`. */
export function hingePoint(f: EdgeFrame, local: V2, angle: number): V3 {
  const [x, z] = local;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [f.p[0] + x * f.e[0] + z * c * f.w[0], z * s, f.p[1] + x * f.e[1] + z * c * f.w[1]];
}

/** Titik pada tutup prisma (bertaut di rusuk k pada bidang tegak), dengan dua lipatan berurutan. */
export function topPoint(f: EdgeFrame, h: number, local: V2, angle: number, angle2: number): V3 {
  const [x, z] = local;
  const a = angle;
  const b = angle + angle2;
  return [
    f.p[0] + x * f.e[0] + (h * Math.cos(a) + z * Math.cos(b)) * f.w[0],
    h * Math.sin(a) + z * Math.sin(b),
    f.p[1] + x * f.e[1] + (h * Math.cos(a) + z * Math.cos(b)) * f.w[1],
  ];
}

/** Titik tutup dalam kerangka engsel tutup: (sepanjang rusuk, menjauhi rusuk). */
export function topLocal(spec: SolidSpec, hingeEdge: number): V2[] {
  const frames = edgeFrames(spec.base);
  const f = frames[hingeEdge];
  return ccw(spec.base).map((pt) => {
    const [x, z] = toLocal(f, pt);
    return [x, -z] as V2;
  });
}

/** Titik sudut bangun dalam keadaan utuh (terlipat penuh). */
export function foldedVertices(spec: SolidSpec): V3[] {
  const base = ccw(spec.base);
  const out: V3[] = base.map(([x, z]) => [x, 0, z]);
  if (spec.kind === "prisma") base.forEach(([x, z]) => out.push([x, spec.height, z]));
  else {
    const a = spec.apex ?? centroid(spec.base);
    out.push([a[0], spec.height, a[1]]);
  }
  return out;
}

/** Rusuk bangun utuh sebagai pasangan titik. */
export function foldedEdges(spec: SolidSpec): [V3, V3][] {
  const v = foldedVertices(spec);
  const n = ccw(spec.base).length;
  const edges: [V3, V3][] = [];
  for (let i = 0; i < n; i++) edges.push([v[i], v[(i + 1) % n]]);
  if (spec.kind === "prisma") {
    for (let i = 0; i < n; i++) edges.push([v[n + i], v[n + ((i + 1) % n)]]);
    for (let i = 0; i < n; i++) edges.push([v[i], v[n + i]]);
  } else {
    for (let i = 0; i < n; i++) edges.push([v[i], v[n]]);
  }
  return edges;
}

export interface FaceInfo {
  role: "alas" | "tutup" | "tegak";
  area: number;
  /** Banyak sudut bidang: 3 = segitiga, 4 = segiempat, dst. */
  sides: number;
}

export interface SolidFacts {
  faces: FaceInfo[];
  vertices: number;
  edges: number;
  baseArea: number;
  basePerimeter: number;
  lateralArea: number;
  surfaceArea: number;
  volume: number;
}

export function solidFacts(spec: SolidSpec): SolidFacts {
  const n = spec.base.length;
  const baseArea = area(spec.base);
  const lateral = Array.from({ length: n }, (_, k) => lateralFace(spec, k));
  const faces: FaceInfo[] = [{ role: "alas", area: baseArea, sides: n }];
  lateral.forEach((l) => faces.push({ role: "tegak", area: l.area, sides: l.local.length }));
  if (spec.kind === "prisma") faces.push({ role: "tutup", area: baseArea, sides: n });
  const lateralArea = lateral.reduce((s, l) => s + l.area, 0);
  return {
    faces,
    vertices: spec.kind === "prisma" ? 2 * n : n + 1,
    edges: spec.kind === "prisma" ? 3 * n : 2 * n,
    baseArea,
    basePerimeter: perimeter(spec.base),
    lateralArea,
    surfaceArea: baseArea * (spec.kind === "prisma" ? 2 : 1) + lateralArea,
    volume: spec.kind === "prisma" ? baseArea * spec.height : (baseArea * spec.height) / 3,
  };
}

/** Kotak pembatas bangun (utuh dan, bila `net`, juga keadaan rata) untuk membingkai kamera. */
export function bounds(spec: SolidSpec, net: boolean): { center: V3; radius: number } {
  const pts: V3[] = foldedVertices(spec);
  if (net) {
    const frames = edgeFrames(spec.base);
    frames.forEach((f, k) => {
      lateralFace(spec, k).local.forEach((l) => pts.push(hingePoint(f, l, 0)));
    });
    if (spec.kind === "prisma") {
      const f0 = frames[0];
      topLocal(spec, 0).forEach((l) => pts.push(topPoint(f0, spec.height, l, 0, 0)));
    }
  }
  const lo: V3 = [Infinity, Infinity, Infinity];
  const hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const p of pts) {
    for (let i = 0; i < 3; i++) {
      lo[i] = Math.min(lo[i], p[i]);
      hi[i] = Math.max(hi[i], p[i]);
    }
  }
  const center: V3 = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
  const radius = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / 2;
  return { center, radius };
}

/* ───────── Bentuk alas siap pakai ───────── */

export const rect = (p: number, l: number): V2[] => [[0, 0], [p, 0], [p, l], [0, l]];
export const rightTriangle = (a: number, b: number): V2[] => [[0, 0], [a, 0], [0, b]];
export const isoscelesTriangle = (a: number, t: number): V2[] => [[-a / 2, 0], [a / 2, 0], [0, t]];
export const isoscelesTrapezoid = (a: number, b: number, t: number): V2[] => [[-a / 2, 0], [a / 2, 0], [b / 2, t], [-b / 2, t]];
export const regularPolygon = (n: number, side: number): V2[] => {
  const r = side / (2 * Math.sin(Math.PI / n));
  return Array.from({ length: n }, (_, i) => {
    const t = (2 * Math.PI * i) / n;
    return [r * Math.cos(t), r * Math.sin(t)] as V2;
  });
};
