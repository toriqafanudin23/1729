import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Contoh, H2, Konsep, MB, P, Pemantik, Rangkuman } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { LimasKubusLab } from "../../labs/ruang/LimasKubusLab";
import { LimasLab, type LimasState } from "../../labs/ruang/LimasLab";

export default function Bab7() {
  return (
    <>
      <Pemantik title="Berapa kali lebih kecil limas dari prisma?">
        <P>{tx`Sebuah limas dan sebuah prisma dengan alas dan tinggi yang sama jelas tidak sama besar: limas meruncing ke atas. Tepatnya berapa kali lebih kecil? Jawabannya bisa dilihat langsung: tiga limas tertentu persis memenuhi satu kubus.`}</P>
      </Pemantik>

      <H2>Volume limas</H2>
      <LimasKubusLab />
      <P>{tx`Setiap limas pada peragaan beralas persegi seluas \(s\times s\) dan tingginya \(s\), sama dengan alas dan tinggi kubus. Tiga limas memenuhi satu kubus, sehingga satu limas bervolume sepertiga volume kubus tersebut.`}</P>
      <Konsep title="Volume limas">
        <MB>{tx`V=\frac{1}{3}\times L_{a}\times t`}</MB>
        <P>{tx`Berlaku untuk limas dengan alas berbentuk apa pun: volumenya sepertiga volume prisma yang alas dan tingginya sama.`}</P>
      </Konsep>
      <Ask id="b7-kubus" />

      <H2>Tinggi limas dan tinggi sisi tegak</H2>
      <P>{tx`Pada limas ada dua "tinggi" yang berbeda dan mudah tertukar. Pada peragaan berikut, garis merah adalah <b>tinggi limas</b> (tegak lurus alas) dan garis hijau adalah <b>tinggi sisi tegak</b> (tinggi segitiga pada sisi tegak, dari puncak ke tengah rusuk alas). Keduanya, bersama setengah sisi alas, membentuk segitiga siku-siku.`}</P>

      <LimasLab />

      <Awas title="Tinggi limas ≠ tinggi sisi tegak">
        <P>{tx`Tinggi limas \(t\) dipakai untuk <b>volume</b>. Tinggi sisi tegak \(s\) dipakai untuk <b>luas</b> segitiga sisi tegak. Hubungannya: \(s=\sqrt{t^{2}+\left(\tfrac{\text{sisi alas}}{2}\right)^{2}}\) pada limas beralas persegi.`}</P>
      </Awas>

      <Ask id="b7-volume" />
      <Ask id="b7-miring" />

      <H2>Luas permukaan limas</H2>
      <Konsep title="Luas permukaan limas">
        <MB>{tx`L=L_{\text{alas}}+\text{jumlah luas sisi tegak}`}</MB>
        <P>{tx`Pada limas beralas persegi dengan sisi \(a\) dan tinggi sisi tegak \(s\): \(L=a^{2}+4\cdot\tfrac12\cdot a\cdot s\).`}</P>
      </Konsep>
      <Contoh title="Contoh 7.1" soal={tx`Sebuah limas beralas persegi dengan sisi 16 cm dan tinggi limas 6 cm. Hitung luas permukaan dan volumenya.`}>
        <P>{tx`Setengah sisi alas \(=8\); tinggi sisi tegak \(s=\sqrt{6^{2}+8^{2}}=10\) cm.`}</P>
        <MB>{tx`L=16^{2}+4\cdot\tfrac12\cdot16\cdot10=256+320=576\ \text{cm}^{2}`}</MB>
        <MB>{tx`V=\tfrac13\cdot256\cdot6=512\ \text{cm}^{3}`}</MB>
      </Contoh>
      <Ask id="b7-luas" />
      <Ask id="b7-luas2" />

      <Challenge<LimasState> id="b7-ch1" check={(s) => s.volume === 100}>
        {(report) => <LimasLab onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Volume limas \(=\tfrac13\times L_{a}\times t\); tiga limas kongruen dapat disusun menjadi satu kubus.`,
          tx`Tinggi limas dipakai untuk volume; tinggi sisi tegak dipakai untuk luas sisi tegak.`,
          tx`Tinggi sisi tegak dicari dengan Pythagoras dari tinggi limas dan jarak pusat alas ke rusuk alas.`,
          tx`Luas permukaan limas \(=\) luas alas \(+\) jumlah luas sisi tegak (segitiga).`,
        ]}
      />
    </>
  );
}
