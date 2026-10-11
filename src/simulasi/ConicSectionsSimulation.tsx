import {
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
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import JXG from "jsxgraph";
import "../styles/jsxgraph.css";
import "./ConicSectionsSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi irisan kerucut — tema slate seperti landing page 1729.
   Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Layar penuh: grafik 100% layar, toolbar dan panel pengatur mengambang.

   Satu keluarga kurva dengan fokus di titik asal (0, 0):

       r = ℓ / (1 − e cos θ)

   e = eksentrisitas, ℓ = setengah lebar fokal (semi latus rectum).
   e = 0 lingkaran, 0 < e < 1 elips, e = 1 parabola, e > 1 hiperbola.
   Setiap titik P memenuhi  PF = e · (jarak P ke direktriks).
   Persamaan umum: (1 − e²)x² − 2eℓx + y² = ℓ². */

/* ───────── Tipe ───────── */

type Vec = [number, number];
type Sample = [number, number, number]; // x, y, θ (derajat)
type Params = { e: number; l: number; t: number };
type Opts = {
  focus: boolean;
  dir: boolean;
  tangent: boolean;
  guide: boolean;
  ghost: boolean;
};
type Kind = "circle" | "ellipse" | "parabola" | "hyperbola";
type Tab = "set" | "res";
type Anim = "e" | "t" | null;
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
  setAttribute: (attributes: Record<string, unknown>) => void;
};

/* ───────── Konstanta ───────── */

const EPS = 1e-9;
const E_MIN = 0;
const E_MAX = 3;
const L_MIN = 0.5;
const L_MAX = 10;
const HOME_BOX: [number, number, number, number] = [-10, 10, 16, -10];

const DEFAULT_PARAMS: Params = { e: 0.6, l: 4, t: 60 };
const DEFAULT_OPTS: Opts = {
  focus: true,
  dir: true,
  tangent: true,
  guide: false,
  ghost: true,
};

/* Warna grafik: dipakai juga oleh legenda, slider, dan hasil di panel. */
const KINDS: Record<Kind, { label: string; color: string; e: number }> = {
  circle: { label: "Lingkaran", color: "#0d9488", e: 0 },
  ellipse: { label: "Elips", color: "#7c3aed", e: 0.6 },
  parabola: { label: "Parabola", color: "#ea580c", e: 1 },
  hyperbola: { label: "Hiperbola", color: "#e11d48", e: 2 },
};
const KIND_ORDER: Kind[] = ["circle", "ellipse", "parabola", "hyperbola"];

const color = {
  focus: "#0f172a",
  dir: "#ca8a04",
  tan: "#2563eb",
  guide: "#94a3b8",
  l: "#059669",
};

const optionRows: { key: keyof Opts; label: string }[] = [
  { key: "focus", label: "Fokus" },
  { key: "dir", label: "Direktriks" },
  { key: "tangent", label: "Titik P" },
  { key: "guide", label: "Pusat & asimtot" },
  { key: "ghost", label: "Bandingkan" },
];

/* ───────── Matematika ───────── */

function kindOf(e: number): Kind {
  if (e < EPS) return "circle";
  if (Math.abs(e - 1) < EPS) return "parabola";
  return e < 1 ? "ellipse" : "hyperbola";
}

