/* ------------------------------------------------------------------ *
 *  Data simulasi Bangun Ruang Sisi Datar (model 3D berformat .glb).
 *
 *  Menambah model baru:
 *   1. Taruh berkasnya di public/models/bangun-ruang/.
 *   2. Tambahkan satu objek di MODELS (pilih `group` yang sudah ada).
 *  Grup, tombol pilihan, dan panel penjelasan menyesuaikan sendiri.
 * ------------------------------------------------------------------ */

export type GroupId = "volume-kubus" | "volume-limas" | "jaring" | "prisma" | "limas";

export interface GroupDef {
  id: GroupId;
  label: string;
  hint: string;
}

export const GROUPS: GroupDef[] = [
  { id: "volume-kubus", label: "Volume kubus", hint: "Menghitung kubus satuan" },
  { id: "volume-limas", label: "Volume limas", hint: "Kubus menjadi 3 limas" },
  { id: "jaring", label: "Jaring-jaring", hint: "Membuka dan melipat sisi" },
  { id: "prisma", label: "Prisma", hint: "Berbagai bentuk alas" },
  { id: "limas", label: "Limas", hint: "Berbagai bentuk alas" },
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

const SISI_ALAS: Record<number, string> = { 3: "segitiga", 4: "segiempat", 5: "segilima", 6: "segienam" };

function prismaInfo(n: number): ModelInfo {
  const bentuk = SISI_ALAS[n];
  return {
    text: `Prisma ${bentuk} memiliki dua bidang sejajar yang kongruen (alas dan atas) berbentuk ${bentuk}, dihubungkan oleh ${n} sisi tegak berbentuk persegi panjang. Putar modelnya dan hitung sendiri sisi, rusuk, serta titik sudutnya.`,
    facts: [
      ["Bentuk alas", bentuk],
      ["Banyak sisi", `${n + 2} (2 alas + ${n} sisi tegak)`],
      ["Banyak rusuk", `${3 * n}`],
      ["Titik sudut", `${2 * n}`],
    ],
    formulas: [
      String.raw`V = L_{\text{alas}} \times t`,
      String.raw`L = 2\,L_{\text{alas}} + K_{\text{alas}} \times t`,
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

const JARING_KUBUS: ModelInfo = {
  text: "Jaring-jaring kubus terdiri atas 6 persegi kongruen. Ada 11 bentuk jaring-jaring kubus yang berbeda; ini salah satunya. Putar dan amati bagaimana persegi-persegi itu terlipat membentuk kubus.",
  facts: [
    ["Banyak sisi", "6 persegi kongruen"],
    ["Banyak rusuk", "12"],
    ["Titik sudut", "8"],
  ],
  formulas: [String.raw`L = 6\,s^{2}`, String.raw`V = s^{3}`],
};

const JARING_BALOK: ModelInfo = {
  text: "Jaring-jaring balok terdiri atas 6 persegi panjang yang membentuk 3 pasang sisi kongruen (depan–belakang, atas–bawah, kiri–kanan). Amati sisi mana yang saling berhadapan setelah terlipat.",
  facts: [
    ["Banyak sisi", "6 persegi panjang (3 pasang kongruen)"],
    ["Banyak rusuk", "12"],
    ["Titik sudut", "8"],
  ],
  formulas: [String.raw`L = 2\,(pl + pt + lt)`, String.raw`V = p \times l \times t`],
};

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
  { id: "jaring-kubus-1", group: "jaring", title: "Jaring-jaring kubus 1", short: "Kubus 1", file: file("jaring-kubus-1"), frame: "all", info: JARING_KUBUS },
  { id: "jaring-kubus-2", group: "jaring", title: "Jaring-jaring kubus 2", short: "Kubus 2", file: file("jaring-kubus-2"), frame: "all", info: JARING_KUBUS },
  { id: "jaring-kubus-3", group: "jaring", title: "Jaring-jaring kubus 3", short: "Kubus 3", file: file("jaring-kubus-3"), frame: "all", info: JARING_KUBUS },
  { id: "jaring-kubus-4", group: "jaring", title: "Jaring-jaring kubus 4", short: "Kubus 4", file: file("jaring-kubus-4"), frame: "all", info: JARING_KUBUS },
  { id: "jaring-balok-1", group: "jaring", title: "Jaring-jaring balok 1", short: "Balok 1", file: file("jaring-balok-1"), frame: "all", info: JARING_BALOK },
  { id: "jaring-balok-2", group: "jaring", title: "Jaring-jaring balok 2", short: "Balok 2", file: file("jaring-balok-2"), frame: "all", info: JARING_BALOK },
  {
    id: "jaring-limas",
    group: "jaring",
    title: "Jaring-jaring limas segiempat",
    short: "Limas",
    file: file("jaring-limas-segiempat"),
    frame: "all",
    info: {
      text: "Jaring-jaring limas segiempat terdiri atas 1 alas segiempat dan 4 sisi tegak berbentuk segitiga. Amati bagaimana keempat sisi tegak terlipat dan bertemu di satu titik puncak.",
      facts: [
        ["Banyak sisi", "5 (1 alas + 4 sisi tegak)"],
        ["Banyak rusuk", "8"],
        ["Titik sudut", "5"],
      ],
      formulas: [String.raw`L = L_{\text{alas}} + \text{jumlah luas sisi tegak}`],
    },
  },
  {
    id: "jaring-prisma",
    group: "jaring",
    title: "Jaring-jaring prisma segitiga",
    short: "Prisma",
    file: file("jaring-prisma-segitiga"),
    frame: "all",
    info: {
      text: "Jaring-jaring prisma segitiga terdiri atas 2 segitiga (alas dan atas) dan 3 persegi panjang sebagai sisi tegak. Amati bagaimana sisi-sisi tegak terlipat mengelilingi alas.",
      facts: [
        ["Banyak sisi", "5 (2 segitiga + 3 persegi panjang)"],
        ["Banyak rusuk", "9"],
        ["Titik sudut", "6"],
      ],
      formulas: [String.raw`L = 2\,L_{\text{alas}} + K_{\text{alas}} \times t`],
    },
  },

  /* Jenis-jenis prisma */
  ...[3, 5, 6].map(
    (n): SolidModel => ({
      id: `prisma-${SISI_ALAS[n]}`,
      group: "prisma",
      title: `Prisma ${SISI_ALAS[n]}`,
      short: SISI_ALAS[n][0].toUpperCase() + SISI_ALAS[n].slice(1),
      file: file(`prisma-${SISI_ALAS[n]}`),
      frame: "all",
      info: prismaInfo(n),
    }),
  ),

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
