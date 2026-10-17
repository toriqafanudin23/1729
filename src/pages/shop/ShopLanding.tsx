import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useSeo } from "../../useSeo";
import { SHOP_SEO } from "../../seoText";
import "./ShopLanding.css";

/* ------------------------------------------------------------------ *
 *  Pengaturan: sesuaikan dengan aplikasi 1729.
 *  <Route path="/toko" element={<ShopLanding />} />
 * ------------------------------------------------------------------ */
const WA_NUMBER = "6288226179468";
const EMAIL = "pesan.math1729@gmail.com";

type Jenjang = "SMP" | "SMA";
type Tipe = "modul" | "bank" | "slide" | "lkpd" | "lengkap";

type Product = {
  id: string;
  tipe: Tipe;
  jenjang: Jenjang;
  title: string;
  desc: string;
  includes: string[];
  format: string;
  price: number;
  normal?: number; // harga normal jika dijual satuan (untuk paket lengkap)
};

/* ------------------------------------------------------------------ *
 *  Katalog. Harga dan isi hanyalah contoh: ubah sesuai produk asli.
 * ------------------------------------------------------------------ */
const TIPE_INFO: Record<Tipe, { label: string; short: string; desc: string; includes: string[]; format: string }> = {
  modul: {
    label: "Modul ajar deep learning",
    short: "Modul ajar",
    desc: "Modul ajar berbasis pembelajaran mendalam: tujuan, pemahaman bermakna, pertanyaan pemantik, kegiatan, dan asesmen.",
    includes: ["Tujuan dan alur pembelajaran", "Skenario kegiatan per pertemuan", "Asesmen dan rubrik"],
    format: "DOCX · editable",
  },
  bank: {
    label: "Bank soal",
    short: "Bank soal",
    desc: "Kumpulan soal berjenjang dari mudah sampai HOTS, lengkap dengan kunci dan pembahasan.",
    includes: ["Soal berjenjang", "Kunci jawaban", "Pembahasan langkah demi langkah"],
    format: "DOCX + PDF",
  },
  slide: {
    label: "Slide presentasi",
    short: "Slide",
    desc: "Slide siap tayang dengan ilustrasi dan visualisasi konsep, tinggal dipakai di kelas.",
    includes: ["Slide per bab", "Ilustrasi dan gambar", "Latihan di akhir sesi"],
    format: "PPTX · editable",
  },
  lkpd: {
    label: "LKPD",
    short: "LKPD",
    desc: "Lembar kerja peserta didik yang mengajak siswa menemukan konsep lewat aktivitas terarah.",
    includes: ["Aktivitas eksplorasi", "Ruang jawab siswa", "Kunci untuk guru"],
    format: "DOCX + PDF",
  },
  lengkap: {
    label: "Bahan ajar lengkap",
    short: "Paket lengkap",
    desc: "Satu paket berisi modul ajar, bank soal, slide presentasi, dan LKPD untuk satu jenjang.",
    includes: ["Modul ajar deep learning", "Bank soal + pembahasan", "Slide presentasi", "LKPD"],
    format: "Paket DOCX, PPTX, PDF",
  },
};

const PRICE: Record<Jenjang, Record<Tipe, number>> = {
  SMP: { modul: 75000, bank: 49000, slide: 59000, lkpd: 45000, lengkap: 199000 },
  SMA: { modul: 85000, bank: 59000, slide: 69000, lkpd: 55000, lengkap: 229000 },
};

const TIPE_ORDER: Tipe[] = ["lengkap", "modul", "bank", "slide", "lkpd"];

const PRODUCTS: Product[] = (["SMP", "SMA"] as Jenjang[]).flatMap((jenjang) =>
  TIPE_ORDER.map((tipe) => {
    const info = TIPE_INFO[tipe];
    const p = PRICE[jenjang];
    return {
      id: `${jenjang.toLowerCase()}-${tipe}`,
      tipe,
      jenjang,
      title: `${info.label} ${jenjang}`,
      desc: info.desc,
      includes: info.includes,
      format: info.format,
      price: p[tipe],
      normal: tipe === "lengkap" ? p.modul + p.bank + p.slide + p.lkpd : undefined,
    } satisfies Product;
  }),
);

