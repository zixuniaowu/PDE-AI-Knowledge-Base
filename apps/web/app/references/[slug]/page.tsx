import Link from "next/link";
import { notFound } from "next/navigation";
import { getReference, listReferences } from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { Toc } from "@/components/Toc";
import { Meta, StatusBadge } from "@/components/Badges";

export function generateStaticParams() {
  return listReferences().map((r) => ({ slug: r.data.id }));
}

export default async function ReferencePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const known = listReferences().some((r) => r.data.id === slug);
  if (!known) notFound();

  const doc = getReference(slug);

  return (
    <article>
      <p style={{ margin: 0 }}>
        <Link href="/">← ホーム</Link>
      </p>
      <h1>{doc.data.title}</h1>
      <p className="lead">{doc.data.summary}</p>
      <p>
        <StatusBadge status={doc.data.status} />
      </p>

      <Toc markdown={doc.content} />
      <Prose markdown={doc.content} linkBase="/references" />
      <Meta updated={doc.data.updated} owners={doc.data.owners} />
    </article>
  );
}
