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
import "./IntegralSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi integral: jumlah Riemann → integral tentu saat n membesar.
   Tema slate seperti QuadraticSimulationV3 (landing page 1729).
   Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Layar penuh: grafik 100% layar, toolbar dan panel pengatur mengambang.
   Komponen ini mandiri (tanpa calculusFunctions / simulationBoard). */

/* ───────── Tipe & konstanta ───────── */

type FnKey = "quad" | "cubic" | "sine" | "exp";
type Method = "left" | "right" | "mid";
type State = { fn: FnKey; a: number; b: number; n: number; method: Method };
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};

type Fn = {
  label: string;
  f: (x: number) => number;
  F: (x: number) => number; // antiturunan
};

const FUNCS: Record<FnKey, Fn> = {
  quad: { label: "x²/4", f: (x) => (x * x) / 4, F: (x) => (x * x * x) / 12 },
  cubic: {
    label: "x³/12 − x",
    f: (x) => (x * x * x) / 12 - x,
    F: (x) => (x * x * x * x) / 48 - (x * x) / 2,
  },
  sine: { label: "2 sin x", f: (x) => 2 * Math.sin(x), F: (x) => -2 * Math.cos(x) },
  exp: { label: "e^(x/3)", f: (x) => Math.exp(x / 3), F: (x) => 3 * Math.exp(x / 3) },
};
const FN_KEYS = Object.keys(FUNCS) as FnKey[];

const METHODS: { key: Method; label: string; full: string }[] = [
  { key: "left", label: "Kiri", full: "titik kiri" },
  { key: "right", label: "Kanan", full: "titik kanan" },
  { key: "mid", label: "Tengah", full: "titik tengah" },
];

const initialState: State = { fn: "quad", a: -3, b: 3, n: 6, method: "left" };
const initialBox: [number, number, number, number] = [-8, 8, 8, -8];
const A_MIN = -6;
const A_MAX = 5.5;
const B_MIN = -5.5;
const B_MAX = 6;
const MIN_WIDTH = 0.5; // jarak minimum b − a
const N_MIN = 1;
const N_MAX = 100;
const N_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100];
const N_STEP_MS = 700;

/* Warna grafik: dipakai juga oleh legenda, slider, dan hasil di panel. */
const color = {
  curve: "#2563eb",
  rect: "#ea580c",
  a: "#7c3aed",
  b: "#db2777",
  exact: "#059669",
  error: "#e11d48",
};

/* ───────── Matematika & format ───────── */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

const fmt = (v: number, digits = 2) => {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) < 0.5 * Math.pow(10, -digits)) return "0";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(v);
};

function riemann(s: State) {
  const { f } = FUNCS[s.fn];
  const dx = (s.b - s.a) / s.n;
  const heights: number[] = [];
  for (let i = 0; i < s.n; i += 1) {
    const left = s.a + i * dx;
    const sample =
      s.method === "left" ? left : s.method === "right" ? left + dx : left + dx / 2;
    heights.push(f(sample));
  }
  const sum = heights.reduce((t, v) => t + v, 0) * dx;
  return { dx, heights, sum };
}

/* Nilai tersimpan bisa usang/rusak: pastikan selalu valid. */
function sanitize(raw: unknown): State {
  const s = (raw ?? {}) as Partial<State>;
  const num = (v: unknown, fallback: number, lo: number, hi: number) =>
    typeof v === "number" && Number.isFinite(v) ? clamp(v, lo, hi) : fallback;
  const a = round1(num(s.a, initialState.a, A_MIN, A_MAX));
  let b = round1(num(s.b, initialState.b, B_MIN, B_MAX));
  if (b < a + MIN_WIDTH) b = round1(a + MIN_WIDTH);
  return {
    fn: FN_KEYS.includes(s.fn as FnKey) ? (s.fn as FnKey) : initialState.fn,
    a,
    b,
    n: Math.round(num(s.n, initialState.n, N_MIN, N_MAX)),
    method: METHODS.some((m) => m.key === s.method)
      ? (s.method as Method)
      : initialState.method,
  };
}

/* ───────── Slider satu baris:  a  −  ──●──  +  −3 ───────── */

