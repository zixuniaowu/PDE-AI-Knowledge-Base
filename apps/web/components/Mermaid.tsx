"use client";

import { useEffect, useState } from "react";

/**
 * mermaid.render はグローバル状態を持つため、並列呼び出すと片方が失敗する。
 * 全コンポーネントで 1 本のキューに並べて逐次描画する。
 */
let queue: Promise<unknown> = Promise.resolve();
let initialized = false;

async function renderChart(chart: string): Promise<string> {
  const mermaid = (await import("mermaid")).default;
  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "inherit",
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
