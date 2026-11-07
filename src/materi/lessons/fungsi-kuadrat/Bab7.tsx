import { Ask } from "../../components/Checkpoint";
import { Awas, Contoh, Daftar, H2, Konsep, MB, P, Pemantik, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { OptimizeLab } from "../../labs/OptimizeLab";

export default function Bab7() {
  return (
    <>
      <Pemantik title="Mencari yang terbaik">
        <P>{tx`Berapa ukuran kandang terluas dari pagar yang terbatas? Berapa harga tiket yang memberi pendapatan terbesar? Pertanyaan "paling besar" atau "paling kecil" seperti ini sering dapat dimodelkan dengan fungsi kuadrat, dan jawabannya ada di titik puncak.`}</P>
      </Pemantik>

      <Konsep title="Langkah memodelkan masalah">
        <Daftar
          ordered
          items={[
            tx`<b>Pahami</b> apa yang ditanyakan dan apa yang dibatasi.`,
            tx`<b>Pilih variabel</b> \(x\) untuk besaran yang bisa diubah.`,
            tx`<b>Susun model</b>: tuliskan besaran yang dioptimalkan sebagai fungsi \(x\).`,
            tx`<b>Cari puncak</b> dengan \(x_p=-\dfrac{b}{2a}\), lalu hitung nilainya.`,
            tx`<b>Tafsirkan</b> dan periksa kewajaran: apakah \(x_p\) masuk akal pada konteksnya?`,
          ]}
        />
      </Konsep>

      <H2>Kasus 1: kandang bersandar tembok</H2>
      <P>{tx`Pak Dedi memiliki pagar sepanjang 40 m untuk membuat kandang persegi panjang. Satu sisinya memakai tembok sehingga hanya tiga sisi yang dipagari. Jika lebar kandang \(x\), panjangnya \(40-2x\), sehingga luasnya`}</P>
      <MB>{tx`L(x)=x(40-2x)=-2x^{2}+40x`}</MB>
      <P>{tx`Geser lebar kandang pada simulasi dan perhatikan luasnya.`}</P>

      <OptimizeLab />

      <Ask id="b7-luas" />
      <Ask id="b7-lebar" />
      <Ask id="b7-lmaks" />

      <Awas title="Periksa batas masalah">
        <P>{tx`Lebar tidak boleh negatif dan panjang \(40-2x\) juga tidak boleh negatif, sehingga \(0\le x\le20\). Titik puncak \(x=10\) berada di dalam batas itu, maka jawabannya sah. Jika puncak berada di luar batas, nilai optimumnya ada di ujung rentang.`}</P>
      </Awas>

      <H2>Kasus 2: harga dan pendapatan</H2>
      <Contoh title="Contoh 7.1" soal={tx`Sebuah toko menjual \(100-4x\) kue per hari pada harga \(x\) ribu rupiah per kue. Berapa harga agar pendapatan per hari paling besar, dan berapa pendapatannya?`}>
        <P>{tx`Pendapatan \(R(x)=x(100-4x)=-4x^{2}+100x\).`}</P>
        <P>{tx`\(x_p=-\dfrac{100}{2(-4)}=12{,}5\), yaitu harga Rp12.500. Terjual \(100-50=50\) kue, dan pendapatan maksimum \(R(12{,}5)=12{,}5\times50=625\) ribu rupiah.`}</P>
      </Contoh>
      <Ask id="b7-harga" />

      <H2>Kasus 3: keliling tetap</H2>
      <P>{tx`Perhatikan bahwa pada kandang tadi, panjang optimum (20 m) tepat dua kali lebar optimum (10 m). Apakah ada pola umum seperti ini? Coba pada soal berikut, yang tidak memakai tembok.`}</P>
      <Ask id="b7-hots" />

      <Rangkuman
        items={[
          tx`Masalah maksimum atau minimum sering menjadi fungsi kuadrat dengan satu variabel.`,
          tx`Nilai optimum ada di titik puncak: \(x_p=-\dfrac{b}{2a}\), nilainya \(f(x_p)\).`,
          tx`Selalu periksa apakah \(x_p\) berada dalam batas yang masuk akal.`,
          tx`Untuk keliling tetap, persegi memberi luas persegi panjang terbesar.`,
        ]}
      />
    </>
  );
}