const FAQ = [
  {
    q: "Apakah file bisa diedit?",
    a: "Ya. Modul ajar, LKPD, dan slide dikirim dalam format DOCX dan PPTX sehingga bisa kamu sesuaikan dengan kelasmu. Bank soal juga disertai PDF.",
  },
  {
    q: "Bagaimana file dikirim setelah pesan?",
    a: "Setelah pembayaran dikonfirmasi lewat WhatsApp, tautan unduhan dikirim ke nomor atau email kamu.",
  },
  {
    q: "Apakah materi sesuai Kurikulum Merdeka?",
    a: "Modul disusun dengan pendekatan deep learning dan mengacu pada Kurikulum Merdeka. Tujuan pembelajaran bisa kamu sesuaikan dengan satuan pendidikanmu.",
  },
  {
    q: "Bolehkah dipakai untuk satu sekolah?",
    a: "Lisensi standar untuk satu guru. Untuk pemakaian bersama di satu sekolah, hubungi kami lewat WhatsApp atau email.",
  },
  {
    q: "Bagaimana kalau ada file yang bermasalah?",
    a: "Kirim pesan ke admin. File yang rusak atau salah unduh kami ganti tanpa biaya.",
  },
];

const STEPS = [
  { no: "1", title: "Pilih produk", body: "Telusuri katalog, saring menurut jenjang dan jenis bahan ajar, lalu tambahkan ke keranjang." },
  { no: "2", title: "Kirim pesanan", body: "Tekan Pesan lewat WhatsApp. Daftar produk dan total harga sudah terisi otomatis di pesan." },
  { no: "3", title: "Terima file", body: "Selesaikan pembayaran, lalu tautan unduhan dikirim kepadamu." },
];

const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

/* ------------------------------------------------------------------ *
 *  Kartu produk
 * ------------------------------------------------------------------ */
