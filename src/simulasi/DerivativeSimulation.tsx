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
import "./DerivativeSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi turunan: tali busur PQ → garis singgung di P saat h → 0.
   Tema slate seperti QuadraticSimulationV3 (landing page 1729).
   Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Layar penuh: grafik 100% layar, toolbar dan panel pengatur mengambang.
   Komponen ini mandiri (tanpa calculusFunctions / simulationBoard). */

/* ───────── Tipe & konstanta ───────── */

type FnKey = "quad" | "cubic" | "sine" | "exp";
type State = { fn: FnKey; x0: number; h: number };
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;

type Fn = {
  label: string; // tampil di chip dan di atas grafik
  dLabel: string;
  f: (x: number) => number;
  df: (x: number) => number;
};

const FUNCS: Record<FnKey, Fn> = {
  quad: {
    label: "x²/2",
    dLabel: "x",
    f: (x) => (x * x) / 2,
    df: (x) => x,
  },
  cubic: {
    label: "x³/6 − x",
    dLabel: "x²/2 − 1",
    f: (x) => (x * x * x) / 6 - x,
    df: (x) => (x * x) / 2 - 1,
  },
  sine: {
    label: "2 sin x",
    dLabel: "2 cos x",
    f: (x) => 2 * Math.sin(x),
    df: (x) => 2 * Math.cos(x),
  },
  exp: {
    label: "e^(x/2)",
    dLabel: "½ e^(x/2)",
    f: (x) => Math.exp(x / 2),
    df: (x) => Math.exp(x / 2) / 2,
  },
};
const FN_KEYS = Object.keys(FUNCS) as FnKey[];

const initialState: State = { fn: "quad", x0: 1, h: 2 };
const initialBox: [number, number, number, number] = [-8, 8, 8, -8];
const X0_LIMIT = 4;
const H_LIMIT = 3;
const HALF_LIFE_MS = 1200; // h dipangkas separuh setiap 1,2 detik

/* Warna grafik: dipakai juga oleh legenda, slider, dan hasil di panel. */
const color = {
  curve: "#2563eb",
  secant: "#ea580c",
  tangent: "#059669",
  p: "#ca8a04",
  q: "#e11d48",
  guide: "#94a3b8",
};

/* ───────── Matematika & format ───────── */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const round1 = (v: number) => Math.round(v * 10) / 10;
const round2 = (v: number) => Math.round(v * 100) / 100;

const fmt = (v: number, digits = 2) => {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) < 0.5 * Math.pow(10, -digits)) return "0";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(v);
};

const secantSlope = (s: State) =>
  Math.abs(s.h) < 1e-9
    ? Number.NaN
    : (FUNCS[s.fn].f(s.x0 + s.h) - FUNCS[s.fn].f(s.x0)) / s.h;

/* Nilai tersimpan bisa usang/rusak: pastikan selalu valid. */
function sanitize(raw: unknown): State {
  const s = (raw ?? {}) as Partial<State>;
  const num = (v: unknown, fallback: number, lim: number) =>
    typeof v === "number" && Number.isFinite(v) ? clamp(v, -lim, lim) : fallback;
  return {
    fn: FN_KEYS.includes(s.fn as FnKey) ? (s.fn as FnKey) : initialState.fn,
    x0: num(s.x0, initialState.x0, X0_LIMIT),
    h: num(s.h, initialState.h, H_LIMIT),
  };
}

/* ───────── Slider satu baris:  x₀  −  ──●──  +  1,0 ───────── */

