---
id: software-development--waterfall--testing
type: intersection
domain: software-development
method: waterfall
phase: testing
title: ソフトウェア開発 × テスト（AI 出力の品質評価）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-13
---

## この交点の要点

- 従来テストに加えて **AI 出力の品質評価**がテスト工程に増える: ゴールデンデータ 20 件、LLM-as-judge、合格閾値（[評価の実装](/patterns/evaluation)）
- コード側は Playwright で状態一覧を網羅し、同一入力 10 回のばらつき確認（9 回以上一致）を回帰に含める

## この領域特有の注意

- 顧客提供の正解データは合意書に従い、双方立会いで計測して記録する（UAT 署名の根拠）
- モデル・プロンプト変更時は必ず評価を再実行。変更のたびに品質が静かに落ちることがある
