import { createContext, useContext } from "react";
import type { CheckpointRecord } from "./store.ts";

export interface MateriContextValue {
  /** Slug materi yang sedang dibuka. */
  slug: string;
  records: Record<string, CheckpointRecord>;
  save: (id: string, record: CheckpointRecord) => void;
  resetAll: () => void;
}

export const MateriContext = createContext<MateriContextValue | null>(null);

export function useMateri(): MateriContextValue {
  const ctx = useContext(MateriContext);
  if (!ctx) throw new Error("useMateri harus dipakai di dalam <MateriProvider>.");
  return ctx;
}
