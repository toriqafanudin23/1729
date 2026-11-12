import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Contoh, H2, Konsep, MB, P, Pemantik, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { LuasBalokLab, type BalokState } from "../../labs/ruang/LuasBalokLab";

export default function Bab3() {
  return (
    <>
      <Pemantik title="Berapa kertas kado yang diperlukan?">
        <P>{tx`Untuk membungkus sebuah kotak, kamu perlu kertas kado yang luasnya sama dengan <b>seluruh permukaan kotak</b>. Bagaimana menghitungnya tanpa menimbang kertas satu per satu? Gunakan jaring-jaring: buka kotaknya, lalu jumlahkan luas bidang-bidangnya.`}</P>
      </Pemantik>

      <H2>Tiga pasang bidang pada balok</H2>
      <P>{tx`Balok memiliki 6 bidang, yang berhadapan kongruen sehingga membentuk <b>tiga pasang</b>: alas dengan tutup (biru), depan dengan belakang (hijau), kiri dengan kanan (jingga). Atur ukuran balok, lalu buka jaring-jaringnya dan perhatikan luas tiap pasangan pada tabel di bawahnya.`}</P>

      <LuasBalokLab />

      <Konsep title="Luas permukaan balok dan kubus">
        <MB>{tx`L_{\text{balok}}=2(pl+pt+lt)`}</MB>
        <P>{tx`Pada kubus, \(p=l=t=s\), sehingga enam bidangnya sama besar:`}</P>
        <MB>{tx`L_{\text{kubus}}=6s^{2}`}</MB>
      </Konsep>

      <Ask id="b3-balok" />
      <Ask id="b3-kubus" />
      <Ask id="b3-rusuk" />

      <H2>Bangun tanpa salah satu bidang</H2>
      <Awas title="Hitung hanya bidang yang ada">
        <P>{tx`Kotak tanpa tutup, akuarium tanpa tutup, atau ruangan yang tidak dicat lantainya kehilangan satu atau lebih bidang. Rumus \(2(pl+pt+lt)\) harus dikurangi luas bidang yang tidak ada. Lebih aman lagi: tulis dulu bidang apa saja yang dihitung.`}</P>
      </Awas>
      <Contoh title="Contoh 3.1" soal={tx`Dinding dan langit-langit sebuah ruangan berukuran \(5\ \text{m}\times4\ \text{m}\times3\ \text{m}\) akan dicat (lantai tidak dicat; pintu dan jendela diabaikan). Berapa luas yang dicat?`}>
        <P>{tx`Bidang yang dicat: empat dinding dan satu langit-langit.`}</P>
        <MB>{tx`\underbrace{2(5\cdot3+4\cdot3)}_{\text{dinding}}+\underbrace{5\cdot4}_{\text{langit-langit}}=2(27)+20=74`}</MB>
        <P>{tx`Luas yang dicat 74 m².`}</P>
      </Contoh>
      <Ask id="b3-tanpa-tutup" />

      <H2>Bagaimana jika ukurannya berubah?</H2>
      <P>{tx`Pada simulasi, bandingkan kubus rusuk 2 dengan kubus rusuk 4. Rusuknya dua kali lipat, tetapi luas permukaannya tidak ikut dua kali lipat. Luas dihitung dari perkalian dua panjang, sehingga ikut dikuadratkan.`}</P>
      <Ask id="b3-skala" />

      <Challenge<BalokState> id="b3-ch1" check={(s) => s.surface === 94}>
        {(report) => <LuasBalokLab onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Luas permukaan adalah jumlah luas semua bidang pada bangun, sama dengan luas jaring-jaringnya.`,
          tx`Balok: \(L=2(pl+pt+lt)\). Kubus: \(L=6s^{2}\).`,
          tx`Untuk bangun tanpa tutup, kurangi luas bidang yang tidak ada.`,
          tx`Jika semua panjang diperbesar \(k\) kali, luas permukaan menjadi \(k^{2}\) kali.`,
        ]}
      />
    </>
  );
}
