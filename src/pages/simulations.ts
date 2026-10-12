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
      "Atur koefisien parabola dan amati perubahan titik puncak, sumbu simetri, akar, serta titik potongnya dengan sumbu koordinat secara langsung.",
    concepts: ["Parabola", "Diskriminan", "Puncak", "Persamaan kuadrat"],
    glyph: "ax²",
    component: lazy(() =>
      import("../simulation/simulations/QuadraticSimulation").then((m) => ({ default: m.QuadraticSimulation })),
    ),
  },
  {
    slug: "transformasi-geometri",
    title: "Transformasi Geometri",
    category: "Geometri",
    summary:
      "Lihat bagaimana translasi, rotasi, refleksi, dan dilatasi mengubah posisi serta ukuran bangun pada bidang koordinat tanpa mengubah bentuk dasarnya.",
    concepts: ["Translasi", "Rotasi", "Refleksi", "Dilatasi"],
    glyph: "T",
    component: lazy(() =>
      import("../simulation/simulations/TransformationSimulation").then((m) => ({ default: m.TransformationSimulation })),
    ),
  },
  {
    slug: "trigonometri",
    title: "Trigonometri",
    category: "Trigonometri",
    summary:
      "Putar titik pada lingkaran satuan untuk mengamati bagaimana nilai sinus, kosinus, dan tangen berubah mengikuti sudut dalam satu putaran penuh.",
    concepts: ["Sudut", "Sinus", "Kosinus", "Lingkaran satuan"],
    glyph: "sin",
    component: lazy(() =>
      import("../simulation/simulations/TrigonometrySimulation").then((m) => ({ default: m.TrigonometrySimulation })),
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
    component: lazy(() => import("../simulation/simulations/VectorSimulation").then((m) => ({ default: m.VectorSimulation }))),
  },
  {
    slug: "sistem-linear",
    title: "Sistem Linear",
    category: "Aljabar",
    summary:
      "Ubah koefisien persamaan dan amati garis-garis bergerak hingga berpotongan; titik potong menunjukkan solusi sistem langsung pada bidang koordinat.",
    concepts: ["Persamaan linear", "Interseksi", "Sistem", "Solusi"],
    glyph: "y=mx+c",
    component: lazy(() =>
      import("../simulation/simulations/LinearSystemSimulation").then((m) => ({ default: m.LinearSystemSimulation })),
    ),
  },
  {
    slug: "irisan-kerucut",
    title: "Irisan Kerucut",
    category: "Geometri",
    summary:
      "Jelajahi elips, parabola, dan hiperbola dengan mengubah fokus serta parameter, kemudian amati hubungan jarak dan bentuk kurva yang terbentuk.",
    concepts: ["Elips", "Parabola", "Hiperbola", "Fokus"],
    glyph: "e",
    component: lazy(() =>
      import("../simulation/simulations/ConicSectionsSimulation").then((m) => ({ default: m.ConicSectionsSimulation })),
    ),
  },
  {
    slug: "sektor-lingkaran",
    title: "Sektor Lingkaran",
    category: "Geometri",
    summary:
      "Ubah jari-jari dan sudut pusat lingkaran untuk melihat kaitannya dengan panjang busur, luas juring, dan perubahan bentuk sektor secara langsung.",
    concepts: ["Juring", "Busur", "Sudut pusat", "Lingkaran"],
    glyph: "◔",
    component: lazy(() =>
      import("../simulation/simulations/CircleSectorSimulation").then((m) => ({ default: m.CircleSectorSimulation })),
    ),
  },
  {
    slug: "titik-istimewa-segitiga",
    title: "Titik Istimewa Segitiga",
    category: "Geometri",
    summary:
      "Ubah bentuk segitiga dan amati posisi titik berat, titik bagi, titik sumbu, serta titik tinggi; lihat pula hubungan pusat-pusat itu dengan garis Euler.",
    concepts: ["Titik berat", "Titik bagi", "Titik sumbu", "Titik tinggi", "Garis Euler"],
    glyph: "G · I · O · H",
    component: lazy(() =>
      import("../simulation/simulations/TriangleCentersSimulation").then((m) => ({ default: m.TriangleCentersSimulation })),
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
      import("../simulation/simulations/PythagorasSimulation").then((m) => ({ default: m.PythagorasSimulation })),
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
      import("../simulation/simulations/TwoCircleTangentSimulation").then((m) => ({ default: m.TwoCircleTangentSimulation })),
    ),
  },
  {
    slug: "transformasi-fungsi",
    title: "Transformasi Fungsi",
    category: "Aljabar",
    summary:
      "Geser, regangkan, atau refleksikan grafik fungsi untuk memahami perubahan posisi, arah, dan bentuk kurva pada bidang koordinat secara langsung.",
    concepts: ["Translasi", "Peregangan", "Refleksi", "Grafik fungsi"],
    glyph: "y = f(x)",
    component: lazy(() =>
      import("../simulation/simulations/FunctionTransformationSimulation").then((m) => ({ default: m.FunctionTransformationSimulation })),
    ),
  },
  {
    slug: "plotter-grafik",
    title: "Plotter Grafik",
    category: "Fungsi",
    summary:
      "Masukkan suatu fungsi dan amati grafiknya; ubah parameter untuk membandingkan bentuk kurva, titik potong, serta perilaku fungsi di bidang koordinat.",
    concepts: ["Grafik fungsi", "Ekspresi", "Plot", "Analisis visual"],
    glyph: "f(x)",
    component: lazy(() =>
      import("../simulation/simulations/GraphPlotterSimulation").then((m) => ({ default: m.GraphPlotterSimulation })),
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
    component: lazy(() => import("../simulation/simulations/DerivativeSimulation").then((m) => ({ default: m.DerivativeSimulation }))),
  },
  {
    slug: "integral",
    title: "Integral",
    category: "Kalkulus",
    summary:
      "Amati jumlah luas persegi panjang ketika partisi diperhalus dan lihat bagaimana pendekatan tersebut semakin dekat dengan nilai integral di bawah kurva.",
    concepts: ["Integral", "Luas daerah", "Riemann", "Aproksimasi"],
    glyph: "∫",
    component: lazy(() => import("../simulation/simulations/IntegralSimulation").then((m) => ({ default: m.IntegralSimulation }))),
  },
];

export const findSimulation = (slug?: string) => SIMULATIONS.find((s) => s.slug === slug);
