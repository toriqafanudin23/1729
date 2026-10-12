import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Vektor.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const vektor: Material = {
  slug: "vektor",
  title: "Latihan Soal Vektor",
  topic: "Vektor",
  description:
    "Vektor di ruang: operasi dan panjang vektor, hasil kali titik dan silang, sudut, proyeksi, pembagian ruas garis, luas, volume, jarak, serta penalaran dan pembuktian.",
  durationMinutes: 90,
  notes: [
    h`Soal terdiri atas 20 pilihan ganda (5 mudah, 5 sedang, 10 sulit), 5 isian
singkat, dan 5 uraian (essay). Soal tingkat sulit (nomor 11–20) banyak
mengikuti pola soal UTBK-SNBT; gambarlah sketsa bila perlu.`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Notasi: vektor di ruang ditulis \(\vec a=(a_1,a_2,a_3)=a_1\vec i+a_2\vec j+a_3\vec k\).
\(|\vec a|\) adalah panjang vektor, \(\vec a\cdot\vec b\) hasil kali titik, dan
\(\vec a\times\vec b\) hasil kali silang.`,
    "Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan. Pada isian singkat, tuliskan hanya jawaban akhir (akar dapat ditulis sqrt atau √).",
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
          note: "Konsep dasar",
          questions: [
            {
              id: "pg-1",
              no: 1,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Diketahui titik \(A(3,-2,5)\) dan \(B(-1,4,2)\). Vektor \(\overrightarrow{AB}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(4\vec i-6\vec j+3\vec k\)` },
                { key: "B", text: h`\(2\vec i+2\vec j+7\vec k\)` },
                { key: "C", text: h`\(-4\vec i+6\vec j-3\vec k\)` },
                { key: "D", text: h`\(-4\vec i+6\vec j+3\vec k\)` },
                { key: "E", text: h`\(2\vec i+2\vec j+3\vec k\)` },
              ],
              answer: "C",
              explanation: h`<p>Gunakan aturan ujung dikurangi pangkal:</p>
<div class="math-display">\[ \overrightarrow{AB}=(-1-3,\ 4-(-2),\ 2-5)=(-4,6,-3)=-4\vec i+6\vec j-3\vec k \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Diketahui \(\vec a=3\vec i-\vec j+2\vec k\) dan \(\vec b=\vec i+3\vec j-2\vec k\). Panjang vektor \(\vec a+\vec b\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\sqrt{10}\)` },
                { key: "B", text: h`\(2\sqrt5\)` },
                { key: "C", text: h`\(5\)` },
                { key: "D", text: h`\(2\sqrt{10}\)` },
                { key: "E", text: h`\(8\)` },
              ],
              answer: "B",
              explanation: h`<p>Jumlahkan komponen yang bersesuaian:</p>
<div class="math-display">\[ \vec a+\vec b=(4,2,0)\Rightarrow|\vec a+\vec b|=\sqrt{16+4+0}=\sqrt{20}=2\sqrt5 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Vektor \(\vec a=(p,-4,6)\) sejajar dengan vektor \(\vec b=(3,2,-3)\). Nilai \(p\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-12\)` },
                { key: "B", text: h`\(-9\)` },
                { key: "C", text: h`\(-6\)` },
                { key: "D", text: h`\(6\)` },
                { key: "E", text: h`\(9\)` },
              ],
              answer: "C",
              explanation: h`<p>Dua vektor sejajar jika perbandingan komponennya sama:</p>
<div class="math-display">\[ \dfrac{-4}{2}=\dfrac{6}{-3}=-2\Rightarrow\vec a=-2\vec b \]</div>
<p>Sehingga \(p=-2\cdot3=-6\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Vektor \(\vec a=p\vec i-3\vec j+2\vec k\) tegak lurus dengan vektor \(\vec b=2\vec i+p\vec j+3\vec k\). Nilai \(p\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-6\)` },
                { key: "B", text: h`\(-3\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(6\)` },
                { key: "E", text: h`\(9\)` },
              ],
              answer: "D",
              explanation: h`<p>Tegak lurus berarti hasil kali titiknya nol:</p>
<div class="math-display">\[ \vec a\cdot\vec b=2p-3p+6=6-p=0\Rightarrow p=6 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Titik \(M\) adalah titik tengah ruas garis \(AB\) dengan \(A(4,-2,7)\) dan \(B(-2,6,1)\). Koordinat \(M\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\((-3,4,-3)\)` },
                { key: "B", text: h`\((3,-4,3)\)` },
                { key: "C", text: h`\((2,4,8)\)` },
                { key: "D", text: h`\((6,-8,6)\)` },
                { key: "E", text: h`\((1,2,4)\)` },
              ],
              answer: "E",
              explanation: h`<p>Titik tengah adalah rata-rata koordinat kedua ujung:</p>
<div class="math-display">\[ M=\left(\dfrac{4-2}{2},\dfrac{-2+6}{2},\dfrac{7+1}{2}\right)=(1,2,4) \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
          ],
        },
        {
          level: "sedang",
          note: "Dua langkah atau lebih",
          questions: [
            {
              id: "pg-6",
              no: 6,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Besar sudut antara vektor \(\vec a=\vec i+2\vec j+2\vec k\) dan \(\vec b=-3\vec i-3\vec j\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(45^\circ\)` },
                { key: "B", text: h`\(60^\circ\)` },
                { key: "C", text: h`\(120^\circ\)` },
                { key: "D", text: h`\(135^\circ\)` },
                { key: "E", text: h`\(150^\circ\)` },
              ],
              answer: "D",
              explanation: h`<p>Hitung hasil kali titik dan panjang kedua vektor:</p>
<div class="math-display">\[ \vec a\cdot\vec b=-3-6=-9,\qquad|\vec a|=3,\qquad|\vec b|=3\sqrt2 \]</div>
<div class="math-display">\[ \cos\theta=\dfrac{-9}{3\cdot3\sqrt2}=-\dfrac{\sqrt2}{2}\Rightarrow\theta=135^\circ \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Diketahui \(\vec a=(p,3,-1)\) dan \(\vec b=(1,-2,2)\). Jika panjang proyeksi \(\vec a\) pada \(\vec b\) sama dengan \(2\), maka jumlah semua nilai \(p\) yang mungkin adalah ....</p>`,
              options: [
                { key: "A", text: h`\(8\)` },
                { key: "B", text: h`\(10\)` },
                { key: "C", text: h`\(12\)` },
                { key: "D", text: h`\(14\)` },
                { key: "E", text: h`\(16\)` },
              ],
              answer: "E",
              explanation: h`<p>Hitung hasil kali titik dan panjang \(\vec b\):</p>
<div class="math-display">\[ \vec a\cdot\vec b=p-6-2=p-8,\qquad|\vec b|=3 \]</div>
<p>Panjang proyeksi bernilai nonnegatif:</p>
<div class="math-display">\[ \dfrac{|p-8|}{3}=2\Rightarrow p-8=\pm6\Rightarrow p=14\ \text{atau}\ p=2 \]</div>
<p>Jumlah semua nilai \(p\) adalah \(14+2=16\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Titik \(B\) terletak pada ruas garis \(AC\) dengan \(A(-1,3,2)\) dan \(C(9,-2,7)\) sehingga \(AB:BC=2:3\). Koordinat titik \(B\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\((5,0,5)\)` },
                { key: "B", text: h`\((3,1,4)\)` },
                { key: "C", text: h`\(\left(4,\dfrac12,\dfrac92\right)\)` },
                { key: "D", text: h`\((1,2,3)\)` },
                { key: "E", text: h`\((15,5,20)\)` },
              ],
              answer: "B",
              explanation: h`<p>Pada pembagian dalam, vektor posisi \(A\) dikalikan bagian yang lebih dekat ke \(C\):</p>
<div class="math-display">\[ \vec b=\dfrac{3\vec a+2\vec c}{5}=\dfrac{(-3,9,6)+(18,-4,14)}{5}=\dfrac{(15,5,20)}{5}=(3,1,4) \]</div>
<p>Pilihan E adalah hasil sebelum dibagi \(5\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Luas segitiga \(ABC\) dengan \(A(1,0,2)\), \(B(4,2,4)\), dan \(C(2,2,0)\) adalah .... satuan luas.</p>`,
              options: [
                { key: "A", text: h`\(3\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(6\)` },
                { key: "D", text: h`\(9\)` },
                { key: "E", text: h`\(12\)` },
              ],
              answer: "C",
              explanation: h`<p>Bentuk dua vektor dari titik \(A\):</p>
<div class="math-display">\[ \overrightarrow{AB}=(3,2,2),\qquad\overrightarrow{AC}=(1,2,-2) \]</div>
<p>Hasil kali silangnya:</p>
<div class="math-display">\[ \overrightarrow{AB}\times\overrightarrow{AC}=(-8,8,4),\qquad\left|\overrightarrow{AB}\times\overrightarrow{AC}\right|=\sqrt{64+64+16}=12 \]</div>
<p>Luas segitiga \(=\dfrac12\cdot12=6\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Diketahui \(\vec a=(1,2,-1)\), \(\vec b=(2,-1,1)\), dan \(\vec c=(p,5,-4)\). Jika \(\vec c=m\vec a+n\vec b\), nilai \(p\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-5\)` },
                { key: "B", text: h`\(-3\)` },
                { key: "C", text: h`\(-1\)` },
                { key: "D", text: h`\(1\)` },
                { key: "E", text: h`\(5\)` },
              ],
              answer: "A",
              explanation: h`<p>Samakan komponen \(y\) dan \(z\) lebih dulu:</p>
<div class="math-display">\[ 2m-n=5,\qquad -m+n=-4 \]</div>
<p>Jumlahkan kedua persamaan: \(m=1\), sehingga \(n=-3\). Komponen \(x\):</p>
<div class="math-display">\[ p=m+2n=1-6=-5 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          note: "Sebagian bergaya UTBK-SNBT",
          questions: [
            {
              id: "pg-11",
              no: 11,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Sudut antara vektor \(\vec a=x\vec i+2x\vec j+4\vec k\) (dengan \(x&gt;0\)) dan vektor \(\vec b\) adalah \(60^\circ\). Jika panjang proyeksi \(\vec a\) pada \(\vec b\) sama dengan \(3\), maka \(x=\) ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(5\)` },
              ],
              answer: "B",
              explanation: h`<p>Panjang proyeksi \(\vec a\) pada \(\vec b\) adalah \(|\vec a|\cos\theta\):</p>
<div class="math-display">\[ |\vec a|\cos60^\circ=\dfrac12|\vec a|=3\Rightarrow|\vec a|=6 \]</div>
<div class="math-display">\[ x^{2}+4x^{2}+16=36\Rightarrow x^{2}=4 \]</div>
<p>Karena \(x&gt;0\), maka \(x=2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Segitiga \(ABC\) dengan \(A(1,2,0)\), \(B(3,1,2)\), dan \(C(p,3,-2)\) siku-siku di salah satu titik sudutnya. Jumlah semua nilai \(p\) yang mungkin adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac72\)` },
                { key: "B", text: h`\(\dfrac{15}{2}\)` },
                { key: "C", text: h`\(8\)` },
                { key: "D", text: h`\(\dfrac{21}{2}\)` },
                { key: "E", text: h`\(\dfrac{23}{2}\)` },
              ],
              answer: "E",
              explanation: h`<p>Periksa ketiga kemungkinan titik sudut siku-siku.</p>
<p><strong>Siku-siku di \(A\):</strong> \(\overrightarrow{AB}=(2,-1,2)\) dan \(\overrightarrow{AC}=(p-1,1,-2)\).</p>
<div class="math-display">\[ \overrightarrow{AB}\cdot\overrightarrow{AC}=2(p-1)-1-4=0\Rightarrow p=\dfrac72 \]</div>
<p><strong>Siku-siku di \(B\):</strong> \(\overrightarrow{BA}=(-2,1,-2)\) dan \(\overrightarrow{BC}=(p-3,2,-4)\).</p>
<div class="math-display">\[ -2(p-3)+2+8=0\Rightarrow p=8 \]</div>
<p><strong>Siku-siku di \(C\):</strong> hasil kali titik \(\overrightarrow{CA}\cdot\overrightarrow{CB}=p^{2}-4p+13=0\) tidak punya akar real karena diskriminannya \(16-52&lt;0\).</p>
<p>Jumlah nilai \(p\) yang mungkin: \(\dfrac72+8=\dfrac{23}{2}\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Vektor \(\vec a\), \(\vec b\), dan \(\vec c\) adalah vektor satuan dengan \(\vec a+\vec b+\vec c=\vec 0\). Nilai \(\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-3\)` },
                { key: "B", text: h`\(-2\)` },
                { key: "C", text: h`\(-\dfrac32\)` },
                { key: "D", text: h`\(-\dfrac12\)` },
                { key: "E", text: h`\(0\)` },
              ],
              answer: "C",
              explanation: h`<p>Kuadratkan panjang jumlah ketiga vektor:</p>
<div class="math-display">\[ |\vec a+\vec b+\vec c|^{2}=0=1+1+1+2(\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a) \]</div>
<p>Sehingga jumlah hasil kali titiknya \(-\dfrac32\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diketahui \(\vec a=(p,3,-2)\) dan \(\vec b=(p-8,1,-2)\). Banyak bilangan bulat \(p\) sehingga sudut antara \(\vec a\) dan \(\vec b\) tumpul adalah ....</p>`,
              options: [
                { key: "A", text: h`\(5\)` },
                { key: "B", text: h`\(6\)` },
                { key: "C", text: h`\(7\)` },
                { key: "D", text: h`\(8\)` },
                { key: "E", text: h`tak hingga` },
              ],
              answer: "A",
              explanation: h`<p>Sudut tumpul terjadi jika hasil kali titik negatif:</p>
<div class="math-display">\[ \vec a\cdot\vec b=p(p-8)+3+4=p^{2}-8p+7=(p-1)(p-7)&lt;0\Rightarrow1&lt;p&lt;7 \]</div>
<p>Bilangan bulatnya \(2,3,4,5,6\), yaitu \(5\) bilangan. Kedua vektor tidak mungkin berlawanan arah karena komponen \(z\) keduanya sama, jadi tidak ada sudut lurus yang perlu dikeluarkan.</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Pada segitiga \(ABC\), titik \(D\) terletak pada \(BC\) dengan \(BD:DC=2:1\), dan titik \(E\) terletak pada \(AD\) dengan \(AE:ED=3:1\). Garis \(BE\) diperpanjang memotong \(AC\) di \(F\). Perbandingan \(AF:FC\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1:2\)` },
                { key: "B", text: h`\(1:1\)` },
                { key: "C", text: h`\(3:2\)` },
                { key: "D", text: h`\(2:1\)` },
                { key: "E", text: h`\(3:1\)` },
              ],
              answer: "D",
              explanation: h`<p>Ambil \(A\) sebagai titik asal, \(\vec b=\overrightarrow{AB}\), dan \(\vec c=\overrightarrow{AC}\). Maka:</p>
<div class="math-display">\[ \vec d=\dfrac{\vec b+2\vec c}{3},\qquad\vec e=\dfrac34\vec d=\dfrac{\vec b+2\vec c}{4} \]</div>
<p>Titik pada garis \(BE\) berbentuk \((1-\mu)\vec b+\mu\vec e\). Titik \(F\) berada pada \(AC\), jadi koefisien \(\vec b\) harus nol:</p>
<div class="math-display">\[ 1-\mu+\dfrac{\mu}{4}=0\Rightarrow\mu=\dfrac43 \]</div>
<p>Koefisien \(\vec c\) adalah \(\dfrac{\mu}{2}=\dfrac23\), sehingga \(\overrightarrow{AF}=\dfrac23\vec c\) dan \(AF:FC=2:1\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diketahui titik \(O(0,0,0)\), \(A(2,1,0)\), \(B(0,3,1)\), dan \(C(2,1,3)\). Volume limas segitiga \(O.ABC\) adalah .... satuan volume.</p>`,
              options: [
                { key: "A", text: h`\(\dfrac12\)` },
                { key: "B", text: h`\(1\)` },
                { key: "C", text: h`\(\dfrac32\)` },
                { key: "D", text: h`\(3\)` },
                { key: "E", text: h`\(6\)` },
              ],
              answer: "D",
              explanation: h`<p>Volume limas \(=\dfrac16\left|\vec a\cdot(\vec b\times\vec c)\right|\):</p>
<div class="math-display">\[ \vec b\times\vec c=(8,2,-6),\qquad\vec a\cdot(\vec b\times\vec c)=16+2+0=18 \]</div>
<p>Volume \(=\dfrac16\cdot18=3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Garis \(g\) melalui titik \(A(1,1,1)\) dengan vektor arah \(\vec d=(2,1,2)\). Jarak titik \(Q(4,3,6)\) ke garis \(g\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\sqrt2\)` },
                { key: "B", text: h`\(\sqrt3\)` },
                { key: "C", text: h`\(2\)` },
                { key: "D", text: h`\(2\sqrt2\)` },
                { key: "E", text: h`\(3\sqrt2\)` },
              ],
              answer: "A",
              explanation: h`<p>Jarak titik ke garis \(=\dfrac{|\overrightarrow{AQ}\times\vec d|}{|\vec d|}\):</p>
<div class="math-display">\[ \overrightarrow{AQ}=(3,2,5),\qquad\overrightarrow{AQ}\times\vec d=(-1,4,-1),\qquad\left|\overrightarrow{AQ}\times\vec d\right|=\sqrt{18}=3\sqrt2 \]</div>
<p>Karena \(|\vec d|=3\), jaraknya \(\dfrac{3\sqrt2}{3}=\sqrt2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Pada kubus \(ABCD.EFGH\) dengan panjang rusuk \(4\), titik \(P\) adalah titik tengah rusuk \(EF\). Nilai kosinus sudut \(\angle APC\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac15\)` },
                { key: "B", text: h`\(\dfrac{\sqrt5}{10}\)` },
                { key: "C", text: h`\(\dfrac{\sqrt5}{6}\)` },
                { key: "D", text: h`\(\dfrac25\)` },
                { key: "E", text: h`\(\dfrac{\sqrt5}{5}\)` },
              ],
              answer: "E",
              explanation: h`<p>Pasang koordinat \(A(0,0,0)\), \(C(4,4,0)\), dan \(P(2,0,4)\). Maka:</p>
<div class="math-display">\[ \overrightarrow{PA}=(-2,0,-4),\qquad\overrightarrow{PC}=(2,4,-4) \]</div>
<p>Hasil kali titiknya \(-4+0+16=12\), dengan \(|PA|=2\sqrt5\) dan \(|PC|=6\):</p>
<div class="math-display">\[ \cos\angle APC=\dfrac{12}{2\sqrt5\cdot6}=\dfrac{1}{\sqrt5}=\dfrac{\sqrt5}{5} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diketahui \(|\vec a|=|\vec b|=|\vec a+\vec b|\). Besar sudut antara vektor \(\vec a\) dan vektor \(\vec a-\vec b\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(15^\circ\)` },
                { key: "B", text: h`\(30^\circ\)` },
                { key: "C", text: h`\(45^\circ\)` },
                { key: "D", text: h`\(60^\circ\)` },
                { key: "E", text: h`\(90^\circ\)` },
              ],
              answer: "B",
              explanation: h`<p>Misalkan panjang ketiganya \(k\). Dari \(|\vec a+\vec b|^{2}=k^{2}\):</p>
<div class="math-display">\[ k^{2}=2k^{2}+2\vec a\cdot\vec b\Rightarrow\vec a\cdot\vec b=-\dfrac{k^{2}}{2} \]</div>
<p>Maka \(|\vec a-\vec b|^{2}=2k^{2}-2\vec a\cdot\vec b=3k^{2}\) dan \(\vec a\cdot(\vec a-\vec b)=k^{2}+\dfrac{k^{2}}{2}=\dfrac{3k^{2}}{2}\):</p>
<div class="math-display">\[ \cos\alpha=\dfrac{3k^{2}/2}{k\cdot\sqrt3\,k}=\dfrac{\sqrt3}{2}\Rightarrow\alpha=30^\circ \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diketahui \(|\vec a|=3\), \(|\vec b|=4\), dan \(|\vec a+\vec b|=2|\vec a-\vec b|\). Jika \(\theta\) adalah sudut antara \(\vec a\) dan \(\vec b\), maka \(\cos\theta=\) ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac58\)` },
                { key: "B", text: h`\(\dfrac23\)` },
                { key: "C", text: h`\(\dfrac34\)` },
                { key: "D", text: h`\(\dfrac45\)` },
                { key: "E", text: h`\(\dfrac78\)` },
              ],
              answer: "A",
              explanation: h`<p>Gunakan aturan panjang jumlah dan selisih vektor:</p>
<div class="math-display">\[ |\vec a+\vec b|^{2}=25+24\cos\theta,\qquad|\vec a-\vec b|^{2}=25-24\cos\theta \]</div>
<p>Syarat \(|\vec a+\vec b|^{2}=4|\vec a-\vec b|^{2}\):</p>
<div class="math-display">\[ 25+24\cos\theta=4(25-24\cos\theta)\Rightarrow120\cos\theta=75\Rightarrow\cos\theta=\dfrac58 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
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
              prompt: h`<p>Diketahui \(\vec u=6\vec i+a\vec j+b\vec k\) dan \(\vec v=a\vec i-\vec j+2\vec k\). Jika proyeksi vektor ortogonal \(\vec u\) pada \(\vec v\) adalah \(\vec p=4\vec i-2\vec j+4\vec k\), maka nilai \(a+b\) adalah ....</p>`,
              answer: ["6"],
              explanation: h`<p>Karena \(\vec p\) sejajar \(\vec v\), tulis \(\vec p=n\vec v\):</p>
