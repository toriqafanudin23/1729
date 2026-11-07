import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Contoh, H2, H3, Konsep, MB, P, Pemantik, Rangkuman, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { FactorLab } from "../../labs/FactorLab";
import { ParabolaExplorer, type ParabolaState } from "../../labs/ParabolaExplorer";

export default function Bab3() {
  return (
    <>
      <Pemantik title="Kapan bola mendarat?">
        <P>{tx`Di Bab 1, tinggi bola adalah \(h(t)=20t-5t^{2}\). Bola berada di tanah ketika \(h(t)=0\). Mencari nilai \(x\) yang membuat \(f(x)=0\) berarti mencari titik potong grafik dengan sumbu \(x\). Nilai-nilai itu disebut <b>akar</b>.`}</P>
      </Pemantik>

      <Konsep title="Akar fungsi kuadrat">
        <P>{tx`Akar-akar \(f(x)=ax^{2}+bx+c\) adalah penyelesaian <b>persamaan kuadrat</b> \(ax^{2}+bx+c=0\). Secara grafik, akar adalah absis titik potong parabola dengan sumbu \(x\).`}</P>
      </Konsep>
      <Ask id="b3-bola" />

      <H2>Cara 1: faktorisasi</H2>
      <P>{tx`Jika persamaan dapat ditulis sebagai perkalian dua faktor yang hasilnya nol, maka salah satu faktor pasti nol. Pada simulasi, grafik \(f(x)=(x-p)(x-q)\) memotong sumbu \(x\) di \(p\) dan \(q\). Jabarkan bentuknya dan temukan polanya.`}</P>

      <FactorLab />

      <Konsep title="Hubungan akar dan koefisien (untuk a = 1)">
        <MB>{tx`(x-p)(x-q)=x^{2}-(p+q)x+pq`}</MB>
        <P>{tx`Jadi, untuk memfaktorkan \(x^{2}+bx+c\), cari dua bilangan yang <b>jumlahnya \(b\)</b> dan <b>hasil kalinya \(c\)</b>. Bilangan itu adalah \(-p\) dan \(-q\) pada faktor \((x-p)(x-q)\).`}</P>
      </Konsep>

      <Awas title="Tanda pada faktor dan akar berlawanan">
        <P>{tx`Faktor \((x-2)\) bernilai nol saat \(x=2\), sedangkan faktor \((x+3)\) bernilai nol saat \(x=-3\). Akar selalu berlawanan tanda dengan bilangan di dalam faktornya.`}</P>
      </Awas>

      <Ask id="b3-faktor1" />
      <Ask id="b3-ekspansi" />

      <H2>Cara 2: rumus kuadrat</H2>
      <P>{tx`Tidak semua persamaan mudah difaktorkan, misalnya \(x^{2}-4x+1=0\). Untuk itu ada rumus yang berlaku bagi semua persamaan kuadrat. Rumus ini diperoleh dengan melengkapkan kuadrat pada bentuk umum; langkahnya akan kamu lihat di Bab 4.`}</P>
      <Konsep title="Rumus kuadrat (rumus abc)">
        <MB>{tx`x_{1,2}=\frac{-b\pm\sqrt{b^{2}-4ac}}{2a}`}</MB>
        <P>{tx`Bilangan di bawah akar, \(D=b^{2}-4ac\), disebut <b>diskriminan</b>.`}</P>
      </Konsep>

      <Contoh title="Contoh 3.1" soal={tx`Selesaikan \(x^{2}-4x+1=0\).`}>
        <P>{tx`\(a=1\), \(b=-4\), \(c=1\). Maka \(D=(-4)^{2}-4(1)(1)=12\).`}</P>
        <MB>{tx`x=\frac{4\pm\sqrt{12}}{2}=\frac{4\pm2\sqrt{3}}{2}=2\pm\sqrt{3}`}</MB>
        <P>{tx`Akarnya \(x=2+\sqrt3\approx3{,}73\) dan \(x=2-\sqrt3\approx0{,}27\). Persamaan ini tidak bisa difaktorkan dengan bilangan bulat, tetapi rumus kuadrat tetap bekerja.`}</P>
      </Contoh>

      <Ask id="b3-rumus" />

      <H2>Diskriminan: membaca banyaknya akar</H2>
      <P>{tx`Nilai \(D\) menentukan apakah akar bisa dihitung (karena ada \(\sqrt{D}\)). Atur koefisien pada simulasi dan amati hubungan nilai \(D\) dengan banyaknya titik potong.`}</P>

      <ParabolaExplorer
        title="Simulasi 3.2 · Diskriminan"
        hint="Cari kombinasi yang membuat D tepat 0, lalu geser sedikit ke kedua arah."
        init={{ a: 1, b: -2, c: -3 }}
        controls={["a", "b", "c"]}
        features={["roots", "vertex"]}
        readouts={["diskriminan", "akar"]}
      />

      <Tabel
        caption="Diskriminan dan posisi grafik terhadap sumbu x"
        head={["Nilai D", "Banyak akar real", "Posisi grafik"]}
        rows={[
          [tx`\(D>0\)`, "Dua akar berbeda", "Memotong sumbu x di dua titik"],
          [tx`\(D=0\)`, "Satu akar (kembar)", "Menyinggung sumbu x"],
          [tx`\(D<0\)`, "Tidak ada akar real", "Tidak menyentuh sumbu x"],
        ]}
      />

      <Ask id="b3-diskr" />
      <Ask id="b3-nilai-c" />

      <H3>Tantangan</H3>
      <Challenge<ParabolaState> id="b3-ch1" check={(s) => s.a !== 0 && s.b * s.b - 4 * s.a * s.c === 0}>
        {(report) => (
          <ParabolaExplorer title="Tantangan 3.1" init={{ a: 1, b: 0, c: 1 }} controls={["a", "b", "c"]} features={["roots", "vertex"]} readouts={["diskriminan", "akar"]} onChange={report} />
        )}
      </Challenge>

      <Rangkuman
        items={[
          tx`Akar fungsi kuadrat adalah penyelesaian \(ax^{2}+bx+c=0\) sekaligus absis titik potong dengan sumbu \(x\).`,
          tx`Faktorisasi: cari dua bilangan berjumlah \(b\) dan berhasil kali \(c\) (untuk \(a=1\)).`,
          tx`Rumus kuadrat: \(x=\dfrac{-b\pm\sqrt{D}}{2a}\) dengan \(D=b^{2}-4ac\).`,
          tx`\(D>0\): dua akar; \(D=0\): satu akar; \(D<0\): tidak ada akar real.`,
        ]}
      />
    </>
  );
}
