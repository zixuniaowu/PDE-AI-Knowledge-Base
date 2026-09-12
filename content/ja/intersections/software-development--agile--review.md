---
id: software-development--agile--review
type: intersection
domain: software-development
method: agile
phase: review
title: ソフトウェア開発 × レビュー（PR レビュー）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- レビューは AI 補助が最も進んでいる交点（[PR レビュー支援](/domains/software-development/use-cases/pr-review-assistant.md)）。規約系の指摘を AI に任せ、人間は**設計・業務適合・保守性**の判断に専念する
- 「AI 指摘への返信」も AI が下書きできるが、採否と理由の記録は人間が行う

## この領域特有の注意

- 生成コードの PR は、人間が書いたコードより「レビューアーが理解していない行」が増えがち。理解できない行には `?` コメントを付け、マージ前に解消するルールを推奨
- セキュリティに関わる差分（認可・入力処理・依存追加）は AI 指摘があっても人間の 2 次確認を必須にする
