import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Bilangan Kompleks.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const bilanganKompleks: Material = {
  slug: "bilangan-kompleks",
  title: "Latihan Soal Bilangan Kompleks",
  topic: "Bilangan Kompleks",
  description:
    "Bentuk a+bi, operasi, konjugat, modulus, argumen, tafsiran geometri pada diagram Argand, dan persamaan kuadrat.",
  durationMinutes: 120,
  notes: [
    h`Soal disusun berjenjang dari mudah sampai HOTS dan sebagian bergaya
UTBK: pernyataan benar&ndash;salah (soal 16), kecukupan data (soal 13),
perbandingan kuantitas \(P\) dan \(Q\) (soal 14), serta soal berkonteks dan
bergambar.`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Tidak ada pengurangan skor untuk jawaban salah.`,
    h`Notasi: \(i^2=-1\); untuk \(z=a+bi\) dengan \(a,b\) real berlaku
\(\operatorname{Re}(z)=a\), \(\operatorname{Im}(z)=b\), \(\bar z=a-bi\), dan
\(|z|=\sqrt{a^2+b^2}\). Argumen utama \(\arg(z)\) berada pada
\(-\pi&lt;\arg(z)\le\pi\). Pada diagram Argand, sumbu mendatar adalah sumbu
real (Re) dan sumbu tegak adalah sumbu imajiner (Im).`,
    h`Gambar tidak selalu digambar sesuai skala. Jawaban isian singkat berupa
bilangan atau bilangan kompleks \(a+bi\) dalam bentuk paling sederhana
(pecahan ditulis dengan garis miring, huruf &pi; dapat ditulis pi).
Kalkulator tidak diperkenankan.`,
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
              prompt: h`<p>Nilai dari \(i+i^2+i^3+\cdots+i^{2026}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(0\)` },
                { key: "B", text: h`\(-1\)` },
                { key: "C", text: h`\(-1+i\)` },
                { key: "D", text: h`\(1+i\)` },
                { key: "E", text: h`\(i\)` },
              ],
              answer: "C",
              explanation: h`<p>Empat suku berurutan berjumlah nol: \(i+i^2+i^3+i^4=i-1-i+1=0\). Dari \(i^1\) sampai \(i^{2024}\) ada \(506\) kelompok yang masing-masing bernilai \(0\).</p>
<p>Sisanya \(i^{2025}+i^{2026}=i+(-1)=-1+i\).</p>
<p>Jebakan: \(0\) jika mengira semua suku habis dikelompokkan; \(-1\) jika lupa \(i^{2025}\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Pada diagram Argand, titik \(P\) mewakili bilangan kompleks \(z\) dan titik \(Q\) mewakili bilangan kompleks \(w\). Nilai \(z+\bar w\) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 300 244" role="img" aria-label="Diagram Argand dengan titik P(3,2) mewakili z dan titik Q(-1,3) mewakili w" style="width: 100%; max-width: 300px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="216.0" x2="30.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="68.0" y1="216.0" x2="68.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="106.0" y1="216.0" x2="106.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="144.0" y1="216.0" x2="144.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="182.0" y1="216.0" x2="182.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="220.0" y1="216.0" x2="220.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="258.0" y1="216.0" x2="258.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="216.0" x2="258.0" y2="216.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="178.0" x2="258.0" y2="178.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="140.0" x2="258.0" y2="140.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="102.0" x2="258.0" y2="102.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="64.0" x2="258.0" y2="64.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="26.0" x2="258.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="178.0" x2="267.0" y2="178.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="106.0" y1="216.0" x2="106.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="267.0,178.0 260.0,174.5 260.0,181.5" fill="currentColor"/>
<polygon points="106.0,17.0 102.5,24.0 109.5,24.0" fill="currentColor"/>
<text x="270.0" y="182.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="113.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<text x="30.0" y="191.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">−2</text>
<text x="68.0" y="191.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">−1</text>
<text x="144.0" y="191.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="182.0" y="191.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="220.0" y="191.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="258.0" y="191.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="101.0" y="219.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">−1</text>
<text x="101.0" y="143.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="101.0" y="105.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="101.0" y="67.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="101.0" y="29.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<circle cx="220.0" cy="102.0" r="3.4" fill="#7a1c2c"/>
<circle cx="68.0" cy="64.0" r="3.4" fill="#e0457b"/>
<text x="226.0" y="95.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">P</text>
<text x="62.0" y="57.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">Q</text>
</svg>`,
              options: [
                { key: "A", text: h`\(2+5i\)` },
                { key: "B", text: h`\(4-i\)` },
                { key: "C", text: h`\(2+i\)` },
                { key: "D", text: h`\(4+5i\)` },
                { key: "E", text: h`\(2-i\)` },
              ],
              answer: "E",
              explanation: h`<p>Dari diagram, \(z=3+2i\) dan \(w=-1+3i\), sehingga \(\bar w=-1-3i\). Maka \(z+\bar w=(3-1)+(2-3)i=2-i\).</p>
<p>Jebakan: A adalah \(z+w\), B adalah \(z-w\), C adalah \(\bar z+w\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Bilangan kompleks \(z=(x^2-4)+(x+2)i\) dengan \(x\) real merupakan bilangan imajiner murni. Nilai \(x\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2\)` },
                { key: "B", text: h`\(-2\)` },
                { key: "C", text: h`\(0\)` },
                { key: "D", text: h`\(-2\text{ atau }2\)` },
                { key: "E", text: h`\(4\)` },
              ],
              answer: "A",
              explanation: h`<p>Imajiner murni berarti bagian real \(=0\) dan bagian imajiner \(\ne0\). Dari \(x^2-4=0\) diperoleh \(x=\pm2\).</p>
<p>Untuk \(x=-2\) bagian imajiner \(x+2=0\), sehingga \(z=0\) yang bukan imajiner murni. Jadi \(x=2\) dan \(z=4i\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Jika \(z=1-2i\), maka \(\dfrac1z+\dfrac1{\bar z}=\) ....</p>`,
              options: [
                { key: "A", text: h`\(\frac15\)` },
                { key: "B", text: h`\(\frac{2}{\sqrt5}\)` },
                { key: "C", text: h`\(\frac45\)` },
                { key: "D", text: h`\(\frac25\)` },
                { key: "E", text: h`\(2\)` },
              ],
              answer: "D",
              explanation: h`<p>\(\dfrac1z+\dfrac1{\bar z}=\dfrac{z+\bar z}{z\bar z}=\dfrac{2\operatorname{Re}(z)}{|z|^2}=\dfrac{2\cdot1}{5}=\dfrac25\).</p>
<p>Cek langsung: \(\dfrac1z=\dfrac{1+2i}{5}\) dan \(\dfrac1{\bar z}=\dfrac{1-2i}{5}\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Argumen utama dari bilangan kompleks \(z=-\sqrt3+i\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(\frac\pi6\)` },
                { key: "B", text: h`\(\frac{5\pi}6\)` },
                { key: "C", text: h`\(-\frac\pi6\)` },
                { key: "D", text: h`\(-\frac{5\pi}6\)` },
                { key: "E", text: h`\(\frac{2\pi}3\)` },
              ],
              answer: "B",
              explanation: h`<p>Titik \((-\sqrt3,1)\) berada di kuadran II dengan sudut acuan \(\alpha=\arctan\dfrac{1}{\sqrt3}=\dfrac\pi6\). Maka \(\arg(z)=\pi-\dfrac\pi6=\dfrac{5\pi}6\).</p>
<p>Jebakan: A mengabaikan kuadran; C dan D salah kuadran.</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
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
              prompt: h`<p>Bilangan kompleks \(z\) memenuhi \(2z-i\bar z=5-i\). Nilai \(z^2\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(10\)` },
                { key: "B", text: h`\(8-6i\)` },
                { key: "C", text: h`\(10+6i\)` },
                { key: "D", text: h`\(6+8i\)` },
                { key: "E", text: h`\(8+6i\)` },
              ],
              answer: "E",
              explanation: h`<p>Misalkan \(z=x+yi\). Maka \(2z-i\bar z=2x+2yi-i(x-yi)=(2x-y)+(2y-x)i\).</p>
<p>Dari \(2x-y=5\) dan \(2y-x=-1\) diperoleh \(y=1\) dan \(x=3\), jadi \(z=3+i\) dan \(z^2=9+6i-1=8+6i\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Persamaan \(x^2-6x+25=0\) mempunyai akar-akar kompleks \(z_1\) dan \(z_2\). Pada diagram Argand, titik asal \(O\) dan titik-titik yang mewakili \(z_1\) dan \(z_2\) membentuk sebuah segitiga (daerah arsiran). Luas segitiga tersebut adalah .... satuan luas.</p>`,
              figure: h`<svg viewBox="0 0 240 334" role="img" aria-label="Segitiga dengan titik sudut O, z1 = 3+4i, dan z2 = 3-4i pada diagram Argand" style="width: 100%; max-width: 240px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="166.0" x2="207.0" y2="166.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="58.0" y1="306.0" x2="58.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="207.0,166.0 200.0,162.5 200.0,169.5" fill="currentColor"/>
<polygon points="58.0,17.0 54.5,24.0 61.5,24.0" fill="currentColor"/>
<text x="210.0" y="170.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="65.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<polygon points="58.0,166.0 142.0,54.0 142.0,278.0" fill="#e0457b" fill-opacity="0.3" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
<circle cx="58.0" cy="166.0" r="3" fill="currentColor"/>
<circle cx="142.0" cy="54.0" r="3" fill="currentColor"/>
<circle cx="142.0" cy="278.0" r="3" fill="currentColor"/>
<text x="52.0" y="180.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="148.0" y="48.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">z<tspan font-size="9" dy="3">1</tspan></text>
<text x="148.0" y="292.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">z<tspan font-size="9" dy="3">2</tspan></text>
</svg>`,
              options: [
                { key: "A", text: h`\(6\)` },
                { key: "B", text: h`\(12\)` },
                { key: "C", text: h`\(18\)` },
                { key: "D", text: h`\(24\)` },
                { key: "E", text: h`\(25\)` },
              ],
              answer: "B",
              explanation: h`<p>Akar-akarnya \(x=\dfrac{6\pm\sqrt{36-100}}{2}=3\pm4i\). Titik-titiknya \(O(0,0)\), \((3,4)\), dan \((3,-4)\).</p>
<p>Alas segitiga adalah ruas yang menghubungkan \((3,4)\) dan \((3,-4)\) sepanjang \(8\), dan tinggi \(=3\) (jarak \(O\) ke garis \(\operatorname{Re}(z)=3\)). Luas \(=\frac12\cdot8\cdot3=12\).</p>
<p>Jebakan D: lupa faktor \(\frac12\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Titik \(A\) mewakili bilangan kompleks \(z=4+i\). Titik \(A\) diputar \(90^\circ\) berlawanan arah jarum jam terhadap titik asal, kemudian digeser \(2\) satuan ke kiri dan \(3\) satuan ke atas sehingga menjadi titik \(A'\). Bilangan kompleks yang diwakili \(A'\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(-4+2i\)` },
                { key: "B", text: h`\(-1-i\)` },
                { key: "C", text: h`\(1+7i\)` },
                { key: "D", text: h`\(-3+7i\)` },
                { key: "E", text: h`\(1+i\)` },
              ],
              answer: "D",
              explanation: h`<p>Putar: \(i(4+i)=-1+4i\). Geser \(-2+3i\): \((-1+4i)+(-2+3i)=-3+7i\).</p>
<p>Jebakan: A (geser dahulu baru putar) \(i\big((4+i)+(-2+3i)\big)=-4+2i\); B (putar searah jarum jam) \(-i(4+i)+(-2+3i)=-1-i\); C (salah arah geser horizontal) \(1+7i\); E (salah arah geser vertikal) \(1+i\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Jika \(z=2-i\), maka nilai \(z^3-4z^2+7z+2\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(6-2i\)` },
                { key: "B", text: h`\(6+2i\)` },
                { key: "C", text: h`\(2-11i\)` },
                { key: "D", text: h`\(4-2i\)` },
                { key: "E", text: h`\(0\)` },
              ],
              answer: "A",
              explanation: h`<p>Karena \(z=2-i\) adalah akar \(x^2-4x+5=0\), berlaku \(z^2-4z+5=0\). Maka \(z^3-4z^2+7z+2=z(z^2-4z+5)+2z+2=2z+2=6-2i\).</p>
<p>Cek langsung: \(z^2=3-4i\) dan \(z^3=2-11i\), sehingga \((2-11i)-4(3-4i)+7(2-i)+2=6-2i\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Bilangan kompleks \(z\) bergerak pada lingkaran berpusat di titik yang mewakili \(3+4i\) dan berjari-jari \(2\) (lihat gambar). Nilai minimum \(|z|\) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 327 343" role="img" aria-label="Lingkaran berpusat di 3+4i dengan jari-jari 2 pada diagram Argand" style="width: 100%; max-width: 327px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="315.0" x2="30.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="64.0" y1="315.0" x2="64.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="98.0" y1="315.0" x2="98.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="132.0" y1="315.0" x2="132.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="166.0" y1="315.0" x2="166.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="200.0" y1="315.0" x2="200.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="234.0" y1="315.0" x2="234.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="268.0" y1="315.0" x2="268.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="315.0" x2="285.0" y2="315.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="281.0" x2="285.0" y2="281.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="247.0" x2="285.0" y2="247.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="213.0" x2="285.0" y2="213.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="179.0" x2="285.0" y2="179.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="145.0" x2="285.0" y2="145.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="111.0" x2="285.0" y2="111.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="77.0" x2="285.0" y2="77.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="43.0" x2="285.0" y2="43.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="281.0" x2="294.0" y2="281.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="64.0" y1="315.0" x2="64.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="294.0,281.0 287.0,277.5 287.0,284.5" fill="currentColor"/>
<polygon points="64.0,17.0 60.5,24.0 67.5,24.0" fill="currentColor"/>
<text x="297.0" y="285.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="71.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<text x="98.0" y="294.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="132.0" y="294.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="166.0" y="294.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="200.0" y="294.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="234.0" y="294.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">5</text>
<text x="268.0" y="294.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="59.0" y="250.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="59.0" y="216.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="59.0" y="182.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="59.0" y="148.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="59.0" y="114.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">5</text>
<text x="59.0" y="80.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="59.0" y="46.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">7</text>
<circle cx="166.0" cy="145.0" r="68.0" fill="#e0457b" fill-opacity="0.15" stroke="#e0457b" stroke-width="2.4"/>
<circle cx="166.0" cy="145.0" r="3.2" fill="#7a1c2c"/>
<line x1="166.0" y1="145.0" x2="234.0" y2="145.0" stroke="#7a1c2c" stroke-width="1.2"/>
<text x="200.0" y="158.0" text-anchor="middle" font-size="10" fill="currentColor">2</text>
<text x="160.0" y="137.0" text-anchor="end" font-size="11" fill="currentColor">3+4i</text>
<text x="58.0" y="295.0" text-anchor="end" font-size="11" font-style="italic" fill="currentColor">O</text>
</svg>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(5\)` },
                { key: "E", text: h`\(7\)` },
              ],
              answer: "C",
              explanation: h`<p>Jarak pusat \(3+4i\) ke titik asal adalah \(5\). Dengan ketaksamaan segitiga, \(|z|\ge|3+4i|-|z-(3+4i)|=5-2=3\), dan kesamaan tercapai di titik lingkaran yang terletak pada ruas \(O\) ke pusat.</p>
<p>Nilai maksimumnya \(5+2=7\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
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
              prompt: h`<p>Banyaknya bilangan kompleks \(z\) yang memenuhi \(z^2=\bar z\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(3\)` },
                { key: "D", text: h`\(4\)` },
                { key: "E", text: h`\(5\)` },
              ],
              answer: "D",
              explanation: h`<p>Misalkan \(z=x+yi\). Dari \(z^2=\bar z\): \(x^2-y^2=x\) dan \(2xy=-y\). Persamaan kedua memberi \(y=0\) atau \(x=-\frac12\).</p>
<p>Jika \(y=0\): \(x^2=x\), sehingga \(z=0\) atau \(z=1\). Jika \(x=-\frac12\): \(\frac14-y^2=-\frac12\), sehingga \(y=\pm\frac{\sqrt3}{2}\), yaitu dua bilangan. Total \(4\).</p>
<p>Jebakan: lupa \(z=0\) atau lupa kasus \(y=0\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Pada diagram Argand, titik \(A\) mewakili \(1+2i\) dan titik \(B\) mewakili \(4+3i\). Titik \(C\) dan \(D\) ditentukan sehingga \(ABCD\) adalah persegi dengan urutan titik berlawanan arah jarum jam. Bilangan kompleks yang mewakili titik pusat persegi \(ABCD\) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 336 296" role="img" aria-label="Titik A(1,2) dan B(4,3) dihubungkan oleh ruas garis pada diagram Argand" style="width: 100%; max-width: 336px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="268.0" x2="30.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="74.0" y1="268.0" x2="74.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="118.0" y1="268.0" x2="118.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="162.0" y1="268.0" x2="162.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="206.0" y1="268.0" x2="206.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="250.0" y1="268.0" x2="250.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="294.0" y1="268.0" x2="294.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="268.0" x2="294.0" y2="268.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="224.0" x2="294.0" y2="224.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="180.0" x2="294.0" y2="180.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="136.0" x2="294.0" y2="136.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="92.0" x2="294.0" y2="92.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="48.0" x2="294.0" y2="48.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="224.0" x2="303.0" y2="224.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="74.0" y1="268.0" x2="74.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="303.0,224.0 296.0,220.5 296.0,227.5" fill="currentColor"/>
<polygon points="74.0,17.0 70.5,24.0 77.5,24.0" fill="currentColor"/>
<text x="306.0" y="228.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="81.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<text x="118.0" y="237.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="162.0" y="237.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="206.0" y="237.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="250.0" y="237.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="294.0" y="237.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">5</text>
<text x="69.0" y="183.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="69.0" y="139.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="69.0" y="95.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="69.0" y="51.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<line x1="118.0" y1="136.0" x2="250.0" y2="92.0" stroke="#e0457b" stroke-width="3.2"/>
<circle cx="118.0" cy="136.0" r="3.4" fill="#7a1c2c"/>
<circle cx="250.0" cy="92.0" r="3.4" fill="#7a1c2c"/>
<text x="111.0" y="140.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">A</text>
<text x="256.0" y="85.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
</svg>`,
              options: [
                { key: "A", text: h`\(\frac52+\frac52i\)` },
                { key: "B", text: h`\(3+3i\)` },
                { key: "C", text: h`\(2+4i\)` },
                { key: "D", text: h`\(3+5i\)` },
                { key: "E", text: h`\(4+4i\)` },
              ],
              answer: "C",
              explanation: h`<p>\(\overrightarrow{AB}=b-a=3+i\). Memutar \(\overrightarrow{AB}\) sebesar \(90^\circ\) berlawanan arah jarum jam memberi \(\overrightarrow{AD}=i(3+i)=-1+3i\), sehingga \(d=a+\overrightarrow{AD}=5i\) dan \(c=b+\overrightarrow{AD}=3+6i\).</p>
<p>Pusat persegi adalah titik tengah diagonal \(AC\): \(\dfrac{(1+2i)+(3+6i)}{2}=2+4i\). Cek dengan diagonal \(BD\): \(\dfrac{(4+3i)+5i}{2}=2+4i\).</p>
<p>Jebakan A: titik tengah sisi \(AB\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Berapakah nilai \(|z|\), jika \(z\) adalah bilangan kompleks?</p>
    <ol>
      <li>\(\operatorname{Re}(z)=3\).</li>
      <li>\(z^2=-7+24i\).</li>
    </ol>`,
              options: [
                { key: "A", text: h`Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup.` },
                { key: "B", text: h`Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup.` },
                { key: "C", text: h`DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.` },
                { key: "D", text: h`Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA cukup untuk menjawab pertanyaan.` },
                { key: "E", text: h`Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan.` },
              ],
              answer: "B",
              explanation: h`<p>Pernyataan (1) saja: hanya diketahui bagian real, sedangkan bagian imajiner bebas, sehingga \(|z|\) tidak tertentu.</p>
<p>Pernyataan (2) saja: \(|z|^2=|z^2|=|-7+24i|=25\), sehingga \(|z|=5\) (cukup, tanpa perlu mencari \(z\)). Jadi hanya (2) yang cukup.</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Diketahui \(z\) bilangan kompleks yang tidak real. Perhatikan dua kuantitas berikut.</p><div class="math-display">\[ P=|z|^2\qquad\qquad Q=\operatorname{Re}(z^2) \]</div><p>Hubungan antara kuantitas \(P\) dan \(Q\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(P&gt;Q\)` },
                { key: "B", text: h`\(P&lt;Q\)` },
                { key: "C", text: h`\(P=Q\)` },
                { key: "D", text: h`Hubungan \(P\) dan \(Q\) tidak dapat ditentukan.` },
                { key: "E", text: h`\(P\) dan \(Q\) tidak dapat dibandingkan karena \(Q\) bukan bilangan real.` },
              ],
              answer: "A",
              explanation: h`<p>Misalkan \(z=x+yi\) dengan \(y\ne0\). Maka \(P=x^2+y^2\) dan \(Q=\operatorname{Re}(z^2)=x^2-y^2\), sehingga \(P-Q=2y^2&gt;0\) dan \(P&gt;Q\).</p>
<p>Jebakan C dan D: kasus \(z\) real memberi \(P=Q\), tetapi soal menyatakan \(z\) tidak real. Jebakan E: \(Q\) adalah bagian real, jadi tetap bilangan real.</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Persamaan suku banyak \(z^3-5z^2+17z-13=0\) berkoefisien real dan salah satu akarnya adalah \(2+3i\). Jumlah kuadrat semua akarnya adalah ....</p>`,
              options: [
                { key: "A", text: h`\(13\)` },
                { key: "B", text: h`\(25\)` },
                { key: "C", text: h`\(-5\)` },
                { key: "D", text: h`\(9\)` },
                { key: "E", text: h`\(-9\)` },
              ],
              answer: "E",
              explanation: h`<p>Koefisien real, sehingga konjugat \(2-3i\) juga akar. Jumlah ketiga akar adalah \(5\), sehingga akar ketiga \(=5-4=1\).</p>
<p>Jumlah kuadrat: \(1^2+(2+3i)^2+(2-3i)^2=1+(-5+12i)+(-5-12i)=-9\).</p>
<p>Cek dengan Vieta: \((\sum z)^2-2\sum z_jz_k=25-2\cdot17=-9\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          note: "Penalaran tingkat tinggi gaya UTBK dan TKA",
          questions: [
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "hots",
              prompt: h`<p>Diketahui \(z\) bilangan kompleks dengan \(|z|=1\). Tentukan setiap pernyataan berikut benar (B) atau salah (S).</p>
    <ol>
      <li>\(\bar z=\dfrac1z\).</li>
      <li>\(z-\dfrac1z\) selalu bilangan real.</li>
      <li>\(z+\dfrac1z\) selalu bilangan real.</li>
      <li>\(|z-1|\ge1\).</li>
    </ol>
    <p>Urutan jawaban untuk pernyataan (1), (2), (3), (4) yang tepat adalah ....</p>`,
              options: [
                { key: "A", text: h`B, B, B, S` },
                { key: "B", text: h`B, S, S, S` },
                { key: "C", text: h`S, S, B, S` },
                { key: "D", text: h`B, S, B, S` },
                { key: "E", text: h`B, S, B, B` },
              ],
              answer: "D",
              explanation: h`<p><strong>(1) Benar.</strong> \(z\bar z=|z|^2=1\), sehingga \(\bar z=\frac1z\).</p>
<p><strong>(2) Salah.</strong> \(z-\frac1z=z-\bar z=2\operatorname{Im}(z)\,i\) adalah imajiner murni; contoh \(z=i\) memberi \(i-\frac1i=2i\).</p>
<p><strong>(3) Benar.</strong> \(z+\frac1z=z+\bar z=2\operatorname{Re}(z)\) bilangan real.</p>
<p><strong>(4) Salah.</strong> Untuk \(z=\frac{\sqrt3}{2}+\frac12i\), \(|z-1|=\sqrt{\left(1-\frac{\sqrt3}2\right)^2+\frac14}=\sqrt{2-\sqrt3}\approx0{,}52&lt;1\).</p>
<p>Urutan: B, S, B, S.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "hots",
              prompt: h`<p>Banyak bilangan asli \(n\le100\) sehingga \((1+i)^n\) merupakan bilangan real adalah ....</p>`,
              options: [
                { key: "A", text: h`\(12\)` },
                { key: "B", text: h`\(25\)` },
                { key: "C", text: h`\(33\)` },
                { key: "D", text: h`\(50\)` },
                { key: "E", text: h`\(100\)` },
              ],
              answer: "B",
              explanation: h`<p>\((1+i)^2=2i\). Untuk \(n=2k\): \((1+i)^n=2^ki^k\), real jika dan hanya jika \(k\) genap, yaitu \(n\) kelipatan \(4\).</p>
<p>Untuk \(n\) ganjil: \((1+i)^n=2^ki^k(1+i)\) dan \(i^k(1+i)\in\{1+i,\,-1+i,\,-1-i,\,1-i\}\), tidak pernah real. Kelipatan \(4\) dari \(1\) sampai \(100\) ada \(25\).</p>
<p>Jebakan D: menghitung semua \(n\) genap.</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "hots",
              prompt: h`<p>Jika \(\dfrac{z-1}{z+1}\) adalah bilangan imajiner murni, maka nilai \(|z-1|^2+|z+1|^2\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(1\)` },
                { key: "B", text: h`\(2\)` },
                { key: "C", text: h`\(4\)` },
                { key: "D", text: h`\(8\)` },
                { key: "E", text: h`\(16\)` },
              ],
              answer: "C",
              explanation: h`<p>\(\dfrac{z-1}{z+1}=\dfrac{(z-1)(\bar z+1)}{|z+1|^2}=\dfrac{(|z|^2-1)+2\operatorname{Im}(z)\,i}{|z+1|^2}\). Imajiner murni berarti \(|z|^2-1=0\), jadi \(|z|=1\).</p>
<p>Maka \(|z-1|^2+|z+1|^2=(z-1)(\bar z-1)+(z+1)(\bar z+1)=2|z|^2+2=4\).</p>
<p>Tafsiran geometri: \(z\) pada lingkaran berdiameter dari \(-1\) sampai \(1\), sehingga segitiga siku-siku di \(z\) dan \(|z-1|^2+|z+1|^2=2^2\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt: h`<p>Transformasi \(T\) pada bidang kompleks didefinisikan oleh \(T(z)=iz+3+i\). Titik \(z_0=5+2i\) ditransformasikan berulang kali: \(z_1=T(z_0)\), \(z_2=T(z_1)\), dan seterusnya. Nilai \(z_{2026}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(5+2i\)` },
                { key: "B", text: h`\(1+6i\)` },
                { key: "C", text: h`\(1-2i\)` },
                { key: "D", text: h`\(1+2i\)` },
                { key: "E", text: h`\(-3+2i\)` },
              ],
              answer: "E",
              explanation: h`<p>Titik tetap \(c\) memenuhi \(c=ic+3+i\), sehingga \(c=\dfrac{3+i}{1-i}=\dfrac{(3+i)(1+i)}{2}=1+2i\).</p>
<p>Karena \(T(z)-c=i(z-c)\), \(T\) adalah rotasi \(90^\circ\) berlawanan arah jarum jam terhadap \(c=1+2i\). Maka \(z_n=c+i^n(z_0-c)=1+2i+4i^n\).</p>
<p>Karena \(2026=4\cdot506+2\), \(i^{2026}=-1\) dan \(z_{2026}=1+2i-4=-3+2i\). (Pilihan lain adalah \(z_0\), \(z_1\), \(z_3\), dan pusat rotasi.)</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "hots",
              prompt: h`<p>Himpunan semua bilangan kompleks \(z\) yang memenuhi \(|z-1|+|z+1|=2\) pada bidang kompleks berupa ....</p>`,
              options: [
                { key: "A", text: h`ruas garis yang menghubungkan titik \(-1\) dan titik \(1\)` },
                { key: "B", text: h`lingkaran berpusat di titik asal dengan jari-jari \(1\)` },
                { key: "C", text: h`elips dengan fokus di titik \(-1\) dan titik \(1\)` },
                { key: "D", text: h`seluruh sumbu real` },
                { key: "E", text: h`himpunan kosong` },
              ],
              answer: "A",
              explanation: h`<p>\(|z-1|\) dan \(|z+1|\) adalah jarak \(z\) ke titik \(1\) dan \(-1\), yang terpisah sejauh \(2\).</p>
<p>Menurut ketaksamaan segitiga, \(|z-1|+|z+1|\ge|(z+1)-(z-1)|=2\), dengan kesamaan jika dan hanya jika \(z\) terletak pada ruas yang menghubungkan \(-1\) dan \(1\). Elips baru terbentuk jika jumlah jarak lebih dari \(2\).</p>
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
              prompt: h`<p>Bilangan kompleks \(z\) memenuhi \(z\bar z=25\) dan \(z-\bar z=6i\). Jika \(\operatorname{Re}(z)&lt;0\), maka \(z=\) .... (tuliskan dalam bentuk a+bi, misalnya 2+5i).</p>`,
              answer: ["-4+3i", "3i-4"],
              explanation: h`<p>Misalkan \(z=x+yi\). Dari \(z-\bar z=2yi=6i\) diperoleh \(y=3\). Dari \(z\bar z=x^2+9=25\) diperoleh \(x=\pm4\).</p>
<p>Karena \(\operatorname{Re}(z)&lt;0\), \(x=-4\), sehingga \(z=\) <strong>\(-4+3i\)</strong>.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Banyak bilangan kompleks \(z=a+bi\) dengan \(a\) dan \(b\) bilangan bulat yang memenuhi \(2\le|z|\le3\) adalah ....</p>`,
              answer: ["20"],
              explanation: h`<p>Syarat: \(4\le a^2+b^2\le9\). Nilai \(a^2+b^2=4\): \((\pm2,0),(0,\pm2)\) ada \(4\). Nilai \(5\): \((\pm1,\pm2),(\pm2,\pm1)\) ada \(8\). Nilai \(8\): \((\pm2,\pm2)\) ada \(4\). Nilai \(9\): \((\pm3,0),(0,\pm3)\) ada \(4\). Nilai \(6\) dan \(7\) tidak mungkin.</p>
<p>Total \(4+8+4+4=\) <strong>\(20\)</strong>.</p>`,
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
              prompt: h`<p>Nilai dari \(\displaystyle\sum_{k=0}^{2025}k\,i^{k}\) adalah .... (tuliskan dalam bentuk a+bi).</p>`,
              answer: ["1012+1013i", "1013i+1012"],
              explanation: h`<p>Untuk setiap empat suku: \(4m\cdot1+(4m+1)i-(4m+2)-(4m+3)i=-2-2i\). Suku \(k=0\) sampai \(2023\) membentuk \(506\) kelompok, jumlahnya \(506(-2-2i)=-1012-1012i\).</p>
<p>Sisanya \(k=2024\): \(2024\,i^{2024}=2024\) dan \(k=2025\): \(2025\,i\). Jumlah \(=(2024-1012)+(2025-1012)i=\) <strong>\(1012+1013i\)</strong>.</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Pada diagram Argand, dua lingkaran masing-masing memiliki persamaan \(|z-3|=3\) dan \(|z-3i|=3\). Luas daerah irisan kedua lingkaran (daerah arsiran) adalah .... satuan luas (tuliskan dalam bentuk \(\pi\), misalnya 3pi/2-1).</p>`,
              figure: h`<svg viewBox="0 0 319 301" role="img" aria-label="Dua lingkaran berjari-jari 3 berpusat di 3 dan di 3i dengan daerah irisan diarsir" style="width: 100%; max-width: 319px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="273.0" x2="30.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="56.0" y1="273.0" x2="56.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="82.0" y1="273.0" x2="82.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="108.0" y1="273.0" x2="108.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="134.0" y1="273.0" x2="134.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="160.0" y1="273.0" x2="160.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="186.0" y1="273.0" x2="186.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="212.0" y1="273.0" x2="212.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="238.0" y1="273.0" x2="238.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="264.0" y1="273.0" x2="264.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="273.0" x2="277.0" y2="273.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="247.0" x2="277.0" y2="247.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="221.0" x2="277.0" y2="221.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="195.0" x2="277.0" y2="195.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="169.0" x2="277.0" y2="169.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="143.0" x2="277.0" y2="143.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="117.0" x2="277.0" y2="117.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="91.0" x2="277.0" y2="91.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="65.0" x2="277.0" y2="65.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="39.0" x2="277.0" y2="39.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="195.0" x2="286.0" y2="195.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="108.0" y1="273.0" x2="108.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="286.0,195.0 279.0,191.5 279.0,198.5" fill="currentColor"/>
<polygon points="108.0,17.0 104.5,24.0 111.5,24.0" fill="currentColor"/>
<text x="289.0" y="199.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="115.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<text x="186.0" y="208.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">3</text>
<text x="264.0" y="208.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="103.0" y="120.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">3i</text>
<text x="103.0" y="42.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">6i</text>
<defs><clipPath id="bk-cl"><circle cx="186.0" cy="195.0" r="78"/></clipPath></defs>
<circle cx="108.0" cy="117.0" r="78.0" fill="#e0457b" fill-opacity="0.35" stroke="#e0457b" stroke-width="0" clip-path="url(#bk-cl)"/>
<circle cx="186.0" cy="195.0" r="78.0" fill="none" fill-opacity="0" stroke="#be123c" stroke-width="2.2"/>
<circle cx="108.0" cy="117.0" r="78.0" fill="none" fill-opacity="0" stroke="#e0457b" stroke-width="2.2"/>
<text x="102.0" y="209.0" text-anchor="end" font-size="11" font-style="italic" fill="currentColor">O</text>
</svg>`,
              answer: ["9π/2-9", "9pi/2-9", "4.5pi-9", "4.5π-9", "(9pi)/2-9", "(9π)/2-9", "\\frac{9\\pi}{2}-9", "-9+9pi/2"],
              explanation: h`<p>Pusat lingkaran \(3\) dan \(3i\), masing-masing berjari-jari \(3\), dan keduanya berpotongan di \(0\) dan \(3+3i\). Tali busur persekutuan \(=3\sqrt2\) dan \(2\cdot3\sin\frac\theta2=3\sqrt2\) memberi \(\theta=90^\circ\).</p>
<p>Satu tembereng \(=\frac14\pi\cdot3^2-\frac12\cdot3\cdot3=\frac{9\pi}4-\frac92\). Irisan terdiri atas dua tembereng kongruen: \(2\left(\frac{9\pi}4-\frac92\right)=\) <strong>\(\dfrac{9\pi}2-9\)</strong>.</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Jika \(\theta\) adalah argumen utama dari \(z=(1+i)(\sqrt3+i)\), maka \(\tan\theta=\) .... (tanda akar dapat ditulis sqrt, misalnya 1+sqrt(2)).</p>`,
              answer: ["2+√3", "2+sqrt3", "2+\\sqrt3", "2+sqrt(3)", "2+√(3)", "√3+2", "sqrt3+2", "sqrt(3)+2", "\\sqrt{3}+2", "2+\\sqrt{3}"],
              explanation: h`<p>\(z=(1+i)(\sqrt3+i)=(\sqrt3-1)+(\sqrt3+1)i\), di kuadran I.</p>
<p>\(\tan\theta=\dfrac{\sqrt3+1}{\sqrt3-1}=\dfrac{(\sqrt3+1)^2}{2}=\dfrac{4+2\sqrt3}{2}=\) <strong>\(2+\sqrt3\)</strong> (yaitu \(\theta=75^\circ\)).</p>`,
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
              prompt: h`<p>Sebuah peta bajak laut berbunyi: &ldquo;Mulai dari tiang gantungan \(G\). Berjalan lurus ke pohon beringin \(B\), belok <em>kanan</em> \(90^\circ\), lalu berjalan sejauh jarak yang sama dan pasang tanda \(M_1\). Kembali ke \(G\), berjalan lurus ke pohon pinus \(P\), belok <em>kiri</em> \(90^\circ\), berjalan sejauh jarak yang sama dan pasang tanda \(M_2\). Harta karun terkubur di tengah-tengah \(M_1\) dan \(M_2\).&rdquo; Pada bidang kompleks (satuan meter), \(B=8+2i\) dan \(P=2+6i\). Gunakan fakta bahwa mengalikan dengan \(i\) memutar \(90^\circ\) berlawanan arah jarum jam, dan mengalikan dengan \(-i\) memutar \(90^\circ\) searah jarum jam.</p>`,
              figure: h`<svg viewBox="0 0 360 294" role="img" aria-label="Peta harta karun: G di titik asal, pohon beringin B(8,2), pohon pinus P(2,6), dengan belokan kanan di B dan kiri di P" style="width: 100%; max-width: 360px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="266.0" x2="30.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="54.0" y1="266.0" x2="54.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="78.0" y1="266.0" x2="78.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="102.0" y1="266.0" x2="102.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="126.0" y1="266.0" x2="126.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="150.0" y1="266.0" x2="150.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="174.0" y1="266.0" x2="174.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="198.0" y1="266.0" x2="198.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="222.0" y1="266.0" x2="222.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="246.0" y1="266.0" x2="246.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="270.0" y1="266.0" x2="270.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="294.0" y1="266.0" x2="294.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="318.0" y1="266.0" x2="318.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="266.0" x2="318.0" y2="266.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="242.0" x2="318.0" y2="242.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="218.0" x2="318.0" y2="218.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="194.0" x2="318.0" y2="194.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="170.0" x2="318.0" y2="170.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="146.0" x2="318.0" y2="146.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="122.0" x2="318.0" y2="122.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="98.0" x2="318.0" y2="98.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="74.0" x2="318.0" y2="74.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="50.0" x2="318.0" y2="50.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="26.0" x2="318.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="218.0" x2="327.0" y2="218.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="78.0" y1="266.0" x2="78.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="327.0,218.0 320.0,214.5 320.0,221.5" fill="currentColor"/>
<polygon points="78.0,17.0 74.5,24.0 81.5,24.0" fill="currentColor"/>
<text x="330.0" y="222.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="85.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<text x="126.0" y="231.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="174.0" y="231.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="222.0" y="231.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="270.0" y="231.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<text x="318.0" y="231.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">10</text>
<text x="73.0" y="173.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="73.0" y="125.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">4</text>
<text x="73.0" y="77.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">6</text>
<text x="73.0" y="29.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">8</text>
<defs><marker id="bk-u1" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#be123c"/></marker></defs>
<line x1="78.0" y1="218.0" x2="270.0" y2="170.0" stroke="currentColor" stroke-width="1.3" stroke-dasharray="5 4" stroke-opacity=".6"/>
<line x1="78.0" y1="218.0" x2="126.0" y2="74.0" stroke="currentColor" stroke-width="1.3" stroke-dasharray="5 4" stroke-opacity=".6"/>
<line x1="270.0" y1="170.0" x2="281.6" y2="216.6" stroke="#be123c" stroke-width="2.2" marker-end="url(#bk-u1)"/>
<line x1="126.0" y1="74.0" x2="80.5" y2="58.8" stroke="#be123c" stroke-width="2.2" marker-end="url(#bk-u1)"/>
<circle cx="78.0" cy="218.0" r="3.2" fill="#7a1c2c"/>
<circle cx="270.0" cy="170.0" r="3.2" fill="#7a1c2c"/>
<circle cx="126.0" cy="74.0" r="3.2" fill="#7a1c2c"/>
<text x="72.0" y="232.0" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">G</text>
<text x="275.0" y="163.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">B</text>
<text x="132.0" y="68.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">P</text>
<text x="284.4" y="206.0" text-anchor="start" font-size="10" fill="#be123c">kanan</text>
<text x="87.6" y="42.8" text-anchor="start" font-size="10" fill="#be123c">kiri</text>
</svg>`,
              promptAfter: h`<ol type="a">
      <li>Jika \(G\) berada di titik asal, tentukan bilangan kompleks yang mewakili \(M_1\) dan \(M_2\).</li>
      <li>Tentukan letak harta karun.</li>
      <li>Tiang gantungan ternyata telah pindah ke \(G'=-3+5i\). Tentukan letak harta karun dengan prosedur yang sama, lalu bandingkan dengan hasil (b).</li>
      <li>Misalkan tiang gantungan berada di titik sembarang \(g\). Buktikan bahwa letak harta karun tidak bergantung pada \(g\), lalu nyatakan letaknya dalam \(b\) dan \(p\).</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Dengan \(g=0\): \(M_1=B+(-i)(B-0)=(1-i)B=(1-i)(8+2i)=10-6i\) dan \(M_2=P+i(P-0)=(1+i)P=(1+i)(2+6i)=-4+8i\).</p>
<p><strong>(b)</strong> Harta karun di titik tengah: \(\dfrac{(10-6i)+(-4+8i)}{2}=3+i\), yaitu \(3\) m ke kanan dan \(1\) m ke atas dari titik asal.</p>
<p><strong>(c)</strong> \(M_1=B-i(B-G')=8+2i-i(11-3i)=5-9i\) dan \(M_2=P+i(P-G')=2+6i+i(5+i)=1+11i\). Titik tengahnya \(\dfrac{6+2i}{2}=3+i\), sama dengan (b).</p>
<p><strong>(d)</strong> \(M_1=b-i(b-g)\) dan \(M_2=p+i(p-g)\). Jumlahnya \(M_1+M_2=b+p+i(p-b)+(ig-ig)=b+p+i(p-b)\), suku \(g\) saling meniadakan.</p>
<p>Jadi harta karun di \(T=\dfrac{b+p+i(p-b)}{2}=\dfrac{(1-i)b+(1+i)p}{2}\) yang tidak memuat \(g\). Cek: \(\dfrac{(1-i)(8+2i)+(1+i)(2+6i)}{2}=3+i\).</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Perhatikan persamaan kuadrat berkoefisien kompleks \(z^2-3z+(3+i)=0\).</p>
    <ol type="a">
      <li>Tentukan semua bilangan kompleks \(w\) yang memenuhi \(w^2=-3-4i\).</li>
      <li>Hitung diskriminan \(D=b^2-4ac\) persamaan tersebut, lalu gunakan hasil (a) untuk menentukan kedua akarnya, \(z_1\) dan \(z_2\).</li>
      <li>Periksa jawaban Anda dengan rumus jumlah dan hasil kali akar-akar.</li>
      <li>Pada persamaan kuadrat berkoefisien real, akar-akar yang tidak real selalu saling konjugat. Apakah \(z_2=\bar z_1\) di sini? Jelaskan alasannya, lalu tentukan persamaan kuadrat yang akar-akarnya \(\bar z_1\) dan \(\bar z_2\).</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Misalkan \(w=x+yi\). Dari \(w^2=-3-4i\): \(x^2-y^2=-3\) dan \(2xy=-4\). Substitusi \(y=-\frac2x\): \(x^4+3x^2-4=0\Rightarrow(x^2+4)(x^2-1)=0\Rightarrow x=\pm1\). Jadi \(w=1-2i\) atau \(w=-1+2i\), yaitu \(w=\pm(1-2i)\).</p>
<p><strong>(b)</strong> \(D=(-3)^2-4(3+i)=-3-4i\), sehingga \(\sqrt D=\pm(1-2i)\). Akar-akarnya \(z=\dfrac{3\pm(1-2i)}{2}\), yaitu \(z_1=2-i\) dan \(z_2=1+i\).</p>
<p><strong>(c)</strong> \(z_1+z_2=3\) dan \(z_1z_2=(2-i)(1+i)=2+2i-i-i^2=3+i\), sesuai dengan \(-\frac ba=3\) dan \(\frac ca=3+i\).</p>
<p><strong>(d)</strong> \(\bar z_1=2+i\ne z_2=1+i\), jadi \(z_2\ne\bar z_1\). Sifat akar-akar konjugat hanya berlaku bila koefisien real; di sini koefisien \(3+i\) tidak real.</p>
<p>Akar-akar \(\bar z_1=2+i\) dan \(\bar z_2=1-i\) memiliki jumlah \(3\) dan hasil kali \((2+i)(1-i)=3-i\), sehingga persamaannya \(z^2-3z+(3-i)=0\) (koefisiennya dikonjugatkan).</p>
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
              prompt: h`<p>Dua menara pemancar berada di titik asal \(O\) dan di titik \(A\) yang mewakili \(3i\) pada bidang kompleks (satuan km). Sinyal menara \(O\) dianggap lebih kuat daripada menara \(A\) di titik \(z\) jika jarak \(z\) ke \(A\) paling sedikit dua kali jarak \(z\) ke \(O\), yaitu \(|z-3i|\ge2|z|\).</p>`,
              figure: h`<svg viewBox="0 0 330 345" role="img" aria-label="Menara O di titik asal, menara A di 3i, dan titik z dengan jarak |z| ke O serta |z-3i| ke A" style="width: 100%; max-width: 330px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="261.2" x2="296.6" y2="261.2" stroke="currentColor" stroke-width="1.6"/>
<line x1="86.0" y1="317.2" x2="86.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="296.6,261.2 289.6,257.7 289.6,264.7" fill="currentColor"/>
<polygon points="86.0,17.0 82.5,24.0 89.5,24.0" fill="currentColor"/>
<text x="299.6" y="265.2" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="93.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<line x1="86.0" y1="261.2" x2="214.8" y2="177.2" stroke="#be123c" stroke-width="2.2"/>
<line x1="86.0" y1="93.2" x2="214.8" y2="177.2" stroke="#e0457b" stroke-width="2.2"/>
<circle cx="86.0" cy="261.2" r="3.2" fill="#7a1c2c"/>
<circle cx="86.0" cy="93.2" r="3.2" fill="#7a1c2c"/>
<circle cx="214.8" cy="177.2" r="3.2" fill="#7a1c2c"/>
<text x="156.4" y="233.2" text-anchor="start" font-size="10.5" fill="currentColor">|z|</text>
<text x="158.4" y="129.2" text-anchor="start" font-size="10.5" fill="currentColor">|z − 3i|</text>
<text x="80.0" y="275.2" text-anchor="end" font-size="12" font-style="italic" fill="currentColor">O</text>
<text x="79.0" y="97.2" text-anchor="end" font-size="11" fill="currentColor">A (3i)</text>
<text x="221.8" y="181.2" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">z</text>
</svg>`,
              promptAfter: h`<ol type="a">
      <li>Tunjukkan bahwa titik-titik \(z\) dengan \(|z-3i|=2|z|\) membentuk sebuah lingkaran, lalu tentukan pusat dan jari-jarinya.</li>
      <li>Ujilah titik \(O\) untuk menentukan daerah yang memenuhi \(|z-3i|\ge2|z|\), lalu hitung luas daerah tersebut.</li>
      <li>Tentukan jarak terdekat dan terjauh dari \(O\) ke batas daerah, beserta bilangan kompleks pada batas yang bersesuaian.</li>
      <li>Tentukan semua bilangan kompleks \(z\) pada batas daerah yang bagian realnya \(\sqrt3\).</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Misalkan \(z=x+yi\). \(|z-3i|^2=4|z|^2\Rightarrow x^2+(y-3)^2=4x^2+4y^2\Rightarrow3x^2+3y^2+6y-9=0\Rightarrow x^2+(y+1)^2=4\). Lingkaran berpusat di \(-i\) dengan jari-jari \(2\).</p>
<p><strong>(b)</strong> Uji \(O\): \(|0-3i|=3\ge2\cdot0\) benar, jadi \(O\) termasuk daerah. \(O\) berada di dalam lingkaran (jarak ke pusat \(1&lt;2\)), sehingga daerahnya adalah cakram beserta batasnya dengan luas \(\pi\cdot2^2=4\pi\) km\(^2\).</p>
<p><strong>(c)</strong> Jarak \(O\) ke pusat \(-i\) adalah \(1\). Jarak terdekat \(2-1=1\) km di titik \(i\) (cek: \(|i-3i|=2=2|i|\)). Jarak terjauh \(2+1=3\) km di titik \(-3i\) (cek: \(|-6i|=6=2|-3i|\)).</p>
<p><strong>(d)</strong> Untuk \(x=\sqrt3\): \(3+(y+1)^2=4\Rightarrow y+1=\pm1\Rightarrow y=0\) atau \(y=-2\). Jadi \(z=\sqrt3\) dan \(z=\sqrt3-2i\).</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin.</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Diketahui bilangan kompleks \(z\ne0\).</p>
    <ol type="a">
      <li>Buktikan bahwa \(z+\dfrac1z\) bilangan real jika dan hanya jika \(z\) real atau \(|z|=1\). (Petunjuk: tulis \(z=x+yi\) dan hitung bagian imajiner \(z+\frac1z\).)</li>
      <li>Selesaikan \(z+\dfrac1z=\dfrac52\).</li>
      <li>Selesaikan \(z+\dfrac1z=\dfrac32\), lalu hitung \(|z|\) untuk setiap akar.</li>
      <li>Misalkan \(k\) real. Dengan memakai (a), tunjukkan bahwa jika \(|k|&lt;2\) maka setiap akar persamaan \(z+\frac1z=k\) memenuhi \(|z|=1\), sedangkan jika \(|k|\ge2\) maka semua akarnya real.</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> Dengan \(z=x+yi\) dan \(\dfrac1z=\dfrac{x-yi}{x^2+y^2}\): \(\operatorname{Im}\!\left(z+\dfrac1z\right)=y-\dfrac{y}{x^2+y^2}=y\left(1-\dfrac1{x^2+y^2}\right)\). Bilangan itu real jika dan hanya jika bagian imajinernya nol, yaitu \(y=0\) (\(z\) real) atau \(x^2+y^2=1\) (\(|z|=1\)).</p>
<p><strong>(b)</strong> \(2z^2-5z+2=0\Rightarrow(2z-1)(z-2)=0\), jadi \(z=\frac12\) atau \(z=2\) (keduanya real).</p>
<p><strong>(c)</strong> \(2z^2-3z+2=0\) dengan \(D=9-16=-7\), sehingga \(z=\dfrac{3\pm i\sqrt7}{4}\) dan \(|z|^2=\dfrac{9+7}{16}=1\), jadi \(|z|=1\) untuk kedua akar.</p>
<p><strong>(d)</strong> \(z+\frac1z=k\) ekuivalen dengan \(z^2-kz+1=0\) dengan \(D=k^2-4\). Jika \(|k|&lt;2\), \(D&lt;0\) sehingga tidak ada akar real; karena \(z+\frac1z=k\) real, (a) memaksa \(|z|=1\). Jika \(|k|\ge2\), \(D\ge0\) sehingga kedua akar real (untuk \(|k|=2\): \(z=\pm1\)).</p>
<p class="penskoran"><em>Penskoran: (a) 3 poin; (b) 1 poin; (c) 2 poin; (d) 2 poin.</em></p>`,
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
              prompt: h`<p>Dalam grafika komputer, bilangan kompleks \(c\) diuji dengan barisan \(z_0=0\) dan \(z_{n+1}=z_n^2+c\). Titik \(c\) disebut <em>terikat</em> jika barisan tersebut tidak tumbuh tanpa batas. Dua fakta yang boleh dipakai: (i) jika suatu suku memenuhi \(|z_n|&gt;2\), barisan pasti tidak terikat; (ii) jika barisan mulai berulang secara periodik, \(c\) terikat. Gambar memperlihatkan lingkaran \(|z|=2\) dan empat bilangan \(c\) yang akan diuji.</p>`,
              figure: h`<svg viewBox="0 0 306 288" role="img" aria-label="Lingkaran |z| = 2 dan empat bilangan c yang diuji: -1, i, 1, dan 1+i" style="width: 100%; max-width: 306px; height: auto" font-size="12" font-family="inherit">
<line x1="30.0" y1="260.0" x2="30.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="82.0" y1="260.0" x2="82.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="134.0" y1="260.0" x2="134.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="186.0" y1="260.0" x2="186.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="238.0" y1="260.0" x2="238.0" y2="26.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="260.0" x2="264.0" y2="260.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="208.0" x2="264.0" y2="208.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="156.0" x2="264.0" y2="156.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="104.0" x2="264.0" y2="104.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="52.0" x2="264.0" y2="52.0" stroke="currentColor" stroke-width="1" stroke-opacity=".13"/>
<line x1="30.0" y1="156.0" x2="273.0" y2="156.0" stroke="currentColor" stroke-width="1.6"/>
<line x1="134.0" y1="260.0" x2="134.0" y2="17.0" stroke="currentColor" stroke-width="1.6"/>
<polygon points="273.0,156.0 266.0,152.5 266.0,159.5" fill="currentColor"/>
<polygon points="134.0,17.0 130.5,24.0 137.5,24.0" fill="currentColor"/>
<text x="276.0" y="160.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Re</text>
<text x="141.0" y="21.0" text-anchor="start" font-size="12" font-style="italic" fill="currentColor">Im</text>
<text x="30.0" y="169.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">−2</text>
<text x="82.0" y="169.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">−1</text>
<text x="186.0" y="169.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="238.0" y="169.0" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<text x="129.0" y="263.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">−2</text>
<text x="129.0" y="211.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">−1</text>
<text x="129.0" y="107.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">1</text>
<text x="129.0" y="55.5" text-anchor="end" font-size="9.5" fill="currentColor" fill-opacity=".7">2</text>
<circle cx="134.0" cy="156.0" r="104.0" fill="none" fill-opacity="0" stroke="#e0457b" stroke-width="1.8" stroke-dasharray="6 4"/>
<text x="212.0" y="72.8" text-anchor="start" font-size="10" fill="#e0457b">|z| = 2</text>
<circle cx="82.0" cy="156.0" r="3.4" fill="#7a1c2c"/>
<circle cx="134.0" cy="104.0" r="3.4" fill="#7a1c2c"/>
<circle cx="186.0" cy="156.0" r="3.4" fill="#7a1c2c"/>
<circle cx="186.0" cy="104.0" r="3.4" fill="#7a1c2c"/>
<text x="77.0" y="149.0" text-anchor="end" font-size="10.5" fill="currentColor">c = −1</text>
<text x="128.0" y="97.0" text-anchor="end" font-size="10.5" fill="currentColor">c = i</text>
<text x="192.0" y="171.0" text-anchor="start" font-size="10.5" fill="currentColor">c = 1</text>
<text x="192.0" y="97.0" text-anchor="start" font-size="10.5" fill="currentColor">c = 1+i</text>
</svg>`,
              promptAfter: h`<ol type="a">
      <li>Untuk \(c=-1\), hitung \(z_1,z_2,z_3,z_4\). Apakah \(c\) terikat?</li>
      <li>Untuk \(c=i\), hitung \(z_1,z_2,\dots,z_5\). Apakah \(c\) terikat? Jelaskan.</li>
      <li>Untuk \(c=1\) dan \(c=1+i\), tentukan \(n\) terkecil sehingga \(|z_n|&gt;2\).</li>
      <li>Misalkan \(c\) real dan \(c&gt;\frac14\). Buktikan \(z_n\ge n\left(c-\frac14\right)\) untuk semua \(n\ge0\), sehingga \(c\) tidak terikat. (Petunjuk: lengkapkan kuadrat untuk menunjukkan \(z_{n+1}-z_n\ge c-\frac14\).)</li>
    </ol>`,
              explanation: h`<p><strong>(a)</strong> \(z_1=-1\), \(z_2=(-1)^2-1=0\), \(z_3=-1\), \(z_4=0\). Barisan berulang \(-1,0,-1,0,\dots\), jadi \(c=-1\) terikat.</p>
<p><strong>(b)</strong> \(z_1=i\), \(z_2=i^2+i=-1+i\), \(z_3=(-1+i)^2+i=-2i+i=-i\), \(z_4=(-i)^2+i=-1+i\), \(z_5=-i\). Mulai \(z_2\) barisan berulang \(-1+i,\,-i,\,-1+i,\,-i,\dots\) (periode \(2\)), jadi \(c=i\) terikat.</p>
<p><strong>(c)</strong> \(c=1\): \(z_1=1\), \(z_2=2\), \(z_3=5\), sehingga \(n=3\) (pada \(z_2\) nilainya tepat \(2\), belum lebih dari \(2\)). \(c=1+i\): \(z_1=1+i\) dengan \(|z_1|=\sqrt2&lt;2\), lalu \(z_2=(1+i)^2+1+i=1+3i\) dengan \(|z_2|=\sqrt{10}&gt;2\), sehingga \(n=2\).</p>
<p><strong>(d)</strong> \(z_{n+1}-z_n=z_n^2-z_n+c=\left(z_n-\frac12\right)^2+c-\frac14\ge c-\frac14&gt;0\). Jumlahkan dari \(k=0\) sampai \(n-1\): \(z_n=z_0+\displaystyle\sum_{k=0}^{n-1}(z_{k+1}-z_k)\ge n\left(c-\frac14\right)\). Karena \(c-\frac14&gt;0\), \(z_n\to\infty\), sehingga \(c\) tidak terikat.</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin (bagian (d): selisih suku 1, penjumlahan dan kesimpulan 1).</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default bilanganKompleks;
