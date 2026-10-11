import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import JXG from "jsxgraph";
import "../styles/jsxgraph.css";
import "./TwoCircleTangentSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi dua lingkaran dan garis singgung persekutuannya — tema slate
   seperti landing page 1729. Urutan desain: ponsel lanskap → desktop →
   ponsel potret. Layar penuh: grafik 100% layar, toolbar dan panel pengatur
   mengambang.

   Lingkaran 1: pusat O₁(x₁, y₁), jari-jari r₁. Lingkaran 2: O₂(x₂, y₂), r₂.
   d = jarak kedua pusat.

   Garis singgung persekutuan ν·X = c (ν = vektor satuan normal) memenuhi
       ν·O₁ − c = s₁ r₁   dan   ν·O₂ − c = s₂ r₂,   s = ±1
   - luar  (s₁ = s₂):  ada bila d ≥ |r₁ − r₂|,  ℓ = √(d² − (r₁ − r₂)²)
   - dalam (s₁ = −s₂): ada bila d ≥ r₁ + r₂,    ℓ = √(d² − (r₁ + r₂)²)

   Mode "Proses": 4 langkah mencari ℓ lewat segitiga siku-siku bantu O₁PO₂.
   Garis dari O₂ sejajar T₁T₂ memotong O₁T₁ (atau perpanjangannya) di P.
   T₁T₂O₂P persegi panjang, jadi PO₂ = ℓ, T₁P = r₂, dan
   O₁P = |r₁ − r₂| (luar) atau r₁ + r₂ (dalam). */

/* ───────── Tipe ───────── */

type Vec = [number, number];
type Params = {
  x1: number;
  y1: number;
  r1: number;
  x2: number;
  y2: number;
  r2: number;
};
type Opts = {
  ext: boolean;
  int: boolean;
  points: boolean;
  rightAngle: boolean;
  lengths: boolean;
  rad: boolean;
  centerline: boolean;
  homothety: boolean;
  extend: boolean;
  fill: boolean;
};
type Tab = "set" | "proc" | "res";
/** Garis singgung yang ditampilkan: semua, atau tepat satu. */
type Focus = "all" | "ext-0" | "ext-1" | "int-0" | "int-1";
type Kind = "ext" | "int";
type Anim = "d" | null;
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};
/** Titik pusat yang bisa diseret. */
type DragPoint = {
  X: () => number;
  Y: () => number;
  setPosition: (method: number, coords: number[]) => unknown;
  on: (event: string, handler: () => void) => unknown;
};
type Tangent = {
  /** +1 = singgung luar, −1 = singgung dalam */
  s: 1 | -1;
  nx: number;
  ny: number;
  c: number;
  t1: Vec;
  t2: Vec;
};

/* ───────── Konstanta ───────── */

/** JXG.COORDS_BY_USER */
const COORDS_BY_USER = 1;
const X_LIM = 10;
const Y_LIM = 7;
const R_MIN = 0.5;
const R_MAX = 6;
const D_CAP = 20;
/** Toleransi (satuan jarak) untuk menganggap dua lingkaran bersinggungan. */
const EPS = 0.006;
const HOME_BOX: [number, number, number, number] = [-14, 10, 14, -10];
const STEP_COUNT = 4;

const DEFAULT_PARAMS: Params = { x1: -4, y1: -1, r1: 3, x2: 4, y2: 2, r2: 2 };
const DEFAULT_OPTS: Opts = {
  ext: true,
  int: true,
  points: true,
  rightAngle: true,
  lengths: true,
  rad: false,
  centerline: true,
  homothety: false,
  extend: true,
  fill: true,
};

/* Warna grafik: dipakai juga oleh legenda, slider, dan hasil di panel. */
const color = {
  c1: "#0d9488",
  c2: "#7c3aed",
  ext: "#2563eb",
  int: "#e11d48",
  guide: "#94a3b8",
  touch: "#0f172a",
  help: "#ca8a04",
  d: "#475569",
};

const FOCUS_OPTIONS: { key: Focus; label: string; color: string }[] = [
  { key: "all", label: "Semua", color: color.touch },
  { key: "ext-0", label: "Luar 1", color: color.ext },
  { key: "ext-1", label: "Luar 2", color: color.ext },
  { key: "int-0", label: "Dalam 1", color: color.int },
  { key: "int-1", label: "Dalam 2", color: color.int },
];
const FOCUS_NAME: Record<Focus, string> = {
  all: "Semua",
  "ext-0": "Luar 1",
  "ext-1": "Luar 2",
  "int-0": "Dalam 1",
  "int-1": "Dalam 2",
};

const PRESETS: { label: string; color: string; params: Params }[] = [
  {
    label: "Terpisah",
    color: color.c1,
    params: { x1: -4, y1: 0, r1: 3, x2: 3.5, y2: 0, r2: 2 },
  },
  {
    label: "Singgung luar",
    color: color.ext,
    params: { x1: -3, y1: 0, r1: 3, x2: 2, y2: 0, r2: 2 },
  },
  {
    label: "Berpotongan",
    color: color.c2,
    params: { x1: -2, y1: 0, r1: 3, x2: 2, y2: 0, r2: 2.5 },
  },
  {
    label: "Singgung dalam",
    color: color.int,
    params: { x1: -1, y1: 0, r1: 5, x2: 2, y2: 0, r2: 2 },
  },
];

const optionRows: { key: keyof Opts; label: string }[] = [
  { key: "ext", label: "Singgung luar" },
  { key: "int", label: "Singgung dalam" },
  { key: "points", label: "Titik singgung" },
  { key: "rightAngle", label: "Siku-siku" },
  { key: "lengths", label: "Panjang ℓ" },
  { key: "rad", label: "Jari-jari" },
  { key: "centerline", label: "Garis pusat" },
  { key: "homothety", label: "Titik E & I" },
  { key: "extend", label: "Perpanjang" },
  { key: "fill", label: "Warnai" },
];

/* ───────── Matematika ───────── */

/** Jarak terjauh sepanjang arah a dari (x, y) yang masih di dalam batas pusat. */
function rayMax(x: number, y: number, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  let t = D_CAP;
  if (c > 1e-9) t = Math.min(t, (X_LIM - x) / c);
  else if (c < -1e-9) t = Math.min(t, (-X_LIM - x) / c);
  if (s > 1e-9) t = Math.min(t, (Y_LIM - y) / s);
  else if (s < -1e-9) t = Math.min(t, (-Y_LIM - y) / s);
  return Math.max(0, t);
}

