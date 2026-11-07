import { useState } from "react";
import { COLORS } from "./jxg";
import { LabFrame, LabSlider, Readout } from "./LabKit";
import { num, quadTex, tex } from "./format";

/* Tabel nilai dan selisih: selisih kedua fungsi kuadrat selalu konstan (= 2a). */

const PRESETS = [
  { label: "2x + 1", a: 0, b: 2, c: 1 },
  { label: "x²", a: 1, b: 0, c: 0 },
  { label: "3x² − 2x + 1", a: 3, b: -2, c: 1 },
  { label: "−x² + 4x", a: -1, b: 4, c: 0 },
];
const INIT = { a: 1, b: 0, c: 0 };
const XS = [0, 1, 2, 3, 4, 5, 6];

export function DifferenceLab() {
  const [s, setS] = useState(INIT);
  const ys = XS.map((x) => s.a * x * x + s.b * x + s.c);
  const d1 = ys.slice(1).map((y, i) => y - ys[i]);
  const d2 = d1.slice(1).map((y, i) => y - d1[i]);
  const constant = (arr: number[]) => arr.every((v) => v === arr[0]);

  return (
    <LabFrame
      title="Simulasi 1.2 · Tabel nilai dan selisih"
      hint="Pilih fungsi atau atur koefisiennya. Perhatikan baris mana yang nilainya sama semua."
      onReset={() => setS(INIT)}
      stage={
        <div className="mt-difftable" role="region" aria-label="Tabel nilai fungsi dan selisihnya" tabIndex={0}>
          <table>
            <tbody>
              <tr>
                <th scope="row">x</th>
                {XS.map((x) => (
                  <td key={x}>{x}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">f(x)</th>
                {ys.map((y, i) => (
                  <td key={i}>{num(y)}</td>
                ))}
              </tr>
              <tr className={constant(d1) ? "is-const" : ""}>
                <th scope="row">Selisih 1</th>
                {d1.map((y, i) => (
                  <td key={i}>{num(y)}</td>
                ))}
                <td className="is-empty" />
              </tr>
              <tr className={constant(d2) ? "is-const" : ""}>
                <th scope="row">Selisih 2</th>
                {d2.map((y, i) => (
                  <td key={i}>{num(y)}</td>
                ))}
                <td className="is-empty" />
                <td className="is-empty" />
              </tr>
            </tbody>
          </table>
          <p className="mt-difftable__note">
            {s.a === 0 ? "Selisih pertama konstan: ciri fungsi linear." : "Selisih kedua konstan: ciri fungsi kuadrat."}
          </p>
        </div>
      }
      controls={
        <>
          <div className="mt-presets" role="group" aria-label="Contoh fungsi">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`mt-chip${p.a === s.a && p.b === s.b && p.c === s.c ? " is-on" : ""}`}
                aria-pressed={p.a === s.a && p.b === s.b && p.c === s.c}
                onClick={() => setS({ a: p.a, b: p.b, c: p.c })}
              >
                {p.label}
              </button>
            ))}
          </div>
          <LabSlider symbol="a" name="koefisien a" value={s.a} min={-4} max={4} step={1} color={COLORS.a} onChange={(a) => setS((v) => ({ ...v, a }))} />
          <LabSlider symbol="b" name="koefisien b" value={s.b} min={-6} max={6} step={1} color={COLORS.b} onChange={(b) => setS((v) => ({ ...v, b }))} />
          <LabSlider symbol="c" name="koefisien c" value={s.c} min={-6} max={6} step={1} color={COLORS.c} onChange={(c) => setS((v) => ({ ...v, c }))} />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Fungsi", tex: `f(x)=${quadTex(s.a, s.b, s.c)}`, wide: true },
            { label: "Nilai a", tex: `a=${tex(s.a)}` },
            { label: "Selisih kedua", tex: d2.length && constant(d2) ? `${tex(d2[0])}` : "\\text{—}" },
          ]}
        />
      }
    />
  );
}
