---
id: glossary
type: reference
title: 用語集
summary: PDE で使う用語の最小セット。初めての人はここから
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

PDE のコンテンツを読むために必要な用語をまとめました。詳しい解説は各パターン・ガイドのページへ。

## 基本用語

**PDE（Prompt-Driven Engineering）**
業務と開発のあらゆる場面を「人 × AI の協働」として設計する方法論。このリポジトリ全体のテーマ。（[PDE とは](/guide/what-is-pde)）

**プロンプト**
AI に渡す指示・入力のこと。役割・入力・指示・出力の型の 4 部品で設計する（[STEP 3](/guide/step-3-build-the-loop)）。

**役割分担表**
業務を「人間 / AI / 禁止」に分類した表。判断権の所在を明示する（[STEP 2](/guide/step-2-define-roles)）。

**受け入れ基準（AC: Acceptance Criteria）**
AI の成果物を「OK」とする条件のリスト。検査可能な形で書く（[STEP 4](/guide/step-4-acceptance)）。

**ルーブリック**
評価の採点基準表。教育領域では採点の一貫性を保つ土台。

**交点ノート**
「領域 × 工程」の組み合わせごとに書かれた専用ノート。マトリクスのセルから読める。

## AI 技術用語

**LLM（大規模言語モデル）**
文章の生成・要約・分類などを行う AI の中核技術。

**ハルシネーション**
AI がもっともらしい誤情報を生成すること。出典必須化などで構造的に防ぐ（[評価](/patterns/evaluation)）。

**RAG（検索拡張生成）**
手持ちの文書を検索してから回答を生成させるパターン。出典付き回答の基本形。（[RAG](/patterns/rag)）

**エージェント**
目標を渡すと AI 自らが計画・ツール実行・反復を行う使い方。（[Agent](/patterns/agent)）

**構造化出力**
自由文ではなく JSON 等の決まった形式で出力させること。検証・集計が可能になる。（[構造化出力](/patterns/structured-output)）

**Few-shot**
良い出力例をいくつか見せて、形式やトーンを揃せる方法。（[Few-shot](/patterns/few-shot)）

**コンテキストウィンドウ**
AI が一度に読めるテキストの上限。長い文書は分割して渡す（[プロンプト連鎖](/patterns/prompt-chaining)）。

**Fine-tuning（ファインチューニング）**
モデル自体を追加学習で調整すること。PDE ではまずプロンプト設計で対応し、最後の手段と位置づける。

## 開発工程用語

**ウォーターフォール**
要件 → 設計 → 実装 → テスト → リリース → 運用と順に進める開発手法。（[工程一覧](/process)）

**アジャイル / スクラム**
短いサイクルで計画・実装・レビューを繰り返す開発手法。スプリント（1〜2 週間の反復単位）で回す。

**スプリントプランニング**
スプリントの開始時に、期間のゴールと作業内容を決める会議。（[スプリントプランニング](/process/agile/sprint-planning)）

**バックログ / リファインメント**
やるべき作業の一覧と、それを磨いて実行可能にする活動。（[リファインメント](/process/agile/backlog-refinement.md)）

**レトロスペクティブ**
スプリント終了時の振り返り。改善アクションを 1〜3 個に絞る。（[レトロスペクティブ](/process/agile/retrospective)）

**ベロシティ**
チームが 1 スプリントでこなせる量の実績値。見積もりの基準。

## 品質と運用

**Human-in-the-loop**
AI の自動処理に、人間が判断する地点（チェックポイント）を意図的に設けること。（[HITL](/patterns/human-in-the-loop)）

**ガードレール**
AI の出力が基準を下回ったら止める自動チェック。（[評価](/patterns/evaluation)）

**Self-check**
人間のレビュー前に、AI 自身に受け入れ基準で点検させるループ。（[Self-check](/patterns/self-check)）

**匿名化 / 仮番号化**
人名・顧客名などを番号に置き換えてから AI に入力すること。（[機密情報の持ち込みルール](/patterns/confidential-inputs)）

**SSG（静的サイト生成）**
ビルド時に HTML を作っておく方式。このサイトは SSG で GitHub Pages に配信している。

**PWA（Progressive Web App）**
ブラウザからインストールでき、オフラインでも動く Web アプリの形態。このサイトも PWA。
