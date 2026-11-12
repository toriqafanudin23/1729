import { useEffect, useRef } from "react";
import { Scene3D } from "./Scene3D";
import { Solid, COLORS } from "./solid";
import { disposeObject, type Stage, type ViewPreset } from "./stage";
import type { SolidSpec } from "./solidMath";

/* Menampilkan satu SolidSpec. Spesifikasi baru membangun ulang benda; pengaturan lain
   (lipatan, warna, tembus pandang, titik dan rusuk) diterapkan tanpa membangun ulang. */

export interface SolidSceneProps {
  spec: SolidSpec;
  label: string;
  /** 0 = jaring-jaring, 1 = bangun utuh. */
  fold?: number;
  /** Warna per bidang (indeks bidang); undefined/null = warna asli. */
  faceColors?: (number | null | undefined)[];
  xray?: boolean;
  markers?: { vertices?: boolean; edges?: boolean };
  /** Bingkai kamera agar jaring-jaring rata juga muat. */
  net?: boolean;
  view?: ViewPreset;
  /** Benda tambahan dalam koordinat alas. Dibangun ulang bila fungsinya berganti. */
  overlay?: (solid: Solid) => (() => void) | void;
  /** Tambahan jari-jari bingkai untuk benda tambahan (mis. limas di atas balok). */
  extraRadius?: number;
}

export function SolidScene(props: SolidSceneProps) {
  const stageRef = useRef<Stage | null>(null);
  const solidRef = useRef<Solid | null>(null);
  const builtKey = useRef("");
  const overlayCleanup = useRef<(() => void) | void>(undefined);
  const latest = useRef(props);
  latest.current = props;

  const key = `${JSON.stringify(props.spec)}|${props.net ? 1 : 0}`;

  const applyDynamic = () => {
    const p = latest.current;
    const solid = solidRef.current;
    if (!solid) return;
    solid.setFold(p.fold ?? 1);
    for (let i = 0; i < solid.faceCount; i++) {
      const c = p.faceColors?.[i];
      solid.setFaceColor(i, c ?? null);
    }
    solid.setXray(Boolean(p.xray));
    solid.setMarkers(p.markers ?? {});
    stageRef.current?.render();
  };

  const applyOverlay = () => {
    overlayCleanup.current?.();
    overlayCleanup.current = undefined;
    const solid = solidRef.current;
    const make = latest.current.overlay;
    if (solid && make) overlayCleanup.current = make(solid);
    stageRef.current?.render();
  };

  const rebuild = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const p = latest.current;
    overlayCleanup.current?.();
    overlayCleanup.current = undefined;
    if (solidRef.current) {
      stage.remove(solidRef.current.group);
      solidRef.current.dispose();
    }
    const solid = new Solid(p.spec, { net: p.net });
    solidRef.current = solid;
    stage.add(solid.group);
    stage.frame(solid.radius + (p.extraRadius ?? 0));
    builtKey.current = key;
    applyDynamic();
    applyOverlay();
  };

  // Spesifikasi berubah → bangun ulang.
  useEffect(() => {
    if (builtKey.current !== key) rebuild();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Pengaturan tampilan berubah → terapkan saja.
  const colorsKey = (props.faceColors ?? []).join(",");
  const markersKey = `${props.markers?.vertices ? 1 : 0}${props.markers?.edges ? 1 : 0}`;
  useEffect(() => {
    applyDynamic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fold, colorsKey, props.xray, markersKey]);

  // Fungsi benda tambahan berganti → bangun ulang hanya benda tambahannya.
  useEffect(() => {
    applyOverlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.overlay]);

  return (
    <Scene3D
      label={props.label}
      view={props.view}
      onReady={(stage) => {
        stageRef.current = stage;
        rebuild();
        return () => {
          overlayCleanup.current?.();
          overlayCleanup.current = undefined;
          if (solidRef.current) disposeObject(solidRef.current.group);
          solidRef.current = null;
          stageRef.current = null;
          builtKey.current = "";
        };
      }}
    />
  );
}

export { COLORS };
