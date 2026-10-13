import { Link, useLocation } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import "./pages.css";

/* Ilustrasi: grafik y = 1/x yang "putus" di sumbu, dengan satu titik kosong
   (titik yang tidak ditemukan). Dihitung sekali; SVG statis dan ringan. */
const O = { x: 200, y: 160 }; // titik asal (piksel)
const U = 40; // satu satuan = 40 piksel
const branch = (sign: 1 | -1) =>
  Array.from({ length: 40 }, (_, i) => {
    const u = 0.26 + (i * (4.4 - 0.26)) / 39;
    return `${(O.x + sign * U * u).toFixed(1)},${(O.y - sign * (U / u)).toFixed(1)}`;
  }).join(" ");
const BRANCH_POS = branch(1);
const BRANCH_NEG = branch(-1);
const HOLE = { x: O.x + 2 * U, y: O.y - U / 2 }; // titik pada u = 2
const GRID_X = Array.from({ length: 9 }, (_, i) => i * U + 40);
const GRID_Y = Array.from({ length: 7 }, (_, i) => i * U + 40);

function Plot() {
  return (
    <svg viewBox="0 0 400 320" className="sp-nf__plot" aria-hidden focusable="false">
      <g stroke="#e2e8f0" strokeWidth="1">
        {GRID_X.map((x) => (
          <line key={`x${x}`} x1={x} y1="0" x2={x} y2="320" />
        ))}
        {GRID_Y.map((y) => (
          <line key={`y${y}`} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>
      <g stroke="#94a3b8" strokeWidth="1.5">
        <line x1="0" y1={O.y} x2="400" y2={O.y} />
        <line x1={O.x} y1="0" x2={O.x} y2="320" />
      </g>

      <g fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={BRANCH_POS} />
        <polyline points={BRANCH_NEG} />
      </g>

      <g stroke="#64748b" strokeWidth="1.25" strokeDasharray="4 4">
        <line x1={O.x} y1={HOLE.y} x2={HOLE.x} y2={HOLE.y} />
        <line x1={HOLE.x} y1={HOLE.y} x2={HOLE.x} y2={O.y} />
      </g>
      <circle cx={HOLE.x} cy={HOLE.y} r="7" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
      <text x={HOLE.x + 14} y={HOLE.y - 12} className="sp-nf__label">
        (?, ?)
      </text>
    </svg>
  );
}

export default function NotFoundPage() {
  const { pathname } = useLocation();

  useSeo({
    title: "Halaman tidak ditemukan",
    description: "Halaman yang kamu cari tidak ada. Jelajahi simulasi matematika interaktif dan latihan soal di 1729.",
    path: pathname,
    noindex: true,
  });

  return (
    <div className="sp">
      <SiteHeader />

      <main className="sp-nf">
        <div className="sp-wrap sp-nf__grid">
          <div className="sp-nf__copy">
            <p className="sp-eyebrow">Galat 404</p>
            <h1 className="sp-nf__title">
              <span>Titik ini</span> <span className="sp-nf__accent">tak terdefinisi.</span>
            </h1>
            <p className="sp-lead">
              Halaman yang kamu buka tidak ada atau sudah dipindahkan. Periksa lagi alamatnya, atau mulai dari salah
              satu tempat di bawah.
            </p>

            <p className="sp-nf__path">
              <span aria-hidden>→</span> <code>{pathname}</code>
            </p>

            <div className="sp-nf__cta">
              <Link to="/" className="sp-btn sp-btn--solid">
                Kembali ke beranda
              </Link>
              <Link to="/simulasi" className="sp-btn sp-btn--ghost">
                Jelajahi simulasi
              </Link>
              <Link to="/slides" className="sp-btn sp-btn--ghost">
                Lihat slides
              </Link>
            </div>
          </div>

          <div className="sp-nf__art">
            <Plot />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}