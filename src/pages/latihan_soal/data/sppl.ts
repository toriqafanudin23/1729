import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Sistem Persamaan dan Pertidaksamaan Linear.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const sppl: Material = {
  slug: "sppl",
  title: "Latihan Soal Sistem Persamaan dan Pertidaksamaan Linear",
  topic: "Sistem Persamaan dan Pertidaksamaan Linear",
  description:
    "Persamaan dan pertidaksamaan linear, nilai mutlak dan bentuk pecahan, sistem persamaan dua dan tiga variabel, serta program linear dan model kontekstual.",
  durationMinutes: 90,
  notes: [
    h`Soal terdiri atas 20 pilihan ganda, 5 isian singkat, dan 5 uraian (essay).
Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Pada soal pertidaksamaan, ingat membalik tanda ketidaksamaan saat
mengalikan atau membagi dengan bilangan negatif, dan penyebut pecahan
tidak boleh nol.`,
    h`Pada soal program linear, peubah \(x\) dan \(y\) bernilai tak negatif
(\(x\ge0,\ y\ge0\)) kecuali dinyatakan lain.`,
  ],
  sections: [
    {
      id: "pg",
      letter: "A",
      title: "Pilihan Ganda",
      instruction: h`20 soal \(\times\) 2 poin = 40 poin. Pilih satu jawaban yang paling tepat.`,
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
              prompt: h`<p>Nilai \(x\) yang memenuhi \(2(x-3)+5=3x-4\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(5\)` },
              ],
              answer: "C",
              explanation: h`<p>Buka kurung lalu kumpulkan suku sejenis:</p>
<div class="math-display">\[ 2x-6+5=3x-4\Rightarrow2x-1=3x-4\Rightarrow x=3 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Perhatikan gambar berikut. Garis \(g\) dan garis \(h\) berpotongan di titik \(P(a,b)\). Nilai \(ab\) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 330 335" role="img" aria-label="Garis g melalui (8,0) dan (0,8), garis h melalui (2,0) dan (0,-2), berpotongan di titik P(a,b)" style="width: 100%; max-width: 340px; height: auto" font-size="13" font-family="inherit"><line x1="2" y1="250" x2="290" y2="250" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="50" y1="326.8" x2="50" y2="10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><polygon points="290,250 283,246 283,254" fill="currentColor" /><polygon points="50,10 46,17 54,17" fill="currentColor" /><text x="296" y="255" text-anchor="start" fill="currentColor" font-style="italic">x</text><text x="59" y="14" text-anchor="start" fill="currentColor" font-style="italic">y</text><line x1="26" y1="34" x2="266" y2="274" stroke="#2563eb" stroke-width="3" stroke-linecap="round" /><line x1="26" y1="322" x2="278.0" y2="70.0" stroke="#0f8b7d" stroke-width="3" stroke-linecap="round" /><text x="274" y="278" text-anchor="start" fill="#2563eb" font-style="italic" font-weight="700">g</text><text x="286.0" y="74.0" text-anchor="start" fill="#0f8b7d" font-style="italic" font-weight="700">h</text><circle cx="242" cy="250" r="3.5" fill="#2563eb" /><text x="242" y="268" text-anchor="middle" fill="currentColor">8</text><circle cx="50" cy="58" r="3.5" fill="#2563eb" /><text x="42" y="63" text-anchor="end" fill="currentColor">8</text><circle cx="98" cy="250" r="3.5" fill="#0f8b7d" /><text x="106" y="268" text-anchor="middle" fill="currentColor">2</text><circle cx="50" cy="298" r="3.5" fill="#0f8b7d" /><text x="42" y="303" text-anchor="end" fill="currentColor">−2</text><circle cx="170" cy="178" r="4.5" fill="#dc2626" /><text x="178" y="170" text-anchor="start" fill="currentColor">P(a, b)</text><text x="42" y="266" text-anchor="end" fill="currentColor">O</text></svg>`,
              options: [
                { key: "A", text: h`\(12\)` },
                { key: "B", text: h`\(15\)` },
                { key: "C", text: h`\(16\)` },
                { key: "D", text: h`\(18\)` },
                { key: "E", text: h`\(20\)` },
              ],
              answer: "B",
              explanation: h`<p>Garis \(g\) melalui \((8,0)\) dan \((0,8)\), sehingga \(x+y=8\). Garis \(h\) melalui \((2,0)\) dan \((0,-2)\), sehingga \(y=x-2\), atau \(x-y=2\).</p>
<div class="math-display">\[ x+y=8,\quad x-y=2\ \Rightarrow\ 2x=10\Rightarrow x=5,\ y=3 \]</div>
<p>Titik \(P(5,3)\), sehingga \(ab=5\cdot3=15\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Himpunan penyelesaian pertidaksamaan \(4-3x&gt;10\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(x&lt;-2\)` },
                { key: "B", text: h`\(x&gt;-2\)` },
                { key: "C", text: h`\(x&lt;2\)` },
                { key: "D", text: h`\(x&gt;2\)` },
                { key: "E", text: h`\(x&lt;-6\)` },
              ],
              answer: "A",
              explanation: h`<p>Pindahkan konstanta ke ruas kanan:</p>
<div class="math-display">\[ -3x&gt;6 \]</div>
<p>Dibagi \(-3\), tanda pertidaksamaan berbalik: \(x&lt;-2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Harga 3 buku dan 2 pensil Rp21.000, sedangkan harga 1 buku dan 2 pensil Rp11.000. Harga 4 buku dan 3 pensil adalah ....</p>`,
              options: [
                { key: "A", text: h`Rp24.000` },
                { key: "B", text: h`Rp26.000` },
                { key: "C", text: h`Rp27.000` },
                { key: "D", text: h`Rp29.000` },
                { key: "E", text: h`Rp31.000` },
              ],
              answer: "D",
              explanation: h`<p>Kurangkan kedua persamaan: \(2\) buku \(=\) Rp10.000, jadi 1 buku Rp5.000. Lalu \(2\) pensil \(=11.000-5.000=6.000\), jadi 1 pensil Rp3.000.</p>
<div class="math-display">\[ 4(5.000)+3(3.000)=20.000+9.000=29.000 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Himpunan penyelesaian pertidaksamaan \(|x-2|&lt;3\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(x&lt;-1\) atau \(x&gt;5\)` },
                { key: "B", text: h`\(x&lt;5\)` },
                { key: "C", text: h`\(1&lt;x&lt;5\)` },
                { key: "D", text: h`\(-5&lt;x&lt;1\)` },
                { key: "E", text: h`\(-1&lt;x&lt;5\)` },
              ],
              answer: "E",
              explanation: h`<p>Gunakan sifat nilai mutlak \(|u|&lt;c\Rightarrow-c&lt;u&lt;c\):</p>
<div class="math-display">\[ -3&lt;x-2&lt;3\Rightarrow-1&lt;x&lt;5 \]</div>
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
              prompt: h`<p>Jika \(101x+99y=301\) dan \(99x+101y=299\), maka nilai \(x^{2}-y^{2}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(3\)` },
                { key: "C", text: h`\(5\)` },
                { key: "D", text: h`\(7\)` },
                { key: "E", text: h`\(9\)` },
              ],
              answer: "B",
              explanation: h`<p>Jumlahkan dan kurangkan kedua persamaan:</p>
<div class="math-display">\[ 200(x+y)=600\Rightarrow x+y=3,\qquad 2(x-y)=2\Rightarrow x-y=1 \]</div>
<p>Maka \(x^{2}-y^{2}=(x+y)(x-y)=3\cdot1=3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Jika \((x,y,z)\) adalah penyelesaian sistem \[\begin{cases}x+y+z=6\\ 2x-y+z=3\\ x+2y-z=2\end{cases}\] maka nilai \(x+2y+3z\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(10\)` },
                { key: "B", text: h`\(11\)` },
                { key: "C", text: h`\(12\)` },
                { key: "D", text: h`\(13\)` },
                { key: "E", text: h`\(14\)` },
              ],
              answer: "E",
              explanation: h`<p>Jumlahkan persamaan ke-2 dan ke-3 untuk menghilangkan \(z\), lalu persamaan ke-1 dan ke-3:</p>
<div class="math-display">\[ 3x+y=5,\qquad 2x+3y=8 \]</div>
<p>Dari \(y=5-3x\): \(2x+15-9x=8\Rightarrow x=1\), sehingga \(y=2\) dan \(z=3\).</p>
<div class="math-display">\[ x+2y+3z=1+4+9=14 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Sistem persamaan \(2x+ky=9\) dan \(x+3y=4\) tidak mempunyai penyelesaian jika \(k=\) ....</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(3\)` },
                { key: "C", text: h`\(6\)` },
                { key: "D", text: h`\(9\)` },
                { key: "E", text: h`\(12\)` },
              ],
              answer: "C",
              explanation: h`<p>Sistem tidak punya penyelesaian bila koefisien-koefisiennya sebanding tetapi konstantanya tidak:</p>
<div class="math-display">\[ \dfrac21=\dfrac{k}{3}\neq\dfrac94\Rightarrow k=6 \]</div>
<p>Syarat \(2\neq\dfrac94\) terpenuhi, jadi \(k=6\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Himpunan penyelesaian pertidaksamaan \(\dfrac{2x-1}{x+2}\le1\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-2&lt;x\le3\)` },
                { key: "B", text: h`\(x\le3\)` },
                { key: "C", text: h`\(x&lt;-2\) atau \(x\ge3\)` },
                { key: "D", text: h`\(-2\le x\le3\)` },
                { key: "E", text: h`\(x\le-2\) atau \(x&gt;3\)` },
              ],
              answer: "A",
              explanation: h`<p>Pindahkan \(1\) ke ruas kiri dan samakan penyebut:</p>
<div class="math-display">\[ \dfrac{2x-1}{x+2}-1\le0\Rightarrow\dfrac{x-3}{x+2}\le0 \]</div>
<p>Pembuat nol: \(x=3\) (ikut karena \(\le\)) dan \(x=-2\) (tidak ikut karena penyebut nol). Maka \(-2&lt;x\le3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Jumlah semua bilangan bulat \(x\) yang memenuhi \(|2x-3|\le5\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(4\)` },
                { key: "B", text: h`\(6\)` },
                { key: "C", text: h`\(7\)` },
                { key: "D", text: h`\(9\)` },
                { key: "E", text: h`\(10\)` },
              ],
              answer: "D",
              explanation: h`<p>Uraikan nilai mutlaknya:</p>
<div class="math-display">\[ -5\le2x-3\le5\Rightarrow-2\le2x\le8\Rightarrow-1\le x\le4 \]</div>
<p>Bilangan bulatnya \(-1,0,1,2,3,4\), dengan jumlah \(9\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "pg-11",
              no: 11,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Andi membeli 3 buku, 2 pulpen, dan 1 penggaris seharga Rp22.000. Budi membeli 2 buku, 3 pulpen, dan 2 penggaris seharga Rp21.000. Citra membeli 1 buku, 1 pulpen, dan 3 penggaris seharga Rp11.000. Harga 1 buku, 1 pulpen, dan 1 penggaris seluruhnya adalah ....</p>`,
              options: [
                { key: "A", text: h`Rp7.000` },
                { key: "B", text: h`Rp8.000` },
                { key: "C", text: h`Rp8.500` },
                { key: "D", text: h`Rp9.000` },
                { key: "E", text: h`Rp10.000` },
              ],
              answer: "D",
              explanation: h`<p>Jumlahkan ketiga persamaan. Koefisien setiap barang menjadi \(6\):</p>
<div class="math-display">\[ 6(\text{buku}+\text{pulpen}+\text{penggaris})=22.000+21.000+11.000=54.000 \]</div>
<p>Maka harga ketiganya Rp9.000. Pemeriksaan: buku Rp5.000, pulpen Rp3.000, penggaris Rp1.000.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Himpunan penyelesaian pertidaksamaan \(|x+1|\ge2|x-2|\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\le x\le5\)` },
                { key: "B", text: h`\(x\le1\) atau \(x\ge5\)` },
                { key: "C", text: h`\(-1\le x\le2\)` },
                { key: "D", text: h`\(-5\le x\le-1\)` },
                { key: "E", text: h`\(1&lt;x&lt;5\)` },
              ],
              answer: "A",
              explanation: h`<p>Kedua ruas tak negatif, sehingga boleh dikuadratkan:</p>
<div class="math-display">\[ (x+1)^{2}\ge4(x-2)^{2}\Rightarrow3x^{2}-18x+15\le0\Rightarrow(x-1)(x-5)\le0 \]</div>
<p>Maka \(1\le x\le5\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diketahui sistem persamaan \(2x+y=k+3\) dan \(x-y=2k-3\). Penyelesaian \((x,y)\) terletak di kuadran IV jika ....</p>`,
              options: [
                { key: "A", text: h`\(k&lt;0\)` },
                { key: "B", text: h`\(0&lt;k&lt;3\)` },
                { key: "C", text: h`\(k&gt;3\)` },
                { key: "D", text: h`\(k&gt;0\)` },
                { key: "E", text: h`\(k&lt;3\)` },
              ],
              answer: "C",
              explanation: h`<p>Jumlahkan kedua persamaan:</p>
<div class="math-display">\[ 3x=3k\Rightarrow x=k,\qquad y=3-k \]</div>
<p>Kuadran IV: \(x&gt;0\) dan \(y&lt;0\), yaitu \(k&gt;0\) dan \(k&gt;3\). Irisannya \(k&gt;3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Seorang perajin membuat meja dan kursi. Satu meja memerlukan 3 jam perakitan dan 1 jam pengecatan, sedangkan satu kursi memerlukan 2 jam perakitan dan 2 jam pengecatan. Waktu yang tersedia adalah 36 jam perakitan dan 20 jam pengecatan. Keuntungan tiap meja Rp200.000 dan tiap kursi Rp100.000. Keuntungan maksimum yang dapat diperoleh adalah ....</p>`,
              options: [
                { key: "A", text: h`Rp1.800.000` },
                { key: "B", text: h`Rp2.000.000` },
                { key: "C", text: h`Rp2.200.000` },
                { key: "D", text: h`Rp2.300.000` },
                { key: "E", text: h`Rp2.400.000` },
              ],
              answer: "E",
              explanation: h`<p>Misalkan \(x\) meja dan \(y\) kursi:</p>
<div class="math-display">\[ 3x+2y\le36,\quad x+2y\le20,\quad x,y\ge0,\quad Z=200.000x+100.000y \]</div>
<p>Titik sudut daerah penyelesaian dan nilai \(Z\):</p>
<div class="math-display">\[ (0,0):0,\quad(12,0):2.400.000,\quad(8,6):2.200.000,\quad(0,10):1.000.000 \]</div>
<p>Keuntungan maksimum Rp2.400.000, bukan di titik potong kedua garis.</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Daerah yang diarsir pada gambar berikut merupakan himpunan penyelesaian suatu sistem pertidaksamaan linear. Luas daerah arsiran adalah .... satuan luas.</p>`,
              figure: h`<svg viewBox="0 0 330 300" role="img" aria-label="Daerah arsiran berbentuk segiempat dengan titik sudut (0,0), (4,0), (8/3,8/3), dan (0,4), dibatasi garis 2x+y=8 dan x+2y=8" style="width: 100%; max-width: 340px; height: auto" font-size="13" font-family="inherit"><polygon points="40,270 160,270 120.0,190.0 40,150" fill="#0f8b7d" fill-opacity="0.3" stroke="none" /><line x1="25.0" y1="270" x2="319.0" y2="270" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="40" y1="285.0" x2="40" y2="6.0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><polygon points="319.0,270 312.0,266 312.0,274" fill="currentColor" /><polygon points="40,6.0 36,13.0 44,13.0" fill="currentColor" /><text x="325.0" y="275" text-anchor="start" fill="currentColor" font-style="italic">x</text><text x="49" y="10.0" text-anchor="start" fill="currentColor" font-style="italic">y</text><line x1="172.0" y1="294.0" x2="28.0" y2="6.0" stroke="#2563eb" stroke-width="3" stroke-linecap="round" /><line x1="310" y1="285.0" x2="25.0" y2="142.5" stroke="#dc2626" stroke-width="3" stroke-linecap="round" /><text x="73.0" y="60" text-anchor="start" fill="#2563eb">2x + y = 8</text><text x="196.0" y="202" text-anchor="start" fill="#dc2626">x + 2y = 8</text><circle cx="160" cy="270" r="3" fill="currentColor" /><text x="160" y="288" text-anchor="middle" fill="currentColor">4</text><circle cx="280" cy="270" r="3" fill="currentColor" /><text x="280" y="288" text-anchor="middle" fill="currentColor">8</text><circle cx="40" cy="150" r="3" fill="currentColor" /><text x="32" y="155" text-anchor="end" fill="currentColor">4</text><circle cx="40" cy="30" r="3" fill="currentColor" /><text x="32" y="35" text-anchor="end" fill="currentColor">8</text><text x="32" y="286" text-anchor="end" fill="currentColor">O</text></svg>`,
              options: [
                { key: "A", text: h`\(8\)` },
                { key: "B", text: h`\(\dfrac{32}{3}\)` },
                { key: "C", text: h`\(12\)` },
                { key: "D", text: h`\(14\)` },
                { key: "E", text: h`\(16\)` },
              ],
              answer: "B",
              explanation: h`<p>Titik potong kedua garis \(2x+y=8\) dan \(x+2y=8\) adalah \(\left(\dfrac83,\dfrac83\right)\). Titik sudut daerah: \((0,0)\), \((4,0)\), \(\left(\dfrac83,\dfrac83\right)\), dan \((0,4)\).</p>
<p>Daerah ini dibagi menjadi dua segitiga yang sama luas (alas \(4\), tinggi \(\dfrac83\)):</p>
<div class="math-display">\[ L=\dfrac12\cdot4\cdot\dfrac83+\dfrac12\cdot4\cdot\dfrac83=\dfrac{32}{3} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diberikan sistem \(ax+y=2\) dan \(x+ay=2\) dengan \(a\) bilangan real. Perhatikan pernyataan berikut.</p>
<ul class="pernyataan">
<li>(1) Jika \(a=1\), sistem memiliki tak hingga banyak penyelesaian.</li>
<li>(2) Jika \(a=-1\), sistem tidak memiliki penyelesaian.</li>
<li>(3) Jika \(a\neq\pm1\), penyelesaian sistem selalu memenuhi \(x=y\).</li>
<li>(4) Jika \(a=2\), penyelesaian sistem adalah \((1,1)\).</li>
</ul>
<p>Pernyataan yang benar adalah ....</p>`,
              options: [
                { key: "A", text: h`(4) saja` },
                { key: "B", text: h`(1) dan (2) saja` },
                { key: "C", text: h`(2) dan (4) saja` },
                { key: "D", text: h`(1) dan (3) saja` },
                { key: "E", text: h`(1), (2), dan (3)` },
              ],
              answer: "E",
              explanation: h`<p>Kurangkan kedua persamaan: \((a-1)(x-y)=0\).</p>
<p><strong>(1) Benar.</strong> Untuk \(a=1\), kedua persamaan sama (\(x+y=2\)), sehingga ada tak hingga banyak penyelesaian.</p>
<p><strong>(2) Benar.</strong> Untuk \(a=-1\): \(-x+y=2\) dan \(x-y=2\) saling bertentangan, sehingga tidak ada penyelesaian.</p>
<p><strong>(3) Benar.</strong> Jika \(a\neq1\), maka \(x-y=0\), yaitu \(x=y\).</p>
<p><strong>(4) Salah.</strong> Untuk \(a=2\): \(x=y=\dfrac23\neq1\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Sebuah toko membuat paket hadiah. Paket jenis A berisi 3 cokelat dan paket jenis B berisi 5 cokelat. Seluruhnya dipakai tepat 115 cokelat, setiap jenis dibuat paling sedikit satu paket, dan banyak paket A lebih banyak daripada paket B. Banyak kemungkinan pasangan (banyak paket A, banyak paket B) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(3\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(5\)` },
                { key: "D", text: h`\(6\)` },
                { key: "E", text: h`\(7\)` },
              ],
              answer: "C",
              explanation: h`<p>Misalkan \(a\) paket A dan \(b\) paket B, dengan \(3a+5b=115\) dan \(a&gt;b\ge1\). Agar \(a=\dfrac{115-5b}{3}\) bulat, harus \(b\equiv2\pmod3\), yaitu:</p>
<div class="math-display">\[ b=2,5,8,11,14,\ldots\quad\text{dengan}\quad a=35,30,25,20,15,\ldots \]</div>
<p>Syarat \(a&gt;b\) dipenuhi untuk \(b=2,5,8,11,14\). Untuk \(b=17\), \(a=10&lt;17\) sehingga tidak memenuhi. Ada \(5\) pasangan.</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Daerah yang diarsir pada gambar berikut adalah himpunan penyelesaian suatu sistem pertidaksamaan. Sistem pertidaksamaan tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 345 285" role="img" aria-label="Daerah arsiran segiempat OABC dengan O(0,0), A(4,0), B(3,2), dan C(0,3)" style="width: 100%; max-width: 360px; height: auto" font-size="13" font-family="inherit"><line x1="60" y1="240" x2="60" y2="40" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="110" y1="240" x2="110" y2="40" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="160" y1="240" x2="160" y2="40" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="210" y1="240" x2="210" y2="40" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="260" y1="240" x2="260" y2="40" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="310" y1="240" x2="310" y2="40" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="60" y1="240" x2="310" y2="240" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="60" y1="190" x2="310" y2="190" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="60" y1="140" x2="310" y2="140" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="60" y1="90" x2="310" y2="90" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><line x1="60" y1="40" x2="310" y2="40" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.25" /><polygon points="60,240 260,240 210,140 60,90" fill="#0f8b7d" fill-opacity="0.3" stroke="none" /><line x1="45.0" y1="240" x2="330.0" y2="240" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="60" y1="255.0" x2="60" y2="20.0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><polygon points="330.0,240 323.0,236 323.0,244" fill="currentColor" /><polygon points="60,20.0 56,27.0 64,27.0" fill="currentColor" /><text x="336.0" y="245" text-anchor="start" fill="currentColor" font-style="italic">x</text><text x="69" y="24.0" text-anchor="start" fill="currentColor" font-style="italic">y</text><line x1="280.0" y1="280.0" x2="190.0" y2="100.0" stroke="#2563eb" stroke-width="3" stroke-linecap="round" /><line x1="45.0" y1="85.0" x2="285.0" y2="165.0" stroke="#dc2626" stroke-width="3" stroke-linecap="round" /><circle cx="60" cy="240" r="3.5" fill="currentColor" /><text x="54" y="258" text-anchor="end" fill="currentColor">O(0, 0)</text><circle cx="260" cy="240" r="3.5" fill="currentColor" /><text x="266" y="260" text-anchor="middle" fill="currentColor">A(4, 0)</text><circle cx="210" cy="140" r="3.5" fill="currentColor" /><text x="218" y="132" text-anchor="start" fill="currentColor">B(3, 2)</text><circle cx="60" cy="90" r="3.5" fill="currentColor" /><text x="52" y="95" text-anchor="end" fill="currentColor">C(0, 3)</text></svg>`,
              options: [
                { key: "A", text: h`\(x\ge0,\ y\ge0,\ x+2y\le8,\ 3x+y\le9\)` },
                { key: "B", text: h`\(x\ge0,\ y\ge0,\ 2x+y\le8,\ x+3y\le9\)` },
                { key: "C", text: h`\(x\ge0,\ y\ge0,\ 2x+y\le8,\ x+3y\ge9\)` },
                { key: "D", text: h`\(x\ge0,\ y\ge0,\ 2x+y\ge8,\ x+3y\le9\)` },
                { key: "E", text: h`\(x\ge0,\ y\ge0,\ 2x+y\le9,\ x+3y\le8\)` },
              ],
              answer: "B",
              explanation: h`<p>Garis \(AB\) melalui \((4,0)\) dan \((3,2)\): \(2x+y=8\). Garis \(BC\) melalui \((3,2)\) dan \((0,3)\): \(x+3y=9\).</p>
<p>Titik \(O(0,0)\) berada di dalam daerah dan memenuhi \(0\le8\) serta \(0\le9\), sehingga tandanya \(\le\). Ditambah \(x\ge0\) dan \(y\ge0\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diketahui daerah penyelesaian sistem \(x\ge0\), \(y\ge0\), \(2x+y\le8\), dan \(x+3y\le9\). Fungsi \(Z=ax+y\) dengan \(a&gt;0\) mencapai nilai maksimum di lebih dari satu titik pada daerah tersebut. Nilai \(a\) yang mungkin adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac13\) atau \(2\)` },
                { key: "B", text: h`\(\dfrac12\) atau \(3\)` },
                { key: "C", text: h`\(\dfrac13\) saja` },
                { key: "D", text: h`\(2\) saja` },
                { key: "E", text: h`\(\dfrac13\), \(1\), atau \(2\)` },
              ],
              answer: "A",
              explanation: h`<p>Titik sudut daerah: \(O(0,0)\), \(A(4,0)\), \(B(3,2)\), \(C(0,3)\). Nilai \(Z\) di titik-titik itu:</p>
<div class="math-display">\[ O:0,\qquad A:4a,\qquad B:3a+2,\qquad C:3 \]</div>
<p>Maksimum di lebih dari satu titik terjadi jika garis \(Z=\text{konstan}\) sejajar salah satu sisi. Sejajar \(AB\) (\(2x+y=8\)): \(a=2\), nilai \(8\) di \(A\) dan \(B\). Sejajar \(BC\) (\(\dfrac13x+y=3\)): \(a=\dfrac13\), nilai \(3\) di \(B\) dan \(C\). Untuk \(a\) lain, maksimum hanya di satu titik.</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Pada sebuah ujian terdapat 30 soal. Jawaban benar diberi skor \(4\), jawaban salah diberi skor \(-1\), dan soal tidak dijawab diberi skor \(0\). Budi memperoleh skor \(70\). Banyak soal yang dijawab Budi dengan benar paling sedikit dan paling banyak berturut-turut adalah ....</p>`,
              options: [
                { key: "A", text: h`\(17\) dan \(20\)` },
                { key: "B", text: h`\(18\) dan \(19\)` },
                { key: "C", text: h`\(19\) dan \(20\)` },
                { key: "D", text: h`\(18\) dan \(20\)` },
                { key: "E", text: h`\(17\) dan \(19\)` },
              ],
              answer: "D",
              explanation: h`<p>Misalkan benar \(b\), salah \(s\), kosong \(k\): \(b+s+k=30\) dan \(4b-s=70\). Maka:</p>
<div class="math-display">\[ s=4b-70\ge0\Rightarrow b\ge17{,}5\Rightarrow b\ge18 \]</div>
<div class="math-display">\[ k=30-b-s=100-5b\ge0\Rightarrow b\le20 \]</div>
<p>Jadi \(b\in\{18,19,20\}\): paling sedikit \(18\) dan paling banyak \(20\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
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
              prompt: h`<p>Banyak bilangan bulat \(x\) yang memenuhi \(\dfrac{3-x}{x+4}\ge0\) adalah ....</p>`,
              answer: ["7"],
              explanation: h`<p>Pembuat nol: \(x=3\) (ikut) dan \(x=-4\) (tidak ikut karena penyebut nol). Penyelesaiannya \(-4&lt;x\le3\):</p>
<div class="math-display">\[ x=-3,-2,-1,0,1,2,3 \]</div>
<p>Jadi, jawabannya adalah <strong>7</strong> bilangan bulat.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Garis \((a+1)x+(2a-1)y=15\) melalui titik potong garis \(x+2y=7\) dan garis \(3x-y=7\). Nilai \(a\) adalah ....</p>`,
              answer: ["2"],
              explanation: h`<p>Titik potong \(x+2y=7\) dan \(3x-y=7\) adalah \((3,2)\). Substitusikan ke garis pertama:</p>
<div class="math-display">\[ 3(a+1)+2(2a-1)=15\Rightarrow7a+1=15\Rightarrow a=2 \]</div>
<p>Jadi, jawabannya adalah <strong>2</strong>.</p>`,
            },
            {
              id: "isian-3",
              no: 3,
              type: "short",
              level: "sedang",
              prompt: h`<p>Jika \(x\) dan \(y\) memenuhi \(\dfrac{3}{x+1}+\dfrac{2}{y-2}=\dfrac53\) dan \(\dfrac{6}{x+1}-\dfrac{3}{y-2}=1\), maka nilai \(x+y\) adalah ....</p>`,
              answer: ["7"],
              explanation: h`<p>Misalkan \(u=\dfrac1{x+1}\) dan \(v=\dfrac1{y-2}\):</p>
<div class="math-display">\[ 3u+2v=\dfrac53,\qquad 6u-3v=1 \]</div>
<p>Dua kali persamaan pertama dikurangi persamaan kedua: \(7v=\dfrac73\Rightarrow v=\dfrac13\), lalu \(u=\dfrac13\). Maka \(x+1=3\) dan \(y-2=3\), sehingga \(x=2\), \(y=5\).</p>
<p>Jadi, jawabannya adalah \(x+y=\) <strong>7</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Diketahui bilangan real \(x,y,z\) dengan \(x+y+z=27\) dan \(\dfrac{x+y}{2}=\dfrac{y+z}{3}=\dfrac{z+x}{4}\). Nilai \(xyz\) adalah ....</p>`,
              answer: ["405"],
              explanation: h`<p>Misalkan \(x+y=2t\), \(y+z=3t\), \(z+x=4t\). Jumlahnya \(2(x+y+z)=9t\), sehingga \(t=6\).</p>
<div class="math-display">\[ x+y=12,\quad y+z=18,\quad z+x=24 \]</div>
<p>Maka \(z=27-12=15\), \(x=27-18=9\), dan \(y=27-24=3\). Jadi \(xyz=9\cdot3\cdot15=\) <strong>405</strong>.</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Seorang petani memerlukan paling sedikit \(12\) unit nitrogen dan \(20\) unit fosfor. Satu kantong pupuk P mengandung \(1\) unit nitrogen dan \(3\) unit fosfor dengan harga Rp3.000, sedangkan satu kantong pupuk Q mengandung \(2\) unit nitrogen dan \(2\) unit fosfor dengan harga Rp2.500. Biaya minimum pembelian pupuk adalah Rp ....</p>`,
              answer: ["22000", "22.000"],
              explanation: h`<p>Model: \(x+2y\ge12\), \(3x+2y\ge20\), \(x,y\ge0\), minimumkan \(Z=3.000x+2.500y\). Titik sudut dan nilai \(Z\):</p>
<div class="math-display">\[ (0,10):25.000,\qquad(12,0):36.000,\qquad(4,4):22.000 \]</div>
<p>Titik \((4,4)\) adalah perpotongan kedua garis. Jadi biaya minimumnya Rp<strong>22.000</strong>.</p>`,
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
              prompt: h`<p>Pada hari Senin, Ani membeli 5 kg jeruk dan 3 kg apel seharga Rp145.000. Pada hari Selasa, ia membeli 3 kg jeruk dan 4 kg apel seharga Rp120.000.</p>`,
              promptAfter: h`<ol type="a">
<li>Susun model matematika berupa sistem persamaan linear dua variabel.</li>
<li>Tentukan harga 1 kg jeruk dan 1 kg apel dengan metode eliminasi.</li>
<li>Jika Ani membeli 7 kg jeruk dan 6 kg apel lalu membayar dengan uang Rp250.000, berapa uang kembaliannya?</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Misalkan \(x\) harga 1 kg jeruk dan \(y\) harga 1 kg apel:</p>
<div class="math-display">\[ 5x+3y=145.000,\qquad3x+4y=120.000 \]</div>
<p><strong>(b)</strong> Kalikan persamaan pertama dengan \(3\) dan persamaan kedua dengan \(5\) untuk menyamakan koefisien \(x\):</p>
<div class="math-display">\[ 15x+9y=435.000,\qquad15x+20y=600.000 \]</div>
<p>Kurangkan: \(11y=165.000\Rightarrow y=15.000\). Maka \(x=\dfrac{145.000-45.000}{5}=20.000\). Jeruk Rp20.000 per kg dan apel Rp15.000 per kg.</p>
<p><strong>(c)</strong></p>
<div class="math-display">\[ 7(20.000)+6(15.000)=230.000,\qquad250.000-230.000=20.000 \]</div>
<p>Uang kembaliannya Rp20.000.</p>
<p class="penskoran"><em>Penskoran: Model (2 poin); eliminasi dan kedua harga (4 poin); kembalian (2 poin).</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Tentukan himpunan penyelesaian dari</p>`,
              promptAfter: h`<ol type="a">
<li>\(\dfrac{x+1}{x-2}\ge2\),</li>
<li>\(|2x-3|\ge3\),</li>
<li>kedua pertidaksamaan pada (a) dan (b) berlaku sekaligus.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong></p>
<div class="math-display">\[ \dfrac{x+1}{x-2}-2\ge0\Rightarrow\dfrac{5-x}{x-2}\ge0 \]</div>
<p>Pembuat nol: \(x=5\) (ikut) dan \(x=2\) (tidak ikut karena penyebut nol), sehingga \(2&lt;x\le5\).</p>
<p><strong>(b)</strong> \(2x-3\ge3\) atau \(2x-3\le-3\), yaitu:</p>
<div class="math-display">\[ x\ge3\quad\text{atau}\quad x\le0 \]</div>
<p><strong>(c)</strong> Irisan \(2&lt;x\le5\) dengan (\(x\le0\) atau \(x\ge3\)) adalah \(3\le x\le5\). Jadi \(\text{HP}=\{x\mid3\le x\le5\}\).</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin; (b) 3 poin; (c) 2 poin.</em></p>`,
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
              prompt: h`<p>Diketahui sistem persamaan \(x+ay=2\) dan \(ax+4y=4\).</p>`,
              promptAfter: h`<ol type="a">
<li>Tentukan nilai \(a\) agar sistem memiliki tak hingga banyak penyelesaian dan nilai \(a\) agar sistem tidak memiliki penyelesaian. Jelaskan alasannya.</li>
<li>Untuk \(a\neq\pm2\), nyatakan \(x\) dan \(y\) dalam \(a\).</li>
<li>Tentukan semua bilangan bulat \(a\) sehingga \(x\) dan \(y\) keduanya bilangan bulat.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Koefisien sebanding jika \(\dfrac1a=\dfrac{a}{4}\Rightarrow a^{2}=4\Rightarrow a=\pm2\).</p>
<p>Untuk \(a=2\): \(x+2y=2\) dan \(2x+4y=4\). Persamaan kedua sama dengan dua kali persamaan pertama, jadi ada tak hingga banyak penyelesaian.</p>
<p>Untuk \(a=-2\): \(x-2y=2\) dan \(x-2y=-2\) saling bertentangan, jadi tidak ada penyelesaian.</p>
<p><strong>(b)</strong> Kalikan persamaan pertama dengan \(a\), lalu kurangkan dari persamaan kedua:</p>
<div class="math-display">\[ (4-a^{2})y=4-2a\Rightarrow y=\dfrac{2}{a+2},\qquad x=2-ay=\dfrac{4}{a+2} \]</div>
<p><strong>(c)</strong> Agar \(x\) dan \(y\) bulat, \((a+2)\) harus membagi \(2\) dan \(4\), sehingga \(a+2\in\{-2,-1,1,2\}\). Maka \(a\in\{-4,-3,-1,0\}\), dan tidak ada yang sama dengan \(\pm2\).</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin; (b) 3 poin; (c) 2 poin.</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Sebuah toko kue membuat dua jenis kue. Satu kue A memerlukan 200 gram tepung dan 100 gram mentega, sedangkan satu kue B memerlukan 100 gram tepung dan 300 gram mentega. Persediaan yang ada adalah 4 kg tepung dan 4,5 kg mentega. Keuntungan tiap kue A Rp5.000 dan tiap kue B Rp4.000.</p>`,
              promptAfter: h`<ol type="a">
<li>Susun model matematikanya (sistem pertidaksamaan dan fungsi tujuan).</li>
<li>Tentukan titik-titik sudut daerah penyelesaiannya.</li>
<li>Tentukan banyak kue A dan kue B agar keuntungan maksimum, beserta keuntungan maksimumnya.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Misalkan \(x\) kue A dan \(y\) kue B:</p>
<div class="math-display">\[ 200x+100y\le4000\Rightarrow2x+y\le40,\qquad100x+300y\le4500\Rightarrow x+3y\le45 \]</div>
<p>Dengan \(x,y\ge0\) (bilangan cacah), maksimumkan \(Z=5.000x+4.000y\).</p>
<p><strong>(b)</strong> Titik potong kedua garis: \(y=40-2x\Rightarrow x+120-6x=45\Rightarrow x=15\), \(y=10\). Titik sudutnya:</p>
<div class="math-display">\[ (0,0),\quad(20,0),\quad(15,10),\quad(0,15) \]</div>
<figure style="margin: 1rem auto; text-align: center"> <svg viewBox="0 0 340 290" role="img" aria-label="Daerah penyelesaian segiempat dengan titik sudut (0,0), (20,0), (15,10), dan (0,15)" style="width: 100%; max-width: 380px; height: auto" font-size="13" font-family="inherit" > <polygon points="50,255 270,255 215,145 50,90" fill="#0f8b7d" fill-opacity="0.3" stroke="none" /> <line x1="39" y1="255" x2="325" y2="255" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /> <line x1="50" y1="266" x2="50" y2="24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /> <polygon points="325,255 318,251 318,259" fill="currentColor" /> <polygon points="50,24 46,31 54,31" fill="currentColor" /> <text x="331" y="260" text-anchor="start" fill="currentColor" font-style="italic" > x </text> <text x="59" y="28" text-anchor="start" fill="currentColor" font-style="italic" > y </text> <line x1="281" y1="277" x2="149" y2="13" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" /> <line x1="39" y1="86.4" x2="314" y2="178" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" /> <text x="166" y="40.5" text-anchor="start" fill="#2563eb"> 2x + y = 40 </text> <text x="270" y="195.6" text-anchor="middle" fill="#dc2626"> x + 3y = 45 </text> <circle cx="270" cy="255" r="3.5" fill="currentColor" /> <text x="270" y="273" text-anchor="middle" fill="currentColor"> (20, 0) </text> <circle cx="215" cy="145" r="3.5" fill="currentColor" /> <text x="223" y="137" text-anchor="start" fill="currentColor"> (15, 10) </text> <circle cx="50" cy="90" r="3.5" fill="currentColor" /> <text x="42" y="95" text-anchor="end" fill="currentColor"> (0, 15) </text> <text x="42" y="271" text-anchor="end" fill="currentColor">O</text> </svg> </figure>
<p><strong>(c)</strong> Nilai \(Z\) di titik-titik sudut:</p>
<div class="math-display">\[ Z=0,\quad100.000,\quad115.000,\quad60.000 \]</div>
<p>Keuntungan maksimum Rp115.000 dengan \(15\) kue A dan \(10\) kue B.</p>
<p class="penskoran"><em>Penskoran: Model (3 poin); titik sudut (3 poin); nilai maksimum dan banyak kue (2 poin).</em></p>`,
            },
            {
              id: "uraian-5",
              no: 5,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Seorang apoteker mencampur tiga larutan asam, yaitu A (kadar \(20\%\)), B (kadar \(50\%\)), dan C (kadar \(80\%\)), untuk memperoleh \(60\) liter larutan berkadar \(60\%\). Banyak larutan C yang dipakai tiga kali banyak larutan A.</p>`,
              promptAfter: h`<ol type="a">
<li>Susun sistem persamaan linear tiga variabel dari keterangan tersebut.</li>
<li>Tentukan volume masing-masing larutan.</li>
<li>Dengan syarat volume total \(60\) liter dan C tiga kali A, apakah mungkin diperoleh larutan berkadar \(75\%\)? Jelaskan.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Misalkan volume A, B, C berturut-turut \(x,y,z\) liter:</p>
<div class="math-display">\[ x+y+z=60,\qquad0{,}2x+0{,}5y+0{,}8z=0{,}6\cdot60=36,\qquad z=3x \]</div>
<p><strong>(b)</strong> Dari \(z=3x\), \(y=60-4x\). Substitusikan ke persamaan kedua (dikali \(10\)):</p>
<div class="math-display">\[ 2x+5(60-4x)+24x=360\Rightarrow6x=60\Rightarrow x=10 \]</div>
<p>Jadi A \(=10\) liter, B \(=20\) liter, dan C \(=30\) liter.</p>
<p><strong>(c)</strong> Dengan \(z=3x\) dan total \(60\) liter, banyak asam \(=0{,}6x+30\). Karena \(y=60-4x\ge0\), maka \(0\le x\le15\), sehingga asam berkisar \(30\) sampai \(39\) liter, yaitu kadar \(50\%\) sampai \(65\%\). Kadar \(75\%\) memerlukan \(x=25\) dan \(y=-40&lt;0\), jadi tidak mungkin.</p>
<p class="penskoran"><em>Penskoran: Sistem persamaan (3 poin); volume tiap larutan (3 poin); kesimpulan dengan alasan (2 poin).</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default sppl;
