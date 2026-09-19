import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "64px 0" }}>
      <p style={{ fontSize: 48, margin: 0 }}>🧭</p>
      <h1>ページが見つかりません</h1>
      <p className="lead">
        このマスはまだ書かれていないのかもしれません。あなたが最初の 1
        ページを書くチャンスです。
      </p>
      <div className="grid grid-3" style={{ textAlign: "left", marginTop: 24 }}>
        <Link href="/" className="card">
          <h3>ホーム</h3>
          <p>FDE の全体像へ</p>
        </Link>
        <Link href="/guide" className="card">
          <h3>始め方</h3>
          <p>6 ステップのガイドへ</p>
        </Link>
        <Link href="/matrix" className="card">
          <h3>マトリクス</h3>
          <p>領域 × 工程の一覧へ</p>
        </Link>
      </div>
    </div>
  );
}
