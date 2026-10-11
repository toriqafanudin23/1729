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
import "./TrigonometrySimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi trigonometri: lingkaran satuan + grafik sin, cos, tan dalam SATU
   papan, sehingga grafik bisa memenuhi 100% layar (lingkaran di kiri,
   gelombang di kanan, dihubungkan garis putus-putus).
   Tema slate seperti QuadraticSimulationV3 (landing page 1729).
   Urutan desain: ponsel lanskap → desktop → ponsel potret.
   Layar penuh: grafik 100% layar, toolbar dan panel pengatur mengambang.
   Komponen ini mandiri (tanpa simulationBoard / GraphAppearanceControls). */

/* ───────── Tipe & konstanta ───────── */

type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type FnKey = "sin" | "cos" | "tan";
type Toggles = Record<FnKey, boolean>;
type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};
type Visible = { setAttribute: (attr: Record<string, unknown>) => unknown };

const initialAngle = 45;
const TAU = Math.PI * 2;
const CX = -2; // pusat lingkaran satuan di papan
const TAN_CLIP = 6; // |tan| lebih besar dari ini tidak digambar

/* Tampilan awal: lingkaran di kiri, gelombang 0…2π di kanan. */
const BOX = { cx: 1.8, cy: 0, w: 10.4, h: 4.8 };

const specialAngles = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330,
];

/* Warna grafik: dipakai juga oleh legenda, tombol, dan hasil di panel. */
const color = {
  sin: "#ea580c",
  cos: "#2563eb",
  tan: "#059669",
  theta: "#7c3aed",
  guide: "#94a3b8",
  ink: "#0f172a",
};

const FN_KEYS: FnKey[] = ["sin", "cos", "tan"];

/* ───────── Matematika & format ───────── */

const normalizeDegrees = (v: number) => ((Math.round(v) % 360) + 360) % 360;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function radiansLabel(deg: number) {
  if (deg === 0) return "0";
  const d = gcd(deg, 180);
  const num = deg / d;
  const den = 180 / d;
  const coef = num === 1 ? "" : String(num);
  return den === 1 ? `${coef}π` : `${coef}π/${den}`;
}

function fmt(v: number) {
  if (Math.abs(v) < 0.0005) return "0";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 })
    .format(v)
    .replace("-", "−");
}

const sanitizeAngle = (raw: unknown) =>
  typeof raw === "number" && Number.isFinite(raw)
    ? normalizeDegrees(raw)
    : initialAngle;

/* ───────── Komponen utama ───────── */

