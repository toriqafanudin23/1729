# Pembuat model .glb bangun ruang

Skrip Python (hanya butuh `numpy`; `matplotlib` untuk pratinjau) yang menghasilkan model
jaring-jaring prisma/limas (animasi melipat) dan prisma tambahan di `public/models/bangun-ruang/`.

```bash
pip install numpy matplotlib
python3 tools/bangun-ruang/gen.py public/models/bangun-ruang /tmp/pratinjau
```

Dua model pembuktian volume limas (prisma → 3 limas, dan limas dituang ke prisma) dibuat terpisah:

```bash
python3 tools/bangun-ruang/gen_limas.py public/models/bangun-ruang
```

Argumen kedua (folder pratinjau) opsional; isinya gambar PNG tahap lipatan tiap jaring-jaring.

Setiap jaring-jaring diuji otomatis sebelum ditulis:
titik yang sama berimpit setelah dilipat, bentuk hasil lipatan sama dengan bendanya,
dan sisi pada jaring datar tidak saling bertumpuk. Variasi yang gagal uji dilewati.

Jaring kubus (11 bentuk) dan balok (54 bentuk, 11 pola) dihasilkan dengan menyaring semua pohon rentang
sisi benda; `make_balok()` memilih satu contoh untuk tiap pola jaring-jaring kubus.

Menambah variasi: tambahkan pohon sisi di `make_nets()` pada `gen.py`
(lihat `prism_strip_tree`, `prism_star_tree`, `pyramid_strip_tree`), lalu daftarkan
berkasnya di `src/simulation/math/bangunRuangData.ts`.
