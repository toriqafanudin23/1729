import type { Level, Section } from "../types";
import { useQuiz } from "../state/QuizContext";
import { Question } from "./Question";
import { Rich } from "./Rich";

export const LEVEL_LABEL: Record<Level, string> = {
  mudah: "Mudah",
  sedang: "Sedang",
  sulit: "Sulit",
  hots: "HOTS",
};

export function SectionBlock({ section }: { section: Section }) {
  const { round } = useQuiz();
  return (
    <section className="lt-section" id={`bagian-${section.id}`} aria-labelledby={`h-${section.id}`}>
      <header className="lt-section__head">
        <p className="lt-eyebrow">Bagian {section.letter}</p>
        <h2 className="lt-h2" id={`h-${section.id}`}>
          {section.title}
        </h2>
        {section.instruction && <Rich as="p" className="lt-section__intro" html={section.instruction} />}
      </header>

      {section.groups.map((g, gi) => {
        const nos = g.questions.map((q) => q.no);
        const first = Math.min(...nos);
        const last = Math.max(...nos);
        return (
          <div className="lt-group" key={gi}>
            <div className="lt-group__head">
              <span className={`lt-chip lt-chip--${g.level}`}>{LEVEL_LABEL[g.level]}</span>
              <span className="lt-group__range">{first === last ? `Soal ${first}` : `Soal ${first}–${last}`}</span>
              {g.note && <span className="lt-group__note">{g.note}</span>}
            </div>
            <div className="lt-group__list">
              {g.questions.map((q) => (
                <Question key={`${q.id}-${round}`} q={q} points={section.pointsEach} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
