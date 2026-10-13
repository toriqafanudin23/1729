/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { SimMath } from "../simulation/common/components/SimMath";
import {
  Btn, C, Chips, dot, fmt, Frame, mk, note, OFF, Range, seg, shape,
  SimBoard, SlideDeck, still, useStep, useTween,
  type BBox, type Build, type Vec,
} from "./core";

/* Slide "Limit dan turunan": mendekati → ε–δ → garis potong → fungsi turunan. */

const tex = (s: string) => <SimMath tex={s} />;
const FNS = {
  cubic: { label: "⅓x³ − x", f: (x: number) => x ** 3 / 3 - x, d: (x: number) => x * x - 1 },
  sin: { label: "sin x", f: Math.sin, d: Math.cos },
  quad: { label: "x²", f: (x: number) => x * x, d: (x: number) => 2 * x },
};
type FnKey = keyof typeof FNS;
const fnItems = (keys: FnKey[]) => keys.map((k) => ({ v: k, label: FNS[k].label }));

/** Jangkar tahap-tahap: tiap fragmen menyetel eksponen log10 dari δ atau h. */
const E_STEPS = [0.2, -0.4, -1.4, -2.8];
function useShrink(step: number) {
  const [e, setE] = useState(E_STEPS[0]);
  useEffect(() => setE(E_STEPS[Math.min(step, E_STEPS.length - 1)]), [step]);
  return [useTween(e, 450), setE] as const;
}

/* ═════════ 0 · Sampul: garis potong menuju garis singgung ═════════ */
const COVER: BBox = [-3, 6, 3, -1.5];
const buildCover: Build<object> = (b, _g, _s, clock) => {
  const f = (x: number) => x * x;
  const h = () => 2.2 * Math.exp(-1.15 * (clock() % 5)) + 0.02;
  mk(b, "functiongraph", [f, -2.6, 2.6], { ...still, strokeColor: C.ink, strokeWidth: 3 });
  mk(b, "line", [() => -1, () => 2, () => -1], { ...still, strokeColor: C.soft, strokeWidth: 1.5, dash: 2 });
  const P = dot(b, () => [1, 1], C.ink, 5);
  const Q = dot(b, () => [1 + h(), f(1 + h())], C.orange, 5);
  mk(b, "line", [P, Q], { ...still, strokeColor: C.orange, strokeWidth: 2.25 });
  note(b, () => [-2.8, 5.2], () => `h = ${fmt(h(), 2)}`, C.mute);
};
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi"
      title="Limit dan turunan"
      copy={<>
        <p>Dua gagasan terbesar kalkulus sebenarnya satu pertanyaan: <b>apa yang terjadi ketika sesuatu mendekati nol?</b></p>
        <p className="ds-muted">Garis oranye adalah garis potong. Lihat ia perlahan menjadi garis singgung.</p>
      </>}
      stage={<SimBoard bbox={COVER} params={{}} build={buildCover} loop />}
    />
  );
}

