"use client";

import { useEffect, useState } from "react";

/** Markdown 内の ```mermaid ブロックを SVG として描画する */
export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        });
        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
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
