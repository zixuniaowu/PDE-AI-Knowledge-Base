import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDomain,
  getIntersection,
  getPhase,
  listDomains,
  listPhases,
  listUseCases,
} from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { StatusBadge } from "@/components/Badges";
import { extractSections } from "@/lib/markdown";

export function generateStaticParams() {
  return listDomains().flatMap((d) =>
    listPhases().map((p) => ({
      domain: d.id,
      method: p.data.method,
      phase: p.data.id,
    }))
  );
}

export default async function IntersectionPage({
  params,
}: {
  params: { domain: string; method: string; phase: string };
}) {
  const { domain, method, phase } = params;
  const knownDomain = listDomains().some((d) => d.id === domain);
  const knownPhase = listPhases().some((p) => p.data.method === method && p.data.id === phase);
  if (!knownDomain || !knownPhase) notFound();

  const dom = getDomain(domain);
  const ph = getPhase(method, phase);
  const sections = extractSections(ph.content);
  const note = getIntersection(domain, method, phase);

  // この交点に関連するユースケース（phaseLinks で紐づくもの）
  const related = listUseCases(domain).filter((uc) =>
    uc.data.phaseLinks.some((l) => l.method === method && l.phase === phase)
  );

  return (
    <article>
      <p style={{ margin: 0 }}>
        <Link href="/matrix">← マトリクス</Link>
      </p>
      <h1>
        {dom.meta.icon ?? "📦"} {dom.meta.name}{" "}
        <span style={{ color: "var(--text-faint)" }}>×</span> {ph.data.title}
      </h1>
      <p className="lead">
        「{dom.meta.name}」を「{ph.data.title}」で進めるときの、人と AI
        の協働の入り口です。
      </p>

      {note && (
        <section style={{ marginBottom: 24 }}>
          <p style={{ margin: "0 0 8px" }}>
            <span className="badge badge-reviewed">📝 交点ノート</span>
            <StatusBadge status={note.data.status} />
            <span style={{ color: "var(--text-faint)", fontSize: 13 }}>
              {" "}
              · {note.data.title}
            </span>
          </p>
          <Prose
            markdown={note.content}
            linkBase={`/matrix/${domain}/${method}/${phase}`}
          />
        </section>
      )}

      <h2>
        <span className="badge badge-human">FDE</span> FDEの仕事
      </h2>
      <Prose
        markdown={sections["FDEの仕事"] ?? "（この工程の定義を待っています）"}
        linkBase={`/process/${method}`}
      />

      <h2>
        <span className="badge badge-ai">AI</span> AIツールの使いどころ
      </h2>
      <Prose
        markdown={sections["AIツールの使いどころ"] ?? "（この工程の定義を待っています）"}
        linkBase={`/process/${method}`}
      />

      <p>
        <Link href={`/process/${method}/${phase}`}>
          → {ph.data.title} 工程の詳細（協働の進め方・受け入れ基準）
        </Link>
      </p>

      <h2>この交点のユースケース</h2>
      <div className="grid grid-2">
        {related.map((uc) => (
          <Link key={uc.data.id} href={`/domains/${domain}/${uc.data.id}`} className="card">
            <h3>{uc.data.title}</h3>
            <p>{uc.data.summary}</p>
          </Link>
        ))}
        {related.length === 0 && (
          <div className="notice">
            この交点専用の知見はまだありません。
            <strong>
              {dom.meta.name} × {ph.data.title}
            </strong>
            の実践を知っているあなたが、最初の 1 ページを書きませんか?{" "}
            <Link href={`/domains/${domain}`}>{dom.meta.name} のページ</Link>
            からユースケースを追加できます。
          </div>
        )}
      </div>
    </article>
  );
}
