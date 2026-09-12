import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, listGuides } from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { Toc } from "@/components/Toc";
import { Meta, StatusBadge } from "@/components/Badges";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.data.id }));
}

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const guides = listGuides();
  const index = guides.findIndex((g) => g.data.id === slug);
  if (index === -1) notFound();

  const doc = guides[index];
  const prev = index > 0 ? guides[index - 1] : null;
  const next = index < guides.length - 1 ? guides[index + 1] : null;

  return (
    <article>
      <p style={{ margin: 0 }}>
        <Link href="/guide">← PDE の始め方</Link>
      </p>
      <h1>
        {doc.data.order === 0 ? "📖" : `STEP ${doc.data.order}`} — {doc.data.title}
      </h1>
      <p className="lead">{doc.data.summary}</p>
      <p>
        <StatusBadge status={doc.data.status} />
      </p>

      <Toc markdown={doc.content} />
      <Prose>{doc.content}</Prose>
      <Meta updated={doc.data.updated} owners={doc.data.owners} />

      <div style={{ display: "flex", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
        {prev && (
          <Link href={`/guide/${prev.data.id}`} className="badge">
            ← {prev.data.title}
          </Link>
        )}
        {next && (
          <Link href={`/guide/${next.data.id}`} className="badge">
            {next.data.title} →
          </Link>
        )}
      </div>
    </article>
  );
}
