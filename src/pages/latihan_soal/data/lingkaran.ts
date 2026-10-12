import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Lingkaran.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const lingkaran: Material = {
  slug: "lingkaran",
  title: "Latihan Soal Lingkaran",
  topic: "Lingkaran",
  description:
    "Keliling, luas, busur, juring, dan tembereng, sudut pusat dan sudut keliling, garis singgung, persamaan lingkaran, serta penalaran geometri lingkaran.",
  durationMinutes: 120,
  notes: [
    h`Soal disusun berjenjang dari mudah sampai HOTS dan memakai bentuk yang
sejalan dengan UTBK-SNBT: pilihan ganda lima opsi, pernyataan majemuk
(soal 8), kecukupan data (soal 20), serta soal berkonteks dengan gambar.
Soal HOTS menuntut proses <em>merumuskan</em>, <em>menggunakan</em>, dan
<em>menafsirkan</em> model geometri lingkaran.`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Notasi: \(O\) pusat lingkaran, \(r\) jari-jari, \(K\) keliling, dan \(L\)
luas. Nilai \(\pi=\frac{22}{7}\) hanya dipakai jika disebutkan pada soal;
jika tidak, tuliskan jawaban dalam bentuk \(\pi\). Satuan panjang dalam cm
kecuali disebutkan lain.`,
    "Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan. Pada isian singkat, tuliskan hanya jawaban akhir (huruf π dapat ditulis pi).",
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
              prompt: h`<p>Sebuah taman kota berbentuk lingkaran dengan diameter \(28\) m. Lampu hias dipasang mengelilingi tepi taman dengan jarak yang sama, yaitu \(4\) m antara dua lampu berurutan. Banyak lampu yang diperlukan adalah .... (\(\pi=\frac{22}{7}\)).</p>`,
              options: [
                { key: "A", text: h`\(11\)` },
                { key: "B", text: h`\(21\)` },
                { key: "C", text: h`\(22\)` },
                { key: "D", text: h`\(44\)` },
                { key: "E", text: h`\(88\)` },
              ],
              answer: "C",
              explanation: h`<p>Keliling taman \(K=\pi d=\dfrac{22}{7}\cdot28=88\) m. Banyak lampu \(=\dfrac{88}{4}=22\).</p>
<p>Jebakan: \(88\) adalah keliling taman, bukan banyak lampu.</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Pada gambar, \(O\) adalah pusat lingkaran, \(\angle AOB=30^\circ\), dan \(\angle COD=150^\circ\). Jika luas juring \(AOB\) adalah \(24\) cm\(^2\), luas juring \(COD\) adalah .... cm\(^2\).</p>`,
              figure: h`<svg viewBox="0 0 200 220" role="img" aria-label="Lingkaran berpusat O dengan juring AOB 30 derajat dan juring COD 150 derajat" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<circle cx="100.0" cy="110.0" r="85.2" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<path d="M100.0,110.0 L184.0,95.2 A85.2,85.2 0 0 0 165.3,55.2 Z" fill="#e0457b" fill-opacity="0.3" fill-rule="nonzero" stroke="none" stroke-width="2" stroke-linejoin="round"/>
<path d="M100.0,110.0 L85.2,26.0 A85.2,85.2 0 0 0 70.8,190.1 Z" fill="#ea580c" fill-opacity="0.22" fill-rule="nonzero" stroke="none" stroke-width="2" stroke-linejoin="round"/>
<line x1="100.0" y1="110.0" x2="184.0" y2="95.2" stroke="#be123c" stroke-width="2"/>
<line x1="100.0" y1="110.0" x2="165.3" y2="55.2" stroke="#be123c" stroke-width="2"/>
<line x1="100.0" y1="110.0" x2="85.2" y2="26.0" stroke="#be123c" stroke-width="2"/>
<line x1="100.0" y1="110.0" x2="70.8" y2="190.1" stroke="#be123c" stroke-width="2"/>
<circle cx="100.0" cy="110.0" r="2.8" fill="currentColor"/>
<text x="106.6" y="126.8" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="197.5" y="96.8" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="175.8" y="50.4" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="82.8" y="16.5" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="66.1" y="207.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">D</text>
<text x="147.4" y="91.9" text-anchor="middle" font-size="10" fill="currentColor">30&deg;</text>
<text x="58.9" y="110.4" text-anchor="middle" font-size="10" fill="currentColor">150&deg;</text>
</svg>`,
              options: [
                { key: "A", text: h`\(48\)` },
                { key: "B", text: h`\(60\)` },
                { key: "C", text: h`\(72\)` },
                { key: "D", text: h`\(96\)` },
                { key: "E", text: h`\(120\)` },
              ],
              answer: "E",
              explanation: h`<p>Pada lingkaran yang sama, luas juring sebanding dengan sudut pusatnya:</p>
<div class="math-display">\[ \frac{L_{COD}}{L_{AOB}}=\frac{150^\circ}{30^\circ}=5\ \Rightarrow\ L_{COD}=5\times24=120\text{ cm}^2 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Pada gambar, \(AB\) adalah diameter lingkaran berpusat \(O\) dan \(\angle CAB=38^\circ\). Besar \(\angle OCB\) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 200 190" role="img" aria-label="AB diameter lingkaran berpusat O, titik C pada lingkaran, sudut CAB 38 derajat" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<circle cx="100.0" cy="100.0" r="78.0" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<polygon points="22.0,100.0 178.0,100.0 118.9,24.3" fill="#e0457b" fill-opacity="0.12" stroke="#be123c" stroke-width="2" stroke-linejoin="round"/>
<line x1="100.0" y1="100.0" x2="118.9" y2="24.3" stroke="#e0457b" stroke-width="2"/>
<circle cx="100.0" cy="100.0" r="2.8" fill="currentColor"/>
<text x="100.0" y="116.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="13.0" y="104.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="187.0" y="104.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="118.9" y="16.3" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="54.2" y="98.8" text-anchor="middle" font-size="10" fill="currentColor">38&deg;</text>
</svg>`,
              options: [
                { key: "A", text: h`\(38^\circ\)` },
                { key: "B", text: h`\(52^\circ\)` },
                { key: "C", text: h`\(64^\circ\)` },
                { key: "D", text: h`\(76^\circ\)` },
                { key: "E", text: h`\(90^\circ\)` },
              ],
              answer: "B",
              explanation: h`<p>\(AB\) diameter, sehingga \(\angle ACB=90^\circ\) (sudut keliling yang menghadap diameter). Pada \(\triangle ABC\): \(\angle ABC=180^\circ-90^\circ-38^\circ=52^\circ\).</p>
<p>Karena \(OB=OC\) (jari-jari), \(\triangle OBC\) sama kaki dan \(\angle OCB=\angle OBC=52^\circ\).</p>
<p>Jebakan: \(38^\circ\) adalah \(\angle OCA\) dan \(76^\circ\) adalah \(\angle BOC\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Dari titik \(P\) di luar lingkaran berpusat \(O\) ditarik garis singgung \(PA\) dengan \(A\) titik singgung. Jika \(PA=24\) cm dan \(OP=25\) cm, keliling lingkaran tersebut adalah .... cm.</p>`,
              figure: h`<svg viewBox="0 0 260 130" role="img" aria-label="Garis singgung PA dengan PA 24 dan OP 25" style="width: 100%; max-width: 260px; height: auto" font-size="12" font-family="inherit">
<circle cx="55.0" cy="65.0" r="46.8" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<line x1="222.1" y1="65.0" x2="68.1" y2="20.1" stroke="#be123c" stroke-width="2"/>
<line x1="55.0" y1="65.0" x2="68.1" y2="20.1" stroke="#e0457b" stroke-width="2"/>
<line x1="55.0" y1="65.0" x2="222.1" y2="65.0" stroke="#e0457b" stroke-width="2"/>
<polyline points="65.9,27.8 73.5,30.0 75.8,22.3" fill="none" stroke="currentColor" stroke-width="1.3"/>
<circle cx="55.0" cy="65.0" r="2.8" fill="currentColor"/>
<text x="47.0" y="80.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="231.1" y="69.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">P</text>
<text x="68.1" y="12.1" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="155.1" y="38.5" text-anchor="start" font-size="11" fill="currentColor">24</text>
<text x="138.2" y="79.0" text-anchor="middle" font-size="11" fill="currentColor">25</text>
</svg>`,
              options: [
                { key: "A", text: h`\(7\pi\)` },
                { key: "B", text: h`\(10\pi\)` },
                { key: "C", text: h`\(12\pi\)` },
                { key: "D", text: h`\(14\pi\)` },
                { key: "E", text: h`\(25\pi\)` },
              ],
              answer: "D",
              explanation: h`<p>Jari-jari \(OA\) tegak lurus garis singgung \(PA\), sehingga \(\triangle OAP\) siku-siku di \(A\) dan \(OA=\sqrt{25^2-24^2}=\sqrt{49}=7\).</p>
<p>Keliling \(=2\pi\cdot7=14\pi\) cm.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Pusat dan jari-jari lingkaran \(x^2+y^2-6x+2y-6=0\) berturut-turut adalah ....</p>`,
              options: [
                { key: "A", text: h`\((3,-1)\text{ dan }4\)` },
                { key: "B", text: h`\((-3,1)\text{ dan }4\)` },
                { key: "C", text: h`\((3,-1)\text{ dan }16\)` },
                { key: "D", text: h`\((-3,1)\text{ dan }16\)` },
                { key: "E", text: h`\((6,-2)\text{ dan }4\)` },
              ],
              answer: "A",
              explanation: h`<p>Lengkapkan kuadrat: \((x-3)^2+(y+1)^2=6+9+1=16\). Pusat \((3,-1)\) dan jari-jari \(\sqrt{16}=4\).</p>
<p>Jebakan C dan D: \(16\) adalah \(r^2\), bukan \(r\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
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
              prompt: h`<p>Pada gambar, \(AB\) dan \(CD\) adalah tali busur sejajar pada lingkaran berjari-jari \(10\) cm dengan \(AB=16\) cm dan \(CD=12\) cm. Kedua tali busur terletak pada sisi yang berbeda terhadap pusat \(O\). Jarak antara \(AB\) dan \(CD\) adalah .... cm.</p>`,
              figure: h`<svg viewBox="0 0 210 190" role="img" aria-label="Dua tali busur sejajar AB 16 dan CD 12 pada lingkaran berjari-jari 10" style="width: 100%; max-width: 210px; height: auto" font-size="12" font-family="inherit">
<circle cx="105.0" cy="95.0" r="88.4" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<line x1="34.3" y1="42.0" x2="175.7" y2="42.0" stroke="#e0457b" stroke-width="3"/>
<line x1="52.0" y1="165.7" x2="158.0" y2="165.7" stroke="#e0457b" stroke-width="3"/>
<circle cx="105.0" cy="95.0" r="2.8" fill="currentColor"/>
<text x="111.0" y="99.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="26.3" y="46.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="183.7" y="46.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="44.0" y="169.7" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="166.0" y="169.7" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">D</text>
<text x="105.0" y="36.0" text-anchor="middle" font-size="11" fill="currentColor">16</text>
<text x="105.0" y="180.7" text-anchor="middle" font-size="11" fill="currentColor">12</text>
</svg>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(7\)` },
                { key: "C", text: h`\(10\)` },
                { key: "D", text: h`\(14\)` },
                { key: "E", text: h`\(16\)` },
              ],
              answer: "D",
              explanation: h`<p>Jarak \(AB\) ke pusat: \(\sqrt{10^2-8^2}=6\). Jarak \(CD\) ke pusat: \(\sqrt{10^2-6^2}=8\).</p>
<p>Karena berada di sisi berbeda, jarak keduanya \(6+8=14\) cm. Jebakan \(2\): jika kedua tali busur berada di sisi yang sama.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Sebuah juring lingkaran memiliki keliling \(16\) cm dan luas \(15\) cm\(^2\). Jika sudut pusat juring tersebut kurang dari \(\pi\) radian, besar sudut pusatnya adalah .... radian.</p>`,
              options: [
                { key: "A", text: h`\(\frac35\)` },
                { key: "B", text: h`\(\frac65\)` },
                { key: "C", text: h`\(\frac32\)` },
                { key: "D", text: h`\(\frac53\)` },
                { key: "E", text: h`\(\frac{10}{3}\)` },
              ],
              answer: "B",
              explanation: h`<p>Keliling juring \(2r+s=16\) dan luas \(\frac12rs=15\). Substitusi \(s=16-2r\): \(r(16-2r)=30\Rightarrow r^2-8r+15=0\Rightarrow r=3\) atau \(r=5\).</p>
<p>Untuk \(r=3\): \(s=10\) dan \(\theta=\frac{10}{3}\approx3{,}33&gt;\pi\) (ditolak). Untuk \(r=5\): \(s=6\) dan \(\theta=\dfrac sr=\dfrac65&lt;\pi\) (memenuhi).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Dua lingkaran berjari-jari \(8\) cm dan \(2\) cm memiliki jarak kedua pusat \(d\). Perhatikan pernyataan berikut.</p>
<ol>
<li>Jika \(d=10\) cm, terdapat tepat \(3\) garis singgung persekutuan.</li>
<li>Jika \(d=6\) cm, terdapat tepat \(2\) garis singgung persekutuan.</li>
<li>Jika \(d=26\) cm, panjang garis singgung persekutuan dalamnya adalah \(24\) cm.</li>
<li>Jika \(d=12\) cm, panjang garis singgung persekutuan luarnya adalah \(8\) cm.</li>
</ol>
<p>Pernyataan yang benar adalah ....</p>`,
              options: [
                { key: "A", text: h`(1) dan (2) saja` },
                { key: "B", text: h`(2) dan (4) saja` },
                { key: "C", text: h`(1) dan (3) saja` },
                { key: "D", text: h`(1), (3), dan (4) saja` },
                { key: "E", text: h`(2), (3), dan (4) saja` },
              ],
              answer: "C",
              explanation: h`<p><strong>(1) Benar.</strong> \(d=10=8+2\): kedua lingkaran bersinggungan luar, sehingga ada \(3\) garis singgung persekutuan.</p>
<p><strong>(2) Salah.</strong> \(d=6=8-2\): bersinggungan dalam, hanya \(1\) garis singgung persekutuan.</p>
<p><strong>(3) Benar.</strong> \(\sqrt{26^2-(8+2)^2}=\sqrt{576}=24\).</p>
<p><strong>(4) Salah.</strong> \(\sqrt{12^2-(8-2)^2}=\sqrt{108}=6\sqrt3\approx10{,}4\), bukan \(8\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Garis \(y=x+k\) menyinggung lingkaran \((x-2)^2+(y-1)^2=18\). Selisih nilai \(k\) terbesar dan nilai \(k\) terkecil yang memenuhi adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(6\)` },
                { key: "C", text: h`\(7\)` },
                { key: "D", text: h`\(10\)` },
                { key: "E", text: h`\(12\)` },
              ],
              answer: "E",
              explanation: h`<p>Jarak pusat \((2,1)\) ke garis \(x-y+k=0\) harus sama dengan jari-jari \(\sqrt{18}=3\sqrt2\):</p>
<div class="math-display">\[ \frac{|2-1+k|}{\sqrt2}=3\sqrt2\ \Rightarrow\ |k+1|=6 \]</div>
<p>Jadi \(k=5\) atau \(k=-7\), dan selisihnya \(5-(-7)=12\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Pada gambar, \(ABCD\) adalah segiempat tali busur dengan \(\angle DAB=(3x+5)^\circ\), \(\angle ABC=(4x+15)^\circ\), dan \(\angle BCD=(5x-25)^\circ\). Besar \(\angle ADC\) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 200 190" role="img" aria-label="Segiempat tali busur ABCD" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<circle cx="100.0" cy="95.0" r="79.8" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<polygon points="25.1,122.3 100.0,174.8 169.1,134.9 127.3,20.1" fill="#e0457b" fill-opacity="0.12" stroke="#e0457b" stroke-width="2.6" stroke-linejoin="round"/>
<text x="14.7" y="130.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="100.0" y="189.8" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="178.6" y="144.4" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="131.0" y="13.7" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">D</text>
</svg>`,
              options: [
                { key: "A", text: h`\(65^\circ\)` },
                { key: "B", text: h`\(80^\circ\)` },
                { key: "C", text: h`\(100^\circ\)` },
                { key: "D", text: h`\(115^\circ\)` },
                { key: "E", text: h`\(125^\circ\)` },
              ],
              answer: "A",
              explanation: h`<p>Sudut berhadapan segiempat tali busur berjumlah \(180^\circ\): \(\angle DAB+\angle BCD=(3x+5)+(5x-25)=180\Rightarrow x=25\).</p>
<p>Maka \(\angle ABC=4(25)+15=115^\circ\) dan \(\angle ADC=180^\circ-115^\circ=65^\circ\). Jebakan: \(115^\circ\) adalah \(\angle ABC\).</p>
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
              prompt: h`<p>Pada segitiga sama sisi \(ABC\) dengan panjang sisi \(12\) cm, dibuat tiga lingkaran berjari-jari \(6\) cm yang masing-masing berpusat di \(A\), \(B\), dan \(C\). Luas daerah arsiran, yaitu daerah di dalam segitiga yang berada di luar ketiga lingkaran, adalah .... cm\(^2\).</p>`,
              figure: h`<svg viewBox="0 0 210 215" role="img" aria-label="Segitiga sama sisi ABC sisi 12 dengan tiga busur lingkaran berjari-jari 6 di tiap titik sudut" style="width: 100%; max-width: 210px; height: auto" font-size="12" font-family="inherit">
<path d="M5.8,190.0 L204.2,190.0 L105.0,18.2 Z M5.8,190.0 L105.0,190.0 A99.2,99.2 0 0 0 55.4,104.1 Z M204.2,190.0 L105.0,190.0 A99.2,99.2 0 0 1 154.6,104.1 Z M105.0,18.2 L55.4,104.1 A99.2,99.2 0 0 0 154.6,104.1 Z" fill="#e0457b" fill-opacity="0.35" fill-rule="evenodd" stroke="none" stroke-width="2" stroke-linejoin="round"/>
<polygon points="5.8,190.0 204.2,190.0 105.0,18.2" fill="none" fill-opacity="0" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M105.0,190.0 A99.2,99.2 0 0 0 55.4,104.1" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M105.0,190.0 A99.2,99.2 0 0 1 154.6,104.1" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M55.4,104.1 A99.2,99.2 0 0 0 154.6,104.1" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
<text x="-2.2" y="194.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="212.2" y="194.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="105.0" y="10.2" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="105.0" y="206.0" text-anchor="middle" font-size="11" fill="currentColor">12</text>
</svg>`,
              options: [
                { key: "A", text: h`\(18\sqrt3-9\pi\)` },
                { key: "B", text: h`\(36\sqrt3-18\pi\)` },
                { key: "C", text: h`\(72\sqrt3-36\pi\)` },
                { key: "D", text: h`\(36\sqrt3-9\pi\)` },
                { key: "E", text: h`\(72\sqrt3-18\pi\)` },
              ],
              answer: "B",
              explanation: h`<p>Luas segitiga sama sisi dengan sisi \(12\): \(\frac{\sqrt3}{4}\cdot144=36\sqrt3\).</p>
<p>Ketiga juring masing-masing bersudut \(60^\circ\) dan berjari-jari \(6\), sehingga jumlah luasnya \(3\cdot\frac16\pi\cdot36=18\pi\) (setara setengah lingkaran).</p>
<p>Luas arsiran \(=36\sqrt3-18\pi\) (sekitar \(5{,}8\) cm\(^2\)).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Sebuah sabuk melilit ketat dua roda yang berjari-jari \(10\) cm dan \(4\) cm, dengan jarak kedua pusat \(12\) cm (lihat gambar). Panjang sabuk tersebut adalah .... cm.</p>`,
              figure: h`<svg viewBox="0 0 300 250" role="img" aria-label="Sabuk melilit dua roda berjari-jari 10 dan 4 dengan jarak pusat 12" style="width: 100%; max-width: 300px; height: auto" font-size="12" font-family="inherit">
<circle cx="120.0" cy="115.0" r="100.0" fill="#e0457b" fill-opacity="0.08" stroke="#be123c" stroke-width="1.5"/>
<circle cx="240.0" cy="115.0" r="40.0" fill="#e0457b" fill-opacity="0.08" stroke="#be123c" stroke-width="1.5"/>
<path d="M170.0,28.4 L260.0,80.4 A40.0,40.0 0 0 1 260.0,149.6 L170.0,201.6 A100.0,100.0 0 1 1 170.0,28.4" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="#e0457b" stroke-width="3.2" stroke-linejoin="round"/>
<circle cx="120.0" cy="115.0" r="2.8" fill="currentColor"/>
<circle cx="240.0" cy="115.0" r="2.8" fill="currentColor"/>
<text x="114.0" y="130.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">O<tspan font-size="9" dy="3">1</tspan></text>
<text x="240.0" y="131.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">O<tspan font-size="9" dy="3">2</tspan></text>
<line x1="120.0" y1="115.0" x2="33.4" y2="65.0" stroke="currentColor" stroke-width="1.2"/>
<text x="76.7" y="84.0" text-anchor="middle" font-size="10" fill="currentColor">10</text>
<line x1="240.0" y1="115.0" x2="280.0" y2="115.0" stroke="currentColor" stroke-width="1.2"/>
<text x="260.0" y="128.0" text-anchor="middle" font-size="10" fill="currentColor">4</text>
<line x1="120.0" y1="227.0" x2="240.0" y2="227.0" stroke="currentColor" stroke-width="1.2"/>
<text x="180.0" y="241.0" text-anchor="middle" font-size="11" fill="currentColor">12</text>
</svg>`,
              options: [
                { key: "A", text: h`\(6\sqrt3+16\pi\)` },
                { key: "B", text: h`\(12\sqrt3+14\pi\)` },
                { key: "C", text: h`\(12\sqrt3+16\pi\)` },
                { key: "D", text: h`\(24\sqrt3+16\pi\)` },
                { key: "E", text: h`\(12\sqrt3+28\pi\)` },
              ],
              answer: "C",
              explanation: h`<p>Panjang sabuk \(=\) dua garis singgung persekutuan luar \(+\) dua busur. Garis singgung: \(\sqrt{12^2-(10-4)^2}=6\sqrt3\), jadi dua garis \(=12\sqrt3\).</p>
<p>Sudut \(\alpha\) antara garis pusat dan jari-jari ke titik singgung memenuhi \(\cos\alpha=\dfrac{10-4}{12}=\dfrac12\), sehingga \(\alpha=60^\circ\).</p>
<p>Busur roda besar \(=360^\circ-2\cdot60^\circ=240^\circ\): \(\frac{240}{360}\cdot2\pi\cdot10=\frac{40\pi}{3}\). Busur roda kecil \(=2\cdot60^\circ=120^\circ\): \(\frac{120}{360}\cdot2\pi\cdot4=\frac{8\pi}{3}\). Jumlah busur \(=16\pi\).</p>
<p>Panjang sabuk \(=12\sqrt3+16\pi\). Jebakan B: memakai \(180^\circ\) untuk kedua busur, hasilnya \(12\sqrt3+14\pi\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Segitiga \(ABC\) siku-siku di \(B\). Lingkaran dalam segitiga tersebut menyinggung sisi \(AC\) di titik \(D\). Jika \(AD=3\) cm dan \(DC=10\) cm, luas segitiga \(ABC\) adalah .... cm\(^2\).</p>`,
              figure: h`<svg viewBox="0 0 275 150" role="img" aria-label="Segitiga ABC siku-siku di B dengan lingkaran dalam menyinggung AC di D, AD 3 dan DC 10" style="width: 100%; max-width: 275px; height: auto" font-size="12" font-family="inherit">
<circle cx="62.2" cy="82.8" r="37.2" fill="#e0457b" fill-opacity="0.15" stroke="#e0457b" stroke-width="2"/>
<polygon points="25.0,27.0 25.0,120.0 248.2,120.0" fill="none" fill-opacity="0" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
<polyline points="33.0,120.0 33.0,112.0 25.0,112.0" fill="none" stroke="currentColor" stroke-width="1.3"/>
<circle cx="76.5" cy="48.5" r="3" fill="currentColor"/>
<text x="17.0" y="31.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="17.0" y="134.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="256.2" y="124.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="83.5" y="42.5" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">D</text>
<text x="56.8" y="30.7" text-anchor="middle" font-size="11" fill="currentColor">3</text>
<text x="168.4" y="78.2" text-anchor="middle" font-size="11" fill="currentColor">10</text>
</svg>`,
              options: [
                { key: "A", text: h`\(20\)` },
                { key: "B", text: h`\(24\)` },
                { key: "C", text: h`\(28\)` },
                { key: "D", text: h`\(30\)` },
                { key: "E", text: h`\(39\)` },
              ],
              answer: "D",
              explanation: h`<p>Panjang garis singgung dari satu titik ke lingkaran sama: \(AF=AD=3\) dan \(CE=CD=10\), sehingga \(AC=13\). Karena siku-siku di \(B\), \(BF=BE=r\), jadi \(AB=3+r\) dan \(BC=10+r\).</p>
<div class="math-display">\[ (3+r)^2+(10+r)^2=13^2\ \Rightarrow\ r^2+13r-30=0\ \Rightarrow\ (r+15)(r-2)=0\ \Rightarrow\ r=2 \]</div>
<p>Sisi \(AB=5\), \(BC=12\), dan luas \(=\frac12\cdot5\cdot12=30\) cm\(^2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Dua lingkaran menyinggung sumbu-\(x\) dan sumbu-\(y\) sekaligus, serta keduanya melalui titik \((1,2)\). Jarak antara kedua pusat lingkaran tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 294 294" role="img" aria-label="Dua lingkaran yang menyinggung sumbu-x dan sumbu-y serta melalui titik (1,2)" style="width: 100%; max-width: 294px; height: auto" font-size="12" font-family="inherit">
<line x1="26.0" y1="268.0" x2="26.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="48.0" y1="268.0" x2="48.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="70.0" y1="268.0" x2="70.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="92.0" y1="268.0" x2="92.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="114.0" y1="268.0" x2="114.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="136.0" y1="268.0" x2="136.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="158.0" y1="268.0" x2="158.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="180.0" y1="268.0" x2="180.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="202.0" y1="268.0" x2="202.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="224.0" y1="268.0" x2="224.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="246.0" y1="268.0" x2="246.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="268.0" y1="268.0" x2="268.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="268.0" x2="268.0" y2="268.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="246.0" x2="268.0" y2="246.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="224.0" x2="268.0" y2="224.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="202.0" x2="268.0" y2="202.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="180.0" x2="268.0" y2="180.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="158.0" x2="268.0" y2="158.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="136.0" x2="268.0" y2="136.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="114.0" x2="268.0" y2="114.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="92.0" x2="268.0" y2="92.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="70.0" x2="268.0" y2="70.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="48.0" x2="268.0" y2="48.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="26.0" x2="268.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="268.0" x2="276.0" y2="268.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="26.0" y1="268.0" x2="26.0" y2="18.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="276.0,268.0 269.0,264.5 269.0,271.5" fill="currentColor"/>
<polygon points="26.0,18.0 22.5,25.0 29.5,25.0" fill="currentColor"/>
<text x="279.0" y="272.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">x</text>
<text x="33.0" y="20.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">y</text>
<text x="48.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="70.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="92.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="114.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="136.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">5</text>
<text x="158.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="180.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">7</text>
<text x="202.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<text x="224.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">9</text>
<text x="246.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">10</text>
<text x="268.0" y="281.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">11</text>
<text x="21.0" y="249.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="21.0" y="227.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="21.0" y="205.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="21.0" y="183.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="21.0" y="161.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">5</text>
<text x="21.0" y="139.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="21.0" y="117.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">7</text>
<text x="21.0" y="95.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<text x="21.0" y="73.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">9</text>
<text x="21.0" y="51.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">10</text>
<text x="21.0" y="29.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">11</text>
<circle cx="48.0" cy="246.0" r="22" fill="#e0457b" fill-opacity=".1" stroke="#be123c" stroke-width="2.2"/>
<circle cx="136.0" cy="158.0" r="110" fill="#e0457b" fill-opacity=".1" stroke="#be123c" stroke-width="2.2"/>
<circle cx="48.0" cy="224.0" r="3.2" fill="#dc2626"/>
<text x="54.0" y="219.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">(1,2)</text>
</svg>`,
              options: [
                { key: "A", text: h`\(4\sqrt2\)` },
                { key: "B", text: h`\(6\)` },
                { key: "C", text: h`\(8\)` },
                { key: "D", text: h`\(6\sqrt2\)` },
                { key: "E", text: h`\(8\sqrt2\)` },
              ],
              answer: "A",
              explanation: h`<p>Lingkaran yang menyinggung kedua sumbu dan melalui \((1,2)\) (kuadran I) berpusat di \((r,r)\) dengan jari-jari \(r\). Syarat: \((1-r)^2+(2-r)^2=r^2\Rightarrow r^2-6r+5=0\Rightarrow r=1\) atau \(r=5\).</p>
<p>Pusatnya \((1,1)\) dan \((5,5)\), dengan jarak \(\sqrt{4^2+4^2}=4\sqrt2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Dari titik \(P\) di luar lingkaran berpusat \(O\) ditarik garis singgung \(PA\) dan \(PB\) dengan \(\angle APB=60^\circ\) dan \(PA=6\sqrt3\) cm. Luas daerah arsiran, yaitu daerah yang dibatasi \(PA\), \(PB\), dan busur minor \(AB\), adalah .... cm\(^2\).</p>`,
              figure: h`<svg viewBox="0 0 320 190" role="img" aria-label="Garis singgung PA dan PB dengan sudut APB 60 derajat dan daerah arsiran di antara PA, PB, dan busur AB" style="width: 100%; max-width: 320px; height: auto" font-size="12" font-family="inherit">
<path d="M297.2,95.0 L156.8,13.9 A93.6,93.6 0 0 1 156.8,176.1 Z" fill="#e0457b" fill-opacity="0.35" fill-rule="nonzero" stroke="none" stroke-width="2" stroke-linejoin="round"/>
<circle cx="110.0" cy="95.0" r="93.6" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<line x1="297.2" y1="95.0" x2="156.8" y2="13.9" stroke="#be123c" stroke-width="2"/>
<line x1="297.2" y1="95.0" x2="156.8" y2="176.1" stroke="#be123c" stroke-width="2"/>
<line x1="110.0" y1="95.0" x2="156.8" y2="13.9" stroke="currentColor" stroke-width="1" stroke-dasharray="6 4"/>
<line x1="110.0" y1="95.0" x2="156.8" y2="176.1" stroke="currentColor" stroke-width="1" stroke-dasharray="6 4"/>
<line x1="110.0" y1="95.0" x2="297.2" y2="95.0" stroke="currentColor" stroke-width="1" stroke-dasharray="6 4"/>
<circle cx="110.0" cy="95.0" r="2.8" fill="currentColor"/>
<text x="103.0" y="99.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="306.2" y="99.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">P</text>
<text x="162.0" y="8.9" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="162.0" y="189.1" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="262.0" y="91.0" text-anchor="end" font-size="10" fill="currentColor">60&deg;</text>
<text x="237.0" y="50.4" text-anchor="start" font-size="11" fill="currentColor">6&#8730;3</text>
</svg>`,
              options: [
                { key: "A", text: h`\(12\pi-18\sqrt3\)` },
                { key: "B", text: h`\(18\sqrt3-6\pi\)` },
                { key: "C", text: h`\(36\sqrt3-12\pi\)` },
                { key: "D", text: h`\(36\sqrt3-6\pi\)` },
                { key: "E", text: h`\(72\sqrt3-12\pi\)` },
              ],
              answer: "C",
              explanation: h`<p>\(OP\) membagi dua \(\angle APB\), sehingga \(\angle APO=30^\circ\). Pada \(\triangle OAP\) siku-siku di \(A\): \(OA=PA\tan30^\circ=6\sqrt3\cdot\frac1{\sqrt3}=6\).</p>
<p>Luas layang-layang \(OAPB=2\cdot\frac12\cdot6\cdot6\sqrt3=36\sqrt3\). Sudut \(\angle AOB=360^\circ-90^\circ-90^\circ-60^\circ=120^\circ\), sehingga luas juring \(AOB=\frac13\pi\cdot36=12\pi\).</p>
<p>Luas arsiran \(=36\sqrt3-12\pi\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
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
              prompt: h`<p>Sebuah koin berjari-jari \(2\) cm menggelinding tanpa slip mengelilingi (di luar) sebuah koin tetap berjari-jari \(6\) cm sampai kembali ke posisi semula. Selama itu, koin yang menggelinding berputar terhadap pusatnya sendiri sebanyak .... putaran penuh.</p>`,
              figure: h`<svg viewBox="0 0 290 290" role="img" aria-label="Koin kecil berjari-jari 2 menggelinding mengelilingi koin tetap berjari-jari 6" style="width: 100%; max-width: 290px; height: auto" font-size="12" font-family="inherit">
<defs><marker id="mx-a16" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<circle cx="145.0" cy="145.0" r="75.0" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.8"/>
<text x="145.0" y="149.0" text-anchor="middle" font-size="12" fill="currentColor">6</text>
<circle cx="145.0" cy="145.0" r="100.0" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>
<circle cx="245.0" cy="145.0" r="25.0" fill="#e0457b" fill-opacity="0.25" stroke="#e0457b" stroke-width="2"/>
<circle cx="95.0" cy="58.4" r="25.0" fill="#e0457b" fill-opacity="0.25" stroke="#e0457b" stroke-width="2"/>
<circle cx="95.0" cy="231.6" r="25.0" fill="#e0457b" fill-opacity="0.25" stroke="#e0457b" stroke-width="2"/>
<text x="245.0" y="149.0" text-anchor="middle" font-size="11" fill="currentColor">2</text>
<path d="M268.1,100.2 A131.0,131.0 0 0 0 178.9,18.5" fill="none" stroke="#ea580c" stroke-width="2" marker-end="url(#mx-a16)"/>
</svg>`,
              options: [
                { key: "A", text: h`\(3\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(5\)` },
                { key: "D", text: h`\(6\)` },
                { key: "E", text: h`\(8\)` },
              ],
              answer: "B",
              explanation: h`<p>Pusat koin yang menggelinding bergerak pada lingkaran berjari-jari \(6+2=8\) cm, dengan panjang lintasan \(2\pi\cdot8=16\pi\). Koin berputar satu kali setiap menempuh \(2\pi\cdot2=4\pi\).</p>
<div class="math-display">\[ \text{Banyak putaran}=\frac{16\pi}{4\pi}=4=\frac{R+r}{r} \]</div>
<p>Jebakan \(3\): memakai \(\frac Rr\) saja.</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "hots",
              prompt: h`<p>Dua belas titik ditempatkan pada sebuah lingkaran sehingga membagi lingkaran menjadi dua belas busur yang sama panjang. Banyak segitiga siku-siku berbeda yang ketiga titik sudutnya dipilih dari kedua belas titik tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 210 190" role="img" aria-label="Dua belas titik membagi lingkaran sama panjang dengan contoh segitiga siku-siku" style="width: 100%; max-width: 210px; height: auto" font-size="12" font-family="inherit">
<circle cx="105.0" cy="95.0" r="87.0" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<circle cx="192.0" cy="95.0" r="3" fill="currentColor"/>
<circle cx="180.3" cy="51.5" r="3" fill="currentColor"/>
<circle cx="148.5" cy="19.7" r="3" fill="currentColor"/>
<circle cx="105.0" cy="8.0" r="3" fill="currentColor"/>
<circle cx="61.5" cy="19.7" r="3" fill="currentColor"/>
<circle cx="29.7" cy="51.5" r="3" fill="currentColor"/>
<circle cx="18.0" cy="95.0" r="3" fill="currentColor"/>
<circle cx="29.7" cy="138.5" r="3" fill="currentColor"/>
<circle cx="61.5" cy="170.3" r="3" fill="currentColor"/>
<circle cx="105.0" cy="182.0" r="3" fill="currentColor"/>
<circle cx="148.5" cy="170.3" r="3" fill="currentColor"/>
<circle cx="180.3" cy="138.5" r="3" fill="currentColor"/>
<polygon points="192.0,95.0 18.0,95.0 148.5,19.7" fill="#e0457b" fill-opacity="0.15" stroke="#e0457b" stroke-width="2.2" stroke-linejoin="round"/>
<polyline points="153.0,27.5 145.2,32.0 140.7,24.2" fill="none" stroke="currentColor" stroke-width="1.3"/>
</svg>`,
              options: [
                { key: "A", text: h`\(30\)` },
                { key: "B", text: h`\(36\)` },
                { key: "C", text: h`\(48\)` },
                { key: "D", text: h`\(54\)` },
                { key: "E", text: h`\(60\)` },
              ],
              answer: "E",
              explanation: h`<p>Segitiga yang titik sudutnya pada lingkaran siku-siku jika dan hanya jika sisi miringnya diameter (kebalikan teorema sudut keliling pada diameter). Dari \(12\) titik terdapat \(6\) diameter.</p>
<p>Untuk setiap diameter, titik sudut siku-sikunya dapat dipilih dari \(10\) titik lain, sehingga banyaknya \(=6\times10=60\). Tidak ada hitungan ganda karena setiap segitiga siku-siku hanya memiliki satu sisi miring.</p>
<p>Jebakan \(120\): menghitung \(12\times10\), sehingga tiap diameter terhitung dua kali.</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "hots",
              prompt: h`<p>Pada lingkaran, tali busur \(AB=8\) cm tetap, sedangkan titik \(P\) bergerak pada busur mayor \(AB\) sehingga \(\angle APB=30^\circ\) selalu. Luas maksimum segitiga \(APB\) adalah .... cm\(^2\).</p>`,
              figure: h`<svg viewBox="0 0 210 205" role="img" aria-label="Tali busur AB 8 dengan titik P pada busur mayor sehingga sudut APB 30 derajat" style="width: 100%; max-width: 210px; height: auto" font-size="12" font-family="inherit">
<circle cx="105.0" cy="105.0" r="90.0" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<polygon points="60.0,182.9 150.0,182.9 74.2,20.4" fill="#e0457b" fill-opacity="0.25" stroke="#e0457b" stroke-width="2.2" stroke-linejoin="round"/>
<circle cx="105.0" cy="105.0" r="2.8" fill="currentColor"/>
<text x="52.0" y="186.9" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="158.0" y="186.9" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="74.2" y="12.4" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">P</text>
<text x="105.0" y="196.9" text-anchor="middle" font-size="11" fill="currentColor">8</text>
<text x="74.2" y="62.7" text-anchor="middle" font-size="10" fill="currentColor">30&deg;</text>
</svg>`,
              options: [
                { key: "A", text: h`\(16+8\sqrt3\)` },
                { key: "B", text: h`\(32+8\sqrt3\)` },
                { key: "C", text: h`\(24+16\sqrt3\)` },
                { key: "D", text: h`\(32+16\sqrt3\)` },
                { key: "E", text: h`\(64+16\sqrt3\)` },
              ],
              answer: "D",
              explanation: h`<p>Jari-jari lingkaran luar: \(AB=2R\sin30^\circ\Rightarrow R=\dfrac{8}{2\cdot\frac12}=8\). Jarak pusat ke \(AB\) adalah \(\sqrt{8^2-4^2}=4\sqrt3\).</p>
<p>Karena \(30^\circ&lt;90^\circ\), \(P\) berada di sisi yang sama dengan pusat. Tinggi terbesar tercapai bila \(P\) tepat di atas pusat pada sumbu simetri, yaitu \(8+4\sqrt3\).</p>
<p>Luas maksimum \(=\frac12\cdot8\cdot(8+4\sqrt3)=32+16\sqrt3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt: h`<p>Diketahui titik \(A(-3,0)\) dan \(B(3,0)\). Himpunan semua titik \(P(x,y)\) yang memenuhi \(PA=2\,PB\) membentuk sebuah lingkaran. Luas daerah yang dibatasi lingkaran tersebut adalah ....</p>`,
              options: [
                { key: "A", text: h`\(4\pi\)` },
                { key: "B", text: h`\(8\pi\)` },
                { key: "C", text: h`\(9\pi\)` },
                { key: "D", text: h`\(12\pi\)` },
                { key: "E", text: h`\(16\pi\)` },
              ],
              answer: "E",
              explanation: h`<div class="math-display">\[ PA=2PB\ \Rightarrow\ (x+3)^2+y^2=4\big[(x-3)^2+y^2\big]\ \Rightarrow\ x^2-10x+y^2+9=0 \]</div>
<p>Yaitu \((x-5)^2+y^2=16\). Jari-jari \(4\), luas \(=16\pi\). Pemeriksaan: titik \((1,0)\) memberi \(PA=4\) dan \(PB=2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "hots",
              prompt: h`<p>Berapakah luas daerah tembereng yang dibatasi tali busur \(AB\) dan busur minor \(AB\) pada lingkaran berpusat \(O\)?</p>
<ol>
<li>Jari-jari lingkaran adalah \(12\) cm.</li>
<li>Jarak \(O\) ke tali busur \(AB\) adalah \(6\) cm.</li>
</ol>`,
              options: [
                { key: "A", text: h`Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup.` },
                { key: "B", text: h`Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup.` },
                { key: "C", text: h`DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.` },
                { key: "D", text: h`Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA cukup untuk menjawab pertanyaan.` },
                { key: "E", text: h`Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan.` },
              ],
              answer: "C",
              explanation: h`<p>Pernyataan (1) saja hanya memberi \(r\), sedangkan besar sudut pusat belum diketahui. Pernyataan (2) saja hanya memberi jarak tanpa \(r\).</p>
<p>Gabungan: \(\cos\dfrac{\angle AOB}{2}=\dfrac{6}{12}\Rightarrow\dfrac{\angle AOB}2=60^\circ\), sehingga \(\angle AOB=120^\circ\) dan luas tembereng \(=\frac13\pi\cdot144-\frac12\cdot144\sin120^\circ=48\pi-36\sqrt3\). Jadi keduanya diperlukan bersama-sama.</p>
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
              prompt: h`<p>Pada gambar, \(O\) adalah pusat lingkaran berjari-jari \(10\) cm dan \(\angle AOB=90^\circ\). Luas daerah arsiran (tembereng) adalah .... cm\(^2\) (tuliskan dalam bentuk \(\pi\)).</p>`,
              figure: h`<svg viewBox="0 0 200 190" role="img" aria-label="Tembereng dengan sudut pusat AOB 90 derajat dan jari-jari 10" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<path d="M95.0,15.0 A80.0,80.0 0 0 1 175.0,95.0 Z" fill="#e0457b" fill-opacity="0.35" fill-rule="nonzero" stroke="none" stroke-width="2" stroke-linejoin="round"/>
<circle cx="95.0" cy="95.0" r="80.0" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<line x1="95.0" y1="95.0" x2="95.0" y2="15.0" stroke="#be123c" stroke-width="2"/>
<line x1="95.0" y1="95.0" x2="175.0" y2="95.0" stroke="#be123c" stroke-width="2"/>
<line x1="95.0" y1="15.0" x2="175.0" y2="95.0" stroke="#be123c" stroke-width="2"/>
<polyline points="95.0,86.0 104.0,86.0 104.0,95.0" fill="none" stroke="currentColor" stroke-width="1.3"/>
<circle cx="95.0" cy="95.0" r="2.8" fill="currentColor"/>
<text x="88.0" y="109.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="95.0" y="7.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="184.0" y="99.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="88.0" y="59.0" text-anchor="end" font-size="11" fill="currentColor">10</text>
</svg>`,
              answer: ["25π-50", "25pi-50", h`25\pi-50`],
              explanation: h`<p>Tembereng \(=\) juring \(-\) segitiga \(=\frac14\pi\cdot10^2-\frac12\cdot10\cdot10=\) <strong>\(25\pi-50\)</strong> cm\(^2\).</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Segienam beraturan dengan panjang sisi \(6\) cm digambar bersama lingkaran luarnya dan lingkaran dalamnya. Luas daerah arsiran di antara kedua lingkaran tersebut adalah .... cm\(^2\) (tuliskan dalam bentuk \(\pi\)).</p>`,
              figure: h`<svg viewBox="0 0 235 200" role="img" aria-label="Segienam beraturan sisi 6 dengan lingkaran luar dan lingkaran dalam, daerah di antaranya diarsir" style="width: 100%; max-width: 235px; height: auto" font-size="12" font-family="inherit">
<path d="M208.6,100.0 A93.6,93.6 0 1 0 208.6,100.2 Z M196.1,100.0 A81.1,81.1 0 1 0 196.1,100.1 Z" fill="#e0457b" fill-opacity="0.35" fill-rule="evenodd" stroke="none" stroke-width="2" stroke-linejoin="round"/>
<circle cx="115.0" cy="100.0" r="93.6" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<circle cx="115.0" cy="100.0" r="81.1" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<polygon points="208.6,100.0 161.8,18.9 68.2,18.9 21.4,100.0 68.2,181.1 161.8,181.1" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
<text x="194.2" y="55.5" text-anchor="start" font-size="11" fill="currentColor">6</text>
</svg>`,
              answer: ["9π", "9pi", h`9\pi`],
              explanation: h`<p>Jari-jari lingkaran luar \(R=6\) (sama dengan sisi segienam beraturan) dan jari-jari lingkaran dalam \(r=3\sqrt3\). Luas cincin \(=\pi(R^2-r^2)=\pi(36-27)=\) <strong>\(9\pi\)</strong>.</p>
<p>Perhatikan \(R^2-r^2=\left(\frac{\text{sisi}}2\right)^2\), sehingga luas cincin selalu \(\pi\left(\frac62\right)^2\).</p>`,
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
              prompt: h`<p>Tiga lingkaran berjari-jari \(3\) cm, \(4\) cm, dan \(5\) cm saling bersinggungan di luar (lihat gambar). Luas segitiga yang titik-titik sudutnya adalah pusat ketiga lingkaran tersebut adalah .... cm\(^2\).</p>`,
              figure: h`<svg viewBox="0 0 260 270" role="img" aria-label="Tiga lingkaran berjari-jari 3, 4, dan 5 yang saling bersinggungan di luar" style="width: 100%; max-width: 260px; height: auto" font-size="12" font-family="inherit">
<circle cx="70.0" cy="200.0" r="45.0" fill="#e0457b" fill-opacity="0.15" stroke="#be123c" stroke-width="2"/>
<circle cx="175.0" cy="200.0" r="60.0" fill="#ea580c" fill-opacity="0.12" stroke="#e0457b" stroke-width="2"/>
<circle cx="104.3" cy="85.0" r="75.0" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="1.8"/>
<polygon points="70.0,200.0 175.0,200.0 104.3,85.0" fill="none" fill-opacity="0" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-dasharray="6 4"/>
<circle cx="70.0" cy="200.0" r="2.8" fill="currentColor"/>
<circle cx="175.0" cy="200.0" r="2.8" fill="currentColor"/>
<circle cx="104.3" cy="85.0" r="2.8" fill="currentColor"/>
<text x="63.0" y="214.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="182.0" y="214.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="104.3" y="76.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="47.5" y="186.5" text-anchor="middle" font-size="10" fill="currentColor">3</text>
<text x="207.5" y="186.5" text-anchor="middle" font-size="10" fill="currentColor">4</text>
<text x="117.5" y="61.5" text-anchor="middle" font-size="10" fill="currentColor">5</text>
</svg>`,
              answer: ["12√5", "12sqrt5", h`12\sqrt5`, "12sqrt(5)", "12√(5)"],
              explanation: h`<p>Sisi segitiga pusat adalah jumlah dua jari-jari: \(3+4=7\), \(3+5=8\), dan \(4+5=9\). Setengah keliling \(s=12\).</p>
<p>Rumus Heron: \(L=\sqrt{12\cdot5\cdot4\cdot3}=\sqrt{720}=\) <strong>\(12\sqrt5\)</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Titik \(T(6,2)\) terletak pada lingkaran \(x^2+y^2-6x+4y-12=0\). Garis singgung lingkaran di titik \(T\) bersama sumbu-\(x\) dan sumbu-\(y\) membatasi sebuah segitiga (daerah arsiran). Luas segitiga tersebut adalah .... satuan luas (tuliskan sebagai pecahan, misalnya 3/2).</p>`,
              figure: h`<svg viewBox="0 0 290 341" role="img" aria-label="Lingkaran berpusat di (3,-2) berjari-jari 5 dengan garis singgung di T(6,2) dan segitiga arsiran" style="width: 100%; max-width: 290px; height: auto" font-size="12" font-family="inherit">
<line x1="26.0" y1="315.0" x2="26.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="43.0" y1="315.0" x2="43.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="60.0" y1="315.0" x2="60.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="77.0" y1="315.0" x2="77.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="94.0" y1="315.0" x2="94.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="111.0" y1="315.0" x2="111.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="128.0" y1="315.0" x2="128.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="145.0" y1="315.0" x2="145.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="162.0" y1="315.0" x2="162.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="179.0" y1="315.0" x2="179.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="196.0" y1="315.0" x2="196.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="213.0" y1="315.0" x2="213.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="230.0" y1="315.0" x2="230.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="247.0" y1="315.0" x2="247.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="264.0" y1="315.0" x2="264.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="315.0" x2="264.0" y2="315.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="298.0" x2="264.0" y2="298.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="281.0" x2="264.0" y2="281.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="264.0" x2="264.0" y2="264.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="247.0" x2="264.0" y2="247.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="230.0" x2="264.0" y2="230.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="213.0" x2="264.0" y2="213.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="196.0" x2="264.0" y2="196.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="179.0" x2="264.0" y2="179.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="162.0" x2="264.0" y2="162.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="145.0" x2="264.0" y2="145.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="128.0" x2="264.0" y2="128.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="111.0" x2="264.0" y2="111.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="94.0" x2="264.0" y2="94.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="77.0" x2="264.0" y2="77.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="60.0" x2="264.0" y2="60.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="43.0" x2="264.0" y2="43.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="26.0" x2="264.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="179.0" x2="272.0" y2="179.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="77.0" y1="315.0" x2="77.0" y2="18.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="272.0,179.0 265.0,175.5 265.0,182.5" fill="currentColor"/>
<polygon points="77.0,18.0 73.5,25.0 80.5,25.0" fill="currentColor"/>
<text x="275.0" y="183.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">x</text>
<text x="84.0" y="20.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">y</text>
<text x="43.0" y="192.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">-2</text>
<text x="111.0" y="192.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="145.0" y="192.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="179.0" y="192.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="213.0" y="192.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<text x="247.0" y="192.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">10</text>
<text x="72.0" y="318.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">-8</text>
<text x="72.0" y="284.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">-6</text>
<text x="72.0" y="250.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">-4</text>
<text x="72.0" y="216.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">-2</text>
<text x="72.0" y="148.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="72.0" y="114.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="72.0" y="80.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="72.0" y="46.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<polygon points="77.0,179.0 224.3,179.0 77.0,68.5" fill="#e0457b" fill-opacity=".25"/>
<circle cx="128.0" cy="213.0" r="85" fill="none" stroke="#be123c" stroke-width="2.2"/>
<line x1="54.3" y1="51.5" x2="235.7" y2="187.5" stroke="currentColor" stroke-width="2"/>
<circle cx="179.0" cy="145.0" r="3.2" fill="#dc2626"/>
<text x="185.0" y="139.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">T</text>
<circle cx="128.0" cy="213.0" r="3.2" fill="currentColor"/>
</svg>`,
              answer: ["169/6"],
              explanation: h`<p>Bentuk baku: \((x-3)^2+(y+2)^2=25\), pusat \((3,-2)\). Garis singgung di \((6,2)\): \((6-3)(x-3)+(2+2)(y+2)=25\Rightarrow3x+4y=26\).</p>
<p>Titik potong sumbu: \(\left(\frac{26}3,0\right)\) dan \(\left(0,\frac{13}2\right)\). Luas \(=\frac12\cdot\frac{26}3\cdot\frac{13}2=\) <strong>\(\dfrac{169}{6}\)</strong>.</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Gambar menunjukkan tiga setengah lingkaran dengan diameter \(AB\), \(AC\), dan \(CB\), dengan \(C\) terletak pada \(AB\), \(AC=8\) cm, dan \(CB=20\) cm. Luas daerah arsiran adalah .... cm\(^2\) (tuliskan dalam bentuk \(\pi\)).</p>`,
              figure: h`<svg viewBox="0 0 210 120" role="img" aria-label="Tiga setengah lingkaran berdiameter AB, AC, dan CB dengan AC 8 dan CB 20" style="width: 100%; max-width: 210px; height: auto" font-size="12" font-family="inherit">
<path d="M15.0,100.0 A88.2,88.2 0 0 1 191.4,100.0 Z M15.0,100.0 A25.2,25.2 0 0 1 65.4,100.0 Z M65.4,100.0 A63.0,63.0 0 0 1 191.4,100.0 Z" fill="#e0457b" fill-opacity="0.35" fill-rule="evenodd" stroke="none" stroke-width="2" stroke-linejoin="round"/>
<path d="M15.0,100.0 A88.2,88.2 0 0 1 191.4,100.0 Z" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M15.0,100.0 A25.2,25.2 0 0 1 65.4,100.0 Z" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="#e0457b" stroke-width="2" stroke-linejoin="round"/>
<path d="M65.4,100.0 A63.0,63.0 0 0 1 191.4,100.0 Z" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="#e0457b" stroke-width="2" stroke-linejoin="round"/>
<text x="15.0" y="114.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="65.4" y="114.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">C</text>
<text x="191.4" y="114.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="40.2" y="128.4" text-anchor="middle" font-size="10" fill="currentColor">8</text>
<text x="128.4" y="128.4" text-anchor="middle" font-size="10" fill="currentColor">20</text>
</svg>`,
              answer: ["40π", "40pi", h`40\pi`],
              explanation: h`<p>Jari-jari tiga setengah lingkaran adalah \(14\), \(4\), dan \(10\). Luas arsiran \(=\frac12\pi(14^2)-\frac12\pi(4^2)-\frac12\pi(10^2)=98\pi-8\pi-50\pi=\) <strong>\(40\pi\)</strong>.</p>`,
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
              prompt: h`<p>Sebuah wiper kaca depan bus berputar pada poros \(O\). Bilah wiper terpasang mulai dari jarak \(15\) cm sampai \(60\) cm dari poros, dan menyapu kaca dengan sudut sapuan \(120^\circ\) (daerah arsiran pada gambar).</p>`,
              figure: h`<svg viewBox="0 0 240 190" role="img" aria-label="Daerah sapuan wiper berbentuk sebagian cincin dengan sudut sapuan 120 derajat" style="width: 100%; max-width: 240px; height: auto" font-size="12" font-family="inherit">
<path d="M210.1,98.0 A104.0,104.0 0 0 0 29.9,98.0 L97.5,137.0 A26.0,26.0 0 0 1 142.5,137.0 Z" fill="#e0457b" fill-opacity="0.3" fill-rule="nonzero" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
<line x1="120.0" y1="150.0" x2="220.5" y2="92.0" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>
<line x1="120.0" y1="150.0" x2="19.5" y2="92.0" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>
<path d="M227.4,88.0 A124.0,124.0 0 0 0 12.6,88.0" fill="none" stroke="#ea580c" stroke-width="1.6"/>
<circle cx="120.0" cy="150.0" r="2.8" fill="currentColor"/>
<text x="120.0" y="166.0" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="120.0" y="17.0" text-anchor="middle" font-size="11" fill="currentColor">120&deg;</text>
<text x="120.0" y="90.0" text-anchor="middle" font-size="10" fill="currentColor">daerah sapuan</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Tentukan luas kaca yang disapu bilah wiper.</li>
<li>Tentukan panjang lintasan ujung bilah yang terjauh dan yang terdekat dari poros.</li>
<li>Tentukan keliling daerah yang disapu.</li>
<li>Jika sudut sapuan diubah menjadi \(150^\circ\), berapa persen luas sapuan bertambah?</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Daerah sapuan adalah sebagian cincin: \(L=\frac{120}{360}\pi(60^2-15^2)=\frac13\pi(3600-225)=1125\pi\) cm\(^2\).</p>
<p><strong>(b)</strong> Ujung terjauh: \(\frac13\cdot2\pi\cdot60=40\pi\) cm. Ujung terdekat: \(\frac13\cdot2\pi\cdot15=10\pi\) cm.</p>
<p><strong>(c)</strong> Keliling \(=\) busur luar \(+\) busur dalam \(+\) dua panjang bilah \(=40\pi+10\pi+2(45)=50\pi+90\) cm.</p>
<p><strong>(d)</strong> Luas sebanding dengan sudut sapuan, sehingga luas baru \(=\frac{150}{120}=1{,}25\) kali luas semula, yaitu bertambah \(25\%\).</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Sebuah lingkaran melalui tiga titik \(A(8,2)\), \(B(0,6)\), dan \(C(6,-2)\).</p>`,
              promptAfter: h`<ol type="a">
<li>Tentukan persamaan lingkaran tersebut dalam bentuk umum \(x^2+y^2+Dx+Ey+F=0\).</li>
<li>Ubah ke bentuk baku, lalu tentukan pusat dan jari-jarinya.</li>
<li>Tentukan posisi titik \((7,5)\) dan titik \((9,6)\) terhadap lingkaran (di dalam, pada, atau di luar lingkaran).</li>
<li>Tentukan persamaan garis singgung lingkaran di titik \((7,5)\), dan panjang garis singgung dari titik \((9,6)\) ke lingkaran.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Substitusi ketiga titik: \(A\): \(8D+2E+F=-68\); \(B\): \(6E+F=-36\); \(C\): \(6D-2E+F=-40\). Eliminasi \(F\) memberi \(2D-E=-8\) dan \(3D-4E=-2\), sehingga \(D=-6\), \(E=-4\), \(F=-12\). Persamaan: \(x^2+y^2-6x-4y-12=0\).</p>
<p><strong>(b)</strong> \((x-3)^2+(y-2)^2=12+9+4=25\), pusat \((3,2)\) dan jari-jari \(5\).</p>
<p><strong>(c)</strong> Titik \((7,5)\): \((7-3)^2+(5-2)^2=25=r^2\), jadi <em>pada</em> lingkaran. Titik \((9,6)\): \(36+16=52&gt;25\), jadi di <em>luar</em> lingkaran.</p>
<p><strong>(d)</strong> Garis singgung di \((7,5)\): \((7-3)(x-3)+(5-2)(y-2)=25\Rightarrow4x+3y=43\). Panjang garis singgung dari \((9,6)\): \(\sqrt{52-25}=\sqrt{27}=3\sqrt3\).</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin.</em></p>`,
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
              prompt: h`<p>Dua lingkaran berjari-jari \(6\) cm berpusat di \(O_1\) dan \(O_2\) dengan \(O_1O_2=6\) cm, sehingga keduanya berpotongan di titik \(A\) dan \(B\). Daerah irisan kedua lingkaran diarsir.</p>`,
              figure: h`<svg viewBox="0 0 320 190" role="img" aria-label="Dua lingkaran berjari-jari 6 dengan jarak pusat 6 dan daerah irisan diarsir" style="width: 100%; max-width: 320px; height: auto" font-size="12" font-family="inherit">
<clipPath id="mx-cl"><circle cx="110.0" cy="95.0" r="93.6"/></clipPath>
<circle cx="203.6" cy="95.0" r="93.6" fill="#e0457b" fill-opacity="0.35" stroke="#e0457b" stroke-width="0" clip-path="url(#mx-cl)"/>
<circle cx="110.0" cy="95.0" r="93.6" fill="none" fill-opacity="0.2" stroke="#be123c" stroke-width="2"/>
<circle cx="203.6" cy="95.0" r="93.6" fill="none" fill-opacity="0.2" stroke="#e0457b" stroke-width="2"/>
<line x1="156.8" y1="176.1" x2="156.8" y2="13.9" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>
<line x1="110.0" y1="95.0" x2="203.6" y2="95.0" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>
<circle cx="110.0" cy="95.0" r="2.8" fill="currentColor"/>
<circle cx="203.6" cy="95.0" r="2.8" fill="currentColor"/>
<text x="105.0" y="111.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">O<tspan font-size="9" dy="3">1</tspan></text>
<text x="209.6" y="111.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">O<tspan font-size="9" dy="3">2</tspan></text>
<text x="156.8" y="5.9" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="156.8" y="192.1" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="133.4" y="90.0" text-anchor="middle" font-size="10" fill="currentColor">6</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Buktikan bahwa \(\angle AO_1B=120^\circ\).</li>
<li>Tentukan panjang tali busur \(AB\).</li>
<li>Tentukan luas tembereng pada lingkaran berpusat \(O_1\) yang dibatasi tali busur \(AB\).</li>
<li>Tentukan luas dan keliling daerah irisan tersebut.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> \(O_1A=O_1O_2=O_2A=6\), sehingga \(\triangle AO_1O_2\) sama sisi dan \(\angle AO_1O_2=60^\circ\). Karena \(O_1O_2\) membagi dua \(\angle AO_1B\) secara simetris, \(\angle AO_1B=2\cdot60^\circ=120^\circ\).</p>
<p><strong>(b)</strong> \(AB=2\cdot6\sin60^\circ=6\sqrt3\) cm.</p>
<p><strong>(c)</strong> Tembereng \(=\) juring \(-\) segitiga \(=\frac13\pi\cdot36-\frac12\cdot6\cdot6\sin120^\circ=12\pi-9\sqrt3\) cm\(^2\).</p>
<p><strong>(d)</strong> Irisan terdiri atas dua tembereng kongruen: \(L=2(12\pi-9\sqrt3)=24\pi-18\sqrt3\) cm\(^2\). Keliling irisan \(=\) dua busur masing-masing \(120^\circ\) \(=2\cdot\frac13\cdot2\pi\cdot6=8\pi\) cm.</p>
<p class="penskoran"><em>Penskoran: (a) 2 poin; (b) 2 poin; (c) 2 poin; (d) 2 poin (luas 1, keliling 1).</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Sebuah topi pesta berbentuk kerucut dibuat dengan menggulung selembar kertas berbentuk juring lingkaran berjari-jari \(20\) cm dan sudut pusat \(216^\circ\) (tanpa tumpang tindih).</p>`,
              figure: h`<svg viewBox="0 0 345 200" role="img" aria-label="Juring 216 derajat berjari-jari 20 digulung menjadi kerucut" style="width: 100%; max-width: 345px; height: auto" font-size="12" font-family="inherit">
<defs><marker id="mx-a4" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<path d="M90.0,108.0 L64.8,185.6 A81.6,81.6 0 1 0 64.8,30.4 Z" fill="#e0457b" fill-opacity="0.3" fill-rule="nonzero" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
<circle cx="90.0" cy="108.0" r="2.8" fill="currentColor"/>
<text x="124.0" y="112.0" text-anchor="middle" font-size="11" fill="currentColor">216&deg;</text>
<text x="70.9" y="65.6" text-anchor="end" font-size="11" fill="currentColor">20</text>
<line x1="195.4" y1="77.4" x2="222.6" y2="77.4" stroke="#ea580c" stroke-width="2" marker-end="url(#mx-a4)"/>
<path d="M270.2,12.1 L221.2,77.4 A49.0,10.9 0 0 0 319.2,77.4 Z" fill="#e0457b" fill-opacity="0.2" fill-rule="nonzero" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M221.2,77.4 A49.0,10.9 0 0 1 319.2,77.4" fill="none" fill-opacity="0" fill-rule="nonzero" stroke="#be123c" stroke-width="1.5" stroke-linejoin="round" stroke-dasharray="6 4"/>
<line x1="270.2" y1="12.1" x2="270.2" y2="77.4" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>
<line x1="270.2" y1="77.4" x2="319.2" y2="77.4" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>
<text x="308.8" y="47.4" text-anchor="start" font-size="11" fill="currentColor">20</text>
<text x="294.0" y="93.4" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor">r</text>
<text x="263.2" y="47.4" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">t</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Tentukan panjang busur juring, lalu tentukan jari-jari alas topi.</li>
<li>Tentukan tinggi dan volume topi.</li>
<li>Tentukan luas kertas yang dipakai, dan buktikan bahwa nilainya sama dengan \(\pi\cdot r\cdot s\) dengan \(r\) jari-jari alas dan \(s\) garis pelukis kerucut.</li>
<li>Dari satu lembar kertas berbentuk lingkaran penuh berjari-jari \(20\) cm, juring \(216^\circ\) dipakai untuk topi pertama dan juring sisanya untuk topi kedua. Buktikan bahwa jumlah jari-jari alas kedua topi sama dengan \(20\) cm.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Panjang busur \(s=\frac{216}{360}\cdot2\pi\cdot20=24\pi\) cm. Busur menjadi keliling alas: \(2\pi r=24\pi\Rightarrow r=12\) cm.</p>
<p><strong>(b)</strong> Garis pelukis \(=20\), sehingga tinggi \(t=\sqrt{20^2-12^2}=16\) cm. Volume \(=\frac13\pi\cdot12^2\cdot16=768\pi\) cm\(^3\).</p>
<p><strong>(c)</strong> Luas kertas \(=\) luas juring \(=\frac{216}{360}\pi\cdot20^2=240\pi\) cm\(^2\). Dengan rumus kerucut: \(\pi rs=\pi\cdot12\cdot20=240\pi\), sama. Secara umum, luas juring \(=\frac12\cdot(\text{busur})\cdot(\text{jari-jari juring})=\frac12(2\pi r)s=\pi rs\).</p>
<p><strong>(d)</strong> Juring sisa bersudut \(360^\circ-216^\circ=144^\circ\), sehingga busurnya \(\frac{144}{360}\cdot2\pi\cdot20=16\pi\) dan \(r_2=8\) cm. Jumlah \(r_1+r_2=12+8=20\) cm. Secara umum \(r_1=\frac{\theta}{360}R\) dan \(r_2=\frac{360-\theta}{360}R\), sehingga \(r_1+r_2=R\).</p>
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
              prompt: h`<p>Pada bidang koordinat (satuan meter), dua tiang gawang berada di \(A(0,3)\) dan \(B(0,9)\). Seorang pemain berlari sepanjang sumbu-\(x\) positif dan, di setiap titik \(P(x,0)\), melihat gawang dengan sudut tembak \(\angle APB\). Pelatih ingin mengetahui posisi \(P\) yang memberi sudut tembak terbesar.</p>`,
              figure: h`<svg viewBox="0 0 338 338" role="img" aria-label="Gawang A(0,3) dan B(0,9), lingkaran menyinggung sumbu-x di T, titik P pada sumbu-x" style="width: 100%; max-width: 338px; height: auto" font-size="12" font-family="inherit">
<line x1="26.0" y1="312.0" x2="26.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="48.0" y1="312.0" x2="48.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="70.0" y1="312.0" x2="70.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="92.0" y1="312.0" x2="92.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="114.0" y1="312.0" x2="114.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="136.0" y1="312.0" x2="136.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="158.0" y1="312.0" x2="158.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="180.0" y1="312.0" x2="180.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="202.0" y1="312.0" x2="202.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="224.0" y1="312.0" x2="224.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="246.0" y1="312.0" x2="246.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="268.0" y1="312.0" x2="268.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="290.0" y1="312.0" x2="290.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="312.0" y1="312.0" x2="312.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="312.0" x2="312.0" y2="312.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="290.0" x2="312.0" y2="290.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="268.0" x2="312.0" y2="268.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="246.0" x2="312.0" y2="246.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="224.0" x2="312.0" y2="224.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="202.0" x2="312.0" y2="202.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="180.0" x2="312.0" y2="180.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="158.0" x2="312.0" y2="158.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="136.0" x2="312.0" y2="136.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="114.0" x2="312.0" y2="114.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="92.0" x2="312.0" y2="92.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="70.0" x2="312.0" y2="70.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="48.0" x2="312.0" y2="48.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="26.0" x2="312.0" y2="26.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="26.0" y1="290.0" x2="320.0" y2="290.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="48.0" y1="312.0" x2="48.0" y2="18.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="320.0,290.0 313.0,286.5 313.0,293.5" fill="currentColor"/>
<polygon points="48.0,18.0 44.5,25.0 51.5,25.0" fill="currentColor"/>
<text x="323.0" y="294.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">x</text>
<text x="55.0" y="20.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">y</text>
<text x="26.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">-1</text>
<text x="70.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="92.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="114.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="136.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="158.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">5</text>
<text x="180.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="202.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">7</text>
<text x="224.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<text x="246.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">9</text>
<text x="268.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">10</text>
<text x="290.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">11</text>
<text x="312.0" y="303.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">12</text>
<text x="43.0" y="315.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">-1</text>
<text x="43.0" y="271.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="43.0" y="249.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="43.0" y="227.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="43.0" y="205.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="43.0" y="183.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">5</text>
<text x="43.0" y="161.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="43.0" y="139.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">7</text>
<text x="43.0" y="117.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<text x="43.0" y="95.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">9</text>
<text x="43.0" y="73.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">10</text>
<text x="43.0" y="51.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">11</text>
<text x="43.0" y="29.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">12</text>
<circle cx="162.3" cy="158.0" r="132" fill="#e0457b" fill-opacity=".08" stroke="#be123c" stroke-width="2.2"/>
<line x1="48.0" y1="224.0" x2="235.0" y2="290.0" stroke="#ea580c" stroke-width="2.2"/>
<line x1="235.0" y1="290.0" x2="48.0" y2="92.0" stroke="#ea580c" stroke-width="2.2"/>
<line x1="48.0" y1="224.0" x2="162.3" y2="290.0" stroke="currentColor" stroke-width="1.4" stroke-dasharray="6 4"/>
<line x1="162.3" y1="290.0" x2="48.0" y2="92.0" stroke="currentColor" stroke-width="1.4" stroke-dasharray="6 4"/>
<circle cx="48.0" cy="224.0" r="3.2" fill="#dc2626"/>
<text x="56.0" y="228.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">A</text>
<circle cx="48.0" cy="92.0" r="3.2" fill="#dc2626"/>
<text x="56.0" y="96.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<circle cx="162.3" cy="290.0" r="3.2" fill="#dc2626"/>
<text x="159.3" y="306.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">T</text>
<circle cx="235.0" cy="290.0" r="3.2" fill="#dc2626"/>
<text x="239.0" y="306.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">P'</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Pusat setiap lingkaran yang melalui \(A\) dan \(B\) terletak pada sebuah garis. Tentukan persamaan garis itu.</li>
<li>Tentukan pusat dan jari-jari lingkaran yang melalui \(A\) dan \(B\) serta menyinggung sumbu-\(x\) positif di titik \(T\). Tentukan koordinat \(T\).</li>
<li>Hitunglah \(\angle ATB\).</li>
<li>Misalkan \(P'\) titik lain pada sumbu-\(x\) positif. Jelaskan mengapa \(\angle AP'B&lt;\angle ATB\). (Petunjuk: ruas \(P'B\) memotong lingkaran di titik \(Q\); gunakan sudut luar segitiga.) Simpulkan posisi dan besar sudut tembak maksimum.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Pusat berjarak sama dari \(A\) dan \(B\), jadi terletak pada sumbu \(AB\): garis \(y=\frac{3+9}2=6\).</p>
<p><strong>(b)</strong> Pusat \((h,6)\). Menyinggung sumbu-\(x\) berarti jari-jari sama dengan jarak ke sumbu-\(x\), yaitu \(r=6\). Melalui \(A\): \(h^2+(3-6)^2=36\Rightarrow h^2=27\Rightarrow h=3\sqrt3\) (positif). Pusat \((3\sqrt3,6)\), jari-jari \(6\), dan titik singgung \(T(3\sqrt3,0)\).</p>
<p><strong>(c)</strong> Tali busur \(AB=6\) sama dengan jari-jari, sehingga \(\triangle OAB\) sama sisi dan \(\angle AOB=60^\circ\). \(T\) berada di busur mayor, jadi \(\angle ATB=\frac12\cdot60^\circ=30^\circ\).</p>
<p><strong>(d)</strong> Semua titik sumbu-\(x\) selain \(T\) berada di luar lingkaran (karena sumbu-\(x\) menyinggung lingkaran di \(T\)). Untuk \(P'\neq T\), ruas \(P'B\) memotong lingkaran di titik \(Q\) yang terletak di antara \(P'\) dan \(B\), pada busur mayor, sehingga \(\angle AQB=\angle ATB=30^\circ\) (sudut keliling menghadap busur yang sama). Di \(\triangle P'QA\), \(\angle AQB\) adalah sudut luar di \(Q\) sehingga \(\angle AQB=\angle QP'A+\angle QAP'&gt;\angle QP'A=\angle AP'B\). Jadi \(\angle AP'B&lt;30^\circ=\angle ATB\).</p>
<p>Kesimpulan: sudut tembak maksimum \(30^\circ\) dicapai di \(P=T(3\sqrt3,0)\approx(5{,}2;\,0)\), yaitu sekitar \(5{,}2\) m dari garis gawang.</p>
<p class="penskoran"><em>Penskoran: (a) 1 poin; (b) 3 poin (pusat 1, jari-jari 1, titik \(T\) 1); (c) 1 poin; (d) 3 poin (penalaran sudut luar 2, kesimpulan 1).</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default lingkaran;
