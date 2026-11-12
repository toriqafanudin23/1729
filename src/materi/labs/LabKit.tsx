import { useId, type ReactNode } from "react";
import type { useJsxBoard } from "../../simulation/common/hooks/useJsxBoard";
import { IconFlask, IconReset } from "../components/icons";
import { Rich } from "../components/Rich";
import { num } from "./format";

/* Kerangka bersama semua simulasi di dalam materi. */

type BoardProps = ReturnType<typeof useJsxBoard>["boardProps"];

export function LabFrame({
  title,
  hint,
  stage,
  controls,
  readout,
  onReset,
}: {
  title: string;
  hint?: string;
  stage: ReactNode;
  controls: ReactNode;
  readout?: ReactNode;
  onReset?: () => void;
}) {
  return (
    <figure className="mt-lab">
      <figcaption className="mt-lab__head">
        <span className="mt-lab__title">
          <IconFlask size={16} /> {title}
        </span>
        {onReset && (
          <button type="button" className="mt-btn mt-btn--quiet" onClick={onReset}>
            <IconReset size={14} /> Atur ulang
          </button>
        )}
      </figcaption>
      <div className="mt-lab__grid">
        <div className="mt-lab__stage">{stage}</div>
        <div className="mt-lab__panel">
          <div className="mt-lab__controls">{controls}</div>
          {readout}
        </div>
      </div>
      {hint && <p className="mt-lab__hint">{hint}</p>}
    </figure>
  );
}

/** Papan JSXGraph yang mengisi panggung. */
export function LabBoard({ boardProps, label }: { boardProps: BoardProps; label: string }) {
  return (
    <div className="mt-boardbox">
      <div {...boardProps} className="mt-board" role="img" aria-label={label} />
    </div>
  );
}

export function LabSlider({
  symbol,
  name,
  value,
  min,
  max,
  step,
  color,
  onChange,
  disabled,
}: {
  /** Simbol dalam TeX, contoh "a". */
  symbol: string;
  /** Nama untuk pembaca layar, contoh "koefisien a". */
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const clamp = (v: number) => Math.min(max, Math.max(min, Number(v.toFixed(6))));
  return (
    <div className="mt-slider" style={{ ["--c" as string]: color }}>
      <div className="mt-slider__top">
        <label htmlFor={id}>
          <Rich as="span" html={`\\(${symbol}\\)`} />
        </label>
        <output htmlFor={id}>{num(value)}</output>
      </div>
      <div className="mt-slider__row">
        <button type="button" aria-label={`Kurangi ${name}`} disabled={disabled || value <= min} onClick={() => onChange(clamp(value - step))}>
          −
        </button>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={name}
          aria-valuetext={num(value)}
          onChange={(e) => onChange(clamp(parseFloat(e.target.value)))}
        />
        <button type="button" aria-label={`Tambah ${name}`} disabled={disabled || value >= max} onClick={() => onChange(clamp(value + step))}>
          +
        </button>
      </div>
    </div>
  );
}

export interface ReadoutItem {
  label: string;
  /** Isi dalam TeX. */
  tex: string;
  wide?: boolean;
}

export function Readout({ items, caption = "Hasil pada simulasi" }: { items: ReadoutItem[]; caption?: string }) {
  return (
    <dl className="mt-readout" aria-label={caption}>
      {items.map((item) => (
        <div key={item.label} className={`mt-readout__item${item.wide ? " is-wide" : ""}`}>
          <dt>{item.label}</dt>
          <dd>
            <Rich as="span" html={`\\(${item.tex}\\)`} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
