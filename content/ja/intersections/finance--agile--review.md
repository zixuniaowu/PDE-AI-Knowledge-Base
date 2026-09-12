---
id: finance--agile--review
type: intersection
domain: finance
method: agile
phase: review
title: 金融・経理 × レビュー（決算・報告のレビュー）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 報告書のレビューは「数値の突合 + 解説の妥当性」の二段階。AI の出典突合（[月次レポート](/domains/finance/use-cases/monthly-report.md)）を一次チェックにし、レビューアーは**差異の説明が経営判断として正しいか**をレビューする
- レビューで見つかった数値の引用漏れは、次回のガードレール（[評価パターン](/patterns/evaluation)）に追加する

## この領域特有の注意

- レビューの承認記録（誰がいつ確定したか）は監査の要。AI の点検結果を承認の代替にしない
- 「前月と同じ書き方」の惰性レビューを防ぐため、AI に「前月との差分ポイント」を先に抽出させる
