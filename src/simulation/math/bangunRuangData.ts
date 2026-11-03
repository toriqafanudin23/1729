/* ------------------------------------------------------------------ *
 *  Data simulasi Bangun Ruang Sisi Datar (model 3D berformat .glb).
 *
 *  Menambah model baru:
 *   1. Taruh berkasnya di public/models/bangun-ruang/.
 *   2. Tambahkan satu objek di MODELS (pilih `group` yang sudah ada).
 *  Grup, tombol pilihan, dan panel penjelasan menyesuaikan sendiri.
 * ------------------------------------------------------------------ */

export type GroupId =
  | "volume-kubus"
  | "volume-limas"
  | "jaring-kubus-balok"
  | "jaring-prisma"
  | "jaring-limas"
  | "prisma"
  | "limas";

export interface GroupDef {
  id: GroupId;
  label: string;
  hint: string;
}

export const GROUPS: GroupDef[] = [
  { id: "volume-kubus", label: "Volume kubus", hint: "Menghitung kubus satuan" },
  { id: "volume-limas", label: "Volume limas", hint: "Kubus menjadi 3 limas" },
  { id: "jaring-kubus-balok", label: "Jaring-jaring kubus & balok", hint: "Membuka dan melipat sisi" },
  { id: "jaring-prisma", label: "Jaring-jaring prisma", hint: "Berbagai alas dan susunan" },
  { id: "jaring-limas", label: "Jaring-jaring limas", hint: "Berbagai alas dan susunan" },
  { id: "prisma", label: "Jenis-jenis prisma", hint: "Beraturan, tidak beraturan, miring" },
  { id: "limas", label: "Jenis-jenis limas", hint: "Berbagai bentuk alas" },
];

export interface ModelInfo {
  /** Penjelasan singkat; boleh beberapa kalimat. */
  text: string;
  /** Pasangan label-nilai yang ditampilkan sebagai daftar fakta. */
  facts?: [label: string, value: string][];
  /** Rumus dalam LaTeX (KaTeX). */
  formulas?: string[];
}

export interface SolidModel {
  id: string;
  group: GroupId;
  /** Judul lengkap (bilah judul di atas model). */
  title: string;
  /** Label pendek untuk tombol pilihan. */
  short: string;
  /** Pengelompokan tombol pilihan di panel (mis. bentuk alas); tombol sekeluarga diberi satu judul kecil. */
  family?: string;
  file: string;
  /**
   * Cara menentukan bingkai kamera.
   *  - "all"   : gabungan semua posisi selama animasi (jaring-jaring, dll.)
   *  - "start" : hanya posisi awal (dipakai bila ada benda yang terbang keluar layar)
   */
  frame: "all" | "start";
  /** Penghitung kubus yang terangkat dari tumpukan (kubus satuan 3×3×3). */
  tracker?: { total: number };
  /** Tombol lapisan: tampilkan kubus lapis demi lapis dari bawah. */
  layers?: boolean;
  info: ModelInfo;
}

const BASE = `${import.meta.env.BASE_URL}models/bangun-ruang/`;
const file = (name: string) => `${BASE}${name}.glb`;

/* ───────── Prisma dan limas: unsur dihitung dari banyak sisi alas ───────── */

const SISI_ALAS: Record<number, string> = { 3: "segitiga", 4: "segiempat", 5: "segilima", 6: "segienam", 8: "segidelapan" };
const cap = (text: string) => text[0].toUpperCase() + text.slice(1);

interface PrismaOptions {
  /** Nama alas, mis. "trapesium"; bawaan: segi-n beraturan. */
  bentuk?: string;
  /** Kalimat pembuka pengganti. */
  text?: string;
  /** Fakta tambahan di atas daftar unsur. */
  facts?: [string, string][];
  /** Rumus luas alas khusus. */
  alasFormula?: string;
  /** Rumus luas permukaan pengganti (mis. prisma miring). */
  luasFormula?: string;
}

