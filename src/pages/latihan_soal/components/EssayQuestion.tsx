import type { EssayQuestion as Q } from "../types";
import { QuestionCard } from "./QuestionCard";

/** Uraian tidak dinilai otomatis: kerjakan di kertas, lalu bandingkan dengan pembahasan. */
export function EssayQuestion({ q, points }: { q: Q; points: number }) {
  return (
    <QuestionCard q={q} points={points} result={null}>
      <p className="lt-note">Kerjakan di kertas, lalu bandingkan dengan pembahasan dan pedoman penskoran.</p>
    </QuestionCard>
  );
}
