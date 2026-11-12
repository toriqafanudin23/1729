import type { QItem } from "../../common/LinearKit";
import { tex } from "../../common/LinearKit";

const raw = String.raw;

// Bank soal dipisah dari susunan slide agar mudah dirawat.
// Pilihan jawaban yang mengandung \ ^ _ { } otomatis dirender sebagai TeX oleh <Quiz>.
export const QUIZ: QItem[] = [
  {
    q: <>Manakah yang merupakan <b>himpunan</b>?</>,
    opts: ["Kumpulan siswa yang tampan", "Kumpulan bilangan prima kurang dari 10", "Kumpulan makanan yang enak", "Kumpulan pemain bola yang hebat", "Kumpulan buku yang menarik"], ans: 1,
    why: <>Himpunan harus punya batas keanggotaan yang jelas. Bilangan prima kurang dari 10 adalah 2, 3, 5, 7. Kata “tampan”, “enak”, “hebat”, dan “menarik” bergantung pada penilaian tiap orang.</>,
  },
  {
    q: <>Banyak anggota himpunan {tex(raw`P=\{x\mid x\text{ faktor dari }18\}`)} adalah ....</>,
    opts: ["4", "5", "6", "7", "8"], ans: 2,
    why: <>Faktor dari 18: 1, 2, 3, 6, 9, 18. Jadi {tex(raw`n(P)=6`)}.</>,
  },
  {
    q: <>Diketahui {tex(raw`A=\{1,2,3,4,5,6\}`)} dan {tex(raw`B=\{2,4,6,8\}`)}. Maka {tex(raw`A\cap B`)} adalah ....</>,
    opts: [raw`\{2,4,6\}`, raw`\{1,3,5\}`, raw`\{2,4,6,8\}`, raw`\{1,2,3,4,5,6,8\}`, raw`\{8\}`], ans: 0,
    why: <>Irisan = anggota yang ada di A <b>dan</b> di B: 2, 4, 6.</>,
  },
  {
    q: <>Dengan A dan B yang sama seperti soal sebelumnya, {tex(raw`A\cup B`)} adalah ....</>,
    opts: [raw`\{2,4,6\}`, raw`\{1,3,5\}`, raw`\{1,2,3,4,5,6\}`, raw`\{1,2,3,4,5,6,8\}`, raw`\{8\}`], ans: 3,
    why: <>Gabungan = semua anggota A atau B, anggota yang sama ditulis sekali: 1, 2, 3, 4, 5, 6, 8. Cek: 6 + 4 − 3 = 7 anggota.</>,
  },
  {
    q: <>Dengan A dan B yang sama, {tex(raw`A-B`)} adalah ....</>,
    opts: [raw`\{8\}`, raw`\{2,4,6\}`, raw`\{1,3,5\}`, raw`\{1,3,5,8\}`, raw`\{1,2,3,4,5,6\}`], ans: 2,
    why: <>Selisih A − B = anggota A yang <b>tidak</b> ada di B: 1, 3, 5. Sedangkan B − A = {"{8}"}.</>,
  },
  {
    q: <>Diketahui {tex(raw`S=\{1,2,3,\dots,10\}`)} dan {tex(raw`A=\{2,3,5,7\}`)}. Komplemen A, yaitu {tex(raw`A^c`)}, adalah ....</>,
    opts: [raw`\{2,3,5,7\}`, raw`\{1,4,6,8,9\}`, raw`\{1,4,6,8,9,10\}`, raw`\{4,6,8,9,10\}`, raw`\{1,2,3,4,5,6,7,8,9,10\}`], ans: 2,
    why: <>Komplemen = anggota semesta S yang bukan anggota A. Hapus 2, 3, 5, 7 dari S: sisanya 1, 4, 6, 8, 9, 10. Cek: {tex(raw`n(A)+n(A^c)=4+6=10=n(S)`)}.</>,
  },
  {
    q: <>Banyak pasangan berurutan pada relasi “faktor dari” dari {tex(raw`A=\{2,3,4\}`)} ke {tex(raw`B=\{4,6,8\}`)} adalah ....</>,
    opts: ["4", "5", "6", "7", "8"], ans: 2,
    why: <>Pasangan: (2,4), (2,6), (2,8), (3,6), (4,4), (4,8). Total 6 pasangan.</>,
  },
  {
    q: <>Misalkan {tex(raw`A=\{1,2,3\}`)}. Himpunan pasangan berurutan berikut yang <b>bukan</b> fungsi dari A ke {tex(raw`\{a,b,c\}`)} adalah ....</>,
    opts: [raw`\{(1,a),(2,b),(3,b)\}`, raw`\{(1,a),(2,a),(3,a)\}`, raw`\{(1,a),(1,b),(2,c),(3,c)\}`, raw`\{(1,c),(2,b),(3,a)\}`, raw`\{(1,a),(2,b),(3,c)\}`], ans: 2,
    why: <>Pada pilihan C, anggota 1 berpasangan dengan <b>dua</b> anggota (a dan b). Syarat “tepat satu pasangan” tidak terpenuhi. Pilihan B tetap fungsi (fungsi konstan).</>,
  },
  {
    q: <>Fungsi {tex("f(x)=3x-2")}. Nilai {tex("f(4)")} adalah ....</>,
    opts: ["6", "8", "10", "12", "14"], ans: 2,
    why: <>{tex(raw`f(4)=3\cdot4-2=12-2=10`)}.</>,
  },
  {
    q: <>Fungsi {tex("f(x)=2x+5")}. Bila {tex("f(a)=13")}, nilai a adalah ....</>,
    opts: ["3", "4", "5", "8", "9"], ans: 1,
    why: <>{tex(raw`2a+5=13\Rightarrow 2a=8\Rightarrow a=4`)}.</>,
  },
  {
    q: <>Fungsi {tex(raw`f:A\to B`)} dengan {tex(raw`A=\{1,2,3\}`)}, {tex(raw`B=\{1,2,3,4,5,6\}`)}, dan {tex("f(x)=x+2")}. Range fungsi tersebut adalah ....</>,
    opts: [raw`\{1,2,3\}`, raw`\{3,4,5\}`, raw`\{1,2,3,4,5,6\}`, raw`\{2,3,4\}`, raw`\{3,4,5,6\}`], ans: 1,
    why: <>f(1) = 3, f(2) = 4, f(3) = 5. Range = anggota B yang benar-benar menjadi hasil = {"{3, 4, 5}"}. Kodomainnya tetap seluruh B.</>,
  },
  {
    q: <>Himpunan A memiliki 3 anggota dan B memiliki 5 anggota. Fungsi dari A ke B yang <b>mungkin</b> dibuat adalah yang bersifat ....</>,
    opts: ["surjektif", "bijektif", "injektif", "korespondensi satu-satu", "tidak ada satu pun"], ans: 2,
    why: <>Ada 3 anggota A dan 5 anggota B, jadi tiap anggota A bisa mendapat pasangan berbeda (injektif). Namun 3 anggota A tidak cukup untuk menjangkau 5 anggota B, sehingga tidak mungkin surjektif, juga tidak bijektif.</>,
  },
  {
    q: <>Banyak pemetaan yang mungkin dari {tex("A")} dengan n(A) = 3 ke {tex("B")} dengan n(B) = 4 adalah ....</>,
    opts: ["12", "24", "64", "81", "7"], ans: 2,
    why: <>Tiap anggota A bebas memilih 4 pasangan: {tex(raw`4\times4\times4=4^3=64`)}. (Dari B ke A: {tex(raw`3^4=81`)}.)</>,
  },
  {
    q: <>Bila n(P) = n(Q) = 5, banyak korespondensi satu-satu dari P ke Q adalah ....</>,
    opts: ["25", "32", "60", "120", "3125"], ans: 3,
    why: <>Anggota pertama P punya 5 pilihan, kedua 4, ketiga 3, dan seterusnya: {tex(raw`5!=5\times4\times3\times2\times1=120`)}.</>,
  },
];
