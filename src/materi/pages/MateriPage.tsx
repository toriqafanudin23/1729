import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CpList } from "../../components/CpFilter";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { CP_MATERI } from "../../curriculum/cp";
import NotFoundPage from "../../pages/NotFoundPage";
import { materiBabSeo, materiSeo } from "../../seoText";
import { useSeo } from "../../useSeo";
import { IconArrowLeft, IconArrowRight, IconCheck, IconList } from "../components/icons";
import { Rich } from "../components/Rich";
import { LESSONS } from "../lessons";
import { babPath, findBab, findMateri, materiPath, totalMinutes, type MateriMeta } from "../materi.ts";
import { questionsInBab, questionsOf } from "../questions/index.ts";
import { useMateri } from "../state/context";
import { MateriProvider } from "../state/MateriProvider";
import { summarize } from "../state/store.ts";
import "../../pages/pages.css";
import "../styles/materi.css";

export default function MateriPage() {
  const { slug, bab } = useParams();
  const materi = findMateri(slug);
  if (!materi) return <NotFoundPage />;
  return (
    <MateriProvider slug={materi.slug} babSlug={bab}>
      {bab ? <Reader materi={materi} babSlug={bab} /> : <Overview materi={materi} />}
    </MateriProvider>
  );
}

/* ───────── Peta bab (dipakai di panel samping dan laci seluler) ───────── */

