import { useEffect, useRef, useState } from "react";
import { Stage, type ViewPreset } from "./stage";

/* Kerangka React untuk panggung 3D: kanvas + bilah tombol sudut pandang di atasnya. */

const VIEWS: { id: ViewPreset; label: string }[] = [
  { id: "serong", label: "Serong" },
  { id: "depan", label: "Depan" },
  { id: "atas", label: "Atas" },
  { id: "samping", label: "Samping" },
];

export function Scene3D({
  label,
  onReady,
  view = "serong",
}: {
  label: string;
  /** Dipanggil sekali setelah panggung siap. Kembalikan fungsi pembersih untuk benda yang dibuat. */
  onReady: (stage: Stage) => void | (() => void);
  view?: ViewPreset;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  const [failed, setFailed] = useState(false);
  const [spin, setSpin] = useState(false);
  const [current, setCurrent] = useState<ViewPreset>(view);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let stage: Stage;
    try {
      stage = new Stage(host);
    } catch {
      setFailed(true);
      return;
    }
    stageRef.current = stage;
    stage.setView(view);
    const cleanup = readyRef.current(stage);
    return () => {
      cleanup?.();
      stage.dispose();
      stageRef.current = null;
    };
    // Panggung dibuat sekali; perubahan lain ditangani lewat ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    stageRef.current?.setLabel(label);
  }, [label]);

  if (failed) {
    return (
      <div className="mt-boardbox mt-3d">
        <p className="mt-3d__fail" role="alert">
          Peragaan 3D tidak dapat ditampilkan di perangkat ini karena WebGL tidak tersedia. Coba peramban lain atau perbarui peramban kamu.
        </p>
      </div>
    );
  }

  const pick = (id: ViewPreset) => {
    setCurrent(id);
    stageRef.current?.setView(id);
  };

  return (
    <div className="mt-boardbox mt-3d">
      <div ref={hostRef} className="mt-3d__canvas" />
      <div className="mt-3d__bar" role="group" aria-label="Sudut pandang">
        <span className="mt-3d__views">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" className={`mt-3d__btn${current === v.id ? " is-on" : ""}`} aria-pressed={current === v.id} onClick={() => pick(v.id)}>
              {v.label}
            </button>
          ))}
        </span>
        <span className="mt-3d__tools">
          <button type="button" className="mt-3d__btn" aria-label="Perkecil" onClick={() => stageRef.current?.zoomBy(1 / 1.2)}>
            −
          </button>
          <button type="button" className="mt-3d__btn" aria-label="Perbesar" onClick={() => stageRef.current?.zoomBy(1.2)}>
            +
          </button>
          <button
            type="button"
            className={`mt-3d__btn${spin ? " is-on" : ""}`}
            aria-pressed={spin}
            onClick={() => {
              setSpin(!spin);
              stageRef.current?.setAutoRotate(!spin);
            }}
          >
            Putar
          </button>
        </span>
      </div>
      <p className="mt-3d__tip" aria-hidden="true">
        Geser mendatar untuk memutar
      </p>
    </div>
  );
}
