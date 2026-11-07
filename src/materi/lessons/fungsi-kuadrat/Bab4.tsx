import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Contoh, H2, Konsep, MB, P, Pemantik, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { ParabolaExplorer } from "../../labs/ParabolaExplorer";
import { VertexFormLab, type VertexState } from "../../labs/VertexFormLab";

export default function Bab4() {
  return (
    <>
      <Pemantik title="Titik tertinggi sebuah lemparan">
        <P>{tx`Di Bab 1, bola mencapai tinggi maksimum tepat di tengah dua waktu yang memberi tinggi sama. Kecenderungan simetri ini berlaku untuk semua parabola. Titik tertinggi (atau terendah) disebut <b>titik puncak</b>, dan di sanalah fungsi kuadrat mencapai nilai maksimum atau minimum.`}</P>
      </Pemantik>

      <H2>Sumbu simetri</H2>
      <P>{tx`Parabola simetris terhadap sebuah garis tegak yang melalui puncaknya: <b>sumbu simetri</b>. Jika parabola punya dua akar, sumbu simetri berada tepat di tengah keduanya. Atur simulasi sampai ada dua akar, lalu bandingkan posisi garis oranye dengan akar-akarnya.`}</P>

      <ParabolaExplorer
        title="Simulasi 4.1 · Sumbu simetri dan puncak"
        init={{ a: 1, b: -6, c: 5 }}
        controls={["a", "b", "c"]}
        features={["roots", "axis", "vertex"]}
        readouts={["akar", "sumbu", "puncak"]}
        box={[-5, 10, 9, -8]}
      />

      <Konsep title="Rumus sumbu simetri dan titik puncak">
        <P>{tx`Rata-rata kedua akar \(\dfrac{x_1+x_2}{2}\) sama dengan \(-\dfrac{b}{2a}\). Karena itu`}</P>
        <MB>{tx`x_p=-\frac{b}{2a},\qquad y_p=f(x_p)=-\frac{D}{4a}`}</MB>
        <P>{tx`Sumbu simetrinya garis \(x=x_p\) dan titik puncaknya \((x_p,\,y_p)\). Rumus ini berlaku juga saat parabola tidak memotong sumbu \(x\).`}</P>
      </Konsep>

      <Ask id="b4-sumbu" />
      <Ask id="b4-puncak1" />
      <Ask id="b4-puncak2" />

      <H2>Bentuk puncak dan melengkapkan kuadrat</H2>
      <P>{tx`Ada bentuk lain yang langsung memperlihatkan titik puncak, yaitu`}</P>
      <MB>{tx`f(x)=a(x-p)^{2}+q\quad\Longrightarrow\quad\text{puncak }(p,\,q)`}</MB>
      <P>{tx`Pada simulasi berikut, geser \(p\) dan \(q\). Bentuk umum di bawahnya ikut berubah, sehingga kamu bisa melihat hubungan kedua bentuk itu.`}</P>

      <VertexFormLab />

      <Contoh title="Contoh 4.1 · Melengkapkan kuadrat" soal={tx`Ubah \(f(x)=x^{2}+8x+5\) ke bentuk \(a(x-p)^{2}+q\).`}>
        <P>{tx`Ambil setengah dari \(b=8\), yaitu 4, lalu kuadratkan: 16. Tambah dan kurangi 16:`}</P>
        <MB>{tx`x^{2}+8x+5=(x^{2}+8x+16)-16+5=(x+4)^{2}-11`}</MB>
        <P>{tx`Jadi \(p=-4\) dan \(q=-11\): titik puncak \((-4,-11)\). Cocokkan dengan rumus: \(x_p=-\dfrac{8}{2}=-4\) dan \(f(-4)=16-32+5=-11\).`}</P>
      </Contoh>

      <Awas title="Hati-hati dengan tanda p">
        <P>{tx`Pada \(a(x-p)^{2}+q\), bentuk \((x+4)^{2}\) berarti \(p=-4\), bukan 4. Titik puncaknya \((-4,\,q)\). Cek dengan simulasi: geser \(p\) ke \(-4\) dan lihat faktornya menjadi \((x+4)\).`}</P>
      </Awas>

      <Ask id="b4-bentuk" />

      <H2>Nilai maksimum dan minimum</H2>
      <Konsep title="Nilai ekstrem">
        <P>{tx`Nilai \(y_p\) adalah nilai ekstrem fungsi. Jika \(a>0\), parabola membuka ke atas dan \(y_p\) adalah <b>nilai minimum</b>. Jika \(a<0\), \(y_p\) adalah <b>nilai maksimum</b>. Nilai ini dicapai saat \(x=x_p\).`}</P>
      </Konsep>

      <Ask id="b4-ekstrem" />

      <Challenge<VertexState> id="b4-ch1" check={(s) => s.a < 0 && s.p === -2 && s.q === 3}>
        {(report) => <VertexFormLab onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Sumbu simetri: \(x=-\dfrac{b}{2a}\), tepat di tengah kedua akar bila ada.`,
          tx`Titik puncak: \(\left(-\dfrac{b}{2a},\,f\!\left(-\dfrac{b}{2a}\right)\right)\).`,
          tx`Bentuk puncak \(a(x-p)^{2}+q\) mempunyai titik puncak \((p,q)\); diperoleh dengan melengkapkan kuadrat.`,
          tx`\(a>0\) memberi nilai minimum \(y_p\); \(a<0\) memberi nilai maksimum \(y_p\).`,
        ]}
      />
    </>
  );
}
