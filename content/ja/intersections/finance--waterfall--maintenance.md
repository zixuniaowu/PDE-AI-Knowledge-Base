---
id: finance--waterfall--maintenance
type: intersection
domain: finance
method: waterfall
phase: maintenance
title: 金融・経理 × 運用（規程・制度の運用）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 経理の「運用」は締め・支払・報告の定型ループ。AI は[規程Q&A](/domains/finance/use-cases/policy-qa.md)と[月次レポート](/domains/finance/use-cases/monthly-report.md)で定型業務を吸収し、人間は差異分析と解釈に集中する
- 制度改正（税制・経費規程）の反映漏れチェックも、改正情報と規程の差分整理として AI 補助の対象

## この領域特有の注意

- 運用手順の変更は監査記録とセット。AI の導入自体も「谁が何を確認したか」記録される業務として設計する
- 数値の入力は常にシステムから（[金融・経理の制約](/domains/finance/)）。運用の中で「手入力の数値」を増やさない
