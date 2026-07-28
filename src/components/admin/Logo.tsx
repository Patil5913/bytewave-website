import React from "react";

// Login-screen / large brand mark for the Payload admin. Kept as plain
// single-line text so it never wraps or clips inside Payload's logo slot.
export const Logo = () => (
  <span
    style={{
      fontFamily: "var(--font-instrument-sans), Georgia, serif",
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
      color: "var(--theme-elevation-1000)",
    }}
  >
    find <span style={{ color: "#2191fb" }}>&amp;</span> hire
  </span>
);

export default Logo;
