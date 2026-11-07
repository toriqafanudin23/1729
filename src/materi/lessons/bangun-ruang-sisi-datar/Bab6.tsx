import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Contoh, H2, Konsep, MB, P, Pemantik, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { PrismaLab, type PrismaState } from "../../labs/ruang/PrismaLab";

export default function Bab6() {
  return (
    <>
      <Pemantik title="Kemasan cokelat berbentuk segitiga">
        <P>{tx`Beberapa kemasan cokelat berbentuk prisma segitiga. Atap rumah dan tenda juga. Bentuknya seperti "tumpukan" alas yang sama, dari bawah sampai atas. Itulah gagasan <b>prisma</b>, dan ia menjelaskan mengapa rumus volumenya begitu mudah.`}</P>
      </Pemantik>

      <H2>Rumus prisma</H2>
      <Konsep title="Luas permukaan dan volume prisma tegak">
        <MB>{tx`V=L_{a}\times H`}</MB>
        <MB>{tx`L=2L_{a}+K_{a}\times H`}</MB>
        <P>{tx`\(L_{a}\) = luas alas, \(K_{a}\) = keliling alas, \(H\) = tinggi prisma (jarak alas ke tutup). Suku \(K_{a}\times H\) adalah luas <b>selimut</b>: seluruh sisi tegak jika dibuka berderet menjadi satu persegi panjang.`}</P>
      </Konsep>

      <P>{tx`Pada peragaan, alas dan tutup berwarna biru, sedangkan sisi tegak berwarna jingga. Ubah ukuran alas dan tinggi prisma, lalu buka jaring-jaringnya.`}</P>

      <PrismaLab />

      <Awas title="Dua “tinggi” yang berbeda">
        <P>{tx`Pada prisma segitiga ada tinggi <b>segitiga</b> (untuk menghitung luas alas) dan tinggi <b>prisma</b> \(H\) (jarak alas ke tutup). Jangan tertukar. Tinggi segitiga hanya dipakai di luas alas.`}</P>
      </Awas>

      <Contoh title="Contoh 6.1" soal={tx`Alas prisma tegak berbentuk segitiga siku-siku dengan sisi siku-siku 3 cm dan 4 cm. Tinggi prisma 10 cm. Hitung luas permukaan dan volumenya.`}>
        <P>{tx`Sisi miring alas \(=\sqrt{3^{2}+4^{2}}=5\) cm. Luas alas \(=\tfrac12\cdot3\cdot4=6\) cm². Keliling alas \(=3+4+5=12\) cm.`}</P>
        <MB>{tx`L=2(6)+12\cdot10=12+120=132\ \text{cm}^{2}`}</MB>
        <MB>{tx`V=6\cdot10=60\ \text{cm}^{3}`}</MB>
      </Contoh>

      <H2>Prisma segitiga siku-siku</H2>
      <P>{tx`Sekarang gunakan alas segitiga siku-siku dengan sisi siku-siku 6 cm dan 8 cm, tinggi prisma 10 cm (ukuran awal pada simulasi).`}</P>
      <Ask id="b6-luas" />
      <Ask id="b6-volume" />

      <H2>Alas trapesium</H2>
      <P>{tx`Pilih alas <b>trapesium sama kaki</b> pada simulasi. Sisi miringnya tidak diketahui langsung; cari dengan Pythagoras dari selisih sisi sejajar dan tinggi trapesium.`}</P>
      <Ask id="b6-trapesium" />
      <Ask id="b6-tinggi" />
      <Ask id="b6-konsep" />

      <Challenge<PrismaState> id="b6-ch1" check={(s) => s.type === "siku" && s.volume === 120}>
        {(report) => <PrismaLab types={["siku"]} onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Prisma tegak: \(V=L_{a}\times H\) dan \(L=2L_{a}+K_{a}\times H\).`,
          tx`\(K_{a}\times H\) adalah luas selimut, yaitu semua sisi tegak.`,
          tx`Bedakan tinggi alas (dipakai pada luas alas) dari tinggi prisma \(H\).`,
          tx`Untuk alas yang bukan persegi panjang, hitung dulu luas dan keliling alas, lalu masukkan ke rumus.`,
        ]}
      />
    </>
  );
}
