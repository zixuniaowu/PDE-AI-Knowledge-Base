import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PDE — Product Design Engineer Knowledge Base";

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
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>
          PDE
        </div>
        <div style={{ display: "flex", fontSize: 38, marginTop: 12, color: "#7dd3fc" }}>
          Product Design Engineer Knowledge Base
        </div>
        <div style={{ display: "flex", fontSize: 27, marginTop: 36, color: "#94a3b8" }}>
          課題を考え、設計し、AI と一緒にコードを書く — 領域 × 工程の実践知
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 44, color: "#64748b" }}>
          zixuniaowu/PDE-AI-Knowledge-Base
        </div>
      </div>
    ),
    size
  );
}
