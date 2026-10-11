import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CATALOG_PATH } from "./simulations";
import "./pages.css";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 · 1729";
  }, []);

  return (
    <div className="sp">
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
      <main className="sp-wrap sp-notfound">
        <p className="sp-eyebrow">404</p>
        <h1 className="sp-h1">Halaman tidak ditemukan.</h1>
        <p className="sp-lead">Alamat yang kamu buka tidak cocok dengan halaman mana pun.</p>
        <Link to="/" className="sp-btn sp-btn--solid">
          Kembali ke beranda
        </Link>
      </main>
    </div>
  );
}