function prismaInfo(n: number, o: PrismaOptions = {}): ModelInfo {
  const bentuk = o.bentuk ?? SISI_ALAS[n];
  return {
    text:
      o.text ??
      `Prisma ${bentuk} memiliki dua bidang sejajar yang kongruen (alas dan atas) berbentuk ${bentuk}, dihubungkan oleh ${n} sisi tegak berbentuk persegi panjang. Putar modelnya dan hitung sendiri sisi, rusuk, serta titik sudutnya.`,
    facts: [
      ["Bentuk alas", bentuk],
      ...(o.facts ?? []),
      ["Banyak sisi", `${n + 2} (2 alas + ${n} sisi tegak)`],
      ["Banyak rusuk", `${3 * n}`],
      ["Titik sudut", `${2 * n}`],
    ],
    formulas: [
      ...(o.alasFormula ? [o.alasFormula] : []),
      String.raw`V = L_{\text{alas}} \times t`,
      o.luasFormula ?? String.raw`L = 2\,L_{\text{alas}} + K_{\text{alas}} \times t`,
      String.raw`T - R + S = ${2 * n} - ${3 * n} + ${n + 2} = 2`,
    ],
  };
}

function limasInfo(n: number): ModelInfo {
  const bentuk = SISI_ALAS[n];
  return {
    text: `Limas ${bentuk} memiliki alas berbentuk ${bentuk} dan ${n} sisi tegak berbentuk segitiga yang bertemu di satu titik puncak. Putar modelnya dan hitung sendiri sisi, rusuk, serta titik sudutnya.`,
    facts: [
      ["Bentuk alas", bentuk],
      ["Banyak sisi", `${n + 1} (1 alas + ${n} sisi tegak)`],
      ["Banyak rusuk", `${2 * n}`],
      ["Titik sudut", `${n + 1} (termasuk puncak)`],
    ],
    formulas: [
      String.raw`V = \tfrac{1}{3} \times L_{\text{alas}} \times t`,
      String.raw`L = L_{\text{alas}} + \text{jumlah luas sisi tegak}`,
      String.raw`T - R + S = ${n + 1} - ${2 * n} + ${n + 1} = 2`,
    ],
  };
}

/* ───────── Jaring-jaring ───────── */

/** Tipe tiap jaring-jaring kubus: banyak persegi pada tiap baris (11 bentuk: 6 × 1-4-1, 3 × 2-3-1, 1 × 2-2-2, 1 × 3-3). */
const KUBUS_TIPE: Record<number, string> = {
  1: "1-4-1", 2: "1-4-1", 3: "2-3-1", 4: "2-3-1", 5: "1-4-1", 6: "1-4-1",
  7: "1-4-1", 8: "1-4-1", 9: "2-3-1", 10: "2-2-2", 11: "3-3",
};
const KUBUS_TIPE_TEKS: Record<string, string> = {
  "1-4-1": "Tipe 1-4-1: empat persegi berderet lurus, dengan satu persegi di atas dan satu di bawah deretan.",
  "2-3-1": "Tipe 2-3-1: tiga baris yang berisi 2, 3, dan 1 persegi.",
  "2-2-2": "Tipe 2-2-2: tiga baris yang masing-masing berisi 2 persegi, tersusun seperti tangga.",
  "3-3": "Tipe 3-3: dua baris yang masing-masing berisi 3 persegi, bergeser satu sama lain.",
};

function jaringKubusInfo(no: number): ModelInfo {
  const tipe = KUBUS_TIPE[no];
  return {
    text: `Jaring-jaring kubus terdiri atas 6 persegi kongruen. Ada 11 bentuk jaring-jaring kubus yang berbeda; ini bentuk ke-${no}. ${KUBUS_TIPE_TEKS[tipe]} Putar dan amati bagaimana persegi-persegi itu terlipat membentuk kubus.`,
    facts: [
      ["Bentuk jaring-jaring", `${no} dari 11`],
      ["Banyak sisi", "6 persegi kongruen"],
      ["Banyak rusuk", "12"],
      ["Titik sudut", "8"],
    ],
    formulas: [String.raw`L = 6\,s^{2}`, String.raw`V = s^{3}`],
  };
}

const JARING_BALOK: ModelInfo = {
  text: "Jaring-jaring balok terdiri atas 6 persegi panjang yang membentuk 3 pasang sisi kongruen (depan–belakang, atas–bawah, kiri–kanan). Amati sisi mana yang saling berhadapan setelah terlipat.",
  facts: [
    ["Banyak sisi", "6 persegi panjang (3 pasang kongruen)"],
    ["Banyak rusuk", "12"],
    ["Titik sudut", "8"],
  ],
  formulas: [String.raw`L = 2\,(pl + pt + lt)`, String.raw`V = p \times l \times t`],
};


/* ───────── Jaring-jaring prisma ───────── */

