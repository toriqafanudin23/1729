import { Link } from "react-router-dom";
import { Ask } from "../../components/Checkpoint";
import { HasilAkhir } from "../../components/HasilAkhir";
import { Daftar, H2, Konsep, P, Pemantik, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { GabunganLab } from "../../labs/ruang/GabunganLab";
import { PrismaLab } from "../../labs/ruang/PrismaLab";
import { findMateri } from "../../materi.ts";

export default function Bab8() {
  const tautan = findMateri("bangun-ruang-sisi-datar")?.tautan ?? {};
  return (
    <>
      <Pemantik title="Bangun di sekitarmu jarang tunggal">
        <P>{tx`Menara, rumah, dan tenda biasanya terdiri dari beberapa bangun yang digabung. Kuncinya sama untuk semua: <b>pecah menjadi bangun yang sudah kamu kenal</b>, hitung bagian-bagiannya, lalu gabungkan dengan hati-hati.`}</P>
      </Pemantik>

      <Konsep title="Langkah menyelesaikan masalah bangun ruang">
        <Daftar
          ordered
          items={[
            tx`<b>Gambar</b> bangunnya dan tandai ukuran yang diketahui.`,
            tx`<b>Pecah</b> menjadi balok, kubus, prisma, atau limas.`,
            tx`<b>Tentukan ukuran yang belum ada</b> (sisi miring, tinggi sisi tegak, atau diagonal) dengan Pythagoras.`,
            tx`<b>Hitung</b>: untuk volume, jumlahkan volume bagian; untuk luas permukaan, jumlahkan hanya bidang yang <i>terlihat dari luar</i>.`,
            tx`<b>Tafsirkan</b> hasilnya dan periksa satuannya.`,
          ]}
        />
      </Konsep>

      <H2>Bangun gabungan: menara</H2>
      <P>{tx`Sebuah menara terdiri dari balok dan limas di atasnya. Perhatikan bidang tempat keduanya menempel: bidang itu berada di dalam, sehingga <b>tidak termasuk</b> luas permukaan gabungan. Volume tetap dijumlahkan seluruhnya.`}</P>

      <GabunganLab />

      <Ask id="b8-gabung-luas" />
      <Ask id="b8-gabung-volume" />

      <H2>Penerapan: tenda</H2>
      <P>{tx`Tenda pramuka berbentuk prisma segitiga sama kaki. Atur ukuran pada peragaan (alas segitiga 6, tinggi segitiga 4, panjang tenda 8), lalu hitung kain yang dibutuhkan untuk dinding dan atapnya.`}</P>

      <PrismaLab types={["samakaki"]} initialType="samakaki" />

      <Ask id="b8-tenda" />

      <H2>Rangkuman rumus</H2>
      <Tabel
        caption="Rumus bangun ruang sisi datar"
        head={["Bangun", "Luas permukaan", "Volume"]}
        rows={[
          ["Kubus", tx`\(6s^{2}\)`, tx`\(s^{3}\)`],
          ["Balok", tx`\(2(pl+pt+lt)\)`, tx`\(p\cdot l\cdot t\)`],
          ["Prisma", tx`\(2L_{a}+K_{a}\cdot H\)`, tx`\(L_{a}\cdot H\)`],
          ["Limas", tx`\(L_{a}+\text{jumlah luas sisi tegak}\)`, tx`\(\tfrac13\cdot L_{a}\cdot t\)`],
          ["Diagonal balok", tx`sisi: \(\sqrt{p^{2}+l^{2}}\)`, tx`ruang: \(\sqrt{p^{2}+l^{2}+t^{2}}\)`],
          ["Rumus Euler", tx`\(t+s-r=2\)`, tx`prisma segi-\(n\): \(s=n+2,\ r=3n,\ t=2n\)`],
        ]}
      />

      <H2>Cek akhir</H2>
      <P>{tx`Kerjakan keenam soal berikut tanpa membuka peragaan. Setelah itu lihat ringkasan hasil belajarmu.`}</P>
      <Ask id="b8-akhir-kubus" />
      <Ask id="b8-akhir-diagonal" />
      <Ask id="b8-akhir-prisma" />
      <Ask id="b8-akhir-limas" />
      <Ask id="b8-akhir-sisi" />
      <Ask id="b8-akhir-akuarium" />

      <HasilAkhir />

      <H2>Langkah selanjutnya</H2>
      <ul className="mt-next">
        {tautan.simulasi && (
          <li>
            <Link to={`/simulasi/${tautan.simulasi}`}>Simulasi bangun ruang sisi datar</Link>
            <span>Jelajahi model 3D bangun ruang secara bebas.</span>
          </li>
        )}
        {tautan.slides && (
          <li>
            <Link to={`/slides/${tautan.slides}`}>Slide bangun ruang sisi datar</Link>
            <span>Presentasi interaktif untuk mengulang atau mengajarkan kembali.</span>
          </li>
        )}
        <li>
          <Link to="/materi">Materi lainnya</Link>
          <span>Kembali ke katalog materi.</span>
        </li>
      </ul>
    </>
  );
}
