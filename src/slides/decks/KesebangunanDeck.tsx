/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, type ReactNode } from "react";
import {
  C, fmt, Frame, note, rad, rot, shape, SimBoard, SlideDeck, useStep,
  type BBox, type Build, type Vec,
} from "../common/core";
import { n, Quiz, tex } from "../common/LinearKit";
import {
  angAt, arcAt, deg, dist, lerp, marks, MARK_SPEC, mv, names, same, SceneEx, SceneLab, sqMark, tri, unitv,
  type Geo, type Spec,
} from "../common/SceneKit";
import { QUIZ } from "./quizzes/KesebangunanQuiz";

/* Slide "Kesebangunan dan kekongruenan": prasyarat (bangun datar, perbandingan dan skala, sudut dan garis,
   Pythagoras) → kekongruenan → kesebangunan → penerapan → rangkuman → latihan → kuis. */

const raw = String.raw;

const Tbl = (p: { head?: ReactNode[]; rows: ReactNode[][] }) => (
  <table className="ds-table">
    {p.head && <thead><tr>{p.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>}
    <tbody>{p.rows.map((r, i) => <tr key={i}><th>{r[0]}</th>{r.slice(1).map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
  </table>
);
const ck = (v: boolean, t: ReactNode) => <span className={v ? "ds-ok" : "ds-bad"}>{v ? "✓" : "✗"} {t}</span>;
const NAMES3 = ["A", "B", "C"];
const NAMES3P = ["P", "Q", "R"];

/* ═════════ 0 · Sampul ═════════ */
const COVER: BBox = [-1, 9, 19, -1.6];
const buildCover: Build<object> = (b, _g, _s, clock) => {
  const T: Vec[] = [[0, 0], [4, 0], [0, 3]];
  const at = (o: Vec, k = 1): Vec[] => T.map((p) => [o[0] + k * p[0], o[1] + k * p[1]]);
  const kk = () => 1.45 + 0.5 * Math.sin(1.1 * clock());
  shape(b, () => at([0, 1]), { strokeColor: C.ink, strokeWidth: 3, fillColor: C.ink, fillOpacity: 0.07 });
  shape(b, () => at([6, 1]).map((p) => rot(p, [6 + 4 / 3, 2], 45 * clock())), { strokeColor: C.teal, strokeWidth: 3, fillColor: C.teal, fillOpacity: 0.1 });
  shape(b, () => at([11, 1], kk()), { strokeColor: C.orange, strokeWidth: 3, fillColor: C.orange, fillOpacity: 0.1 });
  note(b, () => [0, -1.4], () => "bangun asal", C.ink);
  note(b, () => [5, -1.4], () => "kongruen: ukuran sama", C.teal);
  note(b, () => [11, -1.4], () => `sebangun: skala ${fmt(kk(), 2)}`, C.orange);
};
function CoverSlide() {
  return (
    <Frame
      eyebrow="Pembelajaran berbasis simulasi · Kelas IX"
      title="Kesebangunan dan kekongruenan"
      copy={<>
        <p>Dua bangun bisa <b>sama persis</b> atau hanya <b>sama bentuk</b>. Perbedaan kecil ini dipakai untuk mengukur tinggi pohon tanpa memanjatnya.</p>
        <p className="ds-muted">Segitiga tosca hanya diputar, jadi tetap kongruen. Segitiga oranye diperbesar dan diperkecil, jadi sebangun.</p>
      </>}
      stage={<SimBoard bbox={COVER} params={{}} build={buildCover} loop />}
    />
  );
}

/* ═════════ 1 · Peta materi ═════════ */
function MapSlide() {
  return (
    <Frame
      eyebrow="Peta materi"
      title="Dari prasyarat sampai penerapan"
      copy={<>
        <p>Dua gagasan, satu pertanyaan: <b>seberapa mirip dua bangun?</b></p>
        <p className="fragment"><b>Kongruen</b> (≅): bentuk dan ukuran sama.</p>
        <p className="fragment"><b>Sebangun</b> (∼): bentuk sama, ukuran boleh beda.</p>
        <p className="fragment">Kongruen adalah sebangun dengan <b>skala 1</b>.</p>
      </>}
      stage={<Tbl rows={[
        ["P", "Sifat bangun datar, perbandingan dan skala, sudut dan garis, Pythagoras"],
        ["01", "Kekongruenan bangun datar"], ["02", "Kekongruenan dua segitiga: SSS, SAS, ASA"],
        ["03", "Kesebangunan bangun datar"], ["04", "Kesebangunan segitiga: AA, SSS, SAS"],
        ["05", "Kesebangunan pada segitiga siku-siku"], ["06", "Penerapan: bayangan, sungai, cermin"],
      ]} />}
    />
  );
}

/* ═════════ 2 · Prasyarat: segiempat ═════════ */
type Quad = { name: string; pts: Vec[]; props: string[] };
const QUADS: Quad[] = [
  { name: "Persegi", pts: [[0, 0], [4, 0], [4, 4], [0, 4]], props: ["4 sisi sama panjang", "4 sudut siku-siku (90°)", "diagonal sama panjang, tegak lurus, saling membagi dua"] },
  { name: "Persegi panjang", pts: [[0, 0], [6, 0], [6, 4], [0, 4]], props: ["sisi berhadapan sama panjang dan sejajar", "4 sudut siku-siku", "diagonal sama panjang, saling membagi dua"] },
  { name: "Jajargenjang", pts: [[0, 0], [5, 0], [6.5, 3.5], [1.5, 3.5]], props: ["sisi berhadapan sama panjang dan sejajar", "sudut berhadapan sama besar", "diagonal saling membagi dua (tidak sama panjang)"] },
  { name: "Belah ketupat", pts: [[3, 0], [6, 2.5], [3, 5], [0, 2.5]], props: ["4 sisi sama panjang", "sudut berhadapan sama besar", "diagonal tegak lurus, saling membagi dua"] },
  { name: "Layang-layang", pts: [[3, 0], [5, 2], [3, 6], [1, 2]], props: ["dua pasang sisi berdekatan sama panjang", "sepasang sudut berhadapan sama besar", "diagonal saling tegak lurus"] },
  { name: "Trapesium sama kaki", pts: [[0, 0], [6, 0], [5, 3.5], [1, 3.5]], props: ["sepasang sisi sejajar", "kaki sama panjang, sudut alas sama besar", "diagonal sama panjang"] },
];
const BQ: BBox = [-1, 7, 8, -1.5];
const QUAD_SPEC: Spec = {
  polys: [[C.ink, 0.07, 0, 3]],
  segs: [[C.soft, 1.75, 3], [C.soft, 1.75, 3]],
  dots: [[C.ink, 4], [C.ink, 4], [C.ink, 4], [C.ink, 4]],
  txts: [C.ink, C.ink, C.ink, C.ink],
};
function QuadSlide() {
  return (
    <SceneLab
      eyebrow="Prasyarat · Sifat bangun datar" title="Segiempat dan sifatnya"
      copy={<>
        <p>Pilih satu bangun, lalu amati <b>sisi</b>, <b>sudut</b>, dan <b>diagonal</b> (garis putus-putus).</p>
        <p>Jumlah sudut dalam segiempat selalu <b>360°</b>.</p>
        <p className="ds-muted">Sifat-sifat inilah yang nanti dipakai untuk menyatakan dua bangun kongruen atau sebangun.</p>
      </>}
      bbox={BQ} spec={QUAD_SPEC} init={[]} sl={[]}
      chips={{ init: 0, items: QUADS.map((q, i) => ({ v: i, label: q.name })) }}
      geo={(_s, c) => {
        const q = QUADS[c].pts;
        return { polys: [q], segs: [[q[0], q[2]], [q[1], q[3]]], dots: q, txts: names(q, ["A", "B", "C", "D"]) };
      }}
      read={(_s, c) => <>{QUADS[c].props.map((t, i) => <div key={i}>• {t}</div>)}</>}
      maxH={330}
    />
  );
}

/* ═════════ 3 · Prasyarat: segitiga ═════════ */
const BT: BBox = [-5, 9, 9.5, -1.5];
const TRI_SPEC: Spec = {
  polys: [[C.ink, 0.07, 0, 3]],
  arcs: [[C.blue, 3], [C.orange, 3], [C.violet, 3]],
  txts: [C.blue, C.orange, C.violet, C.ink, C.ink, C.ink],
};
function TriangleSlide() {
  return (
    <SceneLab
      eyebrow="Prasyarat · Sifat bangun datar" title="Jumlah sudut segitiga"
      copy={<>
        <p>Geser <b style={{ color: C.blue }}>∠A</b> dan <b style={{ color: C.orange }}>∠B</b>. Sudut ketiga menyesuaikan diri.</p>
        <p>Jumlah ketiga sudut selalu <b>180°</b>, apa pun bentuk segitiganya.</p>
        <p className="fragment">Karena itu, bila <b>dua sudut</b> diketahui, sudut ketiga ikut pasti. Ingat ini untuk kesebangunan.</p>
      </>}
      bbox={BT} spec={TRI_SPEC} init={[50, 60]}
      sl={[
        { label: tex("\\angle A"), min: 20, max: 120, step: 5, color: C.blue, shown: (v) => `${fmt(v, 0)}°` },
        { label: tex("\\angle B"), min: 20, max: 120, step: 5, color: C.orange, shown: (v) => `${fmt(v, 0)}°` },
      ]}
      geo={(s) => {
        const [al, be] = s, ga = 180 - al - be;
        if (ga < 10) return {};
        const c = 8 * Math.sin(rad(ga)), b = 8 * Math.sin(rad(be));
        const A: Vec = [0, 0], B: Vec = [c, 0], Cc: Vec = [b * Math.cos(rad(al)), b * Math.sin(rad(al))];
        const T = [A, B, Cc];
        const lab = (i: number, v: number) => {
          const V = T[i], u1 = unitv(V, T[(i + 1) % 3]), u2 = unitv(V, T[(i + 2) % 3]);
          const m: Vec = [u1[0] + u2[0], u1[1] + u2[1]], l = Math.hypot(m[0], m[1]) || 1;
          return { at: [V[0] + (m[0] / l) * 1.8 - 0.5, V[1] + (m[1] / l) * 1.8 - 0.2] as Vec, t: `${fmt(v, 0)}°` };
        };
        return {
          polys: [T],
          arcs: [arcAt(A, B, Cc, 1.1), arcAt(B, Cc, A, 1.1), arcAt(Cc, A, B, 1.1)],
          txts: [lab(0, al), lab(1, be), lab(2, ga), ...names(T, NAMES3)],
        };
      }}
      read={(s) => {
        const [al, be] = s, ga = 180 - al - be;
        if (ga < 10) return <span className="ds-bad">∠A + ∠B harus kurang dari 170°.</span>;
        const a = [al, be, ga];
        const jenis = a.some((x) => x > 90) ? "tumpul" : a.some((x) => x === 90) ? "siku-siku" : "lancip";
        const sisi = al === be && be === ga ? "sama sisi" : al === be || be === ga || al === ga ? "sama kaki" : "sembarang";
        return <>{al}° + {be}° + {ga}° = <b>180°</b><br />segitiga {jenis}, {sisi}</>;
      }}
      maxH={360}
    />
  );
}

/* ═════════ 4 · Prasyarat: perbandingan ═════════ */
const BR: BBox = [-2, 13, 10, -1.4];
const RATIO_SPEC: Spec = {
  polys: [[C.soft, 0, 3, 2], [C.blue, 0.12, 0, 3]],
  txts: [C.blue, C.blue],
};
function RatioSlide() {
  return (
    <SceneLab
      eyebrow="Prasyarat · Perbandingan" title="Perbandingan senilai"
      copy={<>
        <p>Persegi panjang kecil (putus-putus) berukuran <b>2 × 3</b>. Geser pengali <b>k</b> untuk membesarkannya.</p>
        <p>Lebar dan tinggi sama-sama dikali k, sehingga perbandingannya <b>tidak berubah</b>.</p>
        <p className="ds-math">{tex(raw`\dfrac{\text{tinggi}}{\text{lebar}}=\dfrac{3k}{2k}=\dfrac32`)}</p>
        <p className="ds-muted">Perbandingan yang tetap inilah ciri dua bangun yang sebangun.</p>
      </>}
      bbox={BR} spec={RATIO_SPEC} init={[2]}
      sl={[{ label: tex("k"), min: 1, max: 4, step: 0.5, color: C.blue }]}
      geo={(s) => {
        const k = s[0], w = 2 * k, h = 3 * k;
        return {
          polys: [[[0, 0], [2, 0], [2, 3], [0, 3]], [[0, 0], [w, 0], [w, h], [0, h]]],
          txts: [{ at: [w / 2 - 0.6, -1.1], t: `${n(w)}` }, { at: [-1.2, h / 2 - 0.2], t: `${n(h)}` }],
        };
      }}
      read={(s) => <>lebar : tinggi = {n(2 * s[0])} : {n(3 * s[0])} = <b>2 : 3</b><br />tinggi ÷ lebar = {n(3 * s[0])} ÷ {n(2 * s[0])} = 1,5</>}
      maxH={370}
    />
  );
}

/* ═════════ 5 · Prasyarat: skala ═════════ */
const BS: BBox = [-2.4, 13, 22, -2.4];
const SKALA_SPEC: Spec = { polys: [[C.teal, 0.12, 0, 3]], txts: [C.teal, C.teal] };
function ScaleSlide() {
  return (
    <SceneLab
      eyebrow="Prasyarat · Skala" title="Denah dan ruang sebenarnya"
      copy={<>
        <p>Ruangan berukuran <b>10 m × 6 m</b>. Pilih skala untuk menggambar denahnya (ukuran gambar dalam cm).</p>
        <p className="ds-math">{tex(raw`\text{skala}=\dfrac{\text{ukuran pada gambar}}{\text{ukuran sebenarnya}}`)}</p>
        <p className="ds-muted">Kedua ukuran harus berada dalam satuan yang sama. Denah dan ruangan aslinya adalah dua bangun yang sebangun.</p>
      </>}
      bbox={BS} spec={SKALA_SPEC} init={[]} sl={[]}
      chips={{ init: 100, items: [50, 100, 200, 250].map((v) => ({ v, label: `1 : ${v}` })) }}
      geo={(_s, c) => {
        const w = 1000 / c, h = 600 / c;
        return {
          polys: [[[0, 0], [w, 0], [w, h], [0, h]]],
          txts: [{ at: [w / 2 - 1, -1.8], t: `${n(w)} cm` }, { at: [-2.2, h / 2 - 0.2], t: `${n(h)} cm` }],
        };
      }}
      read={(_s, c) => <>
        10 m = 1.000 cm → 1.000 ÷ {c} = <b>{n(1000 / c)} cm</b><br />
        6 m = 600 cm → 600 ÷ {c} = <b>{n(600 / c)} cm</b><br />
        1 cm di gambar mewakili {c} cm = {n(c / 100)} m
      </>}
      maxH={360}
    />
  );
}

/* ═════════ 6 · Prasyarat: sudut dan garis ═════════ */
const BA: BBox = [-9, 7, 9, -3];
const ANG_SPEC: Spec = {
  segs: [[C.ink, 2.5, 0], [C.ink, 2.5, 0], [C.violet, 2.5, 0]],
  arcs: [[C.blue, 3.5], [C.orange, 3.5]],
  dots: [[C.ink, 4], [C.ink, 4]],
  txts: [C.blue, C.orange, C.ink, C.ink],
};
function AnglesSlide() {
  return (
    <SceneLab
      eyebrow="Prasyarat · Sudut dan garis" title="Dua garis sejajar dipotong garis lain"
      copy={<>
        <p>Garis <b>g</b> ∥ <b>h</b> dipotong garis ungu. Ubah sudutnya, lalu pilih pasangan sudut.</p>
        <p><b>Sehadap</b> dan <b>berseberangan dalam</b>: sama besar.</p>
        <p><b>Sepihak dalam</b>: jumlahnya 180°.</p>
        <p className="ds-muted">Dua sudut bertolak belakang selalu sama besar; sudut berpelurus berjumlah 180°.</p>
      </>}
      bbox={BA} spec={ANG_SPEC} init={[60]}
      sl={[{ label: tex(raw`\theta`), min: 30, max: 150, step: 5, color: C.blue, shown: (v) => `${fmt(v, 0)}°` }]}
      chips={{ init: 0, items: [{ v: 0, label: "Sehadap" }, { v: 1, label: "Berseberangan dalam" }, { v: 2, label: "Sepihak dalam" }] }}
      geo={(s, c) => {
        const th = s[0], u: Vec = [Math.cos(rad(th)), Math.sin(rad(th))];
        const P: Vec = [0, 0], Q: Vec = [(4 * u[0]) / u[1], 4];
        const q: [number, number] = c === 0 ? [0, th] : c === 1 ? [180, 180 + th] : [180 + th, 360];
        const vq = c === 2 ? 180 - th : th;
        const tx = (V: Vec, a: [number, number], v: number) => {
          const m = rad((a[0] + a[1]) / 2);
          return { at: [V[0] + 2.1 * Math.cos(m) - 0.4, V[1] + 2.1 * Math.sin(m) - 0.2] as Vec, t: `${fmt(v, 0)}°` };
        };
        return {
          segs: [[[-9, 0], [9, 0]], [[-9, 4], [9, 4]], [[P[0] - 2 * u[0], P[1] - 2 * u[1]], [Q[0] + 2 * u[0], Q[1] + 2 * u[1]]]],
          arcs: [{ c: P, r: 1.2, a0: 0, a1: th }, { c: Q, r: 1.2, a0: q[0], a1: q[1] }],
          dots: [P, Q],
          txts: [tx(P, [0, th], th), tx(Q, q, vq), { at: [-8.7, 0.25], t: "g" }, { at: [-8.7, 4.25], t: "h" }],
        };
      }}
      read={(s, c) => c === 2
        ? <>{s[0]}° + {180 - s[0]}° = <b>180°</b> (berpelurus)</>
        : <>{s[0]}° = {s[0]}° <b>(sama besar)</b></>}
      maxH={330}
    />
  );
}

/* ═════════ 7 · Prasyarat: Pythagoras ═════════ */
const BP: BBox = [-11, 21, 21, -11];
const PYT_SPEC: Spec = {
  polys: [[C.ink, 0.1, 0, 3], [C.blue, 0.18, 0, 2.5], [C.orange, 0.18, 0, 2.5], [C.teal, 0.18, 0, 2.5], [C.ink, 0, 0, 1.75]],
  txts: [C.blue, C.orange, C.teal],
};
function PythagorasSlide() {
  return (
    <SceneLab
      eyebrow="Prasyarat · Teorema Pythagoras" title="Tiga persegi, satu aturan"
      copy={<>
        <p>Pada segitiga siku-siku, luas persegi pada <b>sisi miring</b> sama dengan jumlah luas persegi pada dua sisi siku-siku.</p>
        <p className="ds-math">{tex(raw`a^2+b^2=c^2`)}</p>
        <p className="ds-muted">Geser a dan b. Coba a = 3, b = 4, lalu a = 6, b = 8.</p>
      </>}
      bbox={BP} spec={PYT_SPEC} init={[3, 4]}
      sl={[{ label: tex("a"), min: 1, max: 10, step: 1, color: C.blue }, { label: tex("b"), min: 1, max: 10, step: 1, color: C.orange }]}
      geo={(s) => {
        const a = s[0], b = s[1];
        const Cc: Vec = [0, 0], B: Vec = [a, 0], A: Vec = [0, b];
        const m = Math.min(a, b) * 0.3 + 0.2;
        return {
          polys: [[Cc, B, A], [[0, 0], [a, 0], [a, -a], [0, -a]], [[0, 0], [0, b], [-b, b], [-b, 0]], [B, A, [b, a + b], [a + b, a]], sqMark(Cc, [1, 0], [0, 1], m)],
          txts: [
            { at: [a / 2 - 0.9, -a / 2 - 0.3], t: `a² = ${a * a}` },
            { at: [-b / 2 - 0.9, b / 2 - 0.3], t: `b² = ${b * b}` },
            { at: [(a + b) / 2 - 0.9, (a + b) / 2 - 0.3], t: `c² = ${a * a + b * b}` },
          ],
        };
      }}
      read={(s) => {
        const c2 = s[0] * s[0] + s[1] * s[1], c = Math.sqrt(c2);
        return <>{s[0] ** 2} + {s[1] ** 2} = {c2} = c²<br />c = √{c2} = {fmt(c, 2)}{Number.isInteger(c) && <b className="ds-ok"> · tripel Pythagoras</b>}</>;
      }}
      maxH={400}
    />
  );
}

/* ═════════ 8 · Prasyarat: tripel dan kebalikan ═════════ */
function TripleSlide() {
  return (
    <Frame
      eyebrow="Prasyarat · Teorema Pythagoras" title="Kebalikan Pythagoras"
      copy={<>
        <p>Misalkan c adalah <b>sisi terpanjang</b>. Bandingkan c² dengan a² + b².</p>
        <p className="fragment">c² = a² + b² → siku-siku.</p>
        <p className="fragment">c² &lt; a² + b² → lancip.</p>
        <p className="fragment">c² &gt; a² + b² → tumpul.</p>
      </>}
      stage={<Tbl head={["Sisi", "a² + b²", "c²", "Jenis"]} rows={[
        ["3, 4, 5", "25", "25", "siku-siku"], ["5, 12, 13", "169", "169", "siku-siku"],
        ["8, 15, 17", "289", "289", "siku-siku"], ["6, 8, 10 (3, 4, 5 dikali 2)", "100", "100", "siku-siku"],
        ["4, 5, 6", "41", "36", "lancip"], ["5, 6, 10", "61", "100", "tumpul"],
      ]} />}
    />
  );
}

/* ═════════ 9 · Kekongruenan: apa itu? ═════════ */
const T0: Vec[] = [[0, 0], [4, 0], [0, 3]];
const MOVE: ((p: Vec, t: number) => Vec)[] = [
  (p, t) => [p[0] + 8 * t, p[1]],
  (p, t) => rot(p, [5, 1], 180 * t),
  (p, t) => [6 + (p[0] - 6) * (1 - 2 * t), p[1]],
  (p, t) => { const k = 1 + 0.75 * t; return [6 * t + k * p[0], k * p[1]]; },
];
const BC1: BBox = [-2, 8, 14, -3];
const CONG_SPEC: Spec = {
  polys: [[C.ink, 0.08, 0, 3], [C.orange, 0.12, 0, 3]],
  segs: [[C.soft, 1.75, 3]],
  dots: [[C.violet, 5]],
  txts: [C.ink, C.ink, C.ink, C.orange, C.orange, C.orange],
};
function CongruentSlide() {
  return (
    <SceneLab
      eyebrow="01 · Kekongruenan bangun datar" title="Sama persis"
      copy={<>
        <p>Dua bangun <b>kongruen</b> bila bentuk dan ukurannya sama, sehingga satu bisa menimpa yang lain.</p>
        <p>Pilih gerakan, lalu geser <b>t</b>. Geser, putar, dan cermin <b>tidak mengubah ukuran</b>.</p>
        <p className="ds-muted">Coba juga “perbesar”: ukurannya berubah, jadi tidak kongruen.</p>
      </>}
      bbox={BC1} spec={CONG_SPEC} init={[1]}
      sl={[{ label: tex("t"), min: 0, max: 1, step: 0.05, color: C.orange }]}
      chips={{ init: 0, items: [{ v: 0, label: "Geser" }, { v: 1, label: "Putar" }, { v: 2, label: "Cermin" }, { v: 3, label: "Perbesar" }] }}
      geo={(s, c) => {
        const t = s[0], T1 = T0.map((p) => MOVE[c](p, t));
        return {
          polys: [T0, T1],
          segs: c === 2 ? [[[6, -2], [6, 7]]] : [],
          dots: c === 1 ? [[5, 1]] : [],
          txts: [...names(T0, NAMES3), ...names(T1, ["A′", "B′", "C′"])],
        };
      }}
      read={(s, c) => {
        const T1 = T0.map((p) => MOVE[c](p, s[0]));
        const nm = ["AB", "BC", "CA"];
        const L0 = [0, 1, 2].map((i) => dist(T0[i], T0[(i + 1) % 3])), L1 = [0, 1, 2].map((i) => dist(T1[i], T1[(i + 1) % 3]));
        const all = L0.every((v, i) => same(v, L1[i]));
        return <>
          {nm.map((m, i) => <div key={m}>{m} = {n(L0[i])} · {m[0]}′{m[1]}′ = {n(L1[i])} {ck(same(L0[i], L1[i]), "")}</div>)}
          {all ? <b className="ds-ok">Sisi dan sudut bersesuaian sama → kongruen.</b>
            : c === 2 ? <span>Sedang dibalik. Lihat hasil akhir pada t = 1.</span>
            : <b className="ds-bad">Bentuk sama, ukuran beda → tidak kongruen (tetapi sebangun).</b>}
        </>;
      }}
      maxH={350}
    />
  );
}

/* ═════════ 10 · Syarat kongruen bangun datar ═════════ */
const BRH: BBox = [-1, 5.5, 17, -1.5];
const RH_SPEC: Spec = {
  polys: [[C.blue, 0.1, 0, 3], [C.orange, 0.1, 0, 3]],
  arcs: [[C.blue, 3], [C.orange, 3]],
  txts: [C.blue, C.orange],
};
function RhombusSlide() {
  return (
    <SceneLab
      eyebrow="01 · Kekongruenan bangun datar" title="Sisi sama belum cukup"
      copy={<>
        <p>Dua bangun datar kongruen bila <b>semua sisi bersesuaian sama panjang</b> dan <b>semua sudut bersesuaian sama besar</b>.</p>
        <p>Dua belah ketupat bersisi 4. Yang biru bersudut 60°. Ubah sudut yang oranye.</p>
        <p className="ds-muted">Sisinya selalu sama, tetapi bentuknya tidak selalu.</p>
      </>}
      bbox={BRH} spec={RH_SPEC} init={[90]}
      sl={[{ label: tex(raw`\theta`), min: 30, max: 150, step: 5, color: C.orange, shown: (v) => `${fmt(v, 0)}°` }]}
      geo={(s) => {
        const th = s[0], h = 4 * Math.sin(rad(60)), v: Vec = [4 * Math.cos(rad(th)), 4 * Math.sin(rad(th))];
        return {
          polys: [[[0, 0], [4, 0], [6, h], [2, h]], [[8, 0], [12, 0], [12 + v[0], v[1]], [8 + v[0], v[1]]]],
          arcs: [{ c: [0, 0], r: 1, a0: 0, a1: 60 }, { c: [8, 0], r: 1, a0: 0, a1: th }],
          txts: [{ at: [1.2, 0.35], t: "60°" }, { at: [9.2, 0.35], t: `${fmt(th, 0)}°` }],
        };
      }}
      read={(s) => {
        const okk = s[0] === 60 || s[0] === 120;
        return <>
          <div>{ck(true, "keempat sisi: 4 = 4")}</div>
          <div>{ck(okk, `sudut: 60° dan ${s[0]}°`)}</div>
          {okk ? <b className="ds-ok">Kongruen{s[0] === 120 ? " (sama, hanya diputar: sudutnya 120° dan 60°)" : ""}.</b> : <b className="ds-bad">Tidak kongruen: sisi sama, sudut berbeda.</b>}
        </>;
      }}
      maxH={300}
    />
  );
}

/* ═════════ 11 · Unsur yang bersesuaian ═════════ */
const BTP: BBox = [-1.5, 5.5, 14.5, -1.5];
const TA = tri(5, 4, 6); // ABC: AB = 6, BC = 5, CA = 4
const TP = mv(TA.map((p) => rot(p, [0, 0], 180)), [13, 4]); // PQR
const ANGS = [0, 1, 2].map((i) => angAt(TA[(i + 1) % 3], TA[i], TA[(i + 2) % 3]));
function PairSlide() {
  const mk6 = (k: number): Geo => ({
    ...marks(TA, TP, [0, 1, 2].slice(0, Math.min(k, 3)), [0, 1, 2].slice(0, Math.max(0, k - 3))),
    polys: [TA, TP], txts: [...names(TA, NAMES3), ...names(TP, NAMES3P)],
  });
  const bc = (t: string, c: string) => <b style={{ color: c }}>{t}</b>;
  return (
    <SceneEx
      eyebrow="02 · Kekongruenan segitiga" title="Pasangan yang bersesuaian"
      intro={<p>ΔABC dan ΔPQR kongruen. Pasangkan unsurnya satu per satu:</p>}
      lines={[
        <>{bc("AB = PQ", C.blue)} = 6</>, <>{bc("BC = QR", C.orange)} = 5</>, <>{bc("CA = RP", C.violet)} = 4</>,
        <>{bc("∠A = ∠P", C.teal)} = {deg(ANGS[0])}</>, <>{bc("∠B = ∠Q", C.red)} = {deg(ANGS[1])}</>, <>{bc("∠C = ∠R", C.green)} = {deg(ANGS[2])}</>,
      ]}
      bbox={BTP} spec={MARK_SPEC} geo={mk6}
      note={(k: number) => k >= 6 ? <>Ditulis <b>ΔABC ≅ ΔPQR</b>. Urutan huruf menunjukkan pasangan: A↔P, B↔Q, C↔R.</> : "Tekan → untuk menyoroti pasangan berikutnya."}
    />
  );
}

/* ═════════ 12 · Tiga syarat kongruen segitiga ═════════ */
const TA2 = tri(5, 4, 6);
const TB2 = TA2.map((p): Vec => [14 - p[0], p[1]]); // bayangan cermin x = 7
const BTC: BBox = [-1, 6, 15, -1.5];
const CASES: { s: number[]; a: number[] }[] = [
  { s: [0, 1, 2], a: [] }, { s: [0, 2], a: [0] }, { s: [0], a: [0, 1] }, { s: [1], a: [0, 1] },
];
function ThreeRulesSlide() {
  return (
    <SceneEx
      eyebrow="02 · Kekongruenan segitiga" title="Tiga unsur sudah cukup"
      intro={<p>Tidak perlu memeriksa keenam pasang unsur. Tekan → untuk melihat unsur yang disorot.</p>}
      lines={[
        <><b>SSS</b> (sisi–sisi–sisi): tiga pasang sisi bersesuaian sama panjang.</>,
        <><b>SAS</b> (sisi–sudut–sisi): dua pasang sisi sama dan <b>sudut yang diapit</b> keduanya sama.</>,
        <><b>ASA</b> (sudut–sisi–sudut): dua pasang sudut sama dan <b>sisi di antaranya</b> sama.</>,
        <><b>AAS</b> (sudut–sudut–sisi): dua sudut dan sisi yang tidak diapit. Sudut ketiga otomatis sama, jadi sama dengan ASA.</>,
      ]}
      bbox={BTC} spec={MARK_SPEC}
      geo={(k) => ({
        ...(k === 0 ? {} : marks(TA2, TB2, CASES[k - 1].s, CASES[k - 1].a)),
        polys: [TA2, TB2], txts: [...names(TA2, NAMES3), ...names(TB2, NAMES3P)],
      })}
      note="Segitiga kanan adalah bayangan cermin segitiga kiri. Kongruen tidak peduli arah."
    />
  );
}

/* ═════════ 13 · AAA tidak cukup ═════════ */
const BAAA: BBox = [-1, 6.5, 19, -1.5];
function AaaSlide() {
  return (
    <SceneLab
      eyebrow="02 · Kekongruenan segitiga" title="Tiga sudut saja tidak cukup"
      copy={<>
        <p>Kedua segitiga punya <b>tiga sudut yang sama</b>. Geser skala <b>k</b> untuk mengubah ukuran segitiga kanan.</p>
        <p>Sudutnya selalu sama, tetapi segitiganya hanya kongruen saat <b>k = 1</b>.</p>
        <p className="ds-muted">Sudut-sudut-sudut menjamin <b>bentuk</b> sama (sebangun), bukan ukuran.</p>
      </>}
      bbox={BAAA} spec={MARK_SPEC} init={[1.4]}
      sl={[{ label: tex("k"), min: 0.6, max: 1.5, step: 0.1, color: C.orange }]}
      geo={(s) => {
        const k = s[0], T = tri(5, 4, 6), T2 = T.map((p): Vec => [9 + k * p[0], k * p[1]]);
        const ar = (X: Vec[]) => [0, 1, 2].map((i) => arcAt(X[i], X[(i + 1) % 3], X[(i + 2) % 3], 0.8));
        return { polys: [T, T2], arcs: [...ar(T), ...ar(T2)], txts: [...names(T, NAMES3), ...names(T2, NAMES3P)] };
      }}
      read={(s) => <>
        sisi kiri: 6 · 5 · 4<br />sisi kanan: {n(6 * s[0])} · {n(5 * s[0])} · {n(4 * s[0])}<br />
        {same(s[0], 1) ? <b className="ds-ok">k = 1: ukurannya sama → kongruen.</b> : <b className="ds-bad">Sudut sama, ukuran beda → tidak kongruen.</b>}
      </>}
      maxH={330}
    />
  );
}

/* ═════════ 14 · SSA tidak cukup ═════════ */
const BSSA: BBox = [-1, 6, 12, -1.5];
const SSA_SPEC: Spec = {
  polys: [[C.orange, 0.12, 0, 3], [C.violet, 0.12, 0, 3]],
  segs: [[C.soft, 1.75, 3], [C.orange, 3.5, 0], [C.violet, 3.5, 0]],
  arcs: [[C.ink, 2.5]],
  dots: [[C.ink, 5], [C.ink, 5], [C.orange, 6], [C.violet, 6]],
  txts: [C.ink, C.ink, C.orange, C.violet],
};
function SsaSlide() {
  const sols = (a: number): Vec[] => {
    const Cx = 6 * Math.cos(rad(30)), out: Vec[] = [];
    if (a >= 3) {
      const d = Math.sqrt(Math.max(0, a * a - 9));
      [Cx - d, Cx + d].forEach((x) => { if (x > 1e-9 && !out.some((p) => Math.abs(p[0] - x) < 1e-9)) out.push([x, 0]); });
    }
    return out;
  };
  return (
    <SceneLab
      eyebrow="02 · Kekongruenan segitiga" title="Sisi–sisi–sudut bisa menipu"
      copy={<>
        <p>Diketahui ∠A = 30°, AC = 6, dan BC = <b>a</b> (sisi di depan ∠A). Geser a dan hitung berapa segitiga yang mungkin.</p>
        <p>Untuk a antara 3 dan 6 ada <b>dua</b> segitiga berbeda, padahal tiga unsurnya sama.</p>
        <p className="ds-muted">Karena itu SSA <b>bukan</b> syarat kongruen.</p>
      </>}
      bbox={BSSA} spec={SSA_SPEC} init={[4.5]}
      sl={[{ label: tex("a=BC"), min: 2, max: 6.5, step: 0.5, color: C.orange }]}
      geo={(s) => {
        const A: Vec = [0, 0], Cc: Vec = [6 * Math.cos(rad(30)), 3], B = sols(s[0]);
        return {
          polys: [B[0] ? [A, B[0], Cc] : null, B[1] ? [A, B[1], Cc] : null],
          segs: [[A, [11.5, 0]], B[0] ? [Cc, B[0]] : null, B[1] ? [Cc, B[1]] : null],
          arcs: [{ c: A, r: 1.2, a0: 0, a1: 30 }],
          dots: [A, Cc, B[0] ?? null, B[1] ?? null],
          txts: [{ at: [-0.6, -0.9], t: "A" }, { at: [Cc[0] - 0.2, Cc[1] + 0.3], t: "C" },
            B[0] ? { at: [B[0][0] - 0.3, -0.9], t: "B₁" } : null, B[1] ? { at: [B[1][0] - 0.3, -0.9], t: "B₂" } : null],
        };
      }}
      read={(s) => {
        const B = sols(s[0]);
        return B.length === 0 ? <span className="ds-bad">a &lt; 3: sisi BC terlalu pendek, tidak ada segitiga.</span>
          : B.length === 1 ? <>Hanya satu segitiga: AB = {n(B[0][0])}.</>
          : <>Dua segitiga: AB = <b style={{ color: C.orange }}>{n(B[0][0])}</b> atau <b style={{ color: C.violet }}>{n(B[1][0])}</b>.<br /><b className="ds-bad">Unsur sama, segitiga berbeda: tidak kongruen.</b></>;
      }}
      maxH={330}
    />
  );
}

/* ═════════ 15 · Bukti: diagonal persegi panjang ═════════ */
const BPF: BBox = [-2, 6, 8, -1.6];
const PF_SPEC: Spec = {
  polys: [[C.ink, 0.04, 0, 2.5], [C.teal, 0.18, 0, 0], [C.orange, 0.18, 0, 0]],
  segs: [[C.ink, 2, 3], [C.blue, 5, 0], [C.blue, 5, 0], [C.orange, 5, 0], [C.orange, 5, 0], [C.violet, 5, 0]],
  txts: [C.ink, C.ink, C.ink, C.ink],
};
function ProofRectSlide() {
  const R: Vec[] = [[0, 0], [6, 0], [6, 4], [0, 4]];
  const [A, B, Cc, D] = R;
  return (
    <SceneEx
      eyebrow="02 · Kekongruenan segitiga · Bukti" title="Diagonal membagi dua sama persis"
      intro={<p>Persegi panjang ABCD dengan diagonal AC. Buktikan <b>ΔABC ≅ ΔCDA</b>.</p>}
      lines={[
        <><b style={{ color: C.blue }}>AB = CD</b> (sisi persegi panjang yang berhadapan)</>,
        <><b style={{ color: C.orange }}>BC = DA</b> (sisi yang berhadapan)</>,
        <><b style={{ color: C.violet }}>AC = CA</b> (satu garis yang sama)</>,
        <>Ketiga pasang sisi sama (SSS), maka <b>ΔABC ≅ ΔCDA</b>. Diagonal membagi persegi panjang menjadi dua bagian yang sama persis.</>,
      ]}
      bbox={BPF} spec={PF_SPEC}
      geo={(k) => ({
        polys: [R, k >= 4 ? [A, B, Cc] : null, k >= 4 ? [Cc, D, A] : null],
        segs: [[A, Cc], k >= 1 ? [A, B] : null, k >= 1 ? [D, Cc] : null, k >= 2 ? [B, Cc] : null, k >= 2 ? [A, D] : null, k >= 3 ? [A, Cc] : null],
        txts: names(R, ["A", "B", "C", "D"]),
      })}
      note={(k: number) => k >= 4 ? <>Urutan: A↔C, B↔D, C↔A. Jadi ∠B = ∠D = 90°.</> : undefined}
      maxH={330}
    />
  );
}

/* ═════════ 16 · Bukti: titik tengah (SAS) ═════════ */
const BPM: BBox = [-6, 4.5, 6, -4.5];
const PM_SPEC: Spec = {
  polys: [[C.ink, 0.03, 0, 2], [C.teal, 0.2, 0, 0], [C.orange, 0.2, 0, 0]],
  segs: [[C.soft, 2, 0], [C.soft, 2, 0], [C.blue, 5, 0], [C.blue, 5, 0], [C.orange, 5, 0], [C.orange, 5, 0]],
  arcs: [[C.violet, 3.5], [C.violet, 3.5]],
  txts: [C.ink, C.ink, C.ink, C.ink, C.ink],
};
function ProofMidSlide() {
  const A: Vec = [-4, -1.5], B: Vec = [3, -2.5], Cc: Vec = [4, 1.5], D: Vec = [-3, 2.5], O: Vec = [0, 0];
  return (
    <SceneEx
      eyebrow="02 · Kekongruenan segitiga · Bukti" title="Dua diagonal saling membagi dua"
      intro={<p>Pada ABCD, diagonal AC dan BD berpotongan di O, titik tengah keduanya. Buktikan <b>ΔAOB ≅ ΔCOD</b>.</p>}
      lines={[
        <><b style={{ color: C.blue }}>AO = CO</b> (O titik tengah AC)</>,
        <><b style={{ color: C.violet }}>∠AOB = ∠COD</b> (sudut bertolak belakang)</>,
        <><b style={{ color: C.orange }}>BO = DO</b> (O titik tengah BD)</>,
        <>Sisi–sudut–sisi: <b>ΔAOB ≅ ΔCOD</b>. Akibatnya AB = CD dan ∠OAB = ∠OCD.</>,
      ]}
      bbox={BPM} spec={PM_SPEC}
      geo={(k) => ({
        polys: [[A, B, Cc, D], k >= 4 ? [A, O, B] : null, k >= 4 ? [Cc, O, D] : null],
        segs: [[A, Cc], [B, D], k >= 1 ? [A, O] : null, k >= 1 ? [O, Cc] : null, k >= 3 ? [B, O] : null, k >= 3 ? [O, D] : null],
        arcs: k >= 2 ? [arcAt(O, A, B, 1), arcAt(O, Cc, D, 1)] : [],
        txts: [...names([A, B, Cc, D], ["A", "B", "C", "D"]), { at: [0.2, 0.2], t: "O" }],
      })}
      note="Pola SAS dengan sudut bertolak belakang sering dipakai pada soal pembuktian."
      maxH={330}
    />
  );
}

/* ═════════ 17 · Segitiga siku-siku: sisi miring dan sisi ═════════ */
const BHL: BBox = [-1.5, 5.5, 15.5, -1.5];
function HypLegSlide() {
  const T1: Vec[] = [[0, 4], [3, 0], [0, 0]], T2: Vec[] = [[14, 4], [11, 0], [14, 0]];
  return (
    <SceneEx
      eyebrow="02 · Kekongruenan segitiga · Siku-siku" title="Sisi miring dan satu sisi"
      intro={<p>Dua segitiga siku-siku (siku-siku di C dan R). Cukup dua sisi yang diketahui:</p>}
      lines={[
        <><b style={{ color: C.blue }}>AB = PQ = 5</b> (sisi miring)</>,
        <><b style={{ color: C.orange }}>BC = QR = 3</b> (satu sisi siku-siku)</>,
        <>Pythagoras: {tex(raw`AC^2=5^2-3^2=16`)}, AC = 4. Demikian pula <b style={{ color: C.violet }}>PR = 4</b>.</>,
        <>Tiga sisi sama (SSS), maka <b>ΔABC ≅ ΔPQR</b>. Inilah aturan <b>sisi miring–sisi</b>.</>,
      ]}
      bbox={BHL} spec={MARK_SPEC}
      geo={(k) => ({
        ...marks(T1, T2, [0, 1, 2].slice(0, Math.min(k, 3)), []),
        polys: [T1, T2, sqMark([0, 0], [1, 0], [0, 1], 0.5), sqMark([14, 0], [-1, 0], [0, 1], 0.5)],
        txts: [...names(T1, NAMES3), ...names(T2, NAMES3P)],
      })}
      note="Syarat tambahan siku-siku mengubah SSA yang menipu menjadi aman."
      maxH={330}
    />
  );
}

/* ═════════ 18 · Sebangun: bangun datar ═════════ */
const BSR: BBox = [-1, 10.5, 13, -1.6];
const SR_SPEC: Spec = {
  polys: [[C.blue, 0.12, 0, 3], [C.orange, 0.08, 0, 3]],
  segs: [[C.blue, 2.5, 0], [C.orange, 2.5, 3]],
  txts: [C.blue, C.orange],
};
function SimilarRectSlide() {
  return (
    <SceneLab
      eyebrow="03 · Kesebangunan bangun datar" title="Sama bentuk, ukuran boleh beda"
      copy={<>
        <p>Dua bangun <b>sebangun</b> bila <b>sudut bersesuaian sama besar</b> dan <b>sisi bersesuaian sebanding</b>.</p>
        <p>Persegi panjang biru berukuran 4 × 3. Atur ukuran yang oranye.</p>
        <p className="ds-muted">Sudutnya selalu 90°, jadi yang menentukan adalah perbandingan sisi. Bila sebangun, kedua diagonal berimpit.</p>
      </>}
      bbox={BSR} spec={SR_SPEC} init={[8, 6]}
      sl={[{ label: "lebar", min: 2, max: 12, step: 1, color: C.orange }, { label: "tinggi", min: 1.5, max: 9, step: 0.5, color: C.orange }]}
      geo={(s) => ({
        polys: [[[0, 0], [4, 0], [4, 3], [0, 3]], [[0, 0], [s[0], 0], [s[0], s[1]], [0, s[1]]]],
        segs: [[[0, 0], [4, 3]], [[0, 0], [s[0], s[1]]]],
        txts: [{ at: [0.15, -1.2], t: "4 × 3" }, { at: [0.15, s[1] + 0.25], t: `${n(s[0])} × ${n(s[1])}` }],
      })}
      read={(s) => {
        const r1 = s[0] / 4, r2 = s[1] / 3, okk = same(r1, r2);
        return <>
          <div>lebar: {n(s[0])} ÷ 4 = {n(r1)}</div><div>tinggi: {n(s[1])} ÷ 3 = {n(r2)}</div>
          {okk ? <b className="ds-ok">Sebanding (skala {n(r1)}) → sebangun.</b> : <b className="ds-bad">Tidak sebanding → tidak sebangun.</b>}
        </>;
      }}
      maxH={340}
    />
  );
}

/* ═════════ 19 · Skala, keliling, luas ═════════ */
const BDL: BBox = [-1.5, 13, 16.5, -1.6];
const DIL_SPEC: Spec = {
  polys: [[C.ink, 0.08, 0, 3], [C.orange, 0.1, 0, 3]],
  segs: [[C.soft, 1.5, 3], [C.soft, 1.5, 3], [C.soft, 1.5, 3]],
  dots: [[C.violet, 5]],
  txts: [C.ink, C.ink, C.ink, C.orange, C.orange, C.orange, C.violet],
};
function DilationSlide() {
  const T: Vec[] = [[1, 1], [5, 1], [1, 4]];
  return (
    <SceneLab
      eyebrow="03 · Kesebangunan bangun datar" title="Skala, keliling, dan luas"
      copy={<>
        <p>Perbesar atau perkecil ΔABC dari titik O dengan skala <b>k</b>. Hasilnya selalu sebangun.</p>
        <p>Panjang berbanding <b>k</b>, tetapi luas berbanding <b>k²</b>.</p>
        <p className="ds-muted">Skala 2 membuat luas 4 kali lipat, bukan 2 kali.</p>
      </>}
      bbox={BDL} spec={DIL_SPEC} init={[2]}
      sl={[{ label: tex("k"), min: 0.5, max: 3, step: 0.5, color: C.orange }]}
      geo={(s) => {
        const k = s[0], T2 = T.map((p): Vec => [k * p[0], k * p[1]]);
        return {
          polys: [T, T2], segs: T2.map((p): [Vec, Vec] => [[0, 0], p]), dots: [[0, 0]],
          txts: [...names(T, NAMES3, 0.5), ...names(T2, ["A′", "B′", "C′"], 0.5), { at: [-0.9, -1], t: "O" }],
        };
      }}
      read={(s) => {
        const k = s[0];
        return <>
          sisi: 4 · 3 · 5 → {n(4 * k)} · {n(3 * k)} · {n(5 * k)}<br />
          keliling: 12 → {n(12 * k)} (× {n(k)})<br />
          luas: 6 → <b>{n(6 * k * k)}</b> (× {n(k * k)})
        </>;
      }}
      maxH={350}
    />
  );
}

/* ═════════ 20 · Sebangun segitiga: AA ═════════ */
const BAA: BBox = [-1, 10, 19, -1.6];
function AaSlide() {
  return (
    <SceneLab
      eyebrow="04 · Kesebangunan segitiga" title="Dua sudut sudah cukup"
      copy={<>
        <p>Atur <b style={{ color: C.blue }}>∠A</b> dan <b style={{ color: C.orange }}>∠B</b>, lalu ukuran segitiga kanan dengan <b>k</b>.</p>
        <p>Karena jumlah sudut 180°, sudut ketiga ikut sama. Segitiga kanan selalu <b>sebangun</b> dengan yang kiri.</p>
        <p className="ds-muted">Inilah syarat <b>sudut–sudut (AA)</b>.</p>
      </>}
      bbox={BAA} spec={MARK_SPEC} init={[50, 60, 1.5]}
      sl={[
        { label: tex(raw`\angle A`), min: 30, max: 80, step: 5, color: C.blue, shown: (v) => `${fmt(v, 0)}°` },
        { label: tex(raw`\angle B`), min: 30, max: 80, step: 5, color: C.orange, shown: (v) => `${fmt(v, 0)}°` },
        { label: tex("k"), min: 0.6, max: 1.5, step: 0.1, color: C.violet },
      ]}
      geo={(s) => {
        const [al, be, k] = s, ga = 180 - al - be;
        const T: Vec[] = [[0, 0], [6 * Math.sin(rad(ga)), 0], [6 * Math.sin(rad(be)) * Math.cos(rad(al)), 6 * Math.sin(rad(be)) * Math.sin(rad(al))]];
        const T2 = T.map((p): Vec => [9 + k * p[0], k * p[1]]);
        const ar = (X: Vec[]) => [0, 1, 2].map((i) => arcAt(X[i], X[(i + 1) % 3], X[(i + 2) % 3], 1));
        return { polys: [T, T2], arcs: [...ar(T), ...ar(T2)], txts: [...names(T, NAMES3), ...names(T2, NAMES3P)] };
      }}
      read={(s) => {
        const ga = 180 - s[0] - s[1];
        return <>
          ∠A = ∠P = {s[0]}° · ∠B = ∠Q = {s[1]}° · ∠C = ∠R = {ga}°<br />
          PQ : AB = QR : BC = RP : CA = <b>{n(s[2])}</b><br /><b className="ds-ok">Sudut sama → sisi sebanding → sebangun.</b>
        </>;
      }}
      maxH={340}
    />
  );
}

/* ═════════ 21 · Sebangun: sisi sebanding ═════════ */
const BSSS: BBox = [-1, 11, 20, -1.6];
const sssGeo = (s: number[]): Geo => {
  const T1 = tri(3, 4, 5), q = [...s].sort((x, y) => x - y);
  const T2 = q[0] + q[1] > q[2] ? mv(tri(q[0], q[1], q[2]), [7.5, 0]) : null;
  const ar = (X: Vec[]) => [0, 1, 2].map((i) => arcAt(X[i], X[(i + 1) % 3], X[(i + 2) % 3], 0.9));
  return {
    polys: [T1, T2], arcs: [...ar(T1), ...(T2 ? ar(T2) : [null, null, null])],
    txts: [...names(T1, NAMES3), ...(T2 ? names(T2, NAMES3P) : [])],
  };
};
const sssRead = (s: number[]) => {
  const q = [...s].sort((x, y) => x - y);
  if (q[0] + q[1] <= q[2]) return <span className="ds-bad">Tidak membentuk segitiga: dua sisi terpendek harus lebih panjang dari sisi terpanjang.</span>;
  const r = [q[0] / 3, q[1] / 4, q[2] / 5], okk = same(r[0], r[1]) && same(r[1], r[2]);
  return <>
    {q[0]} : 3 = {n(r[0])} · {q[1]} : 4 = {n(r[1])} · {q[2]} : 5 = {n(r[2])}<br />
    {okk ? <b className="ds-ok">Ketiga perbandingan sama → sebangun (skala {n(r[0])}).</b> : <b className="ds-bad">Perbandingan berbeda → tidak sebangun.</b>}
  </>;
};
const SSS_SL = [
  { label: "sisi 1", min: 1, max: 12, step: 1, color: C.orange }, { label: "sisi 2", min: 1, max: 12, step: 1, color: C.orange },
  { label: "sisi 3", min: 1, max: 12, step: 1, color: C.orange },
];
function SssSimilarSlide() {
  return (
    <SceneLab
      eyebrow="04 · Kesebangunan segitiga" title="Tiga sisi yang sebanding"
      copy={<>
        <p>Segitiga kiri bersisi <b>3, 4, 5</b>. Atur tiga sisi segitiga kanan (diurutkan otomatis dari yang terpendek).</p>
        <p>Bila ketiga perbandingan <b>sama</b>, kedua segitiga sebangun, dan sudut-sudutnya ikut sama.</p>
        <p className="ds-muted">Coba (6, 8, 10), lalu (6, 8, 11).</p>
      </>}
      bbox={BSSS} spec={MARK_SPEC} init={[6, 8, 10]} sl={SSS_SL} geo={sssGeo} read={sssRead} maxH={330}
    />
  );
}

/* ═════════ 22 · Sebangun: SAS ═════════ */
const BSAS: BBox = [-1, 8, 15, -1.6];
function SasSimilarSlide() {
  const A: Vec = [0, 0], B: Vec = [4, 0], Cc: Vec = [6 * Math.cos(rad(50)), 6 * Math.sin(rad(50))];
  const P: Vec = [8, 0], Q: Vec = [14, 0], R: Vec = [8 + 9 * Math.cos(rad(50)), 9 * Math.sin(rad(50))];
  return (
    <SceneEx
      eyebrow="04 · Kesebangunan segitiga" title="Dua sisi sebanding dan sudut apit"
      intro={<p>Bandingkan ΔABC dan ΔPQR.</p>}
      lines={[
        <><b style={{ color: C.blue }}>AB : PQ</b> = 4 : 6 = 2 : 3</>,
        <><b style={{ color: C.violet }}>AC : PR</b> = 6 : 9 = 2 : 3 (perbandingan sama)</>,
        <><b style={{ color: C.teal }}>∠A = ∠P</b> = 50° (sudut yang diapit)</>,
        <>Maka <b>ΔABC ∼ ΔPQR</b> (sisi–sudut–sisi). Sisi ketiga otomatis sebanding: BC : QR = 2 : 3.</>,
      ]}
      bbox={BSAS} spec={MARK_SPEC}
      geo={(k) => ({
        ...marks([A, B, Cc], [P, Q, R], k >= 2 ? [0, 2] : k >= 1 ? [0] : [], k >= 3 ? [0] : []),
        polys: [[A, B, Cc], [P, Q, R]], txts: [...names([A, B, Cc], NAMES3), ...names([P, Q, R], NAMES3P)],
      })}
      note="Syarat kesebangunan SAS: dua pasang sisi sebanding, sudut yang diapit sama besar."
      maxH={330}
    />
  );
}

/* ═════════ 23 · Garis sejajar alas ═════════ */
const BPL: BBox = [-1.5, 9.5, 11.5, -1.6];
const PL_SPEC: Spec = {
  polys: [[C.blue, 0.08, 0, 3], [C.orange, 0.2, 0, 3]],
  segs: [[C.orange, 4, 0]],
  dots: [[C.orange, 5], [C.orange, 5]],
  txts: [C.ink, C.ink, C.ink, C.orange, C.orange],
};
function ParallelSlide() {
  const A: Vec = [0, 0], B: Vec = [10, 0], Cc: Vec = [3, 8];
  return (
    <SceneLab
      eyebrow="04 · Kesebangunan segitiga" title="Garis sejajar alas"
      copy={<>
        <p>Garis EF sejajar alas AB memotong CA dan CB. Geser posisinya dengan <b>t</b> = CE : CA.</p>
        <p>ΔCEF ∼ ΔCAB karena ∠C bersama dan ∠CEF = ∠CAB (sehadap).</p>
        <p className="ds-muted">Teknik ini dipakai pada rangka atap, tangga, dan pagar bersilang.</p>
      </>}
      bbox={BPL} spec={PL_SPEC} init={[0.6]}
      sl={[{ label: tex("t"), min: 0.1, max: 0.9, step: 0.1, color: C.orange }]}
      geo={(s) => {
        const E = lerp(Cc, A, s[0]), F = lerp(Cc, B, s[0]);
        return {
          polys: [[A, B, Cc], [Cc, E, F]], segs: [[E, F]], dots: [E, F],
          txts: [...names([A, B, Cc], NAMES3), { at: [E[0] - 0.8, E[1] - 0.2], t: "E" }, { at: [F[0] + 0.25, F[1] - 0.2], t: "F" }],
        };
      }}
      read={(s) => <>
        CE : CA = {n(s[0])} · CF : CB = {n(s[0])}<br />EF : AB = {n(10 * s[0])} : 10 = <b>{n(s[0])}</b><br />
        EF = {n(s[0])} × AB, EF ∥ AB
      </>}
      maxH={350}
    />
  );
}

/* ═════════ 24 · Siku-siku: tiga segitiga sebangun ═════════ */
const BRT: BBox = [-1.5, 8.5, 14.5, -1.6];
const RT_SPEC: Spec = {
  polys: [[C.blue, 0.1, 0, 3], [C.orange, 0.18, 0, 3], [C.violet, 0.18, 0, 3], [C.ink, 0, 0, 1.75], [C.ink, 0, 0, 1.75], [C.ink, 0, 0, 1.75]],
  segs: [[C.ink, 2.5, 3]],
  arcs: [[C.teal, 3.5], [C.red, 3.5]],
  txts: [C.ink, C.ink, C.ink, C.ink],
};
const RA: Vec = [0, 0], RB: Vec = [13, 0], RC: Vec = [4, 6], RD: Vec = [4, 0];
function RightTrianglesSlide() {
  return (
    <SceneEx
      eyebrow="05 · Segitiga siku-siku" title="Garis tinggi membagi tiga"
      intro={<p>ΔABC siku-siku di C. Tarik garis tinggi CD ke sisi miring AB.</p>}
      lines={[
        <><b>ΔABC</b> siku-siku di C, dan CD ⟂ AB.</>,
        <>ΔACD dan ΔABC: <b style={{ color: C.teal }}>∠A bersama</b>, sama-sama siku-siku, maka <b>ΔACD ∼ ΔABC</b>.</>,
        <>ΔCBD dan ΔABC: <b style={{ color: C.red }}>∠B bersama</b>, sama-sama siku-siku, maka <b>ΔCBD ∼ ΔABC</b>.</>,
        <>Jadi <b>ΔABC ∼ ΔACD ∼ ΔCBD</b>: tiga segitiga siku-siku dengan bentuk yang sama.</>,
      ]}
      bbox={BRT} spec={RT_SPEC}
      geo={(k) => ({
        polys: [k >= 1 ? [RA, RB, RC] : null, k >= 2 ? [RA, RD, RC] : null, k >= 3 ? [RC, RD, RB] : null,
          k >= 1 ? sqMark(RC, unitv(RC, RA), unitv(RC, RB), 0.6) : null,
          k >= 2 ? sqMark(RD, [1, 0], [0, 1], 0.5) : null, k >= 2 ? sqMark(RD, [-1, 0], [0, 1], 0.5) : null],
        segs: [k >= 2 ? [RC, RD] : null],
        arcs: [k >= 2 ? arcAt(RA, RB, RC, 1.4) : null, k >= 3 ? arcAt(RB, RA, RC, 1.4) : null],
        txts: names([RA, RB, RC, RD], ["A", "B", "C", "D"]),
      })}
      maxH={330}
    />
  );
}

/* ═════════ 25 · Siku-siku: laboratorium ═════════ */
const BSC: BBox = [-1.5, 6.5, 11.5, -1.6];
const SC_SPEC: Spec = {
  polys: [[C.ink, 0.04, 0, 2.5], [C.orange, 0.18, 0, 2], [C.violet, 0.18, 0, 2], [C.ink, 0, 0, 1.75]],
  segs: [[C.ink, 2.5, 3]],
  arcs: [[C.soft, 2]],
  dots: [[C.teal, 6]],
  txts: [C.ink, C.ink, C.ink, C.ink],
};
const scPts = (th: number) => {
  const A: Vec = [0, 0], B: Vec = [10, 0], Cc: Vec = [5 + 5 * Math.cos(rad(th)), 5 * Math.sin(rad(th))];
  return { A, B, Cc, D: [Cc[0], 0] as Vec };
};
function ProjectionSlide() {
  return (
    <SceneLab
      eyebrow="05 · Segitiga siku-siku" title="Tiga rumus dari tiga segitiga"
      copy={<>
        <p>Titik C bergerak pada setengah lingkaran berdiameter AB, jadi ∠C selalu <b>90°</b>. D adalah kaki garis tinggi.</p>
        <p className="ds-math">{tex(raw`CD^2=AD\cdot DB`)}</p>
        <p className="ds-math">{tex(raw`AC^2=AD\cdot AB,\quad BC^2=DB\cdot AB`)}</p>
        <p className="ds-muted">Semua bersumber dari sisi sebanding pada ΔACD ∼ ΔCBD ∼ ΔABC.</p>
      </>}
      bbox={BSC} spec={SC_SPEC} init={[60]}
      sl={[{ label: tex(raw`\text{posisi C}`), min: 15, max: 165, step: 5, color: C.teal, shown: (v) => `${fmt(v, 0)}°` }]}
      geo={(s) => {
        const { A, B, Cc, D } = scPts(s[0]);
        return {
          polys: [[A, B, Cc], [A, D, Cc], [Cc, D, B], sqMark(Cc, unitv(Cc, A), unitv(Cc, B), 0.6)],
          segs: [[Cc, D]], arcs: [{ c: [5, 0], r: 5, a0: 0, a1: 180 }], dots: [Cc],
          txts: [...names([A, B, Cc], NAMES3), { at: [D[0] - 0.2, -1.1], t: "D" }],
        };
      }}
      read={(s) => {
        const { A, B, Cc, D } = scPts(s[0]);
        const ad = dist(A, D), db = dist(D, B), cd = dist(Cc, D), ac = dist(A, Cc), bc = dist(B, Cc);
        return <>
          AD = {fmt(ad, 2)} · DB = {fmt(db, 2)} · CD = {fmt(cd, 2)}<br />
          CD² = {fmt(cd * cd, 2)} = AD·DB = {fmt(ad * db, 2)}<br />
          AC² = {fmt(ac * ac, 2)} = AD·AB = {fmt(ad * 10, 2)}<br />
          BC² = {fmt(bc * bc, 2)} = DB·AB = {fmt(db * 10, 2)}
        </>;
      }}
      maxH={330}
    />
  );
}

/* ═════════ 26 · Siku-siku: contoh hitung ═════════ */
const EX_SPEC: Spec = {
  polys: [[C.ink, 0.05, 0, 2.5], [C.ink, 0, 0, 1.75]],
  segs: [[C.blue, 4.5, 0], [C.violet, 4.5, 0], [C.orange, 4.5, 0], [C.green, 4.5, 0]],
  txts: [C.ink, C.ink, C.ink, C.ink, C.mute, C.mute],
};
function RightExampleSlide() {
  return (
    <SceneEx
      eyebrow="05 · Segitiga siku-siku · Contoh" title="Hitung semua panjang"
      intro={<p>ΔABC siku-siku di C, CD ⟂ AB, dengan <b>AD = 4</b> dan <b>DB = 9</b>.</p>}
      lines={[
        tex(raw`AB=AD+DB=4+9=13`),
        tex(raw`CD^2=AD\cdot DB=4\cdot 9=36\Rightarrow CD=6`),
        tex(raw`AC^2=AD\cdot AB=4\cdot13=52\Rightarrow AC=2\sqrt{13}`),
        tex(raw`BC^2=DB\cdot AB=9\cdot13=117\Rightarrow BC=3\sqrt{13}`),
        <>Periksa: {tex(raw`AC^2+BC^2=52+117=169=13^2`)} ✓</>,
      ]}
      bbox={BRT} spec={EX_SPEC}
      geo={(k) => ({
        polys: [[RA, RB, RC], sqMark(RC, unitv(RC, RA), unitv(RC, RB), 0.6)],
        segs: [k >= 1 ? [RA, RB] : null, k >= 2 ? [RC, RD] : null, k >= 3 ? [RA, RC] : null, k >= 4 ? [RC, RB] : null],
        txts: [...names([RA, RB, RC, RD], ["A", "B", "C", "D"]), { at: [1.7, -1.1], t: "4" }, { at: [8.2, -1.1], t: "9" }],
      })}
      maxH={330}
    />
  );
}

/* ═════════ 27 · Penerapan: bayangan ═════════ */
const BSH: BBox = [-8, 10, 19, -2.4];
const SH_SPEC: Spec = {
  segs: [[C.soft, 1.5, 0], [C.mute, 6, 0], [C.mute, 6, 0], [C.teal, 5, 0], [C.ink, 5, 0], [C.orange, 2, 3], [C.orange, 2, 3]],
  dots: [[C.teal, 6], [C.ink, 6], [C.orange, 5], [C.orange, 5]],
  txts: [C.teal, C.ink, C.mute, C.mute],
};
function ShadowSlide() {
  return (
    <SceneLab
      eyebrow="06 · Penerapan" title="Bayangan dan sinar matahari"
      copy={<>
        <p>Pohon 8 m dan seseorang 1,6 m berdiri di bawah matahari yang sama. Ubah <b>sudut matahari</b>.</p>
        <p>Sinar matahari sejajar, sehingga dua segitiga siku-siku yang terbentuk <b>sebangun</b>.</p>
        <p className="ds-math">{tex(raw`\dfrac{\text{tinggi pohon}}{\text{bayangan pohon}}=\dfrac{\text{tinggi orang}}{\text{bayangan orang}}`)}</p>
      </>}
      bbox={BSH} spec={SH_SPEC} init={[40]}
      sl={[{ label: "sudut matahari", min: 25, max: 75, step: 5, color: C.orange, shown: (v) => `${fmt(v, 0)}°` }]}
      geo={(s) => {
        const t = Math.tan(rad(s[0])), H = 8, h = 1.6, px = -6, s1 = H / t, s2 = h / t;
        return {
          segs: [[[-8, 0], [19, 0]], [[0, 0], [s1, 0]], [[px, 0], [px + s2, 0]], [[0, 0], [0, H]], [[px, 0], [px, h]], [[0, H], [s1, 0]], [[px, h], [px + s2, 0]]],
          dots: [[0, H], [px, h], [s1, 0], [px + s2, 0]],
          txts: [{ at: [0.3, 3.7], t: "8 m" }, { at: [px + 0.3, 0.7], t: "1,6 m" },
            { at: [s1 / 2 - 0.9, -1.6], t: `${fmt(s1, 1)} m` }, { at: [px + s2 / 2 - 0.9, -1.6], t: `${fmt(s2, 1)} m` }],
        };
      }}
      read={(s) => {
        const t = Math.tan(rad(s[0]));
        return <>pohon: 8 : {fmt(8 / t, 1)} = {fmt(t, 2)}<br />orang: 1,6 : {fmt(1.6 / t, 1)} = {fmt(t, 2)}<br /><b className="ds-ok">Perbandingan tinggi : bayangan selalu sama.</b></>;
      }}
      maxH={300}
    />
  );
}

/* ═════════ 28 · Penerapan: lebar sungai ═════════ */
const BRV: BBox = [-3, 12, 20.5, -7.5];
const RV_SPEC: Spec = {
  polys: [[C.blue, 0.1, 0, 0], [C.teal, 0.2, 0, 3], [C.teal, 0.2, 0, 3]],
  segs: [[C.ink, 2, 0], [C.ink, 2, 0], [C.green, 3, 3], [C.blue, 5, 0], [C.orange, 5, 0], [C.violet, 5, 0], [C.ink, 1.75, 3]],
  arcs: [[C.violet, 3], [C.violet, 3]],
  dots: [[C.green, 6], [C.ink, 5], [C.ink, 5], [C.ink, 5], [C.ink, 5]],
  txts: [C.green, C.ink, C.ink, C.ink, C.ink, C.green, C.blue, C.orange, C.violet],
};
function RiverSlide() {
  const T: Vec = [0, 10], A: Vec = [0, 0], B: Vec = [12, 0], Cc: Vec = [18, 0], D: Vec = [18, -5];
  return (
    <SceneEx
      eyebrow="06 · Penerapan" title="Mengukur lebar sungai"
      intro={<p>Lebar sungai tidak bisa diukur langsung. Gunakan segitiga sebangun.</p>}
      lines={[
        <>A di tepi sungai, tepat di seberang pohon T (AT ⟂ tepi). Ukur <b style={{ color: C.blue }}>AB = 12 m</b>.</>,
        <>Lanjutkan ke C: <b style={{ color: C.orange }}>BC = 6 m</b>.</>,
        <>Dari C berjalan tegak lurus tepi sampai D, tepat saat B, T, D segaris: <b style={{ color: C.violet }}>CD = 5 m</b>.</>,
        <>ΔABT ∼ ΔCBD: ∠A = ∠C = 90° dan ∠ABT = ∠CBD (bertolak belakang), jadi sudut–sudut (AA).</>,
        <>{tex(raw`\dfrac{AT}{CD}=\dfrac{AB}{BC}\Rightarrow AT=5\cdot\dfrac{12}{6}=10`)} m</>,
      ]}
      bbox={BRV} spec={RV_SPEC}
      geo={(k) => {
        const nm = names([T, A, B, Cc, D], ["T", "A", "B", "C", "D"], 0.7);
        const show = [true, k >= 1, k >= 1, k >= 2, k >= 3];
        return {
          polys: [[[-3, 0], [20, 0], [20, 10], [-3, 10]], k >= 4 ? [A, B, T] : null, k >= 4 ? [Cc, B, D] : null],
          segs: [[[-3, 0], [20, 0]], [[-3, 10], [20, 10]], k >= 1 ? [A, T] : null, k >= 1 ? [A, B] : null, k >= 2 ? [B, Cc] : null, k >= 3 ? [Cc, D] : null, k >= 3 ? [T, D] : null],
          arcs: k >= 4 ? [arcAt(B, A, T, 1.6), arcAt(B, Cc, D, 1.6)] : [],
          dots: [T, k >= 1 ? A : null, k >= 1 ? B : null, k >= 2 ? Cc : null, k >= 3 ? D : null],
          txts: [...nm.map((t, i) => (show[i] ? t : null)),
            k >= 1 ? { at: [0.4, 4.5], t: k >= 5 ? "10 m" : "?" } : null, k >= 1 ? { at: [5.4, -1.7], t: "12 m" } : null,
            k >= 2 ? { at: [14.5, -1.7], t: "6 m" } : null, k >= 3 ? { at: [18.4, -3], t: "5 m" } : null],
        };
      }}
      note={(k: number) => k >= 5 ? <b>Lebar sungai = 10 m.</b> : "Pita biru adalah sungai. Tekan → untuk setiap langkah."}
      maxH={420}
    />
  );
}

/* ═════════ 29 · Penerapan: cermin dan menara ═════════ */
const BMR: BBox = [-4, 19, 24, -3.6];
const MR_SPEC: Spec = {
  polys: [[C.violet, 0.15, 0, 3], [C.violet, 0.15, 0, 3]],
  segs: [[C.soft, 1.5, 0], [C.ink, 5, 0], [C.teal, 5, 0], [C.blue, 6, 0], [C.orange, 2.5, 0], [C.orange, 2.5, 0]],
  arcs: [[C.teal, 3], [C.teal, 3]],
  dots: [[C.ink, 5], [C.teal, 6], [C.blue, 5]],
  txts: [C.ink, C.ink, C.ink, C.ink, C.teal, C.ink, C.mute, C.mute, C.teal],
};
function MirrorSlide() {
  const M: Vec = [0, 0], F: Vec = [-2, 0], E: Vec = [-2, 1.6], G: Vec = [20, 0], T: Vec = [20, 16];
  return (
    <SceneEx
      eyebrow="06 · Penerapan" title="Mengukur menara dengan cermin"
      intro={<p>Letakkan cermin di tanah (titik M). Mundurlah sampai puncak menara T tampak di cermin.</p>}
      lines={[
        <>Hukum pantul: <b>sudut datang = sudut pantul</b>, yaitu ∠EMF = ∠TMG.</>,
        <>Ukur: tinggi mata EF = 1,6 m, FM = 2 m, MG = 20 m.</>,
        <>ΔEFM ∼ ΔTGM: siku-siku di F dan G, serta ∠EMF = ∠TMG.</>,
        <>{tex(raw`\dfrac{TG}{EF}=\dfrac{MG}{FM}\Rightarrow TG=1{,}6\cdot\dfrac{20}{2}=16`)} m</>,
      ]}
      bbox={BMR} spec={MR_SPEC}
      geo={(k) => ({
        polys: [k >= 3 ? [E, F, M] : null, k >= 3 ? [T, G, M] : null],
        segs: [[[-4, 0], [24, 0]], [F, E], [G, T], [[-0.7, 0], [0.7, 0]], k >= 1 ? [E, M] : null, k >= 1 ? [M, T] : null],
        arcs: k >= 3 ? [arcAt(M, E, F, 1.5), arcAt(M, T, G, 2.5)] : [],
        dots: [E, T, M],
        txts: [...names([E, F, M, G, T], ["E", "F", "M", "G", "T"], 0.7),
          k >= 2 ? { at: [-3.9, 0.7], t: "1,6 m" } : null, k >= 2 ? { at: [-1.9, -1.9], t: "2 m" } : null,
          k >= 2 ? { at: [9.5, -1.9], t: "20 m" } : null, { at: [20.5, 8], t: k >= 4 ? "16 m" : "?" }],
      })}
      note="Tinggi menara ditemukan tanpa memanjat, cukup dengan meteran dan cermin."
      maxH={430}
    />
  );
}

/* ═════════ 30 · Rangkuman ═════════ */
function StrategySlide() {
  return (
    <Frame
      eyebrow="Rangkuman" title="Mulai dari pertanyaannya"
      copy={<p>Pilih alat yang cocok. Bila ragu, gambar dua segitiga dan tandai unsur yang bersesuaian.</p>}
      stage={<Tbl head={["Yang ditanya", "Gunakan"]} rows={[
        ["bentuk dan ukuran sama persis", "kongruen: SSS, SAS, ASA"],
        ["bentuk sama, ukuran beda", "sebangun: AA, sisi sebanding, SAS"],
        ["tinggi atau lebar yang tak bisa diukur", "segitiga sebangun dan perbandingan"],
        ["garis tinggi pada sisi miring", <>{tex(raw`CD^2=AD\cdot DB`)}</>],
        ["gambar atau peta", "skala = gambar : sebenarnya"],
        ["luas bangun sebangun", <>berbanding {tex("k^2")}</>],
      ]} />}
    />
  );
}
function SummarySlide() {
  return (
    <Frame
      eyebrow="Rangkuman" title="Kongruen dan sebangun"
      copy={<>
        <p>Kongruen adalah kasus khusus sebangun dengan <b>skala 1</b>.</p>
        <p className="ds-muted">Jika dua bangun kongruen, pasti sebangun. Sebaliknya belum tentu.</p>
      </>}
      stage={<Tbl head={["", "Kongruen (≅)", "Sebangun (∼)"]} rows={[
        ["Bentuk", "sama", "sama"],
        ["Ukuran", "sama", "boleh berbeda"],
        ["Sisi bersesuaian", "sama panjang", "sebanding"],
        ["Sudut bersesuaian", "sama besar", "sama besar"],
        ["Syarat segitiga", "SSS, SAS, ASA", "AA, SSS, SAS (sebanding)"],
        ["Luas", "sama", <>berbanding {tex("k^2")}</>],
      ]} />}
    />
  );
}
function MistakesSlide() {
  return (
    <Frame
      eyebrow="Rangkuman" title="Kesalahan yang sering terjadi"
      copy={<p>Kenali jebakannya sebelum latihan.</p>}
      stage={<Tbl head={["Keliru", "Yang benar"]} rows={[
        ["menulis ΔABC ≅ ΔQPR sembarang urutan", "urutan huruf harus bersesuaian"],
        ["tiga sudut sama → kongruen", "itu hanya sebangun (AAA)"],
        ["SSA dianggap cukup", "SSA bisa menghasilkan dua segitiga"],
        ["membandingkan sisi yang tidak bersesuaian", "pasangkan: pendek–pendek, panjang–panjang"],
        ["luas berbanding k", <>luas berbanding {tex("k^2")}</>],
        ["menyusun tinggi : bayangan dengan urutan terbalik", "samakan urutan di kedua ruas"],
      ]} />}
    />
  );
}

/* ═════════ 33 · Latihan ═════════ */
function WarmupSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStep(ref);
  const qs: ReactNode[] = [
    "Segitiga 3, 4, 5 dan 6, 8, 10: kongruen atau sebangun?",
    tex(raw`\triangle ABC\sim\triangle PQR,\ AB=6,\ PQ=9,\ BC=8,\ QR=?`),
    "Skala 1 : 500, jarak di denah 4 cm. Jarak sebenarnya?",
    "Dua persegi bersisi 3 dan 6. Perbandingan luasnya?",
    tex(raw`\text{Pada siku-siku, }AD=2,\ DB=8,\ CD=?`),
    "Tiang 1,5 m berbayangan 2 m. Pohon berbayangan 12 m. Tinggi pohon?",
  ];
  return (
    <Frame
      innerRef={ref}
      eyebrow="Latihan · Pemanasan" title="Coba sendiri dulu"
      copy={<>
        <p className="ds-muted">Kerjakan di kertas, lalu tekan → untuk mencocokkan jawaban satu per satu.</p>
        <p className="fragment">Sebangun (skala 2), bukan kongruen.</p>
        <p className="fragment">{tex(raw`\tfrac{QR}{8}=\tfrac96\Rightarrow QR=12`)}</p>
        <p className="fragment">4 × 500 = 2.000 cm = 20 m.</p>
        <p className="fragment">Skala 1 : 2, luas 1 : 4.</p>
        <p className="fragment">{tex(raw`CD^2=2\cdot8=16\Rightarrow CD=4`)}</p>
        <p className="fragment">{tex(raw`\tfrac{t}{12}=\tfrac{1{,}5}{2}\Rightarrow t=9`)} m.</p>
      </>}
      stage={<Tbl rows={qs.map((q, i) => [`${i + 1}${step > i ? " ✓" : ""}`, q])} />}
    />
  );
}

/* ═════════ 34 · Tantangan 1: segitiga sebangun dengan keliling 36 ═════════ */
function ChallengeSimilarSlide() {
  return (
    <SceneLab
      eyebrow="Latihan · Tantangan 1" title="Sebangun dengan keliling 36"
      copy={<>
        <p>Atur tiga sisi segitiga kanan sehingga <b>sebangun</b> dengan segitiga 3, 4, 5 dan <b>kelilingnya 36</b>.</p>
        <p className="ds-muted">Petunjuk: keliling 3, 4, 5 adalah 12. Berapa skalanya?</p>
      </>}
      bbox={BSSS} spec={MARK_SPEC} init={[5, 5, 5]} sl={SSS_SL} geo={sssGeo}
      read={(s) => {
        const q = [...s].sort((x, y) => x - y), per = s[0] + s[1] + s[2];
        const sim = q[0] + q[1] > q[2] && same(q[0] / 3, q[1] / 4) && same(q[1] / 4, q[2] / 5);
        return <>
          {sssRead(s)}<br />keliling = {per} {ck(per === 36, "")}
          {sim && per === 36 && <><br /><b className="ds-ok">Berhasil! Skala 3: sisinya 9, 12, 15.</b></>}
        </>;
      }}
      maxH={310}
    />
  );
}

/* ═════════ 35 · Tantangan 2: tinggi pohon ═════════ */
const BTR: BBox = [-7, 15, 17, -2.6];
const TR_SPEC: Spec = {
  segs: [[C.soft, 1.5, 0], [C.mute, 6, 0], [C.mute, 6, 0], [C.teal, 5, 0], [C.ink, 5, 0], [C.orange, 2.75, 0], [C.violet, 2.5, 3], [C.violet, 2.75, 0]],
  dots: [[C.teal, 6], [C.ink, 6]],
  txts: [C.teal, C.ink, C.mute, C.mute],
};
function TreeChallengeSlide() {
  return (
    <SceneLab
      eyebrow="Latihan · Tantangan 2" title="Berapa tinggi pohonnya?"
      copy={<>
        <p>Tiang 1,5 m berbayangan 2 m. Pohon berbayangan 12 m. Atur tinggi pohon sampai kedua sinar <b>sejajar</b>.</p>
        <p className="ds-muted">Garis oranye: sinar ke ujung bayangan. Putus-putus ungu: arah sinar menurut tiang.</p>
      </>}
      bbox={BTR} spec={TR_SPEC} init={[5]}
      sl={[{ label: "tinggi pohon", min: 2, max: 14, step: 0.5, color: C.teal, shown: (v) => `${n(v)} m` }]}
      geo={(s) => {
        const H = s[0];
        return {
          segs: [[[-7, 0], [17, 0]], [[-5, 0], [-3, 0]], [[0, 0], [12, 0]], [[0, 0], [0, H]], [[-5, 0], [-5, 1.5]],
            [[0, H], [12, 0]], [[0, H], [(4 / 3) * H, 0]], [[-5, 1.5], [-3, 0]]],
          dots: [[0, H], [-5, 1.5]],
          txts: [{ at: [0.3, H / 2 - 0.3], t: `${n(H)} m` }, { at: [-4.6, 0.5], t: "1,5 m" }, { at: [-4.4, -1.7], t: "2 m" }, { at: [5.2, -1.7], t: "12 m" }],
        };
      }}
      read={(s) => {
        const r = s[0] / 12, okk = same(r, 0.75);
        return <>tinggi : bayangan pohon = {n(s[0])} : 12 = {fmt(r, 3)}<br />tiang: 1,5 : 2 = 0,75<br />
          {okk ? <b className="ds-ok">✓ Cocok! Tinggi pohon 9 m.</b> : <span>Belum sama. Geser tinggi pohon.</span>}</>;
      }}
      maxH={340}
    />
  );
}

/* ═════════ 37 · Penutup ═════════ */
function ClosingSlide() {
  return (
    <Frame
      eyebrow="Ringkasan" title="Sama persis atau sama bentuk"
      copy={<>
        <p><b>Kongruen</b>: tiga unsur yang tepat (SSS, SAS, ASA) menjamin segitiga sama persis.</p>
        <p className="fragment"><b>Sebangun</b>: dua sudut (AA) atau sisi yang sebanding menjamin segitiga sama bentuk.</p>
        <p className="fragment">Pada segitiga siku-siku, garis tinggi melahirkan tiga segitiga sebangun dan tiga rumus.</p>
        <p className="fragment">Dengan bayangan, cermin, atau patok, <b>perbandingan</b> mengukur apa yang tak terjangkau.</p>
      </>}
      stage={<div className="ds-read ds-math" style={{ maxWidth: 560, display: "grid", gap: 18 }}>
        {tex(raw`\triangle ABC\cong\triangle PQR:\ \text{SSS, SAS, ASA}`)}
        {tex(raw`\triangle ABC\sim\triangle PQR:\ \dfrac{PQ}{AB}=\dfrac{QR}{BC}=\dfrac{RP}{CA}=k`)}
        {tex(raw`CD^2=AD\cdot DB`)}
      </div>}
    />
  );
}

export function KesebangunanDeck() {
  return (
    <SlideDeck>
      <CoverSlide />
      <MapSlide />
      <QuadSlide />
      <TriangleSlide />
      <RatioSlide />
      <ScaleSlide />
      <AnglesSlide />
      <PythagorasSlide />
      <TripleSlide />
      <CongruentSlide />
      <RhombusSlide />
      <PairSlide />
      <ThreeRulesSlide />
      <AaaSlide />
      <SsaSlide />
      <ProofRectSlide />
      <ProofMidSlide />
      <HypLegSlide />
      <SimilarRectSlide />
      <DilationSlide />
      <AaSlide />
      <SssSimilarSlide />
      <SasSimilarSlide />
      <ParallelSlide />
      <RightTrianglesSlide />
      <ProjectionSlide />
      <RightExampleSlide />
      <ShadowSlide />
      <RiverSlide />
      <MirrorSlide />
      <StrategySlide />
      <SummarySlide />
      <MistakesSlide />
      <WarmupSlide />
      <ChallengeSimilarSlide />
      <TreeChallengeSlide />
      <Quiz eyebrow="Latihan · Kuis" title="Kuis 12 soal" items={QUIZ} />
      <ClosingSlide />
    </SlideDeck>
  );
}
export default KesebangunanDeck;
