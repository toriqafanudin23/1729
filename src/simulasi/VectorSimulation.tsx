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
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import JXG from "jsxgraph";
import "../styles/jsxgraph.css";
import "./VectorSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi vektor — tema slate seperti landing page 1729 dan simulasi
   fungsi kuadrat. Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Layar penuh: grafik 100% layar, toolbar dan panel pengatur mengambang. */

/* ───────── Tipe ───────── */

type Vec = [number, number];
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type Projection = "a" | "b" | "off";
type Tab = "vector" | "view" | "result";
type CompKey = "a1" | "a2" | "b1" | "b2";
type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};

/* ───────── Konstanta ───────── */

const EPS = 1e-9;
const LIMIT = 9;
const ARC_STEPS = 48;
const initialBox: [number, number, number, number] = [-10, 10, 10, -10];

const defaultA: Vec = [5, 1];
const defaultB: Vec = [2, 4];

/* Warna grafik: dipakai juga oleh legenda dan hasil di panel. */
const color = {
  a: "#2563eb",
  b: "#ea580c",
  sum: "#059669",
  proj: "#7c3aed",
  angle: "#e11d48",
};

const comps: { key: CompKey; label: string; vec: "a" | "b"; i: 0 | 1 }[] = [
  { key: "a1", label: "a₁", vec: "a", i: 0 },
  { key: "a2", label: "a₂", vec: "a", i: 1 },
  { key: "b1", label: "b₁", vec: "b", i: 0 },
  { key: "b2", label: "b₂", vec: "b", i: 1 },
];

const presets: { label: string; a: Vec; b: Vec }[] = [
  { label: "Lancip", a: [5, 1], b: [2, 4] },
  { label: "Tegak lurus", a: [4, 2], b: [-2, 4] },
  { label: "Tumpul", a: [4, 1], b: [-4, 3] },
  { label: "Searah", a: [4, 2], b: [2, 1] },
  { label: "Berlawanan", a: [4, 2], b: [-2, -1] },
];

const tabs: { tab: Tab; label: string }[] = [
  { tab: "vector", label: "Vektor" },
  { tab: "view", label: "Tampilan" },
  { tab: "result", label: "Hasil" },
];

const projections: { mode: Projection; label: string }[] = [
  { mode: "a", label: "a pada b" },
  { mode: "b", label: "b pada a" },
  { mode: "off", label: "Mati" },
];

/* ───────── Matematika ───────── */

const toDegrees = (rad: number) => (rad * 180) / Math.PI;
const len = ([x, y]: Vec) => Math.hypot(x, y);
const dotOf = (u: Vec, v: Vec) => u[0] * v[0] + u[1] * v[1];
const clamp = (v: number, min = -LIMIT, max = LIMIT) =>
  Math.min(max, Math.max(min, v));

function clean(v: number) {
  const r = Math.round(v * 1000) / 1000;
  return Math.abs(r) < 1e-9 ? 0 : r;
}

/** Proyeksi `vec` pada `onto`; null bila `onto` vektor nol. */
function projectOnto(vec: Vec, onto: Vec) {
  const lo = len(onto);
  if (lo < EPS) return null;
  const dot = dotOf(vec, onto);
  const k = dot / (lo * lo);
  return { scalar: dot / lo, vector: [k * onto[0], k * onto[1]] as Vec, k };
}

function analyze(a: Vec, b: Vec) {
  const la = len(a);
  const lb = len(b);
  const dot = dotOf(a, b);
  const defined = la > EPS && lb > EPS;
  const cos = defined ? clamp(dot / (la * lb), -1, 1) : NaN;
  return {
    la,
    lb,
    dot,
    defined,
    angle: defined ? toDegrees(Math.acos(cos)) : NaN,
    sum: [a[0] + b[0], a[1] + b[1]] as Vec,
    diff: [a[0] - b[0], a[1] - b[1]] as Vec,
    aOnB: projectOnto(a, b),
    bOnA: projectOnto(b, a),
    cos,
  };
}

