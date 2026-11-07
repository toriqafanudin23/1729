import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { grade, matches } from "../lib/answer.ts";
import { findQuestion, questionsInBab } from "../questions/index.ts";
import type { ChoiceQuestion, InputQuestion, Question, StatementsQuestion } from "../questions/types.ts";
import { useMateri } from "../state/context";
import { IconBulb, IconCheck, IconCross, IconEye } from "./icons";
import { Rich } from "./Rich";

/* ------------------------------------------------------------------ *
 *  Cek poin: pertanyaan singkat setelah siswa mengamati simulasi.
 *   <Ask id="b3-faktor1" />                    isian, pilihan, atau pernyataan
 *   <Challenge id="b2-ch1" check={...}>…</Challenge>   cek keadaan simulasi
 *  Teks soal, kunci, petunjuk, dan pembahasan ada di questions/*.ts.
 * ------------------------------------------------------------------ */

const REVEAL_AFTER = 2; // salah dua kali → tombol "Lihat pembahasan"

function useCheckpoint(q: Question) {
  const { slug, records, save } = useMateri();
  const record = records[q.id];
  const [attempts, setAttempts] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const hints = q.hints ?? [];

  const list = questionsInBab(slug, q.bab);
  const position = list.findIndex((item) => item.id === q.id) + 1;

  return {
    record,
    done: Boolean(record),
    attempts,
    hints,
    hintCount,
    message,
    position,
    total: list.length,
    canHint: attempts > 0 && hintCount < hints.length,
    canReveal: attempts >= REVEAL_AFTER,
    correct(value?: string) {
      save(q.id, { status: "benar", attempts, firstTry: attempts === 0 && hintCount === 0, value });
      setMessage(null);
    },
    /** Jawaban salah yang dihitung sebagai percobaan. */
    wrong(text?: string) {
      setAttempts((n) => n + 1);
      setMessage(text ?? "Belum tepat. Periksa langkahmu, lalu coba lagi.");
    },
    /** Pesan tanpa dihitung sebagai percobaan (format belum terbaca, dll.). */
    note(text: string | null) {
      setMessage(text);
    },
    nextHint() {
      setHintCount((n) => Math.min(hints.length, n + 1));
    },
    reveal() {
      save(q.id, { status: "dibuka", attempts, firstTry: false });
      setMessage(null);
    },
  };
}

type Cp = ReturnType<typeof useCheckpoint>;

/* ───────── Bingkai bersama ───────── */

function Frame({ q, cp, children, kind }: { q: Question; cp: Cp; children: ReactNode; kind: string }) {
  const promptId = useId();
  const state = cp.record ? (cp.record.status === "benar" ? "ok" : "seen") : cp.message ? "bad" : "idle";
  const revealedHints = cp.hints.slice(0, cp.hintCount);

  return (
    <section className={`mt-cp mt-cp--${state} mt-cp--${kind}`} aria-labelledby={promptId} data-checkpoint={q.id}>
      <header className="mt-cp__head">
        <span className="mt-cp__tag">
          {kind === "challenge" ? "Tantangan simulasi" : "Cek poin"}
          {cp.total > 0 && cp.position > 0 && (
            <span className="mt-cp__count">
              {" "}
              {cp.position}/{cp.total}
            </span>
          )}
        </span>
        <span className="mt-cp__state" aria-hidden="true">
          {state === "ok" && <IconCheck size={16} />}
          {state === "seen" && <IconEye size={16} />}
          {state === "bad" && <IconCross size={16} />}
        </span>
      </header>

      <Rich id={promptId} className="mt-cp__prompt" html={q.prompt} />
      <div className="mt-cp__body">{children}</div>

      <div className="mt-cp__feedback" role="status" aria-live="polite">
        {cp.record?.status === "benar" && (
          <p className="mt-cp__msg mt-cp__msg--ok">
            <IconCheck size={16} /> <span>{cp.record.firstTry ? "Tepat, langsung benar." : "Benar."}</span>
          </p>
        )}
        {cp.record?.status === "dibuka" && (
          <p className="mt-cp__msg mt-cp__msg--seen">
            <IconEye size={16} /> <span>Pembahasan dibuka. Pahami langkahnya, lalu coba lagi soal serupa nanti.</span>
          </p>
        )}
        {!cp.record && cp.message && (
          <div className="mt-cp__msg mt-cp__msg--bad">
            <IconCross size={16} /> <Rich as="span" html={cp.message} />
          </div>
        )}
      </div>

      {!cp.record && revealedHints.length > 0 && (
        <ol className="mt-cp__hints" aria-label="Petunjuk">
          {revealedHints.map((hint, i) => (
            <li key={i}>
              <span className="mt-cp__hint-no">Petunjuk {i + 1}</span>
              <Rich as="span" html={hint} />
            </li>
          ))}
        </ol>
      )}

      {!cp.record && (cp.canHint || cp.canReveal) && (
        <div className="mt-cp__actions">
          {cp.canHint && (
            <button type="button" className="mt-btn mt-btn--ghost" onClick={cp.nextHint}>
              <IconBulb size={16} /> Butuh petunjuk
              {cp.hints.length - cp.hintCount > 1 ? ` (${cp.hints.length - cp.hintCount} tersisa)` : ""}
            </button>
          )}
          {cp.canReveal && (
            <button type="button" className="mt-btn mt-btn--ghost" onClick={cp.reveal}>
              <IconEye size={16} /> Lihat pembahasan
            </button>
          )}
        </div>
      )}

      {cp.record && (
        <div className="mt-cp__explain">
          <p className="mt-cp__explain-title">Pembahasan</p>
          <Rich html={q.explanation} />
        </div>
      )}
    </section>
  );
}