const PRISMA_VARIAN: Record<string, { label: string; text: (bentuk: string) => string }> = {
  sejajar: {
    label: "Sejajar",
    text: () =>
      "Kedua alas menempel pada persegi panjang yang sama: satu di sisi atas dan satu di sisi bawah deretan persegi panjang.",
  },
  tangga: {
    label: "Tangga",
    text: () => "Kedua alas menempel pada dua persegi panjang yang bersebelahan, sehingga tampak seperti tangga.",
  },
  bergeser: {
    label: "Bergeser",
    text: () => "Kedua alas menempel pada persegi panjang di ujung deretan yang saling berseberangan.",
  },
  bintang: {
    label: "Bintang",
    text: (bentuk) =>
      `Satu ${bentuk} berada di tengah dan dikelilingi persegi panjang. ${cap(bentuk)} yang lain menempel pada ujung salah satu persegi panjang.`,
  },
};

function jaringPrismaInfo(n: number, text: string, bentuk = SISI_ALAS[n]): ModelInfo {
  return {
    text: `Jaring-jaring prisma ${bentuk} terdiri atas ${n} persegi panjang (sisi tegak) dan 2 ${bentuk} (alas dan atas). ${text} Putar animasinya dan amati urutan lipatannya.`,
    facts: [
      ["Banyak sisi", `${n + 2} (${n} persegi panjang + 2 ${bentuk})`],
      ["Banyak rusuk", `${3 * n}`],
      ["Titik sudut", `${2 * n}`],
    ],
    formulas: [String.raw`L = 2\,L_{\text{alas}} + K_{\text{alas}} \times t`],
  };
}

const JARING_PRISMA: SolidModel[] = [
  /* Segitiga: "Salib" adalah model lama (kedua segitiga menempel pada persegi panjang tengah). */
  {
    id: "jaring-prisma",
    group: "jaring-prisma",
    family: "Segitiga",
    title: "Jaring-jaring prisma segitiga (salib)",
    short: "Salib",
    file: file("jaring-prisma-segitiga"),
    frame: "all",
    info: jaringPrismaInfo(3, "Kedua segitiga menempel pada persegi panjang yang di tengah, di kiri dan kanannya."),
  },
  ...(["tangga", "bergeser", "bintang"] as const).map(
    (v): SolidModel => ({
      id: `jaring-prisma-segitiga-${v}`,
      group: "jaring-prisma",
      family: "Segitiga",
      title: `Jaring-jaring prisma segitiga (${PRISMA_VARIAN[v].label.toLowerCase()})`,
      short: PRISMA_VARIAN[v].label,
      file: file(`jaring-prisma-segitiga-${v}`),
      frame: "all",
      info: jaringPrismaInfo(3, PRISMA_VARIAN[v].text("segitiga")),
    }),
  ),
  {
    id: "jaring-prisma-segitiga-siku",
    group: "jaring-prisma",
    family: "Segitiga",
    title: "Jaring-jaring prisma segitiga siku-siku",
    short: "Siku-siku",
    file: file("jaring-prisma-segitiga-siku"),
    frame: "all",
    info: jaringPrismaInfo(
      3,
      "Alasnya segitiga siku-siku, sehingga ketiga persegi panjang berbeda lebar: sama dengan sisi siku-siku dan sisi miring alas.",
      "segitiga siku-siku",
    ),
  },

  /* Segilima dan segienam */
  ...([5, 6] as const).flatMap((n) =>
    (["sejajar", "tangga", "bergeser", "bintang"] as const).map(
      (v): SolidModel => ({
        id: `jaring-prisma-${SISI_ALAS[n]}-${v}`,
        group: "jaring-prisma",
        family: cap(SISI_ALAS[n]),
        title: `Jaring-jaring prisma ${SISI_ALAS[n]} (${PRISMA_VARIAN[v].label.toLowerCase()})`,
        short: PRISMA_VARIAN[v].label,
        file: file(`jaring-prisma-${SISI_ALAS[n]}-${v}`),
        frame: "all",
        info: jaringPrismaInfo(n, PRISMA_VARIAN[v].text(SISI_ALAS[n])),
      }),
    ),
  ),

  /* Alas trapesium */
  {
    id: "jaring-prisma-trapesium",
    group: "jaring-prisma",
    family: "Trapesium",
    title: "Jaring-jaring prisma trapesium",
    short: "Trapesium",
    file: file("jaring-prisma-trapesium"),
    frame: "all",
    info: {
      text: "Jaring-jaring prisma trapesium terdiri atas 4 persegi panjang dengan lebar berbeda (sama dengan keempat sisi trapesium) dan 2 trapesium kongruen sebagai alas dan atas.",
      facts: [
        ["Banyak sisi", "6 (4 persegi panjang + 2 trapesium)"],
        ["Banyak rusuk", "12"],
        ["Titik sudut", "8"],
      ],
      formulas: [String.raw`L = 2\,L_{\text{alas}} + K_{\text{alas}} \times t`],
    },
  },
];

