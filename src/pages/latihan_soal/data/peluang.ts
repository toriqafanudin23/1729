import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Peluang.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const peluang: Material = {
  slug: "peluang",
  title: "Latihan Soal Peluang",
  topic: "Peluang",
  description:
    "Ruang sampel dan kejadian, peluang klasik dan empiris, frekuensi harapan, peluang bersyarat dan teorema Bayes, kejadian bebas, kombinatorika, serta distribusi binomial.",
  durationMinutes: 90,
  notes: [
    h`Soal disusun berjenjang dari mudah sampai sulit dan memakai bentuk yang
sejalan dengan UTBK-SNBT: pilihan ganda lima opsi, isian singkat, dan uraian
berjenjang, termasuk soal berkonteks dengan gambar, tabel data, diagram
pohon, dan diagram Venn. Soal tingkat sulit menuntut proses
<em>merumuskan</em> ruang sampel dan <em>menggunakan</em> peluang bersyarat
atau teorema Bayes.`,
    h`Skor: pilihan ganda 3 poin, isian singkat 5 poin, uraian 10 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Semua koin dan dadu dianggap seimbang, dan pengambilan bola atau kartu
dilakukan secara acak, kecuali dinyatakan lain. Rumus yang boleh dipakai:
\(P(A)=\dfrac{n(A)}{n(S)}\),
\(P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}\),
\(\dbinom nr=\dfrac{n!}{r!\,(n-r)!}\), dan \(F_h=n\cdot P(A)\).`,
    "Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan. Jawaban pecahan dituliskan dalam bentuk paling sederhana; pada isian singkat, pecahan ditulis dengan tanda / (misalnya 3/8).",
  ],
  sections: [
    {
      id: "pg",
      letter: "A",
      title: "Pilihan Ganda",
      instruction: h`15 soal \(\times\) 3 poin = 45 poin. Pilih jawaban yang paling tepat.`,
      pointsEach: 3,
      groups: [
        {
          level: "mudah",
          questions: [
            {
              id: "pg-1",
              no: 1,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Sebuah roda putar dibagi menjadi \(10\) sektor sama besar yang diberi nomor \(1\) sampai \(10\) (lihat gambar). Jika roda diputar dan jarum berhenti secara acak, peluang jarum berhenti pada sektor bernomor prima adalah ....</p>`,
              figure: h`<svg viewBox="0 0 264 264" role="img" aria-label="Roda putar dengan 10 sektor sama besar bernomor 1 sampai 10 dan sebuah jarum" style="width: 100%; max-width: 264px; height: auto" font-size="13" font-family="inherit">
<path d="M132,132 L132,32 A100,100 0 0 1 190.8,51.1 Z" fill="#0f8b7d" fill-opacity="0.18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="156.1" y="62.8" text-anchor="middle" fill="currentColor">1</text>
<path d="M132,132 L190.8,51.1 A100,100 0 0 1 227.1,101.1 Z" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="195.1" y="91.2" text-anchor="middle" fill="currentColor">2</text>
<path d="M132,132 L227.1,101.1 A100,100 0 0 1 227.1,162.9 Z" fill="#0f8b7d" fill-opacity="0.18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="210" y="137" text-anchor="middle" fill="currentColor">3</text>
<path d="M132,132 L227.1,162.9 A100,100 0 0 1 190.8,212.9 Z" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="195.1" y="182.8" text-anchor="middle" fill="currentColor">4</text>
<path d="M132,132 L190.8,212.9 A100,100 0 0 1 132,232 Z" fill="#0f8b7d" fill-opacity="0.18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="156.1" y="211.2" text-anchor="middle" fill="currentColor">5</text>
<path d="M132,132 L132,232 A100,100 0 0 1 73.2,212.9 Z" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="107.9" y="211.2" text-anchor="middle" fill="currentColor">6</text>
<path d="M132,132 L73.2,212.9 A100,100 0 0 1 36.9,162.9 Z" fill="#0f8b7d" fill-opacity="0.18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="68.9" y="182.8" text-anchor="middle" fill="currentColor">7</text>
<path d="M132,132 L36.9,162.9 A100,100 0 0 1 36.9,101.1 Z" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="54" y="137" text-anchor="middle" fill="currentColor">8</text>
<path d="M132,132 L36.9,101.1 A100,100 0 0 1 73.2,51.1 Z" fill="#0f8b7d" fill-opacity="0.18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="68.9" y="91.2" text-anchor="middle" fill="currentColor">9</text>
<path d="M132,132 L73.2,51.1 A100,100 0 0 1 132,32 Z" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
<text x="107.9" y="62.8" text-anchor="middle" fill="currentColor">10</text>
<line x1="132" y1="132" x2="183.8" y2="94.4" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
<circle cx="132" cy="132" r="4" fill="currentColor" />
</svg>`,
              options: [
                { key: "A", text: h`\(\dfrac15\)` },
                { key: "B", text: h`\(\dfrac3{10}\)` },
                { key: "C", text: h`\(\dfrac25\)` },
                { key: "D", text: h`\(\dfrac12\)` },
                { key: "E", text: h`\(\dfrac35\)` },
              ],
              answer: "C",
              explanation: h`<p>Ada \(10\) sektor sama besar. Bilangan prima: \(2,3,5,7\), yaitu \(4\) sektor.</p>
<div class="math-display">\[ P=\dfrac4{10}=\dfrac25 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Dua dadu seimbang dilempar bersamaan. Peluang jumlah kedua mata dadu paling sedikit \(9\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac5{18}\)` },
                { key: "B", text: h`\(\dfrac13\)` },
                { key: "C", text: h`\(\dfrac5{12}\)` },
                { key: "D", text: h`\(\dfrac12\)` },
                { key: "E", text: h`\(\dfrac7{12}\)` },
              ],
              answer: "A",
              explanation: h`<p>Jumlah \(9\): \(4\) cara, jumlah \(10\): \(3\) cara, jumlah \(11\): \(2\) cara, jumlah \(12\): \(1\) cara, totalnya \(10\) cara.</p>
<div class="math-display">\[ P=\dfrac{10}{36}=\dfrac5{18} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Sebuah kartu diambil acak dari kartu bernomor \(1\) sampai \(12\). Peluang terambil kartu bernomor kelipatan \(3\) atau kelipatan \(4\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac14\)` },
                { key: "B", text: h`\(\dfrac13\)` },
                { key: "C", text: h`\(\dfrac5{12}\)` },
                { key: "D", text: h`\(\dfrac12\)` },
                { key: "E", text: h`\(\dfrac7{12}\)` },
              ],
              answer: "D",
              explanation: h`<p>Kelipatan \(3\): \(3,6,9,12\) (4 kartu). Kelipatan \(4\): \(4,8,12\) (3 kartu). Irisan: \(12\) (1 kartu).</p>
<div class="math-display">\[ n(A\cup B)=4+3-1=6\Rightarrow P=\dfrac6{12}=\dfrac12 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Sebuah dadu dilempar \(50\) kali dan hasilnya dicatat pada tabel. Peluang empiris muncul mata dadu genap adalah ....</p>
<table class="tabel-data">
<thead>
<tr><th>Mata</th><th>Frekuensi</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>6</td></tr>
<tr><td>2</td><td>8</td></tr>
<tr><td>3</td><td>9</td></tr>
<tr><td>4</td><td>7</td></tr>
<tr><td>5</td><td>12</td></tr>
<tr><td>6</td><td>8</td></tr>
</tbody>
</table>`,
              options: [
                { key: "A", text: h`\(\dfrac{21}{50}\)` },
                { key: "B", text: h`\(\dfrac{23}{50}\)` },
                { key: "C", text: h`\(\dfrac12\)` },
                { key: "D", text: h`\(\dfrac{27}{50}\)` },
                { key: "E", text: h`\(\dfrac{29}{50}\)` },
              ],
              answer: "B",
              explanation: h`<p>Banyak percobaan \(=6+8+9+7+12+8=50\). Frekuensi mata genap (\(2,4,6\)) \(=8+7+8=23\).</p>
<div class="math-display">\[ P=\dfrac{23}{50} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Peluang sebuah lampu produksi suatu pabrik mengalami kerusakan adalah \(0{,}04\). Dari \(500\) lampu yang diproduksi, banyak lampu yang diharapkan tidak rusak adalah ....</p>`,
              options: [
                { key: "A", text: h`\(20\)` },
                { key: "B", text: h`\(96\)` },
                { key: "C", text: h`\(240\)` },
                { key: "D", text: h`\(460\)` },
                { key: "E", text: h`\(480\)` },
              ],
              answer: "E",
              explanation: h`<p>Peluang tidak rusak \(=1-0{,}04=0{,}96\). Frekuensi harapan:</p>
<div class="math-display">\[ 500\times0{,}96=480 \]</div>
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
              prompt: h`<p>Sebuah kotak berisi bola-bola berwarna seperti pada gambar. Tiga bola diambil sekaligus secara acak. Peluang terambil satu bola dari setiap warna adalah ....</p>`,
              figure: h`<svg viewBox="0 0 232 124" role="img" aria-label="Kotak berisi 5 bola merah, 3 bola biru, dan 2 bola kuning" style="width: 100%; max-width: 232px; height: auto" font-size="13" font-family="inherit">
<polygon points="14,110 218,110 218,14 14,14" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
<circle cx="38" cy="44" r="13" fill="#dc2626" />
<circle cx="75.2" cy="44" r="13" fill="#dc2626" />
<circle cx="112.4" cy="44" r="13" fill="#dc2626" />
<circle cx="149.6" cy="44" r="13" fill="#dc2626" />
<circle cx="186.8" cy="44" r="13" fill="#dc2626" />
<circle cx="38" cy="80" r="13" fill="#2563eb" />
<circle cx="75.2" cy="80" r="13" fill="#2563eb" />
<circle cx="112.4" cy="80" r="13" fill="#2563eb" />
<circle cx="149.6" cy="80" r="13" fill="#d9822b" />
<circle cx="186.8" cy="80" r="13" fill="#d9822b" />
</svg>`,
              options: [
                { key: "A", text: h`\(\dfrac18\)` },
                { key: "B", text: h`\(\dfrac16\)` },
                { key: "C", text: h`\(\dfrac14\)` },
                { key: "D", text: h`\(\dfrac3{10}\)` },
                { key: "E", text: h`\(\dfrac13\)` },
              ],
              answer: "C",
              explanation: h`<p>Dari gambar: \(5\) merah, \(3\) biru, \(2\) kuning.</p>
<div class="math-display">\[ n(S)=\dbinom{10}{3}=120,\qquad n(A)=5\cdot3\cdot2=30 \]</div>
<div class="math-display">\[ P=\dfrac{30}{120}=\dfrac14 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Sebuah kotak berisi \(5\) bola merah dan \(3\) bola putih. Dua bola diambil satu per satu tanpa pengembalian. Diagram pohon pada gambar menunjukkan peluang tiap pengambilan (\(M\) = merah, \(P\) = putih). Peluang kedua bola berbeda warna adalah ....</p>`,
              figure: h`<svg viewBox="0 0 297.6 270" role="img" aria-label="Diagram pohon pengambilan dua bola tanpa pengembalian dari kotak 5 merah dan 3 putih" style="width: 100%; max-width: 297.6px; height: auto" font-size="13" font-family="inherit">
<circle cx="38.4" cy="144.2" r="3" fill="currentColor" />
<line x1="38.4" y1="144.2" x2="116.6" y2="98.2" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
<text x="67.5" y="113.2" text-anchor="middle" fill="currentColor">5/8</text>
<line x1="38.4" y1="144.2" x2="116.6" y2="190.2" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
<text x="67.5" y="181.2" text-anchor="middle" fill="currentColor">3/8</text>
<line x1="116.6" y1="98.2" x2="217.8" y2="75.2" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
<text x="167.2" y="76.7" text-anchor="middle" fill="currentColor">4/7</text>
<line x1="116.6" y1="98.2" x2="217.8" y2="121.2" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
<text x="171.2" y="125.7" text-anchor="middle" fill="currentColor">3/7</text>
<line x1="116.6" y1="190.2" x2="217.8" y2="167.2" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
<text x="167.2" y="168.7" text-anchor="middle" fill="currentColor">5/7</text>
<line x1="116.6" y1="190.2" x2="217.8" y2="213.2" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
<text x="171.2" y="217.7" text-anchor="middle" fill="currentColor">2/7</text>
<circle cx="116.6" cy="98.2" r="13" fill="none" stroke="#2563eb" stroke-width="2" />
<text x="116.6" y="102.2" text-anchor="middle" fill="currentColor">M</text>
<circle cx="116.6" cy="190.2" r="13" fill="none" stroke="#2563eb" stroke-width="2" />
<text x="116.6" y="194.2" text-anchor="middle" fill="currentColor">P</text>
<circle cx="217.8" cy="75.2" r="13" fill="none" stroke="#2563eb" stroke-width="2" />
<text x="217.8" y="79.2" text-anchor="middle" fill="currentColor">M</text>
<circle cx="217.8" cy="121.2" r="13" fill="none" stroke="#2563eb" stroke-width="2" />
<text x="217.8" y="125.2" text-anchor="middle" fill="currentColor">P</text>
<circle cx="217.8" cy="167.2" r="13" fill="none" stroke="#2563eb" stroke-width="2" />
<text x="217.8" y="171.2" text-anchor="middle" fill="currentColor">M</text>
<circle cx="217.8" cy="213.2" r="13" fill="none" stroke="#2563eb" stroke-width="2" />
<text x="217.8" y="217.2" text-anchor="middle" fill="currentColor">P</text>
<text x="116.6" y="47.6" text-anchor="middle" fill="#0f8b7d">ke-1</text>
<text x="217.8" y="47.6" text-anchor="middle" fill="#0f8b7d">ke-2</text>
</svg>`,
              options: [
                { key: "A", text: h`\(\dfrac3{14}\)` },
                { key: "B", text: h`\(\dfrac5{14}\)` },
                { key: "C", text: h`\(\dfrac12\)` },
                { key: "D", text: h`\(\dfrac{15}{28}\)` },
                { key: "E", text: h`\(\dfrac9{14}\)` },
              ],
              answer: "D",
              explanation: h`<p>Berbeda warna berarti \(MP\) atau \(PM\):</p>
<div class="math-display">\[ P=\dfrac58\cdot\dfrac37+\dfrac38\cdot\dfrac57=\dfrac{15}{56}+\dfrac{15}{56}=\dfrac{30}{56}=\dfrac{15}{28} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Diagram Venn pada gambar menunjukkan persentase siswa suatu sekolah yang menyukai matematika (\(M\)) dan fisika (\(F\)). Seorang siswa dipilih secara acak. Jika diketahui siswa itu menyukai matematika, peluang ia juga menyukai fisika adalah ....</p>`,
              figure: h`<svg viewBox="0 0 288 189" role="img" aria-label="Diagram Venn: hanya M 35, M dan F 25, hanya F 15, di luar keduanya 25" style="width: 100%; max-width: 288px; height: auto" font-size="13" font-family="inherit">
<polygon points="23,166 265,166 265,23 23,23" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
<circle cx="111" cy="94.5" r="52" fill="#0f8b7d" fill-opacity="0.2" stroke="#0f8b7d" stroke-width="2.5" />
<circle cx="177" cy="94.5" r="52" fill="#dc2626" fill-opacity="0.15" stroke="#dc2626" stroke-width="2.5" />
<text x="78" y="47.8" text-anchor="middle" fill="#0f8b7d">M</text>
<text x="210" y="47.8" text-anchor="middle" fill="#dc2626">F</text>
<text x="89" y="99.5" text-anchor="middle" fill="currentColor">35</text>
<text x="144" y="99.5" text-anchor="middle" fill="currentColor">25</text>
<text x="199" y="99.5" text-anchor="middle" fill="currentColor">15</text>
<text x="240.3" y="151.8" text-anchor="middle" fill="currentColor">25</text>
</svg>`,
              options: [
                { key: "A", text: h`\(\dfrac14\)` },
                { key: "B", text: h`\(\dfrac13\)` },
                { key: "C", text: h`\(\dfrac5{12}\)` },
                { key: "D", text: h`\(\dfrac12\)` },
                { key: "E", text: h`\(\dfrac58\)` },
              ],
              answer: "C",
              explanation: h`<p>Yang menyukai matematika: \(35+25=60\). Yang menyukai matematika dan fisika: \(25\).</p>
<div class="math-display">\[ P(F\mid M)=\dfrac{25}{60}=\dfrac5{12} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Kejadian \(A\) dan \(B\) saling bebas dengan \(P(A)=0{,}4\) dan \(P(A\cup B)=0{,}7\). Nilai \(P(B)\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(0{,}30\)` },
                { key: "B", text: h`\(0{,}35\)` },
                { key: "C", text: h`\(0{,}40\)` },
                { key: "D", text: h`\(0{,}45\)` },
                { key: "E", text: h`\(0{,}50\)` },
              ],
              answer: "E",
              explanation: h`<p>Karena saling bebas, \(P(A\cup B)=P(A)+P(B)-P(A)P(B)\):</p>
<div class="math-display">\[ 0{,}7=0{,}4+P(B)-0{,}4\,P(B)=0{,}4+0{,}6\,P(B) \]</div>
<div class="math-display">\[ P(B)=\dfrac{0{,}3}{0{,}6}=0{,}5 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Sebuah dadu seimbang dilempar \(4\) kali. Peluang muncul mata \(6\) tepat dua kali adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac{25}{216}\)` },
                { key: "B", text: h`\(\dfrac5{36}\)` },
                { key: "C", text: h`\(\dfrac{25}{108}\)` },
                { key: "D", text: h`\(\dfrac{25}{72}\)` },
                { key: "E", text: h`\(\dfrac{125}{216}\)` },
              ],
              answer: "A",
              explanation: h`<p>Gunakan peluang binomial dengan \(p=\dfrac16\):</p>
<div class="math-display">\[ P=\dbinom42\left(\dfrac16\right)^{2}\left(\dfrac56\right)^{2}=6\cdot\dfrac{25}{1296}=\dfrac{150}{1296}=\dfrac{25}{216} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
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
              prompt: h`<p>Suatu penyakit diderita oleh \(10\%\) penduduk sebuah kota. Alat tes menunjukkan hasil positif pada \(90\%\) penderita, tetapi juga positif pada \(5\%\) orang yang tidak sakit. Seseorang dipilih acak dan hasil tesnya positif. Peluang ia benar-benar sakit adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac15\)` },
                { key: "B", text: h`\(\dfrac13\)` },
                { key: "C", text: h`\(\dfrac12\)` },
                { key: "D", text: h`\(\dfrac35\)` },
                { key: "E", text: h`\(\dfrac23\)` },
              ],
              answer: "E",
              explanation: h`<p>Misalkan \(S\) = sakit dan \(T\) = tes positif.</p>
<div class="math-display">\[ P(T)=0{,}1\cdot0{,}9+0{,}9\cdot0{,}05=0{,}09+0{,}045=0{,}135 \]</div>
<p>Dengan teorema Bayes:</p>
<div class="math-display">\[ P(S\mid T)=\dfrac{0{,}09}{0{,}135}=\dfrac23 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Enam orang, termasuk \(A\), \(B\), dan \(C\), duduk mengelilingi sebuah meja bundar dengan enam kursi (lihat gambar). Jika susunan duduk dilakukan secara acak, peluang \(A\), \(B\), dan \(C\) duduk berdampingan (berurutan, urutan di antara mereka bebas) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 176 176" role="img" aria-label="Enam kursi mengelilingi sebuah meja bundar" style="width: 100%; max-width: 176px; height: auto" font-size="13" font-family="inherit">
<circle cx="88" cy="88" r="30" fill="#0f8b7d" fill-opacity="0.12" stroke="#2563eb" stroke-width="2.5" />
<circle cx="88" cy="40.5" r="10" fill="#0f8b7d" fill-opacity="0.25" stroke="#2563eb" stroke-width="2.5" />
<circle cx="46.9" cy="64.2" r="10" fill="#0f8b7d" fill-opacity="0.25" stroke="#2563eb" stroke-width="2.5" />
<circle cx="46.9" cy="111.8" r="10" fill="#0f8b7d" fill-opacity="0.25" stroke="#2563eb" stroke-width="2.5" />
<circle cx="88" cy="135.5" r="10" fill="#0f8b7d" fill-opacity="0.25" stroke="#2563eb" stroke-width="2.5" />
<circle cx="129.1" cy="111.8" r="10" fill="#0f8b7d" fill-opacity="0.25" stroke="#2563eb" stroke-width="2.5" />
<circle cx="129.1" cy="64.2" r="10" fill="#0f8b7d" fill-opacity="0.25" stroke="#2563eb" stroke-width="2.5" />
</svg>`,
              options: [
                { key: "A", text: h`\(\dfrac15\)` },
                { key: "B", text: h`\(\dfrac3{10}\)` },
                { key: "C", text: h`\(\dfrac25\)` },
                { key: "D", text: h`\(\dfrac12\)` },
                { key: "E", text: h`\(\dfrac35\)` },
              ],
              answer: "B",
              explanation: h`<p>Susunan melingkar \(6\) orang: \((6-1)!=120\). Anggap \(A,B,C\) satu kelompok, sehingga ada \(4\) unit dengan \((4-1)!=6\) susunan melingkar, dan di dalam kelompok ada \(3!=6\) susunan.</p>
<div class="math-display">\[ P=\dfrac{6\cdot6}{120}=\dfrac{36}{120}=\dfrac3{10} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Dua dadu seimbang dilempar bersamaan. Nilai harapan selisih mutlak kedua mata dadu adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac53\)` },
                { key: "B", text: h`\(\dfrac74\)` },
                { key: "C", text: h`\(\dfrac{35}{18}\)` },
                { key: "D", text: h`\(2\)` },
                { key: "E", text: h`\(\dfrac73\)` },
              ],
              answer: "C",
              explanation: h`<p>Banyak pasangan dengan selisih \(0,1,2,3,4,5\) berturut-turut adalah \(6,10,8,6,4,2\):</p>
<div class="math-display">\[ 0\cdot6+1\cdot10+2\cdot8+3\cdot6+4\cdot4+5\cdot2=70 \]</div>
<div class="math-display">\[ E=\dfrac{70}{36}=\dfrac{35}{18} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Tiga bilangan berbeda dipilih secara acak dari himpunan \(\{1,2,\dots,9\}\). Peluang jumlah ketiga bilangan itu ganjil adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac{10}{21}\)` },
                { key: "B", text: h`\(\dfrac12\)` },
                { key: "C", text: h`\(\dfrac{11}{21}\)` },
                { key: "D", text: h`\(\dfrac59\)` },
                { key: "E", text: h`\(\dfrac47\)` },
              ],
              answer: "A",
              explanation: h`<p>Jumlah ganjil terjadi bila banyak bilangan ganjil yang terpilih ganjil. Ada \(5\) bilangan ganjil dan \(4\) genap. Satu ganjil dan dua genap: \(5\cdot\dbinom42=30\). Tiga ganjil: \(\dbinom53=10\).</p>
<div class="math-display">\[ P=\dfrac{40}{\dbinom93}=\dfrac{40}{84}=\dfrac{10}{21} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Dua dadu seimbang dilempar bersamaan. Jika diketahui jumlah kedua mata dadu tidak lebih dari \(7\), peluang paling sedikit satu dadu menunjukkan mata \(5\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac17\)` },
                { key: "B", text: h`\(\dfrac4{21}\)` },
                { key: "C", text: h`\(\dfrac27\)` },
                { key: "D", text: h`\(\dfrac5{21}\)` },
                { key: "E", text: h`\(\dfrac13\)` },
              ],
              answer: "B",
              explanation: h`<p>Jumlah \(\le7\): \(1+2+3+4+5+6=21\) hasil. Di antaranya yang memuat mata \(5\): \((5,1),(5,2),(1,5),(2,5)\), yaitu \(4\) hasil.</p>
<div class="math-display">\[ P=\dfrac4{21} \]</div>
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
      instruction: h`5 soal \(\times\) 5 poin = 25 poin. Ketik hanya jawaban akhir (pecahan ditulis seperti 3/8), lalu tekan
<strong>Periksa</strong> atau Enter.`,
      pointsEach: 5,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "isian-1",
              no: 1,
              type: "short",
              level: "sedang",
              prompt: h`<p>Dua dadu seimbang dilempar bersamaan. Peluang jumlah kedua mata dadu berupa bilangan prima adalah ....</p>`,
              answer: ["5/12"],
              explanation: h`<p>Jumlah prima: \(2\) (1 cara), \(3\) (2 cara), \(5\) (4 cara), \(7\) (6 cara), \(11\) (2 cara), totalnya \(15\) cara.</p>
<div class="math-display">\[ P=\dfrac{15}{36}=\dfrac5{12} \]</div>
<p>Jadi, jawabannya adalah <strong>\(\dfrac5{12}\)</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Sebuah panitia beranggotakan \(4\) orang dipilih secara acak dari \(6\) pria dan \(4\) wanita. Peluang panitia itu terdiri atas \(2\) pria dan \(2\) wanita adalah ....</p>`,
              answer: ["3/7"],
              explanation: h`<div class="math-display">\[ P=\dfrac{\dbinom62\dbinom42}{\dbinom{10}4}=\dfrac{15\cdot6}{210}=\dfrac{90}{210}=\dfrac37 \]</div>
<p>Jadi, jawabannya adalah <strong>\(\dfrac37\)</strong>.</p>`,
            },
            {
              id: "isian-3",
              no: 3,
              type: "short",
              level: "sedang",
              prompt: h`<p>Variabel acak \(X\) berdistribusi binomial dengan \(E(X)=6\) dan \(\operatorname{Var}(X)=4{,}2\). Nilai \(n\) adalah ....</p>`,
              answer: ["20"],
              explanation: h`<p>\(np=6\) dan \(np(1-p)=4{,}2\), sehingga:</p>
<div class="math-display">\[ 1-p=\dfrac{4{,}2}{6}=0{,}7\Rightarrow p=0{,}3 \]</div>
<div class="math-display">\[ n=\dfrac6{0{,}3}=20 \]</div>
<p>Jadi, jawabannya adalah <strong>20</strong>.</p>`,
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
              prompt: h`<p>Papan sasaran berbentuk tiga lingkaran sepusat dengan jari-jari \(2\) cm, \(4\) cm, dan \(6\) cm (lihat gambar). Sebuah anak panah mengenai papan secara acak. Peluang anak panah mengenai daerah yang diwarnai (di antara lingkaran berjari-jari \(2\) cm dan \(4\) cm) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 228 228" role="img" aria-label="Papan sasaran dari tiga lingkaran sepusat berjari-jari 2 cm, 4 cm, dan 6 cm; daerah di antara 2 cm dan 4 cm diwarnai" style="width: 100%; max-width: 228px; height: auto" font-size="13" font-family="inherit">
<circle cx="114" cy="114" r="90" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2" />
<path d="M54,114 A60,60 0 1 0 174,114 A60,60 0 1 0 54,114 Z M84,114 A30,30 0 1 0 144,114 A30,30 0 1 0 84,114 Z" fill-rule="evenodd" fill="#0f8b7d" fill-opacity="0.4" stroke="none" />
<circle cx="114" cy="114" r="60" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="114" cy="114" r="30" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<line x1="114" y1="114" x2="204" y2="114" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round" />
<text x="144" y="109" text-anchor="middle" fill="currentColor">2</text>
<text x="174" y="109" text-anchor="middle" fill="currentColor">4</text>
<text x="202.5" y="98" text-anchor="middle" fill="currentColor">6 cm</text>
<circle cx="114" cy="114" r="3" fill="currentColor" />
</svg>`,
              answer: ["1/3"],
              explanation: h`<p>Luas papan \(=\pi\cdot6^{2}=36\pi\). Luas daerah yang diwarnai \(=\pi\left(4^{2}-2^{2}\right)=12\pi\).</p>
<div class="math-display">\[ P=\dfrac{12\pi}{36\pi}=\dfrac13 \]</div>
<p>Jadi, jawabannya adalah <strong>\(\dfrac13\)</strong>.</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Seorang pemanah mengenai sasaran dengan peluang \(0{,}6\) pada setiap tembakan, dan tembakan-tembakan itu saling bebas. Banyak tembakan minimum agar peluang mengenai sasaran sedikitnya satu kali lebih dari \(0{,}99\) adalah ....</p>`,
              answer: ["6"],
              explanation: h`<p>Peluang sedikitnya satu kali mengenai \(=1-(0{,}4)^{n}&gt;0{,}99\), yaitu \((0{,}4)^{n}&lt;0{,}01\).</p>
<p>Karena \((0{,}4)^{5}=0{,}01024&gt;0{,}01\) dan \((0{,}4)^{6}=0{,}004096&lt;0{,}01\), maka \(n\) minimum \(=\) <strong>6</strong>.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: "uraian",
      letter: "C",
      title: "Uraian (Essay)",
      instruction: h`3 soal \(\times\) 10 poin = 30 poin. Tuliskan langkah penyelesaian dengan
lengkap di buku atau kertas, lalu bandingkan dengan pembahasan dan pedoman
penskoran.`,
      pointsEach: 10,
      groups: [
        {
          level: "sedang",
          questions: [
            {
              id: "uraian-1",
              no: 1,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Kotak I berisi \(4\) bola merah dan \(3\) bola putih, sedangkan kotak II berisi \(2\) bola merah dan \(5\) bola putih (lihat gambar). Sebuah koin seimbang dilempar: jika muncul gambar, diambil satu bola dari kotak I; jika muncul angka, diambil satu bola dari kotak II.</p>`,
              figure: h`<svg viewBox="0 0 331.2 124.8" role="img" aria-label="Kotak I berisi 4 bola merah dan 3 bola putih; kotak II berisi 2 bola merah dan 5 bola putih" style="width: 100%; max-width: 331.2px; height: auto" font-size="13" font-family="inherit">
<polygon points="12,84 151.2,84 151.2,16.8 12,16.8" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
<polygon points="175.2,84 314.4,84 314.4,16.8 175.2,16.8" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
<circle cx="31.2" cy="36" r="10" fill="#dc2626" />
<circle cx="55.2" cy="36" r="10" fill="#dc2626" />
<circle cx="79.2" cy="36" r="10" fill="#dc2626" />
<circle cx="103.2" cy="36" r="10" fill="#dc2626" />
<circle cx="31.2" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="55.2" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="79.2" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="194.4" cy="36" r="10" fill="#dc2626" />
<circle cx="218.4" cy="36" r="10" fill="#dc2626" />
<circle cx="194.4" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="218.4" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="242.4" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="266.4" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<circle cx="290.4" cy="64.8" r="10" fill="none" fill-opacity="1" stroke="currentColor" stroke-width="2" />
<text x="81.6" y="104" text-anchor="middle" fill="currentColor">Kotak I</text>
<text x="244.8" y="104" text-anchor="middle" fill="currentColor">Kotak II</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Tentukan peluang bola yang terambil berwarna merah.</li>
<li>Jika bola yang terambil berwarna putih, tentukan peluang bola itu berasal dari kotak I.</li>
<li>Dua bola diambil sekaligus dari kotak I. Tentukan peluang keduanya sewarna.</li>
<li>Dua bola diambil satu per satu tanpa pengembalian dari kotak II. Tentukan peluang keduanya putih.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong></p>
<div class="math-display">\[ P(M)=\dfrac12\cdot\dfrac47+\dfrac12\cdot\dfrac27=\dfrac27+\dfrac17=\dfrac37 \]</div>
<p><strong>(b)</strong> \(P(\text{putih})=1-\dfrac37=\dfrac47\) dan \(P(\text{I}\cap\text{putih})=\dfrac12\cdot\dfrac37=\dfrac3{14}\). Maka:</p>
<div class="math-display">\[ P(\text{I}\mid\text{putih})=\dfrac{3/14}{4/7}=\dfrac38 \]</div>
<p><strong>(c)</strong> \(n(S)=\dbinom72=21\). Sewarna: \(\dbinom42+\dbinom32=6+3=9\). Maka \(P=\dfrac9{21}=\dfrac37\).</p>
<p><strong>(d)</strong></p>
<div class="math-display">\[ P=\dfrac57\cdot\dfrac46=\dfrac{20}{42}=\dfrac{10}{21} \]</div>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin; (b) 3 poin; (c) 2 poin; (d) 2 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Dua dadu seimbang dilempar bersamaan. Misalkan \(A\) adalah kejadian jumlah kedua mata dadu sama dengan \(8\) dan \(B\) adalah kejadian kedua mata dadu genap. Pada gambar, ke-\(36\) hasil yang mungkin ditunjukkan sebagai titik, titik hijau menandai kejadian \(B\), dan lingkaran merah menandai kejadian \(A\).</p>`,
              figure: h`<svg viewBox="0 0 292 292" role="img" aria-label="Dua puluh enam titik hasil lemparan dua dadu; titik hijau menandai kedua mata genap dan lingkaran merah menandai jumlah 8" style="width: 100%; max-width: 292px; height: auto" font-size="13" font-family="inherit">
<line x1="66" y1="242" x2="66" y2="50" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<line x1="50" y1="226" x2="242" y2="226" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<text x="66" y="260" text-anchor="middle" fill="currentColor">1</text>
<text x="42" y="230" text-anchor="end" fill="currentColor">1</text>
<line x1="98" y1="242" x2="98" y2="50" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<line x1="50" y1="194" x2="242" y2="194" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<text x="98" y="260" text-anchor="middle" fill="currentColor">2</text>
<text x="42" y="198" text-anchor="end" fill="currentColor">2</text>
<line x1="130" y1="242" x2="130" y2="50" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<line x1="50" y1="162" x2="242" y2="162" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<text x="130" y="260" text-anchor="middle" fill="currentColor">3</text>
<text x="42" y="166" text-anchor="end" fill="currentColor">3</text>
<line x1="162" y1="242" x2="162" y2="50" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<line x1="50" y1="130" x2="242" y2="130" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<text x="162" y="260" text-anchor="middle" fill="currentColor">4</text>
<text x="42" y="134" text-anchor="end" fill="currentColor">4</text>
<line x1="194" y1="242" x2="194" y2="50" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<line x1="50" y1="98" x2="242" y2="98" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<text x="194" y="260" text-anchor="middle" fill="currentColor">5</text>
<text x="42" y="102" text-anchor="end" fill="currentColor">5</text>
<line x1="226" y1="242" x2="226" y2="50" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<line x1="50" y1="66" x2="242" y2="66" stroke="#9ca3af" stroke-width="0.8" stroke-linecap="round" />
<text x="226" y="260" text-anchor="middle" fill="currentColor">6</text>
<text x="42" y="70" text-anchor="end" fill="currentColor">6</text>
<circle cx="66" cy="226" r="3" fill="#9ca3af" />
<circle cx="66" cy="194" r="3" fill="#9ca3af" />
<circle cx="66" cy="162" r="3" fill="#9ca3af" />
<circle cx="66" cy="130" r="3" fill="#9ca3af" />
<circle cx="66" cy="98" r="3" fill="#9ca3af" />
<circle cx="66" cy="66" r="3" fill="#9ca3af" />
<circle cx="98" cy="226" r="3" fill="#9ca3af" />
<circle cx="98" cy="194" r="3" fill="#9ca3af" />
<circle cx="98" cy="194" r="6.5" fill="#0f8b7d" />
<circle cx="98" cy="162" r="3" fill="#9ca3af" />
<circle cx="98" cy="130" r="3" fill="#9ca3af" />
<circle cx="98" cy="130" r="6.5" fill="#0f8b7d" />
<circle cx="98" cy="98" r="3" fill="#9ca3af" />
<circle cx="98" cy="66" r="3" fill="#9ca3af" />
<circle cx="98" cy="66" r="6.5" fill="#0f8b7d" />
<circle cx="98" cy="66" r="11" fill="none" fill-opacity="1" stroke="#dc2626" stroke-width="2" />
<circle cx="130" cy="226" r="3" fill="#9ca3af" />
<circle cx="130" cy="194" r="3" fill="#9ca3af" />
<circle cx="130" cy="162" r="3" fill="#9ca3af" />
<circle cx="130" cy="130" r="3" fill="#9ca3af" />
<circle cx="130" cy="98" r="3" fill="#9ca3af" />
<circle cx="130" cy="98" r="11" fill="none" fill-opacity="1" stroke="#dc2626" stroke-width="2" />
<circle cx="130" cy="66" r="3" fill="#9ca3af" />
<circle cx="162" cy="226" r="3" fill="#9ca3af" />
<circle cx="162" cy="194" r="3" fill="#9ca3af" />
<circle cx="162" cy="194" r="6.5" fill="#0f8b7d" />
<circle cx="162" cy="162" r="3" fill="#9ca3af" />
<circle cx="162" cy="130" r="3" fill="#9ca3af" />
<circle cx="162" cy="130" r="6.5" fill="#0f8b7d" />
<circle cx="162" cy="130" r="11" fill="none" fill-opacity="1" stroke="#dc2626" stroke-width="2" />
<circle cx="162" cy="98" r="3" fill="#9ca3af" />
<circle cx="162" cy="66" r="3" fill="#9ca3af" />
<circle cx="162" cy="66" r="6.5" fill="#0f8b7d" />
<circle cx="194" cy="226" r="3" fill="#9ca3af" />
<circle cx="194" cy="194" r="3" fill="#9ca3af" />
<circle cx="194" cy="162" r="3" fill="#9ca3af" />
<circle cx="194" cy="162" r="11" fill="none" fill-opacity="1" stroke="#dc2626" stroke-width="2" />
<circle cx="194" cy="130" r="3" fill="#9ca3af" />
<circle cx="194" cy="98" r="3" fill="#9ca3af" />
<circle cx="194" cy="66" r="3" fill="#9ca3af" />
<circle cx="226" cy="226" r="3" fill="#9ca3af" />
<circle cx="226" cy="194" r="3" fill="#9ca3af" />
<circle cx="226" cy="194" r="6.5" fill="#0f8b7d" />
<circle cx="226" cy="194" r="11" fill="none" fill-opacity="1" stroke="#dc2626" stroke-width="2" />
<circle cx="226" cy="162" r="3" fill="#9ca3af" />
<circle cx="226" cy="130" r="3" fill="#9ca3af" />
<circle cx="226" cy="130" r="6.5" fill="#0f8b7d" />
<circle cx="226" cy="98" r="3" fill="#9ca3af" />
<circle cx="226" cy="66" r="3" fill="#9ca3af" />
<circle cx="226" cy="66" r="6.5" fill="#0f8b7d" />
<text x="146" y="280" text-anchor="middle" fill="currentColor">Dadu I</text>
<text x="28" y="142" text-anchor="end" fill="currentColor">Dadu II</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Tentukan \(n(S)\), \(n(A)\), dan \(n(B)\).</li>
<li>Tentukan \(P(A\cup B)\).</li>
<li>Tentukan \(P(B\mid A)\).</li>
<li>Apakah \(A\) dan \(B\) saling bebas? Jelaskan.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> \(n(S)=36\). \(A=\{(2,6),(3,5),(4,4),(5,3),(6,2)\}\), sehingga \(n(A)=5\). Kedua mata genap, masing-masing dari \(\{2,4,6\}\), sehingga \(n(B)=3\cdot3=9\).</p>
<p><strong>(b)</strong> \(A\cap B=\{(2,6),(4,4),(6,2)\}\), sehingga \(n(A\cap B)=3\). Maka:</p>
<div class="math-display">\[ n(A\cup B)=5+9-3=11\Rightarrow P(A\cup B)=\dfrac{11}{36} \]</div>
<p><strong>(c)</strong></p>
<div class="math-display">\[ P(B\mid A)=\dfrac{n(A\cap B)}{n(A)}=\dfrac35 \]</div>
<p><strong>(d)</strong> \(P(B)=\dfrac9{36}=\dfrac14\neq\dfrac35=P(B\mid A)\). (Atau: \(P(A\cap B)=\dfrac3{36}=\dfrac{12}{144}\), sedangkan \(P(A)P(B)=\dfrac5{36}\cdot\dfrac14=\dfrac5{144}\).) Karena tidak sama, \(A\) dan \(B\) <strong>tidak saling bebas</strong>.</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin (masing-masing 1 poin); (b) 3 poin; (c) 2 poin; (d) 2 poin.</em></p>`,
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
              prompt: h`<ol type="a">
<li>Buktikan bahwa jika kejadian \(A\) dan \(B\) saling bebas, maka \(A\) dan \(B^{c}\) juga saling bebas.</li>
<li>Dua penembak, \(A\) dan \(B\), menembak sasaran secara serentak dan saling bebas. Peluang \(A\) mengenai sasaran adalah \(0{,}8\) dan peluang \(B\) mengenai sasaran adalah \(0{,}7\). Tentukan peluang bahwa (i) tepat satu penembak mengenai sasaran, dan (ii) sedikitnya satu penembak mengenai sasaran.</li>
<li>Jika \(B\) menembak \(4\) kali secara bebas, tentukan peluang \(B\) mengenai sasaran tepat \(3\) kali.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Karena \(A=(A\cap B)\cup(A\cap B^{c})\) dengan kedua bagian saling lepas, maka \(P(A\cap B^{c})=P(A)-P(A\cap B)\). Karena \(A\) dan \(B\) saling bebas, \(P(A\cap B)=P(A)P(B)\), sehingga:</p>
<div class="math-display">\[ P(A\cap B^{c})=P(A)-P(A)P(B)=P(A)\left[1-P(B)\right]=P(A)P(B^{c}) \]</div>
<p>Jadi \(A\) dan \(B^{c}\) saling bebas.</p>
<p><strong>(b)</strong> (i) Tepat satu mengenai: \(0{,}8\cdot0{,}3+0{,}2\cdot0{,}7=0{,}24+0{,}14=0{,}38\). (ii) Sedikitnya satu mengenai: \(1-P(\text{keduanya meleset})=1-0{,}2\cdot0{,}3=1-0{,}06=0{,}94\).</p>
<p><strong>(c)</strong></p>
<div class="math-display">\[ P=\dbinom43(0{,}7)^{3}(0{,}3)=4\cdot0{,}343\cdot0{,}3=0{,}4116 \]</div>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin; (b) 4 poin (masing-masing 2 poin); (c) 3 poin (rumus binomial 2 poin, hasil 1 poin).</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default peluang;
