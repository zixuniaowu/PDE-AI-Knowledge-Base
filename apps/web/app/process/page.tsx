import Link from "next/link";
import { listPhases } from "@pde/content-core";
import { StatusBadge } from "@/components/Badges";

export const metadata = { title: "工程" };

export default function ProcessPage() {
  const phases = listPhases();
  const methods = [...new Set(phases.map((p) => p.data.method))];

  return (
    <div>
      <h1>工程</h1>
      <p className="lead">
        各開発工程で、<span className="badge badge-human">人間</span> と
        <span className="badge badge-ai">AI</span>{" "}
        がどう分担し、どう受け渡しするかを整理します。
      </p>

      {methods.map((method) => (
        <section key={method}>
          <p className="section-label">{method}</p>
          <div className="grid grid-3">
            {phases
              .filter((p) => p.data.method === method)
              .map((p) => (
                <Link
                  key={p.data.id}
                  href={`/process/${method}/${p.data.id}`}
                  className="card"
                >
                  <StatusBadge status={p.data.status} />
                  <h3>
                    {p.data.order}. {p.data.title}
                  </h3>
                  <p>人と AI の役割分担と受け入れ基準</p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