/* ═════════ 1 · Limit: mendekati, bukan sampai ═════════ */
const LIM: BBox = [-1.5, 7, 5.5, -1.5];
const buildLim: Build<{ e: number }> = (b, g) => {
  const d = () => 10 ** g().e;
  const f = (x: number) => x + 2; // (x²−4)/(x−2) untuk x ≠ 2
  mk(b, "functiongraph", [f, -1.4, 5.4], { ...still, strokeColor: C.ink, strokeWidth: 2.75 });
  seg(b, () => [-1.5, 4], () => [2, 4], C.teal, 1.5, 2);
  note(b, () => [-1.4, 4.15], () => "L = 4", C.teal);
  mk(b, "point", [2, 4], { ...still, name: "", withLabel: false, size: 5, fillColor: "#fff", strokeColor: C.ink, strokeWidth: 2 });
  ([[-1, C.blue], [1, C.orange]] as const).forEach(([s, color]) => {
    const x = (): Vec => [2 + s * d(), f(2 + s * d())];
    seg(b, x, () => [-1.5, x()[1]], color, 1.25, 2);
    seg(b, x, () => [x()[0], 0], color, 1.25, 2);
    dot(b, x, color, 5);
  });
};
function LimitSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [e, setE] = useShrink(step);
  const dl = 10 ** e;
  const dec = Math.min(6, Math.max(2, Math.ceil(-e) + 2));
  const g = (x: number) => ((x * x - 4) / (x - 2)).toFixed(dec).replace(".", ",");
  const xl = 2 - dl, xr = 2 + dl;
  return (
    <Frame
      innerRef={ref}
      eyebrow="01 · Limit"
      title="Mendekati, bukan sampai"
      copy={<>
        <p className="ds-math">{tex(String.raw`f(x)=\dfrac{x^{2}-4}{x-2}`)}</p>
        <p>Limit bertanya: f(x) <b>menuju</b> ke mana saat x mendekati 2, bukan berapa f(2).</p>
        <p className="fragment">Dari <b style={{ color: C.blue }}>kiri</b> dan <b style={{ color: C.orange }}>kanan</b>, x makin dekat ke 2.</p>
        <p className="fragment">Nilai f(x) ikut merapat ke satu angka.</p>
        <p className="fragment">Keduanya menuju <b>4</b>, padahal f(2) tak terdefinisi (lingkaran kosong). Maka {tex(String.raw`\lim_{x\to2}f(x)=4`)}.</p>
      </>}
      stage={<>
        <SimBoard bbox={LIM} params={{ e }} build={buildLim} />
        <div className="ds-controls ds-controls--one">
          <Range label={tex(String.raw`\delta=|x-2|`)} value={e} min={-3} max={0.3} step={0.05} onChange={setE} color={C.ink} shown={fmt(dl, dec > 3 ? 3 : 2)} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.blue }}>x = {fmt(xl, dec)} → f(x) = {g(xl)}</span><br />
          <span style={{ color: C.orange }}>x = {fmt(xr, dec)} → f(x) = {g(xr)}</span>
        </div>
      </>}
    />
  );
}

/* ═════════ 2 · Limit: permainan ε–δ ═════════ */
const EPS: BBox = [-1, 8, 5, -1];
const EF = (x: number) => 0.5 * x * x + 1;
const EA = 2, EL = 3; // lim x→2 f(x) = 3
const maxDev = (del: number) => {
  let m = 0;
  for (let i = 0; i <= 200; i++) m = Math.max(m, Math.abs(EF(EA - del + (2 * del * i) / 200) - EL));
  return m;
};
const buildEps: Build<{ eps: number; del: number }> = (b, g) => {
  const big = 60;
  shape(b, () => [[-big, EL - g().eps], [big, EL - g().eps], [big, EL + g().eps], [-big, EL + g().eps]],
    { strokeColor: C.teal, strokeWidth: 1.5, dash: 2, fillColor: C.teal, fillOpacity: 0.14 });
  shape(b, () => [[EA - g().del, -big], [EA + g().del, -big], [EA + g().del, big], [EA - g().del, big]],
    { strokeColor: C.orange, strokeWidth: 1.5, dash: 2, fillColor: C.orange, fillOpacity: 0.12 });
  mk(b, "functiongraph", [EF, -1, 5], { ...still, strokeColor: C.ink, strokeWidth: 2.5 });
  mk(b, "functiongraph", [EF, () => EA - g().del, () => EA + g().del], { ...still, strokeColor: C.orange, strokeWidth: 5 });
  dot(b, () => [EA, EL], C.teal, 5);
};
function EpsilonSlide() {
  const [eps, setEps] = useState(1);
  const [del, setDel] = useState(0.8);
  const dev = maxDev(del);
  const ok = dev <= eps;
  const best = () => {
    let lo = 0, hi = 3;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (maxDev(mid) <= eps) lo = mid; else hi = mid; }
    setDel(Math.max(0.02, Math.min(2, lo)));
  };
  return (
    <Frame
      eyebrow="02 · Limit (ε–δ)"
      title="Tantangan ε–δ"
      copy={<>
        <p>Penantang memilih <b style={{ color: C.teal }}>pita ε</b> setipis apa pun. Tugas Anda: pilih <b style={{ color: C.orange }}>jendela δ</b> sehingga grafik di dalam jendela tidak keluar pita.</p>
        <p className="ds-math">{tex(String.raw`0<|x-a|<\delta\ \Rightarrow\ |f(x)-L|<\varepsilon`)}</p>
        <p className="fragment">Persempit ε. Selalu ada δ yang cukup kecil? Itulah arti limit ada.</p>
      </>}
      stage={<>
        <SimBoard bbox={EPS} params={{ eps, del }} build={buildEps} />
        <div className="ds-controls">
          <Range label={tex(String.raw`\varepsilon`)} value={eps} min={0.1} max={3} step={0.1} onChange={setEps} color={C.teal} />
          <Range label={tex(String.raw`\delta`)} value={del} min={0.02} max={2} step={0.02} onChange={setDel} color={C.orange} shown={fmt(del)} />
        </div>
        <div className="ds-read">
          <span className={ok ? "ds-ok" : "ds-bad"}>{ok ? "✓ δ cukup: seluruh grafik di dalam pita" : "✗ ada bagian grafik keluar pita, kecilkan δ"}</span>{" "}
          <Btn onClick={best}>δ terbesar yang lolos</Btn>
        </div>
      </>}
    />
  );
}

