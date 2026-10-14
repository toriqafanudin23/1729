import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const raw = String.raw;

// Bank soal dipisah dari susunan slide agar konten kuis mudah dirawat.
export const QUIZ: QItem[] = [
  { q: <>Banyak sisi, rusuk, dan titik sudut balok berturut-turut adalah ....</>, opts: ["6, 12, 8", "6, 8, 12", "8, 12, 6", "4, 12, 8", "6, 12, 6"], ans: 0,
    why: <>Balok: 6 sisi, 12 rusuk, 8 titik sudut. Cek: {tex(raw`8-12+6=2`)}.</> },
  { q: <>Banyak rusuk pada prisma segitiga adalah ....</>, opts: ["6", "9", "12", "8", "5"], ans: 1,
    why: <>Tiga rusuk alas, tiga rusuk atas, dan tiga rusuk tegak: 9.</> },
  { q: <>Banyak rusuk pada limas segiempat adalah ....</>, opts: ["4", "5", "8", "12", "10"], ans: 2,
    why: <>Empat rusuk alas dan empat rusuk tegak: 8.</> },
  { q: <>Kerangka balok berukuran 12 cm × 8 cm × 5 cm dibuat dari kawat. Panjang kawat seluruhnya adalah ....</>, opts: ["100 cm", "60 cm", "50 cm", "200 cm", "480 cm"], ans: 0,
    why: <>{tex(raw`4(12+8+5)=100`)} cm.</> },
  { q: <>Banyak jaring-jaring kubus yang berbeda bentuknya adalah ....</>, opts: ["6", "8", "11", "12", "35"], ans: 2,
    why: <>Dari 35 susunan enam persegi, 11 yang dapat dilipat menjadi kubus.</> },
  { q: <>Luas permukaan kubus berrusuk 7 cm adalah ....</>, opts: ["196 cm²", "294 cm²", "343 cm²", "42 cm²", "147 cm²"], ans: 1,
    why: <>{tex(raw`6\times7^{2}=6\times49=294`)} cm².</> },
  { q: <>Luas permukaan balok berukuran 10 cm × 6 cm × 4 cm adalah ....</>, opts: ["124 cm²", "240 cm²", "248 cm²", "264 cm²", "480 cm²"], ans: 2,
    why: <>{tex(raw`2(60+40+24)=2\times124=248`)} cm².</> },
  { q: <>Susunan kubus satuan membentuk balok 5 × 4 × 3. Banyak kubus satuan yang diperlukan adalah ....</>, opts: ["12", "47", "60", "72", "20"], ans: 2,
    why: <>{tex(raw`5\times4\times3=60`)} kubus.</> },
  { q: <>Volume kubus 343 cm³. Panjang rusuknya adalah ....</>, opts: ["7 cm", "49 cm", "14 cm", "9 cm", "21 cm"], ans: 0,
    why: <>{tex(raw`s^{3}=343\Rightarrow s=7`)} cm, karena 7 × 7 × 7 = 343.</> },
  { q: <>Akuarium berukuran 50 cm × 30 cm × 40 cm diisi penuh. Banyak air adalah ....</>, opts: ["6 liter", "600 liter", "60 liter", "6.000 liter", "0,6 liter"], ans: 2,
    why: <>{tex(raw`50\times30\times40=60.000`)} cm³ = 60 dm³ = 60 liter.</> },
  { q: <>Alas prisma berbentuk segitiga siku-siku dengan sisi siku-siku 6 cm dan 8 cm. Tinggi prisma 12 cm. Volumenya adalah ....</>, opts: ["288 cm³", "576 cm³", "144 cm³", "480 cm³", "96 cm³"], ans: 0,
    why: <>{tex(raw`L_{alas}=\tfrac12\times6\times8=24`)}, jadi {tex(raw`V=24\times12=288`)} cm³.</> },
  { q: <>Alas prisma segitiga siku-siku bersisi 3 cm, 4 cm, 5 cm. Tinggi prisma 10 cm. Luas permukaannya adalah ....</>, opts: ["72 cm²", "132 cm²", "120 cm²", "252 cm²", "60 cm²"], ans: 1,
    why: <>{tex(raw`L=2\times6+(3+4+5)\times10=12+120=132`)} cm².</> },
  { q: <>Limas beralas persegi bersisi 12 cm dan tinggi 8 cm. Volumenya adalah ....</>, opts: ["384 cm³", "1.152 cm³", "96 cm³", "768 cm³", "192 cm³"], ans: 0,
    why: <>{tex(raw`V=\tfrac13\times144\times8=384`)} cm³.</> },
  { q: <>Limas beralas persegi bersisi 10 cm dan tinggi 12 cm. Luas permukaannya adalah ....</>, opts: ["360 cm²", "340 cm²", "460 cm²", "260 cm²", "520 cm²"], ans: 0,
    why: <>Tinggi sisi tegak {tex(raw`s=\sqrt{12^{2}+5^{2}}=13`)}. {tex(raw`L=100+4\times\tfrac12\times10\times13=360`)} cm².</> },
];
