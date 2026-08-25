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
          background: "#05030f",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Cabinet rail */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid #2a1f5c",
            paddingTop: 22,
            fontSize: 19,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex", color: "#22e8ff" }}>{"Portfolio 2026"}</span>
          <span style={{ display: "flex", color: "#6a6d9c" }}>{profile.role}</span>
          <span style={{ display: "flex", color: "#6a6d9c" }}>
            {profile.location}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 148,
              fontWeight: 800,
              letterSpacing: -6,
              color: "#ffffff",
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
              color: "#ff3d9a",
              lineHeight: 0.86,
              textTransform: "uppercase",
            }}
          >
            Patel
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #2a1f5c",
            paddingTop: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#9fa2cf",
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
              color: "#6a6d9c",
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
