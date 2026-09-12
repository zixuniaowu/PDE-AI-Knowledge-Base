---
id: finance--waterfall--testing
type: intersection
domain: finance
method: waterfall
phase: testing
title: 金融・経理 × テスト（数値検証・突合）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 経理の「テスト」は突合と検証。AI は差異の一覧化・パターン分類・[月次レポート](/domains/finance/use-cases/monthly-report.md)の出典突合で効く。**計算そのものは AI にさせない**
- 「説明が必要な差異」の候補抽出は AI の得意分野。人間は原因分析に集中する

## この領域特有の注意

- 数値は常にシステムから渡す。AI に計算・補完させないルールをプロンプトと検収の両面で強制する
- 突合記録は監査対象。「AI が整理し、誰が確認したか」が追跡できる形で保存する
