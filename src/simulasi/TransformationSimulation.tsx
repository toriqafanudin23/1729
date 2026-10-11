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
import JXG from "jsxgraph";
import "../styles/jsxgraph.css";
import "./TransformationSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi transformasi geometri — tema slate seperti landing page 1729.
   Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Grafik : panel = 2 : 1. Panel punya tiga tab: Titik, Langkah, Hasil.
   Layar penuh: grafik 100% layar; toolbar, pemutar, dan panel mengambang. */

/* ---------- Tipe ---------- */

type Vec = [number, number];
type Mat = number[][];
type ReflectionAxis = "x" | "y" | "yx" | "ynx";

type Step =
  | { id: number; type: "translation"; tx: number; ty: number }
  | { id: number; type: "reflection"; axis: ReflectionAxis }
  | { id: number; type: "rotation"; angle: number; cx: number; cy: number }
  | { id: number; type: "dilation"; k: number; cx: number; cy: number };

type StepType = Step["type"];

type Draft = {
  tx: number;
  ty: number;
  axis: ReflectionAxis;
  angle: number;
  rcx: number;
  rcy: number;
  k: number;
  dcx: number;
  dcy: number;
};
type DraftNumKey = Exclude<keyof Draft, "axis">;

type PanelTab = "point" | "steps" | "result";

type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};

const panelTabs: { tab: PanelTab; label: string }[] = [
  { tab: "point", label: "Titik" },
  { tab: "steps", label: "Langkah" },
  { tab: "result", label: "Hasil" },
];

/* ---------- Konstanta ---------- */

const MAX_STEPS = 5;
const STEP_MS = 1600;
const LIMIT = 9.5;
const INITIAL_BOX: [number, number, number, number] = [-10, 10, 10, -10];

/* Warna grafik (dipakai juga oleh legenda dan panel lewat CSS). */
const colors = {
  original: "#2563eb",
  image: "#ea580c",
  ghost: "#94a3b8",
  guide: "#7c3aed",
};

const defaultVertices: Record<number, Vec[]> = {
  1: [[2, 1]],
  3: [
    [1, 1],
    [4, 1],
    [2, 3],
  ],
  4: [
    [1, 1],
    [4, 1],
    [4, 3],
    [2, 3],
  ],
};

const shapeOptions = [
  { count: 1, label: "Titik" },
  { count: 3, label: "Segitiga" },
  { count: 4, label: "Segiempat" },
];

const typeOptions: { type: StepType; label: string }[] = [
  { type: "translation", label: "Translasi" },
  { type: "reflection", label: "Refleksi" },
  { type: "rotation", label: "Rotasi" },
  { type: "dilation", label: "Dilatasi" },
];

const speedOptions = [0.5, 1, 2];

const axisLabels: Record<ReflectionAxis, string> = {
  x: "sumbu x",
  y: "sumbu y",
  yx: "garis y = x",
  ynx: "garis y = −x",
};

const axisShort: Record<ReflectionAxis, string> = {
  x: "sumbu x",
  y: "sumbu y",
  yx: "y = x",
  ynx: "y = −x",
};

const reflectionAngles: Record<ReflectionAxis, number> = {
  x: 0,
  y: 90,
  yx: 45,
  ynx: -45,
};