function analyze(p: Params) {
  const { x1, y1, r1, x2, y2, r2 } = p;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy);
  const sum = r1 + r2;
  const diff = Math.abs(r1 - r2);

  let relation: string;
  if (d <= 1e-3) relation = r1 === r2 ? "Berimpit" : "Sepusat (konsentris)";
  else if (d > sum + EPS) relation = "Saling lepas";
  else if (Math.abs(d - sum) <= EPS) relation = "Bersinggungan luar";
  else if (d > diff + EPS) relation = "Berpotongan di dua titik";
  else if (Math.abs(d - diff) <= EPS) relation = "Bersinggungan dalam";
  else relation = "Satu di dalam yang lain";

  const ext: Tangent[] = [];
  const inn: Tangent[] = [];
  const ux = d > 1e-9 ? dx / d : 1;
  const uy = d > 1e-9 ? dy / d : 0;
  if (d > 1e-3) {
    const nx = -uy;
    const ny = ux;
    const build = (out: Tangent[], s2: 1 | -1, bound: number) => {
      const gap = d - bound;
      if (gap < -EPS) return;
      const k = Math.min(1, Math.max(-1, (s2 * r2 - r1) / d));
      // tepat bersinggung: kedua garis menyatu menjadi satu
      const h = gap <= EPS ? 0 : Math.sqrt(Math.max(0, 1 - k * k));
      const signs = h === 0 ? [1] : [1, -1];
      signs.forEach((sg) => {
        let vx = k * ux + sg * h * nx;
        let vy = k * uy + sg * h * ny;
        const len = Math.hypot(vx, vy) || 1;
        vx /= len;
        vy /= len;
        out.push({
          s: s2,
          nx: vx,
          ny: vy,
          c: vx * x1 + vy * y1 - r1,
          t1: [x1 - r1 * vx, y1 - r1 * vy],
          t2: [x2 - s2 * r2 * vx, y2 - s2 * r2 * vy],
        });
      });
    };
    build(ext, 1, diff);
    build(inn, -1, sum);
  }

  const nan: Vec = [Number.NaN, Number.NaN];
  // pusat homotetis: titik potong garis singgung luar (E) dan dalam (I)
  const E: Vec =
    ext.length > 0 && diff > 1e-6
      ? [(r2 * x1 - r1 * x2) / (r2 - r1), (r2 * y1 - r1 * y2) / (r2 - r1)]
      : nan;
  const I: Vec =
    inn.length > 0
      ? [(r2 * x1 + r1 * x2) / sum, (r2 * y1 + r1 * y2) / sum]
      : nan;

  return {
    d,
    ux,
    uy,
    sum,
    diff,
    relation,
    ext,
    inn,
    count: ext.length + inn.length,
    lenExt: Math.sqrt(Math.max(0, d * d - diff * diff)),
    lenInt: Math.sqrt(Math.max(0, d * d - sum * sum)),
    E,
    I,
  };
}

type Analysis = ReturnType<typeof analyze>;

const listOfKind = (a: Analysis, kind: Kind) =>
  kind === "ext" ? a.ext : a.inn;

/** Garis singgung yang dijelaskan: pilihan fokus, atau yang pertama ada. */
function resolveTarget(
  a: Analysis,
  focus: Focus,
): { kind: Kind; i: number; t: Tangent } | null {
  if (focus === "all") {
    if (a.ext[0]) return { kind: "ext", i: 0, t: a.ext[0] };
    if (a.inn[0]) return { kind: "int", i: 0, t: a.inn[0] };
    return null;
  }
  const [kind, idx] = focus.split("-") as [Kind, string];
  const t = listOfKind(a, kind)[Number(idx)];
  return t ? { kind, i: Number(idx), t } : null;
}

/** Geometri segitiga bantu O₁PO₂ untuk satu garis singgung.
    P = O₁ − (r₁ − s·r₂)·ν. T₁T₂O₂P selalu persegi panjang. */
function helperGeometry(p: Params, t: Tangent) {
  const k = p.r1 - t.s * p.r2;
  const P: Vec = [p.x1 - k * t.nx, p.y1 - k * t.ny];
  return {
    P,
    O1: [p.x1, p.y1] as Vec,
    O2: [p.x2, p.y2] as Vec,
    leg: Math.abs(k),
  };
}

/** Titik-titik busur berpusat di (cx, cy): dari sudut a0 sepanjang span (derajat). */
function arcPoints(
  cx: number,
  cy: number,
  radius: number,
  a0Deg: number,
  spanDeg: number,
): Vec[] {
  const n = Math.max(24, Math.ceil(Math.abs(spanDeg) * 2));
  const out: Vec[] = [];
  for (let i = 0; i <= n; i += 1) {
    const a = ((a0Deg + (spanDeg * i) / n) * Math.PI) / 180;
    out.push([cx + radius * Math.cos(a), cy + radius * Math.sin(a)]);
  }
  return out;
}

/* ───────── Format ───────── */

function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < Math.pow(10, -digits) / 2) return "0";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digits,
    useGrouping: false,
  })
    .format(value)
    .replace("-", "−");
}

const fmtPt = (x: number, y: number) => `(${fmt(x)}; ${fmt(y)})`;

/** Menyusun suku "koef·simbol" menjadi teks dengan tanda yang rapi. */
function poly(terms: [number, string][]) {
  let out = "";
  terms.forEach(([coef, symbol]) => {
    if (Math.abs(coef) < 5e-3) return;
    const abs = Math.abs(coef);
    const body =
      symbol !== "" && Math.abs(abs - 1) < 5e-3
        ? symbol
        : `${fmt(abs)}${symbol}`;
    if (out === "") out = coef < 0 ? `−${body}` : body;
    else out += coef < 0 ? ` − ${body}` : ` + ${body}`;
  });
  return out === "" ? "0" : out;
}

/** (x − h)² dengan tanda yang rapi. */
function sq(variable: string, h: number) {
  if (Math.abs(h) < 5e-3) return `${variable}²`;
  return h > 0 ? `(${variable} − ${fmt(h)})²` : `(${variable} + ${fmt(-h)})²`;
}

const circleEq = (x: number, y: number, r: number) =>
  `${sq("x", x)} + ${sq("y", y)} = ${fmt(r * r)}`;

const lineEq = (t: Tangent) =>
  `${poly([
    [t.nx, "x"],
    [t.ny, "y"],
  ])} = ${fmt(t.c)}`;

const round3 = (v: number) => Math.round(v * 1000) / 1000;

/* ───────── Baris pengatur ───────── */

/** Tombol − / + yang bisa ditahan untuk mengubah nilai terus-menerus. */
function useHoldRepeat(onStep: (direction: 1 | -1) => void) {
  const stepRef = useRef(onStep);
  stepRef.current = onStep;
  const timers = useRef<{ delay?: number; repeat?: number }>({});

  const stop = () => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.repeat);
    timers.current = {};
  };

  useEffect(() => stop, []);

  return (direction: 1 | -1) => ({
    type: "button" as const,
    className: "tc-step",
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stop();
      stepRef.current(direction);
      timers.current.delay = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(
          () => stepRef.current(direction),
          60,
        );
      }, 400);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onBlur: stop,
    onContextMenu: (event: { preventDefault: () => void }) =>
      event.preventDefault(),
    // detail === 0 → aktivasi lewat keyboard
    onClick: (event: { detail: number }) => {
      if (event.detail === 0) stepRef.current(direction);
    },
  });
}

