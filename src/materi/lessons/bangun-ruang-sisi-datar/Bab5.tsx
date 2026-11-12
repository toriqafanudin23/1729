import { Ask, Challenge } from "../../components/Checkpoint";
import { Awas, Contoh, Daftar, H2, Konsep, MB, P, Pemantik, Rangkuman, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { DiagonalLab, type DiagonalState } from "../../labs/ruang/DiagonalLab";

export default function Bab5() {
  return (
    <>
      <Pemantik title="Tongkat terpanjang dalam sebuah kotak">
        <P>{tx`Kamu ingin menyimpan tongkat lurus di dalam kotak berbentuk balok. Tongkat tidak boleh dilipat. Berapa panjang maksimum tongkat yang masih muat? Jawabannya ada pada garis terpanjang di dalam balok, yaitu diagonal ruang.`}</P>
      </Pemantik>

      <Konsep title="Ingat kembali: teorema Pythagoras">
        <P>{tx`Pada segitiga siku-siku dengan sisi siku-siku \(a\) dan \(b\) serta sisi miring \(c\):`}</P>
        <MB>{tx`c^{2}=a^{2}+b^{2}`}</MB>
        <P>{tx`Semua diagonal pada balok dan kubus akhirnya dihitung dengan rumus ini, satu atau dua kali.`}</P>
      </Konsep>

      <H2>Tiga jenis diagonal</H2>
      <Daftar
        items={[
          tx`<b>Diagonal sisi</b> (biru): menghubungkan dua titik sudut yang berhadapan pada satu sisi.`,
          tx`<b>Diagonal ruang</b> (merah): menghubungkan dua titik sudut yang berhadapan melalui bagian dalam bangun.`,
          tx`<b>Bidang diagonal</b> (hijau): bidang yang dibentuk oleh dua rusuk yang sejajar dan dua diagonal sisi.`,
        ]}
      />

      <DiagonalLab />

      <Konsep title="Diagonal balok dan kubus">
        <Tabel
          head={["", "Balok \\(p\\times l\\times t\\)", "Kubus rusuk \\(s\\)"]}
          rows={[
            ["Diagonal sisi (alas)", tx`\(d=\sqrt{p^{2}+l^{2}}\)`, tx`\(d=s\sqrt{2}\)`],
            ["Diagonal ruang", tx`\(D=\sqrt{p^{2}+l^{2}+t^{2}}\)`, tx`\(D=s\sqrt{3}\)`],
            ["Bidang diagonal", tx`persegi panjang \(d\times t\)`, tx`persegi panjang \(s\sqrt{2}\times s\)`],
          ]}
        />
      </Konsep>

      <Ask id="b5-sisi" />
      <Ask id="b5-ruang" />

      <Contoh title="Contoh 5.1 · Mengapa diagonal ruang memakai tiga kuadrat?" soal={tx`Turunkan rumus diagonal ruang balok \(p\times l\times t\).`}>
        <P>{tx`Pada peragaan, segitiga merah muda siku-siku di titik di sudut atas: satu sisi sikunya diagonal alas \(d\), sisi siku lainnya rusuk tegak \(t\), sisi miringnya diagonal ruang \(D\).`}</P>
        <MB>{tx`D^{2}=d^{2}+t^{2}=(p^{2}+l^{2})+t^{2}`}</MB>
        <P>{tx`Jadi \(D=\sqrt{p^{2}+l^{2}+t^{2}}\). Pythagoras dipakai dua kali: pertama pada alas, lalu pada segitiga tegak.`}</P>
      </Contoh>

      <Ask id="b5-bidang" />
      <Ask id="b5-tongkat" />
      <Awas title="Jumlahkan kuadrat, bukan panjangnya">
        <P>{tx`Diagonal ruang balok \(2\times3\times6\) bukan \(2+3+6=11\), melainkan \(\sqrt{4+9+36}=7\). Selalu kuadratkan dulu, jumlahkan, baru diakarkan.`}</P>
      </Awas>
      <Ask id="b5-kubus" />

      <Challenge<DiagonalState> id="b5-ch1" check={(s) => s.sumSquares === 81}>
        {(report) => <DiagonalLab onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Diagonal sisi menghubungkan dua titik sudut berhadapan pada satu sisi; diagonal ruang menghubungkan dua titik sudut yang berhadapan melalui bagian dalam bangun.`,
          tx`Balok: \(d=\sqrt{p^{2}+l^{2}}\), \(D=\sqrt{p^{2}+l^{2}+t^{2}}\). Kubus: \(d=s\sqrt{2}\), \(D=s\sqrt{3}\).`,
          tx`Bidang diagonal berbentuk persegi panjang dengan sisi diagonal alas dan tinggi; luasnya \(d\times t\).`,
          tx`Benda lurus terpanjang yang muat dalam balok sepanjang diagonal ruangnya.`,
        ]}
      />
    </>
  );
}
