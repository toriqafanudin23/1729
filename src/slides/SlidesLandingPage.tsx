import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import { DECKS, type DeckMeta } from "../slides/slides";
import "../pages/LandingPage.css"; // dasar tema 1729 (kelas .lp-*)
import "./SlidesPages.css";

/* ------------------------------------------------------------------ *
 *  Hero: satu kurva, satu titik. Garis potong (oranye) merapat menjadi
 *  garis singgung (abu-abu) saat titik Q mendekati P, lalu merenggang
 *  lagi, tanpa henti dan tanpa teks. Menyatu dengan latar: tanpa kotak,
 *  tepinya memudar di canvas. Hanya bergerak saat terlihat, dan diam
 *  bila pengguna memilih "kurangi gerakan".
 * ------------------------------------------------------------------ */
const RGB = {
  soft: "148, 163, 184",
  mid: "100, 116, 139",
  ink: "15, 23, 42",
  orange: "230, 81, 0",
};
const f = (x: number) => 1.5 * Math.sin(0.9 * x) + 0.5 * Math.sin(2.1 * x + 0.8);
const df = (x: number) => 1.35 * Math.cos(0.9 * x) + 1.05 * Math.cos(2.1 * x + 0.8);
const SPAN = 6.8; // lebar dunia (satuan) yang tampil di canvas

