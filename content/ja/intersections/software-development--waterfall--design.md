---
id: software-development--waterfall--design
type: intersection
domain: software-development
method: waterfall
phase: design
title: ソフトウェア開発 × 設計（AI ネイティブな構成）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-13
---

## この交点の要点

- 顧客の既存クラウド（AWS / Azure / GCP）に寄せた構成を最初に決める。マネージド AI（Bedrock Knowledge Bases / AI Search / Vertex AI Search）で PoC 規模なら足りる（[クラウド別マップ](/references/cloud-ai-services)）
- AI の出力は不確実。設計段階で「修正 / 再生成 / 部分採用」の UI 動線と、精度の評価設計（[評価](/patterns/evaluation)）を含める

## この領域特有の注意

- セキュリティ審査資料（データフロー図・権限表・外部送信の有無）を設計書と同時に AI にドラフトさせ、審査の回転を速くする
- モデル選定は「性能」だけでなく**リージョン対応・EOL ポリシー・単価**で比較する
