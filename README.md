# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Materi (bacaan + simulasi + cek poin)

Halaman `/materi` adalah katalog materi; tiap materi terdiri atas beberapa bab (`/materi/<slug>/<bab>`).
Struktur dan cara menambah materi baru dijelaskan di komentar `src/materi/materi.ts`.

- `src/materi/materi.ts` — metadata katalog (dibaca juga oleh sitemap/prerender)
- `src/materi/questions/` — bank cek poin (kunci, petunjuk, pembahasan)
- `src/materi/lessons/<slug>/BabN.tsx` — isi bab
- `src/materi/labs/` — simulasi JSXGraph yang tertanam
- `src/materi/three/` — mesin 3D bersama (three.js): `solidMath.ts` (matematika prisma/limas/jaring-jaring, tanpa three), `stage.ts`, `solid.ts`, `SolidScene.tsx`
- `npm run check:materi` — memeriksa kunci jawaban, id soal, dan pilihan jaring kubus

## PWA (offline)

Aplikasi ini adalah PWA: bisa dipasang ke PC/ponsel dan dibuka tanpa internet setelah kunjungan pertama.

- `public/manifest.webmanifest` + `public/icons/` — identitas aplikasi dan ikon (termasuk maskable)
- `scripts/sw.template.js` — template service worker (cangkang SPA, precache, cache font)
- `scripts/generate-sw.mjs` — dijalankan di akhir `npm run build`; menulis `dist/sw.js` berisi daftar semua berkas hasil build
- `src/pwa/registerSW.ts` — pendaftaran SW dan notifikasi "siap offline" / "versi baru tersedia"

Font di-host sendiri: `src/fonts.css` (Hanken Grotesk, Newsreader) dan impor `@fontsource/*` di `WebsiteService.tsx`; tidak ada permintaan ke Google Fonts.

Service worker hanya aktif di build produksi. Uji lokal: `npm run build && npm run preview`, lalu buka DevTools → Application.
