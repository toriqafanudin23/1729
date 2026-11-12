import type { Level } from "./types";

export type PackCategory = "Bilangan" | "Aljabar" | "Geometri" | "Statistika & Peluang" | "Kombinatorika" | "Kalkulus";

export interface PackCatalog {
  slug: string;
  category: PackCategory;
  topic: string;
  description: string;
  durationMinutes?: number;
  questions: number;
  points: number;
  byLevel: Record<Level, number>;
  parts: string[];
  types: string[];
}

// Metadata katalog dipisah dari isi soal agar halaman katalog tidak mengunduh semua paket.
export const PACK_CATALOG: PackCatalog[] = [
  {
    "slug": "eksponen-logaritma",
    "category": "Bilangan",
    "topic": "Eksponen dan Logaritma",
    "description": "Sifat eksponen dan logaritma, bentuk akar, persamaan dan pertidaksamaan eksponen dan logaritma, grafik fungsi eksponen, serta pemodelan.",
    "durationMinutes": 90,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "barisan-deret",
    "category": "Bilangan",
    "topic": "Barisan dan Deret",
    "description": "Barisan dan deret aritmetika, geometri, deret tak hingga, notasi sigma, serta penalaran dan pemodelan.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "sppl",
    "category": "Aljabar",
    "topic": "Sistem Persamaan dan Pertidaksamaan Linear",
    "description": "Persamaan dan pertidaksamaan linear, nilai mutlak dan bentuk pecahan, sistem persamaan dua dan tiga variabel, serta program linear dan model kontekstual.",
    "durationMinutes": 90,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 15,
      "hots": 0
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "fungsi-kuadrat",
    "category": "Aljabar",
    "topic": "Fungsi Kuadrat",
    "description": "Grafik dan sifat fungsi kuadrat, titik puncak, diskriminan, menyusun fungsi kuadrat, nilai maksimum dan minimum, serta pemodelan dan penalaran.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 7,
      "sulit": 13,
      "hots": 5
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "perbandingan-trigonometri",
    "category": "Geometri",
    "topic": "Perbandingan Trigonometri",
    "description": "Sinus, cosinus, tangen dan kebalikannya pada segitiga siku-siku, nilai sudut istimewa, identitas dasar, serta sudut elevasi dan depresi.",
    "durationMinutes": 90,
    "questions": 23,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 8,
      "hots": 0
    },
    "parts": [
      "15 pilihan ganda",
      "5 isian singkat",
      "3 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "vektor",
    "category": "Geometri",
    "topic": "Vektor",
    "description": "Vektor di ruang: operasi dan panjang vektor, hasil kali titik dan silang, sudut, proyeksi, pembagian ruas garis, luas, volume, jarak, serta penalaran dan pembuktian.",
    "durationMinutes": 90,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 12,
      "sulit": 13,
      "hots": 0
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "statistika",
    "category": "Statistika & Peluang",
    "topic": "Statistika",
    "description": "Ukuran pemusatan dan penyebaran data, data berkelompok, histogram dan diagram, serta penalaran dan penafsiran data.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 9,
      "hots": 7
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "bilangan-kompleks",
    "category": "Bilangan",
    "topic": "Bilangan Kompleks",
    "description": "Bentuk a+bi, operasi, konjugat, modulus, argumen, tafsiran geometri pada diagram Argand, dan persamaan kuadrat.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "komposisi-fungsi-invers",
    "category": "Aljabar",
    "topic": "Komposisi Fungsi dan Invers",
    "description": "Fungsi, komposisi fungsi, fungsi invers, dan invers dari komposisi, termasuk penalaran fungsi pada konteks grafik, tabel, diagram panah, dan diagram alir.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 6,
      "sedang": 8,
      "sulit": 9,
      "hots": 7
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "matriks",
    "category": "Aljabar",
    "topic": "Matriks",
    "description": "Operasi matriks, determinan, invers, sistem persamaan linear, dan transformasi geometri dengan matriks.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "transformasi-geometri",
    "category": "Geometri",
    "topic": "Transformasi Geometri",
    "description": "Translasi, refleksi, rotasi, dilatasi, komposisi transformasi, bayangan garis dan kurva, serta matriks transformasi.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "tf",
      "short",
      "essay"
    ]
  },
  {
    "slug": "transformasi-fungsi",
    "category": "Aljabar",
    "topic": "Transformasi Fungsi",
    "description": "Translasi, refleksi, dilatasi, rotasi, nilai mutlak, komposisi transformasi, dan transformasi dengan matriks pada grafik fungsi.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "tf",
      "short",
      "essay"
    ]
  },
  {
    "slug": "fungsi-pemodelan",
    "category": "Aljabar",
    "topic": "Fungsi dan Pemodelan",
    "description": "Daerah asal dan daerah hasil, komposisi dan invers fungsi, fungsi rasional, akar, nilai mutlak, eksponensial, logaritma, trigonometri, fungsi tangga dan bersyarat, serta pemodelan matematika berbasis konteks.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "lingkaran",
    "category": "Geometri",
    "topic": "Lingkaran",
    "description": "Keliling, luas, busur, juring, dan tembereng, sudut pusat dan sudut keliling, garis singgung, persamaan lingkaran, serta penalaran geometri lingkaran.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "irisan-kerucut",
    "category": "Geometri",
    "topic": "Irisan Kerucut",
    "description": "Lingkaran dan garis singgung, elips, parabola, hiperbola, serta penalaran geometri analitik.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 12,
      "hots": 3
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "polinomial",
    "category": "Aljabar",
    "topic": "Polinomial",
    "description": "Nilai dan kesamaan polinomial, pembagian, teorema sisa dan faktor, akar-akar, serta penalaran polinomial.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 9,
      "sulit": 10,
      "hots": 6
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "kombinatorika",
    "category": "Kombinatorika",
    "topic": "Kombinatorika",
    "description": "Aturan pencacahan, permutasi, kombinasi, binomial Newton, inklusi–eksklusi, serta penalaran menghitung pada konteks gambar dan diagram.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 12,
      "hots": 3
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "tf",
      "short",
      "essay"
    ]
  },
  {
    "slug": "peluang",
    "category": "Statistika & Peluang",
    "topic": "Peluang",
    "description": "Ruang sampel dan kejadian, peluang klasik dan empiris, frekuensi harapan, peluang bersyarat dan teorema Bayes, kejadian bebas, kombinatorika, serta distribusi binomial.",
    "durationMinutes": 90,
    "questions": 23,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 8,
      "hots": 0
    },
    "parts": [
      "15 pilihan ganda",
      "5 isian singkat",
      "3 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "analisis-data-peluang",
    "category": "Statistika & Peluang",
    "topic": "Analisis Data dan Peluang",
    "description": "Variabel acak, distribusi seragam, binomial, dan normal, serta penalaran data.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 13,
      "hots": 2
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  },
  {
    "slug": "limit",
    "category": "Kalkulus",
    "topic": "Limit Fungsi",
    "description": "Limit aljabar dan trigonometri, limit tak hingga, bilangan \\(e\\), kekontinuan, Teorema Apit, serta penalaran limit.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 12,
      "hots": 3
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "tf",
      "short",
      "essay"
    ]
  },
  {
    "slug": "turunan",
    "category": "Kalkulus",
    "topic": "Turunan",
    "description": "Aturan turunan, garis singgung, fungsi naik dan turun, nilai ekstrem, kecekungan, serta penalaran optimasi.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 12,
      "hots": 3
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "tf",
      "short",
      "essay"
    ]
  },
  {
    "slug": "integral",
    "category": "Kalkulus",
    "topic": "Integral",
    "description": "Antiturunan, integral tentu, teknik pengintegralan, luas daerah, volume benda putar, dan penerapan integral.",
    "durationMinutes": 120,
    "questions": 30,
    "points": 100,
    "byLevel": {
      "mudah": 5,
      "sedang": 10,
      "sulit": 12,
      "hots": 3
    },
    "parts": [
      "20 pilihan ganda",
      "5 isian singkat",
      "5 uraian (essay)"
    ],
    "types": [
      "pg",
      "short",
      "essay"
    ]
  }
];
