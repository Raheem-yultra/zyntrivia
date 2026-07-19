import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Zyntrivia — Full-Stack Engineering & AI Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121316",
          padding: 72,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ color: "#2563eb", fontSize: 22, letterSpacing: 4 }}>
            ENGINEERING &amp; AI AUTOMATION
          </span>
          <span
            style={{
              color: "#e3e2e6",
              fontSize: 84,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            Zyntrivia
          </span>
          <span style={{ color: "#c3c6d7", fontSize: 30, maxWidth: 900 }}>
            We build the software your business is running on spreadsheets.
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #202227",
            paddingTop: 28,
          }}
        >
          <span style={{ color: "#8d90a0", fontSize: 20, letterSpacing: 2 }}>
            [01] SCOPED &nbsp; [02] BUILT &nbsp; [03] SHIPPED
          </span>
          <span style={{ color: "#3ddc97", fontSize: 20, letterSpacing: 2 }}>
            ● LIVE
          </span>
        </div>
      </div>
    ),
    size,
  );
}
