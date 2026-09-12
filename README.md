# PDE — Prompt-Driven Engineering Knowledge Base

**PDE（Prompt-Driven Engineering / プロンプト駆動エンジニアリング）** は、あらゆる業務領域・開発プロセスに AI をどう組み込むかを体系的にまとめる、オープンな実践ナレッジベースです。

> 中国語での概要（作者の備忘）: 各領域のビジネスと AI の融合、ウォーターフォール/アジャイル各工程における「人 × AI」の協働方法を、ドメイン専門家が共同で育てていくリソース集。

## コンセプト: 2つの軸が交わるマトリクス

PDE の情報は「**領域 × 工程**」のマトリクスで整理されます。

```
                 ┌─────────────────────── 工程軸 ───────────────────────┐
                 │  ウォーターフォール: 要件定義→設計→実装→テスト→運用    │
                 │  アジャイル: プランニング→実装→レビュー→レトロスペクティブ│
 ┌──── 領域軸 ───┼──────────────────────────────────────────────────────┤
 │ 教育          │  教育の要件定義では 人は○○ / AIは○○ ...               │
 │ 医療          │  ...                                                 │
 │ 金融          │  ...                                                 │
 │ 製造          │  ...                                                 │
 │ (あなたの領域) │  ← テンプレートをコピーして追加できる                  │
 └───────────────┴──────────────────────────────────────────────────────┘
```

- **領域軸（domains）**: その領域の業務に AI をどう導入するか（ユースケース、適用パターン、失敗例）
- **工程軸（process）**: ウォーターフォール/アジャイルの各工程で、**人間の役割 / AI の役割 / 協働の進め方 / 成果物の受け入れ基準**
- **横断パターン（patterns）**: RAG、Agent、Human-in-the-loop など、領域に依存しない AI 活用パターンの解説

## リポジトリ構成

```
.
├── content/{locale}/        # ★ コンテンツ本体（Markdown + frontmatter）
│   ├── guide/               #    PDE の始め方（ステップバイステップガイド）
│   ├── domains/<id>/        #    領域ごとのディレクトリ（meta.json + index.md + use-cases/）
│   ├── process/             #    工程（waterfall/ agile/ の各フェーズ md）
│   └── patterns/            #    横断AIパターン
├── schemas/                 # コンテンツスキーマ（人間向けリファレンス）
├── packages/content-core/   # コンテンツ読み込み・バリデーション共通ライブラリ
├── apps/web/                # Next.js 製 Webサイト（レスポンシブ + PWA）
├── apps/mobile/             # Expo 製モバイルアプリ
├── scripts/                 # コンテンツ検証 / モバイル用JSON生成
├── docs/                    # アーキテクチャ、コンテンツモデル、RFC
└── .github/                 # CODEOWNERS / Issue・PRテンプレート / CI
```

## クイックスタート

```bash
pnpm install
pnpm dev                 # Webサイト起動 (http://localhost:3000)
pnpm validate:content    # コンテンツのスキーマ検証
pnpm build:mobile-content  # モバイルアプリ用 JSON を生成
```

## 領域の専門家として参加するには

コードは書けなくて大丈夫です。すべてのコンテンツは Markdown です。

1. [CONTRIBUTING.md](./CONTRIBUTING.md) を読む
2. `content/ja/domains/_template/` をコピーして自分の領域を追加、または既存コンテンツを改善
3. PR を出す → その領域の CODEOWNERS がレビューします

新しい領域・改善提案は [Issue テンプレート](./.github/ISSUE_TEMPLATE/) からどうぞ。
設計レベルの変更は [RFC プロセス](./docs/rfc/) を利用します。

## 設計思想（拡張モデル）

詳細は [docs/architecture.md](./docs/architecture.md) 参照。

- **Content as Data**: コンテンツは Markdown + frontmatter で、スキーマ検証されます。Web も Mobile も同じデータを読む「レンダラー」にすぎません
- **追加はコピーで**: 領域/工程/パターンの追加はテンプレートコピー + PR だけ。コード変更は不要
- **多言語ready**: `content/ja/` の sibling として `content/en/` `content/zh/` を追加するだけで多言語化できます
- **スケールするレビュー**: 領域ごとの CODEOWNERS で、各専門家が自分の領域の品質を守ります

## ロードマップ

- [x] v0.1 基盤: monorepo / コンテンツモデル / Web / Mobile 骨子 / CI / コントリビューション体制
- [ ] v0.2 領域 10 件・工程 10 件のコンテンツ充実、全文検索
- [ ] v0.3 領域×工程の交差ページ（マトリクスの各セルに専用コンテンツ）
- [ ] v0.4 多言語（en / zh）、モバイルアプリ正式リリース

## ライセンス

- コード: MIT
- コンテンツ（`content/`, `docs/`）: CC BY 4.0

あなたの領域の知見を、ぜひここに残してください。
