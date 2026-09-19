/**
 * 工程ページ（waterfall）用の V モデル図。
 * 純 SVG（クライアント JS 不要・CSS 変数でダークモード対応）。
 *
 * 左側を下りながら定義し（人間が主導）、右側を上りながら検証する。
 * 対応する定義と検証を横の点線で結ぶ。
 */

const BOX_W = 180;
const BOX_H = 62;

interface VNode {
  key: string;
  title: string;
  sub: string;
  x: number;
  y: number;
  side: "define" | "verify";
}

const NODES: VNode[] = [
  { key: "biz", title: "Biz 要件（業務要件）", sub: "AI: ヒアリングの構造化", x: 40, y: 56, side: "define" },
  { key: "sys", title: "System 要件", sub: "AI: 受入基準のたたき台", x: 170, y: 178, side: "define" },
  { key: "detail", title: "詳細設計", sub: "AI: I/F 定義ドラフト", x: 300, y: 300, side: "define" },
  { key: "code", title: "コード（実装）", sub: "AI コーディングツール", x: 380, y: 422, side: "define" },
  { key: "ut", title: "UT（単体テスト）", sub: "AI: テスト生成 / Self-check", x: 620, y: 422, side: "verify" },
  { key: "it", title: "IT テスト（結合）", sub: "AI: Evaluation で照合", x: 600, y: 300, side: "verify" },
  { key: "join", title: "結合テスト", sub: "AI: 連携ログの突合・要約", x: 730, y: 178, side: "verify" },
  { key: "uat", title: "UAT（受入テスト）", sub: "人間の判断 / 承認", x: 860, y: 56, side: "verify" },
];

/** 対応する定義と検証（横の点線） */
const PAIRS: { from: string; to: string; label: string }[] = [
  { from: "biz", to: "uat", label: "業務の成果指標が動いたか" },
  { from: "sys", to: "join", label: "システム要件どおり連動するか" },
  { from: "detail", to: "it", label: "設計どおりの I/F で接続するか" },
  { from: "code", to: "ut", label: "コードが正しく動くか" },
];

const nodeByKey = (key: string) => NODES.find((n) => n.key === key)!;

export function VModel() {
  return (
    <svg
      viewBox="0 0 1080 506"
      role="img"
      aria-label="ウォーターフォールの V モデル"
      style={{ width: "100%", height: "auto", minWidth: 720 }}
    >
      <defs>
        <marker
          id="v-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-sub)" />
        </marker>
        <marker
          id="v-arrow-accent"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* 対応の点線（ボックスの背面に引く） */}
      {PAIRS.map(({ from, to, label }) => {
        const a = nodeByKey(from);
        const b = nodeByKey(to);
        const y = a.y + BOX_H / 2;
        const x1 = a.x + BOX_W;
        const x2 = b.x;
        return (
          <g key={`pair-${from}-${to}`}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="var(--accent)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              markerStart="url(#v-arrow-accent)"
              markerEnd="url(#v-arrow-accent)"
            />
            <title>{label}</title>
            {x2 - x1 > 120 && (
              <text
                x={(x1 + x2) / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={11.5}
                fill="var(--accent)"
                fontWeight={600}
              >
                {label}
              </text>
            )}
          </g>
        );
      })}

      {/* 定義（左）と検証（右）の流れ */}
      {[
        ["biz", "sys"],
        ["sys", "detail"],
        ["detail", "code"],
        ["code", "ut"],
        ["ut", "it"],
        ["it", "join"],
        ["join", "uat"],
      ].map(([from, to]) => {
        const a = nodeByKey(from);
        const b = nodeByKey(to);
        const x1 = a.x + BOX_W / 2;
        const y1 = a.y + BOX_H;
        const x2 = b.x + BOX_W / 2;
        const y2 = b.y;
        return (
          <line
            key={`flow-${from}-${to}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--text-sub)"
            strokeWidth={1.8}
            markerEnd="url(#v-arrow)"
          />
        );
      })}

      {/* ノード */}
      {NODES.map((n) => {
        const fill = n.side === "define" ? "var(--human-soft)" : "var(--ai-soft)";
        const stroke = n.side === "define" ? "var(--human)" : "var(--ai)";
        return (
          <g key={n.key}>
            <rect
              x={n.x}
              y={n.y}
              width={BOX_W}
              height={BOX_H}
              rx={12}
              fill={fill}
              stroke={stroke}
              strokeWidth={1.5}
            />
            <text
              x={n.x + BOX_W / 2}
              y={n.y + 24}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill="var(--text)"
            >
              {n.title}
            </text>
            <text
              x={n.x + BOX_W / 2}
              y={n.y + 44}
              textAnchor="middle"
              fontSize={10.5}
              fill="var(--text-sub)"
            >
              {n.sub}
            </text>
          </g>
        );
      })}

      {/* 凡例 */}
      <g transform="translate(40, 40)">
        <rect x={0} y={-11} width={14} height={14} rx={4} fill="var(--human-soft)" stroke="var(--human)" strokeWidth={1.5} />
        <text x={22} y={0} fontSize={12} fill="var(--text-sub)">
          定義（人間が主導・下り）
        </text>
        <rect x={200} y={-11} width={14} height={14} rx={4} fill="var(--ai-soft)" stroke="var(--ai)" strokeWidth={1.5} />
        <text x={222} y={0} fontSize={12} fill="var(--text-sub)">
          検証（AI で高速化・上り）
        </text>
      </g>
    </svg>
  );
}
