import Link from "next/link";
import { listDomains, listGuides, listPatterns, listPhases } from "@pde/content-core";

export default function Home() {
  const domains = listDomains();
  const phases = listPhases();
  const patterns = listPatterns();
  const guides = listGuides();

  const flow = [
    "課題発見",
    "フロー設計",
    "インタラクション",
    "実装",
    "リリース",
    "フィードバック",
  ];

  return (
    <div>
      <section className="hero">
        <h1>
          PDE — Product Design Engineer
          <br />
          Knowledge Base
        </h1>
        <p className="lead">
          PDE（Product Design Engineer）は、<strong>製品の課題を考え、インタラクションを設計し、
          プロダクションコードを自分で書ける人</strong>。AI ツールの進化で、伝統的な
          「PM → デザイナー → エンジニア」の分業が一個人の中に収まる時代になりました。
          このナレッジベースは、PDE として働くために必要な実践知を
          <strong>領域 × 工程</strong>のマトリクスで整理します。
        </p>
      </section>

      <section>
        <p className="section-label" style={{ marginTop: 8 }}>
          PDE の仕事はこの 6 ステップ
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
        <p className="section-label">今日から使う</p>
        <div className="grid grid-2">
          <Link href="/references/prompt-tips" className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <span className="icon">⚡</span>
            <h3>プロンプト小技集 20 選</h3>
            <p>コピペで今日から使える具体的テクニック。「まず確認させてから作業させる」「根拠の引用を必須にする」など。</p>
          </Link>
          <Link href="/references/market-demand" className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <span className="icon">📈</span>
            <h3>PDE の市場需要分析</h3>
            <p>海外 $120–220k の採用事例、日本の AI/ML 単価、探し方のキーワード。2026-09 時点の調査。</p>
          </Link>
        </div>
      </section>

      <p className="section-label">ざっと見る</p>
      <div className="grid grid-3">
        <Link href="/guide" className="card">
          <span className="icon">🧭</span>
          <h3>始め方 {guides.length} ステップ</h3>
          <p>デザイナーから、フロントエンドから、PDE への転身ルートと仕事の進め方。</p>
        </Link>
        <Link href="/domains" className="card">
          <span className="icon">🗂</span>
          <h3>領域 {domains.length} 件</h3>
          <p>業界ごとの AI プロダクト実戦知識。PDE が領域に入るときの地図。</p>
        </Link>
        <Link href="/process" className="card">
          <span className="icon">🔁</span>
          <h3>工程 {phases.length} 件</h3>
          <p>ウォーターフォール・アジャイルの各工程を、PDE が AI ツールとどう回すか。</p>
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
