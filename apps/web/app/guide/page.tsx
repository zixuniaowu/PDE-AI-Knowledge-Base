import Link from "next/link";
import { listGuides } from "@pde/content-core";
import { StatusBadge } from "@/components/Badges";

export const metadata = { title: "PDE の始め方" };

export default function GuidePage() {
  const guides = listGuides();

  return (
    <div>
      <h1>PDE の始め方</h1>
      <p className="lead">
        「AI を使う」から「AI と協働する」へ。6 ステップで、個人 → チーム →
        コミュニティへ進むための道しるべです。
      </p>
      <div className="grid">
        {guides.map((g) => (
          <Link key={g.data.id} href={`/guide/${g.data.id}`} className="card">
            <StatusBadge status={g.data.status} />
            <h3>
              {g.data.order === 0 ? "📖" : `STEP ${g.data.order}`} — {g.data.title}
            </h3>
            <p>{g.data.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
