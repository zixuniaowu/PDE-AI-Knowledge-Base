import Link from "next/link";
import { notFound } from "next/navigation";
import { getUseCase, listDomains, listUseCases } from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { Toc } from "@/components/Toc";
import { Meta, StatusBadge } from "@/components/Badges";

export function generateStaticParams() {
  return listDomains().flatMap((d) =>
    listUseCases(d.id).map((uc) => ({ domain: d.id, case: uc.data.id }))
  );
}

export default async function UseCasePage({
  params,
}: {
  params: { domain: string; case: string };
}) {
  const { domain, case: caseId } = params;
  const known = listUseCases(domain).some((uc) => uc.data.id === caseId);
  if (!known) notFound();

  const doc = getUseCase(domain, caseId);

  return (
    <article>
      <p style={{ margin: 0 }}>
        <Link href={`/domains/${domain}`}>← {domain}</Link>
      </p>
      <h1>{doc.data.title}</h1>
      <p className="lead">{doc.data.summary}</p>
      <p>
        <StatusBadge status={doc.data.status} />
        {doc.data.aiPatterns.map((p) => (
          <Link key={p} href={`/patterns/${p}`} className="badge">
            ✨ {p}
          </Link>
        ))}
        {doc.data.phaseLinks.map((l) => (
          <Link key={`${l.method}/${l.phase}`} href={`/process/${l.method}/${l.phase}`} className="badge">
            🔁 {l.method}/{l.phase}
          </Link>
        ))}
      </p>

      <Toc markdown={doc.content} />
      <Prose markdown={doc.content} linkBase={`/domains/${domain}`} />
      <Meta updated={doc.data.updated} owners={doc.data.owners} />

      <p className="section-label">{domain} の他のユースケース</p>
      <p>
        {listUseCases(domain)
          .filter((other) => other.data.id !== caseId)
          .map((other) => (
            <Link key={other.data.id} href={`/domains/${domain}/${other.data.id}`} className="badge">
              {other.data.title}
            </Link>
          ))}
      </p>
    </article>
  );
}
