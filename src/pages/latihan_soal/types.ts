/* ------------------------------------------------------------------ *
 *  Model data latihan soal.
 *  Materi baru = satu file di data/ yang memenuhi tipe `Material`.
 *  Semua field bertipe `html` boleh memuat tag HTML dan penanda KaTeX
 *  \( ... \) (inline) atau \[ ... \] (display).
 * ------------------------------------------------------------------ */

export type Level = "mudah" | "sedang" | "sulit" | "hots";
export type Mark = "B" | "S"; // Benar / Salah

interface QuestionBase {
  id: string; // unik di dalam materi, mis. "pg-1"
  no: number; // nomor tampil di dalam bagian
  level: Level;
  prompt: string; // html: teks soal
  figure?: string; // svg: gambar, disisipkan setelah `prompt`
  promptAfter?: string; // html: lanjutan soal setelah gambar (mis. daftar a, b, c)
  explanation: string; // html: pembahasan (disembunyikan sampai dibuka)
}

/** Pilihan ganda satu jawaban. */
export interface ChoiceQuestion extends QuestionBase {
  type: "pg";
  options: { key: string; text: string }[];
  answer: string; // key opsi yang benar
}

/** Tabel pernyataan Benar/Salah (pilihan majemuk kompleks). */
export interface StatementQuestion extends QuestionBase {
  type: "tf";
  statements: string[]; // html per baris
  answer: Mark[]; // satu kunci per baris
}

/** Isian singkat. `answer` berisi semua bentuk jawaban yang diterima. */
export interface ShortQuestion extends QuestionBase {
  type: "short";
  answer: string[];
}

/** Uraian: tidak dinilai otomatis, hanya pembahasan. */
export interface EssayQuestion extends QuestionBase {
  type: "essay";
}

export type Question = ChoiceQuestion | StatementQuestion | ShortQuestion | EssayQuestion;

export interface LevelGroup {
  level: Level;
  note?: string; // keterangan tambahan, mis. "Setara UTBK"
  questions: Question[];
}

export interface Section {
  id: string;
  letter: string; // "A", "B", ...
  title: string;
  instruction?: string; // html
  pointsEach: number;
  groups: LevelGroup[];
}

export interface Material {
  slug: string; // dipakai di URL
  title: string;
  topic: string;
  category?: string; // kelompok di katalog, mis. "Kalkulus"
  symbol?: string; // TeX tanpa pembatas, ditampilkan sebagai lambang di kartu katalog
  description: string;
  durationMinutes?: number;
  notes?: string[]; // html: petunjuk pengerjaan
  sections: Section[];
}

/* ---------------------------------------------------------- State --- */

export interface ChoiceState {
  choice?: string;
}
export interface StatementState {
  marks: (Mark | null)[];
  checked: boolean;
}
export interface ShortState {
  value: string;
  result?: "benar" | "salah";
}
export type QuestionState = ChoiceState | StatementState | ShortState;
