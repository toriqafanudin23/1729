import { BANGUN_RUANG_QUESTIONS } from "./bangun-ruang-sisi-datar.ts";
import { FUNGSI_KUADRAT_QUESTIONS } from "./fungsi-kuadrat.ts";
import type { Question } from "./types.ts";

export type { Question, InputQuestion, ChoiceQuestion, StatementsQuestion, ChallengeQuestion } from "./types.ts";

/** Kunci = slug materi. Tambahkan satu baris tiap ada materi baru. */
export const QUESTIONS: Record<string, Question[]> = {
  "fungsi-kuadrat": FUNGSI_KUADRAT_QUESTIONS,
  "bangun-ruang-sisi-datar": BANGUN_RUANG_QUESTIONS,
};

export const questionsOf = (slug: string): Question[] => QUESTIONS[slug] ?? [];

/** Soal pada satu bab. `bab` dihitung mulai dari 1. */
export const questionsInBab = (slug: string, bab: number): Question[] => questionsOf(slug).filter((q) => q.bab === bab);

export const findQuestion = (slug: string, id: string): Question | undefined => questionsOf(slug).find((q) => q.id === id);
