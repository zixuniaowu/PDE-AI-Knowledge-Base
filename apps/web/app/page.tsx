import Link from "next/link";
import {
  listDomains,
  listGuides,
  listPatterns,
  listPhases,
  listReferences,
  listUseCases,
} from "@pde/content-core";
import historyData from "../../../data/market-history.json";
import { RatePie, StatChips, WeeklyDemandBars } from "@/components/charts";
import type { MarketSnapshot } from "@/components/charts";
import { HomeMap } from "@/components/HomeMap";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { DemandFishbone } from "@/components/DemandFishbone";
import { MarketSourcesTable } from "@/components/MarketSources";

export default function Home() {
  const domains = listDomains();
  const phases = listPhases();

  // 月次バッチ（scripts/collect-market-data.mjs）が蓄積するスナップショット
  const snapshots: MarketSnapshot[] = historyData.snapshots;
  const latestBoard = [...snapshots].reverse().find((s) => s.freelanceBoard != null);
  const latestTotal = snapshots.find((s) => s.total != null);

  // 独自ルートを持つコンテンツページ + 自動生成の交点ページ + インデックス系ページ
  //（交点ノートは交点ページに合成されるため、独自ルートを持たない=カウントしない）
  const useCaseCount = domains.reduce((n, d) => n + listUseCases(d.id).length, 0);
  const pageCount =
    listGuides().length +
    domains.length +
    useCaseCount +
    phases.length +
    listPatterns().length +
    listReferences().length +
    domains.length * phases.length +
    8;

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
    { v: `${pageCount} ページ`, l: "ナレッジ公開中" },
  ];

  return (
    <div>
      <section className="hero-dark">
        <div className="container">
          <p className="hero-kicker">FDE — FORWARD DEPLOYED ENGINEER KNOWLEDGE BASE</p>
          <h1>
            現場に入り、<span className="hero-nowrap">AI を業務で使える形に。</span>
          </h1>
          <p className="hero-sub">
            FDE（Forward Deployed Engineer／前沿部署エンジニア）は、顧客の課題を要件化し、
            AI で実装し、<strong>成果指標が動くまで現場に定着させる</strong>責任を持つ、
            いま最も不足している職種。その実践知を {pageCount} ページに整理しました。
          </p>
          <div className="hero-stats">
            {heroStats.map((s) => (
              <div key={s.l} className="hero-stat">
                <span className="hero-stat-value">{s.v}</span>
                <span className="hero-stat-label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="section-label">FDE の市場（週次で追跡）</p>
        <h2 style={{ fontSize: 22, margin: "0 0 8px" }}>データソースと収集の仕組み</h2>
        <p className="lead" style={{ marginBottom: 12 }}>
          情報源は <strong>フリーランススタート / フリーランスボード / レバテックフリーランス</strong> の 3 サイト。
          すべて<strong>毎週月曜日に GitHub Actions が自動収集</strong>（フリーランススタートはボット対策があるためヘッドレスブラウザで取得）。
          蓄積したスナップショットが下のグラフと魚骨図を週ごとに伸ばしていきます。
        </p>
        <MarketSourcesTable snapshots={snapshots} />
        <StatChips
          items={[
            { value: `${latestTotal?.total ?? "—"} 件`, label: `FDE 案件・2 サイト合計（${latestTotal?.date ?? "—"} 手動調査）` },
            { value: `${latestBoard?.freelanceBoard ?? "—"} 件`, label: `ボード自動収集（${latestBoard?.date ?? "—"} 時点）` },
            { value: "13 件", label: "レバテック自動収集（9/19 時点）" },
            { value: "108.1 万円", label: "平均月額単価（ボード公表）" },
            { value: "51〜200 万円", label: "月額単価レンジ" },
          ]}
        />

      <section>
        <p className="section-label">案件データから抽出した知識グラフ</p>
        <h2 style={{ fontSize: 22, margin: "0 0 8px" }}>
          招聘案件が要求するスキルの全体像
        </h2>
        <p className="lead" style={{ marginBottom: 16 }}>
          FDE 案件 253 件の必須スキルをグラフ化したもの。丸の大きさ = 案件での重要度（登場頻度）、
          線 = 関連性、点線 = スキル間の「壁」。<strong>丸はドラッグで動かせます</strong>（クリックで対応ページへ）。
        </p>
        <div className="kg-wrap">
          <KnowledgeGraph />
        </div>
        <p className="chart-note">
          出所: フリーランススタート / フリーランスボードの FDE 案件必須スキルの分析（2026-09-13 調査・253 件）。
          詳細は<Link href="/references/market-demand">需要分析</Link>参照。
        </p>
      </section>

      <section>
        <div className="home-map-wrap">
          <HomeMap />
        </div>
        <div className="home-map-mobile">
          <p className="section-label">FDE の仕事は、この 6 ステップを AI と一緒に回すこと</p>
          <ol className="steps-mini">
            {flow.map((s, i) => (
              <li key={s}>
                <span className="steps-mini-num">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link href="/matrix" className="btn-primary home-map-mobile-cta">
            領域 × 工程 のマトリクスを見る
          </Link>
        </div>
      </section>


        <h3 style={{ margin: "24px 0 8px", fontSize: 16 }}>週別 FDE 案件数（直近 6 週）</h3>
        <div className="trend-wrap">
          <WeeklyDemandBars snapshots={snapshots} />
        </div>
        <p className="chart-note">
          未収集の週は空欄。週次バッチが 1 本ずつ埋めていきます。
        </p>

        <h3 style={{ margin: "24px 0 8px", fontSize: 16 }}>需要の推移タイムライン（魚骨図）</h3>
        <p className="lead" style={{ marginBottom: 12 }}>
          背骨 = 時間（週次）、丸 = その週のボード案件数、骨 = 計測結果。今週から始めて毎週延伸します。
        </p>
        <div className="fishbone-wrap">
          <DemandFishbone snapshots={snapshots} />
        </div>

        <h3 style={{ margin: "24px 0 8px", fontSize: 16 }}>FDE 案件の月額単価分布</h3>
        <RatePie
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
    </div>
  );
}
