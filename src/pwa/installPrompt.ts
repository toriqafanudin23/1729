// Mengelola pemasangan PWA ("Install aplikasi").
//
// Browser berbasis Chromium (Chrome, Edge, Samsung Internet, dsb.) menembakkan
// `beforeinstallprompt` SEKALI, biasanya sebelum komponen React sempat tampil.
// Karena itu pendengar dipasang dari main.tsx (initInstallPrompt) dan event-nya
// disimpan di sini; tombol di navbar tinggal membaca state lewat useInstallPrompt().
//
// iOS/iPadOS Safari tidak punya event itu. Di sana pemasangan hanya bisa lewat
// menu Bagikan → "Tambah ke Layar Utama", jadi tombol menampilkan petunjuknya.

import { useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallState = { canPrompt: boolean; installed: boolean };

export type InstallMode = "native" | "ios" | null;

const SERVER_STATE: InstallState = { canPrompt: false, installed: false };

let deferred: BeforeInstallPromptEvent | null = null;
let started = false;
let state: InstallState = SERVER_STATE;
const listeners = new Set<() => void>();

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  // iPadOS 13+ mengaku sebagai Mac, tetapi punya layar sentuh.
  return /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
}

function setState(next: Partial<InstallState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

/** Panggil sekali, sedini mungkin (main.tsx), supaya event tidak terlewat. */
export function initInstallPrompt() {
  if (started || typeof window === "undefined") return;
  started = true;
  state = { canPrompt: false, installed: isStandalone() };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // tahan banner bawaan; kita tampilkan lewat tombol sendiri
    deferred = event as BeforeInstallPromptEvent;
    setState({ canPrompt: true });
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    setState({ canPrompt: false, installed: true });
  });

  // Jika dipasang lalu dibuka dalam jendela aplikasi, mode tampilan berubah.
  window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
    if (e.matches) setState({ installed: true, canPrompt: false });
  });
}

/** Menampilkan dialog pemasangan bawaan browser. */
export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const event = deferred;
  if (!event) return "unavailable";
  deferred = null; // event hanya bisa dipakai sekali
  setState({ canPrompt: false });
  await event.prompt();
  const { outcome } = await event.userChoice;
  if (outcome === "accepted") setState({ installed: true });
  return outcome;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => SERVER_STATE;

/**
 * mode:
 *  - "native": browser siap memasang → klik langsung membuka dialog install
 *  - "ios":    Safari iOS → tampilkan petunjuk "Tambah ke Layar Utama"
 *  - null:     sudah terpasang / browser tidak mendukung → tombol disembunyikan
 */
export function useInstallPrompt(): { mode: InstallMode; install: () => Promise<void> } {
  const { canPrompt, installed } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let mode: InstallMode = null;
  if (!installed) {
    if (canPrompt) mode = "native";
    else if (isIosDevice()) mode = "ios";
  }

  return {
    mode,
    install: async () => {
      await promptInstall();
    },
  };
}
