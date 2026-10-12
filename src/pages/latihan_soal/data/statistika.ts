import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Statistika.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const statistika: Material = {
  slug: "statistika",
  title: "Latihan Soal Statistika",
  topic: "Statistika",
  description:
    "Ukuran pemusatan dan penyebaran data, data berkelompok, histogram dan diagram, serta penalaran dan penafsiran data.",
  durationMinutes: 120,
  notes: [
    h`Soal disusun berjenjang dari mudah sampai HOTS dan sebagian bergaya
UTBK-SNBT: pilihan ganda lima opsi serta soal berkonteks dengan tabel,
diagram, atau histogram. Soal HOTS menuntut proses <em>merumuskan</em>,
<em>menggunakan</em>, dan <em>menafsirkan</em> data.`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Notasi: \(\bar{x}\) rata-rata (mean), \(\mathrm{Me}\) median,
\(\mathrm{Mo}\) modus, \(n\) banyak data, \(f\) frekuensi, \(t_b\) tepi
bawah kelas, \(p\) panjang kelas. Pada data berkelompok, kelas bernilai
bulat memiliki tepi bawah \(=\) batas bawah \(-0{,}5\).`,
    "Bilangan desimal ditulis dengan tanda koma. Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan.",
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
              prompt: h`<p>Banyak buku yang dibaca delapan siswa selama liburan adalah \(4,6,5,8,7,6,9,5\). Rata-rata banyak buku yang dibaca adalah ....</p>`,
              options: [
                { key: "A", text: h`\(6\)` },
                { key: "B", text: h`\(6{,}25\)` },
                { key: "C", text: h`\(6{,}5\)` },
                { key: "D", text: h`\(6{,}75\)` },
                { key: "E", text: h`\(7\)` },
              ],
              answer: "B",
              explanation: h`<div class="math-display">\[ \bar{x}=\dfrac{4+6+5+8+7+6+9+5}{8}=\dfrac{50}{8}=6{,}25 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Banyak pengunjung sebuah perpustakaan selama delapan hari berturut-turut adalah \(14,9,21,11,17,12,8,16\) orang. Median data tersebut adalah ....</p>`,
              options: [
                { key: "A", text: h`\(12\)` },
                { key: "B", text: h`\(12{,}5\)` },
                { key: "C", text: h`\(13\)` },
                { key: "D", text: h`\(13{,}5\)` },
                { key: "E", text: h`\(14\)` },
              ],
              answer: "C",
              explanation: h`<p>Urutkan data: \(8,9,11,12,14,16,17,21\). Karena \(n=8\) (genap), median adalah rata-rata data ke-4 dan ke-5:</p>
<div class="math-display">\[ \mathrm{Me}=\dfrac{12+14}{2}=13 \]</div>
<p>Nilai \(13{,}5\) adalah rata-rata data (bukan median).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Diagram batang pada gambar menunjukkan nilai ulangan matematika \(20\) siswa. Rata-rata nilai ulangan tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 340 240" role="img" aria-label="Diagram batang: nilai 5, 6, 7, 8, 9 berturut-turut berfrekuensi 2, 5, 8, 3, 2" style="width: 100%; max-width: 340px; height: auto" font-size="12" font-family="inherit">
<line x1="50" y1="160" x2="315" y2="160" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="120" x2="315" y2="120" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="80" x2="315" y2="80" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="40" x2="315" y2="40" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="44" y="164" text-anchor="end" fill="currentColor" font-size="11">2</text>
<text x="44" y="124" text-anchor="end" fill="currentColor" font-size="11">4</text>
<text x="44" y="84" text-anchor="end" fill="currentColor" font-size="11">6</text>
<text x="44" y="44" text-anchor="end" fill="currentColor" font-size="11">8</text>
<rect x="75" y="160" width="30" height="40" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="125" y="100" width="30" height="100" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="175" y="40" width="30" height="160" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="225" y="140" width="30" height="60" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="275" y="160" width="30" height="40" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<text x="90" y="155" text-anchor="middle" fill="currentColor">2</text>
<text x="140" y="95" text-anchor="middle" fill="currentColor">5</text>
<text x="190" y="35" text-anchor="middle" fill="currentColor">8</text>
<text x="240" y="135" text-anchor="middle" fill="currentColor">3</text>
<text x="290" y="155" text-anchor="middle" fill="currentColor">2</text>
<text x="90" y="218" text-anchor="middle" fill="currentColor">5</text>
<text x="140" y="218" text-anchor="middle" fill="currentColor">6</text>
<text x="190" y="218" text-anchor="middle" fill="currentColor">7</text>
<text x="240" y="218" text-anchor="middle" fill="currentColor">8</text>
<text x="290" y="218" text-anchor="middle" fill="currentColor">9</text>
<line x1="50" y1="200" x2="320" y2="200" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="50" y1="200" x2="50" y2="25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="320,200 313,196 313,204" fill="currentColor" />
<polygon points="50,25 46,32 54,32" fill="currentColor" />
<text x="326" y="204" fill="currentColor" font-style="italic">nilai</text>
<text x="58" y="30" fill="currentColor" font-style="italic">f</text>
</svg>`,
              options: [
                { key: "A", text: h`\(6{,}6\)` },
                { key: "B", text: h`\(6{,}7\)` },
                { key: "C", text: h`\(6{,}8\)` },
                { key: "D", text: h`\(6{,}9\)` },
                { key: "E", text: h`\(7{,}0\)` },
              ],
              answer: "D",
              explanation: h`<p>Nilai \(5,6,7,8,9\) berfrekuensi \(2,5,8,3,2\), sehingga \(\sum f=20\) dan:</p>
<div class="math-display">\[ \sum fx=10+30+56+24+18=138,\qquad \bar{x}=\dfrac{138}{20}=6{,}9 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Diagram lingkaran pada gambar menunjukkan ekstrakurikuler pilihan \(240\) siswa. Banyak siswa yang memilih ekstrakurikuler yang paling diminati (modus) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 320 250" role="img" aria-label="Diagram lingkaran: Futsal 108 derajat, Basket 72 derajat, Pramuka 90 derajat, PMR 54 derajat, Paskibra 36 derajat" style="width: 100%; max-width: 320px; height: auto" font-size="12" font-family="inherit">
<path d="M160,125 L230,125 A70,70 0 0 0 138.4,58.4 Z" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" stroke-width="1.5" />
<path d="M160,125 L138.4,58.4 A70,70 0 0 0 90,125 Z" fill="#1f3a5f" fill-opacity="0.35" stroke="#1f3a5f" stroke-width="1.5" />
<path d="M160,125 L90,125 A70,70 0 0 0 160,195 Z" fill="#d9822b" fill-opacity="0.35" stroke="#d9822b" stroke-width="1.5" />
<path d="M160,125 L160,195 A70,70 0 0 0 216.6,166.1 Z" fill="#b03a2e" fill-opacity="0.35" stroke="#b03a2e" stroke-width="1.5" />
<path d="M160,125 L216.6,166.1 A70,70 0 0 0 230,125 Z" fill="#6c4ab6" fill-opacity="0.35" stroke="#6c4ab6" stroke-width="1.5" />
<text x="219" y="38" text-anchor="middle" fill="currentColor">Futsal</text>
<text x="219" y="52" text-anchor="middle" fill="currentColor">108°</text>
<text x="76" y="62" text-anchor="middle" fill="currentColor">Basket</text>
<text x="76" y="76" text-anchor="middle" fill="currentColor">72°</text>
<text x="70" y="200" text-anchor="middle" fill="currentColor">Pramuka</text>
<text x="70" y="214" text-anchor="middle" fill="currentColor">90°</text>
<text x="205" y="226" text-anchor="middle" fill="currentColor">PMR</text>
<text x="205" y="240" text-anchor="middle" fill="currentColor">54°</text>
<text x="268" y="152" text-anchor="middle" fill="currentColor">Paskibra</text>
<text x="268" y="166" text-anchor="middle" fill="currentColor">36°</text>
</svg>`,
              options: [
                { key: "A", text: h`\(72\)` },
                { key: "B", text: h`\(80\)` },
                { key: "C", text: h`\(90\)` },
                { key: "D", text: h`\(108\)` },
                { key: "E", text: h`\(120\)` },
              ],
              answer: "A",
              explanation: h`<p>Modus adalah kategori terbanyak, yaitu sektor dengan sudut terbesar (futsal, \(108^\circ\)):</p>
<div class="math-display">\[ \dfrac{108}{360}\times240=72\ \text{siswa} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Rata-rata nilai ulangan \(5\) siswa adalah \(78\). Setelah seorang siswa susulan mengikuti ulangan, rata-rata nilai keenam siswa menjadi \(80\). Nilai siswa susulan tersebut adalah ....</p>`,
              options: [
                { key: "A", text: h`\(82\)` },
                { key: "B", text: h`\(84\)` },
                { key: "C", text: h`\(86\)` },
                { key: "D", text: h`\(88\)` },
                { key: "E", text: h`\(90\)` },
              ],
              answer: "E",
              explanation: h`<p>Jumlah nilai enam siswa \(=6\cdot80=480\) dan jumlah nilai lima siswa \(=5\cdot78=390\):</p>
<div class="math-display">\[ 480-390=90 \]</div>
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
              prompt: h`<p>Suatu data berkelompok yang sebarannya tidak terlalu condong memiliki rata-rata \(58\) dan median \(56\). Dengan hampiran \(\mathrm{Mo}\approx3\,\mathrm{Me}-2\,\bar{x}\), modus data tersebut kira-kira ....</p>`,
              options: [
                { key: "A", text: h`\(46\)` },
                { key: "B", text: h`\(48\)` },
                { key: "C", text: h`\(50\)` },
                { key: "D", text: h`\(52\)` },
                { key: "E", text: h`\(54\)` },
              ],
              answer: "D",
              explanation: h`<div class="math-display">\[ \mathrm{Mo}\approx3\,\mathrm{Me}-2\,\bar{x}=3(56)-2(58)=168-116=52 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Nilai ujian sejumlah siswa memiliki rata-rata \(56\), median \(52\), dan modus \(48\). Setiap nilai \(x\) diubah menjadi \(y=1{,}5x+4\). Selisih rata-rata dan modus nilai yang baru adalah ....</p>`,
              options: [
                { key: "A", text: h`\(8\)` },
                { key: "B", text: h`\(10\)` },
                { key: "C", text: h`\(12\)` },
                { key: "D", text: h`\(14\)` },
                { key: "E", text: h`\(16\)` },
              ],
              answer: "C",
              explanation: h`<p>Rata-rata dan modus yang baru adalah \(1{,}5\bar{x}+4\) dan \(1{,}5\,\mathrm{Mo}+4\). Selisihnya:</p>
<div class="math-display">\[ 1{,}5(56-48)=12 \]</div>
<p>Konstanta \(4\) saling meniadakan, tetapi pengali \(1{,}5\) ikut mengalikan selisih (jawaban \(8\) adalah jebakan karena lupa pengali).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Histogram pada gambar menunjukkan waktu tempuh (menit) \(40\) siswa dari rumah ke sekolah. Modus data tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 340 240" role="img" aria-label="Histogram waktu tempuh dengan tepi kelas 19,5; 24,5; 29,5; 34,5; 39,5; 44,5 dan frekuensi 4, 8, 14, 10, 4" style="width: 100%; max-width: 340px; height: auto" font-size="12" font-family="inherit">
<line x1="50" y1="150" x2="305" y2="150" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="100" x2="305" y2="100" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="50" x2="305" y2="50" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="44" y="154" text-anchor="end" fill="currentColor" font-size="11">5</text>
<text x="44" y="104" text-anchor="end" fill="currentColor" font-size="11">10</text>
<text x="44" y="54" text-anchor="end" fill="currentColor" font-size="11">15</text>
<rect x="50" y="160" width="50" height="40" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="100" y="120" width="50" height="80" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="150" y="60" width="50" height="140" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="200" y="100" width="50" height="100" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="250" y="160" width="50" height="40" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<text x="75" y="155" text-anchor="middle" fill="currentColor">4</text>
<text x="125" y="115" text-anchor="middle" fill="currentColor">8</text>
<text x="175" y="55" text-anchor="middle" fill="currentColor">14</text>
<text x="225" y="95" text-anchor="middle" fill="currentColor">10</text>
<text x="275" y="155" text-anchor="middle" fill="currentColor">4</text>
<text x="50" y="218" text-anchor="middle" fill="currentColor" font-size="11">19,5</text>
<text x="100" y="218" text-anchor="middle" fill="currentColor" font-size="11">24,5</text>
<text x="150" y="218" text-anchor="middle" fill="currentColor" font-size="11">29,5</text>
<text x="200" y="218" text-anchor="middle" fill="currentColor" font-size="11">34,5</text>
<text x="250" y="218" text-anchor="middle" fill="currentColor" font-size="11">39,5</text>
<text x="300" y="218" text-anchor="middle" fill="currentColor" font-size="11">44,5</text>
<line x1="50" y1="200" x2="322" y2="200" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="50" y1="200" x2="50" y2="30" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="322,200 315,196 315,204" fill="currentColor" />
<polygon points="50,30 46,37 54,37" fill="currentColor" />
<text x="326" y="190" fill="currentColor" font-style="italic">menit</text>
<text x="58" y="35" fill="currentColor" font-style="italic">f</text>
</svg>`,
              options: [
                { key: "A", text: h`\(32\)` },
                { key: "B", text: h`\(32{,}5\)` },
                { key: "C", text: h`\(33\)` },
                { key: "D", text: h`\(33{,}5\)` },
                { key: "E", text: h`\(34\)` },
              ],
              answer: "B",
              explanation: h`<p>Frekuensi kelas: \(4,8,14,10,4\). Kelas modus adalah kelas ketiga dengan \(t_b=29{,}5\), \(d_1=14-8=6\), \(d_2=14-10=4\), \(p=5\):</p>
<div class="math-display">\[ \mathrm{Mo}=29{,}5+\dfrac{6}{6+4}\cdot5=32{,}5 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Tabel berikut menyajikan berat badan \(40\) siswa. Median berat badan tersebut adalah ....</p>
    <table class="tabel-data">
      <thead><tr><th>Berat (kg)</th><th>Frekuensi</th></tr></thead>
      <tbody>
        <tr><td>\(45\)–\(49\)</td><td>\(6\)</td></tr>
        <tr><td>\(50\)–\(54\)</td><td>\(9\)</td></tr>
        <tr><td>\(55\)–\(59\)</td><td>\(10\)</td></tr>
        <tr><td>\(60\)–\(64\)</td><td>\(8\)</td></tr>
        <tr><td>\(65\)–\(69\)</td><td>\(7\)</td></tr>
      </tbody>
    </table>`,
              options: [
                { key: "A", text: h`\(55\)` },
                { key: "B", text: h`\(55{,}5\)` },
                { key: "C", text: h`\(56\)` },
                { key: "D", text: h`\(56{,}5\)` },
                { key: "E", text: h`\(57\)` },
              ],
              answer: "E",
              explanation: h`<p>\(n=40\), sehingga \(\dfrac n2=20\). Frekuensi kumulatif \(6,15,25\), jadi kelas median adalah \(55\)–\(59\) dengan \(t_b=54{,}5\), \(F_s=15\), \(f=10\), \(p=5\):</p>
<div class="math-display">\[ \mathrm{Me}=54{,}5+\dfrac{20-15}{10}\cdot5=57 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Tinggi tanaman kacang diukur dengan ketelitian \(0{,}1\) cm dan disajikan dalam tabel distribusi frekuensi. Salah satu kelasnya adalah \(14{,}5\)–\(16{,}4\). Tepi bawah dan panjang kelas tersebut berturut-turut adalah ....</p>`,
              options: [
                { key: "A", text: h`\(14{,}45\) dan \(2{,}0\)` },
                { key: "B", text: h`\(14{,}45\) dan \(1{,}9\)` },
                { key: "C", text: h`\(14{,}5\) dan \(1{,}9\)` },
                { key: "D", text: h`\(14{,}5\) dan \(2{,}0\)` },
                { key: "E", text: h`\(14{,}4\) dan \(2{,}0\)` },
              ],
              answer: "A",
              explanation: h`<p>Data diukur sampai \(0{,}1\), sehingga setengah satuan ukur \(=0{,}05\):</p>
<div class="math-display">\[ t_b=14{,}5-0{,}05=14{,}45,\qquad t_a=16{,}4+0{,}05=16{,}45 \]</div>
<p>Panjang kelas \(p=16{,}45-14{,}45=2{,}0\) (bukan \(16{,}4-14{,}5=1{,}9\)).</p>
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
              prompt: h`<p>Rata-rata nilai \(30\) siswa dicatat \(65\). Setelah diperiksa, ternyata nilai \(84\) tertulis \(48\) dan nilai \(70\) tertulis \(79\). Rata-rata nilai yang sebenarnya adalah ....</p>`,
              options: [
                { key: "A", text: h`\(65{,}3\)` },
                { key: "B", text: h`\(65{,}6\)` },
                { key: "C", text: h`\(65{,}9\)` },
                { key: "D", text: h`\(66{,}2\)` },
                { key: "E", text: h`\(66{,}5\)` },
              ],
              answer: "C",
              explanation: h`<p>Nilai \(84\) tertulis \(48\), sehingga jumlah kurang \(36\). Nilai \(70\) tertulis \(79\), sehingga jumlah lebih \(9\). Jumlah yang benar bertambah \(36-9=27\):</p>
<div class="math-display">\[ \bar{x}=65+\dfrac{27}{30}=65{,}9 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Ogive “kurang dari” pada gambar menyajikan nilai ulangan \(50\) siswa. Median data tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 380 250" role="img" aria-label="Ogive kurang dari: tepi 19,5 sampai 69,5 dengan frekuensi kumulatif 0, 6, 16, 34, 44, 50" style="width: 100%; max-width: 380px; height: auto" font-size="12" font-family="inherit">
<line x1="50" y1="174" x2="330" y2="174" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="138" x2="330" y2="138" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="102" x2="330" y2="102" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="66" x2="330" y2="66" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="30" x2="330" y2="30" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="44" y="178" text-anchor="end" fill="currentColor" font-size="11">10</text>
<text x="44" y="142" text-anchor="end" fill="currentColor" font-size="11">20</text>
<text x="44" y="106" text-anchor="end" fill="currentColor" font-size="11">30</text>
<text x="44" y="70" text-anchor="end" fill="currentColor" font-size="11">40</text>
<text x="44" y="34" text-anchor="end" fill="currentColor" font-size="11">50</text>
<polyline points="50,210 105,188.4 160,152.4 215,87.6 270,51.6 325,30" fill="none" stroke="#0f8b7d" stroke-width="2.5" stroke-linejoin="round" />
<circle cx="50" cy="210" r="3.5" fill="#0f8b7d" />
<circle cx="105" cy="188.4" r="3.5" fill="#0f8b7d" />
<circle cx="160" cy="152.4" r="3.5" fill="#0f8b7d" />
<circle cx="215" cy="87.6" r="3.5" fill="#0f8b7d" />
<circle cx="270" cy="51.6" r="3.5" fill="#0f8b7d" />
<circle cx="325" cy="30" r="3.5" fill="#0f8b7d" />
<text x="99" y="182" text-anchor="end" fill="currentColor" font-size="11">6</text>
<text x="154" y="146" text-anchor="end" fill="currentColor" font-size="11">16</text>
<text x="209" y="82" text-anchor="end" fill="currentColor" font-size="11">34</text>
<text x="264" y="46" text-anchor="end" fill="currentColor" font-size="11">44</text>
<text x="319" y="24" text-anchor="end" fill="currentColor" font-size="11">50</text>
<text x="50" y="228" text-anchor="middle" fill="currentColor" font-size="11">19,5</text>
<text x="105" y="228" text-anchor="middle" fill="currentColor" font-size="11">29,5</text>
<text x="160" y="228" text-anchor="middle" fill="currentColor" font-size="11">39,5</text>
<text x="215" y="228" text-anchor="middle" fill="currentColor" font-size="11">49,5</text>
<text x="270" y="228" text-anchor="middle" fill="currentColor" font-size="11">59,5</text>
<text x="325" y="228" text-anchor="middle" fill="currentColor" font-size="11">69,5</text>
<line x1="50" y1="210" x2="350" y2="210" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="50" y1="210" x2="50" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="350,210 343,206 343,214" fill="currentColor" />
<polygon points="50,12 46,19 54,19" fill="currentColor" />
<text x="354" y="214" fill="currentColor" font-style="italic">tepi</text>
<text x="58" y="18" fill="currentColor" font-style="italic">F</text>
</svg>`,
              options: [
                { key: "A", text: h`\(43{,}5\)` },
                { key: "B", text: h`\(44{,}5\)` },
                { key: "C", text: h`\(45\)` },
                { key: "D", text: h`\(45{,}5\)` },
                { key: "E", text: h`\(46{,}5\)` },
              ],
              answer: "B",
              explanation: h`<p>Frekuensi tiap kelas (selisih kumulatif): \(6,10,18,10,6\) dengan \(n=50\), sehingga \(\dfrac n2=25\). Nilai \(25\) dicapai pada kelas \(39{,}5\)–\(49{,}5\) (\(F_s=16\), \(f=18\), \(p=10\)):</p>
<div class="math-display">\[ \mathrm{Me}=39{,}5+\dfrac{25-16}{18}\cdot10=44{,}5 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Poligon frekuensi pada gambar menyajikan skor tes sejumlah peserta; sumbu mendatar memuat titik tengah kelas. Rata-rata skor peserta tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 400 250" role="img" aria-label="Poligon frekuensi dengan titik tengah 4,5; 14,5; 24,5; 34,5; 44,5; 54,5; 64,5 dan frekuensi 0, 4, 10, 16, 14, 6, 0" style="width: 100%; max-width: 400px; height: auto" font-size="12" font-family="inherit">
<line x1="50" y1="170" x2="360" y2="170" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="130" x2="360" y2="130" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="90" x2="360" y2="90" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="50" x2="360" y2="50" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="44" y="174" text-anchor="end" fill="currentColor" font-size="11">4</text>
<text x="44" y="134" text-anchor="end" fill="currentColor" font-size="11">8</text>
<text x="44" y="94" text-anchor="end" fill="currentColor" font-size="11">12</text>
<text x="44" y="54" text-anchor="end" fill="currentColor" font-size="11">16</text>
<polyline points="50,210 100,170 150,110 200,50 250,70 300,150 350,210" fill="none" stroke="#d9822b" stroke-width="2.5" stroke-linejoin="round" />
<circle cx="50" cy="210" r="3.5" fill="#d9822b" />
<circle cx="100" cy="170" r="3.5" fill="#d9822b" />
<circle cx="150" cy="110" r="3.5" fill="#d9822b" />
<circle cx="200" cy="50" r="3.5" fill="#d9822b" />
<circle cx="250" cy="70" r="3.5" fill="#d9822b" />
<circle cx="300" cy="150" r="3.5" fill="#d9822b" />
<circle cx="350" cy="210" r="3.5" fill="#d9822b" />
<text x="100" y="160" text-anchor="middle" fill="currentColor" font-size="11">4</text>
<text x="150" y="100" text-anchor="middle" fill="currentColor" font-size="11">10</text>
<text x="200" y="40" text-anchor="middle" fill="currentColor" font-size="11">16</text>
<text x="250" y="60" text-anchor="middle" fill="currentColor" font-size="11">14</text>
<text x="300" y="140" text-anchor="middle" fill="currentColor" font-size="11">6</text>
<text x="50" y="228" text-anchor="middle" fill="currentColor" font-size="11">4,5</text>
<text x="100" y="228" text-anchor="middle" fill="currentColor" font-size="11">14,5</text>
<text x="150" y="228" text-anchor="middle" fill="currentColor" font-size="11">24,5</text>
<text x="200" y="228" text-anchor="middle" fill="currentColor" font-size="11">34,5</text>
<text x="250" y="228" text-anchor="middle" fill="currentColor" font-size="11">44,5</text>
<text x="300" y="228" text-anchor="middle" fill="currentColor" font-size="11">54,5</text>
<text x="350" y="228" text-anchor="middle" fill="currentColor" font-size="11">64,5</text>
<line x1="50" y1="210" x2="378" y2="210" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="50" y1="210" x2="50" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="378,210 371,206 371,214" fill="currentColor" />
<polygon points="50,22 46,29 54,29" fill="currentColor" />
<text x="382" y="214" fill="currentColor" font-style="italic">skor</text>
<text x="58" y="28" fill="currentColor" font-style="italic">f</text>
</svg>`,
              options: [
                { key: "A", text: h`\(34{,}5\)` },
                { key: "B", text: h`\(35{,}3\)` },
                { key: "C", text: h`\(35{,}5\)` },
                { key: "D", text: h`\(36{,}1\)` },
                { key: "E", text: h`\(36{,}5\)` },
              ],
              answer: "D",
              explanation: h`<p>Titik tengah \(14{,}5;24{,}5;34{,}5;44{,}5;54{,}5\) berfrekuensi \(4,10,16,14,6\) (\(n=50\)). Pilih rataan sementara \(x_s=34{,}5\), sehingga simpangan \(d=-20,-10,0,10,20\):</p>
<div class="math-display">\[ \sum fd=-80-100+0+140+120=80 \]</div>
<div class="math-display">\[ \bar{x}=34{,}5+\dfrac{80}{50}=36{,}1 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Perhatikan data \(4,5,5,6,6,6,7,8,9,14\) dan pernyataan berikut.</p>
    <ol style="list-style: none; padding-left: 0">
      <li>(1) Rata-rata data lebih besar daripada median.</li>
      <li>(2) Jika \(14\) diganti \(40\), median tidak berubah tetapi rata-rata berubah.</li>
      <li>(3) Modus data sama dengan median.</li>
      <li>(4) Jika setiap data dikalikan \(2\), selisih rata-rata dan median tetap \(1\).</li>
    </ol>
    <p>Pernyataan yang benar adalah ....</p>`,
              options: [
                { key: "A", text: h`(1), (2), dan (3) saja` },
                { key: "B", text: h`(1) dan (3) saja` },
                { key: "C", text: h`(2) dan (4) saja` },
                { key: "D", text: h`(4) saja` },
                { key: "E", text: h`(1), (2), (3), dan (4)` },
              ],
              answer: "A",
              explanation: h`<p>\(\sum x=70\) dan \(n=10\), sehingga \(\bar{x}=7\). Median \(=\dfrac{6+6}{2}=6\) dan modus \(=6\).</p>
<p>(1) benar karena \(7&gt;6\). (2) benar: median tetap \(6\), sedangkan rata-rata menjadi \(9{,}6\). (3) benar: \(\mathrm{Mo}=\mathrm{Me}=6\). (4) salah: setelah dikali \(2\), \(\bar{x}=14\) dan \(\mathrm{Me}=12\), sehingga selisihnya \(2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Rata-rata nilai ujian seluruh siswa suatu kelas adalah \(72\). Jika rata-rata nilai siswa laki-laki \(68\) dan rata-rata nilai siswa perempuan \(75\), perbandingan banyak siswa perempuan terhadap banyak siswa laki-laki adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2:3\)` },
                { key: "B", text: h`\(3:4\)` },
                { key: "C", text: h`\(1:1\)` },
                { key: "D", text: h`\(5:4\)` },
                { key: "E", text: h`\(4:3\)` },
              ],
              answer: "E",
              explanation: h`<p>Misalkan banyak laki-laki \(n_L\) dan perempuan \(n_P\):</p>
<div class="math-display">\[ 68n_L+75n_P=72(n_L+n_P)\Rightarrow3n_P=4n_L\Rightarrow n_P:n_L=4:3 \]</div>
<p>Cara cepat: perbandingan bobot berbanding terbalik dengan jarak ke rata-rata gabungan.</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
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
              prompt: h`<p>Lima bilangan bulat positif memiliki rata-rata \(8\), median \(9\), dan satu-satunya modus \(10\). Nilai terkecil yang mungkin dari kelima bilangan tersebut adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(3\)` },
                { key: "C", text: h`\(4\)` },
                { key: "D", text: h`\(5\)` },
                { key: "E", text: h`\(6\)` },
              ],
              answer: "B",
              explanation: h`<p>Urutkan \(a\le b\le c\le d\le e\) dengan jumlah \(40\) dan \(c=9\). Modus tunggal \(10\) berarti \(10\) muncul paling sedikit dua kali, dan karena \(10&gt;9\) maka \(d=e=10\). Jadi:</p>
<div class="math-display">\[ a+b=40-9-20=11 \]</div>
<p>Jika \(b=9\), angka \(9\) muncul dua kali sehingga modus tidak tunggal; jadi \(b\le8\) dan \(a\ge3\). Data \(3,8,9,10,10\) memenuhi, sehingga nilai terkecil adalah \(3\) (jebakan: \(2,9,9,10,10\) bermodus ganda).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "hots",
              prompt: h`<p>Tabel berikut menyajikan nilai \(40\) siswa; frekuensi kelas \(30\)–\(39\) dan \(50\)–\(59\) dinyatakan dengan \(p\) dan \(q\). Jika median data tersebut adalah \(44{,}5\), rata-rata nilai siswa adalah ....</p>
    <table class="tabel-data">
      <thead><tr><th>Nilai</th><th>Frekuensi</th></tr></thead>
      <tbody>
        <tr><td>\(20\)–\(29\)</td><td>\(6\)</td></tr>
        <tr><td>\(30\)–\(39\)</td><td>\(p\)</td></tr>
        <tr><td>\(40\)–\(49\)</td><td>\(14\)</td></tr>
        <tr><td>\(50\)–\(59\)</td><td>\(q\)</td></tr>
        <tr><td>\(60\)–\(69\)</td><td>\(4\)</td></tr>
      </tbody>
    </table>`,
              options: [
                { key: "A", text: h`\(44\)` },
                { key: "B", text: h`\(44{,}5\)` },
                { key: "C", text: h`\(45\)` },
                { key: "D", text: h`\(45{,}5\)` },
                { key: "E", text: h`\(46\)` },
              ],
              answer: "A",
              explanation: h`<p>\(6+p+14+q+4=40\Rightarrow p+q=16\). Median \(44{,}5\) berada di kelas \(40\)–\(49\) (\(t_b=39{,}5\), \(F_s=6+p\), \(f=14\)):</p>
<div class="math-display">\[ 39{,}5+\dfrac{20-(6+p)}{14}\cdot10=44{,}5\Rightarrow\dfrac{14-p}{14}=\dfrac12\Rightarrow p=7,\ q=9 \]</div>
<p>Dengan \(x_s=44{,}5\) (simpangan \(-20,-10,0,10,20\)):</p>
<div class="math-display">\[ \sum fd=-120-70+0+90+80=-20,\qquad \bar{x}=44{,}5+\dfrac{-20}{40}=44 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "hots",
              prompt: h`<p>Lima bilangan \(4,6,7,9,x\) memiliki rata-rata yang sama dengan mediannya. Jumlah semua nilai \(x\) yang mungkin adalah ....</p>`,
              options: [
                { key: "A", text: h`\(6{,}5\)` },
                { key: "B", text: h`\(10{,}5\)` },
                { key: "C", text: h`\(13\)` },
                { key: "D", text: h`\(15{,}5\)` },
                { key: "E", text: h`\(19{,}5\)` },
              ],
              answer: "E",
              explanation: h`<p>Jumlah \(=26+x\), sehingga rata-rata \(=\dfrac{26+x}{5}\). Tinjau letak \(x\):</p>
<p>(i) \(x\le6\): median \(6\), sehingga \(\dfrac{26+x}{5}=6\Rightarrow x=4\) (memenuhi).</p>
<p>(ii) \(6&lt;x&lt;7\): median \(x\), sehingga \(26+x=5x\Rightarrow x=6{,}5\) (memenuhi).</p>
<p>(iii) \(x\ge7\): median \(7\), sehingga \(\dfrac{26+x}{5}=7\Rightarrow x=9\) (memenuhi).</p>
<div class="math-display">\[ 4+6{,}5+9=19{,}5 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt: h`<p>Histogram pada gambar menyajikan skor \(40\) peserta tes. Hubungan yang benar antara rata-rata \(\bar{x}\), median \(\mathrm{Me}\), dan modus \(\mathrm{Mo}\) data tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 340 240" role="img" aria-label="Histogram skor dengan tepi kelas 39,5; 49,5; 59,5; 69,5; 79,5; 89,5 dan frekuensi 2, 5, 9, 16, 8" style="width: 100%; max-width: 340px; height: auto" font-size="12" font-family="inherit">
<line x1="50" y1="168" x2="305" y2="168" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="136" x2="305" y2="136" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="104" x2="305" y2="104" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="72" x2="305" y2="72" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="44" y="172" text-anchor="end" fill="currentColor" font-size="11">4</text>
<text x="44" y="140" text-anchor="end" fill="currentColor" font-size="11">8</text>
<text x="44" y="108" text-anchor="end" fill="currentColor" font-size="11">12</text>
<text x="44" y="76" text-anchor="end" fill="currentColor" font-size="11">16</text>
<rect x="50" y="184" width="50" height="16" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="100" y="160" width="50" height="40" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="150" y="128" width="50" height="72" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="200" y="72" width="50" height="128" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="250" y="136" width="50" height="64" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<text x="75" y="179" text-anchor="middle" fill="currentColor">2</text>
<text x="125" y="155" text-anchor="middle" fill="currentColor">5</text>
<text x="175" y="123" text-anchor="middle" fill="currentColor">9</text>
<text x="225" y="67" text-anchor="middle" fill="currentColor">16</text>
<text x="275" y="131" text-anchor="middle" fill="currentColor">8</text>
<text x="50" y="218" text-anchor="middle" fill="currentColor" font-size="11">39,5</text>
<text x="100" y="218" text-anchor="middle" fill="currentColor" font-size="11">49,5</text>
<text x="150" y="218" text-anchor="middle" fill="currentColor" font-size="11">59,5</text>
<text x="200" y="218" text-anchor="middle" fill="currentColor" font-size="11">69,5</text>
<text x="250" y="218" text-anchor="middle" fill="currentColor" font-size="11">79,5</text>
<text x="300" y="218" text-anchor="middle" fill="currentColor" font-size="11">89,5</text>
<line x1="50" y1="200" x2="322" y2="200" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="50" y1="200" x2="50" y2="40" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="322,200 315,196 315,204" fill="currentColor" />
<polygon points="50,40 46,47 54,47" fill="currentColor" />
<text x="326" y="190" fill="currentColor" font-style="italic">skor</text>
<text x="58" y="45" fill="currentColor" font-style="italic">f</text>
</svg>`,
              options: [
                { key: "A", text: h`\(\mathrm{Mo}&lt;\mathrm{Me}&lt;\bar{x}\)` },
                { key: "B", text: h`\(\mathrm{Me}&lt;\mathrm{Mo}&lt;\bar{x}\)` },
                { key: "C", text: h`\(\mathrm{Me}&lt;\bar{x}&lt;\mathrm{Mo}\)` },
                { key: "D", text: h`\(\bar{x}&lt;\mathrm{Me}&lt;\mathrm{Mo}\)` },
                { key: "E", text: h`\(\bar{x}=\mathrm{Me}=\mathrm{Mo}\)` },
              ],
              answer: "D",
              explanation: h`<p>Frekuensi \(2,5,9,16,8\) (\(n=40\)).</p>
<p><strong>Modus:</strong> kelas \(69{,}5\)–\(79{,}5\) dengan \(d_1=16-9=7\) dan \(d_2=16-8=8\):</p>
<div class="math-display">\[ \mathrm{Mo}=69{,}5+\dfrac{7}{15}\cdot10\approx74{,}2 \]</div>
<p><strong>Median:</strong> \(F_s=16\), \(f=16\):</p>
<div class="math-display">\[ \mathrm{Me}=69{,}5+\dfrac{20-16}{16}\cdot10=72 \]</div>
<p><strong>Rata-rata:</strong> titik tengah \(44{,}5;54{,}5;64{,}5;74{,}5;84{,}5\):</p>
<div class="math-display">\[ \sum fx=89+272{,}5+580{,}5+1192+676=2810,\qquad \bar{x}=\dfrac{2810}{40}=70{,}25 \]</div>
<p>Jadi \(\bar{x}&lt;\mathrm{Me}&lt;\mathrm{Mo}\) (sebaran condong ke kiri: ekor panjang di kiri menarik rata-rata ke bawah).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "hots",
              prompt: h`<p>Dalam suatu kelas terdapat siswa laki-laki dan siswa perempuan. Apakah rata-rata nilai ujian seluruh siswa di kelas itu lebih dari \(74\)?</p>
    <ol style="list-style: none; padding-left: 0">
      <li>(1) Rata-rata nilai siswa laki-laki adalah \(70\) dan rata-rata nilai siswa perempuan adalah \(80\).</li>
      <li>(2) Banyak siswa perempuan lebih banyak daripada banyak siswa laki-laki.</li>
    </ol>`,
              options: [
                { key: "A", text: h`Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup.` },
                { key: "B", text: h`Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup.` },
                { key: "C", text: h`DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.` },
                { key: "D", text: h`Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA cukup untuk menjawab pertanyaan.` },
                { key: "E", text: h`Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan.` },
              ],
              answer: "C",
              explanation: h`<p>Rata-rata gabungan adalah rata-rata berbobot dari \(70\) dan \(80\), sehingga selalu berada di antara keduanya.</p>
<p>Pernyataan (1) saja tidak cukup (tergantung perbandingan banyak siswa). Pernyataan (2) saja tidak cukup (tidak ada informasi rata-rata).</p>
<p>Bersama-sama: bobot perempuan lebih dari \(\dfrac12\), sehingga rata-rata gabungan lebih dari:</p>
<div class="math-display">\[ \dfrac{70+80}{2}=75&gt;74 \]</div>
<p>Jawabannya pasti “ya”, jadi keduanya bersama-sama cukup.</p>
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
          note: "Mudah dan sedang",
          questions: [
            {
              id: "isian-1",
              no: 1,
              type: "short",
              level: "sedang",
              prompt: h`<p>Tabel berikut menyajikan nilai ulangan \(20\) siswa. Rata-rata nilai ulangan tersebut adalah ....</p>
    <table class="tabel-data">
      <tbody>
        <tr><th>Nilai</th><td>\(5\)</td><td>\(6\)</td><td>\(7\)</td><td>\(8\)</td><td>\(9\)</td><td>\(10\)</td></tr>
        <tr><th>Frekuensi</th><td>\(2\)</td><td>\(3\)</td><td>\(7\)</td><td>\(5\)</td><td>\(2\)</td><td>\(1\)</td></tr>
      </tbody>
    </table>`,
              answer: ["7.25", "7,25", "29/4"],
              explanation: h`<div class="math-display">\[ \sum f=20,\qquad \sum fx=10+18+49+40+18+10=145 \]</div>
<div class="math-display">\[ \bar{x}=\dfrac{145}{20}=7{,}25 \]</div>
<p>Jadi, jawabannya adalah <strong>7,25</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Tabel berikut menyajikan tinggi badan \(40\) siswa. Rata-rata tinggi badan siswa tersebut adalah .... cm.</p>
    <table class="tabel-data">
      <thead><tr><th>Tinggi (cm)</th><th>Frekuensi</th></tr></thead>
      <tbody>
        <tr><td>\(150\)–\(154\)</td><td>\(4\)</td></tr>
        <tr><td>\(155\)–\(159\)</td><td>\(8\)</td></tr>
        <tr><td>\(160\)–\(164\)</td><td>\(14\)</td></tr>
        <tr><td>\(165\)–\(169\)</td><td>\(10\)</td></tr>
        <tr><td>\(170\)–\(174\)</td><td>\(4\)</td></tr>
      </tbody>
    </table>`,
              answer: ["162.25", "162,25", "649/4"],
              explanation: h`<p>Titik tengah \(152,157,162,167,172\). Dengan \(x_s=162\), simpangan \(d=-10,-5,0,5,10\):</p>
<div class="math-display">\[ \sum fd=-40-40+0+50+40=10 \]</div>
<div class="math-display">\[ \bar{x}=162+\dfrac{10}{40}=162{,}25 \]</div>
<p>Jadi, jawabannya adalah <strong>162,25</strong> cm.</p>`,
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
              prompt: h`<p>Ogive “lebih dari” pada gambar menyajikan nilai ulangan \(40\) siswa. Median data tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 340 240" role="img" aria-label="Ogive lebih dari: tepi 29,5 sampai 79,5 dengan frekuensi kumulatif 40, 34, 22, 12, 4, 0" style="width: 100%; max-width: 340px; height: auto" font-size="12" font-family="inherit">
<line x1="50" y1="160" x2="305" y2="160" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="120" x2="305" y2="120" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="80" x2="305" y2="80" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="40" x2="305" y2="40" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="44" y="164" text-anchor="end" fill="currentColor" font-size="11">10</text>
<text x="44" y="124" text-anchor="end" fill="currentColor" font-size="11">20</text>
<text x="44" y="84" text-anchor="end" fill="currentColor" font-size="11">30</text>
<text x="44" y="44" text-anchor="end" fill="currentColor" font-size="11">40</text>
<polyline points="50,40 100,64 150,112 200,152 250,184 300,200" fill="none" stroke="#b03a2e" stroke-width="2.5" stroke-linejoin="round" />
<circle cx="50" cy="40" r="3.5" fill="#b03a2e" />
<circle cx="100" cy="64" r="3.5" fill="#b03a2e" />
<circle cx="150" cy="112" r="3.5" fill="#b03a2e" />
<circle cx="200" cy="152" r="3.5" fill="#b03a2e" />
<circle cx="250" cy="184" r="3.5" fill="#b03a2e" />
<circle cx="300" cy="200" r="3.5" fill="#b03a2e" />
<text x="58" y="34" fill="currentColor" font-size="11">40</text>
<text x="108" y="58" fill="currentColor" font-size="11">34</text>
<text x="158" y="106" fill="currentColor" font-size="11">22</text>
<text x="208" y="146" fill="currentColor" font-size="11">12</text>
<text x="258" y="178" fill="currentColor" font-size="11">4</text>
<text x="50" y="218" text-anchor="middle" fill="currentColor" font-size="11">29,5</text>
<text x="100" y="218" text-anchor="middle" fill="currentColor" font-size="11">39,5</text>
<text x="150" y="218" text-anchor="middle" fill="currentColor" font-size="11">49,5</text>
<text x="200" y="218" text-anchor="middle" fill="currentColor" font-size="11">59,5</text>
<text x="250" y="218" text-anchor="middle" fill="currentColor" font-size="11">69,5</text>
<text x="300" y="218" text-anchor="middle" fill="currentColor" font-size="11">79,5</text>
<line x1="50" y1="200" x2="322" y2="200" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="50" y1="200" x2="50" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="322,200 315,196 315,204" fill="currentColor" />
<polygon points="50,22 46,29 54,29" fill="currentColor" />
<text x="326" y="190" fill="currentColor" font-style="italic">tepi</text>
<text x="58" y="28" fill="currentColor" font-style="italic">F</text>
</svg>`,
              answer: ["51.5", "51,5", "103/2"],
              explanation: h`<p>Frekuensi tiap kelas (selisih berurutan): \(6,12,10,8,4\) untuk kelas \(29{,}5\)–\(39{,}5\) sampai \(69{,}5\)–\(79{,}5\). Kumulatif “kurang dari”: \(6,18,28,\dots\); \(\dfrac n2=20\) dicapai di kelas \(49{,}5\)–\(59{,}5\) (\(F_s=18\), \(f=10\), \(p=10\)):</p>
<div class="math-display">\[ \mathrm{Me}=49{,}5+\dfrac{20-18}{10}\cdot10=51{,}5 \]</div>
<p>Jadi, jawabannya adalah <strong>51,5</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Tabel berikut menyajikan hasil tes sejumlah siswa dengan frekuensi kelas \(21\)–\(30\) dinyatakan dengan \(x\). Jika median data tersebut adalah \(25\), nilai \(x\) adalah ....</p>
    <table class="tabel-data">
      <thead><tr><th>Nilai</th><th>Frekuensi</th></tr></thead>
      <tbody>
        <tr><td>\(1\)–\(10\)</td><td>\(5\)</td></tr>
        <tr><td>\(11\)–\(20\)</td><td>\(8\)</td></tr>
        <tr><td>\(21\)–\(30\)</td><td>\(x\)</td></tr>
        <tr><td>\(31\)–\(40\)</td><td>\(9\)</td></tr>
        <tr><td>\(41\)–\(50\)</td><td>\(3\)</td></tr>
      </tbody>
    </table>`,
              answer: ["10"],
              explanation: h`<p>\(n=25+x\) dan kelas median adalah \(21\)–\(30\) (\(t_b=20{,}5\), \(F_s=13\), \(p=10\)):</p>
<div class="math-display">\[ 20{,}5+\dfrac{\frac{25+x}{2}-13}{x}\cdot10=25\Rightarrow\dfrac{5(x-1)}{x}=4{,}5\Rightarrow x=10 \]</div>
<p>Pemeriksaan: \(n=35\) dan \(\frac n2=17{,}5\) memang berada di kelas \(21\)–\(30\).</p>
<p>Jadi, jawabannya adalah <strong>10</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          questions: [
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "hots",
              prompt: h`<p>Rata-rata nilai \(40\) siswa adalah \(72\). Seperempat siswa dengan nilai terendah memiliki rata-rata \(50\), sedangkan seperempat siswa dengan nilai tertinggi memiliki rata-rata \(90\). Rata-rata nilai separuh siswa yang berada di tengah adalah ....</p>`,
              answer: ["74"],
              explanation: h`<p>Jumlah seluruh \(=40\cdot72=2880\). Seperempat terbawah (\(10\) siswa): \(10\cdot50=500\). Seperempat teratas (\(10\) siswa): \(10\cdot90=900\). Jumlah \(20\) siswa tengah:</p>
<div class="math-display">\[ 2880-500-900=1480,\qquad \dfrac{1480}{20}=74 \]</div>
<p>Jadi, jawabannya adalah <strong>74</strong>.</p>`,
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
              prompt: h`<p>Nilai ulangan matematika \(20\) siswa adalah sebagai berikut.</p>
    <div class="math-display">\[ \begin{array}{cccccccccc}
7&amp;8&amp;6&amp;9&amp;7&amp;8&amp;5&amp;7&amp;10&amp;8\\
6&amp;7&amp;9&amp;8&amp;7&amp;6&amp;8&amp;7&amp;9&amp;5
\end{array} \]</div>

    <ol type="a">
      <li>Susunlah tabel distribusi frekuensi data tersebut.</li>
      <li>Tentukan rata-rata nilai ulangan.</li>
      <li>Tentukan median dan modus.</li>
      <li>Berapa persen siswa yang nilainya lebih dari rata-rata?</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Frekuensi nilai \(5,6,7,8,9,10\) berturut-turut \(2,3,6,5,3,1\) (jumlah \(20\)).</p>
<p><strong>(b)</strong></p>
<div class="math-display">\[ \sum fx=10+18+42+40+27+10=147,\qquad \bar{x}=\dfrac{147}{20}=7{,}35 \]</div>
<p><strong>(c)</strong> Kumulatif \(2,5,11,16,19,20\). Data ke-\(10\) dan ke-\(11\) sama-sama \(7\), sehingga \(\mathrm{Me}=\dfrac{7+7}{2}=7\). Frekuensi terbesar \(6\) pada nilai \(7\), sehingga \(\mathrm{Mo}=7\).</p>
<p><strong>(d)</strong> Nilai di atas \(7{,}35\) adalah \(8,9,10\): \(5+3+1=9\) siswa.</p>
<div class="math-display">\[ \dfrac{9}{20}\times100\%=45\% \]</div>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin; (b) 2 poin; (c) 2 poin (median 1, modus 1); (d) 2 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Histogram pada gambar menyajikan waktu (menit) yang diperlukan sejumlah peserta untuk menyelesaikan suatu tes.</p>`,
              figure: h`<svg viewBox="0 0 340 240" role="img" aria-label="Histogram waktu penyelesaian tes dengan tepi kelas 10,5; 20,5; 30,5; 40,5; 50,5; 60,5 dan frekuensi 6, 5, 20, 15, 4" style="width: 100%; max-width: 340px; height: auto" font-size="12" font-family="inherit">
<line x1="50" y1="160" x2="305" y2="160" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="120" x2="305" y2="120" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="80" x2="305" y2="80" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="50" y1="40" x2="305" y2="40" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="44" y="164" text-anchor="end" fill="currentColor" font-size="11">5</text>
<text x="44" y="124" text-anchor="end" fill="currentColor" font-size="11">10</text>
<text x="44" y="84" text-anchor="end" fill="currentColor" font-size="11">15</text>
<text x="44" y="44" text-anchor="end" fill="currentColor" font-size="11">20</text>
<rect x="50" y="152" width="50" height="48" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="100" y="160" width="50" height="40" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="150" y="40" width="50" height="160" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="200" y="80" width="50" height="120" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="250" y="168" width="50" height="32" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<text x="75" y="147" text-anchor="middle" fill="currentColor">6</text>
<text x="125" y="155" text-anchor="middle" fill="currentColor">5</text>
<text x="175" y="35" text-anchor="middle" fill="currentColor">20</text>
<text x="225" y="75" text-anchor="middle" fill="currentColor">15</text>
<text x="275" y="163" text-anchor="middle" fill="currentColor">4</text>
<text x="50" y="218" text-anchor="middle" fill="currentColor" font-size="11">10,5</text>
<text x="100" y="218" text-anchor="middle" fill="currentColor" font-size="11">20,5</text>
<text x="150" y="218" text-anchor="middle" fill="currentColor" font-size="11">30,5</text>
<text x="200" y="218" text-anchor="middle" fill="currentColor" font-size="11">40,5</text>
<text x="250" y="218" text-anchor="middle" fill="currentColor" font-size="11">50,5</text>
<text x="300" y="218" text-anchor="middle" fill="currentColor" font-size="11">60,5</text>
<line x1="50" y1="200" x2="322" y2="200" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="50" y1="200" x2="50" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="322,200 315,196 315,204" fill="currentColor" />
<polygon points="50,22 46,29 54,29" fill="currentColor" />
<text x="326" y="190" fill="currentColor" font-style="italic">menit</text>
<text x="58" y="28" fill="currentColor" font-style="italic">f</text>
</svg>`,
              promptAfter: h`<ol type="a">
      <li>Tentukan banyak peserta dan persentase peserta yang menyelesaikan tes paling lama \(40\) menit.</li>
      <li>Tentukan rata-rata waktu penyelesaian.</li>
      <li>Tentukan median waktu penyelesaian.</li>
      <li>Tentukan modus waktu penyelesaian.</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Banyak peserta \(=6+5+20+15+4=50\). “Paling lama \(40\) menit” berarti kelas \(11\)–\(20\), \(21\)–\(30\), dan \(31\)–\(40\) (tepi atas \(40{,}5\)): \(6+5+20=31\) peserta.</p>
<div class="math-display">\[ \dfrac{31}{50}\times100\%=62\% \]</div>
<p><strong>(b)</strong> Titik tengah \(15{,}5;25{,}5;35{,}5;45{,}5;55{,}5\). Dengan \(x_s=35{,}5\):</p>
<div class="math-display">\[ \sum fd=-120-50+0+150+80=60,\qquad \bar{x}=35{,}5+\dfrac{60}{50}=36{,}7\ \text{menit} \]</div>
<p><strong>(c)</strong> \(\dfrac n2=25\); kumulatif \(6,11,31\), sehingga kelas median \(31\)–\(40\) (\(t_b=30{,}5\), \(F_s=11\), \(f=20\)):</p>
<div class="math-display">\[ \mathrm{Me}=30{,}5+\dfrac{25-11}{20}\cdot10=37{,}5\ \text{menit} \]</div>
<p><strong>(d)</strong> Kelas modus \(31\)–\(40\): \(d_1=20-5=15\), \(d_2=20-15=5\):</p>
<div class="math-display">\[ \mathrm{Mo}=30{,}5+\dfrac{15}{20}\cdot10=38\ \text{menit} \]</div>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin (banyak peserta 1, persentase 1); (b) 2 poin; (c) 2 poin; (d) 2 poin.</em></p>`,
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
              prompt: h`<p>Diagram batang berikut menyajikan nilai ulangan matematika siswa kelas A dan kelas B.</p>`,
              figure: h`<svg viewBox="0 0 340 230" role="img" aria-label="Diagram batang Kelas A: nilai 5 sampai 10 berfrekuensi 1, 3, 6, 6, 3, 1" style="width: 100%; max-width: 340px; height: auto" font-size="12" font-family="inherit">
<text x="170" y="22" text-anchor="middle" fill="currentColor" font-weight="700">Kelas A</text>
<line x1="45" y1="162" x2="325" y2="162" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="45" y1="134" x2="325" y2="134" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="45" y1="106" x2="325" y2="106" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="45" y1="78" x2="325" y2="78" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="39" y="166" text-anchor="end" fill="currentColor" font-size="11">2</text>
<text x="39" y="138" text-anchor="end" fill="currentColor" font-size="11">4</text>
<text x="39" y="110" text-anchor="end" fill="currentColor" font-size="11">6</text>
<text x="39" y="82" text-anchor="end" fill="currentColor" font-size="11">8</text>
<rect x="60" y="176" width="30" height="14" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="105" y="148" width="30" height="42" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="150" y="106" width="30" height="84" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="195" y="106" width="30" height="84" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="240" y="148" width="30" height="42" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<rect x="285" y="176" width="30" height="14" fill="#0f8b7d" fill-opacity="0.35" stroke="#0f8b7d" />
<text x="75" y="171" text-anchor="middle" fill="currentColor">1</text>
<text x="120" y="143" text-anchor="middle" fill="currentColor">3</text>
<text x="165" y="101" text-anchor="middle" fill="currentColor">6</text>
<text x="210" y="101" text-anchor="middle" fill="currentColor">6</text>
<text x="255" y="143" text-anchor="middle" fill="currentColor">3</text>
<text x="300" y="171" text-anchor="middle" fill="currentColor">1</text>
<text x="75" y="208" text-anchor="middle" fill="currentColor">5</text>
<text x="120" y="208" text-anchor="middle" fill="currentColor">6</text>
<text x="165" y="208" text-anchor="middle" fill="currentColor">7</text>
<text x="210" y="208" text-anchor="middle" fill="currentColor">8</text>
<text x="255" y="208" text-anchor="middle" fill="currentColor">9</text>
<text x="300" y="208" text-anchor="middle" fill="currentColor">10</text>
<line x1="45" y1="190" x2="332" y2="190" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="45" y1="190" x2="45" y2="40" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="332,190 325,186 325,194" fill="currentColor" />
<polygon points="45,40 41,47 49,47" fill="currentColor" />
<text x="52" y="46" fill="currentColor" font-style="italic">f</text>
<text x="334" y="206" fill="currentColor" font-style="italic" font-size="11">nilai</text>
</svg>
<svg viewBox="0 0 340 230" role="img" aria-label="Diagram batang Kelas B: nilai 5 sampai 10 berfrekuensi 3, 6, 9, 7, 4, 1" style="width: 100%; max-width: 340px; height: auto; margin-top: 0.5rem" font-size="12" font-family="inherit">
<text x="170" y="22" text-anchor="middle" fill="currentColor" font-weight="700">Kelas B</text>
<line x1="45" y1="162" x2="325" y2="162" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="45" y1="134" x2="325" y2="134" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="45" y1="106" x2="325" y2="106" stroke="#9ca3af" stroke-opacity="0.4" />
<line x1="45" y1="78" x2="325" y2="78" stroke="#9ca3af" stroke-opacity="0.4" />
<text x="39" y="166" text-anchor="end" fill="currentColor" font-size="11">2</text>
<text x="39" y="138" text-anchor="end" fill="currentColor" font-size="11">4</text>
<text x="39" y="110" text-anchor="end" fill="currentColor" font-size="11">6</text>
<text x="39" y="82" text-anchor="end" fill="currentColor" font-size="11">8</text>
<rect x="60" y="148" width="30" height="42" fill="#d9822b" fill-opacity="0.35" stroke="#d9822b" />
<rect x="105" y="106" width="30" height="84" fill="#d9822b" fill-opacity="0.35" stroke="#d9822b" />
<rect x="150" y="64" width="30" height="126" fill="#d9822b" fill-opacity="0.35" stroke="#d9822b" />
<rect x="195" y="92" width="30" height="98" fill="#d9822b" fill-opacity="0.35" stroke="#d9822b" />
<rect x="240" y="134" width="30" height="56" fill="#d9822b" fill-opacity="0.35" stroke="#d9822b" />
<rect x="285" y="176" width="30" height="14" fill="#d9822b" fill-opacity="0.35" stroke="#d9822b" />
<text x="75" y="143" text-anchor="middle" fill="currentColor">3</text>
<text x="120" y="101" text-anchor="middle" fill="currentColor">6</text>
<text x="165" y="59" text-anchor="middle" fill="currentColor">9</text>
<text x="210" y="87" text-anchor="middle" fill="currentColor">7</text>
<text x="255" y="129" text-anchor="middle" fill="currentColor">4</text>
<text x="300" y="171" text-anchor="middle" fill="currentColor">1</text>
<text x="75" y="208" text-anchor="middle" fill="currentColor">5</text>
<text x="120" y="208" text-anchor="middle" fill="currentColor">6</text>
<text x="165" y="208" text-anchor="middle" fill="currentColor">7</text>
<text x="210" y="208" text-anchor="middle" fill="currentColor">8</text>
<text x="255" y="208" text-anchor="middle" fill="currentColor">9</text>
<text x="300" y="208" text-anchor="middle" fill="currentColor">10</text>
<line x1="45" y1="190" x2="332" y2="190" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="45" y1="190" x2="45" y2="40" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="332,190 325,186 325,194" fill="currentColor" />
<polygon points="45,40 41,47 49,47" fill="currentColor" />
<text x="52" y="46" fill="currentColor" font-style="italic">f</text>
<text x="334" y="206" fill="currentColor" font-style="italic" font-size="11">nilai</text>
</svg>`,
              promptAfter: h`<ol type="a">
      <li>Tentukan banyak siswa dan rata-rata nilai pada masing-masing kelas.</li>
      <li>Tentukan median dan modus pada masing-masing kelas.</li>
      <li>Tentukan rata-rata nilai gabungan seluruh siswa kedua kelas.</li>
      <li>Siswa dinyatakan tuntas jika nilainya paling sedikit \(8\). Hitung persentase siswa yang tuntas pada masing-masing kelas, lalu tentukan kelas mana yang persentase ketuntasannya lebih tinggi.</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Kelas A: \(n=1+3+6+6+3+1=20\) dan \(\sum fx=5+18+42+48+27+10=150\), sehingga \(\bar{x}_A=7{,}5\). Kelas B: \(n=3+6+9+7+4+1=30\) dan \(\sum fx=15+36+63+56+36+10=216\), sehingga \(\bar{x}_B=7{,}2\).</p>
<p><strong>(b)</strong> Kelas A: kumulatif \(1,4,10,16,\dots\); data ke-\(10\) bernilai \(7\) dan ke-\(11\) bernilai \(8\), sehingga \(\mathrm{Me}=7{,}5\); modus \(7\) dan \(8\) (bimodal). Kelas B: kumulatif \(3,9,18,\dots\); data ke-\(15\) dan ke-\(16\) sama-sama \(7\), sehingga \(\mathrm{Me}=7\) dan \(\mathrm{Mo}=7\).</p>
<p><strong>(c)</strong></p>
<div class="math-display">\[ \bar{x}_{\text{gab}}=\dfrac{150+216}{20+30}=\dfrac{366}{50}=7{,}32 \]</div>
<p>Hasilnya bukan \(\dfrac{7{,}5+7{,}2}{2}\) karena banyak siswa kedua kelas berbeda.</p>
<p><strong>(d)</strong> Kelas A: \(6+3+1=10\) siswa, \(\dfrac{10}{20}=50\%\). Kelas B: \(7+4+1=12\) siswa, \(\dfrac{12}{30}=40\%\). Ketuntasan kelas A lebih tinggi.</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin; (b) 2 poin; (c) 2 poin; (d) 2 poin.</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Kelas XII-A terdiri atas \(24\) siswa dengan rata-rata nilai \(70\), sedangkan kelas XII-B terdiri atas \(36\) siswa. Rata-rata nilai gabungan kedua kelas adalah \(76\).</p>
    <ol type="a">
      <li>Tentukan rata-rata nilai kelas XII-B.</li>
      <li>Guru menaikkan nilai setiap siswa kelas XII-A sebesar \(5\) poin. Tentukan rata-rata nilai gabungan yang baru.</li>
      <li>Setelah kenaikan pada bagian (b), dua siswa baru dengan nilai yang sama bergabung ke kelas XII-A sehingga rata-rata kelas XII-A menjadi \(76\). Tentukan nilai masing-masing siswa baru.</li>
      <li>Jika rata-rata kelas A tetap \(70\) dan rata-rata kelas B tetap seperti hasil (a), tentukan perbandingan banyak siswa kelas A dan kelas B agar rata-rata gabungan menjadi \(77\).</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong></p>
<div class="math-display">\[ 24\cdot70+36\,\bar{x}_B=60\cdot76\Rightarrow1680+36\,\bar{x}_B=4560\Rightarrow\bar{x}_B=80 \]</div>
<p><strong>(b)</strong> Rata-rata kelas A menjadi \(75\), sehingga:</p>
<div class="math-display">\[ \bar{x}_{\text{gab}}=\dfrac{24\cdot75+36\cdot80}{60}=\dfrac{1800+2880}{60}=78 \]</div>
<p><strong>(c)</strong> Jumlah nilai kelas A sekarang \(24\cdot75=1800\). Misalkan nilai siswa baru \(v\):</p>
<div class="math-display">\[ \dfrac{1800+2v}{26}=76\Rightarrow1800+2v=1976\Rightarrow v=88 \]</div>
<p><strong>(d)</strong></p>
<div class="math-display">\[ 70n_A+80n_B=77(n_A+n_B)\Rightarrow3n_B=7n_A\Rightarrow n_A:n_B=3:7 \]</div>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin; (b) 2 poin; (c) 2 poin; (d) 2 poin.</em></p>`,
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
              prompt: h`<p>Gaji sepuluh pegawai sebuah toko (dalam juta rupiah per bulan) adalah \(4,4,5,5,5,6,7,8,9,47\).</p>
    <ol type="a">
      <li>Tentukan rata-rata, median, dan modus gaji tersebut.</li>
      <li>Pemilik toko mengiklankan bahwa “gaji rata-rata pegawai kami adalah \(10\) juta rupiah per bulan”. Apakah angka itu mewakili gaji pegawai pada umumnya? Ukuran pemusatan mana yang lebih tepat? Jelaskan.</li>
      <li>Mulai bulan depan gaji setiap pegawai naik \(10\%\) dan ditambah tunjangan tetap \(0{,}5\) juta, yaitu \(y=1{,}1x+0{,}5\). Buktikan bahwa jika \(y_i=ax_i+b\) maka \(\bar{y}=a\bar{x}+b\), lalu tentukan rata-rata, median, dan modus gaji yang baru.</li>
      <li>Sebelum kenaikan gaji, toko menerima dua pegawai baru dengan gaji yang sama. Jika rata-rata gaji seluruh \(12\) pegawai menjadi \(9\) juta, tentukan gaji masing-masing pegawai baru.</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> \(\sum x=100\), sehingga \(\bar{x}=10\) juta. Data sudah terurut (\(n=10\)):</p>
<div class="math-display">\[ \mathrm{Me}=\dfrac{5+6}{2}=5{,}5\ \text{juta} \]</div>
<p>Modus \(=5\) juta (muncul tiga kali).</p>
<p><strong>(b)</strong> Rata-rata \(10\) juta <strong>tidak mewakili</strong>: sembilan dari sepuluh pegawai bergaji di bawah \(10\) juta karena rata-rata terseret pencilan \(47\) juta. Median (\(5{,}5\) juta) lebih tepat menggambarkan gaji pegawai pada umumnya karena tidak terpengaruh pencilan; modus (\(5\) juta) juga menunjukkan gaji yang paling umum.</p>
<p><strong>(c)</strong> Bukti:</p>
<div class="math-display">\[ \sum y_i=\sum(ax_i+b)=a\sum x_i+nb\Rightarrow\bar{y}=\dfrac{a\sum x_i+nb}{n}=a\bar{x}+b \]</div>
<p>Dengan \(a=1{,}1\) dan \(b=0{,}5\): rata-rata baru \(=1{,}1(10)+0{,}5=11{,}5\) juta; median baru \(=1{,}1(5{,}5)+0{,}5=6{,}55\) juta; modus baru \(=1{,}1(5)+0{,}5=6\) juta.</p>
<p><strong>(d)</strong> Jumlah \(12\) pegawai \(=12\cdot9=108\) juta, sehingga jumlah dua pegawai baru \(=108-100=8\) juta dan gaji masing-masing \(4\) juta.</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin; (b) 2 poin (kesimpulan 1, alasan pencilan 1); (c) 2 poin (bukti 1, tiga nilai baru 1); (d) 2 poin.</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default statistika;
