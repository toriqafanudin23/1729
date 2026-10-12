import type { ReactNode } from "react";
import type { Question } from "../types";
import { Explanation } from "./Explanation";
import { Figure, Rich } from "./Rich";

interface Props {
  q: Question;
  points: number;
  /** true = benar, false = salah, null = belum dijawab. */
  result: boolean | null;
  children?: ReactNode;
}

/** Kerangka satu soal: nomor, teks, gambar, area jawaban (children), pembahasan. */
export function QuestionCard({ q, points, result, children }: Props) {
  const status = result === null ? "idle" : result ? "benar" : "salah";
  return (
    <article className="lt-q" data-status={status} data-type={q.type}>
      <header className="lt-q__head">
        <h4 className="lt-q__no">Soal {q.no}</h4>
        <span className="lt-q__meta">
          {status !== "idle" && (
            <span className={`lt-badge lt-badge--${status}`}>{status === "benar" ? "Benar" : "Belum tepat"}</span>
          )}
          <span className="lt-q__points">{points} poin</span>
        </span>
      </header>

      <Rich className="lt-q__prompt" html={q.prompt} />
      {q.figure && <Figure svg={q.figure} />}
      {q.promptAfter && <Rich className="lt-q__prompt" html={q.promptAfter} />}

      {children}

      <Explanation html={q.explanation} />
    </article>
  );
}
