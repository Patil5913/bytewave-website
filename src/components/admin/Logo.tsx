import { Mark } from "./Mark";

export const Logo = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.6rem",
      whiteSpace: "nowrap",
    }}
  >
    <Mark size={34} />
    <span
      style={{
        fontSize: "1.35rem",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        color: "var(--theme-elevation-1000)",
      }}
    >
      find <span style={{ color: "#2191fb" }}>&amp;</span> hire
    </span>
  </span>
);
