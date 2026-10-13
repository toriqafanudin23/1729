/* eslint-disable @typescript-eslint/no-explicit-any */
/* SimSlides — inti: Reveal.js (slide) + JSXGraph (papan) + React (state), menjadi satu.
   Gagasan utamanya: PENJELASAN MENGGERAKKAN SIMULASI. Setiap fragmen (tekan →) menaikkan
   `step`, dan `step` itu menjadi parameter papan. Papan hanya hidup saat slidenya tampil. */
import JXG from "jsxgraph";
import Reveal from "reveal.js";
import "reveal.js/reveal.css";
import {
  createContext, useContext, useEffect, useId, useRef, useState,
  type CSSProperties, type ReactNode, type RefObject,
} from "react";
import "./slides.css";

export type Vec = [number, number];
export type BBox = [number, number, number, number];
export type B = any;
export type Deck = any;
export type Build<P> = (
  b: B,
  get: () => P,
  set: (patch: Partial<P>) => void,
  clock: () => number,
) => void;

export const C = {
  ink: "#0f172a", mute: "#64748b", soft: "#94a3b8", line: "#cbd5e1", grid: "#e2e8f0",
  blue: "#1565c0", orange: "#e65100", violet: "#6557d2",
  teal: "#0f766e", green: "#15803d", red: "#b3261e",
};
export const OFF: Vec = [1e4, 1e4];

/* ───────── Matematika kecil ───────── */
export const rad = (d: number) => (d * Math.PI) / 180;
export const add = (p: Vec, q: Vec): Vec => [p[0] + q[0], p[1] + q[1]];
export const rot = (p: Vec, c: Vec, deg: number): Vec => {
  const r = rad(deg), x = p[0] - c[0], y = p[1] - c[1];
  return [c[0] + x * Math.cos(r) - y * Math.sin(r), c[1] + x * Math.sin(r) + y * Math.cos(r)];
};
export const dil = (p: Vec, c: Vec, k: number): Vec => [c[0] + k * (p[0] - c[0]), c[1] + k * (p[1] - c[1])];
/** Cermin: garis berarah φ°, digeser d satuan ke arah normalnya. */
export const mirror = (p: Vec, deg: number, d: number): Vec => {
  const r = rad(deg), u: Vec = [Math.cos(r), Math.sin(r)], o: Vec = [-d * u[1], d * u[0]];
  const v: Vec = [p[0] - o[0], p[1] - o[1]], s = 2 * (v[0] * u[0] + v[1] * u[1]);
  return [o[0] + s * u[0] - v[0], o[1] + s * u[1] - v[1]];
};
export const fmt = (n: number, d = 2) => {
  const x = Math.abs(n) < 0.5 * 10 ** -d ? 0 : n;
  return x.toFixed(d).replace(".", ",").replace("-", "−");
};

/* ───────── Reveal: konteks, deck, hook ───────── */
const DeckCtx = createContext<Deck | null>(null);
export const useDeck = () => useContext(DeckCtx);

export function SlideDeck({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [deck, setDeck] = useState<Deck | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const d: Deck = new (Reveal as any)(el, {
      embedded: true, width: 1280, height: 720, margin: 0.02, center: false,
      hash: false, controls: true, progress: true, slideNumber: "c/t",
      transition: "fade", transitionSpeed: "fast", backgroundTransition: "none",
      keyboardCondition: "focused", mouseWheel: false, help: false,
    });
    let alive = true;
    d.initialize().then(() => { if (alive) setDeck(d); });
    const ro = new ResizeObserver(() => { try { d.layout(); } catch { /* belum siap */ } });
    ro.observe(el);
    return () => {
      alive = false; ro.disconnect(); setDeck(null);
      try { d.destroy(); } catch { /* sudah dibongkar */ }
    };
  }, []);

  return (
    <DeckCtx.Provider value={deck}>
      <div className="reveal ds-deck" ref={root} tabIndex={0} aria-label="Presentasi simulasi">
        <div className="slides">{children}</div>
      </div>
    </DeckCtx.Provider>
  );
}