function relation(info: ReturnType<typeof analyze>) {
  if (!info.defined) return "Salah satu vektor adalah vektor nol.";
  if (Math.abs(info.dot) < 1e-9) return "a · b = 0: kedua vektor tegak lurus.";
  if (info.cos > 1 - 1e-9) return "a · b > 0: searah (θ = 0°).";
  if (info.cos < -1 + 1e-9) return "a · b < 0: berlawanan arah (θ = 180°).";
  return info.dot > 0
    ? "a · b > 0: sudut θ lancip."
    : "a · b < 0: sudut θ tumpul.";
}

/* ───────── Format ───────── */

const fmt = (v: number) =>
  !Number.isFinite(v)
    ? "—"
    : new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 })
        .format(clean(v))
        .replace("-", "−");

const coord = ([x, y]: Vec) => `(${fmt(x)}; ${fmt(y)})`;

/* ───────── Komponen ───────── */

export function VectorSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `vs-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const pointsRef = useRef<JXG.Point[]>([]);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);
  const holdRef = useRef<{ delay?: number; repeat?: number }>({});

  const [vecA, setVecA] = useStoredSimulationState<Vec>("vector.a", defaultA);
  const [vecB, setVecB] = useStoredSimulationState<Vec>("vector.b", defaultB);
  const [snap, setSnap] = useStoredSimulationState("vector.snap", true);
  const [showSum, setShowSum] = useStoredSimulationState("vector.show-sum", true);
  const [showAngle, setShowAngle] = useStoredSimulationState(
    "vector.show-angle",
    true,
  );
  const [projection, setProjection] = useStoredSimulationState<Projection>(
    "vector.projection",
    "a",
  );
  const [tab, setTab] = useState<Tab>("vector");
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Nilai terkini untuk dibaca papan JSXGraph tanpa membuat ulang papan.
  const vecRef = useRef<{ a: Vec; b: Vec }>({ a: vecA, b: vecB });
  const flagsRef = useRef({
    sum: showSum,
    angle: showAngle,
    proj: projection,
    snap,
  });

  const refresh = () => boardRef.current?.update();

  /* ───────── Vektor ───────── */

  const setVectors = (a: Vec, b: Vec) => {
    vecRef.current = { a, b };
    setVecA(a);
    setVecB(b);
    pointsRef.current[0]?.setPosition(JXG.COORDS_BY_USER, a);
    pointsRef.current[1]?.setPosition(JXG.COORDS_BY_USER, b);
    refresh();
  };

  const setComp = (key: CompKey, value: number) => {
    const { a, b } = vecRef.current;
    const nextA: Vec = [...a];
    const nextB: Vec = [...b];
    const v = clean(clamp(value));
    if (key === "a1") nextA[0] = v;
    else if (key === "a2") nextA[1] = v;
    else if (key === "b1") nextB[0] = v;
    else nextB[1] = v;
    setVectors(nextA, nextB);
  };

  const step = (key: CompKey, dir: 1 | -1) => {
    const { a, b } = vecRef.current;
    const cur = key === "a1" ? a[0] : key === "a2" ? a[1] : key === "b1" ? b[0] : b[1];
    setComp(key, cur + dir * (flagsRef.current.snap ? 1 : 0.1));
  };

  const stopHold = () => {
    window.clearTimeout(holdRef.current.delay);
    window.clearInterval(holdRef.current.repeat);
    holdRef.current = {};
  };

  // Tahan − / + untuk mengubah nilai terus-menerus.
  const startHold =
    (key: CompKey, dir: 1 | -1) => (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stopHold();
      step(key, dir);
      holdRef.current.delay = window.setTimeout(() => {
        holdRef.current.repeat = window.setInterval(() => step(key, dir), 80);
      }, 400);
    };

  useEffect(() => stopHold, []);

  /* ───────── Tampilan ───────── */

  const toggleSum = () => {
    const next = !flagsRef.current.sum;
    flagsRef.current.sum = next;
    setShowSum(next);
    refresh();
  };

  const toggleAngle = () => {
    const next = !flagsRef.current.angle;
    flagsRef.current.angle = next;
    setShowAngle(next);
    refresh();
  };

  const toggleSnap = () => {
    const next = !flagsRef.current.snap;
    flagsRef.current.snap = next;
    setSnap(next);
    pointsRef.current.forEach((p) => p.setAttribute({ snapToGrid: next }));
  };

  const pickProjection = (mode: Projection) => {
    flagsRef.current.proj = mode;
    setProjection(mode);
    refresh();
  };

  const zoomIn = () => boardRef.current?.zoomIn();
  const zoomOut = () => boardRef.current?.zoomOut();
  const center = () => boardRef.current?.setBoundingBox(initialBox, true);

  const reset = () => {
    flagsRef.current = { sum: true, angle: true, proj: "a", snap: true };
    setShowSum(true);
    setShowAngle(true);
    setProjection("a");
    setSnap(true);
    pointsRef.current.forEach((p) => p.setAttribute({ snapToGrid: true }));
    setVectors([...defaultA], [...defaultB]);
    center();
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

  /* ───────── Papan JSXGraph ───────── */

  useEffect(() => {
    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: initialBox,
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepAspectRatio: true,
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: { wheel: true, needShift: false, factorX: 1.15, factorY: 1.15, min: 0.25, max: 8 },
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

    /* Ujung vektor a dan b (bisa digeser) */
    const start = vecRef.current;
    const makePoint = (name: string, at: Vec, fill: string) =>
      board.create("point", [at[0], at[1]], {
        name,
        withLabel: true,
        size: 5,
        fillColor: fill,
        strokeColor: "#ffffff",
        strokeWidth: 2,
        snapToGrid: flagsRef.current.snap,
        snapSizeX: 1,
        snapSizeY: 1,
        highlight: false,
        label: { offset: [10, 10], fontSize: 14, strokeColor: fill },
      }) as JXG.Point;
    const pa = makePoint("a", start.a, color.a);
    const pb = makePoint("b", start.b, color.b);
    pointsRef.current = [pa, pb];

    const A = (): Vec => [pa.X(), pa.Y()];
    const B = (): Vec => [pb.X(), pb.Y()];

    /* Kurva dari daftar titik; NaN menyembunyikannya */
    const makeCurve = (
      stroke: string,
      width: number,
      dash: number,
      build: () => Vec[] | null,
    ) => {
      const curve = board.create("curve", [[0], [0]], {
        strokeColor: stroke,
        strokeWidth: width,
        dash,
        highlight: false,
        fixed: true,
      }) as unknown as DataCurve;
      curve.updateDataArray = () => {
        const pts = build();
        if (!pts || pts.length === 0 || pts.some((p) => !Number.isFinite(p[0]) || !Number.isFinite(p[1]))) {
          curve.dataX = [NaN];
          curve.dataY = [NaN];
          return;
        }
        curve.dataX = pts.map((p) => p[0]);
        curve.dataY = pts.map((p) => p[1]);
      };
      return curve;
    };

    /* Anak panah dari titik asal; ujung 1000 = disembunyikan di luar papan */
    const arrow = (
      x: () => number,
      y: () => number,
      stroke: string,
      width = 3.5,
      opacity = 1,
    ) =>
      board.create("segment", [[0, 0], [x, y]], {
        strokeColor: stroke,
        strokeWidth: width,
        strokeOpacity: opacity,
        lastArrow: { type: 2, size: 4 },
        highlight: false,
        fixed: true,
      });

    /* Penjumlahan: jajar genjang dan vektor a + b */
    const sumOn = () => flagsRef.current.sum;
    const sumPoint = (): Vec => [A()[0] + B()[0], A()[1] + B()[1]];

    makeCurve(color.sum, 1.75, 3, () => (sumOn() ? [A(), sumPoint(), B()] : null));
    const sumEnd = (i: 0 | 1) => () =>
      sumOn() && len(sumPoint()) > 1e-6 ? sumPoint()[i] : 1000;
    arrow(sumEnd(0), sumEnd(1), color.sum);
    board.create(
      "text",
      [
        () => (sumOn() ? sumPoint()[0] + 0.3 : 1000),
        () => (sumOn() ? sumPoint()[1] + 0.6 : 1000),
        "a + b",
      ],
      { fontSize: 13, strokeColor: color.sum, highlight: false, fixed: true },
    );

    /* Anak panah vektor a dan b */
    arrow(() => pa.X(), () => pa.Y(), color.a);
    arrow(() => pb.X(), () => pb.Y(), color.b);

    /* Proyeksi */
    const projInfo = () => {
      const mode = flagsRef.current.proj;
      if (mode === "off") return null;
      const vec = mode === "a" ? A() : B();
      const onto = mode === "a" ? B() : A();
      const res = projectOnto(vec, onto);
      return res ? { vec, onto, foot: res.vector, k: res.k } : null;
    };

    // garis tempat proyeksi jatuh
    makeCurve(color.proj, 1.25, 3, () => {
      const info = projInfo();
      if (!info) return null;
      const lo = len(info.onto);
      const u: Vec = [info.onto[0] / lo, info.onto[1] / lo];
      const reach = 2 * Math.max(...board.getBoundingBox().map((v) => Math.abs(v))) + 10;
      return [
        [-reach * u[0], -reach * u[1]],
        [reach * u[0], reach * u[1]],
      ];
    });

    // garis tegak lurus dari ujung vektor ke kaki proyeksi
    makeCurve(color.proj, 2, 2, () => {
      const info = projInfo();
      if (!info) return null;
      return Math.hypot(info.vec[0] - info.foot[0], info.vec[1] - info.foot[1]) > 1e-6
        ? [info.vec, info.foot]
        : null;
    });

    // tanda siku-siku di kaki proyeksi
    makeCurve(color.proj, 1.5, 0, () => {
      const info = projInfo();
      if (!info) return null;
      const lo = len(info.onto);
      const tip: Vec = [info.vec[0] - info.foot[0], info.vec[1] - info.foot[1]];
      const lt = len(tip);
      const lf = len(info.foot);
      if (lt < 1e-6 || lf < 1e-6) return null;
      const u: Vec = [info.onto[0] / lo, info.onto[1] / lo];
      const w: Vec = [tip[0] / lt, tip[1] / lt];
      const side = Math.min(0.5, lf * 0.4, lt * 0.4);
      const sign = info.k >= 0 ? -1 : 1;
      const d: Vec = [sign * u[0], sign * u[1]];
      const f = info.foot;
      return [
        [f[0] + side * d[0], f[1] + side * d[1]],
        [f[0] + side * (d[0] + w[0]), f[1] + side * (d[1] + w[1])],
        [f[0] + side * w[0], f[1] + side * w[1]],
      ];
    });

    // vektor proyeksi dari titik asal
    const footEnd = (i: 0 | 1) => () => {
      const info = projInfo();
      return info && len(info.foot) > 1e-6 ? info.foot[i] : 1000;
    };
    arrow(footEnd(0), footEnd(1), color.proj, 5, 0.85);

    /* Sudut antara a dan b */
    const arcInfo = () => {
      if (!flagsRef.current.angle) return null;
      const a = A();
      const b = B();
      const la = len(a);
      const lb = len(b);
      if (la < EPS || lb < EPS) return null;
      const startAngle = Math.atan2(a[1], a[0]);
      let delta = Math.atan2(b[1], b[0]) - startAngle;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta <= -Math.PI) delta += 2 * Math.PI;
      if (Math.abs(delta) < 1e-6) return null;
      return {
        startAngle,
        delta,
        radius: Math.min(1.5, Math.max(0.35, 0.45 * Math.min(la, lb))),
        mid: startAngle + delta / 2,
        degrees: toDegrees(Math.abs(delta)),
      };
    };

    makeCurve(color.angle, 2, 0, () => {
      const info = arcInfo();
      if (!info) return null;
      const pts: Vec[] = [];
      for (let i = 0; i <= ARC_STEPS; i += 1) {
        const t = info.startAngle + (info.delta * i) / ARC_STEPS;
        pts.push([info.radius * Math.cos(t), info.radius * Math.sin(t)]);
      }
      return pts;
    });

    const angleAt = (i: 0 | 1) => () => {
      const info = arcInfo();
      if (!info) return 1000;
      const r = info.radius + 0.9;
      return i === 0 ? r * Math.cos(info.mid) : r * Math.sin(info.mid);
    };
    board.create(
      "text",
      [
        angleAt(0),
        angleAt(1),
        () => {
          const info = arcInfo();
          return info ? `θ = ${fmt(info.degrees)}°` : "";
        },
      ],
      {
        fontSize: 12,
        strokeColor: color.angle,
        anchorX: "middle",
        anchorY: "middle",
        highlight: false,
        fixed: true,
      },
    );

    /* Sinkronisasi saat ujung vektor digeser (dibatasi ±LIMIT) */
    const readPoint = (p: JXG.Point): Vec => {
      const x = clamp(p.X());
      const y = clamp(p.Y());
      if (x !== p.X() || y !== p.Y()) p.setPosition(JXG.COORDS_BY_USER, [x, y]);
      return [clean(x), clean(y)];
    };
    const syncFromBoard = () => {
      const a = readPoint(pa);
      const b = readPoint(pb);
      vecRef.current = { a, b };
      setVecA(a);
      setVecB(b);
    };
    pa.on("drag", syncFromBoard);
    pb.on("drag", syncFromBoard);

    board.update();

    // Saat ukuran berubah (layar penuh / putar layar): pertahankan skala
    // dan titik tengah agar grafik tidak melompat.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

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

  const info = analyze(vecA, vecB);
  const caption = `a · b = ${fmt(info.dot)}${info.defined ? `  ·  θ = ${fmt(info.angle)}°` : ""}`;
  const projText = (p: ReturnType<typeof projectOnto>) =>
    p ? `${fmt(p.scalar)} → ${coord(p.vector)}` : "—";

  const stepProps = (key: CompKey, label: string, dir: 1 | -1, disabled: boolean) => ({
    type: "button" as const,
    className: "vs-step",
    disabled,
    "aria-label": `${dir === 1 ? "Tambah" : "Kurangi"} ${label}`,
    onPointerDown: startHold(key, dir),
    onPointerUp: stopHold,
    onPointerLeave: stopHold,
    onPointerCancel: stopHold,
    onBlur: stopHold,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    // detail === 0 → aktivasi lewat keyboard
    onClick: (e: { detail: number }) => {
      if (e.detail === 0) step(key, dir);
    },
  });

  const pane = (name: Tab) => `vs-pane${tab === name ? " is-on" : ""}`;

  return (
    <div ref={rootRef} className={`vs${isFs ? " is-fs" : ""}`}>
      <p className="vs-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>Miringkan ponsel ke mode lanskap agar grafik dan slider nyaman dipakai.</span>
      </p>

      <div className="vs-layout">
        {/* ───── Grafik ───── */}
        <section className="vs-graph" aria-label="Bidang koordinat vektor">
          <div className="vs-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="vs-board"
              aria-label="Bidang koordinat. Seret ujung vektor a (biru) atau b (oranye) untuk mengubahnya. Seret area kosong untuk menggeser, gulir atau cubit untuk memperbesar."
            />

            <p className="vs-eq" aria-live="polite">
              {caption}
            </p>

            <div className="vs-tools" role="group" aria-label="Alat tampilan">
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
                  className="vs-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`vs-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="vs-legend" aria-label="Legenda grafik">
            <li><i style={{ borderColor: color.a }} /> vektor a</li>
            <li><i style={{ borderColor: color.b }} /> vektor b</li>
            <li><i style={{ borderColor: color.sum }} /> a + b</li>
            <li><i className="dash" style={{ borderColor: color.proj }} /> proyeksi</li>
            <li><i style={{ borderColor: color.angle }} /> sudut θ</li>
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`vs-panel-${baseId}`}
          className={`vs-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur vektor"
        >
          <div className="vs-tabs" role="group" aria-label="Bagian pengatur">
            {tabs.map((t) => (
              <button
                key={t.tab}
                type="button"
                aria-pressed={tab === t.tab}
                onClick={() => setTab(t.tab)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Vektor */}
          <div className={pane("vector")}>
            <div className="vs-sliders">
              {comps.map(({ key, label, vec, i }) => {
                const value = (vec === "a" ? vecA : vecB)[i];
                const shown = clamp(value);
                const pct = ((shown + LIMIT) / (2 * LIMIT)) * 100;
                const id = `vs-${baseId}-${key}`;
                const style = {
                  "--lo": `${Math.min(50, pct)}%`,
                  "--hi": `${Math.max(50, pct)}%`,
                  "--sc": vec === "a" ? color.a : color.b,
                } as CSSProperties;
                return (
                  <div className="vs-slider" style={style} key={key}>
                    <label htmlFor={id}>{label}</label>
                    <button {...stepProps(key, label, -1, shown <= -LIMIT)}>
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <input
                      id={id}
                      className="vs-range"
                      type="range"
                      min={-LIMIT}
                      max={LIMIT}
                      step={snap ? 1 : 0.1}
                      value={shown}
                      aria-valuetext={`${label} sama dengan ${fmt(value)}`}
                      onChange={(e) => setComp(key, Number(e.currentTarget.value))}
                    />
                    <button {...stepProps(key, label, 1, shown >= LIMIT)}>
                      <Plus size={14} aria-hidden="true" />
                    </button>
                    <output htmlFor={id} aria-live="polite">
                      {fmt(value)}
                    </output>
                  </div>
                );
              })}
            </div>

            <p className="vs-label">Contoh posisi</p>
            <div className="vs-chips" role="group" aria-label="Contoh posisi dua vektor">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="vs-chip"
                  onClick={() => setVectors([...p.a], [...p.b])}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tampilan */}
          <div className={pane("view")}>
            <p className="vs-label">Tampilkan</p>
            <div className="vs-chips" role="group" aria-label="Elemen grafik">
              <button type="button" className="vs-chip" aria-pressed={showSum} onClick={toggleSum}>
                a + b
              </button>
              <button type="button" className="vs-chip" aria-pressed={showAngle} onClick={toggleAngle}>
                Sudut θ
              </button>
              <button type="button" className="vs-chip" aria-pressed={snap} onClick={toggleSnap}>
                Tempel ke grid
              </button>
            </div>

            <p className="vs-label">Proyeksi</p>
            <div className="vs-seg" role="group" aria-label="Arah proyeksi">
              {projections.map((p) => (
                <button
                  key={p.mode}
                  type="button"
                  aria-pressed={projection === p.mode}
                  onClick={() => pickProjection(p.mode)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button type="button" className="vs-reset" onClick={reset}>
              <RotateCcw size={13} aria-hidden="true" />
              <span>Atur ulang</span>
            </button>
          </div>

          {/* Hasil */}
          <div className={pane("result")}>
            <p className="vs-note" role="status">
              {relation(info)}
            </p>
            <dl className="vs-readouts" aria-live="polite">
              <div>
                <dt>a · b</dt>
                <dd>{fmt(info.dot)}</dd>
              </div>
              <div>
                <dt>Sudut θ</dt>
                <dd style={{ color: color.angle }}>{info.defined ? `${fmt(info.angle)}°` : "—"}</dd>
              </div>
              <div>
                <dt>|a|</dt>
                <dd style={{ color: color.a }}>{fmt(info.la)}</dd>
              </div>
              <div>
                <dt>|b|</dt>
                <dd style={{ color: color.b }}>{fmt(info.lb)}</dd>
              </div>
              <div>
                <dt>a + b</dt>
                <dd style={{ color: color.sum }}>{coord(info.sum)}</dd>
              </div>
              <div>
                <dt>a − b</dt>
                <dd>{coord(info.diff)}</dd>
              </div>
              <div className="wide">
                <dt>a pada b (skalar → vektor)</dt>
                <dd style={{ color: color.proj }}>{projText(info.aOnB)}</dd>
              </div>
              <div className="wide">
                <dt>b pada a (skalar → vektor)</dt>
                <dd style={{ color: color.proj }}>{projText(info.bOnA)}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}

export default VectorSimulation;
