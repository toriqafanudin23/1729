import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import "./pages.css";

export default function NotFoundPage() {
  useSeo({
    title: "Halaman tidak ditemukan",
    description: "Halaman yang kamu cari tidak ada. Jelajahi simulasi matematika interaktif dan latihan soal di 1729.",
    path: window.location.pathname,
    noindex: true,
  });

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