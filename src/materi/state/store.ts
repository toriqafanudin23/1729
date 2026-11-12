/* Penyimpanan progres Materi di peramban siswa (localStorage).
   Semua akses dibungkus try/catch: mode privat atau data situs yang diblokir
   tidak boleh membuat halaman gagal. */

import type { Question } from "../questions/types.ts";

export type CheckpointStatus = "benar" | "dibuka";

export interface CheckpointRecord {
  /** "benar" = dijawab benar; "dibuka" = siswa melihat pembahasan tanpa menjawab benar. */
  status: CheckpointStatus;
  /** Jumlah jawaban salah sebelum selesai. */
  attempts: number;
  /** Benar pada percobaan pertama, tanpa petunjuk. */
  firstTry: boolean;
  /** Jawaban terakhir siswa (untuk ditampilkan lagi saat halaman dibuka ulang). */
  value?: string;
}

export interface ProgressStore {
  v: 1;
  cp: Record<string, CheckpointRecord>;
  /** Slug bab terakhir yang dibuka. */
  last?: string;
}

const keyOf = (slug: string) => `math1729.materi.v1.${slug}`;
const empty = (): ProgressStore => ({ v: 1, cp: {} });

export function readStore(slug: string): ProgressStore {
  try {
    const raw = window.localStorage.getItem(keyOf(slug));
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<ProgressStore> | null;
    if (!parsed || parsed.v !== 1 || typeof parsed.cp !== "object" || parsed.cp === null) return empty();
    return { v: 1, cp: parsed.cp, last: typeof parsed.last === "string" ? parsed.last : undefined };
  } catch {
    return empty();
  }
}

export function writeStore(slug: string, store: ProgressStore): void {
  try {
    window.localStorage.setItem(keyOf(slug), JSON.stringify(store));
  } catch {
    /* diabaikan: progres hanya berlaku selama halaman terbuka */
  }
}

export function clearStore(slug: string): void {
  try {
    window.localStorage.removeItem(keyOf(slug));
  } catch {
    /* diabaikan */
  }
}

export interface Summary {
  total: number;
  /** Cek poin yang sudah selesai (benar atau pembahasan dibuka). */
  done: number;
  /** Benar pada percobaan pertama. */
  firstTry: number;
  byBab: Record<number, { total: number; done: number; firstTry: number }>;
}

export function summarize(store: ProgressStore, questions: Question[]): Summary {
  const out: Summary = { total: questions.length, done: 0, firstTry: 0, byBab: {} };
  for (const q of questions) {
    const slot = (out.byBab[q.bab] ??= { total: 0, done: 0, firstTry: 0 });
    slot.total += 1;
    const rec = store.cp[q.id];
    if (!rec) continue;
    out.done += 1;
    slot.done += 1;
    if (rec.status === "benar" && rec.firstTry) {
      out.firstTry += 1;
      slot.firstTry += 1;
    }
  }
  return out;
}