function ProductCard({ p, inCart, onToggle }: { p: Product; inCart: boolean; onToggle: () => void }) {
  const bundle = p.tipe === "lengkap";
  return (
    <article className={`sp-card${bundle ? " sp-card--bundle" : ""}`}>
      <div className="sp-card__top">
        <span className="sp-tag">{p.jenjang}</span>
        <span className="sp-card__type">{TIPE_INFO[p.tipe].short}</span>
        {bundle && p.normal && <span className="sp-save">Hemat {rupiah(p.normal - p.price)}</span>}
      </div>
      <h3>{p.title}</h3>
      <p className="sp-card__desc">{p.desc}</p>
      <ul className="sp-incl">
        {p.includes.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <p className="sp-card__format">{p.format}</p>
      <div className="sp-card__foot">
        <div className="sp-price">
          <strong>{rupiah(p.price)}</strong>
          {p.normal && <s>{rupiah(p.normal)}</s>}
        </div>
        <button
          type="button"
          className={`sp-btn sp-btn--sm ${inCart ? "sp-btn--ghost" : "sp-btn--solid"}`}
          aria-pressed={inCart}
          onClick={onToggle}
        >
          {inCart ? "Hapus" : "Tambah"}
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 *  Halaman
 * ------------------------------------------------------------------ */
export default function ShopLanding() {
  useSeo({ ...SHOP_SEO, path: "/toko" });

  const [jenjang, setJenjang] = useState<"Semua" | Jenjang>("Semua");
  const [tipe, setTipe] = useState<"Semua" | Tipe>("Semua");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (jenjang === "Semua" || p.jenjang === jenjang) &&
        (tipe === "Semua" || p.tipe === tipe) &&
        (!q || `${p.title} ${p.desc}`.toLowerCase().includes(q)),
    );
  }, [jenjang, tipe, query]);

  const items = useMemo(() => cart.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean), [cart]);
  const total = items.reduce((s, p) => s + p.price, 0);

  const toggle = (id: string) => setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const checkout = () => {
    const lines = items.map((p, i) => `${i + 1}. ${p.title} (${rupiah(p.price)})`).join("\n");
    const msg = `Halo admin 1729, saya ingin memesan:\n${lines}\n\nTotal: ${rupiah(total)}\n\nMohon info pembayarannya.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const reset = () => {
    setJenjang("Semua");
    setTipe("Semua");
    setQuery("");
  };

  return (
    <div className="sp">
      <SiteHeader />

      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="sp-hero">
          <div className="sp-wrap sp-hero__grid">
            <div className="sp-hero__copy">
              <p className="sp-eyebrow">Toko bahan ajar 1729</p>
              <h1>Bahan ajar matematika yang siap dipakai di kelas.</h1>
              <p className="sp-lead">
                Modul ajar deep learning, bank soal, slide presentasi, dan LKPD untuk SMP dan SMA. Semua file bisa diedit,
                jadi kamu tinggal menyesuaikannya.
              </p>
              <div className="sp-cta">
                <a href="#katalog" className="sp-btn sp-btn--solid">Lihat katalog</a>
                <a href="#produk" className="sp-btn sp-btn--ghost">Apa saja isinya</a>
              </div>
              <dl className="sp-stats">
                <div><dt>Jenjang</dt><dd>SMP, SMA</dd></div>
                <div><dt>Jenis bahan</dt><dd>4 + paket</dd></div>
                <div><dt>Format</dt><dd>DOCX, PPTX, PDF</dd></div>
              </dl>
            </div>

            <aside className="sp-stack" aria-label="Isi paket bahan ajar lengkap">
              <p className="sp-stack__cap">Paket bahan ajar lengkap</p>
              {(["modul", "slide", "bank", "lkpd"] as Tipe[]).map((t) => (
                <div className="sp-file" key={t}>
                  <span className="sp-file__ext">{TIPE_INFO[t].format.split(/[ ·+,]/)[0]}</span>
                  <span className="sp-file__name">{TIPE_INFO[t].label}</span>
                </div>
              ))}
              <div className="sp-stack__foot">
                <span>Satu paket, satu jenjang</span>
                <a href="#katalog" onClick={() => setTipe("lengkap")}>Lihat paket</a>
              </div>
            </aside>
          </div>
        </section>

        {/* ----------------------------- Produk ----------------------------- */}
        <section className="sp-section sp-section--wash" id="produk">
          <div className="sp-wrap">
            <p className="sp-eyebrow">Produk</p>
            <h2 className="sp-h2">Empat jenis bahan ajar, bisa dibeli satuan atau paket.</h2>
            <div className="sp-types">
              {(["modul", "bank", "slide", "lkpd"] as Tipe[]).map((t) => (
                <div className="sp-type" key={t}>
                  <h3>{TIPE_INFO[t].label}</h3>
                  <p>{TIPE_INFO[t].desc}</p>
                  <a
                    href="#katalog"
                    className="sp-link"
                    onClick={() => {
                      setTipe(t);
                      setJenjang("Semua");
                    }}
                  >
                    Lihat {TIPE_INFO[t].short.toLowerCase()}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------- Katalog ---------------------------- */}
        <section className="sp-section" id="katalog">
          <div className="sp-wrap">
            <p className="sp-eyebrow">Katalog</p>
            <h2 className="sp-h2">Pilih bahan ajar untuk jenjang dan kebutuhanmu.</h2>

            <button type="button" className="sp-btn sp-btn--ghost sp-btn--sm sp-cart-trigger" onClick={() => setOpen(true)}>
              Keranjang <span className="sp-count" aria-label={`${cart.length} item`}>{cart.length}</span>
            </button>

            <div className="sp-filters">
              <div className="sp-filter" role="group" aria-label="Filter jenjang">
                {(["Semua", "SMP", "SMA"] as const).map((j) => (
                  <button type="button" key={j} className="sp-chip" aria-pressed={jenjang === j} onClick={() => setJenjang(j)}>
                    {j}
                  </button>
                ))}
              </div>
              <div className="sp-filter" role="group" aria-label="Filter jenis">
                {(["Semua", ...TIPE_ORDER] as const).map((t) => (
                  <button type="button" key={t} className="sp-chip" aria-pressed={tipe === t} onClick={() => setTipe(t)}>
                    {t === "Semua" ? "Semua jenis" : TIPE_INFO[t].short}
                  </button>
                ))}
              </div>
              <input
                type="search"
                className="sp-search"
                placeholder="Cari produk"
                aria-label="Cari produk"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {shown.length > 0 ? (
              <div className="sp-grid">
                {shown.map((p) => (
                  <ProductCard key={p.id} p={p} inCart={cart.includes(p.id)} onToggle={() => toggle(p.id)} />
                ))}
              </div>
            ) : (
              <div className="sp-empty">
                <p>Tidak ada produk yang cocok dengan filter ini.</p>
                <button type="button" className="sp-btn sp-btn--ghost sp-btn--sm" onClick={reset}>
                  Hapus filter
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ---------------------------- Cara pesan -------------------------- */}
        <section className="sp-section sp-section--ink" id="cara">
          <div className="sp-wrap sp-why">
            <div>
              <p className="sp-eyebrow">Cara pesan</p>
              <h2 className="sp-h2">Tiga langkah dari memilih sampai file di tanganmu.</h2>
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

        {/* ------------------------------- FAQ ------------------------------ */}
        <section className="sp-section" id="faq">
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

        {/* -------------------------------- CTA ----------------------------- */}
        <section className="sp-section sp-section--wash sp-final">
          <div className="sp-wrap">
            <h2 className="sp-h2">Butuh bahan ajar untuk satu sekolah?</h2>
            <p className="sp-lead">Hubungi kami untuk lisensi sekolah atau permintaan materi tertentu.</p>
            <div className="sp-cta sp-cta--center">
              <a className="sp-btn sp-btn--solid" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">
                Chat WhatsApp
              </a>
              <a className="sp-btn sp-btn--ghost" href={`mailto:${EMAIL}`}>Kirim email</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Bilah keranjang untuk layar kecil */}
      {cart.length > 0 && !open && (
        <button type="button" className="sp-bar" onClick={() => setOpen(true)}>
          <span>{cart.length} produk</span>
          <strong>{rupiah(total)}</strong>
          <span>Buka keranjang</span>
        </button>
      )}

      {/* ----------------------------- Keranjang ---------------------------- */}
      {open && (
        <div className="sp-drawer" role="dialog" aria-modal="true" aria-label="Keranjang">
          <div className="sp-drawer__scrim" onClick={() => setOpen(false)} />
          <div className="sp-drawer__panel">
            <div className="sp-drawer__head">
              <h2>Keranjang</h2>
              <button type="button" className="sp-x" onClick={() => setOpen(false)} aria-label="Tutup keranjang">
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="sp-drawer__empty">
                <p>Keranjang masih kosong. Tambahkan produk dari katalog.</p>
                <a href="#katalog" className="sp-btn sp-btn--solid sp-btn--sm" onClick={() => setOpen(false)}>
                  Lihat katalog
                </a>
              </div>
            ) : (
              <>
                <ul className="sp-lines">
                  {items.map((p) => (
                    <li key={p.id}>
                      <div>
                        <strong>{p.title}</strong>
                        <span>{p.format}</span>
                      </div>
                      <div className="sp-lines__r">
                        <span>{rupiah(p.price)}</span>
                        <button type="button" onClick={() => toggle(p.id)} aria-label={`Hapus ${p.title}`}>
                          Hapus
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="sp-drawer__foot">
                  <div className="sp-total">
                    <span>Total</span>
                    <strong>{rupiah(total)}</strong>
                  </div>
                  <button type="button" className="sp-btn sp-btn--solid sp-btn--block" onClick={checkout}>
                    Pesan lewat WhatsApp
                  </button>
                  <p className="sp-note">Pembayaran dikonfirmasi lewat WhatsApp. File dikirim setelah pembayaran diterima.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
