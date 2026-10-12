import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Prediksi TKA Matematika 2027 (SMA/MA).
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const prediksiTka2027: Material = {
  slug: "prediksi-tka-2027",
  title: "Latihan Soal TKA SMA",
  topic: "Latihan Soal TKA SMA",
  description:
    "Simulasi 25 soal selama 75 menit: bilangan, aljabar, geometri dan pengukuran, trigonometri, serta data dan peluang, dengan tingkat sedang, sulit, dan HOTS.",
  durationMinutes: 75,
  notes: [
    h`Soal ini <strong>prediksi</strong> dan bukan naskah resmi. Bentuk dan beban soal mengikuti kerangka asesmen TKA SMA/MA (Peraturan Kepala BSKAP Nomor 045/H/AN/2025) dan pola TKA 2026: 25 soal Matematika dalam 75 menit (rata-rata 3 menit per soal), dengan pilihan ganda sederhana (satu jawaban benar), pilihan ganda kompleks kategori berbentuk tabel pernyataan benar atau salah (soal 5, 9, 15, dan 19), serta isian singkat (soal 22 sampai 25). Stimulus berupa gambar, grafik, diagram, dan tabel dipakai pada banyak soal.`,
    h`Cakupan materi: bilangan (real, berpangkat, pecahan); aljabar (persamaan, pertidaksamaan, fungsi, barisan, deret); geometri dan pengukuran; trigonometri; serta data dan peluang. Kompetensi yang diukur: pengetahuan, representasi, penalaran, koneksi matematis, dan pemecahan masalah. Komposisi tingkat kesulitan: 11 soal sedang, 12 soal sulit, dan 2 soal HOTS (soal 24 dan 25).`,
    h`Skor: setiap soal bernilai 4 poin (25 soal \(\times\) 4 poin = 100 poin). Pada soal berbentuk tabel pernyataan, skor diberikan jika <strong>semua baris</strong> dijawab benar. Tidak ada pengurangan skor untuk jawaban salah, jadi jangan ada soal yang dikosongkan.`,
    "Kalkulator tidak diperkenankan. Gambar tidak selalu digambar sesuai skala. Pada isian singkat, tuliskan hanya jawaban akhir (pecahan seperti 3/7 atau desimal; akar dapat ditulis sqrt atau √).",
    h`<details><summary>Kisi-kisi soal</summary>
<table class="tabel-data">
<thead>
<tr><th>No.</th><th>Cakupan materi</th><th>Kompetensi</th><th>Bentuk</th><th>Level</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Bilangan (berpangkat)</td><td>Pengetahuan</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>2</td><td>Bilangan (bentuk akar)</td><td>Pengetahuan</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>3</td><td>Aljabar (persamaan kuadrat)</td><td>Penalaran</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>4</td><td>Aljabar (pertidaksamaan)</td><td>Pemecahan masalah</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>5</td><td>Aljabar (fungsi, invers, komposisi)</td><td>Pengetahuan</td><td>PG kompleks kategori</td><td>Sedang</td></tr>
<tr><td>6</td><td>Aljabar (fungsi kuadrat)</td><td>Representasi</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>7</td><td>Aljabar (barisan aritmetika)</td><td>Pemecahan masalah</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>8</td><td>Data (rata-rata, diagram batang)</td><td>Representasi</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>9</td><td>Geometri (dimensi tiga)</td><td>Representasi</td><td>PG kompleks kategori</td><td>Sedang</td></tr>
<tr><td>10</td><td>Trigonometri (persamaan)</td><td>Pengetahuan</td><td>PG sederhana</td><td>Sedang</td></tr>
<tr><td>11</td><td>Aljabar (deret geometri tak hingga)</td><td>Penalaran</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>12</td><td>Aljabar (pertidaksamaan eksponen)</td><td>Koneksi matematis</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>13</td><td>Geometri (lingkaran, garis singgung)</td><td>Pemecahan masalah</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>14</td><td>Trigonometri (luas segitiga, garis bagi)</td><td>Koneksi matematis</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>15</td><td>Bilangan (real, rasional dan irasional)</td><td>Penalaran</td><td>PG kompleks kategori</td><td>Sulit</td></tr>
<tr><td>16</td><td>Peluang (peluang bersyarat)</td><td>Penalaran</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>17</td><td>Aljabar (fungsi kuadrat, optimasi)</td><td>Pemecahan masalah</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>18</td><td>Geometri (jarak titik ke bidang)</td><td>Representasi</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>19</td><td>Data dan peluang (tabel kontingensi)</td><td>Representasi</td><td>PG kompleks kategori</td><td>Sulit</td></tr>
<tr><td>20</td><td>Trigonometri (identitas)</td><td>Koneksi matematis</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>21</td><td>Trigonometri (model fungsi sinusoidal)</td><td>Representasi</td><td>PG sederhana</td><td>Sulit</td></tr>
<tr><td>22</td><td>Bilangan (pecahan, laju kerja)</td><td>Pemecahan masalah</td><td>Isian singkat</td><td>Sedang</td></tr>
<tr><td>23</td><td>Data (mean, median, modus, jangkauan)</td><td>Penalaran</td><td>Isian singkat</td><td>Sulit</td></tr>
<tr><td>24</td><td>Data dan peluang + deret geometri tak hingga</td><td>Koneksi matematis</td><td>Isian singkat</td><td>HOTS</td></tr>
<tr><td>25</td><td>Geometri + aljabar (luas, Pythagoras)</td><td>Penalaran</td><td>Isian singkat</td><td>HOTS</td></tr>
</tbody>
</table>
</details>`,
  ],
  sections: [
    {
      id: "pg",
      letter: "A",
      title: "Pilihan Ganda dan Pilihan Ganda Kompleks Kategori",
      instruction: h`21 soal \(\times\) 4 poin = 84 poin. Pilih jawaban yang paling tepat; pada soal tabel pernyataan, tandai Benar atau Salah untuk setiap baris.`,
      pointsEach: 4,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "pg-1",
              no: 1,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Untuk setiap bilangan bulat \(n\), nilai dari \(\dfrac{2^{n+3}-2^{n+1}}{2^{n+2}+2^{n}}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\displaystyle \frac12\)` },
                { key: "B", text: h`\(\displaystyle \frac35\)` },
                { key: "C", text: h`\(\displaystyle \frac45\)` },
                { key: "D", text: h`\(1\)` },
                { key: "E", text: h`\(\displaystyle \frac65\)` },
              ],
              answer: "E",
              explanation: h`<p>Keluarkan faktor persekutuan \(2^n\) pada pembilang dan penyebut:</p>
<div class="math-display">\[ \frac{2^{n}(2^3-2^1)}{2^{n}(2^2+2^0)}=\frac{8-2}{4+1}=\frac65 \]</div>
<p>Jebakan: menganggap \(2^{n+3}-2^{n+1}=2^{2}\) (pangkat dikurangkan) memberi \(\dfrac45\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Diketahui \(x=\dfrac{2}{\sqrt7-\sqrt3}\) dan \(y=\dfrac{2}{\sqrt7+\sqrt3}\). Nilai \(x^2+y^2\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(5\)` },
                { key: "B", text: h`\(7\)` },
                { key: "C", text: h`\(9\)` },
                { key: "D", text: h`\(10\)` },
                { key: "E", text: h`\(20\)` },
              ],
              answer: "A",
              explanation: h`<p>Jumlah dan hasil kali dapat dicari tanpa menghitung \(x\) dan \(y\) satu per satu:</p>
<div class="math-display">\[ x+y=\frac{2(\sqrt7+\sqrt3)+2(\sqrt7-\sqrt3)}{7-3}=\sqrt7,\qquad xy=\frac{4}{7-3}=1 \]</div>
<p>Maka \(x^2+y^2=(x+y)^2-2xy=7-2=5\).</p>
<p>Jebakan: lupa suku \(-2xy\) memberi \(7\); memakai \(+2xy\) memberi \(9\); lupa membagi \(4\) saat merasionalkan penyebut memberi \(20\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Persamaan kuadrat \(x^2-kx+(k+2)=0\) mempunyai dua akar real \(x_1\) dan \(x_2\) dengan \(x_1^2+x_2^2=4\). Nilai \(k\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-4\)` },
                { key: "B", text: h`\(-2\)` },
                { key: "C", text: h`\(2\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(8\)` },
              ],
              answer: "B",
              explanation: h`<p>Dari rumus jumlah dan hasil kali akar: \(x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2=k^2-2(k+2)\). Maka</p>
<div class="math-display">\[ k^2-2k-4=4\ \Rightarrow\ k^2-2k-8=0\ \Rightarrow\ (k-4)(k+2)=0 \]</div>
<p>Syarat akar real: \(D=k^2-4(k+2)\ge0\). Untuk \(k=4\): \(D=16-24=-8&lt;0\) (tidak memenuhi). Untuk \(k=-2\): \(D=4+8-8=4\ge0\) (memenuhi; persamaannya \(x^2+2x=0\) dengan akar \(0\) dan \(-2\)).</p>
<p>Jebakan: \(k=4\) ikut dipilih karena syarat diskriminan tidak diperiksa; \(-4\) dan \(2\) muncul bila tanda \(k\) tertukar.</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Banyak bilangan bulat \(x\) dengan \(|x|&lt;6\) yang memenuhi \(\dfrac{2x-3}{x+1}\ge1\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(5\)` },
                { key: "D", text: h`\(6\)` },
                { key: "E", text: h`\(7\)` },
              ],
              answer: "D",
              explanation: h`<p>Pindahkan ruas dan samakan penyebut (jangan mengalikan silang karena tanda \(x+1\) belum diketahui):</p>
<div class="math-display">\[ \frac{2x-3}{x+1}-1=\frac{x-4}{x+1}\ge0\ \Rightarrow\ x&lt;-1\ \text{atau}\ x\ge4 \]</div>
<p>Dengan \(|x|&lt;6\), yaitu \(-5\le x\le5\): bilangan bulatnya \(-5,-4,-3,-2\) dan \(4,5\), sehingga ada \(6\).</p>
<p>Jebakan: memasukkan \(x=-1\) (penyebut nol) memberi \(7\); memakai \(x&gt;4\) memberi \(5\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "tf",
              level: "sedang",
              prompt: h`<p>Diketahui fungsi \(f(x)=\dfrac{2x+1}{x-3}\) dengan \(x\neq3\). Tentukan nilai kebenaran setiap pernyataan berikut dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              statements: [
                h`\(f^{-1}(x)=\dfrac{3x-1}{x+2}\).`,
                h`Daerah hasil \(f\) adalah \(\{y\in\mathbb R\mid y\neq2\}\).`,
                h`\(f\big(f(4)\big)=\dfrac{19}{6}\).`,
                h`Grafik \(f\) memotong sumbu \(y\) di titik \((0,3)\).`,
              ],
              answer: ["S", "B", "B", "S"],
              explanation: h`<p><strong>(1) Salah.</strong> Dari \(y=\dfrac{2x+1}{x-3}\): \(yx-3y=2x+1\Rightarrow x(y-2)=3y+1\Rightarrow x=\dfrac{3y+1}{y-2}\). Jadi \(f^{-1}(x)=\dfrac{3x+1}{x-2}\), bukan \(\dfrac{3x-1}{x+2}\).</p>
<p><strong>(2) Benar.</strong> Daerah hasil \(f\) sama dengan daerah asal \(f^{-1}\), yaitu semua real kecuali \(x=2\) (asimtot datar \(y=2\)).</p>
<p><strong>(3) Benar.</strong> \(f(4)=\dfrac{9}{1}=9\) dan \(f(9)=\dfrac{19}{6}\).</p>
<p><strong>(4) Salah.</strong> \(f(0)=\dfrac{1}{-3}=-\dfrac13\), sehingga titik potong dengan sumbu \(y\) adalah \(\left(0,-\dfrac13\right)\).</p>
<p>Jadi, kuncinya adalah <strong>Salah, Benar, Benar, Salah</strong>.</p>`,
            },
            {
              id: "pg-6",
              no: 6,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Gambar menunjukkan grafik fungsi kuadrat \(f\). Titik puncak grafik dan titik potongnya dengan sumbu \(y\) ditandai pada gambar. Banyak bilangan bulat \(x\) yang memenuhi \(f(x)\le8\) adalah ....</p>`,
              figure: h`<svg aria-label="Grafik fungsi kuadrat f dengan titik puncak (2, -1) dan memotong sumbu y di titik (0, 3)" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 290px; height: auto" viewBox="0 0 280 250"><line stroke="currentColor" stroke-width="1.6" x1="33.9" x2="267.6" y1="190.0" y2="190.0"></line><line stroke="currentColor" stroke-width="1.6" x1="70.0" x2="70.0" y1="234.8" y2="8.0"></line><polygon fill="currentColor" points="267.6,190.0 260.6,193.5 260.6,186.5"></polygon><polygon fill="currentColor" points="70.0,8.0 73.5,15.0 66.5,15.0"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="270.6" y="194.0">x</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="77.0" y="10.0">y</text><line stroke="currentColor" stroke-width="1" stroke-dasharray="5 4" stroke-opacity="0.5" x1="146.0" x2="146.0" y1="190.0" y2="218.0"></line><line stroke="currentColor" stroke-width="1" x1="70.0" x2="70.0" y1="106.0" y2="106.0"></line><path d="M45.5,22.0 L48.8,34.8 L52.2,47.3 L55.5,59.2 L58.9,70.8 L62.2,81.9 L65.6,92.6 L68.9,102.8 L72.3,112.6 L75.6,122.0 L79.0,130.9 L82.3,139.4 L85.7,147.4 L89.0,155.1 L92.4,162.2 L95.7,169.0 L99.1,175.3 L102.4,181.2 L105.8,186.6 L109.1,191.6 L112.5,196.2 L115.8,200.4 L119.2,204.1 L122.5,207.3 L125.9,210.2 L129.2,212.6 L132.6,214.5 L135.9,216.0 L139.3,217.1 L142.6,217.8 L146.0,218.0 L149.4,217.8 L152.7,217.1 L156.1,216.0 L159.4,214.5 L162.8,212.6 L166.1,210.2 L169.5,207.3 L172.8,204.1 L176.2,200.4 L179.5,196.2 L182.9,191.6 L186.2,186.6 L189.6,181.2 L192.9,175.3 L196.3,169.0 L199.6,162.2 L203.0,155.1 L206.3,147.4 L209.7,139.4 L213.0,130.9 L216.4,122.0 L219.7,112.6 L223.1,102.8 L226.4,92.6 L229.8,81.9 L233.1,70.8 L236.5,59.2 L239.8,47.3 L243.2,34.8 L246.5,22.0" fill="none" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></path><circle cx="146.0" cy="218.0" fill="#0f172a" r="3.4"></circle><text fill="currentColor" font-size="11" font-style="italic" text-anchor="start" x="154.0" y="234.0">(2, −1)</text><circle cx="70.0" cy="106.0" fill="#0f172a" r="3.4"></circle><text fill="currentColor" font-size="11" font-style="italic" text-anchor="end" x="62.0" y="100.0">(0, 3)</text><line stroke="currentColor" stroke-width="1" x1="108.0" x2="108.0" y1="187.0" y2="193.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="108.0" y="205.0">1</text><line stroke="currentColor" stroke-width="1" x1="146.0" x2="146.0" y1="187.0" y2="193.0"></line><line stroke="currentColor" stroke-width="1" x1="184.0" x2="184.0" y1="187.0" y2="193.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="184.0" y="205.0">3</text><line stroke="currentColor" stroke-width="1" x1="222.0" x2="222.0" y1="187.0" y2="193.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="222.0" y="205.0">4</text><line stroke="currentColor" stroke-width="1" x1="260.0" x2="260.0" y1="187.0" y2="193.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="260.0" y="205.0">5</text><text fill="currentColor" font-size="11" text-anchor="middle" x="146.0" y="183.0">2</text><text fill="currentColor" font-size="11" font-style="italic" text-anchor="end" x="63.0" y="204.0">O</text></svg>`,
              options: [
                { key: "A", text: h`\(3\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(5\)` },
                { key: "D", text: h`\(6\)` },
                { key: "E", text: h`\(7\)` },
              ],
              answer: "E",
              explanation: h`<p>Dari gambar, puncaknya \((2,-1)\) sehingga \(f(x)=a(x-2)^2-1\). Titik \((0,3)\) memberi \(4a-1=3\Rightarrow a=1\), jadi \(f(x)=x^2-4x+3\).</p>
<p>\(f(x)\le8\Rightarrow x^2-4x-5\le0\Rightarrow(x-5)(x+1)\le0\Rightarrow-1\le x\le5\). Bilangan bulatnya \(-1,0,1,\dots,5\), yaitu \(7\) bilangan.</p>
<p>Jebakan: memakai \(f(x)&lt;8\) memberi \(5\); membuang satu ujung memberi \(6\); \(f(x)\le0\) hanya memberi \(3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Pada suatu barisan aritmetika, suku ke-3 adalah \(11\) dan suku ke-8 adalah \(26\). Jumlah suku ke-6 sampai suku ke-10 adalah ....</p>`,
              options: [
                { key: "A", text: h`\(130\)` },
                { key: "B", text: h`\(145\)` },
                { key: "C", text: h`\(160\)` },
                { key: "D", text: h`\(175\)` },
                { key: "E", text: h`\(185\)` },
              ],
              answer: "A",
              explanation: h`<p>Beda \(b=\dfrac{26-11}{8-3}=3\), sehingga \(U_6=26-2\cdot3=20\) dan \(U_{10}=26+2\cdot3=32\).</p>
<p>Jumlah lima suku berurutan \(=\dfrac52(U_6+U_{10})=\dfrac52(20+32)=130\). Cara cepat: lima suku itu berpusat di \(U_8\), jadi jumlahnya \(5U_8=130\).</p>
<p>Jebakan: \(a=5\) sehingga \(S_{10}=185\) adalah jumlah <em>sepuluh</em> suku pertama; \(5U_{10}=160\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Diagram batang berikut menunjukkan sebaran nilai ulangan matematika sekelompok siswa. Banyak siswa yang nilainya di atas rata-rata adalah ....</p>`,
              figure: h`<svg aria-label="Diagram batang nilai ulangan: nilai 5 sebanyak 4 siswa, nilai 6 sebanyak 7, nilai 7 sebanyak 10, nilai 8 sebanyak 6, nilai 9 sebanyak 3" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 330px; height: auto" viewBox="0 0 320 210"><line stroke="currentColor" stroke-width="1" stroke-opacity="0.15" x1="46.0" x2="291.0" y1="170.0" y2="170.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="174.0">0</text><line stroke="currentColor" stroke-width="1" stroke-opacity="0.15" x1="46.0" x2="291.0" y1="144.0" y2="144.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="148.0">2</text><line stroke="currentColor" stroke-width="1" stroke-opacity="0.15" x1="46.0" x2="291.0" y1="118.0" y2="118.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="122.0">4</text><line stroke="currentColor" stroke-width="1" stroke-opacity="0.15" x1="46.0" x2="291.0" y1="92.0" y2="92.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="96.0">6</text><line stroke="currentColor" stroke-width="1" stroke-opacity="0.15" x1="46.0" x2="291.0" y1="66.0" y2="66.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="70.0">8</text><line stroke="currentColor" stroke-width="1" stroke-opacity="0.15" x1="46.0" x2="291.0" y1="40.0" y2="40.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="44.0">10</text><line stroke="currentColor" stroke-width="1.6" x1="46.0" x2="296.0" y1="170.0" y2="170.0"></line><line stroke="currentColor" stroke-width="1.6" x1="46.0" x2="46.0" y1="170.0" y2="27.0"></line><rect fill="#64748b" fill-opacity="0.55" height="52.0" stroke="#0f172a" stroke-width="1.4" width="34" x="60.0" y="118.0"></rect><text fill="currentColor" font-size="11" text-anchor="middle" x="77.0" y="113.0">4</text><text fill="currentColor" font-size="11" text-anchor="middle" x="77.0" y="185.0">5</text><rect fill="#64748b" fill-opacity="0.55" height="91.0" stroke="#0f172a" stroke-width="1.4" width="34" x="106.0" y="79.0"></rect><text fill="currentColor" font-size="11" text-anchor="middle" x="123.0" y="74.0">7</text><text fill="currentColor" font-size="11" text-anchor="middle" x="123.0" y="185.0">6</text><rect fill="#64748b" fill-opacity="0.55" height="130.0" stroke="#0f172a" stroke-width="1.4" width="34" x="152.0" y="40.0"></rect><text fill="currentColor" font-size="11" text-anchor="middle" x="169.0" y="35.0">10</text><text fill="currentColor" font-size="11" text-anchor="middle" x="169.0" y="185.0">7</text><rect fill="#64748b" fill-opacity="0.55" height="78.0" stroke="#0f172a" stroke-width="1.4" width="34" x="198.0" y="92.0"></rect><text fill="currentColor" font-size="11" text-anchor="middle" x="215.0" y="87.0">6</text><text fill="currentColor" font-size="11" text-anchor="middle" x="215.0" y="185.0">8</text><rect fill="#64748b" fill-opacity="0.55" height="39.0" stroke="#0f172a" stroke-width="1.4" width="34" x="244.0" y="131.0"></rect><text fill="currentColor" font-size="11" text-anchor="middle" x="261.0" y="126.0">3</text><text fill="currentColor" font-size="11" text-anchor="middle" x="261.0" y="185.0">9</text><text fill="currentColor" font-size="11" font-style="italic" text-anchor="end" x="296.0" y="200.0">Nilai</text><text fill="currentColor" font-size="11" font-style="italic" text-anchor="start" x="16.0" y="29.0">Banyak siswa</text></svg>`,
              options: [
                { key: "A", text: h`\(9\)` },
                { key: "B", text: h`\(13\)` },
                { key: "C", text: h`\(16\)` },
                { key: "D", text: h`\(19\)` },
                { key: "E", text: h`\(26\)` },
              ],
              answer: "D",
              explanation: h`<p>Frekuensi nilai \(5,6,7,8,9\) berturut-turut \(4,7,10,6,3\), sehingga banyak siswa \(=30\).</p>
<div class="math-display">\[ \bar x=\frac{5\cdot4+6\cdot7+7\cdot10+8\cdot6+9\cdot3}{30}=\frac{207}{30}=6{,}9 \]</div>
<p>Nilai yang lebih dari \(6{,}9\) adalah \(7,8,9\): \(10+6+3=19\) siswa.</p>
<p>Jebakan: membulatkan rata-rata menjadi \(7\) lalu menghitung nilai \(&gt;7\) memberi \(9\); menghitung nilai \(\ge6\) memberi \(26\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "tf",
              level: "sedang",
              prompt: h`<p>Perhatikan kubus \(ABCD.EFGH\) dengan panjang rusuk \(6\) cm. Titik \(P\) adalah titik tengah rusuk \(EF\). Tentukan nilai kebenaran setiap pernyataan berikut dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              figure: h`<svg aria-label="Kubus ABCD.EFGH dengan rusuk 6 cm, titik P di tengah rusuk EF, serta ruas garis AP dan diagonal ruang AG" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 260px; height: auto" viewBox="0 0 250 205"><line stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" stroke-opacity="0.55" x1="40.0" x2="94.0" y1="172.0" y2="138.0"></line><line stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" stroke-opacity="0.55" x1="94.0" x2="206.0" y1="138.0" y2="138.0"></line><line stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" stroke-opacity="0.55" x1="94.0" x2="94.0" y1="138.0" y2="26.0"></line><line stroke="#0f172a" stroke-width="2" x1="40.0" x2="152.0" y1="172.0" y2="172.0"></line><line stroke="#0f172a" stroke-width="2" x1="152.0" x2="206.0" y1="172.0" y2="138.0"></line><line stroke="#0f172a" stroke-width="2" x1="40.0" x2="40.0" y1="172.0" y2="60.0"></line><line stroke="#0f172a" stroke-width="2" x1="152.0" x2="152.0" y1="172.0" y2="60.0"></line><line stroke="#0f172a" stroke-width="2" x1="206.0" x2="206.0" y1="138.0" y2="26.0"></line><line stroke="#0f172a" stroke-width="2" x1="40.0" x2="152.0" y1="60.0" y2="60.0"></line><line stroke="#0f172a" stroke-width="2" x1="152.0" x2="206.0" y1="60.0" y2="26.0"></line><line stroke="#0f172a" stroke-width="2" x1="206.0" x2="94.0" y1="26.0" y2="26.0"></line><line stroke="#0f172a" stroke-width="2" x1="40.0" x2="94.0" y1="60.0" y2="26.0"></line><line stroke="#64748b" stroke-width="1.6" stroke-dasharray="6 4" x1="40.0" x2="206.0" y1="172.0" y2="26.0"></line><line stroke="#64748b" stroke-width="1.6" x1="40.0" x2="96.0" y1="172.0" y2="60.0"></line><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="31.0" y="184.0">A</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="161.0" y="185.0">B</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="216.0" y="144.0">C</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="84.0" y="140.0">D</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="30.0" y="58.0">E</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="160.0" y="72.0">F</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="216.0" y="23.0">G</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="85.0" y="22.0">H</text><circle cx="96.0" cy="60.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="96.0" y="77.0">P</text><text fill="currentColor" font-size="11" text-anchor="middle" x="96.0" y="196.0">6 cm</text></svg>`,
              statements: [
                h`Panjang diagonal ruang \(AG\) adalah \(6\sqrt3\) cm.`,
                h`Jarak titik \(P\) ke garis \(CG\) adalah \(6\) cm.`,
                h`Panjang \(AP\) adalah \(3\sqrt5\) cm.`,
                h`Kosinus sudut antara garis \(AG\) dan bidang \(ABCD\) adalah \(\dfrac{\sqrt3}{3}\).`,
              ],
              answer: ["B", "S", "B", "S"],
              explanation: h`<p>Pasang koordinat \(A(0,0,0)\), \(B(6,0,0)\), \(C(6,6,0)\), \(D(0,6,0)\), \(E(0,0,6)\), \(G(6,6,6)\), sehingga \(P(3,0,6)\).</p>
<p><strong>(1) Benar.</strong> \(AG=\sqrt{6^2+6^2+6^2}=6\sqrt3\).</p>
<p><strong>(2) Salah.</strong> Garis \(CG\) tegak pada \(x=6,\ y=6\). Jarak \(P\) ke garis itu \(=\sqrt{(6-3)^2+(6-0)^2}=\sqrt{45}=3\sqrt5\), bukan \(6\).</p>
<p><strong>(3) Benar.</strong> \(AP=\sqrt{3^2+0^2+6^2}=\sqrt{45}=3\sqrt5\).</p>
<p><strong>(4) Salah.</strong> Proyeksi \(AG\) pada alas adalah \(AC=6\sqrt2\), sehingga kosinus sudutnya \(\dfrac{6\sqrt2}{6\sqrt3}=\dfrac{\sqrt6}{3}\). Nilai \(\dfrac{\sqrt3}{3}\) adalah <em>sinus</em> sudut itu (\(\dfrac{CG}{AG}\)).</p>
<p>Jadi, kuncinya adalah <strong>Benar, Salah, Benar, Salah</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Jumlah semua penyelesaian persamaan \(2\sin^2x-\sin x-1=0\) untuk \(0^\circ\le x\le360^\circ\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(270^\circ\)` },
                { key: "B", text: h`\(540^\circ\)` },
                { key: "C", text: h`\(630^\circ\)` },
                { key: "D", text: h`\(720^\circ\)` },
                { key: "E", text: h`\(810^\circ\)` },
              ],
              answer: "C",
              explanation: h`<p>Faktorkan: \(2\sin^2x-\sin x-1=(2\sin x+1)(\sin x-1)=0\).</p>
<p>\(\sin x=1\Rightarrow x=90^\circ\). \(\sin x=-\dfrac12\Rightarrow x=210^\circ\) atau \(x=330^\circ\). Jumlahnya \(90^\circ+210^\circ+330^\circ=630^\circ\).</p>
<p>Jebakan: memakai \(\sin x=\dfrac12\) memberi \(270^\circ\); hanya menjumlahkan \(210^\circ+330^\circ\) memberi \(540^\circ\); memakai \(\sin x=-1\) (yaitu \(270^\circ\)) memberi \(810^\circ\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          note: "Butuh beberapa langkah penalaran",
          questions: [
            {
              id: "pg-11",
              no: 11,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Suatu deret geometri tak hingga mempunyai jumlah \(16\) dan suku kedua \(3\). Jumlah semua nilai suku pertama yang mungkin adalah ....</p>`,
              options: [
                { key: "A", text: h`\(4\)` },
                { key: "B", text: h`\(12\)` },
                { key: "C", text: h`\(16\)` },
                { key: "D", text: h`\(24\)` },
                { key: "E", text: h`\(48\)` },
              ],
              answer: "C",
              explanation: h`<p>Dari \(U_2=ar=3\) diperoleh \(a=\dfrac3r\). Jumlah tak hingga \(\dfrac{a}{1-r}=16\) memberi</p>
<div class="math-display">\[ \frac{3}{r(1-r)}=16\ \Rightarrow\ 16r^2-16r+3=0\ \Rightarrow\ (4r-1)(4r-3)=0 \]</div>
<p>Jadi \(r=\dfrac14\) atau \(r=\dfrac34\); keduanya memenuhi \(|r|&lt;1\) sehingga deretnya konvergen. Suku pertamanya \(a=12\) atau \(a=4\), dan jumlahnya \(12+4=16\).</p>
<p>Jebakan: hanya memakai satu akar memberi \(12\) atau \(4\); hasil kali kedua nilai \(a\) adalah \(48\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Jumlah semua bilangan bulat \(x\) yang memenuhi \(2^{2x+1}-9\cdot2^{x}+4\le0\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(5\)` },
              ],
              answer: "B",
              explanation: h`<p>Misalkan \(t=2^x&gt;0\). Pertidaksamaan menjadi \(2t^2-9t+4\le0\Rightarrow(2t-1)(t-4)\le0\Rightarrow\dfrac12\le t\le4\).</p>
<p>Maka \(2^{-1}\le2^x\le2^2\Rightarrow-1\le x\le2\). Bilangan bulatnya \(-1,0,1,2\) dengan jumlah \(2\).</p>
<p>Jebakan: \(4\) adalah <em>banyaknya</em> bilangan bulat; tanda sama dengan dibuang memberi \(0+1=1\); lupa \(x=-1\) memberi \(3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Dua lingkaran berjari-jari \(9\) cm dan \(4\) cm bersinggungan luar dan keduanya menyinggung garis \(\ell\). Lingkaran ketiga dengan jari-jari \(r\) menyinggung garis \(\ell\) serta menyinggung kedua lingkaran tersebut dari luar (lihat gambar). Nilai \(r\) adalah .... cm.</p>`,
              figure: h`<svg aria-label="Dua lingkaran berjari-jari 9 cm dan 4 cm bersinggungan luar dan menyinggung garis l, serta lingkaran kecil berjari-jari r di antara keduanya" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 290px; height: auto" viewBox="0 0 270 214"><rect fill="currentColor" fill-opacity="0.05" height="20" width="262" x="4" y="190"></rect><line stroke="#0f172a" stroke-width="2" x1="4.0" x2="266.0" y1="190.0" y2="190.0"></line><circle cx="95.0" cy="104.5" fill="#94a3b8" fill-opacity="0.2" r="85.5" stroke="#0f172a" stroke-width="2"></circle><circle cx="209.0" cy="152.0" fill="#94a3b8" fill-opacity="0.2" r="38.0" stroke="#0f172a" stroke-width="2"></circle><circle cx="163.4" cy="176.3" fill="#475569" fill-opacity="0.2" r="13.7" stroke="#0f172a" stroke-width="2"></circle><line stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" stroke-opacity="0.7" x1="95.0" x2="95.0" y1="104.5" y2="190.0"></line><circle cx="95.0" cy="104.5" fill="currentColor" r="2.4"></circle><text fill="currentColor" font-size="11" text-anchor="end" x="90.0" y="151.2">9 cm</text><line stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" stroke-opacity="0.7" x1="209.0" x2="209.0" y1="152.0" y2="190.0"></line><circle cx="209.0" cy="152.0" fill="currentColor" r="2.4"></circle><text fill="currentColor" font-size="11" text-anchor="start" x="215.0" y="175.0">4 cm</text><line stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" stroke-opacity="0.7" x1="163.4" x2="163.4" y1="176.3" y2="190.0"></line><circle cx="163.4" cy="176.3" fill="currentColor" r="2.4"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="163.4" y="156.6">r</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="260.0" y="206.0">ℓ</text></svg>`,
              options: [
                { key: "A", text: h`\(\displaystyle \frac65\)` },
                { key: "B", text: h`\(\displaystyle \frac{36}{25}\)` },
                { key: "C", text: h`\(\displaystyle \frac32\)` },
                { key: "D", text: h`\(2\)` },
                { key: "E", text: h`\(\displaystyle \frac{36}{13}\)` },
              ],
              answer: "B",
              explanation: h`<p>Dua lingkaran berjari-jari \(R\) dan \(s\) yang bersinggungan luar dan menyinggung satu garis mempunyai jarak titik singgung pada garis \(=2\sqrt{Rs}\) (dari segitiga siku-siku dengan sisi miring \(R+s\) dan sisi tegak \(R-s\)).</p>
<p>Untuk lingkaran \(9\) dan \(4\): jarak titik singgungnya \(2\sqrt{36}=12\). Lingkaran ketiga memberi jarak \(2\sqrt{9r}=6\sqrt r\) dan \(2\sqrt{4r}=4\sqrt r\) ke kedua titik singgung itu, sehingga</p>
<div class="math-display">\[ 6\sqrt r+4\sqrt r=12\ \Rightarrow\ \sqrt r=\frac65\ \Rightarrow\ r=\frac{36}{25} \]</div>
<p>Jebakan: berhenti di \(\sqrt r=\dfrac65\) memberi \(\dfrac65\); memakai \(\dfrac1r=\dfrac19+\dfrac14\) memberi \(\dfrac{36}{13}\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Pada segitiga \(ABC\), \(AB=5\) cm, \(AC=8\) cm, dan \(\angle BAC=60^\circ\). Titik \(D\) pada sisi \(BC\) sehingga \(AD\) membagi \(\angle BAC\) menjadi dua sudut sama besar (lihat gambar). Panjang \(AD\) adalah .... cm.</p>`,
              figure: h`<svg aria-label="Segitiga ABC dengan AB 5 cm, AC 8 cm, sudut A 60 derajat, dan garis bagi AD" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 270px; height: auto" viewBox="0 0 260 215"><polygon fill="#94a3b8" fill-opacity="0.12" stroke="#0f172a" stroke-width="2" stroke-linejoin="round" points="30.0,190.0 150.0,190.0 126.0,23.7"></polygon><line stroke="#64748b" stroke-width="1.8" stroke-dasharray="6 4" x1="30.0" x2="140.8" y1="190.0" y2="126.0"></line><circle cx="30.0" cy="190.0" fill="currentColor" r="3"></circle><circle cx="150.0" cy="190.0" fill="currentColor" r="3"></circle><circle cx="126.0" cy="23.7" fill="currentColor" r="3"></circle><circle cx="140.8" cy="126.0" fill="currentColor" r="3"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="22.0" y="194.0">A</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="158.0" y="194.0">B</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="126.0" y="15.7">C</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="149.8" y="130.0">D</text><text fill="currentColor" font-size="11" text-anchor="middle" x="90.0" y="208.0">5 cm</text><text fill="currentColor" font-size="11" text-anchor="end" x="70.0" y="106.9">8 cm</text><path d="M56.0,190.0 A26,26 0 0 0 43.0,167.5" fill="none" stroke="currentColor" stroke-width="1.2"></path><text fill="currentColor" font-size="11" text-anchor="start" x="68.0" y="178.0">60°</text></svg>`,
              options: [
                { key: "A", text: h`\(\displaystyle \frac{20\sqrt3}{13}\)` },
                { key: "B", text: h`\(\displaystyle \frac{40}{13}\)` },
                { key: "C", text: h`\(\displaystyle \frac{40\sqrt3}{13}\)` },
                { key: "D", text: h`\(\displaystyle \frac{\sqrt{129}}{2}\)` },
                { key: "E", text: h`\(\displaystyle \frac{80\sqrt3}{13}\)` },
              ],
              answer: "C",
              explanation: h`<p>Luas \(\triangle ABC=\dfrac12\cdot5\cdot8\sin60^\circ=10\sqrt3\). Luas ini sama dengan jumlah luas \(\triangle ABD\) dan \(\triangle ADC\), yang masing-masing mempunyai sudut \(30^\circ\) di \(A\):</p>
<div class="math-display">\[ \frac12\cdot5\cdot AD\sin30^\circ+\frac12\cdot8\cdot AD\sin30^\circ=\frac{13}{4}AD=10\sqrt3\ \Rightarrow\ AD=\frac{40\sqrt3}{13} \]</div>
<p>Jebakan: memakai \(\sin60^\circ\) atau \(\cos60^\circ\) (bukan sudut setengahnya) pada rumus garis bagi memberi \(\dfrac{40}{13}\); \(\dfrac{\sqrt{129}}{2}\) adalah panjang garis <em>berat</em> dari \(A\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "tf",
              level: "sulit",
              prompt: h`<p>Tentukan nilai kebenaran setiap pernyataan tentang bilangan real berikut dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              statements: [
                h`\(0{,}\overline{27}=\dfrac{3}{11}\).`,
                h`Hasil kali dua bilangan irasional selalu merupakan bilangan irasional.`,
                h`\(\sqrt{7+4\sqrt3}-\sqrt{7-4\sqrt3}\) merupakan bilangan rasional.`,
                h`\(\sqrt{7+4\sqrt3}+\sqrt{7-4\sqrt3}\) merupakan bilangan rasional.`,
              ],
              answer: ["B", "S", "S", "B"],
              explanation: h`<p><strong>(1) Benar.</strong> \(0{,}\overline{27}=\dfrac{27}{99}=\dfrac{3}{11}\).</p>
<p><strong>(2) Salah.</strong> Contoh penyangkal: \(\sqrt2\times\sqrt2=2\), padahal \(\sqrt2\) irasional dan \(2\) rasional.</p>
<p>Untuk (3) dan (4): \(7+4\sqrt3=(2+\sqrt3)^2\) dan \(7-4\sqrt3=(2-\sqrt3)^2\), sehingga \(\sqrt{7+4\sqrt3}=2+\sqrt3\) dan \(\sqrt{7-4\sqrt3}=2-\sqrt3\) (keduanya positif).</p>
<p><strong>(3) Salah.</strong> Selisihnya \((2+\sqrt3)-(2-\sqrt3)=2\sqrt3\), irasional.</p>
<p><strong>(4) Benar.</strong> Jumlahnya \((2+\sqrt3)+(2-\sqrt3)=4\), rasional.</p>
<p>Jadi, kuncinya adalah <strong>Benar, Salah, Salah, Benar</strong>.</p>`,
            },
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Kantong I berisi \(3\) bola merah dan \(2\) bola biru; kantong II berisi \(2\) bola merah dan \(4\) bola biru. Satu bola diambil secara acak dari kantong I lalu dimasukkan ke kantong II, kemudian satu bola diambil secara acak dari kantong II. Jika bola yang terambil dari kantong II berwarna biru, peluang bahwa bola yang dipindahkan dari kantong I berwarna merah adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\displaystyle \frac{12}{35}\)` },
                { key: "B", text: h`\(\displaystyle \frac{5}{11}\)` },
                { key: "C", text: h`\(\displaystyle \frac12\)` },
                { key: "D", text: h`\(\displaystyle \frac{6}{11}\)` },
                { key: "E", text: h`\(\displaystyle \frac35\)` },
              ],
              answer: "D",
              explanation: h`<p>Jika bola merah dipindahkan (peluang \(\dfrac35\)), kantong II berisi \(3\) merah dan \(4\) biru: \(P(\text{biru})=\dfrac47\). Jika bola biru dipindahkan (peluang \(\dfrac25\)), kantong II berisi \(2\) merah dan \(5\) biru: \(P(\text{biru})=\dfrac57\).</p>
<div class="math-display">\[ P(\text{biru})=\frac35\cdot\frac47+\frac25\cdot\frac57=\frac{12}{35}+\frac{10}{35}=\frac{22}{35} \]</div>
<p>Peluang bersyarat: \(P(\text{merah dipindah}\mid\text{biru})=\dfrac{12/35}{22/35}=\dfrac{6}{11}\).</p>
<p>Jebakan: \(\dfrac{12}{35}\) adalah peluang <em>gabungan</em> (belum dibagi \(P(\text{biru})\)); \(\dfrac35\) mengabaikan informasi warna bola terambil.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Sebuah toko roti menjual \(120\) roti per hari dengan harga Rp8.000 per roti. Menurut survei, setiap kenaikan harga Rp500 menyebabkan penjualan turun \(6\) roti per hari. Biaya pembuatan satu roti Rp5.000. Laba maksimum per hari yang dapat diperoleh toko tersebut adalah ....</p>`,
              options: [
                { key: "A", text: h`Rp360.000` },
                { key: "B", text: h`Rp480.000` },
                { key: "C", text: h`Rp504.000` },
                { key: "D", text: h`Rp507.000` },
                { key: "E", text: h`Rp972.000` },
              ],
              answer: "D",
              explanation: h`<p>Misalkan harga dinaikkan \(n\) kali Rp500. Laba per roti \(=3.000+500n\) dan roti terjual \(=120-6n\):</p>
<div class="math-display">\[ L(n)=(3.000+500n)(120-6n)=360.000+42.000n-3.000n^2 \]</div>
<p>Fungsi kuadrat ini maksimum di \(n=\dfrac{42.000}{2\cdot3.000}=7\) (bilangan bulat, jadi layak): \(L(7)=6.500\times78=507.000\).</p>
<p>Jebakan: Rp972.000 adalah pendapatan maksimum (biaya diabaikan, maksimum di \(n=2\)); Rp504.000 diperoleh di \(n=6\) atau \(n=8\) yang berdekatan dengan optimum; Rp360.000 adalah laba bila harga tidak dinaikkan.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Limas beraturan \(T.ABCD\) mempunyai alas berbentuk persegi dengan \(AB=8\) cm dan tinggi limas \(6\) cm (lihat gambar). Jarak titik \(A\) ke bidang \(TBC\) adalah .... cm.</p>`,
              figure: h`<svg aria-label="Limas beraturan T.ABCD dengan alas persegi sisi 8 cm dan tinggi 6 cm; M dan N titik tengah AD dan BC, O pusat alas" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 270px; height: auto" viewBox="0 0 250 225"><line stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" stroke-opacity="0.55" x1="40.0" x2="90.0" y1="190.0" y2="160.0"></line><line stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" stroke-opacity="0.55" x1="90.0" x2="200.0" y1="160.0" y2="160.0"></line><line stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" stroke-opacity="0.55" x1="120.0" x2="90.0" y1="92.5" y2="160.0"></line><line stroke="#0f172a" stroke-width="2" x1="40.0" x2="150.0" y1="190.0" y2="190.0"></line><line stroke="#0f172a" stroke-width="2" x1="150.0" x2="200.0" y1="190.0" y2="160.0"></line><line stroke="#0f172a" stroke-width="2" x1="120.0" x2="40.0" y1="92.5" y2="190.0"></line><line stroke="#0f172a" stroke-width="2" x1="120.0" x2="150.0" y1="92.5" y2="190.0"></line><line stroke="#0f172a" stroke-width="2" x1="120.0" x2="200.0" y1="92.5" y2="160.0"></line><polygon fill="#94a3b8" fill-opacity="0.18" points="120.0,92.5 150.0,190.0 200.0,160.0"></polygon><line stroke="#64748b" stroke-width="1.4" stroke-dasharray="4 3" x1="65.0" x2="175.0" y1="175.0" y2="175.0"></line><line stroke="#64748b" stroke-width="1.4" stroke-dasharray="4 3" x1="120.0" x2="120.0" y1="92.5" y2="175.0"></line><line stroke="#64748b" stroke-width="1.4" stroke-dasharray="4 3" x1="120.0" x2="65.0" y1="92.5" y2="175.0"></line><line stroke="#475569" stroke-width="1.8" x1="120.0" x2="175.0" y1="92.5" y2="175.0"></line><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="31.0" y="202.0">A</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="159.0" y="203.0">B</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="211.0" y="166.0">C</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="81.0" y="160.0">D</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="120.0" y="83.5">T</text><circle cx="65.0" cy="175.0" fill="currentColor" r="2.6"></circle><text fill="currentColor" font-size="11" font-style="italic" text-anchor="middle" x="55.0" y="179.0">M</text><circle cx="175.0" cy="175.0" fill="currentColor" r="2.6"></circle><text fill="currentColor" font-size="11" font-style="italic" text-anchor="middle" x="186.0" y="189.0">N</text><circle cx="120.0" cy="175.0" fill="currentColor" r="2.6"></circle><text fill="currentColor" font-size="11" font-style="italic" text-anchor="middle" x="124.0" y="191.0">O</text><text fill="currentColor" font-size="11" text-anchor="middle" x="95.0" y="212.0">8 cm</text><text fill="currentColor" font-size="11" text-anchor="end" x="115.0" y="150.0">6 cm</text></svg>`,
              options: [
                { key: "A", text: h`\(\displaystyle \frac{12\sqrt{13}}{13}\)` },
                { key: "B", text: h`\(6\)` },
                { key: "C", text: h`\(\displaystyle \frac{24\sqrt{13}}{13}\)` },
                { key: "D", text: h`\(2\sqrt{13}\)` },
                { key: "E", text: h`\(8\)` },
              ],
              answer: "C",
              explanation: h`<p>Misalkan \(M\) dan \(N\) titik tengah \(AD\) dan \(BC\), serta \(O\) pusat alas. Maka \(MN=8\), \(TO=6\), \(ON=4\), dan \(TN=\sqrt{6^2+4^2}=2\sqrt{13}\).</p>
<p>Karena \(AD\parallel BC\), garis \(AD\) sejajar bidang \(TBC\), sehingga jarak \(A\) ke bidang \(TBC\) sama dengan jarak \(M\) ke bidang \(TBC\). Bidang \(TMN\) tegak lurus \(BC\), sehingga jarak itu adalah jarak \(M\) ke garis \(TN\) pada \(\triangle TMN\).</p>
<div class="math-display">\[ L_{\triangle TMN}=\frac12\cdot MN\cdot TO=24=\frac12\cdot TN\cdot d\ \Rightarrow\ d=\frac{48}{2\sqrt{13}}=\frac{24\sqrt{13}}{13} \]</div>
<p>Jebakan: \(\dfrac{12\sqrt{13}}{13}\) adalah jarak titik <em>pusat</em> \(O\) ke bidang \(TBC\) (separuhnya); \(2\sqrt{13}\) adalah panjang \(TN\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "tf",
              level: "sulit",
              prompt: h`<p>Tabel berikut menunjukkan banyak siswa kelas XII di suatu sekolah menurut jenis kelamin dan kegiatan ekstrakurikuler yang diikuti (setiap siswa mengikuti tepat satu kegiatan). Seorang siswa dipilih secara acak. Tentukan nilai kebenaran setiap pernyataan berikut dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>
<table class="tabel-data">
<thead>
<tr><th></th><th>Olahraga</th><th>Musik</th><th>Seni</th><th>Jumlah</th></tr>
</thead>
<tbody>
<tr><td>Laki-laki</td><td>\(22\)</td><td>\(8\)</td><td>\(6\)</td><td>\(36\)</td></tr>
<tr><td>Perempuan</td><td>\(10\)</td><td>\(18\)</td><td>\(16\)</td><td>\(44\)</td></tr>
<tr><td>Jumlah</td><td>\(32\)</td><td>\(26\)</td><td>\(22\)</td><td>\(80\)</td></tr>
</tbody>
</table>`,
              statements: [
                h`Peluang terpilih siswa yang mengikuti olahraga adalah \(\dfrac25\).`,
                h`Jika yang terpilih seorang siswa perempuan, peluang ia mengikuti seni adalah \(\dfrac{4}{11}\).`,
                h`Kejadian "terpilih siswa laki-laki" dan kejadian "terpilih siswa yang mengikuti olahraga" saling bebas.`,
                h`Peluang terpilih siswa laki-laki atau siswa yang mengikuti seni adalah \(\dfrac{13}{20}\).`,
              ],
              answer: ["B", "B", "S", "B"],
              explanation: h`<p><strong>(1) Benar.</strong> \(P(\text{olahraga})=\dfrac{32}{80}=\dfrac25\).</p>
<p><strong>(2) Benar.</strong> Peluang bersyarat dihitung dari baris perempuan: \(\dfrac{16}{44}=\dfrac4{11}\).</p>
<p><strong>(3) Salah.</strong> \(P(L)\cdot P(O)=\dfrac{36}{80}\cdot\dfrac{32}{80}=0{,}18\), sedangkan \(P(L\cap O)=\dfrac{22}{80}=0{,}275\). Keduanya tidak sama, jadi kejadian itu tidak saling bebas.</p>
<p><strong>(4) Benar.</strong> \(P(L\cup S)=\dfrac{36}{80}+\dfrac{22}{80}-\dfrac{6}{80}=\dfrac{52}{80}=\dfrac{13}{20}\) (irisan dikurangkan agar tidak terhitung dua kali).</p>
<p>Jadi, kuncinya adalah <strong>Benar, Benar, Salah, Benar</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Jika \(\sin x+\cos x=\dfrac12\), maka nilai \(\tan x+\cot x\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\displaystyle -\frac83\)` },
                { key: "B", text: h`\(\displaystyle -\frac43\)` },
                { key: "C", text: h`\(\displaystyle -\frac34\)` },
                { key: "D", text: h`\(\displaystyle \frac43\)` },
                { key: "E", text: h`\(\displaystyle \frac83\)` },
              ],
              answer: "A",
              explanation: h`<p>Kuadratkan kedua ruas: \(1+2\sin x\cos x=\dfrac14\Rightarrow\sin x\cos x=-\dfrac38\).</p>
<div class="math-display">\[ \tan x+\cot x=\frac{\sin^2x+\cos^2x}{\sin x\cos x}=\frac{1}{-3/8}=-\frac83 \]</div>
<p>Jebakan: lupa faktor \(2\) pada \(2\sin x\cos x\) memberi \(\sin x\cos x=-\dfrac34\) dan hasil \(-\dfrac43\); salah tanda memberi \(\dfrac83\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-21",
              no: 21,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Grafik berikut menunjukkan tinggi permukaan air laut \(H\) (dalam meter) di sebuah dermaga selama satu siklus pasang surut yang berlangsung \(12\) jam. Kapal hanya dapat bersandar bila \(H\ge6{,}5\) m. Total lama waktu kapal dapat bersandar dalam satu siklus tersebut adalah .... jam.</p>`,
              figure: h`<svg aria-label="Grafik tinggi air laut H terhadap waktu t selama 12 jam: maksimum 8 m pada t=0 dan t=12, minimum 2 m pada t=6, garis putus-putus pada H=6,5" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 330px; height: auto" viewBox="0 0 320 214"><line stroke="currentColor" stroke-width="1.6" x1="40.0" x2="302.0" y1="176.0" y2="176.0"></line><line stroke="currentColor" stroke-width="1.6" x1="46.0" x2="46.0" y1="178.0" y2="28.8"></line><polygon fill="currentColor" points="302.0,176.0 295.0,179.5 295.0,172.5"></polygon><polygon fill="currentColor" points="46.0,28.8 49.5,35.8 42.5,35.8"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="305.0" y="180.0"></text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="53.0" y="30.8"></text><line stroke="#64748b" stroke-width="1.2" stroke-dasharray="5 4" x1="46.0" x2="286.0" y1="72.0" y2="72.0"></line><text fill="currentColor" font-size="11" text-anchor="start" x="290.0" y="76.0">6,5</text><path d="M46.0,48.0 L51.0,48.4 L56.0,49.6 L61.0,51.7 L66.0,54.4 L71.0,57.9 L76.0,62.1 L81.0,66.8 L86.0,72.0 L91.0,77.6 L96.0,83.6 L101.0,89.7 L106.0,96.0 L111.0,102.3 L116.0,108.4 L121.0,114.4 L126.0,120.0 L131.0,125.2 L136.0,129.9 L141.0,134.1 L146.0,137.6 L151.0,140.3 L156.0,142.4 L161.0,143.6 L166.0,144.0 L171.0,143.6 L176.0,142.4 L181.0,140.3 L186.0,137.6 L191.0,134.1 L196.0,129.9 L201.0,125.2 L206.0,120.0 L211.0,114.4 L216.0,108.4 L221.0,102.3 L226.0,96.0 L231.0,89.7 L236.0,83.6 L241.0,77.6 L246.0,72.0 L251.0,66.8 L256.0,62.1 L261.0,57.9 L266.0,54.4 L271.0,51.7 L276.0,49.6 L281.0,48.4 L286.0,48.0" fill="none" stroke="#0f172a" stroke-linejoin="round" stroke-width="2.2"></path><line stroke="currentColor" stroke-width="1" x1="43.0" x2="49.0" y1="144.0" y2="144.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="148.0">2</text><line stroke="currentColor" stroke-width="1" x1="43.0" x2="49.0" y1="96.0" y2="96.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="100.0">5</text><line stroke="currentColor" stroke-width="1" x1="43.0" x2="49.0" y1="48.0" y2="48.0"></line><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="52.0">8</text><line stroke="currentColor" stroke-width="1" x1="46.0" x2="46.0" y1="173.0" y2="179.0"></line><line stroke="currentColor" stroke-width="1" x1="106.0" x2="106.0" y1="173.0" y2="179.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="106.0" y="192.0">3</text><line stroke="currentColor" stroke-width="1" x1="166.0" x2="166.0" y1="173.0" y2="179.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="166.0" y="192.0">6</text><line stroke="currentColor" stroke-width="1" x1="226.0" x2="226.0" y1="173.0" y2="179.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="226.0" y="192.0">9</text><line stroke="currentColor" stroke-width="1" x1="286.0" x2="286.0" y1="173.0" y2="179.0"></line><text fill="currentColor" font-size="11" text-anchor="middle" x="286.0" y="192.0">12</text><text fill="currentColor" font-size="11" text-anchor="end" x="39.0" y="192.0">0</text><circle cx="46.0" cy="48.0" fill="#0f172a" r="3.2"></circle><circle cx="166.0" cy="144.0" fill="#0f172a" r="3.2"></circle><circle cx="286.0" cy="48.0" fill="#0f172a" r="3.2"></circle><text fill="currentColor" font-size="11" font-style="italic" text-anchor="middle" x="166.0" y="208.0">t (jam)</text><text fill="currentColor" font-size="11" font-style="italic" text-anchor="start" x="54.0" y="38.8">H (meter)</text></svg>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(6\)` },
                { key: "D", text: h`\(8\)` },
                { key: "E", text: h`\(10\)` },
              ],
              answer: "B",
              explanation: h`<p>Dari grafik: maksimum \(8\) di \(t=0\) dan \(t=12\), minimum \(2\) di \(t=6\). Amplitudo \(3\), garis tengah \(5\), periode \(12\), sehingga \(H(t)=5+3\cos\dfrac{\pi t}{6}\).</p>
<p>\(H\ge6{,}5\Rightarrow\cos\dfrac{\pi t}{6}\ge\dfrac12\Rightarrow-\dfrac\pi3\le\dfrac{\pi t}{6}\le\dfrac\pi3\Rightarrow-2\le t\le2\) (modulo \(12\)). Dalam satu siklus \(0\le t\le12\): \(0\le t\le2\) dan \(10\le t\le12\), total \(2+2=4\) jam.</p>
<p>Jebakan: hanya menghitung selang \(0\le t\le2\) memberi \(2\); mengira selang di sekitar \(t=6\) memberi \(8\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: "isian",
      letter: "B",
      title: "Isian Singkat",
      instruction: h`4 soal \(\times\) 4 poin = 16 poin. Ketik hanya jawaban akhir, lalu tekan
