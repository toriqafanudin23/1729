import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import { SIMULATIONS, simulationPath } from "./simulations";
import { isSimulationPublic } from "../auth/accessPolicy";
import { LoginAccessPrompt } from "../components/LoginAccessPrompt";
import { SimThumb } from "./SimThumbs";
import "./pages.css";

export default function CatalogPage() {
  const publicSimulations = SIMULATIONS.filter((simulation) => isSimulationPublic(simulation.slug));
  const memberSimulations = SIMULATIONS.filter((simulation) => !isSimulationPublic(simulation.slug));
  const renderSimulationCard = (s: (typeof SIMULATIONS)[number], index: number) => (
    <li key={s.slug}>
      <Link
        to={simulationPath(s.slug)}
        className="sp-card"
        aria-labelledby={`sim-${s.slug}-judul`}
        aria-describedby={`sim-${s.slug}-ringkasan`}
      >
        <div className="sp-card__thumb" aria-hidden>
          <SimThumb slug={s.slug} title={s.title} glyph={s.glyph} />
        </div>
        <div className="sp-card__body">
          <p className="sp-card__meta">
            <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            <span>{s.category}</span>
            <span className={`sp-card__access${isSimulationPublic(s.slug) ? "" : " sp-card__access--member"}`}>
              {isSimulationPublic(s.slug) ? "Tanpa login" : "Perlu login"}
            </span>
          </p>
          <h3 className="sp-card__title" id={`sim-${s.slug}-judul`}>{s.title}</h3>
          <p className="sp-card__summary" id={`sim-${s.slug}-ringkasan`}>{s.summary}</p>
          <div className="sp-card__foot">
            <span>Simulasi interaktif</span>
            <span className="sp-card__go">Coba <span aria-hidden>→</span></span>
          </div>
        </div>
      </Link>
    </li>
  );

  useSeo({
    title: "Simulasi Matematika Interaktif",
    description: `${SIMULATIONS.length} simulasi interaktif: fungsi kuadrat, trigonometri, turunan, integral, vektor, irisan kerucut, dan lainnya.`,
    path: "/simulasi",
  });

  return (
    <div className="sp">
      <SiteHeader />

      <main className="sp-catalog">
        <div className="sp-wrap">
          <p className="sp-eyebrow">Jelajahi</p>
          <h1 className="sp-h1">Satu tempat untuk banyak topik.</h1>
          <p className="sp-lead sp-catalog__lead">
            {SIMULATIONS.length} simulasi interaktif. Pilih satu topik untuk mulai mencoba.
          </p>

          <ul className="sp-cards" aria-label="Simulasi tanpa login">
            {publicSimulations.map(renderSimulationCard)}
          </ul>
          {memberSimulations.length > 0 && (
            <>
              <LoginAccessPrompt
                title="Ingin melakukan lebih banyak simulasi?"
                description="Login atau daftar untuk membuka simulasi lainnya."
              />
              <ul className="sp-cards sp-cards--members" aria-label="Simulasi yang memerlukan login">
                {memberSimulations.map((s, index) => renderSimulationCard(s, publicSimulations.length + index))}
              </ul>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
