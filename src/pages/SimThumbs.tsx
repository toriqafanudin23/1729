import type { ReactNode } from "react";

/* Gambar kecil untuk kartu katalog simulasi: SVG statis dan ringan, satu
   gambar per topik, dengan gaya yang sama seperti katalog Slides.
   Gambar dipilih lewat kata kunci pada slug/judul; bila tak ada yang cocok,
   dipakai kisi dengan simbol topik (glyph). */

const GRID_X = [40, 80, 120, 160, 200, 240, 280];
const GRID_Y = [20, 60, 100, 140];
const INK = "#0f172a", SOFT = "#94a3b8", BLUE = "#1565c0", ORANGE = "#e65100";
const VIOLET = "#6557d2", TEAL = "#0f766e", RED = "#b3261e";

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" className="sp-thumb" role="img" aria-label={label}>
      <g stroke="#e2e8f0" strokeWidth="1">
        {GRID_X.map((x) => <line key={`x${x}`} x1={x} y1="0" x2={x} y2="180" />)}
        {GRID_Y.map((y) => <line key={`y${y}`} x1="0" y1={y} x2="320" y2={y} />)}
      </g>
      {children}
    </svg>
  );
}
const Axes = ({ x = 160, y = 90 }: { x?: number; y?: number }) => (
  <g stroke={SOFT} strokeWidth="1.25">
    <line x1="0" y1={y} x2="320" y2={y} />
    <line x1={x} y1="0" x2={x} y2="180" />
  </g>
);
const Dot = ({ x, y, c = INK, r = 4.5 }: { x: number; y: number; c?: string; r?: number }) => (
  <circle cx={x} cy={y} r={r} fill={c} stroke="#fff" strokeWidth="1.5" />
);
const curve = (f: (t: number) => [number, number], a: number, b: number, n = 48) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const [x, y] = f(a + ((b - a) * i) / n);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

/* ───────── Aljabar & fungsi ───────── */
function Quadratic() {
  const d = curve((x) => [160 + x * 46, 40 + x * x * 22], -2, 2, 40);
  return (
    <Frame label="Parabola dengan titik puncak, sumbu simetri, dan dua akar">
      <Axes y={60} />
      <line x1="160" y1="10" x2="160" y2="170" stroke={RED} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d={d} fill="none" stroke={INK} strokeWidth="2.75" strokeLinecap="round" />
      <Dot x={160} y={40} c={TEAL} r={5.5} />
      <Dot x={114} y={60} c={ORANGE} />
      <Dot x={206} y={60} c={ORANGE} />
    </Frame>
  );
}

function FnTransform() {
  const X = (x: number) => 160 + x * 38, Y = (y: number) => 150 - y * 38;
  const base = curve((x) => [X(x), Y(x * x)], -1.9, 1.9, 38);
  const moved = curve((x) => [X(x), Y(0.6 * (x - 1.2) ** 2 + 1)], -0.6, 3.0, 36);
  return (
    <Frame label="Parabola asal bergeser dan melebar menjadi parabola baru">
      <Axes y={150} />
      <path d={base} fill="none" stroke={SOFT} strokeWidth="2" strokeDasharray="5 4" />
      <path d={moved} fill="none" stroke={ORANGE} strokeWidth="2.75" strokeLinecap="round" />
      <Dot x={X(0)} y={Y(0)} c={INK} />
      <Dot x={X(1.2)} y={Y(1)} c={ORANGE} r={5} />
      <line x1={X(0)} y1={Y(0)} x2={X(1.2)} y2={Y(1)} stroke={VIOLET} strokeWidth="1.5" strokeDasharray="3 3" />
    </Frame>
  );
}

function Plotter() {
  const sin = curve((t) => [160 + t * 40, 90 - Math.sin(t) * 45], -3.7, 3.7, 70);
  const cub = curve((t) => [160 + t * 40, 90 - (0.22 * t ** 3 - 0.5 * t) * 30], -2.9, 2.9, 60);
  return (
    <Frame label="Beberapa grafik fungsi digambar pada bidang koordinat">
      <Axes />
      <path d={sin} fill="none" stroke={BLUE} strokeWidth="2.75" strokeLinecap="round" />
      <path d={cub} fill="none" stroke={ORANGE} strokeWidth="2.75" strokeLinecap="round" />
      <Dot x={160} y={90} c={INK} />
    </Frame>
  );
}

function LinearSystem() {
  return (
    <Frame label="Dua garis berpotongan pada satu titik penyelesaian">
      <Axes y={140} />
      <line x1="35" y1="35" x2="285" y2="155" stroke={BLUE} strokeWidth="2.75" />
      <line x1="40" y1="165" x2="280" y2="25" stroke={ORANGE} strokeWidth="2.75" />
      <Dot x={160} y={95} c={INK} r={6} />
    </Frame>
  );
}

