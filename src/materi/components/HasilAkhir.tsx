import { Link } from "react-router-dom";
import { babPath, findMateri } from "../materi.ts";
import { questionsOf } from "../questions/index.ts";
import { useMateri } from "../state/context";
import { summarize } from "../state/store.ts";

/** Ringkasan hasil seluruh cek poin, dengan saran bab yang perlu diulang. */
export function HasilAkhir() {
  const { slug, records } = useMateri();
  const materi = findMateri(slug);
  if (!materi) return null;
  const summary = summarize({ v: 1, cp: records }, questionsOf(slug));
  const pct = summary.total ? Math.round((summary.done / summary.total) * 100) : 0;

  // Bab yang perlu diulang: ada cek poin belum selesai, atau banyak yang tidak benar pada percobaan pertama.
  const weak = materi.bab
    .map((bab, i) => ({ bab, slot: summary.byBab[i + 1] }))
    .filter(({ slot }) => slot && slot.total > 0 && (slot.done < slot.total || slot.firstTry / slot.total < 0.6));

  return (
    <section className="mt-result" aria-label="Hasil belajarmu">
      <p className="mt-result__title">Hasil belajarmu</p>
      <p className="mt-result__big">
        <b>{summary.done}</b> dari {summary.total} cek poin selesai
        <span> ({pct}%)</span>
      </p>
      <p className="mt-result__sub">{summary.firstTry} di antaranya benar pada percobaan pertama tanpa petunjuk.</p>
      {summary.done < summary.total ? (
        <p className="mt-result__sub">Masih ada cek poin yang belum dijawab. Kamu bisa kembali ke bab terkait kapan saja.</p>
      ) : weak.length === 0 ? (
        <p className="mt-result__sub">Pemahamanmu sudah kuat di semua bab. Lanjutkan ke latihan soal untuk menguji penerapannya.</p>
      ) : null}
      {weak.length > 0 && (
        <>
          <p className="mt-result__sub">Bagian yang layak diulang:</p>
          <ul className="mt-result__list">
            {weak.map(({ bab, slot }) => (
              <li key={bab.slug}>
                <Link to={babPath(slug, bab.slug)}>{bab.title}</Link>
                <span>
                  {slot.done}/{slot.total} selesai, {slot.firstTry} langsung benar
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
