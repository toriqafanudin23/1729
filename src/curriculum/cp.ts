/* ------------------------------------------------------------------ *
 *  Pemetaan Capaian Pembelajaran (CP) Matematika Kurikulum Merdeka.
 *
 *  Setiap simulasi, deck slide, dan paket latihan diberi satu atau lebih tag:
 *  fase + elemen + fokus. "fokus" adalah RINGKASAN singkat (bukan kutipan
 *  resmi) agar guru cepat menemukan materi yang cocok dengan CP-nya.
 *  Rujukan resmi tetap dokumen CP Matematika dari Kemendikdasmen
 *  (https://guru.kemdikbud.go.id/kurikulum/referensi-penerapan/capaian-pembelajaran/).
 *
 *  Menambah materi baru: tambahkan satu entri pada CP_SIMULASI / CP_SLIDE /
 *  CP_LATIHAN (kuncinya sama dengan slug materinya).
 *
 *  Fase D = kelas 7-9 (SMP), E = kelas 10, F = kelas 11-12.
 *  `lanjut: true`  → bagian Matematika Tingkat Lanjut (Fase F).
 *  `pengayaan: true` → topik di luar rumusan CP; dipakai sebagai pengayaan.
 * ------------------------------------------------------------------ */

export type Fase = "D" | "E" | "F";
export type Elemen =
  | "Bilangan"
  | "Aljabar"
  | "Aljabar dan Fungsi"
  | "Pengukuran"
  | "Geometri"
  | "Analisis Data dan Peluang"
  | "Kalkulus";

export interface CpTag {
  fase: Fase;
  elemen: Elemen;
  fokus: string;
  lanjut?: boolean;
  pengayaan?: boolean;
}

export const FASE_INFO: Record<Fase, { label: string; kelas: string }> = {
  D: { label: "Fase D", kelas: "Kelas 7–9 (SMP)" },
  E: { label: "Fase E", kelas: "Kelas 10" },
  F: { label: "Fase F", kelas: "Kelas 11–12" },
};

export const FASE_LIST: Fase[] = ["D", "E", "F"];

/** Elemen untuk filter. "Aljabar" (Fase D) dan "Aljabar dan Fungsi" (E, F) digabung. */
export const ELEMEN_FILTER = [
  "Bilangan",
  "Aljabar dan Fungsi",
  "Pengukuran",
  "Geometri",
  "Analisis Data dan Peluang",
  "Kalkulus",
] as const;
export type ElemenFilter = (typeof ELEMEN_FILTER)[number];

export const elemenGroup = (elemen: Elemen): ElemenFilter =>
  elemen === "Aljabar" ? "Aljabar dan Fungsi" : elemen;

/** "Fase E · Aljabar dan Fungsi" (+ catatan Mat. Lanjut / Pengayaan). */
export function cpLabel(tag: CpTag): string {
  const note = tag.lanjut ? " (Mat. Lanjut)" : tag.pengayaan ? " (Pengayaan)" : "";
  return `Fase ${tag.fase} · ${tag.elemen}${note}`;
}

/* ───────── Pemetaan ───────── */

const d = (elemen: Elemen, fokus: string, extra: Partial<CpTag> = {}): CpTag => ({ fase: "D", elemen, fokus, ...extra });
const e = (elemen: Elemen, fokus: string, extra: Partial<CpTag> = {}): CpTag => ({ fase: "E", elemen, fokus, ...extra });
const f = (elemen: Elemen, fokus: string, extra: Partial<CpTag> = {}): CpTag => ({ fase: "F", elemen, fokus, ...extra });

const LANJUT = { lanjut: true } as const;
const PENGAYAAN = { pengayaan: true } as const;