const exactReflections: Record<ReflectionAxis, Mat> = {
  x: [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ],
  y: [
    [-1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  yx: [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ],
  ynx: [
    [0, -1, 0],
    [-1, 0, 0],
    [0, 0, 1],
  ],
};

const mirrorEnds: Record<ReflectionAxis, [Vec, Vec]> = {
  x: [
    [-30, 0],
    [30, 0],
  ],
  y: [
    [0, -30],
    [0, 30],
  ],
  yx: [
    [-30, -30],
    [30, 30],
  ],
  ynx: [
    [-30, 30],
    [30, -30],
  ],
};

const initialSteps: Step[] = [
  { id: 1, type: "rotation", angle: 90, cx: 0, cy: 0 },
  { id: 2, type: "translation", tx: 4, ty: -1 },
];

const initialDraft: Draft = {
  tx: 3,
  ty: 1,
  axis: "y",
  angle: 90,
  rcx: 0,
  rcy: 0,
  k: 2,
  dcx: 0,
  dcy: 0,
};

/** Baris penggeser untuk membentuk langkah baru. */
const draftRows: Record<
  Exclude<StepType, "reflection">,
  {
    key: DraftNumKey;
    label: string;
    hint: string;
    min: number;
    max: number;
    step: number;
  }[]
> = {
  translation: [
    { key: "tx", label: "Tx", hint: "Geser mendatar", min: -9, max: 9, step: 1 },
    { key: "ty", label: "Ty", hint: "Geser tegak", min: -9, max: 9, step: 1 },
  ],
  rotation: [
    {
      key: "angle",
      label: "θ",
      hint: "Sudut (°), positif berlawanan arah jarum jam",
      min: -360,
      max: 360,
      step: 5,
    },
    { key: "rcx", label: "cx", hint: "Pusat x", min: -9, max: 9, step: 1 },
    { key: "rcy", label: "cy", hint: "Pusat y", min: -9, max: 9, step: 1 },
  ],
  dilation: [
    { key: "k", label: "k", hint: "Faktor skala", min: -4, max: 4, step: 0.1 },
    { key: "dcx", label: "cx", hint: "Pusat x", min: -9, max: 9, step: 1 },
    { key: "dcy", label: "cy", hint: "Pusat y", min: -9, max: 9, step: 1 },
  ],
};

/* ---------- Matematika ---------- */

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const clampTo = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clampLimit = (value: number) => clampTo(value, -LIMIT, LIMIT);

const identity = (): Mat => [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

function multiply(a: Mat, b: Mat): Mat {
  return a.map((_, i) =>
    b[0].map(
      (__, j) => a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j],
    ),
  );
}

const translationMatrix = (tx: number, ty: number): Mat => [
  [1, 0, tx],
  [0, 1, ty],
  [0, 0, 1],
];

const rotationMatrix = (rad: number): Mat => [
  [Math.cos(rad), -Math.sin(rad), 0],
  [Math.sin(rad), Math.cos(rad), 0],
  [0, 0, 1],
];

const scaleMatrix = (sx: number, sy: number): Mat => [
  [sx, 0, 0],
  [0, sy, 0],
  [0, 0, 1],
];

function aboutCenter(m: Mat, cx: number, cy: number): Mat {
  return multiply(
    translationMatrix(cx, cy),
    multiply(m, translationMatrix(-cx, -cy)),
  );
}

/**
 * Matriks satu langkah pada progres lokal t (0..1).
 * Pada t = 1 hasilnya adalah matriks transformasi yang sebenarnya.
 * Refleksi dianimasikan dengan "membalik" bidang melalui skala cos(πt).
 */
function stepMatrix(step: Step, t: number): Mat {
  switch (step.type) {
    case "translation":
      return translationMatrix(step.tx * t, step.ty * t);
    case "rotation":
      return aboutCenter(
        rotationMatrix(toRadians(step.angle * t)),
        step.cx,
        step.cy,
      );
    case "dilation": {
      const s = 1 + (step.k - 1) * t;
      return aboutCenter(scaleMatrix(s, s), step.cx, step.cy);
    }
    case "reflection": {
      if (t >= 1) return exactReflections[step.axis];
      const phi = toRadians(reflectionAngles[step.axis]);
      return multiply(
        rotationMatrix(phi),
        multiply(scaleMatrix(1, Math.cos(Math.PI * t)), rotationMatrix(-phi)),
      );
    }
  }
}

/** Komposisi: langkah ke-i selesai penuh jika progress ≥ i + 1. */
function compositeAt(steps: Step[], progress: number): Mat {
  return steps.reduce(
    (m, step, i) => multiply(stepMatrix(step, clamp01(progress - i)), m),
    identity(),
  );
}

function applyMat(m: Mat, [x, y]: Vec): Vec {
  return [
    m[0][0] * x + m[0][1] * y + m[0][2],
    m[1][0] * x + m[1][1] * y + m[1][2],
  ];
}

/* ---------- Format ---------- */

function cleanNumber(value: number) {
  const rounded = Math.round(value * 1000) / 1000;
  return Math.abs(rounded) < 1e-9 ? 0 : rounded;
}

function formatValue(value: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 })
    .format(cleanNumber(value))
    .replace("-", "−");
}

const formatCoord = ([x, y]: Vec) => `(${formatValue(x)}; ${formatValue(y)})`;

const subscript = (n: number) =>
  String(n)
    .split("")
    .map((digit) => "₀₁₂₃₄₅₆₇₈₉"[Number(digit)])
    .join("");

function vertexNames(count: number) {
  return count === 1 ? ["P"] : ["A", "B", "C", "D"].slice(0, count);
}

function describeStep(step: Step): { name: string; detail: string } {
  switch (step.type) {
    case "translation":
      return {
        name: "Translasi",
        detail: `T(${formatValue(step.tx)}; ${formatValue(step.ty)})`,
      };
    case "reflection":
      return { name: "Refleksi", detail: `terhadap ${axisLabels[step.axis]}` };
    case "rotation":
      return {
        name: "Rotasi",
        detail: `${formatValue(step.angle)}° berpusat di ${formatCoord([step.cx, step.cy])}`,
      };
    case "dilation":
      return {
        name: "Dilatasi",
        detail: `faktor ${formatValue(step.k)} berpusat di ${formatCoord([step.cx, step.cy])}`,
      };
  }
}

/* ---------- Komponen kecil ---------- */

/** Tombol tahan-untuk-mengulang (− / + di samping slider). */
function useHoldRepeat(onStep: (direction: 1 | -1) => void) {
  const stepRef = useRef(onStep);
  stepRef.current = onStep;
  const timers = useRef<{ delay?: number; repeat?: number }>({});

  const stop = () => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.repeat);
    timers.current = {};
  };

  useEffect(
    () => () => {
      window.clearTimeout(timers.current.delay);
      window.clearInterval(timers.current.repeat);
    },
    [],
  );

  return (direction: 1 | -1) => ({
    type: "button" as const,
    className: "tfs-step",
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stop();
      stepRef.current(direction);
      timers.current.delay = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(
          () => stepRef.current(direction),
          80,
        );
      }, 450);
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

