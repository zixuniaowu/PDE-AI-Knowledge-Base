import Link from "next/link";
import {
  listDomains,
  listGuides,
  listPatterns,
  listPhases,
  listIntersections,
  listUseCases,
} from "@pde/content-core";
import { JobCountChart, RateHistogram, StatChips } from "@/components/charts";
import { HomeMap } from "@/components/HomeMap";

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

  const heroStats = [
    { v: "253 件", l: "FDE 案件（主要 2 サイト）" },
    { v: "51〜200 万円", l: "月額単価レンジ" },
    { v: "10 × 11", l: "領域 × 工程 のマトリクス" },
    { v: "190 ページ", l: "ナレッジ公開中" },
  ];

  const recent = [
    ...guides.map((g) => ({ title: g.data.title, url: `/guide/${g.data.id}`, updated: g.data.updated, kind: "ガイド" })),
    ...listPatterns().map((p) => ({ title: p.data.title, url: `/patterns/${p.data.id}`, updated: p.data.updated, kind: "パターン" })),
    ...listDomains().flatMap((d) =>
      listUseCases(d.id).map((uc) => ({
        title: `${d.name} / ${uc.data.title}`,
        url: `/domains/${d.id}/${uc.data.id}`,
        updated: uc.data.updated,
        kind: d.name,
      }))
    ),
    ...listPhases().map((p) => ({
      title: p.data.title,
      url: `/process/${p.data.method}/${p.data.id}`,
      updated: p.data.updated,
      kind: p.data.method,
    })),
  ]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, 6);

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
          企業の AI 導入で最も不足している役割です。このナレッジベースは、FDE の実践知を
          <strong>領域 × 工程</strong>のマトリクスで整理します。
        </p>
        <div className="hero-stats">
          {heroStats.map((s) => (
            <div key={s.l} className="hero-stat">
              <span className="hero-stat-value">{s.v}</span>
              <span className="hero-stat-label">{s.l}</span>
            </div>
          ))}
        </div>
        <form action="search/" method="get" className="home-search">
          <input
            type="search"
            name="q"
            placeholder="ナレッジを検索（例: RAG, 採点, 現場定着, 単価）"
            aria-label="サイト内検索"
          />
          <button type="submit">検索</button>
        </form>
      </section>

      <section>
        <div className="home-map-wrap">
          <HomeMap />
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
        <p className="section-label">市場が求めるスキル → 準備すべきもの</p>
        <h2 style={{ fontSize: 22, margin: "0 0 8px" }}>
          案件の必須事項から逆算する、FDE の準備リスト
        </h2>
        <p className="lead" style={{ marginBottom: 16 }}>
          上の案件データを分解すると、市場が求めているのは 8 種類のスキルです。
          それぞれ「何を準備すればよいか」と、この KB の該当ページを示します。
        </p>
        <div className="req-list">
          {[
            {
              skill: "業務の整理と、要件・成果指標への落とし込み",
              freq: "ほぼ全案件",
              prep: "6 大業務プロセスの型で As-Is を書き、痛みを成果指標に紐づける",
              links: [
                { t: "業務プロセスと AI の接点", h: "/references/business-processes" },
                { t: "要件定義の進め方", h: "/process/waterfall/requirements" },
              ],
            },
            {
              skill: "LLM アプリ開発（LangChain / LangGraph / RAG / Dify）",
              freq: "頻出",
              prep: "RAG・Agent・構造化出力の基本型。PoC はマネージド RAG から始める",
              links: [
                { t: "RAG", h: "/patterns/rag" },
                { t: "Agent", h: "/patterns/agent" },
                { t: "構造化出力", h: "/patterns/structured-output" },
              ],
            },
            {
              skill: "AI コーディングツール（Claude Code / Cursor / Copilot）",
              freq: "頻出",
              prep: "「依頼 → 検証 → 修正」のループと、プロンプトの型 20 選",
              links: [
                { t: "実装の進め方", h: "/process/waterfall/implementation" },
                { t: "STEP 3: 作業ループ", h: "/guide/step-3-build-the-loop" },
                { t: "小技集", h: "/references/prompt-tips" },
              ],
            },
            {
              skill: "フルスタック開発（Python / TypeScript / React / Next.js）",
              freq: "頻出",
              prep: "生成コードをレビュー・修正できる実装視点。領域ごとの作例",
              links: [
                { t: "領域のユースケース", h: "/domains" },
                { t: "テスト工程", h: "/process/waterfall/testing" },
              ],
            },
            {
              skill: "クラウド（AWS / GCP / Azure）での開発・運用",
              freq: "頻出",
              prep: "顧客の既存クラウドに寄せたサービス選定、コスト・権限設計",
              links: [{ t: "クラウド別 AI サービスマップ", h: "/references/cloud-ai-services" }],
            },
            {
              skill: "非機能要件（精度 / セキュリティ / 性能 / コスト）",
              freq: "製造・SI 系中心",
              prep: "評価設計とガードレール、コスト上限の実装",
              links: [
                { t: "評価パターン", h: "/patterns/evaluation" },
                { t: "テスト工程", h: "/process/waterfall/testing" },
              ],
            },
            {
              skill: "本番リリースと現場定着の推進",
              freq: "頻出",
              prep: "出荷前の受け入れ基準設計と、定着を見る運用の型",
              links: [
                { t: "リリース", h: "/process/waterfall/deployment" },
                { t: "運用・改善", h: "/process/waterfall/maintenance" },
                { t: "STEP 4", h: "/guide/step-4-acceptance" },
              ],
            },
            {
              skill: "顧客折衝・非エンジニアへの説明力",
              freq: "ほぼ全案件",
              prep: "聞く型、合意形成の記録、組織の中での線引き",
              links: [
                { t: "STEP 5: 組織の中で働く", h: "/guide/step-5-team" },
                { t: "要件定義", h: "/process/waterfall/requirements" },
              ],
            },
          ].map((r, i) => (
            <div key={i} className="req-item">
              <div className="req-skill">
                <span className="badge">{r.freq}</span>
                <strong>{r.skill}</strong>
              </div>
              <div className="req-prep">{r.prep}</div>
              <div className="req-links">
                {r.links.map((l) => (
                  <Link key={l.h} href={l.h} className="badge">
                    {l.t} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="section-label">ナレッジベース全体</p>
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

      <section>
        <p className="section-label">最新の更新</p>
        <div className="recent-list">
          {recent.map((r) => (
            <Link key={r.url} href={r.url} className="recent-item">
              <span className="badge">{r.kind}</span>
              <span className="recent-title">{r.title}</span>
              <span className="recent-date">{r.updated}</span>
            </Link>
          ))}
        </div>
      </section>

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
