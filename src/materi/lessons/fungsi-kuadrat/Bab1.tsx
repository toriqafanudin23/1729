import { Ask } from "../../components/Checkpoint";
import { Awas, Konsep, MB, P, Pemantik, H2, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { BallLab } from "../../labs/BallLab";
import { DifferenceLab } from "../../labs/DifferenceLab";

export default function Bab1() {
  return (
    <>
      <Pemantik title="Bola yang dilempar ke atas">
        <P>{tx`Sebuah bola dilempar lurus ke atas. Mula-mula ia naik cepat, makin lambat, berhenti sesaat di titik tertinggi, lalu jatuh kembali. Bisakah gerakan seperti ini dituliskan sebagai satu rumus, sehingga kita dapat menghitung tinggi bola kapan saja?`}</P>
      </Pemantik>

      <H2>Lintasan bola dan sebuah rumus</H2>
      <P>{tx`Dengan kecepatan awal 20 m/s dan percepatan gravitasi dibulatkan menjadi 10 m/s², tinggi bola (dalam meter) setelah \(t\) detik dinyatakan oleh`}</P>
      <MB>{tx`h(t)=20t-5t^{2}`}</MB>
      <P>{tx`Rumus ini berbeda dari fungsi linear yang sudah kamu kenal, karena memuat \(t^{2}\). Grafiknya pun bukan garis lurus. Mari kita amati langsung.`}</P>

      <BallLab />

      <P>{tx`Geser waktu ke beberapa nilai, lalu jawab tiga pertanyaan berikut berdasarkan simulasi.`}</P>
      <Ask id="b1-t1" />
      <Ask id="b1-t3" />
      <Ask id="b1-tertinggi" />

      <H2>Bentuk umum fungsi kuadrat</H2>
      <P>{tx`Fungsi seperti \(h(t)\) disebut <b>fungsi kuadrat</b>: fungsi yang pangkat tertinggi variabelnya tepat dua.`}</P>
      <Konsep title="Definisi">
        <P>{tx`Fungsi kuadrat dalam variabel \(x\) berbentuk`}</P>
        <MB>{tx`f(x)=ax^{2}+bx+c,\qquad a\neq 0`}</MB>
        <P>{tx`dengan \(a\), \(b\), dan \(c\) bilangan real. \(a\) adalah koefisien \(x^{2}\), \(b\) koefisien \(x\), dan \(c\) konstanta (suku tanpa \(x\)).`}</P>
      </Konsep>
      <Awas title="Mengapa a tidak boleh nol?">
        <P>{tx`Jika \(a=0\), suku \(ax^{2}\) lenyap dan yang tersisa \(bx+c\): fungsi linear, grafiknya garis lurus. Syarat \(a\neq0\) menjaga agar pangkat tertingginya benar-benar 2. Tanda minus ikut menjadi bagian koefisien, jadi pada \(x^{2}-3x\) nilai \(b\) adalah \(-3\).`}</P>
      </Awas>

      <Ask id="b1-klasifikasi" />
      <Ask id="b1-abc" />

      <H2>Pola di balik tabel nilai</H2>
      <P>{tx`Cara lain mengenali fungsi kuadrat tanpa menggambar grafik adalah melihat tabel nilainya. Hitung selisih antara dua nilai \(f(x)\) yang berurutan, lalu selisihkan sekali lagi. Pilih beberapa fungsi pada simulasi dan perhatikan baris yang nilainya sama semua.`}</P>

      <DifferenceLab />

      <Ask id="b1-selisih" />

      <Konsep title="Selisih kedua">
        <P>{tx`Untuk \(x\) yang bertambah 1 satuan, selisih kedua fungsi kuadrat selalu <b>konstan</b> dan sama dengan \(2a\). Fungsi linear sudah konstan pada selisih pertama. Pola ini sering dipakai untuk memeriksa apakah data mengikuti model kuadrat.`}</P>
      </Konsep>

      <Rangkuman
        items={[
          tx`Fungsi kuadrat berbentuk \(f(x)=ax^{2}+bx+c\) dengan \(a\neq0\).`,
          tx`Koefisien dibaca setelah suku diurutkan dari pangkat tertinggi; tanda minus ikut koefisien.`,
          tx`Fungsi linear bukan kuadrat karena \(a=0\); pangkat tiga atau lebih bukan kuadrat.`,
          tx`Pada tabel dengan selisih \(x\) tetap 1, selisih kedua fungsi kuadrat konstan sebesar \(2a\).`,
          tx`Lintasan bola memperlihatkan ciri khasnya: nilai yang sama muncul dua kali, simetris terhadap titik tertinggi.`,
        ]}
      />
    </>
  );
}
