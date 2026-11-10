import { ImageResponse } from "next/og";
export const alt =
  "DERBY MANUAL & AUTO — Learn with Confidence. Drive with Freedom.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#102C46",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "80px",
        borderBottom: "16px solid #F5B82E",
      }}
    >
      <div style={{ fontSize: 28, color: "#F5B82E" }}>DERBY MANUAL & AUTO</div>
      <div
        style={{
          fontSize: 76,
          marginTop: 70,
          lineHeight: 1.1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>Learn with confidence.</span>
        <span>Drive with freedom.</span>
      </div>
      <div style={{ fontSize: 26, marginTop: 35 }}>
        Manual · Automatic · Intensive
      </div>
    </div>,
    size,
  );
}
