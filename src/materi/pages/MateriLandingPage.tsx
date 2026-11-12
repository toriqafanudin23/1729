import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CpBadges, CpFilter } from "../../components/CpFilter";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { CP_MATERI, EMPTY_CP_FILTER, matchesCp, type CpFilterState } from "../../curriculum/cp";
import { SimThumb } from "../../pages/SimThumbs";
import { MATERI_HUB_SEO } from "../../seoText";
import { useSeo } from "../../useSeo";
import { MATERI, materiPath, totalMinutes, type MateriMeta } from "../materi.ts";
import { questionsOf } from "../questions/index.ts";
import { readStore, summarize } from "../state/store.ts";
import "../../pages/pages.css";
import "../styles/materi.css";

/** Parabola mini yang bisa digeser: contoh nyata dari cara kerja materi. */
function HeroSpecimen() {
  const [a, setA] = useState(0.6);
  const X = (x: number) => 160 + x * 34;
  const Y = (y: number) => 150 - y * 26;
  const points = Array.from({ length: 41 }, (_, i) => {
    const x = -4 + (8 * i) / 40;
    const y = a * x * x - 2;
    return Y(y) > -20 && Y(y) < 240 ? `${X(x).toFixed(1)},${Y(y).toFixed(1)}` : null;
  }).filter(Boolean);
  const dir = a === 0 ? "bukan fungsi kuadrat" : a > 0 ? "membuka ke atas" : "membuka ke bawah";

  return (
    <figure className="mt-specimen">
      <figcaption>Contoh isi materi: geser a, amati parabolanya</figcaption>
      <svg viewBox="0 0 320 220" role="img" aria-label={`Parabola y = ${a.toFixed(1).replace(".", ",")}x² − 2, ${dir}`}>
        <g stroke="#e8e6dc">
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((x) => (
            <line key={`x${x}`} x1={X(x)} x2={X(x)} y1="0" y2="220" />
          ))}
          {[-2, -1, 1, 2, 3, 4].map((y) => (
            <line key={`y${y}`} x1="0" x2="320" y1={Y(y)} y2={Y(y)} />
          ))}
        </g>
        <g stroke="#9c9a92" strokeWidth="1.4">
          <line x1="0" x2="320" y1={Y(0)} y2={Y(0)} />
          <line x1={X(0)} x2={X(0)} y1="0" y2="220" />
        </g>
        {points.length > 1 && <polyline points={points.join(" ")} fill="none" stroke="#4a7aa8" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />}
        {a !== 0 && <circle cx={X(0)} cy={Y(-2)} r="5.5" fill="#c28a00" stroke="#fff" strokeWidth="1.5" />}
      </svg>
      <div className="mt-specimen__ctl">
        <label htmlFor="mt-hero-a">
          <i>a</i> = <output>{a.toFixed(1).replace(".", ",").replace("-", "\u2212")}</output>
        </label>
        <input id="mt-hero-a" type="range" min={-2} max={2} step={0.1} value={a} onChange={(e) => setA(Math.round(parseFloat(e.target.value) * 10) / 10)} aria-label="Nilai a" />
      </div>
      <p className="mt-specimen__q" aria-live="polite">
        Parabola ini <b>{dir}</b>. Di dalam materi, tiap simulasi diikuti pertanyaan yang langsung memeriksa jawabanmu.
      </p>
    </figure>
  );
}

