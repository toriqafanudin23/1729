import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  AxisNumbersIcon,
  GridIcon,
  PointLabelIcon,
  SimRow,
  SimSection,
  SimSlider,
  SimToggle,
} from "../common/components/SimControls";
import { SimMath } from "../common/components/SimMath";
import { SimulationShell } from "../common/components/SimulationShell";
import { clamp } from "../common/utils/simUtils";
import { useJsxBoard, type BoundingBox, type SimBoard } from "../common/hooks/useJsxBoard";
import { useStoredSimulationState } from "../common/hooks/useStoredSimulationState";

/* Simulasi sektor lingkaran (juring).
   Kerangka, slider, dan CSS memakai kit umum (prefix sim-), sama seperti
   simulasi fungsi kuadrat, turunan, integral, dan irisan kerucut.

   Lingkaran berpusat di O(0, 0) dengan jari-jari r. Titik A berada pada arah φ
   dari sumbu x positif dan titik B pada arah φ + θ, dengan θ = sudut pusat.

       panjang busur   s = θ/360° · 2πr
       luas juring     L = θ/360° · πr²
       tali busur      c = 2r sin(θ/2)
       apotema         d = r cos(θ/2)
       luas tembereng  ½ r² (θ − sin θ)      (θ dalam radian)
       garis singgung  di A:  x·xA + y·yA = r²   (tegak lurus OA) */

/* ───────── Tipe & konstanta ───────── */

type Vec = [number, number];
type Anim = "t" | "p" | null;
type Params = { r: number; t: number; p: number };
type ObjectKey =
  | "circle"
  | "sector"
  | "segment"
  | "chord"
  | "apothem"
  | "tangent"
  | "tpoint"
  | "angle";
type ViewState = {
  grid: boolean;
  axisNumbers: boolean;
  pointLabels: boolean;
  curveWidth: number;
  pointSize: number;
  show: Record<ObjectKey, boolean>;
};

const DEG = Math.PI / 180;
const R_RANGE = [1, 8] as const;
const T_RANGE = [1, 360] as const;
const P_RANGE = [-180, 180] as const;
/** Sudut pusat di atas ini: garis singgung hampir sejajar, titik T disembunyikan. */
const T_POINT_MAX = 175;

const initialParams: Params = { r: 5, t: 60, p: 30 };
const initialView: ViewState = {
  grid: true,
  axisNumbers: true,
  pointLabels: true,
  curveWidth: 3,
  pointSize: 4,
  show: {
    circle: true,
    sector: true,
    segment: false,
    chord: true,
    apothem: false,
    tangent: true,
    tpoint: false,
    angle: true,
  },
};
const initialBox: BoundingBox = [-14, 10, 14, -10];

const colors = {
  arc: "#00897b",
  radius: "#232329",
  chord: "#c62828",
  segment: "#e65100",
  tangent: "#087f8c",
  angle: "#6557d2",
  phi: "#1565c0",
  guide: "#8f8f99",
  grid: "#dcdce2",
  axis: "#4a4a55",
};

const PRESETS: { t: number; color: string }[] = [
  { t: 60, color: colors.arc },
  { t: 90, color: colors.angle },
  { t: 120, color: colors.segment },
  { t: 180, color: colors.chord },
];

type Settable = { setAttribute: (attributes: Record<string, unknown>) => unknown };
type AxisElement = Settable & { defaultTicks: Settable };
type DataCurve = Settable & {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};
type Marker = { point: Settable; label: Settable };
type Scene = {
  grid: Settable;
  axes: AxisElement[];
  circle: DataCurve;
  sector: DataCurve;
  segment: DataCurve;
  tangents: DataCurve[];
  ot: DataCurve;
  radii: DataCurve[];
  chord: DataCurve;
  apothem: DataCurve;
  angleArc: DataCurve;
  arc: DataCurve;
  o: Marker;
  a: Marker;
  b: Marker;
  t: Marker;
  m: Marker;
  angleLabel: Settable;
  rLabel: Settable;
  cLabel: Settable;
  dLabel: Settable;
};

