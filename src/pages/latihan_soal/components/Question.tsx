import type { ComponentType } from "react";
import type { Question as QuestionModel } from "../types";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { EssayQuestion } from "./EssayQuestion";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";
import { StatementQuestion } from "./StatementQuestion";

type Renderer<T extends QuestionModel["type"]> = ComponentType<{
  q: Extract<QuestionModel, { type: T }>;
  points: number;
}>;

/**
 * Registri tipe soal → komponen.
 * Tipe soal baru (mis. menjodohkan, grafik interaktif): tambah tipe di types.ts,
 * buat komponennya, lalu daftarkan di sini.
 */
const REGISTRY: { [T in QuestionModel["type"]]: Renderer<T> } = {
  pg: ChoiceQuestion,
  tf: StatementQuestion,
  short: ShortAnswerQuestion,
  essay: EssayQuestion,
};

export function Question({ q, points }: { q: QuestionModel; points: number }) {
  const Component = REGISTRY[q.type] as ComponentType<{ q: QuestionModel; points: number }>;
  return <Component q={q} points={points} />;
}
