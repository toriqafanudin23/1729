import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useSeo } from "../../useSeo";
import "katex/dist/katex.min.css";
import "./styles/LatihanPage.css"; // gaya renderer LaTeX untuk simbol materi
import "./styles/LatihanLanding.css";
import { LEVEL_LABEL } from "./components/SectionBlock";
import { Rich } from "./components/Rich";
import { MATERIALS } from "./data";
import { summarize } from "./lib/catalog";
import type { Level, Material } from "./types";

/* ------------------------------------------------------------------ *
 *  Tautan: sesuaikan dengan route di aplikasi 1729.
 *  <Route path="/latihan" element={<LatihanLanding />} />
 *  <Route path="/latihan/:slug" element={<LatihanRoute />} />
 * ------------------------------------------------------------------ */
const HREF = {
  home: "/",
  pack: (slug: string) => `/latihan/${slug}`,
};

const LEVELS: Level[] = ["mudah", "sedang", "sulit", "hots"];
const CATEGORIES = [
  "Semua",
  "Bilangan",
  "Aljabar",
  "Geometri",
  "Statistika & Peluang",
  "Kombinatorika",
  "Kalkulus",
] as const;

// Pengelompokan materi untuk filter katalog.
const CATEGORY_BY_SLUG: Record<string, (typeof CATEGORIES)[number]> = {
  "eksponen-logaritma": "Bilangan",
  "barisan-deret": "Bilangan",
  "bilangan-kompleks": "Bilangan",
  sppl: "Aljabar",
  "fungsi-kuadrat": "Aljabar",
  "komposisi-fungsi-invers": "Aljabar",
  matriks: "Aljabar",
  "transformasi-fungsi": "Aljabar",
  "fungsi-pemodelan": "Aljabar",
  polinomial: "Aljabar",
  "perbandingan-trigonometri": "Geometri",
  vektor: "Geometri",
  "transformasi-geometri": "Geometri",
  lingkaran: "Geometri",
  "irisan-kerucut": "Geometri",
  statistika: "Statistika & Peluang",
  peluang: "Statistika & Peluang",
  "analisis-data-peluang": "Statistika & Peluang",
  kombinatorika: "Kombinatorika",
  limit: "Kalkulus",
  turunan: "Kalkulus",
  integral: "Kalkulus",
};

/* ------------------------------------------------------------------ *
 *  Konten
 * ------------------------------------------------------------------ */
const FEATURES = [
  {
    no: "01",
    title: "Umpan balik seketika",
    body: "Satu klik, dan kamu langsung tahu benar atau salahnya. Opsi yang tepat ditandai agar kekeliruan mudah dikenali.",
  },
  {
    no: "02",
    title: "Pembahasan tersembunyi",
    body: "Langkah penyelesaian disimpan di balik satu tombol, supaya kamu mencoba dulu sebelum mengintip.",
  },
  {
    no: "03",
    title: "Berjenjang sampai HOTS",
    body: "Dari soal dasar hingga penalaran tingkat tinggi gaya UTBK-SNBT, lengkap dengan gambar dan tabel pernyataan.",
  },
  {
    no: "04",
    title: "Skor yang jelas",
    body: "Pilihan ganda dan isian dinilai otomatis. Uraian kamu bandingkan sendiri dengan pembahasan dan penskoran.",
  },
];

const STEPS = [
  { no: "01", title: "Kerjakan dulu", body: "Jawab tanpa membuka pembahasan. Salah di tahap ini justru memberi informasi paling banyak." },
  { no: "02", title: "Periksa hasilnya", body: "Lihat soal mana yang belum tepat, dan catat pola kesalahannya: rumus, hitungan, atau cara membaca soal." },
  { no: "03", title: "Pelajari, lalu ulangi", body: "Buka pembahasan soal yang salah, kemudian tekan Ulangi semua dan kerjakan lagi dari awal." },
];

