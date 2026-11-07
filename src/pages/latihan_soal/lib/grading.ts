import type { ChoiceState, Question, QuestionState, ShortState, StatementState } from "../types";

/** Samakan penulisan jawaban isian: huruf kecil, tanpa spasi, koma desimal → titik. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[*\u00b7\u00d7{}]/g, "")
    .replace(/\u2212/g, "-")
    .replace(/\u00b2/g, "^2")
    .replace(/,/g, ".");
}

export const gradeShort = (value: string, accepted: string[]): boolean => {
  const v = normalize(value);
  return accepted.some((a) => normalize(a) === v);
};

export const gradeStatements = (marks: (string | null)[], key: string[]): boolean =>
  key.every((k, i) => marks[i] === k);

/** true = benar, false = salah, null = belum dijawab / tidak dinilai. */
export function outcome(q: Question, s: QuestionState | undefined): boolean | null {
  if (!s) return null;
  switch (q.type) {
    case "pg": {
      const c = (s as ChoiceState).choice;
      return c ? c === q.answer : null;
    }
    case "tf": {
      const t = s as StatementState;
      return t.checked ? gradeStatements(t.marks, q.answer) : null;
    }
    case "short": {
      const r = (s as ShortState).result;
      return r ? r === "benar" : null;
    }
    default:
      return null;
  }
}