/* ───────── Jaring-jaring limas ───────── */

const LIMAS_VARIAN: Record<string, { label: string; text: (bentuk: string, n: number) => string }> = {
  bintang: {
    label: "Bintang",
    text: (_bentuk, n) => `Alas berada di tengah dan dikelilingi ${n} segitiga sisi tegak, membentuk pola seperti bintang.`,
  },
  ujung: {
    label: "Pita ujung",
    text: (_bentuk, n) =>
      `Ke-${n} segitiga sisi tegak berderet berurutan; alas menempel pada segitiga yang berada di ujung deretan.`,
  },
  tengah: {
    label: "Pita tengah",
    text: (_bentuk, n) =>
      `Ke-${n} segitiga sisi tegak berderet berurutan; alas menempel pada segitiga yang berada di tengah deretan.`,
  },
};

function jaringLimasInfo(n: number, text: string): ModelInfo {
  const bentuk = SISI_ALAS[n];
  return {
    text: `Jaring-jaring limas ${bentuk} terdiri atas 1 alas ${bentuk} dan ${n} segitiga sebagai sisi tegak. ${text} Amati bagaimana semua segitiga terlipat dan bertemu di satu titik puncak.`,
    facts: [
      ["Banyak sisi", `${n + 1} (1 alas + ${n} sisi tegak)`],
      ["Banyak rusuk", `${2 * n}`],
      ["Titik sudut", `${n + 1}`],
    ],
    formulas: [String.raw`L = L_{\text{alas}} + \text{jumlah luas sisi tegak}`],
  };
}

const jaringLimasUrut: SolidModel[] = [
  /* Segiempat: "Bintang" adalah model lama. */
  {
    id: "jaring-limas",
    group: "jaring-limas",
    family: "Segiempat",
    title: "Jaring-jaring limas segiempat (bintang)",
    short: "Bintang",
    file: file("jaring-limas-segiempat"),
    frame: "all",
    info: jaringLimasInfo(4, LIMAS_VARIAN.bintang.text("segiempat", 4)),
  },
  ...([3, 4, 5, 6] as const).flatMap((n) =>
    (["bintang", "ujung", "tengah"] as const)
      .filter((v) => !(n === 4 && v === "bintang"))
      .map(
        (v): SolidModel => ({
          id: `jaring-limas-${SISI_ALAS[n]}-${v}`,
          group: "jaring-limas",
          family: cap(SISI_ALAS[n]),
          title: `Jaring-jaring limas ${SISI_ALAS[n]} (${LIMAS_VARIAN[v].label.toLowerCase()})`,
          short: LIMAS_VARIAN[v].label,
          file: file(`jaring-limas-${SISI_ALAS[n]}-${v}`),
          frame: "all",
          info: jaringLimasInfo(n, LIMAS_VARIAN[v].text(SISI_ALAS[n], n)),
        }),
      ),
  ),
];
const JARING_LIMAS = [...jaringLimasUrut].sort((a, b) => limasOrder(a) - limasOrder(b));

/** Urutan tampil: segitiga, segiempat, segilima, segienam; bintang lebih dulu. */
function limasOrder(m: SolidModel) {
  const alas = ["Segitiga", "Segiempat", "Segilima", "Segienam"].indexOf(m.family ?? "");
  const varian = ["Bintang", "Pita ujung", "Pita tengah"].indexOf(m.short);
  return alas * 10 + varian;
}

/* ───────── Jenis-jenis prisma ───────── */

const PRISMA_BERATURAN: SolidModel[] = [3, 4, 5, 6, 8].map(
  (n): SolidModel => ({
    id: `prisma-${SISI_ALAS[n]}`,
    group: "prisma",
    family: "Alas segi-n beraturan",
    title: `Prisma ${SISI_ALAS[n]}`,
    short: cap(SISI_ALAS[n]),
    file: file(`prisma-${SISI_ALAS[n]}`),
    frame: "all",
    info: prismaInfo(
      n,
      n === 4
        ? {
            alasFormula: String.raw`L_{\text{alas}} = s \times s = s^{2}`,
            bentuk: "persegi (segiempat beraturan)",
          }
        : {},
    ),
  }),
);

