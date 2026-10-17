import { Suspense } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { CATALOG_PATH, SIMULATIONS, findSimulation, simulationPath } from "./simulations";
import NotFoundPage from "./NotFoundPage";
import { fitSeoDescription, useSeo, breadcrumb } from "../useSeo";
import { CpList } from "../components/CpFilter";
import { CP_SIMULASI, cpLabel } from "../curriculum/cp";
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
  const description = fitSeoDescription(
    sim?.summary ?? "Simulasi yang kamu cari tidak ada. Jelajahi daftar simulasi matematika interaktif di 1729.",
  );

  // Hook harus dipanggil sebelum return awal. Slug tak dikenal => noindex.
  useSeo(
    sim
      ? {
          title: `${sim.title}: Simulasi Interaktif`,
          description,
          path: simulationPath(sim.slug),
          jsonLd: [
            {
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: `${sim.title}: Simulasi Interaktif`,
              description,
              url: `https://1729.blog${simulationPath(sim.slug)}`,
              inLanguage: "id-ID",
              learningResourceType: "Simulasi interaktif",
              interactivityType: "active",
              isAccessibleForFree: true,
              teaches: sim.concepts,
              educationalAlignment: (CP_SIMULASI[sim.slug] ?? []).map((tag) => ({
                "@type": "AlignmentObject",
                alignmentType: "teaches",
                educationalFramework: "Capaian Pembelajaran Matematika Kurikulum Merdeka",
                targetName: `${cpLabel(tag)}: ${tag.fokus}`,
              })),
              about: sim.category,
              isPartOf: { "@id": "https://1729.blog/#website" },
            },
            breadcrumb([
              { name: "Beranda", path: "/" },
              { name: "Simulasi", path: CATALOG_PATH },
              { name: sim.title, path: simulationPath(sim.slug) },
            ]),
          ],
        }
      : {
          title: "Simulasi tidak ditemukan",
          description,
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
