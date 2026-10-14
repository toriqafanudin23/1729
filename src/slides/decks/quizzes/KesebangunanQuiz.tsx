import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const raw = String.raw;

// Bank soal dipisah dari susunan slide agar konten kuis mudah dirawat.
export const QUIZ: QItem[] = [
  {
    q: <>Dua bangun datar yang kongruen pasti ....</>,
    opts: ["sama bentuk saja", "sama ukuran saja", "sama bentuk dan sama ukuran", "sebangun dengan skala k ≠ 1", "memiliki luas berbeda"], ans: 2,
    why: <>Kongruen berarti <b>sama persis</b>: bentuk dan ukuran sama, sehingga bisa saling menimpa (boleh digeser, diputar, atau dicerminkan).</>,
  },
  {
    q: <>Pada ΔABC dan ΔPQR diketahui AB = PQ = 5, BC = QR = 7, dan ∠B = ∠Q = 40°. Kekongruenan itu menggunakan syarat ....</>,
    opts: ["sisi–sisi–sisi", "sisi–sudut–sisi", "sudut–sisi–sudut", "sudut–sudut–sisi", "sisi–sisi–sudut"], ans: 1,
    why: <>Dua sisi dan <b>sudut yang diapit</b> (∠B diapit AB dan BC) sama: sisi–sudut–sisi.</>,
  },
  {
    q: <>ΔABC ≅ ΔDEF dengan ∠A = 50° dan ∠B = 60°. Besar ∠F adalah ....</>,
    opts: ["50°", "60°", "70°", "80°", "110°"], ans: 2,
    why: <>∠C = 180° − 50° − 60° = 70°. Pasangan C adalah F (urutan huruf), jadi ∠F = 70°.</>,
  },
  {
    q: <>Pada jajargenjang ABCD, diagonal AC membentuk ΔABC dan ΔCDA. Keduanya kongruen karena ....</>,
    opts: ["ketiga sudutnya sama", "ketiga pasang sisinya sama (AB = CD, BC = DA, AC = CA)", "hanya dua sisinya sama", "luasnya sama", "keduanya segitiga siku-siku"], ans: 1,
    why: <>Sisi berhadapan jajargenjang sama panjang, dan AC dipakai bersama: sisi–sisi–sisi.</>,
  },
  {
    q: <>ΔABC ∼ ΔPQR dengan AB = 6, PQ = 9, dan AC = 10. Panjang PR adalah ....</>,
    opts: ["12", "13", "14", "15", "16"], ans: 3,
    why: <>{tex(raw`\tfrac{PR}{AC}=\tfrac{PQ}{AB}=\tfrac96=\tfrac32`)}, jadi PR = 10 × 1,5 = 15.</>,
  },
  {
    q: <>Segitiga bersisi 4, 6, 8 sebangun dengan segitiga bersisi 6, 9, x. Nilai x adalah ....</>,
    opts: ["10", "11", "12", "13", "14"], ans: 2,
    why: <>Skala {tex(raw`\tfrac64=\tfrac96=1{,}5`)}, sehingga x = 8 × 1,5 = 12.</>,
  },
  {
    q: <>Pada peta berskala 1 : 250.000, jarak dua kota di peta 38 cm. Jarak sebenarnya adalah ....</>,
    opts: ["9,5 km", "38 km", "95 km", "950 km", "9.500 km"], ans: 2,
    why: <>38 × 250.000 = 9.500.000 cm = 95.000 m = 95 km.</>,
  },
  {
    q: <>Persegi panjang berukuran 8 × 6 sebangun dengan persegi panjang 12 × x. Nilai x adalah ....</>,
    opts: ["7", "8", "9", "10", "12"], ans: 2,
    why: <>{tex(raw`\tfrac{12}{8}=\tfrac x6\Rightarrow x=9`)}. Sudutnya sama-sama 90°, jadi cukup sisinya yang sebanding.</>,
  },
  {
    q: <>ΔABC siku-siku di C, CD tegak lurus AB, AD = 4 dan DB = 9. Panjang CD adalah ....</>,
    opts: ["5", "6", "6,5", "7", "36"], ans: 1,
    why: <>{tex(raw`CD^2=AD\cdot DB=4\cdot 9=36`)}, jadi CD = 6. (36 adalah CD², bukan CD.)</>,
  },
  {
    q: <>Pada soal yang sama (AD = 4, DB = 9), panjang AC adalah ....</>,
    opts: [raw`\sqrt{13}`, raw`2\sqrt{13}`, raw`3\sqrt{13}`, raw`4\sqrt{13}`, "13"], ans: 1,
    why: <>{tex(raw`AC^2=AD\cdot AB=4\cdot13=52`)}, jadi {tex(raw`AC=2\sqrt{13}`)}. Cek: {tex(raw`AC^2+BC^2=52+117=169=13^2`)}.</>,
  },
  {
    q: <>Tiang setinggi 2 m berbayangan 3 m. Pada saat yang sama sebuah gedung berbayangan 45 m. Tinggi gedung adalah ....</>,
    opts: ["25 m", "30 m", "35 m", "60 m", "67,5 m"], ans: 1,
    why: <>{tex(raw`\tfrac{t}{45}=\tfrac23\Rightarrow t=30`)} m. Sinar matahari sejajar, jadi segitiganya sebangun.</>,
  },
  {
    q: <>ΔABC ∼ ΔPQR dengan perbandingan sisi 1 : 3. Jika luas ΔABC = 12 cm², luas ΔPQR adalah ....</>,
    opts: ["36 cm²", "72 cm²", "108 cm²", "144 cm²", "324 cm²"], ans: 2,
    why: <>Luas berbanding <b>kuadrat</b> skala: 12 × 3² = 108 cm².</>,
  },
  {
    q: <>Pada ΔABC, titik D di CA dan E di CB dengan DE ∥ AB. Jika CD = 6, DA = 3, dan DE = 8, panjang AB adalah ....</>,
    opts: ["10", "11", "12", "13", "14"], ans: 2,
    why: <>ΔCDE ∼ ΔCAB, CA = 9: {tex(raw`\tfrac{AB}{DE}=\tfrac{CA}{CD}=\tfrac96`)}, jadi AB = 8 × 1,5 = 12.</>,
  },
];
