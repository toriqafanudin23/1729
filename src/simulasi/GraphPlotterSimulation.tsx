import {
  ArrowUpDown,
  Crosshair,
  Download,
  Eye,
  EyeOff,
  Link2,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  SlidersHorizontal,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import JXG from "jsxgraph";
import "../styles/jsxgraph.css";
import "./GraphPlotterSimulation.css";
import { GraphAppearanceControls } from "./GraphAppearanceControls";
import { useGraphAppearance } from "./simulationBoard";
import { useStoredSimulationState } from "./useStoredSimulationState";
import {
  PARAM_NAMES,
  derivative,
  findExtrema,
  findRoots,
  parseLatex,
  type Extremum,
  type Params,
} from "./latexMath";

/* Simulasi penggambar grafik — tema slate seperti simulasi dua lingkaran
   (landing page 1729). Urutan desain: ponsel lanskap → desktop → potret.
   Layar penuh: grafik memenuhi 100% layar; toolbar, info, legenda, dan panel
   pengatur mengambang di atasnya. Grafik: pengatur = 2fr : 1fr. */

/* ───────── Tipe ───────── */

type Slot = { src: string; on: boolean; der: boolean };
type Pt = { x: number; y: number };
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type PairResult = { i: number; j: number; pts: Pt[]; coincident: boolean };
type AxisResult = { i: number; yInt: Pt | null; xInts: Pt[]; ext: Extremum[] };
type Results = { pairs: PairResult[]; axes: AxisResult[] };
type Pin = {
  id: number;
  x: number;
  y: number;
  slot: number | null;
  slope: number | null;
};
type TraceRow = { i: number; y: number; dy: number };
type Trace = { x: number; rows: TraceRow[] };
type View = [number, number, number, number];
type Shared = {
  slots: Slot[];
  params: Params;
  view: View | null;
  lock: boolean;
};
type PanelTab = "fn" | "opt" | "res" | "info";

/* ───────── Konstanta ───────── */

const MAX_SLOTS = 6;
const MAX_PINS = 12;
// Warna grafik: dipakai juga oleh legenda, hasil, dan nomor pada kolom rumus.
const SLOT_COLORS = [
  "#2563eb",
  "#e11d48",
  "#0d9488",
  "#7c3aed",
  "#ea580c",
  "#ca8a04",
];
const INTER_COLOR = "#0f172a";
const PIN_COLOR = "#475569";
const INTER_POOL = 40;
const AXIS_POOL = 7; // 1 titik potong sumbu y + maksimal 6 akar per grafik
const EXT_POOL = 6;
const HOME_BOX: View = [-10, 10, 10, -10];
const PARAM_MIN = -10;
const PARAM_MAX = 10;
const PARAM_SPEED = 2; // satuan per detik saat animasi parameter
const DEFAULT_PARAMS: Params = { a: 1, b: 1, c: 1, k: 1 };

const initialSlots: Slot[] = [
  { src: "x^{2}", on: true, der: false },
  { src: "2x+3", on: true, der: false },
  { src: "", on: true, der: false },
];

const PLACEHOLDERS = [
  "x^{2}-2",
  "\\frac{x+1}{2}",
  "e^{-x}",
  "a\\sin(kx)",
  "|x-1|",
  "\\sqrt{x}",
];

type Preset = {
  label: string;
  color: string;
  srcs: string[];
  params?: Params;
  der?: boolean;
};
const PRESETS: Preset[] = [
  { label: "Parabola & garis", color: "#2563eb", srcs: ["x^{2}", "2x+3"] },
  {
    label: "eˣ, ln x, y = x",
    color: "#e11d48",
    srcs: ["e^{x}", "\\ln x", "x"],
  },
  {
    label: "sin, cos, ½",
    color: "#0d9488",
    srcs: ["\\sin x", "\\cos x", "\\frac{1}{2}"],
  },
  {
    label: "1/x, parabola, akar",
    color: "#7c3aed",
    srcs: ["\\frac{1}{x}", "x^{2}-2", "\\sqrt{x}"],
  },
  {
    label: "Parabola ax²+bx+c",
    color: "#ea580c",
    srcs: ["ax^{2}+bx+c", "0"],
    params: { a: 1, b: -2, c: -3 },
  },
  {
    label: "Gelombang a·sin(kx)",
    color: "#ca8a04",
    srcs: ["a\\sin(kx)", "a\\sin(kx+b)"],
    params: { a: 2, k: 1, b: 1 },
  },
  {
    label: "Fungsi & turunannya",
    color: "#2563eb",
    srcs: ["x^{3}-3x"],
    der: true,
  },
  {
    label: "Transformasi |x|",
    color: "#e11d48",
    srcs: ["|x|", "a|x-b|+c"],
    params: { a: 2, b: 3, c: -1 },
  },
];

// § menandai posisi kursor setelah disisipkan
const SNIPPETS: { label: string; title: string; text: string }[] = [
  { label: "xⁿ", title: "Pangkat", text: "^{§}" },
  { label: "a/b", title: "Pecahan", text: "\\frac{§}{}" },
  { label: "√", title: "Akar kuadrat", text: "\\sqrt{§}" },
  { label: "ⁿ√", title: "Akar pangkat n", text: "\\sqrt[§]{}" },
  { label: "eˣ", title: "Eksponen basis e", text: "e^{§}" },
  { label: "π", title: "Pi", text: "\\pi§" },
  { label: "|x|", title: "Nilai mutlak", text: "\\left|§\\right|" },
  { label: "sin", title: "Sinus", text: "\\sin(§)" },
  { label: "cos", title: "Kosinus", text: "\\cos(§)" },
  { label: "tan", title: "Tangen", text: "\\tan(§)" },
  { label: "ln", title: "Logaritma natural", text: "\\ln(§)" },
  { label: "log", title: "Logaritma basis tertentu", text: "\\log_{§}()" },
];

const panelTabs: { tab: PanelTab; label: string }[] = [
  { tab: "fn", label: "Fungsi" },
  { tab: "opt", label: "Opsi" },
  { tab: "res", label: "Hasil" },
  { tab: "info", label: "Info" },
];

/* ───────── Format ───────── */

function fmt(value: number, digits = 4) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < Math.pow(10, -digits) / 2) return "0";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digits,
    useGrouping: false,
  })
    .format(value)
    .replace("-", "−");
}

function ptText(p: Pt) {
  return `(${fmt(p.x)}; ${fmt(p.y)})`;
}

/* ───────── Tautan yang dapat dibagikan (?grafik=...) ───────── */

function toB64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64(text: string) {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function readShared(): Shared | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = new URLSearchParams(window.location.search).get("grafik");
    if (!raw) return null;
    const data = JSON.parse(fromB64(raw)) as {
      s?: unknown;
      p?: unknown;
      v?: unknown;
      r?: unknown;
    };
    if (!Array.isArray(data.s) || data.s.length === 0) return null;
    const slots: Slot[] = data.s.slice(0, MAX_SLOTS).map((row: unknown) => {
      const r = Array.isArray(row) ? row : [];
      return {
        src: typeof r[0] === "string" ? r[0].slice(0, 300) : "",
        on: r[1] !== 0,
        der: r[2] === 1,
      };
    });
    const params: Params = { ...DEFAULT_PARAMS };
    if (data.p && typeof data.p === "object") {
      PARAM_NAMES.forEach((name) => {
        const v = (data.p as Record<string, unknown>)[name];
        if (typeof v === "number" && Number.isFinite(v)) params[name] = v;
      });
    }
    let view: View | null = null;
    if (
      Array.isArray(data.v) &&
      data.v.length === 4 &&
      data.v.every((n) => typeof n === "number" && Number.isFinite(n)) &&
      data.v[0] < data.v[2] &&
      data.v[3] < data.v[1]
    ) {
      view = data.v as View;
    }
    return { slots, params, view, lock: data.r !== 0 };
  } catch {
    return null;
  }
}