function analyze(e: number, l: number, tDeg: number) {
  const kind = kindOf(e);
  const e2 = e * e;
  let a = Number.NaN;
  let b = Number.NaN;
  let c = 0;
  let x0 = Number.NaN;
  if (kind === "circle") {
    a = l;
    b = l;
    x0 = 0;
  } else if (kind === "ellipse") {
    a = l / (1 - e2);
    b = a * Math.sqrt(1 - e2);
    c = e * a;
    x0 = c; // pusat di (+c, 0)
  } else if (kind === "hyperbola") {
    a = l / (e2 - 1);
    b = a * Math.sqrt(e2 - 1);
    c = e * a;
    x0 = -c; // pusat di (−c, 0)
  }
  const pair = kind === "ellipse" || kind === "hyperbola";
  const f2: Vec | null = pair ? [2 * x0, 0] : null;
  const dir1 = e > EPS ? -l / e : null;
  const dir2 = pair ? 2 * x0 + l / e : null;
  const vertices: Vec[] =
    kind === "parabola"
      ? [[-l / 2, 0]]
      : pair
        ? [
            [x0 - a, 0],
            [x0 + a, 0],
          ]
        : [];

  // titik P pada sudut θ (diukur dari fokus)
  const th = (tDeg * Math.PI) / 180;
  const u = 1 - e * Math.cos(th);
  const r = Math.abs(u) > 1e-4 ? l / u : Number.NaN;
  const valid = Number.isFinite(r) && Math.abs(r) < 1e5;
  const px = valid ? r * Math.cos(th) : Number.NaN;
  const py = valid ? r * Math.sin(th) : Number.NaN;
  const rp = valid ? (-l * e * Math.sin(th)) / (u * u) : Number.NaN;
  const tx = rp * Math.cos(th) - r * Math.sin(th);
  const ty = rp * Math.sin(th) + r * Math.cos(th);
  // garis singgung: A x + B y = C
  const tanA = (1 - e2) * px - e * l;
  const tanB = py;
  const tanC = l * l + e * l * px;
  const pf1 = valid ? Math.abs(r) : Number.NaN;
  const pf2 = valid && f2 ? Math.hypot(px - f2[0], py) : Number.NaN;
  const pd = valid && dir1 !== null ? Math.abs(px - dir1) : Number.NaN;

  return {
    kind,
    a,
    b,
    c,
    x0,
    pair,
    f2,
    dir1,
    dir2,
    vertices,
    valid,
    px,
    py,
    tx,
    ty,
    tanA,
    tanB,
    tanC,
    slope: Math.abs(tanB) > 1e-9 ? -tanA / tanB : null,
    pf1,
    pf2,
    pd,
    ratio: pd > EPS ? pf1 / pd : Number.NaN,
  };
}

type Analysis = ReturnType<typeof analyze>;

