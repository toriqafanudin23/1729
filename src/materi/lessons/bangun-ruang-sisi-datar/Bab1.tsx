import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, H2, Konsep, MB, P, Pemantik, Rangkuman, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { UnsurLab, type UnsurState } from "../../labs/ruang/UnsurLab";

export default function Bab1() {
  return (
    <>
      <Pemantik title="Dari kardus sampai piramida">
        <P>{tx`Kardus mi instan, tenda pramuka, atap rumah, dan piramida di Mesir tampak berbeda, tetapi semuanya dibatasi oleh <b>bidang-bidang datar</b>. Bagaimana kita membicarakan bentuk-bentuk ini dengan tepat? Kita perlu nama untuk bagian-bagiannya.`}</P>
      </Pemantik>

      <H2>Sisi, rusuk, dan titik sudut</H2>
      <Konsep title="Unsur bangun ruang sisi datar">
        <P>{tx`<b>Sisi</b> adalah bidang datar yang membatasi bangun. <b>Rusuk</b> adalah garis pertemuan dua sisi. <b>Titik sudut</b> adalah titik pertemuan beberapa rusuk.`}</P>
      </Konsep>
      <P>{tx`Pada peragaan berikut, putar bangunnya dengan menggeser mendatar, lalu pilih sisi, rusuk, atau titik sudut untuk menyorotnya. Perhatikan pula angka s, r, dan t di bawahnya.`}</P>

      <UnsurLab />

      <Ask id="b1-limas6" />

      <H2>Prisma dan limas</H2>
      <P>{tx`Hampir semua bangun pada peragaan tadi termasuk salah satu dari dua keluarga: <b>prisma</b> atau <b>limas</b>. Keluarga ditentukan oleh cara sisi-sisinya tersusun, sedangkan nama lengkapnya diambil dari bentuk alas.`}</P>
      <Tabel
        caption="Prisma dan limas segi-n"
        head={["", "Prisma segi-n", "Limas segi-n"]}
        rows={[
          ["Alas", tx`2 bidang segi-\(n\) yang sejajar dan kongruen (alas dan tutup)`, tx`1 bidang segi-\(n\)`],
          ["Sisi tegak", tx`\(n\) persegi panjang (prisma tegak)`, tx`\(n\) segitiga yang bertemu di satu titik puncak`],
          ["Sisi (s)", tx`\(n+2\)`, tx`\(n+1\)`],
          ["Rusuk (r)", tx`\(3n\)`, tx`\(2n\)`],
          ["Titik sudut (t)", tx`\(2n\)`, tx`\(n+1\)`],
        ]}
      />
      <Awas title="Kubus dan balok juga prisma">
        <P>{tx`Kubus dan balok adalah prisma segiempat dengan alas persegi atau persegi panjang. Kubus adalah balok yang semua rusuknya sama panjang. Karena itu rumus untuk prisma nanti juga berlaku bagi keduanya.`}</P>
      </Awas>

      <Ask id="b1-pernyataan" />
      <Ask id="b1-nama" />

      <H2>Hubungan sisi, rusuk, dan titik sudut</H2>
      <P>{tx`Coba jumlahkan titik sudut dan sisi pada tiap bangun, lalu kurangi dengan banyak rusuknya. Hasilnya selalu sama. Lihat baris "Rumus Euler" pada peragaan: apa yang kamu temukan?`}</P>
      <Konsep title="Rumus Euler">
        <MB>{tx`t+s-r=2`}</MB>
        <P>{tx`Berlaku untuk bangun ruang sisi datar yang cembung (tidak ada bagian yang menjorok ke dalam), seperti semua bangun pada bab ini. Rumus ini berguna untuk memeriksa hitunganmu atau mencari unsur yang belum diketahui.`}</P>
      </Konsep>

      <Ask id="b1-euler" />
      <Ask id="b1-titik" />

      <Challenge<UnsurState> id="b1-ch1" check={(s) => s.shape === "prisma-segitiga"}>
        {(report) => <UnsurLab onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Bangun ruang sisi datar dibatasi sisi (bidang), rusuk (pertemuan sisi), dan titik sudut (pertemuan rusuk).`,
          tx`Prisma segi-\(n\): \(s=n+2\), \(r=3n\), \(t=2n\). Limas segi-\(n\): \(s=n+1\), \(r=2n\), \(t=n+1\).`,
          tx`Kubus dan balok adalah prisma segiempat khusus.`,
          tx`Rumus Euler: \(t+s-r=2\).`,
        ]}
      />
    </>
  );
}
