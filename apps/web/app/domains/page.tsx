import Link from "next/link";
import { listDomains, listUseCases } from "@pde/content-core";
import { StatusBadge } from "@/components/Badges";

export const metadata = { title: "領域" };

export default function DomainsPage() {
  const domains = listDomains();

  return (
    <div>
      <h1>領域</h1>
      <p className="lead">業務領域ごとに、AI をどう導入するかのユースケースを蓄積します。</p>
      <div className="grid grid-2">
        {domains.map((d) => {
          const useCases = listUseCases(d.id);
          return (
            <Link key={d.id} href={`/domains/${d.id}`} className="card">
              <StatusBadge status={d.status} />
              <h3>
                <span className="icon">{d.icon ?? "📦"}</span> {d.name}
              </h3>
              <p>{d.description}</p>
              <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-faint)" }}>
                ユースケース {useCases.length} 件
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