/* ───────── Trigonometri & kalkulus ───────── */
function Trig() {
  const sin = curve((t) => [160 + t * 40, 90 - Math.sin(t) * 50], -3.6, 3.6, 72);
  const cos = curve((t) => [160 + t * 40, 90 - Math.cos(t) * 50], -3.6, 3.6, 72);
  const px = 160 + (Math.PI / 2) * 40;
  return (
    <Frame label="Grafik sinus dan kosinus pada bidang koordinat">
      <Axes />
      <path d={cos} fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
      <path d={sin} fill="none" stroke={INK} strokeWidth="2.75" strokeLinecap="round" />
      <line x1={px} y1="90" x2={px} y2="40" stroke={SOFT} strokeWidth="1.5" strokeDasharray="4 4" />
      <Dot x={px} y={40} c={INK} />
    </Frame>
  );
}

function Derivative() {
  const X = (x: number) => 160 + x * 38, Y = (y: number) => 150 - y * 38;
  const p = curve((x) => [X(x), Y(x * x)], -1.9, 1.9, 38);
  return (
    <Frame label="Garis potong pada parabola merapat menjadi garis singgung">
      <Axes y={150} />
      <path d={p} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={X(0.35)} y1={Y(-0.3)} x2={X(1.8)} y2={Y(2.6)} stroke={SOFT} strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={X(0.5)} y1={Y(-0.3)} x2={X(1.75)} y2={Y(2.95)} stroke={ORANGE} strokeWidth="2.25" />
      <Dot x={X(1)} y={Y(1)} />
      <Dot x={X(1.6)} y={Y(2.56)} c={ORANGE} />
    </Frame>
  );
}

function Integral() {
  const g = (u: number) => 0.9 + 0.8 * Math.sin(u * 1.1);
  const X = (u: number) => 40 + u * 80, Y = (v: number) => 150 - v * 50;
  const bars = Array.from({ length: 6 }, (_, i) => 0.4 + i * 0.4);
  return (
    <Frame label="Luas di bawah kurva didekati dengan batang-batang persegi panjang">
      <Axes x={40} y={150} />
      {bars.map((u) => (
        <rect key={u} x={X(u)} y={Y(g(u))} width={32} height={150 - Y(g(u))} fill="rgba(15,118,110,.18)" stroke={TEAL} strokeWidth="1.25" />
      ))}
      <path d={curve((u) => [X(u), Y(g(u))], 0, 3.2, 60)} fill="none" stroke={INK} strokeWidth="2.75" strokeLinecap="round" />
    </Frame>
  );
}

/* ───────── Geometri ───────── */
function Vector() {
  const O: [number, number] = [90, 138], A: [number, number] = [200, 118], B: [number, number] = [140, 56];
  const S: [number, number] = [A[0] + B[0] - O[0], A[1] + B[1] - O[1]];
  const head = ([x, y]: [number, number], [fx, fy]: [number, number], c: string) => {
    const a = Math.atan2(y - fy, x - fx), s = 11;
    const p = (da: number) => `${(x - s * Math.cos(a + da)).toFixed(1)},${(y - s * Math.sin(a + da)).toFixed(1)}`;
    return <polygon points={`${x},${y} ${p(0.4)} ${p(-0.4)}`} fill={c} />;
  };
  return (
    <Frame label="Dua vektor dijumlahkan dengan jajar genjang menjadi vektor resultan">
      <Axes x={90} y={138} />
      <g stroke={SOFT} strokeWidth="1.5" strokeDasharray="4 4">
        <line x1={A[0]} y1={A[1]} x2={S[0]} y2={S[1]} />
        <line x1={B[0]} y1={B[1]} x2={S[0]} y2={S[1]} />
      </g>
      <line x1={O[0]} y1={O[1]} x2={A[0]} y2={A[1]} stroke={BLUE} strokeWidth="2.75" />
      <line x1={O[0]} y1={O[1]} x2={B[0]} y2={B[1]} stroke={ORANGE} strokeWidth="2.75" />
      <line x1={O[0]} y1={O[1]} x2={S[0]} y2={S[1]} stroke={INK} strokeWidth="2.75" />
      {head(A, O, BLUE)}{head(B, O, ORANGE)}{head(S, O, INK)}
      <Dot x={O[0]} y={O[1]} />
    </Frame>
  );
}

