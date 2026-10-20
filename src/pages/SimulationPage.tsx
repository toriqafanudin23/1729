import { Suspense } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { CATALOG_PATH, SIMULATIONS, findSimulation, simulationPath } from "./simulations";
import NotFoundPage from "./NotFoundPage";
import { useSeo } from "../useSeo";
import { simulationSeo } from "../seoText";
import { CpList } from "../components/CpFilter";
import { CP_SIMULASI } from "../curriculum/cp";
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
  const seo = sim ? simulationSeo(sim) : null;

  // Hook harus dipanggil sebelum return awal. Slug tak dikenal => noindex.
  useSeo(
    sim && seo
      ? { title: seo.title, description: seo.description, path: simulationPath(sim.slug), jsonLd: seo.jsonLd }
      : {
          title: "Simulasi tidak ditemukan",
          description: "Simulasi yang kamu cari tidak ada. Jelajahi daftar simulasi matematika interaktif di 1729.",
          path: `${CATALOG_PATH}/${slug ?? ""}`,
          noindex: true,
        },
  );

  if (!sim) {
    return <NotFoundPage />;
  }

  const Simulation = sim.component;
  const others = SIMULATIONS.filter((s) => s.slug !== sim.slug).slice(0, 3);

  return (
    <div className="sp">
      <SiteHeader />

      <main className="sp-wrap sp-wrap--wide sp-sim">
        <nav className="sp-crumbs" aria-label="Jejak halaman">
          <Link to={CATALOG_PATH}>Simulasi</Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{sim.title}</span>
        </nav>

        <div className="sp-sim__head">
          <h1 className="sp-h1 sp-h1--sm">{sim.title}</h1>
          <p className="sp-sim__summary">{sim.summary}</p>
          {sim.slug === "fungsi-kuadrat" && (
            <a
              href="https://classroom.google.com/c/ODc0MDg4MzY3MjM0?cjc=6nhuoks6"
              target="_blank"
              rel="noreferrer"
              className="sp-classroom-link"
            >
              Pembelajaran terintegrasi di Google Classroom <span aria-hidden>↗</span>
            </a>
          )}
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

          {CP_SIMULASI[sim.slug] && (
            <div>
              <h2 className="sp-h3">Capaian Pembelajaran</h2>
              <CpList tags={CP_SIMULASI[sim.slug]} />
            </div>
          )}

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
      <SiteFooter />
    </div>
  );
}
