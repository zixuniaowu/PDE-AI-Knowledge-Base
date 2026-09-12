---
id: sales--waterfall--requirements
type: intersection
domain: sales
method: waterfall
phase: requirements
title: 営業 × 要件定義（顧客課題のヒアリング）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 提案の「要件定義」= 顧客の課題・予算・意思決定者の把握。AI が商談メモから「分かったこと / 分かっていないこと」を分離し、**次回の確認質問リスト**を作る
- 「顧客が本当に困っていること」と「顧客が言ってきたこと」の差は営業の読み。AI は読みの材料をそろえるだけ（[提案書ドラフト](/domains/sales/use-cases/proposal-drafting.md)の入力品質を決める工程）

## この領域特有の注意

- 顧客情報を AI に入れる前に匿名化（[機密情報の持ち込みルール](/patterns/confidential-inputs)）。ヒアリングメモの取り扱い規程を先に決める
- 予算・競合情報などの機微な項目は、要件一覧に「未確認」として明示し、無理に埋めない