function SliderField({
  label,
  name,
  tone,
  min,
  max,
  step,
  value,
  display,
  onSlide,
  onNudge,
}: {
  label: string;
  name: string;
  tone: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onSlide: (value: number) => void;
  /** Mengembalikan false bila sudah mentok (tahan-ulang berhenti). */
  onNudge: (direction: 1 | -1) => boolean;
}) {
  const id = `dv-${useId().replace(/:/g, "")}`;
  const nudgeRef = useRef(onNudge);
  nudgeRef.current = onNudge;
  const timers = useRef<{ delay?: number; repeat?: number }>({});

  const stop = () => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.repeat);
    timers.current = {};
  };
  useEffect(() => stop, []);

  // Tahan − / + untuk mengubah nilai terus-menerus.
  const hold = (dir: 1 | -1) => ({
    type: "button" as const,
    className: "dv-step",
    "aria-label": `${dir === 1 ? "Tambah" : "Kurangi"} ${name}`,
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stop();
      if (!nudgeRef.current(dir)) return;
      window.addEventListener("pointerup", stop, { once: true });
      window.addEventListener("pointercancel", stop, { once: true });
      timers.current.delay = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(() => {
          if (!nudgeRef.current(dir)) stop();
        }, 70);
      }, 400);
    },
    onBlur: stop,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    // detail === 0 → aktivasi lewat keyboard
    onClick: (e: { detail: number }) => {
      if (e.detail === 0) nudgeRef.current(dir);
    },
  });

  // Rentang simetris: isi dari titik 0 (tengah) menuju nilai.
  const pct = ((clamp(value, min, max) - min) / (max - min)) * 100;
  const zero = ((0 - min) / (max - min)) * 100;
  const style = {
    "--lo": `${Math.min(zero, pct)}%`,
    "--hi": `${Math.max(zero, pct)}%`,
    "--sc": tone,
  } as CSSProperties;

  return (
    <div className="dv-slider" style={style}>
      <label htmlFor={id} aria-label={name}>
        {label}
      </label>
      <button {...hold(-1)}>
        <Minus size={14} aria-hidden="true" />
      </button>
      <input
        id={id}
        className="dv-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        aria-valuetext={`${name} sama dengan ${display}`}
        onChange={(e) => onSlide(Number(e.currentTarget.value))}
      />
      <button {...hold(1)}>
        <Plus size={14} aria-hidden="true" />
      </button>
      <output htmlFor={id} aria-live="polite">
        {display}
      </output>
    </div>
  );
}

/* ───────── Komponen utama ───────── */

