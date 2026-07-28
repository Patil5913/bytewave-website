import React from "react";

// Compact nav mark for the Payload admin sidebar. inline-block + nowrap so the
// narrow icon slot can't stack the characters vertically.
export const Icon = () => (
  <span
    style={{
      display: "inline-block",
      whiteSpace: "nowrap",
      fontFamily: "var(--font-instrument-sans), Georgia, serif",
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      color: "var(--theme-elevation-1000)",
    }}
  >
    f<span style={{ color: "#2191fb" }}>&amp;</span>h
  </span>
);

export default Icon;
