import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhase, listIntersections, listPhases } from "@pde/content-core";
import { Prose } from "@/components/Prose";
import { Toc } from "@/components/Toc";
import { Meta, StatusBadge } from "@/components/Badges";

export function generateStaticParams() {
  return listPhases().map((p) => ({ method: p.data.method, phase: p.data.id }));
}

export default async function PhasePage({
  params,
}: {
  params: { method: string; phase: string };
}) {
  const { method, phase } = params;
  const known = listPhases().some((p) => p.data.method === method && p.data.id === phase);
  if (!known) notFound();

  const doc = getPhase(method, phase);
  const siblings = listPhases(method);
  const notes = listIntersections().filter(
    (ix) => ix.data.method === method && ix.data.phase === phase
  );

  return (
    <article>
      <p style={{ margin: 0 }}>
        <Link href="/process">← 工程一覧</Link>
      </p>
      <h1>
        {doc.data.title}{" "}
        <span style={{ fontSize: 15, color: "var(--text-faint)", fontWeight: 400 }}>
          / {method}
        </span>
      </h1>
      <p>
        <StatusBadge status={doc.data.status} />
      </p>

      <Toc markdown={doc.content} />
      <Prose markdown={doc.content} linkBase={`/process/${method}`} />
      <Meta updated={doc.data.updated} owners={doc.data.owners} />

      {notes.length > 0 && (
        <>
          <p className="section-label">この工程の交点ノート</p>
          <p>
            {notes.map((ix) => (
              <Link
                key={ix.data.id}
                href={`/matrix/${ix.data.domain}/${method}/${phase}`}
                className="badge"
              >
                {ix.data.title}
              </Link>
            ))}
          </p>
        </>
      )}

      <p className="section-label">同じ手法の他の工程</p>
      <p>
        {siblings
          .filter((s) => s.data.id !== phase)
          .map((s) => (
            <Link key={s.data.id} href={`/process/${method}/${s.data.id}`} className="badge">
              {s.data.order}. {s.data.title}
            </Link>
          ))}
      </p>
    </article>
  );
}
