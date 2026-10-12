/**
 * Paket yang sedang disiapkan. Tampil di katalog sebagai kartu "Segera hadir".
 * Saat sebuah paket selesai dibuat, hapus barisnya dari sini dan daftarkan
 * materinya di data/index.ts.
 */
export interface Upcoming {
  topic: string;
  category: string;
  symbol: string; // TeX tanpa pembatas
}

export const UPCOMING: Upcoming[] = [
  { topic: "Integral", category: "Kalkulus", symbol: String.raw`\int` },
  { topic: "Fungsi Kuadrat", category: "Aljabar", symbol: String.raw`ax^2` },
  { topic: "Trigonometri", category: "Trigonometri", symbol: String.raw`\sin` },
  { topic: "Irisan Kerucut", category: "Geometri analitik", symbol: "e" },
];
