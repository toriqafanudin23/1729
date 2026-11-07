import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const raw = String.raw;
const S3 = Math.sqrt(3);

// Bank soal dipisah dari susunan slide agar konten kuis mudah dirawat.
// Pada grafik, bilangan kompleks a + bi digambar sebagai titik (a, b).
export const QUIZ: QItem[] = [
  {
    q: <>Nilai {tex("i^{2026}")} adalah ....</>,
    opts: ["1", "−1", "i", "−i", "0"], ans: 1,
    why: <>{tex("2026=4\\cdot 506+2")}, sisanya 2. Jadi {tex("i^{2026}=i^2=-1")}.</>,
    viz: { bbox: [-2, 2, 2, -2], aspect: 1, pts: [[1, 0], [0, 1], [0, -1]], mark: [-1, 0] },
  },
  {
    q: <>Hasil {tex("(3+2i)+(1-5i)")} adalah ....</>,
    opts: ["4 − 3i", "4 + 7i", "2 + 7i", "4 − 7i", "2 − 3i"], ans: 0,
    why: <>Real: 3 + 1 = 4. Imajiner: 2 − 5 = −3. Jadi {tex("4-3i")}.</>,
    viz: { bbox: [-1, 4, 6, -5], aspect: 1.2, pts: [[3, 2], [1, -5]], mark: [4, -3] },
  },
  {
    q: <>Hasil {tex("(2+3i)(1-i)")} adalah ....</>,
    opts: ["5 + i", "−1 + 5i", "5 − i", "−1 + i", "−1 − 5i"], ans: 0,
    why: <>{tex("2-2i+3i-3i^2=2+i+3=5+i")}. Ingat {tex("-3i^2=+3")}.</>,
    viz: { bbox: [-1, 5, 7, -3], aspect: 1.2, pts: [[2, 3], [1, -1]], mark: [5, 1] },
  },
  {
    q: <>Bentuk paling sederhana {tex(raw`\dfrac{5+i}{2-i}`)} adalah ....</>,
    opts: [raw`\dfrac{9+7i}{5}`, raw`\dfrac{11+7i}{5}`, raw`\dfrac{9-3i}{5}`, raw`\dfrac{10+i}{3}`, raw`\dfrac{11+3i}{5}`], ans: 0,
    why: <>Kalikan dengan sekawan {tex("2+i")}: {tex(raw`\dfrac{(5+i)(2+i)}{4+1}=\dfrac{10+5i+2i-1}{5}=\dfrac{9+7i}{5}`)}.</>,
    viz: { bbox: [-1, 5, 6, -2], aspect: 1.3, pts: [[5, 1], [2, -1]], mark: [1.8, 1.4] },
  },
  {
    q: <>Nilai {tex(raw`\sqrt{-4}\cdot\sqrt{-9}`)} adalah ....</>,
    opts: ["6", "−6", "6i", "−6i", "±6"], ans: 1,
    why: <>{tex(raw`\sqrt{-4}=2i,\ \sqrt{-9}=3i`)}, sehingga {tex("6i^2=-6")}. Aturan {tex(raw`\sqrt a\sqrt b=\sqrt{ab}`)} tidak berlaku untuk dua bilangan negatif.</>,
    viz: { bbox: [-8, 4, 8, -4], aspect: 2, pts: [[0, 2], [0, 3]], mark: [-6, 0] },
  },
  {
    q: <>Jika {tex("z=3-4i")}, maka {tex(raw`z\cdot\bar z`)} sama dengan ....</>,
    opts: ["−7", "7", "25", "5", "−25"], ans: 2,
    why: <>{tex(raw`z\bar z=|z|^2=3^2+(-4)^2=25`)}. Hasilnya selalu real dan tidak negatif.</>,
    viz: { bbox: [-5, 5, 5, -5], aspect: 1, pts: [[3, -4], [3, 4]] },
  },
  {
    q: <>Akar-akar {tex("x^2-2x+10=0")} adalah ....</>,
    opts: ["1 ± 3i", "1 ± 6i", "2 ± 3i", "−1 ± 3i", "1 ± 9i"], ans: 0,
    why: <>{tex("D=4-40=-36")}, maka {tex(raw`x=\dfrac{2\pm 6i}{2}=1\pm 3i`)}.</>,
    viz: { bbox: [-4, 5, 5, -5], aspect: 1, pts: [[1, 3], [1, -3]] },
  },
  {
    q: <>Persamaan kuadrat berakar {tex("3+2i")} dan {tex("3-2i")} adalah ....</>,
    opts: ["x^2-6x+13=0", "x^2+6x+13=0", "x^2-6x+5=0", "x^2-6x-13=0", "x^2-3x+13=0"], ans: 0,
    why: <>Jumlah akar 6, hasil kali {tex("3^2+2^2=13")}. Jadi {tex("x^2-6x+13=0")}.</>,
    viz: { bbox: [-1, 4, 7, -4], aspect: 1.3, pts: [[3, 2], [3, -2]] },
  },
  {
    q: <>Bentuk polar dari {tex(raw`z=1+i\sqrt3`)} adalah ....</>,
    opts: [
      raw`2(\cos60^\circ+i\sin60^\circ)`, raw`2(\cos30^\circ+i\sin30^\circ)`, raw`4(\cos60^\circ+i\sin60^\circ)`,
      raw`2(\cos120^\circ+i\sin120^\circ)`, raw`\sqrt2(\cos60^\circ+i\sin60^\circ)`,
    ], ans: 0,
    why: <>{tex(raw`r=\sqrt{1+3}=2`)}. {tex(raw`\tan\theta=\sqrt3`)} dan z di kuadran I, jadi {tex(raw`\theta=60^\circ`)}.</>,
    viz: { bbox: [-1, 3, 3, -1], aspect: 1, pts: [[1, 0]], mark: [1, S3] },
  },
  {
    q: <>Nilai {tex("(1+i)^8")} adalah ....</>,
    opts: ["16", "−16", "16i", "−16i", "256"], ans: 0,
    why: <>{tex(raw`1+i=\sqrt2\,\mathrm{cis}\,45^\circ`)}. Pangkat 8: {tex(raw`(\sqrt2)^8=16`)}, sudut {tex(raw`8\cdot45^\circ=360^\circ`)}. Hasil {tex("16")}.</>,
    viz: { bbox: [-4, 3, 18, -3], aspect: 2.5, pts: [[1, 1]], mark: [16, 0] },
  },
  {
    q: <>Jika {tex(raw`z_1=2\,\mathrm{cis}\,20^\circ`)} dan {tex(raw`z_2=3\,\mathrm{cis}\,40^\circ`)}, maka {tex("z_1z_2")} adalah ....</>,
    opts: [
      raw`5\,\mathrm{cis}\,60^\circ`, raw`6\,\mathrm{cis}\,800^\circ`, raw`6\,\mathrm{cis}\,60^\circ`,
      raw`6\,\mathrm{cis}\,20^\circ`, raw`3\,\mathrm{cis}\,60^\circ`,
    ], ans: 2,
    why: <>Modulus dikalikan: 2·3 = 6. Sudut dijumlahkan: 20° + 40° = 60°. (Pilihan 800° adalah hasil mengalikan sudut, keliru.)</>,
    viz: { bbox: [-1, 7, 7, -1], aspect: 1.1, pts: [[2 * Math.cos(Math.PI / 9), 2 * Math.sin(Math.PI / 9)], [3 * Math.cos((2 * Math.PI) / 9), 3 * Math.sin((2 * Math.PI) / 9)]], mark: [3, 3 * S3] },
  },
  {
    q: <>Manakah yang <b>bukan</b> akar dari {tex("z^3=1")}?</>,
    opts: ["1", raw`-\tfrac12+\tfrac{\sqrt3}{2}i`, raw`-\tfrac12-\tfrac{\sqrt3}{2}i`, raw`\tfrac12+\tfrac{\sqrt3}{2}i`, raw`\cos240^\circ+i\sin240^\circ`], ans: 3,
    why: <>{tex(raw`\tfrac12+\tfrac{\sqrt3}2i=\mathrm{cis}\,60^\circ`)}; pangkat 3 memberi {tex(raw`\mathrm{cis}\,180^\circ=-1`)}, bukan 1. Tiga akar sebenarnya adalah cis 0°, 120°, 240°.</>,
    viz: { bbox: [-2, 2, 2, -2], aspect: 1, pts: [[1, 0], [-0.5, S3 / 2], [-0.5, -S3 / 2]], mark: [0.5, S3 / 2] },
  },
  {
    q: <>Himpunan titik {tex("|z-2i|=3")} pada bidang kompleks adalah ....</>,
    opts: [
      "lingkaran berpusat (0, 2), jari-jari 3", "lingkaran berpusat (0, −2), jari-jari 3", "lingkaran berpusat (2, 0), jari-jari 3",
      "lingkaran berpusat (0, 2), jari-jari 9", "garis lurus melalui (0, 2)",
    ], ans: 0,
    why: <>{tex("|z-z_0|=r")} adalah lingkaran berpusat {tex("z_0")}. Di sini {tex("z_0=2i")}, yaitu titik (0, 2), dan {tex("r=3")}.</>,
    viz: { bbox: [-5, 6, 5, -2], aspect: 1.25, fns: [(x) => 2 + Math.sqrt(9 - x * x), (x) => 2 - Math.sqrt(9 - x * x)], mark: [0, 2] },
  },
];
