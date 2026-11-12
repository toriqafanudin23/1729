/* Gambar jaring-jaring kubus (kumpulan persegi) sebagai SVG sebaris, dan pemeriksa
   apakah susunan persegi dapat dilipat menjadi kubus. Murni TypeScript. */

export type Cell = [col: number, row: number];

/** Susunan dapat dilipat menjadi kubus bila menggulirkan kubus melewati semua persegi
    mengecat enam sisi yang berbeda. */
export function isCubeNet(cells: Cell[]): boolean {
  if (cells.length !== 6) return false;
  const key = (c: number, r: number) => `${c},${r}`;
  const set = new Set(cells.map(([c, r]) => key(c, r)));
  type O = { top: number; bottom: number; north: number; south: number; east: number; west: number };
  const painted = new Set<number>();
  const seen = new Set<string>();
  const queue: { cell: Cell; o: O }[] = [{ cell: cells[0], o: { top: 0, bottom: 1, north: 2, south: 3, east: 4, west: 5 } }];
  seen.add(key(cells[0][0], cells[0][1]));
  while (queue.length) {
    const { cell, o } = queue.shift()!;
    painted.add(o.bottom);
    const moves: [number, number, (o: O) => O][] = [
      [1, 0, (a) => ({ ...a, bottom: a.east, east: a.top, top: a.west, west: a.bottom })],
      [-1, 0, (a) => ({ ...a, bottom: a.west, west: a.top, top: a.east, east: a.bottom })],
      [0, -1, (a) => ({ ...a, bottom: a.north, north: a.top, top: a.south, south: a.bottom })],
      [0, 1, (a) => ({ ...a, bottom: a.south, south: a.top, top: a.north, north: a.bottom })],
    ];
    for (const [dc, dr, roll] of moves) {
      const next: Cell = [cell[0] + dc, cell[1] + dr];
      const k = key(next[0], next[1]);
      if (!set.has(k) || seen.has(k)) continue;
      seen.add(k);
      queue.push({ cell: next, o: roll(o) });
    }
  }
  return seen.size === 6 && painted.size === 6;
}

/** SVG kecil untuk pilihan jawaban. Ukuran diatur lewat kelas .mt-net. */
export function netSvg(cells: Cell[], label: string): string {
  const u = 16;
  const minC = Math.min(...cells.map((c) => c[0]));
  const minR = Math.min(...cells.map((c) => c[1]));
  const w = (Math.max(...cells.map((c) => c[0])) - minC + 1) * u + 2;
  const h = (Math.max(...cells.map((c) => c[1])) - minR + 1) * u + 2;
  const rects = cells.map(([c, r]) => `<rect x="${(c - minC) * u + 1}" y="${(r - minR) * u + 1}" width="${u}" height="${u}"/>`).join("");
  return `<svg class="mt-net" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><g fill="#dbe7ff" stroke="#30302e" stroke-width="1.2" stroke-linejoin="round">${rects}</g></svg>`;
}
