// scripts/check-materi.mjs
// Pemeriksa integritas Materi. Jalankan: npm run check:materi
//  - id soal unik dan nomor bab valid,
//  - tiap soal isian: kuncinya diterima penilai, "kesalahan umum" ditolak,
//  - soal pilihan/pernyataan: kunci ada di dalam rentang,
//  - tiap bab memiliki minimal satu cek poin dan slug bab unik.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const load = (file) => import(pathToFileURL(resolve(file)).href);
const { MATERI } = await load("src/materi/materi.ts");
const { QUESTIONS } = await load("src/materi/questions/index.ts");
const { grade, parsePoly } = await load("src/materi/lib/answer.ts");
const nets = await load("src/materi/questions/nets.ts");
const bangunRuang = await load("src/materi/questions/bangun-ruang-sisi-datar.ts");

const problems = [];
const fail = (msg) => problems.push(msg);

/** Contoh jawaban yang pasti benar untuk sebuah spec, dipakai menguji penilai. */
function sample(spec) {
  switch (spec.kind) {
    case "number": return String(Array.isArray(spec.accept) ? spec.accept[0] : spec.accept).replace(".", ",");
    case "set":
    case "tuple": return spec.values.map((v) => String(v)).join("; ");
    case "point": return `(${spec.x}; ${spec.y})`;
    case "poly": return spec.expr;
  }
}

for (const m of MATERI) {
  const qs = QUESTIONS[m.slug];
  if (!qs) { fail(`${m.slug}: belum ada soal di questions/index.ts`); continue; }

  const slugs = new Set();
  m.bab.forEach((b) => {
    if (slugs.has(b.slug)) fail(`${m.slug}: slug bab ganda "${b.slug}"`);
    slugs.add(b.slug);
  });

  const ids = new Set();
  for (const q of qs) {
    if (ids.has(q.id)) fail(`${m.slug}: id soal ganda "${q.id}"`);
    ids.add(q.id);
    if (q.bab < 1 || q.bab > m.bab.length) fail(`${q.id}: nomor bab ${q.bab} di luar rentang 1..${m.bab.length}`);
    if (!q.id.startsWith(`b${q.bab}-`)) fail(`${q.id}: awalan id harus "b${q.bab}-"`);
    if (!q.prompt?.trim() || !q.explanation?.trim()) fail(`${q.id}: prompt/pembahasan kosong`);

    if (q.type === "input") {
      const r = grade(sample(q.spec), q.spec);
      if (!r.ok) fail(`${q.id}: kunci tidak diterima penilai (${JSON.stringify(r)})`);
      if (q.spec.kind === "poly" && !parsePoly(q.spec.expr)) fail(`${q.id}: kunci polinomial tidak terbaca`);
      for (const w of q.wrong ?? []) {
        if (grade(sample(w.spec), q.spec).ok) fail(`${q.id}: "kesalahan umum" ternyata sama dengan kunci`);
      }
    } else if (q.type === "choice") {
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(`${q.id}: indeks kunci pilihan tidak valid`);
    } else if (q.type === "statements") {
      if (!q.items?.length) fail(`${q.id}: tidak ada pernyataan`);
    }
  }

  m.bab.forEach((b, i) => {
    if (!qs.some((q) => q.bab === i + 1)) fail(`${m.slug}/${b.slug}: bab tanpa cek poin`);
  });
  console.log(`[materi] ${m.slug}: ${m.bab.length} bab, ${qs.length} cek poin`);
}

// Soal jaring-jaring kubus: tepat satu pilihan yang dapat dilipat menjadi kubus, dan itu kuncinya.
{
  const valid = bangunRuang.NET_OPTIONS.map((o, i) => (nets.isCubeNet(o.cells) ? i : -1)).filter((i) => i >= 0);
  if (valid.length !== 1 || valid[0] !== bangunRuang.NET_ANSWER) fail(`b2-net: pilihan valid ${JSON.stringify(valid)} tidak sama dengan kunci ${bangunRuang.NET_ANSWER}`);
}

if (problems.length) {
  console.error(`\n${problems.length} masalah:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("[materi] semua pemeriksaan lulus");
