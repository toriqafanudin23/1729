import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MateriContext } from "./context";
import { clearStore, readStore, writeStore, type CheckpointRecord, type ProgressStore } from "./store.ts";

/** Menyimpan jawaban cek poin siswa dan membagikannya ke semua komponen di dalam bab. */
export function MateriProvider({ slug, babSlug, children }: { slug: string; babSlug?: string; children: ReactNode }) {
  const [store, setStore] = useState<ProgressStore>(() => readStore(slug));

  // Pindah materi: baca progres milik materi itu.
  useEffect(() => {
    setStore(readStore(slug));
  }, [slug]);

  // Ingat bab terakhir yang dibuka untuk tombol "Lanjutkan".
  useEffect(() => {
    if (!babSlug) return;
    setStore((prev) => {
      if (prev.last === babSlug) return prev;
      const next = { ...prev, last: babSlug };
      writeStore(slug, next);
      return next;
    });
  }, [slug, babSlug]);

  // Tab lain mengubah progres yang sama.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key.endsWith(`.${slug}`)) setStore(readStore(slug));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [slug]);

  const save = useCallback(
    (id: string, record: CheckpointRecord) => {
      setStore((prev) => {
        const next = { ...prev, cp: { ...prev.cp, [id]: record } };
        writeStore(slug, next);
        return next;
      });
    },
    [slug],
  );

  const resetAll = useCallback(() => {
    clearStore(slug);
    setStore({ v: 1, cp: {}, last: undefined });
  }, [slug]);

  const value = useMemo(() => ({ slug, records: store.cp, save, resetAll }), [slug, store.cp, save, resetAll]);
  return <MateriContext.Provider value={value}>{children}</MateriContext.Provider>;
}