<strong>Periksa</strong> atau Enter.`,
      pointsEach: 4,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "isian-1",
              no: 22,
              type: "short",
              level: "sedang",
              prompt: h`<p>Sebuah bak kosong dapat diisi penuh oleh keran A dalam \(6\) jam dan oleh keran B dalam \(9\) jam. Pada dasar bak terdapat lubang pembuangan yang dapat mengosongkan bak penuh dalam \(18\) jam. Mula-mula hanya keran A yang dibuka (lubang tertutup). Tepat satu jam kemudian keran B dan lubang pembuangan dibuka bersamaan. Bak penuh setelah .... jam sejak keran A dibuka. (Tulis dalam bentuk pecahan atau desimal.)</p>`,
              answer: ["19/4", "4,75", "4.75"],
              explanation: h`<p>Dalam \(1\) jam pertama keran A mengisi \(\dfrac16\) bak, sisanya \(\dfrac56\) bak.</p>
<p>Laju gabungan setelah itu: \(\dfrac16+\dfrac19-\dfrac1{18}=\dfrac{3+2-1}{18}=\dfrac29\) bak per jam. Waktu untuk sisa bak: \(\dfrac{5/6}{2/9}=\dfrac{15}{4}\) jam.</p>
<p>Total waktu \(=1+\dfrac{15}{4}=\) <strong>\(\dfrac{19}{4}=4{,}75\)</strong> jam.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "isian-2",
              no: 23,
              type: "short",
              level: "sulit",
              prompt: h`<p>Lima bilangan bulat positif disusun dari yang terkecil ke terbesar. Rata-ratanya \(8\), mediannya \(8\), dan modusnya tunggal, yaitu \(10\). Jangkauan kelima bilangan tersebut adalah ....</p>`,
              answer: ["5"],
              explanation: h`<p>Misalkan bilangannya \(a\le b\le c\le d\le e\). Median \(c=8\) dan jumlahnya \(5\cdot8=40\).</p>
<p>Modus tunggal \(10\) berarti \(10\) muncul paling banyak. Karena \(c=8\), hanya \(d\) dan \(e\) yang dapat bernilai \(10\), sehingga \(d=e=10\) dan muncul tepat dua kali. Jadi \(a+b=40-8-20=12\) dengan \(a\le b\le8\).</p>
<p>Pasangan \((a,b)=(4,8)\) membuat \(8\) muncul dua kali dan \((6,6)\) membuat \(6\) muncul dua kali, sehingga modusnya tidak tunggal. Satu-satunya yang memenuhi adalah \((5,7)\). Datanya \(5,7,8,10,10\) dan jangkauannya \(10-5=\) <strong>\(5\)</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          note: "Penalaran tingkat tinggi gaya TKA",
          questions: [
            {
              id: "isian-3",
              no: 24,
              type: "short",
              level: "hots",
              prompt: h`<p>Tiga pemain \(A\), \(B\), dan \(C\) melempar sebuah dadu bergiliran dengan urutan \(A,B,C,A,B,C,\dots\) Pemain yang pertama kali memperoleh mata dadu \(6\) dinyatakan menang dan permainan berhenti. Peluang pemain \(A\) menang adalah .... (tuliskan sebagai pecahan, misalnya 3/7).</p>`,
              answer: ["36/91"],
              explanation: h`<p>Pemain \(A\) melempar pada lemparan ke-\(1,4,7,\dots\) Misalkan \(p=\dfrac16\) peluang mendapat angka \(6\) dan \(q=\dfrac56\). \(A\) menang pada lemparan ke-\(1\) dengan peluang \(p\); pada lemparan ke-\(4\) bila tiga lemparan pertama gagal dengan peluang \(q^3p\); dan seterusnya.</p>