/* ------------------------------------------------------------------ *
 *  Animasi hero: deret Fourier. Lingkaran-lingkaran yang berputar
 *  dijumlahkan, ujungnya menggambar gelombang persegi yang mengalir
 *  ke kanan. Jumlah suku bertambah dan berkurang secara halus.
 *  Canvas 2D, tanpa dependensi, berhenti saat tidak terlihat.
 * ------------------------------------------------------------------ */
const INK = "15, 23, 42"; // #0f172a
const SLATE = "100, 116, 139"; // #64748b
const SOFT = "148, 163, 184"; // #94a3b8
const TEAL = "15, 118, 110"; // #0f766e (sama dengan titik "aktif")

const MAX_TERMS = 5;
const OMEGA = 1.8; // rad/detik untuk suku pertama
const FLOW = 52; // px/detik, kecepatan gelombang mengalir

const ease = (x: number) => x * x * (3 - 2 * x);

function FourierAnimation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const trail: { t: number; y: number }[] = [];

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);

      // jumlah suku berubah halus 1 → MAX_TERMS → 1
      const wave = 0.5 - 0.5 * Math.cos(t * 0.28);
      const nf = 1 + (MAX_TERMS - 1) * ease(wave);
      const full = Math.floor(nf);
      const frac = nf - full;
      const count = Math.min(MAX_TERMS, Math.ceil(nf));

      const cx = w * 0.26;
      const cy = h * 0.5;
      const unit = h * 0.27;
      const waveX = w * 0.54;
      const waveW = w - waveX - w * 0.04;

      // sumbu gelombang
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${SOFT}, 0.45)`;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(waveX, cy);
      ctx.lineTo(waveX + waveW, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // rantai lingkaran
      let x = cx;
      let y = cy;
      for (let i = 0; i < count; i++) {
        const k = 2 * i + 1;
        const amp = i < full ? 1 : frac;
        const r = ((4 / (Math.PI * k)) * unit) * amp;
        const ang = k * OMEGA * t;
        const nx = x + r * Math.cos(ang);
        const ny = y - r * Math.sin(ang);

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${SLATE}, ${0.1 + 0.3 * amp})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1.4;
        ctx.strokeStyle = `rgba(${INK}, ${0.35 + 0.5 * amp})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        ctx.fillStyle = `rgba(${INK}, ${0.5 * amp + 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        x = nx;
        y = ny;
      }

      // jejak gelombang
      trail.push({ t, y });
      const span = waveW / FLOW;
      while (trail.length && t - trail[0].t > span) trail.shift();

      const grad = ctx.createLinearGradient(waveX, 0, waveX + waveW, 0);
      grad.addColorStop(0, `rgba(${INK}, 0.95)`);
      grad.addColorStop(1, `rgba(${INK}, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      trail.forEach((p, i) => {
        const px = waveX + (t - p.t) * FLOW;
        if (i === 0) ctx.moveTo(px, p.y);
        else ctx.lineTo(px, p.y);
      });
      ctx.stroke();

      // penghubung ujung → gelombang
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = `rgba(${TEAL}, 0.55)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(waveX, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // ujung dengan halo
      ctx.fillStyle = `rgba(${TEAL}, 0.14)`;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgb(${TEAL})`;
      ctx.beginPath();
      ctx.arc(x, y, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x, y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(4.2);
    });
    ro.observe(wrap);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    let time = 4.2;
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
    <div className="lk-hero__demo lk-wave" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className="lk-wave__canvas"
        role="img"
        aria-label="Lingkaran-lingkaran yang berputar dijumlahkan hingga membentuk gelombang persegi"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Kartu katalog
 * ------------------------------------------------------------------ */
const tex = (s: string) => `\\(${s}\\)`;

