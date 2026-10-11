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
import "./QuadraticSimulationV3.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi fungsi kuadrat — tema slate seperti landing page 1729.
   Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Layar penuh: grafik 100% layar, toolbar dan panel input mengambang. */

type Params = { a: number; b: number; c: number };
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;

const initialParams: Params = { a: 1, b: -2, c: -3 };
const initialBox: [number, number, number, number] = [-9, 9, 9, -9];

const sliders = [
  { key: "a", min: -5, max: 5 },
  { key: "b", min: -10, max: 10 },
  { key: "c", min: -10, max: 10 },
] as const;

/* Warna grafik: dipakai juga oleh legenda dan hasil di panel. */
const color = {
  curve: "#2563eb",
  ref: "#94a3b8",
  axis: "#ea580c",
  vertex: "#ca8a04",
  root: "#e11d48",
  yint: "#059669",
  a: "#7c3aed",
};

const round1 = (v: number) => Math.round(v * 10) / 10;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const fmt = (v: number) =>
  Math.abs(v) < 0.0005
    ? "0"
    : new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(v);

function equationLabel({ a, b, c }: Params) {
  const parts: string[] = [];
  const push = (coef: number, term: string) => {
    if (coef === 0) return;
    const abs = Math.abs(coef);
    const body = term !== "" && abs === 1 ? term : `${fmt(abs)}${term}`;
    if (parts.length === 0) parts.push(coef < 0 ? `−${body}` : body);
    else parts.push(coef < 0 ? `− ${body}` : `+ ${body}`);
  };
  push(a, "x²");
  push(b, "x");
  push(c, "");
  return `y = ${parts.length ? parts.join(" ") : "0"}`;
}

