import type { Material } from "../types";

/* ------------------------------------------------------------------ *
 *  Materi: Kombinatorika.
 *  Konten soal berupa HTML dengan penanda KaTeX \( ... \) dan \[ ... \].
 *  Ditulis dengan String.raw agar backslash tidak perlu digandakan.
 * ------------------------------------------------------------------ */
const h = String.raw;

const kombinatorika: Material = {
  slug: "kombinatorika",
  title: "Latihan Soal Kombinatorika",
  topic: "Kombinatorika",
  description:
    "Aturan pencacahan, permutasi, kombinasi, binomial Newton, inklusi–eksklusi, serta penalaran menghitung pada konteks gambar dan diagram.",
  durationMinutes: 120,
  notes: [
    h`Soal disusun berjenjang dari mudah sampai HOTS dan memakai bentuk yang
sejalan dengan UTBK-SNBT 2026: pilihan ganda lima opsi, pilihan majemuk
berbentuk tabel pernyataan benar atau salah (soal 5), kecukupan data
(soal 19), soal berkonteks dengan gambar atau diagram, serta isian singkat.`,
    h`Skor: pilihan ganda 2 poin, isian singkat 4 poin, uraian 8 poin per soal
(total 100 poin). Pada soal berbentuk tabel pernyataan, skor diberikan
jika <strong>semua baris</strong> dijawab benar. Tidak ada pengurangan
skor untuk jawaban salah.`,
    h`Notasi: \(n!=n(n-1)\cdots1\) dengan \(0!=1\),
\({}_{n}P_{r}=\dfrac{n!}{(n-r)!}\) permutasi, dan
\(\dbinom nr=\dfrac{n!}{r!\,(n-r)!}\) kombinasi. Benda atau orang yang
disebut “sejenis” dianggap tidak dapat dibedakan.`,
    "Bilangan ribuan ditulis dengan tanda titik dan bilangan desimal dengan tanda koma. Gambar tidak selalu digambar sesuai skala. Kalkulator tidak diperkenankan. Pada isian singkat, tuliskan hanya jawaban akhir.",
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
              prompt: h`<p>Gambar menunjukkan jaringan jalan satu arah dari Rumah ke Sekolah. Angka pada setiap garis menyatakan banyak jalan berbeda yang menghubungkan dua tempat. Banyak rute berbeda dari Rumah ke Sekolah adalah ....</p>`,
              figure: h`<svg viewBox="0 0 360 190" role="img" aria-label="Jaringan jalan satu arah: Rumah ke Halte 2 jalan, Halte ke Sekolah 5, Rumah ke Pasar 2, Pasar ke Sekolah 2, Rumah ke Sekolah 3 jalan langsung" style="width: 100%; max-width: 360px; height: auto" font-size="12" font-family="inherit">
<defs><marker id="mk1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#7c2d12"/></marker></defs><rect x="10" y="81" width="70" height="28" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="45.0" y="99.5" text-anchor="middle" fill="currentColor">Rumah</text><rect x="145" y="21" width="70" height="28" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="180.0" y="39.5" text-anchor="middle" fill="currentColor">Halte</text><rect x="145" y="141" width="70" height="28" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="180.0" y="159.5" text-anchor="middle" fill="currentColor">Pasar</text><rect x="280" y="81" width="70" height="28" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="315.0" y="99.5" text-anchor="middle" fill="currentColor">Sekolah</text><line x1="80" y1="86" x2="145" y2="43" stroke="#7c2d12" stroke-width="1.8" marker-end="url(#mk1)"/><text x="100" y="55" text-anchor="middle" fill="currentColor" font-size="13" font-weight="bold">2</text><line x1="215" y1="43" x2="280" y2="86" stroke="#7c2d12" stroke-width="1.8" marker-end="url(#mk1)"/><text x="262" y="55" text-anchor="middle" fill="currentColor" font-size="13" font-weight="bold">5</text><line x1="80" y1="104" x2="145" y2="147" stroke="#7c2d12" stroke-width="1.8" marker-end="url(#mk1)"/><text x="100" y="142" text-anchor="middle" fill="currentColor" font-size="13" font-weight="bold">2</text><line x1="215" y1="147" x2="280" y2="104" stroke="#7c2d12" stroke-width="1.8" marker-end="url(#mk1)"/><text x="262" y="142" text-anchor="middle" fill="currentColor" font-size="13" font-weight="bold">2</text><line x1="80" y1="95" x2="280" y2="95" stroke="#7c2d12" stroke-width="1.8" marker-end="url(#mk1)"/><text x="180" y="88" text-anchor="middle" fill="currentColor" font-size="13" font-weight="bold">3</text>
</svg>`,
              options: [
                { key: "A", text: h`\(12\)` },
                { key: "B", text: h`\(14\)` },
                { key: "C", text: h`\(15\)` },
                { key: "D", text: h`\(17\)` },
                { key: "E", text: h`\(20\)` },
              ],
              answer: "D",
              explanation: h`<p>Rute dibagi menjadi tiga kasus yang saling lepas (jumlahkan), dan tiap kasus memakai aturan perkalian.</p>
<p>Lewat Halte: \(2\times5=10\). Lewat Pasar: \(2\times2=4\). Langsung: \(3\). Total \(10+4+3=17\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-2",
              no: 2,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Jika \(\dfrac{(n+1)!}{(n-1)!}=56\), maka nilai \(n\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(6\)` },
                { key: "B", text: h`\(7\)` },
                { key: "C", text: h`\(8\)` },
                { key: "D", text: h`\(9\)` },
                { key: "E", text: h`\(14\)` },
              ],
              answer: "B",
              explanation: h`<p>\(\dfrac{(n+1)!}{(n-1)!}=(n+1)\,n=56=8\cdot7\), sehingga \(n=7\) (akar negatif \(n=-8\) tidak memenuhi).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-3",
              no: 3,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Banyak susunan huruf yang berbeda dari kata <strong>SEMARANG</strong> adalah ....</p>`,
              options: [
                { key: "A", text: h`\(2.520\)` },
                { key: "B", text: h`\(5.040\)` },
                { key: "C", text: h`\(10.080\)` },
                { key: "D", text: h`\(40.320\)` },
                { key: "E", text: h`\(20.160\)` },
              ],
              answer: "E",
              explanation: h`<p>SEMARANG terdiri atas \(8\) huruf dengan \(A\) muncul \(2\) kali:</p>
<div class="math-display">\[ \dfrac{8!}{2!}=20.160 \]</div>
<p>Jebakan: memakai \(8!=40.320\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-4",
              no: 4,
              type: "pg",
              level: "mudah",
              prompt: h`<p>Pada gambar terdapat \(7\) titik berbeda pada sebuah lingkaran. Banyak segitiga yang titik-titik sudutnya dipilih dari ketujuh titik tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 180 160" role="img" aria-label="Tujuh titik berbeda pada sebuah lingkaran" style="width: 100%; max-width: 180px; height: auto" font-size="12" font-family="inherit">
