import { useEffect, useState } from "react";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useSeo } from "../../useSeo";
import { WEBSITE_SEO } from "../../seoText";
// Memakai token dan komponen dasar (.sp-*) dari halaman toko; gaya khusus ada di WebsiteService.css.
import "../shop/ShopLanding.css";
import "./WebsiteService.css";

/* ------------------------------------------------------------------ *
 *  Pengaturan kontak dan harga.
 *  HARGA DI BAWAH ADALAH HARGA SEMENTARA: ubah angka di PACKAGES saja,
 *  seluruh halaman (kartu, formulir, pesan WhatsApp) ikut berubah.
 *  <Route path="/pesan-website" element={<WebsiteService />} />
 * ------------------------------------------------------------------ */
const WA_NUMBER = "6288226179468";
const EMAIL = "pesan.math1729@gmail.com";

type Package = {
  id: string;
  name: string;
  tag: string;
  desc: string;
  price: number;
  features: string[];
  featured?: boolean;
};

const PACKAGES: Package[] = [
  {
    id: "statis",
    name: "Website Statis",
    tag: "Profil sekolah",
    desc: "Landing page info sekolah yang rapi dan cepat. Isi diubah lewat kode sumber, cocok bila informasi jarang berganti.",
    price: 300000,
    features: [
      "Halaman beranda, profil, program, galeri, dan kontak",
      "Tampilan nyaman di HP dan komputer",
      "Dasar SEO dan pratinjau tautan WhatsApp",
      "Perubahan isi dibantu oleh kami",
    ],
  },
  {
    id: "admin",
    name: "Website + Admin Panel",
    tag: "Paling banyak dipilih",
    desc: "Admin sekolah bisa menambah dan mengubah konten sendiri lewat panel: berita, pengumuman, galeri, dan data guru.",
    price: 500000,
    featured: true,
    features: [
      "Semua isi paket Statis",
      "Panel admin dengan login (Supabase)",
      "Kelola berita, pengumuman, galeri, dan agenda",
      "Unggah foto dan dokumen",
      "Pelatihan pengelolaan untuk admin",
    ],
  },
  {
    id: "pendaftaran",
    name: "Pendaftaran + Administrasi",
    tag: "PPDB dan data sekolah",
    desc: "Website dengan formulir pendaftaran online dan pengelolaan data, bisa disesuaikan dengan alur sekolahmu.",
    price: 800000,
    features: [
      "Semua isi paket Admin Panel",
      "Formulir pendaftaran peserta didik baru",
      "Rekap data pendaftar dan ekspor ke spreadsheet",
      "Fitur administrasi sesuai kebutuhan (didiskusikan)",
      "Pengaturan hak akses admin",
    ],
  },
];

const FAQ = [
  {
    q: "Kapan saya membayar?",
    a: "Setelah website selesai dan kamu setujui. Sebelum itu tidak ada pembayaran di muka. Kami tunjukkan hasilnya lebih dulu, baru kamu memutuskan.",
  },
  {
    q: "Apa yang tidak termasuk di harga?",
    a: "Domain dan hosting dibayar terpisah langsung ke penyedianya. Kamu bisa memilih Vercel atau VPS, dan kami bantu memasangnya. Besar biayanya mengikuti penyedia yang dipilih.",
  },
  {
    q: "Domain atas nama siapa?",
    a: "Domain kamu beli sendiri, jadi kepemilikannya penuh di tanganmu. Kami hanya membantu menghubungkannya ke website.",
  },
  {
    q: "Apa saja yang ditanggung garansi 6 bulan?",
    a: "Selama 6 bulan pertama sejak website tayang, error dan masalah teknis dari pembuatan kami perbaiki tanpa biaya. Penambahan fitur baru atau perubahan desain besar dibicarakan dan dihitung terpisah.",
  },
  {
    q: "Saya tidak bisa pemrograman. Apakah bisa mengelola sendiri?",
    a: "Bisa. Kamu diajari cara mengelola website, mulai dari login, menambah berita, sampai mengganti foto, dengan bahasa yang mudah diikuti.",
  },
  {
    q: "Apakah desain bisa disesuaikan dengan sekolah kami?",
    a: "Bisa. Warna, logo, dan susunan halaman disesuaikan dengan identitas sekolah. Kirim logo dan contoh website yang kamu suka, lalu kita diskusikan.",
  },
  {
    q: "Berapa lama pengerjaannya?",
    a: "Tergantung paket dan kelengkapan bahan dari sekolah. Perkiraannya kami sampaikan setelah diskusi awal, sebelum pengerjaan dimulai.",
  },
];