function PackCard({ material, no }: { material: Material; no: number }) {
  const sum = useMemo(() => summarize(material), [material]);
  const mixLabel = LEVELS.map((l) => `${LEVEL_LABEL[l]} ${sum.byLevel[l]}`).join(", ");
  return (
    <article className="lk-card">
      <div className="lk-card__top">
        <span className="lk-card__no">{String(no).padStart(2, "0")}</span>
        <span className="lk-card__cat">{CATEGORY_BY_SLUG[material.slug]}</span>
        {material.symbol && (
          <span className="lk-card__sym" aria-hidden>
            <Rich as="span" html={tex(material.symbol)} />
          </span>
        )}
      </div>

      <h3>{material.topic}</h3>
      <p className="lk-card__desc">{material.description}</p>

      <ul className="lk-facts">
        <li>{sum.questions} soal</li>
        {material.durationMinutes && <li>{material.durationMinutes} menit</li>}
        <li>{sum.points} poin</li>
      </ul>

      <div className="lk-mix" role="img" aria-label={`Komposisi tingkat kesulitan: ${mixLabel}`}>
        {LEVELS.filter((l) => sum.byLevel[l] > 0).map((l) => (
          <span key={l} className={`lk-mix__seg lk-mix__seg--${l}`} style={{ flexGrow: sum.byLevel[l] }} />
        ))}
      </div>
      <p className="lk-mix__legend">
        {LEVELS.filter((l) => sum.byLevel[l] > 0).map((l) => (
          <span key={l}>
            <i className={`lk-dot lk-dot--${l}`} aria-hidden />
            {LEVEL_LABEL[l]} {sum.byLevel[l]}
          </span>
        ))}
      </p>
      <p className="lk-card__types">{sum.parts.join("  ·  ")}</p>

      <Link to={HREF.pack(material.slug)} className="lk-card__go">
        Mulai latihan <span aria-hidden>→</span>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 *  Halaman
 * ------------------------------------------------------------------ */
export default function LatihanLanding() {
  useSeo({
    title: "Latihan Soal Matematika",
    description: "Paket latihan soal matematika berjenjang dari mudah sampai HOTS, dengan umpan balik seketika dan pembahasan langkah demi langkah.",
    path: "/latihan",
  });

  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Semua");

  const packs = useMemo(() => MATERIALS.map((m) => ({ m, s: summarize(m) })), []);
  const totals = useMemo(() => {
    const types = new Set<string>();
    let questions = 0;
    for (const { s } of packs) {
      questions += s.questions;
      s.types.forEach((t) => types.add(t));
    }
    return { packs: packs.length, questions, forms: types.size };
  }, [packs]);

  const shown = MATERIALS.map((m, i) => ({ m, no: i + 1 })).filter(
    ({ m }) => cat === "Semua" || CATEGORY_BY_SLUG[m.slug] === cat,
  );

  return (
    <div className="lk">
      <SiteHeader />

      <main>
        {/* ---------------------------- Hero ---------------------------- */}
        <section className="lk-hero">
          <div className="lk-wrap lk-hero__grid">
            <div className="lk-hero__copy">
              <p className="lk-eyebrow">Latihan soal</p>
              <h1>Berlatih, lalu pahami mengapa jawabanmu benar.</h1>
              <p className="lk-lead">
                Paket latihan 1729 disusun berjenjang dari mudah sampai HOTS. Pilih jawaban, lihat hasilnya seketika, dan
                buka pembahasan saat kamu siap.
              </p>
              <div className="lk-cta">
                <a href="#katalog" className="lk-btn lk-btn--solid">
                  Pilih latihan <span aria-hidden>→</span>
                </a>
                <a href="#unduhan" className="lk-btn lk-btn--ghost">
                  Unduh
                </a>
              </div>

              <dl className="lk-stats">
                <div>
                  <dt>Paket</dt>
                  <dd>{totals.packs}</dd>
                </div>
                <div>
                  <dt>Soal</dt>
                  <dd>{totals.questions}</dd>
                </div>
                <div>
                  <dt>Bentuk soal</dt>
                  <dd>{totals.forms}</dd>
                </div>
              </dl>
            </div>

            <FourierAnimation />
          </div>
        </section>

        {/* -------------------------- Unduhan --------------------------- */}
        <section className="lk-section lk-downloads" id="unduhan">
          <div className="lk-wrap">
            <p className="lk-eyebrow">Bahan belajar</p>
            <h2 className="lk-h2">Unduh latihan soal.</h2>
            <div className="lk-download-grid">
              <article className="lk-download-card">
                <div className="lk-download-card__copy">
                  <span className="lk-download-card__meta">TKA · SMA · 2026</span>
                  <h3>Latihan soal TKA SMA 2026</h3>
                  <p>Unduh paket latihan dalam format ZIP untuk dikerjakan secara luring.</p>
                </div>
                <a
                  className="lk-btn lk-btn--solid lk-download-card__button"
                  href="https://tpaknparzpagspfgwigx.supabase.co/storage/v1/object/public/slide-berdasarkan-kelas/1729/latihan_soal_TKA_SMA_2026.zip"
                  download
                >
                  Unduh berkas <span aria-hidden="true">↓</span>
                </a>
              </article>
              <article className="lk-download-card">
                <div className="lk-download-card__copy">
                  <span className="lk-download-card__meta">TKA · SMP · 2026</span>
                  <h3>Latihan soal TKA SMP 2026</h3>
                  <p>Unduh paket latihan dalam format ZIP untuk dikerjakan secara luring.</p>
                </div>
                <a
                  className="lk-btn lk-btn--solid lk-download-card__button"
                  href="https://tpaknparzpagspfgwigx.supabase.co/storage/v1/object/public/slide-berdasarkan-kelas/1729/latihan_soal_TKA_SMP_2026.zip"
                  download
                >
                  Unduh berkas <span aria-hidden="true">↓</span>
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* -------------------------- Pernyataan ------------------------- */}
        <section className="lk-section lk-section--wash">
          <div className="lk-wrap">
            <p className="lk-statement">
              Jawab dulu. <span>Pembahasan menyusul.</span>
            </p>
          </div>
        </section>

        {/* ----------------------------- Fitur --------------------------- */}
        <section className="lk-section" id="fitur">
          <div className="lk-wrap">
            <p className="lk-eyebrow">Fitur</p>
            <h2 className="lk-h2">Dirancang agar kamu fokus pada soalnya.</h2>
            <div className="lk-features">
              {FEATURES.map((f) => (
                <div className="lk-feature" key={f.no}>
                  <span className="lk-feature__no">{f.no}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------- Katalog -------------------------- */}
        <section className="lk-section lk-section--wash" id="katalog">
          <div className="lk-wrap">
            <p className="lk-eyebrow">Katalog</p>
            <h2 className="lk-h2">Pilih paket latihan yang ingin kamu kerjakan.</h2>

            <div className="lk-filter" role="group" aria-label="Filter kategori">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  className="lk-chip"
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="lk-grid">
              {shown.map(({ m, no }) => (
                <PackCard material={m} no={no} key={m.slug} />
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- Cara belajar ---------------------- */}
        <section className="lk-section lk-section--ink" id="cara">
          <div className="lk-wrap lk-why">
            <div>
              <p className="lk-eyebrow">Cara belajar</p>
              <h2 className="lk-h2">Salah adalah bagian dari proses, bukan akhir dari latihan.</h2>
            </div>
            <ol className="lk-steps">
              {STEPS.map((s) => (
                <li key={s.no}>
                  <span className="lk-steps__no">{s.no}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------ CTA ---------------------------- */}
        <section className="lk-section lk-final">
          <div className="lk-wrap">
            <h2 className="lk-h2">Mulai dari satu paket.</h2>
            <p className="lk-lead">Pilih topik di katalog dan kerjakan sekarang.</p>
            <div className="lk-cta lk-cta--center">
              <a href="#katalog" className="lk-btn lk-btn--solid">
                Buka katalog <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
