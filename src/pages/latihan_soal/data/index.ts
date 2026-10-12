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
import prediksiTka2027 from "./prediksiTKA2027SMA";


export const MATERIALS: Material[] = [
  eksponenLogaritma,
  barisanDeret,
  sppl,
  fungsiKuadrat,
  perbandinganTrigonometri,
  vektor,
  statiska,
  bilanganKompleks,
  komposisiFungsiInvers,
  matriks,
  transformasiGeometri,
  transformasiFungsi,
  fungsiPemodelan,
  lingkaran,
  irisanKerucut,
  polinomial,
  kombinatorika,
  peluang,
  analisisDataPeluang,
  limit,
  turunan,
  integral,
  prediksiTka2027
];

export const getMaterial = (slug: string | undefined) => MATERIALS.find((m) => m.slug === slug);
