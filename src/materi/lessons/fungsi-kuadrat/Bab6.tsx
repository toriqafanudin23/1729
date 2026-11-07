import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Contoh, H2, Konsep, MB, P, Pemantik, Rangkuman, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { FitLab } from "../../labs/FitLab";
import type { ParabolaState } from "../../labs/ParabolaExplorer";

export default function Bab6() {
  return (
    <>
      <Pemantik title="Dari informasi menjadi rumus">
        <P>{tx`Sejauh ini rumus diberikan dan kita mencari grafiknya. Di bab ini arahnya dibalik: dari ciri grafik yang diketahui, kita menyusun rumus fungsinya. Karena ada tiga koefisien yang tak diketahui, diperlukan tiga informasi. Informasi itu dapat berupa dua akar dan satu titik, titik puncak dan satu titik, atau tiga titik.`}</P>
      </Pemantik>

      <Tabel
        caption="Memilih bentuk yang tepat"
        head={["Yang diketahui", "Mulai dari bentuk", "Cari"]}
        rows={[
          [tx`Dua akar \(x_1,x_2\) dan satu titik lain`, tx`\(a(x-x_1)(x-x_2)\)`, tx`\(a\)`],
          [tx`Titik puncak \((p,q)\) dan satu titik lain`, tx`\(a(x-p)^{2}+q\)`, tx`\(a\)`],
          [tx`Tiga titik sembarang`, tx`\(ax^{2}+bx+c\)`, tx`\(a,b,c\)`],
        ]}
      />

      <H2>Diketahui dua akar dan satu titik</H2>
      <P>{tx`Parabola memotong sumbu \(x\) di \(x=1\) dan \(x=5\), dan melalui titik \(T(0,10)\). Geser \(a\) sampai titik \(T\) berubah hijau (artinya parabola melewatinya).`}</P>

      <FitLab title="Simulasi 6.1 · Dua akar dan satu titik" mode={{ kind: "faktor", p: 1, q: 5, point: [0, 10] }} box={[-3, 14, 8, -6]} />

      <Konsep title="Bentuk faktor">
        <MB>{tx`f(x)=a(x-x_1)(x-x_2)`}</MB>
        <P>{tx`Gantikan koordinat titik yang diketahui untuk mendapatkan \(a\).`}</P>
      </Konsep>
      <Ask id="b6-a" />

      <H2>Diketahui titik puncak dan satu titik</H2>
      <P>{tx`Titik puncak \((1,4)\) sudah diketahui (titik emas), dan parabola melalui \(T(3,0)\). Atur \(a\) sampai \(T\) berwarna hijau.`}</P>

      <FitLab title="Simulasi 6.2 · Titik puncak dan satu titik" mode={{ kind: "puncak", p: 1, q: 4, point: [3, 0] }} box={[-4, 8, 8, -6]} />

      <Contoh title="Contoh 6.1" soal={tx`Parabola berpuncak di \((2,-8)\) dan melalui titik asal \((0,0)\). Tentukan fungsinya.`}>
        <P>{tx`Bentuk puncak: \(f(x)=a(x-2)^{2}-8\). Titik \((0,0)\): \(0=a(4)-8\Rightarrow a=2\).`}</P>
        <MB>{tx`f(x)=2(x-2)^{2}-8=2x^{2}-8x`}</MB>
      </Contoh>
      <Ask id="b6-b" />

      <H2>Diketahui tiga titik</H2>
      <P>{tx`Jika yang diketahui hanya tiga titik, kita memakai bentuk umum \(f(x)=ax^{2}+bx+c\). Setiap titik menghasilkan satu persamaan linear, sehingga terbentuk sistem tiga persamaan. Sebelum menghitung, coba dulu secara visual: atur \(a\), \(b\), \(c\) sampai ketiga titik hijau.`}</P>

      <Challenge<ParabolaState> id="b6-c" check={(s) => s.a === 1 && s.b === 2 && s.c === -3}>
        {(report) => <FitLab title="Tantangan 6.1 · Tiga titik" mode={{ kind: "bebas", points: [[0, -3], [1, 0], [2, 5]] }} box={[-5, 8, 5, -6]} onChange={report} />}
      </Challenge>

      <Awas title="Menebak lewat slider itu terbatas">
        <P>{tx`Slider hanya cocok untuk bilangan sederhana. Untuk titik sembarang, gunakan substitusi dan eliminasi seperti pada sistem persamaan linear. Strategi yang efisien: gunakan titik yang berabsis 0 lebih dulu, karena langsung memberikan \(c\).`}</P>
      </Awas>

      <Ask id="b6-konsep" />

      <Rangkuman
        items={[
          tx`Fungsi kuadrat memiliki tiga koefisien, sehingga membutuhkan tiga informasi bebas.`,
          tx`Dua akar + satu titik: \(f(x)=a(x-x_1)(x-x_2)\).`,
          tx`Puncak + satu titik: \(f(x)=a(x-p)^{2}+q\).`,
          tx`Tiga titik: bentuk umum dan sistem tiga persamaan linear.`,
        ]}
      />
    </>
  );
}