/** Satu baris: x  −  ──●──  +  2 */
function SliderField({
  label,
  hint,
  tone,
  min,
  max,
  step,
  value,
  onSlide,
  onNudge,
}: {
  label: string;
  hint: string;
  tone: "original" | "image";
  min: number;
  max: number;
  step: number;
  value: number;
  onSlide: (value: number) => void;
  onNudge: (direction: 1 | -1) => void;
}) {
  const inputId = `tfs-field-${useId().replace(/:/g, "")}`;
  const bind = useHoldRepeat(onNudge);

  // Isi dari titik 0 (tengah) menuju nilai, karena rentang simetris.
  const v = clampTo(value, min, max);
  const pct = ((v - min) / (max - min)) * 100;
  const zero = ((0 - min) / (max - min)) * 100;
  const style = {
    "--lo": `${Math.min(zero, pct)}%`,
    "--hi": `${Math.max(zero, pct)}%`,
  } as CSSProperties;

  return (
    <div className={`tfs-row tfs-row-${tone}`} style={style}>
      <label htmlFor={inputId} title={hint} aria-label={`${label} (${hint})`}>
        {label}
      </label>
      <button {...bind(-1)} aria-label={`Kurangi ${label}`}>
        <Minus size={13} aria-hidden="true" />
      </button>
      <input
        id={inputId}
        className="tfs-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        aria-valuetext={`${label} sama dengan ${formatValue(value)}`}
        onChange={(event) => onSlide(Number(event.currentTarget.value))}
      />
      <button {...bind(1)} aria-label={`Tambah ${label}`}>
        <Plus size={13} aria-hidden="true" />
      </button>
      <output htmlFor={inputId}>{formatValue(value)}</output>
    </div>
  );
}

function MatrixView({ rows, label }: { rows: Mat; label: string }) {
  const description = rows
    .map((row) => row.map(formatValue).join(" "))
    .join("; ");
  return (
    <div
      className="tfs-matrix"
      role="img"
      aria-label={`${label}: ${description}`}
      style={{ gridTemplateColumns: `repeat(${rows[0].length}, auto)` }}
    >
      {rows.flat().map((value, index) => (
        <span key={index}>{formatValue(value)}</span>
      ))}
    </div>
  );
}

/* ---------- Komponen utama ---------- */

