---
id: manufacturing--waterfall--testing
type: intersection
domain: manufacturing
method: waterfall
phase: testing
title: 製造 × テスト（検査工程）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 検査は「記録の工程」。AI の貢献先は検査判定ではなく、**検査記録の記入漏れチェック・集計・報告書化**（[不具合報告の整理](/domains/manufacturing/use-cases/defect-report.md)）
- 合否判定・抜取り数などの検査基準は品質責任者の領域。AI は判定に関与しない設計を明文化する

## この領域特有の注意

- 測定値の転記ミスは重大な品質問題。数値は測定機・システムから直接渡し、AI に転記・補完させない
- 検査基準書の改訂履歴を AI に読ませる場合、**どの時点の基準**で話しているかを常に明示する
