import React from "react";

// Compact nav mark. Single flat text node (no child spans) so Payload's icon
// slot CSS can't stack the letters vertically.
export const Icon = () => (
  <span
    style={{
      display: "inline-block",
      whiteSpace: "nowrap",
      fontFamily: "var(--font-instrument-sans), Georgia, serif",
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      color: "var(--theme-elevation-1000)",
    }}
  >
    f&amp;h
  </span>
);

export default Icon;
