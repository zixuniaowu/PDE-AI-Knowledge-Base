# FDE — Forward Deployed Engineer Knowledge Base

[![CI](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/ci.yml/badge.svg)](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/ci.yml)
[![Deploy](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/deploy.yml/badge.svg)](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/actions/workflows/deploy.yml)
![License](https://img.shields.io/badge/license-MIT%20%2B%20CC--BY%204.0-blue)

> **FDE（Forward Deployed Engineer／前沿部署エンジニア）** は、顧客・事業部の現場に入り、AI を実際の業務に組み込み、**成果指標が動く状態まで責任を持つエンジニア**。アルゴリズムエンジニアは業務を知らず、業務の専門家は AI を知らない——この断絶を埋める、企業の AI 導入で最も不足している役割です（国内フリーランス案件 147 件・単価 51〜200 万円/月、2026-09 時点）。

> 中国語での概要（作者の備忘）: 这是一个让人胜任 **FDE（Forward Deployed Engineer，前沿部署工程师）** 的实践知识库——驻入客户/业务现场，把 AI 真正组合进业务流程，对"成果指标动起来"负责。两个轴：行业 AI 落地打法 × 开发工程流程（每阶段人与 AI 工具的配合）。仓库名 PDE 是历史遗留，站点身份以 FDE 为准。

このナレッジベースは、FDE として働く人・なろうとする人・FDE を採用する組織のために、実践知を 2 つの軸で整理します:

- **[工程（process）](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/process/)**: ウォーターフォール / アジャイルの各工程を、FDE が AI ツールとどう回すか（実プロンプト・実ツール構成付き）
- **[領域（domain）](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/domains/)**: 業界（教育・医療・製造・法務…）ごとの AI 導入実戦知識

さらに [パターン](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/patterns/)（RAG・Agent・Few-shot などの実装型）、[始め方ガイド](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/guide/)、[プロンプト小技集](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/references/prompt-tips/)、[市場需要分析](https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/references/market-demand/)を収録しています。

## ライブデモ

`main` への push で GitHub Pages に自動デプロイされます:
**https://zixuniaowu.github.io/PDE-AI-Knowledge-Base/**

## リポジトリ構成

```
.
├── content/{locale}/        # ★ コンテンツ本体（Markdown + frontmatter）
│   ├── guide/               #    FDE の始め方（ステップガイド）
│   ├── domains/<id>/        #    領域ごとの実戦知識（meta.json + index.md + use-cases/）
│   ├── process/             #    工程（waterfall/ agile/ の各フェーズ）
│   ├── patterns/            #    実装パターン（RAG, Agent, Few-shot…）
│   ├── intersections/       #    領域 × 工程 の交点ノート
│   └── references/          #    用語集 / 小技集 / 市場需要 / クラウド連携 / 業務プロセス / コスト見積 / PoC 合意書
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

## FDE・領域の専門家として参加するには

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
- [x] v0.4 **FDE（Forward Deployed Engineer）視点への全面刷新**: 定義・工程 11 フェーズ・ガイド・用語集
- [ ] v0.5 領域ユースケースの FDE 視点化（実ツール構成の追記）、交点ノートの拡充
- [ ] v0.6 多言語（en / zh）、モバイルアプリの正式リリース（EAS）

## ライセンス

- コード: MIT
- コンテンツ（`content/`, `docs/`）: CC BY 4.0

あなたの FDE 実践の知見を、ぜひここに残してください。
