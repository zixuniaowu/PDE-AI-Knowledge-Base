import { listDomains, listIntersections, listPhases } from "@pde/content-core";

const STEPS = [
  "課題ヒアリング",
  "業務の要件化",
  "プロトタイプ",
  "実装",
  "本番導入",
  "現場定着",
];

const SHORT: Record<string, string> = {
  requirements: "要件",
  design: "設計",
  implementation: "実装",
  testing: "テスト",
  deployment: "リリース",
  maintenance: "運用",
  "sprint-planning": "計画",
  "backlog-refinement": "リファ",
  "daily-scrum": "朝会",
  review: "レビュー",
  retrospective: "レトロ",
};

const METHOD_LABEL: Record<string, string> = {
  waterfall: "ウォーターフォール",
  agile: "アジャイル",
};

/**
 * ホームページ用の全站アーキテクチャマップ。
 * 内容はビルド時に content から生成（領域 × 工程 の交点ノートの有無も反映）。
 */
export function HomeMap() {
  const domains = listDomains();
  const phases = listPhases();
  const noteKeys = new Set(listIntersections().map((n) => n.data.id));

  // ── レイアウト定数 ──
  const W = 1200;
  const stepW = 164;
  const stepH = 48;
  const stepGap = 16;
  const flowY = 26;
  const flowTotalW = STEPS.length * stepW + (STEPS.length - 1) * stepGap;
  const flowX = (W - flowTotalW) / 2;

  const labelW = 150;
  const cellW = 34;
  const cellH = 26;
  const gapX = 6;
  const gapY = 8;
  const headH = 52;
  const matrixW = labelW + phases.length * (cellW + gapX);
  const matrixX = (W - matrixW) / 2;
  const matrixY = 200;

  const methods = [...new Set(phases.map((p) => p.data.method))];
  const noteCount = phases.filter((p) =>
    domains.some((d) => noteKeys.has(`${d.id}--${p.data.method}--${p.data.id}`))
  ).length;
  const total = domains.length * phases.length;

  return (
    <svg
      viewBox={`0 0 ${W} 660`}
      role="img"
      aria-label="FDE ナレッジベースの全体構造"
      style={{ width: "100%", height: "auto", minWidth: 980 }}
    >
      {/* ── 6 ステップの仕事 ── */}
      <text x={W / 2} y={flowY - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--text-sub)">
        FDE の仕事は、この 6 ステップを AI と一緒に回すこと
      </text>
      {STEPS.map((s, i) => {
        const x = flowX + i * (stepW + stepGap);
        return (
          <g key={s}>
            <rect
              x={x}
              y={flowY + 8}
              width={stepW}
              height={stepH}
              rx={12}
              fill="var(--accent-soft)"
              stroke="var(--accent)"
              strokeWidth={1.5}
            />
            <text x={x + stepW / 2} y={flowY + 28} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent)">
              {i + 1}
            </text>
            <text x={x + stepW / 2} y={flowY + 44} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">
              {s}
            </text>
            {i < STEPS.length - 1 && (
              <text x={x + stepW + stepGap / 2} y={flowY + 37} textAnchor="middle" fontSize="14" fill="var(--text-faint)">
                →
              </text>
            )}
          </g>
        );
      })}

      {/* ── マトリクスの説明 ── */}
      <text x={W / 2} y={matrixY - 40} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--text-sub)">
        知識は「領域 × 工程」のマトリクスに整理され、各マスが 1 ページ
      </text>

      {/* ── 工程のグループ見出し ── */}
      {methods.map((m) => {
        const cols = phases.filter((p) => p.data.method === m);
        const first = phases.findIndex((p) => p.data.method === m);
        const x = matrixX + labelW + first * (cellW + gapX);
        const w = cols.length * (cellW + gapX) - gapX;
        return (
          <g key={m}>
            <text x={x + w / 2} y={matrixY + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-sub)">
              {METHOD_LABEL[m] ?? m}
            </text>
            <line x1={x} y1={matrixY + 24} x2={x + w} y2={matrixY + 24} stroke="var(--border)" strokeWidth={1} />
          </g>
        );
      })}

      {/* ── 工程の列見出し ── */}
      {phases.map((p, ci) => {
        const x = matrixX + labelW + ci * (cellW + gapX);
        return (
          <a key={p.data.id} href={`/process/${p.data.method}/${p.data.id}/`}>
            <text
              x={x + cellW / 2}
              y={matrixY + 44}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="600"
              fill="var(--text-sub)"
            >
              {SHORT[p.data.id] ?? p.data.id}
            </text>
          </a>
        );
      })}

      {/* ── 領域の行見出し + セル ── */}
      {domains.map((d, ri) => {
        const y = matrixY + headH + ri * (cellH + gapY);
        return (
          <g key={d.id}>
            <a href={`/domains/${d.id}/`}>
              <text x={matrixX + labelW - 10} y={y + cellH / 2 + 4} textAnchor="end" fontSize="12.5" fontWeight="600" fill="var(--text)">
                {d.icon ?? "📦"} {d.name}
              </text>
            </a>
            {phases.map((p, ci) => {
              const key = `${d.id}--${p.data.method}--${p.data.id}`;
              const has = noteKeys.has(key);
              const x = matrixX + labelW + ci * (cellW + gapX);
              return (
                <a key={key} href={`/matrix/${d.id}/${p.data.method}/${p.data.id}/`}>
                  <title>
                    {`${d.name} × ${p.data.title}${has ? " — 交点ノートあり" : ""}`}
                  </title>
                  <rect
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    rx={6}
                    fill={has ? "var(--accent)" : "var(--surface)"}
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  {has && (
                    <text x={x + cellW / 2} y={y + cellH / 2 + 4} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">
                      📝
                    </text>
                  )}
                </a>
              );
            })}
          </g>
        );
      })}

      {/* ── 凡例 ── */}
      <g transform={`translate(${matrixX + labelW}, ${matrixY + headH + domains.length * (cellH + gapY) + 16})`}>
        <rect x={0} y={-11} width={14} height={14} rx={4} fill="var(--accent)" />
        <text x={20} y={0} fontSize="12.5" fill="var(--text-sub)">
          交点ノートあり
        </text>
        <rect x={120} y={-11} width={14} height={14} rx={4} fill="var(--surface)" stroke="var(--border)" />
        <text x={140} y={0} fontSize="12.5" fill="var(--text-sub)">
          自動生成ページ（ノート募集）
        </text>
        <text x={380} y={0} fontSize="12.5" fontWeight="700" fill="var(--text)">
          {domains.length} 領域 × {phases.length} 工程 = {total} ページ / ノート {noteKeys.size} 件
        </text>
      </g>

      {/* ── 下部: 参考資料の帯 ── */}
      <g transform={`translate(0, ${matrixY + headH + domains.length * (cellH + gapY) + 52})`}>
        {[
          { t: "ガイド 7 ステップ", h: "/guide/", x: 90 },
          { t: "市場需要分析", h: "/references/market-demand/", x: 330 },
          { t: "パターン 9 型", h: "/patterns/", x: 570 },
          { t: "クラウド別マップ", h: "/references/cloud-ai-services/", x: 790 },
          { t: "業務プロセス", h: "/references/business-processes/", x: 1010 },
        ].map((c) => (
          <a key={c.h} href={c.h}>
            <rect x={c.x - 10} y={-24} width={c.t.length * 14 + 24} height={34} rx={17} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1} />
            <text x={c.x + c.t.length * 7 + 2} y={-2} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--accent)">
              {c.t}
            </text>
          </a>
        ))}
      </g>
    </svg>
  );
}