<div class="math-display">\[ P(A)=p+q^3p+q^6p+\cdots=\frac{p}{1-q^3}=\frac{1/6}{1-125/216}=\frac16\cdot\frac{216}{91}=\frac{36}{91} \]</div>
<p>Pemeriksaan: \(P(B)=q\,P(A)=\dfrac{30}{91}\) dan \(P(C)=q^2P(A)=\dfrac{25}{91}\), sehingga \(\dfrac{36+30+25}{91}=1\), artinya permainan pasti berakhir.</p>
<p>Jadi, peluangnya <strong>\(\dfrac{36}{91}\)</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 25,
              type: "short",
              level: "hots",
              prompt: h`<p>Pada persegi \(ABCD\) dengan panjang sisi \(12\) cm, titik \(E\) terletak pada sisi \(AB\) dan titik \(F\) pada sisi \(BC\) sehingga \(AE=BF\) (lihat gambar). Jika luas segitiga \(DEF\) adalah \(63\) cm\(^2\), panjang \(EF\) adalah .... cm. (akar dapat ditulis sqrt atau √)</p>`,
              figure: h`<svg aria-label="Persegi ABCD dengan sisi 12 cm, titik E pada AB dan F pada BC dengan AE sama dengan BF, dan segitiga DEF diarsir" font-family="inherit" font-size="12" role="img" style="width: 100%; max-width: 260px; height: auto" viewBox="0 0 250 250"><polygon fill="#64748b" fill-opacity="0.25" points="36.0,36.0 92.0,196.0 196.0,140.0"></polygon><polygon fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linejoin="round" points="36.0,196.0 196.0,196.0 196.0,36.0 36.0,36.0"></polygon><line stroke="#475569" stroke-width="1.8" x1="36.0" x2="92.0" y1="36.0" y2="196.0"></line><line stroke="#475569" stroke-width="1.8" x1="36.0" x2="196.0" y1="36.0" y2="140.0"></line><line stroke="#475569" stroke-width="1.8" x1="92.0" x2="196.0" y1="196.0" y2="140.0"></line><circle cx="36.0" cy="196.0" fill="currentColor" r="2.8"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="28.0" y="208.0">A</text><circle cx="196.0" cy="196.0" fill="currentColor" r="2.8"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="204.0" y="208.0">B</text><circle cx="196.0" cy="36.0" fill="currentColor" r="2.8"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="204.0" y="36.0">C</text><circle cx="36.0" cy="36.0" fill="currentColor" r="2.8"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="end" x="28.0" y="36.0">D</text><circle cx="92.0" cy="196.0" fill="currentColor" r="2.8"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="92.0" y="213.0">E</text><circle cx="196.0" cy="140.0" fill="currentColor" r="2.8"></circle><text fill="currentColor" font-size="12" font-style="italic" text-anchor="start" x="205.0" y="144.0">F</text><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="64.0" y="226.0">x</text><line stroke="currentColor" stroke-width="1" x1="36.0" x2="92.0" y1="218.0" y2="218.0"></line><polygon fill="currentColor" points="36.0,218.0 42.0,214.5 42.0,221.5"></polygon><polygon fill="currentColor" points="92.0,218.0 86.0,214.5 86.0,221.5"></polygon><text fill="currentColor" font-size="12" font-style="italic" text-anchor="middle" x="218.0" y="172.0">x</text><text fill="currentColor" font-size="11" text-anchor="middle" x="116.0" y="240.0">12 cm</text></svg>`,
              answer: ["6√3", "6sqrt3", "6sqrt(3)", "6√(3)", "√108", "sqrt108", "sqrt(108)", h`\sqrt{108}`],
              explanation: h`<p>Misalkan \(AE=BF=x\) dengan \(0\le x\le12\), sehingga \(BE=12-x\) dan \(CF=12-x\). Luas \(\triangle DEF\) \(=\) luas persegi \(-\) tiga segitiga siku-siku di sudutnya:</p>
<div class="math-display">\[ [DEF]=144-\tfrac12\cdot12x-\tfrac12(12-x)x-\tfrac12\cdot12(12-x)=\tfrac12\left(x^2-12x+144\right) \]</div>
<p>Dari \([DEF]=63\): \(x^2-12x+144=126\Rightarrow x^2-12x=-18\).</p>
<p>Menurut Pythagoras, \(EF^2=(12-x)^2+x^2=2(x^2-12x)+144=2(-18)+144=108\). Jadi \(EF=\sqrt{108}=\) <strong>\(6\sqrt3\)</strong> cm.</p>
<p>Catatan: kedua akar \(x=6\pm3\sqrt2\) terletak di dalam \([0,12]\), dan keduanya memberi \(EF\) yang sama, sehingga \(x\) tidak perlu dicari.</p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default prediksiTka2027;
