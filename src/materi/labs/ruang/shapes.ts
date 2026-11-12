import { isoscelesTriangle, rect, regularPolygon, type SolidSpec } from "../../three/solidMath";

/* Bangun-bangun contoh untuk peragaan unsur dan jaring-jaring. */

export interface ShapeDef {
  id: string;
  name: string;
  spec: SolidSpec;
  /** Nama bentuk bidang. */
  alas: string;
  tegak: string;
  /** Penyusun jaring-jaring. */
  jaring: string;
}

export const SHAPES: ShapeDef[] = [
  { id: "kubus", name: "Kubus", spec: { kind: "prisma", base: rect(2, 2), height: 2 }, alas: "persegi", tegak: "persegi", jaring: "6 persegi yang kongruen" },
  { id: "balok", name: "Balok", spec: { kind: "prisma", base: rect(3, 2), height: 1.6 }, alas: "persegi panjang", tegak: "persegi panjang", jaring: "3 pasang persegi panjang (yang berhadapan kongruen)" },
  { id: "prisma-segitiga", name: "Prisma segitiga", spec: { kind: "prisma", base: isoscelesTriangle(2.4, 2), height: 2.4 }, alas: "segitiga", tegak: "persegi panjang", jaring: "2 segitiga dan 3 persegi panjang" },
  { id: "prisma-segilima", name: "Prisma segi-5", spec: { kind: "prisma", base: regularPolygon(5, 1.4), height: 2 }, alas: "segilima beraturan", tegak: "persegi panjang", jaring: "2 segilima dan 5 persegi panjang" },
  { id: "limas-segiempat", name: "Limas segiempat", spec: { kind: "limas", base: rect(2, 2), height: 2 }, alas: "persegi", tegak: "segitiga", jaring: "1 persegi dan 4 segitiga" },
  { id: "limas-segitiga", name: "Limas segitiga", spec: { kind: "limas", base: regularPolygon(3, 2.4), height: 2 }, alas: "segitiga", tegak: "segitiga", jaring: "4 segitiga" },
  { id: "limas-segienam", name: "Limas segi-6", spec: { kind: "limas", base: regularPolygon(6, 1.3), height: 2.4 }, alas: "segienam beraturan", tegak: "segitiga", jaring: "1 segienam dan 6 segitiga" },
];

export const findShape = (id: string) => SHAPES.find((s) => s.id === id) ?? SHAPES[0];