/* ───────── Baris parameter ───────── */

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
    className: "gp-step",
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stop();
      stepRef.current(direction);
      timers.current.delay = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(
          () => stepRef.current(direction),
          70,
        );
      }, 400);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onBlur: stop,
    onContextMenu: (event: { preventDefault: () => void }) =>
      event.preventDefault(),
    // detail === 0 → aktivasi lewat keyboard (Enter/Spasi)
    onClick: (event: { detail: number }) => {
      if (event.detail === 0) stepRef.current(direction);
    },
  });
}

/** Satu baris:  a  −  ────●────  +  [ 1 ]  ▶ */
function ParamRow({
  name,
  value,
  playing,
  onSlide,
  onNudge,
  onPlay,
}: {
  name: string;
  value: number;
  playing: boolean;
  onSlide: (value: number) => void;
  onNudge: (direction: 1 | -1) => void;
  onPlay: () => void;
}) {
  const bind = useHoldRepeat(onNudge);
  const clamped = Math.max(PARAM_MIN, Math.min(PARAM_MAX, value));
  const pct = ((clamped - PARAM_MIN) / (PARAM_MAX - PARAM_MIN)) * 100;
  // Isi dari titik 0 (tengah) menuju nilai, karena parameter bisa negatif.
  const style = {
    "--lo": `${Math.min(50, pct)}%`,
    "--hi": `${Math.max(50, pct)}%`,
  } as CSSProperties;

  return (
    <div className="gp-param" style={style}>
      <label htmlFor={`gp-par-${name}`}>{name}</label>
      <button {...bind(-1)} aria-label={`Kurangi ${name} 0,1`}>
        <Minus size={13} aria-hidden="true" />
      </button>
      <input
        id={`gp-par-${name}`}
        className="gp-range"
        type="range"
        min={PARAM_MIN}
        max={PARAM_MAX}
        step={0.05}
        value={clamped}
        onChange={(event) => onSlide(Number(event.currentTarget.value))}
      />
      <button {...bind(1)} aria-label={`Tambah ${name} 0,1`}>
        <Plus size={13} aria-hidden="true" />
      </button>
      <input
        className="gp-num"
        type="number"
        inputMode="decimal"
        step={0.1}
        value={value}
        aria-label={`Nilai ${name}`}
        onChange={(event) => {
          const v = parseFloat(event.currentTarget.value);
          if (Number.isFinite(v)) onSlide(v);
        }}
      />
      <button
        type="button"
        className="gp-step gp-play"
        aria-pressed={playing}
        aria-label={playing ? `Hentikan animasi ${name}` : `Animasikan ${name}`}
        title={playing ? "Hentikan animasi" : "Animasikan parameter"}
        onClick={onPlay}
      >
        {playing ? (
          <Pause size={12} aria-hidden="true" />
        ) : (
          <Play size={12} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

const cell = (key: string, value: string, tone?: string, wide?: boolean) => (
  <div key={key} className={wide ? "gp-wide" : undefined}>
    <dt>{key}</dt>
    <dd style={tone ? { color: tone } : undefined}>{value}</dd>
  </div>
);

/* ───────── Komponen utama ───────── */

export function GraphPlotterSimulation() {
  const boardId = `gp-board-${useId().replace(/:/g, "")}`;
  const baseId = boardId.replace("gp-board-", "");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const boardRefs = useMemo(() => [boardRef], []);
  const { appearance, onStep } = useGraphAppearance(boardRefs);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sharedRef = useRef<Shared | null | undefined>(undefined);
  if (sharedRef.current === undefined) sharedRef.current = readShared();
  const shared = sharedRef.current;

  // data yang dibaca papan JSXGraph (selalu lewat ref agar tidak basi)
  const fnsRef = useRef<(((x: number) => number) | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );
  const derRef = useRef<boolean[]>(Array(MAX_SLOTS).fill(false));
  const interRef = useRef<Pt[]>([]);
  const axisRef = useRef<Pt[][]>(Array.from({ length: MAX_SLOTS }, () => []));
  const extRef = useRef<Pt[][]>(Array.from({ length: MAX_SLOTS }, () => []));
  const pinRef = useRef<Pin[]>([]);
  const traceXRef = useRef(Number.NaN);
  const tanRef = useRef<({ x: number; y: number; m: number } | null)[]>([]);
  const pinIdRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const lastKeyRef = useRef("");
  // true saat papan sedang digeser: hitung ulang ditunda sampai tombol dilepas
  const panningRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncSizeRef = useRef<((force?: boolean) => void) | null>(null);
  const nativeFsRef = useRef(false);

  const [slots, setSlots] = useStoredSimulationState<Slot[]>(
    "graph-plotter.slots",
    shared?.slots ?? initialSlots,
    !shared,
  );
  const [params, setParams] = useStoredSimulationState<Params>(
    "graph-plotter.params",
    shared?.params ?? DEFAULT_PARAMS,
    !shared,
  );
  const [active, setActive] = useStoredSimulationState(
    "graph-plotter.active-slot",
    0,
    !shared,
  );
  const [showInter, setShowInter] = useStoredSimulationState(
    "graph-plotter.intersections",
    true,
    !shared,
  );
  const [showAxis, setShowAxis] = useStoredSimulationState(
    "graph-plotter.axis-intercepts",
    false,
    !shared,
  );
  const [showExt, setShowExt] = useStoredSimulationState(
    "graph-plotter.extrema",
    false,
    !shared,
  );
  const [showTan, setShowTan] = useStoredSimulationState(
    "graph-plotter.tangents",
    false,
    !shared,
  );
  const [lockRatio, setLockRatio] = useStoredSimulationState(
    "graph-plotter.lock-ratio",
    shared?.lock ?? true,
    !shared,
  );
  const [anim, setAnim] = useState<string | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [results, setResults] = useState<Results>({ pairs: [], axes: [] });
  const [message, setMessage] = useState("");
  const [isFull, setIsFull] = useState(false);
  // Panel hanya mengambang di layar penuh: tersembunyi sampai tombolnya diketuk.
  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState<PanelTab>("fn");

  const pRef = useRef<Params>({ ...params });
  const showInterRef = useRef(showInter);
  const showAxisRef = useRef(showAxis);
  const showExtRef = useRef(showExt);
  const showTanRef = useRef(showTan);
  const lockRef = useRef(lockRatio);

  const parsed = useMemo(
    () => slots.map((slot) => parseLatex(slot.src, pRef.current)),
    [slots],
  );

  const drawn = slots.map((slot, i) => {
    const result = parsed[i];
    return slot.on && !!result && result.ok;
  });
  const drawnCount = drawn.filter(Boolean).length;

  const usedParams = useMemo(() => {
    const set = new Set<string>();
    parsed.forEach((result, i) => {
      if (slots[i]?.on && result && result.ok)
        result.params.forEach((name) => set.add(name));
    });
    return PARAM_NAMES.filter((name) => set.has(name));
  }, [parsed, slots]);

  const setSlot = (index: number, patch: Partial<Slot>) =>
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)),
    );

  const flash = (text: string) => setMessage(text);

  /* ───────── Perhitungan ───────── */

  // Nilai f(x) dan gradien semua grafik pada satu x (juga menyiapkan garis singgung)
  const traceRows = (x: number): TraceRow[] => {
    const rows: TraceRow[] = [];
    const tans: ({ x: number; y: number; m: number } | null)[] = [];
    fnsRef.current.forEach((fn, i) => {
      if (!fn) {
        tans[i] = null;
        return;
      }
      const y = fn(x);
      const dy = derivative(fn, x);
      tans[i] =
        Number.isFinite(y) && Number.isFinite(dy) ? { x, y, m: dy } : null;
      rows.push({ i, y, dy });
    });
    tanRef.current = tans;
    return rows;
  };

  const applyTrace = (x: number | null) => {
    const board = boardRef.current;
    if (!board) return;
    if (x === null || !Number.isFinite(x)) {
      traceXRef.current = Number.NaN;
      tanRef.current = [];
      board.update();
      setTrace(null);
      return;
    }
    traceXRef.current = x;
    const rows = traceRows(x);
    board.update();
    setTrace({ x, rows });
  };

  // Hitung titik potong, ekstrem, dan titik potong sumbu pada rentang yang terlihat
  const recompute = () => {
    const board = boardRef.current;
    if (!board) return;
    const [x1, y1, x2, y2] = board.getBoundingBox();
    const ySpan = Math.abs(y1 - y2);
    const cx = (x1 + x2) / 2;
    const fns = fnsRef.current;

    const pairs: PairResult[] = [];
    const flat: Pt[] = [];
    for (let i = 0; i < MAX_SLOTS; i += 1) {
      for (let j = i + 1; j < MAX_SLOTS; j += 1) {
        const fi = fns[i];
        const fj = fns[j];
        if (!fi || !fj) continue;
        const { roots, coincident } = findRoots(
          (x) => fi(x) - fj(x),
          x1,
          x2,
          2500,
        );
        const pts = roots
          .map((x) => ({ x, y: (fi(x) + fj(x)) / 2 }))
          .filter((p) => Number.isFinite(p.y));
        pairs.push({ i, j, pts, coincident });
        pts.forEach((p) => flat.push(p));
      }
    }

    const axes: AxisResult[] = [];
    const axisPts: Pt[][] = Array.from({ length: MAX_SLOTS }, () => []);
    const extPts: Pt[][] = Array.from({ length: MAX_SLOTS }, () => []);
    fns.forEach((fn, i) => {
      if (!fn) return;
      const y0 = fn(0);
      const yInt = Number.isFinite(y0) ? { x: 0, y: y0 } : null;
      const { roots, coincident } = findRoots(fn, x1, x2, 2500);
      const xInts = coincident ? [] : roots.map((x) => ({ x, y: 0 }));
      let ext: Extremum[] = [];
      if (showExtRef.current) {
        ext = findExtrema(fn, x1, x2, ySpan)
          .sort((p, q) => Math.abs(p.x - cx) - Math.abs(q.x - cx))
          .slice(0, EXT_POOL)
          .sort((p, q) => p.x - q.x);
      }
      axes.push({ i, yInt, xInts, ext });
      if (yInt) axisPts[i].push(yInt);
      xInts.slice(0, AXIS_POOL - 1).forEach((p) => axisPts[i].push(p));
      ext.forEach((p) => extPts[i].push({ x: p.x, y: p.y }));
    });

    interRef.current = flat.slice(0, INTER_POOL);
    axisRef.current = axisPts;
    extRef.current = extPts;
    board.update();

    const key = JSON.stringify({ pairs, axes });
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      setResults({ pairs, axes });
    }
  };

  const scheduleRecompute = () => {
    if (panningRef.current) return;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      recompute();
    });
  };

  /* ───────── Navigasi tampilan ───────── */

  const zoomIn = () => {
    boardRef.current?.zoomIn();
    scheduleRecompute();
  };
  const zoomOut = () => {
    boardRef.current?.zoomOut();
    scheduleRecompute();
  };
  const resetView = () => {
    boardRef.current?.setBoundingBox(HOME_BOX, lockRef.current);
    scheduleRecompute();
  };
  const panBy = (fx: number, fy: number) => {
    const board = boardRef.current;
    if (!board) return;
    const [x1, y1, x2, y2] = board.getBoundingBox();
    const dx = (x2 - x1) * fx;
    const dy = (y1 - y2) * fy;
    board.setBoundingBox([x1 + dx, y1 + dy, x2 + dx, y2 + dy], lockRef.current);
    scheduleRecompute();
  };

  // Sesuaikan tinggi jendela dengan nilai grafik (kebal terhadap asimtot)
  const fitView = () => {
    const board = boardRef.current;
    if (!board) return;
    const [x1, , x2] = board.getBoundingBox();
    const ys: number[] = [];
    fnsRef.current.forEach((fn) => {
      if (!fn) return;
      for (let k = 0; k <= 400; k += 1) {
        const v = fn(x1 + ((x2 - x1) * k) / 400);
        if (Number.isFinite(v)) ys.push(v);
      }
    });
    if (ys.length < 2) return;
    ys.sort((p, q) => p - q);
    const lo = ys[Math.floor(ys.length * 0.03)];
    const hi = ys[Math.ceil(ys.length * 0.97) - 1];
    const span = hi - lo < 1e-6 ? 2 : hi - lo;
    const mid = (hi + lo) / 2;
    const half = span * 0.65;
    lockRef.current = false;
    setLockRatio(false);
    board.setBoundingBox([x1, mid + half, x2, mid - half], false);
    scheduleRecompute();
  };

  const toggleFullscreen = async () => {
    const el = rootRef.current;
    if (!el) return;
    if (isFull || document.fullscreenElement === el) {
      if (document.fullscreenElement === el) {
        try {
          await document.exitFullscreen();
        } catch {
          /* diabaikan */
        }
      }
      nativeFsRef.current = false;
      setIsFull(false);
      return;
    }
    // Pasang tata letak layar penuh lebih dulu (flushSync), baru minta layar
    // penuh asli, agar ukuran grafik langsung benar.
    flushSync(() => {
      setPanelOpen(false);
      setIsFull(true);
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

  const exportPng = () => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(w));
    clone.setAttribute("height", String(h));
    const xml = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          flash("Gagal membuat gambar.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "grafik.png";
        link.click();
        URL.revokeObjectURL(url);
        flash("Gambar diunduh.");
      }, "image/png");
    };
    img.onerror = () => flash("Gagal membuat gambar.");
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  };

  const copyLink = () => {
    const board = boardRef.current;
    const view = board
      ? (board
          .getBoundingBox()
          .map((n: number) => Math.round(n * 1e4) / 1e4) as View)
      : undefined;
    const payload = {
      s: slots.map((slot) => [slot.src, slot.on ? 1 : 0, slot.der ? 1 : 0]),
      p: params,
      v: view,
      r: lockRatio ? 1 : 0,
    };
    const url = new URL(window.location.href);
    url.searchParams.set("grafik", toB64(JSON.stringify(payload)));
    const text = url.toString();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => flash("Tautan disalin."),
        () => window.prompt("Salin tautan ini:", text),
      );
    } else {
      window.prompt("Salin tautan ini:", text);
    }
  };

  const onBoardKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const step = event.shiftKey ? 0.4 : 0.1;
    switch (event.key) {
      case "ArrowLeft":
        panBy(-step, 0);
        break;
      case "ArrowRight":
        panBy(step, 0);
        break;
      case "ArrowUp":
        panBy(0, step);
        break;
      case "ArrowDown":
        panBy(0, -step);
        break;
      case "+":
      case "=":
        zoomIn();
        break;
      case "-":
      case "_":
        zoomOut();
        break;
      case "0":
        resetView();
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  /* ───────── Masukan fungsi ───────── */

  const insertSnippet = (snippet: string) => {
    const index = Math.min(active, slots.length - 1);
    const el = inputRefs.current[index];
    const cursor = snippet.indexOf("§");
    const clean = snippet.replace("§", "");
    const src = slots[index].src;
    const start = el?.selectionStart ?? src.length;
    const end = el?.selectionEnd ?? start;
    setSlot(index, {
      src: src.slice(0, start) + clean + src.slice(end),
      on: true,
    });
    requestAnimationFrame(() => {
      el?.focus();
      const pos = start + (cursor >= 0 ? cursor : clean.length);
      el?.setSelectionRange(pos, pos);
    });
  };

  const applyPreset = (preset: Preset) => {
    setSlots(
      preset.srcs
        .slice(0, MAX_SLOTS)
        .map((src) => ({ src, on: true, der: !!preset.der })),
    );
    if (preset.params) setParams((prev) => ({ ...prev, ...preset.params }));
    setPins([]);
    setActive(0);
    setAnim(null);
    resetView();
  };

  const addSlot = () => {
    if (slots.length >= MAX_SLOTS) return;
    setSlots((prev) => [...prev, { src: "", on: true, der: false }]);
    setActive(slots.length);
    requestAnimationFrame(() => inputRefs.current[slots.length]?.focus());
  };

  const removeSlot = (index: number) => {
    if (slots.length <= 1) return;
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setActive((a) =>
      Math.max(0, Math.min(a > index ? a - 1 : a, slots.length - 2)),
    );
    setPins((prev) =>
      prev.map((pin) =>
        pin.slot === null
          ? pin
          : pin.slot === index
            ? { ...pin, slot: null, slope: null }
            : pin.slot > index
              ? { ...pin, slot: pin.slot - 1 }
              : pin,
      ),
    );
  };

  const setParam = (name: string, value: number) =>
    setParams((prev) => ({ ...prev, [name]: value }));

  const nudgeParam = (name: string, direction: 1 | -1) => {
    setAnim(null);
    setParams((prev) => {
      const next = (prev[name] ?? 1) + direction * 0.1;
      return {
        ...prev,
        [name]:
          Math.round(Math.max(PARAM_MIN, Math.min(PARAM_MAX, next)) * 100) /
          100,
      };
    });
  };

  /* ───────── Papan JSXGraph ───────── */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: HOME_BOX,
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepAspectRatio: lockRef.current,
      // Ukuran papan diatur oleh sync di bawah; pengamat bawaan dimatikan
      // agar tidak berebut saat masuk layar penuh.
      resize: { enabled: false, throttle: 100 },
      // Pan ditangani sendiri dan dibatasi satu update per frame.
      pan: { enabled: false },
      // zoom roda mouse ditangani sendiri di bawah (zoom ke posisi kursor)
      zoom: { wheel: false, factorX: 1.25, factorY: 1.25 },
    });
    boardRef.current = board;
    if (shared?.view) board.setBoundingBox(shared.view, lockRef.current);

    const axisStyle = {
      strokeColor: "#94a3b8",
      strokeWidth: 1.4,
      highlight: false,
    };
    // majorHeight: -1 membuat tanda sumbu memanjang menjadi garis kisi yang ikut zoom/geser
    const ticks = {
      insertTicks: true,
      minorTicks: 0,
      majorHeight: -1,
      drawZero: false,
      strokeColor: "rgba(148, 163, 184, 0.28)",
      strokeWidth: 1,
      label: { fontSize: 10, strokeColor: "#64748b" },
    };
    board.create(
      "axis",
      [
        [0, 0],
        [1, 0],
      ],
      { ...axisStyle, ticks },
    );
    board.create(
      "axis",
      [
        [0, 0],
        [0, 1],
      ],
      { ...axisStyle, ticks },
    );

    // turunan (garis putus-putus)
    SLOT_COLORS.forEach((color, i) => {
      board.create(
        "functiongraph",
        [
          (x: number) => {
            const fn = fnsRef.current[i];
            return fn && derRef.current[i] ? derivative(fn, x) : Number.NaN;
          },
        ],
        {
          strokeColor: color,
          strokeWidth: 2,
          dash: 3,
          strokeOpacity: 0.75,
          highlight: false,
        },
      );
    });

    // garis singgung di posisi pelacak
    SLOT_COLORS.forEach((color, i) => {
      board.create(
        "functiongraph",
        [
          (x: number) => {
            const t = tanRef.current[i];
            if (
              !showTanRef.current ||
              !t ||
              !Number.isFinite(traceXRef.current)
            )
              return Number.NaN;
            return t.y + t.m * (x - t.x);
          },
        ],
        {
          strokeColor: color,
          strokeWidth: 1.6,
          dash: 1,
          strokeOpacity: 0.9,
          highlight: false,
        },
      );
    });

    // grafik fungsi
    SLOT_COLORS.forEach((color, i) => {
      board.create(
        "functiongraph",
        [
          (x: number) => {
            const fn = fnsRef.current[i];
            return fn ? fn(x) : Number.NaN;
          },
        ],
        { strokeColor: color, strokeWidth: 3, highlight: false },
      );
    });

    const marker = (
      x: () => number,
      y: () => number,
      color: string,
      size: number,
      info: boolean,
      face = "o",
    ) =>
      board.create("point", [x, y], {
        name: "",
        withLabel: false,
        size,
        face,
        fillColor: color,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        highlightFillColor: color,
        highlightStrokeColor: "#ffffff",
        fixed: true,
        highlight: info,
        showInfobox: info,
        infoboxDigits: 4,
      });

    // titik potong sumbu (per grafik)
    SLOT_COLORS.forEach((color, i) => {
      for (let k = 0; k < AXIS_POOL; k += 1) {
        marker(
          () =>
            showAxisRef.current
              ? (axisRef.current[i][k]?.x ?? Number.NaN)
              : Number.NaN,
          () =>
            showAxisRef.current
              ? (axisRef.current[i][k]?.y ?? Number.NaN)
              : Number.NaN,
          color,
          3.5,
          true,
        );
      }
    });
    // titik ekstrem (belah ketupat)
    SLOT_COLORS.forEach((color, i) => {
      for (let k = 0; k < EXT_POOL; k += 1) {
        marker(
          () =>
            showExtRef.current
              ? (extRef.current[i][k]?.x ?? Number.NaN)
              : Number.NaN,
          () =>
            showExtRef.current
              ? (extRef.current[i][k]?.y ?? Number.NaN)
              : Number.NaN,
          color,
          5,
          true,
          "<>",
        );
      }
    });
    // titik potong antargrafik
    for (let k = 0; k < INTER_POOL; k += 1) {
      marker(
        () =>
          showInterRef.current
            ? (interRef.current[k]?.x ?? Number.NaN)
            : Number.NaN,
        () =>
          showInterRef.current
            ? (interRef.current[k]?.y ?? Number.NaN)
            : Number.NaN,
        INTER_COLOR,
        5,
        true,
      );
    }
    // titik tersemat (klik)
    for (let k = 0; k < MAX_PINS; k += 1) {
      marker(
        () => pinRef.current[k]?.x ?? Number.NaN,
        () => pinRef.current[k]?.y ?? Number.NaN,
        PIN_COLOR,
        4.5,
        true,
        "[]",
      );
    }

    // pelacak: garis tegak + titik pada tiap grafik
    board.create(
      "curve",
      [
        () => traceXRef.current,
        (t: number) => t,
        () => board.getBoundingBox()[3],
        () => board.getBoundingBox()[1],
      ],
      { strokeColor: "#64748b", strokeWidth: 1, dash: 2, highlight: false },
    );
    SLOT_COLORS.forEach((color, i) => {
      marker(
        () => (fnsRef.current[i] ? traceXRef.current : Number.NaN),
        () => {
          const fn = fnsRef.current[i];
          return fn && Number.isFinite(traceXRef.current)
            ? fn(traceXRef.current)
            : Number.NaN;
        },
        color,
        4,
        false,
      );
    });

    board.on("boundingbox", scheduleRecompute);

    // ───── interaksi pointer: pelacak, klik untuk menyematkan, zoom roda ─────
    const toUsr = (e: { clientX: number; clientY: number }) => {
      const r = el.getBoundingClientRect();
      const [x1, y1, x2, y2] = board.getBoundingBox();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      return {
        x: x1 + (px / r.width) * (x2 - x1),
        y: y1 - (py / r.height) * (y1 - y2),
        w: r.width,
        h: r.height,
        x1,
        y1,
        x2,
        y2,
      };
    };

    let traceRaf: number | null = null;
    let pendingX: number | null = null;
    const queueTrace = (x: number | null) => {
      pendingX = x;
      if (traceRaf !== null) return;
      traceRaf = requestAnimationFrame(() => {
        traceRaf = null;
        applyTrace(pendingX);
      });
    };

    // jari yang sedang menyentuh: dua jari = cubit (ditangani JSXGraph)
    const touching = new Set<number>();
    let down: { x: number; y: number; view: View } | null = null;
    let pendingPan: View | null = null;
    let panRaf: number | null = null;
    const flushPan = () => {
      if (panRaf !== null) cancelAnimationFrame(panRaf);
      panRaf = null;
      if (!pendingPan) return;
      board.setBoundingBox(pendingPan, lockRef.current);
      pendingPan = null;
    };
    // Lepas tombol / jari (di mana pun): akhiri geser lalu hitung ulang sekali.
    const endPan = () => {
      if (!panningRef.current) return;
      flushPan();
      panningRef.current = false;
      scheduleRecompute();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      touching.add(e.pointerId);
      if (touching.size > 1) {
        // cubit: lepaskan geser sendiri agar tidak berebut dengan zoom
        down = null;
        endPan();
        return;
      }
      down = {
        x: e.clientX,
        y: e.clientY,
        view: board.getBoundingBox() as View,
      };
      panningRef.current = true;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* diabaikan */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (down && (e.buttons !== 0 || e.pointerType !== "mouse")) {
        const rect = el.getBoundingClientRect();
        const dx =
          ((e.clientX - down.x) / rect.width) * (down.view[2] - down.view[0]);
        const dy =
          ((e.clientY - down.y) / rect.height) * (down.view[1] - down.view[3]);
        pendingPan = [
          down.view[0] - dx,
          down.view[1] + dy,
          down.view[2] - dx,
          down.view[3] + dy,
        ];
        if (panRaf === null) {
          panRaf = requestAnimationFrame(() => {
            panRaf = null;
            if (!pendingPan) return;
            board.setBoundingBox(pendingPan, lockRef.current);
            pendingPan = null;
          });
        }
        if (!Number.isNaN(traceXRef.current)) queueTrace(null);
        return;
      }
      if (e.buttons !== 0) {
        if (!Number.isNaN(traceXRef.current)) queueTrace(null);
        return;
      }
      // Kursor hanya menampilkan titik/nilai bila pengguna mengaktifkan
      // "Garis singgung & nilai di posisi kursor".
      if (!showTanRef.current) return;
      queueTrace(toUsr(e).x);
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "touch") queueTrace(null);
    };
    const onUp = (e: PointerEvent) => {
      touching.delete(e.pointerId);
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      endPan();
      if (moved >= 5) return;
      handleClick(e);
    };
    const onCancel = (e: PointerEvent) => {
      touching.delete(e.pointerId);
      down = null;
      endPan();
    };
    const onWindowUp = (e: PointerEvent) => {
      touching.delete(e.pointerId);
      endPan();
    };

    const handleClick = (e: PointerEvent) => {
      const u = toUsr(e);
      const sx = u.w / (u.x2 - u.x1);
      const sy = u.h / (u.y1 - u.y2);
      type Cand = { x: number; y: number; slot: number | null; d: number };
      const specials: Cand[] = [];
      const curves: Cand[] = [];
      const consider = (
        list: Cand[],
        x: number,
        y: number,
        slot: number | null,
        tol: number,
      ) => {
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        const d = Math.hypot((x - u.x) * sx, (y - u.y) * sy);
        if (d <= tol) list.push({ x, y, slot, d });
      };
      if (showInterRef.current)
        interRef.current.forEach((p) => consider(specials, p.x, p.y, null, 16));
      if (showAxisRef.current)
        axisRef.current.forEach((arr, i) =>
          arr.forEach((p) => consider(specials, p.x, p.y, i, 14)),
        );
      if (showExtRef.current)
        extRef.current.forEach((arr, i) =>
          arr.forEach((p) => consider(specials, p.x, p.y, i, 14)),
        );
      fnsRef.current.forEach((fn, i) => {
        if (!fn) return;
        const y = fn(u.x);
        if (!Number.isFinite(y)) return;
        const d = Math.abs(y - u.y) * sy;
        if (d <= 26) curves.push({ x: u.x, y, slot: i, d });
      });
      const pool = specials.length > 0 ? specials : curves;
      if (pool.length === 0) {
        if (e.pointerType === "touch") queueTrace(u.x);
        return;
      }
      const best = pool.reduce((p, q) => (q.d < p.d ? q : p));
      const fn = best.slot !== null ? fnsRef.current[best.slot] : null;
      const slope = fn ? derivative(fn, best.x) : null;
      if (e.pointerType === "touch") queueTrace(best.x);
      setPins((prev) => {
        const dup = prev.some(
          (p) => Math.abs(p.x - best.x) < 1e-9 && Math.abs(p.y - best.y) < 1e-9,
        );
        if (dup) return prev;
        const next = [
          ...prev,
          {
            id: pinIdRef.current++,
            x: best.x,
            y: best.y,
            slot: best.slot,
            slope: slope !== null && Number.isFinite(slope) ? slope : null,
          },
        ];
        return next.slice(-MAX_PINS);
      });
      // nilai titik langsung tampil, walau panel sedang disembunyikan
      setMessage(`Titik ${ptText(best)}`);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY || e.deltaX;
      if (e.deltaMode === 1) delta *= 33;
      if (e.deltaMode === 2) delta *= 400;
      const k = Math.exp(Math.max(-120, Math.min(120, delta)) * 0.0015);
      const u = toUsr(e);
      let fx = k;
      let fy = k;
      if (!lockRef.current) {
        if (e.ctrlKey || e.metaKey)
          fy = 1; // hanya sumbu x
        else if (e.shiftKey) fx = 1; // hanya sumbu y
      }
      const nx1 = u.x + (u.x1 - u.x) * fx;
      const nx2 = u.x + (u.x2 - u.x) * fx;
      const ny1 = u.y + (u.y1 - u.y) * fy;
      const ny2 = u.y + (u.y2 - u.y) * fy;
      const w = nx2 - nx1;
      const h = ny1 - ny2;
      if (!(w > 1e-9 && w < 1e9 && h > 1e-9 && h < 1e9)) return;
      board.setBoundingBox([nx1, ny1, nx2, ny2], lockRef.current);
      scheduleRecompute();
      if (!Number.isNaN(traceXRef.current)) queueTrace(toUsr(e).x);
    };

    el.addEventListener("pointerdown", onDown, true);
    el.addEventListener("pointermove", onMove, true);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerup", onUp, true);
    el.addEventListener("pointercancel", onCancel, true);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    // Saat ukuran papan berubah (putar layar, layar penuh), pertahankan skala
    // dan titik tengah bila rasio 1:1 dikunci.
    let last = { w: el.clientWidth, h: el.clientHeight };
    const sync = (force = false) => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0 || (!force && w === last.w && h === last.h)) return;
      const bb = board.getBoundingBox();
      const spanX = bb[2] - bb[0];
      const spanY = bb[1] - bb[3];
      board.resizeContainer(w, h, true, true);
      if (
        lockRef.current &&
        last.w > 0 &&
        last.h > 0 &&
        spanX > 0 &&
        spanY > 0
      ) {
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
      scheduleRecompute();
    };
    syncSizeRef.current = sync;
    const observer = new ResizeObserver(() => sync());
    observer.observe(el);

    return () => {
      syncSizeRef.current = null;
      observer.disconnect();
      el.removeEventListener("pointerdown", onDown, true);
      el.removeEventListener("pointermove", onMove, true);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerup", onUp, true);
      el.removeEventListener("pointercancel", onCancel, true);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("pointercancel", onWindowUp);
      if (panRaf !== null) cancelAnimationFrame(panRaf);
      panningRef.current = false;
      el.removeEventListener("wheel", onWheel);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (traceRaf !== null) cancelAnimationFrame(traceRaf);
      rafRef.current = null;
      JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // Sinkronkan fungsi yang aktif ke papan lalu hitung ulang
  useEffect(() => {
    Object.assign(pRef.current, params);
    fnsRef.current = Array.from({ length: MAX_SLOTS }, (_, i) => {
      const slot = slots[i];
      const result = parsed[i];
      return slot && slot.on && result && result.ok ? result.fn : null;
    });
    derRef.current = Array.from(
      { length: MAX_SLOTS },
      (_, i) => !!slots[i]?.der,
    );
    showInterRef.current = showInter;
    showAxisRef.current = showAxis;
    showExtRef.current = showExt;
    showTanRef.current = showTan;
    boardRef.current?.update();
    recompute();
    if (Number.isFinite(traceXRef.current)) {
      setTrace({ x: traceXRef.current, rows: traceRows(traceXRef.current) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, parsed, params, showInter, showAxis, showExt, showTan]);

  useEffect(() => {
    if (!showTan) {
      traceXRef.current = Number.NaN;
      tanRef.current = [];
      boardRef.current?.update();
      setTrace(null);
    }
  }, [showTan]);

  useEffect(() => {
    pinRef.current = pins;
    boardRef.current?.update();
  }, [pins]);

  // Kunci / lepas rasio 1:1
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    lockRef.current = lockRatio;
    const raw = board as unknown as {
      keepaspectratio?: boolean;
      attr?: { keepaspectratio?: boolean };
    };
    raw.keepaspectratio = lockRatio;
    if (raw.attr) raw.attr.keepaspectratio = lockRatio;
    if (lockRatio) board.setBoundingBox(board.getBoundingBox(), true);
    scheduleRecompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockRatio]);

  // Animasi parameter (bolak-balik antara PARAM_MIN dan PARAM_MAX)
  useEffect(() => {
    if (!anim) return undefined;
    let raf = 0;
    let last = performance.now();
    let dir = 1;
    let value = pRef.current[anim] ?? 1;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      value += dir * dt * PARAM_SPEED;
      if (value >= PARAM_MAX) {
        value = PARAM_MAX;
        dir = -1;
      } else if (value <= PARAM_MIN) {
        value = PARAM_MIN;
        dir = 1;
      }
      const rounded = Math.round(value * 100) / 100;
      setParams((prev) => ({ ...prev, [anim]: rounded }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim]);

  useEffect(() => {
    if (anim && !usedParams.includes(anim as (typeof PARAM_NAMES)[number]))
      setAnim(null);
  }, [anim, usedParams]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [message]);

  // Sinkron saat keluar lewat Esc / gestur sistem.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && nativeFsRef.current) {
        nativeFsRef.current = false;
        setIsFull(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !document.fullscreenElement &&
        !nativeFsRef.current
      ) {
        setIsFull(false);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Layar sentuh: kunci ke lanskap saat layar penuh (bila diizinkan browser).
  useEffect(() => {
    if (!isFull) return undefined;
    if (!window.matchMedia("(pointer: coarse)").matches) return undefined;
    const orientation = (
      screen as unknown as {
        orientation?: {
          lock?: (mode: "landscape") => Promise<void>;
          unlock?: () => void;
        };
      }
    ).orientation;
    if (typeof orientation?.lock !== "function") return undefined;
    orientation.lock("landscape").catch(() => undefined);
    return () => {
      try {
        orientation.unlock?.();
      } catch {
        /* abaikan */
      }
    };
  }, [isFull]);

  // Masuk/keluar layar penuh mengubah ukuran kontainer dua kali (tata letak
  // CSS, lalu layar penuh asli). Sinkronkan ulang setelah transisi.
  useEffect(() => {
    const run = () => syncSizeRef.current?.(true);
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
  }, [isFull]);

  /* ───────── Nilai turunan ───────── */

  const pairList = results.pairs.filter(
    (pair) => drawn[pair.i] && drawn[pair.j],
  );
  const anyDerivative = slots.some((slot, i) => slot.der && drawn[i]);
  const tableAxes = results.axes.filter((axis) => drawn[axis.i]);
  const activeSlot = Math.min(active, slots.length - 1);

  const optionRows: {
    key: string;
    label: string;
    on: boolean;
    set: (value: boolean) => void;
  }[] = [
    {
      key: "inter",
      label: "Titik potong",
      on: showInter,
      set: setShowInter,
    },
    {
      key: "axis",
      label: "Sumbu x & y",
      on: showAxis,
      set: setShowAxis,
    },
    {
      key: "ext",
      label: "Maks / min",
      on: showExt,
      set: setShowExt,
    },
    {
      key: "tan",
      label: "Singgung & nilai kursor",
      on: showTan,
      set: setShowTan,
    },
    {
      key: "lock",
      label: "Skala 1 : 1",
      on: lockRatio,
      set: setLockRatio,
    },
  ];

  const guideRows: [string, string][] = [
    ["Pangkat", "x^2, x^{-3}, 2^x"],
    ["Pecahan", "\\frac{x+1}{x-2}"],
    ["Akar", "\\sqrt{x+1}, \\sqrt[3]{x}"],
    ["e dan π", "e^{x}, e^{-x^2}, \\pi"],
    ["Trigonometri (rad)", "\\sin x, \\sin^2 x, \\cos(2x)"],
    ["Logaritma", "\\ln x, \\log x, \\log_{2} x"],
    ["Nilai mutlak", "|x-3|"],
    ["Perkalian", "2x, (x+1)(x-1), x\\cdot 2"],
    ["Parameter", "ax^2+bx+c, a\\sin(kx)"],
  ];

  return (
    <div ref={rootRef} className={`gp${isFull ? " is-fs" : ""}`}>
      <p className="gp-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>
          Miringkan ponsel ke mode lanskap agar grafik dan pengatur nyaman
          dipakai.
        </span>
      </p>

      <div className="gp-layout">
        {/* ───── Grafik ───── */}
        <section className="gp-graph" aria-label="Penggambar grafik">
          <div className="gp-stage">
            <div
              id={boardId}
              ref={containerRef}
              className="gp-board"
              tabIndex={0}
              onKeyDown={onBoardKey}
              aria-label="Grafik hingga enam fungsi. Seret untuk menggeser, gulir atau cubit untuk memperbesar, ketuk atau klik untuk menyematkan titik. Tombol panah menggeser, plus dan minus memperbesar atau memperkecil, nol mengembalikan tampilan."
            />

            {drawnCount === 0 && (
              <p className="gp-empty">
                Ketik rumus di tab <strong>Fungsi</strong> untuk mulai
                menggambar.
              </p>
            )}

            {trace && trace.rows.length > 0 && (
              <div className="gp-hud" aria-live="off">
                <p className="gp-chip">
                  <b>x = {fmt(trace.x)}</b>
                </p>
                <p className="gp-pinfo">
                  {trace.rows.map((row) => (
                    <span key={row.i}>
                      <i style={{ background: SLOT_COLORS[row.i] }} />
                      y = {fmt(row.y)} · m = {fmt(row.dy)}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {message && (
              <p className="gp-toast" role="status">
                {message}
              </p>
            )}

            <div className="gp-tools" role="group" aria-label="Alat tampilan">
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-pressed={isFull}
                aria-label={isFull ? "Keluar layar penuh" : "Layar penuh"}
                title={isFull ? "Keluar layar penuh" : "Layar penuh"}
              >
                {isFull ? (
                  <Minimize2 size={16} aria-hidden="true" />
                ) : (
                  <Maximize2 size={16} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={zoomIn}
                aria-label="Perbesar"
                title="Perbesar (+)"
              >
                <Plus size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={zoomOut}
                aria-label="Perkecil"
                title="Perkecil (−)"
              >
                <Minus size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={resetView}
                aria-label="Kembali ke tampilan awal"
                title="Kembali ke tampilan awal (0)"
              >
                <Crosshair size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={fitView}
                aria-label="Sesuaikan tinggi jendela dengan nilai grafik"
                title="Sesuaikan tinggi jendela dengan nilai grafik"
              >
                <ArrowUpDown size={16} aria-hidden="true" />
              </button>
              {isFull && (
                <button
                  type="button"
                  className="gp-toggle"
                  onClick={() => setPanelOpen((open) => !open)}
                  aria-pressed={panelOpen}
                  aria-controls={`gp-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="gp-legend" aria-label="Legenda grafik">
            {slots.map((_, i) => {
              const result = parsed[i];
              if (!drawn[i] || !result || !result.ok) return null;
              return (
                <li key={`g${i}`}>
                  <i style={{ borderColor: SLOT_COLORS[i] }} />
                  <span>y = {result.text}</span>
                </li>
              );
            })}
            {anyDerivative && (
              <li>
                <i className="dash" style={{ borderColor: "#64748b" }} />
                <span>turunan f′(x)</span>
              </li>
            )}
            {showInter && drawnCount >= 2 && (
              <li>
                <b style={{ background: INTER_COLOR }} />
                <span>titik potong</span>
              </li>
            )}
            {showAxis && (
              <li>
                <b style={{ background: "#64748b" }} />
                <span>potong sumbu</span>
              </li>
            )}
            {showExt && (
              <li>
                <b className="diamond" style={{ background: "#64748b" }} />
                <span>maks / min</span>
              </li>
            )}
            {pins.length > 0 && (
              <li>
                <b className="square" style={{ background: PIN_COLOR }} />
                <span>titik tersemat</span>
              </li>
            )}
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`gp-panel-${baseId}`}
          className={`gp-panel${isFull ? " is-floating" : ""}${isFull && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur penggambar grafik"
        >
          <div className="gp-tabs" role="group" aria-label="Bagian panel">
            {panelTabs.map((item) => (
              <button
                key={item.tab}
                type="button"
                aria-pressed={tab === item.tab}
                onClick={() => setTab(item.tab)}
              >
                {item.label}
                {item.tab === "res" && pins.length > 0 && (
                  <span className="gp-badge">{pins.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ───── Fungsi ───── */}
          {tab === "fn" && (
            <>
              <div className="gp-slots">
                {slots.map((slot, i) => {
                  const result = parsed[i];
                  const isError = !!result && !result.ok;
                  const color = SLOT_COLORS[i];
                  return (
                    <div
                      className={`gp-slot${slot.on ? "" : " is-off"}`}
                      key={i}
                      style={{ "--sc": color } as CSSProperties}
                    >
                      <b className="gp-num-badge" aria-hidden="true">
                        {i + 1}
                      </b>
                      <input
                        id={`gp-src-${baseId}-${i}`}
                        ref={(el) => {
                          inputRefs.current[i] = el;
                        }}
                        className="gp-input"
                        type="text"
                        value={slot.src}
                        placeholder={`y = ${PLACEHOLDERS[i]}`}
                        aria-label={`Rumus grafik ${i + 1}, y sama dengan`}
                        aria-invalid={isError}
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        onFocus={() => setActive(i)}
                        onChange={(event) =>
                          setSlot(i, { src: event.currentTarget.value })
                        }
                      />
                      <div className="gp-slot-acts">
                        <button
                          type="button"
                          className="gp-mini"
                          aria-pressed={slot.on}
                          aria-label={`${slot.on ? "Sembunyikan" : "Tampilkan"} grafik ${i + 1}`}
                          title={slot.on ? "Sembunyikan grafik" : "Tampilkan grafik"}
                          onClick={() => setSlot(i, { on: !slot.on })}
                        >
                          {slot.on ? (
                            <Eye size={14} aria-hidden="true" />
                          ) : (
                            <EyeOff size={14} aria-hidden="true" />
                          )}
                        </button>
                        <button
                          type="button"
                          className="gp-mini gp-der"
                          aria-pressed={slot.der}
                          aria-label={`Turunan grafik ${i + 1}`}
                          title="Gambar turunan f′(x) sebagai garis putus-putus"
                          onClick={() => setSlot(i, { der: !slot.der })}
                        >
                          f′
                        </button>
                        <button
                          type="button"
                          className="gp-mini"
                          aria-label={`Hapus grafik ${i + 1}`}
                          title="Hapus grafik ini"
                          disabled={slots.length <= 1}
                          onClick={() => removeSlot(i)}
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                      </div>
                      {isError && result && !result.ok && (
                        <p className="gp-err" role="status">
                          {result.error}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {slots.length < MAX_SLOTS && (
                <button type="button" className="gp-action" onClick={addSlot}>
                  <Plus size={13} aria-hidden="true" />
                  <span>Tambah grafik</span>
                </button>
              )}

              {usedParams.length > 0 && (
                <div className="gp-params" role="group" aria-label="Parameter">
                  {usedParams.map((name) => (
                    <ParamRow
                      key={name}
                      name={name}
                      value={params[name] ?? 1}
                      playing={anim === name}
                      onSlide={(v) => {
                        setAnim(null);
                        setParam(name, v);
                      }}
                      onNudge={(d) => nudgeParam(name, d)}
                      onPlay={() => setAnim(anim === name ? null : name)}
                    />
                  ))}
                </div>
              )}

              <div className="gp-snips" role="group" aria-label={`Sisipkan ke grafik ${activeSlot + 1}`}>
                {SNIPPETS.map((snippet) => (
                  <button
                    key={snippet.label}
                    type="button"
                    title={`${snippet.title} (ke grafik ${activeSlot + 1})`}
                    aria-label={snippet.title}
                    // mencegah papan ketik layar menutup saat menyisipkan
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => insertSnippet(snippet.text)}
                  >
                    {snippet.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ───── Opsi ───── */}
          {tab === "opt" && (
            <>
              <div className="gp-chips" role="group" aria-label="Tampilkan di grafik">
                {optionRows.map((row) => (
                  <button
                    key={row.key}
                    type="button"
                    aria-pressed={row.on}
                    onClick={() => row.set(!row.on)}
                  >
                    {row.label}
                  </button>
                ))}
              </div>

              <div className="gp-presets" role="group" aria-label="Contoh cepat">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    style={{ "--kc": preset.color } as CSSProperties}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <GraphAppearanceControls appearance={appearance} onStep={onStep} />

              <div className="gp-files">
                <button type="button" className="gp-action" onClick={exportPng}>
                  <Download size={13} aria-hidden="true" />
                  <span>Unduh PNG</span>
                </button>
                <button type="button" className="gp-action" onClick={copyLink}>
                  <Link2 size={13} aria-hidden="true" />
                  <span>Salin tautan</span>
                </button>
              </div>
            </>
          )}

          {/* ───── Hasil ───── */}
          {tab === "res" && (
            <>
              {pins.length > 0 && (
                <div className="gp-pins">
                  <div className="gp-pins-head">
                    <span>Titik tersemat</span>
                    <button type="button" onClick={() => setPins([])}>
                      Hapus semua
                    </button>
                  </div>
                  <ul>
                    {pins.map((pin) => (
                      <li key={pin.id}>
                        <i
                          style={{
                            background:
                              pin.slot === null
                                ? INTER_COLOR
                                : SLOT_COLORS[pin.slot],
                          }}
                        />
                        <span>{ptText(pin)}</span>
                        {pin.slope !== null && (
                          <small>m = {fmt(pin.slope)}</small>
                        )}
                        <button
                          type="button"
                          aria-label={`Hapus titik ${ptText(pin)}`}
                          onClick={() =>
                            setPins((prev) => prev.filter((p) => p.id !== pin.id))
                          }
                        >
                          <X size={12} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pins.length === 0 && drawnCount > 0 && (
                <p className="gp-note">
                  Ketuk grafik atau titik istimewa untuk menyematkan titik dan
                  melihat nilainya di sini.
                </p>
              )}

              {drawnCount < 2 && (
                <p className="gp-note" role="status">
                  Aktifkan dan isi minimal dua grafik untuk melihat titik potong
                  antargrafik.
                </p>
              )}

              {pairList.length > 0 && (
                <dl className="gp-readouts" aria-live="polite">
                  {pairList.map((pair) => (
                    <div className="gp-wide" key={`${pair.i}-${pair.j}`}>
                      <dt>
                        <i style={{ background: SLOT_COLORS[pair.i] }} />
                        <i style={{ background: SLOT_COLORS[pair.j] }} />
                        Grafik {pair.i + 1} ∩ {pair.j + 1}
                        {!pair.coincident && pair.pts.length > 0 && (
                          <small>
                            {pair.pts.length > 8
                              ? ` · ${pair.pts.length} titik (8 pertama)`
                              : ` · ${pair.pts.length} titik`}
                          </small>
                        )}
                      </dt>
                      <dd>
                        {pair.coincident
                          ? "Berimpit"
                          : pair.pts.length === 0
                            ? "Tidak berpotongan pada tampilan"
                            : pair.pts
                                .slice(0, 8)
                                .map((p) => ptText(p))
                                .join("  ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {(showAxis || showExt) && tableAxes.length > 0 && (
                <dl className="gp-readouts" aria-live="polite">
                  {tableAxes.map((axis) => (
                    <div className="gp-wide" key={axis.i}>
                      <dt>
                        <i style={{ background: SLOT_COLORS[axis.i] }} />
                        Grafik {axis.i + 1}
                      </dt>
                      <dd>
                        {showAxis && (
                          <span>
                            Sumbu y:{" "}
                            {axis.yInt ? ptText(axis.yInt) : "tidak ada"}
                          </span>
                        )}
                        {showAxis && (
                          <span>
                            Sumbu x:{" "}
                            {axis.xInts.length === 0
                              ? "tidak ada"
                              : axis.xInts
                                  .slice(0, 6)
                                  .map((p) => ptText(p))
                                  .join("  ")}
                          </span>
                        )}
                        {showExt && (
                          <span>
                            Maks / min:{" "}
                            {axis.ext.length === 0
                              ? "tidak ada"
                              : axis.ext
                                  .map(
                                    (p) =>
                                      `${p.kind === "max" ? "maks" : "min"} ${ptText(p)}`,
                                  )
                                  .join("  ")}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}

          {/* ───── Info ───── */}
          {tab === "info" && (
            <>
              <dl className="gp-readouts gp-guide">
                {guideRows.map(([key, value]) => cell(key, value))}
                {cell(
                  "Sentuh & mouse",
                  "seret = geser · roda / cubit = zoom · ketuk / klik = sematkan titik. Skala tidak dikunci: Ctrl + roda = sumbu x, Shift + roda = sumbu y.",
                  undefined,
                  true,
                )}
                {cell(
                  "Papan fokus",
                  "panah = geser · + / − = zoom · 0 = reset",
                  undefined,
                  true,
                )}
              </dl>
              <p className="gp-note">
                Pakai kurung kurawal untuk pangkat lebih dari satu karakter,
                misalnya x^{"{10}"}. Awalan y = atau f(x) = boleh ditulis. Huruf
                a, b, c, k otomatis menjadi slider. Turunan dan gradien dihitung
                numerik, titik potong dicari pada rentang x yang terlihat.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default GraphPlotterSimulation;
