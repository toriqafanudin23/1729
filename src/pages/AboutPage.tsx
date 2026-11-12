import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSeo } from "../useSeo";
import { ABOUT_SEO } from "../seoText";
import "./LandingPage.css"; // dasar tema 1729 (kelas .lp-*)
import "./AboutPage.css";

export default function AboutPage() {
  useSeo({ ...ABOUT_SEO, path: "/about" });

  return (
    <div className="lp ab">
      <SiteHeader />

      <main>
        <section className="lp-hero ab-hero">
          <div className="lp-wrap">
            <p className="lp-eyebrow">Tentang Lab Simulasi Matematika</p>
            <h1 className="ab-title">
              <span>Simulasi yang sudah siap,</span> <span className="lp-hero__accent">tinggal dipakai mengajar.</span>
            </h1>
          </div>
        </section>

        <section className="lp-section lp-section--wash ab-letter">
          <div className="lp-wrap ab-grid">
            <p className="lp-eyebrow ab-grid__label">Tujuan</p>

            <div className="ab-prose">
              <p className="ab-lead">
                Lab Simulasi Matematika dibuat untuk menggantikan GeoGebra dan Desmos dalam kegiatan mengajar, dengan
                satu keunggulan: simulasinya sudah tersedia sesuai materi.
              </p>
              <p>
                Tidak semua konsep matematika mudah dipahami lewat penjelasan saja. Limit, turunan, dan integral
                menuntut imajinasi yang kuat. Materi aljabar dan geometri pun jauh lebih mudah dicerna bila bentuknya
                bisa dilihat langsung pada koordinat kartesius.
              </p>
              <p>
                GeoGebra dan Desmos sudah dikenal luas untuk keperluan ini. Namun bagi banyak guru, membangun simulasi
                di kedua aplikasi tersebut bukan pekerjaan yang ringan.
              </p>
              <p>
                Di sini, guru tidak perlu membuat dari nol. Simulasi untuk materi SMP dan SMA sudah disiapkan. Guru
                cukup memilih topik, membukanya, lalu menggerakkan titik dan slider sambil menjelaskan.
              </p>

              <h2 className="ab-sub">Yang menjadi fokus</h2>
              <ul className="ab-list">
                <li>Simulasi interaktif per materi, sesuai Capaian Pembelajaran Kurikulum Merdeka.</li>
                <li>Tampilan besar dan mudah dibaca, dengan mode layar penuh untuk proyektor dan papan tulis digital.</li>
                <li>Tombol atur ulang dan bagikan tautan, supaya simulasi mudah diulang dan dibagikan ke siswa.</li>
              </ul>

              <h2 className="ab-sub">Fitur pelengkap</h2>
              <p>
                Materi bacaan, presentasi interaktif, dan latihan soal tersedia sebagai tambahan. Presentasi
                menggerakkan simulasi di setiap langkah penjelasan, sehingga membantu guru saat mengajarkan konsep yang
                sulit dan membutuhkan imajinasi.
              </p>
              <p>
                Pemerintah banyak membantu pengadaan papan tulis digital di sekolah, dan platform ini sangat cocok
                dipakai pada media tersebut.
              </p>

              <div className="lp-cta">
                <Link to="/simulasi" className="lp-btn lp-btn--solid">
                  Jelajahi simulasi <span aria-hidden>→</span>
                </Link>
                <Link to="/slides" className="lp-btn lp-btn--ghost">
                  Lihat presentasi
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
