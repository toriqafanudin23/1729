import type { AnswerSpec } from "../lib/answer.ts";

/* Teks soal, petunjuk, dan pembahasan berupa HTML dengan rumus \( ... \) atau \[ ... \]
   (dirender KaTeX oleh komponen <Rich>). Isinya berasal dari berkas ini, bukan input pengguna. */

interface Base {
  /** Unik di seluruh materi, contoh "b3-faktor1". Dipakai untuk menyimpan progres. */
  id: string;
  /** Nomor bab (mulai dari 1). */
  bab: number;
  prompt: string;
  /** Pembahasan; tampil setelah siswa menjawab benar atau menyerah. */
  explanation: string;
  /** Petunjuk bertahap; dibuka siswa satu per satu setelah salah menjawab. */
  hints?: string[];
}

export interface InputQuestion extends Base {
  type: "input";
  spec: AnswerSpec;
  unit?: string;
  placeholder?: string;
  /** Contoh penulisan jawaban, ditampilkan di bawah kolom isian. */
  format?: string;
  /** Kesalahan umum: bila jawaban siswa cocok, tampilkan pesan khusus. */
  wrong?: { spec: AnswerSpec; message: string }[];
}

export interface ChoiceQuestion extends Base {
  type: "choice";
  options: string[];
  /** Indeks pilihan benar (mulai dari 0). */
  answer: number;
}

export interface StatementsQuestion extends Base {
  type: "statements";
  items: { text: string; answer: boolean }[];
  /** Label dua tombol: [untuk true, untuk false]. */
  labels?: [string, string];
}

/** Cek poin berbasis simulasi: kondisi dinilai oleh fungsi `check` di komponen bab. */
export interface ChallengeQuestion extends Base {
  type: "challenge";
}

export type Question = InputQuestion | ChoiceQuestion | StatementsQuestion | ChallengeQuestion;
