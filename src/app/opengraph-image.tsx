import { ImageResponse } from "next/og";

export const alt = "Psyixel — Between the visible and the imagined.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card, rendered at build time. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0c0b0d", color: "#ece5d8", padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 8 }}>
          <span>PSYIXEL —</span>
          <span style={{ color: "#ab92d9" }}>STUDIO / PHOTOGRAPHY / ART / WORDS / MUSIC</span>
        </div>
        <div style={{ display: "flex", fontSize: 250, fontWeight: 900, letterSpacing: -12, lineHeight: 0.8 }}>PSYIXEL</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 120, height: 4, background: "#ab92d9" }} />
          <span style={{ fontSize: 44, fontStyle: "italic", color: "#c9b6ec" }}>Between the visible and the imagined.</span>
        </div>
      </div>
    ),
    size,
  );
}
