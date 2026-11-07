/* ------------------------------------------------------------------ *
 *  Katalog Materi 1729.
 *
 *  Materi = bahan belajar bacaan yang menyatu dengan simulasi dan cek poin
 *  jawaban siswa. Satu materi terdiri atas beberapa bab; tiap bab punya
 *  alamat sendiri: /materi/<slug>/<bab>.
 *
 *  Untuk menambah materi baru:
 *   1. tambahkan satu objek pada MATERI di berkas ini,
 *   2. buat isi bab di src/materi/lessons/<slug>/ dan daftarkan di
 *      src/materi/lessons/index.ts,
 *   3. tambahkan soal cek poin di src/materi/questions/<slug>.ts dan
 *      daftarkan di src/materi/questions/index.ts,
 *   4. tambahkan pemetaan CP pada CP_MATERI (src/curriculum/cp.ts).
 *
 *  Berkas ini dibaca langsung oleh Node (scripts/routes.mjs), jadi: tanpa
 *  React, tanpa enum, dan import relatif memakai ekstensi ".ts".
 * ------------------------------------------------------------------ */

export interface BabMeta {
  /** Bagian URL: /materi/<slug>/<bab.slug> */
  slug: string;
  title: string;
  /** Ringkasan satu-dua kalimat (juga dipakai untuk SEO). */
  summary: string;
  /** Perkiraan waktu belajar, menit. */
  minutes: number;
  /** Tujuan pembelajaran bab ini, ditulis dari sudut pandang siswa. */
  tujuan: string[];
  /** Istilah penting pada bab ini. */
  kataKunci: string[];
}

export interface MateriMeta {
  /** Bagian URL: /materi/<slug> */
  slug: string;
  title: string;
  category: string;
  /** "E" = kelas 10. Pemetaan CP lengkap ada di curriculum/cp.ts. */
  kelas: string;
  summary: string;
  /** Konsep yang dipelajari; ikut dipakai untuk pencarian. */
  concepts: string[];
  /** Simbol besar di kartu katalog. */
  glyph: string;
  /** Pengetahuan yang sebaiknya sudah dikuasai. */
  prasyarat: string[];
  /** Tujuan pembelajaran tingkat materi. */
  tujuan: string[];
  /** Slug padanan di Simulasi, Slides, dan Latihan (bila ada). */
  tautan: { simulasi?: string; slides?: string; latihan?: string };
  bab: BabMeta[];
}

export const MATERI_PATH = "/materi";
export const materiPath = (slug: string) => `${MATERI_PATH}/${slug}`;
export const babPath = (slug: string, bab: string) => `${MATERI_PATH}/${slug}/${bab}`;

