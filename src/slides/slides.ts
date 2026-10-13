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
  thumb: "transform" | "calculus";
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
];

export const findDeck = (slug?: string) => DECKS.find((d) => d.slug === slug);
