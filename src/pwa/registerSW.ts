// Mendaftarkan service worker (hanya di build produksi) dan menampilkan
// pemberitahuan kecil: "siap offline" saat pertama kali, dan "versi baru" saat ada rilis.
// Ditulis dengan DOM biasa agar tidak menambah ketergantungan pada React.

const UPDATE_CHECK_MS = 60 * 60 * 1000;

function toast(message: string, action?: { label: string; run: () => void }, autoHideMs?: number) {
  const old = document.getElementById("pwa-toast");
  old?.remove();

  const el = document.createElement("div");
  el.id = "pwa-toast";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.style.cssText = [
    "position:fixed", "left:50%", "bottom:max(16px,env(safe-area-inset-bottom))", "transform:translateX(-50%)",
    "z-index:10001", "display:flex", "align-items:center", "gap:12px", "max-width:min(92vw,480px)",
    "padding:10px 14px", "border-radius:12px", "background:#1e293b", "color:#fff",
    "font:500 14px/1.4 'Hanken Grotesk',system-ui,sans-serif", "box-shadow:0 8px 24px rgba(0,0,0,.25)",
  ].join(";");

  const text = document.createElement("span");
  text.textContent = message;
  el.append(text);

  const button = (label: string, run: () => void, primary: boolean) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.style.cssText = `border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font:600 13px inherit;${
      primary ? "background:#c96442;color:#fff" : "background:transparent;color:#cbd5e1"
    }`;
    b.onclick = run;
    return b;
  };

  if (action) {
    el.append(button(action.label, action.run, true), button("Nanti", () => el.remove(), false));
  }
  document.body.append(el);
  if (autoHideMs) setTimeout(() => el.remove(), autoHideMs);
}

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    let registration: ServiceWorkerRegistration;
    try {
      registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch (err) {
      console.warn("[pwa] gagal mendaftarkan service worker", err);
      return;
    }

    let reloading = false;
    const promptUpdate = (worker: ServiceWorker) =>
      toast("Versi baru tersedia.", {
        label: "Muat ulang",
        run: () => {
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (reloading) return;
            reloading = true;
            window.location.reload();
          });
          worker.postMessage({ type: "SKIP_WAITING" });
        },
      });

    // Sudah ada versi baru yang menunggu (misal ditemukan di kunjungan sebelumnya).
    if (registration.waiting && navigator.serviceWorker.controller) promptUpdate(registration.waiting);

    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state !== "installed") return;
        if (navigator.serviceWorker.controller) promptUpdate(worker);
        else toast("Siap dipakai offline.", undefined, 4000);
      });
    });

    const check = () => registration.update().catch(() => {});
    setInterval(check, UPDATE_CHECK_MS);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") check();
    });
  });
}
