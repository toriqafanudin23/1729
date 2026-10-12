import { useRef, type FormEvent } from "react";
import type { ShortQuestion as Q, ShortState } from "../types";
import { useQuiz } from "../state/QuizContext";
import { Feedback } from "./Feedback";
import { QuestionCard } from "./QuestionCard";

export function ShortAnswerQuestion({ q, points }: { q: Q; points: number }) {
  const { state, type, checkShort } = useQuiz();
  const s = state[q.id] as ShortState | undefined;
  const value = s?.value ?? "";
  const result = s?.result;
  const locked = result === "benar";
  const input = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (locked) return;
    if (!value.trim()) return input.current?.focus();
    checkShort(q, value, q.answer);
  };

  return (
    <QuestionCard q={q} points={points} result={result ? result === "benar" : null}>
      <form className="lt-short" onSubmit={submit} noValidate>
        <input
          ref={input}
          type="text"
          className={`lt-input${result ? ` is-${result}` : ""}`}
          value={value}
          readOnly={locked}
          onChange={(e) => type(q, e.target.value)}
          placeholder="Tulis jawaban akhirnya saja"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={`Jawaban isian soal ${q.no}`}
        />
        <button type="submit" className="lt-btn lt-btn--solid" disabled={locked}>
          Periksa
        </button>
      </form>

      {result === "benar" && <Feedback kind="ok">Benar!</Feedback>}
      {result === "salah" && (
        <Feedback kind="bad">
          Belum sesuai. Coba lagi, atau buka pembahasan (bentuk jawaban yang setara juga dapat benar).
        </Feedback>
      )}
    </QuestionCard>
  );
}
