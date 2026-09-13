import Link from "next/link";
import { listDomains, listGuides, listPatterns, listPhases } from "@pde/content-core";
import { JobCountChart, RateHistogram, StatChips } from "@/components/charts";

export default function Home() {
  const domains = listDomains();
  const phases = listPhases();
  const patterns = listPatterns();
  const guides = listGuides();

  const flow = [
    "課題ヒアリング",
    "業務の要件化",
    "プロトタイプ",
    "実装",
    "本番導入",
    "現場定着",
  ];

  return (
    <div>
      <section className="hero">
        <h1>
          FDE — Forward Deployed Engineer
          <br />
          Knowledge Base
        </h1>
        <p className="lead">
          FDE（Forward Deployed Engineer／前沿部署エンジニア）は、
          <strong>顧客・事業部の現場に入り、AI を実際の業務に組み込み、成果指標が動く状態まで責任を持つエンジニア</strong>。
          企業の AI 導入で最も不足している役割です（フリーランス案件だけでも 147 件・単価 51〜200 万円/月）。
          このナレッジベースは、FDE の実践知を<strong>領域 × 工程</strong>のマトリクスで整理します。
        </p>
      </section>

      <section>
        <p className="section-label" style={{ marginTop: 8 }}>
          FDE の仕事はこの 6 ステップ
        </p>
        <div className="notice" style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", alignItems: "center" }}>
          {flow.map((f, i) => (
            <span key={f} style={{ fontWeight: 600 }}>
              <span style={{ color: "var(--accent)", marginRight: 4 }}>{i + 1}.</span>
              {f}
              {i < flow.length - 1 && <span style={{ color: "var(--text-faint)", marginLeft: 10 }}>→</span>}
            </span>
          ))}
        </div>
      </section>

      <section>
        <p className="section-label" style={{ marginTop: 8 }}>
          この KB の 3 つの使い方
        </p>
        <div className="grid grid-3">
          <Link href="/guide" className="card" style={{ borderTop: "3px solid var(--accent)" }}>
            <span className="icon">🎓</span>
            <h3>学ぶ — FDE になる</h3>
            <p>6 ステップのガイドと小技集で、出発点別の転身ルートを歩く。</p>
          </Link>
          <Link href="/references/market-demand" className="card" style={{ borderTop: "3px solid var(--human)" }}>
            <span className="icon">💼</span>
            <h3>働く — 市場とキャリア</h3>
            <p>案件 147 件・単価 51〜200 万円/月の実データ。就業形態と必要スキル。</p>
          </Link>
          <Link href="/process" className="card" style={{ borderTop: "3px solid var(--ai)" }}>
            <span className="icon">📚</span>
            <h3>参照する — 実践知識</h3>
            <p>工程 11・領域 10・パターン 9・クラウド連携・業務プロセスの型。</p>
          </Link>
        </div>
      </section>

      <section>
        <p className="section-label">FDE の市場（2026-09-13 時点の調査）</p>
        <StatChips
          items={[
            { value: "253 件", label: "FDE 案件（2 サイト合計）" },
            { value: "108.1 万円", label: "平均月額単価（フリーランスボード公表）" },
            { value: "200 万円", label: "最高月額単価（フリーランススタート）" },
            { value: "73 件", label: "フルリモート案件（フリーランススタート）" },
          ]}
        />
        <h3 style={{ margin: "20px 0 8px", fontSize: 16 }}>サイト別 FDE 案件数</h3>
        <JobCountChart
          data={[
            {
              label: "フリーランススタート",
              url: "https://freelance-start.com/jobs/job_category-47",
              count: 147,
              maxLabel: "（51〜200 万円/月）",
            },
            {
              label: "フリーランスボード",
              url: "https://freelance-board.com/jobs/fde",
              count: 106,
              maxLabel: "（平均 108.1 万円/月）",
            },
          ]}
        />
        <p style={{ fontSize: 13, color: "var(--text-faint)", margin: "4px 0 20px" }}>
          ※ レバテックフリーランス等も FDE 案件を掲載（要認証のため件数未計上）。数値は日々変動します。
        </p>
        <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>FDE 案件の月額単価分布</h3>
        <RateHistogram
          rates={[
            92.5, 105, 120, 88, 110, 90, 90, 100, 100, 120, 65, 110, 85, 145, 115, 135, 85, 95,
            95, 80, 155, 125, 85, 135, 100, 165, 165, 165, 155, 80,
          ]}
          buckets={[
            { label: "〜80 万", min: 0, max: 80 },
            { label: "80〜100 万", min: 80, max: 100 },
            { label: "100〜120 万", min: 100, max: 120 },
            { label: "120〜150 万", min: 120, max: 150 },
            { label: "150 万〜", min: 150, max: Infinity },
          ]}
          sampleNote="※ フリーランスボードの FDE 案件 30 件のサンプル（表示額の中央値、2026-09-13 取得）。分布の山は 80〜120 万円帯。"
        />
        <p style={{ fontSize: 13, margin: "12px 0 0" }}>
          詳細な分析・スキル頻度は
          <Link href="/references/market-demand">FDE の市場需要分析</Link>
          へ。データ出所:{" "}
          <a
            href="https://freelance-start.com/jobs/job_category-47"
            target="_blank"
            rel="noopener noreferrer"
          >
            フリーランススタート
          </a>{" "}
          /{" "}
          <a
            href="https://freelance-board.com/jobs/fde"
            target="_blank"
            rel="noopener noreferrer"
          >
            フリーランスボード
          </a>
        </p>
      </section>

      <section>
        <p className="section-label">今日から使う</p>
        <div className="grid grid-2">
          <Link href="/references/prompt-tips" className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <span className="icon">⚡</span>
            <h3>プロンプト小技集 20 選</h3>
            <p>コピペで今日から使える具体的テクニック。「まず確認させてから作業させる」「根拠の引用を必須にする」など。</p>
          </Link>
          <Link href="/references/market-demand" className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <span className="icon">📈</span>
            <h3>FDE の市場需要分析</h3>
            <p>フリーランススタートに 147 件・単価 51〜200 万円/月。業界別の実案件データ。2026-09 時点の調査。</p>
          </Link>
          <Link href="/references/cloud-ai-services" className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <span className="icon">☁️</span>
            <h3>クラウド別 AI サービスマップ</h3>
            <p>顧客が AWS / Azure / GCP / SAP でも対応できる、シナリオ別サービス対応表と参照アーキテクチャ。</p>
          </Link>
          <Link href="/references/business-processes" className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <span className="icon">🗂️</span>
            <h3>業務プロセスと AI の接点</h3>
            <p>販売・購買・在庫・生産・経理・人事。ERP 流の業務分解で、AI の入り方と成果指標を整理。</p>
          </Link>
        </div>
      </section>

      <p className="section-label">ざっと見る</p>
      <div className="grid grid-3">
        <Link href="/guide" className="card">
          <span className="icon">🧭</span>
          <h3>始め方 {guides.length} ステップ</h3>
          <p>デザイナーから、フロントエンドから、FDE への転身ルートと仕事の進め方。</p>
        </Link>
        <Link href="/domains" className="card">
          <span className="icon">🗂</span>
          <h3>領域 {domains.length} 件</h3>
          <p>業界ごとの AI プロダクト実戦知識。FDE が領域に入るときの地図。</p>
        </Link>
        <Link href="/process" className="card">
          <span className="icon">🔁</span>
          <h3>工程 {phases.length} 件</h3>
          <p>ウォーターフォール・アジャイルの各工程を、FDE が AI ツールとどう回すか。</p>
        </Link>
        <Link href="/patterns" className="card">
          <span className="icon">✨</span>
          <h3>パターン {patterns.length} 件</h3>
          <p>RAG、Agent、Few-shot など、実装時に何度も使う型。</p>
        </Link>
        <Link href="/matrix" className="card">
          <span className="icon">🧭</span>
          <h3>
            マトリクス {domains.length}×{phases.length}
          </h3>
          <p>領域 × 工程の交点ページ。白紙のマス = 新しく書くチャンス。</p>
        </Link>
        <Link href="/search" className="card">
          <span className="icon">🔍</span>
          <h3>検索</h3>
          <p>領域・工程・パターン・ガイドを横断検索。</p>
        </Link>
      </div>

      <p className="section-label">参加する</p>
      <div className="grid grid-2">
        <a
          className="card"
          href="https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/blob/main/CONTRIBUTING.md"
        >
          <span className="icon">✍️</span>
          <h3>専門家として書く</h3>
          <p>コード不要。テンプレートをコピーして Markdown を書くだけ。</p>
        </a>
        <a className="card" href="https://github.com/zixuniaowu/PDE-AI-Knowledge-Base">
          <span className="icon">⭐</span>
          <h3>GitHub</h3>
          <p>ソースコードもコンテンツも全て公開。PR をお待ちしています。</p>
        </a>
      </div>
    </div>
  );
}