/* ═════════ 3 · Turunan: garis potong → garis singgung ═════════ */
const SB: BBox = [-4, 5, 4, -3];
type SP = { fn: FnKey; x0: number; e: number };
const buildSec: Build<SP> = (b, g) => {
  const F = () => FNS[g().fn];
  const h = () => 10 ** g().e;
  const P = (): Vec => [g().x0, F().f(g().x0)];
  const Qp = (): Vec => [g().x0 + h(), F().f(g().x0 + h())];
  mk(b, "functiongraph", [(x: number) => F().f(x), -4, 4], { ...still, strokeColor: C.ink, strokeWidth: 2.75 });
  mk(b, "line", [() => P()[1] - F().d(g().x0) * g().x0, () => F().d(g().x0), () => -1], { ...still, strokeColor: C.soft, strokeWidth: 1.75, dash: 2 });
  const p = dot(b, P, C.ink, 5, "P");
  const q = dot(b, Qp, C.orange, 5, "Q");
  mk(b, "line", [p, q], { ...still, strokeColor: C.orange, strokeWidth: 2.5 });
};
function SecantSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [fn, setFn] = useState<FnKey>("quad");
  const [x0, setX0] = useState(1);
  const [e, setE] = useShrink(step);
  const h = 10 ** e, F = FNS[fn];
  const msec = (F.f(x0 + h) - F.f(x0)) / h, mtan = F.d(x0);
  return (
    <Frame
      innerRef={ref}
      eyebrow="03 · Turunan"
      title="Dari garis potong ke garis singgung"
      copy={<>
        <p>Kemiringan garis <b style={{ color: C.orange }}>P–Q</b> adalah laju perubahan rata-rata:</p>
        <p className="ds-math">{tex(String.raw`m_{PQ}=\dfrac{f(x+h)-f(x)}{h}`)}</p>
        <p className="fragment">Biarkan Q merapat ke P: h mengecil.</p>
        <p className="fragment">Garis potong hampir menimpa garis singgung (putus-putus).</p>
        <p className="fragment">Nilai batasnya adalah <b>turunan</b>: {tex(String.raw`f'(x)=\lim_{h\to0}\dfrac{f(x+h)-f(x)}{h}`)}</p>
      </>}
      stage={<>
        <SimBoard bbox={SB} params={{ fn, x0, e }} build={buildSec} />
        <Chips value={fn} onPick={setFn} items={fnItems(["quad", "cubic", "sin"])} />
        <div className="ds-controls">
          <Range label={tex("x")} value={x0} min={-2} max={2} step={0.1} onChange={setX0} color={C.ink} />
          <Range label={tex("h")} value={e} min={-3} max={0.3} step={0.05} onChange={setE} color={C.orange} shown={fmt(h, h < 0.01 ? 3 : 2)} />
        </div>
        <div className="ds-read">
          <span style={{ color: C.orange }}>m<sub>PQ</sub> = {fmt(msec, 4)}</span> · f′(x) = {fmt(mtan, 4)} · selisih {fmt(Math.abs(msec - mtan), 4)}
        </div>
      </>}
    />
  );
}

