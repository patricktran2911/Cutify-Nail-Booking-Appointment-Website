import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #f9a8d4, #e879b0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 110,
        }}
      >
        💅
      </div>
    ),
    { ...size }
  );
}
