---
id: healthcare--waterfall--testing
type: intersection
domain: healthcare
method: waterfall
phase: testing
title: 医療・看護 × テスト（医療安全チェック）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 医療の「テスト」はダブルチェック・手順遵守確認・医療安全監査。AI は**記録と手順の整合チェック**（手順書どおりに記録されているか、記入漏れはないか）を支援する
- 与薬・処置のダブルチェックそのものは人間 × 人間。AI を挟まない運用を明文化する

## この領域特有の注意

- チェック結果の記録は監査対象。「AI が点検し、誰が確認したか」を残す（[機密情報の持ち込みルール](/patterns/confidential-inputs)とセット）
- インシデントの傾向分析（[医療 × 運用](./healthcare--waterfall--maintenance.md)）と接続し、チェック項目自体を改善し続ける
