import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const sq = Math.sqrt(13);

const raw = String.raw;

// Bank soal dipisah dari susunan slide agar konten kuis mudah dirawat.
export const QUIZ: QItem[] = [
  {
    q: <>Jika {tex("f(x)=x^2-3x+1")}, nilai {tex("f(-2)")} adalah ....</>,
    opts: ["3", "9", "11", "15", "21"], ans: 2,
    why: <>{tex("f(-2)=4+6+1=11")}. Kuadrat bilangan negatif bernilai positif.</>,
    viz: { bbox: [-4, 14, 6, -4], aspect: 1.5, fns: [(x) => x * x - 3 * x + 1], mark: [-2, 11] },
  },
  {
    q: <>Himpunan penyelesaian {tex("x^2-7x+12=0")} adalah ....</>,
    opts: [raw`\{-4,-3\}`, raw`\{-4,3\}`, raw`\{-3,4\}`, raw`\{3,4\}`, raw`\{1,12\}`], ans: 3,
    why: <>Jumlah −7, hasil kali 12: {tex("(x-3)(x-4)=0")}, x = 3 atau 4.</>,
    viz: { bbox: [-1, 14, 8, -3], aspect: 1.5, fns: [(x) => x * x - 7 * x + 12], pts: [[3, 0], [4, 0]] },
  },
  {
    q: <>Titik potong grafik {tex("y=x^2-4x-5")} dengan sumbu x adalah ....</>,
    opts: ["(1, 0) dan (−5, 0)", "(−1, 0) dan (5, 0)", "(−1, 0) dan (−5, 0)", "(1, 0) dan (5, 0)", "(0, −5) dan (5, 0)"], ans: 1,
    why: <>{tex("(x+1)(x-5)=0")}, x = −1 atau 5.</>,
    viz: { bbox: [-3, 8, 7, -10], aspect: 1.3, fns: [(x) => x * x - 4 * x - 5], pts: [[-1, 0], [5, 0]] },
  },
  {
    q: <>Koordinat titik puncak {tex("y=x^2-6x+8")} adalah ....</>,
    opts: ["(3, −1)", "(−3, −1)", "(3, 1)", "(6, 8)", "(−3, 35)"], ans: 0,
    why: <>{tex(raw`x_p=\tfrac62=3,\ y_p=9-18+8=-1`)}.</>,
    viz: { bbox: [-1, 10, 7, -3], aspect: 1.3, fns: [(x) => x * x - 6 * x + 8], mark: [3, -1] },
  },
  {
    q: <>Nilai maksimum {tex("f(x)=-2x^2+8x+1")} adalah ....</>,
    opts: ["5", "6", "7", "8", "9"], ans: 4,
    why: <>{tex(raw`x_p=2,\ f(2)=-8+16+1=9`)}. Cek: {tex(raw`-\tfrac{D}{4a}=9`)}.</>,
    viz: { bbox: [-3, 11, 7, -7], aspect: 1.4, fns: [(x) => -2 * x * x + 8 * x + 1], mark: [2, 9] },
  },
  {
    q: <>{tex("x^2-6x+k=0")} mempunyai dua akar real berbeda. Batas k adalah ....</>,
    opts: ["k > 9", "k < 9", "k ≥ 9", "k ≤ 9", "k < −9"], ans: 1,
    why: <>{tex(raw`D=36-4k>0\Rightarrow k<9`)}. Tanda dibalik karena dibagi −4.</>,
    viz: { bbox: [-1, 12, 7, -4], aspect: 1.3, fns: [(x) => x * x - 6 * x + 5, (x) => x * x - 6 * x + 9, (x) => x * x - 6 * x + 13] },
  },
  {
    q: <>Parabola berpuncak (2, −4) dan melalui titik asal O. Persamaannya ....</>,
    opts: ["f(x)=x^2-4x", "f(x)=x^2+4x", "f(x)=-x^2+4x", "f(x)=x^2-4", "f(x)=2x^2-8x"], ans: 0,
    why: <>{tex("f(x)=a(x-2)^2-4")}, f(0) = 0 → 4a − 4 = 0 → a = 1. Jadi {tex("x^2-4x")}.</>,
    viz: { bbox: [-2, 5, 6, -6], aspect: 1.3, fns: [(x) => x * x - 4 * x], pts: [[0, 0]], mark: [2, -4] },
  },
  {
    q: <>Akar-akar {tex("x^2-5x+3=0")} adalah α dan β. Nilai {tex(raw`\alpha^2+\beta^2`)} adalah ....</>,
    opts: ["11", "13", "19", "25", "31"], ans: 2,
    why: <>α + β = 5, αβ = 3 → {tex("25-6=19")}. Akarnya tidak bulat, jadi pakai jumlah dan hasil kali.</>,
    viz: { bbox: [-2, 6, 7, -4], aspect: 1.4, fns: [(x) => x * x - 5 * x + 3], pts: [[(5 - sq) / 2, 0], [(5 + sq) / 2, 0]] },
  },
  {
    q: <>Garis {tex("y=2x+k")} menyinggung parabola {tex("y=x^2+3")}. Nilai k adalah ....</>,
    opts: ["−2", "0", "1", "2", "4"], ans: 3,
    why: <>{tex("x^2-2x+(3-k)=0")}, D = 0 → k = 2. Titik singgung (1, 4).</>,
    viz: { bbox: [-4, 12, 5, -3], aspect: 1.2, fns: [(x) => x * x + 3], lines: [[2, -1, -2]], mark: [1, 4] },
  },
  {
    q: <>Akar {tex("x^2-3x+1=0")} adalah α, β. Persamaan dengan akar {tex("2\\alpha-1")} dan {tex("2\\beta-1")} adalah ....</>,
    opts: [raw`x^2+4x-1=0`, raw`x^2-4x+1=0`, raw`x^2-4x+7=0`, raw`x^2-2x-1=0`, raw`x^2-4x-1=0`], ans: 4,
    why: <>Jumlah {tex("2(3)-2=4")}, hasil kali {tex("4-6+1=-1")} → {tex("x^2-4x-1=0")}.</>,
    viz: { bbox: [-3, 8, 6, -5], aspect: 1.3, fns: [(x) => x * x - 3 * x + 1, (x) => x * x - 4 * x - 1] },
  },
  {
    q: <>Kawat 60 m memagari kebun persegi panjang; satu sisi berbatasan dengan tembok (tidak dipagari). Luas terbesar (m²) adalah ....</>,
    opts: ["225", "400", "450", "600", "900"], ans: 2,
    why: <>Lebar x, panjang 60 − 2x: {tex("L=-2x^2+60x")}, {tex("x_p=15")}, L = 450. (225 muncul bila keempat sisi dipagari.)</>,
    viz: { bbox: [-3, 520, 33, -80], aspect: 1.6, fns: [(x) => -2 * x * x + 60 * x], mark: [15, 450] },
  },
  {
    q: <>{tex("f(x)=x^2+(k-2)x+9")} bernilai positif untuk setiap x bila ....</>,
    opts: ["k < −4 atau k > 8", "−4 < k < 8", "−8 < k < 4", "−6 < k < 6", "k < 8"], ans: 1,
    why: <>a = 1 &gt; 0 dan D &lt; 0: {tex("(k-2)^2<36")} → {tex("-6<k-2<6")} → {tex("-4<k<8")}.</>,
    viz: { bbox: [-8, 20, 6, -4], aspect: 1.4, fns: [(x) => x * x - 2 * x + 9, (x) => x * x + 6 * x + 9] },
  },
  {
    q: <>Perhatikan grafik {tex("f(x)=ax^2+bx+c")} pada gambar. Pernyataan yang benar mengenai tanda a, b, c, dan D adalah ....</>,
    opts: ["a > 0, b < 0, c > 0, D > 0", "a < 0, b < 0, c > 0, D > 0", "a < 0, b > 0, c < 0, D > 0", "a < 0, b > 0, c > 0, D > 0", "a < 0, b > 0, c > 0, D < 0"], ans: 3,
    why: <>Terbuka ke bawah: a &lt; 0. Memotong sumbu y di atas O: c &gt; 0. Dua titik potong sumbu x: D &gt; 0. Puncak di kanan sumbu y: {tex(raw`-\tfrac b{2a}>0`)} dengan a &lt; 0 → b &gt; 0.</>,
    viz: { bbox: [-3, 6, 5, -5], aspect: 1.3, fns: [(x) => -x * x + 2 * x + 3] }, vizFirst: true,
  },
];
