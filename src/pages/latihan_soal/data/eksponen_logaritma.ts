import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Eksponen dan Logaritma.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const eksponenLogaritma: Material = {
  slug: "eksponen-logaritma",
  title: "Latihan Soal Eksponen dan Logaritma",
  topic: "Eksponen dan Logaritma",
  description:
    "Sifat eksponen dan logaritma, bentuk akar, persamaan dan pertidaksamaan eksponen dan logaritma, grafik fungsi eksponen, serta pemodelan.",
  durationMinutes: 90,
  notes: [
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin).`,
    h`Untuk soal logaritma, perhatikan syarat basis (\(&gt;0\) dan \(\neq1\))
serta numerus (\(&gt;0\)).`,
    h`Notasi \({}^{a}\!\log b\) dibaca "logaritma \(b\) dengan basis \(a\)", dan
\(\log b\) berbasis \(10\).`,
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
              prompt: h`<p>Nilai dari \(2^{3}\cdot 2^{4}\div 2^{5}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(8\)` },
                { key: "D", text: h`\(16\)` },
                { key: "E", text: h`\(32\)` },
              ],
              answer: "B",
              explanation: h`<p>Pada perkalian, pangkat dijumlahkan; pada pembagian, pangkat dikurangkan:</p>
<div class="math-display">\[ 2^{3+4-5}=2^{2}=4 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Nilai dari \(\left(\dfrac{2}{3}\right)^{-2}+8^{\frac{2}{3}}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac{17}{4}\)` },
                { key: "B", text: h`\(\dfrac{40}{9}\)` },
                { key: "C", text: h`\(\dfrac{25}{4}\)` },
                { key: "D", text: h`\(\dfrac{148}{9}\)` },
                { key: "E", text: h`\(\dfrac{73}{4}\)` },
              ],
              answer: "C",
              explanation: h`<p>Kerjakan masing-masing suku:</p>
<div class="math-display">\[ \left(\dfrac23\right)^{-2}=\dfrac94,\qquad 8^{\frac23}=(2^{3})^{\frac23}=2^{2}=4 \]</div>
<p>Jumlahnya:</p>
<div class="math-display">\[ \dfrac94+4=\dfrac{25}{4} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Nilai dari \({}^{2}\!\log 32+{}^{3}\!\log\dfrac{1}{27}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-2\)` },
                { key: "B", text: h`\(0\)` },
                { key: "C", text: h`\(1\)` },
                { key: "D", text: h`\(2\)` },
                { key: "E", text: h`\(8\)` },
              ],
              answer: "D",
              explanation: h`<p>Ubah numerus menjadi bentuk pangkat dari basisnya:</p>
<div class="math-display">\[ {}^{2}\!\log 32=5,\qquad {}^{3}\!\log 3^{-3}=-3 \]</div>
<p>Sehingga hasilnya \(5-3=2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Nilai \(x\) yang memenuhi \(5^{2x-1}=125\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(5\)` },
              ],
              answer: "B",
              explanation: h`<p>Samakan basis, karena \(125=5^{3}\):</p>
<div class="math-display">\[ 5^{2x-1}=5^{3}\Rightarrow 2x-1=3\Rightarrow x=2 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Nilai dari \({}^{2}\!\log 3\cdot{}^{3}\!\log 8\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(3\)` },
                { key: "B", text: h`\(4\)` },
                { key: "C", text: h`\(6\)` },
                { key: "D", text: h`\(8\)` },
                { key: "E", text: h`\(12\)` },
              ],
              answer: "A",
              explanation: h`<p>Gunakan sifat rantai logaritma \({}^{a}\!\log b\cdot{}^{b}\!\log c={}^{a}\!\log c\):</p>
<div class="math-display">\[ {}^{2}\!\log 3\cdot{}^{3}\!\log 8={}^{2}\!\log 8=3 \]</div>
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
              prompt: h`<p>Bentuk sederhana dari \(\dfrac{a^{5}b^{-3}}{a^{2}b^{-6}}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(a^{3}b^{-9}\)` },
                { key: "B", text: h`\(a^{7}b^{-9}\)` },
                { key: "C", text: h`\(a^{7}b^{3}\)` },
                { key: "D", text: h`\(a^{3}b^{-3}\)` },
                { key: "E", text: h`\(a^{3}b^{3}\)` },
              ],
              answer: "E",
              explanation: h`<p>Kurangkan pangkat untuk setiap basis yang sama:</p>
<div class="math-display">\[ a^{5-2}\,b^{-3-(-6)}=a^{3}b^{3} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Bentuk sederhana dari \(\frac{6}{3-\sqrt{3}}+\frac{2}{\sqrt{3}+1}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2\sqrt{3}\)` },
                { key: "B", text: h`\(1+2\sqrt{3}\)` },
                { key: "C", text: h`\(2+2\sqrt{3}\)` },
                { key: "D", text: h`\(4+\sqrt{3}\)` },
                { key: "E", text: h`\(4+2\sqrt{3}\)` },
              ],
              answer: "C",
              explanation: h`<p>Rasionalkan masing-masing penyebut:</p>
<div class="math-display">\[ \dfrac{6}{3-\sqrt3}\cdot\dfrac{3+\sqrt3}{3+\sqrt3}=\dfrac{6(3+\sqrt3)}{6}=3+\sqrt3 \]</div>
<div class="math-display">\[ \dfrac{2}{\sqrt3+1}\cdot\dfrac{\sqrt3-1}{\sqrt3-1}=\dfrac{2(\sqrt3-1)}{2}=\sqrt3-1 \]</div>
<p>Jumlahnya \((3+\sqrt3)+(\sqrt3-1)=2+2\sqrt3\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Penyelesaian persamaan \(\left(\dfrac{1}{4}\right)^{x-1}=8^{x+2}\) adalah \(x=\) ....</p>`,
              options: [
                { key: "A", text: h`\(-2\)` },
                { key: "B", text: h`\(-\dfrac{6}{5}\)` },
                { key: "C", text: h`\(-1\)` },
                { key: "D", text: h`\(-\dfrac{4}{5}\)` },
                { key: "E", text: h`\(\dfrac{4}{5}\)` },
              ],
              answer: "D",
              explanation: h`<p>Ubah kedua ruas ke basis \(2\), dengan \(\dfrac14=2^{-2}\) dan \(8=2^{3}\):</p>
<div class="math-display">\[ 2^{-2(x-1)}=2^{3(x+2)}\Rightarrow -2x+2=3x+6\Rightarrow x=-\dfrac45 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Himpunan penyelesaian \({}^{2}\!\log(x+1)+{}^{2}\!\log(x-1)=3\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\{3\}\)` },
                { key: "B", text: h`\(\{-3\}\)` },
                { key: "C", text: h`\(\{-3,3\}\)` },
                { key: "D", text: h`\(\{8\}\)` },
                { key: "E", text: h`\(\{-8,8\}\)` },
              ],
              answer: "A",
              explanation: h`<p>Syarat numerus: \(x+1>0\) dan \(x-1>0\), sehingga \(x>1\). Gabungkan kedua logaritma:</p>
<div class="math-display">\[ (x+1)(x-1)=2^{3}\Rightarrow x^{2}-1=8\Rightarrow x^{2}=9\Rightarrow x=\pm3 \]</div>
<p>Karena \(x>1\), hanya \(x=3\) yang memenuhi. Pilihan C salah karena lupa menguji syarat numerus.</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Diketahui \(\log 2=a\) dan \(\log 3=b\). Nilai \(\log 72\) dinyatakan dalam \(a\) dan \(b\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2a+3b\)` },
                { key: "B", text: h`\(3a+3b\)` },
                { key: "C", text: h`\(6ab\)` },
                { key: "D", text: h`\(2a+2b\)` },
                { key: "E", text: h`\(3a+2b\)` },
              ],
              answer: "E",
              explanation: h`<p>Faktorkan \(72=2^{3}\cdot3^{2}\):</p>
<div class="math-display">\[ \log72=3\log2+2\log3=3a+2b \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
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
              prompt: h`<p>Himpunan penyelesaian \(\left(\dfrac{1}{2}\right)^{2x-1}\ge\dfrac{1}{8}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(x\ge2\)` },
                { key: "B", text: h`\(x\le2\)` },
                { key: "C", text: h`\(x\le\dfrac32\)` },
                { key: "D", text: h`\(x\ge\dfrac32\)` },
                { key: "E", text: h`\(x\le3\)` },
              ],
              answer: "B",
              explanation: h`<p>Samakan basis: \(\dfrac18=\left(\dfrac12\right)^{3}\). Karena basis \(\dfrac12&lt;1\), tanda pertidaksamaan berbalik:</p>
<div class="math-display">\[ 2x-1\le3\Rightarrow x\le2 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Grafik fungsi \(f(x)=3^{x-1}+2\) memotong sumbu-\(y\) di titik ....</p>`,
              options: [
                { key: "A", text: h`\(\left(0,\dfrac53\right)\)` },
                { key: "B", text: h`\((0,2)\)` },
                { key: "C", text: h`\(\left(0,\dfrac73\right)\)` },
                { key: "D", text: h`\((0,3)\)` },
                { key: "E", text: h`\((0,5)\)` },
              ],
              answer: "C",
              explanation: h`<p>Titik potong dengan sumbu-\(y\) diperoleh saat \(x=0\):</p>
<div class="math-display">\[ f(0)=3^{-1}+2=\dfrac13+2=\dfrac73 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Himpunan penyelesaian pertidaksamaan \({}^{\frac{1}{2}}\!\log(x^{2}-3x)\ge-2\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-1\le x\le4\)` },
                { key: "B", text: h`\(x\le-1\) atau \(x\ge4\)` },
                { key: "C", text: h`\(0&lt;x&lt;3\)` },
                { key: "D", text: h`\(-1\le x&lt;0\) atau \(x>3\)` },
                { key: "E", text: h`\(-1\le x&lt;0\) atau \(3&lt;x\le4\)` },
              ],
              answer: "E",
              explanation: h`<p><strong>Syarat numerus:</strong></p>
<div class="math-display">\[ x^{2}-3x>0\Rightarrow x&lt;0\ \text{atau}\ x>3 \]</div>
<p><strong>Pertidaksamaan:</strong> karena basis \(\dfrac12&lt;1\), tanda berbalik.</p>
<div class="math-display">\[ x^{2}-3x\le\left(\dfrac12\right)^{-2}=4\Rightarrow x^{2}-3x-4\le0\Rightarrow-1\le x\le4 \]</div>
<p>Irisan kedua syarat: \(-1\le x&lt;0\) atau \(3&lt;x\le4\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Jumlah semua penyelesaian persamaan \(2^{x+1}+2^{2-x}=9\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(\dfrac32\)` },
                { key: "C", text: h`\(2\)` },
                { key: "D", text: h`\(\dfrac92\)` },
                { key: "E", text: h`\(9\)` },
              ],
              answer: "A",
              explanation: h`<p>Tulis ulang persamaan:</p>
<div class="math-display">\[ 2\cdot2^{x}+\dfrac{4}{2^{x}}=9 \]</div>
<p>Misalkan \(t=2^{x}>0\), maka:</p>
<div class="math-display">\[ 2t^{2}-9t+4=0\Rightarrow(2t-1)(t-4)=0\Rightarrow t=\dfrac12\ \text{atau}\ t=4 \]</div>
<p>Sehingga \(x=-1\) atau \(x=2\). Jumlahnya \(-1+2=1\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Jika \({}^{2}\!\log 3=p\), maka \({}^{6}\!\log 24=\) ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac{p+1}{p+3}\)` },
                { key: "B", text: h`\(\dfrac{p+3}{p}\)` },
                { key: "C", text: h`\(\dfrac{3p+1}{p+1}\)` },
                { key: "D", text: h`\(\dfrac{p+3}{p+1}\)` },
                { key: "E", text: h`\(\dfrac{3p}{p+1}\)` },
              ],
              answer: "D",
              explanation: h`<p>Ubah ke basis \(2\):</p>
<div class="math-display">\[ {}^{2}\!\log24={}^{2}\!\log8+{}^{2}\!\log3=3+p,\qquad {}^{2}\!\log6=1+p \]</div>
<div class="math-display">\[ {}^{6}\!\log24=\dfrac{{}^{2}\!\log24}{{}^{2}\!\log6}=\dfrac{p+3}{p+1} \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          questions: [
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "hots",
              prompt: h`<p>Jika \(x_{1}\) dan \(x_{2}\) adalah akar-akar persamaan \((\log x)^{2}-5\log x+6=0\), maka \(x_{1}\cdot x_{2}=\) ....</p>`,
              options: [
                { key: "A", text: h`\(6\)` },
                { key: "B", text: h`\(1.100\)` },
                { key: "C", text: h`\(10^{5}\)` },
                { key: "D", text: h`\(10^{6}\)` },
                { key: "E", text: h`\(10^{11}\)` },
              ],
              answer: "C",
              explanation: h`<p>Misalkan \(y=\log x\):</p>
<div class="math-display">\[ y^{2}-5y+6=0\Rightarrow(y-2)(y-3)=0\Rightarrow y=2\ \text{atau}\ y=3 \]</div>
<p>Sehingga \(x_{1}=10^{2}\) dan \(x_{2}=10^{3}\), dan hasil kalinya \(10^{5}\). Cara lain: \(\log x_{1}+\log x_{2}=5\), jadi \(x_{1}x_{2}=10^{5}\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "hots",
              prompt: h`<p>Nilai \(x\) yang memenuhi \({}^{2}\!\log\!\left({}^{3}\!\log\!\left({}^{2}\!\log x\right)\right)=1\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(512\)` },
                { key: "B", text: h`\(729\)` },
                { key: "C", text: h`\(1.024\)` },
                { key: "D", text: h`\(6.561\)` },
                { key: "E", text: h`\(19.683\)` },
              ],
              answer: "A",
              explanation: h`<p>Selesaikan dari logaritma terluar:</p>
<div class="math-display">\[ {}^{2}\!\log(\cdots)=1\Rightarrow{}^{3}\!\log\left({}^{2}\!\log x\right)=2\Rightarrow{}^{2}\!\log x=3^{2}=9\Rightarrow x=2^{9}=512 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "hots",
              prompt: h`<p>Nilai dari \(\dfrac{1}{{}^{2}\!\log 900}+\dfrac{1}{{}^{3}\!\log 900}+\dfrac{1}{{}^{5}\!\log 900}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\dfrac14\)` },
                { key: "B", text: h`\(\dfrac12\)` },
                { key: "C", text: h`\(1\)` },
                { key: "D", text: h`\(2\)` },
                { key: "E", text: h`\(4\)` },
              ],
              answer: "B",
              explanation: h`<p>Karena \(\dfrac{1}{{}^{a}\!\log b}={}^{b}\!\log a\), jumlahnya menjadi:</p>
<div class="math-display">\[ {}^{900}\!\log2+{}^{900}\!\log3+{}^{900}\!\log5={}^{900}\!\log30 \]</div>
<p>Sebab \(900=30^{2}\), maka \({}^{900}\!\log30=\dfrac12\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt: h`<p>Larutan X ber-pH \(3\) dicampur dengan larutan Y ber-pH \(5\) dalam volume yang sama. Jika \(\mathrm{pH}=-\log[\mathrm{H}^{+}]\) dan \(\log 2=0{,}3\), pH campuran mendekati ....</p>`,
              options: [
                { key: "A", text: h`\(2{,}7\)` },
                { key: "B", text: h`\(3{,}0\)` },
                { key: "C", text: h`\(3{,}1\)` },
                { key: "D", text: h`\(3{,}3\)` },
                { key: "E", text: h`\(4{,}0\)` },
              ],
              answer: "D",
              explanation: h`<p>Pada volume yang sama, konsentrasi \([\mathrm{H}^{+}]\) campuran adalah rata-rata kedua larutan:</p>
<div class="math-display">\[ [\mathrm{H}^{+}]=\dfrac{10^{-3}+10^{-5}}{2}\approx5\times10^{-4} \]</div>
<p>Maka:</p>
<div class="math-display">\[ \mathrm{pH}=4-\log5=4-(1-\log2)=4-0{,}7=3{,}3 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "hots",
              prompt: h`<p>Jika \(2^{a}=3^{b}=6^{c}\) dengan \(a,b,c\neq0\), maka \(\dfrac{1}{a}+\dfrac{1}{b}=\) ....</p>`,
              options: [
                { key: "A", text: h`\(c\)` },
                { key: "B", text: h`\(2c\)` },
                { key: "C", text: h`\(c^{2}\)` },
                { key: "D", text: h`\(\dfrac{c}{2}\)` },
                { key: "E", text: h`\(\dfrac{1}{c}\)` },
              ],
              answer: "E",
              explanation: h`<p>Dari \(2^{a}=6^{c}\) dan \(3^{b}=6^{c}\) diperoleh \(2=6^{c/a}\) dan \(3=6^{c/b}\). Kalikan keduanya:</p>
<div class="math-display">\[ 6=2\cdot3=6^{\frac ca+\frac cb}\Rightarrow\dfrac ca+\dfrac cb=1\Rightarrow\dfrac1a+\dfrac1b=\dfrac1c \]</div>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
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
              prompt: h`<p>Zat radioaktif memiliki waktu paruh \(6\) jam. Jika massa mula-mula \(96\) gram, maka massa zat tersisa \(1{,}5\) gram setelah .... jam.</p>`,
              answer: ["36", "36 jam"],
              explanation: h`<p>Gunakan rumus peluruhan setengah-setengah:</p>
<div class="math-display">\[ 1{,}5=96\left(\dfrac12\right)^{t/6}\Rightarrow\left(\dfrac12\right)^{t/6}=\dfrac{1}{64}=\left(\dfrac12\right)^{6}\Rightarrow t=36 \]</div>
<p>Jadi, jawabannya adalah <strong>36 jam</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Bentuk sederhana dari \(\dfrac{\left(a^{-2}b^{3}\right)^{2}\cdot a^{5}}{b^{4}}\) dengan pangkat positif adalah ....</p>`,
              answer: ["ab^2", "a*b^2", "ab2", "b^2a", "b^2*a"],
              explanation: h`<p>Pangkatkan terlebih dahulu bagian dalam kurung, lalu sederhanakan:</p>
<div class="math-display">\[ \dfrac{a^{-4}b^{6}\cdot a^{5}}{b^{4}}=a^{-4+5}\,b^{6-4}=ab^{2} \]</div>
<p>Jadi, jawabannya adalah <strong>\(ab^{2}\)</strong>.</p>`,
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
              prompt: h`<p>Diketahui \({}^{2}\!\log 3=p\) dan \({}^{3}\!\log 5=q\). Nyatakan \({}^{4}\!\log 15\) dalam \(p\) dan \(q\).</p>`,
              answer: ["p(1+q)/2", "p(q+1)/2", "(p+pq)/2", "(pq+p)/2", "(1/2)p(1+q)", "(1/2)(p+pq)"],
              explanation: h`<p>Pertama, \({}^{2}\!\log5={}^{2}\!\log3\cdot{}^{3}\!\log5=pq\), sehingga:</p>
<div class="math-display">\[ {}^{2}\!\log15={}^{2}\!\log3+{}^{2}\!\log5=p+pq \]</div>
<div class="math-display">\[ {}^{4}\!\log15=\dfrac{{}^{2}\!\log15}{{}^{2}\!\log4}=\dfrac{p(1+q)}{2} \]</div>
<p>Jadi, jawabannya adalah <strong>\(\dfrac{p(1+q)}{2}\)</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Nilai \(x\) yang memenuhi \({}^{x}\!\log(3x+4)=2\) adalah ....</p>`,
              answer: ["4"],
              explanation: h`<p>Ubah ke bentuk eksponen, lalu selesaikan persamaan kuadrat:</p>
<div class="math-display">\[ x^{2}=3x+4\Rightarrow x^{2}-3x-4=0\Rightarrow(x-4)(x+1)=0\Rightarrow x=4\ \text{atau}\ x=-1 \]</div>
<p>Syarat basis: \(x>0\) dan \(x\neq1\), sehingga \(x=-1\) ditolak. Jadi, jawabannya adalah <strong>4</strong>.</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Jika \(2^{x}+2^{-x}=5\), maka nilai \(8^{x}+8^{-x}\) adalah ....</p>`,
              answer: ["110"],
              explanation: h`<p>Pangkatkan tiga kedua ruas dengan rumus \((u+v)^{3}=u^{3}+v^{3}+3uv(u+v)\), dengan \(u=2^{x}\) dan \(v=2^{-x}\) sehingga \(uv=1\):</p>
<div class="math-display">\[ (2^{x}+2^{-x})^{3}=8^{x}+8^{-x}+3(2^{x}+2^{-x})\Rightarrow125=8^{x}+8^{-x}+15 \]</div>
<p>Jadi, jawabannya adalah <strong>110</strong>.</p>`,
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
              prompt: h`<p>Tentukan himpunan penyelesaian dari</p>
<div class="math-display">\[ \dfrac{8^{x-1}\cdot\sqrt{2^{x}}}{4^{x+1}}=\dfrac{1}{4}. \]</div>
<p>Tuliskan langkah menyamakan basisnya.</p>`,
              explanation: h`<p>Ubah semua bentuk ke basis \(2\):</p>
<div class="math-display">\[ 8^{x-1}=2^{3x-3},\qquad\sqrt{2^{x}}=2^{x/2},\qquad4^{x+1}=2^{2x+2} \]</div>
<p>Ruas kiri menjadi:</p>
<div class="math-display">\[ 2^{3x-3+\frac x2-2x-2}=2^{\frac32x-5} \]</div>
<p>Ruas kanan \(=2^{-2}\). Samakan eksponen:</p>
<div class="math-display">\[ \dfrac32x-5=-2\Rightarrow\dfrac32x=3\Rightarrow x=2 \]</div>
<p>Jadi, \(\text{HP}=\{2\}\).</p>
<p class="penskoran"><em>Penskoran: Menyamakan basis (3 poin); eksponen ruas kiri benar (3 poin); nilai \(x\) dan HP (2 poin).</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Tentukan himpunan penyelesaian \({}^{3}\!\log(x+2)+{}^{3}\!\log(x-4)=3\). Jelaskan mengapa salah satu akar yang diperoleh harus ditolak.</p>`,
              explanation: h`<p>Syarat numerus: \(x+2>0\) dan \(x-4>0\), sehingga \(x>4\). Gabungkan kedua logaritma:</p>
<div class="math-display">\[ {}^{3}\!\log\big[(x+2)(x-4)\big]=3\Rightarrow x^{2}-2x-8=27\Rightarrow x^{2}-2x-35=0\Rightarrow(x-7)(x+5)=0 \]</div>
<p>Nilai \(x=-5\) tidak memenuhi syarat \(x>4\) (numerus menjadi negatif), sehingga ditolak. Jadi, \(\text{HP}=\{7\}\).</p>
<p class="penskoran"><em>Penskoran: Syarat numerus (2 poin); bentuk kuadrat (3 poin); akar dan penolakan (3 poin).</em></p>`,
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
              prompt: h`<p>Tentukan himpunan penyelesaian pertidaksamaan</p>
<div class="math-display">\[ 2^{2x+1}-5\cdot2^{x}+2\le0. \]</div>`,
              explanation: h`<p>Misalkan \(t=2^{x}>0\), maka \(2^{2x+1}=2t^{2}\):</p>
<div class="math-display">\[ 2t^{2}-5t+2\le0\Rightarrow(2t-1)(t-2)\le0\Rightarrow\dfrac12\le t\le2 \]</div>
<p>Kembali ke \(x\): \(2^{-1}\le2^{x}\le2^{1}\). Karena basis \(2>1\), tanda tidak berubah:</p>
<div class="math-display">\[ -1\le x\le1 \]</div>
<p>Jadi, \(\text{HP}=\{x\mid-1\le x\le1\}\).</p>
<p class="penskoran"><em>Penskoran: Substitusi dan bentuk kuadrat (3 poin); penyelesaian \(t\) (2 poin); kembali ke \(x\) (3 poin).</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Besar magnitudo gempa dirumuskan \(M=\dfrac{2}{3}\log\dfrac{E}{E_{0}}\), dengan \(E\) energi gempa dan \(E_{0}\) konstanta.</p>
<ol type="a"><li>Buktikan bahwa untuk dua gempa berlaku \(M_{1}-M_{2}=\dfrac23\log\dfrac{E_{1}}{E_{2}}\).</li>
<li>Gempa A bermagnitudo \(8\) dan gempa B bermagnitudo \(6\). Berapa kali energi gempa A dibandingkan gempa B?</li>
<li>Energi gempa C sama dengan \(100\) kali energi gempa B. Tentukan magnitudo gempa C.</li></ol>`,
              explanation: h`<p><strong>(a)</strong> Kurangkan kedua magnitudo, konstanta \(E_{0}\) saling menghilangkan:</p>
<div class="math-display">\[ M_{1}-M_{2}=\dfrac23\left(\log E_{1}-\log E_{0}-\log E_{2}+\log E_{0}\right)=\dfrac23\log\dfrac{E_{1}}{E_{2}} \]</div>
<p><strong>(b)</strong></p>
<div class="math-display">\[ 8-6=\dfrac23\log\dfrac{E_{A}}{E_{B}}\Rightarrow\log\dfrac{E_{A}}{E_{B}}=3\Rightarrow\dfrac{E_{A}}{E_{B}}=1000 \]</div>
<p>Energi gempa A adalah \(1000\) kali energi gempa B.</p>
<p><strong>(c)</strong></p>
<div class="math-display">\[ M_{C}-M_{B}=\dfrac23\log100=\dfrac43\Rightarrow M_{C}=6+\dfrac43=\dfrac{22}{3}\approx7{,}3 \]</div>
<p class="penskoran"><em>Penskoran: Bagian (a) 3 poin; bagian (b) 2 poin; bagian (c) 3 poin.</em></p>`,
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
              prompt: h`<p>Diketahui \(a>b>0\) dan \(a^{2}+b^{2}=7ab\).</p>
<ol type="a"><li>Buktikan bahwa \(\log\dfrac{a+b}{3}=\dfrac12\left(\log a+\log b\right)\).</li>
<li>Tunjukkan bahwa \(\sqrt{\dfrac{a}{b}}-\sqrt{\dfrac{b}{a}}=\sqrt{5}\).</li></ol>`,
              explanation: h`<p><strong>(a)</strong> Tambahkan \(2ab\) pada kedua ruas:</p>
<div class="math-display">\[ a^{2}+b^{2}=7ab\Rightarrow(a+b)^{2}=9ab\Rightarrow\left(\dfrac{a+b}{3}\right)^{2}=ab \]</div>
<p>Ambil logaritma kedua ruas: \(2\log\dfrac{a+b}{3}=\log a+\log b\). Bagi dengan \(2\) sehingga terbukti.</p>
<p><strong>(b)</strong> Kuadratkan bentuk yang ditanyakan:</p>
<div class="math-display">\[ \left(\sqrt{\dfrac ab}-\sqrt{\dfrac ba}\right)^{2}=\dfrac ab+\dfrac ba-2=\dfrac{a^{2}+b^{2}}{ab}-2=7-2=5 \]</div>
<p>Karena \(a>b>0\), bentuk di dalam kurung bernilai positif, sehingga nilainya \(\sqrt5\).</p>
<p class="penskoran"><em>Penskoran: Bagian (a) 4 poin; bagian (b) 4 poin.</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default eksponenLogaritma;
