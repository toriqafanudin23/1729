import { useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "../../three/solid";
import { SolidScene } from "../../three/SolidScene";
import { isoscelesTrapezoid, isoscelesTriangle, rightTriangle, solidFacts, type SolidSpec } from "../../three/solidMath";
import { LabFrame, LabSlider, Readout } from "../LabKit";
import { tex } from "../format";

/* Prisma tegak dengan tiga pilihan alas. Luas permukaan = 2 × luas alas + keliling alas × tinggi. */

export type PrismaType = "siku" | "trapesium" | "samakaki";
export interface PrismaState {
  type: PrismaType;
  volume: number;
  surface: number;
  baseArea: number;
}

const TYPES: { id: PrismaType; name: string }[] = [
  { id: "siku", name: "Alas segitiga siku-siku" },
  { id: "trapesium", name: "Alas trapesium sama kaki" },
  { id: "samakaki", name: "Alas segitiga sama kaki" },
];

const INIT: Record<PrismaType, { a: number; b: number; h: number }> = {
  siku: { a: 6, b: 8, h: 10 },
  trapesium: { a: 10, b: 4, h: 5 },
  samakaki: { a: 6, b: 4, h: 8 },
};
// Untuk trapesium, `b` = sisi sejajar atas dan tinggi trapesium dibawa oleh `t`.
const INIT_T = 4;

export function PrismaLab({ types = ["siku", "trapesium", "samakaki"], initialType = "siku", onChange }: { types?: PrismaType[]; initialType?: PrismaType; onChange?: (state: PrismaState) => void }) {
  const [type, setType] = useState<PrismaType>(initialType);
  const [d, setD] = useState({ ...INIT[initialType], t: INIT_T });
  const [fold, setFold] = useState(1);
  const cb = useRef(onChange);
  cb.current = onChange;

  const spec: SolidSpec = useMemo(() => {
    const base = type === "siku" ? rightTriangle(d.a, d.b) : type === "samakaki" ? isoscelesTriangle(d.a, d.b) : isoscelesTrapezoid(d.a, d.b, d.t);
    return { kind: "prisma", base, height: d.h };
  }, [type, d]);
  const facts = useMemo(() => solidFacts(spec), [spec]);

  useEffect(() => {
    cb.current?.({ type, volume: facts.volume, surface: facts.surfaceArea, baseArea: facts.baseArea });
  }, [type, facts]);

  const pick = (id: PrismaType) => {
    setType(id);
    setD({ ...INIT[id], t: INIT_T });
  };
  const set = (key: "a" | "b" | "h" | "t") => (v: number) => setD((x) => ({ ...x, [key]: v }));
  const colors: number[] = [COLORS.alas, ...spec.base.map(() => COLORS.tegak), COLORS.alas];

  const labels =
    type === "siku"
      ? { a: "alas segitiga", b: "tinggi segitiga" }
      : type === "samakaki"
        ? { a: "alas segitiga", b: "tinggi segitiga" }
        : { a: "sisi sejajar bawah", b: "sisi sejajar atas" };

  return (
    <LabFrame
      title="Simulasi 6.1 · Prisma dan jaring-jaringnya"
      hint="Alas dan tutup berwarna biru; sisi tegak berwarna jingga. Buka jaring-jaringnya untuk melihat bahwa luas permukaan = 2 × alas + keliling alas × tinggi."
      onReset={() => {
        setD({ ...INIT[type], t: INIT_T });
        setFold(1);
      }}
      stage={<SolidScene spec={spec} fold={fold} net faceColors={colors} label="Prisma tegak yang dapat dibuka menjadi jaring-jaring" />}
      controls={
        <>
          {types.length > 1 && (
            <div className="mt-presets" role="group" aria-label="Bentuk alas">
              {TYPES.filter((x) => types.includes(x.id)).map((x) => (
                <button key={x.id} type="button" className={`mt-chip${x.id === type ? " is-on" : ""}`} aria-pressed={x.id === type} onClick={() => pick(x.id)}>
                  {x.name}
                </button>
              ))}
            </div>
          )}
          <LabSlider symbol="a" name={labels.a} value={d.a} min={type === "trapesium" ? 2 : 2} max={12} step={type === "samakaki" ? 2 : 1} color="#5a8bbd" onChange={set("a")} />
          <LabSlider symbol="b" name={labels.b} value={d.b} min={2} max={12} step={type === "samakaki" ? 1 : 1} color="#cc8a4d" onChange={set("b")} />
          {type === "trapesium" && <LabSlider symbol="t" name="tinggi trapesium" value={d.t} min={2} max={10} step={1} color="#7a76a8" onChange={set("t")} />}
          <LabSlider symbol="H" name="tinggi prisma" value={d.h} min={2} max={12} step={1} color="#5f7a45" onChange={set("h")} />
          <LabSlider symbol={"\\text{buka}"} name="besar lipatan jaring-jaring" value={Math.round(fold * 100) / 100} min={0} max={1} step={0.01} color="#c6613f" onChange={setFold} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Luas alas", tex: `L_{a}=${tex(facts.baseArea)}` },
            { label: "Keliling alas", tex: `K=${tex(facts.basePerimeter)}` },
            { label: "Luas permukaan", tex: `L=2L_{a}+K\\cdot H=${tex(2 * facts.baseArea)}+${tex(facts.basePerimeter)}\\cdot${d.h}=${tex(facts.surfaceArea)}`, wide: true },
            { label: "Volume", tex: `V=L_{a}\\cdot H=${tex(facts.baseArea)}\\cdot${d.h}=${tex(facts.volume)}`, wide: true },
          ]}
        />
      }
    />
  );
}
