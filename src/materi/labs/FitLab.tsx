import { useEffect, useRef, useState } from "react";
import { useJsxBoard, type BoundingBox, type SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { addFunction, addGridAxes, addMarker, COLORS, type Marker } from "./jxg";
import { LabBoard, LabFrame, LabSlider, Readout, type ReadoutItem } from "./LabKit";
import { factorTex, quadTex, tex, vertexTex } from "./format";
import type { ParabolaState } from "./ParabolaExplorer";

/* Mencocokkan parabola dengan informasi yang diketahui.
     faktor : dua akar (p, q) + satu titik → atur a
     puncak : titik puncak (p, q) + satu titik → atur a
     bebas  : tiga titik → atur a, b, c */

export type FitMode =
  | { kind: "faktor"; p: number; q: number; point: [number, number] }
  | { kind: "puncak"; p: number; q: number; point: [number, number] }
  | { kind: "bebas"; points: [number, number][] };

const NAMES = ["A", "B", "C", "D"];

function coefficients(mode: FitMode, s: ParabolaState): ParabolaState {
  if (mode.kind === "faktor") return { a: s.a, b: -s.a * (mode.p + mode.q), c: s.a * mode.p * mode.q };
  if (mode.kind === "puncak") return { a: s.a, b: -2 * s.a * mode.p, c: s.a * mode.p * mode.p + mode.q };
  return s;
}

export function FitLab({
  title,
  hint,
  mode,
  box = [-4, 12, 8, -8],
  aRange = [-4, 4, 0.5],
  onChange,
}: {
  title: string;
  hint?: string;
  mode: FitMode;
  box?: BoundingBox;
  aRange?: [number, number, number];
  onChange?: (state: ParabolaState) => void;
}) {
  const init: ParabolaState = { a: 0.5, b: 0, c: 0 };
  const [s, setS] = useState<ParabolaState>(init);
  const k = coefficients(mode, s);
  const kRef = useRef(k);
  kRef.current = k;
  const cbRef = useRef(onChange);
  cbRef.current = onChange;
  const modeRef = useRef(mode);
  const dots = useRef<Marker[]>([]);

  const targets: [number, number][] = mode.kind === "bebas" ? mode.points : [mode.point];
  const hit = (pt: [number, number], c: ParabolaState) => Math.abs(c.a * pt[0] * pt[0] + c.b * pt[0] + c.c - pt[1]) < 1e-9;

  const setup = (board: SimBoard) => {
    const m = modeRef.current;
    addGridAxes(board);
    addFunction(board, (x) => kRef.current.a * x * x + kRef.current.b * x + kRef.current.c);
    if (m.kind === "faktor") {
      addMarker(board, () => m.p, () => 0, { color: COLORS.root, size: 6 });
      addMarker(board, () => m.q, () => 0, { color: COLORS.root, size: 6 });
    }
    if (m.kind === "puncak") addMarker(board, () => m.p, () => m.q, { color: COLORS.vertex, size: 6 });
    const pts: [number, number][] = m.kind === "bebas" ? m.points : [m.point];
    dots.current = pts.map((pt, i) =>
      addMarker(board, () => pt[0], () => pt[1], {
        color: COLORS.muted,
        size: 6,
        hollow: true,
        label: (x, y) => `${m.kind === "bebas" ? NAMES[i] : "T"}(${tex(x).replace("{,}", ",")}, ${tex(y).replace("{,}", ",")})`,
      }),
    );
  };

  const { boardProps, boardRef } = useJsxBoard({ boundingBox: box, setup, zoomRange: [1, 1], embedded: true, keepAspectRatio: false });

  useEffect(() => {
    dots.current.forEach((d, i) => {
      const ok = hit(targets[i], kRef.current);
      d.point.setAttribute({ fillColor: ok ? COLORS.ok : "#ffffff", strokeColor: ok ? "#ffffff" : COLORS.muted });
      d.label.setAttribute({ strokeColor: ok ? COLORS.ok : COLORS.muted });
    });
    boardRef.current?.update();
    cbRef.current?.(kRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, boardRef]);

  const items: ReadoutItem[] = [];
  if (mode.kind === "faktor") items.push({ label: "Bentuk faktor", tex: `f(x)=${s.a === 1 ? "" : s.a === -1 ? "-" : tex(s.a)}${factorTex(mode.p)}${factorTex(mode.q)}`, wide: true });
  if (mode.kind === "puncak") items.push({ label: "Bentuk puncak", tex: `f(x)=${vertexTex(s.a, mode.p, mode.q)}`, wide: true });
  items.push({ label: "Bentuk umum", tex: `f(x)=${quadTex(k.a, k.b, k.c)}`, wide: true });
  targets.forEach((pt, i) => {
    const value = k.a * pt[0] * pt[0] + k.b * pt[0] + k.c;
    const name = mode.kind === "bebas" ? NAMES[i] : "T";
    items.push({ label: `Di titik ${name}`, tex: `f(${tex(pt[0])})=${tex(value)}\\ ${hit(pt, k) ? "\\checkmark" : `\\ne ${tex(pt[1])}`}`, wide: mode.kind === "bebas" });
  });

  const slider = (key: keyof ParabolaState, color: string, range: [number, number, number]) => (
    <LabSlider key={key} symbol={key} name={`koefisien ${key}`} value={s[key]} min={range[0]} max={range[1]} step={range[2]} color={color} onChange={(v) => setS((x) => ({ ...x, [key]: v }))} />
  );

  return (
    <LabFrame
      title={title}
      hint={hint}
      onReset={() => setS(init)}
      stage={<LabBoard boardProps={boardProps} label="Grafik parabola yang dicocokkan dengan titik-titik yang diketahui" />}
      controls={mode.kind === "bebas" ? [slider("a", COLORS.a, [-4, 4, 0.5]), slider("b", COLORS.b, [-8, 8, 1]), slider("c", COLORS.c, [-8, 8, 1])] : slider("a", COLORS.a, aRange)}
      readout={<Readout items={items} />}
    />
  );
}