function MateriCard({ m, index }: { m: MateriMeta; index: number }) {
  // Progres dibaca saat kartu dimuat; materi dibuka di tab ini selalu menulis ulang nilainya.
  const progress = useMemo(() => summarize(readStore(m.slug), questionsOf(m.slug)), [m.slug]);
  const started = progress.done > 0;
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const cps = questionsOf(m.slug).length;

  return (
    <li>
      <Link to={materiPath(m.slug)} className="sp-card" aria-labelledby={`materi-${m.slug}-judul`} aria-describedby={`materi-${m.slug}-ringkasan`}>
        <div className="sp-card__thumb" aria-hidden>
          <SimThumb slug={m.slug} title={m.title} glyph={m.glyph} />
        </div>
        <div className="sp-card__body">
          <p className="sp-card__meta">
            <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            <span>{m.category}</span>
          </p>
          <h3 className="sp-card__title" id={`materi-${m.slug}-judul`}>
            {m.title}
          </h3>
          <p className="sp-card__summary" id={`materi-${m.slug}-ringkasan`}>
            {m.summary}
          </p>
          <CpBadges tags={CP_MATERI[m.slug]} max={2} />
          <ul className="mt-facts" aria-label="Isi materi">
            <li>{m.bab.length} bab</li>
            <li>{cps} cek poin</li>
            <li>±{Math.round(totalMinutes(m) / 10) * 10} menit</li>
          </ul>
          {started && (
            <div className="mt-minibar" role="img" aria-label={`Progres ${pct} persen`}>
              <span style={{ width: `${pct}%` }} />
            </div>
          )}
          <div className="sp-card__foot">
            <span>{started ? `${progress.done}/${progress.total} cek poin selesai` : m.kelas}</span>
            <span className="sp-card__go">{started ? "Lanjutkan" : "Mulai"} <span aria-hidden>→</span></span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function MateriLandingPage() {
  const [cpFilter, setCpFilter] = useState<CpFilterState>(EMPTY_CP_FILTER);
  useSeo({ ...MATERI_HUB_SEO, path: "/materi" });

  const visible = MATERI.filter((m) => matchesCp(CP_MATERI[m.slug], [m.title, m.category, m.summary, m.kelas, ...m.concepts], cpFilter));

  return (
    <div className="sp mt-landing">
      <SiteHeader />

      <header className="mt-hero">
        <div className="sp-wrap mt-hero__grid">
          <div className="mt-hero__copy">
            <p className="sp-eyebrow">Materi</p>
            <h1 className="sp-h1">Materi yang bisa kamu coba sendiri.</h1>
            <p className="sp-lead">
              Setiap bab memadukan penjelasan ringkas, simulasi interaktif, dan cek poin yang langsung memeriksa jawabanmu. Disusun mengikuti Capaian Pembelajaran Kurikulum Merdeka.
            </p>
            <div className="mt-hero__cta">
              <Link className="sp-btn sp-btn--solid" to={materiPath(MATERI[0].slug)}>
                Mulai belajar {MATERI[0].title.toLowerCase()}
              </Link>
              <a className="sp-btn sp-btn--ghost" href="#katalog">
                Lihat katalog
              </a>
            </div>
          </div>
          <HeroSpecimen />
        </div>
      </header>

      <section className="mt-how" aria-labelledby="mt-how-h">
        <div className="sp-wrap">
          <h2 className="mt-how__h" id="mt-how-h">
            Cara belajarnya
          </h2>
          <ol className="mt-how__list">
            <li>
              <b>Baca</b>
              <span>Pemantik singkat dan penjelasan konsep tanpa bertele-tele.</span>
            </li>
            <li>
              <b>Coba</b>
              <span>Geser slider pada simulasi, amati apa yang berubah, dan temukan polanya sendiri.</span>
            </li>
            <li>
              <b>Periksa</b>
              <span>Jawab cek poin. Jawaban salah mendapat petunjuk bertahap, jawaban benar mendapat pembahasan.</span>
            </li>
          </ol>
        </div>
      </section>

      <main className="sp-catalog" id="katalog">
        <div className="sp-wrap">
          <p className="sp-eyebrow">Katalog</p>
          <h2 className="sp-h1 sp-h1--sm">Pilih materi</h2>
          <p className="sp-lead sp-catalog__lead">
            {MATERI.length} materi tersedia. Progresmu tersimpan di peramban ini, tanpa perlu akun.
          </p>

          <CpFilter value={cpFilter} onChange={setCpFilter} total={MATERI.length} shown={visible.length} placeholder="Cari materi, konsep, atau Capaian Pembelajaran…" />

          <ul className="sp-cards" aria-label="Daftar materi">
            {visible.map((m, i) => (
              <MateriCard key={m.slug} m={m} index={i} />
            ))}
            {visible.length === MATERI.length && (
              <li>
                <div className="mt-soon">
                  <p className="mt-soon__title">Materi berikutnya sedang disusun</p>
                  <p>Sambil menunggu, jelajahi simulasi, slide, dan latihan soal yang sudah tersedia.</p>
                  <p className="mt-soon__links">
                    <Link to="/simulasi">Simulasi</Link>
                    <Link to="/slides">Slides</Link>
                    <Link to="/latihan">Latihan soal</Link>
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
