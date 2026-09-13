import Link from "next/link";
import { listDomains, listGuides, listPatterns, listPhases } from "@pde/content-core";

export default function Home() {
  const domains = listDomains();
  const phases = listPhases();
  const patterns = listPatterns();
  const guides = listGuides();

  return (
    <div>
      <section className="hero">
        <h1>
          PDE — Prompt-Driven
          <br />
          Engineering Knowledge Base
        </h1>
        <p className="lead">
          あらゆる領域・あらゆる開発工程に AI を組み込む方法を、
          領域の専門家が共同で育てる実践ナレッジベースです。
        </p>
      </section>

      <section>
        <p className="section-label">2つの軸</p>
        <div className="notice">
          <strong>領域軸 × 工程軸。</strong>
          「教育の要件定義では人と AI がどう動くか」「医療のテスト工程では?」——
          あらゆる組み合わせをマトリクスで整理し、各マスに実践知を蓄積します。
        </div>
      </section>

      <section>
        <p className="section-label" style={{ marginTop: 8 }}>
          今日から使う
        </p>
        <Link href="/references/prompt-tips" className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
          <span className="icon">⚡</span>
          <h3>プロンプト小技集 20 選</h3>
          <p>コピペで今日から使える具体的テクニック。「まず確認させてから作業させる」「根拠の引用を必須にする」など。</p>
        </Link>
      </section>

      <p className="section-label">ざっと見る</p>
      <div className="grid grid-3">
        <Link href="/guide" className="card">
          <span className="icon">🧭</span>
          <h3>始め方 {guides.length} ステップ</h3>
          <p>「AI を使う」から「AI と協働する」へ。6 ステップで PDE になる道しるべ。</p>
        </Link>
        <Link href="/domains" className="card">
          <span className="icon">🗂</span>
          <h3>領域 {domains.length} 件</h3>
          <p>各業務領域に AI をどう導入するか。ユースケースと失敗パターン。</p>
        </Link>
        <Link href="/process" className="card">
          <span className="icon">🔁</span>
          <h3>工程 {phases.length} 件</h3>
          <p>ウォーターフォール・アジャイルの各工程での人間と AI の役割分担。</p>
        </Link>
        <Link href="/patterns" className="card">
          <span className="icon">✨</span>
          <h3>パターン {patterns.length} 件</h3>
          <p>RAG、Agent、Human-in-the-loop など領域横断の AI 活用パターン。</p>
        </Link>
        <Link href="/matrix" className="card">
          <span className="icon">🧭</span>
          <h3>
            マトリクス {domains.length}×{phases.length}
          </h3>
          <p>領域 × 工程の交点ページ。白紙のマス = 新しく書くチャンス。</p>
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
        <Link href="/search" className="card">
          <span className="icon">🔍</span>
          <h3>知見を探す</h3>
          <p>領域・工程・パターン・交点を横断検索。</p>
        </Link>
      </div>
    </div>
  );
}
