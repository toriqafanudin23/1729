import { useEffect, useRef, useState } from "react";
import { useJsxBoard, type SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { addFunction, addGridAxes, addMarker, addSegment, COLORS, type Marker } from "./jxg";
import { LabBoard, LabFrame, LabSlider, Readout } from "./LabKit";
import { num, tex } from "./format";

/* Kandang bersandar pada tembok: pagar 40 m, lebar x, panjang 40 − 2x, luas L(x) = x(40 − 2x). */

const L = (x: number) => x * (40 - 2 * x);

export function OptimizeLab() {
  const [x, setX] = useState(5);
  const [peak, setPeak] = useState(false);
  const xRef = useRef(x);
  xRef.current = x;
  const peakMarker = useRef<Marker | null>(null);

  const setup = (board: SimBoard) => {
    addGridAxes(board, { x: "x", y: "L" });
    addFunction(board, L, { domain: [0, 20] });
    addSegment(board, () => [xRef.current, 0], () => [xRef.current, L(xRef.current)], { color: COLORS.muted });
    addSegment(board, () => [0, L(xRef.current)], () => [xRef.current, L(xRef.current)], { color: COLORS.muted });
    addMarker(board, () => xRef.current, () => L(xRef.current), { color: COLORS.accent, size: 7, label: (a, b) => `(${num(a)}; ${num(b)})` });
    peakMarker.current = addMarker(board, () => 10, () => 200, { color: COLORS.vertex, size: 6, visible: false, label: () => "puncak" });
  };

  const { boardProps, boardRef } = useJsxBoard({ boundingBox: [-3, 240, 23, -40], setup, zoomRange: [1, 1], keepAspectRatio: false, embedded: true });

  useEffect(() => {
    boardRef.current?.update();
  }, [x, boardRef]);
  useEffect(() => {
    peakMarker.current?.show(peak);
    boardRef.current?.update();
  }, [peak, boardRef]);

  const length = 40 - 2 * x;
  // Gambar kandang: tembok di atas, pagar di tiga sisi lainnya.
  const W = 150;
  const H = 110;
  const rw = (x / 20) * 60 + 4;
  const rh = (length / 40) * 80 + 4;

  return (
    <LabFrame
      title="Simulasi 7.1 · Kandang dengan pagar 40 m"
      hint="Geser lebar kandang. Perhatikan luasnya naik, mencapai suatu nilai terbesar, lalu turun lagi."
      onReset={() => {
        setX(5);
        setPeak(false);
      }}
      stage={<LabBoard boardProps={boardProps} label="Grafik luas kandang terhadap lebar kandang, berbentuk parabola membuka ke bawah" />}
      controls={
        <>
          <svg className="mt-pen" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Kandang lebar ${num(x)} meter dan panjang ${num(length)} meter`}>
            <rect x="10" y="8" width={W - 20} height="8" fill="#d6d4c9" />
            <text x={W / 2} y="14.5" fontSize="7" textAnchor="middle" fill="#5e5d59">
              tembok
            </text>
            <rect x={W / 2 - (rh * 1.2) / 2} y="16" width={rh * 1.2} height={rw * 1.2} fill="#fbeee8" stroke={COLORS.accent} strokeWidth="2.5" />
            <line x1={W / 2 - (rh * 1.2) / 2} x2={W / 2 + (rh * 1.2) / 2} y1="16" y2="16" stroke="#d6d4c9" strokeWidth="3" />
            <text x={W / 2} y={16 + rw * 0.6 + 3} fontSize="8" textAnchor="middle" fill="#7a3f27" fontWeight="600">
              {num(L(x))} m²
            </text>
          </svg>
          <LabSlider symbol="x" name="lebar kandang dalam meter" value={x} min={0} max={20} step={0.5} color={COLORS.accent} onChange={setX} />
          <label className="mt-check">
            <input type="checkbox" checked={peak} onChange={(e) => setPeak(e.target.checked)} /> Tampilkan titik puncak
          </label>
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Model luas", tex: "L(x)=x(40-2x)=-2x^{2}+40x", wide: true },
            { label: "Lebar", tex: `x=${tex(x)}\\ \\text{m}` },
            { label: "Panjang", tex: `40-2x=${tex(length)}\\ \\text{m}` },
            { label: "Luas", tex: `L=${tex(L(x))}\\ \\text{m}^{2}`, wide: true },
          ]}
        />
      }
    />
  );
}
