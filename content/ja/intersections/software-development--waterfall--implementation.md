---
id: software-development--waterfall--implementation
type: intersection
domain: software-development
method: waterfall
phase: implementation
title: ソフトウェア開発 × 実装
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- ウォーターフォールの実装では「設計書 → コード」の対応が重要。AI に設計書を渡して実装たたき台（[実装下書き](/domains/software-development/use-cases/implementation-draft.md)）を作らせると、**設計とコードのズレそのものが検出可能**になる
- 逆に AI が設計を無視した「動く別解」を出すので、設計書の該当箇所を明示して渡すのがコツ

## この領域特有の注意

- 設計書が古い場合、AI は古い設計どおりに実装する。設計の鮮度管理が品質を決める
- 実装の判断履歴（なぜこの実装か）は AI に説明文を生成させ設計書側に記録し、後工程のテスト・保守で再利用する
