import { useEffect, useId, useRef } from "react";
import JXG from "jsxgraph";
import { Link } from "react-router-dom";
import { SimMath } from "../simulation/SimMath";
import "../styles/jsxgraph.css";
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
 *  Papan 1 — Turunan: garis singgung y = x² yang berjalan sendiri
 * ------------------------------------------------------------------ */
const BBOX_TANGENT: BBox = [-4, 9, 4, -1.5];

const setupTangent: Setup = (board, out) => {
  let a = 0;
  const f = (x: number) => x * x;
  const dx = 0.5; // lebar segitiga kemiringan

  backdrop(board);
  mk(board, "functiongraph", [f, -4, 4], { ...still, strokeColor: C.ink, strokeWidth: 2.75 });

  // garis singgung di x = a, gradien 2a
  mk(board, "line", [[() => a, () => f(a)], [() => a + 1, () => f(a) + 2 * a]], {
    ...still,
    strokeColor: C.mid,
    strokeWidth: 1.75,
    straightFirst: true,
    straightLast: true,
  });

  // segitiga kemiringan: Δx = 0.5, Δy = a  (karena gradien = 2a)
  const dashed = { ...still, strokeColor: C.soft, strokeWidth: 1.5, dash: 2 };
  mk(board, "segment", [[() => a, () => f(a)], [() => a + dx, () => f(a)]], dashed);
  mk(board, "segment", [[() => a + dx, () => f(a)], [() => a + dx, () => f(a) + a]], dashed);

  dot(board, () => a, () => f(a));

  return (s) => {
    a = 2.3 * Math.sin(s * 0.5);
    out(`a = ${pad(num(a), 5)}    f′(a) = 2a = ${pad(num(2 * a), 5)}`);
  };
};

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
 *  Komponen Board: satu papan JSXGraph + bilah keterangan.
 *  Animasi hanya berjalan saat papan terlihat di layar, dan berhenti
 *  bila pengguna memilih "kurangi gerakan" di sistemnya.
 * ------------------------------------------------------------------ */
interface BoardProps {
  title: string;
  setup: Setup;
  bbox: BBox;
  className?: string;
}

