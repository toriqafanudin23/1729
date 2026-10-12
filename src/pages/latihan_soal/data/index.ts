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
import irisanKerucut from "./irisan_kerucut";
import integral from "./integral";
import fungsiPemodelan from "./fungsi_pemodelan";
import fungsiKuadrat from "./fungsi_kuadrat";
import bilanganKompleks from "./bilangan_kompleks";
import barisanDeret from "./barisan_deret";
import analisisDataPeluang from "./analisis_data_peluang";
import eksponenLogaritma from "./eksponen_logaritma";
/**
 * Daftar materi. Materi baru:
 *  1. salin data/turunan.ts → data/<materi>.ts, ganti isinya,
 *  2. impor dan tambahkan ke array ini. Selesai, tanpa menyentuh komponen.
 */
export const MATERIALS: Material[] = [
  // Kelas X
  eksponenLogaritma,
  barisanDeret,
  sppl,                       // dasar aljabar untuk hampir semua materi lain
  fungsiKuadrat,
  perbandinganTrigonometri,   // sudut dan sinus-kosinus, dipakai vektor, lingkaran, dan limit trigonometri
  vektor,                     // memakai trigonometri (sudut antarvektor)
  statiska,                   // berdiri sendiri
  bilanganKompleks,           // berdiri sendiri

  // Kelas XI
  komposisiFungsiInvers,      // dasar sebelum transformasi fungsi
  matriks,                    // prasyarat transformasi geometri
  transformasiGeometri,       // matriks + vektor
  transformasiFungsi,         // fungsi + pemahaman transformasi
  fungsiPemodelan,
  lingkaran,                  // jarak, persamaan kuadrat, dan garis
  irisanKerucut,              // prasyarat limit
  polinomial,                 // faktorisasi, prasyarat limit

  // Kelas XII
  kombinatorika,              // prasyarat peluang
  peluang,
  analisisDataPeluang,
  limit,                      // fungsi, polinomial, dan trigonometri
  turunan,                    // setelah limit
  integral
];

export const getMaterial = (slug: string | undefined) => MATERIALS.find((m) => m.slug === slug);
