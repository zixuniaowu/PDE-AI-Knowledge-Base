/**
 * 市場データのデータソース一覧を明示するテーブル。
 * 収集方法（自動/手動/未対応）と最新の計測値を site ごとに示す。
 */
import type { MarketSnapshot } from "@/components/charts";

const SOURCES = [
  {
    id: "freelance-board",
    name: "フリーランスボード",
    url: "https://freelance-board.com/jobs/fde",
    method: "自動",
    cadence: "毎週月曜（GitHub Actions）",
    note: "案件数「全N件」+ 単価サンプル（中央値）",
  },
  {
    id: "levtech",
    name: "レバテックフリーランス",
    url: "https://freelance.levtech.jp/word/list/150732/",
    method: "自動",
    cadence: "毎週月曜（GitHub Actions）",
    note: "キーワード一覧の公表件数（詳細は要認証）",
  },
  {
    id: "freelance-start",
    name: "フリーランススタート",
    url: "https://freelance-start.com/jobs/job_category-47",
    method: "手動",
    cadence: "週次調査時に手動計上",
    note: "ボット対策のため自動取得不可（HTTP 202）",
  },
  {
    id: "others",
    name: "PE-BANK / Findy / Midworks ほか",
    url: null,
    method: "未対応",
    cadence: "—",
    note: "要認証・ページ構造調査のうえ追加予定",
  },
];

export function MarketSourcesTable({ snapshots }: { snapshots: MarketSnapshot[] }) {
  // ソース id ごとの最新値と計測日
  const latest = new Map<string, { count: number; date: string }>();
  for (const s of [...snapshots].sort((a, b) => a.date.localeCompare(b.date))) {
    const entries: [string, number][] = [];
    if (s.sources) {
      for (const [id, count] of Object.entries(s.sources)) {
        entries.push([id, count]);
      }
    }
    if (s.freelanceStart != null) entries.push(["freelance-start", s.freelanceStart]);
    if (s.freelanceBoard != null) entries.push(["freelance-board", s.freelanceBoard]);
    for (const [id, count] of entries) {
      latest.set(id, { count, date: s.date });
    }
  }

  const badge = (method: string) =>
    method === "自動" ? "badge badge-ai" : method === "手動" ? "badge badge-human" : "badge";

  return (
    <table className="market-sources">
      <thead>
        <tr>
          <th>データソース</th>
          <th>収集方法</th>
          <th>最新の計測値</th>
          <th>備考</th>
        </tr>
      </thead>
      <tbody>
        {SOURCES.map((src) => {
          const hit = latest.get(src.id);
          return (
            <tr key={src.id}>
              <td>
                {src.url ? (
                  <a href={src.url} target="_blank" rel="noopener noreferrer">
                    {src.name}
                  </a>
                ) : (
                  src.name
                )}
              </td>
              <td>
                <span className={badge(src.method)}>{src.method}</span>{" "}
                <span className="ms-cadence">{src.cadence}</span>
              </td>
              <td>
                {hit ? (
                  <>
                    <strong>{hit.count} 件</strong>
                    <span className="ms-date">（{hit.date}）</span>
                  </>
                ) : src.method === "未対応" ? (
                  "—"
                ) : (
                  "未収集"
                )}
              </td>
              <td className="ms-note">{src.note}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
