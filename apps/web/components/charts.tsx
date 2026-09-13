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

export function RateHistogram({
  rates,
  buckets,
  sampleNote,
}: {
  rates: number[];
  buckets: { label: string; min: number; max: number }[];
  sampleNote: string;
}) {
  const counts = buckets.map((b) => rates.filter((r) => r >= b.min && r < b.max).length);
  const max = Math.max(...counts, 1);
  return (
    <div>
      <div className="chart">
        {buckets.map((b, i) => (
          <div key={b.label} className="chart-row">
            <span className="chart-label">{b.label}</span>
            <div className="chart-track">
              <div className="chart-bar" style={{ width: `${(counts[i] / max) * 100}%` }} />
              <span className="chart-value">{counts[i]} 件</span>
            </div>
          </div>
        ))}
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
