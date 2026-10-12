import type { Material } from "../types";
import matriks from "./matriks";
import sppl from "./sppl";
import turunan from "./turunan";
import vektor from "./vektor";
import transformasiGeometri from "./transformasi_geometri";
import transformasiFungsi from "./transformasi_fungsi";
import statiska from "./statistika";
import polinomial from "./polinomial";
import perbandinganTrigonometri from "./perbandingan_trigonometri";
import peluang from "./peluang";
import limit from "./limit";
import lingkaran from "./lingkaran";
import komposisiFungsiInvers from "./komposisi_fungsi_invers";
import kombinatorika from "./kombinatorika";

/**
 * Daftar materi. Materi baru:
 *  1. salin data/turunan.ts → data/<materi>.ts, ganti isinya,
 *  2. impor dan tambahkan ke array ini. Selesai, tanpa menyentuh komponen.
 */
export const MATERIALS: Material[] = [
  // Kelas X
  sppl,                       // dasar aljabar untuk hampir semua materi lain
  perbandinganTrigonometri,   // sudut dan sinus-kosinus, dipakai vektor, lingkaran, dan limit trigonometri
  vektor,                     // memakai trigonometri (sudut antarvektor)
  statiska,                   // berdiri sendiri

  // Kelas XI
  komposisiFungsiInvers,      // dasar sebelum transformasi fungsi
  matriks,                    // prasyarat transformasi geometri
  transformasiGeometri,       // matriks + vektor
  transformasiFungsi,         // fungsi + pemahaman transformasi
  lingkaran,                  // jarak, persamaan kuadrat, dan garis
  polinomial,                 // faktorisasi, prasyarat limit

  // Kelas XII
  kombinatorika,              // prasyarat peluang
  peluang,
  limit,                      // fungsi, polinomial, dan trigonometri
  turunan,                    // setelah limit
];

export const getMaterial = (slug: string | undefined) => MATERIALS.find((m) => m.slug === slug);
