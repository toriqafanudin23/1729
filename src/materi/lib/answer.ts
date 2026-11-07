/* ------------------------------------------------------------------ *
 *  Penilaian jawaban isian untuk cek poin pada Materi.
 *
 *  Berkas ini murni TypeScript (tanpa React) agar mudah diuji. Jenis jawaban:
 *   - number  : satu angka. Mengerti "1.728", "4,5", "-1/2", "x = 3", "125 cm³".
 *   - set     : beberapa angka, urutan bebas (akar-akar): "2 dan -3", "x=2, x=-3".
 *   - tuple   : beberapa angka, urutan penting: "2, -3, 5".
 *   - point   : pasangan koordinat: "(3, -4)", "3;-4", "P(3,-4)".
 *   - poly    : bentuk aljabar yang setara: "x^2 + x - 6" = "(x-2)(x+3)" = "x²+x−6".
 * ------------------------------------------------------------------ */

export type AnswerSpec =
  | { kind: "number"; accept: number | number[]; tol?: number }
  | { kind: "set"; values: number[]; tol?: number }
  | { kind: "tuple"; values: number[]; tol?: number }
  | { kind: "point"; x: number; y: number; tol?: number }
  | { kind: "poly"; expr: string; shape?: "vertex" | "factored" };

export type GradeResult =
  | { ok: true }
  | { ok: false; reason: "empty" | "format" | "shape" | "wrong"; message?: string };

const DEFAULT_TOL = 1e-9;

const close = (a: number, b: number, tol = DEFAULT_TOL) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));

/* ───────── Angka ───────── */

/** Satu bentuk tulisan angka, tanpa label ("x =") dan tanpa satuan. */
function stripLabelAndUnit(raw: string): string {
  let s = raw
    .replace(/[\u2212\u2013\u2014]/g, "-") // minus Unicode
    .replace(/[\s\u00a0]/g, "");
  s = s.replace(/^[a-zA-Z](?:\([a-zA-Z]\))?[\u2080-\u2089_0-9]*=/, ""); // x=, x1=, f(x)=, D=
  s = s.replace(/^rp\.?/i, ""); // Rp25.000
  const m = s.match(/^([-+]?[\d.,]+(?:\/[\d.,]+)?)([a-zA-Z\u00b0%\u00b5\u00b2\u00b3].*)?$/);
  if (!m) return s;
  const unit = m[2] ?? "";
  // "6x6", "1e3", "3^2": ekor yang bukan satuan dibiarkan agar tidak lolos keliru.
  if (/^[xX\u00d7]/.test(unit) || /^[eE]\d/.test(unit)) return s;
  return m[1];
}

/** Semua tafsiran angka dari satu teks. Titik/koma dapat berarti ribuan atau desimal. */
export function parseNumberCandidates(raw: string): number[] {
  const text = stripLabelAndUnit(String(raw ?? ""));
  if (!text) return [];

  const frac = text.match(/^([-+]?[\d.,]+)\/([\d.,]+)$/);
  if (frac) {
    const top = plainCandidates(frac[1]);
    const bottom = plainCandidates(frac[2]);
    const out: number[] = [];
    for (const t of top) for (const b of bottom) if (b !== 0 && !out.some((v) => close(v, t / b))) out.push(t / b);
    return out;
  }
  return plainCandidates(text);
}

function plainCandidates(text: string): number[] {
  if (!/^[-+]?[\d.,]+$/.test(text) || !/\d/.test(text)) return [];
  const out: number[] = [];
  const push = (v: number) => {
    if (Number.isFinite(v) && !out.some((o) => close(o, v))) out.push(v);
  };
  if (/^[-+]?\d{1,3}([.,]\d{3})+$/.test(text)) push(parseFloat(text.replace(/[.,]/g, "")));

  const lastDot = text.lastIndexOf(".");
  const lastComma = text.lastIndexOf(",");
  if (lastDot !== -1 && lastComma !== -1) {
    const dec = lastDot > lastComma ? "." : ",";
    const thou = dec === "." ? "," : ".";
    push(parseFloat(text.split(thou).join("").replace(dec, ".")));
  } else if (lastDot !== -1 || lastComma !== -1) {
    const sep = lastDot !== -1 ? "." : ",";
    if (text.split(sep).length === 2) push(parseFloat(text.replace(sep, ".")));
  } else {
    push(parseFloat(text));
  }
  return out;
}

/* ───────── Daftar angka ───────── */

