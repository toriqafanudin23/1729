import { Suspense, useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useSeo } from "../../useSeo";
import { DECKS, findDeck } from "../slides";
import { useFullscreen } from "../common/useFullscreen";
import "../../pages/LandingPage.css"; // dasar tema 1729 (kelas .lp-*)
import "../styles/SlidesPages.css";

const IconEnter = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
  </svg>
);
const IconExit = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
  </svg>
);

export default function SlidePresentPage() {
  const { slug } = useParams();
  const deck = findDeck(slug);

  const stageRef = useRef<HTMLDivElement>(null);
  const { active, fallback, toggle } = useFullscreen(stageRef);
  const [chrome, setChrome] = useState(true);

  useSeo({
    title: deck ? `${deck.title} | 1729 Slides` : "1729 Slides",
    description: deck?.summary ?? "Presentasi matematika interaktif dari 1729.",
    path: `/slides/${slug ?? ""}`,
  });

  // pintasan F: ditangkap lebih dulu agar tidak bentrok dengan pintasan bawaan reveal.js
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "f" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && (t as HTMLInputElement).type !== "range") return;
      e.preventDefault();
      e.stopPropagation();
      void toggle();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [toggle]);

  // tombol keluar memudar bila tidak ada gerakan pointer selama layar penuh
  useEffect(() => {
    if (!active) return;
    const el = stageRef.current;
    let timer = 0;
    const wake = () => {
      setChrome(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setChrome(false), 2500);
    };
    wake();
    el?.addEventListener("pointermove", wake);
    el?.addEventListener("pointerdown", wake);
    return () => {
      window.clearTimeout(timer);
      el?.removeEventListener("pointermove", wake);
      el?.removeEventListener("pointerdown", wake);
    };
  }, [active]);

  if (!deck) return <Navigate to="/slides" replace />;

  const Deck = deck.Component;
  const others = DECKS.filter((d) => d.slug !== deck.slug);

  return (
    <div className="lp sp">
      <SiteHeader />

      <main>
        <div className="sp-wrap">
          <header className="sp-head">
            <nav className="sp-crumb" aria-label="Navigasi">
              <Link to="/slides">Slides</Link>
              <span aria-hidden>/</span>
              <span>{deck.title}</span>
            </nav>
            <div className="sp-head__row">
              <div>
                <p className="lp-eyebrow">{deck.category}</p>
                <h1>{deck.title}</h1>
              </div>
              <button type="button" className="lp-btn lp-btn--solid" onClick={() => void toggle()} aria-pressed={active}>
                <IconEnter /> Layar penuh <kbd>F</kbd>
              </button>
            </div>
          </header>

          <div ref={stageRef} className={`sp-stage${active ? " is-active" : ""}${fallback ? " is-fake" : ""}`}>
            <Suspense fallback={<div className="sp-loading">Memuat slide…</div>}>
              <Deck key={deck.slug} />
            </Suspense>

            {active && (
              <button
                type="button"
                className={`sp-exit${chrome ? "" : " is-hidden"}`}
                onClick={() => void toggle()}
                aria-label="Keluar dari layar penuh"
              >
                <IconExit /> Keluar
              </button>
            )}
          </div>

          <p className="sp-hint">
            <span><kbd>→</kbd> atau <kbd>Spasi</kbd> melangkah</span>
            <span><kbd>←</kbd> mundur</span>
            <span><kbd>F</kbd> layar penuh</span>
            <span className="sp-hint__phone">Di ponsel, putar ke mode lanskap.</span>
          </p>

          <section className="sp-about">
            <div>
              <p className="lp-eyebrow">Tentang materi</p>
              <p className="sp-about__text">{deck.summary}</p>
              <ul className="sl-chips" aria-label="Konsep yang dibahas">
                {deck.concepts.map((c) => (
                  <li className="sl-chip" key={c}>{c}</li>
                ))}
              </ul>
              <p className="sp-about__meta">{deck.slides} slide · ±{deck.minutes} menit · {deck.level}</p>
            </div>

            {others.length > 0 && (
              <div>
                <p className="lp-eyebrow">Materi lainnya</p>
                <ul className="sp-others">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link to={`/slides/${o.slug}`} className="lp-link">
                        {o.title} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
