import { useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "../../three/solid";
import { SolidScene } from "../../three/SolidScene";
import { solidFacts } from "../../three/solidMath";
import { LabFrame, Readout } from "../LabKit";
import { findShape, SHAPES } from "./shapes";

/* Sisi, rusuk, dan titik sudut: pilih bangun, lalu sorot unsurnya satu per satu. */

type Mode = "sisi" | "rusuk" | "titik";
export interface UnsurState {
  shape: string;
}

export function UnsurLab({ onChange }: { onChange?: (state: UnsurState) => void }) {
  const [shapeId, setShapeId] = useState("kubus");
  const [mode, setMode] = useState<Mode>("sisi");
  const [face, setFace] = useState(0);
  const cb = useRef(onChange);
  cb.current = onChange;

  const def = findShape(shapeId);
  const facts = useMemo(() => solidFacts(def.spec), [def]);
  const f = facts.faces[Math.min(face, facts.faces.length - 1)];

  useEffect(() => {
    cb.current?.({ shape: shapeId });
  }, [shapeId]);

  const faceColors = mode === "sisi" ? facts.faces.map((_, i) => (i === face ? COLORS.sorot : null)) : [];
  const roleName = f.role === "alas" ? "alas" : f.role === "tutup" ? "tutup" : "sisi tegak";
  const shapeName = f.role === "tegak" ? def.tegak : def.alas;

  return (
    <LabFrame
      title="Simulasi 1.1 · Unsur-unsur bangun ruang"
      hint="Putar bangunnya dengan menggeser mendatar. Pilih sisi, rusuk, atau titik sudut untuk menyorotnya."
      onReset={() => {
        setShapeId("kubus");
        setMode("sisi");
        setFace(0);
      }}
      stage={<SolidScene spec={def.spec} label={`Model 3D ${def.name}`} faceColors={faceColors} markers={{ edges: mode === "rusuk", vertices: mode === "titik" }} xray={mode !== "sisi"} />}
      controls={
        <>
          <div className="mt-presets" role="group" aria-label="Pilih bangun ruang">
            {SHAPES.map((s) => (
              <button key={s.id} type="button" className={`mt-chip${s.id === shapeId ? " is-on" : ""}`} aria-pressed={s.id === shapeId} onClick={() => { setShapeId(s.id); setFace(0); }}>
                {s.name}
              </button>
            ))}
          </div>
          <div className="mt-presets" role="group" aria-label="Unsur yang disorot">
            {(["sisi", "rusuk", "titik"] as Mode[]).map((m) => (
              <button key={m} type="button" className={`mt-chip${m === mode ? " is-on" : ""}`} aria-pressed={m === mode} onClick={() => setMode(m)}>
                {m === "titik" ? "Titik sudut" : m[0].toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          {mode === "sisi" && (
            <div className="mt-lab__facebox">
              <p aria-live="polite">
                <b>
                  Bidang {face + 1} dari {facts.faces.length}
                </b>
                : {roleName}, berbentuk {shapeName}
              </p>
              <div className="mt-lab__nav">
                <button type="button" className="mt-btn mt-btn--ghost" onClick={() => setFace((i) => (i + facts.faces.length - 1) % facts.faces.length)}>
                  Sebelumnya
                </button>
                <button type="button" className="mt-btn mt-btn--ghost" onClick={() => setFace((i) => (i + 1) % facts.faces.length)}>
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Sisi (s)", tex: `${facts.faces.length}` },
            { label: "Rusuk (r)", tex: `${facts.edges}` },
            { label: "Titik sudut (t)", tex: `${facts.vertices}` },
            { label: "Rumus Euler", tex: `t+s-r=${facts.vertices}+${facts.faces.length}-${facts.edges}=${facts.vertices + facts.faces.length - facts.edges}`, wide: true },
          ]}
        />
      }
    />
  );
}
