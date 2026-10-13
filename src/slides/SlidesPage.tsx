import { useState } from "react";
import { TransformationDeck } from "./TransformationDeck";
import { CalculusDeck } from "./CalculusDeck";
import { Chips } from "./core";

/* Contoh halaman. Daftarkan di router, misalnya path "/slide". */
export default function SlidesPage() {
  const [deck, setDeck] = useState<"geo" | "kal">("geo");
  return (
    <main style={{ padding: "16px 12px", display: "grid", gap: 12 }}>
      <Chips value={deck} onPick={setDeck} items={[{ v: "geo", label: "Transformasi geometri" }, { v: "kal", label: "Limit & turunan" }]} />
      {deck === "geo" ? <TransformationDeck key="geo" /> : <CalculusDeck key="kal" />}
    </main>
  );
}