const T = {
  kuadrat: [
    d("Aljabar", "Fungsi nonlinear (kuadrat) dan grafiknya"),
    e("Aljabar dan Fungsi", "Persamaan dan fungsi kuadrat"),
  ],
  transformasiGeometri: [
    d("Geometri", "Transformasi: translasi, refleksi, rotasi, dilatasi"),
    f("Aljabar dan Fungsi", "Matriks untuk transformasi geometri", LANJUT),
  ],
  trigonometri: [
    e("Geometri", "Perbandingan trigonometri pada segitiga siku-siku"),
    f("Aljabar dan Fungsi", "Fungsi trigonometri dan lingkaran satuan", LANJUT),
  ],
  vektor: [f("Geometri", "Vektor pada bidang datar dan operasi aljabarnya", LANJUT)],
  sistemLinear: [
    d("Aljabar", "Sistem persamaan linear"),
    e("Aljabar dan Fungsi", "Sistem persamaan dan pertidaksamaan linear"),
  ],
  irisanKerucut: [f("Geometri", "Lingkaran, elips, dan persamaan garis singgung", LANJUT)],
  lingkaran: [
    d("Pengukuran", "Keliling dan luas lingkaran"),
    f("Geometri", "Teorema lingkaran, panjang busur, dan luas juring"),
  ],
  transformasiFungsi: [f("Aljabar dan Fungsi", "Transformasi fungsi (linear, kuadrat, eksponensial)")],
  matriks: [f("Aljabar dan Fungsi", "Data dalam bentuk matriks dan operasinya")],
  limit: [f("Kalkulus", "Limit sebagai dasar laju perubahan", LANJUT)],
  turunan: [f("Kalkulus", "Laju perubahan sesaat, turunan, garis singgung, dan optimasi", LANJUT)],
  integral: [f("Kalkulus", "Integral sebagai kebalikan turunan dan penghitung luas", LANJUT)],
  bilanganKompleks: [e("Bilangan", "Bilangan kompleks", PENGAYAAN)],
};

/** Kunci = slug di pages/simulations.ts */
export const CP_SIMULASI: Record<string, CpTag[]> = {
  "fungsi-kuadrat": T.kuadrat,
  "transformasi-geometri": T.transformasiGeometri,
  trigonometri: T.trigonometri,
  vektor: T.vektor,
  "sistem-linear": [...T.sistemLinear, e("Aljabar dan Fungsi", "Sistem pertidaksamaan linear dan program linear")],
  "irisan-kerucut": T.irisanKerucut,
  "sektor-lingkaran": T.lingkaran,
  "titik-istimewa-segitiga": [d("Geometri", "Garis dan titik istimewa segitiga", PENGAYAAN)],
  "teorema-pythagoras": [d("Geometri", "Teorema Pythagoras dan penerapannya")],
  "garis-singgung-dua-lingkaran": [f("Geometri", "Teorema lingkaran dan garis singgung persekutuan", PENGAYAAN)],
  "transformasi-fungsi": T.transformasiFungsi,
  "plotter-grafik": [
    e("Aljabar dan Fungsi", "Grafik fungsi kuadrat, eksponensial, dan logaritma"),
    f("Aljabar dan Fungsi", "Berbagai fungsi untuk memodelkan fenomena", LANJUT),
  ],
  turunan: T.turunan,
  integral: T.integral,
};

/** Kunci = slug di slides/slides.ts */
export const CP_SLIDE: Record<string, CpTag[]> = {
  "himpunan-relasi-fungsi": [
    d("Aljabar", "Relasi dan fungsi"),
    e("Aljabar dan Fungsi", "Fungsi: domain, range, dan jenis fungsi"),
  ],
  "sistem-persamaan-linear": T.sistemLinear,
  "pertidaksamaan-linear": [
    d("Aljabar", "Pertidaksamaan linear satu variabel"),
    e("Aljabar dan Fungsi", "Pertidaksamaan linear dan nilai mutlak"),
  ],
  "program-linear": [e("Aljabar dan Fungsi", "Sistem pertidaksamaan linear dan program linear")],
  "fungsi-kuadrat": T.kuadrat,
  "bilangan-kompleks": T.bilanganKompleks,
  matriks: T.matriks,
  lingkaran: T.lingkaran,
  "bangun-ruang-sisi-datar": [d("Pengukuran", "Luas permukaan dan volume bangun ruang sisi datar")],
  "kesebangunan-kekongruenan": [d("Geometri", "Kesebangunan dan kekongruenan bangun datar")],
  "transformasi-geometri": T.transformasiGeometri,
  "irisan-kerucut": T.irisanKerucut,
  "limit-turunan": [...T.limit, ...T.turunan],
};