/* ═════════ 4 · Fungsi turunan: kemiringan menjadi grafik ═════════ */
const DB: BBox = [-3.2, 4.6, 3.2, -2.6];
const buildDer: Build<{ fn: FnKey; x: number }> = (b, g) => {
  const F = () => FNS[g().fn];
  const y = () => F().f(g().x), m = () => F().d(g().x);
  mk(b, "functiongraph", [(x: number) => F().d(x), -3.2, 3.2], { ...still, strokeColor: C.violet, strokeOpacity: 0.25, strokeWidth: 1.5, dash: 2 });
  mk(b, "functiongraph", [(x: number) => F().f(x), -3.2, 3.2], { ...still, strokeColor: C.ink, strokeWidth: 2.75 });
  mk(b, "functiongraph", [(x: number) => F().d(x), -3.2, () => g().x], { ...still, strokeColor: C.violet, strokeWidth: 3 });
  const tan = (ok: (m: number) => boolean, color: string) =>
    seg(b, () => (ok(m()) ? [g().x - 0.9, y() - 0.9 * m()] : OFF), () => (ok(m()) ? [g().x + 0.9, y() + 0.9 * m()] : OFF), color, 3.5);
  tan((v) => v > 0.04, C.green); tan((v) => v < -0.04, C.red); tan((v) => Math.abs(v) <= 0.04, C.mute);
  seg(b, () => [g().x, y()], () => [g().x, m()], C.soft, 1.25, 2);
  dot(b, () => [g().x, y()], C.ink, 5);
  dot(b, () => [g().x, m()], C.violet, 5);
};
function DerivativeSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const [fn, setFn] = useState<FnKey>("cubic");
  const [x, setX] = useState(-2.2);
  const [play, setPlay] = useState(false);
  const xr = useRef(x);
  useEffect(() => { if (step >= 1) { xr.current = -2.2; setX(-2.2); setPlay(true); } else setPlay(false); }, [step]);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      xr.current = Math.min(2.2, xr.current + ((now - last) / 1000) * 0.65);
      last = now;
      setX(xr.current);
      if (xr.current >= 2.2) { setPlay(false); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const m = FNS[fn].d(x);
  const state = Math.abs(m) <= 0.04 ? ["datar: titik stasioner", C.mute] : m > 0 ? ["fungsi naik", C.green] : ["fungsi turun", C.red];
  return (
    <Frame
      innerRef={ref}
      eyebrow="04 · Fungsi turunan"
      title="Kemiringan menjadi grafik"
      copy={<>
        <p>Di setiap x, tinggi kurva <b style={{ color: C.violet }}>ungu</b> adalah kemiringan kurva <b>hitam</b> di x yang sama.</p>
        <p className="fragment">Tekan →: titik meluncur dan jejak f′ tergambar.</p>
        <p className="fragment">Saat garis singgung <b>datar</b>, kurva ungu memotong sumbu x. Di situlah puncak dan lembah.</p>
        <p className="fragment">Hijau = naik (f′ &gt; 0), merah = turun (f′ &lt; 0).</p>
      </>}
      stage={<>
        <SimBoard bbox={DB} params={{ fn, x }} build={buildDer} />
        <Chips value={fn} onPick={(k) => { setFn(k); }} items={fnItems(["cubic", "sin"])} />
        <div className="ds-controls">
          <Range label={tex("x")} value={x} min={-2.2} max={2.2} step={0.05} onChange={(v) => { setPlay(false); xr.current = v; setX(v); }} color={C.ink} />
          <div style={{ alignSelf: "end" }}><Btn onClick={() => { xr.current = -2.2; setX(-2.2); setPlay(true); }}>Putar ulang</Btn></div>
        </div>
        <div className="ds-read">f′({fmt(x, 2)}) = {fmt(m, 2)} · <span style={{ color: state[1] }}>{state[0]}</span></div>
      </>}
    />
  );
}

/* ═════════ 5 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan"
      title="Dua definisi, satu ide"
      copy={<>
        <p>Limit: nilai yang <b>didekati</b>. Turunan: limit dari laju perubahan rata-rata.</p>
        <p className="fragment">Kini keduanya bukan lagi rumus asing, tetapi sesuatu yang pernah Anda <b>gerakkan sendiri</b>.</p>
      </>}
      stage={<div className="ds-read ds-math" style={{ maxWidth: 560, display: "grid", gap: 18 }}>
        {tex(String.raw`\lim_{x\to a}f(x)=L`)}
        {tex(String.raw`f'(x)=\lim_{h\to0}\dfrac{f(x+h)-f(x)}{h}`)}
      </div>}
    />
  );
}

export function CalculusDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <LimitSlide />
      <EpsilonSlide />
      <SecantSlide />
      <DerivativeSlide />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default CalculusDeck;
