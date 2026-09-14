---
id: software-development--waterfall--maintenance
type: intersection
domain: software-development
method: waterfall
phase: maintenance
title: ソフトウェア開発 × 運用（モデル移行と依存管理）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-13
---

## この交点の要点

- 通常運用に加えて **LLM 特有の運用**が乗る: モデル EOL 追跡表、429 レート制限のバックオフ、コスト監視、コンテンツフィルタ調整
- 依存ライブラリ更新と AI モデル更新は別管理。モデル移行時は評価を再実行し、品質低下を検出してから切り替える

## この領域特有の注意

- 顧客案件ではモデル変更が**統制・契約の変更**になる場合がある（Azure OpenAI のリージョン、Bedrock のモデル有効化など）。顧客承認の手順を運用設計に含める
- 障害報告書は AI ドラフト → 人間確定の流れを崩さない（[障害報告のユースケース](/domains/software-development/use-cases/incident-report.md)）
