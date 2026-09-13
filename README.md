# PDE — Product Design Engineer Knowledge Base

[![CI](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/ci.yml/badge.svg)](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/ci.yml)
[![Deploy](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/deploy.yml/badge.svg)](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/deploy.yml)
![License](https://img.shields.io/badge/license-MIT%20%2B%20CC--BY%204.0-blue)

> **PDE（Product Design Engineer）** は、製品の課題を考え、インタラクションを設計し、プロダクションコードを自分で書ける人。Claude Code / Cursor / v0 / Figma Make といった AI ツールの進化で、伝統的な「PM → デザイナー → エンジニア」の分業を一人で担えるようになった、いま最も需要が伸びている職種です。

> 中国語での概要（作者の備忘）: 这是一个让人胜任 **PDE（Product Design Engineer，产品设计工程师）** 的实践知识库——用 AI 工具链独立完成「找问题 → 画流程 → 做交互 → 写代码 → 上线 → 看反馈」的完整产品体验。两个轴：行业落地打法 × 开发工程流程。

このナレッジベースは、PDE として働く人・なろうとする人・チームで採用する組織のために、実践知を 2 つの軸で整理します:

- **[工程（process）](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/process/)**: ウォーターフォール / アジャイルの各工程を、PDE が AI ツールとどう回すか（実プロンプト・実ツール構成付き）
- **[領域（domain）](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/domains/)**: 業界（教育・医療・製造・法務…）ごとの AI プロダクト実戦知識

さらに [パターン](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/patterns/)（RAG・Agent・Few-shot などの実装型）、[始め方ガイド](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/guide/)、[プロンプト小技集](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/references/prompt-tips/)を収録しています。

## ライブデモ

`main` への push で GitHub Pages に自動デプロイされます:
**https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/**

## リポジトリ構成

```
.
├── content/{locale}/        # ★ コンテンツ本体（Markdown + frontmatter）
│   ├── guide/               #    PDE の始め方（ステップガイド）
│   ├── domains/<id>/        #    領域ごとの実戦知識（meta.json + index.md + use-cases/）
│   ├── process/             #    工程（waterfall/ agile/ の各フェーズ）
│   ├── patterns/            #    実装パターン（RAG, Agent, Few-shot…）
│   ├── intersections/       #    領域 × 工程 の交点ノート
│   └── references/          #    用語集 / プロンプト小技集
├── packages/content-core/   # コンテンツ読み込み・バリデーション共通ライブラリ
├── apps/web/                # Next.js 製 Webサイト（静的エクスポート + PWA）
├── apps/mobile/             # Expo 製モバイルアプリ
├── scripts/                 # 検証 / インデックス・RSS・llms.txt 生成
├── e2e/                     # Playwright E2E テスト
├── docs/                    # アーキテクチャ、コンテンツモデル、RFC
└── .github/                 # CODEOWNERS / テンプレート / CI / デプロイ
```

## クイックスタート

```bash
pnpm install
pnpm dev                 # Webサイト起動 (http://localhost:3000)
pnpm validate:content    # コンテンツのスキーマ検証
pnpm test                # content-core のユニットテスト
pnpm test:e2e            # Playwright E2E（ビルド → 実ブラウザで検証）
pnpm build:mobile-content  # モバイル用JSON / 検索インデックス / RSS / llms.txt を生成
```

## テスト

品質は 3 層で自動検証されます（CI で実行）:

1. **コンテンツ検証**: frontmatter のスキーマ・参照整合（リンク先の存在）・テンプレートの存在
2. **ユニットテスト**: スキーマの挙動と、実際のコンテンツに対する整合チェック
3. **E2E（Playwright）**: ビルド済みサイトを実ブラウザで操作し、全ページ種別の描画・ナビゲーション・検索・404・RSS/llms.txt を検証。主要ページからの内部リンクを全件クロールします。`E2E_BASE_URL` で本番環境への実行も可能

## PDE・領域の専門家として参加するには

コードは書けなくて大丈夫。すべてのコンテンツは Markdown です。

1. [CONTRIBUTING.md](./CONTRIBUTING.md) を読む
2. テンプレートをコピーして自分の領域・自分の工程の知見を追加
3. PR を出す → その領域の CODEOWNERS がレビューします

新しい領域の提案は [Issue テンプレート](./.github/ISSUE_TEMPLATE/)、設計変更は [RFC プロセス](./docs/rfc/) を利用します。

## 設計思想（拡張モデル）

詳細は [docs/architecture.md](./docs/architecture.md) 参照。

- **Content as Data**: コンテンツは Markdown + frontmatter。Web も Mobile も同じデータを読む「レンダラー」
- **追加はコピーで**: 領域/工程/パターンの追加はテンプレートコピー + PR だけ。コード変更不要
- **静的ファースト**: SSG で GitHub Pages に自動デプロイ。検索はクライアントサイド、PWA でオフライン閲覧可
- **スケールするレビュー**: 領域ごとの CODEOWNERS で、各専門家が自分の領域の品質を守る
- **テストで守る**: スキーマ・参照整合・E2E の 3 層を CI で強制

## ロードマップ

- [x] v0.1 基盤: monorepo / コンテンツモデル / Web / Mobile 骨子 / CI / コントリビューション体制
- [x] v0.2 コンテンツ拡充 / 全文検索 / 交点ページ / 自動デプロイ / ユニットテスト
- [x] v0.3 領域 10 件・パターン 9 件・RSS・llms.txt・E2E
- [x] v0.4 **PDE（Product Design Engineer）視点への全面刷新**: 定義・工程 11 フェーズ・ガイド・用語集
- [ ] v0.5 領域ユースケースの PDE 視点化（実ツール構成の追記）、交点ノートの拡充
- [ ] v0.6 多言語（en / zh）、モバイルアプリの正式リリース（EAS）

## ライセンス

- コード: MIT
- コンテンツ（`content/`, `docs/`）: CC BY 4.0

あなたの PDE 実践の知見を、ぜひここに残してください。
