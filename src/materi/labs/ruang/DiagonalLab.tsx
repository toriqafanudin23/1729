import { useCallback, useEffect, useRef, useState } from "react";
import { Vector3, type Object3D } from "three";
import { polygonMesh, tube } from "../../three/solid";
import type { Solid } from "../../three/solid";
import { SolidScene } from "../../three/SolidScene";
import { disposeObject } from "../../three/stage";
import { rect, type V3 } from "../../three/solidMath";
import { LabFrame, LabSlider, Readout } from "../LabKit";
import { tex } from "../format";

/* Diagonal sisi, diagonal ruang, dan bidang diagonal pada balok. */

export interface DiagonalState {
  p: number;
  l: number;
  t: number;
  sumSquares: number;
}

const INIT = { p: 3, l: 4, t: 12 };
const V = (a: V3) => new Vector3(...a);
const root = (n: number) => (Number.isInteger(Math.sqrt(n)) ? `${Math.sqrt(n)}` : `\\sqrt{${n}}\\approx${tex(Math.sqrt(n))}`);

export function DiagonalLab({ onChange }: { onChange?: (state: DiagonalState) => void }) {
  const [s, setS] = useState(INIT);
  const [show, setShow] = useState({ sisi: true, ruang: true, bidang: false, xray: true });
  const cb = useRef(onChange);
  cb.current = onChange;
  const { p, l, t } = s;

  useEffect(() => {
    cb.current?.({ p, l, t, sumSquares: p * p + l * l + t * t });
  }, [p, l, t]);

  const overlay = useCallback(
    (solid: Solid) => {
      const r = solid.radius * 0.028;
      const O: V3 = [0, 0, 0];
      const A: V3 = [p, 0, l];
      const B: V3 = [p, t, l];
      const added: Object3D[] = [];
      const put = (o: Object3D) => {
        solid.addOverlay(o);
        added.push(o);
      };
      if (show.sisi) put(tube(V(O), V(A), r, 0x2563eb));
      if (show.ruang) {
        put(tube(V(O), V(B), r, 0xdc2626));
        put(tube(V(A), V(B), r * 0.6, 0x94a3b8));
        put(polygonMesh([O, A, B], 0xdc2626, 0.22));
      }
      if (show.bidang) put(polygonMesh([O, A, B, [0, t, 0]], 0x16a34a, 0.32));
      return () => {
        added.forEach((o) => {
          solid.removeOverlay(o);
          disposeObject(o);
        });
      };
    },
    [p, l, t, show.sisi, show.ruang, show.bidang],
  );

  const set = (key: "p" | "l" | "t") => (v: number) => setS((x) => ({ ...x, [key]: v }));
  const toggle = (key: keyof typeof show) => setShow((x) => ({ ...x, [key]: !x[key] }));
  const dSisi = p * p + l * l;
  const dRuang = dSisi + t * t;

  return (
    <LabFrame
      title="Simulasi 5.1 · Diagonal pada balok"
      hint="Biru: diagonal sisi alas. Merah: diagonal ruang. Hijau: bidang diagonal. Segitiga merah muda adalah segitiga siku-siku yang dipakai Pythagoras."
      onReset={() => {
        setS(INIT);
        setShow({ sisi: true, ruang: true, bidang: false, xray: true });
      }}
      stage={<SolidScene spec={{ kind: "prisma", base: rect(p, l), height: t }} xray={show.xray} overlay={overlay} label={`Balok ${p} kali ${l} kali ${t} dengan diagonal`} />}
      controls={
        <>
          <LabSlider symbol="p" name="panjang" value={p} min={1} max={12} step={1} color="#5a8bbd" onChange={set("p")} />
          <LabSlider symbol="l" name="lebar" value={l} min={1} max={12} step={1} color="#cc8a4d" onChange={set("l")} />
          <LabSlider symbol="t" name="tinggi" value={t} min={1} max={12} step={1} color="#5f7a45" onChange={set("t")} />
          <div className="mt-presets" role="group" aria-label="Tampilkan">
            {(
              [
                ["sisi", "Diagonal sisi"],
                ["ruang", "Diagonal ruang"],
                ["bidang", "Bidang diagonal"],
                ["xray", "Tembus pandang"],
              ] as const
            ).map(([k, label]) => (
              <button key={k} type="button" className={`mt-chip${show[k] ? " is-on" : ""}`} aria-pressed={show[k]} onClick={() => toggle(k)}>
                {label}
              </button>
            ))}
          </div>
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Diagonal sisi alas", tex: `d=\\sqrt{p^{2}+l^{2}}=\\sqrt{${dSisi}}=${root(dSisi)}`, wide: true },
            { label: "Diagonal ruang", tex: `D=\\sqrt{p^{2}+l^{2}+t^{2}}=\\sqrt{${dRuang}}=${root(dRuang)}`, wide: true },
            { label: "Luas bidang diagonal", tex: `d\\cdot t=${Number.isInteger(Math.sqrt(dSisi)) ? tex(Math.sqrt(dSisi) * t) : `${root(dSisi)}\\cdot${t}`}`, wide: true },
          ]}
        />
      }
    />
  );
}
