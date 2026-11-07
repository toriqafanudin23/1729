import { useEffect, useRef, useState } from "react";
import { Quaternion, Vector3 } from "three";
import { Scene3D } from "../../three/Scene3D";
import { COLORS, Solid } from "../../three/solid";
import { disposeObject, type Stage } from "../../three/stage";
import { rect } from "../../three/solidMath";
import { LabFrame, LabSlider, Readout } from "../LabKit";

/* Satu kubus dapat dibagi menjadi tiga limas yang kongruen. */

const PYRAMID_COLORS = [COLORS.biru, COLORS.hijau, COLORS.jingga];
const AXIS = new Vector3(1, -1, 1).normalize();

export function LimasKubusLab() {
  const [explode, setExplode] = useState(0.6);
  const [side, setSide] = useState(4);
  const stageRef = useRef<Stage | null>(null);
  const parts = useRef<{ solid: Solid; quat: Quaternion }[]>([]);
  const builtSide = useRef(0);
  const latest = useRef({ explode, side });
  latest.current = { explode, side };

  const place = () => {
    const { explode: e, side: s } = latest.current;
    parts.current.forEach(({ solid, quat }) => {
      solid.group.quaternion.copy(quat);
      solid.group.position.set(0, -e * s * 0.6, 0).applyQuaternion(quat);
    });
    stageRef.current?.render();
  };

  const rebuild = () => {
    const stage = stageRef.current;
    if (!stage) return;
    parts.current.forEach(({ solid }) => {
      stage.remove(solid.group);
      solid.dispose();
    });
    parts.current = [];
    const s = latest.current.side;
    for (let i = 0; i < 3; i++) {
      // Limas beralas persegi s×s dengan puncak tepat di atas satu sudut alas.
      const solid = new Solid({ kind: "limas", base: rect(s, s), height: s, apex: [0, 0] });
      for (let f = 0; f < solid.faceCount; f++) solid.setFaceColor(f, PYRAMID_COLORS[i]);
      stage.add(solid.group);
      parts.current.push({ solid, quat: new Quaternion().setFromAxisAngle(AXIS, (i * 2 * Math.PI) / 3) });
    }
    stage.frame((s * Math.sqrt(3)) / 2 + s * 0.55);
    builtSide.current = s;
    place();
  };

  useEffect(() => {
    if (builtSide.current !== side) rebuild();
    else place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explode, side]);

  const cube = side ** 3;

  return (
    <LabFrame
      title="Simulasi 7.1 · Tiga limas menjadi satu kubus"
      hint="Tiga limas yang kongruen (tiap warna satu limas) tersusun menjadi satu kubus. Geser slider untuk memisahkan atau menyatukannya."
      onReset={() => {
        setExplode(0.6);
        setSide(4);
      }}
      stage={
        <Scene3D
          label="Tiga limas berwarna biru, hijau, dan jingga yang dapat disusun menjadi satu kubus"
          onReady={(stage) => {
            stageRef.current = stage;
            rebuild();
            return () => {
              parts.current.forEach(({ solid }) => disposeObject(solid.group));
              parts.current = [];
              stageRef.current = null;
              builtSide.current = 0;
            };
          }}
        />
      }
      controls={
        <>
          <LabSlider symbol={"\\text{pisah}"} name="jarak antar limas" value={Math.round(explode * 100) / 100} min={0} max={1} step={0.01} color="#c6613f" onChange={setExplode} />
          <LabSlider symbol="s" name="rusuk kubus" value={side} min={2} max={8} step={1} color="#5a8bbd" onChange={setSide} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Volume kubus", tex: `s^{3}=${side}^{3}=${cube}`, wide: true },
            { label: "Volume satu limas", tex: `\\tfrac{1}{3}\\cdot${cube}=${cube / 3}`, wide: true },
            { label: "Alas dan tinggi limas", tex: `L_{a}=s^{2}=${side * side},\\ t=s=${side}`, wide: true },
            { label: "Cocokkan", tex: `\\tfrac{1}{3}\\cdot L_{a}\\cdot t=\\tfrac{1}{3}\\cdot${side * side}\\cdot${side}=${(side * side * side) / 3}`, wide: true },
          ]}
        />
      }
    />
  );
}