/** Kunci = slug di pages/latihan_soal/catalog.ts */
export const CP_LATIHAN: Record<string, CpTag[]> = {
  "eksponen-logaritma": [
    e("Bilangan", "Bilangan berpangkat (eksponen) dan logaritma"),
    e("Aljabar dan Fungsi", "Fungsi eksponensial dan grafiknya"),
  ],
  "barisan-deret": [e("Bilangan", "Barisan dan deret aritmetika dan geometri")],
  sppl: T.sistemLinear.slice(1),
  "fungsi-kuadrat": T.kuadrat.slice(1),
  "perbandingan-trigonometri": T.trigonometri.slice(0, 1),
  vektor: T.vektor,
  statistika: [e("Analisis Data dan Peluang", "Penyajian dan ukuran pemusatan serta penyebaran data")],
  "bilangan-kompleks": T.bilanganKompleks,
  "komposisi-fungsi-invers": [f("Aljabar dan Fungsi", "Fungsi invers dan komposisi fungsi")],
  matriks: T.matriks,
  "transformasi-geometri": T.transformasiGeometri,
  "transformasi-fungsi": T.transformasiFungsi,
  "fungsi-pemodelan": [f("Aljabar dan Fungsi", "Berbagai fungsi untuk memodelkan fenomena", LANJUT)],
  lingkaran: T.lingkaran.slice(1),
  "irisan-kerucut": T.irisanKerucut,
  polinomial: [f("Aljabar dan Fungsi", "Polinomial dan faktornya", LANJUT)],
  kombinatorika: [f("Analisis Data dan Peluang", "Permutasi dan kombinasi")],
  peluang: [
    e("Analisis Data dan Peluang", "Peluang kejadian majemuk"),
    f("Analisis Data dan Peluang", "Peluang bersyarat dan kejadian saling bebas"),
  ],
  "analisis-data-peluang": [
    f("Analisis Data dan Peluang", "Variabel acak diskret, distribusi binomial/normal, dan nilai harapan", LANJUT),
  ],
  limit: T.limit,
  turunan: T.turunan,
  integral: T.integral,
};

/* ───────── Pencarian dan penyaringan ───────── */

export interface CpFilterState {
  query: string;
  fase: Fase | null;
  elemen: ElemenFilter | null;
}

export const EMPTY_CP_FILTER: CpFilterState = { query: "", fase: null, elemen: null };

export const isCpFilterActive = (s: CpFilterState) => Boolean(s.query.trim() || s.fase || s.elemen);

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Apakah sebuah materi cocok dengan filter?
 * @param tags       tag CP materi itu
 * @param haystack   teks lain yang ikut dicari (judul, konsep, ringkasan)
 */
export function matchesCp(tags: CpTag[] | undefined, haystack: string[], state: CpFilterState): boolean {
  const list = tags ?? [];
  if (state.fase && !list.some((t) => t.fase === state.fase)) return false;
  if (state.elemen && !list.some((t) => elemenGroup(t.elemen) === state.elemen)) return false;
  const words = normalize(state.query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const text = normalize(
    [
      ...haystack,
      ...list.flatMap((t) => [t.fokus, cpLabel(t), `fase ${t.fase}`, t.elemen, FASE_INFO[t.fase].kelas]),
    ].join(" "),
  );
  return words.every((w) => text.includes(w));
}
