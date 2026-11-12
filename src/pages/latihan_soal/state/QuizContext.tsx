import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import type { Mark, Material, Question, QuestionState, ShortState, StatementState } from "../types";
import { gradeShort, outcome } from "../lib/grading";

type Store = Record<string, QuestionState | undefined>;

type Action =
  | { t: "pick"; id: string; choice: string }
  | { t: "mark"; id: string; row: number; rows: number; value: Mark }
  | { t: "checkTf"; id: string; rows: number }
  | { t: "type"; id: string; value: string }
  | { t: "result"; id: string; value: string; result: "benar" | "salah" }
  | { t: "reset" };

function reducer(state: Store, a: Action): Store {
  switch (a.t) {
    case "pick":
      return state[a.id] ? state : { ...state, [a.id]: { choice: a.choice } };
    case "mark": {
      const cur = (state[a.id] as StatementState | undefined) ?? { marks: Array(a.rows).fill(null), checked: false };
      if (cur.checked) return state;
      const marks = cur.marks.slice();
      marks[a.row] = a.value;
      return { ...state, [a.id]: { ...cur, marks } };
    }
    case "checkTf": {
      const cur = state[a.id] as StatementState | undefined;
      if (!cur || cur.checked || cur.marks.length !== a.rows || cur.marks.some((m) => !m)) return state;
      return { ...state, [a.id]: { ...cur, checked: true } };
    }
    case "type": {
      const cur = state[a.id] as ShortState | undefined;
      if (cur?.result === "benar") return state;
      return { ...state, [a.id]: { value: a.value } };
    }
    case "result":
      return { ...state, [a.id]: { value: a.value, result: a.result } };
    case "reset":
      return {};
  }
}

export interface Score {
  total: number; // jumlah soal yang dinilai otomatis di bagian itu
  answered: number;
  correct: number;
}

interface QuizApi {
  state: Store;
  /** Naik tiap kali "Ulangi": dipakai sebagai `key` agar komponen soal dimount ulang. */
  round: number;
  pick: (q: Question, choice: string) => void;
  mark: (q: Question, row: number, rows: number, value: Mark) => void;
  checkStatements: (q: Question, rows: number) => void;
  type: (q: Question, value: string) => void;
  checkShort: (q: Question, value: string, accepted: string[]) => boolean;
  reset: () => void;
  scoreOf: (sectionId: string) => Score;
  points: { earned: number; max: number };
}

const Ctx = createContext<QuizApi | null>(null);

export function QuizProvider({ material, children }: { material: Material; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {});
  const [round, setRound] = useState(0);

  const pick = useCallback((q: Question, choice: string) => dispatch({ t: "pick", id: q.id, choice }), []);
  const mark = useCallback(
    (q: Question, row: number, rows: number, value: Mark) => dispatch({ t: "mark", id: q.id, row, rows, value }),
    [],
  );
  const checkStatements = useCallback((q: Question, rows: number) => dispatch({ t: "checkTf", id: q.id, rows }), []);
  const type = useCallback((q: Question, value: string) => dispatch({ t: "type", id: q.id, value }), []);
  const checkShort = useCallback((q: Question, value: string, accepted: string[]) => {
    const ok = gradeShort(value, accepted);
    dispatch({ t: "result", id: q.id, value, result: ok ? "benar" : "salah" });
    return ok;
  }, []);
  const reset = useCallback(() => {
    dispatch({ t: "reset" });
    setRound((r) => r + 1);
  }, []);

  const api = useMemo<QuizApi>(() => {
    const bySection = new Map<string, Score>();
    let earned = 0;
    let max = 0;
    for (const s of material.sections) {
      const sc: Score = { total: 0, answered: 0, correct: 0 };
      for (const g of s.groups)
        for (const q of g.questions) {
          if (q.type === "essay") continue;
          sc.total++;
          max += s.pointsEach;
          const o = outcome(q, state[q.id]);
          if (o !== null) sc.answered++;
          if (o) {
            sc.correct++;
            earned += s.pointsEach;
          }
        }
      bySection.set(s.id, sc);
    }
    return {
      state,
      round,
      pick,
      mark,
      checkStatements,
      type,
      checkShort,
      reset,
      scoreOf: (id) => bySection.get(id) ?? { total: 0, answered: 0, correct: 0 },
      points: { earned, max },
    };
  }, [material, state, round, pick, mark, checkStatements, type, checkShort, reset]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useQuiz(): QuizApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useQuiz harus dipakai di dalam <QuizProvider>");
  return v;
}
