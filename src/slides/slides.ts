import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/* Daftar materi Slides. Tambah materi baru cukup dengan satu objek di bawah.
   Komponen dimuat malas (lazy) supaya reveal.js + JSXGraph hanya diunduh
   saat presentasi dibuka. */

export interface DeckMeta {
  slug: string;
  title: string;
  category: string;
  summary: string;
  concepts: string[];
  slides: number; // jumlah slide
  minutes: number; // perkiraan durasi
  level: string;
  thumb: "transform" | "calculus" | "linear" | "inequality" | "program" | "quadratic" | "circle";
  Component: LazyExoticComponent<ComponentType>;
}

export const DECKS: DeckMeta[] = [
  {
    slug: "transformasi-geometri",
    title: "Transformasi geometri",
    category: "Geometri",
    summary:
      "Apa yang berubah dan apa yang tetap saat bangun digeser, dicerminkan, diputar, dan diperbesar. Berakhir pada satu gagasan: matriks adalah ke mana î dan ĵ mendarat.",
    concepts: ["Translasi", "Refleksi", "Rotasi", "Dilatasi", "Komposisi", "Matriks"],
    slides: 9,
    minutes: 20,
    level: "Kelas XI",
    thumb: "transform",
    Component: lazy(() => import("./TransformationDeck")),
  },
  {
    slug: "limit-turunan",
    title: "Limit dan turunan",
    category: "Kalkulus",
    summary:
      "Dua gagasan terbesar kalkulus sebenarnya satu pertanyaan: apa yang terjadi ketika sesuatu mendekati nol? Dari permainan ε–δ sampai garis potong yang menjadi garis singgung.",
    concepts: ["Limit", "ε–δ", "Garis potong", "Fungsi turunan"],
    slides: 6,
    minutes: 15,
    level: "Kelas XI–XII",
    thumb: "calculus",
    Component: lazy(() => import("./CalculusDeck")),
  },
  {
    slug: "sistem-persamaan-linear",
    title: "Sistem persamaan linear",
    category: "Aljabar",
    summary:
      "Pahami sistem persamaan sebagai garis-garis yang bertemu, lalu temukan penyelesaiannya lewat grafik, substitusi, dan eliminasi.",
    concepts: ["SPLDV", "SPLTV", "Grafik", "Substitusi", "Eliminasi"],
    slides: 21,
    minutes: 35,
    level: "Kelas X",
    thumb: "linear",
    Component: lazy(() => import("./SistemPersamaanDeck")),
  },
  {
    slug: "pertidaksamaan-linear",
    title: "Pertidaksamaan linear",
    category: "Aljabar",
    summary:
      "Jelajahi himpunan solusi pertidaksamaan pada garis bilangan dan bidang, dari nilai mutlak hingga irisan daerah.",
    concepts: ["PtLSV", "Nilai mutlak", "Pecahan", "Daerah solusi", "Sistem"],
    slides: 12,
    minutes: 25,
    level: "Kelas X",
    thumb: "inequality",
    Component: lazy(() => import("./PertidaksamaanDeck")),
  },
  {
    slug: "program-linear",
    title: "Program linear",
    category: "Aljabar",
    summary:
      "Bagaimana mencari untung terbesar atau biaya terkecil bila bahan terbatas? Susun model, gambar daerah layak, lalu uji titik pojok sampai nilai optimum ditemukan.",
    concepts: ["Model matematika", "Daerah layak", "Titik pojok", "Fungsi tujuan", "Garis selidik"],
    slides: 10,
    minutes: 25,
    level: "Kelas X",
    thumb: "program",
    Component: lazy(() => import("./ProgramLinearDeck")),
  },
  {
    slug: "fungsi-kuadrat",
    title: "Fungsi kuadrat",
    category: "Aljabar",
    summary:
      "Dari bentuk umum sampai soal cerita: geser a, b, c dan lihat parabola berubah. Akar, diskriminan, titik puncak, menyusun fungsi, hingga garis dan parabola, lengkap dengan tantangan dan kuis berbasis simulasi.",
    concepts: ["Parabola", "Akar", "Diskriminan", "Titik puncak", "Menyusun fungsi", "Garis dan parabola"],
    slides: 39,
    minutes: 55,
    level: "Kelas X",
    thumb: "quadratic",
    Component: lazy(() => import("./FungsiKuadratDeck")),
  },
  {
    slug: "lingkaran",
    title: "Lingkaran",
    category: "Geometri",
    summary:
      "Dari unsur-unsur lingkaran, nilai π, keliling, dan luas, sampai sudut pusat dan sudut keliling, busur, juring, garis singgung persekutuan luar dan dalam, serta lingkaran luar dan dalam segitiga. Setiap rumus ditemukan lewat simulasi.",
    concepts: ["Unsur", "π", "Keliling dan luas", "Sudut pusat dan keliling", "Busur dan juring", "Garis singgung", "Lingkaran luar dan dalam"],
    slides: 25,
    minutes: 60,
    level: "Kelas VIII–IX",
    thumb: "circle",
    Component: lazy(() => import("./LingkaranDeck")),
  },
];

export const findDeck = (slug?: string) => DECKS.find((d) => d.slug === slug);
