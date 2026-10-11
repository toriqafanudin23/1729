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
import "./CircleSectorSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi sektor lingkaran (juring) — tema slate seperti landing page 1729.
   Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Layar penuh: grafik 100% layar, toolbar dan panel pengatur mengambang.

   Lingkaran berpusat di O(0, 0) dengan jari-jari r. Titik A berada pada arah φ
   dari sumbu x positif dan titik B pada arah φ + θ, dengan θ = sudut pusat.

       panjang busur   s = θ/360° · 2πr
       luas juring     L = θ/360° · πr²
       tali busur      c = 2r sin(θ/2)
       apotema         d = r cos(θ/2)
       luas tembereng  ½ r² (θ − sin θ)      (θ dalam radian)
       garis singgung  di A:  x·xA + y·yA = r²   (tegak lurus OA) */

/* ───────── Tipe ───────── */

type Vec = [number, number];
type Params = { r: number; t: number; p: number };
type Opts = {
  circle: boolean;
  sector: boolean;
  segment: boolean;
  chord: boolean;
  apothem: boolean;
  tangent: boolean;
  tpoint: boolean;
  angle: boolean;
};
type Tab = "set" | "res";
type Anim = "t" | "p" | null;
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};

/* ───────── Konstanta ───────── */

const DEG = Math.PI / 180;
const R_MIN = 1;
const R_MAX = 8;
const T_MIN = 1;
const T_MAX = 360;
const HOME_BOX: [number, number, number, number] = [-14, 10, 14, -10];
/** Sudut pusat di atas ini: garis singgung hampir sejajar, titik T disembunyikan. */
const T_POINT_MAX = 175;

const DEFAULT_PARAMS: Params = { r: 5, t: 60, p: 30 };
const DEFAULT_OPTS: Opts = {
  circle: true,
  sector: true,
  segment: false,
  chord: true,
  apothem: false,
  tangent: true,
  tpoint: false,
  angle: true,
};

/* Warna grafik: dipakai juga oleh legenda, slider, dan hasil di panel. */
const color = {
  arc: "#0d9488",
  radius: "#0f172a",
  chord: "#e11d48",
  segment: "#ea580c",
  tan: "#2563eb",
  angle: "#7c3aed",
  guide: "#94a3b8",
  circle: "#94a3b8",
};

const PRESETS: { t: number; color: string }[] = [
  { t: 60, color: color.arc },
  { t: 90, color: color.angle },
  { t: 120, color: color.segment },
  { t: 180, color: color.chord },
];

const optionRows: { key: keyof Opts; label: string }[] = [
  { key: "circle", label: "Lingkaran" },
  { key: "sector", label: "Juring" },
  { key: "segment", label: "Tembereng" },
  { key: "chord", label: "Tali busur" },
  { key: "apothem", label: "Apotema" },
  { key: "tangent", label: "Garis singgung" },
  { key: "tpoint", label: "Titik T" },
  { key: "angle", label: "Sudut θ" },
];

/* ───────── Matematika ───────── */

function analyze(r: number, tDeg: number, pDeg: number) {
  const th = tDeg * DEG;
  const ph = pDeg * DEG;
  const half = th / 2;
  const mid = ph + half;

  const A: Vec = [r * Math.cos(ph), r * Math.sin(ph)];
  const B: Vec = [r * Math.cos(ph + th), r * Math.sin(ph + th)];
  const apothem = r * Math.cos(half); // bertanda: negatif bila θ > 180°
  const M: Vec = [apothem * Math.cos(mid), apothem * Math.sin(mid)];

  const tValid = tDeg < T_POINT_MAX;
  const tLen = r * Math.tan(half);
  const ot = r / Math.cos(half);
  const T: Vec = tValid
    ? [ot * Math.cos(mid), ot * Math.sin(mid)]
    : [Number.NaN, Number.NaN];

  const arc = r * th;
  return {
    r,
    tDeg,
    pDeg,
    th,
    ph,
    mid,
    A,
    B,
    M,
    T,
    tValid,
    tLen,
    ot,
    arc,
    sector: 0.5 * r * r * th,
    chord: 2 * r * Math.sin(half),
    apothem,
    segment: 0.5 * r * r * (th - Math.sin(th)),
    circumference: 2 * Math.PI * r,
    area: Math.PI * r * r,
    perimeter: 2 * r + arc,
    // garis singgung di A dan B: x·x0 + y·y0 = r²
    slopeA: Math.abs(A[1]) > 1e-9 ? -A[0] / A[1] : null,
    slopeB: Math.abs(B[1]) > 1e-9 ? -B[0] / B[1] : null,
  };
}

