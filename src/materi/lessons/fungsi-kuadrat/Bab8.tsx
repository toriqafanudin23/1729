import { Link } from "react-router-dom";
import { Ask } from "../../components/Checkpoint";
import { HasilAkhir } from "../../components/HasilAkhir";
import { H2, Konsep, MB, P, Pemantik, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { findMateri } from "../../materi.ts";

export default function Bab8() {
  const tautan = findMateri("fungsi-kuadrat")?.tautan ?? {};
  return (
    <>
      <Pemantik title="Merangkum perjalanan">
        <P>{tx`Kamu sudah mengenal fungsi kuadrat, membaca parabola dari koefisiennya, mencari akar dan puncak, menyusun fungsi, dan memakainya untuk memecahkan masalah. Bab ini merangkum semuanya, lalu menguji pemahamanmu dengan enam soal campuran.`}</P>
      </Pemantik>

      <H2>Ringkasan rumus</H2>
      <Tabel
        caption="Rumus penting fungsi kuadrat"
        head={["Hal yang dicari", "Rumus atau cara"]}
        rows={[
          ["Bentuk umum", tx`\(f(x)=ax^{2}+bx+c,\ a\neq0\)`],
          ["Arah buka", tx`\(a>0\) ke atas; \(a<0\) ke bawah`],
          ["Titik potong sumbu y", tx`\((0,c)\)`],
          ["Diskriminan", tx`\(D=b^{2}-4ac\)`],
          ["Akar", tx`\(x=\dfrac{-b\pm\sqrt{D}}{2a}\) atau faktorisasi`],
          ["Banyak akar", tx`\(D>0\): dua; \(D=0\): satu; \(D<0\): tidak ada`],
          ["Sumbu simetri", tx`\(x=-\dfrac{b}{2a}\)`],
          ["Titik puncak", tx`\(\left(-\dfrac{b}{2a},\,-\dfrac{D}{4a}\right)\)`],
          ["Bentuk puncak", tx`\(a(x-p)^{2}+q\), puncak \((p,q)\)`],
          ["Bentuk faktor", tx`\(a(x-x_1)(x-x_2)\)`],
        ]}
      />

      <Konsep title="Alur berpikir saat menghadapi soal">
        <MB>{tx`\text{informasi}\;\rightarrow\;\text{pilih bentuk}\;\rightarrow\;\text{hitung}\;\rightarrow\;\text{tafsirkan}`}</MB>
        <P>{tx`Pilih bentuk fungsi yang paling dekat dengan informasi yang diberikan: akar (bentuk faktor), puncak (bentuk puncak), atau titik sembarang (bentuk umum). Setelah mendapat hasil, periksa kembali dengan satu titik yang diketahui.`}</P>
      </Konsep>

      <H2>Cek akhir</H2>
      <P>{tx`Kerjakan keenam soal berikut tanpa bantuan simulasi. Setelah itu lihat ringkasan hasil belajarmu.`}</P>
      <Ask id="b8-akar" />
      <Ask id="b8-puncak" />
      <Ask id="b8-diskriminan" />
      <Ask id="b8-posisi" />
      <Ask id="b8-susun" />
      <Ask id="b8-model" />

      <HasilAkhir />

      <H2>Langkah selanjutnya</H2>
      <ul className="mt-next">
        {tautan.latihan && (
          <li>
            <Link to={`/latihan/${tautan.latihan}`}>Latihan soal fungsi kuadrat</Link>
            <span>Soal berjenjang dari mudah sampai HOTS dengan pembahasan.</span>
          </li>
        )}
        {tautan.simulasi && (
          <li>
            <Link to={`/simulasi/${tautan.simulasi}`}>Simulasi fungsi kuadrat lengkap</Link>
            <span>Bereksperimen bebas dengan semua unsur parabola.</span>
          </li>
        )}
        {tautan.slides && (
          <li>
            <Link to={`/slides/${tautan.slides}`}>Slide fungsi kuadrat</Link>
            <span>Presentasi interaktif, berguna untuk mengulang atau mengajarkan kembali.</span>
          </li>
        )}
      </ul>
    </>
  );
}
