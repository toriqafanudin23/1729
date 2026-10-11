import { Link } from "react-router-dom";
import { CATALOG_PATH, SIMULATIONS, simulationPath } from "./simulations";
import "./pages.css";

export default function CatalogPage() {
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

      <main className="sp-wrap sp-catalog">
        <h1 className="sp-h1">Simulasi</h1>
        <ul className="sp-list">
          {SIMULATIONS.map((s) => (
            <li key={s.slug}>
              <Link to={simulationPath(s.slug)}>
                <span>{s.title}</span>
                <span className="sp-list__arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}