const finite = (value: number) => Number.isFinite(value);
const round = (value: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

/* ───────── Format angka (koma desimal, minus sebenarnya) ───────── */

const formatters = new Map<number, Intl.NumberFormat>();
function fmt(value: number, digits = 2) {
  if (!finite(value)) return "—";
  let nf = formatters.get(digits);
  if (!nf) {
    nf = new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: digits,
      useGrouping: false,
    });
    formatters.set(digits, nf);
  }
  if (Math.abs(value) < 0.5 * 10 ** -digits) return "0";
  return nf.format(value).replace("-", "−");
}

/** Angka untuk KaTeX: koma desimal tanpa spasi, minus sebagai "-". */
function tex(value: number, digits = 2) {
  if (!finite(value)) return "?";
  return fmt(value, digits).replace("−", "-").replace(",", "{,}");
}

const fmtPt = (x: number, y: number) => `(${fmt(x)}; ${fmt(y)})`;
const texPt = (x: number, y: number) => String.raw`(${tex(x)};\,${tex(y)})`;

/** Menyusun suku "koef·simbol" menjadi LaTeX dengan tanda yang rapi. */
function polyTex(terms: [number, string][]) {
  const parts: string[] = [];
  terms.forEach(([coef, symbol]) => {
    if (Math.abs(coef) < 5e-3) return;
    const abs = Math.abs(coef);
    const body =
      symbol !== "" && Math.abs(abs - 1) < 5e-3
        ? symbol
        : `${tex(abs)}${symbol}`;
    if (parts.length === 0) parts.push(coef < 0 ? `-${body}` : body);
    else parts.push(`${coef < 0 ? "-" : "+"} ${body}`);
  });
  return parts.length ? parts.join(" ") : "0";
}

const slopeText = (s: number | null) =>
  s === null ? "tegak lurus sumbu x" : fmt(s);

/* ───────── Matematika ───────── */