const PRISMA_LAIN: SolidModel[] = [
  {
    id: "prisma-segitiga-siku",
    group: "prisma",
    family: "Alas tidak beraturan",
    title: "Prisma segitiga siku-siku",
    short: "Segitiga siku-siku",
    file: file("prisma-segitiga-siku"),
    frame: "all",
    info: prismaInfo(3, {
      bentuk: "segitiga siku-siku",
      text: "Alas prisma ini segitiga siku-siku, sehingga ketiga sisi tegaknya persegi panjang dengan lebar berbeda. Contohnya bangun seperti atap atau potongan balok yang dibelah menurut diagonal.",
      alasFormula: String.raw`L_{\text{alas}} = \tfrac{1}{2} \times a \times t_{\text{segitiga}}`,
    }),
  },
  {
    id: "prisma-trapesium",
    group: "prisma",
    family: "Alas tidak beraturan",
    title: "Prisma trapesium",
    short: "Trapesium",
    file: file("prisma-trapesium"),
    frame: "all",
    info: prismaInfo(4, {
      bentuk: "trapesium sama kaki",
      text: "Alas dan atas prisma ini berbentuk trapesium. Dua dari empat sisi tegaknya lebih lebar, yaitu yang berimpit dengan sisi sejajar trapesium.",
      alasFormula: String.raw`L_{\text{alas}} = \tfrac{1}{2}\,(a + b) \times t_{\text{trapesium}}`,
    }),
  },
  {
    id: "prisma-belah-ketupat",
    group: "prisma",
    family: "Alas tidak beraturan",
    title: "Prisma belah ketupat",
    short: "Belah ketupat",
    file: file("prisma-belah-ketupat"),
    frame: "all",
    info: prismaInfo(4, {
      bentuk: "belah ketupat",
      text: "Alas prisma ini belah ketupat: keempat sisinya sama panjang, sehingga keempat sisi tegaknya persegi panjang yang kongruen.",
      alasFormula: String.raw`L_{\text{alas}} = \tfrac{1}{2} \times d_{1} \times d_{2}`,
    }),
  },
  {
    id: "prisma-jajargenjang",
    group: "prisma",
    family: "Alas tidak beraturan",
    title: "Prisma jajargenjang",
    short: "Jajargenjang",
    file: file("prisma-jajargenjang"),
    frame: "all",
    info: prismaInfo(4, {
      bentuk: "jajargenjang",
      text: "Alas prisma ini jajargenjang. Sisi tegak yang berhadapan kongruen, sehingga prisma tersusun dari 3 pasang sisi sejajar.",
      alasFormula: String.raw`L_{\text{alas}} = a \times t_{\text{jajargenjang}}`,
    }),
  },
  {
    id: "prisma-segitiga-miring",
    group: "prisma",
    family: "Prisma miring",
    title: "Prisma segitiga miring",
    short: "Segitiga miring",
    file: file("prisma-segitiga-miring"),
    frame: "all",
    info: prismaInfo(3, {
      text: "Pada prisma miring, rusuk tegaknya tidak tegak lurus terhadap alas, sehingga sisi tegaknya berbentuk jajargenjang. Tinggi prisma adalah jarak tegak lurus antara bidang alas dan bidang atas, bukan panjang rusuk tegak.",
      facts: [["Sisi tegak", "3 jajargenjang"]],
      luasFormula: String.raw`L = 2\,L_{\text{alas}} + \text{jumlah luas sisi tegak}`,
    }),
  },
];

/* ───────── Daftar model ───────── */

