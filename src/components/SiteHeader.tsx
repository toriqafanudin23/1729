import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./SiteHeader.css";

const NAV_ITEMS = [
  { label: "Beranda", to: "/", end: true },
  { label: "Simulasi", to: "/simulasi" },
  { label: "Presentasi", to: "/slides" },
  { label: "Latihan", to: "/latihan" },
];

export function SiteHeader({ variant = "default" }: { variant?: "default" | "hero" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const displayName = user ? user.name || user.email : "";

  return (
    <header className={`site-header${variant === "hero" ? " site-header--hero" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="1729 beranda">
          1729
        </Link>

        <button
          className="site-header__menu-toggle"
          type="button"
          aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>

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
          {user ? (
            <div className="site-header__account">
              <span className="site-header__avatar" aria-hidden="true">{displayName.trim().charAt(0)}</span>
              <span className="site-header__account-name">{displayName}</span>
              <button
                className="site-header__login site-header__login--ghost"
                type="button"
                onClick={async () => { await logout(); setMenuOpen(false); navigate("/"); }}
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link className="site-header__login" to="/login" onClick={() => setMenuOpen(false)} aria-busy={loading}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
