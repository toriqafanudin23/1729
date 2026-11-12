/* Format angka untuk tampilan materi: koma desimal, minus sebenarnya (−). */

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Teks biasa: 0,5 dan −3. Nilai ≈ 0 ditulis 0. */
export function num(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const r = round2(n);
  const text = (Object.is(r, -0) ? 0 : r).toLocaleString("id-ID", { maximumFractionDigits: 2, useGrouping: false });
  return text.replace("-", "\u2212");
}

/** Untuk KaTeX: 0{,}5 dan -3. */
export function tex(n: number): string {
  if (!Number.isFinite(n)) return "\\text{—}";
  const r = round2(n);
  return String(Object.is(r, -0) ? 0 : r).replace(".", "{,}");
}

/** Suku dalam persamaan: coef + simbol, tanpa angka 1 di depan simbol. */
function term(coef: number, symbol: string, first: boolean): string {
  if (coef === 0) return "";
  const abs = Math.abs(coef);
  const body = symbol !== "" && abs === 1 ? symbol : `${tex(abs)}${symbol}`;
  if (first) return coef < 0 ? `-${body}` : body;
  return ` ${coef < 0 ? "-" : "+"} ${body}`;
}

/** ax² + bx + c dalam TeX, tanpa suku bernilai nol. */
export function quadTex(a: number, b: number, c: number): string {
  let out = "";
  for (const [coef, symbol] of [
    [a, "x^{2}"],
    [b, "x"],
    [c, ""],
  ] as const) {
    out += term(coef, symbol, out === "");
  }
  return out === "" ? "0" : out;
}

/** (x − p) atau (x + p) dalam TeX. */
export function factorTex(p: number): string {
  if (p === 0) return "x";
  return p > 0 ? `(x-${tex(p)})` : `(x+${tex(-p)})`;
}

/** Bentuk a(x − p)² + q dalam TeX. */
export function vertexTex(a: number, p: number, q: number): string {
  const lead = a === 1 ? "" : a === -1 ? "-" : tex(a);
  const sq = p === 0 ? "x^{2}" : `(x${p > 0 ? "-" : "+"}${tex(Math.abs(p))})^{2}`;
  const tail = q === 0 ? "" : q > 0 ? `+${tex(q)}` : `-${tex(-q)}`;
  return `${lead}${sq}${tail}`;
}