export function DerivativeSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `dv-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);
  const rafRef = useRef<number | null>(null);

  const [stored, setStored] = useStoredSimulationState(
    "derivative.v3",
    initialState,
  );
  const st = sanitize(stored);
  const stRef = useRef<State>(st);
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [animating, setAnimating] = useState(false);

  /* ───────── Parameter ───────── */

  const patch = (p: Partial<State>) => {
    const next: State = { ...stRef.current, ...p };
    if (p.x0 !== undefined) next.x0 = round1(clamp(p.x0, -X0_LIMIT, X0_LIMIT));
    if (p.h !== undefined) next.h = clamp(p.h, -H_LIMIT, H_LIMIT);
    stRef.current = next;
    setStored(next);
    boardRef.current?.update();
  };

  const stopAnim = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setAnimating(false);
  };

  // Animasi h → 0 (Q merapat ke P, tali busur berputar menjadi garis singgung)
  const toggleAnim = () => {
    if (rafRef.current !== null) {
      stopAnim();
      return;
    }
    const cur = stRef.current.h;
    if (Math.abs(cur) < 0.05) patch({ h: cur < 0 ? -3 : 3 });
    setAnimating(true);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const next = stRef.current.h * Math.pow(0.5, dt / HALF_LIFE_MS);
      if (Math.abs(next) < 0.0005) {
        patch({ h: next < 0 ? -0.0005 : 0.0005 });
        rafRef.current = null;
        setAnimating(false);
        return;
      }
      patch({ h: next });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const nudgeX0 = (dir: 1 | -1) => {
    const cur = stRef.current.x0;
    const next = clamp(round1(cur + dir * 0.1), -X0_LIMIT, X0_LIMIT);
    patch({ x0: next });
    return next !== cur;
  };

  const nudgeH = (dir: 1 | -1) => {
    stopAnim();
    const cur = stRef.current.h;
    const next = clamp(round2(cur + dir * 0.05), -H_LIMIT, H_LIMIT);
    patch({ h: next });
    return next !== cur;
  };

  const reset = () => {
    stopAnim();
    patch(initialState);
  };

  /* ───────── Tampilan ───────── */

  const zoomIn = () => boardRef.current?.zoomIn();
  const zoomOut = () => boardRef.current?.zoomOut();
  const center = () => boardRef.current?.setBoundingBox(initialBox, true);

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
    const S = () => stRef.current;
    const F = () => FUNCS[S().fn];

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

    // garis singgung di P (putus-putus, di bawah tali busur)
    board.create(
      "functiongraph",
      [(x: number) => F().f(S().x0) + F().df(S().x0) * (x - S().x0)],
      { strokeColor: color.tangent, strokeWidth: 2.25, dash: 2, highlight: false },
    );

    // tali busur PQ (hilang saat h = 0)
    board.create(
      "functiongraph",
      [
        (x: number) => {
          const m = secantSlope(S());
          return Number.isFinite(m) ? F().f(S().x0) + m * (x - S().x0) : Number.NaN;
        },
      ],
      { strokeColor: color.secant, strokeWidth: 2.5, highlight: false },
    );

    // kurva f(x)
    board.create("functiongraph", [(x: number) => F().f(x)], {
      strokeColor: color.curve,
      strokeWidth: 3,
      highlight: false,
    });

    // segmen bantu: Δx (mendatar) dan Δy (tegak)
    const guide = (
      x1: () => number,
      y1: () => number,
      x2: () => number,
      y2: () => number,
      stroke: string,
    ) =>
      board.create("segment", [[x1, y1], [x2, y2]], {
        strokeColor: stroke,
        strokeWidth: 1.5,
        dash: 2,
        highlight: false,
        fixed: true,
        point1: { visible: false },
        point2: { visible: false },
      });
    guide(() => S().x0, () => F().f(S().x0), () => S().x0 + S().h, () => F().f(S().x0), color.guide);
    guide(
      () => S().x0 + S().h,
      () => F().f(S().x0),
      () => S().x0 + S().h,
      () => F().f(S().x0 + S().h),
      color.q,
    );

    const dot = (x: () => number, y: () => number, fill: string, size = 5) =>
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

    dot(
      () => S().x0 + S().h,
      () => (Math.abs(S().h) < 1e-9 ? Number.NaN : F().f(S().x0 + S().h)),
      color.q,
      5,
    );
    dot(() => S().x0, () => F().f(S().x0), color.p, 6);

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
    };
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

  const fn = FUNCS[st.fn];
  const fx0 = fn.f(st.x0);
  const hZero = Math.abs(st.h) < 1e-9;
  const mSec = secantSlope(st);
  const mTan = fn.df(st.x0);
  const gap = Number.isFinite(mSec) ? Math.abs(mSec - mTan) : Number.NaN;
  const E = 0.001;
  const limLeft = (fn.f(st.x0 - E) - fx0) / -E;
  const limRight = (fn.f(st.x0 + E) - fx0) / E;
  const tangentEq = `y = ${fmt(mTan)}(x − ${fmt(st.x0)}) + ${fmt(fx0)}`;

  return (
    <div ref={rootRef} className={`dv${isFs ? " is-fs" : ""}`}>
      <p className="dv-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>Miringkan ponsel ke mode lanskap agar grafik dan slider nyaman dipakai.</span>
      </p>

      <div className="dv-layout">
        {/* ───── Grafik ───── */}
        <section className="dv-graph" aria-label="Grafik tali busur dan garis singgung">
          <div className="dv-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="dv-board"
              aria-label="Grafik fungsi f dengan tali busur PQ dan garis singgung di P. Ubah x0 dan h dengan penggeser. Seret untuk menggeser, gulir atau cubit untuk memperbesar."
            />

            <p className="dv-eq" aria-live="polite">
              <span className="dv-eq-fn">f(x) = {fn.label}</span>
              <span className="dv-eq-slope">
                <span style={{ color: color.secant }}>
                  m<sub>PQ</sub> = {hZero ? "?" : fmt(mSec, 3)}
                </span>
                {" → "}
                <span style={{ color: color.tangent }}>f′(x₀) = {fmt(mTan, 3)}</span>
              </span>
            </p>

            <div className="dv-tools" role="group" aria-label="Alat tampilan">
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
              <button
                type="button"
                className="dv-toggle"
                onClick={toggleAnim}
                aria-pressed={animating}
                aria-label={animating ? "Hentikan animasi" : "Animasikan h menuju 0"}
                title={animating ? "Hentikan animasi" : "Animasikan h → 0"}
              >
                {animating ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              </button>
              {isFs && (
                <button
                  type="button"
                  className="dv-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`dv-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="dv-legend" aria-label="Legenda grafik">
            <li><i style={{ borderColor: color.curve }} /> f(x)</li>
            <li><i style={{ borderColor: color.secant }} /> tali busur PQ</li>
            <li><i className="dash" style={{ borderColor: color.tangent }} /> garis singgung</li>
            <li><b style={{ background: color.p }} /> titik P</li>
            <li><b style={{ background: color.q }} /> titik Q</li>
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`dv-panel-${baseId}`}
          className={`dv-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur turunan"
        >
          <div className="dv-fns" role="radiogroup" aria-label="Pilih fungsi">
            {FN_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={st.fn === key}
                onClick={() => patch({ fn: key })}
              >
                {FUNCS[key].label}
              </button>
            ))}
          </div>

          <div className="dv-sliders">
            <SliderField
              label="x₀"
              name="x₀ (posisi titik P)"
              tone={color.p}
              min={-X0_LIMIT}
              max={X0_LIMIT}
              step={0.1}
              value={st.x0}
              display={fmt(st.x0, 1)}
              onSlide={(v) => patch({ x0: v })}
              onNudge={nudgeX0}
            />
            <SliderField
              label="h"
              name="h (jarak P ke Q)"
              tone={color.q}
              min={-H_LIMIT}
              max={H_LIMIT}
              step={0.01}
              value={st.h}
              display={fmt(st.h, 4)}
              onSlide={(v) => {
                stopAnim();
                patch({ h: v });
              }}
              onNudge={nudgeH}
            />
          </div>

          {hZero && (
            <p className="dv-warning" role="status">
              Saat h = 0, Q berimpit dengan P sehingga kemiringan tali busur 0/0 (tak
              terdefinisi). Turunan adalah limit saat h → 0.
            </p>
          )}

          <dl className="dv-readouts" aria-live="polite">
            <div>
              <dt>Titik P</dt>
              <dd style={{ color: color.p }}>{`(${fmt(st.x0, 1)}, ${fmt(fx0)})`}</dd>
            </div>
            <div>
              <dt>Titik Q</dt>
              <dd style={{ color: color.q }}>
                {hZero ? "—" : `(${fmt(st.x0 + st.h, 2)}, ${fmt(fn.f(st.x0 + st.h), 2)})`}
              </dd>
            </div>
            <div>
              <dt>m tali busur PQ</dt>
              <dd style={{ color: color.secant }}>{hZero ? "—" : fmt(mSec, 4)}</dd>
            </div>
            <div>
              <dt>f′(x₀) singgung</dt>
              <dd style={{ color: color.tangent }}>{fmt(mTan, 4)}</dd>
            </div>
            <div>
              <dt>Selisih</dt>
              <dd>{hZero ? "—" : fmt(gap, 4)}</dd>
            </div>
            <div>
              <dt>Limit kiri | kanan</dt>
              <dd>{`${fmt(limLeft, 3)} | ${fmt(limRight, 3)}`}</dd>
            </div>
            <div className="wide">
              <dt>Garis singgung · f′(x) = {fn.dLabel}</dt>
              <dd style={{ color: color.tangent }}>{tangentEq}</dd>
            </div>
          </dl>

          <div className="dv-actions">
            <button type="button" className="dv-primary" onClick={toggleAnim} aria-pressed={animating}>
              {animating ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
              <span>{animating ? "Hentikan" : "Animasikan h → 0"}</span>
            </button>
            <button type="button" className="dv-reset" onClick={reset}>
              <RotateCcw size={13} aria-hidden="true" />
              <span>Atur ulang</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DerivativeSimulation;
