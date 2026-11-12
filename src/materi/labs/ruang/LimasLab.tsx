import { useCallback, useEffect, useRef, useState } from "react";
import { Vector3, type Object3D } from "three";
import { tube } from "../../three/solid";
import type { Solid } from "../../three/solid";
import { SolidScene } from "../../three/SolidScene";
import { disposeObject } from "../../three/stage";
import { rect, solidFacts, type SolidSpec } from "../../three/solidMath";
import { LabFrame, LabSlider, Readout } from "../LabKit";
import { tex } from "../format";

/* Limas beralas persegi panjang: tinggi limas, tinggi sisi tegak, jaring-jaring, dan rumus. */

export interface LimasState {
  p: number;
  l: number;
  H: number;
  volume: number;
  surface: number;
}

const INIT = { p: 6, l: 6, H: 4 };
const root = (n: number) => (Number.isInteger(Math.sqrt(n)) ? `${Math.sqrt(n)}` : `\\sqrt{${tex(n)}}\\approx${tex(Math.sqrt(n))}`);

export function LimasLab({ onChange }: { onChange?: (state: LimasState) => void }) {
  const [s, setS] = useState(INIT);
  const [fold, setFold] = useState(1);
  const [show, setShow] = useState({ tinggi: true, sisi: true });
  const cb = useRef(onChange);
  cb.current = onChange;
  const { p, l, H } = s;

  const spec: SolidSpec = { kind: "limas", base: rect(p, l), height: H };
  const facts = solidFacts(spec);

  useEffect(() => {
    cb.current?.({ p, l, H, volume: facts.volume, surface: facts.surfaceArea });
  }, [p, l, H, facts.volume, facts.surfaceArea]);

  const overlay = useCallback(
    (solid: Solid) => {
      const r = solid.radius * 0.026;
      const apex = new Vector3(p / 2, H, l / 2);
      const added: Object3D[] = [];
      const put = (o: Object3D) => {
        solid.addOverlay(o);
        added.push(o);
      };
      if (show.tinggi) put(tube(apex, new Vector3(p / 2, 0, l / 2), r, 0xdc2626));
      if (show.sisi) {
        put(tube(apex, new Vector3(p / 2, 0, 0), r, 0x16a34a));
        if (p !== l) put(tube(apex, new Vector3(p, 0, l / 2), r, 0x7c3aed));
      }
      return () =>
        added.forEach((o) => {
          solid.removeOverlay(o);
          disposeObject(o);
        });
    },
    [p, l, H, show.tinggi, show.sisi],
  );

  const set = (key: "p" | "l" | "H") => (v: number) => setS((x) => ({ ...x, [key]: v }));

  return (
    <LabFrame
      title="Simulasi 7.2 · Limas dan jaring-jaringnya"
      hint="Garis merah: tinggi limas. Garis hijau (dan ungu): tinggi sisi tegak, yaitu jarak puncak ke tengah rusuk alas. Keduanya membentuk segitiga siku-siku dengan setengah sisi alas."
      onReset={() => {
        setS(INIT);
        setFold(1);
      }}
      stage={<SolidScene spec={spec} fold={fold} net overlay={overlay} label={`Limas beralas persegi panjang ${p} kali ${l} dengan tinggi ${H}`} />}
      controls={
        <>
          <LabSlider symbol="p" name="panjang alas" value={p} min={2} max={12} step={1} color="#5a8bbd" onChange={set("p")} />
          <LabSlider symbol="l" name="lebar alas" value={l} min={2} max={12} step={1} color="#cc8a4d" onChange={set("l")} />
          <LabSlider symbol="t" name="tinggi limas" value={H} min={1} max={12} step={1} color="#b8453a" onChange={set("H")} />
          <LabSlider symbol={"\\text{buka}"} name="besar lipatan jaring-jaring" value={Math.round(fold * 100) / 100} min={0} max={1} step={0.01} color="#c6613f" onChange={setFold} />
          <div className="mt-presets" role="group" aria-label="Tampilkan garis">
            <button type="button" className={`mt-chip${show.tinggi ? " is-on" : ""}`} aria-pressed={show.tinggi} onClick={() => setShow((x) => ({ ...x, tinggi: !x.tinggi }))}>
              Tinggi limas
            </button>
            <button type="button" className={`mt-chip${show.sisi ? " is-on" : ""}`} aria-pressed={show.sisi} onClick={() => setShow((x) => ({ ...x, sisi: !x.sisi }))}>
              Tinggi sisi tegak
            </button>
          </div>
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Tinggi sisi tegak (hijau)", tex: `s=\\sqrt{t^{2}+\\left(\\tfrac{l}{2}\\right)^{2}}=\\sqrt{${H * H}+${tex((l / 2) ** 2)}}=${root(H * H + (l / 2) ** 2)}`, wide: true },
            ...(p !== l ? [{ label: "Tinggi sisi tegak (ungu)", tex: `s'=\\sqrt{${H * H}+${tex((p / 2) ** 2)}}=${root(H * H + (p / 2) ** 2)}`, wide: true }] : []),
            { label: "Luas permukaan", tex: `L=${tex(facts.baseArea)}+${tex(facts.lateralArea)}=${tex(facts.surfaceArea)}`, wide: true },
            { label: "Volume", tex: `V=\\tfrac{1}{3}\\cdot${tex(facts.baseArea)}\\cdot${H}=${tex(facts.volume)}`, wide: true },
          ]}
        />
      }
    />
  );
}