export function TransformationSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `tfs-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<ReturnType<typeof JXG.JSXGraph.initBoard> | null>(
    null,
  );
  const pointsRef = useRef<JXG.Point[]>([]);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);

  const [tab, setTab] = useState<PanelTab>("point");
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [shape, setShape] = useStoredSimulationState("transformation.shape", 3);
  const [vertices, setVertices] = useStoredSimulationState<Vec[]>(
    "transformation.vertices",
    defaultVertices[3].map((v) => [...v] as Vec),
  );
  const [steps, setSteps] = useStoredSimulationState<Step[]>(
    "transformation.steps",
    initialSteps,
  );
  const [speed, setSpeed] = useStoredSimulationState("transformation.speed", 1);
  const [snap, setSnap] = useStoredSimulationState("transformation.snap", true);
  const [draftType, setDraftType] = useStoredSimulationState<StepType>(
    "transformation.draft-type",
    "rotation",
  );
  const [draft, setDraft] = useStoredSimulationState<Draft>(
    "transformation.draft.v2",
    initialDraft,
  );
  const [sampleIndex, setSampleIndex] = useStoredSimulationState(
    "transformation.sample-index",
    0,
  );
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  /** Titik yang sedang diatur lewat penggeser (indeks 0..shape-1). */
  const [selected, setSelected] = useState(0);

  const verticesRef = useRef<Vec[]>(vertices);
  const stepsRef = useRef<Step[]>(steps);
  const progressRef = useRef(0);
  const speedRef = useRef(speed);
  const snapRef = useRef(snap);
  const nextId = useRef(
    steps.reduce((next, step) => Math.max(next, step.id + 1), 3),
  );

  /* ───────── Langkah dan progres ───────── */

  const setProgressValue = (value: number) => {
    const safe = Number.isFinite(value)
      ? Math.min(Math.max(0, value), stepsRef.current.length)
      : 0;
    progressRef.current = safe;
    setProgress(safe);
    boardRef.current?.update();
  };

  const updateSteps = (next: Step[]) => {
    stepsRef.current = next;
    setSteps(next);
    if (next.length === 0) setPlaying(false);
    setProgressValue(Math.min(progressRef.current, next.length));
  };

  const setDraftNum = (key: DraftNumKey, value: number) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const nudgeDraft = (
    key: DraftNumKey,
    step: number,
    min: number,
    max: number,
    direction: 1 | -1,
  ) =>
    setDraft((current) => ({
      ...current,
      [key]: clampTo(
        Math.round((current[key] + direction * step) * 100) / 100,
        min,
        max,
      ),
    }));

  const addStep = () => {
    if (stepsRef.current.length >= MAX_STEPS) return;
    const id = nextId.current++;
    let step: Step;
    switch (draftType) {
      case "translation":
        step = { id, type: "translation", tx: draft.tx, ty: draft.ty };
        break;
      case "reflection":
        step = { id, type: "reflection", axis: draft.axis };
        break;
      case "rotation":
        step = {
          id,
          type: "rotation",
          angle: draft.angle,
          cx: draft.rcx,
          cy: draft.rcy,
        };
        break;
      default:
        step = {
          id,
          type: "dilation",
          k: draft.k,
          cx: draft.dcx,
          cy: draft.dcy,
        };
    }
    updateSteps([...stepsRef.current, step]);
  };

  const removeStep = (id: number) =>
    updateSteps(stepsRef.current.filter((step) => step.id !== id));

  /* ───────── Titik awal ───────── */

  const applyVertices = (next: Vec[]) => {
    verticesRef.current = next;
    setVertices(next);
    pointsRef.current.forEach((point, i) => {
      if (next[i]) point.setPosition(JXG.COORDS_BY_USER, next[i]);
    });
    boardRef.current?.update();
  };

  const setVertexCoord = (index: number, axis: 0 | 1, value: number) => {
    const next = verticesRef.current.map((v) => [...v] as Vec);
    if (!next[index]) return;
    next[index][axis] = clampLimit(value);
    applyVertices(next);
  };

  const nudgeVertex = (index: number, axis: 0 | 1, direction: 1 | -1) => {
    const current = verticesRef.current[index]?.[axis] ?? 0;
    const delta = snapRef.current ? 1 : 0.1;
    setVertexCoord(index, axis, cleanNumber(current + direction * delta));
  };

  const changeShape = (count: number) => {
    if (count === shape) return;
    const next = defaultVertices[count].map((v) => [...v] as Vec);
    verticesRef.current = next;
    setVertices(next);
    setSelected(0);
    setShape(count);
  };

  const resetPoints = () =>
    applyVertices(defaultVertices[shape].map((v) => [...v] as Vec));

  const resetAll = () => {
    setPlaying(false);
    resetPoints();
    stepsRef.current = initialSteps;
    setSteps(initialSteps);
    setDraft(initialDraft);
    setProgressValue(0);
  };

  /* ───────── Pemutar ───────── */

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    const total = stepsRef.current.length;
    if (total === 0) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setProgressValue(total);
      return;
    }
    if (progressRef.current >= total) setProgressValue(0);
    setPlaying(true);
  };

  const cycleSpeed = () => {
    const next = speedOptions[(speedOptions.indexOf(speed) + 1) % speedOptions.length];
    speedRef.current = next;
    setSpeed(next);
  };

  /* ───────── Tampilan ───────── */

  const zoomIn = () => boardRef.current?.zoomIn();
  const zoomOut = () => boardRef.current?.zoomOut();
  const center = () => boardRef.current?.setBoundingBox(INITIAL_BOX, true);

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

  // Sinkron saat keluar lewat Esc / gestur sistem.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && nativeFsRef.current) {
        nativeFsRef.current = false;
        setIsFs(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
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

  // Layar sentuh: kunci ke lanskap saat layar penuh (bila diizinkan browser).
  useEffect(() => {
    if (!isFs || !window.matchMedia("(pointer: coarse)").matches) return;
    const o = (
      screen as unknown as {
        orientation?: {
          lock?: (mode: "landscape") => Promise<void>;
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

  /* ───────── Papan JSXGraph ───────── */

  useEffect(() => {
    const count = shape;
    const names = vertexNames(count);
    const start = verticesRef.current;

    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: INITIAL_BOX,
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepAspectRatio: true,
      // Geser dengan tahan klik kiri (atau satu jari) pada area kosong;
      // zoom dengan roda mouse atau pinch.
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: {
        wheel: true,
        needShift: false,
        factorX: 1.15,
        factorY: 1.15,
        min: 0.25,
        max: 8,
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
    const axis = { strokeColor: "#94a3b8", strokeWidth: 1.25, highlight: false, ticks };
    board.create("axis", [[0, 0], [1, 0]], axis);
    board.create("axis", [[0, 0], [0, 1]], axis);

    /* Titik asal (bisa digeser) */
    const originals = names.map(
      (name, i) =>
        board.create("point", [start[i][0], start[i][1]], {
          name,
          withLabel: true,
          size: 5,
          fillColor: colors.original,
          strokeColor: "#ffffff",
          strokeWidth: 2,
          snapToGrid: snapRef.current,
          snapSizeX: 1,
          snapSizeY: 1,
          highlight: false,
          label: { offset: [8, 8], fontSize: 12, strokeColor: colors.original },
        }) as JXG.Point,
    );
    pointsRef.current = originals;

    const originalPolygon =
      count >= 3
        ? board.create("polygon", originals, {
            hasInnerPoints: true,
            fillColor: colors.original,
            fillOpacity: 0.12,
            highlight: false,
            borders: {
              strokeColor: colors.original,
              strokeWidth: 2.5,
              highlight: false,
            },
          })
        : null;

    /* Posisi bayangan pada progres saat ini */
    const originOf = (i: number): Vec => [originals[i].X(), originals[i].Y()];
    const imagePos = (i: number): Vec =>
      applyMat(compositeAt(stepsRef.current, progressRef.current), originOf(i));

    /* Posisi hasil antara (setelah langkah ke-k selesai) */
    const ghostPos = (k: number, i: number): Vec => {
      const list = stepsRef.current;
      if (k >= list.length || progressRef.current < k) return [NaN, NaN];
      return applyMat(compositeAt(list, k), originOf(i));
    };

    /* Jejak hasil antara */
    for (let k = 1; k < MAX_STEPS; k += 1) {
      for (let i = 0; i < count; i += 1) {
        board.create(
          "point",
          [() => ghostPos(k, i)[0], () => ghostPos(k, i)[1]],
          {
            name: "",
            withLabel: false,
            size: 3,
            fillColor: colors.ghost,
            strokeColor: "#ffffff",
            strokeWidth: 1,
            fixed: true,
            highlight: false,
          },
        );
      }
      if (count >= 3) {
        const outline = board.create("curve", [[0], [0]], {
          strokeColor: colors.ghost,
          strokeWidth: 1.5,
          dash: 2,
          highlight: false,
          fixed: true,
        }) as unknown as DataCurve;
        outline.updateDataArray = () => {
          const points = originals.map((_, i) => ghostPos(k, i));
          if (Number.isNaN(points[0][0])) {
            outline.dataX = [NaN];
            outline.dataY = [NaN];
            return;
          }
          outline.dataX = [...points.map((p) => p[0]), points[0][0]];
          outline.dataY = [...points.map((p) => p[1]), points[0][1]];
        };
      }
    }

    if (count === 1) {
      const trail = board.create("curve", [[0], [0]], {
        strokeColor: colors.ghost,
        strokeWidth: 1.5,
        dash: 2,
        highlight: false,
        fixed: true,
      }) as unknown as DataCurve;
      trail.updateDataArray = () => {
        const path: Vec[] = [originOf(0)];
        for (let k = 1; k < MAX_STEPS; k += 1) {
          const g = ghostPos(k, 0);
          if (!Number.isNaN(g[0])) path.push(g);
        }
        path.push(imagePos(0));
        trail.dataX = path.map((p) => p[0]);
        trail.dataY = path.map((p) => p[1]);
      };
    }

    /* Bayangan */
    const images = names.map(
      (name, i) =>
        board.create("point", [() => imagePos(i)[0], () => imagePos(i)[1]], {
          name: `${name}′`,
          withLabel: true,
          size: 4,
          fillColor: colors.image,
          strokeColor: "#ffffff",
          strokeWidth: 1.5,
          fixed: true,
          highlight: false,
          label: { offset: [8, -14], fontSize: 12, strokeColor: colors.image },
        }) as JXG.Point,
    );
    if (count >= 3) {
      board.create("polygon", images, {
        hasInnerPoints: false,
        fixed: true,
        fillColor: colors.image,
        fillOpacity: 0.16,
        highlight: false,
        borders: {
          strokeColor: colors.image,
          strokeWidth: 2.5,
          highlight: false,
          fixed: true,
        },
      });
    }

    /* Penunjuk langkah aktif: cermin, pusat, dan vektor translasi */
    const guideIndex = () =>
      Math.max(
        0,
        Math.min(Math.floor(progressRef.current), stepsRef.current.length - 1),
      );
    const guideStep = (): Step | null => {
      const list = stepsRef.current;
      if (list.length === 0) return null;
      return list[guideIndex()] ?? null;
    };

    const mirrorCoord = (end: 0 | 1, coord: 0 | 1) => () => {
      const step = guideStep();
      return step && step.type === "reflection"
        ? mirrorEnds[step.axis][end][coord]
        : 1000 + end;
    };
    board.create(
      "segment",
      [
        [mirrorCoord(0, 0), mirrorCoord(0, 1)],
        [mirrorCoord(1, 0), mirrorCoord(1, 1)],
      ],
      {
        strokeColor: colors.guide,
        strokeWidth: 2,
        dash: 3,
        highlight: false,
        fixed: true,
      },
    );

    const centerCoord = (coord: "cx" | "cy") => () => {
      const step = guideStep();
      return step && (step.type === "rotation" || step.type === "dilation")
        ? step[coord]
        : Number.NaN;
    };
    board.create("point", [centerCoord("cx"), centerCoord("cy")], {
      name: "pusat",
      withLabel: true,
      size: 5,
      face: "cross",
      fillColor: colors.guide,
      strokeColor: colors.guide,
      strokeWidth: 2,
      fixed: true,
      highlight: false,
      label: { offset: [8, -14], fontSize: 11, strokeColor: colors.guide },
    });

    const vectorEnd = (which: "from" | "to", coord: 0 | 1) => () => {
      const step = guideStep();
      if (!step || step.type !== "translation")
        return 1000 + (which === "to" ? 1 : 0);
      const from = applyMat(
        compositeAt(stepsRef.current, guideIndex()),
        originOf(0),
      );
      const to = imagePos(0);
      if (Math.hypot(to[0] - from[0], to[1] - from[1]) < 1e-6) {
        return 1000 + (which === "to" ? 1 : 0);
      }
      return (which === "from" ? from : to)[coord];
    };
    board.create(
      "segment",
      [
        [vectorEnd("from", 0), vectorEnd("from", 1)],
        [vectorEnd("to", 0), vectorEnd("to", 1)],
      ],
      {
        strokeColor: colors.guide,
        strokeWidth: 2,
        lastArrow: { type: 2, size: 6 },
        highlight: false,
        fixed: true,
      },
    );

    /* Sinkronisasi koordinat saat titik/poligon digeser */
    const syncVertices = () => {
      const next = originals.map(
        (p) => [cleanNumber(p.X()), cleanNumber(p.Y())] as Vec,
      );
      verticesRef.current = next;
      setVertices(next);
    };
    originals.forEach((point, i) => {
      point.on("down", () => setSelected(i));
      point.on("drag", syncVertices);
    });
    if (originalPolygon) {
      originalPolygon.on("drag", syncVertices);
      originalPolygon.on("up", () => {
        if (snapRef.current) {
          originals.forEach((p) =>
            p.setPosition(JXG.COORDS_BY_USER, [
              Math.round(p.X()),
              Math.round(p.Y()),
            ]),
          );
          board.update();
        }
        syncVertices();
      });
    }

    board.update();

    // Saat ukuran kontainer berubah (putar layar, layar penuh), pertahankan
    // skala dan titik tengah tampilan agar grafik tidak melompat.
    let last = {
      w: hostRef.current?.clientWidth ?? 0,
      h: hostRef.current?.clientHeight ?? 0,
    };
    const sync = (force = false) => {
      const el = hostRef.current;
      if (!el) return;
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
    if (hostRef.current) observer.observe(hostRef.current);

    return () => {
      syncRef.current = null;
      observer.disconnect();
      JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
      pointsRef.current = [];
    };
  }, [boardId, shape]);

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

  /* Tempel ke grid */
  useEffect(() => {
    snapRef.current = snap;
    pointsRef.current.forEach((point) =>
      point.setAttribute({ snapToGrid: snap }),
    );
  }, [snap, shape]);

  /* Animasi */
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Jepit delta agar progres tidak mundur / melompat saat tab tertidur.
      const delta = Math.max(0, Math.min(now - last, 64));
      last = now;
      const total = stepsRef.current.length;
      const next = Math.max(
        0,
        Math.min(
          total,
          progressRef.current + (delta / STEP_MS) * speedRef.current,
        ),
      );
      progressRef.current = next;
      setProgress(next);
      boardRef.current?.update();
      if (next >= total) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  /* ───────── Turunan untuk tampilan ───────── */

  const total = steps.length;
  const names = vertexNames(shape);
  const currentMatrix = compositeAt(steps, progress);
  const finalMatrix = compositeAt(steps, total);
  const activeIndex =
    total === 0
      ? -1
      : Math.max(0, Math.min(Math.floor(progress) || 0, total - 1));
  const isDone = total > 0 && progress >= total;
  const sel = Math.min(selected, shape - 1);
  const sample = Math.min(sampleIndex, shape - 1);
  const sampleStart: Vec = vertices[sample] ?? [0, 0];
  const sampleEnd = applyMat(finalMatrix, sampleStart);
  const selVertex: Vec = vertices[sel] ?? [0, 0];
  const compositeFormula =
    total === 0
      ? "M = I"
      : `M = ${steps
          .map((_, i) => `M${subscript(i + 1)}`)
          .reverse()
          .join(" · ")}`;

  let caption = "Belum ada transformasi. Tambahkan langkah di tab Langkah.";
  if (total > 0 && steps[activeIndex]) {
    const info = describeStep(steps[activeIndex]);
    caption = isDone
      ? `Selesai: ${total} langkah diterapkan.`
      : `Langkah ${activeIndex + 1}/${total}: ${info.name} ${info.detail}`;
  }

  const progressPct = total === 0 ? 0 : (progress / total) * 100;
  const progressStyle = {
    "--lo": "0%",
    "--hi": `${progressPct}%`,
  } as CSSProperties;

  const vertexStep = snap ? 1 : 0.1;

  return (
    <div ref={rootRef} className={`tfs${isFs ? " is-fs" : ""}`}>
      <p className="tfs-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>
          Miringkan ponsel ke mode lanskap agar grafik dan panel tampil
          berdampingan.
        </span>
      </p>

      <div className="tfs-layout">
        {/* ───── Grafik ───── */}
        <section className="tfs-graph" aria-label="Bidang koordinat">
          <div className="tfs-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="tfs-board"
              aria-label="Bidang koordinat interaktif. Seret titik atau bangun asal berwarna biru untuk mengubah posisinya; bayangan berwarna oranye. Seret area kosong untuk menggeser bidang, gulir atau cubit untuk memperbesar."
            />

            <p className="tfs-caption" aria-live="polite">
              {caption}
            </p>

            <div className="tfs-tools" role="group" aria-label="Alat tampilan">
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
                  className="tfs-toggle"
                  onClick={() => setPanelOpen((open) => !open)}
                  aria-pressed={panelOpen}
                  aria-controls={`tfs-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="tfs-play">
            <button
              type="button"
              className="tfs-play-btn"
              onClick={togglePlay}
              disabled={total === 0}
              aria-label={playing ? "Jeda" : isDone ? "Putar ulang" : "Mainkan"}
              title={playing ? "Jeda" : isDone ? "Putar ulang" : "Mainkan"}
            >
              {playing ? (
                <Pause size={15} aria-hidden="true" />
              ) : isDone ? (
                <RotateCcw size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
            </button>
            <input
              className="tfs-range tfs-progress"
              type="range"
              min="0"
              max={total}
              step="0.01"
              value={progress}
              disabled={total === 0}
              style={progressStyle}
              aria-label="Progres animasi"
              aria-valuetext={caption}
              onChange={(event) => {
                setPlaying(false);
                setProgressValue(Number(event.currentTarget.value));
              }}
            />
            <span className="tfs-pct" aria-hidden="true">
              {Math.round(progressPct)}%
            </span>
            <button
              type="button"
              className="tfs-speed"
              onClick={cycleSpeed}
              aria-label={`Kecepatan ${String(speed).replace(".", ",")} kali, ketuk untuk mengganti`}
              title="Kecepatan animasi"
            >
              {String(speed).replace(".", ",")}×
            </button>
          </div>

          <ul className="tfs-legend" aria-label="Legenda grafik">
            <li>
              <i style={{ borderColor: colors.original, background: "rgba(37,99,235,0.15)" }} />{" "}
              bangun asal
            </li>
            <li>
              <i style={{ borderColor: colors.image, background: "rgba(234,88,12,0.18)" }} /> bayangan
            </li>
            <li>
              <i className="dash" style={{ borderColor: colors.ghost }} /> hasil antara
            </li>
            <li>
              <i className="dash" style={{ borderColor: colors.guide }} /> cermin / pusat / vektor
            </li>
          </ul>
        </section>

        {/* ───── Panel ───── */}
        <section
          id={`tfs-panel-${baseId}`}
          className={`tfs-panel${isFs ? " is-floating" : ""}${
            isFs && panelOpen ? " is-open" : ""
          }`}
          aria-label="Pengaturan transformasi"
        >
          <div className="tfs-tabs" role="group" aria-label="Bagian panel">
            {panelTabs.map((item) => (
              <button
                key={item.tab}
                type="button"
                aria-pressed={tab === item.tab}
                onClick={() => setTab(item.tab)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="tfs-pane">
            {/* ── Titik ── */}
            {tab === "point" && (
              <>
                <div className="tfs-seg" role="group" aria-label="Bentuk bangun">
                  {shapeOptions.map((option) => (
                    <button
                      key={option.count}
                      type="button"
                      aria-pressed={shape === option.count}
                      onClick={() => changeShape(option.count)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {shape > 1 && (
                  <div className="tfs-seg" role="group" aria-label="Pilih titik">
                    {names.map((name, i) => (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={sel === i}
                        onClick={() => setSelected(i)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}

                <p className="tfs-label">Koordinat awal {names[sel]}</p>
                <div className="tfs-rows">
                  <SliderField
                    label="x"
                    hint={`Absis titik ${names[sel]}`}
                    tone="original"
                    min={-LIMIT}
                    max={LIMIT}
                    step={vertexStep}
                    value={selVertex[0]}
                    onSlide={(v) => setVertexCoord(sel, 0, v)}
                    onNudge={(d) => nudgeVertex(sel, 0, d)}
                  />
                  <SliderField
                    label="y"
                    hint={`Ordinat titik ${names[sel]}`}
                    tone="original"
                    min={-LIMIT}
                    max={LIMIT}
                    step={vertexStep}
                    value={selVertex[1]}
                    onSlide={(v) => setVertexCoord(sel, 1, v)}
                    onNudge={(d) => nudgeVertex(sel, 1, d)}
                  />
                </div>

                <label className="tfs-check">
                  <input
                    type="checkbox"
                    checked={snap}
                    onChange={(event) => setSnap(event.currentTarget.checked)}
                  />
                  Tempel ke bilangan bulat
                </label>

                <button type="button" className="tfs-btn" onClick={resetPoints}>
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>Posisi awal bangun</span>
                </button>
              </>
            )}

            {/* ── Langkah ── */}
            {tab === "steps" && (
              <>
                <p className="tfs-label">
                  Urutan transformasi ({total}/{MAX_STEPS})
                </p>
                {total === 0 ? (
                  <p className="tfs-empty">Belum ada langkah.</p>
                ) : (
                  <ol className="tfs-steps">
                    {steps.map((step, i) => {
                      const info = describeStep(step);
                      return (
                        <li
                          key={step.id}
                          className={i === activeIndex ? "is-active" : undefined}
                        >
                          <span className="tfs-index">{i + 1}</span>
                          <button
                            type="button"
                            className="tfs-step-label"
                            title="Tampilkan hasil sampai langkah ini"
                            onClick={() => {
                              setPlaying(false);
                              setProgressValue(i + 1);
                            }}
                          >
                            <b>{info.name}</b> {info.detail}
                          </button>
                          <button
                            type="button"
                            className="tfs-remove"
                            aria-label={`Hapus langkah ${i + 1}: ${info.name}`}
                            onClick={() => removeStep(step.id)}
                          >
                            ×
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                )}

                <p className="tfs-label">Tambah langkah</p>
                <div className="tfs-seg" role="group" aria-label="Jenis transformasi">
                  {typeOptions.map((option) => (
                    <button
                      key={option.type}
                      type="button"
                      aria-pressed={draftType === option.type}
                      onClick={() => setDraftType(option.type)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {draftType === "reflection" ? (
                  <div className="tfs-seg" role="group" aria-label="Garis cermin">
                    {(Object.keys(axisShort) as ReflectionAxis[]).map((axis) => (
                      <button
                        key={axis}
                        type="button"
                        aria-pressed={draft.axis === axis}
                        onClick={() => setDraft((current) => ({ ...current, axis }))}
                      >
                        {axisShort[axis]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="tfs-rows">
                    {draftRows[draftType].map((row) => (
                      <SliderField
                        key={`${draftType}-${row.key}`}
                        label={row.label}
                        hint={row.hint}
                        tone="image"
                        min={row.min}
                        max={row.max}
                        step={row.step}
                        value={draft[row.key]}
                        onSlide={(v) => setDraftNum(row.key, v)}
                        onNudge={(d) =>
                          nudgeDraft(row.key, row.step, row.min, row.max, d)
                        }
                      />
                    ))}
                  </div>
                )}

                <div className="tfs-actions">
                  <button
                    type="button"
                    className="tfs-btn tfs-btn-solid"
                    onClick={addStep}
                    disabled={total >= MAX_STEPS}
                  >
                    <Plus size={14} aria-hidden="true" />
                    <span>Tambah</span>
                  </button>
                  <button
                    type="button"
                    className="tfs-btn"
                    onClick={() => updateSteps([])}
                    disabled={total === 0}
                  >
                    Kosongkan
                  </button>
                  <button type="button" className="tfs-btn" onClick={resetAll}>
                    <RotateCcw size={13} aria-hidden="true" />
                    <span>Atur ulang</span>
                  </button>
                </div>
                {total >= MAX_STEPS && (
                  <p className="tfs-note">Maksimal {MAX_STEPS} langkah.</p>
                )}
              </>
            )}

            {/* ── Hasil ── */}
            {tab === "result" && (
              <>
                <p className="tfs-label">Koordinat titik</p>
                <div className="tfs-table-wrap">
                  <table className="tfs-table">
                    <thead>
                      <tr>
                        <th scope="col">Titik</th>
                        <th scope="col">Awal</th>
                        <th scope="col">Saat ini</th>
                        <th scope="col">Akhir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {names.map((name, i) => {
                        const origin: Vec = vertices[i] ?? [0, 0];
                        return (
                          <tr key={name}>
                            <th scope="row">
                              {name} → {name}′
                            </th>
                            <td className="c-original">{formatCoord(origin)}</td>
                            <td className="c-current">
                              {formatCoord(applyMat(currentMatrix, origin))}
                            </td>
                            <td className="c-image">
                              {formatCoord(applyMat(finalMatrix, origin))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="tfs-label">Matriks transformasi</p>
                <p className="tfs-note">
                  Matriks homogen 3 × 3; kolom ketiga menyimpan pergeseran.
                </p>
                <div className="tfs-cards">
                  {steps.map((step, i) => {
                    const info = describeStep(step);
                    return (
                      <article
                        key={step.id}
                        className={`tfs-card${i === activeIndex ? " is-active" : ""}`}
                      >
                        <h4>
                          M{subscript(i + 1)} · {info.name}
                        </h4>
                        <p>{info.detail}</p>
                        <MatrixView
                          rows={stepMatrix(step, 1)}
                          label={`Matriks M${i + 1}`}
                        />
                      </article>
                    );
                  })}
                  <article className="tfs-card tfs-card-total">
                    <h4>Matriks komposisi</h4>
                    <p>
                      {compositeFormula}
                      {total > 1 && " (dibaca dari kanan ke kiri)"}
                    </p>
                    <MatrixView rows={finalMatrix} label="Matriks komposisi" />
                  </article>
                </div>

                <div className="tfs-sample-head">
                  <p className="tfs-label">Contoh perhitungan</p>
                  {shape > 1 && (
                    <div className="tfs-seg tfs-seg-small" role="group" aria-label="Titik contoh">
                      {names.map((name, i) => (
                        <button
                          key={name}
                          type="button"
                          aria-pressed={sample === i}
                          onClick={() => setSampleIndex(i)}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="tfs-equation">
                  <MatrixView
                    rows={[[sampleEnd[0]], [sampleEnd[1]], [1]]}
                    label={`Koordinat ${names[sample]}′`}
                  />
                  <span className="tfs-op">=</span>
                  <MatrixView rows={finalMatrix} label="Matriks komposisi" />
                  <span className="tfs-op">×</span>
                  <MatrixView
                    rows={[[sampleStart[0]], [sampleStart[1]], [1]]}
                    label={`Koordinat ${names[sample]}`}
                  />
                </div>
                <p className="tfs-note">
                  {names[sample]}
                  {formatCoord(sampleStart)} → {names[sample]}′
                  {formatCoord(sampleEnd)}
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TransformationSimulation;
