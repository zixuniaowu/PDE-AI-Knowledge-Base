import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomain, listDomains, listIntersections, listUseCases } from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { Meta, StatusBadge } from "@/components/Badges";

export function generateStaticParams() {
  return listDomains().map((d) => ({ domain: d.id }));
}

export default async function DomainPage({ params }: { params: { domain: string } }) {
  const { domain } = params;
  const exists = listDomains().some((d) => d.id === domain);
  if (!exists) notFound();

  const doc = getDomain(domain);
  const useCases = listUseCases(domain);
  const notes = listIntersections().filter((ix) => ix.data.domain === domain);

  return (
    <article>
      <p style={{ margin: 0 }}>
        <Link href="/domains">← 領域一覧</Link>
      </p>
      <h1>
        <span className="icon">{doc.meta.icon ?? "📦"}</span> {doc.meta.name}
      </h1>
      <p className="lead">{doc.meta.description}</p>
      <p>
        <StatusBadge status={doc.meta.status} />
        {doc.meta.tags.map((t) => (
          <span key={t} className="badge">
            {t}
          </span>
        ))}
      </p>

      <Prose markdown={doc.content} linkBase={`/domains/${domain}`} />

      <h2>ユースケース</h2>
      <div className="grid grid-2">
        {useCases.map((uc) => (
          <Link key={uc.data.id} href={`/domains/${domain}/${uc.data.id}`} className="card">
            <StatusBadge status={uc.data.status} />
            <h3>{uc.data.title}</h3>
            <p>{uc.data.summary}</p>
          </Link>
        ))}
        {useCases.length === 0 && (
          <p style={{ color: "var(--text-faint)" }}>
            まだユースケースがありません。テンプレートから最初の 1 件を書いてみませんか？
          </p>
        )}
      </div>

      <h2>この領域の交点ノート</h2>
      <p style={{ color: "var(--text-sub)", fontSize: 14 }}>
        この領域 × 工程の組合せごとの実践ノート。
      </p>
      <div className="grid grid-2">
        {notes.map((ix) => (
          <Link
            key={ix.data.id}
            href={`/matrix/${domain}/${ix.data.method}/${ix.data.phase}`}
            className="card"
          >
            <span className="badge badge-reviewed">📝 交点ノート</span>
            <h3>{ix.data.title}</h3>
            <p>{`${ix.data.method} / ${ix.data.phase}`}</p>
          </Link>
        ))}
        {notes.length === 0 && (
          <p style={{ color: "var(--text-faint)" }}>
            まだ交点ノートがありません。[マトリクス] から最初の 1 件を書けます。
          </p>
        )}
      </div>

      <Meta updated={doc.meta.updated} owners={doc.meta.owners} />
    </article>
  );
}
