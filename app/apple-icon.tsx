import { ImageResponse } from "next/og";

// iOS home-screen icon — the same snake mark as app/icon.svg, rasterized to a
// 180x180 PNG via next/og. The SVG is rendered through an <img> data URI so the
// two icons can never drift.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const SNAKE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#3776ab"/>
  <path d="M21.5 25 C 22 20.5 10 20.5 10 16 C 10 11.5 21.5 12 20.5 8.6" fill="none" stroke="#ffd43b" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="20.3" cy="8.2" r="4.3" fill="#ffd43b"/>
  <path d="M24.2 8 L27.3 8 M27.3 8 L28.2 7.2 M27.3 8 L28.2 8.8" fill="none" stroke="#c2402e" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="19.2" cy="7.2" r="1.25" fill="#ffffff"/>
  <circle cx="21.5" cy="7.2" r="1.25" fill="#ffffff"/>
  <circle cx="19.4" cy="7.4" r="0.65" fill="#1c1917"/>
  <circle cx="21.3" cy="7.4" r="0.65" fill="#1c1917"/>
</svg>`;

export default function AppleIcon() {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(SNAKE)}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img src={src} width={180} height={180} alt="" />
      </div>
    ),
    { ...size }
  );
}
