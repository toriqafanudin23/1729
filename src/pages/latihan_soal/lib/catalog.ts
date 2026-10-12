import type { Level, Material } from "../types";

export interface PackSummary {
  questions: number;
  points: number;
  byLevel: Record<Level, number>;
  /** Rincian per bentuk soal, mis. "20 pilihan ganda". */
  parts: string[];
  types: Set<string>;
}

/** Ringkasan satu paket, dihitung dari datanya sendiri (tidak ada angka yang ditulis tangan). */
export function summarize(m: Material): PackSummary {
  const byLevel: Record<Level, number> = { mudah: 0, sedang: 0, sulit: 0, hots: 0 };
  const types = new Set<string>();
  let questions = 0;
  let points = 0;
  const parts = m.sections.map((s) => {
    let n = 0;
    for (const g of s.groups)
      for (const q of g.questions) {
        n++;
        byLevel[g.level]++;
        types.add(q.type);
      }
    questions += n;
    points += n * s.pointsEach;
    return `${n} ${s.title.toLowerCase()}`;
  });
  return { questions, points, byLevel, parts, types };
}
