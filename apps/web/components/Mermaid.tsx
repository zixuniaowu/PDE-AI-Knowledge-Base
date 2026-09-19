"use client";

import { useEffect, useState } from "react";

/**
 * mermaid.render はグローバル状態を持つため、並列呼び出すと片方が失敗する。
 * 全コンポーネントで 1 本のキューに並べて逐次描画する。
 */
let queue: Promise<unknown> = Promise.resolve();
let initialized = false;

/** サイトのカラースキーム（:root CSS 変数）に合わせた mermaid テーマ */
function mermaidTheme(): {
  theme: "default" | "dark";
  themeVariables: Record<string, string>;
} {
  const dark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) {
    return {
      theme: "dark",
      themeVariables: {
        background: "#111a2e",
        primaryColor: "#1e3a5f",
        primaryTextColor: "#e2e8f0",
        primaryBorderColor: "#60a5fa",
        secondaryColor: "#2e2447",
        secondaryTextColor: "#e2e8f0",
        secondaryBorderColor: "#a78bfa",
        tertiaryColor: "#164e5a",
        tertiaryTextColor: "#e2e8f0",
        tertiaryBorderColor: "#22d3ee",
        lineColor: "#94a3b8",
        textColor: "#e2e8f0",
        mainBkg: "#1e3a5f",
        nodeBorder: "#60a5fa",
        fontSize: "14px",
      },
    };
  }
  return { theme: "default", themeVariables: { fontSize: "14px" } };
}

async function renderChart(chart: string): Promise<string> {
  const mermaid = (await import("mermaid")).default;
  if (!initialized) {
    const { theme, themeVariables } = mermaidTheme();
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      fontFamily: "inherit",
      flowchart: { useMaxWidth: true },
      sequence: { useMaxWidth: true },
      ...{ theme, themeVariables },
    });
    initialized = true;
  }
  const run = async () => {
    const { svg: rendered } = await mermaid.render(
      `mmd-${Math.random().toString(36).slice(2)}`,
      chart
    );
    return rendered;
  };
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}

/** Markdown 内の ```mermaid ブロックを SVG として描画する */
export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    renderChart(chart)
      .then((rendered) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (failed) {
    return <pre className="mermaid-fallback">{chart}</pre>;
  }
  return (
    <div
      className="mermaid-figure"
      /* mermaid.render の出力（自コンテンツ由来）を描画する */
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
