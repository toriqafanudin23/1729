import type { ReactNode } from "react";

export type FeedbackKind = "ok" | "bad" | "warn";
const ICON: Record<FeedbackKind, string> = { ok: "✓", bad: "✕", warn: "!" };

export function Feedback({ kind, children }: { kind: FeedbackKind; children: ReactNode }) {
  return (
    <p className={`lt-feedback lt-feedback--${kind}`} role="status">
      <span className="lt-feedback__icon" aria-hidden>
        {ICON[kind]}
      </span>
      <span>{children}</span>
    </p>
  );
}