/** true bila elemen `host` berada di slide yang sedang tampil. */
export function useActive(host: RefObject<any>) {
  const deck = useDeck();
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!deck) return;
    const f = () => setOn(!!host.current && !!deck.getCurrentSlide()?.contains(host.current));
    f();
    deck.on("slidechanged", f);
    return () => deck.off("slidechanged", f);
  }, [deck, host]);
  return on;
}

/** Banyaknya fragmen yang sudah tampil di slide induk: 0, 1, 2, … */
export function useStep(host: RefObject<any>) {
  const deck = useDeck();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!deck) return;
    const f = () => {
      const sec = host.current?.closest("section");
      setN(sec ? sec.querySelectorAll(".fragment.visible").length : 0);
    };
    f();
    const ev = ["fragmentshown", "fragmenthidden", "slidechanged"];
    ev.forEach((e) => deck.on(e, f));
    return () => ev.forEach((e) => deck.off(e, f));
  }, [deck, host]);
  return n;
}

/** Menghaluskan angka menuju `target` (ease-out). Menghormati "kurangi gerakan". */
export function useTween(target: number, ms = 800) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      cur.current = target; setV(target); return;
    }
    const from = cur.current, t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      cur.current = from + (target - from) * (1 - (1 - k) ** 3);
      setV(cur.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/* ───────── Pembantu JSXGraph ───────── */
export const mk = (b: B, type: string, parents: unknown[], attrs: Record<string, unknown> = {}): B =>
  b.create(type, parents, attrs);
export const still = { fixed: true, highlight: false, showInfobox: false };

export function backdrop(b: B) {
  mk(b, "grid", [], { strokeColor: C.grid, strokeWidth: 1, majorStep: 1, minorElements: 0, highlight: false });
  const ticks = { strokeColor: C.soft, drawZero: false, majorHeight: 7, minorTicks: 0, label: { fontSize: 11, strokeColor: C.mute } };
  const ax = { strokeColor: C.soft, strokeWidth: 1.25, highlight: false, ticks };
  mk(b, "axis", [[0, 0], [1, 0]], ax);
  mk(b, "axis", [[0, 0], [0, 1]], ax);
}

/** Poligon / garis data dari fungsi; `null` = sembunyikan. */
export function shape(b: B, pts: () => number[][] | null, attrs: Record<string, unknown> = {}, closed = true) {
  const c = mk(b, "curve", [[0], [0]], { ...still, ...attrs });
  c.updateDataArray = () => {
    const p = pts();
    if (!p || !p.length) { c.dataX = [NaN]; c.dataY = [NaN]; return; }
    const a = closed ? [...p, p[0]] : p;
    c.dataX = a.map((q) => q[0]); c.dataY = a.map((q) => q[1]);
  };
  return c;
}
export const dot = (b: B, pos: () => number[], color: string, size = 4, name = "") =>
  mk(b, "point", [() => pos()[0], () => pos()[1]], {
    ...still, name, withLabel: !!name, size, fillColor: color, strokeColor: "#fff", strokeWidth: 1.5,
    label: { fontSize: 13, strokeColor: color, offset: [8, 6] },
  });
export const seg = (b: B, p: () => number[], q: () => number[], color: string, w = 2, dash = 0) =>
  mk(b, "segment", [[() => p()[0], () => p()[1]], [() => q()[0], () => q()[1]]], {
    ...still, strokeColor: color, strokeWidth: w, dash, point1: { visible: false }, point2: { visible: false },
  });
export const arrow = (b: B, p: () => number[], q: () => number[], color: string, w = 2, dash = 0) =>
  mk(b, "segment", [[() => p()[0], () => p()[1]], [() => q()[0], () => q()[1]]], {
    ...still, strokeColor: color, strokeWidth: w, dash, lastArrow: { type: 2, size: 6 },
    point1: { visible: false }, point2: { visible: false },
  });
export const note = (b: B, pos: () => number[], text: () => string, color = C.mute) =>
  mk(b, "text", [() => pos()[0], () => pos()[1], text], {
    ...still, fontSize: 13, strokeColor: color, anchorX: "left", anchorY: "bottom",
    cssStyle: "font-weight:600;white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;",
  });

/* ───────── SimBoard: papan yang hanya hidup saat slidenya tampil ───────── */
export function SimBoard<P extends object>(props: {
  bbox: BBox; params: P; build: Build<P>; onChange?: (patch: Partial<P>) => void; loop?: boolean; maxH?: number;
  /** Rasio lebar:tinggi papan. Bila diisi, sumbu x dan y boleh berbeda skala (keepAspectRatio mati). */
  aspect?: number;
}) {
  const { bbox, params, build, loop = false, maxH = 500, aspect } = props;
  const host = useRef<HTMLDivElement>(null);
  const deck = useDeck();
  const active = useActive(host);
  const id = `jxg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const board = useRef<B>(null);
  const clock = useRef(0);
  const latest = useRef(params); latest.current = params;
  const onChange = useRef(props.onChange); onChange.current = props.onChange;

  useEffect(() => {
    if (!active) return;
    const raf = requestAnimationFrame(() => {
      const b = JXG.JSXGraph.initBoard(id, {
        boundingbox: bbox, keepAspectRatio: aspect === undefined, axis: false, grid: false, showCopyright: false,
        showNavigation: false, showInfobox: false, pan: { enabled: false }, zoom: { enabled: false },
        resize: { enabled: true, throttle: 60 },
      } as never) as B;
      board.current = b;
      backdrop(b);
      build(b, () => latest.current, (patch) => onChange.current?.(patch), () => clock.current);
      b.updateCSSTransforms?.(); // Reveal menskalakan slide lewat CSS
      b.update();
    });
    return () => {
      cancelAnimationFrame(raf);
      if (board.current) { JXG.JSXGraph.freeBoard(board.current); board.current = null; }
    };
  }, [active, id, bbox, build, aspect]);

  useEffect(() => { board.current?.update(); }, [params]);

  useEffect(() => {
    if (!deck) return;
    const f = () => board.current?.updateCSSTransforms?.();
    deck.on("resize", f); deck.on("slidechanged", f);
    return () => { deck.off("resize", f); deck.off("slidechanged", f); };
  }, [deck]);

  useEffect(() => {
    if (!active || !loop) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { clock.current = 2.4; return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      clock.current = (now - t0) / 1000;
      board.current?.update();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, loop]);

  const ratio = aspect ?? (bbox[2] - bbox[0]) / (bbox[1] - bbox[3]);
  return (
    <div className="ds-board" data-prevent-swipe style={{ maxWidth: ratio * maxH }}>
      <div id={id} ref={host} className="ds-board__canvas" style={{ aspectRatio: String(ratio) }} />
    </div>
  );
}

/* ───────── UI ───────── */
export function Frame(p: { eyebrow: string; title: ReactNode; copy: ReactNode; stage: ReactNode; innerRef?: RefObject<any> }) {
  return (
    <section>
      <div className="ds-slide" ref={p.innerRef}>
        <div className="ds-copy">
          <p className="ds-eyebrow">{p.eyebrow}</p>
          <h2>{p.title}</h2>
          {p.copy}
        </div>
        <div className="ds-stage">{p.stage}</div>
      </div>
    </section>
  );
}

export function Range(p: {
  label: ReactNode; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; color?: string; shown?: string;
}) {
  const { value, min, max, step = 1, color = C.ink } = p;
  return (
    <label className="ds-range">
      <span className="ds-range__top"><span>{p.label}</span><b style={{ color }}>{p.shown ?? fmt(value, step < 1 ? 1 : 0)}</b></span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => p.onChange(Number(e.currentTarget.value))}
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%`, "--c": color } as CSSProperties}
      />
    </label>
  );
}

export function Chips<T extends string | number>(p: {
  items: { v: T; label: ReactNode }[]; value: T; onPick: (v: T) => void;
}) {
  return (
    <div className="ds-chips" role="group">
      {p.items.map((it) => (
        <button key={String(it.v)} type="button" className="ds-chip" aria-pressed={it.v === p.value} onClick={() => p.onPick(it.v)}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

export const Btn = (p: { children: ReactNode; onClick: () => void }) => (
  <button type="button" className="ds-btn" onClick={p.onClick}>{p.children}</button>
);
