import {
  Crosshair,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import JXG from "jsxgraph";
import "../styles/jsxgraph.css";
import "./LinearSystemSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";
import {
  OP_SYMBOL,
  boxPoly,
  clipByCons,
  clipToBox,
  feasibleRegion,
  fmtN,
  formatEq,
  handlePoints,
  lineFromPoints,
  normalizeLine,
  optimize,
  ptText,
  sameLine,
  solve2,
  validLine,
  type Box,
  type Cons,
  type Goal,
  type Line,
  type Op,
  type Opt,
  type Pt,
  type Sol,
} from "./linearMath";

/* Simulasi sistem linear — tema slate seperti landing page 1729 dan
   simulasi fungsi kuadrat. Urutan desain: ponsel lanskap → desktop →
   ponsel potret. Layar penuh: grafik 100% layar, toolbar dan panel
   pengatur mengambang. */

/* ───────── Tipe ───────── */

type Mode = "spldv" | "ptlsv" | "lp";
type Tab = "lines" | "goal" | "view" | "result";
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type JEl = {
  X(): number;
  Y(): number;
  setPosition(method: number, coords: number[]): unknown;
  setAttribute(attrs: Record<string, unknown>): unknown;
  hide(): void;
  show(): void;
  on(event: string, handler: () => void): unknown;
};
type CurveLike = {
  updateDataArray: () => void;
  dataX: number[];
  dataY: number[];
};
type Analysis = {
  sol: Sol | null;
  verts: Pt[];
  empty: boolean;
  unbounded: boolean;
  opt: Opt | null;
  zLo: number;
  zHi: number;
  zAllMin: number;
  zAllMax: number;
};
type Preset = {
  label: string;
  cons: Cons[];
  p?: number;
  q?: number;
  goal?: Goal;
};

/* ───────── Konstanta ───────── */

const MAX_LINES = 4;
const VERT_POOL = 8;
const OPT_POOL = 4;

/* Warna grafik: dipakai juga oleh legenda dan hasil di panel. */
const LINE_COLORS = ["#2563eb", "#ea580c", "#7c3aed", "#059669"];
const REGION_COLOR = "#0ea5e9";
const INTER_COLOR = "#e11d48";
const OPT_COLOR = "#ca8a04";
const VERT_COLOR = "#0f172a";

const HOME: Record<Mode, Box> = {
  spldv: [-8, 8, 8, -8],
  ptlsv: [-2, 12, 12, -2],
  lp: [-2, 12, 12, -2],
};
const COORDS_BY_USER: number =
  (JXG as unknown as { COORDS_BY_USER?: number }).COORDS_BY_USER ?? 1;

const C = (a: number, b: number, c: number, op: Op): Cons => ({ a, b, c, op });

const SPLDV_PRESETS: Preset[] = [
  { label: "Satu titik potong", cons: [C(1, 1, 5, "="), C(1, -1, 1, "=")] },
  { label: "Soal cerita", cons: [C(2, 3, 12, "="), C(1, -1, 1, "=")] },
  { label: "Sejajar", cons: [C(1, 1, 4, "="), C(1, 1, 1, "=")] },
  { label: "Berimpit", cons: [C(1, 1, 4, "="), C(2, 2, 8, "=")] },
];

const LP_PRESETS: Preset[] = [
  { label: "Maksimum dasar", cons: [C(1, 1, 4, "<="), C(1, 3, 6, "<=")], p: 2, q: 3, goal: "max" },
  { label: "Pabrik roti", cons: [C(2, 1, 8, "<="), C(1, 2, 10, "<=")], p: 3, q: 4, goal: "max" },
  {
    label: "Tiga kendala",
    cons: [C(1, 0, 4, "<="), C(0, 1, 3, "<="), C(1, 1, 5, "<=")],
    p: 5,
    q: 4,
    goal: "max",
  },
  { label: "Minimum biaya", cons: [C(1, 1, 4, ">="), C(1, 3, 6, ">=")], p: 2, q: 3, goal: "min" },
  { label: "Tanpa daerah layak", cons: [C(1, 1, 2, "<="), C(1, 1, 5, ">=")], p: 1, q: 1, goal: "max" },
];

const MODES: { id: Mode; label: string }[] = [
  { id: "spldv", label: "SPLDV" },
  { id: "ptlsv", label: "Pertidaksamaan" },
  { id: "lp", label: "Program linear" },
];

const OPS: Op[] = ["<=", ">=", "<", ">"];

const fmtInput = (v: number) => String(Math.round(v * 1000) / 1000);

/* ───────── Komponen kecil ───────── */

/** Kolom angka: boleh diketik bebas, nilai valid langsung dikirim. */
function NumField({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [text, setText] = useState(fmtInput(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(fmtInput(value));
  }, [value, focused]);
  return (
    <input
      className="ls-num"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      enterKeyHint="done"
      spellCheck={false}
      aria-label={label}
      value={text}
      onChange={(e) => {
        const t = e.currentTarget.value;
        setText(t);
        const v = parseFloat(t.replace(",", "."));
        if (Number.isFinite(v) && /^-?\d*[.,]?\d*$/.test(t.trim())) onChange(v);
      }}
      onFocus={(e) => {
        setFocused(true);
        e.currentTarget.select();
      }}
      onBlur={() => setFocused(false)}
    />
  );
}

/** Satu baris garis selidik:  z  −  ────●────  +  [ 12 ] */
function LevelSlider({
  value,
  min,
  max,
  onSlide,
  onNudge,
}: {
  value: number;
  min: number;
  max: number;
  onSlide: (value: number) => void;
  onNudge: (direction: 1 | -1) => void;
}) {
  const stepRef = useRef(onNudge);
  stepRef.current = onNudge;
  const timers = useRef<{ delay?: number; repeat?: number }>({});
  const stop = () => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.repeat);
    timers.current = {};
  };
  useEffect(() => stop, []);

  // Tahan − / + untuk mengubah nilai terus-menerus.
  const bind = (dir: 1 | -1) => ({
    type: "button" as const,
    className: "ls-step",
    "aria-label": `${dir === 1 ? "Tambah" : "Kurangi"} z 1`,
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stop();
      stepRef.current(dir);
      timers.current.delay = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(() => stepRef.current(dir), 80);
      }, 400);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onBlur: stop,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    // detail === 0 → aktivasi lewat keyboard
    onClick: (e: { detail: number }) => {
      if (e.detail === 0) stepRef.current(dir);
    },
  });

  const span = max - min || 1;
  const clamped = Math.min(max, Math.max(min, value));
  const style = {
    "--fill": `${((clamped - min) / span) * 100}%`,
    "--sc": OPT_COLOR,
  } as CSSProperties;

  return (
    <div className="ls-slider" style={style}>
      <label>z</label>
      <button {...bind(-1)}>
        <Minus size={14} aria-hidden="true" />
      </button>
      <input
        className="ls-range"
        type="range"
        min={min}
        max={max}
        step="any"
        value={clamped}
        aria-label="Penggeser garis selidik"
        aria-valuetext={`z sama dengan ${fmtN(value)}`}
        onChange={(e) => onSlide(Number(e.currentTarget.value))}
      />
      <button {...bind(1)}>
        <Plus size={14} aria-hidden="true" />
      </button>
      <NumField value={value} label="Nilai z garis selidik" onChange={onSlide} />
    </div>
  );
}

