import { useEffect, useRef, useState } from "react";
import { IconPause, IconPlay } from "../../components/icons";
import { SolidScene } from "../../three/SolidScene";
import { solidFacts } from "../../three/solidMath";
import { LabFrame, LabSlider, Readout } from "../LabKit";
import { findShape, SHAPES } from "./shapes";

/* Lipat dan buka jaring-jaring: geser "lipatan" dari 0 (jaring-jaring rata) ke 1 (bangun utuh). */

export interface JaringState {
  shape: string;
  fold: number;
}

export function JaringLab({ initialShape = "kubus", onChange }: { initialShape?: string; onChange?: (state: JaringState) => void }) {
  const [shapeId, setShapeId] = useState(initialShape);
  const [fold, setFold] = useState(0);
  const [playing, setPlaying] = useState(false);
  const dir = useRef(1);
  const foldRef = useRef(fold);
  foldRef.current = fold;
  const cb = useRef(onChange);
  cb.current = onChange;

  const def = findShape(shapeId);
  const facts = solidFacts(def.spec);

  useEffect(() => {
    cb.current?.({ shape: shapeId, fold });
  }, [shapeId, fold]);

  // Animasi lipat: dijalankan siswa lewat tombol, berhenti di ujung.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      // Cap waktu frame pertama menjadi acuan (bukan performance.now(), yang bisa lebih besar
      // dari cap waktu frame sehingga selisihnya negatif dan animasi langsung berhenti).
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;
      const next = Math.min(1, Math.max(0, foldRef.current + dir.current * dt * 0.45));
      foldRef.current = next;
      setFold(next);
      if ((dir.current > 0 && next >= 1) || (dir.current < 0 && next <= 0)) setPlaying(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => {
    if (playing) return setPlaying(false);
    dir.current = fold >= 0.999 ? -1 : 1;
    setPlaying(true);
  };

  const side = facts.faces.length;
  const state = fold <= 0.001 ? "jaring-jaring rata" : fold >= 0.999 ? "bangun utuh" : "sedang dilipat";

  return (
    <LabFrame
      title="Simulasi 2.1 · Jaring-jaring dilipat menjadi bangun"
      hint="Mulai dari jaring-jaring rata, lalu tekan Lipat atau geser slider. Tombol Atas menampilkan jaring-jaring seperti gambar di buku."
      onReset={() => {
        setPlaying(false);
        setFold(0);
      }}
      stage={<SolidScene spec={def.spec} fold={fold} net label={`Jaring-jaring ${def.name} yang dapat dilipat`} />}
      controls={
        <>
          <div className="mt-presets" role="group" aria-label="Pilih bangun ruang">
            {SHAPES.filter((s) => s.id !== "prisma-segilima").map((s) => (
              <button key={s.id} type="button" className={`mt-chip${s.id === shapeId ? " is-on" : ""}`} aria-pressed={s.id === shapeId} onClick={() => { setPlaying(false); setShapeId(s.id); }}>
                {s.name}
              </button>
            ))}
          </div>
          <button type="button" className="mt-btn mt-btn--primary" onClick={toggle}>
            {playing ? <IconPause size={16} /> : <IconPlay size={16} />} {playing ? "Jeda" : fold >= 0.999 ? "Buka" : "Lipat"}
          </button>
          <LabSlider symbol={"\\text{lipat}"} name="besar lipatan" value={Math.round(fold * 100) / 100} min={0} max={1} step={0.01} color="#c6613f" onChange={(v) => { setPlaying(false); setFold(v); }} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Keadaan", tex: `\\text{${state}}`, wide: true },
            { label: "Banyak bidang", tex: `${side}` },
            { label: "Penyusun jaring-jaring", tex: `\\text{${def.jaring}}`, wide: true },
          ]}
        />
      }
    />
  );
}
