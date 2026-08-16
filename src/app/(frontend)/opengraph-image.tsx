import { ImageResponse } from "next/og";

export const alt = "find & hire — hire verified, or get verified and hired";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CANVAS = "#0a0a0a";
const INK = "#f7f6f3";
const BRAND = "#2191fb";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          color: INK,
          padding: 80,
          // Blueprint grid — the same language as the on-site charts.
          backgroundImage:
            "linear-gradient(to right, rgba(247,246,243,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(247,246,243,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, letterSpacing: -1 }}>
          find <span style={{ color: BRAND, padding: "0 12px" }}>&amp;</span>{" "}
          hire
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 940,
          }}
        >
          <div style={{ fontSize: 74, lineHeight: 1.05, letterSpacing: -2 }}>
            Verified professionals. The teams that need them.
          </div>
          <div style={{ fontSize: 30, color: "rgba(247,246,243,0.6)" }}>
            Hire without the resume pile. Get hired without the void.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "rgba(247,246,243,0.55)",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: BRAND,
            }}
          />
          findandhire.co
        </div>
      </div>
    ),
    size,
  );
}
