import Link from "next/link";

/** 純 SVG + div の軽量チャート（クライアント JS 不要） */

export function JobCountChart({
  data,
}: {
  data: { label: string; url: string; count: number; maxLabel: string }[];
}) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="chart">
      {data.map((d) => (
        <div key={d.label} className="chart-row">
          <Link href={d.url} className="chart-label" target="_blank" rel="noopener noreferrer">
            {d.label}
          </Link>
          <div className="chart-track">
            <div className="chart-bar" style={{ width: `${(d.count / max) * 100}%` }} />
            <span className="chart-value">
              {d.count} 件<span className="chart-sub">{d.maxLabel}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const PIE_COLORS = ["#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

/** 月額単価の分布を円グラフで表示（純 SVG・クライアント JS 不要） */
export function RatePie({
  rates,
  buckets,
  sampleNote,
}: {
  rates: number[];
  buckets: { label: string; min: number; max: number }[];
  sampleNote: string;
}) {
  const counts = buckets.map((b) => rates.filter((r) => r >= b.min && r < b.max).length);
  const total = counts.reduce((a, b) => a + b, 0);
  const entries = buckets
    .map((b, i) => ({ ...b, count: counts[i], color: PIE_COLORS[i % PIE_COLORS.length] }))
    .filter((e) => e.count > 0);

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 112;
  let angle = -Math.PI / 2;
  const slices = entries.map((e) => {
    const sweep = (e.count / total) * Math.PI * 2;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    const large = sweep > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const mid = (start + end) / 2;
    const pct = Math.round((e.count / total) * 100);
    const lx = cx + r * 0.62 * Math.cos(mid);
    const ly = cy + r * 0.62 * Math.sin(mid);
    return { ...e, pct, lx, ly, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` };
  });

  return (
    <div>
      <div className="pie-wrap">
        <svg
          className="pie-svg"
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="FDE 案件の月額単価分布（円グラフ）"
        >
          {entries.length === 1 ? (
            <circle cx={cx} cy={cy} r={r} fill={entries[0].color} className="chart-slice" />
          ) : (
            slices.map((s) => (
              <path
                key={s.label}
                className="chart-slice"
                d={s.d}
                fill={s.color}
                stroke="var(--surface)"
                strokeWidth={2}
              />
            ))
          )}
          {slices
            .filter((s) => s.pct >= 8)
            .map((s) => (
              <text
                key={s.label}
                x={s.lx}
                y={s.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={700}
                fill={s.color === PIE_COLORS[PIE_COLORS.length - 1] ? "#0b1120" : "#fff"}
              >
                {s.pct}%
              </text>
            ))}
        </svg>
        <div className="pie-legend">
          {slices.map((s) => (
            <div key={s.label} className="pie-legend-row">
              <span className="pie-swatch" style={{ background: s.color }} />
              <span className="pie-legend-label">{s.label}</span>
              <span className="pie-legend-value">
                {s.count} 件・{s.pct}%
              </span>
            </div>
          ))}
          <div className="pie-legend-total">合計 {total} 件</div>
        </div>
      </div>
      <p className="chart-note">{sampleNote}</p>
    </div>
  );
}

export function StatChips({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="stat-chips">
      {items.map((s) => (
        <div key={s.label} className="stat-chip">
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export interface MarketSnapshot {
  date: string;
  manual?: boolean;
  freelanceStart?: number;
  freelanceBoard?: number;
  total?: number;
  note?: string;
  /** ソース id ごとの計測値（freelance-board / levtech / freelance-start） */
  sources?: Record<string, number>;
  boardRateMedian?: number;
}

/** 週（月曜開始）の開始日を YYYY-MM-DD で返す */
function weekStart(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const day = (d.getUTCDay() + 6) % 7; // Mon=0
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

/** 直近 6 週の FDE 案件数を棒グラフで表示（データのない週は空欄） */
export function WeeklyDemandBars({ snapshots }: { snapshots: MarketSnapshot[] }) {
  const WEEKS = 6;

  // 週（開始日）ごとの最新値を集計
  const byWeek = new Map<string, MarketSnapshot>();
  for (const s of [...snapshots].sort((a, b) => a.date.localeCompare(b.date))) {
    byWeek.set(weekStart(s.date), s);
  }

  const now = new Date();
  const todayStart = weekStart(now.toISOString().slice(0, 10));
  const slots: { key: string; label: string; board: number | null; total: number | null }[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    const d = new Date(todayStart + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - i * 7);
    const key = d.toISOString().slice(0, 10);
    const hit = byWeek.get(key);
    slots.push({
      key,
      label: `${Number(key.slice(5, 7))}/${Number(key.slice(8, 10))}`,
      board: hit?.freelanceBoard ?? null,
      total: hit?.total ?? null,
    });
  }

  const maxVal =
    Math.max(50, ...slots.flatMap((s) => [s.board ?? 0, s.total ?? 0])) * 1.2;
  const W = 1100;
  const H = 300;
  const padL = 60;
  const padR = 40;
  const padT = 30;
  const padB = 46;
  const slotW = (W - padL - padR) / WEEKS;
  const barW = 40;
  const yOf = (v: number) => padT + (1 - v / maxVal) * (H - padT - padB);
  const yTicks = [0, Math.round(maxVal / 2), Math.round(maxVal)];

  return (
    <svg
      className="weekly-bars"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="週別 FDE 案件数（直近 6 週）"
      style={{ width: "100%", height: "auto", minWidth: 860, display: "block" }}
    >
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={W - padR} y2={yOf(v)} stroke="var(--border)" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 4} textAnchor="end" fontSize={11.5} fill="var(--text-faint)">
            {v}
          </text>
        </g>
      ))}
      <text x={14} y={padT - 12} fontSize={12} fontWeight={700} fill="var(--text-sub)">
        FDE 案件数（件/週）
      </text>

      {slots.map((s, i) => {
        const cx = padL + i * slotW + slotW / 2;
        const hasBoard = s.board != null && s.board > 0;
        const hasTotal = s.total != null && s.total > 0;
        return (
          <g key={s.key}>
            {hasBoard && s.board != null && (
              <>
                <rect
                  x={cx + 4}
                  y={yOf(s.board)}
                  width={barW}
                  height={yOf(0) - yOf(s.board)}
                  rx={6}
                  fill="var(--accent)"
                />
                <text x={cx + 4 + barW / 2} y={yOf(s.board) - 10} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="var(--text)">
                  {s.board}
                </text>
              </>
            )}
            {hasTotal && s.total != null && (
              <>
                <rect
                  x={cx - 4 - barW}
                  y={yOf(s.total)}
                  width={barW}
                  height={yOf(0) - yOf(s.total)}
                  rx={6}
                  fill="var(--human-soft)"
                  stroke="var(--human)"
                  strokeWidth={1.4}
                />
                <text x={cx - 4 - barW / 2} y={yOf(s.total) - 10} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="var(--text)">
                  {s.total}
                </text>
              </>
            )}
            {!hasBoard && !hasTotal && (
              <text x={cx} y={yOf(0) - 10} textAnchor="middle" fontSize={11} fill="var(--text-faint)">
                未収集
              </text>
            )}
            <text x={cx} y={H - 22} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--text-sub)">
              {s.label}
            </text>
            {i === WEEKS - 1 && (
              <text x={cx} y={H - 7} textAnchor="middle" fontSize={10} fill="var(--text-faint)">
                {s.key.slice(0, 4)}
              </text>
            )}
          </g>
        );
      })}

      {/* 凡例 */}
      <g transform={`translate(${W - padR - 330}, ${padT - 14})`}>
        <rect x={0} y={-9} width={13} height={13} rx={4} fill="var(--accent)" />
        <text x={18} y={2} fontSize={11.5} fill="var(--text-sub)">
          ボード（自動）
        </text>
        <rect x={128} y={-9} width={13} height={13} rx={4} fill="var(--human-soft)" stroke="var(--human)" strokeWidth={1.4} />
        <text x={146} y={2} fontSize={11.5} fill="var(--text-sub)">
          2 サイト合計（手動）
        </text>
      </g>
    </svg>
  );
}
