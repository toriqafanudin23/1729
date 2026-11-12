import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const raw = String.raw;

// Bank soal dipisah dari susunan slide agar konten kuis mudah dirawat.
export const QUIZ: QItem[] = [
  { q: <>Keliling lingkaran berdiameter 14 cm (π = 22/7) adalah ....</>, opts: ["22 cm", "44 cm", "88 cm", "154 cm", "308 cm"], ans: 1,
    why: <>{tex(raw`K=\pi d=\tfrac{22}{7}\times14=44`)} cm.</> },
  { q: <>Luas lingkaran berjari-jari 21 cm (π = 22/7) adalah ....</>, opts: ["66 cm²", "132 cm²", "693 cm²", "1.386 cm²", "2.772 cm²"], ans: 3,
    why: <>{tex(raw`L=\tfrac{22}{7}\times21\times21=1.386`)} cm².</> },
  { q: <>Keliling lingkaran 88 cm (π = 22/7). Jari-jarinya adalah ....</>, opts: ["28 cm", "7 cm", "14 cm", "21 cm", "44 cm"], ans: 2,
    why: <>{tex(raw`2\times\tfrac{22}{7}\times r=88\Rightarrow r=14`)} cm.</> },
  { q: <>Sudut pusat suatu busur 80°. Sudut keliling yang menghadap busur itu adalah ....</>, opts: ["20°", "160°", "80°", "40°", "100°"], ans: 3,
    why: <>Sudut keliling = ½ × sudut pusat = 40°.</> },
  { q: <>Sudut keliling yang menghadap diameter besarnya ....</>, opts: ["180°", "90°", "45°", "60°", "120°"], ans: 1,
    why: <>Diameter menghadap sudut pusat 180°, jadi sudut kelilingnya 90°.</> },
  { q: <>Panjang busur dengan sudut pusat 60° dan r = 21 cm (π = 22/7) adalah ....</>, opts: ["11 cm", "33 cm", "44 cm", "22 cm", "66 cm"], ans: 3,
    why: <>{tex(raw`\tfrac{60}{360}\times2\times\tfrac{22}{7}\times21=22`)} cm.</> },
  { q: <>Luas juring dengan sudut pusat 90° dan r = 14 cm (π = 22/7) adalah ....</>, opts: ["77 cm²", "308 cm²", "616 cm²", "38,5 cm²", "154 cm²"], ans: 4,
    why: <>{tex(raw`\tfrac14\times\tfrac{22}{7}\times196=154`)} cm².</> },
  { q: <>Roda berjari-jari 35 cm berputar 100 kali (π = 22/7). Jarak yang ditempuh adalah ....</>, opts: ["22 m", "110 m", "440 m", "220 m", "2,2 km"], ans: 3,
    why: <>Keliling 220 cm. 100 putaran = 22.000 cm = 220 m.</> },
  { q: <>Tali busur 16 cm pada lingkaran berjari-jari 10 cm. Jarak tali busur ke pusat adalah ....</>, opts: ["3 cm", "4 cm", "6 cm", "8 cm", "12 cm"], ans: 2,
    why: <>½ tali busur = 8, jadi {tex(raw`d=\sqrt{10^{2}-8^{2}}=6`)} cm.</> },
  { q: <>Titik P berjarak 13 cm dari pusat lingkaran berjari-jari 5 cm. Panjang garis singgung dari P adalah ....</>, opts: ["8 cm", "12 cm", "10 cm", "14 cm", "18 cm"], ans: 1,
    why: <>{tex(raw`\sqrt{13^{2}-5^{2}}=12`)} cm.</> },
  { q: <>Dua lingkaran berjari-jari 8 cm dan 3 cm, jarak kedua pusat 13 cm. Panjang garis singgung persekutuan luar adalah ....</>, opts: ["10 cm", "11 cm", "√48 cm", "13 cm", "12 cm"], ans: 4,
    why: <>{tex(raw`\sqrt{13^{2}-(8-3)^{2}}=\sqrt{144}=12`)} cm.</> },
  { q: <>Dua lingkaran berjari-jari 5 cm dan 3 cm, jarak kedua pusat 10 cm. Panjang garis singgung persekutuan dalam adalah ....</>, opts: ["√96 cm", "8 cm", "4 cm", "6 cm", "7 cm"], ans: 3,
    why: <>{tex(raw`\sqrt{10^{2}-(5+3)^{2}}=\sqrt{36}=6`)} cm. Pakai R + r, bukan R − r.</> },
  { q: <>Segitiga siku-siku bersisi 6 cm, 8 cm, 10 cm. Jari-jari lingkaran luarnya adalah ....</>, opts: ["10 cm", "4,8 cm", "2 cm", "5 cm", "24 cm"], ans: 3,
    why: <>Pusat lingkaran luar di tengah sisi miring: R = ½ × 10 = 5 cm. (Cek: {tex(raw`\tfrac{6\cdot8\cdot10}{4\cdot24}=5`)}.)</> },
  { q: <>Segitiga siku-siku bersisi 6 cm, 8 cm, 10 cm. Jari-jari lingkaran dalamnya adalah ....</>, opts: ["2 cm", "4 cm", "3 cm", "5 cm", "1 cm"], ans: 0,
    why: <>L = 24, s = 12, jadi {tex(raw`r=\tfrac{L}{s}=\tfrac{24}{12}=2`)} cm.</> },
];
