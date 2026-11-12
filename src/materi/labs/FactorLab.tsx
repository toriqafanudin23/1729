import { useEffect, useRef, useState } from "react";
import { useJsxBoard, type SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { addFunction, addGridAxes, addMarker, addVerticalLine, COLORS } from "./jxg";
import { LabBoard, LabFrame, LabSlider, Readout } from "./LabKit";
import { factorTex, quadTex, tex } from "./format";

/* f(x) = (x − p)(x − q) = x² − (p + q)x + pq */

const INIT = { p: 2, q: -3 };

export function FactorLab() {
  const [s, setS] = useState(INIT);
  const ref = useRef(s);
  ref.current = s;

  const setup = (board: SimBoard) => {
    const f = (x: number) => (x - ref.current.p) * (x - ref.current.q);
    addGridAxes(board);
    addVerticalLine(board, () => (ref.current.p + ref.current.q) / 2, { color: COLORS.b });
    addFunction(board, f);
    addMarker(board, () => ref.current.p, () => 0, { color: COLORS.root, size: 6 });
    addMarker(board, () => ref.current.q, () => (ref.current.q === ref.current.p ? NaN : 0), { color: COLORS.root, size: 6 });
  };

  const { boardProps, boardRef } = useJsxBoard({ boundingBox: [-8, 10, 8, -10], setup, zoomRange: [1, 1], embedded: true });
  useEffect(() => {
    boardRef.current?.update();
  }, [s, boardRef]);

  const b = -(s.p + s.q);
  const c = s.p * s.q;

  return (
    <LabFrame
      title="Simulasi 3.1 · Faktor dan akar"
      hint="Geser p dan q. Titik merah di sumbu x adalah akar-akar; bandingkan b dan c dengan p + q dan p × q."
      onReset={() => setS(INIT)}
      stage={<LabBoard boardProps={boardProps} label="Grafik fungsi kuadrat bentuk faktor dengan dua akar" />}
      controls={
        <>
          <LabSlider symbol="p" name="akar pertama p" value={s.p} min={-5} max={5} step={1} color={COLORS.root} onChange={(p) => setS((v) => ({ ...v, p }))} />
          <LabSlider symbol="q" name="akar kedua q" value={s.q} min={-5} max={5} step={1} color={COLORS.vertex} onChange={(q) => setS((v) => ({ ...v, q }))} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Bentuk faktor", tex: `f(x)=${factorTex(s.p)}${factorTex(s.q)}`, wide: true },
            { label: "Bentuk umum", tex: `f(x)=${quadTex(1, b, c)}`, wide: true },
            { label: "Jumlah akar", tex: `p+q=${tex(s.p + s.q)}` },
            { label: "Hasil kali akar", tex: `p\\cdot q=${tex(c)}` },
            { label: "Koefisien b dan c", tex: `b=${tex(b)},\\ c=${tex(c)}`, wide: true },
          ]}
        />
      }
    />
  );
}