function analyze({ r, t, p }: Params) {
  const th = t * DEG;
  const ph = p * DEG;
  const half = th / 2;
  const mid = ph + half;

  const A: Vec = [r * Math.cos(ph), r * Math.sin(ph)];
  const B: Vec = [r * Math.cos(ph + th), r * Math.sin(ph + th)];
  const apothem = r * Math.cos(half); // bertanda: negatif bila θ > 180°
  const M: Vec = [apothem * Math.cos(mid), apothem * Math.sin(mid)];

  const tValid = t < T_POINT_MAX;
  const tLen = r * Math.tan(half);
  const ot = r / Math.cos(half);
  const T: Vec = tValid
    ? [ot * Math.cos(mid), ot * Math.sin(mid)]
    : [Number.NaN, Number.NaN];

  const arc = r * th;
  return {
    r,
    tDeg: t,
    pDeg: p,
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

export function CircleSectorSimulation() {
  const [params, setParams] = useStoredSimulationState(
    "circleSector.params",
    initialParams,
  );
  const [storedView, setStoredView] = useStoredSimulationState(
    "circleSector.view",
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

  // Jaga-jaga bila nilai tersimpan sudah tidak valid.
  const safeParams = useMemo<Params>(() => {
    const merged = { ...initialParams, ...params };
    return {
      r: clamp(Number(merged.r), R_RANGE[0], R_RANGE[1]),
      t: clamp(Number(merged.t), T_RANGE[0], T_RANGE[1]),
      p: clamp(Number(merged.p), P_RANGE[0], P_RANGE[1]),
    };
  }, [params]);

  const paramsRef = useRef(safeParams);
  paramsRef.current = safeParams;
  const viewRef = useRef(view);
  viewRef.current = view;
  const scene = useRef<Scene | null>(null);
  const [anim, setAnim] = useState<Anim>(null);

  /* ───────── Papan JSXGraph ───────── */

  const setup = (board: SimBoard) => {
    // Analisis dihitung sekali per perubahan parameter.
    let cache: { p: Params; v: Analysis } | null = null;
    const A = (): Analysis => {
      const p = paramsRef.current;
      if (!cache || cache.p !== p) cache = { p, v: analyze(p) };
      return cache.v;
    };
    const v = viewRef.current;

    const grid = board.create("grid", [], {
      strokeColor: colors.grid,
      strokeOpacity: 1,
      strokeWidth: 1,
      highlight: false,
    }) as unknown as Settable;

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
    const xAxis = board.create(
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
    ) as unknown as AxisElement;
    const yAxis = board.create(
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
    ) as unknown as AxisElement;

    /** Jarak yang cukup besar untuk menutupi seluruh area terlihat. */
    const extent = () => {
      const bb = board.getBoundingBox();
      return 4 * Math.max(...bb.map((value: number) => Math.abs(value))) + 30;
    };

    /** Kurva dari daftar titik; null menyembunyikannya. */
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
          points.some((q) => !finite(q[0]) || !finite(q[1]))
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

    // Lingkaran penuh (tipis)
    const circle = makeCurve(colors.guide, 1.5, 0, () =>
      arcPoints(A().r, 0, 360),
    );

    // Juring: O → A → busur → B → O
    const sector = makeCurve(
      colors.arc,
      0,
      0,
      () => {
        const a = A();
        return [O, ...arcPoints(a.r, a.pDeg, a.tDeg), O];
      },
      { color: colors.arc, opacity: 0.2 },
    );

    // Tembereng: busur lalu kembali ke A lewat tali busur
    const segment = makeCurve(
      colors.segment,
      0,
      0,
      () => {
        const a = A();
        return [...arcPoints(a.r, a.pDeg, a.tDeg), a.A];
      },
      { color: colors.segment, opacity: 0.32 },
    );

    // Garis singgung di A dan B (tegak lurus jari-jari)
    const tangents = ([0, 1] as const).map((k) =>
      makeCurve(colors.tangent, 2.25, 0, () => {
        const a = A();
        const pt = k === 0 ? a.A : a.B;
        const ang = k === 0 ? a.ph : a.ph + a.th;
        const d: Vec = [-Math.sin(ang), Math.cos(ang)];
        const s = extent();
        return [
          [pt[0] - d[0] * s, pt[1] - d[1] * s],
          [pt[0] + d[0] * s, pt[1] + d[1] * s],
        ];
      }),
    );

    // OT (sumbu simetri layang-layang OATB)
    const ot = makeCurve(colors.guide, 1.5, 2, () => {
      const a = A();
      return a.tValid ? [O, a.T] : null;
    });

    // Jari-jari OA dan OB
    const radii = [
      makeCurve(colors.radius, 2, 0, () => [O, A().A]),
      makeCurve(colors.radius, 2, 0, () => [O, A().B]),
    ];

    // Tali busur dan apotema
    const chord = makeCurve(colors.chord, 2.75, 0, () => [A().A, A().B]);
    const apothem = makeCurve(colors.guide, 1.5, 2, () => [O, A().M]);

    // Busur kecil penanda sudut pusat θ
    const angleRadius = () => Math.min(2, Math.max(0.7, A().r * 0.25));
    const angleArc = makeCurve(colors.angle, 2.5, 0, () => {
      const a = A();
      return arcPoints(angleRadius(), a.pDeg, a.tDeg);
    });

    // Busur AB (utama)
    const arc = makeCurve(colors.arc, 4.5, 0, () => {
      const a = A();
      return arcPoints(a.r, a.pDeg, a.tDeg);
    });

    // Titik + label (nama, ditambah koordinat bila diaktifkan)
    const marker = (
      x: () => number,
      y: () => number,
      color: string,
      name: string,
      place: { dx: number; dy: number; ax: "left" | "right"; ay: "top" | "bottom" } = {
        dx: 8,
        dy: 6,
        ax: "left",
        ay: "bottom",
      },
    ): Marker => {
      const point = board.create("point", [x, y], {
        name: "",
        withLabel: false,
        size: v.pointSize,
        fillColor: color,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        fixed: true,
        highlight: false,
        showInfobox: false,
      }) as unknown as Settable;
      const label = board.create(
        "text",
        [
          () => (finite(x()) ? x() + place.dx / board.unitX : 0),
          () => (finite(y()) ? y() + place.dy / board.unitY : 0),
          () =>
            finite(x()) && finite(y())
              ? viewRef.current.pointLabels
                ? `${name}${fmtPt(x(), y())}`
                : name
              : "",
        ],
        {
          anchorX: place.ax,
          anchorY: place.ay,
          fontSize: 12,
          strokeColor: color,
          highlight: false,
          fixed: true,
          cssStyle:
            "font-weight:600;white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;",
        },
      ) as unknown as Settable;
      return { point, label };
    };

    // Label huruf pada objek (θ, r, c, d)
    const tag = (
      x: () => number,
      y: () => number,
      text: string | (() => string),
      color: string,
      offset: [number, number] = [8, 8],
    ) =>
      board.create(
        "text",
        [
          () => (finite(x()) ? x() : 1e6),
          () => (finite(y()) ? y() : 1e6),
          text,
        ],
        {
          fontSize: 13,
          strokeColor: color,
          offset,
          highlight: false,
          fixed: true,
          cssStyle:
            "font-weight:600;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;",
        },
      ) as unknown as Settable;

    scene.current = {
      grid,
      axes: [xAxis, yAxis],
      circle,
      sector,
      segment,
      tangents,
      ot,
      radii,
      chord,
      apothem,
      angleArc,
      arc,
      o: marker(() => 0, () => 0, colors.radius, "O", {
        dx: -8,
        dy: -6,
        ax: "right",
        ay: "top",
      }),
      a: marker(() => A().A[0], () => A().A[1], colors.radius, "A"),
      b: marker(() => A().B[0], () => A().B[1], colors.radius, "B"),
      t: marker(() => A().T[0], () => A().T[1], colors.tangent, "T"),
      m: marker(() => A().M[0], () => A().M[1], colors.guide, "M", {
        dx: 8,
        dy: -6,
        ax: "left",
        ay: "top",
      }),
      angleLabel: tag(
        () => angleRadius() * 1.7 * Math.cos(A().mid),
        () => angleRadius() * 1.7 * Math.sin(A().mid),
        () => `θ = ${fmt(paramsRef.current.t, 1)}°`,
        colors.angle,
        [-14, -8],
      ),
      rLabel: tag(() => A().A[0] * 0.5, () => A().A[1] * 0.5, "r", colors.radius, [-4, 6]),
      cLabel: tag(
        () => (A().chord > 0.3 ? A().M[0] : Number.NaN),
        () => A().M[1],
        "c",
        colors.chord,
        [8, -14],
      ),
      dLabel: tag(() => A().M[0] * 0.5, () => A().M[1] * 0.5, "d", colors.guide, [-14, 4]),
    };
    applyView();
  };

  const { boardProps, boardRef, zoomIn, zoomOut, resetView } = useJsxBoard({
    boundingBox: initialBox,
    setup,
  });

  /** Menerapkan toggle, ketebalan garis, dan ukuran titik ke papan. */
  function applyView() {
    const s = scene.current;
    if (!s) return;
    const vw = viewRef.current;
    const w = vw.curveWidth;
    const thin = Math.max(1, w / 2);
    const showT = vw.show.tpoint && vw.show.tangent;
    const showM = vw.show.apothem || vw.show.chord;

    s.grid.setAttribute({ visible: vw.grid });
    s.axes.forEach((axis) =>
      axis.defaultTicks.setAttribute({
        visible: vw.axisNumbers,
        drawLabels: vw.axisNumbers,
      }),
    );

    s.circle.setAttribute({ visible: vw.show.circle, strokeWidth: thin });
    s.sector.setAttribute({ visible: vw.show.sector });
    s.segment.setAttribute({ visible: vw.show.segment });
    s.tangents.forEach((c) =>
      c.setAttribute({
        visible: vw.show.tangent,
        strokeWidth: Math.max(1.5, w * 0.75),
      }),
    );
    s.ot.setAttribute({ visible: showT, strokeWidth: thin });
    s.radii.forEach((c) =>
      c.setAttribute({ visible: true, strokeWidth: Math.max(1, w * 0.67) }),
    );
    s.chord.setAttribute({ visible: vw.show.chord, strokeWidth: w * 0.9 });
    s.apothem.setAttribute({ visible: vw.show.apothem, strokeWidth: thin });
    s.angleArc.setAttribute({ visible: vw.show.angle, strokeWidth: w * 0.8 });
    s.arc.setAttribute({ visible: true, strokeWidth: w * 1.5 });

    const apply = (item: Marker, shown: boolean, extra: number) => {
      item.point.setAttribute({ visible: shown, size: vw.pointSize + extra });
      item.label.setAttribute({ visible: shown });
    };
    apply(s.o, true, 1);
    apply(s.a, true, 2);
    apply(s.b, true, 2);
    apply(s.t, showT, 1);
    apply(s.m, showM, 0);

    s.angleLabel.setAttribute({ visible: vw.show.angle });
    s.rLabel.setAttribute({ visible: true });
    s.cLabel.setAttribute({ visible: vw.show.chord });
    s.dLabel.setAttribute({ visible: vw.show.apothem });

    boardRef.current?.update();
  }

  useEffect(() => {
    applyView();
  }, [view]);

  useEffect(() => {
    boardRef.current?.update();
  }, [safeParams, boardRef]);

  /* ───────── Ketuk lingkaran untuk memindahkan titik B ───────── */

  const hostRef = boardProps.ref;
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    let down: { x: number; y: number } | null = null;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      down = { x: event.clientX, y: event.clientY };
    };
    const onUp = (event: PointerEvent) => {
      if (!down) return;
      const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
      down = null;
      const board = boardRef.current;
      if (!board || moved >= 5) return; // geser tetap lancar
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const [x1, y1, x2, y2] = board.getBoundingBox();
      const sx = rect.width / (x2 - x1);
      const ux = x1 + ((event.clientX - rect.left) / rect.width) * (x2 - x1);
      const uy = y1 - ((event.clientY - rect.top) / rect.height) * (y1 - y2);
      const { r, p } = paramsRef.current;
      const gap = Math.abs(Math.hypot(ux, uy) - r) * sx; // piksel
      if (gap > 30) return;
      const angle = (Math.atan2(uy, ux) / DEG - p + 720) % 360;
      setAnim(null);
      patch({ t: clamp(round(angle, 1), T_RANGE[0], T_RANGE[1]) });
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────── Perubahan dari pengguna ───────── */

  const patch = (change: Partial<Params>) => {
    const next: Params = { ...paramsRef.current, ...change };
    paramsRef.current = next;
    setParams(next);
    boardRef.current?.update();
  };

  /** Perubahan manual selalu menghentikan animasi. */
  const edit = (change: Partial<Params>) => {
    setAnim(null);
    patch(change);
  };

  const resetParams = () => {
    setAnim(null);
    patch(initialParams);
  };

  // Animasi: θ bolak-balik 1° ↔ 360°, atau seluruh juring berputar (φ).
  useEffect(() => {
    if (!anim) return;
    let raf = 0;
    let last = performance.now();
    let dir = 1;
    // Nilai float disimpan lokal agar langkah kecil tidak hilang oleh pembulatan.
    let t = paramsRef.current.t;
    let p = paramsRef.current.p;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (anim === "t") {
        t += dir * dt * 45;
        if (t >= T_RANGE[1]) {
          t = T_RANGE[1];
          dir = -1;
        } else if (t <= T_RANGE[0]) {
          t = T_RANGE[0];
          dir = 1;
        }
        patch({ t: round(t, 1) });
      } else {
        p += dt * 30;
        if (p > 180) p -= 360;
        patch({ p: round(p, 1) });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim]);

  const updateView = (change: Partial<ViewState>) => {
    const next = { ...viewRef.current, ...change };
    viewRef.current = next;
    setStoredView(next);
  };

  const toggleShow = (key: ObjectKey) =>
    updateView({
      show: { ...viewRef.current.show, [key]: !viewRef.current.show[key] },
    });

  /* ───────── Nilai turunan ───────── */

  const { r, t, p } = safeParams;
  const an = analyze(safeParams);
  const isMajor = t > 180;
  const kindLabel = isMajor
    ? "Busur besar"
    : t === 180
      ? "Setengah lingkaran"
      : "Busur kecil";
  const fraction = t / 360;
  const r2 = tex(r * r);
  const tangentA = `${polyTex([
    [an.A[0], "x"],
    [an.A[1], "y"],
  ])}=${r2}`;
  const tangentB = `${polyTex([
    [an.B[0], "x"],
    [an.B[1], "y"],
  ])}=${r2}`;

  const overlayTex = String.raw`\text{${kindLabel}}\quad \theta=${tex(t, 1)}^{\circ},\ s=${tex(an.arc)},\ L=${tex(an.sector)}`;

  /* ───────── Tampilan ───────── */

  return (
    <SimulationShell
      title="Simulasi sektor lingkaran"
      onReset={resetParams}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onHome={resetView}
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
            id="sector-curve-width"
            name="tebal garis"
            label={`Tebal garis: ${view.curveWidth}`}
            value={view.curveWidth}
            min={1}
            max={8}
            step={1}
            onChange={(curveWidth) => updateView({ curveWidth })}
          />
          <SimSlider
            id="sector-point-size"
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
          role="img"
          aria-label="Grafik lingkaran dengan pusat di titik asal dan juring AB. Seret untuk menggeser, cubit atau gulir untuk memperbesar, ketuk lingkaran untuk memindahkan titik B."
        />
      }
      overlay={
        <p className="sim-overlay" aria-live="polite">
          <SimMath tex={overlayTex} />
        </p>
      }
      panel={
        <>
          <SimSection title="Sudut pusat istimewa">
            <div
              className="sim-seg sim-seg--kinds"
              role="radiogroup"
              aria-label="Sudut pusat istimewa"
            >
              {PRESETS.map((item) => (
                <button
                  key={item.t}
                  type="button"
                  role="radio"
                  aria-checked={Math.abs(t - item.t) < 0.05}
                  className="sim-seg__btn"
                  style={{ "--sim-accent": item.color } as CSSProperties}
                  onClick={() => edit({ t: item.t })}
                >
                  {item.t}°
                </button>
              ))}
            </div>
          </SimSection>

          <SimSection title="Parameter" sticky>
            <SimSlider
              id="sector-r"
              name="r"
              label={<SimMath tex={`r=${tex(r, 1)}`} />}
              hint="jari-jari"
              accent={colors.radius}
              value={r}
              min={R_RANGE[0]}
              max={R_RANGE[1]}
              step={0.1}
              valueText={`r sama dengan ${fmt(r, 1)}`}
              onChange={(value) => edit({ r: value })}
            />
            <SimSlider
              id="sector-t"
              name="θ"
              label={<SimMath tex={String.raw`\theta=${tex(t, 1)}^{\circ}`} />}
              hint="sudut pusat"
              accent={colors.angle}
              value={t}
              min={T_RANGE[0]}
              max={T_RANGE[1]}
              step={0.5}
              valueText={`θ sama dengan ${fmt(t, 1)} derajat`}
              onChange={(value) => edit({ t: value })}
            />
            <SimSlider
              id="sector-p"
              name="φ"
              label={<SimMath tex={String.raw`\varphi=${tex(p, 1)}^{\circ}`} />}
              hint="arah titik A"
              accent={colors.phi}
              value={p}
              min={P_RANGE[0]}
              max={P_RANGE[1]}
              step={0.5}
              valueText={`φ sama dengan ${fmt(p, 1)} derajat`}
              onChange={(value) => edit({ p: value })}
            />
            <div className="sim-btn-row">
              <button
                type="button"
                className="sim-text-btn"
                aria-pressed={anim === "t"}
                onClick={() => setAnim(anim === "t" ? null : "t")}
              >
                {anim === "t" ? "Hentikan θ" : "Animasikan θ"}
              </button>
              <button
                type="button"
                className="sim-text-btn"
                aria-pressed={anim === "p"}
                onClick={() => setAnim(anim === "p" ? null : "p")}
              >
                {anim === "p" ? "Hentikan putar" : "Putar juring"}
              </button>
            </div>
          </SimSection>

          <SimSection title="Hasil">
            <ul className="sim-rows" aria-live="polite">
              <SimRow
                color={colors.guide}
                visible={view.show.circle}
                onToggle={() => toggleShow("circle")}
                toggleLabel="Tampilkan atau sembunyikan lingkaran"
              >
                <SimMath tex={`x^{2}+y^{2}=${r2}`} />
              </SimRow>
              <SimRow color={colors.arc}>
                <span>
                  {kindLabel}
                  {t === 180 ? ", tali busur = diameter" : ""}
                  {isMajor ? ", apotema di sisi lain" : ""}
                </span>
              </SimRow>
              <SimRow color={colors.arc}>
                <SimMath
                  tex={String.raw`\dfrac{\theta}{360^{\circ}}=${tex(fraction, 3)}\ (${tex(fraction * 100, 1)}\%)`}
                />
              </SimRow>
              <SimRow color={colors.arc}>
                <SimMath
                  tex={String.raw`s=\dfrac{\theta}{360^{\circ}}\cdot 2\pi r=\dfrac{${tex(t, 1)}}{360}\cdot 2\pi\cdot ${tex(r)}=${tex(an.arc)}`}
                />
              </SimRow>
              <SimRow
                color={colors.arc}
                visible={view.show.sector}
                onToggle={() => toggleShow("sector")}
                toggleLabel="Tampilkan atau sembunyikan juring"
              >
                <SimMath
                  tex={String.raw`L=\dfrac{\theta}{360^{\circ}}\cdot \pi r^{2}=${tex(an.sector)}`}
                />
              </SimRow>
              <SimRow>
                <SimMath tex={String.raw`K_{\text{juring}}=2r+s=${tex(an.perimeter)}`} />
              </SimRow>
              <SimRow>
                <SimMath tex={String.raw`L_{\text{lingkaran}}=\pi r^{2}=${tex(an.area)}`} />
              </SimRow>
              <SimRow
                color={colors.chord}
                visible={view.show.chord}
                onToggle={() => toggleShow("chord")}
                toggleLabel="Tampilkan atau sembunyikan tali busur"
              >
                <SimMath tex={String.raw`c=2r\sin\dfrac{\theta}{2}=${tex(an.chord)}`} />
              </SimRow>
              <SimRow
                color={colors.guide}
                visible={view.show.apothem}
                onToggle={() => toggleShow("apothem")}
                toggleLabel="Tampilkan atau sembunyikan apotema"
              >
                <SimMath tex={String.raw`d=r\cos\dfrac{\theta}{2}=${tex(an.apothem)}`} />
              </SimRow>
              <SimRow
                color={colors.segment}
                visible={view.show.segment}
                onToggle={() => toggleShow("segment")}
                toggleLabel="Tampilkan atau sembunyikan tembereng"
              >
                <SimMath
                  tex={String.raw`L_{\text{tembereng}}=\tfrac{1}{2}r^{2}(\theta-\sin\theta)=${tex(an.segment)}`}
                />
              </SimRow>
              <SimRow color={colors.radius}>
                <SimMath tex={`A${texPt(an.A[0], an.A[1])},\\ B${texPt(an.B[0], an.B[1])}`} />
              </SimRow>
              <SimRow color={colors.guide}>
                <SimMath tex={`M${texPt(an.M[0], an.M[1])}`} />
              </SimRow>
              <SimRow
                color={colors.angle}
                visible={view.show.angle}
                onToggle={() => toggleShow("angle")}
                toggleLabel="Tampilkan atau sembunyikan sudut pusat"
              >
                <SimMath tex={String.raw`\angle AOB=\theta=${tex(t, 1)}^{\circ}`} />
              </SimRow>
              <SimRow
                color={colors.tangent}
                visible={view.show.tangent}
                onToggle={() => toggleShow("tangent")}
                toggleLabel="Tampilkan atau sembunyikan garis singgung di A dan B"
              >
                <SimMath tex={`\\text{di }A:\\ ${tangentA}`} />
              </SimRow>
              <SimRow>
                <span>Gradien di A: {slopeText(an.slopeA)}</span>
              </SimRow>
              <SimRow color={colors.tangent}>
                <SimMath tex={`\\text{di }B:\\ ${tangentB}`} />
              </SimRow>
              <SimRow>
                <span>Gradien di B: {slopeText(an.slopeB)}</span>
              </SimRow>
              <SimRow>
                <SimMath
                  tex={String.raw`\text{sudut tali busur–singgung}=\dfrac{\theta}{2}=${tex(t / 2)}^{\circ}`}
                />
              </SimRow>
              {an.tValid ? (
                <>
                  <SimRow
                    color={colors.tangent}
                    visible={view.show.tpoint}
                    onToggle={() => toggleShow("tpoint")}
                    toggleLabel="Tampilkan atau sembunyikan titik T"
                  >
                    <SimMath tex={`T${texPt(an.T[0], an.T[1])}`} />
                  </SimRow>
                  <SimRow>
                    <SimMath
                      tex={String.raw`AT=BT=r\tan\dfrac{\theta}{2}=${tex(an.tLen)}`}
                    />
                  </SimRow>
                  <SimRow>
                    <SimMath tex={String.raw`OT=\dfrac{r}{\cos(\theta/2)}=${tex(an.ot)}`} />
                  </SimRow>
                  <SimRow>
                    <SimMath tex={String.raw`\angle ATB=180^{\circ}-\theta=${tex(180 - t)}^{\circ}`} />
                  </SimRow>
                </>
              ) : (
                <SimRow color={colors.tangent}>
                  <span>
                    Titik T:{" "}
                    {t === 180
                      ? "tidak ada (kedua singgung sejajar)"
                      : "terlalu jauh atau di sisi lain"}
                  </span>
                </SimRow>
              )}
            </ul>
          </SimSection>
        </>
      }
      notes={
        <>
          <p style={{ margin: 0 }}>
            <strong style={{ color: colors.arc }}>Busur dan juring: </strong>
            <SimMath
              tex={String.raw`s=\dfrac{\theta}{360^{\circ}}\cdot 2\pi r,\quad L=\dfrac{\theta}{360^{\circ}}\cdot \pi r^{2}`}
            />
            . Keduanya sebanding dengan sudut pusat <SimMath tex={String.raw`\theta`} />
            , jadi menggandakan <SimMath tex={String.raw`\theta`} /> menggandakan
            panjang busur dan luas juring.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: colors.chord }}>Tali busur dan tembereng: </strong>
            <SimMath tex={String.raw`c=2r\sin\dfrac{\theta}{2}`} /> dan{" "}
            <SimMath tex={String.raw`L_{\text{tembereng}}=\tfrac{1}{2}r^{2}(\theta-\sin\theta)`} />{" "}
            dengan <SimMath tex={String.raw`\theta`} /> dalam radian. Pada{" "}
            <SimMath tex={String.raw`\theta=180^{\circ}`} /> tali busur menjadi
            diameter.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: colors.tangent }}>Garis singgung: </strong>
            garis singgung di A dan B tegak lurus jari-jari dan bertemu di titik{" "}
            <SimMath tex="T" /> untuk <SimMath tex={String.raw`\theta<180^{\circ}`} />
            . Ketuk lingkaran untuk memindahkan titik B.
          </p>
        </>
      }
    />
  );
}

export default CircleSectorSimulation;
