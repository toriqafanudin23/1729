import {
  Crosshair,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import JXG from "jsxgraph";
import "../styles/jsxgraph.css";
import "./FunctionTransformationSimulation.css";
import { useStoredSimulationState } from "./useStoredSimulationState";

/* Simulasi transformasi fungsi — tema slate seperti landing page 1729.
   Urutan desain: ponsel lanskap → desktop → ponsel potret. Layar penuh:
   grafik 100% layar, toolbar dan panel pengatur mengambang.

   Grafik hasil:  g(x) = a · f(b(x − h)) + k
   - h : geser mendatar (kanan jika positif)
   - k : geser tegak (atas jika positif)
   - a : regang tegak, a < 0 mencerminkan terhadap garis y = k
   - b : regang mendatar (lebar menjadi 1/|b| kali), b < 0 mencerminkan
         terhadap garis x = h

   Titik (x, y) pada f dipetakan ke (h + x/b, a·y + k) pada g.
   Fungsi awal f(x) bisa diketik sendiri (mis. x^2 − 3, sin(x), 1/x). */

/* ───────── Tipe ───────── */

type Vec = [number, number];
type Fn = (x: number) => number;
type Params = { h: number; k: number; a: number; b: number; x0: number };
type Opts = {
  original: boolean;
  key: boolean;
  guide: boolean;
  probe: boolean;
};
type Tab = "set" | "fn" | "res";
type Board = ReturnType<typeof JXG.JSXGraph.initBoard>;
type DataCurve = {
  dataX: number[];
  dataY: number[];
  updateDataArray: () => void;
};
/** Titik uji P yang bisa diseret sepanjang grafik f. */
type DragPoint = {
  X: () => number;
  Y: () => number;
  setPosition: (method: number, coords: number[]) => unknown;
  showElement: () => unknown;
  hideElement: () => unknown;
  on: (event: string, handler: () => void) => unknown;
};
type RowDef = {
  key: keyof Params;
  label: string;
  title: string;
  min: number;
  max: number;
  step: number;
  digits: number;
  tone: string;
  /** a dan b tidak boleh 0: grafik akan menjadi garis datar / tidak terdefinisi */
  nonZero?: boolean;
  /** tampilkan tombol ± (balik tanda = cermin) */
  flip?: boolean;
};

/* ───────── Konstanta ───────── */

/** JXG.COORDS_BY_USER */
const COORDS_BY_USER = 1;
const HOME_BOX: [number, number, number, number] = [-12, 9, 12, -9];
const SAMPLES = 900;
const X0_LIM = 8;

const DEFAULT_EXPRESSION = "x^2";
const DEFAULT_PARAMS: Params = { h: 2, k: 1, a: 2, b: 1, x0: 1 };
const IDENTITY: Params = { h: 0, k: 0, a: 1, b: 1, x0: 0 };
const DEFAULT_OPTS: Opts = {
  original: true,
  key: true,
  guide: true,
  probe: true,
};

/* Warna grafik: dipakai juga oleh legenda, penggeser, dan hasil di panel. */
const color = {
  f: "#2563eb",
  g: "#e11d48",
  shift: "#0d9488",
  stretch: "#7c3aed",
  probe: "#ca8a04",
  guide: "#94a3b8",
  ink: "#0f172a",
};

const KEY_LETTERS = ["A", "B", "C", "D", "E"];
const KEY_CANDIDATES = [-2, -1, 0, 1, 2, 3, 0.5, 4, -3, -0.5, 8];

const SHIFT_ROWS: RowDef[] = [
  {
    key: "h",
    label: "h",
    title: "geser mendatar",
    min: -8,
    max: 8,
    step: 0.5,
    digits: 1,
    tone: color.shift,
  },
  {
    key: "k",
    label: "k",
    title: "geser tegak",
    min: -8,
    max: 8,
    step: 0.5,
    digits: 1,
    tone: color.shift,
  },
];
const STRETCH_ROWS: RowDef[] = [
  {
    key: "a",
    label: "a",
    title: "regang tegak",
    min: -4,
    max: 4,
    step: 0.25,
    digits: 2,
    tone: color.stretch,
    nonZero: true,
    flip: true,
  },
  {
    key: "b",
    label: "b",
    title: "regang mendatar",
    min: -4,
    max: 4,
    step: 0.25,
    digits: 2,
    tone: color.stretch,
    nonZero: true,
    flip: true,
  },
];
const PROBE_ROW: RowDef = {
  key: "x0",
  label: "x₀",
  title: "absis titik uji P",
  min: -X0_LIM,
  max: X0_LIM,
  step: 0.1,
  digits: 1,
  tone: color.probe,
};

const PRESETS: { label: string; expr: string }[] = [
  { label: "x", expr: "x" },
  { label: "x²", expr: "x^2" },
  { label: "x³", expr: "x^3" },
  { label: "|x|", expr: "abs(x)" },
  { label: "√x", expr: "sqrt(x)" },
  { label: "1/x", expr: "1/x" },
  { label: "sin x", expr: "sin(x)" },
  { label: "eˣ", expr: "e^x" },
  { label: "ln x", expr: "ln(x)" },
];

const OPTION_ROWS: { key: keyof Opts; label: string }[] = [
  { key: "original", label: "Grafik f(x)" },
  { key: "key", label: "Titik kunci" },
  { key: "guide", label: "Garis x = h, y = k" },
  { key: "probe", label: "Titik uji P" },
];

const TABS: { key: Tab; label: string }[] = [
  { key: "set", label: "Ubah" },
  { key: "fn", label: "Fungsi" },
  { key: "res", label: "Hasil" },
];

/* ───────── Format ───────── */

function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < Math.pow(10, -digits) / 2) return "0";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digits,
    useGrouping: false,
  })
    .format(value)
    .replace("-", "−");
}

const fmtPt = ([x, y]: Vec) => `(${fmt(x)}; ${fmt(y)})`;

