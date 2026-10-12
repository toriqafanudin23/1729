import type { ChoiceQuestion as Q, ChoiceState } from "../types";
import { useQuiz } from "../state/QuizContext";
import { Feedback } from "./Feedback";
import { QuestionCard } from "./QuestionCard";
import { Rich } from "./Rich";

export function ChoiceQuestion({ q, points }: { q: Q; points: number }) {
  const { state, pick } = useQuiz();
  const chosen = (state[q.id] as ChoiceState | undefined)?.choice;
  const done = chosen !== undefined;
  const correct = done ? chosen === q.answer : null;

  return (
    <QuestionCard q={q} points={points} result={correct}>
      <div className="lt-options" role="radiogroup" aria-label={`Pilihan jawaban soal ${q.no}`}>
        {q.options.map((o) => {
          const isKey = o.key === q.answer;
          const isChosen = chosen === o.key;
          const cls = [
            "lt-opt",
            done && "is-locked",
            done && isKey && "is-correct",
            done && isChosen && !isKey && "is-wrong",
            done && !isKey && !isChosen && "is-dim",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <label className={cls} key={o.key}>
              <input
                type="radio"
                name={q.id}
                value={o.key}
                checked={isChosen}
                disabled={done}
                onChange={() => pick(q, o.key)}
              />
              <span className="lt-opt__key">{o.key}</span>
              <Rich as="span" className="lt-opt__text" html={o.text} />
              <span className="lt-opt__mark" aria-hidden>
                {done && isKey ? "✓" : done && isChosen ? "✕" : ""}
              </span>
            </label>
          );
        })}
      </div>

      {done && (
        <Feedback kind={correct ? "ok" : "bad"}>
          {correct ? `Benar! Jawaban yang tepat adalah ${q.answer}.` : `Belum tepat. Jawaban yang benar adalah ${q.answer}.`}
        </Feedback>
      )}
    </QuestionCard>
  );
}
