import { Rich } from "./Rich";

/** Pembahasan tersembunyi. Memakai <details> bawaan: aksesibel dan tanpa state. */
export function Explanation({ html }: { html: string }) {
  return (
    <details className="lt-expl">
      <summary>
        <span>Lihat pembahasan</span>
      </summary>
      <Rich className="lt-expl__body" html={html} />
    </details>
  );
}
