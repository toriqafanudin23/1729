import { Ask, Challenge } from "../../components/Checkpoint";
import { Contoh, H2, Konsep, MB, P, Pemantik, Rangkuman, Tabel } from "../../components/Blocks";
import { tx } from "../../lib/tx";
import { VolumeLab, type VolumeState } from "../../labs/ruang/VolumeLab";

export default function Bab4() {
  return (
    <>
      <Pemantik title="Berapa air yang muat di akuarium?">
        <P>{tx`Luas permukaan mengukur "kulit" sebuah bangun. Untuk mengetahui seberapa banyak yang dapat <i>diisi</i> ke dalamnya, kita memakai <b>volume</b>: berapa banyak kubus satuan yang memenuhi ruangnya.`}</P>
      </Pemantik>

      <H2>Menyusun kubus satuan</H2>
      <P>{tx`Satu kubus kecil berusuk 1 satuan bervolume 1 satuan kubus. Susunlah balok dari kubus-kubus itu: satu lapisan dulu, lalu lapisan demi lapisan. Geser slider lapisan dan hitung banyak kubusnya.`}</P>

      <VolumeLab />

      <Konsep title="Volume balok dan kubus">
        <MB>{tx`V_{\text{balok}}=p\times l\times t=L_{\text{alas}}\times t`}</MB>
        <MB>{tx`V_{\text{kubus}}=s\times s\times s=s^{3}`}</MB>
        <P>{tx`Alasnya \(p\times l\) kubus pada satu lapisan, dan ada \(t\) lapisan. Itulah alasan volume sama dengan <b>luas alas dikali tinggi</b>.`}</P>
      </Konsep>

      <Ask id="b4-balok" />
      <Ask id="b4-kubus" />
      <Ask id="b4-tinggi" />

      <H2>Volume dan kapasitas</H2>
      <P>{tx`Volume menyatakan ruang yang ditempati, sedangkan <b>kapasitas</b> menyatakan banyaknya zat cair yang dapat ditampung. Satuannya saling berkaitan.`}</P>
      <Tabel
        caption="Hubungan satuan volume dan kapasitas"
        head={["Volume", "Kapasitas"]}
        rows={[
          [tx`\(1\ \text{cm}^{3}\)`, tx`\(1\ \text{mL}\)`],
          [tx`\(1\ \text{dm}^{3}=1.000\ \text{cm}^{3}\)`, tx`\(1\ \text{liter}\)`],
          [tx`\(1\ \text{m}^{3}=1.000\ \text{dm}^{3}\)`, tx`\(1.000\ \text{liter}\)`],
        ]}
      />
      <Contoh title="Contoh 4.1" soal={tx`Sebuah kolam berbentuk balok berukuran \(4\ \text{m}\times3\ \text{m}\times1{,}5\ \text{m}\). Berapa liter air yang diperlukan untuk memenuhinya?`}>
        <P>{tx`\(V=4\times3\times1{,}5=18\ \text{m}^{3}\). Karena \(1\ \text{m}^{3}=1.000\) liter, kolam menampung \(18\times1.000=18.000\) liter.`}</P>
      </Contoh>
      <Ask id="b4-liter" />

      <H2>Jika ukuran berubah</H2>
      <P>{tx`Di bab sebelumnya, luas permukaan kubus menjadi 4 kali ketika rusuknya digandakan. Bagaimana dengan volumenya? Cobalah kubus 2×2×2 dan 4×4×4 pada simulasi.`}</P>
      <Ask id="b4-skala" />

      <Challenge<VolumeState> id="b4-ch1" check={(s) => s.volume === 36 && s.t === 3}>
        {(report) => <VolumeLab onChange={report} />}
      </Challenge>

      <Rangkuman
        items={[
          tx`Volume adalah banyaknya kubus satuan yang mengisi bangun.`,
          tx`Balok: \(V=p\times l\times t\). Kubus: \(V=s^{3}\). Secara umum untuk prisma: \(V=L_{\text{alas}}\times t\).`,
          tx`\(1\ \text{dm}^{3}=1\) liter \(=1.000\ \text{cm}^{3}\); \(1\ \text{m}^{3}=1.000\) liter.`,
          tx`Jika semua panjang diperbesar \(k\) kali, luas permukaan menjadi \(k^{2}\) kali dan volume menjadi \(k^{3}\) kali.`,
        ]}
      />
    </>
  );
}
