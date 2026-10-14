import { useCallback, useEffect, useState, type RefObject } from "react";

/* Layar penuh untuk satu elemen (panggung presentasi).
   - Memakai Fullscreen API bila ada (termasuk awalan webkit).
   - Bila tidak ada (mis. iPhone), jatuh ke "layar penuh semu": elemen dibuat
     position: fixed menutupi viewport, scroll halaman dikunci, Esc untuk keluar.
   - Di ponsel Android, layar dikunci ke lanskap selama layar penuh. */

type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

const fsElement = () => {
  const d = document as FsDoc;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
};

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [native, setNative] = useState(false);
  const [fallback, setFallback] = useState(false);
  const active = native || fallback;

  // sinkronkan dengan status browser (termasuk saat pengguna menekan Esc)
  useEffect(() => {
    const sync = () => setNative(!!ref.current && fsElement() === ref.current);
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [ref]);

  // layar penuh semu: kunci scroll + Esc
  useEffect(() => {
    if (!fallback) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFallback(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [fallback]);

  // setiap status berubah: kembalikan fokus ke deck agar tombol panah tetap bekerja
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => el.querySelector<HTMLElement>(".ds-deck")?.focus({ preventScroll: true }));
    const orient = (screen as Screen & { orientation?: ScreenOrientation & { lock?: (o: string) => Promise<void> } }).orientation;
    if (active) {
      try {
        orient?.lock?.("landscape")?.catch(() => {});
      } catch {
        /* tidak didukung */
      }
    }
    return () => {
      cancelAnimationFrame(raf);
      if (active) {
        try {
          orient?.unlock?.();
        } catch {
          /* tidak didukung */
        }
      }
    };
  }, [active, ref]);

  const toggle = useCallback(async () => {
    const el = ref.current as FsEl | null;
    if (!el) return;
    if (fsElement()) {
      const d = document as FsDoc;
      await (d.exitFullscreen ? d.exitFullscreen() : d.webkitExitFullscreen?.());
      return;
    }
    if (fallback) {
      setFallback(false);
      return;
    }
    try {
      if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: "hide" });
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else setFallback(true);
    } catch {
      setFallback(true);
    }
  }, [ref, fallback]);

  return { active, fallback, toggle };
}
