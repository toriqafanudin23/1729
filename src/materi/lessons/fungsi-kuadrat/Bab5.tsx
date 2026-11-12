import { Ask } from "../../components/Checkpoint";
import { Konsep, Daftar, H2, P, Pemantik, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { SketchLab } from "../../labs/SketchLab";

export default function Bab5() {
  return (
    <>
      <Pemantik title="Sketsa bukan gambar sempurna">
        <P>{tx`Sketsa grafik tidak perlu menghitung puluhan titik. Cukup temukan beberapa titik penting, lalu hubungkan dengan kurva yang mulus. Semua yang kamu pelajari di bab sebelumnya menjadi bahan sketsa.`}</P>
      </Pemantik>

      <H2>Lima langkah menggambar sketsa</H2>
      <Konsep title="Langkah kerja">
        <Daftar
          ordered
          items={[
            tx`<b>Arah buka</b> dari tanda \(a\).`,
            tx`<b>Titik potong sumbu \(y\)</b>: \((0,c)\).`,
            tx`<b>Titik potong sumbu \(x\)</b>: akar dari \(f(x)=0\) bila \(D\ge0\).`,
            tx`<b>Sumbu simetri dan titik puncak</b>: \(x=-\dfrac{b}{2a}\), lalu \(f(x_p)\).`,
            tx`<b>Titik cermin</b> dari titik yang sudah ada terhadap sumbu simetri, lalu hubungkan menjadi kurva mulus.`,
          ]}
        />
      </Konsep>

      <P>{tx`Jalankan langkah-langkah itu pada tiga fungsi berbeda: satu dengan dua akar, satu membuka ke bawah, dan satu yang tidak memotong sumbu \(x\). Tekan <b>Langkah berikutnya</b> dan cocokkan dengan hitunganmu sendiri.`}</P>

      <SketchLab />

      <H2>Sekarang giliranmu menghitung</H2>
      <P>{tx`Gunakan langkah di atas untuk fungsi \(f(x)=-x^{2}+4x-3\) (fungsi kedua pada simulasi).`}</P>
      <Ask id="b5-akar" />
      <Ask id="b5-puncak" />
      <Ask id="b5-cermin" />

      <H2>Membaca posisi grafik tanpa menggambar</H2>
      <P>{tx`Posisi grafik terhadap sumbu \(x\) dapat disimpulkan dari dua hal saja: tanda \(a\) dan nilai \(D\). Jika \(D<0\) dan \(a>0\), seluruh grafik di atas sumbu \(x\); jika \(D<0\) dan \(a<0\), seluruh grafik di bawahnya.`}</P>
      <Ask id="b5-posisi" />

      <Rangkuman
        items={[
          tx`Sketsa memuat: arah buka, titik potong sumbu \(y\) dan sumbu \(x\), sumbu simetri, titik puncak, dan titik cermin.`,
          tx`Titik cermin dari \((x_0,y_0)\) terhadap \(x=x_p\) adalah \((2x_p-x_0,\,y_0)\).`,
          tx`\(D<0\): grafik tidak menyentuh sumbu \(x\); \(a\) menentukan apakah di atas atau di bawah.`,
        ]}
      />
    </>
  );
}
