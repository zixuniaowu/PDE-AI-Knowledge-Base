import Link from "next/link";
import { listPatterns } from "@pde/content-core";
import { StatusBadge } from "@/components/Badges";

export const metadata = { title: "パターン" };

export default function PatternsPage() {
  const patterns = listPatterns();

  return (
    <div>
      <h1>AI 活用パターン</h1>
      <p className="lead">領域に依存しない、AI 活用の基本パターン集。</p>
      <div className="grid grid-2">
        {patterns.map((p) => (
          <Link key={p.data.id} href={`/patterns/${p.data.id}`} className="card">
            <StatusBadge status={p.data.status} />
            <h3>✨ {p.data.title}</h3>
            <p>{p.data.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
