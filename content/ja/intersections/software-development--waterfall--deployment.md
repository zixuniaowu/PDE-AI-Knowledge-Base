---
id: software-development--waterfall--deployment
type: intersection
domain: software-development
method: waterfall
phase: deployment
title: ソフトウェア開発 × リリース（客先テナントへのリリース）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-13
---

## この交点の要点

- 顧客案件のリリースは**客先テナント内へのデプロイ**: 顧客アカウントの IAM・ネットワーク・コスト上限は顧客側権限が必要。作業日・担当者・手順を事前に確定する
- セキュリティ審査の承認書類（データフロー図・権限表）が本番化の直前関門。設計工程から準備する

## この領域特有の注意

- 切戻しは顧客側権限も使う。リハーサルを顧客環境で 1 回実施してから本番に臨む
- リリース後の利用者研修とフィードバック導線までセットで提供する（現場定着が FDE の成果指標）
