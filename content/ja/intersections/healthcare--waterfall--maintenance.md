---
id: healthcare--waterfall--maintenance
type: intersection
domain: healthcare
method: waterfall
phase: maintenance
title: 医療・看護 × 運用（記録と報告の運用）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 医療の「運用」の主体は記録（[看護記録](/domains/healthcare/use-cases/nursing-record.md)）とインシデント報告のループ。AI は報告の分類・傾向整理で医療安全委員会の資料作成時間を大幅に削る
- 引き継ぎ・カンファレンス資料の整備も定型的な整理業務として AI 補助の対象

## この領域特有の注意

- 記録・報告には要配慮個人情報が含まれる。AI 環境は院内規程で許可されたものに限定し、匿名化・仮番号化を運用の前提にする
- 傾向分析の結果（例: 転倒リスクの高い時間帯）は看護判断の材料であり、自動アラートとして独立運用しない
