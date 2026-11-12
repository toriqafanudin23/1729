import { useEffect, useId, useRef, type RefObject } from "react";
import type JXG from "jsxgraph";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { HOME_SEO } from "../seoText";
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
};

/* ------------------------------------------------------------------ *
 *  Palet slate (dipakai juga oleh JSXGraph)
 * ------------------------------------------------------------------ */
const C = {
  ink: "#141413", // slate-900
  strong: "#3d3d3a", // slate-700
  mid: "#73726c", // slate-500
  soft: "#9c9a92", // slate-400
  line: "#d6d4c9", // slate-300
  grid: "#e8e6dc", // slate-200
  wash: "#f0eee6", // slate-100
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
 *  Animasi hero: kurva Lissajous 2D. Dua gerak harmonik tegak lurus
 *  (frekuensi 3 : 2) menggambar satu kurva. Satu canvas, tanpa teks,
 *  sekitar 400 titik per bingkai, berhenti saat keluar layar.
 * ------------------------------------------------------------------ */
const LJ_A = 3; // frekuensi sumbu x
const LJ_B = 2; // frekuensi sumbu y
const LJ_FULL = 360; // titik untuk kurva penuh
const LJ_TRAIL = 70; // titik untuk ekor yang bercahaya
const LJ_SPEED = 0.85; // rad/detik
const LJ_DRIFT = 0.11; // pergeseran fase, rad/detik
const CLAY = "198, 97, 63";
const INK = "20, 20, 19";

function HeroLissajous() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);

      const gutter = Math.min(w, h) * 0.17; // ruang untuk jalur gerak di atas dan di kiri
      const box = Math.min(w - gutter, h - gutter);
      const amp = box * 0.43;
      const cx = gutter + (w - gutter) / 2;
      const cy = gutter + (h - gutter) / 2;
      const delta = Math.PI / 2 + t * LJ_DRIFT;
      const theta = t * LJ_SPEED;

      const X = (u: number) => cx + amp * Math.sin(LJ_A * u + delta);
      const Y = (u: number) => cy + amp * Math.sin(LJ_B * u);

      // bingkai tipis tempat kurva bergerak
      ctx.strokeStyle = `rgba(${INK}, 0.1)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - amp - 0.5, cy - amp - 0.5, amp * 2 + 1, amp * 2 + 1);

      // jalur gerak: titik di atas mengikuti x, titik di kiri mengikuti y
      const trackY = gutter * 0.5;
      const trackX = gutter * 0.5;
      ctx.strokeStyle = `rgba(${INK}, 0.22)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - amp, trackY);
      ctx.lineTo(cx + amp, trackY);
      ctx.moveTo(trackX, cy - amp);
      ctx.lineTo(trackX, cy + amp);
      ctx.stroke();

      const px = X(theta);
      const py = Y(theta);

      // garis bantu putus-putus dari kedua jalur menuju titik
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = `rgba(${INK}, 0.3)`;
      ctx.beginPath();
      ctx.moveTo(px, trackY);
      ctx.lineTo(px, py);
      ctx.moveTo(trackX, py);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // kurva penuh, tipis
      ctx.strokeStyle = `rgba(${INK}, 0.2)`;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i <= LJ_FULL; i++) {
        const u = (i / LJ_FULL) * Math.PI * 2;
        if (i === 0) ctx.moveTo(X(u), Y(u));
        else ctx.lineTo(X(u), Y(u));
      }
      ctx.stroke();

      // ekor yang memudar, digambar dalam beberapa potongan
      const SPAN = 1.15;
      const PIECES = 5;
      ctx.lineCap = "round";
      for (let p = 0; p < PIECES; p++) {
        const from = p / PIECES;
        const to = (p + 1) / PIECES;
        ctx.strokeStyle = `rgba(${CLAY}, ${0.15 + 0.85 * to})`;
        ctx.lineWidth = 1.5 + 2.2 * to;
        ctx.beginPath();
        const n0 = Math.floor(from * LJ_TRAIL);
        const n1 = Math.ceil(to * LJ_TRAIL);
        for (let i = n0; i <= n1; i++) {
          const u = theta - SPAN * (1 - i / LJ_TRAIL);
          if (i === n0) ctx.moveTo(X(u), Y(u));
          else ctx.lineTo(X(u), Y(u));
        }
        ctx.stroke();
      }

      // titik di jalur dan titik penggambar
      const dot = (x: number, y: number, r: number, fill: string, stroke: string) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = stroke;
        ctx.stroke();
      };
      dot(px, trackY, 4.5, `rgb(${INK})`, "#faf9f5");
      dot(trackX, py, 4.5, `rgb(${INK})`, "#faf9f5");
      dot(px, py, 6.5, `rgb(${CLAY})`, "#faf9f5");
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    let time = 1.2;

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion || !frame) draw(time);
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
        { threshold: 0.05 },
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
        aria-label="Dua titik bergerak bolak-balik pada garis tegak lurus dan bersama-sama menggambar kurva Lissajous"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Animasi saat scroll: elemen ber-atribut data-reveal muncul pelan
 *  begitu masuk layar. Kelas penyembunyi baru dipasang oleh JavaScript,
 *  jadi tanpa JS (atau dengan "kurangi gerakan") semuanya tetap terlihat.
 * ------------------------------------------------------------------ */
