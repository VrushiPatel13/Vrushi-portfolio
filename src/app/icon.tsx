import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05030f",
          border: "2px solid #22e8ff",
          color: "#22e8ff",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: -0.5,
        }}
      >
        VP
      </div>
    ),
    { ...size },
  );
}