/** Satu baris:  r₁  −  ────●────  +  3  ▶ */
function ParamRow({
  id,
  label,
  title,
  value,
  min,
  max,
  digits = 1,
  bipolar,
  tone,
  playing,
  onChange,
  onPlay,
}: {
  id: string;
  label: string;
  title: string;
  value: number;
  min: number;
  max: number;
  digits?: number;
  bipolar?: boolean;
  tone: string;
  playing?: boolean;
  onChange: (value: number) => void;
  onPlay?: () => void;
}) {
  const round = (v: number) => {
    const f = Math.pow(10, digits);
    return Math.round(v * f) / f;
  };
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const bind = useHoldRepeat((d) => onChange(round(clamp(value + d * 0.1))));
  const pct = max > min ? ((clamp(value) - min) / (max - min)) * 100 : 0;
  const style = {
    "--lo": bipolar ? `${Math.min(50, pct)}%` : "0%",
    "--hi": bipolar ? `${Math.max(50, pct)}%` : `${pct}%`,
    "--sc": tone,
  } as CSSProperties;

  return (
    <div className="tc-slider" style={style}>
      <label htmlFor={id} title={title}>
        {label}
      </label>
      <button
        {...bind(-1)}
        disabled={value <= min}
        aria-label={`Kurangi ${title}`}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <input
        id={id}
        className="tc-range"
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={clamp(value)}
        aria-valuetext={`${title} sama dengan ${fmt(value, digits)}`}
        onChange={(event) =>
          onChange(round(clamp(Number(event.currentTarget.value))))
        }
      />
      <button
        {...bind(1)}
        disabled={value >= max}
        aria-label={`Tambah ${title}`}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
      <output htmlFor={id} aria-live="off">
        {fmt(value, digits)}
      </output>
      {onPlay ? (
        <button
          type="button"
          className="tc-step tc-play"
          aria-pressed={!!playing}
          aria-label={
            playing ? `Hentikan animasi ${title}` : `Animasikan ${title}`
          }
          title={playing ? "Hentikan animasi" : "Animasikan"}
          onClick={onPlay}
        >
          {playing ? (
            <Pause size={12} aria-hidden="true" />
          ) : (
            <Play size={12} aria-hidden="true" />
          )}
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );
}

const cell = (key: string, value: string, tone?: string, wide?: boolean) => (
  <div key={key} className={wide ? "tc-wide" : undefined}>
    <dt>{key}</dt>
    <dd style={tone ? { color: tone } : undefined}>{value}</dd>
  </div>
);

/* ───────── Komponen utama ───────── */

export function TwoCircleTangentSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `tc-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const centersRef = useRef<DragPoint[]>([]);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);

  const [params, setParams] = useStoredSimulationState<Params>(
    "twocircle.params",
    DEFAULT_PARAMS,
  );
  const [storedOpts, setOpts] = useStoredSimulationState<Opts>(
    "twocircle.opts",
    DEFAULT_OPTS,
  );
  // gabungkan dengan nilai bawaan agar pengaturan lama tetap valid
  const opts = useMemo<Opts>(
    () => ({ ...DEFAULT_OPTS, ...storedOpts }),
    [storedOpts],
  );
  const [focus, setFocus] = useStoredSimulationState<Focus>(
    "twocircle.focus",
    "all",
  );
  // 0 = mode proses mati; 1..STEP_COUNT = langkah penjelasan
  const [step, setStep] = useState(0);
  const [anim, setAnim] = useState<Anim>(null);
  const [tab, setTab] = useState<Tab>("set");
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // data yang dibaca papan JSXGraph (selalu lewat ref agar tidak basi)
  const pRef = useRef(params);
  pRef.current = params;
  const oRef = useRef(opts);
  oRef.current = opts;
  const lRef = useRef({ focus, step });
  lRef.current = { focus, step };
  const moveRef = useRef<
    (which: 1 | 2, x: number, y: number, pt: DragPoint) => void
  >(() => undefined);
  moveRef.current = (which, x, y, pt) => {
    const cx = Math.min(X_LIM, Math.max(-X_LIM, Math.round(x * 100) / 100));
    const cy = Math.min(Y_LIM, Math.max(-Y_LIM, Math.round(y * 100) / 100));
    // titik pusat tidak boleh keluar dari batas yang diatur slider
    if (cx !== x || cy !== y) pt.setPosition(COORDS_BY_USER, [cx, cy]);
    const prev = pRef.current;
    const next: Params =
      which === 1 ? { ...prev, x1: cx, y1: cy } : { ...prev, x2: cx, y2: cy };
    pRef.current = next;
    setAnim(null);
    setParams(next);
    boardRef.current?.update();
  };

  const an = analyze(params);

  /* ───────── Parameter ───────── */

  const setParam = (patch: Partial<Params>) => {
    setAnim(null);
    setParams((prev) => ({ ...prev, ...patch }));
  };

  const setOpt = (key: keyof Opts) =>
    setOpts((prev) => ({ ...DEFAULT_OPTS, ...prev, [key]: !oRef.current[key] }));

  const reset = () => {
    setAnim(null);
    setParams(DEFAULT_PARAMS);
    setOpts(DEFAULT_OPTS);
    setFocus("all");
    setStep(0);
    boardRef.current?.setBoundingBox(HOME_BOX, true);
  };

  // Jarak antarpusat sebagai satu pengatur: O₂ bergeser sepanjang garis O₁O₂.
  const angle =
    an.d > 1e-6 ? Math.atan2(params.y2 - params.y1, params.x2 - params.x1) : 0;
  const dMax = Math.max(0.5, rayMax(params.x1, params.y1, angle));
  const setDistance = (value: number) =>
    setParam({
      x2: round3(params.x1 + Math.cos(angle) * value),
      y2: round3(params.y1 + Math.sin(angle) * value),
    });

  /* ───────── Tampilan ───────── */

  const zoomIn = () => boardRef.current?.zoomIn();
  const zoomOut = () => boardRef.current?.zoomOut();
  const center = () => boardRef.current?.setBoundingBox(HOME_BOX, true);

  const toggleFs = async () => {
    const el = rootRef.current;
    if (!el) return;
    if (isFs || document.fullscreenElement === el) {
      if (document.fullscreenElement === el) {
        try {
          await document.exitFullscreen();
        } catch {
          /* diabaikan */
        }
      }
      nativeFsRef.current = false;
      setIsFs(false);
      return;
    }
    // Pasang tata letak layar penuh lebih dulu (flushSync), baru minta layar
    // penuh asli, agar ukuran grafik langsung benar.
    flushSync(() => {
      setPanelOpen(false);
      setIsFs(true);
    });
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        nativeFsRef.current = true;
      } catch {
        /* tetap pakai layar penuh CSS */
      }
    }
  };

  // Layar sentuh: kunci ke lanskap saat layar penuh (bila diizinkan browser).
  useEffect(() => {
    if (!isFs || !window.matchMedia("(pointer: coarse)").matches) return;
    const o = (
      screen as unknown as {
        orientation?: {
          lock?: (m: "landscape") => Promise<void>;
          unlock?: () => void;
        };
      }
    ).orientation;
    if (typeof o?.lock !== "function") return;
    o.lock("landscape").catch(() => undefined);
    return () => {
      try {
        o.unlock?.();
      } catch {
        /* abaikan */
      }
    };
  }, [isFs]);

  // Sinkron saat keluar lewat Esc / gestur sistem.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && nativeFsRef.current) {
        nativeFsRef.current = false;
        setIsFs(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !document.fullscreenElement &&
        !nativeFsRef.current
      ) {
        setIsFs(false);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* ───────── Papan JSXGraph ───────── */

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: HOME_BOX,
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepAspectRatio: true, // lingkaran harus tetap terlihat bulat
      // Ukuran papan diatur oleh sync di bawah; pengamat bawaan dimatikan
      // agar tidak berebut saat masuk layar penuh.
      resize: { enabled: false, throttle: 100 },
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: {
        wheel: true,
        needShift: false,
        factorX: 1.15,
        factorY: 1.15,
        min: 0.15,
        max: 12,
      },
    });
    boardRef.current = board;

    board.create("grid", [], {
      strokeColor: "#94a3b8",
      strokeOpacity: 0.28,
      strokeWidth: 1,
      highlight: false,
    });

    const ticks = {
      insertTicks: true,
      minTicksDistance: 32,
      minorTicks: 0,
      majorHeight: 6,
      strokeColor: "#94a3b8",
      drawLabels: true,
      label: { fontSize: 10, strokeColor: "#64748b" },
    };
    const axis = {
      strokeColor: "#94a3b8",
      strokeWidth: 1.25,
      highlight: false,
      ticks,
    };
    board.create("axis", [[0, 0], [1, 0]], axis);
    board.create("axis", [[0, 0], [0, 1]], axis);

    // analisis dihitung sekali per perubahan parameter
    let cache: { p: Params; v: Analysis } | null = null;
    const A = (): Analysis => {
      const p = pRef.current;
      if (!cache || cache.p !== p) cache = { p, v: analyze(p) };
      return cache.v;
    };
    const show = (key: keyof Opts) => oRef.current[key];
    const circ = (which: 1 | 2) => {
      const p = pRef.current;
      return which === 1
        ? { x: p.x1, y: p.y1, r: p.r1 }
        : { x: p.x2, y: p.y2, r: p.r2 };
    };

    const extent = () => {
      const bb = board.getBoundingBox();
      return 4 * Math.max(...bb.map((v: number) => Math.abs(v))) + 30;
    };

    /* Kurva berdasarkan daftar titik; null menyembunyikannya */
    const makeCurve = (
      stroke: string,
      width: number,
      dash: number,
      opacity: number,
      build: () => Vec[] | null,
      fill?: { color: string; opacity: number },
    ) => {
      const curve = board.create("curve", [[0], [0]], {
        strokeColor: stroke,
        strokeWidth: width,
        strokeOpacity: opacity,
        fillColor: fill ? fill.color : "none",
        fillOpacity: fill ? fill.opacity : 0,
        dash,
        highlight: false,
        fixed: true,
      }) as unknown as DataCurve;
      curve.updateDataArray = () => {
        const points = build();
        if (
          !points ||
          points.length === 0 ||
          points.some((q) => !Number.isFinite(q[0]) || !Number.isFinite(q[1]))
        ) {
          curve.dataX = [Number.NaN];
          curve.dataY = [Number.NaN];
          return;
        }
        curve.dataX = points.map((q) => q[0]);
        curve.dataY = points.map((q) => q[1]);
      };
      return curve;
    };

    const circlePoints = (which: 1 | 2) => {
      const c = circ(which);
      return arcPoints(c.x, c.y, c.r, 0, 360);
    };
    const colorOf = (which: 1 | 2) => (which === 1 ? color.c1 : color.c2);

    // isi lingkaran (tanpa garis tepi) lalu garis tepinya
    ([1, 2] as const).forEach((which) => {
      makeCurve(
        colorOf(which),
        0,
        0,
        1,
        () => (show("fill") ? circlePoints(which) : null),
        { color: colorOf(which), opacity: 0.1 },
      );
    });
    ([1, 2] as const).forEach((which) => {
      makeCurve(colorOf(which), 3, 0, 1, () => circlePoints(which));
    });

    // garis hubung pusat (diperpanjang bila titik E dan I ditampilkan)
    makeCurve(color.guide, 1.5, 2, 1, () => {
      if (!show("centerline")) return null;
      const a = A();
      const p = pRef.current;
      if (a.d < 1e-3) return null;
      if (show("homothety")) {
        const s = extent();
        return [
          [p.x1 - a.ux * s, p.y1 - a.uy * s],
          [p.x1 + a.ux * s, p.y1 + a.uy * s],
        ];
      }
      return [
        [p.x1, p.y1],
        [p.x2, p.y2],
      ];
    });

    // garis singgung persekutuan: garis panjang tipis + ruas T₁T₂ tebal
    const kinds = ["ext", "int"] as const;
    const listOf = (kind: Kind) => (kind === "ext" ? A().ext : A().inn);
    const colorKind = (kind: Kind) => (kind === "ext" ? color.ext : color.int);

    const stepNow = () => lRef.current.step;
    const isOnly = () => lRef.current.step > 0 || lRef.current.focus !== "all";
    // garis singgung yang dijelaskan / ditampilkan: mode proses > fokus > centang
    const target = () => resolveTarget(A(), lRef.current.focus);
    const vis = (kind: Kind, i: number) => {
      if (!listOf(kind)[i]) return false;
      const l = lRef.current;
      if (l.step > 0) {
        const tg = target();
        return !!tg && tg.kind === kind && tg.i === i;
      }
      if (l.focus !== "all") return l.focus === `${kind}-${i}`;
      return show(kind);
    };

    /* Tanda siku-siku di titik v, antara arah ke a dan ke b (ukuran tetap dalam piksel) */
    const rightAngle = (v: Vec, a: Vec, b: Vec): Vec[] | null => {
      const ux = a[0] - v[0];
      const uy = a[1] - v[1];
      const wx = b[0] - v[0];
      const wy = b[1] - v[1];
      const lu = Math.hypot(ux, uy);
      const lw = Math.hypot(wx, wy);
      if (lu < 1e-6 || lw < 1e-6) return null;
      const unit = (board as unknown as { unitX: number }).unitX || 40;
      const size = Math.min(14 / unit, 0.4 * lu, 0.4 * lw);
      const ex = ux / lu;
      const ey = uy / lu;
      const fx = wx / lw;
      const fy = wy / lw;
      return [
        [v[0] + size * ex, v[1] + size * ey],
        [v[0] + size * (ex + fx), v[1] + size * (ey + fy)],
        [v[0] + size * fx, v[1] + size * fy],
      ];
    };

    kinds.forEach((kind) => {
      [0, 1].forEach((i) => {
        makeCurve(colorKind(kind), 1.6, 0, 0.85, () => {
          if (!vis(kind, i) || !show("extend")) return null;
          const t = listOf(kind)[i];
          if (!t) return null;
          const s = extent();
          const dirX = -t.ny;
          const dirY = t.nx;
          const px = t.c * t.nx;
          const py = t.c * t.ny;
          return [
            [px - dirX * s, py - dirY * s],
            [px + dirX * s, py + dirY * s],
          ];
        });
        makeCurve(colorKind(kind), 3.5, 0, 1, () => {
          if (!vis(kind, i)) return null;
          const t = listOf(kind)[i];
          return t ? [t.t1, t.t2] : null;
        });
      });
    });

    // jari-jari ke titik singgung (tegak lurus garis singgung) + tanda siku-siku
    kinds.forEach((kind) => {
      [0, 1].forEach((i) => {
        ([1, 2] as const).forEach((which) => {
          makeCurve(color.guide, 1.25, 2, 1, () => {
            if (!vis(kind, i) || !(show("rightAngle") || stepNow() >= 1))
              return null;
            const t = listOf(kind)[i];
            if (!t) return null;
            const c = circ(which);
            return [[c.x, c.y], which === 1 ? t.t1 : t.t2];
          });
          makeCurve(
            color.touch,
            1.5,
            0,
            1,
            () => {
              if (!vis(kind, i) || !(show("rightAngle") || stepNow() >= 1))
                return null;
              const t = listOf(kind)[i];
              if (!t) return null;
              const c = circ(which);
              const own = which === 1 ? t.t1 : t.t2;
              const other = which === 1 ? t.t2 : t.t1;
              return rightAngle(own, [c.x, c.y], other);
            },
            { color: color.touch, opacity: 0.12 },
          );
        });
      });
    });

    /* ----- Proses: segitiga siku-siku bantu O₁PO₂ ----- */
    // perpanjangan jari-jari O₁T₁ dan O₂T₂, dan garis lewat O₂ sejajar
    // garis singgung; keduanya bertemu di P (langkah 2+)
    kinds.forEach((kind) => {
      [0, 1].forEach((i) => {
        ([1, 2] as const).forEach((which) => {
          makeCurve(color.help, 1.25, 2, 0.9, () => {
            if (!vis(kind, i) || stepNow() < 2) return null;
            const t = listOf(kind)[i];
            if (!t) return null;
            const c = circ(which);
            const s = extent();
            return [
              [c.x - t.nx * s, c.y - t.ny * s],
              [c.x + t.nx * s, c.y + t.ny * s],
            ];
          });
        });
        makeCurve(colorKind(kind), 1.5, 3, 0.9, () => {
          if (!vis(kind, i) || stepNow() < 2) return null;
          const t = listOf(kind)[i];
          if (!t) return null;
          const c = circ(2);
          const s = extent();
          return [
            [c.x + t.ny * s, c.y - t.nx * s],
            [c.x - t.ny * s, c.y + t.nx * s],
          ];
        });
      });
    });

    const proc = () => {
      if (stepNow() < 1) return null;
      const tg = target();
      if (!tg) return null;
      return { tg, ...helperGeometry(pRef.current, tg.t) };
    };
    type Proc = NonNullable<ReturnType<typeof proc>>;

    // persegi panjang T₁T₂O₂P (langkah 2+)
    makeCurve(color.guide, 1.5, 3, 1, () => {
      const g = proc();
      if (!g || stepNow() < 2) return null;
      return [g.tg.t.t1, g.tg.t.t2, g.O2, g.P, g.tg.t.t1];
    });
    // isi segitiga O₁PO₂ (langkah 3+)
    makeCurve(
      color.help,
      0,
      0,
      1,
      () => {
        const g = proc();
        if (!g || stepNow() < 3) return null;
        return [g.O1, g.P, g.O2, g.O1];
      },
      { color: color.help, opacity: 0.16 },
    );
    // sisi miring O₁O₂ = d (langkah 3+)
    makeCurve(color.touch, 2.75, 0, 1, () => {
      const g = proc();
      if (!g || stepNow() < 3) return null;
      return [g.O1, g.O2];
    });
    // sisi tegak O₁P (langkah 2+)
    makeCurve(color.help, 3.75, 0, 1, () => {
      const g = proc();
      if (!g || stepNow() < 2) return null;
      return [g.O1, g.P];
    });
    // sisi tegak PO₂ = ℓ (langkah 2+)
    makeCurve(color.ext, 2.75, 4, 1, () => {
      const g = proc();
      if (!g || stepNow() < 2) return null;
      return [g.P, g.O2];
    });
    // tanda siku-siku di P (langkah 3+)
    makeCurve(
      color.help,
      1.6,
      0,
      1,
      () => {
        const g = proc();
        if (!g || stepNow() < 3) return null;
        return rightAngle(g.P, g.O1, g.O2);
      },
      { color: color.help, opacity: 0.22 },
    );

    // jari-jari r₁ dan r₂ (ke atas)
    ([1, 2] as const).forEach((which) => {
      makeCurve(colorOf(which), 2, 2, 1, () => {
        if (!show("rad")) return null;
        const c = circ(which);
        return [
          [c.x, c.y],
          [c.x, c.y + c.r],
        ];
      });
    });

    /* Titik dan label */
    const dot = (
      x: () => number,
      y: () => number,
      fill: string,
      size: number,
    ) =>
      board.create("point", [x, y], {
        name: "",
        withLabel: false,
        size,
        fillColor: fill,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        fixed: true,
        highlight: false,
      });
    const label = (
      x: () => number,
      y: () => number,
      text: string | (() => string),
      tone: string,
      offset: [number, number] = [8, 8],
    ) =>
      board.create(
        "text",
        [
          () => (Number.isFinite(x()) ? x() : 1e6),
          () => (Number.isFinite(y()) ? y() : 1e6),
          text,
        ],
        {
          fontSize: 13,
          strokeColor: tone,
          offset,
          highlight: false,
          fixed: true,
        },
      );

    // titik-titik singgung
    kinds.forEach((kind) => {
      [0, 1].forEach((i) => {
        (["t1", "t2"] as const).forEach((end) => {
          dot(
            () => {
              const t = listOf(kind)[i];
              return vis(kind, i) && show("points") && t
                ? t[end][0]
                : Number.NaN;
            },
            () => {
              const t = listOf(kind)[i];
              return t ? t[end][1] : Number.NaN;
            },
            colorKind(kind),
            5,
          );
        });
      });
    });

    // titik P (langkah 2+)
    const procPt = (axis: 0 | 1) => () => {
      const g = proc();
      return g && stepNow() >= 2 ? g.P[axis] : Number.NaN;
    };
    dot(procPt(0), procPt(1), color.help, 5);
    label(procPt(0), procPt(1), "P", color.help, [-14, 8]);

    // nama titik singgung T₁ dan T₂ (hanya saat satu garis ditampilkan)
    ([1, 2] as const).forEach((which) => {
      const pos = (axis: 0 | 1) => () => {
        if (!isOnly()) return Number.NaN;
        const tg = target();
        if (!tg || !vis(tg.kind, tg.i)) return Number.NaN;
        return which === 1 ? tg.t.t1[axis] : tg.t.t2[axis];
      };
      label(pos(0), pos(1), which === 1 ? "T₁" : "T₂", color.touch, [
        -8,
        which === 1 ? 14 : -22,
      ]);
    });

    // label panjang ruas singgung ℓ (tiap garis, atau pada langkah 4 proses)
    kinds.forEach((kind) => {
      [0, 1].forEach((i) => {
        const t = () => listOf(kind)[i];
        const shown = () =>
          vis(kind, i) &&
          ((stepNow() === 0 && show("lengths")) || stepNow() >= 4);
        const len = () => {
          const tt = t();
          return tt ? Math.hypot(tt.t2[0] - tt.t1[0], tt.t2[1] - tt.t1[1]) : 0;
        };
        label(
          () => (shown() ? (t()!.t1[0] + t()!.t2[0]) / 2 : Number.NaN),
          () => (shown() ? (t()!.t1[1] + t()!.t2[1]) / 2 : Number.NaN),
          () =>
            `${isOnly() ? "" : `${FOCUS_NAME[`${kind}-${i}` as Focus]}: `}ℓ = ${fmt(len())}`,
          colorKind(kind),
          [8, 8],
        );
      });
    });

    // label sisi segitiga bantu: huruf (langkah 3), nilai (langkah 4)
    const sideLabel = (
      from: (g: Proc) => Vec,
      to: (g: Proc) => Vec,
      text: (g: Proc) => string,
      tone: string,
      offset: [number, number],
      minStep = 3,
    ) => {
      const mid = (axis: 0 | 1) => () => {
        const g = proc();
        if (!g || stepNow() < minStep) return Number.NaN;
        return (from(g)[axis] + to(g)[axis]) / 2;
      };
      label(
        mid(0),
        mid(1),
        () => {
          const g = proc();
          return g ? text(g) : "";
        },
        tone,
        offset,
      );
    };
    const legName = (g: Proc) => (g.tg.kind === "ext" ? "|r₁ − r₂|" : "r₁ + r₂");
    sideLabel(
      (g) => g.O1,
      (g) => g.O2,
      (g) =>
        stepNow() >= 4
          ? `d = ${fmt(Math.hypot(g.O2[0] - g.O1[0], g.O2[1] - g.O1[1]))}`
          : "d",
      color.touch,
      [6, -22],
    );
    sideLabel(
      (g) => g.O1,
      (g) => g.P,
      (g) =>
        stepNow() >= 4 ? `${legName(g)} = ${fmt(g.leg)}` : legName(g),
      color.help,
      [-70, 6],
      2,
    );
    sideLabel(
      (g) => g.P,
      (g) => g.O2,
      () => "ℓ",
      color.ext,
      [6, 6],
    );

    // E (titik potong garis singgung luar) dan I (garis singgung dalam)
    const eOn = () => show("homothety") && show("ext");
    const iOn = () => show("homothety") && show("int");
    dot(() => (eOn() ? A().E[0] : Number.NaN), () => A().E[1], color.ext, 5);
    dot(() => (iOn() ? A().I[0] : Number.NaN), () => A().I[1], color.int, 5);
    label(() => (eOn() ? A().E[0] : Number.NaN), () => A().E[1], "E", color.ext);
    label(() => (iOn() ? A().I[0] : Number.NaN), () => A().I[1], "I", color.int);

    // label jari-jari dan pusat
    ([1, 2] as const).forEach((which) => {
      label(
        () => (show("rad") ? circ(which).x : Number.NaN),
        () => circ(which).y + circ(which).r / 2,
        which === 1 ? "r₁" : "r₂",
        colorOf(which),
        [6, -2],
      );
      label(
        () => circ(which).x,
        () => circ(which).y,
        which === 1 ? "O₁" : "O₂",
        colorOf(which),
        [-24, -20],
      );
    });

    // titik pusat: bisa diseret (dibuat paling akhir agar berada di atas)
    centersRef.current = ([1, 2] as const).map((which) => {
      const c = circ(which);
      const pt = board.create("point", [c.x, c.y], {
        name: "",
        withLabel: false,
        size: 7,
        face: "o",
        fillColor: colorOf(which),
        strokeColor: "#ffffff",
        strokeWidth: 2,
        fixed: false,
        highlight: false,
        snapToGrid: false,
        showInfobox: false,
      }) as unknown as DragPoint;
      pt.on("drag", () => moveRef.current(which, pt.X(), pt.Y(), pt));
      return pt;
    });

    board.update();

    // Saat ukuran berubah (layar penuh / putar layar): pertahankan skala
    // dan titik tengah agar grafik tidak melompat.
    let last = { w: el.clientWidth, h: el.clientHeight };
    const sync = (force = false) => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      if (!force && w === last.w && h === last.h) return;

      const bb = board.getBoundingBox();
      const spanX = bb[2] - bb[0];
      const spanY = bb[1] - bb[3];
      board.resizeContainer(w, h, true, true);
      if (last.w > 0 && last.h > 0 && spanX > 0 && spanY > 0) {
        const ux = last.w / spanX;
        const uy = last.h / spanY;
        const cx = (bb[0] + bb[2]) / 2;
        const cy = (bb[1] + bb[3]) / 2;
        board.setBoundingBox(
          [cx - w / 2 / ux, cy + h / 2 / uy, cx + w / 2 / ux, cy - h / 2 / uy],
          true,
        );
      }
      last = { w, h };
      board.update();
    };
    syncRef.current = sync;
    const observer = new ResizeObserver(() => sync());
    observer.observe(el);

    return () => {
      syncRef.current = null;
      observer.disconnect();
      centersRef.current = [];
      JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
    };
  }, [boardId]);

  // Perbarui papan setiap parameter atau pilihan berubah; titik pusat yang
  // bisa diseret disamakan dengan nilai slider.
  useEffect(() => {
    const points = centersRef.current;
    if (points.length === 2) {
      (
        [
          [params.x1, params.y1],
          [params.x2, params.y2],
        ] as Vec[]
      ).forEach(([x, y], i) => {
        const pt = points[i];
        if (Math.abs(pt.X() - x) > 1e-9 || Math.abs(pt.Y() - y) > 1e-9)
          pt.setPosition(COORDS_BY_USER, [x, y]);
      });
    }
    boardRef.current?.update();
  }, [params, opts, focus, step]);

  // Masuk/keluar layar penuh mengubah ukuran kontainer dua kali (tata letak
  // CSS, lalu layar penuh asli). Sinkronkan ulang setelah transisi.
  useEffect(() => {
    const run = () => syncRef.current?.(true);
    const raf = requestAnimationFrame(() => requestAnimationFrame(run));
    const t1 = window.setTimeout(run, 150);
    const t2 = window.setTimeout(run, 450);
    document.addEventListener("fullscreenchange", run);
    window.addEventListener("resize", run);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener("fullscreenchange", run);
      window.removeEventListener("resize", run);
    };
  }, [isFs]);

  // Animasi: O₂ maju-mundur sepanjang garis O₁O₂ (jauh → dekat → di dalam)
  useEffect(() => {
    if (!anim) return;
    let raf = 0;
    let last = performance.now();
    let dir = -1;
    const start = pRef.current;
    const dist0 = Math.hypot(start.x2 - start.x1, start.y2 - start.y1);
    const alpha =
      dist0 > 1e-6 ? Math.atan2(start.y2 - start.y1, start.x2 - start.x1) : 0;
    let dist = dist0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = pRef.current;
      const max = Math.max(0.5, rayMax(p.x1, p.y1, alpha));
      dist += dir * dt * 2.2;
      if (dist >= max) {
        dist = max;
        dir = -1;
      } else if (dist <= 0) {
        dist = 0;
        dir = 1;
      }
      setParams((prev) => ({
        ...prev,
        x2: round3(prev.x1 + Math.cos(alpha) * dist),
        y2: round3(prev.y1 + Math.sin(alpha) * dist),
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim]);

  /* ───────── Nilai turunan ───────── */

  const sameParams = (a: Params, b: Params) =>
    (Object.keys(a) as (keyof Params)[]).every(
      (key) => Math.abs(a[key] - b[key]) < 1e-6,
    );
  const target = resolveTarget(an, focus);
  const focusMissing = focus !== "all" && !target;
  const kindShown = (kind: Kind) => {
    if (step > 0) return target?.kind === kind;
    if (focus !== "all") return !!target && focus.startsWith(kind);
    return opts[kind];
  };
  const startProcess = () => {
    setAnim(null);
    setStep(1);
    setTab("proc");
  };
  const goStep = (delta: number) =>
    setStep((value) => Math.min(STEP_COUNT, Math.max(1, value + delta)));

  // bahan penjelasan proses (hanya bermakna bila ada garis singgung terpilih)
  const isExt = target?.kind === "ext";
  const helper = target ? helperGeometry(params, target.t) : null;
  const leg = helper ? helper.leg : 0;
  const legAbs = isExt ? "|r₁ − r₂|" : "r₁ + r₂";
  const tLen = target
    ? Math.hypot(
        target.t.t2[0] - target.t.t1[0],
        target.t.t2[1] - target.t.t1[1],
      )
    : 0;
  const targetName = target
    ? FOCUS_NAME[`${target.kind}-${target.i}` as Focus]
    : "—";
  const procSteps: { title: string; caption: string; body: string }[] = [
    {
      title: "Jari-jari ⟂ singgung",
      caption: "Jari-jari ke titik singgung tegak lurus garis singgung.",
      body: "O₁T₁ dan O₂T₂ ditarik ke titik singgung. Jari-jari selalu tegak lurus garis singgung, jadi ∠O₁T₁T₂ = ∠O₂T₂T₁ = 90° dan O₁T₁ ∥ O₂T₂.",
    },
    {
      title: "Garis bantu dari O₂",
      caption: "Perpanjangan O₁T₁ dan garis dari O₂ ∥ T₁T₂ bertemu di P.",
      body: isExt
        ? `Perpanjang O₁T₁ melewati T₁ dan tarik garis dari O₂ yang sejajar T₁T₂; keduanya bertemu di P. T₁T₂O₂P punya tiga sudut siku-siku, jadi persegi panjang: PO₂ = T₁T₂ = ℓ dan T₁P = r₂. Karena O₁T₁ = r₁, maka O₁P = |r₁ − r₂| = ${fmt(leg)}.${
            leg < 1e-6 ? " Di sini r₁ = r₂, sehingga P berimpit dengan O₁." : ""
          }`
        : `Perpanjang O₁T₁ melewati T₁ dan tarik garis dari O₂ yang sejajar T₁T₂; keduanya bertemu di P. T₁T₂O₂P persegi panjang: PO₂ = ℓ dan T₁P = r₂. Karena P di seberang O₁ terhadap T₁, maka O₁P = r₁ + r₂ = ${fmt(leg)}.`,
    },
    {
      title: "Segitiga siku-siku O₁PO₂",
      caption: "O₁PO₂ siku-siku di P, sisi miringnya d.",
      body: `Sisi miring O₁O₂ = d = ${fmt(an.d)}, sisi tegak O₁P = ${legAbs} = ${fmt(leg)}, dan sisi tegak PO₂ = ℓ yang dicari.`,
    },
    {
      title: "Hitung dengan Pythagoras",
      caption: `ℓ² = d² − (${legAbs})², jadi ℓ = ${fmt(tLen)}.`,
      body: `Dari d² = (${legAbs})² + ℓ² diperoleh ℓ = √(d² − (${legAbs})²).`,
    },
  ];

  const countText = `${an.count} garis singgung${
    focus !== "all"
      ? ` · ${FOCUS_NAME[focus]}${focusMissing ? " (tidak ada)" : ""}`
      : ""
  }`;

  return (
    <div ref={rootRef} className={`tc${isFs ? " is-fs" : ""}`}>
      <p className="tc-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>
          Miringkan ponsel ke mode lanskap agar grafik dan pengatur nyaman
          dipakai.
        </span>
      </p>

      <div className="tc-layout">
        {/* ───── Grafik ───── */}
        <section className="tc-graph" aria-label="Grafik dua lingkaran">
          <div className="tc-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="tc-board"
              aria-label="Grafik dua lingkaran dan garis singgung persekutuannya. Seret latar untuk menggeser, gulir atau cubit untuk memperbesar, seret titik pusat O1 atau O2 untuk memindahkan lingkaran."
            />

            <div className="tc-hud">
              <p className="tc-chip" aria-live="polite">
                <b>{an.relation}</b>
                <span>{countText}</span>
              </p>
              {step > 0 ? (
                <p className="tc-pinfo tc-pstep" aria-live="polite">
                  <b>
                    {step}/{STEP_COUNT}
                    {target ? ` ${procSteps[step - 1].title}` : ""}
                  </b>
                  <span>
                    {target
                      ? procSteps[step - 1].caption
                      : "Tidak ada garis singgung yang bisa dijelaskan."}
                  </span>
                </p>
              ) : (
                <p className="tc-pinfo">
                  <span>
                    <b>d</b> = {fmt(an.d)}
                  </span>
                  {an.ext.length > 0 && kindShown("ext") && (
                    <span>
                      <b style={{ color: color.ext }}>ℓ luar</b> ={" "}
                      {fmt(an.lenExt)}
                    </span>
                  )}
                  {an.inn.length > 0 && kindShown("int") && (
                    <span>
                      <b style={{ color: color.int }}>ℓ dalam</b> ={" "}
                      {fmt(an.lenInt)}
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="tc-tools" role="group" aria-label="Alat tampilan">
              <button
                type="button"
                onClick={toggleFs}
                aria-pressed={isFs}
                aria-label={isFs ? "Keluar layar penuh" : "Layar penuh"}
                title={isFs ? "Keluar layar penuh" : "Layar penuh"}
              >
                {isFs ? (
                  <Minimize2 size={16} aria-hidden="true" />
                ) : (
                  <Maximize2 size={16} aria-hidden="true" />
                )}
              </button>
              <button type="button" onClick={zoomIn} aria-label="Perbesar" title="Perbesar">
                <Plus size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={zoomOut} aria-label="Perkecil" title="Perkecil">
                <Minus size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={center}
                aria-label="Pusatkan tampilan"
                title="Pusatkan tampilan"
              >
                <Crosshair size={16} aria-hidden="true" />
              </button>
              {isFs && step > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => goStep(-1)}
                    disabled={step <= 1}
                    aria-label="Langkah sebelumnya"
                    title="Langkah sebelumnya"
                  >
                    <ChevronLeft size={17} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goStep(1)}
                    disabled={step >= STEP_COUNT}
                    aria-label="Langkah berikutnya"
                    title="Langkah berikutnya"
                  >
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </>
              )}
              {isFs && (
                <button
                  type="button"
                  className="tc-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`tc-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="tc-legend" aria-label="Legenda grafik">
            <li>
              <i style={{ borderColor: color.c1 }} /> lingkaran 1
            </li>
            <li>
              <i style={{ borderColor: color.c2 }} /> lingkaran 2
            </li>
            {kindShown("ext") && (
              <li>
                <i style={{ borderColor: color.ext }} /> singgung luar
              </li>
            )}
            {kindShown("int") && (
              <li>
                <i style={{ borderColor: color.int }} /> singgung dalam
              </li>
            )}
            {opts.points && (
              <li>
                <b style={{ background: color.touch }} /> titik singgung
              </li>
            )}
            {opts.centerline && (
              <li>
                <i className="dash" style={{ borderColor: color.guide }} /> garis pusat
              </li>
            )}
            {step >= 2 && (
              <li>
                <i style={{ borderColor: color.help }} /> garis bantu
              </li>
            )}
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`tc-panel-${baseId}`}
          className={`tc-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur dua lingkaran"
        >
          <div className="tc-tabs" role="group" aria-label="Bagian panel">
            <button type="button" aria-pressed={tab === "set"} onClick={() => setTab("set")}>
              Atur
            </button>
            <button type="button" aria-pressed={tab === "proc"} onClick={() => setTab("proc")}>
              Proses
            </button>
            <button type="button" aria-pressed={tab === "res"} onClick={() => setTab("res")}>
              Hasil
            </button>
          </div>

          {tab === "set" && (
            <>
              <div className="tc-presets" role="group" aria-label="Posisi dua lingkaran">
                {PRESETS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={sameParams(params, item.params)}
                    style={{ "--kc": item.color } as CSSProperties}
                    onClick={() => setParam(item.params)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="tc-focus" role="group" aria-label="Garis singgung yang ditampilkan">
                {FOCUS_OPTIONS.map((item) => {
                  const exists = item.key === "all" || !!resolveTarget(an, item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-pressed={focus === item.key}
                      disabled={!exists && focus !== item.key}
                      style={{ "--kc": item.color } as CSSProperties}
                      onClick={() => setFocus(item.key)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {focusMissing && (
                <p className="tc-note" role="status">
                  {FOCUS_NAME[focus]} tidak ada pada posisi ini. Ubah d atau
                  jari-jari, atau pilih garis lain.
                </p>
              )}

              <div className="tc-sliders">
                <ParamRow
                  id={`tc-${baseId}-r1`}
                  label="r₁"
                  title="jari-jari lingkaran 1"
                  value={params.r1}
                  min={R_MIN}
                  max={R_MAX}
                  tone={color.c1}
                  onChange={(v) => setParam({ r1: v })}
                />
                <ParamRow
                  id={`tc-${baseId}-r2`}
                  label="r₂"
                  title="jari-jari lingkaran 2"
                  value={params.r2}
                  min={R_MIN}
                  max={R_MAX}
                  tone={color.c2}
                  onChange={(v) => setParam({ r2: v })}
                />
                <ParamRow
                  id={`tc-${baseId}-d`}
                  label="d"
                  title="jarak kedua pusat"
                  value={an.d}
                  min={0}
                  max={dMax}
                  tone={color.d}
                  playing={anim === "d"}
                  onChange={setDistance}
                  onPlay={() => setAnim(anim === "d" ? null : "d")}
                />
              </div>

              <details className="tc-more">
                <summary>Posisi pusat</summary>
                <div className="tc-sliders">
                  <ParamRow
                    id={`tc-${baseId}-x1`}
                    label="x₁"
                    title="absis pusat lingkaran 1"
                    value={params.x1}
                    min={-X_LIM}
                    max={X_LIM}
                    digits={2}
                    bipolar
                    tone={color.c1}
                    onChange={(v) => setParam({ x1: v })}
                  />
                  <ParamRow
                    id={`tc-${baseId}-y1`}
                    label="y₁"
                    title="ordinat pusat lingkaran 1"
                    value={params.y1}
                    min={-Y_LIM}
                    max={Y_LIM}
                    digits={2}
                    bipolar
                    tone={color.c1}
                    onChange={(v) => setParam({ y1: v })}
                  />
                  <ParamRow
                    id={`tc-${baseId}-x2`}
                    label="x₂"
                    title="absis pusat lingkaran 2"
                    value={params.x2}
                    min={-X_LIM}
                    max={X_LIM}
                    digits={2}
                    bipolar
                    tone={color.c2}
                    onChange={(v) => setParam({ x2: v })}
                  />
                  <ParamRow
                    id={`tc-${baseId}-y2`}
                    label="y₂"
                    title="ordinat pusat lingkaran 2"
                    value={params.y2}
                    min={-Y_LIM}
                    max={Y_LIM}
                    digits={2}
                    bipolar
                    tone={color.c2}
                    onChange={(v) => setParam({ y2: v })}
                  />
                </div>
              </details>

              <div className="tc-chips" role="group" aria-label="Tampilkan di grafik">
                {optionRows.map((row) => (
                  <button
                    key={row.key}
                    type="button"
                    aria-pressed={opts[row.key]}
                    onClick={() => setOpt(row.key)}
                  >
                    {row.label}
                  </button>
                ))}
              </div>

              <button type="button" className="tc-reset" onClick={reset}>
                <RotateCcw size={13} aria-hidden="true" />
                <span>Atur ulang</span>
              </button>
            </>
          )}

          {tab === "proc" && (
            <>
              {step === 0 ? (
                <>
                  <p className="tc-note">
                    Cari panjang ruas singgung ℓ lewat segitiga siku-siku bantu
                    O₁PO₂, dalam 4 langkah. Garis yang dijelaskan: {targetName}.
                  </p>
                  <button
                    type="button"
                    className="tc-reset"
                    onClick={startProcess}
                    disabled={!target}
                  >
                    <Play size={13} aria-hidden="true" />
                    <span>Mulai proses</span>
                  </button>
                  {!target && (
                    <p className="tc-note" role="status">
                      Tidak ada garis singgung pada posisi ini. Jauhkan kedua
                      lingkaran atau pilih garis lain di tab Atur.
                    </p>
                  )}
                </>
              ) : target ? (
                <>
                  <ol className="tc-steps">
                    {procSteps.map((s, i) => (
                      <li
                        key={s.title}
                        aria-current={step === i + 1 ? "step" : undefined}
                        data-done={step > i + 1 ? "true" : undefined}
                      >
                        <button type="button" onClick={() => setStep(i + 1)}>
                          <b>{i + 1}</b>
                          <span>{s.title}</span>
                        </button>
                        {step === i + 1 && <p>{s.body}</p>}
                      </li>
                    ))}
                  </ol>
                  {step === STEP_COUNT && (
                    <dl className="tc-readouts">
                      {cell("d² = (" + legAbs + ")² + ℓ²", `${fmt(an.d)}² = ${fmt(leg)}² + ℓ²`, color.touch, true)}
                      {cell(
                        "ℓ = √(d² − (" + legAbs + ")²)",
                        `√${fmt(Math.max(0, an.d * an.d - leg * leg))} = ${fmt(tLen)}`,
                        color.ext,
                        true,
                      )}
                      {tLen < 1e-3 &&
                        cell("Catatan", "ℓ = 0: kedua lingkaran bersinggungan, T₁ dan T₂ berimpit.", undefined, true)}
                    </dl>
                  )}
                  <div className="tc-nav">
                    <button type="button" onClick={() => goStep(-1)} disabled={step <= 1}>
                      <ChevronLeft size={14} aria-hidden="true" />
                      Kembali
                    </button>
                    <button type="button" onClick={() => goStep(1)} disabled={step >= STEP_COUNT}>
                      Lanjut
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => setStep(0)}>
                      <X size={14} aria-hidden="true" />
                      Selesai
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="tc-note" role="status">
                    Garis singgung yang dipilih tidak ada pada posisi ini. Ubah
                    posisi lingkaran atau pilih garis lain.
                  </p>
                  <button type="button" className="tc-reset" onClick={() => setStep(0)}>
                    <X size={13} aria-hidden="true" />
                    <span>Tutup</span>
                  </button>
                </>
              )}
            </>
          )}

          {tab === "res" && (
            <>
              <dl className="tc-readouts" aria-live="polite">
                {cell("Hubungan", an.relation, color.ext, true)}
                {cell("d", fmt(an.d))}
                {cell("r₁ + r₂", fmt(an.sum))}
                {cell("|r₁ − r₂|", fmt(an.diff), undefined, true)}
                {cell("Lingkaran 1", circleEq(params.x1, params.y1, params.r1), color.c1, true)}
                {cell("Lingkaran 2", circleEq(params.x2, params.y2, params.r2), color.c2, true)}
              </dl>

              <dl className="tc-readouts" aria-live="polite">
                {cell(
                  "Singgung luar",
                  an.ext.length ? `${an.ext.length} garis` : "tidak ada (d < |r₁ − r₂|)",
                  color.ext,
                  true,
                )}
                {an.ext.length > 0 &&
                  cell(
                    "ℓ = √(d² − (r₁ − r₂)²)",
                    `√(${fmt(an.d)}² − ${fmt(an.diff)}²) = ${fmt(an.lenExt)}`,
                    color.ext,
                    true,
                  )}
                {an.ext.map((t, i) =>
                  cell(
                    `Luar ${i + 1}`,
                    `${lineEq(t)} · ${fmtPt(t.t1[0], t.t1[1])} dan ${fmtPt(t.t2[0], t.t2[1])}`,
                    undefined,
                    true,
                  ),
                )}
                {Number.isFinite(an.E[0]) && cell("Titik potong E", fmtPt(an.E[0], an.E[1]), color.ext, true)}
              </dl>

              <dl className="tc-readouts" aria-live="polite">
                {cell(
                  "Singgung dalam",
                  an.inn.length ? `${an.inn.length} garis` : "tidak ada (d < r₁ + r₂)",
                  color.int,
                  true,
                )}
                {an.inn.length > 0 &&
                  cell(
                    "ℓ = √(d² − (r₁ + r₂)²)",
                    `√(${fmt(an.d)}² − ${fmt(an.sum)}²) = ${fmt(an.lenInt)}`,
                    color.int,
                    true,
                  )}
                {an.inn.map((t, i) =>
                  cell(
                    `Dalam ${i + 1}`,
                    `${lineEq(t)} · ${fmtPt(t.t1[0], t.t1[1])} dan ${fmtPt(t.t2[0], t.t2[1])}`,
                    undefined,
                    true,
                  ),
                )}
                {Number.isFinite(an.I[0]) && cell("Titik potong I", fmtPt(an.I[0], an.I[1]), color.int, true)}
              </dl>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default TwoCircleTangentSimulation;