<div class="math-display">\[ (4,-2,4)=(na,-n,2n)\Rightarrow n=2,\ a=2 \]</div>
<p>Dengan \(\vec u=(6,2,b)\) dan \(\vec v=(2,-1,2)\), dan \(n=\dfrac{\vec u\cdot\vec v}{|\vec v|^{2}}\):</p>
<div class="math-display">\[ \dfrac{12-2+2b}{9}=2\Rightarrow b=4 \]</div>
<p>Jadi, jawabannya adalah \(a+b=\) <strong>6</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Diketahui \(|\vec a|=4\), \(|\vec b|=6\), dan sudut antara \(\vec a\) dan \(\vec b\) adalah \(120^\circ\). Nilai \(|2\vec a-\vec b|\) adalah .... (boleh dalam bentuk akar)</p>`,
              answer: [
                "2√37",
                "2sqrt37",
                "2sqrt(37)",
                "2√(37)",
                "√148",
                "sqrt148",
                "sqrt(148)",
              ],
              explanation: h`<p>Hitung hasil kali titiknya terlebih dahulu:</p>
<div class="math-display">\[ \vec a\cdot\vec b=4\cdot6\cos120^\circ=-12 \]</div>
<div class="math-display">\[ |2\vec a-\vec b|^{2}=4|\vec a|^{2}-4\,\vec a\cdot\vec b+|\vec b|^{2}=64+48+36=148 \]</div>
<p>Jadi, jawabannya adalah <strong>\(\sqrt{148}=2\sqrt{37}\)</strong>.</p>`,
            },
            {
              id: "isian-3",
              no: 3,
              type: "short",
              level: "sedang",
              prompt: h`<p>Garis \(g\) melalui \(A(2,-1,3)\) dengan vektor arah \(\vec d=(1,2,-2)\). Titik \(P\) pada \(g\) berjarak \(6\) satuan dari \(A\) dan berabsis lebih dari \(2\). Jumlah koordinat titik \(P\) adalah ....</p>`,
              answer: ["6"],
              explanation: h`<p>Panjang vektor arah \(|\vec d|=3\). Titik pada garis berbentuk \(P=A+t\vec d\) dengan \(3|t|=6\), sehingga \(t=\pm2\).</p>