/* ───────── Isian ───────── */

const POLY_KEYS: { label: string; text: string; aria: string }[] = [
  { label: "x²", text: "x^2", aria: "sisipkan x kuadrat" },
  { label: "(", text: "(", aria: "sisipkan kurung buka" },
  { label: ")", text: ")", aria: "sisipkan kurung tutup" },
  { label: "−", text: "-", aria: "sisipkan tanda minus" },
];

function InputCheckpoint({ q }: { q: InputQuestion }) {
  const cp = useCheckpoint(q);
  const [value, setValue] = useState(cp.record?.value ?? "");
  const ref = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const locked = cp.done;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const answer = value.trim();
    if (!answer || locked) return;
    const result = grade(answer, q.spec);
    if (result.ok) return cp.correct(answer);
    if (result.reason === "format" || result.reason === "shape") return cp.note(result.message ?? null);
    const known = q.wrong?.find((w) => matches(answer, w.spec));
    cp.wrong(known?.message);
  };

  const insert = (text: string) => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setValue(value.slice(0, start) + text + value.slice(end));
    cp.note(null);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  };

  return (
    <Frame q={q} cp={cp} kind="input">
      <form className="mt-cp__form" onSubmit={onSubmit} noValidate>
        <div className="mt-cp__row">
          <label className={`mt-cp__field${cp.message ? " is-bad" : ""}${cp.record?.status === "benar" ? " is-ok" : ""}`} htmlFor={inputId}>
            <input
              id={inputId}
              ref={ref}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={value}
              readOnly={locked}
              aria-label="Jawabanmu"
              aria-invalid={Boolean(cp.message)}
              placeholder={q.placeholder ?? "Tulis jawabanmu"}
              onChange={(e) => {
                setValue(e.target.value);
                cp.note(null);
              }}
            />
            {q.unit && <span className="mt-cp__unit">{q.unit}</span>}
          </label>
          <button type="submit" className="mt-btn mt-btn--primary" disabled={locked || !value.trim()}>
            Periksa
          </button>
        </div>
        {!locked && q.format && <p className="mt-cp__format">{q.format}</p>}
        {!locked && q.spec.kind === "poly" && (
          <div className="mt-cp__keys" role="group" aria-label="Tombol bantu penulisan">
            {POLY_KEYS.map((k) => (
              <button key={k.label} type="button" className="mt-key" aria-label={k.aria} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(k.text)}>
                {k.label}
              </button>
            ))}
          </div>
        )}
      </form>
    </Frame>
  );
}

/* ───────── Pilihan ganda ───────── */

function ChoiceCheckpoint({ q }: { q: ChoiceQuestion }) {
  const cp = useCheckpoint(q);
  const name = useId();
  const saved = cp.record?.value !== undefined ? Number(cp.record.value) : null;
  const [picked, setPicked] = useState<number | null>(Number.isInteger(saved) ? saved : null);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const locked = cp.done;
  const shown = cp.record?.status === "dibuka" ? q.answer : picked;

  const check = () => {
    if (picked === null || locked) return;
    if (picked === q.answer) return cp.correct(String(picked));
    setWrongPick(picked);
    cp.wrong("Belum tepat. Baca tiap pilihan dengan teliti, lalu bandingkan dengan simulasinya.");
  };

  return (
    <Frame q={q} cp={cp} kind="choice">
      <fieldset className="mt-choice" disabled={locked}>
        <legend className="mt-sr">Pilih satu jawaban</legend>
        {q.options.map((option, i) => {
          const state = locked ? (i === q.answer ? " is-ok" : "") : wrongPick === i && picked === i ? " is-bad" : "";
          return (
            <label key={i} className={`mt-choice__item${shown === i ? " is-picked" : ""}${state}`}>
              <input
                type="radio"
                name={name}
                checked={shown === i}
                onChange={() => {
                  setPicked(i);
                  cp.note(null);
                }}
              />
              <span className="mt-choice__mark" aria-hidden="true" />
              <Rich as="span" className="mt-choice__text" html={option} />
            </label>
          );
        })}
      </fieldset>
      <div className="mt-cp__row">
        <button type="button" className="mt-btn mt-btn--primary" disabled={locked || picked === null} onClick={check}>
          Periksa
        </button>
      </div>
    </Frame>
  );
}