/** Parameter dari penyimpanan: angka terhingga, a dan b tidak nol. */
function cleanParams(raw: Partial<Params> | undefined): Params {
  const num = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback;
  const nonZero = (v: unknown, fallback: number) => {
    const n = num(v, fallback);
    return Math.abs(n) < 1e-9 ? fallback : n;
  };
  return {
    h: num(raw?.h, DEFAULT_PARAMS.h),
    k: num(raw?.k, DEFAULT_PARAMS.k),
    a: nonZero(raw?.a, DEFAULT_PARAMS.a),
    b: nonZero(raw?.b, DEFAULT_PARAMS.b),
    x0: num(raw?.x0, DEFAULT_PARAMS.x0),
  };
}

/* ───────── Pengurai rumus (tanpa eval) ───────── */

type Node =
  | { t: "num"; v: number }
  | { t: "x" }
  | { t: "const"; name: "e" | "pi" }
  | { t: "neg"; a: Node }
  | { t: "bin"; op: "+" | "-" | "*" | "/" | "^"; l: Node; r: Node }
  | { t: "call"; name: string; a: Node };

const FUNCS: Record<string, Fn> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sqrt: (u) => (u >= 0 ? Math.sqrt(u) : Number.NaN),
  abs: Math.abs,
  ln: (u) => (u > 0 ? Math.log(u) : Number.NaN),
  log: (u) => (u > 0 ? Math.log10(u) : Number.NaN),
  exp: Math.exp,
};
const NAMES = [...Object.keys(FUNCS), "pi"];

type Tok =
  | { k: "num"; v: number }
  | { k: "id"; v: string }
  | { k: "op"; v: string };

function tokenize(src: string): Tok[] | null {
  const s = src
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/[×·∙]/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/ˣ/g, "^x")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/,/g, ".")
    .replace(/\s+/g, "");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j += 1;
      const text = s.slice(i, j);
      if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) return null;
      out.push({ k: "num", v: Number(text) });
      i = j;
    } else if (/[a-z]/.test(c)) {
      const name = NAMES.find((n) => s.startsWith(n, i));
      if (name) {
        out.push({ k: "id", v: name });
        i += name.length;
      } else if (c === "x" || c === "e") {
        out.push({ k: "id", v: c });
        i += 1;
      } else {
        return null;
      }
    } else if ("+-*/^()".includes(c)) {
      out.push({ k: "op", v: c });
      i += 1;
    } else {
      return null;
    }
  }
  return out;
}

class ParseError extends Error {}

const SYNTAX_HINT = "Contoh: x^2 − 3, sin(x), 1/x, sqrt(x), abs(x), e^x, ln(x).";

function parseExpression(src: string): { node: Node } | { error: string } {
  const tokens = tokenize(src);
  if (!tokens || tokens.length === 0) {
    return { error: `Tulis fungsi dalam x. ${SYNTAX_HINT}` };
  }
  let pos = 0;
  const peek = () => tokens[pos];
  const isOp = (v: string) => {
    const tk = peek();
    return tk !== undefined && tk.k === "op" && tk.v === v;
  };
  // perkalian tersirat: 2x, x(x + 1), sin(x)cos(x); angka tidak ikut (x2 ditolak)
  const startsImplicit = () => {
    const tk = peek();
    return tk !== undefined && (tk.k === "id" || (tk.k === "op" && tk.v === "("));
  };

  const expr = (): Node => {
    let left = term();
    while (isOp("+") || isOp("-")) {
      const op = isOp("+") ? "+" : "-";
      pos += 1;
      left = { t: "bin", op, l: left, r: term() };
    }
    return left;
  };
  const term = (): Node => {
    let left = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const op = isOp("*") ? "*" : "/";
        pos += 1;
        left = { t: "bin", op, l: left, r: unary() };
      } else if (startsImplicit()) {
        left = { t: "bin", op: "*", l: left, r: unary() };
      } else {
        return left;
      }
    }
  };
  const unary = (): Node => {
    if (isOp("-")) {
      pos += 1;
      return { t: "neg", a: unary() };
    }
    if (isOp("+")) {
      pos += 1;
      return unary();
    }
    return power();
  };
  const power = (): Node => {
    const base = atom();
    if (isOp("^")) {
      pos += 1;
      return { t: "bin", op: "^", l: base, r: unary() };
    }
    return base;
  };
  const atom = (): Node => {
    const tk = peek();
    if (!tk) throw new ParseError("Ekspresi belum lengkap.");
    if (tk.k === "num") {
      pos += 1;
      return { t: "num", v: tk.v };
    }
    if (tk.k === "op" && tk.v === "(") {
      pos += 1;
      const inner = expr();
      if (!isOp(")")) throw new ParseError("Tanda kurung belum ditutup.");
      pos += 1;
      return inner;
    }
    if (tk.k === "id") {
      pos += 1;
      if (tk.v === "x") return { t: "x" };
      if (tk.v === "e" || tk.v === "pi") {
        return { t: "const", name: tk.v === "e" ? "e" : "pi" };
      }
      // sin(x) atau sin x^2 (tanpa kurung: argumennya satu pangkat)
      const arg = isOp("(") ? atom() : power();
      return { t: "call", name: tk.v, a: arg };
    }
    throw new ParseError("Ada tanda yang tidak dikenali.");
  };

  try {
    const node = expr();
    if (pos < tokens.length) {
      throw new ParseError("Ada bagian yang tidak dikenali.");
    }
    return { node };
  } catch (error) {
    return {
      error:
        error instanceof ParseError
          ? `${error.message} ${SYNTAX_HINT}`
          : "Ekspresi tidak dapat dibaca.",
    };
  }
}

/** Pangkat; akar ganjil bilangan negatif tetap terdefinisi (mis. x^(1/3)). */
function pow(base: number, exponent: number) {
  if (base < 0 && Number.isFinite(exponent) && !Number.isInteger(exponent)) {
    const inverse = 1 / exponent;
    if (Number.isInteger(inverse) && Math.abs(inverse % 2) === 1) {
      return -Math.pow(-base, exponent);
    }
  }
  return Math.pow(base, exponent);
}