/** Beberapa cara memenggal "2, -3" / "1,5 dan 3" / "(3;-4)" karena koma bisa desimal. */
function tokenizations(raw: string): string[][] {
  let s = String(raw ?? "")
    .replace(/[\u2212\u2013\u2014]/g, "-")
    .trim();
  s = s.replace(/^[A-Za-z]+(?=\s*\()/, ""); // P(3,-4) -> (3,-4)
  s = s.replace(/^[A-Za-z][A-Za-z ]+\s*=\s*/, ""); // "titik puncak = 3,-4" (label dua huruf atau lebih)
  s = s
    .replace(/[{}[\]()]/g, " ")
    .replace(/\b(dan|atau|and|or)\b/gi, ";")
    .trim();
  const clean = (parts: string[]) => parts.map((p) => p.trim()).filter(Boolean);
  const alts: string[][] = [clean(s.split(";"))];
  alts.push(clean(s.split(/[;,]/)));
  alts.push(clean(s.split(/;|,\s+/)));
  if (!/[;,]/.test(s)) alts.push(clean(s.split(/\s+/)));
  const seen = new Set<string>();
  return alts.filter((a) => {
    const key = a.join("\u0000");
    if (seen.has(key) || a.length === 0) return false;
    seen.add(key);
    return true;
  });
}

function matchSet(tokens: number[][], expected: number[], tol?: number): boolean {
  const exp: number[] = [];
  for (const e of expected) if (!exp.some((x) => close(x, e, tol))) exp.push(e);
  const used = new Set<number>();
  for (const cands of tokens) {
    const idx = exp.findIndex((e) => cands.some((c) => close(c, e, tol)));
    if (idx < 0) return false;
    used.add(idx);
  }
  return used.size === exp.length;
}

function matchTuple(tokens: number[][], expected: number[], tol?: number): boolean {
  if (tokens.length !== expected.length) return false;
  return expected.every((e, i) => tokens[i].some((c) => close(c, e, tol)));
}

function listMatches(raw: string, expected: number[], ordered: boolean, tol?: number): boolean {
  return tokenizations(raw).some((tokens) => {
    const parsed = tokens.map((t) => parseNumberCandidates(t));
    if (parsed.some((c) => c.length === 0)) return false;
    return ordered ? matchTuple(parsed, expected, tol) : matchSet(parsed, expected, tol);
  });
}

/** Bisakah teks dibaca sebagai daftar angka (apa pun nilainya)? */
function isReadableList(raw: string): boolean {
  return tokenizations(raw).some((tokens) => tokens.every((t) => parseNumberCandidates(t).length > 0));
}

/* ───────── Polinomial ───────── */

type Poly = number[]; // indeks = pangkat x

const trim = (p: Poly): Poly => {
  const q = p.slice();
  while (q.length > 1 && Math.abs(q[q.length - 1]) < 1e-12) q.pop();
  return q;
};
const add = (p: Poly, q: Poly, sign = 1): Poly => {
  const n = Math.max(p.length, q.length);
  return Array.from({ length: n }, (_, i) => (p[i] ?? 0) + sign * (q[i] ?? 0));
};
const mul = (p: Poly, q: Poly): Poly => {
  const r: Poly = Array.from({ length: p.length + q.length - 1 }, () => 0);
  p.forEach((a, i) => q.forEach((b, j) => (r[i + j] += a * b)));
  return r;
};
const isConst = (p: Poly) => trim(p).length === 1;

class PolyError extends Error {}

function normalizePoly(raw: string): string {
  return String(raw ?? "")
    .toLowerCase()
    .replace(/[\u2212\u2013\u2014]/g, "-")
    .replace(/[\u00d7\u00b7]/g, "*")
    .replace(/\s+/g, "")
    .replace(/\u00b2/g, "^2")
    .replace(/\u00b3/g, "^3")
    .replace(/\*\*/g, "^")
    .replace(/[{[]/g, "(")
    .replace(/[}\]]/g, ")")
    .replace(/^(f\(x\)|y|f)=/, "");
}

/** Mengubah "2x^2 - 12x + 10" atau "2(x-1)(x-5)" menjadi koefisien [10, -12, 2]. null bila tidak terbaca. */
export function parsePoly(raw: string): Poly | null {
  const s = normalizePoly(raw);
  if (!s || s.includes("=")) return null;
  let i = 0;

  const peek = () => s[i];
  const startsFactor = () => {
    const ch = peek();
    return ch !== undefined && (ch === "x" || ch === "(" || /\d/.test(ch) || ch === ".");
  };

  function number(): Poly {
    const m = s.slice(i).match(/^\d*[.,]?\d+|^\d+/);
    if (!m) throw new PolyError();
    i += m[0].length;
    return [parseFloat(m[0].replace(",", "."))];
  }

  function atom(): Poly {
    const ch = peek();
    if (ch === "(") {
      i++;
      const inner = expr();
      if (peek() !== ")") throw new PolyError();
      i++;
      return inner;
    }
    if (ch === "x") {
      i++;
      return [0, 1];
    }
    return number();
  }

  function power(): Poly {
    let base = atom();
    while (peek() === "^") {
      i++;
      const m = s.slice(i).match(/^\d+/);
      if (!m) throw new PolyError();
      i += m[0].length;
      const n = parseInt(m[0], 10);
      if (n > 6) throw new PolyError();
      let r: Poly = [1];
      for (let k = 0; k < n; k++) r = mul(r, base);
      base = r;
    }
    return base;
  }

  function factor(): Poly {
    if (peek() === "-") {
      i++;
      return mul([-1], factor());
    }
    if (peek() === "+") {
      i++;
      return factor();
    }
    return power();
  }

  function term(): Poly {
    let r = factor();
    for (;;) {
      if (peek() === "*") {
        i++;
        r = mul(r, factor());
      } else if (peek() === "/") {
        i++;
        const d = factor();
        if (!isConst(d) || Math.abs(d[0]) < 1e-12) throw new PolyError();
        r = mul(r, [1 / d[0]]);
      } else if (startsFactor()) {
        r = mul(r, power());
      } else break;
    }
    return r;
  }

  function expr(): Poly {
    let r = term();
    while (peek() === "+" || peek() === "-") {
      const sign = peek() === "+" ? 1 : -1;
      i++;
      r = add(r, term(), sign);
    }
    return r;
  }

  try {
    const result = expr();
    if (i !== s.length) return null;
    const t = trim(result);
    return t.length > 7 ? null : t;
  } catch {
    return null;
  }
}

const polyEqual = (p: Poly, q: Poly) => {
  const a = trim(p);
  const b = trim(q);
  const n = Math.max(a.length, b.length);
  for (let k = 0; k < n; k++) if (!close(a[k] ?? 0, b[k] ?? 0, 1e-9)) return false;
  return true;
};

function shapeOk(raw: string, shape: "vertex" | "factored"): boolean {
  const s = normalizePoly(raw);
  if (shape === "vertex") return /\([^()]*x[^()]*\)\^2/.test(s);
  return (s.match(/\(/g) ?? []).length >= 2 || /^[-+]?[\d.,]*x\(/.test(s);
}

/* ───────── Pintu masuk ───────── */

export function grade(input: string, spec: AnswerSpec): GradeResult {
  if (input === null || input === undefined || String(input).trim() === "") return { ok: false, reason: "empty" };

  switch (spec.kind) {
    case "number": {
      const cands = parseNumberCandidates(input);
      if (cands.length === 0) return { ok: false, reason: "format", message: "Tulis jawabanmu sebagai angka, misalnya 12 atau -3,5." };
      const keys = Array.isArray(spec.accept) ? spec.accept : [spec.accept];
      return keys.some((k) => cands.some((c) => close(c, k, spec.tol))) ? { ok: true } : { ok: false, reason: "wrong" };
    }
    case "set":
    case "tuple": {
      if (!isReadableList(input)) {
        return { ok: false, reason: "format", message: "Tulis angka-angkanya dipisah koma, misalnya 2, -3." };
      }
      return listMatches(input, spec.values, spec.kind === "tuple", spec.tol) ? { ok: true } : { ok: false, reason: "wrong" };
    }
    case "point": {
      if (!isReadableList(input)) {
        return { ok: false, reason: "format", message: "Tulis sebagai pasangan koordinat, misalnya (3, -4)." };
      }
      return listMatches(input, [spec.x, spec.y], true, spec.tol) ? { ok: true } : { ok: false, reason: "wrong" };
    }
    case "poly": {
      const got = parsePoly(input);
      if (!got) {
        return { ok: false, reason: "format", message: "Bentuk aljabar belum terbaca. Contoh penulisan: 2x^2 - 12x + 10 atau 2(x-1)(x-5)." };
      }
      const want = parsePoly(spec.expr);
      if (!want) throw new Error(`Kunci polinomial tidak terbaca: ${spec.expr}`);
      if (!polyEqual(got, want)) return { ok: false, reason: "wrong" };
      if (spec.shape && !shapeOk(input, spec.shape)) {
        return {
          ok: false,
          reason: "shape",
          message:
            spec.shape === "vertex"
              ? "Nilainya sudah setara, tetapi tuliskan dalam bentuk puncak: a(x - p)^2 + q."
              : "Nilainya sudah setara, tetapi tuliskan dalam bentuk faktor: a(x - p)(x - q).",
        };
      }
      return { ok: true };
    }
  }
}

/** Apakah jawaban cocok dengan salah satu "jawaban keliru yang umum"? */
export function matches(input: string, spec: AnswerSpec): boolean {
  try {
    return grade(input, spec).ok;
  } catch {
    return false;
  }
}
