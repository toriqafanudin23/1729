import type { Material } from "../types";
import matriks from "./matriks";
import sppl from "./sppl";
import turunan from "./turunan";
import vektor from "./vektor";

/**
 * Daftar materi. Materi baru:
 *  1. salin data/turunan.ts → data/<materi>.ts, ganti isinya,
 *  2. impor dan tambahkan ke array ini. Selesai, tanpa menyentuh komponen.
 */
export const MATERIALS: Material[] = [turunan, matriks, vektor, sppl];

export const getMaterial = (slug: string | undefined) => MATERIALS.find((m) => m.slug === slug);