function Roadmap({ materi, current, onNavigate }: { materi: MateriMeta; current?: string; onNavigate?: () => void }) {
  const { slug, records } = useMateri();
  const summary = summarize({ v: 1, cp: records }, questionsOf(slug));
  const pct = summary.total ? Math.round((summary.done / summary.total) * 100) : 0;

  return (
    <nav className="mt-rail__nav" aria-label={`Daftar bab ${materi.title}`}>
      <div className="mt-rail__progress">
        <p>
          <b>{summary.done}</b> dari {summary.total} cek poin
        </p>
        <div className="mt-minibar" role="img" aria-label={`Progres ${pct} persen`}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ol className="mt-rail__list">
        {materi.bab.map((b, i) => {
          const slot = summary.byBab[i + 1];
          const complete = slot && slot.total > 0 && slot.done === slot.total;
          return (
            <li key={b.slug}>
              <Link
                to={babPath(materi.slug, b.slug)}
                className={`mt-rail__item${current === b.slug ? " is-current" : ""}${complete ? " is-done" : ""}`}
                aria-current={current === b.slug ? "page" : undefined}
                onClick={onNavigate}
              >
                <span className="mt-rail__mark" aria-hidden="true">
                  {complete ? <IconCheck size={13} /> : i + 1}
                </span>
                <span className="mt-rail__text">
                  <span className="mt-rail__title">{b.title}</span>
                  {slot && (
                    <span className="mt-rail__sub">
                      {slot.done}/{slot.total} cek poin · {b.minutes} mnt
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ResetButton() {
  const { resetAll, records } = useMateri();
  if (Object.keys(records).length === 0) return null;
  return (
    <button
      type="button"
      className="mt-btn mt-btn--quiet mt-reset"
      onClick={() => {
        if (window.confirm("Hapus semua progres materi ini dari peramban? Tindakan ini tidak dapat dibatalkan.")) resetAll();
      }}
    >
      Hapus progres
    </button>
  );
}

/* ───────── Gambaran materi ───────── */

function Overview({ materi }: { materi: MateriMeta }) {
  const { slug, records } = useMateri();
  useSeo({ ...materiSeo(materi), path: materiPath(slug) });
  const summary = summarize({ v: 1, cp: records }, questionsOf(slug));
  const started = summary.done > 0;
  const lastSlug = useMemo(() => {
    // Bab pertama yang belum selesai; bila semua selesai, bab pertama.
    const idx = materi.bab.findIndex((_, i) => {
      const slot = summary.byBab[i + 1];
      return slot && slot.done < slot.total;
    });
    return materi.bab[idx < 0 ? 0 : idx].slug;
  }, [materi, summary]);

  return (
    <div className="sp mt-page">
      <SiteHeader />
      <main className="mt-overview">
        <div className="sp-wrap">
          <nav className="mt-crumb" aria-label="Jejak halaman">
            <Link to="/materi">Materi</Link> <span aria-hidden>/</span> <span>{materi.title}</span>
          </nav>
          <p className="sp-eyebrow">{materi.category} · {materi.kelas}</p>
          <h1 className="sp-h1">{materi.title}</h1>
          <p className="sp-lead">{materi.summary}</p>

          <div className="mt-hero__cta">
            <Link className="sp-btn sp-btn--solid" to={babPath(slug, started ? lastSlug : materi.bab[0].slug)}>
              {started ? "Lanjutkan belajar" : "Mulai belajar"}
            </Link>
            <ResetButton />
          </div>

          <dl className="mt-meta">
            <div>
              <dt>Isi</dt>
              <dd>{materi.bab.length} bab, {summary.total} cek poin</dd>
            </div>
            <div>
              <dt>Waktu</dt>
              <dd>sekitar {Math.round(totalMinutes(materi) / 10) * 10} menit</dd>
            </div>
            <div>
              <dt>Progres</dt>
              <dd>{summary.done}/{summary.total} selesai</dd>
            </div>
          </dl>

          <div className="mt-overview__cols">
            <section aria-labelledby="mt-tujuan">
              <h2 className="mt-h2" id="mt-tujuan">Tujuan pembelajaran</h2>
              <ul className="mt-list">
                {materi.tujuan.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <h2 className="mt-h2">Sebelum mulai</h2>
              <p className="mt-p">Sebaiknya kamu sudah dapat:</p>
              <ul className="mt-list">
                {materi.prasyarat.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="mt-babs">
              <h2 className="mt-h2" id="mt-babs">Isi bab</h2>
              <Roadmap materi={materi} />
            </section>
          </div>

          <section className="mt-overview__cp" aria-labelledby="mt-cp">
            <h2 className="mt-h2" id="mt-cp">Capaian Pembelajaran terkait</h2>
            <CpList tags={CP_MATERI[slug]} />
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ───────── Pembaca bab ───────── */

function Reader({ materi, babSlug }: { materi: MateriMeta; babSlug: string }) {
  const found = findBab(materi, babSlug);
  const { slug, records } = useMateri();
  const [drawer, setDrawer] = useState(false);
  const [nonce, setNonce] = useState(0);
  const { resetAll } = useMateri();

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  // Saat laci daftar bab terbuka, halaman di belakangnya tidak ikut ter-scroll.
  useEffect(() => {
    if (!drawer) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [drawer]);

  // Tutup laci saat pindah bab.
  useEffect(() => setDrawer(false), [babSlug]);

  const bab = found?.bab;
  useSeo({
    ...(found ? materiBabSeo(materi, found.bab, found.index) : { title: materi.title, description: materi.summary }),
    path: babPath(slug, babSlug),
  });

  if (!found || !bab) return <Navigate to={materiPath(slug)} replace />;

  const { index } = found;
  const Lesson = LESSONS[slug]?.[index];
  const prev = materi.bab[index - 1];
  const next = materi.bab[index + 1];
  const here = summarize({ v: 1, cp: records }, questionsInBab(slug, index + 1));
  const left = here.total - here.done;

  return (
    <div className="sp mt-page mt-reader">
      <SiteHeader />

      <div className="mt-mobilebar">
        <button type="button" className="mt-mobilebar__btn" aria-expanded={drawer} aria-controls="mt-drawer" onClick={() => setDrawer((o) => !o)}>
          <IconList size={18} />
          <span className="mt-mobilebar__no">
            Bab {index + 1}/{materi.bab.length}
          </span>
          <span className="mt-mobilebar__title">{bab.title}</span>
          <span className={`mt-mobilebar__count${here.total > 0 && left === 0 ? " is-done" : ""}`} aria-label={`${here.done} dari ${here.total} cek poin selesai`}>
            {here.done}/{here.total}
          </span>
        </button>
        <span className="mt-mobilebar__bar" aria-hidden="true">
          <span style={{ width: `${here.total ? Math.round((here.done / here.total) * 100) : 0}%` }} />
        </span>
      </div>
      {drawer && (
        <div className="mt-drawer" id="mt-drawer">
          <button type="button" className="mt-drawer__scrim" aria-label="Tutup daftar bab" onClick={() => setDrawer(false)} />
          <div className="mt-drawer__panel">
            <Roadmap materi={materi} current={babSlug} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="mt-shell">
        <aside className="mt-rail" aria-label="Navigasi materi">
          <Link to={materiPath(slug)} className="mt-rail__home">
            <IconArrowLeft size={14} /> {materi.title}
          </Link>
          <Roadmap materi={materi} current={babSlug} />
          {Object.keys(records).length > 0 && (
            <button
              type="button"
              className="mt-btn mt-btn--quiet mt-reset"
              onClick={() => {
                if (window.confirm("Hapus semua progres materi ini dari peramban? Tindakan ini tidak dapat dibatalkan.")) {
                  resetAll();
                  setNonce((n) => n + 1);
                }
              }}
            >
              Hapus progres
            </button>
          )}
        </aside>

        <main className="mt-main" id="isi-bab">
          <article className="mt-article">
            <header className="mt-article__head">
              <p className="mt-article__no">Bab {index + 1} dari {materi.bab.length}</p>
              <h1 className="mt-article__title">{bab.title}</h1>
              <section className="mt-goals" aria-label="Tujuan bab ini">
                <p className="mt-goals__title">Setelah bab ini, kamu dapat:</p>
                <ul>
                  {bab.tujuan.map((t) => (
                    <Rich as="li" key={t} html={t} />
                  ))}
                </ul>
              </section>
            </header>

            <div className="mt-content" key={nonce}>
              <Suspense fallback={<p className="mt-loading" role="status">Memuat bab…</p>}>{Lesson ? <Lesson /> : <p className="mt-missing">Isi bab ini belum tersedia.</p>}</Suspense>
            </div>

            <footer className="mt-pager">
              {left > 0 && next && (
                <p className="mt-pager__note" role="status">
                  Masih {left} cek poin belum dijawab di bab ini. Kamu tetap bisa lanjut dan kembali nanti.
                </p>
              )}
              <div className="mt-pager__row">
                {prev ? (
                  <Link className="mt-pager__link mt-pager__link--prev" to={babPath(slug, prev.slug)}>
                    <IconArrowLeft size={16} />
                    <span>
                      <small>Sebelumnya</small>
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link className="mt-pager__link mt-pager__link--next" to={babPath(slug, next.slug)}>
                    <span>
                      <small>Berikutnya</small>
                      {next.title}
                    </span>
                    <IconArrowRight size={16} />
                  </Link>
                ) : (
                  <Link className="mt-pager__link mt-pager__link--next" to="/materi">
                    <span>
                      <small>Selesai</small>
                      Kembali ke katalog materi
                    </span>
                    <IconArrowRight size={16} />
                  </Link>
                )}
              </div>
            </footer>
          </article>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
