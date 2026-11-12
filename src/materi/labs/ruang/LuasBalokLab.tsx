import { useEffect, useRef, useState } from "react";
import { COLORS } from "../../three/solid";
import { SolidScene } from "../../three/SolidScene";
import { rect } from "../../three/solidMath";
import { LabFrame, LabSlider, Readout } from "../LabKit";

/* Luas permukaan balok: tiga pasang bidang berwarna, dibuka menjadi jaring-jaring. */

export interface BalokState {
  p: number;
  l: number;
  t: number;
  surface: number;
  volume: number;
}

const INIT = { p: 5, l: 3, t: 4 };
const PRESETS = [
  { label: "Balok 5 × 3 × 4", p: 5, l: 3, t: 4 },
  { label: "Kubus 4", p: 4, l: 4, t: 4 },
  { label: "Balok 6 × 2 × 2", p: 6, l: 2, t: 2 },
];

export function LuasBalokLab({ onChange }: { onChange?: (state: BalokState) => void }) {
  const [s, setS] = useState(INIT);
  const [fold, setFold] = useState(1);
  const cb = useRef(onChange);
  cb.current = onChange;
  const { p, l, t } = s;
  const surface = 2 * (p * l + p * t + l * t);

  useEffect(() => {
    cb.current?.({ p, l, t, surface, volume: p * l * t });
  }, [p, l, t, surface]);

  // Indeks bidang: 0 alas, 1..4 sisi tegak (p, l, p, l), 5 tutup.
  const colors = [COLORS.biru, COLORS.hijau, COLORS.jingga, COLORS.hijau, COLORS.jingga, COLORS.biru];
  const set = (key: "p" | "l" | "t") => (v: number) => setS((x) => ({ ...x, [key]: v }));

  return (
    <LabFrame
      title="Simulasi 3.1 · Luas permukaan balok"
      hint="Setiap warna adalah satu pasang bidang yang kongruen. Buka jaring-jaringnya untuk melihat keenam bidang sekaligus."
      onReset={() => {
        setS(INIT);
        setFold(1);
      }}
      stage={<SolidScene spec={{ kind: "prisma", base: rect(p, l), height: t }} fold={fold} net faceColors={colors} label={`Balok ${p} kali ${l} kali ${t}`} />}
      controls={
        <>
          <div className="mt-presets" role="group" aria-label="Contoh ukuran">
            {PRESETS.map((x) => (
              <button key={x.label} type="button" className={`mt-chip${x.p === p && x.l === l && x.t === t ? " is-on" : ""}`} aria-pressed={x.p === p && x.l === l && x.t === t} onClick={() => setS({ p: x.p, l: x.l, t: x.t })}>
                {x.label}
              </button>
            ))}
          </div>
          <LabSlider symbol="p" name="panjang" value={p} min={1} max={8} step={1} color="#5a8bbd" onChange={set("p")} />
          <LabSlider symbol="l" name="lebar" value={l} min={1} max={8} step={1} color="#cc8a4d" onChange={set("l")} />
          <LabSlider symbol="t" name="tinggi" value={t} min={1} max={8} step={1} color="#5f7a45" onChange={set("t")} />
          <LabSlider symbol={"\\text{buka}"} name="besar lipatan jaring-jaring" value={Math.round(fold * 100) / 100} min={0} max={1} step={0.01} color="#c6613f" onChange={setFold} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Alas + tutup (biru)", tex: `2(p\\cdot l)=2(${p}\\cdot${l})=${2 * p * l}` },
            { label: "Depan + belakang (hijau)", tex: `2(p\\cdot t)=2(${p}\\cdot${t})=${2 * p * t}` },
            { label: "Kiri + kanan (jingga)", tex: `2(l\\cdot t)=2(${l}\\cdot${t})=${2 * l * t}` },
            { label: "Luas permukaan", tex: `L=${2 * p * l}+${2 * p * t}+${2 * l * t}=${surface}`, wide: true },
          ]}
        />
      }
    />
  );
}
