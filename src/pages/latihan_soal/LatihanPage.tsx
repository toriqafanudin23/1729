import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import "katex/dist/katex.min.css";
import "./styles/LatihanPage.css";
import { SectionBlock } from "./components/SectionBlock";
import { ScoreBar } from "./components/ScoreBar";
import { Rich } from "./components/Rich";
import { getMaterial } from "./data";
import { QuizProvider } from "./state/QuizContext";
import type { Material } from "./types";

/* ------------------------------------------------------------------ *
 *  Halaman latihan untuk satu materi. Semua isi datang dari `material`.
 * ------------------------------------------------------------------ */
export default function LatihanPage({ material }: { material: Material }) {
  const stats = useMemo(() => {
    let questions = 0;
    let maxPoints = 0;
    const parts = material.sections.map((s) => {
      const n = s.groups.reduce((a, g) => a + g.questions.length, 0);
      questions += n;
      maxPoints += n * s.pointsEach;
      return `${n} ${s.title.toLowerCase()}`;
    });
    return { questions, maxPoints, parts };
  }, [material]);

  return (
    <div className="lt">
      <SiteHeader />

      <QuizProvider material={material}>
        <main>
          <section className="lt-hero">
            <div className="lt-wrap">
              <p className="lt-eyebrow">Latihan soal</p>
              <h1>{material.title}</h1>
              <p className="lt-lead">{material.description}</p>

              <ul className="lt-meta">
                <li>{stats.questions} soal</li>
                {material.durationMinutes && <li>{material.durationMinutes} menit</li>}
                <li>{stats.maxPoints} poin</li>
              </ul>
              <p className="lt-parts">{stats.parts.join("  ·  ")}</p>

              <nav className="lt-toc" aria-label="Bagian soal">
                {material.sections.map((s) => (
                  <a key={s.id} href={`#bagian-${s.id}`}>
                    <span>{s.letter}</span>
                    {s.title}
                  </a>
                ))}
              </nav>

              {material.notes && material.notes.length > 0 && (
                <details className="lt-howto">
                  <summary>Petunjuk dan penskoran</summary>
                  <ul>
                    {material.notes.map((n, i) => (
                      <li key={i}>
                        <Rich as="span" html={n} />
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </section>

          <ScoreBar material={material} />

          <div className="lt-wrap lt-body">
            {material.sections.map((s) => (
              <SectionBlock key={s.id} section={s} />
            ))}
          </div>
        </main>
      </QuizProvider>

      <SiteFooter />
    </div>
  );
}

/** Pembungkus untuk route `/latihan/:slug`. */
export function LatihanRoute() {
  const { slug } = useParams();
  const material = getMaterial(slug);
  if (!material)
    return (
      <div className="lt">
        <div className="lt-wrap lt-hero">
          <h1>Materi tidak ditemukan</h1>
          <p className="lt-lead">Periksa kembali alamat latihan yang kamu buka.</p>
        </div>
        <SiteFooter />
      </div>
    );
  return <LatihanPage key={material.slug} material={material} />;
}
