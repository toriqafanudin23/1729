import { useEffect, useId, useRef } from "react";
import type JXG from "jsxgraph";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import "./LandingPage.css";

/* ------------------------------------------------------------------ *
 *  Tautan: ganti sesuai route di aplikasi 1729 kamu.
 * ------------------------------------------------------------------ */
const HREF = {
  start: "/simulasi",
  integral: "/simulasi/integral",
  trigonometri: "/simulasi/trigonometri",
  conic: "/simulasi/irisan-kerucut",
  quadratic: "/simulasi/fungsi-kuadrat",
  derivative: "/simulasi/turunan",
  vector: "/simulasi/vektor",
  tangent: "/simulasi/garis-singgung-dua-lingkaran",
  latihan: "/latihan",
};

/* ------------------------------------------------------------------ *
 *  Palet slate (dipakai juga oleh JSXGraph)
 * ------------------------------------------------------------------ */
const C = {
  ink: "#0f172a", // slate-900
  strong: "#334155", // slate-700
  mid: "#64748b", // slate-500
  soft: "#94a3b8", // slate-400
  line: "#cbd5e1", // slate-300
  grid: "#e2e8f0", // slate-200
  wash: "#f1f5f9", // slate-100
};

/* ------------------------------------------------------------------ *
 *  Helper JSXGraph
 * ------------------------------------------------------------------ */
type BBox = [number, number, number, number];
type Out = (text: string) => void;
type Frame = (seconds: number) => void;
type Setup = (board: JXG.Board, out: Out) => Frame;

// Pembungkus tipis agar atribut JSXGraph tidak merepotkan TypeScript.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mk = (board: JXG.Board, type: string, parents: unknown[], attrs: Record<string, unknown> = {}): any =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (board as any).create(type, parents, attrs);

const still = { highlight: false, fixed: true, showInfobox: false };

const TAU = Math.PI * 2;
const STILL_TIME = 2; // detik yang ditampilkan bila pengguna memilih "kurangi gerakan"

const num = (v: number, d = 2) => {
  const x = Math.abs(v) < 0.5 * 10 ** -d ? 0 : v;
  return x.toFixed(d).replace("-", "−");
};
const pad = (s: string, w: number) => s.padStart(w, " ");

function backdrop(board: JXG.Board, withGrid = true) {
  if (withGrid) {
    mk(board, "grid", [], { strokeColor: C.grid, strokeWidth: 1, majorStep: 1, minorElements: 0, highlight: false });
  }
  const ticks = {
    strokeColor: C.soft,
    drawZero: false,
    majorHeight: 7,
    minorTicks: 0,
    label: { fontSize: 11, strokeColor: C.mid },
  };
  mk(board, "axis", [[0, 0], [1, 0]], { strokeColor: C.soft, strokeWidth: 1.25, highlight: false, ticks });
  mk(board, "axis", [[0, 0], [0, 1]], { strokeColor: C.soft, strokeWidth: 1.25, highlight: false, ticks });
}

const dot = (board: JXG.Board, x: number | (() => number), y: number | (() => number), filled = true) =>
  mk(board, "point", [x, y], {
    ...still,
    withLabel: false,
    size: 5,
    fillColor: filled ? C.ink : "#fff",
    strokeColor: filled ? "#fff" : C.ink,
    strokeWidth: 2,
  });

/* ------------------------------------------------------------------ *
 *  Papan 2 — Integral Riemann: persegi panjang makin banyak
 * ------------------------------------------------------------------ */
const BBOX_RIEMANN: BBox = [-1.5, 5.2, 7.5, -0.8];

const setupRiemann: Setup = (board, out) => {
  let n = 2;
  const f = (x: number) => -0.25 * (x - 3) ** 2 + 4;
  const exact = 19.5; // ∫₀⁶ f(x) dx

  backdrop(board);
  mk(board, "riemannsum", [f, () => n, "left", 0, 6], {
    ...still,
    fillColor: C.line,
    fillOpacity: 0.55,
    strokeColor: C.mid,
    strokeWidth: 1,
  });
  mk(board, "functiongraph", [f, -0.5, 6.5], { ...still, strokeColor: C.ink, strokeWidth: 2.75 });

  return (s) => {
    const k = 0.5 - 0.5 * Math.cos(s * 0.55); // 0 → 1 → 0
    n = Math.max(2, Math.round(2 + 38 * k));
    const w = 6 / n;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += f(i * w) * w;
    out(`n = ${pad(String(n), 2)}   Σ = ${pad(num(sum), 5)}   ∫ = ${num(exact)}`);
  };
};