function Board({ title, setup, bbox, className = "" }: BoardProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const domId = `jxg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ratio = (bbox[2] - bbox[0]) / (bbox[1] - bbox[3]);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;

    const board = JXG.JSXGraph.initBoard(domId, {
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

    const out: Out = (text) => {
      if (readoutRef.current) readoutRef.current.textContent = text;
    };
    const frame = setup(board, out);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let clock = reduce ? STILL_TIME : 0;
    frame(clock);
    board.update();

    let raf = 0;
    let last = 0;
    let io: IntersectionObserver | undefined;

    if (!reduce) {
      const tick = (now: number) => {
        if (last) clock += Math.min((now - last) / 1000, 0.1);
        last = now;
        frame(clock);
        board.update();
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      };
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!raf) raf = requestAnimationFrame(tick);
          } else stop();
        },
        { threshold: 0.15 },
      );
      io.observe(host);
      return () => {
        io?.disconnect();
        stop();
        JXG.JSXGraph.freeBoard(board);
      };
    }

    return () => JXG.JSXGraph.freeBoard(board);
  }, [domId, bbox, setup]);

  return (
    <figure className={`lp-board ${className}`}>
      <div id={domId} ref={canvasRef} className="lp-board__canvas" style={{ aspectRatio: String(ratio) }} />
      <figcaption className="lp-board__bar">
        <span className="lp-board__title"><SimMath tex={title} /></span>
        <span className="lp-board__readout" ref={readoutRef} />
      </figcaption>
    </figure>
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
    boardTitle: String.raw`f(x)=-\displaystyle\frac{1}{4}(x-3)^2+4`,
    setup: setupRiemann,
    bbox: BBOX_RIEMANN,
  },
  {
    no: "02",
    tag: "Trigonometri",
    title: "Lingkaran satuan",
    body: "Sinus bukan sekadar tombol di kalkulator. Ia adalah tinggi sebuah titik yang berputar pada lingkaran. Ikuti perjalanannya, dan gelombang pun lahir.",
    href: HREF.trigonometri,
    boardTitle: String.raw`y=\sin\theta`,
    setup: setupTrig,
    bbox: BBOX_TRIG,
  },
  {
    no: "03",
    tag: "Geometri analitik",
    title: "Irisan kerucut",
    body: "Elips adalah semua titik yang jumlah jaraknya ke dua fokus selalu sama. Lihat sendiri bahwa jumlah itu tak pernah bergeser.",
    href: HREF.conic,
    boardTitle: String.raw`\displaystyle\frac{x^2}{25}+\displaystyle\frac{y^2}{9}=1`,
    setup: setupConic,
    bbox: BBOX_CONIC,
  },
];

const TOPICS: { name: string; sym: string; href: string }[] = [
  { name: "Fungsi Kuadrat", sym: "ax^2", href: HREF.quadratic },
  { name: "Transformasi Geometri", sym: "T", href: "/simulasi/transformasi-geometri" },
  { name: "Turunan", sym: "f'", href: HREF.derivative },
  { name: "Integral Riemann", sym: String.raw`\int`, href: HREF.integral },
  { name: "Vektor", sym: String.raw`\overrightarrow{a}`, href: HREF.vector },
  { name: "Irisan Kerucut", sym: "e", href: HREF.conic },
  { name: "Trigonometri", sym: String.raw`\sin`, href: HREF.trigonometri },
  { name: "Garis Singgung", sym: String.raw`\nearrow`, href: HREF.tangent },
  { name: "Plotter Grafik", sym: "f(x)", href: "/simulasi/plotter-grafik" },
  { name: "Sektor Lingkaran", sym: String.raw`\angle`, href: "/simulasi/sektor-lingkaran" },
  { name: "Transformasi Fungsi", sym: "y=f(x)", href: "/simulasi/transformasi-fungsi" },
  { name: "Dan terus bertambah", sym: String.raw`\ldots`, href: HREF.start },
];

/* ------------------------------------------------------------------ *
 *  Halaman
 * ------------------------------------------------------------------ */
export default function Landing() {
  return (
    <div className="lp">
      <header className="lp-top">
        <div className="lp-wrap lp-top__in">
          <Link to="/" className="lp-brand" aria-label="1729 beranda">
            1729
          </Link>
        </div>
      </header>

      <main>
        {/* ---------------------------- Hero ---------------------------- */}
        <section className="lp-hero">
          <div className="lp-wrap lp-hero__grid">
            <div className="lp-hero__copy">
              <p className="lp-eyebrow">Matematika, terlihat.</p>
              <h1>Pahami matematika dengan melihatnya.</h1>
              <p className="lp-lead">
                1729 adalah ruang simulasi interaktif. Geser satu titik, dan lihat seluruh konsep ikut bergerak, dari
                fungsi kuadrat sampai integral Riemann.
              </p>
              <div className="lp-cta">
                <Link to={HREF.start} className="lp-btn lp-btn--solid">
                  Mulai menjelajah <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <Board className="lp-hero__board" title="f(x)=x^2" setup={setupTangent} bbox={BBOX_TANGENT} />
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
                  <Board title={f.boardTitle} setup={f.setup} bbox={f.bbox} />
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
                    <SimMath tex={t.sym} />
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

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer__in">
          <span className="lp-brand">1729</span>
          <span>Memahami matematika secara visual.</span>
          <a href="mailto:pesan.math1729@gmail.com">pesan.math1729@gmail.com</a>
          <a href="https://kelas1729.vercel.app/">Website lama</a>
          <Link to={HREF.latihan}>Latihan soal</Link>
        </div>
      </footer>
    </div>
  );
}