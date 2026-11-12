import type { SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { num } from "./format";

/* Pembantu JSXGraph untuk simulasi di dalam materi. Gaya dan warna mengikuti
   simulasi Fungsi Kuadrat (QuadraticSimulation) supaya terasa satu keluarga. */

export type Settable = { setAttribute: (attributes: Record<string, unknown>) => unknown };

export const COLORS = {
  a: "#7a76a8",
  b: "#c6613f",
  c: "#5f7a45",
  curve: "#4a7aa8",
  reference: "#8f8d85",
  vertex: "#c28a00",
  root: "#a8392f",
  grid: "#dedcd1",
  axis: "#4d4c48",
  accent: "#c6613f",
  ok: "#4f7a3a",
  muted: "#73726c",
} as const;

const finite = (n: number) => Number.isFinite(n);

/** Kisi dan dua sumbu bernama. */
export function addGridAxes(board: SimBoard, names: { x?: string; y?: string } = {}) {
  board.create("grid", [], { strokeColor: COLORS.grid, strokeOpacity: 1, strokeWidth: 1, highlight: false });
  const axisStyle = { strokeColor: COLORS.axis, strokeWidth: 1.2, highlight: false, withLabel: true };
  const ticks = {
    insertTicks: true,
    minTicksDistance: 32,
    minorTicks: 1,
    majorHeight: 6,
    drawLabels: true,
    label: { fontSize: 10, strokeColor: "#5e5d59" },
  };
  board.create(
    "axis",
    [
      [0, 0],
      [1, 0],
    ],
    { ...axisStyle, name: names.x ?? "x", label: { position: "rt", offset: [-14, 14], fontSize: 13 }, ticks },
  );
  board.create(
    "axis",
    [
      [0, 0],
      [0, 1],
    ],
    { ...axisStyle, name: names.y ?? "y", label: { position: "rt", offset: [12, -14], fontSize: 13 }, ticks },
  );
}

type CurveStyle = { color?: string; width?: number; dash?: number; visible?: boolean; domain?: [number, number] };

export function addFunction(board: SimBoard, f: (x: number) => number, style: CurveStyle = {}): Settable {
  const parents: unknown[] = style.domain ? [f, style.domain[0], style.domain[1]] : [f];
  return board.create("functiongraph", parents, {
    strokeColor: style.color ?? COLORS.curve,
    strokeWidth: style.width ?? 3,
    dash: style.dash ?? 0,
    visible: style.visible ?? true,
    highlight: false,
    fixed: true,
  }) as unknown as Settable;
}

/** Garis tegak x = konstan (fungsi, sehingga ikut bergerak). */
export function addVerticalLine(board: SimBoard, x: () => number, style: { color?: string; width?: number; dash?: number; visible?: boolean } = {}): Settable {
  return board.create(
    "line",
    [
      [() => x(), 0],
      [() => x(), 1],
    ],
    {
      straightFirst: true,
      straightLast: true,
      strokeColor: style.color ?? COLORS.b,
      strokeWidth: style.width ?? 1.4,
      dash: style.dash ?? 2,
      visible: style.visible ?? true,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    },
  ) as unknown as Settable;
}

/** Ruas garis antara dua titik yang dihitung ulang tiap pembaruan. */
export function addSegment(
  board: SimBoard,
  from: () => [number, number],
  to: () => [number, number],
  style: { color?: string; width?: number; dash?: number; visible?: boolean } = {},
): Settable {
  return board.create(
    "segment",
    [
      [() => from()[0], () => from()[1]],
      [() => to()[0], () => to()[1]],
    ],
    {
      strokeColor: style.color ?? COLORS.muted,
      strokeWidth: style.width ?? 1.4,
      dash: style.dash ?? 2,
      visible: style.visible ?? true,
      highlight: false,
      fixed: true,
      point1: { visible: false },
      point2: { visible: false },
    },
  ) as unknown as Settable;
}

export interface Marker {
  point: Settable;
  label: Settable;
  /** Tampilkan atau sembunyikan titik beserta labelnya. */
  show: (visible: boolean) => void;
}

/** Titik bertanda warna dengan label koordinat. Bila x atau y tidak terhingga, titik hilang. */
export function addMarker(
  board: SimBoard,
  x: () => number,
  y: () => number,
  opts: { color: string; size?: number; label?: (x: number, y: number) => string; hollow?: boolean; visible?: boolean },
): Marker {
  const point = board.create("point", [x, y], {
    name: "",
    withLabel: false,
    size: opts.size ?? 5,
    fillColor: opts.hollow ? "#ffffff" : opts.color,
    strokeColor: opts.hollow ? opts.color : "#ffffff",
    strokeWidth: opts.hollow ? 2 : 1.5,
    fixed: true,
    highlight: false,
    showInfobox: false,
    visible: opts.visible ?? true,
  }) as unknown as Settable;

  const label = board.create(
    "text",
    [
      () => (finite(x()) ? x() + 8 / board.unitX : 0),
      () => (finite(y()) ? y() + 6 / board.unitY : 0),
      () => (finite(x()) && finite(y()) ? (opts.label ? opts.label(x(), y()) : `(${num(x())}, ${num(y())})`) : ""),
    ],
    {
      anchorX: "left",
      anchorY: "bottom",
      fontSize: 12,
      strokeColor: opts.color,
      highlight: false,
      fixed: true,
      visible: opts.visible ?? true,
      cssStyle: "font-weight:600;white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;",
    },
  ) as unknown as Settable;

  return {
    point,
    label,
    show(visible: boolean) {
      point.setAttribute({ visible });
      label.setAttribute({ visible });
    },
  };
}
