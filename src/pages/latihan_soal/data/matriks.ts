import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Matriks.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const matriks: Material = {
  slug: "matriks",
  title: "Latihan Soal Matriks",
  topic: "Matriks",
  description:
    "Operasi matriks, determinan, invers, sistem persamaan linear, dan transformasi geometri dengan matriks.",
  durationMinutes: 120,
  notes: [
    h`Soal disusun berjenjang dan memakai bentuk yang sejalan dengan UTBK-SNBT
2026: pilihan ganda lima opsi, pernyataan majemuk (soal 14 dan 18),
kecukupan data (soal 17), serta soal berkonteks dan bergambar.`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Notasi: \(A^T\) transpose; \(A^{-1}\) invers; \(\det(A)\) atau \(|A|\)
determinan; \(\operatorname{adj}(A)\) adjoin; \(I\) matriks identitas;
\(O\) matriks nol.`,
    h`Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan.
Pada isian singkat, tuliskan hanya jawaban akhir.`,
  ],
  sections: [
    {
      id: "pg",
      letter: "A",
      title: "Pilihan Ganda",
      instruction: h`20 soal \(\times\) 2 poin = 40 poin. Pilih jawaban yang paling tepat.`,
      pointsEach: 2,
      groups: [
        {
          level: "mudah",
          questions: [
            {
              id: "pg-1",
              no: 1,
              type: "pg",
              level: "mudah",
              prompt: h`<p>
Matriks \(P\) berordo \(3\times4\) dengan elemen \(p_{ij}=2i-j\). Nilai
\(p_{23}+p_{34}\) adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(5\)` },
              ],
              answer: "C",
              explanation: h`<p>
\(p_{23}=2(2)-3=1\) dan \(p_{34}=2(3)-4=2\), sehingga jumlahnya \(3\).
</p>
<p>Jebakan: tertukar urutan \(i\) dan \(j\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>
Diketahui \(\displaystyle A=\begin{bmatrix}x+2y&amp;5\\3&amp;2x-y\end{bmatrix}\) dan
\(\displaystyle B=\begin{bmatrix}8&amp;5\\3&amp;1\end{bmatrix}\). Jika \(A=B\), nilai
\(xy\) adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(5\)` },
                { key: "B", text: h`\(6\)` },
                { key: "C", text: h`\(8\)` },
                { key: "D", text: h`\(10\)` },
                { key: "E", text: h`\(13\)` },
              ],
              answer: "B",
              explanation: h`<p>
Kesamaan matriks memberi \(x+2y=8\) dan \(2x-y=1\). Dari persamaan kedua
\(y=2x-1\), sehingga \(x+4x-2=8\Rightarrow x=2\) dan \(y=3\).
</p>
<div class="math-display">\[ xy=2\cdot3=6 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>
Diketahui \(\displaystyle A=\begin{bmatrix}1&amp;-2\\3&amp;4\end{bmatrix}\) dan
\(\displaystyle B=\begin{bmatrix}0&amp;1\\-1&amp;2\end{bmatrix}\). Hasil \(2A-B^T\)
adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(\displaystyle \begin{bmatrix}2&-5\\7&6\end{bmatrix}\)` },
                { key: "B", text: h`\(\displaystyle \begin{bmatrix}2&-5\\7&10\end{bmatrix}\)` },
                { key: "C", text: h`\(\displaystyle \begin{bmatrix}2&-3\\5&10\end{bmatrix}\)` },
                { key: "D", text: h`\(\displaystyle \begin{bmatrix}2&-3\\5&6\end{bmatrix}\)` },
                { key: "E", text: h`\(\displaystyle \begin{bmatrix}-2&3\\-5&-6\end{bmatrix}\)` },
              ],
              answer: "D",
              explanation: h`<p>
\(\displaystyle B^T=\begin{bmatrix}0&amp;-1\\1&amp;2\end{bmatrix}\)
dan
\(\displaystyle 2A=\begin{bmatrix}2&amp;-4\\6&amp;8\end{bmatrix}\),
sehingga:
</p>
<div class="math-display">
\[
2A-B^T=\left[\begin{smallmatrix}2&amp;-3\\5&amp;6\end{smallmatrix}\right]
\]
</div>
<p>
Jebakan A: lupa men-transpose \(B\); jebakan B: menjumlah, bukan
mengurangi.
</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>
Invers matriks \(\displaystyle \begin{bmatrix}5&amp;2\\7&amp;3\end{bmatrix}\) adalah
....
</p>`,
              options: [
                { key: "A", text: h`\(\displaystyle \begin{bmatrix}3&-2\\-7&5\end{bmatrix}\)` },
                { key: "B", text: h`\(\displaystyle \begin{bmatrix}3&2\\7&5\end{bmatrix}\)` },
                { key: "C", text: h`\(\displaystyle \begin{bmatrix}5&-2\\-7&3\end{bmatrix}\)` },
                { key: "D", text: h`\(\displaystyle \begin{bmatrix}-3&2\\7&-5\end{bmatrix}\)` },
                { key: "E", text: h`\(\displaystyle \begin{bmatrix}3&-7\\-2&5\end{bmatrix}\)` },
              ],
              answer: "A",
              explanation: h`<p>
\(\det=5\cdot3-2\cdot7=1\). Tukar \(a\) dan \(d\), ubah tanda \(b\) dan
\(c\):
</p>
<div class="math-display">
\[
A^{-1}=\frac11\left[\begin{smallmatrix}3&amp;-2\\-7&amp;5\end{smallmatrix}\right]
\]
</div>
<p>Jebakan E: men-transpose, bukan menukar tanda.</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>
Segitiga \(PQR\) pada gambar dicerminkan terhadap sumbu-\(y\) dengan
matriks \(\displaystyle \begin{bmatrix}-1&amp;0\\0&amp;1\end{bmatrix}\). Koordinat
bayangan titik \(R\) adalah ....
</p>`,
              figure: h`<svg aria-label="Segitiga PQR dengan P(1,2), Q(4,2), R(4,4)" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 292px; height: auto" viewBox="0 0 292 172"><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="26.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="50.0" x2="50.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="74.0" x2="74.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="98.0" x2="98.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="122.0" x2="122.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="146.0" x2="146.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="170.0" x2="170.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="194.0" x2="194.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="218.0" x2="218.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="242.0" x2="242.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="266.0" x2="266.0" y1="146.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="266.0" y1="146.0" y2="146.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="266.0" y1="122.0" y2="122.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="266.0" y1="98.0" y2="98.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="266.0" y1="74.0" y2="74.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="266.0" y1="50.0" y2="50.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="266.0" y1="26.0" y2="26.0"></line><line stroke="currentColor" stroke-width="1.6" x1="26.0" x2="274.0" y1="146.0" y2="146.0"></line><line stroke="currentColor" stroke-width="1.6" x1="146.0" x2="146.0" y1="146.0" y2="18.0"></line><polygon fill="currentColor" points="274.0,146.0 267.0,142.5 267.0,149.5"></polygon><polygon fill="currentColor" points="146.0,18.0 142.5,25.0 149.5,25.0"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="277.0" y="150.0"> x </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="153.0" y="20.0"> y </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="26.0" y="159.0"> -5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="50.0" y="159.0"> -4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="74.0" y="159.0"> -3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="98.0" y="159.0"> -2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="122.0" y="159.0"> -1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="170.0" y="159.0"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="194.0" y="159.0"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="218.0" y="159.0"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="242.0" y="159.0"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="266.0" y="159.0"> 5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="141.0" y="125.5"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="141.0" y="101.5"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="141.0" y="77.5"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="141.0" y="53.5"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="141.0" y="29.5"> 5 </text><polygon fill="#0f172a" fill-opacity="0.18" points="170.0,98.0 242.0,98.0 242.0,50.0" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></polygon><circle cx="170.0" cy="98.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="160.0" y="92.0"> P </text><circle cx="242.0" cy="98.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="248.0" y="112.0"> Q </text><circle cx="242.0" cy="50.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="248.0" y="46.0"> R </text></svg>`,
              options: [
                { key: "A", text: h`\((4,-4)\)` },
                { key: "B", text: h`\((-4,-4)\)` },
                { key: "C", text: h`\((4,4)\)` },
                { key: "D", text: h`\((-2,4)\)` },
                { key: "E", text: h`\((-4,4)\)` },
              ],
              answer: "E",
              explanation: h`<p>
Bayangan titik \((x,y)\) adalah \((-x,y)\), sehingga \(R(4,4)\mapsto
R'(-4,4)\).
</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
          ],
        },
        {
          level: "sedang",
          questions: [
            {
              id: "pg-6",
              no: 6,
              type: "pg",
              level: "sedang",
              prompt: h`<p>
Diketahui \(\displaystyle A=\begin{bmatrix}2&amp;-1\\1&amp;3\end{bmatrix}\). Jika
\(A^2-pA+qI=O\), nilai \(p+q\) adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(7\)` },
                { key: "C", text: h`\(10\)` },
                { key: "D", text: h`\(12\)` },
                { key: "E", text: h`\(35\)` },
              ],
              answer: "D",
              explanation: h`<p>
Menurut teorema Cayley–Hamilton, \(p=\operatorname{tr}(A)=5\) dan
\(q=\det(A)=7\).
</p>
<p>
Pemeriksaan:
\(\displaystyle A^2=\begin{bmatrix}3&amp;-5\\5&amp;8\end{bmatrix}\)
dan \(A^2-5A+7I=O\).
</p>
<p>Jebakan E: menghitung \(pq=35\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>
Dua cabang toko alat tulis menyimpan stok pena, buku, dan map seperti pada
tabel. Harga satuan (dalam ribuan rupiah) adalah \(8\), \(5\), dan \(12\).
Jika semua harga naik \(20\%\), selisih nilai persediaan Toko 2 dan Toko 1
adalah ....
</p>
<table class="tabel-data">
<thead>
<tr>
<th></th>
<th>Pena</th>
<th>Buku</th>
<th>Map</th>
</tr>
</thead>
<tbody>
<tr>
<th>Stok Toko 1</th>
<td>10</td>
<td>20</td>
<td>5</td>
</tr>
<tr>
<th>Stok Toko 2</th>
<td>15</td>
<td>10</td>
<td>10</td>
</tr>
<tr>
<th>Harga (ribuan rupiah)</th>
<td>8</td>
<td>5</td>
<td>12</td>
</tr>
</tbody>
</table>`,
              options: [
                { key: "A", text: h`Rp50.000` },
                { key: "B", text: h`Rp55.000` },
                { key: "C", text: h`Rp60.000` },
                { key: "D", text: h`Rp65.000` },
                { key: "E", text: h`Rp72.000` },
              ],
              answer: "C",
              explanation: h`<p>Nilai persediaan \(=S\cdot h\):</p>
<div class="math-display">
\[
\begin{bmatrix}10&amp;20&amp;5\\15&amp;10&amp;10\end{bmatrix}\begin{bmatrix}8\\5\\12\end{bmatrix}=\begin{bmatrix}240\\290\end{bmatrix}
\]
</div>
<p>
Selisih \(290-240=50\) (ribuan rupiah). Setelah harga naik \(20\%\),
selisihnya \(1{,}2\times50=60\) ribu, yaitu Rp60.000.
</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>
Matriks \(A\) berordo \(3\times3\) dengan \(\det(A)=3\). Nilai
\(\det\!\big(2A^{2}(A^{T})^{-1}\big)\) adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(6\)` },
                { key: "B", text: h`\(24\)` },
                { key: "C", text: h`\(12\)` },
                { key: "D", text: h`\(48\)` },
                { key: "E", text: h`\(72\)` },
              ],
              answer: "B",
              explanation: h`<p>Untuk matriks \(3\times3\), \(\det(kM)=k^3\det M\). Maka:</p>
<div class="math-display">
\[ \det\big(2A^2(A^T)^{-1}\big)=2^3\cdot(\det A)^2\cdot\frac1{\det
A}=8\cdot9\cdot\frac13=24 \]
</div>
<p>Jebakan A: memakai faktor \(2\), bukan \(2^3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>
Gambar menunjukkan grafik garis \(g\) dan garis \(h\). Sistem persamaan
linear dari kedua garis ditulis \(ax+by=e\) (garis \(g\) lebih dulu, lalu
\(h\)). Dengan aturan Cramer, nilai \(D_x+D_y\) adalah ....
</p>`,
              figure: h`<svg aria-label="Garis g melalui (6,0) dan (0,4); garis h melalui (2,0) dan (0,-4)" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 260px; height: auto" viewBox="0 0 260 312"><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="26.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="52.0" x2="52.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="78.0" x2="78.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="104.0" x2="104.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="130.0" x2="130.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="156.0" x2="156.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="182.0" x2="182.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="208.0" x2="208.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="234.0" x2="234.0" y1="286.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="286.0" y2="286.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="260.0" y2="260.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="234.0" y2="234.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="208.0" y2="208.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="182.0" y2="182.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="156.0" y2="156.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="130.0" y2="130.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="104.0" y2="104.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="78.0" y2="78.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="52.0" y2="52.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="234.0" y1="26.0" y2="26.0"></line><clippath id="mx-c9"><rect height="260" width="208" x="26.0" y="26.0"></rect></clippath><line stroke="currentColor" stroke-width="1.6" x1="26.0" x2="242.0" y1="156.0" y2="156.0"></line><line stroke="currentColor" stroke-width="1.6" x1="52.0" x2="52.0" y1="286.0" y2="18.0"></line><polygon fill="currentColor" points="242.0,156.0 235.0,152.5 235.0,159.5"></polygon><polygon fill="currentColor" points="52.0,18.0 48.5,25.0 55.5,25.0"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="245.0" y="160.0"> x </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="59.0" y="20.0"> y </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="26.0" y="169.0"> -1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="78.0" y="169.0"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="104.0" y="169.0"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="130.0" y="169.0"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="156.0" y="169.0"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="182.0" y="169.0"> 5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="208.0" y="169.0"> 6 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="234.0" y="169.0"> 7 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="289.5"> -5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="263.5"> -4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="237.5"> -3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="211.5"> -2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="185.5"> -1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="133.5"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="107.5"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="81.5"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="55.5"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="47.0" y="29.5"> 5 </text><line clip-path="url(#mx-c9)" stroke="#0f172a" stroke-width="2" x1="26.0" x2="234.0" y1="34.7" y2="173.3"></line><line clip-path="url(#mx-c9)" stroke="#64748b" stroke-width="2" x1="39.0" x2="143.0" y1="286.0" y2="78.0"></line><circle cx="208.0" cy="156.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="213.0" y="149.0"> (6,0) </text><circle cx="52.0" cy="52.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="59.0" y="56.0"> (0,4) </text><circle cx="104.0" cy="156.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="98.0" y="149.0"> (2,0) </text><circle cx="52.0" cy="260.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="59.0" y="264.0"> (0,-4) </text><text fill="#0f172a" font-size="12" font-style="italic" text-anchor="middle" x="71.5" y="39.0"> g </text><text fill="#64748b" font-size="12" font-style="italic" text-anchor="middle" x="153.4" y="72.8"> h </text></svg>`,
              options: [
                { key: "A", text: h`\(-48\)` },
                { key: "B", text: h`\(-24\)` },
                { key: "C", text: h`\(-8\)` },
                { key: "D", text: h`\(40\)` },
                { key: "E", text: h`\(-40\)` },
              ],
              answer: "E",
              explanation: h`<p>
Garis \(g\) melalui \((6,0)\) dan \((0,4)\): \(2x+3y=12\). Garis \(h\)
melalui \((2,0)\) dan \((0,-4)\): \(2x-y=4\).
</p>
<div class="math-display">
\[ D=\begin{vmatrix}2&amp;3\\2&amp;-1\end{vmatrix}=-8,\quad
D_x=\begin{vmatrix}12&amp;3\\4&amp;-1\end{vmatrix}=-24,\quad
D_y=\begin{vmatrix}2&amp;12\\2&amp;4\end{vmatrix}=-16 \]
</div>
<p>
Jadi \(D_x+D_y=-40\). Pemeriksaan: \(\displaystyle x=\frac{-24}{-8}=3\) dan
\(\displaystyle y=\frac{-16}{-8}=2\).
</p>
<p>Jebakan A: ikut menjumlahkan \(D\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>
Gambar menunjukkan persegi satuan \(OABC\) dan bayangannya \(OA'B'C'\)
oleh transformasi linear \(T\). Bayangan titik \((2,3)\) oleh \(T\) adalah
....
</p>`,
              figure: h`<svg aria-label="Persegi satuan OABC (biru) dan bayangannya OA'B'C' (jingga putus-putus)" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 246px; height: auto" viewBox="0 0 246 208"><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="28.0" y1="180.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="66.0" x2="66.0" y1="180.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="104.0" x2="104.0" y1="180.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="142.0" x2="142.0" y1="180.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="180.0" x2="180.0" y1="180.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="218.0" x2="218.0" y1="180.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="218.0" y1="180.0" y2="180.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="218.0" y1="142.0" y2="142.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="218.0" y1="104.0" y2="104.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="218.0" y1="66.0" y2="66.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="218.0" y1="28.0" y2="28.0"></line><line stroke="currentColor" stroke-width="1.6" x1="28.0" x2="226.0" y1="142.0" y2="142.0"></line><line stroke="currentColor" stroke-width="1.6" x1="104.0" x2="104.0" y1="180.0" y2="20.0"></line><polygon fill="currentColor" points="226.0,142.0 219.0,138.5 219.0,145.5"></polygon><polygon fill="currentColor" points="104.0,20.0 100.5,27.0 107.5,27.0"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="229.0" y="146.0"> x </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="111.0" y="22.0"> y </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="28.0" y="155.0"> -2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="66.0" y="155.0"> -1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="142.0" y="155.0"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="180.0" y="155.0"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="218.0" y="155.0"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="99.0" y="183.5"> -1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="99.0" y="107.5"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="99.0" y="69.5"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="99.0" y="31.5"> 3 </text><polygon fill="#64748b" fill-opacity="0.12" points="104.0,142.0 180.0,104.0 142.0,66.0 66.0,104.0" stroke="#64748b" stroke-dasharray="6 4" stroke-linejoin="round" stroke-width="2.2"></polygon><polygon fill="#0f172a" fill-opacity="0.25" points="104.0,142.0 142.0,142.0 142.0,104.0 104.0,104.0" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="142.0" y="166.0"> A </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="149.0" y="99.0"> B </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="111.0" y="99.0"> C </text><circle cx="180.0" cy="104.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="185.0" y="108.0"> A'(2,1) </text><circle cx="142.0" cy="66.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="147.0" y="61.0"> B'(1,2) </text><circle cx="66.0" cy="104.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="61.0" y="98.0"> C'(-1,1) </text></svg>`,
              options: [
                { key: "A", text: h`\((5,1)\)` },
                { key: "B", text: h`\((-1,5)\)` },
                { key: "C", text: h`\((7,1)\)` },
                { key: "D", text: h`\((1,5)\)` },
                { key: "E", text: h`\((4,2)\)` },
              ],
              answer: "D",
              explanation: h`<p>
Kolom matriks \(T\) adalah bayangan vektor basis: kolom pertama bayangan
\(A(1,0)\) dan kolom kedua bayangan \(C(0,1)\). Jadi
\(\displaystyle T=\begin{bmatrix}2&amp;-1\\1&amp;1\end{bmatrix}\).
</p>
<div class="math-display">
\[
T\begin{bmatrix}2\\3\end{bmatrix}=\begin{bmatrix}4-3\\2+3\end{bmatrix}=\begin{bmatrix}1\\5\end{bmatrix}
\]
</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          note: "Setara UTBK",
          questions: [
            {
              id: "pg-11",
              no: 11,
              type: "pg",
              level: "sulit",
              prompt: h`<p>
Diketahui \(\displaystyle A=\begin{bmatrix}3&amp;1\\5&amp;2\end{bmatrix}\) dan
\(\displaystyle B=\begin{bmatrix}1&amp;2\\3&amp;4\end{bmatrix}\). Jika matriks \(X\)
memenuhi \(XA=B\), elemen baris kedua kolom pertama matriks \(X\) adalah
....
</p>`,
              options: [
                { key: "A", text: h`\(-8\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(-14\)` },
                { key: "D", text: h`\(5\)` },
                { key: "E", text: h`\(9\)` },
              ],
              answer: "C",
              explanation: h`<p>
\(XA=B\Rightarrow X=BA^{-1}\) (invers dikalikan dari kanan).
\(\displaystyle A^{-1}=\begin{bmatrix}2&amp;-1\\-5&amp;3\end{bmatrix}\),
sehingga:
</p>
<div class="math-display">
\[
X=\left[\begin{smallmatrix}1&amp;2\\3&amp;4\end{smallmatrix}\right]\left[\begin{smallmatrix}2&amp;-1\\-5&amp;3\end{smallmatrix}\right]=\left[\begin{smallmatrix}-8&amp;5\\-14&amp;9\end{smallmatrix}\right]
\]
</div>
<p>
Jadi \(x_{21}=-14\). Jebakan B: memakai \(A^{-1}B\), yang memberi
\(x_{21}=4\).
</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>
Sistem persamaan linear \(\displaystyle \begin{cases}x+y+z=6\\ x-y+2z=5\\
4x+2y+az=b\end{cases}\) memiliki tak hingga banyak solusi. Nilai \(a+b\)
adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(5\)` },
                { key: "B", text: h`\(28\)` },
                { key: "C", text: h`\(23\)` },
                { key: "D", text: h`\(18\)` },
                { key: "E", text: h`\(33\)` },
              ],
              answer: "B",
              explanation: h`<p>
Kombinasi baris: \(3R_1+R_2=4x+2y+5z=23\). Agar baris ketiga bergantung
pada dua baris lain (tak hingga solusi), haruslah \(a=5\) dan \(b=23\).
</p>
<p>
Pemeriksaan:
\(\displaystyle \det\begin{bmatrix}1&amp;1&amp;1\\1&amp;-1&amp;2\\4&amp;2&amp;5\end{bmatrix}=0\).
Jika \(a=5\) tetapi \(b\neq23\), sistem tidak punya solusi.
</p>
<p>Jadi \(a+b=28\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>
Segitiga \(ABC\) pada gambar dipetakan oleh
\(\displaystyle T=\begin{bmatrix}2&amp;k\\1&amp;3\end{bmatrix}\) menjadi segitiga
berluas \(42\) satuan luas. Jumlah semua nilai \(k\) yang mungkin adalah
....
</p>`,
              figure: h`<svg aria-label="Segitiga ABC dengan A(1,1), B(4,1), C(2,5)" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 220px; height: auto" viewBox="0 0 220 220"><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="26.0" y1="194.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="54.0" x2="54.0" y1="194.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="82.0" x2="82.0" y1="194.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="110.0" x2="110.0" y1="194.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="138.0" x2="138.0" y1="194.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="166.0" x2="166.0" y1="194.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="194.0" x2="194.0" y1="194.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="194.0" y1="194.0" y2="194.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="194.0" y1="166.0" y2="166.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="194.0" y1="138.0" y2="138.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="194.0" y1="110.0" y2="110.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="194.0" y1="82.0" y2="82.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="194.0" y1="54.0" y2="54.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="194.0" y1="26.0" y2="26.0"></line><line stroke="currentColor" stroke-width="1.6" x1="26.0" x2="202.0" y1="194.0" y2="194.0"></line><line stroke="currentColor" stroke-width="1.6" x1="26.0" x2="26.0" y1="194.0" y2="18.0"></line><polygon fill="currentColor" points="202.0,194.0 195.0,190.5 195.0,197.5"></polygon><polygon fill="currentColor" points="26.0,18.0 22.5,25.0 29.5,25.0"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="205.0" y="198.0"> x </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="33.0" y="20.0"> y </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="54.0" y="207.0"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="82.0" y="207.0"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="110.0" y="207.0"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="138.0" y="207.0"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="166.0" y="207.0"> 5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="194.0" y="207.0"> 6 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="21.0" y="169.5"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="21.0" y="141.5"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="21.0" y="113.5"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="21.0" y="85.5"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="21.0" y="57.5"> 5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="21.0" y="29.5"> 6 </text><polygon fill="#0f172a" fill-opacity="0.18" points="54.0,166.0 138.0,166.0 82.0,54.0" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></polygon><circle cx="54.0" cy="166.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="48.0" y="182.0"> A(1,1) </text><circle cx="138.0" cy="166.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="144.0" y="182.0"> B(4,1) </text><circle cx="82.0" cy="54.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="88.0" y="49.0"> C(2,5) </text></svg>`,
              options: [
                { key: "A", text: h`\(12\)` },
                { key: "B", text: h`\(13\)` },
                { key: "C", text: h`\(-13\)` },
                { key: "D", text: h`\(6\)` },
                { key: "E", text: h`\(14\)` },
              ],
              answer: "A",
              explanation: h`<p>
Luas \(\displaystyle ABC=\frac12\cdot3\cdot4=6\). Karena \(\det T=6-k\), luas bayangan
\(=|6-k|\cdot6=42\Rightarrow|6-k|=7\).
</p>
<p>Maka \(k=-1\) atau \(k=13\), dan jumlahnya \(12\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>
Diketahui \(\displaystyle A=\begin{bmatrix}1&amp;2\\0&amp;1\end{bmatrix}\) dan
\(\displaystyle B=\begin{bmatrix}1&amp;0\\3&amp;1\end{bmatrix}\). Perhatikan pernyataan
berikut.
</p>
<ol>
<li>\(AB=BA\).</li>
<li>\(\det(AB)=\det(BA)\).</li>
<li>\((AB)^T=A^TB^T\).</li>
<li>\(\displaystyle AB-BA=\begin{bmatrix}6&amp;0\\0&amp;-6\end{bmatrix}\).</li>
</ol>
<p>Pernyataan yang benar adalah ....</p>`,
              options: [
                { key: "A", text: h`(1) dan (2) saja` },
                { key: "B", text: h`(1) dan (3) saja` },
                { key: "C", text: h`(2) dan (4) saja` },
                { key: "D", text: h`(1), (3), dan (4) saja` },
                { key: "E", text: h`(2), (3), dan (4) saja` },
              ],
              answer: "C",
              explanation: h`<p>
\(\displaystyle AB=\begin{bmatrix}7&amp;2\\3&amp;1\end{bmatrix}\)
dan
\(\displaystyle BA=\begin{bmatrix}1&amp;2\\3&amp;7\end{bmatrix}\),
sehingga (1) salah dan (4) benar karena
\(\displaystyle AB-BA=\begin{bmatrix}6&amp;0\\0&amp;-6\end{bmatrix}\).
</p>
<p>(2) benar karena \(\det(AB)=\det A\det B=\det(BA)=1\).</p>
<p>
(3) salah:
\(\displaystyle (AB)^T=\begin{bmatrix}7&amp;3\\2&amp;1\end{bmatrix}=B^TA^T\),
sedangkan
\(\displaystyle A^TB^T=\begin{bmatrix}1&amp;3\\2&amp;7\end{bmatrix}\).
</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>
Diketahui
\(\displaystyle A=\begin{bmatrix}1&amp;2&amp;0\\3&amp;1&amp;2\\0&amp;1&amp;1\end{bmatrix}\).
Elemen baris kedua kolom ketiga pada \(A^{-1}\) adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(\displaystyle \frac17\)` },
                { key: "B", text: h`\(\displaystyle -\frac27\)` },
                { key: "C", text: h`\(\displaystyle -\frac17\)` },
                { key: "D", text: h`\(\displaystyle \frac27\)` },
                { key: "E", text: h`\(\displaystyle \frac37\)` },
              ],
              answer: "D",
              explanation: h`<p>
\(\det A=1(1-2)-2(3-0)=-7\). Adjoin adalah transpose kofaktor, sehingga
\((A^{-1})_{23}=\dfrac{C_{32}}{\det A}\).
</p>
<div class="math-display">
\[
C_{32}=-\begin{vmatrix}1&amp;0\\3&amp;2\end{vmatrix}=-2\quad\Rightarrow\quad
(A^{-1})_{23}=\frac{-2}{-7}=\frac27 \]
</div>
<p>Jebakan A: memakai \(C_{23}=-1\) tanpa transpose.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          note: "Penalaran tingkat tinggi gaya UTBK",
          questions: [
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "hots",
              prompt: h`<p>
Diagram menunjukkan jalur satu arah antara empat kota \(P\), \(Q\), \(R\),
dan \(S\). Banyak rute berbeda dengan tepat tiga ruas jalan yang berawal
dan berakhir di kota yang sama (kota awalnya boleh \(P\), \(Q\), \(R\),
atau \(S\)) adalah ....
</p>
<p class="catatan-bentuk">
<em>Petunjuk: susun matriks ketetanggaan, yaitu elemen baris \(i\) kolom
\(j\) bernilai \(1\) jika ada jalur langsung dari kota \(i\) ke kota
\(j\).</em>
</p>`,
              figure: h`<svg aria-label="Graf berarah: P ke Q, Q ke R, R ke S, S ke P, P ke R, Q ke S" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 210px; height: auto" viewBox="0 0 210 170"><defs><marker id="mx-a16" markerheight="10" markerunits="userSpaceOnUse" markerwidth="10" orient="auto" refx="9" refy="5" viewBox="0 0 10 10"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path></marker></defs><line marker-end="url(#mx-a16)" stroke="currentColor" stroke-width="1.8" x1="52.0" x2="158.0" y1="40.0" y2="40.0"></line><line marker-end="url(#mx-a16)" stroke="currentColor" stroke-width="1.8" x1="170.0" x2="170.0" y1="52.0" y2="118.0"></line><line marker-end="url(#mx-a16)" stroke="currentColor" stroke-width="1.8" x1="158.0" x2="52.0" y1="130.0" y2="130.0"></line><line marker-end="url(#mx-a16)" stroke="currentColor" stroke-width="1.8" x1="40.0" x2="40.0" y1="118.0" y2="52.0"></line><line marker-end="url(#mx-a16)" stroke="currentColor" stroke-width="1.8" x1="49.9" x2="160.1" y1="46.8" y2="123.2"></line><path d="M158.7,43.9 Q92.5,66.9 47.7,120.8" fill="none" marker-end="url(#mx-a16)" stroke="currentColor" stroke-width="1.8"></path><circle cx="40" cy="40" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="40.0" y="44.0"> P </text><circle cx="170" cy="40" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="170.0" y="44.0"> Q </text><circle cx="170" cy="130" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="170.0" y="134.0"> R </text><circle cx="40" cy="130" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="40.0" y="134.0"> S </text></svg>`,
              options: [
                { key: "A", text: h`\(0\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(5\)` },
                { key: "D", text: h`\(11\)` },
                { key: "E", text: h`\(6\)` },
              ],
              answer: "E",
              explanation: h`<p>
Dengan urutan \(P,Q,R,S\):
\(\displaystyle A=\begin{bmatrix}0&amp;1&amp;1&amp;0\\0&amp;0&amp;1&amp;1\\0&amp;0&amp;0&amp;1\\1&amp;0&amp;0&amp;0\end{bmatrix}\).
Elemen diagonal \(A^3\) menghitung rute tertutup tiga ruas.
</p>
<p>
\(P\): PQSP dan PRSP (2); \(Q\): QSPQ (1); \(R\): RSPR (1); \(S\): SPQS
dan SPRS (2).
</p>
<p>
Total \(\operatorname{tr}(A^3)=2+1+1+2=6\). Jebakan \(11\): menjumlahkan
semua elemen \(A^3\).
</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "hots",
              prompt: h`<p>
Apakah matriks
\(\displaystyle B=\begin{bmatrix}1&amp;2&amp;3\\4&amp;5&amp;6\\7&amp;8&amp;k\end{bmatrix}\)
mempunyai invers?
</p>
<ol>
<li>\(k=9\).</li>
<li>Jumlah elemen pada diagonal utama \(B\) adalah \(15\).</li>
</ol>`,
              options: [
                { key: "A", text: h`Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi
pernyataan (2) SAJA tidak cukup.` },
                { key: "B", text: h`Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi
pernyataan (1) SAJA tidak cukup.` },
                { key: "C", text: h`DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi
SATU pernyataan SAJA tidak cukup.` },
                { key: "D", text: h`Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA cukup untuk
menjawab pertanyaan.` },
                { key: "E", text: h`Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab
pertanyaan.` },
              ],
              answer: "D",
              explanation: h`<p>
\(\det B=1(5k-48)-2(4k-42)+3(32-35)=27-3k=3(9-k)\). Jadi \(B\) punya
invers jika dan hanya jika \(k\neq9\).
</p>
<p>
Pernyataan (1): \(k=9\), \(\det B=0\), jawabannya <em>tidak</em>.
Pernyataan (2): \(1+5+k=15\Rightarrow k=9\), jawabannya juga
<em>tidak</em>. Masing-masing pernyataan sudah cukup.
</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "hots",
              prompt: h`<p>
Titik \(\displaystyle P_k=M^k\begin{bmatrix}1\\0\end{bmatrix}\) untuk \(k=0,1,\dots,5\)
dengan
\(\displaystyle M=\begin{bmatrix}\cos60^\circ&amp;-\sin60^\circ\\\sin60^\circ&amp;\cos60^\circ\end{bmatrix}\)
membentuk segienam beraturan pada gambar. Tentukan nilai kebenaran tiga
pernyataan berikut (B = benar, S = salah), berurutan dari (i) sampai
(iii).
</p>
<ol type="i">
<li>\(M^6=I\).</li>
<li>\(M^2-M+I=O\).</li>
<li>\(M^3=I\).</li>
</ol>`,
              figure: h`<svg aria-label="Titik P0 sampai P5 membentuk segienam beraturan pada lingkaran" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 220px; height: auto" viewBox="0 0 220 200"><defs><marker id="mx-a18" markerheight="10" markerunits="userSpaceOnUse" markerwidth="10" orient="auto" refx="9" refy="5" viewBox="0 0 10 10"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path></marker></defs><circle cx="110" cy="100" fill="none" r="70" stroke="currentColor" stroke-opacity=".35"></circle><polygon fill="#0f172a" fill-opacity=".12" points="180.0,100.0 145.0,39.4 75.0,39.4 40.0,100.0 75.0,160.6 145.0,160.6" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></polygon><circle cx="180.0" cy="100.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="188.0" y="96.0"> P <tspan dy="3" font-size="9">0</tspan></text><circle cx="145.0" cy="39.4" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="149.0" y="31.4"> P <tspan dy="3" font-size="9">1</tspan></text><circle cx="75.0" cy="39.4" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="71.0" y="31.4"> P <tspan dy="3" font-size="9">2</tspan></text><circle cx="40.0" cy="100.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="32.0" y="96.0"> P <tspan dy="3" font-size="9">3</tspan></text><circle cx="75.0" cy="160.6" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="71.0" y="174.6"> P <tspan dy="3" font-size="9">4</tspan></text><circle cx="145.0" cy="160.6" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="149.0" y="174.6"> P <tspan dy="3" font-size="9">5</tspan></text><circle cx="110" cy="100" fill="currentColor" r="2.4"></circle><path d="M134,91 A26,26 0 0 0 123,77" fill="none" marker-end="url(#mx-a18)" stroke="#64748b" stroke-width="2"></path><text fill="#64748b" font-size="10" text-anchor="start" x="140.0" y="78.0"> 60° </text></svg>`,
              options: [
                { key: "A", text: h`B, B, B` },
                { key: "B", text: h`B, B, S` },
                { key: "C", text: h`B, S, B` },
                { key: "D", text: h`S, B, B` },
                { key: "E", text: h`S, S, B` },
              ],
              answer: "B",
              explanation: h`<p>
\(M\) adalah rotasi \(60^\circ\), sehingga \(M^k\) adalah rotasi
\(60k^\circ\).
</p>
<p>
<strong>(i) Benar.</strong> \(M^6\) adalah rotasi \(360^\circ\), yaitu
\(I\).
</p>
<p>
<strong>(ii) Benar.</strong> \(\operatorname{tr}(M)=1\) dan \(\det
M=1\), sehingga menurut Cayley–Hamilton \(M^2-M+I=O\).
</p>
<p>
<strong>(iii) Salah.</strong> \(M^3\) adalah rotasi \(180^\circ\), yaitu
\(-I\neq I\).
</p>
<p>Urutannya: B, B, S.</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt: h`<p>
Matriks \(\displaystyle A=\begin{bmatrix}a&amp;b\\c&amp;d\end{bmatrix}\) memenuhi
\(A^2=I\), \(A\neq I\), dan \(A\neq-I\). Nilai \(a+d\) dan \(ad-bc\)
berturut-turut adalah ....
</p>`,
              options: [
                { key: "A", text: h`\(0\text{ dan }-1\)` },
                { key: "B", text: h`\(0\text{ dan }1\)` },
                { key: "C", text: h`\(1\text{ dan }-1\)` },
                { key: "D", text: h`\(-1\text{ dan }0\)` },
                { key: "E", text: h`\(2\text{ dan }1\)` },
              ],
              answer: "A",
              explanation: h`<p>
Cayley–Hamilton: \(A^2-(a+d)A+(ad-bc)I=O\). Dengan \(A^2=I\)
diperoleh \((a+d)A=(1+ad-bc)I\).
</p>
<p>
Karena \(A\) bukan matriks skalar (\(A\neq\pm I\)), haruslah \(a+d=0\)
dan \(1+ad-bc=0\), yaitu \(ad-bc=-1\).
</p>
<p>
Contoh:
\(\displaystyle A=\begin{bmatrix}1&amp;0\\0&amp;-1\end{bmatrix}\).
</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "hots",
              prompt: h`<p>
Penduduk kota \(A\) dan \(B\) berpindah mengikuti diagram: tiap tahun
\(20\%\) penduduk \(A\) pindah ke \(B\) dan \(30\%\) penduduk \(B\) pindah
ke \(A\), sedangkan sisanya menetap. Jumlah penduduk kedua kota selalu
\(1000\) jiwa. Pada keadaan setimbang (banyak penduduk tiap kota tidak
berubah dari tahun ke tahun), penduduk kota \(A\) berjumlah .... jiwa.
</p>`,
              figure: h`<svg aria-label="Diagram perpindahan penduduk antara kota A dan B" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 260px; height: auto" viewBox="0 0 260 160"><defs><marker id="mx-a20" markerheight="10" markerunits="userSpaceOnUse" markerwidth="10" orient="auto" refx="9" refy="5" viewBox="0 0 10 10"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path></marker></defs><path d="M72.6,86.1 Q130.0,114.0 187.4,86.1" fill="none" marker-end="url(#mx-a20)" stroke="currentColor" stroke-width="1.8"></path><path d="M187.4,73.9 Q130.0,46.0 72.6,73.9" fill="none" marker-end="url(#mx-a20)" stroke="currentColor" stroke-width="1.8"></path><path d="M51,68 C10,35 10,125 51,92" fill="none" marker-end="url(#mx-a20)" stroke="#0f172a" stroke-width="1.8"></path><path d="M209,68 C250,35 250,125 209,92" fill="none" marker-end="url(#mx-a20)" stroke="#0f172a" stroke-width="1.8"></path><circle cx="60" cy="80" fill="#0f172a" fill-opacity=".12" r="14" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="60.0" y="84.0"> A </text><circle cx="200" cy="80" fill="#0f172a" fill-opacity=".12" r="14" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="200.0" y="84.0"> B </text><text fill="currentColor" font-size="11" text-anchor="middle" x="130.0" y="46.0"> 20% </text><text fill="currentColor" font-size="11" text-anchor="middle" x="130.0" y="124.0"> 30% </text><text fill="currentColor" font-size="11" text-anchor="middle" x="14.0" y="84.0"> 80% </text><text fill="currentColor" font-size="11" text-anchor="middle" x="246.0" y="84.0"> 70% </text></svg>`,
              options: [
                { key: "A", text: h`\(500\)` },
                { key: "B", text: h`\(625\)` },
                { key: "C", text: h`\(600\)` },
                { key: "D", text: h`\(650\)` },
                { key: "E", text: h`\(700\)` },
              ],
              answer: "C",
              explanation: h`<p>
Keadaan setimbang memenuhi \(TX=X\) dengan
\(\displaystyle T=\begin{bmatrix}0{,}8&amp;0{,}3\\0{,}2&amp;0{,}7\end{bmatrix}\),
yaitu \(\displaystyle -0{,}2a+0{,}3b=0\Rightarrow b=\frac23a\).
</p>
<p>
Dengan \(a+b=1000\): \(\displaystyle a+\frac23a=1000\Rightarrow a=600\) dan \(b=400\).
Pemeriksaan: \(0{,}8(600)+0{,}3(400)=600\).
</p>
<p>Jebakan: \(625\) adalah keadaan tahun ke-2 dari \((700,300)\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: "isian",
      letter: "B",
      title: "Isian Singkat",
      instruction: h`5 soal \(\times\) 4 poin = 20 poin. Ketik hanya jawaban akhir, lalu tekan
<strong>Periksa</strong> atau Enter.`,
      pointsEach: 4,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "isian-1",
              no: 1,
              type: "short",
              level: "sedang",
              prompt: h`<p>
Diketahui \(\displaystyle A=\begin{bmatrix}2&amp;1\\-1&amp;3\end{bmatrix}\) dan
\(\displaystyle B=\begin{bmatrix}1&amp;0\\2&amp;-1\end{bmatrix}\). Nilai \(\det(AB-BA)\)
adalah ....
</p>`,
              answer: ["-4"],
              explanation: h`<p>
\(\displaystyle AB=\begin{bmatrix}4&amp;-1\\5&amp;-3\end{bmatrix}\)
dan
\(\displaystyle BA=\begin{bmatrix}2&amp;1\\5&amp;-1\end{bmatrix}\),
sehingga
\(\displaystyle AB-BA=\begin{bmatrix}2&amp;-2\\0&amp;-2\end{bmatrix}\).
</p>
<p>Determinannya \(-4-0=\) <strong>\(-4\)</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>
Titik \(P(2,-1)\) dirotasikan \(90^\circ\) berlawanan arah jarum jam
terhadap titik asal, kemudian didilatasi dengan faktor \(3\) terhadap
titik asal, lalu dicerminkan terhadap sumbu-\(x\). Koordinat bayangan
akhir titik \(P\) adalah ....
</p>`,
              answer: ["(3,-6)", "3,-6"],
              explanation: h`<p>
Rotasi \(90^\circ\): \((x,y)\mapsto(-y,x)\), sehingga
\((2,-1)\mapsto(1,2)\). Dilatasi \(3\): \((3,6)\). Cermin sumbu-\(x\):
\((3,-6)\).
</p>
<div class="math-display">
\[
M=\left[\begin{smallmatrix}1&amp;0\\0&amp;-1\end{smallmatrix}\right]\left[\begin{smallmatrix}3&amp;0\\0&amp;3\end{smallmatrix}\right]\left[\begin{smallmatrix}0&amp;-1\\1&amp;0\end{smallmatrix}\right]=\left[\begin{smallmatrix}0&amp;-3\\-3&amp;0\end{smallmatrix}\right]
\]
</div>
<p>Jadi bayangan akhirnya <strong>\((3,-6)\)</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "isian-3",
              no: 3,
              type: "short",
              level: "sulit",
              prompt: h`<p>
Diketahui \(\displaystyle A=\begin{bmatrix}2&amp;1\\0&amp;2\end{bmatrix}\). Jumlah semua
elemen matriks \(A^{6}\) adalah ....
</p>`,
              answer: ["320"],
              explanation: h`<p>
Tulis \(A=2I+N\) dengan
\(\displaystyle N=\begin{bmatrix}0&amp;1\\0&amp;0\end{bmatrix}\)
dan \(N^2=O\). Maka \(A^n=2^nI+n2^{n-1}N\), sehingga
\(\displaystyle A^6=\begin{bmatrix}64&amp;192\\0&amp;64\end{bmatrix}\).
</p>
<p>Jumlah elemen \(64+192+0+64=\) <strong>320</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>
Matriks \(M\) berordo \(3\times3\) adalah persegi ajaib: jumlah elemen
setiap baris, setiap kolom, dan kedua diagonal utamanya sama. Tiga
elemennya sudah diketahui (lihat gambar), sedangkan elemen lain belum
diketahui dan tidak harus bilangan bulat positif. Nilai \(\det(M)\) adalah
....
</p>`,
              figure: h`<svg aria-label="Persegi ajaib 3 kali 3 dengan elemen 8, 1, dan 5 diketahui" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 142px; height: auto" viewBox="0 0 142 142"><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="14" y="14"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="32.0" y="38.0"> 8 </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="52" y="14"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="70.0" y="38.0"> 1 </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="90" y="14"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="108.0" y="38.0"> ? </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="14" y="52"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="32.0" y="76.0"> ? </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="52" y="52"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="70.0" y="76.0"> 5 </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="90" y="52"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="108.0" y="76.0"> ? </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="14" y="90"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="32.0" y="114.0"> ? </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="52" y="90"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="70.0" y="114.0"> ? </text><rect fill="#0f172a" fill-opacity=".1" height="36" stroke="currentColor" stroke-width="1.6" width="36" x="90" y="90"></rect><text fill="currentColor" font-size="15" text-anchor="middle" x="108.0" y="114.0"> ? </text></svg>`,
              answer: ["-360", "−360"],
              explanation: h`<p>
Persegi ajaib \(3\times3\) berbentuk
\(\displaystyle \begin{bmatrix}c+x&amp;c-x-y&amp;c+y\\c-x+y&amp;c&amp;c+x-y\\c-y&amp;c+x+y&amp;c-x\end{bmatrix}\).
Dari \(c=5\), \(c+x=8\), dan \(c-x-y=1\) diperoleh \(x=3\) dan \(y=1\),
sehingga
\(\displaystyle M=\begin{bmatrix}8&amp;1&amp;6\\3&amp;5&amp;7\\4&amp;9&amp;2\end{bmatrix}\).
</p>
<p>
Dengan Sarrus: \(\det M=(80+28+162)-(120+504+6)=270-630=\)
<strong>\(-360\)</strong>.
</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>
Graf tak berarah dengan lima titik pada gambar mempunyai matriks
ketetanggaan \(A\) (elemen \(a_{ij}=1\) jika titik \(i\) dan \(j\)
terhubung langsung, selain itu \(0\)). Nilai \(\operatorname{tr}(A^3)\),
yaitu jumlah elemen diagonal utama \(A^3\), adalah ....
</p>`,
              figure: h`<svg aria-label="Graf tak berarah lima titik dengan sisi 1-2, 1-3, 2-3, 2-4, 3-4, 4-5" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 255px; height: auto" viewBox="0 0 255 140"><line stroke="currentColor" stroke-width="1.8" x1="39.6" x2="80.4" y1="62.8" y2="32.2"></line><line stroke="currentColor" stroke-width="1.8" x1="39.6" x2="80.4" y1="77.2" y2="107.8"></line><line stroke="currentColor" stroke-width="1.8" x1="90.0" x2="90.0" y1="37.0" y2="103.0"></line><line stroke="currentColor" stroke-width="1.8" x1="100.1" x2="149.9" y1="31.5" y2="63.5"></line><line stroke="currentColor" stroke-width="1.8" x1="100.1" x2="149.9" y1="108.5" y2="76.5"></line><line stroke="currentColor" stroke-width="1.8" x1="172.0" x2="213.0" y1="70.0" y2="70.0"></line><circle cx="30" cy="70" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="30.0" y="74.0"> 1 </text><circle cx="90" cy="25" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="90.0" y="29.0"> 2 </text><circle cx="90" cy="115" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="90.0" y="119.0"> 3 </text><circle cx="160" cy="70" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="160.0" y="74.0"> 4 </text><circle cx="225" cy="70" fill="#0f172a" fill-opacity=".12" r="12" stroke="currentColor" stroke-width="1.6"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="225.0" y="74.0"> 5 </text></svg>`,
              answer: ["12"],
              explanation: h`<p>
Elemen diagonal \((A^3)_{ii}\) menghitung jalan tertutup tiga langkah
dari titik \(i\), yaitu segitiga yang memuat \(i\) (dihitung dua arah).
</p>
<p>
Graf memiliki \(2\) segitiga (1-2-3 dan 2-3-4), tiap segitiga memberi
\(6\) (3 titik awal \(\times\) 2 arah). Maka
\(\operatorname{tr}(A^3)=6\times2=\) <strong>12</strong>.
</p>
<p>Pemeriksaan langsung: diagonal \(A^3\) adalah \(2,4,4,2,0\).</p>`,
            },
          ],
        },
      ],
    },
    {
      id: "uraian",
      letter: "C",
      title: "Uraian (Essay)",
      instruction: h`5 soal \(\times\) 8 poin = 40 poin. Tuliskan langkah penyelesaian dengan
lengkap di buku atau kertas, lalu bandingkan dengan pembahasan dan pedoman
penskoran.`,
      pointsEach: 8,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "uraian-1",
              no: 1,
              type: "essay",
              level: "sedang",
              prompt: h`<p>
Segitiga \(ABC\) dengan \(A(1,1)\), \(B(4,1)\), dan \(C(1,3)\)
pertama-tama dirotasikan \(90^\circ\) berlawanan arah jarum jam terhadap
titik asal (matriks \(R\)), kemudian didilatasi dengan faktor \(2\)
terhadap titik asal (matriks \(D\)).
</p>`,
              figure: h`<svg aria-label="Segitiga ABC dan bayangannya A'B'C' setelah rotasi dan dilatasi" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 316px; height: auto" viewBox="0 0 316 250"><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="26.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="48.0" x2="48.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="70.0" x2="70.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="92.0" x2="92.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="114.0" x2="114.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="136.0" x2="136.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="158.0" x2="158.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="180.0" x2="180.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="202.0" x2="202.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="224.0" x2="224.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="246.0" x2="246.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="268.0" x2="268.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="290.0" x2="290.0" y1="224.0" y2="26.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="224.0" y2="224.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="202.0" y2="202.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="180.0" y2="180.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="158.0" y2="158.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="136.0" y2="136.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="114.0" y2="114.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="92.0" y2="92.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="70.0" y2="70.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="48.0" y2="48.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="26.0" x2="290.0" y1="26.0" y2="26.0"></line><line stroke="currentColor" stroke-width="1.6" x1="26.0" x2="298.0" y1="224.0" y2="224.0"></line><line stroke="currentColor" stroke-width="1.6" x1="180.0" x2="180.0" y1="224.0" y2="18.0"></line><polygon fill="currentColor" points="298.0,224.0 291.0,220.5 291.0,227.5"></polygon><polygon fill="currentColor" points="180.0,18.0 176.5,25.0 183.5,25.0"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="301.0" y="228.0"> x </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="187.0" y="20.0"> y </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="26.0" y="237.0"> -7 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="48.0" y="237.0"> -6 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="70.0" y="237.0"> -5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="92.0" y="237.0"> -4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="114.0" y="237.0"> -3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="136.0" y="237.0"> -2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="158.0" y="237.0"> -1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="202.0" y="237.0"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="224.0" y="237.0"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="246.0" y="237.0"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="268.0" y="237.0"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="290.0" y="237.0"> 5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="205.5"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="183.5"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="161.5"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="139.5"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="117.5"> 5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="95.5"> 6 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="73.5"> 7 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="51.5"> 8 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="175.0" y="29.5"> 9 </text><polygon fill="#0f172a" fill-opacity="0.18" points="202.0,202.0 268.0,202.0 202.0,158.0" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></polygon><polygon fill="#64748b" fill-opacity="0.12" points="136.0,180.0 136.0,48.0 48.0,180.0" stroke="#64748b" stroke-dasharray="6 4" stroke-linejoin="round" stroke-width="2.2"></polygon><circle cx="202.0" cy="202.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="193.0" y="216.0"> A </text><circle cx="268.0" cy="202.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="274.0" y="216.0"> B </text><circle cx="202.0" cy="158.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="208.0" y="154.0"> C </text><circle cx="136.0" cy="180.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="142.0" y="194.0"> A' </text><circle cx="136.0" cy="48.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="142.0" y="44.0"> B' </text><circle cx="48.0" cy="180.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="38.0" y="194.0"> C' </text></svg>`,
              promptAfter: h`<ol type="a">
<li>
Tentukan matriks \(R\), matriks \(D\), dan matriks komposisi \(M\) yang
memetakan \(ABC\) langsung ke bayangan akhirnya.
</li>
<li>Tentukan koordinat \(A'\), \(B'\), dan \(C'\).</li>
<li>
Hitung luas \(A'B'C'\) dengan dua cara: dari koordinat dan dari \(|\det
M|\).
</li>
<li>
Bayangan \(A'B'C'\) lalu dicerminkan terhadap sumbu-\(x\). Tentukan
matriks komposisi barunya. Apakah luas berubah? Apa arti tanda
determinan yang negatif?
</li>
</ol>`,
              explanation: h`<p>
<strong>(a)</strong>
\(\displaystyle R=\begin{bmatrix}0&amp;-1\\1&amp;0\end{bmatrix}\),
\(\displaystyle D=\begin{bmatrix}2&amp;0\\0&amp;2\end{bmatrix}\),
dan
\(\displaystyle M=DR=\begin{bmatrix}0&amp;-2\\2&amp;0\end{bmatrix}\)
(rotasi lebih dulu sehingga \(R\) berada di kanan).
</p>
<p>
<strong>(b)</strong>
\(\displaystyle A'=M\begin{bmatrix}1\\1\end{bmatrix}=(-2,2)\),
\(\displaystyle B'=M\begin{bmatrix}4\\1\end{bmatrix}=(-2,8)\),
\(\displaystyle C'=M\begin{bmatrix}1\\3\end{bmatrix}=(-6,2)\).
</p>
<p>
<strong>(c)</strong> Luas \(\displaystyle ABC=\frac12\cdot3\cdot2=3\). Dari koordinat:
alas \(A'B'=6\) (vertikal) dan tinggi \(4\) (jarak horizontal \(C'\) ke
garis \(x=-2\)), sehingga luas \(\displaystyle \frac12\cdot6\cdot4=12\). Dari
determinan: \(\det M=0\cdot0-(-2)(2)=4\) dan \(4\times3=12\). Keduanya
sama.
</p>
<p>
<strong>(d)</strong>
\(\displaystyle M_2=\begin{bmatrix}1&amp;0\\0&amp;-1\end{bmatrix}M=\begin{bmatrix}0&amp;-2\\-2&amp;0\end{bmatrix}\)
dengan \(\det M_2=-4\). Luas tetap \(|-4|\times3=12\). Tanda negatif
berarti orientasi bangun terbalik (urutan titik \(A,B,C\) berubah dari
berlawanan arah jarum jam menjadi searah), sedangkan besar luas
ditentukan oleh \(|\det|\).
</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>
Seorang petani mencampur tiga jenis pupuk. Kandungan tiap kilogram pupuk
(dalam gram) adalah: pupuk \(X\) mengandung N \(30\), P \(10\), K \(20\);
pupuk \(Y\) mengandung N \(10\), P \(20\), K \(10\); pupuk \(Z\)
mengandung N \(20\), P \(10\), K \(30\). Tanaman membutuhkan tepat N
\(280\) gram, P \(210\) gram, dan K \(290\) gram. Misalkan banyak pupuk
\(X\), \(Y\), dan \(Z\) (dalam kg) berturut-turut \(x\), \(y\), dan \(z\).
</p>
<ol type="a">
<li>
Susun sistem persamaan linear yang paling sederhana dan tuliskan dalam
bentuk \(AX=B\).
</li>
<li>
Hitung \(\det(A)\) dan jelaskan arti nilainya terhadap banyaknya solusi.
</li>
<li>
Tentukan \(x\), \(y\), dan \(z\) dengan operasi baris elementer pada
matriks augmented.
</li>
<li>
Harga pupuk \(X\), \(Y\), dan \(Z\) berturut-turut Rp12.000, Rp9.000,
dan Rp15.000 per kg. Hitung biaya total campuran tersebut dengan
perkalian matriks.
</li>
</ol>`,
              explanation: h`<p>
<strong>(a)</strong> \(3x+y+2z=28\); \(x+2y+z=21\); \(2x+y+3z=29\).
Bentuk \(AX=B\):
\(\displaystyle \begin{bmatrix}3&amp;1&amp;2\\1&amp;2&amp;1\\2&amp;1&amp;3\end{bmatrix}\begin{bmatrix}x\\y\\z\end{bmatrix}=\begin{bmatrix}28\\21\\29\end{bmatrix}\).
</p>
<p>
<strong>(b)</strong> \(\det A=3(6-1)-1(3-2)+2(1-4)=15-1-6=8\neq0\),
sehingga \(A\) punya invers dan sistem memiliki
<em>tepat satu</em> solusi.
</p>
<p>
<strong>(c)</strong> Dengan baris disusun ulang agar elemen pertama
\(R_1\) bernilai \(1\): \(R_2\to R_2-3R_1\) memberi \([0\ \,-5\
\,-1\,|\,-35]\) dan \(R_3\to R_3-2R_1\) memberi \([0\ \,-3\ \
1\,|\,-13]\). Dari \(R_3\): \(z=3y-13\). Substitusi ke \(R_2\):
\(-5y-(3y-13)=-35\Rightarrow y=6\), sehingga \(z=5\) dan
\(x=21-12-5=4\). Jadi \(x=4\) kg, \(y=6\) kg, \(z=5\) kg.
</p>
<p>
<strong>(d)</strong> Biaya
\(\displaystyle =\begin{bmatrix}4&amp;6&amp;5\end{bmatrix}\begin{bmatrix}12.000\\9.000\\15.000\end{bmatrix}=48.000+54.000+75.000=\)
<strong>Rp177.000</strong>.
</p>
<p class="penskoran">
<em>Penskoran: (a) 2 poin; (b) 2 poin; (c) 3 poin; (d) 1 poin.</em>
</p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "uraian-3",
              no: 3,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Diketahui \(\displaystyle A=\begin{bmatrix}2&amp;1\\1&amp;2\end{bmatrix}\).</p>
<ol type="a">
<li>Tunjukkan bahwa \(A^2-4A+3I=O\).</li>
<li>
Dari persamaan pada (a) saja (tanpa rumus invers \(2\times2\)), nyatakan
\(A^{-1}\) dalam \(A\) dan \(I\), lalu hitung \(A^{-1}\).
</li>
<li>Buktikan \(A^3=13A-12I\), lalu hitung \(A^3\).</li>
<li>
Tunjukkan bahwa \(A^n=\dfrac{3^n-1}{2}A-\dfrac{3^n-3}{2}I\) berlaku
untuk \(n=2\) dan \(n=3\), lalu gunakan rumus itu untuk menghitung
\(A^5\).
</li>
</ol>`,
              explanation: h`<p>
<strong>(a)</strong>
\(\displaystyle A^2=\begin{bmatrix}5&amp;4\\4&amp;5\end{bmatrix}\),
sehingga
\(\displaystyle A^2-4A+3I=\begin{bmatrix}5-8+3&amp;4-4\\4-4&amp;5-8+3\end{bmatrix}=O\).
</p>
<p>
<strong>(b)</strong> Dari (a): \(A^2-4A=-3I\Rightarrow
A(A-4I)=-3I\Rightarrow A\cdot\dfrac{4I-A}{3}=I\). Jadi
\(\displaystyle A^{-1}=\dfrac13(4I-A)=\dfrac13\begin{bmatrix}2&amp;-1\\-1&amp;2\end{bmatrix}=\begin{bmatrix}\frac23&amp;-\frac13\\-\frac13&amp;\frac23\end{bmatrix}\).
</p>
<p>
<strong>(c)</strong> \(A^2=4A-3I\), sehingga \(A^3=A\cdot
A^2=4A^2-3A=4(4A-3I)-3A=13A-12I\). Hasil:
\(\displaystyle \begin{bmatrix}26-12&amp;13\\13&amp;26-12\end{bmatrix}=\begin{bmatrix}14&amp;13\\13&amp;14\end{bmatrix}\)
(cocok dengan \(A\cdot A^2\) secara langsung).
</p>
<p>
<strong>(d)</strong> \(n=2\): \(\displaystyle \frac{9-1}2A-\frac{9-3}2I=4A-3I\) (sama
dengan (b)). \(n=3\): \(\displaystyle \frac{27-1}2A-\frac{27-3}2I=13A-12I\) (sama
dengan (c)). Untuk \(n=5\):
\(\displaystyle \frac{243-1}2A-\frac{243-3}2I=121A-120I=\begin{bmatrix}122&amp;121\\121&amp;122\end{bmatrix}\).
</p>
<p class="penskoran">
<em>Penskoran: (a) 1 poin; (b) 3 poin; (c) 2 poin; (d) 2 poin.</em>
</p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>
Dua vektor \(\displaystyle \vec u=\begin{bmatrix}4\\1\end{bmatrix}\) dan \(\displaystyle \vec
v=\begin{bmatrix}1\\3\end{bmatrix}\) membentuk jajargenjang \(OUWV\)
(lihat gambar). Matriks \(T\) memetakan persegi satuan menjadi
jajargenjang tersebut: \(\displaystyle \begin{bmatrix}1\\0\end{bmatrix}\mapsto\vec u\)
dan \(\displaystyle \begin{bmatrix}0\\1\end{bmatrix}\mapsto\vec v\).
</p>`,
              figure: h`<svg aria-label="Jajargenjang OUWV dengan U(4,1), V(1,3), dan titik P(5/2, 2)" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 296px; height: auto" viewBox="0 0 296 256"><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="28.0" y1="228.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="68.0" x2="68.0" y1="228.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="108.0" x2="108.0" y1="228.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="148.0" x2="148.0" y1="228.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="188.0" x2="188.0" y1="228.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="228.0" x2="228.0" y1="228.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="268.0" x2="268.0" y1="228.0" y2="28.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="268.0" y1="228.0" y2="228.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="268.0" y1="188.0" y2="188.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="268.0" y1="148.0" y2="148.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="268.0" y1="108.0" y2="108.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="268.0" y1="68.0" y2="68.0"></line><line stroke="currentColor" stroke-opacity=".13" x1="28.0" x2="268.0" y1="28.0" y2="28.0"></line><line stroke="currentColor" stroke-width="1.6" x1="28.0" x2="276.0" y1="228.0" y2="228.0"></line><line stroke="currentColor" stroke-width="1.6" x1="28.0" x2="28.0" y1="228.0" y2="20.0"></line><polygon fill="currentColor" points="276.0,228.0 269.0,224.5 269.0,231.5"></polygon><polygon fill="currentColor" points="28.0,20.0 24.5,27.0 31.5,27.0"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="279.0" y="232.0"> x </text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="35.0" y="22.0"> y </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="68.0" y="241.0"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="108.0" y="241.0"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="148.0" y="241.0"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="188.0" y="241.0"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="228.0" y="241.0"> 5 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="middle" x="268.0" y="241.0"> 6 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="23.0" y="191.5"> 1 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="23.0" y="151.5"> 2 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="23.0" y="111.5"> 3 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="23.0" y="71.5"> 4 </text><text fill="currentColor" fill-opacity=".7" font-size="9.5" text-anchor="end" x="23.0" y="31.5"> 5 </text><polygon fill="#0f172a" fill-opacity="0.14" points="28.0,228.0 188.0,188.0 228.0,68.0 68.0,108.0" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></polygon><line stroke="#64748b" stroke-width="2.4" x1="28.0" x2="188.0" y1="228.0" y2="188.0"></line><line stroke="#64748b" stroke-width="2.4" x1="28.0" x2="68.0" y1="228.0" y2="108.0"></line><circle cx="188.0" cy="188.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="194.0" y="202.0"> U(4,1) </text><circle cx="68.0" cy="108.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="62.0" y="102.0"> V(1,3) </text><circle cx="228.0" cy="68.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="234.0" y="63.0"> W </text><circle cx="128.0" cy="148.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="134.0" y="164.0"> P </text></svg>`,
              promptAfter: h`<ol type="a">
<li>Tentukan \(T\) dan luas jajargenjang \(OUWV\).</li>
<li>Tentukan \(T^{-1}\).</li>
<li>
Titik \(\displaystyle P\left(\frac52,2\right)\) dapat ditulis
\(\overrightarrow{OP}=s\vec u+t\vec v\). Tentukan \((s,t)\) dengan
\(T^{-1}\) dan jelaskan letak \(P\) pada jajargenjang.
</li>
<li>
Sebuah daerah \(F\) di dalam jajargenjang berluas \(3{,}3\) satuan luas.
Berapa luas daerah asalnya di dalam persegi satuan? Jelaskan.
</li>
</ol>`,
              explanation: h`<p>
<strong>(a)</strong>
\(\displaystyle T=\begin{bmatrix}4&amp;1\\1&amp;3\end{bmatrix}\)
dan luas \(=|\det T|=12-1=11\) satuan luas.
</p>
<p>
<strong>(b)</strong>
\(\displaystyle T^{-1}=\dfrac1{11}\begin{bmatrix}3&amp;-1\\-1&amp;4\end{bmatrix}\).
</p>
<p>
<strong>(c)</strong>
\(\displaystyle \begin{bmatrix}s\\t\end{bmatrix}=T^{-1}\begin{bmatrix}5/2\\2\end{bmatrix}=\dfrac1{11}\begin{bmatrix}15/2-2\\-5/2+8\end{bmatrix}=\begin{bmatrix}1/2\\1/2\end{bmatrix}\).
Karena \(\displaystyle s=t=\frac12\), \(\displaystyle P=\frac12(\vec u+\vec v)\) adalah titik tengah
diagonal \(OW\), yaitu pusat jajargenjang (titik potong kedua diagonal).
</p>
<p>
<strong>(d)</strong> \(T\) mengalikan luas dengan \(|\det T|=11\). Luas
daerah asal \(=\dfrac{3{,}3}{11}=0{,}3\) satuan luas, karena \(T^{-1}\)
memperkecil luas dengan faktor \(\displaystyle \frac1{11}\).
</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin.</em></p>`,
            },
          ],
        },
        {
          level: "hots",
          questions: [
            {
              id: "uraian-5",
              no: 5,
              type: "essay",
              level: "hots",
              prompt: h`<p>
Sandi Hill mengubah huruf menjadi angka (lihat tabel), lalu mengenkripsi
pasangan huruf dengan matriks kunci \(K\): pasangan
\(\displaystyle \begin{bmatrix}p_1\\p_2\end{bmatrix}\) menjadi
\(\displaystyle \begin{bmatrix}c_1\\c_2\end{bmatrix}\equiv
K\begin{bmatrix}p_1\\p_2\end{bmatrix}\pmod{26}\).
Notasi \(a\bmod 26\) berarti sisa pembagian \(a\) oleh \(26\) (misalnya
\(33\bmod26=7\)). Pada soal ini
\(\displaystyle K=\begin{bmatrix}3&amp;3\\2&amp;5\end{bmatrix}\). Untuk mendekripsi
dipakai \(K^{-1}\) yang memenuhi \(KK^{-1}\equiv I\pmod{26}\).
</p>
<table class="tabel-data tabel-sandi">
<tbody>
<tr>
<th>A</th>
<th>B</th>
<th>C</th>
<th>D</th>
<th>E</th>
<th>F</th>
<th>G</th>
<th>H</th>
<th>I</th>
<th>J</th>
<th>K</th>
<th>L</th>
<th>M</th>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>2</td>
<td>3</td>
<td>4</td>
<td>5</td>
<td>6</td>
<td>7</td>
<td>8</td>
<td>9</td>
<td>10</td>
<td>11</td>
<td>12</td>
</tr>
<tr>
<th>N</th>
<th>O</th>
<th>P</th>
<th>Q</th>
<th>R</th>
<th>S</th>
<th>T</th>
<th>U</th>
<th>V</th>
<th>W</th>
<th>X</th>
<th>Y</th>
<th>Z</th>
</tr>
<tr>
<td>13</td>
<td>14</td>
<td>15</td>
<td>16</td>
<td>17</td>
<td>18</td>
<td>19</td>
<td>20</td>
<td>21</td>
<td>22</td>
<td>23</td>
<td>24</td>
<td>25</td>
</tr>
</tbody>
</table>
<ol type="a">
<li>Enkripsikan kata <strong>HELP</strong>.</li>
<li>
Tunjukkan \(K\) dapat didekripsi: hitung \(\det(K)\), cari \(u\) dengan
\(9u\equiv1\pmod{26}\), lalu tentukan \(K^{-1}\) modulo \(26\) dengan
\(K^{-1}\equiv u\cdot\operatorname{adj}(K)\).
</li>
<li>Dekripsikan pesan <strong>LDXKBU</strong>.</li>
<li>
Kunci \(\displaystyle K'=\begin{bmatrix}4&amp;1\\2&amp;3\end{bmatrix}\) memiliki
\(\det(K')\neq0\), tetapi tidak dapat dipakai. Tunjukkan dua pasangan
huruf berbeda yang menghasilkan sandi sama, lalu simpulkan syarat
\(\det(K)\) agar kunci layak dipakai.
</li>
</ol>`,
              explanation: h`<p>
<strong>(a)</strong> H=7, E=4, L=11, P=15. Pasangan \((7,4)\):
\(\displaystyle K\begin{bmatrix}7\\4\end{bmatrix}=\begin{bmatrix}21+12\\14+20\end{bmatrix}=\begin{bmatrix}33\\34\end{bmatrix}\equiv\begin{bmatrix}7\\8\end{bmatrix}\),
yaitu <strong>HI</strong>. Pasangan \((11,15)\):
\(\displaystyle \begin{bmatrix}33+45\\22+75\end{bmatrix}=\begin{bmatrix}78\\97\end{bmatrix}\equiv\begin{bmatrix}0\\19\end{bmatrix}\),
yaitu <strong>AT</strong>. Jadi HELP \(\to\) <strong>HIAT</strong>.
</p>
<p>
<strong>(b)</strong> \(\det K=15-6=9\). Karena
\(9\cdot3=27\equiv1\pmod{26}\), \(u=3\).
\(\displaystyle \operatorname{adj}(K)=\begin{bmatrix}5&amp;-3\\-2&amp;3\end{bmatrix}\),
sehingga
\(\displaystyle K^{-1}\equiv3\begin{bmatrix}5&amp;-3\\-2&amp;3\end{bmatrix}=\begin{bmatrix}15&amp;-9\\-6&amp;9\end{bmatrix}\equiv\begin{bmatrix}15&amp;17\\20&amp;9\end{bmatrix}\pmod{26}\).
Verifikasi: \(\displaystyle K\cdot
K^{-1}=\begin{bmatrix}105&amp;78\\130&amp;79\end{bmatrix}\equiv\begin{bmatrix}1&amp;0\\0&amp;1\end{bmatrix}\).
</p>
<p>
<strong>(c)</strong> LD \(=(11,3)\):
\(\displaystyle \begin{bmatrix}15\cdot11+17\cdot3\\20\cdot11+9\cdot3\end{bmatrix}=\begin{bmatrix}216\\247\end{bmatrix}\equiv\begin{bmatrix}8\\13\end{bmatrix}\),
yaitu <strong>IN</strong>. XK \(=(23,10)\):
\(\displaystyle \begin{bmatrix}515\\550\end{bmatrix}\equiv\begin{bmatrix}21\\4\end{bmatrix}\),
yaitu <strong>VE</strong>. BU \(=(1,20)\):
\(\displaystyle \begin{bmatrix}355\\200\end{bmatrix}\equiv\begin{bmatrix}17\\18\end{bmatrix}\),
yaitu <strong>RS</strong>. Pesan: <strong>INVERS</strong>.
</p>
<p>
<strong>(d)</strong> \(\det K'=12-2=10\). Pasangan
<strong>AA</strong> \((0,0)\) dan <strong>NA</strong> \((13,0)\):
\(\displaystyle K'\begin{bmatrix}13\\0\end{bmatrix}=\begin{bmatrix}52\\26\end{bmatrix}\equiv\begin{bmatrix}0\\0\end{bmatrix}\),
sehingga keduanya menghasilkan sandi <strong>AA</strong> dan pesan tidak
dapat didekripsi secara tunggal. Penyebabnya \(\gcd(10,26)=2\neq1\),
sehingga \(10\) tidak punya invers modulo \(26\). Syarat kunci layak:
\(\gcd(\det K,26)=1\), yaitu \(\det K\) bukan kelipatan \(2\) dan bukan
kelipatan \(13\).
</p>
<p class="penskoran">
<em>Penskoran: (a) 2 poin; (b) 2 poin; (c) 2 poin; (d) 2 poin (contoh 1,
kesimpulan syarat 1).</em>
</p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default matriks;