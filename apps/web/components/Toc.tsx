import Link from "next/link";
import { buildToc } from "@/lib/toc";

export function Toc({ markdown }: { markdown: string }) {
  const items = buildToc(markdown);
  if (items.length < 3) return null;

  return (
    <nav aria-label="目次" className="toc">
      <p className="section-label" style={{ marginTop: 24 }}>
        目次
      </p>
      <ol style={{ margin: "0 0 24px", paddingLeft: 20, fontSize: 14, color: "var(--text-sub)" }}>
        {items.map((item) => (
          <li key={item.id} style={{ margin: "2px 0" }}>
            <Link href={`#${item.id}`}>{item.text}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
