import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CATALOG_PATH, SIMULATIONS, simulationPath } from "./simulations";
import "./pages.css";

export default function CatalogPage() {
  useEffect(() => {
    document.title = "Simulasi · 1729";
  }, []);

  return (
    <div className="sp">
      <header className="sp-nav">
        <div className="sp-wrap sp-nav__in">
          <Link to="/" className="sp-brand" aria-label="1729 beranda">
            1729
          </Link>
          <nav className="sp-nav__links" aria-label="Navigasi utama">
            <Link to={CATALOG_PATH} aria-current="page">
              Simulasi
            </Link>
          </nav>
        </div>
      </header>

      <main className="sp-catalog">
        <div className="sp-wrap">
          <p className="sp-eyebrow">Jelajahi</p>
          <h1 className="sp-h1">Satu tempat untuk banyak topik.</h1>
          <p className="sp-lead sp-catalog__lead">
            {SIMULATIONS.length} simulasi interaktif. Pilih satu topik untuk mulai mencoba.
          </p>

          <ul className="sp-list" aria-label="Daftar simulasi">
            {SIMULATIONS.map((s, index) => (
              <li key={s.slug}>
                <Link
                  to={simulationPath(s.slug)}
                  aria-labelledby={`sim-${s.slug}-judul`}
                  aria-describedby={`sim-${s.slug}-ringkasan`}
                >
                  <span className="sp-list__top">
                    <span className="sp-list__no" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="sp-list__category">{s.category}</span>
                    <span className="sp-list__glyph" aria-hidden>
                      {s.glyph}
                    </span>
                  </span>
                  <span className="sp-list__title" id={`sim-${s.slug}-judul`}>
                    {s.title}
                  </span>
                  <span className="sp-list__summary" id={`sim-${s.slug}-ringkasan`}>
                    {s.summary}
                  </span>
                  <span className="sp-list__arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
