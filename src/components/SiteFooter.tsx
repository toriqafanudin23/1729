import { Link, NavLink } from "react-router-dom";
import "./SiteFooter.css";

const navigation = [
  { label: "Beranda", to: "/", end: true },
  { label: "Simulasi", to: "/simulasi" },
  { label: "Latihan soal", to: "/latihan" },
//   { label: "Toko", to: "/toko" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__identity">
          <Link className="site-footer__brand" to="/" aria-label="1729 beranda">
            1729
          </Link>
          <p>Memahami matematika secara visual.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Navigasi utama">
          {navigation.map(({ label, to, end }) => (
            <NavLink key={to} to={to} end={end}>
              {label}
            </NavLink>
          ))}
        </nav>

        <a className="site-footer__contact" href="mailto:pesan.math1729@gmail.com">
          Kirim email <span aria-hidden="true">↗</span>
        </a>

        <p className="site-footer__legal">© {new Date().getFullYear()} 1729</p>
      </div>
    </footer>
  );
}