import Link from "next/link";
import { listPhases } from "@pde/content-core";
import { StatusBadge } from "@/components/Badges";
import { VModel } from "@/components/VModel";

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
          {method === "waterfall" && (
            <div className="vmodel-wrap">
              <VModel />
              <p className="chart-note">
                V モデル: 左を下りながら<strong>定義</strong>し（人間が主導）、右を上りながら
                <strong>検証</strong>する（AI で高速化）。横の点線は「その定義を確認するテスト」の対応。
                各テストの合格基準は、対応する左側の定義フェーズで先に書いておくのが FDE の流儀。
              </p>
              <table className="vmodel-table">
                <thead>
                  <tr>
                    <th>定義（左）</th>
                    <th>対応する検証（右）</th>
                    <th>そこで使えるもの（AI × KB）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Biz 要件（業務要件）</td>
                    <td>UAT（受入テスト）</td>
                    <td>
                      業務の成果指標が動いたかを判定。<Link href="/patterns/human-in-the-loop">Human-in-the-loop</Link> の承認型チェックポイント / 受け入れ基準は <Link href="/guide/step-4-acceptance">STEP 4</Link> の型で先に書く
                    </td>
                  </tr>
                  <tr>
                    <td>System 要件</td>
                    <td>結合テスト</td>
                    <td>
                      システム要件どおりに連動するか。<Link href="/patterns/structured-output">構造化出力</Link>で要件のたたき台を整形し、連携ログの突合・要約を AI に任せる
                    </td>
                  </tr>
                  <tr>
                    <td>詳細設計</td>
                    <td>IT テスト（結合）</td>
                    <td>
                      設計どおりの I/F で接続するか。<Link href="/patterns/evaluation">Evaluation</Link>（ゴールデンデータ照合）で応答の正しさを機械検証
                    </td>
                  </tr>
                  <tr>
                    <td>コード（実装）</td>
                    <td>UT（単体テスト）</td>
                    <td>
                      コードが正しく動くか。<Link href="/references/prompt-tips">AI コーディングツール</Link>で実装とテストを同時生成し、<Link href="/patterns/self-check">Self-check</Link> で人間のレビュー前に自己点検
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
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