function HeroCurve() {
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

      const s = w / SPAN;
      const X = (x: number) => w / 2 + x * s;
      const Y = (y: number) => h / 2 - y * s;

      // garis ujung-memudar dari (x0,y0) ke (x1,y1) dalam koordinat dunia
      const taper = (x0: number, y0: number, x1: number, y1: number, rgb: string, alpha: number, width: number) => {
        const n = 28;
        ctx.lineWidth = width;
        ctx.lineCap = "butt";
        for (let i = 0; i < n; i++) {
          const u0 = i / n;
          const u1 = (i + 1) / n;
          const a = alpha * Math.sin((Math.PI * (u0 + u1)) / 2);
          ctx.strokeStyle = `rgba(${rgb}, ${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(X(x0 + (x1 - x0) * u0), Y(y0 + (y1 - y0) * u0));
          ctx.lineTo(X(x0 + (x1 - x0) * u1), Y(y0 + (y1 - y0) * u1));
          ctx.stroke();
        }
      };

      // sumbu x, tipis
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${RGB.soft}, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(0, Y(0));
      ctx.lineTo(w, Y(0));
      ctx.stroke();

      // kurva
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(${RGB.ink}, 0.88)`;
      ctx.beginPath();
      for (let i = 0; i <= 180; i++) {
        const x = -SPAN / 2 - 0.2 + ((SPAN + 0.4) * i) / 180;
        if (i) ctx.lineTo(X(x), Y(f(x)));
        else ctx.moveTo(X(x), Y(f(x)));
      }
      ctx.stroke();

      // titik P berjalan pelan; jarak h berdenyut mulus (tidak pernah melompat)
      const xp = 2.0 * Math.sin(0.28 * t);
      const k = 0.5 + 0.5 * Math.cos(0.9 * t);
      const hh = 0.04 + 1.7 * k * k;
      const yp = f(xp);
      const xq = xp + hh;
      const yq = f(xq);
      const mt = df(xp);
      const ms = (yq - yp) / hh;

      taper(xp - 2.6, yp - 2.6 * mt, xp + 2.6, yp + 2.6 * mt, RGB.mid, 0.75, 1.5);
      taper(xp - 2.3, yp - 2.3 * ms, xp + 2.3, yp + 2.3 * ms, RGB.orange, 0.95, 2.25);

      const r = Math.max(4.5, w * 0.011);
      const dot = (x: number, y: number, rgb: string) => {
        ctx.beginPath();
        ctx.arc(X(x), Y(y), r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
      };
      dot(xp, yp, RGB.ink);
      dot(xq, yq, RGB.orange);

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
        aria-label="Garis potong pada sebuah kurva yang merapat menjadi garis singgung"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Gambar kecil untuk kartu katalog (SVG statis, ringan)
 * ------------------------------------------------------------------ */
const GRID_X = [40, 80, 120, 160, 200, 240, 280];
const GRID_Y = [20, 60, 100, 140];

function ThumbFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" className="sl-thumb" role="img" aria-label={label}>
      <g stroke="#e2e8f0" strokeWidth="1">
        {GRID_X.map((x) => <line key={`x${x}`} x1={x} y1="0" x2={x} y2="180" />)}
        {GRID_Y.map((y) => <line key={`y${y}`} x1="0" y1={y} x2="320" y2={y} />)}
      </g>
      {children}
    </svg>
  );
}

function ThumbTransform() {
  return (
    <ThumbFrame label="Segitiga diputar 90° mengelilingi sebuah titik pusat">
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="130" x2="320" y2="130" />
        <line x1="160" y1="0" x2="160" y2="180" />
      </g>
      <path d="M225 130 A65 65 0 0 0 160 65" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M200 130 L260 130 L200 90 Z" fill="rgba(15,23,42,.06)" stroke="#0f172a" strokeWidth="2.25" strokeLinejoin="round" />
      <path d="M160 90 L160 30 L120 90 Z" fill="rgba(230,81,0,.1)" stroke="#e65100" strokeWidth="2.25" strokeLinejoin="round" />
      <circle cx="160" cy="130" r="4.5" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
    </ThumbFrame>
  );
}

const X = (x: number) => 160 + x * 38;
const Y = (y: number) => 150 - y * 38;
const PARABOLA = Array.from({ length: 39 }, (_, i) => {
  const x = -1.9 + i * 0.1;
  return `${i ? "L" : "M"}${X(x).toFixed(1)} ${Y(x * x).toFixed(1)}`;
}).join(" ");

function ThumbCalculus() {
  return (
    <ThumbFrame label="Garis potong pada parabola merapat menjadi garis singgung">
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="150" x2="320" y2="150" />
        <line x1="160" y1="0" x2="160" y2="180" />
      </g>
      <path d={PARABOLA} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={X(0.35)} y1={Y(-0.3)} x2={X(1.8)} y2={Y(2.6)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={X(0.5)} y1={Y(-0.3)} x2={X(1.75)} y2={Y(2.95)} stroke="#e65100" strokeWidth="2.25" />
      <circle cx={X(1)} cy={Y(1)} r="4.5" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
      <circle cx={X(1.6)} cy={Y(2.56)} r="4.5" fill="#e65100" stroke="#fff" strokeWidth="1.5" />
    </ThumbFrame>
  );
}

/* ------------------------------------------------------------------ *
 *  Kartu katalog
 * ------------------------------------------------------------------ */
function DeckCard({ deck, index }: { deck: DeckMeta; index: number }) {
  return (
    <Link to={`/slides/${deck.slug}`} className="sl-card">
      <div className="sl-card__thumb">{deck.thumb === "transform" ? <ThumbTransform /> : <ThumbCalculus />}</div>
      <div className="sl-card__body">
        <p className="sl-card__meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{deck.category}</span>
        </p>
        <h3>{deck.title}</h3>
        <p className="sl-card__summary">{deck.summary}</p>
        <ul className="sl-chips" aria-label="Konsep yang dibahas">
          {deck.concepts.map((c) => (
            <li className="sl-chip" key={c}>{c}</li>
          ))}
        </ul>
        <div className="sl-card__foot">
          <span>{deck.slides} slide · ±{deck.minutes} menit · {deck.level}</span>
          <span className="sl-card__go">Mulai <span aria-hidden>→</span></span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 *  Konten
 * ------------------------------------------------------------------ */
const PRINCIPLES = [
  {
    no: "01",
    title: "Penjelasan menggerakkan simulasi",
    body: "Setiap langkah penjelasan (tekan →) mengubah papan. Anda tidak membaca tentang perubahan, Anda melihatnya terjadi.",
  },
  {
    no: "02",
    title: "Tetap bisa digeser sendiri",
    body: "Setelah penjelasan selesai, geser slider atau ganti fungsinya. Setiap slide adalah laboratorium kecil.",
  },
  {
    no: "03",
    title: "Siap tampil",
    body: "Mode layar penuh, navigasi keyboard, dan tampilan yang rapi di proyektor maupun ponsel.",
  },
];

const KEYS: { keys: string[]; label: string }[] = [
  { keys: ["→", "Spasi"], label: "Langkah berikutnya" },
  { keys: ["←"], label: "Kembali satu langkah" },
  { keys: ["F"], label: "Masuk atau keluar layar penuh" },
  { keys: ["Esc"], label: "Keluar dari layar penuh" },
];

export default function SlidesLandingPage() {
  useSeo({
    title: "1729 Slides | Another Level: Presentasi Matematika Interaktif",
    description:
      "Slide presentasi matematika yang ikut bergerak. Setiap langkah penjelasan menggerakkan simulasinya. Tersedia transformasi geometri serta limit dan turunan.",
    path: "/slides",
  });

  const first = DECKS[0];

  return (
    <div className="lp sl">
      <SiteHeader />

      <main>
        {/* ---------------------------- Hero ---------------------------- */}
        <section className="lp-hero">
          <div className="lp-wrap lp-hero__grid">
            <div className="lp-hero__copy">
              <p className="lp-eyebrow">1729 Slides</p>
              <h1>Another Level.</h1>
              <p className="lp-lead">
                Presentasi matematika di mana setiap langkah penjelasan menggerakkan simulasinya. Tekan →, dan lihat
                konsepnya hidup.
              </p>
              <div className="lp-cta">
                <a href="#katalog" className="lp-btn lp-btn--solid">
                  Lihat katalog <span aria-hidden>↓</span>
                </a>
                {first && (
                  <Link to={`/slides/${first.slug}`} className="lp-btn lp-btn--ghost">
                    Mulai presentasi
                  </Link>
                )}
              </div>
            </div>

            <HeroCurve />
          </div>
        </section>

        {/* -------------------------- Pernyataan ------------------------- */}
        <section className="lp-section lp-section--wash">
          <div className="lp-wrap">
            <p className="lp-statement">
              Slide biasa menunjukkan hasil. <span>Slide ini memperlihatkan prosesnya.</span>
            </p>
          </div>
        </section>

        {/* ----------------------------- Katalog ------------------------- */}
        <section className="lp-section" id="katalog">
          <div className="lp-wrap">
            <p className="lp-eyebrow">Katalog</p>
            <h2 className="lp-h2">Pilih materi, tekan mulai.</h2>

            <div className="sl-cards">
              {DECKS.map((d, i) => (
                <DeckCard deck={d} index={i} key={d.slug} />
              ))}
              <div className="sl-card sl-card--soon">
                <p className="lp-eyebrow">Segera</p>
                <h3>Materi berikutnya sedang disiapkan.</h3>
                <p className="sl-card__summary">Katalog ini akan terus bertambah.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------- Cara kerja ------------------------ */}
        <section className="lp-section lp-section--wash">
          <div className="lp-wrap">
            <p className="lp-eyebrow">Cara kerja</p>
            <h2 className="lp-h2">Dirancang agar konsep terlihat, bukan hanya terbaca.</h2>
            <div className="lp-principles">
              {PRINCIPLES.map((p) => (
                <div className="lp-principle" key={p.no}>
                  <span className="lp-principle__no">{p.no}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- Pintasan -------------------------- */}
        <section className="lp-section lp-section--ink">
          <div className="lp-wrap lp-why">
            <div>
              <p className="lp-eyebrow">Pintasan</p>
              <h2 className="lp-h2">Cukup beberapa tombol.</h2>
            </div>
            <ul className="sl-keys">
              {KEYS.map((k) => (
                <li className="sl-key" key={k.label}>
                  <span className="sl-key__caps">
                    {k.keys.map((c) => (
                      <kbd key={c}>{c}</kbd>
                    ))}
                  </span>
                  <span>{k.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------ CTA ---------------------------- */}
        <section className="lp-section lp-final">
          <div className="lp-wrap">
            <h2 className="lp-h2">Naik satu tingkat.</h2>
            <p className="lp-lead">Buka satu slide, tekan →, dan lihat konsepnya bergerak.</p>
            <div className="lp-cta lp-cta--center">
              <a href="#katalog" className="lp-btn lp-btn--solid">
                Pilih materi <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
