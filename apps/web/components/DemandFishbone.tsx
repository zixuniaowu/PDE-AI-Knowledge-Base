/**
 * ホーム用の需要推移タイムライン（フィッシュボーン / いわ図）。
 * 週次バッチが蓄積したスナップショットから、今週以降 1 週ごとに骨が伸びる。
 * 丸の大きさ = その週のボード案件数。データのない週はまだ描かない。
 */
const W = 1100;
const H = 420;

interface FishSnapshot {
  date: string;
  manual?: boolean;
  freelanceBoard?: number;
  total?: number;
  note?: string;
  boardRateMedian?: number;
}

/** 週（月曜開始）の開始日を YYYY-MM-DD で返す */
function weekStart(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const day = (d.getUTCDay() + 6) % 7; // Mon=0
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

export function DemandFishbone({ snapshots }: { snapshots: FishSnapshot[] }) {
  // 週ごとにまとめる（同週が複数あれば最新を採用）
  const byWeek = new Map<string, FishSnapshot>();
  for (const s of [...snapshots].sort((a, b) => a.date.localeCompare(b.date))) {
    byWeek.set(weekStart(s.date), s);
  }
  const weeks = [...byWeek.entries()]; // [weekStart, snapshot]

  const baseY = 250;
  const gap = 200;
  const x0 = 90;
  const spineEndX = x0 + Math.max(weeks.length, 2) * gap + 40;

  const valueOf = (s: FishSnapshot) => s.freelanceBoard ?? 0;
  const rOf = (s: FishSnapshot) => 14 + Math.min(26, valueOf(s) / 6);
  const labelOf = (weekKey: string) =>
    `${Number(weekKey.slice(5, 7))}/${Number(weekKey.slice(8, 10))}`;

  return (
    <svg
      className="fishbone"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="FDE 需要の週次フィッシュボーン図"
      style={{ width: "100%", height: "auto", minWidth: 860, display: "block" }}
    >
      <defs>
        <marker id="fb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* 背骨（時間軸・週次） */}
      <line
        x1={x0 - 40}
        y1={baseY}
        x2={spineEndX}
        y2={baseY}
        stroke="var(--accent)"
        strokeWidth={3}
        markerEnd="url(#fb-arrow)"
        opacity={0.85}
      />
      <text x={spineEndX - 4} y={baseY - 14} textAnchor="end" fontSize={12.5} fontWeight={700} fill="var(--accent)">
        毎週 1 ノードずつ延伸
      </text>

      {/* 週ノード */}
      {weeks.map(([key, s], i) => {
        const x = x0 + (i + 1) * gap;
        const r = rOf(s);
        const board = valueOf(s);
        const above = i % 2 === 0; // 骨は上下交互
        const ribX = x - 66;
        const ribY = above ? baseY - 100 : baseY + 96;
        return (
          <g key={key}>
            {/* 骨 */}
            <line x1={x} y1={baseY} x2={ribX + 46} y2={ribY + (above ? 12 : -12)} stroke="var(--text-faint)" strokeWidth={1.6} />
            <text x={ribX} y={ribY} fontSize={13} fontWeight={700} fill="var(--text)">
              ボード {board} 件
            </text>
            {s.total != null && (
              <text x={ribX} y={ribY + 19} fontSize={11.5} fill="var(--human)">
                2 サイト合計 {s.total} 件
              </text>
            )}
            <text x={ribX} y={ribY + (s.total != null ? 37 : 19)} fontSize={11} fill="var(--accent)">
              {s.boardRateMedian ? `単価中央値 ${s.boardRateMedian} 万円` : s.manual ? "手動調査" : "自動収集"}
            </text>
            {/* 週ノード */}
            <circle cx={x} cy={baseY} r={r} fill="var(--accent)" opacity={0.92}>
              <title>{`${key} の週: ボード ${board} 件${s.total != null ? ` / 合計 ${s.total} 件` : ""}`}</title>
            </circle>
            <text x={x} y={baseY + 5} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">
              {board}
            </text>
            <text x={x} y={baseY + r + 24} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="var(--text-sub)">
              {labelOf(key)}
            </text>
            {i === weeks.length - 1 && (
              <text x={x} y={baseY + r + 42} textAnchor="middle" fontSize={10.5} fill="var(--text-faint)">
                最新
              </text>
            )}
          </g>
        );
      })}

      {weeks.length === 0 && (
        <text x={W / 2} y={baseY} textAnchor="middle" fontSize={13} fill="var(--text-faint)">
          まだスナップショットがありません
        </text>
      )}

      {/* 凡例 */}
      <g transform="translate(40, 30)">
        <text fontSize={12} fill="var(--text-sub)">
          背骨 = 時間（週次） ・ 丸 = その週のボード案件数（大きさ = 規模） ・ 骨 = 計測結果
        </text>
      </g>
      <g transform="translate(40, 52)">
        <text fontSize={11} fill="var(--text-faint)">
          週次バッチ（毎週月曜）が 1 ノードずつ追加します
        </text>
      </g>
    </svg>
  );
}