<p>Absis \(2+t&gt;2\) berarti \(t=2\):</p>
<div class="math-display">\[ P=(2,-1,3)+2(1,2,-2)=(4,3,-1) \]</div>
<p>Jumlah koordinatnya \(4+3-1=\) <strong>6</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sedang",
              prompt: h`<p>Titik \(P\) terletak pada sumbu-\(x\) dan berjarak sama terhadap \(A(1,2,2)\) dan \(B(3,-2,4)\). Koordinat titik \(P\) adalah .... (tuliskan dalam bentuk (a,b,c))</p>`,
              answer: ["(5,0,0)", "5,0,0", "P(5,0,0)"],
              explanation: h`<p>Misalkan \(P(t,0,0)\), lalu samakan kuadrat jaraknya:</p>
<div class="math-display">\[ |PA|^{2}=(t-1)^{2}+8,\qquad|PB|^{2}=(t-3)^{2}+20 \]</div>
<div class="math-display">\[ t^{2}-2t+9=t^{2}-6t+29\Rightarrow4t=20\Rightarrow t=5 \]</div>
<p>Jadi, jawabannya adalah <strong>\(P(5,0,0)\)</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Vektor \(\vec a=(2,-1,k)\), \(\vec b=(1,3,2)\), dan \(\vec c=(0,1,-1)\) terletak pada satu bidang (sebidang). Nilai \(k\) adalah ....</p>`,
              answer: ["11"],
              explanation: h`<p>Tiga vektor sebidang jika hasil kali tripel skalarnya nol, yaitu \(\vec a\cdot(\vec b\times\vec c)=0\):</p>
<div class="math-display">\[ \vec b\times\vec c=(-5,1,1) \]</div>
<div class="math-display">\[ \vec a\cdot(\vec b\times\vec c)=-10-1+k=0\Rightarrow k=11 \]</div>
<p>Jadi, jawabannya adalah <strong>11</strong>.</p>`,
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
              prompt: h`<p>Diketahui vektor \(\vec a\) dan \(\vec b\) tak nol.</p>`,
              promptAfter: h`<ol type="a">
<li>Buktikan bahwa jika \(|\vec a|=|\vec b|\), maka \((\vec a+\vec b)\perp(\vec a-\vec b)\).</li>
<li>Diketahui \(\vec a=\vec i+2\vec j+2\vec k\) dan \(\vec b=2\vec i+p\vec j+\vec k\) dengan \(p&gt;0\) dan \(|\vec a|=|\vec b|\). Tentukan \(p\).</li>
<li>Dengan nilai \(p\) tersebut, hitunglah luas jajargenjang yang dibentuk \(\vec a\) dan \(\vec b\) dengan dua cara: memakai hasil kali silang, dan memakai panjang kedua diagonalnya.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong></p>
<div class="math-display">\[ (\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^{2}-|\vec b|^{2}=0 \]</div>
<p>karena \(|\vec a|=|\vec b|\), sehingga kedua vektor tegak lurus.</p>
<p><strong>(b)</strong> \(|\vec a|^{2}=1+4+4=9\) dan \(|\vec b|^{2}=4+p^{2}+1=5+p^{2}\).</p>
<div class="math-display">\[ 5+p^{2}=9\Rightarrow p^{2}=4 \]</div>
<p>Karena \(p&gt;0\), maka \(p=2\).</p>
<p><strong>(c) Cara 1:</strong> dengan \(\vec b=(2,2,1)\),</p>
<div class="math-display">\[ \vec a\times\vec b=(-2,3,-2),\qquad L=\sqrt{4+9+4}=\sqrt{17} \]</div>
<p><strong>Cara 2:</strong> karena \(|\vec a|=|\vec b|\), jajargenjang berupa belah ketupat dengan diagonal \(\vec a+\vec b=(3,4,3)\) dan \(\vec a-\vec b=(-1,0,1)\):</p>
<div class="math-display">\[ L=\dfrac12\sqrt{34}\cdot\sqrt2=\sqrt{17} \]</div>
<p class="penskoran"><em>Penskoran: bagian (a) 3 poin; (b) 2 poin; (c) 3 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Diketahui titik \(A(2,0,-1)\), \(B(4,2,0)\), dan \(C(5,3,5)\).</p>`,
              promptAfter: h`<ol type="a">
<li>Tulislah persamaan vektor garis \(AB\).</li>
<li>Tentukan koordinat titik \(T\) pada garis \(AB\) yang terdekat dengan \(C\), lalu hitung jarak \(C\) ke garis \(AB\).</li>
<li>Hitunglah luas segitiga \(ABC\) dengan dua cara.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> \(\overrightarrow{AB}=(2,2,1)\), sehingga:</p>
<div class="math-display">\[ \vec r=(2,0,-1)+t(2,2,1) \]</div>
<p><strong>(b)</strong> \(\overrightarrow{AC}=(3,3,6)\). Titik \(T=A+t\vec d\) dengan \(\overrightarrow{CT}\perp\vec d\), dan \(\vec d=(2,2,1)\):</p>
<div class="math-display">\[ t=\dfrac{\overrightarrow{AC}\cdot\vec d}{|\vec d|^{2}}=\dfrac{18}{9}=2\Rightarrow T(6,4,1) \]</div>
<div class="math-display">\[ \overrightarrow{CT}=(1,1,-4),\qquad|CT|=\sqrt{18}=3\sqrt2 \]</div>
<p><strong>(c) Cara 1:</strong></p>
<div class="math-display">\[ \overrightarrow{AB}\times\overrightarrow{AC}=(9,-9,0),\qquad L=\dfrac12\cdot9\sqrt2=\dfrac{9\sqrt2}{2} \]</div>
<p><strong>Cara 2:</strong> alas \(|AB|=3\) dan tinggi \(CT=3\sqrt2\):</p>
<div class="math-display">\[ L=\dfrac12\cdot3\cdot3\sqrt2=\dfrac{9\sqrt2}{2} \]</div>
<p class="penskoran"><em>Penskoran: bagian (a) 2 poin; (b) 4 poin; (c) 2 poin.</em></p>`,
            },
            {
              id: "uraian-3",
              no: 3,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Pada segitiga \(ABC\), titik \(D\) adalah titik tengah \(BC\), dan \(G\) adalah titik berat segitiga.</p>`,
              promptAfter: h`<ol type="a">
<li>Buktikan dengan vektor posisi bahwa \(\vec g=\dfrac{\vec a+\vec b+\vec c}{3}\) terletak pada \(AD\) dan \(AG:GD=2:1\).</li>
<li>Jika \(A(4,-1,1)\), \(B(0,1,3)\), dan \(C(2,3,5)\), tentukan koordinat \(G\) dan \(D\).</li>
<li>Hitunglah panjang \(AG\) dan \(GD\), lalu periksa perbandingannya.</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Karena \(D\) titik tengah \(BC\), \(\vec d=\dfrac{\vec b+\vec c}{2}\). Titik yang membagi \(AD\) dengan perbandingan \(2:1\) adalah:</p>
<div class="math-display">\[ \vec g=\dfrac{1\cdot\vec a+2\vec d}{3}=\dfrac{\vec a+\vec b+\vec c}{3} \]</div>
<p>Hasil ini sama dengan rumus titik berat, sehingga \(G\) terletak pada \(AD\) dan \(AG:GD=2:1\).</p>
<p><strong>(b)</strong></p>
<div class="math-display">\[ G=\left(\dfrac{4+0+2}{3},\dfrac{-1+1+3}{3},\dfrac{1+3+5}{3}\right)=(2,1,3),\qquad D=\left(\dfrac{0+2}{2},\dfrac{1+3}{2},\dfrac{3+5}{2}\right)=(1,2,4) \]</div>
<p><strong>(c)</strong> \(\overrightarrow{AG}=(-2,2,2)\) sehingga \(|AG|=2\sqrt3\); \(\overrightarrow{GD}=(-1,1,1)\) sehingga \(|GD|=\sqrt3\). Maka \(AG:GD=2\sqrt3:\sqrt3=2:1\).</p>
<p class="penskoran"><em>Penskoran: bagian (a) 4 poin; (b) 2 poin; (c) 2 poin.</em></p>`,
            },
          ],
        },
        {
          level: "sulit",
          questions: [
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Ketaksamaan Cauchy-Schwarz menyatakan \(|\vec a\cdot\vec b|\le|\vec a|\,|\vec b|\).</p>`,
              promptAfter: h`<ol type="a">
<li>Buktikan ketaksamaan tersebut menggunakan \(\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta\), dan tentukan kapan kesamaan terjadi.</li>
<li>Jika \(x^{2}+y^{2}+z^{2}=49\), tentukan nilai maksimum \(2x+3y+6z\) beserta nilai \(x,y,z\) saat maksimum tercapai.</li>
<li>Jika \(2x+3y+6z=21\), tentukan nilai minimum \(x^{2}+y^{2}+z^{2}\).</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong></p>
<div class="math-display">\[ (\vec a\cdot\vec b)^{2}=|\vec a|^{2}|\vec b|^{2}\cos^{2}\theta\le|\vec a|^{2}|\vec b|^{2} \]</div>
<p>karena \(\cos^{2}\theta\le1\). Kesamaan terjadi saat \(\cos^{2}\theta=1\), yaitu ketika \(\vec a\parallel\vec b\).</p>
<p><strong>(b)</strong> Ambil \(\vec a=(2,3,6)\) dan \(\vec b=(x,y,z)\), dengan \(|\vec a|=7\):</p>
<div class="math-display">\[ 2x+3y+6z\le\sqrt{49}\cdot\sqrt{49}=49 \]</div>
<p>Maksimum \(49\) dicapai saat \((x,y,z)=k(2,3,6)\) dengan \(49k^{2}=49\), yaitu \((x,y,z)=(2,3,6)\).</p>
<p><strong>(c)</strong></p>
<div class="math-display">\[ 21=2x+3y+6z\le7\sqrt{x^{2}+y^{2}+z^{2}}\Rightarrow x^{2}+y^{2}+z^{2}\ge9 \]</div>
<p>Minimum \(9\) dicapai di \((x,y,z)=\left(\dfrac67,\dfrac97,\dfrac{18}{7}\right)\).</p>
<p class="penskoran"><em>Penskoran: bagian (a) 2 poin; (b) 3 poin; (c) 3 poin.</em></p>`,
            },
            {
              id: "uraian-5",
              no: 5,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Kubus \(ABCD.EFGH\) memiliki panjang rusuk \(6\). Tempatkan \(A(0,0,0)\), \(B(6,0,0)\), \(D(0,6,0)\), dan \(E(0,0,6)\). Titik \(P\) adalah titik tengah rusuk \(CG\) dan \(Q\) adalah titik tengah rusuk \(EH\).</p>`,
              promptAfter: h`<ol type="a">
<li>Tentukan nilai \(\cos\angle PAQ\).</li>
<li>Tentukan proyeksi skalar ortogonal \(\overrightarrow{AP}\) pada \(\overrightarrow{AQ}\).</li>
<li>Hitunglah luas segitiga \(APQ\).</li>
</ol>`,
              explanation: h`<p>Diperoleh \(C(6,6,0)\), \(G(6,6,6)\), dan \(H(0,6,6)\), sehingga \(P(6,6,3)\) dan \(Q(0,3,6)\).</p>
<p><strong>(a)</strong> \(\overrightarrow{AP}=(6,6,3)\) dengan \(|AP|=9\), dan \(\overrightarrow{AQ}=(0,3,6)\) dengan \(|AQ|=3\sqrt5\). Hasil kali titiknya \(36\):</p>
<div class="math-display">\[ \cos\angle PAQ=\dfrac{36}{9\cdot3\sqrt5}=\dfrac{4}{3\sqrt5}=\dfrac{4\sqrt5}{15} \]</div>
<p><strong>(b)</strong></p>
<div class="math-display">\[ \dfrac{\overrightarrow{AP}\cdot\overrightarrow{AQ}}{|\overrightarrow{AQ}|}=\dfrac{36}{3\sqrt5}=\dfrac{12\sqrt5}{5} \]</div>
<p><strong>(c)</strong></p>
<div class="math-display">\[ \overrightarrow{AP}\times\overrightarrow{AQ}=(27,-36,18),\qquad\left|\overrightarrow{AP}\times\overrightarrow{AQ}\right|=9\sqrt{29},\qquad L=\dfrac{9\sqrt{29}}{2} \]</div>
<p class="penskoran"><em>Penskoran: bagian (a) 3 poin; (b) 2 poin; (c) 3 poin.</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default vektor;
