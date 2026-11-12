import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Konsep, MB, P, Pemantik, H2, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { ParabolaExplorer, type ParabolaState } from "../../labs/ParabolaExplorer";

export default function Bab2() {
  return (
    <>
      <Pemantik title="Satu rumus, banyak bentuk">
        <P>{tx`Grafik fungsi kuadrat disebut <b>parabola</b>. Antena parabola, jembatan lengkung, dan pancuran air semuanya berbentuk seperti ini. Apa yang membedakan satu parabola dari parabola lain? Jawabannya ada pada tiga bilangan: \(a\), \(b\), dan \(c\).`}</P>
      </Pemantik>

      <H2>Peran koefisien a</H2>
      <P>{tx`Mulai dari yang paling sederhana, \(f(x)=ax^{2}\). Garis putus-putus abu-abu adalah parabola pembanding \(y=x^{2}\). Geser \(a\) ke nilai positif, negatif, besar, dan kecil.`}</P>

      <ParabolaExplorer
        title="Simulasi 2.1 · Pengaruh a"
        hint="Coba a = 0 untuk melihat apa yang terjadi saat fungsinya bukan lagi kuadrat."
        init={{ a: 1, b: 0, c: 0 }}
        controls={["a"]}
        features={["reference"]}
        readouts={["arah", "lebar"]}
        ranges={{ a: [-4, 4, 0.5] }}
      />

      <Konsep title="Pengaruh a">
        <P>{tx`Tanda \(a\) menentukan arah buka: \(a>0\) membuka ke atas, \(a<0\) membuka ke bawah. Nilai \(|a|\) menentukan kelebaran: makin besar \(|a|\), parabola makin sempit; makin dekat ke 0, makin lebar.`}</P>
      </Konsep>

      <Ask id="b2-pernyataan" />

      <H2>Peran konstanta c</H2>
      <P>{tx`Sekarang tambahkan \(c\). Titik hijau menandai tempat parabola memotong sumbu \(y\). Geser \(c\) dan perhatikan koordinat titik itu.`}</P>

      <ParabolaExplorer
        title="Simulasi 2.2 · Pengaruh c"
        init={{ a: 1, b: 0, c: 2 }}
        controls={["a", "c"]}
        features={["yIntercept"]}
        readouts={["titikY"]}
      />

      <Konsep title="Titik potong dengan sumbu y">
        <P>{tx`Pada sumbu \(y\), \(x=0\), sehingga \(f(0)=c\). Parabola selalu memotong sumbu \(y\) di titik`}</P>
        <MB>{tx`(0,\;c)`}</MB>
      </Konsep>

      <Ask id="b2-sumbu-y" />

      <H2>Peran koefisien b</H2>
      <P>{tx`Peran \(b\) paling halus. Atur \(a=1\) dan \(c=0\), lalu geser \(b\). Perhatikan garis putus-putus oranye (sumbu simetri) dan titik emas (titik puncak).`}</P>

      <ParabolaExplorer
        title="Simulasi 2.3 · Pengaruh b"
        hint="Parabola tidak bergeser sembarangan: ia selalu tetap melewati titik (0, c)."
        init={{ a: 1, b: 0, c: 0 }}
        controls={["a", "b", "c"]}
        features={["axis", "vertex", "yIntercept"]}
        readouts={["sumbu", "puncak"]}
      />

      <Awas title="b bukan sekadar menggeser ke samping">
        <P>{tx`Mengubah \(b\) menggeser puncak ke samping <i>dan</i> ke atas atau bawah sekaligus, karena puncak ada di \(\left(-\dfrac{b}{2a},\,f\!\left(-\dfrac{b}{2a}\right)\right)\). Rumus ini akan kita turunkan dan pakai di Bab 4.`}</P>
      </Awas>

      <Ask id="b2-b" />

      <H2>Tantangan: atur parabola sesuai syarat</H2>
      <P>{tx`Dua tantangan berikut tidak punya satu cara baku. Atur sendiri slidernya, lalu tekan <b>Periksa konfigurasi</b>.`}</P>

      <Challenge<ParabolaState> id="b2-ch1" check={(s) => s.a < 0 && Math.abs(s.a) < 1 && s.c === 5}>
        {(report) => <ParabolaExplorer title="Tantangan 2.1" init={{ a: 1, b: 0, c: 0 }} controls={["a", "b", "c"]} features={["reference", "yIntercept"]} readouts={["arah", "lebar", "titikY"]} ranges={{ a: [-2, 2, 0.5] }} onChange={report} />}
      </Challenge>

      <Challenge<ParabolaState> id="b2-ch2" check={(s) => s.a === 1 && s.b === -4 && s.c === -3}>
        {(report) => <ParabolaExplorer title="Tantangan 2.2" init={{ a: 1, b: 0, c: 0 }} controls={["b", "c"]} features={["axis", "yIntercept"]} readouts={["titikY", "sumbu"]} onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Grafik fungsi kuadrat berbentuk parabola.`,
          tx`\(a>0\): membuka ke atas; \(a<0\): membuka ke bawah. Makin besar \(|a|\), makin sempit.`,
          tx`Parabola memotong sumbu \(y\) di \((0,c)\).`,
          tx`\(b\) ikut menentukan posisi sumbu simetri dan titik puncak, bersama \(a\).`,
        ]}
      />
    </>
  );
}
