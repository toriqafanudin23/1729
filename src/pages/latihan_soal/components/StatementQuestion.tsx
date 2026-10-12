import { useState } from "react";
import type { StatementQuestion as Q, StatementState } from "../types";
import { gradeStatements } from "../lib/grading";
import { useQuiz } from "../state/QuizContext";
import { Feedback } from "./Feedback";
import { QuestionCard } from "./QuestionCard";
import { Rich } from "./Rich";

const WORD = { B: "Benar", S: "Salah" } as const;

export function StatementQuestion({ q, points }: { q: Q; points: number }) {
  const { state, mark, checkStatements } = useQuiz();
  const [warn, setWarn] = useState(false);

  const rows = q.statements.length;
  const s = state[q.id] as StatementState | undefined;
  const marks = s?.marks ?? Array<null>(rows).fill(null);
  const checked = !!s?.checked;
  const allCorrect = checked ? gradeStatements(marks, q.answer) : null;

  const submit = () => {
    if (marks.some((m) => !m)) return setWarn(true);
    setWarn(false);
    checkStatements(q, rows);
  };

  return (
    <QuestionCard q={q} points={points} result={allCorrect}>
      <div className="lt-scroll">
        <table className="lt-tf">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Pernyataan</th>
              <th scope="col">Benar</th>
              <th scope="col">Salah</th>
              <th scope="col">
                <span className="lt-sr">Hasil</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {q.statements.map((st, i) => {
              const ok = checked ? marks[i] === q.answer[i] : null;
              return (
                <tr key={i} className={ok === null ? "" : ok ? "is-correct" : "is-wrong"}>
                  <td className="lt-tf__no">{i + 1}</td>
                  <td>
                    <Rich as="span" html={st} />
                  </td>
                  {(["B", "S"] as const).map((v) => (
                    <td className="lt-tf__pick" key={v}>
                      <label>
                        <input
                          type="radio"
                          name={`${q.id}-${i}`}
                          value={v}
                          checked={marks[i] === v}
                          disabled={checked}
                          onChange={() => mark(q, i, rows, v)}
                          aria-label={`Pernyataan ${i + 1} ${WORD[v].toLowerCase()}`}
                        />
                        <span className="lt-dot" />
                      </label>
                    </td>
                  ))}
                  <td className="lt-tf__res" aria-label={ok === null ? undefined : ok ? "Tepat" : "Kurang tepat"}>
                    {ok === null ? "" : ok ? "✓" : "✕"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lt-actions">
        <button type="button" className="lt-btn lt-btn--solid lt-btn--sm" onClick={submit} disabled={checked}>
          Periksa
        </button>
      </div>

      {warn && !checked && <Feedback kind="warn">Pilih Benar atau Salah untuk setiap pernyataan.</Feedback>}
      {checked && (
        <Feedback kind={allCorrect ? "ok" : "bad"}>
          {allCorrect
            ? "Benar! Semua pernyataan sudah tepat."
            : `Belum tepat. Kunci: ${q.answer.map((k) => WORD[k]).join(", ")}.`}
        </Feedback>
      )}
    </QuestionCard>
  );
}
