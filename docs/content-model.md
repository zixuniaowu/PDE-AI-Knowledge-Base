# コンテンツモデル（スキーマ仕様）

正規のスキーマ定義は `packages/content-core/src/schema.ts`（Zod）。ここでは人間向けリファレンスを示します。

共通ルール:

- id: `^[a-z0-9]+(-[a-z0-9]+)*$`（kebab-case、作成後変更禁止）
- updated: `YYYY-MM-DD`
- owners: GitHub ユーザー名の配列（例: `["@zixuniaowu"]`）
- status: `draft` → `reviewed` → `approved`

## domain: meta.json

```json
{
  "id": "education",
  "name": "教育",
  "description": "学校教育・企業研修における AI 活用",
  "icon": "🎓",
  "tags": ["教育", "研修"],
  "owners": ["@zixuniaowu"],
  "status": "draft",
  "updated": "2026-09-12"
}
```

| フィールド | 必須 | 説明 |
|---|---|---|
| id | ✅ | ディレクトリ名と一致させること |
| name | ✅ | 表示名（日本語） |
| description | ✅ | 1 行説明 |
| icon | | 絵文字 1 文字 |
| tags | | 検索・絞り込み用 |
| owners | ✅ | 領域オーナー |
| status | ✅ | draft / reviewed / approved |
| updated | ✅ | 最終更新日 |

## domain: index.md

frontmatter:

```yaml
---
id: education        # meta.json の id と一致
type: domain
title: 教育
updated: 2026-09-12
---
```

本文: 領域の概要、AI 活用の全体像、この領域特有の注意事項。

## use-case: domains/<id>/use-cases/<case-id>.md

```yaml
---
id: grading-assistant
type: use-case
domain: education        # 所属領域 id（必須・一致必須）
title: 採点・フィードバック支援
summary: ルーブリックに基づく採点下書きと個別フィードバック生成
aiPatterns: ["rag"]      # patterns/ の id を参照（任意・複数可）
phaseLinks:              # 工程との関連（任意）
  - method: agile
    phase: review
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---
```

本文の推奨構成: 背景 / 人間の役割 / AI の役割 / プロンプト例 / 失敗パターン / 指標。

## phase: process/<method>/<phase-id>.md

```yaml
---
id: sprint-planning
type: phase
method: agile            # waterfall / agile / ...（ディレクトリ名と一致）
order: 1                 # 工程内の表示順
title: スプリントプランニング
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-13
---
```

本文の必須見出し（この順で）:

1. `## この工程の目的`
2. `## よくある失敗`
3. `## PDEの仕事`
4. `## AIツールの使いどころ`
5. `## 進め方（実プロンプト付き）`
6. `## 成果物と受け入れ基準`

任意: `## 前後の工程との接続`。

工程ページは PDE（Product Design Engineer）が AI ツールと回す一人の作業視点で書く。交点ページは `PDEの仕事` と `AIツールの使いどころ` の 2 セクションを抽出して表示する。

## pattern: patterns/<id>.md

```yaml
---
id: rag
type: pattern
title: RAG（検索拡張生成）
summary: 社内文書や専門知識を検索してから回答を生成させる基本パターン
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---
```

本文の推奨構成: 概要 / 仕組み / 適している場面 / 各領域での応用 / 落とし穴。

## guide: guide/<id>.md

「PDE の始め方」などの順序付きガイド。`order` で並び順を制御する。

```yaml
---
id: step-1-pick-a-task
type: guide
order: 1
title: STEP 1 — 小さく始める
summary: 最初の 1 業務を選ぶ
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---
```

## 検証

```bash
pnpm validate:content
```

- すべての md / meta.json を Zod スキーマで検証
- id とディレクトリ名の一致、参照整合（domain / aiPatterns / phaseLinks の先が存在するか）をチェック
- `_template` の存在チェック