export function TrigonometrySimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `tg-board-${baseId}`;
  const sliderId = `tg-angle-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const pointRef = useRef<JXG.Point | null>(null);
  const groupsRef = useRef<Record<FnKey, Visible[]> | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);
  const fitRef = useRef<(() => void) | null>(null);
  const holdRef = useRef<{ delay?: number; repeat?: number }>({});

  const [stored, setStored] = useStoredSimulationState(
    "trigonometry.v3",
    initialAngle,
  );
  const angle = sanitizeAngle(stored);
  const angleRef = useRef(angle);
  const [angleText, setAngleText] = useState(String(angle));
  const angleFocused = useRef(false);
  const [show, setShow] = useState<Toggles>({ sin: true, cos: true, tan: true });
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  /* ───────── Sudut ───────── */

  const updateAngle = (value: number) => {
    const next = normalizeDegrees(value);
    angleRef.current = next;
    setStored(next);
    const r = (next * Math.PI) / 180;
    pointRef.current?.setPosition(JXG.COORDS_BY_USER, [
      CX + Math.cos(r),
      Math.sin(r),
    ]);
    boardRef.current?.update();
  };

  const stopHold = () => {
    window.clearTimeout(holdRef.current.delay);
    window.clearInterval(holdRef.current.repeat);
    holdRef.current = {};
  };
  useEffect(() => stopHold, []);

  // Tahan − / + untuk memutar sudut terus-menerus.
  const hold = (dir: 1 | -1) => ({
    type: "button" as const,
    className: "tg-step",
    "aria-label": `${dir === 1 ? "Tambah" : "Kurangi"} sudut 1 derajat`,
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stopHold();
      updateAngle(angleRef.current + dir);
      window.addEventListener("pointerup", stopHold, { once: true });
      window.addEventListener("pointercancel", stopHold, { once: true });
      holdRef.current.delay = window.setTimeout(() => {
        holdRef.current.repeat = window.setInterval(
          () => updateAngle(angleRef.current + dir),
          45,
        );
      }, 400);
    },
    onBlur: stopHold,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    // detail === 0 → aktivasi lewat keyboard
    onClick: (e: { detail: number }) => {
      if (e.detail === 0) updateAngle(angleRef.current + dir);
    },
  });

  const changeAngleText = (text: string) => {
    setAngleText(text);
    const cleaned = text.trim().replace("°", "");
    if (/^\d{1,3}$/.test(cleaned)) updateAngle(Number(cleaned));
  };

  // Kolom angka mengikuti sudut yang berubah dari slider atau lingkaran.
  useEffect(() => {
    if (!angleFocused.current) setAngleText(String(angle));
  }, [angle]);

  /* ───────── Tampilan ───────── */

  const zoomIn = () => boardRef.current?.zoomIn();
  const zoomOut = () => boardRef.current?.zoomOut();
  const center = () => fitRef.current?.();

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
    const rad = () => (angleRef.current * Math.PI) / 180;
    const px = () => CX + Math.cos(rad());
    const py = () => Math.sin(rad());
    const tanVal = (x: number) => {
      const t = Math.tan(x);
      return Math.abs(Math.cos(x)) < 0.02 || Math.abs(t) > TAN_CLIP ? Number.NaN : t;
    };

    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: [
        BOX.cx - BOX.w / 2,
        BOX.cy + BOX.h / 2,
        BOX.cx + BOX.w / 2,
        BOX.cy - BOX.h / 2,
      ],
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepAspectRatio: true,
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: { wheel: true, needShift: false, factorX: 1.15, factorY: 1.15, min: 0.25, max: 8 },
    });
    boardRef.current = board;

    /* sumbu & garis bantu */
    const axisLine = (p1: [number, number], p2: [number, number], strong: boolean) =>
      board.create("line", [p1, p2], {
        straightFirst: true,
        straightLast: true,
        strokeColor: "#94a3b8",
        strokeWidth: strong ? 1.25 : 1,
        highlight: false,
        fixed: true,
        point1: { visible: false },
        point2: { visible: false },
      });
    axisLine([0, 0], [1, 0], true); // sumbu mendatar (lingkaran dan gelombang)
    axisLine([CX, 0], [CX, 1], true); // sumbu tegak lingkaran
    axisLine([0, 0], [0, 1], true); // sumbu tegak gelombang

    ([1, -1] as const).forEach((y) => {
      board.create("segment", [[0, y], [TAU, y]], {
        strokeColor: "#94a3b8",
        strokeOpacity: 0.55,
        strokeWidth: 1,
        dash: 2,
        highlight: false,
        fixed: true,
        point1: { visible: false },
        point2: { visible: false },
      });
      board.create("text", [-0.12, y, y === 1 ? "1" : "−1"], {
        anchorX: "right",
        anchorY: "middle",
        fontSize: 10,
        strokeColor: "#64748b",
        fixed: true,
        highlight: false,
      });
    });

    const tickLabels: [number, string][] = [
      [Math.PI / 2, "π/2"],
      [Math.PI, "π"],
      [1.5 * Math.PI, "3π/2"],
      [TAU, "2π"],
    ];
    tickLabels.forEach(([x, label]) => {
      board.create("point", [x, 0], {
        name: "",
        withLabel: false,
        size: 1.5,
        fillColor: "#94a3b8",
        strokeColor: "#94a3b8",
        fixed: true,
        highlight: false,
      });
      board.create("text", [x, -0.14, label], {
        anchorX: "middle",
        anchorY: "top",
        fontSize: 10,
        strokeColor: "#64748b",
        fixed: true,
        highlight: false,
      });
    });

    /* lingkaran satuan */
    const unitCircle = board.create("circle", [[CX, 0], 1], {
      strokeColor: "#94a3b8",
      strokeWidth: 1.5,
      fillColor: "#e2e8f0",
      fillOpacity: 0.35,
      fixed: true,
      highlight: false,
    });

    // busur sudut θ
    const arc = board.create("curve", [[0], [0]], {
      strokeColor: color.theta,
      strokeWidth: 2,
      highlight: false,
    }) as unknown as DataCurve;
    arc.updateDataArray = function (this: DataCurve) {
      const r = rad();
      const steps = Math.max(2, Math.ceil(r / 0.1));
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = 0; i <= steps; i += 1) {
        const t = (r * i) / steps;
        xs.push(CX + 0.32 * Math.cos(t));
        ys.push(0.32 * Math.sin(t));
      }
      this.dataX = xs;
      this.dataY = ys;
    };

    /* grafik gelombang 0…2π */
    const sinCurve = board.create("functiongraph", [Math.sin, 0, TAU], {
      strokeColor: color.sin,
      strokeWidth: 2.75,
      highlight: false,
    });
    const cosCurve = board.create("functiongraph", [Math.cos, 0, TAU], {
      strokeColor: color.cos,
      strokeWidth: 2.75,
      highlight: false,
    });
    const tanCurve = board.create("functiongraph", [tanVal, 0, TAU], {
      strokeColor: color.tan,
      strokeWidth: 2.25,
      highlight: false,
    });

    // garis sudut θ pada gelombang
    board.create("line", [[() => rad(), 0], [() => rad(), 1]], {
      straightFirst: true,
      straightLast: true,
      strokeColor: color.guide,
      strokeWidth: 1,
      dash: 2,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    });

    // penghubung nilai sin θ: dari titik di lingkaran ke gelombang
    const link = board.create("segment", [[px, py], [() => rad(), py]], {
      strokeColor: color.sin,
      strokeWidth: 1.25,
      dash: 2,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    });

    // segmen di lingkaran: jari-jari, sin θ (tegak), cos θ (mendatar)
    board.create("segment", [[CX, 0], [px, py]], {
      strokeColor: color.ink,
      strokeWidth: 2,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    });
    board.create("segment", [[px, py], [px, 0]], {
      strokeColor: color.sin,
      strokeWidth: 3,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    });
    board.create("segment", [[CX, 0], [px, 0]], {
      strokeColor: color.cos,
      strokeWidth: 3,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    });

    // titik nilai pada gelombang
    const dot = (fn: (x: number) => number, fill: string) =>
      board.create("point", [() => rad(), () => fn(rad())], {
        name: "",
        withLabel: false,
        size: 4,
        fillColor: fill,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        fixed: true,
        highlight: false,
      });
    const sinDot = dot(Math.sin, color.sin);
    const cosDot = dot(Math.cos, color.cos);
    const tanDot = dot(tanVal, color.tan);

    groupsRef.current = {
      sin: [sinCurve, sinDot, link],
      cos: [cosCurve, cosDot],
      tan: [tanCurve, tanDot],
    };

    // titik yang diseret pada lingkaran
    const handle = board.create("glider", [px(), py(), unitCircle], {
      name: "",
      withLabel: false,
      size: 7,
      fillColor: color.theta,
      strokeColor: "#ffffff",
      strokeWidth: 2,
      showInfobox: false,
      highlight: false,
      snapToGrid: false,
    }) as JXG.Point;
    pointRef.current = handle;
    handle.on("drag", () => {
      const deg = (Math.atan2(handle.Y(), handle.X() - CX) * 180) / Math.PI;
      const next = normalizeDegrees(deg);
      angleRef.current = next;
      setStored(next);
      board.update();
    });

    /* Muat grafik ke ukuran kontainer: lingkaran + gelombang utuh terlihat. */
    const fit = () => {
      const el = hostRef.current;
      if (!el || el.clientWidth <= 0 || el.clientHeight <= 0) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const u = Math.min(w / BOX.w, h / BOX.h);
      const hw = w / 2 / u;
      const hh = h / 2 / u;
      board.setBoundingBox(
        [BOX.cx - hw, BOX.cy + hh, BOX.cx + hw, BOX.cy - hh],
        true,
      );
      board.update();
    };
    fitRef.current = fit;
    fit();

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
      fitRef.current = null;
      observer.disconnect();
      JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
      pointRef.current = null;
      groupsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // Tampilkan / sembunyikan grafik sin, cos, tan.
  useEffect(() => {
    const groups = groupsRef.current;
    if (!groups) return;
    FN_KEYS.forEach((key) =>
      groups[key].forEach((el) => el.setAttribute({ visible: show[key] })),
    );
    boardRef.current?.update();
  }, [show]);

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

  const radians = (angle * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const tanDefined = Math.abs(cosine) > 0.0005;
  const tangent = tanDefined ? Math.tan(radians) : null;
  const radLabel = radiansLabel(angle);

  // Isi dari kiri (0°) menuju sudut terpilih.
  const sliderStyle = {
    "--lo": "0%",
    "--hi": `${(angle / 359) * 100}%`,
    "--sc": color.theta,
  } as CSSProperties;

  return (
    <div ref={rootRef} className={`tg${isFs ? " is-fs" : ""}`}>
      <p className="tg-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>Miringkan ponsel ke mode lanskap agar grafik dan slider nyaman dipakai.</span>
      </p>

      <div className="tg-layout">
        {/* ───── Grafik ───── */}
        <section className="tg-graph" aria-label="Lingkaran satuan dan grafik trigonometri">
          <div className="tg-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="tg-board"
              aria-label="Lingkaran satuan di kiri dan grafik sinus, kosinus, tangen di kanan. Seret titik pada lingkaran untuk mengubah sudut. Seret area kosong untuk menggeser, gulir atau cubit untuk memperbesar."
            />

            <p className="tg-eq" aria-live="polite">
              <span className="tg-eq-fn">
                θ = {angle}° ({radLabel})
              </span>
              <span className="tg-eq-val">
                (<span style={{ color: color.cos }}>{fmt(cosine)}</span>;{" "}
                <span style={{ color: color.sin }}>{fmt(sine)}</span>)
              </span>
            </p>

            <div className="tg-tools" role="group" aria-label="Alat tampilan">
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
                  className="tg-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`tg-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="tg-legend" aria-label="Legenda grafik">
            <li><i style={{ borderColor: color.sin }} /> sin θ</li>
            <li><i style={{ borderColor: color.cos }} /> cos θ</li>
            <li><i style={{ borderColor: color.tan }} /> tan θ</li>
            <li><b style={{ background: color.theta }} /> sudut θ (seret)</li>
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`tg-panel-${baseId}`}
          className={`tg-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur sudut"
        >
          <div className="tg-chips" role="group" aria-label="Tampilkan grafik">
            {FN_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={show[key]}
                style={{ "--c": color[key] } as CSSProperties}
                onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="tg-slider" style={sliderStyle}>
            <label htmlFor={sliderId} aria-label="Sudut theta dalam derajat">
              θ
            </label>
            <button {...hold(-1)}>
              <Minus size={14} aria-hidden="true" />
            </button>
            <input
              id={sliderId}
              className="tg-range"
              type="range"
              min={0}
              max={359}
              step={1}
              value={angle}
              aria-valuetext={`${angle} derajat`}
              onChange={(e) => updateAngle(Number(e.currentTarget.value))}
            />
            <button {...hold(1)}>
              <Plus size={14} aria-hidden="true" />
            </button>
            <input
              className="tg-num"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              enterKeyHint="done"
              aria-label="Sudut dalam derajat (0 sampai 359)"
              value={angleText}
              onChange={(e) => changeAngleText(e.currentTarget.value)}
              onFocus={(e) => {
                angleFocused.current = true;
                e.currentTarget.select();
              }}
              onBlur={() => {
                angleFocused.current = false;
                setAngleText(String(angle));
              }}
            />
          </div>

          <div className="tg-group">
            <p className="tg-label">Sudut istimewa</p>
            <div className="tg-angles" role="group" aria-label="Sudut istimewa">
              {specialAngles.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={angle === a}
                  onClick={() => updateAngle(a)}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>

          <dl className="tg-readouts" aria-live="polite">
            <div>
              <dt>Sudut</dt>
              <dd style={{ color: color.theta }}>{`${angle}° (${radLabel})`}</dd>
            </div>
            <div>
              <dt>sin θ</dt>
              <dd style={{ color: color.sin }}>{fmt(sine)}</dd>
            </div>
            <div>
              <dt>cos θ</dt>
              <dd style={{ color: color.cos }}>{fmt(cosine)}</dd>
            </div>
            <div>
              <dt>tan θ</dt>
              <dd style={{ color: color.tan }}>
                {tangent === null ? "Tak terdefinisi" : fmt(tangent)}
              </dd>
            </div>
          </dl>

          <div className="tg-actions">
            <button type="button" className="tg-reset" onClick={() => updateAngle(initialAngle)}>
              <RotateCcw size={13} aria-hidden="true" />
              <span>Atur ulang</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TrigonometrySimulation;
