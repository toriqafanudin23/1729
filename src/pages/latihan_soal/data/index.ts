import type { Material } from "../types";

const MATERIAL_MODULES = import.meta.glob<{ default: Material }>("./*.ts");

export async function getMaterial(slug: string | undefined): Promise<Material | undefined> {
  if (!slug) return undefined;
  const filename = slug.replaceAll("-", "_");
  const load = MATERIAL_MODULES[`./${filename}.ts`];
  if (!load) return undefined;
  const module = await load();
  return module.default;
}
