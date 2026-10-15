const PUBLIC_SIMULATION_SLUGS = new Set([
  "fungsi-kuadrat",
  "sistem-linear",
  "trigonometri",
  "teorema-pythagoras",
]);

const PUBLIC_SLIDE_SLUGS = new Set([
  "himpunan-relasi-fungsi",
  "sistem-persamaan-linear",
  "pertidaksamaan-linear",
  "program-linear",
]);

export function isSimulationPublic(slug: string) {
  return PUBLIC_SIMULATION_SLUGS.has(slug);
}

export function isSlidePublic(slug: string) {
  return PUBLIC_SLIDE_SLUGS.has(slug);
}