function compileNode(node: Node): Fn {
  switch (node.t) {
    case "num": {
      const v = node.v;
      return () => v;
    }
    case "x":
      return (x) => x;
    case "const": {
      const v = node.name === "e" ? Math.E : Math.PI;
      return () => v;
    }
    case "neg": {
      const inner = compileNode(node.a);
      return (x) => -inner(x);
    }
    case "call": {
      const inner = compileNode(node.a);
      const f = FUNCS[node.name];
      return (x) => f(inner(x));
    }
    case "bin": {
      const l = compileNode(node.l);
      const r = compileNode(node.r);
      switch (node.op) {
        case "+":
          return (x) => l(x) + r(x);
        case "-":
          return (x) => l(x) - r(x);
        case "*":
          return (x) => l(x) * r(x);
        case "/":
          return (x) => l(x) / r(x);
        default:
          return (x) => pow(l(x), r(x));
      }
    }
  }
}

const DEFAULT_NODE = (
  parseExpression(DEFAULT_EXPRESSION) as { node: Node }
).node;

/* ───────── Teks rumus ───────── */

/** Potongan teks beserta tingkat ikatannya:
    1 jumlah · 2 perkalian · 3 minus depan · 4 pangkat · 5 atom. */
type Piece = { s: string; p: number };

const wrap = (piece: Piece, min: number) =>
  piece.p >= min ? piece.s : `(${piece.s})`;
const isSimple = (text: string) => /^[\wπ,]+$/.test(text);

function renderNode(node: Node, arg: Piece): Piece {
  switch (node.t) {
    case "num":
      return { s: fmt(node.v, 3), p: 5 };
    case "x":
      return arg;
    case "const":
      return { s: node.name === "e" ? "e" : "π", p: 5 };
    case "neg":
      return { s: `−${wrap(renderNode(node.a, arg), 4)}`, p: 3 };
    case "call": {
      const inner = renderNode(node.a, arg);
      if (node.name === "abs") return { s: `|${inner.s}|`, p: 5 };
      if (node.name === "sqrt") {
        return {
          s: isSimple(inner.s) ? `√${inner.s}` : `√(${inner.s})`,
          p: 5,
        };
      }
      return { s: `${node.name}(${inner.s})`, p: 5 };
    }
    case "bin": {
      const l = renderNode(node.l, arg);
      const r = renderNode(node.r, arg);
      switch (node.op) {
        case "+":
          if (node.r.t === "neg") {
            const inner = renderNode(node.r.a, arg);
            return { s: `${l.s} − ${wrap(inner, 2)}`, p: 1 };
          }
          return { s: `${l.s} + ${r.s}`, p: 1 };
        case "-":
          return {
            s: `${l.s} − ${node.r.t === "neg" ? `(${r.s})` : wrap(r, 2)}`,
            p: 1,
          };
        case "*": {
          const left = wrap(l, 2);
          const right = node.r.t === "neg" ? `(${r.s})` : wrap(r, 2);
          // 2x, 3sin(x), 2(x − 1) tanpa titik; selain itu pakai ·
          const joined =
            node.l.t === "num" && /^[A-Za-zπ(√|]/.test(right)
              ? `${left}${right}`
              : `${left} · ${right}`;
          return { s: joined, p: 2 };
        }
        case "/":
          return { s: `${wrap(l, 2)} / ${wrap(r, 4)}`, p: 2 };
        default: {
          const base = wrap(l, 5);
          if (node.r.t === "num" && (node.r.v === 2 || node.r.v === 3)) {
            return { s: `${base}${node.r.v === 2 ? "²" : "³"}`, p: 4 };
          }
          const exponent = r.p >= 5 && isSimple(r.s) ? r.s : `(${r.s})`;
          return { s: `${base}^${exponent}`, p: 4 };
        }
      }
    }
  }
}

/** Argumen b(x − h) sebagai teks. */
function argPiece(h: number, b: number): Piece {
  const inner =
    h === 0 ? "x" : `x ${h > 0 ? "−" : "+"} ${fmt(Math.abs(h))}`;
  if (b === 1) return { s: inner, p: h === 0 ? 5 : 1 };
  if (b === -1) {
    return h === 0 ? { s: "−x", p: 3 } : { s: `−(${inner})`, p: 3 };
  }
  const coef = fmt(b);
  return h === 0
    ? { s: `${coef}x`, p: 2 }
    : { s: `${coef}(${inner})`, p: 2 };
}

/** Ruas kanan g(x) = a · f(b(x − h)) + k. */
function transformedText(root: Node, p: Params) {
  const body = renderNode(root, argPiece(p.h, p.b));
  let main: string;
  if (p.a === 1) {
    main = body.s;
  } else if (p.a === -1) {
    main = `−${wrap(body, 4)}`;
  } else {
    const inner = wrap(body, 4);
    main = /^[A-Za-zπ(√|]/.test(inner)
      ? `${fmt(p.a)}${inner}`
      : `${fmt(p.a)} · ${inner}`;
  }
  return p.k === 0
    ? main
    : `${main} ${p.k > 0 ? "+" : "−"} ${fmt(Math.abs(p.k))}`;
}

const originalText = (root: Node) =>
  renderNode(root, { s: "x", p: 5 }).s;

const plusConst = (text: string, c: number) =>
  c === 0 ? text : `${text} ${c > 0 ? "+" : "−"} ${fmt(Math.abs(c))}`;

/** Aturan titik (x; y) → (h + x/b; a·y + k) dengan angka saat ini. */
function pointRule({ h, k, a, b }: Params) {
  const xPart =
    b === 1 ? "x" : b === -1 ? "−x" : b < 0 ? `x/(${fmt(b)})` : `x/${fmt(b)}`;
  const yPart = a === 1 ? "y" : a === -1 ? "−y" : `${fmt(a)}y`;
  return `(x; y) → (${plusConst(xPart, h)}; ${plusConst(yPart, k)})`;
}

function describeEffects({ h, k, a, b }: Params) {
  const magA = Math.abs(a);
  let vertical =
    magA === 1
      ? "tidak diregang"
      : magA > 1
        ? `diregang ×${fmt(magA)}`
        : `dimampatkan ×${fmt(magA)}`;
  if (a < 0) {
    vertical += `, dicerminkan terhadap ${k === 0 ? "sumbu x" : `garis y = ${fmt(k)}`}`;
  }

  const magB = Math.abs(b);
  let horizontal =
    magB === 1
      ? "tidak diregang"
      : magB > 1
        ? `dimampatkan ×${fmt(1 / magB)}`
        : `diregang ×${fmt(1 / magB)}`;
  if (b < 0) {
    horizontal += `, dicerminkan terhadap ${h === 0 ? "sumbu y" : `garis x = ${fmt(h)}`}`;
  }

  return [
    {
      title: "Geser mendatar (h)",
      text:
        h === 0
          ? "tidak bergeser"
          : `${fmt(Math.abs(h))} satuan ke ${h > 0 ? "kanan" : "kiri"}`,
      tone: color.shift,
    },
    {
      title: "Geser tegak (k)",
      text:
        k === 0
          ? "tidak bergeser"
          : `${fmt(Math.abs(k))} satuan ke ${k > 0 ? "atas" : "bawah"}`,
      tone: color.shift,
    },
    { title: "Regang tegak (a)", text: vertical, tone: color.stretch },
    { title: "Regang mendatar (b)", text: horizontal, tone: color.stretch },
  ];
}

/* ───────── Matematika ───────── */

/** Titik (x, y) pada f menjadi (h + x/b, a·y + k) pada g. */
const mapPoint = (p: Params, [x, y]: Vec): Vec => [p.h + x / p.b, p.a * y + p.k];

/** Absis titik kunci: lima titik pertama yang terdefinisi pada f. */
function computeKeys(fn: Fn) {
  const picked: number[] = [];
  for (const u of KEY_CANDIDATES) {
    const y = fn(u);
    if (Number.isFinite(y) && Math.abs(y) <= 30) {
      picked.push(u);
      if (picked.length === KEY_LETTERS.length) break;
    }
  }
  return picked.sort((m, n) => m - n);
}

function probeOf(fn: Fn, p: Params) {
  const y = fn(p.x0);
  if (!Number.isFinite(y)) return null;
  const base: Vec = [p.x0, y];
  return { base, image: mapPoint(p, base) };
}

/** Titik-titik kurva y = a·f(b(x − h)) + k. NaN memutus garis
    (asimtot tegak atau di luar daerah asal). */
function sampleCurve(
  fn: Fn,
  p: Params,
  xMin: number,
  xMax: number,
  ySpan: number,
) {
  const nodes: number[] = [];
  for (let i = 0; i <= SAMPLES; i += 1) {
    nodes.push(xMin + (i / SAMPLES) * (xMax - xMin));
  }
  // x = h adalah tempat argumen bernilai 0 (mis. asimtot 1/x)
  if (p.h > xMin && p.h < xMax) {
    nodes.push(p.h);
    nodes.sort((m, n) => m - n);
  }

  const limit = Math.max(1000, ySpan * 20);
  const xs: number[] = [];
  const ys: number[] = [];
  let prev: number | null = null;
  const cut = () => {
    if (xs.length > 0 && !Number.isNaN(xs[xs.length - 1])) {
      xs.push(Number.NaN);
      ys.push(Number.NaN);
    }
    prev = null;
  };

  for (const x of nodes) {
    const y = p.a * fn(p.b * (x - p.h)) + p.k;
    if (!Number.isFinite(y) || Math.abs(y) > limit) {
      cut();
      continue;
    }
    // lompatan besar dengan tanda berganti = asimtot tegak
    if (prev !== null && Math.abs(y - prev) > 2 * ySpan && y * prev < 0) {
      cut();
    }
    xs.push(x);
    ys.push(y);
    prev = y;
  }

  if (xs.length === 0) return { xs: [Number.NaN], ys: [Number.NaN] };
  return { xs, ys };
}

/* ───────── Baris pengatur ───────── */

/** Tombol − / + yang bisa ditahan untuk mengubah nilai terus-menerus. */
function useHoldRepeat(onStep: (direction: 1 | -1) => void) {
  const stepRef = useRef(onStep);
  stepRef.current = onStep;
  const timers = useRef<{ delay?: number; repeat?: number }>({});

  const stop = () => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.repeat);
    timers.current = {};
  };

  useEffect(() => stop, []);

  return (direction: 1 | -1) => ({
    type: "button" as const,
    className: "ft-step",
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stop();
      stepRef.current(direction);
      // jaga-jaga bila tombol sempat berubah status saat ditahan
      window.addEventListener("pointerup", stop, { once: true });
      window.addEventListener("pointercancel", stop, { once: true });
      timers.current.delay = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(
          () => stepRef.current(direction),
          60,
        );
      }, 400);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onBlur: stop,
    onContextMenu: (event: { preventDefault: () => void }) =>
      event.preventDefault(),
    // detail === 0 → aktivasi lewat keyboard
    onClick: (event: { detail: number }) => {
      if (event.detail === 0) stepRef.current(direction);
    },
  });
}

