import type { Metadata } from "next";
import Link from "next/link";
import vendorsData from "../../../../data/it-vendors.json";
import { Mermaid } from "@/components/Mermaid";

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

const sanitize = (id: string) => id.replace(/-/g, "_");

function buildMermaid(data: VendorsData): string {
  const lines: string[] = ["graph LR"];
  for (const cat of data.categories) {
    lines.push(`  subgraph ${sanitize(cat.id)}["${cat.name}"]`);
    for (const v of data.vendors.filter((x) => x.category === cat.id)) {
      lines.push(`    ${sanitize(v.id)}["${v.name}"]`);
    }
    lines.push("  end");
  }
  for (const v of data.vendors) {
    v.aiBrand.forEach((b, i) => {
      lines.push(`  ${sanitize(v.id)} --> ${sanitize(v.id)}_b${i}["${b}"]`);
    });
  }
  return lines.join("\n");
}

export default function VendorsPage() {
  const data = vendorsData as VendorsData;

  return (
    <div>
      <h1>大手 IT ベンダーの AI 推進状況</h1>
      <p className="lead">
        FDE が協働・競合する相手になるのが大手 IT ベンダー（SIer・コンサル）。
        各社が生成 AI をどう位置づけ、どんなサービスを作り、どんな人材を採用しているかを
        追跡します（最終更新: {data.updatedAt}）。
      </p>

      <section style={{ marginBottom: 32 }}>
        <p className="section-label">全体マップ（ベンダー × AI ブランド）</p>
        <div className="mermaid-figure">
          <Mermaid chart={buildMermaid(data)} />
        </div>
        <p className="chart-note">
          線 = 各社が掲げる AI ブランド・施策。出典リンクは下の対照表にあります。
        </p>
      </section>

      <section>
        <p className="section-label">対照表</p>
        <table className="market-sources">
          <thead>
            <tr>
              <th>ベンダー</th>
              <th>AI ブランド</th>
              <th>主な施策</th>
              <th>採用・案件</th>
              <th>出典</th>
            </tr>
          </thead>
          <tbody>
            {data.vendors.map((v) => (
              <tr key={v.id}>
                <td>
                  <strong>{v.name}</strong>
                  <div className="ms-date">{data.categories.find((c) => c.id === v.category)?.name}</div>
                </td>
                <td>
                  {v.aiBrand.map((b) => (
                    <span key={b} className="badge badge-ai" style={{ marginRight: 4, display: "inline-block", marginBottom: 2 }}>
                      {b}
                    </span>
                  ))}
                </td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5 }}>
                    {v.initiatives.map((ini, i) => (
                      <li key={i}>{ini}</li>
                    ))}
                  </ul>
                </td>
                <td style={{ fontSize: 12.5 }}>{v.hiring}</td>
                <td style={{ fontSize: 12 }}>
                  {v.sources.map((src) => (
                    <div key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {src.label}
                      </a>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="chart-note" style={{ marginTop: 10 }}>
          各社の情報は公開情報（ニュースリリース等）からの要約。最新の公式発表を確認し、
          <code>data/it-vendors.json</code> を更新してください。
          関連: <Link href="/references/market-demand">需要分析</Link>
        </p>
      </section>
    </div>
  );
}
