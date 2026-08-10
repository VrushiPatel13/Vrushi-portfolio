import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — AI Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0c0b0a",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Folio rule */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid #3a332d",
            paddingTop: 22,
            fontSize: 19,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex", color: "#e9a63c" }}>{profile.edition}</span>
          <span style={{ display: "flex", color: "#8d8578" }}>{profile.role}</span>
          <span style={{ display: "flex", color: "#8d8578" }}>
            {profile.locationLine}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 148,
              fontWeight: 800,
              letterSpacing: -6,
              color: "#fbf7f0",
              lineHeight: 0.86,
            }}
          >
            Vrushi
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 148,
              fontWeight: 800,
              letterSpacing: -6,
              color: "#e9a63c",
              lineHeight: 0.86,
              fontStyle: "italic",
            }}
          >
            Patel
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #3a332d",
            paddingTop: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#bdb3a5",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            {profile.positioning}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 19,
              letterSpacing: 3,
              color: "#8d8578",
              textTransform: "uppercase",
            }}
          >
            {profile.email}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