/* ------------------------------------------------------------------ *
 *  Papan 3 — Trigonometri: lingkaran satuan melahirkan gelombang sinus
 * ------------------------------------------------------------------ */
const BBOX_TRIG: BBox = [-4.9, 2.55, 5.3, -2.55];

const setupTrig: Setup = (board, out) => {
  const cx = -3.4;
  const r = 1;
  const x0 = -1.6; // awal sumbu θ untuk gelombang
  let th = 0;

  const seg = (p: unknown[], q: unknown[], attrs: Record<string, unknown>) =>
    mk(board, "segment", [p, q], { ...still, ...attrs });

  const axisLine = { strokeColor: C.line, strokeWidth: 1.25 };
  seg([-4.9, 0], [5.3, 0], axisLine);
  seg([cx, -1.7], [cx, 1.7], axisLine);
  seg([x0, -1.7], [x0, 1.7], axisLine);

  mk(board, "circle", [[cx, 0], r], {
    ...still,
    strokeColor: C.ink,
    strokeWidth: 2,
    fillColor: "none",
    center: { visible: false },
  });

  const wave = (max: number | (() => number), attrs: Record<string, unknown>) =>
    mk(board, "curve", [(u: number) => x0 + r * u, (u: number) => r * Math.sin(u), 0, max], { ...still, ...attrs });
  wave(TAU, { strokeColor: C.line, strokeWidth: 2 });
  wave(() => th, { strokeColor: C.ink, strokeWidth: 2.75 });

  const tick = (x: number, label: string) =>
    mk(board, "text", [x, -0.28, label], {
      ...still,
      anchorX: "middle",
      anchorY: "top",
      fontSize: 12,
      strokeColor: C.mid,
    });
  tick(x0 + Math.PI * r, "π");
  tick(x0 + TAU * r, "2π");

  const px = () => cx + r * Math.cos(th);
  const py = () => r * Math.sin(th);

  seg([cx, 0], [px, py], { strokeColor: C.mid, strokeWidth: 1.75 }); // jari-jari
  seg([px, 0], [px, py], { strokeColor: C.ink, strokeWidth: 2.5 }); // sin θ
  seg([px, py], [() => x0 + r * th, py], { strokeColor: C.soft, strokeWidth: 1.5, dash: 2 }); // penghubung

  dot(board, px, py);
  dot(board, () => x0 + r * th, py, false);

  return (s) => {
    th = (s * 0.75) % TAU;
    const deg = (th * 180) / Math.PI;
    out(`θ = ${pad(deg.toFixed(0), 3)}°   sin = ${pad(num(Math.sin(th)), 5)}   cos = ${pad(num(Math.cos(th)), 5)}`);
  };
};

/* ------------------------------------------------------------------ *
 *  Papan 4 — Irisan kerucut: jumlah jarak ke dua fokus selalu tetap
 * ------------------------------------------------------------------ */
const BBOX_CONIC: BBox = [-6.4, 4.2, 6.4, -4.2];

const setupConic: Setup = (board, out) => {
  const A = 5;
  const B = 3;
  const c = 4; // c² = a² − b²
  let th = 0;

  backdrop(board);
  mk(board, "curve", [(t: number) => A * Math.cos(t), (t: number) => B * Math.sin(t), 0, TAU], {
    ...still,
    strokeColor: C.ink,
    strokeWidth: 2.75,
  });

  const focus = (x: number, name: string) =>
    mk(board, "point", [x, 0], {
      ...still,
      name,
      size: 4,
      fillColor: "#fff",
      strokeColor: C.ink,
      strokeWidth: 2,
      label: { fontSize: 13, strokeColor: C.strong, offset: [-6, -18] },
    });
  const F1 = focus(-c, "F₁");
  const F2 = focus(c, "F₂");

  const px = () => A * Math.cos(th);
  const py = () => B * Math.sin(th);

  mk(board, "segment", [F1, [px, py]], { ...still, strokeColor: C.mid, strokeWidth: 1.75 });
  mk(board, "segment", [F2, [px, py]], { ...still, strokeColor: C.soft, strokeWidth: 1.75, dash: 2 });
  dot(board, px, py);

  return (s) => {
    th = s * 0.7;
    const d1 = Math.hypot(px() + c, py());
    const d2 = Math.hypot(px() - c, py());
    out(`PF₁ = ${num(d1)}   PF₂ = ${num(d2)}   Σ = ${num(d1 + d2)}`);
  };
};

