import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import { SIMULATIONS, simulationPath } from "./simulations";
import "./pages.css";

/* Gambar kecil kartu: kisi dan sumbu seperti di katalog Slides,
   dengan simbol topik (glyph) di tengah. SVG statis, ringan. */
const GRID_X = [40, 80, 120, 160, 200, 240, 280];
const GRID_Y = [20, 60, 100, 140];

function Thumb({ glyph, label }: { glyph: string; label: string }) {
  const size = glyph.length > 8 ? 30 : glyph.length > 4 ? 44 : 72;
  return (
    <svg viewBox="0 0 320 180" className="sp-thumb" role="img" aria-label={label}>
      <g stroke="#e2e8f0" strokeWidth="1">
        {GRID_X.map((x) => (
          <line key={`x${x}`} x1={x} y1="0" x2={x} y2="180" />
        ))}
        {GRID_Y.map((y) => (
          <line key={`y${y}`} x1="0" y1={y} x2="320" y2={y} />
        ))}
      </g>
      <g stroke="#94a3b8" strokeWidth="1.25">
        <line x1="0" y1="90" x2="320" y2="90" />
        <line x1="160" y1="0" x2="160" y2="180" />
      </g>
      <text
        x="160"
        y="90"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size}
        className="sp-thumb__glyph"
        stroke="#f8fafc"
        strokeWidth="8"
        paintOrder="stroke"
      >
        {glyph}
      </text>
    </svg>
  );
}

export default function CatalogPage() {
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

          <ul className="sp-cards" aria-label="Daftar simulasi">
            {SIMULATIONS.map((s, index) => (
              <li key={s.slug}>
                <Link
                  to={simulationPath(s.slug)}
                  className="sp-card"
                  aria-labelledby={`sim-${s.slug}-judul`}
                  aria-describedby={`sim-${s.slug}-ringkasan`}
                >
                  <div className="sp-card__thumb" aria-hidden>
                    <Thumb glyph={s.glyph} label={s.title} />
                  </div>
                  <div className="sp-card__body">
                    <p className="sp-card__meta">
                      <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                      <span>{s.category}</span>
                    </p>
                    <h3 className="sp-card__title" id={`sim-${s.slug}-judul`}>
                      {s.title}
                    </h3>
                    <p className="sp-card__summary" id={`sim-${s.slug}-ringkasan`}>
                      {s.summary}
                    </p>
                    <div className="sp-card__foot">
                      <span>Simulasi interaktif</span>
                      <span className="sp-card__go">
                        Coba <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
