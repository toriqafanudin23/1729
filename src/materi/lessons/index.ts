import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/** Isi bab tiap materi. Kunci = slug materi; urutan = urutan bab pada MATERI[].bab. */
export const LESSONS: Record<string, LazyExoticComponent<ComponentType>[]> = {
  "fungsi-kuadrat": [
    lazy(() => import("./fungsi-kuadrat/Bab1")),
    lazy(() => import("./fungsi-kuadrat/Bab2")),
    lazy(() => import("./fungsi-kuadrat/Bab3")),
    lazy(() => import("./fungsi-kuadrat/Bab4")),
    lazy(() => import("./fungsi-kuadrat/Bab5")),
    lazy(() => import("./fungsi-kuadrat/Bab6")),
    lazy(() => import("./fungsi-kuadrat/Bab7")),
    lazy(() => import("./fungsi-kuadrat/Bab8")),
  ],
  "bangun-ruang-sisi-datar": [
    lazy(() => import("./bangun-ruang-sisi-datar/Bab1")),
    lazy(() => import("./bangun-ruang-sisi-datar/Bab2")),
    lazy(() => import("./bangun-ruang-sisi-datar/Bab3")),
    lazy(() => import("./bangun-ruang-sisi-datar/Bab4")),
    lazy(() => import("./bangun-ruang-sisi-datar/Bab5")),
    lazy(() => import("./bangun-ruang-sisi-datar/Bab6")),
    lazy(() => import("./bangun-ruang-sisi-datar/Bab7")),
    lazy(() => import("./bangun-ruang-sisi-datar/Bab8")),
  ],
};
