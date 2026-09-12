import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PDE — Prompt-Driven Engineering Knowledge Base";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>
          PDE
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 12, color: "#7dd3fc" }}>
          Prompt-Driven Engineering Knowledge Base
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 36, color: "#94a3b8" }}>
          Domain × Process — how humans and AI work together
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 48, color: "#64748b" }}>
          zixuniaowu/PDE-AI-Knowledge-Base
        </div>
      </div>
    ),
    size
  );
}
