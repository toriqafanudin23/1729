import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, H2, Konsep, P, Pemantik, Rangkuman, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { JaringLab, type JaringState } from "../../labs/ruang/JaringLab";

export default function Bab2() {
  return (
    <>
      <Pemantik title="Membuka sebuah kotak">
        <P>{tx`Bayangkan kotak susu atau kardus dibuka dan dibentangkan di meja. Hasilnya satu lembar datar yang masih tersambung. Lembar itu bisa dilipat kembali menjadi kotak semula. Itulah gagasan <b>jaring-jaring</b>.`}</P>
      </Pemantik>

      <Konsep title="Jaring-jaring">
        <P>{tx`Jaring-jaring bangun ruang adalah rangkaian bidang-bidang sisi yang terbentang pada satu bidang datar. Bidang-bidangnya tetap <b>bersambung pada rusuk</b>, dan jika dilipat menjadi bangun ruang tanpa bidang yang bertumpuk atau berlubang.`}</P>
      </Konsep>

      <H2>Melipat dan membuka</H2>
      <P>{tx`Pada peragaan ini, jaring-jaring dimulai dalam keadaan rata. Tekan <b>Lipat</b> atau geser slider untuk melihat bidang-bidangnya terlipat pada rusuk. Pilih bangun yang berbeda dan bandingkan susunan bidangnya.`}</P>

      <JaringLab />

      <Tabel
        caption="Penyusun jaring-jaring"
        head={["Bangun", "Bidang penyusun", "Banyak bidang"]}
        rows={[
          ["Kubus", "6 persegi kongruen", "6"],
          ["Balok", "3 pasang persegi panjang", "6"],
          ["Prisma segitiga", "2 segitiga, 3 persegi panjang", "5"],
          ["Limas segiempat", "1 persegi, 4 segitiga", "5"],
          ["Limas segitiga", "4 segitiga", "4"],
        ]}
      />

      <Ask id="b2-limas6" />
      <Ask id="b2-prisma14" />

      <H2>Mana jaring-jaring yang benar?</H2>
      <P>{tx`Satu bangun dapat dibuka dengan banyak cara, sehingga jaring-jaringnya lebih dari satu. <b>Kubus punya tepat 11 jaring-jaring</b> yang berbeda. Tetapi tidak setiap susunan enam persegi dapat menjadi kubus.`}</P>
      <Awas title="Cara memeriksa sebuah susunan">
        <P>{tx`Pilih satu persegi sebagai alas, lalu bayangkan persegi di sekitarnya terlipat ke atas. Susunan gagal bila dua persegi jatuh pada sisi yang sama (bertumpuk), atau ada sisi kubus yang tidak tertutup. Susunan dengan blok 2×2 atau lima persegi berderet selalu gagal.`}</P>
      </Awas>

      <Ask id="b2-net" />
      <Ask id="b2-pernyataan" />

      <Challenge<JaringState> id="b2-ch1" check={(s) => s.shape === "limas-segitiga" && s.fold >= 0.99}>
        {(report) => <JaringLab onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Jaring-jaring adalah bidang-bidang sisi yang bersambung pada rusuk dan dapat dilipat menjadi bangun.`,
          tx`Satu bangun dapat memiliki beberapa jaring-jaring; kubus memiliki 11.`,
          tx`Prisma segi-\(n\): 2 segi-\(n\) dan \(n\) persegi panjang. Limas segi-\(n\): 1 segi-\(n\) dan \(n\) segitiga.`,
          tx`Menghitung luas jaring-jaring sama dengan menghitung luas permukaan (dipakai pada bab berikutnya).`,
        ]}
      />
    </>
  );
}
