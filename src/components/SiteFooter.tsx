import { Link, NavLink } from "react-router-dom";
import "./SiteFooter.css";

const navigation = [
  { label: "Beranda", to: "/", end: true },
  { label: "Tentang", to: "/about" },
  { label: "Simulasi", to: "/simulasi" },
  { label: "Latihan soal", to: "/latihan" },
  { label: "Slides", to: "/slides" },
//   { label: "Toko", to: "/toko" },
  { label: "Pesan website", to: "/pesan-website" },
];

const SOCIALS = [
  {
    label: "Instagram @skuybuntuu",
    href: "https://instagram.com/skuybuntuu",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "WhatsApp 0882-2617-9468",
    href: "https://wa.me/6288226179468",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21l1.65-4.8A9 9 0 1 1 8.1 19.4L3 21z" />
        <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.2-1.8-1-.8.6c-.9-.4-1.6-1.1-2-2l.6-.8-1-1.8L9 9.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Email pesan.math1729@gmail.com",
    href: "mailto:pesan.math1729@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3.5 7l8.5 6 8.5-6" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer id="footer" className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__identity">
          <Link className="site-footer__brand" to="/" aria-label="1729 beranda">
            1729
          </Link>
          <p>Memahami matematika secara visual.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Navigasi footer">
          {navigation.map(({ label, to, end }) => (
            <NavLink key={to} to={to} end={end}>
              {label}
            </NavLink>
          ))}
          <a href="https://kelas1729.vercel.app/">Website lama</a>
        </nav>

        <div className="site-footer__social">
          <p className="site-footer__social-title">Hubungi kami</p>
          <ul className="site-footer__social-list">
            {SOCIALS.map(({ label, href, icon }) => (
              <li key={href}>
                <a
                  className="site-footer__social-link"
                  href={href}
                  aria-label={label}
                  title={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="site-footer__legal">© {new Date().getFullYear()} 1729. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
