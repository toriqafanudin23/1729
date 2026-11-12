import type { ReactNode } from "react";
import { Rich } from "./Rich";

/* Blok penyusun isi bab. Teks ditulis dengan tx`...` (lihat lib/tx.ts) sehingga
   rumus cukup ditulis \( x^2 \) tanpa menggandakan garis miring. */

export const P = ({ children }: { children: string }) => <Rich as="p" className="mt-p" html={children} />;

/** Rumus berdiri sendiri (tengah). Isi tanpa pembatas \[ \]. */
export const MB = ({ children }: { children: string }) => <Rich className="mt-mb" html={`\\[${children}\\]`} />;

export const H2 = ({ id, children }: { id?: string; children: string }) => <Rich as="h2" id={id} className="mt-h2" html={children} />;
export const H3 = ({ id, children }: { id?: string; children: string }) => <Rich as="h3" id={id} className="mt-h3" html={children} />;

export function Daftar({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`mt-list${ordered ? " mt-list--ol" : ""}`}>
      {items.map((item, i) => (
        <Rich as="li" key={i} html={item} />
      ))}
    </Tag>
  );
}

type BoxProps = { title?: string; children: ReactNode };

/** Rumus atau definisi yang perlu diingat. */
export const Konsep = ({ title = "Konsep inti", children }: BoxProps) => (
  <aside className="mt-box mt-box--konsep">
    <Rich as="p" className="mt-box__title" html={title} />
    <div className="mt-box__body">{children}</div>
  </aside>
);

/** Kekeliruan yang sering terjadi. */
export const Awas = ({ title = "Awas keliru", children }: BoxProps) => (
  <aside className="mt-box mt-box--awas">
    <Rich as="p" className="mt-box__title" html={title} />
    <div className="mt-box__body">{children}</div>
  </aside>
);

/** Pembuka bab atau bagian: pertanyaan atau situasi yang memancing rasa ingin tahu. */
export const Pemantik = ({ title = "Mari mulai", children }: BoxProps) => (
  <aside className="mt-box mt-box--pemantik">
    <Rich as="p" className="mt-box__title" html={title} />
    <div className="mt-box__body">{children}</div>
  </aside>
);

/** Contoh soal; penyelesaian disembunyikan agar siswa mencoba dulu. */
export function Contoh({ title, soal, children }: { title: string; soal: string; children: ReactNode }) {
  return (
    <section className="mt-contoh">
      <Rich as="p" className="mt-contoh__title" html={title} />
      <Rich className="mt-contoh__soal" html={soal} />
      <details className="mt-contoh__sol">
        <summary>
          <span className="mt-contoh__closed">Coba dulu, lalu lihat penyelesaian</span>
          <span className="mt-contoh__open">Sembunyikan penyelesaian</span>
        </summary>
        <div className="mt-contoh__body">{children}</div>
      </details>
    </section>
  );
}

/** Tabel ringkas. Sel boleh memuat rumus. */
export function Tabel({ head, rows, caption }: { head: string[]; rows: string[][]; caption?: string }) {
  return (
    <div className="mt-tablewrap" role="region" aria-label={caption} tabIndex={0}>
      <table className="mt-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col">
                <Rich as="span" html={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>
                  <Rich as="span" html={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Ringkasan di akhir bab. */
export function Rangkuman({ items }: { items: string[] }) {
  return (
    <aside className="mt-box mt-box--rangkuman">
      <p className="mt-box__title">Rangkuman bab</p>
      <Daftar items={items} />
    </aside>
  );
}