export const MODELS: SolidModel[] = [
  /* Volume kubus */
  {
    id: "kubus-3x3x3",
    group: "volume-kubus",
    title: "Volume kubus 3 × 3 × 3",
    short: "3 × 3 × 3",
    file: file("volume-kubus-3x3x3"),
    frame: "start",
    tracker: { total: 27 },
    info: {
      text: "Kubus besar tersusun dari kubus satuan dalam 3 lapisan, tiap lapisan 3 × 3 = 9 kubus. Kubus terangkat satu per satu, dimulai dari lapisan paling atas. Perhatikan penghitung di kiri atas.",
      facts: [
        ["Panjang × lebar × tinggi", "3 × 3 × 3 kubus satuan"],
        ["Kubus tiap lapisan", "3 × 3 = 9"],
        ["Banyak lapisan", "3"],
      ],
      formulas: [String.raw`V = p \times l \times t = 3 \times 3 \times 3 = 27`, String.raw`V = s^{3}`],
    },
  },
  {
    id: "kubus-4x4x4",
    group: "volume-kubus",
    title: "Volume kubus 4 × 4 × 4",
    short: "4 × 4 × 4",
    file: file("volume-kubus-4x4x4"),
    frame: "all",
    layers: true,
    info: {
      text: "Kubus 4 × 4 × 4 disusun dari kubus satuan dalam 4 lapisan. Geser penggeser lapisan untuk menampilkan lapis demi lapis, lalu hitung kubus pada tiap lapisan. Bagian dalam kubus ini berongga (2 × 2 × 2 kubus).",
      facts: [
        ["Kubus utuh", "4 × 4 × 4 = 64 kubus satuan"],
        ["Lapisan 1 dan 4", "16 kubus"],
        ["Lapisan 2 dan 3", "12 kubus (tengahnya kosong)"],
        ["Kubus pada model", "16 + 12 + 12 + 16 = 56"],
        ["Rongga di dalam", "2 × 2 × 2 = 8 kubus"],
      ],
      formulas: [String.raw`V = s^{3} = 4^{3} = 64`, String.raw`64 - 8 = 56`],
    },
  },

  /* Volume limas */
  {
    id: "kubus-3-limas",
    group: "volume-limas",
    title: "Kubus menjadi 3 limas",
    short: "Kubus → 3 limas",
    file: file("volume-limas-kubus-3-limas"),
    frame: "all",
    info: {
      text: "Sebuah kubus dibagi menjadi 3 limas segiempat yang sama besar. Alas tiap limas adalah satu sisi kubus dan tingginya sama dengan rusuk kubus. Karena ketiganya sama besar, volume satu limas adalah sepertiga volume kubus.",
      facts: [
        ["Banyak limas", "3 (sama besar)"],
        ["Alas limas", "sisi kubus (s × s)"],
        ["Tinggi limas", "rusuk kubus (s)"],
      ],
      formulas: [
        String.raw`V_{\text{kubus}} = s^{3}`,
        String.raw`V_{\text{limas}} = \tfrac{1}{3}\,s^{3} = \tfrac{1}{3} \times L_{\text{alas}} \times t`,
      ],
    },
  },

  /* Jaring-jaring */
  ...Array.from({ length: 11 }, (_, i): SolidModel => ({
    id: `jaring-kubus-${i + 1}`,
    group: "jaring-kubus-balok",
    family: "Kubus (11 bentuk)",
    title: `Jaring-jaring kubus ${i + 1}`,
    short: `${i + 1}`,
    file: file(`jaring-kubus-${i + 1}`),
    frame: "all",
    info: jaringKubusInfo(i + 1),
  })),
  { id: "jaring-balok-1", group: "jaring-kubus-balok", family: "Balok", title: "Jaring-jaring balok 1", short: "1", file: file("jaring-balok-1"), frame: "all", info: JARING_BALOK },
  { id: "jaring-balok-2", group: "jaring-kubus-balok", family: "Balok", title: "Jaring-jaring balok 2", short: "2", file: file("jaring-balok-2"), frame: "all", info: JARING_BALOK },
  /* Jaring-jaring prisma dan limas: lihat JARING_PRISMA dan JARING_LIMAS di bawah */
  ...JARING_PRISMA,
  ...JARING_LIMAS,

  /* Jenis-jenis prisma */
  ...PRISMA_BERATURAN,
  ...PRISMA_LAIN,

  /* Jenis-jenis limas */
  ...[3, 4, 5, 6].map(
    (n): SolidModel => ({
      id: `limas-${SISI_ALAS[n]}`,
      group: "limas",
      title: `Limas ${SISI_ALAS[n]}`,
      short: SISI_ALAS[n][0].toUpperCase() + SISI_ALAS[n].slice(1),
      file: file(`limas-${SISI_ALAS[n]}`),
      frame: "all",
      info: limasInfo(n),
    }),
  ),
];

export const DEFAULT_MODEL_ID = MODELS[0].id;

export const findModel = (id: string | undefined) => MODELS.find((m) => m.id === id);
export const modelsOf = (group: GroupId) => MODELS.filter((m) => m.group === group);
