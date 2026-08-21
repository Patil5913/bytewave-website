import { Mark } from "./Mark";

export const NavHeader = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      padding: "0 0 0.9rem",
      marginBottom: "0.5rem",
      borderBottom: "1px solid var(--theme-elevation-100)",
    }}
  >
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        fontSize: "1.05rem",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        color: "var(--theme-elevation-1000)",
      }}
    >
      <Mark size={22} />
      find <span style={{ color: "#2191fb" }}>&amp;</span> hire
    </span>
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        color: "var(--theme-elevation-600)",
        textDecoration: "none",
      }}
    >
      View live site ↗
    </a>
  </div>
);
