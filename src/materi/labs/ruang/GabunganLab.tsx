import { useCallback, useState } from "react";
import { Vector3 } from "three";
import { COLORS, Solid } from "../../three/solid";
import { SolidScene } from "../../three/SolidScene";
import { disposeObject } from "../../three/stage";
import { rect, solidFacts } from "../../three/solidMath";
import { LabFrame, LabSlider, Readout } from "../LabKit";
import { tex } from "../format";

/* Bangun gabungan: balok dengan limas di atasnya (menara, tenda, atap). */

const INIT = { p: 6, l: 6, t: 5, H: 4 };

export function GabunganLab() {
  const [s, setS] = useState(INIT);
  const [xray, setXray] = useState(false);
  const { p, l, t, H } = s;

  const box = solidFacts({ kind: "prisma", base: rect(p, l), height: t });
  const pyr = solidFacts({ kind: "limas", base: rect(p, l), height: H });
  // Bidang yang tersembunyi: tutup balok dan alas limas saling menempel.
  const boxExposed = box.surfaceArea - p * l;
  const pyrExposed = pyr.lateralArea;
  const total = boxExposed + pyrExposed;

  const overlay = useCallback(
    (solid: Solid) => {
      const top = new Solid({ kind: "limas", base: rect(p, l), height: H });
      top.setFaceVisible(0, false);
      for (let i = 1; i < top.faceCount; i++) top.setFaceColor(i, COLORS.jingga);
      top.setXray(xray);
      // Letakkan limas tepat di atas balok: pusatnya (kotak pembatas) berada pada (p/2, H/2, l/2) dari alasnya.
      top.group.position.copy(new Vector3(top.center[0], t + top.center[1], top.center[2]));
      solid.setFaceVisible(5, false);
      solid.addOverlay(top.group);
      return () => {
        solid.setFaceVisible(5, true);
        solid.removeOverlay(top.group);
        disposeObject(top.group);
      };
    },
    [p, l, t, H, xray],
  );

  const set = (key: "p" | "l" | "t" | "H") => (v: number) => setS((x) => ({ ...x, [key]: v }));

  return (
    <LabFrame
      title="Simulasi 8.1 · Balok dengan limas di atasnya"
      hint="Bidang tempat limas menempel pada balok tidak ikut dihitung: ia ada di dalam dan tidak terlihat dari luar."
      onReset={() => setS(INIT)}
      stage={<SolidScene spec={{ kind: "prisma", base: rect(p, l), height: t }} extraRadius={H / 2} xray={xray} overlay={overlay} label="Balok dengan limas di atasnya" />}
      controls={
        <>
          <LabSlider symbol="p" name="panjang alas" value={p} min={2} max={10} step={2} color="#5a8bbd" onChange={set("p")} />
          <LabSlider symbol="l" name="lebar alas" value={l} min={2} max={10} step={2} color="#cc8a4d" onChange={set("l")} />
          <LabSlider symbol="t" name="tinggi balok" value={t} min={1} max={10} step={1} color="#5f7a45" onChange={set("t")} />
          <LabSlider symbol="H" name="tinggi limas" value={H} min={1} max={10} step={1} color="#b8453a" onChange={set("H")} />
          <button type="button" className={`mt-chip${xray ? " is-on" : ""}`} aria-pressed={xray} onClick={() => setXray((x) => !x)}>
            Tembus pandang
          </button>
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Luas balok (tanpa tutup)", tex: `${tex(boxExposed)}` },
            { label: "Luas sisi tegak limas", tex: `${tex(pyrExposed)}` },
            { label: "Luas permukaan gabungan", tex: `L=${tex(boxExposed)}+${tex(pyrExposed)}=${tex(total)}`, wide: true },
            { label: "Volume gabungan", tex: `V=${tex(box.volume)}+${tex(pyr.volume)}=${tex(box.volume + pyr.volume)}`, wide: true },
          ]}
        />
      }
    />
  );
}