const STEPS = [
  { no: "1", title: "Konsultasi gratis", body: "Ceritakan kebutuhan sekolah lewat WhatsApp atau email. Kami bantu menentukan paket yang pas." },
  { no: "2", title: "Kami buatkan", body: "Website dikerjakan sesuai kesepakatan. Kamu bisa melihat progresnya dan memberi masukan." },
  { no: "3", title: "Cek hasilnya", body: "Website sudah jadi dan kamu periksa. Bila ada yang kurang, kami perbaiki dulu." },
  { no: "4", title: "Bayar, lalu tayang", body: "Pembayaran dilakukan setelah website jadi. Kami pasang di domainmu dan ajari cara mengelolanya." },
];

const REASONS = [
  { title: "Bayar setelah jadi", body: "Tidak ada uang muka. Kamu membayar setelah melihat dan menyetujui hasilnya." },
  { title: "Domain milik sendiri", body: "Domain kamu beli atas namamu, sehingga website sepenuhnya milik sekolah." },
  { title: "Diajari mengelola", body: "Pelatihan singkat sampai kamu mandiri menambah dan mengubah isi website." },
  { title: "Garansi 6 bulan", body: "Masalah teknis pada 6 bulan pertama diperbaiki tanpa biaya tambahan." },
];

const HOSTING = [
  { name: "Vercel", body: "Praktis dan cepat dipasang. Cocok untuk website sekolah yang kebutuhannya ringan sampai menengah." },
  { name: "VPS", body: "Server sendiri dengan kontrol penuh. Cocok untuk kebutuhan lebih besar atau data yang ingin dipegang sendiri." },
];

const RUMAHWEB_URL = "https://www.rumahweb.com/";

/* ------------------------------------------------------------------ *
 *  Pilihan tampilan: warna, font, dan tema
 * ------------------------------------------------------------------ */
const COLORS = [
  { name: "Biru", value: "#2563eb" },
  { name: "Hijau", value: "#16a34a" },
  { name: "Teal", value: "#0d9488" },
  { name: "Merah", value: "#dc2626" },
  { name: "Oranye", value: "#ea580c" },
  { name: "Ungu", value: "#7c3aed" },
  { name: "Merah marun", value: "#9f1239" },
  { name: "Biru tua", value: "#1e3a8a" },
];

const FONTS = [
  { id: "modern", name: "Modern", sample: "Poppins", stack: '"Poppins", system-ui, sans-serif' },
  { id: "klasik", name: "Klasik", sample: "Playfair Display", stack: '"Playfair Display", Georgia, serif' },
  { id: "ramah", name: "Ramah", sample: "Nunito", stack: '"Nunito", system-ui, sans-serif' },
  { id: "formal", name: "Formal", sample: "Merriweather", stack: '"Merriweather", Georgia, serif' },
];

const THEMES = [
  { id: "terang", name: "Terang", bg: "#ffffff", surface: "#f1f5f9", text: "#0f172a", mute: "#64748b" },
  { id: "krem", name: "Krem hangat", bg: "#fbf6ec", surface: "#f2e9d6", text: "#3b2f1e", mute: "#85735a" },
  { id: "gelap", name: "Gelap", bg: "#0f172a", surface: "#1e293b", text: "#f8fafc", mute: "#94a3b8" },
];

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Nunito:wght@400;700;800&family=Playfair+Display:wght@500;700&family=Poppins:wght@400;600&display=swap";

const HEX = /^#[0-9a-fA-F]{6}$/;

const STACK = ["React", "Tailwind CSS", "Supabase", "Vercel / VPS"];

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

/* ------------------------------------------------------------------ *
 *  Ilustrasi: jendela browser berisi kerangka website sekolah
 * ------------------------------------------------------------------ */
