import { useEffect, useRef, useState } from "react";
import { useJsxBoard, type BoundingBox, type SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { addFunction, addGridAxes, addMarker, addVerticalLine, COLORS, type Marker, type Settable } from "./jxg";
import { LabBoard, LabFrame, LabSlider, Readout, type ReadoutItem } from "./LabKit";
import { quadTex, tex } from "./format";

/* Simulasi serbaguna f(x) = ax² + bx + c. Setiap bab memilih slider, unsur grafik,
   dan keterangan yang ingin ditampilkan. */

export interface ParabolaState {
  a: number;
  b: number;
  c: number;
}

export type Feature = "reference" | "axis" | "vertex" | "roots" | "yIntercept";
export type ReadoutKey = "arah" | "lebar" | "titikY" | "sumbu" | "puncak" | "diskriminan" | "akar";
type Range = [min: number, max: number, step: number];

const DEFAULT_RANGES: Record<keyof ParabolaState, Range> = { a: [-4, 4, 0.5], b: [-8, 8, 1], c: [-8, 8, 1] };
const DEFAULT_BOX: BoundingBox = [-7, 7, 7, -7];

export function analyse({ a, b, c }: ParabolaState) {
  const quadratic = a !== 0;
  const d = b * b - 4 * a * c;
  const xp = quadratic ? -b / (2 * a) : NaN;
  const yp = quadratic ? a * xp * xp + b * xp + c : NaN;
  const sq = quadratic && d >= 0 ? Math.sqrt(d) : NaN;
  const roots = quadratic && d >= 0 ? [(-b - sq) / (2 * a), (-b + sq) / (2 * a)].sort((m, n) => m - n) : [];
  return { quadratic, d, xp, yp, roots };
}

export function ParabolaExplorer({
  title,
  hint,
  init,
  controls,
  features = [],
  readouts = [],
  ranges,
  box = DEFAULT_BOX,
  onChange,
}: {
  title: string;
  hint?: string;
  init: ParabolaState;
  controls: (keyof ParabolaState)[];
  features?: Feature[];
  readouts?: ReadoutKey[];
  ranges?: Partial<Record<keyof ParabolaState, Range>>;
  box?: BoundingBox;
  onChange?: (state: ParabolaState) => void;
}) {
  const [state, setState] = useState<ParabolaState>(init);
  const stateRef = useRef(state);
  stateRef.current = state;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const featRef = useRef(features);
  const markers = useRef<{ vertex?: Marker; roots?: Marker[]; yint?: Marker; axis?: Settable }>({});

  const setup = (board: SimBoard) => {
    const p = () => stateRef.current;
    const f = (x: number) => p().a * x * x + p().b * x + p().c;
    const has = (k: Feature) => featRef.current.includes(k);
    addGridAxes(board);
    if (has("reference")) addFunction(board, (x) => x * x, { color: COLORS.reference, width: 1.5, dash: 3 });
    if (has("axis")) markers.current.axis = addVerticalLine(board, () => analyse(p()).xp);
    addFunction(board, f);
    if (has("yIntercept")) markers.current.yint = addMarker(board, () => 0, () => p().c, { color: COLORS.c, size: 5 });
    if (has("roots")) {
      const root = (i: 0 | 1) => () => {
        const { roots } = analyse(p());
        if (roots.length === 0) return NaN;
        if (roots.length === 2 && roots[0] === roots[1] && i === 1) return NaN;
        return roots[i];
      };
      markers.current.roots = [0, 1].map((i) => addMarker(board, root(i as 0 | 1), () => (Number.isFinite(root(i as 0 | 1)()) ? 0 : NaN), { color: COLORS.root, size: 5 }));
    }
    if (has("vertex")) markers.current.vertex = addMarker(board, () => analyse(p()).xp, () => analyse(p()).yp, { color: COLORS.vertex, size: 6 });
  };

  const { boardProps, boardRef } = useJsxBoard({ boundingBox: box, setup, zoomRange: [1, 1], embedded: true });

  useEffect(() => {
    boardRef.current?.update();
    onChangeRef.current?.(state);
  }, [state, boardRef]);

  const [ar, br, cr] = [ranges?.a ?? DEFAULT_RANGES.a, ranges?.b ?? DEFAULT_RANGES.b, ranges?.c ?? DEFAULT_RANGES.c];
  const rangeOf = { a: ar, b: br, c: cr };
  const colorOf = { a: COLORS.a, b: COLORS.b, c: COLORS.c };

  const { a, b, c } = state;
  const info = analyse(state);
  const items: ReadoutItem[] = [{ label: "Fungsi", tex: `f(x)=${quadTex(a, b, c)}`, wide: true }];
  for (const key of readouts) {
    if (key === "arah") items.push({ label: "Arah buka", tex: !info.quadratic ? "\\text{bukan fungsi kuadrat}" : a > 0 ? "\\text{ke atas}" : "\\text{ke bawah}" });
    if (key === "lebar") items.push({ label: "Dibanding y = x²", tex: !info.quadratic ? "\\text{—}" : Math.abs(a) > 1 ? "\\text{lebih sempit}" : Math.abs(a) < 1 ? "\\text{lebih lebar}" : "\\text{sama}" });
    if (key === "titikY") items.push({ label: "Titik potong sumbu y", tex: `(0,\\,${tex(c)})` });
    if (key === "sumbu") items.push({ label: "Sumbu simetri", tex: info.quadratic ? `x=${tex(info.xp)}` : "\\text{—}" });
    if (key === "puncak") items.push({ label: "Titik puncak", tex: info.quadratic ? `(${tex(info.xp)},\\,${tex(info.yp)})` : "\\text{—}" });
    if (key === "diskriminan") items.push({ label: "Diskriminan D = b² − 4ac", tex: `D=${tex(b)}^2-4(${tex(a)})(${tex(c)})=${tex(info.d)}`, wide: true });
    if (key === "akar") {
      let t = "\\text{—}";
      if (info.quadratic) t = info.roots.length === 0 ? "\\text{tidak ada akar real}" : info.roots[0] === info.roots[1] ? `x=${tex(info.roots[0])}` : `x_1=${tex(info.roots[0])},\\ x_2=${tex(info.roots[1])}`;
      items.push({ label: "Akar (titik potong sumbu x)", tex: t, wide: true });
    }
  }

  return (
    <LabFrame
      title={title}
      hint={hint}
      onReset={() => setState(init)}
      stage={<LabBoard boardProps={boardProps} label={`Grafik fungsi kuadrat f(x) = ${quadTex(a, b, c).replace(/[{}\\]/g, "")}`} />}
      controls={controls.map((k) => (
        <LabSlider
          key={k}
          symbol={k}
          name={`koefisien ${k}`}
          value={state[k]}
          min={rangeOf[k][0]}
          max={rangeOf[k][1]}
          step={rangeOf[k][2]}
          color={colorOf[k]}
          onChange={(v) => setState((s) => ({ ...s, [k]: v }))}
        />
      ))}
      readout={<Readout items={items} />}
    />
  );
}
