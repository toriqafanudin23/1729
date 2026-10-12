import type { Material } from "../types";
import { useQuiz } from "../state/QuizContext";

/** Ringkasan skor yang menempel di bawah navigasi. Hanya bagian yang dinilai otomatis. */
export function ScoreBar({ material }: { material: Material }) {
  const { scoreOf, points, reset } = useQuiz();
  const graded = material.sections.map((s) => ({ s, sc: scoreOf(s.id) })).filter((x) => x.sc.total > 0);

  return (
    <div className="lt-score" role="status" aria-live="polite">
      <div className="lt-wrap lt-score__in">
        <dl className="lt-score__items">
          {graded.map(({ s, sc }) => (
            <div className="lt-score__item" key={s.id}>
              <dt>{s.title}</dt>
              <dd>
                <strong>{sc.correct}</strong>
                <span>/{sc.total}</span>
                <em>{sc.answered} dijawab</em>
              </dd>
            </div>
          ))}
          <div className="lt-score__item lt-score__item--pts">
            <dt>Skor otomatis</dt>
            <dd>
              <strong>{points.earned}</strong>
              <span>/{points.max}</span>
            </dd>
          </div>
        </dl>
        <button type="button" className="lt-btn lt-btn--ghost lt-btn--sm" onClick={reset}>
          Ulangi semua
        </button>
      </div>
    </div>
  );
}
