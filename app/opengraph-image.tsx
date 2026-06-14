import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered at build time. Uses only system/default fonts and inline styles so
// it needs no network access — a static social-share card for every page.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#151311",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #2a2620 2px, transparent 0)",
          backgroundSize: "50px 50px",
          color: "#f0ebe0",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 40 }}>
          <span style={{ color: "#3776ab", fontWeight: 700 }}>P</span>
          <span style={{ color: "#e3c04e", fontWeight: 700 }}>y</span>
          <span style={{ marginLeft: 16, color: "#968b7b", fontSize: 28 }}>
            learn-python.haihv.dev
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 36,
          }}
        >
          <span>Learn Python</span>
          <span>Interactively</span>
        </div>
        <div style={{ fontSize: 30, color: "#aaa191", marginTop: 28, maxWidth: 900 }}>
          Lessons, hands-on workshops, and coding labs that run in your browser —
          no setup required.
        </div>
      </div>
    ),
    { ...size }
  );
}
