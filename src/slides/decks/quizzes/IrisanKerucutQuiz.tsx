import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const raw = String.raw;
const s3 = Math.sqrt(3);

// Bank soal dipisah dari susunan slide agar mudah dirawat.
// Catatan: grafik pembahasan memakai `fns` (y = f(x)); lingkaran/elips/hiperbola digambar sebagai dua setengah kurva.
export const QUIZ: QItem[] = [
  {
    q: <>Sebuah bidang memotong kerucut <b>sejajar</b> dengan salah satu garis pelukisnya. Irisannya berbentuk ....</>,
    opts: ["lingkaran", "elips", "parabola", "hiperbola", "dua garis lurus"], ans: 2,
    why: <>Sudut bidang sama dengan sudut garis pelukis, sehingga e = 1: <b>parabola</b>. Lebih landai (γ &gt; α) → elips, lebih tegak (γ &lt; α) → hiperbola.</>,
  },
  {
    q: <>Persamaan lingkaran berpusat di (2, −3) dengan jari-jari 4 adalah ....</>,
    opts: [raw`(x+2)^2+(y-3)^2=16`, raw`(x-2)^2+(y+3)^2=16`, raw`(x-2)^2+(y+3)^2=4`, raw`(x+2)^2+(y-3)^2=4`, raw`(x-2)^2+(y-3)^2=16`], ans: 1,
    why: <>{tex(raw`(x-a)^2+(y-b)^2=r^2`)} dengan a = 2, b = −3, r² = 16. Tanda di dalam kurung berlawanan dengan koordinat pusat.</>,
    viz: { bbox: [-4, 3, 8, -9], aspect: 1, fns: [(x) => -3 + Math.sqrt(16 - (x - 2) ** 2), (x) => -3 - Math.sqrt(16 - (x - 2) ** 2)], mark: [2, -3] },
  },
  {
    q: <>Pusat dan jari-jari lingkaran {tex(raw`x^2+y^2-6x+4y-12=0`)} adalah ....</>,
    opts: ["M(3, −2), r = 5", "M(−3, 2), r = 5", "M(3, −2), r = 25", "M(−3, 2), r = 25", "M(6, −4), r = 5"], ans: 0,
    why: <>Pusat {tex(raw`(-\tfrac A2,-\tfrac B2)=(3,-2)`)}; {tex(raw`r^2=9+4+12=25`)}, jadi r = 5.</>,
    viz: { bbox: [-4, 6, 10, -8], aspect: 1, fns: [(x) => -2 + Math.sqrt(25 - (x - 3) ** 2), (x) => -2 - Math.sqrt(25 - (x - 3) ** 2)], mark: [3, -2] },
  },
  {
    q: <>Garis {tex("y=x+k")} menyinggung lingkaran {tex("x^2+y^2=8")}. Nilai k adalah ....</>,
    opts: ["±2", "±2√2", "±4", "±8", "±16"], ans: 2,
    why: <>Syarat singgung {tex(raw`n^2=r^2(1+m^2)`)}: {tex(raw`k^2=8(1+1)=16`)} → k = ±4. Atau substitusi lalu D = 0.</>,
    viz: { bbox: [-6, 6, 6, -6], aspect: 1, fns: [(x) => Math.sqrt(8 - x * x), (x) => -Math.sqrt(8 - x * x)], lines: [[1, -1, -4], [1, -1, 4]] },
  },
  {
    q: <>Fokus dan persamaan direktriks parabola {tex("y^2=12x")} adalah ....</>,
    opts: ["(3, 0) dan x = −3", "(−3, 0) dan x = 3", "(12, 0) dan x = −12", "(0, 3) dan y = −3", "(6, 0) dan x = −6"], ans: 0,
    why: <>{tex("4p=12")} → p = 3. Fokus (p, 0) = (3, 0), direktriks x = −p = −3.</>,
    viz: { bbox: [-6, 8, 10, -8], aspect: 1, fns: [(x) => Math.sqrt(12 * x), (x) => -Math.sqrt(12 * x)], lines: [[1, 0, -3]], pts: [[3, 0]] },
  },
  {
    q: <>Parabola berpuncak di (1, 2) dan berfokus di (1, 5). Persamaannya ....</>,
    opts: [raw`(x-1)^2=12(y-2)`, raw`(x-1)^2=3(y-2)`, raw`(y-2)^2=12(x-1)`, raw`(x-1)^2=-12(y-2)`, raw`(y-2)^2=3(x-1)`], ans: 0,
    why: <>Fokus tepat di atas puncak → parabola membuka ke atas, p = 3. Bentuknya {tex(raw`(x-h)^2=4p(y-k)`)} → {tex(raw`(x-1)^2=12(y-2)`)}.</>,
    viz: { bbox: [-6, 12, 8, -2], aspect: 1, fns: [(x) => 2 + (x - 1) ** 2 / 12], lines: [[0, 1, -1]], pts: [[1, 5]], mark: [1, 2] },
  },
  {
    q: <>Garis {tex("y=2x+n")} menyinggung parabola {tex("y^2=8x")}. Nilai n adalah ....</>,
    opts: ["−1", "0", "1", "2", "4"], ans: 2,
    why: <>{tex("p=2")}, m = 2. Syarat singgung {tex(raw`n=\dfrac pm=1`)}. Cek: {tex(raw`(2x+1)^2=8x\Rightarrow(2x-1)^2=0`)}, D = 0. Titik singgung (½, 2).</>,
    viz: { bbox: [-4, 7, 8, -5], aspect: 1, fns: [(x) => Math.sqrt(8 * x), (x) => -Math.sqrt(8 * x)], lines: [[2, -1, -1]], mark: [0.5, 2] },
  },
  {
    q: <>Eksentrisitas elips {tex("9x^2+25y^2=225")} adalah ....</>,
    opts: ["3/5", "4/5", "3/4", "5/3", "16/25"], ans: 1,
    why: <>Bagi 225: {tex(raw`\tfrac{x^2}{25}+\tfrac{y^2}{9}=1`)}, a = 5, b = 3, {tex(raw`c=\sqrt{25-9}=4`)}, {tex(raw`e=\tfrac ca=\tfrac45`)}.</>,
    viz: { bbox: [-7, 5, 7, -5], aspect: 1.4, fns: [(x) => 3 * Math.sqrt(1 - (x * x) / 25), (x) => -3 * Math.sqrt(1 - (x * x) / 25)], pts: [[4, 0], [-4, 0]] },
  },
  {
    q: <>Elips berfokus di (±3, 0) dengan panjang sumbu mayor 10 mempunyai persamaan ....</>,
    opts: [raw`\frac{x^2}{25}+\frac{y^2}{16}=1`, raw`\frac{x^2}{16}+\frac{y^2}{25}=1`, raw`\frac{x^2}{25}+\frac{y^2}{9}=1`, raw`\frac{x^2}{25}-\frac{y^2}{16}=1`, raw`\frac{x^2}{34}+\frac{y^2}{25}=1`], ans: 0,
    why: <>2a = 10 → a = 5; c = 3 → {tex(raw`b^2=a^2-c^2=16`)}. Fokus di sumbu x, jadi a² berada di bawah x².</>,
    viz: { bbox: [-7, 6, 7, -6], aspect: 14 / 12, fns: [(x) => 4 * Math.sqrt(1 - (x * x) / 25), (x) => -4 * Math.sqrt(1 - (x * x) / 25)], pts: [[3, 0], [-3, 0]] },
  },
  {
    q: <>Persamaan garis singgung elips {tex(raw`\frac{x^2}{16}+\frac{y^2}{4}=1`)} di titik {tex(raw`(2\sqrt3,\,1)`)} adalah ....</>,
    opts: ["√3x + 2y = 8", "√3x + y = 8", "2√3x + y = 4", "√3x − 2y = 8", "x + 2√3y = 8"], ans: 0,
    why: <>{tex(raw`\tfrac{x_1x}{16}+\tfrac{y_1y}{4}=1\Rightarrow\tfrac{2\sqrt3\,x}{16}+\tfrac y4=1`)}. Kalikan 16 lalu bagi 2: {tex(raw`\sqrt3x+2y=8`)}.</>,
    viz: { bbox: [-6, 4, 6, -4], aspect: 1.5, fns: [(x) => 2 * Math.sqrt(1 - (x * x) / 16), (x) => -2 * Math.sqrt(1 - (x * x) / 16)], lines: [[s3, 2, 8]], mark: [2 * s3, 1] },
  },
  {
    q: <>Elips {tex(raw`x^2+4y^2-6x+8y-3=0`)} mempunyai pusat dan eksentrisitas ....</>,
    opts: ["(3, −1) dan √3/2", "(−3, 1) dan √3/2", "(3, −1) dan 1/2", "(3, −1) dan √3/4", "(−3, 1) dan 1/2"], ans: 0,
    why: <>Lengkapkan kuadrat: {tex(raw`(x-3)^2+4(y+1)^2=16`)} → {tex(raw`\tfrac{(x-3)^2}{16}+\tfrac{(y+1)^2}{4}=1`)}. Pusat (3, −1), a = 4, b = 2, {tex(raw`c=2\sqrt3`)}, {tex(raw`e=\tfrac{\sqrt3}{2}`)}.</>,
    viz: { bbox: [-3, 4, 9, -6], aspect: 1.2, fns: [(x) => -1 + 2 * Math.sqrt(1 - (x - 3) ** 2 / 16), (x) => -1 - 2 * Math.sqrt(1 - (x - 3) ** 2 / 16)], mark: [3, -1] },
  },
  {
    q: <>Persamaan asimtot hiperbola {tex(raw`\frac{x^2}{16}-\frac{y^2}{9}=1`)} adalah ....</>,
    opts: [raw`y=\pm\frac34x`, raw`y=\pm\frac43x`, raw`y=\pm\frac9{16}x`, raw`y=\pm\frac{16}9x`, raw`y=\pm3x`], ans: 0,
    why: <>{tex(raw`a=4,\ b=3`)}, asimtot {tex(raw`y=\pm\tfrac bax=\pm\tfrac34x`)}. (Fokus (±5, 0) karena {tex(raw`c^2=16+9`)}.)</>,
    viz: { bbox: [-9, 6, 9, -6], aspect: 1.5, fns: [(x) => 3 * Math.sqrt(x * x / 16 - 1), (x) => -3 * Math.sqrt(x * x / 16 - 1)], lines: [[3, -4, 0], [3, 4, 0]], pts: [[5, 0], [-5, 0]] },
  },
  {
    q: <>Garis {tex("y=x+k")} menyinggung hiperbola {tex(raw`\frac{x^2}{25}-\frac{y^2}{9}=1`)}. Nilai k adalah ....</>,
    opts: ["±2", "±3", "±4", "±5", "±16"], ans: 2,
    why: <>Syarat singgung {tex(raw`n^2=a^2m^2-b^2`)}: {tex(raw`k^2=25-9=16`)} → k = ±4. Titik singgung untuk k = 4 adalah (−6,25; −2,25).</>,
    viz: { bbox: [-9, 6, 9, -6], aspect: 1.5, fns: [(x) => 3 * Math.sqrt(x * x / 25 - 1), (x) => -3 * Math.sqrt(x * x / 25 - 1)], lines: [[1, -1, -4], [1, -1, 4]], mark: [-6.25, -2.25] },
  },
];
