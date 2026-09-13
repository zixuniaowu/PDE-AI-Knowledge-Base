import Link from "next/link";
import { notFound } from "next/navigation";
import { getPattern, listDomains, listPatterns, listUseCases } from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { Toc } from "@/components/Toc";
import { Meta, StatusBadge } from "@/components/Badges";

export function generateStaticParams() {
  return listPatterns().map((p) => ({ slug: p.data.id }));
}

export default async function PatternPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const known = listPatterns().some((p) => p.data.id === slug);
  if (!known) notFound();

  const doc = getPattern(slug);
  const applying = listDomains().flatMap((d) =>
    listUseCases(d.id)
      .filter((uc) => uc.data.aiPatterns.includes(slug))
      .map((uc) => ({ domain: d, uc }))
  );

  return (
    <article>
      <p style={{ margin: 0 }}>
        <Link href="/patterns">← パターン一覧</Link>
      </p>
      <h1>✨ {doc.data.title}</h1>
      <p className="lead">{doc.data.summary}</p>
      <p>
        <StatusBadge status={doc.data.status} />
      </p>
      <Toc markdown={doc.content} />
      <Prose markdown={doc.content} linkBase="/patterns" />
      <Meta updated={doc.data.updated} owners={doc.data.owners} />

      <h2>このパターンを使っているユースケース</h2>
      <div className="grid grid-2">
        {applying.map(({ domain, uc }) => (
          <Link
            key={`${domain.id}/${uc.data.id}`}
            href={`/domains/${domain.id}/${uc.data.id}`}
            className="card"
          >
            <h3>
              {domain.icon ?? "📦"} {domain.name} / {uc.data.title}
            </h3>
            <p>{uc.data.summary}</p>
          </Link>
        ))}
        {applying.length === 0 && (
          <p style={{ color: "var(--text-faint)" }}>
            まだ適用ユースケースがありません。あなたの領域で試して、最初の 1
            件を書いてみませんか？
          </p>
        )}
      </div>
    </article>
  );
}
