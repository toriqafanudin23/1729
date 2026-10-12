import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "katex/dist/katex.min.css";
import "./styles/LatihanPage.css"; // gaya komponen soal untuk contoh di hero
import "./styles/LatihanLanding.css";
import { LEVEL_LABEL } from "./components/SectionBlock";
import { Question } from "./components/Question";
import { Rich } from "./components/Rich";
import { MATERIALS } from "./data";
import { UPCOMING } from "./data/upcoming";
import { summarize } from "./lib/catalog";
import { QuizProvider, useQuiz } from "./state/QuizContext";
import type { ChoiceQuestion, Level, Material } from "./types";

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
 *  Contoh soal di hero: soal sungguhan dari paket pertama.
 * ------------------------------------------------------------------ */
function pickDemo(materials: Material[]) {
  for (const m of materials)
    for (const s of m.sections)
      for (const g of s.groups)
        for (const q of g.questions) {
          if (q.type !== "pg" || q.figure || q.promptAfter || g.level !== "mudah") continue;
          return { material: m, q: q as ChoiceQuestion, points: s.pointsEach };
        }
  return null;
}

function DemoBody({ q, points }: { q: ChoiceQuestion; points: number }) {
  const { round, reset, state } = useQuiz();
  return (
    <>
      <Question key={`${q.id}-${round}`} q={q} points={points} />
      <button type="button" className="lk-demo__again" onClick={reset} disabled={!state[q.id]}>
        Coba lagi
      </button>
    </>
  );
}

function Demo() {
  const demo = useMemo(() => pickDemo(MATERIALS), []);
  if (!demo) return null;
  const { material, q, points } = demo;
  // paket mini berisi satu soal, agar QuizProvider tetap dipakai apa adanya
  const mini: Material = {
    ...material,
    sections: [{ id: "demo", letter: "A", title: "Contoh", pointsEach: points, groups: [{ level: q.level, questions: [q] }] }],
  };
  return (
    <div className="lk-hero__demo">
      <p className="lk-eyebrow lk-demo__cap">Contoh soal · coba jawab</p>
      <QuizProvider material={mini}>
        <div className="lt lk-demo">
          <DemoBody q={q} points={points} />
        </div>
      </QuizProvider>
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
        <span className="lk-card__cat">{material.category ?? "Matematika"}</span>
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

function SoonCard({ topic, category, symbol }: { topic: string; category: string; symbol: string }) {
  return (
    <article className="lk-card lk-card--soon" aria-label={`${topic}, segera hadir`}>
      <div className="lk-card__top">
        <span className="lk-card__no">··</span>
        <span className="lk-card__cat">{category}</span>
        <span className="lk-card__sym" aria-hidden>
          <Rich as="span" html={tex(symbol)} />
        </span>
      </div>
      <h3>{topic}</h3>
      <p className="lk-card__desc">Paket latihan sedang disiapkan.</p>
      <span className="lk-soon">Segera hadir</span>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 *  Halaman
 * ------------------------------------------------------------------ */
export default function LatihanLanding() {
  const [cat, setCat] = useState("Semua");

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

  const categories = useMemo(() => {
    const set = new Set<string>();
    MATERIALS.forEach((m) => set.add(m.category ?? "Matematika"));
    UPCOMING.forEach((u) => set.add(u.category));
    return ["Semua", ...Array.from(set)];
  }, []);

  const shown = MATERIALS.map((m, i) => ({ m, no: i + 1 })).filter(({ m }) => cat === "Semua" || (m.category ?? "Matematika") === cat);
  const soon = UPCOMING.filter((u) => cat === "Semua" || u.category === cat);

  return (
    <div className="lk">
      <header className="lk-nav">
        <div className="lk-wrap lk-nav__in">
          <Link to={HREF.home} className="lk-brand" aria-label="1729 beranda">
            1729
          </Link>
          <nav className="lk-nav__links" aria-label="Utama">
            <a href="#fitur" className="lk-hide-sm">
              Fitur
            </a>
            <a href="#cara" className="lk-hide-sm">
              Cara belajar
            </a>
            <a href="#katalog" className="lk-btn lk-btn--solid lk-btn--sm">
              Pilih latihan
            </a>
          </nav>
        </div>
      </header>

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
                <a href="#cara" className="lk-btn lk-btn--ghost">
                  Lihat cara belajar
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

            <Demo />
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
              {categories.map((c) => (
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
              {soon.map((u) => (
                <SoonCard key={u.topic} {...u} />
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

      <footer className="lk-footer">
        <div className="lk-wrap lk-footer__in">
          <span className="lk-brand">1729</span>
          <span>Memahami matematika secara visual.</span>
          <a href="mailto:pesan.math1729@gmail.com">pesan.math1729@gmail.com</a>
          <a href="https://kelas1729.vercel.app/">Website lama</a>
        </div>
      </footer>
    </div>
  );
}
