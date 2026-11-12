import { useId } from "react";
import {
  ELEMEN_FILTER,
  FASE_INFO,
  FASE_LIST,
  cpLabel,
  isCpFilterActive,
  EMPTY_CP_FILTER,
  type CpFilterState,
  type CpTag,
} from "../curriculum/cp";
import "./CpFilter.css";

/** Deretan tag CP kecil (untuk kartu katalog). */
export function CpBadges({ tags, max = 3 }: { tags: CpTag[] | undefined; max?: number }) {
  if (!tags || tags.length === 0) return null;
  const shown = tags.slice(0, max);
  const hidden = tags.length - shown.length;
  return (
    <ul className="cpf-badges" aria-label="Capaian Pembelajaran Kurikulum Merdeka">
      {shown.map((tag) => (
        <li key={`${tag.fase}-${tag.elemen}-${tag.fokus}`} className="cpf-badge" title={tag.fokus}>
          {cpLabel(tag)}
        </li>
      ))}
      {hidden > 0 && <li className="cpf-badge cpf-badge--more">+{hidden}</li>}
    </ul>
  );
}

/** Daftar tag CP lengkap dengan fokusnya (untuk halaman detail). */
export function CpList({ tags }: { tags: CpTag[] | undefined }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="cpf-list">
      <ul>
        {tags.map((tag) => (
          <li key={`${tag.fase}-${tag.elemen}-${tag.fokus}`}>
            <span className="cpf-badge">{cpLabel(tag)}</span>
            <span className="cpf-list__fokus">{tag.fokus}</span>
            <span className="cpf-list__kelas">{FASE_INFO[tag.fase].kelas}</span>
          </li>
        ))}
      </ul>
      <p className="cpf-note">
        Ringkasan untuk memudahkan pencarian, bukan kutipan resmi. Rujuk dokumen CP Matematika Kurikulum Merdeka
        untuk rumusan lengkapnya.
      </p>
    </div>
  );
}

/** Kolom cari + saringan Fase dan Elemen. Keadaan dipegang oleh halaman pemanggil. */
export function CpFilter({
  value,
  onChange,
  total,
  shown,
  placeholder = "Cari topik, konsep, atau CP…",
}: {
  value: CpFilterState;
  onChange: (next: CpFilterState) => void;
  total: number;
  shown: number;
  placeholder?: string;
}) {
  const searchId = useId();
  const active = isCpFilterActive(value);
  const toggle = <K extends "fase" | "elemen">(key: K, item: CpFilterState[K]) =>
    onChange({ ...value, [key]: value[key] === item ? null : item });

  return (
    <div className="cpf" role="search">
      <div className="cpf__row">
        <label className="cpf__search" htmlFor={searchId}>
          <span className="cpf__sr">Cari materi</span>
          <input
            id={searchId}
            type="search"
            value={value.query}
            placeholder={placeholder}
            onChange={(event) => onChange({ ...value, query: event.target.value })}
            autoComplete="off"
          />
        </label>
        {active && (
          <button type="button" className="cpf__reset" onClick={() => onChange(EMPTY_CP_FILTER)}>
            Hapus filter
          </button>
        )}
      </div>

      <div className="cpf__group" role="group" aria-label="Fase Capaian Pembelajaran">
        <span className="cpf__label">Fase</span>
        {FASE_LIST.map((fase) => (
          <button
            key={fase}
            type="button"
            className="cpf__chip"
            aria-pressed={value.fase === fase}
            title={FASE_INFO[fase].kelas}
            onClick={() => toggle("fase", fase)}
          >
            {FASE_INFO[fase].label} <small>{FASE_INFO[fase].kelas}</small>
          </button>
        ))}
      </div>

      <div className="cpf__group" role="group" aria-label="Elemen Capaian Pembelajaran">
        <span className="cpf__label">Elemen</span>
        {ELEMEN_FILTER.map((elemen) => (
          <button
            key={elemen}
            type="button"
            className="cpf__chip"
            aria-pressed={value.elemen === elemen}
            onClick={() => toggle("elemen", elemen)}
          >
            {elemen}
          </button>
        ))}
      </div>

      <p className="cpf__count" role="status" aria-live="polite">
        {active ? `${shown} dari ${total} materi sesuai` : `${total} materi`}
        {active && shown === 0 && " — coba kata kunci atau filter lain."}
      </p>
    </div>
  );
}
