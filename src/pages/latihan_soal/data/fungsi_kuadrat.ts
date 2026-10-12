import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Fungsi Kuadrat.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const fungsiKuadrat: Material = {
  slug: "fungsi-kuadrat",
  title: "Latihan Soal Fungsi Kuadrat",
  topic: "Fungsi Kuadrat",
  description:
    "Grafik dan sifat fungsi kuadrat, titik puncak, diskriminan, menyusun fungsi kuadrat, nilai maksimum dan minimum, serta pemodelan dan penalaran.",
  durationMinutes: 120,
  notes: [
    h`Soal disusun berjenjang dari mudah sampai HOTS dan sebagian bergaya
UTBK: pilihan ganda lima opsi, soal berkonteks, dan soal bergambar
(grafik).`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Untuk \(f(x)=ax^{2}+bx+c\), diskriminan \(D=b^{2}-4ac\). Grafik berada di
atas sumbu-\(x\) berarti \(f(x)&gt;0\).`,
    "Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan.",
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
              prompt: h`<p>Jika \(f(x)=2x^{2}-5x+3\), maka nilai \(f(-1)\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(0\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(6\)` },
                { key: "D", text: h`\(10\)` },
                { key: "E", text: h`\(14\)` },
              ],
              answer: "D",
              explanation: h`<p>Substitusikan \(x=-1\):</p>
<div class="math-display">\[ f(-1)=2(-1)^{2}-5(-1)+3=2+5+3=10 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Himpunan penyelesaian persamaan \(x^{2}+2x-15=0\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\{-5,-3\}\)` },
                { key: "B", text: h`\(\{-5,3\}\)` },
                { key: "C", text: h`\(\{-3,5\}\)` },
                { key: "D", text: h`\(\{3,5\}\)` },
                { key: "E", text: h`\(\{-15,1\}\)` },
              ],
              answer: "B",
              explanation: h`<p>Faktorkan ruas kiri:</p>
<div class="math-display">\[ x^{2}+2x-15=(x+5)(x-3)=0\Rightarrow x=-5\ \text{atau}\ x=3 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Persamaan sumbu simetri parabola \(y=x^{2}-8x+10\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(x=-4\)` },
                { key: "B", text: h`\(x=2\)` },
                { key: "C", text: h`\(x=4\)` },
                { key: "D", text: h`\(x=8\)` },
                { key: "E", text: h`\(x=10\)` },
              ],
              answer: "C",
              explanation: h`<p>Sumbu simetri \(x=-\dfrac{b}{2a}\):</p>
<div class="math-display">\[ x=-\dfrac{-8}{2\cdot1}=4 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Perhatikan grafik fungsi kuadrat pada gambar. Koordinat titik puncak grafik tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 339.8 315.6" role="img" aria-label="Grafik fungsi kuadrat memotong sumbu-x di (−1,0) dan (3,0) serta memotong sumbu-y di (0,−3)" style="width: 100%; max-width: 339.8px; height: auto" font-size="13" font-family="inherit">
<path d="M56.6,41.7 Q163,480.7 269.4,41.7" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
<line x1="30" y1="149.2" x2="299.8" y2="149.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="125" y1="283.6" x2="125" y2="26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="299.8,149.2 292.8,145.2 292.8,153.2" fill="currentColor" />
<polygon points="125,26 121,33 129,33" fill="currentColor" />
<text x="305.8" y="154.2" text-anchor="start" fill="currentColor" font-style="italic">x</text>
<text x="134" y="30" text-anchor="start" fill="currentColor" font-style="italic">y</text>
<text x="117" y="165.2" text-anchor="end" fill="currentColor">O</text>
<circle cx="87" cy="149.2" r="3.5" fill="#dc2626" />
<text x="80" y="167.2" text-anchor="end" fill="currentColor">(−1, 0)</text>
<circle cx="239" cy="149.2" r="3.5" fill="#dc2626" />
<text x="247" y="167.2" text-anchor="start" fill="currentColor">(3, 0)</text>
<circle cx="125" cy="233.2" r="3.5" fill="#dc2626" />
<text x="117" y="237.2" text-anchor="end" fill="currentColor">(0, −3)</text>
</svg>`,
              options: [
                { key: "A", text: h`\((1,-4)\)` },
                { key: "B", text: h`\((-1,-4)\)` },
                { key: "C", text: h`\((1,-3)\)` },
                { key: "D", text: h`\((2,-3)\)` },
                { key: "E", text: h`\((3,0)\)` },
              ],
              answer: "A",
              explanation: h`<p>Titik potong sumbu-\(x\) di \(-1\) dan \(3\), sehingga sumbu simetri \(x=\dfrac{-1+3}{2}=1\). Bentuk fungsinya \(f(x)=a(x+1)(x-3)\) dan grafik melalui \((0,-3)\):</p>
<div class="math-display">\[ -3=a(1)(-3)\Rightarrow a=1,\qquad f(1)=1\cdot2\cdot(-2)=-4 \]</div>
<p>Jadi titik puncaknya \((1,-4)\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Persamaan kuadrat \(2x^{2}-3x+5=0\) mempunyai diskriminan \(D\) dengan pernyataan yang benar ....</p>`,
              options: [
                { key: "A", text: h`\(D=49\), dua akar real berbeda` },
                { key: "B", text: h`\(D=31\), dua akar real berbeda` },
                { key: "C", text: h`\(D=-31\), dua akar real berbeda` },
                { key: "D", text: h`\(D=-31\), dua akar real kembar` },
                { key: "E", text: h`\(D=-31\), tidak mempunyai akar real` },
              ],
              answer: "E",
              explanation: h`<div class="math-display">\[ D=b^{2}-4ac=(-3)^{2}-4(2)(5)=9-40=-31 \]</div>
<p>Karena \(D&lt;0\), persamaan tidak mempunyai akar real.</p>
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
              prompt: h`<p>Nilai minimum fungsi \(f(x)=2x^{2}-12x+7\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-25\)` },
                { key: "B", text: h`\(-18\)` },
                { key: "C", text: h`\(-11\)` },
                { key: "D", text: h`\(-7\)` },
                { key: "E", text: h`\(7\)` },
              ],
              answer: "C",
              explanation: h`<p>Absis puncak \(x=-\dfrac{-12}{2\cdot2}=3\), sehingga:</p>
<div class="math-display">\[ f(3)=2(9)-36+7=-11 \]</div>
<p>Atau dengan \(-\dfrac{D}{4a}=-\dfrac{144-56}{8}=-11\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Grafik fungsi kuadrat memotong sumbu-\(x\) di \((1,0)\) dan \((5,0)\) serta mempunyai nilai maksimum \(8\). Persamaan fungsi tersebut adalah ....</p>`,
              options: [
                { key: "A", text: h`\(y=-2x^{2}+12x-10\)` },
                { key: "B", text: h`\(y=2x^{2}-12x+10\)` },
                { key: "C", text: h`\(y=-x^{2}+6x-5\)` },
                { key: "D", text: h`\(y=-2x^{2}+12x-8\)` },
                { key: "E", text: h`\(y=-4x^{2}+24x-20\)` },
              ],
              answer: "A",
              explanation: h`<p>Bentuknya \(y=a(x-1)(x-5)\) dengan sumbu simetri \(x=3\). Nilai maksimum di \(x=3\):</p>
<div class="math-display">\[ a(3-1)(3-5)=8\Rightarrow-4a=8\Rightarrow a=-2 \]</div>
<div class="math-display">\[ y=-2(x^{2}-6x+5)=-2x^{2}+12x-10 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Grafik fungsi kuadrat pada gambar mempunyai titik puncak \((-1,4)\) dan melalui titik \((0,3)\). Persamaan fungsinya adalah ....</p>`,
              figure: h`<svg viewBox="0 0 320.8 282" role="img" aria-label="Grafik fungsi kuadrat terbuka ke bawah dengan titik puncak (−1,4) dan melalui titik (0,3)" style="width: 100%; max-width: 320.8px; height: auto" font-size="13" font-family="inherit">
<path d="M56.6,229 Q151.6,-121 246.6,229" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
<line x1="151.6" y1="166" x2="151.6" y2="54" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="4 3" />
<line x1="151.6" y1="54" x2="189.6" y2="54" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="4 3" />
<line x1="30" y1="166" x2="280.8" y2="166" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="189.6" y1="250" x2="189.6" y2="26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="280.8,166 273.8,162 273.8,170" fill="currentColor" />
<polygon points="189.6,26 185.6,33 193.6,33" fill="currentColor" />
<text x="286.8" y="171" text-anchor="start" fill="currentColor" font-style="italic">x</text>
<text x="198.6" y="30" text-anchor="start" fill="currentColor" font-style="italic">y</text>
<text x="181.6" y="182" text-anchor="end" fill="currentColor">O</text>
<circle cx="151.6" cy="54" r="3.5" fill="#dc2626" />
<text x="151.6" y="45" text-anchor="middle" fill="currentColor">(−1, 4)</text>
<circle cx="189.6" cy="82" r="3.5" fill="#dc2626" />
<text x="197.6" y="78" text-anchor="start" fill="currentColor">(0, 3)</text>
</svg>`,
              options: [
                { key: "A", text: h`\(y=-x^{2}+2x+3\)` },
                { key: "B", text: h`\(y=x^{2}+2x+3\)` },
                { key: "C", text: h`\(y=-x^{2}-2x-3\)` },
                { key: "D", text: h`\(y=-2x^{2}-4x+2\)` },
                { key: "E", text: h`\(y=-x^{2}-2x+3\)` },
              ],
              answer: "E",
              explanation: h`<p>Dengan titik puncak \((-1,4)\), bentuknya \(y=a(x+1)^{2}+4\). Melalui \((0,3)\):</p>
<div class="math-display">\[ 3=a+4\Rightarrow a=-1 \]</div>
<div class="math-display">\[ y=-(x+1)^{2}+4=-x^{2}-2x+3 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Parabola \(y=x^{2}-4x+1\) digeser \(1\) satuan ke kiri dan \(2\) satuan ke bawah. Persamaan parabola hasil pergeseran adalah ....</p>`,
              options: [
                { key: "A", text: h`\(y=x^{2}-6x+4\)` },
                { key: "B", text: h`\(y=x^{2}-2x\)` },
                { key: "C", text: h`\(y=x^{2}-4x-1\)` },
                { key: "D", text: h`\(y=x^{2}-2x-4\)` },
                { key: "E", text: h`\(y=x^{2}+2x-4\)` },
              ],
              answer: "D",
              explanation: h`<p>Ubah ke bentuk puncak: \(y=(x-2)^{2}-3\), dengan puncak \((2,-3)\). Setelah digeser \(1\) satuan ke kiri dan \(2\) satuan ke bawah, puncak menjadi \((1,-5)\) dengan \(a=1\) tetap:</p>
<div class="math-display">\[ y=(x-1)^{2}-5=x^{2}-2x-4 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Akar-akar persamaan \(x^{2}-8x+k=0\) adalah \(x_{1}\) dan \(x_{2}\). Jika \(x_{1}=3x_{2}\), maka nilai \(k\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(6\)` },
                { key: "B", text: h`\(12\)` },
                { key: "C", text: h`\(16\)` },
                { key: "D", text: h`\(18\)` },
                { key: "E", text: h`\(24\)` },
              ],
              answer: "B",
              explanation: h`<div class="math-display">\[ x_1+x_2=8\Rightarrow3x_2+x_2=8\Rightarrow x_2=2,\ x_1=6 \]</div>
<p>Maka \(k=x_1x_2=6\cdot2=12\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
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
              prompt: h`<p>Garis \(y=mx-1\) menyinggung parabola \(y=x^{2}-4x+3\). Jumlah semua nilai \(m\) yang memenuhi adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-8\)` },
                { key: "B", text: h`\(-4\)` },
                { key: "C", text: h`\(0\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(8\)` },
              ],
              answer: "A",
              explanation: h`<p>Samakan kedua fungsi:</p>
<div class="math-display">\[ x^{2}-4x+3=mx-1\Rightarrow x^{2}-(m+4)x+4=0 \]</div>
<p>Menyinggung berarti \(D=0\):</p>
<div class="math-display">\[ (m+4)^{2}-16=0\Rightarrow m+4=\pm4\Rightarrow m=0\ \text{atau}\ m=-8 \]</div>
<p>Jumlah semua nilai \(m\) adalah \(-8\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Agar grafik \(y=x^{2}+px+2\) seluruhnya berada di atas garis \(y=2x-2\), nilai \(p\) harus memenuhi ....</p>`,
              options: [
                { key: "A", text: h`\(-6&lt;p&lt;2\)` },
                { key: "B", text: h`\(-2&lt;p&lt;6\)` },
                { key: "C", text: h`\(p&lt;-2\) atau \(p&gt;6\)` },
                { key: "D", text: h`\(-4&lt;p&lt;4\)` },
                { key: "E", text: h`\(2&lt;p&lt;6\)` },
              ],
              answer: "B",
              explanation: h`<p>Syaratnya \(x^{2}+px+2&gt;2x-2\) untuk semua \(x\), yaitu:</p>
<div class="math-display">\[ x^{2}+(p-2)x+4&gt;0 \]</div>
<p>Karena \(a=1&gt;0\), cukup \(D&lt;0\):</p>
<div class="math-display">\[ (p-2)^{2}-16&lt;0\Rightarrow-4&lt;p-2&lt;4\Rightarrow-2&lt;p&lt;6 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Grafik fungsi kuadrat \(f\) melalui titik \((0,5)\), \((1,2)\), dan \((3,8)\). Nilai minimum \(f\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac58\)` },
                { key: "B", text: h`\(\dfrac54\)` },
                { key: "C", text: h`\(\dfrac74\)` },
                { key: "D", text: h`\(\dfrac{15}{8}\)` },
                { key: "E", text: h`\(\dfrac{25}{8}\)` },
              ],
              answer: "D",
              explanation: h`<p>Misalkan \(f(x)=ax^{2}+bx+c\). Dari \((0,5)\) diperoleh \(c=5\). Dari \((1,2)\) dan \((3,8)\):</p>
<div class="math-display">\[ a+b=-3,\qquad3a+b=1\Rightarrow a=2,\ b=-5 \]</div>
<p>Maka \(f(x)=2x^{2}-5x+5\) dengan nilai minimum:</p>
<div class="math-display">\[ c-\dfrac{b^{2}}{4a}=5-\dfrac{25}{8}=\dfrac{15}{8} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Jika \(x\) dan \(y\) bilangan real dengan \(x+2y=10\), maka nilai minimum \(x^{2}+y^{2}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(10\)` },
                { key: "B", text: h`\(16\)` },
                { key: "C", text: h`\(20\)` },
                { key: "D", text: h`\(25\)` },
                { key: "E", text: h`\(40\)` },
              ],
              answer: "C",
              explanation: h`<p>Dari \(x=10-2y\):</p>
<div class="math-display">\[ x^{2}+y^{2}=(10-2y)^{2}+y^{2}=5y^{2}-40y+100 \]</div>
<p>Nilai minimum di \(y=-\dfrac{-40}{2\cdot5}=4\):</p>
<div class="math-display">\[ 5(16)-160+100=20 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Seorang peternak mempunyai kawat sepanjang \(120\) m untuk membuat kandang berbentuk persegi panjang yang dibagi dua sama besar oleh sebuah sekat (sekat sejajar salah satu sisi dan memakai kawat juga). Luas total kandang terbesar yang mungkin adalah .... m\(^{2}\).</p>`,
              options: [
                { key: "A", text: h`\(150\)` },
                { key: "B", text: h`\(300\)` },
                { key: "C", text: h`\(400\)` },
                { key: "D", text: h`\(450\)` },
                { key: "E", text: h`\(600\)` },
              ],
              answer: "E",
              explanation: h`<p>Misalkan panjang sisi yang sejajar sekat \(L\) dan sisi lainnya \(W\). Kawat dipakai untuk tiga ruas sepanjang \(L\) dan dua ruas sepanjang \(W\):</p>
<div class="math-display">\[ 3L+2W=120\Rightarrow W=\dfrac{120-3L}{2} \]</div>
<div class="math-display">\[ \text{Luas}=L\cdot W=\dfrac{120L-3L^{2}}{2} \]</div>
<p>Maksimum di \(L=-\dfrac{120}{2(-3)}=20\), sehingga \(W=30\):</p>
<div class="math-display">\[ \dfrac{2400-1200}{2}=600 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Garis \(y=2x+k\) memotong parabola \(y=x^{2}-4x+5\) di titik \(A\) dan \(B\). Jika selisih absis \(A\) dan \(B\) adalah \(6\), maka \(k=\) ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(5\)` },
                { key: "E", text: h`\(9\)` },
              ],
              answer: "D",
              explanation: h`<div class="math-display">\[ x^{2}-4x+5=2x+k\Rightarrow x^{2}-6x+(5-k)=0 \]</div>
<p>Selisih kedua akar:</p>
<div class="math-display">\[ |x_1-x_2|=\dfrac{\sqrt D}{|a|}=\sqrt{36-4(5-k)}=\sqrt{16+4k}=6 \]</div>
<div class="math-display">\[ 16+4k=36\Rightarrow k=5 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          note: "Penalaran tingkat tinggi",
          questions: [
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "hots",
              prompt: h`<p>Perhatikan grafik fungsi \(f(x)=ax^{2}+bx+c\) pada gambar, yang memotong sumbu-\(x\) di \(x=-3\) dan \(x=-1\). Pernyataan yang benar adalah ....</p>`,
              figure: h`<svg viewBox="0 0 342 265.2" role="img" aria-label="Grafik fungsi kuadrat terbuka ke bawah yang memotong sumbu-x di x = −3 dan x = −1 serta memotong sumbu-y di bawah sumbu-x" style="width: 100%; max-width: 342px; height: auto" font-size="13" font-family="inherit">
<path d="M62,220.9 Q158,-101.7 254,220.9" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
<line x1="30" y1="87.6" x2="302" y2="87.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="238" y1="233.2" x2="238" y2="26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="302,87.6 295,83.6 295,91.6" fill="currentColor" />
<polygon points="238,26 234,33 242,33" fill="currentColor" />
<text x="308" y="92.6" text-anchor="start" fill="currentColor" font-style="italic">x</text>
<text x="247" y="30" text-anchor="start" fill="currentColor" font-style="italic">y</text>
<text x="230" y="103.6" text-anchor="end" fill="currentColor">O</text>
<circle cx="118" cy="87.6" r="3.5" fill="#dc2626" />
<text x="112" y="79.6" text-anchor="end" fill="currentColor">−3</text>
<circle cx="198" cy="87.6" r="3.5" fill="#dc2626" />
<text x="204" y="79.6" text-anchor="start" fill="currentColor">−1</text>
<circle cx="238" cy="171.6" r="3.5" fill="#dc2626" />
</svg>`,
              options: [
                { key: "A", text: h`\(abc&gt;0\)` },
                { key: "B", text: h`\(b^{2}-4ac&lt;0\)` },
                { key: "C", text: h`\(a+b+c&gt;0\)` },
                { key: "D", text: h`\(\dfrac ba&lt;0\)` },
                { key: "E", text: h`\(a-b+c=0\)` },
              ],
              answer: "E",
              explanation: h`<p>Grafik terbuka ke bawah (\(a&lt;0\)), memotong sumbu-\(y\) di bawah sumbu-\(x\) (\(c&lt;0\)), dan kedua akar negatif sehingga jumlah akar \(-\dfrac ba&lt;0\), yaitu \(\dfrac ba&gt;0\Rightarrow b&lt;0\).</p>
<p>(A) \(abc&lt;0\), jadi salah. (B) Ada dua titik potong sumbu-\(x\), sehingga \(D&gt;0\), jadi salah. (C) \(f(1)=a+b+c&lt;0\) karena grafik di bawah sumbu-\(x\) pada \(x=1\), jadi salah. (D) \(\dfrac ba&gt;0\), jadi salah.</p>
<p>(E) \(x=-1\) adalah akar, sehingga \(f(-1)=a-b+c=0\), jadi benar.</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "hots",
              prompt: h`<p>Fungsi \(f(x)=x^{2}-2px+p+6\) mempunyai nilai minimum \(m(p)\) untuk setiap bilangan real \(p\). Nilai maksimum dari \(m(p)\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(6\)` },
                { key: "B", text: h`\(\dfrac{25}{4}\)` },
                { key: "C", text: h`\(\dfrac{13}{2}\)` },
                { key: "D", text: h`\(7\)` },
                { key: "E", text: h`\(\dfrac{25}{2}\)` },
              ],
              answer: "B",
              explanation: h`<p>Puncak \(f\) berada di \(x=p\), sehingga:</p>
<div class="math-display">\[ m(p)=f(p)=p^{2}-2p^{2}+p+6=-p^{2}+p+6 \]</div>
<p>Ini parabola terbuka ke bawah dengan maksimum di \(p=\dfrac12\):</p>
<div class="math-display">\[ m\left(\dfrac12\right)=-\dfrac14+\dfrac12+6=\dfrac{25}{4} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt: h`<p>Fungsi kuadrat \(f\) memenuhi \(f(1)=f(5)\), mempunyai nilai minimum \(-4\), dan \(f(0)=8\). Jika \(x_{1}\) dan \(x_{2}\) adalah akar-akar \(f(x)=0\), maka \(x_{1}^{2}+x_{2}^{2}=\) ....</p>`,
              options: [
                { key: "A", text: h`\(24\)` },
                { key: "B", text: h`\(30\)` },
                { key: "C", text: h`\(36\)` },
                { key: "D", text: h`\(42\)` },
                { key: "E", text: h`\(48\)` },
              ],
              answer: "A",
              explanation: h`<p>Dari \(f(1)=f(5)\), sumbu simetri \(x=3\) dan puncak \((3,-4)\), sehingga \(f(x)=a(x-3)^{2}-4\). Dari \(f(0)=8\):</p>
<div class="math-display">\[ 9a-4=8\Rightarrow a=\dfrac43 \]</div>
<p>Akar-akarnya:</p>
<div class="math-display">\[ (x-3)^{2}=3\Rightarrow x=3\pm\sqrt3 \]</div>
<div class="math-display">\[ x_1^{2}+x_2^{2}=(x_1+x_2)^{2}-2x_1x_2=6^{2}-2(6)=24 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "hots",
              prompt: h`<p>Banyak bilangan bulat \(x\) yang memenuhi \(\left|x^{2}-5x\right|&lt;6\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(3\)` },
                { key: "C", text: h`\(4\)` },
                { key: "D", text: h`\(5\)` },
                { key: "E", text: h`\(6\)` },
              ],
              answer: "C",
              explanation: h`<div class="math-display">\[ -6&lt;x^{2}-5x&lt;6 \]</div>
<p>Dari \(x^{2}-5x-6&lt;0\): \(-1&lt;x&lt;6\). Dari \(x^{2}-5x+6&gt;0\): \(x&lt;2\) atau \(x&gt;3\). Irisannya:</p>
<div class="math-display">\[ -1&lt;x&lt;2\quad\text{atau}\quad3&lt;x&lt;6 \]</div>
<p>Bilangan bulatnya \(0,1,4,5\), yaitu \(4\) bilangan.</p>
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
              prompt: h`<p>Grafik fungsi \(f(x)=x^{2}+bx+c\) mempunyai titik puncak \((-3,-2)\). Nilai \(b+c\) adalah ....</p>`,
              answer: ["13"],
              explanation: h`<p>Bentuk puncak:</p>
<div class="math-display">\[ f(x)=(x+3)^{2}-2=x^{2}+6x+7\Rightarrow b=6,\ c=7 \]</div>
<p>Jadi, jawabannya adalah \(b+c=\) <strong>13</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Persamaan kuadrat \(x^{2}-(m+2)x+9=0\) mempunyai dua akar real yang sama. Nilai \(m\) yang positif adalah ....</p>`,
              answer: ["4"],
              explanation: h`<p>Akar kembar berarti \(D=0\):</p>
<div class="math-display">\[ (m+2)^{2}-36=0\Rightarrow m+2=\pm6\Rightarrow m=4\ \text{atau}\ m=-8 \]</div>
<p>Jadi, nilai \(m\) yang positif adalah <strong>4</strong>.</p>`,
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
              prompt: h`<p>Jika \(\alpha\) dan \(\beta\) adalah akar-akar persamaan \(x^{2}-6x+4=0\), maka nilai \(\sqrt{\alpha}+\sqrt{\beta}\) adalah ....</p>`,
              answer: ["√10", "sqrt(10)", "sqrt10", "\\sqrt10", "akar10"],
              explanation: h`<p>\(\alpha+\beta=6\) dan \(\alpha\beta=4\) (kedua akar positif). Kuadratkan:</p>
<div class="math-display">\[ \left(\sqrt\alpha+\sqrt\beta\right)^{2}=\alpha+\beta+2\sqrt{\alpha\beta}=6+2\cdot2=10 \]</div>
<p>Jadi, jawabannya adalah <strong>\(\sqrt{10}\)</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Garis \(y=3x+n\) menyinggung parabola \(y=x^{2}-x+5\). Koordinat titik singgungnya adalah ....</p>`,
              answer: ["(2,7)", "2,7"],
              explanation: h`<div class="math-display">\[ x^{2}-x+5=3x+n\Rightarrow x^{2}-4x+(5-n)=0 \]</div>
<p>Menyinggung berarti \(D=0\):</p>
<div class="math-display">\[ 16-4(5-n)=0\Rightarrow n=1 \]</div>
<p>Akar gandanya \(x=2\), sehingga \(y=3(2)+1=7\). Jadi, titik singgungnya <strong>\((2,7)\)</strong>.</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Sebuah lengkungan jembatan berbentuk parabola dengan lebar dasar \(40\) m dan tinggi bagian tengah \(10\) m (lihat gambar). Tinggi lengkungan di titik yang berjarak \(5\) m dari salah satu ujung dasarnya adalah .... m.</p>`,
              figure: h`<svg viewBox="0 0 392 293.2" role="img" aria-label="Lengkungan jembatan berbentuk parabola dengan lebar dasar 40 m dan tinggi tengah 10 m; titik berjarak 5 m dari ujung dasar memiliki tinggi t" style="width: 100%; max-width: 392px; height: auto" font-size="13" font-family="inherit">
<defs><marker id="fkar4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" /></marker></defs>
<path d="M51,187 Q191,-93 331,187" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
<line x1="191" y1="187" x2="191" y2="47" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="4 3" />
<line x1="296" y1="187" x2="296" y2="125.8" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" />
<line x1="30" y1="187" x2="352" y2="187" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
<circle cx="296" cy="125.8" r="3.5" fill="#dc2626" />
<line x1="51" y1="243" x2="331" y2="243" stroke="currentColor" stroke-width="1.2" marker-start="url(#fkar4)" marker-end="url(#fkar4)" />
<text x="191" y="259" text-anchor="middle" fill="currentColor">40 m</text>
<line x1="296" y1="203.8" x2="331" y2="203.8" stroke="currentColor" stroke-width="1.2" marker-start="url(#fkar4)" marker-end="url(#fkar4)" />
<text x="313.5" y="219.8" text-anchor="middle" fill="currentColor">5 m</text>
<text x="197" y="121" text-anchor="start" fill="currentColor" font-style="italic" font-weight="700">10 m</text>
<text x="303" y="160.2" text-anchor="start" fill="#dc2626" font-style="italic" font-weight="700">t</text>
</svg>`,
              answer: ["4.375", "4,375", "35/8"],
              explanation: h`<p>Pasang sumbu di tengah dasar: \(y=10-kx^{2}\) dan \(y=0\) di \(x=20\):</p>
<div class="math-display">\[ 400k=10\Rightarrow k=\dfrac1{40} \]</div>
<p>Titik yang berjarak \(5\) m dari ujung berada di \(x=15\):</p>
<div class="math-display">\[ t=10-\dfrac{225}{40}=\dfrac{35}{8}=4{,}375 \]</div>
<p>Jadi, jawabannya adalah <strong>4,375</strong> m.</p>`,
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
          level: "sulit",
          questions: [
            {
              id: "uraian-1",
              no: 1,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Diketahui persamaan kuadrat \(x^{2}-(m+1)x+m+4=0\).</p>

    <ol type="a">
      <li>Tentukan batas nilai \(m\) agar persamaan mempunyai dua akar real yang berbeda.</li>
      <li>Tentukan batas nilai \(m\) agar kedua akarnya real dan positif.</li>
      <li>Jika akar-akarnya \(x_{1},x_{2}\) real berbeda dan \(x_{1}^{2}+x_{2}^{2}=18\), tentukan nilai \(m\).</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Dua akar real berbeda berarti \(D&gt;0\):</p>
<div class="math-display">\[ D=(m+1)^{2}-4(m+4)=m^{2}-2m-15=(m-5)(m+3)&gt;0\Rightarrow m&lt;-3\ \text{atau}\ m&gt;5 \]</div>
<p><strong>(b)</strong> Akar real: \(D\ge0\Rightarrow m\le-3\) atau \(m\ge5\). Akar positif: jumlah \(x_1+x_2=m+1&gt;0\Rightarrow m&gt;-1\) dan hasil kali \(x_1x_2=m+4&gt;0\Rightarrow m&gt;-4\). Irisan semua syarat:</p>
<div class="math-display">\[ m\ge5 \]</div>
<p><strong>(c)</strong></p>
<div class="math-display">\[ x_1^{2}+x_2^{2}=(m+1)^{2}-2(m+4)=m^{2}-7=18\Rightarrow m=\pm5 \]</div>
<p>Dari (a), \(m=5\) memberi \(D=0\) (akar kembar), sehingga ditolak. Jadi \(m=-5\).</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin; (b) 3 poin; (c) 3 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sulit",
              prompt: h`<p>
      Parabola \(y=x^{2}-6x+5\) memotong sumbu-\(x\) di titik \(A\) dan \(B\),
      memotong sumbu-\(y\) di titik \(D\), dan mempunyai titik puncak \(C\)
      (lihat gambar).
    </p>
    <ol type="a">
      <li>Tentukan koordinat \(A\), \(B\), dan \(C\).</li>
      <li>Hitung luas segitiga \(ABC\).</li>
      <li>Tentukan persamaan garis yang melalui \(C\) dan \(D\).</li>
    </ol>`,
              figure: h`<svg viewBox="0 0 372.4 333" role="img" aria-label="Parabola y = x² − 6x + 5 dengan titik potong sumbu-x A dan B, titik puncak C, dan titik potong sumbu-y D" style="width: 100%; max-width: 372.4px; height: auto" font-size="13" font-family="inherit">
<path d="M62.4,39.4 Q181.2,518.6 300,39.4" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
<line x1="30" y1="191" x2="332.4" y2="191" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<line x1="73.2" y1="301" x2="73.2" y2="26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
<polygon points="332.4,191 325.4,187 325.4,195" fill="currentColor" />
<polygon points="73.2,26 69.2,33 77.2,33" fill="currentColor" />
<text x="338.4" y="196" text-anchor="start" fill="currentColor" font-style="italic">x</text>
<text x="82.2" y="30" text-anchor="start" fill="currentColor" font-style="italic">y</text>
<text x="65.2" y="207" text-anchor="end" fill="currentColor">O</text>
<circle cx="109.2" cy="191" r="3.5" fill="#dc2626" />
<text x="102.2" y="209" text-anchor="end" fill="currentColor">A</text>
<circle cx="253.2" cy="191" r="3.5" fill="#dc2626" />
<text x="260.2" y="209" text-anchor="start" fill="currentColor">B</text>
<circle cx="181.2" cy="279" r="3.5" fill="#dc2626" />
<text x="181.2" y="298" text-anchor="middle" fill="currentColor">C</text>
<circle cx="73.2" cy="81" r="3.5" fill="#dc2626" />
<text x="65.2" y="85" text-anchor="end" fill="currentColor">D</text>
</svg>`,
              explanation: h`<p><strong>(a)</strong> \(x^{2}-6x+5=(x-1)(x-5)=0\) memberi \(A(1,0)\) dan \(B(5,0)\). Puncak: \(x=-\dfrac{-6}{2}=3\), \(y=9-18+5=-4\), jadi \(C(3,-4)\).</p>
<p><strong>(b)</strong> Alas \(AB=4\) dan tinggi \(=|-4|=4\):</p>
<div class="math-display">\[ L=\dfrac12\cdot4\cdot4=8\ \text{satuan luas} \]</div>
<p><strong>(c)</strong> \(D(0,5)\). Gradien \(CD\):</p>
<div class="math-display">\[ m=\dfrac{5-(-4)}{0-3}=-3\Rightarrow y-5=-3x\Rightarrow y=-3x+5 \]</div>
<p>Pemeriksaan titik \(C\): \(-9+5=-4\) (benar).</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin; (b) 2 poin; (c) 3 poin.</em></p>`,
            },
            {
              id: "uraian-3",
              no: 3,
              type: "essay",
              level: "sulit",
              prompt: h`<p>
      Sebuah toko menjual kaus dengan harga Rp80.000 per buah dan terjual
      \(200\) buah per bulan. Setiap kenaikan harga Rp5.000, penjualan turun
      \(10\) buah per bulan. Misalkan \(x\) adalah banyak kenaikan harga
      sebesar Rp5.000.
    </p>
    <ol type="a">
      <li>Nyatakan pendapatan bulanan \(R(x)\) dalam \(x\) (dalam ribu rupiah).</li>
      <li>Tentukan harga jual agar pendapatan maksimum, beserta pendapatan maksimumnya.</li>
      <li>Jika biaya pengadaan Rp50.000 per kaus, tentukan harga jual agar laba bulanan maksimum.</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Harga \(=80+5x\) (ribu) dan banyak terjual \(=200-10x\):</p>
<div class="math-display">\[ R(x)=(80+5x)(200-10x)=16.000+200x-50x^{2} \]</div>
<p><strong>(b)</strong> Maksimum di \(x=-\dfrac{200}{2(-50)}=2\): harga jual \(80+10=90\) ribu, yaitu Rp90.000.</p>
<div class="math-display">\[ R(2)=16.000+400-200=16.200\ \text{ribu}=\text{Rp}16.200.000 \]</div>
<p><strong>(c)</strong> Laba per kaus \(=80+5x-50=30+5x\):</p>
<div class="math-display">\[ L(x)=(30+5x)(200-10x)=6.000+700x-50x^{2} \]</div>
<p>Maksimum di \(x=-\dfrac{700}{2(-50)}=7\): harga jual \(80+35=115\) ribu, yaitu Rp115.000 (laba maksimum \(L(7)=8.450\) ribu \(=\) Rp8.450.000).</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin; (b) 3 poin; (c) 3 poin.</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Diketahui parabola \(y=x^{2}-4x+6\) dan garis \(y=2x+k\).</p>
    <ol type="a">
      <li>Tentukan nilai \(k\) agar garis menyinggung parabola, lalu tentukan titik singgungnya.</li>
      <li>Tentukan batas nilai \(k\) agar garis memotong parabola di dua titik berbeda.</li>
      <li>Untuk \(k=-2\), tentukan koordinat kedua titik potong dan jarak antara keduanya.</li>
    </ol>`,
              explanation: h`<p>Substitusi:</p>
<div class="math-display">\[ x^{2}-4x+6=2x+k\Rightarrow x^{2}-6x+(6-k)=0,\qquad D=36-4(6-k)=12+4k \]</div>
<p><strong>(a)</strong> Menyinggung: \(D=0\Rightarrow k=-3\). Akar ganda \(x=3\), \(y=9-12+6=3\), sehingga titik singgungnya \((3,3)\).</p>
<p><strong>(b)</strong> Dua titik berbeda: \(D&gt;0\Rightarrow k&gt;-3\).</p>
<p><strong>(c)</strong> Untuk \(k=-2\): \(x^{2}-6x+8=0\Rightarrow x=2\) atau \(x=4\). Titik potongnya \((2,2)\) dan \((4,6)\), dengan jarak:</p>
<div class="math-display">\[ \sqrt{(4-2)^{2}+(6-2)^{2}}=\sqrt{20}=2\sqrt5 \]</div>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin; (b) 2 poin; (c) 3 poin.</em></p>`,
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
              prompt: h`<p>Diketahui fungsi \(f(x)=x^{2}-2(p-1)x+p^{2}-3p\) dengan \(p\) bilangan real.</p>
    <ol type="a">
      <li>Tentukan koordinat titik puncak grafik \(f\) dinyatakan dalam \(p\).</li>
      <li>Buktikan bahwa untuk setiap nilai \(p\), titik puncak grafik \(f\) terletak pada satu garis lurus yang sama, lalu tentukan persamaan garis tersebut.</li>
      <li>Tentukan nilai \(p\) agar grafik \(f\) menyinggung sumbu-\(x\), lalu tentukan titik singgungnya.</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Absis puncak \(x=p-1\). Ordinatnya:</p>
<div class="math-display">\[ f(p-1)=(p-1)^{2}-2(p-1)^{2}+p^{2}-3p=-(p-1)^{2}+p^{2}-3p=-p-1 \]</div>
<p>Titik puncaknya \((p-1,\,-p-1)\).</p>
<p><strong>(b)</strong> Misalkan \(X=p-1\) dan \(Y=-p-1\). Maka \(p=X+1\), sehingga:</p>
<div class="math-display">\[ Y=-(X+1)-1=-X-2 \]</div>
<p>Jadi semua titik puncak terletak pada garis \(y=-x-2\).</p>
<p><strong>(c)</strong> Menyinggung sumbu-\(x\) berarti ordinat puncak \(0\): \(-p-1=0\Rightarrow p=-1\). Fungsinya menjadi \(x^{2}+4x+4=(x+2)^{2}\), sehingga titik singgungnya \((-2,0)\).</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 2 poin; (b) 3 poin; (c) 3 poin.</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default fungsiKuadrat;