function Conic() {
  const c = Math.sqrt(110 ** 2 - 60 ** 2), t = (50 * Math.PI) / 180;
  const P: [number, number] = [160 + 110 * Math.cos(t), 90 - 60 * Math.sin(t)];
  return (
    <Frame label="Elips dengan dua titik fokus dan jumlah jarak yang tetap">
      <Axes />
      <ellipse cx="160" cy="90" rx="110" ry="60" fill="rgba(101,87,210,.08)" stroke={INK} strokeWidth="2.75" />
      <line x1={160 - c} y1="90" x2={P[0]} y2={P[1]} stroke={BLUE} strokeWidth="2" />
      <line x1={160 + c} y1="90" x2={P[0]} y2={P[1]} stroke={BLUE} strokeWidth="2" />
      <Dot x={160 - c} y={90} c={ORANGE} />
      <Dot x={160 + c} y={90} c={ORANGE} />
      <Dot x={P[0]} y={P[1]} c={RED} r={5} />
    </Frame>
  );
}

function Circle() {
  return (
    <Frame label="Lingkaran dengan juring, jari-jari, busur, dan garis singgung">
      <Axes />
      <path d="M160 90 L230 90 A70 70 0 0 0 209.5 40.5 Z" fill="rgba(101,87,210,.16)" />
      <circle cx="160" cy="90" r="70" fill="none" stroke={INK} strokeWidth="2.75" />
      <line x1="160" y1="90" x2="209.5" y2="40.5" stroke={BLUE} strokeWidth="2.25" />
      <line x1="160" y1="90" x2="230" y2="90" stroke={BLUE} strokeWidth="2.25" />
      <path d="M230 90 A70 70 0 0 0 209.5 40.5" fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
      <line x1="170" y1="20" x2="250" y2="62" stroke={ORANGE} strokeWidth="2" strokeDasharray="5 4" />
      <Dot x={160} y={90} />
      <Dot x={209.5} y={40.5} c={RED} r={5} />
    </Frame>
  );
}

function TwoCircles() {
  const c1: [number, number] = [100, 90], c2: [number, number] = [232, 90], r1 = 52, r2 = 30;
  const nx = (r1 - r2) / (c2[0] - c1[0]), ny = Math.sqrt(1 - nx * nx);
  const line = (s: 1 | -1) => {
    const p1: [number, number] = [c1[0] + r1 * nx, c1[1] + s * -r1 * ny];
    const p2: [number, number] = [c2[0] + r2 * nx, c2[1] + s * -r2 * ny];
    const k = 0.45, dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    return (
      <g key={s}>
        <line x1={p1[0] - dx * k} y1={p1[1] - dy * k} x2={p2[0] + dx * k} y2={p2[1] + dy * k} stroke={ORANGE} strokeWidth="2.25" />
        <Dot x={p1[0]} y={p1[1]} c={RED} r={4} />
        <Dot x={p2[0]} y={p2[1]} c={RED} r={4} />
      </g>
    );
  };
  return (
    <Frame label="Dua lingkaran dengan garis singgung persekutuan luar">
      <Axes />
      <circle cx={c1[0]} cy={c1[1]} r={r1} fill="rgba(21,101,192,.08)" stroke={INK} strokeWidth="2.75" />
      <circle cx={c2[0]} cy={c2[1]} r={r2} fill="rgba(15,118,110,.1)" stroke={INK} strokeWidth="2.75" />
      <line x1={c1[0]} y1={c1[1]} x2={c2[0]} y2={c2[1]} stroke={SOFT} strokeWidth="1.5" strokeDasharray="4 4" />
      {line(1)}{line(-1)}
      <Dot x={c1[0]} y={c1[1]} />
      <Dot x={c2[0]} y={c2[1]} />
    </Frame>
  );
}

function Transform() {
  return (
    <Frame label="Segitiga diputar 90° mengelilingi sebuah titik pusat">
      <Axes y={130} />
      <path d="M225 130 A65 65 0 0 0 160 65" fill="none" stroke={SOFT} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M200 130 L260 130 L200 90 Z" fill="rgba(15,23,42,.06)" stroke={INK} strokeWidth="2.25" strokeLinejoin="round" />
      <path d="M160 90 L160 30 L120 90 Z" fill="rgba(230,81,0,.1)" stroke={ORANGE} strokeWidth="2.25" strokeLinejoin="round" />
      <Dot x={160} y={130} />
    </Frame>
  );
}