export const MATERI: MateriMeta[] = [
  {
    slug: "fungsi-kuadrat",
    title: "Fungsi Kuadrat",
    category: "Aljabar dan Fungsi",
    kelas: "Kelas 10",
    summary:
      "Pelajari fungsi kuadrat dari nol: mengamati parabola lewat simulasi, menemukan akar, titik puncak, dan nilai ekstrem, lalu memakainya untuk memecahkan masalah nyata.",
    concepts: [
      "Bentuk umum fungsi kuadrat",
      "Grafik parabola",
      "Akar dan diskriminan",
      "Titik puncak dan sumbu simetri",
      "Nilai maksimum dan minimum",
      "Menyusun fungsi kuadrat",
      "Pemodelan",
    ],
    glyph: "ax²",
    prasyarat: [
      "Operasi bentuk aljabar dan perkalian dua suku dua",
      "Persamaan linear satu variabel",
      "Menggambar titik pada bidang koordinat",
    ],
    tujuan: [
      "Mengenali fungsi kuadrat dan menyebutkan koefisien a, b, dan c.",
      "Menjelaskan pengaruh a, b, dan c terhadap bentuk dan posisi parabola.",
      "Menentukan akar persamaan kuadrat dengan faktorisasi dan rumus kuadrat, serta menafsirkan diskriminan.",
      "Menentukan sumbu simetri, titik puncak, dan nilai maksimum atau minimum.",
      "Menggambar sketsa grafik dan menyusun aturan fungsi dari informasi yang diketahui.",
      "Memodelkan dan menyelesaikan masalah kontekstual dengan fungsi kuadrat.",
    ],
    tautan: { simulasi: "fungsi-kuadrat", slides: "fungsi-kuadrat", latihan: "fungsi-kuadrat" },
    bab: [
      {
        slug: "mengenal-fungsi-kuadrat",
        title: "Mengenal fungsi kuadrat",
        summary: "Dari lintasan bola ke bentuk umum f(x) = ax² + bx + c: mengenali fungsi kuadrat, koefisiennya, dan ciri khas pola nilainya.",
        minutes: 20,
        tujuan: [
          "Menghitung nilai fungsi kuadrat pada konteks nyata.",
          "Membedakan fungsi kuadrat dari fungsi linear dan fungsi lainnya.",
          "Menyebutkan nilai a, b, dan c dari sebuah fungsi kuadrat.",
        ],
        kataKunci: ["Fungsi kuadrat", "Koefisien", "Konstanta", "Selisih kedua"],
      },
      {
        slug: "grafik-parabola",
        title: "Grafik fungsi kuadrat: parabola",
        summary: "Geser koefisien a, b, dan c pada simulasi lalu temukan sendiri pengaruhnya pada arah buka, lebar, dan titik potong sumbu y parabola.",
        minutes: 25,
        tujuan: [
          "Menentukan arah buka dan kelebaran parabola dari nilai a.",
          "Menentukan titik potong parabola dengan sumbu y.",
          "Menyusun koefisien agar parabola memenuhi ciri yang diminta.",
        ],
        kataKunci: ["Parabola", "Arah buka", "Titik potong sumbu y", "Sumbu simetri"],
      },
      {
        slug: "akar-dan-diskriminan",
        title: "Akar-akar dan diskriminan",
        summary: "Cari titik potong parabola dengan sumbu x lewat faktorisasi dan rumus kuadrat, lalu baca banyaknya akar dari nilai diskriminan.",
        minutes: 35,
        tujuan: [
          "Menyelesaikan persamaan kuadrat dengan faktorisasi dan rumus kuadrat.",
          "Menghubungkan akar dengan titik potong grafik pada sumbu x.",
          "Menggunakan diskriminan untuk menentukan banyaknya akar real.",
        ],
        kataKunci: ["Akar", "Faktorisasi", "Rumus kuadrat", "Diskriminan"],
      },
      {
        slug: "puncak-dan-nilai-ekstrem",
        title: "Titik puncak dan nilai ekstrem",
        summary: "Temukan sumbu simetri dan titik puncak parabola, ubah ke bentuk puncak dengan kuadrat sempurna, lalu tafsirkan nilai maksimum atau minimum.",
        minutes: 30,
        tujuan: [
          "Menentukan sumbu simetri dan titik puncak dengan rumus.",
          "Mengubah bentuk umum ke bentuk puncak a(x − p)² + q.",
          "Menentukan nilai maksimum atau minimum fungsi kuadrat.",
        ],
        kataKunci: ["Sumbu simetri", "Titik puncak", "Bentuk puncak", "Nilai ekstrem"],
      },
      {
        slug: "sketsa-grafik",
        title: "Menggambar sketsa grafik",
        summary: "Susun lima langkah menggambar sketsa parabola: arah buka, titik potong sumbu y, akar, titik puncak, lalu hubungkan menjadi kurva mulus.",
        minutes: 20,
        tujuan: [
          "Mengumpulkan informasi penting dari aturan fungsi untuk membuat sketsa.",
          "Menggunakan titik cermin untuk melengkapi sketsa.",
          "Menyimpulkan posisi grafik terhadap sumbu x dari a dan diskriminan.",
        ],
        kataKunci: ["Sketsa", "Titik bantu", "Titik cermin"],
      },
      {
        slug: "menyusun-fungsi-kuadrat",
        title: "Menyusun fungsi kuadrat",
        summary: "Tentukan aturan fungsi kuadrat dari akar-akar, titik puncak, atau tiga titik yang dilalui, dan cocokkan hasilnya langsung pada simulasi.",
        minutes: 30,
        tujuan: [
          "Menyusun fungsi dari dua akar dan satu titik lain.",
          "Menyusun fungsi dari titik puncak dan satu titik lain.",
          "Menyusun fungsi dari tiga titik yang dilalui grafik.",
        ],
        kataKunci: ["Bentuk faktor", "Bentuk puncak", "Tiga titik", "Sistem persamaan"],
      },
      {
        slug: "penerapan-fungsi-kuadrat",
        title: "Penerapan fungsi kuadrat",
        summary: "Modelkan masalah nyata: luas kandang terbesar, harga yang memberi pendapatan maksimum, dan tinggi maksimum lemparan, lalu tafsirkan hasilnya.",
        minutes: 30,
        tujuan: [
          "Menyusun model fungsi kuadrat dari masalah kontekstual.",
          "Menentukan nilai optimum dan menafsirkannya dalam konteks.",
          "Memeriksa kewajaran jawaban terhadap batasan masalah.",
        ],
        kataKunci: ["Pemodelan", "Optimasi", "Nilai maksimum", "Tafsiran"],
      },
      {
        slug: "rangkuman-dan-cek-akhir",
        title: "Rangkuman dan cek akhir",
        summary: "Ringkasan rumus dan langkah kerja fungsi kuadrat, ditutup dengan enam soal cek akhir untuk melihat bagian yang sudah dan belum kuat.",
        minutes: 20,
        tujuan: [
          "Merangkum rumus dan langkah kerja fungsi kuadrat.",
          "Menguji pemahaman lewat soal campuran.",
          "Menentukan bagian yang perlu diulang.",
        ],
        kataKunci: ["Rangkuman", "Cek akhir"],
      },
    ],
  },
  {
    slug: "bangun-ruang-sisi-datar",
    title: "Bangun Ruang Sisi Datar",
    category: "Geometri dan Pengukuran",
    kelas: "Kelas 8",
    summary:
      "Pelajari kubus, balok, prisma, dan limas lewat peragaan 3D yang bisa diputar dan dilipat: unsur-unsurnya, jaring-jaring, luas permukaan, volume, dan diagonal, lalu terapkan pada masalah nyata.",
    concepts: [
      "Unsur bangun ruang",
      "Jaring-jaring",
      "Luas permukaan",
      "Volume",
      "Diagonal sisi dan diagonal ruang",
      "Prisma",
      "Limas",
      "Bangun ruang gabungan",
    ],
    glyph: "3D",
    prasyarat: [
      "Luas persegi, persegi panjang, segitiga, dan trapesium",
      "Teorema Pythagoras",
      "Perpangkatan dan akar kuadrat sederhana",
    ],
    tujuan: [
      "Menyebutkan sisi, rusuk, dan titik sudut kubus, balok, prisma, dan limas.",
      "Menggambar dan mengenali jaring-jaring bangun ruang sisi datar.",
      "Menghitung luas permukaan dan volume kubus, balok, prisma, dan limas.",
      "Menentukan diagonal sisi, diagonal ruang, dan bidang diagonal dengan teorema Pythagoras.",
      "Menyelesaikan masalah kontekstual yang melibatkan bangun ruang sisi datar dan gabungannya.",
    ],
    tautan: { simulasi: "bangun-ruang-sisi-datar", slides: "bangun-ruang-sisi-datar" },
    bab: [
      {
        slug: "mengenal-bangun-ruang",
        title: "Mengenal bangun ruang sisi datar",
        summary: "Putar kubus, balok, prisma, dan limas dalam 3D, lalu temukan sisi, rusuk, titik sudutnya, dan hubungan di antara ketiganya (rumus Euler).",
        minutes: 20,
        tujuan: [
          "Menyebutkan sisi, rusuk, dan titik sudut sebuah bangun ruang.",
          "Membedakan prisma dan limas serta menamai keduanya dari bentuk alasnya.",
          "Menghitung banyak unsur bangun ruang dengan rumus Euler.",
        ],
        kataKunci: ["Sisi", "Rusuk", "Titik sudut", "Prisma", "Limas", "Rumus Euler"],
      },
      {
        slug: "jaring-jaring",
        title: "Jaring-jaring bangun ruang",
        summary: "Lipat dan buka jaring-jaring kubus, balok, prisma, dan limas pada peragaan 3D, lalu kenali susunan yang benar dan yang tidak dapat dilipat.",
        minutes: 25,
        tujuan: [
          "Menjelaskan arti jaring-jaring dan menyebutkan bidang penyusunnya.",
          "Mengenali jaring-jaring kubus yang benar.",
          "Menghubungkan banyak bidang jaring-jaring dengan bentuk alasnya.",
        ],
        kataKunci: ["Jaring-jaring", "Bidang", "Lipatan"],
      },
      {
        slug: "luas-permukaan-kubus-balok",
        title: "Luas permukaan kubus dan balok",
        summary: "Buka balok menjadi jaring-jaring berwarna, jumlahkan tiga pasang bidangnya, dan turunkan rumus luas permukaan kubus dan balok.",
        minutes: 25,
        tujuan: [
          "Menurunkan rumus luas permukaan balok dan kubus dari jaring-jaringnya.",
          "Menghitung luas permukaan, termasuk bangun tanpa tutup.",
          "Menjelaskan pengaruh perubahan rusuk terhadap luas permukaan.",
        ],
        kataKunci: ["Luas permukaan", "Pasangan bidang", "Kubus", "Balok"],
      },
      {
        slug: "volume-kubus-balok",
        title: "Volume kubus dan balok",
        summary: "Susun kubus satuan lapis demi lapis untuk menemukan rumus volume, lalu ubah satuan volume menjadi liter dan terapkan pada kapasitas benda nyata.",
        minutes: 25,
        tujuan: [
          "Menurunkan volume balok sebagai luas alas dikali tinggi.",
          "Mengubah satuan volume dan kapasitas.",
          "Menjelaskan pengaruh perubahan rusuk terhadap volume.",
        ],
        kataKunci: ["Volume", "Kubus satuan", "Liter", "Kapasitas"],
      },
      {
        slug: "diagonal-kubus-balok",
        title: "Diagonal pada kubus dan balok",
        summary: "Temukan diagonal sisi, diagonal ruang, dan bidang diagonal pada peragaan 3D, lalu hitung panjangnya dengan teorema Pythagoras.",
        minutes: 25,
        tujuan: [
          "Membedakan diagonal sisi, diagonal ruang, dan bidang diagonal.",
          "Menghitung panjang diagonal dengan teorema Pythagoras.",
          "Menghitung luas bidang diagonal.",
        ],
        kataKunci: ["Diagonal sisi", "Diagonal ruang", "Bidang diagonal", "Pythagoras"],
      },
      {
        slug: "prisma",
        title: "Prisma",
        summary: "Bangun prisma dengan alas segitiga atau trapesium, buka jaring-jaringnya, dan gunakan rumus luas permukaan dan volume untuk berbagai bentuk alas.",
        minutes: 30,
        tujuan: [
          "Menjelaskan unsur prisma dan jaring-jaringnya.",
          "Menghitung luas permukaan prisma: 2 × luas alas + keliling alas × tinggi.",
          "Menghitung volume prisma: luas alas × tinggi.",
        ],
        kataKunci: ["Prisma", "Luas alas", "Keliling alas", "Selimut"],
      },
      {
        slug: "limas",
        title: "Limas",
        summary: "Lihat tiga limas tersusun menjadi satu kubus untuk memahami volume limas, lalu bedakan tinggi limas dari tinggi sisi tegak dan hitung luas permukaannya.",
        minutes: 30,
        tujuan: [
          "Menjelaskan mengapa volume limas sepertiga volume prisma.",
          "Membedakan tinggi limas dan tinggi sisi tegak.",
          "Menghitung luas permukaan dan volume limas.",
        ],
        kataKunci: ["Limas", "Tinggi limas", "Tinggi sisi tegak", "Volume limas"],
      },
      {
        slug: "penerapan-dan-cek-akhir",
        title: "Penerapan, rangkuman, dan cek akhir",
        summary: "Selesaikan masalah bangun gabungan dan tenda, rangkum seluruh rumus, lalu uji pemahamanmu dengan enam soal cek akhir.",
        minutes: 35,
        tujuan: [
          "Menyelesaikan masalah bangun ruang gabungan.",
          "Merangkum rumus bangun ruang sisi datar.",
          "Menguji pemahaman lewat soal campuran.",
        ],
        kataKunci: ["Bangun gabungan", "Pemodelan", "Rangkuman"],
      },
    ],
  },
];

export const findMateri = (slug: string | undefined) => MATERI.find((m) => m.slug === slug);

export const findBab = (materi: MateriMeta, babSlug: string | undefined) => {
  const index = materi.bab.findIndex((b) => b.slug === babSlug);
  return index < 0 ? null : { bab: materi.bab[index], index };
};

export const totalMinutes = (m: MateriMeta) => m.bab.reduce((sum, b) => sum + b.minutes, 0);
