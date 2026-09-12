import Link from "next/link";
import { notFound } from "next/navigation";
import { getPattern, listPatterns } from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { Meta, StatusBadge } from "@/components/Badges";

export function generateStaticParams() {
  return listPatterns().map((p) => ({ slug: p.data.id }));
}

export default async function PatternPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const known = listPatterns().some((p) => p.data.id === slug);
  if (!known) notFound();

  const doc = getPattern(slug);

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
      <Prose>{doc.content}</Prose>
      <Meta updated={doc.data.updated} owners={doc.data.owners} />
    </article>
  );
}