<circle cx="90" cy="80" r="60" fill="none" stroke="#2563eb" stroke-width="2.2"/><circle cx="90.0" cy="20.0" r="4.5" fill="#dc2626"/><circle cx="43.1" cy="42.6" r="4.5" fill="#dc2626"/><circle cx="31.5" cy="93.4" r="4.5" fill="#dc2626"/><circle cx="64.0" cy="134.1" r="4.5" fill="#dc2626"/><circle cx="116.0" cy="134.1" r="4.5" fill="#dc2626"/><circle cx="148.5" cy="93.4" r="4.5" fill="#dc2626"/><circle cx="136.9" cy="42.6" r="4.5" fill="#dc2626"/>
</svg>`,
              options: [
                { key: "A", text: h`\(21\)` },
                { key: "B", text: h`\(28\)` },
                { key: "C", text: h`\(35\)` },
                { key: "D", text: h`\(42\)` },
                { key: "E", text: h`\(210\)` },
              ],
              answer: "C",
              explanation: h`<p>Urutan titik sudut tidak penting: \(\binom73=\dfrac{7\cdot6\cdot5}{3\cdot2\cdot1}=35\). Karena titik-titik berada pada lingkaran, tidak ada tiga yang segaris.</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-5",
              no: 5,
              type: "tf",
              level: "mudah",
              prompt: h`<p>Tentukan nilai kebenaran setiap pernyataan berikut dengan menandai kolom Benar atau Salah, lalu tekan <strong>Periksa</strong>.</p>`,
              statements: [
                h`Banyak cara memilih ketua dan wakil ketua dari keenam orang tersebut adalah \(30\).`,
                h`Banyak cara memilih \(2\) orang perwakilan yang kedudukannya setara adalah \(30\).`,
                h`Jika keenam orang berjajar dalam satu baris dengan \(A\) dan \(B\) selalu berdampingan, banyak susunannya adalah \(240\).`,
              ],
              answer: ["B", "S", "B"],
              explanation: h`<p><strong>(1) Benar.</strong> Jabatan berbeda, \({}_{6}P_{2}=30\).</p>
<p><strong>(2) Salah.</strong> Perwakilan setara, \(\binom62=15\), bukan \(30\).</p>
<p><strong>(3) Benar.</strong> \(A,B\) satu blok: \(5!\cdot2!=240\).</p>
<p>Jadi, kuncinya adalah <strong>Benar, Salah, Benar</strong>.</p>`,
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
              prompt: h`<p>Dari angka \(0,1,2,3,4,5,6\) dibentuk bilangan empat angka yang semua angkanya berbeda, lebih dari \(3.000\), dan habis dibagi \(5\). Banyak bilangan yang dapat dibentuk adalah ....</p>`,
              options: [
                { key: "A", text: h`\(140\)` },
                { key: "B", text: h`\(105\)` },
                { key: "C", text: h`\(120\)` },
                { key: "D", text: h`\(150\)` },
                { key: "E", text: h`\(180\)` },
              ],
              answer: "A",
              explanation: h`<p>Satuan \(0\): ribuan dari \(\{3,4,5,6\}\) (\(4\) cara), ratusan \(5\) cara, puluhan \(4\) cara: \(4\cdot5\cdot4=80\).</p>
<p>Satuan \(5\): ribuan dari \(\{3,4,6\}\) (\(3\) cara, tidak boleh \(5\) dan harus \(\ge3\)), ratusan \(5\) cara, puluhan \(4\) cara: \(3\cdot5\cdot4=60\).</p>
<p>Total \(80+60=140\). Jebakan: memakai ribuan \(\{3,4,5,6\}\) pada kasus satuan \(5\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-7",
              no: 7,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Peta jalan sebuah kota berbentuk kisi seperti pada gambar. Dani berjalan dari \(A\) ke \(B\) hanya dengan bergerak ke kanan atau ke atas. Ruas jalan yang ditandai silang sedang ditutup untuk perbaikan. Banyak rute berbeda dari \(A\) ke \(B\) adalah ....</p>`,
              figure: h`<svg viewBox="0 0 264 184" role="img" aria-label="Kisi jalan 5 kali 3 dari A ke B dengan satu ruas jalan ditutup antara titik (2,1) dan (3,1)" style="width: 100%; max-width: 264px; height: auto" font-size="12" font-family="inherit">
<line x1="22" y1="158" x2="22" y2="26" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="66" y1="158" x2="66" y2="26" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="110" y1="158" x2="110" y2="26" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="154" y1="158" x2="154" y2="26" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="198" y1="158" x2="198" y2="26" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="242" y1="158" x2="242" y2="26" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="22" y1="158" x2="242" y2="158" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="22" y1="114" x2="242" y2="114" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="22" y1="70" x2="242" y2="70" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="22" y1="26" x2="242" y2="26" stroke="#2563eb" stroke-opacity=".5" stroke-width="1.5"/><line x1="110" y1="114" x2="154" y2="114" stroke="#d97706" stroke-width="4.5"/><path d="M123.0,105 L141.0,123 M123.0,123 L141.0,105" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="158" r="4.5" fill="#7c2d12"/><circle cx="242" cy="26" r="4.5" fill="#7c2d12"/><text x="14" y="175" fill="currentColor" font-weight="bold">A</text><text x="246" y="18" fill="currentColor" font-weight="bold">B</text>
</svg>`,
              options: [
                { key: "A", text: h`\(30\)` },
                { key: "B", text: h`\(36\)` },
                { key: "C", text: h`\(42\)` },
                { key: "D", text: h`\(38\)` },
                { key: "E", text: h`\(56\)` },
              ],
              answer: "D",
              explanation: h`<p>Semua rute: \(5\) langkah kanan dan \(3\) langkah atas, \(\binom83=56\).</p>
<p>Rute yang melalui ruas tertutup \((2,1)\to(3,1)\): dari \(A\) ke \((2,1)\) ada \(\binom31=3\), dari \((3,1)\) ke \(B\) (\(2\) kanan, \(2\) atas) ada \(\binom42=6\), jadi \(3\cdot6=18\).</p>
<p>Rute valid \(56-18=38\).</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-8",
              no: 8,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Sebuah tim cerdas cermat beranggotakan \(5\) orang akan dibentuk dari \(6\) putra dan \(5\) putri. Andi (putra) dan Rina (putri) tidak mau berada dalam tim yang sama. Banyak tim yang dapat dibentuk adalah ....</p>`,
              options: [
                { key: "A", text: h`\(84\)` },
                { key: "B", text: h`\(378\)` },
                { key: "C", text: h`\(420\)` },
                { key: "D", text: h`\(462\)` },
                { key: "E", text: h`\(504\)` },
              ],
              answer: "B",
              explanation: h`<p>Semua tim: \(\binom{11}5=462\). Tim yang memuat Andi dan Rina: pilih \(3\) lagi dari \(9\) orang, \(\binom93=84\).</p>
<p>Jadi \(462-84=378\). Jebakan: menjawab \(462\) atau \(84\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-9",
              no: 9,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Enam kartu terdiri atas \(2\) kartu merah, \(2\) kartu biru, dan \(2\) kartu hijau (kartu sewarna dianggap identik). Kartu-kartu itu disusun berjajar sehingga tidak ada dua kartu sewarna yang berdampingan. Banyak susunan yang mungkin adalah ....</p>`,
              options: [
                { key: "A", text: h`\(24\)` },
                { key: "B", text: h`\(36\)` },
                { key: "C", text: h`\(42\)` },
                { key: "D", text: h`\(30\)` },
                { key: "E", text: h`\(90\)` },
              ],
              answer: "D",
              explanation: h`<p>Semua susunan: \(\dfrac{6!}{2!2!2!}=90\). Satu pasangan warna berdampingan: \(\dfrac{5!}{2!2!}=30\) (ada \(3\) warna). Dua pasangan berdampingan: \(\dfrac{4!}{2!}=12\) (ada \(3\) pilihan pasangan). Ketiganya: \(3!=6\).</p>
<p>Inklusi&ndash;eksklusi:</p>
<div class="math-display">\[ 90-3\cdot30+3\cdot12-6=30 \]</div>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-10",
              no: 10,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Banyak pembagi positif dari \(2.520\) yang merupakan kelipatan \(6\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(12\)` },
                { key: "B", text: h`\(16\)` },
                { key: "C", text: h`\(24\)` },
                { key: "D", text: h`\(36\)` },
                { key: "E", text: h`\(48\)` },
              ],
              answer: "C",
              explanation: h`<p>\(2.520=2^{3}\cdot3^{2}\cdot5\cdot7\). Kelipatan \(6\) harus memuat setidaknya satu faktor \(2\) dan satu faktor \(3\): pangkat \(2\in\{1,2,3\}\) (\(3\) cara), pangkat \(3\in\{1,2\}\) (\(2\) cara), pangkat \(5\in\{0,1\}\), pangkat \(7\in\{0,1\}\).</p>
<p>Total \(3\cdot2\cdot2\cdot2=24\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-11",
              no: 11,
              type: "pg",
              level: "sedang",
              prompt: h`<p>Jumlah koefisien \(x^{3}\) dan suku tetap (suku yang tidak memuat \(x\)) pada penjabaran \(\left(x^{2}-\dfrac2x\right)^{6}\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(80\)` },
                { key: "B", text: h`\(-80\)` },
                { key: "C", text: h`\(160\)` },
                { key: "D", text: h`\(240\)` },
                { key: "E", text: h`\(400\)` },
              ],
              answer: "A",
              explanation: h`<p>Suku umum \(\binom6k(x^{2})^{6-k}\left(-\dfrac2x\right)^{k}=\binom6k(-2)^{k}x^{12-3k}\).</p>
<p>Untuk \(x^{3}\): \(k=3\), koefisien \(\binom63(-2)^{3}=-160\). Suku tetap: \(k=4\), nilai \(\binom64(-2)^{4}=240\). Jumlah \(=80\).</p>
<p>Jebakan: lupa tanda negatif sehingga \(160+240=400\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
          ],
        },
        {
          level: "sulit",
          note: "Setara UTBK",
          questions: [
            {
              id: "pg-12",
              no: 12,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Lima surat berbeda akan dimasukkan ke dalam lima amplop yang masing-masing sudah bertuliskan alamat salah satu surat, satu surat untuk satu amplop. Banyak cara memasukkan surat sehingga tepat satu surat masuk ke amplop yang benar adalah ....</p>`,
              options: [
                { key: "A", text: h`\(20\)` },
                { key: "B", text: h`\(30\)` },
                { key: "C", text: h`\(44\)` },
                { key: "D", text: h`\(45\)` },
                { key: "E", text: h`\(60\)` },
              ],
              answer: "D",
              explanation: h`<p>Pilih surat yang benar: \(5\) cara. Empat surat sisanya harus salah semua (derangement \(D_4=9\)). Total \(5\cdot9=45\).</p>
<p>Jebakan: \(44=D_5\) adalah banyak cara jika <em>tidak ada</em> yang benar.</p>
<p>Jadi, jawaban yang benar adalah <strong>D</strong>.</p>`,
            },
            {
              id: "pg-13",
              no: 13,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Bilangan empat angka disebut <em>menurun</em> jika setiap angkanya lebih kecil daripada angka di sebelah kirinya, misalnya \(7.410\) dan \(9.865\). Banyak bilangan menurun empat angka yang habis dibagi \(5\) adalah ....</p>`,
              options: [
                { key: "A", text: h`\(88\)` },
                { key: "B", text: h`\(84\)` },
                { key: "C", text: h`\(90\)` },
                { key: "D", text: h`\(94\)` },
                { key: "E", text: h`\(126\)` },
              ],
              answer: "A",
              explanation: h`<p>Angka-angka menurun ketat berarti himpunan empat angka berbeda yang urutannya sudah tertentu.</p>
<p>Satuan \(0\): pilih tiga angka dari \(1\)&ndash;\(9\), \(\binom93=84\). Satuan \(5\): tiga angka lainnya harus lebih besar dari \(5\), pilih dari \(\{6,7,8,9\}\), \(\binom43=4\). Total \(88\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
            {
              id: "pg-14",
              no: 14,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Banyak susunan huruf kata <strong>MATEMATIKA</strong> yang tidak memuat dua huruf vokal berdampingan adalah ....</p>`,
              options: [
                { key: "A", text: h`\(600\)` },
                { key: "B", text: h`\(1.200\)` },
                { key: "C", text: h`\(1.800\)` },
                { key: "D", text: h`\(7.200\)` },
                { key: "E", text: h`\(3.600\)` },
              ],
              answer: "E",
              explanation: h`<p>Konsonan \(M,M,T,T,K\): \(\dfrac{5!}{2!2!}=30\) susunan. Terbentuk \(6\) celah (termasuk ujung), pilih \(5\) celah berbeda untuk vokal: \(\binom65=6\). Vokal \(A,A,A,E,I\) di celah terpilih: \(\dfrac{5!}{3!}=20\).</p>
<p>Total \(30\cdot6\cdot20=3.600\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-15",
              no: 15,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Sebuah segi sepuluh beraturan memiliki \(10\) titik sudut. Segitiga dibentuk dengan memilih tiga titik sudutnya (contoh segitiga berwarna pada gambar). Banyak segitiga yang <strong>tidak satu pun</strong> sisinya berimpit dengan sisi segi sepuluh tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 200 180" role="img" aria-label="Segi sepuluh beraturan dengan satu contoh segitiga berwarna dari tiga titik sudutnya" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<polygon points="100.0,20.0 58.9,33.4 33.4,68.4 33.4,111.6 58.9,146.6 100.0,160.0 141.1,146.6 166.6,111.6 166.6,68.4 141.1,33.4" fill="none" stroke="#2563eb" stroke-width="2.4" stroke-linejoin="round"/><polygon points="100.0,20.0 33.4,111.6 141.1,146.6" fill="#d97706" fill-opacity=".18" stroke="#d97706" stroke-width="2.6" stroke-linejoin="round"/><circle cx="100.0" cy="20.0" r="3.6" fill="#7c2d12"/><circle cx="58.9" cy="33.4" r="3.6" fill="#7c2d12"/><circle cx="33.4" cy="68.4" r="3.6" fill="#7c2d12"/><circle cx="33.4" cy="111.6" r="3.6" fill="#7c2d12"/><circle cx="58.9" cy="146.6" r="3.6" fill="#7c2d12"/><circle cx="100.0" cy="160.0" r="3.6" fill="#7c2d12"/><circle cx="141.1" cy="146.6" r="3.6" fill="#7c2d12"/><circle cx="166.6" cy="111.6" r="3.6" fill="#7c2d12"/><circle cx="166.6" cy="68.4" r="3.6" fill="#7c2d12"/><circle cx="141.1" cy="33.4" r="3.6" fill="#7c2d12"/>
</svg>`,
              options: [
                { key: "A", text: h`\(40\)` },
                { key: "B", text: h`\(45\)` },
                { key: "C", text: h`\(50\)` },
                { key: "D", text: h`\(60\)` },
                { key: "E", text: h`\(70\)` },
              ],
              answer: "C",
              explanation: h`<p>Semua segitiga \(\binom{10}3=120\). Tepat \(2\) sisi berimpit (tiga titik berurutan): \(10\). Tepat \(1\) sisi: pilih sisi (\(10\)), titik ketiga tidak boleh bertetangga dengan kedua ujung sisi: \(10-4=6\), jadi \(60\).</p>
<p>Tanpa sisi: \(120-10-60=50\). Rumus: \(\dfrac{n}{n-3}\binom{n-3}{3}=\dfrac{10}{7}\cdot35=50\).</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-16",
              no: 16,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Sembilan siswa akan dibagi menjadi tiga kelompok yang masing-masing beranggotakan tiga orang. Kelompok tidak diberi nama atau nomor. Banyak cara membagi jika Ana dan Budi harus berada dalam kelompok yang sama adalah ....</p>`,
              options: [
                { key: "A", text: h`\(35\)` },
                { key: "B", text: h`\(70\)` },
                { key: "C", text: h`\(140\)` },
                { key: "D", text: h`\(280\)` },
                { key: "E", text: h`\(420\)` },
              ],
              answer: "B",
              explanation: h`<p>Ana dan Budi satu kelompok, pilih anggota ketiga dari \(7\) orang: \(7\) cara. Enam orang tersisa dibagi dua kelompok tak bernama: \(\dfrac12\binom63=10\).</p>
<p>Total \(7\cdot10=70\). Jebakan: tanpa membagi dengan \(2\) diperoleh \(140\).</p>
<p>Jadi, jawaban yang benar adalah <strong>B</strong>.</p>`,
            },
            {
              id: "pg-17",
              no: 17,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Lima pria dan tiga wanita duduk mengelilingi sebuah meja bundar sehingga tidak ada dua wanita yang duduk bersebelahan. Banyak susunan duduk yang mungkin adalah ....</p>`,
              options: [
                { key: "A", text: h`\(480\)` },
                { key: "B", text: h`\(720\)` },
                { key: "C", text: h`\(1.200\)` },
                { key: "D", text: h`\(2.880\)` },
                { key: "E", text: h`\(1.440\)` },
              ],
              answer: "E",
              explanation: h`<p>Susun \(5\) pria melingkar: \((5-1)!=24\). Terbentuk \(5\) celah di antara pria. Tempatkan \(3\) wanita pada \(3\) celah berbeda (urutan penting): \({}_{5}P_{3}=60\).</p>
<p>Total \(24\cdot60=1.440\).</p>
<p>Jadi, jawaban yang benar adalah <strong>E</strong>.</p>`,
            },
            {
              id: "pg-18",
              no: 18,
              type: "pg",
              level: "sulit",
              prompt: h`<p>Pada papan berukuran \(5\times4\) petak terdapat satu petak berwarna. Banyak persegi panjang (termasuk persegi) yang tersusun dari petak-petak utuh dan <strong>memuat petak berwarna</strong> tersebut adalah ....</p>`,
              figure: h`<svg viewBox="0 0 228 200" role="img" aria-label="Papan 5 kali 4 petak dengan satu petak berwarna pada kolom ketiga dan baris kedua dari bawah" style="width: 100%; max-width: 228px; height: auto" font-size="12" font-family="inherit">
<rect x="94" y="94" width="40" height="40" fill="#38bdf8" fill-opacity=".55"/><line x1="14" y1="174" x2="14" y2="14" stroke="#2563eb" stroke-width="1.8"/><line x1="54" y1="174" x2="54" y2="14" stroke="#2563eb" stroke-width="1.8"/><line x1="94" y1="174" x2="94" y2="14" stroke="#2563eb" stroke-width="1.8"/><line x1="134" y1="174" x2="134" y2="14" stroke="#2563eb" stroke-width="1.8"/><line x1="174" y1="174" x2="174" y2="14" stroke="#2563eb" stroke-width="1.8"/><line x1="214" y1="174" x2="214" y2="14" stroke="#2563eb" stroke-width="1.8"/><line x1="14" y1="174" x2="214" y2="174" stroke="#2563eb" stroke-width="1.8"/><line x1="14" y1="134" x2="214" y2="134" stroke="#2563eb" stroke-width="1.8"/><line x1="14" y1="94" x2="214" y2="94" stroke="#2563eb" stroke-width="1.8"/><line x1="14" y1="54" x2="214" y2="54" stroke="#2563eb" stroke-width="1.8"/><line x1="14" y1="14" x2="214" y2="14" stroke="#2563eb" stroke-width="1.8"/><rect x="54" y="54" width="120" height="120" fill="none" stroke="#d97706" stroke-width="3" stroke-dasharray="7 4"/><text x="114.0" y="192" text-anchor="middle" fill="#d97706" font-size="11">contoh persegi panjang</text>
</svg>`,
              options: [
                { key: "A", text: h`\(54\)` },
                { key: "B", text: h`\(36\)` },
                { key: "C", text: h`\(48\)` },
                { key: "D", text: h`\(60\)` },
                { key: "E", text: h`\(72\)` },
              ],
              answer: "A",
              explanation: h`<p>Sebuah persegi panjang ditentukan oleh sisi kiri, kanan, bawah, dan atas. Petak berwarna berada pada kolom ke-\(3\) dari kiri (kolom \(1\)&ndash;\(5\)) dan baris ke-\(2\) dari bawah (baris \(1\)&ndash;\(4\)).</p>
<p>Sisi kiri: \(3\) pilihan (garis \(0,1,2\)). Sisi kanan: \(3\) pilihan (garis \(3,4,5\)). Sisi bawah: \(2\) pilihan (garis \(0,1\)). Sisi atas: \(3\) pilihan (garis \(2,3,4\)).</p>
<p>Total \(3\cdot3\cdot2\cdot3=54\).</p>
<p>Jadi, jawaban yang benar adalah <strong>A</strong>.</p>`,
            },
          ],
        },
        {
          level: "hots",
          note: "Penalaran tingkat tinggi gaya UTBK",
          questions: [
            {
              id: "pg-19",
              no: 19,
              type: "pg",
              level: "hots",
              prompt: h`<p>Sebuah komite beranggotakan \(r\) orang dipilih dari \(n\) orang (\(0&lt;r&lt;n\)). Berapa banyak komite berbeda yang dapat dibentuk?</p>
<ol>
<li>\(n=10\).</li>
<li>Banyak komite beranggotakan \(r\) orang sama dengan banyak komite beranggotakan \((r+2)\) orang.</li>
</ol>`,
              options: [
                { key: "A", text: h`Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup.` },
                { key: "B", text: h`Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup.` },
                { key: "C", text: h`DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.` },
                { key: "D", text: h`Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA cukup untuk menjawab pertanyaan.` },
                { key: "E", text: h`Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan.` },
              ],
              answer: "C",
              explanation: h`<p>Pernyataan (1) saja: \(r\) tidak diketahui, tidak cukup.</p>
<p>Pernyataan (2): \(\binom nr=\binom n{r+2}\) dengan \(r\neq r+2\) berarti \(r+(r+2)=n\), yaitu \(n=2r+2\); nilai \(n\) dan \(r\) belum tertentu, jadi tidak cukup.</p>
<p>Bersama: \(10=2r+2\Rightarrow r=4\), sehingga \(\binom{10}4=210\). Kedua pernyataan diperlukan.</p>
<p>Jadi, jawaban yang benar adalah <strong>C</strong>.</p>`,
            },
            {
              id: "pg-20",
              no: 20,
              type: "pg",
              level: "hots",
              prompt: h`<p>Pada segi tujuh beraturan digambar semua diagonalnya (lihat gambar). Pada segi tujuh beraturan, tidak ada tiga diagonal yang berpotongan di satu titik di dalamnya. Semua diagonal tersebut membagi daerah dalam segi tujuh menjadi beberapa daerah kecil. Banyak daerah kecil yang terbentuk adalah .... <br /><small>(Petunjuk: tambahkan diagonal satu per satu dan amati berapa daerah baru yang lahir.)</small></p>`,
              figure: h`<svg viewBox="0 0 200 190" role="img" aria-label="Segi tujuh beraturan dengan semua diagonalnya" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<line x1="100.0" y1="14.0" x2="39.0" y2="43.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="100.0" y1="14.0" x2="24.0" y2="109.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="100.0" y1="14.0" x2="66.2" y2="162.3" stroke="#0f8b7d" stroke-width="1.2"/><line x1="100.0" y1="14.0" x2="133.8" y2="162.3" stroke="#0f8b7d" stroke-width="1.2"/><line x1="100.0" y1="14.0" x2="176.0" y2="109.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="100.0" y1="14.0" x2="161.0" y2="43.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="39.0" y1="43.4" x2="24.0" y2="109.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="39.0" y1="43.4" x2="66.2" y2="162.3" stroke="#0f8b7d" stroke-width="1.2"/><line x1="39.0" y1="43.4" x2="133.8" y2="162.3" stroke="#0f8b7d" stroke-width="1.2"/><line x1="39.0" y1="43.4" x2="176.0" y2="109.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="39.0" y1="43.4" x2="161.0" y2="43.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="24.0" y1="109.4" x2="66.2" y2="162.3" stroke="#0f8b7d" stroke-width="1.2"/><line x1="24.0" y1="109.4" x2="133.8" y2="162.3" stroke="#0f8b7d" stroke-width="1.2"/><line x1="24.0" y1="109.4" x2="176.0" y2="109.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="24.0" y1="109.4" x2="161.0" y2="43.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="66.2" y1="162.3" x2="133.8" y2="162.3" stroke="#0f8b7d" stroke-width="1.2"/><line x1="66.2" y1="162.3" x2="176.0" y2="109.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="66.2" y1="162.3" x2="161.0" y2="43.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="133.8" y1="162.3" x2="176.0" y2="109.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="133.8" y1="162.3" x2="161.0" y2="43.4" stroke="#0f8b7d" stroke-width="1.2"/><line x1="176.0" y1="109.4" x2="161.0" y2="43.4" stroke="#0f8b7d" stroke-width="1.2"/><polygon points="100.0,14.0 39.0,43.4 24.0,109.4 66.2,162.3 133.8,162.3 176.0,109.4 161.0,43.4" fill="none" stroke="#2563eb" stroke-width="3" stroke-linejoin="round"/><circle cx="100.0" cy="14.0" r="3.6" fill="#7c2d12"/><circle cx="39.0" cy="43.4" r="3.6" fill="#7c2d12"/><circle cx="24.0" cy="109.4" r="3.6" fill="#7c2d12"/><circle cx="66.2" cy="162.3" r="3.6" fill="#7c2d12"/><circle cx="133.8" cy="162.3" r="3.6" fill="#7c2d12"/><circle cx="176.0" cy="109.4" r="3.6" fill="#7c2d12"/><circle cx="161.0" cy="43.4" r="3.6" fill="#7c2d12"/>
</svg>`,
              options: [
                { key: "A", text: h`\(35\)` },
                { key: "B", text: h`\(50\)` },
                { key: "C", text: h`\(56\)` },
                { key: "D", text: h`\(42\)` },
                { key: "E", text: h`\(64\)` },
              ],
              answer: "B",
              explanation: h`<p>Banyak diagonal: \(\dfrac{7\cdot4}2=14\). Titik potong di dalam: tiap empat titik sudut menentukan tepat satu perpotongan dua diagonal, jadi \(\binom74=35\).</p>
<p>Tiap diagonal baru menambah daerah sebanyak \(1+\) (banyaknya perpotongan dengan diagonal sebelumnya). Total daerah \(=1+14+35=50\).</p>
<p>Pemeriksaan dengan rumus Euler: \(V=7+35=42\), \(E=7+(14+2\cdot35)=91\), daerah dalam \(=E-V+1=50\).</p>
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
              prompt: h`<p>Banyak bilangan tiga angka (dari \(100\) sampai \(999\)) yang jumlah ketiga angkanya sama dengan \(6\) adalah ....</p>`,
              answer: ["21"],
              explanation: h`<p>Misalkan angkanya \(a,b,c\) dengan \(a\ge1\) dan \(a+b+c=6\). Ganti \(a'=a-1\ge0\), sehingga \(a'+b+c=5\) dengan semua peubah bilangan bulat tak negatif.</p>
<p>Banyak solusi \(\binom{5+2}2=21\) (bintang dan batang). Batas angka \(\le9\) otomatis terpenuhi.</p>`,
            },
            {
              id: "isian-2",
              no: 2,
              type: "short",
              level: "sedang",
              prompt: h`<p>Jika \(\dbinom{n+2}{4}=6\dbinom n2\), maka nilai \(n\) adalah ....</p>`,
              answer: ["7"],
              explanation: h`<p>\(\dfrac{(n+2)(n+1)n(n-1)}{24}=6\cdot\dfrac{n(n-1)}2\). Untuk \(n\ge2\) bagi dengan \(n(n-1)\): \(\dfrac{(n+2)(n+1)}{24}=3\), sehingga \((n+2)(n+1)=72=9\cdot8\) dan \(n=7\).</p>
<p>Pemeriksaan: \(\binom94=126=6\cdot21\).</p>`,
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
              prompt: h`<p>Sebuah kode terdiri atas empat angka (dari \(0\) sampai \(9\), boleh berulang). Banyak kode yang memuat <strong>tepat tiga angka berbeda</strong>, misalnya \(3137\) atau \(5055\), adalah ....</p>`,
              answer: ["4320", "4.320"],
              explanation: h`<p>Pilih angka yang muncul dua kali (\(10\) cara), pilih dua angka lain yang berbeda dari \(9\) sisanya (\(\binom92=36\)), lalu susun empat posisi: \(\dfrac{4!}{2!}=12\).</p>
<p>Total \(10\cdot36\cdot12=4.320\).</p>`,
            },
            {
              id: "isian-4",
              no: 4,
              type: "short",
              level: "sulit",
              prompt: h`<p>Banyak bilangan bulat positif yang tidak lebih dari \(1.000\) dan <strong>tidak habis dibagi</strong> \(2\), \(3\), maupun \(5\) adalah ....</p>`,
              answer: ["266"],
              explanation: h`<p>Inklusi&ndash;eksklusi: habis dibagi \(2\): \(500\); \(3\): \(333\); \(5\): \(200\). Dua sekaligus: \(6\to166\), \(10\to100\), \(15\to66\). Ketiganya: \(30\to33\).</p>
<p>Yang habis dibagi minimal satu: \(500+333+200-166-100-66+33=734\). Sisanya \(1.000-734=266\).</p>`,
            },
            {
              id: "isian-5",
              no: 5,
              type: "short",
              level: "sulit",
              prompt: h`<p>Peta pada gambar terdiri atas daerah \(P\) di tengah dan empat daerah \(1,2,3,4\) yang mengelilinginya. Dua daerah bertetangga bila berbagi batas (daerah \(1\) dan \(3\) tidak bertetangga, demikian pula \(2\) dan \(4\)). Tersedia \(4\) warna, dan setiap daerah diwarnai satu warna sehingga daerah bertetangga berbeda warna (tidak harus memakai semua warna). Banyak cara mewarnai peta adalah ....</p>`,
              figure: h`<svg viewBox="0 0 200 200" role="img" aria-label="Peta dengan daerah P di tengah dan empat daerah 1, 2, 3, 4 di sekelilingnya" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<path d="M132.0,100.0 A32,32 0 0 0 100.0,68.0 L100.0,20.0 A80,80 0 0 1 180.0,100.0 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2.4"/><path d="M100.0,68.0 A32,32 0 0 0 68.0,100.0 L20.0,100.0 A80,80 0 0 1 100.0,20.0 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2.4"/><path d="M68.0,100.0 A32,32 0 0 0 100.0,132.0 L100.0,180.0 A80,80 0 0 1 20.0,100.0 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2.4"/><path d="M100.0,132.0 A32,32 0 0 0 132.0,100.0 L180.0,100.0 A80,80 0 0 1 100.0,180.0 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2.4"/><circle cx="100" cy="100" r="32" fill="#bae6fd" fill-opacity=".7" stroke="#2563eb" stroke-width="2.4"/><text x="100" y="105" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="15">P</text><text x="140.3" y="64.7" text-anchor="middle" fill="currentColor" font-size="14">1</text><text x="59.7" y="64.7" text-anchor="middle" fill="currentColor" font-size="14">2</text><text x="59.7" y="145.3" text-anchor="middle" fill="currentColor" font-size="14">3</text><text x="140.3" y="145.3" text-anchor="middle" fill="currentColor" font-size="14">4</text>
</svg>`,
              answer: ["72"],
              explanation: h`<p>Pilih warna \(P\): \(4\) cara. Keempat daerah di sekelilingnya hanya boleh memakai \(3\) warna sisa dan membentuk lingkaran empat daerah dengan tetangga berbeda warna: banyak pewarnaan siklus-\(4\) dengan \(3\) warna adalah \((3-1)^{4}+(3-1)=18\).</p>
<p>Total \(4\cdot18=72\).</p>`,
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
              prompt: h`<p>Sebuah kunci pintu digital menggunakan PIN empat angka yang dipilih dari tombol \(0,1,2,\dots,9\) (lihat gambar).</p>`,
              figure: h`<svg viewBox="0 0 214 225" role="img" aria-label="Panel PIN dengan empat kotak isian dan tombol angka 0 sampai 9" style="width: 100%; max-width: 214px; height: auto" font-size="12" font-family="inherit">
<rect x="10" y="8" width="40" height="32" rx="5" fill="#ffffff" stroke="#2563eb" stroke-width="2"/><text x="30.0" y="28.5" text-anchor="middle" fill="currentColor"></text><rect x="59" y="8" width="40" height="32" rx="5" fill="#ffffff" stroke="#2563eb" stroke-width="2"/><text x="79.0" y="28.5" text-anchor="middle" fill="currentColor"></text><rect x="108" y="8" width="40" height="32" rx="5" fill="#ffffff" stroke="#2563eb" stroke-width="2"/><text x="128.0" y="28.5" text-anchor="middle" fill="currentColor"></text><rect x="157" y="8" width="40" height="32" rx="5" fill="#ffffff" stroke="#2563eb" stroke-width="2"/><text x="177.0" y="28.5" text-anchor="middle" fill="currentColor"></text><rect x="10" y="60" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="30.0" y="80.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">1</tspan></text><rect x="59" y="60" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="79.0" y="80.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">2</tspan></text><rect x="108" y="60" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="128.0" y="80.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">3</tspan></text><rect x="10" y="100" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="30.0" y="120.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">4</tspan></text><rect x="59" y="100" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="79.0" y="120.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">5</tspan></text><rect x="108" y="100" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="128.0" y="120.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">6</tspan></text><rect x="10" y="140" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="30.0" y="160.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">7</tspan></text><rect x="59" y="140" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="79.0" y="160.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">8</tspan></text><rect x="108" y="140" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="128.0" y="160.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">9</tspan></text><rect x="59" y="180" width="40" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="79.0" y="200.5" text-anchor="middle" fill="currentColor"><tspan font-weight="bold" font-size="15">0</tspan></text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Berapa banyak PIN jika angka boleh berulang?</li>
<li>Berapa banyak PIN jika keempat angkanya harus berbeda?</li>
<li>Berapa banyak PIN dengan empat angka berbeda yang <strong>dua angka pertamanya ganjil</strong>?</li>
<li>Jika angka boleh berulang, berapa banyak PIN yang memuat <strong>paling sedikit satu angka \(7\)</strong>?</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Empat posisi, masing-masing \(10\) pilihan: \(10^{4}=10.000\).</p>
<p><strong>(b)</strong> \({}_{10}P_{4}=10\cdot9\cdot8\cdot7=5.040\).</p>
<p><strong>(c)</strong> Dua angka pertama ganjil dan berbeda: \(5\cdot4=20\). Dua angka berikutnya dari \(8\) angka tersisa: \(8\cdot7=56\). Total \(20\cdot56=1.120\).</p>
<p><strong>(d)</strong> Komplemen: semua PIN \(10^{4}\) dikurangi PIN tanpa angka \(7\) (\(9^{4}=6.561\)): \(10.000-6.561=3.439\).</p>
<p class="penskoran"><em>Penskoran: tiap bagian 2 poin.</em></p>`,
            },
            {
              id: "uraian-2",
              no: 2,
              type: "essay",
              level: "sedang",
              prompt: h`<p>Sebuah sekolah memiliki \(20\) siswa yang mendaftar sebagai pengurus: \(7\) dari kelas X, \(8\) dari kelas XI, dan \(5\) dari kelas XII (lihat diagram).</p>`,
              figure: h`<svg viewBox="0 0 200 175" role="img" aria-label="Diagram batang: 7 siswa kelas X, 8 siswa kelas XI, 5 siswa kelas XII" style="width: 100%; max-width: 200px; height: auto" font-size="12" font-family="inherit">
<line x1="30" y1="15" x2="30" y2="150" stroke="currentColor" stroke-width="1.6"/><line x1="30" y1="150" x2="190" y2="150" stroke="currentColor" stroke-width="1.6"/><text x="38" y="12" fill="currentColor" font-size="11">siswa</text><line x1="26" y1="90" x2="190" y2="90" stroke="currentColor" stroke-opacity=".15"/><text x="22" y="94" text-anchor="end" fill="currentColor" font-size="10">5</text><line x1="26" y1="30" x2="190" y2="30" stroke="currentColor" stroke-opacity=".15"/><text x="22" y="34" text-anchor="end" fill="currentColor" font-size="10">10</text><rect x="45" y="66" width="28" height="84" fill="#0f8b7d"/><text x="59" y="62" text-anchor="middle" fill="currentColor" font-size="12">7</text><text x="59" y="166" text-anchor="middle" fill="currentColor" font-size="12">X</text><rect x="93" y="54" width="28" height="96" fill="#0f8b7d"/><text x="107" y="50" text-anchor="middle" fill="currentColor" font-size="12">8</text><text x="107" y="166" text-anchor="middle" fill="currentColor" font-size="12">XI</text><rect x="141" y="90" width="28" height="60" fill="#0f8b7d"/><text x="155" y="86" text-anchor="middle" fill="currentColor" font-size="12">5</text><text x="155" y="166" text-anchor="middle" fill="currentColor" font-size="12">XII</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Dari \(20\) siswa dipilih ketua, wakil ketua, dan sekretaris (jabatan berbeda). Berapa cara?</li>
<li>Berapa banyak panitia \(4\) orang yang dapat dibentuk tanpa syarat?</li>
<li>Berapa banyak panitia \(4\) orang yang memuat <strong>paling sedikit satu wakil dari tiap kelas</strong>? Gunakan cara langsung (pembagian kasus), lalu periksa dengan cara komplemen.</li>
<li>Ali dan Beni (keduanya kelas XII) tidak mau berada dalam panitia yang sama. Berapa panitia \(4\) orang yang dapat dibentuk?</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Jabatan berbeda: \({}_{20}P_{3}=20\cdot19\cdot18=6.840\).</p>
<p><strong>(b)</strong> \(\binom{20}4=4.845\).</p>
<p><strong>(c)</strong> Cara langsung: satu kelas menyumbang \(2\) orang dan dua kelas lain masing-masing \(1\) orang. Kelas X \(2\) orang: \(\binom72\cdot8\cdot5=840\). Kelas XI \(2\) orang: \(\binom82\cdot7\cdot5=980\). Kelas XII \(2\) orang: \(\binom52\cdot7\cdot8=560\). Total \(840+980+560=2.380\). Cek komplemen: \(4.845-\binom{13}4-\binom{12}4-\binom{15}4+\binom54+\binom84+\binom74=4.845-715-495-1.365+5+70+35=2.380\).</p>
<p><strong>(d)</strong> Panitia yang memuat Ali dan Beni: pilih \(2\) lagi dari \(18\), \(\binom{18}2=153\). Panitia valid \(4.845-153=4.692\).</p>
<p class="penskoran"><em>Penskoran: (a) 1 poin; (b) 2 poin; (c) 3 poin; (d) 2 poin.</em></p>`,
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
              prompt: h`<p>Misalkan \(S=\{1,2,3,\dots,8\}\).</p>`,
              figure: h`<svg viewBox="0 0 280 160" role="img" aria-label="Dua baris petak bernomor 1 sampai 8: himpunan renggang {1,4,7} dan bukan renggang {2,3,6}" style="width: 100%; max-width: 280px; height: auto" font-size="12" font-family="inherit">
<rect x="8" y="28" width="30" height="30" fill="#38bdf8" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="23" y="48" text-anchor="middle" fill="currentColor" font-weight="bold">1</text><rect x="8" y="98" width="30" height="30" fill="none" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="23" y="118" text-anchor="middle" fill="currentColor" >1</text><rect x="42" y="28" width="30" height="30" fill="none" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="57" y="48" text-anchor="middle" fill="currentColor" >2</text><rect x="42" y="98" width="30" height="30" fill="#fb923c" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="57" y="118" text-anchor="middle" fill="currentColor" font-weight="bold">2</text><rect x="76" y="28" width="30" height="30" fill="none" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="91" y="48" text-anchor="middle" fill="currentColor" >3</text><rect x="76" y="98" width="30" height="30" fill="#fb923c" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="91" y="118" text-anchor="middle" fill="currentColor" font-weight="bold">3</text><rect x="110" y="28" width="30" height="30" fill="#38bdf8" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="125" y="48" text-anchor="middle" fill="currentColor" font-weight="bold">4</text><rect x="110" y="98" width="30" height="30" fill="none" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="125" y="118" text-anchor="middle" fill="currentColor" >4</text><rect x="144" y="28" width="30" height="30" fill="none" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="159" y="48" text-anchor="middle" fill="currentColor" >5</text><rect x="144" y="98" width="30" height="30" fill="none" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="159" y="118" text-anchor="middle" fill="currentColor" >5</text><rect x="178" y="28" width="30" height="30" fill="none" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="193" y="48" text-anchor="middle" fill="currentColor" >6</text><rect x="178" y="98" width="30" height="30" fill="#fb923c" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="193" y="118" text-anchor="middle" fill="currentColor" font-weight="bold">6</text><rect x="212" y="28" width="30" height="30" fill="#38bdf8" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="227" y="48" text-anchor="middle" fill="currentColor" font-weight="bold">7</text><rect x="212" y="98" width="30" height="30" fill="none" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="227" y="118" text-anchor="middle" fill="currentColor" >7</text><rect x="246" y="28" width="30" height="30" fill="none" fill-opacity=".6" stroke="#2563eb" stroke-width="2"/><text x="261" y="48" text-anchor="middle" fill="currentColor" >8</text><rect x="246" y="98" width="30" height="30" fill="none" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/><text x="261" y="118" text-anchor="middle" fill="currentColor" >8</text><text x="140" y="18" text-anchor="middle" fill="#0f766e" font-size="12">renggang: {1, 4, 7}</text><text x="140" y="148" text-anchor="middle" fill="#d97706" font-size="12">bukan renggang: {2, 3, 6}</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Berapa banyak himpunan bagian dari \(S\), dan berapa banyak di antaranya yang beranggota \(3\) unsur?</li>
<li>Sebuah himpunan bagian disebut <em>renggang</em> jika tidak memuat dua bilangan berurutan (lihat gambar). Tentukan banyak himpunan bagian renggang beranggota \(3\) unsur, dengan memetakannya ke himpunan bagian dari \(\{1,\dots,6\}\).</li>
<li>Tentukan banyak <strong>semua</strong> himpunan bagian renggang dari \(S\) (termasuk himpunan kosong) dengan membuat hubungan rekursif.</li>
<li>Hitung \(\displaystyle\sum_{k=0}^{4}\binom{9-k}{k}\) dan bandingkan dengan hasil (c).</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Setiap unsur dipilih atau tidak: \(2^{8}=256\) himpunan bagian. Beranggota \(3\): \(\binom83=56\).</p>
<p><strong>(b)</strong> Misalkan unsur terurut \(a_1&lt;a_2&lt;a_3\) dengan selisih berurutan minimal \(2\). Petakan ke \((a_1,\,a_2-1,\,a_3-2)\), yang merupakan himpunan bagian tiga unsur dari \(\{1,\dots,6\}\) (selisih menjadi minimal \(1\)). Pemetaan ini bijektif, sehingga banyaknya \(\binom63=20\).</p>
<p><strong>(c)</strong> Misalkan \(a_n\) adalah banyak himpunan bagian renggang dari \(\{1,\dots,n\}\). Jika \(n\) tidak dipilih: \(a_{n-1}\) cara. Jika \(n\) dipilih, maka \(n-1\) tidak boleh dipilih: \(a_{n-2}\) cara. Jadi \(a_n=a_{n-1}+a_{n-2}\) dengan \(a_1=2\) dan \(a_2=3\). Diperoleh \(a_3=5\), \(a_4=8\), \(a_5=13\), \(a_6=21\), \(a_7=34\), \(a_8=55\).</p>
<p><strong>(d)</strong> Dengan pemetaan seperti (b), banyak himpunan renggang berukuran \(k\) adalah \(\binom{9-k}k\): \(\binom90+\binom81+\binom72+\binom63+\binom54=1+8+21+20+5=55\) (untuk \(k\ge5\) nilainya \(0\)). Hasilnya sama dengan (c).</p>
<p class="penskoran"><em>Penskoran: (a) 1 poin; (b) 3 poin; (c) 3 poin; (d) 1 poin.</em></p>`,
            },
            {
              id: "uraian-4",
              no: 4,
              type: "essay",
              level: "sulit",
              prompt: h`<p>Enam mahasiswa akan ditempatkan pada tiga laboratorium berbeda: Lab 1, Lab 2, dan Lab 3 (contoh penempatan \(3\)&ndash;\(2\)&ndash;\(1\) pada gambar).</p>`,
              figure: h`<svg viewBox="0 0 250 128" role="img" aria-label="Tiga laboratorium: Lab 1 berisi 3 mahasiswa, Lab 2 berisi 2, Lab 3 berisi 1" style="width: 100%; max-width: 250px; height: auto" font-size="12" font-family="inherit">
<rect x="10" y="10" width="64" height="88" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="42" y="118" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="12">Lab 1</text><circle cx="30" cy="26" r="6.5" fill="#0f8b7d"/><circle cx="30" cy="50" r="6.5" fill="#0f8b7d"/><circle cx="30" cy="74" r="6.5" fill="#0f8b7d"/><rect x="90" y="10" width="64" height="88" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="122" y="118" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="12">Lab 2</text><circle cx="110" cy="26" r="6.5" fill="#0f8b7d"/><circle cx="110" cy="50" r="6.5" fill="#0f8b7d"/><rect x="170" y="10" width="64" height="88" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="202" y="118" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="12">Lab 3</text><circle cx="190" cy="26" r="6.5" fill="#0f8b7d"/>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Berapa banyak cara menempatkan keenam mahasiswa jika tidak ada syarat?</li>
<li>Berapa banyak cara jika Lab 1 tidak dipakai sama sekali?</li>
<li>Berapa banyak cara jika <strong>setiap lab terisi paling sedikit satu mahasiswa</strong>? Gunakan prinsip inklusi&ndash;eksklusi.</li>
<li>Jika ketiga lab dianggap identik (yang dihitung hanya cara membagi menjadi tiga kelompok tak kosong), berapa banyak cara? Jelaskan mengapa Anda membagi dengan \(3!\).</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Tiap mahasiswa punya \(3\) pilihan lab: \(3^{6}=729\).</p>
<p><strong>(b)</strong> Lab 1 kosong berarti tiap mahasiswa hanya memilih Lab 2 atau Lab 3: \(2^{6}=64\).</p>
<p><strong>(c)</strong> Misalkan \(A_i\) adalah himpunan penempatan dengan Lab \(i\) kosong. \(|A_i|=2^{6}=64\), \(|A_i\cap A_j|=1\) (semua di lab ketiga), dan \(|A_1\cap A_2\cap A_3|=0\). Penempatan dengan semua lab terisi: \(729-3\cdot64+3\cdot1-0=540\).</p>
<p><strong>(d)</strong> Tiap pembagian menjadi tiga kelompok tak kosong yang tak bernama bersesuaian dengan tepat \(3!=6\) penempatan ke lab yang diberi nama (kelompok mana ke lab mana), semuanya berbeda karena kelompok-kelompoknya berbeda. Jadi \(\dfrac{540}{6}=90\). Cek: \(\dfrac{6!}{4!1!1!2!}+\dfrac{6!}{3!2!1!}+\dfrac{6!}{2!2!2!3!}=15+60+15=90\).</p>
<p class="penskoran"><em>Penskoran: (a) 1 poin; (b) 2 poin; (c) 3 poin; (d) 2 poin.</em></p>`,
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
              prompt: h`<p>Sebuah wahana menjual tiket seharga Rp50.000. Empat pengunjung membayar dengan uang pas Rp50.000 (simbol \(R\), langkah ke kanan) dan empat pengunjung membayar dengan uang Rp100.000 (simbol \(U\), langkah ke atas). Loket tidak memiliki uang kembalian di awal. Urutan kedatangan disebut <em>sah</em> jika di setiap saat loket mampu memberi kembalian, yaitu pada setiap awal urutan banyaknya \(R\) tidak kurang dari banyaknya \(U\). Pengunjung yang membayar dengan uang sama dianggap tidak dapat dibedakan. Setiap urutan menjadi lintasan dari \((0,0)\) ke \((4,4)\); urutan sah adalah lintasan yang tidak pernah melewati garis \(y=x\) ke atas.</p>`,
              figure: h`<svg viewBox="0 0 264 260" role="img" aria-label="Kisi 4 kali 4: lintasan biru sah, lintasan merah tak sah, garis putus-putus y=x dan y=x+1" style="width: 100%; max-width: 264px; height: auto" font-size="12" font-family="inherit">
<clipPath id="c1"><rect x="24.0" y="22.0" width="216.0" height="216.0"/></clipPath>
<line x1="24.0" y1="238.0" x2="24.0" y2="22.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="78.0" y1="238.0" x2="78.0" y2="22.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="132.0" y1="238.0" x2="132.0" y2="22.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="186.0" y1="238.0" x2="186.0" y2="22.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="240.0" y1="238.0" x2="240.0" y2="22.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="24.0" y1="238.0" x2="240.0" y2="238.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="24.0" y1="184.0" x2="240.0" y2="184.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="24.0" y1="130.0" x2="240.0" y2="130.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="24.0" y1="76.0" x2="240.0" y2="76.0" stroke="currentColor" stroke-opacity=".13"/>
<line x1="24.0" y1="22.0" x2="240.0" y2="22.0" stroke="currentColor" stroke-opacity=".13"/>
<g clip-path="url(#c1)"><line x1="24.0" y1="238.0" x2="250.8" y2="11.2" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="5 4"/>
<line x1="24.0" y1="184.0" x2="186.0" y2="22.0" stroke="#d97706" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="6 4"/>
<line x1="24.0" y1="238.0" x2="132.0" y2="238.0" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
<line x1="132.0" y1="238.0" x2="132.0" y2="184.0" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
<line x1="132.0" y1="184.0" x2="186.0" y2="184.0" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
<line x1="186.0" y1="184.0" x2="186.0" y2="130.0" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
<line x1="186.0" y1="130.0" x2="240.0" y2="130.0" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
<line x1="240.0" y1="130.0" x2="240.0" y2="22.0" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
<line x1="24.0" y1="238.0" x2="24.0" y2="184.0" stroke="#dc2626" stroke-width="3.6" stroke-linecap="round"/>
<line x1="24.0" y1="184.0" x2="78.0" y2="184.0" stroke="#dc2626" stroke-width="3.6" stroke-linecap="round"/>
<line x1="78.0" y1="184.0" x2="78.0" y2="76.0" stroke="#dc2626" stroke-width="3.6" stroke-linecap="round"/>
<line x1="78.0" y1="76.0" x2="186.0" y2="76.0" stroke="#dc2626" stroke-width="3.6" stroke-linecap="round"/>
<line x1="186.0" y1="76.0" x2="186.0" y2="22.0" stroke="#dc2626" stroke-width="3.6" stroke-linecap="round"/>
<line x1="186.0" y1="22.0" x2="240.0" y2="22.0" stroke="#dc2626" stroke-width="3.6" stroke-linecap="round"/></g>
<circle cx="24.0" cy="238.0" r="3.6" fill="#7c2d12"/>
<circle cx="240.0" cy="22.0" r="3.6" fill="#7c2d12"/>
<text x="246.0" y="253.0" text-anchor="start" fill="currentColor">R</text>
<text x="18.0" y="16.0" text-anchor="end" fill="currentColor">U</text>
<text x="192.0" y="16.0" text-anchor="start" fill="#d97706">y = x + 1</text>
<text x="233.0" y="204.2" text-anchor="end" fill="#2563eb">biru: sah</text>
<text x="233.0" y="220.4" text-anchor="end" fill="#dc2626">merah: tak sah</text>
</svg>`,
              promptAfter: h`<ol type="a">
<li>Berapa banyak urutan kedatangan tanpa syarat?</li>
<li>Urutan tak sah pasti menyentuh garis \(y=x+1\). Pantulkan bagian lintasan sebelum sentuhan pertama terhadap garis tersebut, lalu tentukan banyak lintasan tak sah.</li>
<li>Tentukan banyak urutan sah.</li>
<li>Terapkan cara yang sama untuk \(5\) pengunjung \(R\) dan \(5\) pengunjung \(U\).</li>
</ol>`,
              explanation: h`<p><strong>(a)</strong> Urutan memuat \(4\) langkah \(R\) dan \(4\) langkah \(U\): \(\binom84=70\).</p>
<p><strong>(b)</strong> Urutan tak sah pasti menyentuh garis \(y=x+1\). Pantulkan bagian lintasan dari \((0,0)\) sampai sentuhan pertama terhadap garis \(y=x+1\): titik awal menjadi \((-1,1)\). Terjadi korespondensi satu-satu antara lintasan tak sah dan semua lintasan dari \((-1,1)\) ke \((4,4)\), yaitu \(5\) langkah \(R\) dan \(3\) langkah \(U\): \(\binom83=56\).</p>
<p><strong>(c)</strong> Urutan sah: \(70-56=14\).</p>
<p><strong>(d)</strong> Untuk \(5\) dan \(5\): semua lintasan \(\binom{10}5=252\). Tak sah: dari \((-1,1)\) ke \((5,5)\) ada \(6\) langkah \(R\) dan \(4\) langkah \(U\), \(\binom{10}4=210\). Sah: \(252-210=42\) (bilangan Catalan, sama dengan \(\dfrac1{6}\binom{10}5\)).</p>
<p class="penskoran"><em>Penskoran: (a) 1 poin; (b) 4 poin; (c) 1 poin; (d) 2 poin.</em></p>`,
            },
          ],
        },
      ],
    },
  ],
};

export default kombinatorika;
