---
id: manufacturing--waterfall--design
type: intersection
domain: manufacturing
method: waterfall
phase: design
title: 製造 × 設計（生産方式と AI の設計）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-13
---

## この交点の要点

- 生産設計（工程設計・標準時間・品質基準）に AI を入れる場所は「文書周り」: QC 工程表・作業標準書・検査基準書のドラフト生成と様式統一
- 4M（人・設備・方法・材料）の変更管理と AI 文書改訂を接続する。変更があれば手順書・検査記録・沿革が動く

## この領域特有の注意

- 安全手順・停止条件は AI に生成させない（人間が記入、安全衛生管理者が承認）
- 過去品質データの検索（RAG）は、文書が紙・スキャン前提なら OCR 前処理の設計から始める
