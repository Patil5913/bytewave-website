import React from "react";

// Brand mark: a white rounded square with a brand-blue forward slash centered.
export function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="find & hire"
      role="img"
    >
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#ffffff" />
      <path
        d="M20 9 L12 23"
        stroke="#2191fb"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Mark;
