import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { useInstallPrompt } from "../pwa/installPrompt";

/* Tombol "Pasang" di pojok kanan atas navbar.
   - Chrome/Edge/Android: membuka dialog install bawaan browser.
   - iOS Safari: menampilkan petunjuk Bagikan → Tambah ke Layar Utama.
   - Sudah terpasang / browser tidak mendukung: tidak dirender sama sekali. */
export function InstallButton() {
  const { mode, install } = useInstallPrompt();
  const [tipOpen, setTipOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tipOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setTipOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTipOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [tipOpen]);

  if (!mode) return null;

  const handleClick = () => {
    if (mode === "native") void install();
    else setTipOpen((open) => !open);
  };

  return (
    <div className="site-header__install" ref={rootRef}>
      <button
        className="site-header__install-btn"
        type="button"
        aria-label="Pasang aplikasi"
        aria-haspopup={mode === "ios" ? "dialog" : undefined}
        aria-expanded={mode === "ios" ? tipOpen : undefined}
        onClick={handleClick}
      >
        <Download size={18} strokeWidth={1.75} aria-hidden="true" />
        <span className="site-header__install-label">Pasang</span>
      </button>

      {mode === "ios" && tipOpen && (
        <div className="site-header__install-tip" role="dialog" aria-label="Cara memasang aplikasi">
          <strong>Pasang di iPhone/iPad</strong>
          <ol>
            <li>Ketuk ikon <em>Bagikan</em> di Safari.</li>
            <li>Pilih <em>Tambah ke Layar Utama</em>.</li>
            <li>Ketuk <em>Tambah</em>.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
