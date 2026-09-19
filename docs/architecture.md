# アーキテクチャと拡張モデル

FDE を「巨大でも維持できる」プロジェクトにするための基盤設計です。

## 1. 基本原則: Content as Data

```
content/{locale}/**/*.md  ──▶  @pde/content-core（読込 + Zod検証）
        │                              │
        ▼                              ▼
   apps/web (Next.js)            apps/mobile (Expo)
   「レンダラー」                  「レンダラー」
```

- コンテンツは **Markdown + frontmatter**。サイトもアプリも、このデータを読むだけのビュー
- スキーマ違反は CI で落ちる → 壊れたコンテンツはマージされない
- 専門家は Markdown だけで貢献でき、ビルドを壊せない

## 2. 拡張の単位（すべてコード変更なし）

| 拡張したいこと | やること |
|---|---|
| 領域を追加 | `content/ja/domains/_template/` をコピー → PR → CODEOWNERS にオーナー追加 |
| 領域にユースケース追加 | その領域の `use-cases/` に md 追加 |
| 工程を追加 | `content/ja/process/<method>/<phase>.md` を追加 |
| AI パターンを追加 | `content/ja/patterns/<id>.md` を追加 |
| 手法（dev手法）を追加 | `content/ja/process/<新method>/` ディレクトリ追加（web は自動認識） |
| 言語を追加 | `content/ja/` の sibling に `content/en/` 等を追加 |
| スキーマを拡張 | `packages/content-core/src/schema.ts` を変更（RFC 必須・後方互換に注意） |

## 3. ディレクトリ契約

```
content/{locale}/
├── domains/
│   ├── _template/              # 必須: 新領域のひな形（CI が存在を検証）
│   │   ├── meta.json
│   │   ├── index.md
│   │   └── use-cases/_template.md
│   └── <domain-id>/            # id は kebab-case・不変（URL の一部）
│       ├── meta.json           # 領域メタデータ（Zod: domainMetaSchema）
│       ├── index.md            # 領域概要
│       └── use-cases/<id>.md   # ユースケース（frontmatter で領域と紐付け）
├── process/
│   ├── _template.md
│   └── <method>/<phase-id>.md  # method = waterfall | agile | ...
└── patterns/<id>.md            # 横断 AI パターン
```

- `_` で始まるディレクトリ/ファイルはテンプレート扱い（サイトに表示されない）
- id（ディレクトリ名・frontmatter の id）は作成後変更禁止。リネームは RFC

## 4. マトリクスモデル

- **領域軸**: domains、**工程軸**: process
- 各セルは「交点ページ」(`/matrix/{domain}/{method}/{phase}`) にリンクされる。交点ページは工程の「FDEの仕事 / AIツールの使いどころ」+ `phaseLinks` で紐づくその領域のユースケースを合成して表示する
- 専用コンテンツが無い交点には「あなたが最初の 1 ページを書く」導線を出す（投稿の入口）
- 新しい工程や領域を追加すると、交点ページは自動生成される

## 5. アプリ側

| アプリ | 技術 | データ取得 |
|---|---|---|
| apps/web | Next.js 14 (App Router, 静的エクスポート) | ビルド時に content-core で直読み → 静的生成。GitHub Pages に自動デプロイ |
| apps/mobile | Expo | `pnpm build:mobile-content` が生成する JSON をバンドル |

- Web は静的エクスポートなのでホスティングは任意の静的 CDN。basePath は `FDE_BASE_PATH` で制御
- PWA: service worker によるオフライン閲覧（ページは network-first、静的アセットは cache-first）
- モバイルは JSON 経由にすることで、コードからコンテンツを完全に分離

## 6. 品質とスケールの仕組み

1. **スキーマ検証**（CI）: 構文レベルの品質は機械が保証
2. **CODEOWNERS**: 内容の正しさは領域オーナーが保証
3. **status ライフサイクル**: draft → reviewed → approved で成熟度を可視化
4. **RFC**: 基盤を変える提案は [docs/rfc](./rfc/) で合意形成してから実装
5. **テンプレート検証**: `_template` が消えると新規参入の入口が失われるため、CI が存在チェック

## 7. 将来の拡張オプション（今はやらない）

- 全文検索: Pagefind / FlexSearch（静的生成と相性が良い）
- 交差ページ: 領域 × 工程ごとの専用コンテンツ
- 多言語同期: 翻訳 status のトラッキング
- LLM 消費用 API: コンテンツ JSON の公开エンドポイント（MCP サーバー化）
