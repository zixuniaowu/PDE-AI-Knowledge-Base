import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomain, listDomains, listUseCases } from "@pde/content-core";
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

      <Prose>{doc.content}</Prose>

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

      <Meta updated={doc.meta.updated} owners={doc.meta.owners} />
    </article>
  );
}
