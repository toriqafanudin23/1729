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
export const MATERIALS: Material[] = [limit, turunan, matriks, vektor, sppl, transformasiGeometri, transformasiFungsi, statiska, polinomial, perbandinganTrigonometri, peluang, lingkaran, komposisiFungsiInvers, kombinatorika];

export const getMaterial = (slug: string | undefined) => MATERIALS.find((m) => m.slug === slug);
