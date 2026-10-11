import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/* ------------------------------------------------------------------ *
 *  Daftar simulasi 1729.
 *  Untuk menambah simulasi: tambahkan satu objek di SIMULATIONS.
 *  Katalog dan halaman simulasi akan menyesuaikan sendiri.
 *
 *  Komponen dimuat malas (lazy) supaya JSXGraph dan CSS tiap simulasi
 *  hanya diunduh saat halamannya dibuka. Sesuaikan path import dengan
 *  letak file simulasimu.
 * ------------------------------------------------------------------ */

export interface SimulationMeta {
  /** Bagian URL: /simulasi/<slug> */
  slug: string;
  title: string;
  category: string;
  summary: string;
  /** Konsep yang dipelajari; ikut dipakai untuk pencarian. */
  concepts: string[];
  /** Simbol besar di kartu katalog. */
  glyph: string;
  component: LazyExoticComponent<ComponentType>;
}

export const CATALOG_PATH = "/simulasi";
export const simulationPath = (slug: string) => `${CATALOG_PATH}/${slug}`;

export const SIMULATIONS: SimulationMeta[] = [
  {
    slug: "fungsi-kuadrat",
    title: "Fungsi Kuadrat",
    category: "Aljabar",
    summary:
      "Ubah parameter parabola dan lihat pergeseran puncak, lebar kurva, serta titik potong dengan sumbu koordinat.",
    concepts: ["Parabola", "Diskriminan", "Puncak", "Persamaan kuadrat"],
    glyph: "ax²",
    component: lazy(() =>
      import("../simulation/QuadraticSimulation").then((m) => ({ default: m.QuadraticSimulation })),
    ),
  },
  {
    slug: "transformasi-geometri",
    title: "Transformasi Geometri",
    category: "Geometri",
    summary:
      "Lihat bagamana translasi, rotasi, refleksi, dan dilatasi mengubah bentuk tanpa menghilangkan struktur geometri.",
    concepts: ["Translasi", "Rotasi", "Refleksi", "Dilatasi"],
    glyph: "T",
    component: lazy(() =>
      import("../simulation/TransformationSimulation").then((m) => ({ default: m.TransformationSimulation })),
    ),
  },
  {
    slug: "trigonometri",
    title: "Trigonometri",
    category: "Trigonometri",
    summary:
      "Ikuti putaran titik pada lingkaran satuan dan lihat bagaimana sinus, kosinus, dan tangen terbentuk dari sudut.",
    concepts: ["Sudut", "Sinus", "Kosinus", "Lingkaran satuan"],
    glyph: "sin",
    component: lazy(() =>
      import("../simulation/TrigonometrySimulation").then((m) => ({ default: m.TrigonometrySimulation })),
    ),
  },
  {
    slug: "vektor",
    title: "Vektor",
    category: "Vektor",
    summary:
      "Geser ujung dua vektor pada bidang koordinat dan amati penjumlahan, sudut, proyeksi, dan hasil kali titik berubah secara langsung.",
    concepts: ["Penjumlahan vektor", "Hasil kali titik", "Sudut antarvektor", "Proyeksi vektor"],
    glyph: "a·b",
    component: lazy(() => import("../simulation/VectorSimulation").then((m) => ({ default: m.VectorSimulation }))),
  },
  {
    slug: "sistem-linear",
    title: "Sistem Linear",
    category: "Aljabar",
    summary:
      "Selesaikan persamaan linear dengan melihat garis-garis yang berpotongan dan titik solusi yang berubah di waktu nyata.",
    concepts: ["Persamaan linear", "Interseksi", "Sistem", "Solusi"],
    glyph: "y=mx+c",
    component: lazy(() =>
      import("../simulation/LinearSystemSimulation").then((m) => ({ default: m.LinearSystemSimulation })),
    ),
  },
  {
    slug: "irisan-kerucut",
    title: "Irisan Kerucut",
    category: "Geometri",
    summary:
      "Jelajahi elips, parabola, dan hiperbola melalui fokus, sumbu, serta jumlah atau selisih jarak yang tetap.",
    concepts: ["Elips", "Parabola", "Hiperbola", "Fokus"],
    glyph: "e",
    component: lazy(() =>
      import("../simulation/ConicSectionsSimulation").then((m) => ({ default: m.ConicSectionsSimulation })),
    ),
  },
  {
    slug: "sektor-lingkaran",
    title: "Sektor Lingkaran",
    category: "Geometri",
    summary:
      "Jelajahi hubungan antara sudut pusat, panjang busur, dan luas juring pada lingkaran yang berubah ukuran.",
    concepts: ["Juring", "Busur", "Sudut pusat", "Lingkaran"],
    glyph: "◔",
    component: lazy(() =>
      import("../simulation/CircleSectorSimulation").then((m) => ({ default: m.CircleSectorSimulation })),
    ),
  },
  {
    slug: "titik-istimewa-segitiga",
    title: "Titik Istimewa Segitiga",
    category: "Geometri",
    summary:
      "Jelajahi titik berat, titik bagi, titik sumbu, dan titik tinggi beserta garis Euler dengan mengubah bentuk segitiga.",
    concepts: ["Titik berat", "Titik bagi", "Titik sumbu", "Titik tinggi", "Garis Euler"],
    glyph: "G · I · O · H",
    component: lazy(() =>
      import("../simulation/TriangleCentersSimulation").then((m) => ({ default: m.TriangleCentersSimulation })),
    ),
  },
  {
    slug: "teorema-pythagoras",
    title: "Teorema Pythagoras",
    category: "Geometri",
    summary:
      "Ubah panjang sisi dan sudut segitiga, amati hubungan a² + b² = c², lalu jelajahi buktinya melalui penataan ulang luas persegi.",
    concepts: ["Teorema Pythagoras", "Segitiga siku-siku", "Luas persegi", "Tripel Pythagoras"],
    glyph: "a² + b² = c²",
    component: lazy(() =>
      import("../simulation/PythagorasSimulation").then((m) => ({ default: m.PythagorasSimulation })),
    ),
  },
  {
    slug: "garis-singgung-dua-lingkaran",
    title: "Garis Singgung Dua Lingkaran",
    category: "Geometri",
    summary:
      "Atur posisi dan jari-jari dua lingkaran, lihat garis singgung persekutuan luar dan dalam, lalu ikuti proses konstruksinya langkah demi langkah.",
    concepts: ["Lingkaran", "Garis singgung persekutuan", "Konstruksi geometri"],
    glyph: "⊙⊙",
    component: lazy(() =>
      import("../simulation/TwoCircleTangentSimulation").then((m) => ({ default: m.TwoCircleTangentSimulation })),
    ),
  },
  {
    slug: "transformasi-fungsi",
    title: "Transformasi Fungsi",
    category: "Aljabar",
    summary:
      "Geser, regangkan, dan refleksikan grafik fungsi untuk memahami asal-usul bentuk kurva setelah transformasi.",
    concepts: ["Translasi", "Peregangan", "Refleksi", "Grafik fungsi"],
    glyph: "y = f(x)",
    component: lazy(() =>
      import("../simulation/FunctionTransformationSimulation").then((m) => ({ default: m.FunctionTransformationSimulation })),
    ),
  },
  {
    slug: "plotter-grafik",
    title: "Plotter Grafik",
    category: "Fungsi",
    summary:
      "Masukkan ekspresi fungsi dan amati bagaimana bentuk grafik berubah saat parameter maupun ekspresi dimodifikasi.",
    concepts: ["Grafik fungsi", "Ekspresi", "Plot", "Analisis visual"],
    glyph: "f(x)",
    component: lazy(() =>
      import("../simulation/GraphPlotterSimulation").then((m) => ({ default: m.GraphPlotterSimulation })),
    ),
  },
  {
    slug: "turunan",
    title: "Turunan",
    category: "Kalkulus",
    summary:
      "Saat titik Q mendekati P pada kurva, kemiringan tali busur PQ mendekati kemiringan garis singgung di P. Itulah nilai turunan.",
    concepts: ["Turunan", "Garis singgung", "Laju perubahan", "Kemonotonan"],
    glyph: "f′",
    component: lazy(() => import("../simulation/DerivativeSimulation").then((m) => ({ default: m.DerivativeSimulation }))),
  },
  {
    slug: "integral",
    title: "Integral",
    category: "Kalkulus",
    summary:
      "Lihat bagaimana jumlah luas persegi panjang mendekati nilai integral ketika lebar partisinya makin kecil.",
    concepts: ["Integral", "Luas daerah", "Riemann", "Aproksimasi"],
    glyph: "∫",
    component: lazy(() => import("../simulation/IntegralSimulation").then((m) => ({ default: m.IntegralSimulation }))),
  },
];

export const findSimulation = (slug?: string) => SIMULATIONS.find((s) => s.slug === slug);
