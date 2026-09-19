import type { Metadata } from "next";
import vendorsData from "../../../../data/it-vendors.json";

export const metadata: Metadata = {
  title: "大手 IT ベンダーの AI 推進状況",
  description:
    "NTT データ、富士通、NEC、日立、IBM、アクセンチュアなど大手 IT ベンダー（SIer・コンサル）の生成 AI 推進状況を追跡します。",
};

interface VendorSource {
  label: string;
  url: string;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  aiBrand: string[];
  initiatives: string[];
  hiring: string;
  sources: VendorSource[];
}

interface VendorsData {
  description: string;
  updatedAt: string;
  categories: { id: string; name: string }[];
  vendors: Vendor[];
}

export default function VendorsPage() {
  const data = vendorsData as VendorsData;
  const catName = (id: string) =>
    data.categories.find((c) => c.id === id)?.name ?? id;

  const counts = data.categories.map((c) => ({
    ...c,
    n: data.vendors.filter((v) => v.category === c.id).length,
  }));

  return (
    <div>
      <h1>大手 IT ベンダーの AI 推進状況</h1>
      <p className="lead">
        FDE が協働・競合する相手になるのが大手 IT ベンダー（SIer・コンサル）。
        各社が生成 AI をどう位置づけ、どんなサービスを作り、どんな人材を採用しているかを
        追跡します（最終更新: {data.updatedAt}）。
      </p>

      <div className="stat-chips" style={{ margin: "16px 0 8px" }}>
        {counts.map((c) => (
          <div key={c.id} className="stat-chip">
            <span className="stat-value">{c.n} 社</span>
            <span className="stat-label">{c.name}</span>
          </div>
        ))}
      </div>

      <div className="notice" style={{ margin: "12px 0 24px" }}>
        各社の情報は公開情報（ニュースリリース等）からの要約です。出典リンクから最新の公式発表を確認し、
        <code>data/it-vendors.json</code> を更新してください。内容の正確性は出典が担保します。
      </div>

      {data.categories.map((cat) => {
        const vendors = data.vendors.filter((v) => v.category === cat.id);
        if (vendors.length === 0) {
          return null;
        }
        return (
          <section key={cat.id} style={{ marginBottom: 40 }}>
            <p className="section-label">{cat.name}</p>
            <div className="grid grid-2">
              {vendors.map((v) => (
                <article key={v.id} className="card" style={{ display: "block" }}>
                  <h3>{v.name}</h3>
                  {v.aiBrand.length > 0 && (
                    <p style={{ margin: "4px 0 8px" }}>
                      {v.aiBrand.map((b) => (
                        <span key={b} className="badge badge-ai" style={{ marginRight: 6 }}>
                          {b}
                        </span>
                      ))}
                    </p>
                  )}
                  <ul style={{ margin: "8px 0 10px", paddingLeft: 18, fontSize: 14 }}>
                    {v.initiatives.map((ini, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                        {ini}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: 13.5, color: "var(--text-sub)", margin: "0 0 8px" }}>
                    <strong>採用・案件:</strong> {v.hiring}
                  </p>
                  <p style={{ fontSize: 12.5, margin: 0 }}>
                    出典:{" "}
                    {v.sources.map((src, i) => (
                      <span key={src.url}>
                        {i > 0 && " / "}
                        <a href={src.url} target="_blank" rel="noopener noreferrer">
                          {src.label}
                        </a>
                      </span>
                    ))}
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