function TriangleCenters() {
  const A: [number, number] = [98, 140], B: [number, number] = [222, 140], C: [number, number] = [176, 38];
  const dist = (p: [number, number], q: [number, number]) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const a = dist(B, C), b = dist(A, C), c = dist(A, B), per = a + b + c;
  const G: [number, number] = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  const I: [number, number] = [(a * A[0] + b * B[0] + c * C[0]) / per, (a * A[1] + b * B[1] + c * C[1]) / per];
  const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const sq = (p: [number, number]) => p[0] * p[0] + p[1] * p[1];
  const O: [number, number] = [
    (sq(A) * (B[1] - C[1]) + sq(B) * (C[1] - A[1]) + sq(C) * (A[1] - B[1])) / d,
    (sq(A) * (C[0] - B[0]) + sq(B) * (A[0] - C[0]) + sq(C) * (B[0] - A[0])) / d,
  ];
  const H: [number, number] = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
  const R = dist(O, A);
  const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
  const r = (2 * area) / per;
  return (
    <Frame label="Segitiga dengan titik berat, titik pusat lingkaran dalam, lingkaran luar, dan titik tinggi">
      <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke={BLUE} strokeWidth="1.5" strokeDasharray="5 4" />
      <circle cx={I[0]} cy={I[1]} r={r} fill="rgba(15,118,110,.1)" stroke={TEAL} strokeWidth="1.75" />
      <line x1={H[0]} y1={H[1]} x2={O[0]} y2={O[1]} stroke={SOFT} strokeWidth="1.5" strokeDasharray="3 3" />
      <path d={`M${A} L${B} L${C} Z`} fill="rgba(15,23,42,.05)" stroke={INK} strokeWidth="2.75" strokeLinejoin="round" />
      <Dot x={G[0]} y={G[1]} c={ORANGE} r={5} />
      <Dot x={I[0]} y={I[1]} c={TEAL} r={5} />
      <Dot x={O[0]} y={O[1]} c={BLUE} r={5} />
      <Dot x={H[0]} y={H[1]} c={RED} r={5} />
    </Frame>
  );
}

function Pythagoras() {
  const sqPts = (pts: [number, number][]) => pts.map((p) => p.join(",")).join(" ");
  const label = (x: number, y: number, t: string, c: string) => (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="15" fontWeight="600" fill={c}>
      {t}
    </text>
  );
  return (
    <Frame label="Segitiga siku-siku dengan persegi pada tiap sisinya: luas persegi miring sama dengan jumlah dua persegi lainnya">
      <polygon points={sqPts([[130, 110], [190, 110], [190, 170], [130, 170]])} fill="rgba(21,101,192,.16)" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
      <polygon points={sqPts([[130, 65], [130, 110], [85, 110], [85, 65]])} fill="rgba(230,81,0,.14)" stroke={ORANGE} strokeWidth="2" strokeLinejoin="round" />
      <polygon points={sqPts([[130, 65], [190, 110], [235, 50], [175, 5]])} fill="rgba(15,118,110,.16)" stroke={TEAL} strokeWidth="2" strokeLinejoin="round" />
      <polygon points="130,65 190,110 130,110" fill="rgba(15,23,42,.06)" stroke={INK} strokeWidth="2.75" strokeLinejoin="round" />
      <path d="M130 100 L140 100 L140 110" fill="none" stroke={INK} strokeWidth="1.5" />
      {label(160, 140, "a²", BLUE)}
      {label(107.5, 87.5, "b²", ORANGE)}
      {label(182.5, 57.5, "c²", TEAL)}
    </Frame>
  );
}

/* ───────── Pemilih gambar ───────── */
const PICKS: [RegExp, () => ReactNode][] = [
  [/pythagoras|phytagoras|pitagoras|teorema[- ]phyt/, Pythagoras],
  [/titik[- ]istimewa|garis[- ]istimewa|segitiga|centroid|sentroid|ortosentrum|lingkaran[- ](luar|dalam)/, TriangleCenters],
  [/dua[- ]lingkaran|persekutuan/, TwoCircles],
  [/transformasi[- ]fungsi|pergeseran|fungsi[- ]transformasi/, FnTransform],
  [/transformasi|refleksi|rotasi|dilatasi|translasi/, Transform],
  [/kuadrat|parabola/, Quadratic],
  [/trigonometri|sinus|kosinus|sin[- ]cos/, Trig],
  [/turunan|limit|diferensial|kalkulus/, Derivative],
  [/integral/, Integral],
  [/vektor/, Vector],
  [/irisan|kerucut|elips|hiperbola/, Conic],
  [/lingkaran|busur|juring/, Circle],
  [/sistem|spldv|spltv|linear/, LinearSystem],
  [/grafik|plot|penggambar/, Plotter],
];

export function SimThumb({ slug, title, glyph }: { slug: string; title: string; glyph: string }) {
  const key = `${slug} ${title}`.toLowerCase();
  const hit = PICKS.find(([re]) => re.test(key));
  if (hit) return <>{hit[1]()}</>;

  const size = glyph.length > 8 ? 30 : glyph.length > 4 ? 44 : 72;
  return (
    <Frame label={title}>
      <Axes />
      <text
        x="160" y="90" textAnchor="middle" dominantBaseline="central" fontSize={size}
        className="sp-thumb__glyph" stroke="#f8fafc" strokeWidth="8" paintOrder="stroke"
      >
        {glyph}
      </text>
    </Frame>
  );
}
