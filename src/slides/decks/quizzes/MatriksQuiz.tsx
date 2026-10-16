import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const raw = String.raw;
/** Matriks 2×2 sebagai TeX (untuk pilihan jawaban). */
const mt = (a: number, b: number, c: number, d: number) => raw`\begin{bmatrix}${a}&${b}\\${c}&${d}\end{bmatrix}`;

// Bank soal dipisah dari susunan slide agar mudah dirawat.
export const QUIZ: QItem[] = [
  {
    q: <>Matriks A berordo 3 × 4 dan B berordo 4 × 2. Ordo AB adalah ....</>,
    opts: ["3 × 2", "4 × 4", "3 × 4", "2 × 3", "AB tidak terdefinisi"], ans: 0,
    why: <>Kolom A (4) sama dengan baris B (4), jadi AB ada. Ordonya: baris A × kolom B = 3 × 2.</>,
  },
  {
    q: <>Jika {tex(raw`A=\begin{bmatrix}2&1\\0&3\end{bmatrix}`)} dan {tex(raw`B=\begin{bmatrix}1&-1\\4&2\end{bmatrix}`)}, maka {tex("A+2B")} adalah ....</>,
    opts: [mt(4, -1, 8, 7), mt(3, 0, 4, 5), mt(4, -3, 8, 7), mt(2, -2, 8, 4), mt(4, 1, 8, 7)], ans: 0,
    why: <>Kalikan B dengan 2 dulu: {tex(mt(2, -2, 8, 4))}. Lalu jumlahkan elemen seletak dengan A.</>,
  },
  {
    q: <>Determinan {tex(raw`\begin{bmatrix}3&2\\1&4\end{bmatrix}`)} adalah ....</>,
    opts: ["10", "14", "−10", "2", "12"], ans: 0,
    why: <>{tex(raw`ad-bc=3\cdot4-2\cdot1=12-2=10`)}.</>,
  },
  {
    q: <>Hasil {tex(raw`\begin{bmatrix}1&2\\3&4\end{bmatrix}\begin{bmatrix}0&1\\1&0\end{bmatrix}`)} adalah ....</>,
    opts: [mt(2, 1, 4, 3), mt(3, 4, 1, 2), mt(0, 2, 3, 0), mt(1, 2, 3, 4), mt(0, 1, 3, 0)], ans: 0,
    why: <>Matriks kedua menukar kolom. Cek elemen pertama: baris 1 × kolom 1 = {tex(raw`1\cdot0+2\cdot1=2`)}. Pilihan {tex(mt(3, 4, 1, 2))} adalah hasil BA, bukan AB.</>,
  },
  {
    q: <>Invers dari {tex(raw`\begin{bmatrix}2&1\\5&3\end{bmatrix}`)} adalah ....</>,
    opts: [mt(3, -1, -5, 2), mt(3, 1, 5, 2), mt(2, -1, -5, 3), mt(-3, 1, 5, -2), mt(3, -5, -1, 2)], ans: 0,
    why: <>Determinan {tex(raw`=6-5=1`)}. Tukar diagonal utama, ubah tanda diagonal lainnya: {tex(mt(3, -1, -5, 2))}.</>,
  },
  {
    q: <>Matriks {tex(raw`\begin{bmatrix}k&2\\4&3\end{bmatrix}`)} tidak punya invers bila k = ....</>,
    opts: [raw`\dfrac{8}{3}`, raw`-\dfrac{8}{3}`, "3", raw`\dfrac{3}{8}`, "0"], ans: 0,
    why: <>Tak punya invers bila determinan 0: {tex(raw`3k-8=0\Rightarrow k=\dfrac{8}{3}`)}.</>,
  },
  {
    q: <>Titik (2, 1) ditransformasi oleh {tex(raw`\begin{bmatrix}0&-1\\1&0\end{bmatrix}`)}. Bayangannya adalah ....</>,
    opts: ["(−1, 2)", "(1, −2)", "(2, −1)", "(−2, 1)", "(1, 2)"], ans: 0,
    why: <>{tex(raw`\begin{bmatrix}0&-1\\1&0\end{bmatrix}\begin{bmatrix}2\\1\end{bmatrix}=\begin{bmatrix}-1\\2\end{bmatrix}`)}. Ini rotasi 90° berlawanan arah jarum jam.</>,
    viz: { bbox: [-3, 3, 3, -3], aspect: 1, pts: [[2, 1]], mark: [-1, 2] },
  },
  {
    q: <>Sistem {tex(raw`x+y=5`)} dan {tex(raw`x-y=1`)} ditulis {tex(raw`AX=B`)}. Penyelesaiannya (x, y) adalah ....</>,
    opts: ["(3, 2)", "(2, 3)", "(4, 1)", "(3, −2)", "(5, 0)"], ans: 0,
    why: <>{tex(raw`\det A=-2`)}, {tex(raw`A^{-1}=\dfrac{1}{-2}\begin{bmatrix}-1&-1\\-1&1\end{bmatrix}`)}, sehingga {tex(raw`X=A^{-1}B=\begin{bmatrix}3\\2\end{bmatrix}`)}.</>,
    viz: { bbox: [-2, 7, 8, -2], lines: [[1, 1, 5], [1, -1, 1]], mark: [3, 2] },
  },
  {
    q: <>Untuk matriks persegi A dan B yang ordonya sama, pernyataan yang <b>benar</b> adalah ....</>,
    opts: ["det(AB) = det(A) · det(B)", "AB = BA selalu berlaku", "A + B = AB", "det(A + B) = det(A) + det(B)", "setiap matriks persegi punya invers"], ans: 0,
    why: <>Perkalian matriks <b>tidak komutatif</b> (urutan penting), dan matriks berdeterminan 0 tak punya invers. Yang selalu benar: determinan hasil kali = hasil kali determinan.</>,
  },
  {
    q: <>Pada {tex(raw`A=\begin{bmatrix}1&2&3\\0&1&4\\5&6&0\end{bmatrix}`)}, kofaktor {tex(raw`C_{23}`)} adalah ....</>,
    opts: ["4", "−4", "2", "−2", "0"], ans: 0,
    why: <>Coret baris 2 dan kolom 3: minor {tex(raw`M_{23}=\begin{vmatrix}1&2\\5&6\end{vmatrix}=6-10=-4`)}. Tanda {tex(raw`(-1)^{2+3}=-1`)}, jadi {tex(raw`C_{23}=4`)}.</>,
  },
  {
    q: <>Determinan {tex(raw`\begin{bmatrix}2&1&0\\1&3&1\\0&1&2\end{bmatrix}`)} adalah ....</>,
    opts: ["8", "10", "6", "12", "−8"], ans: 0,
    why: <>Sarrus: diagonal turun {tex("12+0+0=12")}, diagonal naik {tex("0+2+2=4")}. Determinan {tex("12-4=8")}.</>,
  },
  {
    q: <>Matriks {tex(raw`\begin{bmatrix}1&2&3\\4&5&6\\7&8&k\end{bmatrix}`)} tidak punya invers bila k = ....</>,
    opts: ["9", "8", "6", "0", "3"], ans: 0,
    why: <>{tex(raw`\det=-3k+27`)} (ekspansi baris 1). Tak punya invers bila det = 0, yaitu k = 9.</>,
  },
  {
    q: <>Rumus invers matriks 3 × 3 adalah ....</>,
    opts: [raw`\dfrac{1}{\det A}\operatorname{adj}(A)`, raw`\det A\cdot\operatorname{adj}(A)`, raw`\dfrac{\det A}{\operatorname{adj}(A)}`, raw`\dfrac{1}{\det A}\operatorname{kof}(A)`, raw`\dfrac{1}{\det A}A^{T}`], ans: 0,
    why: <>Adjoin adalah <b>transpos</b> matriks kofaktor. Pilihan yang memakai kofaktor tanpa transpos keliru.</>,
  },
];