function BrowserMock() {
  return (
    <div className="ws-browser" aria-hidden="true">
      <div className="ws-browser__bar">
        <i /><i /><i />
        <span>sekolahmu.sch.id</span>
      </div>
      <div className="ws-browser__body">
        <div className="ws-m-nav">
          <b />
          <span /><span /><span />
        </div>
        <div className="ws-m-hero">
          <div>
            <em />
            <strong />
            <strong className="short" />
            <u />
          </div>
          <div className="ws-m-photo" />
        </div>
        <div className="ws-m-cards">
          <div><i /><span /><span className="short" /></div>
          <div><i /><span /><span className="short" /></div>
          <div><i /><span /><span className="short" /></div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Halaman
 * ------------------------------------------------------------------ */
export default function WebsiteService() {
  useSeo({ ...WEBSITE_SEO, path: "/pesan-website" });

  const [pkg, setPkg] = useState<string>("admin");
  const [nama, setNama] = useState("");
  const [sekolah, setSekolah] = useState("");
  const [catatan, setCatatan] = useState("");

  const [color, setColor] = useState(COLORS[0].value);
  const [fontId, setFontId] = useState(FONTS[0].id);
  const [themeId, setThemeId] = useState(THEMES[0].id);

  // Font contoh dimuat sekali saja, hanya di halaman ini.
  useEffect(() => {
    if (document.head.querySelector(`link[href="${FONT_LINK}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
  }, []);

  const font = FONTS.find((f) => f.id === fontId) ?? FONTS[0];
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const colorName = COLORS.find((c) => c.value.toLowerCase() === color.toLowerCase())?.name;
  const colorLabel = colorName ? `${colorName} (${color})` : color;

  const selected = PACKAGES.find((p) => p.id === pkg) ?? PACKAGES[1];

  const message = () => {
    const detail = [
      `Paket: ${selected.name} (mulai ${rupiah(selected.price)})`,
      nama.trim() && `Nama: ${nama.trim()}`,
      sekolah.trim() && `Sekolah: ${sekolah.trim()}`,
      `Warna utama: ${colorLabel}`,
      `Font: ${font.name} (${font.sample})`,
      `Tema: ${theme.name}`,
      catatan.trim() && `Kebutuhan: ${catatan.trim()}`,
    ].filter(Boolean);
    return [
      "Halo admin 1729, saya ingin memesan website sekolah.",
      "",
      ...detail,
      "",
      "Mohon info langkah selanjutnya.",
    ].join("\n");
  };

  const sendWa = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message())}`, "_blank", "noopener");
  };

  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(`Pesan website: ${selected.name}`)}&body=${encodeURIComponent(message())}`;

  return (
    <div className="sp ws">
      <SiteHeader />

      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="sp-hero">
          <div className="sp-wrap sp-hero__grid">
            <div className="sp-hero__copy">
              <p className="sp-eyebrow">Jasa pembuatan website sekolah</p>
              <h1>Website sekolah yang rapi, bayar setelah jadi.</h1>
              <p className="sp-lead">
                Landing page info sekolah, website dengan admin panel, sampai halaman pendaftaran. Dibuat custom sesuai
                kebutuhan sekolahmu, lalu kamu diajari cara mengelolanya sendiri.
              </p>
              <div className="sp-cta">
                <a href="#pesan" className="sp-btn sp-btn--solid">Pesan website</a>
                <a href="#paket" className="sp-btn sp-btn--ghost">Lihat paket dan harga</a>
              </div>
              <dl className="sp-stats">
                <div><dt>Pembayaran</dt><dd>Setelah jadi</dd></div>
                <div><dt>Garansi</dt><dd>6 bulan</dd></div>
                <div><dt>Pelatihan</dt><dd>Termasuk</dd></div>
              </dl>
            </div>
            <BrowserMock />
          </div>
        </section>

        {/* ----------------------------- Alasan ----------------------------- */}
        <section className="sp-section sp-section--wash" id="keunggulan">
          <div className="sp-wrap">
            <p className="sp-eyebrow">Kenapa kami</p>
            <h2 className="sp-h2">Dibuat untuk sekolah, tanpa risiko di awal.</h2>
            <div className="sp-types ws-reasons">
              {REASONS.map((r) => (
                <div className="sp-type" key={r.title}>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Paket ----------------------------- */}
        <section className="sp-section" id="paket">
          <div className="sp-wrap">
            <p className="sp-eyebrow">Paket dan harga</p>
            <h2 className="sp-h2">Pilih sesuai kebutuhan sekolah.</h2>
            <p className="ws-note">
              Harga masih bersifat sementara dan dapat berubah setelah konsultasi, tergantung jumlah halaman dan fitur.
            </p>

            <div className="ws-packages">
              {PACKAGES.map((p) => (
                <article className={`ws-pkg${p.featured ? " ws-pkg--featured" : ""}`} key={p.id}>
                  <p className="ws-pkg__tag">{p.tag}</p>
                  <h3>{p.name}</h3>
                  <p className="ws-pkg__desc">{p.desc}</p>
                  <div className="ws-pkg__price">
                    <span>Mulai dari</span>
                    <strong>{rupiah(p.price)}</strong>
                  </div>
                  <ul className="ws-pkg__list">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a
                    href="#pesan"
                    className={`sp-btn sp-btn--block ${p.featured ? "sp-btn--solid" : "sp-btn--ghost"}`}
                    onClick={() => setPkg(p.id)}
                  >
                    Pilih paket ini
                  </a>
                </article>
              ))}
            </div>

            <div className="ws-included">
              <h3>Termasuk di semua paket</h3>
              <ul>
                <li>Pembayaran setelah website jadi</li>
                <li>Garansi perbaikan 6 bulan pertama</li>
                <li>Pelatihan pengelolaan website</li>
                <li>Pemasangan di domain milikmu</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------- Domain dan hosting --------------------- */}
        <section className="sp-section sp-section--wash" id="hosting">
          <div className="sp-wrap ws-split">
            <div>
              <p className="sp-eyebrow">Domain dan hosting</p>
              <h2 className="sp-h2">Domain milikmu sendiri, hosting pilih yang cocok.</h2>
              <p className="ws-body">
                Biaya domain dan hosting <strong>dibayar terpisah</strong> langsung ke penyedia, tidak termasuk harga
                paket. Kamu yang membeli domain, jadi alamat website sepenuhnya milik sekolah. Kami bantu memasangnya.
              </p>
              <div className="sp-cta">
                <a className="sp-btn sp-btn--solid" href={RUMAHWEB_URL} target="_blank" rel="noopener noreferrer">
                  Cek harga domain dan VPS <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="ws-hint">Membuka Rumahweb di tab baru. Harga mengikuti penyedia.</p>
              <ul className="ws-stack" aria-label="Teknologi yang dipakai">
                {STACK.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="ws-hosts">
              {HOSTING.map((h) => (
                <div className="ws-host" key={h.name}>
                  <h3>{h.name}</h3>
                  <p>{h.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------- Cara pesan -------------------------- */}
        <section className="sp-section sp-section--ink" id="cara">
          <div className="sp-wrap sp-why">
            <div>
              <p className="sp-eyebrow">Alur pemesanan</p>
              <h2 className="sp-h2">Dari konsultasi sampai website tayang.</h2>
            </div>
            <ol className="sp-steps">
              {STEPS.map((s) => (
                <li key={s.no}>
                  <span className="sp-steps__no">{s.no}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------- Rancang tampilan ----------------------- */}
        <section className="sp-section sp-section--wash" id="tampilan">
          <div className="sp-wrap ws-split ws-split--design">
            <div className="ws-picker">
              <p className="sp-eyebrow">Rancang tampilan</p>
              <h2 className="sp-h2">Pilih warna, font, dan tema website sekolahmu.</h2>
              <p className="ws-body">
                Coba kombinasinya langsung di pratinjau. Pilihanmu ikut terkirim saat memesan, jadi kami punya
                gambaran awal. Semuanya masih bisa diubah.
              </p>

              <fieldset className="ws-group">
                <legend>Warna utama</legend>
                <div className="ws-swatches">
                  {COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      className="ws-swatch"
                      style={{ background: c.value }}
                      aria-label={c.name}
                      title={c.name}
                      aria-pressed={color.toLowerCase() === c.value}
                      onClick={() => setColor(c.value)}
                    />
                  ))}
                  <label className="ws-custom">
                    <input
                      type="color"
                      value={HEX.test(color) ? color : "#2563eb"}
                      onChange={(e) => setColor(e.target.value)}
                      aria-label="Pilih warna sendiri"
                    />
                    <span>Warna sendiri</span>
                  </label>
                </div>
              </fieldset>

              <fieldset className="ws-group">
                <legend>Font</legend>
                <div className="ws-choices">
                  {FONTS.map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      className="ws-choice"
                      aria-pressed={fontId === f.id}
                      onClick={() => setFontId(f.id)}
                    >
                      <strong style={{ fontFamily: f.stack }}>Aa</strong>
                      <span>{f.name}</span>
                      <small>{f.sample}</small>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ws-group">
                <legend>Tema</legend>
                <div className="ws-choices ws-choices--3">
                  {THEMES.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      className="ws-choice"
                      aria-pressed={themeId === t.id}
                      onClick={() => setThemeId(t.id)}
                    >
                      <i className="ws-chip" style={{ background: t.bg, borderColor: t.mute }}>
                        <b style={{ background: t.text }} />
                      </i>
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <a href="#pesan" className="sp-btn sp-btn--solid">Pakai pilihan ini untuk pesanan</a>
            </div>

            <div
              className="ws-preview"
              role="img"
              aria-label={`Pratinjau website dengan warna ${colorLabel}, font ${font.name}, tema ${theme.name}`}
              style={
                {
                  "--pv-accent": color,
                  "--pv-bg": theme.bg,
                  "--pv-surface": theme.surface,
                  "--pv-text": theme.text,
                  "--pv-mute": theme.mute,
                  "--pv-font": font.stack,
                } as React.CSSProperties
              }
            >
              <div className="ws-pv__bar">
                <strong>SMA Contoh</strong>
                <span>Profil</span><span>Berita</span><span>PPDB</span>
              </div>
              <div className="ws-pv__hero">
                <p>Selamat datang</p>
                <h3>Mencetak generasi cerdas dan berkarakter</h3>
                <p className="ws-pv__lead">Informasi sekolah, berita terbaru, dan pendaftaran dalam satu tempat.</p>
                <span className="ws-pv__btn">Daftar sekarang</span>
              </div>
              <div className="ws-pv__cards">
                <div><b>Berita</b><span>Juara 1 olimpiade matematika tingkat kota.</span></div>
                <div><b>Agenda</b><span>Penerimaan peserta didik baru dibuka bulan depan.</span></div>
              </div>
              <p className="ws-pv__foot">Pratinjau contoh. Tampilan akhir disesuaikan dengan sekolahmu.</p>
            </div>
          </div>
        </section>

        {/* ------------------------------ Pesan ----------------------------- */}
        <section className="sp-section" id="pesan">
          <div className="sp-wrap ws-split">
            <div>
              <p className="sp-eyebrow">Pesan website</p>
              <h2 className="sp-h2">Ceritakan kebutuhanmu, kami balas lewat WhatsApp.</h2>
              <p className="ws-body">
                Isi formulir singkat ini, lalu pesan akan terisi otomatis di WhatsApp. Kamu juga bisa memesan lewat
                email. Tidak ada pembayaran sebelum website jadi.
              </p>
              <ul className="ws-contact">
                <li>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">0882-2617-9468</a>
                </li>
                <li>
                  <span>Email</span>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </li>
              </ul>
            </div>

            <form className="ws-form" onSubmit={sendWa}>
              <fieldset>
                <legend>Paket</legend>
                <div className="ws-opts">
                  {PACKAGES.map((p) => (
                    <label key={p.id} className={pkg === p.id ? "is-on" : ""}>
                      <input type="radio" name="paket" value={p.id} checked={pkg === p.id} onChange={() => setPkg(p.id)} />
                      <span>{p.name}</span>
                      <em>mulai {rupiah(p.price)}</em>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="ws-field">
                <span>Nama</span>
                <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kamu" autoComplete="name" />
              </label>
              <label className="ws-field">
                <span>Nama sekolah</span>
                <input value={sekolah} onChange={(e) => setSekolah(e.target.value)} placeholder="Contoh: SMA Negeri 1 ..." />
              </label>
              <label className="ws-field">
                <span>Kebutuhan <small>(opsional)</small></span>
                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Misalnya: website profil sekolah dengan berita dan galeri"
                />
              </label>

              <p className="ws-sum">
                <span>Tampilan</span>
                <i style={{ background: color }} aria-hidden="true" />
                {colorName ?? color} · {font.name} · {theme.name}
                <a href="#tampilan">Ubah</a>
              </p>

              <div className="ws-form__actions">
                <button type="submit" className="sp-btn sp-btn--solid">Pesan lewat WhatsApp</button>
                <a className="sp-btn sp-btn--ghost" href={mailHref}>Pesan lewat email</a>
              </div>
              <p className="ws-form__note">Bayar setelah website jadi. Harga sementara, final setelah konsultasi.</p>
            </form>
          </div>
        </section>

        {/* ------------------------------- FAQ ------------------------------ */}
        <section className="sp-section sp-section--wash" id="faq">
          <div className="sp-wrap sp-faq">
            <div>
              <p className="sp-eyebrow">Pertanyaan umum</p>
              <h2 className="sp-h2">Hal yang sering ditanyakan.</h2>
            </div>
            <div className="sp-faq__list">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
