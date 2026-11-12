import { useEffect, useRef, useState } from "react";
import { BoxGeometry, Color, EdgesGeometry, Group, InstancedMesh, LineBasicMaterial, LineSegments, Matrix4, MeshLambertMaterial, BufferGeometry, Float32BufferAttribute } from "three";
import { Scene3D } from "../../three/Scene3D";
import { disposeObject, type Stage } from "../../three/stage";
import { LabFrame, LabSlider, Readout } from "../LabKit";

/* Volume balok: tumpukan kubus satuan, lapisan demi lapisan. */

export interface VolumeState {
  p: number;
  l: number;
  t: number;
  volume: number;
}

const INIT = { p: 4, l: 3, t: 3 };
const LAYER_COLORS = ["#a9c4de", "#86d1a5", "#ffc58f", "#d3d1e3", "#f4a9a9", "#b9d4cc", "#e6d18a", "#c9c7bb"];

function build(p: number, l: number, t: number, layers: number): Group {
  const count = p * l * layers;
  const group = new Group();
  const geo = new BoxGeometry(0.96, 0.96, 0.96);
  const mat = new MeshLambertMaterial({ color: 0xffffff });
  const mesh = new InstancedMesh(geo, mat, count);
  const edgeUnit = new EdgesGeometry(new BoxGeometry(1, 1, 1));
  const unit = edgeUnit.getAttribute("position");
  const lines: number[] = [];
  const m = new Matrix4();
  let i = 0;
  for (let y = 0; y < layers; y++) {
    for (let x = 0; x < p; x++) {
      for (let z = 0; z < l; z++) {
        const px = x - (p - 1) / 2;
        const py = y - (t - 1) / 2;
        const pz = z - (l - 1) / 2;
        m.makeTranslation(px, py, pz);
        mesh.setMatrixAt(i, m);
        mesh.setColorAt(i, new Color(LAYER_COLORS[y % LAYER_COLORS.length]));
        i++;
        for (let k = 0; k < unit.count; k++) lines.push(unit.getX(k) + px, unit.getY(k) + py, unit.getZ(k) + pz);
      }
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  group.add(mesh);
  const lg = new BufferGeometry();
  lg.setAttribute("position", new Float32BufferAttribute(lines, 3));
  group.add(new LineSegments(lg, new LineBasicMaterial({ color: 0x1e293b })));
  edgeUnit.dispose();
  return group;
}

export function VolumeLab({ onChange }: { onChange?: (state: VolumeState) => void }) {
  const [s, setS] = useState(INIT);
  const [layers, setLayers] = useState(INIT.t);
  const stageRef = useRef<Stage | null>(null);
  const groupRef = useRef<Group | null>(null);
  const builtKey = useRef("");
  const latest = useRef({ s, layers });
  latest.current = { s, layers };
  const cb = useRef(onChange);
  cb.current = onChange;
  const { p, l, t } = s;
  const shown = Math.min(layers, t);

  const rebuild = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const { s: d, layers: n } = latest.current;
    if (groupRef.current) {
      stage.remove(groupRef.current);
      disposeObject(groupRef.current);
    }
    const g = build(d.p, d.l, d.t, Math.min(n, d.t));
    groupRef.current = g;
    stage.add(g);
    stage.frame(Math.hypot(d.p, d.l, d.t) / 2 + 0.4);
    builtKey.current = `${d.p}|${d.l}|${d.t}|${Math.min(n, d.t)}`;
  };

  useEffect(() => {
    if (builtKey.current !== `${p}|${l}|${t}|${shown}`) rebuild();
    cb.current?.({ p, l, t, volume: p * l * t });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, l, t, shown]);

  const set = (key: "p" | "l" | "t") => (v: number) => {
    setS((x) => ({ ...x, [key]: v }));
    if (key === "t") setLayers(v);
  };

  return (
    <LabFrame
      title="Simulasi 4.1 · Menyusun kubus satuan"
      hint="Tiap kubus kecil bervolume 1 satuan. Atur ukuran balok, lalu geser lapisan untuk melihat balok terbentuk lapis demi lapis."
      onReset={() => {
        setS(INIT);
        setLayers(INIT.t);
      }}
      stage={
        <Scene3D
          label={`Tumpukan ${p * l * shown} kubus satuan`}
          onReady={(stage) => {
            stageRef.current = stage;
            rebuild();
            return () => {
              if (groupRef.current) disposeObject(groupRef.current);
              groupRef.current = null;
              stageRef.current = null;
              builtKey.current = "";
            };
          }}
        />
      }
      controls={
        <>
          <LabSlider symbol="p" name="panjang" value={p} min={1} max={8} step={1} color="#5a8bbd" onChange={set("p")} />
          <LabSlider symbol="l" name="lebar" value={l} min={1} max={8} step={1} color="#cc8a4d" onChange={set("l")} />
          <LabSlider symbol="t" name="tinggi (banyak lapisan)" value={t} min={1} max={8} step={1} color="#5f7a45" onChange={set("t")} />
          <LabSlider symbol={"\\text{lapis}"} name="lapisan yang ditampilkan" value={shown} min={1} max={t} step={1} color="#c6613f" onChange={setLayers} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Kubus per lapisan", tex: `p\\times l=${p}\\times${l}=${p * l}` },
            { label: "Banyak lapisan", tex: `${shown}\\ \\text{dari}\\ ${t}` },
            { label: "Kubus yang tampak", tex: `${p * l}\\times${shown}=${p * l * shown}`, wide: true },
            { label: "Volume balok", tex: `V=p\\times l\\times t=${p}\\times${l}\\times${t}=${p * l * t}`, wide: true },
          ]}
        />
      }
    />
  );
}
