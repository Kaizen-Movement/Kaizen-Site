import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kaizen Subliminals";
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0C0407",
          backgroundImage:
            "radial-gradient(circle at 50% 40%, #200F14 0%, #0C0407 70%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 999,
            border: "3px solid #C9A227",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 70,
              height: 70,
              borderRadius: 999,
              border: "2px solid #C9A227",
              opacity: 0.7,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#C9A227",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            color: "#F3EFE6",
            letterSpacing: "0.02em",
            fontWeight: 400,
          }}
        >
          KAIZEN
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#C9A227",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginTop: 16,
          }}
        >
          Subliminals
        </div>
      </div>
    ),
    { ...size }
  );
}
