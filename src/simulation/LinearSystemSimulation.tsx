import JXG from "jsxgraph";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  AxisNumbersIcon,
  GridIcon,
  PointLabelIcon,
  SimRow,
  SimSection,
  SimSlider,
  SimToggle,
} from "./SimControls";
import { SimMath } from "./SimMath";
import { SimulationShell } from "./SimulationShell";
import { clamp } from "./simUtils";
import { useJsxBoard, type BoundingBox, type SimBoard } from "./useJsxBoard";
import { useStoredSimulationState } from "./useStoredSimulationState";
import {
  OP_SYMBOL,
  boxPoly,
  clipByCons,
  clipToBox,
  feasibleRegion,
  fmtN,
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

/* Simulasi sistem linear: SPLDV, pertidaksamaan linear, dan program linear.
   Kerangka, slider, dan CSS memakai kit umum (prefix sim-), sama seperti
   simulasi fungsi kuadrat, turunan, integral, irisan kerucut, dan sektor
   lingkaran. Perhitungan geometri tetap memakai ./linearMath. */

/* ───────── Tipe ───────── */

type Mode = "spldv" | "ptlsv" | "lp";
type LineKey = "line0" | "line1" | "line2" | "line3";
type ObjectKey = LineKey | "region" | "points" | "level";
type ViewState = {
  grid: boolean;
  axisNumbers: boolean;
  pointLabels: boolean;
  curveWidth: number;
  pointSize: number;
  show: Record<ObjectKey, boolean>;
};
type JEl = {
  X(): number;
  Y(): number;
  setPosition(method: number, coords: number[]): unknown;
  setAttribute(attrs: Record<string, unknown>): unknown;
  hide(): void;
  show(): void;
  on(event: string, handler: () => void): unknown;
};
type AxisEl = JEl & { defaultTicks: { setAttribute: (a: Record<string, unknown>) => unknown } };
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
type Scene = {
  grid: JEl;
  axes: AxisEl[];
  rings: JEl[];
  objs: { line: JEl; p1: JEl; p2: JEl }[];
  level: JEl;
  levelLine: JEl;
  levelText: JEl;
  vertMarkers: JEl[];
  interMarker: JEl;
  vertTexts: JEl[];
  interText: JEl;
  test: JEl;
};

/* ───────── Konstanta ───────── */

const MAX_LINES = 4;
const VERT_POOL = 8;
const OPT_POOL = 4;
const LINE_KEYS: LineKey[] = ["line0", "line1", "line2", "line3"];

const colors = {
  lines: ["#1565c0", "#e65100", "#6557d2", "#2e7d32"],
  region: "#0b84c6",
  inter: "#c62828",
  opt: "#c28a00",
  optDark: "#7a5a00",
  vertex: "#232329",
  grid: "#dcdce2",
  axis: "#4a4a55",
  ok: "#2e7d32",
  bad: "#c62828",
};

const HOME: Record<Mode, Box> = {
  spldv: [-8, 8, 8, -8],
  ptlsv: [-2, 12, 12, -2],
  lp: [-2, 12, 12, -2],
};
const initialBox: BoundingBox = HOME.lp;
const COORDS_BY_USER: number =
  (JXG as unknown as { COORDS_BY_USER?: number }).COORDS_BY_USER ?? 1;

const initialView: ViewState = {
  grid: true,
  axisNumbers: true,
  pointLabels: true,
  curveWidth: 3,
  pointSize: 4,
  show: {
    line0: true,
    line1: true,
    line2: true,
    line3: true,
    region: true,
    points: true,
    level: true,
  },
};

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
const OP_TEX: Record<string, string> = {
  "<=": String.raw`\le`,
  ">=": String.raw`\ge`,
  "<": "<",
  ">": ">",
  "=": "=",
};

const fmtInput = (v: number) => String(Math.round(v * 1000) / 1000);

/* ───────── Format untuk KaTeX ───────── */

const tx = (v: number) => fmtN(v).replace("−", "-").replace(",", "{,}");
const ptTex = (pt: Pt) => String.raw`(${tx(pt.x)};\,${tx(pt.y)})`;

function polyTex(terms: [number, string][]) {
  const parts: string[] = [];
  terms.forEach(([coef, symbol]) => {
    if (Math.abs(coef) < 5e-4) return;
    const abs = Math.abs(coef);
    const body = Math.abs(abs - 1) < 5e-4 ? symbol : `${tx(abs)}${symbol}`;
    if (parts.length === 0) parts.push(coef < 0 ? `-${body}` : body);
    else parts.push(`${coef < 0 ? "-" : "+"} ${body}`);
  });
  return parts.length ? parts.join(" ") : "0";
}

const lineTex = (c: Cons) =>
  `${polyTex([
    [c.a, "x"],
    [c.b, "y"],
  ])}\\ ${OP_TEX[c.op] ?? c.op}\\ ${tx(c.c)}`;

/* ───────── Kolom angka ───────── */

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
      className="sim-num"
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

/* ───────── Komponen utama ───────── */

export function LinearSystemSimulation() {
  const [storedMode, setMode] = useStoredSimulationState<Mode>("linear-system.mode", "lp");
  const mode: Mode = MODES.some((m) => m.id === storedMode) ? storedMode : "lp";
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
  const [testPt, setTestPt] = useStoredSimulationState<Pt>("linear-system.test-point", {
    x: 1,
    y: 1,
  });
  const [storedView, setStoredView] = useStoredSimulationState(
    "linear-system.view",
    initialView,
  );
  const view = useMemo<ViewState>(
    () => ({
      ...initialView,
      ...storedView,
      show: { ...initialView.show, ...storedView.show },
    }),
    [storedView],
  );

  const [anim, setAnim] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const lines = mode === "spldv" ? eq : ineq;

  // data yang dibaca papan (selalu lewat ref)
  const scene = useRef<Scene | null>(null);
  const modeRef = useRef<Mode>(mode);
  const linesRef = useRef<Cons[]>(lines);
  const nonnegRef = useRef(nonneg);
  const showHalfRef = useRef(showHalf);
  const snapRef = useRef(snap);
  const pqRef = useRef({ p, q, goal });
  const kRef = useRef(k);
  const viewRef = useRef(view);
  viewRef.current = view;
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
    const vw = viewRef.current;
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
      if (!region.empty && vw.show.region) regionDataRef.current = clipToBox(region.poly, vbox);
      if (showHalfRef.current) {
        list.forEach((c, i) => {
          if (validLine(c) && vw.show[LINE_KEYS[i]]) {
            halfDataRef.current[i] = clipByCons(vpoly, c);
          }
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
    const s = scene.current;
    if (s) {
      const labelsOn = vw.show.points && vw.pointLabels;
      const want: boolean[] = [];
      for (let i = 0; i < VERT_POOL; i += 1) {
        want[i] = labelsOn && i < vertsRef.current.length && curMode !== "spldv";
      }
      want[VERT_POOL] = labelsOn && curMode === "spldv" && next.sol?.kind === "unique";
      want.forEach((on, i) => {
        if (visTextRef.current[i] === on) return;
        visTextRef.current[i] = on;
        const el = i < VERT_POOL ? s.vertTexts[i] : s.interText;
        if (!el) return;
        if (on) el.show();
        else el.hide();
      });
    }

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
    const sq = pp * pp + qq * qq;
    kRef.current = value;
    setK(value);
    const h = scene.current?.level;
    if (h && sq > 1e-12) {
      h.setPosition(COORDS_BY_USER, [(value * pp) / sq, (value * qq) / sq]);
      boardRef.current?.update();
    }
  };

  /* ───────── Papan JSXGraph ───────── */

  const setup = (board: SimBoard) => {
    const rawCreate = board as unknown as {
      create: (type: string, parents: unknown[], attrs: Record<string, unknown>) => unknown;
    };
    const create = (type: string, parents: unknown[], attrs: Record<string, unknown>) =>
      rawCreate.create(type, parents, attrs) as JEl;
    const v = viewRef.current;

    const grid = create("grid", [], {
      strokeColor: colors.grid,
      strokeOpacity: 1,
      strokeWidth: 1,
      highlight: false,
    });

    const axisStyle = {
      strokeColor: colors.axis,
      strokeWidth: 1.2,
      highlight: false,
      withLabel: true,
    };
    const ticks = {
      insertTicks: true,
      minTicksDistance: 32,
      minorTicks: 1,
      majorHeight: 6,
      drawLabels: v.axisNumbers,
      label: { fontSize: 10, strokeColor: "#5c5c68" },
    };
    const xAxis = create(
      "axis",
      [
        [0, 0],
        [1, 0],
      ],
      {
        ...axisStyle,
        name: "x",
        label: { position: "rt", offset: [-14, 14], fontSize: 13 },
        ticks,
      },
    ) as AxisEl;
    const yAxis = create(
      "axis",
      [
        [0, 0],
        [0, 1],
      ],
      {
        ...axisStyle,
        name: "y",
        label: { position: "rt", offset: [12, -14], fontSize: 13 },
        ticks,
      },
    ) as AxisEl;

    // Isian poligon (kurva tertutup) yang datanya dibaca dari ref
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
    colors.lines.forEach((colorHex, i) =>
      fill(colorHex, 0.07, () => halfDataRef.current[i] ?? []),
    );
    fill(colors.region, 0.34, () => regionDataRef.current);

    const marker = (
      x: () => number,
      y: () => number,
      colorHex: string,
      size: number,
      extra: Record<string, unknown> = {},
    ) =>
      create("point", [x, y], {
        name: "",
        withLabel: false,
        size,
        fillColor: colorHex,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        highlightFillColor: colorHex,
        highlightStrokeColor: "#ffffff",
        fixed: true,
        highlight: false,
        showInfobox: false,
        ...extra,
      });

    const pointsOn = () => viewRef.current.show.points;

    // Cincin titik optimum (di bawah titik sudut)
    const rings: JEl[] = [];
    for (let i = 0; i < OPT_POOL; i += 1) {
      rings.push(
        marker(
          () => (pointsOn() ? (optPtsRef.current[i]?.x ?? Number.NaN) : Number.NaN),
          () => (pointsOn() ? (optPtsRef.current[i]?.y ?? Number.NaN) : Number.NaN),
          colors.opt,
          v.pointSize + 4,
          { strokeColor: colors.optDark, strokeWidth: 2, fillOpacity: 0.9 },
        ),
      );
    }

    // Garis kendala: melalui dua titik pegangan
    const objs: { line: JEl; p1: JEl; p2: JEl }[] = [];
    colors.lines.forEach((colorHex) => {
      const handle = () =>
        create("point", [0, 0], {
          name: "",
          withLabel: false,
          size: v.pointSize,
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
        strokeWidth: v.curveWidth,
        highlightStrokeColor: colorHex,
        highlightStrokeWidth: v.curveWidth + 1,
        highlightStrokeOpacity: 1,
      });
      objs.push({ line, p1, p2 });
    });

    // Garis selidik z = k dengan pegangan H
    const level = create("point", [0, 0], {
      name: "",
      withLabel: false,
      size: v.pointSize + 1,
      fillColor: colors.opt,
      strokeColor: "#ffffff",
      strokeWidth: 2,
      highlightFillColor: colors.opt,
      highlightStrokeColor: "#ffffff",
      showInfobox: false,
    });
    const levelLine = create(
      "line",
      [
        () => -(pqRef.current.p * level.X() + pqRef.current.q * level.Y()),
        () => pqRef.current.p,
        () => pqRef.current.q,
      ],
      {
        strokeColor: colors.opt,
        strokeWidth: v.curveWidth,
        dash: 2,
        highlight: false,
        fixed: true,
      },
    );
    const levelText = create(
      "text",
      [
        () => level.X(),
        () => level.Y(),
        () => `z = ${fmtN(pqRef.current.p * level.X() + pqRef.current.q * level.Y())}`,
      ],
      {
        fontSize: 13,
        strokeColor: colors.optDark,
        anchorX: "left",
        anchorY: "bottom",
        offset: [10, 8],
        highlight: false,
        fixed: true,
        cssStyle:
          "font-weight:600;white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;",
      },
    );

    // Titik sudut dan titik potong
    const vertMarkers: JEl[] = [];
    for (let i = 0; i < VERT_POOL; i += 1) {
      vertMarkers.push(
        marker(
          () => (pointsOn() ? (vertsRef.current[i]?.x ?? Number.NaN) : Number.NaN),
          () => (pointsOn() ? (vertsRef.current[i]?.y ?? Number.NaN) : Number.NaN),
          colors.vertex,
          v.pointSize,
        ),
      );
    }
    const interMarker = marker(
      () => {
        const s = solRef.current;
        return pointsOn() && s && s.kind === "unique" ? s.x : Number.NaN;
      },
      () => {
        const s = solRef.current;
        return pointsOn() && s && s.kind === "unique" ? s.y : Number.NaN;
      },
      colors.inter,
      v.pointSize + 2,
    );

    // Label koordinat
    const textAttrs = {
      fontSize: 12,
      strokeColor: colors.vertex,
      anchorX: "left",
      anchorY: "bottom",
      offset: [8, 6],
      highlight: false,
      fixed: true,
      cssStyle:
        "font-weight:600;white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;",
    };
    const vertTexts: JEl[] = [];
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
      vertTexts.push(t);
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
      { ...textAttrs, strokeColor: colors.inter, fontSize: 13 },
    );
    interText.hide();

    // Titik uji (hanya pada mode pertidaksamaan)
    const test = create("point", [testPt.x, testPt.y], {
      name: "",
      withLabel: false,
      size: v.pointSize,
      face: "[]",
      fillColor: "#ffffff",
      strokeColor: colors.vertex,
      strokeWidth: 2.5,
      highlightFillColor: "#ffffff",
      highlightStrokeColor: colors.vertex,
      snapToGrid: true,
      snapSizeX: 0.5,
      snapSizeY: 0.5,
      showInfobox: false,
    });
    test.on("drag", () => setTestPt({ x: test.X(), y: test.Y() }));

    // Pegangan paling atas
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
        pt.setPosition(COORDS_BY_USER, [Math.round(pt.X()), Math.round(pt.Y())]),
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

    // Geser, zoom, dan perubahan ukuran semuanya mengubah kotak batas.
    board.on("boundingbox", scheduleRecompute);

    scene.current = {
      grid,
      axes: [xAxis, yAxis],
      rings,
      objs,
      level,
      levelLine,
      levelText,
      vertMarkers,
      interMarker,
      vertTexts,
      interText,
      test,
    };
  };

  const { boardProps, boardRef, zoomIn, zoomOut } = useJsxBoard({
    boundingBox: initialBox,
    setup,
    zoomRange: [0.1, 20],
  });

  // Bersihkan jadwal gambar ulang saat komponen dilepas.
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  // Ganti mode: tampilan awal dan penempatan ulang pegangan
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    modeRef.current = mode;
    handleAbcRef.current = [];
    board.setBoundingBox(HOME[mode], true);
  }, [mode, boardRef]);

  // Sinkronkan state dan tampilan ke papan
  useEffect(() => {
    const board = boardRef.current;
    const s = scene.current;
    if (!board || !s) return;
    modeRef.current = mode;
    linesRef.current = lines;
    nonnegRef.current = nonneg;
    showHalfRef.current = showHalf;
    snapRef.current = snap;
    pqRef.current = { p, q, goal };
    const vw = view;

    s.grid.setAttribute({ visible: vw.grid });
    s.axes.forEach((axis) =>
      axis.defaultTicks.setAttribute({
        visible: vw.axisNumbers,
        drawLabels: vw.axisNumbers,
      }),
    );

    const box = board.getBoundingBox() as Box;
    s.objs.forEach((o, i) => {
      const c = lines[i];
      if (!c) {
        o.line.hide();
        o.p1.hide();
        o.p2.hide();
        return;
      }
      if (vw.show[LINE_KEYS[i]]) {
        o.line.show();
        o.p1.show();
        o.p2.show();
      } else {
        o.line.hide();
        o.p1.hide();
        o.p2.hide();
      }
      o.line.setAttribute({
        strokeWidth: vw.curveWidth,
        highlightStrokeWidth: vw.curveWidth + 1,
      });
      [o.p1, o.p2].forEach((pt) =>
        pt.setAttribute({ snapToGrid: snap, size: vw.pointSize }),
      );
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

    s.rings.forEach((r) => r.setAttribute({ size: vw.pointSize + 4 }));
    s.vertMarkers.forEach((m) => m.setAttribute({ size: vw.pointSize }));
    s.interMarker.setAttribute({ size: vw.pointSize + 2 });
    s.test.setAttribute({ size: vw.pointSize });

    const lp = mode === "lp";
    const hasObj = Math.abs(p) > 1e-12 || Math.abs(q) > 1e-12;
    if (lp && hasObj && vw.show.level) {
      s.levelLine.show();
      s.levelText.show();
      s.level.show();
      s.levelLine.setAttribute({ strokeWidth: vw.curveWidth });
      s.level.setAttribute({ size: vw.pointSize + 1 });
      const sq = p * p + q * q;
      s.level.setPosition(COORDS_BY_USER, [(kRef.current * p) / sq, (kRef.current * q) / sq]);
    } else {
      s.levelLine.hide();
      s.levelText.hide();
      s.level.hide();
    }
    if (mode === "ptlsv") s.test.show();
    else s.test.hide();

    recompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, eq, ineq, nonneg, showHalf, snap, p, q, goal, view]);

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

  /* ───────── Tampilan & papan tombol ───────── */

  const goHome = () => {
    boardRef.current?.setBoundingBox(HOME[modeRef.current], true);
    scheduleRecompute();
  };
  const zoomInView = () => {
    zoomIn();
    scheduleRecompute();
  };
  const zoomOutView = () => {
    zoomOut();
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
        zoomInView();
        break;
      case "-":
      case "_":
        zoomOutView();
        break;
      case "0":
        goHome();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const updateView = (change: Partial<ViewState>) => {
    const next = { ...viewRef.current, ...change };
    viewRef.current = next;
    setStoredView(next);
  };
  const toggleShow = (key: ObjectKey) =>
    updateView({
      show: { ...viewRef.current.show, [key]: !viewRef.current.show[key] },
    });

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
    goHome();
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

  // Ringkasan singkat di atas grafik (saat panel disembunyikan)
  const overlayTex = (() => {
    if (!analysis) return String.raw`\text{—}`;
    if (mode === "spldv") {
      const s = analysis.sol;
      if (!s) return String.raw`\text{atur kedua garis}`;
      if (s.kind === "unique") return String.raw`\text{Titik potong}\ ${ptTex(s)}`;
      if (s.kind === "parallel") return String.raw`\text{sejajar: tanpa penyelesaian}`;
      return String.raw`\text{berimpit: tak hingga penyelesaian}`;
    }
    if (analysis.empty) return String.raw`\text{tidak ada daerah penyelesaian}`;
    if (mode === "ptlsv") {
      return String.raw`\text{daerah dengan}\ ${analysis.verts.length}\ \text{titik sudut}`;
    }
    const o = analysis.opt;
    if (o && o.status === "optimal") {
      return String.raw`z_{\text{${goal === "max" ? "maks" : "min"}}}=${tx(o.z)}\ \text{di}\ ${ptTex(o.points[0])}`;
    }
    if (o && o.status === "unbounded") return String.raw`\text{tidak ada nilai ${goalWord}}`;
    return String.raw`\text{—}`;
  })();

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

  // Rentang slider z dibulatkan ke langkah 0,1 agar pas dengan SimSlider.
  const sliderMin = Math.floor((analysis ? analysis.zLo : -20) * 10) / 10;
  const sliderMax = Math.ceil((analysis ? analysis.zHi : 20) * 10) / 10;

  const mark = (ok: boolean) => (
    <b style={{ color: ok ? colors.ok : colors.bad, marginLeft: 6 }}>{ok ? "✓" : "✗"}</b>
  );

  /* ───────── Tampilan ───────── */

  return (
    <SimulationShell
      title="Simulasi sistem linear"
      onReset={resetAll}
      onZoomIn={zoomInView}
      onZoomOut={zoomOutView}
      onHome={goHome}
      toggles={
        <>
          <SimToggle
            icon={<GridIcon />}
            label="Grid"
            pressed={view.grid}
            onClick={() => updateView({ grid: !view.grid })}
          />
          <SimToggle
            icon={<AxisNumbersIcon />}
            label="Angka sumbu"
            pressed={view.axisNumbers}
            onClick={() => updateView({ axisNumbers: !view.axisNumbers })}
          />
          <SimToggle
            icon={<PointLabelIcon />}
            label="Koordinat titik"
            pressed={view.pointLabels}
            onClick={() => updateView({ pointLabels: !view.pointLabels })}
          />
        </>
      }
      settings={
        <SimSection title="Garis dan titik">
          <SimSlider
            id="linear-curve-width"
            name="tebal garis"
            label={`Tebal garis: ${view.curveWidth}`}
            value={view.curveWidth}
            min={1}
            max={8}
            step={1}
            onChange={(curveWidth) => updateView({ curveWidth })}
          />
          <SimSlider
            id="linear-point-size"
            name="ukuran titik"
            label={`Ukuran titik: ${view.pointSize}`}
            value={view.pointSize}
            min={2}
            max={10}
            step={1}
            onChange={(pointSize) => updateView({ pointSize })}
          />
          <button
            type="button"
            className="sim-text-btn"
            onClick={() =>
              updateView({
                grid: initialView.grid,
                axisNumbers: initialView.axisNumbers,
                pointLabels: initialView.pointLabels,
                curveWidth: initialView.curveWidth,
                pointSize: initialView.pointSize,
                show: initialView.show,
              })
            }
          >
            Atur ulang tampilan
          </button>
        </SimSection>
      }
      graph={
        <div
          {...boardProps}
          role="application"
          tabIndex={0}
          onKeyDown={onBoardKey}
          aria-label="Grafik garis linear. Seret garis atau titik putih untuk mengubahnya. Seret area kosong untuk menggeser, gulir atau cubit untuk memperbesar. Tombol panah menggeser, plus dan minus memperbesar atau memperkecil, nol memusatkan tampilan."
        />
      }
      overlay={
        <p className="sim-overlay" aria-live="polite">
          <SimMath tex={overlayTex} />
        </p>
      }
      panel={
        <>
          <SimSection title="Jenis simulasi">
            <div className="sim-seg" role="radiogroup" aria-label="Jenis simulasi">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={mode === m.id}
                  className="sim-seg__btn"
                  onClick={() => changeMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </SimSection>

          <SimSection title={mode === "spldv" ? "Persamaan" : "Kendala"}>
            <div>
              {lines.map((c, i) => (
                <div className="sim-eq" key={i}>
                  <span className="sim-eq__part sim-eq__part--lhs">
                    <span
                      className="sim-swatch"
                      style={{ background: colors.lines[i] }}
                      aria-hidden="true"
                    />
                    <NumField
                      value={c.a}
                      label={`Koefisien x garis ${i + 1}`}
                      onChange={(v) => updateLine(i, { a: v })}
                    />
                    <span className="sim-eq__sym">x +</span>
                    <NumField
                      value={c.b}
                      label={`Koefisien y garis ${i + 1}`}
                      onChange={(v) => updateLine(i, { b: v })}
                    />
                    <span className="sim-eq__sym">y</span>
                  </span>
                  <span className="sim-eq__part sim-eq__part--rhs">
                    {mode === "spldv" ? (
                      <span className="sim-eq__sym">=</span>
                    ) : (
                      <select
                        className="sim-select"
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
                        className="sim-x"
                        aria-label={`Hapus kendala ${i + 1}`}
                        onClick={() => removeConstraint(i)}
                      >
                        ×
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {mode !== "spldv" && (
              <div className="sim-chips" style={{ marginTop: 6 }}>
                {lines.length < MAX_LINES && (
                  <button type="button" className="sim-chip" onClick={addConstraint}>
                    + Kendala
                  </button>
                )}
                <button
                  type="button"
                  className="sim-chip"
                  aria-pressed={nonneg}
                  onClick={() => setNonneg(!nonneg)}
                >
                  x ≥ 0, y ≥ 0
                </button>
              </div>
            )}

            <p className="sim-subhead">Contoh</p>
            <div className="sim-chips" role="group" aria-label="Contoh soal">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="sim-chip"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </SimSection>

          {mode === "lp" && (
            <SimSection title="Fungsi tujuan">
              <div className="sim-eq">
                <span className="sim-eq__part sim-eq__part--lhs">
                  <span className="sim-eq__sym">z =</span>
                  <NumField value={p} label="Koefisien x pada z" onChange={setP} />
                  <span className="sim-eq__sym">x +</span>
                  <NumField value={q} label="Koefisien y pada z" onChange={setQ} />
                  <span className="sim-eq__sym">y</span>
                </span>
              </div>
              <div className="sim-seg" role="radiogroup" aria-label="Tujuan optimasi">
                {(["max", "min"] as Goal[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={goal === g}
                    className="sim-seg__btn"
                    onClick={() => setGoal(g)}
                  >
                    {g === "max" ? "Maksimumkan" : "Minimumkan"}
                  </button>
                ))}
              </div>
              <SimSlider
                id="linear-level"
                name="z"
                label={<SimMath tex={`z=${tx(k)}`} />}
                hint="garis selidik"
                accent={colors.opt}
                value={clamp(k, sliderMin, sliderMax)}
                min={sliderMin}
                max={sliderMax}
                step={0.1}
                valueText={`z sama dengan ${fmtN(k)}`}
                onChange={(value) => {
                  setAnim(false);
                  moveLevel(value);
                }}
              />
              <button
                type="button"
                className="sim-text-btn"
                aria-pressed={anim}
                disabled={!opt || opt.status !== "optimal"}
                onClick={() => setAnim((a) => !a)}
              >
                {anim ? "Hentikan" : "Geser ke optimum"}
              </button>
              <p className="sim-status" role="status">
                {levelNote}
              </p>
            </SimSection>
          )}

          <SimSection title="Opsi">
            <div className="sim-btn-row">
              <button
                type="button"
                className="sim-text-btn"
                aria-pressed={snap}
                onClick={() => setSnap(!snap)}
              >
                Tempel ke grid
              </button>
              {mode !== "spldv" && (
                <button
                  type="button"
                  className="sim-text-btn"
                  aria-pressed={showHalf}
                  onClick={() => setShowHalf(!showHalf)}
                >
                  Warnai sisi
                </button>
              )}
            </div>
          </SimSection>

          <SimSection title="Hasil">
            <p className="sim-callout" role="status" style={{ marginTop: 0 }}>
              {resultText}
            </p>
            <ul className="sim-rows" aria-live="polite">
              {lines.map((c, i) => (
                <SimRow
                  key={i}
                  color={colors.lines[i]}
                  visible={view.show[LINE_KEYS[i]]}
                  onToggle={() => toggleShow(LINE_KEYS[i])}
                  toggleLabel={`Tampilkan atau sembunyikan garis ${i + 1}`}
                >
                  <SimMath tex={lineTex(c)} />
                </SimRow>
              ))}
              {mode !== "spldv" && nonneg && (
                <SimRow>
                  <SimMath tex={String.raw`x\ge 0,\ y\ge 0`} />
                </SimRow>
              )}
              {mode !== "spldv" && (
                <SimRow
                  color={colors.region}
                  visible={view.show.region}
                  onToggle={() => toggleShow("region")}
                  toggleLabel="Tampilkan atau sembunyikan daerah penyelesaian"
                >
                  <span>Daerah penyelesaian</span>
                </SimRow>
              )}

              {mode === "spldv" && sol?.kind === "unique" && (
                <>
                  <SimRow
                    color={colors.inter}
                    visible={view.show.points}
                    onToggle={() => toggleShow("points")}
                    toggleLabel="Tampilkan atau sembunyikan titik potong"
                  >
                    <SimMath tex={`(x;\\,y)=${ptTex(sol)}`} />
                  </SimRow>
                  <SimRow>
                    <SimMath
                      tex={String.raw`D=a_1b_2-a_2b_1=${tx(sol.D)}`}
                    />
                  </SimRow>
                  <SimRow>
                    <SimMath
                      tex={String.raw`D_x=${tx(sol.Dx)},\ D_y=${tx(sol.Dy)}`}
                    />
                  </SimRow>
                  <SimRow>
                    <SimMath
                      tex={String.raw`x=\dfrac{D_x}{D}=${tx(sol.x)},\ y=\dfrac{D_y}{D}=${tx(sol.y)}`}
                    />
                  </SimRow>
                  {eq.map((c, i) => {
                    const v = c.a * sol.x + c.b * sol.y;
                    return (
                      <SimRow key={`check-${i}`} color={colors.lines[i]}>
                        <SimMath
                          tex={`${tx(c.a)}(${tx(sol.x)})+${tx(c.b)}(${tx(sol.y)})=${tx(v)}`}
                        />
                        {mark(Math.abs(v - c.c) < 1e-6)}
                      </SimRow>
                    );
                  })}
                </>
              )}

              {mode !== "spldv" && (
                <SimRow
                  color={colors.vertex}
                  visible={view.show.points}
                  onToggle={() => toggleShow("points")}
                  toggleLabel="Tampilkan atau sembunyikan titik sudut"
                >
                  {analysis?.empty || verts.length === 0 ? (
                    <span>Titik sudut: —</span>
                  ) : (
                    <SimMath tex={verts.map(ptTex).join(String.raw`\ `)} />
                  )}
                </SimRow>
              )}

              {mode === "ptlsv" && (
                <>
                  <SimRow color={allOk ? colors.ok : colors.bad}>
                    <span>
                      Titik uji <SimMath tex={ptTex(testPt)} />{" "}
                      {allOk ? "memenuhi" : "tidak memenuhi"}
                    </span>
                  </SimRow>
                  {lines.map((c, i) => (
                    <SimRow key={`test-${i}`} color={colors.lines[i]}>
                      <SimMath
                        tex={`${tx(c.a)}(${tx(testPt.x)})+${tx(c.b)}(${tx(testPt.y)})=${tx(checks[i].v)}\\ ${OP_TEX[c.op] ?? c.op}\\ ${tx(c.c)}`}
                      />
                      {mark(checks[i].ok)}
                    </SimRow>
                  ))}
                  {nonneg && (
                    <SimRow>
                      <SimMath tex={String.raw`x\ge 0,\ y\ge 0`} />
                      {mark(nnOk)}
                    </SimRow>
                  )}
                </>
              )}

              {mode === "lp" && (
                <SimRow
                  color={colors.opt}
                  visible={view.show.level}
                  onToggle={() => toggleShow("level")}
                  toggleLabel="Tampilkan atau sembunyikan garis selidik"
                >
                  <SimMath tex={`z=${tx(p)}x+${tx(q)}y`.replace("+-", "-")} />
                </SimRow>
              )}
            </ul>

            {mode === "ptlsv" && (
              <p className="sim-hint">Seret kotak putih di grafik untuk menguji titik lain.</p>
            )}

            {mode === "lp" && (
              <div className="sim-table-wrap" style={{ marginTop: 6 }}>
                <table className="sim-table sim-table--left">
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
                        <td colSpan={3}>
                          {analysis?.empty ? "Daerah penyelesaian kosong." : "Tidak ada titik sudut."}
                        </td>
                      </tr>
                    ) : (
                      verts.map((vt, i) => {
                        const best =
                          opt?.status === "optimal" &&
                          Math.abs(zAt(vt) - opt.z) < 1e-6 * (1 + Math.abs(opt.z));
                        return (
                          <tr key={i} className={best ? "sim-table__limit" : ""}>
                            <th scope="row">{ptText(vt)}</th>
                            <td>{fmtN(zAt(vt))}</td>
                            <td>{best ? `← ${goalWord}` : ""}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </SimSection>
        </>
      }
      notes={
        mode === "spldv" ? (
          <>
            <p style={{ margin: 0 }}>
              <strong style={{ color: colors.lines[0] }}>Titik potong: </strong>
              penyelesaian SPLDV adalah titik potong dua garis. Dengan aturan Cramer,{" "}
              <SimMath tex={String.raw`x=\dfrac{D_x}{D},\ y=\dfrac{D_y}{D}`} /> bila{" "}
              <SimMath tex={String.raw`D\ne 0`} />.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: colors.inter }}>Tiga kemungkinan: </strong>
              <SimMath tex={String.raw`D\ne 0`} /> satu titik potong,{" "}
              <SimMath tex={String.raw`D=0`} /> sejajar (tanpa penyelesaian) atau berimpit
              (tak hingga banyak). Seret garis atau titik putih untuk mencobanya.
            </p>
          </>
        ) : mode === "ptlsv" ? (
          <>
            <p style={{ margin: 0 }}>
              <strong style={{ color: colors.region }}>Daerah penyelesaian: </strong>
              irisan semua sisi yang memenuhi setiap pertidaksamaan. Garis putus-putus
              berarti tanda <SimMath tex="<" /> atau <SimMath tex=">" /> (garis tidak
              ikut).
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: colors.vertex }}>Titik uji: </strong>
              seret kotak putih ke dalam atau luar daerah lalu perhatikan tanda ✓ dan ✗
              di setiap pertidaksamaan.
            </p>
          </>
        ) : (
          <>
            <p style={{ margin: 0 }}>
              <strong style={{ color: colors.region }}>Daerah layak: </strong>
              nilai optimum fungsi tujuan <SimMath tex="z=px+qy" /> selalu tercapai di
              salah satu titik sudut daerah layak (bila daerahnya terbatas).
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: colors.opt }}>Garis selidik: </strong>
              geser garis <SimMath tex="z=k" /> sejajar dirinya sendiri. Titik terakhir yang
              disentuh sebelum garis meninggalkan daerah adalah titik{" "}
              {goal === "max" ? "maksimum" : "minimum"}.
            </p>
          </>
        )
      }
    />
  );
}

export default LinearSystemSimulation;
