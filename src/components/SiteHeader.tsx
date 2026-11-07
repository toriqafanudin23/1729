import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { InstallButton } from "./InstallButton";
import "./SiteHeader.css";

/* Satu navbar untuk seluruh halaman. Simulasi adalah fitur utama,
   jadi diletakkan tepat setelah Beranda; sisanya pelengkap. */
const NAV_ITEMS = [
  { label: "Beranda", to: "/", end: true },
  { label: "Simulasi", to: "/simulasi" },
  { label: "Materi", to: "/materi" },
  { label: "Presentasi", to: "/slides" },
  { label: "Latihan", to: "/latihan" },
  { label: "Tentang", to: "/about" },
];

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M6 24h20M8 6v20" stroke="#faf9f5" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M7 22c4-1 6-12 10-12s5 8 9 8" stroke="#faf9f5" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="10" r="2.6" fill="#30302e" stroke="#faf9f5" strokeWidth="1.4" />
    </svg>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="Lab Simulasi Matematika, ke beranda" onClick={() => setMenuOpen(false)}>
          <BrandMark className="site-header__mark" />
          <span className="site-header__name">
            Lab Simulasi <span>Matematika</span>
          </span>
        </Link>

        <nav
          className={`site-header__nav${menuOpen ? " site-header__nav--open" : ""}`}
          id="site-navigation"
          aria-label="Navigasi utama"
        >
          <div className="site-header__links">
            {NAV_ITEMS.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `site-header__link${isActive ? " is-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Pojok kanan atas: tombol pasang PWA (jika tersedia) + menu mobile */}
        <div className="site-header__actions">
          <InstallButton />
          <button
            className="site-header__menu-toggle"
            type="button"
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-controls="site-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </header>
  );
}