/* ───────── Benar / salah beberapa pernyataan ───────── */

function StatementsCheckpoint({ q }: { q: StatementsQuestion }) {
  const cp = useCheckpoint(q);
  const [onLabel, offLabel] = q.labels ?? ["Benar", "Salah"];
  const locked = cp.done;
  const [marks, setMarks] = useState<(boolean | null)[]>(() => (cp.record ? q.items.map((item) => item.answer) : q.items.map(() => null)));
  const [flags, setFlags] = useState<(boolean | null)[]>(() => q.items.map(() => null));
  const shownMarks = locked ? q.items.map((item) => item.answer) : marks;

  const set = (i: number, value: boolean) => {
    if (locked) return;
    setMarks((prev) => prev.map((m, k) => (k === i ? value : m)));
    setFlags((prev) => prev.map((f, k) => (k === i ? null : f)));
    cp.note(null);
  };

  const check = () => {
    if (locked || marks.some((m) => m === null)) return;
    const results = q.items.map((item, i) => marks[i] === item.answer);
    setFlags(results);
    if (results.every(Boolean)) return cp.correct();
    const wrongCount = results.filter((r) => !r).length;
    cp.wrong(wrongCount === 1 ? "Satu pernyataan masih keliru (ditandai merah). Periksa lagi." : `${wrongCount} pernyataan masih keliru (ditandai merah). Periksa lagi.`);
  };

  return (
    <Frame q={q} cp={cp} kind="statements">
      <ul className="mt-stmts">
        {q.items.map((item, i) => {
          const flag = locked ? true : flags[i];
          return (
            <li key={i} className={`mt-stmt${flag === true ? " is-ok" : flag === false ? " is-bad" : ""}`}>
              <Rich as="span" className="mt-stmt__text" html={item.text} />
              <span className="mt-seg" role="group" aria-label={`Jawaban untuk pernyataan ${i + 1}`}>
                <button type="button" aria-pressed={shownMarks[i] === true} className={shownMarks[i] === true ? "is-on" : ""} onClick={() => set(i, true)} disabled={locked}>
                  {onLabel}
                </button>
                <button type="button" aria-pressed={shownMarks[i] === false} className={shownMarks[i] === false ? "is-on" : ""} onClick={() => set(i, false)} disabled={locked}>
                  {offLabel}
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-cp__row">
        <button type="button" className="mt-btn mt-btn--primary" disabled={locked || marks.some((m) => m === null)} onClick={check}>
          Periksa
        </button>
      </div>
    </Frame>
  );
}

/** Cek poin isian, pilihan, atau pernyataan; jenisnya ditentukan oleh data soal. */
export function Ask({ id }: { id: string }) {
  const { slug } = useMateri();
  const q = findQuestion(slug, id);
  if (!q) return <p className="mt-missing">Soal “{id}” tidak ditemukan.</p>;
  switch (q.type) {
    case "input":
      return <InputCheckpoint q={q} />;
    case "choice":
      return <ChoiceCheckpoint q={q} />;
    case "statements":
      return <StatementsCheckpoint q={q} />;
    default:
      return <p className="mt-missing">Soal “{id}” adalah tantangan simulasi; pakai &lt;Challenge&gt;.</p>;
  }
}

/* ───────── Tantangan simulasi ───────── */

/**
 * Siswa mengatur simulasi, lalu menekan "Periksa konfigurasi".
 * `children` menerima fungsi `report`; simulasi memanggilnya setiap keadaannya berubah.
 */
export function Challenge<T>({ id, check, children }: { id: string; check: (state: T) => boolean; children: (report: (state: T) => void) => ReactNode }) {
  const { slug } = useMateri();
  const q = findQuestion(slug, id);
  if (!q || q.type !== "challenge") return <p className="mt-missing">Tantangan “{id}” tidak ditemukan.</p>;
  return (
    <ChallengeInner q={q} check={check}>
      {children}
    </ChallengeInner>
  );
}

function ChallengeInner<T>({ q, check, children }: { q: Question; check: (state: T) => boolean; children: (report: (state: T) => void) => ReactNode }) {
  const cp = useCheckpoint(q);
  const latest = useRef<T | null>(null);
  const report = (state: T) => {
    latest.current = state;
  };

  const verify = () => {
    if (cp.done) return;
    const state = latest.current;
    if (state === null) return cp.note("Geser slider pada simulasi dulu, lalu periksa.");
    if (check(state)) return cp.correct();
    cp.wrong("Belum memenuhi semua syarat. Cek syarat satu per satu pada simulasi.");
  };

  return (
    <Frame q={q} cp={cp} kind="challenge">
      <div className="mt-challenge__lab">{children(report)}</div>
      <div className="mt-cp__row">
        <button type="button" className="mt-btn mt-btn--primary" disabled={cp.done} onClick={verify}>
          Periksa konfigurasi
        </button>
      </div>
    </Frame>
  );
}
