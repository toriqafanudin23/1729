import { useEffect, useMemo, useRef, useState } from "react";
import { useJsxBoard, type SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { Rich } from "../components/Rich";
import { addFunction, addGridAxes, addMarker, addVerticalLine, COLORS, type Marker, type Settable } from "./jxg";
import { LabBoard, LabFrame } from "./LabKit";
import { quadTex, tex } from "./format";
import { analyse } from "./ParabolaExplorer";

/* Menyusun sketsa langkah demi langkah: arah, titik potong y, akar, puncak, titik cermin, kurva. */

const FUNCS = [
  { a: 1, b: -2, c: -3 },
  { a: -1, b: 4, c: -3 },
  { a: 2, b: -4, c: 3 },
];

const STEP_TITLES = [
  "Arah buka",
  "Titik potong sumbu y",
  "Titik potong sumbu x",
  "Sumbu simetri dan puncak",
  "Titik cermin",
  "Hubungkan menjadi kurva",
];

export function SketchLab() {
  const [fi, setFi] = useState(0);
  const [step, setStep] = useState(0); // 0 = belum ada langkah; 1..6 = langkah yang sudah dikerjakan
  const fn = FUNCS[fi];
  const info = useMemo(() => analyse(fn), [fn]);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const stepRef = useRef(step);
  stepRef.current = step;
  const els = useRef<{ yint?: Marker; roots?: Marker[]; axis?: Settable; vertex?: Marker; mirror?: Marker; curve?: Settable }>({});

  const setup = (board: SimBoard) => {
    const p = () => fnRef.current;
    addGridAxes(board);
    els.current.axis = addVerticalLine(board, () => analyse(p()).xp, { visible: false });
    els.current.curve = addFunction(board, (x) => p().a * x * x + p().b * x + p().c, { visible: false });
    els.current.yint = addMarker(board, () => 0, () => p().c, { color: COLORS.c, visible: false });
    els.current.mirror = addMarker(board, () => 2 * analyse(p()).xp, () => p().c, { color: COLORS.c, hollow: true, visible: false });
    els.current.roots = [0, 1].map((i) =>
      addMarker(board, () => analyse(p()).roots[i] ?? NaN, () => (analyse(p()).roots[i] === undefined ? NaN : 0), { color: COLORS.root, visible: false }),
    );
    els.current.vertex = addMarker(board, () => analyse(p()).xp, () => analyse(p()).yp, { color: COLORS.vertex, size: 6, visible: false });
  };

  const { boardProps, boardRef } = useJsxBoard({ boundingBox: [-5, 6, 7, -6], setup, zoomRange: [1, 1], embedded: true });

  useEffect(() => {
    const e = els.current;
    e.yint?.show(step >= 2);
    e.roots?.forEach((r) => r.show(step >= 3));
    e.axis?.setAttribute({ visible: step >= 4 });
    e.vertex?.show(step >= 4);
    e.mirror?.show(step >= 5 && info.xp !== 0);
    e.curve?.setAttribute({ visible: step >= 6 });
    boardRef.current?.update();
  }, [step, fi, info.xp, boardRef]);

  const { a, c } = fn;
  const texts: string[] = [
    a > 0
      ? `\\(a=${tex(a)}>0\\), sehingga parabola <b>membuka ke atas</b> dan titik puncaknya adalah titik terendah.`
      : `\\(a=${tex(a)}<0\\), sehingga parabola <b>membuka ke bawah</b> dan titik puncaknya adalah titik tertinggi.`,
    `Saat \\(x=0\\), \\(f(0)=c=${tex(c)}\\). Titik potong sumbu \\(y\\): <b>\\((0,\\,${tex(c)})\\)</b>.`,
    info.d < 0
      ? `\\(D=${tex(info.d)}<0\\), maka <b>tidak ada titik potong</b> dengan sumbu \\(x\\).`
      : info.d === 0
        ? `\\(D=0\\): grafik menyinggung sumbu \\(x\\) di \\((${tex(info.roots[0])},\\,0)\\).`
        : `\\(D=${tex(info.d)}>0\\); akarnya \\(x=${tex(info.roots[0])}\\) dan \\(x=${tex(info.roots[1])}\\). Titik potong: <b>\\((${tex(info.roots[0])},0)\\)</b> dan <b>\\((${tex(info.roots[1])},0)\\)</b>.`,
    `Sumbu simetri \\(x=-\\dfrac{b}{2a}=${tex(info.xp)}\\). Titik puncak: <b>\\((${tex(info.xp)},\\,${tex(info.yp)})\\)</b>.`,
    info.xp === 0
      ? `Titik \\((0,${tex(c)})\\) berada tepat di sumbu simetri, jadi tidak ada titik cermin yang baru.`
      : `Cerminkan \\((0,${tex(c)})\\) terhadap \\(x=${tex(info.xp)}\\): <b>\\((${tex(2 * info.xp)},\\,${tex(c)})\\)</b>. Satu titik bantu tanpa menghitung lagi.`,
    "Hubungkan titik-titik dengan kurva mulus. Kurva tidak berujung runcing di puncak dan terus melebar ke kedua sisi.",
  ];

  return (
    <LabFrame
      title="Simulasi 5.1 · Sketsa langkah demi langkah"
      hint="Pilih fungsi, lalu tekan Langkah berikutnya. Setiap langkah menambah satu unsur pada grafik."
      onReset={() => setStep(0)}
      stage={<LabBoard boardProps={boardProps} label="Papan sketsa grafik fungsi kuadrat yang terbentuk bertahap" />}
      controls={
        <>
          <div className="mt-presets" role="group" aria-label="Pilih fungsi">
            {FUNCS.map((f, i) => (
              <button
                key={i}
                type="button"
                className={`mt-chip${i === fi ? " is-on" : ""}`}
                aria-pressed={i === fi}
                onClick={() => {
                  setFi(i);
                  setStep(0);
                }}
              >
                <Rich as="span" html={`\\(${quadTex(f.a, f.b, f.c)}\\)`} />
              </button>
            ))}
          </div>
          <ol className="mt-steps" aria-label="Langkah menggambar sketsa">
            {STEP_TITLES.map((title, i) => (
              <li key={title} className={i + 1 < step ? "is-done" : i + 1 === step ? "is-now" : ""}>
                <span className="mt-steps__title">{title}</span>
                {i + 1 === step && <Rich className="mt-steps__text" html={texts[i]} />}
              </li>
            ))}
          </ol>
          <div className="mt-lab__nav">
            <button type="button" className="mt-btn mt-btn--ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Sebelumnya
            </button>
            <button type="button" className="mt-btn mt-btn--primary" disabled={step >= STEP_TITLES.length} onClick={() => setStep((s) => s + 1)}>
              {step === 0 ? "Mulai" : "Langkah berikutnya"}
            </button>
          </div>
        </>
      }
    />
  );
}