/* ───────── Komponen utama ───────── */

export function LinearSystemSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `ls-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);

  const [tab, setTab] = useState<Tab>("lines");
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // objek papan
  const objsRef = useRef<{ line: JEl; p1: JEl; p2: JEl }[]>([]);
  const levelRef = useRef<JEl | null>(null);
  const levelLineRef = useRef<JEl | null>(null);
  const levelTextRef = useRef<JEl | null>(null);
  const testRef = useRef<JEl | null>(null);
  const vertTextRef = useRef<JEl[]>([]);
  const interTextRef = useRef<JEl | null>(null);

  // data yang dibaca papan (selalu lewat ref)
  const linesRef = useRef<Cons[]>([]);
  const handleAbcRef = useRef<(Line | null)[]>([]);
  const dragRef = useRef<{ i: number; kind: "line" | "handle" } | null>(null);
  const dashRef = useRef<number[]>([]);
  const regionDataRef = useRef<Pt[]>([]);
  const halfDataRef = useRef<Pt[][]>([[], [], [], []]);
  const vertsRef = useRef<Pt[]>([]);
  const optPtsRef = useRef<Pt[]>([]);
  const solRef = useRef<Sol | null>(null);
  const visTextRef = useRef<boolean[]>([]);
  const analysisRef = useRef<Analysis | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastKeyRef = useRef("");

  const [mode, setMode] = useStoredSimulationState<Mode>("linear-system.mode", "lp");
  const [eq, setEq] = useStoredSimulationState<Cons[]>(
    "linear-system.equations",
    SPLDV_PRESETS[0].cons,
  );
  const [ineq, setIneq] = useStoredSimulationState<Cons[]>(
    "linear-system.inequalities",
    LP_PRESETS[0].cons,
  );
  const [nonneg, setNonneg] = useStoredSimulationState("linear-system.nonnegative", true);
  const [showHalf, setShowHalf] = useStoredSimulationState("linear-system.show-regions", true);
  const [snap, setSnap] = useStoredSimulationState("linear-system.snap", true);
  const [p, setP] = useStoredSimulationState("linear-system.objective-p", 2);
  const [q, setQ] = useStoredSimulationState("linear-system.objective-q", 3);
  const [goal, setGoal] = useStoredSimulationState<Goal>("linear-system.goal", "max");
  const [k, setK] = useStoredSimulationState("linear-system.level", 0);
  const [anim, setAnim] = useState(false);
  const [testPt, setTestPt] = useStoredSimulationState<Pt>("linear-system.test-point", {
    x: 1,
    y: 1,
  });
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const modeRef = useRef<Mode>(mode);
  const nonnegRef = useRef(nonneg);
  const showHalfRef = useRef(showHalf);
  const snapRef = useRef(snap);
  const pqRef = useRef({ p, q, goal });
  const kRef = useRef(k);

  const lines = mode === "spldv" ? eq : ineq;

  /* ───────── Perhitungan ───────── */

  const scheduleRecompute = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      recompute();
    });
  };

  const buildCons = (list: Cons[], withNonneg: boolean): Cons[] => {
    const out = list.filter(validLine);
    if (withNonneg) out.push(C(1, 0, 0, ">="), C(0, 1, 0, ">="));
    return out;
  };

  const recompute = () => {
    const board = boardRef.current;
    if (!board) return;
    const curMode = modeRef.current;
    const list = linesRef.current;
    const [x1, y1, x2, y2] = board.getBoundingBox();
    const mx = (x2 - x1) * 0.02;
    const my = (y1 - y2) * 0.02;
    const vbox: Box = [x1 - mx, y1 + my, x2 + mx, y2 - my];
    const vpoly = boxPoly(vbox[0], vbox[1], vbox[2], vbox[3]);

    const next: Analysis = {
      sol: null,
      verts: [],
      empty: false,
      unbounded: false,
      opt: null,
      zLo: -20,
      zHi: 20,
      zAllMin: -Infinity,
      zAllMax: Infinity,
    };
    regionDataRef.current = [];
    halfDataRef.current = [[], [], [], []];
    optPtsRef.current = [];

    if (curMode === "spldv") {
      const [l1, l2] = list;
      if (l1 && l2 && validLine(l1) && validLine(l2)) next.sol = solve2(l1, l2);
    } else {
      const region = feasibleRegion(buildCons(list, nonnegRef.current));
      next.verts = region.vertices;
      next.empty = region.empty;
      next.unbounded = region.unbounded;
      if (!region.empty) regionDataRef.current = clipToBox(region.poly, vbox);
      if (showHalfRef.current) {
        list.forEach((c, i) => {
          if (validLine(c)) halfDataRef.current[i] = clipByCons(vpoly, c);
        });
      }
      const { p: pp, q: qq, goal: gg } = pqRef.current;
      if (curMode === "lp") {
        next.opt = optimize(region, pp, qq, gg);
        if (next.opt.status === "optimal") optPtsRef.current = next.opt.points.slice(0, OPT_POOL);
        const zs = region.vertices.map((v) => pp * v.x + qq * v.y);
        if (zs.length > 0) {
          const lo = Math.min(...zs);
          const hi = Math.max(...zs);
          const pad = Math.max(1, (hi - lo) * 0.3);
          next.zLo = lo - pad;
          next.zHi = hi + pad;
        }
        if (!region.empty) {
          const all = region.poly.map((v) => pp * v.x + qq * v.y);
          next.zAllMin = Math.min(...all);
          next.zAllMax = Math.max(...all);
        }
      }
    }
    solRef.current = next.sol;
    vertsRef.current = next.verts.slice(0, VERT_POOL);
    analysisRef.current = next;

    // label titik sudut / titik potong: tampil hanya bila ada datanya
    const wantVisible: boolean[] = [];
    for (let i = 0; i < VERT_POOL; i += 1) {
      wantVisible[i] = i < vertsRef.current.length && curMode !== "spldv";
    }
    wantVisible[VERT_POOL] = curMode === "spldv" && next.sol?.kind === "unique";
    wantVisible.forEach((want, i) => {
      if (visTextRef.current[i] === want) return;
      visTextRef.current[i] = want;
      const el = i < VERT_POOL ? vertTextRef.current[i] : interTextRef.current;
      if (!el) return;
      if (want) el.show();
      else el.hide();
    });

    board.update();

    const key = JSON.stringify(next);
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      setAnalysis(next);
    }
  };

  /* ───────── Garis selidik ───────── */

  const moveLevel = (value: number) => {
    const { p: pp, q: qq } = pqRef.current;
    const s = pp * pp + qq * qq;
    kRef.current = value;
    setK(value);
    const h = levelRef.current;
    if (h && s > 1e-12) {
      h.setPosition(COORDS_BY_USER, [(value * pp) / s, (value * qq) / s]);
      boardRef.current?.update();
    }
  };

  /* ───────── Tampilan ───────── */

  const zoomIn = () => {
    boardRef.current?.zoomIn();
    scheduleRecompute();
  };
  const zoomOut = () => {
    boardRef.current?.zoomOut();
    scheduleRecompute();
  };
  const center = () => {
    boardRef.current?.setBoundingBox(HOME[modeRef.current], true);
    scheduleRecompute();
  };
  const panBy = (fx: number, fy: number) => {
    const board = boardRef.current;
    if (!board) return;
    const [x1, y1, x2, y2] = board.getBoundingBox();
    const dx = (x2 - x1) * fx;
    const dy = (y1 - y2) * fy;
    board.setBoundingBox([x1 + dx, y1 + dy, x2 + dx, y2 + dy], true);
    scheduleRecompute();
  };
  const onBoardKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const s = e.shiftKey ? 0.4 : 0.1;
    switch (e.key) {
      case "ArrowLeft":
        panBy(-s, 0);
        break;
      case "ArrowRight":
        panBy(s, 0);
        break;
      case "ArrowUp":
        panBy(0, s);
        break;
      case "ArrowDown":
        panBy(0, -s);
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
        center();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const toggleFs = async () => {
    const el = rootRef.current;
    if (!el) return;
    if (!isFs) {
      setPanelOpen(false);
      setIsFs(true);
      if (el.requestFullscreen) {
        try {
          await el.requestFullscreen();
          nativeFsRef.current = true;
        } catch {
          /* tetap pakai layar penuh CSS */
        }
      }
    } else {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          /* diabaikan */
        }
      }
      nativeFsRef.current = false;
      setIsFs(false);
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
      if (e.key === "Escape" && !document.fullscreenElement && !nativeFsRef.current) {
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

  /* ───────── Masukan ───────── */

  const updateLine = (i: number, patch: Partial<Cons>) => {
    const apply = (prev: Cons[]) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    if (mode === "spldv") setEq(apply);
    else setIneq(apply);
  };

  const changeMode = (next: Mode) => {
    if (next === mode) return;
    setAnim(false);
    setMode(next);
  };

  const presets = mode === "spldv" ? SPLDV_PRESETS : LP_PRESETS;

  const applyPreset = (preset: Preset) => {
    setAnim(false);
    if (mode === "spldv") {
      setEq(preset.cons.map((c) => ({ ...c })));
    } else {
      setIneq(preset.cons.map((c) => ({ ...c })));
      setNonneg(true);
      if (preset.p !== undefined) setP(preset.p);
      if (preset.q !== undefined) setQ(preset.q);
      if (preset.goal) setGoal(preset.goal);
      pqRef.current = {
        p: preset.p ?? pqRef.current.p,
        q: preset.q ?? pqRef.current.q,
        goal: preset.goal ?? pqRef.current.goal,
      };
      moveLevel(0);
    }
    handleAbcRef.current = [];
    center();
  };

  const resetAll = () => {
    setSnap(true);
    setShowHalf(true);
    applyPreset(presets[0]);
  };

  const addConstraint = () => {
    if (ineq.length >= MAX_LINES) return;
    setIneq((prev) => [...prev, C(1, 1, 6, "<=")]);
  };
  const removeConstraint = (i: number) => {
    if (ineq.length <= 1) return;
    handleAbcRef.current = [];
    setIneq((prev) => prev.filter((_, idx) => idx !== i));
  };

  /* ───────── Papan JSXGraph ───────── */

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;

    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: HOME.lp,
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepAspectRatio: true,
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: { wheel: true, needShift: false, factorX: 1.15, factorY: 1.15, min: 0.1, max: 20 },
    });
    boardRef.current = board;
    const rawCreate = board as unknown as {
      create: (type: string, parents: unknown[], attrs: Record<string, unknown>) => unknown;
    };
    const create = (type: string, parents: unknown[], attrs: Record<string, unknown>) =>
      rawCreate.create(type, parents, attrs) as JEl;

    // sumbu; garis kisi digambar lewat tanda sumbu (ikut bergeser dan zoom)
    const axisStyle = { strokeColor: "#94a3b8", strokeWidth: 1.4, highlight: false };
    const ticks = {
      insertTicks: true,
      minorTicks: 0,
      majorHeight: -1,
      drawZero: false,
      strokeColor: "rgba(148, 163, 184, 0.32)",
      strokeWidth: 1,
      label: { fontSize: 10, strokeColor: "#64748b" },
    };
    create("axis", [[0, 0], [1, 0]], { ...axisStyle, ticks });
    create("axis", [[0, 0], [0, 1]], { ...axisStyle, ticks });

    // isian poligon (kurva tertutup) yang datanya dibaca dari ref
    const fill = (colorHex: string, opacity: number, get: () => Pt[]) => {
      const curve = create("curve", [[0], [0]], {
        strokeWidth: 0,
        strokeColor: colorHex,
        fillColor: colorHex,
        fillOpacity: opacity,
        highlight: false,
        fixed: true,
      }) as unknown as CurveLike;
      curve.updateDataArray = function (this: CurveLike) {
        const pts = get();
        if (pts.length === 0) {
          this.dataX = [0];
          this.dataY = [0];
        } else {
          this.dataX = [...pts.map((pt) => pt.x), pts[0].x];
          this.dataY = [...pts.map((pt) => pt.y), pts[0].y];
        }
      };
    };
    LINE_COLORS.forEach((colorHex, i) => fill(colorHex, 0.07, () => halfDataRef.current[i] ?? []));
    fill(REGION_COLOR, 0.34, () => regionDataRef.current);

    const marker = (
      x: () => number,
      y: () => number,
      colorHex: string,
      size: number,
      opts: Record<string, unknown> = {},
    ) =>
      create("point", [x, y], {
        name: "",
        withLabel: false,
        size: size * 0.75,
        fillColor: colorHex,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        highlightFillColor: colorHex,
        highlightStrokeColor: "#ffffff",
        fixed: true,
        highlight: false,
        showInfobox: false,
        ...opts,
      });

    // cincin titik optimum (di bawah titik sudut)
    for (let i = 0; i < OPT_POOL; i += 1) {
      marker(
        () => optPtsRef.current[i]?.x ?? Number.NaN,
        () => optPtsRef.current[i]?.y ?? Number.NaN,
        OPT_COLOR,
        10,
        { strokeColor: "#854d0e", strokeWidth: 2, fillOpacity: 0.9 },
      );
    }

    // garis kendala: melalui dua titik pegangan
    const objs: { line: JEl; p1: JEl; p2: JEl }[] = [];
    LINE_COLORS.forEach((colorHex) => {
      const handle = () =>
        create("point", [0, 0], {
          name: "",
          withLabel: false,
          size: 4,
          fillColor: "#ffffff",
          strokeColor: colorHex,
          strokeWidth: 2.5,
          highlightFillColor: "#ffffff",
          highlightStrokeColor: colorHex,
          snapToGrid: true,
          snapSizeX: 1,
          snapSizeY: 1,
          showInfobox: false,
        });
      const p1 = handle();
      const p2 = handle();
      const line = create("line", [p1, p2], {
        strokeColor: colorHex,
        strokeWidth: 3,
        highlightStrokeColor: colorHex,
        highlightStrokeWidth: 4,
        highlightStrokeOpacity: 1,
      });
      objs.push({ line, p1, p2 });
    });
    objsRef.current = objs;

    // garis selidik z = k dengan pegangan H
    const level = create("point", [0, 0], {
      name: "",
      withLabel: false,
      size: 5,
      fillColor: OPT_COLOR,
      strokeColor: "#ffffff",
      strokeWidth: 2,
      highlightFillColor: OPT_COLOR,
      highlightStrokeColor: "#ffffff",
      showInfobox: false,
    });
    levelRef.current = level;
    levelLineRef.current = create(
      "line",
      [
        () => -(pqRef.current.p * level.X() + pqRef.current.q * level.Y()),
        () => pqRef.current.p,
        () => pqRef.current.q,
      ],
      {
        strokeColor: OPT_COLOR,
        strokeWidth: 3,
        dash: 2,
        highlight: false,
        fixed: true,
      },
    );
    levelTextRef.current = create(
      "text",
      [
        () => level.X(),
        () => level.Y(),
        () => `z = ${fmtN(pqRef.current.p * level.X() + pqRef.current.q * level.Y())}`,
      ],
      {
        fontSize: 13,
        strokeColor: "#854d0e",
        anchorX: "left",
        anchorY: "bottom",
        offset: [10, 8],
        highlight: false,
        fixed: true,
      },
    );

    // titik sudut dan titik potong
    for (let i = 0; i < VERT_POOL; i += 1) {
      marker(
        () => vertsRef.current[i]?.x ?? Number.NaN,
        () => vertsRef.current[i]?.y ?? Number.NaN,
        VERT_COLOR,
        4.5,
      );
    }
    marker(
      () => {
        const s = solRef.current;
        return s && s.kind === "unique" ? s.x : Number.NaN;
      },
      () => {
        const s = solRef.current;
        return s && s.kind === "unique" ? s.y : Number.NaN;
      },
      INTER_COLOR,
      7,
    );

    // label koordinat
    const textAttrs = {
      fontSize: 12,
      strokeColor: VERT_COLOR,
      anchorX: "left",
      anchorY: "bottom",
      offset: [8, 6],
      highlight: false,
      fixed: true,
    };
    vertTextRef.current = [];
    for (let i = 0; i < VERT_POOL; i += 1) {
      const t = create(
        "text",
        [
          () => vertsRef.current[i]?.x ?? 0,
          () => vertsRef.current[i]?.y ?? 0,
          () => (vertsRef.current[i] ? ptText(vertsRef.current[i]) : ""),
        ],
        textAttrs,
      );
      t.hide();
      vertTextRef.current.push(t);
    }
    const interText = create(
      "text",
      [
        () => {
          const s = solRef.current;
          return s && s.kind === "unique" ? s.x : 0;
        },
        () => {
          const s = solRef.current;
          return s && s.kind === "unique" ? s.y : 0;
        },
        () => {
          const s = solRef.current;
          return s && s.kind === "unique" ? ptText({ x: s.x, y: s.y }) : "";
        },
      ],
      { ...textAttrs, strokeColor: INTER_COLOR, fontSize: 13 },
    );
    interText.hide();
    interTextRef.current = interText;

    // titik uji (hanya pada mode pertidaksamaan)
    const test = create("point", [testPt.x, testPt.y], {
      name: "",
      withLabel: false,
      size: 4,
      face: "[]",
      fillColor: "#ffffff",
      strokeColor: VERT_COLOR,
      strokeWidth: 2.5,
      highlightFillColor: "#ffffff",
      highlightStrokeColor: VERT_COLOR,
      snapToGrid: true,
      snapSizeX: 0.5,
      snapSizeY: 0.5,
      showInfobox: false,
    });
    testRef.current = test;
    test.on("drag", () => setTestPt({ x: test.X(), y: test.Y() }));

    // pegangan paling atas
    objs.forEach((o) => {
      o.p1.setAttribute({ layer: 9 });
      o.p2.setAttribute({ layer: 9 });
    });
    level.setAttribute({ layer: 9 });
    test.setAttribute({ layer: 9 });

    // ───── interaksi garis ─────
    const pushLine = (i: number) => {
      const cur = linesRef.current[i];
      const o = objs[i];
      if (!cur || !o) return;
      const raw = lineFromPoints({ x: o.p1.X(), y: o.p1.Y() }, { x: o.p2.X(), y: o.p2.Y() });
      if (!validLine(raw)) return;
      const l = normalizeLine(raw, cur);
      handleAbcRef.current[i] = l;
      linesRef.current = linesRef.current.map((c, idx) => (idx === i ? { ...c, ...l } : c));
      const apply = (prev: Cons[]) => prev.map((c, idx) => (idx === i ? { ...c, ...l } : c));
      if (modeRef.current === "spldv") setEq(apply);
      else setIneq(apply);
      scheduleRecompute();
    };

    objs.forEach((o, i) => {
      o.p1.on("drag", () => {
        dragRef.current = { i, kind: "handle" };
        pushLine(i);
      });
      o.p2.on("drag", () => {
        dragRef.current = { i, kind: "handle" };
        pushLine(i);
      });
      o.line.on("drag", () => {
        dragRef.current = { i, kind: "line" };
        pushLine(i);
      });
    });
    board.on("up", () => {
      const d = dragRef.current;
      dragRef.current = null;
      if (!d || d.kind !== "line" || !snapRef.current) return;
      const o = objs[d.i];
      [o.p1, o.p2].forEach((pt) =>
        pt.setPosition(COORDS_BY_USER, [Math.round(pt.X()) + 0, Math.round(pt.Y()) + 0]),
      );
      board.update();
      pushLine(d.i);
    });

    level.on("drag", () => {
      const { p: pp, q: qq } = pqRef.current;
      const value = pp * level.X() + qq * level.Y();
      kRef.current = value;
      setK(value);
    });

    board.on("boundingbox", scheduleRecompute);

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
      scheduleRecompute();
    };
    syncRef.current = sync;
    const observer = new ResizeObserver(() => sync());
    observer.observe(el);

    return () => {
      syncRef.current = null;
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // Ganti mode: tampilan awal dan penempatan ulang pegangan
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    modeRef.current = mode;
    handleAbcRef.current = [];
    board.setBoundingBox(HOME[mode], true);
  }, [mode]);

  // Sinkronkan state ke papan
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    modeRef.current = mode;
    linesRef.current = lines;
    nonnegRef.current = nonneg;
    showHalfRef.current = showHalf;
    snapRef.current = snap;
    pqRef.current = { p, q, goal };

    const box = board.getBoundingBox() as Box;
    objsRef.current.forEach((o, i) => {
      const c = lines[i];
      if (!c) {
        o.line.hide();
        o.p1.hide();
        o.p2.hide();
        return;
      }
      o.line.show();
      o.p1.show();
      o.p2.show();
      [o.p1, o.p2].forEach((pt) => pt.setAttribute({ snapToGrid: snap }));
      const strict = c.op === "<" || c.op === ">";
      const dash = strict ? 2 : 0;
      if (dashRef.current[i] !== dash) {
        dashRef.current[i] = dash;
        o.line.setAttribute({ dash });
      }
      const known = handleAbcRef.current[i];
      if (validLine(c) && (!known || !sameLine(known, c))) {
        const [a, b] = handlePoints(c, box);
        o.p1.setPosition(COORDS_BY_USER, [a.x, a.y]);
        o.p2.setPosition(COORDS_BY_USER, [b.x, b.y]);
        handleAbcRef.current[i] = normalizeLine(lineFromPoints(a, b), c);
      }
    });

    const lp = mode === "lp";
    const hasObj = Math.abs(p) > 1e-12 || Math.abs(q) > 1e-12;
    const level = levelRef.current;
    if (lp && hasObj) {
      levelLineRef.current?.show();
      levelTextRef.current?.show();
      level?.show();
      const s = p * p + q * q;
      level?.setPosition(COORDS_BY_USER, [(kRef.current * p) / s, (kRef.current * q) / s]);
    } else {
      levelLineRef.current?.hide();
      levelTextRef.current?.hide();
      level?.hide();
    }
    if (mode === "ptlsv") testRef.current?.show();
    else testRef.current?.hide();

    recompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, eq, ineq, nonneg, showHalf, snap, p, q, goal]);

  // Animasi: garis selidik meluncur dari luar daerah sampai menyentuh titik optimum
  useEffect(() => {
    if (!anim) return undefined;
    const a = analysisRef.current;
    if (!a || !a.opt || a.opt.status !== "optimal") {
      setAnim(false);
      return undefined;
    }
    const target = a.opt.z;
    const span = Math.max(1, a.zHi - a.zLo);
    const from = pqRef.current.goal === "max" ? target + span * 0.6 : target - span * 0.6;
    const start = performance.now();
    const duration = 3200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      moveLevel(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setAnim(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim]);

  // Masuk/keluar layar penuh mengubah ukuran kontainer dua kali (tata letak
  // CSS, lalu layar penuh asli). Sinkronkan ulang setelah transisi agar
  // grafik langsung terisi penuh.
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

  /* ───────── Nilai turunan ───────── */

  const sol = analysis?.sol ?? null;
  const verts = analysis?.verts ?? [];
  const opt = analysis?.opt ?? null;
  const zAt = (pt: Pt) => p * pt.x + q * pt.y;
  const goalWord = goal === "max" ? "maksimum" : "minimum";

  const resultText = useMemo(() => {
    if (!analysis) return "";
    if (mode === "spldv") {
      if (!analysis.sol) return "Atur kedua garis agar terdefinisi (a dan b tidak boleh sama-sama 0).";
      if (analysis.sol.kind === "unique") {
        return `Titik potong ${ptText(analysis.sol)}: x = ${fmtN(analysis.sol.x)}, y = ${fmtN(analysis.sol.y)}`;
      }
      if (analysis.sol.kind === "parallel") return "Kedua garis sejajar: tidak ada penyelesaian.";
      return "Kedua garis berimpit: penyelesaian tak hingga banyak.";
    }
    if (analysis.empty) return "Tidak ada daerah penyelesaian: kendalanya saling bertentangan.";
    if (mode === "ptlsv") {
      const n = analysis.verts.length;
      if (analysis.unbounded) return `Daerah penyelesaian tak terbatas, ${n} titik sudut.`;
      if (n === 1) return `Daerah penyelesaian hanya satu titik: ${ptText(analysis.verts[0])}.`;
      if (n === 2) return "Daerah penyelesaian berupa ruas garis.";
      return `Daerah penyelesaian berbentuk poligon dengan ${n} titik sudut.`;
    }
    const o = analysis.opt;
    if (!o) return "";
    if (o.status === "unbounded") {
      return `Daerah tak terbatas ke arah z terus berubah: tidak ada nilai ${goalWord}.`;
    }
    if (o.status === "constant") return "Fungsi tujuan bernilai 0 di mana-mana (p = q = 0).";
    if (o.status === "optimal") {
      const where = o.points.map(ptText).join(" dan ");
      return o.points.length > 1
        ? `z ${goalWord} = ${fmtN(o.z)}, tercapai di seluruh ruas antara ${where}.`
        : `z ${goalWord} = ${fmtN(o.z)} di titik ${where}.`;
    }
    return "";
  }, [analysis, mode, goalWord]);

  const levelNote = useMemo(() => {
    if (mode !== "lp" || !analysis) return "";
    if (analysis.empty) return "Tidak ada daerah layak.";
    const o = analysis.opt;
    if (o && o.status === "optimal" && Math.abs(k - o.z) < 1e-4 * (1 + Math.abs(o.z))) {
      return `Garis menyentuh titik ${goalWord}: z = ${fmtN(o.z)}.`;
    }
    const inside = k >= analysis.zAllMin - 1e-9 && k <= analysis.zAllMax + 1e-9;
    return inside
      ? "Garis memotong daerah penyelesaian: ada titik layak dengan nilai z ini."
      : "Garis di luar daerah penyelesaian: tidak ada titik layak dengan nilai z ini.";
  }, [analysis, k, mode, goalWord]);

  const checks = lines.map((c) => {
    const v = c.a * testPt.x + c.b * testPt.y;
    const eps = 1e-9;
    const ok =
      c.op === "<="
        ? v <= c.c + eps
        : c.op === ">="
          ? v >= c.c - eps
          : c.op === "<"
            ? v < c.c - eps
            : c.op === ">"
              ? v > c.c + eps
              : Math.abs(v - c.c) < 1e-6;
    return { v, ok };
  });
  const nnOk = testPt.x >= -1e-9 && testPt.y >= -1e-9;
  const allOk = checks.every((c) => c.ok) && (!nonneg || nnOk);

  const sliderMin = analysis ? analysis.zLo : -20;
  const sliderMax = analysis ? analysis.zHi : 20;

  const tabs: { tab: Tab; label: string }[] = [
    { tab: "lines", label: mode === "spldv" ? "Garis" : "Kendala" },
    ...(mode === "lp" ? [{ tab: "goal" as Tab, label: "Tujuan" }] : []),
    { tab: "view", label: "Opsi" },
    { tab: "result", label: "Hasil" },
  ];
  const activeTab: Tab = tabs.some((t) => t.tab === tab) ? tab : "lines";
  const pane = (name: Tab) => `ls-pane${activeTab === name ? " is-on" : ""}`;

  const mark = (ok: boolean) => (
    <b className={ok ? "ls-ok" : "ls-bad"}>{ok ? "✓" : "✗"}</b>
  );
  const swatch = (i: number) => (
    <span className="ls-swatch" style={{ background: LINE_COLORS[i] }} />
  );

  return (
    <div ref={rootRef} className={`ls${isFs ? " is-fs" : ""}`}>
      <p className="ls-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>Miringkan ponsel ke mode lanskap agar grafik dan panel nyaman dipakai.</span>
      </p>

      <div className="ls-layout">
        {/* ───── Grafik ───── */}
        <section className="ls-graph" aria-label="Grafik sistem linear">
          <div className="ls-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="ls-board"
              tabIndex={0}
              onKeyDown={onBoardKey}
              aria-label="Grafik garis linear. Seret garis atau titik putih untuk mengubahnya. Seret area kosong untuk menggeser, gulir atau cubit untuk memperbesar."
            />

            <p className="ls-eq" role="status" aria-live="polite">
              {resultText}
            </p>

            <div className="ls-tools" role="group" aria-label="Alat tampilan">
              <button
                type="button"
                onClick={toggleFs}
                aria-pressed={isFs}
                aria-label={isFs ? "Keluar layar penuh" : "Layar penuh"}
                title={isFs ? "Keluar layar penuh" : "Layar penuh"}
              >
                {isFs ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
              </button>
              <button type="button" onClick={zoomIn} aria-label="Perbesar" title="Perbesar">
                <Plus size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={zoomOut} aria-label="Perkecil" title="Perkecil">
                <Minus size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={center} aria-label="Pusatkan tampilan" title="Pusatkan tampilan">
                <Crosshair size={16} aria-hidden="true" />
              </button>
              {isFs && (
                <button
                  type="button"
                  className="ls-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`ls-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="ls-legend" aria-label="Legenda grafik">
            {lines.map((c, i) => (
              <li key={i}>
                <i style={{ borderColor: LINE_COLORS[i] }} /> {formatEq(c)}
              </li>
            ))}
            {mode === "spldv" && sol?.kind === "unique" && (
              <li>
                <b style={{ background: INTER_COLOR }} /> titik potong
              </li>
            )}
            {mode !== "spldv" && (
              <>
                <li>
                  <b className="sq" style={{ background: REGION_COLOR }} /> daerah penyelesaian
                </li>
                <li>
                  <b style={{ background: VERT_COLOR }} /> titik sudut
                </li>
              </>
            )}
            {mode === "lp" && (
              <li>
                <i className="dash" style={{ borderColor: OPT_COLOR }} /> garis selidik
              </li>
            )}
            {mode === "ptlsv" && (
              <li>
                <b className="sq ring" /> titik uji
              </li>
            )}
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`ls-panel-${baseId}`}
          className={`ls-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur simulasi"
        >
          <div className="ls-modes" role="group" aria-label="Jenis simulasi">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => changeMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="ls-tabs" role="group" aria-label="Bagian pengatur">
            {tabs.map((t) => (
              <button
                key={t.tab}
                type="button"
                aria-pressed={activeTab === t.tab}
                onClick={() => setTab(t.tab)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Garis / kendala */}
          <div className={pane("lines")}>
            <div className="ls-rows">
              {lines.map((c, i) => (
                <div className="ls-row" key={i}>
                  {swatch(i)}
                  <NumField
                    value={c.a}
                    label={`Koefisien x garis ${i + 1}`}
                    onChange={(v) => updateLine(i, { a: v })}
                  />
                  <span className="ls-sym">x +</span>
                  <NumField
                    value={c.b}
                    label={`Koefisien y garis ${i + 1}`}
                    onChange={(v) => updateLine(i, { b: v })}
                  />
                  <span className="ls-sym">y</span>
                  {mode === "spldv" ? (
                    <span className="ls-sym ls-eqsign">=</span>
                  ) : (
                    <select
                      className="ls-op"
                      aria-label={`Tanda garis ${i + 1}`}
                      value={c.op}
                      onChange={(e) => updateLine(i, { op: e.currentTarget.value as Op })}
                    >
                      {OPS.map((op) => (
                        <option key={op} value={op}>
                          {OP_SYMBOL[op]}
                        </option>
                      ))}
                    </select>
                  )}
                  <NumField
                    value={c.c}
                    label={`Konstanta garis ${i + 1}`}
                    onChange={(v) => updateLine(i, { c: v })}
                  />
                  {mode !== "spldv" && lines.length > 1 && (
                    <button
                      type="button"
                      className="ls-x"
                      aria-label={`Hapus kendala ${i + 1}`}
                      onClick={() => removeConstraint(i)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {mode !== "spldv" && (
              <div className="ls-chips">
                {lines.length < MAX_LINES && (
                  <button type="button" className="ls-chip" onClick={addConstraint}>
                    + Kendala
                  </button>
                )}
                <button
                  type="button"
                  className="ls-chip"
                  aria-pressed={nonneg}
                  onClick={() => setNonneg(!nonneg)}
                >
                  x ≥ 0, y ≥ 0
                </button>
              </div>
            )}

            <p className="ls-label">Contoh</p>
            <div className="ls-chips" role="group" aria-label="Contoh soal">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="ls-chip"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tujuan (program linear) */}
          {mode === "lp" && (
            <div className={pane("goal")}>
              <div className="ls-row">
                <span className="ls-sym">z =</span>
                <NumField value={p} label="Koefisien x pada z" onChange={setP} />
                <span className="ls-sym">x +</span>
                <NumField value={q} label="Koefisien y pada z" onChange={setQ} />
                <span className="ls-sym">y</span>
              </div>
              <div className="ls-seg" role="group" aria-label="Tujuan optimasi">
                {(["max", "min"] as Goal[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={goal === g}
                    onClick={() => setGoal(g)}
                  >
                    {g === "max" ? "Maksimumkan" : "Minimumkan"}
                  </button>
                ))}
              </div>
              <p className="ls-label">Garis selidik</p>
              <LevelSlider
                value={k}
                min={sliderMin}
                max={sliderMax}
                onSlide={(v) => {
                  setAnim(false);
                  moveLevel(v);
                }}
                onNudge={(d) => {
                  setAnim(false);
                  moveLevel(kRef.current + d);
                }}
              />
              <div className="ls-chips">
                <button
                  type="button"
                  className="ls-chip"
                  aria-pressed={anim}
                  disabled={!opt || opt.status !== "optimal"}
                  onClick={() => setAnim((a) => !a)}
                >
                  {anim ? "Hentikan" : "▶ Geser ke optimum"}
                </button>
              </div>
              <p className="ls-note">{levelNote}</p>
            </div>
          )}

          {/* Opsi */}
          <div className={pane("view")}>
            <p className="ls-label">Tampilkan</p>
            <div className="ls-chips" role="group" aria-label="Opsi grafik">
              <button
                type="button"
                className="ls-chip"
                aria-pressed={snap}
                onClick={() => setSnap(!snap)}
              >
                Tempel ke grid
              </button>
              {mode !== "spldv" && (
                <button
                  type="button"
                  className="ls-chip"
                  aria-pressed={showHalf}
                  onClick={() => setShowHalf(!showHalf)}
                >
                  Warnai sisi
                </button>
              )}
            </div>
            <button type="button" className="ls-reset" onClick={resetAll}>
              <RotateCcw size={13} aria-hidden="true" />
              <span>Atur ulang</span>
            </button>
          </div>

          {/* Hasil */}
          <div className={pane("result")}>
            <p className="ls-note" role="status">
              {resultText}
            </p>

            {mode === "spldv" && (
              <>
                {sol?.kind === "unique" && (
                  <dl className="ls-readouts" aria-live="polite">
                    <div>
                      <dt>D = a₁b₂ − a₂b₁</dt>
                      <dd>{fmtN(sol.D)}</dd>
                    </div>
                    <div>
                      <dt>Dx ; Dy</dt>
                      <dd>
                        {fmtN(sol.Dx)} ; {fmtN(sol.Dy)}
                      </dd>
                    </div>
                    <div className="wide">
                      <dt>Penyelesaian (x = Dx/D, y = Dy/D)</dt>
                      <dd style={{ color: INTER_COLOR }}>{ptText(sol)}</dd>
                    </div>
                  </dl>
                )}
                {sol?.kind === "unique" && (
                  <ul className="ls-checks">
                    {eq.map((c, i) => {
                      const v = c.a * sol.x + c.b * sol.y;
                      return (
                        <li key={i}>
                          {swatch(i)}
                          {fmtN(c.a)}({fmtN(sol.x)}) + {fmtN(c.b)}({fmtN(sol.y)}) = {fmtN(v)}{" "}
                          {mark(Math.abs(v - c.c) < 1e-6)}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}

            {mode === "ptlsv" && (
              <>
                <dl className="ls-readouts" aria-live="polite">
                  <div className="wide">
                    <dt>Titik sudut daerah</dt>
                    <dd>
                      {analysis?.empty || verts.length === 0 ? "—" : verts.map(ptText).join("  ")}
                    </dd>
                  </div>
                  <div className="wide">
                    <dt>Titik uji {ptText(testPt)}</dt>
                    <dd style={{ color: allOk ? "#059669" : INTER_COLOR }}>
                      {allOk ? "memenuhi" : "tidak memenuhi"}
                    </dd>
                  </div>
                </dl>
                <ul className="ls-checks">
                  {lines.map((c, i) => (
                    <li key={i}>
                      {swatch(i)}
                      {fmtN(c.a)}({fmtN(testPt.x)}) + {fmtN(c.b)}({fmtN(testPt.y)}) ={" "}
                      {fmtN(checks[i].v)} {OP_SYMBOL[c.op]} {fmtN(c.c)} {mark(checks[i].ok)}
                    </li>
                  ))}
                  {nonneg && (
                    <li>
                      x ≥ 0 dan y ≥ 0 {mark(nnOk)}
                    </li>
                  )}
                </ul>
                <p className="ls-muted">Seret kotak putih di grafik untuk menguji titik lain.</p>
              </>
            )}

            {mode === "lp" && (
              <div className="ls-table-wrap">
                <table className="ls-table">
                  <caption>
                    z = {fmtN(p)}x + {fmtN(q)}y ({goal === "max" ? "cari maksimum" : "cari minimum"})
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Titik sudut</th>
                      <th scope="col">z</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {verts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="ls-muted">
                          {analysis?.empty ? "Daerah penyelesaian kosong." : "Tidak ada titik sudut."}
                        </td>
                      </tr>
                    ) : (
                      verts.map((v, i) => {
                        const best =
                          opt?.status === "optimal" &&
                          Math.abs(zAt(v) - opt.z) < 1e-6 * (1 + Math.abs(opt.z));
                        return (
                          <tr key={i} className={best ? "is-best" : ""}>
                            <th scope="row">{ptText(v)}</th>
                            <td>{fmtN(zAt(v))}</td>
                            <td>{best ? `← ${goalWord}` : ""}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LinearSystemSimulation;
