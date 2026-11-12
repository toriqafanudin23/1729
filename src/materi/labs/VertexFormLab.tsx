import { useEffect, useRef, useState } from "react";
import { useJsxBoard, type SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { addFunction, addGridAxes, addMarker, addVerticalLine, COLORS } from "./jxg";
import { LabBoard, LabFrame, LabSlider, Readout } from "./LabKit";
import { quadTex, tex, vertexTex } from "./format";

/* f(x) = a(x − p)² + q dengan titik puncak (p, q). */

export interface VertexState {
  a: number;
  p: number;
  q: number;
}

const INIT: VertexState = { a: 1, p: 3, q: -4 };

export function VertexFormLab({ onChange }: { onChange?: (state: VertexState) => void }) {
  const [s, setS] = useState<VertexState>(INIT);
  const ref = useRef(s);
  ref.current = s;
  const cbRef = useRef(onChange);
  cbRef.current = onChange;

  const setup = (board: SimBoard) => {
    addGridAxes(board);
    addVerticalLine(board, () => (ref.current.a === 0 ? NaN : ref.current.p), { color: COLORS.b });
    addFunction(board, (x) => ref.current.a * (x - ref.current.p) ** 2 + ref.current.q);
    addMarker(board, () => (ref.current.a === 0 ? NaN : ref.current.p), () => ref.current.q, { color: COLORS.vertex, size: 6 });
  };

  const { boardProps, boardRef } = useJsxBoard({ boundingBox: [-8, 8, 8, -8], setup, zoomRange: [1, 1], embedded: true });
  useEffect(() => {
    boardRef.current?.update();
    cbRef.current?.(s);
  }, [s, boardRef]);

  const { a, p, q } = s;
  const b = -2 * a * p;
  const c = a * p * p + q;

  return (
    <LabFrame
      title="Simulasi 4.1 · Bentuk puncak"
      hint="Geser p dan q: titik puncak ikut bergerak. Perhatikan b dan c pada bentuk umum yang berubah otomatis."
      onReset={() => setS(INIT)}
      stage={<LabBoard boardProps={boardProps} label="Grafik fungsi kuadrat dalam bentuk puncak dengan titik puncak bertanda" />}
      controls={
        <>
          <LabSlider symbol="a" name="koefisien a" value={a} min={-3} max={3} step={0.5} color={COLORS.a} onChange={(v) => setS((x) => ({ ...x, a: v }))} />
          <LabSlider symbol="p" name="absis puncak p" value={p} min={-6} max={6} step={1} color={COLORS.b} onChange={(v) => setS((x) => ({ ...x, p: v }))} />
          <LabSlider symbol="q" name="ordinat puncak q" value={q} min={-6} max={6} step={1} color={COLORS.vertex} onChange={(v) => setS((x) => ({ ...x, q: v }))} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Bentuk puncak", tex: a === 0 ? "\\text{a = 0: bukan fungsi kuadrat}" : `f(x)=${vertexTex(a, p, q)}`, wide: true },
            { label: "Bentuk umum", tex: `f(x)=${quadTex(a, b, c)}`, wide: true },
            { label: "Titik puncak", tex: `(${tex(p)},\\,${tex(q)})` },
            { label: "Nilai ekstrem", tex: a === 0 ? "\\text{—}" : a > 0 ? `\\text{minimum }${tex(q)}` : `\\text{maksimum }${tex(q)}` },
          ]}
        />
      }
    />
  );
}
