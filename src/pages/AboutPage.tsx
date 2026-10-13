import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import "./LandingPage.css"; // dasar tema 1729 (kelas .lp-*)
import "./AboutPage.css";

export default function AboutPage() {
  useSeo({
    title: "Tentang 1729",
    description:
      "Mengapa 1729 dibuat: simulasi dan presentasi interaktif untuk membantu guru menjelaskan konsep matematika SMP dan SMA.",
    path: "/about",
  });

  return (
    <div className="lp ab">
      <SiteHeader />

      <main>
        <section className="lp-hero ab-hero">
          <div className="lp-wrap">
            <p className="lp-eyebrow">Tentang</p>
            <h1 className="ab-title">
              <span>Matematika yang</span> <span className="lp-hero__accent">bisa dilihat.</span>
            </h1>
          </div>
        </section>

        <section className="lp-section lp-section--wash ab-letter">
          <div className="lp-wrap ab-grid">
            <p className="lp-eyebrow ab-grid__label">Latar belakang</p>

            <div className="ab-prose">
              <p className="ab-lead">
                Tidak semua konsep matematika mudah dipahami lewat penjelasan saja. Limit, turunan, dan integral
                menuntut imajinasi yang kuat untuk membayangkan apa yang sebenarnya terjadi.
              </p>
              <p>
                Materi aljabar dan geometri pun akan jauh lebih mudah dicerna bila bentuknya bisa dilihat langsung pada
                koordinat kartesius.
              </p>
              <p>
                GeoGebra dan Desmos sudah dikenal luas untuk keperluan ini. Namun bagi banyak guru, membangun simulasi
                di kedua aplikasi tersebut bukan pekerjaan yang ringan.
              </p>
              <p>
                1729 hadir untuk menjawab masalah itu. Beragam simulasi matematika untuk materi SMP dan SMA sudah siap
                dipakai untuk menjelaskan konsep tertentu, tanpa perlu dibuat dari nol.
              </p>
              <p>
                Keunggulan lainnya adalah presentasi interaktif berbasis simulasi. Setiap langkah penjelasan
                menggerakkan simulasinya, sehingga guru terbantu saat mengajarkan konsep yang sulit dan membutuhkan
                imajinasi.
              </p>
              <p>
                Saya juga melihat pemerintah banyak membantu pengadaan papan tulis digital di sekolah. Platform ini
                sangat cocok dipakai pada media tersebut.
              </p>

              <div className="lp-cta">
                <Link to="/simulasi" className="lp-btn lp-btn--solid">
                  Jelajahi simulasi <span aria-hidden>→</span>
                </Link>
                <Link to="/slides" className="lp-btn lp-btn--ghost">
                  Lihat slides
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <div className="lp-wrap ab-grid">
            <p className="lp-eyebrow ab-grid__label">Dari pengembang</p>

            <div className="ab-sign">
              <p className="ab-sign__hi">Salam dari saya,</p>
              <p className="ab-sign__name">Toriq Afanudin</p>
              <p className="ab-sign__role">Matematikawan sekaligus programmer</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
