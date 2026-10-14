import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useSeo } from "../../useSeo";
import { DECKS, type DeckMeta } from "../slides";
import "../../pages/LandingPage.css"; // dasar tema 1729 (kelas .lp-*)
import "../styles/SlidesPages.css";

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

function ThumbLinear() {
  return (
    <ThumbFrame label="Dua garis berpotongan pada satu titik penyelesaian">
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="140" x2="320" y2="140" />
        <line x1="160" y1="0" x2="160" y2="180" />
      </g>
      <line x1="35" y1="35" x2="285" y2="155" stroke="#1565c0" strokeWidth="2.75" />
      <line x1="40" y1="165" x2="280" y2="25" stroke="#e65100" strokeWidth="2.75" />
      <circle cx="160" cy="95" r="6" fill="#0f172a" stroke="#fff" strokeWidth="2" />
    </ThumbFrame>
  );
}

function ThumbInequality() {
  return (
    <ThumbFrame label="Daerah solusi pada satu sisi garis batas">
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="140" x2="320" y2="140" />
        <line x1="160" y1="0" x2="160" y2="180" />
      </g>
      <path d="M25 155 L80 35 L285 35 L285 155 Z" fill="rgba(11,132,198,.16)" />
      <line x1="80" y1="35" x2="285" y2="155" stroke="#e65100" strokeWidth="2.75" />
      <circle cx="175" cy="115" r="5" fill="#2e7d32" stroke="#fff" strokeWidth="2" />
    </ThumbFrame>
  );
}

function ThumbProgram() {
  return (
    <ThumbFrame label="Garis selidik menyapu daerah layak sampai menyentuh titik pojok">
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="150" x2="320" y2="150" />
        <line x1="50" y1="0" x2="50" y2="180" />
      </g>
      <path d="M50 150 L170 150 L230 90 L50 40 Z" fill="rgba(15,118,110,.16)" />
      <line x1="50" y1="150" x2="170" y2="150" stroke="#1565c0" strokeWidth="2.75" />
      <line x1="50" y1="40" x2="230" y2="90" stroke="#e65100" strokeWidth="2.75" />
      <line x1="170" y1="150" x2="230" y2="90" stroke="#0f766e" strokeWidth="2.75" />
      <line x1="120" y1="10" x2="300" y2="140" stroke="#6557d2" strokeWidth="2.5" strokeDasharray="5 5" />
      <circle cx="230" cy="90" r="6.5" fill="#b3261e" stroke="#fff" strokeWidth="2" />
    </ThumbFrame>
  );
}

function ThumbQuadratic() {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = -2 + i * 0.1;
    return `${i ? "L" : "M"}${(160 + x * 46).toFixed(1)} ${(40 + (x * x) * 22).toFixed(1)}`;
  }).join(" ");
  return (
    <ThumbFrame label="Parabola dengan titik puncak, sumbu simetri, dan dua akar">
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="60" x2="320" y2="60" />
        <line x1="160" y1="0" x2="160" y2="180" />
      </g>
      <line x1="160" y1="10" x2="160" y2="170" stroke="#b3261e" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d={pts} fill="none" stroke="#0f172a" strokeWidth="2.75" strokeLinecap="round" />
      <circle cx="160" cy="40" r="5.5" fill="#0f766e" stroke="#fff" strokeWidth="2" />
      <circle cx="114" cy="60" r="4.5" fill="#e65100" stroke="#fff" strokeWidth="1.5" />
      <circle cx="206" cy="60" r="4.5" fill="#e65100" stroke="#fff" strokeWidth="1.5" />
    </ThumbFrame>
  );
}

function ThumbCircle() {
  return (
    <ThumbFrame label="Lingkaran dengan juring, jari-jari, dan garis singgung">
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="90" x2="320" y2="90" />
        <line x1="160" y1="0" x2="160" y2="180" />
      </g>
      <path d="M160 90 L230 90 A70 70 0 0 0 209.5 40.5 Z" fill="rgba(101,87,210,.16)" />
      <circle cx="160" cy="90" r="70" fill="none" stroke="#0f172a" strokeWidth="2.75" />
      <line x1="160" y1="90" x2="209.5" y2="40.5" stroke="#1565c0" strokeWidth="2.25" />
      <line x1="160" y1="90" x2="230" y2="90" stroke="#1565c0" strokeWidth="2.25" />
      <path d="M230 90 A70 70 0 0 0 209.5 40.5" fill="none" stroke="#e65100" strokeWidth="4" strokeLinecap="round" />
      <line x1="170" y1="20" x2="250" y2="62" stroke="#e65100" strokeWidth="2" strokeDasharray="5 4" />
      <circle cx="160" cy="90" r="4.5" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
      <circle cx="209.5" cy="40.5" r="5" fill="#b3261e" stroke="#fff" strokeWidth="1.5" />
    </ThumbFrame>
  );
}

