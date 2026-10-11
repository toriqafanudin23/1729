import { Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { CATALOG_PATH, SIMULATIONS, findSimulation, simulationPath } from "./simulations";
import NotFoundPage from "./NotFoundPage";
import "./pages.css";

/**
 * Halaman satu simulasi.
 * Router-agnostik: terima `slug` sebagai prop.
 * Contoh react-router:
 *   <Route path="/simulasi/:slug" element={<SimulationRoute />} />
 *   function SimulationRoute() { return <SimulationPage slug={useParams().slug} />; }
 */
export default function SimulationPage({ slug }: { slug?: string }) {
  const sim = findSimulation(slug);

  useEffect(() => {
    if (sim) document.title = `${sim.title} · 1729`;
  }, [sim]);

  const header = (
    <header className="sp-nav">
      <div className="sp-wrap sp-wrap--wide sp-nav__in">
        <Link to="/" className="sp-brand" aria-label="1729 beranda">
          1729
        </Link>
        <nav className="sp-nav__links" aria-label="Navigasi utama">
          <Link to={CATALOG_PATH}>Simulasi</Link>
        </nav>
      </div>
    </header>
  );

  if (!sim) {
    return <NotFoundPage />;
  }

  const Simulation = sim.component;
  const others = SIMULATIONS.filter((s) => s.slug !== sim.slug).slice(0, 3);

  return (
    <div className="sp">
      {header}

      <main className="sp-wrap sp-wrap--wide sp-sim">
        <nav className="sp-crumbs" aria-label="Jejak halaman">
          <Link to={CATALOG_PATH}>Simulasi</Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{sim.title}</span>
        </nav>

        <div className="sp-sim__head">
          <h1 className="sp-h1 sp-h1--sm">{sim.title}</h1>
          <p className="sp-sim__summary">{sim.summary}</p>
        </div>

        <div className="sp-stage">
          <Suspense fallback={<div className="sp-loading">Memuat simulasi…</div>}>
            <Simulation key={sim.slug} />
          </Suspense>
        </div>

        <section className="sp-below" aria-label="Tentang simulasi">
          <div>
            <h2 className="sp-h3">Konsep yang dipelajari</h2>
            <ul className="sp-tags">
              {sim.concepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {others.length > 0 && (
            <div>
              <h2 className="sp-h3">Simulasi lainnya</h2>
              <ul className="sp-others">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link to={simulationPath(s.slug)}>
                      <span>{s.title}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
