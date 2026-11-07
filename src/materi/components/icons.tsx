import type { ReactNode } from "react";

/* Ikon SVG kecil, digambar langsung supaya tidak bergantung pada nama ikon pustaka. */
const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

const make = (children: ReactNode) =>
  function Icon({ size = 18 }: { size?: number }) {
    return (
      <svg {...base} width={size} height={size}>
        {children}
      </svg>
    );
  };

export const IconCheck = make(<path d="M5 12.5l4.5 4.5L19 7.5" />);
export const IconCross = make(<path d="M6 6l12 12M18 6L6 18" />);
export const IconBulb = make(
  <>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
  </>,
);
export const IconEye = make(
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const IconArrowLeft = make(<path d="M19 12H5M11 6l-6 6 6 6" />);
export const IconArrowRight = make(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IconList = make(<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />);
export const IconPlay = make(<path d="M7 4.5v15l12-7.5z" />);
export const IconPause = make(<path d="M8 5v14M16 5v14" />);
export const IconReset = make(
  <>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </>,
);
export const IconTarget = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </>,
);
export const IconFlask = make(
  <>
    <path d="M9 3h6M10 3v6.2L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3" />
    <path d="M7.5 15h9" />
  </>,
);