type Analysis = ReturnType<typeof analyze>;

/** Titik-titik busur berpusat di (0, 0): dari sudut a0 sepanjang span (derajat). */
function arcPoints(radius: number, a0Deg: number, spanDeg: number): Vec[] {
  const n = Math.max(24, Math.ceil(Math.abs(spanDeg) * 2));
  const out: Vec[] = [];
  for (let i = 0; i <= n; i += 1) {
    const a = (a0Deg + (spanDeg * i) / n) * DEG;
    out.push([radius * Math.cos(a), radius * Math.sin(a)]);
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

const slopeText = (s: number | null) =>
  s === null ? "tegak lurus sumbu x" : fmt(s);

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
    className: "sc-step",
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

/** Satu baris:  r  −  ────●────  +  5  ▶ */
function ParamRow({
  id,
  label,
  title,
  value,
  min,
  max,
  step,
  digits,
  unit,
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
  unit?: string;
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
  const nudge = unit ? 1 : 0.1;
  const bind = useHoldRepeat((d) => onChange(round(clamp(value + d * nudge))));
  const pct = ((clamp(value) - min) / (max - min)) * 100;
  const style = {
    "--lo": bipolar ? `${Math.min(50, pct)}%` : "0%",
    "--hi": bipolar ? `${Math.max(50, pct)}%` : `${pct}%`,
    "--sc": tone,
  } as CSSProperties;

  return (
    <div className="sc-slider" style={style}>
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
        className="sc-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value)}
        aria-valuetext={`${title} sama dengan ${fmt(value, digits)}${unit ?? ""}`}
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
        {unit ?? ""}
      </output>
      {onPlay ? (
        <button
          type="button"
          className="sc-step sc-play"
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
  <div key={key} className={wide ? "sc-wide" : undefined}>
    <dt>{key}</dt>
    <dd style={tone ? { color: tone } : undefined}>{value}</dd>
  </div>
);

/* ───────── Komponen utama ───────── */

export function CircleSectorSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `sc-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);

  const [params, setParams] = useStoredSimulationState<Params>(
    "sector.params",
    DEFAULT_PARAMS,
  );
  const [opts, setOpts] = useStoredSimulationState<Opts>(
    "sector.opts",
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

  const an = analyze(params.r, params.t, params.p);

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
      if (!cache || cache.p !== p) cache = { p, v: analyze(p.r, p.t, p.p) };
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
      build: () => Vec[] | null,
      fill?: { color: string; opacity: number },
    ) => {
      const curve = board.create("curve", [[0], [0]], {
        strokeColor: stroke,
        strokeWidth: width,
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

    const O: Vec = [0, 0];

    // lingkaran penuh (tipis)
    makeCurve(color.circle, 1.5, 0, () =>
      show("circle") ? arcPoints(A().r, 0, 360) : null,
    );

    // juring: O → A → busur → B → O
    makeCurve(
      color.arc,
      0,
      0,
      () => {
        if (!show("sector")) return null;
        const a = A();
        return [O, ...arcPoints(a.r, a.pDeg, a.tDeg), O];
      },
      { color: color.arc, opacity: 0.2 },
    );

    // tembereng: busur lalu kembali ke A lewat tali busur
    makeCurve(
      color.segment,
      0,
      0,
      () => {
        if (!show("segment")) return null;
        const a = A();
        return [...arcPoints(a.r, a.pDeg, a.tDeg), a.A];
      },
      { color: color.segment, opacity: 0.32 },
    );

    // garis singgung di A dan B (tegak lurus jari-jari)
    ([0, 1] as const).forEach((k) => {
      makeCurve(color.tan, 2.25, 0, () => {
        if (!show("tangent")) return null;
        const a = A();
        const pt = k === 0 ? a.A : a.B;
        const ang = k === 0 ? a.ph : a.ph + a.th;
        const d: Vec = [-Math.sin(ang), Math.cos(ang)];
        const s = extent();
        return [
          [pt[0] - d[0] * s, pt[1] - d[1] * s],
          [pt[0] + d[0] * s, pt[1] + d[1] * s],
        ];
      });
    });

    // OT (sumbu simetri layang-layang OATB)
    makeCurve(color.guide, 1.5, 2, () => {
      const a = A();
      return show("tpoint") && show("tangent") && a.tValid ? [O, a.T] : null;
    });

    // jari-jari OA dan OB
    makeCurve(color.radius, 2, 0, () => [O, A().A]);
    makeCurve(color.radius, 2, 0, () => [O, A().B]);

    // tali busur dan apotema
    makeCurve(color.chord, 2.75, 0, () => {
      const a = A();
      return show("chord") ? [a.A, a.B] : null;
    });
    makeCurve(color.guide, 1.5, 2, () => {
      const a = A();
      return show("apothem") ? [O, a.M] : null;
    });

    // busur kecil penanda sudut pusat θ
    const angleRadius = () => Math.min(2, Math.max(0.7, A().r * 0.25));
    makeCurve(color.angle, 2.5, 0, () => {
      if (!show("angle")) return null;
      const a = A();
      return arcPoints(angleRadius(), a.pDeg, a.tDeg);
    });

    // busur AB (utama)
    makeCurve(color.arc, 4.5, 0, () => {
      const a = A();
      return arcPoints(a.r, a.pDeg, a.tDeg);
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

    const tOn = () => show("tpoint") && show("tangent");
    const mOn = () => show("apothem") || show("chord");

    dot(() => 0, () => 0, color.radius, 5);
    dot(() => A().A[0], () => A().A[1], color.arc, 6);
    dot(() => A().B[0], () => A().B[1], color.arc, 6);
    dot(() => (tOn() ? A().T[0] : Number.NaN), () => A().T[1], color.tan, 5);
    dot(() => (mOn() ? A().M[0] : Number.NaN), () => A().M[1], color.guide, 4);

    label(() => 0, () => 0, "O", color.radius, [-16, -16]);
    label(() => A().A[0], () => A().A[1], "A", color.radius);
    label(() => A().B[0], () => A().B[1], "B", color.radius);
    label(() => (tOn() ? A().T[0] : Number.NaN), () => A().T[1], "T", color.tan);

    // θ di dalam busur kecil
    label(
      () => (show("angle") ? angleRadius() * 1.7 * Math.cos(A().mid) : Number.NaN),
      () => angleRadius() * 1.7 * Math.sin(A().mid),
      () => `θ = ${fmt(pRef.current.t, 1)}°`,
      color.angle,
      [-14, -8],
    );
    // r pada OA, c pada tali busur, d pada apotema
    label(() => A().A[0] * 0.5, () => A().A[1] * 0.5, "r", color.radius, [-4, 6]);
    label(
      () => (show("chord") && A().chord > 0.3 ? A().M[0] : Number.NaN),
      () => A().M[1],
      "c",
      color.chord,
      [8, -14],
    );
    label(
      () => (show("apothem") ? A().M[0] * 0.5 : Number.NaN),
      () => A().M[1] * 0.5,
      "d",
      color.guide,
      [-14, 4],
    );

    board.update();

    // ───── klik/ketuk lingkaran untuk memindahkan titik B (geser tetap lancar) ─────
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
      const rect = el.getBoundingClientRect();
      const [x1, y1, x2, y2] = board.getBoundingBox();
      const sx = rect.width / (x2 - x1);
      const ux = x1 + ((e.clientX - rect.left) / rect.width) * (x2 - x1);
      const uy = y1 - ((e.clientY - rect.top) / rect.height) * (y1 - y2);
      const a = A();
      const gap = Math.abs(Math.hypot(ux, uy) - a.r) * sx; // piksel
      if (gap > 30) return;
      const angle = (Math.atan2(uy, ux) / DEG - a.pDeg + 720) % 360;
      const value = Math.round(angle * 10) / 10;
      clickRef.current(Math.min(T_MAX, Math.max(T_MIN, value)));
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
    };
  }, [boardId]);

  // Gambar ulang saat parameter atau pilihan tampilan berubah.
  useEffect(() => {
    boardRef.current?.update();
  }, [params, opts]);

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

  // Animasi: θ bolak-balik 1° ↔ 360°, atau seluruh juring berputar (φ)
  useEffect(() => {
    if (!anim) return;
    let raf = 0;
    let last = performance.now();
    let dir = 1;
    let t = pRef.current.t;
    let p = pRef.current.p;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (anim === "t") {
        t += dir * dt * 45;
        if (t >= T_MAX) {
          t = T_MAX;
          dir = -1;
        } else if (t <= T_MIN) {
          t = T_MIN;
          dir = 1;
        }
        const value = Math.round(t * 10) / 10;
        setParams((prev) => ({ ...prev, t: value }));
      } else {
        p += dt * 30;
        if (p > 180) p -= 360;
        const value = Math.round(p * 10) / 10;
        setParams((prev) => ({ ...prev, p: value }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim]);

  /* ───────── Nilai turunan ───────── */

  const tStr = fmt(params.t, 1);
  const rStr = fmt(params.r, 2);
  const r2 = fmt(params.r * params.r);
  const isMajor = params.t > 180;
  const kindLabel = isMajor
    ? "Busur besar"
    : params.t === 180
      ? "Setengah lingkaran"
      : "Busur kecil";
  const tangentA = `${poly([
    [an.A[0], "x"],
    [an.A[1], "y"],
  ])} = ${r2}`;
  const tangentB = `${poly([
    [an.B[0], "x"],
    [an.B[1], "y"],
  ])} = ${r2}`;

  return (
    <div ref={rootRef} className={`sc${isFs ? " is-fs" : ""}`}>
      <p className="sc-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>
          Miringkan ponsel ke mode lanskap agar grafik dan pengatur nyaman
          dipakai.
        </span>
      </p>

      <div className="sc-layout">
        {/* ───── Grafik ───── */}
        <section className="sc-graph" aria-label="Grafik sektor lingkaran">
          <div className="sc-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="sc-board"
              aria-label="Grafik lingkaran dengan pusat di titik asal. Seret untuk menggeser, gulir atau cubit untuk memperbesar, ketuk lingkaran untuk memindahkan titik B."
            />

            <div className="sc-hud">
              <p className="sc-chip" aria-live="polite">
                <b>{kindLabel}</b>
                <span>
                  r = {rStr} · θ = {tStr}°
                </span>
              </p>
              <p className="sc-pinfo">
                <span>
                  <b>s</b> = {fmt(an.arc)}
                </span>
                <span>
                  <b>L</b> = {fmt(an.sector)}
                </span>
                {opts.chord && (
                  <span>
                    <b>c</b> = {fmt(an.chord)}
                  </span>
                )}
                {opts.tangent && opts.tpoint && an.tValid && (
                  <span>
                    <b>AT</b> = {fmt(an.tLen)}
                  </span>
                )}
              </p>
            </div>

            <div className="sc-tools" role="group" aria-label="Alat tampilan">
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
                  className="sc-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`sc-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="sc-legend" aria-label="Legenda grafik">
            <li>
              <i style={{ borderColor: color.arc }} /> busur AB
            </li>
            <li>
              <i style={{ borderColor: color.radius }} /> jari-jari
            </li>
            {opts.sector && (
              <li>
                <b style={{ background: color.arc, opacity: 0.4 }} /> juring
              </li>
            )}
            {opts.segment && (
              <li>
                <b style={{ background: color.segment, opacity: 0.6 }} /> tembereng
              </li>
            )}
            {opts.chord && (
              <li>
                <i style={{ borderColor: color.chord }} /> tali busur
              </li>
            )}
            {opts.apothem && (
              <li>
                <i className="dash" style={{ borderColor: color.guide }} /> apotema
              </li>
            )}
            {opts.tangent && (
              <li>
                <i style={{ borderColor: color.tan }} /> garis singgung
              </li>
            )}
            {opts.angle && (
              <li>
                <i style={{ borderColor: color.angle }} /> sudut pusat
              </li>
            )}
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`sc-panel-${baseId}`}
          className={`sc-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur sektor lingkaran"
        >
          <div className="sc-tabs" role="group" aria-label="Bagian panel">
            <button type="button" aria-pressed={tab === "set"} onClick={() => setTab("set")}>
              Atur
            </button>
            <button type="button" aria-pressed={tab === "res"} onClick={() => setTab("res")}>
              Hasil
            </button>
          </div>

          {tab === "set" ? (
            <>
              <div className="sc-presets" role="group" aria-label="Sudut pusat istimewa">
                {PRESETS.map((item) => (
                  <button
                    key={item.t}
                    type="button"
                    aria-pressed={Math.abs(params.t - item.t) < 0.05}
                    style={{ "--kc": item.color } as CSSProperties}
                    onClick={() => setParam({ t: item.t })}
                  >
                    {item.t}°
                  </button>
                ))}
              </div>

              <div className="sc-sliders">
                <ParamRow
                  id={`sc-${baseId}-r`}
                  label="r"
                  title="jari-jari lingkaran r"
                  value={params.r}
                  min={R_MIN}
                  max={R_MAX}
                  step={0.1}
                  digits={1}
                  tone={color.radius}
                  onChange={(v) => setParam({ r: v })}
                />
                <ParamRow
                  id={`sc-${baseId}-t`}
                  label="θ"
                  title="sudut pusat θ (derajat)"
                  value={params.t}
                  min={T_MIN}
                  max={T_MAX}
                  step={0.5}
                  digits={1}
                  unit="°"
                  tone={color.angle}
                  playing={anim === "t"}
                  onChange={(v) => setParam({ t: v })}
                  onPlay={() => setAnim(anim === "t" ? null : "t")}
                />
                <ParamRow
                  id={`sc-${baseId}-p`}
                  label="φ"
                  title="arah titik A dari sumbu x (derajat)"
                  value={params.p}
                  min={-180}
                  max={180}
                  step={0.5}
                  digits={1}
                  unit="°"
                  bipolar
                  tone={color.tan}
                  playing={anim === "p"}
                  onChange={(v) => setParam({ p: v })}
                  onPlay={() => setAnim(anim === "p" ? null : "p")}
                />
              </div>

              <div className="sc-chips" role="group" aria-label="Tampilkan di grafik">
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

              <button type="button" className="sc-reset" onClick={reset}>
                <RotateCcw size={13} aria-hidden="true" />
                <span>Atur ulang</span>
              </button>
            </>
          ) : (
            <>
              <dl className="sc-readouts" aria-live="polite">
                {cell(
                  "Bagian lingkaran",
                  `${fmt(params.t / 360, 3)} (${fmt((params.t / 360) * 100, 1)}%)${
                    params.t === 180 ? " · tali busur = diameter" : ""
                  }${isMajor ? " · apotema di sisi lain" : ""}`,
                  color.arc,
                  true,
                )}
                {cell("Busur s = θ/360° × 2πr", `${tStr}/360 × 2π × ${rStr} = ${fmt(an.arc)}`, color.arc, true)}
                {cell("Juring L = θ/360° × πr²", `${tStr}/360 × π × ${rStr}² = ${fmt(an.sector)}`, color.arc, true)}
                {cell("Keliling juring 2r + s", fmt(an.perimeter))}
                {cell("Luas lingkaran πr²", fmt(an.area))}
              </dl>

              <dl className="sc-readouts" aria-live="polite">
                {cell("Tali busur c = 2r sin(θ/2)", fmt(an.chord), color.chord)}
                {cell("Apotema d = r cos(θ/2)", fmt(an.apothem), color.guide)}
                {cell("Tembereng ½r²(θ − sin θ)", fmt(an.segment), color.segment, true)}
                {cell("Titik A", fmtPt(an.A[0], an.A[1]))}
                {cell("Titik B", fmtPt(an.B[0], an.B[1]))}
                {cell("Titik tengah AB", fmtPt(an.M[0], an.M[1]), undefined, true)}
              </dl>

              <dl className="sc-readouts" aria-live="polite">
                {cell("Singgung di A", tangentA, color.tan, true)}
                {cell("Gradien di A", slopeText(an.slopeA))}
                {cell("Singgung di B", tangentB, color.tan, true)}
                {cell("Gradien di B", slopeText(an.slopeB))}
                {cell("Sudut tali busur–singgung θ/2", `${fmt(params.t / 2, 2)}°`, undefined, true)}
                {an.tValid ? (
                  <>
                    {cell("Titik T", fmtPt(an.T[0], an.T[1]), color.tan)}
                    {cell("AT = BT = r tan(θ/2)", fmt(an.tLen), color.tan)}
                    {cell("OT = r / cos(θ/2)", fmt(an.ot))}
                    {cell("∠ATB = 180° − θ", `${fmt(180 - params.t, 2)}°`)}
                  </>
                ) : (
                  cell(
                    "Titik T",
                    params.t === 180
                      ? "tidak ada (kedua singgung sejajar)"
                      : "terlalu jauh / di sisi lain",
                    undefined,
                    true,
                  )
                )}
              </dl>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default CircleSectorSimulation;