function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const items = Array.from(host.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    host.classList.add("lp--reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      host.classList.remove("lp--reveal");
    };
  }, [root]);
}

/* ------------------------------------------------------------------ *
 *  Konten
 * ------------------------------------------------------------------ */
const FEATURES = [
  {
    key: "integral",
    tag: "Kalkulus",
    title: "Integral Riemann",
    body: "Luas di bawah kurva bukan lagi misteri. Tambah banyak persegi panjang, dan jumlahnya merapat ke nilai integral.",
    href: HREF.integral,
    setup: setupRiemann,
    bbox: BBOX_RIEMANN,
  },
  {
    key: "trigonometri",
    tag: "Trigonometri",
    title: "Lingkaran satuan",
    body: "Sinus bukan sekadar tombol di kalkulator. Ia adalah tinggi sebuah titik yang berputar pada lingkaran. Ikuti perjalanannya, dan gelombang pun lahir.",
    href: HREF.trigonometri,
    setup: setupTrig,
    bbox: BBOX_TRIG,
  },
  {
    key: "irisan-kerucut",
    tag: "Geometri analitik",
    title: "Irisan kerucut",
    body: "Elips adalah semua titik yang jumlah jaraknya ke dua fokus selalu sama. Lihat sendiri bahwa jumlah itu tak pernah bergeser.",
    href: HREF.conic,
    setup: setupConic,
    bbox: BBOX_CONIC,
  },
];

/* ------------------------------------------------------------------ *
 *  Halaman
 * ------------------------------------------------------------------ */
export default function Landing() {
  useSeo({ ...HOME_SEO, path: "/" });
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  return (
    <div className="lp" ref={rootRef}>
      <SiteHeader />

      <main>
        {/* ---------------------------- Hero ---------------------------- */}
        <section className="lp-hero">
          <div className="lp-wrap lp-hero__grid">
            <div className="lp-hero__copy">
              <h1 className="lp-hero__tagline">
                <span>Simulasi matematika</span> <span className="lp-hero__accent">siap dipakai mengajar.</span>
              </h1>
              <p className="lp-lead">
                Alternatif GeoGebra dan Desmos untuk guru SMP dan SMA. Simulasi sudah dibuat sesuai materi, jadi kamu
                tinggal membuka, menggeser, dan menjelaskan. Tanpa membangun dari nol.
              </p>
              <div className="lp-cta">
                <Link to={HREF.start} className="lp-btn lp-btn--solid">
                  Buka simulasi
                </Link>
                <a href="#contoh" className="lp-btn lp-btn--ghost">
                  Lihat contohnya
                </a>
              </div>
            </div>

            <HeroLissajous />
          </div>
        </section>

        {/* -------------------------- Contoh simulasi --------------------------- */}
        <section className="lp-section" id="contoh">
          <div className="lp-wrap">
            <h2 className="lp-h2" data-reveal>
              Lihat konsepnya bergerak, bukan hanya rumusnya.
            </h2>

            <div className="lp-features">
              {FEATURES.map((f) => (
                <article className="lp-feature" key={f.key}>
                  <div className="lp-feature__text" data-reveal>
                    <p className="lp-feature__tag">{f.tag}</p>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                    <Link to={f.href} className="lp-link">
                      Buka simulasi
                    </Link>
                  </div>
                  <div data-reveal="fade" style={{ ["--d" as string]: "120ms" }}>
                    <Board setup={f.setup} bbox={f.bbox} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ CTA ---------------------------- */}
        <section className="lp-section lp-section--wash lp-final">
          <div className="lp-wrap">
            <h2 className="lp-h2" data-reveal>
              Siap dipakai untuk pelajaran berikutnya.
            </h2>
            <p className="lp-lead" data-reveal style={{ ["--d" as string]: "80ms" }}>
              Pilih topik, buka simulasinya, dan mulai menjelaskan.
            </p>
            <div className="lp-cta lp-cta--center" data-reveal style={{ ["--d" as string]: "160ms" }}>
              <Link to={HREF.start} className="lp-btn lp-btn--solid">
                Buka simulasi
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