/** Titik-titik kurva r = ℓ/(1 − e cos θ), dipotong pada jarak rmax. */
function conicBranch(
  e: number,
  l: number,
  rmax: number,
  which: "a" | "b",
): Sample[] {
  const make = (t0: number, t1: number, n: number) => {
    const out: Sample[] = [];
    for (let i = 0; i <= n; i += 1) {
      const t = t0 + ((t1 - t0) * i) / n;
      const r = l / (1 - e * Math.cos(t));
      let deg = (t * 180) / Math.PI;
      if (deg > 180) deg -= 360;
      out.push([r * Math.cos(t), r * Math.sin(t), deg]);
    }
    return out;
  };
  const clampCos = (v: number) => Math.min(1, Math.max(-1, v));
  if (e < 1 - EPS) return which === "a" ? make(0, 2 * Math.PI, 720) : [];
  const k = l / rmax;
  if (which === "a") {
    const tLo = Math.acos(clampCos((1 - k) / e));
    return make(tLo, 2 * Math.PI - tLo, 520);
  }
  if (e > 1 + EPS) {
    const cB = (1 + k) / e;
    if (cB < 1) {
      const tHi = Math.acos(cB);
      return make(-tHi, tHi, 520);
    }
  }
  return [];
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

function shifted(h: number) {
  if (Math.abs(h) < 5e-3) return "x";
  return h > 0 ? `(x − ${fmt(h)})` : `(x + ${fmt(-h)})`;
}

function standardForm(an: Analysis, l: number) {
  const { kind } = an;
  if (kind === "circle") return `x² + y² = ${fmt(l * l)}`;
  if (kind === "ellipse")
    return `${shifted(an.x0)}² / ${fmt(an.a * an.a)} + y² / ${fmt(an.b * an.b)} = 1`;
  if (kind === "hyperbola")
    return `${shifted(an.x0)}² / ${fmt(an.a * an.a)} − y² / ${fmt(an.b * an.b)} = 1`;
  const p = l / 2;
  return `y² = ${fmt(4 * p)}(x + ${fmt(p)})`;
}

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
    className: "cs-step",
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

/** Satu baris:  e  −  ────●────  +  0,6  ▶ */
function ParamRow({
  id,
  label,
  title,
  value,
  min,
  max,
  step,
  digits,
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
  step: number;
  digits: number;
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
  const bind = useHoldRepeat((d) => onChange(round(clamp(value + d * step))));
  const pct = ((clamp(value) - min) / (max - min)) * 100;
  const style = {
    "--lo": bipolar ? `${Math.min(50, pct)}%` : "0%",
    "--hi": bipolar ? `${Math.max(50, pct)}%` : `${pct}%`,
    "--sc": tone,
  } as CSSProperties;

  return (
    <div className="cs-slider" style={style}>
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
        className="cs-range"
        type="range"
        min={min}
        max={max}
        step={step}
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
        {label === "θ" ? "°" : ""}
      </output>
      {onPlay ? (
        <button
          type="button"
          className="cs-step cs-play"
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
  <div key={key} className={wide ? "cs-wide" : undefined}>
    <dt>{key}</dt>
    <dd style={tone ? { color: tone } : undefined}>{value}</dd>
  </div>
);

/* ───────── Komponen utama ───────── */

export function ConicSectionsSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `cs-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);
  const samplesRef = useRef<Sample[]>([]);
  const mainCurvesRef = useRef<DataCurve[]>([]);

  const [params, setParams] = useStoredSimulationState<Params>(
    "conic.params",
    DEFAULT_PARAMS,
  );
  const [opts, setOpts] = useStoredSimulationState<Opts>(
    "conic.opts",
    DEFAULT_OPTS,
  );
  const [anim, setAnim] = useState<Anim>(null);
  const [tab, setTab] = useState<Tab>("set");
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // data yang dibaca papan JSXGraph (selalu lewat ref agar tidak basi)
  const pRef = useRef(params);
  pRef.current = params;
  const oRef = useRef(opts);
  oRef.current = opts;
  const clickRef = useRef<(deg: number) => void>(() => undefined);
  clickRef.current = (deg: number) => {
    setAnim(null);
    setParams((prev) => ({ ...prev, t: deg }));
  };

  const an = analyze(params.e, params.l, params.t);
  const kind = an.kind;
  const info = KINDS[kind];

  /* ───────── Parameter ───────── */

  const setParam = (patch: Partial<Params>) => {
    setAnim(null);
    setParams((prev) => ({ ...prev, ...patch }));
  };

  const setOpt = (key: keyof Opts) =>
    setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  const reset = () => {
    setAnim(null);
    setParams(DEFAULT_PARAMS);
    setOpts(DEFAULT_OPTS);
    boardRef.current?.setBoundingBox(HOME_BOX, true);
  };

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
      if (!cache || cache.p !== p) cache = { p, v: analyze(p.e, p.l, p.t) };
      return cache.v;
    };
    const show = (key: keyof Opts) => oRef.current[key];

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
    ) => {
      const curve = board.create("curve", [[0], [0]], {
        strokeColor: stroke,
        strokeWidth: width,
        strokeOpacity: opacity,
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

    const toVec = (s: Sample[]): Vec[] => s.map(([x, y]) => [x, y] as Vec);

    // pembanding: keempat jenis dengan fokus dan ℓ yang sama
    KIND_ORDER.forEach((k) => {
      const ghost = (which: "a" | "b") => () =>
        show("ghost")
          ? toVec(conicBranch(KINDS[k].e, pRef.current.l, extent(), which))
          : null;
      makeCurve(KINDS[k].color, 1.5, 0, 0.35, ghost("a"));
      if (k === "hyperbola") makeCurve(KINDS[k].color, 1.5, 0, 0.35, ghost("b"));
    });

    // garis bantu: direktriks, asimtot
    const vertical = (x: number | null): Vec[] | null => {
      if (x === null || !Number.isFinite(x) || Math.abs(x) > 1e5) return null;
      const s = extent();
      return [
        [x, -s],
        [x, s],
      ];
    };
    makeCurve(color.dir, 2, 3, 1, () => (show("dir") ? vertical(A().dir1) : null));
    makeCurve(color.dir, 2, 3, 1, () => (show("dir") ? vertical(A().dir2) : null));

    [1, -1].forEach((sign) => {
      makeCurve(color.guide, 1.25, 2, 1, () => {
        const a = A();
        if (!show("guide") || a.kind !== "hyperbola") return null;
        const n = Math.hypot(a.a, a.b);
        const d: Vec = [a.a / n, (sign * a.b) / n];
        const s = extent();
        return [
          [a.x0 - d[0] * s, -d[1] * s],
          [a.x0 + d[0] * s, d[1] * s],
        ];
      });
    });

    // kurva utama (maksimal dua cabang); sampelnya dipakai untuk klik-menempatkan P
    const mainA = makeCurve(KINDS.ellipse.color, 3, 0, 1, () => {
      const p = pRef.current;
      const r = extent();
      const first = conicBranch(p.e, p.l, r, "a");
      samplesRef.current = first.concat(conicBranch(p.e, p.l, r, "b"));
      return toVec(first);
    });
    const mainB = makeCurve(KINDS.ellipse.color, 3, 0, 1, () => {
      const p = pRef.current;
      return toVec(conicBranch(p.e, p.l, extent(), "b"));
    });
    mainCurvesRef.current = [mainA, mainB];

    // garis singgung dan jarak
    makeCurve(color.tan, 2.25, 0, 1, () => {
      const a = A();
      if (!show("tangent") || !a.valid) return null;
      const n = Math.hypot(a.tx, a.ty);
      if (n < 1e-9) return null;
      const s = extent();
      const d: Vec = [a.tx / n, a.ty / n];
      return [
        [a.px - d[0] * s, a.py - d[1] * s],
        [a.px + d[0] * s, a.py + d[1] * s],
      ];
    });
    makeCurve(color.focus, 1.5, 2, 0.7, () => {
      const a = A();
      return show("tangent") && a.valid
        ? [
            [a.px, a.py],
            [0, 0],
          ]
        : null;
    });
    makeCurve(color.focus, 1.5, 2, 0.7, () => {
      const a = A();
      return show("tangent") && a.valid && a.f2
        ? [
            [a.px, a.py],
            [a.f2[0], 0],
          ]
        : null;
    });
    makeCurve(color.dir, 1.75, 2, 1, () => {
      const a = A();
      return show("tangent") && show("dir") && a.valid && a.dir1 !== null
        ? [
            [a.px, a.py],
            [a.dir1, a.py],
          ]
        : null;
    });

    /* Titik dan label */
    const dot = (
      x: () => number,
      y: () => number,
      fill: string,
      size: number,
      face = "o",
    ) =>
      board.create("point", [x, y], {
        name: "",
        withLabel: false,
        size,
        face,
        fillColor: fill,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        fixed: true,
        highlight: false,
      });
    const label = (
      x: () => number,
      y: () => number,
      text: string,
      tone: string,
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
          offset: [8, 8],
          highlight: false,
          fixed: true,
        },
      );

    const focusOn = () => show("focus");
    const f2x = () => (focusOn() && A().f2 ? A().f2![0] : Number.NaN);
    dot(() => (focusOn() ? 0 : Number.NaN), () => 0, color.focus, 5);
    dot(f2x, () => 0, color.focus, 5);
    label(() => (focusOn() ? 0 : Number.NaN), () => 0, "F₁", color.focus);
    label(f2x, () => 0, "F₂", color.focus);

    // pusat dan puncak
    const guideOn = () => show("guide");
    dot(
      () => (guideOn() && A().pair ? A().x0 : Number.NaN),
      () => 0,
      color.guide,
      4,
    );
    for (let k = 0; k < 2; k += 1) {
      dot(
        () => (guideOn() && A().vertices[k] ? A().vertices[k][0] : Number.NaN),
        () => 0,
        color.l,
        4,
        "<>",
      );
    }

    // titik P
    const pOn = () => show("tangent") && A().valid;
    dot(
      () => (pOn() ? A().px : Number.NaN),
      () => (pOn() ? A().py : Number.NaN),
      color.tan,
      6,
    );
    label(
      () => (pOn() ? A().px : Number.NaN),
      () => (pOn() ? A().py : Number.NaN),
      "P",
      color.tan,
    );

    board.update();

    // ───── klik/ketuk kurva untuk menempatkan titik P (geser tetap lancar) ─────
    let down: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved >= 5) return;
      const r = el.getBoundingClientRect();
      const [x1, y1, x2, y2] = board.getBoundingBox();
      const sx = r.width / (x2 - x1);
      const sy = r.height / (y1 - y2);
      const ux = x1 + ((e.clientX - r.left) / r.width) * (x2 - x1);
      const uy = y1 - ((e.clientY - r.top) / r.height) * (y1 - y2);
      let best: Sample | null = null;
      let bestD = 30; // piksel
      samplesRef.current.forEach((s) => {
        const d = Math.hypot((s[0] - ux) * sx, (s[1] - uy) * sy);
        if (d < bestD) {
          bestD = d;
          best = s;
        }
      });
      const hit = best as Sample | null;
      if (hit) clickRef.current(Math.round(hit[2] * 10) / 10);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);

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
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
      mainCurvesRef.current = [];
    };
  }, [boardId]);

  // Gambar ulang saat parameter atau pilihan tampilan berubah.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    mainCurvesRef.current.forEach((c) => c.setAttribute({ strokeColor: info.color }));
    board.update();
  }, [params, opts, info.color]);

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

  // Animasi: e bolak-balik 0 ↔ 3, atau titik P berkeliling
  useEffect(() => {
    if (!anim) return;
    let raf = 0;
    let last = performance.now();
    let dir = 1;
    let e = pRef.current.e;
    let t = pRef.current.t;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (anim === "e") {
        e += dir * dt * 0.35;
        if (e >= E_MAX) {
          e = E_MAX;
          dir = -1;
        } else if (e <= E_MIN) {
          e = E_MIN;
          dir = 1;
        }
        const value = Math.round(e * 100) / 100;
        setParams((prev) => ({ ...prev, e: value }));
      } else {
        t += dt * 35;
        if (t > 180) t -= 360;
        const value = Math.round(t * 10) / 10;
        setParams((prev) => ({ ...prev, t: value }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim]);

  /* ───────── Nilai turunan ───────── */

  const general = `${poly([
    [1 - params.e * params.e, "x²"],
    [-2 * params.e * params.l, "x"],
    [1, "y²"],
  ])} = ${fmt(params.l * params.l)}`;

  const tangentText = an.valid
    ? `${poly([
        [an.tanA, "x"],
        [an.tanB, "y"],
      ])} = ${fmt(an.tanC)}`
    : "—";

  const ineq =
    kind === "circle"
      ? "e = 0"
      : kind === "ellipse"
        ? "0 < e < 1"
        : kind === "parabola"
          ? "e = 1"
          : "e > 1";

  const showP = opts.tangent && an.valid;

  return (
    <div ref={rootRef} className={`cs${isFs ? " is-fs" : ""}`}>
      <p className="cs-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>
          Miringkan ponsel ke mode lanskap agar grafik dan pengatur nyaman
          dipakai.
        </span>
      </p>

      <div className="cs-layout">
        {/* ───── Grafik ───── */}
        <section className="cs-graph" aria-label="Grafik irisan kerucut">
          <div className="cs-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="cs-board"
              aria-label="Grafik irisan kerucut dengan fokus di titik asal. Seret untuk menggeser, gulir atau cubit untuk memperbesar, ketuk kurva untuk memindahkan titik P."
            />

            <div className="cs-hud">
              <p
                className="cs-chip"
                style={{ borderLeftColor: info.color }}
                aria-live="polite"
              >
                <b style={{ color: info.color }}>{info.label}</b>
                <span>e = {fmt(params.e)}</span>
              </p>
              {showP && (
                <p className="cs-pinfo">
                  <b>P</b> {fmtPt(an.px, an.py)}
                  {Number.isFinite(an.pd) && (
                    <>
                      {" "}
                      · PF = {fmt(an.pf1)} · d = {fmt(an.pd)}
                    </>
                  )}
                </p>
              )}
            </div>

            <div className="cs-tools" role="group" aria-label="Alat tampilan">
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
              {isFs && (
                <button
                  type="button"
                  className="cs-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`cs-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="cs-legend" aria-label="Legenda grafik">
            <li>
              <i style={{ borderColor: info.color }} /> {info.label.toLowerCase()}
            </li>
            {opts.focus && (
              <li>
                <b style={{ background: color.focus }} /> fokus
              </li>
            )}
            {opts.dir && (
              <li>
                <i className="dash" style={{ borderColor: color.dir }} /> direktriks
              </li>
            )}
            {opts.tangent && (
              <li>
                <i style={{ borderColor: color.tan }} /> garis singgung
              </li>
            )}
            {opts.ghost &&
              KIND_ORDER.map((k) => (
                <li key={k}>
                  <b style={{ background: KINDS[k].color, opacity: 0.5 }} />{" "}
                  {KINDS[k].label.toLowerCase()}
                </li>
              ))}
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`cs-panel-${baseId}`}
          className={`cs-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur irisan kerucut"
        >
          <div className="cs-tabs" role="group" aria-label="Bagian panel">
            <button type="button" aria-pressed={tab === "set"} onClick={() => setTab("set")}>
              Atur
            </button>
            <button type="button" aria-pressed={tab === "res"} onClick={() => setTab("res")}>
              Hasil
            </button>
          </div>

          {tab === "set" ? (
            <>
              <div className="cs-kinds" role="group" aria-label="Jenis irisan kerucut">
                {KIND_ORDER.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    style={{ "--kc": KINDS[k].color } as CSSProperties}
                    onClick={() => setParam({ e: KINDS[k].e })}
                  >
                    {KINDS[k].label}
                  </button>
                ))}
              </div>

              <div className="cs-sliders">
                <ParamRow
                  id={`cs-${baseId}-e`}
                  label="e"
                  title="eksentrisitas e"
                  value={params.e}
                  min={E_MIN}
                  max={E_MAX}
                  step={0.01}
                  digits={2}
                  tone={info.color}
                  playing={anim === "e"}
                  onChange={(v) => setParam({ e: v })}
                  onPlay={() => setAnim(anim === "e" ? null : "e")}
                />
                <ParamRow
                  id={`cs-${baseId}-l`}
                  label="ℓ"
                  title="parameter ℓ (setengah lebar fokal)"
                  value={params.l}
                  min={L_MIN}
                  max={L_MAX}
                  step={0.1}
                  digits={1}
                  tone={color.l}
                  onChange={(v) => setParam({ l: v })}
                />
                <ParamRow
                  id={`cs-${baseId}-t`}
                  label="θ"
                  title="sudut titik P dari fokus (derajat)"
                  value={params.t}
                  min={-180}
                  max={180}
                  step={0.5}
                  digits={1}
                  bipolar
                  tone={color.tan}
                  playing={anim === "t"}
                  onChange={(v) => setParam({ t: v })}
                  onPlay={() => setAnim(anim === "t" ? null : "t")}
                />
              </div>

              <div className="cs-chips" role="group" aria-label="Tampilkan di grafik">
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

              <button type="button" className="cs-reset" onClick={reset}>
                <RotateCcw size={13} aria-hidden="true" />
                <span>Atur ulang</span>
              </button>
            </>
          ) : (
            <>
              <dl className="cs-readouts" aria-live="polite">
                {cell("Jenis", `${info.label} (${ineq})`, info.color, true)}
                {cell("Persamaan umum", general, undefined, true)}
                {cell("Bentuk baku", standardForm(an, params.l), info.color, true)}

                {kind === "circle" && (
                  <>
                    {cell("Pusat = fokus", "(0; 0)")}
                    {cell("Jari-jari = ℓ", fmt(params.l), color.l)}
                  </>
                )}
                {kind === "parabola" && (
                  <>
                    {cell("Fokus", "(0; 0)", color.focus)}
                    {cell("Puncak", fmtPt(-params.l / 2, 0), color.l)}
                    {cell("Direktriks", `x = ${fmt(an.dir1 ?? Number.NaN)}`, color.dir)}
                    {cell("p = ℓ/2", fmt(params.l / 2))}
                  </>
                )}
                {an.pair && (
                  <>
                    {cell("a", fmt(an.a))}
                    {cell("b", fmt(an.b))}
                    {cell(kind === "ellipse" ? "c = √(a² − b²)" : "c = √(a² + b²)", fmt(an.c))}
                    {cell("e = c / a", fmt(an.c / an.a), info.color)}
                    {cell("Pusat", fmtPt(an.x0, 0))}
                    {cell("Puncak", an.vertices.map((v) => fmtPt(v[0], v[1])).join("  "), color.l)}
                    {cell("Fokus F₁", "(0; 0)", color.focus)}
                    {cell("Fokus F₂", fmtPt(an.f2 ? an.f2[0] : 0, 0), color.focus)}
                    {cell(
                      "Direktriks",
                      `x = ${fmt(an.dir1 ?? Number.NaN)} dan x = ${fmt(an.dir2 ?? Number.NaN)}`,
                      color.dir,
                      true,
                    )}
                    {kind === "hyperbola" &&
                      cell("Asimtot", `y = ±${fmt(an.b / an.a)}${shifted(an.x0)}`, color.guide, true)}
                  </>
                )}
              </dl>

              <dl className="cs-readouts" aria-live="polite">
                {an.valid ? (
                  <>
                    {cell("Titik P", fmtPt(an.px, an.py), color.tan)}
                    {cell("θ", `${fmt(params.t, 1)}°`, color.tan)}
                    {cell("PF₁", fmt(an.pf1))}
                    {Number.isFinite(an.pf2) && cell("PF₂", fmt(an.pf2))}
                    {Number.isFinite(an.pd) && cell("Jarak ke direktriks", fmt(an.pd), color.dir)}
                    {Number.isFinite(an.ratio) && cell("PF₁ / jarak = e", fmt(an.ratio), info.color)}
                    {kind === "ellipse" &&
                      cell(
                        "PF₁ + PF₂ = 2a",
                        `${fmt(an.pf1 + an.pf2)} (2a = ${fmt(2 * an.a)})`,
                        undefined,
                        true,
                      )}
                    {kind === "hyperbola" &&
                      cell(
                        "|PF₁ − PF₂| = 2a",
                        `${fmt(Math.abs(an.pf1 - an.pf2))} (2a = ${fmt(2 * an.a)})`,
                        undefined,
                        true,
                      )}
                    {cell("Garis singgung", tangentText, color.tan, true)}
                    {cell("Gradien", an.slope === null ? "tegak lurus sumbu x" : fmt(an.slope))}
                  </>
                ) : (
                  cell("Titik P", "terlalu jauh. Ubah θ agar P kembali ke kurva.", undefined, true)
                )}
              </dl>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ConicSectionsSimulation;