function SliderField({
  label,
  name,
  tone,
  min,
  max,
  step,
  value,
  display,
  fillFromZero,
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
  /** true: isian dimulai dari titik 0; false: dari ujung kiri. */
  fillFromZero: boolean;
  onSlide: (value: number) => void;
  /** Mengembalikan false bila sudah mentok (tahan-ulang berhenti). */
  onNudge: (direction: 1 | -1) => boolean;
}) {
  const id = `ig-${useId().replace(/:/g, "")}`;
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
    className: "ig-step",
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

  const pct = ((clamp(value, min, max) - min) / (max - min)) * 100;
  const base = fillFromZero ? ((0 - min) / (max - min)) * 100 : 0;
  const style = {
    "--lo": `${Math.min(base, pct)}%`,
    "--hi": `${Math.max(base, pct)}%`,
    "--sc": tone,
  } as CSSProperties;

  return (
    <div className="ig-slider" style={style}>
      <label htmlFor={id} aria-label={name}>
        {label}
      </label>
      <button {...hold(-1)}>
        <Minus size={14} aria-hidden="true" />
      </button>
      <input
        id={id}
        className="ig-range"
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

export function IntegralSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `ig-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);
  const timerRef = useRef<number | null>(null);

  const [stored, setStored] = useStoredSimulationState(
    "integral.v3",
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
    if (p.a !== undefined) {
      next.a = round1(clamp(p.a, A_MIN, A_MAX));
      if (next.a > next.b - MIN_WIDTH) next.b = round1(next.a + MIN_WIDTH);
    }
    if (p.b !== undefined) {
      next.b = round1(clamp(p.b, B_MIN, B_MAX));
      if (next.b < next.a + MIN_WIDTH) next.a = round1(next.b - MIN_WIDTH);
    }
    if (p.n !== undefined) next.n = Math.round(clamp(p.n, N_MIN, N_MAX));
    stRef.current = next;
    setStored(next);
    boardRef.current?.update();
  };

  const stopAnim = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setAnimating(false);
  };

  // Animasi n: 1 → 100 persegi panjang
  const toggleAnim = () => {
    if (timerRef.current !== null) {
      stopAnim();
      return;
    }
    let i = 0;
    patch({ n: N_STEPS[0] });
    setAnimating(true);
    timerRef.current = window.setInterval(() => {
      i += 1;
      if (i >= N_STEPS.length) {
        stopAnim();
        return;
      }
      patch({ n: N_STEPS[i] });
    }, N_STEP_MS);
  };

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    },
    [],
  );

  const nudge = (key: "a" | "b" | "n", dir: 1 | -1) => {
    if (key === "n") stopAnim();
    const cur = stRef.current[key];
    const v = cur + dir * (key === "n" ? 1 : 0.1);
    patch(key === "a" ? { a: v } : key === "b" ? { b: v } : { n: v });
    return stRef.current[key] !== cur;
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

    // persegi panjang Riemann (isi)
    const fill = board.create("curve", [[0], [0]], {
      strokeWidth: 0,
      fillColor: color.rect,
      fillOpacity: 0.22,
      highlight: false,
    }) as unknown as DataCurve;
    fill.updateDataArray = function (this: DataCurve) {
      const s = S();
      const { dx, heights } = riemann(s);
      const xs: number[] = [s.a];
      const ys: number[] = [0];
      heights.forEach((h, i) => {
        xs.push(s.a + i * dx, s.a + (i + 1) * dx);
        ys.push(h, h);
      });
      xs.push(s.b);
      ys.push(0);
      this.dataX = xs;
      this.dataY = ys;
    };

    // persegi panjang Riemann (garis tepi)
    const outline = board.create("curve", [[0], [0]], {
      strokeColor: color.rect,
      strokeWidth: 1.4,
      highlight: false,
    }) as unknown as DataCurve;
    outline.updateDataArray = function (this: DataCurve) {
      const s = S();
      const { dx, heights } = riemann(s);
      const xs: number[] = [];
      const ys: number[] = [];
      heights.forEach((h, i) => {
        const x0 = s.a + i * dx;
        const x1 = x0 + dx;
        xs.push(x0, x0, x1, x1, x0, Number.NaN);
        ys.push(0, h, h, 0, 0, Number.NaN);
      });
      this.dataX = xs;
      this.dataY = ys;
    };

    // kurva f(x)
    board.create("functiongraph", [(x: number) => F().f(x)], {
      strokeColor: color.curve,
      strokeWidth: 3,
      highlight: false,
    });

    // batas a dan b: garis vertikal tak berhingga + titik di kurva
    const edge = (get: () => number, stroke: string) => {
      board.create("line", [[get, 0], [get, 1]], {
        straightFirst: true,
        straightLast: true,
        strokeColor: stroke,
        strokeWidth: 1.5,
        dash: 2,
        highlight: false,
        fixed: true,
        point1: { visible: false },
        point2: { visible: false },
      });
      board.create("point", [get, () => F().f(get())], {
        name: "",
        withLabel: false,
        size: 5,
        fillColor: stroke,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        fixed: true,
        highlight: false,
      });
    };
    edge(() => S().a, color.a);
    edge(() => S().b, color.b);

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
  const rm = riemann(st);
  const exact = fn.F(st.b) - fn.F(st.a);
  const error = rm.sum - exact;
  const methodName = METHODS.find((m) => m.key === st.method)?.full ?? "";

  return (
    <div ref={rootRef} className={`ig${isFs ? " is-fs" : ""}`}>
      <p className="ig-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>Miringkan ponsel ke mode lanskap agar grafik dan slider nyaman dipakai.</span>
      </p>

      <div className="ig-layout">
        {/* ───── Grafik ───── */}
        <section className="ig-graph" aria-label="Grafik jumlah Riemann">
          <div className="ig-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="ig-board"
              aria-label="Grafik fungsi f dengan n persegi panjang Riemann di antara batas a dan b. Ubah a, b, n, dan metode dengan penggeser. Seret untuk menggeser, gulir atau cubit untuk memperbesar."
            />

            <p className="ig-eq" aria-live="polite">
              <span className="ig-eq-fn">
                f(x) = {fn.label} · [{fmt(st.a, 1)}, {fmt(st.b, 1)}]
              </span>
              <span className="ig-eq-sum">
                <span style={{ color: color.rect }}>S<sub>n</sub> = {fmt(rm.sum, 3)}</span>
                {" → "}
                <span style={{ color: color.exact }}>∫ = {fmt(exact, 3)}</span>
              </span>
            </p>

            <div className="ig-tools" role="group" aria-label="Alat tampilan">
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
                className="ig-toggle"
                onClick={toggleAnim}
                aria-pressed={animating}
                aria-label={animating ? "Hentikan animasi" : "Animasikan n menuju 100"}
                title={animating ? "Hentikan animasi" : "Animasikan n → 100"}
              >
                {animating ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              </button>
              {isFs && (
                <button
                  type="button"
                  className="ig-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`ig-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="ig-legend" aria-label="Legenda grafik">
            <li><i style={{ borderColor: color.curve }} /> f(x)</li>
            <li><b className="sq" style={{ background: color.rect }} /> persegi panjang Riemann</li>
            <li><i className="dash" style={{ borderColor: color.a }} /> batas a</li>
            <li><i className="dash" style={{ borderColor: color.b }} /> batas b</li>
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`ig-panel-${baseId}`}
          className={`ig-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur jumlah Riemann"
        >
          <div className="ig-chips" role="radiogroup" aria-label="Pilih fungsi">
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

          <div className="ig-group">
            <p className="ig-label">Titik tinggi persegi panjang</p>
            <div className="ig-chips three" role="radiogroup" aria-label="Titik tinggi persegi panjang">
              {METHODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  role="radio"
                  aria-checked={st.method === m.key}
                  onClick={() => patch({ method: m.key })}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ig-sliders">
            <SliderField
              label="a"
              name="a (batas bawah)"
              tone={color.a}
              min={A_MIN}
              max={A_MAX}
              step={0.1}
              value={st.a}
              display={fmt(st.a, 1)}
              fillFromZero
              onSlide={(v) => patch({ a: v })}
              onNudge={(d) => nudge("a", d)}
            />
            <SliderField
              label="b"
              name="b (batas atas)"
              tone={color.b}
              min={B_MIN}
              max={B_MAX}
              step={0.1}
              value={st.b}
              display={fmt(st.b, 1)}
              fillFromZero
              onSlide={(v) => patch({ b: v })}
              onNudge={(d) => nudge("b", d)}
            />
            <SliderField
              label="n"
              name="n (banyak persegi panjang)"
              tone={color.rect}
              min={N_MIN}
              max={N_MAX}
              step={1}
              value={st.n}
              display={String(st.n)}
              fillFromZero={false}
              onSlide={(v) => {
                stopAnim();
                patch({ n: v });
              }}
              onNudge={(d) => nudge("n", d)}
            />
          </div>

          <dl className="ig-readouts" aria-live="polite">
            <div>
              <dt>Jumlah Riemann Sₙ</dt>
              <dd style={{ color: color.rect }}>{fmt(rm.sum, 4)}</dd>
            </div>
            <div>
              <dt>Nilai eksak ∫ f(x) dx</dt>
              <dd style={{ color: color.exact }}>{fmt(exact, 4)}</dd>
            </div>
            <div>
              <dt>Galat (Sₙ − eksak)</dt>
              <dd style={{ color: color.error }}>{fmt(error, 4)}</dd>
            </div>
            <div>
              <dt>Lebar Δx · {methodName}</dt>
              <dd>{fmt(rm.dx, 4)}</dd>
            </div>
          </dl>

          <div className="ig-actions">
            <button type="button" className="ig-primary" onClick={toggleAnim} aria-pressed={animating}>
              {animating ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
              <span>{animating ? "Hentikan" : "Animasikan n → 100"}</span>
            </button>
            <button type="button" className="ig-reset" onClick={reset}>
              <RotateCcw size={13} aria-hidden="true" />
              <span>Atur ulang</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default IntegralSimulation;
