/**
 * 週次バッチ: 招聘サイトから FDE 案件のスナップショットを収集し、
 * data/market-history.json に追記する。
 *
 * - フリーランスボード: 自動取得（案件数「全N件」+ 単価サンプルの中央値）
 * - フリーランススタート: ボット対策のため自動取得不可 → --manual で手動記録
 *
 * 使い方:
 *   node scripts/collect-market-data.mjs                     # 自動収集（今日の日付）
 *   node scripts/collect-market-data.mjs --manual --fs 150 --board 110 \
 *        --min 51 --max 200 --note "手動調査" [--date 2026-10-01]
 *
 * 同日のスナップショットが既にある場合は上書きする。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FB_URL = "https://freelance-board.com/jobs/fde";
const FS_URL = "https://freelance-start.com/jobs/job_category-47";
const DATA_FILE = "data/market-history.json";
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const val = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const today = new Date().toISOString().slice(0, 10);
const date = val("--date") ?? today;

function median(nums) {
  if (nums.length === 0) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round(((s[mid - 1] + s[mid]) / 2) * 10) / 10;
}

async function fetchBoard() {
  const res = await fetch(FB_URL, {
    headers: { "user-agent": UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    console.warn(`⚠ freelance-board: HTTP ${res.status} — 取得失敗`);
    return null;
  }
  const html = await res.text();
  const countMatch = html.match(/全([0-9,]+)件/);
  const count = countMatch ? Number(countMatch[1].replace(/,/g, "")) : null;
  // 案件単価のサンプル（FDE の現実レンジ 50〜300 万円に絞ってノイズ除去）
  const rates = [...html.matchAll(/([0-9]{2,3})万円/g)]
    .map((m) => Number(m[1]))
    .filter((n) => n >= 50 && n <= 300);
  if (count === null && rates.length === 0) {
    console.warn("⚠ freelance-board: 解析できる数字が見つからない（ページ構造変更の可能性）");
    return null;
  }
  return {
    count,
    rateMedian: median(rates),
    rateSamples: rates.length,
  };
}

async function fetchStart() {
  const res = await fetch(FS_URL, {
    headers: { "user-agent": UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    return null; // ボット対策により 202/403 を返すことがある
  }
  const html = await res.text();
  const m = html.match(/([0-9,]+)\s*件/);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

function loadHistory() {
  if (existsSync(DATA_FILE)) {
    return JSON.parse(readFileSync(DATA_FILE, "utf8"));
  }
  return { description: "FDE 案件数の時系列スナップショット", snapshots: [] };
}

function saveHistory(history) {
  history.snapshots.sort((a, b) => a.date.localeCompare(b.date));
  writeFileSync(DATA_FILE, JSON.stringify(history, null, 2) + "\n");
}

const history = loadHistory();
let snapshot;

if (has("--manual")) {
  const fs = val("--fs") ? Number(val("--fs")) : null;
  const board = val("--board") ? Number(val("--board")) : null;
  const total = val("--total") ? Number(val("--total")) : (fs ?? 0) + (board ?? 0);
  const min = val("--min") ? Number(val("--min")) : null;
  const max = val("--max") ? Number(val("--max")) : null;
  snapshot = {
    date,
    manual: true,
    ...(fs !== null && { freelanceStart: fs }),
    ...(board !== null && { freelanceBoard: board }),
    ...(total !== null && { total }),
    ...(min !== null && max !== null && { rateRange: [min, max] }),
    note: val("--note") ?? "手動調査",
  };
} else {
  console.log("… フリーランスボードを取得中");
  const board = await fetchBoard();
  console.log("… フリーランススタートを取得中（自動取得不可の場合は手動記録を推奨）");
  const start = await fetchStart().catch(() => null);
  if (!board && !start) {
    console.error("❌ どのソースからも取得できませんでした。--manual で手動記録してください。");
    process.exit(1);
  }
  const total = (board?.count ?? 0) + (start ?? 0) || null;
  snapshot = {
    date,
    manual: false,
    ...(start !== null && { freelanceStart: start }),
    ...(board?.count != null && { freelanceBoard: board.count }),
    ...(total != null && { total }),
    ...(board?.rateMedian != null && { boardRateMedian: board.rateMedian }),
    note: board?.rateMedian
      ? `自動収集。ボード単価サンプル ${board.rateSamples} 件の中央値 ${board.rateMedian} 万円`
      : "自動収集",
  };
  if (start === null) {
    snapshot.note += "／フリーランススタートは要認証のため未計上（次回手動で補完推奨）";
  }
}

const existing = history.snapshots.findIndex((s) => s.date === snapshot.date);
if (existing >= 0) {
  history.snapshots[existing] = snapshot;
  console.log(`↻ ${snapshot.date} のスナップショットを更新`);
} else {
  history.snapshots.push(snapshot);
  console.log(`＋ ${snapshot.date} のスナップショットを追加`);
}
saveHistory(history);
console.log(`✅ ${DATA_FILE} (${history.snapshots.length} snapshots)`);
console.log(JSON.stringify(snapshot));