/* ------------------------------------------------------------------ *
 *  Komponen Board: satu papan JSXGraph tanpa teks pendamping.
 *  Animasi hanya berjalan saat papan terlihat di layar, dan berhenti
 *  bila pengguna memilih "kurangi gerakan" di sistemnya.
 * ------------------------------------------------------------------ */
interface BoardProps {
  setup: Setup;
  bbox: BBox;
  className?: string;
}

function Board({ setup, bbox, className = "" }: BoardProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const domId = `jxg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ratio = (bbox[2] - bbox[0]) / (bbox[1] - bbox[3]);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    let disposed = false;
    let board: JXG.Board | undefined;
    let freeBoard: ((board: JXG.Board) => void) | undefined;
    let raf = 0;
    let loadObserver: IntersectionObserver | undefined;
    let animationObserver: IntersectionObserver | undefined;

    const initialize = async () => {
      const [{ default: JXG }] = await Promise.all([
        import("jsxgraph"),
        import("../styles/jsxgraph.css"),
      ]);
      if (disposed) return;
      freeBoard = (activeBoard) => JXG.JSXGraph.freeBoard(activeBoard);
      board = JXG.JSXGraph.initBoard(domId, {
        boundingbox: bbox,
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        showInfobox: false,
        pan: { enabled: false },
        zoom: { enabled: false },
        drag: { enabled: false },
        resize: { enabled: true, throttle: 60 },
      } as never);

      const out: Out = () => {}; // keterangan angka sengaja tidak ditampilkan
      const frame = setup(board, out);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let clock = reduce ? STILL_TIME : 0;
      frame(clock);
      board.update();
      if (reduce) return;

      let last = 0;
      const tick = (now: number) => {
        if (last) clock += Math.min((now - last) / 1000, 0.1);
        last = now;
        frame(clock);
        board?.update();
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      };
      animationObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!raf) raf = requestAnimationFrame(tick);
          } else stop();
        },
        { threshold: 0.15 },
      );
      animationObserver.observe(host);
    };

    loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      loadObserver?.disconnect();
      void initialize().catch(() => {
        if (!disposed) host.setAttribute("data-load-error", "true");
      });
    }, { rootMargin: "120px" });
    loadObserver.observe(host);

    return () => {
      disposed = true;
      loadObserver?.disconnect();
      animationObserver?.disconnect();
      cancelAnimationFrame(raf);
      if (board) freeBoard?.(board);
    };
  }, [domId, bbox, setup]);

  return (
    <figure className={`lp-board ${className}`}>
      <div id={domId} ref={canvasRef} className="lp-board__canvas" style={{ aspectRatio: String(ratio) }} />
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 *  Animasi hero: permukaan gelombang 3D z = f(x, y, t) berupa kawat
 *  jaring yang berputar pelan. Puncak gelombang berwarna teal, lembah
 *  berwarna slate. Canvas 2D, tanpa teks, tepinya memudar ke latar.
 * ------------------------------------------------------------------ */
const RGB = {
  soft: "148, 163, 184",
  mid: "100, 116, 139",
  ink: "15, 23, 42",
  teal: "15, 118, 110",
};
const BUCKETS = [
  { color: `rgba(${RGB.soft}, 0.38)`, width: 1 },
  { color: `rgba(${RGB.mid}, 0.55)`, width: 1 },
  { color: `rgba(${RGB.ink}, 0.8)`, width: 1.15 },
  { color: `rgba(${RGB.teal}, 0.95)`, width: 1.5 },
];
const GN = 26; // simpul jaring per sisi (26 × 26 = 676 titik)
const EXTENT = 1.25;

// Koordinat simpul dan peluruhan radialnya tidak berubah antarbingkai,
// jadi dihitung sekali saja.
const GX = new Float32Array(GN * GN);
const GY = new Float32Array(GN * GN);
const GR = new Float32Array(GN * GN);
const GD = new Float32Array(GN * GN);
for (let i = 0; i < GN; i++) {
  for (let j = 0; j < GN; j++) {
    const k = i * GN + j;
    GX[k] = -EXTENT + (2 * EXTENT * i) / (GN - 1);
    GY[k] = -EXTENT + (2 * EXTENT * j) / (GN - 1);
    GR[k] = Math.hypot(GX[k], GY[k]);
    GD[k] = Math.exp(-1.7 * GR[k]);
  }
}
const PX = new Float32Array(GN * GN);
const PY = new Float32Array(GN * GN);
const PZ = new Float32Array(GN * GN);

function HeroSurface() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let fade: CanvasGradient | null = null;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // tepi memudar digambar di canvas (lebih ringan daripada CSS mask pada elemen yang bergerak)
      const m = Math.max(w, h);
      fade = ctx.createRadialGradient(w / 2, h / 2, m * 0.2, w / 2, h / 2, m * 0.5);
      fade.addColorStop(0, "rgba(0,0,0,0)");
      fade.addColorStop(1, "rgba(0,0,0,1)");
    };

    const draw = (t: number) => {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);

      const phi = 0.35 + t * 0.12;
      const alpha = 1.0 + 0.06 * Math.sin(t * 0.2);
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);
      const ca = Math.cos(alpha);
      const sa = Math.sin(alpha);
      const scale = Math.min(w * 0.27, h * 0.245);
      const cx = w * 0.5;
      const cy = h * 0.52;

      // satu kali hitung per simpul
      for (let k = 0; k < GN * GN; k++) {
        const x = GX[k];
        const y = GY[k];
        const z = 0.95 * Math.sin(6.5 * GR[k] - 1.9 * t) * GD[k] + 0.1 * Math.sin(2.6 * x + 0.7 * t) * Math.cos(2.6 * y - 0.5 * t);
        const rx = x * cp - y * sp;
        const ry = x * sp + y * cp;
        const f = 1 / (1 - (ry * ca + z * sa) * 0.22); // perspektif tipis
        PX[k] = cx + scale * rx * f;
        PY[k] = cy + scale * (ry * sa - z * ca) * f;
        PZ[k] = z;
      }

      const paths = BUCKETS.map(() => new Path2D());
      const seg = (a: number, b: number) => {
        const norm = ((PZ[a] + PZ[b]) / 2 + 0.7) / 1.4;
        const bi = Math.max(0, Math.min(BUCKETS.length - 1, Math.floor(norm * BUCKETS.length)));
        paths[bi].moveTo(PX[a], PY[a]);
        paths[bi].lineTo(PX[b], PY[b]);
      };
      for (let i = 0; i < GN; i++) {
        for (let j = 0; j < GN; j++) {
          const k = i * GN + j;
          if (j < GN - 1) seg(k, k + 1);
          if (i < GN - 1) seg(k, k + GN);
        }
      }

      ctx.lineCap = "round";
      paths.forEach((p, i) => {
        ctx.strokeStyle = BUCKETS[i].color;
        ctx.lineWidth = BUCKETS[i].width;
        ctx.stroke(p);
      });

      if (fade) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    let time = 3;

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(time);
    });
    ro.observe(wrap);

    let io: IntersectionObserver | undefined;
    if (reduceMotion) {
      draw(time);
    } else {
      const tick = (now: number) => {
        if (last) time += Math.min((now - last) / 1000, 0.05);
        last = now;
        draw(time);
        frame = requestAnimationFrame(tick);
      };
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!frame) frame = requestAnimationFrame(tick);
          } else {
            cancelAnimationFrame(frame);
            frame = 0;
            last = 0;
          }
        },
        { threshold: 0.1 },
      );
      io.observe(wrap);
    }

    return () => {
      io?.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapRef} className="lp-hero__art">
      <canvas
        ref={canvasRef}
        className="lp-hero__canvas"
        role="img"
        aria-label="Permukaan gelombang tiga dimensi berbentuk jaring yang berputar pelan"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Konten
 * ------------------------------------------------------------------ */
const FEATURES = [
  {
    no: "01",
    tag: "Kalkulus",
    title: "Integral Riemann",
    body: "Luas di bawah kurva bukan lagi misteri. Tambah banyak persegi panjang, dan jumlahnya merapat ke nilai integral.",
    href: HREF.integral,
    setup: setupRiemann,
    bbox: BBOX_RIEMANN,
  },
  {
    no: "02",
    tag: "Trigonometri",
    title: "Lingkaran satuan",
    body: "Sinus bukan sekadar tombol di kalkulator. Ia adalah tinggi sebuah titik yang berputar pada lingkaran. Ikuti perjalanannya, dan gelombang pun lahir.",
    href: HREF.trigonometri,
    setup: setupTrig,
    bbox: BBOX_TRIG,
  },
  {
    no: "03",
    tag: "Geometri analitik",
    title: "Irisan kerucut",
    body: "Elips adalah semua titik yang jumlah jaraknya ke dua fokus selalu sama. Lihat sendiri bahwa jumlah itu tak pernah bergeser.",
    href: HREF.conic,
    setup: setupConic,
    bbox: BBOX_CONIC,
  },
];

const TOPICS: { name: string; sym: string; href: string }[] = [
  { name: "Fungsi Kuadrat", sym: "ax²", href: HREF.quadratic },
  { name: "Transformasi Geometri", sym: "T", href: "/simulasi/transformasi-geometri" },
  { name: "Turunan", sym: "f′", href: HREF.derivative },
  { name: "Integral Riemann", sym: "∫", href: HREF.integral },
  { name: "Vektor", sym: "a⃗", href: HREF.vector },
  { name: "Irisan Kerucut", sym: "e", href: HREF.conic },
  { name: "Trigonometri", sym: "sin", href: HREF.trigonometri },
  { name: "Garis Singgung", sym: "↗", href: HREF.tangent },
  { name: "Plotter Grafik", sym: "f(x)", href: "/simulasi/plotter-grafik" },
  { name: "Sektor Lingkaran", sym: "∠", href: "/simulasi/sektor-lingkaran" },
  { name: "Transformasi Fungsi", sym: "y=f(x)", href: "/simulasi/transformasi-fungsi" },
  { name: "Dan terus bertambah", sym: "…", href: HREF.start },
];

/* ------------------------------------------------------------------ *
 *  Halaman
 * ------------------------------------------------------------------ */
export default function Landing() {
  useSeo({
    title: "1729 | Simulasi Matematika Interaktif dan Latihan Soal",
    description: "Belajar matematika lewat simulasi interaktif: fungsi kuadrat, trigonometri, turunan, integral, vektor, irisan kerucut, dan latihan soal berjenjang sampai HOTS.",
    path: "/",
  });

  return (
    <div className="lp">
      <SiteHeader />

      <main>
        {/* ---------------------------- Hero ---------------------------- */}
        <section className="lp-hero">
          <div className="lp-wrap lp-hero__grid">
            <div className="lp-hero__copy">
              <p className="lp-eyebrow">1729</p>
              <h1 className="lp-hero__tagline">
                <span>Math in</span> <span className="lp-hero__accent">Cartesian.</span>
              </h1>
              <p className="lp-lead">
                Pahami matematika dengan melihatnya. 1729 adalah ruang simulasi interaktif. Geser satu titik, dan lihat seluruh konsep ikut bergerak, dari
                fungsi kuadrat sampai integral Riemann.
              </p>
              <div className="lp-cta">
                <Link to={HREF.start} className="lp-btn lp-btn--solid">
                  Pilih simulasi <span aria-hidden>→</span>
                </Link>
                <Link to="/slides" className="lp-btn lp-btn--ghost">
                  Lakukan presentasi
                </Link>
              </div>
            </div>

            <HeroSurface />
          </div>
        </section>

        {/* -------------------------- Pernyataan ------------------------- */}
        <section className="lp-section lp-section--wash">
          <div className="lp-wrap">
            <p className="lp-statement">
              Rumus adalah ringkasan. <span>Gambarnya adalah pengertian.</span>
            </p>
          </div>
        </section>

        {/* -------------------------- Simulasi --------------------------- */}
        <section className="lp-section" id="simulasi">
          <div className="lp-wrap">
            <p className="lp-eyebrow">Simulasi</p>
            <h2 className="lp-h2">Tiga cara melihat ide yang sama: perubahan dan keteraturan.</h2>

            <div className="lp-features">
              {FEATURES.map((f) => (
                <article className="lp-feature" key={f.no}>
                  <div className="lp-feature__text">
                    <p className="lp-feature__meta">
                      <span>{f.no}</span>
                      <span>{f.tag}</span>
                    </p>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                    <Link to={f.href} className="lp-link">
                      Buka simulasi <span aria-hidden>→</span>
                    </Link>
                  </div>
                  <Board setup={f.setup} bbox={f.bbox} />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- Semua topik ----------------------- */}
        <section className="lp-section lp-section--wash">
          <div className="lp-wrap">
            <p className="lp-eyebrow">Jelajahi</p>
            <h2 className="lp-h2">Satu tempat untuk banyak topik.</h2>
            <div className="lp-topics">
              {TOPICS.map((t, i) => (
                <Link to={t.href} className="lp-topic" key={t.name}>
                  <span className="lp-topic__no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="lp-topic__name">{t.name}</span>
                  <span className="lp-topic__sym" aria-hidden>
                    {t.sym}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ CTA ---------------------------- */}
        <section className="lp-section lp-section--wash lp-final">
          <div className="lp-wrap">
            <h2 className="lp-h2">Mulai dari satu grafik.</h2>
            <p className="lp-lead">Pilih sebuah simulasi, geser satu titik, dan lihat apa yang terjadi.</p>
            <div className="lp-cta lp-cta--center">
              <Link to={HREF.start} className="lp-btn lp-btn--solid">
                Mulai menjelajah <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