function ThumbConic() {
  return (
    <ThumbFrame label="Empat irisan kerucut: lingkaran, parabola, elips, dan hiperbola">
      <g stroke="#94a3b8" strokeWidth="1.1" opacity=".8">
        <line x1="160" y1="12" x2="160" y2="168" />
        <line x1="20" y1="90" x2="300" y2="90" />
      </g>
      <circle cx="82" cy="49" r="23" fill="rgba(21,101,192,.08)" stroke="#1565c0" strokeWidth="3" />
      <path d="M211 69 Q236 30 261 69" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="82" cy="131" rx="31" ry="19" fill="rgba(101,87,210,.08)" stroke="#6557d2" strokeWidth="3" />
      <path d="M207 111 C220 113 230 122 238 131 C230 140 220 149 207 151 M273 111 C260 113 250 122 242 131 C250 140 260 149 273 151" fill="none" stroke="#e65100" strokeWidth="3" strokeLinecap="round" />
      <g fill="#475569" fontSize="10" fontFamily="system-ui, sans-serif" textAnchor="middle">
        <text x="82" y="83">lingkaran</text>
        <text x="237" y="83">parabola</text>
        <text x="82" y="166">elips</text>
        <text x="240" y="166">hiperbola</text>
      </g>
    </ThumbFrame>
  );
}

function ThumbSolid() {
  return (
    <ThumbFrame label="Kubus satuan tersusun dengan jaring-jaring kubus di sampingnya">
      <polygon points="160,38 205,64 160,90 115,64" fill="#5fa8a2" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="115,64 160,90 160,142 115,116" fill="#e9915a" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="160,90 205,64 205,116 160,142" fill="#5f9bd6" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <g stroke="#0f172a" strokeWidth="1" opacity=".45">
        <line x1="130" y1="46.7" x2="175" y2="72.7" /><line x1="145" y1="55.3" x2="190" y2="81.3" />
        <line x1="145" y1="46.7" x2="100" y2="72.7" /><line x1="190" y1="46.7" x2="145" y2="72.7" />
        <line x1="130" y1="72.7" x2="130" y2="124.7" /><line x1="145" y1="81.3" x2="145" y2="133.3" />
        <line x1="175" y1="81.3" x2="175" y2="133.3" /><line x1="190" y1="72.7" x2="190" y2="124.7" />
      </g>
      <g fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5">
        <rect x="250" y="40" width="16" height="16" /><rect x="234" y="56" width="16" height="16" /><rect x="250" y="56" width="16" height="16" />
        <rect x="266" y="56" width="16" height="16" /><rect x="282" y="56" width="16" height="16" /><rect x="250" y="72" width="16" height="16" />
      </g>
    </ThumbFrame>
  );
}

/* ------------------------------------------------------------------ *
 *  Kartu katalog
 * ------------------------------------------------------------------ */
function DeckCard({ deck, index }: { deck: DeckMeta; index: number }) {
  return (
    <Link to={`/slides/${deck.slug}`} className="sl-card">
      <div className="sl-card__thumb">
        {deck.thumb === "transform" ? <ThumbTransform /> : deck.thumb === "linear" ? <ThumbLinear /> : deck.thumb === "inequality" ? <ThumbInequality /> : deck.thumb === "program" ? <ThumbProgram /> : deck.thumb === "quadratic" ? <ThumbQuadratic /> : deck.thumb === "circle" ? <ThumbCircle /> : deck.thumb === "conic" ? <ThumbConic /> : deck.thumb === "solid" ? <ThumbSolid /> : <ThumbCalculus />}
      </div>
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

  const catalogDecks = DECKS;
  const first = catalogDecks[0];

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
              {catalogDecks.map((d, i) => (
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