/** Satu baris:  h  −  ────●────  +  2  ± */
function ParamRow({
  id,
  def,
  value,
  onChange,
  onFlip,
}: {
  id: string;
  def: RowDef;
  value: number;
  onChange: (value: number) => void;
  onFlip?: () => void;
}) {
  const { label, title, min, max, step, digits, tone, nonZero } = def;
  const round = (v: number) => {
    const f = Math.pow(10, digits);
    return Math.round(v * f) / f;
  };
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  // Nilai 0 dilewati untuk a dan b: loncat ke sisi seberangnya.
  const apply = (raw: number, direction?: 1 | -1) => {
    let next = clamp(round(raw));
    if (nonZero && Math.abs(next) < 1e-9) {
      next = clamp((direction ?? (value > 0 ? -1 : 1)) * step);
    }
    onChange(next);
  };
  const bind = useHoldRepeat((d) => apply(value + d * step, d));

  const span = max - min;
  const pct = ((clamp(value) - min) / span) * 100;
  const zero = ((0 - min) / span) * 100;
  const style = {
    "--lo": `${Math.min(zero, pct)}%`,
    "--hi": `${Math.max(zero, pct)}%`,
    "--sc": tone,
  } as CSSProperties;

  return (
    <div className="ft-slider" style={style}>
      <label htmlFor={id} title={title}>
        {label}
      </label>
      <button
        {...bind(-1)}
        aria-disabled={value <= min}
        aria-label={`Kurangi ${title}`}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <input
        id={id}
        className="ft-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value)}
        aria-valuetext={`${title} sama dengan ${fmt(value, digits)}`}
        onChange={(event) => apply(Number(event.currentTarget.value))}
      />
      <button
        {...bind(1)}
        aria-disabled={value >= max}
        aria-label={`Tambah ${title}`}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
      <output htmlFor={id} aria-live="off">
        {fmt(value, digits)}
      </output>
      {onFlip ? (
        <button
          type="button"
          className="ft-step ft-flip"
          aria-pressed={value < 0}
          aria-label={`Balik tanda ${label} (cerminkan)`}
          title="Balik tanda (cerminkan)"
          onClick={onFlip}
        >
          ±
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );
}

const cell = (key: string, value: string, tone?: string, wide?: boolean) => (
  <div key={key} className={wide ? "ft-wide" : undefined}>
    <dt>{key}</dt>
    <dd style={tone ? { color: tone } : undefined}>{value}</dd>
  </div>
);

/* ───────── Komponen utama ───────── */

export function FunctionTransformationSimulation() {
  const baseId = useId().replace(/:/g, "");
  const boardId = `ft-board-${baseId}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const probeRef = useRef<DragPoint | null>(null);
  const nativeFsRef = useRef(false);
  // Menyamakan ukuran papan JSXGraph dengan kontainernya (diisi efek papan)
  const syncRef = useRef<((force?: boolean) => void) | null>(null);

  const [storedParams, setParams] = useStoredSimulationState<Params>(
    "function-transformation.params",
    DEFAULT_PARAMS,
  );
  const [storedOpts, setOpts] = useStoredSimulationState<Opts>(
    "function-transformation.opts",
    DEFAULT_OPTS,
  );
  const [expression, setExpression] = useStoredSimulationState<string>(
    "function-transformation.expression",
    DEFAULT_EXPRESSION,
  );
  const [tab, setTab] = useState<Tab>("set");
  const [isFs, setIsFs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [exprText, setExprText] = useState(expression);
  const [exprError, setExprError] = useState<string | null>(null);

  // gabungkan dengan nilai bawaan agar pengaturan lama tetap valid
  const params = useMemo(() => cleanParams(storedParams), [storedParams]);
  const opts = useMemo<Opts>(
    () => ({ ...DEFAULT_OPTS, ...storedOpts }),
    [storedOpts],
  );
  const parsed = useMemo(() => parseExpression(expression), [expression]);
  const node = useMemo(
    () => ("node" in parsed ? parsed.node : DEFAULT_NODE),
    [parsed],
  );
  const fn = useMemo(() => compileNode(node), [node]);
  const keys = useMemo(() => computeKeys(fn), [fn]);

  // data yang dibaca papan JSXGraph (selalu lewat ref agar tidak basi)
  const pRef = useRef(params);
  pRef.current = params;
  const oRef = useRef(opts);
  oRef.current = opts;
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const keysRef = useRef(keys);
  keysRef.current = keys;
  const moveRef = useRef<(x: number, pt: DragPoint) => void>(() => undefined);
  moveRef.current = (x, pt) => {
    const nx = Math.min(X0_LIM, Math.max(-X0_LIM, Math.round(x * 10) / 10));
    const y = fnRef.current(nx);
    // titik uji selalu tetap berada pada grafik f
    pt.setPosition(COORDS_BY_USER, [nx, Number.isFinite(y) ? y : pt.Y()]);
    const next: Params = { ...pRef.current, x0: nx };
    pRef.current = next;
    setParams(next);
    boardRef.current?.update();
  };

  /* ───────── Parameter ───────── */

  const patchParams = (patch: Partial<Params>) =>
    setParams((prev) => ({ ...cleanParams(prev), ...patch }));

  const setOpt = (key: keyof Opts) =>
    setOpts((prev) => ({ ...DEFAULT_OPTS, ...prev, [key]: !oRef.current[key] }));

  const changeExpression = (text: string) => {
    setExprText(text);
    const result = parseExpression(text);
    if ("error" in result) {
      setExprError(result.error);
      return;
    }
    setExprError(null);
    setExpression(text.trim());
  };

  const clearTransform = () =>
    patchParams({ h: 0, k: 0, a: 1, b: 1 });

  const reset = () => {
    setParams(DEFAULT_PARAMS);
    setOpts(DEFAULT_OPTS);
    setExpression(DEFAULT_EXPRESSION);
    setExprText(DEFAULT_EXPRESSION);
    setExprError(null);
    boardRef.current?.setBoundingBox(HOME_BOX, true);
  };

  /* ───────── Tampilan ───────── */

  const zoomIn = () => boardRef.current?.zoomIn();
  const zoomOut = () => boardRef.current?.zoomOut();
  const center = () => boardRef.current?.setBoundingBox(HOME_BOX, true);

  const toggleFs = async () => {
    const el = rootRef.current;
    if (!el) return;
    if (isFs || document.fullscreenElement === el) {
      if (document.fullscreenElement === el) {
        try {
          await document.exitFullscreen();
        } catch {
          /* diabaikan */
        }
      }
      nativeFsRef.current = false;
      setIsFs(false);
      return;
    }
    // Pasang tata letak layar penuh lebih dulu (flushSync), baru minta layar
    // penuh asli, agar ukuran grafik langsung benar.
    flushSync(() => {
      setPanelOpen(false);
      setIsFs(true);
    });
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        nativeFsRef.current = true;
      } catch {
        /* tetap pakai layar penuh CSS */
      }
    }
  };

  // Layar sentuh: kunci ke lanskap saat layar penuh (bila diizinkan browser).
  useEffect(() => {
    if (!isFs || !window.matchMedia("(pointer: coarse)").matches) return;
    const o = (
      screen as unknown as {
        orientation?: {
          lock?: (m: "landscape") => Promise<void>;
          unlock?: () => void;
        };
      }
    ).orientation;
    if (typeof o?.lock !== "function") return;
    o.lock("landscape").catch(() => undefined);
    return () => {
      try {
        o.unlock?.();
      } catch {
        /* abaikan */
      }
    };
  }, [isFs]);

  // Sinkron saat keluar lewat Esc / gestur sistem.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && nativeFsRef.current) {
        nativeFsRef.current = false;
        setIsFs(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !document.fullscreenElement &&
        !nativeFsRef.current
      ) {
        setIsFs(false);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* ───────── Papan JSXGraph ───────── */

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: HOME_BOX,
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepAspectRatio: true,
      // Ukuran papan diatur oleh sync di bawah; pengamat bawaan dimatikan
      // agar tidak berebut saat masuk layar penuh.
      resize: { enabled: false, throttle: 100 },
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: {
        wheel: true,
        needShift: false,
        factorX: 1.15,
        factorY: 1.15,
        min: 0.15,
        max: 12,
      },
    });
    boardRef.current = board;

    board.create("grid", [], {
      strokeColor: "#94a3b8",
      strokeOpacity: 0.28,
      strokeWidth: 1,
      highlight: false,
    });

    const ticks = {
      insertTicks: true,
      minTicksDistance: 32,
      minorTicks: 0,
      majorHeight: 6,
      strokeColor: "#94a3b8",
      drawLabels: true,
      label: { fontSize: 10, strokeColor: "#64748b" },
    };
    const axis = {
      strokeColor: "#94a3b8",
      strokeWidth: 1.25,
      highlight: false,
      ticks,
    };
    board.create("axis", [[0, 0], [1, 0]], axis);
    board.create("axis", [[0, 0], [0, 1]], axis);

    const show = (key: keyof Opts) => oRef.current[key];
    const unit = () => {
      const b = board as unknown as { unitX: number; unitY: number };
      return { ux: b.unitX || 40, uy: b.unitY || 40 };
    };
    const view = () => {
      const [x1, y1, x2, y2] = board.getBoundingBox() as number[];
      const margin = (x2 - x1) * 0.1;
      return { xMin: x1 - margin, xMax: x2 + margin, ySpan: Math.abs(y1 - y2) };
    };
    const extent = () => {
      const bb = board.getBoundingBox() as number[];
      return 4 * Math.max(...bb.map((v) => Math.abs(v))) + 30;
    };

    /* Kurva berdasarkan deret titik; null menyembunyikannya */
    const makeCurve = (
      stroke: string,
      width: number,
      dash: number,
      build: () => { xs: number[]; ys: number[] } | null,
    ) => {
      const curve = board.create("curve", [[0], [0]], {
        strokeColor: stroke,
        strokeWidth: width,
        dash,
        highlight: false,
        fixed: true,
      }) as unknown as DataCurve;
      curve.updateDataArray = () => {
        const data = build();
        if (!data || data.xs.length === 0) {
          curve.dataX = [Number.NaN];
          curve.dataY = [Number.NaN];
          return;
        }
        curve.dataX = data.xs;
        curve.dataY = data.ys;
      };
      return curve;
    };
    const polyline = (points: Vec[] | null) =>
      !points ||
      points.some((q) => !Number.isFinite(q[0]) || !Number.isFinite(q[1]))
        ? null
        : { xs: points.map((q) => q[0]), ys: points.map((q) => q[1]) };

    /* Garis bantu x = h dan y = k (tidak digambar bila berimpit dengan sumbu) */
    makeCurve(color.guide, 1.5, 2, () => {
      const { h } = pRef.current;
      if (!show("guide") || h === 0) return null;
      const s = extent();
      return polyline([
        [h, -s],
        [h, s],
      ]);
    });
    makeCurve(color.guide, 1.5, 2, () => {
      const { k } = pRef.current;
      if (!show("guide") || k === 0) return null;
      const s = extent();
      return polyline([
        [-s, k],
        [s, k],
      ]);
    });

    /* f(x) dan g(x) */
    makeCurve(color.f, 2.5, 0, () => {
      if (!show("original")) return null;
      const { xMin, xMax, ySpan } = view();
      return sampleCurve(fnRef.current, IDENTITY, xMin, xMax, ySpan);
    });
    makeCurve(color.g, 3.5, 0, () => {
      const { xMin, xMax, ySpan } = view();
      return sampleCurve(fnRef.current, pRef.current, xMin, xMax, ySpan);
    });

    /* Titik dan label */
    const dot = (
      x: () => number,
      y: () => number,
      fill: string,
      size: number,
    ) =>
      board.create("point", [x, y], {
        name: "",
        withLabel: false,
        size,
        fillColor: fill,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        fixed: true,
        highlight: false,
      });
    const label = (
      x: () => number,
      y: () => number,
      text: string | (() => string),
      tone: string,
      offset: [number, number] = [8, 8],
    ) =>
      board.create(
        "text",
        [
          () => (Number.isFinite(x()) ? x() : 1e6),
          () => (Number.isFinite(y()) ? y() : 1e6),
          text,
        ],
        {
          fontSize: 12,
          strokeColor: tone,
          offset,
          highlight: false,
          fixed: true,
        },
      );

    // titik kunci: asal (A, B, ...) pada f dan bayangannya (A′, B′, ...) pada g
    const keyBase = (i: number): Vec => {
      const u = keysRef.current[i];
      if (!show("key") || u === undefined) return [Number.NaN, Number.NaN];
      return [u, fnRef.current(u)];
    };
    const keyImage = (i: number): Vec => {
      const base = keyBase(i);
      return Number.isNaN(base[0]) ? base : mapPoint(pRef.current, base);
    };
    KEY_LETTERS.forEach((name, i) => {
      dot(() => keyBase(i)[0], () => keyBase(i)[1], color.f, 4);
      dot(() => keyImage(i)[0], () => keyImage(i)[1], color.g, 4);
      label(() => keyBase(i)[0], () => keyBase(i)[1], name, color.f, [6, 6]);
      label(
        () => keyImage(i)[0],
        () => keyImage(i)[1],
        `${name}′`,
        color.g,
        [6, -16],
      );
    });

    /* Titik uji: P pada f (bisa diseret), P′ pada g, dan panahnya */
    const probe = () =>
      show("probe") ? probeOf(fnRef.current, pRef.current) : null;

    makeCurve(color.probe, 1.75, 0, () => {
      const pr = probe();
      if (!pr) return null;
      const [from, to] = [pr.base, pr.image];
      const { ux, uy } = unit();
      const dx = (to[0] - from[0]) * ux;
      const dy = (to[1] - from[1]) * uy;
      // terlalu pendek (dalam piksel): tanpa panah
      if (Math.hypot(dx, dy) < 14) return null;
      const phi = Math.atan2(dy, dx);
      const barb = (sign: 1 | -1): Vec => {
        const angle = phi + Math.PI + sign * 0.45;
        return [
          to[0] + (9 * Math.cos(angle)) / ux,
          to[1] + (9 * Math.sin(angle)) / uy,
        ];
      };
      return polyline([from, to, barb(1), to, barb(-1)]);
    });

    dot(
      () => probe()?.image[0] ?? Number.NaN,
      () => probe()?.image[1] ?? Number.NaN,
      color.g,
      5,
    );
    label(
      () => probe()?.image[0] ?? Number.NaN,
      () => probe()?.image[1] ?? Number.NaN,
      "P′",
      color.g,
      [8, -18],
    );
    label(
      () => probe()?.base[0] ?? Number.NaN,
      () => probe()?.base[1] ?? Number.NaN,
      "P",
      color.f,
      [8, 8],
    );

    // titik uji P: bisa diseret (dibuat paling akhir agar berada di atas)
    const start = pRef.current;
    const y0 = fnRef.current(start.x0);
    const handle = board.create(
      "point",
      [start.x0, Number.isFinite(y0) ? y0 : 0],
      {
        name: "",
        withLabel: false,
        size: 7,
        face: "o",
        fillColor: color.f,
        strokeColor: "#ffffff",
        strokeWidth: 2,
        fixed: false,
        highlight: false,
        snapToGrid: false,
        showInfobox: false,
      },
    ) as unknown as DragPoint;
    handle.on("drag", () => moveRef.current(handle.X(), handle));
    probeRef.current = handle;

    board.update();

    // Saat ukuran berubah (layar penuh / putar layar): pertahankan skala
    // dan titik tengah agar grafik tidak melompat.
    let last = { w: el.clientWidth, h: el.clientHeight };
    const sync = (force = false) => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      if (!force && w === last.w && h === last.h) return;

      const bb = board.getBoundingBox();
      const spanX = bb[2] - bb[0];
      const spanY = bb[1] - bb[3];
      board.resizeContainer(w, h, true, true);
      if (last.w > 0 && last.h > 0 && spanX > 0 && spanY > 0) {
        const ux = last.w / spanX;
        const uy = last.h / spanY;
        const cx = (bb[0] + bb[2]) / 2;
        const cy = (bb[1] + bb[3]) / 2;
        board.setBoundingBox(
          [cx - w / 2 / ux, cy + h / 2 / uy, cx + w / 2 / ux, cy - h / 2 / uy],
          true,
        );
      }
      last = { w, h };
      board.update();
    };
    syncRef.current = sync;
    const observer = new ResizeObserver(() => sync());
    observer.observe(el);

    return () => {
      syncRef.current = null;
      observer.disconnect();
      probeRef.current = null;
      JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
    };
  }, [boardId]);

  // Perbarui papan setiap parameter, fungsi, atau pilihan berubah; titik uji
  // yang bisa diseret disamakan dengan nilai penggeser dan tetap di grafik f.
  useEffect(() => {
    const pt = probeRef.current;
    if (pt) {
      const y = fn(params.x0);
      if (opts.probe && Number.isFinite(y)) {
        if (
          Math.abs(pt.X() - params.x0) > 1e-9 ||
          Math.abs(pt.Y() - y) > 1e-9
        ) {
          pt.setPosition(COORDS_BY_USER, [params.x0, y]);
        }
        pt.showElement();
      } else {
        pt.hideElement();
      }
    }
    boardRef.current?.update();
  }, [params, opts, fn, keys]);

  // Masuk/keluar layar penuh mengubah ukuran kontainer dua kali (tata letak
  // CSS, lalu layar penuh asli). Sinkronkan ulang setelah transisi.
  useEffect(() => {
    const run = () => syncRef.current?.(true);
    const raf = requestAnimationFrame(() => requestAnimationFrame(run));
    const t1 = window.setTimeout(run, 150);
    const t2 = window.setTimeout(run, 450);
    document.addEventListener("fullscreenchange", run);
    window.addEventListener("resize", run);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener("fullscreenchange", run);
      window.removeEventListener("resize", run);
    };
  }, [isFs]);

  /* ───────── Nilai turunan ───────── */

  const fText = originalText(node);
  const gText = transformedText(node, params);
  const probeNow = probeOf(fn, params);
  const guideOn = opts.guide && (params.h !== 0 || params.k !== 0);
  const compact = (text: string) => text.replace(/\s+/g, "");

  return (
    <div ref={rootRef} className={`ft${isFs ? " is-fs" : ""}`}>
      <p className="ft-hint">
        <Smartphone size={14} aria-hidden="true" />
        <span>
          Miringkan ponsel ke mode lanskap agar grafik dan pengatur nyaman
          dipakai.
        </span>
      </p>

      <div className="ft-layout">
        {/* ───── Grafik ───── */}
        <section className="ft-graph" aria-label="Grafik transformasi fungsi">
          <div className="ft-stage">
            <div
              id={boardId}
              ref={hostRef}
              className="ft-board"
              aria-label="Grafik fungsi awal f(x) berwarna biru dan hasil transformasi g(x) berwarna merah muda. Seret latar untuk menggeser, gulir atau cubit untuk memperbesar, seret titik P untuk memindahkan titik uji sepanjang grafik f."
            />

            <div className="ft-hud">
              <p className="ft-chip" aria-live="polite">
                <b>g(x)</b>
                <span>= {gText}</span>
              </p>
              <p className="ft-pinfo">
                <span>
                  <b style={{ color: color.f }}>f(x)</b> = {fText}
                </span>
                {opts.probe && probeNow && (
                  <span>
                    <b style={{ color: color.f }}>P</b> {fmtPt(probeNow.base)} →{" "}
                    <b style={{ color: color.g }}>P′</b>{" "}
                    {fmtPt(probeNow.image)}
                  </span>
                )}
              </p>
            </div>

            <div className="ft-tools" role="group" aria-label="Alat tampilan">
              <button
                type="button"
                onClick={toggleFs}
                aria-pressed={isFs}
                aria-label={isFs ? "Keluar layar penuh" : "Layar penuh"}
                title={isFs ? "Keluar layar penuh" : "Layar penuh"}
              >
                {isFs ? (
                  <Minimize2 size={16} aria-hidden="true" />
                ) : (
                  <Maximize2 size={16} aria-hidden="true" />
                )}
              </button>
              <button type="button" onClick={zoomIn} aria-label="Perbesar" title="Perbesar">
                <Plus size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={zoomOut} aria-label="Perkecil" title="Perkecil">
                <Minus size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={center}
                aria-label="Pusatkan tampilan"
                title="Pusatkan tampilan"
              >
                <Crosshair size={16} aria-hidden="true" />
              </button>
              {isFs && (
                <button
                  type="button"
                  className="ft-toggle"
                  onClick={() => setPanelOpen((o) => !o)}
                  aria-pressed={panelOpen}
                  aria-controls={`ft-panel-${baseId}`}
                  aria-label={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                  title={panelOpen ? "Sembunyikan pengatur" : "Tampilkan pengatur"}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul className="ft-legend" aria-label="Legenda grafik">
            {opts.original && (
              <li>
                <i style={{ borderColor: color.f }} /> f(x) asli
              </li>
            )}
            <li>
              <i style={{ borderColor: color.g }} /> g(x) hasil
            </li>
            {guideOn && (
              <li>
                <i className="dash" style={{ borderColor: color.guide }} /> x = h, y = k
              </li>
            )}
            {opts.key && (
              <li>
                <b style={{ background: color.f }} />
                <b style={{ background: color.g }} /> titik kunci
              </li>
            )}
            {opts.probe && probeNow && (
              <li>
                <i style={{ borderColor: color.probe }} /> P → P′
              </li>
            )}
          </ul>
        </section>

        {/* ───── Pengatur ───── */}
        <section
          id={`ft-panel-${baseId}`}
          className={`ft-panel${isFs ? " is-floating" : ""}${isFs && panelOpen ? " is-open" : ""}`}
          aria-label="Pengatur transformasi fungsi"
        >
          <div className="ft-tabs" role="group" aria-label="Bagian panel">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={tab === item.key}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "set" && (
            <>
              <div className="ft-sliders">
                <p className="ft-cap">Geser · h ke kanan, k ke atas</p>
                {SHIFT_ROWS.map((row) => (
                  <ParamRow
                    key={row.key}
                    id={`ft-${baseId}-${row.key}`}
                    def={row}
                    value={params[row.key]}
                    onChange={(v) => patchParams({ [row.key]: v } as Partial<Params>)}
                  />
                ))}
                <p className="ft-cap">Regang · a tegak, b mendatar (± = cermin)</p>
                {STRETCH_ROWS.map((row) => (
                  <ParamRow
                    key={row.key}
                    id={`ft-${baseId}-${row.key}`}
                    def={row}
                    value={params[row.key]}
                    onChange={(v) => patchParams({ [row.key]: v } as Partial<Params>)}
                    onFlip={() =>
                      patchParams({ [row.key]: -params[row.key] } as Partial<Params>)
                    }
                  />
                ))}
                <p className="ft-cap">Titik uji · seret P di grafik</p>
                <ParamRow
                  id={`ft-${baseId}-x0`}
                  def={PROBE_ROW}
                  value={params.x0}
                  onChange={(v) => patchParams({ x0: v })}
                />
              </div>

              <div className="ft-chips" role="group" aria-label="Tampilkan di grafik">
                {OPTION_ROWS.map((row) => (
                  <button
                    key={row.key}
                    type="button"
                    aria-pressed={opts[row.key]}
                    onClick={() => setOpt(row.key)}
                  >
                    {row.label}
                  </button>
                ))}
              </div>

              <div className="ft-actions">
                <button type="button" className="ft-btn" onClick={reset}>
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>Atur ulang</span>
                </button>
                <button type="button" className="ft-btn" onClick={clearTransform}>
                  <X size={13} aria-hidden="true" />
                  <span>Tanpa ubahan</span>
                </button>
              </div>
            </>
          )}

          {tab === "fn" && (
            <>
              <div className="ft-field" data-bad={exprError ? "true" : undefined}>
                <label htmlFor={`ft-${baseId}-expr`}>f(x) =</label>
                <input
                  id={`ft-${baseId}-expr`}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  value={exprText}
                  aria-invalid={!!exprError}
                  onChange={(event) => changeExpression(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                />
              </div>
              {exprError ? (
                <p className="ft-note" role="status">
                  {exprError}
                </p>
              ) : (
                <p className="ft-help">
                  Ketik fungsi dalam <code>x</code>, atau pilih contoh di bawah.
                  Bisa memakai <code>+ − * / ^</code>, <code>sin cos tan</code>,{" "}
                  <code>sqrt abs ln log exp</code>, <code>e</code>, dan{" "}
                  <code>pi</code>.
                </p>
              )}
              <div className="ft-presets" role="group" aria-label="Contoh fungsi awal">
                {PRESETS.map((item) => (
                  <button
                    key={item.expr}
                    type="button"
                    aria-pressed={compact(expression) === item.expr}
                    onClick={() => changeExpression(item.expr)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === "res" && (
            <>
              <dl className="ft-readouts" aria-live="polite">
                {cell("Fungsi awal", `f(x) = ${fText}`, color.f, true)}
                {cell("Hasil transformasi", `g(x) = ${gText}`, color.g, true)}
                {cell("Aturan titik", pointRule(params), undefined, true)}
              </dl>

              <dl className="ft-readouts" aria-live="polite">
                {describeEffects(params).map((item) =>
                  cell(item.title, item.text, item.tone, true),
                )}
              </dl>

              <dl className="ft-readouts" aria-live="polite">
                {probeNow
                  ? cell(
                      "P → P′",
                      `${fmtPt(probeNow.base)} → ${fmtPt(probeNow.image)}`,
                      color.probe,
                      true,
                    )
                  : cell("P → P′", "f belum terdefinisi di x₀", undefined, true)}
                {keys.map((u, i) => {
                  const base: Vec = [u, fn(u)];
                  return cell(
                    `${KEY_LETTERS[i]} → ${KEY_LETTERS[i]}′`,
                    `${fmtPt(base)} → ${fmtPt(mapPoint(params, base))}`,
                    undefined,
                    true,
                  );
                })}
              </dl>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default FunctionTransformationSimulation;
