# Pembuat model .glb bangun ruang

Skrip Python (hanya butuh `numpy`; `matplotlib` untuk pratinjau) yang menghasilkan model
jaring-jaring prisma/limas (animasi melipat) dan prisma tambahan di `public/models/bangun-ruang/`.

```bash
pip install numpy matplotlib
python3 tools/bangun-ruang/gen.py public/models/bangun-ruang /tmp/pratinjau
```

Argumen kedua (folder pratinjau) opsional; isinya gambar PNG tahap lipatan tiap jaring-jaring.

Setiap jaring-jaring diuji otomatis sebelum ditulis:
titik yang sama berimpit setelah dilipat, bentuk hasil lipatan sama dengan bendanya,
dan sisi pada jaring datar tidak saling bertumpuk. Variasi yang gagal uji dilewati.

Menambah variasi: tambahkan pohon sisi di `make_nets()` pada `gen.py`
(lihat `prism_strip_tree`, `prism_star_tree`, `pyramid_strip_tree`), lalu daftarkan
berkasnya di `src/simulation/math/bangunRuangData.ts`.