export function QuadraticSimulationV3() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `qs-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);
  const holdRef = useRef<{ delay?: number; repeat?: number }>({});

  const [params, setParams] = useStoredSimulationState(
    "quadratic.params",
    initialParams,
  );
  const paramsRef = useRef<Params>(params);
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  /* ───────── Parameter ───────── */

  const setParam = (key: keyof Params, value: number) => {
    const next = { ...paramsRef.current, [key]: round1(value) };
    paramsRef.current = next;
    setParams(next);
    boardRef.current?.update();
  };

  const step = (key: keyof Params, dir: 1 | -1) => {
    const cfg = sliders.find((s) => s.key === key);
    if (!cfg) return;
    setParam(key, clamp(paramsRef.current[key] + dir * 0.1, cfg.min, cfg.max));
  };

  const stopHold = () => {
    window.clearTimeout(holdRef.current.delay);
    window.clearInterval(holdRef.current.repeat);
    holdRef.current = {};
  };

  // Tahan − / + untuk mengubah nilai terus-menerus.
  const startHold =
    (key: keyof Params, dir: 1 | -1) =>
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stopHold();
      step(key, dir);
      holdRef.current.delay = window.setTimeout(() => {
        holdRef.current.repeat = window.setInterval(() => step(key, dir), 60);
      }, 400);
    };

  useEffect(() => stopHold, []);

  const reset = () => {
    paramsRef.current = initialParams;
    setParams(initialParams);
    boardRef.current?.update();
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
    const p = () => paramsRef.current;
    const f = (x: number) => p().a * x * x + p().b * x + p().c;
    const vx = () => (p().a === 0 ? NaN : -p().b / (2 * p().a));
    const root = (sign: number) => () => {
      const d = p().b * p().b - 4 * p().a * p().c;
      return p().a === 0 || d < 0 ? NaN : (-p().b + sign * Math.sqrt(d)) / (2 * p().a);
    };

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

    // pembanding y = x²
    board.create("functiongraph", [(x: number) => x * x], {
      strokeColor: color.ref,
      strokeWidth: 1.75,
      dash: 3,
      highlight: false,
    });

    // sumbu simetri
    board.create("line", [[() => vx(), 0], [() => vx(), 1]], {
      straightFirst: true,
      straightLast: true,
      strokeColor: color.axis,
      strokeWidth: 1.5,
      dash: 2,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    });

    // kurva utama
    board.create("functiongraph", [f], {
      strokeColor: color.curve,
      strokeWidth: 3,
      highlight: false,
    });

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

    dot(() => 0, () => p().c, color.yint);
    dot(root(1), () => 0, color.root);
    dot(root(-1), () => 0, color.root);
    dot(() => vx(), () => (p().a === 0 ? NaN : f(vx())), color.vertex, 6);

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

  const { a, b, c } = params;
  const quad = a !== 0;
  const d = b * b - 4 * a * c;
  const px = quad ? -b / (2 * a) : null;
  const py = quad && px !== null ? a * px * px + b * px + c : null;

  let roots = "—";
  if (quad) {
    if (d > 0) {
      const r = [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)].sort(
        (m, n) => m - n,
      );
      roots = `${fmt(r[0])} dan ${fmt(r[1])}`;
    } else if (d === 0) roots = fmt(-b / (2 * a));
    else roots = "Tidak ada";
  }

  const stepProps = (key: keyof Params, dir: 1 | -1, disabled: boolean) => ({
    type: "button" as const,
    className: "qs-step",
    disabled,
    "aria-label": `${dir === 1 ? "Tambah" : "Kurangi"} ${key} 0,1`,
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

  return (
    <div ref={rootRef} className={`qs${isFs ? " is-fs" : ""}`}>
      <p className="qs-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>Miringkan ponsel ke mode lanskap agar grafik dan slider nyaman dipakai.</span>
      </p>

      <div className="qs-layout">
        {/* ───── Grafik ───── */}
        <section className="qs-graph" aria-label="Grafik fungsi kuadrat">
          <div className="qs-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="qs-board"
              aria-label="Grafik y = ax² + bx + c. Seret untuk menggeser, gulir atau cubit untuk memperbesar."
            />

            <p className="qs-eq" aria-live="polite">
              {equationLabel(params)}
            </p>

            <div className="qs-tools" role="group" aria-label="Alat tampilan">
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
                  className="qs-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`qs-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="qs-legend" aria-label="Legenda grafik">
            <li><i style={{ borderColor: color.curve }} /> kurva</li>
            <li><i className="dash" style={{ borderColor: color.ref }} /> y = x²</li>
            <li><i className="dash" style={{ borderColor: color.axis }} /> sumbu simetri</li>
            <li><b style={{ background: color.vertex }} /> puncak</li>
            <li><b style={{ background: color.root }} /> akar</li>
            <li><b style={{ background: color.yint }} /> potong sumbu y</li>
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`qs-panel-${baseId}`}
          className={`qs-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur koefisien"
        >
          <div className="qs-sliders">
            {sliders.map(({ key, min, max }) => {
              const value = params[key];
              const id = `qs-${baseId}-${key}`;
              const style = {
                "--fill": `${((value - min) / (max - min)) * 100}%`,
                "--sc": key === "a" ? color.a : key === "b" ? color.axis : color.yint,
              } as CSSProperties;
              return (
                <div className="qs-slider" style={style} key={key}>
                  <label htmlFor={id}>{key}</label>
                  <button {...stepProps(key, -1, value <= min)}>
                    <Minus size={14} aria-hidden="true" />
                  </button>
                  <input
                    id={id}
                    className="qs-range"
                    type="range"
                    min={min}
                    max={max}
                    step="0.1"
                    value={value}
                    aria-valuetext={`${key} sama dengan ${fmt(value)}`}
                    onChange={(e) => setParam(key, Number(e.currentTarget.value))}
                  />
                  <button {...stepProps(key, 1, value >= max)}>
                    <Plus size={14} aria-hidden="true" />
                  </button>
                  <output htmlFor={id} aria-live="polite">{fmt(value)}</output>
                </div>
              );
            })}
          </div>

          {!quad && (
            <p className="qs-warning" role="status">
              Saat a = 0 grafik berupa garis lurus. Geser a menjauhi 0 untuk melihat parabola.
            </p>
          )}

          <dl className="qs-readouts" aria-live="polite">
            <div>
              <dt>Arah</dt>
              <dd style={{ color: color.a }}>{!quad ? "—" : a > 0 ? "Buka ke atas" : "Buka ke bawah"}</dd>
            </div>
            <div>
              <dt>Puncak</dt>
              <dd style={{ color: color.vertex }}>
                {px === null || py === null ? "—" : `(${fmt(px)}, ${fmt(py)})`}
              </dd>
            </div>
            <div>
              <dt>Sumbu simetri</dt>
              <dd style={{ color: color.axis }}>{px === null ? "—" : `x = ${fmt(px)}`}</dd>
            </div>
            <div>
              <dt>Potong sumbu y</dt>
              <dd style={{ color: color.yint }}>{`(0, ${fmt(c)})`}</dd>
            </div>
            <div>
              <dt>Diskriminan</dt>
              <dd>{quad ? fmt(d) : "—"}</dd>
            </div>
            <div>
              <dt>Akar</dt>
              <dd style={{ color: color.root }}>{roots}</dd>
            </div>
          </dl>

          <button type="button" className="qs-reset" onClick={reset}>
            <RotateCcw size={13} aria-hidden="true" />
            <span>Atur ulang</span>
          </button>
        </section>
      </div>
    </div>
  );
}

export default QuadraticSimulationV3;