import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import "./pages.css";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 · 1729";
  }, []);

  return (
    <div className="sp">
      <SiteHeader />
      <main className="sp-wrap sp-notfound">
        <p className="sp-eyebrow">404</p>
        <h1 className="sp-h1">Halaman tidak ditemukan.</h1>
        <p className="sp-lead">Alamat yang kamu buka tidak cocok dengan halaman mana pun.</p>
        <Link to="/" className="sp-btn sp-btn--solid">
          Kembali ke beranda
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}