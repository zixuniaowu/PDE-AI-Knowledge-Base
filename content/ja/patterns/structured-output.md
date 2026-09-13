---
id: structured-output
type: pattern
title: 構造化出力
summary: 自由文ではなく JSON 等の構造で出力させる。下流処理・検証・集計が可能になる
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## 概要

AI に文章で答えさせる代わりに、**あらかじめ決めた形式（JSON・表・固定項目）で出力させる**パターン。出力を機械処理・検証・集計できるようになり、協働の「検収」を自動化できる。

## 仕組み

```text
「次の JSON 形式でのみ回答してください。
 項目: 判定(A/B/C), 根拠(引用), 確信度(high/medium/low)
 禁止: JSON 以外のテキスト」
```

→ 出力をスキーマで検証 → 不合格なら再生成 or 人間へ

## 適している場面

- 分類・判定・抽出系のタスク（採点判定、アンケート分類、条項抽出）
- 出力を集計・可視化したい場面（傾向分析）
- AI 出力をシステムに取り込む自動化パイプライン

## 各領域での応用

- 教育: 答案を設問ごとに {達成度, 引用, フィードバック} で出力
- 製造: 不具合報告を {現象, 発生工程, 重要度候補} に分解
- 法務: 契約条項を {条項番号, 分類, 雛形との差分} で一覧化

## 落とし穴

- 形式違反（JSON の外に文章が出る、項目の欠落）→ スキーマ検証 + 再試行を必ず入れる
- **構造は正しいが中身が間違い**の見逃し: 構造化は検証を楽にするだけで、正しさは保証しない。根拠（引用）項目を持たせて突き合わせる
- 項目設計が悪いと集計できない: 先に「集計して何を知りたいか」を決めてから項目を設計する

## 実装の型（スキーマ → 検証 → 再試行）

### 1. JSON Schema の例

```json
{
  "type": "object",
  "required": ["判定", "根拠", "確信度"],
  "properties": {
    "判定": { "type": "string", "enum": ["A", "B", "C", "検討中"] },
    "根拠": { "type": "string", "minLength": 5 },
    "確信度": { "type": "string", "enum": ["high", "medium", "low"] }
  },
  "additionalProperties": false
}
```

### 2. API 側の指定（例: Anthropic / OpenAI）

```text
・Anthropic: messages API でツール（input_schema）として上記スキーマを渡す
・OpenAI: response_format: { type: "json_schema", strict: true }
```

### 3. 検証と再試行（TypeScript + Zod）

```ts
const parsed = schema.safeParse(JSON.parse(output));
if (!parsed.success) {
  if (retryCount < 2) return generateAgain(`${output}\n\n上記は次のエラーで不正: ${parsed.error.message}。スキーマどおりに修正`);
  notifyHuman(output); // 2 回失敗したら人間へ
}
```

**構造の合格 ≠ 中身の正しい**: 根拠（引用）の突合は別途 [評価](./evaluation.md) で行う。
